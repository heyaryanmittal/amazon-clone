# Amazon Clone - Full Stack E-Commerce Application

A fully functional Amazon clone built with React, Node.js, Express, and MySQL. Replicates Amazon India's UI/UX with all core shopping features.

## 🔗 Links
- **GitHub**: https://github.com/heyaryanmittal/amazon-clone
- **Live Demo**: [Deployed URL]

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 (Vite), CSS, lucide-react  |
| Backend    | Node.js, Express.js                 |
| Database   | MySQL 8.0 (mysql2/promise)          |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| Deployment | Frontend → Vercel, Backend → Render |

---

## 📁 Project Structure

```
amazon-clone/
├── frontend/                    # React Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/            # Global state (Cart, Auth)
│   │   │   ├── CartContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API layer
│   │   ├── App.jsx             # Router + Providers
│   │   ├── main.jsx
│   │   └── index.css           # Global styles
│   └── vite.config.js
│
├── backend/                     # Express REST API
│   ├── config/
│   │   ├── db.js               # MySQL connection pool
│   │   ├── schema.sql          # Database schema
│   │   └── seed.sql            # Sample product data
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── auth.js
│   │   └── wishlist.js
│   ├── server.js               # Entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🗄️ Database Schema

**Tables:**
- `users` — User accounts (id, name, email, password, phone)
- `categories` — Product categories (id, name, slug, icon)
- `products` — Product catalog (id, name, price, stock, rating, is_prime, specifications JSON)
- `product_images` — Multiple images per product (primary flag, sort order)
- `cart` — Shopping cart (user_id, product_id, quantity — UNIQUE constraint)
- `orders` — Order records (order_id UUID, status enum, shipping address denormalized)
- `order_items` — Snapshot of ordered products (price at time of purchase)
- `wishlist` — Saved products (user_id, product_id — UNIQUE constraint)
- `reviews` — Product reviews (rating, title, body, is_verified)
- `addresses` — Saved shipping addresses

**Key Design Decisions:**
- Denormalized shipping address in orders (preserve historical data)
- JSON column for product specifications (flexible schema per category)
- Snapshot pricing in order_items (price at time of purchase)
- FULLTEXT index on product name + description for search

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm v9+

### 1. Clone the Repository
```bash
git clone https://github.com/heyaryanmittal/amazon-clone.git
cd amazon-clone
```

### 2. Database Setup
```sql
-- In MySQL Workbench or CLI:
mysql -u root -p < backend/config/schema.sql
mysql -u root -p amazon_clone < backend/config/seed.sql
```

Or run both files in MySQL Workbench.

### 3. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=amazon_clone
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (.env) — Optional
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Features Implemented

### Core Features
- [x] **Product Listing Page** — Grid layout, search, category filter, price filter, sort
- [x] **Product Detail Page** — Image carousel, specs table, buy box, related products
- [x] **Shopping Cart** — Add/remove/update quantity, subtotal, clear cart
- [x] **Order Placement** — Address form, payment method selection (COD/UPI/Card/NetBanking)
- [x] **Order Confirmation** — Unique order ID, delivery timeline, summary

### Bonus Features
- [x] **User Authentication** — JWT-based login/register
- [x] **Order History** — View all past orders with status
- [x] **Order Details** — Full itemized order with shipping info, cancel option
- [x] **Wishlist** — Add/remove products, persistent per user
- [x] **Responsive Design** — Mobile, tablet, desktop breakpoints
- [x] **Default User** — App works without login (default user ID=1)

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render
- Connect GitHub repo to Render
- Set environment variables in Render dashboard
- Start command: `node server.js`

### Database → PlanetScale / Railway MySQL
- Create a MySQL instance on Railway or PlanetScale
- Run schema.sql and seed.sql
- Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Render

---

## 📝 Assumptions Made

1. **Default User**: App assumes a default logged-in user (Aryan Mittal, ID=1) without requiring authentication for core flows
2. **Consistent Pricing**: GST (18%) is calculated at checkout on the frontend and stored in orders
3. **Demo Images**: Product images use Unsplash URLs; in production these would be uploaded to S3/Cloudinary
4. **Stock Management**: Stock is decremented when an order is placed; returns/cancellations don't restore stock in this demo
5. **Payment**: Payment is simulated (no actual payment gateway integration)
6. **Email**: Email notifications are optional and require SMTP credentials

---

## 👤 Author

**Aryan Mittal**  
SDE Intern Fullstack Assignment  
GitHub: [@heyaryanmittal](https://github.com/heyaryanmittal)
