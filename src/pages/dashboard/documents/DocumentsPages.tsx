import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, Calendar, File, Eye, Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const DocumentUploadPage: React.FC = () => {
  const recentUploads = [
    { id: 1, name: 'Aadhar_Card_Rajesh.pdf', customer: 'Rajesh Kumar', size: '2.4 MB', date: '2024-01-15', status: 'Uploaded', type: 'Aadhar Card' },
    { id: 2, name: 'PAN_Card_Priya.pdf', customer: 'Priya Sharma', size: '1.8 MB', date: '2024-01-15', status: 'Processing', type: 'PAN Card' },
    { id: 3, name: 'Bank_Statement_Amit.pdf', customer: 'Amit Patel', size: '5.2 MB', date: '2024-01-14', status: 'Verified', type: 'Bank Statement' },
    { id: 4, name: 'Income_Proof_Sneha.pdf', customer: 'Sneha Reddy', size: '3.1 MB', date: '2024-01-14', status: 'Uploaded', type: 'Income Proof' },
    { id: 5, name: 'Property_Papers_Vikram.pdf', customer: 'Vikram Singh', size: '8.5 MB', date: '2024-01-13', status: 'Verified', type: 'Property Papers' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload & Storage</h1>
          <p className="text-muted-foreground">Upload and manage documents</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Documents
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Document Name</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Size</th>
                  <th className="text-left p-3">Upload Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUploads.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-primary" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3">{doc.customer}</td>
                    <td className="p-3">{doc.size}</td>
                    <td className="p-3">{doc.date}</td>
                    <td className="p-3">
                      <Badge variant={doc.status === 'Verified' ? 'default' : doc.status === 'Processing' ? 'secondary' : 'outline'}>
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const OCRProcessingPage: React.FC = () => {
  const ocrQueue = [
    { id: 1, document: 'Aadhar Card', customer: 'Rajesh Kumar', extracted: 'Name, DOB, Address', confidence: '98%', status: 'Completed' },
    { id: 2, document: 'PAN Card', customer: 'Priya Sharma', extracted: 'PAN Number, Name', confidence: '95%', status: 'Processing' },
    { id: 3, document: 'Bank Statement', customer: 'Amit Patel', extracted: 'Account No, Balance', confidence: '92%', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">OCR Processing</h1>
        <p className="text-muted-foreground">Automated document data extraction</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Documents Processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">96%</div>
            <p className="text-sm text-muted-foreground">Avg Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">In Queue</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            OCR Processing Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Document</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Extracted Data</th>
                  <th className="text-left p-3">Confidence</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {ocrQueue.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.document}</td>
                    <td className="p-3">{item.customer}</td>
                    <td className="p-3 text-sm">{item.extracted}</td>
                    <td className="p-3">{item.confidence}</td>
                    <td className="p-3">
                      <Badge variant={item.status === 'Completed' ? 'default' : 'secondary'}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VerificationWorkflowPage: React.FC = () => {
  const verificationQueue = [
    { id: 1, document: 'Aadhar Card', customer: 'Rajesh Kumar', submittedBy: 'Agent A', priority: 'High', status: 'Pending' },
    { id: 2, document: 'Income Proof', customer: 'Priya Sharma', submittedBy: 'Agent B', priority: 'Medium', status: 'In Review' },
    { id: 3, document: 'Property Papers', customer: 'Amit Patel', submittedBy: 'Agent C', priority: 'High', status: 'Approved' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verification Workflow</h1>
        <p className="text-muted-foreground">Document verification and approval</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Verification Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Document</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Submitted By</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {verificationQueue.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.document}</td>
                    <td className="p-3">{item.customer}</td>
                    <td className="p-3">{item.submittedBy}</td>
                    <td className="p-3">
                      <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>{item.priority}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={item.status === 'Approved' ? 'default' : item.status === 'In Review' ? 'secondary' : 'outline'}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ExpiryTrackingPage: React.FC = () => {
  const expiringDocs = [
    { id: 1, document: 'PAN Card', customer: 'Rajesh Kumar', expiryDate: '2024-02-15', daysLeft: 30, status: 'Expiring Soon' },
    { id: 2, document: 'Aadhar Card', customer: 'Priya Sharma', expiryDate: '2024-01-20', daysLeft: 5, status: 'Critical' },
    { id: 3, document: 'Insurance Policy', customer: 'Amit Patel', expiryDate: '2024-03-10', daysLeft: 55, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expiry Tracking</h1>
        <p className="text-muted-foreground">Monitor document expiration dates</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-sm text-muted-foreground">Expiring in 7 Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-sm text-muted-foreground">Expiring in 30 Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">Active Documents</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Expiring Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Document</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Expiry Date</th>
                  <th className="text-left p-3">Days Left</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {expiringDocs.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{doc.document}</td>
                    <td className="p-3">{doc.customer}</td>
                    <td className="p-3">{doc.expiryDate}</td>
                    <td className="p-3">{doc.daysLeft} days</td>
                    <td className="p-3">
                      <Badge variant={doc.status === 'Critical' ? 'destructive' : doc.status === 'Expiring Soon' ? 'secondary' : 'default'}>
                        {doc.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
