/**
 * EDGE AMS Control Tower — Master Data
 * 
 * Central master/configuration data per Section 68.
 * All source-confirmed data seeded from RFP.
 * Single source of truth — no duplicate datasets (Section 73).
 */

// ═══════════════════════════════════════════════════
// BUSINESS DOMAINS — SOURCE-CONFIRMED (Section 23 & 70)
// ═══════════════════════════════════════════════════
export const BUSINESS_DOMAINS = [
  { key: 'L2C', label: 'Lead-to-Cash', abbreviation: 'L2C' },
  { key: 'E2M', label: 'Engineer-to-Manufacture', abbreviation: 'E2M' },
  { key: 'P2P', label: 'Plan-to-Produce', abbreviation: 'P2P' },
  { key: 'D2S', label: 'Demand-to-Supply', abbreviation: 'D2S' },
  { key: 'S2P', label: 'Source-to-Pay', abbreviation: 'S2P' },
  { key: 'A2D', label: 'Acquire-to-Dispose', abbreviation: 'A2D' },
  { key: 'R2R', label: 'Record-to-Report', abbreviation: 'R2R' },
  { key: 'H2R', label: 'Hire-to-Retire', abbreviation: 'H2R' },
];

// ═══════════════════════════════════════════════════
// ENTITY MASTER — SOURCE-CONFIRMED (RFP Figure 4, Section 71)
// 34 entities as of June 2026. System supports dynamic add/remove.
// These are EDGE's public corporate entity names, not personnel PII.
// ═══════════════════════════════════════════════════
export const ENTITIES = [
  // Service Entities (27)
  { id: 'ENT-001', name: 'EDGE Corp.', type: 'HQ', subType: 'Group HQ', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-002', name: 'EDGE Business Services', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-003', name: 'EDGE Commercial', type: 'Trading', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-004', name: 'EDGE Global', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-005', name: 'EDGE Technologies', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-006', name: 'Advanced Concepts', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-007', name: 'Al Taif', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-008', name: 'Avantguard', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-009', name: 'Beacon Red', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-010', name: 'Cyber Defense', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-011', name: 'Earth', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-012', name: 'Fada', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-013', name: 'Flaris UAE', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-014', name: 'Horizon', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-015', name: 'Katim', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-016', name: 'Katim Finland', type: 'Service', calendarKey: 'hqServiceTrading', country: 'Finland', location: 'Helsinki', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-017', name: 'Key4', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-018', name: 'Mada', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-019', name: 'Maestral', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-020', name: 'Oryx Labs', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-021', name: 'Phantom Labs', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-022', name: 'Power Tech UAE', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-023', name: 'Pulse LLC', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-024', name: 'Remaya', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-025', name: 'Signal', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-026', name: 'Tier 4', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-027', name: 'Trust', type: 'Service', calendarKey: 'hqServiceTrading', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },

  // Manufacturing Entities (7)
  { id: 'ENT-028', name: 'ADASI', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-029', name: 'Al Tariq', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-030', name: 'EPI', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-031', name: 'Halcon', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-032', name: 'Lahab', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-033', name: 'Nimr', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
  { id: 'ENT-034', name: 'Pulse Manufacturing', type: 'Manufacturing', calendarKey: 'manufacturing', country: 'UAE', location: 'Abu Dhabi', status: 'Active', goLiveStatus: 'Live' },
];

// ═══════════════════════════════════════════════════
// APPLICATION MASTER — SOURCE-CONFIRMED (RFP §3.1, Section 48)
// ═══════════════════════════════════════════════════
export const APPLICATIONS = [
  // In Scope
  { id: 'APP-001', name: 'SAP S/4HANA 2025', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', modules: 'MDG, GRC, AC, AM, PDMI', criticality: 'Critical', health: 'Healthy', businessDomains: ['L2C','E2M','P2P','D2S','S2P','R2R'], hosting: 'On-Premise' },
  { id: 'APP-002', name: 'SAP Group Reporting', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['R2R'], hosting: 'On-Premise' },
  { id: 'APP-003', name: 'SAP Disclosure Management', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['R2R'], hosting: 'On-Premise' },
  { id: 'APP-004', name: 'SAP Global Trade Services (GTS)', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['L2C','P2P'], hosting: 'On-Premise' },
  { id: 'APP-005', name: 'SAP BW/4HANA + BPC 1.1', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['R2R'], hosting: 'On-Premise' },
  { id: 'APP-006', name: 'SAP Product Lifecycle Costing', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'Medium', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },
  { id: 'APP-007', name: 'SAP Process Orchestration', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['L2C','E2M','P2P','D2S'], hosting: 'On-Premise' },
  { id: 'APP-008', name: 'SAP MES', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'Critical', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },
  { id: 'APP-009', name: 'SAP MII', scope: 'In Scope', vendor: 'SAP', technology: 'SAP', criticality: 'High', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },
  { id: 'APP-010', name: 'SAP SuccessFactors', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', modules: 'HXM, Recruiting, Performance, Comp.', criticality: 'Critical', health: 'Healthy', businessDomains: ['H2R'], hosting: 'Cloud' },
  { id: 'APP-011', name: 'SAP Ariba Sourcing', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', businessDomains: ['S2P','P2P'], hosting: 'Cloud' },
  { id: 'APP-012', name: 'SAP Qualtrics Employee Engagement', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', businessDomains: ['H2R'], hosting: 'Cloud' },
  { id: 'APP-013', name: 'SAP Analytics Cloud with Digital Boardroom', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', businessDomains: ['R2R','L2C'], hosting: 'Cloud' },
  { id: 'APP-014', name: 'SAP xECM by Opentext', scope: 'In Scope', vendor: 'SAP / Opentext', technology: 'SAP', criticality: 'Medium', health: 'Healthy', businessDomains: ['L2C','P2P','R2R'], hosting: 'On-Premise' },
  { id: 'APP-015', name: 'SAP BTP - Portal Applications', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', criticality: 'High', health: 'Healthy', businessDomains: ['L2C','H2R'], hosting: 'Cloud' },
  { id: 'APP-016', name: 'SAP Cloud Platform Integration/Integration Suite', scope: 'In Scope', vendor: 'SAP', technology: 'Cloud', criticality: 'Critical', health: 'Healthy', businessDomains: ['L2C','P2P','H2R','D2S'], hosting: 'Cloud' },
  { id: 'APP-017', name: 'eVendor Portal', scope: 'In Scope', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', businessDomains: ['P2P','S2P'], hosting: 'On-Premise' },
  { id: 'APP-018', name: 'Security Clearance Portal', scope: 'In Scope', vendor: 'Custom', technology: 'Web', criticality: 'High', health: 'Healthy', businessDomains: ['H2R'], hosting: 'On-Premise' },
  { id: 'APP-019', name: 'X-Range Portal', scope: 'In Scope', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },
  { id: 'APP-020', name: 'Product Management Portal', scope: 'In Scope', vendor: 'Custom', technology: 'Web', criticality: 'Medium', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },
  { id: 'APP-021', name: 'Microsoft Dynamics 365 Field Service Enterprise', scope: 'In Scope', vendor: 'Microsoft', technology: 'Cloud', criticality: 'High', health: 'Healthy', businessDomains: ['L2C','A2D'], hosting: 'Cloud' },
  { id: 'APP-022', name: 'Microsoft Dynamics Marketing Tenant', scope: 'In Scope', vendor: 'Microsoft', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', businessDomains: ['L2C'], hosting: 'Cloud' },
  { id: 'APP-023', name: 'Microsoft Dynamics Sales Enterprise', scope: 'In Scope', vendor: 'Microsoft', technology: 'Cloud', criticality: 'High', health: 'Healthy', businessDomains: ['L2C'], hosting: 'Cloud' },
  { id: 'APP-024', name: 'Microsoft Project Server', scope: 'In Scope', vendor: 'Microsoft', technology: 'Cloud', criticality: 'Medium', health: 'Healthy', businessDomains: ['E2M'], hosting: 'Cloud' },
  { id: 'APP-025', name: 'Microsoft Power BI', scope: 'In Scope', vendor: 'Microsoft', technology: 'Cloud', modules: 'for projects/CRM', criticality: 'Medium', health: 'Healthy', businessDomains: ['L2C','E2M'], hosting: 'Cloud' },
  { id: 'APP-026', name: 'PMXSoft - Document Management', scope: 'In Scope', vendor: 'PMXSoft', technology: 'Web', criticality: 'Medium', health: 'Healthy', businessDomains: ['E2M'], hosting: 'On-Premise' },

  // Potential Extension — flagged distinctly
  { id: 'APP-027', name: 'SAP Signavio', scope: 'Potential Extension', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['E2M', 'L2C'], hosting: 'Cloud' },
  { id: 'APP-028', name: 'SAP LeanIX', scope: 'Potential Extension', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['Cross-Domain'], hosting: 'Cloud' },
  { id: 'APP-029', name: 'Joule Platform', scope: 'Potential Extension', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['Cross-Domain'], hosting: 'Cloud' },
  { id: 'APP-030', name: 'SAP IAS', scope: 'Potential Extension', vendor: 'SAP', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['H2R', 'L2C'], hosting: 'Cloud' },
  { id: 'APP-031', name: 'Automation Anywhere', scope: 'Potential Extension', vendor: 'Automation Anywhere', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['P2P', 'E2M'], hosting: 'Cloud' },
  { id: 'APP-032', name: 'Outsystems', scope: 'Potential Extension', vendor: 'Outsystems', technology: 'Cloud', criticality: 'Medium', health: 'Evaluation', businessDomains: ['L2C', 'E2M'], hosting: 'Cloud' },
];

// ═══════════════════════════════════════════════════
// TRACK MASTER — SOURCE-CONFIRMED (Section 69)
// ═══════════════════════════════════════════════════
export const TRACKS = [
  { key: 'AMS-ON-RUN', location: 'Onsite', allocation: 'Dedicated', stream: 'AMS', code: 'AMS-ON-RUN' },
  { key: 'AMS-OF-RUN', location: 'Offshore', allocation: 'Dedicated', stream: 'AMS', code: 'AMS-OF-RUN' },
  { key: 'AMS-OF-Flex', location: 'Offshore', allocation: 'Shared', stream: 'AMS', code: 'AMS-OF-Flex' },
  { key: 'ENH-OF-RUN', location: 'Offshore', allocation: 'Dedicated', stream: 'Enhancement', code: 'ENH-OF-RUN' },
];

// ═══════════════════════════════════════════════════
// PROCESS GROUPS — DEMO (extending from business domains)
// ═══════════════════════════════════════════════════
export const PROCESS_GROUPS = [
  { key: 'sales', label: 'Sales & Distribution', domain: 'L2C' },
  { key: 'billing', label: 'Billing & Invoicing', domain: 'L2C' },
  { key: 'production', label: 'Production Planning', domain: 'E2M' },
  { key: 'quality', label: 'Quality Management', domain: 'E2M' },
  { key: 'procurement', label: 'Procurement', domain: 'P2P' },
  { key: 'invoiceProc', label: 'Invoice Processing', domain: 'P2P' },
  { key: 'demandPlanning', label: 'Demand Planning', domain: 'D2S' },
  { key: 'warehouse', label: 'Warehouse Management', domain: 'D2S' },
  { key: 'sourcing', label: 'Strategic Sourcing', domain: 'S2P' },
  { key: 'vendorMgmt', label: 'Vendor Management', domain: 'S2P' },
  { key: 'assetMgmt', label: 'Asset Management', domain: 'A2D' },
  { key: 'maintenance', label: 'Plant Maintenance', domain: 'A2D' },
  { key: 'financials', label: 'Financial Accounting', domain: 'R2R' },
  { key: 'controlling', label: 'Management Accounting', domain: 'R2R' },
  { key: 'consolidation', label: 'Group Consolidation', domain: 'R2R' },
  { key: 'payroll', label: 'Payroll & Benefits', domain: 'H2R' },
  { key: 'talent', label: 'Talent Management', domain: 'H2R' },
  { key: 'recruiting', label: 'Recruiting', domain: 'H2R' },
];

// ═══════════════════════════════════════════════════
// TECHNOLOGY MASTER — DEMO
// ═══════════════════════════════════════════════════
export const TECHNOLOGIES = [
  { id: 'TECH-001', name: 'SAP S/4HANA', platform: 'SAP', version: '2025', vendor: 'SAP', appCount: 8, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-002', name: 'SAP BTP', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 3, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-003', name: 'SAP SuccessFactors', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-004', name: 'SAP Ariba', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-005', name: 'SAP Analytics Cloud', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-006', name: 'SAP BW/4HANA', platform: 'SAP', version: '2.0', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-007', name: 'SAP Process Orchestration', platform: 'SAP', version: '7.5', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Mature' },
  { id: 'TECH-008', name: 'SAP MES/MII', platform: 'SAP', version: '15.4', vendor: 'SAP', appCount: 2, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-009', name: 'Microsoft Dynamics 365', platform: 'Microsoft Cloud', version: 'Latest', vendor: 'Microsoft', appCount: 3, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-010', name: 'Microsoft Power BI', platform: 'Microsoft Cloud', version: 'Latest', vendor: 'Microsoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-011', name: 'Microsoft Project Server', platform: 'Microsoft Cloud', version: '2021', vendor: 'Microsoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-012', name: 'SAP Cloud Integration Suite', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-013', name: 'SAP GRC/AC', platform: 'SAP', version: '12.0', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-014', name: 'ABAP Stack', platform: 'SAP', version: '7.57', vendor: 'SAP', appCount: 8, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-015', name: 'SAP Fiori / UI5', platform: 'SAP', version: '1.120', vendor: 'SAP', appCount: 5, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-016', name: 'Opentext xECM', platform: 'Opentext', version: '23.4', vendor: 'Opentext', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-017', name: 'SAP GTS', platform: 'SAP', version: '2025', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-018', name: 'HANA Database', platform: 'SAP', version: '2.0 SPS07', vendor: 'SAP', appCount: 10, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-019', name: 'SAP Qualtrics', platform: 'SAP Cloud', version: 'Latest', vendor: 'SAP', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
  { id: 'TECH-020', name: 'PMXSoft DMS', platform: 'Custom', version: '5.2', vendor: 'PMXSoft', appCount: 1, health: 'Healthy', supportStatus: 'Active', lifecycle: 'Current' },
];

// ═══════════════════════════════════════════════════
// VENDOR MASTER — DEMO
// ═══════════════════════════════════════════════════
export const VENDORS = [
  { id: 'VND-001', name: 'SAP SE', type: 'OEM', appCount: 19, contact: 'SAP Support', status: 'Active' },
  { id: 'VND-002', name: 'Microsoft', type: 'OEM', appCount: 5, contact: 'Microsoft Support', status: 'Active' },
  { id: 'VND-003', name: 'Opentext', type: 'OEM', appCount: 1, contact: 'Opentext Support', status: 'Active' },
  { id: 'VND-004', name: 'PMXSoft', type: 'ISV', appCount: 1, contact: 'PMXSoft Support', status: 'Active' },
  { id: 'VND-005', name: 'Automation Anywhere', type: 'OEM', appCount: 1, contact: 'AA Support', status: 'Active' },
  { id: 'VND-006', name: 'Outsystems', type: 'OEM', appCount: 1, contact: 'Outsystems Support', status: 'Active' },
];
