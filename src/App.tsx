import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AuthSessionManager } from "@/components/auth/AuthSessionManager";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';

// Pages
import LandingPage from "./pages/LandingPage";
import ClientSolutionsPage from "./pages/ClientSolutionsPage";
import BorrowingPage from "./pages/BorrowingPage";
import InvestingPage from "./pages/InvestingPage";
import BusinessConsultancyPage from "./pages/BusinessConsultancyPage";
import LoginPage from "./pages/auth/LoginPage";
import MFLoginPage from "./pages/auth/MFLoginPage";
import NSELoginPage from "./pages/auth/NSELoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "./pages/onboarding/OTPVerificationPage";
import RoleSelectionPage from "./pages/onboarding/RoleSelectionPage";
import KYCUploadPage from "./pages/onboarding/KYCUploadPage";
import OrgKYCPage from "./pages/onboarding/OrgKYCPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import NotFound from "./pages/NotFound";

// Agent Dashboard Pages
import LeadsPage from "./pages/dashboard/agent/LeadsPage";
import ApplicationsPage from "./pages/dashboard/agent/ApplicationsPage";
import PayoutsPage from "./pages/dashboard/agent/PayoutsPage";
import CommissionPage from "./pages/dashboard/agent/CommissionPage";
import ReportsPage from "./pages/dashboard/agent/ReportsPage";
import HelpSupportPage from "./pages/dashboard/agent/HelpSupportPage";
import SettingsPage from "./pages/dashboard/agent/SettingsPage";

// Admin Dashboard Pages
import AdminAnalyticsPage from "./pages/dashboard/admin/AdminAnalyticsPage";
import AdminUsersPage from "./pages/dashboard/admin/AdminUsersPage";
import AdminLeadsPage from "./pages/dashboard/admin/AdminLeadsPage";
import AdminListingsPage from "./pages/dashboard/admin/AdminListingsPage";
import AdminLoansPage from "./pages/dashboard/admin/AdminLoansPage";
import AdminInvestmentsPage from "./pages/dashboard/admin/AdminInvestmentsPage";
import AdminHelpSupportPage from "./pages/dashboard/admin/AdminHelpSupportPage";
import AdminSettingsPage from "./pages/dashboard/admin/AdminSettingsPage";
import AdminChatbotRulesPage from "./pages/dashboard/admin/AdminChatbotRulesPage";
import AdminProcessPoliciesPage from "./pages/dashboard/admin/AdminProcessPoliciesPage";
import RiskCompliancePage from "./pages/dashboard/RiskCompliancePage";
import PartnerSubmissionsAdmin from "./pages/dashboard/PartnerSubmissionsAdmin";
import MarketplaceSubmissionsAdmin from "./pages/dashboard/MarketplaceSubmissionsAdmin";
import FeedbackAdmin from "./pages/dashboard/FeedbackAdmin";

// Broker Dashboard Pages
import BrokerInquiriesPage from "./pages/dashboard/broker/BrokerInquiriesPage";
import BrokerAnalyticsPage from "./pages/dashboard/broker/BrokerAnalyticsPage";

// Customer Dashboard Pages
import CustomerLoansPage from "./pages/dashboard/customer/CustomerLoansPage";
import CustomerApplicationsPage from "./pages/dashboard/customer/CustomerApplicationsPage";
import ApplyLoanPage from "./pages/dashboard/customer/ApplyLoanPage";
import CompareLoansPage from "./pages/dashboard/customer/CompareLoansPage";
import EMICalculatorPage from "./pages/dashboard/customer/EMICalculatorPage";
import InvestmentPage from "./pages/dashboard/customer/InvestmentPage";
import RealEstatePage from "./pages/dashboard/customer/RealEstatePage";
import VentureCapitalPage from "./pages/dashboard/customer/VentureCapitalPage";
import PremiumCheckoutPage from "./pages/dashboard/customer/PremiumCheckoutPage";
import PaymentStatusPage from "./pages/payment/PaymentStatusPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentFailedPage from "./pages/payment/PaymentFailedPage";
import PaymentCancelledPage from "./pages/payment/PaymentCancelledPage";
import PaymentLegacyRedirect from "./pages/payment/PaymentLegacyRedirect";
import BSEPaymentCallbackPage from "./pages/payment/BSEPaymentCallbackPage";
import PremiumPlansPage from "./pages/dashboard/customer/PremiumPlansPage";

// Shared Dashboard Pages
import ProfilePage from "./pages/dashboard/shared/ProfilePage";
import SharedHelpSupportPage from "./pages/dashboard/shared/SharedHelpSupportPage";
import SharedSettingsPage from "./pages/dashboard/shared/SharedSettingsPage";

// Static Pages
import ContactPage from "./pages/static/ContactPage";
import AboutPage from "./pages/static/AboutPage";
import OpportunitiesPage from "./pages/static/OpportunitiesPage";
import PropertiesPage from "./pages/PropertiesPage";
import TradersLoungePage from "./pages/TradersLoungePage";
import TraderDashboard from "./pages/TraderDashboard";
import MutualFundsPage from "./pages/MutualFundsPage";
import FeaturedMutualFundsPage from "./pages/FeaturedMutualFundsPage";
import TopPerformingFundsPage from "./pages/TopPerformingFundsPage";
import LongTermFundsPage from "./pages/ideas/LongTermFundsPage";
import HighRiskFundsPage from "./pages/ideas/HighRiskFundsPage";
import IndexFundsPage from "./pages/ideas/IndexFundsPage";
import BankingFundsPage from "./pages/sectors/BankingFundsPage";
import InfrastructureFundsPage from "./pages/sectors/InfrastructureFundsPage";
import TechnologyFundsPage from "./pages/sectors/TechnologyFundsPage";
import HealthcareFundsPage from "./pages/sectors/HealthcareFundsPage";
import MNCFundsPage from "./pages/sectors/MNCFundsPage";
import ESGFundsPage from "./pages/sectors/ESGFundsPage";
import PSUFundsPage from "./pages/sectors/PSUFundsPage";
import ConsumptionFundsPage from "./pages/sectors/ConsumptionFundsPage";
import LenderPage from "./pages/services/LenderPage";
import WealthPage from "./pages/services/WealthPage";
import MarketplacePage from "./pages/MarketplacePage";
import SubscriptionPlansPage from "./pages/SubscriptionPlansPage";
import AdminBusinessManagementPage from "./pages/dashboard/admin/AdminBusinessManagementPage";
import AdminPaymentsPage from "./pages/dashboard/admin/AdminPaymentsPage";
import CareersPage from "./pages/CareersPage";
import PersonalLoansPage from "./pages/borrowing/PersonalLoansPage";
import PersonalBorrowingPage from "./pages/borrowing/PersonalBorrowingPage";
import BusinessBorrowingPage from "./pages/borrowing/BusinessBorrowingPage";
import GovtSchemesPage from "./pages/borrowing/GovtSchemesPage";
import WealthManagementPage from "./pages/investing/WealthManagementPage";
import StartupFundingPage from "./pages/investing/StartupFundingPage";
import IndividualInvestingPage from "./pages/investing/IndividualInvestingPage";
import NonIndividualInvestingPage from "./pages/investing/NonIndividualInvestingPage";
import BusinessStrategyPage from "./pages/consultancy/BusinessStrategyPage";
import FinancialAdvisoryPage from "./pages/consultancy/FinancialAdvisoryPage";
import MarketResearchPage from "./pages/consultancy/MarketResearchPage";
import StartupAdvisoryPage from "./pages/consultancy/StartupAdvisoryPage";
import BusinessConsultancyDetailPage from "./pages/consultancy/BusinessConsultancyDetailPage";
import OffersRewardsPage from "./pages/offers/OffersRewardsPage";
import PrivyAlphaCirclePage from "./pages/client-solutions/PrivyAlphaCirclePage";
import AngelWealthLeaguePage from "./pages/client-solutions/AngelWealthLeaguePage";
import PrivateWealthLeaguePage from "./pages/client-solutions/PrivateWealthLeaguePage";
import IndexFundCategoryPage from "./pages/indexes/IndexFundCategoryPage";


// CRM Pages
import CustomersPage from "./pages/dashboard/crm/CustomersPage";
import ActivitiesPage from "./pages/dashboard/crm/ActivitiesPage";
import TasksPage from "./pages/dashboard/crm/TasksPage";
import NotificationsPage from "./pages/dashboard/crm/NotificationsPage";
import ProcessPoliciesPage from "./pages/dashboard/crm/ProcessPoliciesPage";
import { LendingPage, InvestingPage as InvestingVerticalPage, RealEstateVerticalPage, VCConsultingPage } from "./pages/dashboard/verticals/VerticalsPages";
import { StageConfigPage, KanbanPage, AutomationPage, SLATrackingPage } from "./pages/dashboard/pipeline/PipelinePages";
import { DocumentUploadPage, OCRProcessingPage, VerificationWorkflowPage, ExpiryTrackingPage } from "./pages/dashboard/documents/DocumentsPages";
import { DealCreationPage, CommissionEnginePage, PayoutTrackingPage, AgentStatementsPage } from "./pages/dashboard/deals/DealsPages";
import { LiveDashboardPage, ScheduledReportsPage, ExportCentrePage, CustomReportBuilderPage } from "./pages/dashboard/reports/ReportsPages";
import { UserManagementPage, RolePermissionPage, VerticalConfigPage, AuditLogsPage } from "./pages/dashboard/admin/AdminPages";
import MFAuthGuard from './components/auth/MFAuthGuard';
import MFDiscoveryDashboard from './components/mutual-funds/pages/MFDiscoveryDashboard';
import AMCListingPage from './components/mutual-funds/pages/AMCListingPage';
import AMCFundsPage from './components/mutual-funds/pages/AMCFundsPage';
import FundDetailPage from './components/mutual-funds/pages/FundDetailPage';
import { Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import BSEDashboard from "./pages/dashboard/BSEDashboard";
import AddUCCPage from "./pages/dashboard/AddUCCPage";
import NSEDashboard from "./pages/dashboard/NSEDashboard";

// Mutual Funds Pages (lazy loaded)
const MFPortfolioPage     = lazy(() => import('./components/mutual-funds/MFPortfolioPage'));
const MFInvestPage             = lazy(() => import('./components/mutual-funds/pages/MFInvestPage'));
const MFPortfolioSummaryPage   = lazy(() => import('./components/mutual-funds/pages/MFPortfolioSummaryPage'));
const MFTransactionsPage       = lazy(() => import('./components/mutual-funds/pages/MFTransactionsPage'));
const MFCapitalGainsPage       = lazy(() => import('./components/mutual-funds/pages/MFCapitalGainsPage'));
const MFClientTransactionsPage = lazy(() => import('./components/mutual-funds/pages/MFClientTransactionsPage'));
const MFAssetAllocationPage    = lazy(() => import('./components/mutual-funds/pages/MFAssetAllocationPage'));
const MFPortfolioJourneyPage  = lazy(() => import('./components/mutual-funds/pages/MFPortfolioJourneyPage'));
const MFSnapshotPage           = lazy(() => import('./components/mutual-funds/pages/MFSnapshotPage'));
const MFReportsPage            = lazy(() => import('./components/mutual-funds/pages/MFReportsPage'));
const MFInvestorProfilePage    = lazy(() => import('./components/mutual-funds/pages/MFInvestorProfilePage'));
const MFRTATransactionsPage    = lazy(() => import('./components/mutual-funds/pages/MFRTATransactionsPage'));
const MFSchemeFactsheetPage    = lazy(() => import('./components/mutual-funds/pages/MFSchemeFactsheetPage'));
const MFPortfolioScreenerPage  = lazy(() => import('./components/mutual-funds/pages/MFPortfolioScreenerPage'));
const MFOrdersPage             = lazy(() => import('./components/mutual-funds/pages/MFOrdersPage'));
const MFOrderListPage          = lazy(() => import('./components/mutual-funds/pages/MFOrderListPage'));
const MFInvestorMasterPage     = lazy(() => import('./components/mutual-funds/pages/MFInvestorMasterPage'));
const MFUserMasterPage         = lazy(() => import('./components/mutual-funds/pages/MFUserMasterPage'));
const MFSchemeBrowserPage      = lazy(() => import('./components/mutual-funds/pages/MFSchemeBrowserPage'));
const MFSIPsPage               = lazy(() => import('./components/mutual-funds/pages/MFSIPsPage'));
const MFSIPRegisterPage        = lazy(() => import('./components/mutual-funds/pages/MFSIPRegisterPage'));
const MFWatchlistPage          = lazy(() => import('./components/mutual-funds/pages/MFWatchlistPage'));

// Redirect /mutal-funds/* → /mutual-funds/*
const TypoRedirect: React.FC = () => {
  const location = useLocation();
  const rest = location.pathname.replace(/^\/mutal-funds/, '');
  return <Navigate to={`/mutual-funds${rest}${location.search}`} replace />;
};

const MFLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Reinitialize GTranslate widget on every SPA route change
const GTranslateReInit: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const wrapper = document.querySelector('.gtranslate_wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    if ((window as any).gtranslateSettings) {
      const s = document.createElement('script');
      s.src = 'https://cdn.gtranslate.net/widgets/latest/dwf.js';
      s.onload = () => {};
      document.body.appendChild(s);
      return () => { document.body.removeChild(s); };
    }
  }, [location.pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
  <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthSessionManager />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GTranslateReInit />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/client-solutions" element={<ClientSolutionsPage />} />
              <Route path="/borrowing" element={<BorrowingPage />} />
              <Route path="/investing" element={<InvestingPage />} />
              <Route path="/business-consultancy" element={<BusinessConsultancyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mf-login" element={<MFLoginPage />} />
              <Route path="/nse-login" element={<NSELoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/payment/status" element={<PaymentStatusPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/failed" element={<PaymentFailedPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelledPage />} />
              <Route path="/payment-callback" element={<BSEPaymentCallbackPage />} />
              <Route path="/bse-dashboard" element={<BSEDashboard />} />
              <Route path="/bse-dashboard/add-ucc" element={<AddUCCPage />} />
              <Route path="/mutal-funds" element={<Navigate to="/mutual-funds" replace />} />
              <Route path="/mutal-funds/*" element={<TypoRedirect />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/traders-lounge" element={<TradersLoungePage />} />
              <Route path="/trader-dashboard" element={<TraderDashboard />} />
              <Route path="/mutual-funds" element={<MutualFundsPage />} />
              <Route path="/mutual-funds/featured" element={<FeaturedMutualFundsPage />} />
              <Route path="/mutual-funds/top-performing" element={<TopPerformingFundsPage />} />
              <Route path="/mutual-funds/ideas/long-term" element={<LongTermFundsPage />} />
              <Route path="/mutual-funds/ideas/high-risk" element={<HighRiskFundsPage />} />
              <Route path="/mutual-funds/ideas/index-funds" element={<IndexFundsPage />} />
              <Route path="/mutual-funds/index/:category" element={<IndexFundCategoryPage />} />
              <Route path="/mutual-funds/sector/banking" element={<BankingFundsPage />} />
              <Route path="/mutual-funds/sector/infrastructure" element={<InfrastructureFundsPage />} />
              <Route path="/mutual-funds/sector/technology" element={<TechnologyFundsPage />} />
              <Route path="/mutual-funds/sector/healthcare" element={<HealthcareFundsPage />} />
              <Route path="/mutual-funds/sector/mnc" element={<MNCFundsPage />} />
              <Route path="/mutual-funds/sector/esg" element={<ESGFundsPage />} />
              <Route path="/mutual-funds/sector/psu" element={<PSUFundsPage />} />
              <Route path="/mutual-funds/sector/consumption" element={<ConsumptionFundsPage />} />
              <Route path="/mutual-funds/*" element={<NSEDashboard />} />
              <Route path="/services/lender" element={<LenderPage />} />
              <Route path="/services/wealth" element={<WealthPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/borrowing/personal-loans" element={<PersonalLoansPage />} />
              <Route path="/borrowing/personal" element={<PersonalBorrowingPage />} />
              <Route path="/borrowing/business" element={<BusinessBorrowingPage />} />
              <Route path="/borrowing/govt-schemes" element={<GovtSchemesPage />} />
              <Route path="/investing/wealth-management" element={<WealthManagementPage />} />
              <Route path="/investing/startup-funding" element={<StartupFundingPage />} />
              <Route path="/investing/individual" element={<IndividualInvestingPage />} />
              <Route path="/investing/non-individual" element={<NonIndividualInvestingPage />} />
              <Route path="/consultancy/business-strategy" element={<BusinessStrategyPage />} />
              <Route path="/consultancy/financial-advisory" element={<FinancialAdvisoryPage />} />
              <Route path="/consultancy/market-research" element={<MarketResearchPage />} />
              <Route path="/business-consultancy/startup-advisory" element={<StartupAdvisoryPage />} />
              <Route path="/business-consultancy/business-consultancy" element={<BusinessConsultancyDetailPage />} />
              <Route path="/offers-rewards" element={<OffersRewardsPage />} />
              <Route path="/client-solutions/privy-alpha-circle" element={<PrivyAlphaCirclePage />} />
              <Route path="/client-solutions/angel-wealth-league" element={<AngelWealthLeaguePage />} />
              <Route path="/client-solutions/private-wealth-league" element={<PrivateWealthLeaguePage />} />
              

              {/* Onboarding */}
              <Route path="/onboarding/verify" element={<OTPVerificationPage />} />
              <Route path="/onboarding/role-selection" element={<RoleSelectionPage />} />
              <Route path="/onboarding/kyc" element={<KYCUploadPage />} />
              <Route path="/onboarding/org-kyc" element={<OrgKYCPage />} />
              
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                {/* Agent Routes */}
                <Route path="leads" element={<LeadsPage />} />
                <Route path="applications" element={<ApplicationsPage />} />
                <Route path="payouts" element={<PayoutsPage />} />
                <Route path="commission" element={<CommissionPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="help" element={<HelpSupportPage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* CRM Core Routes */}
                <Route path="crm/customers" element={<CustomersPage />} />
                <Route path="crm/activities" element={<ActivitiesPage />} />
                <Route path="crm/tasks" element={<TasksPage />} />
                <Route path="crm/notifications" element={<NotificationsPage />} />
                <Route path="crm/process-policies" element={<ProcessPoliciesPage />} />
                
                {/* Verticals Routes */}
                <Route path="verticals/lending" element={<LendingPage />} />
                <Route path="verticals/investing" element={<InvestingVerticalPage />} />
                <Route path="verticals/real-estate" element={<RealEstateVerticalPage />} />
                <Route path="verticals/vc-consulting" element={<VCConsultingPage />} />
                
                {/* Pipeline Routes */}
                <Route path="pipeline/stage-config" element={<StageConfigPage />} />
                <Route path="pipeline/kanban" element={<KanbanPage />} />
                <Route path="pipeline/automation" element={<AutomationPage />} />
                <Route path="pipeline/sla-tracking" element={<SLATrackingPage />} />
                
                {/* Documents Routes */}
                <Route path="documents/upload" element={<DocumentUploadPage />} />
                <Route path="documents/ocr" element={<OCRProcessingPage />} />
                <Route path="documents/verification" element={<VerificationWorkflowPage />} />
                <Route path="documents/expiry" element={<ExpiryTrackingPage />} />
                
                {/* Deals & Commission Routes */}
                <Route path="deals/create" element={<DealCreationPage />} />
                <Route path="deals/commission-engine" element={<CommissionEnginePage />} />
                <Route path="deals/payout-tracking" element={<PayoutTrackingPage />} />
                <Route path="deals/agent-statements" element={<AgentStatementsPage />} />
                
                {/* Reports & Analytics Routes */}
                <Route path="reports/live" element={<LiveDashboardPage />} />
                <Route path="reports/scheduled" element={<ScheduledReportsPage />} />
                <Route path="reports/export" element={<ExportCentrePage />} />
                <Route path="reports/custom" element={<CustomReportBuilderPage />} />
                
                {/* Admin Panel Routes */}
                <Route path="admin/users" element={<UserManagementPage />} />
                <Route path="admin/roles" element={<RolePermissionPage />} />
                <Route path="admin/vertical-config" element={<VerticalConfigPage />} />
                <Route path="admin/audit-logs" element={<AuditLogsPage />} />
                {/* Admin Routes */}
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="admin-leads" element={<AdminLeadsPage />} />
                <Route path="listings" element={<AdminListingsPage />} />
                <Route path="loans" element={<AdminLoansPage />} />
                <Route path="admin-investments" element={<AdminInvestmentsPage />} />
                <Route path="admin-help" element={<AdminHelpSupportPage />} />
                <Route path="admin-settings" element={<AdminSettingsPage />} />
                <Route path="chatbot-rules" element={<AdminChatbotRulesPage />} />
                <Route path="process-policies" element={<AdminProcessPoliciesPage />} />
                <Route path="risk-compliance" element={<RiskCompliancePage />} />
                <Route path="risk-compliance/help" element={<SharedHelpSupportPage />} />
                <Route path="risk-compliance/settings" element={<SharedSettingsPage />} />
                <Route path="partner-submissions" element={<PartnerSubmissionsAdmin />} />
                <Route path="marketplace-submissions" element={<MarketplaceSubmissionsAdmin />} />
                <Route path="feedback" element={<FeedbackAdmin />} />
                <Route path="business-management" element={<AdminBusinessManagementPage />} />
                <Route path="admin-payments" element={<AdminPaymentsPage />} />
                {/* Broker Routes */}
                <Route path="inquiries" element={<BrokerInquiriesPage />} />
                <Route path="broker-analytics" element={<BrokerAnalyticsPage />} />
                {/* Customer Routes */}
                <Route path="customer-loans" element={<CustomerLoansPage />} />
                <Route path="customer-applications" element={<CustomerApplicationsPage />} />
                <Route path="apply-loan" element={<ApplyLoanPage />} />
                <Route path="compare-loans" element={<CompareLoansPage />} />
                <Route path="emi-calculator" element={<EMICalculatorPage />} />
                <Route path="investment" element={<InvestmentPage />} />
                <Route path="real-estate" element={<RealEstatePage />} />
                <Route path="venture-capital" element={<VentureCapitalPage />} />
                <Route path="premium-plans" element={<PremiumPlansPage />} />
                <Route path="premium-checkout" element={<PremiumCheckoutPage />} />
                <Route path="payment/status" element={<PaymentStatusPage />} />
                <Route path="payment/success" element={<PaymentSuccessPage />} />
                <Route path="payment/failed" element={<PaymentFailedPage />} />
                <Route path="payment/cancel" element={<PaymentCancelledPage />} />
                {/* Shared Routes */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="shared-help" element={<SharedHelpSupportPage />} />
                <Route path="shared-settings" element={<SharedSettingsPage />} />

                {/* Mutual Funds Routes — protected by MFAuthGuard */}
                <Route element={<MFAuthGuard />}>
                  <Route path="mf" element={<Navigate to="/dashboard/mf/invest" replace />} />
                  <Route path="mf/portfolio"           element={<Suspense fallback={<MFLoader />}><MFPortfolioPage /></Suspense>} />
                  <Route path="mf/portfolio-returns"   element={<Suspense fallback={<MFLoader />}><MFPortfolioPage /></Suspense>} />
                  <Route path="mf/invest"              element={<Suspense fallback={<MFLoader />}><MFInvestPage /></Suspense>} />
                  <Route path="mf/invest-old"         element={<Suspense fallback={<MFLoader />}><MFInvestPage /></Suspense>} />
                  <Route path="mf/sips"                element={<Suspense fallback={<MFLoader />}><MFSIPsPage /></Suspense>} />
                  <Route path="mf/sips/register"       element={<Suspense fallback={<MFLoader />}><MFSIPRegisterPage /></Suspense>} />
                  <Route path="mf/watchlist"           element={<Suspense fallback={<MFLoader />}><MFWatchlistPage /></Suspense>} />
                  <Route path="mf/portfolio-summary"   element={<Suspense fallback={<MFLoader />}><MFPortfolioSummaryPage /></Suspense>} />
                  <Route path="mf/transactions"        element={<Suspense fallback={<MFLoader />}><MFTransactionsPage /></Suspense>} />
                  <Route path="mf/capital-gains"       element={<Suspense fallback={<MFLoader />}><MFCapitalGainsPage /></Suspense>} />
                  <Route path="mf/client-transactions" element={<Suspense fallback={<MFLoader />}><MFClientTransactionsPage /></Suspense>} />
                  <Route path="mf/asset-allocation"    element={<Suspense fallback={<MFLoader />}><MFAssetAllocationPage /></Suspense>} />
                  <Route path="mf/portfolio-journey"   element={<Suspense fallback={<MFLoader />}><MFPortfolioJourneyPage /></Suspense>} />
                  <Route path="mf/snapshot"            element={<Suspense fallback={<MFLoader />}><MFSnapshotPage /></Suspense>} />
                  <Route path="mf/reports"             element={<Suspense fallback={<MFLoader />}><MFReportsPage /></Suspense>} />
                  <Route path="mf/investor-profile"    element={<Suspense fallback={<MFLoader />}><MFInvestorProfilePage /></Suspense>} />
                  <Route path="mf/rta-transactions"    element={<Suspense fallback={<MFLoader />}><MFRTATransactionsPage /></Suspense>} />
                  <Route path="mf/scheme-factsheet"    element={<Suspense fallback={<MFLoader />}><MFSchemeFactsheetPage /></Suspense>} />
                  <Route path="mf/screener"            element={<Suspense fallback={<MFLoader />}><MFPortfolioScreenerPage /></Suspense>} />
                  <Route path="mf/orders/purchase"     element={<Suspense fallback={<MFLoader />}><MFOrdersPage /></Suspense>} />
                  <Route path="mf/orders/redeem"       element={<Suspense fallback={<MFLoader />}><MFOrdersPage /></Suspense>} />
                  <Route path="mf/orders/switch"       element={<Suspense fallback={<MFLoader />}><MFOrdersPage /></Suspense>} />
                  <Route path="mf/orders/list"         element={<Suspense fallback={<MFLoader />}><MFOrderListPage /></Suspense>} />
                  <Route path="mf/investor-master"     element={<Suspense fallback={<MFLoader />}><MFInvestorMasterPage /></Suspense>} />
                  <Route path="mf/user-master"         element={<Suspense fallback={<MFLoader />}><MFUserMasterPage /></Suspense>} />
                  <Route path="mf/scheme-browser"      element={<Suspense fallback={<MFLoader />}><MFSchemeBrowserPage /></Suspense>} />
                  <Route path="mf/discovery"             element={<MFDiscoveryDashboard />} />
                  <Route path="mf/discovery/amcs"        element={<AMCListingPage />} />
                  <Route path="mf/discovery/amc/:amcId"  element={<AMCFundsPage />} />
                  <Route path="mf/discovery/fund/:amcId/:fundName" element={<FundDetailPage />} />
                </Route>
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
  </QueryClientProvider>
  </Provider>
);

export default App;
