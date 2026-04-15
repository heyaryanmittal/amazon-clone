import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Info, ChevronRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      alert('Registration failed. Try a different email.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8">
      <Link to="/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[35px] mb-6" /></Link>
      
      <div className="w-[350px] border border-[#ddd] p-6 rounded-[4px] shadow-sm mb-6">
        <h1 className="text-[28px] font-normal mb-4">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold">Your name</label>
            <input 
              type="text" placeholder="First and last name" required 
              className="border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_#e77600]"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold">Mobile number</label>
            <div className="flex gap-2">
               <div className="bg-[#f0f2f2] border border-[#bbb] rounded-[3px] px-2 py-1 text-[13px]">IN +91</div>
               <input 
                type="text" placeholder="Mobile number" required 
                className="flex-1 border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600]"
                value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})}
               />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold">Email (optional)</label>
            <input 
              type="email" required 
              className="border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600]"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold">Password</label>
            <input 
              type="password" placeholder="At least 6 characters" required 
              className="border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600]"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div className="flex items-start gap-1 text-[12px] text-[#565959] mt-1">
               <Info size={14} className="text-[#0066c0] mt-0.5" />
               <span>Passwords must be at least 6 characters.</span>
            </div>
          </div>

          <div className="text-[13px] mt-4 leading-snug">
            To verify your number, we will send you a text message with a temporary code. Message and data rates may apply.
          </div>

          <button 
            type="submit" 
            className="amazon-button-yellow w-full py-1.5 rounded-[3px] text-[13px] border border-[#a88734] font-normal mt-2 hover:bg-[#f7ca00]"
            style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
          >
            Verify mobile number
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#eee] text-[13px]">
           <p className="font-bold">Buying for work?</p>
           <Link to="#" className="text-[#0066c0] hover:underline">Create a free business account</Link>
        </div>

        <div className="mt-6 pt-4 border-t border-[#eee] text-[13px]">
           <span>Already have an account? </span>
           <Link to="/login" className="text-[#0066c0] hover:underline flex items-center gap-1">Sign in <ChevronRight size={12}/></Link>
        </div>
      </div>

      <div className="mt-8 border-t border-[#eee] w-full pt-6 flex flex-col items-center gap-4 bg-gradient-to-b from-[#fafafa] to-white pb-10">
         <div className="flex gap-10 text-[11px] text-[#0066c0]">
            <Link to="#" className="hover:underline">Conditions of Use</Link>
            <Link to="#" className="hover:underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline">Help</Link>
         </div>
         <p className="text-[11px] text-[#555]">© 1996-2024, Amazon.com, Inc. or its affiliates</p>
      </div>
    </div>
  );
};

export default RegisterPage;
