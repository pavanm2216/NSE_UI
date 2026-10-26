import NSESearchFields from './NSESearchFields';
import { NSEButton, NSESummary, NSEHeading } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { getNSEAmcPauseReport, NSEAmcPauseReportInput } from '../services/nseAmcPauseService';
const labels: Record<string, string> = { no_of_instalments_paused: 'Installments paused', modified_instalments: 'Modified installments', pause_from_date: 'Pause from', pause_to_date: 'Pause until' };
const groups = [
  ['Plan', ['client_code', 'sip_registration_no', 'scheme_code', 'scheme_name', 'amount', 'sip_start_date', 'sip_end_date']],
  ['AMC pause request', ['request_id', 'no_of_instalments_paused', 'date_of_activation', 'pause_from_date', 'pause_to_date', 'modified_date', 'modified_instalments', 'entry_by']],
] as const;
export default function NSEAmcPauseReport() {
  const date = (days: number) => new Date(Date.now() - days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState<NSEAmcPauseReportInput>({ from_date: date(7), to_date: date(0), client_code: '', registration_no: '', modification_type: '', request_id: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]), [busy, setBusy] = useState(false), [searched, setSearched] = useState(false), [error, setError] = useState(''), [page, setPage] = useState(1);
  const lock = useRef(false);
  const update = (key: keyof NSEAmcPauseReportInput, value: string) => { setFilters(old => ({ ...old, [key]: value })); setRows([]); setSearched(false); setError(''); setPage(1); };
  const load = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setRows([]); setError(''); setSearched(false); setPage(1);
    try { setRows(await getNSEAmcPauseReport(filters)); setSearched(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to fetch AMC pause history'); }
    finally { lock.current = false; setBusy(false); }
  };
  const value = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 12));
  return <details className="border-b border-gray-100 p-5"><NSESummary className="cursor-pointer text-lg font-bold text-[#102B78]">AMC pause history</NSESummary><div className="mt-4 space-y-4">
    <p className="text-sm text-gray-500">Check AMC pause requests, activation dates and reported installment changes. A submitted request does not by itself confirm the pause is active.</p>
    <form onSubmit={load} className="space-y-3"><NSESearchFields disabled={busy}>
      {([['request_id', 'AMC pause request ID', 'text'], ['registration_no', 'SIP registration number', 'text'], ['client_code', 'AMC pause client code', 'text'], ['from_date', 'AMC pause from date', 'date'], ['to_date', 'AMC pause to date', 'date']] as const).map(([key, title, type]) => <label key={key} className="text-sm font-semibold">{title}<input type={type} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2" /></label>)}<label className="text-sm font-semibold">Modification type<select value={filters.modification_type} onChange={event => update('modification_type', event.target.value)} className="mt-1 w-full rounded border p-2"><option value="">All actions</option><option>PAUSE</option><option>UNPAUSE</option></select></label>
    </NSESearchFields><p className="text-xs text-gray-500">Request ID takes priority. Otherwise search by a single registration number and/or client code, with an optional action. When these are empty, choose dates up to 7 days apart.</p><NSEButton disabled={busy} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading AMC pause history...' : 'Load AMC pause history'}</NSEButton></form>
    {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} AMC pause records` : 'Mutual funds returned no AMC pause records for these filters.'}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{rows.slice((page - 1) * 12, page * 12).map((row, index) => <article key={index} className="space-y-3 rounded-xl border p-4"><NSEHeading as="h3" className="font-bold text-[#102B78]">SIP {value(row, 'sip_registration_no') || 'ID not reported'}</NSEHeading>{groups.map(([title, keys]) => <section key={title} className="rounded bg-blue-50 p-3"><NSEHeading as="h4" className="text-sm font-semibold">{title}</NSEHeading><dl>{keys.map(key => <div key={key} className="mt-2 text-xs"><dt className="text-gray-500">{labels[key] || key.replace(/_/g, ' ')}</dt><dd className="break-words font-semibold">{value(row, key) ? (key === 'accountno' || key === 'dp_folio_no') ? `Account ending ${value(row, key).slice(-4)}` : value(row, key) : 'Not reported'}</dd></div>)}</dl></section>)}</article>)}</div>
    {pages > 1 && <div className="flex justify-between"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next</NSEButton></div>}
  </div></details>;
}
