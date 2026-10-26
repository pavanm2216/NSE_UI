import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { nseApi } from '../services/nseApi';
import { buildStpCancellationReportRequest } from '../services/nseStpCancellationReportService';

export default function NSEStpCancellations() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState({ sip: '', client: '', from: new Date(Date.parse(today) - 7 * 86400000).toISOString().slice(0, 10), to: today });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [searched, setSearched] = useState(false), [page, setPage] = useState(1);
  const version = useRef(0);
  const load = async () => {
    const request = ++version.current;
    setBusy(true); setError(''); setRows([]); setSearched(false); setPage(1);
    try {
      const format = (value: string) => value.split('-').reverse().join('-');
      const body = buildStpCancellationReportRequest({ stp_reg_id: filters.sip, client_code: filters.client, from_date: format(filters.from), to_date: format(filters.to) });
      const response = await nseApi.stpCancellations(body);
      if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds cancellation report failed');
      if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable cancellation report');
      if (request === version.current) { setRows(response.report_data as Record<string, unknown>[]); setSearched(true); }
    } catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load cancellations'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => { void load(); return () => { version.current++; }; }, []);
  const update = (key: keyof typeof filters, value: string) => { version.current++; setFilters(previous => ({ ...previous, [key]: value })); setRows([]); setSearched(false); setError(''); };
  const text = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const money = (value: string) => /^\d+(\.\d+)?$/.test(value) ? Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Not reported';
  const pages = Math.max(1, Math.ceil(rows.length / 24));
  return <section aria-label="Mutual funds STP cancellation history" className="space-y-4 border-b border-gray-100 p-5">
    <NSEHeading as="h2" className="text-xl font-bold text-[#102B78]">STP cancellation history</NSEHeading>
    <p className="text-sm text-gray-500">View cancellations reported by Mutual funds. This report does not submit a cancellation request. STP IDs take priority over client codes; dates apply when both are empty. Enter up to 50 comma-separated IDs or client codes.</p>
    <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">{([['sip', 'STP IDs for cancellations'], ['client', 'Client codes for cancellations'], ['from', 'Cancellation from date'], ['to', 'Cancellation to date']] as const).map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input type={key === 'from' || key === 'to' ? 'date' : 'text'} disabled={busy || ((key === 'from' || key === 'to') && !!(filters.sip.trim() || filters.client.trim()))} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>)}<NSEButton disabled={busy} onClick={() => void load()} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading cancellations...' : 'Load cancellations'}</NSEButton></div>
    <p className="text-xs text-gray-500">The end date must be later than the start date, with a maximum gap of 31 days. The initial search covers the last seven days.</p>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} cancellation records returned by Mutual funds` : 'Mutual funds returned no cancellations for these filters.'}</p>}
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.slice((page - 1) * 24, page * 24).map((row, index) => <article key={`${page}-${index}`} className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div><NSEHeading as="h3" className="font-bold text-[#102B78]">{text(row, 'from_scheme_name') || 'Scheme not reported'}</NSEHeading><p className="mt-1 text-xs text-gray-500">{text(row, 'from_amc_name')}</p></div>
      <div className="rounded-xl bg-[#f4f7fc] p-3"><p className="text-xs text-gray-500">Transfer per installment</p><p className="mt-1 text-xl font-bold text-[#102B78]">{Number(text(row, 'transfer_units')) > 0 ? `${text(row, 'transfer_units')} units` : Number(text(row, 'transfer_amount')) > 0 ? money(text(row, 'transfer_amount')) : 'Not reported'}</p><p className="mt-1 text-sm font-semibold text-[#102B78]">Cancelled on: {text(row, 'stp_cancellation_date') || 'Not reported'}</p><p className="mt-1 text-xs font-semibold text-[#102B78]">Cancelled plan report</p><p className="mt-1 text-xs text-gray-500">{text(row, 'frequency') || 'Frequency not reported'}</p></div>
      <dl className="grid grid-cols-2 gap-3 text-xs">{[['STP registration ID', text(row, 'stp_registration_no')], ['Client code', text(row, 'client_code')], ['Registered on', text(row, 'stp_registration_date')], ['Destination fund', text(row, 'to_scheme_name')], ['Destination AMC', text(row, 'to_amc_name')], ['Transaction mode', text(row, 'trxn_mode')], ['Folio', text(row, 'folio_no')], ['Start date', text(row, 'stp_start_date')], ['End date', text(row, 'stp_end_date')], ['Cancelled by', text(row, 'stp_cancelled_by')], ['Scheduled transfers', text(row, 'no_of_transfers')]].map(([label, value]) => <div key={label}><dt className="text-gray-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value || 'Not reported'}</dd></div>)}</dl>
      {text(row, 'remarks') && <div className="rounded-lg bg-blue-50 p-3 text-xs"><p className="font-semibold text-[#102B78]">Mutual funds remarks</p><p className="mt-1 text-gray-600">{text(row, 'remark')}</p></div>}
      <p className="text-xs text-gray-500">This record is from Mutual funds?s cancellation report. It does not confirm a reversal of transfers already executed.</p>
    </article>)}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous cancellations</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next cancellations</NSEButton></div>}
  </section>;
}
