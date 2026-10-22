import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, X, Ban, PauseCircle, PlayCircle, PlusCircle } from 'lucide-react';
import { cancelSxp, pauseSxp, resumeSxp, topupSxp } from '@/services/starmf/sxpService';
import { SIPRecord, SipAction } from './types';

const SipActionModal: React.FC<{
  sip: SIPRecord;
  action: SipAction;
  onClose: () => void;
  onDone: () => void;
}> = ({ sip, action, onClose, onDone }) => {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg]   = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [pauseInstallments, setPauseInstallments] = useState('1');
  const [pauseFrom, setPauseFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [topupAmount, setTopupAmount]   = useState('');
  const [topupFreq, setTopupFreq]       = useState('y');
  const [topupTxnDate, setTopupTxnDate] = useState('1');
  const [topupStart, setTopupStart]     = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });
  const [topupEnd, setTopupEnd] = useState(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() + 2);
    return d.toISOString().split('T')[0];
  });

  const titles:  Record<SipAction, string>        = { cancel: 'Cancel SIP', pause: 'Pause SIP', resume: 'Resume SIP', topup: 'Top-up SIP' };
  const icons:   Record<SipAction, React.ReactNode> = {
    cancel: <Ban className="w-5 h-5 text-rose-600" />,
    pause:  <PauseCircle className="w-5 h-5 text-amber-600" />,
    resume: <PlayCircle className="w-5 h-5 text-emerald-600" />,
    topup:  <PlusCircle className="w-5 h-5 text-blue-600" />,
  };
  const iconBg:  Record<SipAction, string> = { cancel: 'bg-rose-100', pause: 'bg-amber-100', resume: 'bg-emerald-100', topup: 'bg-blue-100' };
  const btnColor: Record<SipAction, string> = {
    cancel: 'bg-rose-600 hover:bg-rose-700',
    pause:  'bg-amber-500 hover:bg-amber-600',
    resume: 'bg-emerald-600 hover:bg-emerald-700',
    topup:  'bg-blue-600 hover:bg-blue-700',
  };

  const handleSubmit = async () => {
    setStatus('loading'); setErrMsg('');
    try {
      const regNo = String(sip.id);
      if (action === 'cancel') await cancelSxp(regNo, 6, cancelReason || 'Do not want to continue', 'SIP');
      if (action === 'pause')  await pauseSxp(regNo, Number(pauseInstallments), pauseFrom);
      if (action === 'resume') await resumeSxp(regNo, 'Ready to continue');
      if (action === 'topup')  await topupSxp(regNo, `TOPUP-${Date.now()}`, Number(topupAmount), topupStart, topupEnd, topupFreq, Number(topupTxnDate), '', '', true);
      setStatus('success');
      setTimeout(() => { onDone(); onClose(); }, 1200);
    } catch (e: any) {
      setStatus('error');
      setErrMsg(e?.response?.data?.messages?.[0]?.errcode ?? e?.message ?? 'Action failed');
    }
  };

  const canSubmit = action === 'cancel' ? true : action === 'pause' ? Number(pauseInstallments) >= 1 : action === 'resume' ? true : Number(topupAmount) > 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg[action]}`}>{icons[action]}</div>
          <div>
            <p className="font-bold text-gray-900">{titles[action]}</p>
            <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{sip.scheme}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5 text-xs">
          <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-bold text-gray-900">₹{Number(sip.amount).toLocaleString('en-IN')}/{sip.freq}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Reg. No.</span><span className="font-mono font-semibold text-gray-700">{sip.id}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">UCC</span><span className="font-mono font-semibold text-gray-700">{sip.ucc}</span></div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> {titles[action]} successful.
          </div>
        ) : (
          <>
            {action === 'cancel' && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason (optional)</label>
                <textarea rows={2} value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Goal achieved"
                  className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>
            )}
            {action === 'pause' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Installments to skip</label>
                  <input type="number" min={1} value={pauseInstallments} onChange={e => setPauseInstallments(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pause from date</label>
                  <input type="date" value={pauseFrom} onChange={e => setPauseFrom(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>
            )}
            {action === 'resume' && <p className="text-sm text-gray-500">This will resume your paused SIP from the next installment date.</p>}
            {action === 'topup' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Top-up Amount (₹)</label>
                  <input type="number" min={1} value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Frequency</label>
                    <select value={topupFreq} onChange={e => setTopupFreq(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none bg-white">
                      <option value="m">Monthly</option>
                      <option value="q">Quarterly</option>
                      <option value="y">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Txn Day</label>
                    <input type="number" min={1} max={28} value={topupTxnDate} onChange={e => setTopupTxnDate(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
                    <input type="date" value={topupStart} onChange={e => setTopupStart(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">End Date</label>
                    <input type="date" value={topupEnd} onChange={e => setTopupEnd(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">❌ {errMsg}</p>}

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={!canSubmit || status === 'loading'}
                className={`flex-1 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${btnColor[action]}`}>
                {status === 'loading' ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing…</> : titles[action]}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SipActionModal;
