import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CustomerDashboard from './CustomerDashboard';
import InvestorDashboard from './InvestorDashboard';
import BrokerDashboard from './BrokerDashboard';
import ConsultantDashboard from './ConsultantDashboard';
import AdminDashboard from './admin/AdminDashboard';
import AgentDashboard from './agent/AgentDashboard';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'customer';

  switch (role) {
    case 'investor':
      return <InvestorDashboard />;
    case 'broker':
      return <BrokerDashboard />;
    case 'consultant':
      return <ConsultantDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'dsa':
      return <AgentDashboard />;
    case 'riskCompliance':
    case 'riskCompliance2':
      return <Navigate to="/dashboard/risk-compliance" replace />;
    default:
      return <CustomerDashboard />;
  }
};

export default DashboardHome;
