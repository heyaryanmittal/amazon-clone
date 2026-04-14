import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { getOrder, cancelOrder } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Order ${orderId} - Amazon.in`;
    getOrder(orderId).then(({ data }) => {
      setOrder(data.order);
      setItems(data.items || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cannot cancel this order');
    }
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

  if (!order) {
    return (
      <div className="container">
        <div className="section">
          <div className="empty-state">
            <span className="empty-state-icon">❌</span>
            <h2>Order not found</h2>
            <Link to="/orders" className="btn-primary">Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-[#007185] text-[14px] no-underline mb-4 hover:text-[#C45500] hover:underline">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="grid gap-4 max-w-[1000px]">
        {/* Order Header */}
        <div className="bg-white p-6 rounded-[3px] border border-[#d5d9d9] shadow-[0_1px_2px_rgba(15,17,17,0.15)]" id={`order-detail-${orderId}`}>
          <div className="flex justify-between flex-wrap gap-4 mb-4 pb-4 border-b border-[#ececec]">
            <div>
              <h1 className="text-[24px] font-normal mb-1">Order Details</h1>
              <div className="text-[13px] text-[#565959]">
                Order #{order.order_id} · Placed on{' '}
                {new Date(order.placed_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-[3px] text-[14px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ${
                order.status === 'pending' ? 'bg-[#fcf3e6] text-[#c4772b] border border-[#f5b871]' :
                order.status === 'confirmed' ? 'bg-[#e6fcf2] text-[#007600] border border-[#71f5af]' :
                order.status === 'processing' ? 'bg-[#e6f2fc] text-[#007185] border border-[#71bff5]' :
                order.status === 'shipped' ? 'bg-[#ece6fc] text-[#481ca6] border border-[#a871f5]' :
                order.status === 'delivered' ? 'bg-[#e6fcf2] text-[#007600] border border-[#71f5af]' :
                order.status === 'cancelled' ? 'bg-[#fce6e6] text-[#cc0c39] border border-[#f57171]' :
                'bg-[#fcf3e6] text-[#c4772b] border border-[#f5b871]'
              }`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  className="bg-white border border-[#CC0C39] text-[#CC0C39] px-4 py-1.5 rounded cursor-pointer text-[13px] hover:bg-[#fef2f2]"
                  id="cancel-order-btn"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-[18px] font-semibold mb-3">Items Ordered</h3>
            {items.map(item => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[#ececec] last:border-0 last:pb-0">
                <img
                  src={item.product_image || 'https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=Product'}
                  alt={item.product_name}
                  className="w-[60px] h-[60px] object-contain flex-shrink-0 bg-[#f7f7f7]"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=Product'; }}
                />
                <div className="flex-1 min-w-0 pr-4">
                  <Link
                    to={`/products/${item.product_id}`}
                    className="text-[#007185] no-underline hover:text-[#C45500] hover:underline font-bold text-[14px]"
                  >
                    {item.product_name}
                  </Link>
                  <div className="text-[#565959] text-[13px] mt-1">
                    Qty: {item.quantity} · ₹{parseFloat(item.price).toLocaleString('en-IN')} each
                  </div>
                </div>
                <div className="font-bold text-[16px] flex-shrink-0">
                  ₹{parseFloat(item.total_price).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-[3px] border border-[#d5d9d9] shadow-[0_1px_2px_rgba(15,17,17,0.15)]">
            <h3 className="text-[16px] font-semibold mb-3">Shipping Address</h3>
            <div className="text-[14px] leading-[1.7] text-[#333]">
              <strong>{order.shipping_name}</strong><br />
              {order.shipping_address_line1}<br />
              {order.shipping_address_line2 && <>{order.shipping_address_line2}<br /></>}
              {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}<br />
              {order.shipping_country}<br />
              <span className="text-[#565959]">📞 {order.shipping_phone}</span>
            </div>
          </div>

          {/* Payment & Total */}
          <div className="bg-white p-6 rounded-[3px] border border-[#d5d9d9] shadow-[0_1px_2px_rgba(15,17,17,0.15)]">
            <h3 className="text-[16px] font-semibold mb-3">Payment Information</h3>
            <div className="text-[14px] mb-4">
              <span className="text-[#565959]">Method: </span>
              <strong className="capitalize">{order.payment_method?.replace('_', ' ') || 'COD'}</strong>
            </div>

            <h3 className="text-[16px] font-semibold mb-3">Order Summary</h3>
            <div className="text-[14px]">
              {[
                ['Item(s) subtotal', `₹${parseFloat(order.subtotal).toLocaleString('en-IN')}`],
                ['Shipping', order.shipping_amount == 0 ? 'FREE' : `₹${order.shipping_amount}`],
                ['GST', `₹${parseFloat(order.tax_amount).toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between mb-1.5">
                  <span className="text-[#565959]">{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-[16px] border-t border-[#DDD] pt-2 mt-2">
                <span>Grand Total:</span>
                <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
