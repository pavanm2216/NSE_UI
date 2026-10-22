import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Building2, Users, ShieldCheck, BarChart3, Phone, Edit2, Upload, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const completionSections = [
  { label: 'Personal Details', done: true },
  { label: 'PAN Details', done: true },
  { label: 'Bank Details', done: true },
  { label: 'Nominee Details', done: false },
  { label: 'KYC Status', done: true },
  { label: 'Risk Profile', done: false },
];
const completionPct = Math.round((completionSections.filter(s => s.done).length / completionSections.length) * 100);

const kycItems = [
  { label: 'PAN Card', status: 'verified' },
  { label: 'Aadhaar Card', status: 'verified' },
  { label: 'Address Proof', status: 'verified' },
  { label: 'Bank Statement', status: 'pending' },
  { label: 'Signature', status: 'not_uploaded' },
];

const kycStyle: Record<string, { color: string; icon: React.ReactNode }> = {
  verified: { color: 'text-green-600', icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> },
  pending: { color: 'text-yellow-600', icon: <Clock className="w-4 h-4 text-yellow-600" /> },
  not_uploaded: { color: 'text-red-500', icon: <XCircle className="w-4 h-4 text-red-500" /> },
};

const riskOptions = [
  { label: 'Conservative', desc: 'Prefer stable returns with minimal risk', color: 'border-green-400 bg-green-50' },
  { label: 'Moderate', desc: 'Balance between growth and stability', color: 'border-yellow-400 bg-yellow-50' },
  { label: 'Aggressive', desc: 'Maximise returns, accept higher volatility', color: 'border-red-400 bg-red-50' },
];

const FormField: React.FC<{ label: string; value: string; disabled?: boolean }> = ({ label, value, disabled }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
    <Input defaultValue={value} disabled={disabled} className="text-sm" />
  </div>
);

const MFInvestorProfilePage: React.FC = () => {
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState('Aggressive');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Investor Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your investment profile and KYC details</p>
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="border-[#11B5E4]/30 bg-gradient-to-r from-[#0D3B66]/5 to-[#11B5E4]/5">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Profile Completion</p>
                <span className="text-lg font-bold text-[#0D3B66]">{completionPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0D3B66] to-[#11B5E4]"
                  initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 1 }} />
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {completionSections.map(s => (
                  <span key={s.label} className={`flex items-center gap-1 text-xs ${s.done ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {s.done ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList className="flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="personal"><User className="w-3 h-3 mr-1" />Personal</TabsTrigger>
          <TabsTrigger value="pan"><CreditCard className="w-3 h-3 mr-1" />PAN</TabsTrigger>
          <TabsTrigger value="bank"><Building2 className="w-3 h-3 mr-1" />Bank</TabsTrigger>
          <TabsTrigger value="nominee"><Users className="w-3 h-3 mr-1" />Nominee</TabsTrigger>
          <TabsTrigger value="kyc"><ShieldCheck className="w-3 h-3 mr-1" />KYC</TabsTrigger>
          <TabsTrigger value="risk"><BarChart3 className="w-3 h-3 mr-1" />Risk Profile</TabsTrigger>
        </TabsList>

        {/* Personal Details */}
        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Personal Details</CardTitle>
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setEditing(editing === 'personal' ? null : 'personal')}>
                <Edit2 className="w-3 h-3" />{editing === 'personal' ? 'Save' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Full Name" value="Rajesh Kumar" disabled={editing !== 'personal'} />
                <FormField label="Date of Birth" value="15 March 1985" disabled={editing !== 'personal'} />
                <FormField label="Gender" value="Male" disabled={editing !== 'personal'} />
                <FormField label="Marital Status" value="Married" disabled={editing !== 'personal'} />
                <FormField label="Occupation" value="Salaried - IT Professional" disabled={editing !== 'personal'} />
                <FormField label="Annual Income" value="₹12,00,000 - ₹25,00,000" disabled={editing !== 'personal'} />
                <div className="sm:col-span-2">
                  <FormField label="Address" value="42, MG Road, Bengaluru, Karnataka - 560001" disabled={editing !== 'personal'} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAN Details */}
        <TabsContent value="pan">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">PAN Details</CardTitle>
              <Badge className="bg-green-100 text-green-700 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="PAN Number" value="ABCDE1234F" disabled />
                <FormField label="Name as per PAN" value="RAJESH KUMAR" disabled />
                <FormField label="Father's Name" value="SURESH KUMAR" disabled />
                <FormField label="Date of Birth (PAN)" value="15/03/1985" disabled />
              </div>
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" /> PAN is verified and linked to your Aadhaar
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details */}
        <TabsContent value="bank">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Bank Details</CardTitle>
              <Button size="sm" variant="outline" className="gap-1 text-xs">
                <Edit2 className="w-3 h-3" />Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Bank Name" value="HDFC Bank" disabled />
                <FormField label="Account Number" value="XXXX XXXX 4521" disabled />
                <FormField label="IFSC Code" value="HDFC0001234" disabled />
                <FormField label="Account Type" value="Savings" disabled />
                <FormField label="Branch" value="MG Road, Bengaluru" disabled />
              </div>
              <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" /> Bank account verified via penny drop
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nominee */}
        <TabsContent value="nominee">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Nominee Details</CardTitle>
              <Button size="sm" className="gap-1 text-xs bg-[#0D3B66] text-white hover:bg-[#11B5E4] transition-colors">
                + Add Nominee
              </Button>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="font-medium">No nominee added yet</p>
                <p className="text-sm mt-1">Add a nominee to secure your investments</p>
                <Button className="mt-4 bg-[#0D3B66] text-white hover:bg-[#11B5E4] transition-colors" size="sm">Add Nominee</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KYC */}
        <TabsContent value="kyc">
          <Card>
            <CardHeader><CardTitle className="text-base">KYC Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kycItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-3">
                      {kycStyle[item.status].icon}
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium capitalize ${kycStyle[item.status].color}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                      {item.status === 'not_uploaded' && (
                        <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                          <Upload className="w-3 h-3" />Upload
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Profile */}
        <TabsContent value="risk">
          <Card>
            <CardHeader><CardTitle className="text-base">Risk Profile Assessment</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Select your investment risk appetite. This helps us suggest suitable funds.</p>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {riskOptions.map(opt => (
                  <button key={opt.label} onClick={() => setSelectedRisk(opt.label)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedRisk === opt.label ? opt.color + ' border-opacity-100' : 'border-border hover:bg-muted/40'}`}>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                    {selectedRisk === opt.label && (
                      <Badge className="mt-2 bg-[#0D3B66] text-white text-xs">Selected</Badge>
                    )}
                  </button>
                ))}
              </div>
              <Button className="bg-[#0D3B66] text-white hover:bg-[#11B5E4] transition-colors">Save Risk Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MFInvestorProfilePage;
