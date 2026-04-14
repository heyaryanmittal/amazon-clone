import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Page Not Found - Amazon.in';
  }, []);

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🔍</div>
        <h1 style={{ fontSize: 32, color: '#CC0C39', marginBottom: 16 }}>
          Oops! Page not found
        </h1>
        <p style={{ fontSize: 18, color: '#565959', marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary">Go to Homepage</Link>
          <Link to="/products" className="btn-secondary">Browse Products</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
