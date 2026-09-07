/**
 * EDGE AMS Control Tower — Canonical Time Management Store
 * Single Source of Truth for Leave, Remote Work, Availability, and Timesheets.
 * 
 * Interconnections:
 * Resource Master (RESOURCES)
 *   ↓
 * Leave Records & Applications (Validated working days, conflict-checked backup)
 *   ↓
 * Approval Workspace (Approve / Reject / Cancel)
 *   ↓
 * Resource Temporal Availability (On Leave status during active dates)
 *   ↓
 * Global Calendar (Normalized Leave Events)
 *   ↓
 * Onsite Coverage Compliance (HEADCOUNT & Gap telemetry)
 *   ↓
 * Timesheet Pre-population (Auto-populated 8h leave on affected dates)
 */

import { RESOURCES } from './demoData';

const LEAVE_STORAGE_KEY = 'edge-time-management-leave';
const REMOTE_WORK_STORAGE_KEY = 'edge-time-management-remote-work';
const TIMESHEET_STORAGE_KEY = 'edge-time-management-timesheet';

// ── Working Days Calculation (Excluding Saturday & Sunday) ──
export function calculateWorkingDays(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    // 0 = Sunday, 6 = Saturday in standard JS
    if (day !== 0 && day !== 6) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

// ── Canonical Initial Leave Records (14 realistic demo records) ──
const INITIAL_LEAVE_RECORDS = [
  {
    id: 'LV-00001',
    resourceId: 'RES-005',
    resourceName: 'Priya Nair',
    role: 'Functional Consultant',
    businessDomain: 'E2M',
    processGroup: 'Production Planning',
    location: 'Offshore',
    leaveType: 'Annual Leave',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    days: 3,
    reason: 'Annual family leave and relocation assistance.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-013',
    backupResourceName: 'Hassan Al Nuaimi',
    backupResourceDomain: 'E2M',
    status: 'Approved',
    submittedDate: '2026-08-28',
    approvedDate: '2026-08-29',
    coverageNotes: 'E2M plant floor ticket queue delegated to Hassan Al Nuaimi. Primary escalation to General Shift.',
    workflow: [
      { step: 'Submitted', date: '2026-08-28', by: 'Priya Nair', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-28', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-29', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-29', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-29', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00002',
    resourceId: 'RES-007',
    resourceName: 'Deepak Kumar',
    role: 'Functional Consultant',
    businessDomain: 'R2R',
    processGroup: 'Management Accounting',
    location: 'Offshore',
    leaveType: 'Training Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-16',
    days: 3,
    reason: 'Advanced SAP S/4HANA Group Reporting certification course.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-025',
    backupResourceName: 'Mansour Al Hosani',
    backupResourceDomain: 'R2R',
    status: 'Pending Approval',
    submittedDate: '2026-09-02',
    coverageNotes: 'Financial controlling escalation handover to Mansour Al Hosani.',
    workflow: [
      { step: 'Submitted', date: '2026-09-02', by: 'Deepak Kumar', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-02', by: 'Fatima Al Zaabi', status: 'Active' },
      { step: 'Approved', status: 'Pending' },
      { step: 'Calendar Updated', status: 'Pending' },
      { step: 'Availability Updated', status: 'Pending' }
    ]
  },
  {
    id: 'LV-00003',
    resourceId: 'RES-004',
    resourceName: 'Sara Al Marzouqi',
    role: 'Functional Consultant',
    businessDomain: 'H2R',
    processGroup: 'Talent Management',
    location: 'Onsite',
    leaveType: 'Annual Leave',
    startDate: '2026-09-18',
    endDate: '2026-09-24',
    days: 5,
    reason: 'Annual vacation during non-payroll freeze window.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-016',
    backupResourceName: 'Raj Malhotra',
    backupResourceDomain: 'H2R',
    status: 'Pending Approval',
    submittedDate: '2026-09-03',
    coverageNotes: 'SuccessFactors HXM queue monitored by Raj Malhotra and Layla Al Qassimi.',
    workflow: [
      { step: 'Submitted', date: '2026-09-03', by: 'Sara Al Marzouqi', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-03', by: 'Fatima Al Zaabi', status: 'Active' },
      { step: 'Approved', status: 'Pending' },
      { step: 'Calendar Updated', status: 'Pending' },
      { step: 'Availability Updated', status: 'Pending' }
    ]
  },
  {
    id: 'LV-00004',
    resourceId: 'RES-006',
    resourceName: 'Omar Bashar',
    role: 'Functional Consultant',
    businessDomain: 'D2S',
    processGroup: 'Warehouse Management',
    location: 'Onsite',
    leaveType: 'Annual Leave',
    startDate: '2026-09-07',
    endDate: '2026-09-11',
    days: 5,
    reason: 'Scheduled annual leave.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-018',
    backupResourceName: 'Vikram Singh',
    backupResourceDomain: 'D2S',
    status: 'Approved',
    submittedDate: '2026-08-20',
    approvedDate: '2026-08-21',
    coverageNotes: 'EWM warehouse dispatch on-call covered by Vikram Singh.',
    workflow: [
      { step: 'Submitted', date: '2026-08-20', by: 'Omar Bashar', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-20', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-21', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-21', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-21', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00005',
    resourceId: 'RES-001',
    resourceName: 'Khalid Al Hashimi',
    role: 'Functional Consultant',
    businessDomain: 'L2C',
    processGroup: 'Sales & Distribution',
    location: 'Onsite',
    leaveType: 'Annual Leave',
    startDate: '2026-09-21',
    endDate: '2026-09-25',
    days: 5,
    reason: 'Personal leave and annual rest.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-019',
    backupResourceName: 'Hind Al Mazrouei',
    backupResourceDomain: 'L2C',
    status: 'Pending Approval',
    submittedDate: '2026-09-04',
    coverageNotes: 'Sales order and billing queues delegated to Hind Al Mazrouei.',
    workflow: [
      { step: 'Submitted', date: '2026-09-04', by: 'Khalid Al Hashimi', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-04', by: 'Fatima Al Zaabi', status: 'Active' },
      { step: 'Approved', status: 'Pending' },
      { step: 'Calendar Updated', status: 'Pending' },
      { step: 'Availability Updated', status: 'Pending' }
    ]
  },
  {
    id: 'LV-00006',
    resourceId: 'RES-028',
    resourceName: 'Amira Hassan',
    role: 'Functional Consultant',
    businessDomain: 'D2S',
    processGroup: 'Warehouse Management',
    location: 'Offshore',
    leaveType: 'Emergency Leave',
    startDate: '2026-09-08',
    endDate: '2026-09-10',
    days: 3,
    reason: 'Unplanned medical recovery and short-notice leave.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-006',
    backupResourceName: 'Omar Bashar',
    backupResourceDomain: 'D2S',
    status: 'Pending Approval',
    submittedDate: '2026-09-05',
    coverageNotes: 'Conflict warning: Omar Bashar is already scheduled on approved leave (LV-00004: Sep 07–11). Backup re-allocation required.',
    backupConflict: true,
    backupConflictDetails: 'Omar Bashar is unavailable during this leave period (Approved Leave LV-00004: 2026-09-07 to 2026-09-11).',
    workflow: [
      { step: 'Submitted', date: '2026-09-05', by: 'Amira Hassan', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-05', by: 'Fatima Al Zaabi', status: 'Active' },
      { step: 'Approved', status: 'Pending' },
      { step: 'Calendar Updated', status: 'Pending' },
      { step: 'Availability Updated', status: 'Pending' }
    ]
  },
  {
    id: 'LV-00007',
    resourceId: 'RES-003',
    resourceName: 'Ravi Shankar',
    role: 'Functional Consultant',
    businessDomain: 'P2P',
    processGroup: 'Procurement',
    location: 'Offshore',
    leaveType: 'Sick Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    days: 3,
    reason: 'Medical appointment and recovery rest.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-021',
    backupResourceName: 'Abdulrahman Darwish',
    backupResourceDomain: 'P2P',
    status: 'Approved',
    submittedDate: '2026-08-31',
    approvedDate: '2026-08-31',
    coverageNotes: 'Procurement PO approvals routed to Abdulrahman Darwish.',
    workflow: [
      { step: 'Submitted', date: '2026-08-31', by: 'Ravi Shankar', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-31', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-31', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-31', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-31', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00008',
    resourceId: 'RES-008',
    resourceName: 'Noura Al Shamsi',
    role: 'Functional Consultant',
    businessDomain: 'S2P',
    processGroup: 'Strategic Sourcing',
    location: 'Onsite',
    leaveType: 'Exam / Certification',
    startDate: '2026-09-28',
    endDate: '2026-09-29',
    days: 2,
    reason: 'SAP Ariba Guided Sourcing Certification Board examination.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-010',
    backupResourceName: 'Aisha Khalfan',
    backupResourceDomain: 'S2P',
    status: 'Approved',
    submittedDate: '2026-09-01',
    approvedDate: '2026-09-02',
    coverageNotes: 'Sourcing contract workspaces monitored by Aisha Khalfan.',
    workflow: [
      { step: 'Submitted', date: '2026-09-01', by: 'Noura Al Shamsi', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-01', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-09-02', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-09-02', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-09-02', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00009',
    resourceId: 'RES-015',
    resourceName: 'Tariq Al Dhaheri',
    role: 'Functional Consultant',
    businessDomain: 'A2D',
    processGroup: 'Asset Management',
    location: 'Onsite',
    leaveType: 'Training Leave',
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    days: 3,
    reason: 'SAP EAM mobile work manager inspection training.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-023',
    backupResourceName: 'Yousuf Al Kaabi',
    backupResourceDomain: 'A2D',
    status: 'Approved',
    submittedDate: '2026-08-25',
    approvedDate: '2026-08-26',
    coverageNotes: 'Plant maintenance emergency dispatch transferred to Yousuf Al Kaabi.',
    workflow: [
      { step: 'Submitted', date: '2026-08-25', by: 'Tariq Al Dhaheri', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-25', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-26', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-26', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-26', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00010',
    resourceId: 'RES-011',
    resourceName: 'Mohammed Al Kindi',
    role: 'Functional Consultant',
    businessDomain: 'L2C',
    processGroup: 'Billing & Invoicing',
    location: 'Offshore',
    leaveType: 'Annual Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    days: 5,
    reason: 'Annual break following billing month-end close stabilization.',
    approver: 'Khalid Al Hashimi',
    approverId: 'RES-001',
    backupResourceId: 'RES-024',
    backupResourceName: 'Pooja Sharma',
    backupResourceDomain: 'L2C',
    status: 'Approved',
    submittedDate: '2026-08-22',
    approvedDate: '2026-08-23',
    coverageNotes: 'Billing batch exceptions monitored by Pooja Sharma.',
    workflow: [
      { step: 'Submitted', date: '2026-08-22', by: 'Mohammed Al Kindi', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-22', by: 'Khalid Al Hashimi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-23', by: 'Khalid Al Hashimi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-23', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-23', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00011',
    resourceId: 'RES-020',
    resourceName: 'Suresh Krishnan',
    role: 'BASIS Consultant',
    businessDomain: 'E2M',
    processGroup: 'Production Planning',
    location: 'Offshore',
    leaveType: 'Annual Leave',
    startDate: '2026-09-02',
    endDate: '2026-09-04',
    days: 3,
    reason: 'Annual leave.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-009',
    backupResourceName: 'Ankit Patel',
    backupResourceDomain: 'E2M',
    status: 'Approved',
    submittedDate: '2026-08-15',
    approvedDate: '2026-08-16',
    coverageNotes: 'HANA memory dumps and batch locks escalated to Ankit Patel.',
    workflow: [
      { step: 'Submitted', date: '2026-08-15', by: 'Suresh Krishnan', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-08-15', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-08-16', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-08-16', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-08-16', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00012',
    resourceId: 'RES-017',
    resourceName: 'Mariam Al Suwaidi',
    role: 'Senior Consultant',
    businessDomain: 'R2R',
    processGroup: 'Financial Accounting',
    location: 'Onsite',
    leaveType: 'Emergency Leave',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    days: 2,
    reason: 'Urgent family obligation.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-002',
    backupResourceName: 'Fatima Al Zaabi',
    backupResourceDomain: 'R2R',
    status: 'Approved',
    submittedDate: '2026-09-07',
    approvedDate: '2026-09-07',
    coverageNotes: 'General ledger journal vouchers reviewed directly by Fatima Al Zaabi.',
    workflow: [
      { step: 'Submitted', date: '2026-09-07', by: 'Mariam Al Suwaidi', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-07', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Approved', date: '2026-09-07', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Calendar Updated', date: '2026-09-07', by: 'System', status: 'Completed' },
      { step: 'Availability Updated', date: '2026-09-07', by: 'System', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00013',
    resourceId: 'RES-027',
    resourceName: 'Sultan Al Dhahiri',
    role: 'Functional Consultant',
    businessDomain: 'E2M',
    processGroup: 'Quality Management',
    location: 'Onsite',
    leaveType: 'Annual Leave',
    startDate: '2026-09-28',
    endDate: '2026-10-02',
    days: 5,
    reason: 'Planned annual leave during manufacturing maintenance.',
    approver: 'Fatima Al Zaabi',
    approverId: 'RES-002',
    backupResourceId: 'RES-013',
    backupResourceName: 'Hassan Al Nuaimi',
    backupResourceDomain: 'E2M',
    status: 'Rejected',
    rejectionReason: 'Operational coverage requirement during HALCON shopfloor audit window.',
    submittedDate: '2026-09-01',
    rejectedDate: '2026-09-02',
    coverageNotes: 'Rejection retained in operational audit history.',
    workflow: [
      { step: 'Submitted', date: '2026-09-01', by: 'Sultan Al Dhahiri', status: 'Completed' },
      { step: 'Pending Approval', date: '2026-09-01', by: 'Fatima Al Zaabi', status: 'Completed' },
      { step: 'Rejected', date: '2026-09-02', by: 'Fatima Al Zaabi', status: 'Completed' }
    ]
  },
  {
    id: 'LV-00014',
    resourceId: 'RES-014',
    resourceName: 'Sunita Reddy',
    role: 'ABAP Developer',
    businessDomain: 'P2P',
    processGroup: 'Invoice Processing',
    location: 'Offshore',
    leaveType: 'Annual Leave',
    startDate: '2026-09-21',
    endDate: '2026-09-23',
    days: 3,
    reason: 'Personal travel plans.',
    approver: 'Ravi Shankar',
    approverId: 'RES-003',
    backupResourceId: 'RES-026',
    backupResourceName: 'Nisha Varma',
    backupResourceDomain: 'S2P',
    status: 'Cancelled',
    submittedDate: '2026-08-30',
    cancelledDate: '2026-09-02',
    coverageNotes: 'Request cancelled by applicant due to release reschedule.',
    workflow: [
      { step: 'Submitted', date: '2026-08-30', by: 'Sunita Reddy', status: 'Completed' },
      { step: 'Cancelled', date: '2026-09-02', by: 'Sunita Reddy', status: 'Completed' }
    ]
  }
];

// ── Canonical Initial Remote Work Records ──
const INITIAL_REMOTE_WORK_RECORDS = [
  {
    id: 'RW-00001',
    resourceId: 'RES-001',
    resourceName: 'Khalid Al Hashimi',
    businessDomain: 'L2C',
    date: '2026-09-08',
    location: 'Remote (Abu Dhabi Residence)',
    reason: 'Client system cutover night shift alignment.',
    approver: 'Fatima Al Zaabi',
    status: 'Approved',
    submittedDate: '2026-09-05'
  },
  {
    id: 'RW-00002',
    resourceId: 'RES-004',
    resourceName: 'Sara Al Marzouqi',
    businessDomain: 'H2R',
    date: '2026-09-09',
    location: 'Remote (Dubai Hub)',
    reason: 'Cross-entity recruitment interview coordination.',
    approver: 'Fatima Al Zaabi',
    status: 'Approved',
    submittedDate: '2026-09-06'
  }
];

// ── Reactive Subscriptions System ──
const listeners = new Set();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error('TimeManagement store notification error:', err);
    }
  });
}

export function subscribeTimeManagement(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// ── LocalStorage Helpers ──
function loadLeaves() {
  try {
    const raw = localStorage.getItem(LEAVE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read leave data from localStorage', e);
  }
  return [...INITIAL_LEAVE_RECORDS];
}

function saveLeaves(leaves) {
  try {
    localStorage.setItem(LEAVE_STORAGE_KEY, JSON.stringify(leaves));
  } catch (e) {
    console.warn('Could not save leave data to localStorage', e);
  }
  notifyListeners();
}

function loadRemoteWork() {
  try {
    const raw = localStorage.getItem(REMOTE_WORK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read remote work data', e);
  }
  return [...INITIAL_REMOTE_WORK_RECORDS];
}

function saveRemoteWork(records) {
  try {
    localStorage.setItem(REMOTE_WORK_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Could not save remote work data', e);
  }
  notifyListeners();
}

// ── Master Queries ──
export function getLeaveRecords() {
  return loadLeaves();
}

export function getLeaveKPIs() {
  const records = loadLeaves();
  const requestsApplied = records.length;
  const approved = records.filter(r => r.status === 'Approved').length;
  const pendingApproval = records.filter(r => r.status === 'Pending Approval').length;
  const rejectedCancelled = records.filter(r => r.status === 'Rejected' || r.status === 'Cancelled').length;

  // Total working days across active leave requests (Approved + Pending)
  const activeRecords = records.filter(r => r.status === 'Approved' || r.status === 'Pending Approval');
  const totalDays = activeRecords.reduce((sum, r) => sum + (Number(r.days) || 0), 0);

  // Distinct persons with active leave requests
  const uniquePersons = new Set(activeRecords.map(r => r.resourceId));
  const noPersons = uniquePersons.size;

  // Distinct backups assigned across active records
  const uniqueBackups = new Set(activeRecords.map(r => r.backupResourceId).filter(Boolean));
  const backupCount = uniqueBackups.size;

  return {
    requestsApplied,
    approved,
    pendingApproval,
    rejectedCancelled,
    totalDays,
    noPersons,
    backupCount,
  };
}

// ── Check Backup Availability Conflict ──
export function checkBackupConflict(resourceId, backupResourceId, startDate, endDate) {
  if (!backupResourceId) return null;
  if (resourceId === backupResourceId) {
    return {
      hasConflict: true,
      message: 'A resource cannot be assigned as their own backup.',
    };
  }

  const backupRes = RESOURCES.find(r => r.id === backupResourceId);
  if (!backupRes) {
    return { hasConflict: true, message: 'Backup resource not found in Resource Master.' };
  }

  if (backupRes.status !== 'Active') {
    return { hasConflict: true, message: `${backupRes.name} is currently inactive.` };
  }

  if (!startDate || !endDate) return null;

  const reqStart = new Date(startDate);
  const reqEnd = new Date(endDate);
  if (isNaN(reqStart.getTime()) || isNaN(reqEnd.getTime())) return null;

  // Check if backup has approved leave overlapping this window
  const leaves = loadLeaves();
  const overlapping = leaves.find(l => {
    if (l.resourceId !== backupResourceId) return false;
    if (l.status !== 'Approved') return false;
    const lStart = new Date(l.startDate);
    const lEnd = new Date(l.endDate);
    return !(reqEnd < lStart || reqStart > lEnd);
  });

  if (overlapping) {
    return {
      hasConflict: true,
      message: `BACKUP AVAILABILITY CONFLICT: ${backupRes.name} is unavailable during part of this leave period (${overlapping.id}: ${overlapping.startDate} to ${overlapping.endDate}). Please select another backup resource.`,
      conflictingRecord: overlapping,
    };
  }

  return { hasConflict: false };
}

// ── Check Temporal Resource Availability ──
export function isResourceAvailable(resourceId, dateStr = '2026-09-08') {
  const leaves = loadLeaves();
  const checkDate = new Date(dateStr);

  const activeLeave = leaves.find(l => {
    if (l.resourceId !== resourceId) return false;
    if (l.status !== 'Approved') return false;
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    return checkDate >= start && checkDate <= end;
  });

  if (activeLeave) {
    return {
      available: false,
      status: 'On Leave',
      leaveRecord: activeLeave,
      backupResource: activeLeave.backupResourceName,
    };
  }

  // Check remote work
  const remotes = loadRemoteWork();
  const activeRemote = remotes.find(r => r.resourceId === resourceId && r.date === dateStr && r.status === 'Approved');
  if (activeRemote) {
    return {
      available: true,
      status: 'Remote Work',
      remoteRecord: activeRemote,
    };
  }

  return {
    available: true,
    status: 'Active',
  };
}

// ── Apply Leave ──
export function applyLeave({
  resourceId,
  leaveType,
  startDate,
  endDate,
  reason,
  backupResourceId,
}) {
  const res = RESOURCES.find(r => r.id === resourceId);
  if (!res) throw new Error('Resource not found in canonical Resource Master.');

  const backup = backupResourceId ? RESOURCES.find(r => r.id === backupResourceId) : null;
  const days = calculateWorkingDays(startDate, endDate);
  if (days <= 0) throw new Error('Invalid leave duration. End Date must be after or on Start Date.');

  const conflictCheck = checkBackupConflict(resourceId, backupResourceId, startDate, endDate);

  const leaves = loadLeaves();
  const maxNum = leaves.reduce((max, r) => {
    const match = r.id.match(/LV-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 14);

  const nextId = `LV-${String(maxNum + 1).padStart(5, '0')}`;
  const today = '2026-09-06';

  // Determine manager
  const mgrRes = res.reportingManager ? RESOURCES.find(r => r.id === res.reportingManager) : null;
  const approver = mgrRes ? mgrRes.name : 'Fatima Al Zaabi';

  const newRecord = {
    id: nextId,
    resourceId: res.id,
    resourceName: res.name,
    role: res.role || 'Consultant',
    businessDomain: res.businessDomain,
    processGroup: res.processGroup || 'AMS Operations',
    location: res.location || 'Onsite',
    leaveType: leaveType || 'Annual Leave',
    startDate,
    endDate,
    days,
    reason: reason || 'Personal leave request.',
    approver,
    approverId: mgrRes ? mgrRes.id : 'RES-002',
    backupResourceId: backup ? backup.id : null,
    backupResourceName: backup ? backup.name : 'N/A',
    backupResourceDomain: backup ? backup.businessDomain : 'N/A',
    status: 'Pending Approval',
    submittedDate: today,
    coverageNotes: backup
      ? `Operational coverage assigned to ${backup.name} (${backup.businessDomain}).`
      : 'No dedicated backup specified.',
    backupConflict: conflictCheck?.hasConflict || false,
    backupConflictDetails: conflictCheck?.message || null,
    workflow: [
      { step: 'Submitted', date: today, by: res.name, status: 'Completed' },
      { step: 'Pending Approval', date: today, by: approver, status: 'Active' },
      { step: 'Approved', status: 'Pending' },
      { step: 'Calendar Updated', status: 'Pending' },
      { step: 'Availability Updated', status: 'Pending' }
    ]
  };

  const updated = [newRecord, ...leaves];
  saveLeaves(updated);
  return newRecord;
}

// ── Approve Leave ──
export function approveLeave(leaveId, approverName = 'Fatima Al Zaabi', decisionNotes = '') {
  const leaves = loadLeaves();
  const today = '2026-09-06';
  let target = null;

  const updated = leaves.map(r => {
    if (r.id === leaveId) {
      target = {
        ...r,
        status: 'Approved',
        approvedDate: today,
        decisionNotes: decisionNotes || 'Approved per AMS operational staffing guidelines.',
        workflow: [
          { step: 'Submitted', date: r.submittedDate, by: r.resourceName, status: 'Completed' },
          { step: 'Pending Approval', date: r.submittedDate, by: approverName, status: 'Completed' },
          { step: 'Approved', date: today, by: approverName, status: 'Completed' },
          { step: 'Calendar Updated', date: today, by: 'System', status: 'Completed' },
          { step: 'Availability Updated', date: today, by: 'System', status: 'Completed' }
        ]
      };
      return target;
    }
    return r;
  });

  if (target) {
    saveLeaves(updated);
  }
  return target;
}

// ── Reject Leave ──
export function rejectLeave(leaveId, approverName = 'Fatima Al Zaabi', rejectionReason = 'Operational coverage requirement.') {
  if (!rejectionReason || !rejectionReason.trim()) {
    throw new Error('Rejection reason is mandatory.');
  }

  const leaves = loadLeaves();
  const today = '2026-09-06';
  let target = null;

  const updated = leaves.map(r => {
    if (r.id === leaveId) {
      target = {
        ...r,
        status: 'Rejected',
        rejectedDate: today,
        rejectionReason: rejectionReason.trim(),
        workflow: [
          { step: 'Submitted', date: r.submittedDate, by: r.resourceName, status: 'Completed' },
          { step: 'Pending Approval', date: r.submittedDate, by: approverName, status: 'Completed' },
          { step: 'Rejected', date: today, by: approverName, status: 'Completed', notes: rejectionReason.trim() }
        ]
      };
      return target;
    }
    return r;
  });

  if (target) {
    saveLeaves(updated);
  }
  return target;
}

// ── Cancel Leave ──
export function cancelLeave(leaveId, reason = 'Cancelled by applicant.') {
  const leaves = loadLeaves();
  const today = '2026-09-06';
  let target = null;

  const updated = leaves.map(r => {
    if (r.id === leaveId) {
      target = {
        ...r,
        status: 'Cancelled',
        cancelledDate: today,
        cancellationReason: reason,
        workflow: [
          { step: 'Submitted', date: r.submittedDate, by: r.resourceName, status: 'Completed' },
          { step: 'Cancelled', date: today, by: r.resourceName, status: 'Completed', notes: reason }
        ]
      };
      return target;
    }
    return r;
  });

  if (target) {
    saveLeaves(updated);
  }
  return target;
}

// ── Remote Work Operations ──
export function getRemoteWorkRecords() {
  return loadRemoteWork();
}

export function applyRemoteWork({ resourceId, date, location, reason }) {
  const res = RESOURCES.find(r => r.id === resourceId);
  if (!res) throw new Error('Resource not found.');

  const remotes = loadRemoteWork();
  const nextId = `RW-${String(remotes.length + 1).padStart(5, '0')}`;
  const mgrRes = res.reportingManager ? RESOURCES.find(r => r.id === res.reportingManager) : null;

  const newRecord = {
    id: nextId,
    resourceId: res.id,
    resourceName: res.name,
    businessDomain: res.businessDomain,
    date: date || '2026-09-08',
    location: location || 'Remote (Abu Dhabi)',
    reason: reason || 'Operational remote work.',
    approver: mgrRes ? mgrRes.name : 'Fatima Al Zaabi',
    status: 'Approved',
    submittedDate: '2026-09-06'
  };

  const updated = [newRecord, ...remotes];
  saveRemoteWork(updated);
  return newRecord;
}

// ── Timesheet Operations with Approved Leave Auto-Propagation ──
export function getTimesheetWeeklyData(resourceId = 'RES-005', weekStartStr = '2026-09-07') {
  const res = RESOURCES.find(r => r.id === resourceId) || RESOURCES[0];
  const leaves = loadLeaves();

  // Generate 5 days Mon-Fri
  const weekStart = new Date(weekStartStr);
  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ dateStr, dayName, dayNumber: d.getDate() });
  }

  // Check which days have approved leave
  const leaveHoursByDate = {};
  let totalLeaveDays = 0;

  days.forEach(({ dateStr }) => {
    const isApprovedLeave = leaves.some(l => {
      if (l.resourceId !== res.id || l.status !== 'Approved') return false;
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });

    if (isApprovedLeave) {
      leaveHoursByDate[dateStr] = 8;
      totalLeaveDays++;
    } else {
      leaveHoursByDate[dateStr] = 0;
    }
  });

  // Base RUN and CHANGE allocation for days not on leave
  const runIncidentHours = {};
  const runProblemHours = {};
  const changeEnhanceHours = {};

  days.forEach(({ dateStr }) => {
    if (leaveHoursByDate[dateStr] > 0) {
      runIncidentHours[dateStr] = 0;
      runProblemHours[dateStr] = 0;
      changeEnhanceHours[dateStr] = 0;
    } else {
      runIncidentHours[dateStr] = 5;
      runProblemHours[dateStr] = 2;
      changeEnhanceHours[dateStr] = 1;
    }
  });

  return {
    resource: res,
    weekStartDate: weekStartStr,
    days,
    hasApprovedLeave: totalLeaveDays > 0,
    totalLeaveHours: totalLeaveDays * 8,
    entries: [
      {
        id: 'TS-RUN-01',
        category: 'RUN',
        track: res.track || 'AMS-OF-RUN',
        taskName: 'AMS Incident Resolution & Queue Triage (SLA)',
        hours: runIncidentHours,
        isLeave: false,
      },
      {
        id: 'TS-RUN-02',
        category: 'RUN',
        track: res.track || 'AMS-OF-RUN',
        taskName: 'Problem Investigation & Root Cause Remediation',
        hours: runProblemHours,
        isLeave: false,
      },
      {
        id: 'TS-CHG-01',
        category: 'CHANGE',
        track: res.track || 'AMS-OF-RUN',
        taskName: 'Approved Minor Enhancement & CR Support',
        hours: changeEnhanceHours,
        isLeave: false,
      },
      {
        id: 'TS-LV-01',
        category: 'LEAVE',
        track: 'N/A (Statutory / Leave)',
        taskName: 'Approved Operational Leave (Auto-Populated from Time Management)',
        hours: leaveHoursByDate,
        isLeave: true,
        readOnly: true,
      }
    ]
  };
}

// ── Onsite Staffing Compliance Calculation ──
export function getOnsiteCoverageCompliance(dateStr = '2026-09-08') {
  // Required onsite consultants contractual count = 14 (from AMS-ON-RUN track in Resource Master)
  const onsiteResources = RESOURCES.filter(r => r.track === 'AMS-ON-RUN');
  const requiredCount = onsiteResources.length; // 14

  const leaves = loadLeaves();
  const onsiteOnLeave = onsiteResources.filter(r => {
    return leaves.some(l => {
      if (l.resourceId !== r.id || l.status !== 'Approved') return false;
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });
  });

  const absentCount = onsiteOnLeave.length;
  const filledCount = requiredCount - absentCount;
  const coveragePercent = Math.round((filledCount / requiredCount) * 100);

  return {
    date: dateStr,
    required: requiredCount,
    filled: filledCount,
    gap: absentCount,
    coveragePercent,
    absentResources: onsiteOnLeave.map(r => ({
      id: r.id,
      name: r.name,
      businessDomain: r.businessDomain,
      processGroup: r.processGroup,
    }))
  };
}
