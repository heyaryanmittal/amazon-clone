import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Page Not Found - Amazon.in';
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto px-4">
      <div className="text-center py-16 px-6">
        <div className="text-[80px] mb-6">🔍</div>
        <h1 className="text-[32px] text-[#CC0C39] mb-4 font-bold">
          Oops! Page not found
        </h1>
        <p className="text-[18px] text-[#565959] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="bg-[#FFD814] text-[#0f1111] border border-[#FCD200] rounded-full py-2 px-6 font-semibold cursor-pointer transition-colors hover:bg-[#F7CA00] no-underline">Go to Homepage</Link>
          <Link to="/products" className="bg-white text-[#0f1111] border border-[#d5d9d9] rounded-full py-2 px-6 font-semibold cursor-pointer transition-colors hover:bg-[#F7FAFA] shadow-[0_1px_2px_rgba(15,17,17,0.05)] no-underline">Browse Products</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
