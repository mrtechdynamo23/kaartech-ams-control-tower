/**
 * EDGE AMS Control Tower — Configuration
 * 
 * Centralised configurable values, thresholds, and constants.
 * Per Section 2: implement sensible defaults, mark as configurable, note ambiguity.
 */

// ═══════════════════════════════════════════════════
// SLA POLICY — SOURCE-CONFIRMED (RFP §5.1, Section 25)
// ═══════════════════════════════════════════════════
export const SLA_POLICIES = {
  P1: {
    priority: 'P1',
    label: 'Critical',
    responseTime: 30,                // minutes
    responseUnit: 'minutes',
    resolutionTime: 4 * 60,          // 240 minutes (4 hours)
    resolutionUnit: 'minutes',
    monthlyResolutionTarget: 95,     // %
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §5.1',
  },
  P2: {
    priority: 'P2',
    label: 'High',
    responseTime: 2 * 60,            // 120 minutes (2 hours)
    responseUnit: 'minutes',
    resolutionTime: 8 * 60,          // 480 minutes (8 hours)
    resolutionUnit: 'minutes',
    monthlyResolutionTarget: 90,
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §5.1',
  },
  P3: {
    priority: 'P3',
    label: 'Medium',
    responseTime: 1,                 // 1 business day
    responseUnit: 'business_days',
    resolutionTime: 2,               // 2 business days
    resolutionUnit: 'business_days',
    monthlyResolutionTarget: 90,
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §5.1',
  },
  P4: {
    priority: 'P4',
    label: 'Low',
    responseTime: 2,                 // 2 business days
    responseUnit: 'business_days',
    resolutionTime: 4,               // 4 business days
    resolutionUnit: 'business_days',
    monthlyResolutionTarget: 85,
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §5.1',
  },
};

// Overall monthly resolution target — SOURCE-CONFIRMED
export const OVERALL_MONTHLY_RESOLUTION_TARGET = 88; // %

// ═══════════════════════════════════════════════════
// SERVICE REQUEST THRESHOLDS (Section 21)
// ═══════════════════════════════════════════════════
/**
 * CONFIGURABLE — The exact 16-person-hour boundary is genuinely ambiguous in the source.
 * The RFP says Standard SR: <16 hours, Major SR: >16 hours.
 * Default: ≥16 = Major (more conservative/defensible reading).
 * This is a configurable value, not a hardcoded literal.
 */
export const SR_EFFORT_THRESHOLD = {
  standardMaxHours: 16,       // < this = Standard
  majorMinHours: 16,          // >= this = Major
  classification: 'CONFIGURABLE',
  note: 'Exact 16-hour boundary unresolved in source. Default: >=16 = Major. RFP gap between <16 and >16.',
};

// ═══════════════════════════════════════════════════
// ENHANCEMENT THRESHOLDS (Section 22)
// ═══════════════════════════════════════════════════
export const ENHANCEMENT_THRESHOLD = {
  minPersonHours: 32,         // >32 person-hours = Enhancement (SOURCE-CONFIRMED)
  classification: 'SOURCE-CONFIRMED',
  source: 'RFP',
};

/**
 * CONFIGURABLE / DEMO — Minor vs Major Enhancement classification.
 * The source does NOT define a Minor vs Major classification rule.
 * This default rule is for demo purposes only and must NOT be presented
 * as an EDGE contractual rule.
 */
export const ENHANCEMENT_CATEGORY_RULE = {
  // Demo default: <=80 hours = Minor, >80 hours = Major
  minorMaxHours: 80,
  classification: 'CONFIGURABLE / DEMO',
  note: 'Source does not define Minor/Major classification rule for Enhancements. This is a demo default only.',
};

// ═══════════════════════════════════════════════════
// UNUSED TICKET CONVERSION (Section 58, Mechanism A)
// ═══════════════════════════════════════════════════
export const UNUSED_TICKET_CONVERSION = {
  hoursPerTicket: 4,                   // SOURCE-CONFIRMED (RFP §3.12)
  penaltyThresholdHours: 2000,         // SOURCE-CONFIRMED (RFP §5.5)
  classification: 'SOURCE-CONFIRMED',
  source: 'RFP §3.12, §5.5',
};

// ═══════════════════════════════════════════════════
// CSAT TARGETS (Section 51)
// ═══════════════════════════════════════════════════
export const CSAT_TARGETS = {
  overallMin: 85,                      // ≥85%
  ratedPercentMin: 85,                 // 85% of resolved tickets must be rated
  excellentContributionMin: 60,        // ≥60%
  poorRatingMax: 5,                    // ≤5% (breach triggers RCA + service improvement plan)
  poorRatingRcaDays: 10,              // working days
  classification: 'SOURCE-CONFIRMED',
  source: 'RFP §5.2',
};

// ═══════════════════════════════════════════════════
// TICKET VOLUME BASELINE (Section 56)
// ═══════════════════════════════════════════════════
export const TICKET_VOLUME_BASELINE = {
  currentMonthlyMin: 1200,
  currentMonthlyMax: 1400,
  newGoLiveServiceTrading: 600,        // per month
  newGoLiveManufacturing: 1000,        // per month
  baselineReviewMonths: 3,
  classification: 'SOURCE-CONFIRMED',
  source: 'RFP §3.11',
};

// ═══════════════════════════════════════════════════
// INCIDENT AGEING BUCKETS (Section 18)
// ═══════════════════════════════════════════════════
export const AGEING_BUCKETS = [
  { label: '0–3 days', min: 0, max: 3 },
  { label: '4–7 days', min: 4, max: 7 },
  { label: '8–15 days', min: 8, max: 15 },
  { label: '16–30 days', min: 16, max: 30 },
  { label: '30+ days', min: 31, max: Infinity },
];

// ═══════════════════════════════════════════════════
// STOP CLOCK STATES (Section 29)
// ═══════════════════════════════════════════════════
export const STOP_CLOCK_STATES = [
  { key: 'pendingCustomer', label: 'Pending Customer', classification: 'SOURCE-CONFIRMED' },
  { key: 'pendingThirdParty', label: 'Pending Third Party', classification: 'SOURCE-CONFIRMED' },
  { key: 'scheduledDeployment', label: 'Scheduled Deployment / Freeze Window', classification: 'SOURCE-CONFIRMED' },
  { key: 'forceMajeure', label: 'Force Majeure', classification: 'SOURCE-CONFIRMED' },
];

// ═══════════════════════════════════════════════════
// RESOLVER MODEL (Section 27)
// ═══════════════════════════════════════════════════

// SOURCE-CONFIRMED (RFP §3.8)
export const RESOLVER_TIERS = [
  { key: 'L1', label: 'L1', description: 'EDGE, basic helpdesk — captures/logs/dispatches', owner: 'EDGE' },
  { key: 'L1.5', label: 'L1.5', description: 'Bidder, triage and simple how-to/user support', owner: 'Bidder' },
  { key: 'L2', label: 'L2', description: 'Bidder or EDGE depending on issue type', owner: 'Mixed' },
  { key: 'L3', label: 'L3', description: 'Bidder, corrective maintenance, RCA, SME-level troubleshooting', owner: 'Bidder' },
  { key: 'L4', label: 'L4', description: 'OEM — SAP/Microsoft — via EDGE coordination', owner: 'OEM' },
];

// SOURCE-CONFIRMED (RFP §3.8, Level 2 row)
// These are the exact names from the RFP's own text — not placeholders.
export const RESOLVER_GROUPS = [
  {
    key: 'generalAppSupport',
    label: 'General Application Support',
    owner: 'Bidder',
    description: 'Provides support to all applications and modules in scope',
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §3.8',
  },
  {
    key: 'edgeBasisSupport',
    label: 'EDGE BASIS Support',
    owner: 'EDGE',
    description: 'Handles tickets related to technical infrastructure, system performance, and BASIS administration',
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §3.8',
  },
  {
    key: 'edgeGrcSupport',
    label: 'EDGE GRC Support',
    owner: 'EDGE',
    description: 'Provides support for Governance, Risk, and Compliance (GRC)-related tickets',
    classification: 'SOURCE-CONFIRMED',
    source: 'RFP §3.8',
  },
];

// ═══════════════════════════════════════════════════
// BUSINESS CALENDARS (Section 28)
// ═══════════════════════════════════════════════════
export const BUSINESS_CALENDARS = {
  hqServiceTrading: {
    label: 'HQ / Service / Trading',
    days: [1, 2, 3, 4, 5],     // Mon-Fri
    startTime: '08:30',
    endTime: '17:30',
    timezone: 'Asia/Dubai',
    classification: 'SOURCE-CONFIRMED',
  },
  manufacturing: {
    label: 'Manufacturing',
    days: [1, 2, 3, 4, 5, 6],  // Mon-Sat
    startTime: '07:00',
    endTime: '18:00',
    timezone: 'Asia/Dubai',
    classification: 'SOURCE-CONFIRMED',
  },
};

// ═══════════════════════════════════════════════════
// RISK RESPONSE CATEGORIES (Section 35)
// ═══════════════════════════════════════════════════
// Field name is "Risk Response Category" — explicit product-owner request.
export const RISK_RESPONSE_CATEGORIES = [
  'Avoid',
  'Mitigate',
  'Transfer',
  'Accept',
  'Escalate',
];

// ═══════════════════════════════════════════════════
// CTA CATEGORIES (Section 36)
// ═══════════════════════════════════════════════════
export const CTA_CATEGORIES = [
  { key: 'audit', label: 'Audit Action' },
  { key: 'risk', label: 'Risk Action' },
  { key: 'customer', label: 'Customer Action' },
  { key: 'program', label: 'Program Action' },
  { key: 'transition', label: 'Transition Action' },
  { key: 'serviceImprovement', label: 'Service Improvement Action' },
  { key: 'general', label: 'General CTA' },
];

export const CTA_SOURCE_TYPES = [
  'Audit', 'Risk', 'Customer', 'Program', 'Transition', 'Problem', 'Service Improvement',
];

// ═══════════════════════════════════════════════════
// ENTITY ONBOARDING (Section 71)
// ═══════════════════════════════════════════════════
export const ENTITY_ONBOARDING_NOTICE_WEEKS = 4;  // SOURCE-CONFIRMED (RFP §3.2)

// ═══════════════════════════════════════════════════
// ONSITE STAFFING STRUCTURE (Section 43)
// ═══════════════════════════════════════════════════
// SOURCE-CONFIRMED (RFP §3.6) — use exactly this, explicitly specified
export const ONSITE_STAFFING = [
  { role: 'AMS Team Lead', count: 1 },
  { role: 'Demand-to-Supply', count: 1 },
  { role: 'Warehouse Management EWM/Transportation Management', count: 1 },
  { role: 'Plan-to-Produce + Quality Management', count: 1 },
  { role: 'Manufacturing Execution System/MES', count: 1 },
  { role: 'Source-to-Pay', count: 2 },
  { role: 'Record-to-Report', count: 2 },
  { role: 'Hire-to-Retire', count: 1 },
];
