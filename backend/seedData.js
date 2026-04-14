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

const realisticProducts = {
  'mobiles': [
    { name: 'Smartphone Ultra X', img: '1598327105650-599cf065abc6', feat: true },
    { name: 'Laptop Pro 15', img: '1496181133206-80ce9b88a853', feat: true },
    { name: 'Desktop Gaming Rig', img: '1587202372775-e229f172b9d7', feat: false },
    { name: 'Wireless Earbuds', img: '1590658268037-6bf12165a8df', feat: false },
    { name: 'Tablet Air 10', img: '1544244015-0df4b3ffc6b0', feat: false },
    { name: 'Smartwatch Series 8', img: '1579586337278-3befd40fd17a', feat: false },
    { name: 'Computer Monitor 4K', img: '1527443224154-c4a3942d3acf', feat: false },
    { name: 'Mechanical Keyboard', img: '1595225476474-87563907a212', feat: false }
  ],
  'electronics': [
    { name: 'Smart TV 55-inch', img: '1593359677879-f4cc8298711e', feat: true },
    { name: 'Refrigerator Double Door', img: '1584568694244-14fbdf83bd30', feat: false },
    { name: 'Washing Machine', img: '1626806787461-102c1bfaaea1', feat: false },
    { name: 'Microwave Oven', img: '1574269909862-7e1d70bb8078', feat: false },
    { name: 'Air Conditioner 1.5 Ton', img: '1527380993073-77cdbacfcac9', feat: false },
    { name: 'Soundbar System', img: '1544244015-0df4b3ffc6b0', feat: false },
    { name: 'Vacuum Cleaner', img: '1558317374-067fb5f30001', feat: false },
    { name: 'Water Purifier', img: '1610444383189-8dafe7cb0a6e', feat: true }
  ],
  'mens-fashion': [
    { name: "Men's Cotton T-Shirt", img: '1521572163474-6864f9cf17ab', feat: true },
    { name: 'Slim Fit Jeans', img: '1541099649105-f69ad21f3246', feat: false },
    { name: 'Running Shoes', img: '1542291026-7eec264c27ff', feat: true },
    { name: 'Formal Leather Belt', img: '1624222247344-587ffb00a019', feat: false },
    { name: 'Casual Jacket', img: '1551028719-0c1bd281c7f4', feat: false },
    { name: 'Workout Shorts', img: '1565084886-cba5bc89f36b', feat: false },
    { name: 'Winter Hoodie', img: '1556821840-3a13f95609a7', feat: false },
    { name: 'Classic Wristwatch', img: '1523275335684-37898b6baf30', feat: false }
  ],
  'womens-fashion': [
    { name: 'Floral Summer Dress', img: '1515347619143-dfa05322ca9a', feat: true },
    { name: "Women's Heels", img: '1543163521-1bf539c55dd2', feat: false },
    { name: 'Leather Handbag', img: '1584916201218-f4242ceb4809', feat: true },
    { name: 'Yoga Pants', img: '1518310383802-640c2de311b5', feat: false },
    { name: 'Cardigan Sweater', img: '1607593245452-9b2f6efba227', feat: false },
    { name: 'Sunglasses UV400', img: '1511499767150-a48a237f0083', feat: false },
    { name: 'Gold Plated Necklace', img: '1599643478524-ce36e6550cfc', feat: false },
    { name: 'Denim Jacket', img: '1551486790-a5482accf0dd', feat: false }
  ],
  'home': [
    { name: 'Non-Stick Cookware Set', img: '1580256157092-23c726359eb3', feat: false },
    { name: 'Cotton Bed Sheets', img: '1522771739844-6a9f6d5f14af', feat: true },
    { name: 'Dog Food Regular', img: '1583337130417-3346a1be7dee', feat: false },
    { name: 'Sofa Set 3 Seater', img: '1555041469-a586c61ea9bc', feat: true },
    { name: 'LED Desk Lamp', img: '1507473884814-5f14ac61ccf0', feat: false },
    { name: 'Coffee Maker', img: '1495474472205-16270438ec31', feat: false },
    { name: 'Wall Clock', img: '1504193565985-703ea313c054', feat: false },
    { name: 'Cat Tree Tower', img: '1514888286974-6c03e2ca1dba', feat: false }
  ],
  'beauty': [
    { name: 'Face Wash Cleanser', img: '1556228578-0d85b1a4d571', feat: true },
    { name: 'Vitamin C Serum', img: '1620916566398-39f1143ab7be', feat: true },
    { name: 'Organic Rice 5kg', img: '1586201375761-838631481b7a', feat: false },
    { name: 'Protein Powder', img: '1595166299839-44afab46e336', feat: false },
    { name: 'Matte Lipstick', img: '1586495777744-041066c08e5e', feat: false },
    { name: 'Hair Dryer Pro', img: '1522337660859-02fbefca4702', feat: false },
    { name: 'Almonds 1kg', img: '1508061461522-074bef0005b4', feat: false },
    { name: 'Moisturizing Body Lotion', img: '1556228578-0d85b1a4d571', feat: false }
  ],
  'sports': [
    { name: 'English Willow Cricket Bat', img: '1588772097787-849a622df14d', feat: true },
    { name: 'Yoga Mat Non-Slip', img: '1601925260368-232185cffaaf', feat: true },
    { name: 'Hiking Backpack 50L', img: '1553531384-411a247cad1f', feat: false },
    { name: 'Dumbbell Set 10kg', img: '1583454118012-78d1fb52cde3', feat: false },
    { name: 'Tennis Racquet Pro', img: '1595435934249-5db7b54abef3', feat: false },
    { name: 'Foldable Treadmill', img: '1580261453293-6c84cbe2f8fc', feat: false },
    { name: 'Travel Suitcase Hard Shell', img: '1569982175971-d92b01cf86fb', feat: false },
    { name: 'Swimming Goggles Anti-Fog', img: '1519503460492-9a3b83cabaac', feat: false }
  ],
  'toys': [
    { name: 'Lego Building Blocks', img: '1585366119957-75cb3315c60b', feat: true },
    { name: 'Superhero Action Figure', img: '1606144042614-b258a3628e81', feat: true },
    { name: 'Kids Educational Puzzles', img: '1513009210777-62d4e3eb3812', feat: false },
    { name: 'Baby Stroller Foldable', img: '1517551079373-eeebc7d6e46d', feat: false },
    { name: 'Remote Control Car', img: '1594787317676-47b2c9b4e5ea', feat: false },
    { name: 'Kids Cartoon T-Shirt', img: '1519238263530-9b45e2a22538', feat: false },
    { name: 'Plush Teddy Bear', img: '1558237951-40be38d1796d', feat: false },
    { name: 'Board Game Monopoly', img: '1611032128919-4f81014e3658', feat: false }
  ],
  'automotive': [
    { name: 'Car Cover Waterproof', img: '1502877338535-773907bc6188', feat: false },
    { name: 'Synthetic Engine Oil 5W-30', img: '1610427306263-d143c7b3967d', feat: true },
    { name: 'Motorcycle Helmet ISI', img: '1552599723-8cfb6bf02a45', feat: true },
    { name: 'Portable Tire Inflator', img: '1621255530755-e4566f123f89', feat: false },
    { name: 'Dash Cam 1080p', img: '1544621034-01309ec9af5d', feat: false },
    { name: 'Premium Wiper Blades', img: '1505322022359-efd57863bc0d', feat: false },
    { name: 'Cordless Power Drill', img: '1504148455328-c376907d081c', feat: false },
    { name: 'Tool Kit 100 Pcs', img: '1581092521746-bf5b211f4221', feat: false }
  ],
  'books': [
    { name: 'Atomic Habits by James Clear', img: '1575880493809-5435e1d7a0c0', feat: true },
    { name: 'The Psychology of Money', img: '1589829085413-56de8ae1a017', feat: true },
    { name: 'Harry Potter Box Set', img: '1600189020959-19ccfc0a32ad', feat: false },
    { name: 'A Brief History of Time', img: '1532012197267-27e1f4405786', feat: false },
    { name: 'Sapiens by Yuval Noah Harari', img: '1543002588-bfa74002ed7e', feat: false },
    { name: 'The Alchemist', img: '1629858348398-e300de0278fb', feat: false },
    { name: 'Rich Dad Poor Dad', img: '1554415707-1e80fe372c3d', feat: false },
    { name: '1984 by George Orwell', img: '1585241935612-40de7ba674d8', feat: false }
  ],
  'movies': [
    { name: 'Avengers Endgame Blu-ray', img: '1618214271810-09c3149eefda', feat: true },
    { name: 'PS5 Wireless Controller', img: '1606144042614-b258a3628e81', feat: false },
    { name: 'FIFA 24 PlayStation Game', img: '1612282245277-2fb0c78a0ec8', feat: false },
    { name: 'Portable Bluetooth Speaker', img: '1608043152063-e38059ec8b04', feat: true },
    { name: 'Vinyl Record Player', img: '1586520338785-f5b2b2b1ff95', feat: false },
    { name: 'The Godfather Collection DVD', img: '1593359677879-f4cc8298711e', feat: false },
    { name: 'Acoustic Guitar Bundle', img: '1510915361894-0808ebc249a5', feat: false },
    { name: 'Electronic Music Keyboard', img: '1514119412350-e174921685cd', feat: false }
  ]
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
    console.log('Connected to Database. Deleting old products...');

    // Wipe out the products so we can beautifully re-add them without duplicate clumps!
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE product_images');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Starting High-Quality Image Seeding...');

    for (let c of categoriesInfo) {
      // Create Category just in case
      await connection.query(
        `INSERT IGNORE INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)`,
        [c.name, c.slug, c.icon, c.desc]
      );
      
      const [rows] = await connection.query(`SELECT id FROM categories WHERE slug = ?`, [c.slug]);
      if (rows.length === 0) continue;
      const categoryId = rows[0].id;

      const items = realisticProducts[c.slug];
      let sortOrder = 1;

      for (let item of items) {
        const productSlug = item.name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random()*10000);
        const price = Math.floor(Math.random() * 5000) + 199;
        const ogPrice = price + Math.floor(Math.random() * 2000) + 100;
        const brand = 'AmazonBrand';
        const description = 'Experience the best quality and reliability with this premium product. Engineered for excellence.';
        const rating = (Math.random() * 1.5 + 3.5).toFixed(2); // 3.5 to 5.0
        const reviews = Math.floor(Math.random() * 1500) + 50;

        const [result] = await connection.query(
          `INSERT INTO products (name, slug, description, category_id, brand, price, original_price, stock, rating, review_count, is_active, is_prime, is_featured) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [item.name, productSlug, description, categoryId, brand, price, ogPrice, 100, rating, reviews, true, true, item.feat]
        );

        const productId = result.insertId;
        
        // High-Quality Unsplash images via direct query string
        const imgUrl = `https://images.unsplash.com/photo-${item.img}?w=600&q=80`;
        
        await connection.query(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, true, ?)`,
          [productId, imgUrl, sortOrder]
        );
        sortOrder++;
      }
      console.log(`✅ Seeded ${items.length} realistic products for category: ${c.name}`);
    }

    console.log('🎉 Seeding fully completed with stunning realistic images!');
    
  } catch (error) {
    console.error('❌ Data Seeding failed:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seedData();
