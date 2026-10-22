import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import iwAxios from '@/api/axios';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number | null | undefined) =>
  `₹${Math.abs(n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtUnits = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/** Convert UTC ISO string → "04 Mar 2020 12:00 AM IST" */
const fmtNavDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return (
      d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
        timeZone: 'Asia/Kolkata',
      }) + ' IST'
    );
  } catch {
    return iso;
  }
};

// ── Transaction type badge ────────────────────────────────────────────────────
const TXN_BADGE: Record<string, string> = {
  'Switch In':  'bg-green-100 text-green-700 border-green-200',
  'Switch Out': 'bg-red-100 text-red-700 border-red-200',
  SIP:          'bg-blue-100 text-blue-700 border-blue-200',
  Purchase:     'bg-emerald-100 text-emerald-700 border-emerald-200',
  Redemption:   'bg-rose-100 text-rose-700 border-rose-200',
};
const txnBadgeClass = (type: string) =>
  TXN_BADGE[type] ?? 'bg-gray-100 text-gray-700 border-gray-200';

// ── Pagination ────────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 25, 50];

const MFRTATransactionsPage: React.FC = () => {
  const [orderInput, setOrderInput]   = useState('24187192,9052700');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [hasFetched, setHasFetched]   = useState(false);

  // Filters
  const [typeFilter, setTypeFilter]   = useState('All');
  const [schemeSearch, setSchemeSearch] = useState('');

  // Pagination
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(10);

  const fetchData = async () => {
    const raw = orderInput.trim();
    if (!raw) return;
    // Build bseOrderNo=[24187192,9052700]
    const orders = raw.split(',').map(s => s.trim()).filter(Boolean).join(',');
    setLoading(true);
    setError('');
    setHasFetched(false);
    try {
      const { data: json } = await iwAxios.get('/aggregator/utils/getBSETxnDetails', {
        params: { bseOrderNo: `[${orders}]` },
      });
      if (json.status !== 0) throw new Error(json.message || 'API error');
      setTransactions(json.results ?? []);
      setPage(1);
      setTypeFilter('All');
      setSchemeSearch('');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch RTA transactions');
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const txnTypes = useMemo(
    () => ['All', ...Array.from(new Set(transactions.map((t: any) => t.transactionType).filter(Boolean)))],
    [transactions],
  );

  const filtered = useMemo(() => {
    const q = schemeSearch.toLowerCase();
    return transactions.filter((t: any) => {
      const matchType   = typeFilter === 'All' || t.transactionType === typeFilter;
      const matchSearch = !q || [t.schemeName, t.folioNo, t.clientName, t.pan, t.isin]
        .some(v => v?.toLowerCase().includes(q));
      return matchType && matchSearch;
    });
  }, [transactions, typeFilter, schemeSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Summary ───────────────────────────────────────────────────────────────
  const summary = useMemo(() => ({
    total:       transactions.length,
    totalAmount: transactions.reduce((s, t) => s + (t.amount ?? 0), 0),
    totalUnits:  transactions.reduce((s, t) => s + (t.units ?? 0), 0),
    uniqueFolios: new Set(transactions.map((t: any) => t.folioNo).filter(Boolean)).size,
    types:       new Set(transactions.map((t: any) => t.transactionType).filter(Boolean)).size,
  }), [transactions]);

  const summaryCards = [
    { label: 'Total Transactions', value: summary.total.toString(),          color: 'text-[#0D3B66]' },
    { label: 'Total Amount',       value: fmt(summary.totalAmount),           color: 'text-[#0D3B66]' },
    { label: 'Total Units',        value: fmtUnits(summary.totalUnits),       color: 'text-[#11B5E4]' },
    { label: 'Unique Folios',      value: summary.uniqueFolios.toString(),    color: 'text-[#0D3B66]' },
    { label: 'Transaction Types',  value: summary.types.toString(),           color: 'text-[#11B5E4]' },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold">BSE Order Wise RTA Transactions</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Allotted transactions received from CAMS / KFintech after BSE order processing
        </p>
      </div>

      {/* ── Search bar ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                BSE Order Number(s) — comma separated
              </label>
              <Input
                placeholder="e.g. 24187192,9052700"
                value={orderInput}
                onChange={e => setOrderInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchData()}
                className="font-mono text-sm"
              />
            </div>
            <Button
              onClick={fetchData}
              disabled={loading}
              className="bg-[#0D3B66] hover:bg-[#0a2f52] text-white gap-2 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={loading}
              className="gap-2 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Error ── */}
      {error && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <Button size="sm" variant="outline" className="ml-auto" onClick={fetchData}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D3B66]" />
        </div>
      )}

      {/* ── Results ── */}
      {!loading && hasFetched && (
        <>
          {/* Summary cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {summaryCards.map((c, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-1">{c.label}</p>
                  <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {txnTypes.map(t => (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    typeFilter === t
                      ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                      : 'bg-background text-muted-foreground border-border hover:border-[#0D3B66]/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search scheme, folio, PAN..."
                className="pl-9 w-56"
                value={schemeSearch}
                onChange={e => { setSchemeSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No RTA transactions found
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      {[
                        'S.No', 'BSE Order No', 'Folio No', 'Client Name', 'PAN',
                        'Scheme Name', 'ISIN', 'Txn Type', 'NAV', 'NAV Date',
                        'Units', 'Amount', 'STT', 'Stamp Duty', 'Total Amount',
                      ].map(h => (
                        <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((t: any, i: number) => (
                      <motion.tr
                        key={t.bseOrderNo ?? i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3 text-muted-foreground text-xs">
                          {(page - 1) * pageSize + i + 1}
                        </td>
                        <td className="p-3 font-mono text-xs font-semibold text-[#0D3B66]">
                          {t.bseOrderNo ?? '—'}
                        </td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">
                          {t.folioNo ?? '—'}
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium">
                          {t.clientName ?? t.applicantName ?? '—'}
                        </td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">
                          {t.pan ?? '—'}
                        </td>
                        <td className="p-3 max-w-[220px]">
                          <p className="font-medium truncate" title={t.schemeName}>{t.schemeName ?? '—'}</p>
                        </td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">
                          {t.isin ?? t.isinNo ?? '—'}
                        </td>
                        <td className="p-3">
                          <Badge className={`text-xs border ${txnBadgeClass(t.transactionType)}`}>
                            {t.transactionType ?? '—'}
                          </Badge>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          ₹{(t.nav ?? 0).toFixed(4)}
                        </td>
                        <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                          {fmtNavDate(t.navDate ?? t.allotmentDate)}
                        </td>
                        <td className="p-3 text-right">
                          {fmtUnits(t.units)}
                        </td>
                        <td className="p-3 text-right font-semibold whitespace-nowrap">
                          {fmt(t.amount)}
                        </td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                          {t.stt != null ? fmt(t.stt) : '—'}
                        </td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                          {t.stampDuty != null ? fmt(t.stampDuty) : '—'}
                        </td>
                        <td className="p-3 text-right font-bold whitespace-nowrap text-[#0D3B66]">
                          {fmt((t.amount ?? 0) + (t.stt ?? 0) + (t.stampDuty ?? 0))}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Rows per page:</span>
                {PAGE_SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setPageSize(s); setPage(1); }}
                    className={`px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                      pageSize === s
                        ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                        : 'bg-background border-border hover:border-[#0D3B66]/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <span className="ml-2">
                  {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Prev
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded text-xs font-medium border transition-colors ${
                        page === p
                          ? 'bg-[#0D3B66] text-white border-[#0D3B66]'
                          : 'bg-background border-border hover:border-[#0D3B66]/50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <Button
                  variant="outline" size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MFRTATransactionsPage;
