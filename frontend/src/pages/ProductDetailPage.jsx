import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, ChevronRight, ShieldCheck, Truck, RefreshCcw, Tag } from 'lucide-react';
import { getProduct, addToWishlist, removeFromWishlist, checkWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(({ data }) => {
      const fetchedProduct = data.product;
      setProduct(fetchedProduct);
      setImages(data.images || []);
      setSelectedImage(0);

      // Check if in wishlist after product id is available
      const token = localStorage.getItem('amazon_token');
      if (token && fetchedProduct) {
        checkWishlist(fetchedProduct.id).then(({ data }) => {
          setIsInWishlist(data.inWishlist);
        }).catch(() => {});
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success('Added to Cart');
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('amazon_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success('Removed from Wish List');
      } else {
        await addToWishlist(product.id);
        setIsInWishlist(true);
        toast.success('Added to Wish List');
      }
    } catch (error) {
      toast.error('Failed to update Wish List');
    }
  };

  if (loading) return (
    <div className="bg-white min-h-screen animate-pulse">
      <div className="max-w-[1500px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-[42%] h-[550px] bg-gray-100 rounded"></div>
        <div className="md:w-[40%] space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4"></div>
          <div className="h-10 bg-gray-100 rounded w-1/2"></div>
          <div className="h-40 bg-gray-100 rounded w-full"></div>
        </div>
        <div className="md:w-[18%] h-[300px] border border-gray-100 rounded p-4">
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-100 rounded-full w-full mb-2"></div>
          <div className="h-10 bg-gray-100 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
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
         <Link to="#" className="hover:underline">{product.category_name || 'Electronics'}</Link> <ChevronRight size={10} />
         <span className="text-[#565959] line-clamp-1">{product.name}</span>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-3 flex flex-col md:flex-row gap-5">
        
        {/* Left: Image Gallery */}
        <div className="md:w-[42%] flex flex-col items-center">
           <div className="flex gap-4 w-full h-[550px]">
              <div className="flex flex-col gap-2 w-[50px] shrink-0 overflow-y-auto scrollbar-hide">
                  {(images.length > 0 ? images : [product]).map((img, i) => (
                     <div 
                        key={i} 
                        onMouseEnter={() => setSelectedImage(i)} 
                        className={`w-[45px] h-[45px] border rounded-[2px] p-1 cursor-pointer transition-all ${i === selectedImage ? 'border-[#e77600] shadow-[0_0_3px_#e77600]' : 'border-[#ddd] hover:border-[#e77600]'}`}
                     >
                        <img src={img.image_url || img.imageUrl || product.image_url} className="w-full h-full object-contain" alt={`Thumbnail ${i}`} />
                     </div>
                  ))}
              </div>
              <div className="flex-1 border border-transparent flex items-center justify-center overflow-hidden bg-white">
                  <img 
                    src={images[selectedImage]?.image_url || images[selectedImage]?.imageUrl || product.image_url} 
                    alt={product.name} 
                    className="max-w-[95%] max-h-[90%] object-contain hover:scale-105 transition-transform duration-300" 
                  />
              </div>
           </div>
           <p className="text-[12px] text-[#565959] mt-3">Roll over image to zoom in</p>
        </div>

        {/* Center: Detailed Info */}
        <div className="md:w-[40%] flex flex-col gap-1">
           <h1 className="text-[24px] font-medium leading-tight text-[#0f1111]">{product.name}</h1>
           <div className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline cursor-pointer">Visit the {product.brand || 'Store'}</div>
           
           <div className="flex items-center gap-2 border-b border-[#eee] pb-2 mt-1">
              <span className="text-[14px] font-bold">{parseFloat(product.rating || 0).toFixed(1)}</span>
              <div className="flex text-[#ffa41c]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline">{product.review_count || product.reviewCount || 0} ratings</span>
           </div>

           <div className="bg-[#232f3e] text-white text-[12px] px-2 py-1 w-fit mt-2 rounded-r-lg">
             <span className="font-bold">Amazon's </span><span className="text-[#febd69]">Choice</span> <span className="text-gray-300">for "{product.category_name || 'Electronics'}"</span>
           </div>

           <div className="py-3 border-b border-[#eee]">
              <div className="flex items-baseline gap-1 text-[#cc0c39]">
                 <span className="text-[28px] font-light">
                   {product.original_price ? `-${Math.round(((product.original_price - product.price) / product.original_price) * 100)}%` : '-15%'}
                 </span>
                 <span className="text-[14px] align-top font-light">₹</span>
                 <span className="text-[28px] font-medium">{(parseFloat(product.price)).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-[14px] text-[#565959]">
                 M.R.P.: <span className="line-through">₹{(parseFloat(product.original_price || product.price * 1.2)).toLocaleString('en-IN')}</span>
              </div>
              {product.is_prime && (
                <div className="flex items-center gap-2 mt-2">
                   <div className="bg-[#cc0c39] text-white text-[12px] font-bold px-2 py-0.5 rounded-[2px]">Limited time deal</div>
                </div>
              )}
           </div>

           {/* Stats Section */}
           <div className="py-4 border-b border-[#eee] grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center text-center gap-1">
                 <RefreshCcw size={20} className="text-[#007185]" />
                 <span className="text-[12px] text-[#007185]">7 days Replacement</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                 <Truck size={20} className="text-[#007185]" />
                 <span className="text-[12px] text-[#007185]">Amazon Delivered</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                 <ShieldCheck size={20} className="text-[#007185]" />
                 <span className="text-[12px] text-[#007185]">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                 <MapPin size={20} className="text-[#007185]" />
                 <span className="text-[12px] text-[#007185]">Secure transaction</span>
              </div>
           </div>

           {/* Specifications Table */}
           {product.specifications && (
             <div className="py-4 border-b border-[#eee]">
                <h3 className="font-bold text-[14px] mb-2">Product Specifications</h3>
                <div className="grid grid-cols-2 gap-y-2 text-[14px]">
                   {Object.entries(product.specifications).map(([key, val]) => (
                     <React.Fragment key={key}>
                        <span className="font-bold">{key}</span> <span>{val}</span>
                     </React.Fragment>
                   ))}
                </div>
             </div>
           )}

           <div className="text-[14px] pt-4">
              <h3 className="font-bold mb-2">About this item</h3>
              <p className="text-[#0f1111] leading-relaxed mb-3">{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-[#0f1111] leading-relaxed">
                 <li>Premium quality from {product.brand || 'top brands'}.</li>
                 <li>Designed for durability and long-lasting performance.</li>
                 <li>Easy to use and maintain.</li>
                 <li>Authentic product with manufacturer warranty.</li>
              </ul>
           </div>
        </div>

        {/* Right: Buy Box */}
        <div className="md:w-[22%]">
           <div className="border border-[#ddd] rounded-[8px] p-4 flex flex-col gap-3 sticky top-24">
              <div>
                 <div className="flex items-baseline gap-1">
                    <span className="text-[14px] align-top">₹</span>
                    <span className="text-[28px] font-medium">{(parseFloat(product.price)).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="text-[14px] mt-1">
                   <span className="text-[#007600] font-medium">FREE delivery</span> <span className="font-bold">Tomorrow.</span>
                 </div>
                 <div className="text-[14px] mt-1 text-[#007185] hover:text-[#c45500] cursor-pointer font-medium leading-tight">Deliver to Aryan - New Delhi 110001</div>
              </div>

              <div className="text-[#007600] text-[18px] font-medium mt-1">In stock</div>

              <div className="flex flex-col gap-2 mt-2">
                 <select 
                  className="w-full bg-[#f0f2f2] border border-[#d5d9d9] rounded-[7px] py-1 shadow-sm text-[13px] outline-none hover:bg-[#e7e9eb] cursor-pointer pl-2"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                 >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                 </select>

                 <button onClick={handleAddToCart} className="amazon-button-yellow w-full py-2 rounded-[20px] text-[13px] border border-[#a88734] font-medium shadow-sm active:scale-95 transition-transform">
                    Add to Cart
                 </button>
                 <button onClick={() => navigate('/checkout')} className="bg-[#ffa41c] hover:bg-[#fa8900] w-full py-2 rounded-[20px] text-[13px] border border-[#c89411] font-medium shadow-sm active:scale-95 transition-transform">
                    Buy Now
                 </button>
              </div>

              <div className="text-[12px] mt-2 flex flex-col gap-1 text-[#565959]">
                 <div className="flex items-center gap-2">Ships from <span className="text-[#0f1111]">Amazon</span></div>
                 <div className="flex items-center gap-2">Sold by <span className="text-[#007185]">{product.brand || 'Amazon'}</span></div>
              </div>

              <div className="border-t border-[#eee] mt-2 pt-2">
                 <button 
                    onClick={handleToggleWishlist}
                    className="text-[13px] text-[#007185] hover:underline hover:text-[#c45500] w-full text-left font-medium"
                 >
                    {isInWishlist ? 'Remove from Wish List' : 'Add to Wish List'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
