import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { getOrders } from '../services/api';

const STATUS_COLORS = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    document.title = 'Your Orders - Amazon.in';
    getOrders().then(({ data }) => {
      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

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
    <div className="container">
      <div className="orders-page" id="orders-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, color: '#131921' }}>Your Orders</h1>
          <span style={{ fontSize: 14, color: '#565959' }}>
            {pagination.total || orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="section">
            <div className="empty-state">
              <span className="empty-state-icon">📦</span>
              <h2>No orders yet</h2>
              <p>You haven't placed any orders. Start shopping!</p>
              <Link to="/products" className="btn-primary">Shop Now</Link>
            </div>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card" id={`order-${order.order_id}`}>
              {/* Header */}
              <div className="order-card-header">
                <div className="order-card-header-item">
                  <div className="label">ORDER PLACED</div>
                  <div className="value">
                    {new Date(order.placed_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="order-card-header-item">
                  <div className="label">TOTAL</div>
                  <div className="value">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</div>
                </div>
                <div className="order-card-header-item">
                  <div className="label">SHIP TO</div>
                  <div className="value">{order.shipping_name}</div>
                </div>
                <div className="order-card-header-item">
                  <div className="label">STATUS</div>
                  <div className="value">
                    <span className={`order-status-badge ${STATUS_COLORS[order.status] || 'status-pending'}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/orders/${order.order_id}`}
                    style={{
                      color: '#007185',
                      textDecoration: 'none',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                  <div style={{ fontSize: 11, color: '#565959', marginTop: 4 }}>
                    {order.order_id}
                  </div>
                </div>
              </div>

              {/* Items preview */}
              <div className="order-card-body">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from({ length: Math.min(order.item_count || 1, 4) }).map((_, i) => (
                    <div key={i} style={{
                      width: 60, height: 60,
                      background: '#f0f0f0',
                      borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      📦
                    </div>
                  ))}
                  {order.item_count > 4 && (
                    <div style={{
                      width: 60, height: 60, background: '#f5f5f5', borderRadius: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: '#565959',
                    }}>
                      +{order.item_count - 4}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Link
                    to={`/orders/${order.order_id}`}
                    style={{ fontSize: 13, color: '#007185', textDecoration: 'none' }}
                  >
                    View order details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
