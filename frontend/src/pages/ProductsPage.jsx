import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp, Heart, X, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { getProducts, getCategories, addToWishlist, removeFromWishlist, getWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isRatingExpanded, setIsRatingExpanded] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const sortRef = useRef(null);

  const navigate = useNavigate();
  const query = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { addToCart } = useCart();

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Avg. Customer Review' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  // Price ranges
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Over ₹10,000', min: 10000, max: 999999 },
  ];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch categories once
  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(console.error);

    const token = localStorage.getItem('amazon_token');
    if (token) {
      getWishlist().then(({ data }) => {
        setWishlistIds(new Set(data.items.map(item => item.id)));
      }).catch(() => {});
    }
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    setLoading(true);

    // Map sort value to API params
    let apiSortBy = 'createdAt';
    let apiSortOrder = 'desc';
    switch (sortBy) {
      case 'price-asc': apiSortBy = 'price'; apiSortOrder = 'asc'; break;
      case 'price-desc': apiSortBy = 'price'; apiSortOrder = 'desc'; break;
      case 'rating': apiSortBy = 'rating'; apiSortOrder = 'desc'; break;
      case 'newest': apiSortBy = 'createdAt'; apiSortOrder = 'desc'; break;
      case 'name-asc': apiSortBy = 'name'; apiSortOrder = 'asc'; break;
      case 'name-desc': apiSortBy = 'name'; apiSortOrder = 'desc'; break;
      default: apiSortBy = 'createdAt'; apiSortOrder = 'desc';
    }

    const params = {
      search: query,
      category,
      sortBy: apiSortBy,
      sortOrder: apiSortOrder,
      page,
      limit: 24,
    };
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.minRating = minRating;

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, category, sortBy, minPrice, maxPrice, minRating, page]);

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const setPriceRange = (min, max) => {
    const params = new URLSearchParams(searchParams);
    if (min !== undefined) params.set('minPrice', min);
    if (max !== undefined) params.set('maxPrice', max);
    params.delete('page');
    setSearchParams(params);
  };

  const setRatingFilter = (rating) => {
    const params = new URLSearchParams(searchParams);
    if (rating) {
      params.set('minRating', rating);
    } else {
      params.delete('minRating');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSortBy('featured');
  };

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('amazon_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success('Removed from Wish List');
      } else {
        await addToWishlist(productId);
        setWishlistIds(prev => new Set(prev).add(productId));
        toast.success('Added to Wish List');
      }
    } catch (error) {
      toast.error('Failed to update Wish List');
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    toast.success('Added to Cart');
  };

  const hasActiveFilters = query || category || minPrice || maxPrice || minRating;

  // Active filter tags
  const activeFilters = [];
  if (query) activeFilters.push({ label: `"${query}"`, key: 'search' });
  if (category) {
    const cat = categories.find(c => c.slug === category);
    activeFilters.push({ label: cat?.name || category, key: 'category' });
  }
  if (minPrice || maxPrice) {
    const label = minPrice && maxPrice ? `₹${parseInt(minPrice).toLocaleString()} - ₹${parseInt(maxPrice).toLocaleString()}` :
                  minPrice ? `₹${parseInt(minPrice).toLocaleString()}+` : `Up to ₹${parseInt(maxPrice).toLocaleString()}`;
    activeFilters.push({ label, key: 'price' });
  }
  if (minRating) activeFilters.push({ label: `${minRating}★ & up`, key: 'rating' });

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    if (key === 'search') { params.delete('search'); setLocalSearch(''); }
    if (key === 'category') params.delete('category');
    if (key === 'price') { params.delete('minPrice'); params.delete('maxPrice'); }
    if (key === 'rating') params.delete('minRating');
    params.delete('page');
    setSearchParams(params);
  };

  // ---------- Sidebar Filter Component ----------
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? 'p-4' : ''}>
      {/* Category Filter */}
      <div className="mb-5">
        <button 
          onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
          className="flex items-center justify-between w-full font-bold text-[14px] mb-2 bg-transparent border-none p-0 cursor-pointer text-[#0f1111]"
        >
          <span>Department</span>
          {isCategoryExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {isCategoryExpanded && (
          <ul className="list-none p-0 text-[13px] space-y-0.5">
            <li 
              className={`cursor-pointer py-1 pl-1 rounded transition-colors ${!category ? 'font-bold text-[#c45500]' : 'text-[#0f1111] hover:text-[#c45500]'}`}
              onClick={() => setCategory('')}
            >
              All Departments
            </li>
            {categories.map(cat => (
              <li 
                key={cat.id} 
                className={`cursor-pointer py-1 pl-3 rounded transition-colors flex items-center justify-between ${category === cat.slug ? 'font-bold text-[#c45500] bg-[#fef9ed]' : 'text-[#0f1111] hover:text-[#c45500] hover:bg-[#f7f7f7]'}`}
                onClick={() => setCategory(cat.slug)}
              >
                <span>{cat.icon} {cat.name}</span>
                <span className="text-[11px] text-[#565959]">({cat.product_count || 0})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="border-[#eee] my-3" />

      {/* Customer Review Filter */}
      <div className="mb-5">
        <button 
          onClick={() => setIsRatingExpanded(!isRatingExpanded)}
          className="flex items-center justify-between w-full font-bold text-[14px] mb-2 bg-transparent border-none p-0 cursor-pointer text-[#0f1111]"
        >
          <span>Customer Review</span>
          {isRatingExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {isRatingExpanded && (
          <div className="space-y-1">
            {[4, 3, 2, 1].map(stars => (
              <div 
                key={stars} 
                onClick={() => setRatingFilter(minRating == stars ? '' : stars)}
                className={`flex items-center gap-1.5 text-[13px] cursor-pointer py-1 px-1 rounded transition-colors ${
                  parseInt(minRating) === stars ? 'bg-[#fef9ed] font-semibold' : 'hover:bg-[#f7f7f7]'
                }`}
              >
                <div className="flex text-[#ffa41c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={i < stars ? "currentColor" : "none"} strokeWidth={i < stars ? 0 : 1.5} className={i >= stars ? 'text-[#ccc]' : ''} />
                  ))}
                </div>
                <span className="text-[#0f1111]">& Up</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-[#eee] my-3" />

      {/* Price Filter */}
      <div className="mb-5">
        <button 
          onClick={() => setIsPriceExpanded(!isPriceExpanded)}
          className="flex items-center justify-between w-full font-bold text-[14px] mb-2 bg-transparent border-none p-0 cursor-pointer text-[#0f1111]"
        >
          <span>Price</span>
          {isPriceExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {isPriceExpanded && (
          <ul className="list-none p-0 text-[13px] space-y-0.5">
            {priceRanges.map(range => {
              const isActive = minPrice == range.min && maxPrice == range.max;
              return (
                <li 
                  key={range.label} 
                  onClick={() => isActive ? setPriceRange('', '') : setPriceRange(range.min, range.max)}
                  className={`cursor-pointer py-1 px-1 rounded transition-colors ${isActive ? 'font-bold text-[#c45500] bg-[#fef9ed]' : 'text-[#0f1111] hover:text-[#c45500] hover:bg-[#f7f7f7]'}`}
                >
                  {range.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Prime filter (cosmetic) */}
      <hr className="border-[#eee] my-3" />
      <div className="mb-5">
        <h3 className="font-bold text-[14px] mb-2">Delivery</h3>
        <label className="flex items-center gap-2 text-[13px] cursor-pointer hover:bg-[#f7f7f7] py-1 px-1 rounded">
          <input type="checkbox" className="w-4 h-4 accent-[#e77600]" />
          <span className="italic font-extrabold text-[#00A8E0] text-[12px]">prime</span>
          <span className="text-[#0f1111]">Get it by Tomorrow</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* Search & Filter Bar */}
      <div className="border-b border-[#ddd] shadow-sm py-2.5 px-4 bg-[#f8f8f8]">
        <div className="max-w-[1500px] mx-auto flex flex-col gap-2">
          {/* Top Row: Results count + Sort */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#565959]">
                {pagination.total > 0 ? `1-${Math.min(products.length, pagination.total)} of over ${pagination.total.toLocaleString()} results` : `${products.length} results`}
              </span>
              {(query || category) && (
                <span className="text-[14px]"> for <span className="text-[#c45500] font-bold">"{query || categories.find(c => c.slug === category)?.name || category || 'All Products'}"</span></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="hidden md:flex items-center gap-1 border border-[#d5d9d9] rounded-[4px] overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#ededed] text-[#0f1111]' : 'bg-white text-[#565959] hover:bg-[#f5f5f5]'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#ededed] text-[#0f1111]' : 'bg-white text-[#565959] hover:bg-[#f5f5f5]'}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 bg-[#f0f2f2] border border-[#d5d9d9] rounded-[7px] px-3 py-1.5 cursor-pointer hover:bg-[#e7e9eb] text-[13px] transition-colors"
                >
                  <span>Sort by: {sortOptions.find(s => s.value === sortBy)?.label}</span>
                  <ChevronDown size={14} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 top-[calc(100%+4px)] w-[220px] bg-white border border-[#ccc] rounded-[4px] shadow-lg z-50 py-1">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-[13px] hover:bg-[#f3f3f3] transition-colors border-none bg-transparent cursor-pointer ${
                          sortBy === option.value ? 'font-bold text-[#c45500]' : 'text-[#0f1111]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-[#565959]">Active filters:</span>
              {activeFilters.map(filter => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1 bg-[#e6f3f7] text-[#007185] text-[12px] px-2 py-0.5 rounded-[3px] border border-[#b8d9e3]"
                >
                  {filter.label}
                  <button 
                    onClick={() => removeFilter(filter.key)}
                    className="ml-0.5 hover:text-[#c45500] bg-transparent border-none cursor-pointer p-0 text-[#007185]"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button 
                onClick={clearAllFilters}
                className="text-[12px] text-[#007185] hover:text-[#c45500] hover:underline bg-transparent border-none cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="md:hidden flex items-center gap-2 w-full px-4 py-2.5 bg-white border-b border-[#ddd] text-[14px] font-medium text-[#0f1111] cursor-pointer"
      >
        <SlidersHorizontal size={16} />
        Filters {hasActiveFilters ? `(${activeFilters.length})` : ''}
      </button>

      <div className="flex px-4 py-4 gap-6 max-w-[1500px] mx-auto">
        {/* Sidebar Filters — Desktop */}
        <aside className="hidden md:block w-[220px] shrink-0 pr-4 border-r border-[#eee]">
          <FilterSidebar />
        </aside>

        {/* Sidebar Filters — Mobile Overlay */}
        {isMobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-[100] flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="relative w-[85%] max-w-[320px] bg-white h-full overflow-y-auto shadow-2xl animate-[slideIn_0.2s_ease-out]">
              <div className="flex items-center justify-between p-4 border-b border-[#ddd] bg-[#f8f8f8]">
                <h3 className="font-bold text-[16px]">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="text-[#555] bg-transparent border-none cursor-pointer">
                  <X size={22} />
                </button>
              </div>
              <FilterSidebar isMobile />
            </div>
          </div>
        )}

        {/* Main Grid */}
        <main className="flex-1 min-w-0">
          <h1 className="text-[22px] font-bold mb-4 text-[#0f1111]">
            {category ? (categories.find(c => c.slug === category)?.name || 'Results') : 'Results'}
            {query && <span className="font-normal text-[16px] text-[#565959] ml-2">"{query}"</span>}
          </h1>

          {/* Product Grid / List */}
          {loading ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4"
              : "flex flex-col gap-4"
            }>
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`animate-pulse bg-gray-100 rounded ${viewMode === 'grid' ? 'h-[380px]' : 'h-[200px]'}`}></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-[60px] mb-4">🔍</div>
              <h2 className="text-[22px] font-bold text-[#0f1111] mb-2">No results found</h2>
              <p className="text-[14px] text-[#565959] mb-4">
                Try different keywords or remove some filters
              </p>
              <button 
                onClick={clearAllFilters}
                className="amazon-button-yellow px-6 py-2 rounded-[8px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00]"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-4">
              {products.map(product => (
                <div key={product.id} className="flex flex-col border border-[#e8e8e8] p-3 rounded-[3px] group hover:border-[#c45500] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all bg-white relative">
                   {/* Wishlist Heart */}
                   <button 
                     onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                     className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 rounded-full border border-[#ddd] hover:bg-white hover:shadow-md transition-all shadow-sm cursor-pointer"
                   >
                     <Heart 
                       size={18} 
                       className={wishlistIds.has(product.id) ? "fill-[#e77600] text-[#e77600]" : "text-[#565959]"} 
                     />
                   </button>

                   <Link to={`/products/${product.id}`} className="block h-[200px] mb-3 overflow-hidden bg-[#f7f7f7] rounded flex items-center justify-center p-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80`; }}
                      />
                   </Link>
                   <Link to={`/products/${product.id}`} className="text-[15px] font-medium text-[#0f1111] line-clamp-2 leading-snug hover:text-[#c45500] no-underline mb-1">
                      {product.name}
                   </Link>
                   {product.category_name && (
                     <span className="text-[11px] text-[#565959] mb-1">in {product.category_name}</span>
                   )}
                   <div className="flex items-center gap-1 mb-1">
                      <div className="flex text-[#ffa41c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating || 4) ? 0 : 1.5} className={i >= Math.floor(product.rating || 4) ? 'text-[#ccc]' : ''} />
                        ))}
                      </div>
                      <span className="text-[12px] text-[#007185]">{product.review_count || 0}</span>
                   </div>
                   <div className="mt-auto">
                      <div className="flex items-baseline gap-1">
                         <span className="text-[13px] align-top">₹</span>
                         <span className="text-[26px] font-medium">{(product.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[12px] text-[#565959] mb-1.5">
                         M.R.P: <span className="line-through">₹{(product.original_price || product.price * 1.5).toLocaleString('en-IN')}</span>
                         {product.original_price && product.original_price > product.price && (
                           <span className="text-[#CC0C39] font-semibold ml-1">({Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off)</span>
                         )}
                      </div>
                      {product.is_prime && (
                         <div className="inline-flex items-center gap-[3px] text-[11px] font-semibold text-[#00A8E0] mb-1.5">
                           <span className="italic font-extrabold text-[12px]">prime</span>
                           <span className="text-[#565959] text-[11px] font-normal">FREE Delivery</span>
                         </div>
                      )}
                      <button 
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product.id); }}
                        className="amazon-button-yellow w-full py-1.5 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00] cursor-pointer"
                      >
                         Add to cart
                      </button>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="flex flex-col gap-4">
              {products.map(product => (
                <div key={product.id} className="flex gap-5 border border-[#e8e8e8] p-4 rounded-[3px] hover:border-[#c45500] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all bg-white group relative">
                  <Link to={`/products/${product.id}`} className="w-[200px] h-[200px] bg-[#f7f7f7] rounded flex items-center justify-center p-4 shrink-0 overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80`; }}
                    />
                  </Link>
                  <div className="flex-1 flex flex-col min-w-0">
                    <Link to={`/products/${product.id}`} className="text-[18px] font-medium text-[#0f1111] leading-snug hover:text-[#c45500] no-underline line-clamp-2 mb-1">
                      {product.name}
                    </Link>
                    {product.category_name && (
                      <span className="text-[12px] text-[#565959] mb-1">in {product.category_name}</span>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="flex text-[#ffa41c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} strokeWidth={i < Math.floor(product.rating || 4) ? 0 : 1.5} className={i >= Math.floor(product.rating || 4) ? 'text-[#ccc]' : ''} />
                        ))}
                      </div>
                      <span className="text-[13px] text-[#007185]">{product.review_count || 0}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="text-[14px] align-top">₹</span>
                      <span className="text-[28px] font-medium">{(product.price || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[13px] text-[#565959] mb-1">
                      M.R.P: <span className="line-through">₹{(product.original_price || product.price * 1.5).toLocaleString('en-IN')}</span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-[#CC0C39] font-semibold ml-1">({Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off)</span>
                      )}
                    </div>
                    {product.is_prime && (
                      <div className="inline-flex items-center gap-[3px] text-[11px] font-semibold text-[#00A8E0] mb-1">
                        <span className="italic font-extrabold text-[12px]">prime</span>
                        <span className="text-[#565959] text-[11px] font-normal ml-1">FREE Delivery Tomorrow</span>
                      </div>
                    )}
                    <p className="text-[13px] text-[#565959] line-clamp-2 mt-1">{product.description}</p>
                  </div>
                  <div className="w-[180px] flex flex-col gap-2 shrink-0 pt-2">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="amazon-button-yellow w-full py-2 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00] cursor-pointer"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="w-full py-2 border border-[#ddd] rounded-[20px] text-[13px] bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Heart size={14} className={wishlistIds.has(product.id) ? "fill-[#e77600] text-[#e77600]" : "text-[#565959]"} />
                      {wishlistIds.has(product.id) ? 'In Wish List' : 'Add to Wish List'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-8 mb-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 border border-[#d5d9d9] rounded-l-[7px] bg-white hover:bg-[#f7fafa] text-[14px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Previous
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 3) {
                  pageNum = pagination.totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-4 py-2 border border-[#d5d9d9] text-[14px] cursor-pointer transition-colors ${
                      page === pageNum 
                        ? 'bg-[#FFEBC1] border-[#e77600] font-bold' 
                        : 'bg-white hover:bg-[#f7fafa]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 border border-[#d5d9d9] rounded-r-[7px] bg-white hover:bg-[#f7fafa] text-[14px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
