import { useState, useEffect } from 'react';
import { portfolioAPI, setAuthToken } from '../services/portfolioAPI';

interface PortfolioData {
  returns: any;
  detailed: any;
  otherAssets: any;
  errors: {
    returns: Error | null;
    detailed: Error | null;
    otherAssets: Error | null;
  };
}

const PortfolioDashboard = () => {
  const [pan, setPan] = useState('ADNPR9760N');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [token, setToken] = useState('5391692c0ed9eba832b6a8d8ce4ecdeb68bb836255798ff7c44d2c3a3c79413f');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<'returns' | 'detailed' | 'otherAssets'>('returns');

  // Update token when changed
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const fetchPortfolioData = async () => {
    if (!pan || !endDate || !token) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = await portfolioAPI.getAllPortfolioData(pan, endDate);
      setPortfolioData(data);
      console.log('Portfolio Data:', data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      alert('Failed to fetch portfolio data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const renderErrorMessage = (error: Error | null) => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="text-red-800 font-semibold mb-2">⚠️ Error</h4>
        <p className="text-red-600 text-sm">{error.message}</p>
        <details className="mt-2">
          <summary className="text-xs text-red-500 cursor-pointer">Show details</summary>
          <pre className="text-xs text-red-700 mt-2 overflow-auto">{error.stack}</pre>
        </details>
      </div>
    );
  };

  const renderData = (data: any, title: string) => {
    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available. Click "Fetch Portfolio Data" to load.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[600px]">
          <pre className="text-xs text-gray-700">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio API Dashboard</h1>
          <p className="text-gray-600">Fetch and view portfolio data from InvestWell API</p>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ADNPR9760N"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auth Token *
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter token"
              />
            </div>
          </div>

          <button
            onClick={fetchPortfolioData}
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              '🔄 Fetch Portfolio Data'
            )}
          </button>
        </div>

        {/* Results */}
        {portfolioData && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-1 p-2">
                <button
                  onClick={() => setActiveTab('returns')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'returns'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Portfolio Returns
                  {portfolioData.errors.returns && ' ⚠️'}
                </button>
                <button
                  onClick={() => setActiveTab('detailed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'detailed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Detailed Returns
                  {portfolioData.errors.detailed && ' ⚠️'}
                </button>
                <button
                  onClick={() => setActiveTab('otherAssets')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'otherAssets'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Other Assets
                  {portfolioData.errors.otherAssets && ' ⚠️'}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'returns' && (
                <>
                  {renderErrorMessage(portfolioData.errors.returns)}
                  {renderData(portfolioData.returns, 'Portfolio Returns')}
                </>
              )}
              
              {activeTab === 'detailed' && (
                <>
                  {renderErrorMessage(portfolioData.errors.detailed)}
                  {renderData(portfolioData.detailed, 'Detailed Portfolio Returns')}
                </>
              )}
              
              {activeTab === 'otherAssets' && (
                <>
                  {renderErrorMessage(portfolioData.errors.otherAssets)}
                  {renderData(portfolioData.otherAssets, 'Other Assets Portfolio')}
                </>
              )}
            </div>
          </div>
        )}

        {/* API Debugging Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">🔍 Debugging Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Check the browser console for detailed API request/response logs</li>
            <li>Verify your token is valid and not expired</li>
            <li>Ensure the PAN number exists in the system</li>
            <li>Date format should be YYYY-MM-DD</li>
            <li>Check if the API endpoint URLs are correct</li>
            <li>Verify CORS settings if running locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
