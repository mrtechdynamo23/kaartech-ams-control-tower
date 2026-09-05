/**
 * EDGE AMS Control Tower — Dynamic Analytics & Data Selectors
 * Derives operational analytics, distributions, time-series trends, ageing buckets,
 * and unified calendar events directly from master & demo datasets.
 */
import { incidents, serviceRequests, enhancements, problems, RESOURCES, audits, findings, risks, ctas, licenses, knowledgeArticles, customerFeedback } from './demoData';
import { ENTITIES, BUSINESS_DOMAINS, APPLICATIONS, TRACKS } from './masterData';
import { SLA_POLICIES, OVERALL_MONTHLY_RESOLUTION_TARGET } from './config';

// ═══════════════════════════════════════════════════
// 1. INCIDENT ANALYTICS SELECTORS (Section 18)
// ═══════════════════════════════════════════════════
export function getIncidentAnalytics(filter = {}) {
  const filtered = incidents.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.domain && filter.domain !== 'all' && item.businessDomain !== filter.domain) return false;
    if (filter.priority && filter.priority !== 'all' && item.priority !== filter.priority) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    return true;
  });

  const total = filtered.length;
  const p1 = filtered.filter(i => i.priority === 'P1');
  const p2 = filtered.filter(i => i.priority === 'P2');
  const p3 = filtered.filter(i => i.priority === 'P3');
  const p4 = filtered.filter(i => i.priority === 'P4');
  const open = filtered.filter(i => !['Closed', 'Resolved'].includes(i.status));
  const breached = filtered.filter(i => i.slaStatus === 'Breached');
  const atRisk = filtered.filter(i => i.slaStatus === 'At Risk');

  // Priority Distribution for Donut
  const priorityDistribution = [
    { name: 'P1 - Critical', value: p1.length, color: '#DC2626', key: 'P1' },
    { name: 'P2 - High', value: p2.length, color: '#D97706', key: 'P2' },
    { name: 'P3 - Medium', value: p3.length, color: '#2563EB', key: 'P3' },
    { name: 'P4 - Low', value: p4.length, color: '#71777C', key: 'P4' },
  ];

  // 4-Month Created vs Closed Trend
  const monthlyTrend = [
    { month: 'Mar 2026', Created: 44, Closed: 41, Open: 28, Breached: 2 },
    { month: 'Apr 2026', Created: 52, Closed: 49, Open: 31, Breached: 1 },
    { month: 'May 2026', Created: 48, Closed: 50, Open: 29, Breached: 1 },
    { month: 'Jun 2026', Created: Math.max(12, total), Closed: Math.max(10, total - open.length), Open: open.length, Breached: breached.length },
  ];

  // 5 Ageing Buckets per Section 18: 0–3 days, 4–7 days, 8–15 days, 16–30 days, 30+ days
  const ageingBuckets = [
    { bucket: '0–3 days', count: Math.round(open.length * 0.45), color: '#0D9F6E' },
    { bucket: '4–7 days', count: Math.round(open.length * 0.30), color: '#2563EB' },
    { bucket: '8–15 days', count: Math.round(open.length * 0.15), color: '#D97706' },
    { bucket: '16–30 days', count: Math.round(open.length * 0.08), color: '#EA580C' },
    { bucket: '30+ days', count: Math.max(0, open.length - Math.round(open.length * 0.98)), color: '#DC2626' },
  ];

  // Response vs Resolution SLA Performance
  const slaComparison = [
    { metric: 'P1 (30m / 4h)', Response: 100, Resolution: p1.length ? Math.round((p1.filter(i => i.slaStatus !== 'Breached').length / p1.length) * 100) : 96, Target: 95 },
    { metric: 'P2 (2h / 8h)', Response: 98, Resolution: p2.length ? Math.round((p2.filter(i => i.slaStatus !== 'Breached').length / p2.length) * 100) : 94, Target: 90 },
    { metric: 'P3 (1d / 2d)', Response: 96, Resolution: 95, Target: 90 },
    { metric: 'P4 (2d / 4d)', Response: 98, Resolution: 96, Target: 85 },
  ];

  // Critical Exception Queue
  const exceptionQueue = filtered.filter(i => i.priority === 'P1' || i.priority === 'P2' || i.slaStatus === 'Breached' || i.slaStatus === 'At Risk');

  return {
    total,
    open: open.length,
    p1: p1.length,
    p2: p2.length,
    p3: p3.length,
    p4: p4.length,
    breached: breached.length,
    atRisk: atRisk.length,
    responseSla: 97.4,
    resolutionSla: total ? Math.round((filtered.filter(i => i.slaStatus !== 'Breached').length / total) * 100) : 95.4,
    priorityDistribution,
    monthlyTrend,
    ageingBuckets,
    slaComparison,
    exceptionQueue,
    filteredList: filtered,
  };
}

// ═══════════════════════════════════════════════════
// 2. SERVICE REQUEST ANALYTICS SELECTORS (Section 19)
// ═══════════════════════════════════════════════════
export function getServiceRequestAnalytics(filter = {}) {
  const filtered = serviceRequests.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.domain && filter.domain !== 'all' && item.businessDomain !== filter.domain) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    return true;
  });

  const total = filtered.length;
  const standard = filtered.filter(s => s.srType === 'Standard');
  const major = filtered.filter(s => s.srType === 'Major');
  const open = filtered.filter(s => !['Closed', 'Resolved', 'Rejected'].includes(s.status));
  const fulfilled = filtered.filter(s => ['Closed', 'Resolved'].includes(s.status));

  // Classification Distribution (Standard vs Major)
  const classificationDistribution = [
    { name: 'Standard SR (<16h)', value: standard.length, color: '#2563EB' },
    { name: 'Major SR (≥16h)', value: major.length, color: '#FF5622' },
  ];

  // Category-wise Created vs Closed (4 Months)
  const categoryMonthly = [
    { category: 'Access Mgmt', Created: 24, Closed: 23, Target: 25 },
    { category: 'Data Master Fix', Created: 18, Closed: 17, Target: 20 },
    { category: 'Config Change', Created: 14, Closed: 13, Target: 15 },
    { category: 'Custom Report', Created: 10, Closed: 9, Target: 12 },
  ];

  // Monthly Trend
  const monthlyTrend = [
    { month: 'Mar 2026', Created: 32, Closed: 30, Open: 14 },
    { month: 'Apr 2026', Created: 38, Closed: 36, Open: 16 },
    { month: 'May 2026', Created: 42, Closed: 40, Open: 18 },
    { month: 'Jun 2026', Created: total, Closed: fulfilled.length, Open: open.length },
  ];

  // Open SR Ageing Buckets
  const ageingBuckets = [
    { bucket: '0–3 days', count: Math.round(open.length * 0.50), color: '#0D9F6E' },
    { bucket: '4–7 days', count: Math.round(open.length * 0.30), color: '#2563EB' },
    { bucket: '8–15 days', count: Math.round(open.length * 0.12), color: '#D97706' },
    { bucket: '16–30 days', count: Math.round(open.length * 0.06), color: '#EA580C' },
    { bucket: '30+ days', count: Math.max(0, open.length - Math.round(open.length * 0.98)), color: '#DC2626' },
  ];

  return {
    total,
    standard: standard.length,
    major: major.length,
    open: open.length,
    fulfilled: fulfilled.length,
    slaPercent: 94.6,
    classificationDistribution,
    categoryMonthly,
    monthlyTrend,
    ageingBuckets,
    filteredList: filtered,
  };
}

// ═══════════════════════════════════════════════════
// 3. ENHANCEMENT ANALYTICS SELECTORS (Section 20)
// ═══════════════════════════════════════════════════
export function getEnhancementAnalytics(filter = {}) {
  const filtered = enhancements.filter(item => {
    if (filter.entity && filter.entity !== 'all' && item.entity !== filter.entity) return false;
    if (filter.domain && filter.domain !== 'all' && item.businessDomain !== filter.domain) return false;
    if (filter.status && filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.app && filter.app !== 'all' && item.application !== filter.app) return false;
    return true;
  });

  const total = filtered.length;
  const minor = filtered.filter(e => e.category === 'Minor' || (e.effortHours && e.effortHours <= 80));
  const major = filtered.filter(e => e.category === 'Major' || (e.effortHours && e.effortHours > 80));
  const inBuild = filtered.filter(e => ['Build', 'Testing', 'In Progress'].includes(e.status));
  const deployed = filtered.filter(e => ['Deployed', 'Closed'].includes(e.status));
  const totalHours = filtered.reduce((acc, curr) => acc + (curr.effortHours || 40), 0);

  // Minor vs Major Scale Donut
  const scaleDistribution = [
    { name: 'Minor (≤80h)', value: minor.length, color: '#2563EB' },
    { name: 'Major (>80h)', value: major.length, color: '#7C3AED' },
  ];

  // Delivery Pipeline Stages
  const pipelineStages = [
    { stage: 'Requirements', count: filtered.filter(e => e.status === 'Requirements').length || 2, color: '#9CA3AB' },
    { stage: 'Design', count: filtered.filter(e => e.status === 'Design').length || 3, color: '#2563EB' },
    { stage: 'Build', count: filtered.filter(e => e.status === 'Build' || e.status === 'In Progress').length || 5, color: '#FF5622' },
    { stage: 'Testing / QA', count: filtered.filter(e => e.status === 'Testing').length || 3, color: '#D97706' },
    { stage: 'UAT', count: filtered.filter(e => e.status === 'UAT').length || 2, color: '#7C3AED' },
    { stage: 'Deployed', count: deployed.length || 6, color: '#0D9F6E' },
  ];

  // Monthly Created vs Closed Trend
  const monthlyTrend = [
    { month: 'Mar 2026', Created: 12, Closed: 10, Hours: 480 },
    { month: 'Apr 2026', Created: 16, Closed: 14, Hours: 620 },
    { month: 'May 2026', Created: 14, Closed: 15, Hours: 580 },
    { month: 'Jun 2026', Created: total, Closed: deployed.length, Hours: totalHours },
  ];

  // Ageing of active Enhancements
  const ageingBuckets = [
    { bucket: '0–15 days', count: 6, color: '#0D9F6E' },
    { bucket: '16–30 days', count: 5, color: '#2563EB' },
    { bucket: '31–60 days', count: 4, color: '#D97706' },
    { bucket: '> 60 days', count: 2, color: '#DC2626' },
  ];

  return {
    total,
    minor: minor.length,
    major: major.length,
    inBuild: inBuild.length,
    deployed: deployed.length,
    totalHours,
    scaleDistribution,
    pipelineStages,
    monthlyTrend,
    ageingBuckets,
    filteredList: filtered,
  };
}

// ═══════════════════════════════════════════════════
// 4. GLOBAL CALENDAR AGGREGATOR (Section 22 & 46)
export function getGlobalCalendarEvents() {
  const events = [];

  // 1. Audits & Compliance Assessments
  const auditEvents = [
    // June 2026
    { id: 'CAL-AUD-001', title: 'ISO 27001 InfoSec Surveillance Audit', date: '2026-06-11', time: '09:00 – 17:00 GST', owner: 'Ahmad Al Zaabi', status: 'Completed', priority: 'High', typeLabel: 'InfoSec Audit', desc: 'Annual surveillance audit of cloud infrastructure and Abu Dhabi data center controls.' },
    { id: 'CAL-AUD-002', title: 'Mid-Year SAP S/4HANA Compliance & SOD Audit', date: '2026-06-15', time: '10:00 – 16:30 GST', owner: 'Fatima Al Mansoori', status: 'Completed', priority: 'High', typeLabel: 'Financial Compliance', desc: 'Segregation of Duties (SOD) and GRC access control review across 34 entities.' },
    { id: 'CAL-AUD-003', title: 'UAE FTA E-Invoicing Systems Readiness Review', date: '2026-06-26', time: '11:00 – 15:00 GST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', typeLabel: 'Tax Compliance', desc: 'Federal Tax Authority electronic invoicing interface and schema validation audit.' },
    // July 2026
    { id: 'CAL-AUD-004', title: 'SOC 2 Type II Controls Walkthrough with KPMG', date: '2026-07-08', time: '09:30 – 18:00 GST', owner: 'KPMG Lead Auditor', status: 'Completed', priority: 'High', typeLabel: 'External Attestation', desc: 'Trust Services Criteria evaluation for security, availability, and processing integrity.' },
    { id: 'CAL-AUD-005', title: 'SIA / NESA Defense Cyber Assurance Assessment', date: '2026-07-16', time: '09:00 – 16:00 GST', owner: 'SIA Inspector General', status: 'Completed', priority: 'Critical', typeLabel: 'Defense Assurance', desc: 'SIA critical defense systems classification and cryptographic enclave review.' },
    { id: 'CAL-AUD-006', title: 'Disaster Recovery Readiness Simulation (DC1 to DC2)', date: '2026-07-22', time: '08:00 – 14:00 GST', owner: 'Rashid Al Dhaheri', status: 'Completed', priority: 'Critical', typeLabel: 'Business Continuity', desc: 'Total failover simulation from Abu Dhabi DC1 to Al Ain DR facility for S/4HANA & MES.' },
    // August 2026
    { id: 'CAL-AUD-007', title: 'ISO 20000 IT Service Management Audit', date: '2026-08-05', time: '09:00 – 17:00 GST', owner: 'SGS External Assessor', status: 'Completed', priority: 'High', typeLabel: 'ITSM Standards', desc: 'Verification of incident, problem, change, and SLA governance practices.' },
    { id: 'CAL-AUD-008', title: 'SAP License Entitlement True-Up & Compliance Review', date: '2026-08-14', time: '11:00 – 15:00 GST', owner: 'SAP License Advisory', status: 'Completed', priority: 'Medium', typeLabel: 'Vendor Governance', desc: 'Annual user licensing verification across FUEs, Digital Access, and BTP consumption.' },
    { id: 'CAL-AUD-009', title: 'ITIL Continuous Service Improvement Quality Gate', date: '2026-08-26', time: '14:00 – 17:00 GST', owner: 'Quality Assurance Board', status: 'Completed', priority: 'Medium', typeLabel: 'Process Audit', desc: 'Quarterly review of problem management root cause analysis and KEDB runbook quality.' },
    // September 2026
    { id: 'CAL-AUD-010', title: 'S/4HANA 2025 SP03 Core Upgrade Pre-Validation Audit', date: '2026-09-07', time: '10:00 – 16:00 GST', owner: 'Architecture Review Board', status: 'Scheduled', priority: 'High', typeLabel: 'Architecture Quality', desc: 'Pre-upgrade code quality scan, ABAP test cockpit, and HANA compatibility check.' },
    { id: 'CAL-AUD-011', title: 'Third-Party Defense Supplier Risk Assessment', date: '2026-09-17', time: '09:00 – 15:00 GST', owner: 'Vendor Risk Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Supply Chain Audit', desc: 'Security assessment of external defense contractors connecting to AdvantEDGE via VPN.' },
    { id: 'CAL-AUD-012', title: 'Q3 Privileged Access (PAM) & Firefighter Audit', date: '2026-09-25', time: '13:00 – 17:00 GST', owner: 'InfoSec Governance', status: 'Scheduled', priority: 'High', typeLabel: 'Security Audit', desc: 'Quarterly audit of all elevated SAP basis permissions and production firefighter session logs.' },
    // October 2026
    { id: 'CAL-AUD-013', title: 'Annual Red Team Penetration Testing Debrief', date: '2026-10-06', time: '10:00 – 16:00 GST', owner: 'Cyber Defense Command', status: 'Scheduled', priority: 'Critical', typeLabel: 'Cyber Assessment', desc: 'Debrief on external penetration drill results against BTP endpoints and mobile gateways.' },
    { id: 'CAL-AUD-014', title: 'Defense Export Control (ITAR) S/4HANA Audit', date: '2026-10-15', time: '09:30 – 15:00 GST', owner: 'Legal & Export Compliance', status: 'Scheduled', priority: 'High', typeLabel: 'Export Compliance', desc: 'Verification of dual-use item classification and munitions inventory segregation in SAP.' },
    { id: 'CAL-AUD-015', title: 'ISO 22301 Business Continuity Management Audit', date: '2026-10-27', time: '09:00 – 17:00 GST', owner: 'External Assessor (BSI)', status: 'Scheduled', priority: 'High', typeLabel: 'BCP Certification', desc: 'Formal external audit for ISO 22301 business continuity management certification.' },
    // November 2026
    { id: 'CAL-AUD-016', title: 'Defense Cloud Security & FedRAMP Alignment Review', date: '2026-11-09', time: '10:00 – 16:30 GST', owner: 'Cloud Architecture Board', status: 'Scheduled', priority: 'High', typeLabel: 'Cloud Compliance', desc: 'Assessment of Azure Government UAE and SAP RISE private cloud security configurations.' },
    { id: 'CAL-AUD-017', title: 'Pre-Year-End GRC Firefighter Log & SOD Review', date: '2026-11-19', time: '11:00 – 16:00 GST', owner: 'Fatima Al Mansoori', status: 'Scheduled', priority: 'High', typeLabel: 'Financial Compliance', desc: 'Pre-audit clean-up of conflicting permissions and SOD violations across finance modules.' },
    { id: 'CAL-AUD-018', title: 'Database Encryption & Key Vault Verification', date: '2026-11-25', time: '14:00 – 17:00 GST', owner: 'Security Architecture Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Crypto Audit', desc: 'Verification of HSM encryption keys, TLS 1.3 enforcement, and database column-level salts.' },
    // December 2026
    { id: 'CAL-AUD-019', title: 'Annual IT General Controls (ITGC) PwC Audit', date: '2026-12-07', time: '09:00 – 18:00 GST', owner: 'PwC External Audit Team', status: 'Scheduled', priority: 'Critical', typeLabel: 'External Financial Audit', desc: 'Mandatory statutory financial audit covering change management, access, and operations.' },
    { id: 'CAL-AUD-020', title: 'Comprehensive Year-End AMS Service Quality Gate', date: '2026-12-14', time: '10:00 – 15:00 GST', owner: 'EDGE Group Internal Audit', status: 'Scheduled', priority: 'High', typeLabel: 'Contractual Audit', desc: 'Contractual verification of AMS delivery commitments, SLA scores, and penalty ledger.' },
  ];

  auditEvents.forEach(a => {
    events.push({
      id: a.id,
      title: a.title,
      type: 'audit',
      typeLabel: a.typeLabel,
      date: a.date,
      time: a.time,
      owner: a.owner,
      status: a.status,
      priority: a.priority,
      badgeColor: 'badge-warning',
      description: a.desc,
    });
  });

  // 2. Production Releases & Deployments (CAB Approved)
  const releaseEvents = [
    // June 2026
    { id: 'CAL-REL-001', title: 'S/4HANA Emergency Hotfix & Fiscal Tax Patch', date: '2026-06-08', time: '23:00 – 02:00 GST', owner: 'CAB Lead', status: 'Deployed', priority: 'High', typeLabel: 'Hotfix Deployment', desc: 'Corrective pricing condition update and UAE VAT reporting patch.' },
    { id: 'CAL-REL-002', title: 'SuccessFactors Delta Integration Pack v4.2', date: '2026-06-17', time: '22:00 – 01:30 GST', owner: 'Integration Lead', status: 'Deployed', priority: 'Medium', typeLabel: 'Cloud Release', desc: 'Employee Central cost center mapping sync improvements.' },
    { id: 'CAL-REL-003', title: 'Edge B2B Supplier Portal Security Patch', date: '2026-06-24', time: '23:00 – 01:00 GST', owner: 'Security Engineering', status: 'Deployed', priority: 'Medium', typeLabel: 'Portal Patch', desc: 'Multi-factor authentication session hardening for external defense suppliers.' },
    { id: 'CAL-REL-004', title: 'AdvantEDGE June Sprint Major Release Cutover', date: '2026-06-30', time: '21:00 – 05:00 GST', owner: 'Release Management', status: 'Deployed', priority: 'P1', typeLabel: 'Major Release', desc: '22 approved change requests packaged for production rollout.' },
    // July 2026
    { id: 'CAL-REL-005', title: 'SAP CPI Integration Suite Flow Re-certification Release', date: '2026-07-10', time: '23:00 – 02:00 GST', owner: 'Integration Broker Lead', status: 'Deployed', priority: 'High', typeLabel: 'Middleware Patch', desc: 'Secure certificate rotation and OData pipe throughput optimization.' },
    { id: 'CAL-REL-006', title: 'Mid-Year Tax Engine & E-Invoicing Regulatory Release', date: '2026-07-15', time: '22:00 – 03:00 GST', owner: 'Financial Systems Lead', status: 'Deployed', priority: 'High', typeLabel: 'Regulatory Release', desc: 'Mandatory FTA compliance update for automated VAT clearance.' },
    { id: 'CAL-REL-007', title: 'Mobile Fiori Launchpad User Experience Patch', date: '2026-07-21', time: '22:30 – 01:00 GST', owner: 'UX Engineering', status: 'Deployed', priority: 'Low', typeLabel: 'UX Update', desc: 'Biometric login and push notification optimizations for executive approval workflows.' },
    { id: 'CAL-REL-008', title: 'July AdvantEDGE Production Maintenance Release', date: '2026-07-31', time: '22:00 – 04:00 GST', owner: 'CAB Lead', status: 'Deployed', priority: 'High', typeLabel: 'Monthly Release', desc: 'Standard monthly maintenance sprint with 18 packaged enhancement fixes.' },
    // August 2026
    { id: 'CAL-REL-009', title: 'Microsoft Dynamics 365 CRM Sprint Release', date: '2026-08-07', time: '23:00 – 02:00 GST', owner: 'CRM Tech Lead', status: 'Deployed', priority: 'Medium', typeLabel: 'Cloud Release', desc: 'Customer Connect field service dispatch and portal telemetry enhancements.' },
    { id: 'CAL-REL-010', title: 'Edge MES Shopfloor Dispatch Connector v3.1', date: '2026-08-18', time: '22:00 – 01:30 GST', owner: 'Manufacturing IT Lead', status: 'Deployed', priority: 'High', typeLabel: 'MES Connector', desc: 'Real-time production order execution sync between HALCON shopfloor and S/4HANA.' },
    { id: 'CAL-REL-011', title: 'AdvantEDGE August Maintenance Bundle Deployment', date: '2026-08-28', time: '22:00 – 04:00 GST', owner: 'CAB Release Manager', status: 'Deployed', priority: 'High', typeLabel: 'Major Release', desc: '14 approved CAB change requests packaged for production rollout.' },
    // September 2026
    { id: 'CAL-REL-012', title: 'SAC Executive Boardroom Telemetry Optimization Patch', date: '2026-09-10', time: '22:00 – 01:00 GST', owner: 'Analytics Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'BI Analytics Patch', desc: 'Query performance tuning for SteerCom live widgets and mobile board access.' },
    { id: 'CAL-REL-013', title: 'OpenText xECM Defense Document Metadata Sync', date: '2026-09-18', time: '23:00 – 02:00 GST', owner: 'Content Services Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'ECM Patch', desc: 'Automated engineering drawing classification and secure optical OCR index.' },
    { id: 'CAL-REL-014', title: 'AdvantEDGE September Production Sprint Release', date: '2026-09-28', time: '21:00 – 04:00 GST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Q3 closeout release incorporating 26 approved enhancement packages.' },
    // October 2026
    { id: 'CAL-REL-015', title: 'S/4HANA Feature Pack 02 Application Rollout', date: '2026-10-09', time: '21:00 – 05:00 GST', owner: 'SAP Core Architecture', status: 'Approved', priority: 'P1', typeLabel: 'Feature Pack', desc: 'S/4HANA FP02 upgrade activating advanced variant configuration and serial tracking.' },
    { id: 'CAL-REL-016', title: 'SAP BTP Event Mesh Enterprise Broker Upgrade', date: '2026-10-16', time: '23:00 – 02:30 GST', owner: 'Integration Architect', status: 'Scheduled', priority: 'High', typeLabel: 'Middleware Release', desc: 'Upgrading enterprise event mesh routing for low-latency telemetry between defense plants.' },
    { id: 'CAL-REL-017', title: 'Edge Defense Logistics Track & Trace Release', date: '2026-10-23', time: '22:00 – 01:30 GST', owner: 'Supply Chain Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Logistics Release', desc: 'RFID-enabled defense asset tracking integration with S/4HANA Extended Warehouse.' },
    { id: 'CAL-REL-018', title: 'October AdvantEDGE Maintenance Bundle Release', date: '2026-10-30', time: '22:00 – 04:00 GST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'High', typeLabel: 'Monthly Release', desc: 'Standard monthly maintenance bundle with 16 functional enhancements.' },
    // November 2026
    { id: 'CAL-REL-019', title: 'SuccessFactors Year-End Performance Module Patch', date: '2026-11-06', time: '22:00 – 01:00 GST', owner: 'HR Tech Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'HR Cloud Patch', desc: 'Year-end appraisal workflow configuration and bonus compensation calculation rules.' },
    { id: 'CAL-REL-020', title: 'Ariba Network Supplier Guided Sourcing Release', date: '2026-11-13', time: '23:00 – 02:00 GST', owner: 'Procurement Systems Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Procurement Release', desc: 'Ariba Guided Sourcing activation for strategic defense tier-1 subcontracting.' },
    { id: 'CAL-REL-021', title: 'SAP Analytics Cloud Q4 Predictive Engine Release', date: '2026-11-20', time: '22:00 – 01:30 GST', owner: 'Data Analytics Lead', status: 'Scheduled', priority: 'Medium', typeLabel: 'Analytics Release', desc: 'Smart Discovery predictive algorithms for spare parts consumption forecasting.' },
    { id: 'CAL-REL-022', title: 'November AdvantEDGE Production Sprint Release', date: '2026-11-27', time: '21:00 – 04:30 GST', owner: 'CAB Release Manager', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Pre-freeze production release deploying 24 approved enterprise change packages.' },
    // December 2026
    { id: 'CAL-REL-023', title: 'Year-End Statutory Payroll & UAE GPSSA Tax Update', date: '2026-12-04', time: '22:00 – 02:00 GST', owner: 'HR Operations Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Payroll Patch', desc: 'Statutory pension contribution updates and UAE national social security tables.' },
    { id: 'CAL-REL-024', title: 'Core S/4HANA Security Patch & Kernel Update', date: '2026-12-11', time: '22:00 – 03:00 GST', owner: 'BASIS Lead', status: 'Scheduled', priority: 'High', typeLabel: 'Kernel Update', desc: 'SAP NetWeaver 7.55 security kernel patch and OpenSSL cryptographic library refresh.' },
    { id: 'CAL-REL-025', title: 'AdvantEDGE Q4 Pre-Freeze Stabilization Release', date: '2026-12-18', time: '21:00 – 04:00 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'P1', typeLabel: 'Major Release', desc: 'Final production deployment prior to annual financial close change moratorium.' },
  ];

  releaseEvents.forEach(r => {
    events.push({
      id: r.id,
      title: r.title,
      type: 'release',
      typeLabel: r.typeLabel,
      date: r.date,
      time: r.time,
      owner: r.owner,
      status: r.status,
      priority: r.priority,
      badgeColor: 'badge-info',
      description: r.desc,
    });
  });

  // 3. Transformation Milestones & Program Gates
  const milestoneEvents = [
    // June 2026
    { id: 'CAL-PRG-001', title: 'Wave 1 Final Stabilization & Warranty Handover', date: '2026-06-22', time: '10:00 GST', owner: 'Program Director', entity: 'All 34 EDGE Entities', status: 'Completed', priority: 'High', desc: 'Formal conclusion of post-go-live hypercare warranty phase for Wave 1 entities.' },
    // July 2026
    { id: 'CAL-PRG-002', title: 'S/4HANA Manufacturing Phase 2 Blueprint Sign-Off', date: '2026-07-06', time: '11:00 GST', owner: 'Enterprise Architect', entity: 'HALCON, NIMR, LAHAB', status: 'Completed', priority: 'High', desc: 'Formal steering committee sign-off on detailed defense manufacturing functional design.' },
    { id: 'CAL-PRG-003', title: 'Wave 2 SuccessFactors HXM Harmonization Go-Live', date: '2026-07-20', time: '10:00 GST', owner: 'Sara Al Marzouqi', entity: 'All 34 EDGE Entities', status: 'Completed', priority: 'High', desc: 'Global rollout of unified talent management and performance compensation.' },
    // August 2026
    { id: 'CAL-PRG-004', title: 'Ariba Supplier Network Wave 2 Activation (250 Suppliers)', date: '2026-08-10', time: '09:30 GST', owner: 'Procurement Transformation', entity: 'EDGE Group Procurement', status: 'Completed', priority: 'Medium', desc: 'Onboarding 250 local defense sub-tier suppliers onto automated digital purchase orders.' },
    { id: 'CAL-PRG-005', title: 'Robotic Process Automation Bot 5 (P2P Reconciler) Pilot', date: '2026-08-20', time: '09:00 GST', owner: 'Innovation Lead', entity: 'EDGE HQ, HALCON', status: 'Completed', priority: 'Medium', desc: 'Autonomous OCR three-way match bot deployment into pilot entities.' },
    // September 2026
    { id: 'CAL-PRG-006', title: 'Edge Control Tower AI Incident Co-Pilot Pilot Launch', date: '2026-09-08', time: '08:30 GST', owner: 'AI Strategy Lead', entity: 'AMS Shift 1 CoE', status: 'Scheduled', priority: 'High', desc: 'Pilot rollout of generative resolution recommendation co-pilot for L2 engineers.' },
    { id: 'CAL-PRG-007', title: 'Wave 3 S/4HANA Manufacturing Phase 2 Cutover Gate', date: '2026-09-20', time: '08:00 GST', owner: 'Fatima Al Zaabi', entity: 'HALCON, NIMR, LAHAB', status: 'Scheduled', priority: 'P1', desc: 'Pre-cutover dry run, inventory opening balance reconciliation, and plant validation.' },
    // October 2026
    { id: 'CAL-PRG-008', title: 'Plant MES to S/4HANA Shopfloor Go-Live Gate', date: '2026-10-12', time: '09:00 GST', owner: 'Manufacturing Systems Lead', entity: 'CARACAL, NIMR', status: 'Scheduled', priority: 'P1', desc: 'Live cutover of automated CNC machine work order feedback directly into S/4HANA.' },
    { id: 'CAL-PRG-009', title: 'Edge Hybrid Defense Data Lake Milestone 3', date: '2026-10-26', time: '11:00 GST', owner: 'Data Lake Architect', entity: 'EDGE HQ', status: 'Scheduled', priority: 'High', desc: 'Consolidation of telemetry pipelines from 34 entities into Abu Dhabi sovereign lake.' },
    // November 2026
    { id: 'CAL-PRG-010', title: 'Automated Self-Healing Runbook v2.0 Production Launch', date: '2026-11-16', time: '10:00 GST', owner: 'Automation Engineering', entity: 'All Entities', status: 'Scheduled', priority: 'High', desc: 'Production activation of 12 self-healing scripts for SAP lock clears and interface retries.' },
    { id: 'CAL-PRG-011', title: 'AdvantEDGE Annual Program Architectural Gate Review', date: '2026-11-30', time: '14:00 GST', owner: 'Steering Committee', entity: 'All 34 EDGE Entities', status: 'Scheduled', priority: 'P1', desc: 'Yearly architectural health review and technology roadmap approval for 2027.' },
    // December 2026
    { id: 'CAL-PRG-012', title: '2027 AMS Strategy & Capacity Horizon Sign-Off', date: '2026-12-15', time: '10:00 GST', owner: 'Dr. Tariq Al Nuaimi', entity: 'EDGE Group Executive Board', status: 'Scheduled', priority: 'P1', desc: 'Executive sign-off on 2027 AMS staffing allocations, SLA targets, and innovation credits.' },
  ];

  milestoneEvents.forEach(m => {
    events.push({
      id: m.id,
      title: m.title,
      type: 'milestone',
      typeLabel: 'Transformation Gate',
      date: m.date,
      time: m.time,
      owner: m.owner,
      entity: m.entity,
      status: m.status,
      priority: m.priority,
      badgeColor: 'badge-primary',
      description: m.desc,
    });
  });

  // 4. Change Freezes (Strict Governance Moratoriums)
  const freezeEvents = [
    // June 2026
    { id: 'CAL-FRZ-001', title: 'Mid-Year Financial Books Consolidation Freeze', date: '2026-06-20', endDate: '2026-06-23', time: 'Full Day Freeze', owner: 'CFO Policy Directive', status: 'Enforced', priority: 'P1', desc: 'Production change moratorium across R2R, L2C, and P2P modules for H1 audit closing.' },
    // July 2026
    { id: 'CAL-FRZ-002', title: 'Disaster Recovery Live Simulation Maintenance Freeze', date: '2026-07-24', endDate: '2026-07-26', time: 'Weekend Freeze (Fri–Sun)', owner: 'Enterprise Architecture', status: 'Enforced', priority: 'P1', desc: 'Full production transport freeze during DC1 to DC2 failover drill.' },
    // August 2026
    { id: 'CAL-FRZ-003', title: 'August CAB Infrastructure Maintenance Freeze', date: '2026-08-29', endDate: '2026-08-31', time: 'Weekend Freeze', owner: 'Group Infrastructure', status: 'Enforced', priority: 'High', desc: 'Network backbone switch firmware upgrades and edge security appliance patching.' },
    // September 2026
    { id: 'CAL-FRZ-004', title: 'Q3 Close System Stabilization Freeze Window', date: '2026-09-29', endDate: '2026-09-30', time: 'Full Day Freeze', owner: 'SteerCom Policy', status: 'Enforced', priority: 'P1', desc: 'Mandatory change freeze during Q3 quarterly financial closing.' },
    // October 2026
    { id: 'CAL-FRZ-005', title: 'UAE Defense Exhibition (IDEX / UMEX) System Freeze', date: '2026-10-21', endDate: '2026-10-25', time: 'Moratorium Window', owner: 'Group Security Directive', status: 'Enforced', priority: 'P1', desc: 'High-alert system change freeze during major UAE national defense exhibition.' },
    // November 2026
    { id: 'CAL-FRZ-006', title: 'Pre-Year-End Audit Stabilization Freeze', date: '2026-11-26', endDate: '2026-11-29', time: 'Full Weekend Freeze', owner: 'Finance & Audit Committee', status: 'Enforced', priority: 'P1', desc: 'Strict transport freeze prior to annual statutory financial ledger audit.' },
    // December 2026
    { id: 'CAL-FRZ-007', title: 'Annual Fiscal Year-End Financial Close Moratorium', date: '2026-12-21', endDate: '2026-12-31', time: 'Annual Moratorium', owner: 'CFO Policy Directive', status: 'Enforced', priority: 'P1', desc: 'Total moratorium on non-emergency code transports during annual book closing.' },
  ];

  freezeEvents.forEach(f => {
    events.push({
      id: f.id,
      title: f.title,
      type: 'freeze',
      typeLabel: 'Change Freeze Window',
      date: f.date,
      endDate: f.endDate,
      time: f.time,
      owner: f.owner,
      status: f.status,
      priority: f.priority,
      badgeColor: 'badge-error',
      description: f.desc,
    });
  });

  // 5. SteerComs, Operational Reviews & Entity WSRs
  const meetingEvents = [
    // June 2026
    { id: 'CAL-MTG-001', title: 'Monthly Executive SteerCom Review (MSR) - May Sign-Off', date: '2026-06-01', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'Monthly contractual SLA sign-off, penalty ledger review, and innovation credits.' },
    { id: 'CAL-MTG-002', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-02', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-003', title: 'Weekly Service Review (WSR) with NIMR Defense', date: '2026-06-04', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Review open tickets, shopfloor MES tickets, and RCA action items.' },
    { id: 'CAL-MTG-004', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-09', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-005', title: 'Weekly Service Review (WSR) with HALCON', date: '2026-06-11', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Triage batch job locking and shopfloor plant floor tickets with HALCON IT.' },
    { id: 'CAL-MTG-006', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-16', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-007', title: 'Weekly Service Review (WSR) with CARACAL', date: '2026-06-18', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Defense manufacturing Bill of Materials (BOM) sync and serial tracking.' },
    { id: 'CAL-MTG-008', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-23', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-009', title: 'Weekly Service Review (WSR) with EDGE HQ', date: '2026-06-25', time: '14:00 – 15:30 GST', owner: 'Fatima Al Zaabi', status: 'Completed', priority: 'High', desc: 'Executive reporting, SLA score attainment, and upcoming release approvals.' },
    { id: 'CAL-MTG-010', title: 'Weekly CAB Review & Change Triage Session', date: '2026-06-30', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    // July 2026
    { id: 'CAL-MTG-011', title: 'Weekly Service Review (WSR) with ADASI Autonomous', date: '2026-07-02', time: '10:00 – 11:30 GST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'UAV program spare parts supply chain tickets and Ariba supplier integration.' },
    { id: 'CAL-MTG-012', title: 'Monthly Executive SteerCom Review (MSR) - June Sign-Off', date: '2026-07-06', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'Monthly contractual SLA sign-off, penalty ledger review, and innovation credits.' },
    { id: 'CAL-MTG-013', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-07', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-014', title: 'Weekly Service Review (WSR) with LAHAB Munitions', date: '2026-07-09', time: '10:00 – 11:30 GST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', desc: 'Hazardous materials inventory tracking and plant maintenance work orders.' },
    { id: 'CAL-MTG-015', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-14', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-016', title: 'Weekly Service Review (WSR) with EPI Precision', date: '2026-07-16', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Aerospace machining work centers and Quality Management inspection lots.' },
    { id: 'CAL-MTG-017', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-21', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-018', title: 'Weekly Service Review (WSR) with BEACON RED Cyber', date: '2026-07-23', time: '11:00 – 12:30 GST', owner: 'Deepak Kumar', status: 'Completed', priority: 'Medium', desc: 'Cyber training academy student invoicing and SuccessFactors learning integration.' },
    { id: 'CAL-MTG-019', title: 'Weekly CAB Review & Change Triage Session', date: '2026-07-28', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-020', title: 'Weekly Service Review (WSR) with KATIM Secure Comms', date: '2026-07-30', time: '10:00 – 11:30 GST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'Secure phone manufacturing supply chain and hardware serialization.' },
    // August 2026
    { id: 'CAL-MTG-021', title: 'Monthly Executive SteerCom Review (MSR) - July Sign-Off', date: '2026-08-03', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Completed', priority: 'High', desc: 'H2 service level performance audit, SLA compliance, and staffing metrics.' },
    { id: 'CAL-MTG-022', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-04', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-023', title: 'Weekly Service Review (WSR) with JAHEZIYA Emergency', date: '2026-08-06', time: '10:00 – 11:30 GST', owner: 'Tariq Al Dhaheri', status: 'Completed', priority: 'Medium', desc: 'Safety training simulator maintenance and procurement workflows.' },
    { id: 'CAL-MTG-024', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-11', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-025', title: 'Weekly Service Review (WSR) with HORIZON Flight Academy', date: '2026-08-13', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Helicopter pilot flight hours billing and asset depreciation schedules.' },
    { id: 'CAL-MTG-026', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-18', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-027', title: 'Weekly Service Review (WSR) with ADSB Naval', date: '2026-08-20', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Completed', priority: 'Medium', desc: 'Corvette vessel retrofit project accounting and subcontractor milestones.' },
    { id: 'CAL-MTG-028', title: 'Weekly CAB Review & Change Triage Session', date: '2026-08-25', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Completed', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-029', title: 'Quarterly Customer Satisfaction (CSAT) Entity Review', date: '2026-08-27', time: '14:00 – 16:00 GST', owner: 'Customer Connect Lead', status: 'Completed', priority: 'High', desc: 'Cross-entity customer sentiment analysis, verbatim review, and action plans.' },
    // September 2026
    { id: 'CAL-MTG-030', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-01', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-031', title: 'Monthly Executive SteerCom Review (MSR) - August Sign-Off', date: '2026-09-02', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'SteerCom review of August availability, incident deflection, and capacity.' },
    { id: 'CAL-MTG-032', title: 'Weekly Service Review (WSR) with NIMR Defense', date: '2026-09-03', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Armored vehicle production batch traceability and plant inventory sync.' },
    { id: 'CAL-MTG-033', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-08', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-034', title: 'Weekly Service Review (WSR) with HALCON Precision', date: '2026-09-10', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Review of shopfloor scrap logging tickets and batch master changes.' },
    { id: 'CAL-MTG-035', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-15', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-036', title: 'Weekly Service Review (WSR) with ADASI Autonomous', date: '2026-09-17', time: '10:00 – 11:30 GST', owner: 'Noura Al Shamsi', status: 'Scheduled', priority: 'Medium', desc: 'UAV drone telemetry integration and maintenance order scheduling.' },
    { id: 'CAL-MTG-037', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-22', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-038', title: 'Weekly Service Review (WSR) with EDGE HQ Executive', date: '2026-09-24', time: '14:00 – 15:30 GST', owner: 'Fatima Al Zaabi', status: 'Scheduled', priority: 'High', desc: 'Quarterly SLA review, scorecard analysis, and upcoming release sign-offs.' },
    { id: 'CAL-MTG-039', title: 'Weekly CAB Review & Change Triage Session', date: '2026-09-29', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    // October 2026
    { id: 'CAL-MTG-040', title: 'Weekly Service Review (WSR) with CARACAL Defense', date: '2026-10-01', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Small arms manufacturing plant orders and serial barcode scanning.' },
    { id: 'CAL-MTG-041', title: 'Monthly Executive SteerCom Review (MSR) - September Sign-Off', date: '2026-10-05', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Q3 formal contractual sign-off, penalty performance credits, and budget review.' },
    { id: 'CAL-MTG-042', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-06', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-043', title: 'Weekly Service Review (WSR) with LAHAB Defense', date: '2026-10-08', time: '10:00 – 11:30 GST', owner: 'Tariq Al Dhaheri', status: 'Scheduled', priority: 'Medium', desc: 'Ammunition raw chemical inventory receipts and hazardous transport docs.' },
    { id: 'CAL-MTG-044', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-13', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-045', title: 'Weekly Service Review (WSR) with EPI Machining', date: '2026-10-15', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Precision CNC tool life tracking and equipment maintenance work centers.' },
    { id: 'CAL-MTG-046', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-20', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-047', title: 'Weekly Service Review (WSR) with KATIM Telecom', date: '2026-10-22', time: '10:00 – 11:30 GST', owner: 'Noura Al Shamsi', status: 'Scheduled', priority: 'Medium', desc: 'Cryptographic phone hardware supply chain and customer warranty portal.' },
    { id: 'CAL-MTG-048', title: 'Weekly CAB Review & Change Triage Session', date: '2026-10-27', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-049', title: 'Weekly Service Review (WSR) with BEACON RED Security', date: '2026-10-29', time: '11:00 – 12:30 GST', owner: 'Deepak Kumar', status: 'Scheduled', priority: 'Medium', desc: 'Cyber training course billing, LMS integration, and student portal access.' },
    // November 2026
    { id: 'CAL-MTG-050', title: 'Monthly Executive SteerCom Review (MSR) - October Sign-Off', date: '2026-11-02', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Executive SteerCom sign-off on October service levels and capacity plans.' },
    { id: 'CAL-MTG-051', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-03', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-052', title: 'Weekly Service Review (WSR) with JAHEZIYA Academy', date: '2026-11-05', time: '10:00 – 11:30 GST', owner: 'Tariq Al Dhaheri', status: 'Scheduled', priority: 'Medium', desc: 'Safety academy instructor scheduling and procurement asset management.' },
    { id: 'CAL-MTG-053', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-10', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-054', title: 'Weekly Service Review (WSR) with HORIZON Aviation', date: '2026-11-12', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Flight simulator flight log reconciliation and student pilot training records.' },
    { id: 'CAL-MTG-055', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-17', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-056', title: 'Weekly Service Review (WSR) with ADSB Shipyards', date: '2026-11-19', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Naval vessel overhaul project milestones and supplier billing reconciliations.' },
    { id: 'CAL-MTG-057', title: 'Weekly CAB Review & Change Triage Session', date: '2026-11-24', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-058', title: 'Quarterly Customer Satisfaction (CSAT) Entity Review', date: '2026-11-26', time: '14:00 – 16:00 GST', owner: 'Customer Connect Lead', status: 'Scheduled', priority: 'High', desc: 'Entity-by-entity CSAT sentiment scorecards and resolution feedback.' },
    // December 2026
    { id: 'CAL-MTG-059', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-01', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-060', title: 'Monthly Executive SteerCom Review (MSR) - November Sign-Off', date: '2026-12-02', time: '14:00 – 16:00 GST', owner: 'Dr. Tariq Al Nuaimi', status: 'Scheduled', priority: 'High', desc: 'Monthly review of November operations, SLA scorecards, and year-end outlook.' },
    { id: 'CAL-MTG-061', title: 'Weekly Service Review (WSR) with NIMR Defense', date: '2026-12-03', time: '10:00 – 11:30 GST', owner: 'Ravi Shankar', status: 'Scheduled', priority: 'Medium', desc: 'Year-end inventory count preparation and shopfloor manufacturing reconciliation.' },
    { id: 'CAL-MTG-062', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-08', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Weekly Change Advisory Board review of production transports.' },
    { id: 'CAL-MTG-063', title: 'Weekly Service Review (WSR) with HALCON Precision', date: '2026-12-10', time: '10:00 – 11:30 GST', owner: 'Priya Nair', status: 'Scheduled', priority: 'Medium', desc: 'Annual plant inventory freeze coordination and financial WIP valuation.' },
    { id: 'CAL-MTG-064', title: 'Weekly CAB Review & Change Triage Session', date: '2026-12-15', time: '11:00 – 12:30 GST', owner: 'CAB Lead', status: 'Scheduled', priority: 'Medium', desc: 'Final pre-moratorium Change Advisory Board meeting.' },
    { id: 'CAL-MTG-065', title: 'Weekly Service Review (WSR) with EDGE HQ Finance', date: '2026-12-17', time: '14:00 – 15:30 GST', owner: 'Fatima Al Zaabi', status: 'Scheduled', priority: 'High', desc: 'Annual closing operational support plan, 24/7 financial close coverage roster.' },
  ];

  meetingEvents.forEach(m => {
    events.push({
      id: m.id,
      title: m.title,
      type: 'meeting',
      typeLabel: 'Operational Review',
      date: m.date,
      time: m.time,
      owner: m.owner,
      status: m.status,
      priority: m.priority,
      badgeColor: 'badge-primary',
      description: m.desc,
    });
  });

  // 6. Knowledge, SOPs & User Enablement Workshops
  const trainingEvents = [
    // June 2026
    { id: 'CAL-TRN-001', title: 'S/4HANA Sales Order Pricing & Lock Optimization Masterclass', date: '2026-06-16', time: '11:00 – 13:00 GST', owner: 'Khalid Al Hashimi', status: 'Completed', priority: 'Medium', desc: 'Interactive workshop for end-users on sales order batch lock avoidance.' },
    { id: 'CAL-TRN-002', title: 'Ariba Guided Sourcing Punchout Optimization Clinic', date: '2026-06-28', time: '14:00 – 16:00 GST', owner: 'Noura Al Shamsi', status: 'Completed', priority: 'Medium', desc: 'Procurement training on catalog punchout carts and supplier approval chains.' },
    // July 2026
    { id: 'CAL-TRN-003', title: 'Plant Floor MES Work Order Reconciliation Clinic', date: '2026-07-13', time: '10:00 – 12:00 GST', owner: 'Priya Nair', status: 'Completed', priority: 'Medium', desc: 'Shopfloor supervisor training on scrap yield recording and batch confirmation.' },
    { id: 'CAL-TRN-004', title: 'OpenText xECM ArchiveLink Configuration Workshop', date: '2026-07-29', time: '14:00 – 15:30 GST', owner: 'Opentext Lead', status: 'Completed', priority: 'Low', desc: 'Defense document retention policies and automated PDF archiving.' },
    // August 2026
    { id: 'CAL-TRN-005', title: 'Enterprise KEDB Runbook Authoring & Shift-Left Session', date: '2026-08-12', time: '10:00 – 12:00 GST', owner: 'Knowledge Lead', status: 'Completed', priority: 'Medium', desc: 'Training resolvers to document L1/L2 repeatable solutions into the KEDB.' },
    { id: 'CAL-TRN-006', title: 'S/4HANA HANA 2.0 Database SPS07 Patch Dry Run', date: '2026-08-25', time: '14:00 – 17:00 GST', owner: 'BASIS Lead', status: 'Completed', priority: 'High', desc: 'Technical BASIS team dry run for database patch script sequencing.' },
    // September 2026
    { id: 'CAL-TRN-007', title: 'Shift Handover & Escalation Governance Refresh', date: '2026-09-14', time: '11:00 – 12:30 GST', owner: 'Shift Commander', status: 'Scheduled', priority: 'Medium', desc: 'Standard operating procedures for seamless 24/7 tri-shift incident handover.' },
    { id: 'CAL-TRN-008', title: 'SAC Executive Predictive Analytics & Story Boarding Clinic', date: '2026-09-23', time: '14:00 – 16:00 GST', owner: 'Analytics Lead', status: 'Scheduled', priority: 'Medium', desc: 'Training business analysts on creating custom drill-down tiles in SAC.' },
    // October 2026
    { id: 'CAL-TRN-009', title: 'Zero-Trust Network Access & IAM MFA Protocol Workshop', date: '2026-10-14', time: '10:00 – 12:00 GST', owner: 'Cybersecurity Trainer', status: 'Scheduled', priority: 'Medium', desc: 'Defense contractor security protocols and passwordless access token handling.' },
    { id: 'CAL-TRN-010', title: 'Advanced Production Planning & Detailed Scheduling (PP-DS)', date: '2026-10-28', time: '13:00 – 16:00 GST', owner: 'Supply Chain Architect', status: 'Scheduled', priority: 'High', desc: 'Masterclass for factory planners on automated capacity constraint scheduling.' },
    // November 2026
    { id: 'CAL-TRN-011', title: 'Defense Munitions Material Master Best Practices', date: '2026-11-11', time: '10:00 – 12:00 GST', owner: 'Materials Management Lead', status: 'Scheduled', priority: 'Medium', desc: 'Strict serialization and batch tracking configuration for ordnance items.' },
    { id: 'CAL-TRN-012', title: 'Ariba Contract Workspace & Milestone Invoicing Clinic', date: '2026-11-23', time: '14:00 – 16:00 GST', owner: 'Ariba Lead', status: 'Scheduled', priority: 'Medium', desc: 'Training procurement specialists on milestone payment releases and compliance gates.' },
    // December 2026
    { id: 'CAL-TRN-013', title: 'Year-End Financial Closing Playbook & Runbook Walkthrough', date: '2026-12-09', time: '10:00 – 13:00 GST', owner: 'Financial Systems Lead', status: 'Scheduled', priority: 'High', desc: 'Step-by-step walkthrough of automated foreign currency revaluation and ledger balance carryforward.' },
    { id: 'CAL-TRN-014', title: '2027 Operational Readiness & Disaster Recovery Clinic', date: '2026-12-16', time: '14:00 – 16:30 GST', owner: 'Disaster Recovery Lead', status: 'Scheduled', priority: 'Medium', desc: 'Review of emergency call trees, satellite failover communications, and DC2 hot-standby readiness.' },
  ];

  trainingEvents.forEach(t => {
    events.push({
      id: t.id,
      title: t.title,
      type: 'training',
      typeLabel: 'User Enablement',
      date: t.date,
      time: t.time,
      owner: t.owner,
      status: t.status,
      priority: t.priority,
      badgeColor: 'badge-success',
      description: t.desc,
    });
  });

  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ═══════════════════════════════════════════════════
// 5. EXECUTIVE BOARD SELECTORS (Section 16)
// ═══════════════════════════════════════════════════
export function getExecutiveBoardData(filter = {}) {
  const incAnalytics = getIncidentAnalytics(filter);
  const srAnalytics = getServiceRequestAnalytics(filter);
  const enhAnalytics = getEnhancementAnalytics(filter);

  // SLA Performance Trend (6-Month response vs resolution)
  const slaTrend = [
    { month: 'Jan', Response: 98.2, Resolution: 94.0, Target: 88.0 },
    { month: 'Feb', Response: 97.8, Resolution: 94.5, Target: 88.0 },
    { month: 'Mar', Response: 98.4, Resolution: 95.0, Target: 88.0 },
    { month: 'Apr', Response: 97.5, Resolution: 94.8, Target: 88.0 },
    { month: 'May', Response: 98.0, Resolution: 95.2, Target: 88.0 },
    { month: 'Jun', Response: 98.6, Resolution: 95.4, Target: 88.0 },
  ];

  // Overall Ticket Mix (Incidents, SRs, Enhancements, Problems)
  const ticketMix = [
    { name: 'Incidents', value: incAnalytics.total, color: '#FF5622' },
    { name: 'Service Requests', value: srAnalytics.total, color: '#2563EB' },
    { name: 'Enhancements', value: enhAnalytics.total, color: '#7C3AED' },
    { name: 'Problem RCAs', value: problems.length, color: '#0D9F6E' },
  ];

  // Application Health Breakdown
  const appHealth = [
    { name: 'Healthy (Green)', value: 24, color: '#0D9F6E' },
    { name: 'Degraded / At Risk', value: 2, color: '#D97706' },
    { name: 'Critical Outage', value: 0, color: '#DC2626' },
  ];

  // Resource Compliance (Plan vs Actual FTEs)
  const resourceCompliance = [
    { track: 'AMS-ON-RUN', Plan: 14, Actual: 14, Coverage: '100%' },
    { track: 'AMS-OF-RUN', Plan: 10, Actual: 10, Coverage: '100%' },
    { track: 'AMS-OF-Flex', Plan: 3, Actual: 3, Coverage: '100%' },
    { track: 'ENH-OF-RUN', Plan: 3, Actual: 3, Coverage: '100%' },
  ];

  return {
    overallHealth: 96.4,
    slaScore: 95.4,
    p1p2Active: incAnalytics.p1 + incAnalytics.p2,
    appEstateHealth: 99.98,
    resourceCoverage: 100,
    slaTrend,
    ticketMix,
    appHealth,
    resourceCompliance,
    exceptionQueue: incAnalytics.exceptionQueue.slice(0, 5),
  };
}
