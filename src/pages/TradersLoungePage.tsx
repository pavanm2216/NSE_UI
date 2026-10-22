import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ChevronDown, Settings, Search, Bell, Layers, X, MessageSquare, CheckCircle, TrendingUp, Minus, Circle, Triangle, PenTool, Type, Smile, Ruler, ZoomIn, Magnet, Edit, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import StockChartZoom from '@/components/trading/StockChartZoom';
import UnderDevelopmentPopup from '@/components/ui/UnderDevelopmentPopup';

const TradersLoungePage: React.FC = () => {
  const location = useLocation();  
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState('ASIANPAINT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
   
  const [expandedStock, setExpandedStock] = useState<string | null>('ASIANPAINT');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('chart');
  const [selectedMiniStock, setSelectedMiniStock] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ subject: '', description: '' });
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);

 const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1600&h=900&fit=crop',
      topText: 'Welcome to Lendrix Ventech Pvt. Ltd.',
      mainHeading: (
        <>
          Empowering you to navigate risk & unlock wealth.<br />
        </>
      ),
    },
    {
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=900&fit=crop',
      topText: 'WHERE YOUR FINANCIAL GROWTH MEETS EXPERT GUIDANCE',
      mainHeading: (
        <>
          Let us help you achieve your goals with discipline,<br />
          innovation, and trust.
        </>
      ),
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);
  const goPrev = useCallback(() => setHeroIndex(i => (i - 1 + heroSlides.length) % heroSlides.length), [heroSlides.length]);
  const goNext = useCallback(() => setHeroIndex(i => (i + 1) % heroSlides.length), [heroSlides.length]);

  // --- AUTO-ROTATE EVERY 5 SECONDS ---
  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const openDematModal = () => window.open('https://onboarding.nuvamawealth.com/Partner?utm_source=PARTNER&utm_campaign=7125383-AP&utm_content=ELITE', '_blank');

  const indices = [
    { symbol: 'NIFTY 50', exchange: 'NSE', price: 25722.15, change: -3.25, percent: -0.01, open: 25725.40, high: 25725.40, low: 25722.15, close: 25722.15 },
    { symbol: 'SENSEX', exchange: 'BSE', price: 83424.16, change: -26.80, percent: -0.03, open: 83450.96, high: 83450.96, low: 83424.16, close: 83424.16 },
  ];

  const stocks = [
    { symbol: 'ASIANPAINT', exchange: 'NSE', price: 2437.40, change: 40.20, percent: 1.68, status: 'Open = Low', open: 2397.20, high: 2437.40, low: 2397.20, close: 2437.40 },
    { symbol: 'CIPLA', exchange: 'NSE', price: 1343.90, change: -12.50, percent: -0.92, status: '', open: 1356.40, high: 1356.40, low: 1343.90, close: 1343.90 },
    { symbol: 'EICHERMOT', exchange: 'NSE', price: 8035.00, change: 24.50, percent: 0.31, status: '', open: 8010.50, high: 8035.00, low: 8010.50, close: 8035.00 },
    { symbol: 'NESTLEIND', exchange: 'NSE', price: 1285.30, change: -4.50, percent: -0.35, status: '', open: 1289.80, high: 1289.80, low: 1285.30, close: 1285.30 },
    { symbol: 'GRASIM', exchange: 'NSE', price: 2900.40, change: -12.30, percent: -0.42, status: '', open: 2912.70, high: 2912.70, low: 2900.40, close: 2900.40 },
    { symbol: 'HINDALCO', exchange: 'NSE', price: 890.10, change: -17.35, percent: -1.91, status: 'Top Loser', open: 907.45, high: 907.45, low: 890.10, close: 890.10 },
    { symbol: 'HINDUNILVR', exchange: 'NSE', price: 2312.30, change: -6.70, percent: -0.29, status: '', open: 2319.00, high: 2319.00, low: 2312.30, close: 2312.30 },
    { symbol: 'ITC', exchange: 'NSE', price: 325.00, change: -0.45, percent: -0.14, status: 'Active Vol â€¢ Top Gainer', open: 325.45, high: 325.45, low: 325.00, close: 325.00 },
    { symbol: 'TRENT', exchange: 'NSE', price: 4171.90, change: 0.00, percent: 0.00, status: 'Top Loser', open: 4171.90, high: 4171.90, low: 4171.90, close: 4171.90 },
    { symbol: 'LT', exchange: 'NSE', price: 4280.00, change: 0.20, percent: 0.00, status: 'Top Gainer', open: 4279.80, high: 4280.00, low: 4279.80, close: 4280.00 },
    { symbol: 'M&M', exchange: 'NSE', price: 3482.00, change: -7.20, percent: -0.21, status: '', open: 3489.20, high: 3489.20, low: 3482.00, close: 3482.00 },
    { symbol: 'RELIANCE', exchange: 'NSE', price: 1428.20, change: 5.20, percent: 0.37, status: 'Active Val â€¢ Top Loser', open: 1423.00, high: 1428.20, low: 1423.00, close: 1428.20 },
    { symbol: 'TATACONSUM', exchange: 'NSE', price: 1146.50, change: -2.00, percent: -0.17, status: '', open: 1148.50, high: 1148.50, low: 1146.50, close: 1146.50 },
    { symbol: 'TMPV', exchange: 'NSE', price: 382.85, change: 0.00, percent: 0.00, status: '', open: 382.85, high: 382.85, low: 382.85, close: 382.85 },
    { symbol: 'TATASTEEL', exchange: 'NSE', price: 203.08, change: 0.00, percent: 0.00, status: 'Top Loser', open: 203.08, high: 203.08, low: 203.08, close: 203.08 },
    { symbol: 'WIPRO', exchange: 'NSE', price: 218.30, change: 2.61, percent: 1.21, status: 'Active Vol', open: 215.69, high: 218.30, low: 215.69, close: 218.30 },
    { symbol: 'APOLLOHOSP', exchange: 'NSE', price: 7601.50, change: -16.50, percent: -0.22, status: '', open: 7618.00, high: 7618.00, low: 7601.50, close: 7601.50 },
    { symbol: 'DRREDDY', exchange: 'NSE', price: 1284.80, change: 15.40, percent: 1.21, status: '', open: 1269.40, high: 1284.80, low: 1269.40, close: 1284.80 },
    { symbol: 'TITAN', exchange: 'NSE', price: 4236.40, change: 55.30, percent: 1.32, status: '', open: 4181.10, high: 4236.40, low: 4181.10, close: 4236.40 },
    { symbol: 'SBIN', exchange: 'NSE', price: 0, change: 0, percent: 0, status: 'Active Val', open: 0, high: 0, low: 0, close: 0 },
    { symbol: 'SHRIRAMFIN', exchange: 'NSE', price: 1075.00, change: -10.40, percent: -0.96, status: '', open: 1085.40, high: 1085.40, low: 1075.00, close: 1075.00 },
    { symbol: 'BEL', exchange: 'NSE', price: 446.85, change: 8.85, percent: 2.02, status: 'Top Gainer', open: 438.00, high: 446.85, low: 438.00, close: 446.85 },
    { symbol: 'INFY', exchange: 'NSE', price: 1391.20, change: 25.60, percent: 1.87, status: 'Active Vol â€¢ Active Val â€¢ +1 More', open: 1365.60, high: 1391.20, low: 1365.60, close: 1391.20 },
    { symbol: 'BAJFINANCE', exchange: 'NSE', price: 1020.00, change: 5.85, percent: 0.58, status: '', open: 1014.15, high: 1020.00, low: 1014.15, close: 1020.00 },
    { symbol: 'ADANIENT', exchange: 'NSE', price: 2235.90, change: -7.00, percent: -0.31, status: 'Top Gainer â€¢ Open = Low', open: 2242.90, high: 2242.90, low: 2235.90, close: 2235.90 },
    { symbol: 'SUNPHARMA', exchange: 'NSE', price: 1720.40, change: 3.30, percent: 0.19, status: '', open: 1717.10, high: 1720.40, low: 1717.10, close: 1720.40 },
    { symbol: 'JSWSTEEL', exchange: 'NSE', price: 1251.90, change: 7.30, percent: 0.59, status: '', open: 1244.60, high: 1251.90, low: 1244.60, close: 1251.90 },
    { symbol: 'HDFCBANK', exchange: 'NSE', price: 921.65, change: -4.05, percent: -0.44, status: 'Active Vol â€¢ Active Val', open: 925.70, high: 925.70, low: 921.65, close: 921.65 },
    { symbol: 'TCS', exchange: 'NSE', price: 2718.00, change: 0.60, percent: 0.02, status: '', open: 2717.40, high: 2718.00, low: 2717.40, close: 2718.00 },
    { symbol: 'ICICIBANK', exchange: 'NSE', price: 1407.20, change: -0.30, percent: -0.02, status: 'Active Val', open: 1407.50, high: 1407.50, low: 1407.20, close: 1407.20 },
    { symbol: 'POWERGRID', exchange: 'NSE', price: 300.20, change: -0.55, percent: -0.18, status: '', open: 300.75, high: 300.75, low: 300.20, close: 300.20 },
    { symbol: 'MARUTI', exchange: 'NSE', price: 15134.00, change: -45.00, percent: -0.30, status: '', open: 15179.00, high: 15179.00, low: 15134.00, close: 15134.00 },
    { symbol: 'AXISBANK', exchange: 'NSE', price: 1359.90, change: 2.70, percent: 0.20, status: '', open: 1357.20, high: 1359.90, low: 1357.20, close: 1359.90 },
    { symbol: 'HCLTECH', exchange: 'NSE', price: 1475.50, change: -7.10, percent: -0.48, status: '', open: 1482.60, high: 1482.60, low: 1475.50, close: 1475.50 },
    { symbol: 'ONGC', exchange: 'NSE', price: 263.50, change: -8.35, percent: -3.07, status: 'Open = High', open: 271.85, high: 271.85, low: 263.50, close: 263.50 },
    { symbol: 'NTPC', exchange: 'NSE', price: 367.75, change: -0.65, percent: -0.18, status: '', open: 368.40, high: 368.40, low: 367.75, close: 367.75 },
    { symbol: 'COALINDIA', exchange: 'NSE', price: 413.60, change: -7.95, percent: -1.89, status: '', open: 421.55, high: 421.55, low: 413.60, close: 413.60 },
    { symbol: 'BHARTIARTL', exchange: 'NSE', price: 2022.00, change: 1.70, percent: 0.08, status: '', open: 2020.30, high: 2022.00, low: 2020.30, close: 2022.00 },
    { symbol: 'TECHM', exchange: 'NSE', price: 1510.00, change: -13.80, percent: -0.91, status: '', open: 1523.80, high: 1523.80, low: 1510.00, close: 1510.00 },
    { symbol: 'JIOFIN', exchange: 'NSE', price: 263.70, change: 1.40, percent: 0.53, status: '', open: 262.30, high: 263.70, low: 262.30, close: 263.70 },
    { symbol: 'ADANIPORTS', exchange: 'NSE', price: 1544.70, change: -21.60, percent: -1.38, status: '', open: 1566.30, high: 1566.30, low: 1544.70, close: 1544.70 },
    { symbol: 'HDFCLIFE', exchange: 'NSE', price: 706.75, change: 0.95, percent: 0.13, status: '', open: 705.80, high: 706.75, low: 705.80, close: 706.75 },
    { symbol: 'SBILIFE', exchange: 'NSE', price: 2037.50, change: -2.00, percent: -0.10, status: '', open: 2039.50, high: 2039.50, low: 2037.50, close: 2037.50 },
    { symbol: 'MAXHEALTH', exchange: 'NSE', price: 1077.15, change: 1.00, percent: 0.09, status: '', open: 1076.15, high: 1077.15, low: 1076.15, close: 1077.15 },
    { symbol: 'ULTRACEMCO', exchange: 'NSE', price: 13042.00, change: 58.00, percent: 0.45, status: '', open: 12984.00, high: 13042.00, low: 12984.00, close: 13042.00 },
    { symbol: 'BAJAJ-AUTO', exchange: 'NSE', price: 9825.00, change: -1.50, percent: -0.02, status: '', open: 9826.50, high: 9826.50, low: 9825.00, close: 9825.00 },
    { symbol: 'BAJAJFINSV', exchange: 'NSE', price: 2055.70, change: 11.30, percent: 0.55, status: '', open: 2044.40, high: 2055.70, low: 2044.40, close: 2055.70 },
    { symbol: 'BRITANNIA', exchange: 'NSE', price: 0, change: 14.30, percent: 0.70, status: '', open: 0, high: 0, low: 0, close: 0 },
    { symbol: 'INDIGO', exchange: 'NSE', price: 4978.00, change: 1.00, percent: 0.02, status: '', open: 4977.00, high: 4978.00, low: 4977.00, close: 4978.00 },
    { symbol: 'ETERNAL', exchange: 'NSE', price: 281.15, change: -0.35, percent: -0.12, status: 'Active Vol â€¢ Top Loser â€¢ +1 More', open: 281.50, high: 281.50, low: 281.15, close: 281.15 },
  ];

  const currentStock = useMemo(() => {
    const allItems = [...indices, ...stocks];
    return allItems.find(item => item.symbol === selectedStock) || stocks[0];
  }, [selectedStock]);

  const generateRealisticCandles = (basePrice: number, timeframe: string) => {
    const candles = [];
    let currentPrice = basePrice;
    
    // Adjust data points and time intervals based on timeframe
    const timeframeConfig = {
      '1D': { points: 78, interval: 5, unit: 'minutes' }, // 5-minute intervals for 1 day
      '5D': { points: 100, interval: 30, unit: 'minutes' }, // 30-minute intervals for 5 days
      '1M': { points: 30, interval: 1, unit: 'days' }, // Daily for 1 month
      '3M': { points: 90, interval: 1, unit: 'days' }, // Daily for 3 months
      '6M': { points: 120, interval: 1, unit: 'days' }, // Daily for 6 months
      '1Y': { points: 52, interval: 1, unit: 'weeks' }, // Weekly for 1 year
      '5Y': { points: 60, interval: 1, unit: 'months' }, // Monthly for 5 years
      'All': { points: 120, interval: 1, unit: 'months' } // Monthly for all time
    };
    
    const config = timeframeConfig[timeframe as keyof typeof timeframeConfig] || timeframeConfig['1D'];
    
    for (let i = 0; i < config.points; i++) {
      const volatility = basePrice * (timeframe === '1D' ? 0.002 : timeframe === '5D' ? 0.005 : 0.01);
      const trend = Math.sin(i / 10) * (basePrice * (timeframe === '1D' ? 0.005 : 0.02));
      const noise = (Math.random() - 0.5) * volatility;
      
      const open = currentPrice;
      const close = currentPrice + trend + noise;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      
      let timeLabel = '';
      if (config.unit === 'minutes') {
        const totalMinutes = 9 * 60 + i * config.interval; // Start from 9:00 AM
        const hour = Math.floor(totalMinutes / 60);
        const min = totalMinutes % 60;
        timeLabel = `${hour}:${min.toString().padStart(2, '0')}`;
      } else if (config.unit === 'days') {
        const date = new Date();
        date.setDate(date.getDate() - (config.points - i));
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (config.unit === 'weeks') {
        const date = new Date();
        date.setDate(date.getDate() - (config.points - i) * 7);
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() - (config.points - i));
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
      
      candles.push({
        time: timeLabel,
        price: close,
        volume: Math.floor(10000 + Math.random() * 50000)
      });
      
      currentPrice = close;
    }
    
    return candles;
  };

  const chartData = useMemo(() => generateRealisticCandles(currentStock.price, selectedTimeframe), [currentStock.price, selectedTimeframe]);

const [activeSection, setActiveSection] = useState(
  (location.state as any)?.section || 'home'
);

useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissions = JSON.parse(localStorage.getItem('tradingFeedback') || '[]');
    submissions.push({ ...feedbackData, submittedAt: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('tradingFeedback', JSON.stringify(submissions));
    setShowFeedback(false);
    setShowSuccess(true);
    setFeedbackData({ subject: '', description: '' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTop = () => { if (contentRef.current) contentRef.current.scrollTop = 0; };

  const Navbar = () => (
    <nav className="w-full flex items-center justify-between px-8 py-3 sticky top-0 z-50" style={{ background: '#1a3a7a' }}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          <img src="/logo.png" alt="Lendrix" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight tracking-wide">Lendrix Ventech Trader's Lounge</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase">POWERED BY</p>
            <p className="text-[11px] font-extrabold tracking-[0.18em]" style={{ backgroundImage: 'linear-gradient(135deg, #33c9bc 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nuvama Wealth & Investment</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {(['home','about','services','blogs'] as const).map((sec) => (
          <span
            key={sec}
            onClick={() => { setActiveSection(sec); scrollTop(); }}
            className={`text-sm font-semibold cursor-pointer tracking-wide uppercase transition-colors pb-1 ${
              activeSection === sec ? 'text-white border-b-2 border-[#33c9bc]' : 'text-white/70 hover:text-white'
            } px-1`}
          >{sec}</span>
        ))}
      </div>
      <button
        className="text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors border border-[#33c9bc]/50 hover:bg-[#29a699]"
        onClick={openDematModal}
      >
        Open Free Demat
      </button>
    </nav>
  );


  const Footer = () => (
  <footer
    className="w-full py-14 px-8 text-white"
    style={{
      background:
        'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)',
    }}
  >
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* Logo + Tagline */}
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <img
              src="/logo.png"
              alt="Lendrix"
              className="w-11 h-11 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <p className="font-extrabold text-xl tracking-wide text-white">
                 Lendrix Ventech Private Limited
            </p>

            <p className="text-gray-200 text-sm mt-2 leading-relaxed">
              Empowering Entrepreneurs & Ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="font-bold mb-3">Address</p>
        <p className="text-white-200 text-sm leading-relaxed">
          502/5B, 5th Floor, Capital Park, Madhapur, Telangana -500081
        </p>
        <p className="text-white-600 text-sm mt-2">
          +91 9652019666
        </p>
        <p className="text-white-800 text-sm mt-1">
          contactus@lendrixventech.com
        </p>
      </div>

     {/* Quick Links */}
<div>
  <p className="font-bold mb-3 normal-case">Quick Links</p>
  <p className="text-white-200 text-sm mb-1 normal-case">Home</p>
  <p className="text-white-200 text-sm mb-1 normal-case">About</p>
  <p className="text-white-200 text-sm mb-1 normal-case">Services</p>
  <p className="text-white-200 text-sm mb-1 normal-case">Blogs</p>
</div>

      {/* Map */}
      <div>
        <p className="font-bold mb-3">Office Location</p>
        <div className="rounded-lg overflow-hidden w-full h-36">
          <iframe
            title="LENDRIX Footer Map"
            src="https://maps.google.com/maps?q=Kukatpally,Hyderabad&z=13&output=embed"
            className="w-full h-full border-0 block"
            loading="lazy"
          />
        </div>
      </div>

    </div>

    {/* Bottom Line */}
    <div className="max-w-6xl mx-auto border-t border-white-400 mt-10 pt-6 text-center text-white-200 text-xs">
      <p>All Rights Reserved © Lendrix Ventech Private Limited</p>
      <p>Design & Developed by Qualex Consulting India Pvt. Ltd.</p>
    </div>
  </footer>
);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />

      <div ref={contentRef} className="flex-1 overflow-y-auto">

        {/* --- UPDATED HERO SECTION WITH AUTO-ROTATING IMAGES & TEXT --- */}
        <section
          id="section-home"
          className={`relative w-full flex items-center justify-center text-center${activeSection !== 'home' ? ' hidden' : ''}`}
          style={{ minHeight: '92vh' }}
        >
          {/* Animated Background Images */}
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === heroIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              style={{
                background: `url(${slide.image}) center/cover no-repeat`,
              }}
            >
              <div className="absolute inset-0 bg-black/55" />
            </motion.div>
          ))}

          {/* Animated Content from Screenshots */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              className="relative z-10 px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-white text-sm tracking-[0.25em] uppercase mb-3">
                {heroSlides[heroIndex].topText}
              </p>
              <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                {heroSlides[heroIndex].mainHeading}
              </h1>
            <button
  onClick={() => {
    const el = document.getElementById('connect-with-us');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }}
  className="bg-gradient-to-r from-[#1a3a7a] to-[#29a699] hover:from-[#162f6a] hover:to-[#29a699] text-white px-10 py-3 rounded-full text-lg font-semibold transition-all shadow-lg"
>
  Contact Us
</button>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl z-20 hover:scale-110 transition-transform cursor-pointer">‹</button>
          <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl z-20 hover:scale-110 transition-transform cursor-pointer">›</button>
        </section>



        {/* Rest of sections (About, Services, etc.) from trade.txt [cite: 225-242] */}
        {/* —— ABOUT: Hero Section —— */}
{/* —— ABOUT: Hero Section —— */}
<section
  id="section-about"
  className={`w-full relative overflow-hidden ${
    activeSection !== 'about' ? 'hidden' : ''
  }`}
  style={{
    background: 'linear-gradient(135deg,#0f0c29 0%,#1a1a2e 50%,#16213e 100%)',
  }}
>
  <div className="max-w-7xl mx-auto px-8 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12">

    {/* LEFT IMAGE (Dummy Professional Person) */}
    <div className="flex-1 flex justify-center">
      <img
        src="img2.png"
        alt="Professional"
        className="w-full max-w-md object-contain"
      />
    </div>

    {/* RIGHT CONTENT */}
    <div className="flex-1 text-white">

      {/* SMALL HEADING */}
      <p className="text-gray-400 mb-2 text-lg tracking-wide">
        About Us
      </p>

      {/* MAIN HEADING */}
      <h2 className="text-5xl font-extrabold mb-6 leading-tight">
        Lendrix Ventech Pvt. Ltd.
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-300 leading-relaxed mb-4">
        More than a Trader’s Lounge, we strive to be your trusted partner in your financial journey. Lendrix Ventech Private Limited, founded by 
        <strong> Mr. Deepak Dash</strong> brings market experience 2008.
      </p>

      <p className="text-gray-300 leading-relaxed mb-8">
        From the <strong>physical era of stock trading</strong> to today's<strong> digital transformation</strong>, 
        we provide technology-driven tools, market insights, and seamless support to help clients make informed investment decisions.
      </p>

      <p className="text-gray-300 leading-relaxed mb-8">
        From the physical era of stock trading to today's digital transformation,
        we provide technology-driven tools, market insights, and seamless support to help clients make informed investment decisions.
      </p>

      {/* BUTTON WITH REDIRECT */}
      <button
  className="bg-[#29a699] hover:bg-[#29a699] text-white px-8 py-3 rounded-full font-semibold transition"
>
  Try Now
</button>

    </div>
  </div>
</section>

      {/* Managing Director's Message */}
      <section className={`w-full bg-[#141e33] py-16 md:py-20 px-8${activeSection !== 'about' ? ' hidden' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
          <div className="text-white flex-1">
            <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase mb-3">From the Desk of</p>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">Managing Director</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Great institutions are built on the lessons of adversity. My own journey in the financial markets began during the severe turbulence of the <strong className="text-white">2008 financial crisis</strong>. Starting my career on the banking frontlines at <strong className="text-white">HSBC</strong>, and executing my first trades without even owning a demat account, taught me the fundamental mechanics of the market from the ground up.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Since those early days, I have witnessed a tectonic shift in our industry. We have transitioned from a slow, paper-heavy physical market to a hyper-efficient digital powerhouse. Yet, while the speed of transactions has changed, the core principles of wealth creation remain absolute: <strong className="text-white">discipline, patience, and strategic foresight</strong>.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              The market is a profound equalizer, uniquely designed to transfer wealth from the impatient to the patient. Navigating it successfully requires more than just capital; it requires a <strong className="text-white">trusted partner</strong>.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Backed by decades of hard-won financial expertise, <strong className="text-white">Lendrix Ventech</strong> was founded on a singular promise. We are here to provide a secure, 360-degree ecosystem where investors can grow their capital with absolute confidence.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              We are not here to chase fleeting market trends; we are here to help you plant the seeds of <strong className="text-white">long-term, sustainable wealth</strong>.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Join us to build your legacy. Start your journey on a trusted platform for sustainable financial growth.
            </p>
            <div className="border-t border-indigo-400/30 pt-5">
              <p className="text-white font-bold text-base">Managing Director,</p>
              <p className="text-indigo-300 font-semibold text-lg">Deepak Dash</p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-[420px]">
            <img
              src="/deepak01.jpeg"
              alt="Managing Director"
              className="rounded-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why Choose LENDRIX â€” purple gradient */}
      <section className={`w-full py-16 md:py-20 px-8${activeSection !== 'about' ? ' hidden' : ''}`} style={{background:'linear-gradient(135deg,#0f0c29 0%,#1a1a2e 50%,#16213e 100%)'}}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-white flex-1">
            <p className="text-indigo-200 font-semibold mb-1">Why Choose</p>
            <h2 className="text-4xl font-extrabold mb-8">Lendrix Ventech?</h2>
            {[
              {title:'Three Decades of Expertise:',desc:'Backed by 30+ years of market experience.'},
              {title:'Patience and Discipline:',desc:'Core principles for achieving long-term success.'},
              {title:'Client-Centric Approach:',desc:'Tailored services to meet every investor\'s goals.'},
              {title:'Comprehensive Support:',desc:'From account setup to portfolio management, we are with you every step of the way.'},
            ].map((item,i) => (
              <div key={i} className={`flex items-start gap-4 py-4 ${i<3?'border-b border-indigo-400/40':''}`}>
                <span className="mt-0.5 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-sm text-white"><strong>{item.title}</strong> {item.desc}</p>
              </div>
            ))}
            <p className="text-white font-bold text-lg mt-10 leading-snug">
              Lendrix Ventech Pvt. Ltd. Turning your investments into wealth, one step at a time.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-[420px]">
            <img
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&h=500&fit=crop"
              alt="Why Choose"
              className="rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* â”€â”€ END ABOUT SECTIONS â”€â”€ */}

      {/* â”€â”€ SECTION 2: Build Wealth â”€â”€ */}
      <section className={`w-full py-16 md:py-20 px-8${activeSection !== 'home' ? ' hidden' : ''}`} style={{ background: 'linear-gradient(135deg, #f4f5f9 0%, #eef0f5 100%)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="relative flex-shrink-0 w-full md:w-[420px]">
            <img
              src="/indra.jpeg"
              alt="Founder"
              className="rounded-xl w-full object-cover"
            />
          </div>
          <div className="md:pl-10 mt-10 md:mt-0" style={{ color: '#111827' }}>
            <h2 className="text-4xl font-extrabold mb-5 leading-tight">
              Build Wealth, Secure<br />Your Future with<br />Lendrix Ventech
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b7280' }}>
              At <strong style={{ color: '#1a3a7a' }}>Lendrix Ventech Pvt. Ltd.</strong>, we are driven by a mission to help you achieve your dreams of <strong style={{ color: '#1a3a7a' }}>financial freedom</strong>. We deliver exceptional financial services designed to grow your wealth securely and consistently.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280' }}>
              Serving clients across <strong style={{ color: '#1a3a7a' }}>Telangana, Andhra Pradesh</strong>, and <strong style={{ color: '#1a3a7a' }}>Karnataka</strong>, we combine industry expertise, cutting-edge tools like the <strong style={{ color: '#1a3a7a' }}>Co-branding Super App</strong>, and personalized support to create financial growth opportunities for everyone.
            </p>
            <button className="text-white px-8 py-3 rounded-full font-semibold transition-colors" style={{ background: 'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)' }}>
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* â”€â”€ SECTION 3: Why Choose â”€â”€ */}
      <section className={`w-full pt-12 pb-20 px-8${activeSection !== 'home' ? ' hidden' : ''}`} style={{ background: '#eef0f5' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0 w-full md:w-[420px]">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=420&fit=crop"
              alt="Group of people thumbs up"
              className="rounded-xl w-full object-cover"
            />
          </div>
          <div style={{ color: '#111827' }}>
            
            <h2 className="text-4xl font-extrabold mb-6">Why People Choose Us?</h2>
            {[
              {title: 'Financial Freedom for Everyone:', desc: 'From beginners to experienced investors, we create tailored strategies that align with your goals.' },
              {title: 'Trusted Expertise Since 1925:', desc: 'With over three decades of experience more than 16 years, we know how to turn your investments into long-term prosperity.' },
              {title: 'Secure & Transparent Investments:', desc: 'Your security is our priority. We ensure that your investments are protected and managed with complete transparency.' },
              {title: 'Co-branding Super App Support:', desc: 'Experience seamless trading with the best-in-class Co-branding Super App platform, empowering you to make smarter investment decisions.' },
              {title: 'Patience, Discipline, Success:', desc: 'We believe in steady growth, guiding you to stay disciplined for long-term financial success.' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-4 py-4 ${i < 4 ? 'border-b' : ''}`} style={{ borderColor: '#d8dce8' }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1a3a7a' }}>{item.title}</p>
                  <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   

      {/* Our Services â€” cards (2 cards only, no Portfolio Management) */}
      <section className={`w-full bg-[#141e33] py-16 md:py-20 px-8${activeSection !== 'services' ? ' hidden' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-white font-semibold text-center mb-4">Our Services</p>
          <p className="text-gray-300 text-center text-sm leading-relaxed mb-12 max-w-3xl mx-auto">
            At <strong className="text-white">Lendrix Ventech Pvt. Ltd.</strong>, we provide a comprehensive suite of financial services designed to help you achieve financial freedom and sustainable wealth creation. Catering to clients across Telangana, Andhra Pradesh, and Karnataka, our expertise and client-focused approach make us the trusted choice for all your investment and financial planning needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                ),
                label: 'Free Demat Account Opening',
              },
              {
                icon: (
                  <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                ),
                label: 'Stock Market Trading',
              },
            ].map((s, i) => (
              <div key={i}
                className="rounded-2xl flex flex-col items-center justify-center py-16 text-white text-xl font-bold gap-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)' }}
                onClick={openDematModal}
              >
                {s.icon}
                <span>{s.label}</span>
                <span className="absolute bottom-3 right-3 opacity-10">
                  <svg width="60" height="60" viewBox="0 0 40 40" fill="white"><path d="M20 4 L20 20 L6 28" strokeWidth="3" stroke="white" fill="none"/><path d="M20 4 L34 12 L20 20" strokeWidth="3" stroke="white" fill="none"/><path d="M20 20 L34 28" strokeWidth="3" stroke="white" fill="none"/><path d="M20 20 L6 12" strokeWidth="3" stroke="white" fill="none"/></svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose LENDRIX â€” dark with office image */}
      <section className={`w-full pt-12 pb-20 px-8${activeSection !== 'services' ? ' hidden' : ''}`} style={{ background: 'linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 100%)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="text-white flex-1">
            <p className="text-gray-400 font-semibold mb-1">Why Choose</p>
            <h2 className="text-4xl font-extrabold mb-8">Lendrix Ventech?</h2>
            {[
              { title: '30+ Years of Experience:', desc: 'Expertise across all market conditions.' },
              { title: 'Comprehensive Financial Solutions:', desc: 'From trading to insurance, we cover it all.' },
              { title: 'Secure Investments:', desc: 'Prioritizing transparency and reliability.' },
              { title: 'Regional Reach:', desc: 'Serving clients across Telangana, Andhra Pradesh, and Karnataka.' },
              { title: 'Focus on Patience and Discipline:', desc: 'Core values for sustainable wealth creation.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 py-4 ${i < 4 ? 'border-b border-gray-700' : ''}`}>
                <span className="mt-0.5 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </span>
                <p className="text-sm text-white"><strong>{item.title}</strong> {item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 w-full md:w-[480px]">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=450&fit=crop"
              alt="LENDRIX Office"
              className="rounded-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Your Financial Freedom Starts Here */}
      <section className={`w-full bg-[#f4f5f9] py-16 md:py-20 px-8${activeSection !== 'services' ? ' hidden' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0 w-full md:w-[480px]">
            <img
              src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&h=500&fit=crop"
              alt="Financial Freedom"
              className="rounded-2xl w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">Your Financial Freedom<br />Starts Here</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              At <strong className="text-gray-900">Lendrix Ventech Pvt. Ltd</strong>., we are dedicated to being your partner in achieving financial success. Explore our wide range of services and let us guide you on the path to growth and security.
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ 5paisa Partner Section (Home) â€” above testimonials â”€â”€ */}
   <section
  className={`w-full pt-10 pb-20 px-8 text-white text-center${activeSection !== 'home' ? ' hidden' : ''}`}
  style={{
    background: 'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)'
  }}
>
        <div className="max-w-4xl mx-auto">
          <p className="text-white-300 text-sm font-semibold mb-2">Our Trusted Partner</p>
          <h2 className="text-4xl font-extrabold mb-4">An Authorized Partner of</h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-white/10 px-8 py-4 rounded-2xl border border-white/20">
              
              <span className="text-4xl font-black tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #33c9bc 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nuvama Wealth {'&'} Investment</span>
            </div>
          </div>
          <p className="text-white-200 text-sm mb-8">India's leading discount broker Open your FREE Demat account today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
  onClick={openDematModal}
  className="bg-[#1a3a7a] hover:bg-[#162f6a] text-white px-10 py-3 rounded-full font-semibold transition-colors"
>
  Open Free Demat Account
</button>

<a
  href="https://www.nuvamawealth.com/login"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-[#29a699] hover:bg-[#29a699] text-white px-10 py-3 rounded-full font-semibold transition-colors"
>
  Start Stock Market Trading
</a>
          </div>
          <p className="text-white-200 text-sm mb-8">Scan the QR Code to open your account instantly</p>
          {/* Disclaimer below QR codes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Demat Account', sublabel: 'Free Opening', qrImg: '/qr-nuvama.png' },
              { label: 'Trading Account', sublabel: 'Flat ₹20/order', qrImg: '/qr-nuvama.png' },
              { label: 'Mutual Funds', sublabel: 'Zero Commission', qrImg: null },
            ].map((qr, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-gray-800 cursor-pointer hover:shadow-xl transition-shadow" onClick={i !== 2 ? openDematModal : undefined}>
                <p className="font-bold text-sm text-center mb-1 text-[#1a3a7a]">{qr.label}</p>
                <p className="text-xs text-center text-gray-400 mb-3">{qr.sublabel}</p>
                <div className="w-36 h-36 mx-auto bg-white border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center">
                  {qr.qrImg ? (
                    <img src={qr.qrImg} alt={`${qr.label} QR`} className="w-full h-full object-contain" />
                  ) : (
                    <svg viewBox="0 0 90 90" className="w-full h-full">
                      <rect x="2" y="2" width="24" height="24" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="6" y="6" width="16" height="16" fill="#000"/>
                      <rect x="64" y="2" width="24" height="24" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="68" y="6" width="16" height="16" fill="#000"/>
                      <rect x="2" y="64" width="24" height="24" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="6" y="68" width="16" height="16" fill="#000"/>
                      {[[32,2],[38,2],[44,2],[50,2],[32,8],[44,8],[50,8],[38,14],[44,14],[32,20],[50,20],[32,26],[38,26],[50,26],[2,32],[8,32],[20,32],[32,32],[44,32],[56,32],[62,32],[68,32],[80,32],[2,38],[14,38],[26,38],[38,38],[56,38],[68,38],[80,38],[2,44],[8,44],[20,44],[32,44],[50,44],[62,44],[74,44],[2,50],[14,50],[26,50],[44,50],[56,50],[68,50],[80,50],[2,56],[8,56],[20,56],[38,56],[50,56],[62,56],[74,56],[32,62],[44,62],[56,62],[68,62],[80,62],[32,68],[50,68],[62,68],[80,68],[38,74],[44,74],[56,74],[68,74],[32,80],[44,80],[56,80],[74,80],[80,80]].map(([x,y],idx) => (
                        <rect key={idx} x={x} y={y} width="5" height="5" fill="#000"/>
                      ))}
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Scan to open account</p>
              </div>
            ))}
          </div>
          {/* Disclaimers */}
          <div className="mt-10 border-t border-white/20 pt-6 text-left">
            <p className="text-xs font-bold mb-2 text-white-300 uppercase tracking-wide">Disclaimers</p>
            <p className="text-[11px] text-white-200 leading-relaxed">
              Standard warning: "Investments in securities market are subject to market risks, read all the related documents carefully before investing." "Mutual Fund investments are subject to market risks, read all scheme related documents carefully." Registration details: Capital Ltd., Registered Office: 4th Floor, Pinnacle Corporate Park, Near Ahura Centre, Mahakali Caves Road, Andheri East, Mumbai â€“ 400093. SEBI Regn. No.: INZ000010231 (BSE/NSE/MCX/NCDEX). CDSL Regn. No.: IN-DP-CDSL-374-2006. Research Analyst SEBI Regn. No.: INH000000010. Investment Adviser SEBI Regn. No.: INA000008172. AMFI Regn. No.: ARN-79007. Any specific security displayed is for educational purposes only and not a recommendation. Past performance is not indicative of future results. Brokerage will not exceed SEBI prescribed limits.
            </p>
          </div>
        </div>
      </section>

      {/* —— BLOGS SECTION —— */}
<section
  className={`w-full py-16 md:py-20 px-8 ${activeSection !== 'blogs' ? 'hidden' : ''}`}
  style={{ background: '#f4f5f9' }}
>
  <div className="max-w-6xl mx-auto text-center">

    {/* Heading */}
    <p className="text-indigo-600 font-semibold mb-2">Blogs</p>
    <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
      Learn Trading, Investing & Financial Growth
    </h2>

    {/* Blog Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {[
        {
          title: 'Stock Market Basics for Beginners',
          desc: 'Learn how to start investing in the stock market with simple steps and zero confusion.',
        },
        {
          title: 'Top Trading Strategies in 2026',
          desc: 'Explore proven strategies used by experts to maximize profits in trading.',
        },
        {
          title: 'Why You Need a Demat Account',
          desc: 'Understand the importance of demat accounts and how they simplify investing.',
        },
      ].map((blog, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 text-left shadow-md hover:shadow-2xl transition"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {blog.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {blog.desc}
          </p>

          <button
            onClick={openDematModal}
            className="text-indigo-600 font-semibold hover:underline"
          >
            
          </button>
        </div>
      ))}
    </div>

    {/* Extra Section (like Home/About style) */}
    <div className="mt-16 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Stay Ahead in the Market 📊
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        At Lendrix Ventech Trader’s Lounge, our blogs are designed to help you
        understand market trends, trading strategies, and investment planning.
        Whether you are a beginner or an experienced trader, our insights will
        help you make smarter financial decisions.
      </p>
    </div>

  </div>
</section>

      {/* SECTION 7: Testimonials  */}
      <section 
  className={`w-full py-16 md:py-20 px-8 bg-white ${activeSection !== 'home' ? ' hidden' : ''}`} 
  style={{ minHeight: '180px' }}
>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#1a3a7a] font-semibold mb-2">Feedback</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">What People Think About Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: '"Exceptional Services and Support"',
                body: '"I opened my free demat account with Lendrix Ventech, and the process was seamless. Their experience truly reflects in the way they guide clients. Their market insights have helped me diversify my portfolio effectively. Highly recommended for anyone in Telangana or Andhra Pradesh!"',
                name: 'Priyanka Shandilya K',
                location: 'CANADA',
              },
              {
                title: '"Outstanding Services for Overseas Investors"',
                body: '"As an NRI investor, I was looking for a reliable financial partner in India. Lendrix Ventech exceeded my expectations with their professional approach and deep understanding of the market. Their team made the process of investing from Dubai effortless."',
                name: 'Srinivas',
                location: 'SINGAPORE',
              },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-6 text-left text-white relative" style={{ background: 'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)' }}>
                <p className="font-bold mb-2">{t.title}</p>
                <p className="text-sm leading-relaxed italic opacity-90">{t.body}</p>
                <div className="absolute -bottom-4 left-8 w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '16px solid #1a3a7a' }} />
                <div className="mt-8">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/60 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* â”€â”€ CONTACT: Hero Banner â”€â”€ */}
      <section id="section-contact" className={`w-full relative overflow-hidden${activeSection !== 'contact' ? ' hidden' : ''}`} style={{ background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', minHeight: '180px' }}>
        <div className="max-w-6xl mx-auto px-8 py-16">
          <h1 className="text-white text-7xl font-extrabold">Contact</h1>
        </div>
      </section>

      {/* â”€â”€ CONTACT: Info + Business Hours â”€â”€ */}
      <section className={`w-full bg-[#141e33] py-20 px-8${activeSection !== 'contact' ? ' hidden' : ''}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
          <div className="flex-shrink-0 w-full md:w-[480px]">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=450&fit=crop"
              alt="LENDRIX Office"
              className="rounded-2xl w-full object-cover"
            />
          </div>
          <div className="text-white flex-1">
            <p className="text-gray-400 font-semibold mb-2">Contact Us</p>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Lendrix Ventech Pvt. Ltd.</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              We're here to assist you with all your investment and financial needs. Whether you're a beginner looking to start your journey or an experienced trader seeking expert insights, our team is ready to provide guidance and support.
            </p>
            <p className="text-white font-bold mb-4">Business Hours</p>
            <div className="w-full">
              {[
                { day: 'Monday-Friday', hours: '09:30 AM â€“ 06:00 PM', highlight: false },
                { day: 'Saturday', hours: '09:30 AM â€“ 02:00 PM', highlight: false },
                { day: 'Sunday', hours: 'Closed', highlight: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between px-4 py-3 text-sm border-b border-gray-700 ${
                  row.highlight ? 'bg-indigo-600 text-white rounded' : 'text-gray-300'
                }`}>
                  <span className="font-semibold">{row.day}</span>
                  <span>{row.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CONTACT: Get In Touch Form â”€â”€ */}
      <section className={`w-full py-16 md:py-20 px-8 relative overflow-hidden${activeSection !== 'contact' ? ' hidden' : ''}`}
        style={{ background: 'url(https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1600&h=900&fit=crop) center/cover no-repeat' }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          {/* Form */}
          <div className="flex-1 flex flex-col gap-4">
            <input className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded px-5 py-3 text-sm outline-none focus:border-indigo-400" placeholder="Your Full Name" />
            <input className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded px-5 py-3 text-sm outline-none focus:border-indigo-400" placeholder="Your Mobile Number" />
            <input className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded px-5 py-3 text-sm outline-none focus:border-indigo-400" placeholder="Your Email" />
            <input className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded px-5 py-3 text-sm outline-none focus:border-indigo-400" placeholder="Subject" />
            <textarea rows={4} className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded px-5 py-3 text-sm outline-none focus:border-indigo-400 resize-none" placeholder="Message" />
           <button className="w-full bg-[#1a3a7a] hover:bg-[#1a3a7a] text-white py-3 rounded font-semibold transition-colors">
  Send
</button>
          </div>
          {/* Contact Details */}
          <div className="flex-1 text-white">
            <h2 className="text-4xl font-extrabold mb-8">Get In Touch</h2>
            <div className="flex items-start gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <div>
                <p className="font-bold mb-1">Office Phone</p>
                <p className="text-gray-300 text-sm">+91 90000 00000</p>
                <p className="text-gray-300 text-sm"></p>
                <p className="text-gray-300 text-sm"></p>
              </div>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <div>
                <p className="font-bold mb-1">Office Email</p>
                <p className="text-gray-300 text-sm">LENDRIXVENTECH@gmail.com</p>
                <p className="text-gray-300 text-sm"><strong className="text-white">Support:</strong> support@LENDRIXVENTECH.in</p>
                <p className="text-gray-300 text-sm"><strong className="text-white">Info:</strong> info@LENDRIXVENTECH.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <div>
                <p className="font-bold mb-1">Our Office Address</p>
                <p className="text-gray-300 text-sm">Lendrix Ventech Pvt. Ltd. 502/5B, 5th floor, Capital Park, Madhapur, Telangana -500081</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CONTACT: Map â”€â”€ */}
      <section className={`w-full h-80${activeSection !== 'contact' ? ' hidden' : ''}`}>
        <iframe
          title="LENDRIX Office Map"
          src="https://maps.google.com/maps?q=Kukatpally,Hyderabad&z=15&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </section>

      {/* —— CONNECT WITH US (Bottom Section) —— */}
<section id="connect-with-us" className="w-full bg-[#f4f5f9] py-16 md:py-20 px-8">
  <div className="max-w-5xl mx-auto text-center">
    
    <h2 className="text-5xl font-extrabold text-black-700 mb-4 relative inline-block">
      Connect With Us
      <span className="block w-40 h-1 mx-auto mt-2 rounded-full" style={{background:'#1a3a7a'}}></span>
      <span className="block w-52 h-1 mx-auto mt-1 rounded-full" style={{background:'#29a69999'}}></span>
    </h2>

    <p className="text-gray-600 text-lg mt-6 leading-relaxed">
      Looking to open a free demat account, explore investment opportunities, or need
      assistance with the <strong>Co-branding Super App?</strong>
    </p>

    <p className="text-gray-500 mt-4">
      Drop by our office, contact us through phone or email, or send us a message on WhatsApp for instant support.
    </p>

    <p className="text-gray-700 font-semibold mt-6 mb-10">
      Lendrix Ventech Pvt. Ltd. – Your trusted partner in financial growth and security.
    </p>

    {/* Inputs */}
    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      <input
        className="border border-gray-300 rounded-full px-6 py-3 w-full md:w-64 outline-none focus:border-indigo-500"
        placeholder="Name"
      />
      <input
        className="border border-gray-300 rounded-full px-6 py-3 w-full md:w-64 outline-none focus:border-indigo-500"
        placeholder="Email"
      />
      <input
        className="border border-gray-300 rounded-full px-6 py-3 w-full md:w-64 outline-none focus:border-indigo-500"
        placeholder="Mobile"
      />

      <button className="text-white px-10 py-3 rounded-full font-semibold transition" style={{background:'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)'}}>
        Send
      </button>
    </div>

  </div>
</section>

      {/* â”€â”€ Footer â”€â”€ */}
      <footer
  className="w-full py-14 px-8 text-white"
  style={{
    background:
      'linear-gradient(135deg, #1a3a7a 0%, #29a699 100%)',
  }}
>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

    {/* ✅ Logo + Tagline */}
    <div className="flex items-start gap-3 col-span-1 md:col-span-2">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
        <img
          src="/logo.png"
          alt="Lendrix"
          className="w-9 h-9 object-contain"
        />
      </div>

      <div className="flex flex-col">
        <p className="font-extrabold text-lg tracking-wide text-white leading-tight">
          Lendrix Ventech Private Limited
        </p>

        <p className="text-indigo-200 text-sm mt-1 leading-snug">
          Empowering Entrepreneurs &amp; Ecosystem
        </p>
      </div>
    </div>

    {/* Address */}
    <div>
      <p className="font-bold mb-3">Address</p>
      <p className="text-indigo-200 text-sm leading-relaxed">
        502/5B, 5th Floor, Capital Park, Madhapur, Telangana -500081
      </p>
      <p className="text-indigo-200 text-sm mt-2">
        + 91 9652019666
      </p>
      <p className="text-indigo-200 text-sm mt-1">
        contactus@lendrixventech.com
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <p className="font-bold mb-3">Quick Links</p>
   {[
  { label: 'Home', sec: 'home' },
  { label: 'About', sec: 'about' },
  { label: 'Services', sec: 'services' },
  { label: 'Blogs', sec: 'blogs' }, // 
].map(({ label, sec }) => (
  <p
    key={label}
    onClick={() => {
      setActiveSection(sec as any);
      scrollTop();
    }}
    className={`cursor-pointer font-semibold transition ${
      activeSection === sec
        ? 'text-white' 
        : 'text-white/70 hover:text-white'
    }`}
  >
    {label}
  </p>
))}
    </div>

    {/* Map */}
    <div>
      <p className="font-bold mb-3">Office Location</p>
      <div className="rounded-lg overflow-hidden w-full h-36">
        <iframe
          title="LENDRIX Footer Map"
          src="https://maps.google.com/maps?q=Kukatpally,Hyderabad&z=13&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>

  </div>

  {/* Bottom */}
  <div className="max-w-6xl mx-auto border-t border-white-400 mt-10 pt-6 text-center text-indigo-200 text-xs">
    <p>© 2025 Lendrix Ventech Private Limited. All Rights Reserved. </p>
    <p>Design & Developed by Qualex Consulting India Pvt. Ltd.</p>
  </div>
</footer>
      </div>{/* end scrollable content */}

      {/* â”€â”€ Fixed Chat & Call Icons (bottom-right) â”€â”€ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat Popup */}
        {showChatPopup && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 mb-1 overflow-hidden">
           <div className="bg-[#1a3a7a] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </div>
                <span className="text-white font-semibold text-sm">Lendrix Ventech Support</span>
              </div>
              <button onClick={() => setShowChatPopup(false)} className="text-white/70 hover:text-white text-lg leading-none">X</button>
            </div>
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-xs text-gray-500">We're online</span>
              </div>
              <div className="bg-red-50 rounded-xl rounded-tl-none px-4 py-3">
                <p className="text-xs text-gray-500 mb-1">The team typically replies in a few minutes.</p>
                <p className="text-sm font-semibold text-gray-800">Lendrix Ventech Support</p>
                <p className="text-sm text-gray-600 mt-1">Hi there!‹ How can we help you today?</p>
              </div>
              <div className="mt-3 flex gap-2">
                <input className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-xs outline-none focus:border-indigo-400" placeholder="Type a message..." />
                <button className="w-8 h-8 bg-[#1a3a7a] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Chat Button */}
        <button
          onClick={() => setShowChatPopup(p => !p)}
          className="w-14 h-14 bg-[#1a3a7a] hover:bg-[#1a3a7a] rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </button>
        {/* Call Button */}
        <a
          href="tel:+919000000000"
          className="w-14 h-14 bg-teal-500 hover:bg-[#29a699] rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        </a>
      </div>

      {/* â”€â”€ EXISTING TRADING UI (hidden, kept intact) â”€â”€ */}
      <div className="hidden">
      <div className="mt-[80px] md:mt-[100px]">
        <div className="flex h-full overflow-hidden">
        <div className={`${viewMode === 'list' && selectedMiniStock ? 'w-[calc(100%-400px)]' : viewMode === 'list' ? 'flex-1' : 'w-[400px]'} border-r flex flex-col bg-white overflow-hidden transition-all`}>
          <div className="p-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div onClick={() => setSelectedStock('NIFTY 50')} className={`cursor-pointer hover:bg-gray-50 p-2 rounded ${selectedStock === 'NIFTY 50' ? 'bg-blue-50' : ''}`}>
                <div className="text-xs text-gray-500">Nifty 50 :</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">25,722.15</span>
                  <span className="text-xs text-red-600">-3.25 (-0.01%)</span>
                </div>
              </div>
              <div onClick={() => setSelectedStock('SENSEX')} className={`cursor-pointer hover:bg-gray-50 p-2 rounded ${selectedStock === 'SENSEX' ? 'bg-blue-50' : ''}`}>
                <div className="text-xs text-gray-500">SENSEX :</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">83,424.16</span>
                  <span className="text-xs text-red-600">-26.80 (-0.03%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Nifty 50</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="relative">
                <Settings className="w-4 h-4 cursor-pointer text-gray-600" onClick={() => setShowSettingsMenu(!showSettingsMenu)} />
                {showSettingsMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-xl w-64 z-50 max-h-96 overflow-y-auto">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-semibold border-b">Actions for Nifty 50</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Duplicate Nifty 50</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Settings for all watchlists</div>
                      <div className="px-4 py-2 text-sm font-semibold border-t mt-2">Sort by</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Clear</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Alphabetical<div className="text-xs text-gray-500">A to Z</div></div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">Change %<div className="text-xs text-gray-500">Highest to Lowest</div></div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">LTP Change<div className="text-xs text-gray-500">Highest to Lowest</div></div>
                      <div className="px-4 py-2 text-sm font-semibold border-t mt-2">Change View</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm" onClick={() => { setViewMode('chart'); setShowSettingsMenu(false); }}>Chart View</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm" onClick={() => { setViewMode('list'); setShowSettingsMenu(false); }}>List View</div>
                      <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-t">Today's Highlights</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <Input placeholder="Search Stocks, ETFs, Futures, Index" className="pl-9 text-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {viewMode === 'list' ? (
              <div className="bg-white">
                <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b bg-gray-50 text-xs font-semibold text-gray-600 sticky top-0">
                  <div>Company Name/Index</div>
                  <div className="text-right">LTP</div>
                  <div className="text-right">Chg</div>
                  <div className="text-right">Chg%</div>
                  <div className="text-right">Days High</div>
                  <div className="text-right">Days Low</div>
                  <div className="text-right">Prev Close</div>
                  <div className="text-right">52 Wk High/Low</div>
                </div>
                {stocks.map((stock) => (
                  <div key={stock.symbol} className="grid grid-cols-8 gap-4 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer text-sm" onClick={() => setSelectedMiniStock(stock.symbol)}>
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-xs text-gray-500">{stock.exchange}</div>
                      {stock.status && <div className="text-xs text-orange-600 mt-1">{stock.status}</div>}
                    </div>
                    <div className="text-right">{stock.price.toLocaleString()}</div>
                    <div className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.change >= 0 ? '+' : ''}{stock.change}</div>
                    <div className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>({stock.percent >= 0 ? '+' : ''}{stock.percent}%)</div>
                    <div className="text-right">{stock.high.toLocaleString()}</div>
                    <div className="text-right">{stock.low.toLocaleString()}</div>
                    <div className="text-right">{stock.close.toLocaleString()}</div>
                    <div className="text-right text-xs">-/-</div>
                  </div>
                ))}
              </div>
            ) : (
              stocks.map((stock) => (
                <div key={stock.symbol} className={`border-b cursor-pointer hover:bg-gray-50 ${selectedStock === stock.symbol ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                  <div className="p-3" onClick={() => { setSelectedStock(stock.symbol); setExpandedStock(expandedStock === stock.symbol ? null : stock.symbol); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-sm">{stock.symbol}</div>
                        <div className="text-xs text-gray-500">{stock.exchange}</div>
                        {stock.status && <div className="text-xs mt-1 text-orange-600">{stock.status}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{stock.price.toLocaleString()}</div>
                        <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.percent >= 0 ? '+' : ''}{stock.percent}%)
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedStock === stock.symbol && (
                    <div className="px-3 pb-3">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate('/login'); }} className="flex-1 bg-green-600 text-white text-sm py-2 rounded font-semibold hover:bg-green-700">B</button>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/login'); }} className="flex-1 bg-red-600 text-white text-sm py-2 rounded font-semibold hover:bg-red-700">S</button>
                        <button className="px-3 border rounded text-sm hover:bg-gray-50"><Layers className="w-4 h-4" /></button>
                        <button className="px-2 border rounded text-sm hover:bg-gray-50"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {viewMode === 'list' && selectedMiniStock && (
          <div className="w-[400px] border-l flex flex-col bg-white">
            <div className="p-3 border-b flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{stocks.find(s => s.symbol === selectedMiniStock)?.symbol}</div>
                <div className="text-sm text-gray-500">{stocks.find(s => s.symbol === selectedMiniStock)?.exchange}</div>
              </div>
              <X className="w-5 h-5 cursor-pointer text-gray-600" onClick={() => setSelectedMiniStock(null)} />
            </div>
            <div className="flex-1 p-4">
              <div className="text-2xl font-bold">{stocks.find(s => s.symbol === selectedMiniStock)?.price.toLocaleString()}</div>
              <div className={`text-sm ${stocks.find(s => s.symbol === selectedMiniStock)?.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stocks.find(s => s.symbol === selectedMiniStock)?.change >= 0 ? '+' : ''}{stocks.find(s => s.symbol === selectedMiniStock)?.change} ({stocks.find(s => s.symbol === selectedMiniStock)?.percent >= 0 ? '+' : ''}{stocks.find(s => s.symbol === selectedMiniStock)?.percent}%)
              </div>
              <div className="mt-4">
                <StockChartZoom 
                  data={generateRealisticCandles(stocks.find(s => s.symbol === selectedMiniStock)?.price || 0, '1D')}
                  currentPrice={stocks.find(s => s.symbol === selectedMiniStock)?.price || 0}
                  change={stocks.find(s => s.symbol === selectedMiniStock)?.change || 0}
                  changePercent={stocks.find(s => s.symbol === selectedMiniStock)?.percent || 0}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'chart' && (
          <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">{currentStock.symbol}</h1>
                <span className="text-3xl font-bold">{currentStock.price.toLocaleString()}</span>
                <span className={`text-lg ${currentStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStock.change >= 0 ? '+' : ''}{currentStock.change}({currentStock.percent >= 0 ? '+' : ''}{currentStock.percent}%)
                </span>
                <span className="text-sm text-gray-500">{currentStock.exchange}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-red-500 text-white rounded text-sm font-semibold">Chart</button>
                <button className="px-4 py-2 text-gray-600 rounded text-sm">Option Chain</button>
                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700">B</button>
                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700">S</button>
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Drawing Tools Sidebar */}
            <div className="w-14 border-r bg-white flex flex-col items-center py-4 gap-3">
              <button onClick={() => setSelectedTool('cursor')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'cursor' ? 'bg-blue-50' : ''}`} title="Cursor">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('cross')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'cross' ? 'bg-blue-50' : ''}`} title="Crosshair">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('trendline')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'trendline' ? 'bg-blue-50' : ''}`} title="Trend Line">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="5" cy="19" r="2" />
                  <line x1="7" y1="17" x2="19" y2="5" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('horizontal')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'horizontal' ? 'bg-blue-50' : ''}`} title="Horizontal Line">
                <Minus className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('parallel')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'parallel' ? 'bg-blue-50' : ''}`} title="Parallel Channel">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('fibonacci')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'fibonacci' ? 'bg-blue-50' : ''}`} title="Fibonacci">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12 L9 6 L15 12 L21 6" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeDasharray="2 2" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('dotted')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'dotted' ? 'bg-blue-50' : ''}`} title="Dotted Line">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2">
                  <line x1="4" y1="12" x2="20" y2="12" />
                </svg>
              </button>
              <button onClick={() => setSelectedTool('brush')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'brush' ? 'bg-blue-50' : ''}`} title="Brush">
                <PenTool className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('text')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'text' ? 'bg-blue-50' : ''}`} title="Text">
                <Type className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('emoji')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'emoji' ? 'bg-blue-50' : ''}`} title="Emoji">
                <Smile className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('measure')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'measure' ? 'bg-blue-50' : ''}`} title="Measure">
                <Ruler className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('zoom')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'zoom' ? 'bg-blue-50' : ''}`} title="Zoom">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('magnet')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'magnet' ? 'bg-blue-50' : ''}`} title="Magnet Mode">
                <Magnet className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('edit')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'edit' ? 'bg-blue-50' : ''}`} title="Edit">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => setSelectedTool('lock')} className={`p-2 rounded hover:bg-gray-100 ${selectedTool === 'lock' ? 'bg-blue-50' : ''}`} title="Lock">
                <Lock className="w-5 h-5" />
              </button>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
            <StockChartZoom 
              data={chartData}
              currentPrice={currentStock.price}
              change={currentStock.change}
              changePercent={currentStock.percent}
            />
            <div className="bg-white border-t px-4 py-2 flex gap-3 text-sm">
              {['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'All'].map((tf) => (
                <button key={tf} className={`px-2 py-1 ${selectedTimeframe === tf ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setSelectedTimeframe(tf)}>
                  {tf}
                </button>
              ))}
            </div>
            </div>
          </div>
          </div>
        )}
        </div>
      </div>
      </div>{/* end hidden */}

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject *</label>
              <Input
                required
                placeholder="Enter subject"
                value={feedbackData.subject}
                onChange={(e) => setFeedbackData({ ...feedbackData, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                required
                rows={5}
                placeholder="Describe your feedback..."
                value={feedbackData.description}
                onChange={(e) => setFeedbackData({ ...feedbackData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Submit</Button>
              <Button type="button" variant="outline" onClick={() => setShowFeedback(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Feedback Submitted!</h3>
              <p className="text-gray-600">Thank you for your feedback. We'll review it shortly.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradersLoungePage;









