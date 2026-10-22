import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { listOrders, cancelOrder } from '@/services/starmf/orderService';
import type { OrderListFilter } from '@/types/starmf/order.types';
import { ShoppingCart, RefreshCw, XCircle } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const TYPE_LABEL: Record<string, string> = { p: 'Purchase', r: 'Redeem', s: 'Switch' };

const MFOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OrderListFilter>({ open_close: 'o' });
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listOrders(filter);
      setOrders(res?.data?.lists ?? []);
    } catch {
      toast({ title: 'Failed to load orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async (id: number, ucc: string) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await cancelOrder(id, ucc, 'Cancelled by user');
      toast({ title: 'Order cancelled' });
      fetchOrders();
    } catch {
      toast({ title: 'Failed to cancel order', variant: 'destructive' });
    }
  };

  const filtered = orders.filter(o =>
    !search || String(o.scheme ?? '').toLowerCase().includes(search.toLowerCase()) ||
    String(o.ucc ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all orders</p>
        </div>
        <Button onClick={() => navigate('/dashboard/mf/orders/purchase')}>
          <ShoppingCart className="w-4 h-4 mr-2" /> New Order
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <Input placeholder="Search scheme / UCC..." className="w-56"
              value={search} onChange={e => setSearch(e.target.value)} />
            <Select value={filter.open_close ?? 'o'}
              onValueChange={v => setFilter(f => ({ ...f, open_close: v as 'o' | 'c' }))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="o">Open</SelectItem>
                <SelectItem value="c">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.type?.[0] ?? ''}
              onValueChange={v => setFilter(f => ({ ...f, type: v ? [v] : undefined }))}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="p">Purchase</SelectItem>
                <SelectItem value="r">Redeem</SelectItem>
                <SelectItem value="s">Switch</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchOrders} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Order ID', 'Type', 'UCC', 'Scheme', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((o, i) => {
                    const status = String(o.status ?? '').toLowerCase();
                    const type = String(o.type ?? '');
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{String(o.id ?? '-')}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{TYPE_LABEL[type] ?? type}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{String(o.ucc ?? '-')}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{String(o.scheme ?? '-')}</td>
                        <td className="px-4 py-3 text-gray-700">₹{Number(o.amount ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {String(o.status ?? '-')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{String(o.placed_at ?? '-')}</td>
                        <td className="px-4 py-3">
                          {status !== 'cancelled' && status !== 'failed' && (
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 h-7 px-2"
                              onClick={() => handleCancel(Number(o.id), String(o.ucc ?? ''))}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MFOrderListPage;
