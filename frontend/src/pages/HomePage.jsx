import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '../services/api';

const HERO_IMAGES = [
  '/images/landing_1.jpg',
  '/images/landing_2.png',
  '/images/landing_3.jpg'
];

const ROW_1_CARDS = [
  {
    type: 'quad', title: 'Appliances for your home | Up to 55% off', link: 'See more',
    items: [
      { img: '/images/air_conditioner.jpg', label: 'Air conditioners' },
      { img: '/images/refrigerator.jpg', label: 'Refrigerators' },
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
      { img: '/images/cleaning supplies.jpg', label: 'Cleaning supplies' },
      { img: '/images/bathroom accessories.jpg', label: 'Bathroom accessories' },
      { img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300', label: 'Home tools' },
      { img: '/images/wallpapers.jpg', label: 'Wallpapers' }
    ]
  }
];

const ROW_4_CARDS = [
  {
    type: 'quad', title: "Customers' Most-Loved Fashion for you", link: 'Explore more',
    items: [
      { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1434389678278-be4d41a6b8e3?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1489987707023-af82705283fc?w=200&q=80', label: '' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Cool comfort at every corner', link: 'See all offers', price: '3,492', ogPrice: '8,000',
    mainImg: 'https://images.unsplash.com/photo-1558231464-9a48d0df621c?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1558231464-9a48d0df621c?w=100&q=80',
      'https://images.unsplash.com/photo-1585822765379-7a3eb11b1574?w=100&q=80',
      'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=100&q=80',
      'https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=100&q=80'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 50% off | Deals on home decor', link: 'Shop now', price: '2,499', ogPrice: '6,000',
    mainImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=100&q=80',
      'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=100&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=100&q=80'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Best offers on kitchen products from brands...', link: 'See all offers', price: '1,299', ogPrice: '3,500',
    mainImg: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80',
    thumbs: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&q=80',
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=100&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=100&q=80'
    ]
  }
];

const ROW_7_CARDS = [
  {
    type: 'single-thumbs', title: 'Starting ₹299 | Trending kitchen essentials', link: 'Shop now', price: '4,499', ogPrice: '12,000',
    mainImg: 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=400&q=80',
    thumbs: Array(4).fill('https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=100&q=80')
  },
  {
    type: 'quad', title: 'Best Sellers in Beauty', link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1571781564287-321153a5cce4?w=200&q=80', label: '' },
      { img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80', label: '' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Min. 25% off | Trending & small decor', link: 'See all offers', price: '899', ogPrice: '2,500',
    mainImg: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
    thumbs: Array(4).fill('https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=100&q=80')
  },
  {
    type: 'single-thumbs', title: 'Min. 50% off | Top deals from Small Businesses', link: 'See all deals', price: '450', ogPrice: '1,200',
    mainImg: 'https://images.unsplash.com/photo-1490212000085-f2603837e226?w=400&q=80',
    thumbs: Array(4).fill('https://images.unsplash.com/photo-1490212000085-f2603837e226?w=100&q=80')
  }
];

const ROW_10_CARDS = [
  {
    type: 'quad', title: 'Best Sellers in Computers & Accessories', link: 'See more',
    items: Array(4).fill({ img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&q=80', label: '' })
  },
  {
    type: 'quad', title: 'Best Sellers in Clothing & Accessories', link: 'See more',
    items: Array(4).fill({ img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80', label: '' })
  },
  {
    type: 'quad', title: 'Best Sellers in Home & Kitchen', link: 'See more',
    items: Array(4).fill({ img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&q=80', label: '' })
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Inverter Batteries from brands near you', link: 'Explore more', price: '12,999', ogPrice: '25,000',
    mainImg: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&q=80',
    thumbs: Array(4).fill('https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=100&q=80')
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
      <div className="flex items-center gap-4 mb-3">
        <h2 className="text-[21px] font-extrabold text-[#0f1111] leading-6">{title}</h2>
        {linkText && (
          <Link to="/products" className="text-[#007185] text-[13px] hover:text-[#c45500] hover:underline font-medium pt-1">
            {linkText}
          </Link>
        )}
      </div>
      
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.3)] h-[100px] w-[45px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-r-[4px] cursor-pointer border border-[#ddd] hover:bg-gray-50 text-black">
          <ChevronLeft size={30} strokeWidth={1} />
        </button>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide py-2 scroll-smooth">
          {items.map((img, i) => (
            <Link key={i} to="/products" className="min-w-[200px] max-w-[200px] h-[200px] cursor-pointer flex-shrink-0 bg-[#f7f7f7] p-2 hover:opacity-90">
              <img src={img} alt="Product" className="w-full h-full object-contain" />
            </Link>
          ))}
        </div>

        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.3)] h-[100px] w-[45px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-l-[4px] cursor-pointer border border-[#ddd] hover:bg-gray-50 text-black">
          <ChevronRight size={30} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};


const CardGridRow = ({ cards, isFirstRow }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5 px-4 max-w-[1500px] mx-auto z-30 relative ${isFirstRow ? 'mt-[-150px] md:mt-[-250px] lg:mt-[-380px]' : ''}`}>
    {cards.map((card, idx) => (
      <div key={idx} className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] shadow-sm z-30 relative group overflow-hidden">
        <h2 className="text-[21px] font-extrabold text-[#0f1111] mb-2.5 leading-[1.2] min-h-[50px]">{card.title}</h2>
        
        {card.type === 'quad' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1 mb-4">
            {card.items.map((item, i) => (
              <div key={i} className="flex flex-col cursor-pointer">
                <Link to="/products"><img src={item.img} alt={item.label} className="w-full h-[110px] object-cover mb-1 bg-[#f3f4f6]" onError={(e)=>{ e.target.onerror = null; e.target.src='https://placehold.co/150'; }} /></Link>
                {item.label && <Link to="/products" className="text-[12px] text-[#0f1111] no-underline line-clamp-1 hover:underline">{item.label}</Link>}
              </div>
            ))}
          </div>
        )}

        {card.type === 'single-thumbs' && (
          <div className="flex-1 mb-4 flex flex-col justify-between">
            <Link to="/products" className="flex-1 flex flex-col bg-white mb-2 overflow-hidden relative no-underline">
               <img src={card.mainImg} alt={card.title} className="max-h-[180px] w-full object-contain mb-2" onError={(e)=>{ e.target.onerror = null; e.target.src='https://placehold.co/300'; }} />
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
              {card.thumbs.map((thumb, i) => (
                 <div key={i} className={`p-0.5 border rounded-[2px] cursor-pointer ${i===0 ? 'border-[#007185] shadow-[0_0_2px_#007185]' : 'border-[#ddd] hover:border-[#888]'}`}>
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
          {[1,2,3,4].map(i => (
             <div key={i} className="min-w-[160px] flex flex-col border border-[#ddd] p-3 rounded cursor-pointer hover:shadow-sm">
                <img src={`https://placehold.co/150x150?text=Live+Product+${i}`} className="w-full h-[140px] border border-[#eee] object-contain mb-3" />
                <div className="text-[13px] line-clamp-2 text-[#0f1111] leading-[1.3] mb-1">Exclusive product featured in Amazon Live stream...</div>
                <div className="text-[14px] text-[#B12704] font-medium">₹1,249.00</div>
             </div>
          ))}
       </div>
    </div>
  </div>
);


const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // DUMMY ARRAYS FOR SCROLLERS
  const generateImages = (count, keyword) => {
    const images = {
      furniture: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300',
        'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=300',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300'
      ],
      headphones: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        'https://images.unsplash.com/photo-1583394838336-3d46f052e121?w=300',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300'
      ],
      art: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300',
        'https://images.unsplash.com/photo-1459749411177-042180ec75c0?w=300',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300'
      ],
      cookware: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300',
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300'
      ]
    };
    
    const pool = images[keyword] || ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300'];
    return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
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

        {/* ROW 2: Scroller -> Up to 60% off | Deals on everyday furniture */}
        <HorizontalScroller title="Up to 60% off | Deals on everyday furniture" linkText="See all deals" items={generateImages(12, 'furniture')} />

        {/* ROW 3: Scroller -> Up to 40% off | Headphones and earbuds */}
        <HorizontalScroller title="Up to 40% off | Headphones and earbuds" linkText="See all offers" items={generateImages(12, 'headphones')} />

        {/* ROW 4: 4 Custom Cards */}
        <CardGridRow cards={ROW_4_CARDS} />

        {/* ROW 5: Scroller -> Up to 75% off | Curated products | Small Businesses */}
        <HorizontalScroller title="Up to 75% off | Curated products | Small Businesses" linkText="Shop now" items={generateImages(12, 'art')} />

        {/* ROW 6: Scroller -> Up to 60% off | Cookware... | Amazon Launchpad */}
        <HorizontalScroller title="Up to 60% off | Cookware, Mugs and Dining | Amazon Launchpad" linkText="See more" items={generateImages(12, 'cookware')} />

        {/* ROW 7: 4 Custom Cards */}
        <CardGridRow cards={ROW_7_CARDS} />

        {/* ROW 8: Scroller -> Up to 60% off | Bestsellers from women-led brands */}
        <HorizontalScroller title="Up to 60% off | Bestsellers from women-led brands" linkText="See all offers" items={generateImages(12, 'brands')} />

        {/* ROW 9: Amazon LIVE */}
        <AmazonLiveSection />

        {/* ROW 10: 4 Quad Cards */}
        <CardGridRow cards={ROW_10_CARDS} />

        {/* ROW 11: Scroller -> Min. 50% off | Upgrade your home... */}
        <HorizontalScroller title="Min. 50% off | Upgrade your home with products from Small Businesses" linkText="Explore more" items={generateImages(12, 'upgrade')} />

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
