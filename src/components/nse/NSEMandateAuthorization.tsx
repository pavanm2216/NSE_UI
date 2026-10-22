import { NSEButton } from '@/components/nse/NSEPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { getNSEHolderLinks } from '@/services/nseCommunicationService';
import NSEResendCommunication from './NSEResendCommunication';

export default function NSEMandateAuthorization({ mandateId }: { mandateId: string }) {
  const [links, setLinks] = useState<Awaited<ReturnType<typeof getNSEHolderLinks>>>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const version = useRef(0);
  const pending = useRef(false);
  useEffect(() => { version.current++; setLinks([]); setError(''); setBusy(false); pending.current = false; return () => { version.current++; }; }, [mandateId]);
  const load = async () => {
    if (pending.current) return;
    pending.current = true;
    const request = ++version.current;
    setBusy(true); setError(''); setLinks([]);
    try {
      const result = await getNSEHolderLinks('MANDATE_AUTH', mandateId);
      if (request === version.current) setLinks(result);
    } catch (failure) {
      if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to fetch mandate authorization links');
    } finally { if (request === version.current) { setBusy(false); pending.current = false; } }
  };
  return <div className="space-y-3 border-t border-gray-100 pt-4">

    <NSEButton disabled={busy} onClick={() => void load()} className="w-full rounded-lg bg-[#102B78] px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Fetching link...' : 'Get authorization link'}</NSEButton>
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}
    {links.map(link => <a key={link.holder} href={link.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-[#4C85CF] px-3 py-2 text-center text-sm font-semibold text-[#102B78]">{link.holder}: authorize mandate ↗</a>)}
    <details className="rounded-lg border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-medium text-[#102B78]">Need the link by email or SMS?</summary><NSEResendCommunication key={mandateId} productType="MANDATE_AUTH" productRefId={mandateId} /></details>
    {!!links.length && <p className="text-xs leading-relaxed text-gray-500">Complete authorization on Mutual funds’s page, then reload the mandate status report to check approval. Opening this link does not confirm approval.</p>}
  </div>;
}
