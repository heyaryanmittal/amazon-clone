import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, RotateCcw, Shield, Headphones } from 'lucide-react';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_SLIDES = [
  {
    bg: 'linear-gradient(135deg, #131921 0%, #1a2a3c 100%)',
    tag: '🔥 Deal of the Day',
    title: 'MacBook Air M3',
    subtitle: 'Up to ₹15,000 off. Limited time offer.',
    btn: 'Shop Now',
    link: '/products?category=electronics',
    accent: '#FF9900',
    emoji: '💻'
  },
  {
    bg: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
    tag: '⚡ Lightning Deal',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Save ₹25,000. While stocks last!',
    btn: 'Grab Now',
    link: '/products?category=electronics',
    accent: '#00A8E0',
    emoji: '📱'
  },
  {
    bg: 'linear-gradient(135deg, #1e3a2f 0%, #0d2416 100%)',
    tag: '📚 Bestsellers',
    title: 'Top Books of 2024',
    subtitle: 'Up to 60% off on bestselling titles',
    btn: 'Browse Books',
    link: '/products?category=books',
    accent: '#4CAF50',
    emoji: '📖'
  },
  {
    bg: 'linear-gradient(135deg, #3d1a6e 0%, #1a0a3d 100%)',
    tag: '🎮 Gaming Week',
    title: 'Toys & Games Sale',
    subtitle: 'Free delivery on orders above ₹499',
    btn: 'Shop Games',
    link: '/products?category=toys-games',
    accent: '#9c27b0',
    emoji: '🎯'
  }
];

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: 'Fashion', slug: 'fashion', icon: '👗' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
  { name: 'Sports & Fitness', slug: 'sports-fitness', icon: '⚽' },
  { name: 'Toys & Games', slug: 'toys-games', icon: '🎮' },
  { name: 'Beauty & Health', slug: 'beauty-health', icon: '💄' },
  { name: 'Automotive', slug: 'automotive', icon: '🚗' },
  { name: 'Grocery', slug: 'grocery', icon: '🛒' },
  { name: 'Office Products', slug: 'office-products', icon: '💼' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.title = 'Amazon.in: Online Shopping India | Amazon Clone';
    const loadData = async () => {
      try {
        const { data } = await getFeaturedProducts();
        setFeatured(data.products || []);
      } catch (err) {
        console.error('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div>
      {/* Hero Banner */}
      <section
        className="hero-section"
        style={{ background: slide.bg, transition: 'background 0.6s ease' }}
        id="hero-banner"
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            padding: '60px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            minHeight: 360,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: slide.accent,
              color: slide.accent === '#FF9900' ? '#333' : 'white',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16,
            }}>
              {slide.tag}
            </div>
            <h1 style={{
              fontSize: 48,
              fontWeight: 800,
              color: 'white',
              marginBottom: 16,
              lineHeight: 1.1,
            }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 20, color: '#ccc', marginBottom: 32 }}>
              {slide.subtitle}
            </p>
            <Link
              to={slide.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: slide.accent === '#FF9900' ? '#FF9900' : slide.accent,
                color: slide.accent === '#FF9900' ? '#333' : 'white',
                padding: '12px 28px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {slide.btn} <ArrowRight size={18} />
            </Link>
          </div>
          <div style={{
            fontSize: 180,
            lineHeight: 1,
            opacity: 0.9,
            animation: 'float 3s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
          }}>
            {slide.emoji}
          </div>
        </div>

        {/* Slide Controls */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: i === currentSlide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentSlide ? '#FF9900' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50,
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
          style={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 50,
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Value Propositions */}
      <div style={{
        background: '#FF9900',
        padding: '12px 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 48,
          flexWrap: 'wrap',
        }}>
          {[
            { icon: <Truck size={18} />, text: 'FREE Delivery on orders ₹499+' },
            { icon: <RotateCcw size={18} />, text: '15-Day Easy Returns' },
            { icon: <Shield size={18} />, text: 'Secure Payments' },
            { icon: <Headphones size={18} />, text: '24x7 Customer Support' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#333', fontWeight: 600, fontSize: 13,
            }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container" style={{ paddingTop: 16 }}>
        <div className="section" id="categories-section">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className="category-banner-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="category-card"
                id={`category-${cat.slug}`}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        {loading ? (
          <div className="section">
            <div className="loading-spinner"><div className="spinner"></div></div>
          </div>
        ) : featured.length > 0 ? (
          <div className="section" id="featured-products">
            <div className="section-header">
              <h2 className="section-title">⚡ Today's Deals</h2>
              <Link to="/products?featured=true" className="see-more-link">
                See all deals <ArrowRight size={14} style={{ display: 'inline' }} />
              </Link>
            </div>
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {featured.slice(0, 10).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">⚡ Today's Deals</h2>
            </div>
            <div style={{ textAlign: 'center', padding: 48, color: '#767676' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
              <p>Connect to the backend to see featured products!</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>Make sure MySQL is running and the database is seeded.</p>
            </div>
          </div>
        )}

        {/* Deal Banners */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
          {[
            { bg: '#1a2a3c', emoji: '🎧', title: 'Electronics', sub: 'Up to 70% off', link: '/products?category=electronics', color: '#00A8E0' },
            { bg: '#1e3a2f', emoji: '📚', title: 'Books & Education', sub: 'Start from ₹199', link: '/products?category=books', color: '#4CAF50' },
            { bg: '#3c1f1f', emoji: '👟', title: 'Fashion & Lifestyle', sub: 'Top brands on sale', link: '/products?category=fashion', color: '#FF5722' },
            { bg: '#1f1f3c', emoji: '🏠', title: 'Home Essentials', sub: 'Premium at best prices', link: '/products?category=home-kitchen', color: '#9c27b0' },
          ].map((banner, i) => (
            <Link
              key={i}
              to={banner.link}
              style={{
                display: 'block',
                background: banner.bg,
                borderRadius: 8,
                padding: '24px 20px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{banner.emoji}</div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{banner.title}</div>
              <div style={{ color: banner.color, fontSize: 14, fontWeight: 600 }}>{banner.sub}</div>
              <div style={{ color: '#aaa', fontSize: 12, marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                Shop now <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
