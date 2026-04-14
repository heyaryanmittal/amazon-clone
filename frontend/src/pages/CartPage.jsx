import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, summary, loading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Shopping Cart - Amazon.in';
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
      <div className="cart-page">
        {/* Cart Main */}
        <div className="cart-main" id="shopping-cart">
          <h1 className="cart-title">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: '48px 0' }}>
              <span className="empty-state-icon">🛒</span>
              <h2>Your Amazon Cart is empty</h2>
              <p>Add items to begin a new order. Your shopping cart lives here.</p>
              <Link to="/products" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
                <ShoppingBag size={16} /> Shop today's deals
              </Link>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'right', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#565959' }}>
                  Price
                </span>
              </div>
              <hr style={{ borderColor: '#DDD', marginBottom: 8 }} />

              {items.map(item => (
                <div key={item.cart_id} className="cart-item" id={`cart-item-${item.cart_id}`}>
                  {/* Image */}
                  <Link to={`/products/${item.product_id}`} className="cart-item-image">
                    <img
                      src={item.image || `https://via.placeholder.com/100x100/f7f7f7/aaaaaa?text=Product`}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/f7f7f7/aaaaaa?text=Product'; }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="cart-item-info">
                    <Link to={`/products/${item.product_id}`}>
                      <h3>{item.name}</h3>
                    </Link>

                    {item.stock > 0 ? (
                      <div className="cart-item-stock">In Stock</div>
                    ) : (
                      <div className="cart-item-stock" style={{ color: '#CC0C39' }}>Out of Stock</div>
                    )}

                    {item.is_prime && (
                      <div className="cart-item-prime">
                        <span style={{ fontStyle: 'italic', fontWeight: 800 }}>prime</span> Eligible
                      </div>
                    )}

                    <div className="cart-item-controls">
                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #DDD', borderRadius: 4, padding: '2px 6px' }}>
                        <button
                          onClick={() => {
                            if (item.quantity === 1) removeItem(item.cart_id);
                            else updateItem(item.cart_id, item.quantity - 1);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                          id={`decrease-${item.cart_id}`}
                        >
                          {item.quantity === 1 ? <Trash2 size={14} color="#CC0C39" /> : <Minus size={14} />}
                        </button>
                        <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.cart_id, item.quantity + 1)}
                          disabled={item.quantity >= Math.min(item.stock, 10)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                          id={`increase-${item.cart_id}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span style={{ color: '#565959', fontSize: 12 }}>|</span>
                      <button
                        className="cart-item-action"
                        onClick={() => removeItem(item.cart_id)}
                        id={`remove-${item.cart_id}`}
                      >
                        Delete
                      </button>
                      <span style={{ color: '#565959', fontSize: 12 }}>|</span>
                      <button className="cart-item-action">Save for later</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    {item.quantity > 1 && (
                      <div style={{ fontSize: 12, color: '#565959', fontWeight: 400 }}>
                        (₹{parseInt(item.price).toLocaleString('en-IN')} each)
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="cart-subtotal-row">
                Subtotal ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''}):&nbsp;
                <strong>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="cart-summary-box" id="cart-summary">
            {summary.shipping === 0 ? (
              <div className="cart-summary-prime">
                ✅ Your order qualifies for FREE Delivery
              </div>
            ) : (
              <div style={{ fontSize: 13, color: '#C45500', marginBottom: 12 }}>
                Add ₹{(499 - summary.subtotal).toFixed(0)} more for FREE delivery
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal ({summary.totalItems} items):</span>
              <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping & handling:</span>
              <span>{summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹{Math.round(summary.subtotal * 0.18).toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row total">
              <span>Order total:</span>
              <span>₹{Math.round(summary.subtotal + (summary.subtotal * 0.18) + summary.shipping).toLocaleString('en-IN')}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
              id="proceed-to-checkout-btn"
            >
              Proceed to Buy ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''})
            </button>

            <div className="cart-secure">
              <Shield size={14} />
              Secure checkout with 256-bit encryption
            </div>

            <div style={{ marginTop: 16, borderTop: '1px solid #DDD', paddingTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#565959', marginBottom: 8 }}>
                <Truck size={14} color="#007600" />
                <span style={{ color: '#007600' }}>FREE delivery on orders above ₹499</span>
              </div>
              <div style={{ fontSize: 12, color: '#CC0C39' }}>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: 12 }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
