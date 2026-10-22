import React, { useState, useRef, useCallback } from 'react';
import { Search, AlertCircle, TrendingUp, TrendingDown, Wallet, BarChart3, Calendar, Download, RefreshCw, ChevronUp, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import iwAxios from '@/api/axios';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SummaryFilters {
  pan:         string;
  endDate:     string;
  startDate?:  string;
  panWiseData: 0 | 1;
}

interface SummaryRow {
  folioNo:            string;
  schemeName:         string;
  fundName:           string;
  isinNo:             string;
  pan:                string;
  applicantName:      string;
  category:           string;
  category2:          string;
  objectiveName:      string;
  currentUnits:       number;
  currentNav:         number;
  currentNavDate:     string;
  currentValue:       number;
  netInvestment:      number;
  openingBalance:     number;
  purchaseValue:      number;
  gain:               number;
  unrealizedGain:     number;
  realizedGain:       number;
  absoluteReturn:     number;
  XIRR:               number;
  avgHoldingDays:     number;
  schemeBenchmarkName: string;
  XIRRData:           { amount: number; date: string }[];
}

interface SummaryResult {
  data:    SummaryRow[];
  summary: Record<string, number>;
}

type SortKey = 'currentValue' | 'gain' | 'XIRR' | 'absoluteReturn' | 'currentNav';
type SortDir = 'asc' | 'desc';

// ── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  `₹${(n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (n: number) =>
  `${(n ?? 0) >= 0 ? '+' : ''}${(n ?? 0).toFixed(3)}%`;
const toIST = (utc: string) => {
  if (!utc) return '—';
  try {
    const d = new Date(utc);
    if (isNaN(d.getTime())) return utc;
    return new Date(d.getTime() + 5.5 * 60 * 60 * 1000).toLocaleDateString('en-IN');
  } catch { return utc; }
};
const gainColor = (n: number) => (n ?? 0) >= 0 ? 'text-green-600' : 'text-red-500';

// ── Service ───────────────────────────────────────────────────────────────────
const PREFERENCES = JSON.stringify([{
  dataOptions: [{ name: 'activeAssetsOnly', isRequired: true }],
}]);

async function fetchPortfolioSummary(
  groupBy: number,
  f: SummaryFilters
): Promise<SummaryResult> {
  // Single merged object — required by Investwell
  const filterObj: Record<string, unknown> = {
    startDate:   f.startDate ?? '1993-01-01',
    endDate:     f.endDate,
    pan:         f.pan,
    panWiseData: f.panWiseData,
  };
  const filters = JSON.stringify([filterObj]);
  const params  = { groupBy, filters, preferences: PREFERENCES };

  console.log(
    '=============================\nInvestwell Request\n=============================',
    '\nURL:',     '/aggregator/reports/getPortfolioSummaryForMutualFunds',
    '\nMethod:',  'GET',
    '\ngroupBy:', groupBy,
    '\nfilters:', filters,
    '\npreferences:', PREFERENCES,
    '\ntime:',   new Date().toISOString(),
  );

  const t0 = Date.now();
  let json: any;
  try {
    const { data } = await iwAxios.get('/aggregator/reports/getPortfolioSummaryForMutualFunds', { params });
    json = data;
  } catch (axiosErr: any) {
    const res  = axiosErr?.response;
    const body = res?.data;
    console.error(
      '=============================\nInvestwell Error\n=============================',
      '\nURL:',        '/aggregator/reports/getPortfolioSummaryForMutualFunds',
      '\nHTTP Status:', res?.status,
      '\ngroupBy:',    groupBy,
      '\nfilters:',    filters,
      '\npreferences:', PREFERENCES,
      '\ntoken exists:', !!(axiosErr?.config?.headers?.token),
      '\nResponse Body:', JSON.stringify(body),
      '\nAxios Error:',  axiosErr?.message,
      '\nStack:',       axiosErr?.stack,
    );
    if (body?.message) {
      const msg: string = body.message;
      const lower = msg.toLowerCase();
      if (lower.includes('client not found') || lower.includes('investor not found') || lower.includes('user not found'))
        throw Object.assign(new Error(msg), { kind: 'CLIENT_NOT_FOUND' });
      if (lower.includes('unauthorized'))
        throw Object.assign(new Error(msg), { kind: 'UNAUTHORIZED' });
      throw Object.assign(new Error(msg), { kind: 'API_ERROR' });
    }
    if (!res) throw Object.assign(new Error('Unable to connect to Investwell.'), { kind: 'NETWORK_ERROR' });
    throw Object.assign(new Error(`HTTP ${res.status}`), { kind: 'SERVER_ERROR' });
  }

  const elapsed = Date.now() - t0;
  console.log(
    '=============================\nInvestwell Response\n=============================',
    '\nHTTP Status:', 200,
    '\nAPI Status:',  json.status,
    '\nMessage:',    json.message,
    '\nElapsed:',    `${elapsed}ms`,
    '\nFull Response:', JSON.stringify(json),
  );

  if (json.status !== 0) {
    const msg: string = json.message || 'API error';
    const lower = msg.toLowerCase();
    if (lower.includes('unauthorized'))     throw Object.assign(new Error(msg), { kind: 'UNAUTHORIZED' });
    if (lower.includes('client not found') || lower.includes('user not found')) throw Object.assign(new Error(msg), { kind: 'CLIENT_NOT_FOUND' });
    if (lower.includes('no data'))          throw Object.assign(new Error(msg), { kind: 'NO_DATA' });
    throw Object.assign(new Error(msg), { kind: 'API_ERROR' });
  }

  const data: SummaryRow[] = (json.result?.data ?? []).map((row: SummaryRow) => ({
    ...row,
    currentNavDate: toIST(row.currentNavDate),
    XIRRData: (row.XIRRData ?? []).map((x: { amount: number; date: string }) => ({
      ...x,
      date: toIST(x.date),
    })),
  }));

  return { data, summary: json.result?.summary ?? {} };
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b animate-pulse">
    {Array.from({ length: 13 }).map((_, i) => (
      <td key={i} className="p-3"><div className="h-3 bg-muted rounded w-full" /></td>
    ))}
  </tr>
);

const NotFoundState: React.FC<{ pan: string; onRetry: () => void }> = ({ pan, onRetry }) => (
  <Card className="border-dashed">
    <CardContent className="p-12 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Search className="w-6 h-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-base font-semibold">No Portfolio Found</p>
        <p className="text-sm text-muted-foreground mt-1">
          We couldn't find any mutual fund portfolio for PAN <span className="font-mono font-medium">{pan}</span>.
        </p>
      </div>
      <ul className="text-sm text-muted-foreground text-left space-y-1">
        <li>• Investor is not registered in Investwell.</li>
        <li>• Portfolio has not been synced yet.</li>
        <li>• Incorrect PAN entered.</li>
      </ul>
      <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
        <RefreshCw className="w-3.5 h-3.5" /> Search Another PAN
      </Button>
    </CardContent>
  </Card>
);

const ErrorCard: React.FC<{ msg: string; kind?: string; pan: string; onRetry: () => void }> = ({ msg, kind, pan, onRetry }) => {
  if (kind === 'CLIENT_NOT_FOUND' || kind === 'NO_DATA') {
    return <NotFoundState pan={pan} onRetry={onRetry} />;
  }

  const display =
    kind === 'UNAUTHORIZED'  ? 'Session expired. Please log in again.' :
    kind === 'NETWORK_ERROR' ? 'Unable to contact Investwell. Please check your network or proxy.' :
    kind === 'SERVER_ERROR'  ? 'Investwell server error. Please try again later.' :
    msg;

  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="p-4 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
        <p className="text-sm text-destructive flex-1">{display}</p>
        <Button size="sm" variant="outline" className="shrink-0" onClick={onRetry}>Retry</Button>
      </CardContent>
    </Card>
  );
};

const Empty = ({ msg }: { msg: string }) => (
  <Card><CardContent className="p-12 text-center text-muted-foreground">{msg}</CardContent></Card>
);

// ── Summary strip ─────────────────────────────────────────────────────────────
const SummaryStrip: React.FC<{ s: Record<string, any> }> = ({ s }) => {
  const gain   = s.gain ?? s.unrealizedGain ?? 0;
  const netInv = s.netInvestment ?? s.openingBalance ?? 0;
  const items = [
    { label: 'Net Invested',   value: fmt(netInv),                              up: true },
    { label: 'Current Value',  value: fmt(s.currentValue ?? 0),                 up: true },
    { label: 'Gain / Loss',    value: `${gain >= 0 ? '+' : ''}${fmt(gain)}`,    up: gain >= 0 },
    { label: 'Abs. Return',    value: fmtPct(s.absoluteReturn ?? 0),            up: (s.absoluteReturn ?? 0) >= 0 },
    { label: 'XIRR',           value: `${(s.XIRR ?? 0).toFixed(2)}%`,           up: (s.XIRR ?? 0) >= 0 },
    { label: 'Avg Hold',       value: `${Math.round(s.avgHoldingDays ?? 0)}d`,  up: true },
    { label: 'Realized Gain',  value: fmt(s.realizedGain ?? 0),                 up: (s.realizedGain ?? 0) >= 0 },
    { label: 'Unrealized',     value: fmt(s.unrealizedGain ?? 0),               up: (s.unrealizedGain ?? 0) >= 0 },
  ];
  return (
    <div className="flex flex-wrap gap-3 mb-5 p-4 rounded-xl bg-muted/30 border">
      {items.map((item, i) => (
        <div key={i} className="flex-1 min-w-[100px]">
          <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
          <p className={`text-sm font-bold ${i < 2 ? 'text-foreground' : item.up ? 'text-green-600' : 'text-red-500'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

// ── Sortable table ────────────────────────────────────────────────────────────
const SummaryTable: React.FC<{ rows: SummaryRow[]; search: string; loading?: boolean }> = ({ rows, search, loading }) => {
  const [sortKey, setSortKey] = useState<SortKey>('currentValue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDownIcon className="w-3 h-3 inline ml-0.5" />)
      : null;

  const filtered = rows
    .filter(r => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [r.folioNo, r.schemeName, r.fundName, r.applicantName, r.pan, r.category2, r.objectiveName]
        .some(v => v?.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });

  const SortTh: React.FC<{ label: string; k: SortKey }> = ({ label, k }) => (
    <th
      className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground select-none"
      onClick={() => toggleSort(k)}
    >
      {label}<SortIcon k={k} />
    </th>
  );

  if (loading) return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
      </table>
    </CardContent></Card>
  );

  if (filtered.length === 0) return <Empty msg="No Mutual Fund Portfolio Found" />;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Folio No</th>
            <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Scheme</th>
            <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Fund</th>
            <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Category</th>
            <SortTh label="NAV"           k="currentNav" />
            <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Units</th>
            <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Net Invested</th>
            <SortTh label="Current Value" k="currentValue" />
            <SortTh label="Gain / Loss"   k="gain" />
            <SortTh label="Abs Return"    k="absoluteReturn" />
            <SortTh label="XIRR"          k="XIRR" />
            <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Benchmark</th>
            <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Avg Days</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => {
            const gain   = row.gain ?? row.unrealizedGain ?? 0;
            const netInv = row.netInvestment ?? row.openingBalance ?? 0;
            return (
              <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono text-xs text-muted-foreground">{row.folioNo || '—'}</td>
                <td className="p-3 max-w-[220px]">
                  <p className="font-medium truncate" title={row.schemeName}>{row.schemeName || row.applicantName || row.objectiveName || '—'}</p>
                  <p className="text-xs text-muted-foreground">{row.isinNo || row.pan || ''}</p>
                </td>
                <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{row.fundName || '—'}</td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {row.category2 || row.category || row.objectiveName || '—'}
                  </Badge>
                </td>
                <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                  ₹{(row.currentNav ?? 0).toFixed(3)}
                  <p className="text-xs opacity-60">{row.currentNavDate}</p>
                </td>
                <td className="p-3 text-right text-muted-foreground">{(row.currentUnits ?? 0).toFixed(3)}</td>
                <td className="p-3 text-right whitespace-nowrap">{fmt(netInv)}</td>
                <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? 0)}</td>
                <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(gain)}`}>
                  {gain >= 0 ? '+' : ''}{fmt(gain)}
                </td>
                <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>
                  {fmtPct(row.absoluteReturn ?? 0)}
                </td>
                <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.XIRR)}`}>
                  {(row.XIRR ?? 0).toFixed(2)}%
                </td>
                <td className="p-3 text-xs text-muted-foreground max-w-[140px] truncate">
                  {row.schemeBenchmarkName || '—'}
                </td>
                <td className="p-3 text-right text-muted-foreground">{Math.round(row.avgHoldingDays ?? 0)}d</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── Tab state factory ─────────────────────────────────────────────────────────
function useTabState() {
  const [data,    setData]    = useState<SummaryRow[]>([]);
  const [summary, setSummary] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<{ msg: string; kind?: string } | null>(null);
  return { data, setData, summary, setSummary, loading, setLoading, error, setError };
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const MFPortfolioSummaryPage: React.FC = () => {
  const [pan,      setPan]      = useState('');
  const [panInput, setPanInput] = useState('');
  const [endDate,  setEndDate]  = useState(new Date().toISOString().split('T')[0]);
  const [search,   setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState('byFolio');
  const loadedTabs = useRef<Set<string>>(new Set());
  const panRef     = useRef(pan);

  const folio    = useTabState();
  const scheme   = useTabState();
  const investor = useTabState();
  const category = useTabState();

  const load = useCallback(async (
    tab: string,
    groupBy: number,
    state: ReturnType<typeof useTabState>,
    p: string,
    panWiseData: 0 | 1 = 1
  ) => {
    state.setLoading(true);
    state.setError(null);
    try {
      const res = await fetchPortfolioSummary(groupBy, { pan: p, endDate, panWiseData });
      state.setData(res.data);
      state.setSummary(res.summary);
    } catch (e: any) {
      state.setError({ msg: e.message || 'Failed', kind: e.kind });
    } finally {
      state.setLoading(false);
    }
  }, [endDate]);

  const loadTab = useCallback((val: string, p = panRef.current) => {
    if (loadedTabs.current.has(val)) return;
    loadedTabs.current.add(val);
    if (val === 'byFolio')    load(val, 1005, folio,    p, 1);
    if (val === 'byScheme')   load(val, 1002, scheme,   p, 1);
    if (val === 'byInvestor') load(val, 100,  investor, p, 0);
    if (val === 'byCategory') load(val, 1004, category, p, 1);
  }, [load]);

  const applyPan = () => {
    const p = panInput.trim().toUpperCase();
    if (!p) return;
    panRef.current = p;
    setPan(p);
    loadedTabs.current = new Set();
    loadTab(activeTab, p);
  };

  const retryTab = (val: string) => {
    loadedTabs.current.delete(val);
    loadTab(val);
  };

  // No auto-fetch on mount — user must enter PAN and click Apply

  const topSum = Object.keys(folio.summary).length ? folio.summary : {};
  const gain   = topSum.gain ?? topSum.unrealizedGain ?? 0;
  const netInv = topSum.netInvestment ?? topSum.openingBalance ?? 0;

  const Header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Summary</h1>
        <p className="text-sm text-muted-foreground">Mutual Fund holdings with realized &amp; unrealized gains</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="PAN"
          className="w-32 uppercase text-xs h-8"
          value={panInput}
          onChange={e => setPanInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && applyPan()}
        />
        <input
          type="date"
          className="h-8 text-xs border rounded-md bg-background px-2 focus:outline-none focus:ring-1 focus:ring-ring w-32"
          value={endDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => setEndDate(e.target.value)}
        />
        <Button size="sm" className="h-8 bg-[#0D3B66] hover:bg-[#0a2f52]" onClick={applyPan}
          disabled={folio.loading || scheme.loading || investor.loading || category.loading}>
          Apply
        </Button>
        <Button variant="outline" size="sm" className="h-8" onClick={() => {
          setEndDate(new Date().toISOString().split('T')[0]);
          setPanInput(pan);
        }}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Download className="w-3.5 h-3.5" />Export
        </Button>
      </div>
    </div>
  );

  // Empty state — no PAN entered yet
  if (!pan) {
    return (
      <div className="space-y-5">
        {Header}
        <Card className="border-dashed border-2">
          <CardContent className="p-16 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#0D3B66]/10 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-[#0D3B66]" />
            </div>
            <p className="font-semibold text-foreground">Enter PAN and click “Apply”</p>
            <p className="text-sm text-muted-foreground">Your portfolio summary will appear here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {Header}

      {/* ── Hero banner ── */}
      {!folio.loading && Object.keys(topSum).length > 0 && (
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-[#0D3B66] to-[#1a5fa8] text-white">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Current Portfolio Value</p>
                <p className="text-4xl font-extrabold tracking-tight">{fmt(topSum.currentValue ?? 0)}</p>
                <div className="flex items-center gap-2 mt-2">
                  {gain >= 0
                    ? <TrendingUp className="w-4 h-4 text-green-300" />
                    : <TrendingDown className="w-4 h-4 text-red-300" />}
                  <span className={`text-sm font-semibold ${gain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {gain >= 0 ? '+' : ''}{fmt(gain)}
                  </span>
                  <span className="text-xs text-white/50">unrealized gain</span>
                </div>
                <p className="text-xs text-white/50 mt-3">PAN: {pan} · as of {endDate}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 lg:w-[55%]">
                {[
                  { icon: <Wallet className="w-4 h-4" />,     label: 'Net Invested',   value: fmt(netInv),                               up: true },
                  { icon: <TrendingUp className="w-4 h-4" />,  label: 'Abs. Return',   value: fmtPct(topSum.absoluteReturn ?? 0),        up: (topSum.absoluteReturn ?? 0) >= 0 },
                  { icon: <BarChart3 className="w-4 h-4" />,   label: 'XIRR',          value: `${(topSum.XIRR ?? 0).toFixed(2)}%`,      up: (topSum.XIRR ?? 0) >= 0 },
                  { icon: <Calendar className="w-4 h-4" />,    label: 'Avg Hold',      value: `${Math.round(topSum.avgHoldingDays ?? 0)}d`, up: true },
                  { icon: <BarChart3 className="w-4 h-4" />,   label: 'Realized Gain', value: fmt(topSum.realizedGain ?? 0),             up: (topSum.realizedGain ?? 0) >= 0 },
                  { icon: <TrendingUp className="w-4 h-4" />,  label: '1D Change',     value: fmt(topSum.oneDayChange ?? 0),             up: (topSum.oneDayChange ?? 0) >= 0 },
                ].map((m, i) => (
                  <div key={i} className="bg-white/5 hover:bg-white/10 transition-colors p-4">
                    <div className="flex items-center gap-1.5 text-white/50 mb-1">
                      {m.icon}
                      <span className="text-xs uppercase tracking-wide">{m.label}</span>
                    </div>
                    <p className={`text-base font-bold ${m.up ? 'text-white' : 'text-red-300'}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Tabs ── */}
      <Tabs defaultValue="byFolio" onValueChange={val => { setActiveTab(val); loadTab(val); }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="byFolio">By Folio</TabsTrigger>
            <TabsTrigger value="byScheme">By Scheme</TabsTrigger>
            <TabsTrigger value="byInvestor">By Investor</TabsTrigger>
            <TabsTrigger value="byCategory">By Sub-Category</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes, folios..."
              className="pl-9 w-52"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {([
          { val: 'byFolio',    state: folio,    groupBy: 1005 },
          { val: 'byScheme',   state: scheme,   groupBy: 1002 },
          { val: 'byInvestor', state: investor, groupBy: 100  },
          { val: 'byCategory', state: category, groupBy: 1004 },
        ] as const).map(({ val, state }) => (
          <TabsContent key={val} value={val}>
            {state.error ? (
              <ErrorCard msg={state.error.msg} kind={state.error.kind} pan={pan} onRetry={() => retryTab(val)} />
            ) : state.data.length === 0 && !state.loading ? (
              <Empty msg="No Mutual Fund Portfolio Found" />
            ) : (
              <>
                {!state.loading && Object.keys(state.summary).length > 0 && (
                  <SummaryStrip s={state.summary} />
                )}
                <SummaryTable rows={state.data} search={search} loading={state.loading} />
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MFPortfolioSummaryPage;
