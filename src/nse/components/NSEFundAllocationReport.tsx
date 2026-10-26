import NSESearchFields from './NSESearchFields';
import { NSEButton, NSESummary, NSEHeading } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { getNSEFundAllocation, NSEFundAllocationInput, NSE_PAYMENT_AGENCIES } from '../services/nseFundAllocationService';
const groups = [
  ['Payment received', ['clientcode', 'clientname', 'paymentdate', 'payment_mode', 'totalamount', 'cfppgbankrefno', 'utrno']],
  ['Order allocation', ['totalallocatedamount', 'remainingamount']],
  ['Settlement', ['settlement_number', 'settled_flag', 'totalsettlementamount', 'remainingamountsettlement']],
  ['Allotment', ['allotment_flag', 'totalallotmentamount', 'remainingaamountallotment']],
  ['Bank and refunds', ['bankname', 'ifsccode', 'remitteraccountno', 'accounttype', 'refundamount', 'refunddate', 'refundutr', 'errorremarks', 'duplicatepgbank', 'orderprocessduplicatepgbank']],
] as const;
export default function NSEFundAllocationReport() {
  const date = (days: number) => new Date(Date.now() - days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState<NSEFundAllocationInput>({ from_date: date(7), to_date: date(0), client_code: '', pg_bank_refno: '', order_id: '', pg_agencyid: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]), [busy, setBusy] = useState(false), [searched, setSearched] = useState(false), [error, setError] = useState(''), [page, setPage] = useState(1);
  const lock = useRef(false);
  const update = (key: keyof NSEFundAllocationInput, value: string) => { setFilters(old => ({ ...old, [key]: value })); setRows([]); setSearched(false); setError(''); setPage(1); };
  const load = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setRows([]); setError(''); setSearched(false); setPage(1);
    try { setRows(await getNSEFundAllocation(filters)); setSearched(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to fetch fund allocation report'); }
    finally { lock.current = false; setBusy(false); }
  };
  const value = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 12));
  return <details className="border-b border-gray-100 p-5"><NSESummary className="cursor-pointer text-lg font-bold text-[#102B78]">Fund allocation by order</NSESummary><div className="mt-4 space-y-4">
    <p className="text-sm text-gray-500">See how received funds are allocated to orders, settled and allotted. Amounts and flags are shown as Mutual funds reports them; an allocation does not confirm units allotted or a refund received.</p>
    <form onSubmit={load} className="space-y-3"><NSESearchFields disabled={busy}>
      {([['order_id', 'Order IDs', 'text'], ['pg_bank_refno', 'Payment bank reference numbers', 'text'], ['client_code', 'Client codes', 'text'], ['from_date', 'From date', 'date'], ['to_date', 'To date', 'date']] as const).map(([key, title, type]) => <label key={key} className="text-sm font-semibold">{title}<input type={type} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2" /></label>)}
      <label className="text-sm font-semibold">Payment provider<select value={filters.pg_agencyid} onChange={event => update('pg_agencyid', event.target.value)} className="mt-1 w-full rounded border p-2"><option value="">All providers</option>{Object.entries(NSE_PAYMENT_AGENCIES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
    </NSESearchFields><p className="text-xs text-gray-500">Dates are required for every search. Optional filters can be combined: up to 50 order IDs, client codes or bank references each. Amounts are per report record; repeated payment references are not summed.</p><NSEButton disabled={busy} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading fund allocation report...' : 'Load fund allocation report'}</NSEButton></form>
    {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} fund allocation records` : 'Mutual funds returned no fund allocation records for these filters.'}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{rows.slice((page - 1) * 12, page * 12).map((row, index) => <article key={index} className="space-y-3 rounded-xl border p-4"><NSEHeading as="h3" className="font-bold text-[#102B78]">Order {value(row, 'order_number') || 'ID not reported'}</NSEHeading>{groups.map(([title, keys]) => <section key={title} className="rounded bg-blue-50 p-3"><NSEHeading as="h4" className="text-sm font-semibold">{title}</NSEHeading><dl>{keys.map(key => <div key={key} className="mt-2 text-xs"><dt className="text-gray-500">{key.replace(/_/g, ' ')}</dt><dd className="break-words font-semibold">{value(row, key) ? key === 'remitteraccountno' ? `Account ending ${value(row, key).slice(-4)}` : value(row, key) : 'Not reported'}</dd></div>)}</dl></section>)}</article>)}</div>
    {pages > 1 && <div className="flex justify-between"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next</NSEButton></div>}
  </div></details>;
}
