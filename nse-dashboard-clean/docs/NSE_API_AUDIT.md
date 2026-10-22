# NSE API implementation audit

Reviewed 21 October 2026 against the user-provided API list and local source. No live financial or credential-changing calls were executed. A service call or passing mocked test does not prove upstream acceptance.

85 listed endpoints: 85 allowed by the Express proxy, 83 referenced by frontend services, 2 missing or mismatched.

## Findings

1. API secret: the documented `/admin/change-api-secret` is not called. The screen asks for passwords and calls `/auth/change-password`, which is absent from both this API list and the Express allowlist. The local OpenAPI describes a bearer-authenticated request without a body, returning `api_secret`. This is a different operation.
2. Fresh KYC: `/registration/kyc-fresh-register` has no frontend service call. `/ekyc/register` is implemented but is a separate endpoint.
3. Purchase authorization: the communication service supports `PUR`, but the buy wizard only offers purchase payment. Holder-link UI calls exist for client consent and mandates, not purchase orders. The manual get-link step used in Swagger is not integrated into the buy wizard.
4. UPI tracking: the status endpoint exists, but the payment response type has no NSE UPI reference and the UI requires manual entry. No automatic reference retrieval is implemented.
5. Netbanking: no dedicated status API is listed. The order lifecycle screen includes payment status, payment time and reference fields; order-status is also available. My earlier advice mentioning only order-status was incomplete.
6. SIP listing: session records are stored in React state. My plans fetches the NSE registration report. Neither is a complete database attempt-history screen.
7. Physical first purchase: the current builder requires a folio even for FRESH physical orders. The supplied response retained the literal placeholder FOLIO_NUMBER. Acceptance does not prove that placeholder is valid; confirm the first-purchase contract with the provider.
8. Schema differences exist in the supplied live examples: SIP cancellation returns can_data despite the displayed reg_data example. The cancellation service already handles both arrays and rejects CAN_FAILED.
9. Purchase payment rejected with status Fail despite HTTP 200; the payment service correctly treats this as failure.
10. The Vite development proxy calls the upstream directly, while the Express proxy uses an allowlist. Production and development routes must both be validated.

## Live evidence supplied by the user

- Order entry: TRXN SUCCESS with an order ID, not payment or allotment confirmation.
- Order status: VALID with PAYMENT CONFIRMATION PENDING and zero quantity.
- Purchase payment: Fail, with an order-state restriction; successful payment not demonstrated.
- Purchase get-link: holder URL returned; completion not demonstrated.
- SIP registration: REG_SUCCESS in supplied database row; no mandate ID in that row.
- SIP cancellation: CAN_FAILED because an order was under processing; cancellation not demonstrated.

## Endpoint inventory

All paths below have an Express proxy allowlist entry. ?Call present? establishes source coverage only, not complete UI coverage or live validation.

| Endpoint | Frontend service files | Source coverage |
|---|---|---|
| `/api/v1/auth/login` | `nseApi.ts` | Call present |
| `/api/v1/ucc/register` | `nseApi.ts` | Call present |
| `/api/v1/order/entry` | `nseApi.ts` | Call present |
| `/api/v1/switch/entry` | `nseApi.ts`, `nseSwitchService.ts` | Call present |
| `/api/v1/xsip/register` | `nseApi.ts` | Call present |
| `/api/v1/sip-topup/register` | `nseTopupService.ts` | Call present |
| `/api/v1/sip/register` | `nseApi.ts` | Call present |
| `/api/v1/sip/umrn-mapping` | `nseApi.ts` | Call present |
| `/api/v1/stp/register` | `nseApi.ts` | Call present |
| `/api/v1/swp/register` | `nseApi.ts` | Call present |
| `/api/v1/order-cancellation/cancel` | `nseOrderCancellationService.ts` | Call present |
| `/api/v1/sip-cancellation/cancel` | `nseSipCancellationService.ts` | Call present |
| `/api/v1/xsip-cancellation/cancel` | `nseXsipCancellationService.ts` | Call present |
| `/api/v1/daily-xsip-cancellation/cancel` | `nseDailyXsipCancellationService.ts` | Call present |
| `/api/v1/stp-cancellation/cancel` | `nseStpCancellationService.ts` | Call present |
| `/api/v1/client-bank-detail/update` | `nseApi.ts`, `nseBankUpdateService.ts` | Call present |
| `/api/v1/mandate/register` | `nseApi.ts` | Call present |
| `/api/v1/mandate/image-upload` | `nseMandateImageService.ts` | Call present |
| `/api/v1/utr/update` | `nseApi.ts`, `nseUtrService.ts` | Call present |
| `/api/v1/reports/provisional-orders` | `nseApi.ts` | Call present |
| `/api/v1/reports/order-status` | `nseApi.ts` | Call present |
| `/api/v1/reports/mandate-status` | `nseApi.ts` | Call present |
| `/api/v1/communication/get-link` | `nseApi.ts` | Call present |
| `/api/v1/communication/resend` | `nseCommunicationService.ts` | Call present |
| `/api/v1/fatca/upload` | `nseFatcaDataService.ts` | Call present |
| `/api/v1/fatca/common-upload` | `nseApi.ts`, `nseFatcaCommonService.ts` | Call present |
| `/api/v1/aof/image-upload` | `nseAofUploadService.ts` | Call present |
| `/api/v1/fatca/image-upload` | `nseFatcaUploadService.ts` | Call present |
| `/api/v1/elog/upload` | `nseApi.ts`, `nseElogUploadService.ts` | Call present |
| `/api/v1/poa/upload` | `nsePoaService.ts` | Call present |
| `/api/v1/cancel-cheque/upload` | `nseChequeUploadService.ts` | Call present |
| `/api/v1/reports/member-fund-allocation/order-wise` | `nseFundAllocationService.ts` | Call present |
| `/api/v1/reports/member-fund-allocation/age-wise` | `nseFundAgeService.ts` | Call present |
| `/api/v1/reports/redemption-payout` | `nsePayoutService.ts` | Call present |
| `/api/v1/reports/redemption-payout-non-demat` | `nsePayoutService.ts` | Call present |
| `/api/v1/reports/redemption-statement` | `nseApi.ts` | Call present |
| `/api/v1/reports/allotment-statement` | `nseApi.ts` | Call present |
| `/api/v1/reports/securities-delivery-shortage` | `nseDeliveryService.ts` | Call present |
| `/api/v1/reports/2fa` | `nseTwoFaService.ts` | Call present |
| `/api/v1/reports/client-authorization` | `nseClientAuthorizationService.ts` | Call present |
| `/api/v1/reports/client-detail` | `nseClientDetailService.ts` | Call present |
| `/api/v1/reports/order-lifecycle` | `nseLifecycleService.ts` | Call present |
| `/api/v1/reports/transaction-detail` | `nseTransactionService.ts` | Call present |
| `/api/v1/reports/fatca` | `nseFatcaReportService.ts` | Call present |
| `/api/v1/reports/aof-image-upload` | `nseAofReportService.ts` | Call present |
| `/api/v1/reports/elog-upload` | `nseElogReportService.ts` | Call present |
| `/api/v1/reports/sip-registration` | `nseApi.ts` | Call present |
| `/api/v1/reports/sip-cancellation` | `nseApi.ts` | Call present |
| `/api/v1/reports/sip-installment-due` | `nseApi.ts` | Call present |
| `/api/v1/reports/sip-topup` | `nseApi.ts` | Call present |
| `/api/v1/reports/stepup-registration` | `nseStepupReportService.ts` | Call present |
| `/api/v1/reports/xsip-registration` | `nseApi.ts` | Call present |
| `/api/v1/reports/xsip-cancellation` | `nseApi.ts` | Call present |
| `/api/v1/reports/xsip-installment-due` | `nseApi.ts` | Call present |
| `/api/v1/reports/xsip-topup` | `nseApi.ts` | Call present |
| `/api/v1/reports/stp-registration` | `nseApi.ts` | Call present |
| `/api/v1/reports/stp-cancellation` | `nseApi.ts` | Call present |
| `/api/v1/reports/stp-installment-due` | `nseApi.ts` | Call present |
| `/api/v1/reports/swp-registration` | `nseApi.ts` | Call present |
| `/api/v1/reports/swp-cancellation` | `nseApi.ts` | Call present |
| `/api/v1/reports/swp-installment-due` | `nseApi.ts` | Call present |
| `/api/v1/reports/master-download` | `nseApi.ts` | Call present |
| `/api/v1/reports/client-kyc` | `nseApi.ts` | Call present |
| `/api/v1/ekyc/register` | `nseEkycService.ts` | Call present |
| `/api/v1/payments/purchase` | `nseApi.ts` | Call present |
| `/api/v1/payments/upi-status` | `nseApi.ts` | Call present |
| `/api/v1/cancellation/swp` | `nseSwpCancellationService.ts` | Call present |
| `/api/v1/registration/sip-xsip-pause` | `nseSipPauseService.ts` | Call present |
| `/api/v1/reports/client-master` | `nseApi.ts` | Call present |
| `/api/v1/admin/change-api-secret` | None | Mismatched password-change operation |
| `/api/v1/nft/nominee` | `nseNftNomineeService.ts` | Call present |
| `/api/v1/nft/change-of-bank` | `nseNftBankService.ts` | Call present |
| `/api/v1/nft/change-of-dividend` | `nseNftAdditionalService.ts` | Call present |
| `/api/v1/nft/change-of-broker` | `nseNftAdditionalService.ts` | Call present |
| `/api/v1/nft/change-of-contact` | `nseNftContactService.ts` | Call present |
| `/api/v1/nft/consolidation-of-folio` | `nseNftAdditionalService.ts` | Call present |
| `/api/v1/nft/change-of-bank-single` | `nseNftSingleBankService.ts` | Call present |
| `/api/v1/nft/image-upload` | `nseNftImageService.ts` | Call present |
| `/api/v1/modification/sip` | `nseSipModificationService.ts` | Call present |
| `/api/v1/modification/xsip` | `nseXsipModificationService.ts` | Call present |
| `/api/v1/registration/kyc-fresh-register` | None | Missing |
| `/api/v1/stp-modification/modify` | `nseApi.ts`, `nseStpModificationService.ts` | Call present |
| `/api/v1/swp-modification/modify` | `nseApi.ts`, `nseSwpModificationService.ts` | Call present |
| `/api/v1/sip-amc-pause/pause` | `nseAmcPauseService.ts` | Call present |
| `/api/v1/sip-amc-pause/report` | `nseAmcPauseService.ts` | Call present |

## Static type check

Repository TypeScript diagnostics: 162. NSE-related diagnostics: 5.
- `src/services/nseApi.test.ts`: Property 'message' does not exist on type 'unknown'.
- `src/services/nseApi.test.ts`: Property 'message' does not exist on type 'unknown'.
- `src/services/nseApi.test.ts`: Property 'message' does not exist on type 'unknown'.
- `src/services/nseApi.test.ts`: Property 'message' does not exist on type 'unknown'.
- `src/services/nseSchemeService.ts`: A type predicate's type must be assignable to its parameter's type.   Type 'NSEScheme' is not assignable to type '{ id: string; schemeCode: string; name: string; amc: string; amcCode: string; isin: string; category: string; subcategory: string; plan: string; active: boolean; purchaseAllowed: boolean; sipAllowed: boolean; ... 6 more ...; settlementType: string; }'.     Property 'switchAllowed' is optional in type 'NSEScheme' but required in type '{ id: string; schemeCode: string; name: string; amc: string; amcCode: string; isin: string; category: string; subcategory: string; plan: string; active: boolean; purchaseAllowed: boolean; sipAllowed: boolean; ... 6 more ...; settlementType: string; }'.

## Recommended completion order

1. Add purchase holder-authorization links and status checks to the accepted-order screen; keep authorization, payment and allotment separate.
2. Correct the API-secret screen contract without triggering rotation during testing.
3. Add fresh KYC service and UI using its distinct request/response schema.
4. Establish the documented source of NSE UPI references and persist payment reconciliation state.
5. Confirm first-purchase folio rules with the API provider and reject literal placeholder values.
6. Exercise successful sandbox authorization, payment, reconciliation and allotment; separately verify mandate approval/mapping and SIP installments.

This audit does not certify every request field against upstream business rules: most pasted entries are endpoint names rather than full field specifications. The local OpenAPI provides shapes, but often only declares strings without permissible business values.

## Automated verification

541 passed tests; 0 failed; 0 pending. 175 passed suites; 0 failed suites. Tests use mocked responses. The default SWC native binding is unavailable in this environment; the audit used a temporary TypeScript-transpilation test configuration, removed after execution.
