import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildStpModification, modifyNSEStp, STP_EDIT_FIELDS, type StpEdits } from '../services/nseStpModificationService';
export default function NSEEditStp({ id, client, scheme, current, mode }: { id: string; client: string; scheme: string; current: StpEdits; mode: string }) {
  const [open, setOpen] = useState(false), [review, setReview] = useState(false), [consent, setConsent] = useState(false);
  const [edits, setEdits] = useState<StpEdits>({}), [remarks, setRemarks] = useState('');
  const [send2fa, setSend2fa] = useState(true), [sendComm, setSendComm] = useState(true);
  const [busy, setBusy] = useState(false), [attempted, setAttempted] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const lock = useRef(false);
  const changes = Object.fromEntries(Object.entries(edits).filter(([key, value]) => value?.trim() && value.trim() !== current[key as keyof StpEdits]?.trim())) as StpEdits;
  const submit = async () => {
    if (lock.current || attempted || !consent || !review) return;
    lock.current = true; setBusy(true); setAttempted(true); setError('');
    try { setMessage(await modifyNSEStp(id, changes, remarks, send2fa, sendComm, mode)); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'STP modification was not confirmed'); }
    finally { lock.current = false; setBusy(false); }
  };
  return <div className="border-t border-gray-100 pt-3">
    {!open && <NSEButton onClick={() => setOpen(true)} className="rounded-lg border border-[#4C85CF] px-3 py-2 text-xs font-semibold text-[#102B78]">Edit STP</NSEButton>}
    {open && <div className="space-y-3 rounded-xl bg-blue-50/50 p-3 text-xs"><NSEHeading as="h4" className="font-bold text-[#102B78]">{review ? 'Review STP changes' : 'Edit STP details'}</NSEHeading><p>{scheme}<br />Client {client} · STP {id}</p>
      {!review && <><p className="text-gray-500">Fill only the fields you want to change. Empty fields keep their existing values. Mutual funds validates scheme limits and amount multiples.</p>{STP_EDIT_FIELDS.filter(([key]) => key !== 'amount' || /^(P|PHYSICAL)$/i.test(mode)).map(([key, label, max]) => <label key={key} className="block font-medium">{label}{current[key] && <span className="ml-1 font-normal text-gray-500">(Current: {current[key]})</span>}<input type={key === 'primary_holder_email' ? 'email' : 'text'} inputMode={key === 'amount' ? 'decimal' : key === 'primary_holder_mobile' ? 'numeric' : undefined} maxLength={max} value={edits[key] || ''} onChange={event => setEdits(previous => ({ ...previous, [key]: event.target.value }))} className="mt-1 w-full rounded border bg-white p-2" /></label>)}<label className="block">Remarks (optional)<textarea maxLength={100} value={remarks} onChange={event => setRemarks(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><label className="flex gap-2"><input type="checkbox" checked={send2fa} onChange={event => setSend2fa(event.target.checked)} />Request two-factor authorization</label><label className="flex gap-2"><input type="checkbox" checked={sendComm} onChange={event => setSendComm(event.target.checked)} />Send investor communication</label><p className="text-gray-500">Transaction-mode changes require additional investor document checks and are unavailable here. Demat units cannot be edited through this form.</p><NSEButton onClick={() => { try { buildStpModification(id, changes, remarks, send2fa, sendComm, mode); setReview(true); setError(''); } catch (failure) { setError((failure as Error).message); } }} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white">Review changes</NSEButton></>}
      {review && !attempted && <><dl className="space-y-2">{STP_EDIT_FIELDS.filter(([key]) => changes[key]).map(([key, label]) => <div key={key}><dt className="text-gray-500">{label}</dt><dd className="break-words font-semibold">{current[key] || 'Not reported'} → {changes[key]}</dd></div>)}</dl><p>Two-factor authorization: {send2fa ? 'Yes' : 'No'} · Investor communication: {sendComm ? 'Yes' : 'No'}</p>{remarks && <p>Remarks: {remarks}</p>}<label className="flex items-start gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm submitting these changes to Mutual funds for this STP.</label><div className="flex gap-2"><NSEButton onClick={() => { setReview(false); setConsent(false); }} className="rounded border px-3 py-2">Edit changes</NSEButton><NSEButton disabled={!consent} onClick={() => void submit()} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white disabled:opacity-50">Confirm STP changes</NSEButton></div></>}
      {busy && <p role="status">Submitting changes...</p>}{message && <p role="status" className="text-[#102B78]">{message}. Reload My plans to see the latest details. Authorization and installment payments are tracked separately.</p>}{error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check the STP report before retrying.'}</p>}
      {!attempted && <NSEButton onClick={() => { setOpen(false); setReview(false); setConsent(false); setError(''); }} className="text-gray-500 underline">Close editor</NSEButton>}
    </div>}
  </div>;
}
