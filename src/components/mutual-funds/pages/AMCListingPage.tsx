import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { AMC_LIST } from './MFDiscoveryDashboard';

const CATEGORIES = ['All', 'Large', 'Mid', 'Small'];

const AMCListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = AMC_LIST.filter(a =>
    (category === 'All' || a.category === category) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/dashboard/mf/discovery')} className="text-gray-400 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All AMCs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Select an AMC to explore its mutual fund schemes</p>
        </div>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search AMC..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === c ? 'bg-[#1a3a6b] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">{filtered.length} AMCs found</p>

      {/* AMC List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(amc => (
          <button
            key={amc.id}
            onClick={() => navigate(`/dashboard/mf/discovery/amc/${amc.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="text-4xl shrink-0">{amc.logo}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-blue-700 leading-tight">{amc.name}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-400">{amc.funds} funds</span>
                <span className="text-xs text-teal-600 font-medium">AUM {amc.aum}</span>
              </div>
              <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                amc.category === 'Large' ? 'bg-blue-100 text-blue-700' :
                amc.category === 'Mid'   ? 'bg-orange-100 text-orange-700' :
                                           'bg-gray-100 text-gray-600'
              }`}>
                {amc.category} AMC
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No AMCs found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default AMCListingPage;
