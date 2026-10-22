import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Settings, FileText, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const UserManagementPage: React.FC = () => {
  const users = [
    { id: 1, name: 'Agent A', email: 'agenta@lendrix.com', phone: '+91 98765 00001', role: 'DSA', status: 'Active', deals: 15 },
    { id: 2, name: 'Agent B', email: 'agentb@lendrix.com', phone: '+91 98765 00002', role: 'DSA', status: 'Active', deals: 12 },
    { id: 3, name: 'Manager X', email: 'managerx@lendrix.com', phone: '+91 98765 00003', role: 'Admin', status: 'Active', deals: 0 },
    { id: 4, name: 'Agent C', email: 'agentc@lendrix.com', phone: '+91 98765 00004', role: 'DSA', status: 'Inactive', deals: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and agents</p>
        </div>
        <Button>Add New User</Button>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">38</div>
            <p className="text-sm text-muted-foreground">Active Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Deals</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{user.phone}</span>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="outline">{user.role}</Badge></td>
                    <td className="p-3">{user.deals}</td>
                    <td className="p-3">
                      <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>{user.status}</Badge>
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

export const RolePermissionPage: React.FC = () => {
  const roles = [
    { id: 1, name: 'DSA Agent', users: 38, permissions: ['View Leads', 'Create Deals', 'Upload Documents', 'View Commission'] },
    { id: 2, name: 'Admin', users: 5, permissions: ['All Permissions', 'User Management', 'System Config', 'Reports'] },
    { id: 3, name: 'Manager', users: 8, permissions: ['View All Deals', 'Approve Loans', 'Manage Team', 'Reports'] },
    { id: 4, name: 'Customer', users: 245, permissions: ['View Own Data', 'Apply Loans', 'Track Applications'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role & Permission Editor</h1>
          <p className="text-muted-foreground">Configure roles and permissions</p>
        </div>
        <Button>Create New Role</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">{role.users} users assigned</p>
                  </div>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="secondary">{permission}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VerticalConfigPage: React.FC = () => {
  const verticals = [
    { id: 1, name: 'Lending', status: 'Active', products: 8, agents: 25, revenue: '₹45L' },
    { id: 2, name: 'Investing', status: 'Active', products: 12, agents: 18, revenue: '₹32L' },
    { id: 3, name: 'Real Estate', status: 'Active', products: 5, agents: 15, revenue: '₹28L' },
    { id: 4, name: 'VC & Consulting', status: 'Active', products: 3, agents: 8, revenue: '₹65L' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vertical Configuration</h1>
        <p className="text-muted-foreground">Configure business verticals</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Business Verticals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Vertical</th>
                  <th className="text-left p-3">Products</th>
                  <th className="text-left p-3">Agents</th>
                  <th className="text-left p-3">Revenue (MTD)</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {verticals.map((vertical) => (
                  <tr key={vertical.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{vertical.name}</td>
                    <td className="p-3">{vertical.products}</td>
                    <td className="p-3">{vertical.agents}</td>
                    <td className="p-3 font-medium">{vertical.revenue}</td>
                    <td className="p-3">
                      <Badge variant="default">{vertical.status}</Badge>
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">Configure</Button>
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

export const AuditLogsPage: React.FC = () => {
  const logs = [
    { id: 1, timestamp: '2024-01-15 14:30:25', user: 'admin@lendrix.com', action: 'User Created', details: 'Created new agent: Agent D', ip: '192.168.1.100' },
    { id: 2, timestamp: '2024-01-15 14:25:10', user: 'agenta@lendrix.com', action: 'Deal Updated', details: 'Updated deal D001 status to Closed Won', ip: '192.168.1.101' },
    { id: 3, timestamp: '2024-01-15 14:20:45', user: 'managerx@lendrix.com', action: 'Loan Approved', details: 'Approved loan L005 for ₹10L', ip: '192.168.1.102' },
    { id: 4, timestamp: '2024-01-15 14:15:30', user: 'agentb@lendrix.com', action: 'Document Uploaded', details: 'Uploaded Aadhar card for customer C123', ip: '192.168.1.103' },
    { id: 5, timestamp: '2024-01-15 14:10:15', user: 'admin@lendrix.com', action: 'Role Modified', details: 'Updated permissions for DSA Agent role', ip: '192.168.1.100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">System activity and audit trail</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-sm text-muted-foreground">Total Events (Today)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">45</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Failed Logins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Security Alerts</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Timestamp</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Details</th>
                  <th className="text-left p-3">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 text-sm">{log.timestamp}</td>
                    <td className="p-3 text-sm">{log.user}</td>
                    <td className="p-3">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="p-3 text-sm">{log.details}</td>
                    <td className="p-3 text-sm font-mono">{log.ip}</td>
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
