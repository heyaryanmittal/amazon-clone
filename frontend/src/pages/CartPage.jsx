import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, updateItem, removeItem, summary = { totalItems: 0, subtotal: 0 } } = useCart();
  const navigate = useNavigate();

  const cart = items || [];

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
      
      <div className="max-w-[1500px] mx-auto p-0 sm:p-4 flex flex-col md:flex-row gap-0 sm:gap-5 items-start">
        {/* Mobile Subtotal Summary (Top) */}
        <div className="w-full md:hidden bg-white p-4 border-b border-[#ddd] mb-2">
           <div className="text-[18px] mb-3">
              Subtotal ({summary.totalItems} items): <span className="font-bold text-[20px]">₹{summary.subtotal.toLocaleString()}</span>
           </div>
           <button 
             onClick={() => navigate('/checkout')}
             className="amazon-button-yellow w-full py-3 rounded-[8px] text-[15px] border border-[#a88734] font-medium shadow-sm active:bg-[#f7ca00]"
           >
              Proceed to Buy ({summary.totalItems} items)
           </button>
           <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" className="w-4 h-4" id="gift-mobile" />
              <label htmlFor="gift-mobile" className="text-[14px]">This order contains a gift</label>
           </div>
        </div>

        {/* Left: Cart Items */}
        <div className="flex-1 w-full bg-white p-4 sm:p-5 shadow-sm">
           <div className="flex justify-between items-end border-b border-[#ddd] pb-1 mb-4">
              <h1 className="text-[20px] sm:text-[28px] font-normal">Shopping Cart</h1>
              <span className="hidden sm:block text-[14px] text-[#565959] pr-3">Price</span>
           </div>

           <div className="flex flex-col gap-5">
               {cart.map(item => (
                 <div key={item.cart_id} className="flex flex-row gap-3 sm:gap-4 border-b border-[#ddd] pb-5 last:border-b-0">
                    <div className="w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] bg-[#f7f7f7] p-1 sm:p-2 flex items-center justify-center shrink-0 rounded-sm">
                       <img src={item.image || item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                       <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-[14px] sm:text-[18px] font-medium sm:font-normal leading-tight hover:text-[#c45500] cursor-pointer mb-1 line-clamp-2 sm:line-clamp-none">{item.name}</h2>
                            <div className="text-[11px] sm:text-[12px] text-[#007600]">In stock</div>
                            <div className="text-[11px] sm:text-[12px] text-[#565959] mt-0.5 sm:mt-1 hidden sm:block">Size: Standard | Style: Premium Edition</div>
                          </div>
                          <div className="text-left sm:text-right">
                             <div className="text-[16px] sm:text-[18px] font-bold">₹{item.price.toLocaleString()}</div>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-auto">
                         <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-[7px] shadow-sm px-1.5 sm:px-2 py-0.5">
                            <select 
                             className="bg-transparent text-[11px] sm:text-[13px] outline-none cursor-pointer py-0.5"
                             value={item.quantity}
                             onChange={(e) => updateItem(item.cart_id, parseInt(e.target.value))}
                            >
                               {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                         </div>
                         <div className="hidden sm:block w-[1px] h-3 bg-[#ddd]"></div>
                         <button onClick={() => removeItem(item.cart_id)} className="text-[#007185] text-[11px] sm:text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0">Delete</button>
                         <div className="w-[1px] h-3 bg-[#ddd] sm:block hidden"></div>
                         <button className="text-[#007185] text-[11px] sm:text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0">Save for later</button>
                         <div className="w-[1px] h-3 bg-[#ddd] sm:block hidden"></div>
                         <button className="text-[#007185] text-[11px] sm:text-[12px] hover:underline cursor-pointer bg-transparent border-none p-0 whitespace-nowrap hidden xs:block">See more like this</button>
                       </div>
                       {item.quantity > 1 && (
                         <div className="text-[11px] text-[#565959] mt-2 sm:hidden">
                           Price: ₹{item.price.toLocaleString()} × {item.quantity} = <span className="font-semibold text-black">₹{(item.price * item.quantity).toLocaleString()}</span>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
           </div>

           <div className="text-right mt-6 text-[16px] sm:text-[18px]">
              Subtotal ({summary.totalItems} items): <span className="font-bold">₹{summary.subtotal.toLocaleString()}</span>
           </div>
        </div>

        {/* Right: Summary Sidebar (Desktop) */}
        <div className="hidden md:flex w-[300px] flex-col gap-4 sticky top-24">
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
