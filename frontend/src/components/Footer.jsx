import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, Truck} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#232f3e] text-white mt-auto">
      {/* Back to top */}
      <div className="bg-[#37475a] text-center py-4 cursor-pointer text-[13px] font-semibold hover:bg-[#485769] transition-colors duration-150" onClick={scrollToTop} id="footer-back-to-top">
        Back to top
      </div>

      {/* Links */}
      <div className="max-w-[1000px] mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col">
          <h4 className="font-bold text-[16px] mb-3.5">Get to Know Us</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">About Amazon</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Careers</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Press Releases</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Amazon Cares</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Gift a Smile</a></li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-[16px] mb-3.5">Connect with Us</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Facebook</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Twitter</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Instagram</a></li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-[16px] mb-3.5">Make Money with Us</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Sell on Amazon</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Sell under Amazon Accelerator</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Amazon Associates</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Advertise Your Products</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Amazon Pay on Merchants</a></li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-[16px] mb-3.5">Let Us Help You</h4>
          <ul className="flex flex-col gap-2.5">
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">COVID-19 and Amazon</a></li>
            <li><Link to="/orders" className="text-[#ccc] text-[13px] hover:underline">Your Orders</Link></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Shipping Rates & Policies</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Amazon Prime</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Returns & Replacements</a></li>
            <li><a href="#" className="text-[#ccc] text-[13px] hover:underline">Help</a></li>
          </ul>
        </div>
      </div>

      <hr className="border-t border-[#3a4553]" />

      {/* Bottom */}
      <div className="bg-[#131921] py-8 px-4 flex flex-col items-center text-center">
        <Link to="/" className="text-3xl font-extrabold text-white tracking-tighter no-underline mb-6">amazon</Link>

        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[#ccc]">
          <a href="#" className="text-[#ccc] hover:underline">Australia</a>
          <a href="#" className="text-[#ccc] hover:underline">Brazil</a>
          <a href="#" className="text-[#ccc] hover:underline">Canada</a>
          <a href="#" className="text-[#ccc] hover:underline">China</a>
          <a href="#" className="text-[#ccc] hover:underline">France</a>
          <a href="#" className="text-[#ccc] hover:underline">Germany</a>
          <a href="#" className="text-[#ccc] hover:underline">Italy</a>
          <a href="#" className="text-[#ccc] hover:underline">Japan</a>
          <a href="#" className="text-[#ccc] hover:underline">Mexico</a>
          <a href="#" className="text-[#ccc] hover:underline">Netherlands</a>
          <a href="#" className="text-[#ccc] hover:underline">Singapore</a>
          <a href="#" className="text-[#ccc] hover:underline">Spain</a>
          <a href="#" className="text-[#ccc] hover:underline">Turkey</a>
          <a href="#" className="text-[#ccc] hover:underline">United Arab Emirates</a>
          <a href="#" className="text-[#ccc] hover:underline">United Kingdom</a>
          <a href="#" className="text-[#ccc] hover:underline">United States</a>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5 text-[13px] text-[#ccc]">
            <Globe size={16} />
            <span>English</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#ccc]">
            <span>₹ - INR - Indian Rupee</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-[#ccc]">
            <Shield size={16} />
            <span>India</span>
          </div>
        </div>

        <p className="text-[11px] text-[#ccc] mt-4">
          © 1996-2024, Amazon.com, Inc. or its affiliates | Amazon Clone by Aryan Mittal
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[#ccc] mt-3">
          <a href="#" className="text-[#ccc] hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="text-[#ccc] hover:underline">Privacy Notice</a>
          <a href="#" className="text-[#ccc] hover:underline">Interest-Based Ads</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
