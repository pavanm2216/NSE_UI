import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Upload, Camera, X, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CreateDealModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { onClose(); }, 1800);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-8 flex flex-col items-center gap-3 shadow-xl">
          <CheckCircle className="w-14 h-14 text-green-500" />
          <p className="text-xl font-semibold">Submitted Successfully!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">Create New Deal</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Name of Business / Organisation</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm bg-background" placeholder="Enter business or organisation name" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Images of Business / Organisation</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {images.map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded-lg border" />
              ))}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4" /> Upload Image
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => cameraInputRef.current?.click()}>
                <Camera className="w-4 h-4" /> Click Photo
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture className="hidden" onChange={handleImageUpload} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <input required className="w-full border rounded-lg px-3 py-2 text-sm bg-background" placeholder="Enter category" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Notes</label>
            <textarea required rows={8} className="w-full border rounded-lg px-4 py-3 text-sm bg-background resize-y min-h-[160px]" placeholder="Write notes here..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Submit</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DealCreationPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const recentDeals = [
    { id: 'D001', customer: 'Rajesh Kumar', product: 'Personal Loan', value: '₹5,00,000', stage: 'Negotiation', probability: '75%' },
    { id: 'D002', customer: 'Priya Sharma', product: 'Investment', value: '₹2,00,000', stage: 'Proposal', probability: '60%' },
    { id: 'D003', customer: 'Amit Patel', product: 'Business Loan', value: '₹15,00,000', stage: 'Closed Won', probability: '100%' },
  ];

  return (
    <div className="space-y-6">
      {showModal && <CreateDealModal onClose={() => setShowModal(false)} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deal Creation</h1>
          <p className="text-muted-foreground">Create and manage deals</p>
        </div>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Create New Deal
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹22L</div>
            <p className="text-sm text-muted-foreground">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">Active Deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">68%</div>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Deal ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Stage</th>
                  <th className="text-left p-3">Probability</th>
                </tr>
              </thead>
              <tbody>
                {recentDeals.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{deal.id}</td>
                    <td className="p-3">{deal.customer}</td>
                    <td className="p-3">{deal.product}</td>
                    <td className="p-3">{deal.value}</td>
                    <td className="p-3">
                      <Badge variant={deal.stage === 'Closed Won' ? 'default' : 'secondary'}>{deal.stage}</Badge>
                    </td>
                    <td className="p-3">{deal.probability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const CommissionEnginePage: React.FC = () => null;
export const PayoutTrackingPage: React.FC = () => null;

export const AgentStatementsPage: React.FC = () => {
  const statements = [
    { id: 'PRD001', years: 3, transactions: 48, commission: '₹45,000' },
    { id: 'PRD002', years: 2, transactions: 36, commission: '₹38,000' },
    { id: 'PRD003', years: 4, transactions: 60, commission: '₹52,000' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Statements</h1>
        <p className="text-muted-foreground">View and download agent statements</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Statement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product ID</th>
                  <th className="text-left p-3">Years</th>
                  <th className="text-left p-3">Transactions</th>
                  <th className="text-left p-3">Commission Earned</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{s.id}</td>
                    <td className="p-3">{s.years} {s.years === 1 ? 'Year' : 'Years'}</td>
                    <td className="p-3">{s.transactions}</td>
                    <td className="p-3 font-medium text-green-600">{s.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
