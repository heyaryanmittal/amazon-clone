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
    <div className="max-w-[1500px] mx-auto px-4">
      <div className="py-4 max-w-[1000px] mx-auto min-h-[calc(100vh-140px)]" id="orders-page">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-normal text-[#131921] m-0">Your Orders</h1>
          <span className="text-[14px] text-[#565959] ml-auto">
            {pagination.total || orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white mb-2 p-6 rounded-[3px]">
            <div className="flex flex-col items-center justify-center p-12 text-center text-[#565959] bg-white rounded-lg border border-[#eee]">
              <span className="text-5xl mb-4 opacity-50">📦</span>
              <h2>No orders yet</h2>
              <p>You haven't placed any orders. Start shopping!</p>
              <Link to="/products" className="bg-[#FF9900] text-[#333] border border-[#c45500] rounded-full py-1.5 px-3.5 font-semibold text-[13px] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 no-underline hover:bg-[#e68a00] mt-4">Shop Now</Link>
            </div>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="border border-[#D5D9D9] rounded-lg mb-4 overflow-hidden shadow-[0_1px_2px_rgba(15,17,17,0.15)] flex flex-col bg-white" id={`order-${order.order_id}`}>
              {/* Header */}
              <div className="bg-[#F0F2F2] border-b border-[#D5D9D9] px-[18px] py-[14px] flex flex-wrap gap-4 md:gap-8 justify-between">
                <div className="flex flex-col">
                  <div className="text-[11px] text-[#565959] mb-1 font-bold tracking-[0.2px] uppercase">ORDER PLACED</div>
                  <div className="text-[13px] text-[#565959]">
                    {new Date(order.placed_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-[11px] text-[#565959] mb-1 font-bold tracking-[0.2px] uppercase">TOTAL</div>
                  <div className="text-[13px] text-[#565959]">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-[11px] text-[#565959] mb-1 font-bold tracking-[0.2px] uppercase">SHIP TO</div>
                  <div className="text-[13px] text-[#565959]">{order.shipping_name}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-[11px] text-[#565959] mb-1 font-bold tracking-[0.2px] uppercase">STATUS</div>
                  <div className="text-[13px] text-[#565959]">
                    <span className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold uppercase tracking-[0.5px] whitespace-nowrap ${
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
                  </div>
                </div>
                <div>
                  <Link
                    to={`/orders/${order.order_id}`}
                    className="text-[#007185] no-underline text-[13px] flex items-center gap-1 hover:text-[#C45500] hover:underline"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                  <div className="text-[11px] text-[#565959] mt-1">
                    {order.order_id}
                  </div>
                </div>
              </div>

              {/* Items preview */}
              <div className="p-[18px] flex flex-col bg-white">
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
                    className="text-[13px] text-[#007185] no-underline hover:text-[#C45500] hover:underline"
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
