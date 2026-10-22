import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Wallet, 
  Star,
  ArrowRight,
  Clock,
  Video,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Total Clients', value: '48', change: '+5 this month', trend: 'up', icon: Users },
  { label: 'Sessions This Week', value: '12', change: '3 upcoming', trend: 'up', icon: Calendar },
  { label: 'Total Earnings', value: '₹4,25,000', change: '+₹85,000 this month', trend: 'up', icon: Wallet },
  { label: 'Avg. Rating', value: '4.9', change: '52 reviews', trend: 'up', icon: Star },
];

const upcomingSessions = [
  { 
    client: 'Rajesh Kumar',
    topic: 'Business Strategy Consultation',
    time: '10:00 AM',
    date: 'Today',
    type: 'video',
    duration: '60 min'
  },
  { 
    client: 'Priya Sharma',
    topic: 'Investment Portfolio Review',
    time: '2:30 PM',
    date: 'Today',
    type: 'video',
    duration: '45 min'
  },
  { 
    client: 'Amit Patel',
    topic: 'Startup Funding Advisory',
    time: '11:00 AM',
    date: 'Tomorrow',
    type: 'chat',
    duration: '30 min'
  },
];

const recentClients = [
  { name: 'Rahul Verma', company: 'TechStart Inc.', sessions: 8, lastSession: '2 days ago' },
  { name: 'Sneha Gupta', company: 'RetailPlus', sessions: 5, lastSession: '1 week ago' },
  { name: 'Vikram Singh', company: 'FinGrowth', sessions: 12, lastSession: '3 days ago' },
];

const services = [
  { name: 'Business Strategy', bookings: 25, revenue: '₹1,25,000' },
  { name: 'Investment Advisory', bookings: 18, revenue: '₹90,000' },
  { name: 'Startup Mentoring', bookings: 15, revenue: '₹75,000' },
];

const ConsultantDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Consultant Dashboard</h1>
          <p className="text-muted-foreground">Manage your sessions and clients</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" asChild>
          <Link to="/dashboard/calendar">
            <Calendar className="mr-2 w-4 h-4" />
            View Calendar
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1 number-display">{stat.value}</p>
                    <p className="text-xs mt-1 text-success">{stat.change}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Sessions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/bookings">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {session.client.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{session.client}</p>
                        <p className="text-sm text-muted-foreground">{session.topic}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.time} • {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            {session.type === 'video' ? <Video className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                            {session.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="gradient-primary text-primary-foreground">
                      {session.type === 'video' ? 'Join' : 'Open'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Performance */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Services Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                    </div>
                    <p className="text-lg font-bold text-primary">{service.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Clients</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/clients">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{client.sessions} sessions</p>
                      <p className="text-xs text-muted-foreground">{client.lastSession}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/services">
                  <CheckCircle className="mr-2 w-4 h-4" />
                  Manage Services
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/availability">
                  <Calendar className="mr-2 w-4 h-4" />
                  Set Availability
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/dashboard/earnings">
                  <Wallet className="mr-2 w-4 h-4" />
                  View Earnings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
