import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, Printer } from 'lucide-react';

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

  if (loading) return <div className="animate-pulse bg-white min-h-screen"></div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-2 border-b border-[#ddd] bg-[#f8f8f8] mb-2 flex items-center justify-between">
         <Link to="/orders" className="text-[12px] text-[#565959] hover:text-[#c45500] flex items-center gap-1 no-underline">
           <span>‹</span> Back to orders
         </Link>
      </div>
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-[14px] mb-4 text-[#565959]">
           <Link to="/account" className="hover:underline">Your Account</Link> <ChevronRight size={12}/>
           <Link to="/orders" className="hover:underline">Your Orders</Link> <ChevronRight size={12}/>
           <span className="text-[#c45500]">Order Details</span>
        </div>

        <div className="flex justify-between items-center mb-6">
           <h1 className="text-[28px] font-normal">Order Details</h1>
           <div className="flex gap-4 text-[13px] text-[#007185]">
              <span>Ordered on {new Date(order.placed_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="text-gray-300">|</span>
              <span>Order# {order.order_id}</span>
           </div>
        </div>

        <div className="border border-[#ddd] rounded-[8px] p-6 mb-6 flex flex-col md:flex-row gap-8 text-[14px]">
           <div className="flex-1">
              <h3 className="font-bold mb-2">Shipping Address</h3>
              <p>{order.shipping_name}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
              <p>{order.shipping_country}</p>
           </div>
           <div className="flex-1">
              <h3 className="font-bold mb-2">Payment Methods</h3>
              <p className="flex items-center gap-2">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
                 <span>Ending in 1234</span>
              </p>
           </div>
           <div className="w-[250px] bg-gray-50 border-l border-[#eee] pl-8 flex flex-col gap-1">
              <h3 className="font-bold mb-2">Order Summary</h3>
              <div className="flex justify-between"><span>Item(s) Subtotal:</span> <span>₹{parseFloat(order.subtotal).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping & Handling:</span> <span>₹{parseFloat(order.shipping_amount).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Total before tax:</span> <span>₹{(parseFloat(order.subtotal) + parseFloat(order.shipping_amount)).toLocaleString()}</span></div>
              <div className="flex justify-between mb-1"><span>Tax:</span> <span>₹{parseFloat(order.tax_amount).toLocaleString()}</span></div>
              <div className="flex justify-between font-bold text-[16px]"><span>Grand Total:</span> <span>₹{parseFloat(order.total_amount).toLocaleString()}</span></div>
           </div>
        </div>

        <div className="border border-[#ddd] rounded-[8px] overflow-hidden">
           <div className="bg-[#f0f2f2] px-6 py-3 font-bold border-b border-[#ddd]">
              Delivered {new Date(order.placed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
           </div>
           <div className="p-6 flex flex-col gap-6">
              {items.map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-[100px] h-[100px] shrink-0">
                       <img src={item.product_image || 'https://via.placeholder.com/100'} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                       <Link to={`/products/${item.product_id}`} className="text-[#007185] hover:text-[#c45500] font-medium block mb-1">
                          {item.product_name}
                       </Link>
                       <p className="text-[12px] text-[#565959]">Sold by: Amazon Retail</p>
                       <p className="text-[14px] text-[#b12704] mt-2 font-medium">₹{parseFloat(item.price).toLocaleString()}</p>
                       <div className="flex gap-4 mt-4">
                          <button className="amazon-button-yellow px-4 py-1 rounded-[8px] text-[12px] border border-[#a88734]">Buy it again</button>
                          <button className="bg-white px-4 py-1 border border-[#ddd] rounded-[8px] text-[12px] hover:bg-gray-50">Track package</button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="flex justify-end mt-4">
           <button className="flex items-center gap-2 text-[13px] text-[#007185] hover:underline">
              <Printer size={16}/> Print packing slip
           </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
