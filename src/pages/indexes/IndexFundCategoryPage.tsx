import React, { useState } from 'react';
import { Share2, Search, SlidersHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

type Fund = { name: string; cat: string; y1: string; y3: string; y5: string; aum: string; exp: string };

const allFunds: Record<string, { label: string; highlight: string; funds: Fund[] }> = {
  'nifty-50': {
    label: 'Nifty 50',
    highlight: 'Funds',
    funds: [
      { name: 'UTI-NIFTY 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.94%', y3: '12.12%', y5: '11.66%', aum: '24,433 Cr', exp: '0.32%' },
      { name: 'NAVI NIFTY 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.92%', y3: '12.07%', y5: 'NA', aum: '3,572 Cr', exp: '0.26%' },
      { name: 'HDFC NIFTY 50 INDEX FUND – REGULAR', cat: 'Other • Index Fund', y1: '2.84%', y3: '12.04%', y5: '11.55%', aum: '20,436 Cr', exp: '0.41%' },
      { name: 'DSP NIFTY 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.88%', y3: '12.03%', y5: '11.56%', aum: '909 Cr', exp: '0.40%' },
      { name: 'ICICI PRU NIFTY 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.91%', y3: '12.10%', y5: '11.62%', aum: '9,678 Cr', exp: '0.17%' },
      { name: 'SBI NIFTY INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.85%', y3: '12.01%', y5: '11.50%', aum: '6,789 Cr', exp: '0.20%' },
      { name: 'KOTAK NIFTY 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '2.87%', y3: '12.05%', y5: '11.53%', aum: '4,890 Cr', exp: '0.20%' },
    ],
  },
  'bank-nifty': {
    label: 'Nifty Bank',
    highlight: 'Funds',
    funds: [
      { name: 'ICICI PRU NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '4.16%', y3: '10.14%', y5: 'NA', aum: '611 Cr', exp: '0.76%' },
      { name: 'MOTILAL OSWAL NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.94%', y3: '10.03%', y5: '11.75%', aum: '577 Cr', exp: '0.99%' },
      { name: 'NAVI NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.91%', y3: '9.98%', y5: 'NA', aum: '557 Cr', exp: '0.90%' },
      { name: 'AXIS NIFTY BANK INDEX FUND – REGULAR (G)', cat: 'Other • Index Fund', y1: '3.9%', y3: 'NA', y5: 'NA', aum: '138 Cr', exp: '1.01%' },
      { name: 'NIPPON INDIA NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.88%', y3: '9.95%', y5: 'NA', aum: '420 Cr', exp: '0.85%' },
      { name: 'KOTAK NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.85%', y3: '9.90%', y5: 'NA', aum: '310 Cr', exp: '0.92%' },
      { name: 'HDFC NIFTY BANK INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.82%', y3: '9.87%', y5: 'NA', aum: '280 Cr', exp: '0.88%' },
    ],
  },
  'bse-sensex': {
    label: 'BSE Sensex',
    highlight: 'Funds',
    funds: [
      { name: 'ICICI PRU BSE SENSEX INDEX FUND (G)', cat: 'Other • Index Fund', y1: '0.73%', y3: '10.4%', y5: '10.85%', aum: '1,696 Cr', exp: '0.30%' },
      { name: 'UTI-BSE SENSEX INDEX FUND (G)', cat: 'Other • Index Fund', y1: '0.76%', y3: '10.39%', y5: 'NA', aum: '183 Cr', exp: '0.30%' },
      { name: 'HDFC BSE SENSEX INDEX FUND – REGULAR', cat: 'Other • Index Fund', y1: '0.64%', y3: '10.3%', y5: '10.79%', aum: '7,896 Cr', exp: '0.36%' },
      { name: 'NIPPON INDIA INDEX FUND – BSE SENSEX PLAN (G)', cat: 'Other • Index Fund', y1: '0.54%', y3: '10.14%', y5: '10.59%', aum: '849 Cr', exp: '0.49%' },
      { name: 'SBI BSE SENSEX INDEX FUND (G)', cat: 'Other • Index Fund', y1: '0.70%', y3: '10.35%', y5: '10.80%', aum: '1,200 Cr', exp: '0.32%' },
      { name: 'TATA BSE SENSEX INDEX FUND (G)', cat: 'Other • Index Fund', y1: '0.68%', y3: '10.28%', y5: 'NA', aum: '450 Cr', exp: '0.38%' },
      { name: 'MIRAE ASSET BSE SENSEX INDEX FUND (G)', cat: 'Other • Index Fund', y1: '0.65%', y3: '10.22%', y5: 'NA', aum: '320 Cr', exp: '0.35%' },
    ],
  },
  'midcap': {
    label: 'Midcap',
    highlight: 'Funds',
    funds: [
      { name: 'ADITYA BIRLA SL NIFTY MIDCAP 150 IF (G)', cat: 'Other • Index Fund', y1: '13.01%', y3: '23.1%', y5: '19.38%', aum: '386 Cr', exp: '0.97%' },
      { name: 'NIPPON INDIA NIFTY MIDCAP 150 INDEX FUND-REG (G)', cat: 'Other • Index Fund', y1: '13.18%', y3: '23.08%', y5: '19.29%', aum: '2,018 Cr', exp: '0.80%' },
      { name: 'MOTILAL OSWAL NIFTY MIDCAP 150 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '13.08%', y3: '23.06%', y5: '19.29%', aum: '2,900 Cr', exp: '1.00%' },
      { name: 'AXIS NIFTY MIDCAP 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '14.16%', y3: '24.19%', y5: 'NA', aum: '565 Cr', exp: '1.01%' },
      { name: 'EDELWEISS NIFTY MIDCAP150 MOMENTUM 50 IF (G)', cat: 'Other • Index Fund', y1: '8.98%', y3: '23.25%', y5: 'NA', aum: '1,333 Cr', exp: '1.11%' },
      { name: 'KOTAK NIFTY MIDCAP 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '13.05%', y3: '22.98%', y5: 'NA', aum: '780 Cr', exp: '0.95%' },
      { name: 'HDFC NIFTY MIDCAP 150 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '12.95%', y3: '22.85%', y5: '19.10%', aum: '1,450 Cr', exp: '0.90%' },
    ],
  },
  'small-cap': {
    label: 'Small Cap',
    highlight: 'Funds',
    funds: [
      { name: 'KOTAK NIFTY SMALLCAP 50 INDEX FUND – REG (G)', cat: 'Other • Index Fund', y1: '7.4%', y3: '25.09%', y5: 'NA', aum: '170 Cr', exp: '0.78%' },
      { name: 'ADITYA BIRLA SL NIFTY SMALLCAP 50 IF (G)', cat: 'Other • Index Fund', y1: '7.7%', y3: '24.9%', y5: '15.12%', aum: '234 Cr', exp: '1.04%' },
      { name: 'AXIS NIFTY SMALLCAP 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '7.65%', y3: '24.74%', y5: 'NA', aum: '512 Cr', exp: '1.02%' },
      { name: 'EDELWEISS NIFTY SMALLCAP 250 INDEX FUND-REG (G)', cat: 'Other • Index Fund', y1: '6.1%', y3: '21.15%', y5: 'NA', aum: '183 Cr', exp: '0.78%' },
      { name: 'NIPPON INDIA NIFTY SMALLCAP 250 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '6.45%', y3: '21.80%', y5: 'NA', aum: '2,345 Cr', exp: '0.30%' },
      { name: 'MOTILAL OSWAL NIFTY SMALLCAP 250 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '6.30%', y3: '21.50%', y5: 'NA', aum: '890 Cr', exp: '0.85%' },
      { name: 'HDFC NIFTY SMALLCAP 250 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '6.20%', y3: '21.30%', y5: 'NA', aum: '650 Cr', exp: '0.80%' },
    ],
  },
  'nifty-100': {
    label: 'Nifty 100',
    highlight: 'Funds',
    funds: [
      { name: 'BANDHAN NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.81%', y3: '13.36%', y5: 'NA', aum: '208 Cr', exp: '0.61%' },
      { name: 'HDFC NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.66%', y3: '13.17%', y5: 'NA', aum: '373 Cr', exp: '0.75%' },
      { name: 'AXIS NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.53%', y3: '13.04%', y5: '11.43%', aum: '1,791 Cr', exp: '0.92%' },
      { name: 'NIPPON INDIA NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.75%', y3: '13.25%', y5: 'NA', aum: '520 Cr', exp: '0.70%' },
      { name: 'MOTILAL OSWAL NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.70%', y3: '13.20%', y5: 'NA', aum: '410 Cr', exp: '0.68%' },
      { name: 'KOTAK NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.65%', y3: '13.10%', y5: 'NA', aum: '290 Cr', exp: '0.72%' },
      { name: 'UTI NIFTY 100 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '3.60%', y3: '13.05%', y5: 'NA', aum: '340 Cr', exp: '0.65%' },
    ],
  },
  'nifty-next-50': {
    label: 'Nifty Next 50',
    highlight: 'Funds',
    funds: [
      { name: 'DSP NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.74%', y3: '22.13%', y5: '15.4%', aum: '1,065 Cr', exp: '0.66%' },
      { name: 'UTI-NIFTY NEXT 50 INDEX FUND – REGULAR (G)', cat: 'Other • Index Fund', y1: '9.62%', y3: '22.05%', y5: '15.22%', aum: '5,550 Cr', exp: '0.80%' },
      { name: 'KOTAK NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.72%', y3: '22.01%', y5: '15.34%', aum: '853 Cr', exp: '0.49%' },
      { name: 'SBI NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.62%', y3: '22%', y5: 'NA', aum: '1,711 Cr', exp: '0.70%' },
      { name: 'HDFC NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.68%', y3: '21.95%', y5: '15.28%', aum: '3,678 Cr', exp: '0.20%' },
      { name: 'ICICI PRU NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.65%', y3: '21.90%', y5: '15.20%', aum: '4,123 Cr', exp: '0.19%' },
      { name: 'NIPPON INDIA NIFTY NEXT 50 INDEX FUND (G)', cat: 'Other • Index Fund', y1: '9.58%', y3: '21.85%', y5: 'NA', aum: '980 Cr', exp: '0.55%' },
    ],
  },
};

const IndexFundCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [search, setSearch] = useState('');

  const data = allFunds[category || ''];
  if (!data) return <div className="p-10 text-center text-gray-500">Category not found.</div>;

  const filtered = data.funds.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a202c]">
      <main className="max-w-7xl mx-auto p-6">
        <div className="text-sm text-gray-400 mb-6 flex gap-2">
          <Link to="/mutual-funds" className="hover:text-blue-900">Mutual Funds</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Index Funds</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">
          <span className="text-slate-800">{data.label}</span>{' '}
          <span className="text-slate-400 font-normal">{data.highlight}</span>
        </h1>
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
        <p className="text-xs text-gray-400 mt-4">{filtered.length} funds shown</p>
      </main>
    </div>
  );
};

export default IndexFundCategoryPage;
