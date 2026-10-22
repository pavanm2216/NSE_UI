import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NSEButton } from './NSEPresentation';

const pages: Record<string, { title: string; steps: string[]; note: string; actions: [string, string][] }> = {
  clients: { title: 'Prepare your investor account', steps: ['Find your investor record, or register if you are new.', 'Complete KYC, tax declarations and investor consent.', 'Check that your registered bank is active.'], note: 'Already registered? Find your record first to see what needs attention.', actions: [['profiles', 'Find my investor record'], ['register', 'Register a new investor']] },
  explore: { title: 'Make an investment', steps: ['Search for a fund and check its minimum investment.', 'Choose Buy for a one-time investment, or SIP to invest regularly.', 'Review your details, then complete the authorization and payment steps Mutual funds requests.'], note: 'An accepted order still needs payment and unit allotment before the purchase is complete.', actions: [['profiles', 'Check my investor details']] },
  mandates: { title: 'Set up automatic bank payments', steps: ['Search with your client code for an existing mandate.', 'Register a mandate only if no suitable one exists.', 'Complete bank authorization and refresh until approval is confirmed.'], note: 'A mandate lets your bank collect up to an agreed limit. Registration alone does not authorize a debit.', actions: [['plans', 'Go to my investment plans']] },
  sips: { title: 'Manage your regular investments', steps: ['Choose the type of plan below.', 'Search registered plans using your client code.', 'View upcoming installments or manage the matching plan.'], note: 'To start a plan, choose a fund first. Automatic collections also need an approved bank mandate and applicable mapping.', actions: [['funds', 'Choose a fund for a new plan'], ['mandates', 'Check my bank auto-debit']] },
  orders: { title: 'Follow orders placed during this visit', steps: ['Find the order reference below.', 'Read the latest status and any action requested.', 'Check live processing and confirmed units using the links here.'], note: 'This list covers the current visit. Use Transactions to find requests from earlier visits.', actions: [['transactions', 'Find earlier transactions'], ['lifecycle', 'Track authorization and payment'], ['allotment', 'Check my allotted units']] },
  transactions: { title: 'Find an existing transaction', steps: ['Choose the dates when you made the request.', 'Enter your client code or order reference.', 'Load the results and read the status and remarks.'], note: 'If you need payment or authorization details, check order processing. A valid order does not confirm payment.', actions: [['lifecycle', 'Track authorization and payment'], ['allotment', 'Check my allotted units']] },
  investments: { title: 'Check the units you received', steps: ['Choose the transaction date range.', 'Enter your client code or order ID to narrow the results.', 'Load the statement and check the units, NAV and folio.'], note: 'These statements show transaction allotments. They do not show a current portfolio valuation.', actions: [['lifecycle', 'Track an order awaiting units']] },
  reports: { title: 'Find the answer you need', steps: ['Choose a report below for the question you have.', 'Enter the dates and investor or order reference.', 'Load the report and read the returned status and remarks.'], note: 'Use order processing for payment and authorization, and unit allotments for confirmed units.', actions: [['lifecycle', 'Check authorization or payment'], ['allotment', 'Check allotted units'], ['authorization', 'Check investor readiness']] },
};

export default function NSEPageHelp({ page, onAction }: { page: string; onAction: (action: string) => void }) {
  const help = pages[page];
  if (!help) return null;
  return <section aria-label="What to do on this page" className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-5">
    <h2 className="text-base font-semibold text-[#102B78]">{help.title}</h2>
    <ol className="mt-4 grid gap-4 lg:grid-cols-3">{help.steps.map((step, index) => <li key={step} className="flex min-w-0 items-start gap-3 text-sm leading-6 text-slate-700"><span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#102B78]">{index + 1}</span><span>{step}</span></li>)}</ol>
    <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-500">{help.note}</p>
    <div className="mt-4 flex flex-wrap gap-3">{help.actions.map(([action, label]) => <NSEButton key={action} type="button" onClick={() => onAction(action)} className="max-w-full rounded-lg border border-blue-200 px-3 py-2 text-left text-sm font-semibold leading-5 text-[#102B78] hover:bg-blue-50">{label}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></NSEButton>)}</div>
  </section>;
}
