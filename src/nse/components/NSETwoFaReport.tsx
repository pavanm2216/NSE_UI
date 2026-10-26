import NSESearchFields from './NSESearchFields';
import { NSEButton, NSESummary, NSEHeading } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { getNSETwoFa, NSE_TWOFA_PRODUCTS } from '../services/nseTwoFaService';
const groups = [
  ['Registration', ['product_reg_datetime', 'client_code', 'mode_of_holding', 'folio_no']],
  ['First holder', ['primary_holder_name', 'primary_holder_authentication_status', 'primary_holder_authentication_datetime', 'primary_holder_reply_time']],
  ['Second holder', ['second_holder_name', 'second_holder_authentication_status', 'second_holder_authentication_datetime', 'second_holder_reply_time']],
  ['Third holder', ['third_holder_name', 'third_holder_authentication_status', 'third_holder_authentication_datetime', 'third_holder_reply_time']],
] as const;
export default function NSETwoFaReport() {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState({ from_date: today, to_date: today, product_type: '', product_id: '', client_code: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]), [busy, setBusy] = useState(false), [searched, setSearched] = useState(false), [error, setError] = useState(''), [page, setPage] = useState(1);
  const lock = useRef(false);
  const update = (key: keyof typeof filters, value: string) => { setFilters(previous => ({ ...previous, [key]: value })); setRows([]); setSearched(false); setError(''); setPage(1); };
  const load = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setError(''); setRows([]); setSearched(false); setPage(1);
    try { setRows(await getNSETwoFa(filters)); setSearched(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to fetch lifecycle report'); }
    finally { setBusy(false); lock.current = false; }
  };
  const text = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const label = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  const pages = Math.max(1, Math.ceil(rows.length / 12));
  return <details className="border-b border-gray-100 p-5"><NSESummary className="cursor-pointer text-lg font-bold text-[#102B78]">Holder authorization (2FA)</NSESummary><div className="mt-4 space-y-4"><p className="text-sm text-gray-500">Check each holder's authorization status and timestamp as reported by Mutual funds. Authentication success does not confirm payment, allotment or payout.</p>
    <form onSubmit={load} className="space-y-3"><NSESearchFields disabled={busy}><label className="text-sm font-semibold">2FA product<select value={filters.product_type} onChange={event => update('product_type', event.target.value)} className="mt-1 w-full rounded border p-2">{NSE_TWOFA_PRODUCTS.map(value => <option key={value} value={value}>{value || 'All products'}</option>)}</select></label>{([['from_date', 'Registration from date', 'date'], ['to_date', 'Registration to date', 'date'], ['product_id', 'Product / registration IDs', 'text'], ['client_code', '2FA client codes', 'text']] as const).map(([key, title, type]) => <label key={key} className="text-sm font-semibold">{title}<input required={type === 'date'} type={type} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2" /></label>)}</NSESearchFields><p className="text-xs text-gray-500">Maximum date gap: 7 days. Up to 50 IDs or client codes. Selecting a product requires IDs; product IDs override the client filter.</p><NSEButton disabled={busy} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading authorization...' : 'Load holder authorization'}</NSEButton></form>
    {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} 2FA records` : 'Mutual funds returned no 2FA records for these filters.'}</p>}
    <div className="grid items-start gap-4 lg:grid-cols-2">{rows.slice((page - 1) * 12, page * 12).map((row, index) => <article key={`${page}-${index}`} className="space-y-4 rounded-2xl border border-blue-100 p-5"><NSEHeading as="h3" className="font-bold text-[#102B78]">{text(row, 'product_type') || 'Product'} · {text(row, 'product_id') || 'ID not reported'}</NSEHeading>{groups.map(([title, keys]) => { const fields = keys.filter(key => text(row, key)); return <section key={title} className="rounded-xl bg-[#f4f7fc] p-3"><NSEHeading as="h4" className="text-sm font-semibold text-[#102B78]">{title}</NSEHeading>{!fields.length ? <p className="mt-2 text-xs text-gray-500">Not reported by Mutual funds</p> : <dl className="mt-3 space-y-2">{fields.map(key => <div key={key} className="text-xs"><dt className="text-gray-500">{label(key)}</dt><dd className="mt-1 break-words font-semibold">{key.includes('account') && !key.endsWith('_type') ? `•••• ${text(row, key).slice(-4)}` : text(row, key)}</dd></div>)}</dl>}</section>; })}</article>)}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous 2FA records</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next 2FA records</NSEButton></div>}
  </div></details>;
}
