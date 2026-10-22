import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import iwAxios from '@/api/axios';

const PIE_THRESHOLD = 8;

function isClientNotFound(err: any): boolean {
  const msg = err?.response?.data?.message ?? err?.message ?? '';
  return msg === 'Client Not Found' || msg === 'Duplicate client found';
}

async function allocationGet(pan: string, viewType: string[]): Promise<any> {
  const filters = JSON.stringify([{ pan, viewType, panWiseData: true }]);
  const { data } = await iwAxios.get('/aggregator/reports/getAllocationAnalysis', { params: { filters } });
  return data;
}

const COLORS = ['#2563eb', '#0891b2', '#16a34a', '#d97706', '#7c3aed', '#db2777', '#0d9488', '#ea580c', '#0284c7', '#9333ea', '#65a30d', '#dc2626'];
const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

// ── Shared: smart chart — pie for small, horizontal bar for large ─────────────
interface ChartItem { name: string; value: number; amount: number; color?: string; }

const CustomTooltip = ({ active, payload, valueLabel }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{d.name}</p>
      <p className="text-gray-600 dark:text-gray-300">{valueLabel}: <span className="font-bold text-gray-900 dark:text-white">{fmtPct(d.value)}</span></p>
      <p className="text-gray-600 dark:text-gray-300">Amount: <span className="font-bold text-gray-900 dark:text-white">{fmt(d.amount)}</span></p>
    </div>
  );
};

const SmartChart: React.FC<{ items: ChartItem[]; valueLabel?: string }> = ({ items, valueLabel = 'Allocation' }) => {
  const isBar = items.length > PIE_THRESHOLD;
  const barHeight = Math.max(400, items.length * 44);
  const maxLabelLen = Math.max(...items.map(d => d.name.length));
  const yAxisWidth = Math.min(Math.max(maxLabelLen * 7, 140), 260);

  if (isBar) {
    const barData = items.map(d => ({ name: d.name, value: d.value, amount: d.amount }));
    return (
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: 540 }}>
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 80, top: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#555' }} tickFormatter={v => `${v}%`} domain={[0, 'dataMax + 2']} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#333' }} width={yAxisWidth} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip valueLabel={valueLabel} />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}
                label={{ position: 'right', formatter: (v: number) => `${v.toFixed(1)}%`, fontSize: 12, fill: '#444', fontWeight: 600 }}>
                {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Pie with legend list on the side
  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={items} cx="50%" cy="50%"
            outerRadius={120} innerRadius={items.length > 3 ? 50 : 0}
            dataKey="value" paddingAngle={2}
            label={({ cx, cy, midAngle, outerRadius: or, value, index }) => {
              if (value < 3) return null; // skip tiny labels
              const RADIAN = Math.PI / 180;
              const r = or + 22;
              const x = cx + r * Math.cos(-midAngle * RADIAN);
              const y = cy + r * Math.sin(-midAngle * RADIAN);
              return <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600}>{`${value}%`}</text>;
            }}
            labelLine={false}
          >
            {items.map((entry, i) => <Cell key={i} fill={entry.color ?? COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip valueLabel={valueLabel} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {items.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-3 h-3 flex-shrink-0 rounded-full" style={{ background: item.color ?? COLORS[i % COLORS.length] }} />
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
              <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.min(item.value, 100)}%`, background: item.color ?? COLORS[i % COLORS.length] }} />
              </div>
              <span className="text-xs text-gray-500 w-20 text-right font-medium">{fmt(item.amount)}</span>
              <span className="text-sm font-bold w-12 text-right" style={{ color: item.color ?? COLORS[i % COLORS.length] }}>{item.value}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ── Summary cards ─────────────────────────────────────────────────────────────
const SummaryCards: React.FC<{ items: { label: string; value: number; pct: number; color: string }[] }> = ({ items }) => (
  <div className={`grid gap-4 ${items.length <= 2 ? 'grid-cols-2' : items.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
    {items.map((item) => (
      <Card key={item.label} className="border-l-4 shadow-sm" style={{ borderLeftColor: item.color }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{item.label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(item.value)}</p>
          <p className="text-sm font-medium mt-1" style={{ color: item.color }}>{item.pct.toFixed(2)}% of portfolio</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const LoadingState = () => <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
const ErrorState: React.FC<{ msg: string; onRetry: () => void }> = ({ msg, onRetry }) => (
  <div className="flex flex-col items-center gap-3 p-16">
    <p className="text-red-500 text-sm">{msg}</p>
    <Button size="sm" variant="outline" onClick={onRetry} className="gap-2"><RefreshCw className="w-3 h-3" /> Retry</Button>
  </div>
);
const RefreshBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex justify-end"><Button variant="outline" size="sm" onClick={onClick} className="gap-2"><RefreshCw className="w-3 h-3" /> Refresh</Button></div>
);

// ── Broad Asset Allocation ────────────────────────────────────────────────────
interface AssetItem { category: string; percentage: number; amount: number; }
const ASSET_COLORS: Record<string, string> = { Equity: '#0D3B66', Debt: '#11B5E4', Gold: '#f59e0b', Other: '#8b5cf6' };

const BroadAssetTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [data, setData] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['asset']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      setData(json.result?.asset ?? []);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const total = data.reduce((s, d) => s + d.amount, 0) || 1;
  const items: ChartItem[] = data.map((d, i) => ({ name: d.category, value: parseFloat(((d.amount / total) * 100).toFixed(2)), amount: d.amount, color: ASSET_COLORS[d.category] ?? COLORS[i % COLORS.length] }));
  const cards = data.map((d, i) => ({ label: d.category, value: d.amount, pct: d.percentage, color: ASSET_COLORS[d.category] ?? COLORS[i % COLORS.length] }));

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <SummaryCards items={cards} />
      <SmartChart items={items} valueLabel="Asset Allocation" />
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Equity Cap ────────────────────────────────────────────────────────────────
const EQUITY_CAP_COLORS = { 'Large Cap': '#0D3B66', 'Mid Cap': '#11B5E4', 'Small Cap': '#22c55e' };

const EquityCapTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['equityCap']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      const r = json.result?.equityCap;
      const t = r?.currentAmount ?? 0;
      setTotal(t);
      setData([
        { name: 'Large Cap', amount: r?.largeCap ?? 0, value: parseFloat((((r?.largeCap ?? 0) / t) * 100).toFixed(2)), color: EQUITY_CAP_COLORS['Large Cap'] },
        { name: 'Mid Cap',   amount: r?.midCap ?? 0,   value: parseFloat((((r?.midCap ?? 0) / t) * 100).toFixed(2)),   color: EQUITY_CAP_COLORS['Mid Cap'] },
        { name: 'Small Cap', amount: r?.smallCap ?? 0, value: parseFloat((((r?.smallCap ?? 0) / t) * 100).toFixed(2)), color: EQUITY_CAP_COLORS['Small Cap'] },
      ]);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const cards = data.map(d => ({ label: d.name, value: d.amount, pct: d.value, color: d.color ?? COLORS[0] }));

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <SummaryCards items={cards} />
      <SmartChart items={data} valueLabel="Equity Cap" />
      <div className="text-right text-sm font-semibold text-muted-foreground pr-1">Total Equity: <span className="text-foreground">{fmt(total)}</span></div>
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Fund Allocation ───────────────────────────────────────────────────────────
interface FundItem {
  fundName: string; schemeName: string; subCategory: string; investorName: string;
  currentAmount: number; share: number; equityPercent: number; debtPercent: number;
  goldPercent: number; otherPercent: number;
}

const FundTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [data, setData] = useState<FundItem[]>([]);
  const [summary, setSummary] = useState<{ currentAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['fund']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      setData(json.result?.fund?.allocation ?? []);
      setSummary(json.result?.fund?.summary ?? null);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const total = summary?.currentAmount || data.reduce((s, d) => s + d.currentAmount, 0) || 1;
  const grouped = data.reduce<Record<string, number>>((acc, row) => { acc[row.fundName] = (acc[row.fundName] ?? 0) + row.currentAmount; return acc; }, {});
  const chartItems: ChartItem[] = Object.entries(grouped).map(([name, amt], i) => ({ name, value: parseFloat(((amt / total) * 100).toFixed(2)), amount: amt, color: COLORS[i % COLORS.length] })).sort((a, b) => b.value - a.value);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <SmartChart items={chartItems} valueLabel="Fund House" />
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/40 border-b">{['Scheme Name', 'Fund House', 'Sub-Category', 'Current Value', 'Portfolio %', 'Equity%', 'Debt%'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="p-10 text-center text-muted-foreground text-sm">No data available</td></tr>
              : [...data].sort((a, b) => b.currentAmount - a.currentAmount).map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[220px] truncate" title={row.schemeName}>{row.schemeName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.fundName}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">{row.subCategory}</span></td>
                  <td className="px-4 py-3 font-semibold">{fmt(row.currentAmount)}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(row.share, 100)}%` }} /></div><span className="text-xs font-semibold">{row.share.toFixed(2)}%</span></div></td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{row.equityPercent > 0 ? `${row.equityPercent}%` : '—'}</td>
                  <td className="px-4 py-3 text-cyan-600 font-medium">{row.debtPercent > 0 ? `${row.debtPercent}%` : '—'}</td>
                </tr>
              ))}
          </tbody>
          {summary && <tfoot><tr className="bg-muted/60 font-semibold border-t-2"><td className="px-4 py-3" colSpan={3}>Total</td><td className="px-4 py-3">{fmt(summary.currentAmount)}</td><td className="px-4 py-3">100%</td><td colSpan={2} /></tr></tfoot>}
        </table>
      </div>
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Investor Allocation ───────────────────────────────────────────────────────
const InvestorTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [data, setData] = useState<FundItem[]>([]);
  const [summary, setSummary] = useState<{ currentAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['investor']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      setData(json.result?.investor?.allocation ?? []);
      setSummary(json.result?.investor?.summary ?? null);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const total = summary?.currentAmount || data.reduce((s, d) => s + d.currentAmount, 0) || 1;

  const investorGrouped = data.reduce<Record<string, number>>((acc, row) => { const k = row.investorName || 'Unknown'; acc[k] = (acc[k] ?? 0) + row.currentAmount; return acc; }, {});
  const investorCards = Object.entries(investorGrouped).map(([name, amt], i) => ({ label: name, value: amt, pct: (amt / total) * 100, color: COLORS[i % COLORS.length] })).sort((a, b) => b.value - a.value);

  const subCatGrouped = data.reduce<Record<string, number>>((acc, row) => { const k = row.subCategory || 'Other'; acc[k] = (acc[k] ?? 0) + row.currentAmount; return acc; }, {});
  const subCatItems: ChartItem[] = Object.entries(subCatGrouped).map(([name, amt], i) => ({ name, value: parseFloat(((amt / total) * 100).toFixed(2)), amount: amt, color: COLORS[i % COLORS.length] })).sort((a, b) => b.value - a.value);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      {investorCards.length > 0 && <SummaryCards items={investorCards} />}
      <SmartChart items={subCatItems} valueLabel="Sub-Category" />
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/40 border-b">{['Investor', 'Scheme Name', 'Fund House', 'Sub-Category', 'Current Value', 'Equity%', 'Debt%'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={7} className="p-10 text-center text-muted-foreground text-sm">No data available</td></tr>
              : [...data].sort((a, b) => b.currentAmount - a.currentAmount).map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{row.investorName || '—'}</td>
                  <td className="px-4 py-3 font-medium max-w-[180px] truncate" title={row.schemeName}>{row.schemeName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.fundName}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">{row.subCategory}</span></td>
                  <td className="px-4 py-3 font-semibold">{fmt(row.currentAmount)}</td>
                  <td className="px-4 py-3 text-blue-700 font-medium">{row.equityPercent > 0 ? `${row.equityPercent}%` : '—'}</td>
                  <td className="px-4 py-3 text-cyan-600 font-medium">{row.debtPercent > 0 ? `${row.debtPercent}%` : '—'}</td>
                </tr>
              ))}
          </tbody>
          {summary && <tfoot><tr className="bg-muted/60 font-semibold border-t-2"><td className="px-4 py-3" colSpan={4}>Total</td><td className="px-4 py-3">{fmt(summary.currentAmount)}</td><td colSpan={2} /></tr></tfoot>}
        </table>
      </div>
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Category ──────────────────────────────────────────────────────────────────
interface CategoryItem {
  subCategory: string; currentAmount: number; share: number;
  equityPercent: number; debtPercent: number; goldPercent: number; otherPercent: number;
}

function classifyCategory(name: string): 'Equity' | 'Debt' | 'Gold' | 'Others' {
  const l = name.toLowerCase();
  if (l.includes('gold')) return 'Gold';
  if (l.includes('debt') || l.includes('duration') || l.includes('money market') || l.includes('fixed income')) return 'Debt';
  if (l.includes('equity') || l.includes('elss') || l.includes('pms') || l.includes('shares')) return 'Equity';
  return 'Others';
}
const CLASS_COLORS = { Equity: '#0D3B66', Debt: '#11B5E4', Gold: '#f59e0b', Others: '#8b5cf6' };

const CategoryTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [data, setData] = useState<CategoryItem[]>([]);
  const [summary, setSummary] = useState<{ currentAmount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['category']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      const cat = json.result?.category;
      setData((cat?.data ?? []).map((r: any) => ({
        subCategory: r.subCategory ?? r.schemeName ?? r.category ?? 'Unknown',
        currentAmount: r.currentAmount ?? 0, share: r.share ?? 0,
        equityPercent: r.equityPercent ?? 0, debtPercent: r.debtPercent ?? 0,
        goldPercent: r.goldPercent ?? 0, otherPercent: r.otherPercent ?? 0,
      })));
      setSummary(cat?.summary ?? null);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const total = summary?.currentAmount || data.reduce((s, d) => s + d.currentAmount, 0) || 1;
  const buckets = data.reduce<Record<string, number>>((acc, row) => { const k = classifyCategory(row.subCategory); acc[k] = (acc[k] ?? 0) + row.currentAmount; return acc; }, { Equity: 0, Debt: 0, Gold: 0, Others: 0 });
  const chartItems: ChartItem[] = [...data].sort((a, b) => b.currentAmount - a.currentAmount).map((d, i) => ({ name: d.subCategory, value: parseFloat(((d.currentAmount / total) * 100).toFixed(2)), amount: d.currentAmount, color: COLORS[i % COLORS.length] }));
  const cards = (['Equity', 'Debt', 'Gold', 'Others'] as const).map(k => ({ label: k, value: buckets[k] ?? 0, pct: ((buckets[k] ?? 0) / total) * 100, color: CLASS_COLORS[k] }));

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      {data.length > 0 && <SummaryCards items={cards} />}
      <SmartChart items={chartItems} valueLabel="Category" />
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/40 border-b">{['Sub-Category', 'Asset Class', 'Current Value', 'Portfolio %'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={4} className="p-10 text-center text-muted-foreground text-sm">No data</td></tr>
              : [...data].sort((a, b) => b.currentAmount - a.currentAmount).map((row, i) => {
                const cls = classifyCategory(row.subCategory);
                const clsColor = cls === 'Equity' ? 'bg-blue-100 text-blue-700' : cls === 'Debt' ? 'bg-cyan-100 text-cyan-700' : cls === 'Gold' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700';
                return (
                  <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.subCategory}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${clsColor}`}>{cls}</span></td>
                    <td className="px-4 py-3 font-semibold">{fmt(row.currentAmount)}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(row.share, 100)}%` }} /></div><span className="text-xs font-semibold">{row.share.toFixed(2)}%</span></div></td>
                  </tr>
                );
              })}
          </tbody>
          {summary && <tfoot><tr className="bg-muted/60 font-semibold border-t-2"><td className="px-4 py-3" colSpan={2}>Total</td><td className="px-4 py-3">{fmt(summary.currentAmount)}</td><td className="px-4 py-3">100%</td></tr></tfoot>}
        </table>
      </div>
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Holding ───────────────────────────────────────────────────────────────────
interface HoldingItem { holding: string; sector: string; currentAmount: number; share: number; }
interface HoldingResult {
  scrip:  { allocation: HoldingItem[]; summary: { currentAmount: number } };
  sector: { allocation: HoldingItem[]; summary: { currentAmount: number } };
  paper:  { allocation: HoldingItem[]; summary: { currentAmount: number } };
  rating: { allocation: HoldingItem[]; summary: { currentAmount: number } };
}

const HoldingSubView: React.FC<{ rows: HoldingItem[]; labelCol: string; groupCol: string; total: number }> = ({ rows, labelCol, groupCol, total }) => {
  // Group by sector for chart
  const grouped = rows.reduce<Record<string, number>>((acc, r) => { const k = r.sector || 'Other'; acc[k] = (acc[k] ?? 0) + r.currentAmount; return acc; }, {});
  const chartItems: ChartItem[] = Object.entries(grouped).map(([name, amt], i) => ({ name, value: parseFloat(((amt / total) * 100).toFixed(2)), amount: amt, color: COLORS[i % COLORS.length] })).sort((a, b) => b.value - a.value);

  // For individual items chart (when rows are manageable)
  const rowItems: ChartItem[] = [...rows].sort((a, b) => b.currentAmount - a.currentAmount).map((r, i) => ({ name: r.holding, value: parseFloat(((r.currentAmount / total) * 100).toFixed(2)), amount: r.currentAmount, color: COLORS[i % COLORS.length] }));

  return (
    <div className="space-y-6">
      {/* Grouped by sector/rating chart — always clear */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">By {groupCol}</p>
        <SmartChart items={chartItems} valueLabel={groupCol} />
      </div>
      {/* Individual items — bar if large */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">By {labelCol}</p>
        <SmartChart items={rowItems} valueLabel={labelCol} />
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/40 border-b">{[labelCol, groupCol, 'Current Value', 'Share %'].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {[...rows].sort((a, b) => b.currentAmount - a.currentAmount).map((row, i) => (
              <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium max-w-[260px] truncate" title={row.holding}>{row.holding}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">{row.sector}</span></td>
                <td className="px-4 py-3 font-semibold">{fmt(row.currentAmount)}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(row.share, 100)}%` }} /></div><span className="text-xs font-semibold">{row.share.toFixed(2)}%</span></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HoldingTab: React.FC<{ pan: string }> = ({ pan }) => {
  const [result, setResult] = useState<HoldingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pan) return;
    setLoading(true); setError(null);
    try {
      const json = await allocationGet(pan, ['holding']);
      if (json.status !== 0) throw new Error(json.message ?? 'API error');
      setResult(json.result?.holding ?? null);
    } catch (err: any) { if (!isClientNotFound(err)) setError(err.response?.data?.message ?? err.message ?? 'Failed to load'); }
    finally { setLoading(false); }
  }, [pan]);
  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState msg={error} onRetry={fetchData} />;
  if (!result) return null;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="scrip">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="scrip">By Scrip</TabsTrigger>
          <TabsTrigger value="sector">By Sector</TabsTrigger>
          <TabsTrigger value="paper">By Paper</TabsTrigger>
          <TabsTrigger value="rating">By Rating</TabsTrigger>
        </TabsList>
        <TabsContent value="scrip" className="pt-4">
          <HoldingSubView rows={result.scrip.allocation} labelCol="Scrip" groupCol="Sector" total={result.scrip.summary.currentAmount} />
        </TabsContent>
        <TabsContent value="sector" className="pt-4">
          <HoldingSubView rows={result.sector.allocation} labelCol="Holding" groupCol="Sector" total={result.sector.summary.currentAmount} />
        </TabsContent>
        <TabsContent value="paper" className="pt-4">
          <HoldingSubView rows={result.paper.allocation} labelCol="Paper" groupCol="Type" total={result.paper.summary.currentAmount} />
        </TabsContent>
        <TabsContent value="rating" className="pt-4">
          <HoldingSubView rows={result.rating.allocation} labelCol="Instrument" groupCol="Rating" total={result.rating.summary.currentAmount} />
        </TabsContent>
      </Tabs>
      <RefreshBtn onClick={fetchData} />
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const MFAssetAllocationPage: React.FC = () => {
  const [panInput, setPanInput] = useState('');
  const [pan, setPan] = useState('');

  const applyPan = () => { const p = panInput.trim().toUpperCase(); if (p) setPan(p); };

  return (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Asset Allocation</h1>
        <p className="text-muted-foreground text-sm">Visualise how your investments are distributed</p>
      </div>
      <div className="flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 bg-muted/50">
        <span className="text-muted-foreground">PAN:</span>
        <input
          value={panInput}
          onChange={e => setPanInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && applyPan()}
          onBlur={applyPan}
          placeholder="Enter PAN"
          className="font-mono font-medium bg-transparent outline-none w-28 uppercase placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
    {!pan ? (
      <div className="flex items-center justify-center p-20 text-muted-foreground text-sm">Enter a PAN above to load allocation data</div>
    ) : (
    <Tabs defaultValue="broad">
      <TabsList className="mb-6 flex-wrap h-auto gap-1">
        <TabsTrigger value="broad">Broad Asset Allocation</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
        <TabsTrigger value="equity">Equity Cap</TabsTrigger>
        <TabsTrigger value="fund">Fund</TabsTrigger>
        <TabsTrigger value="investor">Investor</TabsTrigger>
        <TabsTrigger value="holding">Holding Period</TabsTrigger>
      </TabsList>
      <TabsContent value="broad">
        <Card><CardHeader><CardTitle className="text-base">Broad Asset Allocation</CardTitle></CardHeader><CardContent><BroadAssetTab pan={pan} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="category">
        <Card><CardHeader><CardTitle className="text-base">Category Allocation</CardTitle></CardHeader><CardContent><CategoryTab pan={pan} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="equity">
        <Card><CardHeader><CardTitle className="text-base">Equity Cap Allocation</CardTitle></CardHeader><CardContent><EquityCapTab pan={pan} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="fund">
        <Card><CardHeader><CardTitle className="text-base">Fund-wise Allocation</CardTitle></CardHeader><CardContent><FundTab pan={pan} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="investor">
        <Card><CardHeader><CardTitle className="text-base">Investor Allocation</CardTitle></CardHeader><CardContent><InvestorTab pan={pan} /></CardContent></Card>
      </TabsContent>
      <TabsContent value="holding">
        <Card><CardHeader><CardTitle className="text-base">Holding Period Distribution</CardTitle></CardHeader><CardContent><HoldingTab pan={pan} /></CardContent></Card>
      </TabsContent>
    </Tabs>
    )}
  </div>
  );
};

export default MFAssetAllocationPage;
