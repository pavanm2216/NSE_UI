import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const Field: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="min-w-0">
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
    <p className={`text-sm font-semibold text-gray-800 mt-0.5 truncate ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">{icon}</div>
    <p className="font-semibold text-gray-700">{title}</p>
    <p className="text-sm text-gray-400 max-w-xs">{sub}</p>
  </div>
);

export const TabLoader: React.FC = () => (
  <div className="flex items-center justify-center py-20 gap-3 text-gray-400 text-sm">
    <RefreshCw className="w-4 h-4 animate-spin" /> Loading from BSE StAR MF…
  </div>
);

export const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  loaded: boolean;
  error: string;
  color: string;
  children: React.ReactNode;
}> = ({ icon, title, subtitle, count, loaded, error, color, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!loaded ? (
            <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          ) : error ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2.5 py-1">
              <XCircle className="w-3.5 h-3.5" /> Error
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {count} record{count !== 1 ? 's' : ''}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-6 py-4">
          {!loaded && (
            <div className="flex items-center gap-3 py-6 justify-center text-sm text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading from BSE...
            </div>
          )}
          {loaded && error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}
          {loaded && !error && count === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No records found.</p>
          )}
          {loaded && !error && count > 0 && children}
        </div>
      )}
    </div>
  );
};
