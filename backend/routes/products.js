const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/products - Get all products with filtering, search, pagination
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      minPrice = 0,
      maxPrice = 999999,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
      featured = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.is_active = TRUE
    `;

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (featured === 'true') {
      query += ` AND p.is_featured = TRUE`;
    }

    query += ` AND p.price BETWEEN ? AND ?`;
    params.push(parseFloat(minPrice), parseFloat(maxPrice));

    const allowedSort = ['price', 'rating', 'created_at', 'name', 'review_count'];
    const allowedOrder = ['ASC', 'DESC'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = allowedOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Count query
    const countQuery = query.replace(
      `p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image`,
      'COUNT(DISTINCT p.id) as total'
    );
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0].total;

    query += ` ORDER BY p.${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [products] = await db.query(query, params);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.is_active = TRUE AND p.is_featured = TRUE
      ORDER BY p.rating DESC
      LIMIT 12
    `);
    res.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:id - Get single product with images
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Get product details
    const [products] = await db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_active = TRUE
    `, [productId]);

    if (!products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    // Get product images
    const [images] = await db.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
      [productId]
    );

    // Get related products
    const [related] = await db.query(`
      SELECT 
        p.*,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = TRUE
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
      ORDER BY p.rating DESC
      LIMIT 6
    `, [product.category_id, productId]);

    // Parse JSON specifications
    if (product.specifications && typeof product.specifications === 'string') {
      try {
        product.specifications = JSON.parse(product.specifications);
      } catch (e) {
        product.specifications = {};
      }
    }

    res.json({ product, images, related });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
