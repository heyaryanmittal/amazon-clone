import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { getProducts, getCategories } from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  const query = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search: query, category })
      .then(({ data }) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, category]);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Search Result Bar */}
      <div className="border-b border-[#ddd] shadow-sm py-2 px-4 flex items-center justify-between text-[14px]">
        <div>
          <span className="text-[#565959]">{products.length} results for </span>
          <span className="text-[#c45500] font-bold">"{query || category || 'All Products'}"</span>
        </div>
        <div className="flex items-center gap-2 bg-[#f0f2f2] border border-[#d5d9d9] rounded-[7px] px-2 py-1 cursor-pointer hover:bg-[#e7e9eb]">
          <span>Sort by: Featured</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="flex px-4 py-4 gap-6 max-w-[1500px] mx-auto">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-[240px] shrink-0 border-r border-[#ddd] pr-4">
          <div className="mb-6">
            <h3 className="font-bold text-[14px] mb-2">Category</h3>
            <ul className="list-none p-0 text-[14px] space-y-1">
              <li className="font-bold underline cursor-pointer">Any Category</li>
              {categories.map(cat => (
                <li key={cat.id} className="hover:text-[#c45500] cursor-pointer pl-2">
                  <Link to={`/products?category=${cat.slug}`} className="text-inherit no-underline">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-[14px] mb-2">Customer Review</h3>
            {[4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-1 text-[14px] hover:text-[#c45500] cursor-pointer mb-1">
                <div className="flex text-[#ffa41c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < stars ? "currentColor" : "none"} />
                  ))}
                </div>
                <span>& Up</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-[14px] mb-2">Price</h3>
            <ul className="list-none p-0 text-[14px] space-y-1">
              {['Under ₹500', '₹500 - ₹1,000', '₹1,000 - ₹2,000', 'Over ₹2,000'].map(p => (
                <li key={p} className="hover:text-[#c45500] cursor-pointer">{p}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <h1 className="text-[20px] font-bold mb-4">Results</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 h-[350px] rounded"></div>
              ))
            ) : products.map(product => (
              <div key={product.id} className="flex flex-col border border-[#ddd] p-3 rounded-sm group hover:border-[#c45500] transition-colors bg-white relative">
                 <Link to={`/products/${product.id}`} className="block h-[200px] mb-3 overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                    />
                 </Link>
                 <Link to={`/products/${product.id}`} className="text-[16px] font-medium text-[#0f1111] line-clamp-3 leading-snug hover:text-[#c45500] no-underline mb-1">
                    {product.name}
                 </Link>
                 <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#ffa41c]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-[12px] text-[#007185]">{product.review_count || 0}</span>
                 </div>
                 <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                       <span className="text-[13px] align-top">₹</span>
                       <span className="text-[28px] font-medium">{(product.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-[12px] text-[#565959] mb-2">
                       M.R.P: <span className="line-through">₹{(product.original_price || product.price * 1.5).toLocaleString()}</span>
                    </div>
                    {product.is_prime && (
                       <img src="https://m.media-amazon.com/images/G/31/marketing/fba/prime-logo._CB485932532_.png" alt="Prime" className="h-[15px] mb-2" />
                    )}
                    <button className="amazon-button-yellow w-full py-1.5 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00]">
                       Add to cart
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </main>      </div>
    </div>
  );
};

export default ProductsPage;
