import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import NSEAmcPause from './NSEAmcPause';
import NSETopup from './NSETopup';
import NSEEditSip from './NSEEditSip';
import NSESipPause from './NSESipPause';
import NSECancelSip from './NSECancelSip';
import React, { useEffect, useRef, useState } from 'react';
import { nseApi } from '../services/nseApi';
import { buildSipReportRequest } from '../services/nseSipReportService';
import NSEResendCommunication from './NSEResendCommunication';
import NSESipMandateMapping from './NSESipMandateMapping';

export default function NSESipReport({ onViewTopups }: { onViewTopups?: (plan: { id: string; name: string }) => void } = {}) {
  const [filters, setFilters] = useState({ client: '' });
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<Record<string, string>>({});
  const version = useRef(0);
  const load = async () => {
    if (!filters.client.trim()) { setError('Enter a client code to find SIP plans.'); return; }
    const request = ++version.current;
    setBusy(true); setSelectedAction({}); setError(''); setRows([]); setSearched(false); setPage(1);
    try {
      const body = buildSipReportRequest({ client_code: filters.client.trim() });
      const response = await nseApi.sipReport(body);
      if (response.response_status !== 'S') throw new Error(response.error_remark || 'Mutual funds SIP report failed');
      if (!Array.isArray(response.report_data) || response.report_data.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Mutual funds returned an unreadable SIP report');
      if (request === version.current) { const clients = new Set(filters.client.split(',').map(code => code.trim().toUpperCase())); setRows((response.report_data as Record<string, unknown>[]).filter(row => clients.has(String(row.client_code || '').trim().toUpperCase()))); setSearched(true); }
    } catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load SIP registrations'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => () => { version.current++; }, []);
  const update = (key: keyof typeof filters, value: string) => { version.current++; setFilters(previous => ({ ...previous, [key]: value })); setSelectedAction({}); setRows([]); setSearched(false); setError(''); };
  const field = (row: Record<string, unknown>, key: string) => row[key] == null || typeof row[key] === 'object' ? '' : String(row[key]).trim();
  const pages = Math.max(1, Math.ceil(rows.length / 24));
  return <section aria-label="Existing Mutual funds SIP registrations" className="space-y-4 border-b border-gray-100 p-5">
    <NSEHeading as="h2" className="text-xl font-bold text-[#102B78]">Find your SIP plans</NSEHeading>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {([['client', 'Client codes']] as const).map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input disabled={busy} type="text" value={filters[key]} onChange={event => update(key, event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></label>)}
      <NSEButton disabled={busy || !filters.client.trim()} onClick={() => void load()} className="self-end rounded-lg bg-[#102B78] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Loading SIPs...' : 'Load Mutual funds SIPs'}</NSEButton>
    </div>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {searched && <p role="status" className="text-sm text-gray-500">{rows.length ? `${rows.length} Mutual funds SIP registrations` : 'Mutual funds returned no SIP registrations for these filters.'}</p>}
    <div className="grid items-start gap-4 md:grid-cols-2">{rows.slice((page - 1) * 24, page * 24).map((row, index) => {
      const id = field(row, 'sip_reg_number'), status = field(row, 'status'), amount = field(row, 'installments_amount');
      const validAmount = /^\d+(\.\d+)?$/.test(amount);
      return <article key={`${page}-${index}`} className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div><NSEHeading as="h3" className="font-bold text-[#102B78]">{field(row, 'scheme_name') || 'Scheme not reported'}</NSEHeading><p className="mt-1 text-xs text-gray-500">{field(row, 'amc_name')}</p></div>
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#102B78]">{status || 'Status not reported'}</span>
        <div className="rounded-xl bg-[#f4f7fc] p-3"><p className="text-xs text-gray-500">Installment amount</p><p className="mt-1 text-xl font-bold text-[#102B78]">{validAmount ? Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Not reported'}</p><p className="text-xs text-gray-500">{field(row, 'frequency_type') || 'Frequency not reported'}</p></div>
        <p className="text-xs text-slate-500">Client {field(row, 'client_code') || 'Not reported'} &middot; SIP {id || 'Not reported'}</p>
        <details className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-xs font-semibold text-[#102B78]">Plan details</summary>        <dl className="grid grid-cols-2 gap-3 text-xs">{[['Registration ID', id], ['Investor', field(row, 'client_name')], ['Client code', field(row, 'client_code')], ['Registered on', field(row, 'sip_reg_date')], ['Start date', field(row, 'start_date')], ['End date', field(row, 'end_date')], ['Installments', field(row, 'no_of_installments')], ['Folio', field(row, 'folio_number')]].map(([label, value]) => <div key={label}><dt className="text-gray-500">{label}</dt><dd className="mt-1 break-words font-semibold">{value || 'Not reported'}</dd></div>)}</dl></details>
        {[field(row, 'remarks'), field(row, 'exchange_remark')].filter(Boolean).map((remark, i) => <p key={i} className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{remark}</p>)}
        <p className="text-xs text-slate-500">Plan registration only; payment and allotted units are tracked separately.</p>
        <details className="rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold text-[#102B78]">Manage this plan</summary><div className="mt-3 space-y-4"><div className="rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-600"><p className="font-semibold text-slate-800">{field(row, 'client_name') || field(row, 'client_code')}</p><p>Client {field(row, 'client_code')} &middot; SIP {id}</p><p>{validAmount ? Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'Amount not reported'} &middot; {field(row, 'frequency_type')}</p><p>{field(row, 'start_date') || 'Start date not reported'} to {field(row, 'end_date') || 'End date not reported'}</p></div>
        {/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && <div className="grid grid-cols-2 gap-2">{[
          { key: 'mandate', label: 'Link bank mandate', show: status === 'ACTIVE' },
          { key: 'resend', label: 'Resend authorization', show: !/^(CXL|CANCELLED|CANCELED|EXPIRED|REJECTED|FAILED)$/i.test(status) },
          { key: 'pause', label: 'Pause / resume SIP', show: ['ACTIVE', 'PAUSED'].includes(status) && !!field(row, 'frequency_type') && field(row, 'frequency_type').toUpperCase() !== 'DAILY' },
          { key: 'edit', label: 'Edit SIP', show: status === 'ACTIVE' },
          { key: 'topup', label: 'Add annual top-up', show: status === 'ACTIVE' },
          { key: 'amc', label: 'AMC pause / unpause', show: ['ACTIVE', 'PAUSED'].includes(status) },
          { key: 'cancel', label: 'Cancel SIP', show: status === 'ACTIVE' },
        ].filter(action => action.show).map(action => <NSEButton key={action.key} type="button" aria-pressed={selectedAction[id] === action.key} onClick={() => setSelectedAction(previous => ({ ...previous, [id]: previous[id] === action.key ? '' : action.key }))} className={'justify-center rounded-lg border px-3 py-2.5 text-center text-xs font-semibold leading-5 ' + (selectedAction[id] === action.key ? 'border-[#102B78] bg-blue-50 text-[#102B78]' : action.key === 'cancel' ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50')}>{action.label}</NSEButton>)}</div>}
        {selectedAction[id] === "amc" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && ['ACTIVE', 'PAUSED'].includes(status) && <NSEAmcPause key={`amc-${id}`} id={id} client={field(row, 'client_code')} />}</div>}
        {selectedAction[id] === "mandate" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && status === 'ACTIVE' && <NSESipMandateMapping key={`${id}-${field(row, 'client_code')}`} sipId={id} clientCode={field(row, 'client_code')} />}</div>}
        {selectedAction[id] === "resend" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && !cancelled.includes(id) && !/^(CXL|CANCELLED|CANCELED|EXPIRED|REJECTED|FAILED)$/i.test(status) && <NSEResendCommunication key={id} productType="SIP_REG" productRefId={id} />}</div>}
        {selectedAction[id] === "cancel" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && status === 'ACTIVE' && <NSECancelSip key={id} sipId={id} clientCode={field(row, 'client_code')} scheme={field(row, 'scheme_name')} investor={field(row, 'client_name')} onCancelled={() => setCancelled(previous => [...previous, id])} />}</div>}
        {selectedAction[id] === "pause" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && ['ACTIVE', 'PAUSED'].includes(status) && field(row, 'frequency_type') && field(row, 'frequency_type').toUpperCase() !== 'DAILY' && <NSESipPause key={`pause-${id}`} product="SIP" id={id} client={field(row, 'client_code')} frequency={field(row, 'frequency_type')} />}</div>}
        {selectedAction[id] === "edit" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && status === 'ACTIVE' && <NSEEditSip key={`edit-${id}`} id={id} client={field(row, 'client_code')} scheme={field(row, 'scheme_name')} current={{ amount, primary_holder_email: field(row, 'primary_holder_email'), primary_holder_mobile: field(row, 'primary_holder_mobile'), folio_no: field(row, 'folio_number'), euin_number: field(row, 'euin'), sub_broker_code: field(row, 'sub_broker_code'), sub_broker_arn: field(row, 'sub_broker_arn_code') }} />}</div>}
        {selectedAction[id] === "topup" && <div className="rounded-xl border border-blue-100 bg-white p-3">{/^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && field(row, 'client_code') && !cancelled.includes(id) && status === 'ACTIVE' && <NSETopup key={`topup-${id}`} plan={{ product: 'SIP', id, client: field(row, 'client_code'), baseAmount: amount, baseStart: field(row, 'start_date'), baseEnd: field(row, 'end_date') }} />}</div>}
        {onViewTopups && /^[0-9]{1,15}$/.test(id) && /[1-9]/.test(id) && <NSEButton onClick={() => onViewTopups({ id, name: field(row, 'scheme_name') })} className="w-full rounded-lg border border-[#4C85CF] px-3 py-2 text-xs font-semibold text-[#102B78]">View top-ups for this SIP</NSEButton>}
        </div></details>
      </article>;
    })}</div>
    {pages > 1 && <div className="flex justify-between text-sm text-[#102B78]"><NSEButton disabled={page === 1} onClick={() => setPage(page - 1)}>Previous SIPs</NSEButton><span>{page} / {pages}</span><NSEButton disabled={page === pages} onClick={() => setPage(page + 1)}>Next SIPs</NSEButton></div>}
  </section>;
}
