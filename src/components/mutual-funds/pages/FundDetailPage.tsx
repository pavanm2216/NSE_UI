import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Shield, TrendingUp, Info, ArrowUpRight, CheckCircle2, X, Loader2, AlertCircle } from 'lucide-react';
import { AMC_LIST } from './MFDiscoveryDashboard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ── Mock NAV chart data ───────────────────────────────────────────────────────
const NAV_CHART = [
  { month: 'Jan', nav: 62.4 }, { month: 'Feb', nav: 64.1 }, { month: 'Mar', nav: 63.8 },
  { month: 'Apr', nav: 66.2 }, { month: 'May', nav: 68.5 }, { month: 'Jun', nav: 70.1 },
  { month: 'Jul', nav: 69.4 }, { month: 'Aug', nav: 71.8 }, { month: 'Sep', nav: 73.2 },
  { month: 'Oct', nav: 72.6 }, { month: 'Nov', nav: 74.0 }, { month: 'Dec', nav: 74.12 },
];

const PERIODS = ['1M', '3M', '6M', '1Y', '3Y', '5Y'];

// ── Buy Modal ─────────────────────────────────────────────────────────────────
const BuyModal: React.FC<{ fundName: string; nav: string; onClose: () => void }> = ({ fundName, nav, onClose }) => {
  const [mode, setMode] = useState<'sip' | 'lump'>('sip');
  const [amount, setAmount] = useState(1000);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const minAmount = mode === 'sip' ? 500 : 1000;
  const projected = mode === 'sip'
    ? Math.round(amount * 36 * 1.142)
    : Math.round(amount * Math.pow(1.142, 5));

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setOrderId(`ORD-${Date.now()}`);
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={step !== 2 && !loading ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#1a3a6b] px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-blue-300 font-semibold uppercase tracking-widest mb-0.5">
              {step === 1 ? 'Invest' : step === 2 ? 'Confirm Order' : 'Order Confirmed'}
            </p>
            <h2 className="text-sm font-bold text-white leading-tight">{fundName}</h2>
            <p className="text-xs text-blue-200 mt-0.5">NAV {nav}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="text-white/60 hover:text-white mt-1 disabled:opacity-30">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-gray-200">
                <button onClick={() => setMode('sip')} className={`py-2.5 text-sm font-semibold transition-colors ${mode === 'sip' ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>Monthly SIP</button>
                <button onClick={() => setMode('lump')} className={`py-2.5 text-sm font-semibold transition-colors ${mode === 'lump' ? 'bg-[#1a3a6b] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>Lump Sum</button>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  {mode === 'sip' ? 'Monthly SIP Amount (₹)' : 'Investment Amount (₹)'}
                </label>
                <input
                  type="number" value={amount} min={minAmount}
                  onChange={e => setAmount(Math.max(minAmount, Number(e.target.value)))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-400 mt-1">Min: ₹{minAmount.toLocaleString('en-IN')}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(mode === 'sip' ? [500, 1000, 2000, 5000] : [1000, 5000, 10000, 25000]).map(v => (
                  <button key={v} onClick={() => setAmount(v)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${amount === v ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    ₹{v.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Projected value after {mode === 'sip' ? '3' : '5'} years</p>
                <p className="text-2xl font-bold text-[#1a3a6b]">₹{projected.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-0.5">Based on +14.2% avg. returns · Not guaranteed</p>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl py-3 font-bold text-base transition-colors">
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                {[['Fund', fundName], ['Type', mode === 'sip' ? 'Monthly SIP' : 'Lump Sum'], ['Amount', `₹${amount.toLocaleString('en-IN')}${mode === 'sip' ? '/mo' : ''}`], ['NAV', nav]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Mutual fund investments are subject to market risks. Please read all scheme documents carefully.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
                <button onClick={handleConfirm} disabled={loading}
                  className="flex-1 bg-[#1a3a6b] hover:bg-[#162f58] disabled:opacity-50 text-white rounded-xl py-3 font-bold transition-colors flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Confirm Order'}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-2 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{mode === 'sip' ? 'SIP Registered!' : 'Order Placed!'}</h3>
                <p className="text-sm text-gray-500 mt-1">₹{amount.toLocaleString('en-IN')}{mode === 'sip' ? '/month SIP started' : ' invested successfully'}</p>
              </div>
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 space-y-1 text-sm text-left">
                <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-semibold text-gray-800">{orderId}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold text-green-600">Confirmed</span></div>
              </div>
              <button onClick={onClose} className="w-full bg-[#1a3a6b] hover:bg-[#162f58] text-white rounded-xl py-3 font-bold transition-colors">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const FundDetailPage: React.FC = () => {
  const { amcId, fundName } = useParams<{ amcId: string; fundName: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('1Y');
  const [showBuy, setShowBuy] = useState(false);

  const amc = AMC_LIST.find(a => a.id === amcId);
  const name = decodeURIComponent(fundName ?? '');

  // Mock fund details
  const fund = {
    name,
    category: 'Flexi Cap',
    plan: 'Direct',
    option: 'Growth',
    nav: '₹74.12',
    aum: '₹52,100 Cr',
    expenseRatio: '0.58%',
    minSip: '₹1,000',
    minLumpsum: '₹1,000',
    risk: 'Moderate',
    stars: 5,
    r1y: '+22.1%', r3y: '+19.8%', r5y: '+21.4%',
    launchDate: 'May 2013',
    fundManager: 'Rajeev Thakkar',
    benchmark: 'NIFTY 500 TRI',
    exitLoad: '2% if redeemed within 365 days',
    lockIn: 'None',
  };

  const details = [
    { label: 'NAV',            value: fund.nav           },
    { label: 'AUM',            value: fund.aum           },
    { label: 'Expense Ratio',  value: fund.expenseRatio  },
    { label: 'Min SIP',        value: fund.minSip        },
    { label: 'Min Lumpsum',    value: fund.minLumpsum    },
    { label: 'Fund Manager',   value: fund.fundManager   },
    { label: 'Benchmark',      value: fund.benchmark     },
    { label: 'Launch Date',    value: fund.launchDate    },
    { label: 'Exit Load',      value: fund.exitLoad      },
    { label: 'Lock-in Period', value: fund.lockIn        },
  ];

  return (
    <div className="space-y-6">
      {showBuy && <BuyModal fundName={fund.name} nav={fund.nav} onClose={() => setShowBuy(false)} />}

      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(`/dashboard/mf/discovery/amc/${amcId}`)} className="text-gray-400 hover:text-gray-700 mt-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{fund.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{amc?.name} · {fund.category} · {fund.plan}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < fund.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">{fund.risk} Risk</span>
              </div>
            </div>
            <button
              onClick={() => setShowBuy(true)}
              className="flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#162f58] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" /> Invest Now
            </button>
          </div>
        </div>
      </div>

      {/* Returns cards */}
      <div className="grid grid-cols-3 gap-4">
        {[['1Y Returns', fund.r1y], ['3Y CAGR', fund.r3y], ['5Y CAGR', fund.r5y]].map(([label, val]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-green-600">{val}</p>
          </div>
        ))}
      </div>

      {/* NAV Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> NAV History
          </h2>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${period === p ? 'bg-[#1a3a6b] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={NAV_CHART} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} width={40} domain={['auto', 'auto']} />
            <Tooltip formatter={(v: number) => [`₹${v}`, 'NAV']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="nav" stroke="#06b6d4" strokeWidth={2.5} fill="url(#navGrad)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Fund Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" /> Fund Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {details.map(d => (
            <div key={d.label} className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">{d.label}</span>
              <span className="text-sm font-semibold text-gray-800 text-right max-w-[55%]">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 rounded-xl px-5 py-3">
        <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Past performance is not indicative of future results.
        </p>
      </div>

      {/* Sticky Buy Button (mobile) */}
      <div className="sticky bottom-4 flex justify-center">
        <button
          onClick={() => setShowBuy(true)}
          className="flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#162f58] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" /> Invest in this Fund
        </button>
      </div>
    </div>
  );
};

export default FundDetailPage;
