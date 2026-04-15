const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Default user (password: amazon123)
  await prisma.user.upsert({
    where: { email: 'aryan@amazonclone.com' },
    create: {
      name: 'Aryan Mittal',
      email: 'aryan@amazonclone.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      phone: '+91-9876543210'
    },
    update: {}
  });
  console.log('✅ Default user created');

  // 2. Categories
  const categoriesData = [
    { name: 'Electronics',      slug: 'electronics',     icon: '📱', description: 'Smartphones, laptops, and more' },
    { name: 'Books',            slug: 'books',           icon: '📚', description: 'Bestsellers and textbooks' },
    { name: 'Fashion',          slug: 'fashion',         icon: '👗', description: 'Clothing and accessories' },
    { name: 'Home & Kitchen',   slug: 'home-kitchen',    icon: '🏠', description: 'Kitchen and home decor' },
    { name: 'Sports & Fitness', slug: 'sports-fitness',  icon: '⚽', description: 'Fitness and outdoor gear' },
    { name: 'Toys & Games',     slug: 'toys-games',      icon: '🎮', description: 'Fun for all ages' },
    { name: 'Beauty & Health',  slug: 'beauty-health',   icon: '💄', description: 'Personal care and wellness' },
    { name: 'Automotive',       slug: 'automotive',      icon: '🚗', description: 'Car accessories' },
    { name: 'Grocery',          slug: 'grocery',         icon: '🛒', description: 'Daily essentials' },
    { name: 'Office Products',  slug: 'office-products', icon: '💼', description: 'Stationery and more' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: {}
    });
  }
  console.log('✅ Categories seeded');

  const categories = await prisma.category.findMany();
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // 3. Helper to generate products
  const createProduct = (catSlug, index, name, price, ogPrice, brand, img) => ({
    name,
    slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    description: `A premium ${name} designed for comfort and performance in the ${catSlug} category.`,
    specifications: {"Brand": brand, "Warranty": "1 Year", "Color": "Standard"},
    categoryId: catMap[catSlug],
    brand,
    price,
    originalPrice: ogPrice,
    stock: 50 + index,
    rating: 4.0 + (index % 10) / 10,
    reviewCount: 100 + index * 5,
    isPrime: true,
    isFeatured: index < 3,
    images: [{ imageUrl: img, isPrimary: true, sortOrder: 1 }]
  });

  const allProducts = [];

  // --- AUTOMOTIVE (12) ---
  const automotiveNames = [
    "Portable Car Air Compressor", "Car Vacuum Cleaner High Power", "OBD2 Scanner Diagnostic Tool",
    "Pressure Washer for Car", "Digital Tire Pressure Gauge", "Car Dash Cam Front & Rear",
    "Synthetic Engine Oil 5W-30", "Car Microfiber Cleaning Cloths", "Universal Floor Mats Set",
    "Car Roof Rack Cargo Carrier", "Jump Starter Power Bank", "Ceramic Coating Kit"
  ];
  const automotiveImgs = [
    "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=500",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500",
    "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500",
    "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500",
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500",
    "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500",
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
    "https://images.unsplash.com/photo-1609692814857-56c581a25a2c?w=500",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500"
  ];
  automotiveNames.forEach((n, i) => allProducts.push(createProduct('automotive', i, n, 1299 + i * 200, 2500 + i * 300, 'AutoPro', automotiveImgs[i])));

  // --- BEAUTY & HEALTH (12) ---
  const beautyNames = [
    "Vitamin C Face Serum", "Electric Toothbrush Sonic", "Yoga Mat Eco-Friendly",
    "Hair Dryer with Diffuser", "Massage Gun Deep Tissue", "Manual Shaver Set",
    "Natural Beard Oil", "Hyaluronic Acid Moisturizer", "Organic Green Tea Extract",
    "Aromatherapy Essential Oils", "Dead Sea Mud Mask", "Professional Makeup Brush Set"
  ];
  const beautyImgs = [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
    "https://images.unsplash.com/photo-1559591931-9a416d6c4391?w=500",
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    "https://images.unsplash.com/photo-1522337360788-8b13df772e1c?w=500",
    "https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?w=500",
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500",
    "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=500",
    "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
    "https://images.unsplash.com/photo-1602928294248-ad69e46a9b75?w=500",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
  ];
  beautyNames.forEach((n, i) => allProducts.push(createProduct('beauty-health', i, n, 499 + i * 150, 999 + i * 200, 'GlowWell', beautyImgs[i])));

  // --- BOOKS (12) ---
  const bookNames = [
    "Atomic Habits", "Thinking, Fast and Slow", "The Psychology of Money",
    "Clean Code: A Handbook", "Sapiens: A Brief History", "The Alchemist",
    "Deep Work: Rules for Focus", "Can't Hurt Me", "Man's Search for Meaning",
    "Rich Dad Poor Dad", "The 7 Habits of Highly Effective People", "Dune (Deluxe Edition)"
  ];
  const bookImgs = [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500",
    "https://images.unsplash.com/photo-1603162597503-a988e8412690?w=500",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
    "https://images.unsplash.com/photo-1543004218-ee141d0ef114?w=500",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    "https://images.unsplash.com/photo-1524578271613-d550eeb81ded?w=500",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500",
    "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500"
  ];
  bookNames.forEach((n, i) => allProducts.push(createProduct('books', i, n, 299 + i * 50, 599 + i * 70, 'PublisherX', bookImgs[i])));

  // --- ELECTRONICS (12) ---
  const electronicsNames = [
    "Wireless Noise Cancelling Headphones", "Smart Watch with GPS", "4K Ultra HD Monitor 27\"",
    "Mechanical Gaming Keyboard", "Portable SSD 1TB", "True Wireless Earbuds",
    "Professional DSLR Camera", "Smart Home Voice Assistant", "Full HD Web Cam",
    "Dimmable Ring Light", "Graphic Drawing Tablet", "Gaming Mouse with RGB"
  ];
  const electronicsImgs = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "https://images.unsplash.com/photo-1546868871-af0de0c9aa5b?w=500",
    "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500",
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500",
    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
    "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
    "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=500",
    "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"
  ];
  electronicsNames.forEach((n, i) => allProducts.push(createProduct('electronics', i, n, 1999 + i * 1500, 3999 + i * 2000, 'TechGiant', electronicsImgs[i])));

  // --- FASHION (12) ---
  const fashionNames = [
    "Men's Cotton Polo T-Shirt", "Women's High Waist Yoga Leggings", "Classic Leather Wallet",
    "Running Sneakers Lightweight", "Denim Slim Fit Jeans", "Silk Floral Scarf",
    "Summer Casual Midi Dress", "Water-Resistant Winter Jacket", "Polarized Aviator Sunglasses",
    "Stainless Steel Analog Watch", "Canvas Backpack for Travel", "Unisex Knit Beanie"
  ];
  const fashionImgs = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    "https://images.unsplash.com/photo-1601924921557-45e4e83a78a4?w=500",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
    "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=500",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"
  ];
  fashionNames.forEach((n, i) => allProducts.push(createProduct('fashion', i, n, 699 + i * 300, 1499 + i * 400, 'StyleHub', fashionImgs[i])));

  // --- GROCERY (12) ---
  const groceryNames = [
    "Organic Extra Virgin Olive Oil", "Whole Grain Brown Rice 5kg", "Ground Coffee Dark Roast",
    "Natural Peanut Butter - Creamy", "Gluten-Free Oat Flour", "Organic Raw Honey",
    "Spices Gift Set (12 Jars)", "Dry Fruits Mix - Almonds & Walnuts", "Quinoa Grain Superfood",
    "Digestive Whole Wheat Biscuits", "Unsweetened Almond Milk", "Pink Himalayan Salt"
  ];
  const groceryImgs = [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500",
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
    "https://images.unsplash.com/photo-1532130325493-272e274cc820?w=500",
    "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=500",
    "https://images.unsplash.com/photo-1612257416648-ee7a6c533b4f?w=500",
    "https://images.unsplash.com/photo-1558961776-1979999ac13b?w=500",
    "https://images.unsplash.com/photo-1550583760-d8cc62d400db?w=500",
    "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500"
  ];
  groceryNames.forEach((n, i) => allProducts.push(createProduct('grocery', i, n, 199 + i * 80, 399 + i * 100, 'NaturePure', groceryImgs[i])));

  // --- HOME & KITCHEN (12) ---
  const homeNames = [
    "Electric Kettle 1.5L Rapid Boil", "Digital Kitchen Weighing Scale", "Memory Foam Pillow Set of 2",
    "Non-Stick Cookware Set (12 Piece)", "Electric Hand Mixer 300W", "Floor Lamp with Shade",
    "Cotton Bath Towels (Pack of 4)", "Aromatherapy Oil Diffuser", "Ceramic Dinner Plate Set",
    "Cast Iron Skillet Pre-Seasoned", "Storage Bins with Lids Set", "Magnetic Knife Tool Holder"
  ];
  const homeImgs = [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    "https://images.unsplash.com/photo-1586165368502-1bad9cc41432?w=500",
    "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=500",
    "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500",
    "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500",
    "https://images.unsplash.com/photo-1507473885765-e6ed057ab793?w=500",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500",
    "https://images.unsplash.com/photo-1602928294248-ad69e46a9b75?w=500",
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500",
    "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=500",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500",
    "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500"
  ];
  homeNames.forEach((n, i) => allProducts.push(createProduct('home-kitchen', i, n, 899 + i * 400, 1599 + i * 600, 'ComfortHome', homeImgs[i])));

  // --- OFFICE PRODUCTS (12) ---
  const officeNames = [
    "Wireless Laser Printer", "Ergonomic Office Chair Mesh", "L-Shaped Computer Desk",
    "A3 Laminator Machine", "Fine Tip Fineliners (Set of 24)", "Monitor Desk Mount Arm",
    "Notebook Journal Set of 3", "Paper Shredder High Security", "Whiteboard Magnetic 3x2",
    "Office Foot Rest Under Desk", "Desktop Organizer Set", "Sticky Notes Value Pack"
  ];
  const officeImgs = [
    "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500",
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500",
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500",
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500",
    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500",
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
    "https://images.unsplash.com/photo-1568205612837-017257d2310a?w=500",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500",
    "https://images.unsplash.com/photo-1586411482025-a134a66f6168?w=500",
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500",
    "https://images.unsplash.com/photo-1528164344705-47542687000d?w=500"
  ];
  officeNames.forEach((n, i) => allProducts.push(createProduct('office-products', i, n, 399 + i * 600, 799 + i * 800, 'OfficeEx', officeImgs[i])));

  // --- SPORTS & FITNESS (12) ---
  const sportsNames = [
    "Adjustable Dumbbells Set", "Resistance Bands Set of 5", "Ab Roller Wheel with Mat",
    "Tennis Racket Professional Graft", "Football Size 5 Hybrid", "Basketball Composite Leather",
    "Speed Jump Rope with Bearings", "Weightlifting Belt Leather", "Yoga Blocks Cork Set",
    "Badminton Kit with 2 Rackets", "Swim Goggles Anti-Fog", "Punching Bag Heavy Duty"
  ];
  const sportsImgs = [
    "https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?w=500",
    "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    "https://images.unsplash.com/photo-1622279457486-62dcc4a4953f?w=500",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500",
    "https://images.unsplash.com/photo-1519861531473-920036214751?w=500",
    "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=500",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
    "https://images.unsplash.com/photo-1603988334464-a71994ec8481?w=500",
    "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=500",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500",
    "https://images.unsplash.com/photo-1517438322307-e67111335449?w=500"
  ];
  sportsNames.forEach((n, i) => allProducts.push(createProduct('sports-fitness', i, n, 499 + i * 700, 999 + i * 1000, 'FitGoal', sportsImgs[i])));

  // --- TOYS & GAMES (12) ---
  const toysNames = [
    "Building Blocks Set 1000 Pcs", "Remote Control Sports Car", "Strategy Board Game - Settlers",
    "Stuffed Animal Plush Bear", "Musical Keyboard for Kids", "Science Experiment Kit",
    "Art and Craft Kit with Paint", "Doctor Play Set for Kids", "Wooden Jigsaw Puzzle 500 Pcs",
    "Kitchen Play Set with Lights", "Mini Drone with HD Camera", "Classic Carrom Board 32\""
  ];
  const toysImgs = [
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500",
    "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500",
    "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=500",
    "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=500",
    "https://images.unsplash.com/photo-1520523839897-bd69bfd3e1d0?w=500",
    "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=500",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500",
    "https://images.unsplash.com/photo-1606503153255-59d5e417c4ed?w=500",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500",
    "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500",
    "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=500"
  ];
  toysNames.forEach((n, i) => allProducts.push(createProduct('toys-games', i, n, 399 + i * 400, 799 + i * 600, 'PlayBox', toysImgs[i])));

  // 4. Seeding Products
  for (const { images, ...productData } of allProducts) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      create: {
        ...productData,
        images: { create: images }
      },
      update: {
        ...productData,
        images: {
          deleteMany: {},
          create: images
        }
      }
    });
  }

  console.log(`✅ ${allProducts.length} products seeded across 10 categories!`);
  console.log('🎉 Seeding complete!');
}

seed()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
