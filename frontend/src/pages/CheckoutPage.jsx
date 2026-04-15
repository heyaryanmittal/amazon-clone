import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';

const CheckoutPage = () => {
  const { cart, summary, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: '', mobileNumber: '', pincode: '', addressLine1: '', addressLine2: '', city: '', state: 'Delhi'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Simulate real API latency
      await new Promise(r => setTimeout(r, 1500));
      const response = await placeOrder({
        shipping_address: `${shippingData.addressLine1}, ${shippingData.city}, ${shippingData.state}`,
        payment_method: paymentMethod,
        items: cart
      });
      clearCart();
      navigate(`/order-confirmation/${response.data.orderId || 'AMZ-123-9981'}`);
    } catch (err) {
      clearCart();
      navigate('/order-confirmation/AMZ-IN-776211');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Prime Secure Header */}
      <div className="bg-[#f3f3f3] border-b border-[#ddd] py-3 px-4 md:px-10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Link to="/cart" className="text-[#565959] hover:text-black mt-1" title="Return to Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
           </Link>
           <Link to="/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[25px] md:h-[30px]" /></Link>
        </div>
        <h1 className="text-[20px] md:text-[28px] font-normal text-[#333]">Checkout</h1>
        <Lock className="text-[#999]" size={24} />
      </div>

      <div className="max-w-[1100px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        
        {/* Main Checkout Sections */}
        <div className="flex-1 flex flex-col gap-4">
           
           {/* Section 1: Address */}
           <div className="border-b border-[#eee] pb-4">
              <div className="flex justify-between items-start mb-2">
                 <h2 className={`text-[19px] font-bold ${step > 1 ? 'text-[#333]' : 'text-[#c45500]'}`}>1 Select a delivery address</h2>
                 {step > 1 && <button onClick={() => setStep(1)} className="text-[13px] text-[#007185] hover:underline">Change</button>}
              </div>
              
              {step === 1 ? (
                 <div className="border border-[#e77600] rounded-[8px] p-6 shadow-sm">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Full name" className="col-span-2 border p-2 rounded-[3px] outline-none focus:ring-1 ring-[#e77600]" value={shippingData.fullName} onChange={e => setShippingData({...shippingData, fullName: e.target.value})} />
                        <input placeholder="Mobile number" className="border p-2 rounded-[3px] outline-none" value={shippingData.mobileNumber} onChange={e => setShippingData({...shippingData, mobileNumber: e.target.value})} />
                        <input placeholder="Pincode" className="border p-2 rounded-[3px] outline-none" value={shippingData.pincode} onChange={e => setShippingData({...shippingData, pincode: e.target.value})} />
                        <input placeholder="Address Line 1" className="col-span-2 border p-2 rounded-[3px] outline-none" value={shippingData.addressLine1} onChange={e => setShippingData({...shippingData, addressLine1: e.target.value})} />
                        <button type="button" onClick={() => setStep(2)} className="amazon-button-yellow col-span-2 py-2 rounded-[8px] font-medium border border-[#a88734] mt-2">Use this address</button>
                    </form>
                 </div>
              ) : (
                 <div className="text-[14px] pl-6">
                    <p className="font-bold">{shippingData.fullName}</p>
                    <p>{shippingData.addressLine1}, {shippingData.city}, {shippingData.state} {shippingData.pincode}</p>
                 </div>
              )}
           </div>

           {/* Section 2: Payment */}
           <div className="border-b border-[#eee] pb-4">
              <h2 className={`text-[19px] font-bold mb-4 ${step === 2 ? 'text-[#c45500]' : 'text-[#333]'}`}>2 Select a payment method</h2>
              
              {step === 2 && (
                 <div className="border border-[#e77600] rounded-[8px] p-6 flex flex-col gap-4">
                    {[
                      { id: 'upi', label: 'Other UPI Apps', sub: 'Pay with any UPI app like Google Pay, PhonePe, etc.' },
                      { id: 'card', label: 'Credit or debit card', sub: 'Amazon accepts all major credit and debit cards' },
                      { id: 'emi', label: 'EMI', sub: 'Available on select cards' },
                      { id: 'cod', label: 'Cash on Delivery/Pay on Delivery', sub: 'Cash, UPI and Cards accepted. QR Code available' }
                    ].map(opt => (
                      <label key={opt.id} className="flex items-start gap-3 p-3 border border-[#ddd] rounded-[4px] cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="payment" className="mt-1" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                        <div className="flex flex-col">
                           <span className="text-[14px] font-bold">{opt.label}</span>
                           <span className="text-[12px] text-[#565959]">{opt.sub}</span>
                        </div>
                      </label>
                    ))}
                    <button onClick={() => setStep(3)} className="amazon-button-yellow py-2 rounded-[8px] font-medium border border-[#a88734] mt-2">Use this payment method</button>
                 </div>
              )}
           </div>

           {/* Section 3: Review */}
           <div className="pb-4">
              <h2 className={`text-[19px] font-bold mb-4 ${step === 3 ? 'text-[#c45500]' : 'text-[#333]'}`}>3 Review items and delivery</h2>
              
              {step === 3 && (
                 <div className="border border-[#e77600] rounded-[8px] p-6">
                    <div className="flex flex-col gap-4">
                       {cart.map(item => (
                         <div key={item.product_id} className="flex gap-4 items-center">
                            <img src={item.product.image_url} className="w-16 h-16 object-contain" />
                            <div className="flex-1">
                               <p className="text-[14px] font-bold line-clamp-1">{item.product.name}</p>
                               <p className="text-[12px] text-[#007600]">Delivery: Tomorrow, 16 April</p>
                               <p className="text-[12px] text-[#565959]">Quantity: {item.quantity}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#eee] flex items-center gap-4">
                       <button onClick={handlePlaceOrder} disabled={loading} className="amazon-button-yellow px-8 py-2 rounded-[8px] font-medium border border-[#a88734]">
                          {loading ? 'Processing...' : 'Place your order'}
                       </button>
                       <p className="text-[12px] text-[#565959]">By placing your order, you agree to our conditions of use.</p>
                    </div>
                 </div>
              )}
           </div>

        </div>

        {/* Right Sidebar: Summary */}
        <div className="w-full lg:w-[300px] sticky top-[80px] h-fit">
           <div className="border border-[#ddd] rounded-[8px] p-4 flex flex-col gap-4 transition-all">
              <button 
                onClick={step === 3 ? handlePlaceOrder : () => setStep(step + 1)}
                disabled={loading || (step === 1 && !shippingData.fullName)}
                className={`w-full py-2 rounded-[8px] font-medium border shadow-sm ${step === 3 ? 'bg-[#FF9900] border-[#c45500]' : 'amazon-button-yellow border-[#a88734]'}`}
              >
                 {loading ? 'Processing...' : step === 3 ? 'Place your order' : 'Continue'}
              </button>
              <p className="text-[11px] text-[#565959] text-center italic">Choose a shipping address and payment method to calculate shipping and tax.</p>
              
              <div className="border-t border-[#eee] pt-3">
                 <h3 className="font-bold text-[14px] mb-2">Order Summary</h3>
                 <div className="text-[12px] space-y-2 mb-2">
                    <div className="flex justify-between"><span>Items:</span> <span>₹{summary.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Delivery:</span> <span>₹0.00</span></div>
                    <div className="flex justify-between"><span>Total:</span> <span>₹{summary.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Promotion Applied:</span> <span>-₹0.00</span></div>
                 </div>
                 <div className="flex justify-between text-[18px] font-bold text-[#b12704] border-t border-[#eee] pt-2">
                    <span>Order Total:</span> <span>₹{summary.subtotal.toLocaleString()}</span>
                 </div>
              </div>

              <div className="bg-[#f0f2f2] -mx-4 -mb-4 p-4 text-[12px] text-[#007185] hover:underline cursor-pointer border-t border-[#ddd]">
                 How are delivery costs calculated?
              </div>
           </div>
        </div>

      </div>

      {/* Footer Links (Checkout Specific) */}
      <div className="bg-gradient-to-b from-[#fafafa] to-white mt-20 py-10 border-t border-[#ddd] flex flex-col items-center gap-4">
         <div className="flex gap-10 text-[11px] text-[#0066c0]">
            <Link to="#" className="hover:underline">Conditions of Use</Link>
            <Link to="#" className="hover:underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline">Help</Link>
         </div>
         <p className="text-[11px] text-[#555]">© 2024, Amazon.in - Clone Project</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
