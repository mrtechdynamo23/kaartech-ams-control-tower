/**
 * EDGE AMS Control Tower — Demo / Simulated Data
 * 
 * CLASSIFICATION: DEMO — All data in this file is simulated.
 * Uses fictional identities only (Section 77).
 * Every record has valid cross-relationships (Section 75).
 * Do NOT present this as live EDGE operational data.
 */

import { BUSINESS_DOMAINS, ENTITIES, APPLICATIONS, TRACKS } from './masterData.js';
import { RESOLVER_GROUPS, RESOLVER_TIERS, AGEING_BUCKETS } from './config.js';

// ── Helper: Random pick ──
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// ═══════════════════════════════════════════════════
// RESOURCE MASTER — DEMO (Section 41)
// Fictional identities only. Single canonical source.
// ═══════════════════════════════════════════════════
export const RESOURCES = [
  { id: 'RES-001', positionId: 'POS-001', name: 'Khalid Al Hashimi', track: 'AMS-ON-RUN', businessDomain: 'L2C', processGroup: 'Sales & Distribution', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-15', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP SD', certification: 'SAP S/4HANA Sales', phone: '+971-50-XXX-1001', email: 'khalid.h@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-002', positionId: 'POS-002', name: 'Fatima Al Zaabi', track: 'AMS-ON-RUN', businessDomain: 'R2R', processGroup: 'Financial Accounting', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-08-01', reportingManager: null, status: 'Active', gender: 'Female', skill: 'SAP FICO', certification: 'SAP S/4HANA Finance', phone: '+971-50-XXX-1002', email: 'fatima.z@demo.edge.ae', entity: 'ENT-001', role: 'AMS Team Lead' },
  { id: 'RES-003', positionId: 'POS-003', name: 'Ravi Shankar', track: 'AMS-OF-RUN', businessDomain: 'P2P', processGroup: 'Procurement', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-01', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP MM', certification: 'SAP S/4HANA Sourcing', phone: '+91-98XXX-1003', email: 'ravi.s@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-004', positionId: 'POS-004', name: 'Sara Al Marzouqi', track: 'AMS-ON-RUN', businessDomain: 'H2R', processGroup: 'Talent Management', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-01', reportingManager: 'RES-002', status: 'Active', gender: 'Female', skill: 'SAP SuccessFactors', certification: 'SF EC Certified', phone: '+971-50-XXX-1004', email: 'sara.m@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-005', positionId: 'POS-005', name: 'Priya Nair', track: 'AMS-OF-RUN', businessDomain: 'E2M', processGroup: 'Production Planning', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-15', reportingManager: 'RES-002', status: 'Active', gender: 'Female', skill: 'SAP PP/QM', certification: 'SAP S/4HANA Manufacturing', phone: '+91-98XXX-1005', email: 'priya.n@demo.edge.ae', entity: 'ENT-031', role: 'Functional Consultant' },
  { id: 'RES-006', positionId: 'POS-006', name: 'Omar Bashar', track: 'AMS-ON-RUN', businessDomain: 'D2S', processGroup: 'Warehouse Management', nationality: 'Jordanian', location: 'Onsite', onboardingDate: '2025-09-15', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP EWM/TM', certification: 'SAP EWM Certified', phone: '+971-50-XXX-1006', email: 'omar.b@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-007', positionId: 'POS-007', name: 'Deepak Kumar', track: 'AMS-OF-RUN', businessDomain: 'R2R', processGroup: 'Management Accounting', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-01', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP CO', certification: 'SAP S/4HANA Finance', phone: '+91-98XXX-1007', email: 'deepak.k@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-008', positionId: 'POS-008', name: 'Noura Al Shamsi', track: 'AMS-ON-RUN', businessDomain: 'S2P', processGroup: 'Strategic Sourcing', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-08-15', reportingManager: 'RES-002', status: 'Active', gender: 'Female', skill: 'SAP Ariba', certification: 'Ariba Sourcing Certified', phone: '+971-50-XXX-1008', email: 'noura.s@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-009', positionId: 'POS-009', name: 'Ankit Patel', track: 'AMS-OF-Flex', businessDomain: 'E2M', processGroup: 'Quality Management', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-01', reportingManager: 'RES-005', status: 'Active', gender: 'Male', skill: 'SAP MES/MII', certification: 'SAP MES Certified', phone: '+91-98XXX-1009', email: 'ankit.p@demo.edge.ae', entity: 'ENT-028', role: 'Technical Consultant' },
  { id: 'RES-010', positionId: 'POS-010', name: 'Aisha Khalfan', track: 'AMS-ON-RUN', businessDomain: 'S2P', processGroup: 'Vendor Management', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-01', reportingManager: 'RES-002', status: 'Active', gender: 'Female', skill: 'SAP MM/SRM', certification: 'SAP S/4HANA Sourcing', phone: '+971-50-XXX-1010', email: 'aisha.k@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-011', positionId: 'POS-011', name: 'Mohammed Al Kindi', track: 'AMS-OF-RUN', businessDomain: 'L2C', processGroup: 'Billing & Invoicing', nationality: 'Omani', location: 'Offshore', onboardingDate: '2025-10-15', reportingManager: 'RES-001', status: 'Active', gender: 'Male', skill: 'SAP SD/Billing', certification: 'SAP S/4HANA Sales', phone: '+968-9XXX-1011', email: 'mohammed.k@demo.edge.ae', entity: 'ENT-003', role: 'Functional Consultant' },
  { id: 'RES-012', positionId: 'POS-012', name: 'Lakshmi Devi', track: 'AMS-OF-Flex', businessDomain: 'R2R', processGroup: 'Group Consolidation', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-15', reportingManager: 'RES-007', status: 'Active', gender: 'Female', skill: 'SAP Group Reporting', certification: 'SAP BPC Certified', phone: '+91-98XXX-1012', email: 'lakshmi.d@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-013', positionId: 'POS-013', name: 'Hassan Al Nuaimi', track: 'AMS-ON-RUN', businessDomain: 'E2M', processGroup: 'Production Planning', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-15', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP PP', certification: 'SAP S/4HANA Manufacturing', phone: '+971-50-XXX-1013', email: 'hassan.n@demo.edge.ae', entity: 'ENT-033', role: 'Functional Consultant' },
  { id: 'RES-014', positionId: 'POS-014', name: 'Sunita Reddy', track: 'ENH-OF-RUN', businessDomain: 'P2P', processGroup: 'Invoice Processing', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-01', reportingManager: 'RES-003', status: 'Active', gender: 'Female', skill: 'ABAP/Fiori', certification: 'SAP ABAP Developer', phone: '+91-98XXX-1014', email: 'sunita.r@demo.edge.ae', entity: 'ENT-001', role: 'ABAP Developer' },
  { id: 'RES-015', positionId: 'POS-015', name: 'Tariq Al Dhaheri', track: 'AMS-ON-RUN', businessDomain: 'A2D', processGroup: 'Asset Management', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-08-01', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP PM/EAM', certification: 'SAP EAM Certified', phone: '+971-50-XXX-1015', email: 'tariq.d@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-016', positionId: 'POS-016', name: 'Raj Malhotra', track: 'AMS-OF-RUN', businessDomain: 'H2R', processGroup: 'Payroll & Benefits', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-15', reportingManager: 'RES-004', status: 'Active', gender: 'Male', skill: 'SAP SF/EC Payroll', certification: 'SF Payroll Certified', phone: '+91-98XXX-1016', email: 'raj.m@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-017', positionId: 'POS-017', name: 'Mariam Al Suwaidi', track: 'AMS-ON-RUN', businessDomain: 'R2R', processGroup: 'Financial Accounting', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-01', reportingManager: 'RES-002', status: 'Active', gender: 'Female', skill: 'SAP FI/GL', certification: 'SAP S/4HANA Finance', phone: '+971-50-XXX-1017', email: 'mariam.s@demo.edge.ae', entity: 'ENT-001', role: 'Senior Consultant' },
  { id: 'RES-018', positionId: 'POS-018', name: 'Vikram Singh', track: 'AMS-OF-RUN', businessDomain: 'D2S', processGroup: 'Demand Planning', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-01', reportingManager: 'RES-006', status: 'Active', gender: 'Male', skill: 'SAP APO/IBP', certification: 'SAP IBP Certified', phone: '+91-98XXX-1018', email: 'vikram.s@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-019', positionId: 'POS-019', name: 'Hind Al Mazrouei', track: 'AMS-ON-RUN', businessDomain: 'L2C', processGroup: 'Sales & Distribution', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-08-15', reportingManager: 'RES-001', status: 'Active', gender: 'Female', skill: 'SAP CRM/Dynamics', certification: 'Dynamics 365 Certified', phone: '+971-50-XXX-1019', email: 'hind.m@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-020', positionId: 'POS-020', name: 'Suresh Krishnan', track: 'ENH-OF-RUN', businessDomain: 'E2M', processGroup: 'Production Planning', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-01', reportingManager: 'RES-005', status: 'Active', gender: 'Male', skill: 'BASIS/HANA', certification: 'SAP HANA Admin', phone: '+91-98XXX-1020', email: 'suresh.k@demo.edge.ae', entity: 'ENT-001', role: 'BASIS Consultant' },
  { id: 'RES-021', positionId: 'POS-021', name: 'Abdulrahman Darwish', track: 'AMS-ON-RUN', businessDomain: 'P2P', processGroup: 'Procurement', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-15', reportingManager: 'RES-003', status: 'Active', gender: 'Male', skill: 'SAP MM', certification: 'SAP S/4HANA Sourcing', phone: '+971-50-XXX-1021', email: 'abdulrahman.d@demo.edge.ae', entity: 'ENT-002', role: 'Functional Consultant' },
  { id: 'RES-022', positionId: 'POS-022', name: 'Meera Nambiar', track: 'AMS-OF-Flex', businessDomain: 'H2R', processGroup: 'Recruiting', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-15', reportingManager: 'RES-004', status: 'Active', gender: 'Female', skill: 'SAP SF Recruiting', certification: 'SF Recruiting Certified', phone: '+91-98XXX-1022', email: 'meera.n@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-023', positionId: 'POS-023', name: 'Yousuf Al Kaabi', track: 'AMS-ON-RUN', businessDomain: 'A2D', processGroup: 'Plant Maintenance', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-01', reportingManager: 'RES-015', status: 'Active', gender: 'Male', skill: 'SAP PM/MES', certification: 'SAP Plant Maintenance', phone: '+971-50-XXX-1023', email: 'yousuf.k@demo.edge.ae', entity: 'ENT-028', role: 'Functional Consultant' },
  { id: 'RES-024', positionId: 'POS-024', name: 'Pooja Sharma', track: 'AMS-OF-RUN', businessDomain: 'L2C', processGroup: 'Billing & Invoicing', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-10-15', reportingManager: 'RES-001', status: 'Active', gender: 'Female', skill: 'SAP SD/Billing', certification: 'SAP S/4HANA Sales', phone: '+91-98XXX-1024', email: 'pooja.s@demo.edge.ae', entity: 'ENT-003', role: 'Functional Consultant' },
  { id: 'RES-025', positionId: 'POS-025', name: 'Mansour Al Hosani', track: 'AMS-OF-RUN', businessDomain: 'R2R', processGroup: 'Controlling', nationality: 'UAE', location: 'Offshore', onboardingDate: '2025-10-01', reportingManager: 'RES-007', status: 'Active', gender: 'Male', skill: 'SAP CO/PS', certification: 'SAP CO Certified', phone: '+971-50-XXX-1025', email: 'mansour.h@demo.edge.ae', entity: 'ENT-001', role: 'Senior Consultant' },
  { id: 'RES-026', positionId: 'POS-026', name: 'Nisha Varma', track: 'ENH-OF-RUN', businessDomain: 'S2P', processGroup: 'Strategic Sourcing', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-01', reportingManager: 'RES-008', status: 'Active', gender: 'Female', skill: 'SAP Ariba/ABAP', certification: 'Ariba Developer', phone: '+91-98XXX-1026', email: 'nisha.v@demo.edge.ae', entity: 'ENT-001', role: 'Technical Consultant' },
  { id: 'RES-027', positionId: 'POS-027', name: 'Sultan Al Dhahiri', track: 'AMS-ON-RUN', businessDomain: 'E2M', processGroup: 'Quality Management', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-08-01', reportingManager: 'RES-002', status: 'Active', gender: 'Male', skill: 'SAP QM/PP', certification: 'SAP QM Certified', phone: '+971-50-XXX-1027', email: 'sultan.d@demo.edge.ae', entity: 'ENT-031', role: 'Functional Consultant' },
  { id: 'RES-028', positionId: 'POS-028', name: 'Amira Hassan', track: 'AMS-OF-RUN', businessDomain: 'D2S', processGroup: 'Warehouse Management', nationality: 'Egyptian', location: 'Offshore', onboardingDate: '2025-10-15', reportingManager: 'RES-006', status: 'Active', gender: 'Female', skill: 'SAP EWM', certification: 'SAP EWM Certified', phone: '+20-10XXX-1028', email: 'amira.h@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-029', positionId: 'POS-029', name: 'Arjun Menon', track: 'AMS-OF-Flex', businessDomain: 'P2P', processGroup: 'Invoice Processing', nationality: 'Indian', location: 'Offshore', onboardingDate: '2025-11-15', reportingManager: 'RES-003', status: 'Active', gender: 'Male', skill: 'SAP VIM/AP', certification: 'SAP FI-AP Certified', phone: '+91-98XXX-1029', email: 'arjun.m@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
  { id: 'RES-030', positionId: 'POS-030', name: 'Layla Al Qassimi', track: 'AMS-ON-RUN', businessDomain: 'H2R', processGroup: 'Talent Management', nationality: 'UAE', location: 'Onsite', onboardingDate: '2025-09-01', reportingManager: 'RES-004', status: 'Active', gender: 'Female', skill: 'SAP SF/LMS', certification: 'SF LMS Certified', phone: '+971-50-XXX-1030', email: 'layla.q@demo.edge.ae', entity: 'ENT-001', role: 'Functional Consultant' },
];

// ═══════════════════════════════════════════════════
// INCIDENTS — DEMO
// ═══════════════════════════════════════════════════
const incidentStatuses = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed'];
const priorities = ['P1', 'P2', 'P3', 'P4'];

function generateIncidents() {
  const incidents = [];

  for (let i = 1; i <= 90; i++) {
    const priority = (i % 18 === 1) ? 'P1' : (i % 8 === 2 || i % 8 === 5) ? 'P2' : (i % 2 === 0) ? 'P3' : 'P4';
    const statusIdx = i <= 15 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5);
    const status = incidentStatuses[statusIdx];
    const resource = RESOURCES[i % RESOURCES.length];
    const resolver = RESOURCES[(i + 5) % RESOURCES.length];
    const entity = ENTITIES[i % ENTITIES.length];
    const app = APPLICATIONS[i % 26];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];
    
    // Spread evenly across months 0 (Jan) through 8 (Sep) of 2026
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 3) % 27);
    const created = new Date(2026, monthIdx, day, 8 + (i % 9), (i * 7) % 60);

    const responseSlaStatus = Math.random() > 0.08 ? 'Met' : 'Breached';
    const resolutionSlaStatus = status === 'Closed' || status === 'Resolved'
      ? ((priority === 'P1' && i === 19) ? 'Breached' : Math.random() > 0.06 ? 'Met' : 'Breached')
      : (Math.random() > 0.15 ? 'On Track' : 'At Risk');

    incidents.push({
      id: `INC-${String(i).padStart(5, '0')}`,
      priority,
      shortDescription: getIncidentDescription(i, domain.key),
      businessDomain: domain.key,
      processGroup: resource.processGroup,
      status,
      raisedBy: resource.name,
      assignedTo: resolver.name,
      assignedToId: resolver.id,
      resolverTier: i <= 10 ? 'L2' : i <= 25 ? 'L1.5' : 'L1',
      resolverGroup: RESOLVER_GROUPS[i % 3].label,
      problemTicket: i <= 5 ? `PRB-${String(i).padStart(5, '0')}` : null,
      crNo: i <= 3 ? `CR-${String(i).padStart(4, '0')}` : null,
      responseSla: responseSlaStatus,
      resolutionSla: resolutionSlaStatus,
      slaStatus: resolutionSlaStatus === 'Breached' || responseSlaStatus === 'Breached' ? 'Breached' : resolutionSlaStatus,
      timeRemaining: status === 'Closed' ? null : `${Math.floor(Math.random() * 48)}h ${Math.floor(Math.random() * 60)}m`,
      createdDate: created.toISOString().split('T')[0],
      entity: entity.name,
      entityId: entity.id,
      application: app.name,
      applicationId: app.id,
      // IRT/MPT/APT fields (Section 26)
      irtTimestamp: created.toISOString(),
      mptTimestamp: new Date(created.getTime() + Math.floor(Math.random() * 3600000)).toISOString(),
      aptTimestamp: new Date(created.getTime() + Math.floor(Math.random() * 7200000)).toISOString(),
      classification: 'DEMO',
    });
  }
  return incidents;
}

function getIncidentDescription(i, domain) {
  const descriptions = {
    L2C: ['Sales order pricing calculation error', 'Credit memo posting failure', 'Delivery document blocked', 'Billing run incomplete', 'Customer master update issue'],
    E2M: ['Production order scheduling error', 'BOM explosion failure', 'MES interface timeout', 'Quality notification stuck', 'Routing master data inconsistency'],
    P2P: ['Purchase requisition approval stuck', 'Invoice verification mismatch', 'Vendor payment blocked', 'GR/IR clearing issue', 'Contract release order failure'],
    D2S: ['EWM stock placement error', 'Transportation route optimization failed', 'MRP exception messages overflow', 'Warehouse task confirmation error', 'Demand forecast calculation delay'],
    S2P: ['Ariba sourcing event creation error', 'Supplier qualification workflow stuck', 'Contract compliance violation alert', 'Sourcing approval routing failure', 'Vendor evaluation scoring error'],
    A2D: ['Asset capitalization posting error', 'Depreciation run calculation issue', 'Maintenance order scheduling conflict', 'Equipment master update failure', 'Asset transfer posting blocked'],
    R2R: ['Period-end closing step failed', 'Intercompany reconciliation mismatch', 'Cost allocation cycle error', 'Financial statement consolidation issue', 'GL account master inconsistency'],
    H2R: ['Employee onboarding workflow stuck', 'Payroll calculation discrepancy', 'Time evaluation error for shift workers', 'Performance review form not generating', 'Leave request approval pending system error'],
  };
  const domainDescs = descriptions[domain] || descriptions.R2R;
  return domainDescs[i % domainDescs.length];
}

// ═══════════════════════════════════════════════════
// SERVICE REQUESTS — DEMO
// ═══════════════════════════════════════════════════
function generateServiceRequests() {
  const srs = [];
  const categories = ['Configuration', 'Access Management', 'Report Customization', 'Data Correction', 'Training Support', 'Documentation', 'Enhancement Query'];
  const srStatuses = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed', 'Rejected'];

  for (let i = 1; i <= 40; i++) {
    const hours = Math.floor(Math.random() * 30) + 1;
    // CONFIGURABLE — SR effort classification (Section 21)
    // Default: >=16 = Major (more conservative reading). See config.js for threshold.
    const srType = hours >= 16 ? 'Major' : 'Standard';
    const resource = RESOURCES[i % RESOURCES.length];
    const resolver = RESOURCES[(i + 3) % RESOURCES.length];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 4) % 27);
    const created = new Date(2026, monthIdx, day, 9 + (i % 8), (i * 11) % 60);

    srs.push({
      id: `SR-${String(i).padStart(5, '0')}`,
      priority: srType === 'Major' ? 'High' : 'Standard',
      shortDescription: getSRDescription(i, domain.key),
      businessDomain: domain.key,
      processGroup: resource.processGroup,
      status: srStatuses[i % srStatuses.length],
      raisedBy: resource.name,
      assignedTo: resolver.name,
      assignedToId: resolver.id,
      category: categories[i % categories.length],
      timeCountHrs: hours,
      resolverTier: 'L1.5',
      resolverGroup: RESOLVER_GROUPS[0].label,
      responseSla: Math.random() > 0.1 ? 'Met' : 'Breached',
      resolutionSla: Math.random() > 0.1 ? 'Met' : 'Breached',
      slaStatus: Math.random() > 0.15 ? 'Met' : 'Breached',
      srType,
      createdDate: created.toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      application: APPLICATIONS[i % 26].name,
      classification: 'DEMO',
    });
  }
  return srs;
}

function getSRDescription(i, domain) {
  const descriptions = [
    'Configure new approval workflow', 'Grant SAP role access for new user',
    'Create custom ALV report', 'Correct master data entry error',
    'Provide end-user training session', 'Update process documentation',
    'New output format configuration', 'Authorization profile adjustment',
    'Custom Fiori app tile configuration', 'Transport request review and release',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// ENHANCEMENTS — DEMO
// ═══════════════════════════════════════════════════
function generateEnhancements() {
  const enhancements = [];
  const enhStatuses = ['Draft', 'Under Review', 'Approved', 'In Development', 'Testing', 'Deployed', 'Closed'];

  for (let i = 1; i <= 25; i++) {
    const hours = 32 + Math.floor(Math.random() * 120);
    /**
     * CONFIGURABLE / DEMO — Minor vs Major Enhancement category.
     * Source does NOT define classification rule (Section 22).
     * Demo default: <=80h = Minor, >80h = Major.
     */
    const category = hours <= 80 ? 'Minor' : 'Major';
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];
    const monthIdx = (i - 1) % 9;
    const day = 1 + ((i * 5) % 27);
    const created = new Date(2026, monthIdx, day, 11 + (i % 6), (i * 13) % 60);

    enhancements.push({
      id: `ENH-${String(i).padStart(5, '0')}`,
      priority: category === 'Major' ? 'High' : 'Medium',
      shortDescription: getEnhDescription(i),
      businessDomain: domain.key,
      processGroup: resource.processGroup,
      status: enhStatuses[i % enhStatuses.length],
      raisedBy: resource.name,
      assignedTo: RESOURCES[(i + 7) % RESOURCES.length].name,
      category,
      timeCountHrs: hours,
      resolverTier: 'L3',
      resolverGroup: RESOLVER_GROUPS[0].label,
      governanceStatus: i % 3 === 0 ? 'Approved' : i % 3 === 1 ? 'Pending' : 'Under Review',
      createdDate: created.toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      application: APPLICATIONS[i % 26].name,
      classification: 'DEMO',
    });
  }
  return enhancements;
}

function getEnhDescription(i) {
  const descriptions = [
    'Automated invoice matching workflow', 'Custom dashboard for plant managers',
    'Enhanced approval matrix with delegation', 'Fiori launchpad custom tile development',
    'Integration with third-party logistics API', 'Automated report scheduling and distribution',
    'Custom pricing condition type implementation', 'BTP workflow for capital approval',
    'MES shopfloor data collection enhancement', 'Automated intercompany reconciliation tool',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// PROBLEMS — DEMO
// ═══════════════════════════════════════════════════
function generateProblems() {
  const problems = [];
  const prbStatuses = ['Open', 'In Progress', 'Root Cause Identified', 'Corrective Action', 'Closed'];

  for (let i = 1; i <= 20; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];
    const app = APPLICATIONS[i % 26];
    const status = prbStatuses[(i - 1) % prbStatuses.length];
    const created = new Date('2026-05-15');
    created.setDate(created.getDate() + Math.floor(Math.random() * 100));

    // Coherent RCA and lifecycle states (Section 17, 45)
    let rcaStatus = 'Not Started';
    let rootCause = null;
    let correctiveAction = null;
    let preventiveAction = null;
    let kedbArticle = null;

    if (status === 'Closed') {
      rcaStatus = 'Delivered';
      rootCause = `Root cause analysis completed. Issue traced to ${['configuration drift in batch posting rules', 'data migration residual table lock', 'RFC integration timeout between SAP and MES', 'authorization role conflict post-patch'][i % 4]}.`;
      correctiveAction = 'Permanent ABAP code remediation deployed and verified in production.';
      preventiveAction = 'Automated health daemon probe added to monitoring suite for zero recurrence.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'Corrective Action') {
      rcaStatus = 'Delivered';
      rootCause = `Root cause identified as ${['deadlock on transactional queue table', 'missing indexing on custom query', 'stale RFC destination credential'][i % 3]}.`;
      correctiveAction = 'Code fix undergoing CAB review and staging validation.';
      preventiveAction = 'Standard operating procedure updated in Knowledge Base.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'Root Cause Identified') {
      rcaStatus = 'Delivered';
      rootCause = `5-Why investigation completed. Underlying issue diagnosed in ${domain.label} core schema.`;
      correctiveAction = 'Corrective action plan drafted for CAB sign-off.';
      kedbArticle = `KEDB-${String(i).padStart(5, '0')}`;
    } else if (status === 'In Progress') {
      rcaStatus = 'Pending';
      rootCause = null;
    } else {
      rcaStatus = 'Not Started';
      rootCause = null;
    }

    const linkedIncidents = [`INC-${String(i).padStart(5, '0')}`, `INC-${String(i + 1).padStart(5, '0')}`];

    problems.push({
      id: `PRB-${String(i).padStart(5, '0')}`,
      shortDescription: getProblemDescription(i),
      businessDomain: domain.key,
      processGroup: resource.processGroup,
      status,
      createdBy: resource.name,
      assignedTo: RESOURCES[(i + 4) % RESOURCES.length].name,
      incidentIds: linkedIncidents,
      linkedIncidents,
      application: app.name,
      applicationId: app.id,
      crId: i <= 8 ? `CR-${String(i).padStart(4, '0')}` : null,
      rcaId: rcaStatus === 'Delivered' ? `RCA-${String(i).padStart(4, '0')}` : null,
      rcaStatus,
      kedbArticle,
      timeCount: Math.floor(Math.random() * 40) + 8,
      createdDate: created.toISOString().split('T')[0],
      description: `Recurring defect pattern identified across linked incidents in ${domain.label} domain.`,
      rootCause,
      correctiveAction,
      preventiveAction,
      targetDate: new Date(created.getTime() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      classification: 'DEMO',
    });
  }
  return problems;
}

function getProblemDescription(i) {
  const descriptions = [
    'Recurring period-end posting failure pattern',
    'Intermittent MES interface synchronization loss',
    'Systematic invoice matching discrepancy',
    'Recurring authorization check failures post-migration',
    'Chronic EWM confirmation timeout under load',
    'Persistent BW data load scheduling conflict',
    'Repeated workflow notification delivery failure',
    'Recurring transport import sequence errors',
  ];
  return descriptions[i % descriptions.length];
}

// ═══════════════════════════════════════════════════
// RISKS — DEMO
// ═══════════════════════════════════════════════════
function generateRisks() {
  const risks = [];
  const riskStatuses = ['Open', 'Mitigating', 'Monitoring', 'Closed', 'Escalated'];
  const riskCategories = ['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Escalate'];
  const impacts = ['Critical', 'High', 'Medium', 'Low'];
  const likelihoods = ['Very Likely', 'Likely', 'Possible', 'Unlikely', 'Rare'];

  for (let i = 1; i <= 22; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];

    risks.push({
      id: `RSK-${String(i).padStart(4, '0')}`,
      title: getRiskTitle(i),
      description: `Risk identified in ${domain.label} domain requiring attention.`,
      businessDomain: domain.key,
      owner: resource.name,
      ownerId: resource.id,
      impact: impacts[i % impacts.length],
      likelihood: likelihoods[i % likelihoods.length],
      // "Risk Response Category" — exact field name per Section 35
      riskResponseCategory: riskCategories[i % riskCategories.length],
      status: riskStatuses[i % riskStatuses.length],
      raisedDate: new Date(2026, 4 + (i % 4), 1 + (i % 28)).toISOString().split('T')[0],
      dueDate: new Date(2026, 7 + (i % 3), 1 + (i % 28)).toISOString().split('T')[0],
      ctaId: i <= 10 ? `CTA-${String(i).padStart(4, '0')}` : null,
      findingId: i <= 8 ? `FND-${String(i).padStart(4, '0')}` : null,
      entity: ENTITIES[i % ENTITIES.length].name,
      classification: 'DEMO',
    });
  }
  return risks;
}

function getRiskTitle(i) {
  const titles = [
    'Key person dependency for SAP BASIS administration',
    'License expiry approaching for SAP BW/4HANA',
    'Integration middleware capacity risk during peak',
    'Data migration residual risk from go-live',
    'Single point of failure in MES connectivity',
    'Vendor support contract renewal delay risk',
    'Knowledge transfer gap for offshore team',
    'Security patch deployment backlog increasing',
  ];
  return titles[i % titles.length];
}

// ═══════════════════════════════════════════════════
// AUDITS, FINDINGS, CTAs — DEMO DATA
// ═══════════════════════════════════════════════════
function generateAudits() {
  return [
    {
      id: 'AUD-0001',
      title: 'AMS Incident & SLA Governance Review',
      auditName: 'AMS Incident & SLA Governance Review',
      type: 'Internal',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      framework: 'ITIL / Internal Control',
      leadAuditor: 'Fatima Al Zaabi',
      owner: 'Fatima Al Zaabi',
      plannedStart: '2026-09-01',
      plannedEnd: '2026-09-05',
      conductedDate: '2026-09-05',
      auditDate: '2026-09-05',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Requires Remediation',
      score: '91.4%',
      complianceScore: '91.4%',
      complianceScoreNum: 91.4,
      findingsCount: 5,
      openFindings: 4,
      criticalFindings: 1,
      majorFindings: 2,
      minorFindings: 2,
      overdueFindings: 1,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Comprehensive governance review evaluating P1/P2 SLA escalation paths, incident responder handoffs, and operational compliance.',
      scope: 'Cross-domain ITIL incident management workflows, duty manager bridge response times, and resolver escalation matrices.',
      systemsCovered: 'ManageEngine ITSM, ServiceNow, Azure Monitor, MS Teams MIM Bridges',
      nextReview: '2026-12-05',
      evidenceStatus: 'Remediation Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0002',
      title: 'Finance Close & Reconciliation Control Review',
      auditName: 'Finance Close & Reconciliation Control Review',
      type: 'Internal',
      businessDomain: 'R2R',
      processGroup: 'Financial Close',
      framework: 'Financial Controls',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Omar Al Suwaidi',
      plannedStart: '2026-08-10',
      plannedEnd: '2026-08-14',
      conductedDate: '2026-08-14',
      auditDate: '2026-08-14',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '91.4%',
      complianceScore: '91.4%',
      complianceScoreNum: 91.4,
      findingsCount: 7,
      openFindings: 2,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 6,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Assess the design and operating effectiveness of period-end financial reconciliation controls, automated journal entry approvals, and intercompany balance verification.',
      scope: 'General Ledger, Asset Accounting, Intercompany Reconciliations (BlackLine/SAP Financial Closing Cockpit).',
      systemsCovered: 'SAP S/4HANA FI-CO, BlackLine Reconciliation Engine',
      nextReview: '2026-11-15',
      evidenceStatus: 'Exceptions Logged',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0003',
      title: 'Procurement Approval & Segregation Review',
      auditName: 'Procurement Approval & Segregation Review',
      type: 'Compliance',
      businessDomain: 'P2P',
      processGroup: 'Procurement Governance',
      framework: 'SoD / Approval Controls',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      plannedStart: '2026-08-17',
      plannedEnd: '2026-08-21',
      conductedDate: '2026-08-21',
      auditDate: '2026-08-21',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '98.1%',
      complianceScore: '98.1%',
      complianceScoreNum: 98.1,
      findingsCount: 2,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Validate three-way matching enforcement, delegation of authority (DOA) tiers, and separation between purchase requisitioning, purchase order approval, and goods receipt.',
      scope: 'Ariba Sourcing & Procurement, SAP MM Purchasing workflows.',
      systemsCovered: 'SAP Ariba Network, SAP S/4HANA MM, OpenText VIM',
      nextReview: '2027-02-20',
      evidenceStatus: 'Fully Attested',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0004',
      title: 'Plan-to-Produce Control Effectiveness Audit',
      auditName: 'Plan-to-Produce Control Effectiveness Audit',
      type: 'Internal',
      businessDomain: 'P2P',
      processGroup: 'Production Planning',
      framework: 'Operational Controls',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      plannedStart: '2026-08-24',
      plannedEnd: '2026-08-28',
      conductedDate: '2026-08-28',
      auditDate: '2026-08-28',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '87.6%',
      complianceScore: '87.6%',
      complianceScoreNum: 87.6,
      findingsCount: 5,
      openFindings: 4,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 4,
      overdueFindings: 1,
      remediationStatus: 'Open',
      remediation: 'Open',
      objective: 'Examine shop-floor order release authorizations, BOM change controls, and real-time inventory staging validation in manufacturing facilities.',
      scope: 'Production Orders, Work Centers, Routing Master Data, Shop-Floor Execution.',
      systemsCovered: 'SAP PP/QM, Manufacturing Execution System (MES)',
      nextReview: '2026-10-15',
      evidenceStatus: 'Fieldwork Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0005',
      title: 'Engineer-to-Manufacture Change Governance Review',
      auditName: 'Engineer-to-Manufacture Change Governance Review',
      type: 'Compliance',
      businessDomain: 'E2M',
      processGroup: 'Engineering Change Management',
      framework: 'Change Governance',
      leadAuditor: 'Aisha Rahman',
      owner: 'Aisha Rahman',
      plannedStart: '2026-09-01',
      plannedEnd: '2026-09-04',
      conductedDate: null,
      auditDate: null,
      priority: 'High',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Not Started',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Started',
      remediation: 'Not Started',
      objective: 'Inspect engineering change order (ECO) lifecycle controls, CAD/PLM interface integrity, and production revision release sign-offs.',
      scope: 'Engineering Change Masters, Product Lifecycle Management (PLM) workflows.',
      systemsCovered: 'Siemens Teamcenter, SAP PLM/ECTR',
      nextReview: '2026-09-01',
      evidenceStatus: 'Pre-Audit Scoping',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0006',
      title: 'Order-to-Cash Revenue Control Review',
      auditName: 'Order-to-Cash Revenue Control Review',
      type: 'External',
      businessDomain: 'L2C',
      processGroup: 'Billing & Revenue Recognition',
      framework: 'Revenue Controls',
      leadAuditor: 'External Audit Team',
      owner: 'External Audit Team',
      plannedStart: '2026-09-07',
      plannedEnd: '2026-09-11',
      conductedDate: null,
      auditDate: null,
      priority: 'Critical',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Scheduled',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Scheduled',
      remediation: 'Not Scheduled',
      objective: 'Statutory external review of IFRS 15 revenue recognition milestone triggers, automated billing schedule validations, and credit limit overrides.',
      scope: 'Sales Orders, Milestone Billing Plans, Revenue Accounting and Reporting (RAR).',
      systemsCovered: 'SAP S/4HANA SD/RAR, HighRadius Credit Management',
      nextReview: '2026-09-07',
      evidenceStatus: 'Document Request Issued',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0007',
      title: 'Acquire-to-Dispose Asset Lifecycle Review',
      auditName: 'Acquire-to-Dispose Asset Lifecycle Review',
      type: 'Internal',
      businessDomain: 'A2D',
      processGroup: 'Asset Management',
      framework: 'Asset Lifecycle Controls',
      leadAuditor: 'Faisal Karim',
      owner: 'Faisal Karim',
      plannedStart: '2026-08-12',
      plannedEnd: '2026-08-15',
      conductedDate: '2026-08-15',
      auditDate: '2026-08-15',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '89.7%',
      complianceScore: '89.7%',
      complianceScoreNum: 89.7,
      findingsCount: 6,
      openFindings: 3,
      criticalFindings: 0,
      majorFindings: 2,
      minorFindings: 4,
      overdueFindings: 1,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Verify capital expenditure capitalization checkpoints, physical asset verification frequency, and asset retirement disposal certificates.',
      scope: 'Fixed Assets Register, Plant Maintenance asset master data, Capex AUC.',
      systemsCovered: 'SAP FI-AA, SAP Plant Maintenance (PM)',
      nextReview: '2026-11-20',
      evidenceStatus: 'Reconciliation Outstanding',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0008',
      title: 'Service Operations SLA Governance Review',
      auditName: 'Service Operations SLA Governance Review',
      type: 'Operational',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      framework: 'ITSM / SLA Governance',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      plannedStart: '2026-08-19',
      plannedEnd: '2026-08-22',
      conductedDate: '2026-08-22',
      auditDate: '2026-08-22',
      priority: 'Critical',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Requires Remediation',
      score: '84.9%',
      complianceScore: '84.9%',
      complianceScoreNum: 84.9,
      findingsCount: 9,
      openFindings: 5,
      criticalFindings: 1,
      majorFindings: 3,
      minorFindings: 5,
      overdueFindings: 2,
      remediationStatus: 'Escalated',
      remediation: 'Escalated',
      objective: 'Contractual SLA assurance review evaluating P1/P2 response times, Major Incident Management (MIM) communication cadences, and Problem Management RCA delivery compliance.',
      scope: 'ManageEngine ServiceDesk, Jira Service Management, Telemetry Pipelines.',
      systemsCovered: 'ManageEngine ITSM, ServiceNow, Azure Monitor',
      nextReview: '2026-09-22',
      evidenceStatus: 'Escalation Notice Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0009',
      title: 'Data-to-Systems Integration Control Review',
      auditName: 'Data-to-Systems Integration Control Review',
      type: 'Internal',
      businessDomain: 'D2S',
      processGroup: 'Integration Management',
      framework: 'Integration Controls',
      leadAuditor: 'Arjun Menon',
      owner: 'Arjun Menon',
      plannedStart: '2026-08-25',
      plannedEnd: '2026-08-29',
      conductedDate: '2026-08-29',
      auditDate: '2026-08-29',
      priority: 'Medium',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '97.2%',
      complianceScore: '97.2%',
      complianceScoreNum: 97.2,
      findingsCount: 3,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 3,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Review API gateway encryption standards, certificate rotation lifecycles, and message replay idempotency controls across cloud-to-ground integrations.',
      scope: 'SAP Integration Suite (Cloud Integration CPI), API Management, Kafka event brokers.',
      systemsCovered: 'SAP BTP CPI, Azure API Gateway, Confluent Kafka',
      nextReview: '2027-02-25',
      evidenceStatus: 'Certified',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0010',
      title: 'Supplier-to-Pay Master Data Governance',
      auditName: 'Supplier-to-Pay Master Data Governance',
      type: 'Compliance',
      businessDomain: 'S2P',
      processGroup: 'Supplier Master Data',
      framework: 'Master Data Governance',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Khalid Al Hashimi',
      plannedStart: '2026-09-02',
      plannedEnd: '2026-09-05',
      conductedDate: '2026-09-05',
      auditDate: '2026-09-05',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '92.3%',
      complianceScore: '92.3%',
      complianceScoreNum: 92.3,
      findingsCount: 4,
      openFindings: 2,
      criticalFindings: 0,
      majorFindings: 2,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Examine vendor banking detail change controls, tax residency verification, and duplicate supplier record cleansing protocols.',
      scope: 'Supplier Master Business Partner (BP) records, Bank Account Dual Approval.',
      systemsCovered: 'SAP Master Data Governance (MDG-S), SAP S/4HANA',
      nextReview: '2026-10-20',
      evidenceStatus: 'Field Testing Ongoing',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0011',
      title: 'HR Joiner / Mover / Leaver Controls',
      auditName: 'HR Joiner / Mover / Leaver Controls',
      type: 'Internal',
      businessDomain: 'H2R',
      processGroup: 'Employee Lifecycle',
      framework: 'Identity & Access Governance',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      plannedStart: '2026-09-08',
      plannedEnd: '2026-09-10',
      conductedDate: null,
      auditDate: null,
      priority: 'Medium',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Not Started',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Started',
      remediation: 'Not Started',
      objective: 'Audit automated offboarding de-provisioning within 24 hours, department transfer role revocation, and privileged access re-attestation.',
      scope: 'SuccessFactors Employee Central to Active Directory and SAP user provisioning.',
      systemsCovered: 'SAP SuccessFactors EC, Microsoft Entra ID, SailPoint IdentityIQ',
      nextReview: '2026-09-08',
      evidenceStatus: 'Pending Kickoff',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0012',
      title: 'Application Release & Transport Governance',
      auditName: 'Application Release & Transport Governance',
      type: 'Operational',
      businessDomain: 'Cross-Domain',
      processGroup: 'Release Management',
      framework: 'Change & Release Governance',
      leadAuditor: 'Omar Bashar',
      owner: 'Omar Bashar',
      plannedStart: '2026-08-27',
      plannedEnd: '2026-08-30',
      conductedDate: '2026-08-30',
      auditDate: '2026-08-30',
      priority: 'High',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Partially Compliant',
      score: '93.6%',
      complianceScore: '93.6%',
      complianceScoreNum: 93.6,
      findingsCount: 5,
      openFindings: 1,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 4,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Verify CTS+ transport import logs, production change advisory board (CAB) approvals, and automated code scan gate validations.',
      scope: 'ABAP Transport Management System (TMS), Solution Manager ChaRM, GitHub Enterprise.',
      systemsCovered: 'SAP ChaRM, SAP S/4HANA PRD, SonarQube',
      nextReview: '2026-11-30',
      evidenceStatus: 'Remediation Active',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0013',
      title: 'Manufacturing Business Continuity Readiness',
      auditName: 'Manufacturing Business Continuity Readiness',
      type: 'Operational',
      businessDomain: 'P2P',
      processGroup: 'Manufacturing Continuity',
      framework: 'Business Continuity',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      plannedStart: '2026-09-14',
      plannedEnd: '2026-09-18',
      conductedDate: null,
      auditDate: null,
      priority: 'Critical',
      status: 'Planned',
      auditStatus: 'Planned',
      complianceStatus: 'Scheduled',
      score: 'N/A',
      complianceScore: 'N/A',
      complianceScoreNum: null,
      findingsCount: 0,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 0,
      overdueFindings: 0,
      remediationStatus: 'Not Scheduled',
      remediation: 'Not Scheduled',
      objective: 'Review disaster recovery failover drill outcomes, shop-floor offline manual fallback protocols, and operational RTO/RPO adherence.',
      scope: 'Manufacturing facility plant servers, edge gateways, and core SAP replication.',
      systemsCovered: 'SAP HANA System Replication (HSR), Azure Disaster Recovery',
      nextReview: '2026-09-14',
      evidenceStatus: 'Pre-Audit Pack Ready',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0014',
      title: 'Knowledge & Operational Procedure Compliance',
      auditName: 'Knowledge & Operational Procedure Compliance',
      type: 'Internal',
      businessDomain: 'Cross-Domain',
      processGroup: 'Knowledge Management',
      framework: 'Operational Governance',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      plannedStart: '2026-08-20',
      plannedEnd: '2026-08-23',
      conductedDate: '2026-08-23',
      auditDate: '2026-08-23',
      priority: 'Low',
      status: 'Completed',
      auditStatus: 'Completed',
      complianceStatus: 'Compliant',
      score: '99.1%',
      complianceScore: '99.1%',
      complianceScoreNum: 99.1,
      findingsCount: 1,
      openFindings: 0,
      criticalFindings: 0,
      majorFindings: 0,
      minorFindings: 1,
      overdueFindings: 0,
      remediationStatus: 'Closed',
      remediation: 'Closed',
      objective: 'Verify standard operating procedure (SOP) annual review sign-offs, known error database (KEDB) article currency, and Tier 1 runbook validity.',
      scope: 'AMS Knowledge Base, ITSM KEDB, Technical SOP repository.',
      systemsCovered: 'EDGE Knowledge Portal, Confluence Enterprise',
      nextReview: '2027-02-23',
      evidenceStatus: 'Certified',
      classification: 'DEMO',
    },
    {
      id: 'AUD-0015',
      title: 'Customer Service Governance & Escalation Review',
      auditName: 'Customer Service Governance & Escalation Review',
      type: 'Operational',
      businessDomain: 'Cross-Domain',
      processGroup: 'Customer Service Management',
      framework: 'Service Governance',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      plannedStart: '2026-09-09',
      plannedEnd: '2026-09-12',
      conductedDate: '2026-09-12',
      auditDate: '2026-09-12',
      priority: 'High',
      status: 'In Progress',
      auditStatus: 'In Progress',
      complianceStatus: 'Under Review',
      score: '94.2%',
      complianceScore: '94.2%',
      complianceScoreNum: 94.2,
      findingsCount: 3,
      openFindings: 1,
      criticalFindings: 0,
      majorFindings: 1,
      minorFindings: 2,
      overdueFindings: 0,
      remediationStatus: 'In Progress',
      remediation: 'In Progress',
      objective: 'Evaluate Customer Corner communication responsiveness, Call to Action (CTA) turnaround intervals, and customer satisfaction (CSAT) complaint resolution.',
      scope: 'Customer Corner channels, SteerCom escalations, CSAT feedback registers.',
      systemsCovered: 'EDGE AMS Control Tower, Jira Service Management',
      nextReview: '2026-10-30',
      evidenceStatus: 'Preliminary Findings Logged',
      classification: 'DEMO',
    },
  ];
}

function generateFindings() {
  return [
    // Connected to AUD-0002 (Finance Close & Reconciliation Control Review) - 2 Open (1 Major, 1 Minor)
    {
      id: 'FND-0001',
      title: 'Segregation of duties exception in journal approval workflow',
      shortDescription: 'Segregation of duties exception in journal approval workflow',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'R2R',
      processGroup: 'Financial Close',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Omar Al Suwaidi',
      assignedTo: 'Omar Al Suwaidi',
      targetDate: '2026-09-15',
      dueDate: '2026-09-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0002',
      ctaId: 'CTA-0002',
      action: 'Enforce SAP GRC approval rule requiring dual independent sign-off on manual adjustments > AED 500k.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0002',
      title: 'Month-end intercompany variance automated ledger sync gap',
      shortDescription: 'Month-end intercompany variance automated ledger sync gap',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'R2R',
      processGroup: 'Financial Close',
      leadAuditor: 'Omar Al Suwaidi',
      owner: 'Tariq Al Dhaheri',
      assignedTo: 'Tariq Al Dhaheri',
      targetDate: '2026-09-30',
      dueDate: '2026-09-30',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0002',
      ctaId: 'CTA-0003',
      action: 'Deploy BlackLine automated matching rule for foreign currency intercompany trade accounts.',
      classification: 'DEMO',
    },
    // Connected to AUD-0004 (Plan-to-Produce Control Effectiveness Audit) - 4 Open (1 Major, 3 Minor)
    {
      id: 'FND-0003',
      title: 'Production approval workflow bypass in urgent plant work orders',
      shortDescription: 'Production approval workflow bypass in urgent plant work orders',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'P2P',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-10-10',
      dueDate: '2026-10-10',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0004',
      action: 'Re-enable mandatory plant manager digital sign-off on expedited work orders.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0004',
      title: 'Batch tracking sign-off documentation gap on assembly line 3',
      shortDescription: 'Batch tracking sign-off documentation gap on assembly line 3',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'P2P',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0005',
      action: 'Institute handheld barcode scanner mandatory confirmation step at station 3.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0005',
      title: 'Preventive maintenance interval logging discrepancy in plant asset records',
      shortDescription: 'Preventive maintenance interval logging discrepancy in plant asset records',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'P2P',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Faisal Karim',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-10-20',
      dueDate: '2026-10-20',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0006',
      action: 'Automate SAP PM calibration trigger based on machine operating runtime hours.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0006',
      title: 'QA calibration verification record lag on pneumatic testing units',
      shortDescription: 'QA calibration verification record lag on pneumatic testing units',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'P2P',
      processGroup: 'Production Planning',
      leadAuditor: 'Daniel Thomas',
      owner: 'Aisha Rahman',
      assignedTo: 'Aisha Rahman',
      targetDate: '2026-10-25',
      dueDate: '2026-10-25',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0004',
      ctaId: 'CTA-0007',
      action: 'Configure automated notification when calibration certificate expiration is within 14 days.',
      classification: 'DEMO',
    },
    // Connected to AUD-0007 (Acquire-to-Dispose Asset Lifecycle Review) - 3 Open (2 Major, 1 Minor)
    {
      id: 'FND-0007',
      title: 'Physical inventory tag reconciliation timing delay across warehouse bays',
      shortDescription: 'Physical inventory tag reconciliation timing delay across warehouse bays',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'A2D',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Faisal Karim',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-09-25',
      dueDate: '2026-09-25',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0008',
      action: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0008',
      title: 'Asset disposal authorization dual-control sign-off record delay',
      shortDescription: 'Asset disposal authorization dual-control sign-off record delay',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'A2D',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Khalid Al Hashimi',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-10-05',
      dueDate: '2026-10-05',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0009',
      action: 'Implement digital workflow approval for fixed asset scrap forms requiring Finance and Operations sign-off.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0009',
      title: 'Equipment serial number ledger synchronization gap',
      shortDescription: 'Equipment serial number ledger synchronization gap',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'A2D',
      processGroup: 'Asset Management',
      leadAuditor: 'Faisal Karim',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0007',
      ctaId: 'CTA-0010',
      action: 'Synchronize Plant Maintenance functional location identifiers with Fixed Asset master records.',
      classification: 'DEMO',
    },
    // Connected to AUD-0001 (AMS Incident & SLA Governance Review)
    {
      id: 'FND-0024',
      title: 'SLA escalation evidence gap for critical incidents',
      shortDescription: 'SLA escalation evidence gap for critical incidents',
      severity: 'Critical',
      impactCategory: 'Critical',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Fatima Al Zaabi',
      owner: 'AMS Service Manager',
      assignedTo: 'AMS Service Manager',
      targetDate: '2026-09-16',
      dueDate: '2026-09-16',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0011',
      action: 'Re-engineer incident bridge escalation protocol to mandate AMS duty manager check-in within 15 minutes.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0011',
      title: 'Change advisory board emergency approval backlog over 48 hours',
      shortDescription: 'Change advisory board emergency approval backlog over 48 hours',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Omar Bashar',
      assignedTo: 'Omar Bashar',
      targetDate: '2026-09-20',
      dueDate: '2026-09-20',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0012',
      action: 'Implement automated quorum voting via Teams/Email for critical out-of-cycle emergency RFCs.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0012',
      title: 'Incident communication cadence milestone adherence gap during outages',
      shortDescription: 'Incident communication cadence milestone adherence gap during outages',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Sara Al Marzouqi',
      assignedTo: 'Sara Al Marzouqi',
      targetDate: '2026-09-28',
      dueDate: '2026-09-28',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0013',
      action: 'Deploy automated 30-minute status broadcast broadcast template to SteerCom distribution group.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0013',
      title: 'Problem record RCA delivery SLA breach beyond contractual 5 business days',
      shortDescription: 'Problem record RCA delivery SLA breach beyond contractual 5 business days',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Rakesh Kumar',
      assignedTo: 'Rakesh Kumar',
      targetDate: '2026-10-02',
      dueDate: '2026-10-02',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0014',
      action: 'Institute RCA triage review session every Tuesday with functional lead sign-offs.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0014',
      title: 'Service desk first-call resolution categorization inconsistency',
      shortDescription: 'Service desk first-call resolution categorization inconsistency',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'Cross-Domain',
      processGroup: 'AMS Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Deepak Kumar',
      assignedTo: 'Deepak Kumar',
      targetDate: '2026-10-08',
      dueDate: '2026-10-08',
      status: 'In Progress',
      complianceStatus: 'In Progress',
      auditId: 'AUD-0008',
      ctaId: 'CTA-0015',
      action: 'Publish standardized multi-tier ticket taxonomy and provide refresher session to Level 1 agents.',
      classification: 'DEMO',
    },
    // Connected to AUD-0010 (Supplier-to-Pay Master Data Governance) - 2 Open (2 Major)
    {
      id: 'FND-0015',
      title: 'Supplier master tax identification verification lag for overseas vendors',
      shortDescription: 'Supplier master tax identification verification lag for overseas vendors',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'S2P',
      processGroup: 'Supplier Master Data',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Khalid Al Hashimi',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-10-12',
      dueDate: '2026-10-12',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0010',
      ctaId: 'CTA-0016',
      action: 'Integrate automated TRN/VAT validation API with UAE Federal Tax Authority portal in SAP MDG.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0016',
      title: 'Vendor bank detail dual-control verification procedure gap',
      shortDescription: 'Vendor bank detail dual-control verification procedure gap',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'S2P',
      processGroup: 'Supplier Master Data',
      leadAuditor: 'Khalid Al Hashimi',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-10-18',
      dueDate: '2026-10-18',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0010',
      ctaId: 'CTA-0017',
      action: 'Implement mandatory callback verification protocol prior to updating bank IBAN accounts.',
      classification: 'DEMO',
    },
    // Connected to AUD-0012 (Application Release & Transport Governance) - 1 Open (1 Major)
    {
      id: 'FND-0017',
      title: 'Production transport release without verified automated rollback script',
      shortDescription: 'Production transport release without verified automated rollback script',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'Cross-Domain',
      processGroup: 'Release Management',
      leadAuditor: 'Omar Bashar',
      owner: 'Omar Bashar',
      assignedTo: 'Omar Bashar',
      targetDate: '2026-10-05',
      dueDate: '2026-10-05',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0012',
      ctaId: 'CTA-0018',
      action: 'Mandate ChaRM automated validation check for reverse transport packages in pre-prod.',
      classification: 'DEMO',
    },
    // Connected to AUD-0015 (Customer Service Governance & Escalation Review) - 1 Open (1 Major)
    {
      id: 'FND-0018',
      title: 'Customer escalation matrix SLA notification failure on unresolved tickets',
      shortDescription: 'Customer escalation matrix SLA notification failure on unresolved tickets',
      severity: 'Major',
      impactCategory: 'Major',
      businessDomain: 'Cross-Domain',
      processGroup: 'Customer Service Management',
      leadAuditor: 'Noura Al Hashimi',
      owner: 'Noura Al Hashimi',
      assignedTo: 'Noura Al Hashimi',
      targetDate: '2026-10-15',
      dueDate: '2026-10-15',
      status: 'Open',
      complianceStatus: 'Open',
      auditId: 'AUD-0015',
      ctaId: 'CTA-0019',
      action: 'Fix webhook trigger linking Customer Corner pending thread status to Service Delivery Manager inbox.',
      classification: 'DEMO',
    },
    // Remediated / Closed Findings for Compliant Audits
    {
      id: 'FND-0019',
      title: 'Inactive employee SAP accounts pending de-provisioning beyond 48 hours',
      shortDescription: 'Inactive employee SAP accounts pending de-provisioning beyond 48 hours',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'H2R',
      processGroup: 'User Access Management',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-08-10',
      dueDate: '2026-08-10',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0020',
      action: 'Automated SuccessFactors leaver webhook integrated with SAP user locking script.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0020',
      title: 'Emergency firecall dialog user password rotation cycle irregularity',
      shortDescription: 'Emergency firecall dialog user password rotation cycle irregularity',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'H2R',
      processGroup: 'User Access Management',
      leadAuditor: 'Mariam Al Mansoori',
      owner: 'Mariam Al Mansoori',
      assignedTo: 'Mariam Al Mansoori',
      targetDate: '2026-08-12',
      dueDate: '2026-08-12',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0001',
      ctaId: 'CTA-0021',
      action: 'SAP GRC Emergency Access Management configured with 24-hour auto-reset policy.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0021',
      title: 'Procurement contract renewal alert threshold configured below 30 days',
      shortDescription: 'Procurement contract renewal alert threshold configured below 30 days',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'P2P',
      processGroup: 'Procurement Governance',
      leadAuditor: 'Sarah Nasser',
      owner: 'Sarah Nasser',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-08-25',
      dueDate: '2026-08-25',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0003',
      ctaId: 'CTA-0022',
      action: 'Ariba contract workspace expiry threshold updated to 60 days standard.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0022',
      title: 'Cloud integration TLS certificate renewal alert interval insufficient',
      shortDescription: 'Cloud integration TLS certificate renewal alert interval insufficient',
      severity: 'Minor',
      impactCategory: 'Minor',
      businessDomain: 'D2S',
      processGroup: 'Integration Management',
      leadAuditor: 'Arjun Menon',
      owner: 'Arjun Menon',
      assignedTo: 'Arjun Menon',
      targetDate: '2026-08-30',
      dueDate: '2026-08-30',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0009',
      ctaId: 'CTA-0023',
      action: 'Azure Key Vault automated certificate renewal telemetry connected to AMS alert channel.',
      classification: 'DEMO',
    },
    {
      id: 'FND-0023',
      title: 'KEDB article annual review timestamp overdue for 2 runbooks',
      shortDescription: 'KEDB article annual review timestamp overdue for 2 runbooks',
      severity: 'Observation',
      impactCategory: 'Observation',
      businessDomain: 'Cross-Domain',
      processGroup: 'Knowledge Management',
      leadAuditor: 'Daniel Thomas',
      owner: 'Daniel Thomas',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-08-25',
      dueDate: '2026-08-25',
      status: 'Remediated',
      complianceStatus: 'Remediated',
      auditId: 'AUD-0014',
      ctaId: 'CTA-0024',
      action: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks.',
      classification: 'DEMO',
    },
  ];
}

function generateRemediationTasks() {
  return [
    {
      id: 'TSK-0041',
      taskDescription: 'Review P1/P2 SLA escalation workflow',
      description: 'Review P1/P2 SLA escalation workflow',
      raisedOn: '2026-09-02',
      raisedBy: 'Governance Manager',
      assignedTo: 'AMS Service Manager',
      targetDate: '2026-09-10',
      status: 'In Progress',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0042',
      taskDescription: 'Configure SLA breach notification rules',
      description: 'Configure SLA breach notification rules',
      raisedOn: '2026-09-03',
      raisedBy: 'Governance Manager',
      assignedTo: 'AMS Technical Lead',
      targetDate: '2026-09-14',
      status: 'Not Started',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0043',
      taskDescription: 'Validate resolver escalation matrix',
      description: 'Validate resolver escalation matrix',
      raisedOn: '2026-09-03',
      raisedBy: 'Governance Manager',
      assignedTo: 'Operations Lead',
      targetDate: '2026-09-15',
      status: 'In Progress',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0044',
      taskDescription: 'Complete evidence pack and retest',
      description: 'Complete evidence pack and retest',
      raisedOn: '2026-09-04',
      raisedBy: 'Governance Manager',
      assignedTo: 'Compliance Specialist',
      targetDate: '2026-09-20',
      status: 'Not Started',
      auditId: 'AUD-0001',
      findingId: 'FND-0024',
      ctaId: 'CTA-0011',
    },
    {
      id: 'TSK-0045',
      taskDescription: 'Enforce SAP GRC approval rule requiring dual independent sign-off > AED 500k',
      description: 'Enforce SAP GRC approval rule requiring dual independent sign-off > AED 500k',
      raisedOn: '2026-08-20',
      raisedBy: 'Internal Auditor',
      assignedTo: 'Omar Al Suwaidi',
      targetDate: '2026-09-15',
      status: 'In Progress',
      auditId: 'AUD-0002',
      findingId: 'FND-0001',
      ctaId: 'CTA-0002',
    },
    {
      id: 'TSK-0046',
      taskDescription: 'Deploy BlackLine automated matching rule for intercompany foreign currencies',
      description: 'Deploy BlackLine automated matching rule for intercompany foreign currencies',
      raisedOn: '2026-08-25',
      raisedBy: 'Financial Systems Lead',
      assignedTo: 'Tariq Al Dhaheri',
      targetDate: '2026-09-30',
      status: 'Not Started',
      auditId: 'AUD-0002',
      findingId: 'FND-0002',
      ctaId: 'CTA-0003',
    },
    {
      id: 'TSK-0047',
      taskDescription: 'Re-enable mandatory plant manager digital sign-off on expedited work orders',
      description: 'Re-enable mandatory plant manager digital sign-off on expedited work orders',
      raisedOn: '2026-08-28',
      raisedBy: 'Quality Assurance Lead',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-09-04',
      status: 'In Progress',
      auditId: 'AUD-0004',
      findingId: 'FND-0003',
      ctaId: 'CTA-0004',
    },
    {
      id: 'TSK-0048',
      taskDescription: 'Institute handheld barcode scanner mandatory confirmation step at station 3',
      description: 'Institute handheld barcode scanner mandatory confirmation step at station 3',
      raisedOn: '2026-08-30',
      raisedBy: 'Plant Operations Manager',
      assignedTo: 'Sarah Nasser',
      targetDate: '2026-09-18',
      status: 'Not Started',
      auditId: 'AUD-0004',
      findingId: 'FND-0004',
      ctaId: 'CTA-0005',
    },
    {
      id: 'TSK-0049',
      taskDescription: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM',
      description: 'Enforce RFID-based weekly cycle counting with automatic discrepancy alerts in SAP EWM',
      raisedOn: '2026-08-29',
      raisedBy: 'Asset Assurance Lead',
      assignedTo: 'Faisal Karim',
      targetDate: '2026-09-22',
      status: 'In Progress',
      auditId: 'AUD-0007',
      findingId: 'FND-0007',
      ctaId: 'CTA-0008',
    },
    {
      id: 'TSK-0050',
      taskDescription: 'Integrate automated TRN/VAT validation API with UAE FTA portal in SAP MDG',
      description: 'Integrate automated TRN/VAT validation API with UAE FTA portal in SAP MDG',
      raisedOn: '2026-09-01',
      raisedBy: 'Data Governance Lead',
      assignedTo: 'Khalid Al Hashimi',
      targetDate: '2026-09-25',
      status: 'In Progress',
      auditId: 'AUD-0010',
      findingId: 'FND-0015',
      ctaId: 'CTA-0016',
    },
    {
      id: 'TSK-0051',
      taskDescription: 'Publish standardized multi-tier ticket taxonomy and deliver Level 1 refresher training',
      description: 'Publish standardized multi-tier ticket taxonomy and deliver Level 1 refresher training',
      raisedOn: '2026-08-25',
      raisedBy: 'Governance Manager',
      assignedTo: 'Deepak Kumar',
      targetDate: '2026-08-31',
      status: 'Completed',
      auditId: 'AUD-0008',
      findingId: 'FND-0014',
      ctaId: 'CTA-0015',
    },
    {
      id: 'TSK-0052',
      taskDescription: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks',
      description: 'Completed review and recertification of SAP BASIS and CPI restoration runbooks',
      raisedOn: '2026-08-15',
      raisedBy: 'Audit Lead',
      assignedTo: 'Daniel Thomas',
      targetDate: '2026-08-25',
      status: 'Completed',
      auditId: 'AUD-0014',
      findingId: 'FND-0023',
      ctaId: 'CTA-0024',
    },
  ];
}

function generateCTAs() {
  const ctas = [];
  const ctaCategories = ['Audit Action', 'Risk Action', 'Customer Action', 'Program Action', 'Transition Action', 'Service Improvement Action', 'General CTA'];
  const ctaStatuses = ['Open', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
  const sourceTypes = ['Audit', 'Risk', 'Customer', 'Program', 'Transition', 'Problem', 'Service Improvement'];

  for (let i = 1; i <= 35; i++) {
    const resource = RESOURCES[i % RESOURCES.length];
    const assignee = RESOURCES[(i + 3) % RESOURCES.length];
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];
    const dueDate = new Date(2026, 6 + (i % 5), 1 + (i % 28));

    ctas.push({
      id: `CTA-${String(i).padStart(4, '0')}`,
      action: getCTAAction(i),
      sourceType: sourceTypes[i % sourceTypes.length],
      sourceId: getSourceId(i, sourceTypes[i % sourceTypes.length]),
      owner: resource.name,
      ownerId: resource.id,
      assignedTo: assignee.name,
      assignedToId: assignee.id,
      priority: i <= 10 ? 'High' : i <= 25 ? 'Medium' : 'Low',
      raisedDate: new Date(2026, 5 + (i % 3), 1 + (i % 28)).toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: ctaStatuses[i % ctaStatuses.length],
      progress: Math.floor(Math.random() * 100),
      businessDomain: domain.key,
      application: APPLICATIONS[i % 26].name,
      entity: ENTITIES[i % ENTITIES.length].name,
      category: ctaCategories[i % ctaCategories.length],
      classification: 'DEMO',
    });
  }
  return ctas;
}

function getCTAAction(i) {
  const actions = [
    'Implement remediation for SoD violation',
    'Update disaster recovery runbook',
    'Complete vendor assessment documentation',
    'Resolve customer escalation on reporting',
    'Complete knowledge transfer for offshore team',
    'Deploy security patch for critical vulnerability',
    'Investigate root cause of recurring incidents',
    'Update SOP for period-end closing process',
  ];
  return actions[i % actions.length];
}

function getSourceId(i, sourceType) {
  const prefixes = { Audit: 'AUD', Risk: 'RSK', Customer: 'CST', Program: 'PRG', Transition: 'TRN', Problem: 'PRB', 'Service Improvement': 'SVI' };
  return `${prefixes[sourceType] || 'GEN'}-${String(((i - 1) % 12) + 1).padStart(4, '0')}`;
}

// ═══════════════════════════════════════════════════
// LICENSES — DEMO
// ═══════════════════════════════════════════════════
function generateLicenses() {
  const licenses = [];
  const renewalStatuses = ['Active', 'Renewal Pending', 'Expired', 'Under Negotiation'];
  const criticalities = ['Critical', 'High', 'Medium', 'Low'];

  for (let i = 1; i <= 22; i++) {
    const app = APPLICATIONS[i % 26];
    const quantity = Math.floor(Math.random() * 500) + 50;
    const consumed = Math.floor(quantity * (0.5 + Math.random() * 0.5));

    licenses.push({
      id: `LIC-${String(i).padStart(4, '0')}`,
      license: `${app.name} License`,
      application: app.name,
      applicationId: app.id,
      vendor: app.vendor,
      entitlementType: i % 3 === 0 ? 'Named User' : i % 3 === 1 ? 'Concurrent' : 'Enterprise',
      quantity,
      consumed,
      available: quantity - consumed,
      utilization: Math.round((consumed / quantity) * 100),
      expiryDate: new Date(2026, 8 + (i % 8), 1 + (i % 28)).toISOString().split('T')[0],
      renewalStatus: renewalStatuses[i % renewalStatuses.length],
      owner: RESOURCES[i % RESOURCES.length].name,
      businessDomain: BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length].key,
      criticality: criticalities[i % criticalities.length],
      risk: consumed / quantity > 0.9 ? 'High' : consumed / quantity > 0.75 ? 'Medium' : 'Low',
      classification: 'DEMO',
    });
  }
  return licenses;
}

// ═══════════════════════════════════════════════════
// KNOWLEDGE ARTICLES — DEMO
// ═══════════════════════════════════════════════════
function generateKnowledgeArticles() {
  const articles = [];
  const categories = ['How-To', 'Troubleshooting', 'Best Practice', 'Process Guide', 'FAQ', 'Configuration'];
  const articleStatuses = ['Published', 'Draft', 'Under Review', 'Archived'];

  for (let i = 1; i <= 25; i++) {
    const domain = BUSINESS_DOMAINS[i % BUSINESS_DOMAINS.length];

    articles.push({
      id: `KBA-${String(i).padStart(4, '0')}`,
      title: getKBArticleTitle(i, domain.label),
      category: categories[i % categories.length],
      businessDomain: domain.key,
      owner: RESOURCES[i % RESOURCES.length].name,
      status: articleStatuses[i % articleStatuses.length],
      lastUpdated: new Date(2026, 5 + (i % 4), 1 + (i % 28)).toISOString().split('T')[0],
      linkedIncidents: i <= 15 ? [`INC-${String(i).padStart(5, '0')}`] : [],
      linkedProblems: i <= 8 ? [`PRB-${String(i).padStart(5, '0')}`] : [],
      viewCount: Math.floor(Math.random() * 200) + 10,
      reviewStatus: i % 3 === 0 ? 'Review Due' : 'Current',
      classification: 'DEMO',
    });
  }
  return articles;
}

function getKBArticleTitle(i, domainLabel) {
  const titles = [
    `How to resolve period-end closing errors in ${domainLabel}`,
    `Troubleshooting guide for integration failures`,
    `Best practices for master data maintenance`,
    `Step-by-step guide for user access management`,
    `FAQ: Common questions about approval workflows`,
    `Configuration guide for output management`,
  ];
  return titles[i % titles.length];
}

// ═══════════════════════════════════════════════════
// CUSTOMER FEEDBACK — DEMO
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// CUSTOMER FEEDBACK — DEMO (Section 62)
// ═══════════════════════════════════════════════════
function generateCustomerFeedback() {
  const feedback = [];
  const ratingsConfig = [
    { rating: 'Excellent', comment: 'Exceptional response speed and technical depth from AMS lead. Zero business impact on operations.' },
    { rating: 'Very Good', comment: 'Issue resolved effectively within standard target. Proactive communication throughout.' },
    { rating: 'Good',      comment: 'Service restored within SLA. Prompt acknowledgement appreciated during peak transaction hours.' },
    { rating: 'Average',   comment: 'Resolution completed within SLA, but required multiple cross-team handoffs.' },
    { rating: 'Poor',      comment: 'Resolution delayed past standard target. Root cause review requested for SteerCom.' },
  ];

  // 50 verified surveys reflecting agreed CSAT distribution: 41 Excellent (82%), 5 Very Good (10%), 2 Good (4%), 1 Average (2%), 1 Poor (2%)
  for (let i = 1; i <= 50; i++) {
    let selected;
    if (i <= 41) selected = ratingsConfig[0];       // 82% Excellent
    else if (i <= 46) selected = ratingsConfig[1];  // 10% Very Good
    else if (i <= 48) selected = ratingsConfig[2];  // 4% Good
    else if (i === 49) selected = ratingsConfig[3]; // 2% Average
    else selected = ratingsConfig[4];               // 2% Poor (<5%)

    feedback.push({
      id: `CSAT-${String(i).padStart(4, '0')}`,
      ticketId: i % 2 === 0 ? `INC-${String(1000 + i).padStart(5, '0')}` : `SR-${String(2000 + i).padStart(5, '0')}`,
      rating: selected.rating,
      comment: selected.comment,
      respondent: RESOURCES[(i * 3) % RESOURCES.length].name,
      date: new Date(2026, (i - 1) % 9, 1 + ((i * 3) % 27)).toISOString().split('T')[0],
      entity: ENTITIES[i % ENTITIES.length].name,
      classification: 'DEMO',
    });
  }
  return feedback;
}

// ═══════════════════════════════════════════════════
// NOTIFICATIONS — DEMO (Section 64)
// Derived from application state, not randomly generated.
// ═══════════════════════════════════════════════════
export function generateNotifications(incidents, risks, ctas) {
  const notifications = [];
  const now = new Date();

  // P1 approaching SLA breach
  incidents.filter(inc => inc.priority === 'P1' && inc.slaStatus === 'At Risk').forEach((inc, idx) => {
    notifications.push({
      id: `NTF-${String(idx + 1).padStart(4, '0')}`,
      type: 'critical',
      title: 'P1 Approaching SLA Breach',
      message: `${inc.id}: ${inc.shortDescription}`,
      timestamp: new Date(now.getTime() - idx * 3600000).toISOString(),
      read: false,
      link: '/command-center/incidents',
      sourceId: inc.id,
    });
  });

  // Risk actions overdue
  risks.filter(r => r.status === 'Open' && new Date(r.dueDate) < now).forEach((risk, idx) => {
    notifications.push({
      id: `NTF-${String(20 + idx).padStart(4, '0')}`,
      type: 'warning',
      title: 'Risk Action Overdue',
      message: `${risk.id}: ${risk.title}`,
      timestamp: new Date(now.getTime() - (idx + 5) * 3600000).toISOString(),
      read: false,
      link: '/governance/risks',
      sourceId: risk.id,
    });
  });

  // Overdue CTAs
  ctas.filter(c => c.status === 'Overdue').slice(0, 5).forEach((cta, idx) => {
    notifications.push({
      id: `NTF-${String(40 + idx).padStart(4, '0')}`,
      type: 'warning',
      title: 'CTA Overdue',
      message: `${cta.id}: ${cta.action}`,
      timestamp: new Date(now.getTime() - (idx + 10) * 3600000).toISOString(),
      read: idx > 1,
      link: '/governance/actions',
      sourceId: cta.id,
    });
  });

  return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ═══════════════════════════════════════════════════
// LEAVE RECORDS — CANONICAL DEMO (Section 26)
// ═══════════════════════════════════════════════════
function generateLeaveRecords() {
  return [
    { id: 'LV-001', employeeId: 'RES-001', employeeName: 'Khalid Al Hashimi', leaveType: 'Annual Leave', startDate: '2026-06-18', endDate: '2026-06-25', status: 'Approved', backupResourceId: 'RES-002', backupResourceName: 'Fatima Al Zaabi', coverageNotes: 'Primary queue coverage assigned to Fatima Al Zaabi. On-call escalation routed to General Shift lead.' },
    { id: 'LV-002', employeeId: 'RES-003', employeeName: 'Ravi Shankar', leaveType: 'Technical Training', startDate: '2026-07-06', endDate: '2026-07-10', status: 'Approved', backupResourceId: 'RES-021', backupResourceName: 'Abdulrahman Darwish', coverageNotes: 'Attending SAP S/4HANA Sourcing certification boot-camp.' },
    { id: 'LV-003', employeeId: 'RES-005', employeeName: 'Priya Nair', leaveType: 'Annual Leave', startDate: '2026-07-15', endDate: '2026-07-24', status: 'Approved', backupResourceId: 'RES-013', backupResourceName: 'Hassan Al Nuaimi', coverageNotes: 'E2M manufacturing plant tickets delegated to Hassan Al Nuaimi.' },
    { id: 'LV-004', employeeId: 'RES-008', employeeName: 'Noura Al Shamsi', leaveType: 'Certification Exam', startDate: '2026-08-03', endDate: '2026-08-05', status: 'Approved', backupResourceId: 'RES-010', backupResourceName: 'Aisha Khalfan', coverageNotes: 'Ariba Guided Sourcing specialist exam leave.' },
    { id: 'LV-005', employeeId: 'RES-004', employeeName: 'Sara Al Marzouqi', leaveType: 'Annual Leave', startDate: '2026-08-16', endDate: '2026-08-27', status: 'Approved', backupResourceId: 'RES-016', backupResourceName: 'Raj Malhotra', coverageNotes: 'SuccessFactors HXM queue monitored by Raj Malhotra and Layla Al Qassimi.' },
    { id: 'LV-006', employeeId: 'RES-007', employeeName: 'Deepak Kumar', leaveType: 'Annual Leave', startDate: '2026-09-01', endDate: '2026-09-10', status: 'Approved', backupResourceId: 'RES-025', backupResourceName: 'Mansour Al Hosani', coverageNotes: 'R2R financial controlling escalation delegated to Mansour Al Hosani.' },
    { id: 'LV-007', employeeId: 'RES-015', employeeName: 'Tariq Al Dhaheri', leaveType: 'Technical Training', startDate: '2026-09-15', endDate: '2026-09-18', status: 'Approved', backupResourceId: 'RES-023', backupResourceName: 'Yousuf Al Kaabi', coverageNotes: 'Plant maintenance mobile inspection training.' },
    { id: 'LV-008', employeeId: 'RES-002', employeeName: 'Fatima Al Zaabi', leaveType: 'Annual Leave', startDate: '2026-10-12', endDate: '2026-10-20', status: 'Approved', backupResourceId: 'RES-017', backupResourceName: 'Mariam Al Suwaidi', coverageNotes: 'Acting AMS Team Lead designated to Mariam Al Suwaidi.' },
    { id: 'LV-009', employeeId: 'RES-014', employeeName: 'Sunita Reddy', leaveType: 'Exam / Certification', startDate: '2026-10-26', endDate: '2026-10-28', status: 'Approved', backupResourceId: 'RES-026', backupResourceName: 'Nisha Varma', coverageNotes: 'ABAP Cloud certification.' },
    { id: 'LV-010', employeeId: 'RES-018', employeeName: 'Vikram Singh', leaveType: 'Annual Leave', startDate: '2026-11-09', endDate: '2026-11-18', status: 'Approved', backupResourceId: 'RES-006', backupResourceName: 'Omar Bashar', coverageNotes: 'Supply chain IBP queue covered by Omar Bashar.' },
    { id: 'LV-011', employeeId: 'RES-011', employeeName: 'Mohammed Al Kindi', leaveType: 'Annual Leave', startDate: '2026-11-23', endDate: '2026-11-30', status: 'Approved', backupResourceId: 'RES-024', backupResourceName: 'Pooja Sharma', coverageNotes: 'Billing & Invoicing handled by Pooja Sharma.' },
    { id: 'LV-012', employeeId: 'RES-020', employeeName: 'Suresh Krishnan', leaveType: 'Annual Leave', startDate: '2026-12-07', endDate: '2026-12-16', status: 'Approved', backupResourceId: 'RES-009', backupResourceName: 'Ankit Patel', coverageNotes: 'BASIS on-call support secondary rotation active.' },
  ];
}

// ═══════════════════════════════════════════════════
// MINUTES OF MEETING (MOM) — FIRST-CLASS (Section MOM)
// ═══════════════════════════════════════════════════
function generateMOMRecords() {
  return [
    {
      id: 'MOM-001',
      meetingId: 'CAL-MTG-003',
      meetingTitle: 'Weekly Service Review (WSR) with HALCON Precision',
      meetingDate: '2026-06-18',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Halcon',
      businessDomain: 'E2M',
      processGroup: 'Production Planning',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Priya Nair',
      participants: ['Priya Nair (AMS Lead)', 'Ahmad Al Zaabi (HALCON IT Director)', 'Rashid Al Dhaheri (Plant Operations)', 'Suresh Krishnan (BASIS Lead)'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-06-19',
      momDueDate: '2026-06-20',
      summary: 'Reviewed recurring P2 batch job table locks impacting plant floor work orders. Assessed HALCON shopfloor interface health and upcoming S/4HANA FP02 pre-checks.',
      keyDecisions: [
        'Approved scheduled plant floor maintenance window for Sunday, June 28 at 22:00 GST.',
        'Convert custom lock clearance ABAP report into an automated self-healing KEDB runbook.',
        'Weekly batch job locking telemetry to be reported in Monday shift handover briefs.'
      ],
      actionItems: [
        { actionId: 'ACT-001', actionDescription: 'Deploy hotfix patch for sales order pricing lockups on plant terminal', owner: 'Khalid Al Hashimi', targetDate: '2026-06-25', status: 'Completed', priority: 'High', ctaId: 'CTA-001', isOverdue: false },
        { actionId: 'ACT-002', actionDescription: 'Configure automated scrap yield confirmation email trigger for plant supervisors', owner: 'Priya Nair', targetDate: '2026-07-02', status: 'Completed', priority: 'Medium', ctaId: 'CTA-002', isOverdue: false },
        { actionId: 'ACT-003', actionDescription: 'Implement table indexing on AFPO production order table in HANA DB', owner: 'Suresh Krishnan', targetDate: '2026-07-10', status: 'Completed', priority: 'High', ctaId: 'CTA-003', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-001',
      relatedProgram: 'PRG-001',
      relatedAudit: 'AUD-002',
    },
    {
      id: 'MOM-002',
      meetingId: 'CAL-MTG-002',
      meetingTitle: 'Weekly Service Review (WSR) with NIMR Defense Vehicles',
      meetingDate: '2026-06-04',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Nimr',
      businessDomain: 'E2M',
      processGroup: 'Manufacturing Assembly',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar (AMS Lead)', 'Mansoor Al Nuaimi (NIMR IT Head)', 'Tariq Al Dhaheri (Maintenance Lead)'],
      momStatus: 'Closed',
      momIssuedDate: '2026-06-05',
      momDueDate: '2026-06-06',
      summary: 'Reviewed armored vehicle assembly line serial barcode scanner latency and BOM synchronization with Teamcenter PLM.',
      keyDecisions: [
        'Teamcenter to S/4HANA interface queue retry mechanism increased to 5 attempts.',
        'Shopfloor handheld scanner firmware updated to TLS 1.3.'
      ],
      actionItems: [
        { actionId: 'ACT-004', actionDescription: 'Validate PLM BOM synchronization delta filters', owner: 'Ravi Shankar', targetDate: '2026-06-12', status: 'Completed', priority: 'Medium', ctaId: 'CTA-004', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-004',
      relatedProgram: 'PRG-001',
    },
    {
      id: 'MOM-003',
      meetingId: 'CAL-MTG-006',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - June Contractual Sign-Off',
      meetingDate: '2026-07-06',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi (SteerCom Chair)', 'Fatima Al Zaabi (AMS Lead)', 'KPMG Lead Partner', 'Group CFO Delegate'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-07-07',
      momDueDate: '2026-07-08',
      summary: 'Executive sign-off on June SLA score attainment (95.4% resolution compliance). Approved penalty bonus credits and reviewed H2 resource capacity allocations.',
      keyDecisions: [
        'Approved full June performance certificate with 0 contractual penalties.',
        'Allocated 160 hours of AMS-OF-Flex pool to FTA e-invoicing schema upgrade.',
        'Scheduled DC1 to DC2 failover drill for July 24 weekend.'
      ],
      actionItems: [
        { actionId: 'ACT-005', actionDescription: 'Finalize DR failover call tree and communication plan with Al Ain facility', owner: 'Rashid Al Dhaheri', targetDate: '2026-07-16', status: 'Completed', priority: 'High', ctaId: 'CTA-005', isOverdue: false },
        { actionId: 'ACT-006', actionDescription: 'Submit June SLA signed attestation to Group Internal Audit', owner: 'Fatima Al Zaabi', targetDate: '2026-07-12', status: 'Completed', priority: 'Medium', ctaId: 'CTA-006', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-005',
    },
    {
      id: 'MOM-004',
      meetingId: 'CAL-MTG-005',
      meetingTitle: 'Weekly Service Review (WSR) with ADASI Autonomous Systems',
      meetingDate: '2026-07-02',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'ADASI',
      businessDomain: 'S2P',
      processGroup: 'Strategic Sourcing',
      application: 'SAP Ariba Guided Sourcing',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi (AMS Lead)', 'Salim Al Ketbi (ADASI Supply Chain)', 'Deepak Kumar (Integration)'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-07-03',
      momDueDate: '2026-07-04',
      summary: 'Reviewed UAV spare parts procurement catalog integration and Tier-1 defense supplier punchout punchlist.',
      keyDecisions: [
        'Onboard 15 specialized avionics suppliers onto Ariba Network with automated PO acknowledgment.',
        'Add serial number attribute to Ariba ASN payload.'
      ],
      actionItems: [
        { actionId: 'ACT-007', actionDescription: 'Complete CPI mapping test for avionics supplier punchout cart', owner: 'Noura Al Shamsi', targetDate: '2026-07-18', status: 'Completed', priority: 'Medium', ctaId: 'CTA-007', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-007',
      relatedProgram: 'PRG-003',
    },
    {
      id: 'MOM-005',
      meetingId: 'CAL-MTG-021',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - July Contractual Sign-Off',
      meetingDate: '2026-08-03',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi (SteerCom Chair)', 'Fatima Al Zaabi (AMS Lead)', 'Executive Directors'],
      momStatus: 'Closed',
      momIssuedDate: '2026-08-04',
      momDueDate: '2026-08-05',
      summary: 'Signed off July availability and review of DR simulation success. Confirmed zero uncontained P1 incidents across all 34 entities.',
      keyDecisions: [
        'DR test certified successful: RTO achieved in 1h 48m (target 4h), RPO 0 minutes.',
        'Approved August maintenance bundle deployment schedule for August 28.'
      ],
      actionItems: [
        { actionId: 'ACT-008', actionDescription: 'Archive DR evidence bundle for ISO 22301 auditor review', owner: 'Rashid Al Dhaheri', targetDate: '2026-08-14', status: 'Completed', priority: 'Medium', ctaId: 'CTA-008', isOverdue: false },
      ],
      openActionCount: 0,
      overdueActionCount: 0,
      relatedCTA: 'CTA-008',
    },
    {
      id: 'MOM-006',
      meetingId: 'CAL-MTG-031',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - August Contractual Sign-Off',
      meetingDate: '2026-09-02',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Fatima Al Zaabi', 'Entity Stakeholders'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-09-03',
      momDueDate: '2026-09-04',
      summary: 'August operations sign-off. Reviewed capacity forecast for Q3 closeout and S/4HANA 2025 upgrade pre-validation checklist.',
      keyDecisions: [
        'Approved freeze window for Q3 financial closing (Sep 29–30).',
        'Authorized launch of AI Incident Co-Pilot pilot with General Shift engineers.'
      ],
      actionItems: [
        { actionId: 'ACT-009', actionDescription: 'Finalize ABAP test cockpit scans for S/4HANA upgrade pre-validation', owner: 'Sunita Reddy', targetDate: '2026-09-07', status: 'In Progress', priority: 'High', ctaId: 'CTA-009', isOverdue: false },
        { actionId: 'ACT-010', actionDescription: 'Publish Q3 change freeze reminder notice to all 34 entity CIOs', owner: 'Fatima Al Zaabi', targetDate: '2026-09-12', status: 'Open', priority: 'High', ctaId: 'CTA-010', isOverdue: false },
      ],
      openActionCount: 2,
      overdueActionCount: 0,
      relatedCTA: 'CTA-009',
    },
    {
      id: 'MOM-007',
      meetingId: 'CAL-MTG-032',
      meetingTitle: 'Weekly Service Review (WSR) with NIMR Defense Vehicles',
      meetingDate: '2026-09-03',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Nimr',
      businessDomain: 'E2M',
      processGroup: 'Manufacturing Assembly',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'Mansoor Al Nuaimi', 'Plant Floor Supervisor'],
      momStatus: 'Action Items Open',
      momIssuedDate: '2026-09-04',
      momDueDate: '2026-09-05',
      summary: 'Reviewed plant floor work order confirmation status and inventory batch traceability for JAIS armored vehicle export batch.',
      keyDecisions: [
        'Deploy dedicated handheld scanner station in Bay 4.',
        'Schedule weekend mock inventory count on September 19.'
      ],
      actionItems: [
        { actionId: 'ACT-011', actionDescription: 'Configure Bay 4 scanner RF terminal IP reservation', owner: 'Yousuf Al Kaabi', targetDate: '2026-09-09', status: 'Open', priority: 'Medium', ctaId: 'CTA-011', isOverdue: false },
        { actionId: 'ACT-012', actionDescription: 'Resolve serial number duplication bug on chassis assembly', owner: 'Ankit Patel', targetDate: '2026-09-04', status: 'Overdue', priority: 'Critical', ctaId: 'CTA-012', isOverdue: true },
      ],
      openActionCount: 2,
      overdueActionCount: 1,
      relatedCTA: 'CTA-012',
    },
    {
      id: 'MOM-008',
      meetingId: 'CAL-MTG-034',
      meetingTitle: 'Weekly Service Review (WSR) with HALCON Precision',
      meetingDate: '2026-09-10',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Halcon',
      businessDomain: 'E2M',
      processGroup: 'Production Planning',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Priya Nair',
      participants: ['Priya Nair', 'Ahmad Al Zaabi', 'HALCON Quality Manager'],
      momStatus: 'MOM Pending',
      momIssuedDate: '2026-09-11',
      momDueDate: '2026-09-12',
      summary: 'Triaged scrap logging tickets and batch master modifications for missile seeker head production line.',
      keyDecisions: [
        'Add scrap reason code 412 (optical alignment variance) to S/4HANA.',
        'Quality inspection lot skip-lot logic approved for certified raw aluminum billets.'
      ],
      actionItems: [
        { actionId: 'ACT-013', actionDescription: 'Transport scrap reason code 412 configuration to production', owner: 'Priya Nair', targetDate: '2026-09-16', status: 'Open', priority: 'Medium', ctaId: 'CTA-013', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
      relatedCTA: 'CTA-013',
    },
    {
      id: 'MOM-009',
      meetingId: 'CAL-MTG-036',
      meetingTitle: 'Weekly Service Review (WSR) with ADASI Autonomous Systems',
      meetingDate: '2026-09-17',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'ADASI',
      businessDomain: 'A2D',
      processGroup: 'Fleet Asset Maintenance',
      application: 'SAP PM/EAM',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi', 'ADASI Fleet Commander', 'Tariq Al Dhaheri'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-09-18',
      momDueDate: '2026-09-19',
      summary: 'Scheduled review of drone flight telemetry log sync and maintenance order automated generation based on flight hours.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-014', actionDescription: 'Deliver drone telemetry IoT to SAP PM interface proof-of-concept', owner: 'Tariq Al Dhaheri', targetDate: '2026-09-24', status: 'Open', priority: 'High', ctaId: 'CTA-014', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-010',
      meetingId: 'CAL-MTG-038',
      meetingTitle: 'Weekly Service Review (WSR) with EDGE HQ Executive',
      meetingDate: '2026-09-24',
      meetingTime: '14:00 – 15:30 GST',
      meetingType: 'Governance',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Reporting',
      application: 'SAC Executive Boardrooms',
      owner: 'Fatima Al Zaabi',
      participants: ['Fatima Al Zaabi', 'Group IT Director', 'Procurement VP'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-09-25',
      momDueDate: '2026-09-26',
      summary: 'Quarterly review of customer satisfaction metrics, SLA attainment across all entities, and upcoming October feature rollout.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-015', actionDescription: 'Prepare Q3 executive governance slide deck for Board presentation', owner: 'Fatima Al Zaabi', targetDate: '2026-09-28', status: 'Open', priority: 'High', ctaId: 'CTA-015', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-011',
      meetingId: 'CAL-MTG-040',
      meetingTitle: 'Weekly Service Review (WSR) with CARACAL Defense',
      meetingDate: '2026-10-01',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Caracal',
      businessDomain: 'E2M',
      processGroup: 'Manufacturing Quality',
      application: 'SAP S/4HANA Manufacturing',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'CARACAL Operations Lead'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-02',
      momDueDate: '2026-10-03',
      summary: 'Review of small arms serialization barcode scanning and proof-house test firing records integration into S/4HANA.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-016', actionDescription: 'Test proof-house automated pressure sensor calibration interface', owner: 'Ankit Patel', targetDate: '2026-10-08', status: 'Open', priority: 'Medium', ctaId: 'CTA-016', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-012',
      meetingId: 'CAL-MTG-041',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - September Contractual Sign-Off',
      meetingDate: '2026-10-05',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'SteerCom Board Members'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-06',
      momDueDate: '2026-10-07',
      summary: 'Q3 formal contractual sign-off, penalty performance credits, and budget approval for Q4 enhancement packages.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-017', actionDescription: 'Execute contractual Q3 penalty credit true-up memorandum', owner: 'Fatima Al Zaabi', targetDate: '2026-10-14', status: 'Open', priority: 'High', ctaId: 'CTA-017', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-013',
      meetingId: 'CAL-MTG-047',
      meetingTitle: 'Weekly Service Review (WSR) with KATIM Secure Communications',
      meetingDate: '2026-10-22',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'Katim',
      businessDomain: 'L2C',
      processGroup: 'Product Lifecycle',
      application: 'Microsoft Dynamics 365 CRM',
      owner: 'Noura Al Shamsi',
      participants: ['Noura Al Shamsi', 'KATIM Product Director'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-10-23',
      momDueDate: '2026-10-24',
      summary: 'Cryptographic phone hardware RMA warranty claims and automated spare parts dispatch workflow.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-018', actionDescription: 'Implement HSM token validation step in customer portal warranty return', owner: 'Noura Al Shamsi', targetDate: '2026-10-29', status: 'Open', priority: 'High', ctaId: 'CTA-018', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-014',
      meetingId: 'CAL-MTG-050',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - October Contractual Sign-Off',
      meetingDate: '2026-11-02',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Executive Board'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-11-03',
      momDueDate: '2026-11-04',
      summary: 'October operations review, IDEX exhibition defense freeze compliance post-mortem, and year-end audit readiness.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-019', actionDescription: 'Confirm PwC audit evidence room access credentials for external team', owner: 'Fatima Al Mansoori', targetDate: '2026-11-10', status: 'Open', priority: 'High', ctaId: 'CTA-019', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-015',
      meetingId: 'CAL-MTG-056',
      meetingTitle: 'Weekly Service Review (WSR) with ADSB Naval Shipyards',
      meetingDate: '2026-11-19',
      meetingTime: '10:00 – 11:30 GST',
      meetingType: 'Service Review',
      customerOrEntity: 'ADSB',
      businessDomain: 'R2R',
      processGroup: 'Project Systems',
      application: 'SAP S/4HANA Project Systems',
      owner: 'Ravi Shankar',
      participants: ['Ravi Shankar', 'ADSB Commercial Director'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-11-20',
      momDueDate: '2026-11-21',
      summary: 'Naval vessel overhaul milestone billing and subcontractor percentage of completion (POC) revenue recognition.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-020', actionDescription: 'Configure milestone billing rule for Falaj naval patrol vessel retrofit', owner: 'Ravi Shankar', targetDate: '2026-11-25', status: 'Open', priority: 'Medium', ctaId: 'CTA-020', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
    {
      id: 'MOM-016',
      meetingId: 'CAL-MTG-060',
      meetingTitle: 'Monthly Executive SteerCom Review (MSR) - November Contractual Sign-Off',
      meetingDate: '2026-12-02',
      meetingTime: '14:00 – 16:00 GST',
      meetingType: 'SteerCom',
      customerOrEntity: 'EDGE Corp.',
      businessDomain: 'R2R',
      processGroup: 'Executive Governance',
      application: 'AdvantEDGE Landscape',
      owner: 'Dr. Tariq Al Nuaimi',
      participants: ['Dr. Tariq Al Nuaimi', 'Executive Committee'],
      momStatus: 'Scheduled',
      momIssuedDate: '2026-12-03',
      momDueDate: '2026-12-04',
      summary: 'November SLA review, approval of annual change moratorium dates, and 2027 AMS capacity planning horizon sign-off.',
      keyDecisions: [],
      actionItems: [
        { actionId: 'ACT-021', actionDescription: 'Publish 2027 AMS holiday and tri-shift operational roster', owner: 'Khalid Al Hashimi', targetDate: '2026-12-10', status: 'Open', priority: 'High', ctaId: 'CTA-021', isOverdue: false },
      ],
      openActionCount: 1,
      overdueActionCount: 0,
    },
  ];
}

// ═══════════════════════════════════════════════════
// CHANGE MANAGEMENT / CAB RECORDS (Section 29)
// ═══════════════════════════════════════════════════
function generateChangeRecords() {
  return [
    { id: 'CR-001', title: 'S/4HANA Sales Pricing Condition Routine Patch', changeType: 'Emergency', implementationDate: '2026-06-08', timeWindow: '23:00 – 02:00 GST', owner: 'Fatima Al Zaabi', risk: 'Medium', status: 'Implemented', application: 'SAP S/4HANA Core', cabReviewDate: '2026-06-02' },
    { id: 'CR-002', title: 'SuccessFactors Delta Integration Mapping Pack v4.2', changeType: 'Normal', implementationDate: '2026-06-17', timeWindow: '22:00 – 01:30 GST', owner: 'Sara Al Marzouqi', risk: 'Low', status: 'Implemented', application: 'SAP SuccessFactors', cabReviewDate: '2026-06-09' },
    { id: 'CR-003', title: 'Edge B2B Supplier Portal MFA Session Hardening', changeType: 'Normal', implementationDate: '2026-06-24', timeWindow: '23:00 – 01:00 GST', owner: 'Ahmad Al Zaabi', risk: 'Low', status: 'Implemented', application: 'Supplier Portal', cabReviewDate: '2026-06-16' },
    { id: 'CR-004', title: 'AdvantEDGE June Major Sprint Release Cutover', changeType: 'Normal', implementationDate: '2026-06-30', timeWindow: '21:00 – 05:00 GST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'AdvantEDGE Landscape', cabReviewDate: '2026-06-23' },
    { id: 'CR-005', title: 'SAP CPI Integration Suite Flow Re-certification', changeType: 'Normal', implementationDate: '2026-07-10', timeWindow: '23:00 – 02:00 GST', owner: 'Deepak Kumar', risk: 'Medium', status: 'Implemented', application: 'SAP BTP CPI', cabReviewDate: '2026-07-07' },
    { id: 'CR-006', title: 'Mid-Year Tax Engine & FTA E-Invoicing Regulatory Update', changeType: 'Normal', implementationDate: '2026-07-15', timeWindow: '22:00 – 03:00 GST', owner: 'Fatima Al Zaabi', risk: 'High', status: 'Implemented', application: 'SAP S/4HANA Finance', cabReviewDate: '2026-07-07' },
    { id: 'CR-007', title: 'July AdvantEDGE Production Maintenance Bundle', changeType: 'Normal', implementationDate: '2026-07-31', timeWindow: '22:00 – 04:00 GST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'AdvantEDGE Landscape', cabReviewDate: '2026-07-28' },
    { id: 'CR-008', title: 'Microsoft Dynamics 365 CRM Service Sprint 4', changeType: 'Normal', implementationDate: '2026-08-07', timeWindow: '23:00 – 02:00 GST', owner: 'Hind Al Mazrouei', risk: 'Medium', status: 'Implemented', application: 'Microsoft Dynamics 365', cabReviewDate: '2026-08-04' },
    { id: 'CR-009', title: 'AdvantEDGE August Maintenance Bundle Deployment', changeType: 'Normal', implementationDate: '2026-08-28', timeWindow: '22:00 – 04:00 GST', owner: 'Release Management', risk: 'High', status: 'Implemented', application: 'AdvantEDGE Landscape', cabReviewDate: '2026-08-25' },
    { id: 'CR-010', title: 'SAC Executive Boardroom Telemetry Optimization Patch', changeType: 'Standard', implementationDate: '2026-09-10', timeWindow: '22:00 – 01:00 GST', owner: 'Analytics Lead', risk: 'Low', status: 'Approved', application: 'SAP Analytics Cloud', cabReviewDate: '2026-09-08' },
    { id: 'CR-011', title: 'AdvantEDGE September Production Sprint Release', changeType: 'Normal', implementationDate: '2026-09-28', timeWindow: '21:00 – 04:00 GST', owner: 'Release Management', risk: 'High', status: 'Approved', application: 'AdvantEDGE Landscape', cabReviewDate: '2026-09-22' },
    { id: 'CR-012', title: 'S/4HANA Feature Pack 02 Application Rollout', changeType: 'Normal', implementationDate: '2026-10-09', timeWindow: '21:00 – 05:00 GST', owner: 'Core Architecture', risk: 'High', status: 'Approved', application: 'SAP S/4HANA Core', cabReviewDate: '2026-10-06' },
    { id: 'CR-013', title: 'SuccessFactors Year-End Performance Module Patch', changeType: 'Normal', implementationDate: '2026-11-06', timeWindow: '22:00 – 01:00 GST', owner: 'Sara Al Marzouqi', risk: 'Medium', status: 'Scheduled', application: 'SAP SuccessFactors', cabReviewDate: '2026-11-03' },
    { id: 'CR-014', title: 'AdvantEDGE Q4 Pre-Freeze Stabilization Release', changeType: 'Normal', implementationDate: '2026-12-18', timeWindow: '21:00 – 04:00 GST', owner: 'Release Management', risk: 'High', status: 'Scheduled', application: 'AdvantEDGE Landscape', cabReviewDate: '2026-12-15' },
  ];
}

// ═══════════════════════════════════════════════════
// GENERATE ALL DEMO DATA
// ═══════════════════════════════════════════════════
export const incidents = generateIncidents();
export const serviceRequests = generateServiceRequests();
export const enhancements = generateEnhancements();
export const problems = generateProblems();
export const risks = generateRisks();
export const audits = generateAudits();
export const findings = generateFindings();
export const remediationTasks = generateRemediationTasks();
export const ctas = generateCTAs();
export const licenses = generateLicenses();
export const knowledgeArticles = generateKnowledgeArticles();
export const customerFeedback = generateCustomerFeedback();
export const leaveRecords = generateLeaveRecords();
export const momRecords = generateMOMRecords();
export const changeRecords = generateChangeRecords();
export const notifications = generateNotifications(incidents, risks, ctas);

// ═══════════════════════════════════════════════════
// AGGREGATE STATS (for Executive Board / KPIs)
// ═══════════════════════════════════════════════════
export function getIncidentStats() {
  const total = incidents.length;
  const p1 = incidents.filter(i => i.priority === 'P1');
  const p2 = incidents.filter(i => i.priority === 'P2');
  const p3 = incidents.filter(i => i.priority === 'P3');
  const p4 = incidents.filter(i => i.priority === 'P4');
  const open = incidents.filter(i => !['Closed', 'Resolved'].includes(i.status));
  const breached = incidents.filter(i => i.slaStatus === 'Breached');

  return {
    total, open: open.length, p1: p1.length, p2: p2.length, p3: p3.length, p4: p4.length,
    breached: breached.length,
    responseSlaPercent: Math.round((incidents.filter(i => i.responseSla === 'Met').length / total) * 100),
    resolutionSlaPercent: Math.round((incidents.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / total) * 100),
    p1ResponseSla: p1.length ? Math.round((p1.filter(i => i.responseSla === 'Met').length / p1.length) * 100) : 100,
    p1ResolutionSla: p1.length ? Math.round((p1.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / p1.length) * 100) : 100,
    p2ResponseSla: p2.length ? Math.round((p2.filter(i => i.responseSla === 'Met').length / p2.length) * 100) : 100,
    p2ResolutionSla: p2.length ? Math.round((p2.filter(i => ['Met', 'On Track'].includes(i.resolutionSla)).length / p2.length) * 100) : 100,
  };
}

export function getSRStats() {
  const total = serviceRequests.length;
  const standard = serviceRequests.filter(sr => sr.srType === 'Standard');
  const major = serviceRequests.filter(sr => sr.srType === 'Major');
  const open = serviceRequests.filter(sr => !['Closed', 'Resolved', 'Rejected'].includes(sr.status));
  return { total, standard: standard.length, major: major.length, open: open.length, created: total, closed: serviceRequests.filter(sr => sr.status === 'Closed').length, slaPercent: Math.round((serviceRequests.filter(sr => sr.slaStatus === 'Met').length / total) * 100) };
}

export function getResourceStats() {
  const total = RESOURCES.length;
  const onsite = RESOURCES.filter(r => r.location === 'Onsite');
  const offshore = RESOURCES.filter(r => r.location === 'Offshore');
  const female = RESOURCES.filter(r => r.gender === 'Female');
  const uae = RESOURCES.filter(r => r.nationality === 'UAE');
  return { total, onsite: onsite.length, offshore: offshore.length, female: female.length, femalePercent: Math.round((female.length / total) * 100), localNational: uae.length, localNationalPercent: Math.round((uae.length / total) * 100) };
}
