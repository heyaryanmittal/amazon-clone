import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account - Amazon.in';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      loginUser(data.user, data.token);
      toast.success('Account created successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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

      <div className="w-[350px] p-[26px] bg-white border border-[#DDD] rounded-[3px] mb-6 flex flex-col z-[2]" id="register-form">
        <h1 className="text-[28px] font-normal mb-4">Create account</h1>

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Your name', type: 'text', placeholder: 'First and last name', id: 'reg-name' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter email', id: 'reg-email' },
            { key: 'phone', label: 'Mobile number (optional)', type: 'tel', placeholder: '+91 XXXXX XXXXX', id: 'reg-phone' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', id: 'reg-password' },
            { key: 'confirmPassword', label: 'Re-enter password', type: 'password', placeholder: 'Re-enter password', id: 'reg-confirm-password' },
          ].map(field => (
            <div key={field.key} className="mb-[12px]">
              <label className="block text-[13px] font-bold mb-1 pl-0.5">{field.label}</label>
              <input
                type={field.type}
                className="w-full h-[31px] px-[7px] py-[3px] text-[13px] bg-white border border-[#a6a6a6] rounded-[3px] shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_1px_0_rgba(0,0,0,0.07)_inset] outline-none transition-all duration-200 focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]"
                value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                id={field.id}
                required={field.key !== 'phone'}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-1 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] mt-2 mb-2 hover:bg-[#f4d078] cursor-pointer"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="text-[12px] leading-[1.5] mt-[18px] text-[#111]">
          By creating an account, you agree to Amazon's <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</a> and{' '}
          <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</a>.
        </p>

        <div className="mt-[22px] pt-[14px] border-t border-[#e7e7e7] text-[#767676] text-[13px] text-center">
          Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
