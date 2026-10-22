import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import iwAxios from '@/api/axios';
import { resolvePAN } from '../hooks/useDemoPAN';

const todayStr = new Date().toISOString().split('T')[0];
const defaultFrom = '2000-01-01';

const PRODUCTS = [
  { name: 'MF', label: 'Mutual Funds' },
  { name: 'EQ', label: 'Shares & Bonds' },
  { name: 'AC', label: 'Other Assets' },
  { name: 'FD', label: 'Fixed Deposits' },
];

const ROW_LABELS: Record<string, string> = {
  openingBalance: 'Opening Balance',
  purchaseValue: 'Purchase Value',
  switchIn: 'Switch In',
  switchOut: 'Switch Out',
  dividend: 'Dividend',
  redemptionAmount: 'Redemption Amount',
  netAddition: 'Net Addition',
  currentValue: 'Current Value',
  gain: 'Gain / Loss',
  XIRR: 'XIRR (%)',
};

const fmt = (n: number | null | undefined, isXIRR = false) => {
  if (n == null || isNaN(n)) return '—';
  if (isXIRR) return `${Number(n).toFixed(2)}%`;
  return `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};


// ── Main Page ──────────────────────────────────────────────────────────────────
const MFSnapshotPage: React.FC = () => {
  const [pan, setPan] = useState(() => resolvePAN());
  const [panInput, setPanInput] = useState(() => resolvePAN());
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(todayStr);
  const [includeBenchmark, setIncludeBenchmark] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['MF', 'EQ', 'AC', 'FD']);

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  const toggleProduct = (p: string) =>
    setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const load = useCallback(async (currentPan: string, currentFrom: string, currentTo: string, products: string[], benchmark: boolean) => {
    if (!products.length) return;
    const safePan = currentPan.trim();
    setLoading(true); setError(null);
    try {
      const cappedTo = currentTo > todayStr ? todayStr : currentTo;
      const filters = [{ toDate: cappedTo }, { fromDate: currentFrom }, { pan: safePan, panWiseData: true }];
      const preferences = [
        { products: products.map(name => ({ name, isRequired: true })) },
        { includeBenchmark: benchmark },
      ];
      const { data } = await iwAxios.get('/aggregator/reports/getInvestmentSnapShot', {
        params: {
          filters: JSON.stringify(filters),
          preferences: JSON.stringify(preferences),
        },
      });
      if (data.status === -1) {
        const msg = data.message ?? '';
        if (msg === 'Client Not Found' || msg === 'Duplicate client found') { setRows([]); setFetched(true); return; }
        throw new Error(msg || 'Failed to fetch snapshot.');
      }
      if (data.status !== 0) throw new Error(data.message ?? 'Failed to fetch snapshot.');
      setRows(Array.isArray(data.result?.data) ? data.result.data : []);
      setFetched(true);
    } catch (err: any) {
      const apiMsg = (err as any).response?.data?.message;
      if (apiMsg === 'Client Not Found' || apiMsg === 'Duplicate client found') {
        setRows([]); setFetched(true);
      } else {
        setError(err.message ?? 'Failed to fetch snapshot.');
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(pan, fromDate, toDate, selectedProducts, includeBenchmark); }, [pan, fromDate, toDate]);

  const xirrRow = rows.find(r => r.name === 'XIRR');
  const currentRow = rows.find(r => r.name === 'currentValue');
  const gainRow = rows.find(r => r.name === 'gain');
  const purchaseRow = rows.find(r => r.name === 'purchaseValue');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Investment Snapshot</h1>
          <p className="text-muted-foreground text-sm">Your investment health at a glance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm border rounded-lg px-3 py-1.5 bg-muted/50">
            <span className="text-muted-foreground">PAN:</span>
            <input
              value={panInput}
              onChange={e => setPanInput(e.target.value.toUpperCase())}
              onKeyDown={e => { if (e.key === 'Enter') { const p = panInput.trim(); if (p) setPan(p); } }}
              onBlur={() => { const p = panInput.trim(); if (p) setPan(p); }}
              placeholder="Enter PAN"
              className="font-mono font-medium bg-transparent outline-none w-32 uppercase placeholder:text-muted-foreground/50"
            />
          </div>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            max={todayStr} className="text-sm border rounded-lg px-3 py-1.5 bg-background" />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            max={todayStr} className="text-sm border rounded-lg px-3 py-1.5 bg-background" />
          <Button variant="outline" size="sm" onClick={() => load(pan, fromDate, toDate, selectedProducts, includeBenchmark)} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Fetch
          </Button>
        </div>
      </div>

      {/* Product toggles */}
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map(p => (
          <button key={p.name} onClick={() => toggleProduct(p.name)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${selectedProducts.includes(p.name) ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'}`}>
            {p.label}
          </button>
        ))}
        <button onClick={() => setIncludeBenchmark(b => !b)}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${includeBenchmark ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'}`}>
          Benchmark XIRR
        </button>
      </div>

      {/* Live Snapshot Summary Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 p-10">
          <p className="text-red-500 text-sm text-center">{error}</p>
          <Button size="sm" variant="outline" onClick={() => load(pan, fromDate, toDate, selectedProducts, includeBenchmark)} className="gap-2"><RefreshCw className="w-3 h-3" /> Retry</Button>
        </div>
      ) : fetched && rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 gap-2">
          <p className="text-muted-foreground text-sm">No snapshot data available for the selected PAN and date range.</p>
          <p className="text-xs text-muted-foreground">Try selecting a different PAN or adjusting the date range.</p>
        </div>
      ) : rows.length > 0 && (
        <>
          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Current Value', value: fmt(currentRow?.total), sub: 'Total portfolio', color: 'text-blue-600' },
              { label: 'Invested Value', value: fmt(purchaseRow?.total), sub: 'Purchase cost', color: 'text-foreground' },
              { label: 'Gain / Loss', value: fmt(gainRow?.total), sub: gainRow?.total >= 0 ? 'Profit' : 'Loss', color: gainRow?.total >= 0 ? 'text-green-600' : 'text-red-500' },
              { label: 'XIRR', value: fmt(xirrRow?.total, true), sub: 'Annualised return', color: xirrRow?.total >= 0 ? 'text-green-600' : 'text-red-500' },
            ].map((kpi, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed breakdown table */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Snapshot Breakdown</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    {['Metric', 'Total', 'Equity', 'Hybrid', 'Other'].map(h => (
                      <th key={h} className="text-left p-3 font-medium text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const isXIRR = row.name === 'XIRR';
                    const isGain = row.name === 'gain';
                    return (
                      <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-xs">{ROW_LABELS[row.name] ?? row.name}</td>
                        <td className={`p-3 font-semibold text-xs ${isGain ? (row.total >= 0 ? 'text-green-600' : 'text-red-500') : ''}`}>
                          {fmt(row.total, isXIRR)}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{fmt(row.equity, isXIRR)}</td>
                        <td className="p-3 text-xs text-muted-foreground">{fmt(row.hybridValue, isXIRR)}</td>
                        <td className="p-3 text-xs text-muted-foreground">{fmt(row.other, isXIRR)}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}

    </div>
  );
};

export default MFSnapshotPage;
