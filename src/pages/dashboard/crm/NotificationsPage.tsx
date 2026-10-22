import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NotificationsPage: React.FC = () => {
  const notifications = [
    { id: 1, type: 'success', title: 'Loan Approved', message: 'Rajesh Kumar\'s loan application has been approved', time: '5 min ago', read: false },
    { id: 2, type: 'warning', title: 'Document Expiring', message: 'KYC document for Priya Sharma expires in 7 days', time: '1 hour ago', read: false },
    { id: 3, type: 'info', title: 'New Lead Assigned', message: 'You have been assigned a new lead from Mumbai', time: '3 hours ago', read: true },
    { id: 4, type: 'error', title: 'Payment Failed', message: 'EMI payment failed for Amit Patel', time: '1 day ago', read: true },
    { id: 5, type: 'success', title: 'Deal Closed', message: 'Successfully closed VC deal with Sneha Reddy', time: '2 days ago', read: true },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">View all system notifications</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 ${notification.read ? 'opacity-60' : 'bg-primary/5'}`}>
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <span className="text-sm text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && (
                  <Badge variant="default" className="flex-shrink-0">New</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
