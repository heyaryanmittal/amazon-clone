import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';
import { ChevronRight, Printer, Package } from 'lucide-react';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId).then(({ data }) => {
      setOrder(data.order);
      setItems(data.items || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div className="bg-white min-h-screen p-10">
      <div className="max-w-[1000px] mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6 rounded"></div>
        <div className="h-40 bg-gray-100 rounded mb-6"></div>
        <div className="h-64 bg-gray-50 rounded"></div>
      </div>
    </div>
  );

  if (!order) return (
    <div className="p-10 text-center">
      <h2 className="text-xl mb-4">Order not found.</h2>
      <Link to="/orders" className="text-[#007185] hover:underline">Back to your orders</Link>
    </div>
  );

  // Helper to safely format numbers
  const f = (val) => parseFloat(val || 0).toLocaleString('en-IN');

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center gap-2 text-[13px] text-[#565959]">
         <Link to="/orders" className="hover:underline hover:text-[#c45500]">Your Account</Link> 
         <ChevronRight size={14}/>
         <Link to="/orders" className="hover:underline hover:text-[#c45500]">Your Orders</Link> 
         <ChevronRight size={14}/>
         <span className="text-[#c45500]">Order Details</span>
      </div>

      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
           <h1 className="text-[28px] font-normal">Order Details</h1>
           <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#565959]">
              <span>Ordered on {new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="hidden md:inline text-gray-300">|</span>
              <span>Order# {order.orderId}</span>
           </div>
        </div>

        {/* Info Card */}
        <div className="border border-[#ddd] rounded-[8px] p-6 mb-6 flex flex-col md:flex-row gap-8 text-[14px]">
           <div className="flex-1">
              <h3 className="font-bold mb-2">Shipping Address</h3>
              <p className="font-medium text-[#111]">{order.shippingName}</p>
              <p>{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
              <p>{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
              <p>{order.shippingCountry}</p>
           </div>
           
           <div className="flex-1">
              <h3 className="font-bold mb-2">Payment Methods</h3>
              <div className="flex items-center gap-2">
                 {order.paymentMethod === 'cod' ? (
                   <span className="px-2 py-0.5 bg-gray-100 rounded text-[12px] font-bold uppercase tracking-wider text-gray-600">CASH ON DELIVERY</span>
                 ) : (
                   <div className="flex items-center gap-2">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                     <span>Ending in 1234</span>
                   </div>
                 )}
              </div>
           </div>

           <div className="w-full md:w-[300px] border-t md:border-t-0 md:border-l border-[#eee] pt-4 md:pt-0 md:pl-8 flex flex-col gap-1">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between text-[#565959]"><span>Item(s) Subtotal:</span> <span>₹{f(order.subtotal)}</span></div>
              <div className="flex justify-between text-[#565959]"><span>Shipping & Handling:</span> <span>₹{f(order.shippingAmount)}</span></div>
              <div className="flex justify-between text-[#565959]"><span>Total before tax:</span> <span>₹{f(parseFloat(order.subtotal) + parseFloat(order.shippingAmount))}</span></div>
              <div className="flex justify-between text-[#565959] mb-1"><span>Tax (18% GST):</span> <span>₹{f(order.taxAmount)}</span></div>
              <div className="flex justify-between font-bold text-[16px] text-[#B12704] pt-1 border-t border-[#eee]">
                 <span>Grand Total:</span> <span>₹{f(order.totalAmount)}</span>
              </div>
           </div>
        </div>

        {/* Items List */}
        <div className="border border-[#ddd] rounded-[8px] overflow-hidden mb-8">
           <div className="bg-[#f0f2f2] px-6 py-3 border-b border-[#ddd] flex justify-between items-center">
              <span className="font-bold text-[14px]">Status: {order.status?.toUpperCase()}</span>
              <span className="text-[13px] text-[#565959]">Target delivery: {new Date(new Date(order.placedAt).getTime() + 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
           </div>
           
           <div className="p-6 flex flex-col gap-6">
              {items.map((item, i) => (
                 <div key={item.id || i} className="flex gap-4 md:gap-8 border-b border-[#eee] last:border-0 pb-6 last:pb-0">
                    <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] shrink-0 bg-white p-2">
                       <img src={item.productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" onError={(e)=>{ e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'; }} />
                    </div>
                    <div className="flex-1 flex flex-col">
                       <Link to={`/products/${item.productId}`} className="text-[#007185] hover:text-[#c45500] font-medium text-[16px] leading-[1.3] block mb-1">
                          {item.productName}
                       </Link>
                       <p className="text-[12px] text-[#565959]">Quantity: {item.quantity}</p>
                       <p className="text-[12px] text-[#565959] mt-1">Sold by: Amazon Retail</p>
                       
                       <p className="text-[15px] text-[#b12704] mt-3 font-bold">₹{f(item.price)}</p>
                       
                       <div className="flex flex-wrap gap-4 mt-4">
                          <button className="amazon-button-yellow px-6 py-1 rounded-[8px] text-[12px] border border-[#a88734] font-medium shadow-sm">Buy it again</button>
                          <button className="bg-white px-6 py-1 border border-[#D5D9D9] rounded-[8px] text-[12px] font-medium hover:bg-[#F7FAFA] shadow-sm">Track package</button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-[#eee]">
            <button className="flex items-center gap-2 text-[13px] text-[#007185] hover:underline font-medium">
               <Printer size={16}/> Print packing slip
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
