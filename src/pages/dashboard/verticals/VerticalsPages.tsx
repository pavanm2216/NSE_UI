import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, TrendingUp, Building2, Briefcase, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const LendingPage: React.FC = () => {
  const loans = [
    { id: 'L001', customer: 'Rajesh Kumar', type: 'Personal Loan', amount: '₹5,00,000', status: 'Approved', rate: '10.5%' },
    { id: 'L002', customer: 'Priya Sharma', type: 'Home Loan', amount: '₹45,00,000', status: 'Processing', rate: '8.5%' },
    { id: 'L003', customer: 'Amit Patel', type: 'Business Loan', amount: '₹15,00,000', status: 'Disbursed', rate: '12%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lending Module</h1>
        <p className="text-muted-foreground">Manage lending products and applications</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹65L</div>
            <p className="text-sm text-muted-foreground">Total Disbursed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Active Loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">95%</div>
            <p className="text-sm text-muted-foreground">Approval Rate</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Loan Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Loan ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Rate</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{loan.id}</td>
                    <td className="p-3">{loan.customer}</td>
                    <td className="p-3">{loan.type}</td>
                    <td className="p-3">{loan.amount}</td>
                    <td className="p-3">{loan.rate}</td>
                    <td className="p-3">
                      <Badge variant={loan.status === 'Disbursed' ? 'default' : loan.status === 'Approved' ? 'secondary' : 'outline'}>
                        {loan.status}
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

export const InvestingPage: React.FC = () => {
  const investments = [
    { id: 'I001', customer: 'Sneha Reddy', product: 'Mutual Fund', amount: '₹2,00,000', returns: '+12.5%', status: 'Active' },
    { id: 'I002', customer: 'Vikram Singh', product: 'Stocks', amount: '₹5,00,000', returns: '+8.3%', status: 'Active' },
    { id: 'I003', customer: 'Priya Sharma', product: 'Fixed Deposit', amount: '₹10,00,000', returns: '+6.5%', status: 'Matured' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Investing Module</h1>
        <p className="text-muted-foreground">Manage investment products and portfolios</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹17L</div>
            <p className="text-sm text-muted-foreground">Total AUM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">+9.2%</div>
            <p className="text-sm text-muted-foreground">Avg Returns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Active Portfolios</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Investment Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Returns</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{inv.id}</td>
                    <td className="p-3">{inv.customer}</td>
                    <td className="p-3">{inv.product}</td>
                    <td className="p-3">{inv.amount}</td>
                    <td className="p-3 text-green-600 font-medium">{inv.returns}</td>
                    <td className="p-3">
                      <Badge variant={inv.status === 'Active' ? 'default' : 'secondary'}>{inv.status}</Badge>
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

export const RealEstateVerticalPage: React.FC = () => {
  const properties = [
    { id: 'P001', title: '3BHK Apartment', location: 'Mumbai, Andheri', price: '₹1.2 Cr', status: 'Available', type: 'Sale' },
    { id: 'P002', title: 'Commercial Office', location: 'Bangalore, Whitefield', price: '₹85 L', status: 'Under Offer', type: 'Sale' },
    { id: 'P003', title: '2BHK Flat', location: 'Pune, Hinjewadi', price: '₹35,000/mo', status: 'Rented', type: 'Rent' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Real Estate Module</h1>
        <p className="text-muted-foreground">Manage real estate listings and transactions</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Deals Closed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹8.5 Cr</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Property Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Property</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{prop.id}</td>
                    <td className="p-3">{prop.title}</td>
                    <td className="p-3">{prop.location}</td>
                    <td className="p-3">{prop.price}</td>
                    <td className="p-3"><Badge variant="outline">{prop.type}</Badge></td>
                    <td className="p-3">
                      <Badge variant={prop.status === 'Available' ? 'default' : prop.status === 'Rented' ? 'secondary' : 'outline'}>
                        {prop.status}
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

export const VCConsultingPage: React.FC = () => {
  const deals = [
    { id: 'VC001', startup: 'TechStart AI', sector: 'AI/ML', funding: '₹5 Cr', stage: 'Series A', status: 'Due Diligence' },
    { id: 'VC002', startup: 'FinFlow Solutions', sector: 'FinTech', funding: '₹2 Cr', stage: 'Seed', status: 'Closed' },
    { id: 'VC003', startup: 'HealthCare Plus', sector: 'HealthTech', funding: '₹10 Cr', stage: 'Series B', status: 'Negotiation' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">VC & Consulting Module</h1>
        <p className="text-muted-foreground">Manage venture capital and consulting services</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹17 Cr</div>
            <p className="text-sm text-muted-foreground">Total Funding</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Portfolio Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">15</div>
            <p className="text-sm text-muted-foreground">Active Deals</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            VC Deal Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Deal ID</th>
                  <th className="text-left p-3">Startup</th>
                  <th className="text-left p-3">Sector</th>
                  <th className="text-left p-3">Funding</th>
                  <th className="text-left p-3">Stage</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{deal.id}</td>
                    <td className="p-3">{deal.startup}</td>
                    <td className="p-3">{deal.sector}</td>
                    <td className="p-3">{deal.funding}</td>
                    <td className="p-3"><Badge variant="outline">{deal.stage}</Badge></td>
                    <td className="p-3">
                      <Badge variant={deal.status === 'Closed' ? 'default' : 'secondary'}>{deal.status}</Badge>
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
