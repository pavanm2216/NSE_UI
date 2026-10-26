import { NSEButton } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { resendNSECommunication, type NSEResendProduct } from '../services/nseCommunicationService';

export default function NSEResendCommunication({ productType, productRefId }: { productType: NSEResendProduct; productRefId: string }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const submit = async () => {
    if (pending.current || sent) return;
    pending.current = true; setBusy(true); setError('');
    try { await resendNSECommunication(productType, productRefId); setSent(true); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Resend was not confirmed'); }
    finally { pending.current = false; setBusy(false); }
  };
  return <div className="w-full min-w-0 space-y-3 border-t border-slate-200 pt-4">
    <p className="text-sm leading-6 text-gray-500">Resend the authorization email and SMS to the investor’s registered contact details.</p>
    <NSEButton disabled={busy || sent} onClick={() => void submit()} className="max-w-full whitespace-normal rounded-lg border border-[#4C85CF] px-4 py-3 text-left text-sm font-semibold leading-5 text-[#102B78] disabled:opacity-50">{busy ? 'Sending...' : sent ? 'Communication resent' : 'Resend authorization email / SMS'}</NSEButton>
    {sent && <p role="status" className="text-xs text-[#102B78]">Mutual funds confirmed the resend request. This does not confirm delivery or investor authorization.</p>}
    {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
  </div>;
}
