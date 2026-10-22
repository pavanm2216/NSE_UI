import { NSEButton, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { nseApi } from '@/services/nseApi';
import { buildXsipDueRequest } from '@/services/nseXsipDueService';

export default function NSEXsipInstallmentsDue() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState({ sip: '', client: '', from: today, to: new Date(Date.parse(today) + 7 * 86400000).toISOString().slice(0, 10) });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [searched, setSearched] = useState(false), [page, setPage] = useState(1);
  const version = useRef(0);
  const load = async () => {
    const request = ++version.current;
    setBusy(true); setError(''); setRows([]); setSearched(false); setPage(1);
    try {
      const format = (value: string) => value.split('-').reverse().join('-');
      const body = buildXsipDueRequest({ xsip_reg_id: filters.sip, client_code: filters.client, from_date: format(filters.from), to_date: format(filters.to) });
      const response = await nseApi.xsipInstallmentsDue(body);
      if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds installment due report failed');
      if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable installment due report');
      if (request === version.current) { setRows(response.report_data as Record<string, unknown>[]); setSearched(true); }
    } catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load upcoming installments'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => { void load(); return () => { version.current++; }; }, []);
  const update = (key: keyof typeof filters, value: string) => { version.current++; setFilters(previous => ({ ...previous, [key]: value })); setRows([]); setSearched(false); setError(''); };
  const text = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const money = (value: string) => /^\d+(\.\d+)?$/.test(value) ? Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Not reported';
  const pages = Math.max(1, Math.ceil(rows.length / 24));
  return <section aria-label="Upcoming Mutual funds XSIP installments" className="space-y-4 border-b border-gray-100 p-5">
    <NSEHeading as="h2" className="text-xl font-bold text-[#102B78]">Upcoming XSIP installments</NSEHeading>
    <p className="text-sm text-gray-500">See due dates and amounts reported by Mutual funds. XSIP IDs take priority over client codes; dates apply when both are empty. Enter up to 50 comma-separated IDs or client codes.</p>
    <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">{([['sip', 'XSIP IDs for installments'], ['client', 'Client codes for installments'], ['from', 'Due from date'], ['to', 'Due to date']] as const).map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input type={key === 'from' || key === 'to' ? 'date' : 'text'} min={key === 'from' || key === 'to' ? today : undefined} disabled={busy || ((key === 'from' || key === 'to') && !!(filters.sip.trim() || filters.client.trim()))} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>)}<NSEButton disabled={busy} onClick={() => void load()} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading installments...' : 'Load upcoming installments'}</NSEButton></div>
    <p className="text-xs text-gray-500">Date searches must start today or later. The end date must be later, with a maximum gap of 7 days.</p>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} installment records returned by Mutual funds` : 'Mutual funds returned no installments for these filters.'}</p>}
    <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.slice((page - 1) * 24, page * 24).map((row, index) => <article key={`${page}-${index}`} className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div><NSEHeading as="h3" className="font-bold text-[#102B78]">{text(row, 'scheme_name') || 'Scheme not reported'}</NSEHeading><p className="mt-1 text-xs text-gray-500">{text(row, 'amc_name')}</p></div>
      <div className="rounded-xl bg-[#f4f7fc] p-3"><p className="text-xs text-gray-500">Installment due</p><p className="mt-1 text-xl font-bold text-[#102B78]">{money(text(row, 'installment_amt'))}</p><p className="mt-1 text-sm font-semibold text-[#102B78]">Due: {text(row, 'due_date') || 'Not reported'}</p><p className="mt-1 text-xs text-gray-500">{text(row, 'frequency_type') || 'Frequency not reported'}</p></div>
      <dl className="grid grid-cols-2 gap-3 text-xs">{[['XSIP registration ID', text(row, 'sip_reg_number')], ['Investor', text(row, 'client_name')], ['Client code', text(row, 'client_code')], ['Registered on', text(row, 'reg_date')], ['Mandate ID', text(row, 'mandate_id')], ['Previous paid date', text(row, 'prev_paid_date')], ['Installments paid', text(row, 'no_of_installments_paid')], ['Total installment amount paid', money(text(row, 'total_installment_amt_paid'))]].map(([label, value]) => <div key={label}><dt className="text-gray-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value || 'Not reported'}</dd></div>)}</dl>
      <p className="text-xs text-gray-500">A due installment does not confirm a debit or allotment. Payment history above is displayed as reported by Mutual funds.</p>
    </article>)}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous installments</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next installments</NSEButton></div>}
  </section>;
}
