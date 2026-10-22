import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Zap, Clock, X, User, Phone, Mail, Tag, Calendar, TrendingUp, FileText, ChevronDown, CheckSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVerticalFilter } from '@/hooks/useVerticalFilter';

export const StageConfigPage: React.FC = () => {
  const stages = [
    { id: 1, name: 'Lead', color: 'bg-blue-500', deals: 15, avgDays: 2 },
    { id: 2, name: 'Qualification', color: 'bg-yellow-500', deals: 8, avgDays: 5 },
    { id: 3, name: 'Proposal', color: 'bg-orange-500', deals: 5, avgDays: 7 },
    { id: 4, name: 'Negotiation', color: 'bg-purple-500', deals: 3, avgDays: 10 },
    { id: 5, name: 'Closed Won', color: 'bg-green-500', deals: 12, avgDays: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stage Configuration</h1>
        <p className="text-muted-foreground">Configure pipeline stages and workflows</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                <div className="flex-1">
                  <h4 className="font-semibold">{stage.name}</h4>
                  <p className="text-sm text-muted-foreground">{stage.deals} deals • Avg {stage.avgDays} days</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type Subtask = {
  id: string;
  work: string;
  priority: string;
  assignee: string;
  status: string;
  detailedNotes?: string;
  createdByName?: string;
  createdTime?: string;
};

type Deal = {
  id: string;
  title: string;
  value: string;
  leadGeneratedTime: string;
  leadGeneratedBy: string;
  status: string;
  phone: string;
  email: string;
  loanType: string;
  stage: string;
  notes: string;
  vertical: 'LD' | 'IE' | 'RE' | 'VC';
  subtasks: Subtask[];
};

type Column = {
  name: string;
  deals: Deal[];
};

const initialColumns: Column[] = [
  { name: 'Lead', deals: [
    {
      id: 'D001', title: 'Rajesh Kumar - Personal Loan', value: '₹5L',
      leadGeneratedTime: '2024-01-10 09:30 AM', leadGeneratedBy: 'David DSA', status: 'New',
      phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', loanType: 'Personal Loan', stage: 'Lead',
      vertical: 'LD',
      notes: 'Customer is highly interested in securing a fast personal loan variant primarily allocated for urgent residential asset enhancement and structural home renovation purposes. The current monthly base salary statement is verified at ₹75,000, showcasing solid corporate employment continuity for over 6 consecutive years. Evaluation models place the current consumer credit score at a strong 780, showing low default probabilities across portfolios. There are no outstanding micro-loans or current EMI encumbrances declared on record during evaluation. A specialized pre-approved financial allocation of ₹5L has been finalized for accelerated processing cycles within 3 business days.',
      subtasks: [
        { id: 'SCRUM-121', work: 'Summary card — 4 documents verified manually', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Manually verified 4 core structural KYC and employment logs. Everything looks clean.', createdByName: 'David DSA', createdTime: '2024-01-10 09:45 AM' },
        { id: 'SCRUM-122', work: 'Validate CIBIL workspace logs and cross liabilities', priority: 'M', assignee: 'AN', status: 'TO DO', detailedNotes: 'System running active automated API matching against localized CIBIL workspace structures.', createdByName: 'Ananya N', createdTime: '2024-01-10 10:15 AM' },
        { id: 'SCRUM-123', work: 'Generate standardized EMI amortization timeline metrics', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Computing comprehensive amortization tables matching baseline monthly interest tracking margins.', createdByName: 'David DSA', createdTime: '2024-01-10 11:00 AM' },
        { id: 'SCRUM-124', work: 'Run structural bank statement parsing routines', priority: 'L', assignee: 'RK', status: 'TO DO', detailedNotes: 'Parsing banking workflows across 6 months to extract transaction velocity parameters.', createdByName: 'Ravi Kumar', createdTime: '2024-01-10 01:30 PM' },
        { id: 'SCRUM-125', work: 'Initiate employment check callbacks', priority: 'H', assignee: 'PS', status: 'TO DO', detailedNotes: 'Verifying HR workspace signatures and operational corporate directory registrations.', createdByName: 'Priya Sharma', createdTime: '2024-01-10 03:00 PM' }
      ]
    },
    {
      id: 'D002', title: 'Priya Sharma - Business Loan', value: '₹12L',
      leadGeneratedTime: '2024-01-11 11:00 AM', leadGeneratedBy: 'David DSA', status: 'New',
      phone: '+91 91234 56789', email: 'priya.sharma@email.com', loanType: 'Business Loan', stage: 'Lead',
      vertical: 'LD',
      notes: 'An established entrepreneur is exploring operational liquidity options via a term business loan structure aimed specifically at scale updates for an inner-city boutique retail brand. The entity boasts continuous trade lifecycle visibility for 3 years, bringing in reliable audited quarterly store metrics averaging a baseline of ₹4L. The enterprise profile holds proper valid GST integration records alongside consecutive ITR documentation fields for the past 2 calendar durations. Explicit preference was logged for a flexible term loan infrastructure to support modular expansion projects without disrupting everyday cash-flow thresholds. Preliminary evaluation systems clear the credit profile at 740, justifying competitive pricing paths during loan setup.',
      subtasks: [
        { id: 'SCRUM-126', work: 'Acquire past 2 years validated GST and ITR forms', priority: 'M', assignee: 'PS', status: 'TO DO', detailedNotes: 'Gathering structural tax returns and historical sales receipts from the enterprise database.', createdByName: 'Priya Sharma', createdTime: '2024-01-11 11:20 AM' },
        { id: 'SCRUM-127', work: 'Complete commercial retail facility geo-tag validation', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Verifying physical facility boundaries via automated geographical tagging components.', createdByName: 'Amit Broker', createdTime: '2024-01-11 02:40 PM' },
        { id: 'SCRUM-128', work: 'Evaluate audited quarterly retail ledger sheets', priority: 'H', assignee: 'DK', status: 'TO DO', detailedNotes: 'Analyzing operational margin profiles to secure compliance against minimal liquidity benchmarks.', createdByName: 'David DSA', createdTime: '2024-01-11 04:15 PM' },
        { id: 'SCRUM-129', work: 'Validate business entity active registration tags', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Checking localized business establishment listings and processing regulatory compliance logs.', createdByName: 'Priya Agent', createdTime: '2024-01-12 09:00 AM' },
        { id: 'SCRUM-130', work: 'Draft preliminary underwriting risk score maps', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Compiling structural debt-to-income limits across expected expansion cycles.', createdByName: 'Ravi Kumar', createdTime: '2024-01-12 11:30 AM' }
      ]
    },
    {
      id: 'D006', title: 'Arjun Mehta - SIP Investment', value: '₹3L',
      leadGeneratedTime: '2024-01-12 10:00 AM', leadGeneratedBy: 'David DSA', status: 'New',
      phone: '+91 90123 45678', email: 'arjun.mehta@email.com', loanType: 'SIP / Mutual Fund', stage: 'Lead',
      vertical: 'IE',
      notes: 'A corporate enterprise professional requested analytical support for organizing a recurring Systematic Investment Plan tailored for strategic compound wealth goals. System logs indicate an available net investable baseline surplus totaling ₹25,000 every billing month ready for active systemic asset allocations. Risk evaluation forms verify a measured moderate risk preference pattern, favoring structured allocations across blue-chip equity instruments and balanced hybrids. The programmatic financial goal targets a projected long-term asset pool milestone of ₹1Cr across a planned active decade horizon. Complementary requests for tax-mitigation vehicles such as ELSS products are being computed alongside the primary setup.',
      subtasks: [
        { id: 'SCRUM-131', work: 'Draft structural mutual fund portfolio layout options', priority: 'M', assignee: 'AM', status: 'TO DO', detailedNotes: 'Formulating asset allocation matrices across diversified large-cap and multi-cap tools.', createdByName: 'David DSA', createdTime: '2024-01-12 10:30 AM' },
        { id: 'SCRUM-132', work: 'Execute specialized consumer risk profiling indexes', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Processing standard volatility questionnaire logs to verify threshold compliance parameters.', createdByName: 'Ravi Kumar', createdTime: '2024-01-12 01:10 PM' },
        { id: 'SCRUM-133', work: 'Compute long-term compound growth projections charts', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Modeling 10-year investment horizons using multi-tier annualized return projections.', createdByName: 'Priya Agent', createdTime: '2024-01-12 03:45 PM' },
        { id: 'SCRUM-134', work: 'Review ELSS tax-saving product compliance parameters', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Mapping potential tax deductions against national structural investment rules.', createdByName: 'Amit Broker', createdTime: '2024-01-13 10:00 AM' },
        { id: 'SCRUM-135', work: 'Prepare compliance KYC documentation tracking lines', priority: 'M', assignee: 'AM', status: 'TO DO', detailedNotes: 'Verifying central investment portfolio registrations and identity profiles.', createdByName: 'David DSA', createdTime: '2024-01-13 12:15 PM' }
      ]
    },
    {
      id: 'D007', title: 'Kavitha Nair - Startup Funding', value: '₹50L',
      leadGeneratedTime: '2024-01-13 09:00 AM', leadGeneratedBy: 'Ravi Kumar', status: 'New',
      phone: '+91 89012 34567', email: 'kavitha.nair@startup.com', loanType: 'Startup Funding', stage: 'Lead',
      vertical: 'IE',
      notes: 'An early-stage software entity focusing on disruptive automated HealthTech architectures is pitching for initial seed investment configurations through corporate advisory channels. The proprietary digital platform infrastructure operates in an active Minimum Viable Product layout, serving a validated test-group of 500 active digital consumers. The underlying foundation layer consists of seasoned medical product domain professionals with clear execution capabilities. Capital requirements dictate a target setup of ₹50L to stabilize final core platform modules and launch localized user acquisition frameworks. Completed core business models, current market assessments, and interactive pitch documents are archived for verification.',
      subtasks: [
        { id: 'SCRUM-136', work: 'Review product MVP stack and current validation matrices', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Analyzing product health metrics and system performance across current validation users.', createdByName: 'Ravi Kumar', createdTime: '2024-01-13 09:30 AM' },
        { id: 'SCRUM-137', work: 'Audit foundational organizational cap-table structures', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Mapping shareholdings allocations to safeguard structural tracking alignments.', createdByName: 'Priya Agent', createdTime: '2024-01-13 11:45 AM' },
        { id: 'SCRUM-138', work: 'Examine target market size TAM/SAM data logs', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Validating total addressable market projections against local industry configurations.', createdByName: 'David DSA', createdTime: '2024-01-13 02:30 PM' },
        { id: 'SCRUM-139', work: 'Analyze platform digital conversion funnel records', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Reviewing monthly user cohort retention speeds and interactive session loops.', createdByName: 'Amit Broker', createdTime: '2024-01-14 10:15 AM' },
        { id: 'SCRUM-140', work: 'Draft capital runway usage roadmap descriptions', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Detailing expenditure plans across platform development and infrastructure scaling.', createdByName: 'Ravi Kumar', createdTime: '2024-01-14 01:50 PM' }
      ]
    },
    {
      id: 'D008', title: 'Suresh Babu - Residential Plot', value: '₹45L',
      leadGeneratedTime: '2024-01-14 11:30 AM', leadGeneratedBy: 'Amit Broker', status: 'New',
      phone: '+91 78901 23456', email: 'suresh.babu@email.com', loanType: 'Plot Loan', stage: 'Lead',
      vertical: 'RE',
      notes: 'A consumer is looking to acquire a developed residential land parcel located in the high-growth peripheral suburbs of the Bangalore urban landscape region. The baseline capital allocation budget limits the real estate transaction price points tightly within a clear ₹45L processing scope limit. The applicant requires structured long-term land loan vehicles with an estimated Loan-to-Value calculation targeting the 80% mark. Primary income flows stem from long-term employment within the enterprise information technology sector, producing a certified monthly income of ₹1.2L. No competitive property liabilities or active mortgage trails exist on standard reports, and land checks are scheduled.',
      subtasks: [
        { id: 'SCRUM-141', work: 'Verify layout approval certificates and local field titles', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Checking real estate legal structures and verify planning permission seals.', createdByName: 'Amit Broker', createdTime: '2024-01-14 11:50 AM' },
        { id: 'SCRUM-142', work: 'Initiate certified local field area survey runs', priority: 'H', assignee: 'PA', status: 'TO DO', detailedNotes: 'Scheduling land physical property verification routines to confirm plot size configurations.', createdByName: 'Priya Agent', createdTime: '2024-01-14 03:10 PM' },
        { id: 'SCRUM-143', work: 'Verify consumer monthly salary certificate fields', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Cross-checking IT workspace payslips and corporate identity numbers.', createdByName: 'David DSA', createdTime: '2024-01-15 09:30 AM' },
        { id: 'SCRUM-144', work: 'Calculate maximum permissible Loan-to-Value boundaries', priority: 'L', assignee: 'RK', status: 'TO DO', detailedNotes: 'Formulating structural property loan caps based on technical value baselines.', createdByName: 'Ravi Kumar', createdTime: '2024-01-15 11:45 AM' },
        { id: 'SCRUM-145', work: 'Search local property registry encumbrance indexes', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Querying historical property title registries to confirm transaction clearings.', createdByName: 'Amit Broker', createdTime: '2024-01-15 02:20 PM' }
      ]
    },
    {
      id: 'D009', title: 'Meena Iyer - Commercial Space', value: '₹80L',
      leadGeneratedTime: '2024-01-15 02:00 PM', leadGeneratedBy: 'Priya Agent', status: 'New',
      phone: '+91 67890 12345', email: 'meena.iyer@business.com', loanType: 'Commercial Property', stage: 'Lead',
      vertical: 'RE',
      notes: 'A seasoned enterprise owner is requesting financial structuring support to acquire premium commercial real estate zones for local corporate office configurations. The physical real estate market price is asset-checked at ₹1Cr, and the applicant is seeking a target credit facility covering an 80% proportion. The corporate entity demonstrates sustained operational stability for over 5 continuous tracking years with highly optimized audited cash inflows. The client expressed parallel interests in exploring Lease Rental Discounting mechanics to maximize liquidity efficiency models going forward. Formal legal title due diligence pipelines and regional zoning checks are under active progress.',
      subtasks: [
        { id: 'SCRUM-146', work: 'Perform technical real estate valuation on property assets', priority: 'H', assignee: 'PA', status: 'TO DO', detailedNotes: 'Executing formal property pricing metrics across commercial zone parameters.', createdByName: 'Priya Agent', createdTime: '2024-01-15 02:30 PM' },
        { id: 'SCRUM-147', work: 'Examine corporate entity 5-year accounting cash-flows', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Auditing multi-year tracking balance sheets to calculate corporate repayment limits.', createdByName: 'David DSA', createdTime: '2024-01-15 04:45 PM' },
        { id: 'SCRUM-148', work: 'Analyze Lease Rental Discounting legal model structures', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Assessing future tenancy contracts to map alternative loan structuring layouts.', createdByName: 'Ravi Kumar', createdTime: '2024-01-16 10:00 AM' },
        { id: 'SCRUM-149', work: 'Verify local regional zoning compliance parameters', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Confirming commercial corporate usage clearance with local municipal offices.', createdByName: 'Amit Broker', createdTime: '2024-01-16 01:15 PM' },
        { id: 'SCRUM-150', work: 'Collect structural corporate director identity listings', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Compiling institutional KYC records and company resolution signatures.', createdByName: 'Priya Agent', createdTime: '2024-01-16 03:40 PM' }
      ]
    },
    {
      id: 'D010', title: 'Rohit Verma - Business Strategy', value: '₹2L',
      leadGeneratedTime: '2024-01-16 10:00 AM', leadGeneratedBy: 'David DSA', status: 'New',
      phone: '+91 56789 01234', email: 'rohit.verma@company.com', loanType: 'Business Consulting', stage: 'Lead',
      vertical: 'VC',
      notes: 'A consumer products entrepreneur is requesting long-term tactical consulting arrangements to systematically scale an emerging Direct-to-Consumer retail operation. The firm tracks steady current operational performance milestones at a baseline of ₹50L annualized revenue, targeting a steep scale shift to ₹2Cr over 18 months. The diagnostic advisory lifecycle requires detailed engineering of Go-To-Market strategies, systemic cost optimizations, and investment presentation designs. The initial business consultation process and strategic alignment parameters have been documented internally. A formal commercial engagement proposal framework is being generated.',
      subtasks: [
        { id: 'SCRUM-151', work: 'Draft comprehensive growth timeline framework maps', priority: 'M', assignee: 'DD', status: 'TO DO', detailedNotes: 'Mapping modular milestones to track localized business scaling layouts.', createdByName: 'David DSA', createdTime: '2024-01-16 10:35 AM' },
        { id: 'SCRUM-152', work: 'Analyze current operational business expenditure profiles', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Deconstructing production cost lines to identify optimization margins.', createdByName: 'Ravi Kumar', createdTime: '2024-01-16 02:00 PM' },
        { id: 'SCRUM-153', work: 'Design modular Go-To-Market strategy workflows', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Structuring distribution parameters to accelerate multi-state consumer outreach.', createdByName: 'Priya Agent', createdTime: '2024-01-17 09:15 AM' },
        { id: 'SCRUM-154', work: 'Review historical consumer acquisition cost structures', priority: 'L', assignee: 'DK', status: 'TO DO', detailedNotes: 'Evaluating digital advertising performance metrics over past product cycles.', createdByName: 'David DSA', createdTime: '2024-01-17 11:30 AM' },
        { id: 'SCRUM-155', work: 'Compile investment presentation deck structures', priority: 'H', assignee: 'DD', status: 'TO DO', detailedNotes: 'Refining core data matrices for upcoming institutional funding reviews.', createdByName: 'David DSA', createdTime: '2024-01-17 02:50 PM' }
      ]
    },
    {
      id: 'D011', title: 'Ananya Singh - VC Advisory', value: '₹1.5L',
      leadGeneratedTime: '2024-01-17 03:00 PM', leadGeneratedBy: 'Priya Agent', status: 'New',
      phone: '+91 45678 90123', email: 'ananya.singh@venture.com', loanType: 'VC Advisory', stage: 'Lead',
      vertical: 'VC',
      notes: 'The execution leadership of an AgriTech venture ecosystem is requesting specialized venture capital advisory support to prepare for a Series A funding round. The corporate structure maps continuous commercial progress validated by an audited operational run rate totaling a verified level of ₹30L ARR. The consultant engagement lifecycle focuses on updating data room properties, creating investment models, and mapping targeted institutional relationships. Final adjustments regarding standard service agreements, execution milestones, and long-term project timelines are being coordinated across departments.',
      subtasks: [
        { id: 'SCRUM-156', work: 'Structure clean institutional data room layout architecture', priority: 'H', assignee: 'PA', status: 'TO DO', detailedNotes: 'Configuring safe cloud access panels to store critical operational files.', createdByName: 'Priya Agent', createdTime: '2024-01-17 03:20 PM' },
        { id: 'SCRUM-157', work: 'Build predictive operational ARR forecasting systems', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Modeling multi-tier revenue lines based on expected corporate expansion.', createdByName: 'David DSA', createdTime: '2024-01-18 10:00 AM' },
        { id: 'SCRUM-158', work: 'Compile institutional VC target preference indices', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Filtering regional investment firms active in software and farming segments.', createdByName: 'Ravi Kumar', createdTime: '2024-01-18 01:15 PM' },
        { id: 'SCRUM-159', work: 'Draft preliminary advisory engagement contract drafts', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Defining service parameter limits and achievement timeline metrics.', createdByName: 'Amit Broker', createdTime: '2024-01-18 04:30 PM' },
        { id: 'SCRUM-160', work: 'Audit existing commercial tech-stack infrastructure parameters', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Evaluating platform performance capabilities to confirm systemic scalability.', createdByName: 'Priya Agent', createdTime: '2024-01-19 09:45 AM' }
      ]
    },
  ]},
  { name: 'Qualification', deals: [
    {
      id: 'D003', title: 'Amit Patel - Business Loan', value: '₹15L',
      leadGeneratedTime: '2024-01-08 02:15 PM', leadGeneratedBy: 'Ravi Kumar', status: 'In Progress',
      phone: '+91 99887 76655', email: 'amit.patel@business.com', loanType: 'Business Loan', stage: 'Qualification',
      vertical: 'LD',
      notes: 'An established small-to-medium enterprise operator inside the localized textile manufacturing market requested a quick working capital facility to mitigate seasonal inventory shifts. Certified annual business operational tracking reports match consistent revenue patterns reaching a baseline value of ₹1.2Cr over three fiscal terms. Complete structured historical information including integrated GST returns and detailed business accounts for twelve months have been filed into the database. The physical firm records clear local presence tracking back seven continuous operational tracking cycles. The profile parameters and asset files are currently under process within the credit underwriting team.',
      subtasks: [
        { id: 'SCRUM-161', work: 'Cross-examine past 12 months commercial banking logs', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Analyzing cash inflows patterns to extract true average operational revenues.', createdByName: 'Ravi Kumar', createdTime: '2024-01-08 02:45 PM' },
        { id: 'SCRUM-162', work: 'Verify physical textile factory facility operations', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Confirming equipment metrics and processing actual asset utilization checks.', createdByName: 'Amit Broker', createdTime: '2024-01-08 04:30 PM' },
        { id: 'SCRUM-163', work: 'Validate historical business GST reconciliation sheets', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Matching government tax records directly against internal ledger files.', createdByName: 'David DSA', createdTime: '2024-01-09 10:00 AM' },
        { id: 'SCRUM-164', work: 'Review local enterprise credit bureau portfolio logs', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Analyzing historical firm liabilities and current settlement track histories.', createdByName: 'Priya Agent', createdTime: '2024-01-09 01:15 PM' },
        { id: 'SCRUM-165', work: 'Formulate credit underwriting qualification criteria checklists', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Finalizing standard risk profiles for administrative risk board clearances.', createdByName: 'Ravi Kumar', createdTime: '2024-01-09 03:50 PM' }
      ]
    },
    {
      id: 'D012', title: 'Deepak Rao - Wealth Portfolio', value: '₹25L',
      leadGeneratedTime: '2024-01-09 01:00 PM', leadGeneratedBy: 'Ravi Kumar', status: 'In Progress',
      phone: '+91 88990 11223', email: 'deepak.rao@email.com', loanType: 'Wealth Management', stage: 'Qualification',
      vertical: 'IE',
      notes: 'A High-Net-Worth Individual client is seeking a professional wealth allocation refresh regarding concentrated personal holdings valued at a solid baseline metric of ₹25L. Historical asset statements verify structural concentrations inside basic fixed banking instruments alongside fragmented physical gold ownership blocks. The current mandate requires modular capital redistribution across institutional equity funds, debt instruments, and select Real Estate Investment Trusts. Standard psychometric risk behavior indicators and target return milestones have been thoroughly computed by advisory apps. Custom asset allocation documentation models are being generated by the investment desks.',
      subtasks: [
        { id: 'SCRUM-166', work: 'Analyze structural risk profile parameters for active diversification', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Mapping behavioral risk parameters to balance equity and fixed asset weights.', createdByName: 'Ravi Kumar', createdTime: '2024-01-09 01:30 PM' },
        { id: 'SCRUM-167', work: 'Audit legacy fixed deposit maturity tracking dates', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Calculating early withdrawal margins to prevent structural penalty charges.', createdByName: 'Priya Agent', createdTime: '2024-01-09 04:15 PM' },
        { id: 'SCRUM-168', work: 'Benchmark performance of target institutional mutual funds', priority: 'H', assignee: 'DK', status: 'TO DO', detailedNotes: 'Comparing historical alpha generation indexes over stable 5-year cycles.', createdByName: 'David DSA', createdTime: '2024-01-10 11:00 AM' },
        { id: 'SCRUM-169', work: 'Evaluate listed REIT dividend yield safety levels', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Reviewing underlying commercial occupancy levels for target portfolio components.', createdByName: 'Amit Broker', createdTime: '2024-01-10 02:45 PM' },
        { id: 'SCRUM-170', work: 'Draft preliminary asset restructuring allocation diagrams', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Assembling structural visual portfolio weight charts for final consumer signoff.', createdByName: 'Ravi Kumar', createdTime: '2024-01-10 05:10 PM' }
      ]
    },
    {
      id: 'D013', title: 'Lakshmi Devi - Home Loan', value: '₹60L',
      leadGeneratedTime: '2024-01-07 11:00 AM', leadGeneratedBy: 'Amit Broker', status: 'In Progress',
      phone: '+91 77889 00112', email: 'lakshmi.devi@email.com', loanType: 'Home Loan', stage: 'Qualification',
      vertical: 'RE',
      notes: 'A client is completing purchase agreements for a multi-room premium urban residential apartment complex located inside the growing Pune property market sector. The verified real estate asset value totals a confirmed baseline metric of ₹75L, with the applicant requesting a credit facility to clear 80% parameter marks. Regular personal earnings originate from specialized enterprise payroll structures, bringing in verified consistent monthly base salary amounts of ₹90,000. Verified consumer bureau files confirm a healthy repository standing with an active CIBIL index tracking score calibrated at 760. Property structural papers and title logs are with legal processing units for clearance.',
      subtasks: [
        { id: 'SCRUM-171', work: 'Verify property legal tracking clear titles from developers', priority: 'H', assignee: 'AB', status: 'TO DO', detailedNotes: 'Analyzing builder registration numbers and verify layout construction clearances.', createdByName: 'Amit Broker', createdTime: '2024-01-07 11:30 AM' },
        { id: 'SCRUM-172', work: 'Review historical consumer credit profile logs', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Evaluating payment consistency across historical credit card structures.', createdByName: 'David DSA', createdTime: '2024-01-07 03:00 PM' },
        { id: 'SCRUM-173', work: 'Parse certified monthly corporate bank payroll feeds', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Confirming stable income tracking entries directly from enterprise databases.', createdByName: 'Ravi Kumar', createdTime: '2024-01-08 10:15 AM' },
        { id: 'SCRUM-174', work: 'Execute physical builder structural progress reviews', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Confirming completion stages on-site to release construction milestone amounts.', createdByName: 'Priya Agent', createdTime: '2024-01-08 01:45 PM' },
        { id: 'SCRUM-175', work: 'Calculate debt-service coverage metrics thresholds', priority: 'H', assignee: 'AB', status: 'TO DO', detailedNotes: 'Matching proposed monthly EMI loads against net income margins.', createdByName: 'Amit Broker', createdTime: '2024-01-08 04:20 PM' }
      ]
    },
    {
      id: 'D014', title: 'Kiran Kumar - Financial Advisory', value: '₹3L',
      leadGeneratedTime: '2024-01-06 04:00 PM', leadGeneratedBy: 'David DSA', status: 'In Progress',
      phone: '+91 66778 99001', email: 'kiran.kumar@firm.com', loanType: 'Financial Advisory', stage: 'Qualification',
      vertical: 'VC',
      notes: 'A mid-tier regional production entity is requesting specialized corporate finance consulting services to restructure outstanding debts and maximize current capital efficiency scores. Periodic balance sheets reveal an annualized production transaction volume passing the targeted baseline scale of ₹5Cr every loop cycle. Deep diagnostic data points show elevated corporate debt ratios compared to foundational equity positions, adding pressure during tight seasonal operational windows. The targeted consultant framework focuses on deep cash lifecycle mappings, liabilities structural transformations, and organized banking vendor alignments. Foundational operating data sets are compiled for processing.',
      subtasks: [
        { id: 'SCRUM-176', work: 'Map full current corporate debt obligation profiles', priority: 'M', assignee: 'DD', status: 'TO DO', detailedNotes: 'Cataloging interest rates and maturity dates for all active credit tools.', createdByName: 'David DSA', createdTime: '2024-01-06 04:30 PM' },
        { id: 'SCRUM-177', work: 'Analyze corporate seasonal cash collection delays', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Reviewing working capital components to identify bottlenecks in cash cycles.', createdByName: 'Ravi Kumar', createdTime: '2024-01-07 09:45 AM' },
        { id: 'SCRUM-178', work: 'Evaluate historical production margin structures', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Deconstructing direct manufacturing costs to suggest optimal operational efficiencies.', createdByName: 'Priya Agent', createdTime: '2024-01-07 02:15 PM' },
        { id: 'SCRUM-179', work: 'Draft alternative banking debt consolidation choices', priority: 'L', assignee: 'DK', status: 'TO DO', detailedNotes: 'Modeling cost benefits of long-term commercial refinancing setups.', createdByName: 'David DSA', createdTime: '2024-01-08 11:00 AM' },
        { id: 'SCRUM-180', work: 'Prepare corporate financial diagnostic workshop files', priority: 'M', assignee: 'DD', status: 'TO DO', detailedNotes: 'Compiling structural tracking data packets ahead of board alignment meetings.', createdByName: 'David DSA', createdTime: '2024-01-08 03:30 PM' }
      ]
    },
  ]},
  { name: 'Proposal', deals: [
    {
      id: 'D004', title: 'Sneha Reddy - VC Funding', value: '₹5Cr',
      leadGeneratedTime: '2024-01-05 10:00 AM', leadGeneratedBy: 'Priya Agent', status: 'Pending',
      phone: '+91 88776 65544', email: 'sneha.reddy@startup.io', loanType: 'VC Funding', stage: 'Proposal',
      vertical: 'VC',
      notes: 'An institutional educational software enterprise is advancing investment pipelines regarding an active institutional Series A fundraising execution run. Core software architectures have been deployed live for 8 continuous months, capturing user scaling indexes over 10,000 active tracking items and recurring income flows of ₹12L. The growth roadmap requires an expansion capital injection of ₹5Cr to augment product development teams, initialize multi-state expansions, and secure media items. Detailed investor presentations, deep tech validation roadmaps, and forecast models are cataloged inside system shares. Partner alignment workshops are set.',
      subtasks: [
        { id: 'SCRUM-181', work: 'Verify user scaling index metrics logs and accounts', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Checking platform database records to confirm historical active consumer metrics.', createdByName: 'Priya Agent', createdTime: '2024-01-05 10:30 AM' },
        { id: 'SCRUM-182', work: 'Audit recurring platform SaaS revenue statement tracks', priority: 'H', assignee: 'DK', status: 'TO DO', detailedNotes: 'Validating recurring subscription accounting parameters across processing gateways.', createdByName: 'David DSA', createdTime: '2024-01-05 01:15 PM' },
        { id: 'SCRUM-183', work: 'Review multi-state commercial deployment roadmap strategies', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Assessing operational infrastructure demands across target growth territories.', createdByName: 'Ravi Kumar', createdTime: '2024-01-05 04:00 PM' },
        { id: 'SCRUM-184', work: 'Cross-check core software infrastructure validation reports', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Analyzing cloud architecture engineering structures and platform security scores.', createdByName: 'Amit Broker', createdTime: '2024-01-06 10:45 AM' },
        { id: 'SCRUM-185', work: 'Assemble formal institutional series-A pricing templates', priority: 'H', assignee: 'PA', status: 'TO DO', detailedNotes: 'Finalizing equity dilution metrics and investor share allocation charts.', createdByName: 'Priya Agent', createdTime: '2024-01-06 02:30 PM' }
      ]
    },
    {
      id: 'D015', title: 'Naveen Reddy - Home Loan', value: '₹40L',
      leadGeneratedTime: '2024-01-04 09:00 AM', leadGeneratedBy: 'Ravi Kumar', status: 'Pending',
      phone: '+91 55667 88990', email: 'naveen.reddy@email.com', loanType: 'Home Loan', stage: 'Proposal',
      vertical: 'LD',
      notes: 'A long-term civil services officer is requesting final credit facility proposals regarding a structural ready-to-occupy urban property development project. Financial specifications establish a target facility sizing model of ₹40L mapped against a competitive 8.75% fixed annual processing rate layout for 15 terms. Formal term configuration sheets and specialized underwriting structural parameters have been designed and shared with the applicant for processing. System tracks confirm the pipeline status is currently parked awaiting final consumer authorization and digital validation inputs. Client confirmation cycles are being monitored by service desks.',
      subtasks: [
        { id: 'SCRUM-186', work: 'Verify certified civil service verification documents', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Confirming official government credentials and long-term tenure tracking registries.', createdByName: 'Ravi Kumar', createdTime: '2024-01-04 09:20 AM' },
        { id: 'SCRUM-187', work: 'Draft formal 15-year interest configuration templates', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Generating final interest breakdown matrices across the proposed timeline.', createdByName: 'David DSA', createdTime: '2024-01-04 11:45 AM' },
        { id: 'SCRUM-188', work: 'Validate residential construction completion certifications', priority: 'H', assignee: 'AB', status: 'TO DO', detailedNotes: 'Reviewing architectural occupancy certificates and municipal utility clearances.', createdByName: 'Amit Broker', createdTime: '2024-01-04 03:10 PM' },
        { id: 'SCRUM-189', work: 'Audit consumer identity validation bio-metrics', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Confirming central identity linkages to secure regulatory underwriting files.', createdByName: 'Priya Agent', createdTime: '2024-01-05 10:00 AM' },
        { id: 'SCRUM-190', work: 'Monitor client confirmation electronic portal entries', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Tracking active signature authorizations on digital contract servers.', createdByName: 'Ravi Kumar', createdTime: '2024-01-05 01:30 PM' }
      ]
    },
    {
      id: 'D016', title: 'Shalini Gupta - REIT Investment', value: '₹10L',
      leadGeneratedTime: '2024-01-03 02:00 PM', leadGeneratedBy: 'Priya Agent', status: 'Pending',
      phone: '+91 44556 77889', email: 'shalini.gupta@email.com', loanType: 'REIT Investment', stage: 'Proposal',
      vertical: 'IE',
      notes: 'A private investor is evaluating automated yield-generating positions via high-quality listed Real Estate Investment Trust portfolios to secure predictable yield paths. Target capital resources allocated for this transactional layout trace to a validated baseline setup of ₹10L on accounting systems. The investment proposal balances target asset weights across three high-performing institutional platforms to optimize predictable distribution streams toward a 7-8% target grid. The applicant has reviewed preliminary configuration maps, submitting minor requests regarding capital gains legalizations and specific dividend structures. Next alignment syncs are live.',
      subtasks: [
        { id: 'SCRUM-191', work: 'Generate custom tax calculation scenario tables', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Modeling asset transfer gains parameters across clear investment holding limits.', createdByName: 'Priya Agent', createdTime: '2024-01-03 02:30 PM' },
        { id: 'SCRUM-192', work: 'Audit performance history for the three target REIT listings', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Analyzing historical net asset values to gauge real estate portfolio volatility.', createdByName: 'Ravi Kumar', createdTime: '2024-01-03 04:15 PM' },
        { id: 'SCRUM-193', work: 'Verify underlying office occupancy tracking ratios', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Checking physical lease tenures inside commercial properties in the fund.', createdByName: 'Amit Broker', createdTime: '2024-01-04 09:30 AM' },
        { id: 'SCRUM-194', work: 'Format custom dividend structural description sheets', priority: 'L', assignee: 'DK', status: 'TO DO', detailedNotes: 'Detailing distribution schedules and asset processing timelines for clarity.', createdByName: 'David DSA', createdTime: '2024-01-04 01:00 PM' },
        { id: 'SCRUM-195', work: 'Schedule alignment follow-up online conversations', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Organizing terminal syncs to review the final updated investment layout.', createdByName: 'Priya Agent', createdTime: '2024-01-04 03:45 PM' }
      ]
    },
    {
      id: 'D017', title: 'Prasad Rao - Commercial Lease', value: '₹1.8Cr',
      leadGeneratedTime: '2024-01-02 11:00 AM', leadGeneratedBy: 'Amit Broker', status: 'Pending',
      phone: '+91 33445 66778', email: 'prasad.rao@realty.com', loanType: 'Commercial Lease', stage: 'Proposal',
      vertical: 'RE',
      notes: 'A corporate tech entity requires localized office staging options to structure an engineering base spanning a targeted 5,000 square feet framework layout. Custom property evaluation packets outline three distinct real estate layouts with commercial term models variable between 36 and 60 months tracking limits. Indicated transaction target boundaries reflect standard local market rental metrics moving through a clear range of ₹60-75 every square foot interval. Field property reviews and spatial checks are finalized for two primary locations on the target shortlist. Internal finance departments are matching structural fit-out costs.',
      subtasks: [
        { id: 'SCRUM-196', work: 'Acquire detailed spatial layout blueprints from developers', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Reviewing physical structural boundaries and utility mapping points.', createdByName: 'Amit Broker', createdTime: '2024-01-02 11:30 AM' },
        { id: 'SCRUM-197', work: 'Analyze corporate construction and fit-out pricing data', priority: 'H', assignee: 'DK', status: 'TO DO', detailedNotes: 'Estimating total implementation costs for the engineering workspace setups.', createdByName: 'David DSA', createdTime: '2024-01-02 02:15 PM' },
        { id: 'SCRUM-198', work: 'Verify commercial lease renewal escalation structures', priority: 'M', assignee: 'RK', status: 'TO DO', detailedNotes: 'Reviewing compounded rental growth rates to protect corporate cash limits.', createdByName: 'Ravi Kumar', createdTime: '2024-01-03 10:00 AM' },
        { id: 'SCRUM-199', work: 'Cross-check zoning validation logs for tech setups', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Confirming high-density utility clearances with city planning offices.', createdByName: 'Priya Agent', createdTime: '2024-01-03 01:30 PM' },
        { id: 'SCRUM-200', work: 'Prepare executive property brief recommendation summaries', priority: 'H', assignee: 'AB', status: 'TO DO', detailedNotes: 'Compiling structural pricing sheets for corporate board review.', createdByName: 'Amit Broker', createdTime: '2024-01-03 04:20 PM' }
      ]
    },
  ]},
  { name: 'Negotiation', deals: [
    {
      id: 'D005', title: 'Vikram Singh - Property Loan', value: '₹1.2Cr',
      leadGeneratedTime: '2024-01-03 03:45 PM', leadGeneratedBy: 'Amit Broker', status: 'Active',
      phone: '+91 77665 54433', email: 'vikram.singh@realty.com', loanType: 'Home Loan', stage: 'Negotiation',
      vertical: 'RE',
      notes: 'The applicant is finalizing purchase terms for a premium 3BHK high-end real estate complex inside the Hyderabad zone valued at a confirmed baseline of ₹1.5Cr. Upfront asset down-payment resources matching the targeted ₹30L liquidity mark are verified as clear on bank systems. Current negotiation touchpoints focus on optimization metrics of processing rates, with the consumer targeting structural approvals below the 8.5% threshold. Preferred processing timelines stretch across a standard 20-year term block framework structure. Internal legal compliance checks and property verification tracks are clear, and credit review files are pending execution.',
      subtasks: [
        { id: 'SCRUM-201', work: 'Complete internal margin review calculations for pricing overrides', priority: 'H', assignee: 'AB', status: 'TO DO', detailedNotes: 'Evaluating minimum returns limits to allow customized mortgage rate structures.', createdByName: 'Amit Broker', createdTime: '2024-01-03 04:00 PM' },
        { id: 'SCRUM-202', work: 'Verify upfront cash asset availability records', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Confirming liquid balances on deposit portals to cover transaction targets.', createdByName: 'David DSA', createdTime: '2024-01-04 09:30 AM' },
        { id: 'SCRUM-203', work: 'Audit legal title certificates for the Hyderabad property', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Checking history logs to confirm the asset is free from legal liabilities.', createdByName: 'Ravi Kumar', createdTime: '2024-01-04 01:15 PM' },
        { id: 'SCRUM-204', work: 'Model alternative 20-year payment timeline parameters', priority: 'L', assignee: 'PA', status: 'TO DO', detailedNotes: 'Simulating performance changes under shifting structural timeline setups.', createdByName: 'Priya Agent', createdTime: '2024-01-04 04:30 PM' },
        { id: 'SCRUM-205', work: 'Assemble formal approval documentation packages', priority: 'M', assignee: 'AB', status: 'TO DO', detailedNotes: 'Structuring final compliance papers for executive signature routes.', createdByName: 'Amit Broker', createdTime: '2024-01-05 11:00 AM' }
      ]
    },
    {
      id: 'D018', title: 'Mohan Das - LAP', value: '₹35L',
      leadGeneratedTime: '2024-01-01 10:00 AM', leadGeneratedBy: 'David DSA', status: 'Active',
      phone: '+91 22334 55667', email: 'mohan.das@email.com', loanType: 'Loan Against Property', stage: 'Negotiation',
      vertical: 'LD',
      notes: 'A corporate consumer is engineering a capital liquidity facility backed by certified personal commercial real estate fields valued at a verified baseline scale of ₹70L. The credit request seeks a targeted processing volume of ₹35L, scaling precisely on an underwriting matrix tracking the 50% Loan-to-Value boundary. Core discussions target optimization of transactional setup charges along with structured interest concessions across the long-term loan infrastructure. Complete asset calculation evaluations and structural title mappings are verified as clear on internal records. Final administrative terms require confirmation prior to document printing updates.',
      subtasks: [
        { id: 'SCRUM-206', work: 'Acquire final clearance on processing fee adjustments', priority: 'M', assignee: 'DD', status: 'TO DO', detailedNotes: 'Securing management authorization to apply localized service fee overrides.', createdByName: 'David DSA', createdTime: '2024-01-01 10:30 AM' },
        { id: 'SCRUM-207', work: 'Verify technical real estate valuation metrics reports', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Confirming commercial building metrics match targeted liquidity criteria.', createdByName: 'Ravi Kumar', createdTime: '2024-01-01 02:00 PM' },
        { id: 'SCRUM-208', work: 'Review property tax history documentation logs', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Checking clear tax clearing records from the municipal land office.', createdByName: 'Priya Agent', createdTime: '2024-01-02 09:15 AM' },
        { id: 'SCRUM-209', work: 'Check corporate credit rating score parameters', priority: 'L', assignee: 'DK', status: 'TO DO', detailedNotes: 'Parsing institutional commercial reports for repayment patterns.', createdByName: 'David DSA', createdTime: '2024-01-02 01:45 PM' },
        { id: 'SCRUM-210', work: 'Prepare final administrative underwriting contract drafts', priority: 'H', assignee: 'DD', status: 'TO DO', detailedNotes: 'Finalizing text matrices ahead of contract generation updates.', createdByName: 'David DSA', createdTime: '2024-01-02 04:20 PM' }
      ]
    },
    {
      id: 'D019', title: 'Rekha Pillai - Portfolio Management', value: '₹20L',
      leadGeneratedTime: '2023-12-30 01:00 PM', leadGeneratedBy: 'Priya Agent', status: 'Active',
      phone: '+91 11223 44556', email: 'rekha.pillai@email.com', loanType: 'Portfolio Management', stage: 'Negotiation',
      vertical: 'IE',
      notes: 'An institutional asset holder is negotiating custom terms regarding professional Portfolio Management Services configurations for an assignable equity pool tracking at ₹20L. Detailed discussions prioritize alternative performance-incentivized margin parameters over standard annualized asset management pricing schedules. The targeted risk landscape is explicitly calibrated as growth-focused, filtering specific weights inside highly dynamic mid-cap and emerging small-cap equities tracking files. Legal partnership agreements and compliance guidelines are with risk review divisions for parameter validation.',
      subtasks: [
        { id: 'SCRUM-211', work: 'Run deep stress-test simulations on targeted small-cap assets', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Testing asset behavior models against severe global market corrections.', createdByName: 'Priya Agent', createdTime: '2023-12-30 01:30 PM' },
        { id: 'SCRUM-212', work: 'Draft customized performance fee incentive rate tiers', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Structuring milestone matrix profiles to align advisor payouts with capital gains.', createdByName: 'Ravi Kumar', createdTime: '2023-12-30 03:45 PM' },
        { id: 'SCRUM-213', work: 'Audit consumer risk profile declaration parameters', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Confirming asset management declarations match strict investment filters.', createdByName: 'David DSA', createdTime: '2023-12-31 10:15 AM' },
        { id: 'SCRUM-214', work: 'Cross-check model mid-cap holding concentration allocations', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Ensuring proper stock limits to avoid dangerous portfolio asset bubbles.', createdByName: 'Amit Broker', createdTime: '2023-12-31 01:00 PM' },
        { id: 'SCRUM-215', work: 'Review compliance legal partnership agreement terms', priority: 'H', assignee: 'PA', status: 'TO DO', detailedNotes: 'Finalizing structural portfolio fine-print clauses before delivery loops.', createdByName: 'Priya Agent', createdTime: '2023-12-31 04:30 PM' }
      ]
    },
    {
      id: 'D020', title: 'Sunil Joshi - Market Entry Consulting', value: '₹5L',
      leadGeneratedTime: '2023-12-28 03:00 PM', leadGeneratedBy: 'Ravi Kumar', status: 'Active',
      phone: '+91 99001 22334', email: 'sunil.joshi@company.com', loanType: 'Market Entry Consulting', stage: 'Negotiation',
      vertical: 'VC',
      notes: 'An offshore business operator is finalizing commercial agreements for professional localized market entry advisory support across the expanding India domestic trade space. The custom consulting framework includes specialized local governance regulatory configurations, transactional partner alignment structures, and structured Go-To-Market execution protocols. Fixed financial commitments indicate an operational baseline tracking scale of ₹5L distributed across a ninety-day intensive consulting roadmap. The entity is coordinating slight structural changes regarding field milestones, and final validation runs are processing.',
      subtasks: [
        { id: 'SCRUM-216', work: 'Approve legal Statement of Work definitions across legal teams', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Resolving delivery milestone wording configurations with external counsel.', createdByName: 'Ravi Kumar', createdTime: '2023-12-28 03:30 PM' },
        { id: 'SCRUM-217', work: 'Map corporate compliance paths for national trading spaces', priority: 'M', assignee: 'PA', status: 'TO DO', detailedNotes: 'Detailing registration mandates with central trade regulatory boards.', createdByName: 'Priya Agent', createdTime: '2023-12-29 09:15 AM' },
        { id: 'SCRUM-218', work: 'Formulate specialized 90-day advisory execution schedules', priority: 'M', assignee: 'DK', status: 'TO DO', detailedNotes: 'Assembling sequence blocks to coordinate regional operational support workflows.', createdByName: 'David DSA', createdTime: '2023-12-29 01:45 PM' },
        { id: 'SCRUM-219', work: 'Verify commercial partner company identity credentials', priority: 'L', assignee: 'AB', status: 'TO DO', detailedNotes: 'Executing automated legal health checks across corporate databases.', createdByName: 'Amit Broker', createdTime: '2023-12-29 04:10 PM' },
        { id: 'SCRUM-220', work: 'Draft localized tax structuring advisory sheets', priority: 'H', assignee: 'RK', status: 'TO DO', detailedNotes: 'Formulating strategic operational configurations to prevent duplicate exposures.', createdByName: 'Ravi Kumar', createdTime: '2023-12-30 11:30 AM' }
      ]
    },
  ]},
];

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-orange-100 text-orange-700',
  'Active': 'bg-green-100 text-green-700',
};

const STORAGE_KEY = 'kanban_columns_order';

function loadColumns(): Column[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialColumns;
    const savedOrder: { name: string; dealIds: string[] }[] = JSON.parse(saved);
    // Build a flat map of all deals by id from initialColumns
    const allDeals: Record<string, Deal> = {};
    initialColumns.forEach(col => col.deals.forEach(d => { allDeals[d.id] = d; }));
    return savedOrder.map(savedCol => {
      const original = initialColumns.find(c => c.name === savedCol.name);
      if (!original) return initialColumns[0];
      const orderedDeals = savedCol.dealIds
        .map(id => allDeals[id])
        .filter(Boolean) as Deal[];
      return { ...original, deals: orderedDeals };
    });
  } catch {
    return initialColumns;
  }
}

function saveColumns(cols: Column[]) {
  const order = cols.map(c => ({ name: c.name, dealIds: c.deals.map(d => d.id) }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
}

export const KanbanPage: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(loadColumns);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<{ deal: Deal; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  
  // States to keep track of active selection overrides from subtask clicks
  const [activeNotes, setActiveNotes] = useState<string>('');
  const [activeAssignee, setActiveAssignee] = useState<string>('');
  const [activeCreatedBy, setActiveCreatedBy] = useState<string>('');
  const [activeCreatedTime, setActiveCreatedTime] = useState<string>('');
  
  const { activeVertical, searchQuery } = useVerticalFilter();

  const handleDragStart = (deal: Deal, colName: string) => {
    setDraggedDeal({ deal, fromCol: colName });
  };

  const handleDrop = (toColName: string) => {
    if (!draggedDeal || draggedDeal.fromCol === toColName) {
      setDraggedDeal(null);
      setDragOverCol(null);
      return;
    }
    setColumns(prev => {
      const next = prev.map(col => {
        if (col.name === draggedDeal.fromCol) return { ...col, deals: col.deals.filter(d => d.id !== draggedDeal.deal.id) };
        if (col.name === toColName) return { ...col, deals: [...col.deals, draggedDeal.deal] };
        return col;
      });
      saveColumns(next);
      return next;
    });
    setDraggedDeal(null);
    setDragOverCol(null);
  };

  const handleDealSelect = (deal: Deal) => {
    setSelectedDeal(deal);
    // Initialize temporary display states using root deal information
    setActiveNotes(deal.notes);
    setActiveAssignee(deal.leadGeneratedBy.toUpperCase());
    setActiveCreatedBy(deal.leadGeneratedBy);
    setActiveCreatedTime(deal.leadGeneratedTime);
  };

  const handleSubtaskClick = (task: Subtask) => {
    if (task.detailedNotes) setActiveNotes(task.detailedNotes);
    if (task.assignee) setActiveAssignee(task.assignee.toUpperCase());
    if (task.createdByName) setActiveCreatedBy(task.createdByName);
    if (task.createdTime) setActiveCreatedTime(task.createdTime);
  };

  const filteredColumns = columns.map(col => {
    const q = (searchQuery || '').toLowerCase().trim();
    return {
      ...col,
      deals: col.deals.filter(d => {
        if (d.vertical !== activeVertical) return false;
        if (!q) return true;
        return (
          d.id.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.loanType.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q)
        );
      }),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Acquisition</h1>
        <p className="text-muted-foreground">Visual pipeline management</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filteredColumns.map((column) => (
          <Card
            key={column.name}
            className={`transition-colors ${dragOverCol === column.name ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOverCol(column.name); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={() => handleDrop(column.name)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{column.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {column.deals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => handleDragStart(deal, column.name)}
                  className="p-3 bg-white dark:bg-muted border border-border rounded-xl cursor-grab active:cursor-grabbing active:opacity-50 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-primary">{deal.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[deal.status] ?? 'bg-gray-100 text-gray-600'}`}>{deal.status}</span>
                  </div>
                  <div className="text-sm font-semibold leading-snug mb-1">{deal.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1.5 line-clamp-6">{deal.notes}</p>
                  <div className="text-xs text-muted-foreground mb-0.5">{deal.loanType}</div>
                  <div className="text-xs text-muted-foreground mb-0.5">{deal.email}</div>
                  <div className="text-xs text-muted-foreground mb-2">{deal.phone}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Badge className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white border-0">{deal.value}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-3"
                      onClick={(e) => { e.stopPropagation(); handleDealSelect(deal); }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal — Jira/Linear style two-panel */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedDeal(null)}>
          <div
            className="bg-background rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-border"
            onClick={e => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>Pipeline</span>
                <span>/</span>
                <span className="font-semibold text-foreground">{selectedDeal.id}</span>
              </div>
              <button onClick={() => setSelectedDeal(null)} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Two-panel body */}
            <div className="flex flex-1 overflow-hidden">
              {/* LEFT PANEL */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 border-r border-border">
                <h2 className="text-xl font-bold leading-snug">{selectedDeal.title}</h2>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1.5 rounded-md font-semibold flex items-center gap-1 cursor-pointer ${statusColors[selectedDeal.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {selectedDeal.status} <ChevronDown className="w-3 h-3" />
                  </span>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <TrendingUp className="w-3 h-3" /> Move Stage
                  </Button>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-4 font-normal text-justify">
                    {activeNotes}
                  </p>
                </div>

                {/* Subtasks Section — Styled exactly to match Jira/Scrum list screenshot */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                        Subtasks
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <span>0% Done</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 w-0 transition-all duration-300" />
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                    <table className="w-full border-collapse text-left text-xs text-muted-foreground">
                      <thead>
                        <tr className="bg-muted/40 border-b font-semibold text-foreground">
                          <th className="p-2.5 w-24">Key</th>
                          <th className="p-2.5">Work</th>
                          <th className="p-2.5 w-16 text-center">Priority</th>
                          <th className="p-2.5 w-20 text-center">Assignee</th>
                          <th className="p-2.5 w-24 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-zinc-700 dark:text-zinc-300">
                        {selectedDeal.subtasks && selectedDeal.subtasks.length > 0 ? (
                          selectedDeal.subtasks.map((task) => (
                            <tr 
                              key={task.id} 
                              onClick={() => handleSubtaskClick(task)}
                              className="hover:bg-muted/30 transition-colors cursor-pointer"
                            >
                              <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                                <span className="flex items-center gap-1.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                                  {task.id}
                                </span>
                              </td>
                              <td className="p-2.5 font-medium text-foreground truncate max-w-xs">{task.work}</td>
                              <td className="p-2.5 text-center font-bold text-orange-600 whitespace-nowrap">
                                <span className="inline-flex items-center justify-center gap-1">
                                  <span className="text-lg leading-none">=</span> {task.priority}
                                </span>
                              </td>
                              <td className="p-2.5 text-center">
                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-[10px] font-bold text-white uppercase" title={task.assignee}>
                                  {task.assignee}
                                </div>
                              </td>
                              <td className="p-2.5 text-center whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border px-2 py-0.5 rounded text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                  {task.status} <ChevronDown className="w-3 h-3 opacity-60" />
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-4 text-center text-xs text-muted-foreground">
                              No subtasks configured for this deal matrix. Click Add to map requirements.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contact info */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{selectedDeal.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{selectedDeal.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="w-72 shrink-0 overflow-y-auto px-5 py-5 bg-muted/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Details</h3>
                  <Settings className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[9px] text-white flex items-center justify-center font-bold">
                          {activeAssignee.substring(0, 2)}
                        </span>
                        {activeAssignee}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Type</p>
                      <p className="text-sm font-medium mt-0.5 text-foreground">{selectedDeal.loanType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deal Value</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{selectedDeal.value}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Stage</p>
                      <p className="text-sm font-medium mt-0.5 text-foreground">{selectedDeal.stage}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Due date</p>
                      <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                        ⚠️ May 23, 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border text-[11px] text-muted-foreground space-y-1">
                  <p>Created by <span className="font-medium text-foreground">{activeCreatedBy}</span></p>
                  <p>{activeCreatedTime}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-border bg-muted/30">
              <Button variant="outline" size="sm" onClick={() => setSelectedDeal(null)}>Cancel</Button>
              <Button size="sm" onClick={() => setSelectedDeal(null)}>Save & Continue</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AutomationPage: React.FC = () => {
  const rules = [
    { id: 1, name: 'Auto-assign leads', trigger: 'New lead created', action: 'Assign to available agent', status: 'Active' },
    { id: 2, name: 'Follow-up reminder', trigger: 'No activity for 3 days', action: 'Send email reminder', status: 'Active' },
    { id: 3, name: 'Document expiry alert', trigger: '7 days before expiry', action: 'Notify agent & customer', status: 'Active' },
    { id: 4, name: 'Deal won notification', trigger: 'Deal status = Won', action: 'Send congratulations email', status: 'Paused' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automation Rules</h1>
        <p className="text-muted-foreground">Configure workflow automation</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Active Automation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{rule.name}</h4>
                  <Badge variant={rule.status === 'Active' ? 'default' : 'outline'}>{rule.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div><strong>Trigger:</strong> {rule.trigger}</div>
                  <div><strong>Action:</strong> {rule.action}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SLATrackingPage: React.FC = () => {
  const slas = [
    { id: 1, metric: 'Lead Response Time', target: '< 2 hours', current: '1.5 hours', status: 'Met', compliance: '95%' },
    { id: 2, metric: 'Loan Processing Time', target: '< 5 days', current: '4.2 days', status: 'Met', compliance: '88%' },
    { id: 3, metric: 'Document Verification', target: '< 24 hours', current: '28 hours', status: 'Breached', compliance: '72%' },
    { id: 4, metric: 'Customer Query Response', target: '< 4 hours', current: '3.1 hours', status: 'Met', compliance: '92%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SLA Tracking</h1>
        <p className="text-muted-foreground">Monitor service level agreements</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            SLA Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Metric</th>
                  <th className="text-left p-3">Target</th>
                  <th className="text-left p-3">Current</th>
                  <th className="text-left p-3">Compliance</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {slas.map((sla) => (
                  <tr key={sla.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{sla.metric}</td>
                    <td className="p-3">{sla.target}</td>
                    <td className="p-3">{sla.current}</td>
                    <td className="p-3">{sla.compliance}</td>
                    <td className="p-3">
                      <Badge variant={sla.status === 'Met' ? 'default' : 'destructive'}>{sla.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
