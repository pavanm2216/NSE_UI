import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUCCList } from '@/services/starmf/uccService';
import { listMandates } from '@/services/starmf/mandateService';
import { registerSxp } from '@/services/starmf/sxpService';
import { getMasterSchemeList } from '@/services/starmf/schemeService';
import type { SxpRegister } from '@/types/starmf/sxp.types';
import { toast } from '@/hooks/use-toast';
import {
  Loader2, CheckCircle2, AlertTriangle, ChevronRight,
  CalendarDays, RefreshCw, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIP_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const SIP_DATES   = [1, 5, 10, 15, 20, 25, 28];
const FREQ_OPTIONS = [
  { label: 'Monthly',   value: 'm' },
  { label: 'Quarterly', value: 'q' },
];

function nextSIPDate(txnDate: number): string {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), txnDate);
  if (d <= now) d = new Date(now.getFullYear(), now.getMonth() + 1, txnDate);
  return d.toISOString().split('T')[0];
}

function endDateFromInstallments(startDate: string, freq: string, n: number): string {
  const d = new Date(startDate);
  if (freq === 'm') d.setMonth(d.getMonth() + n - 1);
  else              d.setMonth(d.getMonth() + (n - 1) * 3);
  return d.toISOString().split('T')[0];
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const Steps: React.FC<{ current: number }> = ({ current }) => {
  const steps = ['Fund & Amount', 'SIP Details', 'Review & Confirm'];
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < current  ? 'bg-emerald-500 text-white'
              : i === current ? 'bg-[#0D3B66] text-white'
              : 'bg-gray-100 text-gray-400'
            }`}>
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-[#0D3B66]' : 'text-gray-400'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 min-w-[24px] ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const MFSIPRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-filled from query params (coming from MFInvestPage "Invest Now")
  const preScheme = searchParams.get('scheme') ?? '';
  const preName   = searchParams.get('name')   ?? '';

  const [step, setStep] = useState(0);

  // Investor context
  const [ucc,    setUcc]    = useState('');
  const [email,  setEmail]  = useState('');
  const [mobnum, setMobnum] = useState('');
  const [mandateId, setMandateId] = useState<number | null>(null);
  const [mandates,  setMandates]  = useState<any[]>([]);
  const [loadingCtx, setLoadingCtx] = useState(true);

  // Form state
  const [schemeName, setSchemeName] = useState(preName);
  const [schemeCode, setSchemeCode] = useState(preScheme);
  const [amount,     setAmount]     = useState(2000);
  const [freq,       setFreq]       = useState<'m' | 'q'>('m');
  const [txnDate,    setTxnDate]    = useState(1);
  const [nInstall,   setNInstall]   = useState(12);
  const [folio,      setFolio]      = useState('');
  const [isFresh,    setIsFresh]    = useState(true);

  // Scheme search (step 0)
  const [schemeQuery,   setSchemeQuery]   = useState(preName);
  const [schemeResults, setSchemeResults] = useState<any[]>([]);
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeOpen,    setSchemeOpen]    = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [regNo,      setRegNo]      = useState('');

  // ── Load investor + mandates ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getUCCList({ start: 0, length: 1 });
        const inv = res?.data?.lists?.[0];
        if (inv) {
          const code   = inv.investor?.client_code ?? '';
          const holder = inv.holder?.[0];
          setUcc(code);
          setEmail(holder?.contact?.[0]?.email_address ?? '');
          setMobnum(holder?.contact?.[0]?.contact_number ?? '');

          // fetch mandates
          try {
            const mRes = await listMandates(code, true, true, 0, 20);
            const list: any[] = mRes?.data?.lists ?? [];
            setMandates(list);
            if (list.length > 0) setMandateId(list[0].exch_mandate_id ?? list[0].id ?? null);
          } catch { /* mandates optional */ }
        }
      } catch { /* ignore */ }
      finally { setLoadingCtx(false); }
    })();
  }, []);

  // ── Scheme search ─────────────────────────────────────────────────────────
  const searchSchemes = async (q: string) => {
    if (q.length < 2) { setSchemeResults([]); setSchemeOpen(false); return; }
    setSchemeLoading(true);
    try {
      const res = await getMasterSchemeList({ search: { value: q }, length: 15 });
      const list = res?.data?.lists ?? [];
      setSchemeResults(list);
      setSchemeOpen(list.length > 0);
    } catch { setSchemeResults([]); }
    finally { setSchemeLoading(false); }
  };

  let schemeDebounce: ReturnType<typeof setTimeout>;
  const handleSchemeInput = (v: string) => {
    setSchemeQuery(v);
    clearTimeout(schemeDebounce);
    schemeDebounce = setTimeout(() => searchSchemes(v), 400);
  };

  const selectScheme = (s: any) => {
    const code = s.parent_scheme_code ?? s.scheme_isin ?? '';
    setSchemeCode(code);
    setSchemeName(s.name ?? code);
    setSchemeQuery(s.name ?? code);
    setSchemeOpen(false);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const startDate = nextSIPDate(txnDate);
  const endDate   = endDateFromInstallments(startDate, freq, nInstall);
  const totalEst  = amount * nInstall;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!ucc)        return toast({ title: 'No investor UCC found', variant: 'destructive' });
    if (!schemeCode) return toast({ title: 'Please select a scheme', variant: 'destructive' });
    if (amount < 100) return toast({ title: 'Minimum SIP amount is ₹100', variant: 'destructive' });
    if (!mandateId)  return toast({ title: 'No active mandate found. Please register a mandate first.', variant: 'destructive' });

    setSubmitting(true);
    try {
      const payload: SxpRegister = {
        sxp_type: 'sip',
        mem_sxp_ref_id: `SIP${Date.now()}`,
        investor: { ucc },
        member: import.meta.env.VITE_STARMF_ARN || '',
        src_scheme: schemeCode,
        exch_mandate_id: mandateId,
        amount,
        cur: 'INR',
        is_fresh: isFresh,
        src_folio: folio || '',
        phys_or_demat: 'D',
        isunits: false,
        min_redeem_flag: false,
        dpc: true,
        start_date: startDate,
        end_date: endDate,
        freq,
        txn_date: txnDate,
        kyc_passed: true,
        first_order_today: false,
        ninstallments: nInstall,
        mem_details: { euin: '', euin_flag: null, sub_br_code: '', sub_br_arn: '', partner_id: '' },
        holder: [{ holder_rank: '1', email, mobnum }],
        email,
        mobnum,
      };

      const res = await registerSxp(payload);
      const rn = res?.data?.lists?.[0]?.reg_no ?? res?.data?.reg_no ?? res?.reg_no ?? '';
      setRegNo(rn);
      toast({ title: 'SIP registered successfully!' });
      setStep(3); // success screen
    } catch (err: any) {
      toast({ title: err?.message ?? 'SIP registration failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SIP Registered!</h2>
          <p className="text-gray-500 mt-1">Your SIP has been successfully registered via BSE StAR MF.</p>
        </div>
        <div className="rounded-xl border divide-y text-sm text-left">
          {[
            ['Fund', schemeName],
            ['SIP Amount', `₹${amount.toLocaleString('en-IN')} / ${freq === 'm' ? 'month' : 'quarter'}`],
            ['Start Date', startDate],
            ['Installments', `${nInstall} (est. ₹${totalEst.toLocaleString('en-IN')})`],
            ...(regNo ? [['Registration No.', regNo]] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/dashboard/mf/invest')}>Invest More</Button>
          <Button onClick={() => navigate('/dashboard/mf/sips')}>View My SIPs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Register SIP</h1>
        <p className="text-sm text-gray-500 mt-0.5">Set up a Systematic Investment Plan via BSE StAR MF</p>
      </div>

      {/* Steps */}
      <Steps current={step} />

      {/* Loading investor */}
      {loadingCtx && (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading investor details...
        </div>
      )}

      {/* Mandate warning */}
      {!loadingCtx && mandates.length === 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">No active mandate found</p>
            <p className="text-amber-700 mt-0.5">A mandate (NACH/UPI auto-debit) is required for SIP. You can still fill the form, but registration will fail without one.</p>
          </div>
        </div>
      )}

      {/* ── STEP 0: Fund & Amount ── */}
      {step === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Select Fund & Amount</h2>

          {/* Scheme search */}
          <div className="space-y-1 relative">
            <Label>Fund *</Label>
            <Input
              value={schemeQuery}
              onChange={e => handleSchemeInput(e.target.value)}
              placeholder="Search fund name or ISIN..."
              autoComplete="off"
            />
            {schemeLoading && <Loader2 className="absolute right-3 top-9 w-4 h-4 animate-spin text-gray-400" />}
            {schemeOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {schemeResults.map((s, i) => (
                  <button key={i} type="button"
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0"
                    onClick={() => selectScheme(s)}>
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 font-mono">{s.parent_scheme_code}</span>
                      {s.scheme_plan && <Badge variant="outline" className="text-[10px] h-4 px-1">{s.scheme_plan}</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {schemeCode && (
              <p className="text-xs text-gray-400 font-mono">Code: {schemeCode}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>SIP Amount (₹) *</Label>
            <div className="flex flex-wrap gap-2">
              {SIP_AMOUNTS.map(a => (
                <button key={a} type="button"
                  onClick={() => setAmount(a)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                    amount === a ? 'bg-[#0D3B66] text-white border-[#0D3B66]' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}>
                  ₹{a.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <Input
              type="number" min={100} step={100}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              placeholder="Or enter custom amount"
            />
          </div>

          {/* Folio */}
          <div className="space-y-1">
            <Label>Folio <span className="text-gray-400 font-normal text-xs">(leave blank for new folio)</span></Label>
            <Input value={folio} onChange={e => setFolio(e.target.value)} placeholder="Existing folio number" />
          </div>

          <div className="flex justify-end">
            <Button
              disabled={!schemeCode || amount < 100}
              onClick={() => setStep(1)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 1: SIP Details ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">SIP Schedule</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Frequency */}
            <div className="space-y-1">
              <Label>Frequency</Label>
              <Select value={freq} onValueChange={v => setFreq(v as 'm' | 'q')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FREQ_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* SIP Date */}
            <div className="space-y-1">
              <Label>SIP Date</Label>
              <Select value={String(txnDate)} onValueChange={v => setTxnDate(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SIP_DATES.map(d => <SelectItem key={d} value={String(d)}>{d}{d === 1 ? 'st' : d === 5 ? 'th' : d === 10 ? 'th' : d === 15 ? 'th' : d === 20 ? 'th' : d === 25 ? 'th' : 'th'} of month</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Installments */}
            <div className="space-y-1">
              <Label>No. of Installments</Label>
              <Input type="number" min={1} max={999} value={nInstall}
                onChange={e => setNInstall(Math.max(1, Number(e.target.value)))} />
            </div>

            {/* Mandate */}
            <div className="space-y-1">
              <Label>Mandate (Auto-debit)</Label>
              {mandates.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> No mandate found
                </div>
              ) : (
                <Select
                  value={String(mandateId ?? '')}
                  onValueChange={v => setMandateId(Number(v))}
                >
                  <SelectTrigger><SelectValue placeholder="Select mandate" /></SelectTrigger>
                  <SelectContent>
                    {mandates.map((m, i) => (
                      <SelectItem key={i} value={String(m.exch_mandate_id ?? m.id)}>
                        {m.bank_name ?? 'Bank'} — ₹{Number(m.amount ?? 0).toLocaleString('en-IN')} (ID: {m.exch_mandate_id ?? m.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Derived dates info */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
            <CalendarDays className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-blue-800">
              First instalment: <strong>{startDate}</strong> · Last: <strong>{endDate}</strong>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)}>
              Review <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Review & Confirm ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Order Summary</h2>

          <div className="rounded-xl border divide-y text-sm">
            {[
              ['Fund',          schemeName || schemeCode],
              ['Type',          `SIP · ${freq === 'm' ? 'Monthly' : 'Quarterly'}`],
              ['Amount',        `₹${amount.toLocaleString('en-IN')}`],
              ['SIP Date',      `${txnDate}${txnDate === 1 ? 'st' : 'th'} of month`],
              ['Installments',  String(nInstall)],
              ['Start Date',    startDate],
              ['End Date',      endDate],
              ['Total (est.)',  `₹${totalEst.toLocaleString('en-IN')}`],
              ['Mandate ID',    mandateId ? String(mandateId) : '—'],
              ['Platform',      'BSE StAR MF'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{v}</span>
              </div>
            ))}
          </div>

          {/* Investor info */}
          {ucc && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Investor UCC: <strong>{ucc}</strong>
              {email && <span className="ml-2 text-blue-500">{email}</span>}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !mandateId}
              className="min-w-44 bg-[#0D3B66] hover:bg-[#092d4e]"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Registering...</>
                : <><RefreshCw className="w-4 h-4 mr-2" />Register SIP via BSE</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFSIPRegisterPage;
