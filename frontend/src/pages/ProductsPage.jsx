import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'created_at-DESC', label: 'Featured' },
  { value: 'price-ASC', label: 'Price: Low to High' },
  { value: 'price-DESC', label: 'Price: High to Low' },
  { value: 'rating-DESC', label: 'Avg. Customer Review' },
  { value: 'review_count-DESC', label: 'Most Popular' },
  { value: 'name-ASC', label: 'Name A-Z' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 - ₹10,000', min: 2000, max: 10000 },
  { label: '₹10,000 - ₹50,000', min: 10000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: 999999 },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('created_at-DESC');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [showFilters, setShowFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data.categories || []));
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const [sortBy, sortOrder] = sort.split('-');
        const { data } = await getProducts({
          search,
          category: selectedCategory,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sortBy,
          sortOrder,
          page,
          limit: 20,
          featured,
        });
        setProducts(data.products || []);
        setPagination(data.pagination || {});
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [search, selectedCategory, priceRange, sort, page, featured]);

  useEffect(() => {
    const title = search
      ? `"${search}" - Amazon.in`
      : selectedCategory
      ? `${selectedCategory.replace(/-/g, ' ')} - Amazon.in`
      : 'All Products - Amazon.in';
    document.title = title;
  }, [search, selectedCategory]);

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page');
    setSearchParams(newParams);
    setSelectedCategory(slug);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePriceRange = (range) => {
    if (range === null) {
      setPriceRange({ min: 0, max: 999999 });
    } else {
      setPriceRange(range);
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4">
      {/* Breadcrumb */}
      <div className="py-3 text-[12px] text-[#565959] flex items-center gap-1.5">
        <Link to="/" className="text-[#565959] no-underline hover:text-[#C45500] hover:underline">Home</Link>
        <span className="mx-1">›</span>
        {search ? (
          <span>Search results for "{search}"</span>
        ) : selectedCategory ? (
          <span>{selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
        ) : featured ? (
          <span>Today's Deals</span>
        ) : (
          <span>All Products</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start py-4 gap-4 pb-12">
        {/* Sidebar */}
        <aside className="w-full md:w-[240px] shrink-0 md:border-r border-[#ececec] pr-4" id="products-sidebar">
          <div className="mb-4">
            <div className="font-bold text-[14px] mb-2">Department</div>
            <div>
              <div
                className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]"
                onClick={() => handleCategoryChange('')}
                style={{ fontWeight: !selectedCategory ? 700 : 400 }}
              >
                All Categories ({pagination.total || 0})
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]"
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    fontWeight: selectedCategory === cat.slug ? 700 : 400,
                    color: selectedCategory === cat.slug ? '#C45500' : undefined,
                  }}
                >
                  {cat.icon} {cat.name} ({cat.product_count || 0})
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold text-[14px] mb-2">Avg. Customer Review</div>
            <div>
              {[4, 3, 2].map(stars => (
                <div key={stars} className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]">
                  <span style={{ color: '#FF9900' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                  <span style={{ marginLeft: 4 }}>& Up</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold text-[14px] mb-2">Price</div>
            <div>
              <div
                className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]"
                onClick={() => handlePriceRange(null)}
                style={{ cursor: 'pointer', fontWeight: priceRange.max === 999999 && priceRange.min === 0 ? 700 : 400 }}
              >
                Any Price
              </div>
              {PRICE_RANGES.map((range, i) => (
                <div
                  key={i}
                  className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]"
                  style={{ cursor: 'pointer', fontWeight: priceRange.min === range.min && priceRange.max === range.max ? 700 : 400 }}
                  onClick={() => handlePriceRange(range)}
                >
                  {range.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-bold text-[14px] mb-2">Amazon Prime</div>
            <div className="text-[13px] text-[#111] mb-1.5 flex items-center gap-1 cursor-pointer hover:text-[#C45500]">
              <input type="checkbox" id="prime-filter" />
              <label htmlFor="prime-filter" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#00A8E0', fontWeight: 700, fontStyle: 'italic' }}>prime</span>
                Eligible
              </label>
            </div>
          </div>
        </aside>

        {/* Products Area */}
        <div className="flex-1 min-w-0 w-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#ececec]">
            <div className="text-[14px] text-[#565959]">
              {search && (
                <span>Results for <strong>"{search}"</strong>: </span>
              )}
              <span>
                Showing {((page - 1) * 20) + 1}–{Math.min(page * 20, pagination.total)} of{' '}
                <span>{pagination.total}</span> results
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, color: '#565959' }}>Sort by:</span>
              <select
                className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-[8px] px-[10px] py-[4px] text-[13px] shadow-[0_2px_5px_rgba(15,17,17,0.15)] outline-none hover:bg-[#E3E6E6] cursor-pointer"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Result Header */}
          {search && (
            <div style={{
              background: 'white',
              padding: '12px 16px',
              marginBottom: 8,
              fontSize: 20,
              color: '#565959',
              borderRadius: 4,
            }}>
              {loading ? 'Searching...' : (
                <>
                  {pagination.total > 0 ? (
                    <>Showing results for "<strong style={{ color: '#333' }}>{search}</strong>"</>
                  ) : (
                    <>No results for "<strong style={{ color: '#C45500' }}>{search}</strong>"</>
                  )}
                </>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="bg-white mb-2 p-6 rounded-[3px]">
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-[3px] border-[#f3f3f3] border-t-[#FF9900] rounded-full animate-spin"></div></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white mb-2 p-6 rounded-[3px]">
              <div className="flex flex-col items-center justify-center p-12 text-center text-[#565959] bg-white rounded-lg border border-[#eee]">
                <span className="text-5xl mb-4 opacity-50">🔍</span>
                <h2>No products found</h2>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
                <Link to="/products" className="bg-[#FF9900] text-[#333] border border-[#c45500] rounded-full py-1.5 px-3.5 font-semibold text-[13px] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 no-underline hover:bg-[#e68a00] mt-4">Browse All Products</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4" id="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} showBuyNow />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8 py-4 border-t border-[#ececec]">
                  <button
                    className="px-3 py-1.5 bg-white border border-[#D5D9D9] rounded-[3px] text-[13px] cursor-pointer shadow-[0_1px_2px_rgba(15,17,17,0.15)] transition-all hover:bg-[#F7FAFA] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  {[...Array(Math.min(pagination.totalPages, 7))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`px-3 py-1.5 bg-white border border-[#D5D9D9] rounded-[3px] text-[13px] cursor-pointer shadow-[0_1px_2px_rgba(15,17,17,0.15)] transition-all hover:bg-[#F7FAFA] ${page === pageNum ? 'bg-[#F0F2F2] border-black text-black font-bold' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="px-3 py-1.5 bg-white border border-[#D5D9D9] rounded-[3px] text-[13px] cursor-pointer shadow-[0_1px_2px_rgba(15,17,17,0.15)] transition-all hover:bg-[#F7FAFA] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
