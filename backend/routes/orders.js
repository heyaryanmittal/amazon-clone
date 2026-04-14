const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.use(authenticateToken);

// GET /api/orders - Get user's order history
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [orders] = await db.query(`
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.placed_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), offset]);

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [userId]
    );

    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - Get single order details
router.get('/:orderId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE (order_id = ? OR id = ?) AND user_id = ?',
      [orderId, orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    res.json({ order, items });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders - Place a new order
router.post('/', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

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
      payment_method = 'cod',
      notes = ''
    } = req.body;

    // Validate required fields
    if (!shipping_name || !shipping_phone || !shipping_address_line1 || !shipping_city || !shipping_state || !shipping_pincode) {
      await conn.rollback();
      return res.status(400).json({ error: 'All shipping fields are required' });
    }

    // Get cart items
    const [cartItems] = await conn.query(`
      SELECT 
        c.quantity,
        p.id as product_id,
        p.name as product_name,
        p.price,
        p.stock,
        pi.image_url as product_image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE c.user_id = ? AND p.is_active = TRUE
    `, [userId]);

    if (!cartItems.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await conn.rollback();
        return res.status(400).json({ 
          error: `Insufficient stock for "${item.product_name}". Available: ${item.stock}` 
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingAmount = subtotal > 499 ? 0 : 40;
    const taxAmount = parseFloat((subtotal * 0.18).toFixed(2)); // 18% GST
    const totalAmount = parseFloat((subtotal + shippingAmount + taxAmount).toFixed(2));

    // Generate order ID
    const orderId = `AMZ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order
    const [orderResult] = await conn.query(`
      INSERT INTO orders (
        order_id, user_id, subtotal, shipping_amount, tax_amount, total_amount,
        status, payment_method, payment_status,
        shipping_name, shipping_phone, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_pincode, shipping_country, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, userId, subtotal.toFixed(2), shippingAmount, taxAmount, totalAmount,
      payment_method,
      shipping_name, shipping_phone, shipping_address_line1, shipping_address_line2,
      shipping_city, shipping_state, shipping_pincode, shipping_country, notes
    ]);

    const dbOrderId = orderResult.insertId;

    // Create order items and update stock
    for (const item of cartItems) {
      await conn.query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        dbOrderId, item.product_id, item.product_name, item.product_image,
        item.quantity, item.price, (item.price * item.quantity).toFixed(2)
      ]);

      // Reduce stock
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear user's cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    await conn.commit();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: dbOrderId,
        order_id: orderId,
        total_amount: totalAmount,
        subtotal: subtotal.toFixed(2),
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        status: 'confirmed',
        payment_method,
        placed_at: new Date().toISOString(),
        shipping_name,
        shipping_city,
        items_count: cartItems.length
      }
    });
  } catch (error) {
    await conn.rollback();
    console.error('Place order error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    conn.release();
  }
});

// PUT /api/orders/:orderId/cancel - Cancel an order
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE (order_id = ? OR id = ?) AND user_id = ?',
      [orderId, orderId, userId]
    );

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    await db.query(
      'UPDATE orders SET status = "cancelled" WHERE id = ?',
      [order.id]
    );

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
