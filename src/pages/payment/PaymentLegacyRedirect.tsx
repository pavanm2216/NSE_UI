import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PaymentLegacyRedirect: React.FC = () => {
  const location = useLocation();
  return (
    <Navigate to={`/dashboard${location.pathname}${location.search}`} replace />
  );
};

export default PaymentLegacyRedirect;
