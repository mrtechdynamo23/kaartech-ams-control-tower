/**
 * EDGE AMS Control Tower — Global Calendar Types & Semantic Theme Tokens
 * Enterprise AMS palette with separate Light Mode and Dark Mode tokens.
 * Single source of truth mapping for all 15 operational event categories.
 */

export const EVENT_TYPES = {
  LEAVE: 'LEAVE',
  AUDIT: 'AUDIT',
  AUDIT_TASK: 'AUDIT_TASK',
  PROGRAM_MILESTONE: 'PROGRAM_MILESTONE',
  CHANGE: 'CHANGE',
  RELEASE: 'RELEASE',
  MEETING: 'MEETING',
  MOM: 'MOM',
  MOM_ACTION: 'MOM_ACTION',
  TRANSITION_MILESTONE: 'TRANSITION_MILESTONE',
  TRAINING: 'TRAINING',
  KNOWLEDGE_REVIEW: 'KNOWLEDGE_REVIEW',
  SLA_REVIEW: 'SLA_REVIEW',
  CUSTOMER_MEETING: 'CUSTOMER_MEETING',
  CRITICAL_BUSINESS_PERIOD: 'CRITICAL_BUSINESS_PERIOD',
};

export const VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda',
};

/**
 * Enterprise Semantic Color Configurations
 * Restrained tints, subtle borders, high-contrast dark text in light mode,
 * clean readable text in dark mode. EDGE orange (#FF5622) is reserved for brand/primary action ONLY.
 */
export const EVENT_TYPE_CONFIG = {
  [EVENT_TYPES.MEETING]: {
    key: EVENT_TYPES.MEETING,
    label: 'SteerCom & Reviews',
    labelAr: 'لجان التوجيه والمراجعات',
    group: 'Operation',
    cssClass: 'cal-type-MEETING',
    dotColor: '#64748B', // Blue-gray
    badgeClass: 'badge-neutral',
    sourceModule: 'Customer Connect',
    sourceRoute: '/customer/corner',
  },
  [EVENT_TYPES.MOM]: {
    key: EVENT_TYPES.MOM,
    label: 'Minutes of Meeting (MOM)',
    labelAr: 'محاضر الاجتماعات (MOM)',
    group: 'Governance',
    cssClass: 'cal-type-MOM',
    dotColor: '#6366F1', // Governance Indigo
    badgeClass: 'badge-primary',
    sourceModule: 'MOM & Action Hub',
    sourceRoute: '/governance/actions',
  },
  [EVENT_TYPES.MOM_ACTION]: {
    key: EVENT_TYPES.MOM_ACTION,
    label: 'MOM Action Items',
    labelAr: 'إجراءات ومتابعات MOM',
    group: 'Governance',
    cssClass: 'cal-type-MOM_ACTION',
    dotColor: '#D97706', // Warm Amber
    overdueDotColor: '#DC2626', // Semantic Red
    badgeClass: 'badge-warning',
    sourceModule: 'CTA / Action Hub',
    sourceRoute: '/governance/actions',
  },
  [EVENT_TYPES.LEAVE]: {
    key: EVENT_TYPES.LEAVE,
    label: 'Approved Leave',
    labelAr: 'إجازة معتمدة',
    group: 'Resource',
    cssClass: 'cal-type-LEAVE',
    dotColor: '#10B981', // Restrained emerald
    badgeClass: 'badge-success',
    sourceModule: 'Time Management',
    sourceRoute: '/resources/time',
  },
  [EVENT_TYPES.AUDIT]: {
    key: EVENT_TYPES.AUDIT,
    label: 'Compliance & Audits',
    labelAr: 'التدقيق والامتثال',
    group: 'Governance',
    cssClass: 'cal-type-AUDIT',
    dotColor: '#D97706', // Governance Amber
    badgeClass: 'badge-warning',
    sourceModule: 'Audit Planner',
    sourceRoute: '/governance/audits',
  },
  [EVENT_TYPES.AUDIT_TASK]: {
    key: EVENT_TYPES.AUDIT_TASK,
    label: 'Audit Tasks & CTAs',
    labelAr: 'مهام التدقيق وإجراءات المتابعة',
    group: 'Governance',
    cssClass: 'cal-type-AUDIT_TASK',
    dotColor: '#7C3AED', // Action Violet
    badgeClass: 'badge-info',
    sourceModule: 'Audit Task Board',
    sourceRoute: '/governance/actions',
  },
  [EVENT_TYPES.PROGRAM_MILESTONE]: {
    key: EVENT_TYPES.PROGRAM_MILESTONE,
    label: 'Program Milestones',
    labelAr: 'معالم البرامج والتحول',
    group: 'Governance',
    cssClass: 'cal-type-PROGRAM_MILESTONE',
    dotColor: '#2563EB', // Blue
    badgeClass: 'badge-primary',
    sourceModule: 'Program Governance',
    sourceRoute: '/governance/programs',
  },
  [EVENT_TYPES.CHANGE]: {
    key: EVENT_TYPES.CHANGE,
    label: 'CAB Changes',
    labelAr: 'تغييرات معتمدة من CAB',
    group: 'Operation',
    cssClass: 'cal-type-CHANGE',
    dotColor: '#B45309', // Warm Amber
    badgeClass: 'badge-warning',
    sourceModule: 'Change Management',
    sourceRoute: '/technology/releases',
  },
  [EVENT_TYPES.RELEASE]: {
    key: EVENT_TYPES.RELEASE,
    label: 'Production Releases',
    labelAr: 'إصدارات الإنتاج',
    group: 'Technology',
    cssClass: 'cal-type-RELEASE',
    dotColor: '#7C3AED', // Technology Purple
    badgeClass: 'badge-info',
    sourceModule: 'Release Health',
    sourceRoute: '/technology/releases',
  },
  [EVENT_TYPES.TRANSITION_MILESTONE]: {
    key: EVENT_TYPES.TRANSITION_MILESTONE,
    label: 'Transition Gates & KT',
    labelAr: 'بوابات الانتقال ونقل المعرفة',
    group: 'Governance',
    cssClass: 'cal-type-TRANSITION_MILESTONE',
    dotColor: '#0D9488', // Teal
    badgeClass: 'badge-success',
    sourceModule: 'Transition & Readiness',
    sourceRoute: '/governance/transition',
  },
  [EVENT_TYPES.TRAINING]: {
    key: EVENT_TYPES.TRAINING,
    label: 'User Enablement Clinics',
    labelAr: 'ورش التدريب والتمكين',
    group: 'Capability',
    cssClass: 'cal-type-TRAINING',
    dotColor: '#059669', // Emerald
    badgeClass: 'badge-success',
    sourceModule: 'Knowledge Management',
    sourceRoute: '/service-operation/knowledge',
  },
  [EVENT_TYPES.KNOWLEDGE_REVIEW]: {
    key: EVENT_TYPES.KNOWLEDGE_REVIEW,
    label: 'SOP & Runbook Reviews',
    labelAr: 'مراجعات أدلة التشغيل القياسية',
    group: 'Capability',
    cssClass: 'cal-type-KNOWLEDGE_REVIEW',
    dotColor: '#9333EA', // Deep Purple
    badgeClass: 'badge-info',
    sourceModule: 'Knowledge Management',
    sourceRoute: '/service-operation/knowledge',
  },
  [EVENT_TYPES.SLA_REVIEW]: {
    key: EVENT_TYPES.SLA_REVIEW,
    label: 'SLA Governance Reviews',
    labelAr: 'مراجعات اتفاقيات مستوى الخدمة',
    group: 'Governance',
    cssClass: 'cal-type-SLA_REVIEW',
    dotColor: '#1D4ED8', // Deep Blue
    badgeClass: 'badge-primary',
    sourceModule: 'SLA Management',
    sourceRoute: '/sla/contract',
  },
  [EVENT_TYPES.CUSTOMER_MEETING]: {
    key: EVENT_TYPES.CUSTOMER_MEETING,
    label: 'Customer Connect Sessions',
    labelAr: 'جلسات التواصل مع العملاء',
    group: 'Customer',
    cssClass: 'cal-type-CUSTOMER_MEETING',
    dotColor: '#0891B2', // Cyan
    badgeClass: 'badge-info',
    sourceModule: 'Customer Connect',
    sourceRoute: '/customer/corner',
  },
  [EVENT_TYPES.CRITICAL_BUSINESS_PERIOD]: {
    key: EVENT_TYPES.CRITICAL_BUSINESS_PERIOD,
    label: 'Freezes & Critical Windows',
    labelAr: 'فترات التجميد والعمليات الحرجة',
    group: 'Governance',
    cssClass: 'cal-type-CRITICAL_BUSINESS_PERIOD',
    dotColor: '#DC2626', // Semantic Critical Red
    badgeClass: 'badge-error',
    sourceModule: 'Change Management',
    sourceRoute: '/technology/releases',
  },
};
