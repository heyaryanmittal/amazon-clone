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
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/" style={{ fontSize: 32, fontWeight: 800, color: '#131921', textDecoration: 'none' }}>
          amazon<span style={{ color: '#FF9900' }}>.in</span>
        </Link>
      </div>

      <div className="auth-card" id="register-form">
        <h1>Create account</h1>

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Your name', type: 'text', placeholder: 'First and last name', id: 'reg-name' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'Enter email', id: 'reg-email' },
            { key: 'phone', label: 'Mobile number (optional)', type: 'tel', placeholder: '+91 XXXXX XXXXX', id: 'reg-phone' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters', id: 'reg-password' },
            { key: 'confirmPassword', label: 'Re-enter password', type: 'password', placeholder: 'Re-enter password', id: 'reg-confirm-password' },
          ].map(field => (
            <div key={field.key} className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                className="form-input"
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
            className="auth-submit"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className="auth-agree">
          By creating an account, you agree to Amazon's <a href="#">Conditions of Use</a> and{' '}
          <a href="#">Privacy Notice</a>.
        </p>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
