import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center pt-8">
      <Link to="/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[35px] mb-6" /></Link>
      
      <div className="w-[350px] border border-[#ddd] p-6 rounded-[4px] shadow-sm mb-6">
        <h1 className="text-[28px] font-normal mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold">Email or mobile phone number</label>
            <input 
              type="text" 
              required 
              className="border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_#e77600]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-bold">Password</label>
              <Link to="#" className="text-[12px] text-[#0066c0] hover:text-[#c45500] hover:underline">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              required 
              className="border border-[#bbb] rounded-[3px] py-1 px-2 outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_#e77600]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="amazon-button-yellow w-full py-1.5 rounded-[3px] text-[13px] border border-[#a88734] font-normal mt-2 hover:bg-[#f7ca00]"
            style={{ background: 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' }}
          >
            Sign in
          </button>
        </form>

        <p className="text-[12px] mt-4 leading-snug">
          By continuing, you agree to Amazon's <Link to="#" className="text-[#0066c0] hover:underline">Conditions of Use</Link> and <Link to="#" className="text-[#0066c0] hover:underline">Privacy Notice</Link>.
        </p>

        <div className="mt-6 border-t border-[#eee] pt-4">
           <Link to="#" className="text-[13px] text-[#0066c0] hover:underline flex items-center gap-1"><ChevronRight size={12}/> Need help?</Link>
        </div>
      </div>

      <div className="w-[350px] flex items-center gap-2 mb-4 justify-center">
         <div className="h-[1px] bg-[#eee] flex-1"></div>
         <span className="text-[12px] text-[#767676]">New to Amazon?</span>
         <div className="h-[1px] bg-[#eee] flex-1"></div>
      </div>

      <Link 
        to="/register" 
        className="w-[350px] text-center border border-[#adb1b8] bg-[#eff1f3] hover:bg-[#e7e9ec] py-1 rounded-[3px] text-[13px] shadow-sm no-underline text-black"
      >
        Create your Amazon account
      </Link>

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

export default LoginPage;
