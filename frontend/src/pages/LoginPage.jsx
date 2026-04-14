import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign In - Amazon.in';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-140px)] py-4">
      <div className="mb-4 pb-2 z-[2]">
        <Link to="/" style={{ fontSize: 32, fontWeight: 800, color: '#131921', textDecoration: 'none' }}>
          amazon<span style={{ color: '#FF9900' }}>.in</span>
        </Link>
      </div>

      <div className="w-[350px] p-[26px] bg-white border border-[#DDD] rounded-[3px] mb-6 flex flex-col z-[2]" id="login-form">
        <h1 className="text-[28px] font-normal mb-4">Sign in</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-[12px]">
            <label className="block text-[13px] font-bold mb-1 pl-0.5">Email or mobile phone number</label>
            <input
              type="email"
              className="w-full h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              id="login-email"
              required
            />
          </div>

          <div className="mb-[8px]">
            <label className="block text-[13px] font-bold mb-1 pl-0.5">Password</label>
            <input
              type="password"
              className="w-full h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
              value={form.password}
              onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
              id="login-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-1 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] mt-2 mb-2 hover:bg-[#f4d078] cursor-pointer"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className="text-[12px] leading-[1.5] mt-[18px] text-[#111]">
          By continuing, you agree to Amazon's <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</a> and{' '}
          <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</a>.
        </p>

        <div className="mt-[22px] pt-[14px] border-t border-[#e7e7e7] text-[#767676] text-[13px] text-center">
          New to Amazon? <Link to="/register" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Create your Amazon account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
