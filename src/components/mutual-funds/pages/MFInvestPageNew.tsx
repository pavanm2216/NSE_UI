import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Banknote,
  PieChart,
  Activity,
  Search,
  ChevronRight,
  Star,
  Filter,
  Grid3x3,
  List,
} from 'lucide-react';

const MFInvestPageNew: React.FC = () => {
  const [view, setView] = useState<'portfolio' | 'explore'>('portfolio');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Portfolio Data
  const portfolioData = {
    totalValue: 155000,
    totalInvested: 143000,
    totalReturns: 12000,
    returnPercentage: 8.4,
    activeFunds: 3,
    activeSIPs: 2,
  };

  const investments = [
    {
      id: 1,
      name: 'HDFC Top 100 Fund',
      amc: 'HDFC',
      category: 'Large Cap',
      currentValue: 50000,
      invested: 45000,
      returns: 5000,
      returnPercent: 11.1,
      units: 48.78,
      nav: 1024.50,
      logo: '🏦',
      rating: 5,
    },
    {
      id: 2,
      name: 'ICICI Prudential Bluechip',
      amc: 'ICICI',
      category: 'Large Cap',
      currentValue: 75000,
      invested: 70000,
      returns: 5000,
      returnPercent: 7.1,
      units: 479.49,
      nav: 156.42,
      logo: '🏛️',
      rating: 5,
    },
    {
      id: 3,
      name: 'SBI Small Cap Fund',
      amc: 'SBI',
      category: 'Small Cap',
      currentValue: 30000,
      invested: 28000,
      returns: 2000,
      returnPercent: 7.1,
      units: 205.48,
      nav: 145.60,
      logo: '🏢',
      rating: 4,
    },
  ];

  const exploreFunds = [
    { name: 'Axis Bluechip Fund', amc: 'Axis', category: 'Large Cap', nav: 892.45, return1y: 18.5, logo: '🔵' },
    { name: 'Kotak Standard Multicap', amc: 'Kotak', category: 'Multi Cap', nav: 456.78, return1y: 22.3, logo: '🔶' },
    { name: 'Mirae Asset Large Cap', amc: 'Mirae', category: 'Large Cap', nav: 98.45, return1y: 19.2, logo: '🌏' },
    { name: 'Nippon India Growth', amc: 'Nippon', category: 'Growth', nav: 234.56, return1y: 25.1, logo: '🔴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mutual Funds</h1>
              <p className="text-sm text-gray-500">Manage and grow your investments</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('portfolio')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'portfolio'
                    ? 'bg-[#0D3B66] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setView('explore')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  view === 'explore'
                    ? 'bg-[#0D3B66] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {view === 'portfolio' ? (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Main Card - Total Value */}
              <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-[#0D3B66] to-[#1a5a8f] p-8 text-white shadow-lg">
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Portfolio Value</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-bold">₹{(portfolioData.totalValue / 100000).toFixed(2)}L</p>
                    <p className="mt-2 text-sm text-blue-100">
                      Invested: ₹{(portfolioData.totalInvested / 100000).toFixed(2)}L
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-2 text-3xl font-bold text-emerald-300">
                      <TrendingUp className="h-8 w-8" />
                      +{portfolioData.returnPercentage}%
                    </p>
                    <p className="mt-1 text-sm text-emerald-200">
                      +₹{(portfolioData.totalReturns / 1000).toFixed(0)}K gains
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Funds</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">{portfolioData.activeFunds}</p>
                    </div>
                    <PieChart className="h-10 w-10 text-[#11B5E4]" />
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active SIPs</p>
                      <p className="mt-1 text-3xl font-bold text-gray-900">{portfolioData.activeSIPs}</p>
                    </div>
                    <Activity className="h-10 w-10 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 md:grid-cols-3">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0D3B66] px-6 py-3 font-semibold text-white transition hover:bg-[#092d4e] shadow-md">
                <Banknote className="h-5 w-5" />
                Invest More
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#11B5E4] px-6 py-3 font-semibold text-[#0D3B66] transition hover:bg-blue-50">
                <Activity className="h-5 w-5" />
                Start SIP
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
                <TrendingUp className="h-5 w-5" />
                View Reports
              </button>
            </div>

            {/* Your Investments */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Investments</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {investments.length} active funds in your portfolio
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {investments.map((fund) => (
                  <div
                    key={fund.id}
                    className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg hover:border-[#11B5E4]"
                  >
                    {/* Header */}
                    <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                            {fund.logo}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-600 uppercase">{fund.amc}</p>
                            <p className="text-xs text-gray-500">{fund.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < fund.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fund Name */}
                    <div className="border-b border-gray-100 px-5 py-4">
                      <h3 className="font-bold text-gray-900 line-clamp-2">{fund.name}</h3>
                      <p className="mt-2 text-xs text-gray-500">
                        {fund.units} units @ ₹{fund.nav.toFixed(2)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="p-5 space-y-4">
                      {/* Row 1 */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Amount Invested</span>
                        <span className="font-semibold text-gray-900">₹{fund.invested.toLocaleString()}</span>
                      </div>

                      {/* Row 2 */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Value</span>
                        <span className="text-lg font-bold text-gray-900">₹{fund.currentValue.toLocaleString()}</span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100" />

                      {/* Row 3 */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gain/Loss</span>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            +₹{fund.returns.toLocaleString()}
                          </p>
                          <p className="text-xs font-semibold text-emerald-600">
                            +{fund.returnPercent}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="border-t border-gray-100 p-5">
                      <button className="w-full rounded-lg bg-blue-50 py-2.5 text-sm font-semibold text-[#0D3B66] transition hover:bg-blue-100 flex items-center justify-center gap-2">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search and Filter */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search funds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-[#11B5E4] focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Multi Cap', 'Hybrid'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-[#0D3B66] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#11B5E4]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Explore Funds Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {exploreFunds.map((fund, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-[#11B5E4]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{fund.logo}</div>
                    <span className="text-xs font-bold text-gray-500 uppercase">{fund.amc}</span>
                  </div>

                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-3">{fund.name}</h3>

                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">NAV</span>
                      <span className="font-semibold text-gray-900">₹{fund.nav.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">1Y Return</span>
                      <span className="font-bold text-emerald-600">+{fund.return1y}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="text-sm font-semibold text-gray-700">{fund.category}</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-lg bg-[#0D3B66] py-2.5 text-sm font-semibold text-white transition hover:bg-[#092d4e]">
                    Invest Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MFInvestPageNew;
