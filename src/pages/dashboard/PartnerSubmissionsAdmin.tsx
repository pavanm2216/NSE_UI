import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Check, X, Building2 } from 'lucide-react';

interface PartnerSubmission {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
  submittedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

const PartnerSubmissionsAdmin: React.FC = () => {
  const [submissions, setSubmissions] = useState<PartnerSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<PartnerSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('partnerSubmissions') || '[]');
    setSubmissions(data.reverse());
  };

  const updateStatus = (id: number, status: 'approved' | 'rejected') => {
    const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
    localStorage.setItem('partnerSubmissions', JSON.stringify(updated.reverse()));
    setSubmissions(updated);
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'approved') return <Badge className="bg-green-500 text-white">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Partner Submissions</h1>
        <p className="text-muted-foreground">Review and manage partnership applications</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.companyName}</TableCell>
                    <TableCell>{submission.contactPerson}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.partnershipType}</Badge>
                    </TableCell>
                    <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {submission.status !== 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateStatus(submission.id, 'approved')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {submission.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => updateStatus(submission.id, 'rejected')}
                          >
                            <X className="w-4 h-4" />
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
      )}

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Partnership Application Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                  <p className="text-base">{selectedSubmission.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                  <p className="text-base">{selectedSubmission.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-base">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Partnership Type</p>
                  <Badge variant="outline">{selectedSubmission.partnershipType}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                <p className="text-sm bg-muted p-4 rounded-lg">{selectedSubmission.message}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    updateStatus(selectedSubmission.id, 'approved');
                    setSelectedSubmission(null);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    updateStatus(selectedSubmission.id, 'rejected');
                    setSelectedSubmission(null);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerSubmissionsAdmin;
