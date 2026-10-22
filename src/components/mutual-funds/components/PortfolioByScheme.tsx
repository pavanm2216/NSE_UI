import { useState, useEffect } from 'react';
import axios from 'axios';

interface SchemeData {
  changePercent: number;
  pan: string;
  txnType: string;
  purchaseDate: string;
  currentNav: number;
  fundid: string;
  fundName: string;
  folioid: string;
  appid: string;
  applicantName: string;
  objectiveName: string;
  dueDiligence: string;
  objectiveid: string;
  schemeName: string;
  isinNo: string;
  category2: string;
  schid: string;
  folioNo: string;
  comments: string | null;
  arnNo: string;
  matDate: string | null;
  nav: number;
  purchaseValue: number;
  currentValue: number;
  balanceUnits: number;
  dividend: number;
  avgHoldingDays: number;
  gain: number;
  uccNumber: string;
  lastTxnArnid: string;
  iinNo: string | null;
  canNumber: string | null;
  currentNavDate: string;
  portfolioObjective: string;
  dematAccount: string;
  avgCost: number;
  CAGR: number;
  currentAmount: number;
  absoluteReturn: number;
  oneDayChange: number;
}

interface Summary {
  purchaseValue: number;
  currentValue: number;
  balanceUnits: number | null;
  dividend: number;
  avgHoldingDays: number;
  gain: number;
  CAGR: number;
  avgCost: number;
  currentPrice: number;
  oneDayChange: number;
  changePercent: number;
  absoluteReturn: number;
}

interface PortfolioResponse {
  status: number;
  message: string;
  result: {
    data: SchemeData[];
    summary: Summary;
  };
}

const PortfolioByScheme = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded parameters
  const API_CONFIG = {
    baseURL: 'https://demo.investwell.io/api/aggregator/reports',
    token: 'cc9f293834493945e98b3b6902d705f98b8744ba1c2813f6d8881d445f6e866e',
    pan: 'CGXPK2379F',
    endDate: '2022-09-11',
    group: 'schid'
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = JSON.stringify([
        { endDate: API_CONFIG.endDate },
        { pan: API_CONFIG.pan }
      ]);

      const response = await axios.get<PortfolioResponse>(
        `${API_CONFIG.baseURL}/getPortfolioReturns`,
        {
          params: {
            filters,
            group: API_CONFIG.group,
            token: API_CONFIG.token
          }
        }
      );

      console.log('✅ Portfolio Data:', response.data);
      setPortfolioData(response.data);
    } catch (err: any) {
      console.error('❌ API Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Group data by scheme name
  const groupedByScheme = portfolioData?.result.data.reduce((acc, item) => {
    const schemeName = item.schemeName;
    if (!acc[schemeName]) {
      acc[schemeName] = [];
    }
    acc[schemeName].push(item);
    return acc;
  }, {} as Record<string, SchemeData[]>);

  const calculateSchemeTotal = (schemes: SchemeData[]) => {
    return schemes.reduce(
      (acc, scheme) => ({
        purchaseValue: acc.purchaseValue + scheme.purchaseValue,
        currentValue: acc.currentValue + scheme.currentValue,
        gain: acc.gain + scheme.gain,
        balanceUnits: acc.balanceUnits + scheme.balanceUnits,
      }),
      { purchaseValue: 0, currentValue: 0, gain: 0, balanceUnits: 0 }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold text-xl mb-2">⚠️ Error Loading Data</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPortfolioData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No portfolio data available</p>
            <button
              onClick={fetchPortfolioData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summary = portfolioData.result.summary;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio by Scheme</h1>
          <p className="text-gray-600">
            PAN: <span className="font-semibold">{API_CONFIG.pan}</span> | 
            Date: <span className="font-semibold">{formatDate(API_CONFIG.endDate)}</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.purchaseValue)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Current Value</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.currentValue)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Total Gain</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.gain)}</p>
            <p className="text-xs text-green-500 mt-1">
              {summary.absoluteReturn.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">CAGR</p>
            <p className="text-2xl font-bold text-purple-600">{summary.CAGR.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              Avg {summary.avgHoldingDays.toFixed(0)} days
            </p>
          </div>
        </div>

        {/* One Day Change Banner */}
        <div className={`mb-6 p-4 rounded-lg ${summary.oneDayChange >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">One Day Change</span>
            <div className="text-right">
              <span className={`text-lg font-bold ${summary.oneDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.oneDayChange)}
              </span>
              <span className={`ml-2 text-sm ${summary.oneDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({summary.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-6">
          {groupedByScheme && Object.entries(groupedByScheme).map(([schemeName, schemes]) => {
            const schemeTotal = calculateSchemeTotal(schemes);
            const returnPercent = ((schemeTotal.gain / schemeTotal.purchaseValue) * 100).toFixed(2);
            const firstScheme = schemes[0];

            return (
              <div key={schemeName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Scheme Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{schemeName}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-blue-800/30 px-2 py-1 rounded">
                          {firstScheme.fundName}
                        </span>
                        <span className="bg-blue-800/30 px-2 py-1 rounded">
                          {firstScheme.objectiveName}
                        </span>
                        <span className="bg-blue-800/30 px-2 py-1 rounded">
                          ISIN: {firstScheme.isinNo}
                        </span>
                      </div>
                    </div>
                    <span className="bg-blue-800/50 px-3 py-1 rounded-full text-sm whitespace-nowrap ml-4">
                      {schemes.length} {schemes.length === 1 ? 'Transaction' : 'Transactions'}
                    </span>
                  </div>
                </div>

                {/* Scheme Summary */}
                <div className="p-6 border-b border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investment</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(schemeTotal.purchaseValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Value</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(schemeTotal.currentValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gain/Loss</p>
                      <p className={`text-lg font-semibold ${schemeTotal.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(schemeTotal.gain)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Returns</p>
                      <p className={`text-lg font-semibold ${parseFloat(returnPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {returnPercent}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <details className="group">
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      View Transaction Details
                    </span>
                    <svg className="w-5 h-5 text-blue-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  
                  <div className="px-6 pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-y border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">Folio</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">Units</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">NAV</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">Purchase</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">Current</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">Gain</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">CAGR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {schemes.map((scheme, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{formatDate(scheme.purchaseDate)}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                  {scheme.txnType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">{scheme.folioNo}</td>
                              <td className="px-4 py-3 text-right">{scheme.balanceUnits.toFixed(3)}</td>
                              <td className="px-4 py-3 text-right">₹{scheme.currentNav.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">{formatCurrency(scheme.purchaseValue)}</td>
                              <td className="px-4 py-3 text-right text-blue-600 font-medium">
                                {formatCurrency(scheme.currentValue)}
                              </td>
                              <td className={`px-4 py-3 text-right font-medium ${scheme.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(scheme.gain)}
                              </td>
                              <td className="px-4 py-3 text-right text-purple-600 font-medium">
                                {scheme.CAGR.toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Total Units:</span>
                        <span className="ml-2 font-semibold">{schemeTotal.balanceUnits.toFixed(3)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Current NAV:</span>
                        <span className="ml-2 font-semibold">₹{firstScheme.currentNav.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Cost:</span>
                        <span className="ml-2 font-semibold">₹{firstScheme.avgCost.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">One Day Change:</span>
                        <span className={`ml-2 font-semibold ${firstScheme.oneDayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(firstScheme.oneDayChange)}
                        </span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PortfolioByScheme;
