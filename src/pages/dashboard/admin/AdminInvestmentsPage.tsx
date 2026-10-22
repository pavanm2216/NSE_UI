import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Users,
  PieChart,
  Eye,
  Filter,
  Search,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Wallet,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const investmentStats = {
  totalInvestors: 1247,
  totalInvested: 12450000,
  totalCurrentValue: 13895000,
  totalReturns: 1445000,
  returnPercent: 11.6,
  activeInvestments: 3421,
};

const investmentProducts = [
  {
    id: 1,
    name: 'Equity Growth Fund',
    type: 'Mutual Fund',
    totalInvested: 4500000,
    investors: 342,
    avgReturn: 14.2,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Balanced Advantage Fund',
    type: 'Hybrid Fund',
    totalInvested: 3200000,
    investors: 287,
    avgReturn: 10.8,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Corporate Bond Fund',
    type: 'Debt Fund',
    totalInvested: 2800000,
    investors: 198,
    avgReturn: 7.5,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Gold ETF',
    type: 'Commodity',
    totalInvested: 1950000,
    investors: 420,
    avgReturn: 9.3,
    status: 'Active',
  },
];

const allInvestments = [
  {
    id: 1,
    investorName: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    product: 'Equity Growth Fund',
    amount: 25000,
    currentValue: 28500,
    returns: 3500,
    returnPercent: 14,
    investedDate: '2024-01-15',
    status: 'Active',
    riskProfile: 'Aggressive',
  },
  {
    id: 2,
    investorName: 'Priya Sharma',
    email: 'priya@email.com',
    product: 'Corporate Bond Fund',
    amount: 15000,
    currentValue: 15900,
    returns: 900,
    returnPercent: 6,
    investedDate: '2024-02-20',
    status: 'Active',
    riskProfile: 'Conservative',
  },
  {
    id: 3,
    investorName: 'Amit Patel',
    email: 'amit@email.com',
    product: 'Gold ETF',
    amount: 10000,
    currentValue: 10800,
    returns: 800,
    returnPercent: 8,
    investedDate: '2024-03-10',
    status: 'Active',
    riskProfile: 'Moderate',
  },
  {
    id: 4,
    investorName: 'Sneha Reddy',
    email: 'sneha@email.com',
    product: 'Balanced Advantage Fund',
    amount: 30000,
    currentValue: 33200,
    returns: 3200,
    returnPercent: 10.7,
    investedDate: '2024-01-28',
    status: 'Active',
    riskProfile: 'Moderate',
  },
  {
    id: 5,
    investorName: 'Vikram Singh',
    email: 'vikram@email.com',
    product: 'Equity Growth Fund',
    amount: 50000,
    currentValue: 57500,
    returns: 7500,
    returnPercent: 15,
    investedDate: '2024-01-05',
    status: 'Active',
    riskProfile: 'Aggressive',
  },
];

const AdminInvestmentsPage: React.FC = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');

  const filteredInvestments = allInvestments.filter(investment => {
    const matchesSearch = investment.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || investment.status.toLowerCase() === statusFilter;
    const matchesProduct = productFilter === 'all' || investment.product === productFilter;
    
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Conservative': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Aggressive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Management</h1>
          <p className="text-muted-foreground">Monitor all user investments and portfolio performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="gradient-primary">
            <PieChart className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Investment Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investors</p>
                <p className="text-2xl font-bold">{investmentStats.totalInvestors.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">₹{(investmentStats.totalInvested / 10000000).toFixed(1)}Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-2xl font-bold">₹{(investmentStats.totalCurrentValue / 10000000).toFixed(1)}Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Returns</p>
                <p className="text-2xl font-bold text-green-600">+{investmentStats.returnPercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Products Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Products Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {investmentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="font-medium">₹{(product.totalInvested / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Investors</p>
                    <p className="font-medium">{product.investors}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Avg Return</p>
                    <p className="font-medium text-green-600">+{product.avgReturn}%</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {product.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Investments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Investments</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {investmentProducts.map(product => (
                    <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Returns</TableHead>
                <TableHead>Risk Profile</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{investment.investorName}</p>
                      <p className="text-sm text-muted-foreground">{investment.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{investment.product}</TableCell>
                  <TableCell>₹{investment.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{investment.currentValue.toLocaleString()}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(investment.riskProfile)}>
                      {investment.riskProfile}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(investment.investedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {investment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setSelectedInvestment(investment)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Investment Details</DialogTitle>
                        </DialogHeader>
                        {selectedInvestment && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm text-muted-foreground">Investor Name</Label>
                                <p className="font-medium">{selectedInvestment.investorName}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Email</Label>
                                <p className="font-medium">{selectedInvestment.email}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Product</Label>
                                <p className="font-medium">{selectedInvestment.product}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Risk Profile</Label>
                                <Badge className={getRiskColor(selectedInvestment.riskProfile)}>
                                  {selectedInvestment.riskProfile}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Investment Amount</Label>
                                <p className="font-medium">₹{selectedInvestment.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Current Value</Label>
                                <p className="font-medium">₹{selectedInvestment.currentValue.toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Returns</Label>
                                <p className="font-medium text-green-600">
                                  +₹{selectedInvestment.returns.toLocaleString()} ({selectedInvestment.returnPercent}%)
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm text-muted-foreground">Investment Date</Label>
                                <p className="font-medium">{new Date(selectedInvestment.investedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvestmentsPage;