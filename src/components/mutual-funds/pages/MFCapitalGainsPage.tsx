import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, ChevronDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  getRealizedCapitalGainAPI,
  getRealizedCapitalGainV2API,
  getUnrealizedCapitalGainAPI,
  getUnrealizedCapitalGainV2API,
  getUnrealizedCapitalGainSbV2API,
  downloadRealizedCapitalGainPDF,
  downloadRealizedCapitalGainPDFV2,
  downloadUnrealizedCapitalGainPDF,
  downloadUnrealizedCapitalGainPDFV2,
} from '@/services/investwellService';
import { getOrFetchAggregatorToken, getStoredToken } from '@/services/investwellAuthService';
import { resolvePAN } from '../hooks/useDemoPAN';

const FY_OPTIONS = [
  { label: 'FY 2023-24', year: 2023 },
  { label: 'FY 2024-25', year: 2024 },
  { label: 'FY 2022-23', year: 2022 },
];
const CACHE_TTL = 2 * 60 * 1000;
const typeStyle: Record<string, string> = {
  LTCG: 'bg-blue-100 text-blue-700',
  STCG: 'bg-orange-100 text-orange-700',
};

const fmt = (n: number | undefined | null) => {
  if (n == null || isNaN(n)) return '₹0.00';
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtDate = (d: string) => { if (!d) return '-'; try { return new Date(d).toLocaleDateString('en-IN'); } catch { return d; } };
const fmtNum = (n: number | undefined | null, dec = 4) => n == null || isNaN(n) ? '-' : n.toFixed(dec);

function getDeep(obj: any, path: string) {
  return path.split('.').reduce((o: any, k) => o?.[k], obj);
}

// Dates come as "DD/MM/YYYY" from API — convert to readable format
function fmtApiDate(d: string) {
  if (!d) return '-';
  if (d.includes('T')) try { return new Date(d).toLocaleDateString('en-IN'); } catch { return d; }
  const parts = d.split('/');
  if (parts.length === 3) return `${parts[0]}/${parts[1]}/${parts[2]}`;
  return d;
}

function extractV1Rows(result: any) {
  const rows: any[] = [];
  if (!result) return rows;

  // API returns: section.fifo = array of scheme objects, each scheme has its own .fifo array of transactions
  const SECTIONS = [
    { path: 'equity.shortTerm',           type: 'STCG', label: 'Equity Short Term' },
    { path: 'equity.longTermBeforeJan18', type: 'LTCG', label: 'Equity LT Before Jan 2018' },
    { path: 'equity.longTermAfterJan18',  type: 'LTCG', label: 'Equity LT After Jan 2018' },
    { path: 'debt.shortTerm',             type: 'STCG', label: 'Debt Short Term' },
    { path: 'debt.longTerm',              type: 'LTCG', label: 'Debt Long Term' },
  ];

  SECTIONS.forEach(({ path, type, label }) => {
    const section = getDeep(result, path);
    if (!section) return;
    const schemeList: any[] = section.fifo ?? [];
    schemeList.forEach((scheme: any) => {
      const txns: any[] = scheme.fifo ?? [];
      if (txns.length > 0) {
        txns.forEach((item: any) => rows.push(buildRow(scheme, item, label, type)));
      } else {
        // scheme-level summary row (no nested fifo)
        rows.push(buildRow(null, scheme, label, type));
      }
    });
  });

  return rows;
}

function buildRow(scheme: any, item: any, section: string, type: string) {
  return {
    schemeName:             scheme?.schemeName ?? item.schemeName ?? '-',
    folioNo:                scheme?.folioNo    ?? item.folioNo    ?? '-',
    investorName:           item.investorName  ?? scheme?.investorName,
    isinNo:                 item.isinNo        ?? scheme?.isinNo,
    purchaseDate:           item.purchaseDate  ?? item.purchaseNavDate,
    sellDate:               item.sellDate      ?? item.sellNavDate,
    units:                  item.strikedUnits  ?? item.units,
    purchaseNav:            item.purchaseNav   ?? item.adjustedPurchaseNav ?? item.adjustedPurchasePrice,
    sellNav:                item.sellNav,
    purchaseAmount:         item.purchaseAmount,
    sellAmount:             item.sellAmount,
    actualGain:             item.actualGain,
    taxableGain:            item.taxableGain,
    adjustedPurchaseAmount: item.adjustedPurchaseAmount,
    isGrandfathered:        item.isGrandfathered,
    stt:                    item.STT,
    tds:                    item.tdsAmount,
    days:                   item.days,
    section,
    type,
  };
}

function extractV2Rows(result: any) {
  const rows: any[] = [];
  if (!result?.data) return rows;
  result.data.forEach((investor: any) => {
    investor.data?.forEach((category: any) => {
      const type = (category.gainType ?? '').toLowerCase().includes('short') ? 'STCG' : 'LTCG';
      category.data?.forEach((scheme: any) => {
        scheme.fifo?.forEach((item: any) => {
          rows.push({
            investorName: investor.applicantName, schemeName: scheme.schemeName, folioNo: scheme.folioNo,
            categoryName: category.name ?? '', purchaseDate: item.purchaseDate?.split('T')[0],
            sellDate: item.sellDate?.split('T')[0], units: item.strikedUnits,
            purchaseNav: item.purchaseNav, sellNav: item.sellNav,
            purchaseAmount: item.purchaseAmount, sellAmount: item.sellAmount,
            actualGain: item.actualGain, taxableGain: item.taxableGain,
            adjustedPurchaseAmount: item.adjustedPurchaseAmount,
            isGrandfathered: item.isGrandfathered, days: item.days, type,
          });
        });
      });
    });
  });
  return rows;
}

function calcV2Summary(result: any) {
  let totalGain = 0, ltcg = 0, stcg = 0, stt = 0;
  result?.data?.forEach((inv: any) => {
    inv.data?.forEach((cat: any) => {
      const isShort = (cat.gainType ?? '').toLowerCase().includes('short');
      totalGain += cat.actualGain ?? 0;
      if (isShort) stcg += cat.actualGain ?? 0; else ltcg += cat.actualGain ?? 0;
      stt += cat.STT ?? 0;
    });
  });
  return { totalGain, ltcg, stcg, stt };
}

const UNREALIZED_CATS = [
  { key: 'equity', label: 'Equity', sections: [
    { path: 'longTermAfterJan18', label: 'Long Term (After Jan 2018)', type: 'LTCG' },
    { path: 'longTermBeforeJan18', label: 'Long Term (Before Jan 2018)', type: 'LTCG' },
    { path: 'shortTerm', label: 'Short Term', type: 'STCG' },
  ]},
  { key: 'debt', label: 'Debt', sections: [
    { path: 'longTerm', label: 'Long Term', type: 'LTCG' },
    { path: 'shortTerm', label: 'Short Term', type: 'STCG' },
  ]},
  { key: 'elss', label: 'ELSS', sections: [
    { path: 'unlocked.longTermAfterJan18', label: 'Unlocked – LT After Jan 2018', type: 'LTCG' },
    { path: 'unlocked.longTermBeforeJan18', label: 'Unlocked – LT Before Jan 2018', type: 'LTCG' },
    { path: 'locked', label: 'Locked', type: 'ELSS' },
  ]},
];

function extractSectionRows(section: any, type: string) {
  const rows: any[] = [];
  if (!section?.rows) return rows;
  section.rows.forEach((scheme: any) => {
    // Handle nested rows within each scheme
    const schemeRows = scheme.rows ?? [];
    schemeRows.forEach((item: any) => {
      rows.push({
        schemeName: scheme.schemeName ?? item.schemeName ?? '-',
        folioNo: scheme.folioNo ?? item.folioNo ?? '-',
        applicantName: scheme.applicantName ?? item.applicantName,
        purchaseDate: item.purchaseDate ?? '',
        balanceUnits: item.remainBalUnits ?? item.balanceUnits ?? item.units ?? 0,
        purchaseNav: item.nav ?? item.purchaseNav ?? item.purchasePrice,
        currentNav: item.currentNav ?? item.currentPrice,
        purchaseAmount: item.amount ?? item.purchaseAmount ?? 0,
        currentValue: item.currentValue ?? 0,
        actualGain: item.actualCapitalGain ?? 0,
        taxableGain: item.taxableCapitalGain ?? item.taxableGain ?? 0,
        days: item.averageHoldingDays ?? item.avgHoldingDays ?? 0,
        cagr: item.cagr ?? item.CAGR ?? 0,
        type,
        jan18Nav: item.jan18Nav,
        adjustedCost: item.adjustedCost,
      });
    });
  });
  return rows;
}

function calcUnrealizedSummary(result: any) {
  let purchaseAmount = 0, currentValue = 0, actualGain = 0, taxableGain = 0;
  if (!result) return { purchaseAmount, currentValue, actualGain, taxableGain };
  
  // Process equity
  if (result.equity) {
    ['longTermAfterJan18', 'longTermBeforeJan18', 'shortTerm'].forEach(key => {
      const sec = result.equity[key];
      if (sec?.summary) {
        purchaseAmount += sec.summary.purchaseAmount ?? 0;
        currentValue += sec.summary.currentValue ?? 0;
        actualGain += sec.summary.actualCapitalGain ?? 0;
        taxableGain += sec.summary.taxableCapitalGain ?? sec.summary.taxableGain ?? 0;
      }
    });
  }
  
  // Process debt
  if (result.debt) {
    ['longTerm', 'shortTerm'].forEach(key => {
      const sec = result.debt[key];
      if (sec?.summary) {
        purchaseAmount += sec.summary.purchaseAmount ?? 0;
        currentValue += sec.summary.currentValue ?? 0;
        actualGain += sec.summary.actualCapitalGain ?? 0;
        taxableGain += sec.summary.taxableCapitalGain ?? sec.summary.taxableGain ?? 0;
      }
    });
  }
  
  // Process ELSS unlocked
  if (result.elss?.unlocked) {
    ['longTermAfterJan18', 'longTermBeforeJan18'].forEach(key => {
      const sec = result.elss.unlocked[key];
      if (sec?.summary) {
        purchaseAmount += sec.summary.purchaseAmount ?? 0;
        currentValue += sec.summary.currentValue ?? 0;
        actualGain += sec.summary.actualCapitalGain ?? 0;
        taxableGain += sec.summary.taxableCapitalGain ?? sec.summary.taxableGain ?? 0;
      }
    });
  }
  
  // Process ELSS locked
  if (result.elss?.locked?.summary) {
    purchaseAmount += result.elss.locked.summary.purchaseAmount ?? 0;
    currentValue += result.elss.locked.summary.currentValue ?? 0;
    actualGain += result.elss.locked.summary.actualCapitalGain ?? 0;
    taxableGain += result.elss.locked.summary.taxableCapitalGain ?? result.elss.locked.summary.taxableGain ?? 0;
  }
  
  return { purchaseAmount, currentValue, actualGain, taxableGain };
}

const SummaryCard = ({ label, value, color, icon }: { label: string; value: string; color: string; icon?: React.ReactNode }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </CardContent>
  </Card>
);

const LoadingState = () => (
  <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
);

function sanitizeError(raw: string) {
  return /client not found|investor not found|user not found/i.test(raw)
    ? 'No data found for this PAN. Please verify the PAN and try again.'
    : raw || 'Something went wrong. Please try again.';
}

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-16 gap-4">
    <p className="text-muted-foreground text-sm text-center max-w-md">{sanitizeError(message)}</p>
    <Button size="sm" variant="outline" onClick={onRetry} className="gap-2"><RefreshCw className="w-3 h-3" /> Retry</Button>
  </div>
);

const EmptyRow = ({ cols, label }: { cols: number; label: string }) => (
  <tr><td colSpan={cols} className="p-10 text-center text-muted-foreground text-sm">{label}</td></tr>
);

const UnrealizedTable = ({ rows, sectionLabel }: { rows: any[]; sectionLabel: string }) => {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground py-3 pl-1">No data available for {sectionLabel}</p>;
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Scheme Name','Folio','Buy Date','Balance Units','Buy NAV','Current NAV','Purchase Amt','Current Value','Gain','CAGR %','Days','Type'].map(h => (
              <th key={h} className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
              className="border-b hover:bg-muted/30 transition-colors">
              <td className="px-3 py-2.5 font-medium max-w-[180px] truncate" title={row.schemeName}>{row.schemeName}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-xs">{row.folioNo}</td>
              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-xs">{fmtDate(row.purchaseDate)}</td>
              <td className="px-3 py-2.5">{fmtNum(row.balanceUnits, 4)}</td>
              <td className="px-3 py-2.5">₹{fmtNum(row.purchaseNav, 4)}</td>
              <td className="px-3 py-2.5">₹{fmtNum(row.currentNav, 4)}</td>
              <td className="px-3 py-2.5">{fmt(row.purchaseAmount)}</td>
              <td className="px-3 py-2.5">{fmt(row.currentValue)}</td>
              <td className={`px-3 py-2.5 font-semibold ${row.actualGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {row.actualGain >= 0 ? '+' : ''}{fmt(row.actualGain)}
              </td>
              <td className={`px-3 py-2.5 font-medium ${row.cagr >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {fmtNum(row.cagr, 2)}%
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{row.days}</td>
              <td className="px-3 py-2.5"><Badge className={`text-xs ${typeStyle[row.type] ?? ''}`}>{row.type}</Badge></td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UnrealizedCategoryPanel = ({ result }: { result: any }) => {
  const [activeCat, setActiveCat] = useState('equity');
  const catDef = UNREALIZED_CATS.find(c => c.key === activeCat)!;
  const sections = useMemo(() => {
    if (!result) return [];
    return catDef.sections.map(({ path, label, type }) => {
      const sec = getDeep(result[activeCat], path);
      return { label, type, rows: extractSectionRows(sec, type), summary: sec?.summary ?? {} };
    });
  }, [result, activeCat, catDef]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {UNREALIZED_CATS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveCat(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCat === key ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'
            }`}>{label}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeCat} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
          {sections.map(({ label, type, rows, summary }) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-sm font-semibold">{label}</h3>
                <Badge className={`text-xs ${typeStyle[type] ?? ''}`}>{type}</Badge>
                {summary.actualCapitalGain != null && (
                  <span className={`text-xs font-medium ${summary.actualCapitalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    Gain: {fmt(summary.actualCapitalGain)}
                  </span>
                )}
              </div>
              <UnrealizedTable rows={rows} sectionLabel={label} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const UnrealizedV2Panel = ({ result, onRefresh }: { result: any; onRefresh: () => void }) => {
  const [selectedInvestor, setSelectedInvestor] = useState(0);
  
  const investors = useMemo(() => result?.data ?? [], [result]);
  const currentInvestor = investors[selectedInvestor];
  
  const summary = useMemo(() => {
    if (!currentInvestor) return { purchaseAmount: 0, currentValue: 0, actualGain: 0, taxableGain: 0 };
    let purchaseAmount = 0, currentValue = 0, actualGain = 0, taxableGain = 0;
    currentInvestor.data?.forEach((cat: any) => {
      purchaseAmount += cat.purchaseAmount ?? 0;
      currentValue += cat.currentValue ?? 0;
      actualGain += cat.actualCapitalGain ?? 0;
      taxableGain += cat.taxableCapitalGain ?? 0;
    });
    return { purchaseAmount, currentValue, actualGain, taxableGain };
  }, [currentInvestor]);

  if (!result) {
    return <div className="p-10 text-center text-muted-foreground text-sm">No data received.</div>;
  }

  if (!investors || investors.length === 0) {
    return <div className="p-10 text-center text-muted-foreground text-sm">No unrealized gains V2 data available.</div>;
  }

  if (!currentInvestor) {
    return <div className="p-10 text-center text-muted-foreground text-sm">No investor data found.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        {investors.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {investors.map((inv: any, idx: number) => (
              <button key={idx} onClick={() => setSelectedInvestor(idx)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedInvestor === idx ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}>Investor {idx + 1}</button>
            ))}
          </div>
        )}
        <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
          <RefreshCw className="w-3 h-3" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Purchase Amount" value={fmt(summary.purchaseAmount)} color="text-foreground" />
        <SummaryCard label="Current Value" value={fmt(summary.currentValue)} color="text-[#0D3B66]" icon={<TrendingUp className="w-4 h-4" />} />
        <SummaryCard label="Actual Capital Gain" value={fmt(summary.actualGain)}
          color={summary.actualGain >= 0 ? 'text-green-600' : 'text-red-500'}
          icon={summary.actualGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />} />
        <SummaryCard label="Taxable Gain" value={fmt(summary.taxableGain)} color="text-orange-500" />
      </div>

      <div className="space-y-6">
        {currentInvestor.data?.map((category: any, catIdx: number) => (
          <Card key={catIdx}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">Category: {category.category} | Gain Type: {category.gainType}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${category.actualCapitalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {fmt(category.actualCapitalGain)}
                  </p>
                  <p className="text-xs text-muted-foreground">CAGR: {fmtNum(category.cagr, 2)}%</p>
                </div>
              </div>
              
              {category.data?.map((scheme: any, schIdx: number) => (
                <div key={schIdx} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg mb-2">
                    <div>
                      <p className="font-medium text-sm">{scheme.schemeName}</p>
                      <p className="text-xs text-muted-foreground">Folio: {scheme.folioNo} | Units: {fmtNum(scheme.balanceUnits, 4)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${scheme.actualCapitalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {fmt(scheme.actualCapitalGain)}
                      </p>
                      <p className="text-xs text-muted-foreground">{fmtNum(scheme.cagr, 2)}% CAGR</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b">
                          <th className="text-left px-2 py-2 font-medium">Purchase Date</th>
                          <th className="text-left px-2 py-2 font-medium">Units</th>
                          <th className="text-left px-2 py-2 font-medium">Purchase NAV</th>
                          <th className="text-left px-2 py-2 font-medium">Current NAV</th>
                          <th className="text-left px-2 py-2 font-medium">Purchase Amt</th>
                          <th className="text-left px-2 py-2 font-medium">Current Value</th>
                          <th className="text-left px-2 py-2 font-medium">Gain</th>
                          <th className="text-left px-2 py-2 font-medium">Days</th>
                          <th className="text-left px-2 py-2 font-medium">CAGR %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheme.rows?.map((row: any, rowIdx: number) => (
                          <tr key={rowIdx} className="border-b hover:bg-muted/30">
                            <td className="px-2 py-2 text-muted-foreground">{fmtDate(row.purchaseDate)}</td>
                            <td className="px-2 py-2">{fmtNum(row.balanceUnits ?? row.units, 4)}</td>
                            <td className="px-2 py-2">₹{fmtNum(row.nav ?? row.purchasePrice, 4)}</td>
                            <td className="px-2 py-2">₹{fmtNum(row.currentNav ?? row.currentPrice, 4)}</td>
                            <td className="px-2 py-2">{fmt(row.amount ?? row.purchaseAmount)}</td>
                            <td className="px-2 py-2">{fmt(row.currentValue)}</td>
                            <td className={`px-2 py-2 font-semibold ${row.actualCapitalGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {fmt(row.actualCapitalGain)}
                            </td>
                            <td className="px-2 py-2 text-muted-foreground">{row.averageHoldingDays ?? row.avgHoldingDays ?? '-'}</td>
                            <td className={`px-2 py-2 font-medium ${(row.cagr ?? row.CAGR ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {fmtNum(row.cagr ?? row.CAGR, 2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MFCapitalGainsPage: React.FC = () => {
  // Resolve session PAN on mount

  const [selectedPan, setSelectedPan] = useState(() => resolvePAN());
  const [panInput, setPanInput] = useState(() => resolvePAN());
  const [fyIndex, setFyIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('realized');

  const [v1Loading, setV1Loading] = useState(false);
  const [v1Error, setV1Error]     = useState<string | null>(null);
  const [v1Rows, setV1Rows]       = useState<any[]>([]);
  const [v1Result, setV1Result]   = useState<any>(null);

  const [v2Loading, setV2Loading] = useState(false);
  const [v2Error, setV2Error]     = useState<string | null>(null);
  const [v2Rows, setV2Rows]       = useState<any[]>([]);
  const [v2Result, setV2Result]   = useState<any>(null);

  const [urLoading, setUrLoading] = useState(false);
  const [urError, setUrError]     = useState<string | null>(null);
  const [urResult, setUrResult]   = useState<any>(null);

  const [urV2Loading, setUrV2Loading] = useState(false);
  const [urV2Error, setUrV2Error]     = useState<string | null>(null);
  const [urV2Result, setUrV2Result]   = useState<any>(null);

  const [urSbV2Loading, setUrSbV2Loading] = useState(false);
  const [urSbV2Error, setUrSbV2Error]     = useState<string | null>(null);
  const [urSbV2Result, setUrSbV2Result]   = useState<any>(null);

  const urCacheRef = useRef<{ data: any; ts: number } | null>(null);
  const urV2CacheRef = useRef<{ data: any; ts: number } | null>(null);
  const urSbV2CacheRef = useRef<{ data: any; ts: number } | null>(null);
  const v1CacheRef = useRef<Record<number, { data: any; rows: any[]; ts: number }>>({});
  const v2CacheRef = useRef<Record<number, { data: any; rows: any[]; ts: number }>>({});

  // Token priority: 1) stored login token  2) fresh aggregator token (demoapi has access to demo PANs)
  const getToken = useCallback(async () => {
    try {
      const stored = getStoredToken();
      if (stored?.token) return stored.token;
      return await getOrFetchAggregatorToken();
    } catch (err: any) {
      console.error('[Capital Gains] Failed to get token:', err);
      throw new Error('Authentication failed. Please log in again.');
    }
  }, []);

  // Keep ref in sync synchronously during render (not in useEffect)
  const selectedPanRef = useRef(selectedPan);
  selectedPanRef.current = selectedPan;

  const fetchV1 = useCallback(async (year: number) => {
    const cached = v1CacheRef.current[year];
    if (cached && Date.now() - cached.ts < CACHE_TTL) { setV1Result(cached.data); setV1Rows(cached.rows); return; }
    setV1Loading(true); setV1Error(null);
    try {
      const token = await getToken();
      const userPan = selectedPanRef.current;
      // Try user PAN first, then demo PANs known to have realized gain data
      const result = await getRealizedCapitalGainAPI(token, userPan, year);
      const rows = extractV1Rows(result);
      v1CacheRef.current[year] = { data: result, rows, ts: Date.now() };
      setV1Result(result); setV1Rows(rows);
    } catch (err: any) {
      setV1Error(err.message ?? 'Failed to fetch realized gains.');
    } finally { setV1Loading(false); }
  }, [getToken]);

  const fetchV2 = useCallback(async (year: number) => {
    const cached = v2CacheRef.current[year];
    if (cached && Date.now() - cached.ts < CACHE_TTL) { setV2Result(cached.data); setV2Rows(cached.rows); return; }
    setV2Loading(true); setV2Error(null);
    try {
      const token = await getToken();
      const userPan = selectedPanRef.current;
      const result = await getRealizedCapitalGainV2API(token, userPan, year);
      const rows = extractV2Rows(result);
      v2CacheRef.current[year] = { data: result, rows, ts: Date.now() };
      setV2Result(result); setV2Rows(rows);
    } catch (err: any) {
      setV2Error(err.message ?? 'Failed to fetch realized gains V2.');
    } finally { setV2Loading(false); }
  }, [getToken]);

  const fetchUnrealized = useCallback(async () => {
    if (urCacheRef.current && Date.now() - urCacheRef.current.ts < CACHE_TTL) { setUrResult(urCacheRef.current.data); return; }
    setUrLoading(true); setUrError(null);
    try {
      const token = await getToken();
      const result = await getUnrealizedCapitalGainAPI(token, selectedPanRef.current);
      urCacheRef.current = { data: result, ts: Date.now() };
      setUrResult(result);
    } catch (err: any) {
      setUrError(err.message ?? 'Failed to fetch unrealized gains.');
    } finally { setUrLoading(false); }
  }, [getToken]);

  const fetchUnrealizedV2 = useCallback(async () => {
    if (urV2CacheRef.current && Date.now() - urV2CacheRef.current.ts < CACHE_TTL) { setUrV2Result(urV2CacheRef.current.data); return; }
    setUrV2Loading(true); setUrV2Error(null);
    try {
      const token = await getToken();
      const result = await getUnrealizedCapitalGainV2API(token, selectedPanRef.current);
      urV2CacheRef.current = { data: result, ts: Date.now() };
      setUrV2Result(result);
    } catch (err: any) {
      setUrV2Error(err.message ?? 'Failed to fetch unrealized gains V2.');
    } finally { setUrV2Loading(false); }
  }, [getToken]);

  const fetchUnrealizedSbV2 = useCallback(async () => {
    if (urSbV2CacheRef.current && Date.now() - urSbV2CacheRef.current.ts < CACHE_TTL) { setUrSbV2Result(urSbV2CacheRef.current.data); return; }
    setUrSbV2Loading(true); setUrSbV2Error(null);
    try {
      const token = await getToken();
      const result = await getUnrealizedCapitalGainSbV2API(token, selectedPanRef.current);
      urSbV2CacheRef.current = { data: result, ts: Date.now() };
      setUrSbV2Result(result);
    } catch (err: any) {
      setUrSbV2Error(err.message ?? 'Failed to fetch unrealized gains SB V2.');
    } finally { setUrSbV2Loading(false); }
  }, [getToken]);

  // Single effect — fires once on mount and whenever tab, FY, or PAN changes
  useEffect(() => {
    v1CacheRef.current = {};
    v2CacheRef.current = {};
    urCacheRef.current = null;
    urV2CacheRef.current = null;
    urSbV2CacheRef.current = null;
    const year = FY_OPTIONS[fyIndex].year;
    if (activeTab === 'realized') fetchV1(year);
    else if (activeTab === 'realizedV2') fetchV2(year);
    else if (activeTab === 'unrealized') fetchUnrealized();
    else if (activeTab === 'unrealizedV2') fetchUnrealizedV2();
    else if (activeTab === 'unrealizedSbV2') fetchUnrealizedSbV2();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fyIndex, selectedPan]);

  // Summary values from actual API response structure
  const v1EquityLTCG = v1Result?.summary?.gain?.equity?.longTerm ?? 0;
  const v1EquitySTCG = v1Result?.summary?.gain?.equity?.shortTerm ?? 0;
  const v1DebtLTCG   = v1Result?.summary?.gain?.debt?.longTerm ?? 0;
  const v1DebtSTCG   = v1Result?.summary?.gain?.debt?.shortTerm ?? 0;
  const v1TotalGain  = v1EquityLTCG + v1EquitySTCG + v1DebtLTCG + v1DebtSTCG;
  const v1STT = (v1Result?.equity?.longTermSummary?.STT ?? 0)
              + (v1Result?.equity?.shortTerm?.summary?.STT ?? 0)
              + (v1Result?.debt?.longTerm?.summary?.TDS ?? 0);
  const v2Sum  = useMemo(() => calcV2Summary(v2Result), [v2Result]);
  const urSum  = useMemo(() => calcUnrealizedSummary(urResult), [urResult]);

  const handleDownloadPDF = async (pdfType: 'detailed' | 'summary' | 'v2') => {
    const year = FY_OPTIONS[fyIndex].year;
    try {
      const token = await getToken();
      const pan = selectedPan;
      if (activeTab === 'unrealized') {
        pdfType === 'v2'
          ? downloadUnrealizedCapitalGainPDFV2(token, pan)
          : downloadUnrealizedCapitalGainPDF(token, pan);
      } else if (activeTab === 'realized') {
        downloadRealizedCapitalGainPDF(token, pan, year, pdfType as 'detailed' | 'summary');
      } else {
        downloadRealizedCapitalGainPDFV2(token, pan, year, pdfType as 'detailed' | 'summary');
      }
    } catch (err: any) { alert(err.message ?? 'Failed to download PDF.'); }
  };

  const handleClearCache = () => {
    v1CacheRef.current = {};
    v2CacheRef.current = {};
    urCacheRef.current = null;
    urV2CacheRef.current = null;
    urSbV2CacheRef.current = null;
    const year = FY_OPTIONS[fyIndex].year;
    if (activeTab === 'realized') fetchV1(year);
    else if (activeTab === 'realizedV2') fetchV2(year);
    else if (activeTab === 'unrealized') fetchUnrealized();
    else if (activeTab === 'unrealizedV2') fetchUnrealizedV2();
    else if (activeTab === 'unrealizedSbV2') fetchUnrealizedSbV2();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Capital Gains</h1>
          <p className="text-muted-foreground text-sm">Tax summary and gain/loss analysis</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" onClick={handleClearCache} className="gap-2">
            <RefreshCw className="w-4 h-4" />Refresh
          </Button>
          <div className="flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 bg-muted/50">
            <span className="text-muted-foreground">PAN:</span>
            <input
              value={panInput}
              onChange={e => setPanInput(e.target.value.toUpperCase())}
              onKeyDown={e => { if (e.key === 'Enter') { const p = panInput.trim(); if (p) setSelectedPan(p); } }}
              onBlur={() => { const p = panInput.trim(); if (p) setSelectedPan(p); }}
              placeholder="Enter PAN"
              className="font-mono font-medium bg-transparent outline-none w-28 uppercase placeholder:text-muted-foreground/50"
            />
          </div>
          <select value={fyIndex} onChange={e => setFyIndex(Number(e.target.value))}
            className="text-sm border rounded-lg px-3 py-1.5 bg-background">
            {FY_OPTIONS.map((f, i) => <option key={f.year} value={i}>{f.label}</option>)}
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />PDF<ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {activeTab === 'unrealized' ? (<>
                <DropdownMenuItem onClick={() => handleDownloadPDF('summary')}>Unrealized PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadPDF('v2')}>Unrealized PDF V2 (Post 23 Jul 2024)</DropdownMenuItem>
              </>) : (<>
                <DropdownMenuItem onClick={() => handleDownloadPDF('detailed')}>Detailed PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownloadPDF('summary')}>Summary PDF</DropdownMenuItem>
              </>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="realized">Realized Gains</TabsTrigger>
          <TabsTrigger value="realizedV2">Realized Gains V2</TabsTrigger>
          <TabsTrigger value="unrealized">Unrealized Gains</TabsTrigger>
          <TabsTrigger value="unrealizedV2">Unrealized Gains V2</TabsTrigger>
          <TabsTrigger value="unrealizedSbV2">Unrealized SB V2</TabsTrigger>
        </TabsList>

        <TabsContent value="realized">
          {v1Loading ? <LoadingState /> : v1Error ? (
            <ErrorState message={v1Error} onRetry={() => { v1CacheRef.current = {}; fetchV1(FY_OPTIONS[fyIndex].year); }} />
          ) : !v1Result ? (
            <div className="p-10 text-center text-muted-foreground text-sm">No data loaded — click Refresh</div>
          ) : (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard label="Total Gain / Loss" value={fmt(v1TotalGain)} color={v1TotalGain >= 0 ? 'text-green-600' : 'text-red-500'} icon={<TrendingUp className="w-4 h-4" />} />
              <SummaryCard label="Equity LTCG" value={fmt(v1EquityLTCG)} color={v1EquityLTCG >= 0 ? 'text-green-600' : 'text-red-500'} />
              <SummaryCard label="Equity STCG" value={fmt(v1EquitySTCG)} color={v1EquitySTCG >= 0 ? 'text-green-600' : 'text-red-500'} />
              <SummaryCard label="Total STT" value={fmt(v1STT)} color="text-orange-500" />
            </div>
            <Card><CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/40">
                  {['Investor','Scheme','Folio','ISIN','Section','Buy Date','Sell Date','Units','Buy NAV','Sell NAV','Purchase Amt','Sell Amt','Actual Gain','Taxable Gain','Adj. Purchase','Days','GF','STT','TDS','Type'].map(h => (
                    <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap text-xs">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {v1Rows.length === 0 ? <EmptyRow cols={20} label={`No realized gains for ${FY_OPTIONS[fyIndex].label}`} /> :
                    v1Rows.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{row.investorName ?? '-'}</td>
                        <td className="p-3 font-medium max-w-[180px] truncate" title={row.schemeName}>{row.schemeName}</td>
                        <td className="p-3 text-muted-foreground text-xs">{row.folioNo}</td>
                        <td className="p-3 text-muted-foreground text-xs font-mono">{row.isinNo}</td>
                        <td className="p-3"><Badge variant="outline" className="text-xs whitespace-nowrap">{row.section}</Badge></td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap text-xs">{fmtApiDate(row.purchaseDate)}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap text-xs">{fmtApiDate(row.sellDate)}</td>
                        <td className="p-3">{fmtNum(row.units, 4)}</td>
                        <td className="p-3">₹{fmtNum(row.purchaseNav, 4)}</td>
                        <td className="p-3">₹{fmtNum(row.sellNav, 4)}</td>
                        <td className="p-3">{fmt(row.purchaseAmount)}</td>
                        <td className="p-3">{fmt(row.sellAmount)}</td>
                        <td className={`p-3 font-semibold ${row.actualGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(row.actualGain)}</td>
                        <td className={`p-3 font-semibold ${row.taxableGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(row.taxableGain)}</td>
                        <td className="p-3">{fmt(row.adjustedPurchaseAmount)}</td>
                        <td className="p-3 text-muted-foreground">{row.days}</td>
                        <td className="p-3 text-center text-xs">{row.isGrandfathered ? '✓' : '—'}</td>
                        <td className="p-3 text-xs text-muted-foreground">{row.stt != null ? fmt(row.stt) : '—'}</td>
                        <td className="p-3 text-xs text-muted-foreground">{row.tds != null ? fmt(row.tds) : '—'}</td>
                        <td className="p-3"><Badge className={`text-xs ${typeStyle[row.type]}`}>{row.type}</Badge></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent></Card>
          </>)}
        </TabsContent>

        <TabsContent value="realizedV2">
          {v2Loading ? <LoadingState /> : v2Error ? (
            <ErrorState message={v2Error} onRetry={() => { v2CacheRef.current = {}; fetchV2(FY_OPTIONS[fyIndex].year); }} />
          ) : (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard label="Total Realized Gain" value={fmt(v2Sum.totalGain)} color={v2Sum.totalGain >= 0 ? 'text-green-600' : 'text-red-500'} icon={<TrendingUp className="w-4 h-4" />} />
              <SummaryCard label="LTCG" value={fmt(v2Sum.ltcg)} color="text-[#0D3B66]" />
              <SummaryCard label="STCG" value={fmt(v2Sum.stcg)} color="text-[#11B5E4]" />
              <SummaryCard label="Total STT" value={fmt(v2Sum.stt)} color="text-orange-500" />
            </div>
            {!v2Result || !v2Result.data || v2Result.data.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">
                {!v2Result ? 'No data loaded — click Refresh to load' : `No realized gains data for ${FY_OPTIONS[fyIndex].label}`}
              </div>
            ) : (
              <div className="space-y-6">
                {v2Result?.data?.map((investor: any, invIdx: number) => (
                  <div key={invIdx}>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-base font-bold">{investor.applicantName}</h2>
                      <span className="text-xs text-muted-foreground">PAN UID: {investor.uid?.slice(0, 8)}…</span>
                    </div>
                    <div className="space-y-4">
                      {investor.data?.map((category: any, catIdx: number) => {
                        const isShort = (category.gainType ?? '').toLowerCase().includes('short');
                        const gainType = isShort ? 'STCG' : 'LTCG';
                        return (
                          <Card key={catIdx}>
                            <CardContent className="p-4">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div>
                                  <p className="text-sm font-semibold">{category.name}</p>
                                  <p className="text-xs text-muted-foreground">Category: {category.category}</p>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Sell Amt</p>
                                    <p className="text-sm font-medium">{fmt(category.sellAmount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Actual Gain</p>
                                    <p className={`text-sm font-bold ${(category.actualGain ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(category.actualGain ?? 0)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Taxable Gain</p>
                                    <p className={`text-sm font-bold ${(category.taxableGain ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(category.taxableGain ?? 0)}</p>
                                  </div>
                                  <Badge className={`text-xs ${typeStyle[gainType]}`}>{gainType}</Badge>
                                </div>
                              </div>
                              <div className="overflow-x-auto rounded-lg border">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="bg-muted/40 border-b">
                                      {['Scheme','Folio','Buy Date','Sell Date','Units','Buy NAV','Sell NAV','Jan18 NAV','Purchase Amt','Sell Amt','Adj. Purchase','Actual Gain','Taxable Gain','Days','GF','STT'].map(h => (
                                        <th key={h} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {category.data?.flatMap((scheme: any, schIdx: number) =>
                                      (scheme.fifo ?? []).map((item: any, rowIdx: number) => (
                                        <tr key={`${schIdx}-${rowIdx}`} className="border-b hover:bg-muted/30">
                                          <td className="px-3 py-2 font-medium max-w-[160px] truncate" title={scheme.schemeName}>{scheme.schemeName}</td>
                                          <td className="px-3 py-2 text-muted-foreground">{scheme.folioNo}</td>
                                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{fmtDate(item.purchaseDate ?? item.purchaseNavDate)}</td>
                                          <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{fmtDate(item.sellDate ?? item.sellNavDate)}</td>
                                          <td className="px-3 py-2">{fmtNum(item.strikedUnits ?? item.units, 4)}</td>
                                          <td className="px-3 py-2">₹{fmtNum(item.purchaseNav, 4)}</td>
                                          <td className="px-3 py-2">₹{fmtNum(item.sellNav, 4)}</td>
                                          <td className="px-3 py-2">{item.jan18Nav ? `₹${fmtNum(item.jan18Nav, 4)}` : '—'}</td>
                                          <td className="px-3 py-2">{fmt(item.purchaseAmount)}</td>
                                          <td className="px-3 py-2">{fmt(item.sellAmount)}</td>
                                          <td className="px-3 py-2">{fmt(item.adjustedPurchaseAmount)}</td>
                                          <td className={`px-3 py-2 font-semibold ${item.actualGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(item.actualGain)}</td>
                                          <td className={`px-3 py-2 font-semibold ${item.taxableGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(item.taxableGain)}</td>
                                          <td className="px-3 py-2 text-muted-foreground">{item.days}</td>
                                          <td className="px-3 py-2 text-center">{item.isGrandfathered ? '✓' : '—'}</td>
                                          <td className="px-3 py-2">{item.STT != null ? fmt(item.STT) : '—'}</td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>)}
        </TabsContent>

        <TabsContent value="unrealized">
          {urLoading ? <LoadingState /> : urError ? (
            <ErrorState message={urError} onRetry={() => { urCacheRef.current = null; fetchUnrealized(); }} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard label="Total Purchase Amount" value={fmt(urSum.purchaseAmount)} color="text-foreground" />
                <SummaryCard label="Current Value" value={fmt(urSum.currentValue)} color="text-[#0D3B66]" icon={<TrendingUp className="w-4 h-4" />} />
                <SummaryCard label="Actual Capital Gain" value={fmt(urSum.actualGain)}
                  color={urSum.actualGain >= 0 ? 'text-green-600' : 'text-red-500'}
                  icon={urSum.actualGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />} />
                <SummaryCard label="Taxable Gain" value={fmt(urSum.taxableGain)} color="text-orange-500" />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => { urCacheRef.current = null; fetchUnrealized(); }}>
                  <RefreshCw className="w-3 h-3" /> Refresh
                </Button>
              </div>
              {urResult
                ? <Card><CardContent className="p-5"><UnrealizedCategoryPanel result={urResult} /></CardContent></Card>
                : <div className="p-10 text-center text-muted-foreground text-sm">No unrealized gains data available.</div>
              }
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="unrealizedV2">
          {urV2Loading ? <LoadingState /> : urV2Error ? (
            <ErrorState message={urV2Error} onRetry={() => { urV2CacheRef.current = null; fetchUnrealizedV2(); }} />
          ) : urV2Result ? (
            <UnrealizedV2Panel result={urV2Result} onRefresh={() => { urV2CacheRef.current = null; fetchUnrealizedV2(); }} />
          ) : (
            <div className="p-10 text-center text-muted-foreground text-sm">Click refresh to load data</div>
          )}
        </TabsContent>

        <TabsContent value="unrealizedSbV2">
          {urSbV2Loading ? <LoadingState /> : urSbV2Error ? (
            <ErrorState message={urSbV2Error} onRetry={() => { urSbV2CacheRef.current = null; fetchUnrealizedSbV2(); }} />
          ) : urSbV2Result ? (
            <UnrealizedV2Panel result={urSbV2Result} onRefresh={() => { urSbV2CacheRef.current = null; fetchUnrealizedSbV2(); }} />
          ) : (
            <div className="p-10 text-center text-muted-foreground text-sm">Click refresh to load data</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MFCapitalGainsPage;
