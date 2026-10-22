import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import NSEDashboard from './pages/dashboard/NSEDashboard';
import NSELoginPage from './pages/auth/NSELoginPage';

function LoginRedirect() {
  const location = useLocation();
  return <Navigate to="/nse-login" state={location.state} replace />;
}

function LegacyDashboardRedirect() {
  const location = useLocation();
  const section = location.pathname.replace(/^\/nse-dashboard\/?/, '') || 'explore-funds';
  return <Navigate to={`/mutual-funds/${section}${location.search}${location.hash}`} replace />;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/nse-login" replace />} />
    <Route path="/nse-login" element={<NSELoginPage showOtherOptions={false} />} />
    <Route path="/mf-login" element={<LoginRedirect />} />
    <Route path="/mutual-funds/*" element={<NSEDashboard />} />
    <Route path="/nse-dashboard/*" element={<LegacyDashboardRedirect />} />
    <Route path="*" element={<Navigate to="/mutual-funds/explore-funds" replace />} />
  </Routes>;
}
