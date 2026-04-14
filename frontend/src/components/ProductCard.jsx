import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, StarHalf, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { addToWishlist, removeFromWishlist } from '../services/api';
import toast from 'react-hot-toast';

// Render star rating
export const StarRating = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="stars" style={{ fontSize: size }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {hasHalf && <span>½</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} style={{ color: '#ccc' }}>★</span>
      ))}
    </div>
  );
};

// Format price with Indian rupee
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const getDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

const ProductCard = ({ product, showBuyNow = false }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const discount = getDiscount(product.price, product.original_price);
  const image = product.primary_image || product.image || 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product.id);
    if (success) navigate('/checkout');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToWishlist(product.id);
      toast.success('Added to wishlist');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  };

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {discount > 0 && (
        <div className="product-badge">-{discount}%</div>
      )}
      <button
        className="wishlist-btn"
        onClick={handleWishlist}
        title="Add to Wishlist"
        id={`wishlist-btn-${product.id}`}
      >
        <Heart size={16} />
      </button>

      <Link to={`/products/${product.id}`} className="product-card-image">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x300/f7f7f7/aaaaaa?text=${encodeURIComponent(product.brand || 'Product')}`;
          }}
        />
      </Link>

      <div className="product-card-body">
        <Link to={`/products/${product.id}`} className="product-card-name">
          {product.name}
        </Link>

        <div className="product-card-rating">
          <StarRating rating={parseFloat(product.rating) || 4.0} />
          <Link
            to={`/products/${product.id}`}
            className="rating-count"
          >
            ({(product.review_count || 0).toLocaleString('en-IN')})
          </Link>
        </div>

        {product.is_prime && (
          <div className="prime-badge">
            <span className="prime-logo">prime</span>
          </div>
        )}

        <div className="product-card-price">
          <span className="price-current">
            <span className="price-symbol">₹</span>
            {parseInt(product.price).toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="price-original">
              ₹{parseInt(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
          {discount > 0 && (
            <div className="price-discount">({discount}% off)</div>
          )}
        </div>

        <div className="product-card-actions">
          <button
            className="btn-add-cart"
            onClick={handleAddToCart}
            id={`add-cart-${product.id}`}
          >
            Add to Cart
          </button>
          {showBuyNow && (
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              id={`buy-now-${product.id}`}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
