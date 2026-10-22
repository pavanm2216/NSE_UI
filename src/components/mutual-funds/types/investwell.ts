// ─── Portfolio Returns (Group by Folio) ─────────────────────────────────────
export interface FolioPortfolioItem {
  changePercent: number;
  pan: string;
  txnType: string;
  purchaseDate: string;
  currentNav: number;
  fundName: string;
  applicantName: string;
  objectiveName: string;
  schemeName: string;
  isinNo: string;
  category2: string;
  folioNo: string;
  purchaseValue: number;
  currentValue: number;
  balanceUnits: number;
  gain: number;
  currentNavDate: string;
  CAGR: number;
  currentAmount: number;
  absoluteReturn: number;
  oneDayChange: number;
  share: number;
}

export interface FolioPortfolioSummary {
  purchaseValue: number;
  currentValue: number;
  gain: number;
  CAGR: number;
  avgCost: number;
  currentPrice: number;
  oneDayChange: number;
  changePercent: number;
  absoluteReturn: number;
}

export interface FolioPortfolioResponse {
  status: number;
  message: string;
  result: {
    data: FolioPortfolioItem[];
    summary: FolioPortfolioSummary;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthTokenRequest { username: string; password: string; totp?: string }
export interface AuthTokenResponse { token: string; expiry: string; clientCode: string }

// ─── Portfolio Return ─────────────────────────────────────────────────────────
export interface PortfolioFolioItem {
  folio: string; schemeName: string; schemeCode: string; investorName: string;
  category: string; subCategory: string; purchasedUnits: number; currentUnits: number;
  purchasedNAV: number; currentNAV: number; purchasedValue: number; currentValue: number;
  gainLoss: number; gainLossPercent: number; xirr: number; absoluteReturn: number;
  dividendPayout: number; sipAmount: number;
}
export interface PortfolioSummaryMeta {
  totalInvested: number; totalCurrentValue: number; totalGainLoss: number;
  totalGainLossPercent: number; xirr: number; absoluteReturn: number;
}
export interface PortfolioFolioResponse { data: PortfolioFolioItem[]; summary: PortfolioSummaryMeta }
export type PortfolioSchemeResponse = PortfolioFolioResponse;

export interface PortfolioSubCategoryItem {
  subCategory: string; category: string; investedValue: number; currentValue: number;
  gainLoss: number; gainLossPercent: number; xirr: number; schemes: number;
}
export interface PortfolioSubCategoryResponse { data: PortfolioSubCategoryItem[] }

export interface PortfolioInvestorItem {
  investorName: string; pan: string; investedValue: number; currentValue: number;
  gainLoss: number; gainLossPercent: number; xirr: number; folios: number;
}
export interface PortfolioInvestorResponse { data: PortfolioInvestorItem[] }

export interface PortfolioTransactionItem {
  folio: string; schemeName: string; transactionDate: string; transactionType: string;
  units: number; nav: number; amount: number; currentValue: number; gainLoss: number; holdingDays: number;
}
export interface PortfolioTransactionResponse { data: PortfolioTransactionItem[] }

export interface SharesBondsItem {
  symbol: string; companyName: string; exchange: string; quantity: number;
  avgBuyPrice: number; currentPrice: number; investedValue: number; currentValue: number;
  gainLoss: number; gainLossPercent: number; dayChange: number; dayChangePercent: number;
}
export interface SharesBondsResponse { data: SharesBondsItem[] }

export interface FixedDepositItem {
  bankName: string; fdNumber: string; principalAmount: number; interestRate: number;
  tenure: string; maturityDate: string; maturityAmount: number; interestEarned: number;
  status: 'active' | 'matured' | 'premature_closed';
}
export interface FixedDepositResponse { data: FixedDepositItem[] }

export interface OtherAssetItem {
  assetName: string; assetType: string; purchaseDate: string; purchaseValue: number;
  currentValue: number; gainLoss: number; gainLossPercent: number; notes: string;
}
export interface OtherAssetsResponse { data: OtherAssetItem[] }

// ─── Portfolio Other Assets ───────────────────────────────────────────────────
export interface OtherAssetTransaction {
  assetid: string; assetType: string; assetName: string; appid: string; assetTxnsid: string;
  amount: number; txnDate: string; arnid: string; name: string; pan: string;
  debtPercent: number; equityPercent: number; goldPercent: number; otherPercent: number;
  companyProvider: string | null; accountNumber: string | null;
}

export interface OtherAssetXIRRData { amount: number; date: string; }

export interface PortfolioOtherAsset {
  assetid: string; assetName: string; assetType: string; arnid: string;
  applicantName: string; appid: string; dueDiligence: string; category2: string;
  startDate: string; openingBalance: number; purchaseValue: number; sellValue: number;
  currentValue: number; gain: number; txns: OtherAssetTransaction[];
  XIRRData: OtherAssetXIRRData[]; bmXirrData: OtherAssetXIRRData[];
  XIRR: number; bmXirr: number;
}

export interface PortfolioOtherAssetsSummary {
  openingBalance: number; purchaseValue: number; sellValue: number;
  currentValue: number; gain: number; XIRR: number; bmXirr: number;
  inceptionDate: string;
}

export interface PortfolioOtherAssetsResponse {
  status: number; message: string;
  result: { data: PortfolioOtherAsset[]; summary: PortfolioOtherAssetsSummary; };
}

// ─── Portfolio Summary ────────────────────────────────────────────────────────
export interface PortfolioSummaryItem {
  label: string; investedValue: number; currentValue: number; gainLoss: number;
  gainLossPercent: number; xirr: number; cagr: number; sipAmount: number;
  units?: number; nav?: number;
}
export interface PortfolioSummaryMeta2 {
  totalInvested: number; totalCurrentValue: number; totalGainLoss: number;
  xirr: number; cagr: number; totalSIP: number;
}
export interface PortfolioSummaryResponse { data: PortfolioSummaryItem[]; summary: PortfolioSummaryMeta2 }

// ─── Investor Master ──────────────────────────────────────────────────────────
export interface Client {
  clientCode: string; name: string; email: string; mobile: string; pan: string;
  kycStatus: 'verified' | 'pending' | 'rejected'; status: 'active' | 'locked';
  createdAt: string; totalAUM: number;
}
export interface ClientListResponse { clients: Client[] }
export interface CreateClientRequest {
  name: string; email: string; mobile: string; pan: string; dob: string;
  gender: string; address: string; pincode: string; bankName: string;
  accountNumber: string; ifsc: string; accountType: string;
  nominee: { name: string; relation: string; dob: string };
}
export interface CreateClientResponse { success: boolean; clientCode: string; message: string }
export interface UpdateClientResponse { success: boolean; message: string }
export interface LockUnlockResponse { success: boolean; message: string }

// ─── Transactions ─────────────────────────────────────────────────────────────
export interface MFTransaction {
  folio: string; schemeName: string; schemeCode: string; isin: string;
  transactionDate: string; transactionType: 'Purchase' | 'Redemption' | 'Switch In' | 'Switch Out' | 'Dividend' | 'SIP';
  units: number; nav: number; amount: number; stampDuty: number; exitLoad: number;
  balanceUnits: number; registrar: string; orderRef: string;
}
export interface MFTransactionResponse { transactions: MFTransaction[] }
export type StatementResponse = MFTransactionResponse;

export interface SBTransaction {
  symbol: string; companyName: string; exchange: string; tradeDate: string;
  tradeType: 'Buy' | 'Sell'; quantity: number; price: number; amount: number;
  brokerage: number; stt: number; netAmount: number; orderRef: string;
}
export interface SBTransactionResponse { transactions: SBTransaction[] }

export interface FDTransaction {
  bankName: string; fdNumber: string; transactionDate: string;
  transactionType: 'Deposit' | 'Renewal' | 'Premature Closure' | 'Maturity';
  amount: number; interestRate: number; tenure: string; maturityDate: string;
}
export interface FDTransactionResponse { transactions: FDTransaction[] }

// ─── Capital Gain Realized ────────────────────────────────────────────────────
export interface RealizedGainItem {
  folio: string; schemeName: string; isin: string; purchaseDate: string;
  redemptionDate: string; units: number; purchaseNAV: number; redemptionNAV: number;
  purchaseValue: number; redemptionValue: number; gainLoss: number; gainLossPercent: number;
  holdingDays: number; gainType: 'LTCG' | 'STCG'; taxableGain: number; indexationBenefit: number;
}
export interface RealizedGainSummary {
  totalLTCG: number; totalSTCG: number; totalGain: number;
  taxLiabilityLTCG: number; taxLiabilitySTCG: number; totalTaxLiability: number;
}
export interface RealizedCapitalGainResponse { data: RealizedGainItem[]; summary: RealizedGainSummary }

// ─── Capital Gain Unrealized ──────────────────────────────────────────────────
export interface UnrealizedGainItem {
  folio: string; schemeName: string; isin: string; purchaseDate: string;
  units: number; purchaseNAV: number; currentNAV: number; purchaseValue: number;
  currentValue: number; unrealizedGain: number; unrealizedGainPercent: number;
  holdingDays: number; gainType: 'LTCG' | 'STCG'; estimatedTax: number;
}
export interface UnrealizedGainSummary {
  totalUnrealizedGain: number; totalLTCGUnrealized: number;
  totalSTCGUnrealized: number; estimatedTotalTax: number;
}
export interface UnrealizedCapitalGainResponse { data: UnrealizedGainItem[]; summary: UnrealizedGainSummary }

// ─── Asset Allocation ─────────────────────────────────────────────────────────
export interface CategoryAllocationItem { category: string; investedValue: number; currentValue: number; percentage: number }
export interface CategoryAllocationResponse { data: CategoryAllocationItem[] }

export interface BroadAssetItem { assetClass: string; investedValue: number; currentValue: number; percentage: number }
export interface BroadAssetAllocationResponse { data: BroadAssetItem[] }

export interface EquityCapItem { capType: string; investedValue: number; currentValue: number; percentage: number }
export interface EquityCapAllocationResponse { data: EquityCapItem[] }

export interface FundAllocationItem { schemeName: string; schemeCode: string; currentValue: number; percentage: number }
export interface FundAllocationResponse { data: FundAllocationItem[] }

export interface InvestorAllocationItem { investorName: string; pan: string; currentValue: number; percentage: number }
export interface InvestorAllocationResponse { data: InvestorAllocationItem[] }

export interface HoldingAllocationItem { holdingPeriod: string; currentValue: number; percentage: number; gainType: 'LTCG' | 'STCG' }
export interface HoldingAllocationResponse { data: HoldingAllocationItem[] }

// ─── Investment Snapshot (API) ──────────────────────────────────────────────
export interface InvestmentSnapshotItem {
  name: string;
  total: number;
  equity: number;
  hybridValue: number;
  other: number;
}

export interface InvestmentSnapshotAPIResponse {
  status: number;
  message: string;
  result: { data: InvestmentSnapshotItem[] };
}

// ─── Investment Snapshot ──────────────────────────────────────────────────────
export interface InvestmentGoal {
  goalName: string; targetAmount: number; currentAmount: number;
  targetDate: string; progressPercent: number; monthlyRequired: number;
}
export interface InvestmentSnapshotResponse {
  healthScore: number; diversificationScore: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive' | 'Very Aggressive';
  riskScore: number; totalInvested: number; currentValue: number; totalGainLoss: number;
  xirr: number; cagr: number; sipTotal: number; sipCount: number;
  topPerformingFund: { schemeName: string; xirr: number; gainLossPercent: number };
  worstPerformingFund: { schemeName: string; xirr: number; gainLossPercent: number };
  assetAllocationSummary: { assetClass: string; percentage: number }[];
  monthlyTrend: { month: string; investedValue: number; currentValue: number }[];
  goals: InvestmentGoal[];
}

// ─── Scheme Factsheet ─────────────────────────────────────────────────────────
export interface SchemeFactsheetResponse {
  schemeCode: string; schemeName: string; amcName: string; category: string; subCategory: string;
  nav: number; navDate: string; aum: number; expenseRatio: number; exitLoad: string;
  minSIPAmount: number; minLumpsumAmount: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  returns: { oneYear: number; threeYear: number; fiveYear: number; sinceInception: number };
  benchmarkReturns: { oneYear: number; threeYear: number; fiveYear: number };
  fundManager: string; launchDate: string; rating: number;
  topHoldings: { stockName: string; percentage: number; sector: string }[];
  sectorAllocation: { sector: string; percentage: number }[];
}

// ─── Portfolio Journey ────────────────────────────────────────────────────────
export interface PortfolioJourneyItem { date: string; netInvestment: number; currentAUM: number; gainLoss: number }
export interface PortfolioJourneyResponse { data: PortfolioJourneyItem[] }

// ─── MF Portfolio Summary (Group by Folio) ───────────────────────────────────
export interface MFPortfolioSummaryItem {
  appid: string; uid: string; applicantName: string; schid: string; schemeName: string;
  fundName: string; folioid: string; folioNo: string; objectiveid: string; fundid: string;
  category: string; currentNav: number; pan: string; dematAccount: string; dueDiligence: string;
  category2: string; inceptionDate: string | null; comments: string | null; changePercent: number;
  schemeBenchmarkName: string; viewPriority: number; purchaseValue: number; switchIn: number;
  dividendReinvestment: number; redemptionAmount: number; switchOut: number; currentUnits: number;
  currentValue: number; dividend: number; realizedGain: number; unrealizedGain: number;
  XIRR: number; bmXirr: number; openingBalance: number; gain: number; oneDayChange: number;
  uccNumber: string | null; iinNo: string | null; canNumber: string | null;
  remainingBalUnitsPurchaseValue: number; completePurchase: number; completeSell: number;
  holdingWeightedSum: number; netInvestment: number; currentNavDate: string;
  portfolioObjective: string; levelNo: number; isinNo: string; schemeGroupId: string;
  absoluteReturn: number; avgHoldingDays: number;
}

export interface MFPortfolioSummarySummary {
  openingBalance: number; purchaseValue: number; switchIn: number; switchOut: number;
  dividend: number; dividendReinvestment: number; redemptionAmount: number;
  currentValue: number; gain: number; realizedGain: number; unrealizedGain: number;
  XIRR: number; bmXirr: number; oneDayChange: number; changePercent: number;
  remainingBalUnitsPurchaseValue: number; completePurchase: number; completeSell: number;
  holdingWeightedSum: number; netInvestment: number; inceptionDate: number;
  absoluteReturn: number; avgHoldingDays: number;
}

export interface MFPortfolioSummaryResponse {
  status: number; message: string;
  result: {
    data: MFPortfolioSummaryItem[];
    totalNoRows: number;
    summary: MFPortfolioSummarySummary;
    totalXIRRData: { amount: number; date: string }[];
  };
}

// ─── User Master ──────────────────────────────────────────────────────────────
export interface CreateUserRequest { name: string; email: string; mobile: string; role: string; permissions: string[] }
export interface CreateUserResponse { success: boolean; userId: string; message: string }
export interface UpdateUserResponse { success: boolean; message: string }

// ─── Statement of Account (SOA) ───────────────────────────────────────────────
export interface SOATransaction {
  txnid: string;
  amount: number;
  currentNav: number | null;
  currentNavDate: string | null;
  nav: number;
  units: number;
  date: string;
  txnType: string;
  type: number;
  nature: string;
  remarks: string | null;
  balUnits: number;
  folioId: string;
  arnNo: string;
}

export interface SOASummary {
  date: string;
  units: number;
  nav: number;
  nature: string;
  amount: number;
}

export interface SOAResponse {
  status: number;
  message: string;
  result: {
    schemeName: string;
    fundid: string;
    schid: string;
    folioNo: string;
    applicantName: string;
    rta: string;
    summary: SOASummary;
    data: SOATransaction[];
  };
}
