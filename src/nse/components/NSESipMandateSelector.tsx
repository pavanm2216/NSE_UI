import React, { useEffect, useRef, useState } from 'react';
import { NSEButton } from './NSEPresentation';
import { MandateForm } from './NSEMandates';
import NSEMandateCard from './NSEMandateCard';
import { nseApi } from '../services/nseApi';
import type { NSEInvestorSelection } from '../services/nseInvestorService';

type Mandate = { id: string; status: string; amount: number; bank: string; raw: Record<string, unknown> };
export default function NSESipMandateSelector({ investor, amount, onChange }: {
  investor: NSEInvestorSelection; amount: number; onChange: (id: string) => void;
}) {
  const [rows, setRows] = useState<Mandate[]>([]);
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [registering, setRegistering] = useState(false);
  const change = useRef(onChange);
  change.current = onChange;
  useEffect(() => {
    let cancelled = false;
    setBusy(true); setError(''); setRows([]); setSelected(''); change.current('');
    nseApi.mandateStatus({ client_code: investor.clientCode }).then(response => {
      if (response.response_status !== 'S' || (response.report_data != null && !Array.isArray(response.report_data))) throw new Error(response.error_remark || 'Unable to load mandates for this client.');
      const mandates = (response.report_data || []).flatMap(value => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
        const row = value as Record<string, unknown>;
        const client = String(row.clientCode ?? row.client_code ?? '').trim();
        const id = String(row.mandateId ?? row.mandate_id ?? '').trim();
        if (client !== investor.clientCode || !/^\d{1,13}$/.test(id) || !/[1-9]/.test(id)) return [];
        return [{ id, status: String(row.status ?? row.mandate_status ?? 'Not reported').trim().toUpperCase(), amount: Number(row.amount ?? row.mandate_amount), bank: String(row.bankName ?? row.bank_name ?? 'Registered bank'), raw: row }];
      });
      if (!cancelled) setRows(mandates);
    }).catch(failure => { if (!cancelled) setError(failure instanceof Error ? failure.message : 'Unable to load mandates.'); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [investor.clientCode, refresh]);
  const eligible = (row: Mandate) => row.status === 'APPROVED' && Number.isFinite(row.amount) && row.amount >= amount && row.amount > 0;
  useEffect(() => {
    if (selected && !rows.some(row => row.id === selected && eligible(row))) { setSelected(''); change.current(''); }
  }, [amount, rows, selected]);
  return <section className="min-w-0 space-y-3 rounded-xl border border-slate-200 p-4" aria-label="SIP bank mandate">
    <label className="block text-sm font-semibold">Approved SIP mandate
      <select disabled={busy} value={selected} onChange={event => { const id = event.target.value; setSelected(id); change.current(id); }} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
        <option value="">{busy ? 'Loading client mandates…' : 'Select an approved mandate'}</option>
        {rows.map(row => <option key={row.id} value={row.id} disabled={!eligible(row)}>{row.bank} · {row.id} · {row.status} · {Number.isFinite(row.amount) ? `Limit ₹${row.amount.toLocaleString('en-IN')}` : 'Limit not reported'}{row.status === 'APPROVED' && row.amount < amount ? ' · Below SIP amount' : ''}</option>)}
      </select>
    </label>
    {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
    {!busy && !error && <p className="text-sm leading-6 text-slate-600">{!rows.length ? 'No mandates found for this client. Register a bank mandate to set up automatic debit.' : !rows.some(eligible) ? 'No approved mandate covers this installment. Complete authorization for a pending mandate, or register a new mandate.' : 'Select a mandate for this client. Mutual funds approval and debit limit are checked again before review and submission.'}</p>}
    <div className="flex flex-wrap gap-4">
      <NSEButton type="button" disabled={busy} onClick={() => setRefresh(value => value + 1)} className="text-sm font-semibold text-[#102B78]">Refresh client mandates</NSEButton>
      <NSEButton type="button" disabled={busy} onClick={() => setRegistering(true)} className="rounded-lg border border-[#102B78] px-3 py-2 text-sm font-semibold text-[#102B78]">Register mandate</NSEButton>
    </div>
    {!busy && !error && rows.some(row => /^(PENDING|PROCESSING|REGISTERED)$/.test(row.status)) && <details className="rounded-lg border border-slate-200 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-[#102B78]">Complete pending mandate authorization</summary>
      <div className="mt-3 space-y-4">{rows.filter(row => /^(PENDING|PROCESSING|REGISTERED)$/.test(row.status)).map(row => <NSEMandateCard key={row.id} row={row.raw} />)}</div>
    </details>}
    <p className="text-xs leading-5 text-slate-500">New mandates require investor authorization and Mutual funds approval. After approval, refresh this list and select the mandate to continue your SIP.</p>
    {registering && <MandateForm initialSelection={investor} onRecord={() => {}} onClose={() => { setRegistering(false); setRefresh(value => value + 1); }} />}
  </section>;
}
