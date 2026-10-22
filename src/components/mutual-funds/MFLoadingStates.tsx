import React from 'react';
import { AlertCircle, RefreshCw, Loader } from 'lucide-react';

interface MFLoadingStateProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const MFLoadingState: React.FC<MFLoadingStateProps> = ({ isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 mb-4">
            <Loader className="w-8 h-8 text-[#11B5E4] animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mt-4">Loading mutual funds...</h3>
          <p className="text-sm text-gray-500 mt-2">Fetching latest schemes from STARMF</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-8">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-900">Unable to load mutual fund schemes</h3>
            <p className="text-sm text-rose-800 mt-2">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const MFEmptyState: React.FC = () => (
  <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
    <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
    <p className="mt-4 text-lg font-semibold text-gray-600">No mutual fund schemes found</p>
    <p className="mt-2 text-sm text-gray-500">Please try again later</p>
  </div>
);
