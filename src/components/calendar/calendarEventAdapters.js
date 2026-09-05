/**
 * EDGE AMS Control Tower — Global Calendar Normalization & Aggregation Layer
 * 
 * CRITICAL ARCHITECTURAL PRINCIPLE:
 * Single Source of Truth.
 * Aggregates directly from canonical portal records:
 * - Approved Leave (leaveRecords)
 * - Compliance Audits (audits)
 * - Audit Tasks & Findings (findings, ctas)
 * - Program Milestones (PROGRAM_GOVERNANCE_DATA)
 * - CAB Changes (changeRecords)
 * - Production Releases (RELEASE_PIPELINE_DATA)
 * - SteerCom & Reviews (OPERATIONAL_MEETINGS)
 * - Minutes of Meeting (momRecords)
 * - MOM Action Items (momRecords.actionItems)
 * - Transition Milestones (TRANSITION_GATES)
 * - Training & Enablement (TRAINING_CLINICS)
 * - Knowledge Reviews (knowledgeArticles)
 * - SLA Governance Reviews (SLA_REVIEWS)
 * - Customer Connect Meetings (CUSTOMER_CONNECT_SESSIONS)
 * - Critical Business Periods / Freezes (CRITICAL_BUSINESS_WINDOWS)
 * 
 * Maps all into normalized CalendarEvent structure with clean title/shortTitle.
 */

import { EVENT_TYPES, EVENT_TYPE_CONFIG } from './calendarTypes';
import {
  leaveRecords,
  momRecords,
  changeRecords,
  audits,
  findings,
  ctas,
  knowledgeArticles,
} from '../../data/demoData';

/**
 * Enterprise Programs canonical milestones (aligned with /governance/programs)
 */
const PROGRAM_GOVERNANCE_DATA = [
  {
    programId: 'PRG-001',
    programName: 'AdvantEDGE S/4HANA 2025 Wave 3 Rollout',
    lead: 'Fatima Al Zaabi',
    entities: 'HALCON, NIMR, LAHAB, EPI',
    milestones: [
      { id: 'MS-W3-01', name: 'Wave 3 Blueprint Sign-Off', date: '2026-06-22', status: 'Completed', priority: 'High', desc: 'Core template architecture sign-off across manufacturing clusters.' },
      { id: 'MS-W3-02', name: 'Manufacturing Core SIT Testing', date: '2026-07-20', status: 'Completed', priority: 'High', desc: 'End-to-end simulation of MES-to-S/4HANA production order flows.' },
      { id: 'MS-W3-03', name: 'UAT Gate 1 Sign-Off', date: '2026-08-17', status: 'Completed', priority: 'High', desc: 'Formal business scenario verification by cluster operational leads.' },
      { id: 'MS-W3-04', name: 'Pre-Cutover Mock Migration 3', date: '2026-09-15', status: 'Scheduled', priority: 'Critical', desc: 'Mock 3 cutover execution with 2.8M master and transactional records.' },
      { id: 'MS-W3-05', name: 'Go-Live Readiness Gate Review', date: '2026-10-19', status: 'Scheduled', priority: 'Critical', desc: 'SteerCom approval for greenfield plant production cutover.' },
      { id: 'MS-W3-06', name: 'Wave 3 Production Cutover', date: '2026-11-16', status: 'Scheduled', priority: 'Critical', desc: 'Final operational cutover and hypercare launch for Wave 3 plants.' },
    ],
  },
  {
    programId: 'PRG-002',
    programName: 'SuccessFactors HXM Harmonization',
    lead: 'Sara Al Marzouqi',
    entities: 'All 34 EDGE Group Entities',
    milestones: [
      { id: 'MS-HXM-01', name: 'Global Job Architecture Alignment', date: '2026-06-12', status: 'Completed', priority: 'Medium', desc: 'Harmonization of 180+ defense position profiles across group entities.' },
      { id: 'MS-HXM-02', name: 'Payroll & Gratuity Integration', date: '2026-07-28', status: 'Completed', priority: 'High', desc: 'UAE labor law compliance validation for automated EOS gratuity calculations.' },
      { id: 'MS-HXM-03', name: 'Mobile Self-Service Checkpoint', date: '2026-09-22', status: 'Scheduled', priority: 'High', desc: 'Biometric mobile app rollout for shopfloor and field service technicians.' },
      { id: 'MS-HXM-04', name: 'HXM Operational Handover', date: '2026-10-28', status: 'Scheduled', priority: 'High', desc: 'Formal transition from implementation team into AMS steady-state support.' },
    ],
  },
  {
    programId: 'PRG-003',
    programName: 'Ariba Guided Sourcing & Subcontracting',
    lead: 'Noura Al Shamsi',
    entities: 'ADASI, Al Tariq, Beacon Red, Oryx Labs',
    milestones: [
      { id: 'MS-ARB-01', name: 'Supplier Security Clearance Gateway', date: '2026-07-06', status: 'Completed', priority: 'High', desc: 'Automated handshake between eVendor portal and defense security vetting.' },
      { id: 'MS-ARB-02', name: 'Contract Workspaces Pilot', date: '2026-08-24', status: 'Completed', priority: 'Medium', desc: 'Pilot rollout of complex subcontract milestone payment workflows.' },
      { id: 'MS-ARB-03', name: 'Guided Sourcing Gate Review', date: '2026-10-12', status: 'Scheduled', priority: 'High', desc: 'Go/No-Go evaluation for onboarding 450 strategic defense suppliers.' },
      { id: 'MS-ARB-04', name: 'Supplier Network Cutover', date: '2026-11-23', status: 'Scheduled', priority: 'High', desc: 'Mandatory supplier portal cutover for all purchase orders > 500k AED.' },
    ],
  },
];

/**
 * Production Release Pipeline (aligned with /technology/releases)
 */
const RELEASE_PIPELINE_DATA = [
  { id: 'REL-2026-06', name: 'AdvantEDGE June Feature Sprint Release', date: '2026-06-30', timeWindow: '21:00 – 05:00 GST', type: 'Major Release', status: 'Deployed', priority: 'P1', changesCount: 22, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-07A', name: 'July Critical Hotfix & Tax Patch', date: '2026-07-15', timeWindow: '22:00 – 03:00 GST', type: 'Emergency Patch', status: 'Deployed', priority: 'High', changesCount: 4, owner: 'Financial Systems Lead', app: 'SAP S/4HANA Finance' },
  { id: 'REL-2026-07B', name: 'July AdvantEDGE Maintenance Bundle', date: '2026-07-31', timeWindow: '22:00 – 04:00 GST', type: 'Major Release', status: 'Deployed', priority: 'High', changesCount: 18, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-08A', name: 'D365 Field Service Enterprise Sprint 4', date: '2026-08-07', timeWindow: '23:00 – 02:00 GST', type: 'Cloud Release', status: 'Deployed', priority: 'Medium', changesCount: 6, owner: 'CRM Tech Lead', app: 'Microsoft Dynamics 365' },
  { id: 'REL-2026-08B', name: 'AdvantEDGE August Maintenance Bundle', date: '2026-08-28', timeWindow: '22:00 – 04:00 GST', type: 'Major Release', status: 'Deployed', priority: 'High', changesCount: 14, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-09A', name: 'SAC Executive Boardroom Telemetry Patch', date: '2026-09-10', timeWindow: '22:00 – 01:00 GST', type: 'BI Analytics Patch', status: 'Scheduled', priority: 'Medium', changesCount: 5, owner: 'Analytics Lead', app: 'SAP Analytics Cloud' },
  { id: 'REL-2026-09B', name: 'AdvantEDGE September Production Sprint', date: '2026-09-28', timeWindow: '21:00 – 04:00 GST', type: 'Major Release', status: 'Scheduled', priority: 'P1', changesCount: 26, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-10A', name: 'S/4HANA Feature Pack 02 Application Rollout', date: '2026-10-09', timeWindow: '21:00 – 05:00 GST', type: 'Feature Pack', status: 'Scheduled', priority: 'P1', changesCount: 19, owner: 'Core Architecture', app: 'SAP S/4HANA Core' },
  { id: 'REL-2026-10B', name: 'October AdvantEDGE Maintenance Bundle', date: '2026-10-30', timeWindow: '22:00 – 04:00 GST', type: 'Monthly Release', status: 'Scheduled', priority: 'High', changesCount: 16, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-11A', name: 'SuccessFactors Year-End Performance Patch', date: '2026-11-06', timeWindow: '22:00 – 01:00 GST', type: 'HR Cloud Patch', status: 'Scheduled', priority: 'Medium', changesCount: 7, owner: 'HR Tech Lead', app: 'SAP SuccessFactors' },
  { id: 'REL-2026-11B', name: 'November AdvantEDGE Production Sprint', date: '2026-11-27', timeWindow: '21:00 – 04:30 GST', type: 'Major Release', status: 'Scheduled', priority: 'P1', changesCount: 24, owner: 'CAB Release Manager', app: 'AdvantEDGE Landscape' },
  { id: 'REL-2026-12A', name: 'Year-End Financial Consolidation Hotfix', date: '2026-12-11', timeWindow: '22:00 – 02:00 GST', type: 'Hotfix Deployment', status: 'Scheduled', priority: 'High', changesCount: 8, owner: 'Financial Systems Lead', app: 'SAP Group Reporting' },
];

/**
 * Critical Business Windows & Change Freezes (aligned with /technology/releases)
 */
const CRITICAL_BUSINESS_WINDOWS = [
  { id: 'CBW-001', name: 'Mid-Year Fiscal Close & VAT Freeze', startDate: '2026-06-25', endDate: '2026-07-03', scope: 'All Financial (R2R, L2C, P2P) Systems', owner: 'Group CFO & CAB Lead', status: 'Mandatory Policy', desc: 'No production transports or schema modifications allowed during statutory mid-year financial close.' },
  { id: 'CBW-002', name: 'Q3 Critical Period & Financial Freeze', startDate: '2026-09-24', endDate: '2026-10-02', scope: 'All Financial & Supply Chain Systems', owner: 'Executive SteerCom & CAB', status: 'Mandatory Policy', desc: 'Strict deployment freeze during Q3 quarterly financial reconciliation and audit sampling.' },
  { id: 'CBW-003', name: 'UAE National Day Operational Freeze', startDate: '2026-11-28', endDate: '2026-12-05', scope: 'All AdvantEDGE Production Systems', owner: 'EDGE Group Operations', status: 'Mandatory Policy', desc: 'Statutory public holiday stability window. Only emergency P1 break-fixes permitted with VP approval.' },
  { id: 'CBW-004', name: 'Year-End Financial Closing & Moratorium', startDate: '2026-12-18', endDate: '2027-01-05', scope: 'All Production ERP, Cloud & Integration Systems', owner: 'Group Executive Committee', status: 'Mandatory Policy', desc: 'Annual change moratorium. All infrastructure modifications and application transports frozen for fiscal year-end.' },
];

/**
 * Operational & Governance Meetings (SteerCom, Reviews, Handover)
 */
const OPERATIONAL_MEETINGS = [
  { id: 'MTG-001', title: 'AMS Daily Operational Handover', date: '2026-06-15', time: '14:00 – 14:30 GST', owner: 'Service Delivery Lead', status: 'Completed', priority: 'Medium', entity: 'Abu Dhabi Ops Center', domain: 'Cross-Domain', desc: 'Daily shift sync reviewing incident ticket backlog, open P1/P2s, and critical batch runs.' },
  { id: 'MTG-002', title: 'Weekly Operational CAB Review', date: '2026-07-14', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'High', entity: 'EDGE Group HQ', domain: 'Cross-Domain', desc: 'Weekly change advisory board reviewing 18 upcoming production change requests and risk assessments.' },
  { id: 'MTG-003', title: 'Monthly Executive SteerCom Review (MSR)', date: '2026-07-02', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', entity: 'EDGE Group HQ', domain: 'Executive Governance', desc: 'Quarterly contractual executive steering committee with client leadership reviewing SLA compliance and KPI scorecard.' },
  { id: 'MTG-004', title: 'Weekly Service Review (WSR) with HALCON', date: '2026-08-13', time: '10:00 – 11:30 GST', owner: 'Sultan Al Dhaheri', status: 'Completed', priority: 'Medium', entity: 'HALCON', domain: 'E2M', desc: 'Weekly operational review on MES shopfloor telemetry and procurement workflow resolution velocity.' },
  { id: 'MTG-005', title: 'AMS Continuous Improvement Review', date: '2026-09-03', time: '14:00 – 15:30 GST', owner: 'Quality Assurance Board', status: 'Scheduled', priority: 'Medium', entity: 'Abu Dhabi Ops Center', domain: 'Cross-Domain', desc: 'Bi-weekly retrospective on recurring problem tickets, known error articles, and automation candidates.' },
  { id: 'MTG-006', title: 'Weekly Service Review (WSR) with NIMR', date: '2026-09-17', time: '10:00 – 11:30 GST', owner: 'Mansoor Al Ketbi', status: 'Scheduled', priority: 'Medium', entity: 'NIMR', domain: 'P2P', desc: 'Review of warranty claim dispatch workflows, serial number traceability, and S/4HANA batch performance.' },
  { id: 'MTG-007', title: 'Monthly Executive SteerCom Review (MSR)', date: '2026-10-07', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', entity: 'EDGE Group HQ', domain: 'Executive Governance', desc: 'SteerCom review for Q3 operational performance, SLA penalties, and Q4 change freeze dates.' },
  { id: 'MTG-008', title: 'Weekly Service Review (WSR) with CARACAL', date: '2026-10-22', time: '10:00 – 11:30 GST', owner: 'Hassan Al Hammadi', status: 'Scheduled', priority: 'Medium', entity: 'CARACAL', domain: 'E2M', desc: 'MES-to-ERP batch latency review, quality certificate automation, and export control validation.' },
  { id: 'MTG-009', title: 'Weekly Service Review (WSR) with ADASI', date: '2026-11-05', time: '10:00 – 11:30 GST', owner: 'Omar Al Suwaidi', status: 'Scheduled', priority: 'Medium', entity: 'ADASI', domain: 'D2S', desc: 'Subcontract PO clearance, Ariba guided sourcing adoption, and BOM revision synchronization.' },
  { id: 'MTG-010', title: 'Monthly Executive SteerCom Review (MSR)', date: '2026-12-02', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', entity: 'EDGE Group HQ', domain: 'Executive Governance', desc: 'November SLA review, approval of annual change moratorium dates, and 2027 AMS capacity planning sign-off.' },
];

/**
 * Transition Governance Milestones (aligned with /governance/transition)
 */
const TRANSITION_GATES = [
  { id: 'TRN-GATE-01', name: 'Phase 1: Knowledge Acquisition Gate', date: '2026-06-18', status: 'Completed', progress: 100, owner: 'Transition Director', domain: 'Cross-Domain', desc: 'Initial architecture scoping, landscape mapping, and baseline SLA verification.' },
  { id: 'TRN-GATE-02', name: 'Phase 2: Comprehensive KT Gate', date: '2026-07-24', status: 'Completed', progress: 100, owner: 'Transition Director', domain: 'Cross-Domain', desc: '142 documented standard operating procedures (SOPs) and runbooks validated by domain leads.' },
  { id: 'TRN-GATE-03', name: 'Phase 3: Primary Shadow Gate', date: '2026-08-21', status: 'Completed', progress: 100, owner: 'Service Delivery Lead', domain: 'Cross-Domain', desc: '1,240 hands-on shadow hours completed with zero SLA escalations during handover.' },
  { id: 'TRN-GATE-04', name: 'Phase 4: S2P & H2R Reverse Shadow Gate', date: '2026-09-18', status: 'Scheduled', progress: 96, owner: 'Transition Director', domain: 'S2P, H2R', desc: 'Final reverse shadow sign-off for Strategic Sourcing and Hire-to-Retire domain support.' },
  { id: 'TRN-GATE-05', name: 'Phase 4: Steady-State Acceptance Gate', date: '2026-10-16', status: 'Scheduled', progress: 98, owner: 'Dr. Tariq Al Nuaimi', domain: 'All 8 Domains', desc: 'Formal contractual acceptance of AMS steady-state operations across all 34 entities.' },
];

/**
 * User Enablement & Training Clinics
 */
const TRAINING_CLINICS = [
  { id: 'TRN-001', title: 'SAP Fiori Advanced Analytics Clinic', date: '2026-06-23', time: '14:00 – 16:00 GST', owner: 'Fiori Lead', audience: 'Entity Directors & Functional Leads', status: 'Completed', domain: 'L2C, R2R', desc: 'Executive training on personalizing Fiori cards, SAC storybooks, and real-time drilldowns.' },
  { id: 'TRN-002', title: 'S/4HANA Period-End Closing Runbook', date: '2026-07-21', time: '10:00 – 12:30 GST', owner: 'Lead Financial Consultant', audience: 'Finance & Controlling Teams', status: 'Completed', domain: 'R2R', desc: 'Standard operating procedures for accelerated fiscal close and automated intercompany matching.' },
  { id: 'TRN-003', title: 'MES Shopfloor Operator Training', date: '2026-08-11', time: '09:00 – 12:00 GST', owner: 'MES Specialist', audience: 'Plant Technicians & Line Supervisors', status: 'Completed', domain: 'E2M', desc: 'Hands-on clinic on digital work instructions, quality checklists, and shopfloor barcode dispatch.' },
  { id: 'TRN-004', title: 'Ariba Guided Sourcing Masterclass', date: '2026-09-15', time: '14:00 – 16:00 GST', owner: 'Procurement Specialist', audience: 'Buyers & Procurement Officers', status: 'Scheduled', domain: 'P2P, S2P', desc: 'End-to-end guidance on RFQ creation, automated tier-1 evaluation, and contract workspaces.' },
  { id: 'TRN-005', title: 'ITIL Incident Escalation Enablement', date: '2026-10-13', time: '11:00 – 13:00 GST', owner: 'ITSM Process Owner', audience: 'Tier 1 Service Desk & Track Leads', status: 'Scheduled', domain: 'Service Desk', desc: 'Best practices for priority triage, major incident mobilization, and post-incident root cause documentation.' },
  { id: 'TRN-006', title: 'SuccessFactors Goal Review Clinic', date: '2026-11-10', time: '14:00 – 15:30 GST', owner: 'HR Tech Specialist', audience: 'Group HR Managers & People Leads', status: 'Scheduled', domain: 'H2R', desc: 'Annual employee review cycle workflows, calibration matrix, and merit increment calculations.' },
  { id: 'TRN-007', title: 'Ariba Contract Milestone Invoicing', date: '2026-11-23', time: '14:00 – 16:00 GST', owner: 'Ariba Lead', audience: 'Procurement Specialists & SCM Leads', status: 'Scheduled', domain: 'S2P', desc: 'Training procurement specialists on milestone payment releases and compliance gates.' },
  { id: 'TRN-008', title: 'Year-End Closing Audit Preparation', date: '2026-12-08', time: '10:00 – 13:00 GST', owner: 'Lead Financial Architect', audience: 'Accounting Managers & Controllers', status: 'Scheduled', domain: 'R2R', desc: 'Preparation of statutory financial schedules and external auditor workpaper packs.' },
];

/**
 * SLA Governance Reviews (Contractual & Operational)
 */
const SLA_REVIEWS = [
  { id: 'SLA-REV-01', title: 'June Contractual SLA Review', date: '2026-06-30', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Completed', priority: 'High', desc: 'Monthly contractual SLA performance evaluation against 99.5% target. Result: 99.4% achieved.' },
  { id: 'SLA-REV-02', title: 'July Contractual SLA Review', date: '2026-07-31', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Completed', priority: 'High', desc: 'Monthly review verifying P1/P2 response SLA (100% met) and resolution SLA (98.8% met).' },
  { id: 'SLA-REV-03', title: 'August Contractual SLA Review', date: '2026-08-31', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Completed', priority: 'High', desc: 'Monthly review verifying MTTR reduction and zero contractual penalty points accrued.' },
  { id: 'SLA-REV-04', title: 'September Contractual SLA Review', date: '2026-09-30', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Scheduled', priority: 'High', desc: 'Quarterly review including customer satisfaction scores and root cause analysis for breached tickets.' },
  { id: 'SLA-REV-05', title: 'October Contractual SLA Review', date: '2026-10-30', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Scheduled', priority: 'High', desc: 'Monthly performance scorecard sign-off and service credit ledger audit.' },
  { id: 'SLA-REV-06', title: 'November Contractual SLA Review', date: '2026-11-30', time: '16:00 – 17:30 GST', owner: 'SLA Governance Lead', status: 'Scheduled', priority: 'High', desc: 'Pre-year-end SLA review and SLA target recalibration for 2027 contract year.' },
  { id: 'SLA-REV-07', title: 'Year-End Comprehensive SLA Review', date: '2026-12-22', time: '14:00 – 16:30 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'Critical', desc: 'Comprehensive annual contractual review with EDGE Group executive sponsors.' },
];

/**
 * Customer Connect Sessions (Customer Corner)
 */
const CUSTOMER_CONNECT_SESSIONS = [
  { id: 'CUST-SES-01', title: 'Customer Review with HALCON', date: '2026-06-18', time: '11:00 – 12:00 GST', owner: 'Customer Success Lead', customer: 'HALCON', status: 'Completed', desc: 'Review of shopfloor ticket volume, user sentiment, and automated resolution feedback.' },
  { id: 'CUST-SES-02', title: 'Customer Alignment with NIMR', date: '2026-07-16', time: '14:00 – 15:30 GST', owner: 'Customer Success Lead', customer: 'NIMR', status: 'Completed', desc: 'Discussion on S/4HANA variant configuration performance and field technician satisfaction.' },
  { id: 'CUST-SES-03', title: 'Quarterly CSAT Survey Debrief', date: '2026-08-19', time: '15:00 – 16:30 GST', owner: 'Customer Experience Lead', customer: 'EDGE Corp.', status: 'Completed', desc: 'Analysis of 180+ verified survey responses. CSAT score: 4.62 / 5.0 across entities.' },
  { id: 'CUST-SES-04', title: 'Customer Review with CARACAL', date: '2026-09-16', time: '11:00 – 12:30 GST', owner: 'Customer Success Lead', customer: 'CARACAL', status: 'Scheduled', desc: 'Reviewing recent incident trends, automated ticket dispatch, and training requirements.' },
  { id: 'CUST-SES-05', title: 'Customer Review with ADASI', date: '2026-10-14', time: '14:00 – 15:30 GST', owner: 'Customer Success Lead', customer: 'ADASI', status: 'Scheduled', desc: 'Engagement session reviewing supply chain ticket turnaround and vendor portal usability.' },
  { id: 'CUST-SES-06', title: 'Customer Review with KATIM Finland', date: '2026-11-12', time: '13:00 – 14:30 GST', owner: 'Customer Success Lead', customer: 'Katim Finland', status: 'Scheduled', desc: 'International entity support review, time zone coverage feedback, and secure messaging integration.' },
  { id: 'CUST-SES-07', title: 'Customer Advisory Board Session', date: '2026-12-09', time: '14:00 – 16:00 GST', owner: 'Customer Experience Lead', customer: 'All 34 Entities', status: 'Scheduled', desc: 'Annual executive advisory meeting gathering voice-of-the-customer inputs for 2027 AMS roadmap.' },
];

/**
 * Normalizes event titles and creates clean short titles for month scanning.
 * Eliminates "MOM: MOM — ..." redundancy and handles fallbacks.
 */
function normalizeTitleAndShort(type, rawTitle, extraContext = '') {
  let text = String(rawTitle || '').trim();

  // Fallback if empty or undefined
  if (!text || text === 'undefined' || text === 'null') {
    if (type === EVENT_TYPES.MOM) text = 'MOM — Governance Review';
    else if (type === EVENT_TYPES.MOM_ACTION) text = 'MOM Action — Task Due';
    else if (type === EVENT_TYPES.MEETING) text = 'Operational Review Meeting';
    else if (type === EVENT_TYPES.TRAINING) text = 'Enablement Training Session';
    else if (type === EVENT_TYPES.AUDIT) text = 'Compliance Audit Review';
    else if (type === EVENT_TYPES.AUDIT_TASK) text = 'Audit Task Review';
    else if (type === EVENT_TYPES.CHANGE) text = 'CAB Change Request';
    else if (type === EVENT_TYPES.RELEASE) text = 'Production Release';
    else text = 'Operational Event';
  }

  // Strip repeated redundant prefixes
  text = text.replace(/^MOM\s*:\s*MOM\s*[—–-]\s*/i, 'MOM — ');
  text = text.replace(/^MOM\s*:\s*/i, 'MOM — ');
  text = text.replace(/^MOM\s*-\s*/i, 'MOM — ');
  text = text.replace(/^MOM Action\s*:\s*/i, 'MOM Action — ');
  text = text.replace(/^MOM Action\s*-\s*/i, 'MOM Action — ');
  text = text.replace(/^Audit Task\s*:\s*/i, 'Audit Task — ');

  let fullTitle = text;
  let shortTitle = text;

  if (type === EVENT_TYPES.MOM) {
    if (!fullTitle.startsWith('MOM — ')) {
      fullTitle = `MOM — ${fullTitle}`;
    }
    // Clean short title for Month view scanning:
    let core = fullTitle.replace(/^MOM\s*[—–-]\s*/i, '');
    core = core.replace(/\(.*?\)/g, '').replace(/[-–].*$/, '').trim();
    if (core.includes('Weekly Service Review')) {
      core = core.replace('Weekly Service Review with', 'WSR').replace('Weekly Service Review', 'WSR').trim();
    } else if (core.includes('Monthly Executive SteerCom')) {
      core = 'SteerCom Review';
    }
    shortTitle = `MOM — ${core}`;
  } else if (type === EVENT_TYPES.MOM_ACTION) {
    if (!fullTitle.startsWith('MOM Action — ')) {
      fullTitle = `MOM Action — ${fullTitle}`;
    }
    let core = fullTitle.replace(/^MOM Action\s*[—–-]\s*/i, '');
    core = core.split('.')[0].trim();
    if (core.length > 22) {
      core = core.substring(0, 20).trim() + '…';
    }
    shortTitle = `Action — ${core}`;
  } else if (type === EVENT_TYPES.MEETING) {
    let core = fullTitle.replace(/\(.*?\)/g, '').trim();
    if (core.includes('Weekly Service Review with')) {
      core = core.replace('Weekly Service Review with', 'WSR —').trim();
    } else if (core.includes('Weekly Service Review')) {
      core = 'Weekly Service Review';
    } else if (core.includes('Monthly Executive SteerCom')) {
      core = 'SteerCom Review';
    } else if (core.includes('AMS Daily Operational Handover')) {
      core = 'Daily Shift Handover';
    } else if (core.includes('Weekly Operational CAB')) {
      core = 'Weekly CAB Review';
    }
    shortTitle = core;
  } else if (type === EVENT_TYPES.AUDIT) {
    let core = fullTitle.replace(/\(.*?\)/g, '').trim();
    core = core.replace(/Audit\s*Q\d.*$/i, 'Audit').trim();
    shortTitle = core;
  } else if (type === EVENT_TYPES.AUDIT_TASK) {
    let core = fullTitle.replace(/^Audit Task\s*[—–-]\s*/i, '').trim();
    if (core.length > 22) core = core.substring(0, 20).trim() + '…';
    shortTitle = `Task — ${core}`;
  } else if (type === EVENT_TYPES.CHANGE) {
    shortTitle = fullTitle.length > 26 ? fullTitle.substring(0, 24).trim() + '…' : fullTitle;
  } else if (type === EVENT_TYPES.RELEASE) {
    shortTitle = fullTitle.length > 26 ? fullTitle.substring(0, 24).trim() + '…' : fullTitle;
  } else if (type === EVENT_TYPES.LEAVE) {
    shortTitle = fullTitle;
  } else {
    shortTitle = fullTitle.length > 28 ? fullTitle.substring(0, 26).trim() + '…' : fullTitle;
  }

  return { title: fullTitle, shortTitle };
}

/**
 * ADAPTER: Normalize all canonical sources into standard CalendarEvent[]
 */
export function normalizeCalendarEvents() {
  const events = [];

  // 1. LEAVE RECORDS (Source: demoData.js -> leaveRecords)
  if (Array.isArray(leaveRecords)) {
    leaveRecords.forEach(l => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.LEAVE];
      const rawTitle = `${l.employee || 'Consultant'} — ${l.leaveType || 'Leave'}`;
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.LEAVE, rawTitle);

      events.push({
        id: l.id,
        type: EVENT_TYPES.LEAVE,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: `${l.leaveType || 'Leave'} for ${l.employee || 'Consultant'} (${l.domain || 'AMS Services'}). Backup resource: ${l.backupResource || 'Nominated Lead'}. Handover notes: ${l.coverageNotes || 'Full operational handover confirmed.'}`,
        startDate: l.startDate,
        endDate: l.endDate,
        startTime: 'All Day',
        endTime: 'All Day',
        allDay: true,
        status: l.status || 'Approved',
        priority: 'Medium',
        owner: l.employee || 'Consultant',
        relatedResource: l.employee,
        backupResource: l.backupResource,
        relatedBusinessDomain: l.domain || 'AMS Operations',
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'LeaveRecord',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  }

  // 2. COMPLIANCE AUDITS (Source: demoData.js -> audits)
  if (Array.isArray(audits)) {
    audits.forEach(a => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.AUDIT];
      const startDate = a.plannedStart || a.startDate || a.date || '2026-06-15';
      const endDate = a.plannedEnd || a.endDate || a.date || startDate;
      const rawTitle = a.auditName || a.title || 'Compliance Audit';
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.AUDIT, rawTitle);

      events.push({
        id: a.id,
        type: EVENT_TYPES.AUDIT,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: a.scope || a.description || `${a.type || 'Compliance'} audit covering ${a.businessDomain || 'AdvantEDGE'} operations.`,
        startDate: startDate,
        endDate: endDate,
        startTime: a.time || a.timeWindow || '09:00 – 16:00 GST',
        endTime: '16:00 GST',
        allDay: !a.time && !a.timeWindow,
        status: a.auditStatus || a.status || 'Planned',
        priority: a.priority || 'High',
        owner: a.owner || a.leadAuditor || 'Ahmad Al Zaabi',
        entityId: a.entity || 'EDGE Group HQ',
        customerOrEntity: a.entity || 'EDGE Group HQ',
        relatedBusinessDomain: a.businessDomain || a.domain || 'R2R',
        relatedApplication: a.application || 'SAP S/4HANA 2025',
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'Audit',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  }

  // 3. AUDIT TASKS & CTAS (Source: demoData.js -> findings + ctas)
  if (Array.isArray(findings)) {
    findings.forEach(f => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.AUDIT_TASK];
      const targetDate = f.targetDate || f.dueDate || '2026-09-18';
      const rawTitle = `Audit Task: ${f.shortDescription || f.title || f.id}`;
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.AUDIT_TASK, rawTitle);

      events.push({
        id: f.id,
        type: EVENT_TYPES.AUDIT_TASK,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: f.remediation || f.shortDescription || f.description || `Corrective remediation for finding ${f.id} (${f.auditId || 'Compliance'}).`,
        startDate: targetDate,
        endDate: targetDate,
        startTime: '16:00 GST',
        endTime: '17:00 GST',
        allDay: true,
        status: f.complianceStatus || f.status || 'Open',
        priority: f.impactCategory || f.severity || 'High',
        owner: f.assignedTo || f.owner || 'AMS Governance',
        entityId: f.entity || 'EDGE Group',
        customerOrEntity: f.entity || 'EDGE Group',
        relatedAudit: f.auditId,
        relatedCTA: f.ctaId,
        relatedBusinessDomain: f.businessDomain || f.domain || 'R2R',
        relatedApplication: f.application || 'SAP GRC / S/4HANA',
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'AuditTask',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  }

  // 4. PROGRAM MILESTONES (Source: PROGRAM_GOVERNANCE_DATA)
  PROGRAM_GOVERNANCE_DATA.forEach(prg => {
    prg.milestones.forEach(m => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.PROGRAM_MILESTONE];
      const rawTitle = `${prg.programName}: ${m.name}`;
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.PROGRAM_MILESTONE, rawTitle);

      events.push({
        id: m.id,
        type: EVENT_TYPES.PROGRAM_MILESTONE,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle: `${prg.programId}: ${m.name}`,
        description: `${m.desc} Program Lead: ${prg.lead}. Participating Entities: ${prg.entities}.`,
        startDate: m.date,
        endDate: m.date,
        startTime: '11:00 GST',
        endTime: '12:00 GST',
        allDay: true,
        status: m.status,
        priority: m.priority,
        owner: prg.lead,
        customerOrEntity: prg.entities,
        relatedProgram: prg.programName,
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'ProgramMilestone',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  });

  // 5. CAB CHANGES (Source: demoData.js -> changeRecords)
  if (Array.isArray(changeRecords)) {
    changeRecords.forEach(c => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.CHANGE];
      const rawTitle = `${c.id}: ${c.title}`;
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.CHANGE, rawTitle);

      events.push({
        id: c.id,
        type: EVENT_TYPES.CHANGE,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: `${c.changeType} change for ${c.application}. CAB review: ${c.cabReviewDate}. Risk level: ${c.risk}.`,
        startDate: c.implementationDate,
        endDate: c.implementationDate,
        startTime: c.timeWindow ? c.timeWindow.split('–')[0].trim() : '22:00 GST',
        endTime: c.timeWindow && c.timeWindow.includes('–') ? c.timeWindow.split('–')[1].trim() : '02:00 GST',
        allDay: false,
        status: c.status,
        priority: c.risk === 'High' ? 'High' : 'Medium',
        owner: c.owner,
        relatedApplication: c.application,
        riskLevel: c.risk,
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'ChangeRequest',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  }

  // 6. PRODUCTION RELEASES (Source: RELEASE_PIPELINE_DATA)
  RELEASE_PIPELINE_DATA.forEach(r => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.RELEASE];
    const rawTitle = `${r.id}: ${r.name}`;
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.RELEASE, rawTitle);

    events.push({
      id: r.id,
      type: EVENT_TYPES.RELEASE,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: `${r.type} incorporating ${r.changesCount} approved CAB change packages on ${r.app}. Execution window: ${r.timeWindow}.`,
      startDate: r.date,
      endDate: r.date,
      startTime: r.timeWindow ? r.timeWindow.split('–')[0].trim() : '22:00 GST',
      endTime: r.timeWindow && r.timeWindow.includes('–') ? r.timeWindow.split('–')[1].trim() : '04:00 GST',
      allDay: false,
      status: r.status,
      priority: r.priority,
      owner: r.owner,
      relatedApplication: r.app,
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'ProductionRelease',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 7. STEERCOM & OPERATIONAL MEETINGS (Source: OPERATIONAL_MEETINGS)
  OPERATIONAL_MEETINGS.forEach(mtg => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.MEETING];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.MEETING, mtg.title);

    events.push({
      id: mtg.id,
      type: EVENT_TYPES.MEETING,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: mtg.desc,
      startDate: mtg.date,
      endDate: mtg.date,
      startTime: mtg.time ? mtg.time.split('–')[0].trim() : '10:00 GST',
      endTime: mtg.time && mtg.time.includes('–') ? mtg.time.split('–')[1].trim() : '11:30 GST',
      allDay: false,
      status: mtg.status,
      priority: mtg.priority,
      owner: mtg.owner,
      customerOrEntity: mtg.entity,
      relatedBusinessDomain: mtg.domain,
      location: 'Abu Dhabi HQ / Teams',
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'Meeting',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 8. MINUTES OF MEETING (MOM) — FIRST-CLASS CITIZEN (Source: demoData.js -> momRecords)
  if (Array.isArray(momRecords)) {
    momRecords.forEach(m => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.MOM];
      // Clean normalized title:
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.MOM, m.meetingTitle);

      events.push({
        id: m.id,
        type: EVENT_TYPES.MOM,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: m.summary,
        startDate: m.meetingDate,
        endDate: m.meetingDate,
        startTime: m.meetingTime ? m.meetingTime.split('–')[0].trim() : '10:00 GST',
        endTime: m.meetingTime && m.meetingTime.includes('–') ? m.meetingTime.split('–')[1].trim() : '11:30 GST',
        allDay: false,
        status: m.momStatus,
        priority: m.overdueActionCount > 0 ? 'Critical' : 'Medium',
        owner: m.owner,
        customerOrEntity: m.customerOrEntity,
        relatedBusinessDomain: m.businessDomain,
        relatedApplication: m.application,
        processGroup: m.processGroup,
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'MOM',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
        momData: m,
      });

      // 9. MOM ACTION ITEMS — FIRST-CLASS ACTIONABLE ENTITIES
      if (Array.isArray(m.actionItems)) {
        m.actionItems.forEach(act => {
          const actCfg = EVENT_TYPE_CONFIG[EVENT_TYPES.MOM_ACTION];
          const isOverdue = act.isOverdue || (act.status === 'Open' && new Date(act.targetDate) < new Date());
          const { title: actTitle, shortTitle: actShortTitle } = normalizeTitleAndShort(EVENT_TYPES.MOM_ACTION, act.actionDescription);

          events.push({
            id: act.actionId,
            type: EVENT_TYPES.MOM_ACTION,
            typeLabel: actCfg.label,
            typeLabelAr: actCfg.labelAr,
            title: actTitle,
            shortTitle: actShortTitle,
            description: `Action item from "${m.meetingTitle}". Agreed target date: ${act.targetDate}. Status: ${act.status}. Linked CTA: ${act.ctaId || 'None'}.`,
            startDate: act.targetDate,
            endDate: act.targetDate,
            startTime: '15:00 GST',
            endTime: '16:00 GST',
            allDay: true,
            status: act.status,
            priority: act.priority || (isOverdue ? 'Critical' : 'High'),
            isOverdue: isOverdue,
            owner: act.owner,
            customerOrEntity: m.customerOrEntity,
            relatedMOM: m.id,
            relatedMeetingTitle: m.meetingTitle,
            relatedBusinessDomain: m.businessDomain,
            relatedCTA: act.ctaId,
            sourceModule: actCfg.sourceModule,
            sourceRoute: actCfg.sourceRoute,
            entityType: 'MOMAction',
            cssClass: isOverdue ? `${actCfg.cssClass} overdue` : actCfg.cssClass,
            dotColor: isOverdue ? actCfg.overdueDotColor : actCfg.dotColor,
            badgeClass: isOverdue ? 'badge-error' : actCfg.badgeClass,
            momData: m,
            momActionData: act,
          });
        });
      }
    });
  }

  // 10. TRANSITION MILESTONES (Source: TRANSITION_GATES)
  TRANSITION_GATES.forEach(tr => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.TRANSITION_MILESTONE];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.TRANSITION_MILESTONE, tr.name);

    events.push({
      id: tr.id,
      type: EVENT_TYPES.TRANSITION_MILESTONE,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: `${tr.desc} Overall Gate Progress: ${tr.progress}%. Domain: ${tr.domain}.`,
      startDate: tr.date,
      endDate: tr.date,
      startTime: '10:00 GST',
      endTime: '11:00 GST',
      allDay: true,
      status: tr.status,
      priority: 'High',
      owner: tr.owner,
      relatedBusinessDomain: tr.domain,
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'TransitionGate',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 11. USER ENABLEMENT & TRAINING (Source: TRAINING_CLINICS)
  TRAINING_CLINICS.forEach(trn => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.TRAINING];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.TRAINING, trn.title);

    events.push({
      id: trn.id,
      type: EVENT_TYPES.TRAINING,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: `${trn.desc} Target Audience: ${trn.audience}.`,
      startDate: trn.date,
      endDate: trn.date,
      startTime: trn.time ? trn.time.split('–')[0].trim() : '14:00 GST',
      endTime: trn.time && trn.time.includes('–') ? trn.time.split('–')[1].trim() : '16:00 GST',
      allDay: false,
      status: trn.status,
      priority: 'Medium',
      owner: trn.owner,
      relatedBusinessDomain: trn.domain,
      location: 'EDGE Academy / Virtual',
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'TrainingClinic',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 12. KNOWLEDGE & RUNBOOK REVIEWS (Source: demoData.js -> knowledgeArticles)
  if (Array.isArray(knowledgeArticles)) {
    knowledgeArticles.forEach(k => {
      const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.KNOWLEDGE_REVIEW];
      const rawTitle = `Runbook Review: ${k.title}`;
      const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.KNOWLEDGE_REVIEW, rawTitle);

      events.push({
        id: `KBA-REV-${k.id}`,
        type: EVENT_TYPES.KNOWLEDGE_REVIEW,
        typeLabel: cfg.label,
        typeLabelAr: cfg.labelAr,
        title,
        shortTitle,
        description: `Scheduled operational review for article ${k.id}. Category: ${k.category || 'Runbook'}. Author: ${k.author}. Views: ${k.views || 120}.`,
        startDate: k.lastUpdated || '2026-09-11',
        endDate: k.lastUpdated || '2026-09-11',
        startTime: '11:00 GST',
        endTime: '12:00 GST',
        allDay: true,
        status: 'Scheduled',
        priority: 'Medium',
        owner: k.author || 'Knowledge Lead',
        relatedApplication: k.application || 'SAP S/4HANA',
        sourceModule: cfg.sourceModule,
        sourceRoute: cfg.sourceRoute,
        entityType: 'KnowledgeReview',
        cssClass: cfg.cssClass,
        dotColor: cfg.dotColor,
        badgeClass: cfg.badgeClass,
      });
    });
  }

  // 13. SLA GOVERNANCE REVIEWS (Source: SLA_REVIEWS)
  SLA_REVIEWS.forEach(sla => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.SLA_REVIEW];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.SLA_REVIEW, sla.title);

    events.push({
      id: sla.id,
      type: EVENT_TYPES.SLA_REVIEW,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: sla.desc,
      startDate: sla.date,
      endDate: sla.date,
      startTime: sla.time ? sla.time.split('–')[0].trim() : '16:00 GST',
      endTime: sla.time && sla.time.includes('–') ? sla.time.split('–')[1].trim() : '17:30 GST',
      allDay: false,
      status: sla.status,
      priority: sla.priority,
      owner: sla.owner,
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'SLAReview',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 14. CUSTOMER CONNECT SESSIONS (Source: CUSTOMER_CONNECT_SESSIONS)
  CUSTOMER_CONNECT_SESSIONS.forEach(cust => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.CUSTOMER_MEETING];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.CUSTOMER_MEETING, cust.title);

    events.push({
      id: cust.id,
      type: EVENT_TYPES.CUSTOMER_MEETING,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: `${cust.desc} Participating Customer: ${cust.customer}.`,
      startDate: cust.date,
      endDate: cust.date,
      startTime: cust.time ? cust.time.split('–')[0].trim() : '11:00 GST',
      endTime: cust.time && cust.time.includes('–') ? cust.time.split('–')[1].trim() : '12:30 GST',
      allDay: false,
      status: cust.status,
      priority: 'High',
      owner: cust.owner,
      customerOrEntity: cust.customer,
      relatedCustomer: cust.customer,
      location: 'Virtual / Client Onsite',
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'CustomerMeeting',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // 15. CRITICAL BUSINESS WINDOWS & FREEZES (Source: CRITICAL_BUSINESS_WINDOWS)
  CRITICAL_BUSINESS_WINDOWS.forEach(cbw => {
    const cfg = EVENT_TYPE_CONFIG[EVENT_TYPES.CRITICAL_BUSINESS_PERIOD];
    const { title, shortTitle } = normalizeTitleAndShort(EVENT_TYPES.CRITICAL_BUSINESS_PERIOD, cbw.name);

    events.push({
      id: cbw.id,
      type: EVENT_TYPES.CRITICAL_BUSINESS_PERIOD,
      typeLabel: cfg.label,
      typeLabelAr: cfg.labelAr,
      title,
      shortTitle,
      description: `${cbw.desc} Scope: ${cbw.scope}. Governance Authority: ${cbw.owner}.`,
      startDate: cbw.startDate,
      endDate: cbw.endDate,
      startTime: 'All Day',
      endTime: 'All Day',
      allDay: true,
      status: cbw.status,
      priority: 'Critical',
      owner: cbw.owner,
      isFreeze: true,
      sourceModule: cfg.sourceModule,
      sourceRoute: cfg.sourceRoute,
      entityType: 'CriticalFreezeWindow',
      cssClass: cfg.cssClass,
      dotColor: cfg.dotColor,
      badgeClass: cfg.badgeClass,
    });
  });

  // Sort chronologically with null safety
  events.sort((a, b) => {
    const aDate = String(a.startDate || '2026-01-01');
    const bDate = String(b.startDate || '2026-01-01');
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    const aTime = String(a.startTime || '');
    const bTime = String(b.startTime || '');
    return aTime.localeCompare(bTime);
  });

  return events;
}

/**
 * Filtered & memoized calendar event selector
 */
export function getFilteredCalendarEvents(allEvents, activeCategories, searchQuery = '') {
  if (!Array.isArray(allEvents)) return [];

  const query = searchQuery.trim().toLowerCase();

  return allEvents.filter(ev => {
    // Category filter
    if (activeCategories.length > 0 && !activeCategories.includes(ev.type)) {
      return false;
    }

    // Search query
    if (query) {
      const matchText = [
        ev.id,
        ev.title,
        ev.shortTitle,
        ev.description,
        ev.owner,
        ev.customerOrEntity,
        ev.relatedApplication,
        ev.relatedBusinessDomain,
        ev.relatedCustomer,
        ev.sourceModule,
      ].filter(Boolean).join(' ').toLowerCase();

      if (!matchText.includes(query)) return false;
    }

    return true;
  });
}
