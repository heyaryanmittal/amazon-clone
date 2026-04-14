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
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/" style={{ fontSize: 32, fontWeight: 800, color: '#131921', textDecoration: 'none' }}>
          amazon<span style={{ color: '#FF9900' }}>.in</span>
        </Link>
      </div>

      <div className="auth-card" id="login-form">
        <h1>Sign in</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Email or mobile phone number</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              id="login-email"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 8 }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
              id="login-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <p className="auth-agree">
          By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and{' '}
          <a href="#">Privacy Notice</a>.
        </p>

        <div className="auth-switch">
          New to Amazon? <Link to="/register">Create your Amazon account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
