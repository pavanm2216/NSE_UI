import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import iwAxios from '@/api/axios';

const TXN_COLOR: Record<string, string> = {
  Purchase: 'bg-green-100 text-green-700',
  Redemption: 'bg-red-100 text-red-700',
  'Switch In': 'bg-blue-100 text-blue-700',
  'Switch Out': 'bg-orange-100 text-orange-700',
  Dividend: 'bg-purple-100 text-purple-700',
  NRP: 'bg-green-100 text-green-700',
  SWO: 'bg-orange-100 text-orange-700',
  SWI: 'bg-blue-100 text-blue-700',
  RED: 'bg-red-100 text-red-700',
  SIP: 'bg-cyan-100 text-cyan-700',
  STI: 'bg-teal-100 text-teal-700',
  EBP: 'bg-indigo-100 text-indigo-700',
  ESP: 'bg-violet-100 text-violet-700',
};

// Folio IDs come from the Portfolio Summary API (row.folioId or row.folioNo)
// Enter a real folio ID from your Investwell account below, or paste one at runtime
const DEMO_FOLIOS: { id: string; label: string }[] = [];

const CLUB_TXNS = true;

const fmt = (n: number) => `₹${Math.abs(n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (s: string) => { try { return new Date(s).toLocaleDateString('en-IN'); } catch { return s ?? '—'; } };

const DetailModal: React.FC<{ txn: any; onClose: () => void }> = ({ txn, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-background rounded-2xl shadow-2xl w-full max-w-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Transaction Details</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">×</button>
      </div>
      <div className="space-y-3 text-sm">
        {[
          ['Transaction ID', txn.txnid],
          ['Seq No', txn.seqNo],
          ['Txn No', txn.txnNo],
          ['Date', fmtDate(txn.date)],
          ['Nature', txn.nature],
          ['Type', txn.txnType],
          ['Amount', `${(txn.amount ?? 0) >= 0 ? '+' : '-'}${fmt(txn.amount)}`],
          ['Units', (txn.units ?? 0).toFixed(3)],
          ['NAV', `₹${(txn.nav ?? 0).toFixed(4)}`],
          ['Balance Units', (txn.balUnits ?? 0).toFixed(3)],
          ['ARN', txn.arnNo],
          ['Folio ID', txn.folioId],
        ].map(([label, val]) => val ? (
          <div key={label} className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right max-w-[60%] break-all">{val}</span>
          </div>
        ) : null)}
        {txn.currentNav && (
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Current NAV</span>
            <span className="font-medium">₹{(txn.currentNav).toFixed(4)} ({fmtDate(txn.currentNavDate)})</span>
          </div>
        )}
      </div>
      <Button className="w-full mt-5 bg-[#0D3B66] text-white hover:bg-[#11B5E4]" onClick={onClose}>Close</Button>
    </motion.div>
  </div>
);

const MFTransactionsPage: React.FC = () => {
  const [folioId, setFolioId]           = useState('');
  const [folioInput, setFolioInput]     = useState('');
  const [soaResult, setSoaResult]       = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [search, setSearch]             = useState('');
  const [typeFilter, setTypeFilter]     = useState('All');
  const [selected, setSelected]         = useState<any | null>(null);

  const loadSOA = async (fid: string) => {
    if (!fid.trim()) return;
    setLoading(true); setError(''); setSoaResult(null); setTransactions([]);
    try {
      const { data: json } = await iwAxios.get('/aggregator/reports/getSOA', {
        params: { folioId: fid.trim(), clubTxns: CLUB_TXNS },
      });
      if (json.status !== 0) throw new Error(json.message || 'API error');
      setSoaResult(json.result);
      setTransactions(json.result?.data ?? []);
    } catch (e: any) { setError(e?.message ?? 'Failed to load SOA'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (folioId) loadSOA(folioId); }, [folioId]);

  const txnTypes = ['All', ...Array.from(new Set(transactions.map((t: any) => t.txnType))).filter(Boolean)];
  const filtered = transactions.filter((t: any) => {
    const q = search.toLowerCase();
    const matchQ = !q || t.nature?.toLowerCase().includes(q) || t.txnid?.toLowerCase().includes(q) || t.txnType?.toLowerCase().includes(q);
    const matchT = typeFilter === 'All' || t.txnType === typeFilter;
    return matchQ && matchT;
  });

  const totalInvested = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalRedeemed = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-sm">Statement of Account (SOA)</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Download Statement</Button>
      </div>

      {/* Folio Selector */}
      <Card><CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm font-medium whitespace-nowrap">Folio ID:</label>
          <Input
            placeholder="Paste folio ID from Portfolio Summary..."
            className="flex-1 font-mono text-xs"
            value={folioInput}
            onChange={e => setFolioInput(e.target.value.trim())}
            onKeyDown={e => e.key === 'Enter' && setFolioId(folioInput)}
          />
          <Button size="sm" onClick={() => setFolioId(folioInput)} className="gap-2 bg-[#0D3B66] text-white hover:bg-[#0a2f52]">
            <RefreshCw className="w-3.5 h-3.5" /> Load
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Get the Folio ID from the <strong>Portfolio Summary</strong> page — click any folio row to copy its ID.
        </p>
      </CardContent></Card>

      {/* SOA Header Info */}
      {soaResult && (
        <Card><CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Scheme</p>
              <p className="font-semibold truncate" title={soaResult.schemeName}>{soaResult.schemeName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Folio No</p>
              <p className="font-semibold font-mono">{soaResult.folioNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Applicant</p>
              <p className="font-semibold">{soaResult.applicantName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="font-semibold text-[#0D3B66]">
                {soaResult.summary ? `₹${(soaResult.summary.amount ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : '—'}
              </p>
            </div>
          </div>
          {soaResult.summary && (
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Balance Units</p>
                <p className="font-semibold">{(soaResult.summary.units ?? 0).toFixed(3)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">NAV ({fmtDate(soaResult.summary.date)})</p>
                <p className="font-semibold">₹{(soaResult.summary.nav ?? 0).toFixed(4)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Invested</p>
                <p className="font-semibold text-green-600">{fmt(totalInvested)}</p>
              </div>
            </div>
          )}
        </CardContent></Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by nature, type, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {txnTypes.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === t ? 'bg-[#0D3B66] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card><CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="flex items-center gap-2 text-red-600 mb-3">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
            <Button size="sm" onClick={() => loadSOA(folioId)}>Retry</Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {['Date', 'Txn ID', 'Nature', 'Type', 'Amount', 'Units', 'NAV', 'Bal Units', 'ARN', ''].map(h => (
                  <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn: any, i: number) => {
                const isCredit = (txn.amount ?? 0) >= 0;
                return (
                  <motion.tr key={txn.txnid || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{fmtDate(txn.date)}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{(txn.txnid || '').substring(0, 10)}…</td>
                    <td className="p-3 max-w-[220px] truncate" title={txn.nature}>{txn.nature || '—'}</td>
                    <td className="p-3">
                      <Badge className={`text-xs ${TXN_COLOR[txn.txnType] || 'bg-gray-100 text-gray-700'}`}>{txn.txnType}</Badge>
                    </td>
                    <td className={`p-3 font-semibold whitespace-nowrap ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                      {isCredit ? '+' : '-'}{fmt(txn.amount)}
                    </td>
                    <td className="p-3 text-right">{(txn.units ?? 0).toFixed(3)}</td>
                    <td className="p-3 text-right">₹{(txn.nav ?? 0).toFixed(4)}</td>
                    <td className="p-3 text-right font-medium">{(txn.balUnits ?? 0).toFixed(3)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{txn.arnNo || '—'}</td>
                    <td className="p-3">
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setSelected(txn)}>View</Button>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent></Card>

      {selected && <DetailModal txn={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default MFTransactionsPage;
