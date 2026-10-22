import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const TasksPage: React.FC = () => {
  const tasks = [
    { id: 1, title: 'Follow up with Rajesh Kumar', description: 'Discuss loan disbursement timeline', priority: 'High', dueDate: 'Today', completed: false },
    { id: 2, title: 'Send investment report to Priya', description: 'Monthly portfolio performance report', priority: 'Medium', dueDate: 'Tomorrow', completed: false },
    { id: 3, title: 'Schedule property visit', description: 'Arrange viewing for Amit Patel', priority: 'High', dueDate: 'Today', completed: true },
    { id: 4, title: 'Prepare VC pitch deck review', description: 'Review Sneha Reddy\'s startup pitch', priority: 'Low', dueDate: 'Next Week', completed: false },
    { id: 5, title: 'Update CRM records', description: 'Add new customer interactions', priority: 'Medium', dueDate: 'Tomorrow', completed: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage your tasks and to-dos</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Task List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 ${task.completed ? 'opacity-60' : ''}`}>
                <Checkbox checked={task.completed} className="mt-1" />
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {task.dueDate}
                    </span>
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

export default TasksPage;
