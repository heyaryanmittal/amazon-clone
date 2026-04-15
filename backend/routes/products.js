const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

/**
 * Helper to transform Prisma product objects to match frontend expected snake_case fields
 */
const formatProduct = (p) => {
  const formatted = {
    ...p,
    // Ensure all numeric fields are proper numbers/floats
    price: parseFloat(p.price),
    original_price: p.originalPrice ? parseFloat(p.originalPrice) : null,
    rating: parseFloat(p.rating),
    review_count: p.reviewCount,
    is_prime: p.isPrime,
    is_featured: p.isFeatured,
    is_active: p.isActive,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    
    // Compatibility fields for images
    category_name: p.category?.name,
    category_slug: p.category?.slug,
    category_id: p.categoryId,
    
    // Handle primary image
    image_url: p.images && p.images[0] ? p.images[0].imageUrl : null,
    primary_image: p.images && p.images[0] ? p.images[0].imageUrl : null,
  };

  // Remove camelCase fields to keep payload clean
  delete formatted.originalPrice;
  delete formatted.reviewCount;
  delete formatted.isPrime;
  delete formatted.isFeatured;
  delete formatted.isActive;
  delete formatted.createdAt;
  delete formatted.updatedAt;
  delete formatted.category;
  delete formatted.images;

  return formatted;
};

// GET /api/products - Get all products with filtering, search, pagination
router.get('/', async (req, res) => {
  try {
    const {
      search   = '',
      category = '',
      minPrice = 0,
      maxPrice = 999999,
      sortBy   = 'createdAt',
      sortOrder = 'desc',
      page  = 1,
      limit = 20,
      featured = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name:        { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand:       { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    where.price = {
      gte: parseFloat(minPrice),
      lte: parseFloat(maxPrice)
    };

    // Map frontend sort names to Prisma field names
    const sortMap = {
      price:        'price',
      rating:       'rating',
      created_at:   'createdAt',
      createdAt:    'createdAt',
      name:         'name',
      review_count: 'reviewCount',
      reviewCount:  'reviewCount'
    };
    const safeSort  = sortMap[sortBy] || 'createdAt';
    const safeOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true }
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { imageUrl: true }
          }
        },
        orderBy: { [safeSort]: safeOrder },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products: products.map(formatProduct),
      pagination: {
        total,
        page:       parseInt(page),
        limit:      parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: {
          select: { name: true, slug: true }
        },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { imageUrl: true }
        }
      },
      orderBy: { rating: 'desc' },
      take: 12
    });

    res.json({ products: products.map(formatProduct) });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedProduct = formatProduct(product);
    
    // Also send all images for the gallery
    const images = product.images.map(img => ({
      ...img,
      image_url: img.imageUrl // keep frontend compatibility
    }));

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { imageUrl: true }
        }
      },
      orderBy: { rating: 'desc' },
      take: 6
    });

    res.json({ 
      product: formattedProduct, 
      images, 
      related: related.map(formatProduct) 
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
