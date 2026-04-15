const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Helper to fetch cart state
const getCartState = async (userId) => {
  const cartItems = await prisma.cart.findMany({
    where: {
      userId,
      product: { isActive: true }
    },
    include: {
      product: {
        select: {
          id: true, name: true, slug: true, price: true,
          originalPrice: true, stock: true, isPrime: true, brand: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { imageUrl: true }
          }
        }
      }
    },
    orderBy: { addedAt: 'desc' }
  });

  const items = cartItems.map(c => ({
    cart_id:        c.id,
    quantity:       c.quantity,
    added_at:       c.addedAt,
    product_id:     c.product.id,
    name:           c.product.name,
    slug:           c.product.slug,
    price:          parseFloat(c.product.price),
    original_price: c.product.originalPrice ? parseFloat(c.product.originalPrice) : null,
    stock:          c.product.stock,
    is_prime:       c.product.isPrime,
    brand:          c.product.brand,
    image:          c.product.images[0]?.imageUrl || null
  }));

  const subtotal   = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    summary: {
      subtotal:   parseFloat(subtotal.toFixed(2)),
      shipping:   subtotal > 499 || subtotal === 0 ? 0 : 40,
      total:      parseFloat((subtotal + (subtotal > 499 || subtotal === 0 ? 0 : 40)).toFixed(2)),
      totalItems
    }
  };
};

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const cartState = await getCartState(userId);
    res.json(cartState);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart – add item
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findFirst({
      where: { id: product_id, isActive: true },
      select: { id: true, stock: true, name: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Upsert: create or increment
    await prisma.cart.upsert({
      where: {
        userId_productId: { userId, productId: product_id }
      },
      create: {
        userId,
        productId: product_id,
        quantity
      },
      update: {
        quantity: { increment: quantity }
      }
    });

    const cartState = await getCartState(userId);
    res.json({ 
      message: 'Product added to cart successfully', 
      product_name: product.name,
      ...cartState
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:cartId – update quantity
router.put('/:cartId', async (req, res) => {
  try {
    const userId   = req.user.id;
    const cartId   = parseInt(req.params.cartId);
    const { quantity } = req.body;

    if (!quantity || quantity < 1)  return res.status(400).json({ error: 'Quantity must be at least 1' });
    if (quantity > 10)              return res.status(400).json({ error: 'Maximum quantity is 10' });

    const existing = await prisma.cart.findFirst({
      where: { id: cartId, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: { quantity }
    });

    const cartState = await getCartState(userId);
    res.json(cartState);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:cartId – remove item
router.delete('/:cartId', async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = parseInt(req.params.cartId);

    const existing = await prisma.cart.findFirst({
      where: { id: cartId, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cart.delete({ where: { id: cartId } });
    
    const cartState = await getCartState(userId);
    res.json(cartState);
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// DELETE /api/cart – clear entire cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.cart.deleteMany({ where: { userId } });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// GET /api/cart/count
router.get('/count', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await prisma.cart.aggregate({
      where: { userId },
      _sum: { quantity: true }
    });
    res.json({ count: result._sum.quantity || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart count' });
  }
});

module.exports = router;
