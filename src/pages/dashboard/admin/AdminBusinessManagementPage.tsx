import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Mail, Phone, MapPin } from 'lucide-react';

interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  description: string;
  logo?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  remarks?: string;
}

const AdminBusinessManagementPage = () => {
  const { toast } = useToast();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  // Mock data
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      businessName: 'Tech Solutions Inc',
      ownerName: 'John Doe',
      email: 'john@techsolutions.com',
      phone: '9876543210',
      category: 'Technology',
      address: 'Mumbai, Maharashtra',
      description: 'Leading IT solutions provider specializing in cloud services',
      status: 'Pending',
      submittedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      businessName: 'Green Foods',
      ownerName: 'Jane Smith',
      email: 'jane@greenfoods.com',
      phone: '9876543211',
      category: 'Food & Beverage',
      address: 'Delhi, India',
      description: 'Organic food delivery service',
      status: 'Approved',
      submittedAt: '2024-01-14T09:00:00Z',
      remarks: 'All documents verified. Approved.',
    },
  ]);

  const pendingBusinesses = businesses.filter(b => b.status === 'Pending');
  const approvedBusinesses = businesses.filter(b => b.status === 'Approved');
  const rejectedBusinesses = businesses.filter(b => b.status === 'Rejected');

  const handleReview = (business: Business, action: 'approve' | 'reject') => {
    setSelectedBusiness(business);
    setActionType(action);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedBusiness) return;

    setBusinesses(prev =>
      prev.map(b =>
        b.id === selectedBusiness.id
          ? { ...b, status: actionType === 'approve' ? 'Approved' : 'Rejected', remarks }
          : b
      )
    );

    toast({
      title: actionType === 'approve' ? 'Business Approved' : 'Business Rejected',
      description: `${selectedBusiness.businessName} has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
    });

    // In real app, send email notification here
    console.log('Email notification sent to:', selectedBusiness.email);

    setIsReviewModalOpen(false);
    setRemarks('');
    setSelectedBusiness(null);
  };

  const BusinessCard = ({ business }: { business: Business }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              {business.logo ? (
                <img src={business.logo} alt={business.businessName} className="w-10 h-10 rounded" />
              ) : (
                <span className="text-xl font-bold text-primary">{business.businessName[0]}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{business.businessName}</CardTitle>
              <CardDescription>{business.ownerName}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              business.status === 'Approved'
                ? 'default'
                : business.status === 'Rejected'
                ? 'destructive'
                : 'secondary'
            }
          >
            {business.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{business.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{business.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{business.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{business.address}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Category: </span>
              <span className="font-medium">{business.category}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted: {new Date(business.submittedAt).toLocaleDateString()}
            </div>
          </div>

          {business.remarks && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-1">Remarks:</p>
              <p className="text-sm text-muted-foreground">{business.remarks}</p>
            </div>
          )}

          {business.status === 'Pending' && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={() => handleReview(business, 'approve')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleReview(business, 'reject')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Business Management</h1>
        <p className="text-muted-foreground">Review and manage business submissions</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingBusinesses.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({approvedBusinesses.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="w-4 h-4" />
            Rejected ({rejectedBusinesses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBusinesses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending businesses to review
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedBusinesses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No approved businesses yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedBusinesses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No rejected businesses
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedBusinesses.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Business
            </DialogTitle>
            <DialogDescription>
              {selectedBusiness?.businessName} - Add remarks for this decision
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Add your remarks here..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1"
                variant={actionType === 'approve' ? 'default' : 'destructive'}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBusinessManagementPage;
