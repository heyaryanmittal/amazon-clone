import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import Navbar from '../components/Navbar';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then(({ data }) => {
      setOrders(data.orders || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-[14px] mb-4 text-[#565959]">
           <Link to="/account" className="hover:underline">Your Account</Link>
           <span>›</span>
           <span className="text-[#c45500]">Your Orders</span>
        </div>

        <div className="flex justify-between items-center mb-6">
           <h1 className="text-[28px] font-normal">Your Orders</h1>
           <div className="relative">
              <input type="text" placeholder="Search all orders" className="border border-[#ddd] rounded-[4px] py-1 px-8 outline-none focus:border-[#e77600] text-[13px] w-[300px]" />
              <svg className="absolute left-2 top-2 text-gray-400" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
           </div>
        </div>

        <div className="flex gap-10 border-b border-[#ddd] mb-6 text-[14px] font-medium text-[#565959]">
           <span className="border-b-2 border-[#c45500] text-[#0f1111] pb-1 cursor-pointer">Orders</span>
           <span className="hover:text-[#0f1111] cursor-pointer">Buy Again</span>
           <span className="hover:text-[#0f1111] cursor-pointer">Not Yet Shipped</span>
           <span className="hover:text-[#0f1111] cursor-pointer">Cancelled</span>
        </div>

        <div className="flex flex-col gap-6">
           {loading ? (
             <div className="animate-pulse bg-gray-100 h-40 rounded"></div>
           ) : orders.length === 0 ? (
             <p className="text-[14px]">You have not placed any orders yet.</p>
           ) : orders.map(order => (
             <div key={order.id} className="border border-[#ddd] rounded-[8px] overflow-hidden">
                {/* Order Header Strip */}
                <div className="bg-[#f0f2f2] px-6 py-3 flex justify-between items-center text-[12px] text-[#565959]">
                   <div className="flex gap-12">
                      <div className="flex flex-col uppercase">
                         <span>Order Placed</span>
                         <span className="text-[#0f1111] font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col uppercase">
                         <span>Total</span>
                         <span className="text-[#0f1111] font-medium">₹{(order.total_amount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col uppercase">
                         <span>Ship To</span>
                         <span className="text-[#007185] hover:text-[#c45500] cursor-pointer hover:underline">{order.shipping_address ? order.shipping_address.split(',')[0] : 'Customer'}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end uppercase">
                      <span>Order # {order.order_id || 'AMZ-123-445'}</span>
                      <div className="flex gap-2">
                        <Link to={`/orders/${order.id}`} className="text-[#007185] hover:underline">View order details</Link>
                        <span className="text-gray-300">|</span>
                        <Link to={`/invoice/${order.id}`} className="text-[#007185] hover:underline">Invoice</Link>
                      </div>
                   </div>
                </div>

                {/* Order Item Content */}
                <div className="p-6 flex flex-col gap-4">
                   <h3 className="text-[18px] font-bold text-[#0f1111]">Delivered</h3>
                   {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                         <div className="w-[90px] h-[90px] p-1 border rounded cursor-pointer">
                            <img src={item.image_url || 'https://via.placeholder.com/90'} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1">
                            <Link to={`/products/${item.product_id}`} className="text-[#007185] hover:text-[#c45500] hover:underline text-[14px] font-medium line-clamp-2 leading-snug">
                               {item.name || 'Product'}
                            </Link>
                            <p className="text-[12px] text-[#565959] mt-1 italic">Return window closed on 12-Apr-2024</p>
                            <div className="flex gap-2 mt-4">
                               <button className="amazon-button-yellow rounded-[8px] border border-[#a88734] px-4 py-1.5 text-[13px] shadow-sm">Buy it again</button>
                               <button className="bg-[#f0f2f2] hover:bg-[#e7e9eb] border border-[#d5d9d9] rounded-[8px] px-4 py-1.5 text-[13px] shadow-sm">View your item</button>
                            </div>
                         </div>
                         <div className="w-[200px] flex flex-col gap-2">
                            <button className="w-full py-1.5 border border-[#ddd] rounded-[8px] text-[13px] hover:bg-gray-50 shadow-sm">Track package</button>
                            <button className="w-full py-1.5 border border-[#ddd] rounded-[8px] text-[13px] hover:bg-gray-50 shadow-sm">Return or replace items</button>
                            <button className="w-full py-1.5 border border-[#ddd] rounded-[8px] text-[13px] hover:bg-gray-50 shadow-sm">Write a product review</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
