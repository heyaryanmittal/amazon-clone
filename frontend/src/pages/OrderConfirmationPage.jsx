import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div className="bg-[#eaeded] min-h-screen">
      <Navbar />
      <div className="max-w-[1500px] mx-auto p-4 py-10">
         <div className="bg-white p-10 rounded-sm shadow-sm flex flex-col items-center text-center">
            <CheckCircle size={80} className="text-[#067D62] mb-6" />
            <h1 className="text-[28px] font-bold text-[#067D62] mb-2">Order placed, thank you!</h1>
            <p className="text-[14px] text-[#565959] mb-6">
              Confirmation will be sent to your email. Order #<span className="font-bold">{orderId}</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
               <Link to="/orders" className="amazon-button-yellow px-8 py-2 rounded-[8px] border border-[#a88734] no-underline text-black text-[13px] font-medium">Review your orders</Link>
               <Link to="/" className="bg-[#f0f2f2] px-8 py-2 rounded-[8px] border border-[#d5d9d9] no-underline text-black text-[13px] font-medium hover:bg-[#e7e9eb]">Continue shopping</Link>
            </div>
         </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
