import { NSEButton, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildNSETopup, registerNSETopup, type NSETopupInput } from '@/services/nseTopupService';
export default function NSETopup({ plan }: { plan: Pick<NSETopupInput, 'product' | 'id' | 'client' | 'baseAmount' | 'baseStart' | 'baseEnd'> }) {
  const [open, setOpen] = useState(false), [review, setReview] = useState(false), [consent, setConsent] = useState(false);
  const [fields, setFields] = useState({ amount: '', start: '', end: '', mobile: '', email: '' });
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [attempted, setAttempted] = useState(false);
  const [reference] = useState(() => `T${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`);
  const lock = useRef(false);
  const input = () => ({ ...plan, ...fields, reference });
  const submit = async () => {
    if (lock.current || attempted || !consent || !review) return;
    lock.current = true; setBusy(true); setAttempted(true); setError('');
    try { const result = await registerNSETopup(input()); setMessage(`${result.remark}. Top-up registration ID: ${result.id}`); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Top-up registration is not confirmed'); }
    finally { lock.current = false; setBusy(false); }
  };
  return <div className="border-t border-gray-100 pt-3">{!open && <NSEButton onClick={() => setOpen(true)} className="rounded-lg border border-[#4C85CF] px-3 py-2 text-xs font-semibold text-[#102B78]">Add annual top-up</NSEButton>}{open && <div className="space-y-3 rounded-xl bg-blue-50/50 p-3 text-xs"><NSEHeading as="h4" className="font-bold text-[#102B78]">{review ? 'Review annual top-up' : 'Increase your installment annually'}</NSEHeading><p>{plan.product} {plan.id} · Client {plan.client}</p><p>Base installment: ₹{plan.baseAmount}<br />Base schedule: {plan.baseStart || 'Not reported'} to {plan.baseEnd || 'Not reported'}</p>
    {!review && <><p className="text-gray-500">The top-up amount is added each year. Start on the base plan’s installment day; the top-up must last whole years within the base schedule. Mutual funds validates scheme limits and mandate eligibility.</p>{([['amount', 'Annual increase (₹)', 'text'], ['start', 'Top-up start date', 'date'], ['end', 'Top-up end date', 'date'], ['mobile', 'Primary holder mobile', 'tel'], ['email', 'Primary holder email', 'email']] as const).map(([key, label, type]) => <label key={key} className="block">{label}<input type={type} maxLength={key === 'mobile' ? 10 : key === 'email' ? 50 : key === 'amount' ? 13 : undefined} value={fields[key]} onChange={event => setFields(previous => ({ ...previous, [key]: event.target.value }))} className="mt-1 w-full rounded border bg-white p-2" /></label>)}<p className="text-gray-500">At least one primary holder contact is required.</p><NSEButton onClick={() => { try { buildNSETopup(input()); setReview(true); setError(''); } catch (failure) { setError((failure as Error).message); } }} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white">Review top-up</NSEButton></>}
    {review && !attempted && <><p className="font-semibold">Annual increase: ₹{fields.amount}<br />First increased installment: ₹{Number(plan.baseAmount) + Number(fields.amount)}<br />Top-up schedule: {fields.start} to {fields.end}<br />Frequency: Annually</p><p>Primary holder contact: {fields.mobile || fields.email}</p><label className="flex items-start gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm registering this annual top-up with Mutual funds.</label><div className="flex gap-2"><NSEButton onClick={() => { setReview(false); setConsent(false); }} className="rounded border px-3 py-2">Edit top-up</NSEButton><NSEButton disabled={!consent} onClick={() => void submit()} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white disabled:opacity-50">Confirm top-up</NSEButton></div></>}
    {busy && <p role="status">Registering top-up...</p>}{message && <p role="status" className="text-[#102B78]">{message}. Authorization and installment payments remain separate.</p>}{error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check Mutual funds reports before retrying.'}</p>}{!attempted && <NSEButton onClick={() => { setOpen(false); setReview(false); setConsent(false); setError(''); }} className="text-gray-500 underline">Close top-up</NSEButton>}
  </div>}</div>;
}
