/**
 * Resource Mobilisation Data — 100+ records with full assignment/KT history
 */

export interface AssignmentHistory {
  year: string;
  project: string;
  role: string;
  startDate: string;
  endDate: string;
}

export interface KTRecord {
  ktBatch: string;
  fromEmployee: string;
  toEmployee: string;
  startDate: string;
  completionDate: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Cancelled';
  topics: string;
}

export interface ResourceMobilizationRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  tower: string;
  project: string;
  businessService: string;
  onboardDate: string;
  currentAssignment: string;
  currentActivity: string;
  currentRole: string;
  reportingManager: string;
  previousAssignment: string;
  assignmentChangeCount: number;
  resourceStatus: 'Active' | 'On Leave' | 'KT In Progress' | 'Offboarding' | 'Offboarded' | 'Pending Onboard';
  activeClosed: 'Active' | 'Closed';
  replacementRequired: boolean;
  ktRequired: boolean;
  ktStatus: 'Completed' | 'In Progress' | 'Pending' | 'Not Required';
  ktBatch: string;
  ktCompletionDate: string;
  offboardingDate: string;
  email: string;
  mobile: string;
  assignmentHistory: AssignmentHistory[];
  ktHistory: KTRecord[];
}

const towersList = ['SAP Basis & Platform', 'Integration Suite (CPI)', 'AMS Service Management', 'S/4HANA Supply Chain', 'S/4HANA Finance', 'HANA Database & Performance', 'BTP & Fiori', 'GRC & Security', 'Enable Now & Adoption'];
const projects = ['NOC AMS Operations', 'NOC Infrastructure Program', 'NOC Cloud Migration', 'NOC SAP Operations', 'NOC Security Operations', 'NOC Digital Workplace', 'NOC Network Operations', 'NOC Service Desk Operations'];
const services = ['Infrastructure Services', 'Network Services', 'Service Desk', 'Application Services', 'SAP Operations', 'Database Services', 'Cloud Platform', 'Security Operations', 'Digital Workplace'];
const activities = ['Operations Support', 'Incident Management', 'Change Management', 'Problem Management', 'Monitoring', 'Administration', 'Engineering', 'Architecture', 'Consulting', 'Project Management'];
const roles = ['Senior Engineer', 'Engineer', 'Lead Engineer', 'Team Lead', 'Manager', 'Analyst', 'Specialist', 'Administrator', 'Architect', 'Consultant'];

const firstNames = ['Ahmed', 'Mohammed', 'Khalid', 'Fahad', 'Omar', 'Abdullah', 'Sultan', 'Turki', 'Faisal', 'Saeed', 'Nasser', 'Yousef', 'Ibrahim', 'Saleh', 'Hamad', 'Sara', 'Noura', 'Aisha', 'Huda', 'Layla', 'Fatima', 'Maha', 'Reem', 'Rakesh', 'Arjun', 'Vivek', 'Priya', 'Sneha', 'Daniel', 'Sanjay'];
const lastNamesList = ['Al-Harbi', 'Al-Qahtani', 'Al-Dosari', 'Al-Otaibi', 'Al-Shammari', 'Al-Ghamdi', 'Al-Mutairi', 'Al-Zahrani', 'Al-Malki', 'Kumar', 'Nair', 'Menon', 'Mathew', 'Srinivasan', 'Sharma', 'Patel'];
const managers = ['Faisal Al-Harbi', 'Ahmed Al-Qahtani', 'Mohammed Al-Dosari', 'Sara Al-Otaibi', 'Omar Al-Mutairi', 'Priya Nair', 'Daniel Mathew', 'Layla Hassan', 'Aisha Rahman'];
const phonePre = ['50', '53', '54', '55', '56', '57', '58', '59'];

function genResources(): ResourceMobilizationRecord[] {
  const records: ResourceMobilizationRecord[] = [];
  const statuses: ResourceMobilizationRecord['resourceStatus'][] = ['Active', 'Active', 'Active', 'Active', 'Active', 'KT In Progress', 'On Leave', 'Offboarding', 'Pending Onboard', 'Offboarded'];
  const ktStatuses: ResourceMobilizationRecord['ktStatus'][] = ['Completed', 'In Progress', 'Pending', 'Not Required', 'Completed', 'Not Required'];

  for (let i = 0; i < 110; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNamesList[i % lastNamesList.length];
    const name = `${fn} ${ln}`;
    const tower = towersList[i % towersList.length];
    const status = statuses[i % statuses.length];
    const ktStat = ktStatuses[i % ktStatuses.length];
    const changes = i % 4;
    const pp = phonePre[i % phonePre.length];
    const emailName = `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}`;

    // Generate assignment history
    const history: AssignmentHistory[] = [];
    if (changes >= 1) {
      history.push({ year: '2024', project: projects[(i + 2) % projects.length], role: roles[(i + 1) % roles.length], startDate: '2024-01-15', endDate: '2024-12-31' });
    }
    if (changes >= 2) {
      history.push({ year: '2025', project: projects[(i + 1) % projects.length], role: roles[i % roles.length], startDate: '2025-01-01', endDate: '2025-12-31' });
    }
    if (changes >= 3) {
      history.push({ year: '2026', project: projects[i % projects.length], role: roles[(i + 2) % roles.length], startDate: '2026-01-01', endDate: '' });
    }

    // Generate KT history
    const ktHist: KTRecord[] = [];
    if (ktStat !== 'Not Required') {
      ktHist.push({
        ktBatch: `KT-B${String(Math.floor(i / 5) + 1).padStart(3, '0')}`,
        fromEmployee: status === 'Offboarding' || status === 'Offboarded' ? name : managers[i % managers.length],
        toEmployee: status === 'Offboarding' || status === 'Offboarded' ? managers[i % managers.length] : name,
        startDate: '2026-07-01',
        completionDate: ktStat === 'Completed' ? '2026-08-01' : '',
        status: ktStat as KTRecord['status'],
        topics: `${tower} operations, monitoring procedures, escalation matrix, runbooks`,
      });
    }

    records.push({
      id: `RM-${String(i + 1).padStart(4, '0')}`,
      employeeName: name,
      employeeId: `NOC-${1001 + (i % 355)}`,
      position: roles[i % roles.length],
      tower,
      project: projects[i % projects.length],
      businessService: services[i % services.length],
      onboardDate: `202${4 + (i % 3)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      currentAssignment: projects[i % projects.length],
      currentActivity: activities[i % activities.length],
      currentRole: roles[i % roles.length],
      reportingManager: managers[i % managers.length],
      previousAssignment: changes > 0 ? projects[(i + 1) % projects.length] : 'N/A',
      assignmentChangeCount: changes,
      resourceStatus: status,
      activeClosed: status === 'Offboarded' ? 'Closed' : 'Active',
      replacementRequired: status === 'Offboarding' || status === 'Offboarded',
      ktRequired: ktStat !== 'Not Required',
      ktStatus: ktStat,
      ktBatch: ktHist.length > 0 ? ktHist[0].ktBatch : 'N/A',
      ktCompletionDate: ktStat === 'Completed' ? '2026-08-01' : '',
      offboardingDate: status === 'Offboarded' ? '2026-07-31' : status === 'Offboarding' ? '2026-08-31' : '',
      email: `${emailName}@demo.noc.local`,
      mobile: `+974 ${pp} ${String(100 + (i * 37 + 284) % 900)} ${String(1000 + (i * 73 + 4716) % 9000)}`,
      assignmentHistory: history,
      ktHistory: ktHist,
    });
  }

  return records;
}

export const resourceMobilization: ResourceMobilizationRecord[] = genResources();

export function getResourceMobStats() {
  const total = resourceMobilization.length;
  const active = resourceMobilization.filter(r => r.resourceStatus === 'Active').length;
  const ktInProgress = resourceMobilization.filter(r => r.resourceStatus === 'KT In Progress').length;
  const offboarding = resourceMobilization.filter(r => r.resourceStatus === 'Offboarding').length;
  const offboarded = resourceMobilization.filter(r => r.resourceStatus === 'Offboarded').length;
  const pendingOnboard = resourceMobilization.filter(r => r.resourceStatus === 'Pending Onboard').length;
  const replacementNeeded = resourceMobilization.filter(r => r.replacementRequired).length;
  return { total, active, ktInProgress, offboarding, offboarded, pendingOnboard, replacementNeeded };
}
