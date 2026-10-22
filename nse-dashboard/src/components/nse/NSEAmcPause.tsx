import { NSEButton, NSESummary } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildNSEAmcPause, submitNSEAmcPause } from '@/services/nseAmcPauseService';
export default function NSEAmcPause({ id, client }: { id: string; client: string }) {
  const [input, setInput] = useState({ client_code: client, sip_reg_no: id, modification_type: 'PAUSE', no_of_installments: '', pause_from: '' });
  const [review, setReview] = useState(false), [consent, setConsent] = useState(false), [attempted, setAttempted] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const lock = useRef(false);
  const submit = async () => {
    if (!review || !consent || attempted || lock.current) return;
    lock.current = true; setAttempted(true); setBusy(true); setError('');
    try { const result = await submitNSEAmcPause(input); setMessage(`${result.message}. Request ID: ${result.requestId}. Check AMC pause history for activation and schedule.`); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'AMC pause is unconfirmed'); }
    finally { lock.current = false; setBusy(false); }
  };
  return <details className="border-t pt-3"><NSESummary className="cursor-pointer text-sm font-semibold text-[#102B78]">AMC pause / unpause</NSESummary><div className="mt-3 space-y-3 text-xs"><p>Request an AMC pause for a chosen installment count, or unpause an existing request. Mutual funds currently reports this service as unavailable. Receipt does not confirm activation.</p><p>SIP {id} | Client {client}</p>
    {!review && <><label className="block">AMC pause action<select value={input.modification_type} onChange={event => setInput({ ...input, modification_type: event.target.value })} className="mt-1 w-full rounded border p-2"><option>PAUSE</option><option>UNPAUSE</option></select></label><label className="block">Installment count<input inputMode="numeric" maxLength={5} value={input.no_of_installments} onChange={event => setInput({ ...input, no_of_installments: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><label className="block">Pause from date (optional)<input type="date" value={input.pause_from} onChange={event => setInput({ ...input, pause_from: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><NSEButton className="rounded bg-[#102B78] p-2 text-white" onClick={() => { try { buildNSEAmcPause(input); setReview(true); setError(''); } catch (failure) { setError((failure as Error).message); } }}>Review AMC pause</NSEButton></>}
    {review && !attempted && <><p>Action: {input.modification_type}<br />Installments: {input.no_of_installments}<br />From: {input.pause_from || 'Mutual funds default'}</p><label className="flex gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm sending this AMC pause or unpause request.</label><NSEButton disabled={!consent} onClick={() => void submit()} className="rounded bg-[#102B78] p-2 text-white disabled:opacity-50">Confirm AMC pause request</NSEButton><NSEButton onClick={() => { setReview(false); setConsent(false); }} className="ml-3 underline">Edit AMC pause</NSEButton></>}
    {busy && <p role="status">Submitting AMC pause...</p>}{message && <p role="status">{message}</p>}{error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check the AMC pause report before retrying.'}</p>}
  </div></details>;
}
