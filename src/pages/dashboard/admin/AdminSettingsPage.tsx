import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Shield, Globe, Bell, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const settingsCards = [
  { label: 'System Health', count: '98%', color: 'bg-success', textColor: 'text-success', icon: Database },
  { label: 'Active Users', count: '1,234', color: 'bg-primary', textColor: 'text-primary', icon: Globe },
  { label: 'Security Score', count: '95%', color: 'bg-info', textColor: 'text-info', icon: Shield },
  { label: 'Notifications', count: '45', color: 'bg-warning', textColor: 'text-warning', icon: Bell },
];

const AdminSettingsPage: React.FC = () => {
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Lendrix Finance Hub',
    supportEmail: 'support@lendrix.com',
    supportPhone: '+91 1800-123-4567',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    smsNotifications: true,
    maxFileSize: '10',
    sessionTimeout: '30',
    backupFrequency: 'daily'
  });

  const [commissionSettings, setCommissionSettings] = useState({
    homeLoanRate: '1.0',
    personalLoanRate: '2.0',
    businessLoanRate: '1.5',
    carLoanRate: '1.2',
    payoutFrequency: 'monthly',
    minimumPayout: '1000'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: '90',
    loginAttempts: '5',
    sessionSecurity: true,
    ipWhitelist: false,
    auditLogging: true
  });

  const updatePlatformSetting = (key: string, value: any) => {
    setPlatformSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateCommissionSetting = (key: string, value: any) => {
    setCommissionSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSecuritySetting = (key: string, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Save className="mr-2 w-4 h-4" />
          Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {settingsCards.map((card, index) => (
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Platform Name</Label>
              <Input value={platformSettings.platformName} onChange={(e) => updatePlatformSetting('platformName', e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Support Email</Label>
                <Input value={platformSettings.supportEmail} onChange={(e) => updatePlatformSetting('supportEmail', e.target.value)} />
              </div>
              <div>
                <Label>Support Phone</Label>
                <Input value={platformSettings.supportPhone} onChange={(e) => updatePlatformSetting('supportPhone', e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Maintenance Mode</Label>
                <Switch checked={platformSettings.maintenanceMode} onCheckedChange={(checked) => updatePlatformSetting('maintenanceMode', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>User Registration</Label>
                <Switch checked={platformSettings.registrationEnabled} onCheckedChange={(checked) => updatePlatformSetting('registrationEnabled', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Verification</Label>
                <Switch checked={platformSettings.emailVerification} onCheckedChange={(checked) => updatePlatformSetting('emailVerification', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch checked={platformSettings.smsNotifications} onCheckedChange={(checked) => updatePlatformSetting('smsNotifications', checked)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Max File Size (MB)</Label>
                <Input value={platformSettings.maxFileSize} onChange={(e) => updatePlatformSetting('maxFileSize', e.target.value)} />
              </div>
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input value={platformSettings.sessionTimeout} onChange={(e) => updatePlatformSetting('sessionTimeout', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Two-Factor Authentication</Label>
                <Switch checked={securitySettings.twoFactorAuth} onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Session Security</Label>
                <Switch checked={securitySettings.sessionSecurity} onCheckedChange={(checked) => updateSecuritySetting('sessionSecurity', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>IP Whitelist</Label>
                <Switch checked={securitySettings.ipWhitelist} onCheckedChange={(checked) => updateSecuritySetting('ipWhitelist', checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Audit Logging</Label>
                <Switch checked={securitySettings.auditLogging} onCheckedChange={(checked) => updateSecuritySetting('auditLogging', checked)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Password Expiry (days)</Label>
                <Input value={securitySettings.passwordExpiry} onChange={(e) => updateSecuritySetting('passwordExpiry', e.target.value)} />
              </div>
              <div>
                <Label>Max Login Attempts</Label>
                <Input value={securitySettings.loginAttempts} onChange={(e) => updateSecuritySetting('loginAttempts', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>Home Loan Rate (%)</Label>
              <Input value={commissionSettings.homeLoanRate} onChange={(e) => updateCommissionSetting('homeLoanRate', e.target.value)} />
            </div>
            <div>
              <Label>Personal Loan Rate (%)</Label>
              <Input value={commissionSettings.personalLoanRate} onChange={(e) => updateCommissionSetting('personalLoanRate', e.target.value)} />
            </div>
            <div>
              <Label>Business Loan Rate (%)</Label>
              <Input value={commissionSettings.businessLoanRate} onChange={(e) => updateCommissionSetting('businessLoanRate', e.target.value)} />
            </div>
            <div>
              <Label>Car Loan Rate (%)</Label>
              <Input value={commissionSettings.carLoanRate} onChange={(e) => updateCommissionSetting('carLoanRate', e.target.value)} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Payout Frequency</Label>
              <Select value={commissionSettings.payoutFrequency} onValueChange={(value) => updateCommissionSetting('payoutFrequency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Minimum Payout Amount (₹)</Label>
              <Input value={commissionSettings.minimumPayout} onChange={(e) => updateCommissionSetting('minimumPayout', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;