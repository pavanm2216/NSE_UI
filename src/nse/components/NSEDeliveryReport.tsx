import NSESearchFields from './NSESearchFields';
import { NSEButton, NSESummary, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { getNSEDelivery, NSEDeliveryInput } from '@/services/nseDeliveryService';
const groups = [
  ['Order and settlement', ['order_date', 'sett_no', 'sett_type', 'isin', 'amount', 'alloted_units', 'nav', 'depository', 'account_no', 'member_unique_id']],
  ['Units delivered', ['units_delivered', 'date_of_delivery']],
  ['Reported shortage', ['cdsl_shortage', 'nsdl_shortage']],
  ['Later shortage delivery', ['shortage_delivered', 'shortage_settlement_no', 'shortage_date_of_delivery', 'remarks']],
] as const;
export default function NSEDeliveryReport() {
  const date = (days: number) => new Date(Date.now() - days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState<NSEDeliveryInput>({ from_date: date(7), to_date: date(0), date_type: 'TRANSACTION DATE', client_code: '', settlement_type: 'ALL', dp_type: 'ALL', order_ids: '', member_unique_ids: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]), [busy, setBusy] = useState(false), [searched, setSearched] = useState(false), [error, setError] = useState(''), [page, setPage] = useState(1);
  const lock = useRef(false);
  const update = (key: keyof NSEDeliveryInput, value: string) => { setFilters(old => ({ ...old, [key]: value })); setRows([]); setSearched(false); setError(''); setPage(1); };
  const load = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setRows([]); setError(''); setSearched(false); setPage(1);
    try { setRows(await getNSEDelivery(filters)); setSearched(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to fetch delivery report'); }
    finally { lock.current = false; setBusy(false); }
  };
  const value = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 12));
  return <details className="border-b border-gray-100 p-5"><NSESummary className="cursor-pointer text-lg font-bold text-[#102B78]">Securities delivery and shortages</NSESummary><div className="mt-4 space-y-4">
    <p className="text-sm text-gray-500">Track units delivered, reported shortages and later shortage deliveries from Mutual funds. NA is preserved separately from zero; this report does not calculate current holdings.</p>
    <form onSubmit={load} className="space-y-3"><NSESearchFields disabled={busy}>
      {([['order_ids', 'Order IDs', 'text'], ['member_unique_ids', 'Member reference IDs', 'text'], ['client_code', 'Client codes', 'text'], ['from_date', 'Transaction from date', 'date'], ['to_date', 'Transaction to date', 'date']] as const).map(([key, title, type]) => <label key={key} className="text-sm font-semibold">{title}<input type={type} required={type === 'date'} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2" /></label>)}
      {([['settlement_type', 'Settlement', ['ALL', 'L0', 'OTHERS']], ['dp_type', 'Depository', ['ALL', 'CDSL', 'NSDL']]] as const).map(([key, title, values]) => <label key={key} className="text-sm font-semibold">{title}<select value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2">{values.map(item => <option key={item}>{item}</option>)}</select></label>)}
    </NSESearchFields><p className="text-xs text-gray-500">Dates are required for every search, including searches by client code or reference. Choose an end date after the start date, no more than 7 days apart and not in the future.</p><NSEButton disabled={busy} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading delivery report...' : 'Load delivery report'}</NSEButton></form>
    {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} delivery records` : 'Mutual funds returned no delivery records for these filters.'}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{rows.slice((page - 1) * 12, page * 12).map((row, index) => <article key={index} className="space-y-3 rounded-xl border p-4"><NSEHeading as="h3" className="font-bold text-[#102B78]">Order {value(row, 'order_no') || 'ID not reported'}</NSEHeading>{groups.map(([title, keys]) => <section key={title} className="rounded bg-blue-50 p-3"><NSEHeading as="h4" className="text-sm font-semibold">{title}</NSEHeading><dl>{keys.map(key => <div key={key} className="mt-2 text-xs"><dt className="text-gray-500">{key.replace(/_/g, ' ')}</dt><dd className="break-words font-semibold">{value(row, key) ? key === 'account_no' ? `Account ending ${value(row, key).slice(-4)}` : value(row, key) : 'Not reported'}</dd></div>)}</dl></section>)}</article>)}</div>
    {pages > 1 && <div className="flex justify-between"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next</NSEButton></div>}
  </div></details>;
}
