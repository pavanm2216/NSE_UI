# BSE StAR MF Payment Info API Integration

## Overview
This integration provides a complete solution for sending payment information to BSE StAR MF after user completes payment on the gateway. The `send_payment_info` API is used to confirm payment details and process the investment order.

## API Details

**Endpoint**: `https://starmfv2demo.bseindia.com/api/send_payment_info`

**Method**: POST

**Content-Type**: `application/json`

## Request Structure

```json
{
  "data": {
    "payment_mode": "upi",
    "order_ids": [5000000969],
    "ucc": "CLNT10102",
    "member": "0000",
    "amount": 7000,
    "currency": "INR",
    "redirection_url": "www.members.url",
    "payment_details": {
      "bank_account": {
        "vpa": "success@razorpay",
        "bank_id": "ABC123",
        "account_number": "980000000000",
        "ifsc": "HDFC0000001",
        "is_retail": true,
        "is_corporate": false
      },
      "exch_mandate_id": 501342
    }
  }
}
```

## Files Created

### 1. Service Layer
**File**: `src/services/starmf/paymentInfoService.ts`

Core service for payment info API with functions:
- `sendPaymentInfo()` - Generic payment info submission
- `sendUPIPaymentInfo()` - UPI-specific payment info
- `sendNetBankingPaymentInfo()` - Net Banking-specific payment info
- `sendMandatePaymentInfo()` - Mandate-specific payment info

### 2. React Hook
**File**: `src/hooks/usePaymentInfo.ts`

Custom hook for component integration with:
- Loading state management
- Error handling
- Response data management
- All payment methods as separate callbacks

## Usage Examples

### Example 1: Using the Service Directly - UPI Payment

```typescript
import { sendUPIPaymentInfo } from '@/services/starmf/paymentInfoService';

const response = await sendUPIPaymentInfo(
  [5000000969], // Order IDs
  'CLNT10102', // UCC
  '0000', // Member code
  7000, // Amount
  'success@razorpay', // VPA (UPI ID)
  'HDFC0000001', // IFSC
  'https://yourapp.com/payment-callback', // Redirection URL
  'ABC123', // Bank ID (optional)
  '980000000000' // Account Number (optional)
);

console.log('Payment info submitted:', response);
```

### Example 2: Using the Hook in a Component

```typescript
import { usePaymentInfo } from '@/hooks/usePaymentInfo';

function PaymentConfirmation() {
  const { loading, error, data, submitUPIPaymentInfo } = usePaymentInfo();

  const handlePaymentConfirmation = async () => {
    try {
      const response = await submitUPIPaymentInfo(
        [5000000969],
        'CLNT10102',
        '0000',
        7000,
        'success@razorpay',
        'HDFC0000001',
        'https://yourapp.com/payment-callback'
      );
      
      console.log('Payment confirmed:', response);
      // Handle success
    } catch (err) {
      console.error('Payment confirmation failed:', err);
      // Handle error
    }
  };

  return (
    <div>
      <button onClick={handlePaymentConfirmation} disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Payment'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {data && <p className="text-green-600">Payment confirmed!</p>}
    </div>
  );
}
```

### Example 3: Net Banking Payment Info

```typescript
import { sendNetBankingPaymentInfo } from '@/services/starmf/paymentInfoService';

const response = await sendNetBankingPaymentInfo(
  [5000000969], // Order IDs
  'CLNT10102', // UCC
  '0000', // Member code
  7000, // Amount
  '980000000000', // Account Number
  'HDFC0000001', // IFSC
  'https://yourapp.com/payment-callback', // Redirection URL
  'ABC123' // Bank ID (optional)
);
```

### Example 4: Mandate Payment Info

```typescript
import { sendMandatePaymentInfo } from '@/services/starmf/paymentInfoService';

const response = await sendMandatePaymentInfo(
  [5000000969], // Order IDs
  'CLNT10102', // UCC
  '0000', // Member code
  7000, // Amount
  501342, // Mandate ID
  'HDFC0000001', // IFSC
  'https://yourapp.com/payment-callback', // Redirection URL
  '980000000000', // Account Number (optional)
  'ABC123' // Bank ID (optional)
);
```

### Example 5: Generic Payment Info Submission

```typescript
import { sendPaymentInfo } from '@/services/starmf/paymentInfoService';

const response = await sendPaymentInfo(
  'upi', // Payment mode
  [5000000969], // Order IDs
  'CLNT10102', // UCC
  '0000', // Member code
  7000, // Amount
  'INR', // Currency
  'https://yourapp.com/payment-callback', // Redirection URL
  {
    bank_account: {
      vpa: 'success@razorpay',
      bank_id: 'ABC123',
      account_number: '980000000000',
      ifsc: 'HDFC0000001',
      is_retail: true,
      is_corporate: false,
    },
  }
);
```

## Type Definitions

```typescript
type PaymentMode = 'upi' | 'netbanking' | 'mandate';

interface BankAccount {
  vpa?: string; // For UPI
  bank_id?: string;
  account_number?: string;
  ifsc: string;
  is_retail?: boolean;
  is_corporate?: boolean;
}

interface PaymentDetails {
  bank_account: BankAccount;
  exch_mandate_id?: number;
}

interface SendPaymentInfoRequest {
  data: {
    payment_mode: PaymentMode;
    order_ids: number[];
    ucc: string;
    member: string;
    amount: number;
    currency: string;
    redirection_url: string;
    payment_details: PaymentDetails;
  };
}

interface SendPaymentInfoResponse {
  status: string;
  message?: string;
  payment_id?: string;
  transaction_id?: string;
  [key: string]: any;
}
```

## Response Handling

The API returns a response object with:
- `status`: Payment status (success/failed/pending)
- `message`: Status message
- `payment_id`: Unique payment identifier
- `transaction_id`: Transaction reference ID
- Additional fields as per API response

## Error Handling

All functions throw errors with descriptive messages. Wrap calls in try-catch:

```typescript
try {
  const response = await sendPaymentInfo(...);
} catch (error) {
  console.error('Payment info error:', error.message);
  // Handle error appropriately
}
```

## Integration Flow

### Complete Payment Flow:

1. **User initiates payment** → Calls `get_exchpg_service` API
2. **User completes payment** → Redirected back from payment gateway
3. **Confirm payment details** → Call `send_payment_info` API
4. **Order processing** → BSE processes the investment order

### Step-by-Step Integration:

```typescript
// Step 1: Get payment gateway
const gatewayResponse = await getExchangePaymentGateway(
  ucc,
  orderIds,
  ['upi']
);

// Step 2: Redirect to payment gateway
if (gatewayResponse.payment_url) {
  window.location.href = gatewayResponse.payment_url;
}

// Step 3: After payment completion, send payment info
const paymentInfoResponse = await sendUPIPaymentInfo(
  orderIds,
  ucc,
  member,
  amount,
  vpa,
  ifsc,
  redirectionUrl
);

// Step 4: Handle response
if (paymentInfoResponse.status === 'success') {
  // Order is being processed
  console.log('Payment confirmed:', paymentInfoResponse);
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| payment_mode | string | Payment method: 'upi', 'netbanking', or 'mandate' |
| order_ids | number[] | Array of order IDs from BSE |
| ucc | string | Unique Client Code |
| member | string | Member/ARN code |
| amount | number | Payment amount in smallest currency unit |
| currency | string | Currency code (default: 'INR') |
| redirection_url | string | URL to redirect after payment |
| vpa | string | Virtual Payment Address (UPI ID) for UPI payments |
| bank_id | string | Bank identifier code |
| account_number | string | Bank account number |
| ifsc | string | IFSC code of the bank |
| is_retail | boolean | Whether account is retail (default: true) |
| is_corporate | boolean | Whether account is corporate (default: false) |
| exch_mandate_id | number | Mandate ID for recurring payments |

## Integration Checklist

- [ ] Import service/hook in your component
- [ ] Get order IDs from `placeOrder` or `registerSxp` API
- [ ] Collect payment details from user
- [ ] Call appropriate payment info function
- [ ] Handle success/error responses
- [ ] Update order status in your system
- [ ] Test with demo API endpoint
- [ ] Switch to production endpoint when ready

## Notes

- The demo endpoint is: `https://starmfv2demo.bseindia.com/api/send_payment_info`
- For production, update the endpoint URL in `paymentInfoService.ts`
- Payment info should be sent immediately after user completes payment
- Order IDs must be valid and exist in BSE system
- Member code should match the ARN/member code used for order creation
- IFSC code is mandatory for all payment modes
- VPA is required for UPI payments
- Mandate ID is required for mandate payments
