import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Check, X, Store } from 'lucide-react';

interface MarketplaceSubmission {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  description: string;
  logo?: string;
  submittedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
}

const MarketplaceSubmissionsAdmin: React.FC = () => {
  const [submissions, setSubmissions] = useState<MarketplaceSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<MarketplaceSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
    // Add dummy data if empty
    const existing = JSON.parse(localStorage.getItem('marketplaceSubmissions') || '[]');
    if (existing.length === 0) {
      const dummyData = [
        {
          id: 1,
          businessName: 'Tech Innovators Pvt Ltd',
          ownerName: 'Rajesh Kumar',
          email: 'rajesh@techinnovators.com',
          phone: '9876543210',
          category: 'Technology',
          address: 'Cyber City, Gurgaon, Haryana',
          description: 'Leading software development company specializing in AI and machine learning solutions for enterprises.',
          submittedAt: '2024-01-15T10:30:00.000Z',
          status: 'pending'
        },
        {
          id: 2,
          businessName: 'Green Harvest Foods',
          ownerName: 'Priya Sharma',
          email: 'priya@greenharvest.com',
          phone: '9876543211',
          category: 'Food & Beverage',
          address: 'Sector 18, Noida, Uttar Pradesh',
          description: 'Organic food products and farm-fresh vegetables delivered to your doorstep daily.',
          submittedAt: '2024-01-18T14:20:00.000Z',
          status: 'approved'
        },
        {
          id: 3,
          businessName: 'HealthPlus Clinic',
          ownerName: 'Dr. Amit Patel',
          email: 'amit@healthplus.com',
          phone: '9876543212',
          category: 'Healthcare',
          address: 'MG Road, Bangalore, Karnataka',
          description: 'Multi-specialty healthcare clinic with experienced doctors and modern medical equipment.',
          submittedAt: '2024-01-20T09:15:00.000Z',
          status: 'approved'
        },
        {
          id: 4,
          businessName: 'EduSmart Academy',
          ownerName: 'Sneha Reddy',
          email: 'sneha@edusmart.com',
          phone: '9876543213',
          category: 'Education',
          address: 'Banjara Hills, Hyderabad, Telangana',
          description: 'Online and offline coaching for competitive exams with experienced faculty and study materials.',
          submittedAt: '2024-01-22T11:45:00.000Z',
          status: 'pending'
        },
        {
          id: 5,
          businessName: 'Fashion Trends Boutique',
          ownerName: 'Kavya Nair',
          email: 'kavya@fashiontrends.com',
          phone: '9876543214',
          category: 'Retail',
          address: 'Commercial Street, Bangalore, Karnataka',
          description: 'Designer clothing and accessories for men and women with latest fashion trends.',
          submittedAt: '2024-01-25T16:30:00.000Z',
          status: 'rejected'
        },
        {
          id: 6,
          businessName: 'Digital Marketing Hub',
          ownerName: 'Vikram Singh',
          email: 'vikram@digitalmarketing.com',
          phone: '9876543215',
          category: 'Services',
          address: 'Connaught Place, New Delhi',
          description: 'Full-service digital marketing agency offering SEO, social media, and content marketing solutions.',
          submittedAt: '2024-01-28T13:00:00.000Z',
          status: 'approved'
        },
        {
          id: 7,
          businessName: 'Cafe Aroma',
          ownerName: 'Arjun Mehta',
          email: 'arjun@cafearoma.com',
          phone: '9876543216',
          category: 'Food & Beverage',
          address: 'Koramangala, Bangalore, Karnataka',
          description: 'Cozy cafe serving specialty coffee, fresh pastries, and gourmet sandwiches.',
          submittedAt: '2024-02-01T10:00:00.000Z',
          status: 'pending'
        },
        {
          id: 8,
          businessName: 'FitZone Gym',
          ownerName: 'Neha Gupta',
          email: 'neha@fitzone.com',
          phone: '9876543217',
          category: 'Healthcare',
          address: 'Andheri West, Mumbai, Maharashtra',
          description: 'Modern fitness center with personal trainers, yoga classes, and state-of-the-art equipment.',
          submittedAt: '2024-02-03T08:30:00.000Z',
          status: 'approved'
        }
      ];
      localStorage.setItem('marketplaceSubmissions', JSON.stringify(dummyData));
      setSubmissions(dummyData.reverse());
    }
  }, []);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('marketplaceSubmissions') || '[]');
    setSubmissions(data.reverse());
  };

  const updateStatus = (id: number, status: 'approved' | 'rejected') => {
    const updated = submissions.map(s => s.id === id ? { ...s, status } : s);
    localStorage.setItem('marketplaceSubmissions', JSON.stringify(updated.reverse()));
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
        <h1 className="text-3xl font-bold mb-2">Marketplace Submissions</h1>
        <p className="text-muted-foreground">Review and manage business listings</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.businessName}</TableCell>
                    <TableCell>{submission.ownerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.category}</Badge>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Business Details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {selectedSubmission.logo && (
                <div className="flex justify-center">
                  <img src={selectedSubmission.logo} alt="Logo" className="h-24 object-contain" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                  <p className="text-base">{selectedSubmission.businessName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Owner Name</p>
                  <p className="text-base">{selectedSubmission.ownerName}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="outline">{selectedSubmission.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Address</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedSubmission.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm bg-muted p-4 rounded-lg">{selectedSubmission.description}</p>
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

export default MarketplaceSubmissionsAdmin;
