import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Cell, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const portfolioStats = [
  { label: 'Total Value', value: '₹24,85,000', change: '+12.5%', trend: 'up', icon: Wallet },
  { label: 'Invested', value: '₹20,00,000', change: '+₹2,00,000', trend: 'up', icon: Briefcase },
  { label: 'Returns', value: '₹4,85,000', change: '+24.25%', trend: 'up', icon: TrendingUp },
  { label: 'XIRR', value: '15.8%', change: '+2.3%', trend: 'up', icon: Target },
];

const holdings = [
  { name: 'HDFC Flexi Cap Fund', type: 'Mutual Fund', value: '₹8,50,000', returns: '+18.5%', allocation: 34 },
  { name: 'SBI Blue Chip Fund', type: 'Mutual Fund', value: '₹5,20,000', returns: '+12.3%', allocation: 21 },
  { name: 'ICICI Pru Bond Fund', type: 'Debt Fund', value: '₹4,00,000', returns: '+8.2%', allocation: 16 },
  { name: 'Govt Securities', type: 'Bonds', value: '₹3,50,000', returns: '+7.5%', allocation: 14 },
  { name: 'Fixed Deposits', type: 'Fixed Income', value: '₹3,65,000', returns: '+6.8%', allocation: 15 },
];

const allocation = [
  { category: 'Equity', percentage: 55, value: 1375000, color: '#3b82f6' },
  { category: 'Debt', percentage: 25, value: 625000, color: '#8b5cf6' },
  { category: 'Fixed Income', percentage: 15, value: 375000, color: '#f59e0b' },
  { category: 'Others', percentage: 5, value: 125000, color: '#6b7280' },
];

const chartConfig = {
  equity: { label: 'Equity', color: '#3b82f6' },
  debt: { label: 'Debt', color: '#8b5cf6' },
  fixedIncome: { label: 'Fixed Income', color: '#f59e0b' },
  others: { label: 'Others', color: '#6b7280' },
};

const performanceData = [
  { month: 'Jan', returns: 12.5, invested: 1800000 },
  { month: 'Feb', returns: 15.2, invested: 1900000 },
  { month: 'Mar', returns: 18.7, invested: 2000000 },
  { month: 'Apr', returns: 22.1, invested: 2100000 },
  { month: 'May', returns: 19.8, invested: 2200000 },
  { month: 'Jun', returns: 24.3, invested: 2300000 },
];

const recentTransactions = [
  { type: 'buy', fund: 'HDFC Flexi Cap Fund', amount: '₹25,000', date: '2024-01-20', status: 'completed' },
  { type: 'sell', fund: 'Axis Small Cap', amount: '₹15,000', date: '2024-01-18', status: 'completed' },
  { type: 'sip', fund: 'SBI Blue Chip Fund', amount: '₹10,000', date: '2024-01-15', status: 'completed' },
];

const popularAMCs = [
  { id: 'hdfc', name: 'HDFC MF', logo: '🏦', funds: 42, aum: '₹6.82L Cr', rating: 4.8 },
  { id: 'icici', name: 'ICICI Pru', logo: '🏛️', funds: 38, aum: '₹5.94L Cr', rating: 4.7 },
  { id: 'sbi', name: 'SBI MF', logo: '🏢', funds: 35, aum: '₹5.12L Cr', rating: 4.6 },
  { id: 'axis', name: 'Axis MF', logo: '🔵', funds: 28, aum: '₹2.41L Cr', rating: 4.5 },
  { id: 'mirae', name: 'Mirae Asset', logo: '🌏', funds: 22, aum: '₹1.98L Cr', rating: 4.7 },
  { id: 'kotak', name: 'Kotak MF', logo: '🔶', funds: 31, aum: '₹3.72L Cr', rating: 4.6 },
];

const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investment Dashboard</h1>
          <p className="text-muted-foreground">Track and grow your wealth</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/portfolio">
              <PieChart className="mr-2 w-4 h-4" />
              Portfolio
            </Link>
          </Button>
          <Button className="gradient-primary text-primary-foreground" asChild>
            <Link to="/dashboard/invest">
              Invest Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioStats.map((stat, index) => (
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
                    <div className={`flex items-center gap-1 text-xs mt-1 ${
                      stat.trend === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
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

      {/* Popular AMCs */}
      <Card>
        <CardHeader>
          <CardTitle>Popular AMCs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularAMCs.map((amc) => (
              <motion.div
                key={amc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{amc.logo}</div>
                <p className="font-semibold text-sm text-center">{amc.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{amc.funds} funds</p>
                <p className="text-xs text-success font-medium mt-1">{amc.aum}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs font-medium">{amc.rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Holdings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/portfolio">View Details</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{holding.name}</p>
                        <Badge variant="secondary" className="text-xs">{holding.type}</Badge>
                      </div>
                      <Progress value={holding.allocation} className="h-1.5 mt-2" />
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold number-display">{holding.value}</p>
                      <p className="text-sm text-success">{holding.returns}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Allocation */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <RechartsPieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        `₹${(Number(value) / 100000).toFixed(1)}L`, 
                        name
                      ]}
                    />} 
                  />
                </RechartsPieChart>
              </ChartContainer>
              <div className="space-y-3 mt-4">
                {allocation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    name === 'returns' ? `${value}%` : `₹${(Number(value) / 100000).toFixed(1)}L`,
                    name === 'returns' ? 'Returns' : 'Invested'
                  ]}
                />} 
              />
              <Bar dataKey="returns" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'buy' ? 'bg-success/10' : 
                  tx.type === 'sell' ? 'bg-destructive/10' : 'bg-info/10'
                }`}>
                  {tx.type === 'buy' ? (
                    <ArrowUpRight className="w-5 h-5 text-success" />
                  ) : tx.type === 'sell' ? (
                    <ArrowDownRight className="w-5 h-5 text-destructive" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-info" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">{tx.fund}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold">{tx.amount}</span>
                    <span className="text-xs text-muted-foreground">{tx.date}</span>
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

export default InvestorDashboard;