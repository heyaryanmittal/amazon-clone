import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1500&auto=format&fit=crop'
];

const QUAD_CARDS = [
  {
    title: 'Revamp your home in style',
    link: 'Explore all',
    items: [
      { img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=300&auto=format&fit=crop', label: 'Cushion covers, bedsheets & more' },
      { img: 'https://images.unsplash.com/photo-1629016943072-0bf0ee4e29e8?q=80&w=300&auto=format&fit=crop', label: 'Figurines, vases & more' },
      { img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=300&auto=format&fit=crop', label: 'Home storage' },
      { img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?q=80&w=300&auto=format&fit=crop', label: 'Lighting solutions' }
    ]
  },
  {
    title: 'Appliances for your home | Up to 55% off',
    link: 'See more',
    items: [
      { img: 'https://images.unsplash.com/photo-1626806787426-5910811b6325?q=80&w=300&auto=format&fit=crop', label: 'Air conditioners' },
      { img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&auto=format&fit=crop', label: 'Refrigerators' },
      { img: 'https://images.unsplash.com/photo-1585659722983-38ca819efa2c?q=80&w=300&auto=format&fit=crop', label: 'Microwaves' },
      { img: 'https://images.unsplash.com/photo-1626806819282-2c1dc0ed0f31?q=80&w=300&auto=format&fit=crop', label: 'Washing machines' }
    ]
  },
  {
    title: 'Up to 60% off | Styles for women',
    link: 'See all offers',
    items: [
      { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop', label: "Women's Clothing" },
      { img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&auto=format&fit=crop', label: 'Footwear & Handbags' },
      { img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=300&auto=format&fit=crop', label: 'Watches' },
      { img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop', label: 'Fashion jewellery' }
    ]
  },
  {
    title: 'Starting ₹149 | Headphones',
    link: 'See all offers',
    isSingle: true,
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' 
  }
];

const SINGLE_CARDS = [
  {
    title: 'Up to 75% off | Electronics & accessories',
    link: 'See all offers',
    img: 'https://images.unsplash.com/photo-1550009158-9ffb6e4b8599?q=80&w=400&auto=format&fit=crop',
    fallbackImg: 'https://images.unsplash.com/photo-1550009158-9ffb6e4b8599?q=80&w=400&auto=format&fit=crop'
  },
  {
    title: 'Automotive essentials | Up to 60% off',
    link: 'See more',
    img: 'https://images.unsplash.com/photo-1600706432502-77a0e2e32729?q=80&w=400&auto=format&fit=crop',
    items: [
      { img: 'https://images.unsplash.com/photo-1600706432502-77a0e2e32729?q=80&w=300&auto=format&fit=crop', label: 'Cleaning accessories' },
      { img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=300&auto=format&fit=crop', label: 'Tyre & rim care' },
      { img: 'https://images.unsplash.com/photo-1558333830-b3b3cbcf912b?q=80&w=300&auto=format&fit=crop', label: 'Helmets' },
      { img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=300&auto=format&fit=crop', label: 'Accessories' }
    ]
  },
  {
    title: 'Starting ₹199 | Men\'s Fashion & more',
    link: 'Shop now',
    items: [
      { img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=300&auto=format&fit=crop', label: 'Starting ₹299 | Shirts' },
      { img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300&auto=format&fit=crop', label: 'Up to 60% off | Jeans' },
      { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=300&auto=format&fit=crop', label: 'Up to 50% off | Sneakers' },
      { img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=300&auto=format&fit=crop', label: 'Starting ₹199 | Undergarments' }
    ]
  },
  {
    title: 'Deals on related items',
    link: 'See all deals',
    isSingle: true,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop'
  }
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    document.title = 'Amazon.in: Online Shopping India - Buy mobiles, laptops, cameras, books, watches, apparel, shoes and e-Gift Cards.';
    getFeaturedProducts().then(({ data }) => {
      setFeatured(data.products || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideImg = HERO_IMAGES[currentSlide];

  return (
    <div className="bg-[#e3e6e6]">
      {/* Hero Banner Area */}
      <div className="relative mx-auto w-full max-w-[1500px]">
        {/* Carousel Image */}
        <div className="relative h-[230px] md:h-[400px] lg:h-[600px] w-full overflow-hidden">
          {HERO_IMAGES.map((img, i) => (
            <img 
              key={i}
              src={img} 
              alt="Hero Banner" 
              className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-opacity duration-500 ease-in-out ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
            />
          ))}
          {/* Gradient Overlay to blend into the main background */}
          <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#e3e6e6] to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute z-30 left-4 top-[10%] md:top-[20%] text-[#333] cursor-pointer hover:border-[#008296] border-[2px] border-transparent p-2 focus:border-[#008296] focus:outline-none"
          style={{ height: '35vh', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={48} className="drop-shadow-lg text-[#555]" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length)}
          className="absolute z-30 right-4 top-[10%] md:top-[20%] text-[#333] cursor-pointer hover:border-[#008296] border-[2px] border-transparent p-2 focus:border-[#008296] focus:outline-none"
          style={{ height: '35vh', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={48} className="drop-shadow-lg text-[#555]" />
        </button>
      </div>

      {/* Main Content Area - Overlapping the Hero image */}
      <div className="relative z-30 max-w-[1500px] mx-auto px-4 mt-[-100px] md:mt-[-200px] lg:mt-[-350px]">
        {/* Row 1 - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          {QUAD_CARDS.map((card, idx) => (
            <div key={idx} className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px]">
              <h2 className="text-[21px] font-bold text-[#0f1111] mb-2.5 leading-[1.2]">{card.title}</h2>
              
              {card.isSingle ? (
                <div className="flex-1 overflow-hidden mb-4 rounded-sm">
                  <Link to="/products"><img src={card.img} alt={card.title} className="w-full h-full object-cover bg-[#f3f4f6]" /></Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 mb-4">
                  {card.items.map((item, i) => (
                    <div key={i} className="flex flex-col cursor-pointer">
                      <Link to="/products"><img src={item.img} alt={item.label} className="w-full aspect-square object-cover mb-1 bg-[#f3f4f6] rounded-sm" /></Link>
                      <Link to="/products" className="text-[12px] text-[#0f1111] no-underline line-clamp-2 hover:underline">{item.label}</Link>
                    </div>
                  ))}
                </div>
              )}
              
              <Link to="/products" className="text-[13px] text-[#007185] no-underline hover:text-[#c45500] hover:underline mt-auto">
                {card.link}
              </Link>
            </div>
          ))}
        </div>

        {/* Row 2 - 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          {SINGLE_CARDS.map((card, idx) => (
            <div key={idx} className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] relative">
              <h2 className="text-[21px] font-bold text-[#0f1111] mb-2.5 leading-[1.2]">{card.title}</h2>
              
              {card.items ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 mb-4">
                  {card.items.map((item, i) => (
                    <div key={i} className="flex flex-col cursor-pointer">
                      <Link to="/products"><img src={item.img} alt={item.label} className="w-full aspect-square object-cover mb-1 bg-[#f3f4f6] rounded-sm" /></Link>
                      <Link to="/products" className="text-[12px] text-[#0f1111] no-underline line-clamp-2 hover:underline">{item.label}</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 overflow-hidden mb-4 rounded-sm">
                  <Link to="/products"><img src={card.img || card.fallbackImg} alt={card.title} className="w-full h-full object-cover bg-[#f3f4f6]" /></Link>
                </div>
              )}
              
              <Link to="/products" className="text-[13px] text-[#007185] no-underline hover:text-[#c45500] hover:underline mt-auto">
                {card.link}
              </Link>
            </div>
          ))}
        </div>

        {/* Horizontal Scroller - Today's Deals */}
        <div className="bg-white p-5 mb-5">
          <div className="flex items-end gap-4 mb-4">
            <h2 className="text-[21px] font-bold text-[#0f1111]">Today's Deals</h2>
            <Link to="/products?featured=true" className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline font-medium mb-1">
              See all deals
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[200px] h-[250px] bg-[#f0f2f2] rounded-sm animate-pulse"></div>
              ))
            ) : featured.length > 0 ? (
              featured.map(product => (
                <div key={product.id} className="min-w-[200px] max-w-[200px] flex flex-col cursor-pointer group">
                  <div className="h-[200px] bg-[#f7f7f7] mb-2 p-2 flex items-center justify-center rounded-sm overflow-hidden">
                    <img 
                      src={product.primary_image || 'https://via.placeholder.com/200x200?text=Product'} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Product'; }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#CC0C39] text-white text-[12px] font-bold px-2 py-1 rounded-[3px]">
                      Up to {(product.original_price && product.price) ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 20}% off
                    </span>
                    <span className="text-[#CC0C39] text-[12px] font-bold">Deal of the Day</span>
                  </div>
                  <div className="text-[14px] text-[#0f1111] line-clamp-1">{product.name}</div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 text-[#565959]">No deals available right now.</div>
            )}
          </div>
        </div>

        {/* Categories Bar Bottom */}
        <div className="bg-white p-5 mb-5 border border-[#dddddd] rounded-sm text-center">
          <div className="text-[13px] text-[#0f1111] font-medium mb-1">See personalized recommendations</div>
          <button className="bg-[#FFD814] text-[#0f1111] font-bold px-16 py-1.5 rounded-[3px] border border-[#FCD200] shadow-[0_2px_5px_rgba(213,217,217,0.5)] cursor-pointer hover:bg-[#F7CA00] inline-block mb-1">Sign in</button>
          <div className="text-[11px] text-[#0f1111]">New customer? <Link to="/register" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
