import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, XCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loanOffers = [
  {
    bank: 'HDFC Bank',
    type: 'Home Loan',
    rate: '8.5%',
    processingFee: '0.5%',
    maxAmount: '₹5 Cr',
    tenure: '30 years',
    features: ['No prepayment charges', 'Quick approval', 'Doorstep service'],
    rating: 4.5,
    recommended: true
  },
  {
    bank: 'SBI',
    type: 'Home Loan',
    rate: '8.7%',
    processingFee: '0.35%',
    maxAmount: '₹10 Cr',
    tenure: '30 years',
    features: ['Low processing fee', 'Government backing', 'Flexible EMI'],
    rating: 4.3,
    recommended: false
  },
  {
    bank: 'ICICI Bank',
    type: 'Home Loan',
    rate: '8.6%',
    processingFee: '0.5%',
    maxAmount: '₹3 Cr',
    tenure: '25 years',
    features: ['Digital process', 'Quick disbursal', 'Balance transfer'],
    rating: 4.4,
    recommended: false
  },
];

const CompareLoansPage: React.FC = () => {
  const [loanType, setLoanType] = useState('home');
  const [amount, setAmount] = useState('5000000');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Compare Loans</h1>
          <p className="text-muted-foreground">Find the best loan offers for your needs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Comparison Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Loan Type</label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Loan</SelectItem>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="car">Car Loan</SelectItem>
                  <SelectItem value="business">Business Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Loan Amount</label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000000">₹10 Lakh</SelectItem>
                  <SelectItem value="2500000">₹25 Lakh</SelectItem>
                  <SelectItem value="5000000">₹50 Lakh</SelectItem>
                  <SelectItem value="10000000">₹1 Crore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="mr-2 w-4 h-4" />
                Compare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {loanOffers.map((offer, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className={`card-hover relative ${offer.recommended ? 'ring-2 ring-primary' : ''}`}>
              {offer.recommended && (
                <div className="absolute -top-3 left-4">
                  <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{offer.bank}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{offer.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{offer.type}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="text-xl font-bold text-primary">{offer.rate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Fee</p>
                    <p className="text-lg font-semibold">{offer.processingFee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Amount</p>
                    <p className="text-lg font-semibold">{offer.maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Tenure</p>
                    <p className="text-lg font-semibold">{offer.tenure}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Key Features</p>
                  <div className="space-y-1">
                    {offer.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full gradient-primary text-primary-foreground">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Bank</th>
                  <th className="text-left p-2">Interest Rate</th>
                  <th className="text-left p-2">Processing Fee</th>
                  <th className="text-left p-2">EMI (₹50L, 20Y)</th>
                  <th className="text-left p-2">Total Interest</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">HDFC Bank</td>
                  <td className="p-2">8.5%</td>
                  <td className="p-2">₹25,000</td>
                  <td className="p-2 font-semibold">₹43,391</td>
                  <td className="p-2">₹54,13,840</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">SBI</td>
                  <td className="p-2">8.7%</td>
                  <td className="p-2">₹17,500</td>
                  <td className="p-2 font-semibold">₹43,982</td>
                  <td className="p-2">₹55,55,680</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">ICICI Bank</td>
                  <td className="p-2">8.6%</td>
                  <td className="p-2">₹25,000</td>
                  <td className="p-2 font-semibold">₹43,686</td>
                  <td className="p-2">₹54,84,640</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompareLoansPage;