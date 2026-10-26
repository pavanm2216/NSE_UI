import { NSEButton } from '../components/NSEPresentation';
import React, { useState } from 'react';
import { X, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { changeNSEApiSecret } from '../services/nseSecretService';

const NSEChangeApiSecret: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const canSubmit = current.trim() && next.trim() && next === confirm && next !== current;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading'); setMessage('');
    try {
      const msg = await changeNSEApiSecret(current, next);
      setMessage(msg);
      setStatus('success');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to change password');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 bg-[#102B78] px-6 py-4 text-white">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Change API Password</p>
            <p className="text-[11px] text-white/60">Mutual funds · auth/change-password</p>
          </div>
          <NSEButton onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors">
            <X className="h-4 w-4" />
          </NSEButton>
        </div>

        <div className="px-6 py-5">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-200">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="font-bold text-gray-900">Password Changed</p>
              <p className="text-sm text-gray-500">{message}</p>
              <NSEButton onClick={onClose} className="mt-2 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Close
              </NSEButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Current Password', value: current, onChange: setCurrent },
                { label: 'New Password', value: next, onChange: setNext },
                { label: 'Confirm New Password', value: confirm, onChange: setConfirm },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
                  <input
                    type="password"
                    value={value}
                    onChange={e => { onChange(e.target.value); setStatus('idle'); }}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold focus:border-[#102B78] focus:outline-none focus:ring-2 focus:ring-[#102B78]/20"
                    required
                  />
                </div>
              ))}
              {confirm && next !== confirm && (
                <p className="text-xs text-rose-500">Passwords do not match</p>
              )}
              {status === 'error' && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">❌ {message}</p>
              )}
              <div className="flex gap-2 pt-1">
                <NSEButton type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </NSEButton>
                <NSEButton
                  type="submit"
                  disabled={!canSubmit || status === 'loading'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#102B78] py-2.5 text-sm font-bold text-white hover:bg-[#1B3F96] disabled:opacity-50 transition-colors"
                >
                  {status === 'loading' ? <><RefreshCw className="h-4 w-4 animate-spin" /> Changing…</> : 'Change Password'}
                </NSEButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NSEChangeApiSecret;
