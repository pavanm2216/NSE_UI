import { useState, useMemo } from 'react';
import transactionData from '../../transation.json';

interface Transaction {
  txnType: string;
  purchaseDate: string;
  schemeName: string;
  purchaseValue: number;
  currentValue: number;
  gain: number;
  balanceUnits: number;
  nav: number;
  currentNav: number;
}

const TransactionGrouper = () => {
  const [groupBy, setGroupBy] = useState<'txnType' | 'scheme' | 'date'>('txnType');

  const transactions = useMemo(() => {
    const allTransactions: Transaction[] = [];
    transactionData.result.data.forEach((applicant: any) => {
      applicant.data.forEach((category: any) => {
        category.data.forEach((fund: any) => {
          fund.data.forEach((txn: any) => {
            allTransactions.push(txn);
          });
        });
      });
    });
    return allTransactions;
  }, []);

  const groupedData = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach((txn) => {
      let key = '';
      if (groupBy === 'txnType') {
        key = txn.txnType;
      } else if (groupBy === 'scheme') {
        key = txn.schemeName;
      } else {
        key = new Date(txn.purchaseDate).getFullYear().toString();
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(txn);
    });

    return groups;
  }, [transactions, groupBy]);

  const calculateTotals = (txns: Transaction[]) => {
    return txns.reduce(
      (acc, txn) => ({
        count: acc.count + 1,
        purchaseValue: acc.purchaseValue + txn.purchaseValue,
        currentValue: acc.currentValue + txn.currentValue,
        gain: acc.gain + txn.gain,
      }),
      { count: 0, purchaseValue: 0, currentValue: 0, gain: 0 }
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaction Grouper</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setGroupBy('txnType')}
            className={`px-4 py-2 rounded ${
              groupBy === 'txnType' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            By Transaction Type
          </button>
          <button
            onClick={() => setGroupBy('scheme')}
            className={`px-4 py-2 rounded ${
              groupBy === 'scheme' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            By Scheme
          </button>
          <button
            onClick={() => setGroupBy('date')}
            className={`px-4 py-2 rounded ${
              groupBy === 'date' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            By Year
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedData).map(([key, txns]) => {
          const totals = calculateTotals(txns);
          const returnPercent = ((totals.gain / totals.purchaseValue) * 100).toFixed(2);

          return (
            <div key={key} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{key}</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {totals.count} transactions
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Purchase Value</p>
                  <p className="text-lg font-semibold">₹{totals.purchaseValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-lg font-semibold">₹{totals.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gain/Loss</p>
                  <p className={`text-lg font-semibold ${totals.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{totals.gain.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Return %</p>
                  <p className={`text-lg font-semibold ${parseFloat(returnPercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {returnPercent}%
                  </p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View {totals.count} transactions
                </summary>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-right">Units</th>
                        <th className="px-4 py-2 text-right">NAV</th>
                        <th className="px-4 py-2 text-right">Purchase</th>
                        <th className="px-4 py-2 text-right">Current</th>
                        <th className="px-4 py-2 text-right">Gain</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txns.map((txn, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{new Date(txn.purchaseDate).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{txn.txnType}</td>
                          <td className="px-4 py-2 text-right">{txn.balanceUnits.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₹{txn.nav.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">₹{txn.purchaseValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-2 text-right">₹{txn.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          <td className={`px-4 py-2 text-right ${txn.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{txn.gain.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionGrouper;
