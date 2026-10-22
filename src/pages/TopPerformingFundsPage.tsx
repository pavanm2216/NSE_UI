import React, { useState } from 'react';
import { Share2, Search, SlidersHorizontal, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

type Fund = { name: string; cat: string; y1: string; y3: string; y5: string; aum: string; exp: string };

const equityFunds: Fund[] = [
  { name: "INVESCO INDIA MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "15.79%", y3: "26.69%", y5: "21.49%", aum: "9,895 Cr", exp: "1.71%" },
  { name: "ICICI PRU MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "27.27%", y3: "26.68%", y5: "21.11%", aum: "6,568 Cr", exp: "1.85%" },
  { name: "WHITEOAK CAPITAL MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "18.45%", y3: "26.53%", y5: "NA", aum: "4,490 Cr", exp: "1.85%" },
  { name: "NIPPON INDIA GROWTH MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "15.21%", y3: "26.42%", y5: "22.86%", aum: "39,676 Cr", exp: "1.52%" },
  { name: "MOTILAL OSWAL MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "22.34%", y3: "25.91%", y5: "24.12%", aum: "18,604 Cr", exp: "1.68%" },
  { name: "EDELWEISS MID CAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "12.95%", y3: "25.72%", y5: "21.25%", aum: "13,553 Cr", exp: "1.67%" },
  { name: "HDFC MID-CAP OPPORTUNITIES FUND (G)", cat: "Equity • Mid Cap Fund", y1: "14.62%", y3: "25.44%", y5: "22.18%", aum: "78,012 Cr", exp: "1.41%" },
  { name: "KOTAK EMERGING EQUITY FUND (G)", cat: "Equity • Mid Cap Fund", y1: "13.87%", y3: "24.98%", y5: "20.76%", aum: "52,341 Cr", exp: "1.49%" },
  { name: "AXIS MIDCAP FUND (G)", cat: "Equity • Mid Cap Fund", y1: "11.23%", y3: "23.56%", y5: "19.84%", aum: "26,789 Cr", exp: "1.62%" },
  { name: "BANDHAN SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "11.23%", y3: "30.73%", y5: "23.32%", aum: "20,129 Cr", exp: "1.62%" },
  { name: "QUANT SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "19.45%", y3: "29.87%", y5: "28.43%", aum: "22,456 Cr", exp: "1.74%" },
  { name: "NIPPON INDIA SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "16.32%", y3: "28.54%", y5: "25.67%", aum: "61,234 Cr", exp: "1.48%" },
  { name: "HSBC SMALL CAP FUND (G)", cat: "Equity • Small Cap Fund", y1: "6.26%", y3: "16.99%", y5: "20.42%", aum: "13,881 Cr", exp: "1.70%" },
  { name: "HDFC FLEXI CAP FUND - (G)", cat: "Equity • Flexi Cap Fund", y1: "5.66%", y3: "20.71%", y5: "20.42%", aum: "91,334 Cr", exp: "1.34%" },
  { name: "PARAG PARIKH FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "8.92%", y3: "19.87%", y5: "21.34%", aum: "68,921 Cr", exp: "1.29%" },
  { name: "JM FLEXICAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "-0.82%", y3: "19.1%", y5: "17.33%", aum: "4,504 Cr", exp: "1.84%" },
  { name: "NIPPON INDIA LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "6.22%", y3: "17.76%", y5: "17.64%", aum: "46,520 Cr", exp: "1.47%" },
  { name: "MIRAE ASSET LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "3.75%", y3: "12.35%", y5: "11.25%", aum: "35,342 Cr", exp: "1.52%" },
  { name: "ICICI PRU BLUECHIP FUND (G)", cat: "Equity • Large Cap Fund", y1: "7.14%", y3: "16.43%", y5: "15.87%", aum: "58,234 Cr", exp: "1.38%" },
  { name: "TATA LARGE CAP FUND (G)", cat: "Equity • Large Cap Fund", y1: "5.43%", y3: "14.92%", y5: "13.56%", aum: "12,345 Cr", exp: "1.55%" },
  { name: "QUANT LARGE & MID CAP FUND (G)", cat: "Equity • Large & Mid Cap Fund", y1: "14.23%", y3: "24.56%", y5: "22.34%", aum: "8,765 Cr", exp: "1.78%" },
  { name: "MIRAE ASSET LARGE & MIDCAP FUND (G)", cat: "Equity • Large & Mid Cap Fund", y1: "9.87%", y3: "21.34%", y5: "19.87%", aum: "34,567 Cr", exp: "1.43%" },
  { name: "CANARA ROB EMERGING EQUITIES FUND (G)", cat: "Equity • Large & Mid Cap Fund", y1: "8.54%", y3: "20.12%", y5: "18.43%", aum: "23,456 Cr", exp: "1.56%" },
  { name: "QUANT MULTI ASSET FUND (G)", cat: "Equity • Multi Cap Fund", y1: "16.78%", y3: "26.34%", y5: "24.56%", aum: "5,678 Cr", exp: "1.82%" },
  { name: "NIPPON INDIA MULTI CAP FUND (G)", cat: "Equity • Multi Cap Fund", y1: "12.34%", y3: "22.87%", y5: "20.12%", aum: "28,901 Cr", exp: "1.51%" },
  { name: "HDFC MULTI CAP FUND (G)", cat: "Equity • Multi Cap Fund", y1: "10.56%", y3: "21.45%", y5: "NA", aum: "15,234 Cr", exp: "1.63%" },
  { name: "QUANT FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "18.92%", y3: "27.45%", y5: "25.67%", aum: "7,890 Cr", exp: "1.79%" },
  { name: "DSP FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "3.22%", y3: "16.26%", y5: "12.98%", aum: "10,725 Cr", exp: "1.72%" },
  { name: "EDELWEISS FLEXI CAP FUND (G)", cat: "Equity • Flexi Cap Fund", y1: "7.49%", y3: "18.45%", y5: "15.56%", aum: "2,957 Cr", exp: "1.88%" },
  { name: "TATA MID CAP FUND - (G)", cat: "Equity • Mid Cap Fund", y1: "13.17%", y3: "21.94%", y5: "17.82%", aum: "4,992 Cr", exp: "1.83%" },
];

const hybridFunds: Fund[] = [
  { name: "BANK OF INDIA MID & SMALL CAP EQUITY & DEBT FUND (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "12.86%", y3: "20.04%", y5: "17.74%", aum: "1,281 Cr", exp: "2.03%" },
  { name: "ICICI PRU EQUITY & DEBT FUND - (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "7.36%", y3: "18.64%", y5: "18.81%", aum: "46,700 Cr", exp: "1.52%" },
  { name: "JM AGGRESSIVE HYBRID FUND - (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "0.48%", y3: "17.3%", y5: "14.88%", aum: "651 Cr", exp: "2.34%" },
  { name: "QUANT ABSOLUTE FUND (G)", cat: "Hybrid • Aggressive Hybrid Fund", y1: "14.23%", y3: "22.45%", y5: "20.12%", aum: "2,345 Cr", exp: "1.92%" },
  { name: "HDFC BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "9.87%", y3: "18.34%", y5: "16.78%", aum: "89,234 Cr", exp: "1.38%" },
  { name: "EDELWEISS BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "7.01%", y3: "12.43%", y5: "10.52%", aum: "12,234 Cr", exp: "1.68%" },
  { name: "DSP DYNAMIC ASSET ALLOCATION FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "5.74%", y3: "12.36%", y5: "8.88%", aum: "3,548 Cr", exp: "1.88%" },
  { name: "TATA BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation or Balanced Advantage", y1: "4.66%", y3: "10.24%", y5: "9.56%", aum: "8,725 Cr", exp: "1.73%" },
  { name: "NIPPON INDIA BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "6.34%", y3: "13.56%", y5: "11.23%", aum: "7,890 Cr", exp: "1.71%" },
  { name: "KOTAK BALANCED ADVANTAGE FUND (G)", cat: "Hybrid • Dynamic Asset Allocation", y1: "5.12%", y3: "11.87%", y5: "10.34%", aum: "15,678 Cr", exp: "1.59%" },
  { name: "EDELWEISS ARBITRAGE FUND – REGULAR (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.88%", y3: "7.01%", y5: "6.01%", aum: "14,413 Cr", exp: "1.07%" },
  { name: "ADITYA BIRLA SL ARBITRAGE FUND (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.91%", y3: "6.98%", y5: "5.91%", aum: "25,064 Cr", exp: "1.03%" },
  { name: "NIPPON INDIA ARBITRAGE FUND (G)", cat: "Hybrid • Arbitrage Fund", y1: "5.78%", y3: "6.88%", y5: "5.88%", aum: "15,787 Cr", exp: "1.02%" },
  { name: "DSP MULTI ASSET ALLOCATION FUND (G)", cat: "Hybrid • Multi Asset Allocation", y1: "24.33%", y3: "NA", y5: "NA", aum: "8,395 Cr", exp: "1.43%" },
  { name: "ICICI PRU MULTI ASSET FUND (G)", cat: "Hybrid • Multi Asset Allocation", y1: "16.45%", y3: "19.87%", y5: "17.34%", aum: "45,678 Cr", exp: "1.47%" },
];

const taxFunds: Fund[] = [
  { name: "MOTILAL OSWAL ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "15.01%", y3: "24.84%", y5: "19.27%", aum: "3,968 Cr", exp: "1.82%" },
  { name: "SBI ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "5.18%", y3: "21.97%", y5: "18.82%", aum: "28,441 Cr", exp: "1.57%" },
  { name: "WHITEOAK CAPITAL ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "4.3%", y3: "19.55%", y5: "NA", aum: "402 Cr", exp: "2.33%" },
  { name: "QUANT ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "18.92%", y3: "28.45%", y5: "26.78%", aum: "9,234 Cr", exp: "1.79%" },
  { name: "BANDHAN ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "10.34%", y3: "22.67%", y5: "18.45%", aum: "5,678 Cr", exp: "1.68%" },
  { name: "MIRAE ASSET ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "7.56%", y3: "20.34%", y5: "17.89%", aum: "23,456 Cr", exp: "1.52%" },
  { name: "CANARA ROB ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "6.78%", y3: "19.87%", y5: "16.34%", aum: "8,901 Cr", exp: "1.61%" },
  { name: "AXIS ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "5.43%", y3: "18.23%", y5: "15.67%", aum: "34,567 Cr", exp: "1.58%" },
  { name: "KOTAK ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "8.12%", y3: "19.45%", y5: "16.78%", aum: "12,345 Cr", exp: "1.63%" },
  { name: "HDFC ELSS TAX SAVER FUND (G)", cat: "Equity • ELSS", y1: "9.34%", y3: "20.12%", y5: "17.45%", aum: "15,678 Cr", exp: "1.55%" },
];

const filterChips = ['Equity', 'Growth ×', 'Regular ×', 'AUM Size in Cr300 ×', 'Large Cap Fund ×', 'Mid Cap Fund ×', 'Multi Cap Fund ×', 'Large & Mid Cap Fund ×'];

const TopPerformingFundsPage = () => {
  const [activeTab, setActiveTab] = useState<'equity' | 'hybrid' | 'tax'>('equity');
  const [search, setSearch] = useState('');

  const dataMap = { equity: equityFunds, hybrid: hybridFunds, tax: taxFunds };
  const data = dataMap[activeTab];
  const filtered = data.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a202c]">
      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6 flex gap-2">
          <Link to="/mutual-funds" className="hover:text-blue-900">Mutual Funds</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Top Performing Funds</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Top Performing <span className="text-slate-400 font-normal">Funds</span></h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b mb-6 text-lg font-semibold">
          <button onClick={() => setActiveTab('equity')} className={activeTab === 'equity' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Equity Funds</button>
          <button onClick={() => setActiveTab('hybrid')} className={activeTab === 'hybrid' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Hybrid Funds</button>
          <button onClick={() => setActiveTab('tax')} className={activeTab === 'tax' ? 'text-blue-900 border-b-4 border-blue-900 pb-2' : 'text-gray-400 pb-2'}>Tax Saving Funds</button>
        </div>

        {/* Filter chips + Search */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex flex-wrap gap-2 flex-1">
            {filterChips.map((chip, i) => (
              <span key={i} className="px-3 py-1 border rounded-full text-xs font-semibold text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100">{chip}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg px-3 py-2 gap-2 w-52">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="outline-none text-sm w-full" />
            </div>
            <button className="border rounded-lg p-2"><SlidersHorizontal className="w-5 h-5 text-gray-500" /></button>
            <button className="border rounded-lg p-2"><Filter className="w-5 h-5 text-red-400" /></button>
          </div>
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
          <p className="text-xs text-gray-400 mt-4">{filtered.length} funds shown</p>
        </div>
      </main>
    </div>
  );
};

export default TopPerformingFundsPage;
