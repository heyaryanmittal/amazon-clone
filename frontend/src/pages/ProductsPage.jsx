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
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">›</span>
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

      <div className="products-page">
        {/* Sidebar */}
        <aside className="sidebar" id="products-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Department</div>
            <div className="filter-section">
              <div
                className={`filter-item ${!selectedCategory ? 'font-bold' : ''}`}
                onClick={() => handleCategoryChange('')}
                style={{ fontWeight: !selectedCategory ? 700 : 400, cursor: 'pointer' }}
              >
                All Categories ({pagination.total || 0})
              </div>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="filter-item"
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    fontWeight: selectedCategory === cat.slug ? 700 : 400,
                    color: selectedCategory === cat.slug ? '#C45500' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  {cat.icon} {cat.name} ({cat.product_count || 0})
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Avg. Customer Review</div>
            <div className="filter-section">
              {[4, 3, 2].map(stars => (
                <div key={stars} className="filter-item">
                  <span style={{ color: '#FF9900' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                  <span style={{ marginLeft: 4 }}>& Up</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Price</div>
            <div className="filter-section">
              <div
                className="filter-item"
                onClick={() => handlePriceRange(null)}
                style={{ cursor: 'pointer', fontWeight: priceRange.max === 999999 && priceRange.min === 0 ? 700 : 400 }}
              >
                Any Price
              </div>
              {PRICE_RANGES.map((range, i) => (
                <div
                  key={i}
                  className="filter-item"
                  style={{ cursor: 'pointer', fontWeight: priceRange.min === range.min && priceRange.max === range.max ? 700 : 400 }}
                  onClick={() => handlePriceRange(range)}
                >
                  {range.label}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">Amazon Prime</div>
            <div className="filter-item">
              <input type="checkbox" id="prime-filter" />
              <label htmlFor="prime-filter" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#00A8E0', fontWeight: 700, fontStyle: 'italic' }}>prime</span>
                Eligible
              </label>
            </div>
          </div>
        </aside>

        {/* Products Area */}
        <div className="products-area">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="products-count">
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
                className="sort-select"
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
            <div className="section">
              <div className="loading-spinner"><div className="spinner"></div></div>
            </div>
          ) : products.length === 0 ? (
            <div className="section">
              <div className="empty-state">
                <span className="empty-state-icon">🔍</span>
                <h2>No products found</h2>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
                <Link to="/products" className="btn-primary">Browse All Products</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="products-grid" id="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} showBuyNow />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
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
                        className={`page-btn ${page === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    className="page-btn"
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
