import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Building2, Users, TrendingUp, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const analyticsCards = [
  { label: 'Total Views', count: '2,456', change: '+18%', color: 'bg-primary', textColor: 'text-primary', icon: Eye },
  { label: 'Active Listings', count: '23', change: '+3', color: 'bg-success', textColor: 'text-success', icon: Building2 },
  { label: 'Inquiries', count: '156', change: '+28%', color: 'bg-info', textColor: 'text-info', icon: Users },
  { label: 'Conversion Rate', count: '12.5%', change: '+2.1%', color: 'bg-warning', textColor: 'text-warning', icon: TrendingUp },
];

const propertyPerformance = [
  { property: '3BHK Apartment in Bandra', views: 245, inquiries: 12, status: 'Hot', price: '₹2.5Cr' },
  { property: 'Commercial Office Space', views: 189, inquiries: 8, status: 'Active', price: '₹1.8Cr' },
  { property: '2BHK Villa with Garden', views: 156, inquiries: 15, status: 'Hot', price: '₹3.2Cr' },
  { property: 'Studio Apartment', views: 134, inquiries: 6, status: 'Slow', price: '₹85L' },
];

const monthlyData = [
  { month: 'Jan 2024', listings: 25, inquiries: 156, sales: 3, revenue: '₹8.5Cr' },
  { month: 'Dec 2023', listings: 22, inquiries: 134, sales: 2, revenue: '₹5.3Cr' },
  { month: 'Nov 2023', listings: 20, inquiries: 98, sales: 4, revenue: '₹12.1Cr' },
];

const BrokerAnalyticsPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your property performance and leads</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.count}</p>
                    <p className="text-xs text-success">{card.change} from last month</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyPerformance.map((property, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{property.property}</TableCell>
                      <TableCell>{property.views}</TableCell>
                      <TableCell>{property.inquiries}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          property.status === 'Hot' ? 'bg-destructive/10 text-destructive' :
                          property.status === 'Active' ? 'bg-success/10 text-success' :
                          'bg-muted/10 text-muted-foreground'
                        }`}>
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{property.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-sm text-success font-semibold">{data.revenue}</span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Listings: {data.listings}</div>
                      <div>Inquiries: {data.inquiries}</div>
                      <div>Sales: {data.sales}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BrokerAnalyticsPage;