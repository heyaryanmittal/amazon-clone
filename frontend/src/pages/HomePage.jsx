import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_IMAGES = [
  'https://images-eu.ssl-images-amazon.com/images/G/31/img24/Beauty/GW/Aug/unrec/under499/Skincare_hero_3000x1200._CB566736237_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/Events/V20/GW/Models/hero_pc_5_2x._CB583694086_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/D103625178_DesktopTallHero_3000x1200_V3._CB558389732_.jpg',
  'https://images-eu.ssl-images-amazon.com/images/G/31/img24/Sports/April/April_1/GW/Unrec/Hero/Sports__outdoor_PC_Hero_3000x1200._CB560505191_.jpg'
];

const QUAD_CARDS = [
  {
    title: 'Appliances for your home | Up to 55% off',
    link: 'See more',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08RDL6H79._SY116_CB667322346_.jpg', label: 'Air conditioners' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08345R1ZW._SY116_CB667322346_.jpg', label: 'Refrigerators' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B07G5J5FYP._SY116_CB667322346_.jpg', label: 'Microwaves' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/186x116---wm._SY116_CB667322346_.jpg', label: 'Washing machines' }
    ]
  },
  {
    title: 'Revamp your home in style',
    link: 'Explore all',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_furnishings_2._SY116_CB584596691_.jpg', label: 'Cushion covers, bedsheets\\n& more' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_decor_1._SY116_CB584596691_.jpg', label: 'Figurines, vases & more' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_storage_1._SY116_CB584596691_.jpg', label: 'Home storage' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_lighting_2._SY116_CB584596691_.jpg', label: 'Lighting solutions' }
    ]
  },
  {
    title: 'Bulk order discounts + Up to 18% GST savings',
    link: 'Register now',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Laptops_186x116._SY116_CB583852028_.jpg', label: 'Up to 45% off | Laptops' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Kitchen_186x116._SY116_CB583852028_.jpg', label: 'Up to 60% off | Kitchen\\nappliances' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Furniture_186x116._SY116_CB583852028_.jpg', label: 'Min. 50% off | Office...' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Amazon_biz_186x116._SY116_CB583852028_.jpg', label: 'Register using GST' }
    ]
  },
  {
    title: 'Starting ₹49 | Deals on home essentials',
    link: 'Explore all',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_1._SY116_CB561113576_.jpg', label: 'Cleaning supplies' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_3._SY116_CB561113576_.jpg', label: 'Bathroom accessories' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_4._SY116_CB561113576_.jpg', label: 'Home tools' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_2._SY116_CB561113576_.jpg', label: 'Wallpapers' }
    ]
  }
];

const SINGLE_CARDS = [
  {
    title: 'Up to 75% off | Electronics & accessories',
    link: 'See all offers',
    img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/june/CE/GW/QC/PC/PC_QuadCard_boAt_0.5x._SY116_CB553870684_.jpg', // Placeholder
    fallbackImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/june/CE/GW/QC/PC/PC_QuadCard_boAt._SY116_CB553870684_.jpg'
  },
  {
    title: 'Automotive essentials | Up to 60% off',
    link: 'See more',
    img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Auto/2020/GW/PCQC/Glasscare1X._SY116_CB410830553_.jpg', // Placeholder
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Auto/2020/GW/PCQC/Glasscare1X._SY116_CB410830553_.jpg', label: 'Cleaning accessories' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Auto/2020/GW/PCQC/Rim_tyrecare1x._SY116_CB410830552_.jpg', label: 'Tyre & rim care' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Auto/2020/GW/PCQC/Vega_helmet_186x116._SY116_CB405090404_.jpg', label: 'Helmets' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img17/Auto/2020/GW/PCQC/Vaccum1x._SY116_CB410830552_.jpg', label: 'Vacuum cleaner' }
    ]
  },
  {
    title: 'Starting ₹199 | Amazon Brands & more',
    link: 'Shop now',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Symbol/2024/GW_Mar/2nd_week/PC_QC_1_186x116._SY116_CB580665970_.jpg', label: 'Starting ₹299 | Home essentials' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Symbol/2024/GW_Mar/2nd_week/PC_QC_2_186x116._SY116_CB580665970_.jpg', label: 'Up to 60% off | Daily essentials' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Symbol/2024/GW_Mar/2nd_week/PC_QC_3_186x116._SY116_CB580665970_.jpg', label: 'Up to 50% off | Electronics' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Symbol/2024/GW_Mar/2nd_week/PC_QC_4_186x116._SY116_CB580665970_.jpg', label: 'Starting ₹199 | Undergarments' }
    ]
  },
  {
    title: 'Deals on related items',
    link: 'See all deals',
    isSingle: true,
    img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Electronics/Clearance/Clearance_store_Desktop_CC_1x._SY304_CB628315133_.jpg'
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
