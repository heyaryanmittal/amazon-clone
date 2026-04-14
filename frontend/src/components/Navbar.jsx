import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, ChevronDown, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { summary } = useCart();
  const { user, logout } = useAuth();

  const categories = [
    'All', 'Electronics', 'Books', 'Fashion', 'Home & Kitchen',
    'Sports & Fitness', 'Toys & Games', 'Beauty & Health', 'Grocery', 'Office Products'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (selectedCategory !== 'All') {
        params.set('category', selectedCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
      }
      navigate(`/products?${params.toString()}`);
    }
  };

  return (
    <nav className="navbar" id="main-navbar">
      {/* Main Navbar */}
      <div className="navbar-main">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-amazon">amazon</span>
          <span className="logo-in">.in</span>
        </Link>

        {/* Delivery Location */}
        <div className="navbar-deliver">
          <span className="deliver-label">Deliver to</span>
          <span className="deliver-location">
            <MapPin size={14} />
            India
          </span>
        </div>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch} id="search-form">
          <select
            className="search-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            id="search-category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
          <button type="submit" className="search-btn" id="search-btn">
            <Search size={20} />
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Account */}
          <div className="nav-action">
            <span className="nav-action-label">Hello, {user?.name?.split(' ')[0] || 'Sign in'}</span>
            <span className="nav-action-text">
              Account & Lists <ChevronDown size={12} style={{ display: 'inline' }} />
            </span>
          </div>

          {/* Orders */}
          <Link to="/orders" className="nav-action" id="nav-orders">
            <span className="nav-action-label">Returns</span>
            <span className="nav-action-text">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-cart" id="nav-cart">
            <div className="cart-icon-wrapper">
              <ShoppingCart size={32} />
              <span className="cart-count" id="cart-count">
                {summary.totalItems || 0}
              </span>
            </div>
            <span className="cart-text">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub Navbar */}
      <div className="navbar-sub">
        <div className="nav-sub-item bold">
          <Menu size={16} /> All
        </div>
        <Link to="/products?category=electronics" className="nav-sub-item">Electronics</Link>
        <Link to="/products?category=fashion" className="nav-sub-item">Fashion</Link>
        <Link to="/products?category=home-kitchen" className="nav-sub-item">Home & Kitchen</Link>
        <Link to="/products?category=books" className="nav-sub-item">Books</Link>
        <Link to="/products?category=sports-fitness" className="nav-sub-item">Sports</Link>
        <Link to="/products?category=toys-games" className="nav-sub-item">Toys & Games</Link>
        <Link to="/products?category=beauty-health" className="nav-sub-item">Beauty</Link>
        <Link to="/products?category=grocery" className="nav-sub-item">Grocery</Link>
        <Link to="/products?featured=true" className="nav-sub-item">Today's Deals</Link>
        <Link to="/wishlist" className="nav-sub-item">Wishlist</Link>
      </div>
    </nav>
  );
};

export default Navbar;
