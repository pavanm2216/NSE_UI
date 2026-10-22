import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Clock, Plus, Save, X, Edit, Trash2, Shield, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const TOKEN_KEY = 'lendrix_access_token';
const BASE = 'https://api.lendrixventech.com/compliance-team/policy-requests';
const REVIEW_BASE = 'https://api.lendrixventech.com/compliance-team/policy-reviews';
const POLICY_BASE = 'https://api.lendrixventech.com/compliance-team/policies';

type MyRequest = {
  id: number; action: string; policy_id: number | null; name: string; category: string;
  description: string; is_active: boolean | null; requested_by: string; status: string;
  admin_note: string | null; created_at: string; reviewed_at: string | null;
};

type MyPolicy = {
  request_id: number; name: string; category: string; description: string;
  request_status: string; admin_note: string; policy_id: number | null;
  is_active: boolean | null; is_accepted: boolean | null;
  submitted_at: string; reviewed_at: string | null;
};

type LimRequest = {
  id: number; action: string; policy_id: number | null; limitation_id: number | null;
  title: string; description: string; is_enabled: boolean | null;
  requested_by: string; status: string;
  admin_note: string | null; created_at: string; reviewed_at: string | null;
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending:  'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const Icon = status === 'approved' ? CheckCircle : status === 'pending' ? Clock : X;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-muted text-muted-foreground'}`}>
      <Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return { 'accept': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
};

const RiskCompliancePage: React.FC = () => {
  // My policy requests
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(true);

  // My limitation requests
  const [myLimRequests, setMyLimRequests] = useState<LimRequest[]>([]);
  const [loadingLimReqs, setLoadingLimReqs] = useState(true);

  // Add policy
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState({ name: '', category: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit policy (submit-update) — API only accepts policy_id + description
  const [editReq, setEditReq] = useState<{ policy_id: number; name: string } | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Status change (submit-status)
  const [statusSubmitting, setStatusSubmitting] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ reqId: number; type: 'success' | 'error'; text: string } | null>(null);

  // Add limitation
  const [showAddLim, setShowAddLim] = useState(false);
  const [newLim, setNewLim] = useState({ policy_id: 0, title: '', description: '' });
  const [limSubmitting, setLimSubmitting] = useState(false);
  const [limMsg, setLimMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit limitation (submit-update) — API only accepts limitation_id + description
  const [editLim, setEditLim] = useState<LimRequest | null>(null);
  const [editLimDescription, setEditLimDescription] = useState('');
  const [editLimSubmitting, setEditLimSubmitting] = useState(false);
  const [editLimMsg, setEditLimMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Policy reviews
  type AdminPolicy = { id: number; name: string; category: string; description: string; is_active: boolean; document_url: string | null };
  type MyReview = { id: number; policy_id: number; policy_name: string | null; review: string; status: string; created_at: string };
  type PolicyLimitation = { id: number; policy_id: number; title: string; description: string; is_enabled: boolean };

  const [adminPolicies, setAdminPolicies] = useState<AdminPolicy[]>([]);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [selectedReviewPolicy, setSelectedReviewPolicy] = useState<AdminPolicy | null>(null);
  const [policyLimitations, setPolicyLimitations] = useState<PolicyLimitation[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editReview, setEditReview] = useState<MyReview | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editReviewSubmitting, setEditReviewSubmitting] = useState(false);

  const fetchAdminPolicies = async () => {
    try {
      const res = await fetch(`${POLICY_BASE}/`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setAdminPolicies(d); }
    } catch {}
  };

  const fetchMyReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${REVIEW_BASE}/my-reviews`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setMyReviews(d); }
    } catch {} finally { setLoadingReviews(false); }
  };

  const fetchPolicyLimitations = async (policyId: number) => {
    try {
      const res = await fetch(`${POLICY_BASE}/limitations/${policyId}`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setPolicyLimitations(d); }
    } catch {}
  };

  const handleSubmitReview = async () => {
    if (!selectedReviewPolicy || !reviewText.trim()) return;
    setReviewSubmitting(true); setReviewMsg(null);
    try {
      const res = await fetch(`${REVIEW_BASE}/submit`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ policy_id: selectedReviewPolicy.id, review: reviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit review.');
      setReviewMsg({ type: 'success', text: data.message || 'Review submitted.' });
      setReviewText('');
      fetchMyReviews();
    } catch (err: any) {
      setReviewMsg({ type: 'error', text: err.message });
    } finally { setReviewSubmitting(false); }
  };

  const handleUpdateReview = async () => {
    if (!editReview || !editReviewText.trim()) return;
    setEditReviewSubmitting(true);
    try {
      const res = await fetch(`${REVIEW_BASE}/update`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ review_id: editReview.id, review: editReviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update.');
      setEditReview(null);
      fetchMyReviews();
    } catch (err: any) {
      alert(err.message);
    } finally { setEditReviewSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const res = await fetch(`${REVIEW_BASE}/delete/${reviewId}`, {
        method: 'DELETE', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete.');
      fetchMyReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // My policies
  const [myPolicies, setMyPolicies] = useState<MyPolicy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  const fetchMyPolicies = async () => {
    setLoadingPolicies(true);
    try {
      const res = await fetch(`${BASE}/my-policies`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setMyPolicies(d); }
    } catch {} finally { setLoadingPolicies(false); }
  };

  // Active tab
  const [tab, setTab] = useState<'my-policies' | 'all-policies' | 'policies' | 'limitations' | 'reviews'>('my-policies');
  const [reqTab, setReqTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [limReqTab, setLimReqTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [docLoading, setDocLoading] = useState<number | null>(null);
  const [expandedPolicyId, setExpandedPolicyId] = useState<number | null>(null);
  const [expandedLimitations, setExpandedLimitations] = useState<Record<number, PolicyLimitation[]>>({});
  const [loadingLimId, setLoadingLimId] = useState<number | null>(null);

  const handleToggleLimitations = async (policyId: number) => {
    if (expandedPolicyId === policyId) { setExpandedPolicyId(null); return; }
    setExpandedPolicyId(policyId);
    if (expandedLimitations[policyId]) return;
    setLoadingLimId(policyId);
    try {
      const res = await fetch(`${POLICY_BASE}/limitations/${policyId}`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setExpandedLimitations(prev => ({ ...prev, [policyId]: d })); }
    } catch {} finally { setLoadingLimId(null); }
  };

  const fetchMyRequests = async () => {
    setLoadingReqs(true);
    try {
      const res = await fetch(`${BASE}/my-requests`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setMyRequests(d); }
    } catch {} finally { setLoadingReqs(false); }
  };

  const handleViewDoc = (policyId: number, documentUrl: string | null) => {
    if (documentUrl) window.open(documentUrl, '_blank', 'noopener,noreferrer');
  };

  const fetchMyLimRequests = async () => {
    setLoadingLimReqs(true);
    try {
      const res = await fetch(`${BASE}/limitations/my-requests`, { headers: authHeaders() });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setMyLimRequests(d); }
    } catch {} finally { setLoadingLimReqs(false); }
  };

  useEffect(() => { fetchMyRequests(); fetchMyLimRequests(); fetchAdminPolicies(); fetchMyReviews(); fetchMyPolicies(); }, []);

  // POST /submit
  const handleAddPolicy = async () => {
    if (!newPolicy.name.trim() || !newPolicy.description.trim()) return;
    setSubmitting(true); setSubmitMsg(null);
    try {
      const res = await fetch(`${BASE}/submit`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ name: newPolicy.name, category: newPolicy.category, description: newPolicy.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit.');
      setSubmitMsg({ type: 'success', text: `${data.message || 'Policy submitted for admin approval.'}${data.request_id ? ` (Request #${data.request_id})` : ''}` });
      setNewPolicy({ name: '', category: '', description: '' });
      setShowAddPolicy(false);
      fetchMyRequests();
    } catch (err: any) {
      setSubmitMsg({ type: 'error', text: err.message });
    } finally { setSubmitting(false); }
  };

  // POST /submit-update — only sends policy_id + description
  const handleEditPolicy = async () => {
    if (!editReq || !editDescription.trim()) return;
    setEditSubmitting(true); setEditMsg(null);
    try {
      const res = await fetch(`${BASE}/submit-update`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ policy_id: editReq.policy_id, description: editDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit update.');
      setEditMsg({ type: 'success', text: `${data.message || 'Update request submitted.'}${data.request_id ? ` (Request #${data.request_id})` : ''}` });
      setEditReq(null);
      fetchMyRequests();
    } catch (err: any) {
      setEditMsg({ type: 'error', text: err.message });
    } finally { setEditSubmitting(false); }
  };

  // POST /submit-status
  const handleStatusChange = async (req: MyRequest, is_active: boolean) => {
    if (!req.policy_id) return;
    setStatusSubmitting(req.id);
    setStatusMsg(null);
    try {
      const res = await fetch(`${BASE}/submit-status`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ policy_id: req.policy_id, is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit status change.');
      setStatusMsg({
        reqId: req.id,
        type: 'success',
        text: `${data.message || 'Status change submitted.'}${data.request_id ? ` (Request #${data.request_id})` : ''}`,
      });
      fetchMyRequests();
    } catch (err: any) {
      setStatusMsg({ reqId: req.id, type: 'error', text: err.message });
    } finally { setStatusSubmitting(null); }
  };

  // POST /limitations/submit-create — API only accepts policy_id, title, description
  const handleAddLim = async () => {
    if (!newLim.title.trim() || !newLim.policy_id) return;
    setLimSubmitting(true); setLimMsg(null);
    try {
      const res = await fetch(`${BASE}/limitations/submit-create`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ policy_id: newLim.policy_id, title: newLim.title, description: newLim.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit.');
      setLimMsg({ type: 'success', text: `${data.message || 'Limitation request submitted.'}${data.request_id ? ` (Request #${data.request_id})` : ''}` });
      setNewLim({ policy_id: 0, title: '', description: '' });
      setShowAddLim(false);
      fetchMyLimRequests();
    } catch (err: any) {
      setLimMsg({ type: 'error', text: err.message });
    } finally { setLimSubmitting(false); }
  };

  // POST /limitations/submit-update — only sends limitation_id + description
  const handleEditLim = async () => {
    if (!editLim || !editLimDescription.trim()) return;
    setEditLimSubmitting(true); setEditLimMsg(null);
    try {
      const res = await fetch(`${BASE}/limitations/submit-update`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ limitation_id: editLim.limitation_id, description: editLimDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit update.');
      setEditLimMsg({ type: 'success', text: `${data.message || 'Limitation update submitted.'}${data.request_id ? ` (Request #${data.request_id})` : ''}` });
      setEditLim(null);
      fetchMyLimRequests();
    } catch (err: any) {
      setEditLimMsg({ type: 'error', text: err.message });
    } finally { setEditLimSubmitting(false); }
  };

  // POST /limitations/submit-delete
  const [deletingLimId, setDeletingLimId] = useState<number | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<{ reqId: number; type: 'success' | 'error'; text: string } | null>(null);

  const handleDeleteLim = async (req: LimRequest) => {
    if (!req.limitation_id) return;
    setDeletingLimId(req.id);
    setDeleteMsg(null);
    try {
      const res = await fetch(`${BASE}/limitations/submit-delete`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ limitation_id: req.limitation_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to submit delete request.');
      setDeleteMsg({
        reqId: req.id,
        type: 'success',
        text: `${data.message || 'Delete request submitted.'}${data.request_id ? ` (Request #${data.request_id})` : ''}`,
      });
      fetchMyLimRequests();
    } catch (err: any) {
      setDeleteMsg({ reqId: req.id, type: 'error', text: err.message });
    } finally { setDeletingLimId(null); }
  };

  const filteredReqs = myRequests.filter(r => reqTab === 'all' || r.status === reqTab);
  const filteredLimReqs = myLimRequests.filter(r => limReqTab === 'all' || r.status === limReqTab);

  const summaryCards = [
    { label: 'My Policies',     value: myPolicies.length,                                     color: 'text-primary',    bg: 'bg-primary',    icon: FileText },
    { label: 'Approved',        value: myRequests.filter(r => r.status === 'approved').length,  color: 'text-green-600',  bg: 'bg-green-500',  icon: CheckCircle },
    { label: 'Pending',         value: myRequests.filter(r => r.status === 'pending').length,   color: 'text-yellow-600', bg: 'bg-yellow-500', icon: Clock },
    { label: 'Lim. Requests',   value: myLimRequests.length,                                  color: 'text-blue-600',   bg: 'bg-blue-500',   icon: Shield },
  ];

  const tabBtn = (active: boolean, onClick: () => void, label: string, count?: number) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
      {label}{count !== undefined && count > 0 && <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{count}</span>}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Risk & Compliance</h1>
          <p className="text-muted-foreground">Add policies for admin approval or review Angel & VC's submissions</p>
        </div>
        <div className="flex gap-2">
          <Button className="gradient-primary text-primary-foreground" onClick={() => { setShowAddPolicy(!showAddPolicy); setShowAddLim(false); }}>
            <Plus className="mr-2 w-4 h-4" />Add Policy
          </Button>
          <Button variant="outline" onClick={() => { setShowAddLim(!showAddLim); setShowAddPolicy(false); }}>
            <Plus className="mr-2 w-4 h-4" />Add Limitation
          </Button>
        </div>
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
          <CardHeader><CardTitle>Submit New Policy Request</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Policy Name</Label><Input value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} placeholder="Enter policy name" /></div>
              <div><Label>Category</Label><Input value={newPolicy.category} onChange={e => setNewPolicy({ ...newPolicy, category: e.target.value })} placeholder="Enter category" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={newPolicy.description} onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })} placeholder="Enter policy description" rows={3} /></div>
            <div className="flex gap-2">
              <Button onClick={handleAddPolicy} disabled={submitting}><Save className="mr-2 w-4 h-4" />{submitting ? 'Submitting...' : 'Submit to Admin'}</Button>
              <Button variant="outline" onClick={() => { setShowAddPolicy(false); setSubmitMsg(null); }}>Cancel</Button>
            </div>
            {submitMsg && <p className={`text-xs ${submitMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{submitMsg.text}</p>}
          </CardContent>
        </Card>
      )}

      {/* Add Limitation Form */}
      {showAddLim && (
        <Card>
          <CardHeader><CardTitle>Submit New Limitation Request</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Policy</Label>
              <select
                className="w-full mt-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                value={newLim.policy_id || ''}
                onChange={e => setNewLim({ ...newLim, policy_id: Number(e.target.value) })}
              >
                <option value="">Select a policy</option>
                {adminPolicies.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                ))}
              </select>
            </div>
            <div><Label>Title</Label><Input value={newLim.title} onChange={e => setNewLim({ ...newLim, title: e.target.value })} placeholder="Limitation title" /></div>
            <div><Label>Description</Label><Textarea value={newLim.description} onChange={e => setNewLim({ ...newLim, description: e.target.value })} placeholder="Description" rows={2} /></div>
            <div className="flex gap-2">
              <Button onClick={handleAddLim} disabled={limSubmitting || !newLim.policy_id || !newLim.title.trim()}>
                <Save className="mr-2 w-4 h-4" />{limSubmitting ? 'Submitting...' : 'Submit to Admin'}
              </Button>
              <Button variant="outline" onClick={() => { setShowAddLim(false); setLimMsg(null); }}>Cancel</Button>
            </div>
            {limMsg && <p className={`text-xs ${limMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{limMsg.text}</p>}
          </CardContent>
        </Card>
      )}

      {/* Edit Policy Dialog */}
      {editReq && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Update Policy — {editReq.name}</CardTitle>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditReq(null); setEditMsg(null); }}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Policy ID: <span className="font-medium text-foreground">{editReq.policy_id}</span> — only description can be updated via this request.</p>
            <div><Label>New Description</Label><Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} placeholder="Enter updated description..." /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditPolicy} disabled={editSubmitting || !editDescription.trim()}><Save className="w-3 h-3 mr-1" />{editSubmitting ? 'Submitting...' : 'Submit Update'}</Button>
              <Button size="sm" variant="outline" onClick={() => { setEditReq(null); setEditMsg(null); }}>Cancel</Button>
            </div>
            {editMsg && <p className={`text-xs ${editMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{editMsg.text}</p>}
          </CardContent>
        </Card>
      )}

      {/* Edit Limitation Dialog */}
      {editLim && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Update Limitation — {editLim.title}</CardTitle>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditLim(null); setEditLimMsg(null); }}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Limitation ID: <span className="font-medium text-foreground">{editLim.limitation_id}</span> — only description can be updated via this request.</p>
            <div><Label>New Description</Label><Textarea value={editLimDescription} onChange={e => setEditLimDescription(e.target.value)} rows={3} placeholder="Enter updated description..." /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditLim} disabled={editLimSubmitting || !editLimDescription.trim()}><Save className="w-3 h-3 mr-1" />{editLimSubmitting ? 'Submitting...' : 'Submit Update'}</Button>
              <Button size="sm" variant="outline" onClick={() => { setEditLim(null); setEditLimMsg(null); }}>Cancel</Button>
            </div>
            {editLimMsg && <p className={`text-xs ${editLimMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{editLimMsg.text}</p>}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        {tabBtn(tab === 'my-policies', () => setTab('my-policies'), 'My Policies', myPolicies.length)}
        {tabBtn(tab === 'all-policies', () => setTab('all-policies'), 'All Policies', adminPolicies.length)}
        {tabBtn(tab === 'policies', () => setTab('policies'), 'Policy Requests', myRequests.length)}
        {tabBtn(tab === 'limitations', () => setTab('limitations'), 'Limitation Requests', myLimRequests.length)}
        {tabBtn(tab === 'reviews', () => setTab('reviews'), 'Policy Reviews', myReviews.length)}
      </div>

      {/* All Policies Tab */}
      {tab === 'all-policies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">All Company Policies</h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{adminPolicies.length} policies</span>
          </div>
          {adminPolicies.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">No policies found.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adminPolicies.map(p => (
                <div key={p.id} className="border border-border rounded-xl p-4 bg-card space-y-3">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm leading-tight">{p.name}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">{p.category}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">ID: {p.id}</span>
                  </div>
                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => handleToggleLimitations(p.id)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {loadingLimId === p.id ? 'Loading...' : expandedPolicyId === p.id ? 'Hide Limitations' : 'View Limitations'}
                    </Button>
                    {p.document_url && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleViewDoc(p.id, p.document_url)}>
                        <FileText className="w-3 h-3 mr-1" />View Doc
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs ml-auto" onClick={() => { setEditReq({ policy_id: p.id, name: p.name }); setEditDescription(p.description); setEditMsg(null); }}>
                      <Edit className="w-3 h-3 mr-1" />Update
                    </Button>
                  </div>
                  {/* Limitations */}
                  {expandedPolicyId === p.id && (
                    <div className="pt-2 border-t border-border space-y-1.5">
                      {loadingLimId === p.id ? (
                        <p className="text-xs text-muted-foreground">Loading limitations...</p>
                      ) : (expandedLimitations[p.id] ?? []).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No limitations found.</p>
                      ) : (
                        (expandedLimitations[p.id] ?? []).map(l => (
                          <div key={l.id} className="flex items-start gap-2 p-2 rounded-lg bg-red-50/40 border border-red-100">
                            <Shield className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium">{l.title}</p>
                              <p className="text-xs text-muted-foreground">{l.description}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Policies Tab */}
      {tab === 'my-policies' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />My Approved Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPolicies ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : myPolicies.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No policies found.</div>
            ) : (
              <div className="space-y-3">
                {myPolicies.map(p => (
                  <div key={p.request_id} className="border border-border rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{p.name}</p>
                          {p.is_active !== null && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                          )}
                          {p.is_accepted !== null && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                              p.is_accepted ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'
                            }`}>{p.is_accepted ? 'Accepted' : 'Not Accepted'}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                        {p.policy_id && <p className="text-xs text-muted-foreground">Policy ID: {p.policy_id}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {statusBadge(p.request_status)}
                        <span className="text-xs text-muted-foreground">Req #{p.request_id}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Submitted: {p.submitted_at.split(' ')[0]}</span>
                      <span>{p.reviewed_at ? `Reviewed: ${p.reviewed_at.split(' ')[0]}` : 'Awaiting review'}</span>
                    </div>
                    {p.admin_note && (
                      <p className="text-xs italic text-muted-foreground border-t border-border pt-1">Admin note: {p.admin_note}</p>
                    )}
                    {p.policy_id && (
                      <div className="flex gap-2 pt-1 border-t border-border">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditReq({ policy_id: p.policy_id!, name: p.name }); setEditDescription(p.description); setEditMsg(null); }}>
                          <Edit className="w-3 h-3 mr-1" />Update Description
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          className="h-7 text-xs text-destructive hover:bg-red-50"
                          onClick={() => {
                            const fakeReq = { id: p.request_id, policy_id: p.policy_id, is_active: p.is_active } as MyRequest;
                            handleStatusChange(fakeReq, false);
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />Request Deactivate
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Policy Requests Tab */}
      {tab === 'policies' && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex border-b border-border">
              {tabBtn(reqTab === 'all', () => setReqTab('all'), 'All')}
              {tabBtn(reqTab === 'pending', () => setReqTab('pending'), 'Pending', myRequests.filter(r => r.status === 'pending').length)}
              {tabBtn(reqTab === 'approved', () => setReqTab('approved'), 'Approved')}
              {tabBtn(reqTab === 'rejected', () => setReqTab('rejected'), 'Rejected')}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingReqs ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : filteredReqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No requests found.</div>
            ) : (
              <div className="space-y-3">
                {filteredReqs.map(req => (
                  <div key={req.id} className={`border rounded-xl p-4 space-y-2 ${
                    req.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
                    req.status === 'rejected' ? 'border-red-200 bg-red-50/20' : 'border-border'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
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
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Requested status: <span className={`font-medium ${req.is_active ? 'text-green-600' : 'text-red-600'}`}>{req.is_active ? 'Active' : 'Inactive'}</span>
                          </p>
                        )}
                        {req.policy_id && <p className="text-xs text-muted-foreground">Policy ID: {req.policy_id}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {statusBadge(req.status)}
                        <span className="text-xs text-muted-foreground">#{req.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{req.created_at.split(' ')[0]}</span>
                      <span className="text-muted-foreground">
                        {req.reviewed_at ? `Reviewed: ${req.reviewed_at.split(' ')[0]}` : 'Awaiting review'}
                      </span>
                    </div>
                    {req.admin_note && (
                      <p className="text-xs italic text-muted-foreground border-t border-border pt-1">Admin note: {req.admin_note}</p>
                    )}
                    {req.status === 'approved' && req.policy_id && (
                      <div className="space-y-1.5 pt-1 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Request status change:</span>
                          <div className="flex items-center gap-1.5 ml-auto">
                            <span className="text-xs text-muted-foreground">{req.is_active ? 'Active' : 'Inactive'}</span>
                            <Switch
                              checked={req.is_active ?? true}
                              disabled={statusSubmitting === req.id}
                              onCheckedChange={c => handleStatusChange(req, c)}
                            />
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditReq({ policy_id: req.policy_id!, name: req.policy_name ?? req.name ?? '' }); setEditDescription(req.description ?? ''); setEditMsg(null); }}>
                            <Edit className="w-3 h-3 mr-1" />Update
                          </Button>
                        </div>
                        {statusMsg?.reqId === req.id && (
                          <p className={`text-xs ${statusMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{statusMsg.text}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Limitation Requests Tab */}
      {tab === 'limitations' && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex border-b border-border">
              {tabBtn(limReqTab === 'all', () => setLimReqTab('all'), 'All')}
              {tabBtn(limReqTab === 'pending', () => setLimReqTab('pending'), 'Pending', myLimRequests.filter(r => r.status === 'pending').length)}
              {tabBtn(limReqTab === 'approved', () => setLimReqTab('approved'), 'Approved')}
              {tabBtn(limReqTab === 'rejected', () => setLimReqTab('rejected'), 'Rejected')}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingLimReqs ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
            ) : filteredLimReqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No limitation requests found.</div>
            ) : (
              <div className="space-y-3">
                {filteredLimReqs.map(req => (
                  <div key={req.id} className={`border rounded-xl p-4 space-y-2 ${
                    req.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
                    req.status === 'rejected' ? 'border-red-200 bg-red-50/20' : 'border-border'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{req.title ?? req.policy_name ?? '—'}</p>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            req.action === 'create' ? 'bg-blue-100 text-blue-700' :
                            req.action === 'update' ? 'bg-purple-100 text-purple-700' :
                            'bg-red-100 text-red-700'
                          }`}>{req.action}</span>
                        </div>
                        {req.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{req.description}</p>}
                        {req.policy_name && <p className="text-xs text-muted-foreground">Policy: {req.policy_name}</p>}
                        {req.limitation_id && <p className="text-xs text-muted-foreground">Limitation ID: {req.limitation_id}</p>}
                        {req.policy_id && <p className="text-xs text-muted-foreground">Policy ID: {req.policy_id}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {statusBadge(req.status)}
                        <span className="text-xs text-muted-foreground">#{req.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{req.created_at?.split(' ')[0] ?? '—'}</span>
                      <span>{req.reviewed_at ? `Reviewed: ${req.reviewed_at.split(' ')[0]}` : 'Awaiting review'}</span>
                    </div>
                    {req.admin_note && (
                      <p className="text-xs italic text-muted-foreground border-t border-border pt-1">Admin note: {req.admin_note}</p>
                    )}
                    {req.limitation_id && req.action !== 'delete' && (
                      <div className="space-y-1.5 pt-1 border-t border-border">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditLim(req); setEditLimDescription(req.description ?? ''); setEditLimMsg(null); }}>
                            <Edit className="w-3 h-3 mr-1" />Update Description
                          </Button>
                          <Button
                            size="sm" variant="outline"
                            className="h-7 text-xs text-destructive hover:bg-red-50"
                            disabled={deletingLimId === req.id}
                            onClick={() => handleDeleteLim(req)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />{deletingLimId === req.id ? 'Submitting...' : 'Request Delete'}
                          </Button>
                        </div>
                        {deleteMsg?.reqId === req.id && (
                          <p className={`text-xs ${deleteMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{deleteMsg.text}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Policy Reviews Tab */}
      {tab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Admin Policies to Review */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />Admin Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adminPolicies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No policies available.</p>
              ) : adminPolicies.map(p => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    selectedReviewPolicy?.id === p.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
                      <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${
                        p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs shrink-0"
                      variant={selectedReviewPolicy?.id === p.id ? 'default' : 'outline'}
                      onClick={() => { setSelectedReviewPolicy(p); fetchPolicyLimitations(p.id); setReviewMsg(null); setReviewText(''); }}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {selectedReviewPolicy?.id === p.id ? 'Writing...' : 'Write Review'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* RIGHT: Review Panel */}
          <div className="space-y-4">
            {selectedReviewPolicy ? (
              <>
                {/* Policy Detail */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>{selectedReviewPolicy.name}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setSelectedReviewPolicy(null); setPolicyLimitations([]); }}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <p>{selectedReviewPolicy.description}</p>
                    {policyLimitations.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold text-foreground mb-1">Limitations:</p>
                        {policyLimitations.map(l => (
                          <div key={l.id} className="flex items-center gap-2 py-0.5">
                            <Shield className="w-3 h-3 text-red-400" />
                            <span>{l.title} — {l.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Review */}
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4" />Write Review</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder={`Write your review for "${selectedReviewPolicy.name}"...`}
                      rows={3}
                    />
                    <Button size="sm" onClick={handleSubmitReview} disabled={reviewSubmitting || !reviewText.trim()}>
                      <Save className="w-3 h-3 mr-1" />{reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    {reviewMsg && <p className={`text-xs ${reviewMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{reviewMsg.text}</p>}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Select a policy to write a review</p>
                </CardContent>
              </Card>
            )}

            {/* My Reviews */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">My Reviews</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {loadingReviews ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
                ) : myReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No reviews yet.</p>
                ) : myReviews.map(r => (
                  <div key={r.id} className="border border-border rounded-xl p-3 space-y-2">
                    {editReview?.id === r.id ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">{r.policy_name ?? `Policy #${r.policy_id}`}</p>
                        <Textarea value={editReviewText} onChange={e => setEditReviewText(e.target.value)} rows={2} className="text-sm" placeholder="Update your review..." />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleUpdateReview} disabled={editReviewSubmitting || !editReviewText.trim()}>
                            <Save className="w-3 h-3 mr-1" />{editReviewSubmitting ? 'Saving...' : 'Save'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditReview(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground">{r.policy_name ?? `Policy #${r.policy_id}`}</p>
                            <p className="text-sm mt-0.5 text-muted-foreground">{r.review}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
                            r.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{r.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{r.created_at.split(' ')[0]}</span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditReview(r); setEditReviewText(r.review); }}>
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-red-50" onClick={() => handleDeleteReview(r.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCompliancePage;
