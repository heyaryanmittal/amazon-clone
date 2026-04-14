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

      <div className="product-detail" id="product-detail">
        <div className="product-detail-grid">

          {/* Images Section */}
          <div className="product-images">
            <div className="image-thumbnails">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    onError={(e) => { e.target.src = `https://via.placeholder.com/60x60/f7f7f7/aaaaaa?text=${i + 1}`; }}
                  />
                </div>
              ))}
            </div>
            <div className="main-image">
              <img
                src={allImages[selectedImage]}
                alt={product.name}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/600x600/f7f7f7/aaaaaa?text=${encodeURIComponent(product.brand || 'Product')}`;
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <p className="product-brand">
              Brand: <Link to={`/products?search=${product.brand}`}>{product.brand}</Link>
            </p>
            <h1>{product.name}</h1>

            <div className="product-rating-row">
              <StarRating rating={parseFloat(product.rating) || 4.0} size={20} />
              <a href="#reviews" className="rating-number">
                {parseFloat(product.rating).toFixed(1)} out of 5
              </a>
              <span style={{ color: '#565959' }}>|</span>
              <a href="#reviews" className="rating-number">
                {(product.review_count || 0).toLocaleString('en-IN')} ratings
              </a>
            </div>

            {product.is_prime && (
              <div className="prime-badge" style={{ marginBottom: 8 }}>
                <span className="prime-logo" style={{ fontSize: 14 }}>prime</span>
                <span>Free delivery on eligible orders</span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-section">
              <div className="product-price-label">Price:</div>
              <div className="product-price-main">
                <span className="price-symbol">₹</span>
                {parseInt(product.price).toLocaleString('en-IN')}
              </div>
              {product.original_price > product.price && (
                <div className="product-mrp">
                  M.R.P.: <strike>₹{parseInt(product.original_price).toLocaleString('en-IN')}</strike>
                </div>
              )}
              {discount > 0 && (
                <div className="product-discount-row">
                  <span className="product-discount-pct">({discount}% off)</span>
                  <span style={{ color: '#CC0C39', fontSize: 14 }}>
                    Limited time deal
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="product-specs" id="product-specs">
                <h3 className="specs-title">Technical Details</h3>
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="buy-box" id="buy-box">
            <div className="buy-price">
              <span className="price-symbol" style={{ fontSize: 18 }}>₹</span>
              {parseInt(product.price).toLocaleString('en-IN')}
            </div>

            {product.is_prime && (
              <div className="buy-prime">
                <span className="prime-logo">prime</span>
                FREE Delivery
              </div>
            )}

            <div className="buy-delivery" style={{ marginBottom: 12 }}>
              {product.is_prime ? (
                <span>FREE delivery <strong>tomorrow</strong> if ordered in next 6 hours</span>
              ) : (
                <span>Delivery: <strong>3-5 business days</strong></span>
              )}
            </div>

            <div className={`buy-stock ${isOutOfStock ? 'out-of-stock' : ''}`}>
              {isOutOfStock ? '❌ Out of Stock' : `✅ In Stock (${product.stock} left)`}
            </div>

            {!isOutOfStock && (
              <>
                <div className="quantity-selector">
                  <span>Quantity:</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    id="qty-decrease"
                  >−</button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    id="qty-increase"
                  >+</button>
                </div>

                <div className="buy-btns">
                  <button
                    className="btn-add-cart-lg"
                    onClick={handleAddToCart}
                    disabled={addingCart}
                    id="add-to-cart-btn"
                  >
                    {addingCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className="btn-buy-now-lg"
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

            <div className="secure-transaction">
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
        <div className="section" id="related-products">
          <div className="section-header">
            <h2 className="section-title">Customers also viewed</h2>
          </div>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
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
