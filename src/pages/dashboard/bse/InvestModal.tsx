import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { listMandates } from '@/services/starmf/mandateService';
import { registerSxp } from '@/services/starmf/sxpService';
import { placeOrder } from '@/services/starmf/orderService';
import { getExchPgService } from '@/services/starmf/pgService';
import { resolveBSEOrderCode } from '@/utils/schemeCodeResolver';
import { Scheme, OrderStatus, SIP_DATES, SIP_FREQS } from './types';

const InvestModal: React.FC<{
  scheme: Scheme;
  initialMode: 'lumpsum' | 'sip';
  clientCode: string;
  memberId: string;
  email: string;
  mobnum: string;
  isDemat: boolean;
  depository?: { depository_code: string; dp_id: string; client_id: string };
  onClose: () => void;
  onViewSIPs?: () => void;
}> = ({ scheme, initialMode, clientCode, memberId, email, mobnum, isDemat, depository, onClose, onViewSIPs }) => {
  const [mode, setMode]       = useState<'lumpsum' | 'sip'>(initialMode);
  const [amount, setAmount]   = useState('');
  const [sipDate, setSipDate] = useState(1);
  const [sipFreq, setSipFreq] = useState<'m' | 'q'>('m');
  const [installments, setInstallments] = useState('12');
  const [status, setStatus]   = useState<OrderStatus>('idle');
  const [errMsg, setErrMsg]   = useState('');
  const [payUrl, setPayUrl]   = useState<string | null>(null);
  const [sipRegNo, setSipRegNo] = useState('');

  const [mandates, setMandates]             = useState<any[]>([]);
  const [mandatesLoaded, setMandatesLoaded] = useState(false);
  const [selectedMandateId, setSelectedMandateId] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== 'sip' || mandatesLoaded) return;
    listMandates(clientCode, true, true, 0, 20)
      .then(res => {
        const list: any[] = res?.data?.lists ?? [];
        setMandates(list);
        if (list.length > 0) setSelectedMandateId(list[0].exch_mandate_id ?? list[0].id ?? null);
      })
      .catch(() => {})
      .finally(() => setMandatesLoaded(true));
  }, [mode, clientCode, mandatesLoaded]);

  const hasMandate = mandates.length > 0;
  const minAmt = mode === 'sip' ? (scheme.min_sip_amount ?? 500) : (scheme.min_purchase_amount ?? 1000);
  const amtNum = Number(amount);
  const amtValid = amtNum >= minAmt;

  const schemeCode = resolveBSEOrderCode(scheme);
  const allowedModes: string[] = (scheme as any).scheme_transaction_mode_allowed
    ?.map((m: any) => (m.scheme_transaction_mode_demat_physical_allowed ?? '').toLowerCase()) ?? [];
  const schemeDematOnly    = allowedModes.length > 0 && allowedModes.every(m => m === 'demat');
  const schemePhysicalOnly = allowedModes.length > 0 && allowedModes.every(m => m === 'physical');
  const physOrDemat: 'p' | 'd' = schemeDematOnly ? 'd' : schemePhysicalOnly ? 'p' : (isDemat ? 'd' : 'p');
  const needsDemat = physOrDemat === 'd';
  const depositoryAcct = needsDemat && depository ? {
    depository: /^\d{8}$/.test(depository.dp_id) ? 'C' as const : 'N' as const,
    dp_id:      depository.dp_id,
    client_id:  depository.client_id,
  } : undefined;
  const canSubmit = amtValid && !!schemeCode && !!memberId && !!mobnum && (!needsDemat || !!depositoryAcct);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStatus('loading'); setErrMsg('');
    try {
      if (mode === 'sip') {
        const today = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        let startDate = new Date(today.getFullYear(), today.getMonth(), sipDate);
        if (startDate <= today) startDate = new Date(today.getFullYear(), today.getMonth() + 1, sipDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + Number(installments) - 1);
        const res = await registerSxp({
          sxp_type: 'sip',
          mem_sxp_ref_id: `SIP-${Date.now()}`,
          investor: { ucc: clientCode },
          member: memberId,
          src_scheme: schemeCode,
          kyc_passed: true,
          dest_scheme: '',
          exch_mandate_id: selectedMandateId ?? 0,
          amount: amtNum,
          cur: 'INR',
          is_fresh: true,
          src_folio: '',
          phys_or_demat: physOrDemat,
          isunits: false,
          min_redeem_flag: false,
          dpc: false,
          start_date: fmt(startDate),
          end_date: fmt(endDate),
          freq: sipFreq,
          txn_date: sipDate,
          ninstallments: Number(installments),
          first_order_today: false,
          brokerage: 2.5,
          holder: [{ holder_rank: '1', email, mobnum: mobnum.startsWith('+') ? mobnum : `+91${mobnum}` }],
          email,
          mobnum: mobnum.startsWith('+') ? mobnum : `+91${mobnum}`,
          special_product: {
            special_prod_type: '', special_prod_name: '',
            target_scheme: '', target_amt: 0,
            goal_type: '', goal_amt: 0, sip_tenure: 0,
          },
          ...(depositoryAcct ? { depository_acct: depositoryAcct } : {}),
        });
        const rn = res?.data?.lists?.[0]?.reg_no ?? res?.data?.reg_no ?? res?.reg_no ?? '';
        setSipRegNo(rn);
        setStatus('success');
      } else {
        const res = await placeOrder([{
          type: 'p',
          mem_ord_ref_id: `ORD-${Date.now()}`,
          investor: { ucc: clientCode },
          member: memberId,
          scheme: schemeCode,
          amount: amtNum,
          cur: 'INR',
          is_units: false,
          all_units: false,
          min_redeem_flag: false,
          folio: '',
          is_fresh: true,
          phys_or_demat: physOrDemat,
          holder: [{ holder_rank: '1', email, mobnum: mobnum.startsWith('+') ? mobnum : `+91${mobnum}` }],
          email,
          mobnum: mobnum.startsWith('+') ? mobnum : `+91${mobnum}`,
          kyc_passed: true,
          dpc: true,
          payment_ref_id: '',
          is_nomination_opted: false,
          ...(depositoryAcct ? { depository_acct: depositoryAcct } : {}),
        }]);
        if (!res.success) throw new Error(res.errorMessage ?? 'Order failed');
        const orderId: number = res.data?.data?.items?.[0]?.id
          ?? res.data?.data?.orders?.[0]?.id
          ?? res.data?.data?.lists?.[0]?.id
          ?? res.data?.items?.[0]?.id;
        if (!orderId) throw new Error('Order created but no order_id returned — cannot initiate payment.');
        const pgRes = await getExchPgService({
          ucc: clientCode,
          orderIds: [orderId],
          redirectionUrl: `${window.location.origin}/payment-callback`,
          paymentModes: ['upi', 'netbanking', 'mandate'],
        });
        const url = pgRes?.data?.exch_pg_page_link ?? pgRes?.data?.payment_url ?? pgRes?.exch_pg_page_link ?? pgRes?.payment_url;
        if (!url) throw new Error('Payment URL not returned by BSE. Order ID: ' + orderId);
        setPayUrl(url);
        setStatus('redirecting');
      }
    } catch (e: any) {
      setStatus('error');
      setErrMsg(e?.message ?? 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1E3A6D] to-[#162d57] px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 shadow">
                <img src="/logo.png" alt="Lendrix" className="w-6 h-6 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug line-clamp-2">{scheme.name}</p>
                <p className="text-xs text-white/60 mt-0.5">{scheme.scheme_amc_name || scheme.scheme_amc_code}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[10px] font-semibold bg-white/15 rounded-full px-2.5 py-1">{scheme.scheme_sub_category || scheme.scheme_category}</span>
            <span className="text-[10px] font-semibold bg-[#00b386]/30 text-[#00b386] rounded-full px-2.5 py-1">{scheme.scheme_plan}</span>
            <span className="text-[10px] font-semibold bg-white/15 rounded-full px-2.5 py-1">{scheme.scheme_option}</span>
            <span className="text-[10px] font-mono font-semibold bg-white/10 rounded-full px-2.5 py-1 ml-auto">{scheme.scheme_isin || '—'}</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {status === 'success' ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00b386]/10 border-2 border-[#00b386]/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#00b386]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{mode === 'sip' ? 'SIP Registered!' : 'Order Confirmed!'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {mode === 'sip'
                    ? <>Your SIP of <span className="font-semibold text-gray-800">₹{Number(amount).toLocaleString('en-IN')}</span> has been submitted to BSE StAR MF.</>
                    : <>Your order has been placed successfully on BSE StAR MF.</>}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-left space-y-2.5">
                {(mode === 'sip' ? [
                  ['Fund',         scheme.name],
                  ['Amount',       `₹${Number(amount).toLocaleString('en-IN')} / ${sipFreq === 'm' ? 'month' : 'quarter'}`],
                  ['SIP Date',     `${sipDate}${sipDate === 1 ? 'st' : 'th'} of every month`],
                  ['Installments', `${installments} (est. ₹${(Number(amount) * Number(installments)).toLocaleString('en-IN')})`],
                  ['Platform',     'BSE StAR MF'],
                  ...(sipRegNo ? [['Reg. No.', sipRegNo]] : []),
                ] : [
                  ['Fund',     scheme.name],
                  ['Amount',   `₹${Number(amount).toLocaleString('en-IN')}`],
                  ['Type',     'Lumpsum'],
                  ['Platform', 'BSE StAR MF'],
                ]).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-gray-500">{k}</span>
                    <span className={`font-semibold text-right max-w-[55%] truncate ${k === 'Platform' ? 'text-[#00b386]' : k === 'Reg. No.' ? 'font-mono text-blue-700' : 'text-gray-800'}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">Done</button>
                {mode === 'sip' && (
                  <button onClick={() => { onClose(); onViewSIPs?.(); }} className="flex-1 bg-[#1E3A6D] hover:bg-[#162d57] text-white text-sm font-bold py-3 rounded-xl transition-colors">View My SIPs</button>
                )}
              </div>
            </div>
          ) : status === 'redirecting' ? (
            <div className="py-2 space-y-5">
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="w-16 h-16 rounded-full bg-[#00b386]/10 border-2 border-[#00b386]/30 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#00b386]" />
                </div>
                <p className="text-base font-bold text-gray-900">Order Placed Successfully!</p>
                <p className="text-xs text-gray-500 text-center max-w-[260px]">Your order has been created on BSE StAR MF. Complete payment to confirm your investment.</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Fund</span>
                  <span className="text-xs font-semibold text-gray-800 text-right max-w-[55%] truncate">{scheme.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Amount</span>
                  <span className="text-sm font-bold text-gray-900">₹{amtNum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Platform</span>
                  <span className="text-xs font-semibold text-[#00b386]">BSE StAR MF</span>
                </div>
              </div>
              <a href={payUrl!} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#00b386] hover:bg-[#009e78] text-white text-sm font-bold py-4 rounded-2xl transition-colors shadow-sm shadow-[#00b386]/30">
                <CreditCard className="w-4 h-4" /> Proceed to Payment
              </a>
              <button onClick={onClose} className="w-full text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors">I'll pay later — Close</button>
            </div>
          ) : (
            <>
              {/* Mode toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['lumpsum', 'sip'] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setAmount(''); setStatus('idle'); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${mode === m ? 'bg-[#1E3A6D] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {m === 'lumpsum' ? '💰 One-time (Lumpsum)' : '🔄 SIP (Auto-debit)'}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{mode === 'sip' ? 'SIP Amount' : 'Investment Amount'}</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">₹</span>
                  <input type="number" min={minAmt} value={amount} onChange={e => { setAmount(e.target.value); setStatus('idle'); }}
                    placeholder={`Min ₹${minAmt.toLocaleString('en-IN')}`}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00b386]/30 focus:border-[#00b386] transition-all" />
                </div>
                {amount && !amtValid && <p className="text-xs text-rose-500 mt-1">Minimum amount is ₹{minAmt.toLocaleString('en-IN')}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {(mode === 'sip' ? [500, 1000, 2000, 5000] : [5000, 10000, 25000, 50000]).map(v => (
                    <button key={v} onClick={() => setAmount(String(v))}
                      className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1 hover:border-[#00b386] hover:text-[#00b386] transition-colors">
                      ₹{v.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* SIP-only fields */}
              {mode === 'sip' && (
                <>
                  {mandatesLoaded && (
                    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs border ${hasMandate ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      {hasMandate ? (
                        <><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /><span><strong>Mandate active</strong> — auto-debit is set up.</span></>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span><strong>No mandate found.</strong> A mandate is required before registering a SIP.</span>
                          </div>
                          <div className="pl-5 space-y-1 text-amber-600">
                            <p>1. Go to <strong>My Investments</strong> tab</p>
                            <p>2. Click <strong>Register Mandate</strong></p>
                            <p>3. Approve in your bank, then come back here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!mandatesLoaded && <div className="flex items-center gap-2 text-xs text-gray-400"><RefreshCw className="w-3 h-3 animate-spin" /> Checking mandate status...</div>}

                  {hasMandate && mandates.length > 1 && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select Mandate</label>
                      <select value={selectedMandateId ?? ''} onChange={e => setSelectedMandateId(Number(e.target.value))}
                        className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                        {mandates.map((m, i) => (
                          <option key={i} value={m.exch_mandate_id ?? m.id}>
                            {m.bank_name ?? 'Bank'} — ₹{Number(m.amount ?? 0).toLocaleString('en-IN')} (ID: {m.exch_mandate_id ?? m.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SIP Date</label>
                      <select value={sipDate} onChange={e => setSipDate(Number(e.target.value))}
                        className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                        {SIP_DATES.map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of month</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Frequency</label>
                      <select value={sipFreq} onChange={e => setSipFreq(e.target.value as 'm' | 'q')}
                        className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                        {SIP_FREQS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No. of Installments</label>
                      <input type="number" min={1} value={installments} onChange={e => setInstallments(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00b386]/30 focus:border-[#00b386]" />
                    </div>
                  </div>
                </>
              )}

              {/* Summary */}
              {amtValid && (
                <div className="bg-[#00b386]/5 border border-[#00b386]/20 rounded-xl px-4 py-3 space-y-1.5">
                  <p className="text-xs font-bold text-[#00b386] uppercase tracking-wide">Order Summary</p>
                  {[
                    ['Fund',    scheme.name],
                    ['Type',    mode === 'sip' ? `SIP · ${SIP_FREQS.find(f => f.value === sipFreq)?.label}` : 'Lumpsum'],
                    ['Amount',  `₹${amtNum.toLocaleString('en-IN')}`],
                    ...(mode === 'sip' ? [['Total (est.)', `₹${(amtNum * Number(installments)).toLocaleString('en-IN')}`]] : []),
                    ['Platform','BSE StAR MF'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs text-gray-600">
                      <span>{k}</span>
                      <span className={`font-semibold text-right max-w-[60%] truncate ${k === 'Platform' ? 'text-emerald-700' : k === 'Amount' ? 'font-bold text-gray-900' : 'text-gray-800'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {status === 'error' && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-medium">❌ {errMsg}</div>
              )}
              {(!schemeCode || !memberId || !mobnum || (needsDemat && !depositoryAcct)) && (
                <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
                  {!schemeCode ? 'Scheme code unavailable.' : !memberId ? 'Member ID missing.' : !mobnum ? 'Mobile number missing.' : 'Demat account required for this scheme.'}
                </p>
              )}

              <button onClick={handleSubmit} disabled={!canSubmit || status === 'loading'}
                className="w-full bg-[#1E3A6D] hover:bg-[#162d57] disabled:opacity-50 text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#1E3A6D]/20">
                {status === 'loading' ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</> : mode === 'sip' ? 'Register SIP via BSE' : 'Place Order & Pay via BSE'}
              </button>

              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center shadow-sm border border-gray-100">
                  <img src="/logo.png" alt="Lendrix" className="w-4 h-4 object-contain" />
                </div>
                <p className="text-[10px] text-gray-400">Lendrix · BSE StAR MF · Direct Plan · 0% Commission</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestModal;
