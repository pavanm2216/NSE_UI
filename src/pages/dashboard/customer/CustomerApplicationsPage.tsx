import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const applicationCards = [
  { label: 'Total Applications', count: '8', color: 'bg-primary', textColor: 'text-primary', icon: FileText },
  { label: 'In Progress', count: '2', color: 'bg-warning', textColor: 'text-warning', icon: Clock },
  { label: 'Approved', count: '4', color: 'bg-success', textColor: 'text-success', icon: CheckCircle },
  { label: 'Rejected', count: '2', color: 'bg-destructive', textColor: 'text-destructive', icon: XCircle },
];

const applicationsData = [
  { id: 'APP001', type: 'Home Loan', amount: '₹45,00,000', status: 'approved', progress: 100, appliedDate: '2023-12-15', lastUpdate: '2024-01-10', documents: ['Complete'] },
  { id: 'APP002', type: 'Personal Loan', amount: '₹3,00,000', status: 'in-progress', progress: 60, appliedDate: '2024-01-10', lastUpdate: '2024-01-20', documents: ['Pending: Salary Slips'] },
  { id: 'APP003', type: 'Car Loan', amount: '₹8,00,000', status: 'approved', progress: 100, appliedDate: '2023-11-20', lastUpdate: '2023-12-05', documents: ['Complete'] },
  { id: 'APP004', type: 'Business Loan', amount: '₹12,00,000', status: 'rejected', progress: 0, appliedDate: '2024-01-05', lastUpdate: '2024-01-18', documents: ['Incomplete'] },
  { id: 'APP005', type: 'Education Loan', amount: '₹6,00,000', status: 'in-progress', progress: 30, appliedDate: '2024-01-15', lastUpdate: '2024-01-22', documents: ['Pending: Income Proof'] },
];

const statusColors: Record<string, string> = {
  'in-progress': 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  submitted: 'bg-info/10 text-info',
};

const statusLabels: Record<string, string> = {
  'in-progress': 'In Progress',
  approved: 'Approved',
  rejected: 'Rejected',
  submitted: 'Submitted',
};

const CustomerApplicationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">Track your loan application status</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <FileText className="mr-2 w-4 h-4" />
          New Application
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {applicationCards.map((card, index) => (
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
          <CardTitle>Application History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicationsData.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.id}</TableCell>
                  <TableCell>{app.type}</TableCell>
                  <TableCell className="font-semibold">{app.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={app.progress} className="w-16" />
                      <span className="text-sm">{app.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[app.status]}>
                      {statusLabels[app.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{app.appliedDate}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {app.documents.map((doc, index) => (
                        <div key={index} className={doc.includes('Pending') ? 'text-warning' : 'text-success'}>
                          {doc}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {app.status === 'in-progress' && (
                        <Button size="icon" variant="outline">
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}
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

export default CustomerApplicationsPage;