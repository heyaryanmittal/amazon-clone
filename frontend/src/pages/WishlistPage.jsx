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
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <div>
        <h1 className="text-[28px] font-normal text-[#131921] mb-4 flex items-center gap-3">
          <Heart size={28} color="#CC0C39" fill="#CC0C39" />
          Your Wishlist ({items.length} item{items.length !== 1 ? 's' : ''})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white mb-2 p-6 rounded-[3px]">
            <div className="flex flex-col items-center justify-center p-12 text-center text-[#565959] bg-white rounded-lg border border-[#eee]">
              <span className="text-5xl mb-4 opacity-50">❤️</span>
              <h2 className="text-[24px] font-bold text-black mb-2">Your wishlist is empty</h2>
              <p className="text-[16px] mb-4">Add items to your wishlist to save them for later.</p>
              <Link to="/products" className="bg-[#FF9900] text-[#333] border border-[#c45500] rounded-full py-1.5 px-3.5 font-semibold text-[13px] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 no-underline hover:bg-[#e68a00]">Start Shopping</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {items.map(item => {
              const discount = getDiscount(item.price, item.original_price);
              return (
                <div key={item.wishlist_id} className="relative bg-white border border-[#ececec] rounded flex flex-col p-3 transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] group" id={`wishlist-item-${item.id}`}>
                  {discount > 0 && <div className="absolute top-3 left-3 bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[3px] z-10">-{discount}%</div>}
                  <button
                    className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.15)] border border-[#ddd] opacity-100 text-[#CC0C39] z-10"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from Wishlist"
                  >
                    <Heart size={16} fill="#CC0C39" />
                  </button>

                  <Link to={`/products/${item.id}`} className="w-full h-[200px] flex items-center justify-center mb-3 bg-[#f7f7f7]">
                    <img
                      src={item.primary_image || 'https://via.placeholder.com/300x300/f7f7f7/aaaaaa?text=Product'}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/f7f7f7/aaaaaa?text=Product'; }}
                    />
                  </Link>

                  <div className="flex flex-col flex-1">
                    <Link to={`/products/${item.id}`} className="text-[#0f1111] text-[14px] leading-[1.3] no-underline max-h-[3.9em] overflow-hidden hover:text-[#C45500]">
                      {item.name}
                    </Link>

                    <div className="flex items-center mt-1 mb-1">
                      <StarRating rating={parseFloat(item.rating) || 4.0} />
                      <span className="text-[#007185] text-[12px] ml-1 hover:text-[#C45500] cursor-pointer">({(item.review_count || 0).toLocaleString()})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-auto pt-2">
                      <span className="text-[21px] font-medium text-[#0f1111]">
                        <span className="text-[12px] align-top">₹</span>
                        {parseInt(item.price).toLocaleString('en-IN')}
                      </span>
                      {item.original_price > item.price && (
                        <span className="text-[12px] text-[#565959] line-through decoration-[#565959]">₹{parseInt(item.original_price).toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex-1 bg-[#FFD814] text-[#0f1111] border border-[#FCD200] rounded-full py-1 px-3 text-[12px] cursor-pointer transition-colors hover:bg-[#F7CA00] flex items-center justify-center"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <ShoppingCart size={14} className="inline mr-1" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-white border border-[#DDD] rounded-full w-9 h-9 flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[#f3f3f3]"
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
