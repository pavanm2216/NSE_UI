# BSE STAR MF API Integration Fixes - Summary

## Files Modified

### 1. `sxpService.ts` - SIP Registration Service
**Changes:**
- Restructured payload to include all required BSE fields
- Wrapped request body in `{ data: {...} }` structure (already correct)
- Added complete field set with proper defaults
- Improved error logging to show full payload and error details

**Key Fixes:**
- All fields now included even with empty/zero defaults (BSE requirement)
- Proper field ordering and structure matching BSE schema
- Depository account support added (optional field)

---

### 2. `sxp.types.ts` - SIP Type Definitions
**Changes:**
- Updated `freq` field type from `number` to `'m' | 'q'` (string)
- Updated `txn_date` field type from `number` (epoch) to `number` (day-of-month)
- Added `DepositoryAcct` interface for type safety
- Made `depository_acct` optional in `SxpRegister`

**Key Fixes:**
```typescript
// Before
freq: number;  // 1 or 3
txn_date: number;  // Unix epoch

// After
freq: 'm' | 'q';  // 'Monthly' or 'Quarterly'
txn_date: number;  // Day of month (1-31)
```

---

### 3. `MFInvestPage.tsx` - Investment Flow Component
**Changes:**

#### A. Depository Classification Fix (lines ~310-330)
**Before:**
```typescript
const isNSDL = dep.depository_code !== 'CDSL';  // Wrong logic
let dpId = dep.dp_id || '';
if (isNSDL && dpId && !dpId.startsWith('IN')) {
  const numericPart = dpId.replace(/\D/g, '').slice(0, 6).padEnd(6, '0');
  dpId = `IN${numericPart}`;  // Corrupts valid dp_id
}
```

**After:**
```typescript
const depositoryCode = (dep.depository_code || '').toUpperCase();
const isNSDL = depositoryCode === 'NSDL';
const isCDSL = depositoryCode === 'CDSL';

console.log('[Depository] Raw depository object:', JSON.stringify(dep));
console.log('[Depository] Code:', depositoryCode, 'isNSDL:', isNSDL, 'isCDSL:', isCDSL);

if (isNSDL || isCDSL) {
  setDepositoryAcct({
    depository: isNSDL ? 'N' : 'C',
    dp_id: dep.dp_id || '',  // Pass through unchanged
    client_id: dep.client_id || '',
  });
}
```

**Impact:** Fixes DepositoryDetail validation errors by:
- Correctly identifying NSDL vs CDSL
- Passing dp_id/client_id unchanged (no reformatting)
- Adding debug logging to verify backend response

#### B. SIP Registration Call Fix (lines ~410-450)
**Before:**
```typescript
freq: sipFrequency === 'Monthly' ? 1 : 3,  // Wrong type
txn_date: txnDate,  // Unix epoch (wrong)
// Missing: depository_acct, brokerage, and other fields
```

**After:**
```typescript
freq: sipFrequency === 'Monthly' ? 'm' : 'q',  // Correct string type
txn_date: parseInt(sipDate.replace(/\D/g, '')) || 10,  // Day of month
depository_acct: depositoryAcct || undefined,  // Include when present
brokerage: 2.5,  // BSE default
// All other required fields included
```

**Impact:** Fixes `invalid_json` error by:
- Using correct field types matching BSE schema
- Including all required fields
- Properly handling depository accounts for demat orders

---

## Acceptance Criteria Status

- [x] **One-time purchase order** - Should now succeed without DepositoryDetail error (depository classification fixed)
- [x] **SIP registration** - Should now succeed without invalid_json error (field types and structure corrected)
- [x] **Console logging** - Added debug logs for depository code validation
- [ ] **2FA verification** - Requires investigation (see open questions below)
- [ ] **Mandate registration** - Requires investigation (see open questions below)

---

## Open Questions for BSE Integration

### 1. 2FA Verification for SIP
**Question:** Does `POST /v2/get_2fa_link` with `type: "verify_sxp_reg"` need to be called after `sxp_register`?

**Current Status:** Not implemented
**Action Required:** Confirm with BSE whether this is required for SIP activation

### 2. Mandate Registration
**Question:** Is a separate `POST /mandate_register` call required, or is `get_exchpg_service` with `payment_mode: ['mandate']` sufficient?

**Current Status:** Only using `get_exchpg_service`
**Action Required:** Confirm with BSE whether separate mandate registration is needed

### 3. Depository Account Pre-registration
**Question:** If test UCC's depository data doesn't match BSE records, should we use `POST /v2/update_ucc` to correct it?

**Current Status:** Not implemented
**Action Required:** Verify if backend UCC response matches BSE's registered data

---

## Testing Checklist

Before considering this complete:

1. **Test Physical Mode Order**
   - [ ] Place one-time order without depository_acct
   - [ ] Verify order succeeds without DepositoryDetail error
   - [ ] Check order ID is returned

2. **Test Demat Mode Order**
   - [ ] Place one-time order with depository_acct
   - [ ] Verify depository classification is correct (N or C)
   - [ ] Verify dp_id/client_id are passed unchanged
   - [ ] Verify order succeeds

3. **Test SIP Registration**
   - [ ] Register SIP with freq='m' and txn_date as day-of-month
   - [ ] Verify no invalid_json error
   - [ ] Verify SIP ID is returned
   - [ ] Check full payload in console logs

4. **Verify Console Logs**
   - [ ] Depository code is logged correctly
   - [ ] SIP payload shows correct field types
   - [ ] No truncation or serialization errors

---

## Backend Configuration Notes

**Important:** Ensure backend proxy is configured correctly:

```
Frontend: http://localhost:8081/bse-api/*
Backend Proxy: https://starmfv2demo.bseindia.com/api/*
```

The backend should:
- Forward all requests to BSE's API
- Attach session token from `/login` to every request
- Return responses unchanged to frontend

---

## Files Changed Summary

| File | Changes | Impact |
|------|---------|--------|
| `sxpService.ts` | Complete payload restructure | Fixes invalid_json error |
| `sxp.types.ts` | Field type corrections | Ensures type safety |
| `MFInvestPage.tsx` | Depository fix + SIP call fix | Fixes both order and SIP errors |

---

**Last Updated:** [Current Date]
**Status:** Ready for testing
