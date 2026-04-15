import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getWishlist().then(({ data }) => {
      setItems(data.wishlist || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleRemove = (id) => {
    removeFromWishlist(id).then(() => {
      setItems(items.filter(item => item.product_id !== id));
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-8 flex gap-8">
        
        {/* Sidebar */}
        <div className="w-[280px] hidden md:block">
           <div className="border border-[#ddd] p-5 rounded-[4px] shadow-sm">
              <h2 className="text-[18px] font-bold mb-4">Your Lists</h2>
              <ul className="list-none p-0 text-[14px] flex flex-col gap-3">
                 <li className="font-bold flex justify-between bg-[#f0f2f2] -mx-5 px-5 py-2 border-l-4 border-[#e77600] cursor-pointer">
                    <span>Shopping List</span>
                    <span className="text-[#565959] font-normal">Private</span>
                 </li>
                 <li className="hover:text-[#c45500] cursor-pointer pl-2">Wish List</li>
                 <li className="hover:text-[#c45500] cursor-pointer pl-2">Ideas</li>
              </ul>
              <button className="text-[13px] text-[#007185] hover:underline mt-6 leading-tight">+ Create a List</button>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
           <div className="flex justify-between items-center mb-6 border-b border-[#eee] pb-4">
              <h1 className="text-[28px] font-normal">Shopping List</h1>
              <div className="flex gap-4 text-[14px] text-[#565959]">
                 <span className="hover:underline cursor-pointer">Invite</span>
                 <span>|</span>
                 <span className="hover:underline cursor-pointer">More</span>
              </div>
           </div>

           <div className="flex flex-col">
              {loading ? (
                 <div className="animate-pulse bg-gray-100 h-40 rounded"></div>
              ) : items.length === 0 ? (
                 <div className="flex flex-col items-center py-10">
                    <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB445243306_.svg" className="w-40 mb-4 opacity-50" />
                    <p className="text-[14px]">Your Wish List is empty.</p>
                    <Link to="/" className="text-[13px] text-[#007185] hover:underline mt-2">Start shopping</Link>
                 </div>
              ) : items.map(item => (
                 <div key={item.product_id} className="flex gap-6 border-b border-[#eee] py-6 last:border-none">
                    <div className="w-[180px] h-[180px] border p-2 flex items-center justify-center cursor-pointer">
                       <img src={item.image_url} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col pt-1">
                       <Link to={`/products/${item.product_id}`} className="text-[18px] font-medium leading-tight hover:text-[#c45500] no-underline text-black">
                         {item.name}
                       </Link>
                       <div className="flex items-center gap-1 mt-1 text-[13px]">
                          <div className="flex text-[#ffa41c]">
                             {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (item.rating||4) ? "currentColor" : "none"} />)}
                          </div>
                          <span className="text-[#007185] hover:underline">({item.review_count || 120})</span>
                       </div>
                       <div className="mt-2 text-[18px] font-bold text-[#b12704]">
                          ₹{(item.price || 0).toLocaleString()}
                       </div>
                       <p className="text-[12px] text-[#565959] mt-1">Item added April 14, 2024</p>
                    </div>
                    <div className="w-[200px] flex flex-col gap-2 pt-1">
                       <button 
                        onClick={() => addToCart(item.product_id, 1)}
                        className="amazon-button-yellow w-full py-1.5 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm"
                       >
                          Add to Cart
                       </button>
                       <button 
                        onClick={() => handleRemove(item.product_id)}
                        className="w-full py-1.5 border border-[#ddd] rounded-[20px] text-[13px] bg-white hover:bg-gray-50"
                       >
                          Delete
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
