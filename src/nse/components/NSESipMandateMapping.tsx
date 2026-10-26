import { NSEButton, NSESummary } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { linkSipMandate, loadApprovedSipMandates, type ApprovedSipMandate } from '@/services/nseSipMappingService';
export default function NSESipMandateMapping({ sipId, clientCode }: { sipId: string; clientCode: string }) {
  const [mandates, setMandates] = useState<ApprovedSipMandate[]>([]), [selected, setSelected] = useState('');
  const [loaded, setLoaded] = useState(false), [busy, setBusy] = useState(false), [consent, setConsent] = useState(false);
  const [remark, setRemark] = useState(''), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [attempted, setAttempted] = useState(false);
  const pending = useRef(false);
  const run = async (submit: boolean) => {
    if (pending.current || (submit && attempted)) return;
    pending.current = true; setBusy(true); setError('');
    try {
      if (submit) {
        const mandate = mandates.find(item => item.umrn === selected);
        if (!mandate || !consent) throw new Error('Select a mandate and confirm the mapping');
        setAttempted(true);
        setMessage(await linkSipMandate(sipId, clientCode, mandate, remark));
      } else { setMandates(await loadApprovedSipMandates(clientCode)); setLoaded(true); setSelected(''); setConsent(false); }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to confirm mandate mapping'); }
    finally { pending.current = false; setBusy(false); }
  };
  return <details className="border-t border-gray-100 pt-3"><NSESummary className="cursor-pointer text-sm font-semibold text-[#102B78]">Link bank mandate</NSESummary><div className="mt-3 space-y-3 text-xs">
    <p className="text-gray-500">Link SIP {sipId} to an approved bank mandate for client {clientCode}. The UMRN is taken from Mutual funds’s approved mandate report.</p>
    {!attempted && <NSEButton disabled={busy} onClick={() => void run(false)} className="rounded-lg border border-[#4C85CF] px-3 py-2 font-semibold text-[#102B78]">{busy ? 'Please wait...' : 'Load approved mandates'}</NSEButton>}
    {loaded && !mandates.length && <p>No approved mandates with a UMRN were returned for this client.</p>}
    {!!mandates.length && !attempted && <><label className="block">Approved mandate<select disabled={busy} value={selected} onChange={event => { setSelected(event.target.value); setConsent(false); }} className="mt-1 w-full rounded border p-2"><option value="">Select mandate</option>{mandates.map(item => <option key={`${item.id}-${item.umrn}`} value={item.umrn}>{item.bank || 'Bank'} · Mandate {item.id} · UMRN {item.umrn} · Limit ₹{item.amount}</option>)}</select></label><label className="block">Remark (optional)<input disabled={busy} maxLength={100} value={remark} onChange={event => setRemark(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><label className="flex items-start gap-2"><input type="checkbox" disabled={busy} checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm linking this SIP to the selected approved mandate.</label><NSEButton disabled={busy || !selected || !consent} onClick={() => void run(true)} className="rounded-lg bg-[#102B78] px-3 py-2 font-semibold text-white disabled:opacity-50">Link mandate to SIP</NSEButton></>}
    {error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check the mapping with Mutual funds before retrying.'}</p>}
    {message && <p role="status" className="text-[#102B78]">{message}. This does not confirm installment payment or allotment.</p>}
  </div></details>;
}
