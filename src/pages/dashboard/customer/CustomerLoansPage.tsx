import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Eye, Download, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const loanCards = [
  { label: 'Active Loans', count: '3', color: 'bg-success', textColor: 'text-success', icon: CheckCircle },
  { label: 'Total Amount', count: '₹58L', color: 'bg-primary', textColor: 'text-primary', icon: CreditCard },
  { label: 'Monthly EMI', count: '₹73,000', color: 'bg-warning', textColor: 'text-warning', icon: Calendar },
  { label: 'Pending', count: '₹42L', color: 'bg-info', textColor: 'text-info', icon: Clock },
];

const loansData = [
  { id: 'L001', type: 'Home Loan', amount: '₹45,00,000', emi: '₹42,500', tenure: '20 years', status: 'active', startDate: '2023-01-15', nextEmi: '2024-02-01', progress: 8 },
  { id: 'L002', type: 'Car Loan', amount: '₹8,00,000', emi: '₹18,500', tenure: '5 years', status: 'active', startDate: '2023-06-10', nextEmi: '2024-02-05', progress: 15 },
  { id: 'L003', type: 'Personal Loan', amount: '₹5,00,000', emi: '₹12,000', tenure: '3 years', status: 'active', startDate: '2023-09-20', nextEmi: '2024-02-03', progress: 25 },
  { id: 'L004', type: 'Business Loan', amount: '₹15,00,000', emi: '₹28,000', tenure: '7 years', status: 'closed', startDate: '2022-03-12', nextEmi: '-', progress: 100 },
];

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  closed: 'bg-muted/10 text-muted-foreground',
  overdue: 'bg-destructive/10 text-destructive',
};

const CustomerLoansPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Loans</h1>
          <p className="text-muted-foreground">Track and manage your loan portfolio</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Download className="mr-2 w-4 h-4" />
          Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loanCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.count}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next EMI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loansData.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.type}</TableCell>
                  <TableCell className="font-semibold">{loan.amount}</TableCell>
                  <TableCell>{loan.emi}</TableCell>
                  <TableCell>{loan.tenure}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={loan.progress} className="w-16" />
                      <span className="text-sm">{loan.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[loan.status]}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{loan.nextEmi}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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

export default CustomerLoansPage;