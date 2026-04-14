import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, CreditCard, Smartphone, Landmark } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery (COD)', icon: '💵', desc: 'Pay when your order arrives' },
  { value: 'upi', label: 'UPI Payment', icon: '📱', desc: 'Pay using PhonePe, GPay, Paytm etc.' },
  { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay and more' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, summary, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [form, setForm] = useState({
    shipping_name: 'Aryan Mittal',
    shipping_phone: '+91-9876543210',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: 'Delhi',
    shipping_pincode: '',
    shipping_country: 'India',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Checkout - Amazon.in';
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.shipping_name.trim()) newErrors.shipping_name = 'Full name is required';
    if (!form.shipping_phone.trim()) newErrors.shipping_phone = 'Phone is required';
    if (!form.shipping_address_line1.trim()) newErrors.shipping_address_line1 = 'Address is required';
    if (!form.shipping_city.trim()) newErrors.shipping_city = 'City is required';
    if (!form.shipping_state) newErrors.shipping_state = 'State is required';
    if (!form.shipping_pincode.trim()) newErrors.shipping_pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(form.shipping_pincode)) newErrors.shipping_pincode = 'Enter valid 6-digit PIN code';
    if (!form.shipping_phone.trim()) newErrors.shipping_phone = 'Phone is required';
    else if (!/^[+\d\s-]{10,}$/.test(form.shipping_phone)) newErrors.shipping_phone = 'Enter valid phone number';
    return newErrors;
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await placeOrder({ ...form, payment_method: paymentMethod });
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data.order.order_id}`, { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = summary.subtotal;
  const tax = Math.round(subtotal * 0.18);
  const shipping = summary.shipping;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-[1500px] mx-auto px-4">
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '16px 0', borderBottom: '1px solid #DDD', marginBottom: 16
      }}>
        <Link to="/" style={{ fontSize: 28, fontWeight: 800, color: '#131921', textDecoration: 'none' }}>
          amazon<span style={{ color: '#FF9900' }}>.in</span>
        </Link>
        <div style={{ fontSize: 22, color: '#131921', marginLeft: 8 }}>Checkout</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#007600' }}>
          <Lock size={16} /> Secure checkout
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1280px] mx-auto items-start pb-20" id="checkout-page">
        {/* Left Column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 w-full">
          {/* Step 1: Shipping Address */}
          <div className="border-b border-[#CCC] pb-6" id="shipping-address-form">
            <div className="text-[22px] font-bold text-[#C45500] mb-4 flex items-center">
              <span className="bg-[#131921] text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-[13px] mr-2">1</span>
              Enter a new shipping address
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3 pl-0 md:pl-8">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">Full Name *</label>
                <input
                  type="text"
                  name="shipping_name"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_name ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_name}
                  onChange={handleChange}
                  placeholder="First and last name"
                  id="input-full-name"
                />
                {errors.shipping_name && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_name}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">Phone Number *</label>
                <input
                  type="tel"
                  name="shipping_phone"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_phone ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  id="input-phone"
                />
                {errors.shipping_phone && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_phone}</span>}
              </div>

              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-[13px] font-bold text-[#111]">Address Line 1 *</label>
                <input
                  type="text"
                  name="shipping_address_line1"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_address_line1 ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_address_line1}
                  onChange={handleChange}
                  placeholder="House/Flat No., Building name, Street"
                  id="input-address1"
                />
                {errors.shipping_address_line1 && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_address_line1}</span>}
              </div>

              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-[13px] font-bold text-[#111]">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="shipping_address_line2"
                  className="h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
                  value={form.shipping_address_line2}
                  onChange={handleChange}
                  placeholder="Landmark, Area"
                  id="input-address2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">City *</label>
                <input
                  type="text"
                  name="shipping_city"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_city ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_city}
                  onChange={handleChange}
                  placeholder="City"
                  id="input-city"
                />
                {errors.shipping_city && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_city}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">PIN Code *</label>
                <input
                  type="text"
                  name="shipping_pincode"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_pincode ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  id="input-pincode"
                />
                {errors.shipping_pincode && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_pincode}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">State *</label>
                <select
                  name="shipping_state"
                  className={`h-[31px] px-[7px] py-[3px] text-[13px] bg-[#F0F2F2] border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] ${errors.shipping_state ? 'border-[#CC0C39] shadow-[0_0_0_2px_rgba(204,12,57,0.2)]' : ''}`}
                  value={form.shipping_state}
                  onChange={handleChange}
                  id="input-state"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.shipping_state && <span className="text-[#CC0C39] text-[12px] font-bold mt-1">{errors.shipping_state}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-[#111]">Country</label>
                <input
                  type="text"
                  className="h-[31px] px-[7px] py-[3px] text-[13px] border border-[#a6a6a6] rounded-[3px]"
                  value="India"
                  disabled
                  style={{ background: '#f5f5f5' }}
                />
              </div>

              <div className="flex flex-col gap-1 col-span-1 md:col-span-2">
                <label className="text-[13px] font-bold text-[#111]">Delivery Instructions (Optional)</label>
                <textarea
                  name="notes"
                  className="px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for delivery..."
                  rows={2}
                  style={{ resize: 'vertical' }}
                  id="input-notes"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment */}
          <div className="border-b border-[#CCC] pb-6" id="payment-section">
            <div className="text-[22px] font-bold text-[#C45500] mb-4 flex items-center">
              <span className="bg-[#131921] text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-[13px] mr-2">2</span>
              Choose a payment method
            </div>

            {PAYMENT_METHODS.map(method => (
              <div
                key={method.value}
                className={`flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer transition-all hover:border-[#e77600] ${paymentMethod === method.value ? 'border-[#e77600] bg-[#fdfaf6] shadow-[0_0_0_2px_rgba(228,121,17,0.2)]' : 'border-[#ececec] bg-[#f7f7f7]'}`}
                onClick={() => setPaymentMethod(method.value)}
                id={`payment-${method.value}`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value)}
                />
                <span style={{ fontSize: 20 }}>{method.icon}</span>
                <div className="flex flex-col">
                  <strong className="text-[#0F1111] text-[14px] leading-[1]">{method.label}</strong>
                  <small className="text-[#565959] text-[12px] mt-0.5">{method.desc}</small>
                </div>
              </div>
            ))}
          </div>

          {/* Step 3: Review Items */}
          <div className="border-b border-[#CCC] pb-6" id="order-review">
            <div className="text-[22px] font-bold text-[#C45500] mb-4 flex items-center">
              <span className="bg-[#131921] text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-[13px] mr-2">3</span>
              Review items and delivery
            </div>

            {items.map(item => (
              <div key={item.cart_id} className="flex items-start gap-4 p-4 border border-[#ececec] rounded mb-3">
                <img
                  src={item.image || 'https://via.placeholder.com/70x70/f7f7f7/aaaaaa?text=Product'}
                  alt={item.name}
                  className="w-[70px] h-[70px] object-contain flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/70x70/f7f7f7/aaaaaa?text=Product'; }}
                />
                <div style={{ flex: 1 }}>
                  <div className="text-[#007185] font-bold text-[14px] leading-[1.3] mb-1">{item.name}</div>
                  <div className="text-[#565959] text-[13px]">Qty: {item.quantity}</div>
                  {item.is_prime && (
                    <div style={{ fontSize: 11, color: '#00A8E0', fontWeight: 700, fontStyle: 'italic', marginTop: 2 }}>prime</div>
                  )}
                </div>
                <div className="font-bold text-[14px] text-[#B12704] flex-shrink-0 whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}

            <button
              className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-1 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] mt-4 mb-2 hover:bg-[#f4d078] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              id="place-order-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, border: '2px solid #333', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  Placing Order...
                </span>
              ) : (
                `Place your order · ₹${total.toLocaleString('en-IN')}`
              )}
            </button>

            <p style={{ fontSize: 12, color: '#565959', marginTop: 8, textAlign: 'center' }}>
              By placing your order, you agree to Amazon's{' '}
              <a href="#" style={{ color: '#007185' }}>privacy notice</a> and{' '}
              <a href="#" style={{ color: '#007185' }}>conditions of use</a>.
            </p>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-[320px] p-[18px] bg-white border border-[#DDD] rounded shrink-0" id="checkout-summary">
          <button
            className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-2 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] mb-2 hover:bg-[#f4d078] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePlaceOrder}
            disabled={loading || items.length === 0}
            id="place-order-btn-top"
          >
            {loading ? 'Placing...' : 'Place your order'}
          </button>

          <p style={{ fontSize: 12, color: '#565959', margin: '8px 0 16px', textAlign: 'center' }}>
            By placing your order, you agree to Amazon's{' '}
            <a href="#" style={{ color: '#007185' }}>privacy notice</a> and{' '}
            <a href="#" style={{ color: '#007185' }}>conditions of use</a>.
          </p>

          <div style={{ borderTop: '1px solid #DDD', paddingTop: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#131921' }}>
              Order Summary
            </div>

            <div className="flex justify-between text-[14px] mb-2 text-[#0F1111]">
              <span>Items ({summary.totalItems}):</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[14px] mb-2 text-[#0F1111]">
              <span>Shipping & handling:</span>
              <span style={{ color: shipping === 0 ? '#007600' : undefined }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-[14px] mb-2 text-[#0F1111]">
              <span>Before tax:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[14px] mb-2 text-[#0F1111]">
              <span>Estimated GST (18%):</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[14px] mb-2 text-[#0F1111] font-bold mt-3 pt-3 border-t border-[#DDD] sm:text-[18px]">
              <span>Order total:</span>
              <span style={{ color: '#CC0C39' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#565959' }}>
            <Shield size={14} color="#007600" />
            All transactions are secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
