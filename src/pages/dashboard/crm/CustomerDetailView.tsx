import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, TrendingUp, TrendingDown, Building2, CreditCard, PiggyBank, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  tier: string;
}

interface Props {
  customer: Customer;
  onBack: () => void;
}

const portfolioData = [
  { name: 'Mutual Funds', value: 35, color: '#0e7490' },
  { name: 'SIPs', value: 20, color: '#0891b2' },
  { name: 'Real Estate', value: 30, color: '#164e63' },
  { name: 'Loans', value: 15, color: '#67e8f9' },
];

const growthData = [
  { month: 'Jan', value: 420000 },
  { month: 'Feb', value: 480000 },
  { month: 'Mar', value: 455000 },
  { month: 'Apr', value: 530000 },
  { month: 'May', value: 610000 },
  { month: 'Jun', value: 680000 },
];

const mutualFunds = [
  { name: 'HDFC Flexi Cap Fund', type: 'Equity', status: 'Active', monthly: '₹5,000', returns: '+14.2%', positive: true },
  { name: 'SBI Blue Chip Fund', type: 'Large Cap', status: 'Active', monthly: '₹3,000', returns: '+11.8%', positive: true },
  { name: 'ICICI Balanced Advantage', type: 'Hybrid', status: 'Inactive', monthly: '₹2,000', returns: '+8.5%', positive: true },
];

const loans = [
  { name: 'Home Loan', principal: '₹45,00,000', remaining: '₹32,50,000', emi: '₹38,500', nextDate: '05 Aug 2025', status: 'Active' },
  { name: 'Car Loan', principal: '₹8,00,000', remaining: '₹3,20,000', emi: '₹14,200', nextDate: '10 Aug 2025', status: 'Active' },
];

const realEstate = [
  { name: '3BHK Apartment, Andheri', type: 'Residential', action: 'Holding', value: '₹1,20,00,000', change: '+8.3%', positive: true },
  { name: 'Commercial Plot, Pune', type: 'Commercial', action: 'Selling', value: '₹45,00,000', change: '+12.1%', positive: true },
];

const CustomerDetailView: React.FC<Props> = ({ customer, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2 text-cyan-700 hover:text-cyan-900">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-[#0c2340] to-[#0e7490] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cyan-400/30 flex items-center justify-center text-2xl font-bold border-2 border-cyan-300">
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-cyan-100">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{customer.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <Badge className="bg-cyan-400/20 text-cyan-100 border border-cyan-300 text-sm px-3 py-1">{customer.tier}</Badge>
          <Badge className={customer.status === 'Active' ? 'bg-green-500/20 text-green-200 border border-green-400' : 'bg-gray-400/20 text-gray-200 border border-gray-400'}>
            {customer.status}
          </Badge>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Portfolio', value: '₹2.1 Cr', icon: <PiggyBank className="w-5 h-5" />, color: 'text-cyan-600' },
          { label: 'Active SIPs', value: '₹8,000/mo', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600' },
          { label: 'Total EMIs', value: '₹52,700/mo', icon: <CreditCard className="w-5 h-5" />, color: 'text-orange-500' },
          { label: 'Properties', value: '2 Assets', icon: <Home className="w-5 h-5" />, color: 'text-blue-600' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${kpi.color} bg-slate-100 p-2 rounded-lg`}>{kpi.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="font-bold text-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Portfolio Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={portfolioData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {portfolioData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {portfolioData.map((d) => (
                <span key={d.name} className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                  {d.name} ({d.value}%)
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Portfolio Growth (6M)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e7490" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0e7490" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(v: number) => `₹${(v / 100000).toFixed(2)}L`} />
                <Area type="monotone" dataKey="value" stroke="#0e7490" strokeWidth={2} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mutual Funds & SIPs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-cyan-600" /> Mutual Funds & SIPs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left p-2">Fund Name</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Monthly SIP</th>
                  <th className="text-left p-2">Returns</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mutualFunds.map((f) => (
                  <tr key={f.name} className="border-b hover:bg-slate-50">
                    <td className="p-2 font-medium">{f.name}</td>
                    <td className="p-2 text-muted-foreground">{f.type}</td>
                    <td className="p-2">{f.monthly}</td>
                    <td className={`p-2 font-semibold ${f.positive ? 'text-green-600' : 'text-red-500'}`}>
                      {f.positive ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                      {f.returns}
                    </td>
                    <td className="p-2">
                      <Badge variant={f.status === 'Active' ? 'default' : 'outline'} className={f.status === 'Active' ? 'bg-[#0c2340] text-white' : ''}>
                        {f.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Loans & EMIs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="w-4 h-4 text-orange-500" /> Loans & EMIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loans.map((loan) => (
              <div key={loan.name} className="border rounded-xl p-4 bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{loan.name}</p>
                    <p className="text-xs text-muted-foreground">Principal: {loan.principal}</p>
                  </div>
                  <Badge className="bg-[#0c2340] text-white text-xs">{loan.status}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining Balance</span>
                    <span className="font-medium text-orange-600">{loan.remaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly EMI</span>
                    <span className="font-medium">{loan.emi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Payment</span>
                    <span className="font-medium text-cyan-700">{loan.nextDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real Estate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="w-4 h-4 text-blue-600" /> Investments & Real Estate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realEstate.map((prop) => (
              <div key={prop.name} className="border rounded-xl p-4 bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{prop.name}</p>
                    <p className="text-xs text-muted-foreground">{prop.type}</p>
                  </div>
                  <Badge className={
                    prop.action === 'Selling' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                    prop.action === 'Buying' ? 'bg-green-100 text-green-700 border border-green-300' :
                    'bg-blue-100 text-blue-700 border border-blue-300'
                  }>
                    {prop.action}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-bold text-slate-800">{prop.value}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Appreciation</span>
                  <span className={`font-semibold ${prop.positive ? 'text-green-600' : 'text-red-500'}`}>
                    {prop.positive ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                    {prop.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailView;
