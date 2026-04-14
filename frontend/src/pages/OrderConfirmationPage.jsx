import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { getOrder } from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);

  useEffect(() => {
    document.title = 'Order Confirmed! - Amazon.in';
    if (!state?.order) {
      getOrder(orderId).then(({ data }) => {
        setOrder(data.order);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [orderId, state]);

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
    <div className="max-w-[1500px] mx-auto px-4 py-6">
      <div className="max-w-[600px] mx-auto bg-white p-8 rounded border border-[#CCC] text-center shadow-[0_1px_2px_rgba(15,17,17,0.15)]" id="order-confirmation">
        <div className="text-[64px] mb-4 leading-none">✅</div>
        <h1 className="text-[28px] font-bold text-[#007600] mb-2 leading-[1.2]">Order Placed Successfully!</h1>
        <p className="text-[16px] text-[#565959] mb-6">
          Thank you for shopping with Amazon Clone!
        </p>

        {order && (
          <>
            <div className="bg-[#F0F2F2] p-4 rounded mb-6 inline-block min-w-[250px] border border-[#d5d9d9]">
              <div className="text-[12px] text-[#565959] uppercase tracking-wider mb-1 font-bold">Your Order ID</div>
              <div className="text-[18px] text-[#111] font-mono tracking-wide">{order.order_id}</div>
            </div>

            <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 text-left mb-6 mx-auto max-w-[400px]" id="order-details-summary">
              <div className="flex justify-between py-3 border-b border-[#ececec] text-[14px]">
                <span className="text-[#565959]">Order Total</span>
                <span className="text-[#111] font-bold pl-4 text-right">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#ececec] text-[14px]">
                <span className="text-[#565959]">Payment Method</span>
                <span className="text-[#111] font-bold pl-4 text-right uppercase">
                  {order.payment_method === 'cod' ? '💵 Cash on Delivery' :
                   order.payment_method === 'upi' ? '📱 UPI' :
                   order.payment_method === 'card' ? '💳 Card' : '🏦 Net Banking'}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#ececec] text-[14px]">
                <span className="text-[#565959]">Deliver To</span>
                <span className="text-[#111] font-bold pl-4 text-right">{order.shipping_name}, {order.shipping_city}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#ececec] text-[14px]">
                <span className="text-[#565959]">Status</span>
                <span className="font-bold pl-4 text-right text-[#007600]">
                  ✅ {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
              <div className="flex justify-between py-3 text-[14px]">
                <span className="text-[#565959]">Estimated Delivery</span>
                <span className="text-[#111] font-bold pl-4 text-right">3-5 Business Days</span>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="flex items-center justify-center gap-2 my-6 flex-wrap">
              {[
                { icon: <CheckCircle size={20} />, label: 'Order Confirmed', done: true },
                { icon: <Package size={20} />, label: 'Processing', done: false },
                { icon: <Truck size={20} />, label: 'Shipped', done: false },
                { icon: <Home size={20} />, label: 'Delivered', done: false },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? 'bg-[#d4edda] text-[#007600]' : 'bg-[#f5f5f5] text-[#aaa]'}`}>
                      {step.icon}
                    </div>
                    <span className={`text-[11px] text-center ${step.done ? 'text-[#007600]' : 'text-[#aaa]'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className="h-[2px] w-10 bg-[#e0e0e0] mb-5" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/orders" className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-2 px-6 text-[14px] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] flex items-center justify-center gap-2 no-underline hover:bg-[#f4d078] cursor-pointer" id="view-orders-btn">
            <Package size={16} /> View Order Details
          </Link>
          <Link to="/products" className="w-full bg-white text-[#111] border border-[#D5D9D9] rounded-[3px] py-2 px-6 text-[14px] font-semibold shadow-[0_1px_2px_rgba(15,17,17,0.15)] flex items-center justify-center gap-2 no-underline hover:bg-[#F7FAFA] cursor-pointer" id="continue-shopping-btn">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
