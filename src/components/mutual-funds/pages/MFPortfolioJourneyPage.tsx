import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, Loader2, TrendingUp, TrendingDown,
  Wallet, BarChart2, ArrowUpRight, ArrowDownRight, Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import iwAxios from '@/api/axios';
import { resolvePAN, fetchAndCachePANs } from '../hooks/useDemoPAN';
import { useToast } from '@/hooks/use-toast';

const DATA_SOURCE = '0';

// ── Types ─────────────────────────────────────────────────────────────────────
interface FolioRow {
  schemeName: string;
  fundName: string;
  folioNo: string;
  applicantName: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  currentNav: number;
  balanceUnits: number;
  gain: number;
  absoluteReturn: number;
  CAGR: number;
  oneDayChange: number;
  share: number;
}

interface PortfolioSummary {
  purchaseValue: number;
  currentValue: number;
  gain: number;
  absoluteReturn: number;
  CAGR: number;
  currentPrice: number;
  oneDayChange: number;
  changePercent: number;
}

// ── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  `₹${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
const fmtDate = (s: string) => {
  try { return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return s; }
};
const fmtAxisDate = (s: string) => {
  try { return new Date(s).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); }
  catch { return s; }
};
const yFmt = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v}`;
};
const gainCls = (n: number) => n >= 0 ? 'text-green-600' : 'text-red-500';

// ── Period config — maps UI label → API graphPeriod param ────────────────────
const PERIODS: { label: string; graphPeriod: string }[] = [
  { label: 'This Month',      graphPeriod: 'thisMonth' },
  { label: 'Current FY',      graphPeriod: 'currentFY' },
  { label: 'Last FY',         graphPeriod: 'lastFY' },
  { label: 'Last 1 Year',     graphPeriod: 'lastOneYear' },
  { label: 'Since Inception', graphPeriod: 'sinceInception' },
];

// ── Data shape ────────────────────────────────────────────────────────────────
interface DataPoint {
  date: string;
  netInvestment: number;
  AUM: number;
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const aum = payload.find((p: any) => p.dataKey === 'AUM')?.value ?? 0;
  const inv = payload.find((p: any) => p.dataKey === 'netInvestment')?.value ?? 0;
  const gain = aum > 0 ? aum - inv : null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 text-sm min-w-[210px]">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        {fmtDate(label)}
      </p>
      <div className="space-y-1.5">
        {aum > 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />AUM
            </span>
            <span className="font-bold text-blue-600">{fmt(aum)}</span>
          </div>
        )}
        <div className="flex justify-between gap-6">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />Net Invested
          </span>
          <span className="font-semibold text-purple-600">{fmt(inv)}</span>
        </div>
        {gain !== null && aum > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-1.5 flex justify-between gap-6">
            <span className="text-gray-500">Gain / Loss</span>
            <span className={`font-bold ${gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {gain >= 0 ? '+' : ''}{fmt(gain)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  label: string; value: string; sub?: string;
  up?: boolean; icon: React.ReactNode; color: string;
}> = ({ label, value, sub, up, icon, color }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold ${
            up === undefined ? 'text-gray-900 dark:text-white' : up ? 'text-green-600' : 'text-red-500'
          }`}>
            {value}
          </p>
          {sub && (
            <p className={`text-xs mt-1 font-medium ${
              up === undefined ? 'text-gray-400' : up ? 'text-green-500' : 'text-red-400'
            }`}>{sub}</p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const MFPortfolioJourneyPage: React.FC = () => {
  const { toast } = useToast();
  const initialPAN = resolvePAN();
  const [pan, setPan] = useState(initialPAN);
  const [panInput, setPanInput] = useState(initialPAN);
  const [activeTab, setActiveTab] = useState<'journey' | 'byFolio'>('byFolio');

  // ── Journey chart state ───────────────────────────────────────────────────
  const [graphPeriod, setGraphPeriod] = useState('sinceInception');
  const [dataSource, setDataSource] = useState('0');
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  // ── Portfolio Returns (Group by Folio) state ──────────────────────────────
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [folioRows, setFolioRows] = useState<FolioRow[]>([]);
  const [folioSummary, setFolioSummary] = useState<Partial<PortfolioSummary>>({});
  const [folioLoading, setFolioLoading] = useState(false);
  const [folioError, setFolioError] = useState<string | null>(null);

  const fetchFolioData = async (date = endDate) => {
    setFolioLoading(true);
    setFolioError(null);
    try {
      const filters = JSON.stringify([{ endDate: date, dataSource: DATA_SOURCE, pan }]);
      const { data: json } = await iwAxios.get(
        '/aggregator/reports/getPortfolioReturns',
        { params: { filters } }
      );
      if (json.status !== 0) throw new Error(json.message || 'API error');
      setFolioRows(json.result?.data ?? []);
      setFolioSummary(json.result?.summary ?? {});
    } catch (err: any) {
      const raw = err.response?.data?.message ?? err.message ?? '';
      const msg = /client not found|investor not found|user not found/i.test(raw)
        ? 'No portfolio data found for this PAN. Please verify the PAN and try again.'
        : raw || 'Unable to fetch portfolio returns.';
      setFolioError(msg);
      toast({ title: 'Unable to fetch portfolio returns.', description: msg, variant: 'destructive' });
    } finally {
      setFolioLoading(false);
    }
  };

  const fetchData = async (gp = graphPeriod, ds = dataSource) => {
    setLoading(true);
    setError(null);
    try {
      const filters = JSON.stringify([{ pan }, { dataSource: ds }]);
      const { data: json } = await iwAxios.get(
        '/aggregator/utils/getNavDateVSAUMNetInvGraph',
        { params: { graphPeriod: gp, filters } }
      );
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      setData(json.result?.data ?? []);
    } catch (err: any) {
      const raw = err.response?.data?.message ?? err.message ?? '';
      setError(
        /client not found|investor not found|user not found/i.test(raw)
          ? 'No portfolio data found for this PAN. Please verify the PAN and try again.'
          : raw || 'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pan) {
      fetchAndCachePANs().then(pans => {
        if (pans[0]) { setPan(pans[0]); setPanInput(pans[0]); }
      });
      return;
    }
    fetchFolioData(endDate);
  }, [pan]);

  useEffect(() => {
    if (activeTab === 'journey') {
      hasFetched.current = true;
      fetchData(graphPeriod);
    }
  }, [pan, activeTab]);

  const handlePeriod = (gp: string) => {
    setGraphPeriod(gp);
    fetchData(gp, dataSource);
  };

  const handleDataSource = (ds: string) => {
    setDataSource(ds);
    fetchData(graphPeriod, ds);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    fetchFolioData(e.target.value);
  };

  // ── Derived metrics ────────────────────────────────────────────────────────
  const activeData = data.filter(d => d.AUM > 0);   // points that have AUM
  const first = data[0];
  const last  = data[data.length - 1];
  const lastActive = activeData[activeData.length - 1];

  const latestAUM       = lastActive?.AUM ?? 0;
  const netInvestment   = last?.netInvestment ?? 0;
  const gain            = latestAUM > 0 ? latestAUM - netInvestment : 0;
  const gainPct         = netInvestment > 0 && latestAUM > 0 ? (gain / netInvestment) * 100 : 0;
  const peakAUM         = activeData.reduce((m, d) => Math.max(m, d.AUM), 0);
  const drawdown        = peakAUM > 0 && latestAUM > 0 ? ((peakAUM - latestAUM) / peakAUM) * 100 : 0;
  const firstAUM        = activeData[0]?.AUM ?? 0;
  const periodReturn    = firstAUM > 0 ? ((latestAUM - firstAUM) / firstAUM) * 100 : 0;

  const isGain       = gain >= 0;
  const isPeriodGain = periodReturn >= 0;

  // ticks: show ~8 evenly spaced date labels
  const tickInterval = Math.max(1, Math.floor(data.length / 8));

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Returns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Net Investment vs AUM over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm border rounded-lg px-3 py-1.5 bg-muted/50">
            <span className="text-muted-foreground text-xs font-medium">PAN:</span>
            <input
              value={panInput}
              onChange={e => setPanInput(e.target.value.toUpperCase())}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const p = panInput.trim();
                  if (p) { setPan(p); }
                }
              }}
              onBlur={() => { const p = panInput.trim(); if (p) setPan(p); }}
              placeholder="Enter PAN"
              className="font-mono font-medium bg-transparent outline-none w-32 uppercase placeholder:text-muted-foreground/50 text-sm"
            />
          </div>
          <Button
            variant="outline" size="sm"
            disabled={activeTab === 'byFolio' ? folioLoading : loading}
            onClick={() => activeTab === 'byFolio' ? fetchFolioData(endDate) : fetchData(graphPeriod)}
            className="gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${(activeTab === 'byFolio' ? folioLoading : loading) ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {([{ key: 'byFolio', label: 'Group by Folio' }, { key: 'journey', label: 'Portfolio Journey' }] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === t.key ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GROUP BY FOLIO TAB ── */}
      {activeTab === 'byFolio' && (
        <>
          {/* Date filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleDateChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Summary cards */}
          {!folioLoading && Object.keys(folioSummary).length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Investment" value={fmt(folioSummary.purchaseValue ?? 0)} icon={<Wallet className="w-5 h-5" />} color="#2563eb" />
              <StatCard label="Current Value" value={fmt(folioSummary.currentValue ?? 0)} icon={<BarChart2 className="w-5 h-5" />} color="#7c3aed" />
              <StatCard
                label="Gain / Loss"
                value={`${(folioSummary.gain ?? 0) >= 0 ? '+' : ''}${fmt(folioSummary.gain ?? 0)}`}
                sub={fmtPct(folioSummary.absoluteReturn ?? 0)}
                up={(folioSummary.gain ?? 0) >= 0}
                icon={(folioSummary.gain ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                color={(folioSummary.gain ?? 0) >= 0 ? '#16a34a' : '#dc2626'}
              />
              <StatCard
                label="CAGR"
                value={fmtPct(folioSummary.CAGR ?? 0)}
                sub={`1D: ${(folioSummary.oneDayChange ?? 0) >= 0 ? '+' : ''}${fmt(folioSummary.oneDayChange ?? 0)}`}
                up={(folioSummary.CAGR ?? 0) >= 0}
                icon={(folioSummary.CAGR ?? 0) >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                color={(folioSummary.CAGR ?? 0) >= 0 ? '#0891b2' : '#ea580c'}
              />
            </div>
          )}

          {/* Folio table */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Group by Folio</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {folioLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : folioError ? (
                <div className="flex flex-col items-center gap-3 h-48 justify-center">
                  <p className="text-red-500 text-sm text-center">{folioError}</p>
                  <Button size="sm" variant="outline" onClick={() => fetchFolioData(endDate)} className="gap-2">
                    <RefreshCw className="w-3 h-3" /> Retry
                  </Button>
                </div>
              ) : folioRows.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No Portfolio Found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        {['Scheme Name', 'Fund House', 'Folio No', 'Applicant', 'Purchase Date', 'Invested', 'Current Value', 'NAV', 'Units', 'Gain/Loss', 'Abs Return', 'CAGR', '1D Change', 'Share'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {folioRows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 font-medium max-w-[200px]">
                            <p className="truncate" title={row.schemeName}>{row.schemeName || '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{row.fundName || '—'}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{row.folioNo || '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{row.applicantName || '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">{fmtDate(row.purchaseDate)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap">{fmt(row.currentValue ?? 0)}</td>
                          <td className="px-4 py-3 text-gray-500">{(row.currentNav ?? 0).toFixed(4)}</td>
                          <td className="px-4 py-3 text-gray-500">{(row.balanceUnits ?? 0).toFixed(3)}</td>
                          <td className={`px-4 py-3 font-semibold whitespace-nowrap ${gainCls(row.gain ?? 0)}`}>
                            {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
                          </td>
                          <td className={`px-4 py-3 whitespace-nowrap ${gainCls(row.absoluteReturn ?? 0)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
                          <td className={`px-4 py-3 font-semibold whitespace-nowrap ${gainCls(row.CAGR ?? 0)}`}>{fmtPct(row.CAGR ?? 0)}</td>
                          <td className={`px-4 py-3 whitespace-nowrap ${gainCls(row.oneDayChange ?? 0)}`}>
                            {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{(row.share ?? 0).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ── PORTFOLIO JOURNEY TAB ── */}
      {activeTab === 'journey' && (
        <>
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Latest AUM" value={latestAUM > 0 ? fmt(latestAUM) : '—'}
              icon={<Wallet className="w-5 h-5" />} color="#2563eb" />
            <StatCard label="Net Investment" value={netInvestment > 0 ? fmt(netInvestment) : '—'}
              icon={<BarChart2 className="w-5 h-5" />} color="#16a34a" />
            <StatCard
              label="Gain / Loss"
              value={latestAUM > 0 ? `${gain >= 0 ? '+' : '-'}${fmt(Math.abs(gain))}` : '—'}
              up={latestAUM > 0 ? gain >= 0 : undefined}
              icon={gain >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              color={gain >= 0 ? '#16a34a' : '#dc2626'}
            />
            <StatCard
              label="Return %"
              value={latestAUM > 0 && netInvestment > 0 ? fmtPct(gainPct) : '—'}
              up={latestAUM > 0 ? gainPct >= 0 : undefined}
              icon={gainPct >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              color={gainPct >= 0 ? '#0891b2' : '#ea580c'}
            />
          </div>

          {/* ── Chart Card ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold">Net Investment vs AUM</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {/* Graph Period */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {PERIODS.map(p => (
                      <button key={p.graphPeriod} onClick={() => handlePeriod(p.graphPeriod)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                          graphPeriod === p.graphPeriod
                            ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                  {/* Data Source */}
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    {[{ label: 'All', value: '0' }, { label: 'Managed', value: '1' }, { label: 'Outside', value: '2' }].map(ds => (
                      <button key={ds.value} onClick={() => handleDataSource(ds.value)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                          dataSource === ds.value
                            ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}>
                        {ds.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {data.length > 0 && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {fmtDate(data[0]?.date ?? '')} — {fmtDate(data[data.length - 1]?.date ?? '')}
                  &nbsp;·&nbsp;{data.length} data points
                </p>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-3 h-80 justify-center">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                  <Button size="sm" variant="outline" onClick={() => fetchData(graphPeriod, dataSource)} className="gap-2">
                    <RefreshCw className="w-3 h-3" /> Retry
                  </Button>
                </div>
              ) : data.length === 0 ? (
                <div className="flex items-center justify-center h-80 text-gray-400 text-sm">No data available for this period</div>
              ) : (
                <motion.div key={`${graphPeriod}-${dataSource}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={fmtAxisDate}
                        tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false}
                        interval={Math.max(1, Math.floor(data.length / 8))} />
                      <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#888' }}
                        axisLine={false} tickLine={false} width={68} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend formatter={v => v === 'AUM' ? 'Current AUM' : 'Net Investment'}
                        wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                      <Line type="monotone" dataKey="netInvestment" stroke="#16a34a"
                        strokeWidth={2} strokeDasharray="6 3" dot={false}
                        activeDot={{ r: 4, fill: '#16a34a' }} name="Net Investment" connectNulls />
                      <Line type="monotone" dataKey="AUM" stroke="#2563eb"
                        strokeWidth={2.5} dot={false}
                        activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2563eb' }}
                        name="AUM" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* ── Data Table ── */}
          {data.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Historical Data</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        {['Date', 'Net Investment', 'Current AUM', 'Gain / Loss', 'Return %'].map(h => (
                          <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                            h === 'Date' ? 'text-left' : 'text-right'
                          }`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...data].reverse().map((row, i) => {
                        const g = row.AUM - row.netInvestment;
                        const r = row.netInvestment > 0 ? (g / row.netInvestment) * 100 : 0;
                        return (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{fmtDate(row.date)}</td>
                            <td className="px-5 py-3 text-right font-semibold text-green-600">{fmt(row.netInvestment)}</td>
                            <td className="px-5 py-3 text-right font-bold text-blue-600">
                              {row.AUM > 0 ? fmt(row.AUM) : <span className="text-gray-400 font-normal text-xs">—</span>}
                            </td>
                            <td className={`px-5 py-3 text-right font-semibold ${g >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {g >= 0 ? '+' : '-'}{fmt(Math.abs(g))}
                            </td>
                            <td className={`px-5 py-3 text-right font-medium ${r >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {fmtPct(r)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MFPortfolioJourneyPage;
