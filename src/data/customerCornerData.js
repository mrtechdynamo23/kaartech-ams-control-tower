/**
 * EDGE AMS Control Tower — Customer Corner Data Model
 *
 * Stakeholder collaboration channel adapted from NOC functional reference.
 * All personas, conversations, and references use EDGE context and data.
 *
 * EDGE Customer Corner is a collaboration workspace — not a system of record.
 * It does not create, update, or close tickets, and it never starts, pauses,
 * or stops an SLA clock.
 */

import { incidents, serviceRequests } from './demoData';

// ─── STAKEHOLDER SIDES ──────────────────────────────────────────────────────

/**
 * Which contracting side a participant speaks for.
 * EDGE = client organisation
 * AMS  = AMS contractor / service provider
 * THIRD PARTY = vendor / OEM / partner
 */
export const STAKEHOLDER_SIDES = ['EDGE', 'AMS', 'THIRD PARTY'];

export const SIDE_META = {
  EDGE:          { label: 'Enterprise (Client)', short: 'Enterprise', bg: 'rgba(37, 99, 235, 0.14)', color: '#93C5FD', border: 'rgba(59, 130, 246, 0.28)' },
  AMS:           { label: 'KaarTech AMS',        short: 'KaarTech',   bg: 'rgba(16, 185, 129, 0.12)', color: '#6EE7B7', border: 'rgba(16, 185, 129, 0.25)' },
  'THIRD PARTY': { label: 'Third Party',         short: 'THIRD PARTY', bg: 'rgba(156, 163, 175, 0.12)', color: '#D1D5DB', border: 'rgba(156, 163, 175, 0.25)' },
};

// ─── STAKEHOLDERS ────────────────────────────────────────────────────────────

export const cornerStakeholders = [
  // Enterprise — Client stakeholders
  { id: 'EDGE-01', name: 'Khalid Al Hashimi',    title: 'ERP Solutions Lead',                          org: 'Enterprise Corp.',            side: 'EDGE',        escalationTier: 'Enterprise Solutions' },
  { id: 'EDGE-02', name: 'Fatima Al Zaabi',       title: 'Governance & Compliance Manager',             org: 'Enterprise Corp.',            side: 'EDGE',        escalationTier: null },
  { id: 'EDGE-03', name: 'Noura Al Shamsi',       title: 'Finance Business Superuser (S/4 FI)',         org: 'Enterprise Business Services', side: 'EDGE',       escalationTier: null },
  { id: 'EDGE-04', name: 'Abdulrahman Darwish',   title: 'Supply Chain Business Superuser (Ariba/VIM)', org: 'Enterprise Commercial',        side: 'EDGE',       escalationTier: null },
  { id: 'EDGE-05', name: 'Layla Al Qassimi',      title: 'HR Business Superuser (SuccessFactors)',      org: 'Enterprise Corp.',            side: 'EDGE',        escalationTier: null },
  { id: 'EDGE-06', name: 'Tariq Al Dhaheri',      title: 'Infrastructure & Security Coordinator',       org: 'Enterprise Technologies',     side: 'EDGE',        escalationTier: null },

  // AMS — KaarTech stakeholders
  { id: 'AMS-01',  name: 'Sara Al Marzouqi',      title: 'AMS Service Delivery Manager',                org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Service Delivery Manager' },
  { id: 'AMS-02',  name: 'Priya Nair',            title: 'AMS Service Manager',                         org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'AMS Service Manager' },
  { id: 'AMS-03',  name: 'Omar Bashar',           title: 'Basis & Platform Lead',                       org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Domain Lead' },
  { id: 'AMS-04',  name: 'Rakesh Kumar',          title: 'Integration (CPI) Lead',                      org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Domain Lead' },
  { id: 'AMS-05',  name: 'Meera Nambiar',         title: 'SuccessFactors Lead',                         org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Domain Lead' },
  { id: 'AMS-06',  name: 'Ravi Shankar',          title: 'Ariba & VIM Lead',                            org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Domain Lead' },
  { id: 'AMS-07',  name: 'Deepak Kumar',          title: 'Security & GRC Lead',                         org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Domain Lead' },
  { id: 'AMS-08',  name: 'Arjun Menon',           title: 'Functional Analyst — S/4 Finance',            org: 'KaarTech AMS',          side: 'AMS',         escalationTier: 'Analyst' },

  // THIRD PARTY — vendors and product support
  { id: 'TPY-01',  name: 'SAP Product Support',   title: 'OSS incident channel',                        org: 'SAP',                   side: 'THIRD PARTY', escalationTier: null },
  { id: 'TPY-02',  name: 'OpenText VIM Support',  title: 'Vendor invoice management support',            org: 'OpenText',              side: 'THIRD PARTY', escalationTier: null },
  { id: 'TPY-03',  name: 'SI Programme Partner',  title: 'Process transformation partner',               org: 'SI Partner',            side: 'THIRD PARTY', escalationTier: null },
];

export const stakeholderById = (id) =>
  cornerStakeholders.find((s) => s.id === id);

export const stakeholderName = (id) => stakeholderById(id)?.name ?? id;

// ─── TOPICS & FORUMS ────────────────────────────────────────────────────────

export const CORNER_TOPICS = [
  'Ticket Update',
  'SLA Clarification',
  'Change Coordination',
  'Access & Authorisation',
  'Master Data',
  'Release & Transport',
  'Improvement Idea',
  'Escalation',
];

/** Governance forums the thread is tabled at. */
export const CORNER_FORUMS = [
  'Daily Ops Stand-Up',
  'Weekly Operational Review',
  'Monthly Service Review',
  'Quarterly Steering Committee',
  'Not Tabled',
];

// ─── ID HELPERS ──────────────────────────────────────────────────────────────

const numericSuffix = (id) => {
  const match = id.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
};

export const nextThreadId = (existing) =>
  `CC-${Math.max(1000, ...existing.map((t) => numericSuffix(t.id))) + 1}`;

export const nextCtaRef = (existing) => {
  const refs = existing.filter((t) => t.cta).map((t) => numericSuffix(t.cta.ref));
  return `CTA-${String(Math.max(13, ...refs) + 1).padStart(3, '0')}`;
};

export const nextMessageId = (thread) =>
  `${thread.id}-M${thread.messages.length + 1}`;

// ─── DERIVED VIEWS ───────────────────────────────────────────────────────────

export const lastActivityAt = (thread) =>
  thread.messages.length ? thread.messages[thread.messages.length - 1].postedAt : thread.openedAt;

/**
 * Which side spoke last — a collaboration cue only,
 * with no bearing on any SLA measurement.
 */
export const waitingOn = (thread) => {
  if (thread.status === 'Resolved' || !thread.messages.length) return null;
  const lastAuthor = stakeholderById(thread.messages[thread.messages.length - 1].authorId);
  if (!lastAuthor) return null;
  if (lastAuthor.side === 'EDGE') return 'AMS';
  if (lastAuthor.side === 'AMS') return 'EDGE';
  return null;
};

/** CTA past its due date and not closed. */
export const isCtaOverdue = (thread, today = new Date()) => {
  if (!thread.cta || thread.cta.status === 'Closed') return false;
  return new Date(thread.cta.dueDate) < new Date(today.toISOString().slice(0, 10));
};

// ─── TICKET REFERENCE BUILDER ────────────────────────────────────────────────

/** Builds a unified ticket reference list from EDGE incidents + service requests. */
export const buildTicketRefs = () => [
  ...incidents.map((i) => ({
    id: i.id,
    kind: 'Incident',
    title: i.shortDescription,
    status: i.status,
    classification: i.priority,
    priority: i.priority,
    owner: i.assignedTo || i.raisedBy,
    service: i.application || i.businessDomain,
  })),
  ...serviceRequests.map((r) => ({
    id: r.id,
    kind: 'Service Request',
    title: r.shortDescription || r.category,
    status: r.status,
    classification: r.srType,
    priority: r.priority || 'P3',
    owner: r.assignedTo,
    service: r.application || r.businessDomain,
  })),
];

// ─── SEED MESSAGE HELPER ─────────────────────────────────────────────────────

const msg = (id, authorId, postedAt, body, mentions = [], kind = 'comment') =>
  ({ id, authorId, postedAt, body, mentions, kind });

// ─── SEED THREADS ────────────────────────────────────────────────────────────
// References real EDGE INC-XXXXX and SR-XXXXX IDs from demoData.

export const seedCornerThreads = [
  {
    id: 'CC-1001',
    type: 'Ticket',
    title: 'Period-end close blocked — need a written restoration summary for Finance',
    topic: 'Ticket Update',
    forum: 'Daily Ops Stand-Up',
    ticketId: 'INC-00001',
    openedById: 'EDGE-03',
    openedAt: '2026-08-26T06:42:00.000Z',
    status: 'Resolved',
    resolvedAt: '2026-08-26T12:05:00.000Z',
    resolvedById: 'EDGE-03',
    participantIds: ['EDGE-03', 'AMS-03', 'AMS-01', 'EDGE-01'],
    messages: [
      msg('CC-1001-M1', 'EDGE-03', '2026-08-26T06:42:00.000Z', 'Finance needs a plain-language summary of what happened on the settlement run before we can sign off the close. The incident notes are too technical to circulate to the business. @Omar Bashar', ['AMS-03']),
      msg('CC-1001-M2', 'AMS-03', '2026-08-26T07:15:00.000Z', 'Understood. Short version: the HANA index server ran out of memory during the FI settlement run and terminated. We restarted the index server, rebalanced the workload class ceiling for batch users, and re-ran the settlement in a controlled window. No financial documents were lost — the run was restarted from the last committed step. @Noura Al Shamsi', ['EDGE-03']),
      msg('CC-1001-M3', 'EDGE-03', '2026-08-26T08:02:00.000Z', 'That works. Can we get the same wording added to the RCA so I do not have to re-explain it at the MSR? @Sara Al Marzouqi', ['AMS-01']),
      msg('CC-1001-M4', 'AMS-01', '2026-08-26T08:40:00.000Z', 'Added to the RCA narrative section. The permanent fix — package-size cursors on the custom settlement report — is tracked separately and will be tabled at the Monthly Service Review with the other closed RCAs. @Noura Al Shamsi @Khalid Al Hashimi', ['EDGE-03', 'EDGE-01']),
      msg('CC-1001-M5', 'EDGE-03', '2026-08-26T12:05:00.000Z', 'Thank you. Closing this off from our side.', [], 'decision'),
    ],
  },
  {
    id: 'CC-1002',
    type: 'Ticket',
    title: 'CPI outage — which interfaces need business reconciliation?',
    topic: 'Escalation',
    forum: 'Weekly Operational Review',
    ticketId: 'INC-00002',
    openedById: 'EDGE-01',
    openedAt: '2026-08-27T05:20:00.000Z',
    status: 'Open',
    participantIds: ['EDGE-01', 'AMS-04', 'EDGE-04', 'TPY-01'],
    messages: [
      msg('CC-1002-M1', 'EDGE-01', '2026-08-27T05:20:00.000Z', 'During the tenant outage, which outbound interfaces dropped messages that the business now has to reconcile manually? I need this list for the operational review, not a technical dump. @Rakesh Kumar', ['AMS-04']),
      msg('CC-1002-M2', 'AMS-04', '2026-08-27T06:05:00.000Z', 'Three iFlows held messages in the retry queue and re-delivered automatically once the tenant came back. One — the supplier confirmation flow to Ariba — exceeded its retry window and needs a manual replay. I am preparing the replay list now. @Khalid Al Hashimi @Abdulrahman Darwish', ['EDGE-01', 'EDGE-04']),
      msg('CC-1002-M3', 'EDGE-04', '2026-08-27T06:48:00.000Z', 'Procurement can absorb a manual replay if we get it before the Thursday cut-off. After that it lands in next week and I will have supplier queries. @Rakesh Kumar', ['AMS-04']),
      msg('CC-1002-M4', 'TPY-01', '2026-08-27T09:30:00.000Z', 'SAP has confirmed the tenant-side root cause and released a note. Reference shared in the incident record — no action required from EDGE.', []),
      msg('CC-1002-M5', 'AMS-04', '2026-08-28T04:55:00.000Z', 'Replay list is ready — 214 messages across the supplier confirmation flow. Requesting a 30-minute window Thursday morning. Confirming here so the decision is visible, and the change itself will go through the normal change record. @Abdulrahman Darwish @Khalid Al Hashimi', ['EDGE-04', 'EDGE-01']),
    ],
  },
  {
    id: 'CC-1003',
    type: 'CTA',
    title: 'Agree a single definition of "restored" for payroll-impacting incidents',
    topic: 'SLA Clarification',
    forum: 'Monthly Service Review',
    cta: { ref: 'CTA-014', ownerId: 'EDGE-02', dueDate: '2026-09-10', status: 'In Progress', priority: 'High' },
    openedById: 'EDGE-02',
    openedAt: '2026-08-24T07:10:00.000Z',
    status: 'Open',
    participantIds: ['EDGE-02', 'AMS-01', 'AMS-05', 'EDGE-05'],
    messages: [
      msg('CC-1003-M1', 'EDGE-02', '2026-08-24T07:10:00.000Z', 'We keep having the same argument at the service review: AMS marks a payroll incident restored when replication resumes, HR considers it restored when the affected payroll run completes cleanly. We should settle this in writing before the next MSR. @Sara Al Marzouqi @Layla Al Qassimi', ['AMS-01', 'EDGE-05']),
      msg('CC-1003-M2', 'AMS-01', '2026-08-24T09:25:00.000Z', 'Agreed that it needs settling. Our measurement follows service restoration, which is distinct from RCA closure — but "the payroll run completes" is a business outcome that can sit hours after restoration through no fault of either side. Proposing we document both points and report them separately rather than merge them. @Fatima Al Zaabi', ['EDGE-02']),
      msg('CC-1003-M3', 'EDGE-05', '2026-08-25T05:40:00.000Z', 'From HR the only thing that matters operationally is whether the run lands before the bank file cut-off. Reporting both points works for us as long as the second one is actually reported.', []),
      msg('CC-1003-M4', 'AMS-05', '2026-08-25T11:15:00.000Z', 'We can report the second point — replication resume time and payroll run completion are both timestamped on our side, so it is a reporting change, not a measurement change. @Fatima Al Zaabi', ['EDGE-02']),
      msg('CC-1003-M5', 'EDGE-02', '2026-08-28T06:30:00.000Z', 'Good. I will draft the two-point wording and circulate before the MSR. Keeping this CTA open until the wording is signed off by both sides. @Sara Al Marzouqi', ['AMS-01'], 'decision'),
    ],
  },
  {
    id: 'CC-1004',
    type: 'Ticket',
    title: 'Ariba sourcing event — is this ours or the supplier network side?',
    topic: 'Ticket Update',
    forum: 'Not Tabled',
    ticketId: 'INC-00005',
    openedById: 'EDGE-04',
    openedAt: '2026-08-28T06:15:00.000Z',
    status: 'Open',
    participantIds: ['EDGE-04', 'AMS-06'],
    messages: [
      msg('CC-1004-M1', 'EDGE-04', '2026-08-28T06:15:00.000Z', 'Category team says the event will not publish to the supplier network. Before I chase suppliers, can you confirm whether the failure is on our configuration or on the network side? @Ravi Shankar', ['AMS-06']),
      msg('CC-1004-M2', 'AMS-06', '2026-08-28T07:05:00.000Z', 'Looking now. Early read is a validation failure on one supplier record rather than a network outage — the event is rejecting rather than timing out. Will confirm within the hour and update the ticket. @Abdulrahman Darwish', ['EDGE-04']),
      msg('CC-1004-M3', 'AMS-06', '2026-08-28T08:20:00.000Z', 'Confirmed: one supplier record is missing a required tax classification, which rejects the whole event. Fixing the record clears it. That is a master data correction, not a platform fault — happy to walk your category team through it. @Abdulrahman Darwish', ['EDGE-04']),
    ],
  },
  {
    id: 'CC-1005',
    type: 'CTA',
    title: 'Standing 30-minute Thursday replay window for held integration messages',
    topic: 'Change Coordination',
    forum: 'Weekly Operational Review',
    cta: { ref: 'CTA-015', ownerId: 'AMS-04', dueDate: '2026-09-04', status: 'Open', priority: 'Medium' },
    openedById: 'AMS-04',
    openedAt: '2026-08-28T05:00:00.000Z',
    status: 'Open',
    participantIds: ['AMS-04', 'EDGE-04', 'EDGE-01'],
    messages: [
      msg('CC-1005-M1', 'AMS-04', '2026-08-28T05:00:00.000Z', 'Every held-message replay currently needs its own ad-hoc approval, which costs us a day. Proposing a standing 30-minute Thursday window for replays of already-approved interface types, with the individual replays still recorded as changes. @Abdulrahman Darwish @Khalid Al Hashimi', ['EDGE-04', 'EDGE-01']),
      msg('CC-1005-M2', 'EDGE-04', '2026-08-28T09:12:00.000Z', 'Supportive in principle. Procurement would want the window before 10:00 so any supplier follow-up still lands the same day.', []),
      msg('CC-1005-M3', 'EDGE-01', '2026-08-29T04:35:00.000Z', 'No objection from EDGE Solutions provided the standing window does not become a route around change approval for anything new. Bring the proposal to the weekly review with the list of interface types it would cover. @Rakesh Kumar', ['AMS-04']),
    ],
  },
  {
    id: 'CC-1006',
    type: 'CTA',
    title: 'Quarterly access review evidence pack — agree the format once',
    topic: 'Access & Authorisation',
    forum: 'Quarterly Steering Committee',
    cta: { ref: 'CTA-016', ownerId: 'AMS-07', dueDate: '2026-08-21', status: 'In Progress', priority: 'High' },
    openedById: 'EDGE-02',
    openedAt: '2026-08-18T06:00:00.000Z',
    status: 'Open',
    participantIds: ['EDGE-02', 'AMS-07', 'EDGE-06'],
    messages: [
      msg('CC-1006-M1', 'EDGE-02', '2026-08-18T06:00:00.000Z', 'Internal audit rejected the last access review pack because the evidence was spread across three exports with different date ranges. Can we agree one format and reuse it every quarter? @Deepak Kumar', ['AMS-07']),
      msg('CC-1006-M2', 'AMS-07', '2026-08-19T07:30:00.000Z', 'Yes. Proposing a single pack: role assignment extract, exceptions with justification, and sign-off sheet — all cut on the same date. Draft going to you this week. @Fatima Al Zaabi', ['EDGE-02']),
      msg('CC-1006-M3', 'EDGE-06', '2026-08-20T05:15:00.000Z', 'Include the privileged account list from our side so audit sees one view rather than two. I will supply it in the same format.', []),
      msg('CC-1006-M4', 'EDGE-02', '2026-08-27T10:40:00.000Z', 'Draft received but not yet reviewed by audit — this CTA is now past its due date. Not blocked on AMS; blocked on our audit slot.', [], 'decision'),
    ],
  },
  {
    id: 'CC-1007',
    type: 'Ticket',
    title: 'Fiori launchpad tiles — plant maintenance team still reporting failures',
    topic: 'Ticket Update',
    forum: 'Daily Ops Stand-Up',
    ticketId: 'INC-00006',
    openedById: 'EDGE-01',
    openedAt: '2026-08-29T04:10:00.000Z',
    status: 'Open',
    participantIds: ['EDGE-01', 'AMS-08', 'AMS-03'],
    messages: [
      msg('CC-1007-M1', 'EDGE-01', '2026-08-29T04:10:00.000Z', 'The ticket shows progress but the plant maintenance supervisors are still seeing tiles fail this morning. Is the fix partially applied? @Arjun Menon', ['AMS-08']),
      msg('CC-1007-M2', 'AMS-08', '2026-08-29T04:52:00.000Z', 'The catalogue assignment was corrected for the maintenance planner role but not the supervisor role — that second one is in progress. Supervisors will keep seeing failures until it lands. @Khalid Al Hashimi', ['EDGE-01']),
      msg('CC-1007-M3', 'AMS-03', '2026-08-29T05:30:00.000Z', 'Adding for visibility: the supervisor role change needs a transport, so it follows the release calendar rather than going straight to production. @Khalid Al Hashimi', ['EDGE-01']),
    ],
  },
  {
    id: 'CC-1008',
    type: 'CTA',
    title: 'Shift-left: publish the top five superuser questions as self-service articles',
    topic: 'Improvement Idea',
    forum: 'Monthly Service Review',
    cta: { ref: 'CTA-017', ownerId: 'AMS-02', dueDate: '2026-09-30', status: 'Open', priority: 'Low' },
    openedById: 'AMS-02',
    openedAt: '2026-08-25T08:00:00.000Z',
    status: 'Open',
    participantIds: ['AMS-02', 'EDGE-03', 'EDGE-05'],
    messages: [
      msg('CC-1008-M1', 'AMS-02', '2026-08-25T08:00:00.000Z', 'Five question types account for a large share of what reaches us as tickets and could be answered by the superusers directly. Proposing we publish them as knowledge articles and measure the deflection at the service review. @Noura Al Shamsi @Layla Al Qassimi', ['EDGE-03', 'EDGE-05']),
      msg('CC-1008-M2', 'EDGE-03', '2026-08-26T05:20:00.000Z', 'Finance is happy to review the two that relate to FI postings before they are published. We would rather correct the wording than have the business follow an article that is nearly right.', []),
    ],
  },
];
