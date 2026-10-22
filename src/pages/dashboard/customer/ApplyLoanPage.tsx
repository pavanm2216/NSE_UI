import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Home, Car, Briefcase, GraduationCap, Calculator, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const loanTypes = [
  { type: 'Home Loan', rate: '8.5-9.5%', tenure: '30 years', icon: Home, color: 'bg-success' },
  { type: 'Personal Loan', rate: '10.5-18%', tenure: '5 years', icon: CreditCard, color: 'bg-primary' },
  { type: 'Car Loan', rate: '7.5-12%', tenure: '7 years', icon: Car, color: 'bg-warning' },
  { type: 'Business Loan', rate: '9-15%', tenure: '10 years', icon: Briefcase, color: 'bg-info' },
  { type: 'Education Loan', rate: '8-12%', tenure: '15 years', icon: GraduationCap, color: 'bg-accent' },
];

const ApplyLoanPage: React.FC = () => {
  const [selectedLoan, setSelectedLoan] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '',
    income: '',
    employment: '',
    purpose: '',
  });

  const handleSubmit = () => {
    console.log('Loan application submitted:', { selectedLoan, ...formData });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Apply for Loan</h1>
          <p className="text-muted-foreground">Choose the right loan for your needs</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loanTypes.map((loan, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className={`card-hover cursor-pointer transition-all ${selectedLoan === loan.type ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedLoan(loan.type)}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${loan.color}/10 flex items-center justify-center`}>
                    <loan.icon className={`w-6 h-6 ${loan.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{loan.type}</h3>
                    <p className="text-sm text-muted-foreground">Interest: {loan.rate}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Max tenure: {loan.tenure}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedLoan && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Application Form - {selectedLoan}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Loan Amount (₹)</Label>
                <Input placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div>
                <Label>Tenure (Years)</Label>
                <Select value={formData.tenure} onValueChange={(value) => setFormData({...formData, tenure: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                    <SelectItem value="15">15 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                    <SelectItem value="30">30 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monthly Income (₹)</Label>
                <Input placeholder="Enter monthly income" value={formData.income} onChange={(e) => setFormData({...formData, income: e.target.value})} />
              </div>
              <div>
                <Label>Employment Type</Label>
                <Select value={formData.employment} onValueChange={(value) => setFormData({...formData, employment: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Purpose of Loan</Label>
              <Textarea placeholder="Describe the purpose of your loan" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} rows={3} />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">
                <FileText className="mr-2 w-4 h-4" />
                Submit Application
              </Button>
              <Button variant="outline">
                <Calculator className="mr-2 w-4 h-4" />
                Calculate EMI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplyLoanPage;