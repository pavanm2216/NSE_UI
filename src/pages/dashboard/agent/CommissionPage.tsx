import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Target, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const commissionCards = [
  { label: 'Total Earned', count: '₹4,85,000', change: '+12%', color: 'bg-success', textColor: 'text-success', icon: DollarSign },
  { label: 'This Month', count: '₹65,000', change: '+28%', color: 'bg-primary', textColor: 'text-primary', icon: TrendingUp },
  { label: 'Average Rate', count: '1.4%', change: '+0.2%', color: 'bg-info', textColor: 'text-info', icon: Target },
  { label: 'Monthly Target', count: '85%', change: '+15%', color: 'bg-warning', textColor: 'text-warning', icon: BarChart3 },
];

const commissionData = [
  {
    month: 'January 2024',
    totalLoans: 12,
    loanVolume: '₹2,45,00,000',
    commission: '₹65,000',
    avgRate: '1.2%',
    target: '₹70,000',
    achievement: 93,
    breakdown: {
      homeLoan: '₹35,000',
      personalLoan: '₹15,000',
      businessLoan: '₹12,000',
      carLoan: '₹3,000'
    }
  },
  {
    month: 'December 2023',
    totalLoans: 15,
    loanVolume: '₹3,20,00,000',
    commission: '₹85,000',
    avgRate: '1.5%',
    target: '₹80,000',
    achievement: 106,
    breakdown: {
      homeLoan: '₹45,000',
      personalLoan: '₹20,000',
      businessLoan: '₹15,000',
      carLoan: '₹5,000'
    }
  },
  {
    month: 'November 2023',
    totalLoans: 10,
    loanVolume: '₹1,80,00,000',
    commission: '₹52,000',
    avgRate: '1.3%',
    target: '₹60,000',
    achievement: 87,
    breakdown: {
      homeLoan: '₹28,000',
      personalLoan: '₹12,000',
      businessLoan: '₹8,000',
      carLoan: '₹4,000'
    }
  },
];

const loanTypeCommissions = [
  { type: 'Home Loan', rate: '1.0-1.5%', thisMonth: '₹35,000', total: '₹2,45,000', count: 8 },
  { type: 'Business Loan', rate: '1.2-2.0%', thisMonth: '₹12,000', total: '₹1,25,000', count: 5 },
  { type: 'Personal Loan', rate: '2.0-3.0%', thisMonth: '₹15,000', total: '₹85,000', count: 12 },
  { type: 'Car Loan', rate: '1.5-2.0%', thisMonth: '₹3,000', total: '₹30,000', count: 3 },
];

const CommissionPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Commission Tracking</h1>
          <p className="text-muted-foreground">Monitor your earnings and performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Commission Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.count}</p>
                    <p className="text-xs text-success">{card.change} from last month</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${card.color}/10 flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Loans</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Target Achievement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{data.month}</TableCell>
                      <TableCell>{data.totalLoans}</TableCell>
                      <TableCell>{data.loanVolume}</TableCell>
                      <TableCell className="font-semibold text-success">{data.commission}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={data.achievement} className="w-16" />
                          <span className="text-sm font-medium">{data.achievement}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Commission by Loan Type */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Commission by Loan Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanTypeCommissions.map((loan, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{loan.type}</h4>
                      <Badge variant="outline">{loan.rate}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">This Month</span>
                        <span className="font-semibold text-success">{loan.thisMonth}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Earned</span>
                        <span className="font-semibold">{loan.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Loans Closed</span>
                        <span className="font-semibold">{loan.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>January 2024 Commission Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="font-medium">Home Loan</span>
              </div>
              <p className="text-2xl font-bold text-success">₹35,000</p>
              <p className="text-sm text-muted-foreground">54% of total</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-medium">Personal Loan</span>
              </div>
              <p className="text-2xl font-bold text-primary">₹15,000</p>
              <p className="text-sm text-muted-foreground">23% of total</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="font-medium">Business Loan</span>
              </div>
              <p className="text-2xl font-bold text-warning">₹12,000</p>
              <p className="text-sm text-muted-foreground">18% of total</p>
            </div>
            <div className="p-4 rounded-lg bg-info/5 border border-info/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="font-medium">Car Loan</span>
              </div>
              <p className="text-2xl font-bold text-info">₹3,000</p>
              <p className="text-sm text-muted-foreground">5% of total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionPage;