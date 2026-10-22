# NSE dashboard workflow

The dashboard opens on Client Management. Use the sidebar to open mandates, funds, systematic plans, transactions, reports, session orders and allotment statements.

## Navigating the investment flow

1. Find an existing investor before creating a UCC. Check KYC, registered bank, FATCA and applicable holder consent/documents.
2. Find or register a mandate when the collection route needs one. Confirm approval, validity and limit from its report.
3. Select a scheme in Funds & masters and open Buy, SIP, XSIP, switch, STP or SWP as applicable.
4. Review before submitting. For existing systematic plans, use Systematic Plans for authorization, mandate mapping, modifications, pauses, top-ups and cancellations.
5. For a newly accepted purchase, use Continue to payment within its result. Session orders records this visit; live order reports retrieve exchange records separately.
6. Check the final payment, allotment or payout report. Registration, mandate approval, order acceptance, payment and allotment describe separate events.

## Troubleshooting

- Processing mandate: refresh its report after authorization. Neither the success page nor UMRN establishes bank approval.
- Rejected SIP start date: follow NSE's earliest date and scheme restrictions. The portal does not invent a universal lead time.
- Cancellation blocked by processing order: check registration, installment and cancellation reports. An empty order report does not remove the restriction.
- Missing order: check the client, range, product and reference type. SIP IDs and mandate IDs are not exchange order IDs.

## Validation

Dashboard navigation and existing transaction forms are covered by mocked tests. No live order, payment, cancellation or communication is executed by navigating between sections.
