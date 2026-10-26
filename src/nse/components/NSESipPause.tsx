import { NSEButton, NSESummary } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildSipPause, nextNSEInstallment, submitSipPause } from '../services/nseSipPauseService';
export default function NSESipPause({ product, id, client, frequency }: { product: 'SIP' | 'XSIP'; id: string; client: string; frequency: string }) {
  const [next, setNext] = useState(''), [effective, setEffective] = useState(''), [flag, setFlag] = useState<'Y' | 'N'>('Y'), [remarks, setRemarks] = useState('');
  const [busy, setBusy] = useState(false), [consent, setConsent] = useState(false), [attempted, setAttempted] = useState(false);
  const [error, setError] = useState(''), [message, setMessage] = useState('');
  const lock = useRef(false);
  const run = async (submit: boolean) => {
    if (lock.current || (submit && (!consent || attempted))) return;
    lock.current = true; setBusy(true); setError('');
    try {
      if (submit) { buildSipPause(id, effective, next, flag, remarks, frequency); setAttempted(true); setMessage(await submitSipPause(product, id, client, effective, flag, remarks, frequency)); }
      else { setNext(''); setConsent(false); setNext(await nextNSEInstallment(product, id, client)); }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Pause/resume was not confirmed'); }
    finally { lock.current = false; setBusy(false); }
  };
  return <details className="border-t border-gray-100 pt-3"><NSESummary className="cursor-pointer text-sm font-semibold text-[#102B78]">Pause / resume {product}</NSESummary><div className="mt-3 space-y-3 text-xs">
    <p className="text-gray-500">Pause skips only the next two installments. Resume applies to an existing pause. Mutual funds currently reports this service as unavailable; requests may fail.</p>
    <p className="font-semibold">{product} {id} · Client {client}</p>
    {!attempted && <><NSEButton disabled={busy} onClick={() => void run(false)} className="rounded border border-[#4C85CF] px-3 py-2 text-[#102B78]">Check next installment</NSEButton>{next && <><p>Next installment: {next}</p><label className="block">Action<select disabled={busy} value={flag} onChange={event => { setFlag(event.target.value as 'Y' | 'N'); setConsent(false); }} className="mt-1 w-full rounded border p-2"><option value="Y">Pause next two installments</option><option value="N">Resume an existing pause</option></select></label><label className="block">Effective date<input type="date" disabled={busy} value={effective} onChange={event => { setEffective(event.target.value); setConsent(false); }} className="mt-1 w-full rounded border p-2" /></label><label className="block">Remarks (optional)<input maxLength={255} disabled={busy} value={remarks} onChange={event => { setRemarks(event.target.value); setConsent(false); }} className="mt-1 w-full rounded border p-2" /></label><label className="flex items-start gap-2"><input type="checkbox" disabled={busy} checked={consent} onChange={event => setConsent(event.target.checked)} />{flag === 'Y' ? 'I confirm pausing the next two installments from the selected date.' : 'I confirm resuming this registration from its existing pause.'}</label><NSEButton disabled={busy || !consent || !effective} onClick={() => void run(true)} className="rounded bg-[#102B78] px-3 py-2 font-semibold text-white disabled:opacity-50">{busy ? 'Submitting...' : flag === 'Y' ? 'Confirm pause' : 'Confirm resume'}</NSEButton></>}</>}
    {error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check Mutual funds status before retrying.'}</p>}
    {message && <p role="status" className="text-[#102B78]">{message}. Reload Mutual funds reports to check the schedule; this does not confirm payment or allotment.</p>}
  </div></details>;
}
