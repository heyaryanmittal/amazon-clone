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
    <nav className="sticky top-0 z-[1000] bg-[#131921] text-white" id="main-navbar">
      {/* Main Navbar */}
      <div className="flex items-center gap-2 px-3 py-2 h-[60px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 px-2 py-1.5 border border-transparent rounded-[3px] no-underline shrink-0 hover:border-white transition-colors duration-150" id="navbar-logo">
          <span className="text-2xl font-extrabold text-white tracking-tighter">amazon</span>
          <span className="text-[11px] text-[#FF9900] font-semibold ml-0.5 self-end mb-0.5">.in</span>
        </Link>

        {/* Delivery Location */}
        <div className="flex flex-col px-2 py-1 border border-transparent rounded-[3px] cursor-pointer shrink-0 hover:border-white transition-colors duration-150">
          <span className="text-[11px] text-[#ccc]">Deliver to</span>
          <span className="text-[13px] font-bold text-white flex items-center gap-1">
            <MapPin size={14} />
            India
          </span>
        </div>

        {/* Search Bar */}
        <form className="flex-1 flex h-10 rounded-md overflow-hidden min-w-0" onSubmit={handleSearch} id="search-form">
          <select
            className="bg-[#f3f3f3] border-none px-2 text-[12px] text-[#333] cursor-pointer border-r border-[#cdcdcd] min-w-[50px] max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis"
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
            className="flex-1 border-none px-3 text-[15px] text-[#333] outline-none min-w-0"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
          <button type="submit" className="bg-[#FF9900] hover:bg-[#e68a00] border-none px-3.5 cursor-pointer flex items-center justify-center transition-colors duration-150 shrink-0 text-[#333]" id="search-btn">
            <Search size={20} />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Account */}
          <div className="flex flex-col px-2 py-1.5 border border-transparent rounded-[3px] cursor-pointer no-underline text-white hover:border-white transition-colors duration-150 whitespace-nowrap">
            <span className="text-[11px] text-[#ccc]">Hello, {user?.name?.split(' ')[0] || 'Sign in'}</span>
            <span className="text-[13px] font-bold">
              Account & Lists <ChevronDown size={12} style={{ display: 'inline' }} />
            </span>
          </div>

          {/* Orders */}
          <Link to="/orders" className="flex flex-col px-2 py-1.5 border border-transparent rounded-[3px] cursor-pointer no-underline text-white hover:border-white transition-colors duration-150 whitespace-nowrap" id="nav-orders">
            <span className="text-[11px] text-[#ccc]">Returns</span>
            <span className="text-[13px] font-bold">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end gap-1 px-2 py-1.5 border border-transparent rounded-[3px] no-underline text-white hover:border-white transition-colors duration-150" id="nav-cart">
            <div className="relative">
              <ShoppingCart size={32} />
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#FF9900] text-[#333] text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none" id="cart-count">
                {summary.totalItems || 0}
              </span>
            </div>
            <span className="text-[13px] font-bold self-end">Cart</span>
          </Link>
        </div>
      </div>

      {/* Sub Navbar */}
      <div className="bg-[#232f3e] px-3 py-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-bold border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">
          <Menu size={20} /> All
        </div>
        <Link to="/products?category=grocery" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Fresh</Link>
        <Link to="/videos" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Amazon miniTV</Link>
        <Link to="/seller" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Sell</Link>
        <Link to="/products?sort=bestselling" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Best Sellers</Link>
        <Link to="/products?category=mobiles" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Mobiles</Link>
        <Link to="/products?featured=true" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Today's Deals</Link>
        <Link to="/products?category=electronics" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Electronics</Link>
        <Link to="/prime" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Prime</Link>
        <Link to="/support" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Customer Service</Link>
        <Link to="/products?sort=newest" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">New Releases</Link>
        <Link to="/products?category=home-kitchen" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Home & Kitchen</Link>
        <Link to="/amazon-pay" className="flex items-center gap-1 px-2 py-1.5 text-white text-[14px] font-medium border border-transparent rounded-[3px] no-underline cursor-pointer whitespace-nowrap hover:border-white transition-colors duration-150">Amazon Pay</Link>
      </div>
    </nav>
  );
};

export default Navbar;
