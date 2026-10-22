import { NSEButton, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { buildNftImage, uploadNftImage } from '@/services/nseNftImageService';
export default function NSENftImageUpload({ onBusy, onAttempt }: { onBusy: (busy: boolean) => void; onAttempt: () => void }) {
  const [reference, setReference] = useState(''), [file, setFile] = useState<File | null>(null), [review, setReview] = useState(false), [consent, setConsent] = useState(false), [attempted, setAttempted] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const lock = useRef(false);
  const run = async (submit: boolean) => {
    if (!file || lock.current || attempted || (submit && (!review || !consent))) return;
    lock.current = true; setBusy(true); onBusy(true); setError('');
    try {
      if (submit) { setAttempted(true); onAttempt(); setMessage(await uploadNftImage(reference, file)); setFile(null); }
      else { await buildNftImage(reference, file); setReview(true); }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'NFT image upload is unconfirmed'); }
    finally { lock.current = false; setBusy(false); onBusy(false); }
  };
  return <section className="space-y-3 text-sm"><NSEHeading as="h3" className="font-semibold">Upload NFT document</NSEHeading><p>Use the exact IMG_REF_NO filename from the submitted wet-signature folio update. Upload success does not confirm AMC approval.</p><p className="text-xs text-gray-500">TIFF is supported based on the supplied filename example. Other allowed formats and Mutual funds size limits are unspecified. Portal limit: 5 MB; reference filename up to 100 characters.</p>
    {!review && !attempted && <fieldset disabled={busy} className="space-y-3"><label className="block">NFT image reference filename<input maxLength={100} value={reference} onChange={event => setReference(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><label className="block">NFT document<input type="file" accept=".tif,.tiff" onChange={event => setFile(event.target.files?.[0] || null)} className="mt-1 block w-full" /></label><NSEButton disabled={!file} onClick={() => void run(false)} className="rounded bg-[#102B78] p-3 text-white disabled:opacity-50">Review NFT document</NSEButton></fieldset>}
    {review && !attempted && <div className="space-y-3"><p>Reference: {reference}<br />Document: {file?.name}<br />Size: {((file?.size || 0) / 1024).toFixed(1)} KB</p><label className="flex gap-2"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm this document matches the investor and the submitted NFT image reference.</label><NSEButton disabled={!consent || busy} onClick={() => void run(true)} className="rounded bg-[#102B78] p-3 text-white disabled:opacity-50">Confirm NFT document upload</NSEButton><NSEButton disabled={busy} onClick={() => { setReview(false); setConsent(false); }} className="ml-3 underline">Edit NFT document</NSEButton></div>}
    {busy && <p role="status">{attempted ? 'Uploading NFT document...' : 'Checking NFT document...'}</p>}{message && <p role="status">{message}. Check the folio request with Mutual funds for approval.</p>}{error && <p role="alert" className="text-rose-700">{error}{attempted && ' Check with Mutual funds before uploading again.'}</p>}
  </section>;
}
