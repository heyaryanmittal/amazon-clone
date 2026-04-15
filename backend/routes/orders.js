const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          _count: { select: { items: true } }
        },
        orderBy: { placedAt: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.order.count({ where: { userId } })
    ]);

    const result = orders.map(o => ({
      ...o,
      order_id:    o.orderId,
      total_amount: parseFloat(o.totalAmount),
      shipping_amount: parseFloat(o.shippingAmount),
      tax_amount: parseFloat(o.taxAmount),
      placed_at:   o.placedAt,
      item_count:  o._count.items,
      _count: undefined
    }));

    res.json({
      orders: result,
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId
router.get('/:orderId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    // Try matching by string orderId or numeric id
    const numericId = parseInt(orderId);
    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [
          { orderId: orderId },
          ...(isNaN(numericId) ? [] : [{ id: numericId }])
        ]
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id }
    });

    res.json({ order, items });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders – place order (transactional)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shipping_name,
      shipping_phone,
      shipping_address_line1,
      shipping_address_line2 = '',
      shipping_city,
      shipping_state,
      shipping_pincode,
      shipping_country = 'India',
      payment_method   = 'cod',
      notes            = ''
    } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address_line1 ||
        !shipping_city  || !shipping_state || !shipping_pincode) {
      return res.status(400).json({ error: 'All shipping fields are required' });
    }

    // Use Prisma interactive transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get cart items with product info + primary image
      const cartItems = await tx.cart.findMany({
        where: {
          userId,
          product: { isActive: true }
        },
        include: {
          product: {
            select: {
              id: true, name: true, price: true, stock: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { imageUrl: true }
              }
            }
          }
        }
      });

      if (!cartItems.length) {
        throw new Error('CART_EMPTY');
      }

      // Validate stock
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${item.product.name}:${item.product.stock}`);
        }
      }

      // Calculate totals
      const subtotal       = cartItems.reduce((s, i) => s + (parseFloat(i.product.price) * i.quantity), 0);
      const shippingAmount = subtotal > 499 ? 0 : 40;
      const taxAmount      = parseFloat((subtotal * 0.18).toFixed(2));
      const totalAmount    = parseFloat((subtotal + shippingAmount + taxAmount).toFixed(2));

      const orderId = `AMZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create order with items in one go
      const order = await tx.order.create({
        data: {
          orderId,
          userId,
          subtotal,
          shippingAmount,
          taxAmount,
          totalAmount,
          status:         'confirmed',
          paymentMethod:  payment_method,
          paymentStatus:  'pending',
          shippingName:         shipping_name,
          shippingPhone:        shipping_phone,
          shippingAddressLine1: shipping_address_line1,
          shippingAddressLine2: shipping_address_line2,
          shippingCity:         shipping_city,
          shippingState:        shipping_state,
          shippingPincode:      shipping_pincode,
          shippingCountry:      shipping_country,
          notes,
          items: {
            create: cartItems.map(i => ({
              productId:    i.product.id,
              productName:  i.product.name,
              productImage: i.product.images[0]?.imageUrl || null,
              quantity:     i.quantity,
              price:        i.product.price,
              totalPrice:   parseFloat(i.product.price) * i.quantity
            }))
          }
        }
      });

      // Reduce stock for each product
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear cart
      await tx.cart.deleteMany({ where: { userId } });

      return {
        order,
        subtotal,
        shippingAmount,
        taxAmount,
        totalAmount,
        orderId,
        itemsCount: cartItems.length
      };
    });

    console.log('\n' + '='.repeat(50));
    console.log('📧 MOCK EMAIL NOTIFICATION');
    console.log(`To: ${shipping_name}`);
    console.log(`Order: ${result.orderId}  |  Total: ₹${result.totalAmount.toLocaleString()}`);
    console.log('='.repeat(50) + '\n');

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id:              result.order.id,
        order_id:        result.orderId,
        total_amount:    result.totalAmount,
        subtotal:        result.subtotal.toFixed(2),
        shipping_amount: result.shippingAmount,
        tax_amount:      result.taxAmount,
        status:          'confirmed',
        payment_method,
        placed_at:       new Date().toISOString(),
        shipping_name,
        shipping_city,
        items_count:     result.itemsCount
      }
    });
  } catch (error) {
    if (error.message === 'CART_EMPTY') {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
      const [, name, stock] = error.message.split(':');
      return res.status(400).json({
        error: `Insufficient stock for "${name}". Available: ${stock}`
      });
    }
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// PUT /api/orders/:orderId/cancel
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const numericId = parseInt(orderId);

    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [
          { orderId: orderId },
          ...(isNaN(numericId) ? [] : [{ id: numericId }])
        ]
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'cancelled' }
    });

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
