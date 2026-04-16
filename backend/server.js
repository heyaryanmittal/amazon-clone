require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const prisma = require('./config/db');

const app = express();

// Middleware
app.use(compression());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://amazon-clone-ac.vercel.app'
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Amazon Clone API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

// Start server first so Render sees the port as open
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Attempt database connection
console.log('⏳ Connecting to database...');
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to Supabase (PostgreSQL via Prisma)');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    console.error('Check your DATABASE_URL and DIRECT_URL environment variables.');
    // Don't exit the process, allow health check to remain active for debugging
  });
