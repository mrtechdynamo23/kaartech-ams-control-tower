/**
 * AMS TEAM MASTER DATASET
 * ---------------------------------------------------------------------------
 * Team composition for the North Oil Company SAP AMS engagement (C-IS-2022).
 * Structured against SOW Appendix 1 §6.2 (core roles), §6.3 (onsite Doha core
 * plus offshore capacity) and §7.1 (domain leads as COMPANY focal points).
 *
 * SAP domains: S/4HANA Finance, S/4HANA Supply Chain, S/4HANA Asset Management,
 * SuccessFactors, Ariba, OpenText VIM, Integration Suite (CPI), GRC & Security,
 * Signavio, BTP & Fiori, SAP Basis & Platform, HANA Database & Performance,
 * SAC & Analytics, Enable Now & Adoption, AMS Service Management.
 *
 * IN-COUNTRY VALUE / QATARIZATION
 * -------------------------------
 * NOTE: SOW Appendix 1 contains NO Qatarization service level. The In-Country
 * Value obligation sits in the main contract at ARTICLE 25 and APPENDIX 8
 * (In-Country Value Exhibit for Contractors). Targets shown here are the
 * CONTRACTOR's own ICV commitments per SAP domain — they are NOT contractual
 * SLAs and carry no Performance Credit under SOW App.1 §8.10.
 */

/** Where the ICV / Qatarization obligation actually comes from. */
export const ICV_SOURCE = {
  reference: 'Contract Article 25 & Appendix 8 — In-Country Value Exhibit',
  note:
    'In-Country Value commitment. Appendix 1 (Scope of Supply) defines no Qatarization ' +
    'service level, so these targets are CONTRACTOR commitments rather than credit-bearing SLAs.',
  isContractualSla: false,
} as const;

// ─── ROLE HISTORY INTERFACE ───────────────────────────────────
export interface RoleHistoryEntry {
  holder: string;
  holderId: string;
  roleName: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export type EmployeeLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'SME/Manager';

export interface MasterEmployee {
  employeeId: string;
  name: string;
  role: string;
  tower: string;
  department: string;
  position: string;
  location: string;
  manager: string;
  mobile: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Standby' | 'Remote' | 'Training';
  shift: 'Morning (06:00-14:00)' | 'Evening (14:00-22:00)' | 'Night (22:00-06:00)';
  joiningDate: string;
  nationality: string;
  expatLocal: 'Local' | 'Expat';
  employmentType: 'Full-Time' | 'Contract' | 'Consultant';
  currentAssignment: string;
  /** Approved Qatarization domain — mapped from tower/department */
  locationBucket: string;
  /** Historical record of who held this role before this person */
  roleHistory: RoleHistoryEntry[];
  /** Deterministic level classification based on position */
  level: EmployeeLevel;
  /** Gender */
  gender: 'Male' | 'Female';
  /**
   * Annex 1 commitment class. 'Dedicated' resources are the nine priced FTE;
   * 'Shared Flex' sits around them under SOW App.1 §4.1 inside the same fee.
   */
  commitment: ResourceCommitment;
  /** True where the resource is based in Qatar (SOW App.1 §7.2). */
  inCountry: boolean;
}

/**
 * Deterministic level mapping from position.
 * Administrator/Analyst → L1, Engineer/Technician/Support Engineer → L2,
 * Senior Engineer/Senior Analyst/Specialist → L3,
 * Team Lead/Operations Lead/Coordinator/Lead Engineer → L4,
 * Manager/Architect/Consultant → SME/Manager
 */
export function getPositionLevel(position: string): EmployeeLevel {
  switch (position) {
    case 'Administrator':
    case 'Analyst':
      return 'L1';
    case 'Engineer':
    case 'Support Engineer':
    case 'Technician':
      return 'L2';
    case 'Senior Engineer':
    case 'Senior Analyst':
    case 'Specialist':
      return 'L3';
    case 'Team Lead':
    case 'Operations Lead':
    case 'Coordinator':
    case 'Lead Engineer':
      return 'L4';
    case 'Manager':
    case 'Architect':
    case 'Consultant':
      return 'SME/Manager';
    default:
      return 'L2';
  }
}

// ─── QATARIZATION AUTHORITATIVE DATA (Section 4) ──────────────
export interface QatarizationDomainTarget {
  locationBucket: string;
  /**
   * CONTRACTOR ICV commitment for this domain. There is no stored "actual"
   * here by design — the achieved percentage is computed from the roster in
   * getQatarizationStats(), so the count and the percentage cannot disagree.
   */
  targetPct: number;
}

export const QATARIZATION_TARGETS: QatarizationDomainTarget[] = [
  { locationBucket: 'AMS Governance & Service Management', targetPct: 50 },
  { locationBucket: 'S/4HANA Functional (Finance)', targetPct: 40 },
  { locationBucket: 'S/4HANA Functional (Supply Chain)', targetPct: 40 },
  { locationBucket: 'S/4HANA Functional (Asset Management)', targetPct: 40 },
  { locationBucket: 'SuccessFactors & HR Hub', targetPct: 40 },
  { locationBucket: 'Ariba, VIM & Procurement', targetPct: 40 },
  { locationBucket: 'Integration & Development (CPI / BTP)', targetPct: 30 },
  { locationBucket: 'Security, GRC & Compliance', targetPct: 50 },
  { locationBucket: 'Basis, HANA & Platform', targetPct: 30 },
];

export const LOCATION_BUCKETS = QATARIZATION_TARGETS.map(s => s.locationBucket);

/**
 * Mapping from (tower, department) → approved Qatarization location bucket.
 * Each tower maps to one primary Qatarization domain.
 */
function getTowerLocationBucket(tower: string): string {
  switch (tower) {
    case 'AMS Service Management': return 'AMS Governance & Service Management';
    case 'S/4HANA Finance': return 'S/4HANA Functional (Finance)';
    case 'S/4HANA Supply Chain': return 'S/4HANA Functional (Supply Chain)';
    case 'S/4HANA Asset Management': return 'S/4HANA Functional (Asset Management)';
    case 'SuccessFactors': return 'SuccessFactors & HR Hub';
    case 'Ariba':
    case 'OpenText VIM': return 'Ariba, VIM & Procurement';
    case 'Integration Suite (CPI)':
    case 'BTP & Fiori': return 'Integration & Development (CPI / BTP)';
    case 'GRC & Security': return 'Security, GRC & Compliance';
    case 'SAP Basis & Platform':
    case 'HANA Database & Performance': return 'Basis, HANA & Platform';
    default: return 'AMS Governance & Service Management';
  }
}


// ─── HELPER: Generate synthetic Qatari phone numbers ────────────
const phonePrefixes = ['50', '53', '54', '55', '56', '57', '58', '59'];
let phoneIdx = 0;
function genPhone(): string {
  const p = phonePrefixes[phoneIdx % phonePrefixes.length];
  phoneIdx++;
  const a = String(100 + (phoneIdx * 37 + 284) % 900);
  const b = String(1000 + (phoneIdx * 73 + 4716) % 9000);
  return `+974 ${p} ${a} ${b}`;
}

export const TOWERS = ['SAP Basis & Platform', 'Integration Suite (CPI)', 'AMS Service Management', 'S/4HANA Supply Chain', 'S/4HANA Finance', 'HANA Database & Performance', 'BTP & Fiori', 'GRC & Security', 'Enable Now & Adoption'] as const;
/**
 * SOW App.1 §1 contracts a "full-managed and unified SAP AMS Team", and §9.7
 * excludes infrastructure services from scope. Labelling AMS resources
 * "Infrastructure" or "Cyber Security" therefore reads as work COMPANY has
 * explicitly excluded, when the roles themselves — SAP Basis and Security/GRC
 * — sit inside Technical AMS under §2.2. One department, and the SAP domain
 * (`tower`) carries the specialism instead.
 */
export const DEPARTMENTS = ['Applications'] as const;



// ─── Previous role holder name pools (for role history) ───────
const prevHolderNames = [
  'Tariq Al-Rashidi', 'Bandar Al-Dawsari', 'Mishal Al-Subaie', 'Saud Al-Enezi',
  'Nawaf Al-Hajri', 'Ziad Al-Bogami', 'Abdulrahman Al-Thani', 'Badr Al-Fadhli',
  'Hessa Al-Harthy', 'Jawahir Al-Khaldi', 'Ganesh Rao', 'Naveen Das',
  'Karthik Joshi', 'Prasad Bhat', 'Venkat Mishra', 'Ashok Pandey',
  'Deepak Choudhary', 'Manoj Verma', 'Anand Singh', 'Ravi Gupta',
];

// Authoritative Previous Role Holder overrides for key resources to match KT records exactly
const KNOWN_PREV_HOLDERS: Record<string, string> = {
  'Ahmed Al-Qahtani': 'Tariq Al-Rashidi',
  'Mohammed Al-Dosari': 'Bandar Al-Dawsari',
  'Sara Al-Otaibi': 'Mishal Al-Subaie',
  'Omar Al-Mutairi': 'Saud Al-Enezi',
  'Aisha Rahman': 'Nawaf Al-Hajri',
  'Noura Al-Qahtani': 'Ganesh Rao',
  'Layla Hassan': 'Deepak Choudhary',
  'Huda Al-Salem': 'Karthik Joshi',
  'Fahad Al-Subaie': 'Ziad Al-Bogami',
  'Khalid Al-Ghamdi': 'Abdulrahman Al-Thani',
  'Reem Al-Zahrani': 'Badr Al-Fadhli',
  'Sultan Al-Malki': 'Hessa Al-Harthy',
  'Turki Al-Subaie': 'Jawahir Al-Khaldi',
};

function generateRoleHistory(empIdx: number, role: string, joiningDate: string, empName?: string): RoleHistoryEntry[] {
  const history: RoleHistoryEntry[] = [];
  const joinYear = parseInt(joiningDate.substring(0, 4)) || 2023;

  // If there is an authoritative previous role holder for this person, always include them as 1st previous holder
  if (empName && KNOWN_PREV_HOLDERS[empName]) {
    const primaryPrev = KNOWN_PREV_HOLDERS[empName];
    history.push({
      holder: primaryPrev,
      holderId: `NOC-PREV-${100 + (empIdx % 50)}`,
      roleName: role,
      startDate: `${joinYear - 2}-01-15`,
      endDate: `${joinYear}-01-10`,
      durationMonths: 24,
    });
    return history;
  }

  const numPrev = 1 + (empIdx % 2); // 1 or 2 previous holders
  for (let p = numPrev; p >= 1; p--) {
    const prevName = prevHolderNames[(empIdx * 3 + p) % prevHolderNames.length];
    const startYear = joinYear - p - 1;
    const endYear = joinYear - p + 1;
    const startMonth = String(1 + ((empIdx + p * 5) % 12)).padStart(2, '0');
    const endMonth = String(1 + ((empIdx + p * 7) % 12)).padStart(2, '0');
    const duration = 12 + (empIdx + p * 3) % 18;
    history.push({
      holder: prevName,
      holderId: `NOC-${900 + empIdx + p}`,
      roleName: role,
      startDate: `${startYear}-${startMonth}-01`,
      endDate: `${endYear}-${endMonth}-28`,
      durationMonths: duration,
    });
  }
  return history;
}

/**
 * Per-domain expat rate that matches the approved Qatarization actuals.
 * localRate = actualPct / 100. We use this to decide Local vs Expat.
 */

/**
 * THE CONTRACTED AMS TEAM
 * ---------------------------------------------------------------------------
 * The roster IS the Annex 1 team. Annex 1 (SAP AMS Pricing Model 2026, sheet 2)
 * prices a BAU Run baseline of NINE dedicated FTE — six onshore in Doha and
 * three offshore, all at Expert level — and that is what the nine `Dedicated`
 * records below are. `ANNEX1_RUN_TEAM` in annex1-team.ts remains the contract
 * transcription; this roster names the people filling those posts, and a
 * consistency check at the foot of this file fails the build if the two ever
 * disagree on headcount.
 *
 * The `Shared Flex` records are NOT part of the priced baseline. SOW Appendix 1
 * §4.1 lets the CONTRACTOR flex capacity around the core team at no change to
 * the commercial model, and §7.2 recognises three working arrangements:
 * COMPANY premises, CONTRACTOR premises or home in Doha, and remote. Flex
 * resources are carried here so shift cover, leave and handover are realistic,
 * and every screen that reports team size must use `CONTRACTED_FTE`, never the
 * roster length.
 */

export type ResourceCommitment = 'Dedicated' | 'Shared Flex';
export type EngagementBase = 'Onshore — COMPANY premises, Doha' | 'Doha — CONTRACTOR premises' | 'Offshore delivery centre';

interface RosterSeed {
  name: string;
  role: string;
  tower: string;
  department: string;
  position: string;
  commitment: ResourceCommitment;
  base: EngagementBase;
  manager: string;
  nationality: string;
  expatLocal: 'Local' | 'Expat';
  gender: 'Male' | 'Female';
  status: MasterEmployee['status'];
  shift: MasterEmployee['shift'];
  joiningDate: string;
  assignment: string;
}

/**
 * Nine dedicated posts, in Annex 1 sheet 2 order. Role strings match
 * ANNEX1_RUN_TEAM exactly so the two registers can be reconciled by role.
 */
const DEDICATED_SEEDS: RosterSeed[] = [
  { name: 'Rajesh Menon',         role: 'Onshore Delivery Manager (SAP Expert)',         tower: 'AMS Service Management',      department: 'Applications', position: 'Manager',        commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'CONTRACTOR Account Manager', nationality: 'Indian', expatLocal: 'Expat', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — service management and COMPANY interface' },
  { name: 'Sara Al-Otaibi',       role: 'SAP Functional FI/CO/VIM',                      tower: 'S/4HANA Finance',             department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Female', status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — Finance, Controlling, Treasury, JVA and VIM' },
  { name: 'Mohammed Al-Dosari',   role: 'SAP Functional MM',                             tower: 'S/4HANA Supply Chain',        department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — Procurement, Contracting and Inventory' },
  { name: 'Tariq Al-Ghamdi',      role: 'SAP Functional WM/QM/FL',                       tower: 'S/4HANA Supply Chain',        department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-12', assignment: 'AMS Run — Warehouse, Quality and Fleet' },
  { name: 'Faisal Al-Harbi',      role: 'SAP Functional PM/EAM',                         tower: 'S/4HANA Asset Management',    department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — Plant Maintenance and Enterprise Asset Management' },
  { name: 'Layla Hassan',         role: 'SAP Functional SuccessFactors & Integration',   tower: 'SuccessFactors',              department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Onshore — COMPANY premises, Doha', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Female', status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-12', assignment: 'AMS Run — SuccessFactors and CPI integration to S/4HANA' },
  { name: 'Rakesh Kumar',         role: 'SAP Basis/BTP',                                 tower: 'SAP Basis & Platform',        department: 'Applications',     position: 'Specialist',     commitment: 'Dedicated', base: 'Offshore delivery centre', manager: 'Rajesh Menon', nationality: 'Indian', expatLocal: 'Expat', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — Basis, BTP and transport management' },
  { name: 'Daniel Mathew',        role: 'SAP Security/GRC',                              tower: 'GRC & Security',              department: 'Applications',     position: 'Specialist',     commitment: 'Dedicated', base: 'Offshore delivery centre', manager: 'Rajesh Menon', nationality: 'Indian', expatLocal: 'Expat', gender: 'Male',   status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-05', assignment: 'AMS Run — GRC ARA/ARM/EAM, SoD and access design' },
  { name: 'Priya Nair',           role: 'SAP Functional PS/EPPM',                        tower: 'S/4HANA Asset Management',    department: 'Applications',       position: 'Consultant',     commitment: 'Dedicated', base: 'Offshore delivery centre', manager: 'Rajesh Menon', nationality: 'Indian', expatLocal: 'Expat', gender: 'Female', status: 'Active',  shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-12', assignment: 'AMS Run — Project Systems and Enterprise Portfolio & Project Management' },
];

/**
 * Flex capacity around the core, under SOW Appendix 1 §4.1. Inside the baseline
 * fee, mobilised and managed by the CONTRACTOR, and explicitly not part of the
 * nine priced FTE.
 */
const FLEX_SEEDS: RosterSeed[] = [
  { name: 'Omar Al-Mutairi',      role: 'HANA Database & Performance Engineer', tower: 'HANA Database & Performance', department: 'Applications',        position: 'Senior Engineer', commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Rakesh Kumar', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Active',   shift: 'Evening (14:00-22:00)', joiningDate: '2026-02-02', assignment: 'Flex — HANA performance and month-end close cover' },
  { name: 'Khalid Al-Shammari',   role: 'CPI Integration Engineer',             tower: 'Integration Suite (CPI)',    department: 'Applications',        position: 'Senior Engineer', commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Rakesh Kumar', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Active',   shift: 'Morning (06:00-14:00)', joiningDate: '2026-02-02', assignment: 'Flex — CPI iFlow monitoring and payload error handling' },
  { name: 'Aisha Rahman',         role: 'Ariba & VIM Support Analyst',          tower: 'Ariba',                      department: 'Applications',          position: 'Analyst',         commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Sara Al-Otaibi', nationality: 'Qatari', expatLocal: 'Local', gender: 'Female', status: 'Active',   shift: 'Morning (06:00-14:00)', joiningDate: '2026-02-16', assignment: 'Flex — Ariba SLP and VIM invoice workflow support' },
  { name: 'Huda Al-Salem',        role: 'Change & Release Coordinator',         tower: 'AMS Service Management',     department: 'Applications',    position: 'Coordinator',     commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Female', status: 'Active',   shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-19', assignment: 'Flex — CAB coordination, change and release reporting' },
  { name: 'Noura Al-Qahtani',     role: 'AMS Governance & Reporting Analyst',   tower: 'AMS Service Management',     department: 'Applications',                   position: 'Analyst',         commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Rajesh Menon', nationality: 'Qatari', expatLocal: 'Local', gender: 'Female', status: 'On Leave', shift: 'Morning (06:00-14:00)', joiningDate: '2026-01-19', assignment: 'Flex — WSR/MSR production and governance pack assembly' },
  { name: 'Ahmed Al-Qahtani',     role: 'SAP Enable Now & Adoption Specialist', tower: 'Enable Now & Adoption',      department: 'Applications',          position: 'Specialist',      commitment: 'Shared Flex', base: 'Doha — CONTRACTOR premises', manager: 'Layla Hassan', nationality: 'Qatari', expatLocal: 'Local', gender: 'Male',   status: 'Training', shift: 'Morning (06:00-14:00)', joiningDate: '2026-03-01', assignment: 'Flex — Enable Now content and end-user adoption' },
  { name: 'Arjun Menon',          role: 'ABAP / Fiori Developer',               tower: 'BTP & Fiori',                department: 'Applications',          position: 'Engineer',        commitment: 'Shared Flex', base: 'Offshore delivery centre', manager: 'Rakesh Kumar', nationality: 'Indian', expatLocal: 'Expat', gender: 'Male',   status: 'Active',   shift: 'Morning (06:00-14:00)', joiningDate: '2026-02-02', assignment: 'Flex — WRICEF build, Fiori/UI5 and clean-core extensions' },
  { name: 'Vivek Srinivasan',     role: 'SAC & Analytics Consultant',           tower: 'SAC & Analytics',            department: 'Applications',          position: 'Consultant',      commitment: 'Shared Flex', base: 'Offshore delivery centre', manager: 'Rajesh Menon', nationality: 'Indian', expatLocal: 'Expat', gender: 'Male',   status: 'Remote',   shift: 'Morning (06:00-14:00)', joiningDate: '2026-02-16', assignment: 'Flex — SAC dashboards, planning models and KPI packs' },
];

const ROSTER_SEEDS: RosterSeed[] = [...DEDICATED_SEEDS, ...FLEX_SEEDS];

function slugEmail(name: string): string {
  return name.toLowerCase().replace(/[^a-z ]/g, '').split(' ').join('.') + '@demo.noc.local';
}

function generateEmployees(): MasterEmployee[] {
  return ROSTER_SEEDS.map((s, idx) => ({
    employeeId: `NOC-${1001 + idx}`,
    name: s.name,
    role: s.role,
    tower: s.tower,
    department: s.department,
    position: s.position,
    location: s.base,
    manager: s.manager,
    mobile: genPhone(),
    email: slugEmail(s.name),
    status: s.status,
    shift: s.shift,
    joiningDate: s.joiningDate,
    nationality: s.nationality,
    expatLocal: s.expatLocal,
    employmentType: 'Full-Time' as const,
    currentAssignment: s.assignment,
    locationBucket: getTowerLocationBucket(s.tower),
    roleHistory: generateRoleHistory(idx, s.role, s.joiningDate, s.name),
    level: getPositionLevel(s.position),
    gender: s.gender,
    commitment: s.commitment,
    inCountry: s.base !== 'Offshore delivery centre',
  }));
}

export const masterEmployees: MasterEmployee[] = generateEmployees();

// ─── CONTRACTED BASELINE ───────────────────────────────────────
/** The nine Annex 1 priced FTE. Use this for team size — never roster length. */
export const DEDICATED_TEAM = masterEmployees.filter(e => e.commitment === 'Dedicated');
/** Flex capacity around the core (SOW App.1 §4.1). Not part of the priced baseline. */
export const FLEX_POOL = masterEmployees.filter(e => e.commitment === 'Shared Flex');

/** Annex 1 sheet 2: six onshore dedicated + three offshore dedicated. */
export const CONTRACTED_FTE = {
  dedicated: DEDICATED_TEAM.length,
  onshore: DEDICATED_TEAM.filter(e => e.inCountry).length,
  offshore: DEDICATED_TEAM.filter(e => !e.inCountry).length,
  flex: FLEX_POOL.length,
  source: 'Annex 1 — SAP AMS Pricing Model 2026, sheet 2',
} as const;

// ─── QATARIZATION / ICV HELPERS ────────────────────────────────
export interface QatarizationDomainStat {
  locationBucket: string;
  totalCount: number;
  qatariCount: number;
  targetPct: number;
  actualPct: number;
  status: 'OK' | 'NOT OK' | 'No resources assigned';
}

/**
 * Per-domain ICV / Qatarization position, computed from the roster.
 *
 * Every percentage here is derived from the counts beside it, so a row can
 * never report a share its own numbers do not support. Domains with no
 * assigned resource report zero counts and no percentage rather than an
 * inherited figure.
 *
 * These are CONTRACTOR ICV commitments under Contract Article 25 and
 * Appendix 8, not service levels — SOW Appendix 1 defines no Qatarization SLA
 * and none of this carries a Performance Credit.
 */
export function getQatarizationStats(): {
  domains: QatarizationDomainStat[];
  overallPct: number;
  overallQatariCount: number;
  overallTotal: number;
  inCountryPct: number;
  inCountryQatariCount: number;
  inCountryTotal: number;
} {
  const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);

  const totalQatari = masterEmployees.filter(e => e.expatLocal === 'Local').length;
  const inCountry = masterEmployees.filter(e => e.inCountry);
  const inCountryQatari = inCountry.filter(e => e.expatLocal === 'Local').length;

  const domains: QatarizationDomainStat[] = QATARIZATION_TARGETS.map(t => {
    const domainEmps = masterEmployees.filter(e => e.locationBucket === t.locationBucket);
    const domainQatari = domainEmps.filter(e => e.expatLocal === 'Local').length;
    const actualPct = pct(domainQatari, domainEmps.length);
    return {
      locationBucket: t.locationBucket,
      totalCount: domainEmps.length,
      qatariCount: domainQatari,
      targetPct: t.targetPct,
      actualPct,
      status: domainEmps.length === 0
        ? 'No resources assigned'
        : actualPct >= t.targetPct ? 'OK' : 'NOT OK',
    };
  });

  return {
    domains,
    overallPct: pct(totalQatari, masterEmployees.length),
    overallQatariCount: totalQatari,
    overallTotal: masterEmployees.length,
    inCountryPct: pct(inCountryQatari, inCountry.length),
    inCountryQatariCount: inCountryQatari,
    inCountryTotal: inCountry.length,
  };
}

// Helper to get employee by ID
export function getEmployeeById(id: string): MasterEmployee | undefined {
  return masterEmployees.find(e => e.employeeId === id);
}

// Helper to get employee by name
export function getEmployeeByName(name: string): MasterEmployee | undefined {
  return masterEmployees.find(e => e.name === name);
}

// ─── ACTIVITY CHECKLIST DATA ──────────────────────────────────
export interface ActivityItem {
  id: string;
  activity: string;
  tower: string;
  owner: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  dueTime: string;
  completionPct: number;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Overdue';
  lastCompleted: string;
  nextDue: string;
  remarks: string;
}

export const activityChecklistItems: ActivityItem[] = [
  { id: 'ACT-CHK-01', activity: 'Daily Infrastructure Health Review', tower: 'SAP Basis & Platform', owner: 'Ahmed Al-Qahtani', frequency: 'Daily', dueTime: '08:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:45 AM', nextDue: '2026-08-13 08:00 AM', remarks: '286 compute nodes verified' },
  { id: 'ACT-CHK-02', activity: 'NOC Monitoring Validation', tower: 'Integration Suite (CPI)', owner: 'Khalid Al-Shammari', frequency: 'Daily', dueTime: '06:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 06:15 AM', nextDue: '2026-08-13 06:30 AM', remarks: '1,248 monitored assets normal' },
  { id: 'ACT-CHK-03', activity: 'Network Device Health Review', tower: 'Integration Suite (CPI)', owner: 'Mohammed Al-Dosari', frequency: 'Daily', dueTime: '09:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 08:50 AM', nextDue: '2026-08-13 09:00 AM', remarks: '48 core network switches verified' },
  { id: 'ACT-CHK-04', activity: 'Database Backup Validation', tower: 'HANA Database & Performance', owner: 'Omar Al-Mutairi', frequency: 'Daily', dueTime: '07:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 06:45 AM', nextDue: '2026-08-13 07:00 AM', remarks: '34 enterprise DB backups successful' },
  { id: 'ACT-CHK-05', activity: 'Cloud Capacity Review', tower: 'BTP & Fiori', owner: 'Priya Nair', frequency: 'Weekly', dueTime: '11:00 AM', completionPct: 60, status: 'In Progress', lastCompleted: '2026-08-05 10:30 AM', nextDue: '2026-08-12 11:00 AM', remarks: 'GCP & Azure quota check in progress' },
  { id: 'ACT-CHK-06', activity: 'Application Batch Validation', tower: 'S/4HANA Supply Chain', owner: 'Sara Al-Otaibi', frequency: 'Daily', dueTime: '08:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 08:15 AM', nextDue: '2026-08-13 08:30 AM', remarks: 'SAP & Oracle batch runs cleared' },
  { id: 'ACT-CHK-07', activity: 'Backup Restore Test', tower: 'SAP Basis & Platform', owner: 'Rakesh Kumar', frequency: 'Weekly', dueTime: '02:00 PM', completionPct: 0, status: 'Overdue', lastCompleted: '2026-07-29 02:00 PM', nextDue: '2026-08-05 02:00 PM', remarks: 'Requires DR storage array access' },
  { id: 'ACT-CHK-08', activity: 'Security Patch Compliance Review', tower: 'GRC & Security', owner: 'Daniel Mathew', frequency: 'Weekly', dueTime: '04:00 PM', completionPct: 40, status: 'Pending', lastCompleted: '2026-08-05 03:30 PM', nextDue: '2026-08-12 04:00 PM', remarks: 'Patching compliance at 94.2%' },
  { id: 'ACT-CHK-09', activity: 'ServiceNow Integration Health Check', tower: 'S/4HANA Supply Chain', owner: 'Arjun Menon', frequency: 'Daily', dueTime: '09:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 09:10 AM', nextDue: '2026-08-13 09:30 AM', remarks: 'REST APIs & CMDB discovery active' },
  { id: 'ACT-CHK-10', activity: 'Major Incident Readiness Check', tower: 'AMS Service Management', owner: 'Aisha Rahman', frequency: 'Weekly', dueTime: '10:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-10 09:45 AM', nextDue: '2026-08-17 10:00 AM', remarks: 'On-call bridge lines operational' },
  { id: 'ACT-CHK-11', activity: 'DR Replication Validation', tower: 'HANA Database & Performance', owner: 'Omar Al-Mutairi', frequency: 'Weekly', dueTime: '12:00 PM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-08 11:30 AM', nextDue: '2026-08-15 12:00 PM', remarks: 'Ras Laffan DR lag < 15 seconds' },
  { id: 'ACT-CHK-12', activity: 'Monitoring Alert Review', tower: 'Integration Suite (CPI)', owner: 'Khalid Al-Shammari', frequency: 'Daily', dueTime: '05:00 PM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-11 04:50 PM', nextDue: '2026-08-12 05:00 PM', remarks: 'Triage rules tuned for SAP Cloud ALM' },
  { id: 'ACT-CHK-13', activity: 'Vendor Action Review', tower: 'AMS Service Management', owner: 'Noura Al-Qahtani', frequency: 'Weekly', dueTime: '03:00 PM', completionPct: 30, status: 'Pending', lastCompleted: '2026-08-05 02:30 PM', nextDue: '2026-08-12 03:00 PM', remarks: 'Reviewing Gulf Tech SLA report' },
  { id: 'ACT-CHK-14', activity: 'Shift Handover Quality Review', tower: 'AMS Service Management', owner: 'Faisal Al-Harbi', frequency: 'Daily', dueTime: '07:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:20 AM', nextDue: '2026-08-13 07:30 AM', remarks: 'Handover logs complete for all SAP domains' },
  { id: 'ACT-CHK-15', activity: 'Weekly Operational Governance Review', tower: 'AMS Service Management', owner: 'Faisal Al-Harbi', frequency: 'Weekly', dueTime: '05:00 PM', completionPct: 20, status: 'Pending', lastCompleted: '2026-08-05 04:30 PM', nextDue: '2026-08-12 05:00 PM', remarks: 'Agenda prepared for SDM sync' },
  { id: 'ACT-CHK-16', activity: 'SAP Basis Daily Health Check', tower: 'S/4HANA Finance', owner: 'Sara Al-Otaibi', frequency: 'Daily', dueTime: '07:30 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 07:15 AM', nextDue: '2026-08-13 07:30 AM', remarks: 'All SAP systems green' },
  { id: 'ACT-CHK-17', activity: 'Digital Workplace Patch Review', tower: 'Enable Now & Adoption', owner: 'Layla Hassan', frequency: 'Weekly', dueTime: '10:00 AM', completionPct: 75, status: 'In Progress', lastCompleted: '2026-08-05 09:45 AM', nextDue: '2026-08-12 10:00 AM', remarks: '45 endpoints pending patches' },
  { id: 'ACT-CHK-18', activity: 'Cloud Cost Anomaly Review', tower: 'BTP & Fiori', owner: 'Priya Nair', frequency: 'Daily', dueTime: '10:00 AM', completionPct: 100, status: 'Completed', lastCompleted: '2026-08-12 09:50 AM', nextDue: '2026-08-13 10:00 AM', remarks: 'No anomalies detected' },
];

// ─── HANDOVER LOGS DATA ───────────────────────────────────────
export interface HandoverRecord {
  id: string;
  date: string;
  outgoingEngineer: string;
  incomingEngineer: string;
  tower: string;
  shift: string;
  criticalEvents: string;
  openIncidents: string;
  pendingActions: string;
  risks: string;
  dependencies: string;
  status: 'Completed' | 'Attention Required' | 'In Progress';
}

export const handoverLogsList: HandoverRecord[] = [
  { id: 'HL-2401', date: '2026-08-12', outgoingEngineer: 'Mohammed Al-Dosari', incomingEngineer: 'Khalid Al-Shammari', tower: 'Integration Suite (CPI)', shift: 'Morning → Evening', criticalEvents: 'Core router B interface reset performed at 10:15 AM', openIncidents: 'INC-26082 (P2 WAN Latency)', pendingActions: 'Verify BGP route metrics', risks: 'High WAN utilization during peak hours', dependencies: 'Ooredoo Link Provider', status: 'Completed' },
  { id: 'HL-2402', date: '2026-08-12', outgoingEngineer: 'Rakesh Kumar', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'SAP Basis & Platform', shift: 'Night → Morning', criticalEvents: 'SAP Private Cloud host ESX-04 maintenance mode cleared', openIncidents: 'None', pendingActions: 'Run backup restore test on INF-003', risks: 'Memory utilization at 83% on host ESX-02', dependencies: 'Storage SAN Array', status: 'Completed' },
  { id: 'HL-2403', date: '2026-08-12', outgoingEngineer: 'Omar Al-Mutairi', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'HANA Database & Performance', shift: 'Evening → Night', criticalEvents: 'Oracle RAC DR node sync catchup initiated', openIncidents: 'INC-26083 (DB Replication Delay)', pendingActions: 'Monitor redo log apply rate', risks: 'Replication lag increased to 45s', dependencies: 'Ras Laffan DR Link', status: 'Attention Required' },
  { id: 'HL-2404', date: '2026-08-11', outgoingEngineer: 'Khalid Al-Shammari', incomingEngineer: 'Aisha Rahman', tower: 'AMS Service Management', shift: 'Night → Morning', criticalEvents: 'SAP Cloud ALM Health Monitoring alert volume normal overnight', openIncidents: 'INC-26081 (P1 App Connectivity)', pendingActions: 'Follow up with Application Support Lead', risks: 'Connection pool warning', dependencies: 'Oracle DB Pool', status: 'Completed' },
  { id: 'HL-2405', date: '2026-08-11', outgoingEngineer: 'Priya Nair', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'BTP & Fiori', shift: 'Morning → Evening', criticalEvents: 'GCP compute quota expansion request submitted', openIncidents: 'None', pendingActions: 'Review Azure SQL autoscale logs', risks: 'Cloud spend variance +4.7%', dependencies: 'Cloud Team', status: 'Completed' },
  { id: 'HL-2406', date: '2026-08-11', outgoingEngineer: 'Sara Al-Otaibi', incomingEngineer: 'Arjun Menon', tower: 'S/4HANA Supply Chain', shift: 'Morning → Evening', criticalEvents: 'SAP PO transaction throughput restored', openIncidents: 'INC-26081', pendingActions: 'Verify evening batch schedule', risks: 'High memory usage on SAP NetWeaver AS app server', dependencies: 'Middleware Team', status: 'Completed' },
  { id: 'HL-2407', date: '2026-08-10', outgoingEngineer: 'Daniel Mathew', incomingEngineer: 'Layla Hassan', tower: 'GRC & Security', shift: 'Morning → Evening', criticalEvents: 'SAP GRC Emergency Access (EAM) policy update deployed', openIncidents: 'None', pendingActions: 'Audit privileged access logs', risks: '14 certificate renewals approaching', dependencies: 'AppViewX PKI', status: 'Completed' },
  { id: 'HL-2408', date: '2026-08-10', outgoingEngineer: 'Layla Hassan', incomingEngineer: 'Aisha Rahman', tower: 'Enable Now & Adoption', shift: 'Evening → Night', criticalEvents: 'Teams & Exchange hybrid sync verified', openIncidents: 'None', pendingActions: 'Patch 45 remote endpoints', risks: 'VPN gateway CPU spike', dependencies: 'Ooredoo ExpressRoute', status: 'Completed' },
  { id: 'HL-2409', date: '2026-08-10', outgoingEngineer: 'Arjun Menon', incomingEngineer: 'Faisal Al-Harbi', tower: 'S/4HANA Supply Chain', shift: 'Morning → Evening', criticalEvents: 'Ansible remediation job expansion active', openIncidents: 'None', pendingActions: 'Review AI bot response logs', risks: 'Low training dataset for RCA assist', dependencies: 'ITSM Knowledge Base', status: 'Completed' },
  { id: 'HL-2410', date: '2026-08-09', outgoingEngineer: 'Huda Al-Salem', incomingEngineer: 'Faisal Al-Harbi', tower: 'AMS Service Management', shift: 'Morning → Evening', criticalEvents: 'CAB meeting approved 3 changes for weekend', openIncidents: 'CHG-1092', pendingActions: 'Distribute approved change schedule', risks: 'Emergency patch pending approval', dependencies: 'CAB Lead', status: 'Completed' },
  { id: 'HL-2411', date: '2026-08-09', outgoingEngineer: 'Vivek Srinivasan', incomingEngineer: 'Noura Al-Qahtani', tower: 'AMS Service Management', shift: 'Morning → Evening', criticalEvents: 'Monthly cloud budget review completed', openIncidents: 'None', pendingActions: 'Prepare WSR slide', risks: 'Idle VM cleanup pending owner approval', dependencies: 'Cloud Lead', status: 'Completed' },
  { id: 'HL-2412', date: '2026-08-08', outgoingEngineer: 'Mohammed Al-Dosari', incomingEngineer: 'Khalid Al-Shammari', tower: 'Integration Suite (CPI)', shift: 'Evening → Night', criticalEvents: 'SD-WAN failover test successful', openIncidents: 'None', pendingActions: 'Verify WAN telemetry in CPI Monitoring', risks: 'Mesaieed link latency elevated', dependencies: 'Telecom Vendor', status: 'Completed' },
  { id: 'HL-2413', date: '2026-08-08', outgoingEngineer: 'Ahmed Al-Qahtani', incomingEngineer: 'Rakesh Kumar', tower: 'SAP Basis & Platform', shift: 'Morning → Evening', criticalEvents: 'SAN storage firmware upgrade complete', openIncidents: 'None', pendingActions: 'Verify SAN multipathing on ESXi', risks: 'Storage volume at 72% capacity', dependencies: 'Vendor Support', status: 'Completed' },
  { id: 'HL-2414', date: '2026-08-07', outgoingEngineer: 'Omar Al-Mutairi', incomingEngineer: 'Ahmed Al-Qahtani', tower: 'HANA Database & Performance', shift: 'Morning → Evening', criticalEvents: 'PostgreSQL cluster maintenance completed', openIncidents: 'None', pendingActions: 'Validate DB connection pool', risks: 'High query latency on reporting DB', dependencies: 'App Support', status: 'Completed' },
  { id: 'HL-2415', date: '2026-08-07', outgoingEngineer: 'Aisha Rahman', incomingEngineer: 'Khalid Al-Shammari', tower: 'AMS Service Management', shift: 'Evening → Night', criticalEvents: 'Service Desk queue cleared before shift end', openIncidents: '2 P3 tickets open', pendingActions: 'First-line triage for night tickets', risks: 'Reduced staffing during night shift', dependencies: 'On-Call Roster', status: 'Completed' },
];

// ─── OPERATIONS MOM & ACTIONS DATA ────────────────────────────
export interface MomAction {
  id: string;
  meeting: string;
  tower: string;
  date: string;
  action: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Overdue';
  age: string;
  escalationRequired: boolean;
}

export const momActionsList: MomAction[] = [
  { id: 'ACT-001', meeting: 'Daily AMS Ops Standup', tower: 'SAP Basis & Platform', date: '2026-08-10', action: 'Complete backup restore validation on INF-003 compute cluster', owner: 'Rakesh Kumar', priority: 'High', dueDate: '2026-08-15', status: 'In Progress', age: '2 days', escalationRequired: false },
  { id: 'ACT-002', meeting: 'Weekly Network Tower Governance', tower: 'Integration Suite (CPI)', date: '2026-08-08', action: 'Review recurring WAN utilization alerts on Ooredoo link', owner: 'Mohammed Al-Dosari', priority: 'Medium', dueDate: '2026-08-14', status: 'Open', age: '4 days', escalationRequired: false },
  { id: 'ACT-003', meeting: 'ServiceNow Platform Review', tower: 'S/4HANA Supply Chain', date: '2026-08-05', action: 'Complete ServiceNow CMDB data-quality reconciliation for 4,300 CIs', owner: 'Arjun Menon', priority: 'High', dueDate: '2026-08-18', status: 'In Progress', age: '7 days', escalationRequired: false },
  { id: 'ACT-004', meeting: 'Monthly Cloud Steering', tower: 'BTP & Fiori', date: '2026-08-01', action: 'Finalize cloud cost optimization candidates for GCP Compute Engine', owner: 'Vivek Srinivasan', priority: 'Medium', dueDate: '2026-08-20', status: 'Open', age: '11 days', escalationRequired: false },
  { id: 'ACT-005', meeting: 'NOC Operations Review', tower: 'Integration Suite (CPI)', date: '2026-08-09', action: 'Close overdue monitoring coverage gaps for container nodes', owner: 'Khalid Al-Shammari', priority: 'High', dueDate: '2026-08-13', status: 'Open', age: '3 days', escalationRequired: true },
  { id: 'ACT-006', meeting: 'Database Operations Sync', tower: 'HANA Database & Performance', date: '2026-08-07', action: 'Upgrade Oracle RAC interconnect bandwidth to 40Gbps', owner: 'Omar Al-Mutairi', priority: 'High', dueDate: '2026-08-25', status: 'In Progress', age: '5 days', escalationRequired: false },
  { id: 'ACT-007', meeting: 'Security Operations Governance', tower: 'GRC & Security', date: '2026-08-06', action: 'Automate ACME protocol integration for internal PKI certificates', owner: 'Daniel Mathew', priority: 'High', dueDate: '2026-08-18', status: 'In Progress', age: '6 days', escalationRequired: false },
  { id: 'ACT-008', meeting: 'Application Support Standup', tower: 'S/4HANA Supply Chain', date: '2026-08-11', action: 'Tune SAP Cloud ALM Real User Monitoring latency threshold rules for SAP PO', owner: 'Sara Al-Otaibi', priority: 'Medium', dueDate: '2026-08-16', status: 'In Progress', age: '1 day', escalationRequired: false },
  { id: 'ACT-009', meeting: 'Cloud Governance Committee', tower: 'BTP & Fiori', date: '2026-08-04', action: 'Schedule automated shutdown for non-production dev clusters', owner: 'Priya Nair', priority: 'Medium', dueDate: '2026-08-22', status: 'Open', age: '8 days', escalationRequired: false },
  { id: 'ACT-010', meeting: 'Service Desk Review', tower: 'AMS Service Management', date: '2026-08-10', action: 'Update level-1 password reset Knowledge Base article KB-108', owner: 'Aisha Rahman', priority: 'Low', dueDate: '2026-08-17', status: 'Completed', age: '2 days', escalationRequired: false },
  { id: 'ACT-011', meeting: 'Program Management Office', tower: 'AMS Service Management', date: '2026-08-03', action: 'Obtain commercial sign-off for SAP Cloud ALM license capacity expansion', owner: 'Noura Al-Qahtani', priority: 'High', dueDate: '2026-08-12', status: 'Overdue', age: '9 days', escalationRequired: true },
  { id: 'ACT-012', meeting: 'Change Advisory Board', tower: 'AMS Service Management', date: '2026-08-09', action: 'Review emergency patch backout procedure for Oracle RAC cluster', owner: 'Huda Al-Salem', priority: 'High', dueDate: '2026-08-14', status: 'Completed', age: '3 days', escalationRequired: false },
  { id: 'ACT-013', meeting: 'Digital Workplace Sync', tower: 'Enable Now & Adoption', date: '2026-08-08', action: 'Deploy Teams video endpoint bandwidth optimization policy', owner: 'Layla Hassan', priority: 'Low', dueDate: '2026-08-19', status: 'Open', age: '4 days', escalationRequired: false },
  { id: 'ACT-014', meeting: 'Daily AMS Ops Standup', tower: 'AMS Service Management', date: '2026-08-12', action: 'Confirm NOC night shift standby replacement resource assignment', owner: 'Faisal Al-Harbi', priority: 'High', dueDate: '2026-08-12', status: 'Completed', age: '0 days', escalationRequired: false },
  { id: 'ACT-015', meeting: 'Vendor SIAM Review', tower: 'AMS Service Management', date: '2026-08-02', action: 'Audit Gulf Technology Services SLA penalty calculation report', owner: 'Noura Al-Qahtani', priority: 'Medium', dueDate: '2026-08-28', status: 'Open', age: '10 days', escalationRequired: false },
  { id: 'ACT-016', meeting: 'SAP Basis Review', tower: 'S/4HANA Finance', date: '2026-08-11', action: 'Plan SAP ECC upgrade window for Q4 release', owner: 'Sara Al-Otaibi', priority: 'High', dueDate: '2026-08-30', status: 'In Progress', age: '1 day', escalationRequired: false },
  { id: 'ACT-017', meeting: 'Security Review', tower: 'GRC & Security', date: '2026-08-12', action: 'Complete vulnerability remediation for critical CVEs', owner: 'Daniel Mathew', priority: 'High', dueDate: '2026-08-16', status: 'In Progress', age: '0 days', escalationRequired: true },
];

// ─── LEAVE MANAGEMENT DATA ────────────────────────────────────
/**
 * LEAVE — SOW Appendix 1 §7.6 and §7.1
 * ---------------------------------------------------------------------------
 * §7.6: "In case of leave, e.g. sick leave, personal emergency, the CONTRACTOR
 * personnel shall inform the COMPANY REPRESENTATIVE. For the case of annual
 * leave the CONTRACTOR shall inform the COMPANY REPRESENTATIVE for approval at
 * the minimum of 2 weeks in advance."
 *
 * So the two paths are different obligations, and the register keeps them
 * apart: annual leave requires COMPANY approval and at least 14 days notice;
 * sick and emergency leave are notify-only and must never be blocked behind an
 * approval queue.
 *
 * §7.1 requires a backup or replacement for any absence, so a request without
 * a named backup is incomplete.
 */
export const ANNUAL_LEAVE_NOTICE_DAYS = 14;

export type LeaveType = 'Annual Leave' | 'Emergency Leave' | 'Sick Leave' | 'Training Leave';

/** §7.6 — only annual leave is gated on COMPANY approval. */
export function requiresCompanyApproval(type: LeaveType): boolean {
  return type === 'Annual Leave';
}

export interface LeaveRecord {
  id: string;
  employee: string;
  employeeId: string;
  tower: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  submittedDate: string;
  reportingManager: string;
  approver: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Cancelled';
  backupResource: string;
  /** Calendar days between submission and the first day of leave. */
  noticeDays: number;
  /** §7.6 — annual leave only; false means the two-week rule was not met. */
  noticeCompliant: boolean;
  /** §7.6 — annual leave needs COMPANY approval; other types are notifications. */
  companyApprovalRequired: boolean;
  decisionReason?: string;
}

interface LeaveSeed {
  id: string;
  employee: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  submittedDate: string;
  backupResource: string;
  status: LeaveRecord['status'];
  decisionReason?: string;
}

const LEAVE_SEEDS: LeaveSeed[] = [
  { id: 'LEV-101', employee: 'Faisal Al-Harbi',     leaveType: 'Annual Leave',    startDate: '2026-08-20', endDate: '2026-08-22', reason: 'Family vacation',                       submittedDate: '2026-08-01', backupResource: 'Mohammed Al-Dosari', status: 'Approved' },
  { id: 'LEV-102', employee: 'Omar Al-Mutairi',     leaveType: 'Annual Leave',    startDate: '2026-08-25', endDate: '2026-08-29', reason: 'Personal travel',                       submittedDate: '2026-08-05', backupResource: 'Rakesh Kumar',       status: 'Pending' },
  { id: 'LEV-103', employee: 'Rakesh Kumar',        leaveType: 'Emergency Leave', startDate: '2026-08-10', endDate: '2026-08-11', reason: 'Family emergency',                      submittedDate: '2026-08-09', backupResource: 'Omar Al-Mutairi',    status: 'Approved' },
  { id: 'LEV-104', employee: 'Sara Al-Otaibi',      leaveType: 'Training Leave',  startDate: '2026-09-01', endDate: '2026-09-03', reason: 'SAP S/4HANA Finance certification',      submittedDate: '2026-08-10', backupResource: 'Aisha Rahman',       status: 'Pending' },
  { id: 'LEV-105', employee: 'Khalid Al-Shammari',  leaveType: 'Sick Leave',      startDate: '2026-08-04', endDate: '2026-08-05', reason: 'Medical appointment',                   submittedDate: '2026-08-03', backupResource: 'Arjun Menon',        status: 'Approved' },
  { id: 'LEV-106', employee: 'Priya Nair',          leaveType: 'Annual Leave',    startDate: '2026-09-10', endDate: '2026-09-18', reason: 'Home country visit',                    submittedDate: '2026-08-01', backupResource: 'Faisal Al-Harbi',    status: 'Approved' },
  { id: 'LEV-107', employee: 'Daniel Mathew',       leaveType: 'Training Leave',  startDate: '2026-08-18', endDate: '2026-08-19', reason: 'SAP GRC Access Control 12.0 workshop',   submittedDate: '2026-08-05', backupResource: 'Rakesh Kumar',       status: 'Pending' },
  { id: 'LEV-108', employee: 'Arjun Menon',         leaveType: 'Annual Leave',    startDate: '2026-08-28', endDate: '2026-09-02', reason: 'Personal travel',                       submittedDate: '2026-08-24', backupResource: 'Khalid Al-Shammari', status: 'Pending' },
  { id: 'LEV-109', employee: 'Layla Hassan',        leaveType: 'Emergency Leave', startDate: '2026-07-28', endDate: '2026-07-29', reason: 'Family matter',                         submittedDate: '2026-07-27', backupResource: 'Aisha Rahman',       status: 'Approved' },
  { id: 'LEV-110', employee: 'Aisha Rahman',        leaveType: 'Annual Leave',    startDate: '2026-09-05', endDate: '2026-09-12', reason: 'Annual vacation',                       submittedDate: '2026-08-08', backupResource: 'Sara Al-Otaibi',     status: 'Pending' },
  { id: 'LEV-111', employee: 'Mohammed Al-Dosari',  leaveType: 'Annual Leave',    startDate: '2026-09-15', endDate: '2026-09-22', reason: 'Personal travel',                       submittedDate: '2026-08-05', backupResource: 'Tariq Al-Ghamdi',    status: 'Pending' },
  { id: 'LEV-112', employee: 'Ahmed Al-Qahtani',    leaveType: 'Annual Leave',    startDate: '2026-10-01', endDate: '2026-10-08', reason: 'Family holiday',                        submittedDate: '2026-08-01', backupResource: 'Layla Hassan',       status: 'Approved' },
  { id: 'LEV-113', employee: 'Noura Al-Qahtani',    leaveType: 'Training Leave',  startDate: '2026-08-24', endDate: '2026-08-25', reason: 'SAP Activate project management',        submittedDate: '2026-08-08', backupResource: 'Huda Al-Salem',      status: 'Approved' },
  { id: 'LEV-114', employee: 'Huda Al-Salem',       leaveType: 'Annual Leave',    startDate: '2026-09-20', endDate: '2026-09-25', reason: 'Personal time off',                     submittedDate: '2026-09-14', backupResource: 'Noura Al-Qahtani',   status: 'Pending' },
];

/** Whole calendar days between two ISO dates. */
export function daysBetween(fromIso: string, toIso: string): number {
  const ms = new Date(`${toIso}T00:00:00`).getTime() - new Date(`${fromIso}T00:00:00`).getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * Build a leave record. Identity, SAP domain and reporting line are read from
 * the roster rather than authored, so a leave row can never name a tower or a
 * manager the team does not have.
 */
export function buildLeaveRecord(seed: LeaveSeed): LeaveRecord {
  const person = masterEmployees.find((e) => e.name === seed.employee);
  const noticeDays = daysBetween(seed.submittedDate, seed.startDate);
  const needsCompany = requiresCompanyApproval(seed.leaveType);
  return {
    id: seed.id,
    employee: seed.employee,
    employeeId: person?.employeeId ?? 'UNASSIGNED',
    tower: person?.tower ?? 'Unassigned',
    leaveType: seed.leaveType,
    startDate: seed.startDate,
    endDate: seed.endDate,
    days: daysBetween(seed.startDate, seed.endDate) + 1,
    reason: seed.reason,
    submittedDate: seed.submittedDate,
    reportingManager: person?.manager ?? 'Unassigned',
    approver: needsCompany ? 'COMPANY REPRESENTATIVE (DBS)' : (person?.manager ?? 'Unassigned'),
    status: seed.status,
    backupResource: seed.backupResource,
    noticeDays,
    noticeCompliant: !needsCompany || noticeDays >= ANNUAL_LEAVE_NOTICE_DAYS,
    companyApprovalRequired: needsCompany,
    decisionReason: seed.decisionReason,
  };
}

export const leaveRecordsList: LeaveRecord[] = LEAVE_SEEDS.map(buildLeaveRecord);

export interface AttendanceRecord {
  id: string;
  employee: string;
  employeeId: string;
  tower: string;
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'On Leave' | 'Absent' | 'Remote' | 'Training';
  workLocation: string;
}

export const attendanceRecordsList: AttendanceRecord[] = masterEmployees.map((emp, idx) => ({
  id: `ATT-${1000 + idx + 1}`,
  employee: emp.name,
  employeeId: emp.employeeId,
  tower: emp.tower,
  date: '2026-08-12',
  shift: emp.shift,
  checkIn: emp.status === 'On Leave' || emp.status === 'Training' ? 'N/A' : emp.shift.startsWith('Morning') ? '05:55 AM' : emp.shift.startsWith('Evening') ? '01:52 PM' : '09:50 PM',
  checkOut: emp.status === 'On Leave' || emp.status === 'Training' ? 'N/A' : emp.shift.startsWith('Morning') ? '02:05 PM' : emp.shift.startsWith('Evening') ? '10:05 PM' : '06:05 AM',
  status: emp.status === 'On Leave' ? 'On Leave' : emp.status === 'Training' ? 'Training' : emp.status === 'Remote' ? 'Remote' : emp.status === 'Standby' ? 'Absent' : 'Present',
  workLocation: emp.location,
}));

// ─── EMPLOYEE STATS HELPERS ───────────────────────────────────
export function getEmployeeStats(towerFilter?: string) {
  const filtered = towerFilter && towerFilter !== 'All SAP Domains'
    ? masterEmployees.filter(e => e.tower === towerFilter)
    : masterEmployees;

  const total = filtered.length;
  const present = filtered.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const onLeave = filtered.filter(e => e.status === 'On Leave').length;
  const training = filtered.filter(e => e.status === 'Training').length;
  const absent = filtered.filter(e => e.status === 'Standby').length;
  const other = total - present - onLeave - training - absent;

  return { total, present, onLeave, training, absent, other };
}

export function getEmployeeStatsByTower() {
  const towers = [...new Set(masterEmployees.map(e => e.tower))];
  return towers.map(tower => ({
    tower,
    ...getEmployeeStats(tower),
  }));
}

// ─── CONSISTENCY GUARD ─────────────────────────────────────────
/**
 * The roster and the Annex 1 transcription must agree on the priced baseline.
 * If a resource is added, removed or reclassified without the annex changing,
 * this throws at module load rather than letting two screens quietly report
 * different team sizes — the defect this rebuild exists to remove.
 *
 * Annex 1 sheet 2: nine dedicated FTE, six onshore and three offshore.
 */
function assertAnnex1Reconciliation(): void {
  const problems: string[] = [];
  if (CONTRACTED_FTE.dedicated !== 9) problems.push(`dedicated FTE is ${CONTRACTED_FTE.dedicated}, Annex 1 prices 9`);
  if (CONTRACTED_FTE.onshore !== 6) problems.push(`onshore dedicated is ${CONTRACTED_FTE.onshore}, Annex 1 prices 6`);
  if (CONTRACTED_FTE.offshore !== 3) problems.push(`offshore dedicated is ${CONTRACTED_FTE.offshore}, Annex 1 prices 3`);

  const ids = new Set<string>();
  for (const e of masterEmployees) {
    if (ids.has(e.employeeId)) problems.push(`duplicate employee id ${e.employeeId}`);
    ids.add(e.employeeId);
  }

  for (const d of getQatarizationStats().domains) {
    if (d.totalCount === 0) continue;
    const recomputed = Math.round((d.qatariCount / d.totalCount) * 1000) / 10;
    if (recomputed !== d.actualPct) {
      problems.push(`${d.locationBucket}: reports ${d.actualPct}% but ${d.qatariCount}/${d.totalCount} is ${recomputed}%`);
    }
  }

  if (problems.length) {
    throw new Error(`Roster does not reconcile to Annex 1:\n  - ${problems.join('\n  - ')}`);
  }
}

assertAnnex1Reconciliation();

// ─── TIMESHEETS — SOW App.1 §2.4.1(d) ──────────────────────────────────
/**
 * The monthly Effort / Service Consumption Report is what timesheets feed:
 * "Detailed breakdown of effort or service consumption across AMS services…
 * supports billing validation, capacity planning, and trend analysis for
 * governance forums."
 *
 * Effort is therefore booked against RUN or CHANGE, because that split decides
 * whether it sits inside the AMS Run fixed monthly fee or is chargeable
 * Elastic capacity — the boundary that INT-01 in the interpretation register
 * is still waiting on COMPANY to confirm.
 *
 * Annex 2 names the measurement tool for TPM1/TPM2 as "the client's hourly
 * registration system". This register is the CONTRACTOR-side record that
 * reconciles to it; it is not the system of record.
 */
export type EffortTrack = 'RUN' | 'CHANGE (Elastic)';

export interface TimesheetEntry {
  id: string;
  employee: string;
  employeeId: string;
  weekEnding: string;
  track: EffortTrack;
  activity: string;
  /** SAP domain the effort was booked against. */
  tower: string;
  hours: number;
  /** Ticket, change or project reference the hours are booked to. */
  reference: string;
  status: 'Draft' | 'Submitted' | 'Approved';
}

interface TimesheetSeed {
  employee: string; weekEnding: string; track: EffortTrack;
  activity: string; hours: number; reference: string; status: TimesheetEntry['status'];
}

const TIMESHEET_SEEDS: TimesheetSeed[] = [
  { employee: 'Sara Al-Otaibi',     weekEnding: '2026-08-27', track: 'RUN',              activity: 'Incident resolution — FI settlement and VIM exceptions', hours: 31, reference: 'INC10012, INC10031', status: 'Approved' },
  { employee: 'Sara Al-Otaibi',     weekEnding: '2026-08-27', track: 'CHANGE (Elastic)', activity: 'SAC finance story rebuild on the new CDS view',           hours: 14, reference: 'CHG004320',          status: 'Approved' },
  { employee: 'Mohammed Al-Dosari', weekEnding: '2026-08-27', track: 'RUN',              activity: 'Procurement and inventory support, CAB preparation',      hours: 38, reference: 'INC10044, CHG004311', status: 'Approved' },
  { employee: 'Tariq Al-Ghamdi',    weekEnding: '2026-08-27', track: 'RUN',              activity: 'Warehouse and quality management support',                hours: 41, reference: 'INC10058',            status: 'Approved' },
  { employee: 'Faisal Al-Harbi',    weekEnding: '2026-08-27', track: 'RUN',              activity: 'Plant maintenance support and preventive checks',         hours: 36, reference: 'INC10061',            status: 'Submitted' },
  { employee: 'Layla Hassan',       weekEnding: '2026-08-27', track: 'RUN',              activity: 'SuccessFactors release regression and RBP review',        hours: 33, reference: 'INC10070, SR-2041',   status: 'Submitted' },
  { employee: 'Layla Hassan',       weekEnding: '2026-08-27', track: 'CHANGE (Elastic)', activity: 'RBP permission group restructure for the new org unit',   hours: 9,  reference: 'CHG004315',           status: 'Submitted' },
  { employee: 'Rakesh Kumar',       weekEnding: '2026-08-27', track: 'RUN',              activity: 'Basis monitoring, transport management, kernel checks',   hours: 40, reference: 'INC10003, TRP-8841',  status: 'Approved' },
  { employee: 'Daniel Mathew',      weekEnding: '2026-08-27', track: 'RUN',              activity: 'GRC ARM provisioning, EAM log review, SoD remediation',   hours: 37, reference: 'SR-2033, SR-2038',    status: 'Approved' },
  { employee: 'Priya Nair',         weekEnding: '2026-08-27', track: 'RUN',              activity: 'Project Systems support and period-end close assistance', hours: 34, reference: 'INC10052',            status: 'Submitted' },
  { employee: 'Khalid Al-Shammari', weekEnding: '2026-08-27', track: 'RUN',              activity: 'CPI iFlow monitoring and payload error handling',         hours: 29, reference: 'INC10019, INC10027',  status: 'Submitted' },
  { employee: 'Arjun Menon',        weekEnding: '2026-08-27', track: 'CHANGE (Elastic)', activity: 'SAC planning model dimension extension',                  hours: 22, reference: 'CHG004334',           status: 'Draft' },
  { employee: 'Omar Al-Mutairi',    weekEnding: '2026-08-27', track: 'RUN',              activity: 'HANA performance tuning ahead of month-end close',        hours: 18, reference: 'INC10001',            status: 'Draft' },
  { employee: 'Aisha Rahman',       weekEnding: '2026-08-27', track: 'RUN',              activity: 'Ariba SLP onboarding and VIM workflow queue clearance',   hours: 26, reference: 'SR-2050',             status: 'Submitted' },
];

export const timesheetEntries: TimesheetEntry[] = TIMESHEET_SEEDS.map((seed, i) => {
  const person = masterEmployees.find((e) => e.name === seed.employee);
  return {
    id: `TS-${2001 + i}`,
    employee: seed.employee,
    employeeId: person?.employeeId ?? 'UNASSIGNED',
    tower: person?.tower ?? 'Unassigned',
    weekEnding: seed.weekEnding,
    track: seed.track,
    activity: seed.activity,
    hours: seed.hours,
    reference: seed.reference,
    status: seed.status,
  };
});

/** Effort split for the monthly Effort / Service Consumption Report (§2.4.1 d). */
export function getEffortSplit(entries: TimesheetEntry[] = timesheetEntries) {
  const run = entries.filter((e) => e.track === 'RUN').reduce((n, e) => n + e.hours, 0);
  const change = entries.filter((e) => e.track === 'CHANGE (Elastic)').reduce((n, e) => n + e.hours, 0);
  const total = run + change;
  return {
    runHours: run,
    changeHours: change,
    totalHours: total,
    runPct: total ? Math.round((run / total) * 1000) / 10 : 0,
    changePct: total ? Math.round((change / total) * 1000) / 10 : 0,
    awaitingApproval: entries.filter((e) => e.status !== 'Approved').length,
  };
}
