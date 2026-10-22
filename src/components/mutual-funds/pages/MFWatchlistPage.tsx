import React from 'react';
import { Search } from 'lucide-react';

const MFWatchlistPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Watchlist</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Watchlist coming soon...</p>
      </div>
    </div>
  );
};

export default MFWatchlistPage;
