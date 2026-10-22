import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Eye,
  Loader2,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreatePaymentRefundMutation,
  useGetAdminPaymentsQuery,
  useGetPaymentDetailQuery,
  useSyncPaymentRefundsMutation,
} from '@/redux/services/adminApi';
import { formatINR } from '@/constants/membership.constants';
import { getMutationErrorMessage } from '@/utils/rtkError';

const statusBadgeClass = (status: string) => {
  const normalized = status.toUpperCase();
  if (normalized === 'PAID') return 'bg-success/10 text-success';
  if (normalized === 'REFUNDED') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
  if (['FAILED', 'EXPIRED'].includes(normalized)) return 'bg-destructive/10 text-destructive';
  if (['CANCELLED', 'USER_DROPPED'].includes(normalized)) return 'bg-warning/10 text-warning';
  if (['PARTIAL_REFUND', 'REFUND_PENDING'].includes(normalized)) return 'bg-amber-100 text-amber-800';
  return 'bg-muted text-muted-foreground';
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b border-border/60 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right break-all">{value ?? '—'}</span>
  </div>
);

const AdminPaymentsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNote, setRefundNote] = useState('');
  const [refundSpeed, setRefundSpeed] = useState<'STANDARD' | 'INSTANT'>('STANDARD');
  const [refundError, setRefundError] = useState('');

  const { data, isLoading, isError, refetch } = useGetAdminPaymentsQuery({
    page,
    limit: 15,
    status: statusFilter || undefined,
  });

  const {
    data: detail,
    isLoading: detailLoading,
    isFetching: detailFetching,
    refetch: refetchDetail,
  } = useGetPaymentDetailQuery(selectedOrderId || '', { skip: !selectedOrderId });

  const [createRefund, { isLoading: refunding }] = useCreatePaymentRefundMutation();
  const [syncRefunds, { isLoading: syncing }] = useSyncPaymentRefundsMutation();

  useEffect(() => {
    if (detail?.transaction.refundable_amount) {
      setRefundAmount(String(detail.transaction.refundable_amount));
    }
  }, [detail?.transaction.refundable_amount, selectedOrderId]);

  const filters = ['', 'PAID', 'PENDING', 'FAILED', 'USER_DROPPED', 'REFUNDED'];

  const handleOpenDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRefundError('');
    setRefundNote('');
    setRefundSpeed('STANDARD');
  };

  const handleCloseDetail = () => {
    setSelectedOrderId(null);
    setRefundError('');
  };

  const handleSyncRefunds = async () => {
    if (!selectedOrderId) return;
    setRefundError('');
    try {
      await syncRefunds(selectedOrderId).unwrap();
      await refetchDetail();
      refetch();
    } catch (err: unknown) {
      setRefundError(getMutationErrorMessage(err, 'Failed to sync refund status from Cashfree.'));
    }
  };

  const handleRefund = async () => {
    if (!selectedOrderId || !detail) return;
    setRefundError('');

    const amount = Number(refundAmount);
    if (!amount || amount <= 0) {
      setRefundError('Enter a valid refund amount.');
      return;
    }

    try {
      await createRefund({
        order_id: selectedOrderId,
        refund_amount: amount,
        refund_note: refundNote || undefined,
        refund_speed: refundSpeed,
      }).unwrap();
      await refetchDetail();
      refetch();
      setRefundNote('');
    } catch (err: unknown) {
      setRefundError(getMutationErrorMessage(err, 'Refund failed.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="w-8 h-8" />
            Payment Transactions
          </h1>
          <p className="text-muted-foreground">
            View full Cashfree transaction details and process refunds
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter || 'all'}
            size="sm"
            variant={statusFilter === filter ? 'default' : 'outline'}
            onClick={() => {
              setStatusFilter(filter);
              setPage(1);
            }}
          >
            {filter || 'All'}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {data ? `${data.pagination.total} transactions` : 'Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <p className="text-center text-destructive py-8">
              Failed to load payments. Ensure client API is running on port 8000.
            </p>
          )}

          {!isLoading && !isError && data && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 pr-4">Order ID</th>
                      <th className="py-3 pr-4">Customer</th>
                      <th className="py-3 pr-4">Plan</th>
                      <th className="py-3 pr-4">Amount</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 pr-4">Refund</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                          No payment transactions found.
                        </td>
                      </tr>
                    ) : (
                      data.items.map((payment) => (
                        <tr key={payment.order_id} className="border-b last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs">{payment.order_id}</td>
                          <td className="py-3 pr-4">
                            <div className="font-medium">{payment.user_name || '—'}</div>
                            <div className="text-xs text-muted-foreground">{payment.user_email}</div>
                          </td>
                          <td className="py-3 pr-4">{payment.plan_name || payment.plan_code || '—'}</td>
                          <td className="py-3 pr-4 font-semibold">{formatINR(payment.amount)}</td>
                          <td className="py-3 pr-4">
                            <Badge className={statusBadgeClass(payment.payment_status)}>
                              {payment.payment_status}
                            </Badge>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="text-xs">
                              <Badge variant="outline" className={statusBadgeClass(payment.refund_status || 'NONE')}>
                                {payment.refund_status || 'NONE'}
                              </Badge>
                              {(payment.refunded_amount || 0) > 0 && (
                                <p className="text-muted-foreground mt-1">
                                  {formatINR(payment.refunded_amount || 0)} refunded
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {formatDate(payment.payment_time || payment.created_at)}
                          </td>
                          <td className="py-3">
                            <Button size="sm" variant="outline" onClick={() => handleOpenDetail(payment.order_id)}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {data.pagination.total_pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.total_pages}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.pagination.total_pages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrderId} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>

          {(detailLoading || detailFetching) && !detail ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : detail ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Status is synced from Cashfree when you open this view. Use sync if DB still shows PENDING.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncRefunds}
                  disabled={syncing}
                >
                  {syncing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync from Cashfree
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order & Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <DetailRow label="Order ID" value={detail.transaction.order_id} />
                    <DetailRow label="CF Order ID" value={detail.transaction.cashfree_order_id} />
                    <DetailRow label="CF Payment ID" value={detail.transaction.cashfree_payment_id} />
                    <DetailRow label="Session ID" value={detail.transaction.payment_session_id} />
                    <DetailRow label="Amount" value={formatINR(detail.transaction.amount)} />
                    <DetailRow label="Payment Status" value={
                      <Badge className={statusBadgeClass(detail.transaction.payment_status)}>
                        {detail.transaction.payment_status}
                      </Badge>
                    } />
                    <DetailRow label="Payment Method" value={detail.transaction.payment_method} />
                    <DetailRow label="Paid At" value={formatDate(detail.transaction.payment_time)} />
                    <DetailRow label="Created At" value={formatDate(detail.transaction.created_at)} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customer & Subscription</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <DetailRow label="Name" value={detail.customer.name} />
                    <DetailRow label="Email" value={detail.customer.email} />
                    <DetailRow label="Phone" value={detail.customer.phone} />
                    <DetailRow label="Plan" value={detail.plan?.plan_name} />
                    <DetailRow label="Plan Code" value={detail.plan?.plan_code} />
                    <DetailRow label="Subscription" value={detail.customer.subscription_status} />
                    <DetailRow label="Active Plan" value={detail.customer.active_plan_code} />
                    <DetailRow label="Sub. End" value={formatDate(detail.customer.subscription_end_date)} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Refund Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Refund Status</p>
                    <Badge className={`mt-1 ${statusBadgeClass(detail.transaction.refund_status)}`}>
                      {detail.transaction.refund_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Refunded</p>
                    <p className="font-semibold mt-1">{formatINR(detail.transaction.refunded_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Refundable Balance</p>
                    <p className="font-semibold mt-1 text-success">
                      {formatINR(detail.transaction.refundable_amount)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {detail.cashfree_order && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cashfree Order (Live)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    <DetailRow label="CF Order ID" value={detail.cashfree_order.cf_order_id} />
                    <DetailRow label="Order Status" value={detail.cashfree_order.order_status} />
                    <DetailRow label="Order Amount" value={
                      detail.cashfree_order.order_amount != null
                        ? formatINR(Number(detail.cashfree_order.order_amount))
                        : '—'
                    } />
                    <DetailRow label="Currency" value={detail.cashfree_order.order_currency} />
                    <DetailRow label="Note" value={detail.cashfree_order.order_note} />
                  </CardContent>
                </Card>
              )}

              {detail.cashfree_payments.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cashfree Payment Attempts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detail.cashfree_payments.map((payment, index) => (
                      <div key={payment.cf_payment_id || index} className="rounded-lg border p-3 space-y-0">
                        <DetailRow label="CF Payment ID" value={payment.cf_payment_id} />
                        <DetailRow label="Status" value={payment.payment_status} />
                        <DetailRow label="Amount" value={
                          payment.payment_amount != null ? formatINR(Number(payment.payment_amount)) : '—'
                        } />
                        <DetailRow label="Method" value={payment.payment_method} />
                        <DetailRow label="Group" value={payment.payment_group} />
                        <DetailRow label="Bank Ref" value={payment.bank_reference} />
                        <DetailRow label="Auth ID" value={payment.auth_id} />
                        <DetailRow label="Message" value={payment.payment_message} />
                        <DetailRow label="Time" value={formatDate(payment.payment_time)} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {(detail.refunds.database.length > 0 || detail.refunds.cashfree.length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Refund History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detail.refunds.database.map((refund) => (
                      <div key={refund.refund_id} className="rounded-lg border p-3 space-y-0">
                        <DetailRow label="Refund ID" value={refund.refund_id} />
                        <DetailRow label="CF Refund ID" value={refund.cf_refund_id} />
                        <DetailRow label="Amount" value={formatINR(refund.refund_amount)} />
                        <DetailRow label="Status" value={
                          <Badge className={statusBadgeClass(refund.refund_status)}>{refund.refund_status}</Badge>
                        } />
                        <DetailRow label="Speed" value={refund.refund_speed} />
                        <DetailRow label="Note" value={refund.refund_note} />
                        <DetailRow label="Processed" value={formatDate(refund.processed_at)} />
                      </div>
                    ))}
                    {detail.refunds.cashfree
                      .filter((cf) => !detail.refunds.database.some((db) => db.refund_id === cf.refund_id))
                      .map((refund, index) => (
                        <div key={refund.refund_id || `cf-${index}`} className="rounded-lg border border-dashed p-3 space-y-0">
                          <p className="text-xs text-muted-foreground mb-2">Cashfree only</p>
                          <DetailRow label="Refund ID" value={refund.refund_id} />
                          <DetailRow label="CF Refund ID" value={refund.cf_refund_id} />
                          <DetailRow label="Amount" value={
                            refund.refund_amount != null ? formatINR(Number(refund.refund_amount)) : '—'
                          } />
                          <DetailRow label="Status" value={refund.refund_status} />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {detail.can_refund && (
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Initiate Refund
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="refund_amount">Refund Amount (INR)</Label>
                        <Input
                          id="refund_amount"
                          type="number"
                          min={0.01}
                          max={detail.transaction.refundable_amount}
                          step="0.01"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Max refundable: {formatINR(detail.transaction.refundable_amount)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Refund Speed</Label>
                        <Select value={refundSpeed} onValueChange={(v) => setRefundSpeed(v as 'STANDARD' | 'INSTANT')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STANDARD">Standard (3–5 days)</SelectItem>
                            <SelectItem value="INSTANT">Instant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refund_note">Refund Note</Label>
                      <Textarea
                        id="refund_note"
                        placeholder="Reason for refund (optional)"
                        value={refundNote}
                        onChange={(e) => setRefundNote(e.target.value)}
                        rows={2}
                      />
                    </div>
                    {refundError && <p className="text-sm text-destructive">{refundError}</p>}
                    <Button onClick={handleRefund} disabled={refunding} className="w-full sm:w-auto">
                      {refunding ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing Refund…
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Refund {formatINR(Number(refundAmount) || 0)}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Could not load transaction details.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentsPage;
