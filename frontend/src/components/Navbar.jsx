import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, MapPin, ChevronDown, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { summary } = useCart();
  const { user, logout } = useAuth();
  
  const accountRef = useRef(null);
  const langRef = useRef(null);

  const categories = [
    'All Categories', 'Alexa Skills', 'Amazon Devices', 'Amazon Fashion', 'Amazon Fresh', 'Amazon Pharmacy', 'Appliances', 'Apps & Games', 'Baby', 'Beauty', 'Books', 'Car & Motorbike', 'Clothing & Accessories', 'Collectibles', 'Computers & Accessories', 'Electronics', 'Furniture', 'Garden & Outdoors', 'Gift Cards', 'Grocery & Gourmet Foods', 'Health & Personal Care', 'Home & Kitchen', 'Industrial & Scientific', 'Jewellery', 'Kindle Store', 'Luggage & Bags', 'Luxury Beauty', 'Movies & TV Shows', 'Music', 'Musical Instruments', 'Office Products', 'Pet Supplies', 'Prime Video', 'Shoes & Handbags', 'Software', 'Sports, Fitness & Outdoors', 'Subscribe & Save', 'Tools & Home Improvement', 'Toys & Games', 'Under ₹500', 'Video Games', 'Watches'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (selectedCategory !== 'All Categories') {
        params.set('category', selectedCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'));
      }
      navigate(`/products?${params.toString()}`);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-[1000] bg-[#131921] text-white flex flex-col" id="main-navbar">
        {/* Main Navbar Top */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 px-3 py-2 w-full">
          {/* Logo & Delivery Area */}
          <div className="flex items-center w-full sm:w-auto justify-between mb-2 sm:mb-0">
            <Link to="/" className="flex items-center px-2 py-1.5 border border-transparent rounded-[2px] no-underline focus:border-white transition-colors duration-150 hover:outline hover:outline-1 hover:outline-white mr-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-7 pt-1 filter invert" />
              <span className="text-[14px] text-white ml-0.5 mt-[-10px]">.in</span>
            </Link>

            <div className="flex flex-col px-2 py-1 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white hidden md:flex">
              <span className="text-[12px] text-[#cccccc] font-medium leading-3 pl-4">Delivering to Mumbai 400001</span>
              <span className="text-[14px] font-bold text-white flex items-center leading-4">
                <MapPin size={15} className="mr-1" />
                Update location
              </span>
            </div>
            
            {/* Mobile Account & Cart - Only visible on mobile header */}
            <div className="flex sm:hidden items-center gap-2">
               <span className="text-[14px]">Sign in <span>›</span></span>
               <User size={24} />
               <div className="relative">
                 <ShoppingCart size={28} />
                 <span className="absolute -top-1 -right-1 text-[#F08804] font-bold text-[14px] bg-[#131921] rounded-full w-5 h-5 flex items-center justify-center">{summary.totalItems || 0}</span>
               </div>
            </div>
          </div>

          {/* Search Bar */}
          <form className="flexflex-1 w-full sm:flex-1 flex h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#F08804]" onSubmit={handleSearch}>
            <div className="flex items-center h-full bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] px-2 cursor-pointer text-[#5f5f5f] text-[12px]">
              <select
                className="bg-transparent border-none text-[#5f5f5f] cursor-pointer focus:outline-none w-full appearance-none max-w-[50px] sm:max-w-max pr-4"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={14} className="ml-[-12px] pointer-events-none" />
            </div>
            <input
              type="text"
              className="flex-1 border-none px-3 text-[15px] text-[#111] outline-none min-w-0 placeholder-[#767676]"
              placeholder="Search Amazon.in"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] border-none px-4 cursor-pointer flex items-center justify-center transition-colors text-[#333]">
              <Search size={24} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
            {/* Language */}
            <div 
              className="relative flex items-center gap-1 px-2 py-2 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white font-bold text-[14px] leading-4"
              onMouseEnter={() => setIsLangMenuOpen(true)}
              onMouseLeave={() => setIsLangMenuOpen(false)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-3 w-4 mt-1 object-cover" />
              <span>EN</span>
              <ChevronDown size={12} className="text-[#a7acb2] mt-1 ml-0.5" />
              
              {isLangMenuOpen && (
                <div className="absolute top-[38px] right-0 w-60 bg-white text-[#111] border border-[#ccc] rounded-sm shadow-lg p-3 z-50">
                  <div className="text-[13px] mb-2 font-normal flex items-center gap-2">
                    <input type="radio" checked readOnly/> English - EN
                  </div>
                  <hr className="border-[#eee] my-2" />
                  <div className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer font-normal">Learn more</div>
                </div>
              )}
            </div>

            {/* Account */}
            <div 
              className="relative flex flex-col px-2 py-1 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white"
              onMouseEnter={() => setIsAccountMenuOpen(true)}
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <span className="text-[12px] text-white font-medium leading-3">Hello, {user?.name?.split(' ')[0] || 'sign in'}</span>
              <span className="text-[14px] font-bold flex items-center leading-4">
                Account & Lists <ChevronDown size={12} className="text-[#a7acb2] mt-1 ml-0.5" />
              </span>

              {isAccountMenuOpen && (
                <div className="absolute top-[38px] right-[-60px] w-[400px] bg-white text-[#111] border border-[#ccc] rounded-sm shadow-lg p-4 z-50 cursor-default">
                  {!user && (
                    <div className="text-center mb-4 border-b border-[#eee] pb-4">
                      <Link to="/login" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#111] text-[13px] font-bold rounded-md px-16 py-1.5 inline-block cursor-pointer">Sign in</Link>
                      <div className="text-[11px] mt-1">New customer? <Link to="/register" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link></div>
                    </div>
                  )}
                  <div className="flex font-normal">
                    <div className="flex-1 pr-4 border-r border-[#eee]">
                      <h3 className="font-bold text-[16px] mb-2">Your Lists</h3>
                      <Link to="/wishlist" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Create a Wish List</Link>
                      <Link to="/wishlist" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Wish from Any Website</Link>
                      <Link to="/wishlist" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Baby Wishlist</Link>
                    </div>
                    <div className="flex-1 pl-4">
                      <h3 className="font-bold text-[16px] mb-2">Your Account</h3>
                      <Link to="/account" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Your Account</Link>
                      <Link to="/orders" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Your Orders</Link>
                      <Link to="/wishlist" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Your Wish List</Link>
                      <Link to="/products" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Your Recommendations</Link>
                      <Link to="/prime" className="block text-[13px] text-[#333] hover:text-[#e47911] hover:underline mb-1">Your Prime Membership</Link>
                      {user && (
                        <button onClick={logout} className="block w-full text-left bg-transparent border-none text-[13px] text-[#333] hover:text-[#e47911] hover:underline mt-2 cursor-pointer p-0">Sign Out</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            <Link to="/orders" className="flex flex-col px-2 py-1 border border-transparent rounded-[2px] cursor-pointer no-underline text-white hover:outline hover:outline-1 hover:outline-white">
              <span className="text-[12px] text-white font-medium leading-3">Returns</span>
              <span className="text-[14px] font-bold leading-4">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center px-2 py-1 border border-transparent rounded-[2px] no-underline text-white hover:outline hover:outline-1 hover:outline-white">
              <div className="relative flex items-center">
                <div className="relative">
                  <span className="absolute left-1/2 -top-1 -translate-x-1/2 text-[#F08804] font-bold text-[16px] leading-none mb-1">{summary.totalItems || 0}</span>
                  <ShoppingCart size={38} strokeWidth={1.5} className="mt-1" />
                </div>
                <span className="text-[14px] font-bold leading-4 mt-4 ml-1 hidden lg:inline">Cart</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sub Navbar */}
        <div className="bg-[#232f3e] px-2 py-1 flex items-center gap-1 overflow-x-auto scrollbar-hide text-[14px]">
          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-white font-bold border border-transparent rounded-[2px] cursor-pointer whitespace-nowrap hover:outline hover:outline-1 hover:outline-white"
          >
            <Menu size={20} /> All
          </div>
          <Link to="/products?category=grocery" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Fresh</Link>
          <Link to="/videos" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Amazon miniTV</Link>
          <Link to="/seller" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Sell</Link>
          <Link to="/products?sort=bestselling" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Best Sellers</Link>
          <Link to="/products?category=mobiles" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Mobiles</Link>
          <Link to="/products?featured=true" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Today's Deals</Link>
          <Link to="/products?category=electronics" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Electronics</Link>
          <Link to="/prime" className="px-2 py-1 text-white font-bold border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">
            Prime <ChevronDown size={14} className="ml-1 text-[#a7acb2]" />
          </Link>
          <Link to="/support" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Customer Service</Link>
          <Link to="/products?sort=newest" className="px-2 py-1 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">New Releases</Link>
        </div>
      </nav>

      {/* Sidebar Overlay & Menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[2000] flex">
          {/* Dark transparent background */}
          <div 
            className="absolute inset-0 bg-black/70 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-[365px] bg-white h-full overflow-y-auto flex flex-col transform transition-transform shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-2 -right-12 text-white bg-transparent border-none cursor-pointer p-2 opacity-90 hover:opacity-100"
            >
              <X size={32} />
            </button>

            {/* Sidebar Header */}
            <div className="bg-[#232f3e] text-white p-4 pl-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={30} className="bg-white text-[#232f3e] rounded-full p-1" />
                <h2 className="text-[19px] font-bold">Hello, {user?.name?.split(' ')[0] || 'sign in'}</h2>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="py-2 text-[#111]">
              <div className="font-bold text-[18px] px-8 py-3">Trending</div>
              <Link to="/products?sort=bestselling" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Best Sellers</Link>
              <Link to="/products?sort=newest" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">New Releases</Link>
              <Link to="/products?category=electronics" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Movers and Shakers</Link>

              <hr className="border-[#d5d9d9] my-1 mx-8" />

              <div className="font-bold text-[18px] px-8 py-3 mt-1">Digital Content and Devices</div>
              <Link to="/videos" className="block px-8 py-3 bg-white text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Amazon miniTV - FREE entertainment <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/echo" className="block px-8 py-3 bg-white text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Echo & Alexa <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/firetv" className="block px-8 py-3 bg-white text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Fire TV <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/kindle" className="block px-8 py-3 bg-white text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Kindle E-Readers & eBooks <ChevronRight size={16} className="text-[#888]" /></Link>

              <hr className="border-[#d5d9d9] my-1 mx-8" />

              <div className="font-bold text-[18px] px-8 py-3 mt-1">Shop by Category</div>
              <Link to="/products?category=mobiles" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Mobiles, Computers <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=electronics" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">TV, Appliances, Electronics <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=fashion" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Men's Fashion <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=fashion" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Women's Fashion <ChevronRight size={16} className="text-[#888]" /></Link>
              <div className="px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center gap-2 cursor-pointer font-medium mt-1">
                <ChevronDown size={16} className="text-[#888]" /> See all
              </div>

              <hr className="border-[#d5d9d9] my-1 mx-8" />
              
              <div className="font-bold text-[18px] px-8 py-3 mt-1">Programs & Features</div>
              <Link to="/amazon-pay" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Amazon Pay</Link>
              <Link to="/prime" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Amazon Prime</Link>
              
              <hr className="border-[#d5d9d9] my-1 mx-8" />

              <div className="font-bold text-[18px] px-8 py-3 mt-1">Help & Settings</div>
              <Link to="/account" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Your Account</Link>
              <Link to="/support" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Customer Service</Link>
              {user ? (
                <button onClick={() => {logout(); setIsSidebarOpen(false);}} className="block w-full text-left px-8 py-3 bg-transparent border-none text-[14px] text-[#111] cursor-pointer hover:bg-[#eaeded]">Sign Out</button>
              ) : (
                <Link to="/login" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Navbar;
