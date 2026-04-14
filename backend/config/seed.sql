USE amazon_clone;

-- ============================================
-- PRODUCTS SEED DATA
-- Comprehensive sample products across all categories
-- ============================================

-- ELECTRONICS
INSERT IGNORE INTO products (name, slug, description, specifications, category_id, brand, price, original_price, stock, rating, review_count, is_prime, is_featured) VALUES
(
  'Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)',
  'samsung-galaxy-s24-ultra-256gb-titanium-black',
  'Experience the ultimate Samsung Galaxy with the S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display with 2600 nits peak brightness, the integrated S Pen, and a 200MP camera system that captures every detail even in low light. Powered by Snapdragon 8 Gen 3, this flagship device delivers unmatched performance.',
  '{"Display": "6.8-inch Dynamic AMOLED 2X, 120Hz", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "256GB", "Camera": "200MP + 12MP + 50MP + 10MP", "Battery": "5000mAh", "OS": "Android 14", "Weight": "232g"}',
  1, 'Samsung', 109999.00, 134999.00, 45, 4.7, 12453, TRUE, TRUE
),
(
  'Apple iPhone 16 Pro Max (256GB, Black Titanium)',
  'apple-iphone-16-pro-max-256gb-black-titanium',
  'iPhone 16 Pro Max. The biggest iPhone ever with an all-new titanium design, A18 Pro chip, and Pro camera system that lets you capture your best footage and photos. Features a 6.9-inch Super Retina XDR display with ProMotion technology.',
  '{"Display": "6.9-inch Super Retina XDR, ProMotion", "Chip": "A18 Pro", "Storage": "256GB", "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto", "Battery": "Up to 33 hours video playback", "OS": "iOS 18", "Weight": "227g"}',
  1, 'Apple', 144900.00, 159900.00, 30, 4.8, 8920, TRUE, TRUE
),
(
  'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)',
  'sony-wh-1000xm5-wireless-noise-cancelling-black',
  'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 8 microphones. Up to 30-hour battery life with quick charging. Exceptional sound quality with new driver unit.',
  '{"Type": "Over-ear", "Connectivity": "Bluetooth 5.2", "Battery": "30 hours", "Noise Cancellation": "Yes, Industry Leading", "Weight": "250g", "Driver": "30mm", "Codec": "LDAC, AAC, SBC"}',
  1, 'Sony', 24990.00, 34990.00, 120, 4.6, 5634, TRUE, TRUE
),
(
  'LG 43-Inch 4K Smart LED TV (2024 Model)',
  'lg-43-inch-4k-smart-led-tv-2024',
  'Experience stunning 4K visuals with Quantum Dot technology. webOS Smart TV with ThinQ AI. Perfect for any room with sleek bezels and exceptional picture quality. Comes with Magic Remote.',
  '{"Screen Size": "43 inches", "Resolution": "4K UHD (3840x2160)", "HDR": "HDR10, Dolby Vision", "Smart": "Yes, webOS", "Refresh Rate": "60Hz", "HDMI": "3", "USB": "2", "Weight": "8.3kg"}',
  1, 'LG', 32990.00, 49990.00, 60, 4.4, 3241, TRUE, FALSE
),
(
  'MacBook Air M3 (13-inch, 8GB RAM, 256GB SSD)',
  'macbook-air-m3-13-inch-8gb-256gb',
  'MacBook Air with M3 chip — supercharged for all you do. With up to 18-hour battery life, a 13.6-inch Liquid Retina display, and the power of M3, it delivers extraordinary performance in a next-level thin and light design.',
  '{"Chip": "Apple M3 (8-core CPU, 8-core GPU)", "RAM": "8GB", "Storage": "256GB SSD", "Display": "13.6-inch Liquid Retina", "Battery": "Up to 18 hours", "Weight": "1.24kg", "Ports": "2x USB-C, MagSafe"}',
  1, 'Apple', 99900.00, 114900.00, 25, 4.9, 4521, TRUE, TRUE
),
(
  'Boat Rockerz 255 Pro+ Bluetooth Earphones',
  'boat-rockerz-255-pro-plus-bluetooth-earphones',
  'boAt Rockerz 255 Pro+ is a neckband-style Bluetooth earphone featuring ASAP Charge technology that gives 10 hours of playback with just 10 minutes of charging. ENx Technology for crystal-clear calls.',
  '{"Type": "Neckband", "Connectivity": "Bluetooth 5.0", "Battery": "40 hours", "Driver Size": "10mm", "Water Resistance": "IPX5", "Charge Time": "10 min for 10 hrs"}',
  1, 'boAt', 1299.00, 2990.00, 500, 4.2, 89432, TRUE, FALSE
),
(
  'Logitech MX Master 3S Wireless Mouse',
  'logitech-mx-master-3s-wireless-mouse',
  'The most advanced Master Series mouse. 8K DPI Darkfield sensor on any surface. Ultra-fast Magspeed scroll. Works across computers with Logi Flow. 70 days of battery life.',
  '{"Sensor": "Darkfield High-precision 8000 DPI", "Connectivity": "Bluetooth / 2.4GHz", "Battery": "70 days", "Buttons": "7", "Compatibility": "Windows, macOS, Linux"}',
  1, 'Logitech', 7995.00, 9995.00, 80, 4.7, 11230, TRUE, FALSE
),

-- BOOKS
(
  'Atomic Habits by James Clear (Paperback)',
  'atomic-habits-james-clear-paperback',
  'The #1 New York Times bestseller. No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world''s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones.',
  '{"Author": "James Clear", "Publisher": "Penguin Random House", "Pages": "320", "Language": "English", "ISBN": "978-0735211292", "Format": "Paperback"}',
  2, 'Penguin Random House', 399.00, 799.00, 200, 4.8, 45231, TRUE, TRUE
),
(
  'The Alchemist by Paulo Coelho (Paperback)',
  'the-alchemist-paulo-coelho-paperback',
  'A special 25th anniversary edition of the extraordinary international bestseller, including a new Foreword by Paulo Coelho. Every few decades a book is written that changes the lives of its readers forever. The Alchemist is such a book.',
  '{"Author": "Paulo Coelho", "Publisher": "HarperCollins", "Pages": "208", "Language": "English", "Format": "Paperback"}',
  2, 'HarperCollins', 199.00, 399.00, 350, 4.7, 78932, TRUE, FALSE
),
(
  'Rich Dad Poor Dad by Robert T. Kiyosaki',
  'rich-dad-poor-dad-robert-kiyosaki',
  'Rich Dad Poor Dad is Robert''s story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing.',
  '{"Author": "Robert T. Kiyosaki", "Publisher": "Plata Publishing", "Pages": "336", "Language": "English", "Format": "Paperback"}',
  2, 'Plata Publishing', 299.00, 595.00, 180, 4.6, 34512, TRUE, FALSE
),
(
  'Clean Code by Robert C. Martin',
  'clean-code-robert-c-martin',
  'Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees. A Handbook of Agile Software Craftsmanship. This book is a must for any developer, programmer, or anyone in software management.',
  '{"Author": "Robert C. Martin", "Publisher": "Prentice Hall", "Pages": "464", "Language": "English", "Format": "Paperback", "Edition": "1st"}',
  2, 'Prentice Hall', 899.00, 1599.00, 95, 4.5, 18764, TRUE, TRUE
),

-- FASHION
(
  'Levi''s Men''s 511 Slim Fit Jeans (Dark Blue)',
  'levis-mens-511-slim-fit-jeans-dark-blue',
  'Our slimmest jeans from the hip through the thigh with a narrow leg opening. Sits below waist. Made from our stretch denim for a comfortable, flattering fit all day long. Classic 5-pocket styling.',
  '{"Fit": "Slim", "Rise": "Below Waist", "Material": "99% Cotton, 1% Elastane", "Closure": "Zip Fly with Button", "Care": "Machine Wash"}',
  3, 'Levis', 2999.00, 4999.00, 150, 4.3, 23451, FALSE, FALSE
),
(
  'Nike Air Max 270 Running Shoes (Black/White)',
  'nike-air-max-270-running-shoes-black-white',
  'The Nike Air Max 270 delivers an exaggerated tongue for an edgy aesthetic and a Max Air unit in the heel for all-day comfort. The design draws inspiration from the Air Max 93 and Air Max 180.',
  '{"Type": "Running / Lifestyle", "Upper": "Engineered mesh", "Midsole": "Full-length foam midsole", "Outsole": "Rubber", "Air Unit": "Max Air 270 Unit"}',
  3, 'Nike', 10295.00, 12995.00, 80, 4.5, 9823, TRUE, TRUE
),
(
  'Peter England Men''s Formal Shirt (White)',
  'peter-england-mens-formal-shirt-white',
  'Classic formal shirt from Peter England. Made from premium cotton fabric for superior comfort. Features a regular fit with spread collar, perfect for office and formal occasions.',
  '{"Fit": "Regular", "Material": "100% Cotton", "Collar": "Spread Collar", "Sleeve": "Full Sleeve", "Care": "Machine Wash"}',
  3, 'Peter England', 799.00, 1799.00, 200, 4.1, 12341, FALSE, FALSE
),

-- HOME & KITCHEN
(
  'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Quart)',
  'instant-pot-duo-7in1-electric-pressure-cooker-6qt',
  'The world''s best-selling multi-cooker. Combines 7 appliances in one: pressure cooker, slow cooker, rice cooker, sauté pan, yogurt maker, steamer, and warmer. Cook up to 70% faster than traditional cooking methods.',
  '{"Capacity": "6 Quart", "Wattage": "1000W", "Functions": "7-in-1", "Programs": "13 Built-in", "Material": "Stainless Steel", "Voltage": "220V"}',
  4, 'Instant Pot', 7999.00, 11999.00, 65, 4.6, 34521, TRUE, TRUE
),
(
  'Philips Air Fryer HD9200/90 (4.1L)',
  'philips-air-fryer-hd9200-90-4-1l',
  'Enjoy your favorite fried foods with up to 90% less fat. Uses Rapid Air technology for crispy results with little to no oil. Compact design with easy to clean dishwasher-safe parts. Timer up to 60 minutes.',
  '{"Capacity": "4.1L", "Wattage": "1400W", "Technology": "Rapid Air", "Temperature": "80-200°C", "Timer": "60 minutes", "Dishwasher Safe": "Yes"}',
  4, 'Philips', 8495.00, 12995.00, 90, 4.4, 28754, TRUE, FALSE
),
(
  'Prestige Svachh Hard Anodised Pressure Cooker (5L)',
  'prestige-svachh-hard-anodised-pressure-cooker-5l',
  'The Prestige Svachh Deep Lid hard anodised pressure cooker is equipped with a deep lid spillage control system that prevents food from overflowing. The hard anodised body makes it highly durable and scratch resistant.',
  '{"Capacity": "5 Litres", "Material": "Hard Anodised Aluminium", "Induction Compatible": "No", "Lid": "Deep Lid with Spillage Control", "Warranty": "5 Years"}',
  4, 'Prestige', 1899.00, 3499.00, 120, 4.3, 45678, FALSE, FALSE
),
(
  'Milton Thermosteel Flip Lid Flask (1000 ml)',
  'milton-thermosteel-flip-lid-flask-1000ml',
  'Milton Thermosteel Flip Lid Bottle keeps beverages hot for 24 hours and cold for 24 hours. Stainless steel interior keeps beverages fresh without imparting any odor or taste. Flip lid opens with a single hand.',
  '{"Capacity": "1000ml", "Material": "Stainless Steel", "Hot Duration": "24 hours", "Cold Duration": "24 hours", "Lid Type": "Flip Lid"}',
  4, 'Milton', 649.00, 1299.00, 300, 4.4, 67234, FALSE, FALSE
),

-- SPORTS & FITNESS
(
  'Boldfit Pull Up Bar for Home Gym Doorway',
  'boldfit-pull-up-bar-doorway-home-gym',
  'Heavy duty pull up bar that fits most doorways without screws or drilling. Supports up to 150 kg weight. Multi-grip positions for pull-ups, chin-ups, and push-ups. Foam grips for comfortable workout.',
  '{"Max Weight": "150 kg", "Material": "Steel", "Installation": "No Screws Required", "Grip Positions": "Multiple", "Width": "60-100 cm adjustable"}',
  5, 'Boldfit', 999.00, 2499.00, 250, 4.2, 34521, FALSE, FALSE
),
(
  'Nivia Pro Rubber Cricket Leather Ball (Pack of 6)',
  'nivia-pro-rubber-cricket-leather-ball-pack-6',
  'NIVIA Pro synthetic rubber cricket ball for practice. Standard size and weight for regulation play. Durable construction for indoor and outdoor practice. Suitable for all age groups.',
  '{"Material": "Synthetic Leather", "Quantity": "6 balls", "Size": "Standard", "Type": "Cricket"}',
  5, 'Nivia', 549.00, 899.00, 180, 4.1, 12341, FALSE, FALSE
),
(
  'Adidas Running Shoes Lite Racer Adapt 7.0 (Men)',
  'adidas-lite-racer-adapt-7-mens-running-shoes',
  'These Adidas running shoes feature a slip-on design for easy on and off. The Cloudfoam cushioning provides all-day comfort and the stretchy upper hugs the foot for a secure fit.',
  '{"Upper": "Textile", "Sole": "Synthetic/Rubber", "Cushioning": "Cloudfoam", "Closure": "Slip-on elastic laces", "Drop": "10mm"}',
  5, 'Adidas', 3599.00, 5999.00, 95, 4.3, 8923, TRUE, FALSE
),

-- TOYS & GAMES
(
  'Lego Classic Creative Brick Box (790 Pieces)',
  'lego-classic-creative-brick-box-790-pieces',
  'Let children''s imaginations run wild with this LEGO Classic Creative Brick Box. Contains 790 classic LEGO bricks in a wide spectrum of colors, plus a large base plate. Start building robots, cars, houses, and anything else children can imagine.',
  '{"Pieces": "790", "Age": "4+ years", "Theme": "Classic", "Dimensions": "37x26x14cm", "Material": "ABS Plastic"}',
  6, 'LEGO', 3499.00, 5999.00, 70, 4.8, 23451, TRUE, TRUE
),
(
  'Funskool Monopoly Classic Board Game',
  'funskool-monopoly-classic-board-game',
  'The classic Monopoly game. Buy, sell and trade your way to a fortune! Trade properties, build houses and hotels, and bankrupt your opponents. The classic family board game that has been loved for over 80 years.',
  '{"Players": "2-8", "Age": "8+ years", "Duration": "60-180 minutes", "Components": "Board, Cards, Dice, Tokens, Houses, Hotels", "Language": "English"}',
  6, 'Funskool', 799.00, 1499.00, 160, 4.4, 15678, FALSE, FALSE
),

-- BEAUTY & HEALTH
(
  'Himalaya Herbals Neem Face Wash (150ml)',
  'himalaya-herbals-neem-face-wash-150ml',
  'Himalaya Neem Face Wash uses the power of Neem and Turmeric to purify skin. Neem''s antibacterial properties and Turmeric''s antifungal properties work together to remove impurities and control pimples. Suitable for all skin types.',
  '{"Volume": "150ml", "Skin Type": "All Skin Types", "Key Ingredients": "Neem, Turmeric", "Free From": "Parabens, SLS", "Ayurvedic": "Yes"}',
  7, 'Himalaya', 149.00, 220.00, 500, 4.3, 89231, FALSE, FALSE
),
(
  'Mamaearth Vitamin C Face Serum (30ml)',
  'mamaearth-vitamin-c-face-serum-30ml',
  'Mamaearth Vitamin C Face Serum with Vitamin C and Turmeric helps to brighten skin and reduce dark spots. Vitamin C fights free radical damage while Turmeric reduces spots. Gives visibly brighter and even-toned skin.',
  '{"Volume": "30ml", "Key Ingredients": "Vitamin C, Turmeric", "Skin Type": "All Skin Types", "Free From": "Toxins, Parabens, SLS", "Dermatologically Tested": "Yes"}',
  7, 'Mamaearth', 399.00, 699.00, 350, 4.2, 45231, FALSE, FALSE
),
(
  'Dove Intense Repair Shampoo (700ml)',
  'dove-intense-repair-shampoo-700ml',
  'Dove Intense Repair Shampoo is specially formulated for damaged hair. It features Keratin Actives technology to repair from deep inside and make hair noticeably smoother after just one wash.',
  '{"Volume": "700ml", "Hair Type": "Damaged", "Technology": "Keratin Actives", "Key Benefit": "Repair & Strengthen"}',
  7, 'Dove', 399.00, 549.00, 280, 4.3, 34512, FALSE, FALSE
),

-- GROCERY
(
  'Tata Salt Lite Low Sodium Salt (1kg)',
  'tata-salt-lite-low-sodium-1kg',
  'Tata Salt Lite has 15% less sodium than regular salt. It is made using the patented sodium potassium technology. Helps in maintaining healthy blood pressure levels.',
  '{"Weight": "1kg", "Type": "Low Sodium", "Sodium Reduction": "15% less", "Iodized": "Yes"}',
  9, 'Tata', 39.00, 49.00, 1000, 4.5, 45231, FALSE, FALSE
),
(
  'Amul Butter (500g)',
  'amul-butter-500g',
  'Amul Butter is made from fresh cream. It is free from any additives and preservatives. Rich in Vitamins A & D. Perfect for cooking, baking, and spreading.',
  '{"Weight": "500g", "Type": "Salted Butter", "Fat Content": ">80%", "Storage": "Refrigerate after opening"}',
  9, 'Amul', 285.00, 310.00, 800, 4.6, 23451, FALSE, FALSE
),

-- OFFICE PRODUCTS
(
  'Classmate Composition Notebook A4 (Pack of 6)',
  'classmate-composition-notebook-a4-pack-6',
  'Classmate Composition Notebooks with 190 pages each. Ruled pages with margin for neat notes. Durable cover that withstands daily use. Ideal for students and professionals.',
  '{"Size": "A4", "Pages": "190 per notebook", "Pack": "6 notebooks", "Lines": "Single Line Ruled", "Binding": "Spiral"}',
  10, 'Classmate', 299.00, 499.00, 400, 4.3, 12341, FALSE, FALSE
),
(
  'HP LaserJet Pro M15w Wireless Laser Printer',
  'hp-laserjet-pro-m15w-wireless-laser-printer',
  'The world''s smallest desktop laser printer. Compact enough to fit anywhere. Print from anywhere with wireless connectivity. Fast print speed of up to 19 ppm. Easy setup with HP Smart app.',
  '{"Print Speed": "19 ppm", "Connectivity": "WiFi, USB", "Resolution": "600x600 dpi", "Monthly Duty Cycle": "Up to 8000 pages", "Weight": "3.63kg"}',
  10, 'HP', 9999.00, 14999.00, 40, 4.1, 5432, TRUE, FALSE
);

-- ============================================
-- PRODUCT IMAGES SEED DATA
-- Using Unsplash for high quality product images
-- ============================================

-- Samsung S24 Ultra images
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800', FALSE, 2),
(1, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', FALSE, 3);

-- iPhone images
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(2, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800', FALSE, 2),
(2, 'https://images.unsplash.com/photo-1574755393849-623942496936?w=800', FALSE, 3);

-- Sony Headphones
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', FALSE, 2),
(3, 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800', FALSE, 3);

-- LG TV
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(4, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=800', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800', FALSE, 2);

-- MacBook Air
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(5, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', FALSE, 2),
(5, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', FALSE, 3);

-- Boat Earphones
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(6, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', TRUE, 1),
(6, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', FALSE, 2);

-- Logitech Mouse
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', TRUE, 1),
(7, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800', FALSE, 2);

-- Atomic Habits
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(8, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800', TRUE, 1),
(8, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', FALSE, 2);

-- The Alchemist
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(9, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', TRUE, 1),
(9, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', FALSE, 2);

-- Rich Dad Poor Dad
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(10, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800', TRUE, 1),
(10, 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800', FALSE, 2);

-- Clean Code
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(11, 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=800', TRUE, 1),
(11, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800', FALSE, 2);

-- Levis Jeans
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(12, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', TRUE, 1),
(12, 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800', FALSE, 2),
(12, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800', FALSE, 3);

-- Nike Shoes
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(13, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', TRUE, 1),
(13, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', FALSE, 2),
(13, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800', FALSE, 3);

-- Peter England Shirt
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(14, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800', TRUE, 1),
(14, 'https://images.unsplash.com/photo-1594938298603-c8148c4b5b9e?w=800', FALSE, 2);

-- Instant Pot
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(15, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800', TRUE, 1),
(15, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', FALSE, 2);

-- Philips Air Fryer
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(16, 'https://images.unsplash.com/photo-1617481554497-2d94d51e80c9?w=800', TRUE, 1),
(16, 'https://images.unsplash.com/photo-1639821730278-29dc17f52bbd?w=800', FALSE, 2);

-- Prestige Pressure Cooker
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(17, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800', TRUE, 1);

-- Milton Flask
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(18, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800', TRUE, 1),
(18, 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800', FALSE, 2);

-- Pull Up Bar
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(19, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', TRUE, 1),
(19, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', FALSE, 2);

-- Cricket Ball
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(20, 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', TRUE, 1);

-- Adidas Shoes
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(21, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800', TRUE, 1),
(21, 'https://images.unsplash.com/photo-1566954116817-3e4c75e7f29e?w=800', FALSE, 2);

-- LEGO
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(22, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800', TRUE, 1),
(22, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', FALSE, 2);

-- Monopoly
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(23, 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800', TRUE, 1),
(23, 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=800', FALSE, 2);

-- Himalaya Face Wash
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(24, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', TRUE, 1);

-- Mamaearth Serum
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(25, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', TRUE, 1),
(25, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800', FALSE, 2);

-- Dove Shampoo
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(26, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800', TRUE, 1);

-- Tata Salt
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(27, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', TRUE, 1);

-- Amul Butter
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(28, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800', TRUE, 1);

-- Classmate Notebooks
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(29, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', TRUE, 1);

-- HP Printer
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(30, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800', TRUE, 1);

SELECT 'Seed data inserted successfully!' as message;
