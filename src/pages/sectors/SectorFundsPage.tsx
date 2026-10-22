import React, { useState } from 'react';
import { Share2, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export type Fund = { name: string; cat: string; y1: string; y3: string; y5: string; aum: string; exp: string };

interface SectorFundsPageProps {
  title: string;
  titleHighlight: string;
  funds: Fund[];
}

const SectorFundsPage = ({ title, titleHighlight, funds }: SectorFundsPageProps) => {
  const [search, setSearch] = useState('');
  const filtered = funds.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white min-h-screen font-sans text-[#1a202c]">
      <main className="max-w-7xl mx-auto p-6">
        <div className="text-sm text-gray-400 mb-6 flex gap-2">
          <Link to="/mutual-funds" className="hover:text-blue-900">Mutual Funds</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">Sector Funds</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">
          {title} <span className="text-slate-400 font-normal">{titleHighlight}</span>
        </h1>

        <div className="flex justify-end mb-6 gap-3">
          <div className="flex items-center border rounded-lg px-3 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="outline-none text-sm w-full" />
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
          <p className="text-xs text-gray-400 mt-4">{filtered.length} funds shown</p>
        </div>
      </main>
    </div>
  );
};

export default SectorFundsPage;
