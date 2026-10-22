import React, { useState, useEffect, useCallback } from 'react';
import { Search, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import iwAxios from '@/api/axios';

// ─── Types (matching exact API response) ─────────────────────────────────────
interface Holding {
  holdings: string;
  instruments: string;
  netAsset: number;
  sector: string;
}
interface Sector {
  sectorRating: string;
  netAsset: number;
  fsid: number;
}
interface CalReturn { schid: number; Year: number; RET: number; }
interface TrailingReturn {
  '30Day': number; '3Month': number; '6Month': number;
  '1Year': number; '2Year': number; '3Year': number;
  '5Year': number; '7Year': number; '10Year': number;
}
interface BenchmarkTrailingReturn {
  '30DayBenchMarkReturn': number; '3MonthBenchMarkReturn': number;
  '6MonthBenchMarkReturn': number; '1YearBenchMarkReturn': number;
  '2YearBenchMarkReturn': number; '3YearBenchMarkReturn': number;
  '5YearBenchMarkReturn': number; '7YearBenchMarkReturn': number;
  '10YearBenchMarkReturn': number;
}
interface FactsheetData {
  name: string; schid: number; fsid: string; category: string;
  weekLow: string; weekHigh: string; weekHighDate: string; weekLowDate: string;
  launchDate: string; factSheetDate: string; closeEnded: string;
  currentNAV: number; navDate: string;
  '1Day': number; '30Day': number; '3Month': number;
  '6Month': number; '1Year': number; '2Year': number;
  '3Year': number; '5Year': number; '7Year': number; '10Year': number;
  beta: number; alpha: number; mean: number; standardDev: number;
  sharpRatio: number; corpus: number; sipMinAmount: number;
  purchaseMinAmount: number; taxStat: string; taxStat2: string; taxSaving: string;
  schObjective: string; expenseRatio: number; fundRat: number; changePercent: number;
  goldPercent: number; globalEquityPercent: number; vOther: number;
  vEquity: number; vDebt: number; fundName: string;
  avgMat: number; ytm: number; modifiedDuration: number; risk: number;
  benchmarkSchid: number; midCap: number; smallCap: number; largeCap: number;
  currentNavWeekhighPercentageDiff: string;
  benchmark: string; fundManager: string; fundManager2: string; fundManager3: string;
  exitLoad: string;
  trailingReturn: TrailingReturn;
  benchmarkTrailingReturn: BenchmarkTrailingReturn;
  calenderReturn: CalReturn[];
  benchmarkCalenderReturn: CalReturn[];
  holdings: Holding[];
  sectors: Sector[];
}

// ─── Quick-pick funds ─────────────────────────────────────────────────────────
const QUICK_PICKS = [
  { label: 'Axis Large Cap',        isin: 'INF846K01164' },
  { label: 'Mirae Asset Large Cap', isin: 'INF769K01010' },
  { label: 'Parag Parikh Flexi',    isin: 'INF879O01019' },
  { label: 'SBI Small Cap',         isin: 'INF200K01RB2' },
  { label: 'HDFC Mid-Cap',          isin: 'INF179K01VQ8' },
  { label: 'ICICI Pru Balanced',    isin: 'INF109K01Z13' },
];

// ─── Risk metadata ────────────────────────────────────────────────────────────
const RISK_META: Record<number, { label: string; cls: string; bar: string }> = {
  1: { label: 'Low',              cls: 'bg-green-100 text-green-700',   bar: 'bg-green-500' },
  2: { label: 'Low to Moderate',  cls: 'bg-lime-100 text-lime-700',     bar: 'bg-lime-500' },
  3: { label: 'Moderate',         cls: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-400' },
  4: { label: 'Moderately High',  cls: 'bg-orange-100 text-orange-700', bar: 'bg-orange-400' },
  5: { label: 'High',             cls: 'bg-red-100 text-red-700',       bar: 'bg-red-500' },
  6: { label: 'Very High',        cls: 'bg-red-200 text-red-800',       bar: 'bg-red-700' },
};

// ─── Trailing return column config ───────────────────────────────────────────
const TR_COLS: { label: string; fundKey: keyof TrailingReturn; bmKey: keyof BenchmarkTrailingReturn }[] = [
  { label: '1M',  fundKey: '30Day',   bmKey: '30DayBenchMarkReturn' },
  { label: '3M',  fundKey: '3Month',  bmKey: '3MonthBenchMarkReturn' },
  { label: '6M',  fundKey: '6Month',  bmKey: '6MonthBenchMarkReturn' },
  { label: '1Y',  fundKey: '1Year',   bmKey: '1YearBenchMarkReturn' },
  { label: '2Y',  fundKey: '2Year',   bmKey: '2YearBenchMarkReturn' },
  { label: '3Y',  fundKey: '3Year',   bmKey: '3YearBenchMarkReturn' },
  { label: '5Y',  fundKey: '5Year',   bmKey: '5YearBenchMarkReturn' },
  { label: '7Y',  fundKey: '7Year',   bmKey: '7YearBenchMarkReturn' },
  { label: '10Y', fundKey: '10Year',  bmKey: '10YearBenchMarkReturn' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const f2 = (n: number | string | undefined) =>
  n != null && !isNaN(Number(n)) ? parseFloat(String(n)).toFixed(2) : '—';

const signed = (n: number | undefined) =>
  n == null ? '—' : `${n > 0 ? '+' : ''}${f2(n)}%`;

const gc = (n: number | undefined) =>
  !n || n === 0 ? 'text-gray-600' : n > 0 ? 'text-green-600' : 'text-red-500';

const fmtDate = (s: string) => {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return s; }
};

// ─── Small reusable pieces ────────────────────────────────────────────────────
const KV = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) => (
  <div className="bg-muted/40 rounded-xl p-4 border">
    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
    <p className="font-bold text-sm text-foreground leading-snug">{value}</p>
    {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const Bar = ({ value, color, max = 100 }: { value: number; color: string; max?: number }) => (
  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min((value / max) * 100, 100))}%` }} />
  </div>
);

const SecTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{children}</p>
);

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-10 h-10 border-4 border-[#0D3B66] border-t-transparent rounded-full animate-spin" />
    <p className="text-sm text-muted-foreground">Fetching factsheet data…</p>
  </div>
);

// ─── API call ─────────────────────────────────────────────────────────────────
async function fetchFactsheetAPI(isinNo: string, signal: AbortSignal): Promise<FactsheetData> {
  const { data: json } = await iwAxios.get('/aggregator/utils/getFactsheetData', {
    params: { isinNo: isinNo.trim().toUpperCase() },
    signal,
  });
  if (json.status !== 0) throw new Error(json.message || 'API returned error');
  if (!json.results?.data) throw new Error('No data in response');
  return json.results.data as FactsheetData;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const MFSchemeFactsheetPage: React.FC = () => {
  const [inputVal, setInputVal]   = useState('INF846K01164');
  const [activeIsin, setActiveIsin] = useState('INF846K01164');
  const [data, setData]           = useState<FactsheetData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  const load = useCallback((isin: string) => {
    const trimmed = isin.trim().toUpperCase();
    if (!trimmed) return;
    setActiveIsin(trimmed);
    setInputVal(trimmed);
  }, []);

  // Auto-load when activeIsin changes
  useEffect(() => {
    if (!activeIsin) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError('');
    setData(null);
    setShowAllHoldings(false);

    fetchFactsheetAPI(activeIsin, ctrl.signal)
      .then(d => setData(d))
      .catch(e => { if (e.name !== 'AbortError') setError(e.message || 'Failed to fetch factsheet'); })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [activeIsin]);

  const risk = data ? (RISK_META[data.risk] ?? { label: `Level ${data.risk}`, cls: 'bg-gray-100 text-gray-700', bar: 'bg-gray-400' }) : null;
  const displayedHoldings = data ? (showAllHoldings ? data.holdings : data.holdings.slice(0, 15)) : [];
  const maxSector = data?.sectors.length ? Math.max(...data.sectors.map(s => s.netAsset)) : 100;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scheme Factsheet</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            View complete scheme details — holdings, returns, allocation &amp; more
          </p>
        </div>
      </div>

      {/* ── Search Card ── */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-9 font-mono uppercase"
                placeholder="Enter ISIN  e.g. INF846K01164"
                value={inputVal}
                onChange={e => setInputVal(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && load(inputVal)}
              />
            </div>
            <Button
              className="bg-[#0D3B66] hover:bg-[#0a2f52] text-white px-6 gap-2"
              onClick={() => load(inputVal)}
              disabled={loading}
            >
              {loading
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading</>
                : <><Search className="w-4 h-4" /> Get Factsheet</>}
            </Button>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Quick picks:</span>
            {QUICK_PICKS.map(q => (
              <button
                key={q.isin}
                onClick={() => load(q.isin)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                  activeIsin === q.isin && data
                    ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                    : 'border-border text-muted-foreground hover:border-[#0D3B66] hover:text-[#0D3B66] bg-background'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── States ── */}
      {loading && <Spinner />}

      {!loading && error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">Failed to load factsheet</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => load(activeIsin)} className="gap-1">
              <RefreshCw className="w-3 h-3" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && !data && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Search className="w-14 h-14 text-muted-foreground/20" />
            <p className="font-semibold text-muted-foreground">Search for a scheme by ISIN</p>
            <p className="text-sm text-muted-foreground">Enter any valid ISIN above or choose from the quick picks</p>
          </CardContent>
        </Card>
      )}

      {/* ════════════════ FACTSHEET DATA ════════════════ */}
      {!loading && data && (
        <div className="space-y-5">

          {/* ── Hero Banner ── */}
          <div className="rounded-2xl overflow-hidden">
            <div className="bg-[#0D3B66] px-6 pt-6 pb-5 text-white">
              <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">{data.fundName}</p>
                  <h2 className="text-xl font-bold leading-snug mb-2">{data.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/15 text-white border-0 text-xs">{data.category}</Badge>
                    <Badge className="bg-white/15 text-white border-0 text-xs">{data.taxStat}</Badge>
                    {data.taxSaving === 'Y' && (
                      <Badge className="bg-emerald-500/80 text-white border-0 text-xs">Tax Saving (ELSS)</Badge>
                    )}
                    {risk && (
                      <Badge className={`${risk.cls} border-0 text-xs`}>Risk: {risk.label}</Badge>
                    )}
                    <Badge className="bg-white/15 text-white border-0 text-xs">
                      {data.closeEnded === 'Y' ? 'Close Ended' : 'Open Ended'}
                    </Badge>
                  </div>
                </div>

                {/* NAV Box */}
                <div className="shrink-0 bg-white/10 rounded-xl px-5 py-4 text-right">
                  <p className="text-blue-300 text-xs mb-0.5">Current NAV</p>
                  <p className="text-3xl font-bold">₹{f2(data.currentNAV)}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{fmtDate(data.navDate)}</p>
                  <p className={`text-xs font-semibold mt-1 ${gc(data.changePercent)}`}>
                    {data.changePercent >= 0 ? '▲' : '▼'} {f2(Math.abs(data.changePercent))}% today
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-bar: 52W high/low diff */}
            <div className="bg-[#0a2f52] px-6 py-3 flex flex-wrap gap-6 text-xs text-blue-200">
              <span>52W High: <strong className="text-white">₹{data.weekHigh}</strong> ({fmtDate(data.weekHighDate)})</span>
              <span>52W Low: <strong className="text-white">₹{data.weekLow}</strong> ({fmtDate(data.weekLowDate)})</span>
              <span>From 52W High: <strong className={data.currentNavWeekhighPercentageDiff?.startsWith('-') ? 'text-red-300' : 'text-green-300'}>
                {data.currentNavWeekhighPercentageDiff}%
              </strong></span>
              <span>Launch: <strong className="text-white">{data.launchDate}</strong></span>
              <span>Factsheet Date: <strong className="text-white">{fmtDate(data.factSheetDate)}</strong></span>
            </div>
          </div>

          {/* ── Key Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KV label="AUM" value={`₹${data.corpus.toLocaleString('en-IN')} Cr`} />
            <KV label="Expense Ratio" value={`${f2(data.expenseRatio)}%`} />
            <KV label="Min SIP" value={`₹${data.sipMinAmount.toLocaleString('en-IN')}`} />
            <KV label="Min Lumpsum" value={`₹${data.purchaseMinAmount.toLocaleString('en-IN')}`} />
            <KV label="Benchmark" value={data.benchmark} />
            <KV label="Fund Rating" value={`${'★'.repeat(data.fundRat)}${'☆'.repeat(5 - data.fundRat)}`} />
            <KV label="ISIN" value={<span className="font-mono text-xs">{activeIsin}</span>} />
            <KV label="Scheme ID" value={data.schid.toString()} />
          </div>

          {/* ── Objective ── */}
          {data.schObjective && (
            <Card>
              <CardContent className="p-5">
                <SecTitle>Scheme Objective</SecTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.schObjective}</p>
              </CardContent>
            </Card>
          )}

          {/* ── Fund Managers + Exit Load ── */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <SecTitle>Fund Managers</SecTitle>
                <div className="flex flex-wrap gap-2">
                  {[data.fundManager, data.fundManager2, data.fundManager3]
                    .filter(fm => fm?.trim())
                    .map((fm, i) => (
                      <span key={i} className="bg-[#0D3B66]/10 text-[#0D3B66] border border-[#0D3B66]/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                        {fm}
                      </span>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <SecTitle>Exit Load</SecTitle>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-900">{data.exitLoad || 'Nil'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Trailing Returns ── */}
          <Card>
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Trailing Returns (%) — Fund vs Benchmark
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-3 text-muted-foreground font-medium text-xs w-28">Period →</th>
                      {TR_COLS.map(c => (
                        <th key={c.label} className="py-2 px-2 text-center text-muted-foreground font-medium text-xs">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Fund row */}
                    <tr className="border-b bg-[#0D3B66]/5">
                      <td className="py-3 pr-3 font-bold text-[#0D3B66] text-xs">Fund</td>
                      {TR_COLS.map(c => {
                        const v = data.trailingReturn[c.fundKey];
                        return (
                          <td key={c.label} className={`py-3 px-2 text-center font-bold text-sm ${gc(v)}`}>
                            {signed(v)}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Benchmark row */}
                    <tr>
                      <td className="py-3 pr-3 font-semibold text-muted-foreground text-xs">Benchmark</td>
                      {TR_COLS.map(c => {
                        const v = data.benchmarkTrailingReturn[c.bmKey];
                        return (
                          <td key={c.label} className={`py-3 px-2 text-center font-semibold text-sm ${gc(v)}`}>
                            {signed(v)}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Diff row */}
                    <tr className="border-t bg-muted/30">
                      <td className="py-2 pr-3 text-xs text-muted-foreground">Outperformance</td>
                      {TR_COLS.map(c => {
                        const fv = data.trailingReturn[c.fundKey] ?? 0;
                        const bv = data.benchmarkTrailingReturn[c.bmKey] ?? 0;
                        const diff = fv - bv;
                        return (
                          <td key={c.label} className={`py-2 px-2 text-center text-xs font-semibold ${gc(diff)}`}>
                            {diff === 0 ? '—' : `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Calendar Returns ── */}
          {data.calenderReturn?.length > 0 && (
            <Card>
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Calendar Year Returns (%) — Fund vs Benchmark
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-3 text-muted-foreground font-medium text-xs w-28">Year →</th>
                        {data.calenderReturn.map(r => (
                          <th key={r.Year} className="py-2 px-4 text-center text-muted-foreground font-medium">{r.Year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-[#0D3B66]/5">
                        <td className="py-3 pr-3 font-bold text-[#0D3B66] text-xs">Fund</td>
                        {data.calenderReturn.map(r => (
                          <td key={r.Year} className={`py-3 px-4 text-center font-bold text-sm ${gc(r.RET)}`}>
                            {signed(r.RET)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 pr-3 font-semibold text-muted-foreground text-xs">Benchmark</td>
                        {data.benchmarkCalenderReturn.map(r => (
                          <td key={r.Year} className={`py-3 px-4 text-center font-semibold text-sm ${gc(r.RET)}`}>
                            {signed(r.RET)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Allocation + Risk ── */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* Asset + Market Cap */}
            <Card>
              <CardContent className="p-5 space-y-5">
                <div>
                  <SecTitle>Asset Allocation</SecTitle>
                  <div className="space-y-3">
                    {[
                      { label: 'Equity', val: data.vEquity,     color: 'bg-[#0D3B66]' },
                      { label: 'Debt',   val: data.vDebt,       color: 'bg-[#11B5E4]' },
                      { label: 'Gold',   val: data.goldPercent, color: 'bg-yellow-400' },
                      { label: 'Other',  val: data.vOther,      color: 'bg-gray-400' },
                    ].filter(a => a.val > 0).map(a => (
                      <div key={a.label}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-medium">{a.label}</span>
                          <span className="font-bold">{f2(a.val)}%</span>
                        </div>
                        <Bar value={a.val} color={a.color} />
                      </div>
                    ))}
                  </div>
                </div>

                {(data.largeCap > 0 || data.midCap > 0 || data.smallCap > 0) && (
                  <div className="pt-4 border-t">
                    <SecTitle>Market Cap Split</SecTitle>
                    <div className="space-y-3">
                      {[
                        { label: 'Large Cap', val: data.largeCap, color: 'bg-blue-600' },
                        { label: 'Mid Cap',   val: data.midCap,   color: 'bg-violet-500' },
                        { label: 'Small Cap', val: data.smallCap, color: 'bg-pink-500' },
                      ].filter(m => m.val > 0).map(m => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-medium">{m.label}</span>
                            <span className="font-bold">{f2(m.val)}%</span>
                          </div>
                          <Bar value={m.val} color={m.color} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Debt metrics if applicable */}
                {data.vDebt > 0 && (data.avgMat > 0 || data.ytm > 0 || data.modifiedDuration > 0) && (
                  <div className="pt-4 border-t">
                    <SecTitle>Debt Metrics</SecTitle>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Avg Maturity', val: `${f2(data.avgMat)} yrs` },
                        { label: 'YTM',           val: `${f2(data.ytm)}%` },
                        { label: 'Mod Duration',  val: `${f2(data.modifiedDuration)} yrs` },
                      ].map(d => (
                        <div key={d.label} className="bg-muted/50 rounded-lg p-2.5 text-center border">
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">{d.label}</p>
                          <p className="font-bold text-xs mt-1">{d.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card>
              <CardContent className="p-5">
                <SecTitle>Risk Metrics</SecTitle>

                {/* Risk-o-meter */}
                {risk && (
                  <div className="flex items-center gap-3 mb-5 p-3 rounded-xl border bg-muted/30">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${risk.bar}`}>
                      {data.risk}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className="font-bold">{risk.label}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-muted-foreground">Fund Rating</p>
                      <p className="font-bold text-amber-500">{'★'.repeat(data.fundRat)}{'☆'.repeat(5 - data.fundRat)}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Alpha',        val: `${f2(data.alpha)}%`,       note: data.alpha > 0 ? 'Outperforming' : 'Underperforming' },
                    { label: 'Beta',         val: f2(data.beta),              note: data.beta < 1 ? 'Less volatile' : 'More volatile' },
                    { label: 'Sharpe Ratio', val: f2(data.sharpRatio),        note: data.sharpRatio > 1 ? 'Good' : data.sharpRatio > 0 ? 'Acceptable' : 'Poor' },
                    { label: 'Std Deviation', val: `${f2(data.standardDev)}%`, note: 'Volatility' },
                    { label: 'Mean Return',  val: `${f2(data.mean)}%`,        note: 'Avg annual' },
                  ].map(m => (
                    <div key={m.label} className="bg-muted/40 rounded-xl p-3 border">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{m.label}</p>
                      <p className="font-bold text-base mt-1">{m.val}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{m.note}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Holdings Table ── */}
          <Card>
            <CardHeader className="pb-2 pt-5 px-5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Portfolio Holdings ({data.holdings.length} stocks)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-y">
                      <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">#</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Holding</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Sector</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Instrument</th>
                      <th className="text-right px-5 py-2.5 font-medium text-muted-foreground text-xs">% Net Assets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedHoldings.map((h, i) => (
                      <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 text-muted-foreground text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold max-w-[220px]">
                          <p className="truncate" title={h.holdings}>{h.holdings}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">{h.sector}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{h.instruments}</td>
                        <td className={`px-5 py-3 text-right font-bold ${h.netAsset >= 0 ? 'text-[#0D3B66]' : 'text-red-500'}`}>
                          {f2(h.netAsset)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.holdings.length > 15 && (
                <div className="px-5 py-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[#0D3B66] hover:bg-[#0D3B66]/5 text-xs"
                    onClick={() => setShowAllHoldings(p => !p)}
                  >
                    {showAllHoldings
                      ? `Show Top 15 Only`
                      : `Show All ${data.holdings.length} Holdings`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Sector Allocation ── */}
          <Card>
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Sector Allocation ({data.sectors.length} sectors)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {data.sectors.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-foreground">{s.sectorRating}</span>
                      <span className="font-bold">{f2(s.netAsset)}%</span>
                    </div>
                    <Bar value={s.netAsset} color="bg-[#11B5E4]" max={maxSector} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Footer note ── */}
          <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/40 border text-xs text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              ISIN: <span className="font-mono font-semibold text-foreground">{activeIsin}</span> ·
              Data sourced from InvestWell API · Last updated: {fmtDate(data.navDate)} ·
              Past performance is not indicative of future returns.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default MFSchemeFactsheetPage;
