/**
 * EDGE AMS Control Tower — Unified DFR Report Data Engine
 * Single Source of Truth for both Dashboard and PDF Export.
 * Calculates:
 *  - On Date, Current Month (MTD), Previous Month comparison matrices
 *  - Service Requests & Incidents breakdown by Support Services, Infra, Application, Total
 *  - Response & Resolution SLA Achieved, Fail, and %
 *  - MTD Status Distributions
 *  - 5-Day Daily Inflow & Resolution Trends
 *  - 5-Day Daily Response & Resolution SLA Compliance Trends
 *  - Operational Exception Queues: SLA Alerts, Breached Tickets, Hold Tickets
 */

import { incidents, serviceRequests, RESOURCES } from '../../data/demoData.js';

// Month names helper
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Format a Date object into DD-MMM-YYYY (e.g. 31-Jul-2026)
 */
export function formatDateFull(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format a Date object into DD-M-YYYY (e.g. 31-7-2026)
 */
export function formatDateCompact(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format month label MMM-YYYY (e.g. Jul-2026)
 */
export function formatMonthLabel(date) {
  const d = new Date(date);
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${month}-${year}`;
}

/**
 * Format short trend day label DD-MMM-YY (e.g. 31-Jul-26)
 */
export function formatTrendDay(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

/**
 * Map an incident or SR to one of the 3 reporting categories:
 *  - 'support': Support Services (Service Desk, L1/L1.5, User Admin, Access, Helpdesk)
 *  - 'infra': Infrastructure (BASIS, Network, Server, DB, Hosting, Cloud Platform)
 *  - 'app': Application (SAP ERP, S/4HANA, Ariba, SF, Custom Apps, Business Domains)
 */
export function getTicketCategory(ticket) {
  const domain = ticket.businessDomain || '';
  const app = (ticket.application || '').toLowerCase();
  const category = (ticket.category || '').toLowerCase();
  const desc = (ticket.shortDescription || '').toLowerCase();

  if (
    app.includes('basis') ||
    desc.includes('server') ||
    desc.includes('database') ||
    desc.includes('network') ||
    desc.includes('performance') ||
    desc.includes('interface timeout') ||
    category.includes('infrastructure')
  ) {
    return 'infra';
  }

  if (
    category.includes('access') ||
    category.includes('training') ||
    category.includes('documentation') ||
    ticket.resolverTier === 'L1' ||
    desc.includes('password') ||
    desc.includes('role access') ||
    desc.includes('user onboarding')
  ) {
    return 'support';
  }

  return 'app';
}

/**
 * Deterministic pseudo-random generator seeded by string
 */
function createSeededRandom(seed) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Generate normalized DFR Report Snapshot for a given target date
 * @param {string|Date} targetDateStr - e.g. '2026-07-31' or Date
 */
export function getDFRReportSnapshot(targetDateStr = '2026-07-31') {
  const targetDate = new Date(targetDateStr);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth(); // 0-indexed
  const day = targetDate.getDate();

  // Reference dates
  const formattedDate = formatDateFull(targetDate);
  const compactDate = formatDateCompact(targetDate);
  const currentMonthLabel = formatMonthLabel(targetDate);

  // Previous month
  const prevMonthDate = new Date(year, month - 1, 1);
  const prevMonthLabel = formatMonthLabel(prevMonthDate);

  // 5 daily trend dates ending on targetDate
  const dailyDates = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(year, month, day - i);
    dailyDates.push({
      dateObj: d,
      iso: d.toISOString().split('T')[0],
      trendLabel: formatTrendDay(d),
      compact: formatDateCompact(d),
    });
  }

  // Seeded random for consistent, deterministic demo variation across dates
  const rng = createSeededRandom(`dfr-${compactDate}`);

  // Base multiplier to allow subtle organic variation by date while keeping scale
  const dayFactor = 0.85 + (rng() * 0.3);

  // ═══════════════════════════════════════════════════
  // 1. SERVICE REQUESTS COMPARISON MATRIX
  // ═══════════════════════════════════════════════════
  // Periods: onDate, currentMonth, previousMonth
  // Tracks: support, infra, app, total
  // Rows: In Approval, New/Open, In Progress, New/In Progress, Awaiting Info/Hold, Rejected, Closed, Total,
  //       Response SLA Achieved, Response (Fail), Resolution SLA Achieved, Resolution (Fail),
  //       Response SLA Achieved %, Resolution SLA Achieved %

  const srMatrix = {
    onDate: {
      inApproval: { support: 0, infra: 0, app: 0, total: 0 },
      newOpen: { support: 0, infra: 0, app: 0, total: 0 },
      inProgress: { support: 0, infra: 0, app: 0, total: 0 },
      newInProgress: { support: 0, infra: 0, app: 0, total: 0 },
      awaitingInfoHold: { support: 0, infra: 0, app: 0, total: 0 },
      rejected: { support: 0, infra: 0, app: 0, total: 0 },
      closed: { support: 0, infra: Math.round(9 * dayFactor), app: 0, total: Math.round(9 * dayFactor) },
      total: { support: 0, infra: Math.round(9 * dayFactor), app: 0, total: Math.round(9 * dayFactor) },
      responseAchieved: { support: 0, infra: 0, app: 0, total: 0 },
      responseFail: { support: 0, infra: 0, app: 0, total: 0 },
      resolutionAchieved: { support: 0, infra: 0, app: 0, total: 0 },
      resolutionFail: { support: 0, infra: 0, app: 0, total: 0 },
      responseSlaPct: { support: '-', infra: '-', app: '-', total: '-' },
      resolutionSlaPct: { support: '-', infra: '-', app: '-', total: '-' },
    },
    currentMonth: {
      inApproval: { support: 75, infra: 0, app: 0, total: 75 },
      newOpen: { support: 4, infra: 0, app: 0, total: 4 },
      inProgress: { support: 0, infra: 1, app: 1, total: 2 },
      newInProgress: { support: 4, infra: 1, app: 0, total: 6 },
      awaitingInfoHold: { support: 11, infra: 3, app: 4, total: 18 },
      rejected: { support: 47, infra: 3, app: 0, total: 50 },
      closed: { support: 192, infra: 87, app: 49, total: 328 },
      total: { support: 282, infra: 91, app: 54, total: 427 },
      responseAchieved: { support: 188, infra: 46, app: 47, total: 281 },
      responseFail: { support: 0, infra: 0, app: 0, total: 0 },
      resolutionAchieved: { support: 179, infra: 52, app: 52, total: 283 },
      resolutionFail: { support: 0, infra: 0, app: 0, total: 0 },
      responseSlaPct: { support: '100%', infra: '100%', app: '100%', total: '100%' },
      resolutionSlaPct: { support: '100%', infra: '100%', app: '100%', total: '100%' },
    },
    previousMonth: {
      inApproval: { support: 8, infra: 0, app: 0, total: 8 },
      newOpen: { support: 0, infra: 0, app: 0, total: 0 },
      inProgress: { support: 0, infra: 0, app: 0, total: 0 },
      newInProgress: { support: 0, infra: 0, app: 0, total: 0 },
      awaitingInfoHold: { support: 4, infra: 2, app: 0, total: 6 },
      rejected: { support: 118, infra: 2, app: 8, total: 128 },
      closed: { support: 193, infra: 112, app: 82, total: 387 },
      total: { support: 205, infra: 114, app: 82, total: 401 },
      responseAchieved: { support: 172, infra: 53, app: 86, total: 311 },
      responseFail: { support: 0, infra: 1, app: 0, total: 1 },
      resolutionAchieved: { support: 157, infra: 56, app: 87, total: 300 },
      resolutionFail: { support: 0, infra: 6, app: 1, total: 7 },
      responseSlaPct: { support: '100%', infra: '98%', app: '100%', total: '100%' },
      resolutionSlaPct: { support: '100%', infra: '90%', app: '99%', total: '98%' },
    },
  };

  // ═══════════════════════════════════════════════════
  // 2. INCIDENTS COMPARISON MATRIX
  // ═══════════════════════════════════════════════════
  // Rows: New/Open, In Progress, New/In Progress, Awaiting Info/Hold, Closed, Total,
  //       Response SLA Achieved, Response (Fail), Resolution SLA Achieved, Resolution (Fail),
  //       Response SLA Achieved %, Resolution SLA Achieved %

  const incClosedOnDate = Math.max(1, Math.round(6 * dayFactor));
  const incSuppOnDate = Math.round(incClosedOnDate * 0.33);
  const incInfraOnDate = incClosedOnDate - incSuppOnDate;

  const incidentMatrix = {
    onDate: {
      newOpen: { support: 0, infra: 0, app: 0, total: 0 },
      inProgress: { support: 0, infra: 0, app: 0, total: 0 },
      newInProgress: { support: 0, infra: 0, app: 0, total: 0 },
      awaitingInfoHold: { support: 0, infra: 0, app: 0, total: 0 },
      closed: { support: incSuppOnDate, infra: incInfraOnDate, app: 0, total: incClosedOnDate },
      total: { support: incSuppOnDate, infra: incInfraOnDate, app: 0, total: incClosedOnDate },
      responseAchieved: { support: incSuppOnDate, infra: incInfraOnDate, app: 0, total: incClosedOnDate },
      responseFail: { support: 0, infra: 0, app: 0, total: 0 },
      resolutionAchieved: { support: incSuppOnDate, infra: incInfraOnDate, app: 0, total: incClosedOnDate },
      resolutionFail: { support: 0, infra: 0, app: 0, total: 0 },
      responseSlaPct: { support: '100%', infra: '100%', app: '-', total: '100%' },
      resolutionSlaPct: { support: '100%', infra: '100%', app: '-', total: '100%' },
    },
    currentMonth: {
      newOpen: { support: 0, infra: 0, app: 0, total: 0 },
      inProgress: { support: 0, infra: 0, app: 0, total: 0 },
      newInProgress: { support: 0, infra: 0, app: 0, total: 0 },
      awaitingInfoHold: { support: 7, infra: 17, app: 1, total: 25 },
      closed: { support: 843, infra: 436, app: 15, total: 1294 },
      total: { support: 850, infra: 453, app: 16, total: 1319 },
      responseAchieved: { support: 747, infra: 434, app: 14, total: 1195 },
      responseFail: { support: 0, infra: 1, app: 0, total: 1 },
      resolutionAchieved: { support: 853, infra: 455, app: 16, total: 1324 },
      resolutionFail: { support: 0, infra: 0, app: 0, total: 0 },
      responseSlaPct: { support: '100%', infra: '100%', app: '100%', total: '100%' },
      resolutionSlaPct: { support: '100%', infra: '100%', app: '100%', total: '100%' },
    },
    previousMonth: {
      newOpen: { support: 0, infra: 0, app: 0, total: 0 },
      inProgress: { support: 0, infra: 0, app: 0, total: 0 },
      newInProgress: { support: 0, infra: 0, app: 0, total: 0 },
      awaitingInfoHold: { support: 0, infra: 1, app: 0, total: 1 },
      closed: { support: 913, infra: 579, app: 29, total: 1521 },
      total: { support: 913, infra: 580, app: 29, total: 1522 },
      responseAchieved: { support: 627, infra: 569, app: 24, total: 1220 },
      responseFail: { support: 0, infra: 0, app: 1, total: 1 },
      resolutionAchieved: { support: 914, infra: 579, app: 29, total: 1522 },
      resolutionFail: { support: 0, infra: 1, app: 0, total: 1 },
      responseSlaPct: { support: '100%', infra: '100%', app: '96%', total: '100%' },
      resolutionSlaPct: { support: '100%', infra: '100%', app: '100%', total: '100%' },
    },
  };

  // ═══════════════════════════════════════════════════
  // 3. MTD STATUS DISTRIBUTIONS (DONUTS)
  // ═══════════════════════════════════════════════════
  const srStatusDistribution = [
    { name: 'In Approval', value: 75, pct: '18%', color: '#3B82F6' },
    { name: 'New/Open', value: 4, pct: '1%', color: '#6366F1' },
    { name: 'In Progress', value: 2, pct: '0%', color: '#EC4899' },
    { name: 'New/In Progress', value: 6, pct: '1%', color: '#A855F7' },
    { name: 'Awaiting Info/Hold', value: 18, pct: '4%', color: '#F59E0B' },
    { name: 'Rejected', value: 50, pct: '12%', color: '#EF4444' },
    { name: 'Closed', value: 328, pct: '77%', color: '#10B981' },
  ];
  const srTotalMTD = 427;

  const incidentStatusDistribution = [
    { name: 'New/Open', value: 0, pct: '0%', color: '#6366F1' },
    { name: 'In Progress', value: 0, pct: '0%', color: '#3B82F6' },
    { name: 'New/In Progress', value: 0, pct: '0%', color: '#8B5CF6' },
    { name: 'Awaiting Info/Hold', value: 25, pct: '2%', color: '#F59E0B' },
    { name: 'Closed', value: 1294, pct: '98%', color: '#10B981' },
  ];
  const incidentTotalMTD = 1319;

  // ═══════════════════════════════════════════════════
  // 4. DAILY TRENDS (5 DAYS)
  // ═══════════════════════════════════════════════════
  const srTrendData = [
    { date: dailyDates[0].trendLabel, created: 23, closed: 20, support: 12, app: 5, infra: 3 },
    { date: dailyDates[1].trendLabel, created: 19, closed: 25, support: 14, app: 9, infra: 2 },
    { date: dailyDates[2].trendLabel, created: 15, closed: 14, support: 9, app: 3, infra: 2 },
    { date: dailyDates[3].trendLabel, created: 19, closed: 24, support: 11, app: 10, infra: 3 },
    { date: dailyDates[4].trendLabel, created: 14, closed: 20, support: 9, app: 6, infra: 5 },
  ];

  const incidentTrendData = [
    { date: dailyDates[0].trendLabel, created: 47, closed: 34, support: 28, app: 12, infra: 7 },
    { date: dailyDates[1].trendLabel, created: 71, closed: 65, support: 45, app: 19, infra: 7 },
    { date: dailyDates[2].trendLabel, created: 52, closed: 48, support: 33, app: 18, infra: 1 },
    { date: dailyDates[3].trendLabel, created: 28, closed: 23, support: 21, app: 6, infra: 1 },
    { date: dailyDates[4].trendLabel, created: 6, closed: 6, support: 2, app: 4, infra: 0 },
  ];

  // ═══════════════════════════════════════════════════
  // 5. SLA TRENDS (5 DAYS)
  // ═══════════════════════════════════════════════════
  const srSlaTrend = [
    { date: dailyDates[0].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[1].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[2].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[3].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[4].trendLabel, responseCompliance: 100.0, resolutionCompliance: 0.0 }, // Target day open tickets under resolution
  ];

  const incidentSlaTrend = [
    { date: dailyDates[0].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[1].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[2].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[3].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
    { date: dailyDates[4].trendLabel, responseCompliance: 100.0, resolutionCompliance: 100.0 },
  ];

  // ═══════════════════════════════════════════════════
  // 6. OPERATIONAL EXCEPTION QUEUES
  // ═══════════════════════════════════════════════════
  // SLA Alerts: approaching breach, sorted by timeLeftHrs ascending
  const slaAlertTickets = [
    { ticketNo: 'INC0041615', assignedTo: 'Fahad Aldossary', timeLeftHrs: 8.7, priority: 'P2', domain: 'E2M' },
    { ticketNo: 'INC0034172', assignedTo: 'Tamilvanan A', timeLeftHrs: 10.2, priority: 'P2', domain: 'L2C' },
    { ticketNo: 'SCTASK001082', assignedTo: 'Mohsin Dhunware', timeLeftHrs: 8.3, priority: 'Standard', domain: 'P2P' },
    { ticketNo: 'RITM0017442', assignedTo: 'Sohail Shaik', timeLeftHrs: 3.9, priority: 'Standard', domain: 'H2R' },
    { ticketNo: 'INC0042284', assignedTo: 'Yuvaraj P', timeLeftHrs: 10.5, priority: 'P3', domain: 'S2P' },
    { ticketNo: 'INC0043110', assignedTo: 'Layla Al Qassimi', timeLeftHrs: 11.2, priority: 'P3', domain: 'R2R' },
  ].sort((a, b) => a.timeLeftHrs - b.timeLeftHrs);

  // Breached Tickets: tickets that have breached SLA with Extra Hours
  const breachedTickets = [
    { ticketNo: 'INC0034986', assignedTo: 'Unassigned (Triage)', extraHours: 2.33, priority: 'P2' },
    { ticketNo: 'INC0034987', assignedTo: 'Unassigned (Triage)', extraHours: 2.07, priority: 'P2' },
    { ticketNo: 'INC0035801', assignedTo: 'Sohail Shaik', extraHours: 27.16, priority: 'P3' },
    { ticketNo: 'RITM0015207', assignedTo: 'Mahdi Alnasser', extraHours: 0.36, priority: 'Standard' },
    { ticketNo: 'RITM0015214', assignedTo: 'Mohammed Zakkariya', extraHours: 0.00, priority: 'Standard' },
    { ticketNo: 'RITM0015304', assignedTo: 'Mohammed Zakkariya', extraHours: 3.40, priority: 'Standard' },
    { ticketNo: 'INC0036189', assignedTo: 'Velvendhan Devendran', extraHours: 0.06, priority: 'P2' },
  ];

  // Hold Tickets: tickets in Awaiting Info / Hold state with Hold Hours
  const holdTickets = [
    { ticketNo: 'INC0034172', name: 'Tamilvanan A', holdHours: 202.57, reason: 'Pending Customer Verification' },
    { ticketNo: 'RITM0015160', name: 'Mohammad Ahtesham', holdHours: 128.66, reason: 'Awaiting User Info' },
    { ticketNo: 'RITM0016075', name: 'Tamilvanan A', holdHours: 35.80, reason: 'Pending Vendor Patch' },
    { ticketNo: 'INC0039006', name: 'Mohammed Zakkariya', holdHours: 57.45, reason: 'Pending Change Window' },
    { ticketNo: 'RITM0016411', name: 'Tamilvanan A', holdHours: 10.68, reason: 'Awaiting Security Approval' },
    { ticketNo: 'INC0040445', name: 'Tamilvanan A', holdHours: 230.53, reason: 'Pending Customer Sign-off' },
    { ticketNo: 'INC0040774', name: 'Mohammed Zakkariya', holdHours: 3.84, reason: 'Awaiting Clarification' },
    { ticketNo: 'INC0041015', name: 'Tamilvanan A', holdHours: 170.55, reason: 'Customer Hold' },
    { ticketNo: 'INC0041529', name: 'Mohammad Ahtesham', holdHours: 11.93, reason: 'Awaiting System Access' },
    { ticketNo: 'INC0041615', name: 'Fahad Aldossary', holdHours: 86.40, reason: 'Pending Entity Testing' },
  ];

  return {
    targetDate,
    targetDateStr,
    formattedDate,
    compactDate,
    currentMonthLabel,
    prevMonthLabel,
    dailyDates,
    serviceRequests: srMatrix,
    incidents: incidentMatrix,
    srStatusDistribution,
    srTotalMTD,
    incidentStatusDistribution,
    incidentTotalMTD,
    srTrendData,
    incidentTrendData,
    srSlaTrend,
    incidentSlaTrend,
    slaAlertTickets,
    breachedTickets,
    holdTickets,
  };
}
