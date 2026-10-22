import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react';

const BACKEND = 'http://localhost:5000';
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS  = 30000; // give up after 30 s

// BSE event codes → human label + whether it counts as "done"
const STATUS_MAP: Record<string, { label: string; terminal: boolean; success: boolean }> = {
  pending:                  { label: 'Waiting for confirmation…', terminal: false, success: false },
  exch_init:                { label: 'Order initialised',          terminal: false, success: false },
  agency_pending:           { label: 'Payment pending',            terminal: false, success: false },
  agency_inprocess:         { label: 'Payment processing',         terminal: false, success: false },
  agency_approved:          { label: 'Payment approved',           terminal: false, success: true  },
  agency_payment_complete:  { label: 'Payment complete',           terminal: true,  success: true  },
  agency_rejected:          { label: 'Payment rejected',           terminal: true,  success: false },
  agency_cancelled:         { label: 'Payment cancelled',          terminal: true,  success: false },
  done:                     { label: 'Order complete',             terminal: true,  success: true  },
  failed:                   { label: 'Order failed',               terminal: true,  success: false },
};

function getInfo(status: string) {
  return STATUS_MAP[status] ?? { label: status, terminal: false, success: false };
}

const BSEPaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus]   = useState<string>('pending');
  const [timedOut, setTimedOut] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const get = (keys: string[]) =>
    keys.map(k => searchParams.get(k)).find(v => v != null) ?? '';

  const orderId    = get(['OrderId', 'order_id', 'orderId']);
  const paymentRef = get(['PaymentRefNo', 'payment_ref_no', 'paymentRefNo']);
  const amount     = get(['Amount', 'amount']);
  const mode       = get(['PaymentMode', 'payment_mode', 'paymentMode']);

  const isMandateCallback = !orderId && !paymentRef && !amount;

  useEffect(() => {
    if (isMandateCallback) {
      // Mandate auth callback — BSE redirects here after authorisation with no order params
      // Signal the original tab and auto-close this tab
      localStorage.setItem('bse_payment_result', JSON.stringify({ status: 'success', orderId: '', paymentRef: '', amount: '', ts: Date.now() }));
      const t = setTimeout(() => window.close(), 2000);
      return () => clearTimeout(t);
    }
    if (!orderId) {
      setStatus('failed');
      return;
    }

    const poll = async () => {
      try {
        const res  = await fetch(`${BACKEND}/api/bse/order-status/${orderId}`);
        const data = await res.json();
        console.log('[BSE Callback] poll result:', data);
        setStatus(data.status ?? 'pending');
        if (data.terminal) stopPolling();
      } catch (err) {
        console.warn('[BSE Callback] poll error:', err);
      }
    };

    const stopPolling = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    };

    poll(); // immediate first check
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    timeoutRef.current  = setTimeout(() => {
      stopPolling();
      setTimedOut(true);
    }, POLL_TIMEOUT_MS);

    return stopPolling;
  }, [orderId]);

  const info = getInfo(status);
  const goToDashboard = () => { window.location.href = '/dashboard/mf/invest'; };

  // ── Mandate authorisation callback ────────────────────────────────────────
  if (isMandateCallback) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Mandate Authorised</h1>
          <p className="mt-3 text-sm text-gray-600">Your SIP mandate has been authorised with BSE. You can close this tab — your investment page will update automatically.</p>
          <button onClick={() => window.close()} className="mt-6 w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors">
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  // ── Polling / pending ──────────────────────────────────────────────────────
  if (!info.terminal && !timedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
            <Loader2 className="h-8 w-8 animate-spin text-[#0D3B66]" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Confirming Payment</h1>
          <p className="mt-2 text-sm text-gray-600">{info.label}</p>
          {orderId && (
            <p className="mt-3 text-xs text-gray-400">Order ID: {orderId}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Timed out — status still unknown ──────────────────────────────────────
  if (timedOut && !info.terminal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Status Pending</h1>
          <p className="mt-2 text-sm text-gray-600">
            We haven't received a final confirmation from BSE yet. Your order may still be processing.
            Check your email or visit your portfolio for the latest status.
          </p>
          {orderId && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm border border-gray-200">
              <span className="text-gray-500">Order ID: </span>
              <span className="font-semibold">{orderId}</span>
            </div>
          )}
          <button onClick={goToDashboard} className="mt-6 w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors">
            Go to Portfolio
          </button>
        </div>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (info.success) {
    // Signal the original tab that payment succeeded
    localStorage.setItem('bse_payment_result', JSON.stringify({ status: 'success', orderId, paymentRef, amount, ts: Date.now() }));
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Successful</h1>
          <p className="mt-2 text-sm text-gray-600">{info.label}</p>

          <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left border border-gray-200 space-y-2 text-sm">
            {orderId    && <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-semibold">{orderId}</span></div>}
            {paymentRef && <div className="flex justify-between"><span className="text-gray-500">Payment Ref</span><span className="font-semibold">{paymentRef}</span></div>}
            {amount     && <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">₹{amount}</span></div>}
            {mode       && <div className="flex justify-between"><span className="text-gray-500">Mode</span><span className="font-semibold">{mode}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-semibold text-emerald-600">{info.label}</span></div>
          </div>

          <button onClick={goToDashboard} className="mt-6 w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors">
            Back to Mutual Funds
          </button>
        </div>
      </div>
    );
  }

  // ── Failed / Rejected / Cancelled ─────────────────────────────────────────
  // Signal the original tab that payment failed
  localStorage.setItem('bse_payment_result', JSON.stringify({ status: 'failed', orderId, ts: Date.now() }));
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
      <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100">
          <XCircle className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment {status === 'agency_cancelled' ? 'Cancelled' : 'Failed'}</h1>
        <p className="mt-2 text-sm text-gray-600">{info.label}. You can try again from the invest page.</p>

        {orderId && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm border border-gray-200">
            <span className="text-gray-500">Order ID: </span>
            <span className="font-semibold">{orderId}</span>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button onClick={() => window.history.back()} className="w-full rounded-lg border-2 border-gray-300 text-gray-700 px-4 py-3 font-semibold hover:bg-gray-50 transition-colors">
            Try Again
          </button>
          <button onClick={goToDashboard} className="w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors">
            Back to Mutual Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default BSEPaymentCallbackPage;
