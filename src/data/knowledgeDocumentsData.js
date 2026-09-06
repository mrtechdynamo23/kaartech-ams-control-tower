/**
 * EDGE AMS Control Tower — Predefined Knowledge Documents & SOP Repository
 *
 * Provides a standardized document-oriented knowledge library across:
 * Business Streams: L2C, E2M, P2P, D2S, S2P, A2D, R2R, H2R
 * Document Types: FAQ, User Manual, Operational Guide, Troubleshooting, SOP / Procedure, Reference
 *
 * Each document contains operational metadata, executive summaries, step-by-step procedures,
 * checklists, and linked ticket references.
 */

export const KNOWLEDGE_DOCUMENT_TYPES = [
  'FAQ',
  'User Manual',
  'Operational Guide',
  'Troubleshooting',
  'SOP / Procedure',
  'Reference',
];

export const KNOWLEDGE_BUSINESS_STREAMS = [
  { key: 'L2C', label: 'L2C (Lead to Cash)' },
  { key: 'E2M', label: 'E2M (Engineer to Manage)' },
  { key: 'P2P', label: 'P2P (Procure to Pay)' },
  { key: 'D2S', label: 'D2S (Demand to Supply)' },
  { key: 'S2P', label: 'S2P (Source to Pay)' },
  { key: 'A2D', label: 'A2D (Asset to Disposal)' },
  { key: 'R2R', label: 'R2R (Record to Report)' },
  { key: 'H2R', label: 'H2R (Hire to Retire)' },
];

export const knowledgeDocuments = [
  // ─── 1. FAQs ─────────────────────────────────────────────────────────────
  {
    id: 'KBA-FAQ-001',
    title: 'AMS Frequently Asked Questions',
    docType: 'FAQ',
    businessStream: 'L2C',
    processGroup: 'Service Desk & Triage',
    application: 'AdvantEDGE CRM / Portal',
    owner: 'AMS Service Desk',
    lastUpdated: '2026-07-31',
    status: 'Published',
    version: 'v2.4',
    summary: 'Comprehensive overview of AMS operating windows, ticket logging channels, priority definitions, and escalation tiers.',
    content: `### 1. What are the standard AMS operational coverage windows?
AMS Core runs 24/7 for P1/P2 critical business interruptions. P3 and P4 operational requests are processed Monday through Friday, 08:00 to 18:00 GST.

### 2. How are tickets triaged upon creation?
Incoming alerts and customer submissions undergo automatic classification based on impacted business domain, application service, and transaction urgency. Tickets without clear categorization are routed to the Central Triage Desk within 15 minutes.

### 3. What constitutes a P1 incident?
A P1 represents a complete outage or severe operational halt affecting core financial settlement, plant operations, or corporate export licensing with no viable operational workaround.`,
    relatedTickets: ['INC-00001', 'INC-00002'],
    tags: ['General', 'Coverage', 'Triage', 'SLA'],
    viewCount: 1240,
  },
  {
    id: 'KBA-FAQ-002',
    title: 'Application Access FAQ',
    docType: 'FAQ',
    businessStream: 'L2C',
    processGroup: 'Customer Management',
    application: 'AdvantEDGE CRM',
    owner: 'AMS Service Desk',
    lastUpdated: '2026-07-31',
    status: 'Published',
    version: 'v3.1',
    summary: 'Frequently asked questions regarding CRM role authorizations, business partner access, and multi-factor authentication.',
    content: `### 1. Who approves access to AdvantEDGE CRM?
All customer and partner account access requests require dual sign-off from the respective Business Domain Lead and Corporate Security Coordinator.

### 2. Why is my CRM account showing 'Authorization Suspended'?
Accounts inactive for more than 45 days are placed into dormant protection. Reactivation requires submitting an SR via the Portal with manager endorsement.

### 3. How do I request temporary elevated permissions for quarter-end?
Elevated firecall access can be granted for a maximum 72-hour window through the Emergency Access Management (EAM) workflow inside GRC.`,
    relatedTickets: ['SR-00003', 'SR-00014'],
    tags: ['Access', 'CRM', 'Permissions', 'GRC'],
    viewCount: 890,
  },
  {
    id: 'KBA-FAQ-003',
    title: 'Incident Management FAQ',
    docType: 'FAQ',
    businessStream: 'D2S',
    processGroup: 'Incident Management',
    application: 'SAP S/4HANA EWM',
    owner: 'Omar Bashar',
    lastUpdated: '2026-08-10',
    status: 'Published',
    version: 'v1.8',
    summary: 'Clarifications on SLA response versus resolution timers, incident re-opening policies, and major incident bridge protocols.',
    content: `### 1. When does the SLA IRT (Initial Response Time) clock begin?
The IRT clock starts immediately upon ticket creation timestamp in the ITSM tool, independent of whether an engineer has manually opened the record.

### 2. Can a closed incident be re-opened?
Incidents in 'Resolved' state may be rejected by the user within 5 business days. Once marked 'Closed', a new incident referencing the historical record must be raised.

### 3. How is stop-clock status validated?
Stop-clock status (Awaiting Customer / Pending 3rd Party) requires timestamped justification notes and can only be sustained with documented stakeholder agreement.`,
    relatedTickets: ['INC-00006', 'INC-00018'],
    tags: ['Incidents', 'EWM', 'SLA', 'Timers'],
    viewCount: 640,
  },
  {
    id: 'KBA-FAQ-004',
    title: 'Service Request FAQ',
    docType: 'FAQ',
    businessStream: 'P2P',
    processGroup: 'Procurement & Sourcing',
    application: 'SAP Ariba',
    owner: 'Ravi Shankar',
    lastUpdated: '2026-08-15',
    status: 'Published',
    version: 'v2.0',
    summary: 'Standard lead times, catalog item configurations, purchase requisition workflows, and supplier onboarding queries.',
    content: `### 1. What is the standard turnaround for Ariba supplier catalog enablement?
Standard catalog updates have a 48-hour SLA. Custom PunchOut integrations require a 5-business-day testing cycle across staging environments.

### 2. How do I track PR approval bottlenecks?
Open the PR in AdvantEDGE Procurement Console, select 'Workflow History', and view active approval queue nodes and designated delegates.`,
    relatedTickets: ['SR-00002', 'SR-00021'],
    tags: ['Ariba', 'Procurement', 'Catalog', 'PR'],
    viewCount: 710,
  },
  {
    id: 'KBA-FAQ-005',
    title: 'Password / Access FAQ',
    docType: 'FAQ',
    businessStream: 'H2R',
    processGroup: 'Identity & Access Management',
    application: 'SAP SuccessFactors',
    owner: 'Layla Al Qassimi',
    lastUpdated: '2026-08-20',
    status: 'Published',
    version: 'v2.2',
    summary: 'Self-service password reset procedures, SSO credential synchronization, and mobile authenticator onboarding.',
    content: `### 1. How do I reset my SuccessFactors enterprise password?
Use the corporate Self-Service Password Reset (SSPR) portal at identity.edge.ae. Direct password changes inside the SF interface are disabled by policy.

### 2. What should I do if my Microsoft Authenticator push is not triggering?
Verify device date/time synchronization or choose 'Use verification code instead' to enter the 6-digit TOTP token manually.`,
    relatedTickets: ['SR-00005', 'INC-00030'],
    tags: ['Password', 'SSO', 'MFA', 'Identity'],
    viewCount: 1530,
  },
  {
    id: 'KBA-FAQ-006',
    title: 'Common Application Issues FAQ',
    docType: 'FAQ',
    businessStream: 'E2M',
    processGroup: 'Manufacturing Operations',
    application: 'SAP MES/MII',
    owner: 'Priya Nair',
    lastUpdated: '2026-08-25',
    status: 'Published',
    version: 'v1.5',
    summary: 'High-frequency shop-floor MES terminal disconnects, barcode scanner calibration, and batch tag synchronization queries.',
    content: `### 1. Shop floor terminal shows 'OPC Data Hub Disconnected'
Verify local network switch port connectivity and ensure the Kepware OPC service is running on the local line gateway.

### 2. Barcode scanner double-posting batch IDs
Inspect scanner firmware settings to disable automatic CR/LF suffixing on standard GS1-128 barcoded pallet labels.`,
    relatedTickets: ['INC-00009', 'PRB-00003'],
    tags: ['MES', 'ShopFloor', 'OPC', 'Scanners'],
    viewCount: 480,
  },

  // ─── 2. User Manuals ─────────────────────────────────────────────────────
  {
    id: 'KBA-MAN-001',
    title: 'Application User Manual',
    docType: 'User Manual',
    businessStream: 'L2C',
    processGroup: 'Customer Management',
    application: 'AdvantEDGE CRM',
    owner: 'Khalid Al Hashimi',
    lastUpdated: '2026-07-28',
    status: 'Published',
    version: 'v4.0',
    summary: 'End-to-end user manual for commercial opportunity management, customer quotation approval cycles, and billing dispatch.',
    content: `### Executive Overview
This document guides sales coordinators and commercial operations teams through the AdvantEDGE CRM lifecycle.

### Key Workflows
1. **Quotation Generation:** Enter customer specification parameters, verify margin baselines, and initiate pricing compliance.
2. **Export Control Verification:** Automatic validation against Ministry of Defence classification registries.
3. **Dispatch to SAP SD:** Order conversion triggers automated contract line item creation in SAP S/4HANA.`,
    relatedTickets: ['SR-00019'],
    tags: ['Manual', 'CRM', 'Quotation', 'Sales'],
    viewCount: 1120,
  },
  {
    id: 'KBA-MAN-002',
    title: 'Service Request User Guide',
    docType: 'User Manual',
    businessStream: 'P2P',
    processGroup: 'Procurement',
    application: 'SAP MM',
    owner: 'Abdulrahman Darwish',
    lastUpdated: '2026-08-05',
    status: 'Published',
    version: 'v2.3',
    summary: 'Step-by-step user guide for submitting material master additions, purchase requisition modifications, and vendor updates.',
    content: `### Overview
This operational guide assists business superusers in correctly drafting and submitting Service Requests to avoid triage rejection.

### Procedure
1. Navigate to Customer Connect → Service Requests.
2. Select appropriate request category (Material Master, Vendor Setup, or Configuration Change).
3. Attach required commercial entity approvals and signed compliance checklists.
4. Review calculated SLA target turnaround before final submission.`,
    relatedTickets: ['SR-00001', 'SR-00011'],
    tags: ['UserGuide', 'SR', 'Procurement', 'MM'],
    viewCount: 950,
  },
  {
    id: 'KBA-MAN-003',
    title: 'Incident Logging User Guide',
    docType: 'User Manual',
    businessStream: 'D2S',
    processGroup: 'Warehouse Management',
    application: 'SAP TM',
    owner: 'Vikram Singh',
    lastUpdated: '2026-08-01',
    status: 'Published',
    version: 'v2.1',
    summary: 'Standard operating handbook on capturing critical incident evidence, business impact metrics, and severity selection.',
    content: `### Best Practice for Incident Logging
Clear and concise evidence collection accelerates initial troubleshooting by up to 60%.

### Mandatory Fields
- Exact error screen capture or transaction code (e.g., /SCMTMS/PLN_STAGE).
- Number of affected logistics units or warehouse bays.
- Business deadline risk (e.g., Customs flight manifest dispatch).`,
    relatedTickets: ['INC-00012'],
    tags: ['UserGuide', 'Incident', 'Logistics', 'TM'],
    viewCount: 820,
  },
  {
    id: 'KBA-MAN-004',
    title: 'Change Request User Guide',
    docType: 'User Manual',
    businessStream: 'E2M',
    processGroup: 'Engineering & Quality',
    application: 'SAP QM',
    owner: 'Sultan Al Dhahiri',
    lastUpdated: '2026-07-15',
    status: 'Published',
    version: 'v3.0',
    summary: 'Handbook covering the standard Change Advisory Board (CAB) submission cycle, risk scoring, and test evidence requirements.',
    content: `### Change Submission Lifecycle
All functional modifications and technical enhancements must pass through formal CAB scrutiny.

### Required Documentation
1. Approved Business Requirement Document (BRD).
2. Functional Specification Document (FSD) with rollback contingency plan.
3. User Acceptance Testing (UAT) sign-off certificate signed by Domain Lead.`,
    relatedTickets: ['ENH-0001', 'ENH-0004'],
    tags: ['CAB', 'Change', 'QM', 'Governance'],
    viewCount: 760,
  },
  {
    id: 'KBA-MAN-005',
    title: 'AMS Portal User Manual',
    docType: 'User Manual',
    businessStream: 'R2R',
    processGroup: 'Operations Command',
    application: 'EDGE Control Tower',
    owner: 'Fatima Al Zaabi',
    lastUpdated: '2026-08-28',
    status: 'Published',
    version: 'v2.0',
    summary: 'Complete guide to navigating the EDGE AMS Control Tower: Command Center, Executive Board, DFR reporting, and Customer Corner.',
    content: `### System Architecture
The EDGE AMS Control Tower centralizes telemetry, ITSM data, and resource allocations into a single pane of glass.

### Navigation Overview
- **Executive Board:** High-level operational posture, contractual SLA trends, and budget health.
- **Command Center:** Real-time operational queues across Incidents, SRs, Enhancements, and Problems.
- **Reporting / DFR:** Standardized 24h Daily Flash Report with instant PDF generation.
- **Customer Corner:** Collaborative CTA threads and ticket conversation channels.`,
    relatedTickets: ['INC-00002'],
    tags: ['ControlTower', 'Manual', 'Portal', 'DFR'],
    viewCount: 2150,
  },

  // ─── 3. Operational Guides ───────────────────────────────────────────────
  {
    id: 'KBA-OPS-001',
    title: 'Incident Resolution Guide',
    docType: 'Operational Guide',
    businessStream: 'R2R',
    processGroup: 'Financial Operations',
    application: 'SAP S/4HANA FI',
    owner: 'Mariam Al Suwaidi',
    lastUpdated: '2026-08-18',
    status: 'Published',
    version: 'v2.5',
    summary: 'Standard operating playbook for diagnosing financial reconciliation variances, locked ledger postings, and currency revaluation errors.',
    content: `### 1. Diagnosis
Check transaction SM21 and SM12 for persistent lock entries on table BSEG or ACDOCA during foreign exchange revaluation runs.

### 2. Resolution Workflow
1. Verify background job status in SM37 (Job name: SAPF100).
2. If job terminated with memory dump, consult SAP Note 2451992 for batch cursor buffer limits.
3. Re-execute ledger settlement in test simulation mode prior to live commitment.`,
    relatedTickets: ['INC-00001', 'PRB-00001'],
    tags: ['FICO', 'Finance', 'Resolution', 'Runbook'],
    viewCount: 1420,
  },
  {
    id: 'KBA-OPS-002',
    title: 'Service Request Handling Guide',
    docType: 'Operational Guide',
    businessStream: 'S2P',
    processGroup: 'Sourcing & Contracting',
    application: 'SAP Ariba Sourcing',
    owner: 'Noura Al Shamsi',
    lastUpdated: '2026-08-12',
    status: 'Published',
    version: 'v1.9',
    summary: 'Resolver procedures for handling sourcing event template updates, auction rule configuration, and supplier qualification workflows.',
    content: `### Standard Handling Procedure
1. Verify that requested contract template changes comply with EDGE Procurement Policy 2026.
2. Clone existing template in staging environment to apply rule changes.
3. Perform dry-run RFQ simulation with test supplier accounts before promoting to production.`,
    relatedTickets: ['SR-00008'],
    tags: ['Sourcing', 'Ariba', 'SOP', 'Procurement'],
    viewCount: 680,
  },
  {
    id: 'KBA-OPS-003',
    title: 'Escalation Procedure',
    docType: 'Operational Guide',
    businessStream: 'R2R',
    processGroup: 'Service Management',
    application: 'All Enterprise Applications',
    owner: 'Sara Al Marzouqi',
    lastUpdated: '2026-08-22',
    status: 'Published',
    version: 'v3.2',
    summary: 'Hierarchical operational escalation matrix, notification triggers, and SteerCom executive engagement thresholds.',
    content: `### Escalation Hierarchy
- **Tier 1 (T+30m on P1):** Primary Resolver to Domain Lead (e.g. Omar Bashar for D2S).
- **Tier 2 (T+60m on P1):** Domain Lead to AMS Delivery Lead (Fatima Al Zaabi).
- **Tier 3 (T+120m on P1):** AMS Lead to Program Director (Dr. Tariq Al Nuaimi) and Steering Committee.

### Critical Escalation Triggers
- Approaching 50% of resolution SLA window without identified root cause.
- Unplanned secondary system degradation during restoration activities.`,
    relatedTickets: ['INC-00001', 'INC-00002'],
    tags: ['Escalation', 'Governance', 'SLA', 'Tiers'],
    viewCount: 1890,
  },
  {
    id: 'KBA-OPS-004',
    title: 'SLA Management Guide',
    docType: 'Operational Guide',
    businessStream: 'R2R',
    processGroup: 'Governance & Reporting',
    application: 'EDGE Reporting Engine',
    owner: 'Fatima Al Zaabi',
    lastUpdated: '2026-08-08',
    status: 'Published',
    version: 'v2.8',
    summary: 'Calculation standards for Initial Response Time (IRT) and Mean/Max Permissible Target (MPT), penalty clauses, and DFR metrics.',
    content: `### SLA Methodology
- **IRT (Initial Response Time):** Measures elapsed time from customer logging to active qualified engagement. Target ≥ 95.0%.
- **MPT (Mean / Max Permissible Target):** Measures total restoration time excluding contractual stop-clock holds. Target ≥ 95.0%.

### Audit Compliance
All SLA calculations are reconciled daily against master ITSM event tables and published in the Daily Flash Report.`,
    relatedTickets: ['INC-00003'],
    tags: ['SLA', 'IRT', 'MPT', 'Metrics', 'DFR'],
    viewCount: 1650,
  },
  {
    id: 'KBA-OPS-005',
    title: 'Application Support Guide',
    docType: 'Operational Guide',
    businessStream: 'A2D',
    processGroup: 'Plant & Asset Management',
    application: 'SAP PM/EAM',
    owner: 'Tariq Al Dhaheri',
    lastUpdated: '2026-08-14',
    status: 'Published',
    version: 'v1.7',
    summary: 'Maintenance schedules, preventive inspection work order generation, and telemetry integration for defense assets.',
    content: `### Preventive Work Order Management
Ensure monthly maintenance plans (transaction IP10 / IP30) are executed on the 1st of every calendar month. Verify calibration equipment sensor IDs prior to work order closure.`,
    relatedTickets: ['SR-00015'],
    tags: ['Asset', 'EAM', 'PM', 'Maintenance'],
    viewCount: 540,
  },

  // ─── 4. Troubleshooting ──────────────────────────────────────────────────
  {
    id: 'KBA-TRB-001',
    title: 'Application Login Troubleshooting',
    docType: 'Troubleshooting',
    businessStream: 'H2R',
    processGroup: 'Authentication & SSO',
    application: 'SAP SuccessFactors',
    owner: 'Raj Malhotra',
    lastUpdated: '2026-08-21',
    status: 'Published',
    version: 'v3.0',
    summary: 'Root cause analysis and rapid restoration steps for SAML 2.0 token expiration, clock skew, and Entra ID claim mismatches.',
    content: `### Symptom: SAML Error 'Signature Validation Failed'
1. Check ADFS / Microsoft Entra token signing certificate expiry.
2. Verify token audience URI matches SuccessFactors service provider entity ID.
3. Clear browser session storage and re-initiate IdP-initiated login from office.edge.ae.`,
    relatedTickets: ['INC-00016', 'SR-00028'],
    tags: ['Login', 'SAML', 'SSO', 'Identity'],
    viewCount: 1380,
  },
  {
    id: 'KBA-TRB-002',
    title: 'Integration Failure Troubleshooting',
    docType: 'Troubleshooting',
    businessStream: 'E2M',
    processGroup: 'Middleware & CPI',
    application: 'SAP CPI Tenant',
    owner: 'Rakesh Kumar',
    lastUpdated: '2026-08-26',
    status: 'Published',
    version: 'v2.4',
    summary: 'Playbook for diagnosing stuck message queues, SSL handshake failures, expired keystore certificates, and tenant memory throttle.',
    content: `### Diagnostic Checklist
1. Access CPI Monitoring Dashboard → Message Processing.
2. Filter by status 'Failed' and extract MessageGuid.
3. If error code is 'MPL_ATTACHMENT_SIZE_EXCEEDED', split payload via SFTP batcher.
4. If SSL handshake fails, verify intermediate CA cert in tenant keystore via Transaction STRUST.`,
    relatedTickets: ['INC-00002', 'PRB-00002'],
    tags: ['CPI', 'Integration', 'Middleware', 'SSL'],
    viewCount: 1750,
  },
  {
    id: 'KBA-TRB-003',
    title: 'Access Issue Troubleshooting',
    docType: 'Troubleshooting',
    businessStream: 'L2C',
    processGroup: 'User Authorization & GRC',
    application: 'SAP GRC Access Control',
    owner: 'Deepak Kumar',
    lastUpdated: '2026-08-19',
    status: 'Published',
    version: 'v2.0',
    summary: 'Resolving authorization missing errors (SU53), Segregation of Duties (SoD) risk violations, and role sync latency.',
    content: `### Procedure for Missing Authorization
1. Instruct user to run transaction /nSU53 immediately following error.
2. Export authorization object and field values.
3. Verify if authorization is covered under standard single role or requires GRC mitigating control approval.`,
    relatedTickets: ['SR-00010'],
    tags: ['GRC', 'SU53', 'Security', 'Authorizations'],
    viewCount: 990,
  },
  {
    id: 'KBA-TRB-004',
    title: 'Common Application Error Guide',
    docType: 'Troubleshooting',
    businessStream: 'P2P',
    processGroup: 'Vendor Invoice Processing',
    application: 'OpenText VIM',
    owner: 'Arjun Menon',
    lastUpdated: '2026-08-24',
    status: 'Published',
    version: 'v1.9',
    summary: 'Resolution guide for optical character recognition (OCR) parsing exceptions, invoice line matching blocks, and tax jurisdiction discrepancies.',
    content: `### Common VIM Exceptions
- **Exception 101 - PO Not Found:** Verify supplier tax number formatting against vendor master record.
- **Exception 204 - Price Variance > 5%:** Reroute invoice to purchasing agent for debit memo verification.
- **Exception 301 - Duplicate Invoice:** Validate supplier external reference number in table RBKP.`,
    relatedTickets: ['INC-00004', 'INC-00029'],
    tags: ['VIM', 'OpenText', 'Invoicing', 'Exceptions'],
    viewCount: 880,
  },

  // ─── 5. SOP / Procedures & Reference ─────────────────────────────────────
  {
    id: 'KBA-SOP-001',
    title: 'Period-End Close Emergency Restoration SOP',
    docType: 'SOP / Procedure',
    businessStream: 'R2R',
    processGroup: 'Financial Accounting',
    application: 'SAP S/4HANA Finance',
    owner: 'Fatima Al Zaabi',
    lastUpdated: '2026-08-27',
    status: 'Published',
    version: 'v3.5',
    summary: 'Mission-critical standard operating procedure for handling HANA memory exhaustion, index server failover, and ledger lock clears during financial close.',
    content: `### Immediate Action Procedure
1. **Workload Assessment:** Check HANA Studio indexserver allocation limit.
2. **Batch Throttle:** Temporarily pause non-critical batch classes via SM36.
3. **Controlled Settlement Re-run:** Execute program RAPERB20 with package-size cursor of 5,000 documents to eliminate RAM spikes.`,
    relatedTickets: ['INC-00001'],
    tags: ['SOP', 'Finance', 'HANA', 'PeriodEnd'],
    viewCount: 2450,
  },
  {
    id: 'KBA-SOP-002',
    title: 'CPI Interface Circuit-Breaker & Replay SOP',
    docType: 'SOP / Procedure',
    businessStream: 'E2M',
    processGroup: 'Integration Services',
    application: 'SAP Cloud Integration',
    owner: 'Rakesh Kumar',
    lastUpdated: '2026-08-29',
    status: 'Published',
    version: 'v2.1',
    summary: 'Standard operating procedure for tripping integration circuit breakers during partner outages and conducting staged message replay.',
    content: `### Circuit Breaker Tripping
When external partner endpoints return HTTP 503 for more than 10 consecutive executions:
1. Trip the inbound iFlow trigger to queue messages in persistent JMS buffer.
2. Notify partner support and table item on Daily Ops Stand-Up.
3. Upon service restoration, initiate throttled replay at 25 messages/minute.`,
    relatedTickets: ['INC-00002'],
    tags: ['SOP', 'CPI', 'Replay', 'JMS'],
    viewCount: 1680,
  },
  {
    id: 'KBA-REF-001',
    title: 'Disaster Recovery Failover Procedure (RTO < 2h)',
    docType: 'Reference',
    businessStream: 'A2D',
    processGroup: 'Infrastructure & DR',
    application: 'Enterprise HANA Multi-AZ',
    owner: 'Tariq Al Dhaheri',
    lastUpdated: '2026-07-20',
    status: 'Published',
    version: 'v4.2',
    summary: 'Contractual disaster recovery reference manual, replication status verification, and DNS failover sequencing for Abu Dhabi secondary datacenter.',
    content: `### Disaster Declaration Protocol
Only the EDGE Group CIO or designated Program Director may authorize DR invocation.

### Key Targets
- **RTO (Recovery Time Objective):** < 2.0 Hours.
- **RPO (Recovery Point Objective):** < 15 Minutes.

### System Verification
Verify HANA System Replication (HSR) mode is 'SYNC' or 'SYNCMEM' with zero log shipping lag prior to cutover.`,
    relatedTickets: ['INC-00005'],
    tags: ['DR', 'Failover', 'HANA', 'Reference'],
    viewCount: 1980,
  },
];
