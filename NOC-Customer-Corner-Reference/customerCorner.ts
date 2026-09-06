/**
 * Customer Corner — stakeholder collaboration channel.
 *
 * A single place where COMPANY, CONTRACTOR and third-party stakeholders hold a
 * written, attributable conversation against either an existing ticket or a
 * Call To Action (CTA) raised outside the ticket queue.
 *
 * CONTRACTUAL POSITIONING
 * ───────────────────────
 * SOW App.1 §8.1 requires "transparency and traceability in all AMS performance,
 * risks, and actions" and "clear accountability between COMPANY (ERP Solutions,
 * DBS) and CONTRACTOR". SOW App.1 §6.9 and §8.2 define the governance forums (daily
 * stand-up, weekly operational review, MSR, QSC) that consume those actions.
 * Customer Corner is the written channel BETWEEN those forums — every thread
 * carries the forum it is tabled at so nothing arrives at a review unrecorded.
 *
 * WHAT IT IS NOT
 * ──────────────
 * It is not a system of record and it does not measure service levels. SOW
 * §10.1 measures SLAs through eService, ServiceNow, CPI dashboards and Cloud
 * ALM, and pauses the clock "only for approved waiting states (user input,
 * business approvals, environmental issues)". A Corner conversation is none of
 * those: posting, replying or resolving a thread never starts, pauses or stops
 * an SLA clock. Ticket state changes still happen in the ITSM tool.
 *
 * DATA PROVENANCE: every stakeholder persona and every seeded conversation in
 * this file is authored demonstration content for the bid Control Tower. Ticket
 * references point at the app's existing demo incident and service-request sets.
 */

// ─── STAKEHOLDERS ────────────────────────────────────────────────────────────

/** Which contracting side a participant speaks for. */
export type StakeholderSide = 'COMPANY' | 'CONTRACTOR' | 'THIRD PARTY';

export interface CornerStakeholder {
  id: string;
  name: string;
  /** Role as it appears in the governance model. */
  title: string;
  org: string;
  side: StakeholderSide;
  /**
   * Position in the §6.11 escalation matrix
   * (Analyst → Domain Lead → Service Delivery Manager → AMS Service Manager →
   * COMPANY ERP Solutions owner). Null where the persona sits outside it.
   */
  escalationTier: 'Analyst' | 'Domain Lead' | 'Service Delivery Manager' | 'AMS Service Manager' | 'COMPANY ERP Solutions' | null;
}

export const cornerStakeholders: CornerStakeholder[] = [
  // COMPANY — North Oil Company
  { id: 'CMP-01', name: 'Abdulrahman Al-Kuwari', title: 'ERP Solutions Owner', org: 'North Oil Company', side: 'COMPANY', escalationTier: 'COMPANY ERP Solutions' },
  { id: 'CMP-02', name: 'Maryam Al-Sulaiti', title: 'DBS Governance Manager', org: 'North Oil Company', side: 'COMPANY', escalationTier: null },
  { id: 'CMP-03', name: 'Hessa Al-Emadi', title: 'Finance Business Superuser (S/4 FI)', org: 'North Oil Company', side: 'COMPANY', escalationTier: null },
  { id: 'CMP-04', name: 'Jassim Al-Mannai', title: 'Supply Chain Business Superuser (Ariba / VIM)', org: 'North Oil Company', side: 'COMPANY', escalationTier: null },
  { id: 'CMP-05', name: 'Noof Al-Naimi', title: 'HR Business Superuser (SuccessFactors)', org: 'North Oil Company', side: 'COMPANY', escalationTier: null },
  { id: 'CMP-06', name: 'Ali Al-Marri', title: 'Infrastructure & Cyber Coordinator', org: 'North Oil Company', side: 'COMPANY', escalationTier: null },

  // CONTRACTOR — Unified SAP AMS team
  { id: 'CTR-01', name: 'Sara Al-Otaibi', title: 'AMS Service Delivery Manager', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Service Delivery Manager' },
  { id: 'CTR-02', name: 'Priya Nair', title: 'AMS Service Manager', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'AMS Service Manager' },
  { id: 'CTR-03', name: 'Omar Al-Mutairi', title: 'Basis & Platform Lead', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Domain Lead' },
  { id: 'CTR-04', name: 'Rakesh Kumar', title: 'Integration (CPI) Lead', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Domain Lead' },
  { id: 'CTR-05', name: 'Layla Hassan', title: 'SuccessFactors Lead', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Domain Lead' },
  { id: 'CTR-06', name: 'Aisha Rahman', title: 'Ariba & VIM Lead', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Domain Lead' },
  { id: 'CTR-07', name: 'Khalid Al-Shammari', title: 'Security & GRC Lead', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Domain Lead' },
  { id: 'CTR-08', name: 'Arjun Menon', title: 'Functional Analyst — S/4 Finance', org: 'Unified SAP AMS', side: 'CONTRACTOR', escalationTier: 'Analyst' },

  // THIRD PARTY — partner and product-support channels (SOW App.1 §6.11 vendor hand-offs)
  { id: 'TPY-01', name: 'SAP Product Support', title: 'OSS incident channel', org: 'SAP', side: 'THIRD PARTY', escalationTier: null },
  { id: 'TPY-02', name: 'OpenText VIM Support', title: 'Vendor invoice management support', org: 'OpenText', side: 'THIRD PARTY', escalationTier: null },
  { id: 'TPY-03', name: 'Signavio Programme Partner', title: 'Process transformation SI', org: 'SI Partner', side: 'THIRD PARTY', escalationTier: null },
];

export const stakeholderById = (id: string): CornerStakeholder | undefined =>
  cornerStakeholders.find((s) => s.id === id);

export const stakeholderName = (id: string): string => stakeholderById(id)?.name ?? id;

/** Badge treatment per side. Kept here so the page and any future export agree. */
export const SIDE_META: Record<StakeholderSide, { label: string; short: string; bg: string; color: string }> = {
  COMPANY: { label: 'COMPANY (NOC)', short: 'COMPANY', bg: '#E6F4FC', color: '#0D4C93' },
  CONTRACTOR: { label: 'CONTRACTOR (AMS)', short: 'CONTRACTOR', bg: '#E3FCEF', color: '#22A06B' },
  'THIRD PARTY': { label: 'Third party', short: 'THIRD PARTY', bg: '#FFF7E6', color: '#E97F0A' },
};

// ─── THREADS ─────────────────────────────────────────────────────────────────

export type CornerThreadType = 'Ticket' | 'CTA';

export type CornerTopic =
  | 'Ticket Update'
  | 'SLA Clarification'
  | 'Change Coordination'
  | 'Access & Authorisation'
  | 'Master Data'
  | 'Release & Transport'
  | 'Improvement Idea'
  | 'Escalation';

export const CORNER_TOPICS: CornerTopic[] = [
  'Ticket Update',
  'SLA Clarification',
  'Change Coordination',
  'Access & Authorisation',
  'Master Data',
  'Release & Transport',
  'Improvement Idea',
  'Escalation',
];

/** Governance forum the thread is tabled at (SOW App.1 §6.9, §8.2). */
export type CornerForum =
  | 'Daily Ops Stand-Up'
  | 'Weekly Operational Review'
  | 'Monthly Service Review'
  | 'Quarterly Steering Committee'
  | 'Not tabled';

export const CORNER_FORUMS: CornerForum[] = [
  'Daily Ops Stand-Up',
  'Weekly Operational Review',
  'Monthly Service Review',
  'Quarterly Steering Committee',
  'Not tabled',
];

export type CTAStatus = 'Open' | 'In Progress' | 'Closed';

export interface CornerCTA {
  /** Human reference, e.g. CTA-014. */
  ref: string;
  /** Stakeholder id accountable for the action. */
  ownerId: string;
  dueDate: string;
  status: CTAStatus;
  priority: 'High' | 'Medium' | 'Low';
  /**
   * Set once the CTA has been raised as a real ticket in the ITSM tool.
   * The CTA stays as the conversation; the ticket carries the SLA.
   */
  convertedTicketId?: string;
}

export type CornerMessageKind = 'comment' | 'decision' | 'system';

export interface CornerMessage {
  id: string;
  authorId: string;
  body: string;
  /** ISO 8601. */
  postedAt: string;
  /** Stakeholder ids mentioned with @. */
  mentions: string[];
  kind: CornerMessageKind;
}

export interface CornerThread {
  id: string;
  type: CornerThreadType;
  title: string;
  topic: CornerTopic;
  forum: CornerForum;
  /** Ticket threads only — an INC / SR id from the operational data set. */
  ticketId?: string;
  /** CTA threads only. */
  cta?: CornerCTA;
  openedById: string;
  openedAt: string;
  status: 'Open' | 'Resolved';
  resolvedAt?: string;
  resolvedById?: string;
  participantIds: string[];
  messages: CornerMessage[];
}

const msg = (
  id: string,
  authorId: string,
  postedAt: string,
  body: string,
  mentions: string[] = [],
  kind: CornerMessageKind = 'comment',
): CornerMessage => ({ id, authorId, postedAt, body, mentions, kind });

/** Seeded conversations — authored demonstration content. */
export const cornerThreads: CornerThread[] = [
  {
    id: 'CC-1001',
    type: 'Ticket',
    title: 'Month-end close blocked — need a written restoration summary for Finance',
    topic: 'Ticket Update',
    forum: 'Daily Ops Stand-Up',
    ticketId: 'INC10001',
    openedById: 'CMP-03',
    openedAt: '2026-08-26T06:42:00.000Z',
    status: 'Resolved',
    resolvedAt: '2026-08-26T12:05:00.000Z',
    resolvedById: 'CMP-03',
    participantIds: ['CMP-03', 'CTR-03', 'CTR-01', 'CMP-01'],
    messages: [
      msg('CC-1001-M1', 'CMP-03', '2026-08-26T06:42:00.000Z', 'Finance needs a plain-language summary of what happened on the settlement run before we can sign off the close. The ticket notes are too technical to circulate to the business.', ['CTR-03']),
      msg('CC-1001-M2', 'CTR-03', '2026-08-26T07:15:00.000Z', 'Understood. Short version: the HANA index server ran out of memory during the FI settlement run and terminated. We restarted the index server, rebalanced the workload class ceiling for batch users, and re-ran the settlement in a controlled window. No financial documents were lost — the run was restarted from the last committed step.', ['CMP-03']),
      msg('CC-1001-M3', 'CMP-03', '2026-08-26T08:02:00.000Z', 'That works. Can we get the same wording added to the RCA so I do not have to re-explain it at the MSR?', ['CTR-01']),
      msg('CC-1001-M4', 'CTR-01', '2026-08-26T08:40:00.000Z', 'Added to the RCA narrative section. The permanent fix — package-size cursors on the custom settlement report — is tracked separately and will be tabled at the Monthly Service Review with the other closed RCAs.', ['CMP-03', 'CMP-01']),
      msg('CC-1001-M5', 'CMP-03', '2026-08-26T12:05:00.000Z', 'Thank you. Closing this off from our side.', [], 'decision'),
    ],
  },
  {
    id: 'CC-1002',
    type: 'Ticket',
    title: 'CPI outage — which interfaces need business reconciliation?',
    topic: 'Escalation',
    forum: 'Weekly Operational Review',
    ticketId: 'INC10002',
    openedById: 'CMP-01',
    openedAt: '2026-08-27T05:20:00.000Z',
    status: 'Open',
    participantIds: ['CMP-01', 'CTR-04', 'CMP-04', 'TPY-01'],
    messages: [
      msg('CC-1002-M1', 'CMP-01', '2026-08-27T05:20:00.000Z', 'During the tenant outage, which outbound interfaces dropped messages that the business now has to reconcile manually? I need this list for the operational review, not a technical dump.', ['CTR-04']),
      msg('CC-1002-M2', 'CTR-04', '2026-08-27T06:05:00.000Z', 'Three iFlows held messages in the retry queue and re-delivered automatically once the tenant came back. One — the supplier confirmation flow to Ariba — exceeded its retry window and needs a manual replay. I am preparing the replay list now.', ['CMP-01', 'CMP-04']),
      msg('CC-1002-M3', 'CMP-04', '2026-08-27T06:48:00.000Z', 'Procurement can absorb a manual replay if we get it before the Thursday cut-off. After that it lands in next week and I will have supplier queries.', ['CTR-04']),
      msg('CC-1002-M4', 'TPY-01', '2026-08-27T09:30:00.000Z', 'SAP has confirmed the tenant-side root cause and released a note. Reference shared in the incident record — no action required from COMPANY.', []),
      msg('CC-1002-M5', 'CTR-04', '2026-08-28T04:55:00.000Z', 'Replay list is ready — 214 messages across the supplier confirmation flow. Requesting a 30-minute window Thursday morning. Confirming here so the decision is visible, and the change itself will go through the normal change record.', ['CMP-04', 'CMP-01']),
    ],
  },
  {
    id: 'CC-1003',
    type: 'CTA',
    title: 'Agree a single definition of "restored" for payroll-impacting incidents',
    topic: 'SLA Clarification',
    forum: 'Monthly Service Review',
    cta: { ref: 'CTA-014', ownerId: 'CMP-02', dueDate: '2026-09-10', status: 'In Progress', priority: 'High' },
    openedById: 'CMP-02',
    openedAt: '2026-08-24T07:10:00.000Z',
    status: 'Open',
    participantIds: ['CMP-02', 'CTR-01', 'CTR-05', 'CMP-05'],
    messages: [
      msg('CC-1003-M1', 'CMP-02', '2026-08-24T07:10:00.000Z', 'We keep having the same argument at the service review: AMS marks a payroll incident restored when replication resumes, HR considers it restored when the affected payroll run completes cleanly. We should settle this in writing before the next MSR.', ['CTR-01', 'CMP-05']),
      msg('CC-1003-M2', 'CTR-01', '2026-08-24T09:25:00.000Z', 'Agreed that it needs settling. Our measurement follows service restoration, which is distinct from RCA closure — but "the payroll run completes" is a business outcome that can sit hours after restoration through no fault of either side. Proposing we document both points and report them separately rather than merge them.', ['CMP-02']),
      msg('CC-1003-M3', 'CMP-05', '2026-08-25T05:40:00.000Z', 'From HR the only thing that matters operationally is whether the run lands before the bank file cut-off. Reporting both points works for us as long as the second one is actually reported.', []),
      msg('CC-1003-M4', 'CTR-05', '2026-08-25T11:15:00.000Z', 'We can report the second point — replication resume time and payroll run completion are both timestamped on our side, so it is a reporting change, not a measurement change.', ['CMP-02']),
      msg('CC-1003-M5', 'CMP-02', '2026-08-28T06:30:00.000Z', 'Good. I will draft the two-point wording and circulate before the MSR. Keeping this CTA open until the wording is signed off by both sides.', ['CTR-01'], 'decision'),
    ],
  },
  {
    id: 'CC-1004',
    type: 'Ticket',
    title: 'Ariba sourcing event — is this ours or the supplier network side?',
    topic: 'Ticket Update',
    forum: 'Not tabled',
    ticketId: 'INC10005',
    openedById: 'CMP-04',
    openedAt: '2026-08-28T06:15:00.000Z',
    status: 'Open',
    participantIds: ['CMP-04', 'CTR-06'],
    messages: [
      msg('CC-1004-M1', 'CMP-04', '2026-08-28T06:15:00.000Z', 'Category team says the event will not publish to the supplier network. Before I chase suppliers, can you confirm whether the failure is on our configuration or on the network side?', ['CTR-06']),
      msg('CC-1004-M2', 'CTR-06', '2026-08-28T07:05:00.000Z', 'Looking now. Early read is a validation failure on one supplier record rather than a network outage — the event is rejecting rather than timing out. Will confirm within the hour and update the ticket.', ['CMP-04']),
      msg('CC-1004-M3', 'CTR-06', '2026-08-28T08:20:00.000Z', 'Confirmed: one supplier record is missing a required tax classification, which rejects the whole event. Fixing the record clears it. That is a master data correction, not a platform fault — happy to walk your category team through it.', ['CMP-04']),
    ],
  },
  {
    id: 'CC-1005',
    type: 'CTA',
    title: 'Standing 30-minute Thursday replay window for held integration messages',
    topic: 'Change Coordination',
    forum: 'Weekly Operational Review',
    cta: { ref: 'CTA-015', ownerId: 'CTR-04', dueDate: '2026-09-04', status: 'Open', priority: 'Medium' },
    openedById: 'CTR-04',
    openedAt: '2026-08-28T05:00:00.000Z',
    status: 'Open',
    participantIds: ['CTR-04', 'CMP-04', 'CMP-01'],
    messages: [
      msg('CC-1005-M1', 'CTR-04', '2026-08-28T05:00:00.000Z', 'Every held-message replay currently needs its own ad-hoc approval, which costs us a day. Proposing a standing 30-minute Thursday window for replays of already-approved interface types, with the individual replays still recorded as changes.', ['CMP-04', 'CMP-01']),
      msg('CC-1005-M2', 'CMP-04', '2026-08-28T09:12:00.000Z', 'Supportive in principle. Procurement would want the window before 10:00 so any supplier follow-up still lands the same day.', []),
      msg('CC-1005-M3', 'CMP-01', '2026-08-29T04:35:00.000Z', 'No objection from ERP Solutions provided the standing window does not become a route around change approval for anything new. Bring the proposal to the weekly review with the list of interface types it would cover.', ['CTR-04']),
    ],
  },
  {
    id: 'CC-1006',
    type: 'CTA',
    title: 'Quarterly access review evidence pack — agree the format once',
    topic: 'Access & Authorisation',
    forum: 'Quarterly Steering Committee',
    cta: { ref: 'CTA-016', ownerId: 'CTR-07', dueDate: '2026-08-21', status: 'In Progress', priority: 'High' },
    openedById: 'CMP-02',
    openedAt: '2026-08-18T06:00:00.000Z',
    status: 'Open',
    participantIds: ['CMP-02', 'CTR-07', 'CMP-06'],
    messages: [
      msg('CC-1006-M1', 'CMP-02', '2026-08-18T06:00:00.000Z', 'Internal audit rejected the last access review pack because the evidence was spread across three exports with different date ranges. Can we agree one format and reuse it every quarter?', ['CTR-07']),
      msg('CC-1006-M2', 'CTR-07', '2026-08-19T07:30:00.000Z', 'Yes. Proposing a single pack: role assignment extract, exceptions with justification, and sign-off sheet — all cut on the same date. Draft going to you this week.', ['CMP-02']),
      msg('CC-1006-M3', 'CMP-06', '2026-08-20T05:15:00.000Z', 'Include the privileged account list from our side so audit sees one view rather than two. I will supply it in the same format.', []),
      msg('CC-1006-M4', 'CMP-02', '2026-08-27T10:40:00.000Z', 'Draft received but not yet reviewed by audit — this CTA is now past its due date. Not blocked on AMS; blocked on our audit slot.', [], 'decision'),
    ],
  },
  {
    id: 'CC-1007',
    type: 'Ticket',
    title: 'Fiori launchpad tiles — plant maintenance team still reporting failures',
    topic: 'Ticket Update',
    forum: 'Daily Ops Stand-Up',
    ticketId: 'INC10006',
    openedById: 'CMP-01',
    openedAt: '2026-08-29T04:10:00.000Z',
    status: 'Open',
    participantIds: ['CMP-01', 'CTR-08', 'CTR-03'],
    messages: [
      msg('CC-1007-M1', 'CMP-01', '2026-08-29T04:10:00.000Z', 'The ticket shows progress but the plant maintenance supervisors are still seeing tiles fail this morning. Is the fix partially applied?', ['CTR-08']),
      msg('CC-1007-M2', 'CTR-08', '2026-08-29T04:52:00.000Z', 'The catalogue assignment was corrected for the maintenance planner role but not the supervisor role — that second one is in progress. Supervisors will keep seeing failures until it lands.', ['CMP-01']),
      msg('CC-1007-M3', 'CTR-03', '2026-08-29T05:30:00.000Z', 'Adding for visibility: the supervisor role change needs a transport, so it follows the release calendar rather than going straight to production.', ['CMP-01']),
    ],
  },
  {
    id: 'CC-1008',
    type: 'CTA',
    title: 'Shift-left: publish the top five superuser questions as self-service articles',
    topic: 'Improvement Idea',
    forum: 'Monthly Service Review',
    cta: { ref: 'CTA-017', ownerId: 'CTR-02', dueDate: '2026-09-30', status: 'Open', priority: 'Low' },
    openedById: 'CTR-02',
    openedAt: '2026-08-25T08:00:00.000Z',
    status: 'Open',
    participantIds: ['CTR-02', 'CMP-03', 'CMP-05'],
    messages: [
      msg('CC-1008-M1', 'CTR-02', '2026-08-25T08:00:00.000Z', 'Five question types account for a large share of what reaches us as tickets and could be answered by the superusers directly. Proposing we publish them as knowledge articles and measure the deflection at the service review.', ['CMP-03', 'CMP-05']),
      msg('CC-1008-M2', 'CMP-03', '2026-08-26T05:20:00.000Z', 'Finance is happy to review the two that relate to FI postings before they are published. We would rather correct the wording than have the business follow an article that is nearly right.', []),
    ],
  },
];

// ─── ID HELPERS ──────────────────────────────────────────────────────────────

const numericSuffix = (id: string): number => {
  const match = id.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
};

export const nextThreadId = (existing: CornerThread[]): string =>
  `CC-${Math.max(1000, ...existing.map((t) => numericSuffix(t.id))) + 1}`;

export const nextCtaRef = (existing: CornerThread[]): string => {
  const refs = existing.filter((t) => t.cta).map((t) => numericSuffix(t.cta!.ref));
  return `CTA-${String(Math.max(13, ...refs) + 1).padStart(3, '0')}`;
};

export const nextMessageId = (thread: CornerThread): string =>
  `${thread.id}-M${thread.messages.length + 1}`;

// ─── DERIVED VIEWS ───────────────────────────────────────────────────────────

export const lastActivityAt = (thread: CornerThread): string =>
  thread.messages.length ? thread.messages[thread.messages.length - 1].postedAt : thread.openedAt;

/**
 * Which side spoke last. Used to show who a thread is effectively waiting on —
 * a collaboration cue only, with no bearing on any SLA measurement (§10.1).
 */
export const waitingOn = (thread: CornerThread): StakeholderSide | null => {
  if (thread.status === 'Resolved' || !thread.messages.length) return null;
  const lastAuthor = stakeholderById(thread.messages[thread.messages.length - 1].authorId);
  if (!lastAuthor) return null;
  if (lastAuthor.side === 'COMPANY') return 'CONTRACTOR';
  if (lastAuthor.side === 'CONTRACTOR') return 'COMPANY';
  return null;
};

/** CTA past its due date and not closed. */
export const isCtaOverdue = (thread: CornerThread, today = new Date()): boolean => {
  if (!thread.cta || thread.cta.status === 'Closed') return false;
  return new Date(thread.cta.dueDate) < new Date(today.toISOString().slice(0, 10));
};
