/**
 * EDGE AMS Control Tower — Organization Data & Hierarchy Engine
 * 
 * Source of truth: EDGE Resource Master (RESOURCES) in demoData.js
 * and Business Domains & Tracks in masterData.js.
 * 
 * Provides:
 * - Structured 4-tier organization tree:
 *   Tier 1: AMS Leadership / SteerCom
 *   Tier 2: Business Domains / Functional Streams (L2C, E2M, P2P, D2S, S2P, A2D, R2R, H2R)
 *   Tier 3: Capability / Delivery Teams (Process Groups)
 *   Tier 4: Specialized Resources
 * - Normalized reporting relationships (who reports to whom, direct reports)
 * - Hierarchy metrics (counts, onsite/offshore, tracks, allocation)
 * - Search & Filter path ancestry solver (keeps hierarchy visible)
 * - Recent organization restructuring & assignment changes
 */

import { RESOURCES } from './demoData';
import { BUSINESS_DOMAINS, TRACKS, ENTITIES } from './masterData';

// ── Leadership SteerCom ──
export const LEADERSHIP_STEERCOM = [
  {
    id: 'LEAD-01',
    name: 'Dr. Tariq Al Nuaimi',
    role: 'KaarTech AMS Program Director',
    entity: 'KaarTech Corporate HQ',
    focus: 'Strategic Alignment, SteerCom Governance & Service Level Agreements',
    tier: 'Executive',
    location: 'Onsite (Abu Dhabi HQ)',
    email: 'tariq.alnuaimi@kaartech.com',
    phone: '+971-2-XXX-0001',
    reportsTo: 'Enterprise SteerCom / CIO',
    status: 'Active',
  },
  {
    id: 'RES-002', // Links to actual resource in Master
    name: 'Fatima Al Zaabi',
    role: 'AMS Delivery Lead',
    entity: 'KaarTech Business Services',
    focus: 'Overall Operational Delivery, Cross-Domain Escalation & Service Performance',
    tier: 'Operations Command',
    location: 'Onsite',
    email: 'fatima.z@kaartech.com',
    phone: '+971-50-XXX-1002',
    reportsTo: 'Dr. Tariq Al Nuaimi',
    status: 'Active',
    positionId: 'POS-002',
    track: 'AMS-ON-RUN',
    businessDomain: 'R2R',
  },
  {
    id: 'RES-004', // Links to actual resource in Master
    name: 'Sara Al Marzouqi',
    role: 'Quality & Governance Lead',
    entity: 'KaarTech Technologies',
    focus: 'Audit, Risk Compliance, CAPA Verification & Continuous Improvement',
    tier: 'Quality & Governance',
    location: 'Onsite',
    email: 'sara.m@kaartech.com',
    phone: '+971-50-XXX-1004',
    reportsTo: 'Fatima Al Zaabi',
    status: 'Active',
    positionId: 'POS-004',
    track: 'AMS-ON-RUN',
    businessDomain: 'H2R',
  },
];

// ── Domain Lead Mappings (from EDGE resources) ──
export const DOMAIN_LEADS = {
  L2C: 'RES-001', // Khalid Al Hashimi
  E2M: 'RES-005', // Priya Nair
  P2P: 'RES-003', // Ravi Shankar
  D2S: 'RES-006', // Omar Bashar
  S2P: 'RES-008', // Noura Al Shamsi
  A2D: 'RES-015', // Tariq Al Dhaheri
  R2R: 'RES-002', // Fatima Al Zaabi (Overall Lead; Deepak Kumar RES-007 is domain co-lead)
  H2R: 'RES-004', // Sara Al Marzouqi
};

// ── Helper: Get Entity Object by ID ──
export function getEntityById(entityId) {
  return ENTITIES.find(e => e.id === entityId) || { id: entityId, name: 'Enterprise Entity', location: 'Abu Dhabi' };
}

// ── Helper: Get Resource by ID ──
export function getResourceById(resId) {
  return RESOURCES.find(r => r.id === resId) || null;
}

// ── Build Enriched Resource with Direct Reports & Computed Fields ──
export function getEnrichedResources() {
  const resourceMap = new Map();

  // Include LEAD-01 (SteerCom Program Director)
  const director = LEADERSHIP_STEERCOM[0];
  resourceMap.set('LEAD-01', {
    id: 'LEAD-01',
    positionId: 'POS-DIR-001',
    name: director.name,
    role: director.role,
    businessDomain: 'Executive',
    processGroup: 'SteerCom Governance',
    track: 'AMS-ON-RUN',
    allocation: 'Dedicated',
    nationality: 'UAE',
    location: 'Onsite',
    onboardingDate: '2025-06-01',
    reportingManager: null,
    status: 'Active',
    gender: 'Male',
    skill: 'Executive Leadership, SteerCom Governance, Defense IT Strategy',
    certification: 'PMP, ITIL v4 Master, TOGAF 9.2',
    phone: director.phone || '+971-2-XXX-0001',
    email: director.email || 'tariq.alnuaimi@kaartech.com',
    entity: 'ENT-001',
    entityObj: getEntityById('ENT-001'),
    directReports: ['RES-002'],
    managerInfo: { id: 'CIO', name: 'Enterprise CIO', role: 'Group CIO', businessDomain: 'Executive' },
  });

  RESOURCES.forEach(res => {
    resourceMap.set(res.id, {
      ...res,
      directReports: [],
      managerInfo: null,
      allocation: res.track === 'AMS-OF-Flex' ? 'Shared' : 'Dedicated',
      entityObj: getEntityById(res.entity),
    });
  });

  // Wire direct reports and manager info
  resourceMap.forEach(res => {
    if (res.reportingManager && resourceMap.has(res.reportingManager)) {
      const manager = resourceMap.get(res.reportingManager);
      manager.directReports.push(res.id);
      res.managerInfo = {
        id: manager.id,
        name: manager.name,
        role: manager.role,
        businessDomain: manager.businessDomain,
      };
    } else if (!res.reportingManager && res.id !== 'LEAD-01') {
      // Top delivery lead reports to Program Director
      res.managerInfo = {
        id: 'LEAD-01',
        name: 'Dr. Tariq Al Nuaimi',
        role: 'KaarTech AMS Program Director',
        businessDomain: 'Executive',
      };
    }
  });

  return Array.from(resourceMap.values());
}

// ── Organization Summary Metrics ──
export function getOrganizationMetrics() {
  const enriched = getEnrichedResources();
  const totalResources = enriched.length;
  const onsiteCount = enriched.filter(r => r.location === 'Onsite').length;
  const offshoreCount = enriched.filter(r => r.location === 'Offshore').length;
  const dedicatedCount = enriched.filter(r => r.allocation === 'Dedicated').length;
  const sharedFlexCount = enriched.filter(r => r.allocation === 'Shared').length;
  const uaeNationals = enriched.filter(r => r.nationality === 'UAE').length;

  // Managers/Leads: Delivery lead + domain leads + anyone with direct reports
  const managerIds = new Set(
    enriched.filter(r => r.directReports.length > 0 || Object.values(DOMAIN_LEADS).includes(r.id)).map(r => r.id)
  );

  // Teams: unique domain + processGroup combinations
  const teamsSet = new Set(enriched.map(r => `${r.businessDomain}::${r.processGroup}`));

  // Track breakdown
  const trackCounts = {};
  TRACKS.forEach(tr => {
    trackCounts[tr.key] = enriched.filter(r => r.track === tr.key).length;
  });

  return {
    totalResources,
    onsiteCount,
    offshoreCount,
    onsitePercentage: Math.round((onsiteCount / totalResources) * 100),
    offshorePercentage: Math.round((offshoreCount / totalResources) * 100),
    dedicatedCount,
    sharedFlexCount,
    totalManagers: managerIds.size + 1, // + Dr. Tariq Al Nuaimi
    managerIds: Array.from(managerIds),
    activeTeamsCount: teamsSet.size,
    totalDomainsCount: BUSINESS_DOMAINS.length,
    uaeNationals,
    emiratizationRate: Math.round((uaeNationals / totalResources) * 100),
    trackCounts,
  };
}

// ── Member Change History Mapping ──
/**
 * Tracks documented personnel and assignment movements per team/posting.
 * Connects directly with RECENT_ORGANIZATION_CHANGES governance log:
 * - E2M Production Planning: 3 member changes (Hassan Al Nuaimi onsite shift, Suresh Krishnan ENH track transition, Priya Nair lead rotation)
 * - E2M Quality Management: 2 member changes (Sultan Al Dhahiri QM onsite assignment [CHG-006], Ankit Patel flex pool mobilization [CHG-002])
 * - S2P Strategic Sourcing: 2 member changes (Nisha Varma enhancement sprint allocation [CHG-003], Noura Al Shamsi lead rotation)
 * - S2P Vendor Management: 1 member change (Aisha Khalfan onsite rotation at EDGE HQ [CHG-004])
 * - P2P Invoice Processing: 1 member change (Sunita Reddy dedicated sprint transition [CHG-003])
 * - R2R Financial Accounting: 1 member change (Fatima Al Zaabi operational command handover [CHG-001])
 * - All other teams: 0 member changes (badge hidden)
 */
export const TEAM_MEMBER_CHANGE_COUNTS = {
  'E2M::Production Planning': 3,
  'E2M::Quality Management': 2,
  'S2P::Strategic Sourcing': 2,
  'S2P::Vendor Management': 1,
  'P2P::Invoice Processing': 1,
  'R2R::Financial Accounting': 1,
};

export const RESOURCE_MEMBER_CHANGE_COUNTS = {
  'RES-005': 3, // Priya Nair (E2M Production Planning - 3 member changes)
  'RES-013': 2, // Hassan Al Nuaimi (E2M Production Planning)
  'RES-020': 1, // Suresh Krishnan (E2M)
  'RES-009': 2, // Ankit Patel (E2M Quality Management)
  'RES-027': 2, // Sultan Al Dhahiri (E2M Quality Management)
  'RES-008': 1, // Noura Al Shamsi (S2P Strategic Sourcing)
  'RES-026': 2, // Nisha Varma (S2P Strategic Sourcing)
  'RES-010': 1, // Aisha Khalfan (S2P Vendor Management)
  'RES-014': 1, // Sunita Reddy (P2P Invoice Processing)
  'RES-002': 1, // Fatima Al Zaabi (R2R Financial Accounting)
};

export function getMemberChangeCountForResource(resourceId) {
  const cleanId = String(resourceId || '').replace(/^res-/, '');
  return RESOURCE_MEMBER_CHANGE_COUNTS[cleanId] || 0;
}

export function getMemberChangeCountForTeam(domainKey, processGroupName) {
  const key = `${domainKey}::${processGroupName}`;
  return TEAM_MEMBER_CHANGE_COUNTS[key] || 0;
}

// ── Build Hierarchical Organization Tree ──
export function buildOrganizationTree() {
  const enrichedResources = getEnrichedResources();
  const metrics = getOrganizationMetrics();

  // Root Node: AMS Leadership / SteerCom
  const rootNode = {
    id: 'org-root',
    type: 'leadership',
    name: 'KaarTech AMS Leadership & SteerCom',
    director: LEADERSHIP_STEERCOM[0],
    deliveryLead: LEADERSHIP_STEERCOM[1],
    governanceLead: LEADERSHIP_STEERCOM[2],
    resourceCount: metrics.totalResources,
    memberChangeCount: 0,
    onsiteCount: metrics.onsiteCount,
    offshoreCount: metrics.offshoreCount,
    children: [],
  };

  // Tier 2: Business Domains
  BUSINESS_DOMAINS.forEach(domain => {
    const domainResources = enrichedResources.filter(r => r.businessDomain === domain.key);
    const domainLeadId = DOMAIN_LEADS[domain.key];
    const domainLead = enrichedResources.find(r => r.id === domainLeadId) || domainResources[0] || null;

    // Group resources by Process Group / Team
    const processGroupMap = new Map();
    domainResources.forEach(res => {
      const pgKey = res.processGroup;
      if (!processGroupMap.has(pgKey)) {
        processGroupMap.set(pgKey, []);
      }
      processGroupMap.get(pgKey).push(res);
    });

    const teams = [];
    processGroupMap.forEach((members, pgName) => {
      // Find team lead / primary manager for this process group
      const lead = members.find(m => m.directReports.length > 0 || m.id === domainLeadId) || members[0];
      const teamOnsite = members.filter(m => m.location === 'Onsite').length;
      const teamOffshore = members.filter(m => m.location === 'Offshore').length;
      const memberChangeCount = getMemberChangeCountForTeam(domain.key, pgName);

      const teamNode = {
        id: `team-${domain.key}-${pgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: 'team',
        name: pgName,
        domainKey: domain.key,
        domainName: domain.label,
        lead,
        resourceCount: members.length,
        memberChangeCount,
        onsiteCount: teamOnsite,
        offshoreCount: teamOffshore,
        tracks: Array.from(new Set(members.map(m => m.track))),
        members: members.map(m => ({
          id: `res-${m.id}`,
          rawId: m.id,
          type: 'resource',
          memberChangeCount: getMemberChangeCountForResource(m.id),
          data: m,
        })),
      };

      teams.push(teamNode);
    });

    const domainMemberChangeCount = teams.reduce((acc, t) => acc + (t.memberChangeCount || 0), 0);

    const domainNode = {
      id: `domain-${domain.key}`,
      type: 'domain',
      code: domain.key,
      name: domain.label,
      abbreviation: domain.abbreviation,
      lead: domainLead,
      resourceCount: domainResources.length,
      memberChangeCount: domainMemberChangeCount,
      onsiteCount: domainResources.filter(r => r.location === 'Onsite').length,
      offshoreCount: domainResources.filter(r => r.location === 'Offshore').length,
      teamCount: teams.length,
      children: teams,
    };

    rootNode.children.push(domainNode);
  });

  rootNode.memberChangeCount = rootNode.children.reduce((acc, d) => acc + (d.memberChangeCount || 0), 0);

  return rootNode;
}

// ── Search & Filter Path Ancestry Matcher ──
/**
 * Evaluates nodes against search term and filters.
 * Returns:
 * - matchedNodeIds: Set of IDs that directly matched
 * - ancestorNodeIds: Set of IDs of ancestors that MUST be expanded to reveal matches
 * - isMatchFound: boolean
 */
export function solveHierarchyMatches(tree, searchTerm = '', filters = {}) {
  const matchedNodeIds = new Set();
  const ancestorNodeIds = new Set();
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const domainFilter = filters.domain && filters.domain !== 'all' ? filters.domain : null;
  const locationFilter = filters.location && filters.location !== 'all' ? filters.location : null;
  const trackFilter = filters.track && filters.track !== 'all' ? filters.track : null;
  const statusFilter = filters.status && filters.status !== 'all' ? filters.status : null;

  function matchesResource(res) {
    if (!res) return false;
    // Filter check
    if (domainFilter && res.businessDomain !== domainFilter) return false;
    if (locationFilter && res.location !== locationFilter) return false;
    if (trackFilter && res.track !== trackFilter) return false;
    if (statusFilter && res.status !== statusFilter) return false;

    // Search check
    if (!normalizedSearch) return true;
    const searchTarget = [
      res.name,
      res.id,
      res.positionId,
      res.role,
      res.businessDomain,
      res.processGroup,
      res.track,
      res.location,
      res.nationality,
      res.skill,
      res.certification,
      res.email,
      res.managerInfo ? res.managerInfo.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  function matchesTeam(team) {
    if (domainFilter && team.domainKey !== domainFilter) return false;
    if (locationFilter && team.onsiteCount === 0 && locationFilter === 'Onsite') return false;
    if (locationFilter && team.offshoreCount === 0 && locationFilter === 'Offshore') return false;
    if (trackFilter && !team.tracks.includes(trackFilter)) return false;

    if (!normalizedSearch) return true;
    const searchTarget = [
      team.name,
      team.domainKey,
      team.domainName,
      team.lead ? team.lead.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  function matchesDomain(domain) {
    if (domainFilter && domain.code !== domainFilter) return false;
    if (locationFilter && domain.onsiteCount === 0 && locationFilter === 'Onsite') return false;
    if (locationFilter && domain.offshoreCount === 0 && locationFilter === 'Offshore') return false;

    if (!normalizedSearch) return true;
    const searchTarget = [
      domain.code,
      domain.name,
      domain.lead ? domain.lead.name : '',
    ].join(' ').toLowerCase();

    return searchTarget.includes(normalizedSearch);
  }

  // Traverse tree
  tree.children.forEach(domain => {
    const domainMatchesSelf = matchesDomain(domain);
    let domainHasMatchingDescendant = false;

    domain.children.forEach(team => {
      const teamMatchesSelf = matchesTeam(team);
      let teamHasMatchingMember = false;

      team.members.forEach(memberNode => {
        if (matchesResource(memberNode.data)) {
          matchedNodeIds.add(memberNode.id);
          teamHasMatchingMember = true;
        }
      });

      if (teamMatchesSelf || teamHasMatchingMember) {
        matchedNodeIds.add(team.id);
        ancestorNodeIds.add(domain.id);
        domainHasMatchingDescendant = true;
        if (teamHasMatchingMember) {
          ancestorNodeIds.add(team.id);
        }
      }
    });

    if (domainMatchesSelf || domainHasMatchingDescendant) {
      matchedNodeIds.add(domain.id);
      ancestorNodeIds.add(tree.id);
    }
  });

  return {
    matchedNodeIds,
    ancestorNodeIds,
    isFilterActive: Boolean(normalizedSearch || domainFilter || locationFilter || trackFilter || statusFilter),
    matchCount: matchedNodeIds.size,
  };
}

// ── Recent Organization Changes ──
export const RECENT_ORGANIZATION_CHANGES = [
  {
    id: 'CHG-001',
    date: '2026-06-18',
    category: 'Leadership Appointment',
    title: 'Fatima Al Zaabi Confirmed as AMS Delivery Lead',
    description: 'Operational delivery command consolidated across all 8 ERP domains (L2C, E2M, P2P, D2S, S2P, A2D, R2R, H2R).',
    affectedDomain: 'Cross-Domain',
    personnel: 'Fatima Al Zaabi (RES-002)',
    location: 'Onsite (Abu Dhabi HQ)',
    status: 'Completed',
  },
  {
    id: 'CHG-002',
    date: '2026-06-24',
    category: 'Capacity Realignment',
    title: 'Ankit Patel Assigned to E2M Flex Pool',
    description: 'Specialist mobilization under AMS-OF-Flex track to support manufacturing MES/MII delivery surges across Halcon & EPI.',
    affectedDomain: 'E2M',
    personnel: 'Ankit Patel (RES-009)',
    location: 'Offshore (Delivery Center)',
    status: 'Active',
  },
  {
    id: 'CHG-003',
    date: '2026-07-02',
    category: 'Track Allocation',
    title: 'Dedicated Enhancement Stream Allocation',
    description: 'Sunita Reddy (RES-014) and Nisha Varma (RES-026) transitioned to ENH-OF-RUN for dedicated P2P & S2P enhancement sprints.',
    affectedDomain: 'P2P / S2P',
    personnel: 'Sunita Reddy, Nisha Varma',
    location: 'Offshore Dedicated',
    status: 'Completed',
  },
  {
      id: 'CHG-004',
      date: '2026-07-20',
      type: 'relocation',
      badge: 'Location Transfer',
      title: 'Aisha Khalfan Stationed at Enterprise Commercial Hub',
      description: 'Onsite vendor management lead positioned at Enterprise Corporate HQ for direct vendor alignment and procurement governance.',
      affectedId: 'RES-010',
      affectedName: 'Aisha Khalfan',
      affectedRole: 'Functional Consultant (S2P)',
      businessDomain: 'S2P',
      location: 'KaarTech Corporate HQ',
      status: 'Completed',
  },
  {
    id: 'CHG-005',
    date: '2026-07-28',
    category: 'Governance Milestone',
    title: 'Executive SteerCom Governance Baseline Ratified',
    description: 'Dr. Tariq Al Nuaimi convened Q3 AMS Governance Council; 100% contracted baseline compliance verified with zero staffing gaps.',
    affectedDomain: 'SteerCom',
    personnel: 'Dr. Tariq Al Nuaimi (LEAD-01)',
    location: 'EDGE Group HQ',
    status: 'Ratified',
  },
  {
    id: 'CHG-006',
    date: '2026-08-04',
    category: 'Specialization Expansion',
    title: 'Sultan Al Dhahiri Assigned to Halcon QM Onsite Lead',
    description: 'Onsite SAP QM specialist operationalized to support high-precision manufacturing quality assurance workflows at Halcon.',
    affectedDomain: 'E2M',
    personnel: 'Sultan Al Dhahiri (RES-027)',
    location: 'Onsite (Halcon Plant)',
    status: 'Active',
  },
];
