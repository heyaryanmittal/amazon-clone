import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ChevronDown, ShoppingCart, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, summary, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Defensive data selection
  const cartItems = items || [];
  const orderSummary = summary || { subtotal: 0, totalItems: 0, shipping: 0, total: 0 };

  const [shippingData, setShippingData] = useState({
    fullName: 'Aryan Mittal', 
    mobileNumber: '9123456789', 
    pincode: '174103', 
    addressLine1: 'Aryabhatta Hostel, Chitkara University, Atal Shiksha Kunj, Pinjore', 
    addressLine2: 'BAROTIWALA INDUSTRIAL AREA', 
    city: 'HIMACHAL PRADESH', 
    state: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    try {
      const response = await placeOrder({
        shipping_name: shippingData.fullName,
        shipping_phone: shippingData.mobileNumber,
        shipping_address_line1: shippingData.addressLine1,
        shipping_address_line2: shippingData.addressLine2 || '',
        shipping_city: shippingData.city,
        shipping_state: shippingData.state,
        shipping_pincode: shippingData.pincode,
        shipping_country: 'India',
        payment_method: paymentMethod
      });
      
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${response.data.order?.order_id || 'AMZ-SUCCESS'}`);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to place order. Redirecting to success for demo.');
      setTimeout(() => navigate('/order-confirmation/AMZ-DEMO-776'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (e) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.addressLine1 || !shippingData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  return (
    <div className="bg-[#eaeded] min-h-screen font-sans pb-20">
      {/* Black Secure Header */}
      <header className="bg-[#131921] h-[60px] flex items-center px-4 md:px-10 justify-between sticky top-0 z-[1000]">
        <Link to="/" className="flex items-center no-underline">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[28px] brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
          <span className="text-white text-[14px] mt-1 ml-0.5">.in</span>
        </Link>
        <div className="flex items-center gap-1 text-white text-[20px] font-medium cursor-default">
          Secure checkout <ChevronDown size={20} className="mt-1 opacity-70" />
        </div>
        <Link to="/cart" className="flex items-center gap-2 text-white opacity-80 hover:opacity-100 cursor-pointer no-underline">
          <div className="relative">
            <ShoppingCart size={28} />
            <span className="absolute top-[-8px] right-[-8px] bg-[#f08804] text-white text-[12px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#131921]">
              {orderSummary.totalItems || 0}
            </span>
          </div>
          <span className="text-[14px] font-bold mt-2 hidden sm:inline">Cart</span>
        </Link>
      </header>

      <main className="max-w-[1250px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
           
           {/* 1. Delivery Block */}
           <div className="bg-white p-6 rounded-[4px] shadow-sm border border-white">
              {step === 1 ? (
                <div>
                   <h3 className="text-[20px] font-bold mb-4 text-[#c45500]">Select a delivery address</h3>
                   <form onSubmit={handleSelectAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[700px]">
                      <div className="col-span-2">
                        <label className="block text-[13px] font-bold mb-1">Full name (First and Last name)</label>
                        <input 
                          className="w-full border border-[#888] p-2 rounded-[3px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_#e77600] text-[14px]" 
                          value={shippingData.fullName} 
                          onChange={e => setShippingData({...shippingData, fullName: e.target.value})} 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1">Mobile number</label>
                        <input 
                          className="w-full border border-[#888] p-2 rounded-[3px] outline-none focus:border-[#e77600] text-[14px]" 
                          value={shippingData.mobileNumber} 
                          onChange={e => setShippingData({...shippingData, mobileNumber: e.target.value})} 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold mb-1">Pincode</label>
                        <input 
                          className="w-full border border-[#888] p-2 rounded-[3px] outline-none focus:border-[#e77600] text-[14px]" 
                          value={shippingData.pincode} 
                          onChange={e => setShippingData({...shippingData, pincode: e.target.value})} 
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[13px] font-bold mb-1">Flat, House no., Building, Company, Apartment</label>
                        <input 
                          className="w-full border border-[#888] p-2 rounded-[3px] outline-none focus:border-[#e77600] text-[14px]" 
                          value={shippingData.addressLine1} 
                          onChange={e => setShippingData({...shippingData, addressLine1: e.target.value})} 
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[13px] font-bold mb-1">Area, Street, Sector, Village</label>
                        <input 
                          className="w-full border border-[#888] p-2 rounded-[3px] outline-none focus:border-[#e77600] text-[14px]" 
                          value={shippingData.addressLine2} 
                          onChange={e => setShippingData({...shippingData, addressLine2: e.target.value})} 
                        />
                      </div>
                      <div className="col-span-2 mt-2">
                         <button 
                          type="submit" 
                          className="px-8 py-1.5 text-[13px] font-medium border border-[#a88734] rounded-[20px] shadow-sm transform active:scale-[0.98] transition-all"
                          style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
                         >
                           Use this address
                         </button>
                      </div>
                   </form>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-bold mb-2">Delivering to {shippingData.fullName}</h3>
                    <div className="text-[13px] text-[#333] leading-relaxed max-w-[500px]">
                      {shippingData.fullName}, {shippingData.addressLine1}, {shippingData.addressLine2}, 
                      {shippingData.city}, {shippingData.state}, {shippingData.pincode}, {shippingData.state}
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                  >
                    Change
                  </button>
                </div>
              )}
           </div>

           {/* 2. Payment Method Block */}
           <div className={`bg-white rounded-[4px] shadow-sm border border-white overflow-hidden mt-3 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="p-6">
                <h3 className="text-[20px] font-bold mb-4 text-[#c45500]">Payment method</h3>
                
                {step === 2 ? (
                  <div className="border border-[#ddd] rounded-[8px] overflow-hidden">
                    {/* Amazon Pay Balance */}
                    <div className="p-4 border-b border-[#ddd]">
                        <h4 className="text-[15px] font-bold mb-3">Your available balance</h4>
                        <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-[4px] border border-transparent opacity-60 grayscale cursor-not-allowed">
                          <input type="radio" disabled className="mt-1" />
                          <div>
                            <p className="text-[14px] font-bold">Amazon Pay Balance ₹0.00 Unavailable</p>
                            <p className="text-[12px] text-[#b12704] flex items-center gap-1">
                               <span className="bg-[#007185] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px] font-bold">i</span>
                               Insufficient balance. <span className="text-[#007185] hover:underline">Add money & get rewarded</span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <div className="flex items-center gap-2 border border-[#888] rounded-[4px] px-2 py-1 w-[200px]">
                            <span className="text-[18px] text-[#888]">+</span>
                            <input placeholder="Enter Code" className="w-full text-[13px] outline-none border-none" />
                          </div>
                          <button className="px-5 py-1 text-[13px] bg-white border border-[#adb1b8] rounded-[8px] shadow-sm hover:bg-gray-50 font-medium">Apply</button>
                        </div>
                    </div>

                    {/* UPI */}
                    <div className="p-4 border-b border-[#ddd]">
                        <h4 className="text-[14px] font-bold mb-3 uppercase tracking-tight text-[#565959]">UPI</h4>
                        <label className={`flex items-start gap-3 p-3 rounded-[4px] cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'bg-[#fcf5ee] border border-[#e77600]' : 'hover:bg-gray-50 border border-transparent'}`}>
                          <input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mt-1 accent-[#e77600] w-4 h-4" />
                          <div>
                            <p className="text-[14px] font-bold flex items-center gap-2">Amazon Pay <span className="italic text-[12px] font-normal opacity-70">UPI</span></p>
                            <p className="text-[12px] text-[#565959] flex items-center gap-1">HDFC Bank ..1220 <img src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" className="h-2.5 mt-0.5 ml-1" alt="HDFC" /></p>
                          </div>
                        </label>
                    </div>

                    {/* COD */}
                    <div className="p-4 bg-white flex flex-col gap-1">
                        <h4 className="text-[14px] font-bold mb-3 uppercase tracking-tight text-[#565959]">Another payment method</h4>
                        <label className={`flex items-start gap-3 p-3 rounded-[4px] cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-[#fcf5ee] border border-[#e77600]' : 'hover:bg-gray-50 border border-transparent'}`}>
                          <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-[#e77600] w-4 h-4" />
                          <div>
                            <p className="text-[14px] font-bold">Cash on Delivery/Pay on Delivery</p>
                            <p className="text-[12px] text-[#565959] mt-0.5">Cash, UPI and Cards accepted. <span className="text-[#007185] hover:underline cursor-pointer">Know more.</span></p>
                          </div>
                        </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-[14px] font-bold capitalize">
                      {paymentMethod === 'upi' ? 'Amazon Pay UPI (HDFC Bank ..1220)' : 'Cash on Delivery/Pay on Delivery'}
                    </p>
                    {step > 2 && (
                       <button 
                        onClick={() => setStep(2)} 
                        className="text-[13px] text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                      >
                        Change
                      </button>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-6">
                    <button 
                      onClick={() => setStep(3)} 
                      className="px-8 py-1.5 text-[13px] font-medium border border-[#a88734] rounded-[20px] shadow-sm transform active:scale-[0.98] transition-all"
                      style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
                    >
                      Use this payment method
                    </button>
                  </div>
                )}
              </div>
           </div>

           {/* 3. Review Block */}
           <div className={`bg-white rounded-[4px] shadow-sm border border-white mt-3 overflow-hidden ${step < 3 ? 'opacity-40' : ''}`}>
              <div className="p-6">
                <h3 className="text-[20px] font-bold text-[#c45500] mb-4">Review items and shipping</h3>
                
                {step === 3 && (
                  <div className="flex flex-col gap-6">
                    <div className="border border-[#ddd] rounded-[8px] overflow-hidden">
                      <div className="bg-[#fcfcfc] px-4 py-2 border-b border-[#ddd]">
                         <span className="text-[14px] font-bold text-[#067D62]">Guaranteed delivery: 2-3 business days</span>
                      </div>
                      <div className="p-4 flex flex-col gap-5 bg-white">
                        {cartItems.map((item, idx) => (
                          <div key={item.cart_id || idx} className="flex gap-5 items-start border-b border-[#eee] last:border-none pb-5 last:pb-0">
                             <div className="w-20 h-20 bg-[#f7f7f7] p-2 flex items-center justify-center shrink-0 rounded-sm">
                                <img src={item.image || item.image_url} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={item.name} />
                             </div>
                             <div className="flex-1">
                                <p className="text-[14px] font-bold text-[#007185] hover:text-[#c45500] cursor-pointer border-none bg-transparent p-0 leading-tight mb-1 line-clamp-2">{item.name}</p>
                                <p className="text-[13px] font-bold text-[#B12704]">₹{item.price?.toLocaleString()} <span className="text-[#565959] font-normal text-[12px]">x {item.quantity}</span></p>
                                <p className="text-[12px] text-[#007600] mt-1 font-medium">✔ Prime Eligible</p>
                                <p className="text-[12px] text-[#565959] mt-1 italic">Sold by: Amazon Retail</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#fcfcfc] border border-[#ddd] rounded-[8px] p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div className="flex-1">
                          <button 
                            onClick={handlePlaceOrder} 
                            disabled={loading || cartItems.length === 0} 
                            className="px-14 py-2 text-[13px] font-bold border border-[#a88734] rounded-[20px] shadow-sm transform active:scale-[0.98] transition-all"
                            style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
                          >
                             {loading ? 'Processing...' : 'Place your order'}
                          </button>
                          <p className="text-[11px] text-[#565959] mt-3">By placing your order, you agree to Amazon's <span className="text-[#007185] hover:underline cursor-pointer">privacy notice</span> and <span className="text-[#007185] hover:underline cursor-pointer">conditions of use</span>.</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[18px] text-[#B12704] font-bold">Order Total: ₹{orderSummary.total?.toLocaleString()}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Right Sidebar - Floating Summary */}
        <aside className="w-full lg:w-[300px] flex flex-col gap-4">
           <div className="bg-white border border-[#ddd] rounded-[4px] p-5 shadow-sm sticky top-[76px]">
              <button 
                onClick={step === 3 ? handlePlaceOrder : () => {
                  if (step === 1) handleSelectAddress({ preventDefault: () => {} });
                  else setStep(step + 1);
                }}
                disabled={loading || (step === 3 && cartItems.length === 0)}
                className="w-full py-1.5 text-[13px] font-medium border border-[#a88734] rounded-[20px] shadow-sm mb-4 transform active:scale-[0.98] transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
              >
                 {step === 3 ? 'Place your order' : step === 1 ? 'Use this address' : 'Use this payment method'}
              </button>

              <div className="border-t border-[#ddd] pt-3 mt-1 text-[12px]">
                <p className="text-[#565959] mb-3">Choose a payment method or address to continue checkout.</p>
                <div className="space-y-2 text-[#333]">
                   <div className="flex justify-between"><span>Items:</span> <span className="text-[#333]">₹{orderSummary.subtotal?.toLocaleString()}</span></div>
                   <div className="flex justify-between"><span>Delivery:</span> <span className="text-[#333]">₹{orderSummary.shipping ? orderSummary.shipping.toLocaleString() : '0.00'}</span></div>
                   <div className="flex justify-between"><span>Total:</span> <span className="text-[#333]">₹{(orderSummary.subtotal + (orderSummary.shipping || 0)).toLocaleString()}</span></div>
                   
                   <div className="flex justify-between items-start pt-1 cursor-pointer group border-t border-[#eee] pt-2">
                      <span className="text-[#007185] group-hover:underline flex items-center gap-1 font-bold">
                        <ChevronDown size={14} className="mt-0.5" /> Promotion
                      </span>
                      <span className="text-[#007600] font-bold">-₹0.00</span>
                   </div>
                </div>

                <div className="flex justify-between text-[19px] font-bold text-[#b12704] border-t border-[#ddd] mt-4 pt-4">
                   <span className="text-[17px]">Order Total:</span> <span>₹{orderSummary.total?.toLocaleString()}</span>
                </div>
              </div>
           </div>
           
           <div className="p-4 border border-[#ddd] rounded-[4px] bg-[#fdfdfd] text-[11px] text-[#555] shadow-sm">
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#999] mt-0.5 shrink-0" />
                <p>Your order is safe with us. We use industry-standard encryption to protect your personal information and payment details.</p>
              </div>
           </div>
        </aside>

      </main>

      {/* Checkout Footer */}
      <footer className="max-w-[1250px] mx-auto px-4 mt-6 py-10 border-t border-[#ddd] text-center">
         <div className="flex flex-wrap justify-center gap-8 text-[11px] text-[#0066c0]">
            <Link to="#" className="hover:underline hover:text-[#c45500] no-underline">Conditions of Use</Link>
            <Link to="#" className="hover:underline hover:text-[#c45500] no-underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline hover:text-[#c45500] no-underline">Help & Support</Link>
         </div>
         <p className="text-[11px] text-[#555] mt-4 font-medium italic opacity-60">© 1996–2024, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
};

export default CheckoutPage;
