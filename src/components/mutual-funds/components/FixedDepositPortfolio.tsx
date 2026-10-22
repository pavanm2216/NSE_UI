import { useState, useMemo, useEffect } from 'react';
import { getClientTransactions } from '@/mutualfunds/services/investwellService';
import { getOrFetchAggregatorToken } from '@/mutualfunds/services/investwellAuthService';

interface FDTransaction {
  fixedAssetTxnid: string;
  investorName: string;
  fixedAssetName: string;
  scheme: string;
  startDate: string;
  endDate: string;
  month: number;
  amount: number;
  rateOfInterest: number;
  fdType: string;
  refNo: string;
  paymentDetails?: { bank?: string; chequeFDRNo?: string };
  remarks?: string;
}

interface Props {
  token?: string;
  pan?: string;
  isRunning?: boolean;
}

const DEFAULT_PAN = (import.meta.env.VITE_DEMO_PAN_2 as string)?.trim() || 'DYUAS7676T';

const FixedDepositPortfolio = ({ token: tokenProp, pan: panProp, isRunning = true }: Props) => {
  const pan = panProp || DEFAULT_PAN;
  const [data, setData] = useState<FDTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'maturity' | 'interest' | 'value'>('maturity');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      const token = tokenProp || await getOrFetchAggregatorToken();
      return getClientTransactions(token, pan, isRunning);
    };
    fetchData()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [tokenProp, pan, isRunning]);

  const fdTypes = useMemo(() => {
    const types = new Set(data.map(fd => fd.fdType).filter(Boolean));
    return ['all', ...Array.from(types)];
  }, [data]);

  const filteredData = useMemo(() => {
    let filtered = filterType === 'all' ? data : data.filter(fd => fd.fdType === filterType);
    return filtered.sort((a, b) => {
      if (sortBy === 'maturity') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      if (sortBy === 'interest') return b.rateOfInterest - a.rateOfInterest;
      return b.amount - a.amount;
    });
  }, [data, filterType, sortBy]);

  const getMaturityStatus = (endDate: string) => {
    const diffDays = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
    if (diffDays < 0) return { status: 'Matured', color: 'bg-gray-500' };
    if (diffDays <= 30) return { status: 'Maturing Soon', color: 'bg-red-500' };
    if (diffDays <= 90) return { status: 'Due in 3 months', color: 'bg-yellow-500' };
    return { status: 'Active', color: 'bg-green-500' };
  };

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p className="text-gray-500">Loading Fixed Deposits...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><p className="text-red-500">Error: {error}</p></div>;

  const totalInvested = data.reduce((s, fd) => s + fd.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fixed Deposit Portfolio</h1>
          <p className="text-gray-600">Manage and track your fixed deposits</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total FDs</p>
            <p className="text-2xl font-bold text-blue-600">{data.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <p className="text-2xl font-bold text-green-600">{isRunning ? 'Running' : 'All'}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {fdTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="maturity">Maturity Date</option>
              <option value="interest">Interest Rate</option>
              <option value="value">Investment Value</option>
            </select>
          </div>
        </div>

        {/* FD Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredData.map(fd => {
            const maturity = getMaturityStatus(fd.endDate);
            return (
              <div key={fd.fixedAssetTxnid} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{fd.fixedAssetName}</h3>
                    <span className={`${maturity.color} text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2`}>
                      {maturity.status}
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm">Ref: {fd.refNo}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investment</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(fd.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                      <p className="text-lg font-semibold text-green-600">{fd.rateOfInterest}% p.a.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(fd.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maturity Date:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(fd.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tenure:</span>
                      <span className="text-sm font-medium text-gray-900">{fd.month} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">FD Type:</span>
                      <span className="text-sm font-medium text-gray-900">{fd.fdType}</span>
                    </div>
                    {fd.paymentDetails?.bank && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bank:</span>
                        <span className="text-sm font-medium text-gray-900">{fd.paymentDetails.bank}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No fixed deposits found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedDepositPortfolio;
