# BSE Order Validation System - Implementation Guide

## Overview

This system dynamically handles BSE StAR MF API validation errors by:
1. Parsing BSE error responses
2. Mapping BSE fields to UI components
3. Collecting missing information from users
4. Retrying orders with complete data

## Files Created

### 1. `src/utils/bseValidation.ts`
**Purpose**: Centralized BSE field mapping and error parsing

**Key Exports**:
- `BSE_FIELD_MAP`: Maps BSE field names to UI metadata (label, type, section, validation rules)
- `parseBSEValidationErrors()`: Converts BSE error response to structured format
- `groupErrorsBySection()`: Groups errors by UI section (investor, bank, demat, etc.)
- `validateRequiredFields()`: Frontend validation before submitting to BSE
- `getFieldErrorMessage()`: User-friendly error messages

**Example Usage**:
```typescript
const errors = parseBSEValidationErrors(bseResponse);
// Returns: [
//   {
//     field: "depository_acct",
//     errorCode: "required",
//     message: "Demat Account Number is required",
//     metadata: { label: "Demat Account Number", section: "demat", ... }
//   }
// ]
```

### 2. `src/services/starmf/orderService.ts` (Updated)
**Purpose**: Handle BSE order placement with structured error responses

**Key Changes**:
- `placeOrder()` now returns `BSEOrderResponse` instead of throwing errors
- Parses validation errors using `parseBSEValidationErrors()`
- Returns structured error data for UI consumption

**Response Format**:
```typescript
{
  success: false,
  validationErrors: [
    {
      field: "depository_acct",
      errorCode: "required",
      message: "Demat Account Number is required",
      metadata: { ... }
    }
  ],
  errorMessage: "Order validation failed. Please provide the required information."
}
```

### 3. `src/hooks/useBSEValidation.ts`
**Purpose**: React hook to manage validation state

**Key Functions**:
- `setValidationErrors()`: Set errors from BSE response
- `clearValidationErrors()`: Clear all errors
- `updateMissingField()`: Update user-entered field value
- `getMissingFieldsForSection()`: Get errors for specific UI section
- `hasErrorsInSection()`: Check if section has errors
- `getFieldError()`: Get error for specific field

**Usage**:
```typescript
const {
  validationState,
  setValidationErrors,
  updateMissingField,
  getMissingFieldsForSection,
} = useBSEValidation();
```

### 4. `src/components/mutual-funds/BSEValidationErrors.tsx`
**Purpose**: Reusable UI components for displaying and collecting missing fields

**Components**:
- `BSEValidationErrors`: Displays all validation errors and collects missing required fields
- `DematDetailsSection`: Dedicated component for demat account information

**Features**:
- Auto-focuses on first missing field
- Shows field-specific help text
- Validates input before allowing retry
- Disables retry button until all required fields are filled
- Groups errors by type (required vs. other validation errors)

## Integration Steps

### Step 1: Update MFInvestPage.tsx

Add the validation hook and components:

```typescript
import { useBSEValidation } from '@/hooks/useBSEValidation';
import { BSEValidationErrors, DematDetailsSection } from '@/components/mutual-funds/BSEValidationErrors';
import { placeOrder } from '@/services/starmf/orderService';

export const MFInvestPage: React.FC = () => {
  const {
    validationState,
    setValidationErrors,
    clearValidationErrors,
    updateMissingField,
  } = useBSEValidation();

  const [dematAccount, setDematAccount] = useState('');
  const [depository, setDepository] = useState('');
  const [dpId, setDpId] = useState('');
  const [clientId, setClientId] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  // ... existing state ...

  const handlePlaceOrder = async () => {
    // Clear previous errors
    clearValidationErrors();

    // Build order payload
    const order = buildOrderPayload();

    // Place order
    const result = await placeOrder([order]);

    if (!result.success && result.validationErrors) {
      // Set validation errors to show UI
      setValidationErrors(result.validationErrors);
      
      // Scroll to validation errors
      const errorElement = document.getElementById('bse-validation-errors');
      errorElement?.scrollIntoView({ behavior: 'smooth' });
    } else if (result.success) {
      // Order placed successfully
      setView('buy-step-8');
    }
  };

  const handleRetryOrder = async () => {
    setIsRetrying(true);

    // Build order with collected missing fields
    const order = buildOrderPayload({
      depository_acct: dematAccount,
      depository,
      dp_id: dpId,
      client_id: clientId,
      ...validationState.missingFields,
    });

    const result = await placeOrder([order]);

    if (!result.success && result.validationErrors) {
      // Still has errors
      setValidationErrors(result.validationErrors);
    } else if (result.success) {
      // Success
      clearValidationErrors();
      setView('buy-step-8');
    }

    setIsRetrying(false);
  };

  // Render validation errors if present
  if (validationState.hasErrors) {
    return (
      <div id="bse-validation-errors" className="space-y-6">
        <BSEValidationErrors
          errors={validationState.errors}
          missingFields={validationState.missingFields}
          onFieldChange={updateMissingField}
          onRetry={handleRetryOrder}
          isLoading={isRetrying}
        />

        {/* Show demat section if demat errors exist */}
        {validationState.hasErrorsInSection('demat') && (
          <DematDetailsSection
            dematAccount={dematAccount}
            depository={depository}
            dpId={dpId}
            clientId={clientId}
            onDematAccountChange={setDematAccount}
            onDepositoryChange={setDepository}
            onDpIdChange={setDpId}
            onClientIdChange={setClientId}
            errors={{
              dematAccount: validationState.getFieldError('depository_acct')?.message,
              depository: validationState.getFieldError('depository')?.message,
              dpId: validationState.getFieldError('dp_id')?.message,
              clientId: validationState.getFieldError('client_id')?.message,
            }}
          />
        )}
      </div>
    );
  }

  // ... rest of component ...
};
```

### Step 2: Pre-fill from UCC Data

Before showing validation errors, check if data exists in UCC response:

```typescript
const uccData = investor; // From getUCCList()

const dematInfo = uccData?.depository?.[0];
if (dematInfo) {
  setDematAccount(dematInfo.client_id);
  setDpId(dematInfo.dp_id);
  // Depository code: 'C' = CDSL, 'N' = NSDL
  setDepository(dematInfo.depository_code);
}
```

### Step 3: Frontend Validation

Before calling `placeOrder()`, validate required fields:

```typescript
import { validateRequiredFields } from '@/utils/bseValidation';

const requiredFields = holdingType === 'D' 
  ? ['depository_acct', 'depository', 'dp_id', 'client_id']
  : [];

const { valid, missingFields } = validateRequiredFields(
  {
    depository_acct: dematAccount,
    depository,
    dp_id: dpId,
    client_id: clientId,
  },
  requiredFields
);

if (!valid) {
  // Show error to user before calling BSE
  setValidationErrors(
    missingFields.map(field => ({
      field,
      errorCode: 'required',
      message: `${BSE_FIELD_MAP[field]?.label} is required`,
      metadata: BSE_FIELD_MAP[field],
    }))
  );
  return;
}
```

## Order Payload Example

### Successful Order (with Demat Account)
```json
{
  "type": "p",
  "mem_ord_ref_id": "ORD20250101120000",
  "investor": {
    "ucc": "DematUCCTest1"
  },
  "member": "92374",
  "scheme": "007-DP",
  "amount": 5000,
  "cur": "INR",
  "is_units": false,
  "all_units": false,
  "min_redeem_flag": false,
  "folio": "",
  "is_fresh": true,
  "phys_or_demat": "D",
  "depository_acct": "12345678",
  "holder": [
    {
      "holder_rank": "1",
      "email": "investor@example.com",
      "mobnum": "9999999999"
    }
  ],
  "email": "investor@example.com",
  "mobnum": "9999999999",
  "kyc_passed": true,
  "dpc": false,
  "is_nomination_opted": false,
  "bank_acct": {
    "ifsc": "SBIN0001234",
    "no": "1234567890123456",
    "type": "SB",
    "name": "Bank Account"
  },
  "mem_details": {
    "euin": "",
    "euin_flag": false,
    "sub_br_code": "",
    "sub_br_arn": "ARN-92374",
    "partner_id": ""
  }
}
```

## Error Handling Scenarios

### Scenario 1: Missing Demat Account
**BSE Response**:
```json
{
  "status": "error",
  "messages": [
    {
      "msgid": 1522,
      "errcode": "required",
      "field": "ORD20250101.depository_acct"
    }
  ]
}
```

**UI Flow**:
1. Parse error → `{ field: "depository_acct", errorCode: "required" }`
2. Show `BSEValidationErrors` component
3. Display "Demat Account Number" input field
4. User enters account number
5. Click "Continue Order"
6. Retry with complete payload

### Scenario 2: Multiple Missing Fields
**BSE Response**:
```json
{
  "status": "error",
  "messages": [
    { "errcode": "required", "field": "ORD20250101.depository_acct" },
    { "errcode": "required", "field": "ORD20250101.depository" },
    { "errcode": "required", "field": "ORD20250101.dp_id" }
  ]
}
```

**UI Flow**:
1. Parse all 3 errors
2. Show "3 additional details required"
3. Display all 3 input fields
4. User fills all fields
5. Retry button becomes enabled
6. Click "Continue Order"

### Scenario 3: Unknown BSE Field
**BSE Response**:
```json
{
  "status": "error",
  "messages": [
    { "errcode": "required", "field": "ORD20250101.unknown_field" }
  ]
}
```

**UI Flow**:
1. Parse error → field not in `BSE_FIELD_MAP`
2. Show generic message: "Additional information required"
3. Display: "Field: unknown_field"
4. Show: "Please contact support if you are unable to provide this information"
5. Log to console: `[Order Validation] Unknown BSE field: unknown_field`

## Testing the Complete Flow

### Test Case 1: Demat Order with Missing Account
1. Select mutual fund
2. Choose "Demat" holding type
3. Leave demat account empty
4. Click "Place Order"
5. **Expected**: Show validation error for demat account
6. Enter demat account number
7. Click "Continue Order"
8. **Expected**: Order placed successfully

### Test Case 2: Pre-filled Demat Data
1. Select mutual fund
2. Choose "Demat" holding type
3. **Expected**: Demat fields pre-filled from UCC data
4. Click "Place Order"
5. **Expected**: Order placed successfully without validation errors

### Test Case 3: Multiple Validation Errors
1. Select mutual fund
2. Leave multiple required fields empty
3. Click "Place Order"
4. **Expected**: Show all missing fields at once
5. Fill all fields
6. Click "Continue Order"
7. **Expected**: Order placed successfully

## Extending the System

### Adding New BSE Fields

1. Add to `BSE_FIELD_MAP` in `bseValidation.ts`:
```typescript
new_field: {
  label: 'New Field Label',
  type: 'text',
  section: 'investor',
  required: true,
  placeholder: 'Enter new field',
  helpText: 'Help text for user',
}
```

2. Add UI component if needed in `BSEValidationErrors.tsx`

3. Add state management in `MFInvestPage.tsx`

4. Update order payload builder to include new field

## Security Considerations

- Never log sensitive values (PAN, account numbers, demat accounts)
- Use environment variables for API endpoints
- Validate all user input before sending to BSE
- Don't expose BSE credentials in React code
- Use HTTPS for all API calls
- Implement rate limiting on retry attempts

## Performance Optimization

- Debounce field input changes
- Cache UCC data to avoid repeated API calls
- Lazy load validation components
- Minimize re-renders using React.memo for error components
- Use useCallback for event handlers

## Accessibility

- All input fields have associated labels
- Error messages are announced to screen readers
- Focus management on validation errors
- Keyboard navigation support
- Color not the only indicator of errors (use icons + text)
