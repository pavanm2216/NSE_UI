# Complete Payment Flow Integration Guide

## Overview
This guide shows how to integrate the complete payment flow using both the `get_exchpg_service` (payment gateway) and `send_payment_info` (payment confirmation) APIs.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MF Investor Flow                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 1: Amount  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 2: Investor│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 3: Bank    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 4: Payment │ ◄─── YOU ARE HERE
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  1. Call get_exchpg_service API         │
        │     (Get payment gateway URL)           │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  2. Redirect to BSE Payment Gateway     │
        │     (User completes payment)            │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  3. Payment Callback Handler            │
        │     (Receive payment confirmation)      │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  4. Call send_payment_info API          │
        │     (Confirm payment with BSE)          │
        └─────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 5: Review  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Step 6: Success │
                    └──────────────────┘
```

## Step-by-Step Implementation

### Step 1: Set Up Payment Gateway Route

Add a route for payment callback in your router:

```typescript
// In your router configuration
import PaymentCallbackHandler from '@/components/payment/PaymentCallbackHandler';

const routes = [
  // ... other routes
  {
    path: '/payment-callback',
    element: <PaymentCallbackHandler 
      onSuccess={(response) => {
        console.log('Payment confirmed:', response);
        // Redirect to success page or dashboard
        window.location.href = '/dashboard';
      }}
      onError={(error) => {
        console.error('Payment error:', error);
        // Handle error
      }}
    />,
  },
];
```

### Step 2: Initiate Payment Gateway

In your payment step component:

```typescript
import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import { getARNFromEnv, extractARNNumber } from '@/utils/arnValidator';

function PaymentStep() {
  const { loading, error, initiatePayment } = usePaymentGateway();
  const [investor, setInvestor] = useState(/* ... */);
  const [orderIds, setOrderIds] = useState<number[]>([]);

  const handleInitiatePayment = async () => {
    try {
      const response = await initiatePayment(
        investor.ucc,
        orderIds, // From placeOrder API response
        ['upi', 'netbanking'], // Payment methods
        {
          euin: '',
          euin_flag: false,
          sub_br_code: '',
          sub_br_arn: getARNFromEnv(),
          partner_id: '',
        },
        `${window.location.origin}/payment-callback` // Callback URL
      );

      if (response.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.payment_url;
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
    }
  };

  return (
    <button onClick={handleInitiatePayment} disabled={loading}>
      {loading ? 'Initiating...' : 'Proceed to Payment'}
    </button>
  );
}
```

### Step 3: Handle Payment Callback

The `PaymentCallbackHandler` component automatically:
1. Extracts payment parameters from URL
2. Validates the payment status
3. Calls `send_payment_info` API to confirm payment
4. Shows success/error message

### Step 4: Complete Integration in MFInvestPage

Here's how to integrate both APIs in the MF Investor flow:

```typescript
import { usePaymentGateway } from '@/hooks/usePaymentGateway';
import { usePaymentInfo } from '@/hooks/usePaymentInfo';

function MFInvestPage() {
  const { initiatePayment } = usePaymentGateway();
  const { submitPaymentInfo } = usePaymentInfo();
  const [bseOrderNumericId, setBseOrderNumericId] = useState<number | null>(null);

  // After placing order with placeOrder API
  const handleOrderPlaced = (orderId: number) => {
    setBseOrderNumericId(orderId);
  };

  // When user clicks "Proceed to Payment"
  const handlePaymentInitiate = async () => {
    try {
      // Step 1: Get payment gateway URL
      const response = await initiatePayment(
        investor.ucc,
        [bseOrderNumericId],
        ['upi', 'netbanking'],
        {
          euin: '',
          euin_flag: false,
          sub_br_code: '',
          sub_br_arn: getARNFromEnv(),
          partner_id: '',
        },
        `${window.location.origin}/payment-callback`
      );

      // Step 2: Redirect to payment gateway
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
    }
  };

  return (
    // ... your component JSX
  );
}
```

## Complete Flow Example

### Scenario: One-Time Investment with UPI Payment

```typescript
// 1. User places order
const orderResponse = await placeOrder([{
  type: 'p',
  mem_ord_ref_id: 'ORD123',
  investor: { ucc: 'CLNT10102' },
  member: '0000',
  scheme: 'HDFC-TOP-100',
  amount: 7000,
  // ... other fields
}]);

const orderId = orderResponse.data.orders[0].id; // e.g., 5000000969

// 2. User initiates payment
const gatewayResponse = await getExchangePaymentGateway(
  'CLNT10102',
  [orderId],
  ['upi'],
  {
    euin: '',
    euin_flag: false,
    sub_br_code: '',
    sub_br_arn: 'ARN-92374',
    partner_id: '',
  },
  'https://yourapp.com/payment-callback'
);

// 3. Redirect to payment gateway
window.location.href = gatewayResponse.payment_url;

// 4. User completes payment on BSE gateway
// 5. BSE redirects to: https://yourapp.com/payment-callback?
//    order_id=5000000969&
//    payment_ref=PAY123&
//    status=success&
//    ucc=CLNT10102&
//    member=0000&
//    amount=7000&
//    payment_mode=upi&
//    vpa=user@upi&
//    ifsc=HDFC0000001

// 6. PaymentCallbackHandler automatically calls send_payment_info
const paymentInfoResponse = await sendUPIPaymentInfo(
  [5000000969],
  'CLNT10102',
  '0000',
  7000,
  'user@upi',
  'HDFC0000001',
  'https://yourapp.com/payment-callback'
);

// 7. Payment confirmed, order processing begins
console.log('Payment confirmed:', paymentInfoResponse);
```

## Query Parameters for Callback

When BSE redirects to your callback URL, it includes these parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| order_id | number | BSE order ID |
| payment_ref | string | Payment reference from gateway |
| status | string | Payment status (success/failed) |
| ucc | string | Investor UCC |
| member | string | Member/ARN code |
| amount | number | Payment amount |
| payment_mode | string | Payment method (upi/netbanking/mandate) |
| vpa | string | UPI ID (for UPI payments) |
| ifsc | string | IFSC code |
| account_number | string | Bank account number (optional) |
| bank_id | string | Bank ID (optional) |
| mandate_id | number | Mandate ID (for mandate payments) |

## Error Handling

### Payment Gateway Errors

```typescript
try {
  const response = await initiatePayment(...);
} catch (error) {
  console.error('Payment gateway error:', error.message);
  // Show error to user
  // Allow retry
}
```

### Payment Info Errors

```typescript
try {
  const response = await submitPaymentInfo(...);
} catch (error) {
  console.error('Payment info error:', error.message);
  // Payment was completed but confirmation failed
  // Retry sending payment info
  // Contact support if issue persists
}
```

## Testing Checklist

- [ ] Test UPI payment flow
- [ ] Test Net Banking payment flow
- [ ] Test Mandate payment flow
- [ ] Test payment callback with success status
- [ ] Test payment callback with failed status
- [ ] Test missing query parameters
- [ ] Test invalid order IDs
- [ ] Test network errors during payment info submission
- [ ] Test redirect to dashboard after success
- [ ] Test retry mechanism for failed payments

## Production Deployment

1. Update API endpoints from demo to production:
   ```typescript
   // In paymentGatewayService.ts
   const PAYMENT_GATEWAY_API = 'https://starmf.bseindia.com/api/get_exchpg_service';
   
   // In paymentInfoService.ts
   const PAYMENT_INFO_API = 'https://starmf.bseindia.com/api/send_payment_info';
   ```

2. Update callback URL to production domain:
   ```typescript
   redirectionUrl: 'https://yourdomain.com/payment-callback'
   ```

3. Ensure SSL/TLS is enabled on callback URL

4. Test with production credentials and test orders

5. Monitor payment flow logs for issues

## Troubleshooting

### Payment Gateway Not Redirecting
- Check if `payment_url` is returned in response
- Verify redirection URL is correct
- Check browser console for errors

### Payment Info Submission Failing
- Verify all required parameters are present
- Check if order ID is valid
- Ensure UCC and member codes match
- Verify IFSC code format

### Callback Not Being Called
- Check if redirection URL is accessible
- Verify URL is HTTPS in production
- Check firewall/security settings
- Monitor server logs for incoming requests

## Support

For issues or questions:
1. Check the API documentation
2. Review console logs for error messages
3. Contact BSE support with transaction ID
4. Provide payment reference ID for investigation
