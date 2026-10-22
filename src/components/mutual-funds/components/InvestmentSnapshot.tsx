import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvestmentSnapshot } from '@/mutualfunds/services/investwellService';
import type { InvestmentSnapshotItem } from '@/mutualfunds/types/investwell';

const LABEL_MAP: Record<string, string> = {
  openingBalance: 'Opening Balance',
  purchaseValue: 'Purchase Value',
  switchIn: 'Switch In',
  switchOut: 'Switch Out',
  dividend: 'Dividend',
  redemptionAmount: 'Redemption',
  netAddition: 'Net Addition',
  currentValue: 'Current Value',
  gain: 'Gain / Loss',
  XIRR: 'XIRR (%)',
};

const fmt = (name: string, val: number) =>
  name === 'XIRR' ? `${val.toFixed(2)}%` : `₹${val.toLocaleString('en-IN')}`;

interface Props {
  token: string;
  pan: string;
  fromDate?: string;
  toDate?: string;
}

export default function InvestmentSnapshot({ token, pan, fromDate, toDate }: Props) {
  const [data, setData] = useState<InvestmentSnapshotItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !pan) return;
    setLoading(true);
    setError(null);
    getInvestmentSnapshot(
      token,
      pan,
      fromDate ?? '2000-01-01',
      toDate ?? new Date().toISOString().split('T')[0]
    )
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, pan, fromDate, toDate]);

  if (loading) return <p className="text-sm text-muted-foreground py-4">Loading snapshot…</p>;
  if (error) return <p className="text-sm text-destructive py-4">Error: {error}</p>;
  if (!data.length) return null;

  const current = data.find((d) => d.name === 'currentValue');
  const gain = data.find((d) => d.name === 'gain');
  const xirr = data.find((d) => d.name === 'XIRR');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Investment Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Current Value', item: current },
            { label: 'Gain / Loss', item: gain },
            { label: 'XIRR', item: xirr },
          ].map(({ label, item }) => (
            <div key={label} className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`font-bold text-sm ${
                item?.name === 'gain' && item.total < 0 ? 'text-destructive' : 'text-foreground'
              }`}>
                {item ? fmt(item.name, item.total) : '—'}
              </p>
            </div>
          ))}
        </div>

        {/* Full breakdown table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-2 font-medium">Metric</th>
                <th className="text-right py-2 font-medium">Total</th>
                <th className="text-right py-2 font-medium">Equity</th>
                <th className="text-right py-2 font-medium">Hybrid</th>
                <th className="text-right py-2 font-medium">Other</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.name} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2">{LABEL_MAP[row.name] ?? row.name}</td>
                  <td className={`text-right py-2 tabular-nums font-medium ${
                    row.name === 'gain' && row.total < 0 ? 'text-destructive' : ''
                  }`}>
                    {fmt(row.name, row.total)}
                  </td>
                  <td className="text-right py-2 tabular-nums text-muted-foreground">{fmt(row.name, row.equity)}</td>
                  <td className="text-right py-2 tabular-nums text-muted-foreground">{fmt(row.name, row.hybridValue)}</td>
                  <td className="text-right py-2 tabular-nums text-muted-foreground">{fmt(row.name, row.other)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
