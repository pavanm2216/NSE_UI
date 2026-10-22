import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Save, Trash2, AlertTriangle, CheckCircle, Clock, X, Shield, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { usePolicyStore } from '@/hooks/usePolicyStore';

const TOKEN_KEY = 'lendrix_access_token';

const emptyPolicy = { name: '', description: '', category: '', isActive: true, priority: 1, submittedBy: "Angel & VC's" };

const AdminProcessPoliciesPage: React.FC = () => {
  const {
    policies, limitations,
    addPolicy, updatePolicy, deletePolicy, approvePolicy, rejectPolicy,
    addLimitation, updateLimitation, deleteLimitation, toggleLimitation,
  } = usePolicyStore();

  // API stats
  const [apiStats, setApiStats] = useState<{ active_policies: number; total_policies: number; processes: number } | null>(null);
  const [apiPolicies, setApiPolicies] = useState<{ id: number; name: string; category: string; description: string; document_url: string | null; is_active: boolean }[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [policyRequests, setPolicyRequests] = useState<{
    id: number; action: string; policy_id: number | null; policy_name: string | null;
    name: string | null; category: string | null; description: string | null;
    is_active: boolean | null; requested_by: string; status: string;
    admin_note: string | null; created_at: string; reviewed_at: string | null;
  }[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);


  // Limitation requests
  const [limitationRequests, setLimitationRequests] = useState<{
    id: number; action: string; policy_id: number | null; policy_name: string | null;
    limitation_id: number | null; title: string | null; description: string | null;
    is_enabled: boolean | null; requested_by: string; status: string;
    admin_note: string | null; created_at: string; reviewed_at: string | null;
  }[]>([]);
  const [loadingLimReqs, setLoadingLimReqs] = useState(false);

  const [reviewingLimId, setReviewingLimId] = useState<number | null>(null);
  const [limAdminNote, setLimAdminNote] = useState('');
  const [limReviewLoading, setLimReviewLoading] = useState(false);

  // Policy reviews
  const [policyReviews, setPolicyReviews] = useState<{
    id: number; policy_id: number; reviewed_by: string; review: string; status: string; created_at: string;
  }[]>([]);

  const fetchPolicyReviews = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('https://api.lendrixventech.com/angel-vcs/policy-requests/policy-reviews', {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setPolicyReviews(data.filter((r: any) => r && typeof r === 'object')); })
      .catch(() => {});
  };

  const handleResolveReview = async (reviewId: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`https://api.lendrixventech.com/angel-vcs/policy-requests/policy-reviews/resolve?review_id=${reviewId}`, {
        method: 'PUT',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      setPolicyReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'resolved' } : r));
      setViewReviewItem(prev => prev ? {
        ...prev,
        reviews: prev.reviews.map(r => r.id === reviewId ? { ...r, status: 'resolved' } : r),
      } : null);
    } catch {}
  };

  const fetchLimitationRequests = (status?: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoadingLimReqs(true);
    const url = status
      ? `https://api.lendrixventech.com/angel-vcs/policy-requests/limitations?status=${status}`
      : 'https://api.lendrixventech.com/angel-vcs/policy-requests/limitations';
    fetch(url, { headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setLimitationRequests(data); })
      .catch(() => {})
      .finally(() => setLoadingLimReqs(false));
  };

  const handleLimReviewRequest = async (id: number, action: 'approved' | 'rejected') => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLimReviewLoading(true);
    const endpoint = action === 'approved'
      ? 'https://api.lendrixventech.com/angel-vcs/policy-requests/limitations/approve'
      : 'https://api.lendrixventech.com/angel-vcs/policy-requests/limitations/reject';
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, admin_note: limAdminNote }),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {}
    finally {
      setLimitationRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: action, admin_note: limAdminNote, reviewed_at: new Date().toISOString() } : r
      ));
      setReviewingLimId(null);
      setLimAdminNote('');
      setLimReviewLoading(false);
      fetchLimitations(selectedPolicyId ?? undefined);
    }
  };

  const fetchPolicyRequests = (status?: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoadingRequests(true);
    const url = status
      ? `https://api.lendrixventech.com/angel-vcs/policy-requests/?status=${status}`
      : 'https://api.lendrixventech.com/angel-vcs/policy-requests/';
    fetch(url, {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setPolicyRequests(data); })
      .catch(() => {})
      .finally(() => setLoadingRequests(false));
  };
  const [apiLimitations, setApiLimitations] = useState<{ id: number; policy_id: number; title: string; description: string; is_enabled: boolean }[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);

  const fetchLimitations = (policyId?: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const url = policyId
      ? `https://api.lendrixventech.com/angel-vcs/policies/limitations/${policyId}`
      : 'https://api.lendrixventech.com/angel-vcs/policies/limitations';
    fetch(url, {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setApiLimitations(data); })
      .catch(() => {});
  };

  const fetchStats = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('https://api.lendrixventech.com/angel-vcs/policies/stats', {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setApiStats(data); })
      .catch(() => {});
  };

  const fetchPolicies = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setLoadingPolicies(true);
    fetch('https://api.lendrixventech.com/angel-vcs/policies/', {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setApiPolicies(data); })
      .catch(() => {})
      .finally(() => setLoadingPolicies(false));
  };

  // GET /angel-vcs/policy-requests/policies/pending-acceptance
  const [pendingAcceptance, setPendingAcceptance] = useState<{ id: number; name: string; category: string; description: string; is_active: boolean; document_url: string | null }[]>([]);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const fetchPendingAcceptance = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch('https://api.lendrixventech.com/angel-vcs/policy-requests/policies/pending-acceptance', {
      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setPendingAcceptance(data); })
      .catch(() => {});
  };

  // PUT /angel-vcs/policy-requests/policies/accept
  const handleAcceptPolicy = async (policyId: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setAcceptingId(policyId);
    try {
      const res = await fetch('https://api.lendrixventech.com/angel-vcs/policy-requests/policies/accept', {
        method: 'PUT',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy_id: policyId }),
      });
      if (res.ok) {
        fetchPendingAcceptance();
        fetchPolicies();
        fetchStats();
      }
    } catch {}
    finally { setAcceptingId(null); }
  };

  useEffect(() => {
    fetchStats();
    fetchPolicies();
    fetchLimitations();
    fetchPolicyRequests();
    fetchLimitationRequests();
    fetchPolicyReviews();
    fetchPendingAcceptance();
  }, []);

  // Policy states
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState(emptyPolicy);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', description: '', category: '', isActive: true });

  // Limitation states
  const [showAddLimitation, setShowAddLimitation] = useState(false);
  const [newLimitation, setNewLimitation] = useState({ policyId: 0, name: '', description: '', enabled: true });
  const [savingLimitation, setSavingLimitation] = useState(false);
  const [saveLimError, setSaveLimError] = useState('');
  const [editLimId, setEditLimId] = useState<number | null>(null);
  const [editLimData, setEditLimData] = useState({ name: '', description: '' });

  const [savingPolicy, setSavingPolicy] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Policy handlers
  const handleAddPolicy = async () => {
    if (!newPolicy.name || !newPolicy.description) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { addPolicy(newPolicy); setNewPolicy(emptyPolicy); setShowAddPolicy(false); return; }
    setSavingPolicy(true);
    setSaveError('');
    try {
      const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/save', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPolicy.name,
          category: newPolicy.category,
          description: newPolicy.description,
        }),
      });
      if (!res.ok) throw new Error('Failed to save policy.');
      // Refresh list and stats from API
      fetchPolicies();
      fetchStats();
      setNewPolicy(emptyPolicy);
      setShowAddPolicy(false);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save. Please try again.');
      // Fallback: save locally
      addPolicy(newPolicy);
      setNewPolicy(emptyPolicy);
      setShowAddPolicy(false);
    } finally {
      setSavingPolicy(false);
    }
  };

  const startEdit = (id: number) => {
    const p = policies.find(x => x.id === id);
    if (!p) return;
    setEditId(id);
    setEditData({ name: p.name, description: p.description, category: p.category, isActive: p.isActive });
  };

  const saveEdit = async () => {
    if (!editId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const isApiPolicy = apiPolicies.find(ap => ap.id === editId);
    if (token && isApiPolicy) {
      try {
        const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/update', {
          method: 'PUT',
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policy_id: editId,
            name: editData.name,
            category: editData.category,
            description: editData.description,
            is_active: editData.isActive,
          }),
        });
        if (!res.ok) throw new Error('Update failed');
        // Optimistically update local state so status badge reflects immediately
        setApiPolicies(prev => prev.map(p =>
          p.id === editId
            ? { ...p, name: editData.name, category: editData.category, description: editData.description, is_active: editData.isActive }
            : p
        ));
        fetchPolicies();
        fetchStats();
      } catch {
        updatePolicy(editId, editData);
      }
    } else {
      updatePolicy(editId, editData);
    }
    setEditId(null);
  };

  // Limitation handlers
  const handleAddLimitation = async () => {
    if (!newLimitation.name || !newLimitation.policyId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    setSavingLimitation(true);
    setSaveLimError('');
    try {
      const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/limitations/save', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policy_id: newLimitation.policyId,
          title: newLimitation.name,
          description: newLimitation.description,
          is_enabled: newLimitation.enabled,
        }),
      });
      if (!res.ok) throw new Error('Failed to save limitation.');
      fetchLimitations(selectedPolicyId ?? undefined);
      setNewLimitation({ policyId: 0, name: '', description: '', enabled: true });
      setShowAddLimitation(false);
    } catch (err: any) {
      setSaveLimError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSavingLimitation(false);
    }
  };

  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewDialogType, setReviewDialogType] = useState<'policy' | 'limitation' | null>(null);
  const [reviewDialogItem, setReviewDialogItem] = useState<any>(null);
  const [viewReviewItem, setViewReviewItem] = useState<{ name: string; reviews: { id: number; reviewed_by: string; review: string; status: string; created_at: string }[] } | null>(null);

  const openReviewDialog = (item: any, type: 'policy' | 'limitation') => {
    setReviewDialogItem(item);
    setReviewDialogType(type);
    setAdminNote('');
    setLimAdminNote('');
  };
  const closeReviewDialog = () => { setReviewDialogItem(null); setReviewDialogType(null); };

  const handleReviewRequest = async (id: number, action: 'approved' | 'rejected') => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setReviewLoading(true);
    const endpoint = action === 'approved'
      ? 'https://api.lendrixventech.com/angel-vcs/policy-requests/approve'
      : 'https://api.lendrixventech.com/angel-vcs/policy-requests/reject';
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, admin_note: adminNote }),
      });
      if (!res.ok) throw new Error('Request failed');
    } catch {
      // optimistic update even if API fails
    } finally {
      setPolicyRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: action, admin_note: adminNote, reviewed_at: new Date().toISOString() } : r
      ));
      setReviewingId(null);
      setAdminNote('');
      setReviewLoading(false);
      fetchStats();
      fetchPolicies();
    }
  };

  const handleDeletePolicy = async (id: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const isApiPolicy = apiPolicies.find(ap => ap.id === id);
    if (token && isApiPolicy) {
      try {
        const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/delete', {
          method: 'DELETE',
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ policy_id: id }),
        });
        if (!res.ok) throw new Error('Delete failed');
        fetchPolicies();
        fetchStats();
      } catch {
        deletePolicy(id);
      }
    } else {
      deletePolicy(id);
    }
  };

  const startEditLim = (id: number) => {
    const l = apiLimitations.find(x => x.id === id);
    if (!l) return;
    setEditLimId(id);
    setEditLimData({ name: l.title, description: l.description });
  };

  const saveEditLim = async () => {
    if (!editLimId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/limitations/update', {
        method: 'PUT',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limitation_id: editLimId,
          title: editLimData.name,
          description: editLimData.description,
          is_enabled: true,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      fetchLimitations(selectedPolicyId ?? undefined);
    } catch {
      updateLimitation(editLimId, editLimData);
    }
    setEditLimId(null);
  };

  const handleDeleteLimitation = async (id: number) => {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch('https://api.lendrixventech.com/angel-vcs/policies/limitations/delete', {
        method: 'DELETE',
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ limitation_id: id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchLimitations(selectedPolicyId ?? undefined);
    } catch {
      deleteLimitation(id);
    }
  };

  const [policiesTab, setPoliciesTab] = useState<'all' | 'approved' | 'rejected'>('all');
  const [reqTab, setReqTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [limReqTab, setLimReqTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredApiPolicies = apiPolicies.filter(ap => {
    if (policiesTab === 'all') return true;
    if (policiesTab === 'approved') return ap.is_active;
    if (policiesTab === 'rejected') return !ap.is_active;
    return true;
  });

  const filteredRequests = policyRequests.filter(r =>
    reqTab === 'all' ? true : r.status === reqTab
  );

  const filteredLimReqs = limitationRequests.filter(r =>
    limReqTab === 'all' ? true : r.status === limReqTab
  );

  const tabBtn = (active: boolean, onClick: () => void, label: string, count?: number) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>{count}</span>
      )}
    </button>
  );

  // Use API stats if available, otherwise fall back to local counts
  const totalPolicies = apiStats ? apiStats.total_policies  : apiPolicies.length;
  const approvedCount = apiStats ? apiStats.active_policies : apiPolicies.filter(p => p.is_active).length;
  const pendingCount  = policyRequests.filter(r => r.status === 'pending').length;
  const limPending    = limitationRequests.filter(r => r.status === 'pending').length;

  const summaryCards = [
    { label: 'Total Policies',     value: totalPolicies, color: 'text-primary',    bg: 'bg-primary',    icon: FileText },
    { label: 'Active Policies',    value: approvedCount, color: 'text-green-600',  bg: 'bg-green-500',  icon: CheckCircle },
    { label: 'Pending Requests',   value: pendingCount,  color: 'text-yellow-600', bg: 'bg-yellow-500', icon: Clock },
    { label: 'Pending Limitations',value: limPending,    color: 'text-orange-600', bg: 'bg-orange-500', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Process & Policies</h1>
          <p className="text-muted-foreground">Manage policies, limitations and approve compliance submissions</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => setShowAddPolicy(!showAddPolicy)}>
          <Plus className="mr-2 w-4 h-4" />Add Policy
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg}/10 flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Policy Form */}
      {showAddPolicy && (
        <Card>
          <CardHeader><CardTitle>Add New Policy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Policy Name</Label>
                <Input value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} placeholder="Enter policy name" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newPolicy.category} onChange={e => setNewPolicy({ ...newPolicy, category: e.target.value })} placeholder="Enter category" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newPolicy.description} onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })} placeholder="Enter policy description" rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={newPolicy.isActive} onCheckedChange={checked => setNewPolicy({ ...newPolicy, isActive: checked })} />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddPolicy} disabled={savingPolicy}>
                <Save className="mr-2 w-4 h-4" />{savingPolicy ? 'Saving...' : 'Submit for Review'}
              </Button>
              <Button variant="outline" onClick={() => { setShowAddPolicy(false); setSaveError(''); }}>Cancel</Button>
            </div>
            {saveError && <p className="text-xs text-red-500">{saveError}</p>}
          </CardContent>
        </Card>
      )}

      {/* Pending Acceptance from Compliance Team */}
      {pendingAcceptance.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Pending Acceptance
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{pendingAcceptance.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingAcceptance.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-orange-200 bg-white">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.description}</p>
                  {p.document_url && (
                    <a href={p.document_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" />View Document
                    </a>
                  )}
                </div>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shrink-0"
                  disabled={acceptingId === p.id}
                  onClick={() => handleAcceptPolicy(p.id)}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  {acceptingId === p.id ? 'Accepting...' : 'Accept'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Two separate cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT CARD: Process & Policies */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="text-lg">Process & Policies</CardTitle>
            </div>
            <div className="flex border-b border-border">
              {tabBtn(policiesTab === 'all', () => setPoliciesTab('all'), 'All', apiPolicies.length)}
              {tabBtn(policiesTab === 'approved', () => setPoliciesTab('approved'), 'Approved', apiPolicies.filter(p => p.is_active).length)}
              {tabBtn(policiesTab === 'rejected', () => setPoliciesTab('rejected'), 'Inactive', apiPolicies.filter(p => !p.is_active).length)}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingPolicies ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : filteredApiPolicies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No policies found.</div>
            ) : (
              <div>
                <div className="grid grid-cols-[1fr_120px_60px_80px] items-center gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30 rounded-t-lg">
                  <span>Policy</span>
                  <span className="text-center">Category</span>
                  <span className="text-center">Active</span>
                  <span className="text-center">Actions</span>
                </div>
                <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                  {filteredApiPolicies.map(ap => {
                    const isEditing = editId === ap.id;
                    const reviews = policyReviews.filter(r => r.policy_id === ap.id);
                    return (
                      <div key={ap.id}>
                        {isEditing ? (
                          <div className="p-4 space-y-3 bg-muted/10">
                            <div className="grid grid-cols-2 gap-2">
                              <Input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} placeholder="Policy name" className="h-8 text-sm" />
                              <Input value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} placeholder="Category" className="h-8 text-sm" />
                            </div>
                            <Textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className="min-h-[60px] text-sm" />
                            <div className="flex items-center gap-2">
                              <Switch checked={editData.isActive} onCheckedChange={checked => setEditData({ ...editData, isActive: checked })} />
                              <span className="text-sm text-muted-foreground">Active</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEdit}><Save className="w-3 h-3 mr-1" />Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-[1fr_120px_60px_80px] items-center gap-3 px-3 py-3 hover:bg-muted/20 transition-colors">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">{ap.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ap.description}</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {ap.document_url && (
                                  <a href={ap.document_url} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs bg-primary/10 border border-primary/20 rounded px-2 py-0.5 text-primary hover:bg-primary/20 transition-colors">
                                    <ExternalLink className="w-3 h-3" />View Doc
                                  </a>
                                )}
                                {reviews.length > 0 && (
                                  <button onClick={() => setViewReviewItem({ name: ap.name, reviews })}
                                    className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 rounded px-2 py-0.5 text-blue-600 hover:bg-blue-100 transition-colors">
                                    <Shield className="w-3 h-3" />Review
                                    <span className={`px-1.5 rounded-full font-medium ${
                                      reviews[0].status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{reviews[0].status}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <span className="text-center text-xs font-medium text-orange-600 truncate px-1">{ap.category || '—'}</span>
                            <div className="flex justify-center">
                              <Switch
                                checked={ap.is_active}
                                onCheckedChange={async (checked) => {
                                  const token = localStorage.getItem(TOKEN_KEY);
                                  if (!token) return;
                                  try {
                                    await fetch('https://api.lendrixventech.com/angel-vcs/policies/update', {
                                      method: 'PUT',
                                      headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ policy_id: ap.id, name: ap.name, category: ap.category, description: ap.description, is_active: checked }),
                                    });
                                  } catch {}
                                  setApiPolicies(prev => prev.map(p => p.id === ap.id ? { ...p, is_active: checked } : p));
                                  fetchStats();
                                }}
                              />
                            </div>
                            <div className="flex justify-center gap-1">
                              <Button size="icon" variant="outline" className="h-7 w-7 hover:bg-blue-50 hover:border-blue-300"
                                onClick={() => { setEditId(ap.id); setEditData({ name: ap.name, description: ap.description, category: ap.category, isActive: ap.is_active }); }}>
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="outline" className="h-7 w-7 text-destructive hover:bg-red-50 hover:border-red-300"
                                onClick={() => handleDeletePolicy(ap.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT CARD: Policy Limitations */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Policy Limitations</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  className="text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground"
                  value={selectedPolicyId ?? ''}
                  onChange={e => { const val = e.target.value ? Number(e.target.value) : null; setSelectedPolicyId(val); fetchLimitations(val ?? undefined); }}
                >
                  <option value="">All</option>
                  {apiPolicies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Button size="sm" variant="outline" onClick={() => setShowAddLimitation(!showAddLimitation)}>
                  <Plus className="w-3 h-3 mr-1" />Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {showAddLimitation && (
              <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                <select className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground" value={newLimitation.policyId || ''} onChange={e => setNewLimitation({ ...newLimitation, policyId: Number(e.target.value) })}>
                  <option value="">Select policy</option>
                  {apiPolicies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <Input value={newLimitation.name} onChange={e => setNewLimitation({ ...newLimitation, name: e.target.value })} placeholder="Limitation title" />
                <Input value={newLimitation.description} onChange={e => setNewLimitation({ ...newLimitation, description: e.target.value })} placeholder="Description" />
                <div className="flex items-center gap-2">
                  <Switch checked={newLimitation.enabled} onCheckedChange={checked => setNewLimitation({ ...newLimitation, enabled: checked })} />
                  <Label>Enabled</Label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddLimitation} disabled={savingLimitation || !newLimitation.policyId || !newLimitation.name}>
                    <Save className="w-3 h-3 mr-1" />{savingLimitation ? 'Saving...' : 'Add'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowAddLimitation(false); setSaveLimError(''); }}>Cancel</Button>
                </div>
                {saveLimError && <p className="text-xs text-red-500">{saveLimError}</p>}
              </div>
            )}
            {apiLimitations.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No limitations found.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px] items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30 rounded-t-lg">
                  <span>Policy</span>
                  <span>Subtitle</span>
                  <span>Description</span>
                  <span className="text-center">Doc View</span>
                  <span className="text-center">Actions</span>
                </div>
                <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                  {apiLimitations.map(lim => {
                    const policyName = apiPolicies.find(p => p.id === lim.policy_id)?.name ?? '—';
                    return editLimId === lim.id ? (
                      <div key={lim.id} className="p-4 space-y-2 bg-muted/10">
                        <Input value={editLimData.name} onChange={e => setEditLimData({ ...editLimData, name: e.target.value })} placeholder="Title" className="h-8 text-sm" />
                        <Input value={editLimData.description} onChange={e => setEditLimData({ ...editLimData, description: e.target.value })} placeholder="Description" className="h-8 text-sm" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEditLim}><Save className="w-3 h-3 mr-1" />Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditLimId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div key={lim.id} className="grid grid-cols-[1fr_1fr_1fr_80px_80px] items-center gap-2 px-3 py-3 hover:bg-muted/20 transition-colors">
                        <p className="text-sm font-medium truncate">{policyName}</p>
                        <p className="text-sm truncate">{lim.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{lim.description || '—'}</p>
                        <div className="flex justify-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lim.is_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {lim.is_enabled ? 'On' : 'Off'}
                          </span>
                        </div>
                        <div className="flex justify-center gap-1">
                          <Button size="icon" variant="outline" className="h-7 w-7 hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => { setEditLimId(lim.id); setEditLimData({ name: lim.title, description: lim.description }); }}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-7 w-7 text-destructive hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDeleteLimitation(lim.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Compliance Team - Two separate cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Policy Requests */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg">Policy Requests</CardTitle>
            </div>
            <div className="flex border-b border-border">
              {tabBtn(reqTab === 'all', () => setReqTab('all'), 'All')}
              {tabBtn(reqTab === 'pending', () => setReqTab('pending'), 'Pending', policyRequests.filter(r => r.status === 'pending').length)}
              {tabBtn(reqTab === 'approved', () => setReqTab('approved'), 'Approved')}
              {tabBtn(reqTab === 'rejected', () => setReqTab('rejected'), 'Rejected')}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingRequests ? (
              <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No requests found.</div>
            ) : (
              <div className="space-y-2">
                {filteredRequests.map(req => (
                  <div key={req.id} className={`border rounded-xl p-4 space-y-2 ${ req.status === 'pending' ? 'border-orange-200 bg-orange-50/30' : 'border-border' }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{req.policy_name ?? req.name ?? '—'}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            req.action === 'create' ? 'bg-blue-100 text-blue-700' :
                            req.action === 'update' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>{req.action}</span>
                        </div>
                        {req.category && <p className="text-xs text-muted-foreground">{req.category}</p>}
                        {req.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{req.description}</p>}
                        {req.action === 'status' && req.is_active !== null && (
                          <p className="text-xs text-muted-foreground mt-0.5">Requested status: <span className={`font-medium ${req.is_active ? 'text-green-600' : 'text-red-600'}`}>{req.is_active ? 'Active' : 'Inactive'}</span></p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'pending'  ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : req.status === 'pending' ? <Clock className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{req.requested_by}</span>
                      <span className="text-muted-foreground">{req.created_at.split(' ')[0]}</span>
                    </div>
                    {req.admin_note && <p className="text-xs text-muted-foreground italic border-t border-border pt-1">{req.admin_note}</p>}
                    {req.status === 'pending' && (
                      <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 w-full" onClick={() => openReviewDialog(req, 'policy')}>Review</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT: Limitation Requests */}
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Limitation Requests</CardTitle>
            </div>
            <div className="flex border-b border-border">
              {tabBtn(limReqTab === 'all', () => setLimReqTab('all'), 'All')}
              {tabBtn(limReqTab === 'pending', () => setLimReqTab('pending'), 'Pending', limitationRequests.filter(r => r.status === 'pending').length)}
              {tabBtn(limReqTab === 'approved', () => setLimReqTab('approved'), 'Approved')}
              {tabBtn(limReqTab === 'rejected', () => setLimReqTab('rejected'), 'Rejected')}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingLimReqs ? (
              <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
            ) : filteredLimReqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No limitation requests found.</div>
            ) : (
              <div className="space-y-2">
                {filteredLimReqs.map(req => (
                  <div key={req.id} className={`border rounded-xl p-4 space-y-2 ${ req.status === 'pending' ? 'border-blue-200 bg-blue-50/30' : 'border-border' }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{req.title ?? `Limitation #${req.limitation_id}`}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            req.action === 'create' ? 'bg-blue-100 text-blue-700' :
                            req.action === 'update' ? 'bg-purple-100 text-purple-700' :
                            'bg-red-100 text-red-700'
                          }`}>{req.action}</span>
                        </div>
                        {req.policy_name && <p className="text-xs text-muted-foreground">Policy: {req.policy_name}</p>}
                        {req.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{req.description}</p>}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'pending'  ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : req.status === 'pending' ? <Clock className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{req.requested_by}</span>
                      <span className="text-muted-foreground">{req.created_at?.split(' ')[0] ?? '—'}</span>
                    </div>
                    {req.admin_note && <p className="text-xs text-muted-foreground italic border-t border-border pt-1">{req.admin_note}</p>}
                    {req.status === 'pending' && (
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full" onClick={() => openReviewDialog(req, 'limitation')}>Review</Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Policy Reviews Table Section */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">Policy Reviews</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {policyReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No reviews found.</div>
          ) : (
            <div>
              <div className="grid grid-cols-[1fr_1fr_1fr_100px_100px] items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30 rounded-t-lg">
                <span>Policy</span>
                <span>Reviewed By</span>
                <span>Review</span>
                <span className="text-center">Doc View</span>
                <span className="text-center">Actions</span>
              </div>
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                {policyReviews.map(r => {
                  const policy = apiPolicies.find(p => p.id === r.policy_id);
                  return (
                    <div key={r.id} className="grid grid-cols-[1fr_1fr_1fr_100px_100px] items-center gap-2 px-3 py-3 hover:bg-muted/20 transition-colors">
                      <p className="text-sm font-medium truncate">{policy?.name ?? `Policy #${r.policy_id}`}</p>
                      <p className="text-sm truncate">{r.reviewed_by}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{r.review}</p>
                      <div className="flex justify-center">
                        {policy?.document_url ? (
                          <a href={policy.document_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs bg-primary/10 border border-primary/20 rounded px-2 py-0.5 text-primary hover:bg-primary/20 transition-colors">
                            <ExternalLink className="w-3 h-3" />View
                          </a>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                      <div className="flex justify-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{r.status === 'open' ? 'Open' : r.status}</span>
                        {r.status === 'open' && (
                          <Button size="sm" className="ml-1 h-6 text-xs bg-green-600 hover:bg-green-700 text-white px-2" onClick={() => handleResolveReview(r.id)}>
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Compliance Review Dialog - kept for policy row click */}
      <Dialog open={!!viewReviewItem} onOpenChange={open => { if (!open) setViewReviewItem(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />Compliance Reviews
            </DialogTitle>
          </DialogHeader>
          {viewReviewItem && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">{viewReviewItem.name}</p>
              {viewReviewItem.reviews.map(r => (
                <div key={r.id} className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700">{r.reviewed_by}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{r.status === 'open' ? 'Open' : r.status}</span>
                      {r.status === 'open' && (
                        <Button size="sm" className="h-6 text-xs bg-green-600 hover:bg-green-700 text-white px-2" onClick={() => handleResolveReview(r.id)}>
                          <CheckCircle className="w-3 h-3 mr-1" />Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{r.review}</p>
                  <p className="text-xs text-muted-foreground">{r.created_at.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReviewItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shared Review Dialog */}
      <Dialog open={!!reviewDialogItem} onOpenChange={open => { if (!open) closeReviewDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Request</DialogTitle>
          </DialogHeader>
          {reviewDialogItem && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                <p className="font-semibold text-sm">{reviewDialogItem.name ?? reviewDialogItem.title}</p>
                {reviewDialogItem.category && <p className="text-xs text-muted-foreground">{reviewDialogItem.category}</p>}
                <p className="text-xs text-muted-foreground">{reviewDialogItem.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{reviewDialogItem.requested_by}</span>
                  <span className="text-xs text-muted-foreground">{reviewDialogItem.created_at?.split(' ')[0]}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Admin Note (optional)</Label>
                <Input
                  placeholder="Add a note..."
                  value={reviewDialogType === 'policy' ? adminNote : limAdminNote}
                  onChange={e => reviewDialogType === 'policy' ? setAdminNote(e.target.value) : setLimAdminNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeReviewDialog}>Cancel</Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              disabled={reviewLoading || limReviewLoading}
              onClick={() => {
                if (!reviewDialogItem) return;
                if (reviewDialogType === 'policy') { handleReviewRequest(reviewDialogItem.id, 'rejected'); closeReviewDialog(); }
                else { handleLimReviewRequest(reviewDialogItem.id, 'rejected'); closeReviewDialog(); }
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" />Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={reviewLoading || limReviewLoading}
              onClick={() => {
                if (!reviewDialogItem) return;
                if (reviewDialogType === 'policy') { handleReviewRequest(reviewDialogItem.id, 'approved'); closeReviewDialog(); }
                else { handleLimReviewRequest(reviewDialogItem.id, 'approved'); closeReviewDialog(); }
              }}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" />Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminProcessPoliciesPage;
