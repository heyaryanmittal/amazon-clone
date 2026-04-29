import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, StarHalf, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { addToWishlist, removeFromWishlist, optimizeImage } from '../services/api';
import toast from 'react-hot-toast';

export const StarRating = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex gap-[1px] text-[#FF9900]" style={{ fontSize: size }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`}>★</span>
      ))}
      {hasHalf && <span>½</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-[#ccc]">★</span>
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
  const rawImage = product.primary_image || product.image_url || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
  const image = optimizeImage(rawImage, 400);

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
    <div className="bg-white rounded-[3px] overflow-hidden flex flex-col transition-all duration-[250ms] border border-transparent relative hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:border-[#e0e0e0] hover:-translate-y-[2px] group" id={`product-card-${product.id}`}>
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[3px] z-[1]">-{discount}%</div>
      )}
      <button
        className="absolute top-2 right-2 bg-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.12)] z-[1] transition-all duration-150 opacity-0 group-hover:opacity-100 hover:bg-[#ffe4e4] hover:scale-110"
        onClick={handleWishlist}
        title="Add to Wishlist"
        id={`wishlist-btn-${product.id}`}
      >
        <Heart size={16} />
      </button>

      <Link to={`/products/${product.id}`} className="aspect-square overflow-hidden bg-[#f7f7f7] flex items-center justify-center p-3">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-[250ms] group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80';
          }}
        />
      </Link>

      <div className="p-3 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`} className="text-[13px] font-medium text-[#1c1c1c] leading-[1.4] mb-1.5 line-clamp-2">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mb-1.5">
          <StarRating rating={parseFloat(product.rating) || 4.0} />
          <Link
            to={`/products/${product.id}`}
            className="text-[12px] text-[#007185] no-underline hover:text-[#FF9900] hover:underline"
          >
            ({(product.review_count || 0).toLocaleString('en-IN')})
          </Link>
        </div>

        {product.is_prime && (
          <div className="inline-flex items-center gap-[3px] text-[11px] font-semibold text-[#00A8E0] mb-1">
            <span className="italic font-extrabold text-[#00A8E0] text-[12px]">prime</span>
          </div>
        )}

        <div className="mb-2 mt-auto">
          <span className="text-[18px] font-bold text-[#131921]">
            <span className="text-[13px] align-super font-normal">₹</span>
            {parseInt(product.price).toLocaleString('en-IN')}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-[12px] text-[#767676] line-through ml-1">
              ₹{parseInt(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
          {discount > 0 && (
            <div className="text-[12px] text-[#CC0C39] font-semibold">({discount}% off)</div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <button
            className="w-full bg-[#F0C14B] text-[#333] border border-[#a88734] rounded-full py-[7px] px-3 text-[13px] font-semibold cursor-pointer transition-all duration-150 text-center hover:bg-[#DDB347]"
            onClick={handleAddToCart}
            id={`add-cart-${product.id}`}
          >
            Add to Cart
          </button>
          {showBuyNow && (
            <button
               className="w-full bg-[#FF9900] text-[#333] border border-[#c45500] rounded-full py-[7px] px-3 text-[13px] font-semibold cursor-pointer transition-all duration-150 hover:bg-[#e68a00]"
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
