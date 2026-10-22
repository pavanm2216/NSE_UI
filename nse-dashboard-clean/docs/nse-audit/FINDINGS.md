# NSE document comparison

Reviewed against `NSE_MF_WebfileStructure.pdf` on 19 October 2026. The [page index](PAGE_COVERAGE.md) maps all 201 pages to 72 overlapping sections. [page-coverage.json](page-coverage.json) contains the extracted text for every page and corresponding source references.

**The application does not yet implement every documented field and option.** This review establishes section coverage and the concrete discrepancies below. It does not certify complete field-by-field equivalence for every report or a successful live NSE submission. A component existing, or an API accepting a property, is insufficient evidence of document compliance.

## Confirmed gaps

| PDF pages | Area / field | Document requirement | Current implementation / action needed |
| --- | --- | --- | --- |
| 4–7 | User Master, User Master Report, Rights Management | User details, access level and associated report | Unavailable in Admin navigation. Implement forms, permissions and supported endpoints. |
| 7–22 | Client Master | 183-column format, including conditional holder, guardian, bank and nomination fields | Registration supports a resident adult individual, single holding, physical account, one savings/current bank, one adult nominee or authenticated opt-out. Joint holders, minors, NRI, demat and additional banks/nominees are not enabled. Listing master options does not implement these profiles. |
| 34–50 | NFE Category | References a category master | Complete referenced master is absent from this PDF. Obtain the authoritative table; current explicit code input cannot be described as a complete dropdown. |
| 57 | Purchase scheme code | Up to 30 characters | `nseOrderService.ts` limits to 20. Confirm the API contract before widening. |
| 58 | Purchase optional details | Sub-broker, ARN, mobile, email, mandate and remarks fields | Purchase builder sends these blank or fixed rather than collecting all values. `dpc_flag` is fixed to `Y`; verify provider behavior for each mode. |
| 58, 84, 109–110 | EUIN | Field length 10; purchase description requires E followed by digits | Several builders enforce exactly E plus six digits. This is stricter than the supplied table; confirm the current authoritative EUIN rule before changing it. |
| 85–87, 90–93 | SIP / XSIP registration with step-up | Additional step-up registration fields | Shared registration builder fixes `step_up_required` to `N` and step-up values blank. Reports and top-up tools are separate features; they do not supply this registration form. |
| 79–83, 83–93 | Scheme-specific SIP/XSIP eligibility | Frequency, dates, amount increments, gaps and installment limits from masters | Shared frequency options exist, but full scheme-specific local validation is not established. Provider validation remains necessary. |
| 88 | Mandate type and amount | Type wording includes `/N/E` and is unclear; amount size 8 | UI offers X/E and a substantially larger amount range. Confirm API-to-file type mapping and numeric semantics; do not infer equivalence. |
| 108–109 | STP folio | 20 characters | Builder limits to 15. |
| 109 | STP remarks | 100 characters | Builder allows 200. |
| 109 | STP optional distributor fields | Sub-broker code 15, ARN 20 | Builder sends both blank; form does not collect them. |
| 109 | STP amount | Numeric 12,2 | Builder permits 13 integer digits plus two decimal digits. Reconcile precision interpretation and provider schema. |
| 109–110 | SWP scheme / folio | Scheme 30, folio 20 | Builder limits to 20 / 15. |
| 110 | SWP remarks / distributor fields | Remarks 100; sub-broker code 15; ARN 20 | Builder allows remarks 200 and sends distributor fields blank. |
| 110 | SWP amount / units | Numeric 12,2 / 12,3 | Builder allows 10 integer amount digits / nine integer unit digits. Confirm whether document sizes include fractional digits before altering these limits. |
| 121–122 | Refund report | Dedicated refund output | Unavailable in Reports navigation. Lifecycle refund fields do not replace this report. |
| 129–136 | Client Registration Report | Full documented registration output | Navigation opens investor profiles with returned scalar details. Complete equivalence of the profile endpoint to the PDF report is unverified. |
| 147–201 | NFT nominees | 192 fields extending through nominee 10 | Nominee request builder accepts only counts 1–3. Nominees 4–10 are unsupported. |
| 147–201 | NFT guardian relationship | One-character relationship field | Free code entry remains. The two-character UCC relationship master cannot be copied without an authoritative mapping. |
| 197 | Nominee 10 Aadhaar identity | Text says last 10 digits, unlike last four in earlier nominee fields | Document inconsistency requiring clarification. Do not extend the form by repeating the first nominee without checking this. |

## Options already configured

The existing [options audit](../../NSE_DOCUMENT_OPTIONS_AUDIT.md) and `src/data/nseDocumentMasters.json` describe 21 document master tables. These include occupation, tax status, holding nature, account type, nominee/guardian relationships, contact declarations, countries, states and FATCA classifications. Client and FATCA code domains intentionally remain separate.

SIP/XSIP/STP offer Weekly, Monthly, Quarterly, Semi-annually, Annually and Daily. SWP offers Daily, Weekly, Monthly and Quarterly. SIP/XSIP cancellation reasons are configured. Switch uses C/N/P and the documented physical amount-or-units / demat units rules. Dynamic schemes, folios, mandates and settlement identifiers require provider data.

## Reports and API verification still required

Report pages are classified `report-review` in the page index because the existence of a report component does not establish every output column. Some components display selected fields; investor profiles and master previews also expose returned details. A provider response must be compared with the document columns before claiming full coverage. Missing response fields cannot be corrected with dropdown options.

API builders and endpoint wiring exist for multiple forms. This review did not send a real order, registration, mandate or folio update. Acceptance, KYC verification, mandate approval, payment, execution and allotment are separate results.

This audit changes documentation only. It leaves the identified implementation work visible rather than marking it complete.
