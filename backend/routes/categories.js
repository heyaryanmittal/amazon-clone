const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/categories - Get all categories with product count
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug - Get single category by slug
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE slug = ?',
      [req.params.slug]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category: rows[0] });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;
