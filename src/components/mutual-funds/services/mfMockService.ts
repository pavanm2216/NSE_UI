export type InvestmentType = 'lumpsum' | 'sip';
export type PaymentMethod = 'upi' | 'netbanking' | 'bank';
export type MandateStatus = 'pending' | 'authorized' | 'registered' | 'failed';

export interface AMCInfo {
  id: string;
  name: string;
  logo: string;
  funds: number;
  aum: string;
  category: string;
  rating: number;
}

export interface FundInfo {
  id: string;
  name: string;
  amcId: string;
  category: string;
  plan: string;
  option: string;
  risk: 'Low' | 'Moderate' | 'High' | 'Very High';
  nav: string;
  minInvestment: string;
  minSip: string;
  aum: string;
  expenseRatio: string;
  exitLoad: string;
  fundAge: string;
  benchmark: string;
  returns: { '1Y': string; '3Y': string; '5Y': string; '10Y': string };
}

export interface PortfolioSummary {
  invested: string;
  currentValue: string;
  profit: string;
  returns: string;
  totalUnits: string;
  nav: string;
  avgReturn: string;
}

export interface Holding {
  id: string;
  fundName: string;
  amc: string;
  invested: string;
  currentValue: string;
  profit: string;
  units: string;
  nav: string;
  returnPct: string;
  risk: string;
}

export interface SIPPlan {
  id: string;
  fundName: string;
  amount: string;
  nextDate: string;
  frequency: string;
  mandate: string;
  status: string;
  startDate: string;
  installments: string;
  completed: string;
  currentValue: string;
}

export interface TransactionRow {
  id: string;
  date: string;
  fund: string;
  type: string;
  amount: string;
  status: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Savings' | 'Current';
  last4: string;
  ifsc: string;
  label: string;
  primary?: boolean;
}

export interface InvestorProfile {
  fullName: string;
  pan: string;
  dob: string;
  email: string;
  mobile: string;
  address: string;
  kycVerified: boolean;
  kycStatus: 'verified' | 'action_required';
}

export interface OrderSummary {
  orderId: string;
  transactionId: string;
  amc: string;
  fund: string;
  type: InvestmentType;
  amount: string;
  status: string;
  sipAmount?: string;
  sipDate?: string;
  mandate?: string;
  createdAt: string;
}

export interface OrderDetails extends OrderSummary {
  orderStatus: string;
  paymentStatus: string;
  units: string;
  nav: string;
  orderDate: string;
  settlementStatus: string;
}

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

const AMCS: AMCInfo[] = [
  { id: 'icici', name: 'ICICI Prudential', logo: '🟣', funds: 28, aum: '₹3,82,000 Cr', category: 'Large', rating: 4.8 },
  { id: 'hdfc', name: 'HDFC Mutual Fund', logo: '🔶', funds: 34, aum: '₹4,18,000 Cr', category: 'Large', rating: 4.7 },
  { id: 'sbi', name: 'SBI Mutual Fund', logo: '🔵', funds: 30, aum: '₹3,10,000 Cr', category: 'Large', rating: 4.6 },
  { id: 'axis', name: 'Axis Mutual Fund', logo: '🟦', funds: 22, aum: '₹2,20,000 Cr', category: 'Large', rating: 4.5 },
  { id: 'nippon', name: 'Nippon India', logo: '🔴', funds: 25, aum: '₹2,50,000 Cr', category: 'Large', rating: 4.4 },
  { id: 'mirae', name: 'Mirae Asset', logo: '🌏', funds: 18, aum: '₹1,74,000 Cr', category: 'Large', rating: 4.5 },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🟡', funds: 20, aum: '₹2,02,000 Cr', category: 'Large', rating: 4.3 },
  { id: 'tata', name: 'Tata Mutual Fund', logo: '🟢', funds: 16, aum: '₹1,12,000 Cr', category: 'Large', rating: 4.2 },
  { id: 'uti', name: 'UTI Mutual Fund', logo: '🟣', funds: 24, aum: '₹2,08,000 Cr', category: 'Large', rating: 4.2 },
  { id: 'aditya', name: 'Aditya Birla Sun Life', logo: '🌞', funds: 32, aum: '₹3,40,000 Cr', category: 'Large', rating: 4.7 },
];

const FUNDS: FundInfo[] = [
  {
    id: 'icici-bluechip', amcId: 'icici', name: 'ICICI Prudential Bluechip Fund', category: 'Large Cap', plan: 'Direct', option: 'Growth', risk: 'Very High', nav: '₹74.12', minInvestment: '₹100', minSip: '₹500', aum: '₹41,900 Cr', expenseRatio: '0.68%', exitLoad: '2% within 30 days', fundAge: '14 years', benchmark: 'NIFTY 100 TRI', returns: { '1Y': '18.42%', '3Y': '16.73%', '5Y': '19.12%', '10Y': '16.90%' },
  },
  {
    id: 'icici-value-discovery', amcId: 'icici', name: 'ICICI Prudential Value Discovery Fund', category: 'Mid Cap', plan: 'Direct', option: 'Growth', risk: 'Very High', nav: '₹96.35', minInvestment: '₹100', minSip: '₹500', aum: '₹18,200 Cr', expenseRatio: '1.05%', exitLoad: '1% within 1 year', fundAge: '8 years', benchmark: 'NIFTY Midcap 150 TRI', returns: { '1Y': '32.00%', '3Y': '21.30%', '5Y': '24.10%', '10Y': '18.50%' },
  },
  {
    id: 'hdfc-top100', amcId: 'hdfc', name: 'HDFC Top 100 Fund', category: 'Large Cap', plan: 'Direct', option: 'Growth', risk: 'High', nav: '₹1,024.50', minInvestment: '₹100', minSip: '₹500', aum: '₹32,450 Cr', expenseRatio: '0.65%', exitLoad: '0.25% within 30 days', fundAge: '18 years', benchmark: 'NIFTY 100 TRI', returns: { '1Y': '17.20%', '3Y': '13.80%', '5Y': '15.10%', '10Y': '13.40%' },
  },
  {
    id: 'sbi-bluechip', amcId: 'sbi', name: 'SBI Bluechip Fund', category: 'Large Cap', plan: 'Direct', option: 'Growth', risk: 'Moderate', nav: '₹72.40', minInvestment: '₹100', minSip: '₹500', aum: '₹42,100 Cr', expenseRatio: '0.62%', exitLoad: '0.25% within 30 days', fundAge: '17 years', benchmark: 'NIFTY 100 TRI', returns: { '1Y': '16.80%', '3Y': '13.20%', '5Y': '14.50%', '10Y': '13.20%' },
  },
  {
    id: 'axis-long-term-equity', amcId: 'axis', name: 'Axis Long Term Equity Fund', category: 'ELSS', plan: 'Direct', option: 'Growth', risk: 'Very High', nav: '₹175.80', minInvestment: '₹100', minSip: '₹500', aum: '₹18,700 Cr', expenseRatio: '0.82%', exitLoad: '1% within 1 year', fundAge: '10 years', benchmark: 'NIFTY 500 TRI', returns: { '1Y': '23.40%', '3Y': '20.10%', '5Y': '22.80%', '10Y': '18.80%' },
  },
  {
    id: 'mirae-largecap', amcId: 'mirae', name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', plan: 'Direct', option: 'Growth', risk: 'Moderate', nav: '₹98.45', minInvestment: '₹100', minSip: '₹500', aum: '₹32,450 Cr', expenseRatio: '0.50%', exitLoad: '0.25% within 30 days', fundAge: '8 years', benchmark: 'NIFTY 100 TRI', returns: { '1Y': '18.40%', '3Y': '14.20%', '5Y': '16.10%', '10Y': '14.70%' },
  },
];

const PORTFOLIO_SUMMARY: PortfolioSummary = {
  invested: '₹2,50,000',
  currentValue: '₹2,76,500',
  profit: '₹26,500',
  returns: '10.60%',
  totalUnits: '2,349.82',
  nav: '₹117.77',
  avgReturn: '10.4%',
};

const HOLDINGS: Holding[] = [
  { id: 'holding-1', fundName: 'ICICI Prudential Bluechip Fund', amc: 'ICICI Prudential', invested: '₹10,000', currentValue: '₹10,250', profit: '₹250', units: '134.01', nav: '₹76.45', returnPct: '+2.50%', risk: 'Very High' },
  { id: 'holding-2', fundName: 'HDFC Top 100 Fund', amc: 'HDFC Mutual Fund', invested: '₹30,000', currentValue: '₹33,300', profit: '₹3,300', units: '324.11', nav: '₹102.85', returnPct: '+11.00%', risk: 'High' },
  { id: 'holding-3', fundName: 'SBI Bluechip Fund', amc: 'SBI Mutual Fund', invested: '₹20,000', currentValue: '₹21,400', profit: '₹1,400', units: '296.43', nav: '₹72.20', returnPct: '+7.00%', risk: 'Moderate' },
];

const SIPS: SIPPlan[] = [
  { id: 'sip-1', fundName: 'ICICI Prudential Bluechip Fund', amount: '₹5,000 / month', nextDate: '10 Aug 2026', frequency: 'Monthly', mandate: 'Active', status: 'Running', startDate: '10 Feb 2025', installments: '24', completed: '14', currentValue: '₹2,68,000' },
  { id: 'sip-2', fundName: 'HDFC Top 100 Fund', amount: '₹3,000 / month', nextDate: '15 Aug 2026', frequency: 'Monthly', mandate: 'Active', status: 'Running', startDate: '15 Jan 2025', installments: '18', completed: '13', currentValue: '₹1,05,500' },
];

const TRANSACTIONS: TransactionRow[] = [
  { id: 'TXN202608080001', date: '08 Aug 2026', fund: 'ICICI Prudential Bluechip Fund', type: 'Purchase', amount: '₹10,000', status: 'Successful' },
  { id: 'TXN202608050002', date: '05 Aug 2026', fund: 'Axis Long Term Equity Fund', type: 'SIP', amount: '₹5,000', status: 'Successful' },
  { id: 'TXN202607280003', date: '28 Jul 2026', fund: 'HDFC Top 100 Fund', type: 'Purchase', amount: '₹15,000', status: 'Successful' },
  { id: 'TXN202607150004', date: '15 Jul 2026', fund: 'SBI Bluechip Fund', type: 'SIP', amount: '₹5,000', status: 'Successful' },
];

const BANK_ACCOUNTS: BankAccount[] = [
  { id: 'bank-1', name: 'HDFC Bank', type: 'Savings', last4: '4582', ifsc: 'HDFC0001234', label: 'Primary Account', primary: true },
  { id: 'bank-2', name: 'ICICI Bank', type: 'Savings', last4: '7621', ifsc: 'ICIC0007621', label: 'Secondary Account' },
];

const INVESTOR_PROFILE: InvestorProfile = {
  fullName: 'Arjun Patel',
  pan: 'ABCDE1234F',
  dob: '15 Jun 1990',
  email: 'arjun.patel@example.com',
  mobile: '+91 98765 43210',
  address: 'Flat 402, Sunrise Towers, Andheri East, Mumbai, 400069',
  kycVerified: true,
  kycStatus: 'verified',
};

let ORDERS: OrderDetails[] = [
  {
    orderId: 'BSE202608080001',
    transactionId: 'TXN202608080001',
    amc: 'ICICI Prudential Mutual Fund',
    fund: 'ICICI Prudential Bluechip Fund',
    type: 'lumpsum',
    amount: '₹10,000',
    status: 'Order Submitted',
    sipAmount: undefined,
    sipDate: undefined,
    mandate: undefined,
    createdAt: '08 Aug 2026',
    orderStatus: 'Submitted',
    paymentStatus: 'Successful',
    units: '134.01',
    nav: '₹74.12',
    orderDate: '08 Aug 2026',
    settlementStatus: 'Pending',
  },
];

export async function getAMCs(): Promise<AMCInfo[]> {
  await delay();
  return AMCS;
}

export async function getFundsByAMC(amcId: string): Promise<FundInfo[]> {
  await delay();
  return FUNDS.filter(item => item.amcId === amcId);
}

export async function getFundDetails(amcId: string, fundId: string): Promise<FundInfo | undefined> {
  await delay();
  return FUNDS.find(item => item.amcId === amcId && item.id === fundId);
}

export async function getDashboardInsights(): Promise<{ summary: PortfolioSummary; recentInvestments: TransactionRow[]; chartData: { month: string; value: number }[] }> {
  await delay();
  return {
    summary: PORTFOLIO_SUMMARY,
    recentInvestments: TRANSACTIONS.slice(0, 3),
    chartData: [
      { month: 'Jan', value: 235000 },
      { month: 'Feb', value: 238500 },
      { month: 'Mar', value: 242000 },
      { month: 'Apr', value: 248000 },
      { month: 'May', value: 253500 },
      { month: 'Jun', value: 260000 },
      { month: 'Jul', value: 268000 },
      { month: 'Aug', value: 276500 },
    ],
  };
}

export async function getPortfolioHoldings(): Promise<Holding[]> {
  await delay();
  return HOLDINGS;
}

export async function getSIPPlans(): Promise<SIPPlan[]> {
  await delay();
  return SIPS;
}

export async function getTransactions(): Promise<TransactionRow[]> {
  await delay();
  return TRANSACTIONS;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  await delay();
  return BANK_ACCOUNTS;
}

export async function saveBankAccount(account: BankAccount): Promise<BankAccount> {
  await delay();
  const existing = BANK_ACCOUNTS.find(item => item.id === account.id);
  if (existing) {
    Object.assign(existing, account);
    return existing;
  }
  const next = { ...account, id: `bank-${BANK_ACCOUNTS.length + 1}` };
  BANK_ACCOUNTS.push(next);
  return next;
}

export async function getInvestorProfile(): Promise<InvestorProfile> {
  await delay();
  return INVESTOR_PROFILE;
}

export async function createOrder(summary: Omit<OrderSummary, 'orderId' | 'transactionId' | 'createdAt'>): Promise<OrderDetails> {
  await delay(900);
  const orderId = `BSE20260808${String(ORDERS.length + 1).padStart(3, '0')}`;
  const transactionId = `TXN20260808${String(ORDERS.length + 1).padStart(3, '0')}`;
  const createdAt = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const order: OrderDetails = {
    orderId,
    transactionId,
    createdAt,
    orderDate: createdAt,
    settlementStatus: 'Pending',
    units: '134.01',
    nav: '₹74.12',
    paymentStatus: 'Successful',
    orderStatus: 'Order Submitted',
    ...summary,
  };
  ORDERS.unshift(order);
  return order;
}

export async function getOrders(): Promise<OrderDetails[]> {
  await delay();
  return ORDERS;
}

export async function getOrderById(orderId: string): Promise<OrderDetails | undefined> {
  await delay();
  return ORDERS.find(order => order.orderId === orderId);
}

export async function getNotifications(): Promise<{ title: string; message: string; date: string }[]> {
  await delay();
  return [
    { title: 'Investment order submitted', message: 'Your ₹10,000 mutual fund order has been submitted.', date: '08 Aug 2026' },
    { title: 'SIP mandate active', message: 'Your ₹5,000 monthly SIP is ready.', date: '05 Aug 2026' },
    { title: 'Units allotted', message: 'Your mutual fund units have been added to your portfolio.', date: '03 Aug 2026' },
  ];
}
