const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId,
        product: { isActive: true }
      },
      include: {
        product: {
          include: {
            category: { select: { name: true } },
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

    // Flatten for frontend compatibility
    const items = wishlistItems.map(w => ({
      wishlist_id:    w.id,
      added_at:       w.addedAt,
      id:             w.product.id,
      name:           w.product.name,
      slug:           w.product.slug,
      price:          parseFloat(w.product.price),
      original_price: w.product.originalPrice ? parseFloat(w.product.originalPrice) : null,
      rating:         parseFloat(w.product.rating),
      review_count:   w.product.reviewCount,
      is_prime:       w.product.isPrime,
      brand:          w.product.brand,
      image_url:      w.product.images[0]?.imageUrl || null,
      primary_image:  w.product.images[0]?.imageUrl || null,
      category_name:  w.product.category?.name || null
    }));

    res.json({ items });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// POST /api/wishlist – add (idempotent)
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Upsert: create if not exists, do nothing if already there
    await prisma.wishlist.upsert({
      where: {
        userId_productId: { userId, productId: product_id }
      },
      create: { userId, productId: product_id },
      update: {} // no-op
    });

    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const userId    = req.user.id;
    const productId = parseInt(req.params.productId);

    await prisma.wishlist.deleteMany({
      where: { userId, productId }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// GET /api/wishlist/check/:productId
router.get('/check/:productId', async (req, res) => {
  try {
    const userId    = req.user.id;
    const productId = parseInt(req.params.productId);

    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    res.json({ inWishlist: !!item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
});

module.exports = router;
