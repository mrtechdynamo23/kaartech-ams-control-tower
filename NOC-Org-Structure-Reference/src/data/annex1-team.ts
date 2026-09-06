/**
 * ANNEX 1 — SAP AMS PRICING MODEL 2026
 * ---------------------------------------------------------------------------
 * AUTHORITATIVE team composition and commercial model, transcribed from
 * "Annex 1_SAP_AMS Pricing Model 2026", sheets:
 *   1. Transition & Assistance Period  — fixed-price mobilisation projects
 *   2. SAP AMS Team (RUN team)         — dedicated + shared flex baseline
 *   3. Variable Fee (CHANGE team)      — Elastic day-rate card
 *
 * The contracted BAU Run baseline is NINE (9) FTE: six onshore dedicated and
 * three offshore dedicated, all at Expert level, with no shared flex resources
 * in the initial team. Annex 1 requires the CONTRACTOR to state onshore/offshore
 * split, workload distribution per role, and experience level for each member.
 *
 * Commercial construct (Annex 1, sheet 2):
 *   Monthly Fixed Service Fee, Years 1–2  — LumpSum + SLAs
 *   Monthly Fixed Service Fee, Years 3–4  — LumpSum + SLAs
 * Elastic capacity is charged per day rate by profile and experience level
 * (Annex 1, sheet 3), consistent with SOW Appendix 1 §4.2 and §5.
 */

/** Annex 1 experience bands, verbatim. */
export const EXPERIENCE_BANDS = [
  { level: 'Beginner', definition: '<= 2 years experience' },
  { level: 'Intermediate', definition: '2 to 5 years experience' },
  { level: 'Advanced', definition: '5 to 10 years experience' },
  { level: 'Expert', definition: 'More than 10 years experience' },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_BANDS)[number]['level'];
export type EngagementLocation = 'Onshore (Doha)' | 'Offshore';
export type ResourceCommitment = 'Dedicated' | 'Shared Flex';

export interface Annex1TeamRole {
  /** Role name exactly as listed in Annex 1, sheet 2. */
  role: string;
  fte: number;
  location: EngagementLocation;
  commitment: ResourceCommitment;
  experienceLevel: ExperienceLevel;
  /** SAP domain this role covers in the Control Tower taxonomy. */
  domain: string;
  /** Assigned team member. */
  assignedTo: string;
  /** Named backup — SOW App.1 §6.10 requires one for every key role. */
  backup: string;
  /** SOW App.1 §6.2 core role mapping, where applicable. */
  sowCoreRole: string | null;
}

/**
 * Annex 1 initial team: 6 onshore dedicated + 3 offshore dedicated = 9 FTE.
 * Shared Flex is zero in the initial team; flex capacity is deployed by the
 * CONTRACTOR around this core under SOW Appendix 1 §4.1 at no change to the
 * commercial model.
 */
export const ANNEX1_RUN_TEAM: Annex1TeamRole[] = [
  { role: 'Onshore Delivery Manager (SAP Expert)', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'AMS Service Management', assignedTo: 'Rajesh Menon', backup: 'Huda Al-Salem', sowCoreRole: 'AMS Service Manager' },
  { role: 'SAP Functional FI/CO/VIM', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'S/4HANA Finance', assignedTo: 'Sara Al-Otaibi', backup: 'Aisha Rahman', sowCoreRole: null },
  { role: 'SAP Functional MM', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'S/4HANA Supply Chain', assignedTo: 'Mohammed Al-Dosari', backup: 'Sara Al-Otaibi', sowCoreRole: null },
  { role: 'SAP Functional WM/QM/FL', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'S/4HANA Supply Chain', assignedTo: 'Tariq Al-Ghamdi', backup: 'Mohammed Al-Dosari', sowCoreRole: null },
  { role: 'SAP Functional PM/EAM', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'S/4HANA Asset Management', assignedTo: 'Faisal Al-Harbi', backup: 'Mohammed Al-Dosari', sowCoreRole: null },
  { role: 'SAP Functional SuccessFactors & Integration', fte: 1, location: 'Onshore (Doha)', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'SuccessFactors', assignedTo: 'Layla Hassan', backup: 'Rakesh Kumar', sowCoreRole: null },
  { role: 'SAP Basis/BTP', fte: 1, location: 'Offshore', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'SAP Basis & Platform', assignedTo: 'Omar Al-Mutairi', backup: 'Daniel Mathew', sowCoreRole: 'Release & Environment Manager' },
  { role: 'SAP Security/GRC', fte: 1, location: 'Offshore', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'GRC & Security', assignedTo: 'Khalid Al-Shammari', backup: 'Omar Al-Mutairi', sowCoreRole: null },
  { role: 'SAP Functional PS/EPPM', fte: 1, location: 'Offshore', commitment: 'Dedicated', experienceLevel: 'Expert', domain: 'S/4HANA Asset Management', assignedTo: 'Priya Nair', backup: 'Faisal Al-Harbi', sowCoreRole: 'QA & Test Lead' },
];

/** Roles listed in Annex 1 sheet 2 with zero initial FTE — available for scale-up. */
export const ANNEX1_UNSTAFFED_ROLES = [
  'SAP Functional MM/ARIBA',
  'SAP Technical ABAP/Cloud Developer',
  'SAP Technical BW/BI/BO & SAP Analytics Cloud',
  'SAP Technical PI/PO/CPI/Integration Suite',
  'SAP Signavio',
  'SAP Functional GRC',
  'SAP Technical UI5/FIORI',
] as const;

export interface ElasticProfile {
  profile: string;
  keySkills: string;
  /** Day rates are CONTRACTOR-completed in Annex 1 sheet 3. */
  onshoreDayRateUsd: number | null;
  offshoreDayRateUsd: number | null;
}

/**
 * Annex 1, sheet 3 — Elastic (CHANGE team) profiles. Rates are quoted per
 * experience level for onshore and offshore, all inclusive. Values are null
 * here because the pricing cells are completed by the SERVICE PROVIDER.
 */
export const ANNEX1_ELASTIC_PROFILES: ElasticProfile[] = [
  { profile: 'Lead Domain (Project Lead)', keySkills: 'Software project delivery; SAP Activate, Agile, ServiceNow, Scrum or Kanban; planning, coordination and monitoring; COMPANY governance, data security, user access and QA standards.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Functional', keySkills: 'Eliciting, analysing, documenting and validating requirements; waterfall and agile methods; stakeholder communication; ABAP / Cloud development principles, debugging and tracing.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Technical ABAP / Cloud Developer', keySkills: 'Developing, migrating and maintaining SAP solutions on-premise and cloud; Eclipse, NetWeaver, CDS, OData, UI5; ABAP APIs, web services and workflows; SAP BTP platform services.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Technical BW/BI/BO and SAP Analytics Cloud Developer', keySkills: 'SAP BW on-premise, Business Objects and SAP Analytics Cloud; ECC and S/4HANA integration; BTP APIs, web services, CDS views and workflows.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Technical PI/PO/CPI/Integration Suite', keySkills: 'Integration design and support across CPI and legacy PI/PO; iFlow development, error handling, API management.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Functional SuccessFactors & Integration', keySkills: 'SuccessFactors Employee Central implementations on SAP Cloud Platform Integration; module configuration and release regression.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Functional GRC', keySkills: 'SAP GRC suite — Access Control, Process Control, Risk Management, Audit Management; SoD rule sets and remediation.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Security', keySkills: 'SAP Security design, customisation, implementation and auditing of roles and authorisations.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
  { profile: 'SAP Technical FIORI / UI / UX Designer', keySkills: 'SAP Fiori/UI5 development for web and mobile user interfaces and experiences.', onshoreDayRateUsd: null, offshoreDayRateUsd: null },
];

/** Commercial construct from Annex 1, sheet 2. */
export const ANNEX1_COMMERCIAL_MODEL = {
  runFeeYears1to2: { description: 'Monthly Fixed Service Fee for Years 1 – 2', uom: 'LumpSum + SLAs', priceUsd: null as number | null },
  runFeeYears3to4: { description: 'Monthly Fixed Service Fee for Years 3 – 4', uom: 'LumpSum + SLAs', priceUsd: null as number | null },
  transitionFee: { description: 'Transition / Mobilisation — fixed price per named transition project', uom: 'Fixed Price', priceUsd: null as number | null },
  elasticFee: { description: 'Elastic (CHANGE team) — day rate per profile and experience level, onshore and offshore, all inclusive', uom: 'Day Rate', priceUsd: null as number | null },
} as const;

export function getAnnex1TeamStats() {
  const total = ANNEX1_RUN_TEAM.reduce((n, r) => n + r.fte, 0);
  const onshore = ANNEX1_RUN_TEAM.filter((r) => r.location === 'Onshore (Doha)').reduce((n, r) => n + r.fte, 0);
  const offshore = total - onshore;
  const dedicated = ANNEX1_RUN_TEAM.filter((r) => r.commitment === 'Dedicated').reduce((n, r) => n + r.fte, 0);
  const withBackup = ANNEX1_RUN_TEAM.filter((r) => r.backup).length;
  return {
    total,
    onshore,
    offshore,
    dedicated,
    sharedFlex: total - dedicated,
    expertCount: ANNEX1_RUN_TEAM.filter((r) => r.experienceLevel === 'Expert').reduce((n, r) => n + r.fte, 0),
    backupCoveragePct: ANNEX1_RUN_TEAM.length ? Math.round((withBackup / ANNEX1_RUN_TEAM.length) * 100) : 0,
    unstaffedRoles: ANNEX1_UNSTAFFED_ROLES.length,
    elasticProfiles: ANNEX1_ELASTIC_PROFILES.length,
  };
}
