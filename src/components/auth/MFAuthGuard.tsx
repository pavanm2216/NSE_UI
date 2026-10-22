import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { TOKEN_KEY, getOrFetchAggregatorToken } from '@/services/investwellAuthService';

const MFAuthGuard: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading');

  useEffect(() => {
    getOrFetchAggregatorToken()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('fail'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return status === 'ok' ? <Outlet /> : <Navigate to="/mf-login" replace />;
};

export default MFAuthGuard;
