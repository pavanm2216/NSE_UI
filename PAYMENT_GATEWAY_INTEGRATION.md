# BSE StAR MF Payment Gateway Integration

## Overview
This integration provides a complete payment gateway solution for BSE StAR MF exchange using the `get_exchpg_service` API endpoint.

## API Details

**Endpoint**: `https://starmfv2demo.bseindia.com/api/get_exchpg_service`

**Method**: POST

**Content-Type**: `application/json`

## Request Structure

```json
{
  "data": {
    "mem_details": {
      "euin": "",
      "euin_flag": false,
      "sub_br_code": "",
      "sub_br_arn": "",
      "partner_id": ""
    },
    "investor": {
      "ucc": "0805phy"
    },
    "order_ids": [5000045607, 5000045608],
    "requested_method": "exch_pg_page",
    "payment_mode": ["upi", "netbanking", "mandate"],
    "redirection_url": "https://www.google.com/"
  }
}
```

## Files Created

### 1. Service Layer
**File**: `src/services/starmf/paymentGatewayService.ts`

Core service for payment gateway API integration with functions:
- `getExchangePaymentGateway()` - Main payment initiation
- `getPaymentInfoData()` - Get payment information
- `initiateUPIPayment()` - UPI-only payment
- `initiateNetBankingPayment()` - Net Banking-only payment
- `initiateMandatePayment()` - Mandate-only payment

### 2. React Hook
**File**: `src/hooks/usePaymentGateway.ts`

Custom hook for component integration with:
- Loading state management
- Error handling
- Response data management
- All payment methods as separate callbacks

### 3. React Component
**File**: `src/components/payment/PaymentGateway.tsx`

Pre-built UI component with:
- Payment method selection (checkboxes)
- Order IDs display
- Error/success messages
- Loading state
- Responsive design

## Usage Examples

### Example 1: Using the Service Directly

```typescript
import { getExchangePaymentGateway } from '@/services/starmf/paymentGatewayService';

const response = await getExchangePaymentGateway(
  '0805phy', // UCC
  [5000045607, 5000045608], // Order IDs
  ['upi', 'netbanking', 'mandate'], // Payment methods
  {
    euin: '',
    euin_flag: false,
    sub_br_code: '',
    sub_br_arn: '',
    partner_id: '',
  }, // Member details
  'https://yourapp.com/payment-callback' // Redirection URL
);

if (response.payment_url) {
  window.location.href = response.payment_url;
}
```

### Example 2: Using the Hook in a Component

```typescript
import { usePaymentGateway } from '@/hooks/usePaymentGateway';

function MyPaymentComponent() {
  const { loading, error, data, initiatePayment } = usePaymentGateway();

  const handlePayment = async () => {
    try {
      const response = await initiatePayment(
        '0805phy',
        [5000045607, 5000045608],
        ['upi', 'netbanking']
      );
      
      if (response.payment_url) {
        window.location.href = response.payment_url;
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
```

### Example 3: Using the Pre-built Component

```typescript
import { PaymentGateway } from '@/components/payment/PaymentGateway';

function CheckoutPage() {
  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    // Handle success
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle error
  };

  return (
    <PaymentGateway
      ucc="0805phy"
      orderIds={[5000045607, 5000045608]}
      memDetails={{
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: '',
        partner_id: '',
      }}
      redirectionUrl="https://yourapp.com/payment-callback"
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  );
}
```

### Example 4: UPI-Only Payment

```typescript
import { initiateUPIPayment } from '@/services/starmf/paymentGatewayService';

const response = await initiateUPIPayment(
  '0805phy',
  [5000045607, 5000045608]
);
```

### Example 5: Net Banking-Only Payment

```typescript
import { initiateNetBankingPayment } from '@/services/starmf/paymentGatewayService';

const response = await initiateNetBankingPayment(
  '0805phy',
  [5000045607, 5000045608]
);
```

## Type Definitions

```typescript
type PaymentMethod = 'upi' | 'netbanking' | 'mandate';
type RequestMethod = 'exch_pg_page' | 'payment_info_data';

interface MemDetails {
  euin?: string;
  euin_flag?: boolean;
  sub_br_code?: string;
  sub_br_arn?: string;
  partner_id?: string;
}

interface Investor {
  ucc: string;
}

interface ExchPgResponse {
  status: string;
  message?: string;
  payment_url?: string;
  payment_ref_id?: string;
  [key: string]: any;
}
```

## Response Handling

The API returns a response object with:
- `status`: Payment status (success/failed/pending)
- `message`: Status message
- `payment_url`: URL to redirect for payment (if applicable)
- `payment_ref_id`: Reference ID for the payment transaction

## Error Handling

All functions throw errors with descriptive messages. Wrap calls in try-catch:

```typescript
try {
  const response = await getExchangePaymentGateway(...);
} catch (error) {
  console.error('Payment error:', error.message);
  // Handle error appropriately
}
```

## Integration Checklist

- [ ] Import service/hook/component in your page
- [ ] Provide valid UCC (Unique Client Code)
- [ ] Provide valid order IDs from your system
- [ ] Set appropriate redirection URL for callback
- [ ] Handle success and error responses
- [ ] Test with demo API endpoint
- [ ] Switch to production endpoint when ready

## Notes

- The demo endpoint is: `https://starmfv2demo.bseindia.com/api/get_exchpg_service`
- For production, update the endpoint URL in `paymentGatewayService.ts`
- Member details can be left empty for basic integration
- At least one payment method must be selected
- Order IDs must be valid and exist in your system
