import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, ChevronRight, ShieldCheck, Truck, RefreshCcw, Tag } from 'lucide-react';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(({ data }) => {
      setProduct(data.product);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    navigate('/cart');
  };

  if (loading) return <div className="animate-pulse bg-white min-h-screen"></div>;
  if (!product) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-10">
      <div className="max-w-[1500px] mx-auto px-4 py-2 border-b border-[#ddd] bg-[#f8f8f8] mb-2">
         <Link to="/products" className="text-[12px] text-[#565959] hover:text-[#c45500] flex items-center gap-1 no-underline">
           <span>‹</span> Back to results
         </Link>
      </div>
      
      {/* Breadcrumbs */}
      <div className="max-w-[1500px] mx-auto px-4 py-2 text-[12px] text-[#565959] flex items-center gap-1">
         <Link to="/" className="hover:underline">Home</Link> <ChevronRight size={10} />
         <Link to="#" className="hover:underline">Home & Kitchen</Link> <ChevronRight size={10} />
         <Link to="#" className="hover:underline">Kitchen & Dining</Link> <ChevronRight size={10} />
         <Link to="#" className="hover:underline">Drinkware</Link> <ChevronRight size={10} />
         <Link to="#" className="text-[#565959] no-underline">Mugs</Link>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-3 flex flex-col md:flex-row gap-5">
        
        {/* Left: Image Gallery (Horizontal strip layout) */}
        <div className="md:w-[42%] flex flex-col items-center">
           <div className="flex gap-4 w-full h-[550px]">
              <div className="flex flex-col gap-2 w-[50px] shrink-0">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-[45px] h-[45px] border rounded-[2px] p-1 cursor-pointer transition-all ${i===0?'border-[#e77600] shadow-[0_0_3px_#e77600]':'border-[#ddd] hover:border-[#e77600]'}`}>
                       <img src={product.image_url} className="w-full h-full object-contain" />
                    </div>
                 ))}
              </div>
              <div className="flex-1 border border-transparent flex items-center justify-center overflow-hidden">
                 <img src={product.image_url} alt={product.name} className="max-w-[95%] max-h-[90%] object-contain hover:scale-105 transition-transform duration-300" />
              </div>
           </div>
           <p className="text-[12px] text-[#565959] mt-3">Roll over image to zoom in</p>
        </div>

        {/* Center: Detailed Info */}
        <div className="md:w-[40%] flex flex-col gap-1">
           <h1 className="text-[24px] font-medium leading-tight text-[#0f1111]">{product.name}</h1>
           <Link to="#" className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline">Visit the Sooky Creative Store</Link>
           
           <div className="flex items-center gap-2 border-b border-[#eee] pb-2 mt-1">
              <span className="text-[14px] font-bold">4.8</span>
              <div className="flex text-[#ffa41c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline">128 ratings | 45 answered questions</span>
           </div>

           <div className="bg-[#232f3e] text-white text-[12px] px-2 py-1 w-fit mt-2 rounded-r-lg">
             <span className="font-bold">Amazon's </span><span className="text-[#febd69]">Choice</span> <span className="text-gray-300">for "starry sky mug"</span>
           </div>

           <div className="py-3 border-b border-[#eee]">
              <div className="flex items-baseline gap-1 text-[#cc0c39]">
                 <span className="text-[28px] font-light">-45%</span>
                 <span className="text-[14px] align-top font-light">₹</span>
                 <span className="text-[28px] font-medium">{(product.price).toLocaleString()}</span>
              </div>
              <div className="text-[14px] text-[#565959]">
                 M.R.P.: <span className="line-through">₹{(product.original_price || product.price * 1.8).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                 <div className="bg-[#cc0c39] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px]">Limited time deal</div>
              </div>
           </div>

           {/* Offers Section */}
           <div className="py-4 border-b border-[#eee]">
              <div className="flex items-center gap-2 mb-3">
                 <Tag size={18} />
                 <span className="font-bold text-[14px]">Offers</span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                 {[
                   { title: 'Bank Offer', text: 'Upto ₹1,500.00 discount on select Credit Cards' },
                   { title: 'No Cost EMI', text: 'Upto ₹47.46 EMI interest savings on Amazon Pay ICICI...' },
                   { title: 'Partner Offers', text: 'Get GST invoice and save up to 28% on business purchases' }
                 ].map((offer, i) => (
                    <div key={i} className="min-w-[150px] border border-[#ddd] p-3 rounded-[8px] shadow-sm hover:bg-gray-50 cursor-pointer">
                       <h4 className="text-[14px] font-bold mb-1">{offer.title}</h4>
                       <p className="text-[12px] line-clamp-2">{offer.text}</p>
                       <Link to="#" className="text-[12px] text-[#007185] mt-2 block font-medium">15 offers <ChevronRight size={10} className="inline"/></Link>
                    </div>
                 ))}
              </div>
           </div>

           {/* Style Selector */}
           <div className="py-4">
              <h4 className="text-[14px] font-bold mb-2">Color: <span className="font-normal">Galaxy Blue</span></h4>
              <div className="flex gap-3">
                 {[0, 1, 2].map(i => (
                    <div key={i} onClick={() => setSelectedStyle(i)} className={`w-14 h-14 border-2 p-1 rounded-sm cursor-pointer transition-all ${selectedStyle===i?'border-[#e77600] shadow-[0_0_2px_#e77600]':'border-[#ddd] hover:border-[#888]'}`}>
                       <img src={product.image_url} className="w-full h-full object-contain" />
                    </div>
                 ))}
              </div>
           </div>

           {/* Technical Specs Table */}
           <div className="py-4 border-t border-[#eee]">
              <div className="grid grid-cols-2 gap-y-2 text-[14px]">
                 <span className="font-bold">Material</span> <span>Ceramic</span>
                 <span className="font-bold">Brand</span> <span>Spooky Creative</span>
                 <span className="font-bold">Capacity</span> <span>450 Milliliters</span>
                 <span className="font-bold">Style</span> <span>Contemporary</span>
                 <span className="font-bold">Theme</span> <span>Starry Sky</span>
              </div>
           </div>

           <div className="text-[14px] pt-4">
              <h3 className="font-bold mb-2">About this item</h3>
              <ul className="list-disc pl-5 space-y-1 text-[#0f1111] leading-relaxed">
                 <li>High Quality Material: Made of 100% lead-free and non-toxic ceramic. The mug is sturdy, durable and can withstand high temperatures.</li>
                 <li>Exquisite Design: Features a creative and elegant starry sky pattern. Perfect for your home, office or as a gift for loved ones.</li>
                 <li>Inclusive Accessories: Comes with a matching ceramic lid to keep your drink warm and a premium stainless steel spoon for stirring.</li>
                 <li>Large Capacity: 450ml size is ideal for coffee, tea, hot cocoa, or any other beverage of your choice.</li>
                 <li>Easy to Clean: Smooth surface makes it incredibly easy to wash. Hand wash recommended to preserve the metallic gold patterns.</li>
              </ul>
           </div>
        </div>

        {/* Right: Buy Box */}
        <div className="md:w-[18%]">
           <div className="border border-[#ddd] rounded-[8px] p-4 flex flex-col gap-3 sticky top-24">
              <div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-[14px] align-top">₹</span>
                    <span className="text-[28px] font-medium">{(product.price).toLocaleString()}</span>
                 </div>
                 <div className="text-[14px] mt-1">
                   <span className="text-[#007600] font-medium">FREE delivery</span> <span className="font-bold">Tomorrow, 16 April.</span>
                 </div>
                 <div className="text-[14px] mt-1 text-[#007185] hover:text-[#c45500] cursor-pointer font-medium leading-tight">Lowest price in 30 days</div>
              </div>

              <div className="text-[#007600] text-[18px] font-medium mt-1">In stock</div>

              <div className="flex flex-col gap-2 mt-2">
                 <select 
                  className="w-full bg-[#f0f2f2] border border-[#d5d9d9] rounded-[7px] py-1 shadow-sm text-[13px] outline-none hover:bg-[#e7e9eb] cursor-pointer"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                 >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                 </select>

                 <button onClick={handleAddToCart} className="amazon-button-yellow w-full py-2 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm hover:bg-[#f7ca00]">
                    Add to Cart
                 </button>
                 <button onClick={() => navigate('/checkout')} className="bg-[#ffa41c] hover:bg-[#fa8900] w-full py-2 rounded-[20px] text-[13px] border border-[#c89411] font-medium shadow-sm">
                    Buy Now
                 </button>
              </div>

              <div className="text-[12px] mt-2 flex flex-col gap-1">
                 <div className="flex items-center gap-2"><Truck size={16} className="text-[#565959]"/> <span className="text-[#007185] hover:underline cursor-pointer">Amazon Delivered</span></div>
                 <div className="flex items-center gap-2"><RefreshCcw size={16} className="text-[#565959]"/> <span className="text-[#007185] hover:underline cursor-pointer">7 days Replacement</span></div>
              </div>

              <div className="border-t border-[#eee] mt-2 pt-2">
                 <button className="text-[13px] text-[#007185] hover:underline hover:text-[#c45500] w-full text-left">Add to Wish List</button>
              </div>
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
