import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/api';

const HERO_IMAGES = [
  '/images/landing/landing_1.jpg',
  '/images/landing/landing_2.png',
  '/images/landing/landing_3.jpg'
];

const ROW_1_CARDS = [
  {
    type: 'quad', title: 'Appliances for your home | Up to 55% off', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1570222020676-d0dfbd6060ff?w=300', label: 'Air conditioners' },
      { img: 'https://images.unsplash.com/photo-1571175432247-ca63895e7992?w=300', label: 'Refrigerators' },
      { img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300', label: 'Microwaves' },
      { img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300', label: 'Washing machines' }
    ]
  },
  {
    type: 'quad', title: 'Revamp your home in style', link: 'Explore all',
    items: [
      { img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=300', label: 'Cushion covers, bedsheets & more' },
      { img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300', label: 'Figurines, vases & more' },
      { img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300', label: 'Home storage' },
      { img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300', label: 'Lighting solutions' }
    ]
  },
  {
    type: 'quad', title: 'Bulk order discounts + Up to 18% GST savings', link: 'Register now',
    items: [
      { img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300', label: 'Up to 45% off | Laptops' },
      { img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300', label: 'Up to 60% off | Kitchen appliances' },
      { img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300', label: 'Min. 50% off | Office...' },
      { img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', label: 'Register using GST' }
    ]
  },
  {
    type: 'quad', title: 'Starting ₹49 | Deals on home essentials', link: 'Explore all',
    items: [
      { img: 'https://images.unsplash.com/photo-1528740561666-dc2479da08ad?w=300', label: 'Cleaning supplies' },
      { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300', label: 'Bathroom accessories' },
      { img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300', label: 'Home tools' },
      { img: 'https://images.unsplash.com/photo-1514811501132-28a644405531?w=300', label: 'Wallpapers' }
    ]
  }
];

const ROW_4_CARDS = [
  {
    type: 'quad', title: "Customers' Most-Loved Fashion for you", link: 'Explore more',
    items: [
      { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=60&w=300', label: 'Women Fashion' },
      { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=60&w=300', label: 'Men Fashion' },
      { img: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=60&w=300', label: 'Kids Fashion' },
      { img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=60&w=300', label: 'Accessories' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Cool comfort at every corner', link: 'See all offers', price: '3,492', ogPrice: '8,000',
    mainImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=60&w=500',
    thumbs: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=60&w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=60&w=400'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 50% off | Deals on home decor', link: 'Shop now', price: '2,499', ogPrice: '6,000',
    mainImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&q=80',
      'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=400&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=80'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Best offers on kitchen products from brands...', link: 'See all offers', price: '1,299', ogPrice: '3,500',
    mainImg: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&q=80'
    ]
  }
];

const ROW_7_CARDS = [
  {
    type: 'single-thumbs', title: 'Starting ₹299 | Trending kitchen essentials', link: 'Shop now', price: '4,499', ogPrice: '12,000',
    mainImg: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=400&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400&q=80',
      'https://images.unsplash.com/photo-1556910602-3884ee9ad327?w=400&q=80',
      'https://images.unsplash.com/photo-1563177404-9b2dca91fa6c?w=400&q=80'
    ]
  },
  {
    type: 'quad', title: 'Best Sellers in Beauty', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', label: 'Lipsticks' },
      { img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80', label: 'Face Wash' },
      { img: 'https://images.unsplash.com/photo-1571781564287-321153a5cce4?w=200&q=80', label: 'Skincare' },
      { img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80', label: 'Serums' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Min. 25% off | Trending & small decor', link: 'See all offers', price: '899', ogPrice: '2,500',
    mainImg: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80',
      'https://images.unsplash.com/photo-1594913366159-1832cdcbe0c1?w=400&q=80'
    ]
  },
  {
    type: 'single-thumbs', title: 'Min. 50% off | Top deals from Small Businesses', link: 'See all deals', price: '450', ogPrice: '1,200',
    mainImg: 'https://images.unsplash.com/photo-1490212000085-f2603837e226?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1490212000085-f2603837e226?w=400&q=80',
      'https://images.unsplash.com/photo-1459749411177-042180ec75c0?w=400&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80'
    ]
  }
];

const ROW_10_CARDS = [
  {
    type: 'quad', title: 'Best Sellers in Computers & Accessories', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&q=80', label: 'Laptops' },
      { img: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=200&q=80', label: 'Monitors' },
      { img: 'https://images.unsplash.com/photo-1587829741301-dc798b83aca2?w=200&q=80', label: 'Keyboards' },
      { img: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=200&q=80', label: 'Mice' }
    ]
  },
  {
    type: 'quad', title: 'Best Sellers in Clothing & Accessories', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80', label: 'Womenswear' },
      { img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=200&q=80', label: 'Menswear' },
      { img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80', label: 'Footwear' },
      { img: 'https://images.unsplash.com/photo-1509192997682-4c9df670875e?w=200&q=80', label: 'Watches' }
    ]
  },
  {
    type: 'quad', title: 'Best Sellers in Home & Kitchen', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&q=80', label: 'Pressure Cookers' },
      { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80', label: 'Storage' },
      { img: 'https://images.unsplash.com/photo-1522338271444-12403063f3da?w=200&q=80', label: 'Tools' },
      { img: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=200&q=80', label: 'Cleaning' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Inverter Batteries from brands near you', link: 'Explore more', price: '12,999', ogPrice: '25,000',
    mainImg: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80',
      'https://images.unsplash.com/photo-1620714223084-8fcacc6df38d?w=400&q=80',
      'https://images.unsplash.com/photo-1617469767053-d3b508a0d182?w=400&q=80',
      'https://images.unsplash.com/photo-1565152394553-7393d25642d9?w=400&q=80'
    ]
  }
];


// Components

const HorizontalScroller = ({ title, linkText, items }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white p-5 pb-7 mb-5 mx-0 md:mx-4 max-w-[1500px] xl:mx-auto relative group shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <h2 className="text-[21px] font-extrabold text-[#0f1111] leading-6">{title}</h2>
          {linkText && (
            <Link to="/products" className="text-[#007185] text-[13px] hover:text-[#c45500] hover:underline font-medium pt-1">
              {linkText}
            </Link>
          )}
        </div>
      </div>
      
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] h-[100px] w-[45px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-[4px] cursor-pointer border border-[#ddd] hover:bg-gray-50 text-black">
          <ChevronLeft size={30} strokeWidth={1} />
        </button>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide py-2 scroll-smooth">
          {items.map((item, i) => (
            <Link key={i} to={`/products/${item.id}`} className="min-w-[210px] max-w-[210px] cursor-pointer flex-shrink-0 flex flex-col group/item transition-all">
              <div className="h-[200px] bg-[#f7f7f7] p-4 flex items-center justify-center mb-2 overflow-hidden">
                <img src={item.image_url || item.img} alt="Product" className="max-h-full max-w-full object-contain group-hover/item:scale-105 transition-transform duration-300" />
              </div>
              {(item.price) && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#cc0c39] text-white text-[12px] px-1.5 py-0.5 rounded-[2px] font-bold">
                      Up to {(item.original_price || item.ogPrice) ? Math.round(((parseFloat(String(item.original_price || item.ogPrice).replace(/,/g, '')) - parseFloat(String(item.price).replace(/,/g, ''))) / parseFloat(String(item.original_price || item.ogPrice).replace(/,/g, ''))) * 100) : (item.discount || '40')}% off
                    </span>
                    <span className="text-[#cc0c39] text-[12px] font-bold">Limited time deal</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[17px] text-[#0f1111] font-medium">₹{(parseFloat(String(item.price).replace(/,/g, ''))).toLocaleString('en-IN')}</span>
                    {(item.original_price || item.ogPrice) && (
                      <span className="text-[12px] text-[#565959]">M.R.P: <span className="line-through">₹{(parseFloat(String(item.original_price || item.ogPrice).replace(/,/g, ''))).toLocaleString('en-IN')}</span></span>
                    )}
                  </div>
                </div>
              )}
              {item.name ? (
                <div className="text-[13px] text-[#0f1111] line-clamp-2 mt-1 leading-relaxed group-hover/item:text-[#007185]">{item.name}</div>
              ) : (
                <div className="text-[13px] text-[#0f1111] line-clamp-1 mt-1 font-medium">{item.category_name || item.category || 'Product'}</div>
              )}
            </Link>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] h-[100px] w-[45px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-[4px] cursor-pointer border border-[#ddd] hover:bg-gray-50 text-black">
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};


const GridCard = ({ card }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] shadow-sm z-30 relative group overflow-hidden">
      <h2 className="text-[21px] font-extrabold text-[#0f1111] mb-2.5 leading-[1.2] min-h-[50px]">{card.title}</h2>
      
      {card.type === 'quad' && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1 mb-4">
          {card.items.map((item, i) => (
            <div key={i} className="flex flex-col cursor-pointer">
              <Link to="/products">
                <img 
                  src={item.img} 
                  alt={item.label} 
                  className="w-full h-[110px] object-cover mb-1 bg-[#f3f4f6]" 
                  onError={(e)=>{ e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200'; }} 
                />
              </Link>
              {item.label && <Link to="/products" className="text-[12px] text-[#0f1111] no-underline line-clamp-1 hover:underline">{item.label}</Link>}
            </div>
          ))}
        </div>
      )}

      {card.type === 'single-thumbs' && (
        <div className="flex-1 mb-4 flex flex-col justify-between">
          <Link to="/products" className="flex-1 flex flex-col bg-white mb-2 overflow-hidden relative no-underline">
             <img 
               src={card.thumbs ? card.thumbs[selectedIdx] : card.mainImg} 
               alt={card.title} 
               className="max-h-[180px] w-full object-contain mb-2 transition-opacity duration-200" 
               onError={(e)=>{ e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400'; }} 
             />
             {card.price ? (
               <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-1.5">
                   <span className="bg-[#cc0c39] text-white text-[12px] px-1.5 py-0.5 rounded-[2px] font-bold">₹{card.price}</span>
                   <span className="text-[#cc0c39] text-[12px] font-bold">Deal of the Day</span>
                 </div>
                 <div className="text-[12px] text-[#565959] mt-0.5">
                   M.R.P: <span className="line-through text-[#565959]">₹{card.ogPrice}</span>
                 </div>
               </div>
             ) : (
               <div className="text-[14px] text-[#0f1111] line-clamp-2">Premium quality selection curated just for you.</div>
             )}
          </Link>
          <div className="grid grid-cols-4 gap-2 h-[60px] mt-2">
            {card.thumbs?.map((thumb, i) => (
               <div 
                  key={i} 
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`p-0.5 border rounded-[2px] cursor-pointer transition-all ${i===selectedIdx ? 'border-[#007185] shadow-[0_0_2px_#007185]' : 'border-[#ddd] hover:border-[#888]'}`}
               >
                 <img src={thumb} className="w-full h-full object-cover rounded-[1px]" onError={(e)=>{ e.target.onerror = null; e.target.src='https://placehold.co/50'; }} />
               </div>
            ))}
          </div>
        </div>
      )}

      <Link to="/products" className="text-[13px] text-[#007185] no-underline hover:text-[#c45500] hover:underline mt-auto">
        {card.link || 'See more'}
      </Link>
    </div>
  );
};

const CardGridRow = ({ cards, isFirstRow }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5 px-4 max-w-[1500px] mx-auto z-30 relative ${isFirstRow ? 'mt-[-150px] md:mt-[-250px] lg:mt-[-380px]' : ''}`}>
    {cards.map((card, idx) => (
      <GridCard key={idx} card={card} />
    ))}
  </div>
);


const AmazonLiveSection = () => (
  <div className="bg-white p-5 mb-5 mx-0 md:mx-4 max-w-[1500px] xl:mx-auto">
    <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-4">
      <h2 className="text-[21px] font-bold text-[#0f1111]">Amazon LIVE - Watch, Chat & Shop LIVE</h2>
      <Link to="#" className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline font-medium mb-[2px]">See more from Amazon Live</Link>
    </div>
    <div className="flex flex-col lg:flex-row gap-5">
       <div className="flex-1 bg-black relative max-w-[100%] lg:max-w-[450px] h-[250px] lg:h-[300px]">
          <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/Clearance/Clearance_store_Desktop_CC_1x._SY304_CB628315133_.jpg" className="w-full h-full border border-[#eee] object-cover opacity-80" />
          <div className="absolute top-2 left-2 bg-[#e43f5a] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">LIVE</div>
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-105 transition-transform"><div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-2"></div></div></div>
       </div>
       <div className="flex-1 flex overflow-x-auto gap-4 scrollbar-hide">
          {[
            { img: 'https://images.unsplash.com/photo-150574042192b-fa4a70826993?w=300', name: 'Premium Studio Headphones - Wireless', price: '12,999' },
            { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', name: 'Smart Watch Series 7 - Black', price: '2,499' },
            { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', name: 'Polarized Sunglasses - Classic Style', price: '899' },
            { img: 'https://images.unsplash.com/photo-1583394838336-acd97773df81?w=300', name: 'E-Sports Gaming Mouse - RGB', price: '1,599' }
          ].map((item, i) => (
             <div key={i} className="min-w-[160px] flex flex-col border border-[#ddd] p-3 rounded cursor-pointer hover:shadow-sm">
                <img src={item.img} className="w-full h-[140px] border border-[#eee] object-contain mb-3" onError={(e)=>{ e.target.onerror = null; e.target.src='https://placehold.co/150'; }} />
                <div className="text-[13px] line-clamp-2 text-[#0f1111] leading-[1.3] mb-1">{item.name}</div>
                <div className="text-[14px] text-[#B12704] font-medium">₹{item.price}</div>
             </div>
          ))}
       </div>
    </div>
  </div>
);


const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headphones, setHeadphones] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [art, setArt] = useState([]);
  const [cookware, setCookware] = useState([]);

  useEffect(() => {
    document.title = 'Amazon.in: Online Shopping India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards.';
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch headphones from backend
    getProducts({ category: 'electronics', limit: 30 }).then(({ data }) => {
      const headphoneSlugs = [
        'mackie-thump212-powered-loudspeaker',
        'sony-wi-c100-wireless-earphones',
        'sony-wh-ch720n-pink',
        'sony-wh-ch720n-blue',
        'boat-airdopes-131-black',
        'truefree-o1-open-ear',
        'marshall-minor-iii-tws',
        'soundpeats-air3-tws',
        'openrun-pro-bone-conduction',
        'usb-c-wired-in-ear-earphones'
      ];
      const filtered = headphoneSlugs.map(slug => data.products.find(p => p.slug === slug)).filter(Boolean);
      if (filtered.length > 0) setHeadphones(filtered);
      else setHeadphones(data.products.slice(0, 10));
    }).catch(err => console.error('Failed to fetch headphones:', err));

    // Fetch furniture from backend
    getProducts({ category: 'home-kitchen', limit: 30 }).then(({ data }) => {
      const furnitureSlugs = [
        'modern-velvet-3-seater-sofa-emerald',
        'ergonomic-office-chair-high-back',
        'solid-oak-wood-dining-table-6-seater',
        'queen-size-platform-bed-storage',
        'industrial-style-bookshelf-metal-frame',
        'round-marble-coffee-table-gold',
        'scandinavian-tv-unit-light-oak',
        'wingback-accent-chair-mustard',
        'standing-mirror-full-length-walnut',
        'nest-of-tables-sheesham'
      ];
      const filtered = furnitureSlugs.map(slug => data.products.find(p => p.slug === slug)).filter(Boolean);
      if (filtered.length > 0) setFurniture(filtered);
      else setFurniture(data.products.slice(0, 10));
    }).catch(err => console.error('Failed to fetch furniture:', err));

    getProducts({ limit: 100 }).then(({ data }) => {
      const artSlugs = [
        'abstract-canvas-wall-art-hand-painted', 'hand-thrown-ceramic-vase-terracotta', 'organic-lavender-hand-poured-soy-candle',
        'handcrafted-wooden-serving-tray', 'woven-macrame-wall-hanging-decor', 'premium-full-grain-leather-journal',
        'hand-painted-mandala-decorative-plate', 'bamboo-woven-storage-basket-set-2', 'vintage-artisan-brass-desk-clock', 'handmade-goat-milk-soap-bar'
      ];
      const filteredArt = artSlugs.map(slug => data.products.find(p => p.slug === slug)).filter(Boolean);
      if (filteredArt.length > 0) setArt(filteredArt);

      const cookwareSlugs = [
        'non-stick-induction-base-frying-pan-24cm', 'premium-acacia-wood-cutting-board', 'enameled-cast-iron-dutch-oven-4-5-quart',
        'stainless-steel-chef-knife-8-inch', 'ceramic-coffee-mug-set-6', 'glass-teapot-rustproof-infuser',
        'textured-stoneware-serving-bowls', 'crystal-wine-glasses-set-6', 'rectangular-ceramic-baking-dish', 'silicone-kitchen-utensils-set-12'
      ];
      const filteredCookware = cookwareSlugs.map(slug => data.products.find(p => p.slug === slug)).filter(Boolean);
      if (filteredCookware.length > 0) setCookware(filteredCookware);
    }).catch(console.error);
  }, []);

  // DUMMY ARRAYS FOR SCROLLERS
  const getScrollerItems = (keyword) => {
    const placeholders = {
      headphones: [
        { img: '/images/headphones/headphone_1.jpg', name: 'Mackie Thump212 1200W 12-inch Powered Loudspeaker', price: '34,990', ogPrice: '45,000' },
        { img: '/images/headphones/headphone_2.jpg', name: 'Sony WI-C100 Wireless In-Ear Bluetooth Headphones', price: '1,699', ogPrice: '2,790' },
        { img: '/images/headphones/headphone_3.jpg', name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones - Pink', price: '9,990', ogPrice: '14,990' },
        { img: '/images/headphones/headphone_4.jpg', name: 'Sony WH-CH720N Wireless Noise Cancelling Headphones - Blue', price: '9,990', ogPrice: '14,990' },
        { img: '/images/headphones/headphone_5.jpg', name: 'boAt Airdopes 131 True Wireless Earbuds', price: '899', ogPrice: '2,990' },
        { img: '/images/headphones/headphone_6.jpg', name: 'TRUEFREE O1 Open Ear Bluetooth Headphones', price: '4,599', ogPrice: '6,999' },
        { img: '/images/headphones/headphone_7.jpg', name: 'Marshall Minor III True Wireless In-Ear Headphones', price: '11,999', ogPrice: '14,999' },
        { img: '/images/headphones/headphone_8.jpg', name: 'SoundPEATS Air3 Wireless Earbuds', price: '3,999', ogPrice: '5,999' },
        { img: '/images/headphones/headphone_9.jpg', name: 'SHOKZ OpenRun Pro - Premium Bone Conduction Sport Headphones', price: '15,999', ogPrice: '19,999' },
        { img: '/images/headphones/headphone_10.jpg', name: 'USB-C Wired In-Ear Headphones with Mic', price: '499', ogPrice: '999' }
      ],
      furniture: [
        { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', name: 'Modern Velvet 3-Seater Sofa', price: '22,499', ogPrice: '45,000' },
        { img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400', name: 'Ergonomic Office Chair with Lumbar Support', price: '7,999', ogPrice: '15,000' },
        { img: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400', name: 'Oak Wood Dining Table - 6 Seater', price: '34,999', ogPrice: '60,000' },
        { img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400', name: 'Queen Size Platform Bed with Storage', price: '18,500', ogPrice: '32,000' }
      ],
      art: [
        { img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', name: 'Abstract Canvas Wall Art - Hand Painted', price: '4,999', ogPrice: '7,500' },
        { img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400', name: 'Hand-thrown Ceramic Vase (Terracotta)', price: '1,299', ogPrice: '2,000' },
        { img: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400', name: 'Organic Lavender Hand-poured Soy Candle', price: '699', ogPrice: '1,200' },
        { img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', name: 'Handcrafted Wooden Serving Tray with Handles', price: '1,450', ogPrice: '2,200' },
        { img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400', name: 'Woven Macrame Wall Hanging Decor', price: '899', ogPrice: '1,500' },
        { img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', name: 'Premium Full-Grain Leather Bound Journal', price: '1,250', ogPrice: '1,999' },
        { img: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=400', name: 'Hand-painted Mandala Decorative Plate', price: '550', ogPrice: '999' },
        { img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', name: 'Bamboo Woven Storage Basket Set of 2', price: '1,100', ogPrice: '1,800' },
        { img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', name: 'Vintage Artisan Brass Desk Clock', price: '2,100', ogPrice: '3,500' },
        { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400', name: 'Handmade Natural Goat Milk Soap Bar', price: '299', ogPrice: '450' }
      ],
      cookware: [
        { img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', name: 'Non-Stick Induction Base Frying Pan (24cm)', price: '850', ogPrice: '1,500' },
        { img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400', name: 'Premium Acacia Wood Cutting Board', price: '1,299', ogPrice: '2,499' },
        { img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400', name: 'Enameled Cast Iron Dutch Oven (4.5 Quart)', price: '4,500', ogPrice: '7,999' },
        { img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=400', name: 'Stainless Steel Chef Knife (8-inch)', price: '999', ogPrice: '1,999' },
        { img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', name: 'Ceramic Coffee Mug Set of 6', price: '899', ogPrice: '1,500' },
        { img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', name: 'Glass Teapot with Rustproof Infuser', price: '1,150', ogPrice: '1,800' },
        { img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400', name: 'Textured Stoneware Serving Bowls (Set of 4)', price: '1,450', ogPrice: '2,200' },
        { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', name: 'Crystal Wine Glasses (Set of 6)', price: '2,199', ogPrice: '3,500' },
        { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', name: 'Rectangular Ceramic Baking Dish', price: '1,699', ogPrice: '2,500' },
        { img: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=400', name: 'Silicone Kitchen Utensils Set (12 Pieces)', price: '1,899', ogPrice: '3,000' }
      ],
      brands: [
        { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', name: 'Matte Liquid Lipstick Set', price: '999', ogPrice: '2,500' },
        { img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', name: 'Refresh Face Wash - Organic', price: '450', ogPrice: '800' },
        { img: 'https://images.unsplash.com/photo-1571781564287-321153a5cce4?w=400', name: 'Hyaluronic Acid Skin Serum', price: '1,200', ogPrice: '2,200' }
      ],
      upgrade: [
        { img: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=400', name: 'Solid Wood Wall Shelf Decor', price: '4,500', ogPrice: '8,000' },
        { img: 'https://images.unsplash.com/photo-1513511933972-f8d569feba8c?w=400', name: 'Abstract Canvas Wall Art', price: '1,800', ogPrice: '3,500' },
        { img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400', name: 'Minimalist Study Desk Lamp', price: '899', ogPrice: '1,500' }
      ]
    };
    
    const pool = placeholders[keyword] || [{ img: 'https://images.unsplash.com/photo-1620714223084-8fcacc6df38d?w=400', name: 'Curated Selection', price: '999', ogPrice: '1,999' }];
    return Array.from({ length: 12 }, (_, i) => ({ ...pool[i % pool.length], id: `${keyword}-${i}` }));
  };

  return (
    <div className="bg-[#e3e6e6]">
      {/* Hero Banner Area */}
      <div className="relative mx-auto w-full max-w-[1500px]">
        {/* Carousel Image */}
        <div className="relative h-[280px] md:h-[450px] lg:h-[650px] w-full overflow-hidden">
          {HERO_IMAGES.map((img, i) => (
            <img 
              key={i}
              src={img} 
              alt="Hero Banner" 
              className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
            />
          ))}
          {/* Gradient Overlay to blend into the main background */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-[#e3e6e6] via-[#e3e6e6]/60 to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute z-30 left-6 top-[15%] md:top-[20%] xl:top-[22%] text-[#111] cursor-pointer bg-transparent border-none p-2 outline-none focus:outline-none transition-transform hover:scale-110 active:scale-95"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length)}
          className="absolute z-30 right-6 top-[15%] md:top-[20%] xl:top-[22%] text-[#111] cursor-pointer bg-transparent border-none p-2 outline-none focus:outline-none transition-transform hover:scale-110 active:scale-95"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', WebkitTapHighlightColor: 'transparent' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="45" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="relative z-30 pb-4">
        {/* ROW 1: 4 Quad Cards */}
        <CardGridRow cards={ROW_1_CARDS} isFirstRow={true} />

        {/* ROW 2: Scroller -> Up to 40% off | Headphones and earbuds */}
        <HorizontalScroller title="Up to 40% off | Headphones and earbuds" linkText="See all offers" items={headphones.length > 0 ? headphones : getScrollerItems('headphones')} />

        {/* ROW 3: Scroller -> Up to 60% off | Deals on everyday furniture */}
        <HorizontalScroller title="Up to 60% off | Deals on everyday furniture" linkText="See all deals" items={furniture.length > 0 ? furniture : getScrollerItems('furniture')} />

        {/* ROW 4: 4 Custom Cards */}
        <CardGridRow cards={ROW_4_CARDS} />

        {/* ROW 5: Scroller -> Up to 75% off | Curated products | Small Businesses */}
        <HorizontalScroller title="Up to 75% off | Curated products | Small Businesses" linkText="Shop now" items={art.length > 0 ? art : getScrollerItems('art')} />

        {/* ROW 6: Scroller -> Up to 60% off | Cookware... | Amazon Launchpad */}
        <HorizontalScroller title="Up to 60% off | Cookware, Mugs and Dining | Amazon Launchpad" linkText="See more" items={cookware.length > 0 ? cookware : getScrollerItems('cookware')} />

        {/* ROW 7: 4 Custom Cards */}
        <CardGridRow cards={ROW_7_CARDS} />

        {/* ROW 8: Scroller -> Up to 60% off | Bestsellers from women-led brands */}
        <HorizontalScroller title="Up to 60% off | Bestsellers from women-led brands" linkText="See all offers" items={getScrollerItems('brands')} />

        {/* ROW 9: Amazon LIVE */}
        <AmazonLiveSection />



        {/* Categories Bar Bottom */}
        <div className="bg-white pt-8 pb-5 border border-[#dddddd] rounded-none text-center">
          <div className="text-[13px] text-[#0f1111] font-medium mb-1">See personalized recommendations</div>
          <Link to="/login" className="bg-[#FFD814] text-[#0f1111] font-bold px-16 py-1.5 rounded-[3px] border border-[#FCD200] shadow-[0_2px_5px_rgba(213,217,217,0.5)] cursor-pointer hover:bg-[#F7CA00] inline-block mb-1 no-underline">Sign in</Link>
          <div className="text-[11px] text-[#0f1111] mb-2">New customer? <Link to="/register" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
