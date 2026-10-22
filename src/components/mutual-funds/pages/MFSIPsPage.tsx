import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listSxp, cancelSxp, pauseSxp } from '@/services/starmf/sxpService';
import { getUCCList } from '@/services/starmf/uccService';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Loader2, Plus, RefreshCw, PauseCircle, XCircle,
  CalendarDays, TrendingUp, Activity,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  paused:    'bg-amber-100 text-amber-700',
  cancelled: 'bg-gray-100 text-gray-500',
  completed: 'bg-blue-100 text-blue-700',
};

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtAmt(v?: number | string) {
  return `₹${Number(v ?? 0).toLocaleString('en-IN')}`;
}

// ─── SIP Card ─────────────────────────────────────────────────────────────────

const SIPCard: React.FC<{
  sip: Record<string, any>;
  onCancel: (regNo: string) => void;
  onPause:  (regNo: string) => void;
}> = ({ sip, onCancel, onPause }) => {
  const status = String(sip.status ?? 'active').toLowerCase();
  const regNo  = sip.reg_no ?? sip.id ?? '';
  const isActive = status === 'active';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all p-5 space-y-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {sip.src_scheme_name ?? sip.src_scheme ?? '—'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{sip.src_scheme}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-500'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-xl py-2.5">
          <p className="text-sm font-bold text-gray-900">{fmtAmt(sip.amount)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Amount</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2.5">
          <p className="text-sm font-bold text-gray-900">{sip.freq === 'm' ? 'Monthly' : sip.freq === 'q' ? 'Quarterly' : sip.freq ?? '—'}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Frequency</p>
        </div>
        <div className="bg-gray-50 rounded-xl py-2.5">
          <p className="text-sm font-bold text-gray-900">{sip.ninstallments ?? '—'}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Installments</p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5" />
          Start: {fmtDate(sip.start_date)}
        </span>
        <span>End: {fmtDate(sip.end_date)}</span>
      </div>

      {/* Reg no */}
      {regNo && (
        <p className="text-[10px] text-gray-400 font-mono">Reg No: {regNo}</p>
      )}

      {/* Actions */}
      {isActive && (
        <div className="flex gap-2 pt-1 border-t border-gray-100">
          <Button
            size="sm" variant="outline"
            className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
            onClick={() => onPause(String(regNo))}
          >
            <PauseCircle className="w-3.5 h-3.5 mr-1.5" /> Pause
          </Button>
          <Button
            size="sm" variant="outline"
            className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={() => onCancel(String(regNo))}
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const MFSIPsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sips,    setSips]    = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [ucc,     setUcc]     = useState('');
  const [filter,  setFilter]  = useState<'active' | 'paused' | 'cancelled' | 'all'>('active');

  // ── Load UCC then SIPs ────────────────────────────────────────────────────
  const fetchSIPs = useCallback(async (uccCode: string, status: string) => {
    setLoading(true);
    try {
      const statusFilter = status === 'all' ? ['active', 'paused', 'cancelled', 'completed'] : [status];
      const res = await listSxp({ type: ['sip'], status: statusFilter, ucc: uccCode || undefined }, 0, 100);
      setSips(res?.data?.lists ?? []);
    } catch {
      toast({ title: 'Failed to load SIPs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUCCList({ start: 0, length: 1 });
        const code = res?.data?.lists?.[0]?.investor?.client_code ?? '';
        setUcc(code);
        fetchSIPs(code, filter);
      } catch {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (ucc !== undefined) fetchSIPs(ucc, filter);
  }, [filter]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCancel = async (regNo: string) => {
    if (!window.confirm('Cancel this SIP? This cannot be undone.')) return;
    try {
      await cancelSxp(regNo);
      toast({ title: 'SIP cancelled' });
      fetchSIPs(ucc, filter);
    } catch {
      toast({ title: 'Failed to cancel SIP', variant: 'destructive' });
    }
  };

  const handlePause = async (regNo: string) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await pauseSxp(regNo, 1, today);
      toast({ title: 'SIP paused for 1 instalment' });
      fetchSIPs(ucc, filter);
    } catch {
      toast({ title: 'Failed to pause SIP', variant: 'destructive' });
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const activeSIPs  = sips.filter(s => String(s.status ?? '').toLowerCase() === 'active');
  const totalMonthly = activeSIPs.reduce((sum, s) => sum + Number(s.amount ?? 0), 0);

  const FILTERS: { label: string; value: typeof filter }[] = [
    { label: 'Active',    value: 'active'    },
    { label: 'Paused',    value: 'paused'    },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'All',       value: 'all'       },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My SIPs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your Systematic Investment Plans</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchSIPs(ucc, filter)} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => navigate('/dashboard/mf/sips/register')}
            className="bg-[#0D3B66] hover:bg-[#092d4e]">
            <Plus className="w-4 h-4 mr-1.5" /> New SIP
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: Activity,   label: 'Active SIPs',     value: String(activeSIPs.length),              color: 'text-emerald-600 bg-emerald-50' },
          { icon: TrendingUp, label: 'Monthly Outflow',  value: `₹${totalMonthly.toLocaleString('en-IN')}`, color: 'text-blue-600 bg-blue-50'     },
          { icon: CalendarDays, label: 'Total SIPs',    value: String(sips.length),                    color: 'text-purple-600 bg-purple-50'   },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f.value
                ? 'bg-[#0D3B66] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-sm text-gray-500">Loading SIPs from BSE StAR MF...</span>
        </div>
      ) : sips.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Activity className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="mt-3 font-semibold text-gray-500">No SIPs found</p>
          <p className="text-sm text-gray-400 mt-1">Start a new SIP to grow your wealth systematically</p>
          <Button className="mt-5 bg-[#0D3B66] hover:bg-[#092d4e]"
            onClick={() => navigate('/dashboard/mf/sips/register')}>
            <Plus className="w-4 h-4 mr-2" /> Start a SIP
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sips.map((sip, i) => (
            <SIPCard key={sip.reg_no ?? i} sip={sip} onCancel={handleCancel} onPause={handlePause} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MFSIPsPage;
