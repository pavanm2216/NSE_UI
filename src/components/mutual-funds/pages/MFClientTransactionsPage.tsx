import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getClientTransactions,
  getFDTransactions,
  getOtherAssetTransactions,
  getSBTransactions,
  invalidateCache,
} from '@/services/investwell/clientTransactions';
import type {
  ClientTransaction,
  FDTransaction,
  OtherAssetTransaction,
  SBTransaction,
} from '@/types/clientTransactions';

// ── Constants ──────────────────────────────────────────────────────────────────
const TXN_LABEL: Record<string, string> = {
  NRP: 'Purchase', SIP: 'SIP', STI: 'Switch In', SWI: 'SWI',
  DIR: 'Dividend', BON: 'Bonus', NRS: 'Redemption', STO: 'STO',
  SWO: 'Switch Out', SWP: 'SWP', DVP: 'Div Payout',
};

const TXN_COLOR: Record<string, string> = {
  NRP: 'bg-green-100 text-green-700',
  SIP: 'bg-orange-100 text-orange-700',
  STI: 'bg-blue-100 text-blue-700',
  SWI: 'bg-blue-100 text-blue-700',
  DIR: 'bg-purple-100 text-purple-700',
  BON: 'bg-yellow-100 text-yellow-700',
  NRS: 'bg-red-100 text-red-700',
  STO: 'bg-red-100 text-red-700',
  SWO: 'bg-red-100 text-red-700',
  SWP: 'bg-red-100 text-red-700',
  DVP: 'bg-purple-100 text-purple-700',
};

const todayStr = new Date().toISOString().split('T')[0];

const fmt = (n: number | null | undefined) =>
  n == null || isNaN(n) ? '—' : `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d?: string) => {
  if (!d) return '-';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
    }).format(new Date(d));
  } catch { return d; }
};

// ── Shared UI ──────────────────────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex items-center justify-center p-20">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-16 gap-4">
    <p className="text-red-500 text-sm text-center max-w-md">{message}</p>
    <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
      <RefreshCw className="w-3 h-3" /> Retry
    </Button>
  </div>
);

// ── Virtualized MF Table ───────────────────────────────────────────────────────
const MF_HEADERS = ['NAV Date', 'Client', 'Scheme', 'Folio', 'Type', 'Units', 'NAV', 'Amount', 'Stamp Duty', 'STT', 'Total Amount', 'ISIN', 'ARN'];
const ROW_HEIGHT = 44;

const MFTransactionsTable = React.memo(({ rows }: { rows: ClientTransaction[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground text-sm">
          No transactions found for the selected date range
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[1100px]">
            <thead>
              <tr className="border-b bg-muted/40">
                {MF_HEADERS.map(h => (
                  <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div ref={parentRef} className="overflow-auto" style={{ height: Math.min(rows.length * ROW_HEIGHT, 520) }}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            <table className="w-full text-sm table-fixed min-w-[1100px]">
              <tbody>
                {virtualizer.getVirtualItems().map(vRow => {
                  const row = rows[vRow.index];
                  return (
                    <tr
                      key={vRow.key}
                      style={{ position: 'absolute', top: vRow.start, left: 0, width: '100%', height: ROW_HEIGHT }}
                      className="border-b hover:bg-muted/30 transition-colors flex items-center"
                    >
                      <td className="p-3 text-muted-foreground text-xs whitespace-nowrap w-[90px]">{fmtDate(row.navDate)}</td>
                      <td className="p-3 text-xs whitespace-nowrap w-[110px] truncate">{row.investorName ?? row.clientName ?? '-'}</td>
                      <td className="p-3 font-medium w-[180px] truncate" title={row.schemeName}>{row.schemeName ?? '-'}</td>
                      <td className="p-3 text-muted-foreground text-xs w-[90px]">{row.folioNo ?? '-'}</td>
                      <td className="p-3 w-[90px]">
                        <Badge className={`text-xs ${TXN_COLOR[row.txnType] ?? 'bg-muted text-muted-foreground'}`}>
                          {TXN_LABEL[row.txnType] ?? row.txnType ?? '-'}
                        </Badge>
                      </td>
                      <td className="p-3 w-[80px]">{row.units != null ? Number(row.units).toLocaleString('en-IN', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '-'}</td>
                      <td className="p-3 w-[80px]">{row.nav != null ? `₹${Number(row.nav).toFixed(4)}` : '-'}</td>
                      <td className="p-3 font-medium w-[90px]">{fmt(row.amount)}</td>
                      <td className="p-3 text-muted-foreground text-xs w-[80px]">{row.stampDuty != null ? `₹${Number(row.stampDuty).toFixed(4)}` : '—'}</td>
                      <td className="p-3 text-muted-foreground text-xs w-[80px]">{row.STT != null ? `₹${Number(row.STT).toFixed(4)}` : '—'}</td>
                      <td className="p-3 font-medium w-[100px]">{fmt(row.totalAmount)}</td>
                      <td className="p-3 text-muted-foreground text-xs font-mono w-[110px]">{row.isinNo ?? '-'}</td>
                      <td className="p-3 text-muted-foreground text-xs w-[80px]">{row.arnNo ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-4 py-2 border-t text-xs text-muted-foreground">
          {rows.length.toLocaleString()} transaction{rows.length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
});

// ── FD Table ───────────────────────────────────────────────────────────────────
const FDTransactionsTable = React.memo(({ rows }: { rows: FDTransaction[] }) => (
  <Card>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {['Investor', 'FD Name', 'FD Type', 'Start Date', 'End Date', 'Tenure', 'Amount', 'Interest Rate', 'ARN', 'Ref No', 'Bank'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={11} className="p-10 text-center text-muted-foreground text-sm">No fixed deposit transactions found</td></tr>
          ) : rows.map((row, i) => (
            <motion.tr
              key={row.refNo ?? `${row.fixedAssetName}-${row.startDate}-${i}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.2) }}
              className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 text-xs whitespace-nowrap">{row.investorName ?? '-'}</td>
              <td className="p-3 font-medium max-w-[200px] truncate" title={row.fixedAssetName}>{row.fixedAssetName ?? row.scheme ?? '-'}</td>
              <td className="p-3 text-xs">{row.fdType ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(row.startDate)}</td>
              <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(row.endDate)}</td>
              <td className="p-3 text-xs">{row.month ? `${row.month}M` : row.day ? `${row.day}D` : '-'}</td>
              <td className="p-3 font-medium">{fmt(row.amount)}</td>
              <td className="p-3 text-xs">{row.rateOfInterest != null ? `${row.rateOfInterest}%` : '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{row.arnNo ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs font-mono">{row.refNo ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{row.paymentDetails?.bank ?? '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
));

// ── Other Asset Table ──────────────────────────────────────────────────────────
const OtherAssetTable = React.memo(({ rows }: { rows: OtherAssetTransaction[] }) => (
  <Card>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {['Investor', 'Asset Name', 'Asset Type', 'Date', 'Amount', 'Account No', 'Ref ID'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={7} className="p-10 text-center text-muted-foreground text-sm">No other asset transactions found</td></tr>
          ) : rows.map((row, i) => (
            <motion.tr
              key={row.txnReferenceId ?? `${row.assetName}-${row.date}-${i}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.2) }}
              className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 text-xs whitespace-nowrap">{row.investor ?? '-'}</td>
              <td className="p-3 font-medium max-w-[200px] truncate" title={row.assetName}>{row.assetName ?? '-'}</td>
              <td className="p-3 text-xs">{row.assetType ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(row.date)}</td>
              <td className="p-3 font-medium">{fmt(row.amount ?? row.amt)}</td>
              <td className="p-3 text-muted-foreground text-xs font-mono">{row.accountNumber ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs font-mono">{row.txnReferenceId ?? '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
));

// ── Shares & Bonds Table ───────────────────────────────────────────────────────
const SBTransactionsTable = React.memo(({ rows }: { rows: SBTransaction[] }) => (
  <Card>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {['Client', 'Scrip / Bond', 'ISIN', 'Type', 'Purchase Value', 'Current Value', 'Gain', 'CAGR', 'Abs Return', 'Holding Days'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={10} className="p-10 text-center text-muted-foreground text-sm">No transactions found</td></tr>
          ) : rows.map((row, i) => (
            <motion.tr
              key={row.isinNo ?? `${row.schemeName}-${i}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.2) }}
              className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 text-xs whitespace-nowrap">{row.applicantName ?? row.clientName ?? '-'}</td>
              <td className="p-3 font-medium max-w-[200px] truncate" title={row.schemeName ?? row.fixedAssetName}>{row.schemeName ?? row.fixedAssetName ?? '-'}</td>
              <td className="p-3 text-muted-foreground text-xs font-mono">{row.isinNo ?? '-'}</td>
              <td className="p-3 text-xs">{row.pdType ?? row.txnType ?? '-'}</td>
              <td className="p-3 font-medium">{fmt(row.purchaseValue)}</td>
              <td className="p-3 font-medium text-blue-600">{fmt(row.currentValue)}</td>
              <td className="p-3 text-xs">
                {row.gain != null
                  ? <span className={row.gain >= 0 ? 'text-green-600' : 'text-red-500'}>{fmt(row.gain)}</span>
                  : '-'}
              </td>
              <td className="p-3 text-xs">{row.CAGR != null ? `${Number(row.CAGR).toFixed(2)}%` : '-'}</td>
              <td className="p-3 text-xs">{row.absoluteReturn != null ? `${Number(row.absoluteReturn).toFixed(2)}%` : '-'}</td>
              <td className="p-3 text-muted-foreground text-xs">{row.avgHoldingDays ?? '-'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
));

// ── Main Page ──────────────────────────────────────────────────────────────────
type TabKey = 'mutualFunds' | 'sharesBonds' | 'fixedDeposit' | 'otherAsset';

interface TabState<T> { rows: T[]; loading: boolean; error: string | null }
function initTab<T>(): TabState<T> { return { rows: [], loading: false, error: null }; }

const MFClientTransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('mutualFunds');
  const [pan, setPan] = useState('');
  const [panInput, setPanInput] = useState('');
  const [fromDate, setFromDate] = useState('2015-01-01');
  const [toDate, setToDate] = useState(todayStr);

  const [mf, setMf] = useState<TabState<ClientTransaction>>(initTab());
  const [fd, setFd] = useState<TabState<FDTransaction>>(initTab());
  const [oa, setOa] = useState<TabState<OtherAssetTransaction>>(initTab());
  const [sb, setSb] = useState<TabState<SBTransaction>>(initTab());

  const loadMF = useCallback(async (force = false) => {
    if (!pan) return;
    if (force) invalidateCache(pan);
    setMf(s => ({ ...s, loading: true, error: null }));
    try {
      const rows = await getClientTransactions(pan, 'M', fromDate, toDate);
      setMf({ rows, loading: false, error: null });
    } catch (e: unknown) {
      setMf(s => ({ ...s, loading: false, error: (e as Error).message ?? 'Failed to fetch' }));
    }
  }, [pan, fromDate, toDate]);

  const loadFD = useCallback(async (force = false) => {
    if (!pan) return;
    if (force) invalidateCache(pan);
    setFd(s => ({ ...s, loading: true, error: null }));
    try {
      const rows = await getFDTransactions(pan);
      setFd({ rows, loading: false, error: null });
    } catch (e: unknown) {
      setFd(s => ({ ...s, loading: false, error: (e as Error).message ?? 'Failed to fetch' }));
    }
  }, [pan]);

  const loadOA = useCallback(async (force = false) => {
    if (!pan) return;
    if (force) invalidateCache(pan);
    setOa(s => ({ ...s, loading: true, error: null }));
    try {
      const rows = await getOtherAssetTransactions(pan);
      setOa({ rows, loading: false, error: null });
    } catch (e: unknown) {
      setOa(s => ({ ...s, loading: false, error: (e as Error).message ?? 'Failed to fetch' }));
    }
  }, [pan]);

  const loadSB = useCallback(async (force = false) => {
    if (!pan) return;
    if (force) invalidateCache(pan);
    setSb(s => ({ ...s, loading: true, error: null }));
    try {
      const rows = await getSBTransactions(pan);
      setSb({ rows, loading: false, error: null });
    } catch (e: unknown) {
      setSb(s => ({ ...s, loading: false, error: (e as Error).message ?? 'Failed to fetch' }));
    }
  }, [pan]);

  const loaders: Record<TabKey, (force?: boolean) => void> = useMemo(() => ({
    mutualFunds: loadMF,
    fixedDeposit: loadFD,
    otherAsset: loadOA,
    sharesBonds: loadSB,
  }), [loadMF, loadFD, loadOA, loadSB]);

  useEffect(() => { loaders[activeTab](); }, [activeTab, loaders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Client Transactions</h1>
          <p className="text-muted-foreground text-sm">View transactions across Mutual Funds, Shares &amp; Bonds, Fixed Deposits and Other Assets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 bg-muted/50">
            <span className="text-muted-foreground">PAN:</span>
            <input
              value={panInput}
              onChange={e => setPanInput(e.target.value.toUpperCase())}
              onKeyDown={e => { if (e.key === 'Enter') { const p = panInput.trim(); if (p) setPan(p); } }}
              onBlur={() => { const p = panInput.trim(); if (p) setPan(p); }}
              placeholder="Enter PAN"
              className="font-mono font-medium bg-transparent outline-none w-28 uppercase placeholder:text-muted-foreground/50"
            />
          </div>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            max={todayStr} className="text-sm border rounded-lg px-3 py-1.5 bg-background" />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            max={todayStr} className="text-sm border rounded-lg px-3 py-1.5 bg-background" />
          <Button variant="outline" size="sm" onClick={() => loaders[activeTab](true)} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Fetch
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabKey)}>
        <TabsList className="mb-4">
          <TabsTrigger value="mutualFunds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="sharesBonds">Shares &amp; Bonds</TabsTrigger>
          <TabsTrigger value="fixedDeposit">Fixed Deposit</TabsTrigger>
          <TabsTrigger value="otherAsset">Other Asset</TabsTrigger>
        </TabsList>

        <TabsContent value="mutualFunds">
          {mf.loading ? <LoadingState /> : mf.error
            ? <ErrorState message={mf.error} onRetry={() => loadMF(true)} />
            : <MFTransactionsTable rows={mf.rows} />}
        </TabsContent>

        <TabsContent value="sharesBonds">
          {sb.loading ? <LoadingState /> : sb.error
            ? <ErrorState message={sb.error} onRetry={() => loadSB(true)} />
            : <SBTransactionsTable rows={sb.rows} />}
        </TabsContent>

        <TabsContent value="fixedDeposit">
          {fd.loading ? <LoadingState /> : fd.error
            ? <ErrorState message={fd.error} onRetry={() => loadFD(true)} />
            : <FDTransactionsTable rows={fd.rows} />}
        </TabsContent>

        <TabsContent value="otherAsset">
          {oa.loading ? <LoadingState /> : oa.error
            ? <ErrorState message={oa.error} onRetry={() => loadOA(true)} />
            : <OtherAssetTable rows={oa.rows} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MFClientTransactionsPage;
