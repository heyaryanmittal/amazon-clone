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
    { name: 'Electronics',      slug: 'electronics',     icon: '📱', description: 'Smartphones, laptops, tablets and more' },
    { name: 'Books',            slug: 'books',           icon: '📚', description: 'Bestsellers, textbooks, and literature' },
    { name: 'Fashion',          slug: 'fashion',         icon: '👗', description: 'Clothing, shoes, and accessories' },
    { name: 'Home & Kitchen',   slug: 'home-kitchen',    icon: '🏠', description: 'Appliances, furniture, and decor' },
    { name: 'Sports & Fitness', slug: 'sports-fitness',  icon: '⚽', description: 'Equipment, clothing, and accessories' },
    { name: 'Toys & Games',     slug: 'toys-games',      icon: '🎮', description: 'Toys, board games, and video games' },
    { name: 'Beauty & Health',  slug: 'beauty-health',   icon: '💄', description: 'Skincare, haircare, and wellness' },
    { name: 'Automotive',       slug: 'automotive',      icon: '🚗', description: 'Car accessories and tools' },
    { name: 'Grocery',          slug: 'grocery',         icon: '🛒', description: 'Food, beverages, and household items' },
    { name: 'Office Products',  slug: 'office-products', icon: '💼', description: 'Stationery, printers, and office supplies' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: {}
    });
  }
  console.log('✅ Categories seeded');

  // Get category map for product creation
  const categories = await prisma.category.findMany();
  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // 3. Products
  const productsData = [
    // ELECTRONICS
    { name: 'Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)', slug: 'samsung-galaxy-s24-ultra-256gb-titanium-black', description: 'Experience the ultimate Samsung Galaxy with the S24 Ultra.', specifications: {"Display":"6.8-inch Dynamic AMOLED 2X, 120Hz","Processor":"Snapdragon 8 Gen 3","RAM":"12GB","Storage":"256GB","Camera":"200MP+12MP+50MP+10MP","Battery":"5000mAh"}, categoryId: catMap['electronics'], brand: 'Samsung', price: 109999, originalPrice: 134999, stock: 45, rating: 4.7, reviewCount: 12453, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', isPrimary: true, sortOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800', isPrimary: false, sortOrder: 2 },
        { imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', isPrimary: false, sortOrder: 3 }
      ]
    },
    { name: 'Apple iPhone 16 Pro Max (256GB, Black Titanium)', slug: 'apple-iphone-16-pro-max-256gb-black-titanium', description: 'iPhone 16 Pro Max with A18 Pro chip and Pro camera system.', specifications: {"Chip":"A18 Pro","Storage":"256GB","Camera":"48MP+12MP+12MP","Battery":"Up to 33 hours"}, categoryId: catMap['electronics'], brand: 'Apple', price: 144900, originalPrice: 159900, stock: 30, rating: 4.8, reviewCount: 8920, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', isPrimary: true, sortOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', isPrimary: false, sortOrder: 2 }
      ]
    },
    { name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', slug: 'sony-wh-1000xm5-wireless-noise-cancelling-black', description: 'Industry-leading noise canceling. Up to 30-hour battery life.', specifications: {"Type":"Over-ear","Connectivity":"Bluetooth 5.2","Battery":"30 hours"}, categoryId: catMap['electronics'], brand: 'Sony', price: 24990, originalPrice: 34990, stock: 120, rating: 4.6, reviewCount: 5634, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', isPrimary: true, sortOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', isPrimary: false, sortOrder: 2 }
      ]
    },
    { name: 'MacBook Air M3 (13-inch, 8GB, 256GB)', slug: 'macbook-air-m3-13-inch-8gb-256gb', description: 'MacBook Air with M3 chip. Up to 18-hour battery.', specifications: {"Chip":"Apple M3","RAM":"8GB","Storage":"256GB SSD","Display":"13.6-inch Liquid Retina"}, categoryId: catMap['electronics'], brand: 'Apple', price: 99900, originalPrice: 114900, stock: 25, rating: 4.9, reviewCount: 4521, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', isPrimary: true, sortOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', isPrimary: false, sortOrder: 2 }
      ]
    },
    { name: 'Boat Rockerz 255 Pro+ Bluetooth Earphones', slug: 'boat-rockerz-255-pro-plus-bluetooth-earphones', description: 'ASAP Charge: 10 hrs playback with 10 min charge.', specifications: {"Type":"Neckband","Battery":"40 hours","Driver":"10mm"}, categoryId: catMap['electronics'], brand: 'boAt', price: 1299, originalPrice: 2990, stock: 500, rating: 4.2, reviewCount: 89432, isPrime: true, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    { name: 'Logitech MX Master 3S Wireless Mouse', slug: 'logitech-mx-master-3s-wireless-mouse', description: '8K DPI sensor. 70 days battery life.', specifications: {"Sensor":"Darkfield 8000 DPI","Battery":"70 days"}, categoryId: catMap['electronics'], brand: 'Logitech', price: 7995, originalPrice: 9995, stock: 80, rating: 4.7, reviewCount: 11230, isPrime: true, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // BOOKS
    { name: 'Atomic Habits by James Clear', slug: 'atomic-habits-james-clear-paperback', description: '#1 NYT bestseller on habit formation.', specifications: {"Author":"James Clear","Pages":"320","Format":"Paperback"}, categoryId: catMap['books'], brand: 'Penguin', price: 399, originalPrice: 799, stock: 200, rating: 4.8, reviewCount: 45231, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    { name: 'The Alchemist by Paulo Coelho', slug: 'the-alchemist-paulo-coelho-paperback', description: 'The extraordinary international bestseller.', specifications: {"Author":"Paulo Coelho","Pages":"208"}, categoryId: catMap['books'], brand: 'HarperCollins', price: 199, originalPrice: 399, stock: 350, rating: 4.7, reviewCount: 78932, isPrime: true, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    { name: 'Clean Code by Robert C. Martin', slug: 'clean-code-robert-c-martin', description: 'A Handbook of Agile Software Craftsmanship.', specifications: {"Author":"Robert C. Martin","Pages":"464"}, categoryId: catMap['books'], brand: 'Prentice Hall', price: 899, originalPrice: 1599, stock: 95, rating: 4.5, reviewCount: 18764, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // FASHION
    { name: 'Nike Air Max 270 Running Shoes (Black/White)', slug: 'nike-air-max-270-running-shoes-black-white', description: 'Max Air unit for all-day comfort.', specifications: {"Type":"Running/Lifestyle","Air Unit":"Max Air 270"}, categoryId: catMap['fashion'], brand: 'Nike', price: 10295, originalPrice: 12995, stock: 80, rating: 4.5, reviewCount: 9823, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', isPrimary: true, sortOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', isPrimary: false, sortOrder: 2 }
      ]
    },
    { name: "Levi's Men's 511 Slim Fit Jeans (Dark Blue)", slug: 'levis-mens-511-slim-fit-jeans-dark-blue', description: 'Slim from hip to thigh with narrow leg.', specifications: {"Fit":"Slim","Material":"99% Cotton, 1% Elastane"}, categoryId: catMap['fashion'], brand: 'Levis', price: 2999, originalPrice: 4999, stock: 150, rating: 4.3, reviewCount: 23451, isPrime: false, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // HOME & KITCHEN
    { name: 'Instant Pot Duo 7-in-1 Pressure Cooker (6 Quart)', slug: 'instant-pot-duo-7in1-electric-pressure-cooker-6qt', description: 'Combines 7 appliances in one.', specifications: {"Capacity":"6 Quart","Functions":"7-in-1","Wattage":"1000W"}, categoryId: catMap['home-kitchen'], brand: 'Instant Pot', price: 7999, originalPrice: 11999, stock: 65, rating: 4.6, reviewCount: 34521, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    { name: 'Philips Air Fryer HD9200/90 (4.1L)', slug: 'philips-air-fryer-hd9200-90-4-1l', description: 'Enjoy fried foods with up to 90% less fat.', specifications: {"Capacity":"4.1L","Wattage":"1400W","Technology":"Rapid Air"}, categoryId: catMap['home-kitchen'], brand: 'Philips', price: 8495, originalPrice: 12995, stock: 90, rating: 4.4, reviewCount: 28754, isPrime: true, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1617481554497-2d94d51e80c9?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // TOYS & GAMES
    { name: 'Lego Classic Creative Brick Box (790 Pieces)', slug: 'lego-classic-creative-brick-box-790-pieces', description: '790 classic LEGO bricks for endless building fun.', specifications: {"Pieces":"790","Age":"4+ years"}, categoryId: catMap['toys-games'], brand: 'LEGO', price: 3499, originalPrice: 5999, stock: 70, rating: 4.8, reviewCount: 23451, isPrime: true, isFeatured: true,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // BEAUTY & HEALTH
    { name: 'Mamaearth Vitamin C Face Serum (30ml)', slug: 'mamaearth-vitamin-c-face-serum-30ml', description: 'Brightens skin and reduces dark spots.', specifications: {"Volume":"30ml","Key Ingredients":"Vitamin C, Turmeric"}, categoryId: catMap['beauty-health'], brand: 'Mamaearth', price: 399, originalPrice: 699, stock: 350, rating: 4.2, reviewCount: 45231, isPrime: false, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // GROCERY
    { name: 'Amul Butter (500g)', slug: 'amul-butter-500g', description: 'Made from fresh cream. Rich in Vitamins A & D.', specifications: {"Weight":"500g","Type":"Salted Butter"}, categoryId: catMap['grocery'], brand: 'Amul', price: 285, originalPrice: 310, stock: 800, rating: 4.6, reviewCount: 23451, isPrime: false, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // OFFICE PRODUCTS
    { name: 'HP LaserJet Pro M15w Wireless Laser Printer', slug: 'hp-laserjet-pro-m15w-wireless-laser-printer', description: 'World\'s smallest desktop laser printer.', specifications: {"Print Speed":"19 ppm","Connectivity":"WiFi, USB"}, categoryId: catMap['office-products'], brand: 'HP', price: 9999, originalPrice: 14999, stock: 40, rating: 4.1, reviewCount: 5432, isPrime: true, isFeatured: false,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800', isPrimary: true, sortOrder: 1 }
      ]
    },
    // HEADPHONES (FROM LOCAL IMAGES)
    { name: 'Mackie Thump212 1200W 12-inch Powered Loudspeaker', slug: 'mackie-thump212-powered-loudspeaker', description: 'Powerful 1200W class-D amplifier. Built-in feedback eliminator.', specifications: {"Power":"1200W","Driver":"12-inch","Type":"Powered Speaker"}, categoryId: catMap['electronics'], brand: 'Mackie', price: 34990, originalPrice: 45000, stock: 15, rating: 4.5, reviewCount: 850, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_1.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'Sony WI-C100 Wireless In-Ear Bluetooth Headphones with 25h Battery Life', slug: 'sony-wi-c100-wireless-earphones', description: 'Customizable sound with Headphones Connect app. IPX4 water resistant.', specifications: {"Type":"Neckband","Battery":"25 hours","Bluetooth":"5.0"}, categoryId: catMap['electronics'], brand: 'Sony', price: 1699, originalPrice: 2790, stock: 200, rating: 4.3, reviewCount: 15400, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_2.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones - Pink', slug: 'sony-wh-ch720n-pink', description: 'Lightest wireless noise-cancelling overhead headphones yet.', specifications: {"Type":"Over-ear","Noice Cancelling":"Yes","Battery":"35 hours"}, categoryId: catMap['electronics'], brand: 'Sony', price: 9990, originalPrice: 14990, stock: 50, rating: 4.5, reviewCount: 2300, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_3.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones - Blue', slug: 'sony-wh-ch720n-blue', description: 'Dual Noise Sensor technology and Integrated Processor V1.', specifications: {"Type":"Over-ear","Noice Cancelling":"Yes","Battery":"35 hours"}, categoryId: catMap['electronics'], brand: 'Sony', price: 9990, originalPrice: 14990, stock: 45, rating: 4.6, reviewCount: 2500, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_4.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'boAt Airdopes 131 True Wireless Earbuds with 60 Hours Playback', slug: 'boat-airdopes-131-black', description: 'IWP technology and 13mm drivers for deep bass.', specifications: {"Type":"TWS","Battery":"60 hours Total","Driver":"13mm"}, categoryId: catMap['electronics'], brand: 'boAt', price: 899, originalPrice: 2990, stock: 300, rating: 4.1, reviewCount: 45000, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_5.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'TRUEFREE O1 Open Ear Bluetooth Headphones for Sports and Running', slug: 'truefree-o1-open-ear', description: 'Directional audio technology for safety and comfort.', specifications: {"Type":"Open Ear","Battery":"10 hours","Bluetooth":"5.3"}, categoryId: catMap['electronics'], brand: 'TRUEFREE', price: 4599, originalPrice: 6999, stock: 80, rating: 4.4, reviewCount: 1200, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_6.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'Marshall Minor III True Wireless In-Ear Headphones - Black', slug: 'marshall-minor-iii-tws', description: 'Signature Marshall sound without any clutter.', specifications: {"Type":"TWS","Battery":"25 hours Total","Driver":"12mm"}, categoryId: catMap['electronics'], brand: 'Marshall', price: 11999, originalPrice: 14999, stock: 60, rating: 4.6, reviewCount: 890, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_7.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'SoundPEATS Air3 Wireless Earbuds with Qualcomm QCC3040', slug: 'soundpeats-air3-tws', description: 'In-ear detection and aptX-Adaptive codec support.', specifications: {"Type":"TWS","Chip":"Qualcomm QCC3040","Battery":"17.5 hours"}, categoryId: catMap['electronics'], brand: 'SoundPEATS', price: 3999, originalPrice: 5999, stock: 120, rating: 4.3, reviewCount: 3400, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_8.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'SHOKZ OpenRun Pro - Premium Bone Conduction Sport Headphones', slug: 'openrun-pro-bone-conduction', description: 'Enhanced bass and 10-hour battery life. IP55 water resistant.', specifications: {"Type":"Bone Conduction","Battery":"10 hours","Rating":"IP55"}, categoryId: catMap['electronics'], brand: 'SHOKZ', price: 15999, originalPrice: 19999, stock: 30, rating: 4.7, reviewCount: 1500, isPrime: true, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_9.jpg', isPrimary: true, sortOrder: 1 }]
    },
    { name: 'USB-C Wired In-Ear Headphones with Mic and Hi-Fi Sound', slug: 'usb-c-wired-in-ear-earphones', description: 'Ergonomic design with magnetic earbuds and digital audio chip.', specifications: {"Type":"Wired","Connector":"USB-C","Mic":"Yes"}, categoryId: catMap['electronics'], brand: 'Generic', price: 499, originalPrice: 999, stock: 500, rating: 4.0, reviewCount: 12000, isPrime: false, isFeatured: true,
      images: [{ imageUrl: '/images/headphones/headphone_10.jpg', isPrimary: true, sortOrder: 1 }]
    }
  ];

  for (const { images, ...productData } of productsData) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      create: {
        ...productData,
        images: { create: images }
      },
      update: {}
    });
  }

  console.log(`✅ ${productsData.length} products seeded with images`);
  console.log('🎉 Seeding complete!');
}

seed()
  .catch(e => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
