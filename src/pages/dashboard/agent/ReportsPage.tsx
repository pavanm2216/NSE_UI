import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Users, FileText, PieChart, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

const reportCards = [
  { label: 'Total Reports', count: '24', color: 'bg-primary', textColor: 'text-primary', icon: FileText },
  { label: 'This Month', count: '8', color: 'bg-success', textColor: 'text-success', icon: Calendar },
  { label: 'Performance Score', count: '92%', color: 'bg-info', textColor: 'text-info', icon: TrendingUp },
  { label: 'Conversion Rate', count: '31.8%', color: 'bg-warning', textColor: 'text-warning', icon: BarChart3 },
];

const availableReports = [
  {
    name: 'Monthly Performance Report',
    description: 'Detailed analysis of monthly performance metrics',
    type: 'Performance',
    lastGenerated: '2024-01-22',
    format: 'PDF',
    status: 'ready'
  },
  {
    name: 'Commission Summary',
    description: 'Complete commission breakdown and earnings',
    type: 'Financial',
    lastGenerated: '2024-01-21',
    format: 'Excel',
    status: 'ready'
  },
  {
    name: 'Lead Conversion Analysis',
    description: 'Lead funnel and conversion rate analysis',
    type: 'Analytics',
    lastGenerated: '2024-01-20',
    format: 'PDF',
    status: 'ready'
  },
  {
    name: 'Customer Demographics',
    description: 'Customer profile and demographic insights',
    type: 'Analytics',
    lastGenerated: '2024-01-19',
    format: 'Excel',
    status: 'generating'
  },
  {
    name: 'Loan Portfolio Report',
    description: 'Overview of all loan applications and status',
    type: 'Portfolio',
    lastGenerated: '2024-01-18',
    format: 'PDF',
    status: 'ready'
  },
];

const performanceMetrics = [
  { metric: 'Total Leads Generated', value: '245', change: '+28', period: 'This Month' },
  { metric: 'Conversion Rate', value: '31.8%', change: '+3.2%', period: 'This Month' },
  { metric: 'Average Deal Size', value: '₹18.5L', change: '+₹2.3L', period: 'This Month' },
  { metric: 'Customer Satisfaction', value: '4.8/5', change: '+0.3', period: 'This Month' },
  { metric: 'Response Time', value: '2.4 hrs', change: '-0.8 hrs', period: 'This Month' },
  { metric: 'Follow-up Rate', value: '95%', change: '+5%', period: 'This Month' },
];

const statusColors: Record<string, string> = {
  ready: 'bg-success/10 text-success',
  generating: 'bg-warning/10 text-warning',
  failed: 'bg-destructive/10 text-destructive',
};

const statusLabels: Record<string, string> = {
  ready: 'Ready',
  generating: 'Generating',
  failed: 'Failed',
};

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState<any>(null);

  const filteredReports = availableReports.filter(report => 
    reportType === 'all' || report.type.toLowerCase() === reportType
  );

  const generateReport = (reportName: string) => {
    console.log(`Generating report: ${reportName}`);
    // Here you would implement the actual report generation logic
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 w-4 h-4" />
            Custom Report
          </Button>
          <Button className="gradient-primary text-primary-foreground">
            <Download className="mr-2 w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((card, index) => (
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Available Reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Available Reports</CardTitle>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">{report.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.lastGenerated}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[report.status]}>
                          {statusLabels[report.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {report.status === 'ready' ? (
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => generateReport(report.name)}
                            >
                              <BarChart3 className="w-4 h-4 mr-1" />
                              Generate
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

        {/* Performance Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <span className="text-xs text-success">{metric.change}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{metric.value}</span>
                      <span className="text-xs text-muted-foreground">{metric.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Performance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Lead Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <PieChart className="w-6 h-6" />
              <span>Commission Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Custom Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;