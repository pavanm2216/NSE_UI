import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Phone, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ActivitiesPage: React.FC = () => {
  const activities = [
    { id: 1, type: 'Call', customer: 'Rajesh Kumar', description: 'Follow-up call regarding loan application', time: '2 hours ago', status: 'Completed' },
    { id: 2, type: 'Email', customer: 'Priya Sharma', description: 'Sent investment portfolio details', time: '4 hours ago', status: 'Completed' },
    { id: 3, type: 'Meeting', customer: 'Amit Patel', description: 'Property viewing scheduled', time: '1 day ago', status: 'Scheduled' },
    { id: 4, type: 'SMS', customer: 'Sneha Reddy', description: 'Payment reminder sent', time: '2 days ago', status: 'Completed' },
    { id: 5, type: 'Call', customer: 'Vikram Singh', description: 'Consultation call for VC funding', time: '3 days ago', status: 'Pending' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <Calendar className="w-4 h-4" />;
      case 'SMS': return <MessageSquare className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activities</h1>
        <p className="text-muted-foreground">Track all customer activities and interactions</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{activity.customer}</h4>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.type}</Badge>
                    <Badge variant={activity.status === 'Completed' ? 'default' : activity.status === 'Scheduled' ? 'secondary' : 'outline'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
