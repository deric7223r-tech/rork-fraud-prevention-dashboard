export type RAGStatus = 'green' | 'amber' | 'red';

export interface Initiative {
  id: string;
  name: string;
  owner: string;
  status: RAGStatus;
  percentComplete: number;
  lastUpdate: string;
  nextMilestone: string;
}

export interface RiskItem {
  id: string;
  name: string;
  severity: RAGStatus;
  category: string;
}

export interface RiskCategory {
  name: string;
  level: string;
  risks: RiskItem[];
}

export interface ComplianceSection {
  id: string;
  section: string;
  status: RAGStatus;
  evidence: string;
  gap: string;
}

export interface TeamMember {
  id: string;
  name: string;
  department: string;
  assignedTasks: number;
  completion: number;
}

export interface DepartmentTraining {
  id: string;
  department: string;
  progress: number;
  status: RAGStatus;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  month: string;
}

export const executiveSummary = {
  overallStatus: 'amber' as RAGStatus,
  implementationProgress: 65,
  daysSinceLaunch: 45,
  totalDays: 90,
  criticalRisks: 12,
  controlsImplemented: 34,
  totalControls: 48,
  staffTrainingCompletion: 42,
  govS013Compliance: 88,
};

export const initiatives: Initiative[] = [
  {
    id: '1',
    name: 'Risk Assessment',
    owner: 'Risk Officer',
    status: 'green',
    percentComplete: 100,
    lastUpdate: 'Mar 15',
    nextMilestone: 'Quarterly Review',
  },
  {
    id: '2',
    name: 'Public Sector Compliance',
    owner: 'Compliance Lead',
    status: 'amber',
    percentComplete: 85,
    lastUpdate: 'Mar 20',
    nextMilestone: 'GovS-013 Audit',
  },
  {
    id: '3',
    name: 'Fraud Team Establishment',
    owner: 'HR Director',
    status: 'green',
    percentComplete: 100,
    lastUpdate: 'Mar 10',
    nextMilestone: 'Team Training',
  },
  {
    id: '4',
    name: 'Policy Updates',
    owner: 'Legal Counsel',
    status: 'amber',
    percentComplete: 70,
    lastUpdate: 'Mar 18',
    nextMilestone: 'Board Approval',
  },
  {
    id: '5',
    name: 'Monitoring Technology',
    owner: 'IT Director',
    status: 'red',
    percentComplete: 40,
    lastUpdate: 'Mar 22',
    nextMilestone: 'System Testing',
  },
  {
    id: '6',
    name: 'Staff Training Program',
    owner: 'L&D Manager',
    status: 'amber',
    percentComplete: 65,
    lastUpdate: 'Mar 25',
    nextMilestone: 'Dept Rollout',
  },
  {
    id: '7',
    name: 'Reporting Channels',
    owner: 'Governance Lead',
    status: 'green',
    percentComplete: 100,
    lastUpdate: 'Mar 5',
    nextMilestone: 'Awareness Campaign',
  },
  {
    id: '8',
    name: 'Regular Reviews',
    owner: 'Fraud Risk Owner',
    status: 'amber',
    percentComplete: 50,
    lastUpdate: 'Mar 15',
    nextMilestone: 'Q1 Assessment',
  },
];

export const riskCategories: RiskCategory[] = [
  {
    name: 'Procurement Risks',
    level: 'High',
    risks: [
      { id: 'p1', name: 'Fake Suppliers', severity: 'red', category: 'Procurement' },
      { id: 'p2', name: 'Inflated Pricing', severity: 'amber', category: 'Procurement' },
      { id: 'p3', name: 'Bid Rigging', severity: 'amber', category: 'Procurement' },
    ],
  },
  {
    name: 'Payroll Risks',
    level: 'Medium',
    risks: [
      { id: 'pr1', name: 'Ghost Employees', severity: 'green', category: 'Payroll' },
      { id: 'pr2', name: 'Timesheet Fraud', severity: 'amber', category: 'Payroll' },
      { id: 'pr3', name: 'Expense Fraud', severity: 'amber', category: 'Payroll' },
    ],
  },
  {
    name: 'Digital Systems',
    level: 'High',
    risks: [
      { id: 'd1', name: 'Email Compromise', severity: 'red', category: 'Digital' },
      { id: 'd2', name: 'Data Theft', severity: 'amber', category: 'Digital' },
      { id: 'd3', name: 'System Manipulation', severity: 'red', category: 'Digital' },
    ],
  },
];

export const complianceSections: ComplianceSection[] = [
  { id: '1', section: '1. Leadership', status: 'green', evidence: 'Board resolution', gap: 'None' },
  { id: '2', section: '2. Assessment', status: 'green', evidence: 'Risk register', gap: 'None' },
  { id: '3', section: '3. Prevention', status: 'amber', evidence: 'Policies updated', gap: 'Tech controls' },
  { id: '4', section: '4. Detection', status: 'red', evidence: 'Monitoring system', gap: 'Implementation delay' },
  { id: '5', section: '5. Response', status: 'amber', evidence: 'Response plan', gap: 'Testing required' },
  { id: '6', section: '6. Governance', status: 'green', evidence: 'Steering committee', gap: 'None' },
];

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Jane Smith', department: 'Finance', assignedTasks: 12, completion: 92 },
  { id: '2', name: 'Raj Patel', department: 'IT', assignedTasks: 8, completion: 50 },
  { id: '3', name: 'Maria Chen', department: 'HR', assignedTasks: 6, completion: 100 },
  { id: '4', name: 'David Jones', department: 'Legal', assignedTasks: 10, completion: 70 },
];

export const departmentTraining: DepartmentTraining[] = [
  { id: '1', department: 'Executive Team', progress: 100, status: 'green' },
  { id: '2', department: 'Finance Dept', progress: 85, status: 'amber' },
  { id: '3', department: 'Procurement', progress: 60, status: 'amber' },
  { id: '4', department: 'HR/Payroll', progress: 45, status: 'amber' },
  { id: '5', department: 'Operations', progress: 30, status: 'red' },
  { id: '6', department: 'All Other Staff', progress: 25, status: 'red' },
];

export const techImplementation = [
  { id: '1', name: 'Transaction Monitoring', status: 'red' as RAGStatus, progress: 40, detail: 'Delayed' },
  { id: '2', name: 'Anomaly Detection', status: 'amber' as RAGStatus, progress: 65, detail: 'Testing' },
  { id: '3', name: 'Duplicate Payment Check', status: 'green' as RAGStatus, progress: 100, detail: 'Live' },
  { id: '4', name: 'Supplier Verification', status: 'amber' as RAGStatus, progress: 75, detail: 'Configuring' },
];

export const whistleblowingStats = {
  totalReports: 12,
  anonymous: 8,
  anonymousPercent: 67,
  substantiated: 3,
  substantiatedPercent: 25,
  avgResolutionDays: 14,
  sentiment: 'Positive',
};

export const upcomingDeadlines: { month: string; items: Deadline[] }[] = [
  {
    month: 'April 2024',
    items: [
      { id: 'a1', title: 'Q1 Fraud Risk Assessment', date: 'Apr 15', month: 'April' },
      { id: 'a2', title: 'Policy Review Committee', date: 'Apr 22', month: 'April' },
      { id: 'a3', title: 'Board Progress Report', date: 'Apr 30', month: 'April' },
    ],
  },
  {
    month: 'May 2024',
    items: [
      { id: 'm1', title: 'Control Testing Cycle', date: 'May 10', month: 'May' },
      { id: 'm2', title: 'Staff Training Refresh', date: 'May 20', month: 'May' },
      { id: 'm3', title: 'External Audit Prep', date: 'May 27', month: 'May' },
    ],
  },
];

export interface FormSubmissionData {
  id: string;
  formType: string;
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
  data: any;
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
  referenceId?: string;
}
