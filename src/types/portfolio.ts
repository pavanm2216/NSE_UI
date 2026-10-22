// ── Shared ────────────────────────────────────────────────────────────────────
export interface PortfolioFilters {
  endDate:            string;
  pan:                string;
  panWise?:           0 | 1;
  dataSource?:        number;
  investorExactName?: string;
  holdingPeriod?:     string;
  equityCode1?:       string;
}

// ── Portfolio Return (getPortfolioReturns) ────────────────────────────────────
export interface PortfolioReturnRow {
  fundName:            string;
  schemeName:          string;
  folioNo:             string;
  applicantName:       string;
  purchaseValue:       number;
  currentValue:        number;
  currentAmount:       number;
  gain:                number;
  balanceUnits:        number;
  nav:                 number;
  avgCost:             number;
  currentNav:          number;
  purchaseDate:        string;
  currentNavDate:      string;
  CAGR:                number;
  absoluteReturn:      number;
  dividend:            number;
  changePercent:       number;
  oneDayChange:        number;
  category:            string;
  category2:           string;
  objectiveName:       string;
  pan:                 string;
  email:               string;
  mobile:              string;
  relationshipManager: string;
  subBroker:           string;
  txnType:             string;
  isinNo:              string;
  avgHoldingDays:      number;
  share:               number;
}

export interface PortfolioReturnSummary {
  purchaseValue:   number;
  currentValue:    number;
  gain:            number;
  absoluteReturn:  number;
  CAGR:            number;
  dividend:        number;
  balanceUnits:    number;
  avgHoldingDays:  number;
  currentPrice:    number;
  avgCost:         number;
  changePercent:   number;
  oneDayChange:    number;
}

// ── Portfolio Detailed (getPortfolioReturnsDetailed) ──────────────────────────
export interface PortfolioDetailedTxn extends PortfolioReturnRow {}

export interface PortfolioDetailedFolioGroup {
  data: PortfolioDetailedTxn[];
  summary: PortfolioReturnSummary;
}

export interface PortfolioDetailedSubCat {
  data: PortfolioDetailedFolioGroup[];
  summary: PortfolioReturnSummary;
}

export interface PortfolioDetailedInvestor {
  pan:           string;
  uid:           string;
  applicantName: string;
  summary:       PortfolioReturnSummary;
  data:          PortfolioDetailedSubCat[];
}

// ── Shares & Bonds (getPortFolioReturnsForSharesAndBonds) ─────────────────────
export interface SharesBondsRow {
  familyHeadName:      string;
  changePercent:       number;
  pan:                 string;
  email:               string;
  mobile:              string;
  subBroker:           string;
  relationshipManager: string;
  txnType:             string;
  purchaseDate:        string;
  currentNav:          number;
  fundName:            string;
  schemeName:          string;
  isinNo:              string;
  category2:           string;
  purchaseValue:       number;
  currentValue:        number;
  currentAmount:       number;
  balanceUnits:        number;
  dividend:            number;
  gain:                number;
  avgHoldingDays:      number;
  avgCost:             number;
  nav:                 number;
  CAGR:                number;
  absoluteReturn:      number;
  oneDayChange:        number;
  objectiveName:       string;
}

export interface SharesBondsSummary {
  purchaseValue:  number;
  currentValue:   number;
  balanceUnits:   number;
  dividend:       number;
  gain:           number;
  avgHoldingDays: number;
  CAGR:           number;
  avgCost:        number;
  currentPrice:   number;
  changePercent:  number;
  oneDayChange:   number;
  absoluteReturn: number;
}

// ── Fixed Deposit (getPortfolioReturnsForFixedAssets) ─────────────────────────
export interface FixedDepositRow {
  fixedAssetName:  string;
  scheme:          string;
  allotmentDate:   string;
  maturityDate:    string;
  fdType:          string;
  category:        string;
  objectiveName:   string;
  rateOfInterest:  number;
  purchaseValue:   number;
  currentValue:    number;
  dividend:        number;
  gain:            number;
  CAGR:            number;
  absoluteReturn:  number;
  referenceNo:     string;
  day:             number;
  month:           number;
  avgHoldingDays:  number;
}

export interface FixedDepositSummary {
  purchaseValue:  number;
  currentValue:   number;
  dividend:       number;
  gain:           number;
  CAGR:           number;
  absoluteReturn: number;
  avgHoldingDays: number;
}

// ── Other Assets (getPortfolioForOtherAssets) ─────────────────────────────────
export interface OtherAssetTxn {
  txnDate:              string;
  amount:               number;
  investorName:         string;
  assetTxnsid:          number;
  accountNumber:        string;
  companyProvider:      string;
  debtPercent:          number;
  equityPercent:        number;
  goldPercent:          number;
  globalEquityPercent:  number;
  realEstatePercent:    number;
  otherPercent:         number;
  pdType:               string;
  pan:                  string;
  name:                 string;
}

export interface OtherAssetRow {
  assetName:       string;
  assetType:       string;
  goalAssignedTo:  string;
  purchaseValue:   number;
  currentValue:    number;
  sellValue:       number;
  gain:            number;
  XIRR:            number | null;
  bmXirr:          number | null;
  startDate:       string;
  currentDate:     string;
  openingBalance:  number;
  category2:       string;
  dueDiligence:    string;
  assetid:         number;
  applicantName:   string;
  txns:            OtherAssetTxn[];
  XIRRData:        unknown[];
  bmXirrData:      unknown[];
}

export interface OtherAssetSummary {
  openingBalance: number;
  purchaseValue:  number;
  sellValue:      number;
  currentValue:   number;
  gain:           number;
  XIRR:           number | null;
  bmXirr:         number | null;
  inceptionDate:  string;
}

// ── Portfolio Summary (getPortfolioSummaryForMutualFunds) ───────────────────
export interface PortfolioSummaryFilters {
  endDate:            string;
  pan:                string;
  startDate?:         string;
  panWiseData?:       0 | 1;
  investorExactName?: string;
  equityCode1?:       string;
}

export interface SummaryRow {
  folioNo:             string;
  schemeName:          string;
  fundName:            string;
  isinNo:              string;
  pan:                 string;
  applicantName:       string;
  category:            string;
  category2:           string;
  objectiveName:       string;
  currentUnits:        number;
  currentNav:          number;
  currentNavDate:      string;
  currentValue:        number;
  netInvestment:       number;
  openingBalance:      number;
  purchaseValue:       number;
  gain:                number;
  unrealizedGain:      number;
  realizedGain:        number;
  absoluteReturn:      number;
  XIRR:                number;
  avgHoldingDays:      number;
  schemeBenchmarkName: string;
  XIRRData:            { amount: number; date: string }[];
}

export interface SummaryResult {
  data:    SummaryRow[];
  summary: Record<string, number>;
}

// ── Journey chart ─────────────────────────────────────────────────────────────
export interface JourneyDataPoint {
  date:          string;
  netInvestment: number;
  AUM:           number;
}
