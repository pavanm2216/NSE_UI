import React, { useEffect, useState } from 'react';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useClientLoginMutation,
  useClientResendOtpMutation,
  useClientVerifyOtpMutation,
} from '@/redux/services/clientAuthApi';
import { getMutationErrorMessage } from '@/utils/rtkError';

type Step = 'credentials' | 'otp';

interface ClientPaymentAuthProps {
  defaultEmail?: string;
  onAuthenticated: () => void;
}

const ClientPaymentAuth: React.FC<ClientPaymentAuthProps> = ({
  defaultEmail = '',
  onAuthenticated,
}) => {
  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);

  const [clientLogin, { isLoading: isLoggingIn }] = useClientLoginMutation();
  const [clientVerifyOtp, { isLoading: isVerifying }] = useClientVerifyOtpMutation();
  const [clientResendOtp, { isLoading: isResending }] = useClientResendOtpMutation();

  useEffect(() => {
    if (step !== 'otp' || otpSecondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setOtpSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step, otpSecondsLeft]);

  const startOtpTimer = (seconds?: number) => {
    setOtpSecondsLeft(Math.max(seconds ?? 600, 0));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await clientLogin({ email, password }).unwrap();
      startOtpTimer(result.otp_expires_in_seconds);
      setStep('otp');
    } catch (err) {
      setError(getMutationErrorMessage(err, 'Login failed.'));
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await clientVerifyOtp({ email, otp: otp.trim() }).unwrap();
      onAuthenticated();
    } catch (err) {
      setError(getMutationErrorMessage(err, 'OTP verification failed.'));
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      const result = await clientResendOtp({ email }).unwrap();
      startOtpTimer(result.otp_expires_in_seconds);
    } catch (err) {
      setError(getMutationErrorMessage(err, 'Failed to resend OTP.'));
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-amber-900 dark:text-amber-200">
            Verify your client account
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Payments use your registered client account. Sign in with email and password, then enter
            the OTP sent to your email.
          </p>
        </div>
      </div>

      {step === 'credentials' ? (
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="client-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="client-email"
                type="email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="client-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="client-password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-3">
          <p className="text-sm text-muted-foreground">
            OTP sent to <strong>{email}</strong>
            {otpSecondsLeft > 0 && (
              <span className="block mt-1 text-amber-700">
                Expires in {Math.floor(otpSecondsLeft / 60)}:
                {String(otpSecondsLeft % 60).padStart(2, '0')}
              </span>
            )}
          </p>
          <div className="space-y-1">
            <Label htmlFor="client-otp">6-digit OTP</Label>
            <Input
              id="client-otp"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isVerifying || otp.length !== 6}>
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Verify &amp; Continue
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('credentials')}>
              Back
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClientPaymentAuth;
