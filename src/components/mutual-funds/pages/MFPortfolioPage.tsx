import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, AlertCircle, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Wallet, BarChart2, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2, Calendar, SlidersHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { resolvePAN, DEMO_PANS } from '../hooks/useDemoPAN';
import { useToast } from '@/hooks/use-toast';
import {
  fetchPortfolioReturns,
  fetchPortfolioReturnsDetailed,
  fetchSharesAndBonds,
  fetchFixedDeposit,
  fetchOtherAssets,
  fetchJourneyData,
  PortfolioError,
} from '@/services/portfolio.service';
import type { PortfolioReturnRow, JourneyDataPoint } from '@/types/portfolio';

// ── Formatters ────────────────────────────────────────────────────────────────
const fmt = (n: number) => {
  if (n === null || n === undefined || isNaN(n)) return '₹0.00';
  return `₹${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtPct = (n: number) => {
  if (n === null || n === undefined || isNaN(n)) return '0.000%';
  return `${n >= 0 ? '+' : ''}${n.toFixed(3)}%`;
};
const fmtDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString('en-IN'); } catch { return iso ?? '-'; }
};
const gainColor = (n: number) => (n ?? 0) >= 0 ? 'text-green-600' : 'text-red-500';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Section { data: PortfolioReturnRow[]; summary: Record<string, unknown>; }
const EMPTY_SECTION: Section = { data: [], summary: {} };

// ── Summary strip ─────────────────────────────────────────────────────────────
const SummaryStrip: React.FC<{ summary: Record<string, any> }> = ({ summary }) => {
  const gain = summary.gain ?? 0;
  const isUp = gain >= 0;
  const items = [
    { label: 'Purchase Value',  value: fmt(summary.purchaseValue ?? 0), sub: null, up: true },
    { label: 'Current Value',   value: fmt(summary.currentValue ?? 0),  sub: null, up: true },
    { label: 'Gain / Loss',     value: `${isUp ? '+' : ''}${fmt(gain)}`, sub: fmtPct(summary.absoluteReturn ?? 0), up: isUp },
    { label: 'CAGR',            value: fmtPct(summary.CAGR ?? 0), sub: null, up: (summary.CAGR ?? 0) >= 0 },
    { label: '1-Day Change',    value: `${(summary.oneDayChange ?? 0) >= 0 ? '+' : ''}${fmt(summary.oneDayChange ?? 0)}`, sub: null, up: (summary.oneDayChange ?? 0) >= 0 },
  ];
  return (
    <div className="flex flex-wrap gap-3 mb-5 p-4 rounded-xl bg-muted/30 border">
      {items.map((item, i) => (
        <div key={i} className="flex-1 min-w-[120px]">
          <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
          <p className={`text-sm font-bold ${i < 2 ? 'text-foreground' : item.up ? 'text-green-600' : 'text-red-500'}`}>{item.value}</p>
          {item.sub && <p className={`text-xs ${item.up ? 'text-green-500' : 'text-red-400'}`}>{item.sub}</p>}
        </div>
      ))}
    </div>
  );
};

// ── By Folio Table ────────────────────────────────────────────────────────────
const ByFolioTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Group rows by folioNo
  const folioMap: Record<string, any[]> = {};
  rows.forEach(row => {
    const key = row.folioNo || 'Unknown';
    if (!folioMap[key]) folioMap[key] = [];
    folioMap[key].push(row);
  });

  // Filter folios by search
  const filteredFolios = Object.entries(folioMap).filter(([folio, schemes]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      folio.toLowerCase().includes(q) ||
      schemes.some(s =>
        [s.schemeName, s.fundName, s.applicantName, s.category2]
          .some(v => v?.toLowerCase().includes(q))
      )
    );
  });

  const toggle = (folio: string) =>
    setExpanded(prev => ({ ...prev, [folio]: !prev[folio] }));

  // Folio-level aggregation
  const folioSummary = (schemes: any[]) => ({
    purchaseValue: schemes.reduce((s, r) => s + (r.purchaseValue ?? 0), 0),
    currentValue:  schemes.reduce((s, r) => s + (r.currentValue ?? r.currentAmount ?? 0), 0),
    gain:          schemes.reduce((s, r) => s + (r.gain ?? 0), 0),
    units:         schemes.reduce((s, r) => s + (r.balanceUnits ?? 0), 0),
  });

  if (filteredFolios.length === 0) {
    return (
      <Card><CardContent className="p-12 text-center text-muted-foreground">
        No folio data found
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-3">
      {filteredFolios.map(([folio, schemes]) => {
        const agg = folioSummary(schemes);
        const isOpen = expanded[folio] ?? true;
        const gainPct = agg.purchaseValue > 0
          ? ((agg.currentValue - agg.purchaseValue) / agg.purchaseValue) * 100
          : 0;
        const rep = schemes[0]; // representative row for fund name / applicant

        return (
          <Card key={folio} className="overflow-hidden border">
            {/* ── Folio header ── */}
            <button
              className="w-full text-left"
              onClick={() => toggle(folio)}
            >
              <div className="flex items-center justify-between p-4 bg-[#0D3B66] text-white hover:bg-[#0a2f52] transition-colors">
                <div className="flex items-center gap-3">
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 shrink-0" />
                    : <ChevronRight className="w-4 h-4 shrink-0" />}
                  <div>
                    <p className="font-semibold text-sm">Folio: {folio}</p>
                    <p className="text-xs opacity-75 mt-0.5">
                      {rep?.fundName} · {rep?.applicantName}
                      {rep?.pan ? ` · PAN: ${rep.pan}` : ''}
                    </p>
                  </div>
                  <Badge className="ml-2 bg-white/20 text-white text-xs border-0">
                    {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Folio-level numbers */}
                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold">{fmt(agg.currentValue)}</p>
                  <div className="flex gap-4 justify-end mt-0.5">
                    <span className={`text-xs font-semibold ${agg.gain >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {agg.gain >= 0 ? '+' : ''}{fmt(agg.gain)}
                    </span>
                    <span className={`text-xs ${gainPct >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(2)}%
                    </span>
                    <span className="text-xs opacity-75">{agg.units.toFixed(3)} units</span>
                  </div>
                </div>
              </div>
            </button>

            {/* ── Schemes under this folio ── */}
            {isOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b">
                      <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Scheme Name</th>
                      <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Category</th>
                      <th className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">Txn Type</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Purchase Date</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Units</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">NAV</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Invested</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Current Value</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Gain / Loss</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">Abs Return</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">CAGR</th>
                      <th className="text-right p-3 font-medium text-muted-foreground whitespace-nowrap">1D Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 max-w-[260px]">
                          <p className="font-medium truncate" title={row.schemeName}>{row.schemeName}</p>
                          <p className="text-xs text-muted-foreground truncate">{row.isinNo}</p>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {row.category2 || row.objectiveName || '—'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">{row.txnType || '—'}</Badge>
                        </td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                          {fmtDate(row.purchaseDate)}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {(row.balanceUnits ?? 0).toFixed(3)}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          ₹{(row.currentNav ?? 0).toFixed(4)}
                          <p className="text-xs opacity-60">{fmtDate(row.currentNavDate)}</p>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue)}</td>
                        <td className="p-3 text-right font-semibold whitespace-nowrap">
                          {fmt(row.currentValue ?? row.currentAmount ?? 0)}
                        </td>
                        <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                          {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
                        </td>
                        <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>
                          {fmtPct(row.absoluteReturn ?? 0)}
                        </td>
                        <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>
                          {fmtPct(row.CAGR ?? 0)}
                        </td>
                        <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.oneDayChange)}`}>
                          {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Folio subtotal row */}
                  <tfoot>
                    <tr className="bg-muted/40 font-semibold border-t-2">
                      <td colSpan={6} className="p-3 text-right text-muted-foreground text-xs">
                        Folio Total
                      </td>
                      <td className="p-3 text-right">{fmt(agg.purchaseValue)}</td>
                      <td className="p-3 text-right font-bold">{fmt(agg.currentValue)}</td>
                      <td className={`p-3 text-right font-bold ${gainColor(agg.gain)}`}>
                        {agg.gain >= 0 ? '+' : ''}{fmt(agg.gain)}
                      </td>
                      <td className={`p-3 text-right ${gainColor(gainPct)}`}>
                        {gainPct >= 0 ? '+' : ''}{gainPct.toFixed(3)}%
                      </td>
                      <td colSpan={2} className="p-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// ── Simple flat table for Shares / FD / Other Assets ─────────────────────────
const FlatTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r =>
    !search || [r.schemeName, r.fundName, r.folioNo, r.applicantName, r.fixedAssetName, r.assetName]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const headers = ['Name', 'Folio / Ref', 'Applicant', 'Category', 'Invested', 'Current Value', 'Gain/Loss', 'CAGR', 'Abs Return'];
  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {headers.map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0
            ? <tr><td colSpan={headers.length} className="p-8 text-center text-muted-foreground">No data found</td></tr>
            : filtered.map((row, i) => (
              <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium max-w-[240px]">
                  <p className="truncate">{row.schemeName || row.fixedAssetName || row.assetName || '—'}</p>
                  <p className="text-xs text-muted-foreground">{row.fundName || row.objectiveName || ''}</p>
                </td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{row.folioNo || row.referenceNo || '—'}</td>
                <td className="p-3 text-muted-foreground whitespace-nowrap">{row.applicantName || '—'}</td>
                <td className="p-3"><Badge variant="outline" className="text-xs">{row.category2 || row.objectiveName || '—'}</Badge></td>
                <td className="p-3 whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
                <td className="p-3 font-semibold whitespace-nowrap">{fmt(row.currentValue ?? row.currentAmount ?? 0)}</td>
                <td className={`p-3 font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                  {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
                </td>
                <td className={`p-3 font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
                <td className={`p-3 whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── By Scheme Table ──────────────────────────────────────────────────
const BySchemeTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.schemeName, r.fundName, r.category2, r.objectiveName, r.folioNo, r.applicantName]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No scheme data found</CardContent></Card>;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Scheme Name', 'Fund', 'Category', 'Txn Type', 'Units', 'NAV', 'Invested', 'Current Value', 'Gain / Loss', 'Abs Return', 'CAGR', '1D Change', 'Share %'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 max-w-[240px]">
                <p className="font-medium truncate" title={row.schemeName}>{row.schemeName}</p>
                <p className="text-xs text-muted-foreground">{row.isinNo}</p>
              </td>
              <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{row.fundName}</td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {row.category2 || row.objectiveName || '—'}
                </Badge>
              </td>
              <td className="p-3"><Badge variant="secondary" className="text-xs">{row.txnType || '—'}</Badge></td>
              <td className="p-3 text-right text-muted-foreground">{(row.balanceUnits ?? 0).toFixed(3)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                ₹{(row.currentNav ?? 0).toFixed(4)}
                <p className="text-xs opacity-60">{fmtDate(row.currentNavDate)}</p>
              </td>
              <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
              <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? row.currentAmount ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
              </td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.oneDayChange)}`}>
                {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
              </td>
              <td className="p-3 text-right text-muted-foreground">{(row.share ?? 0).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── By Investor Table (grouped by appid) ────────────────────────────────────
const ByInvestorTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.applicantName, r.schemeName, r.fundName, r.category2, r.pan, r.folioNo]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No investor data found</CardContent></Card>;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Investor', 'PAN', 'Scheme', 'Fund', 'Category', 'Txn Type', 'Units', 'NAV', 'Invested', 'Current Value', 'Gain / Loss', 'Abs Return', 'CAGR', '1D Change'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 whitespace-nowrap font-medium">{row.applicantName || '—'}</td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{row.pan || '—'}</td>
              <td className="p-3 max-w-[220px]">
                <p className="font-medium truncate" title={row.schemeName}>{row.schemeName || '—'}</p>
                <p className="text-xs text-muted-foreground">{row.isinNo}</p>
              </td>
              <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{row.fundName || '—'}</td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {row.category2 || row.objectiveName || '—'}
                </Badge>
              </td>
              <td className="p-3"><Badge variant="secondary" className="text-xs">{row.txnType || '—'}</Badge></td>
              <td className="p-3 text-right text-muted-foreground">{(row.balanceUnits ?? 0).toFixed(3)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                ₹{(row.currentNav ?? 0).toFixed(4)}
                <p className="text-xs opacity-60">{fmtDate(row.currentNavDate)}</p>
              </td>
              <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
              <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? row.currentAmount ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
              </td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.oneDayChange)}`}>
                {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── Other Assets Table (getPortfolioForOtherAssets) ───────────────────────
const OtherAssetsTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const ASSET_TYPE: Record<string, string> = {
    PM: 'PMS', RE: 'Real Estate', GD: 'Gold', GN: 'General',
  };

  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.assetName, r.applicantName, r.assetType, r.goalAssignedTo, r.category2]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No other assets data found</CardContent></Card>;

  return (
    <div className="space-y-3">
      {filtered.map((row, i) => {
        const key = row.assetid || String(i);
        const isOpen = expanded[key] ?? false;
        return (
          <Card key={key} className="overflow-hidden border">
            <button className="w-full text-left" onClick={() => toggle(key)}>
              <div className="flex items-center justify-between p-4 bg-[#0D3B66] text-white hover:bg-[#0a2f52] transition-colors">
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                  <div>
                    <p className="font-semibold text-sm">{row.assetName || '—'}</p>
                    <p className="text-xs opacity-75 mt-0.5">
                      {ASSET_TYPE[row.assetType] || row.assetType} · {row.applicantName} · {row.goalAssignedTo}
                    </p>
                  </div>
                  <Badge className="ml-2 bg-white/20 text-white text-xs border-0">
                    XIRR: {row.XIRR != null ? `${row.XIRR}%` : '—'}
                  </Badge>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold">{fmt(row.currentValue ?? 0)}</p>
                  <div className="flex gap-4 justify-end mt-0.5">
                    <span className={`text-xs font-semibold ${gainColor(row.gain)}`}>
                      {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
                    </span>
                    <span className="text-xs opacity-75">{row.txns?.length ?? 0} txn{(row.txns?.length ?? 0) !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Summary row always visible */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-b bg-muted/20 text-sm">
              <div><p className="text-xs text-muted-foreground">Invested</p><p className="font-semibold">{fmt(row.purchaseValue ?? 0)}</p></div>
              <div><p className="text-xs text-muted-foreground">Current Value</p><p className="font-semibold">{fmt(row.currentValue ?? 0)}</p></div>
              <div><p className="text-xs text-muted-foreground">Sell Value</p><p className="font-semibold">{fmt(row.sellValue ?? 0)}</p></div>
              <div><p className="text-xs text-muted-foreground">Start Date</p><p className="font-semibold">{fmtDate(row.startDate)}</p></div>
            </div>

            {/* Transactions expanded */}
            {isOpen && row.txns?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b">
                      {['Investor', 'PAN', 'Txn Date', 'Amount', 'Equity%', 'Debt%', 'Gold%', 'Type'].map(h => (
                        <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {row.txns.map((t: any, j: number) => (
                      <tr key={j} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium">{t.investorName || t.name || '—'}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{t.pan || '—'}</td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmtDate(t.txnDate)}</td>
                        <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(t.amount)}`}>
                          {(t.amount ?? 0) >= 0 ? '+' : ''}{fmt(Math.abs(t.amount ?? 0))}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">{t.equityPercent ?? 0}%</td>
                        <td className="p-3 text-right text-muted-foreground">{t.debtPercent ?? 0}%</td>
                        <td className="p-3 text-right text-muted-foreground">{t.goldPercent ?? 0}%</td>
                        <td className="p-3"><Badge variant="secondary" className="text-xs">{t.pdType || '—'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// ── Fixed Deposit Table (getPortfolioReturnsForFixedAssets) ─────────────────
const FixedDepositTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.fixedAssetName, r.scheme, r.applicantName, r.fdType, r.category, r.objectiveName, r.referenceNo]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No fixed deposit data found</CardContent></Card>;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Bank / Scheme', 'FD Type', 'Ref No', 'Allotment Date', 'Maturity Date', 'Tenure', 'Rate', 'Invested', 'Current Value', 'Dividend', 'Gain', 'Abs Return', 'CAGR', 'Avg Days'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 min-w-[160px]">
                <p className="font-medium">{row.fixedAssetName || row.scheme || '—'}</p>
                <p className="text-xs text-muted-foreground">{row.objectiveName}</p>
              </td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs whitespace-nowrap">{row.fdType || '—'}</Badge>
              </td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{row.referenceNo || '—'}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmtDate(row.allotmentDate)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmtDate(row.maturityDate)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                {row.month ? `${row.month}M` : ''}{row.day ? ` ${row.day}D` : ''}
              </td>
              <td className="p-3 text-right font-semibold text-[#0D3B66]">{row.rateOfInterest ?? '—'}%</td>
              <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
              <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? 0)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmt(row.dividend ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
              </td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
              <td className="p-3 text-right text-muted-foreground">{Math.round(row.avgHoldingDays ?? 0)}d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── Shares & Bonds Table (getPortFolioReturnsForSharesAndBonds) ─────────────
const SharesBondsTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.schemeName, r.applicantName, r.pan, r.category2, r.objectiveName, r.isinNo, r.txnType]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No shares & bonds data found</CardContent></Card>;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Scrip / Bond', 'ISIN', 'Investor', 'Category', 'Txn', 'Purchase Date', 'Units', 'Buy Price', 'Cur Price', 'Invested', 'Current Value', 'Dividend', 'Gain/Loss', 'Abs Return', 'CAGR', '1D Change'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 max-w-[240px]">
                <p className="font-medium truncate" title={row.schemeName}>{row.schemeName || '—'}</p>
                <p className="text-xs text-muted-foreground">{row.objectiveName || row.fundName}</p>
              </td>
              <td className="p-3 font-mono text-xs text-muted-foreground">{row.isinNo || '—'}</td>
              <td className="p-3 whitespace-nowrap">
                <p className="font-medium">{row.applicantName || '—'}</p>
                <p className="text-xs text-muted-foreground">{row.pan}</p>
              </td>
              <td className="p-3"><Badge variant="outline" className="text-xs whitespace-nowrap">{row.category2 || '—'}</Badge></td>
              <td className="p-3"><Badge variant="secondary" className="text-xs">{row.txnType || '—'}</Badge></td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmtDate(row.purchaseDate)}</td>
              <td className="p-3 text-right text-muted-foreground">{(row.balanceUnits ?? 0).toLocaleString('en-IN')}</td>
              <td className="p-3 text-right text-muted-foreground">₹{(row.nav ?? row.avgCost ?? 0).toLocaleString('en-IN')}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                ₹{(row.currentNav ?? 0).toLocaleString('en-IN')}
                <p className="text-xs opacity-60">{fmtDate(row.currentNavDate)}</p>
              </td>
              <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
              <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? row.currentAmount ?? 0)}</td>
              <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmt(row.dividend ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
              </td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.oneDayChange)}`}>
                {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── By Transaction Table (getPortfolioReturnsDetailed, groupBy=1008) ──────────
const ByTransactionTable: React.FC<{ investors: any[]; search: string }> = ({ investors, search }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  // Flatten the 4-level tree: investor → subCategory → folioGroup → txn
  const investorMap: Record<string, { summary: any; txns: any[] }> = {};
  investors.forEach(inv => {
    const key = inv.pan || inv.uid || inv.applicantName || 'unknown';
    if (!investorMap[key]) investorMap[key] = { summary: inv.summary, txns: [] };
    (inv.data || []).forEach((subCat: any) => {
      (subCat.data || []).forEach((folioGroup: any) => {
        (folioGroup.data || []).forEach((txn: any) => {
          investorMap[key].txns.push(txn);
        });
      });
    });
  });

  const entries = Object.entries(investorMap).filter(([key, { txns }]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      key.toLowerCase().includes(q) ||
      txns.some(t =>
        [t.applicantName, t.schemeName, t.fundName, t.folioNo, t.txnType, t.category2]
          .some(v => v?.toLowerCase().includes(q))
      )
    );
  });

  if (entries.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No transaction data found</CardContent></Card>;

  return (
    <div className="space-y-3">
      {entries.map(([key, { summary, txns }]) => {
        const isOpen = expanded[key] ?? true;
        const rep = txns[0];
        return (
          <Card key={key} className="overflow-hidden border">
            <button className="w-full text-left" onClick={() => toggle(key)}>
              <div className="flex items-center justify-between p-4 bg-[#0D3B66] text-white hover:bg-[#0a2f52] transition-colors">
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                  <div>
                    <p className="font-semibold text-sm">{rep?.applicantName || key}</p>
                    <p className="text-xs opacity-75 mt-0.5">PAN: {key} · {txns.length} transaction{txns.length !== 1 ? 's' : ''}</p>
                  </div>
                  <Badge className="ml-2 bg-white/20 text-white text-xs border-0">
                    CAGR: {fmtPct(summary?.CAGR ?? 0)}
                  </Badge>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold">{fmt(summary?.currentValue ?? 0)}</p>
                  <div className="flex gap-4 justify-end mt-0.5">
                    <span className={`text-xs font-semibold ${gainColor(summary?.gain)}`}>
                      {(summary?.gain ?? 0) >= 0 ? '+' : ''}{fmt(summary?.gain ?? 0)}
                    </span>
                    <span className={`text-xs ${gainColor(summary?.absoluteReturn)}`}>
                      {fmtPct(summary?.absoluteReturn ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b">
                      {['Scheme', 'Fund', 'Category', 'Txn Type', 'Purchase Date', 'Folio', 'Units', 'Buy NAV', 'Cur NAV', 'Invested', 'Current Value', 'Gain/Loss', 'Abs Return', 'CAGR', 'Avg Days'].map(h => (
                        <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((txn, i) => (
                      <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 max-w-[220px]">
                          <p className="font-medium truncate" title={txn.schemeName}>{txn.schemeName || '—'}</p>
                          <p className="text-xs text-muted-foreground">{txn.isinNo}</p>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{txn.fundName || '—'}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {txn.category2 || txn.objectiveName || '—'}
                          </Badge>
                        </td>
                        <td className="p-3"><Badge variant="secondary" className="text-xs">{txn.txnType || '—'}</Badge></td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">{fmtDate(txn.purchaseDate)}</td>
                        <td className="p-3 font-mono text-xs text-muted-foreground">{txn.folioNo || '—'}</td>
                        <td className="p-3 text-right text-muted-foreground">{(txn.balanceUnits ?? 0).toFixed(3)}</td>
                        <td className="p-3 text-right text-muted-foreground">₹{(txn.nav ?? txn.avgCost ?? 0).toFixed(4)}</td>
                        <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                          ₹{(txn.currentNav ?? 0).toFixed(4)}
                          <p className="text-xs opacity-60">{fmtDate(txn.currentNavDate)}</p>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">{fmt(txn.purchaseValue ?? 0)}</td>
                        <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(txn.currentValue ?? txn.currentAmount ?? 0)}</td>
                        <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(txn.gain)}`}>
                          {(txn.gain ?? 0) >= 0 ? '+' : ''}{fmt(txn.gain ?? 0)}
                        </td>
                        <td className={`p-3 text-right whitespace-nowrap ${gainColor(txn.absoluteReturn)}`}>{fmtPct(txn.absoluteReturn ?? 0)}</td>
                        <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(txn.CAGR)}`}>{fmtPct(txn.CAGR ?? 0)}</td>
                        <td className="p-3 text-right text-muted-foreground">{Math.round(txn.avgHoldingDays ?? 0)}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

// ── By Sub-Category Table (grouped by objectiveid / objectiveName) ────────────
const SubCategoryTable: React.FC<{ rows: any[]; search: string }> = ({ rows, search }) => {
  const filtered = rows.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.objectiveName, r.category2, r.dueDiligence, r.schemeName, r.fundName]
      .some(v => v?.toLowerCase().includes(q));
  });

  if (filtered.length === 0)
    return <Card><CardContent className="p-12 text-center text-muted-foreground">No sub-category data found</CardContent></Card>;

  return (
    <Card><CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b">
            {['Sub-Category', 'Broad Category', 'Invested', 'Current Value', 'Gain / Loss', 'Abs Return', 'CAGR', '1D Change', 'Share %'].map(h => (
              <th key={h} className="text-left p-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, i) => (
            <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
              <td className="p-3 min-w-[180px]">
                <p className="font-semibold">{row.objectiveName || '—'}</p>
                <p className="text-xs text-muted-foreground">{row.schemeName}</p>
              </td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {row.category2 || row.dueDiligence || '—'}
                </Badge>
              </td>
              <td className="p-3 text-right whitespace-nowrap">{fmt(row.purchaseValue ?? 0)}</td>
              <td className="p-3 text-right font-semibold whitespace-nowrap">{fmt(row.currentValue ?? row.currentAmount ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.gain)}`}>
                {(row.gain ?? 0) >= 0 ? '+' : ''}{fmt(row.gain ?? 0)}
              </td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.absoluteReturn)}`}>{fmtPct(row.absoluteReturn ?? 0)}</td>
              <td className={`p-3 text-right font-semibold whitespace-nowrap ${gainColor(row.CAGR)}`}>{fmtPct(row.CAGR ?? 0)}</td>
              <td className={`p-3 text-right whitespace-nowrap ${gainColor(row.oneDayChange)}`}>
                {(row.oneDayChange ?? 0) >= 0 ? '+' : ''}{fmt(row.oneDayChange ?? 0)}
              </td>
              <td className="p-3 text-right text-muted-foreground">{(row.share ?? 0).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent></Card>
  );
};

// ── Journey types & config ───────────────────────────────────────────────────
const PERIODS: { label: string; graphPeriod: string }[] = [
  { label: 'This Month',      graphPeriod: 'thisMonth' },
  { label: 'Current FY',      graphPeriod: 'currentFY' },
  { label: 'Last FY',         graphPeriod: 'lastFY' },
  { label: 'Last 1 Year',     graphPeriod: 'lastOneYear' },
  { label: 'Since Inception', graphPeriod: 'sinceInception' },
];
type DataPoint = JourneyDataPoint;

const fmtAxisDate = (s: string) => {
  try { return new Date(s).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); } catch { return s; }
};
const yFmt = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (v >= 1_00_000)    return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)       return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v}`;
};

const JourneyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const aum = payload.find((p: any) => p.dataKey === 'AUM')?.value ?? 0;
  const inv = payload.find((p: any) => p.dataKey === 'netInvestment')?.value ?? 0;
  const gain = aum > 0 ? aum - inv : null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-sm min-w-[210px]">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {new Date(label).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
      <div className="space-y-1.5">
        {aum > 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />AUM</span>
            <span className="font-bold text-blue-600">₹{Math.abs(aum).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between gap-6">
          <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />Net Invested</span>
          <span className="font-semibold text-purple-600">₹{Math.abs(inv).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        {gain !== null && aum > 0 && (
          <div className="border-t border-gray-100 pt-1.5 flex justify-between gap-6">
            <span className="text-gray-500">Gain / Loss</span>
            <span className={`font-bold ${gain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {gain >= 0 ? '+' : ''}₹{Math.abs(gain).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


const Empty = ({ msg }: { msg: string }) => (
  <Card><CardContent className="p-12 text-center text-muted-foreground">{msg}</CardContent></Card>
);

const Spinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// ── Portfolio-level error pages ───────────────────────────────────────────────────────────────
const ClientNotFound: React.FC<{ pan: string }> = ({ pan }) => (
  <Card className="border-red-300 bg-red-50">
    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
      <AlertCircle className="w-10 h-10 text-red-500" />
      <div>
        <p className="text-xs text-muted-foreground mb-1">Portfolio &middot; PAN: {pan}</p>
        <h2 className="text-xl font-bold text-red-700 mb-2">❌ Client Not Found</h2>
        <p className="text-sm text-red-600 mb-4">We couldn&apos;t find any investor linked to this PAN.</p>
        <div className="text-left text-sm text-red-700 space-y-1 bg-red-100 rounded-lg p-4">
          <p className="font-semibold mb-2">Please verify:</p>
          <p>&bull; PAN Number</p>
          <p>&bull; Investor Name (if required)</p>
          <p>&bull; Family / PAN Wise selection</p>
          <p>&bull; Data Source</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NoPortfolioData: React.FC<{ pan: string }> = ({ pan }) => (
  <Card className="border-amber-300 bg-amber-50">
    <CardContent className="p-8 flex flex-col items-center text-center gap-3">
      <AlertCircle className="w-10 h-10 text-amber-500" />
      <div>
        <p className="text-xs text-muted-foreground mb-1">Portfolio &middot; PAN: {pan}</p>
        <h2 className="text-xl font-bold text-amber-700 mb-2">No Portfolio Data Found</h2>
        <p className="text-sm text-amber-600">This investor currently has no holdings.</p>
      </div>
    </CardContent>
  </Card>
);

const PortfolioErrorPage: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <Card className="border-red-300 bg-red-50">
    <CardContent className="p-8 flex flex-col items-center text-center gap-4">
      <AlertCircle className="w-10 h-10 text-red-500" />
      <div>
        <h2 className="text-xl font-bold text-red-700 mb-2">Unable to Load Portfolio</h2>
        <p className="text-sm text-red-600 mb-4">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>
      </div>
    </CardContent>
  </Card>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const DATA_SOURCE_OPTIONS = [
  { value: '0', label: 'All' },
  { value: '1', label: 'Mutual Fund' },
  { value: '2', label: 'PMS' },
  { value: '3', label: 'AIF' },
];

const MFPortfolioPage: React.FC = () => {
  const { toast } = useToast();
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(false);

  const [pan, setPan]           = useState(() => resolvePAN() ?? '');
  const [panInput, setPanInput] = useState(pan);
  const [endDate, setEndDate]   = useState(new Date().toISOString().split('T')[0]);
  const [dataSource, setDataSource] = useState<string>('0');
  const [panWise, setPanWise]   = useState<0 | 1>(1);
  const [investorName, setInvestorName] = useState('');
  const [holdingPeriod, setHoldingPeriod] = useState('');
  const [equityCode, setEquityCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('byFolio');
  const loadedTabs = React.useRef<Set<string>>(new Set());
  const panRef     = React.useRef(pan);

  // active filter values (applied on click)
  const [appliedFilters, setAppliedFilters] = useState({
    pan, endDate, dataSource: '0', panWise: 1 as 0 | 1,
    investorExactName: '', holdingPeriod: '', equityCode1: '',
  });

  // Portfolio-level error (from the primary folio fetch)
  const [portfolioError, setPortfolioError] = useState<{ kind: string; message: string } | null>(null);

  const buildF = (overrides?: Partial<typeof appliedFilters>) => {
    const f = { ...appliedFilters, ...overrides };
    return {
      endDate: f.endDate,
      pan: f.pan,
      panWiseData: f.panWise,
      dataSource: Number(f.dataSource),
      ...(f.investorExactName ? { investorExactName: f.investorExactName } : {}),
      ...(f.holdingPeriod     ? { holdingPeriod: f.holdingPeriod }         : {}),
      ...(f.equityCode1       ? { equityCode1: f.equityCode1 }             : {}),
    };
  };

  const applyFilters = () => {
    const p = panInput.trim().toUpperCase();
    if (!p) return;
    panRef.current = p;
    setPan(p);
    const next = {
      pan: p, endDate, dataSource, panWise,
      investorExactName: investorName.trim(),
      holdingPeriod,
      equityCode1: equityCode.trim(),
    };
    setAppliedFilters(next);
    setPortfolioError(null);
    loadedTabs.current = new Set();
    loadTab(activeTab, next);
  };

  const resetFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    setPanInput(pan);
    setEndDate(today);
    setDataSource('0');
    setPanWise(1);
    setInvestorName('');
    setHoldingPeriod('');
    setEquityCode('');
  };

  // ── Journey chart state ───────────────────────────────────────────────────
  const [graphPeriod, setGraphPeriod] = useState('sinceInception');
  const [journeyData, setJourneyData] = useState<DataPoint[]>([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState('');
  const journeyFetched = useRef(false);

  const loadJourneyData = async (gp = graphPeriod, p = panRef.current) => {
    setJourneyLoading(true);
    setJourneyError('');
    try {
      const data = await fetchJourneyData(p, gp, 1);
      setJourneyData(data);
    } catch (e: unknown) {
      setJourneyError(e instanceof Error ? e.message : 'Failed to load journey data');
    } finally {
      setJourneyLoading(false);
    }
  };

  // ── By Folio (InvestWell direct) ──────────────────────────────────────────
  const [folioData, setFolioData]       = useState<any[]>([]);
  const [folioSummary, setFolioSummary] = useState<Record<string, any>>({});
  const [folioLoading, setFolioLoading] = useState(false);
  const [folioError, setFolioError]     = useState('');

  const loadFolioData = async (f = appliedFilters) => {
    setFolioLoading(true);
    setFolioError('');
    setPortfolioError(null);
    try {
      const res = await fetchPortfolioReturns({ ...buildF(f) });
      setFolioData(res.data);
      setFolioSummary(res.summary as Record<string, unknown>);
      if (res.data.length === 0) setPortfolioError({ kind: 'NO_DATA', message: 'No Portfolio Data Found' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load folio data';
      const kind = e instanceof PortfolioError ? e.kind : 'API_ERROR';
      setFolioError(msg);
      setPortfolioError({ kind, message: msg });
    } finally {
      setFolioLoading(false);
    }
  };

  // ── By Scheme & Sub-Category share same PAN ─────────────────────────────
  const SCHEME_PAN = pan;
  const [schemeData, setSchemeData]       = useState<any[]>([]);
  const [schemeSummary, setSchemeSummary] = useState<Record<string, any>>({});
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [schemeError, setSchemeError]     = useState('');

  const loadSchemeData = async (f = appliedFilters) => {
    setSchemeLoading(true);
    setSchemeError('');
    try {
      const res = await fetchPortfolioReturns({ ...buildF(f) }, 'schid');
      setSchemeData(res.data);
      setSchemeSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setSchemeError(e instanceof Error ? e.message : 'Failed to load scheme data');
    } finally {
      setSchemeLoading(false);
    }
  };

  // ── By Investor ───────────────────────────────────────────────────────────
  const INVESTOR_PAN = pan;
  const [investorData, setInvestorData]       = useState<any[]>([]);
  const [investorSummary, setInvestorSummary] = useState<Record<string, any>>({});
  const [investorLoading, setInvestorLoading] = useState(false);
  const [investorError, setInvestorError]     = useState('');

  const loadInvestorData = async (f = appliedFilters) => {
    setInvestorLoading(true);
    setInvestorError('');
    try {
      const res = await fetchPortfolioReturns({ ...buildF(f) }, 'appid');
      setInvestorData(res.data);
      setInvestorSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setInvestorError(e instanceof Error ? e.message : 'Failed to load investor data');
    } finally {
      setInvestorLoading(false);
    }
  };

  // ── Shares & Bonds (getPortFolioReturnsForSharesAndBonds, group=schid) ─────
  // ── Fixed Deposit (getPortfolioReturnsForFixedAssets) ──────────────────────
  // ── Other Assets (getPortfolioForOtherAssets) ───────────────────────────
  const OA_PAN = pan;
  const [oaData, setOaData]       = useState<any[]>([]);
  const [oaSummary, setOaSummary] = useState<Record<string, any>>({});
  const [oaLoading, setOaLoading] = useState(false);
  const [oaError, setOaError]     = useState('');

  const loadOaData = async (f = appliedFilters) => {
    setOaLoading(true);
    setOaError('');
    try {
      const res = await fetchOtherAssets({ ...buildF(f) });
      setOaData(res.data as unknown as never[]);
      setOaSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setOaError(e instanceof Error ? e.message : 'Failed to load other assets data');
    } finally {
      setOaLoading(false);
    }
  };

  // ── Fixed Deposit (getPortfolioReturnsForFixedAssets) ──────────────────────
  const FD_PAN = pan;
  const [fdData, setFdData]       = useState<any[]>([]);
  const [fdSummary, setFdSummary] = useState<Record<string, any>>({});
  const [fdLoading, setFdLoading] = useState(false);
  const [fdError, setFdError]     = useState('');

  const loadFdData = async (f = appliedFilters) => {
    setFdLoading(true);
    setFdError('');
    try {
      const res = await fetchFixedDeposit({ ...buildF(f) });
      setFdData(res.data as unknown as never[]);
      setFdSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setFdError(e instanceof Error ? e.message : 'Failed to load fixed deposit data');
    } finally {
      setFdLoading(false);
    }
  };

  const SB_PAN = pan;
  const [sbData, setSbData]       = useState<any[]>([]);
  const [sbSummary, setSbSummary] = useState<Record<string, any>>({});
  const [sbLoading, setSbLoading] = useState(false);
  const [sbError, setSbError]     = useState('');

  const loadSbData = async (f = appliedFilters) => {
    setSbLoading(true);
    setSbError('');
    try {
      const res = await fetchSharesAndBonds({ ...buildF(f) }, 'schid');
      setSbData(res.data as unknown as never[]);
      setSbSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setSbError(e instanceof Error ? e.message : 'Failed to load shares & bonds data');
    } finally {
      setSbLoading(false);
    }
  };

  // ── By Transaction (getPortfolioReturnsDetailed, groupBy=1008) ──────────────
  const TXN_PAN = pan;
  const [txnData, setTxnData]       = useState<any[]>([]);
  const [txnSummary, setTxnSummary] = useState<Record<string, any>>({});
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnError, setTxnError]     = useState('');

  const loadTxnData = async (f = appliedFilters) => {
    setTxnLoading(true);
    setTxnError('');
    try {
      const res = await fetchPortfolioReturnsDetailed({ ...buildF(f) });
      setTxnData(res.data as unknown as never[]);
      setTxnSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setTxnError(e instanceof Error ? e.message : 'Failed to load transaction data');
    } finally {
      setTxnLoading(false);
    }
  };

  // ── By Sub-Category (group=objectiveid, hardcoded PAN) ────────────────────
  const [subCatData, setSubCatData]       = useState<any[]>([]);
  const [subCatSummary, setSubCatSummary] = useState<Record<string, any>>({});
  const [subCatLoading, setSubCatLoading] = useState(false);
  const [subCatError, setSubCatError]     = useState('');

  const loadSubCatData = async (f = appliedFilters) => {
    setSubCatLoading(true);
    setSubCatError('');
    try {
      const res = await fetchPortfolioReturns({ ...buildF(f) }, 'objectiveid');
      setSubCatData(res.data);
      setSubCatSummary(res.summary as Record<string, unknown>);
    } catch (e: unknown) {
      setSubCatError(e instanceof Error ? e.message : 'Failed to load sub-category data');
    } finally {
      setSubCatLoading(false);
    }
  };

  // Lazy-load tabs on first activation
  const loadTab = (val: string, f = appliedFilters) => {
    if (loadedTabs.current.has(val)) return;
    loadedTabs.current.add(val);
    if (val === 'byFolio')    loadFolioData(f);
    if (val === 'byScheme')   loadSchemeData(f);
    if (val === 'bySubCat')   loadSubCatData(f);
    if (val === 'byInvestor') loadInvestorData(f);
    if (val === 'byTxn')      loadTxnData(f);
    if (val === 'bySB')       loadSbData(f);
    if (val === 'byFD')       loadFdData(f);
    if (val === 'byOA')       loadOaData(f);
    if (val === 'journey')    loadJourneyData(undefined, f.pan);
  };
  const handleTabChange = (val: string) => { setActiveTab(val); loadTab(val); };

  // Load the default tab on mount
  useEffect(() => { if (pan) loadTab('byFolio'); }, []);

  const topSummary = Object.keys(folioSummary).length ? folioSummary : {};

  // ── Shared filter panel (shown always) ──────────────────────────────────
  const FilterPanel = (
    <Card className="border shadow-sm">
      <CardContent className="p-5">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0D3B66]" />
            <span className="text-sm font-semibold text-foreground">Portfolio Filters</span>
          </div>
          <button
            onClick={() => setShowAdvanced(p => !p)}
            className="text-xs text-[#0D3B66] font-medium flex items-center gap-1 hover:underline"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {/* Row 1 — mandatory fields */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          {/* PAN */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">PAN Number <span className="text-red-500">*</span></label>
            <Input
              placeholder="e.g. ABCDE1234F"
              className="uppercase h-9 text-sm"
              value={panInput}
              onChange={e => setPanInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* As On Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">As On Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                className="pl-8 pr-2 h-9 text-sm border rounded-md bg-background w-full focus:outline-none focus:ring-1 focus:ring-ring"
                value={endDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Data Source */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Data Source</label>
            <select
              className="h-9 text-sm border rounded-md bg-background px-2 focus:outline-none focus:ring-1 focus:ring-ring w-full"
              value={dataSource}
              onChange={e => setDataSource(e.target.value)}
            >
              {DATA_SOURCE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* PAN View */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Portfolio Scope</label>
            <div className="flex rounded-md border overflow-hidden h-9">
              <button
                onClick={() => setPanWise(1)}
                className={`flex-1 text-xs font-medium transition-colors ${
                  panWise === 1 ? 'bg-[#0D3B66] text-white' : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >Individual</button>
              <button
                onClick={() => setPanWise(0)}
                className={`flex-1 text-xs font-medium border-l transition-colors ${
                  panWise === 0 ? 'bg-[#0D3B66] text-white' : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >Family</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button size="sm" className="h-9 flex-1 bg-[#0D3B66] hover:bg-[#0a2f52] text-xs" onClick={applyFilters}>
              Get Portfolio
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-2.5" onClick={resetFilters} title="Reset">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Row 2 — advanced/optional fields */}
        {showAdvanced && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end mt-3 pt-3 border-t">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Investor Name</label>
              <Input
                placeholder="Exact investor name"
                className="h-9 text-sm"
                value={investorName}
                onChange={e => setInvestorName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Holding Period</label>
              <select
                className="h-9 text-sm border rounded-md bg-background px-2 focus:outline-none focus:ring-1 focus:ring-ring w-full"
                value={holdingPeriod}
                onChange={e => setHoldingPeriod(e.target.value)}
              >
                <option value="">All</option>
                <option value="longTerm">Long Term</option>
                <option value="shortTerm">Short Term</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Equity Code</label>
              <Input
                placeholder="e.g. EQ001"
                className="h-9 text-sm"
                value={equityCode}
                onChange={e => setEquityCode(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Applied chips — only when portfolio is loaded */}
        {pan && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t">
            <span className="text-xs bg-[#0D3B66]/10 text-[#0D3B66] px-2 py-0.5 rounded-full font-medium">PAN: {appliedFilters.pan}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">As of: {appliedFilters.endDate}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{DATA_SOURCE_OPTIONS.find(o => o.value === appliedFilters.dataSource)?.label ?? appliedFilters.dataSource}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{appliedFilters.panWise === 1 ? 'Individual' : 'Family'}</span>
            {appliedFilters.investorExactName && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Investor: {appliedFilters.investorExactName}</span>}
            {appliedFilters.holdingPeriod && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Holding: {appliedFilters.holdingPeriod === 'longTerm' ? 'Long Term' : 'Short Term'}</span>}
            {appliedFilters.equityCode1 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Equity: {appliedFilters.equityCode1}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!pan) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Portfolio Returns</h1>
        {FilterPanel}
        <Card className="border-dashed border-2">
          <CardContent className="p-16 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#0D3B66]/10 flex items-center justify-center">
              <Wallet className="w-7 h-7 text-[#0D3B66]" />
            </div>
            <p className="font-semibold text-foreground">Enter PAN and click "Get Portfolio"</p>
            <p className="text-sm text-muted-foreground">Your portfolio holdings will appear here</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {FilterPanel}

      {/* ── Hero summary banner ── */}
      {folioLoading ? null : portfolioError ? (
        portfolioError.kind === 'CLIENT_NOT_FOUND' ? (
          <ClientNotFound pan={pan} />
        ) : portfolioError.kind === 'NO_DATA' ? (
          <NoPortfolioData pan={pan} />
        ) : portfolioError.kind === 'NETWORK_ERROR' || portfolioError.kind === 'SERVER_ERROR' || portfolioError.kind === 'UNAUTHORIZED' ? (
          <PortfolioErrorPage message={portfolioError.message} onRetry={() => { loadedTabs.current = new Set(); loadTab(activeTab); }} />
        ) : null
      ) : (
        <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-[#0D3B66] to-[#1a5fa8] text-white">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left – portfolio value */}
              <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-white/10">
                <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Portfolio Value</p>
                <p className="text-4xl font-extrabold tracking-tight">{fmt(topSummary.currentValue ?? 0)}</p>
                <div className="flex items-center gap-2 mt-2">
                  {(topSummary.gain ?? 0) >= 0
                    ? <ArrowUpRight className="w-4 h-4 text-green-300" />
                    : <ArrowDownRight className="w-4 h-4 text-red-300" />}
                  <span className={`text-sm font-semibold ${(topSummary.gain ?? 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {(topSummary.gain ?? 0) >= 0 ? '+' : ''}{fmt(topSummary.gain ?? 0)}
                  </span>
                  <span className="text-xs text-white/50">unrealized gain</span>
                </div>
                <p className="text-xs text-white/50 mt-3">PAN: {pan} · as of {endDate}</p>
              </div>

              {/* Right – metric pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-px bg-white/10 lg:w-[55%]">
                {[
                  { icon: <Wallet className="w-4 h-4" />,    label: 'Invested',     value: fmt(topSummary.purchaseValue ?? 0),             up: true },
                  { icon: <TrendingUp className="w-4 h-4" />, label: 'Abs. Return',  value: fmtPct(topSummary.absoluteReturn ?? 0),          up: (topSummary.absoluteReturn ?? 0) >= 0 },
                  { icon: <BarChart2 className="w-4 h-4" />,  label: 'CAGR',         value: fmtPct(topSummary.CAGR ?? 0),                    up: (topSummary.CAGR ?? 0) >= 0 },
                  { icon: <Activity className="w-4 h-4" />,   label: '1-Day Change', value: `${(topSummary.oneDayChange ?? 0) >= 0 ? '+' : ''}${fmt(topSummary.oneDayChange ?? 0)}`, up: (topSummary.oneDayChange ?? 0) >= 0 },
                  { icon: <BarChart2 className="w-4 h-4" />,  label: 'Avg. Hold',    value: `${Math.round(topSummary.avgHoldingDays ?? 0)}d`, up: true },
                  { icon: <TrendingUp className="w-4 h-4" />, label: 'Change %',     value: fmtPct(topSummary.changePercent ?? 0),            up: (topSummary.changePercent ?? 0) >= 0 },
                ].map((m, i) => (
                  <div key={i} className="bg-white/5 hover:bg-white/10 transition-colors p-4">
                    <div className="flex items-center gap-1.5 text-white/50 mb-1">
                      {m.icon}
                      <span className="text-xs uppercase tracking-wide">{m.label}</span>
                    </div>
                    <p className={`text-base font-bold ${m.up ? 'text-white' : 'text-red-300'}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs — hidden for blocking errors */}
      {portfolioError && portfolioError.kind !== 'NO_DATA' && portfolioError.kind !== 'API_ERROR' ? null : (
      <Tabs defaultValue="byFolio" onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="byFolio">By Folio</TabsTrigger>
            <TabsTrigger value="byScheme">By Scheme</TabsTrigger>
            <TabsTrigger value="bySubCat">By Sub-Category</TabsTrigger>
            <TabsTrigger value="byInvestor">By Investor</TabsTrigger>
            <TabsTrigger value="byTxn">By Transaction</TabsTrigger>
            <TabsTrigger value="bySB">Shares &amp; Bonds</TabsTrigger>
            <TabsTrigger value="byFD">Fixed Deposit</TabsTrigger>
            <TabsTrigger value="byOA">Other Assets</TabsTrigger>
            <TabsTrigger value="journey">Portfolio Journey</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes, folios..."
              className="pl-9 w-52"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── By Sub-Category (group=objectiveid) ── */}
        <TabsContent value="bySubCat">
          {subCatLoading ? <Spinner /> : subCatError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{subCatError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadSubCatData}>Retry</Button>
              </CardContent>
            </Card>
          ) : subCatData.length === 0 ? (
            <Empty msg="No sub-category data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {SCHEME_PAN} · grouped by SEBI sub-category</p>
              <SummaryStrip summary={subCatSummary} />
              <SubCategoryTable rows={subCatData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── By Scheme (InvestWell getPortfolioReturns, group=schid) ── */}
        <TabsContent value="byScheme">
          {schemeLoading ? <Spinner /> : schemeError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{schemeError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadSchemeData}>Retry</Button>
              </CardContent>
            </Card>
          ) : schemeData.length === 0 ? (
            <Empty msg="No scheme data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {SCHEME_PAN} · grouped by scheme (schid)</p>
              <SummaryStrip summary={schemeSummary} />
              <BySchemeTable rows={schemeData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── By Investor (group=appid) ── */}
        <TabsContent value="byInvestor">
          {investorLoading ? <Spinner /> : investorError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{investorError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadInvestorData}>Retry</Button>
              </CardContent>
            </Card>
          ) : investorData.length === 0 ? (
            <Empty msg="No investor data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {INVESTOR_PAN} · grouped by investor (appid)</p>
              <SummaryStrip summary={investorSummary} />
              <ByInvestorTable rows={investorData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── By Transaction (getPortfolioReturnsDetailed groupBy=1008) ── */}
        <TabsContent value="byTxn">
          {txnLoading ? <Spinner /> : txnError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{txnError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadTxnData}>Retry</Button>
              </CardContent>
            </Card>
          ) : txnData.length === 0 ? (
            <Empty msg="No transaction data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {TXN_PAN} · groupBy=1008 · individual transactions</p>
              <SummaryStrip summary={txnSummary} />
              <ByTransactionTable investors={txnData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── Other Assets (getPortfolioForOtherAssets) ── */}
        <TabsContent value="byOA">
          {oaLoading ? <Spinner /> : oaError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{oaError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadOaData}>Retry</Button>
              </CardContent>
            </Card>
          ) : oaData.length === 0 ? (
            <Empty msg="No other assets data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {OA_PAN} · PMS / Real Estate / Gold / General assets</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Invested',      value: fmt(oaSummary.purchaseValue ?? 0),  color: 'text-[#0D3B66]' },
                  { label: 'Current Value', value: fmt(oaSummary.currentValue ?? 0),   color: 'text-[#0D3B66]' },
                  { label: 'Gain',          value: `${(oaSummary.gain ?? 0) >= 0 ? '+' : ''}${fmt(oaSummary.gain ?? 0)}`, color: gainColor(oaSummary.gain) },
                  { label: 'XIRR',          value: oaSummary.XIRR != null ? `${oaSummary.XIRR}%` : '—', color: gainColor(oaSummary.XIRR) },
                ].map((c, i) => (
                  <Card key={i}><CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className={`text-lg font-bold mt-1 ${c.color}`}>{c.value}</p>
                  </CardContent></Card>
                ))}
              </div>
              <OtherAssetsTable rows={oaData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── Fixed Deposit (getPortfolioReturnsForFixedAssets) ── */}
        <TabsContent value="byFD">
          {fdLoading ? <Spinner /> : fdError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{fdError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadFdData}>Retry</Button>
              </CardContent>
            </Card>
          ) : fdData.length === 0 ? (
            <Empty msg="No fixed deposit data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {FD_PAN} · grouped by transaction (fixedAssetTxnid)</p>
              <SummaryStrip summary={fdSummary} />
              <FixedDepositTable rows={fdData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── Shares & Bonds (getPortFolioReturnsForSharesAndBonds) ── */}
        <TabsContent value="bySB">
          {sbLoading ? <Spinner /> : sbError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{sbError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadSbData}>Retry</Button>
              </CardContent>
            </Card>
          ) : sbData.length === 0 ? (
            <Empty msg="No shares & bonds data available" />
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">PAN: {SB_PAN} · grouped by scrip (schid)</p>
              <SummaryStrip summary={sbSummary} />
              <SharesBondsTable rows={sbData} search={search} />
            </>
          )}
        </TabsContent>

        {/* ── By Folio (InvestWell getPortfolioReturns) ── */}
        <TabsContent value="byFolio">
          {folioLoading ? <Spinner /> : folioError ? (
            <Card className="border-red-400 bg-red-50">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{folioError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={loadFolioData}>Retry</Button>
              </CardContent>
            </Card>
          ) : folioData.length === 0 ? (
            <Empty msg="No folio data available" />
          ) : (
            <>
              <SummaryStrip summary={folioSummary} />
              <ByFolioTable rows={folioData} search={search} />
            </>
          )}
        </TabsContent>
        {/* ── Portfolio Journey (AUM chart) ── */}
        <TabsContent value="journey">
          {(() => {
            const activeData = journeyData.filter(d => d.AUM > 0);
            const first = journeyData[0];
            const last  = journeyData[journeyData.length - 1];
            const lastActive = activeData[activeData.length - 1];
            const latestAUM    = lastActive?.AUM ?? 0;
            const netInv       = last?.netInvestment ?? 0;
            const gain         = latestAUM > 0 ? latestAUM - netInv : 0;
            const gainPct      = netInv > 0 && latestAUM > 0 ? (gain / netInv) * 100 : 0;
            const peakAUM      = activeData.reduce((m, d) => Math.max(m, d.AUM), 0);
            const firstAUM     = activeData[0]?.AUM ?? 0;
            const periodReturn = firstAUM > 0 ? ((latestAUM - firstAUM) / firstAUM) * 100 : 0;
            const tickInterval = Math.max(1, Math.floor(journeyData.length / 8));
            const fmtJ = (n: number) => `₹${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const fmtPctJ = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
            return journeyLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
            ) : journeyError ? (
              <Card className="border-red-400 bg-red-50"><CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-700">{journeyError}</p>
                <Button size="sm" variant="outline" className="ml-auto" onClick={() => loadJourneyData()}>Retry</Button>
              </CardContent></Card>
            ) : (
              <div className="space-y-6">
                {/* Period selector */}
                <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                  {PERIODS.map(p => (
                    <button key={p.graphPeriod}
                      onClick={() => { setGraphPeriod(p.graphPeriod); loadJourneyData(p.graphPeriod); }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                        graphPeriod === p.graphPeriod ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}>{p.label}</button>
                  ))}
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Current AUM',   value: latestAUM > 0 ? fmtJ(latestAUM) : '—', sub: `Net Invested: ${fmtJ(netInv)}`, icon: <Wallet className="w-5 h-5" />, color: '#2563eb', up: undefined },
                    { label: 'Net Gain/Loss', value: latestAUM > 0 ? (gain >= 0 ? '+' : '') + fmtJ(gain) : '—', sub: latestAUM > 0 ? fmtPctJ(gainPct) : '', icon: gain >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />, color: gain >= 0 ? '#16a34a' : '#dc2626', up: latestAUM > 0 ? gain >= 0 : undefined },
                    { label: 'Period Return', value: firstAUM > 0 ? fmtPctJ(periodReturn) : '—', sub: firstAUM > 0 ? (periodReturn >= 0 ? '+' : '') + fmtJ(latestAUM - firstAUM) : '', icon: periodReturn >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />, color: periodReturn >= 0 ? '#0891b2' : '#ea580c', up: firstAUM > 0 ? periodReturn >= 0 : undefined },
                    { label: 'Peak AUM',      value: peakAUM > 0 ? fmtJ(peakAUM) : '—', sub: '', icon: <BarChart2 className="w-5 h-5" />, color: '#7c3aed', up: undefined },
                  ].map((s, i) => (
                    <Card key={i} className="border-0 shadow-sm"><CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                          <p className={`text-2xl font-bold ${ s.up === undefined ? 'text-gray-900' : s.up ? 'text-green-600' : 'text-red-500' }`}>{s.value}</p>
                          {s.sub && <p className={`text-xs mt-1 font-medium ${ s.up === undefined ? 'text-gray-400' : s.up ? 'text-green-500' : 'text-red-400' }`}>{s.sub}</p>}
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '20' }}>
                          <span style={{ color: s.color }}>{s.icon}</span>
                        </div>
                      </div>
                    </CardContent></Card>
                  ))}
                </div>

                {/* Chart */}
                <Card className="border-0 shadow-sm"><CardContent className="pt-6">
                  {journeyData.length === 0 ? (
                    <div className="flex items-center justify-center h-80 text-gray-400">No data available</div>
                  ) : (
                    <motion.div key={graphPeriod} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                      <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={journeyData} margin={{ top: 12, right: 24, left: 8, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradAUM2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                            </linearGradient>
                            <linearGradient id="gradNet2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#9333ea" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                          <XAxis dataKey="date" tickFormatter={fmtAxisDate} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} interval={tickInterval} />
                          <YAxis tickFormatter={yFmt} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} width={68} domain={['auto', 'auto']} />
                          <Tooltip content={<JourneyTooltip />} />
                          <Legend formatter={v => v === 'AUM' ? 'AUM (Current Value)' : 'Net Investment'} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
                          <Area type="monotone" dataKey="netInvestment" stroke="#9333ea" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradNet2)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#9333ea' }} name="Net Investment" connectNulls />
                          <Area type="monotone" dataKey="AUM" stroke="#2563eb" strokeWidth={2.5} fill="url(#gradAUM2)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: '#2563eb' }} name="AUM" connectNulls />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </CardContent></Card>
              </div>
            );
          })()}
        </TabsContent>

      </Tabs>
      )}
    </div>
  );
};

export default MFPortfolioPage;
