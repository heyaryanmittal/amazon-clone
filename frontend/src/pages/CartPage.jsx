import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, summary } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
    <div className="bg-[#eaeded] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-2 border-b border-[#ddd] bg-[#f8f8f8] mb-2">
         <Link to="/" className="text-[12px] text-[#565959] hover:text-[#c45500] flex items-center gap-1 no-underline">
           <span>‹</span> Continue shopping
         </Link>
      </div>
      <div className="max-w-[1500px] mx-auto p-4 flex flex-col md:flex-row gap-5">
           <div className="flex-1 bg-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                 <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB445243306_.svg" alt="Empty Cart" className="w-[300px]" />
                 <div>
                    <h1 className="text-[28px] font-bold mb-2">Your Amazon Cart is empty.</h1>
                    <p className="text-[14px] text-[#007185] hover:underline cursor-pointer">Shop today's deals</p>
                    <div className="flex gap-4 mt-6">
                       <Link to="/" className="amazon-button-yellow px-4 py-1.5 rounded-[8px] text-[13px] border border-[#a88734] no-underline text-black">Browse Products</Link>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#eaeded] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-2 border-b border-[#ddd] bg-[#f8f8f8] mb-2">
         <Link to="/" className="text-[12px] text-[#565959] hover:text-[#c45500] flex items-center gap-1 no-underline">
           <span>‹</span> Continue shopping
         </Link>
      </div>
      
      <div className="max-w-[1500px] mx-auto p-4 flex flex-col md:flex-row gap-5 items-start">
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-5 shadow-sm">
           <div className="flex justify-between items-end border-b border-[#ddd] pb-1 mb-4">
              <h1 className="text-[28px] font-normal">Shopping Cart</h1>
              <span className="text-[14px] text-[#565959] pr-3">Price</span>
           </div>

           <div className="flex flex-col gap-5">
              {cart.map(item => (
                <div key={item.product_id} className="flex gap-4 border-b border-[#ddd] pb-5">
                   <div className="w-[180px] h-[180px] bg-[#f7f7f7] p-2 flex items-center justify-center shrink-0">
                      <img src={item.product.image_url} className="max-w-full max-h-full object-contain" />
                   </div>
                   <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                         <h2 className="text-[18px] font-medium leading-[1.2] hover:text-[#c45500] cursor-pointer">{item.product.name}</h2>
                         <span className="text-[18px] font-bold">₹{item.product.price.toLocaleString()}</span>
                      </div>
                      <div className="text-[12px] text-[#007600] mt-1">In stock</div>
                      <div className="text-[12px] text-[#565959] mt-1">Size: Standard | Style: Premium Edition</div>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-[7px] shadow-sm px-2 py-0.5">
                           <select 
                            className="bg-transparent text-[13px] outline-none cursor-pointer"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                           >
                              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                           </select>
                        </div>
                        <div className="w-[1px] h-3 bg-[#ddd]"></div>
                        <button onClick={() => removeFromCart(item.product_id)} className="text-[#007185] text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0">Delete</button>
                        <div className="w-[1px] h-3 bg-[#ddd]"></div>
                        <button className="text-[#007185] text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0">Save for later</button>
                        <div className="w-[1px] h-3 bg-[#ddd]"></div>
                        <button className="text-[#007185] text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0">See more like this</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="text-right mt-4 text-[18px]">
              Subtotal ({summary.totalItems} items): <span className="font-bold">₹{summary.subtotal.toLocaleString()}</span>
           </div>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="w-full md:w-[300px] flex flex-col gap-4 sticky top-24">
           <div className="bg-white p-5 shadow-sm">
              <div className="flex items-start gap-1 text-[#067D62] mb-1">
                 <div className="mt-1"><svg fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
                 <div className="text-[12px] leading-tight">Your order is eligible for FREE Delivery. Select this option at checkout. Details</div>
              </div>
              <div className="text-[18px] mb-4">
                 Subtotal ({summary.totalItems} items): <span className="font-bold">₹{summary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                 <input type="checkbox" className="w-4 h-4" />
                 <span className="text-[14px]">This order contains a gift</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="amazon-button-yellow w-full py-1.5 rounded-[8px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00]"
              >
                 Proceed to Buy
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
