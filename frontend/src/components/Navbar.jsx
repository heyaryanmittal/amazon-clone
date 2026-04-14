import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Menu, X, User } from 'lucide-react';
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

  const categories = [
    'All Categories', 'Alexa Skills', 'Amazon Devices', 'Amazon Fashion', 'Amazon Fresh', 'Appliances', 'Apps & Games', 'Baby', 'Beauty', 'Books', 'Car & Motorbike', 'Clothing & Accessories', 'Electronics', 'Furniture', 'Grocery & Gourmet Foods', 'Health & Personal Care', 'Home & Kitchen', 'Jewellery', 'Luggage & Bags', 'Movies & TV Shows', 'Music', 'Office Products', 'Pet Supplies', 'Prime Video', 'Shoes & Handbags', 'Software', 'Sports, Fitness & Outdoors', 'Tools & Home Improvement', 'Toys & Games', 'Video Games', 'Watches'
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
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-[6px] w-full min-h-[60px]">
          {/* Logo & Delivery Area */}
          <div className="flex items-center w-full sm:w-auto justify-between mb-2 sm:mb-0">
            <Link to="/" className="flex items-center px-2 py-2 border border-transparent rounded-[2px] no-underline focus:border-white transition-colors duration-150 hover:outline hover:outline-1 hover:outline-white mr-1 mt-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[30px] filter invert" style={{ transform: 'translateY(-2px)' }} />
              <span className="text-[14px] text-white ml-0.5 mt-[-14px]">.in</span>
            </Link>

            <div className="flex flex-col px-2 py-1.5 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white hidden md:flex min-w-max mr-1 ml-1 h-[50px] justify-center">
              <span className="text-[12px] text-[#cccccc] font-normal leading-3 pl-[18px]">Delivering to Gharroli 110091</span>
              <span className="text-[14px] font-bold text-white flex items-center leading-4 mt-[3px]">
                <MapPin size={16} className="mr-0.5" strokeWidth={2.5} />
                <span style={{ transform: 'translateY(-1px)' }}>Update location</span>
              </span>
            </div>
            
            {/* Mobile Account & Cart */}
            <div className="flex sm:hidden items-center gap-2">
               <span className="text-[14px]">Sign in <span>›</span></span>
               <User size={24} />
               <div className="relative">
                 <svg viewBox="0 0 38 40" className="w-10 h-10" fill="white">
                   <path d="M12 28a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm20 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm1.18-18L30 22H11l-1.5-12h23.68zm2.66-2H9L7.5 0H0v2h6.5l3.5 28H34v-2H11.5l-1-8h22.68l3-12h-3.34z" />
                 </svg>
                 <span className="absolute top-[6px] left-[18px] text-[#F08804] font-bold text-[15px]">{summary.totalItems || 0}</span>
               </div>
            </div>
          </div>

          {/* Search Bar */}
          <form className="flex-1 w-full sm:flex-1 flex h-10 rounded overflow-hidden bg-white focus-within:ring-[3px] focus-within:ring-[#F08804] border-none my-1" onSubmit={handleSearch}>
            <div className="relative flex items-center h-full bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] cursor-pointer text-[#5f5f5f] text-[12px] w-auto max-w-[50px] sm:max-w-[70px]">
              <select
                className="absolute inset-0 bg-transparent border-none text-transparent cursor-pointer focus:outline-none w-full appearance-none z-10"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="text-black">{cat === 'All Categories' ? 'All' : cat}</option>
                ))}
              </select>
              <div className="flex items-center justify-between w-full px-2 pointer-events-none">
                <span className="truncate mr-1 leading-none">{selectedCategory === 'All Categories' ? 'All' : selectedCategory}</span>
                <ChevronDown size={14} className="text-[#5f5f5f] shrink-0 fill-current" strokeWidth={1} style={{ stroke: 'currentColor' }} />
              </div>
            </div>
            <input
              type="text"
              className="flex-1 border-none px-3 text-[15px] text-[#111] outline-none min-w-0 placeholder-[#767676] bg-white h-full"
              placeholder="Search Amazon.in"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] border-none w-[45px] h-full cursor-pointer flex items-center justify-center transition-colors text-[#333] shrink-0">
              <Search size={22} strokeWidth={2} />
            </button>
          </form>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-0.5 shrink-0 ml-1">
            {/* Language */}
            <div 
              className="relative flex items-end gap-1 px-2 py-2.5 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white font-bold text-[14px] leading-4 h-[50px] mr-1"
              onMouseEnter={() => setIsLangMenuOpen(true)}
              onMouseLeave={() => setIsLangMenuOpen(false)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-[14px] w-5 object-cover mb-[2px]" />
              <span className="ml-[2px] mb-[1px]">EN</span>
              <div className="flex items-end text-[#a7acb2] mb-[3px] ml-0.5">
                 <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </div>
            </div>

            {/* Account */}
            <div 
              className="relative flex flex-col px-2 py-2 border border-transparent rounded-[2px] cursor-pointer hover:outline hover:outline-1 hover:outline-white min-w-max h-[50px] justify-center"
              onMouseEnter={() => setIsAccountMenuOpen(true)}
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <span className="text-[12px] text-white font-normal leading-3 mb-[3px]">Hello, sign in</span>
              <span className="text-[14px] font-bold flex items-center leading-3">
                Account & Lists <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="ml-1 text-[#a7acb2]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </span>
            </div>

            {/* Orders */}
            <Link to="/orders" className="flex flex-col px-2 py-2 border border-transparent rounded-[2px] cursor-pointer no-underline text-white hover:outline hover:outline-1 hover:outline-white min-w-max h-[50px] justify-center">
              <span className="text-[12px] text-white font-normal leading-3 mb-[3px]">Returns</span>
              <span className="text-[14px] font-bold leading-3">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center px-2 py-2 border border-transparent rounded-[2px] no-underline text-white hover:outline hover:outline-1 hover:outline-white h-[50px]">
              <div className="relative flex items-center pt-2">
                <div className="relative flex flex-col items-center">
                  <span className="absolute -top-3 left-[15px] w-full text-center text-[#F08804] font-bold text-[16px] leading-[14px]">{summary.totalItems || 0}</span>
                  <svg viewBox="0 0 38 40" className="w-[38px] h-9" fill="white">
                     <path d="M12 28a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm20 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm1.18-18L30 22H11l-1.5-12h23.68zm2.66-2H9L7.5 0H0v2h6.5l3.5 28H34v-2H11.5l-1-8h22.68l3-12h-3.34z" />
                  </svg>
                </div>
                <span className="text-[14px] font-bold leading-4 mt-2 hidden lg:inline" style={{ transform: 'translateY(2px)' }}>Cart</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sub Navbar */}
        <div className="bg-[#232f3e] px-4 min-h-[39px] flex items-center justify-between text-[14px]">
          <div className="flex items-center gap-[1px] overflow-x-auto scrollbar-hide">
            <div 
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1 px-2 py-1.5 text-white font-bold border border-transparent rounded-[2px] cursor-pointer whitespace-nowrap hover:outline hover:outline-1 hover:outline-white mr-1"
            >
              <Menu size={22} strokeWidth={2.5} style={{ transform: 'translateY(-1px)' }}/> All
            </div>
            <Link to="/products?category=grocery" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">
              Fresh <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }}/>
            </Link>
            <Link to="/videos" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">
              MX Player <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }}/>
            </Link>
            <Link to="/seller" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Sell</Link>
            <Link to="/products?sort=bestselling" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Bestsellers</Link>
            <Link to="/products?category=mobiles" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Mobiles</Link>
            <Link to="/products?featured=true" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Today's Deals</Link>
            <Link to="/support" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">Customer Service</Link>
            <Link to="/products?sort=newest" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white">New Releases</Link>
            <Link to="/prime" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">
              Prime <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }}/>
            </Link>
            <Link to="/products?category=fashion" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">Fashion</Link>
            <Link to="/products?category=electronics" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">Electronics</Link>
            <Link to="/amazon-pay" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:outline hover:outline-1 hover:outline-white flex items-center">Amazon Pay</Link>
          </div>
          <div className="hidden xl:flex shrink-0 px-2 cursor-pointer items-center justify-center h-full hover:outline hover:outline-1 hover:outline-white border border-transparent rounded-[2px] mr-2 gap-2">
            <span className="font-extrabold italic text-[#FF9900] text-[18px] tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>
              SUMMER <span className="text-white">ESCAPE</span> SALE
            </span>
            <span className="font-bold text-[15px] ml-1">Save 13% on flights</span>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay & Menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[2000] flex">
          {/* Dark transparent background */}
          <div 
            className="absolute inset-0 bg-black/70 animate-[opacity_0.3s_ease-in-out]"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-[80%] max-w-[365px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl animate-[slideIn_0.3s_ease-out]">
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
