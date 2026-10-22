import { Search } from 'lucide-react';
import { NSEButton, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { nseApi } from '@/services/nseApi';
import { buildMandateReportRequest } from '@/services/nseMandateReportService';
import NSEMandateCard from './NSEMandateCard';
export default function NSEExistingMandates() {
  const [clientCode, setClientCode] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]); const [busy, setBusy] = useState(false);
  const [error, setError] = useState(''); const [searched, setSearched] = useState(false); const [page, setPage] = useState(1);
  const [lastChecked, setLastChecked] = useState('');
  const version = useRef(0);
  const load = async () => {
    if (!clientCode.trim()) { setError('Enter a client code to find mandates.'); return; }
    const request = ++version.current; setBusy(true); setLastChecked(''); setError(''); setRows([]); setSearched(false); setPage(1);
    try {
      const filters = buildMandateReportRequest({ client_code: clientCode.trim() });
      const response = await nseApi.mandateStatus(filters);
      if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds mandate status lookup failed');
      if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable mandate report');
      if (request === version.current) { setRows(response.report_data as Record<string, unknown>[]); setSearched(true); setLastChecked(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })); }
    } catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load Mutual funds mandates'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => () => { version.current++; }, []);
  const reset = () => { version.current++; setLastChecked(''); setRows([]); setSearched(false); setError(''); };
  const pages = Math.max(1, Math.ceil(rows.length / 24));
  return <section aria-label="Existing Mutual funds mandates" className="space-y-5">
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-slate-50/60 to-white p-4 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-[#102B78] shadow-sm"><Search aria-hidden="true" className="h-5 w-5" /></span><h3 className="text-base font-semibold tracking-tight text-slate-900">Find your bank mandate</h3></div>
    <form onSubmit={event => { event.preventDefault(); if (!busy) void load(); }} className="grid items-end gap-3 sm:max-w-2xl sm:grid-cols-[1fr_auto]"><label className="text-sm font-semibold">Client codes<input placeholder="Enter client code" autoComplete="off" disabled={busy} value={clientCode} onChange={event => { setClientCode(event.target.value); reset(); }} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50" /></label><NSEButton type="submit" disabled={busy || !clientCode.trim()} className="h-12 justify-center rounded-xl bg-[#102B78] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B3F96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:opacity-50">{busy ? 'Loading mandates...' : 'Load Mutual funds mandates'}</NSEButton></form></div>
    {searched && <div className="flex flex-wrap items-center gap-3"><NSEButton disabled={busy} onClick={() => void load()} className="rounded-lg border border-[#102B78] px-3 py-2 text-sm font-semibold text-[#102B78] disabled:opacity-50">Refresh mandate status</NSEButton>{lastChecked && <p className="text-xs text-gray-500">Last checked with Mutual funds: {lastChecked} IST</p>}</div>}
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <p role="status" className="text-sm text-gray-500">{rows.length} {rows.length === 1 ? 'mandate found' : 'mandates found'}</p>}
    {searched && !rows.length && <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">Mutual funds returned no mandates for these filters.</p>}
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">{rows.slice((page - 1) * 24, page * 24).map((row, index) => <NSEMandateCard key={`${page}-${index}`} row={row} />)}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous mandates</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next mandates</NSEButton></div>}
  </section>;
}
