# Critical Missing APIs — Quick Build Checklist

## 🔴 MUST BUILD IMMEDIATELY (Blocks MVP)

### 1. Order Status Polling — `order_get`
**File to create:** `src/services/starmf/orderStatusService.ts`

```typescript
// Pseudo-code structure
export async function getOrder(orderId: number) {
  const { data } = await starmfApi.post('/order_get', {
    data: { id: orderId }
  });
  return data;
}

// Response shape (expected):
// {
//   "status": "success",
//   "data": {
//     "id": <order_id>,
//     "status": "accepted" | "rejected" | "pending",
//     "message": "...",
//     "orders": [{ ... }]
//   }
// }
```

**Where to call it:**
- `MFInvestPage.tsx` → After `placeOrder()` succeeds, poll `order_get()` every 2-3 seconds
- Show status in the "Processing" screen (buy-step-7)
- Update order status display in buy-step-8 success screen

**Why critical:** You currently assume order succeeds if `order_new` returns an ID. You have no way to confirm it actually processed.

---

### 2. Payment Status Polling — `get_bse_pg_payment_status`
**File to create:** `src/services/starmf/paymentStatusService.ts`

```typescript
// Pseudo-code structure
export async function getPaymentStatus(paymentRefId: string) {
  const { data } = await starmfApi.post('/get_bse_pg_payment_status', {
    data: { payment_ref_id: paymentRefId }
  });
  return data;
}

// Response shape (expected):
// {
//   "status": "success",
//   "data": {
//     "payment_ref_id": "...",
//     "payment_status": "success" | "failed" | "pending",
//     "message": "...",
//     "order_ids": [...]
//   }
// }
```

**Where to call it:**
- Create a `/payment-callback` route in your backend
- When user returns from BSE payment gateway, call this to confirm payment succeeded
- Update order/SIP status based on response

**Why critical:** You redirect to `payment_url` and assume success. You have no way to confirm payment actually completed. This is a **major security/reconciliation gap**.

---

### 3. SIP Status Polling — `sxp_get`
**File to create:** `src/services/starmf/sipStatusService.ts`

```typescript
// Pseudo-code structure
export async function getSip(sipId: number) {
  const { data } = await starmfApi.post('/sxp_get', {
    data: { id: sipId }
  });
  return data;
}

// Response shape (expected):
// {
//   "status": "success",
//   "data": {
//     "id": <sip_id>,
//     "status": "active" | "paused" | "cancelled",
//     "message": "...",
//     "sxp": { ... }
//   }
// }
```

**Where to call it:**
- `MFInvestPage.tsx` → After `registerSxp()` succeeds, poll `sxp_get()` every 2-3 seconds
- Show status in the "Processing" screen (buy-step-7)
- Update SIP status display in buy-step-8 success screen

**Why critical:** Same as `order_get` — you need to confirm SIP actually registered.

---

## 🟡 MUST RESOLVE (Unconfirmed Requirements)

### Question 1: Is 2FA `verify_sxp_reg` Mandatory?
**Action:** Contact BSE support

**Question:** After calling `POST /sxp_register`, do we need to immediately call `POST /v2/get_2fa_link` with `type: "verify_sxp_reg"` to activate the SIP?

**Impact:** If yes and you don't do it, SIP will silently fail to activate even though `sxp_register` returned success.

**If YES, implement:**
```typescript
// In sxpService.ts, after registerSxp() succeeds:
export async function verifySipRegistration(sipId: number, ucc: string) {
  const { data } = await starmfApi.post('/v2/get_2fa_link', {
    data: {
      type: 'verify_sxp_reg',
      id: sipId,
      investor: { ucc }
    }
  });
  return data;
}
```

---

### Question 2: Is `mandate_register` Mandatory?
**Action:** Contact BSE support

**Question:** For SIP mandates, is calling `POST /mandate_register` required, or is `POST /get_exchpg_service` with `payment_mode: ['mandate']` sufficient?

**Impact:** If yes and you don't do it, mandate setup will silently fail.

**If YES, implement:**
```typescript
// In mandateService.ts (new file):
export async function registerMandate(payload: MandateRegisterPayload) {
  const { data } = await starmfApi.post('/mandate_register', {
    data: payload
  });
  return data;
}
```

---

## 🟢 BUILD NEXT (After Critical APIs)

### 4. Order History — `order_list`
**File to create:** `src/services/starmf/orderStatusService.ts` (add to existing)

```typescript
export async function listOrders(filter = {}, start = 0, length = 50) {
  const { data } = await starmfApi.post('/order_list', {
    data: { fields: ['ALL'], start, length, filter_param: filter }
  });
  return data;
}
```

**Use case:** "My Orders" screen in portfolio

---

### 5. SIP History — `sxp_list`
**File to create:** `src/services/starmf/sipStatusService.ts` (add to existing)

```typescript
export async function listSips(filter = {}, start = 0, length = 50) {
  const { data } = await starmfApi.post('/sxp_list', {
    data: { fields: ['ALL'], start, length, filter_param: filter }
  });
  return data;
}
```

**Use case:** "My SIPs" screen in portfolio

---

### 6. Payment Reconciliation — `get_payment_detail`
**File to update:** `src/services/starmf/orderService.ts`

Already exported but unused:
```typescript
export async function getPaymentDetail(orderId: number) {
  try {
    const { data } = await starmfApi.post('/get_payment_detail', { data: { id: orderId } });
    return data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 400) {
      console.warn('Payment detail API returned 400');
    }
    throw error;
  }
}
```

**Wire it up:** Call this after `order_get` to reconcile order ↔ payment

---

## Implementation Order

```
Week 1:
  Day 1-2: Verify Phase 3 & 4 fixes
  Day 3-4: Build order_get + integrate into MFInvestPage
  Day 5: Build get_bse_pg_payment_status + payment callback route

Week 2:
  Day 1-2: Resolve 2 unconfirmed items with BSE
  Day 3-4: Build sxp_get + integrate into MFInvestPage
  Day 5: Build order_list + sxp_list for portfolio screens

Week 3:
  Day 1-2: Wire up get_payment_detail for reconciliation
  Day 3-5: Testing, bug fixes, edge cases
```

---

## Testing Each API

### Test `order_get`
```bash
# After placing an order, call:
POST /order_get
{
  "data": {
    "id": <order_id_from_order_new>
  }
}

# Expected response:
{
  "status": "success",
  "data": {
    "id": <order_id>,
    "status": "accepted",  # or "pending", "rejected"
    "message": "Order accepted"
  }
}
```

### Test `get_bse_pg_payment_status`
```bash
# After payment redirect, call:
POST /get_bse_pg_payment_status
{
  "data": {
    "payment_ref_id": <payment_ref_from_initiatePayment>
  }
}

# Expected response:
{
  "status": "success",
  "data": {
    "payment_status": "success",  # or "failed", "pending"
    "order_ids": [<order_id>]
  }
}
```

### Test `sxp_get`
```bash
# After registering SIP, call:
POST /sxp_get
{
  "data": {
    "id": <sip_id_from_registerSxp>
  }
}

# Expected response:
{
  "status": "success",
  "data": {
    "id": <sip_id>,
    "status": "active",  # or "paused", "cancelled"
    "message": "SIP active"
  }
}
```

---

## Checklist

- [ ] Phase 3 fix verified (one-time order with demat UCC)
- [ ] Phase 4 fix verified (SIP registration)
- [ ] `order_get` built and tested
- [ ] `get_bse_pg_payment_status` built and tested
- [ ] Payment callback route created
- [ ] 2FA `verify_sxp_reg` requirement confirmed with BSE
- [ ] `mandate_register` requirement confirmed with BSE
- [ ] `sxp_get` built and tested
- [ ] `order_list` built and tested
- [ ] `sxp_list` built and tested
- [ ] `get_payment_detail` wired up and tested
- [ ] End-to-end flow tested (browse → buy → track)

---

**Priority:** 🔴 CRITICAL — Do not ship MVP without these APIs
