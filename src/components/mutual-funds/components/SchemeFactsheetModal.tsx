import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { getStoredToken, getOrFetchAggregatorToken } from '@/mutualfunds/services/investwellAuthService';

interface FactsheetData {
  name: string; category: string; currentNAV: number; navDate: string;
  weekHigh: string; weekLow: string; corpus: number; expenseRatio: number;
  benchmark: string; fundManager: string; fundManager2: string; fundManager3: string;
  exitLoad: string; schObjective: string; launchDate: string;
  risk: number; beta: number; alpha: number; sharpRatio: number; standardDev: number; mean: number;
  sipMinAmount: number; purchaseMinAmount: number; taxStat: string;
  vEquity: number; vDebt: number; goldPercent: number; vOther: number;
  largeCap: number; midCap: number; smallCap: number;
  trailingReturn: Record<string, number>;
  benchmarkTrailingReturn: Record<string, number>;
  calenderReturn: { Year: number; RET: number }[];
  benchmarkCalenderReturn: { Year: number; RET: number }[];
  holdings: { holdings: string; instruments: string; netAsset: number; sector: string }[];
  sectors: { sectorRating: string; netAsset: number }[];
  fundName: string;
}

interface Props {
  isin: string;
  fundName: string;
  onClose: () => void;
}

const STATIC_TOKEN = '';

async function resolveToken(): Promise<string> {
  const stored = getStoredToken()?.token;
  if (stored) return stored;
  return getOrFetchAggregatorToken();
}

const riskLabels = ['', 'Low', 'Low to Moderate', 'Moderate', 'Moderately High', 'High', 'Very High'];
const riskColors = ['', 'bg-green-500', 'bg-lime-500', 'bg-yellow-400', 'bg-orange-400', 'bg-orange-600', 'bg-red-600'];

const fmt = (n: number | string) => parseFloat(String(n)).toFixed(2);
const fmtCr = (n: number) => `₹${n.toLocaleString('en-IN')} Cr`;

export default function SchemeFactsheetModal({ isin, fundName, onClose }: Props) {
  const [data, setData] = useState<FactsheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    resolveToken().then(token => {
      fetch(`/iw-api/api/aggregator/utils/getFactsheetData?isinNo=${isin}`, {
        headers: { 'token': token, 'Content-Type': 'application/json' },
        signal: controller.signal,
      })
        .then(r => r.json())
        .then(json => {
          if (json.status !== 0) throw new Error(json.message || 'Failed to load factsheet');
          setData(json.results.data);
        })
        .catch(e => { if (e.name !== 'AbortError') setError(e.message); })
        .finally(() => setLoading(false));
    }).catch(e => { setError(e.message); setLoading(false); });
    return () => controller.abort();
  }, [isin]);

  const trailingKeys = [
    { key: '30Day', label: '1M' }, { key: '3Month', label: '3M' },
    { key: '6Month', label: '6M' }, { key: '1Year', label: '1Y' },
    { key: '2Year', label: '2Y' }, { key: '3Year', label: '3Y' },
    { key: '5Year', label: '5Y' }, { key: '7Year', label: '7Y' },
    { key: '10Year', label: '10Y' },
  ];

  const benchmarkKeyMap: Record<string, string> = {
    '30Day': '30DayBenchMarkReturn', '3Month': '3MonthBenchMarkReturn',
    '6Month': '6MonthBenchMarkReturn', '1Year': '1YearBenchMarkReturn',
    '2Year': '2YearBenchMarkReturn', '3Year': '3YearBenchMarkReturn',
    '5Year': '5YearBenchMarkReturn', '7Year': '7YearBenchMarkReturn',
    '10Year': '10YearBenchMarkReturn',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-blue-900 text-white px-6 py-4 rounded-t-2xl flex items-start justify-between z-10">
          <div>
            <p className="text-xs text-blue-300 uppercase tracking-wider mb-1">Scheme Factsheet</p>
            <h2 className="text-lg font-bold leading-snug">{loading ? fundName : (data?.name ?? fundName)}</h2>
            {data && <p className="text-sm text-blue-200 mt-0.5">{data.category} · {data.fundName}</p>}
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 mt-1 ml-4 shrink-0">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-red-500 font-semibold">{error}</div>
          )}

          {data && !loading && (
            <div className="space-y-8">

              {/* NAV + Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Current NAV" value={`₹${fmt(data.currentNAV)}`} />
                <StatBox label="AUM" value={fmtCr(data.corpus)} />
                <StatBox label="Expense Ratio" value={`${fmt(data.expenseRatio)}%`} />
                <StatBox label="Min SIP / Lumpsum" value={`₹${data.sipMinAmount} / ₹${data.purchaseMinAmount}`} />
                <StatBox label="52W High" value={`₹${data.weekHigh}`} />
                <StatBox label="52W Low" value={`₹${data.weekLow}`} />
                <StatBox label="Launch Date" value={data.launchDate} />
                <StatBox label="Tax Status" value={data.taxStat} />
              </div>

              {/* Risk-o-meter */}
              <div className="border rounded-xl p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${riskColors[data.risk] || 'bg-gray-400'} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {data.risk}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Risk Level</p>
                  <p className="font-bold text-gray-800">{riskLabels[data.risk] || 'Unknown'}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400">Benchmark</p>
                  <p className="font-semibold text-sm text-gray-700">{data.benchmark}</p>
                </div>
              </div>

              {/* Objective */}
              {data.schObjective && (
                <div className="bg-gray-50 border rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Scheme Objective</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{data.schObjective}</p>
                </div>
              )}

              {/* Fund Managers */}
              <div className="border rounded-xl p-4">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Fund Managers</p>
                <div className="flex flex-wrap gap-3">
                  {[data.fundManager, data.fundManager2, data.fundManager3].filter(Boolean).map((fm, i) => (
                    <span key={i} className="bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full text-sm font-semibold">{fm}</span>
                  ))}
                </div>
              </div>

              {/* Trailing Returns */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Trailing Returns (%)</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500 text-xs uppercase">
                        <th className="py-2 px-4 text-left">Period</th>
                        {trailingKeys.map(({ label }) => (
                          <th key={label} className="py-2 px-3 text-center">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-semibold text-blue-900">Fund</td>
                        {trailingKeys.map(({ key, label }) => {
                          const v = data.trailingReturn[key];
                          return (
                            <td key={label} className={`py-3 px-3 text-center font-bold ${v >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {v != null ? `${v > 0 ? '+' : ''}${fmt(v)}%` : '—'}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-gray-500">Benchmark</td>
                        {trailingKeys.map(({ key, label }) => {
                          const v = data.benchmarkTrailingReturn[benchmarkKeyMap[key]];
                          return (
                            <td key={label} className={`py-3 px-3 text-center font-bold ${v >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {v != null ? `${v > 0 ? '+' : ''}${fmt(v)}%` : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calendar Returns */}
              {data.calenderReturn?.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Calendar Year Returns (%)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-gray-500 text-xs uppercase">
                          <th className="py-2 px-4 text-left">Year</th>
                          {data.calenderReturn.map(r => (
                            <th key={r.Year} className="py-2 px-4 text-center">{r.Year}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-semibold text-blue-900">Fund</td>
                          {data.calenderReturn.map(r => (
                            <td key={r.Year} className={`py-3 px-4 text-center font-bold ${r.RET >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {r.RET > 0 ? '+' : ''}{fmt(r.RET)}%
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-gray-500">Benchmark</td>
                          {data.benchmarkCalenderReturn.map(r => (
                            <td key={r.Year} className={`py-3 px-4 text-center font-bold ${r.RET >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {r.RET > 0 ? '+' : ''}{fmt(r.RET)}%
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Portfolio Allocation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asset Allocation */}
                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-4">Asset Allocation</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Equity', value: data.vEquity, color: 'bg-blue-600' },
                      { label: 'Debt', value: data.vDebt, color: 'bg-teal-500' },
                      { label: 'Gold', value: data.goldPercent, color: 'bg-yellow-400' },
                      { label: 'Other', value: data.vOther, color: 'bg-gray-400' },
                    ].filter(a => a.value > 0).map(a => (
                      <div key={a.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-gray-700">{a.label}</span>
                          <span className="font-bold">{fmt(a.value)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full">
                          <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {(data.largeCap > 0 || data.midCap > 0 || data.smallCap > 0) && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Market Cap Split</p>
                      {[
                        { label: 'Large Cap', value: data.largeCap },
                        { label: 'Mid Cap', value: data.midCap },
                        { label: 'Small Cap', value: data.smallCap },
                      ].filter(m => m.value > 0).map(m => (
                        <div key={m.label} className="flex justify-between text-sm">
                          <span className="text-gray-600">{m.label}</span>
                          <span className="font-bold">{fmt(m.value)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Metrics */}
                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-4">Risk Metrics</p>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBox label="Alpha" value={`${fmt(data.alpha)}%`} small />
                    <StatBox label="Beta" value={fmt(data.beta)} small />
                    <StatBox label="Sharpe Ratio" value={fmt(data.sharpRatio)} small />
                    <StatBox label="Std Dev" value={`${fmt(data.standardDev)}%`} small />
                    <StatBox label="Mean" value={`${fmt(data.mean)}%`} small />
                  </div>
                </div>
              </div>

              {/* Top Holdings */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Top Holdings</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500 text-xs uppercase">
                        <th className="py-2 px-4 text-left">Holding</th>
                        <th className="py-2 px-4 text-left">Sector</th>
                        <th className="py-2 px-4 text-left">Instrument</th>
                        <th className="py-2 px-4 text-right">% Net Assets</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.holdings.slice(0, 15).map((h, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2.5 px-4 font-semibold text-gray-800">{h.holdings}</td>
                          <td className="py-2.5 px-4 text-gray-500">{h.sector}</td>
                          <td className="py-2.5 px-4 text-gray-500">{h.instruments}</td>
                          <td className={`py-2.5 px-4 text-right font-bold ${h.netAsset >= 0 ? 'text-blue-900' : 'text-red-500'}`}>
                            {fmt(h.netAsset)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sector Allocation */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Sector Allocation</p>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.sectors.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{s.sectorRating}</span>
                        <span className="font-bold text-gray-800">{fmt(s.netAsset)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(s.netAsset, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exit Load */}
              {data.exitLoad && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-600 uppercase font-semibold mb-1">Exit Load</p>
                  <p className="text-sm text-amber-900">{data.exitLoad}</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatBox = ({ label, value, small = false }: { label: string; value: string; small?: boolean }) => (
  <div className={`bg-gray-50 rounded-lg p-3 border ${small ? '' : ''}`}>
    <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{label}</p>
    <p className={`font-bold text-gray-800 ${small ? 'text-sm' : 'text-base'}`}>{value}</p>
  </div>
);
