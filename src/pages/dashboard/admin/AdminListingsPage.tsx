import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const listingsCards = [
  { label: 'Total Listings', count: '1,234', color: 'bg-primary', textColor: 'text-primary', icon: Building2 },
  { label: 'Active', count: '987', color: 'bg-success', textColor: 'text-success', icon: Building2 },
  { label: 'Pending Review', count: '156', color: 'bg-warning', textColor: 'text-warning', icon: Building2 },
  { label: 'Sold/Rented', count: '91', color: 'bg-info', textColor: 'text-info', icon: Building2 },
];

const listingsData = [
  { id: 1, title: '3BHK Apartment in Bandra', broker: 'Mike Broker', type: 'Apartment', price: '₹2.5Cr', status: 'active', location: 'Mumbai', date: '2024-01-20' },
  { id: 2, title: 'Commercial Office Space', broker: 'Sarah Broker', type: 'Commercial', price: '₹1.8Cr', status: 'pending', location: 'Delhi', date: '2024-01-19' },
  { id: 3, title: '2BHK Villa with Garden', broker: 'Mike Broker', type: 'Villa', price: '₹3.2Cr', status: 'active', location: 'Pune', date: '2024-01-18' },
  { id: 4, title: 'Studio Apartment', broker: 'Emma Broker', type: 'Apartment', price: '₹85L', status: 'sold', location: 'Bangalore', date: '2024-01-17' },
];

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  sold: 'bg-info/10 text-info',
  inactive: 'bg-muted/10 text-muted-foreground',
};

const AdminListingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [listings, setListings] = useState(listingsData);

  const updateListingStatus = (id: number, newStatus: string) => {
    setListings(listings.map(listing => 
      listing.id === id ? { ...listing, status: newStatus } : listing
    ));
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.broker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Property Listings</h1>
          <p className="text-muted-foreground">Manage all property listings on the platform</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="mr-2 w-4 h-4" />
          Add Listing
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {listingsCards.map((card, index) => (
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
              <Input placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold/Rented</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Title</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listed Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell>{listing.broker}</TableCell>
                  <TableCell>{listing.type}</TableCell>
                  <TableCell className="font-semibold">{listing.price}</TableCell>
                  <TableCell>{listing.location}</TableCell>
                  <TableCell>
                    <Select value={listing.status} onValueChange={(value) => updateListingStatus(listing.id, value)}>
                      <SelectTrigger className="w-24">
                        <Badge className={statusColors[listing.status]}>
                          {listing.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{listing.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Trash2 className="w-4 h-4" />
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

export default AdminListingsPage;