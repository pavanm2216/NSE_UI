import React, { useState } from 'react';
import { Users, UserPlus, UsersRound, Trash2, Plus, AlertCircle, CheckCircle2, PencilLine } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getOrFetchAggregatorToken } from '@/services/investwellAuthService';

const getToken = () => getOrFetchAggregatorToken();

// ─── Single User Form ─────────────────────────────────────────────────────────
const EMPTY_USER = {
  username: '', email: '', phone: '', password: '', name: '',
  levelName: '', roleName: '', reportingToUserBusinessCode: '',
  reportingToUsername: '', reportingToLevelName: '', euin: '',
  subBrokerArn: '', brokerCategory: '', userBusinessCode: '',
  enrollmentDate: '', dob: '', address1: '', address2: '',
  country: '', state: '', city: '', pin: '',
  arnValidityFromDate: '', arnValidityToDate: '', pan: '',
  paymentMode: '', accountType: '', bankName: '', branchName: '',
  accountNo: '', accountHolderName: '', MICRNo: '', IFSCCode: '',
  tdsPercentage: '', allowIps: '', activationMail: '',
};

type UserForm = typeof EMPTY_USER & { removeEditPermission: boolean; use2FactorAuth: boolean; defaultRM: boolean };

const EMPTY_FULL: UserForm = {
  ...EMPTY_USER,
  removeEditPermission: false,
  use2FactorAuth: false,
  defaultRM: false,
};

function buildPayload(f: UserForm) {
  const p: Record<string, unknown> = {};
  (Object.keys(EMPTY_USER) as (keyof typeof EMPTY_USER)[]).forEach(k => {
    if (k === 'allowIps') return;
    if ((f[k] as string).trim()) p[k] = (f[k] as string).trim();
  });
  if (f.allowIps.trim()) p.allowIps = f.allowIps.split(',').map(ip => ip.trim()).filter(Boolean);
  p.removeEditPermission = f.removeEditPermission;
  p.use2FactorAuth = f.use2FactorAuth;
  p.defaultRM = f.defaultRM;
  return p;
}

const CreateSingleUser: React.FC = () => {
  const [form, setForm] = useState<UserForm>({ ...EMPTY_FULL });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejected, setRejected] = useState<string[]>([]);

  const set = (k: keyof typeof EMPTY_USER) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const setBool = (k: 'removeEditPermission' | 'use2FactorAuth' | 'defaultRM') =>
    setForm(f => ({ ...f, [k]: !f[k] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setRejected([]);
    if (!form.username.trim() || !form.email.trim() || !form.phone.trim() || !form.name.trim() || !form.levelName.trim()) {
      setError('Username, Email, Phone, Name and Level Name are required.'); return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/iw-api/aggregator/utils/createUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ users: [buildPayload(form)] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      if (json.status === 0 || json.status === 1) {
        setSuccess(json.message || 'User creation request submitted successfully.');
        setRejected(json.result?.rejectedUsers ?? []);
        setForm({ ...EMPTY_FULL });
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const F = ({ label, k, required, placeholder, type }: { label: string; k: keyof typeof EMPTY_USER; required?: boolean; placeholder?: string; type?: string }) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      <Input type={type ?? 'text'} value={form[k] as string} onChange={set(k)} placeholder={placeholder ?? ''} className="h-9 text-sm" />
    </div>
  );

  const Toggle = ({ label, k }: { label: string; k: 'removeEditPermission' | 'use2FactorAuth' | 'defaultRM' }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={form[k]} onChange={() => setBool(k)} className="w-4 h-4 accent-[#0D3B66]" />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
            </div>
            {rejected.length > 0 && (
              <p className="text-xs text-rose-600 ml-7">Rejected: {rejected.join(', ')}</p>
            )}
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Mandatory */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Required Fields</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Username" k="username" required placeholder="dem798o1124" />
          <F label="Email" k="email" required placeholder="user@example.com" />
          <F label="Phone" k="phone" required placeholder="9876543210" />
          <F label="Full Name" k="name" required placeholder="Demo New" />
          <F label="Level Name" k="levelName" required placeholder="Sub Broker" />
          <F label="Password" k="password" type="password" placeholder="••••••••" />
        </div>
      </div>

      {/* Role & Reporting */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Role & Reporting</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Role Name" k="roleName" placeholder="Custom role only" />
          <F label="Reporting To (Business Code)" k="reportingToUserBusinessCode" placeholder="E2321" />
          <F label="Reporting To (Username)" k="reportingToUsername" placeholder="rm_username" />
          <F label="Reporting To (Level Name)" k="reportingToLevelName" placeholder="Relationship Manager" />
          <F label="User Business Code" k="userBusinessCode" placeholder="AD122214" />
          <F label="Default RM" k="username" required={false} placeholder="" />
        </div>
        <div className="mt-3">
          <Toggle label="Default RM" k="defaultRM" />
        </div>
      </div>

      {/* Professional */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Professional Details</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="EUIN" k="euin" placeholder="E123456" />
          <F label="Sub Broker ARN" k="subBrokerArn" placeholder="ARN-12345" />
          <F label="Broker Category" k="brokerCategory" placeholder="A" />
          <F label="Enrollment Date" k="enrollmentDate" placeholder="YYYY-MM-DD" />
          <F label="DOB" k="dob" placeholder="YYYY-MM-DD" />
          <F label="PAN" k="pan" placeholder="ABCPY1234D" />
          <F label="ARN Validity From" k="arnValidityFromDate" placeholder="YYYY-MM-DD" />
          <F label="ARN Validity To" k="arnValidityToDate" placeholder="YYYY-MM-DD" />
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Address</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Address Line 1" k="address1" placeholder="FLAT 123" />
          <F label="Address Line 2" k="address2" placeholder="UNKNOWN ROAD" />
          <F label="City" k="city" placeholder="Indore" />
          <F label="State" k="state" placeholder="Madhya Pradesh" />
          <F label="Country" k="country" placeholder="INDIA" />
          <F label="PIN Code" k="pin" placeholder="435678" />
        </div>
      </div>

      {/* Bank */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Bank & Payment</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Payment Mode" k="paymentMode" placeholder="rtgs/neft or cheque" />
          <F label="Account Type" k="accountType" placeholder="SB or CA" />
          <F label="Bank Name" k="bankName" placeholder="HDFC" />
          <F label="Branch Name" k="branchName" placeholder="TADHAWARA" />
          <F label="Account No" k="accountNo" placeholder="121322443225" />
          <F label="Account Holder Name" k="accountHolderName" placeholder="Demo New" />
          <F label="MICR No" k="MICRNo" placeholder="005943" />
          <F label="IFSC Code" k="IFSCCode" placeholder="SBIN0001234" />
          <F label="TDS Percentage" k="tdsPercentage" placeholder="7" />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Permissions & Settings</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Allowed IPs (comma-separated)" k="allowIps" placeholder="192.158.1.38, 10.0.0.1" />
          <F label="Activation Mail" k="activationMail" placeholder="yes / no" />
        </div>
        <div className="flex flex-wrap gap-6 mt-4">
          <Toggle label="Remove Edit Permission" k="removeEditPermission" />
          <Toggle label="Use 2-Factor Auth" k="use2FactorAuth" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <UserPlus className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Creating…' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

// ─── Bulk Users ───────────────────────────────────────────────────────────────
const EMPTY_BULK_ROW = {
  username: '', email: '', phone: '', name: '', levelName: '',
  password: '', userBusinessCode: '', reportingToUserBusinessCode: '',
  reportingToLevelName: '', euin: '', pan: '',
};
type BulkRow = typeof EMPTY_BULK_ROW;

interface RejectedUser { username?: string; reason?: string; }

const CreateUsersBulk: React.FC = () => {
  const [rows, setRows] = useState<BulkRow[]>([{ ...EMPTY_BULK_ROW }, { ...EMPTY_BULK_ROW }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejected, setRejected] = useState<RejectedUser[]>([]);

  const setField = (i: number, k: keyof BulkRow, v: string) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  const addRow = () => setRows(r => [...r, { ...EMPTY_BULK_ROW }]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setRejected([]);
    const invalid = rows.findIndex(r => !r.username.trim() || !r.email.trim() || !r.phone.trim() || !r.name.trim() || !r.levelName.trim());
    if (invalid !== -1) { setError(`Row ${invalid + 1}: Username, Email, Phone, Name and Level Name are required.`); return; }
    setLoading(true);
    try {
      const token = await getToken();
      const users = rows.map(row => {
        const p: Record<string, string> = {};
        (Object.keys(row) as (keyof BulkRow)[]).forEach(k => { if (row[k].trim()) p[k] = row[k].trim(); });
        return p;
      });
      const res = await fetch('/iw-api/aggregator/utils/createUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ users }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      if (json.status === 0 || json.status === 1) {
        setSuccess(json.message || 'Bulk user creation request submitted.');
        setRejected(json.result?.rejectedUsers ?? []);
        setRows([{ ...EMPTY_BULK_ROW }, { ...EMPTY_BULK_ROW }]);
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const F = ({ label, k, i, required, placeholder, width }: {
    label: string; k: keyof BulkRow; i: number; required?: boolean; placeholder?: string; width?: string;
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
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex gap-3 items-start">
        <span className="mt-0.5">ℹ️</span>
        <span>Each row requires <strong className="text-foreground">Username, Email, Phone, Name and Level Name</strong>. Empty fields are ignored.</span>
      </div>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{success}</p>
            </div>
            {rejected.length > 0 && (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Username</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rejected.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{r.username ?? '—'}</td>
                        <td className="px-3 py-2">
                          <Badge className="text-[10px] bg-rose-100 text-rose-700 border-0">{r.reason ?? 'Rejected'}</Badge>
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

      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rows.map((_, i) => (
          <Card key={i} className="border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">User {i + 1}</span>
                {rows.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeRow(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              {/* Required */}
              <div className="flex flex-wrap gap-3">
                <F label="Username" k="username" i={i} required placeholder="dem798o1124" width="flex-1 min-w-[140px]" />
                <F label="Email" k="email" i={i} required placeholder="user@example.com" width="flex-1 min-w-[160px]" />
                <F label="Phone" k="phone" i={i} required placeholder="9876543210" width="w-32" />
                <F label="Full Name" k="name" i={i} required placeholder="Demo New" width="flex-1 min-w-[140px]" />
                <F label="Level Name" k="levelName" i={i} required placeholder="Sub Broker" width="w-32" />
              </div>
              {/* Optional */}
              <div className="flex flex-wrap gap-3">
                <F label="Password" k="password" i={i} placeholder="••••••••" width="w-32" />
                <F label="User Biz Code" k="userBusinessCode" i={i} placeholder="AD122214" width="w-32" />
                <F label="Reporting Biz Code" k="reportingToUserBusinessCode" i={i} placeholder="E2321" width="w-36" />
                <F label="Reporting Level" k="reportingToLevelName" i={i} placeholder="RM" width="w-32" />
                <F label="EUIN" k="euin" i={i} placeholder="E123456" width="w-28" />
                <F label="PAN" k="pan" i={i} placeholder="ABCPY1234D" width="w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-2">
          <Plus className="w-4 h-4" /> Add Another User
        </Button>
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <UsersRound className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Submitting…' : `Submit ${rows.length} User${rows.length > 1 ? 's' : ''}`}
        </Button>
      </div>
    </form>
  );
};

// ─── Update User ─────────────────────────────────────────────────────────────
const EMPTY_UPDATE = {
  username: '', userBusinessCode: '', email: '', phone: '', password: '',
  name: '', levelName: '', roleName: '', reportingToUsername: '',
  reportingToUserBusinessCode: '', reportingToLevelName: '', euin: '',
  subBrokerArn: '', brokerCategory: '', enrollmentDate: '', dob: '',
  address1: '', address2: '', country: '', state: '', city: '', pin: '',
  arnValidityFromDate: '', arnValidityToDate: '', pan: '',
  paymentMode: '', accountType: '', bankName: '', branchName: '',
  accountNo: '', accountHolderName: '', MICRNo: '', IFSCCode: '',
  tdsPercentage: '', allowIps: '', activationMail: '', suspended: '',
};

type UpdateForm = typeof EMPTY_UPDATE & { removeEditPermission: boolean; use2FactorAuth: boolean; defaultRm: boolean };

const EMPTY_UPDATE_FULL: UpdateForm = {
  ...EMPTY_UPDATE,
  removeEditPermission: false,
  use2FactorAuth: false,
  defaultRm: false,
};

function buildUpdatePayload(f: UpdateForm) {
  const p: Record<string, unknown> = {};
  (Object.keys(EMPTY_UPDATE) as (keyof typeof EMPTY_UPDATE)[]).forEach(k => {
    if (k === 'allowIps') return;
    if ((f[k] as string).trim()) p[k] = (f[k] as string).trim();
  });
  if (f.allowIps.trim()) p.allowIps = f.allowIps.split(',').map(ip => ip.trim()).filter(Boolean);
  p.removeEditPermission = f.removeEditPermission;
  p.use2FactorAuth = f.use2FactorAuth;
  p.defaultRm = f.defaultRm;
  return p;
}

const UpdateUser: React.FC = () => {
  const [form, setForm] = useState<UpdateForm>({ ...EMPTY_UPDATE_FULL });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k: keyof typeof EMPTY_UPDATE) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const setBool = (k: 'removeEditPermission' | 'use2FactorAuth' | 'defaultRm') =>
    setForm(f => ({ ...f, [k]: !f[k] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.username.trim() && !form.userBusinessCode.trim()) {
      setError('Either Username or User Business Code is required to identify the user.'); return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/iw-api/aggregator/utils/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ user: buildUpdatePayload(form) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      if (json.status === 0 || json.status === 1) {
        setSuccess(json.message || 'User updated successfully.');
        setForm({ ...EMPTY_UPDATE_FULL });
      } else {
        throw new Error(`[${json.status}] ${json.message}`);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    setLoading(false);
  };

  const F = ({ label, k, required, placeholder, type }: {
    label: string; k: keyof typeof EMPTY_UPDATE; required?: boolean; placeholder?: string; type?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      <Input type={type ?? 'text'} value={form[k] as string} onChange={set(k)} placeholder={placeholder ?? ''} className="h-9 text-sm" />
    </div>
  );

  const Toggle = ({ label, k }: { label: string; k: 'removeEditPermission' | 'use2FactorAuth' | 'defaultRm' }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={form[k]} onChange={() => setBool(k)} className="w-4 h-4 accent-[#0D3B66]" />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex gap-3 items-start">
        <span className="mt-0.5">ℹ️</span>
        <span>Either <strong className="text-foreground">Username</strong> or <strong className="text-foreground">User Business Code</strong> is mandatory to identify the user. Fill only fields you want to update — empty fields are ignored.</span>
      </div>

      {success && (
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Identity */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Identity <span className="normal-case font-normal">(at least one required)</span></p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Username" k="username" required placeholder="tia12" />
          <F label="User Business Code" k="userBusinessCode" required placeholder="7018" />
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Basic Info</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Full Name" k="name" placeholder="Tiya Gupta" />
          <F label="Email" k="email" placeholder="user@example.com" />
          <F label="Phone" k="phone" placeholder="8906789844" />
          <F label="Password" k="password" type="password" placeholder="••••••••" />
          <F label="DOB" k="dob" placeholder="YYYY-MM-DD" />
          <F label="Level Name" k="levelName" placeholder="Sub Broker" />
          <F label="Suspended" k="suspended" placeholder="0 = active, 1 = suspended" />
        </div>
      </div>

      {/* Role & Reporting */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Role & Reporting</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Role Name" k="roleName" placeholder="Custom role only" />
          <F label="Reporting To (Username)" k="reportingToUsername" placeholder="Demo" />
          <F label="Reporting To (Biz Code)" k="reportingToUserBusinessCode" placeholder="E2321" />
          <F label="Reporting To (Level Name)" k="reportingToLevelName" placeholder="Broker" />
        </div>
        <div className="mt-3">
          <Toggle label="Default RM" k="defaultRm" />
        </div>
      </div>

      {/* Professional */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Professional Details</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="EUIN" k="euin" placeholder="E876645" />
          <F label="Sub Broker ARN" k="subBrokerArn" placeholder="SDCWE" />
          <F label="Broker Category" k="brokerCategory" placeholder="A" />
          <F label="Enrollment Date" k="enrollmentDate" placeholder="YYYY-MM-DD" />
          <F label="PAN" k="pan" placeholder="ABCYT1134O" />
          <F label="ARN Validity From" k="arnValidityFromDate" placeholder="YYYY-MM-DD" />
          <F label="ARN Validity To" k="arnValidityToDate" placeholder="YYYY-MM-DD" />
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Address</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Address Line 1" k="address1" placeholder="A543" />
          <F label="Address Line 2" k="address2" placeholder="Subhash Chowk" />
          <F label="City" k="city" placeholder="Gurgaon" />
          <F label="State" k="state" placeholder="Haryana" />
          <F label="Country" k="country" placeholder="INDIA" />
          <F label="PIN Code" k="pin" placeholder="121210" />
        </div>
      </div>

      {/* Bank */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Bank & Payment</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Payment Mode" k="paymentMode" placeholder="rtgs/neft or cheque" />
          <F label="Account Type" k="accountType" placeholder="SB or CA" />
          <F label="Bank Name" k="bankName" placeholder="HDFC" />
          <F label="Branch Name" k="branchName" placeholder="Chinhut" />
          <F label="Account No" k="accountNo" placeholder="48907876345" />
          <F label="Account Holder Name" k="accountHolderName" placeholder="Meera Singh" />
          <F label="MICR No" k="MICRNo" placeholder="110002007" />
          <F label="IFSC Code" k="IFSCCode" placeholder="HDFC0001234" />
          <F label="TDS Percentage" k="tdsPercentage" placeholder="7" />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Permissions & Settings</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Allowed IPs (comma-separated)" k="allowIps" placeholder="192.158.1.38, 10.0.0.1" />
          <F label="Activation Mail" k="activationMail" placeholder="yes / no" />
        </div>
        <div className="flex flex-wrap gap-6 mt-4">
          <Toggle label="Remove Edit Permission" k="removeEditPermission" />
          <Toggle label="Use 2-Factor Auth" k="use2FactorAuth" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2 bg-[#0D3B66] hover:bg-[#0D3B66]/90 text-white px-8">
          <PencilLine className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Updating…' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const MFUserMasterPage: React.FC = () => (
  <div className="space-y-6 pb-10">
    <div className="flex items-center gap-3">
      <Users className="w-6 h-6 text-[#0D3B66]" />
      <div>
        <h1 className="text-2xl font-bold">User Master</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage and create users in the system</p>
      </div>
    </div>

    <Tabs defaultValue="create-user">
      <TabsList>
        <TabsTrigger value="create-user" className="gap-2">
          <UserPlus className="w-4 h-4" /> Create User
        </TabsTrigger>
        <TabsTrigger value="create-bulk" className="gap-2">
          <UsersRound className="w-4 h-4" /> Create Users Bulk
        </TabsTrigger>
        <TabsTrigger value="update-user" className="gap-2">
          <PencilLine className="w-4 h-4" /> Update User
        </TabsTrigger>
      </TabsList>

      <TabsContent value="create-user" className="mt-4">
        <CreateSingleUser />
      </TabsContent>

      <TabsContent value="create-bulk" className="mt-4">
        <CreateUsersBulk />
      </TabsContent>

      <TabsContent value="update-user" className="mt-4">
        <UpdateUser />
      </TabsContent>
    </Tabs>
  </div>
);

export default MFUserMasterPage;
