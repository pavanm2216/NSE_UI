import NSESearchFields from './NSESearchFields';
import { NSEButton, NSESummary, NSEHeading } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { getNSEFundAge, NSEFundAgeInput } from '../services/nseFundAgeService';
const labels: Record<string, string> = { clientcode: 'Client code', clientname: 'Investor', schemecode: 'Scheme code', schemename: 'Scheme', buyvalue: 'Order value', orderstatus: 'Order status', settlementno: 'Settlement number', settlementtype: 'Settlement type', dp_folio_no: 'Depository account', foliono: 'Folio', accountno: 'Bank account', funds_received_status: 'Fund receipt code (Mutual funds)', credit_confirmation_on_date: 'Credit confirmation date' };
const groups = [
  ['Order', ['date', 'clientcode', 'clientname', 'schemecode', 'schemename', 'isin', 'buyvalue', 'orderstatus']],
  ['Settlement and holding', ['settlementno', 'settlementtype', 'dp_transaction_mode', 'dp_folio_no', 'foliono']],
  ['Funds received', ['funds_received_status', 'mode_funds_initiated_received', 'bank_where_funds_received', 'date_of_receipt_of_funds', 'credit_confirmation_on_date', 'referenceno', 'groupid', 'accountno']],
  ['Refund', ['refund_utr_no', 'refund_amount', 'refund_date']],
] as const;
export default function NSEFundAgeReport() {
  const date = (days: number) => new Date(Date.now() - days * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [filters, setFilters] = useState<NSEFundAgeInput>({ date: date(0), client_code: '', settlement_type: 'all', amc_code: '', scheme_code: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]), [busy, setBusy] = useState(false), [searched, setSearched] = useState(false), [error, setError] = useState(''), [page, setPage] = useState(1);
  const lock = useRef(false);
  const update = (key: keyof NSEFundAgeInput, value: string) => { setFilters(old => ({ ...old, [key]: value })); setRows([]); setSearched(false); setError(''); setPage(1); };
  const load = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setRows([]); setError(''); setSearched(false); setPage(1);
    try { setRows(await getNSEFundAge(filters)); setSearched(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to fetch age-wise funds report'); }
    finally { lock.current = false; setBusy(false); }
  };
  const value = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 12));
  return <details className="border-b border-gray-100 p-5"><NSESummary className="cursor-pointer text-lg font-bold text-[#102B78]">Funds received by date and bank</NSESummary><div className="mt-4 space-y-4">
    <p className="text-sm text-gray-500">Review order status, bank receipt details and refunds for a report date. Fund receipt codes are displayed exactly as Mutual funds returns them; they do not by themselves confirm payment or allotment.</p>
    <form onSubmit={load} className="space-y-3"><NSESearchFields disabled={busy}>
      {([['date', 'Report date', 'date'], ['client_code', 'Client codes', 'text'], ['settlement_type', 'Settlement code', 'text'], ['amc_code', 'AMC code', 'text'], ['scheme_code', 'Scheme code', 'text']] as const).map(([key, title, type]) => <label key={key} className="text-sm font-semibold">{title}<input required={key === 'date'} type={type} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded border p-2" /></label>)}
    </NSESearchFields><p className="text-xs text-gray-500">Report date is required. Enter up to 50 client codes. Leave settlement as all, or enter a code from the Mutual funds settlement master. AMC and scheme filters use their respective master codes.</p><NSEButton disabled={busy} className="rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading age-wise funds report...' : 'Load age-wise funds report'}</NSEButton></form>
    {error && <p role="alert" className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} age-wise funds records` : 'Mutual funds returned no age-wise funds records for these filters.'}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{rows.slice((page - 1) * 12, page * 12).map((row, index) => <article key={index} className="space-y-3 rounded-xl border p-4"><NSEHeading as="h3" className="font-bold text-[#102B78]">Order {value(row, 'orderno') || 'ID not reported'}</NSEHeading>{groups.map(([title, keys]) => <section key={title} className="rounded bg-blue-50 p-3"><NSEHeading as="h4" className="text-sm font-semibold">{title}</NSEHeading><dl>{keys.map(key => <div key={key} className="mt-2 text-xs"><dt className="text-gray-500">{labels[key] || key.replace(/_/g, ' ')}</dt><dd className="break-words font-semibold">{value(row, key) ? (key === 'accountno' || key === 'dp_folio_no') ? `Account ending ${value(row, key).slice(-4)}` : value(row, key) : 'Not reported'}</dd></div>)}</dl></section>)}</article>)}</div>
    {pages > 1 && <div className="flex justify-between"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next</NSEButton></div>}
  </div></details>;
}
