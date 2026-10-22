import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CustomerDetailView from './CustomerDetailView';

const customers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh.k@email.com', phone: '+91 98765 43210', location: 'Mumbai', status: 'Active', tier: 'Privy Alpha League' },
  { id: 2, name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+91 98765 43211', location: 'Delhi', status: 'Active', tier: 'Private Wealth League' },
  { id: 3, name: 'Amit Patel', email: 'amit.p@email.com', phone: '+91 98765 43212', location: 'Bangalore', status: 'Inactive', tier: 'Privy Alpha League' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.r@email.com', phone: '+91 98765 43213', location: 'Hyderabad', status: 'Active', tier: 'Angel Wealth League' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.s@email.com', phone: '+91 98765 43214', location: 'Pune', status: 'Active', tier: 'Private Wealth League' },
];

const CustomersPage: React.FC = () => {
  const [selected, setSelected] = useState<typeof customers[0] | null>(null);

  if (selected) {
    return <CustomerDetailView customer={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer database</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Club</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelected(customer)}
                  >
                    <td className="p-3 font-medium text-cyan-700 hover:underline">{customer.name}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{customer.location}</span>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-[#0e7490] text-white">{customer.tier}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={customer.status === 'Active' ? 'default' : 'outline'}
                        className={customer.status === 'Active' ? 'bg-[#0c2340] text-white' : ''}>
                        {customer.status}
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

export default CustomersPage;
