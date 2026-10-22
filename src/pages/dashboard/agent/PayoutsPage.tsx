import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, CheckCircle, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const payoutCards = [
  { label: 'Total Payouts', count: '₹4,85,000', color: 'bg-success', textColor: 'text-success', icon: Wallet },
  { label: 'This Month', count: '₹65,000', color: 'bg-primary', textColor: 'text-primary', icon: TrendingUp },
  { label: 'Pending', count: '₹28,000', color: 'bg-warning', textColor: 'text-warning', icon: Clock },
  { label: 'Processed', count: '₹4,57,000', color: 'bg-info', textColor: 'text-info', icon: CheckCircle },
];

const payoutsData = [
  {
    id: 'PAY001',
    loanType: 'Home Loan',
    customerName: 'Rajesh Kumar',
    loanAmount: '₹45,00,000',
    commissionRate: '1.0%',
    commissionAmount: '₹45,000',
    status: 'processed',
    processedDate: '2024-01-20',
    payoutDate: '2024-01-22',
    transactionId: 'TXN123456789'
  },
  {
    id: 'PAY002',
    loanType: 'Business Loan',
    customerName: 'Amit Patel',
    loanAmount: '₹25,00,000',
    commissionRate: '1.2%',
    commissionAmount: '₹30,000',
    status: 'pending',
    processedDate: '2024-01-19',
    payoutDate: '-',
    transactionId: '-'
  },
  {
    id: 'PAY003',
    loanType: 'Personal Loan',
    customerName: 'Priya Sharma',
    loanAmount: '₹5,00,000',
    commissionRate: '2.0%',
    commissionAmount: '₹10,000',
    status: 'processed',
    processedDate: '2024-01-18',
    payoutDate: '2024-01-20',
    transactionId: 'TXN123456788'
  },
  {
    id: 'PAY004',
    loanType: 'Car Loan',
    customerName: 'Sneha Gupta',
    loanAmount: '₹8,00,000',
    commissionRate: '1.5%',
    commissionAmount: '₹12,000',
    status: 'processing',
    processedDate: '2024-01-17',
    payoutDate: '-',
    transactionId: '-'
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  processing: 'bg-info/10 text-info',
  processed: 'bg-success/10 text-success',
  failed: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  processed: 'Processed',
  failed: 'Failed',
};

const PayoutsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payouts, setPayouts] = useState(payoutsData);

  const updatePayoutStatus = (id: string, newStatus: string) => {
    setPayouts(payouts.map(payout => 
      payout.id === id ? { 
        ...payout, 
        status: newStatus,
        payoutDate: newStatus === 'processed' ? new Date().toISOString().split('T')[0] : payout.payoutDate,
        transactionId: newStatus === 'processed' ? `TXN${Date.now()}` : payout.transactionId
      } : payout
    ));
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payouts</h1>
          <p className="text-muted-foreground">Track commission payouts and earnings</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Download className="mr-2 w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Payout Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {payoutCards.map((card, index) => (
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

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search payouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan Details</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.id}</TableCell>
                  <TableCell>{payout.customerName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{payout.loanType}</div>
                      <div className="text-sm text-muted-foreground">{payout.loanAmount}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-success">{payout.commissionAmount}</div>
                      <div className="text-xs text-muted-foreground">@ {payout.commissionRate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={payout.status}
                      onValueChange={(value) => updatePayoutStatus(payout.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={statusColors[payout.status]}>
                          {statusLabels[payout.status]}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{payout.processedDate}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{payout.transactionId}</span>
                  </TableCell>
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

export default PayoutsPage;