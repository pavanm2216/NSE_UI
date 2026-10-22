import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, AlertCircle, Users, FolderOpen, UserX, LayoutGrid,
  ExternalLink, CheckCircle2, Loader2, ArrowDownToLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import iwAxios from '@/api/axios';

interface ScreenerResult {
  PortfolioScreenerClientWise: string;
  PortfolioScreenerFolioWise: string;
  FoliosWithZeroBalance: string;
  ClientsWithZeroBalance: string;
}

const CARDS = [
  {
    key: 'PortfolioScreenerClientWise' as keyof ScreenerResult,
    title: 'Client Wise Portfolio',
    description: 'Full portfolio valuation per client — current value, invested amount, returns & XIRR. Ideal for CRM sync or bulk review.',
    badge: 'Client Level',
    icon: Users,
    color: '#0D3B66',
    lightBg: 'bg-[#0D3B66]/5',
    border: 'border-[#0D3B66]/20',
    badgeBg: 'bg-[#0D3B66]/10 text-[#0D3B66]',
    filename: 'client-wise-portfolio.csv',
  },
  {
    key: 'PortfolioScreenerFolioWise' as keyof ScreenerResult,
    title: 'Folio Wise Portfolio',
    description: 'Granular folio-level data — scheme name, units held, NAV, current value & returns per folio across all clients.',
    badge: 'Folio Level',
    icon: FolderOpen,
    color: '#11B5E4',
    lightBg: 'bg-[#11B5E4]/5',
    border: 'border-[#11B5E4]/20',
    badgeBg: 'bg-[#11B5E4]/10 text-[#11B5E4]',
    filename: 'folio-wise-portfolio.csv',
  },
  {
    key: 'FoliosWithZeroBalance' as keyof ScreenerResult,
    title: 'Zero Balance Folios',
    description: 'All folios where unit balance is zero — redeemed or fully switched-out. Use for portfolio housekeeping.',
    badge: 'Housekeeping',
    icon: FolderOpen,
    color: '#f59e0b',
    lightBg: 'bg-amber-50',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-700',
    filename: 'zero-balance-folios.csv',
  },
  {
    key: 'ClientsWithZeroBalance' as keyof ScreenerResult,
    title: 'Zero Balance Clients',
    description: 'Clients whose total portfolio value is zero across all schemes. Use for re-engagement campaigns.',
    badge: 'Re-engagement',
    icon: UserX,
    color: '#f43f5e',
    lightBg: 'bg-rose-50',
    border: 'border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-600',
    filename: 'zero-balance-clients.csv',
  },
];

async function fetchScreenerData(): Promise<ScreenerResult> {
  const { data } = await iwAxios.get('/aggregator/broker/getClientsPortfolioScreener');
  if (data.status !== 0) throw new Error(data.message || `status ${data.status}`);
  return data.result as ScreenerResult;
}

const MFPortfolioScreenerPage: React.FC = () => {
  const [data, setData] = useState<ScreenerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(''); setData(null);
    try { setData(await fetchScreenerData()); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  };

  const handleDownload = async (url: string, filename: string, key: string) => {
    setDownloading(key);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D3B66] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Data Mining</h1>
            <p className="text-sm text-muted-foreground">Bulk portfolio screener — download pre-calculated CSV reports</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CARDS.map((c) => (
          <div key={c.key} className={`rounded-xl border ${c.border} ${c.lightBg} px-4 py-3 flex items-center gap-3`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.color }}>
              <c.icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{c.title}</p>
              <Badge className={`text-[10px] px-1.5 py-0 h-4 border-0 mt-0.5 ${c.badgeBg}`}>{c.badge}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-destructive">{error}</p>
          <Button size="sm" variant="outline" onClick={load} className="gap-1 shrink-0">
            <RefreshCw className="w-3 h-3" /> Retry
          </Button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D3B66]" />
          <p className="text-sm text-muted-foreground">Fetching download links…</p>
        </div>
      )}

      {/* ── Cards ── */}
      {!loading && data && (
        <>
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            4 reports ready — updated daily
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {CARDS.map((card, i) => {
              const Icon = card.icon;
              const url = data[card.key];
              const isDown = downloading === card.key;
              return (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border ${card.border} bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: card.color }} />

                  <div className="p-5 flex flex-col gap-4">
                    {/* Title row */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: card.color }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-sm text-gray-900">{card.title}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${card.badgeBg}`}>{card.badge}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
                      </div>
                    </div>

                    {/* URL pill */}
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                      <span className="text-xs font-mono text-gray-500 truncate flex-1">{url}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-gray-700">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2 text-white text-sm"
                        style={{ backgroundColor: card.color }}
                        disabled={isDown}
                        onClick={() => handleDownload(url, card.filename, card.key)}
                      >
                        {isDown
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading…</>
                          : <><ArrowDownToLine className="w-4 h-4" /> Download CSV</>
                        }
                      </Button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Links are session-specific · Powered by InvestWell Portfolio Transfer Service
          </p>
        </>
      )}
    </div>
  );
};

export default MFPortfolioScreenerPage;
