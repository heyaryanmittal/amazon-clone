import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, ChevronDown, ChevronUp, ChevronRight, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import LocationModal from './LocationModal';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSeeAllCategoriesOpen, setIsSeeAllCategoriesOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { summary = { totalItems: 0, subtotal: 0 } } = useCart();
  const { user, logout } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('New Delhi 110001');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  const categories = [
    'All Categories', 'Alexa Skills', 'Amazon Devices', 'Amazon Fashion', 'Amazon Fresh', 'Amazon Fresh Meat', 'Amazon Pharmacy', 'Appliances', 'Apps & Games', 'Audible Audiobooks', 'Baby', 'Beauty', 'Books', 'Car & Motorbike', 'Clothing & Accessories', 'Collectibles', 'Computers & Accessories', 'Deals', 'Electronics', 'Furniture', 'Garden & Outdoors', 'Gift Cards', 'Grocery & Gourmet Foods', 'Health & Personal Care', 'Home & Kitchen', 'Industrial & Scientific', 'Jewellery', 'Kindle Store', 'Luggage & Bags', 'Luxury Beauty', 'Movies & TV Shows', 'MP3 Music', 'Music', 'Musical Instruments', 'Office Products', 'Pet Supplies', 'Prime Video', 'Shoes & Handbags', 'Software', 'Sports, Fitness & Outdoors', 'Subscribe & Save', 'Tools & Home Improvement', 'Toys & Games', 'Under ₹500', 'Video Games', 'Watches'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim() || selectedCategory !== 'all-categories') {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory !== 'all-categories') params.set('category', selectedCategory);
      navigate(`/products?${params.toString()}`);
    } else if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Debounced live search suggestions
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      getProducts({ search: value.trim(), limit: 7 })
        .then(({ data }) => {
          const suggestions = (data.products || []).map(p => ({
            id: p.id,
            name: p.name,
            category_name: p.category_name,
            price: p.price,
            image_url: p.image_url,
          }));
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
        })
        .catch(() => {});
    }, 250);
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion.name)}`);
  };

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target) && 
        searchInputRef.current && 
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Portfolio Disclaimer Banner */}
      <div className="bg-[#FFFFE0] text-[#856404] text-[11px] py-1 px-4 text-center border-b border-[#ffeeba] font-sans">
        <strong>⚠️ Portfolio Project:</strong> This is a demo clone for educational purposes. No real transactions are processed. Please do not enter real sensitive data.
      </div>
      <nav className="sticky top-0 z-[1000] bg-[#131921] text-white flex flex-col" id="main-navbar">
        {/* Main Navbar Top */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-[6px] w-full min-h-[60px]">
          {/* Logo & Delivery Area */}
          <div className="flex items-center w-full sm:w-auto justify-between mb-1 sm:mb-0">
            <Link to="/" className="flex items-center px-1 sm:px-2 py-1 sm:py-2 border border-transparent rounded-[2px] no-underline transition-colors duration-150 hover:border-white mr-1 mt-1 shrink-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[24px] sm:h-[30px] filter invert hue-rotate-180" style={{ transform: 'translateY(-2px)' }} />
              <span className="text-[12px] sm:text-[14px] text-white ml-0.5 mt-[-10px] sm:mt-[-14px]">.in</span>
            </Link>

            <div 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex flex-col px-2 py-1.5 border border-transparent rounded-[2px] cursor-pointer hover:border-white hidden md:flex min-w-max mr-1 ml-1 h-[50px] justify-center"
            >
              <span className="text-[12px] text-[#cccccc] font-normal leading-3 pl-[18px]">Delivering to {currentLocation}</span>
              <span className="text-[14px] font-bold text-white flex items-center leading-4 mt-[3px]">
                <MapPin size={16} className="mr-0.5" strokeWidth={2.5} />
                <span style={{ transform: 'translateY(-1px)' }}>Update location</span>
              </span>
            </div>

            {/* Mobile Account & Cart */}
            <div className="flex sm:hidden items-center gap-3 pr-1">
              <Link to="/login" className="text-[13px] text-white no-underline flex items-center gap-1">
                <span className="font-medium whitespace-nowrap">Sign in</span>
                <ChevronRight size={14} className="mt-0.5" />
              </Link>
              <User size={20} className="text-white" />
              <Link to="/cart" className="relative flex items-center">
                <svg viewBox="0 0 38 40" className="w-8 h-8" fill="white">
                  <path d="M12 28a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm20 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm1.18-18L30 22H11l-1.5-12h23.68zm2.66-2H9L7.5 0H0v2h6.5l3.5 28H34v-2H11.5l-1-8h22.68l3-12h-3.34z" />
                </svg>
                <span className="absolute top-[4px] left-[15px] text-[#F08804] font-bold text-[14px]">{summary.totalItems || 0}</span>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form className="flex-1 w-full sm:flex-1 flex h-10 rounded overflow-hidden bg-white focus-within:ring-[3px] focus-within:ring-[#F08804] border-none my-1 relative" onSubmit={handleSearch} ref={searchInputRef}>
            <div className="relative flex items-center h-full bg-[#f3f3f3] hover:bg-[#dadada] border-r border-[#cdcdcd] cursor-pointer text-[#5f5f5f] text-[12px] w-auto max-w-[50px] sm:max-w-[70px]">
              <select
                className="absolute inset-0 bg-transparent border-none text-transparent cursor-pointer focus:outline-none w-full appearance-none z-10"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option 
                    key={cat} 
                    value={cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                    className="text-black bg-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-between w-full px-2 pointer-events-none">
                <span className="truncate mr-1 leading-none">
                  {categories.find(c => c.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedCategory) || 'All'}
                </span>
                <ChevronDown size={14} className="text-[#5f5f5f] shrink-0 fill-current" strokeWidth={1} style={{ stroke: 'currentColor' }} />
              </div>
            </div>
            <input
              type="text"
              className="flex-1 border-none px-3 text-[15px] text-[#111] outline-none min-w-0 placeholder-[#767676] bg-white h-full"
              placeholder="Search Amazon.in"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] border-none w-[45px] h-full cursor-pointer flex items-center justify-center transition-colors text-[#333] shrink-0">
              <Search size={22} strokeWidth={2} />
            </button>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute top-[calc(100%+2px)] left-0 right-0 bg-white border border-[#ccc] rounded-b-[4px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] z-[9999] max-h-[400px] overflow-y-auto">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => selectSuggestion(suggestion)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#eee] cursor-pointer transition-colors border-b border-[#f0f0f0] last:border-none"
                  >
                    <Search size={14} className="text-[#999] shrink-0" />
                    <div className="w-[36px] h-[36px] bg-[#f7f7f7] rounded flex items-center justify-center shrink-0 overflow-hidden border border-[#eee]">
                      <img 
                        src={suggestion.image_url} 
                        alt="" 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-[#0f1111] line-clamp-1">{suggestion.name}</div>
                      <div className="text-[11px] text-[#565959]">{suggestion.category_name} · ₹{suggestion.price?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
                <div
                  onClick={handleSearch}
                  className="px-4 py-2.5 text-[13px] text-[#007185] hover:bg-[#f3f3f3] cursor-pointer text-center font-medium border-t border-[#ddd]"
                >
                  See all results for "{searchQuery}"
                </div>
              </div>
            )}
          </form>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-0.5 shrink-0 ml-1">
            {/* Language */}
            <div
              className="relative flex items-end gap-1 px-2 py-2.5 border border-transparent rounded-[2px] cursor-pointer hover:border-white font-bold text-[14px] leading-4 h-[50px] mr-1"
              onMouseEnter={() => setIsLangMenuOpen(true)}
              onMouseLeave={() => setIsLangMenuOpen(false)}
              onClick={() => navigate('/language-settings')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-[14px] w-5 object-cover mb-[2px]" />
              <span className="ml-[2px] mb-[1px]">EN</span>
              <div className="flex items-end text-[#a7acb2] mb-[3px] ml-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
              </div>

              {/* Language Hover Menu */}
              {isLangMenuOpen && (
                <div className="absolute top-[48px] left-[-40px] w-[240px] bg-white text-[#111] border border-[#ccc] rounded-[3px] shadow-lg z-50 cursor-default px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  {/* Arrow Notch */}
                  <div className="absolute top-[-6px] left-[65px] w-3 h-3 bg-white border-t border-l border-[#ccc] transform rotate-45 z-0"></div>

                  <div className="relative z-10 w-full flex flex-col pt-1">
                    <p className="text-[#555] text-[13px] mb-2 mt-0 flex items-center justify-between font-medium">Change Language <Link to="/language-settings" className="text-[#007185] hover:text-[#c45500] hover:underline font-normal ml-auto">Learn more</Link></p>

                    <div className="flex items-center gap-2 mt-1 mb-2 hover:bg-[#f3f3f3] py-1 cursor-pointer">
                      <div className="w-[14px] h-[14px] rounded-full border border-[#db4002] flex items-center justify-center p-[2px]">
                        <div className="w-full h-full bg-[#db4002] rounded-full"></div>
                      </div>
                      <span className="text-[13px] font-normal text-[#111]">English - EN</span>
                    </div>

                    <hr className="border-t border-[#eee] my-1" />

                    {['हिन्दी - HI', 'தமிழ் - TA', 'తెలుగు - TE', 'ಕನ್ನಡ - KN', 'മലയാളം - ML', 'বাংলা - BN', 'मराठी - MR'].map(lang => (
                      <div key={lang} className="flex items-center gap-2 my-[1px] hover:bg-[#f8f8f8] py-[5px] cursor-pointer group">
                        <div className="w-[14px] h-[14px] rounded-full border border-[#999] group-hover:border-[#db4002] flex items-center justify-center"></div>
                        <span className="text-[13px] font-normal text-[#111] group-hover:text-[#db4002] group-hover:underline">{lang}</span>
                      </div>
                    ))}

                    <hr className="border-t border-[#eee] my-2" />

                    <div className="flex flex-col mt-0.5">
                      <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="h-[12px] w-[18px] object-cover" />
                        <span className="text-[13px] font-normal text-[#111]">You are shopping on Amazon.in</span>
                      </div>
                      <Link to="/language-settings" className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline font-normal text-center mt-3">Change country/region</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            <div
              className="relative flex flex-col px-2 py-2 border border-transparent rounded-[2px] cursor-pointer hover:border-white min-w-max h-[50px] justify-center"
              onMouseEnter={() => setIsAccountMenuOpen(true)}
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <span className="text-[12px] text-white font-normal leading-3 mb-[3px]">Hello, {user ? user.name.split(' ')[0] : 'sign in'}</span>
              <span className="text-[14px] font-bold flex items-center leading-3">
                Account & Lists <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="ml-1 text-[#a7acb2]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
              </span>

              {/* Account Hover Menu */}
              {isAccountMenuOpen && (
                <div className="absolute top-[48px] right-[-70px] w-[500px] bg-white text-[#111] border border-[#ddd] rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] z-50 cursor-default p-0" onClick={(e) => e.stopPropagation()}>
                  {/* Arrow Notch */}
                  <div className="absolute top-[-7px] right-[100px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>

                  <div className="relative z-10 w-full flex flex-col pt-0">
                    <div className="flex flex-col items-center justify-center border-b border-[#eee] py-4 bg-[#fcfcfc] rounded-t-[3px]">
                      <Link 
                        to="/login" 
                        className="w-[200px] text-center rounded-[3px] py-2 text-[13px] text-black font-medium no-underline border border-[#a88734] shadow-sm transform hover:scale-[1.01] active:scale-[0.98] transition-all"
                        style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
                      >
                        Sign in
                      </Link>
                      <div className="text-[11px] mt-2">
                        New customer? <Link to="/register" className="text-[#004b91] hover:text-[#c45500] hover:underline">Start here.</Link>
                      </div>
                    </div>
                    
                    <div className="flex w-full pt-1 pb-4">
                      {/* Left Column: Your Lists */}
                      <div className="flex-1 border-r border-[#eee] px-6">
                        <h3 className="font-bold text-[16px] mb-2 text-black text-left mt-2">Your Lists</h3>
                        <ul className="list-none p-0 m-0 space-y-1.5 text-left">
                          {['Create a Wish List', 'Wish from Any Website', 'Baby Wishlist', 'Discover Your Style', 'Explore Showroom'].map(item => (
                            <li key={item}><Link to="#" className="text-[13px] text-[#444] hover:text-[#c45500] hover:underline block no-underline">{item}</Link></li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column: Your Account */}
                      <div className="flex-1 pl-6 pr-4">
                        <h3 className="font-bold text-[16px] mb-2 text-black text-left mt-2">Your Account</h3>
                        <ul className="list-none p-0 m-0 space-y-1.5 text-left">
                          {['Your Account', 'Your Orders', 'Your Wish List', 'Keep shopping for', 'Your Recommendations', 'Your Prime Membership', 'Your Prime Video', 'Your Subscribe & Save Items', 'Memberships & Subscriptions', 'Your Seller Account', 'Manage Your Content and Devices', 'Register for a free Business Account'].map(item => (
                            <li key={item}><Link to={item === 'Your Orders' ? '/orders' : (item === 'Your Wish List' ? '/wishlist' : '#')} className="text-[13px] text-[#444] hover:text-[#c45500] hover:underline block no-underline">{item}</Link></li>
                          ))}
                          {user && (
                            <li className="mt-2 pt-2 border-t border-[#eee]">
                              <button onClick={() => logout()} className="text-[13px] text-[#444] hover:text-[#c45500] hover:underline block w-full text-left bg-transparent border-none p-0 cursor-pointer font-normal">Sign Out</button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Orders */}
            <Link to="/orders" className="flex flex-col px-2 py-2 border border-transparent rounded-[2px] cursor-pointer no-underline text-white hover:border-white min-w-max h-[50px] justify-center">
              <span className="text-[12px] text-white font-normal leading-3 mb-[3px]">Returns</span>
              <span className="text-[14px] font-bold leading-3">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center px-2 py-2 border border-transparent rounded-[2px] no-underline text-white hover:border-white h-[50px]">
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
              className="flex items-center gap-1 px-2 py-1.5 text-white font-bold border border-transparent rounded-[2px] cursor-pointer whitespace-nowrap hover:border-white mr-1"
            >
              <Menu size={22} strokeWidth={2.5} style={{ transform: 'translateY(-1px)' }} /> All
            </div>
            <Link to="/products?category=grocery" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">
              Fresh <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }} />
            </Link>
            <Link to="/videos" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">
              MX Player <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }} />
            </Link>
            <Link to="/seller" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">Sell</Link>
            <Link to="/products?sort=bestselling" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">Bestsellers</Link>
            <Link to="/products?category=electronics" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">Mobiles</Link>
            <Link to="/products?featured=true" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">Today's Deals</Link>
            <Link to="/support" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">Customer Service</Link>
            <Link to="/products?sort=newest" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white">New Releases</Link>
            <Link to="/prime" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">
              Prime <ChevronDown size={11} className="ml-[2px] text-[#a7acb2]" strokeWidth={3} style={{ transform: 'translateY(1px)' }} />
            </Link>
            <Link to="/products?category=fashion" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">Fashion</Link>
            <Link to="/products?category=electronics" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">Electronics</Link>
            <Link to="/amazon-pay" className="px-2 py-1.5 text-white border border-transparent rounded-[2px] no-underline whitespace-nowrap hover:border-white flex items-center">Amazon Pay</Link>
          </div>
          <div className="hidden xl:flex shrink-0 px-2 cursor-pointer items-center justify-center h-full hover:border-white border border-transparent rounded-[2px] mr-2 gap-2">
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
            onClick={() => { setIsSidebarOpen(false); setIsSeeAllCategoriesOpen(false); }}
          ></div>

          {/* Sidebar */}
          <div className="relative w-[80%] max-w-[365px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl animate-[slideIn_0.3s_ease-out]">
            {/* Close Button */}
            <button
              onClick={() => { setIsSidebarOpen(false); setIsSeeAllCategoriesOpen(false); }}
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
              <Link to="/products?category=electronics" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Mobiles, Computers <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=electronics" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">TV, Appliances, Electronics <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=mens-fashion" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Men's Fashion <ChevronRight size={16} className="text-[#888]" /></Link>
              <Link to="/products?category=womens-fashion" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Women's Fashion <ChevronRight size={16} className="text-[#888]" /></Link>
              {isSeeAllCategoriesOpen && (
                <>
                  <div className="border-t border-[#d5d9d9] my-1 mx-8"></div>
                  <Link to="/products?category=home" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Home, Kitchen, Pets <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=beauty" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Beauty, Health, Grocery <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=sports" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Sports, Fitness, Bags, Luggage <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=toys" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Toys, Baby Products, Kids' Fashion <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=automotive" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Car, Motorbike, Industrial <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=books" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Books <ChevronRight size={16} className="text-[#888]" /></Link>
                  <Link to="/products?category=movies" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center justify-between">Movies, Music & Video Games <ChevronRight size={16} className="text-[#888]" /></Link>
                </>
              )}
              <div 
                className="px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded] flex items-center gap-2 cursor-pointer font-medium mt-1"
                onClick={() => setIsSeeAllCategoriesOpen(!isSeeAllCategoriesOpen)}
              >
                {isSeeAllCategoriesOpen ? (
                  <><ChevronUp size={16} className="text-[#888]" /> see less</>
                ) : (
                  <><ChevronDown size={16} className="text-[#888]" /> See all</>
                )}
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
                <button onClick={() => { logout(); setIsSidebarOpen(false); }} className="block w-full text-left px-8 py-3 bg-transparent border-none text-[14px] text-[#111] cursor-pointer hover:bg-[#eaeded]">Sign Out</button>
              ) : (
                <Link to="/login" className="block px-8 py-3 text-[14px] text-[#111] no-underline hover:bg-[#eaeded]">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      )}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onApplyPincode={(loc) => setCurrentLocation(loc)}
      />
    </>
  );
};


export default Navbar;
