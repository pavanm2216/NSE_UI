import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  Shield,
  Lock,
  ArrowLeft,
  Zap,
  Building2,
  Briefcase,
  Star,
  Gem,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/redux/hooks';
import {
  useCreateOrderMutation,
  useGetMyMembershipQuery,
} from '@/redux/services/membershipApi';
import { hasClientAccessToken } from '@/redux/services/clientAuthApi';
import { formatINR, PENDING_ORDER_KEY } from '@/constants/membership.constants';
import { openCashfreeCheckout } from '@/utils/cashfree';
import { getMutationErrorMessage } from '@/utils/rtkError';
import ClientPaymentAuth from '@/components/payment/ClientPaymentAuth';

type Step = 'checkout' | 'processing' | 'error';

const PremiumCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const selectedPlan = useAppSelector((state) => state.membership.selectedPlan);
  const [createOrder] = useCreateOrderMutation();

  const [step, setStep] = useState<Step>('checkout');
  const [error, setError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [clientReady, setClientReady] = useState(hasClientAccessToken());

  const {
    isSuccess: membershipVerified,
    isError: membershipError,
    refetch: refetchMembership,
  } = useGetMyMembershipQuery(undefined, {
    skip: !clientReady,
  });

  const isClientAuthed = clientReady && membershipVerified && !membershipError;

  useEffect(() => {
    if (clientReady && membershipError) {
      setClientReady(false);
    }
  }, [clientReady, membershipError]);

  const handleClientAuthenticated = useCallback(() => {
    setClientReady(true);
    refetchMembership();
  }, [refetchMembership]);

  const planName = selectedPlan?.plan_name || 'Lendrix Premium';
  const planPrice = selectedPlan?.amount || 0;
  const planCode = selectedPlan?.plan_code;
  const durationDays = selectedPlan?.duration_days || 365;

  const handlePay = async () => {
    if (!planCode) {
      navigate('/dashboard/premium-plans');
      return;
    }

    if (!isClientAuthed) {
      setError('Please verify your client account before paying.');
      return;
    }

    setError('');
    setIsPaying(true);

    try {
      const order = await createOrder({ plan_code: planCode }).unwrap();

      if (!order.payment_session_id) {
        throw new Error('Payment session was not created. Check Cashfree credentials on the server.');
      }

      localStorage.setItem(PENDING_ORDER_KEY, order.order_id);
      const result = await openCashfreeCheckout(order.payment_session_id);

      if (result.paymentDetails || result.redirect) {
        navigate(`/dashboard/payment/status?order_id=${encodeURIComponent(order.order_id)}`);
        return;
      }

      if (result.error) {
        setError('Payment window was closed. You can try again when ready.');
        return;
      }
    } catch (err: unknown) {
      setStep('error');
      const message = getMutationErrorMessage(err, 'Failed to start payment. Please try again.');

      if (
        message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('expired')
      ) {
        setClientReady(false);
        setError('Your session expired. Please verify your client account again.');
        return;
      }

      if (
        message.toLowerCase().includes('cancel') ||
        message.toLowerCase().includes('closed')
      ) {
        setStep('checkout');
        setError('Payment window was closed. You can try again when ready.');
        return;
      }

      setError(message);
    } finally {
      setIsPaying(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No plan selected.</p>
          <Button onClick={() => navigate('/dashboard/premium-plans')}>Choose a Plan</Button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="flex items-center justify-center py-16 p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl border border-border bg-card">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Payment could not start</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setStep('checkout')}>Try Again</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/premium-plans')}>
              Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1E3A6D] text-white px-4 py-3 flex items-center justify-between rounded-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/premium-plans')}
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#1E3A6D]" />
            </div>
            <div>
              <p className="font-semibold text-sm">Lendrix Ventech</p>
              <p className="text-xs text-white/70">Premium Membership</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/80">
          <Lock className="w-3 h-3" />
          Secured by Cashfree
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2A938F] to-[#1E3A6D] flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{planName}</h3>
              <p className="text-xs text-muted-foreground">
                {durationDays}-day membership · {user?.email}
              </p>
            </div>
          </div>

          {selectedPlan.description && (
            <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-base">
              <span>Total payable</span>
              <span className="text-[#1E3A6D]">{formatINR(planPrice)}</span>
            </div>
          </div>
        </div>

        {isClientAuthed ? (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Client account verified. You can proceed to payment.
          </div>
        ) : (
          <ClientPaymentAuth
            defaultEmail={user?.email || ''}
            onAuthenticated={handleClientAuthenticated}
          />
        )}

        <div className="bg-white dark:bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 space-y-2">
            {[
              { icon: Building2, text: 'Real Estate Legacy & Marketplace' },
              { icon: Briefcase, text: 'Venture Capital Advisory' },
              { icon: Star, text: 'Priority Support' },
              { icon: Gem, text: 'Exclusive Investment Deals' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {isPaying && (
            <p className="text-sm text-muted-foreground text-center">
              Opening secure Cashfree payment window…
            </p>
          )}

          <Button
            onClick={handlePay}
            disabled={!isClientAuthed || isPaying}
            className="w-full bg-[#2A938F] hover:bg-[#237d7a] text-white font-semibold py-3 text-base disabled:opacity-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isPaying ? 'Opening Cashfree…' : `Pay ${formatINR(planPrice)} via Cashfree`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckoutPage;
