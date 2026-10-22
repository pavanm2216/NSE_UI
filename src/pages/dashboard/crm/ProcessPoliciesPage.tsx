import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Shield, Search, X, Pencil, Trash2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const TOKEN_KEY = 'lendrix_access_token';
const BASE = 'https://api.lendrixventech.com/team-access/policies';

type ApiPolicy = { id: number; name: string; category: string; description: string; is_active: boolean; document_url: string | null };
type ApiLimitation = { id: number; policy_id: number; title: string; description: string; is_enabled: boolean };
type ApiStats = { active_policies: number; total_policies: number; processes: number };

const ProcessPoliciesPage: React.FC = () => {
  const [stats, setStats]               = useState<ApiStats | null>(null);
  const [policies, setPolicies]         = useState<ApiPolicy[]>([]);
  const [limitations, setLimitations]   = useState<ApiLimitation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState<'policies' | 'limitations'>('policies');

  // edit state
  const [editingId, setEditingId]       = useState<number | null>(null);
  const [editForm, setEditForm]         = useState<Partial<ApiPolicy & ApiLimitation>>({});
  const [saving, setSaving]             = useState(false);

  // delete confirm
  const [deleteId, setDeleteId]         = useState<number | null>(null);
  const [deleteType, setDeleteType]     = useState<'policy' | 'limitation' | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const token = () => localStorage.getItem(TOKEN_KEY) ?? '';
  const headers = () => ({ accept: 'application/json', Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [sRes, pRes, lRes] = await Promise.all([
          fetch(`${BASE}/stats`,       { headers: headers() }),
          fetch(`${BASE}/`,            { headers: headers() }),
          fetch(`${BASE}/limitations`, { headers: headers() }),
        ]);
        if (sRes.ok) setStats(await sRes.json());
        if (pRes.ok) { const d = await pRes.json(); if (Array.isArray(d)) setPolicies(d); }
        if (lRes.ok) { const d = await lRes.json(); if (Array.isArray(d)) setLimitations(d); }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  // ── Update ──────────────────────────────────────────────────────────
  const handleSavePolicy = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
      } else {
        // optimistic update if API not available
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...editForm } as ApiPolicy : p));
      }
    } catch {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, ...editForm } as ApiPolicy : p));
    } finally { setSaving(false); setEditingId(null); }
  };

  const handleSaveLimitation = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/limitations/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setLimitations(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
      } else {
        setLimitations(prev => prev.map(l => l.id === id ? { ...l, ...editForm } as ApiLimitation : l));
      }
    } catch {
      setLimitations(prev => prev.map(l => l.id === id ? { ...l, ...editForm } as ApiLimitation : l));
    } finally { setSaving(false); setEditingId(null); }
  };

  // ── Delete ──────────────────────────────────────────────────────────
  const handleDeletePolicy = async (id: number) => {
    setDeleting(true);
    try {
      await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: headers() });
      setPolicies(prev => prev.filter(p => p.id !== id));
    } catch {}
    finally { setDeleting(false); setDeleteId(null); setDeleteType(null); }
  };

  const handleDeleteLimitation = async (id: number) => {
    setDeleting(true);
    try {
      await fetch(`${BASE}/limitations/${id}`, { method: 'DELETE', headers: headers() });
      setLimitations(prev => prev.filter(l => l.id !== id));
    } catch {}
    finally { setDeleting(false); setDeleteId(null); setDeleteType(null); }
  };

  const filteredPolicies    = policies.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLimitations = limitations.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.description.toLowerCase().includes(search.toLowerCase())
  );

  const summaryCards = [
    { label: 'Active Policies',   value: stats?.active_policies ?? 0, color: 'text-green-600', bg: 'bg-green-50',  icon: CheckCircle },
    { label: 'Total Policies',    value: stats?.total_policies ?? 0,  color: 'text-blue-600',  bg: 'bg-blue-50',   icon: FileText },
    { label: 'Limitations',       value: limitations.length,          color: 'text-red-600',   bg: 'bg-red-50',    icon: Shield },
    { label: 'Categories',        value: [...new Set(policies.map(p => p.category))].length, color: 'text-orange-600', bg: 'bg-orange-50', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Process &amp; Policies</h1>
        <p className="text-sm text-muted-foreground">Manage company-wide active policies and compliance rules</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((c, i) => (
          <div key={i} className={`rounded-xl p-4 flex items-center gap-3 border ${c.bg}`}>
            <c.icon className={`w-8 h-8 ${c.color}`} />
            <div>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['policies', 'limitations'] as const).map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSearch(''); setEditingId(null); }}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {tab === 'policies' ? `Policies (${policies.length})` : `Limitations (${limitations.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* ── POLICIES TABLE ── */}
      {activeTab === 'policies' && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-48">Policy</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-36">Subtitle (Category)</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-32">Document View</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-36">Update / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
              ) : filteredPolicies.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No policies found.</td></tr>
              ) : filteredPolicies.map((p, i) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/20 transition-colors align-top">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>

                  {/* Policy Name */}
                  <td className="px-4 py-3 font-medium">
                    {editingId === p.id
                      ? <Input value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="h-8 text-sm" />
                      : <span>{p.name}</span>}
                    <div className="mt-1">
                      {p.is_active
                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">Active</Badge>
                        : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-[10px]">Inactive</Badge>}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {editingId === p.id
                      ? <Input value={editForm.category ?? ''} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="h-8 text-sm" />
                      : <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 text-xs">{p.category}</Badge>}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {editingId === p.id
                      ? <Textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="text-sm min-h-[80px]" />
                      : <span className="line-clamp-3">{p.description}</span>}
                  </td>

                  {/* Document */}
                  <td className="px-4 py-3">
                    {p.document_url
                      ? <a href={p.document_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                          <FileText className="w-3 h-3" /> View Doc
                        </a>
                      : <span className="text-xs text-muted-foreground">No document</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 px-2 text-xs gap-1 bg-green-600 hover:bg-green-700"
                          disabled={saving} onClick={() => handleSavePolicy(p.id)}>
                          <Save className="w-3 h-3" />{saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
                          onClick={() => setEditingId(null)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, category: p.category, description: p.description }); }}>
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => { setDeleteId(p.id); setDeleteType('policy'); }}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── LIMITATIONS TABLE ── */}
      {activeTab === 'limitations' && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-48">Policy</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-48">Subtitle (Title)</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-32">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-36">Update / Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
              ) : filteredLimitations.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No limitations found.</td></tr>
              ) : filteredLimitations.map((l, i) => {
                const policyName = policies.find(p => p.id === l.policy_id)?.name;
                return (
                  <tr key={l.id} className="border-b border-border hover:bg-muted/20 transition-colors align-top">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>

                    {/* Related Policy */}
                    <td className="px-4 py-3">
                      {policyName
                        ? <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 text-xs">{policyName}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 font-medium">
                      {editingId === l.id
                        ? <Input value={editForm.title ?? ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="h-8 text-sm" />
                        : l.title}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {editingId === l.id
                        ? <Textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="text-sm min-h-[80px]" />
                        : <span className="line-clamp-3">{l.description}</span>}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {l.is_enabled
                        ? <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">Enabled</Badge>
                        : <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 text-xs">Disabled</Badge>}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {editingId === l.id ? (
                        <div className="flex gap-2">
                          <Button size="sm" className="h-7 px-2 text-xs gap-1 bg-green-600 hover:bg-green-700"
                            disabled={saving} onClick={() => handleSaveLimitation(l.id)}>
                            <Save className="w-3 h-3" />{saving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
                            onClick={() => setEditingId(null)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => { setEditingId(l.id); setEditForm({ title: l.title, description: l.description }); }}>
                            <Pencil className="w-3 h-3" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => { setDeleteId(l.id); setDeleteType('limitation'); }}>
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">Confirm Delete</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => { setDeleteId(null); setDeleteType(null); }}>
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={deleting}
                onClick={() => deleteType === 'policy' ? handleDeletePolicy(deleteId) : handleDeleteLimitation(deleteId)}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessPoliciesPage;
