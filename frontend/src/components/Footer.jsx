import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#232f3e] text-white">
      {/* Back to Top */}
      <div 
        onClick={scrollToTop}
        className="bg-[#37475a] hover:bg-[#485769] text-center py-3 text-[13px] cursor-pointer transition-colors"
      >
        Back to Top
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1000px] mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-[16px] mb-3">Get to Know Us</h3>
          <ul className="list-none p-0 text-[14px] flex flex-col gap-2">
            <li><Link to="#" className="text-white no-underline hover:underline">About Us</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Careers</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Press Releases</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Amazon Science</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[16px] mb-3">Connect with Us</h3>
          <ul className="list-none p-0 text-[14px] flex flex-col gap-2">
            <li><Link to="#" className="text-white no-underline hover:underline">Facebook</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Twitter</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Instagram</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[16px] mb-3">Make Money with Us</h3>
          <ul className="list-none p-0 text-[14px] flex flex-col gap-2">
            <li><Link to="#" className="text-white no-underline hover:underline">Sell on Amazon</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Sell under Amazon Accelerator</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Protect and Build Your Brand</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Amazon Global Selling</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Become an Affiliate</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Fulfilment by Amazon</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-[16px] mb-3">Let Us Help You</h3>
          <ul className="list-none p-0 text-[14px] flex flex-col gap-2">
            <li><Link to="#" className="text-white no-underline hover:underline">COVID-19 and Amazon</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Your Account</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Returns Centre</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">100% Purchase Protection</Link></li>
            <li><Link to="#" className="text-white no-underline hover:underline">Help</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="border-t border-[#3a4553] py-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-10">
          <Link to="/"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[25px] filter invert hue-rotate-180" /></Link>
          <div className="flex border border-gray-500 rounded-[3px] px-3 py-1.5 text-[13px] items-center gap-2 cursor-pointer hover:border-gray-200">
             <Globe size={14} /> English
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[12px] max-w-[1000px] text-center px-4">
           {['Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Poland', 'Singapore', 'Spain', 'Turkey', 'United Arab Emirates', 'United Kingdom', 'United States'].map(country => (
             <Link key={country} to="#" className="text-white no-underline hover:underline whitespace-nowrap">{country}</Link>
           ))}
        </div>
      </div>

      {/* Legal Bar */}
      <div className="bg-[#131a22] py-8 text-[12px] flex flex-col items-center gap-2">
         <div className="flex gap-4">
            <Link to="#" className="text-white no-underline hover:underline">Conditions of Use & Sale</Link>
            <Link to="#" className="text-white no-underline hover:underline">Privacy Notice</Link>
            <Link to="#" className="text-white no-underline hover:underline">Interest-Based Ads</Link>
         </div>
         <p className="text-gray-400">© 1996-2024, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
};

export default Footer;
