import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const reports = [
  {
    title: 'Portfolio PDF Report',
    desc: 'Complete snapshot of your current holdings, NAV, returns and allocation.',
    icon: '📊',
    badge: 'Popular',
    badgeColor: 'bg-blue-100 text-blue-700',
    lastGenerated: '15 Jun 2025',
  },
  {
    title: 'Capital Gain Report',
    desc: 'Detailed LTCG/STCG breakdown for tax filing. Includes realized and unrealized gains.',
    icon: '📈',
    badge: 'Tax Ready',
    badgeColor: 'bg-green-100 text-green-700',
    lastGenerated: '10 Jun 2025',
  },
  {
    title: 'Statement of Account',
    desc: 'Full transaction history with folio-wise details for the selected period.',
    icon: '🧾',
    badge: '',
    badgeColor: '',
    lastGenerated: '01 Jun 2025',
  },
  {
    title: 'Investor Summary Report',
    desc: 'Consolidated view across all investors (self, spouse, child) in your family.',
    icon: '👨‍👩‍👧',
    badge: 'New',
    badgeColor: 'bg-purple-100 text-purple-700',
    lastGenerated: '28 May 2025',
  },
  {
    title: 'SIP Performance Report',
    desc: 'Track all your active and paused SIPs with performance metrics.',
    icon: '🔄',
    badge: '',
    badgeColor: '',
    lastGenerated: '20 May 2025',
  },
  {
    title: 'XIRR & CAGR Report',
    desc: 'Annualised return analysis across all your mutual fund investments.',
    icon: '📉',
    badge: '',
    badgeColor: '',
    lastGenerated: '15 May 2025',
  },
];

const fyOptions = ['FY 2024-25', 'FY 2023-24', 'FY 2022-23'];

const MFReportsPage: React.FC = () => {
  const [fy, setFy] = useState('FY 2024-25');
  const [fromDate, setFromDate] = useState('2024-04-01');
  const [toDate, setToDate] = useState('2025-03-31');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">Download and preview your investment reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Financial Year</label>
              <select value={fy} onChange={e => setFy(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 bg-background w-40">
                {fyOptions.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">From Date</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 bg-background" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">To Date</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="text-sm border rounded-lg px-3 py-2 bg-background" />
            </div>
            <Button className="bg-[#0D3B66] text-white hover:bg-[#11B5E4] transition-colors gap-2">
              <Filter className="w-4 h-4" /> Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {reports.map((report, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{report.icon}</span>
                  {report.badge && (
                    <Badge className={`text-xs ${report.badgeColor}`}>{report.badge}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-muted-foreground flex-1 mb-4">{report.desc}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Last: {report.lastGenerated}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs">
                    <Eye className="w-3 h-3" /> Preview
                  </Button>
                  <Button size="sm" className="flex-1 gap-1 text-xs bg-[#0D3B66] text-white hover:bg-[#11B5E4] transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Downloads */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#11B5E4]" /> Recent Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: 'Portfolio_Report_Jun2025.pdf', size: '1.2 MB', date: '15 Jun 2025' },
              { name: 'CapitalGain_FY2024-25.pdf', size: '856 KB', date: '10 Jun 2025' },
              { name: 'Statement_Apr-Jun2025.pdf', size: '2.1 MB', date: '01 Jun 2025' },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#0D3B66]" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size} · {file.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1 text-xs">
                  <Download className="w-3 h-3" /> Re-download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MFReportsPage;
