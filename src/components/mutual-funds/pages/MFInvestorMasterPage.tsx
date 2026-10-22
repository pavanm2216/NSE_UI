import React, { useState } from 'react';
import { BookOpen, Users, Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, UserPlus, CheckCircle2, UsersRound, Trash2, Plus, Lock, Unlock, PencilLine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import iwAxios from '@/api/axios';
import { getOrFetchAggregatorToken } from '@/services/investwellAuthService';

interface Client {
  name: string; mobile: string; pan: string; email: string; username: string;
  aum: number; city: string; createdAt: string; updatedAt: string;
  dob: string | null; familyHead: string | null; source: string;
  lastLogin: string | null; iwellCode: number;
}
interface ApiResult {
  data: Client[]; totalNoRows: number; noOfPages: number;
  currentPage: number; pageSize: number;
}

const PAGE_SIZE = 10;

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatAUM(val: number) {
  if (!val) return '₹0';
  return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
function defaultDates() {
  return { from: '2026-02-04', to: '2026-03-04' };
}

// ─── Fetch All Clients ────────────────────────────────────────────────────────
const FetchAllClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [meta, setMeta] = useState<Omit<ApiResult, 'data'> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dateType, setDateType] = useState<'createdAt' | 'updatedAt'>('createdAt');
  const dates = defaultDates();
  const [fromDate, setFromDate] = useState(dates.from);
  const [toDate, setToDate] = useState(dates.to);

  const fetchClients = async (currentPage = 1) => {
    setLoading(true); setError('');
    try {
      const token = await getOrFetchAggregatorToken();
      const filterObj: Record<string, unknown> = { dateType, fromDate, toDate, showFamilyHead: true };
      if (search.trim()) filterObj.name = search.trim();
      const { data: json } = await axios.get('/iw-api/aggregator/broker/getClients', {
        params: { filters: JSON.stringify([filterObj]), pageSize: PAGE_SIZE, currentPage },
        headers: { token },
      });
      if (json.status !== 0) throw new Error(`[${json.status}] ${json.message}`);
      const result: ApiResult = json.result;
      setClients(result.data ?? []);
      setMeta({ totalNoRows: result.totalNoRows, noOfPages: result.noOfPages, currentPage: result.currentPage, pageSize: result.pageSize });
      setPage(currentPage);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  React.useEffect(() => { fetchClients(1); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Date Type</label>
          <select value={dateType} onChange={e => setDateType(e.target.value as 'createdAt' | 'updatedAt')} className="h-9 rounded-md border bg-background px-3 text-sm">
            <option value="createdAt">Created At</option>
            <option value="updatedAt">Updated At</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">From Date</label>
          <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-9 w-36 text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">To Date</label>
          <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="h-9 w-36 text-sm" />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-40">
          <label className="text-xs text-muted-foreground">Search by Name</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="e.g. Anuj Jain" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchClients(1)} className="pl-8 h-9 text-sm" />
          </div>
        </div>
        <Button onClick={() => fetchClients(1)} disabled={loading} className="h-9 gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Fetching…' : 'Fetch Clients'}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && clients.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No clients found for the selected date range.</p>
          </CardContent>
        </Card>
      )}

      {clients.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, meta?.totalNoRows ?? 0)} of <strong>{meta?.totalNoRows}</strong> clients</span>
            <span>Page {page} of {meta?.noOfPages}</span>
          </div>
          <div className="rounded-xl border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">PAN</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-right">AUM</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((c, i) => (
                  <tr key={c.iwellCode} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      <div>{c.name}</div>
                      {c.familyHead && c.familyHead !== c.name && <div className="text-xs text-muted-foreground">Family: {c.familyHead}</div>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{c.pan}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.mobile}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[160px]">{c.email}</td>
                    <td className="px-4 py-3 capitalize">{c.city || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                      <span className={c.aum > 0 ? 'text-emerald-600' : 'text-muted-foreground'}>{formatAUM(c.aum)}</span>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-[10px] capitalize">{c.source}</Badge></td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">{formatDate(c.lastLogin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(meta?.noOfPages ?? 1) > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => fetchClients(page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
              <span className="text-sm text-muted-foreground">Page {page} / {meta?.noOfPages}</span>
              <Button variant="outline" size="sm" disabled={page >= (meta?.noOfPages ?? 1) || loading} onClick={() => fetchClients(page + 1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Create Client ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', pan: '', username: '', mobile: '', email: '',
  dob: '', address1: '', address2: '', city: '', state: '',
  country: '', pin: '', equityCode1: '', anniversary: '',
  bdayWish: '', levelName: '', userBusinessCode: '', fhUsername: '',
};

const CreateClient: React.FC = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name.trim() || !form.pan.trim() || !form.username.trim()) {
      setError('Name, PAN and Username are required.'); return;
    }
    setLoading(true);
    try {
      const payload: Record<string, string> = {};
      (Object.keys(form) as (keyof typeof EMPTY_FORM)[]).forEach(k => { if (form[k].trim()) payload[k] = form[k].trim(); });

      const { data: json } = await iwAxios.post('/aggregator/utils/createClients', { clients: [payload] });
      // API returns status 1 on success for this endpoint
      if (json.status === 0 || json.status === 1) {
        setSuccess(json.message || 'Client creation request submitted successfully.');
        setForm(EMPTY_FORM);
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const field = (label: string, k: keyof typeof EMPTY_FORM, placeholder?: string, required?: boolean) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      <Input value={form[k]} onChange={set(k)} placeholder={placeholder ?? ''} className="h-9 text-sm" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success */}
      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Mandatory fields */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Required Fields</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {field('Full Name', 'name', 'Prashant Verma', true)}
          {field('PAN', 'pan', 'PALPV2432N', true)}
          {field('Username', 'username', 'imahi8907', true)}
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contact Details</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {field('Mobile', 'mobile', '8426003081')}
          {field('Email', 'email', 'prashant@example.com')}
          {field('Date of Birth', 'dob', 'DD-MM-YYYY')}
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Address</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {field('Address Line 1', 'address1', 'Girnar Hostel')}
          {field('Address Line 2', 'address2', 'IIT Delhi')}
          {field('City', 'city', 'New Delhi')}
          {field('State', 'state', 'Delhi')}
          {field('Country', 'country', 'India')}
          {field('PIN Code', 'pin', '110016')}
        </div>
      </div>

      {/* Optional / Internal */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Optional / Internal</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {field('Equity Code', 'equityCode1', '12345Prashant')}
          {field('Anniversary', 'anniversary', 'DD-MM-YYYY')}
          {field('Birthday Wish Date', 'bdayWish', 'DD-MM-YYYY')}
          {field('Level Name', 'levelName', 'Sub Broker')}
          {field('User Business Code', 'userBusinessCode', '63875')}
          {field('Family Head Username', 'fhUsername', 'fh_username')}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <UserPlus className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Creating…' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
};

// ─── Create Clients Bulk ─────────────────────────────────────────────────────
const EMPTY_ROW = {
  name: '', pan: '', username: '', mobile: '', email: '',
  dob: '', address1: '', address2: '', city: '', state: '',
  country: '', pin: '', equityCode1: '', anniversary: '',
  levelName: '', userBusinessCode: '',
};
type BulkRow = typeof EMPTY_ROW;

interface BulkResultRow {
  name: string; pan: string; username: string; status: string;
}

const CreateClientsBulk: React.FC = () => {
  const [rows, setRows] = useState<BulkRow[]>([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<BulkResultRow[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  const setField = (i: number, k: keyof BulkRow, v: string) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));

  const addRow = () => setRows(r => [...r, { ...EMPTY_ROW }]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg(''); setResults([]);

    const invalid = rows.findIndex(r => !r.name.trim() || !r.pan.trim() || !r.username.trim());
    if (invalid !== -1) { setError(`Row ${invalid + 1}: Name, PAN and Username are required.`); return; }

    setLoading(true);
    try {
      const clients = rows.map(row => {
        const payload: Record<string, string> = {};
        (Object.keys(row) as (keyof BulkRow)[]).forEach(k => { if (row[k].trim()) payload[k] = row[k].trim(); });
        return payload;
      });

      const { data: json } = await iwAxios.post('/aggregator/utils/createClientsV2', { clients });
      if (json.status === 0 || json.status === 1) {
        setSuccessMsg(json.message || 'Bulk creation request submitted.');
        setResults(json.result ?? []);
        setRows([{ ...EMPTY_ROW }, { ...EMPTY_ROW }]);
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const F = ({ label, k, i, required, placeholder, width }: {
    label: string; k: keyof BulkRow; i: number;
    required?: boolean; placeholder?: string; width?: string;
  }) => (
    <div className={`flex flex-col gap-1 ${width ?? 'min-w-[120px]'}`}>
      <label className="text-[10px] text-muted-foreground whitespace-nowrap">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      <Input value={rows[i][k]} onChange={e => setField(i, k, e.target.value)}
        placeholder={placeholder ?? ''} className="h-8 text-xs" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info */}
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex gap-3 items-start">
        <span className="mt-0.5">ℹ️</span>
        <span>Add multiple clients below and submit in one request. Each row requires <strong className="text-foreground">Name, PAN and Username</strong>.</span>
      </div>

      {/* Success */}
      {successMsg && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{successMsg}</p>
            </div>
            {results.length > 0 && (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">PAN</th>
                      <th className="px-3 py-2 text-left">Username</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{r.name}</td>
                        <td className="px-3 py-2 font-mono">{r.pan}</td>
                        <td className="px-3 py-2">{r.username}</td>
                        <td className="px-3 py-2">
                          <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-0">{r.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Rows */}
      <div className="space-y-4">
        {rows.map((_, i) => (
          <Card key={i} className="border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client {i + 1}</span>
                {rows.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeRow(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              {/* Required */}
              <div className="flex flex-wrap gap-3">
                <F label="Full Name" k="name" i={i} required placeholder="Prashant Kumar" width="flex-1 min-w-[160px]" />
                <F label="PAN" k="pan" i={i} required placeholder="EAEPV2432K" width="w-36" />
                <F label="Username" k="username" i={i} required placeholder="imahAHi231" width="w-36" />
              </div>
              {/* Contact + Address */}
              <div className="flex flex-wrap gap-3">
                <F label="Mobile" k="mobile" i={i} placeholder="8426003081" width="w-32" />
                <F label="Email" k="email" i={i} placeholder="email@example.com" width="flex-1 min-w-[160px]" />
                <F label="DOB (DD-MM-YYYY)" k="dob" i={i} placeholder="30-01-1997" width="w-32" />
                <F label="City" k="city" i={i} placeholder="New Delhi" width="w-28" />
                <F label="State" k="state" i={i} placeholder="Delhi" width="w-24" />
                <F label="PIN" k="pin" i={i} placeholder="110016" width="w-24" />
              </div>
              {/* Optional */}
              <div className="flex flex-wrap gap-3">
                <F label="Address 1" k="address1" i={i} placeholder="Girnar Hostel" width="flex-1 min-w-[140px]" />
                <F label="Address 2" k="address2" i={i} placeholder="IIT Delhi" width="flex-1 min-w-[140px]" />
                <F label="Country" k="country" i={i} placeholder="India" width="w-24" />
                <F label="Level Name" k="levelName" i={i} placeholder="Sub Broker" width="w-28" />
                <F label="User Biz Code" k="userBusinessCode" i={i} placeholder="104578" width="w-28" />
                <F label="Equity Code" k="equityCode1" i={i} placeholder="12345" width="w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-2">
          <Plus className="w-4 h-4" /> Add Another Client
        </Button>
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <UsersRound className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Submitting…' : `Submit ${rows.length} Client${rows.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
};

// ─── Update Client ────────────────────────────────────────────────────────────
const EMPTY_UPDATE = {
  username: '', mobile: '', email: '', dob: '',
  address1: '', address2: '', city: '', state: '',
  country: '', pin: '', equityCode1: '', anniversary: '',
  bdayWish: '', appCode: '', levelName: '', userBusinessCode: '',
};

const UpdateClient: React.FC = () => {
  const [form, setForm] = useState(EMPTY_UPDATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: keyof typeof EMPTY_UPDATE) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.username.trim()) { setError('Username is required.'); return; }
    setLoading(true);
    try {
      const payload: Record<string, string> = {};
      (Object.keys(form) as (keyof typeof EMPTY_UPDATE)[]).forEach(k => { if (form[k].trim()) payload[k] = form[k].trim(); });
      const { data: json } = await iwAxios.post('/aggregator/utils/updateClient', payload);
      if (json.status === 0 || json.status === 1) {
        setSuccess(json.message || 'Client updated successfully.');
        setForm(EMPTY_UPDATE);
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const F = ({ label, k, required, placeholder }: { label: string; k: keyof typeof EMPTY_UPDATE; required?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      <Input value={form[k]} onChange={set(k)} placeholder={placeholder ?? ''} className="h-9 text-sm" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex gap-3 items-start">
        <span className="mt-0.5">ℹ️</span>
        <span>Only <strong className="text-foreground">Username</strong> is mandatory. Fill only the fields you want to update — empty fields are ignored. Note: locked clients cannot be updated.</span>
      </div>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Identity */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Identity</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Username" k="username" required placeholder="AAQKHATRI531276" />
          <F label="App Code" k="appCode" placeholder="internal-id" />
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Contact Details</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Mobile" k="mobile" placeholder="8426003081" />
          <F label="Email" k="email" placeholder="user@example.com" />
          <F label="DOB (YYYY-MM-DD)" k="dob" placeholder="1997-01-30" />
          <F label="Anniversary (YYYY-MM-DD)" k="anniversary" placeholder="2008-07-27" />
          <F label="Birthday Wish (YYYY-MM-DD)" k="bdayWish" placeholder="1997-01-30" />
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Address</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Address Line 1" k="address1" placeholder="Girnar Hostel" />
          <F label="Address Line 2" k="address2" placeholder="IIT Delhi" />
          <F label="City" k="city" placeholder="New Delhi" />
          <F label="State" k="state" placeholder="Delhi" />
          <F label="Country" k="country" placeholder="India" />
          <F label="PIN Code" k="pin" placeholder="110016" />
        </div>
      </div>

      {/* RM / SB */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Relationship Manager / Sub Broker <span className="normal-case font-normal text-muted-foreground">(both required to update RM/SB)</span></p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Level Name" k="levelName" placeholder="Sub Broker" />
          <F label="User Business Code" k="userBusinessCode" placeholder="104578" />
          <F label="Equity Code" k="equityCode1" placeholder="12345Prashant" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <PencilLine className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Updating…' : 'Update Client'}
        </Button>
      </div>
    </form>
  );
};

// ─── Set Lock/Unlock Clients ─────────────────────────────────────────────────
const SetClientLock: React.FC = () => {
  const [usernames, setUsernames] = useState('');
  const [lock, setLock] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const list = usernames.split(',').map(u => u.trim()).filter(Boolean);
    if (!list.length) { setError('Enter at least one username.'); return; }
    setLoading(true);
    try {
      const { data: json } = await iwAxios.post('/aggregator/utils/setClientUpdateLock', { usernames: list, lock });
      if (json.status === 0 || json.status === 1) {
        setSuccess(`${lock ? 'Locked' : 'Unlocked'} ${list.length} client${list.length > 1 ? 's' : ''} successfully. ${json.message ?? ''}`.trim());
        setUsernames('');
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {/* Info */}
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex gap-3 items-start">
        <span className="mt-0.5">ℹ️</span>
        <span>
          Locked clients <strong className="text-foreground">cannot be updated</strong> via the Update Client API.
          Enter one or more usernames (comma-separated) and choose Lock or Unlock.
        </span>
      </div>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Usernames input */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs">Usernames <span className="text-destructive">*</span>
          <span className="text-muted-foreground font-normal ml-1">(comma-separated)</span>
        </Label>
        <Input
          value={usernames}
          onChange={e => setUsernames(e.target.value)}
          placeholder="imahi7, aman123, john_doe"
          className="h-9 text-sm"
        />
        {usernames.trim() && (
          <p className="text-xs text-muted-foreground">
            {usernames.split(',').map(u => u.trim()).filter(Boolean).length} username(s) entered
          </p>
        )}
      </div>

      {/* Lock / Unlock toggle */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Action <span className="text-destructive">*</span></Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLock(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              lock
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-background text-muted-foreground border-border hover:border-rose-300'
            }`}
          >
            <Lock className="w-4 h-4" /> Lock Clients
          </button>
          <button
            type="button"
            onClick={() => setLock(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              !lock
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                : 'bg-background text-muted-foreground border-border hover:border-emerald-300'
            }`}
          >
            <Unlock className="w-4 h-4" /> Unlock Clients
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className={`gap-2 text-white px-8 ${ lock ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600' }`}
        >
          {lock ? <Lock className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} /> : <Unlock className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />}
          {loading ? 'Processing…' : lock ? 'Lock Clients' : 'Unlock Clients'}
        </Button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const MFInvestorMasterPage: React.FC = () => (
  <div className="space-y-6 pb-10">
    <div className="flex items-center gap-3">
      <BookOpen className="w-6 h-6 text-[#0D3B66]" />
      <div>
        <h1 className="text-2xl font-bold">Investor Master</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Complete master record of all investors, folios and holdings</p>
      </div>
    </div>

    <Tabs defaultValue="fetch-clients">
      <TabsList>
        <TabsTrigger value="fetch-clients" className="gap-2">
          <Users className="w-4 h-4" /> Fetch All Clients
        </TabsTrigger>
        <TabsTrigger value="create-client" className="gap-2">
          <UserPlus className="w-4 h-4" /> Create Client
        </TabsTrigger>
        <TabsTrigger value="create-bulk" className="gap-2">
          <UsersRound className="w-4 h-4" /> Create Clients Bulk
        </TabsTrigger>
        <TabsTrigger value="update-client" className="gap-2">
          <PencilLine className="w-4 h-4" /> Update Client
        </TabsTrigger>
        <TabsTrigger value="lock-unlock" className="gap-2">
          <Lock className="w-4 h-4" /> Lock / Unlock Clients
        </TabsTrigger>
      </TabsList>

      <TabsContent value="fetch-clients" className="mt-4">
        <FetchAllClients />
      </TabsContent>

      <TabsContent value="create-client" className="mt-4">
        <CreateClient />
      </TabsContent>

      <TabsContent value="create-bulk" className="mt-4">
        <CreateClientsBulk />
      </TabsContent>

      <TabsContent value="update-client" className="mt-4">
        <UpdateClient />
      </TabsContent>

      <TabsContent value="lock-unlock" className="mt-4">
        <SetClientLock />
      </TabsContent>
    </Tabs>
  </div>
);

export default MFInvestorMasterPage;
