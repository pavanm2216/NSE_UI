import NSENftUpdates from './NSENftUpdates';
import { NSEIcon, NSEButton, NSEHeading } from '../components/NSEPresentation';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';

type Item = { id: string; title: string; unavailable?: boolean };
const sections: Record<'admin' | 'clients' | 'reports', { title: string; items: Item[] }[]> = {
  admin: [
    { title: 'User administration', items: [
      { id: 'users', title: 'User Master', unavailable: true },
      { id: 'rights', title: 'Rights Management', unavailable: true },
      { id: 'user-report', title: 'User Master Report', unavailable: true },
    ] },
    { title: 'Account settings', items: [
      { id: 'secret', title: 'API credentials' },
    ] },
  ],
  clients: [
    { title: 'Investor account and verification', items: [
      { id: 'register', title: 'Register investor' },
      { id: 'profiles', title: 'Find registered investor' },
      { id: 'authorization', title: 'Check investor consent' },
      { id: 'kyc', title: 'Check KYC status' },
      { id: 'ekyc', title: 'Start online KYC' },
    ] },
    { title: 'Investor consent and signed forms', items: [
      { id: 'aof', title: 'Signed account form (AOF)' },
      { id: 'elog', title: 'Consent records (eLOG)' },
    ] },
    { title: 'Bank details and tax declarations', items: [
      { id: 'bank', title: 'Update bank details' },
      { id: 'fatca', title: 'Tax declaration (FATCA)' },
      { id: 'cheque', title: 'Cancelled cheque upload' },
      { id: 'poa', title: 'Power of attorney (POA)' },
    ] },
    { title: 'Nominees and other folio changes', items: [
      { id: 'nominees', title: 'Update nominees and folio details' },
    ] },
  ],
  reports: [
    { title: 'Client and compliance reports', items: [
      { id: 'client', title: 'Find registered investor' },
      { id: 'fatca', title: 'Tax declaration status (FATCA)' },
      { id: 'aof', title: 'AOF Image Upload Report' },
      { id: '2fa', title: 'Order authorization status (2FA)' },
      { id: 'authorization', title: 'Investor consent status' },
      { id: 'elog', title: 'eLOG Report' },
    ] },
    { title: 'Order reports', items: [
      { id: 'orders', title: 'Order status and received requests' },
      { id: 'transactions', title: 'Transaction details' },
      { id: 'lifecycle', title: 'Track authorization and payment' },
    ] },
    { title: 'Settlement and funds', items: [
      { id: 'allotment', title: 'Units allotted to your investments' },
      { id: 'redemption', title: 'Redemption Statement Report' },
      { id: 'payout', title: 'Redemption Payout Date Report' },
      { id: 'delivery', title: 'Security Delivery and Shortage Report' },
      { id: 'allocation', title: 'Member Fund Allocation Report' },
      { id: 'age', title: 'Agewise / Bankwise Funds Received Report' },
      { id: 'refund', title: 'Refund Report', unavailable: true },
    ] },
  ],
};

const descriptions: Record<string, string> = {
  register: 'New investor? Create your client code using your personal details, bank account and nominee information.',
  profiles: 'Start here if you already have a client code. Find your account, registered bank and any pending steps.',
  client: 'Check investor registration, onboarding remarks and returned client details.',
  authorization: 'Check holder consent, KYC, AOF/FATCA flags and bank status. Individual digital consent uses OTP authorization.',
  kyc: 'Check whether your identity verification is complete before you invest.',
  ekyc: 'Request an online identity-verification link. Complete the steps on that page, then check your KYC status again.',
  bank: 'Add or remove a registered bank. Mutual funds verification must complete before the bank is usable.',
  fatca: 'Complete tax-residency declarations or inspect CAMS/KFin processing. Signed-image upload applies to entities/HUFs.',
  aof: 'Upload a signed Account Opening Form when applicable, then check holder and RTA processing results.',
  elog: 'Check recorded holder consent and RTA status. Manual upload is only for existing recorded consent details.',
  cheque: 'Provide bank proof when verification fails; uploading proof does not immediately activate the account.',
  poa: 'Upload Power of Attorney evidence for an applicable POA registration.',
  nominees: 'Update existing folio nomination and other supported non-financial details.',
  secret: 'Manage the connected member API secret. Use only with the required account authority.',
  users: 'Create and manage member users. This feature is not connected in this portal.',
  rights: 'Manage access permissions. This feature is not connected in this portal.',
  'user-report': 'Review member users. This report is not connected in this portal.',
  orders: 'Use provisional results for received requests, and order status for the reported validity and remarks.',
  transactions: 'Find existing transactions and inspect their reported processing details.',
  lifecycle: 'Waiting for payment or processing? Check the authorization, payment, settlement and refund stages Mutual funds reports.',
  '2fa': 'Check which holders authenticated an order and when. This is separate from UCC onboarding consent.',
  sip: 'Find regular investment plan registrations, due installments and cancellations.',
  xsip: 'Find mandate-funded investment plans. Bank mandate approval and plan authorization are separate.',
  stp: 'Find scheduled transfers between mutual fund schemes.',
  swp: 'Find scheduled withdrawals and their installment or payout results.',
  allotment: 'Confirm allotted units, NAV and folio details. Order or payment success alone is not allotment.',
  redemption: 'Read processed redemption amounts, units and RTA results.',
  payout: 'Track redemption transfer dates, references and rejection remarks.',
  delivery: 'Check securities delivered, outstanding units and reported shortages.',
  allocation: 'Review how received funds were allocated against orders.',
  age: 'Review received funds by bank, client, scheme or ageing filters.',
  refund: 'Refund reporting is not connected here. Check returned lifecycle refund fields when available.',
};
export default function NSEWorkspaceSection({ section, onAction, selected }: {
  section: keyof typeof sections; onAction: (action: string) => void; selected?: string;
}) {
  const [reportGroup, setReportGroup] = useState('1');
  useEffect(() => { if (section !== 'reports' || !selected) return; const index = sections.reports.findIndex(group => group.items.some(item => item.id === selected)); if (index >= 0) setReportGroup(String(index)); }, [selected, section]);
  if (section === 'clients') {
    const tabs = [
      { id: 'account', title: 'Account & KYC', detail: 'Find or register an investor and check identity verification.', items: sections.clients[0].items.filter(item => item.id !== 'authorization') },
      { id: 'consent', title: 'Consent & forms', detail: 'Check investor consent and submit signed forms when required.', items: [sections.clients[0].items.find(item => item.id === 'authorization')!, ...sections.clients[1].items] },
      { id: 'bank', title: 'Bank & tax', detail: 'Manage bank accounts, tax declarations and supporting documents.', items: sections.clients[2].items },
      { id: 'nominees', title: 'Nominees', detail: 'Update nominees and other details for an existing folio.', items: sections.clients[3].items },
    ];
    return <Tabs defaultValue="account" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <TabsList aria-label="Investor detail sections" className="grid h-auto w-full grid-cols-2 gap-1 rounded-none border-b border-slate-200 bg-slate-50 p-2 sm:grid-cols-4">
        {tabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} className="whitespace-normal rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-[#102B78] data-[state=active]:shadow-sm">{tab.title}</TabsTrigger>)}
      </TabsList>
      {tabs.map(tab => <TabsContent key={tab.id} value={tab.id} className="m-0 p-4 sm:p-6">
        {tab.id !== 'nominees' && <p className="mb-5 text-sm leading-6 text-slate-500">{tab.detail}</p>}
        {tab.id === 'nominees' ? <NSENftUpdates embedded onClose={() => {}} /> : <>
        <div className="grid gap-3 md:grid-cols-2">{tab.items.map(item => <NSEButton key={item.id} type="button" onClick={() => onAction(item.id)} className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 px-4 py-4 text-left hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#102B78]"><NSEIcon label={item.title} className="h-5 w-5" /></span>
          <span className="min-w-0 flex-1 text-sm font-semibold leading-6 text-slate-800">{item.title}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#102B78]" />
        </NSEButton>)}</div></>}
      </TabsContent>)}
    </Tabs>;
  }
  if (section === 'reports') return <Tabs value={reportGroup} onValueChange={setReportGroup} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <TabsList aria-label="Report groups" className="grid h-auto w-full grid-cols-2 gap-1 rounded-none border-b border-slate-200 bg-slate-50 p-2 sm:grid-cols-3">
      {['Investors', 'Orders & payments', 'Units & payouts'].map((title, index) => <TabsTrigger key={title} value={String(index)} className="whitespace-normal rounded-xl px-3 py-3 text-sm font-semibold data-[state=active]:text-[#102B78]">{title}</TabsTrigger>)}
    </TabsList>
    {sections.reports.map((group, index) => <TabsContent key={group.title} value={String(index)} className="m-0 p-4 sm:p-5">
      <div className="flex flex-wrap gap-2">{group.items.map(item => <NSEButton key={item.id} type="button" disabled={item.unavailable} aria-pressed={selected === item.id} onClick={() => onAction(item.id)} className={'rounded-lg border px-3 py-2.5 text-left text-sm font-medium leading-5 disabled:opacity-40 ' + (selected === item.id ? 'border-[#102B78] bg-blue-50 text-[#102B78]' : 'border-slate-200 text-slate-600 hover:bg-slate-50')}>{item.title}</NSEButton>)}</div>
    </TabsContent>)}
  </Tabs>;
  return <div className="space-y-6">{sections[section].map(group => <section key={group.title} aria-label={group.title}>
    <NSEHeading as="h2" className="mb-3 text-lg font-bold text-slate-900">{group.title}</NSEHeading>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{group.items.map(item => <NSEButton key={item.id} type="button"
      disabled={item.unavailable} aria-label={item.title} aria-pressed={selected ? selected === item.id : undefined} onClick={() => onAction(item.id)}
      className={`flex flex-col rounded-xl border p-5 text-left transition-colors disabled:cursor-default disabled:bg-slate-50 ${selected === item.id ? 'border-[#102B78] bg-blue-50 ring-1 ring-[#102B78]' : 'border-slate-200 bg-white enabled:hover:border-[#4C85CF] enabled:hover:bg-blue-50'}`}>
      <span className="flex w-full items-start justify-between gap-3 text-sm font-semibold text-[#102B78]"><span className="inline-flex items-center gap-3"><span className="rounded-lg bg-blue-50 p-2.5"><NSEIcon label={item.title} className="h-5 w-5" /></span>{item.title}</span>{!item.unavailable && <ArrowRight className="h-4 w-4 shrink-0" />}</span>
      <span className="mt-3 text-sm font-normal leading-6 text-slate-500">{descriptions[item.id]}</span>
      {item.unavailable && <span className="mt-3 text-xs font-medium text-amber-800">Not yet connected</span>}
    </NSEButton>)}</div>
  </section>)}</div>;
}
