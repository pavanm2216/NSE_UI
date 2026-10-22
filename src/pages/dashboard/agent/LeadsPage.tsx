import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, Eye, Plus, Search, UserPlus, UserCheck, Building2, UserCircle2, Loader2, ArrowLeft, FileText, ExternalLink, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetchRkycDetails, RkycDetails } from '@/services/kycService';

const statusCards = [
  { label: 'New Leads', count: 45, color: 'bg-info', textColor: 'text-info' },
  { label: 'Documents Pending', count: 32, color: 'bg-warning', textColor: 'text-warning' },
  { label: 'Under Review', count: 28, color: 'bg-primary', textColor: 'text-primary' },
  { label: 'Approved', count: 18, color: 'bg-success', textColor: 'text-success' },
  { label: 'Rejected', count: 8, color: 'bg-destructive', textColor: 'text-destructive' },
];

const leadsData = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', loanType: 'Home Loan', amount: '₹45,00,000', status: 'new', date: '2024-01-20' },
  { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@email.com', loanType: 'Personal Loan', amount: '₹5,00,000', status: 'documents', date: '2024-01-19' },
  { id: 3, name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit@email.com', loanType: 'Business Loan', amount: '₹25,00,000', status: 'review', date: '2024-01-18' },
  { id: 4, name: 'Sneha Gupta', phone: '+91 65432 10987', email: 'sneha@email.com', loanType: 'Car Loan', amount: '₹8,00,000', status: 'approved', date: '2024-01-17' },
  { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram@email.com', loanType: 'Home Loan', amount: '₹60,00,000', status: 'rejected', date: '2024-01-16' },
];

const statusColors: Record<string, string> = {
  new: 'bg-info/10 text-info',
  documents: 'bg-warning/10 text-warning',
  review: 'bg-primary/10 text-primary',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  new: 'New Lead',
  documents: 'Docs Pending',
  review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

const existingCustomers = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.k@email.com', location: 'Mumbai', tier: 'Privy Alpha League' },
  { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya.s@email.com', location: 'Delhi', tier: 'Private Wealth League' },
  { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit.p@email.com', location: 'Bangalore', tier: 'Privy Alpha League' },
  { id: 4, name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha.r@email.com', location: 'Hyderabad', tier: 'Angel Wealth League' },
  { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', email: 'vikram.s@email.com', location: 'Pune', tier: 'Private Wealth League' },
];

const emptyForm = { name: '', mobile: '', address: '', idNumber: '', notes: '' };
const emptyExistingForm = { loanType: '', amount: '', notes: '' };

interface RegisteredUser {
  uid: string;
  firstName: string;
  lastName: string;
  mobile: string;
  emailId: string;
  accountType: 'individual' | 'organization';
  transactionId: string;
  referenceId: string;
  registeredAt: string;
}

const LeadsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leads, setLeads] = useState(leadsData);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'new' | 'existing'>('select');
  const [form, setForm] = useState(emptyForm);
  const [existingForm, setExistingForm] = useState(emptyExistingForm);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof existingCustomers[0] | null>(null);

  // Registered Users state
  const [showRegUsers, setShowRegUsers] = useState(false);
  const [regUsers, setRegUsers] = useState<RegisteredUser[]>([]);
  const [kycDetails, setKycDetails] = useState<Record<string, { loading: boolean; data: RkycDetails | null }>>({});
  const [regSearch, setRegSearch] = useState('');
  const [detailUser, setDetailUser] = useState<{ user: RegisteredUser; kyc: RkycDetails } | null>(null);
  const [urlPopup, setUrlPopup] = useState<{ label: string; url: string } | null>(null);

  const openRegUsers = () => {
    const stored: RegisteredUser[] = JSON.parse(localStorage.getItem('lendrix_registered_users') || '[]');
    // Pick up any standalone transaction IDs stored under known keys
    const standaloneTxnKeys = ['lendrix_rkyc_txn', 'kyc_transaction_id'];
    standaloneTxnKeys.forEach(key => {
      const txn = localStorage.getItem(key);
      if (txn && !stored.find(u => u.transactionId === txn)) {
        stored.push({
          uid: 'standalone',
          firstName: 'Unknown',
          lastName: '',
          mobile: '—',
          emailId: '—',
          accountType: 'individual',
          transactionId: txn,
          referenceId: localStorage.getItem('lendrix_rkyc_ref') || '',
          registeredAt: new Date().toISOString(),
        });
      }
    });
    setRegUsers(stored);
    setShowRegUsers(true);
  };

  useEffect(() => {
    if (!showRegUsers || regUsers.length === 0) return;
    regUsers.forEach(user => {
      if (!user.transactionId || kycDetails[user.transactionId]) return;
      setKycDetails(prev => ({ ...prev, [user.transactionId]: { loading: true, data: null } }));
      fetchRkycDetails(user.transactionId).then(result => {
        setKycDetails(prev => ({ ...prev, [user.transactionId]: { loading: false, data: result } }));
      });
    });
  }, [showRegUsers, regUsers]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openModal = () => { setModalStep('select'); setShowModal(true); };
  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setExistingForm(emptyExistingForm);
    setCustomerSearch('');
    setSelectedCustomer(null);
    setModalStep('select');
  };

  const handleAddLead = () => {
    if (!form.name || !form.mobile) return;
    const newLead = {
      id: leads.length + 1,
      name: form.name,
      phone: form.mobile,
      email: '',
      loanType: 'N/A',
      amount: 'N/A',
      status: 'new',
      date: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    closeModal();
  };

  const handleAddExistingLead = () => {
    if (!selectedCustomer || !existingForm.loanType) return;
    const newLead = {
      id: leads.length + 1,
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      loanType: existingForm.loanType,
      amount: existingForm.amount || 'N/A',
      status: 'new',
      date: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    closeModal();
  };

  const filteredCustomers = existingCustomers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const updateLeadStatus = (id: number, newStatus: string) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <p className="text-muted-foreground">Track and manage all your leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openRegUsers}>
            <Users className="mr-2 w-4 h-4" /> Registered Users
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={openModal}>
            <Plus className="mr-2 w-4 h-4" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Leads view OR Registered Users table — mutually exclusive */}
      {!showRegUsers ? (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {statusCards.map((card, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{card.label}</p>
                        <p className={`text-2xl font-bold ${card.textColor}`}>{card.count}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${card.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters + Leads Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search leads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New Leads</SelectItem>
                    <SelectItem value="documents">Documents Pending</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{lead.phone}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.loanType}</TableCell>
                      <TableCell className="font-semibold">{lead.amount}</TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                          <SelectTrigger className="w-32">
                            <Badge className={statusColors[lead.status]}>{statusLabels[lead.status]}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New Lead</SelectItem>
                            <SelectItem value="documents">Docs Pending</SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{lead.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline"><Phone className="w-4 h-4" /></Button>
                          <Button size="icon" variant="outline"><Mail className="w-4 h-4" /></Button>
                          <Button size="icon" variant="outline"><Eye className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setShowRegUsers(false)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <CardTitle>Registered Users ({regUsers.length})</CardTitle>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search users..." value={regSearch} onChange={e => setRegSearch(e.target.value)} className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {regUsers.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">No registered users yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>KYC Name</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Aadhaar</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regUsers
                      .filter(u => `${u.firstName} ${u.lastName} ${u.mobile} ${u.emailId}`.toLowerCase().includes(regSearch.toLowerCase()))
                      .map((user, i) => {
                        const kyc = kycDetails[user.transactionId];
                        const kycData = kyc?.data;
                        return (
                          <TableRow key={i}>
                            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {user.accountType === 'organization' ? <Building2 className="w-4 h-4 text-purple-500" /> : <UserCircle2 className="w-4 h-4 text-cyan-500" />}
                                <Badge className={user.accountType === 'organization' ? 'bg-purple-100 text-purple-700 text-xs' : 'bg-cyan-100 text-cyan-700 text-xs'}>
                                  {user.accountType === 'organization' ? 'Org' : 'Individual'}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium whitespace-nowrap">{user.firstName} {user.lastName}</TableCell>
                            <TableCell>{user.mobile}</TableCell>
                            <TableCell className="text-sm">{user.emailId}</TableCell>
                            <TableCell>{kyc?.loading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : kycData?.name || '—'}</TableCell>
                            <TableCell>{kyc?.loading ? '...' : kycData?.dob || '—'}</TableCell>
                            <TableCell>{kyc?.loading ? '...' : kycData?.gender || '—'}</TableCell>
                            <TableCell className="font-mono text-xs">{kyc?.loading ? '...' : kycData?.maskedAdharNumber || '—'}</TableCell>
                            <TableCell>
                              {kyc?.loading ? (
                                <Badge className="bg-gray-100 text-gray-500">Loading...</Badge>
                              ) : kycData?.status ? (
                                <Badge className={kycData.status === 's' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                  {kycData.status === 's' ? 'Completed' : kycData.status}
                                </Badge>
                              ) : '—'}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {kycData ? (
                                <Button size="sm" variant="outline" onClick={() => setDetailUser({ user, kyc: kycData })}>
                                  <Eye className="w-3 h-3 mr-1" /> View
                                </Button>
                              ) : kyc?.loading ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              ) : '—'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add New Lead Modal */}
      <Dialog open={showModal} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>

          {/* Step 1: Select customer type */}
          {modalStep === 'select' && (
            <div className="py-4 space-y-3">
              <p className="text-sm text-muted-foreground text-center">Choose how you want to add this lead</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setModalStep('new')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                    <UserPlus className="w-6 h-6 text-cyan-700" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-800">New Customer</p>
                    <p className="text-xs text-muted-foreground mt-1">Add a brand new customer</p>
                  </div>
                </button>
                <button
                  onClick={() => setModalStep('existing')}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl hover:border-cyan-600 hover:bg-cyan-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                    <UserCheck className="w-6 h-6 text-cyan-700" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-800">Existing Customer</p>
                    <p className="text-xs text-muted-foreground mt-1">Select from your customers</p>
                  </div>
                </button>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 2a: New Customer Form */}
          {modalStep === 'new' && (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" placeholder="Full name" value={form.name} onChange={handleFormChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mobile">Mobile No *</Label>
                  <Input id="mobile" name="mobile" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={handleFormChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" placeholder="Full address" value={form.address} onChange={handleFormChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="idNumber">Aadhaar / PAN</Label>
                  <Input id="idNumber" name="idNumber" placeholder="Aadhaar or PAN number" value={form.idNumber} onChange={handleFormChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes">About Customer</Label>
                  <Textarea id="notes" name="notes" placeholder="Write about the customer..." rows={3} value={form.notes} onChange={handleFormChange} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalStep('select')}>Back</Button>
                <Button className="gradient-primary text-primary-foreground" onClick={handleAddLead}>Add Lead</Button>
              </DialogFooter>
            </>
          )}

          {/* Step 2b: Existing Customer */}
          {modalStep === 'existing' && (
            <>
              <div className="space-y-4 py-2">
                {!selectedCustomer ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone or email..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {filteredCustomers.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCustomer(c)}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-cyan-50 hover:border-cyan-400 transition-all"
                        >
                          <div>
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.phone} · {c.email}</p>
                          </div>
                          <Badge className="bg-cyan-100 text-cyan-700 text-xs">{c.tier}</Badge>
                        </div>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">No customers found</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{selectedCustomer.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedCustomer.phone} · {selectedCustomer.location}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedCustomer(null)} className="text-xs text-muted-foreground">Change</Button>
                    </div>
                    <div className="space-y-1">
                      <Label>Loan Type *</Label>
                      <Select value={existingForm.loanType} onValueChange={(v) => setExistingForm(p => ({ ...p, loanType: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select loan type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home Loan">Home Loan</SelectItem>
                          <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                          <SelectItem value="Business Loan">Business Loan</SelectItem>
                          <SelectItem value="Car Loan">Car Loan</SelectItem>
                          <SelectItem value="Education Loan">Education Loan</SelectItem>
                          <SelectItem value="Loan Against Property">Loan Against Property</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Loan Amount</Label>
                      <Input
                        placeholder="e.g. ₹10,00,000"
                        value={existingForm.amount}
                        onChange={(e) => setExistingForm(p => ({ ...p, amount: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Additional notes..."
                        rows={3}
                        value={existingForm.notes}
                        onChange={(e) => setExistingForm(p => ({ ...p, notes: e.target.value }))}
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setSelectedCustomer(null); setModalStep('select'); }}>Back</Button>
                {selectedCustomer && (
                  <Button className="gradient-primary text-primary-foreground" onClick={handleAddExistingLead}>Add Lead</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* KYC Detail Dialog */}
      <Dialog open={!!detailUser} onOpenChange={() => setDetailUser(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KYC Details — {detailUser?.user.firstName} {detailUser?.user.lastName}</DialogTitle>
          </DialogHeader>
          {detailUser && (() => {
            const k = detailUser.kyc;
            const a = k.address || {};
            return (
              <div className="space-y-5 py-2">
                {/* Photo + basic info */}
                <div className="flex gap-4 items-start">
                  {k.image ? (
                    <img
                      src={`data:image/jpeg;base64,${k.image}`}
                      alt="KYC Photo"
                      className="w-24 h-24 rounded-xl object-cover border shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <UserCircle2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm flex-1">
                    {[['Name', k.name], ['Gender', k.gender], ['DOB', k.dob], ['Aadhaar', k.maskedAdharNumber], ['Care Of', (k as any).careOf], ['Unique ID', (k as any).uniqueId]]
                      .filter(([, v]) => v)
                      .map(([label, val]) => (
                        <div key={label as string}>
                          <span className="text-muted-foreground text-xs">{label}</span>
                          <p className="font-medium">{val as string}</p>
                        </div>
                      ))}
                    <div>
                      <span className="text-muted-foreground text-xs">KYC Status</span>
                      <div className="mt-0.5">
                        <Badge className={k.status === 's' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {k.status === 's' ? 'Completed' : k.status || '—'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                {Object.keys(a).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Address</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm bg-muted/30 rounded-xl p-4">
                      {[['House', a.house], ['Street', a.street], ['Landmark', a.landmark], ['Locality', a.loc], ['Post Office', a.po], ['District', a.dist], ['Sub-District', a.subdist], ['VTC', a.vtc], ['Pincode', a.pc], ['State', a.state], ['Country', a.country]]
                        .filter(([, v]) => v)
                        .map(([label, val]) => (
                          <div key={label as string}>
                            <span className="text-muted-foreground text-xs">{label}</span>
                            <p className="font-medium">{val as string}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* DigiLocker Files */}
                {k.digilockerFiles && k.digilockerFiles.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">DigiLocker Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {k.digilockerFiles.map((f, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => setUrlPopup({ label: `${f.docType} (.${f.docExtension})`, url: f.docLink })}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {f.docType} <span className="ml-1 text-muted-foreground text-xs">.{f.docExtension}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* XML Response button */}
                {(k as any).xmlResponse && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">XML Response</p>
                    <Button variant="outline" size="sm" onClick={() => setUrlPopup({ label: 'XML Response', url: (k as any).xmlResponse })}>
                      <FileText className="w-3 h-3 mr-1" /> View XML
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailUser(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* URL / Content Popup */}
      <Dialog open={!!urlPopup} onOpenChange={() => setUrlPopup(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> {urlPopup?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <div className="bg-muted/40 rounded-lg p-3 break-all text-xs font-mono max-h-40 overflow-y-auto">
              {urlPopup?.url}
            </div>
            {urlPopup?.url?.startsWith('http') && (
              <Button
                className="w-full gradient-primary text-white"
                onClick={() => window.open(urlPopup.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUrlPopup(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;