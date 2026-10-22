import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Download, Settings, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const LiveDashboardPage: React.FC = () => {
  const metrics = [
    { title: 'Total Revenue', value: '₹2.5 Cr', change: '+12.5%', icon: DollarSign, trend: 'up' },
    { title: 'Active Deals', value: '45', change: '+8', icon: TrendingUp, trend: 'up' },
    { title: 'New Customers', value: '128', change: '+15%', icon: Users, trend: 'up' },
    { title: 'Conversion Rate', value: '68%', change: '+5%', icon: BarChart, trend: 'up' },
  ];

  const recentActivity = [
    { time: '2 min ago', event: 'New deal created', user: 'Agent A', value: '₹5L' },
    { time: '15 min ago', event: 'Loan approved', user: 'Agent B', value: '₹15L' },
    { time: '1 hour ago', event: 'Customer onboarded', user: 'Agent C', value: '-' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Dashboards</h1>
        <p className="text-muted-foreground">Real-time analytics and insights</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-8 h-8 text-primary" />
                <Badge variant="secondary" className="text-green-600">{metric.change}</Badge>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-sm text-muted-foreground">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Chart: Monthly Revenue Trend</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Chart: Deal Stage Distribution</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{activity.event}</div>
                  <div className="text-sm text-muted-foreground">{activity.user} • {activity.time}</div>
                </div>
                <div className="font-medium">{activity.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ScheduledReportsPage: React.FC = () => {
  const schedules = [
    { id: 1, name: 'Weekly Sales Report', frequency: 'Weekly', recipients: 'sales@lendrix.com', nextRun: '2024-01-22', status: 'Active' },
    { id: 2, name: 'Monthly Commission Report', frequency: 'Monthly', recipients: 'finance@lendrix.com', nextRun: '2024-02-01', status: 'Active' },
    { id: 3, name: 'Daily Activity Summary', frequency: 'Daily', recipients: 'management@lendrix.com', nextRun: '2024-01-16', status: 'Active' },
    { id: 4, name: 'Quarterly Performance', frequency: 'Quarterly', recipients: 'board@lendrix.com', nextRun: '2024-04-01', status: 'Paused' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Reports</h1>
          <p className="text-muted-foreground">Automated report generation</p>
        </div>
        <Button>Create Schedule</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Report Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Report Name</th>
                  <th className="text-left p-3">Frequency</th>
                  <th className="text-left p-3">Recipients</th>
                  <th className="text-left p-3">Next Run</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{schedule.name}</td>
                    <td className="p-3">{schedule.frequency}</td>
                    <td className="p-3 text-sm">{schedule.recipients}</td>
                    <td className="p-3">{schedule.nextRun}</td>
                    <td className="p-3">
                      <Badge variant={schedule.status === 'Active' ? 'default' : 'outline'}>{schedule.status}</Badge>
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">Edit</Button>
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

export const ExportCentrePage: React.FC = () => {
  const exports = [
    { id: 1, name: 'Customer Database', format: 'CSV', size: '2.4 MB', date: '2024-01-15', status: 'Completed' },
    { id: 2, name: 'Loan Applications', format: 'Excel', size: '5.8 MB', date: '2024-01-15', status: 'Processing' },
    { id: 3, name: 'Commission Report', format: 'PDF', size: '1.2 MB', date: '2024-01-14', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export Centre</h1>
        <p className="text-muted-foreground">Export data and reports</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Export Customers</h3>
            <p className="text-sm text-muted-foreground">Download customer database</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Export Deals</h3>
            <p className="text-sm text-muted-foreground">Download deal pipeline</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Export Reports</h3>
            <p className="text-sm text-muted-foreground">Download analytics reports</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exports.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-medium">{exp.name}</div>
                    <div className="text-sm text-muted-foreground">{exp.format} • {exp.size} • {exp.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={exp.status === 'Completed' ? 'default' : 'secondary'}>{exp.status}</Badge>
                  {exp.status === 'Completed' && <Button size="sm" variant="outline">Download</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const CustomReportBuilderPage: React.FC = () => {
  const savedReports = [
    { id: 1, name: 'Top Performing Agents', filters: 'Last 30 days, Revenue > 1L', created: '2024-01-10' },
    { id: 2, name: 'Pending Loan Applications', filters: 'Status = Pending, Amount > 5L', created: '2024-01-12' },
    { id: 3, name: 'High Value Customers', filters: 'Investment > 10L, Active', created: '2024-01-14' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Report Builder</h1>
          <p className="text-muted-foreground">Build custom reports and analytics</p>
        </div>
        <Button>Create New Report</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Source</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Customers</option>
                <option>Deals</option>
                <option>Loans</option>
                <option>Investments</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Filters</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Field" className="p-2 border rounded-lg" />
                <input type="text" placeholder="Value" className="p-2 border rounded-lg" />
              </div>
            </div>
            <Button>Generate Report</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {savedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{report.name}</div>
                  <div className="text-sm text-muted-foreground">{report.filters} • Created: {report.created}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Run</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
