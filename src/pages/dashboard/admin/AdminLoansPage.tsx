import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Eye, Edit, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loansCards = [
  { label: 'Total Loans', count: '3,247', color: 'bg-primary', textColor: 'text-primary', icon: CreditCard },
  { label: 'Approved', count: '2,156', color: 'bg-success', textColor: 'text-success', icon: CheckCircle },
  { label: 'Pending', count: '789', color: 'bg-warning', textColor: 'text-warning', icon: Clock },
  { label: 'Rejected', count: '302', color: 'bg-destructive', textColor: 'text-destructive', icon: XCircle },
];

const loansData = [
  { id: 'L001', customer: 'Rajesh Kumar', agent: 'David DSA', type: 'Home Loan', amount: '₹45,00,000', status: 'approved', date: '2024-01-20', emi: '₹42,500' },
  { id: 'L002', customer: 'Priya Sharma', agent: 'Priya Agent', type: 'Personal Loan', amount: '₹5,00,000', status: 'pending', date: '2024-01-19', emi: '₹12,500' },
  { id: 'L003', customer: 'Amit Patel', agent: 'Rajesh Kumar', type: 'Business Loan', amount: '₹25,00,000', status: 'review', date: '2024-01-18', emi: '₹35,000' },
  { id: 'L004', customer: 'Sneha Gupta', agent: 'Amit Sharma', type: 'Car Loan', amount: '₹8,00,000', status: 'rejected', date: '2024-01-17', emi: '₹18,500' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  review: 'bg-info/10 text-info',
  rejected: 'bg-destructive/10 text-destructive',
  disbursed: 'bg-primary/10 text-primary',
};

const AdminLoansPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loans, setLoans] = useState(loansData);

  const updateLoanStatus = (id: string, newStatus: string) => {
    setLoans(loans.map(loan => 
      loan.id === id ? { ...loan, status: newStatus } : loan
    ));
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    const matchesType = typeFilter === 'all' || loan.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Loan Management</h1>
          <p className="text-muted-foreground">Manage all loan applications and approvals</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loansCards.map((card, index) => (
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search loans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="home">Home Loan</SelectItem>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
                <SelectItem value="car">Car Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.customer}</TableCell>
                  <TableCell>{loan.agent}</TableCell>
                  <TableCell>{loan.type}</TableCell>
                  <TableCell className="font-semibold">{loan.amount}</TableCell>
                  <TableCell>{loan.emi}</TableCell>
                  <TableCell>
                    <Select value={loan.status} onValueChange={(value) => updateLoanStatus(loan.id, value)}>
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[loan.status]}>
                          {loan.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="disbursed">Disbursed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{loan.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Edit className="w-4 h-4" />
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

export default AdminLoansPage;