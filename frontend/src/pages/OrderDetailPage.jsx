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
    <div className="container" style={{ padding: '16px' }}>
      <Link to="/orders" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: '#007185', fontSize: 14, textDecoration: 'none', marginBottom: 16
      }}>
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div style={{ display: 'grid', gap: 16 }}>
        {/* Order Header */}
        <div className="section" id={`order-detail-${orderId}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 400, marginBottom: 4 }}>Order Details</h1>
              <div style={{ fontSize: 13, color: '#565959' }}>
                Order #{order.order_id} · Placed on{' '}
                {new Date(order.placed_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`order-status-badge ${STATUS_COLORS[order.status]}`} style={{ padding: '6px 16px', fontSize: 14 }}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  style={{
                    background: 'white', border: '1px solid #CC0C39', color: '#CC0C39',
                    padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13,
                  }}
                  id="cancel-order-btn"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Items Ordered</h3>
            {items.map(item => (
              <div key={item.id} className="order-item-row">
                <img
                  src={item.product_image || 'https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=Product'}
                  alt={item.product_name}
                  className="order-item-img"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=Product'; }}
                />
                <div className="order-item-details">
                  <Link
                    to={`/products/${item.product_id}`}
                    className="order-item-name"
                  >
                    {item.product_name}
                  </Link>
                  <div className="order-item-meta">
                    Qty: {item.quantity} · ₹{parseFloat(item.price).toLocaleString('en-IN')} each
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  ₹{parseFloat(item.total_price).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Shipping Address */}
          <div className="section">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Shipping Address</h3>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: '#333' }}>
              <strong>{order.shipping_name}</strong><br />
              {order.shipping_address_line1}<br />
              {order.shipping_address_line2 && <>{order.shipping_address_line2}<br /></>}
              {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}<br />
              {order.shipping_country}<br />
              <span style={{ color: '#565959' }}>📞 {order.shipping_phone}</span>
            </div>
          </div>

          {/* Payment & Total */}
          <div className="section">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Payment Information</h3>
            <div style={{ fontSize: 14, marginBottom: 16 }}>
              <span style={{ color: '#565959' }}>Method: </span>
              <strong style={{ textTransform: 'capitalize' }}>{order.payment_method?.replace('_', ' ') || 'COD'}</strong>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Order Summary</h3>
            <div style={{ fontSize: 14 }}>
              {[
                ['Item(s) subtotal', `₹${parseFloat(order.subtotal).toLocaleString('en-IN')}`],
                ['Shipping', order.shipping_amount == 0 ? 'FREE' : `₹${order.shipping_amount}`],
                ['GST', `₹${parseFloat(order.tax_amount).toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#565959' }}>{label}:</span>
                  <span>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, borderTop: '1px solid #DDD', paddingTop: 8, marginTop: 8 }}>
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
