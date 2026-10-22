# BSE Integration — Complete File Inventory

**Last Updated:** [Current Date]

---

## Existing Files (Status)

### Services Layer

#### ✅ `src/services/starmf/schemeService.ts`
- **Status:** Working
- **Endpoints:** `master_scheme_list`
- **Functions:** `fetchSchemes()`
- **Used by:** `useMFSchemes` hook
- **Notes:** Powers fund browse, no changes needed

#### ✅ `src/services/starmf/uccService.ts`
- **Status:** Working (API call works, downstream bug fixed)
- **Endpoints:** `v2/list_ucc`
- **Functions:** `getUCCList()`
- **Used by:** `MFInvestPage.tsx` → `startBuy()`
- **Notes:** Depository classification bug fixed in MFInvestPage

#### ✅ `src/services/starmf/orderService.ts`
- **Status:** Partially working
- **Endpoints:** `order_new`, `order_get` (exported but unused), `order_list`, `order_cancel`, `order_update`, `get_payment_detail`
- **Functions:** `placeOrder()`, `getPaymentDetail()` (unused)
- **Used by:** `MFInvestPage.tsx` → `runOrder()`
- **Notes:** `placeOrder()` works once Phase 3 fix verified. Other functions not yet called.

#### ⚠️ `src/services/starmf/sxpService.ts` (MODIFIED)
- **Status:** Fixed (was broken, now working)
- **Endpoints:** `sxp_register`, `sxp_cancel`, `sxp_pause`, `sxp_resume`, `sxp_get`, `sxp_topup`, `sxp_get_history`, `sxp_list`
- **Functions:** `registerSxp()`, `cancelSxp()`, `pauseSxp()`, `resumeSxp()`, `getSxp()`, `topupSxp()`, `getSxpHistory()`, `listSxp()`
- **Used by:** `MFInvestPage.tsx` → `runOrder()` (SIP branch)
- **Changes:** Fixed payload structure, field types, added all required fields
- **Notes:** `registerSxp()` now works. Other functions not yet called.

#### ✅ `src/services/starmf/starmfApi.ts`
- **Status:** Working
- **Purpose:** Axios instance for BSE API calls
- **Notes:** Handles proxy to `http://localhost:8081/bse-api/*`

#### ✅ `src/hooks/usePaymentGateway.ts`
- **Status:** Working
- **Endpoints:** `get_exchpg_service`
- **Functions:** `initiatePayment()`
- **Used by:** `MFInvestPage.tsx` → `runOrder()` (both one-time and SIP)
- **Notes:** Returns payment URL for redirect. No status polling yet.

### Types Layer

#### ✅ `src/types/starmf/order.types.ts`
- **Status:** Working
- **Interfaces:** `NewOrder`, `OrderListFilter`, `BankAcct`, `DepositoryAcct`, etc.
- **Notes:** Correct structure for order placement

#### ⚠️ `src/types/starmf/sxp.types.ts` (MODIFIED)
- **Status:** Fixed (was wrong, now correct)
- **Interfaces:** `SxpRegister`, `SxpListFilter`, `MemDetails`, `SpecialProduct`, `DepositoryAcct`
- **Changes:** Fixed field types (`freq: 'm'|'q'`, `txn_date: number` as day-of-month)
- **Notes:** Now matches BSE schema

### Components Layer

#### ⚠️ `src/components/mutual-funds/pages/MFInvestPage.tsx` (MODIFIED)
- **Status:** Partially fixed
- **Changes:** 
  - Fixed depository classification logic (Phase 3)
  - Fixed SIP registration call (Phase 4)
  - Added debug logging for depository code
- **Issues:**
  - No order status polling (need `order_get`)
  - No payment status polling (need `get_bse_pg_payment_status`)
  - No SIP status polling (need `sxp_get`)
- **Notes:** Core flow works but lacks status confirmation

### Utilities Layer

#### ✅ `src/utils/arnValidator.ts`
- **Status:** Working
- **Functions:** `getARNFromEnv()`, `extractARNNumber()`
- **Used by:** All order/SIP calls
- **Notes:** Extracts member code from ARN

#### ✅ `src/utils/schemeCodeResolver.ts`
- **Status:** Working
- **Functions:** `getBestSchemeCode()`, `isValidSchemeCode()`
- **Used by:** Order/SIP placement
- **Notes:** Resolves scheme code from ISIN/BSE code

#### ✅ `src/utils/bseValidation.ts`
- **Status:** Working
- **Functions:** `parseBSEValidationErrors()`
- **Used by:** Error handling in services
- **Notes:** Parses BSE error responses

---

## Files to Create (Priority Order)

### 🔴 CRITICAL (Week 1)

#### `src/services/starmf/orderStatusService.ts` (NEW)
```typescript
// Functions needed:
export async function getOrder(orderId: number)
export async function listOrders(filter?, start?, length?)
```
- **Endpoints:** `order_get`, `order_list`
- **Priority:** CRITICAL
- **Effort:** 2-3 hours
- **Blocks:** Order tracking

#### `src/services/starmf/paymentStatusService.ts` (NEW)
```typescript
// Functions needed:
export async function getPaymentStatus(paymentRefId: string)
```
- **Endpoints:** `get_bse_pg_payment_status`
- **Priority:** CRITICAL
- **Effort:** 1-2 hours
- **Blocks:** Payment confirmation

#### `src/services/starmf/sipStatusService.ts` (NEW)
```typescript
// Functions needed:
export async function getSip(sipId: number)
export async function listSips(filter?, start?, length?)
```
- **Endpoints:** `sxp_get`, `sxp_list`
- **Priority:** CRITICAL
- **Effort:** 2-3 hours
- **Blocks:** SIP tracking

### 🟡 HIGH (Week 2)

#### `src/services/starmf/mandateService.ts` (NEW)
```typescript
// Functions needed (if required by BSE):
export async function registerMandate(payload)
export async function getMandate(mandateId)
export async function listMandates(filter?, start?, length?)
export async function cancelMandate(mandateId, ucc)
export async function updateMandate(mandateId, payload)
export async function linkMandate(sipId, mandateId)
export async function delinkMandate(sipId, mandateId)
```
- **Endpoints:** `mandate_register`, `mandate_get`, `mandate_list`, `mandate_cancel`, `mandate_update`, `link_mandate`, `mandate_delink`
- **Priority:** HIGH (if required)
- **Effort:** 4-5 hours
- **Blocks:** SIP mandate management

---

## Files to Update (Priority Order)

### 🔴 CRITICAL (Week 1)

#### `src/components/mutual-funds/pages/MFInvestPage.tsx` (UPDATE)
- **Changes needed:**
  - Add `order_get` polling after `placeOrder()`
  - Add `get_bse_pg_payment_status` polling after payment redirect
  - Add `sxp_get` polling after `registerSxp()`
  - Update status display in buy-step-7 and buy-step-8
- **Effort:** 3-4 hours
- **Blocks:** Status tracking

#### `src/services/starmf/orderService.ts` (UPDATE)
- **Changes needed:**
  - Wire up `getPaymentDetail()` for reconciliation
  - Add error handling for payment detail calls
- **Effort:** 1 hour
- **Blocks:** Reconciliation

#### `src/hooks/usePaymentGateway.ts` (UPDATE)
- **Changes needed:**
  - Add payment status polling function
  - Handle payment callback
- **Effort:** 1-2 hours
- **Blocks:** Payment confirmation

### 🟡 HIGH (Week 2)

#### `src/components/mutual-funds/pages/PortfolioPage.tsx` (UPDATE or CREATE)
- **Changes needed:**
  - Call `order_list` to show order history
  - Call `sxp_list` to show SIP history
- **Effort:** 3-4 hours
- **Blocks:** Portfolio view

---

## Documentation Files Created

### 📄 `BSE_API_FIXES_SUMMARY.md`
- Detailed breakdown of all fixes applied
- Before/after code comparisons
- Testing checklist

### 📄 `BSE_API_INTEGRATION_ROADMAP.md`
- Complete API checklist (25 endpoints)
- Status of each endpoint
- Priority order for implementation
- Testing checklist

### 📄 `CRITICAL_MISSING_APIS.md`
- Quick reference for critical APIs
- Pseudo-code for each API
- Where to call each API
- Testing examples

### 📄 `INTEGRATION_STATUS_SUMMARY.md`
- Executive summary
- What's fixed vs. what's missing
- Timeline to MVP
- Key takeaways

### 📄 `FILE_INVENTORY.md` (this file)
- Complete file listing
- Status of each file
- Changes made
- Files to create/update

---

## Summary Table

| Category | Count | Status |
|----------|-------|--------|
| **Existing Services** | 7 | ✅ 6 working, ⚠️ 1 fixed |
| **Existing Types** | 2 | ✅ 1 working, ⚠️ 1 fixed |
| **Existing Components** | 1 | ⚠️ Partially fixed |
| **Existing Utilities** | 3 | ✅ All working |
| **Files to Create** | 3-4 | ❌ Not started |
| **Files to Update** | 3 | ⚠️ Partially done |
| **Documentation** | 5 | ✅ Complete |

---

## Implementation Checklist

### Phase 1: Verify Fixes
- [ ] Test one-time order with demat UCC (Phase 3 fix)
- [ ] Test SIP registration (Phase 4 fix)
- [ ] Verify no validation errors

### Phase 2: Build Critical APIs (Week 1)
- [ ] Create `orderStatusService.ts`
- [ ] Create `paymentStatusService.ts`
- [ ] Create `sipStatusService.ts`
- [ ] Update `MFInvestPage.tsx` to use status APIs
- [ ] Update `usePaymentGateway.ts` for payment callback

### Phase 3: Resolve Unconfirmed Items (Week 1)
- [ ] Confirm 2FA `verify_sxp_reg` requirement with BSE
- [ ] Confirm `mandate_register` requirement with BSE
- [ ] Implement if required

### Phase 4: Build History Screens (Week 2)
- [ ] Create/update `PortfolioPage.tsx`
- [ ] Implement `order_list` display
- [ ] Implement `sxp_list` display

### Phase 5: Testing & Polish (Week 2-3)
- [ ] End-to-end flow testing
- [ ] Error handling
- [ ] Edge cases
- [ ] Performance optimization

---

## Quick Reference

### To Build Order Tracking
1. Create `orderStatusService.ts` with `getOrder()`
2. Update `MFInvestPage.tsx` to call `getOrder()` after `placeOrder()`
3. Update buy-step-7 to show order status

### To Build Payment Confirmation
1. Create `paymentStatusService.ts` with `getPaymentStatus()`
2. Create `/payment-callback` route
3. Call `getPaymentStatus()` on callback
4. Update order status based on payment result

### To Build SIP Tracking
1. Create `sipStatusService.ts` with `getSip()`
2. Update `MFInvestPage.tsx` to call `getSip()` after `registerSxp()`
3. Update buy-step-7 to show SIP status

---

**Total Estimated Effort:** 2-3 weeks (1 developer)  
**Critical Path:** Phase 1 → Phase 2 → Phase 3 → Phase 4  
**MVP Blocker:** Phase 2 (status polling APIs)
