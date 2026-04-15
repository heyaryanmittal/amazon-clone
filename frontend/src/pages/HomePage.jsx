import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedProducts } from '../services/api';

const HERO_IMAGES = [
  '/banners/media__1776199825381.png',
  '/banners/media__1776199837626.png',
  '/banners/media__1776199851769.png'
];

const ROW_1_CARDS = [
  {
    type: 'quad', title: 'Appliances for your home | Up to 55% off', link: 'See more',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08RDL6H79._SY116_CB667322346_.jpg', label: 'Air conditioners' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B08345R1ZW._SY116_CB667322346_.jpg', label: 'Refrigerators' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/Appliances-QC-PC-186x116--B07G5J5FYP._SY116_CB667322346_.jpg', label: 'Microwaves' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG15/Irfan/GATEWAY/MSO/186x116---wm._SY116_CB667322346_.jpg', label: 'Washing machines' }
    ]
  },
  {
    type: 'quad', title: 'Revamp your home in style', link: 'Explore all',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_furnishings_2._SY116_CB584596691_.jpg', label: 'Cushion covers, bedsheets & more' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_decor_1._SY116_CB584596691_.jpg', label: 'Figurines, vases & more' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_storage_1._SY116_CB584596691_.jpg', label: 'Home storage' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/IMG20/Home/2024/Gateway/BTFGW/PCQC/186x116_Home_lighting_2._SY116_CB584596691_.jpg', label: 'Lighting solutions' }
    ]
  },
  {
    type: 'quad', title: 'Bulk order discounts + Up to 18% GST savings', link: 'Register now',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Laptops_186x116._SY116_CB583852028_.jpg', label: 'Up to 45% off | Laptops' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Kitchen_186x116._SY116_CB583852028_.jpg', label: 'Up to 60% off | Kitchen appliances' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Furniture_186x116._SY116_CB583852028_.jpg', label: 'Min. 50% off | Office...' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Article/PC_QC_Amazon_biz_186x116._SY116_CB583852028_.jpg', label: 'Register using GST' }
    ]
  },
  {
    type: 'quad', title: 'Starting ₹49 | Deals on home essentials', link: 'Explore all',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_1._SY116_CB561113576_.jpg', label: 'Cleaning supplies' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_3._SY116_CB561113576_.jpg', label: 'Bathroom accessories' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_4._SY116_CB561113576_.jpg', label: 'Home tools' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img22/march/BISS/1X_2._SY116_CB561113576_.jpg', label: 'Wallpapers' }
    ]
  }
];

const ROW_4_CARDS = [
  {
    type: 'quad', title: "Customers' Most-Loved Fashion for you", link: 'Explore more',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/GW/Aug_rec/QC_Mens_tops/Mens_tops_1._SY116_CB566731998_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/GW/Aug_rec/QC_Mens_tops/Mens_tops_2._SY116_CB566731998_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/GW/Aug_rec/QC_Mens_tops/Mens_tops_3._SY116_CB566731998_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/GW/Aug_rec/QC_Mens_tops/Mens_tops_4._SY116_CB566731998_.jpg', label: '' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Cool comfort at every corner', link: 'See all offers', price: '3,492', ogPrice: '8,000',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/img23/CE/Aug/Fans_Tall_card_2_1._SY304_CB566746817_.jpg',
    thumbs: [
      'https://images-eu.ssl-images-amazon.com/images/G/31/img23/CE/Aug/Fans_Tall_card_2_1._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/img23/CE/Aug/Fans_Tall_card_2_2._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/img23/CE/Aug/Fans_Tall_card_2_3._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/img23/CE/Aug/Fans_Tall_card_2_4._SY304_CB566746817_.jpg'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 50% off | Deals on home decor', link: 'Shop now', price: '2,499', ogPrice: '6,000',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_2_1._SY304_CB566746817_.jpg',
    thumbs: [
      'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_2_1._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_2_2._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_2_3._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_2_4._SY304_CB566746817_.jpg'
    ]
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Best offers on kitchen products from brands...', link: 'See all offers', price: '1,299', ogPrice: '3,500',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_3_1._SY304_CB566746817_.jpg',
    thumbs: [
      'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_3_1._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_3_2._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_3_3._SY304_CB566746817_.jpg',
      'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_3_4._SY304_CB566746817_.jpg'
    ]
  }
];

const ROW_7_CARDS = [
  {
    type: 'single-thumbs', title: 'Starting ₹299 | Trending kitchen essentials', link: 'Shop now', price: '4,499', ogPrice: '12,000',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_4_1._SY304_CB566746817_.jpg',
    thumbs: Array(4).fill('https://images-eu.ssl-images-amazon.com/images/G/31/Kitchen/2024/aug24/hero/QC/QC_4_1._SY304_CB566746817_.jpg')
  },
  {
    type: 'quad', title: 'Best Sellers in Beauty', link: 'See more',
    items: [
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Beauty/2024/Aug/hero/QC_1._SY116_CB566746817_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Beauty/2024/Aug/hero/QC_2._SY116_CB566746817_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Beauty/2024/Aug/hero/QC_3._SY116_CB566746817_.jpg', label: '' },
      { img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Beauty/2024/Aug/hero/QC_4._SY116_CB566746817_.jpg', label: '' }
    ]
  },
  {
    type: 'single-thumbs', title: 'Min. 25% off | Trending & small decor', link: 'See all offers', price: '899', ogPrice: '2,500',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_5_1._SY304_CB566746817_.jpg',
    thumbs: Array(4).fill('https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_5_1._SY304_CB566746817_.jpg')
  },
  {
    type: 'single-thumbs', title: 'Min. 50% off | Top deals from Small Businesses', link: 'See all deals', price: '450', ogPrice: '1,200',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_6_1._SY304_CB566746817_.jpg',
    thumbs: Array(4).fill('https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_6_1._SY304_CB566746817_.jpg')
  }
];

const ROW_10_CARDS = [
  {
    type: 'quad', title: 'Best Sellers in Computers & Accessories', link: 'See more',
    items: Array(4).fill({ img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/CE/Aug/QC_7_1._SY116_CB566746817_.jpg', label: '' })
  },
  {
    type: 'quad', title: 'Best Sellers in Clothing & Accessories', link: 'See more',
    items: Array(4).fill({ img: 'https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/GW/Aug_rec/QC_8_1._SY116_CB566731998_.jpg', label: '' })
  },
  {
    type: 'quad', title: 'Best Sellers in Home & Kitchen', link: 'See more',
    items: Array(4).fill({ img: 'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_9_1._SY116_CB566746817_.jpg', label: '' })
  },
  {
    type: 'single-thumbs', title: 'Up to 60% off | Inverter Batteries from brands near you', link: 'Explore more', price: '12,999', ogPrice: '25,000',
    mainImg: 'https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_10_1._SY304_CB566746817_.jpg',
    thumbs: Array(4).fill('https://images-eu.ssl-images-amazon.com/images/G/31/Home/2024/aug24/hero/QC/QC_10_1._SY304_CB566746817_.jpg')
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
    <div className="bg-white p-5 mb-5 mx-0 md:mx-4 max-w-[1500px] xl:mx-auto relative group">
      <div className="flex items-end gap-4 mb-4">
        <h2 className="text-[21px] font-bold text-[#0f1111] leading-6">{title}</h2>
        {linkText && (
          <Link to="/products" className="text-[#007185] text-[14px] hover:text-[#c45500] hover:underline font-medium mb-[2px]">
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
  <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5 px-4 max-w-[1500px] mx-auto z-30 relative ${isFirstRow ? 'mt-[-100px] md:mt-[-200px] lg:mt-[-350px]' : ''}`}>
    {cards.map((card, idx) => (
      <div key={idx} className="bg-white p-5 flex flex-col min-h-[420px] max-h-[420px] shadow-sm z-30 relative group">
        <h2 className="text-[21px] font-bold text-[#0f1111] mb-2.5 leading-[1.2] min-h-[50px]">{card.title}</h2>
        
        {card.type === 'quad' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 flex-1 mb-4">
            {card.items.map((item, i) => (
              <div key={i} className="flex flex-col cursor-pointer">
                <Link to="/products"><img src={item.img} alt={item.label} className="w-full h-[110px] object-cover mb-1 bg-[#f3f4f6]" onError={(e)=>e.target.src='https://via.placeholder.com/150'} /></Link>
                {item.label && <Link to="/products" className="text-[12px] text-[#0f1111] no-underline line-clamp-1 hover:underline">{item.label}</Link>}
              </div>
            ))}
          </div>
        )}

        {card.type === 'single-thumbs' && (
          <div className="flex-1 mb-4 flex flex-col justify-between">
            <Link to="/products" className="flex-1 flex flex-col bg-white mb-2 overflow-hidden relative no-underline">
               <img src={card.mainImg} alt={card.title} className="max-h-[180px] w-full object-contain mb-2" onError={(e)=>e.target.src='https://via.placeholder.com/300'} />
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
                   <img src={thumb} className="w-full h-full object-cover rounded-[1px]" onError={(e)=>e.target.src='https://via.placeholder.com/50'} />
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
                <img src={`https://via.placeholder.com/150x150?text=Live+Product+${i}`} className="w-full h-[140px] border border-[#eee] object-contain mb-3" />
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
  const generateImages = (count, keyword) => Array(count).fill(`https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80`);

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

      <div className="relative z-30 pb-4">
        {/* ROW 1: 4 Quad Cards */}
        <CardGridRow cards={ROW_1_CARDS} isFirstRow={true} />

        {/* ROW 2: Scroller -> Up to 60% off | Deals on everyday furniture */}
        <HorizontalScroller title="Up to 60% off | Deals on everyday furniture" linkText="See all deals" items={generateImages(12, 'furniture')} />

        {/* ROW 3: Scroller -> Up to 45% off | Headphones and earbuds */}
        <HorizontalScroller title="Up to 45% off | Headphones and earbuds" linkText="See all offers" items={generateImages(12, 'headphones')} />

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
