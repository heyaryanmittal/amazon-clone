import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, Truck} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      {/* Back to top */}
      <div className="footer-top" onClick={scrollToTop} id="footer-back-to-top">
        Back to top
      </div>

      {/* Links */}
      <div className="footer-links">
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <ul>
            <li><a href="#">About Amazon</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press Releases</a></li>
            <li><a href="#">Amazon Cares</a></li>
            <li><a href="#">Gift a Smile</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Instagram</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="#">Sell on Amazon</a></li>
            <li><a href="#">Sell under Amazon Accelerator</a></li>
            <li><a href="#">Amazon Associates</a></li>
            <li><a href="#">Advertise Your Products</a></li>
            <li><a href="#">Amazon Pay on Merchants</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <ul>
            <li><a href="#">COVID-19 and Amazon</a></li>
            <li><Link to="/orders">Your Orders</Link></li>
            <li><a href="#">Shipping Rates & Policies</a></li>
            <li><a href="#">Amazon Prime</a></li>
            <li><a href="#">Returns & Replacements</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom */}
      <div className="footer-bottom">
        <Link to="/" className="footer-logo">amazon</Link>

        <div className="footer-bottom-links">
          <a href="#">Australia</a>
          <a href="#">Brazil</a>
          <a href="#">Canada</a>
          <a href="#">China</a>
          <a href="#">France</a>
          <a href="#">Germany</a>
          <a href="#">Italy</a>
          <a href="#">Japan</a>
          <a href="#">Mexico</a>
          <a href="#">Netherlands</a>
          <a href="#">Singapore</a>
          <a href="#">Spain</a>
          <a href="#">Turkey</a>
          <a href="#">United Arab Emirates</a>
          <a href="#">United Kingdom</a>
          <a href="#">United States</a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ccc' }}>
            <Globe size={16} />
            <span>English</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ccc' }}>
            <span>₹ - INR - Indian Rupee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#ccc' }}>
            <Shield size={16} />
            <span>India</span>
          </div>
        </div>

        <p className="footer-copyright" style={{ marginTop: 16 }}>
          © 1996-2024, Amazon.com, Inc. or its affiliates | Amazon Clone by Aryan Mittal
        </p>

        <div className="footer-bottom-links" style={{ marginTop: 12 }}>
          <a href="#">Conditions of Use & Sale</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Interest-Based Ads</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
