import { NSEButton } from '../components/NSEPresentation';
import React, { useRef, useState } from 'react';
import { uploadNSEMandateImage } from '../services/nseMandateImageService';

export default function NSEMandateImageUpload({ clientCode, mandateId }: { clientCode: string; mandateId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const pending = useRef(false);
  const submit = async () => {
    if (!file || pending.current || complete) return;
    pending.current = true; setBusy(true); setError(''); setMessage('');
    try { setMessage(await uploadNSEMandateImage(clientCode, mandateId, file)); setComplete(true); setFile(null); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Image upload was not confirmed'); }
    finally { pending.current = false; setBusy(false); }
  };
  return <div className="space-y-3 border-t border-gray-100 pt-4">
    <p className="text-sm font-semibold text-[#102B78]">Upload signed mandate</p>
    <p className="text-xs text-gray-500">JPG image, up to 5 MB. Filename: maximum 30 characters.</p>
    {!complete && <><label className="block text-xs font-medium text-gray-600">Signed mandate image<input type="file" accept=".jpg,image/jpeg" disabled={busy} onChange={event => { setFile(event.target.files?.[0] || null); setError(''); }} className="mt-2 block w-full text-xs" /></label><NSEButton disabled={!file || busy} onClick={() => void submit()} className="w-full rounded-lg bg-[#102B78] px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Uploading image...' : 'Upload mandate image'}</NSEButton></>}
    {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error} If the result is uncertain, check with Mutual funds before uploading again.</p>}
    {message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-xs text-[#102B78]">{message} Image upload does not confirm bank approval. Reload the mandate status report to check approval.</p>}
  </div>;
}
