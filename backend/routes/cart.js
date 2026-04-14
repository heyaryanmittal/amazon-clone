const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// All cart routes use the default user (user_id = 1) or authenticated user
router.use(authenticateToken);

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const [cartItems] = await db.query(`
      SELECT 
        c.id as cart_id,
        c.quantity,
        c.added_at,
        p.id as product_id,
        p.name,
        p.slug,
        p.price,
        p.original_price,
        p.stock,
        p.is_prime,
        p.brand,
        pi.image_url as image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE c.user_id = ? AND p.is_active = TRUE
      ORDER BY c.added_at DESC
    `, [userId]);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      items: cartItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: subtotal > 499 ? 0 : 40,
        total: parseFloat((subtotal + (subtotal > 499 ? 0 : 40)).toFixed(2)),
        totalItems
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - Add item to cart
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check product exists and has stock
    const [products] = await db.query(
      'SELECT id, stock, name FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );

    if (!products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Insert or update cart
    await db.query(`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
    `, [userId, product_id, quantity]);

    res.json({ message: 'Product added to cart successfully', product_name: products[0].name });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/:cartId - Update cart item quantity
router.put('/:cartId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    if (quantity > 10) {
      return res.status(400).json({ error: 'Maximum quantity is 10' });
    }

    const [result] = await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/:cartId - Remove item from cart
router.delete('/:cartId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;

    const [result] = await db.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// GET /api/cart/count - Get cart item count
router.get('/count', async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT SUM(quantity) as count FROM cart WHERE user_id = ?',
      [userId]
    );
    res.json({ count: rows[0].count || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart count' });
  }
});

module.exports = router;
