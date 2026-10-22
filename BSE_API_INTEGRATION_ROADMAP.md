# BSE STAR MF API Integration Roadmap
## Lendrix Ventech MF App — Complete API Checklist

**Last Updated:** [Current Date]  
**Scope:** Investment journey only (browse → buy one-time → buy SIP → track)  
**Total Endpoints in BSE Collection:** 93  
**Endpoints Your App Actually Needs:** ~25  

---

## Legend
- ✅ **Integrated & Working** — Code exists, API calls succeed
- ⚠️ **Integrated but Broken** — Code exists, API calls fail (needs fix)
- ❌ **Not Integrated** — No code, needs to be built
- 🔲 **Optional/Later** — Not required for MVP, defer to Phase 2+
- ❓ **Unconfirmed** — Unclear if required; needs BSE clarification

---

## PHASE 1 — Auth & Data (Foundation)

### 1.1 Login
| Property | Value |
|----------|-------|
| Endpoint | `POST /login` |
| Status | ❌ **Unclear** |
| File | Backend proxy (not shown) |
| Required | ✅ Yes |
| Notes | Your frontend calls `/bse-api/*` which proxies to BSE. Confirm backend: (1) handles `/login`, (2) stores session token, (3) attaches token to every downstream request. **Critical blocker if not working.** |

### 1.2 Master Scheme List
| Property | Value |
|----------|-------|
| Endpoint | `POST /master_scheme_list` |
| Status | ✅ Working |
| File | `schemeService.ts` → `fetchSchemes()` |
| Required | ✅ Yes |
| Notes | Powers your AMC/fund browse. Returns all schemes across all AMCs. Working correctly. |

### 1.3 List UCC (Investor Lookup)
| Property | Value |
|----------|-------|
| Endpoint | `POST /v2/list_ucc` |
| Status | ⚠️ **Partially Working** |
| File | `uccService.ts` → `getUCCList()` |
| Required | ✅ Yes |
| Notes | API call works. **BUT** downstream code in `MFInvestPage.tsx` misreads the `depository_code` field. See Phase 3 blocker. |

### 1.4 Get UCC (Optional Variant)
| Property | Value |
|----------|-------|
| Endpoint | `POST /v2/get_ucc` |
| Status | 🔲 Not needed yet |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Alternative to `list_ucc` — use when you know the investor's UCC upfront. Current flow always fetches "first investor" via `list_ucc`. Defer. |

---

## PHASE 2 — One-Time Order Placement

### 2.1 Place Order
| Property | Value |
|----------|-------|
| Endpoint | `POST /order_new` |
| Status | ⚠️ **Broken (depository bug)** |
| File | `orderService.ts` → `placeOrder()` |
| Required | ✅ Yes |
| Notes | Payload structure is correct. Fails only due to Phase 3 depository classification bug. **No code change needed here** — fix Phase 3 first. |

### 2.2 Get Order (Poll Status)
| Property | Value |
|----------|-------|
| Endpoint | `POST /order_get` |
| Status | ❌ Not implemented |
| File | Not implemented |
| Required | ✅ **Yes (critical)** |
| Notes | **You are currently blind to order status.** After `order_new` succeeds, you assume the order is placed. You have no way to confirm it actually processed. Build this to poll order status after submission. |

### 2.3 List Orders (History)
| Property | Value |
|----------|-------|
| Endpoint | `POST /order_list` |
| Status | ❌ Not implemented |
| File | Not implemented |
| Required | ✅ **Yes (for "My Orders" screen)** |
| Notes | Needed for order history / portfolio view. Not in current flow but essential for production. |

### 2.4 Cancel Order
| Property | Value |
|----------|-------|
| Endpoint | `POST /order_cancel` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Only if you plan to let users cancel pending orders. Defer to Phase 2+. |

### 2.5 Update Order
| Property | Value |
|----------|-------|
| Endpoint | `POST /order_update` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Only if you plan to let users amend pending orders (e.g., change amount). Defer. |

---

## PHASE 3 — CRITICAL BLOCKER (Fix Before Anything Else)

### 3.1 Depository Classification Bug
| Property | Value |
|----------|-------|
| Issue | `depository_code` from `list_ucc` is misread in `MFInvestPage.tsx` |
| Location | `MFInvestPage.tsx` → `startBuy()` → depository account setup |
| Impact | **Blocks Phase 2 (one-time orders) AND Phase 4 (SIPs)** |
| Status | ⚠️ **FIXED in prior commit** |
| Fix Applied | Correct depository classification logic, pass dp_id/client_id unchanged, add debug logging |
| Verification | Test one-time order with demat UCC — should not get `DepositoryDetail` validation error |

---

## PHASE 4 — SIP (Recurring Investment)

### 4.1 Register SIP
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_register` |
| Status | ⚠️ **Broken (invalid_json)** |
| File | `sxpService.ts` → `registerSxp()` |
| Required | ✅ Yes |
| Notes | Payload structure was wrong. **FIXED in prior commit** — now includes all required fields, correct field types (`freq: 'm'/'q'`, `txn_date` as day-of-month). |

### 4.2 Verify SIP Registration (2FA)
| Property | Value |
|----------|-------|
| Endpoint | `POST /v2/get_2fa_link` (with `type: "verify_sxp_reg"`) |
| Status | ❓ **Unconfirmed if required** |
| File | Not implemented |
| Required | ❓ **Unknown** |
| Notes | **ACTION REQUIRED:** Confirm with BSE whether this 2FA step is mandatory after `sxp_register` or optional. If mandatory, SIP flow will silently fail without it. |

### 4.3 Get SIP (Poll Status)
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_get` |
| Status | ❌ Not implemented |
| File | Not implemented |
| Required | ✅ **Yes (critical)** |
| Notes | Same as `order_get` — you need to confirm SIP actually registered. Build this to poll SIP status after `sxp_register`. |

### 4.4 List SIPs (History)
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_list` |
| Status | ❌ Not implemented |
| File | Not implemented |
| Required | ✅ **Yes (for "My SIPs" screen)** |
| Notes | Needed for SIP history / portfolio view. Essential for production. |

### 4.5 Cancel SIP
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_cancel` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Only if you let users stop a SIP. Defer. |

### 4.6 Pause / Resume SIP
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_set_pause` / `POST /sxp_resume` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Nice-to-have for user control. Defer. |

### 4.7 Top-up SIP
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_topup` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Increase SIP amount without re-registering. Defer. |

### 4.8 SIP History
| Property | Value |
|----------|-------|
| Endpoint | `POST /sxp_get_history` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Installment-by-installment history. Defer. |

---

## PHASE 5 — Payments

### 5.1 Initiate Payment Gateway
| Property | Value |
|----------|-------|
| Endpoint | `POST /get_exchpg_service` |
| Status | ✅ Working |
| File | `usePaymentGateway.ts` → `initiatePayment()` |
| Required | ✅ Yes |
| Notes | Called from both one-time and SIP flows. Returns `payment_url` for redirect. Working correctly. |

### 5.2 Payment Status (Poll After Redirect)
| Property | Value |
|----------|-------|
| Endpoint | `POST /get_bse_pg_payment_status` |
| Status | ❌ **Not implemented** |
| File | Not implemented |
| Required | ✅ **Yes (critical)** |
| Notes | **You are currently blind to payment success.** After redirecting to `payment_url`, you have no way to confirm payment completed. Build this to poll payment status on your `/payment-callback` route. **This is a critical gap.** |

### 5.3 Send Payment Info (Direct Submission)
| Property | Value |
|----------|-------|
| Endpoint | `POST /send_payment_info` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Alternative to hosted gateway — submit UPI/bank details directly instead of redirecting. Defer. |

### 5.4 Mandate Register
| Property | Value |
|----------|-------|
| Endpoint | `POST /mandate_register` |
| Status | ❓ **Unconfirmed if required** |
| File | Not implemented |
| Required | ❓ **Unknown** |
| Notes | **ACTION REQUIRED:** Confirm with BSE whether this is needed for SIP mandates or if `get_exchpg_service` with `payment_mode: ['mandate']` is sufficient. |

### 5.5 Mandate Management (Get / List / Cancel / Update)
| Property | Value |
|----------|-------|
| Endpoint | `mandate_get` / `mandate_list` / `mandate_cancel` / `mandate_update` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Needed once users can view/manage SIP mandates. Defer. |

### 5.6 Link / Delink Mandate
| Property | Value |
|----------|-------|
| Endpoint | `link_mandate` / `mandate_delink` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Only if you support reusing one mandate across multiple SIPs. Defer. |

---

## PHASE 6 — Reconciliation

### 6.1 Get Payment Detail
| Property | Value |
|----------|-------|
| Endpoint | `POST /get_payment_detail` |
| Status | ❌ Not implemented (but exported in `orderService.ts`) |
| File | `orderService.ts` → `getPaymentDetail()` (defined but unused) |
| Required | ✅ **Yes (for reconciliation)** |
| Notes | Reconcile order ↔ payment. Check if already wired up elsewhere; if not, build this. |

### 6.2 List Payment Detail
| Property | Value |
|----------|-------|
| Endpoint | `POST /list_payment_detail` |
| Status | 🔲 Optional |
| File | Not implemented |
| Required | ❌ No (for MVP) |
| Notes | Bulk reconciliation / admin view. Defer. |

---

## PHASE 7 — Not Needed for Current App (Skip)

| API | Why Skip |
|---|---|
| `ucc_csv_runner`, `v2/add_ucc` (14 variants), `v2/update_ucc` (13 variants), `deactivate_ucc` | Investor onboarding — you rely on pre-existing UCCs, not creating/editing in-app. |
| `v2/get_kyc_link` | Only needed if you build in-app KYC completion; currently just a static badge. |
| `nft_bank_account_change`, `nft_nominee_change`, `nft_contact_change` | Non-financial transaction changes — not part of buy/SIP flow. |
| `nav_master_list` | Only needed for NAV-based portfolio valuation; your holdings are hardcoded. |
| 2FA variants (other than `verify_sxp_reg`) | Each pairs with features not yet built (nominee mgmt, e-login, mandate cancel, order cancel). |

---

## Implementation Priority (Next Steps)

### 🔴 CRITICAL (Do First)
1. **Verify Phase 3 fix** — Test one-time order with demat UCC, confirm no `DepositoryDetail` error
2. **Verify Phase 4 fix** — Test SIP registration, confirm no `invalid_json` error
3. **Build `order_get`** — Poll order status after `order_new` submission
4. **Build `get_bse_pg_payment_status`** — Poll payment status after redirect (currently flying blind)
5. **Resolve 2 unconfirmed items:**
   - Is `verify_sxp_reg` 2FA mandatory for SIP?
   - Is `mandate_register` mandatory or is `get_exchpg_service` sufficient?

### 🟡 HIGH (Do Next)
6. **Build `sxp_get`** — Poll SIP status after `sxp_register` submission
7. **Build `order_list`** — Order history screen
8. **Build `sxp_list`** — SIP history screen
9. **Build `get_payment_detail`** — Reconciliation (already exported, just needs wiring)

### 🟢 MEDIUM (Phase 2+)
10. Order/SIP cancellation UI (if needed)
11. Mandate management UI (if needed)
12. NAV-based portfolio valuation (if needed)

---

## Files to Create / Modify

### New Files Needed
```
src/services/starmf/
├── orderStatusService.ts          (NEW) — order_get, order_list
├── sipStatusService.ts            (NEW) — sxp_get, sxp_list
├── paymentStatusService.ts        (NEW) — get_bse_pg_payment_status
└── mandateService.ts              (NEW) — mandate_register, mandate_get, etc.
```

### Existing Files to Update
```
src/services/starmf/
├── orderService.ts                (UPDATE) — wire up getPaymentDetail()
├── usePaymentGateway.ts           (UPDATE) — add payment status polling
└── MFInvestPage.tsx               (UPDATE) — call order_get / sxp_get after submission
```

---

## Testing Checklist

- [ ] **Phase 3 Fix Verified**
  - [ ] One-time order with demat UCC succeeds
  - [ ] No `DepositoryDetail` validation error
  - [ ] Depository code logged correctly (N or C)

- [ ] **Phase 4 Fix Verified**
  - [ ] SIP registration succeeds
  - [ ] No `invalid_json` error
  - [ ] SIP ID returned in response

- [ ] **Phase 5 Critical**
  - [ ] `order_get` built and tested
  - [ ] `get_bse_pg_payment_status` built and tested
  - [ ] Payment callback route handles status polling

- [ ] **Unconfirmed Items Resolved**
  - [ ] 2FA `verify_sxp_reg` requirement confirmed with BSE
  - [ ] `mandate_register` requirement confirmed with BSE

---

## Backend Proxy Configuration (Verify)

Ensure your backend proxy is set up correctly:

```
Frontend Request:  http://localhost:8081/bse-api/order_new
Backend Proxy:     https://starmfv2demo.bseindia.com/api/order_new

Requirements:
1. Session token from /login is stored
2. Token is attached to every downstream request
3. Responses are returned unchanged to frontend
4. CORS headers are set correctly
```

---

## Summary

| Phase | Status | Blocker? | Action |
|-------|--------|----------|--------|
| 1 (Auth & Data) | ✅ Mostly working | ⚠️ Verify login | Confirm backend proxy handles login & token |
| 2 (One-Time Orders) | ⚠️ Broken | 🔴 YES | Fix Phase 3 first, then build `order_get` |
| 3 (Depository Bug) | ⚠️ Fixed | 🔴 YES | Verify fix works with test order |
| 4 (SIP) | ⚠️ Broken | 🔴 YES | Fix payload, resolve 2 unconfirmed items, build `sxp_get` |
| 5 (Payments) | ⚠️ Partial | 🔴 YES | Build `get_bse_pg_payment_status` (critical gap) |
| 6 (Reconciliation) | ❌ Not built | 🟡 NO | Build after Phase 5 |
| 7 (Advanced) | 🔲 Deferred | ⚠️ NO | Defer to Phase 2+ |

**Estimated effort to MVP:** 2–3 weeks (assuming 1 dev, Phase 3 fix + Phase 5 critical APIs)

---

**Document Version:** 1.0  
**Last Reviewed:** [Current Date]  
**Next Review:** After Phase 3 & 4 fixes are verified
