const mysql = require('mysql2/promise');
require('dotenv').config();

const categoriesInfo = [
  { name: 'Mobiles, Computers', slug: 'mobiles', icon: '📱', desc: 'Smartphones, Laptops, PCs and more' },
  { name: 'TV, Appliances, Electronics', slug: 'electronics', icon: '📺', desc: 'TVs, ACs, Washing Machines' },
  { name: "Men's Fashion", slug: 'mens-fashion', icon: '👕', desc: 'Clothing, Shoes, Watches' },
  { name: "Women's Fashion", slug: 'womens-fashion', icon: '👗', desc: 'Clothing, Shoes, Jewellery' },
  { name: 'Home, Kitchen, Pets', slug: 'home', icon: '🏠', desc: 'Decor, Furniture, Pet Supplies' },
  { name: 'Beauty, Health, Grocery', slug: 'beauty', icon: '💄', desc: 'Makeup, Supplements, Food' },
  { name: 'Sports, Fitness, Bags, Luggage', slug: 'sports', icon: '⚽', desc: 'Gym Gear, Outdoor, Suitcases' },
  { name: "Toys, Baby Products, Kids' Fashion", slug: 'toys', icon: '🎮', desc: 'Toys, Clothing, Baby Care' },
  { name: 'Car, Motorbike, Industrial', slug: 'automotive', icon: '🚗', desc: 'Accessories, Tools, Helmets' },
  { name: 'Books', slug: 'books', icon: '📚', desc: 'Fiction, Non-fiction, Textbooks' },
  { name: 'Movies, Music & Video Games', slug: 'movies', icon: '🎬', desc: 'Games, Consoles, Blu-rays' }
];

const categoryGenerators = {
  'mobiles': ['Smartphone Ultra X', 'Laptop Pro 15', 'Desktop Gaming Rig', 'Wireless Earbuds', 'Tablet Air 10', 'Smartwatch Series 8', 'Computer Monitor 4K', 'Mechanical Keyboard'],
  'electronics': ['Smart TV 55-inch', 'Refrigerator Double Door', 'Washing Machine', 'Microwave Oven', 'Air Conditioner 1.5 Ton', 'Soundbar System', 'Vacuum Cleaner', 'Water Purifier'],
  'mens-fashion': ["Men's Cotton T-Shirt", 'Slim Fit Jeans', 'Running Shoes', 'Formal Leather Belt', 'Casual Jacket', 'Workout Shorts', 'Winter Hoodie', 'Classic Wristwatch'],
  'womens-fashion': ['Floral Summer Dress', "Women's Heels", 'Leather Handbag', 'Yoga Pants', 'Cardigan Sweater', 'Sunglasses UV400', 'Gold Plated Necklace', 'Denim Jacket'],
  'home': ['Non-Stick Cookware Set', 'Cotton Bed Sheets', 'Dog Food Regular', 'Sofa Set 3 Seater', 'LED Desk Lamp', 'Coffee Maker', 'Wall Clock', 'Cat Tree Tower'],
  'beauty': ['Face Wash Cleanser', 'Vitamin C Serum', 'Organic Rice 5kg', 'Protein Powder', 'Matte Lipstick', 'Hair Dryer Pro', 'Almonds 1kg', 'Moisturizing Body Lotion'],
  'sports': ['English Willow Cricket Bat', 'Yoga Mat Non-Slip', 'Hiking Backpack 50L', 'Dumbbell Set 10kg', 'Tennis Racquet Pro', 'Foldable Treadmill', 'Travel Suitcase Hard Shell', 'Swimming Goggles Anti-Fog'],
  'toys': ['Lego Building Blocks', 'Superhero Action Figure', 'Kids Educational Puzzles', 'Baby Stroller Foldable', 'Remote Control Car', 'Kids Cartoon T-Shirt', 'Plush Teddy Bear', 'Board Game Monopoly'],
  'automotive': ['Car Cover Waterproof', 'Synthetic Engine Oil 5W-30', 'Motorcycle Helmet ISI', 'Portable Tire Inflator', 'Dash Cam 1080p', 'Premium Wiper Blades', 'Cordless Power Drill', 'Tool Kit 100 Pcs'],
  'books': ['Atomic Habits by James Clear', 'The Psychology of Money', 'Harry Potter Box Set', 'A Brief History of Time', 'Sapiens by Yuval Noah Harari', 'The Alchemist', 'Rich Dad Poor Dad', '1984 by George Orwell'],
  'movies': ['Avengers Endgame Blu-ray', 'PS5 Wireless Controller', 'FIFA 24 PlayStation Game', 'Portable Bluetooth Speaker', 'Vinyl Record Player', 'The Godfather Collection DVD', 'Acoustic Guitar Bundle', 'Electronic Music Keyboard']
};

async function seedData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'amazon_clone',
      multipleStatements: true
    });
    console.log('Connected to Database. Starting Seeding...');

    for (let c of categoriesInfo) {
      // Create Category
      await connection.query(
        `INSERT IGNORE INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)`,
        [c.name, c.slug, c.icon, c.desc]
      );
      
      const [rows] = await connection.query(`SELECT id FROM categories WHERE slug = ?`, [c.slug]);
      if (rows.length === 0) continue;
      const categoryId = rows[0].id;

      const productNames = categoryGenerators[c.slug];
      let sortOrder = 1;

      for (let pName of productNames) {
        const productSlug = pName.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random()*10000);
        const price = Math.floor(Math.random() * 5000) + 199;
        const ogPrice = price + Math.floor(Math.random() * 2000) + 100;
        const brand = 'AmazonBrand';
        const description = 'This is an amazing high-quality product perfect for your everyday needs. Highly durable and reliable.';
        const rating = (Math.random() * 1.5 + 3.5).toFixed(2); // 3.5 to 5.0
        const reviews = Math.floor(Math.random() * 1500) + 50;

        // Ensure product doesn't exist
        const [pCheck] = await connection.query('SELECT id FROM products WHERE slug = ?', [productSlug]);
        if (pCheck.length > 0) continue;

        const [result] = await connection.query(
          `INSERT INTO products (name, slug, description, category_id, brand, price, original_price, stock, rating, review_count, is_active, is_prime) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pName, productSlug, description, categoryId, brand, price, ogPrice, 100, rating, reviews, true, true]
        );

        const productId = result.insertId;
        
        // Placeholder product image
        const imgUrl = `https://placehold.co/400x400?text=${encodeURIComponent(pName)}`;
        
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, true, ?)`,
          [productId, imgUrl, sortOrder]
        );
        sortOrder++;
      }
      
      console.log(`✅ Seeded 8 products for category: ${c.name}`);
    }

    console.log('🎉 Seeding successfully completed!');
    
  } catch (error) {
    console.error('❌ Data Seeding failed:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seedData();
