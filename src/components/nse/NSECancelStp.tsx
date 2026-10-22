import { NSEButton, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildStpCancellation, cancelNSEStp } from '@/services/nseStpCancellationService';
export default function NSECancelStp({ id, client, source, destination, onCancelled }: { id: string; client: string; source: string; destination: string; onCancelled: () => void }) {
  const [open, setOpen] = useState(false), [review, setReview] = useState(false), [consent, setConsent] = useState(false);
  const [remarks, setRemarks] = useState(''), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false), [attempted, setAttempted] = useState(false);
  const lock = useRef(false);
  const submit = async () => {
    if (!consent || !review || lock.current || attempted) return;
    lock.current = true; setBusy(true); setAttempted(true); setError('');
    try { setMessage(await cancelNSEStp(client, id, remarks)); onCancelled(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Cancellation is not confirmed'); }
    finally { setBusy(false); lock.current = false; }
  };
  return <div className="border-t border-gray-100 pt-3">{!open && <NSEButton onClick={() => setOpen(true)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700">Cancel STP</NSEButton>}{open && <div className="space-y-3 rounded-xl bg-rose-50/50 p-3 text-xs"><NSEHeading as="h4" className="font-bold text-slate-900">{review ? 'Review STP cancellation' : 'Cancel STP'}</NSEHeading><p>Client {client} · STP {id}</p><p className="font-semibold">{source} → {destination}</p>
    {!review && <><label className="block">Cancellation remarks (optional)<textarea maxLength={100} value={remarks} onChange={event => setRemarks(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><NSEButton onClick={() => { try { buildStpCancellation(client, id, remarks); setReview(true); setError(''); } catch (failure) { setError((failure as Error).message); } }} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white">Review cancellation</NSEButton></>}
    {review && !attempted && <><p>Remarks: {remarks || 'None'}</p><p className="text-gray-600">This sends a live cancellation request to Mutual funds. It does not reverse transfers already executed or confirm that an already generated transfer will stop.</p><label className="flex gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm cancelling this STP.</label><div className="flex gap-2"><NSEButton onClick={() => { setReview(false); setConsent(false); }} className="rounded border px-3 py-2">Edit remarks</NSEButton><NSEButton disabled={!consent} onClick={() => void submit()} className="rounded bg-rose-700 px-3 py-2 font-semibold text-white disabled:opacity-50">Confirm STP cancellation</NSEButton></div></>}
    {busy && <p role="status">Submitting cancellation...</p>}{message && <p role="status" className="text-[#102B78]">{message}. Check the latest Mutual funds registration and cancellation reports.</p>}{error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check Mutual funds reports before retrying.'}</p>}{!attempted && <NSEButton onClick={() => { setOpen(false); setReview(false); setConsent(false); setError(''); }} className="text-gray-500 underline">Keep STP</NSEButton>}
  </div>}</div>;
}
