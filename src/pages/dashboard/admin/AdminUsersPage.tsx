import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const userCards = [
  { label: 'Total Users', count: '12,543', color: 'bg-primary', textColor: 'text-primary', icon: Users },
  { label: 'Active Agents', count: '156', color: 'bg-success', textColor: 'text-success', icon: Users },
  { label: 'Customers', count: '11,245', color: 'bg-info', textColor: 'text-info', icon: Users },
  { label: 'New This Month', count: '234', color: 'bg-warning', textColor: 'text-warning', icon: UserPlus },
];

const usersData = [
  { id: 1, name: 'David DSA', email: 'david@dsa.com', role: 'dsa', status: 'active', joinDate: '2023-01-15', lastLogin: '2024-01-22' },
  { id: 2, name: 'John Customer', email: 'john@example.com', role: 'customer', status: 'active', joinDate: '2023-03-20', lastLogin: '2024-01-21' },
  { id: 3, name: 'Sarah Investor', email: 'sarah@example.com', role: 'investor', status: 'active', joinDate: '2023-02-10', lastLogin: '2024-01-20' },
  { id: 4, name: 'Mike Broker', email: 'mike@example.com', role: 'broker', status: 'inactive', joinDate: '2023-04-05', lastLogin: '2024-01-15' },
  { id: 5, name: 'Emma Consultant', email: 'emma@example.com', role: 'consultant', status: 'active', joinDate: '2023-05-12', lastLogin: '2024-01-22' },
];

const roleColors: Record<string, string> = {
  customer: 'bg-info/10 text-info',
  investor: 'bg-success/10 text-success',
  broker: 'bg-warning/10 text-warning',
  consultant: 'bg-accent/10 text-accent',
  admin: 'bg-primary/10 text-primary',
  dsa: 'bg-gold/10 text-gold',
};

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-muted/10 text-muted-foreground',
  suspended: 'bg-destructive/10 text-destructive',
};

const AdminUsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState(usersData);

  const updateUserStatus = (id: number, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and their permissions</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <UserPlus className="mr-2 w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userCards.map((card, index) => (
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
              <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="dsa">Agent</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {user.role === 'dsa' ? 'Agent' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={user.status} onValueChange={(value) => updateUserStatus(user.id, value)}>
                      <SelectTrigger className="w-24">
                        <Badge className={statusColors[user.status]}>
                          {user.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
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

export default AdminUsersPage;