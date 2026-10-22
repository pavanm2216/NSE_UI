# UCC registration review against the supplied PDF

Reviewed: 20 October 2026.

Subsequent implementation update: the resident/single/physical restriction below has been removed. Both frontends now collect conditional additional-holder, guardian, demat, foreign-address, PAN-exemption and entity LEI fields and preserve the selected account types in the request. The original coverage findings below describe the pre-expansion baseline. See `NSE_UCC_UI_FIELD_COVERAGE.md` for the current inventory. Banks 2–5 and minor nominees remain unimplemented; the deployed nomination opt-out API contract issue remains unresolved.

Source: `NSE_MF_WebfileStructure.pdf`, Client Master Common, pages 7–22; related master tables, pages 22–26 and 60–70. The document describes a bulk-upload file format. The application submits JSON through a separate API adapter, so file columns and JSON property names are not interchangeable specifications.

Compared both frontend copies: `src/` and `nse-dashboard/src/`, including `NSEUccRegistration.tsx`, `nseUccDraftService.ts`, `nseUccRegistrationService.ts`, and `nseDocumentMasters.json`. Also checked the saved API schema in `nse-dashboard/nse-openapi.json` and the rejection supplied in this conversation.

## Main finding

The form implements a subset of Client Master Common: a resident adult individual, single holding, physical/non-demat account, non-exempt PAN, one default bank, and up to three adult nominees or nomination opt-out. Selecting another category does not implement that category; the UI blocks continuation and the request builder rejects unsupported profiles.

## Coverage gaps

| Area | PDF requirement / capability | Current implementation |
| --- | --- | --- |
| Investor categories | 59 tax statuses, pages 22–24 | Lists the statuses, but only `01` can be submitted. |
| Joint / anyone-or-survivor | `JO` / `AS`, with additional holder names, DOB, PAN/exemption, KYC and contact declarations; pages 7–9, 14–16 | Only `SI`; additional-holder fields are not collected or mapped. |
| Minor investors | Guardian names, DOB, PAN/exemption, KYC and relationship; pages 8–9, 14–16 | Adult-only DOB validation; guardian registration unavailable. |
| Demat | `D`, PMS flag, default DP and conditional CDSL/NSDL identifiers; page 10 | Only `P`; demat fields unavailable. |
| NRI | Conditional foreign address and contact requirements; pages 12–14 | India-only profile; foreign-address fields unavailable. |
| PAN exemption | Exemption flag, category and KRA reference; pages 8–9, 14–15 | Requires PAN and sends exemption `N`. |
| Banks | Up to five bank accounts, conditional identifiers and default flags; pages 10–12 | One savings/current account, always marked default. |
| Nominees | Up to three nominees, allocation percentages and minor/guardian details; pages 16–21 | Up to three adult nominees with add/remove controls and shares totaling 100%; minor/guardian fields remain unavailable. The second nominee name follows the PDF's 10-character limit on page 18. |

These are product coverage gaps, not evidence that the restricted resident-individual request is invalid.

## Differences requiring care

1. **Country is an API-specific mapping.** Page 12 refers to the country master; that master lists `101` for India on pages 61–70. The live API rejected that value with `COUNTRY MUST BE 'INDIA'`. Keep the form's master value `101` and the registration request's `country: "INDIA"`. Do not revert the fix based solely on the file specification, or apply this mapping to FATCA.

2. **Address lines 2 and 3 are always required by the form.** Page 12 marks them conditionally mandatory, but does not state the triggering condition in the extracted table. `nseUccDraftService.ts` requires both for every supported registration. Confirm the API condition before relaxing validation.

3. **Bank account validation is stricter than the PDF.** Page 10 defines account number as `VARCHAR(40)`; the draft validator permits digits only. The PDF does not establish this numeric-only rule. Confirm the API's accepted character set before changing it.

4. **Opt-out reference is rejected by the deployed API.** PDF column 176 requires an OTP/video reference when nomination is `N` (page 21). The builder sends `nominee_opt_out_ref_no`, but the saved `UCCDetail` schema has no explicit property with that name. The user subsequently reported a deployed validation rejection: `reg_details.0.nominee_opt_out_ref_no: Extra inputs are not permitted`. The saved schema's additional-property allowance does not match that deployed behavior. The upstream backend must declare a reference field with a maximum length of 20, require it for opt-out, and map it to column 176. The local server is only a forwarding proxy. Frontend error handling now explains this contract mismatch; it does not remove the required reference or retry automatically.

5. **The PDF has ambiguities relevant to expanding the form.** On page 12, address fields have size 120 while remarks specify 1–40 characters; the current 40-character limit follows the remarks. The additional-holder and nominee 2/3 DOB/guardian conditions also need backend confirmation before implementing those profiles. Do not infer missing conditions from the simplified form.

## Confirmed matches

- Verified every stored code/label pair against the relevant PDF pages for tax status (59), occupation (8), holding nature (3), bank account type (4), contact declaration (9), state (37), and client country (243).
- Primary-holder name limits of 70, client code limit of 10, PAN length of 10, bank account maximum of 40, IFSC maximum of 11, and MICR maximum of 9 match the field tables.
- DOB is converted from the form date to `DD/MM/YYYY`.
- Gender, dividend payment, communication, KYC, onboarding, and nomination authentication codes agree with the field tables.
- CKYC is required when KYC type is `C`; the form uses the documented 14-character limit.
- Nominee identity type codes, PAN/Aadhaar validation, and identity/contact/address length limits follow pages 17–18.
- Nomination `Y` supports `W/E/O`; opt-out `N` supports `O/V` and requires a reference.
- Optional primary-holder middle/last names, MICR, and nominee address lines 2/3 are optional in the UI.
- The builder maps form nominee identity/pincode names to the JSON API's `nominee_1_identity_number` and `nominee_1_pin`; it excludes confirmation controls and registration response fields.

## Verification limits

This was a document and source-code review. No live registration was submitted. Code-master agreement does not prove backend acceptance. The supplied PDF does not define the JSON endpoint's response-status semantics, persistence guarantees, or every backend validation rule.

The initial review did not change registration behavior. A subsequent multi-nominee enhancement adds up to three adult nominees, validates every nominee, maps each indexed API field and checks allocation totals using hundredths of a percent. Removing a nominee clears its submitted details; opting out clears all nominee slots. The remaining work for full document coverage is conditional field collection, request mapping and validation for the unsupported profiles, followed by API contract verification.
