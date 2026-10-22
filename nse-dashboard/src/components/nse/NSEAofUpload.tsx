import { NSEButton, NSESummary } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { uploadNSEAofImage } from '@/services/nseAofUploadService';
export default function NSEAofUpload() {
  const [client, setClient] = useState(''), [type, setType] = useState<'NRM' | 'RIA'>('NRM'), [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false), [busy, setBusy] = useState(false), [attempted, setAttempted] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const lock = useRef(false);
  const submit = async () => {
    if (lock.current || attempted || !consent || !file) return;
    lock.current = true; setBusy(true); setAttempted(true); setError('');
    try { setMessage(await uploadNSEAofImage(client, type, file)); setFile(null); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'AOF upload was not confirmed'); }
    finally { lock.current = false; setBusy(false); }
  };
  return <details className="rounded-xl border border-blue-200 p-4"><NSESummary className="cursor-pointer text-sm font-bold text-[#102B78]">Upload AOF image</NSESummary><div className="mt-3 space-y-3 text-sm"><p className="text-xs text-gray-500">Upload a signed Account Opening Form as a JPG image, up to 5 MB. Filename: maximum 40 characters.</p><fieldset disabled={busy || attempted} className="grid gap-3 sm:grid-cols-2"><label>Client code<input maxLength={10} value={client} onChange={event => { setClient(event.target.value); setConsent(false); }} className="mt-1 w-full rounded border p-2" /></label><label>Document type<select value={type} onChange={event => { setType(event.target.value as 'NRM' | 'RIA'); setConsent(false); }} className="mt-1 w-full rounded border p-2"><option value="NRM">NRM</option><option value="RIA">RIA</option></select></label><label className="sm:col-span-2">Signed AOF image<input type="file" accept=".jpg,image/jpeg" onChange={event => { setFile(event.target.files?.[0] || null); setConsent(false); }} className="mt-2 block w-full text-xs" /></label></fieldset>
    {file && <div className="rounded-lg bg-blue-50 p-3 text-xs text-[#102B78]">Review upload: Client {client || 'not selected'} / {type}<br />File: {file.name} ({(file.size / 1024).toFixed(1)} KB)</div>}
    {!attempted && <><label className="flex items-start gap-2 text-xs"><input type="checkbox" disabled={busy} checked={consent} onChange={event => setConsent(event.target.checked)} />I confirm this signed AOF belongs to the specified client and want to upload it to Mutual funds.</label><NSEButton disabled={!client.trim() || !file || !consent || busy} onClick={() => void submit()} className="rounded-lg bg-[#102B78] px-4 py-2 font-semibold text-white disabled:opacity-50">Upload AOF to Mutual funds</NSEButton></>}
    {busy && <p role="status">Uploading AOF...</p>}{message && <p role="status" className="text-xs text-[#102B78]">{message} Upload does not confirm CAMS/KFin acceptance. Reload the report below to check processing.</p>}{error && <p role="alert" className="text-xs text-rose-700">{error} Check the AOF report before uploading again.</p>}
  </div></details>;
}
