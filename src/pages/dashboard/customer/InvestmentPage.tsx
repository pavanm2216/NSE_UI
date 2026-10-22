import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  PieChart,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const investmentOptions = [
  {
    id: 1,
    name: 'Equity Growth Fund',
    type: 'Mutual Fund',
    minAmount: 1000,
    expectedReturn: '12-15%',
    risk: 'High',
    duration: '3-5 years',
    description: 'Diversified equity portfolio for long-term growth',
  },
  {
    id: 2,
    name: 'Balanced Advantage Fund',
    type: 'Hybrid Fund',
    minAmount: 500,
    expectedReturn: '8-12%',
    risk: 'Medium',
    duration: '2-3 years',
    description: 'Mix of equity and debt for balanced returns',
  },
  {
    id: 3,
    name: 'Corporate Bond Fund',
    type: 'Debt Fund',
    minAmount: 2000,
    expectedReturn: '6-8%',
    risk: 'Low',
    duration: '1-2 years',
    description: 'Stable returns through corporate bonds',
  },
  {
    id: 4,
    name: 'Gold ETF',
    type: 'Commodity',
    minAmount: 1500,
    expectedReturn: '8-10%',
    risk: 'Medium',
    duration: '2-4 years',
    description: 'Digital gold investment for portfolio diversification',
  },
];

const myInvestments = [
  {
    id: 1,
    name: 'Equity Growth Fund',
    amount: 25000,
    currentValue: 28500,
    returns: 3500,
    returnPercent: 14,
    investedDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Corporate Bond Fund',
    amount: 15000,
    currentValue: 15900,
    returns: 900,
    returnPercent: 6,
    investedDate: '2024-02-20',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Gold ETF',
    amount: 10000,
    currentValue: 10800,
    returns: 800,
    returnPercent: 8,
    investedDate: '2024-03-10',
    status: 'Active',
  },
];

const InvestmentPage: React.FC = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [filter, setFilter] = useState('all');

  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = myInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const totalReturnPercent = ((totalReturns / totalInvested) * 100).toFixed(1);

  const handleInvest = () => {
    if (selectedInvestment && investmentAmount) {
      // Handle investment logic here
      console.log(`Investing ₹${investmentAmount} in ${selectedInvestment.name}`);
      setSelectedInvestment(null);
      setInvestmentAmount('');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Portfolio</h1>
          <p className="text-muted-foreground">Grow your wealth with smart investments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Choose Investment Option</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {investmentOptions.map((option) => (
                <Card 
                  key={option.id} 
                  className={`cursor-pointer transition-all ${
                    selectedInvestment?.id === option.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedInvestment(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{option.name}</h3>
                        <p className="text-sm text-muted-foreground">{option.type}</p>
                      </div>
                      <Badge className={getRiskColor(option.risk)}>{option.risk}</Badge>
                    </div>
                    <p className="text-sm mb-3">{option.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Min Amount</span>
                        <p className="font-medium">₹{option.minAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Return</span>
                        <p className="font-medium text-green-600">{option.expectedReturn}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration</span>
                        <p className="font-medium">{option.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {selectedInvestment && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="amount">Investment Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Minimum ₹${selectedInvestment.minAmount}`}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedInvestment.minAmount}
                  />
                </div>
                <Button 
                  onClick={handleInvest} 
                  className="w-full gradient-primary"
                  disabled={!investmentAmount || Number(investmentAmount) < selectedInvestment.minAmount}
                >
                  Invest ₹{investmentAmount || '0'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-2xl font-bold text-green-600">
                  +₹{totalReturns.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return %</p>
                <p className="text-2xl font-bold text-green-600">+{totalReturnPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Investments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Investments</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myInvestments.map((investment) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{investment.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Invested on {new Date(investment.investedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Invested</p>
                    <p className="font-medium">₹{investment.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="font-medium">₹{investment.currentValue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Returns</p>
                    <div className="flex items-center gap-1">
                      {investment.returns > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span className={investment.returns > 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{Math.abs(investment.returns).toLocaleString()} ({investment.returnPercent}%)
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {investment.status}
                  </Badge>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentPage;