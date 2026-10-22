import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getUCCList } from '@/services/starmf/uccService';
import { listOrders, placeOrder, getPaymentDetail } from '@/services/starmf/orderService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getMasterSchemeList } from '@/services/starmf/schemeService';
import type { NewOrder } from '@/types/starmf/order.types';
import type { Scheme } from '@/types/starmf/scheme.types';
import { Search, CheckCircle2, CreditCard, X, Loader2, User, Wallet } from 'lucide-react';

// ─── Investor hook ────────────────────────────────────────────────────────────
interface Holding { scheme: string; schemeName: string; folio: string; units: number; }
interface InvestorCtx { ucc: string; email: string; mobnum: string; holdings: Holding[]; loading: boolean; }

function useInvestor(): InvestorCtx {
  const [ctx, setCtx] = useState<InvestorCtx>({ ucc: '', email: '', mobnum: '', holdings: [], loading: true });

  useEffect(() => {
    (async () => {
      try {
        const res = await getUCCList({ start: 0, length: 1 });
        const inv = res?.data?.lists?.[0];
        if (!inv) { setCtx(c => ({ ...c, loading: false })); return; }
        const ucc    = inv.investor?.client_code || '';
        const holder = inv.holder?.[0];
        const email  = holder?.contact?.[0]?.email_address || '';
        const mobnum = holder?.contact?.[0]?.contact_number || '';

        let holdings: Holding[] = [];
        try {
          const ordRes = await listOrders({ type: ['p'], ucc: [ucc] }, 0, 200);
          const orders: any[] = ordRes?.data?.lists ?? [];
          const seen = new Set<string>();
          orders.forEach((o: any) => {
            const key = `${o.scheme}|${o.folio}`;
            if (!seen.has(key) && o.scheme) {
              seen.add(key);
              holdings.push({ scheme: o.scheme, schemeName: o.scheme_name || o.scheme, folio: o.folio || '', units: o.units ?? 0 });
            }
          });
        } catch { /* holdings stay empty — user can type manually */ }

        setCtx({ ucc, email, mobnum, holdings, loading: false });
      } catch {
        setCtx(c => ({ ...c, loading: false }));
      }
    })();
  }, []);

  return ctx;
}

// ─── Scheme Search ────────────────────────────────────────────────────────────
const SchemeSearch: React.FC<{
  value: string; onChange: (code: string, name: string) => void;
  placeholder?: string; label: string; initialName?: string;
}> = ({ value, onChange, placeholder = 'Search scheme name or ISIN...', label, initialName }) => {
  const [query, setQuery] = useState(initialName || value);
  const [results, setResults] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await getMasterSchemeList({ search: { value: q }, length: 20 });
      const list: Scheme[] = res?.data?.lists ?? [];
      setResults(list); setOpen(list.length > 0);
    } catch { setResults([]); } finally { setLoading(false); }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value; setQuery(q);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => search(q), 400);
  };

  const select = (s: Scheme) => {
    const code = s.parent_scheme_code ?? s.scheme_isin ?? '';
    setQuery(s.name ?? code); onChange(code, s.name ?? ''); setOpen(false); setResults([]);
  };

  const clear = () => { setQuery(''); onChange('', ''); setResults([]); setOpen(false); };

  return (
    <div className="space-y-1" ref={wrapRef}>
      <Label>{label} *</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <Input className="pl-8 pr-8" placeholder={placeholder} value={query} onChange={handleInput}
          onFocus={() => results.length > 0 && setOpen(true)} autoComplete="off" />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-gray-400" />}
        {!loading && query && (
          <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((s, i) => (
              <button key={i} type="button" className="w-full text-left px-3 py-2.5 hover:bg-blue-50 border-b border-gray-50 last:border-0" onClick={() => select(s)}>
                <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 font-mono">{s.parent_scheme_code}</span>
                  {s.scheme_plan && <Badge variant="outline" className="text-[10px] h-4 px-1">{s.scheme_plan}</Badge>}
                  {s.scheme_option && <Badge variant="outline" className="text-[10px] h-4 px-1">{s.scheme_option}</Badge>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {value && <p className="text-xs text-gray-400 font-mono">Selected: {value}</p>}
    </div>
  );
};

// ─── Payment Modal ────────────────────────────────────────────────────────────
const PaymentModal: React.FC<{ orderId: number; onClose: () => void; onDone: () => void; }> = ({ orderId, onClose, onDone }) => {
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPaymentDetail(String(orderId))
      .then(res => setDetail(res?.data ?? res))
      .catch(() => setError('Could not fetch payment details'))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Order Confirmation</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5">
          {loading && <div className="flex items-center justify-center h-32"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}
          {error && <p className="text-sm text-red-500 text-center py-6">{error}</p>}
          {!loading && !error && detail && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-green-700">Order Placed Successfully</p>
                  <p className="text-xs text-green-600">Order ID: {String(detail.id ?? orderId)}</p>
                </div>
              </div>
              <div className="rounded-xl border divide-y text-sm">
                {[['Payment Mode', detail.payment_mode], ['Bank', detail.bank_name], ['Amount', detail.amount ? `₹${Number(detail.amount).toLocaleString()}` : undefined], ['Reference ID', detail.payment_ref_id], ['Status', detail.status]]
                  .filter(([, v]) => v !== undefined && v !== null && v !== '')
                  .map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between px-4 py-2.5">
                      <span className="text-gray-500">{String(k)}</span>
                      <span className="font-medium text-gray-800">{String(v)}</span>
                    </div>
                  ))}
              </div>
              {detail.payment_url && (
                <a href={String(detail.payment_url)} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                  Complete Payment →
                </a>
              )}
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onDone}>Go to Order History</Button>
        </div>
      </div>
    </div>
  );
};

// ─── Order Form ───────────────────────────────────────────────────────────────
const OrderForm: React.FC<{
  type: 'p' | 'r' | 's';
  investor: InvestorCtx;
  onSuccess: () => void;
  preScheme?: string;
  preName?: string;
}> = ({ type, investor, onSuccess, preScheme, preName }) => {
  const [form, setForm] = useState<Omit<NewOrder, 'type'>>({
    mem_ord_ref_id: `ORD${Date.now()}`,
    investor: { ucc: '' },
    member: import.meta.env.VITE_STARMF_ARN || '',
    scheme: preScheme ?? '',
    dest_scheme: '',
    amount: 0,
    cur: 'INR',
    is_units: false,
    all_units: false,
    min_redeem_flag: false,
    folio: '',
    is_fresh: type === 'p',
    phys_or_demat: 'D',
    holder: [{ holder_rank: '1', email: '', mobnum: '' }],
    email: '',
    mobnum: '',
    kyc_passed: true,
    dpc: true,
    payment_ref_id: '',
    is_nomination_opted: false,
    exch_mandate_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  // Sync investor context into form once loaded
  useEffect(() => {
    if (!investor.loading && investor.ucc) {
      setForm(f => ({
        ...f,
        investor: { ucc: investor.ucc },
        email: investor.email,
        mobnum: investor.mobnum,
        holder: [{ holder_rank: '1', email: investor.email, mobnum: investor.mobnum }],
      }));
    }
  }, [investor.loading, investor.ucc]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  // When a holding is selected from the picker, auto-fill scheme + folio
  const selectHolding = (h: Holding) => {
    setForm(f => ({ ...f, scheme: h.scheme, folio: h.folio }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.investor.ucc) return toast({ title: 'UCC is required', variant: 'destructive' });
    if (!form.scheme) return toast({ title: 'Scheme is required', variant: 'destructive' });
    if (!form.amount && !form.all_units) return toast({ title: 'Amount / Units is required', variant: 'destructive' });
    if (type === 's' && !form.dest_scheme) return toast({ title: 'Destination scheme is required', variant: 'destructive' });
    setLoading(true);
    try {
      const res = await placeOrder([{ ...form, type }]);
      const orderId = res?.data?.data?.orders?.[0]?.id ?? res?.data?.data?.items?.[0]?.id ?? res?.data?.orders?.[0]?.id ?? res?.data?.id ?? null;
      toast({ title: type === 'r' ? 'Redemption order placed' : type === 's' ? 'Switch order placed' : 'Order placed successfully' });
      if (orderId) setPlacedOrderId(Number(orderId));
      else onSuccess();
    } catch (err: unknown) {
      toast({ title: err instanceof Error ? err.message : 'Failed to place order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (placedOrderId !== null) {
    return <PaymentModal orderId={placedOrderId} onClose={() => { setPlacedOrderId(null); onSuccess(); }} onDone={onSuccess} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Investor banner */}
      {investor.loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading investor details...
        </div>
      ) : investor.ucc ? (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <User className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-blue-800">UCC: {investor.ucc}</span>
            {investor.email && <span className="text-blue-600 ml-3">{investor.email}</span>}
          </div>
        </div>
      ) : null}

      {/* Holdings picker — for Redeem & Switch */}
      {(type === 'r' || type === 's') && investor.holdings.length > 0 && (
        <div className="space-y-2">
          <Label>Select from your holdings</Label>
          <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
            {investor.holdings.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectHolding(h)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-all text-sm ${
                  form.scheme === h.scheme && form.folio === h.folio
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Wallet className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-medium text-gray-800 truncate">{h.schemeName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {h.folio && <Badge variant="outline" className="text-xs">{h.folio}</Badge>}
                    {h.units > 0 && <span className="text-xs text-gray-500">{h.units.toFixed(3)} units</span>}
                    {form.scheme === h.scheme && form.folio === h.folio && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Or search manually below</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Source scheme */}
        <div className="md:col-span-2">
          <SchemeSearch
            label={type === 's' ? 'Source Scheme' : 'Scheme'}
            value={form.scheme}
            onChange={(code) => set('scheme', code)}
            initialName={preName}
          />
        </div>

        {/* Destination scheme — Switch only */}
        {type === 's' && (
          <div className="md:col-span-2">
            <SchemeSearch
              label="Destination Scheme"
              value={form.dest_scheme ?? ''}
              onChange={(code) => set('dest_scheme', code)}
              placeholder="Search destination scheme..."
            />
          </div>
        )}

        {/* Amount / Units */}
        <div className="space-y-1">
          <Label>{form.is_units ? 'Units' : 'Amount (₹)'} {!form.all_units ? '*' : ''}</Label>
          <Input type="number" min={0} placeholder="e.g. 5000" value={form.amount || ''}
            onChange={e => set('amount', Number(e.target.value))}
            disabled={!!form.all_units} />
        </div>

        {/* Folio */}
        <div className="space-y-1">
          <Label>Folio {type !== 'p' ? '*' : '(blank = new folio)'}</Label>
          <Input placeholder="Existing folio number" value={form.folio}
            onChange={e => set('folio', e.target.value)} />
        </div>

        {/* Mode */}
        <div className="space-y-1">
          <Label>Mode</Label>
          <Select value={form.phys_or_demat} onValueChange={v => set('phys_or_demat', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Physical</SelectItem>
              <SelectItem value="d">Demat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mandate ID — purchase only */}
        {type === 'p' && (
          <div className="space-y-1">
            <Label>Mandate ID <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
            <Input type="number" placeholder="e.g. 12345" value={form.exch_mandate_id ?? ''}
              onChange={e => set('exch_mandate_id', e.target.value ? Number(e.target.value) : null)} />
          </div>
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6 pt-1">
        <div className="flex items-center gap-2">
          <Switch checked={form.is_units} onCheckedChange={v => set('is_units', v)} />
          <Label>Order in Units</Label>
        </div>
        {type === 'r' && (
          <div className="flex items-center gap-2">
            <Switch checked={form.all_units} onCheckedChange={v => set('all_units', v)} />
            <Label>Redeem All Units</Label>
          </div>
        )}
        {type === 'p' && (
          <div className="flex items-center gap-2">
            <Switch checked={form.is_fresh} onCheckedChange={v => set('is_fresh', v)} />
            <Label>Fresh Purchase</Label>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Switch checked={form.kyc_passed} onCheckedChange={v => set('kyc_passed', v)} />
          <Label>KYC Passed</Label>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={loading || investor.loading} className="min-w-36">
          {loading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Placing...</>
            : type === 'p' ? 'Place Purchase'
            : type === 'r' ? 'Place Redemption'
            : 'Place Switch'}
        </Button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const MFOrdersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preScheme = searchParams.get('scheme') ?? undefined;
  const preName   = searchParams.get('name')   ?? undefined;
  const defaultTab = location.pathname.includes('redeem') ? 'redeem'
    : location.pathname.includes('switch') ? 'switch' : 'purchase';

  const investor = useInvestor();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Place Order</h1>
        <p className="text-sm text-gray-500 mt-0.5">Purchase, Redeem or Switch mutual fund units via BSE StAR MF</p>
      </div>

      <Tabs defaultValue={defaultTab} onValueChange={v => navigate(`/dashboard/mf/orders/${v}`)}>
        <TabsList>
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
          <TabsTrigger value="redeem">Redeem</TabsTrigger>
          <TabsTrigger value="switch">Switch</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase">
          <Card>
            <CardHeader><CardTitle className="text-base">New Purchase Order</CardTitle></CardHeader>
            <CardContent>
              <OrderForm type="p" investor={investor} onSuccess={() => navigate('/dashboard/mf/orders/list')} preScheme={preScheme} preName={preName} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeem">
          <Card>
            <CardHeader><CardTitle className="text-base">Redemption Order</CardTitle></CardHeader>
            <CardContent>
              <OrderForm type="r" investor={investor} onSuccess={() => navigate('/dashboard/mf/orders/list')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="switch">
          <Card>
            <CardHeader><CardTitle className="text-base">Switch Order</CardTitle></CardHeader>
            <CardContent>
              <OrderForm type="s" investor={investor} onSuccess={() => navigate('/dashboard/mf/orders/list')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MFOrdersPage;
