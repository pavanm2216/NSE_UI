import NSESearchFields from './NSESearchFields';
import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import NSECancelSwp from './NSECancelSwp';
import NSEEditSwp from './NSEEditSwp';
import React, { useEffect, useRef, useState } from 'react';
import { nseApi } from '../services/nseApi';
import { buildSwpReportRequest } from '../services/nseSwpReportService';

const toReportDate = (iso: string) => iso.split('-').reverse().join('-');
export default function NSESwpReport({ onViewDue }: { onViewDue?: (plan: { id: string; name: string }) => void } = {}) {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const yesterday = new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10);
  const [filters, setFilters] = useState({ sip: '', client: '', member: '', from: yesterday, to: today });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [cancelled, setCancelled] = useState<string[]>([]);
  const version = useRef(0);
  const load = async () => {
    const request = ++version.current;
    setBusy(true); setError(''); setRows([]); setSearched(false); setPage(1);
    try {
      const body = buildSwpReportRequest({ swp_reg_id: filters.sip, client_code: filters.client, member_unique_ids: filters.member, from_date: toReportDate(filters.from), to_date: toReportDate(filters.to) });
      const response = await nseApi.swpReport(body);
      if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds SWP report failed');
      if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable SWP report');
      if (request === version.current) { setRows(response.report_data as Record<string, unknown>[]); setSearched(true); }
    } catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load SWP registrations'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => { void load(); return () => { version.current++; }; }, []);
  const update = (key: keyof typeof filters, value: string) => { version.current++; setFilters(previous => ({ ...previous, [key]: value })); setRows([]); setSearched(false); setError(''); };
  const field = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 24));
  return <section aria-label="Existing Mutual funds SWP registrations" className="space-y-4 border-b border-gray-100 p-5">
    <NSEHeading as="h2" className="text-xl font-bold text-[#102B78]">Existing Mutual funds SWPs</NSEHeading>
    <div className="space-y-4">
      <NSESearchFields>{([['sip', 'SWP registration IDs'], ['client', 'Client codes'], ['member', 'Member references'], ['from', 'From date'], ['to', 'To date']] as const).map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input disabled={busy || ((key === 'from' || key === 'to') && !!(filters.sip.trim() || filters.member.trim() || filters.client.trim()))} type={key === 'from' || key === 'to' ? 'date' : 'text'} value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>)}</NSESearchFields>
      <NSEButton disabled={busy} onClick={() => void load()} className="self-end rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading SWPs...' : 'Load Mutual funds SWPs'}</NSEButton>
    </div>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} Mutual funds SWP registrations` : 'Mutual funds returned no SWP registrations for these filters.'}</p>}
    <div className="grid items-start gap-4 md:grid-cols-2">{rows.slice((page - 1) * 24, page * 24).map((row, index) => {
      const id = field(row, 'swp_registration_no'), status = cancelled.includes(id) ? 'CXL' : field(row, 'status'), amount = field(row, 'withdrawl_amount');
      const validAmount = /^\d+(\.\d+)?$/.test(amount);
      return <article key={`${page}-${index}`} className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div><NSEHeading as="h3" className="font-bold text-[#102B78]">{field(row, 'scheme_name') || 'Scheme not reported'}</NSEHeading><p className="mt-1 text-xs text-gray-500">{field(row, 'amc')}</p></div>
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#102B78]">{status === 'CXL' ? 'Cancelled (CXL)' : status || 'Status not reported'}</span>
        <div className="rounded-xl bg-[#f4f7fc] p-3"><p className="text-xs text-gray-500">Withdrawal per installment</p><p className="mt-1 text-xl font-bold text-[#102B78]">{Number(field(row, 'withdrawal_units')) > 0 ? `${field(row, 'withdrawal_units')} units` : validAmount && Number(amount) > 0 ? Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Not reported'}</p><p className="text-xs text-gray-500">{field(row, 'frequency_type') || 'Frequency not reported'}</p></div>
        <details className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold text-[#102B78]">Plan details</summary>        <dl className="grid grid-cols-2 gap-3 text-xs">{[['Registration ID', id], ['Investor', field(row, 'client_name')], ['Client code', field(row, 'client_code')], ['Registered on', field(row, 'swp_registration_date')], ['Start date', field(row, 'swp_start_date')], ['End date', field(row, 'swp_end_date')], ['Withdrawals', field(row, 'no_of_withdrawls')], ['Folio', field(row, 'folio_no')], ['Transaction mode', field(row, 'transaction_mode')], ['Scheme code', field(row, 'nse_scheme_code')], ['Member reference', field(row, 'member_unique_id')], ['Payout account', field(row, 'bank_account_no') ? `•••• ${field(row, 'bank_account_no').slice(-4)}` : '']].map(([label, value]) => <div key={label}><dt className="text-gray-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value || 'Not reported'}</dd></div>)}</dl></details>
        {[field(row, 'remark'), field(row, 'exchange_remark')].filter(Boolean).map((remark, i) => <p key={i} className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{remark}</p>)}
        <details className="rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold text-[#102B78]">Manage this plan</summary><div className="mt-3 space-y-4">        {/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && status === 'ACTIVE' && <NSECancelSwp key={id} id={id} client={field(row, 'client_code')} scheme={field(row, 'scheme_name')} onCancelled={() => setCancelled(previous => [...previous, id])} />}
        <p className="text-xs text-gray-500">Registration status does not confirm redemption completion or bank payout.</p>
        {onViewDue && /^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && <NSEButton onClick={() => onViewDue({ id, name: field(row, 'scheme_name') })} className="w-full rounded-lg border border-[#4C85CF] px-3 py-2 text-xs font-semibold text-[#102B78]">View upcoming withdrawals</NSEButton>}
        {/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && status === 'ACTIVE' && <NSEEditSwp key={`edit-${id}`} id={id} client={field(row, 'client_code')} scheme={field(row, 'scheme_name')} mode={field(row, 'transaction_mode')} current={{ amount: field(row, 'withdrawl_amount'), primary_holder_email: field(row, 'email_id'), primary_holder_mobile: field(row, 'mobile_no'), folio_no: field(row, 'folio_no'), euin_number: field(row, 'euin_number'), sub_broker_code: field(row, 'subbrcode'), sub_broker_arn: field(row, 'sub_broker_arn_code') }} />}
</div></details>
      </article>;
    })}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous SWPs</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next SWPs</NSEButton></div>}
  </section>;
}
