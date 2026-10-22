import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowLeft, Star, ArrowUpRight, X } from 'lucide-react';
import { AMC_LIST } from './MFDiscoveryDashboard';

// ── Mock fund data per AMC ────────────────────────────────────────────────────
const FUND_DB: Record<string, Fund[]> = {
  hdfc: [
    { name: 'HDFC Top 100 Fund',            category: 'Large Cap',  nav: '₹1,024.50', r1y: '+17.2%', r3y: '+13.8%', r5y: '+15.1%', aum: '₹32,450 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'HDFC Mid-Cap Opportunities',   category: 'Mid Cap',    nav: '₹112.80',   r1y: '+26.3%', r3y: '+21.4%', r5y: '+19.8%', aum: '₹28,700 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'HDFC Small Cap Fund',          category: 'Small Cap',  nav: '₹98.30',    r1y: '+29.1%', r3y: '+22.6%', r5y: '+20.4%', aum: '₹18,200 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'HDFC Balanced Advantage Fund', category: 'Hybrid',     nav: '₹452.10',   r1y: '+14.5%', r3y: '+12.2%', r5y: '+13.6%', aum: '₹62,100 Cr', minSip: '₹1,000', risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'HDFC Flexi Cap Fund',          category: 'Flexi Cap',  nav: '₹1,612.30', r1y: '+20.4%', r3y: '+16.9%', r5y: '+17.2%', aum: '₹41,800 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'HDFC Corporate Bond Fund',     category: 'Debt',       nav: '₹28.40',    r1y: '+7.8%',  r3y: '+6.4%',  r5y: '+7.1%',  aum: '₹28,900 Cr', minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  sbi: [
    { name: 'SBI Small Cap Fund',           category: 'Small Cap',  nav: '₹145.60',   r1y: '+31.5%', r3y: '+24.6%', r5y: '+22.1%', aum: '₹18,900 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Bluechip Fund',            category: 'Large Cap',  nav: '₹72.40',    r1y: '+16.8%', r3y: '+13.2%', r5y: '+14.5%', aum: '₹42,100 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Magnum Midcap Fund',       category: 'Mid Cap',    nav: '₹218.30',   r1y: '+24.7%', r3y: '+20.1%', r5y: '+18.9%', aum: '₹14,600 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI ELSS Tax Saver Fund',      category: 'ELSS',       nav: '₹312.80',   r1y: '+5.18%', r3y: '+21.97%',r5y: '+18.82%',aum: '₹28,441 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Magnum Gilt Fund',         category: 'Debt',       nav: '₹1,156.40', r1y: '+8.2%',  r3y: '+7.1%',  r5y: '+7.8%',  aum: '₹22,300 Cr', minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Magnum Income Fund',       category: 'Debt',       nav: '₹1,248.50', r1y: '+7.5%',  r3y: '+6.8%',  r5y: '+7.2%',  aum: '₹18,900 Cr', minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Large and Midcap Fund',    category: 'Large & Mid',nav: '₹156.80',   r1y: '+23.4%', r3y: '+19.2%', r5y: '+18.6%', aum: '₹16,200 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Long Term Equity Fund',    category: 'Large Cap',  nav: '₹89.20',    r1y: '+17.8%', r3y: '+14.6%', r5y: '+15.2%', aum: '₹12,100 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Consumption Opportunities',category: 'Sectoral',   nav: '₹124.60',   r1y: '+19.3%', r3y: '+16.8%', r5y: '+17.4%', aum: '₹8,900 Cr',  minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Technology Opportunities', category: 'Sectoral',   nav: '₹98.40',    r1y: '+25.6%', r3y: '+22.1%', r5y: '+20.8%', aum: '₹7,600 Cr',  minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Healthcare Opportunities', category: 'Sectoral',   nav: '₹112.30',   r1y: '+21.4%', r3y: '+18.9%', r5y: '+19.2%', aum: '₹6,800 Cr',  minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Contra Fund',              category: 'Flexi Cap',  nav: '₹142.70',   r1y: '+20.8%', r3y: '+17.6%', r5y: '+18.3%', aum: '₹9,200 Cr',  minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Focused Equity Fund',      category: 'Large Cap',  nav: '₹156.40',   r1y: '+18.6%', r3y: '+15.2%', r5y: '+16.1%', aum: '₹11,300 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Conservative Hybrid Fund', category: 'Hybrid',     nav: '₹234.50',   r1y: '+10.2%', r3y: '+9.1%',  r5y: '+9.8%',  aum: '₹14,600 Cr', minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Flexicap Fund',            category: 'Flexi Cap',  nav: '₹178.90',   r1y: '+21.3%', r3y: '+18.4%', r5y: '+19.1%', aum: '₹13,400 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Multi Asset Allocation',   category: 'Hybrid',     nav: '₹198.60',   r1y: '+12.4%', r3y: '+11.2%', r5y: '+11.8%', aum: '₹10,200 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Savings Fund',             category: 'Debt',       nav: '₹1,089.30', r1y: '+6.8%',  r3y: '+6.2%',  r5y: '+6.5%',  aum: '₹8,700 Cr',  minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Credit Risk Fund',         category: 'Debt',       nav: '₹1,342.10', r1y: '+8.9%',  r3y: '+7.6%',  r5y: '+8.2%',  aum: '₹6,500 Cr',  minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Nifty Index Fund',         category: 'Index',      nav: '₹234.80',   r1y: '+16.4%', r3y: '+13.2%', r5y: '+14.8%', aum: '₹12,900 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'SBI Magnum Childrens Benefit', category: 'Hybrid',     nav: '₹156.20',   r1y: '+11.8%', r3y: '+10.4%', r5y: '+11.2%', aum: '₹5,600 Cr',  minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  mirae: [
    { name: 'Mirae Asset Large Cap Fund',   category: 'Large Cap',  nav: '₹98.45',    r1y: '+18.4%', r3y: '+14.2%', r5y: '+16.1%', aum: '₹32,450 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'Mirae Asset Emerging Bluechip',category: 'Large & Mid',nav: '₹124.60',   r1y: '+21.3%', r3y: '+17.8%', r5y: '+19.2%', aum: '₹28,100 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'Mirae Asset Tax Saver Fund',   category: 'ELSS',       nav: '₹38.20',    r1y: '+19.6%', r3y: '+16.4%', r5y: '+18.0%', aum: '₹18,200 Cr', minSip: '₹500',   risk: 'High',     stars: 5, plan: 'Direct', option: 'Growth' },
  ],
  paragparikh: [
    { name: 'Parag Parikh Flexi Cap Fund',  category: 'Flexi Cap',  nav: '₹74.12',    r1y: '+22.1%', r3y: '+19.8%', r5y: '+21.4%', aum: '₹52,100 Cr', minSip: '₹1,000', risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'Parag Parikh Tax Saver Fund',  category: 'ELSS',       nav: '₹28.40',    r1y: '+20.8%', r3y: '+18.2%', r5y: '+19.6%', aum: '₹4,200 Cr',  minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'Parag Parikh Liquid Fund',     category: 'Debt',       nav: '₹1,412.30', r1y: '+7.1%',  r3y: '+5.8%',  r5y: '+6.2%',  aum: '₹2,800 Cr',  minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  icici: [
    { name: 'ICICI Prudential Bluechip Fund', category: 'Large Cap', nav: '₹156.80',   r1y: '+17.4%', r3y: '+13.8%', r5y: '+15.2%', aum: '₹38,900 Cr', minSip: '₹500',   risk: 'Moderate', stars: 5, plan: 'Direct', option: 'Growth' },
    { name: 'ICICI Prudential ELSS Tax Saver', category: 'ELSS',     nav: '₹89.40',    r1y: '+19.2%', r3y: '+16.8%', r5y: '+17.6%', aum: '₹24,100 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'ICICI Prudential Focused Equity', category: 'Large Cap', nav: '₹142.30',   r1y: '+18.6%', r3y: '+15.4%', r5y: '+16.2%', aum: '₹18,600 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  aditya: [
    { name: 'Aditya Birla Sun Life ELSS Tax Saver', category: 'ELSS', nav: '₹124.50',   r1y: '+20.1%', r3y: '+17.4%', r5y: '+18.2%', aum: '₹16,800 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'Aditya Birla Sun Life Flexi Cap', category: 'Flexi Cap', nav: '₹98.70',    r1y: '+21.8%', r3y: '+18.6%', r5y: '+19.4%', aum: '₹22,400 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  franklin: [
    { name: 'Franklin India ELSS Tax Saver', category: 'ELSS',      nav: '₹156.40',   r1y: '+18.9%', r3y: '+16.2%', r5y: '+17.1%', aum: '₹14,200 Cr', minSip: '₹500',   risk: 'High',     stars: 4, plan: 'Direct', option: 'Growth' },
    { name: 'Franklin India Flexi Cap Fund', category: 'Flexi Cap',  nav: '₹112.80',   r1y: '+20.4%', r3y: '+17.2%', r5y: '+18.6%', aum: '₹18,900 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  ],
  shriram: [
    { name: 'Shriram Aggressive Hybrid Fund', category: 'Hybrid',    nav: '₹234.60',   r1y: '+15.8%', r3y: '+13.4%', r5y: '+14.2%', aum: '₹8,900 Cr',  minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  ],
};

// Default funds for AMCs not in DB
const DEFAULT_FUNDS = (amcName: string): Fund[] => [
  { name: `${amcName} Large Cap Fund`,  category: 'Large Cap', nav: '₹82.40',  r1y: '+16.2%', r3y: '+13.1%', r5y: '+14.8%', aum: '₹12,400 Cr', minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  { name: `${amcName} Mid Cap Fund`,    category: 'Mid Cap',   nav: '₹64.20',  r1y: '+22.4%', r3y: '+18.6%', r5y: '+17.2%', aum: '₹8,200 Cr',  minSip: '₹500',   risk: 'High',     stars: 3, plan: 'Direct', option: 'Growth' },
  { name: `${amcName} Flexi Cap Fund`,  category: 'Flexi Cap', nav: '₹48.10',  r1y: '+19.8%', r3y: '+15.4%', r5y: '+16.1%', aum: '₹6,800 Cr',  minSip: '₹500',   risk: 'Moderate', stars: 4, plan: 'Direct', option: 'Growth' },
  { name: `${amcName} ELSS Fund`,       category: 'ELSS',      nav: '₹38.60',  r1y: '+18.2%', r3y: '+14.8%', r5y: '+15.6%', aum: '₹4,100 Cr',  minSip: '₹500',   risk: 'High',     stars: 3, plan: 'Direct', option: 'Growth' },
  { name: `${amcName} Liquid Fund`,     category: 'Debt',      nav: '₹1,248.30',r1y: '+7.2%', r3y: '+6.1%',  r5y: '+6.8%',  aum: '₹3,200 Cr',  minSip: '₹500',   risk: 'Low',      stars: 4, plan: 'Direct', option: 'Growth' },
];

interface Fund {
  name: string; category: string; nav: string;
  r1y: string; r3y: string; r5y: string;
  aum: string; minSip: string; risk: string;
  stars: number; plan: string; option: string;
}

const RISK_COLOR: Record<string, string> = {
  Low:      'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  High:     'bg-red-100 text-red-700',
};

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'Hybrid', 'ELSS', 'Debt'];
const SORT_OPTIONS = ['Default', 'Returns: High to Low', 'Returns: Low to High', 'AUM: High to Low'];

const AMCFundsPage: React.FC = () => {
  const { amcId } = useParams<{ amcId: string }>();
  const navigate = useNavigate();

  const amc = AMC_LIST.find(a => a.id === amcId);
  const rawFunds = FUND_DB[amcId ?? ''] ?? DEFAULT_FUNDS(amc?.name ?? 'AMC');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Default');
  const [showFilters, setShowFilters] = useState(false);

  let funds = rawFunds.filter(f =>
    (category === 'All' || f.category === category) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sort === 'Returns: High to Low') funds = [...funds].sort((a, b) => parseFloat(b.r1y) - parseFloat(a.r1y));
  if (sort === 'Returns: Low to High') funds = [...funds].sort((a, b) => parseFloat(a.r1y) - parseFloat(b.r1y));
  if (sort === 'AUM: High to Low')     funds = [...funds].sort((a, b) => parseFloat(b.aum.replace(/[^0-9.]/g, '')) - parseFloat(a.aum.replace(/[^0-9.]/g, '')));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard/mf/discovery/amcs')} className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{amc?.logo}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{amc?.name ?? 'AMC'}</h1>
            <p className="text-sm text-gray-500">{amc?.funds} funds · AUM {amc?.aum}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search funds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm transition-colors ${showFilters ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Category pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c ? 'bg-[#1a3a6b] text-white' : 'border border-gray-300 text-gray-600 hover:bg-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">{funds.length} funds found</p>

      {/* Fund Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {funds.map(f => (
          <div
            key={f.name}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col hover:border-blue-300 hover:shadow-md transition-all"
          >
            {/* Top row */}
            <div className="flex items-start justify-between mb-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${RISK_COLOR[f.risk]}`}>{f.risk} Risk</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < f.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>

            <p className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">{f.name}</p>
            <p className="text-xs text-gray-400 mb-3">{f.category} · {f.plan} · {f.option}</p>

            {/* Returns grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[['1Y', f.r1y], ['3Y', f.r3y], ['5Y', f.r5y]].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-green-600">{val}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400">NAV · AUM</p>
                <p className="text-xs font-medium text-gray-700">{f.nav} · {f.aum}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/dashboard/mf/discovery/fund/${amcId}/${encodeURIComponent(f.name)}`)}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Details
                </button>
                <button
                  onClick={() => navigate(`/dashboard/mf/orders/purchase?name=${encodeURIComponent(f.name)}`)}
                  className="flex items-center gap-1 bg-[#1a3a6b] hover:bg-[#162f58] text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Buy <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {funds.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No funds found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AMCFundsPage;
