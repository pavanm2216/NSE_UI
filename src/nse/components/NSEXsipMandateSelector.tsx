import { NSEButton } from '../components/NSEPresentation';
import React, { useEffect, useRef, useState } from 'react';
import { loadXSIPMandates, type XSIPApprovedMandate } from '../services/nseXsipService';
export default function NSEXsipMandateSelector({ clientCode, onChange }: { clientCode: string; onChange: (value: XSIPApprovedMandate | null) => void }) {
  const [rows, setRows] = useState<XSIPApprovedMandate[]>([]), [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const version = useRef(0);
  const load = async () => {
    const request = ++version.current; setBusy(true); setError(''); setRows([]); setSelected(''); onChange(null);
    try { const result = await loadXSIPMandates(clientCode); if (request === version.current) setRows(result); }
    catch (failure) { if (request === version.current) setError(failure instanceof Error ? failure.message : 'Unable to load mandates'); }
    finally { if (request === version.current) setBusy(false); }
  };
  useEffect(() => { void load(); return () => { version.current++; }; }, [clientCode]);
  return <div className="space-y-2"><label className="block text-sm font-semibold">Approved XSIP mandate<select disabled={busy} value={selected} onChange={event => { setSelected(event.target.value); onChange(rows.find(row => row.id === event.target.value) || null); }} className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"><option value="">{busy ? 'Loading approved mandates...' : 'Select approved mandate'}</option>{rows.map(row => <option key={row.id} value={row.id}>{row.bank} · {row.id} · Maximum ₹{row.amount.toLocaleString('en-IN')}</option>)}</select></label>{error && <p role="alert" className="text-xs text-rose-700">{error}</p>}{!busy && !error && !rows.length && <p className="text-xs text-gray-500">No approved mandates with a reported debit limit found for this investor.</p>}<NSEButton disabled={busy} onClick={() => void load()} className="text-xs font-semibold text-[#102B78]">Refresh approved mandates</NSEButton></div>;
}
