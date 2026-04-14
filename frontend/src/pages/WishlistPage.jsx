import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { StarRating, getDiscount } from '../components/ProductCard';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'Your Wishlist - Amazon.in';
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setItems(data.items || []);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner" style={{ minHeight: 400 }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '16px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, color: '#131921', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Heart size={28} color="#CC0C39" fill="#CC0C39" />
          Your Wishlist ({items.length} item{items.length !== 1 ? 's' : ''})
        </h1>

        {items.length === 0 ? (
          <div className="section">
            <div className="empty-state">
              <span className="empty-state-icon">❤️</span>
              <h2>Your wishlist is empty</h2>
              <p>Add items to your wishlist to save them for later.</p>
              <Link to="/products" className="btn-primary">Start Shopping</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {items.map(item => {
              const discount = getDiscount(item.price, item.original_price);
              return (
                <div key={item.wishlist_id} className="product-card" id={`wishlist-item-${item.id}`}>
                  {discount > 0 && <div className="product-badge">-{discount}%</div>}
                  <button
                    className="wishlist-btn active"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from Wishlist"
                    style={{ opacity: 1, color: '#CC0C39' }}
                  >
                    <Heart size={16} fill="#CC0C39" />
                  </button>

                  <Link to={`/products/${item.id}`} className="product-card-image">
                    <img
                      src={item.primary_image || 'https://via.placeholder.com/300x300/f7f7f7/aaaaaa?text=Product'}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/f7f7f7/aaaaaa?text=Product'; }}
                    />
                  </Link>

                  <div className="product-card-body">
                    <Link to={`/products/${item.id}`} className="product-card-name">{item.name}</Link>

                    <div className="product-card-rating">
                      <StarRating rating={parseFloat(item.rating) || 4.0} />
                      <span className="rating-count">({(item.review_count || 0).toLocaleString()})</span>
                    </div>

                    <div className="product-card-price">
                      <span className="price-current">
                        <span className="price-symbol">₹</span>
                        {parseInt(item.price).toLocaleString('en-IN')}
                      </span>
                      {item.original_price > item.price && (
                        <span className="price-original">₹{parseInt(item.original_price).toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className="btn-add-cart"
                        onClick={() => handleAddToCart(item.id)}
                        style={{ flex: 1 }}
                      >
                        <ShoppingCart size={14} style={{ display: 'inline', marginRight: 4 }} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        style={{
                          background: 'white', border: '1px solid #DDD', borderRadius: '50%',
                          width: 36, height: 36, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', cursor: 'pointer',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={14} color="#CC0C39" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
