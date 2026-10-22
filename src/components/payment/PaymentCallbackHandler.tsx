import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePaymentInfo } from '@/hooks/usePaymentInfo';
import { getBSEPaymentStatus } from '@/services/starmf/paymentGatewayService';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentCallbackProps {
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  onProcessing?: () => void;
}

/**
 * Payment Callback Handler Component
 * 
 * This component handles the redirect from BSE payment gateway
 * and confirms payment details with the send_payment_info API
 * 
 * Query Parameters Expected:
 * - order_id: BSE order ID
 * - payment_ref: Payment reference from gateway
 * - status: Payment status (success/failed)
 * - ucc: Investor UCC
 * - member: Member/ARN code
 * - amount: Payment amount
 * - payment_mode: Payment method (upi/netbanking/mandate)
 * - vpa: UPI ID (for UPI payments)
 * - ifsc: IFSC code
 * - account_number: Bank account number (optional)
 * - bank_id: Bank ID (optional)
 * - mandate_id: Mandate ID (for mandate payments)
 */
export function PaymentCallbackHandler({
  onSuccess,
  onError,
  onProcessing,
}: PaymentCallbackProps) {
  const [searchParams] = useSearchParams();
  const { loading, error, data, submitPaymentInfo } = usePaymentInfo();
  const [callbackStatus, setCallbackStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        onProcessing?.();

        // Extract parameters from URL
        const orderId = searchParams.get('order_id');
        const paymentRef = searchParams.get('payment_ref');
        const status = searchParams.get('status');
        const ucc = searchParams.get('ucc');
        const member = searchParams.get('member');
        const amount = searchParams.get('amount');
        const paymentMode = searchParams.get('payment_mode');
        const vpa = searchParams.get('vpa');
        const ifsc = searchParams.get('ifsc');
        const accountNumber = searchParams.get('account_number');
        const bankId = searchParams.get('bank_id');
        const mandateId = searchParams.get('mandate_id');

        console.log('[Payment Callback] Received parameters:', {
          orderId,
          paymentRef,
          status,
          ucc,
          member,
          amount,
          paymentMode,
        });

        // Validate required parameters
        if (!orderId || !ucc || !member || !amount || !paymentMode || !ifsc) {
          throw new Error('Missing required payment parameters');
        }

        // Check payment status
        if (status !== 'success') {
          throw new Error(`Payment failed with status: ${status}`);
        }

        // Verify payment status with BSE
        if (paymentRef) {
          console.log('[Payment Callback] Verifying payment status with BSE...');
          const paymentStatus = await getBSEPaymentStatus(
            paymentRef,
            orderId ? Number(orderId) : undefined
          );
          
          if (paymentStatus.status !== 'success') {
            throw new Error(
              paymentStatus.messages?.[0]?.vals?.[0] ||
              `Payment verification failed: ${paymentStatus.status}`
            );
          }
          console.log('[Payment Callback] Payment verified with BSE:', paymentStatus);
        }

        // Send payment info to BSE
        const response = await submitPaymentInfo(
          paymentMode as 'upi' | 'netbanking' | 'mandate',
          [Number(orderId)],
          ucc,
          member,
          Number(amount),
          'INR',
          window.location.origin,
          {
            bank_account: {
              vpa: paymentMode === 'upi' ? vpa || undefined : undefined,
              bank_id: bankId || undefined,
              account_number: accountNumber || undefined,
              ifsc,
              is_retail: true,
              is_corporate: false,
            },
            exch_mandate_id: mandateId ? Number(mandateId) : undefined,
          }
        );

        console.log('[Payment Callback] Payment info submitted:', response);

        setCallbackStatus('success');
        onSuccess?.(response);
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Payment callback processing failed';
        console.error('[Payment Callback] Error:', error);
        setCallbackStatus('error');
        setCallbackError(error);
        onError?.(err instanceof Error ? err : new Error(error));
      }
    };

    processPaymentCallback();
  }, [searchParams, submitPaymentInfo, onSuccess, onError, onProcessing]);

  if (callbackStatus === 'processing' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
            <Loader2 className="h-8 w-8 animate-spin text-[#0D3B66]" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Processing Payment</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we confirm your payment details with BSE...
          </p>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-[#11B5E4] to-[#0D3B66]" />
          </div>
        </div>
      </div>
    );
  }

  if (callbackStatus === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Confirmed</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your payment has been successfully processed and confirmed with BSE.
          </p>
          {data && (
            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-left border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Details</p>
              <div className="mt-3 space-y-2 text-sm">
                {data.payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-semibold text-gray-900">{data.payment_id}</span>
                  </div>
                )}
                {data.transaction_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-semibold text-gray-900">{data.transaction_id}</span>
                  </div>
                )}
                {data.status && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-emerald-600">{data.status}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-6 w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 p-4">
      <div className="rounded-2xl bg-white shadow-lg p-8 text-center max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100">
          <AlertCircle className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="mt-2 text-sm text-gray-600">
          {callbackError || error || 'An error occurred while processing your payment.'}
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full rounded-lg border-2 border-gray-300 text-gray-700 px-4 py-3 font-semibold hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full rounded-lg bg-[#0D3B66] text-white px-4 py-3 font-semibold hover:bg-[#092d4e] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCallbackHandler;
