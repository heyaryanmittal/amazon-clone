const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/wishlist - Get user's wishlist
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const [items] = await db.query(`
      SELECT 
        w.id as wishlist_id,
        w.added_at,
        p.*,
        pi.image_url as primary_image,
        c.name as category_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ? AND p.is_active = TRUE
      ORDER BY w.added_at DESC
    `, [userId]);

    res.json({ items });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// POST /api/wishlist - Add to wishlist
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    await db.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// GET /api/wishlist/check/:productId
router.get('/check/:productId', async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, req.params.productId]
    );
    res.json({ inWishlist: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
});

module.exports = router;
