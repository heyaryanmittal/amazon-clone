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
    <div className="container" style={{ padding: '24px 16px' }}>
      <div className="order-confirmation" id="order-confirmation">
        <div className="confirmation-icon">✅</div>
        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">
          Thank you for shopping with Amazon Clone!
        </p>

        {order && (
          <>
            <div className="order-id-box">
              <div className="order-id-label">Your Order ID</div>
              <div className="order-id-value">{order.order_id}</div>
            </div>

            <div className="confirmation-details" id="order-details-summary">
              <div className="confirmation-detail-row">
                <span className="label">Order Total</span>
                <span className="value">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="confirmation-detail-row">
                <span className="label">Payment Method</span>
                <span className="value" style={{ textTransform: 'uppercase' }}>
                  {order.payment_method === 'cod' ? '💵 Cash on Delivery' :
                   order.payment_method === 'upi' ? '📱 UPI' :
                   order.payment_method === 'card' ? '💳 Card' : '🏦 Net Banking'}
                </span>
              </div>
              <div className="confirmation-detail-row">
                <span className="label">Deliver To</span>
                <span className="value">{order.shipping_name}, {order.shipping_city}</span>
              </div>
              <div className="confirmation-detail-row">
                <span className="label">Status</span>
                <span className="value" style={{ color: '#007600' }}>
                  ✅ {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </div>
              <div className="confirmation-detail-row">
                <span className="label">Estimated Delivery</span>
                <span className="value">3-5 Business Days</span>
              </div>
            </div>

            {/* Order Timeline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '24px 0', flexWrap: 'wrap' }}>
              {[
                { icon: <CheckCircle size={20} />, label: 'Order Confirmed', done: true },
                { icon: <Package size={20} />, label: 'Processing', done: false },
                { icon: <Truck size={20} />, label: 'Shipped', done: false },
                { icon: <Home size={20} />, label: 'Delivered', done: false },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      color: step.done ? '#007600' : '#aaa',
                      background: step.done ? '#d4edda' : '#f5f5f5',
                      borderRadius: '50%',
                      width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {step.icon}
                    </div>
                    <span style={{ fontSize: 11, color: step.done ? '#007600' : '#aaa', textAlign: 'center' }}>
                      {step.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div style={{ height: 2, width: 40, background: '#e0e0e0', marginBottom: 20 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        <div className="confirmation-actions">
          <Link to="/orders" className="btn-primary" id="view-orders-btn">
            <Package size={16} /> View Order Details
          </Link>
          <Link to="/products" className="btn-secondary" id="continue-shopping-btn">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
