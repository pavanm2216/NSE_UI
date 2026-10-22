import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart2, PieChart, ArrowUpRight, Star, ChevronRight } from 'lucide-react';

export const AMC_LIST = [
  { id: 'hdfc',        name: 'HDFC Mutual Fund',         logo: '🏦', funds: 42, aum: '₹6,82,000 Cr', category: 'Large' },
  { id: 'icici',       name: 'ICICI Prudential MF',      logo: '🏛️', funds: 38, aum: '₹5,94,000 Cr', category: 'Large' },
  { id: 'sbi',         name: 'SBI Mutual Fund',          logo: '🏢', funds: 35, aum: '₹5,12,000 Cr', category: 'Large' },
  { id: 'axis',        name: 'Axis Mutual Fund',         logo: '🔵', funds: 28, aum: '₹2,41,000 Cr', category: 'Large' },
  { id: 'mirae',       name: 'Mirae Asset MF',           logo: '🌏', funds: 22, aum: '₹1,98,000 Cr', category: 'Large' },
  { id: 'kotak',       name: 'Kotak Mahindra MF',        logo: '🔶', funds: 31, aum: '₹3,72,000 Cr', category: 'Large' },
  { id: 'nippon',      name: 'Nippon India MF',          logo: '🔴', funds: 36, aum: '₹3,28,000 Cr', category: 'Large' },
  { id: 'dsp',         name: 'DSP Mutual Fund',          logo: '🟦', funds: 24, aum: '₹1,42,000 Cr', category: 'Mid'   },
  { id: 'franklin',    name: 'Franklin Templeton MF',    logo: '🟠', funds: 18, aum: '₹98,000 Cr',   category: 'Mid'   },
  { id: 'paragparikh', name: 'Parag Parikh MF',          logo: '🟢', funds: 8,  aum: '₹82,000 Cr',   category: 'Mid'   },
  { id: 'uti',         name: 'UTI Mutual Fund',          logo: '🔷', funds: 29, aum: '₹2,86,000 Cr', category: 'Large' },
  { id: 'aditya',      name: 'Aditya Birla Sun Life MF', logo: '🌞', funds: 40, aum: '₹3,54,000 Cr', category: 'Large' },
  { id: 'tata',        name: 'Tata Mutual Fund',         logo: '🔵', funds: 26, aum: '₹1,62,000 Cr', category: 'Mid'   },
  { id: 'canara',      name: 'Canara Robeco MF',         logo: '🟡', funds: 20, aum: '₹1,12,000 Cr', category: 'Mid'   },
  { id: 'idfc',        name: 'IDFC Mutual Fund',         logo: '🟣', funds: 22, aum: '₹1,28,000 Cr', category: 'Mid'   },
  { id: 'invesco',     name: 'Invesco India MF',         logo: '🔸', funds: 16, aum: '₹72,000 Cr',   category: 'Small' },
  { id: 'motilal',     name: 'Motilal Oswal MF',         logo: '🟤', funds: 14, aum: '₹68,000 Cr',   category: 'Small' },
  { id: 'whiteoak',    name: 'WhiteOak Capital MF',      logo: '⚪', funds: 10, aum: '₹24,000 Cr',   category: 'Small' },
];

const TOP_FUNDS = [
  { name: 'Parag Parikh Flexi Cap Fund', amc: 'Parag Parikh MF', r1y: '+22.1%', r3y: '+19.8%', stars: 5, category: 'Flexi Cap', amcId: 'paragparikh' },
  { name: 'SBI Small Cap Fund',          amc: 'SBI MF',          r1y: '+31.5%', r3y: '+24.6%', stars: 4, category: 'Small Cap', amcId: 'sbi'         },
  { name: 'Mirae Asset Large Cap Fund',  amc: 'Mirae Asset MF',  r1y: '+18.4%', r3y: '+14.2%', stars: 5, category: 'Large Cap', amcId: 'mirae'       },
  { name: 'HDFC Mid-Cap Opportunities',  amc: 'HDFC MF',         r1y: '+26.3%', r3y: '+21.4%', stars: 4, category: 'Mid Cap',   amcId: 'hdfc'        },
];

const STATS = [
  { label: 'Total AMCs',      value: '44+',      icon: <BarChart2 className="w-5 h-5 text-blue-600" />,    bg: 'bg-blue-50'   },
  { label: 'Total Schemes',   value: '2,500+',   icon: <PieChart className="w-5 h-5 text-teal-600" />,     bg: 'bg-teal-50'   },
  { label: 'Avg. 3Y Returns', value: '+16.4%',   icon: <TrendingUp className="w-5 h-5 text-green-600" />,  bg: 'bg-green-50'  },
  { label: 'Min. SIP Amount', value: '₹500/mo',  icon: <ArrowUpRight className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
];

const MFDiscoveryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = AMC_LIST.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mutual Fund Discovery</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse AMCs, explore funds and start investing</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/mf/invest')}
          className="flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#162f58] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <TrendingUp className="w-4 h-4" /> My Investments
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search AMC by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* AMC Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">
            All AMCs <span className="text-gray-400 font-normal text-sm">({filtered.length})</span>
          </h2>
          <button
            onClick={() => navigate('/dashboard/mf/discovery/amcs')}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.slice(0, 12).map(amc => (
            <button
              key={amc.id}
              onClick={() => navigate(`/dashboard/mf/discovery/amc/${amc.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2">{amc.logo}</div>
              <p className="text-xs font-semibold text-gray-800 leading-tight group-hover:text-blue-700 line-clamp-2">{amc.name}</p>
              <p className="text-[11px] text-gray-400 mt-1">{amc.funds} funds</p>
              <p className="text-[11px] text-teal-600 font-medium">{amc.aum}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Top Performing Funds */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Top Performing Funds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOP_FUNDS.map(f => (
            <button
              key={f.name}
              onClick={() => navigate(`/dashboard/mf/discovery/fund/${f.amcId}/${encodeURIComponent(f.name)}`)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{f.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{f.amc} · {f.category}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < f.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">1Y / 3Y</p>
                <p className="text-sm font-bold text-green-600">{f.r1y} / {f.r3y}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MFDiscoveryDashboard;
