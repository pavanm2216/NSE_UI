import { Landmark, PlusCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import NSEFlowSteps from './NSEFlowSteps';
import { NSEButton, NSEDialogTitle, NSEHeading } from '@/components/nse/NSEPresentation';
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NSEInvestorSelector from './NSEInvestorSelector';
import NSEExistingMandates from './NSEExistingMandates';
import NSEMandateCard from './NSEMandateCard';
import { buildNSEMandate, registerNSEMandate, NSE_ACCOUNT_TYPES, type NSEMandateInput, type NSEMandateRecord } from '@/services/nseMandateService';
import type { NSEInvestorSelection } from '@/services/nseInvestorService';
import { NSEApiError } from '@/services/nseApi';
const primary = 'w-full rounded-lg bg-[#102B78] px-4 py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500';
const input = 'mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal';
export function MandateForm({ onClose, onRecord, initialSelection, embedded = false, onBusyChange }: { embedded?: boolean; onBusyChange?: (busy: boolean) => void; onClose: () => void; onRecord: (record: NSEMandateRecord) => void; initialSelection?: NSEInvestorSelection }) {
  const [step, setStep] = useState(0); const [selection, setSelection] = useState<NSEInvestorSelection | null>(initialSelection || null);
  const [amount, setAmount] = useState(''); const [type, setType] = useState<'X' | 'E'>('E');
  const [accountType, setAccountType] = useState(initialSelection?.bank.accountType || ''); const [micr, setMicr] = useState(initialSelection?.bank.micr || '');
  const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [memberProcessed, setMemberProcessed] = useState(false); const [registrationDate, setRegistrationDate] = useState('');
  const [consent, setConsent] = useState(false); const [error, setError] = useState('');
  const [busy, setBusy] = useState(false); const [attempted, setAttempted] = useState(false);
  const [result, setResult] = useState<NSEMandateRecord | null>(null);
  const [reference] = useState(() => `M${crypto.randomUUID().replace(/-/g, '').slice(0, 19)}`); const lock = useRef(false);
  const payload = (): NSEMandateInput => ({ investor: selection!, amount: Number(amount), type, accountType, micr, startDate: start, endDate: end, processedByMember: memberProcessed, registrationDate, reference });
  const submit = async () => {
    if (!selection || !consent || lock.current || attempted) return;
    try { buildNSEMandate(payload()); } catch (failure) { setError((failure as Error).message); return; }
    lock.current = true; setBusy(true); onBusyChange?.(true); setAttempted(true); setError('');
    try { const record = await registerNSEMandate(payload()); setResult(record); onRecord(record); setStep(2); }
    catch (failure) {
      const rejected = failure instanceof NSEApiError && [400, 401, 403, 404, 409, 422].includes(failure.status);
      const record: NSEMandateRecord = { reference, clientCode: selection.clientCode, investor: selection.name, bank: selection.bank.label, amount: Number(amount), type, startDate: start, endDate: end, status: rejected ? 'rejected' : 'unknown', rawStatus: rejected ? `Request rejected (${failure.status})` : 'Confirmation unknown', remark: failure instanceof Error ? failure.message : 'Check mandate status before retrying' };
      setResult(record); onRecord(record); setStep(2);
    } finally { lock.current = false; setBusy(false); onBusyChange?.(false); }
  };
  const content = <>
    {embedded ? <header><h2 className="text-lg font-semibold text-[#102B78]">{['Register a bank mandate', 'Review your mandate', 'Registration result'][step]}</h2></header> : <DialogHeader><NSEDialogTitle>{['Register bank mandate', 'Review mandate', 'Mandate registration status'][step]}</NSEDialogTitle><DialogDescription>Authorize a maximum debit amount for an Mutual funds investor’s registered bank.</DialogDescription></DialogHeader>}

    {!embedded && <NSEFlowSteps steps={['Bank and debit limit', 'Review and confirm', 'Registration result']} current={step} />}
    {step === 0 && <form className="space-y-4" onSubmit={event => { event.preventDefault(); if (!selection) return; try { buildNSEMandate(payload()); setError(''); setStep(1); } catch (failure) { setError((failure as Error).message); } }}>
      {initialSelection ? <div className="space-y-2 rounded-xl bg-blue-50 p-4 text-sm"><p className="font-semibold">{initialSelection.name} &middot; {initialSelection.clientCode}</p><p>{initialSelection.bank.label}</p><p className="text-xs text-slate-600">Registering for the investor and bank selected in your SIP.</p></div> : <NSEInvestorSelector requireKyc={false} onChange={value => { setSelection(value); setConsent(false); setAccountType(value?.bank.accountType || ''); setMicr(value?.bank.micr || ''); }} />}
      <label className="block text-sm font-semibold">Mandate type<select className={input} value={type} onChange={event => setType(event.target.value as 'X' | 'E')}><option value="E">eNACH (E)</option><option value="X">Physical / Scan (X)</option></select></label>
      <label className="block text-sm font-semibold">Maximum debit amount (₹)<input required type="number" min="0.01" max="9999999999999.99" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} className={input} /></label>
      <label className="block text-sm font-semibold">Account type<select required disabled={!!selection?.bank.accountType} className={input} value={accountType} onChange={event => setAccountType(event.target.value)}><option value="">Select account type</option>{NSE_ACCOUNT_TYPES.map(value => <option key={value}>{value}</option>)}</select></label>

      <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Start date<input required type="date" className={input} value={start} onChange={event => setStart(event.target.value)} /></label><label className="block text-sm font-semibold">End date<input required type="date" className={input} value={end} onChange={event => setEnd(event.target.value)} /></label></div>
      <details className="rounded-xl border border-slate-200 p-4"><summary className="cursor-pointer text-sm font-medium text-[#102B78]">Advanced details</summary><div className="mt-4 space-y-4"><label className="block text-sm font-semibold">MICR<input inputMode="numeric" maxLength={9} className={input} value={micr} onChange={event => setMicr(event.target.value)} /></label>      <label className="flex gap-3 text-sm"><input type="checkbox" checked={memberProcessed} onChange={event => setMemberProcessed(event.target.checked)} />This mandate was processed by the member</label>
      {memberProcessed && <label className="block text-sm font-semibold">Registration date<input required type="date" className={input} value={registrationDate} onChange={event => setRegistrationDate(event.target.value)} /></label>}</div></details>
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <NSEButton type="submit" disabled={!selection} className={primary}>Review mandate</NSEButton>
    </form>}
    {step === 1 && <div className="space-y-4"><dl className="space-y-3 text-sm">{[['Investor', `${selection?.name} · ${selection?.clientCode}`], ['Bank', selection?.bank.label || ''], ['IFSC', selection?.bank.ifsc || ''], ['Account type', accountType], ['Mandate', type === 'E' ? 'eNACH (E)' : 'Physical / Scan (X)'], ['Debit limit', Number(amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })], ['Validity', `${start} → ${end}`], ...(memberProcessed ? [['Registration date', registrationDate]] : []), ['Member reference', reference]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-gray-500">{label}</dt><dd className="break-all text-right font-semibold">{value}</dd></div>)}</dl>
      <label className="flex gap-3 text-sm"><input type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} />I confirm the investor, registered bank, debit limit and live mandate registration.</label>
      <NSEButton disabled={!consent || busy || attempted} className={primary} onClick={submit}>{busy ? 'Registering mandate…' : 'Register mandate'}</NSEButton><NSEButton disabled={busy || attempted} className="w-full py-2 text-sm text-[#102B78]" onClick={() => { setConsent(false); setSelection(initialSelection || null); setStep(0); }}>Edit mandate</NSEButton>
    </div>}
    {step === 2 && result && <div className="space-y-4"><div role="status" className="rounded-xl border border-gray-200 p-4"><NSEHeading as="h3" className="font-bold">{result.status === 'registered' ? 'Mandate registered — approval pending' : result.status === 'rejected' ? 'Mandate registration rejected' : 'Mandate confirmation unknown'}</NSEHeading><p className="mt-2 text-sm">{result.remark}</p><p className="mt-2 text-xs">{result.registrationId ? `Mutual funds registration ID: ${result.registrationId}` : 'No confirmed Mutual funds registration ID returned.'}</p></div>{initialSelection && result.registrationId && <NSEMandateCard row={{ reg_id: result.registrationId, client_code: result.clientCode, client_name: result.investor, bank_name: result.bank, mandate_type: result.type, amount: result.amount, start_date: result.startDate, end_date: result.endDate, reg_status: result.rawStatus, reg_remark: result.remark }} />}{type === 'X' && <p className="text-xs text-gray-500">Physical mandates need the scan/image upload step before processing.</p>}<p className="text-xs text-gray-500">Do not use this ID as an approved debit mandate until the mandate status report confirms approval.</p><NSEButton className={primary} onClick={onClose}>{initialSelection ? "Back to SIP mandates" : "View mandates"}</NSEButton></div>}
  </>;
  if (embedded) return <div className="space-y-5">{content}</div>;
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}><DialogContent className="max-h-[90vh] overflow-y-auto" onEscapeKeyDown={event => { if (busy) event.preventDefault(); }} onPointerDownOutside={event => { if (busy) event.preventDefault(); }}>{content}</DialogContent></Dialog>;
}
export default function NSEMandates({ records, onRecord }: { records: NSEMandateRecord[]; onRecord: (record: NSEMandateRecord) => void }) {
  const [tab, setTab] = useState('existing');
  const [busy, setBusy] = useState(false);
  return <Tabs value={tab} onValueChange={value => { if (!busy) setTab(value); }} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.15)]">
    <TabsList aria-label="Bank auto-debit sections" className="mx-4 mt-4 grid h-auto w-[calc(100%-2rem)] grid-cols-2 gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/80 p-1.5 sm:mx-6 sm:mt-6 sm:w-[calc(100%-3rem)] sm:max-w-md">
      <TabsTrigger value="register" disabled={busy} className="gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-[#102B78] data-[state=active]:shadow-sm"><PlusCircle aria-hidden="true" className="h-4 w-4 shrink-0" />Register mandate</TabsTrigger>
      <TabsTrigger value="existing" disabled={busy} className="gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-[#102B78] data-[state=active]:shadow-sm"><Landmark aria-hidden="true" className="h-4 w-4 shrink-0" />My mandates</TabsTrigger>
    </TabsList>
    <TabsContent value="existing" className="m-0 space-y-6 p-4 sm:p-6">
      <NSEExistingMandates />
      {!!records.length && <section className="space-y-3"><h3 className="text-sm font-semibold text-slate-700">Requests made during this visit</h3><div className="grid items-start gap-4 xl:grid-cols-2">{records.map(record => <NSEMandateCard key={record.reference} row={{ reg_id: record.registrationId, client_name: record.investor, client_code: record.clientCode, bank_name: record.bank, mandate_type: record.type, amount: record.amount, start_date: record.startDate, end_date: record.endDate, reg_status: record.rawStatus, reg_remark: record.remark, member_reference: record.reference }} />)}</div></section>}
    </TabsContent>
    <TabsContent value="register" className="m-0 p-4 sm:p-6"><MandateForm embedded onBusyChange={setBusy} onClose={() => setTab('existing')} onRecord={onRecord} /></TabsContent>
  </Tabs>;
}
