import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, Edit, Trash2, Save, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const chatbotCards = [
  { label: 'Active Rules', count: '12', color: 'bg-success', textColor: 'text-success', icon: Bot },
  { label: 'Total Rules', count: '18', color: 'bg-primary', textColor: 'text-primary', icon: Settings },
  { label: 'Conversations', count: '1,234', color: 'bg-info', textColor: 'text-info', icon: Bot },
  { label: 'Success Rate', count: '87%', color: 'bg-warning', textColor: 'text-warning', icon: Bot },
];

const chatbotRules = [
  { id: 1, name: 'Greeting Rule', description: 'Welcome message for new users', category: 'General', isActive: true, priority: 1 },
  { id: 2, name: 'Loan Information', description: 'Provide basic loan information', category: 'Loans', isActive: true, priority: 2 },
  { id: 3, name: 'Commission Query', description: 'Handle commission-related questions', category: 'Commission', isActive: true, priority: 3 },
  { id: 4, name: 'Technical Support', description: 'Basic technical troubleshooting', category: 'Support', isActive: false, priority: 4 },
  { id: 5, name: 'Lead Status', description: 'Check lead status information', category: 'Leads', isActive: true, priority: 5 },
];

const limitations = [
  { id: 1, name: 'No Personal Information', description: 'Cannot access or share personal user data', enabled: true },
  { id: 2, name: 'No Financial Advice', description: 'Cannot provide specific financial advice', enabled: true },
  { id: 3, name: 'No Password Reset', description: 'Cannot reset user passwords', enabled: true },
  { id: 4, name: 'Business Hours Only', description: 'Only active during business hours', enabled: false },
  { id: 5, name: 'Max 5 Questions', description: 'Limit to 5 questions per session', enabled: false },
];

const AdminChatbotRulesPage: React.FC = () => {
  const [rules, setRules] = useState(chatbotRules);
  const [ruleLimitations, setRuleLimitations] = useState(limitations);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', description: '', category: '', isActive: true, priority: 1 });

  const toggleRuleStatus = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const toggleLimitation = (id: number) => {
    setRuleLimitations(ruleLimitations.map(limitation => 
      limitation.id === id ? { ...limitation, enabled: !limitation.enabled } : limitation
    ));
  };

  const addNewRule = () => {
    if (newRule.name && newRule.description) {
      const rule = { ...newRule, id: Date.now() };
      setRules([...rules, rule]);
      setNewRule({ name: '', description: '', category: '', isActive: true, priority: 1 });
      setShowAddRule(false);
    }
  };

  const deleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Chatbot Rules Management</h1>
          <p className="text-muted-foreground">Configure chatbot behavior and limitations</p>
        </div>
        <Button className="gradient-primary text-primary-foreground" onClick={() => setShowAddRule(!showAddRule)}>
          <Plus className="mr-2 w-4 h-4" />
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {chatbotCards.map((card, index) => (
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

      {showAddRule && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Rule Name</Label>
                <Input value={newRule.name} onChange={(e) => setNewRule({...newRule, name: e.target.value})} placeholder="Enter rule name" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={newRule.category} onChange={(e) => setNewRule({...newRule, category: e.target.value})} placeholder="Enter category" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newRule.description} onChange={(e) => setNewRule({...newRule, description: e.target.value})} placeholder="Enter rule description" rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={newRule.isActive} onCheckedChange={(checked) => setNewRule({...newRule, isActive: checked})} />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewRule}>
                <Save className="mr-2 w-4 h-4" />
                Save Rule
              </Button>
              <Button variant="outline" onClick={() => setShowAddRule(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{rule.category}</TableCell>
                    <TableCell>
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRuleStatus(rule.id)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => deleteRule(rule.id)}>
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

        <Card>
          <CardHeader>
            <CardTitle>Chatbot Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ruleLimitations.map((limitation) => (
                <div key={limitation.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                  <Checkbox checked={limitation.enabled} onCheckedChange={() => toggleLimitation(limitation.id)} className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">{limitation.name}</div>
                    <div className="text-sm text-muted-foreground">{limitation.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              <Save className="mr-2 w-4 h-4" />
              Save Limitations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminChatbotRulesPage;