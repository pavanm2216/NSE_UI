import React, { useState } from 'react';
import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { PaymentMethod, MemDetails } from '@/services/starmf/paymentGatewayService';

interface PaymentGatewayProps {
  ucc: string;
  orderIds: number[];
  memDetails?: MemDetails;
  redirectionUrl?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export function PaymentGateway({
  ucc,
  orderIds,
  memDetails,
  redirectionUrl,
  onSuccess,
  onError,
}: PaymentGatewayProps) {
  const { loading, error, data, initiatePayment } = usePaymentGateway();
  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>([
    'upi',
    'netbanking',
    'mandate',
  ]);

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleInitiatePayment = async () => {
    try {
      const response = await initiatePayment(
        ucc,
        orderIds,
        selectedMethods,
        memDetails,
        redirectionUrl
      );

      if (response.payment_url) {
        window.location.href = response.payment_url;
      }

      onSuccess?.(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      onError?.(error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Gateway</CardTitle>
        <CardDescription>
          Select payment methods and proceed to payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Methods Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Methods</label>
          <div className="space-y-2">
            {(['upi', 'netbanking', 'mandate'] as const).map((method) => (
              <label key={method} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMethods.includes(method)}
                  onChange={() => handlePaymentMethodToggle(method)}
                  disabled={loading}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">
                  {method === 'upi' && 'UPI'}
                  {method === 'netbanking' && 'Net Banking'}
                  {method === 'mandate' && 'Mandate'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Order IDs Display */}
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-600">Order IDs</p>
          <p className="text-sm text-gray-900">{orderIds.join(', ')}</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start space-x-2 rounded-lg bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {data && (
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-sm font-medium text-green-900">
              Payment initiated successfully
            </p>
            {data.payment_ref_id && (
              <p className="text-xs text-green-700 mt-1">
                Ref ID: {data.payment_ref_id}
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleInitiatePayment}
          disabled={loading || selectedMethods.length === 0}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
