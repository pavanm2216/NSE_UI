import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMasterSchemeList } from '@/services/starmf/schemeService';
import type { Scheme } from '@/types/starmf/scheme.types';
import {
  Search, RefreshCw, ShoppingCart, ChevronLeft, ChevronRight,
  AlertCircle, LayoutList, Loader2, SlidersHorizontal, X,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

const AMC_OPTIONS = [
  'All AMCs', 'HDFC', 'ICICI Prudential', 'SBI', 'Axis', 'Mirae Asset',
  'Kotak', 'Nippon India', 'DSP', 'Franklin Templeton', 'Parag Parikh',
  'UTI', 'Aditya Birla Sun Life', 'Tata', 'Canara Robeco', 'IDFC',
];

const CATEGORY_OPTIONS = [
  'All Categories', 'Equity', 'Debt', 'Hybrid', 'Solution Oriented',
  'Other', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap',
  'ELSS', 'Index', 'ETF', 'FoF',
];

const PLAN_OPTIONS = ['All Plans', 'Direct', 'Regular'];
const OPTION_OPTIONS = ['All Options', 'Growth', 'IDCW', 'Dividend'];
const TXN_OPTIONS = ['All', 'P', 'R', 'S', 'PR', 'PRS'];

// ─── Scheme Row ───────────────────────────────────────────────────────────────
const SchemeRow: React.FC<{ scheme: Scheme; index: number; onBuy: (s: Scheme) => void }> = ({
  scheme, index, onBuy,
}) => (
  <tr className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors group">
    <td className="px-4 py-3 text-xs text-gray-400 w-10">{index}</td>
    <td className="px-4 py-3">
      <p className="font-medium text-gray-900 text-sm leading-snug">{scheme.name}</p>
      <p className="text-xs text-gray-400 mt-0.5 font-mono">{scheme.parent_scheme_code}</p>
    </td>
    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{scheme.scheme_amc_code || '—'}</td>
    <td className="px-4 py-3">
      {scheme.scheme_plan
        ? <Badge variant="outline" className="text-[10px] h-5">{scheme.scheme_plan}</Badge>
        : <span className="text-gray-300">—</span>}
    </td>
    <td className="px-4 py-3">
      {scheme.scheme_option
        ? <Badge variant="outline" className="text-[10px] h-5">{scheme.scheme_option}</Badge>
        : <span className="text-gray-300">—</span>}
    </td>
    <td className="px-4 py-3 text-xs font-mono text-gray-500">{scheme.scheme_isin || '—'}</td>
    <td className="px-4 py-3">
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        scheme.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        {scheme.is_active ? 'Active' : 'Inactive'}
      </span>
    </td>
    <td className="px-4 py-3">
      <Button
        size="sm"
        className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onBuy(scheme)}
      >
        <ShoppingCart className="w-3 h-3 mr-1" /> Buy
      </Button>
    </td>
  </tr>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const MFSchemeBrowserPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & filters
  const [search, setSearch] = useState('');
  const [amc, setAmc] = useState('All AMCs');
  const [category, setCategory] = useState('All Categories');
  const [plan, setPlan] = useState('All Plans');
  const [option, setOption] = useState('All Options');
  const [txn, setTxn] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSchemes = useCallback(async (pageIndex: number, q: string) => {
    setLoading(true);
    setError('');
    try {
      const filter: Record<string, string> = {
        scheme_amc_name:      amc      !== 'All AMCs'       ? amc      : '',
        scheme_category:      category !== 'All Categories' ? category : '',
        scheme_plan:          plan     !== 'All Plans'      ? plan     : '',
        scheme_option:        option   !== 'All Options'    ? option   : '',
        transaction_allowed:  txn      !== 'All'            ? txn      : '',
        scheme_sub_category: '',
        investment_mode:     '',
        scheme_isin:         '',
        settlement_days:     '',
      };
      const res = await getMasterSchemeList({
        start: pageIndex * PAGE_SIZE,
        length: PAGE_SIZE,
        search: { value: q },
        filter_param: filter as any,
      });
      setSchemes(res?.data?.lists ?? []);
      setTotal(res?.data?.count ?? 0);
      setPage(pageIndex);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load schemes');
    } finally {
      setLoading(false);
    }
  }, [amc, category, plan, option, txn]);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSchemes(0, search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, fetchSchemes]);

  // Re-fetch when filters change
  useEffect(() => { fetchSchemes(0, search); }, [amc, category, plan, option, txn]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleBuy = (s: Scheme) => {
    const code = s.parent_scheme_code || s.scheme_isin || '';
    navigate(`/dashboard/mf/orders/purchase?scheme=${encodeURIComponent(code)}&name=${encodeURIComponent(s.name ?? '')}`);
  };

  const clearFilters = () => {
    setAmc('All AMCs'); setCategory('All Categories');
    setPlan('All Plans'); setOption('All Options'); setTxn('All');
  };

  const hasActiveFilters = amc !== 'All AMCs' || category !== 'All Categories' ||
    plan !== 'All Plans' || option !== 'All Options' || txn !== 'All';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheme Browser</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse all available mutual fund schemes · click Buy to place a purchase order
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/mf/orders/purchase')}
          className="gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Place Order Manually
        </Button>
      </div>

      {/* Search + Filter bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-9"
                placeholder="Search by scheme name, AMC or ISIN..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearch('')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className={`gap-2 ${hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}`}
              onClick={() => setShowFilters(f => !f)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {hasActiveFilters && <Badge className="h-4 px-1 text-[10px] bg-blue-600 text-white">ON</Badge>}
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchSchemes(page, search)}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1 border-t">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">AMC</p>
                <Select value={amc} onValueChange={setAmc}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AMC_OPTIONS.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Category</p>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Plan</p>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Option</p>
                <Select value={option} onValueChange={setOption}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OPTION_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Transaction Allowed</p>
                <Select value={txn} onValueChange={setTxn}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TXN_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <div className="md:col-span-5 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-gray-500 gap-1">
                    <X className="w-3 h-3" /> Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t">
            <span className="flex items-center gap-1.5">
              <LayoutList className="w-3.5 h-3.5" />
              {loading ? 'Loading...' : `${total.toLocaleString()} schemes found`}
            </span>
            {!loading && total > 0 && (
              <span>
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-600 flex-1">{error}</p>
            <Button size="sm" variant="outline" onClick={() => fetchSchemes(page, search)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-400">Fetching schemes from STARMF...</p>
            </div>
          ) : schemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Search className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">No schemes found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['#', 'Scheme Name', 'AMC', 'Plan', 'Option', 'ISIN', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((s, i) => (
                    <SchemeRow
                      key={s.parent_scheme_code || i}
                      scheme={s}
                      index={page * PAGE_SIZE + i + 1}
                      onBuy={handleBuy}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => fetchSchemes(page - 1, search)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>

            {/* Page number pills */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  className="w-8 h-8 p-0 text-xs"
                  onClick={() => fetchSchemes(p, search)}
                >
                  {p + 1}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => fetchSchemes(page + 1, search)}
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFSchemeBrowserPage;
