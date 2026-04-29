# 🛒 Amazon Clone - Full Stack E-Commerce Platform

A high-performance, full-stack Amazon clone built with a modern tech stack centered around **React 19**, **Node.js**, **Prisma**, and **PostgreSQL**. This project meticulously replicates the core shopping experience of Amazon India, featuring a responsive UI, robust backend architecture, and seamless user flows.

[![Live Demo](https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge&logo=vercel)](https://assignment-ac.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/heyaryanmittal/amazon-clone)

---

## 🌟 Key Features

### 🛍️ Frontend (Client Side)
- **Dynamic Homepage**: Hero banners, category snippets, and curated product scrollers.
- **Advanced Product Catalog**: Multi-faceted filtering (category, price range), real-time search, and sorting.
- **Rich Product Details**: High-resolution image carousels, detailed specifications, stock availability, and verified reviews.
- **State-of-the-Art Cart**: Real-time quantity updates, subtotal calculations, and persistent storage via React Context.
- **Seamless Checkout**: Address management, multiple simulated payment methods, and GST calculations.
- **User Dashboard**: Comprehensive order history, tracking status, and individual order details.
- **Professional Invoicing**: PDF-ready invoice generation for all completed orders.
- **Wishlist Management**: Personalized "Save for Later" functionality.

### ⚙️ Backend (Server Side)
- **RESTful API**: Clean, versioned endpoints for all e-commerce operations.
- **Prisma ORM**: Type-safe database queries and automated schema migrations.
- **Secure Authentication**: JWT-based auth with salted password hashing (Bcrypt).
- **Performance Optimized**: Gzip compression and server-side request parsing.
- **CORS Configured**: Strict origin validation for production security.
- **Error Handling**: Centralized error middleware for robust debugging.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite 8)
- **Styling**: Tailwind CSS 4.0
- **Data Fetching**: TanStack Query (React Query) v5
- **Icons**: Lucide React
- **Notifications**: React Hot Toast & Toastify

### Backend
- **Runtime**: Node.js (Express.js)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT)
- **Utilities**: Multer (File uploads), Nodemailer, UUID, Compression

---

## 📂 Project Architecture

```text
amazon-clone/
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/     # Reusable UI Blocks (Navbar, Footer, Cards)
│   │   ├── context/        # Global State Management (Cart, Auth, Wishlist)
│   │   ├── pages/          # Route Views (Home, Products, Checkout)
│   │   ├── services/       # API Integration Layer (Axios)
│   │   └── hooks/          # Custom React Hooks
│   └── public/             # Static Assets
│
├── backend/                 # Node.js API
│   ├── prisma/             # Schema definition & Migrations
│   ├── routes/             # API Route Handlers
│   ├── middleware/         # Auth & Error Handlers
│   ├── uploads/            # Local storage for product images
│   └── server.js           # Server entry point
│
└── config/                 # Global configurations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- PostgreSQL Database (Local or Cloud instance)
- npm or yarn

### 1. Database Setup
Ensure you have a PostgreSQL connection string ready.
```bash
# In backend directory
npx prisma db push
node seedData.js # Optional: Seed initial product data
```

### 2. Backend Installation
```bash
cd backend
npm install
# Create .env file with DATABASE_URL, DIRECT_URL, JWT_SECRET
npm start
```

### 3. Frontend Installation
```bash
cd frontend
npm install
# Create .env file with VITE_API_URL
npm run dev
```

---

## ⚡ Performance Optimizations
- **Data Caching**: Implemented TanStack Query for efficient client-side caching and revalidation.
- **Payload Compression**: Enabled Gzip compression on the backend to reduce network latency.
- **Code Splitting**: Native Vite optimization for faster initial page loads.
- **Optimistic Updates**: Smooth UX for cart and wishlist interactions.

---

## 👤 Author
**Aryan Mittal**
- **LinkedIn**: [heyaryanmittal](https://www.linkedin.com/in/heyaryanmittal)
- **Portfolio**: [aryan-mittal.vercel.app](https://aryan-mittal.vercel.app/)
- **GitHub**: [@heyaryanmittal](https://github.com/heyaryanmittal)

---

## 📄 License
This project is for educational purposes only. Original Amazon branding is property of Amazon.com, Inc.
