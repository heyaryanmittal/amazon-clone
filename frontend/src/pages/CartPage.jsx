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
    <div className="max-w-[1500px] mx-auto px-4">
      <div className="flex gap-4 items-start py-4 flex-col lg:flex-row">
        {/* Cart Main */}
        <div className="flex-1 bg-white p-6 rounded-[3px] min-w-0 w-full" id="shopping-cart">
          <h1 className="text-[28px] font-normal border-b border-[#DDD] pb-2 mb-4">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 py-[48px] text-center text-[#565959] bg-white rounded-lg border border-[#eee]">
              <span className="text-5xl mb-4 opacity-50">🛒</span>
              <h2>Your Amazon Cart is empty</h2>
              <p>Add items to begin a new order. Your shopping cart lives here.</p>
              <Link to="/products" className="bg-[#FF9900] text-[#333] border border-[#c45500] rounded-full py-1.5 px-3.5 font-semibold text-[13px] inline-flex items-center gap-2 cursor-pointer transition-all duration-150 no-underline hover:bg-[#e68a00] mt-4">
                <ShoppingBag size={16} /> Shop today's deals
              </Link>
            </div>
          ) : (
            <>
              <div className="text-right mb-2">
                <span className="text-[14px] text-[#565959]">
                  Price
                </span>
              </div>
              <hr className="border-[#DDD] mb-2" />

              {items.map(item => (
                <div key={item.cart_id} className="flex gap-4 py-4 border-b border-[#DDD]" id={`cart-item-${item.cart_id}`}>
                  {/* Image */}
                  <Link to={`/products/${item.product_id}`} className="w-[180px] shrink-0">
                    <img
                      src={item.image || `https://via.placeholder.com/100x100/f7f7f7/aaaaaa?text=Product`}
                      alt={item.name}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100/f7f7f7/aaaaaa?text=Product'; }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col gap-1">
                    <Link to={`/products/${item.product_id}`}>
                      <h3>{item.name}</h3>
                    </Link>

                    {item.stock > 0 ? (
                      <div className="text-[#007600] text-[12px]">In Stock</div>
                    ) : (
                      <div className="text-[#CC0C39] text-[12px]">Out of Stock</div>
                    )}

                    {item.is_prime && (
                      <div className="flex items-center gap-1 text-[12px] text-[#565959]">
                        <span className="italic font-extrabold text-[#00A8E0]">prime</span> Eligible
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1.5 border border-[#DDD] rounded px-1.5 py-0.5">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) removeItem(item.cart_id);
                            else updateItem(item.cart_id, item.quantity - 1);
                          }}
                          className="bg-none border-none cursor-pointer p-0.5 flex items-center hover:bg-[#f3f3f3] rounded"
                          id={`decrease-${item.cart_id}`}
                        >
                          {item.quantity === 1 ? <Trash2 size={14} color="#CC0C39" /> : <Minus size={14} />}
                        </button>
                        <span className="text-[15px] font-semibold min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.cart_id, item.quantity + 1)}
                          disabled={item.quantity >= Math.min(item.stock, 10)}
                          className="bg-none border-none cursor-pointer p-0.5 flex items-center hover:bg-[#f3f3f3] rounded disabled:opacity-50"
                          id={`increase-${item.cart_id}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-[#565959] text-[12px]">|</span>
                      <button
                        className="text-[#007185] text-[12px] cursor-pointer bg-none border-none p-0 inline hover:text-[#C45500] hover:underline"
                        onClick={() => removeItem(item.cart_id)}
                        id={`remove-${item.cart_id}`}
                      >
                        Delete
                      </button>
                      <span className="text-[#565959] text-[12px]">|</span>
                      <button className="text-[#007185] text-[12px] cursor-pointer bg-none border-none p-0 inline hover:text-[#C45500] hover:underline">Save for later</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-[18px] font-bold text-[#131921] text-right shrink-0 min-w-[100px]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    {item.quantity > 1 && (
                      <div className="text-[12px] text-[#565959] font-normal">
                        (₹{parseInt(item.price).toLocaleString('en-IN')} each)
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="text-right text-[18px] py-4">
                Subtotal ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''}):&nbsp;
                <strong>₹{summary.subtotal.toLocaleString('en-IN')}</strong>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="shrink-0 bg-white p-5 rounded-[3px] flex flex-col gap-4 w-full lg:w-[300px]" id="cart-summary">
            {summary.shipping === 0 ? (
              <div className="text-[13px] text-[#007600] flex items-center gap-1">
                ✅ Your order qualifies for FREE Delivery
              </div>
            ) : (
              <div className="text-[13px] text-[#C45500] mb-3">
                Add ₹{(499 - summary.subtotal).toFixed(0)} more for FREE delivery
              </div>
            )}

            <div className="flex justify-between items-center text-[14px]">
              <span>Subtotal ({summary.totalItems} items):</span>
              <span>₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span>Shipping & handling:</span>
              <span>{summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span>GST (18%):</span>
              <span>₹{Math.round(summary.subtotal * 0.18).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-[18px] font-bold text-[#b12704] border-t border-[#DDD] pt-2 mt-2">
              <span>Order total:</span>
              <span>₹{Math.round(summary.subtotal + (summary.subtotal * 0.18) + summary.shipping).toLocaleString('en-IN')}</span>
            </div>

            <button
              className="w-full bg-[#F0C14B] text-[#333] border border-[#a88734] rounded-full py-2 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.2)] font-semibold cursor-pointer transition-all duration-150 hover:bg-[#DDB347]"
              onClick={() => navigate('/checkout')}
              id="proceed-to-checkout-btn"
            >
              Proceed to Buy ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''})
            </button>

            <div className="flex items-center justify-center gap-1 text-[#565959] text-[12px]">
              <Shield size={14} />
              Secure checkout with 256-bit encryption
            </div>

            <div className="mt-4 border-t border-[#DDD] pt-3">
              <div className="flex items-center gap-2 text-[13px] text-[#007600] mb-2">
                <Truck size={14} color="#007600" />
                <span>FREE delivery on orders above ₹499</span>
              </div>
              <div className="text-[12px] text-[#CC0C39]">
                <button
                  onClick={clearCart}
                  className="bg-none border-none text-[#007185] cursor-pointer text-[12px] hover:text-[#C45500] hover:underline"
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
