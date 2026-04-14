import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, Shield, Truck, RotateCcw, Star, ChevronRight } from 'lucide-react';
import { getProduct, addToWishlist, removeFromWishlist, checkWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { StarRating, formatPrice, getDiscount } from '../components/ProductCard';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(id);
        setProduct(data.product);
        setImages(data.images || []);
        setRelated(data.related || []);
        document.title = `${data.product.name} - Amazon.in`;

        // Check wishlist
        try {
          const { data: wData } = await checkWishlist(id);
          setInWishlist(wData.inWishlist);
        } catch {}
      } catch (err) {
        console.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    setAddingCart(true);
    await addToCart(product.id, quantity);
    setAddingCart(false);
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product.id, quantity);
    if (success) navigate('/checkout');
  };

  const handleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
        toast.success('Added to wishlist! ❤️');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner" style={{ minHeight: 400 }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="section">
          <div className="empty-state">
            <span className="empty-state-icon">😕</span>
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.original_price);
  const allImages = images.length > 0 ? images.map(i => i.image_url) : [
    `https://via.placeholder.com/600x600/f7f7f7/aaaaaa?text=${encodeURIComponent(product.brand || 'Product')}`
  ];
  const isOutOfStock = product.stock === 0;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to={`/products?category=${product.category_slug}`}>
          {product.category_name}
        </Link>
        <span className="breadcrumb-separator">›</span>
        <span style={{ color: '#565959' }}>{product.name.substring(0, 60)}{product.name.length > 60 ? '...' : ''}</span>
      </div>

      <div className="bg-white p-4 mb-4" id="product-detail">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_300px] gap-8 py-4">

          {/* Images Section */}
          <div className="flex gap-4 md:sticky md:top-[80px] self-start flex-col-reverse md:flex-row">
            <div className="flex md:flex-col gap-2">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 border border-[#a6a6a6] rounded-sm p-1 cursor-pointer hover:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] hover:border-[#e77600] ${selectedImage === i ? 'border-[#e77600] shadow-[0_0_3px_2px_rgba(228,121,17,0.5)]' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = `https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=${i + 1}`; }}
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 aspect-square md:aspect-auto md:h-[500px] bg-[#f7f7f7] border border-[#f7f7f7] rounded-sm flex justify-center items-center overflow-hidden">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                className="max-w-[90%] max-h-[90%] object-contain"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/600x600/f7f7f7/aaaaaa?text=${encodeURIComponent(product.brand || 'Product')}`;
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="text-[14px]">
              Brand: <Link to={`/products?search=${product.brand}`} className="text-[#007185] hover:text-[#C45500] hover:underline">{product.brand}</Link>
            </p>
            <h1 className="text-[24px] font-normal leading-[1.3] text-[#0F1111] m-0 mb-1.5">{product.name}</h1>

            <div className="flex items-center gap-4 text-[14px] border-b border-[#ececec] pb-2 mb-3">
              <StarRating rating={parseFloat(product.rating) || 4.0} size={20} />
              <a href="#reviews" className="text-[#007185] hover:text-[#C45500] hover:underline">
                {parseFloat(product.rating).toFixed(1)} out of 5
              </a>
              <span style={{ color: '#565959' }}>|</span>
              <a href="#reviews" className="text-[#007185] hover:text-[#C45500] hover:underline">
                {(product.review_count || 0).toLocaleString('en-IN')} ratings
              </a>
            </div>

            {product.is_prime && (
              <div className="inline-flex items-center gap-[3px] text-[14px] font-semibold text-[#00A8E0] mb-2">
                <span className="italic font-extrabold text-[#00A8E0] text-[16px]">prime</span>
                <span className="text-[#111] font-normal ml-1">Free delivery on eligible orders</span>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-col gap-1 border-b border-[#ececec] pb-4 mb-4">
              <div className="text-[#565959] text-[14px]">Price:</div>
              <div className="text-[28px] text-[#b12704] font-normal flex items-start leading-[1]">
                <span className="text-[14px] align-super mr-0.5 mt-1">₹</span>
                {parseInt(product.price).toLocaleString('en-IN')}
              </div>
              {product.original_price > product.price && (
                <div className="text-[#565959] text-[12px]">
                  M.R.P.: <strike>₹{parseInt(product.original_price).toLocaleString('en-IN')}</strike>
                </div>
              )}
              {discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[#CC0C39] text-[18px] font-normal">({discount}% off)</span>
                  <span style={{ color: '#CC0C39', fontSize: 14 }}>
                    Limited time deal
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-b border-[#ececec] pb-4 mb-4 text-[14px] leading-[1.5] text-[#0F1111]">
              <p>{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-4" id="product-specs">
                <h3 className="text-[16px] font-bold text-[#0F1111] mb-2">Technical Details</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="py-1.5 px-2 text-[14px] align-top bg-[#f3f3f3] text-[#0F1111] font-bold w-[40%] border border-[#e7e7e7]">{key}</td>
                        <td className="py-1.5 px-2 text-[14px] align-top text-[#333] border border-[#e7e7e7]">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="border border-[#d5d9d9] rounded-lg p-4 bg-white flex flex-col md:sticky md:top-[80px] self-start" id="buy-box">
            <div className="text-[24px] font-normal text-[#111] mb-2">
              <span className="text-[14px] align-super mr-0.5 mt-1">₹</span>
              {parseInt(product.price).toLocaleString('en-IN')}
            </div>

            {product.is_prime && (
              <div className="text-[#00A8E0] font-bold flex items-center gap-1 mb-2 text-[14px]">
                <span className="italic font-extrabold text-[#00A8E0] text-[16px]">prime</span>
                <span className="text-[#111] font-normal ml-1">FREE Delivery</span>
              </div>
            )}

            <div className="text-[14px] leading-[1.4] text-[#111] mb-3" style={{ marginBottom: 12 }}>
              {product.is_prime ? (
                <span>FREE delivery <strong>tomorrow</strong> if ordered in next 6 hours</span>
              ) : (
                <span>Delivery: <strong>3-5 business days</strong></span>
              )}
            </div>

            <div className={`text-[18px] mb-3 ${isOutOfStock ? 'text-[#CC0C39]' : 'text-[#007600]'}`}>
              {isOutOfStock ? '❌ Out of Stock' : `✅ In Stock (${product.stock} left)`}
            </div>

            {!isOutOfStock && (
              <>
                <div className="flex items-center gap-2 mb-4 bg-[#F0F2F2] border border-[#d5d9d9] rounded px-2 w-max shadow-[0_2px_5px_rgba(15,17,17,0.15)]">
                  <span className="text-[13px]">Quantity:</span>
                  <button
                    className="bg-transparent border-none cursor-pointer w-6 h-6 flex justify-center items-center text-[16px] hover:bg-[#e3e6e6]"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    id="qty-decrease"
                  >−</button>
                  <span className="w-6 text-center font-bold bg-white text-[13px] py-1 shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset]">{quantity}</span>
                  <button
                    className="bg-transparent border-none cursor-pointer w-6 h-6 flex justify-center items-center text-[16px] hover:bg-[#e3e6e6]"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    id="qty-increase"
                  >+</button>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  <button
                    className="w-full bg-[#f0c14b] text-[#111] border border-[#a88734] border-t-[#c89411] border-b-[#846a29] rounded-[3px] py-1 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] hover:bg-[#f4d078] cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    id="add-to-cart-btn"
                  >
                    {addingCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className="w-full bg-[#FFA41C] text-[#111] border border-[#c87900] border-t-[#e28800] border-b-[#a66400] rounded-[3px] py-1 px-3 text-[13px] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] hover:bg-[#ffb03a] cursor-pointer"
                    onClick={handleBuyNow}
                    id="buy-now-btn"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}

            <div style={{ borderTop: '1px solid #DDD', paddingTop: 12, marginTop: 4 }}>
              <button
                onClick={handleWishlist}
                style={{
                  background: 'none',
                  border: 'none',
                  color: inWishlist ? '#CC0C39' : '#007185',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 0',
                }}
                id="wishlist-toggle-btn"
              >
                <Heart size={16} fill={inWishlist ? '#CC0C39' : 'none'} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wish List'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[#007185] text-[14px] mt-3 hover:text-[#C45500] hover:underline cursor-pointer">
              <Shield size={14} /> Secure transaction
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: '#565959' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Ships from</span> <strong>Amazon.in</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Sold by</span> <strong>{product.brand || 'Amazon.in'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Returns</span> <span style={{ color: '#007185' }}>Eligible for Return</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="bg-white mb-2 p-6 rounded-[3px]" id="related-products">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-[#131921]">Customers also viewed</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
