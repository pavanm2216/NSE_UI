import { NSEButton, NSEHeading } from '../components/NSEPresentation';
import { buildDailyXsipCancellation, cancelNSEDailyXsip, dailyXsipEarliestDate } from '../services/nseDailyXsipCancellationService';
import React, { useRef, useState } from 'react';
import { XSIP_CANCELLATION_REASONS } from '../services/nseXsipCancellationService';

export default function NSECancelDailyXsip({ sipId, clientCode, scheme, investor, onCancelled }: { sipId: string; clientCode: string; scheme: string; investor: string; onCancelled: () => void }) {
  const [open, setOpen] = useState(false), [review, setReview] = useState(false), [consent, setConsent] = useState(false);
  const [reason, setReason] = useState(''), [other, setOther] = useState(''), [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const pending = useRef(false);
  const [effectiveDate, setEffectiveDate] = useState('');
  const submit = async () => {
    if (!consent || !review || pending.current || attempted) return;
    pending.current = true; setBusy(true); setAttempted(true); setError('');
    try { setMessage(await cancelNSEDailyXsip(clientCode, sipId, reason, other, effectiveDate, 'DAILY')); onCancelled(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Cancellation was not confirmed'); }
    finally { pending.current = false; setBusy(false); }
  };
  return <div className="border-t border-gray-100 pt-3">
    {!open && <NSEButton onClick={() => setOpen(true)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Schedule daily XSIP cancellation</NSEButton>}
    {open && <div className="space-y-3 rounded-xl bg-rose-50/50 p-3 text-xs">
      <NSEHeading as="h4" className="font-bold text-slate-900">{review ? 'Review daily XSIP cancellation' : 'Schedule daily XSIP cancellation'}</NSEHeading>
      <p className="text-gray-600">{scheme} · {investor || clientCode}<br />Client: {clientCode} · XSIP: {sipId}</p>
      {!review && <><label className="block font-medium">Cancellation effective date<input type="date" min={dailyXsipEarliestDate()} value={effectiveDate} onChange={event => setEffectiveDate(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><p>Choose at least two working days ahead. Mutual funds validates exchange holidays and may require a later date.</p><label className="block font-medium">Cancellation reason<select value={reason} onChange={event => setReason(event.target.value)} className="mt-1 w-full rounded border bg-white p-2"><option value="">Select reason</option>{XSIP_CANCELLATION_REASONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label>{reason === '13' && <label className="block font-medium">Other reason<textarea maxLength={95} value={other} onChange={event => setOther(event.target.value)} className="mt-1 w-full rounded border p-2" /></label>}<NSEButton onClick={() => { try { buildDailyXsipCancellation(clientCode, sipId, reason, other, effectiveDate, 'DAILY'); setError(''); setReview(true); } catch (failure) { setError((failure as Error).message); } }} className="rounded-lg bg-[#102B78] px-3 py-2 font-semibold text-white">Review cancellation</NSEButton></>}
      {review && !attempted && <><p>Scheduled effective date: {effectiveDate.split('-').reverse().join('/')}</p><p>Reason: {XSIP_CANCELLATION_REASONS.find(([code]) => code === reason)?.[1]}{reason === '13' ? `: ${other}` : ''}</p><p className="text-gray-600">This submits a live cancellation request to Mutual funds. It does not redeem your existing investments or confirm that an already generated installment will stop.</p><label className="flex items-start gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm cancellation of this XSIP.</label><div className="flex gap-2"><NSEButton onClick={() => { setReview(false); setConsent(false); }} className="rounded border px-3 py-2">Edit reason</NSEButton><NSEButton disabled={!consent || busy} onClick={() => void submit()} className="rounded bg-rose-700 px-3 py-2 font-semibold text-white disabled:opacity-50">Confirm daily XSIP cancellation</NSEButton></div></>}
      {busy && <p role="status">Submitting cancellation...</p>}
      {message && <p role="status" className="text-[#102B78]">{message}. Reload the registration and cancellation reports to check the latest status.</p>}
      {error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check Mutual funds reports before attempting another cancellation.'}</p>}
      {!attempted && <NSEButton onClick={() => { setOpen(false); setReview(false); setConsent(false); setError(''); }} className="text-gray-500 underline">Keep XSIP</NSEButton>}
    </div>}
  </div>;
}
