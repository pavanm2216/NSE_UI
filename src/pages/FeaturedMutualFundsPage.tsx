import React, { useState } from 'react';
import { Share2, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const allEquityFunds = [
  { name: "BANDHAN SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "11.23%", y3: "30.73%", y5: "23.32%", aum: "20,129 Cr", exp: "1.62%" },
  { name: "NIPPON INDIA GROWTH MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "15.21%", y3: "26.42%", y5: "22.86%", aum: "39,676 Cr", exp: "1.52%" },
  { name: "EDELWEISS MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "12.95%", y3: "25.72%", y5: "21.25%", aum: "13,553 Cr", exp: "1.67%" },
  { name: "TATA MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "13.17%", y3: "21.94%", y5: "17.82%", aum: "4,992 Cr", exp: "1.83%" },
  { name: "HDFC FLEXI CAP FUND - (G)", cat: "Equity • Flexi Cap Fund", y1: "5.66%", y3: "20.71%", y5: "20.42%", aum: "91,334 Cr", exp: "1.34%" },
  { name: "JM FLEXICAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "-0.82%", y3: "19.1%", y5: "17.33%", aum: "4,504 Cr", exp: "1.84%" },
  { name: "EDELWEISS FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "7.49%", y3: "18.45%", y5: "15.56%", aum: "2,957 Cr", exp: "1.88%" },
  { name: "NIPPON INDIA LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "6.22%", y3: "17.76%", y5: "17.64%", aum: "46,520 Cr", exp: "1.47%" },
  { name: "HSBC SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "6.26%", y3: "16.99%", y5: "20.42%", aum: "13,881 Cr", exp: "1.70%" },
  { name: "DSP FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "3.22%", y3: "16.26%", y5: "12.98%", aum: "10,725 Cr", exp: "1.72%" },
  { name: "MIRAE ASSET LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "3.75%", y3: "12.35%", y5: "11.25%", aum: "35,342 Cr", exp: "1.52%" },
];

const allHybridFunds = [
  { name: "EDELWEISS BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "7.01%", y3: "12.43%", y5: "10.52%", aum: "12,234 Cr", exp: "1.68%" },
  { name: "DSP DYNAMIC ASSET ALLOCATION FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "5.74%", y3: "12.36%", y5: "8.88%", aum: "3,548 Cr", exp: "1.88%" },
  { name: "TATA BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "4.66%", y3: "10.24%", y5: "9.56%", aum: "8,725 Cr", exp: "1.73%" },
  { name: "EDELWEISS ARBITRAGE FUND – REGULAR (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.88%", y3: "7.01%", y5: "6.01%", aum: "14,413 Cr", exp: "1.07%" },
  { name: "ADITYA BIRLA SL ARBITRAGE FUND (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.91%", y3: "6.98%", y5: "5.91%", aum: "25,064 Cr", exp: "1.03%" },
  { name: "NIPPON INDIA ARBITRAGE FUND (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.78%", y3: "6.88%", y5: "5.88%", aum: "15,787 Cr", exp: "1.02%" },
  { name: "DSP MULTI ASSET ALLOCATION FUND -...", cat: "Hybrid • Multi Asset Allocation", y1: "24.33%", y3: "NA", y5: "NA", aum: "8,395 Cr", exp: "1.43%" },
];

const FeaturedMutualFundsPage = () => {
  const [activeTab, setActiveTab] = useState<'equity' | 'hybrid'>('equity');
  const [search, setSearch] = useState('');

  const data = activeTab === 'equity' ? allEquityFunds : allHybridFunds;
  const filtered = data.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a202c]">
      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6 flex gap-2">
          <Link to="/mutual-funds" className="hover:text-blue-900">Mutual Funds</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Featured Mutual Fund</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Featured Mutual <span className="text-slate-400 font-normal">Funds</span></h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b mb-6 text-lg font-semibold">
          <button onClick={() => setActiveTab('equity')} className={activeTab === 'equity' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Equity Funds</button>
          <button onClick={() => setActiveTab('hybrid')} className={activeTab === 'hybrid' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Hybrid Funds</button>
        </div>

        {/* Search & Filter */}
        <div className="flex justify-end mb-6 gap-3">
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="outline-none text-sm w-full"
            />
          </div>
          <button className="border rounded-lg p-2"><SlidersHorizontal className="w-5 h-5 text-gray-500" /></button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest border-b">
                <th className="pb-4 font-bold">Fund</th>
                <th className="pb-4 font-bold text-center">1Y</th>
                <th className="pb-4 font-bold text-center">3Y CAGR</th>
                <th className="pb-4 font-bold text-center">5Y CAGR</th>
                <th className="pb-4 font-bold text-center">AUM</th>
                <th className="pb-4 font-bold text-center">Exp</th>
                <th className="pb-4 font-bold text-center">Compare</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((fund, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-6">
                    <div className="font-bold text-sm text-gray-800">{fund.name}</div>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{fund.cat}</div>
                  </td>
                  <td className={`text-center font-bold ${fund.y1.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>{fund.y1}</td>
                  <td className="text-center font-bold text-green-500">{fund.y3}</td>
                  <td className="text-center font-bold text-green-500">{fund.y5}</td>
                  <td className="text-center font-bold text-gray-700">{fund.aum}</td>
                  <td className="text-center font-bold text-gray-700">{fund.exp}</td>
                  <td className="text-center"><input type="checkbox" className="w-4 h-4 accent-blue-900" /></td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-6">
                      <a href="https://lendrixventech.investwell.app" target="_blank" rel="noopener noreferrer" className="bg-blue-900 text-white px-8 py-2 rounded font-bold text-sm shadow-md">Invest</a>
                      <Share2 className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default FeaturedMutualFundsPage;
