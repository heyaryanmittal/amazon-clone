import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { getOrder } from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrder(orderId);
        setOrderData(response.data);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-[#eaeded] min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c45500]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="bg-[#eaeded] min-h-screen">
        <Navbar />
        <div className="max-w-[800px] mx-auto p-4 py-10 text-center">
           <h1 className="text-[28px] font-bold mb-4">Order Not Found</h1>
           <p className="mb-6">We couldn't locate details for order <span className="font-bold">{orderId}</span>.</p>
           <Link to="/" className="amazon-button-yellow px-6 py-2 rounded-[8px] no-underline text-black font-medium border border-[#a88734]">Return to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { order, items } = orderData;

  return (
    <div className="bg-[#eaeded] min-h-screen">
      <div className="max-w-[1000px] mx-auto p-4 py-10">
         <div className="bg-white p-8 rounded-sm shadow-sm border-t-[4px] border-[#067D62]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#eee] pb-6 mb-6">
               <CheckCircle size={60} className="text-[#067D62]" />
               <div className="text-center md:text-left">
                  <h1 className="text-[24px] font-bold text-[#067D62] mb-1">Order placed, thank you!</h1>
                  <p className="text-[14px] text-[#565959]">
                    Confirmation will be sent to your email.
                  </p>
                  <p className="text-[14px]">
                    <strong>Order Number:</strong> {order.orderId}
                  </p>
               </div>
               <div className="ml-auto flex flex-col gap-2 w-full md:w-auto">
                  <Link to="/orders" className="amazon-button-yellow w-full text-center px-6 py-2 rounded-[8px] border border-[#a88734] no-underline text-black text-[13px] font-medium">Review your orders</Link>
                  <Link to="/" className="bg-[#f0f2f2] w-full text-center px-6 py-2 rounded-[8px] border border-[#d5d9d9] no-underline text-black text-[13px] font-medium hover:bg-[#e7e9eb]">Continue shopping</Link>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Shipping & Payment Info */}
               <div>
                 <h2 className="text-[18px] font-bold mb-3">Shipping Details</h2>
                 <div className="text-[14px] text-[#333] mb-6 border p-4 rounded-[4px] bg-[#fdfdfd]">
                    <p className="font-bold">{order.shippingName}</p>
                    <p>{order.shippingAddressLine1}</p>
                    {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                    <p>{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
                    <p>Phone: {order.shippingPhone}</p>
                 </div>

                 <h2 className="text-[18px] font-bold mb-3">Payment Method</h2>
                 <div className="text-[14px] text-[#333] border p-4 rounded-[4px] bg-[#fdfdfd]">
                    <p className="uppercase font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                 </div>
               </div>

               {/* Order Summary & Items */}
               <div>
                  <h2 className="text-[18px] font-bold mb-3">Order Summary</h2>
                  <div className="border border-[#ddd] rounded-[4px] p-4 bg-[#fdfdfd]">
                     <div className="text-[13px] space-y-2 mb-3 pb-3 border-b border-[#eee]">
                        <div className="flex justify-between"><span>Item(s) Subtotal:</span> <span>₹{parseFloat(order.subtotal).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Shipping:</span> <span>₹{parseFloat(order.shippingAmount).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Tax (18% GST Estimated):</span> <span>₹{parseFloat(order.taxAmount).toLocaleString()}</span></div>
                     </div>
                     <div className="flex justify-between text-[16px] font-bold text-[#b12704]">
                        <span>Grand Total:</span> <span>₹{parseFloat(order.totalAmount).toLocaleString()}</span>
                     </div>
                  </div>

                  <h2 className="text-[18px] font-bold mt-6 mb-3 flex items-center gap-2"><Package size={20} /> Items Purchased</h2>
                  <div className="flex flex-col gap-3">
                     {items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center border border-[#eee] p-2 rounded-[4px]">
                           <img src={item.productImage || 'https://placehold.co/100'} className="w-12 h-12 object-contain" />
                           <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-[#007185] font-medium line-clamp-1 hover:underline cursor-pointer">{item.productName}</p>
                              <p className="text-[12px] text-[#555]">Qty: {item.quantity}</p>
                           </div>
                           <span className="text-[14px] font-bold text-black">₹{parseFloat(item.price).toLocaleString()}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
