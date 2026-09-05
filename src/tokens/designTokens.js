/**
 * EDGE AMS Control Tower — Centralized Design Tokens
 * 
 * SOURCE: EDGE public brand direction (Section 7 of Master Build Prompt)
 * CLASSIFICATION: CONFIGURABLE — approved EDGE brand assets/tokens can be substituted later
 * 
 * IMPORTANT: Orange is brand/action, NEVER warning/critical.
 */

export const colors = {
  // ── EDGE Brand ──
  // Sampled from EDGE's public site — strong starting point, not immutable
  primary: '#FF5622',        // Primary orange — action, active, brand highlight, selected nav
  primaryHover: '#E84D1E',
  primaryLight: 'rgba(255, 86, 34, 0.08)',
  primaryMedium: 'rgba(255, 86, 34, 0.15)',
  logoAccent: '#F05232',     // Logo-accent orange

  // ── Neutrals ──
  charcoal: '#434B51',       // Headings / primary text
  charcoalDark: '#2D3339',
  greySecondary: '#71777C',  // Secondary text
  greyTertiary: '#9CA3AB',   // Tertiary / placeholder
  greyBorder: '#DFE1E4',     // Borders
  greyDivider: '#EBEDF0',    // Dividers
  greyBg: '#F5F5F5',         // Background surfaces
  greyBgLight: '#FAFAFA',    // Lighter background
  white: '#FFFFFF',

  // ── Semantic — Status Colors ──
  // IMPORTANT: Orange must NOT mean warning or critical
  green: '#0D9F6E',          // Healthy, completed, positive
  greenLight: 'rgba(13, 159, 110, 0.08)',
  greenBg: '#ECFDF5',

  amber: '#D97706',          // At risk, warning
  amberLight: 'rgba(217, 119, 6, 0.08)',
  amberBg: '#FFFBEB',

  red: '#DC2626',            // Critical, breached, error
  redLight: 'rgba(220, 38, 38, 0.08)',
  redBg: '#FEF2F2',

  blue: '#2563EB',           // Information
  blueLight: 'rgba(37, 99, 235, 0.08)',
  blueBg: '#EFF6FF',

  purple: '#7C3AED',         // Innovation
  purpleLight: 'rgba(124, 58, 237, 0.08)',
  purpleBg: '#F5F3FF',

  // ── Dark Mode Surfaces ──
  dark: {
    bg: '#0F1114',
    surface: '#181B20',
    surfaceRaised: '#1E2228',
    surfaceOverlay: '#252A31',
    border: '#2E343B',
    borderSubtle: '#252A31',
    text: '#F0F1F3',
    textSecondary: '#9CA3AB',
    textTertiary: '#6B7280',
  },
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyAr: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Inter', sans-serif",
  fontFamilyMono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",

  // Scale
  xs: '0.6875rem',     // 11px
  sm: '0.75rem',       // 12px
  base: '0.8125rem',   // 13px
  md: '0.875rem',      // 14px
  lg: '1rem',          // 16px
  xl: '1.25rem',       // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '2rem',       // 32px
  '4xl': '2.5rem',     // 40px
  '5xl': '3.25rem',    // 52px
  '6xl': '4rem',       // 64px

  // Weights
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.65,
};

export const spacing = {
  xxs: '0.125rem',   // 2px
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  md: '0.75rem',     // 12px
  base: '1rem',      // 16px
  lg: '1.25rem',     // 20px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  '3xl': '2.5rem',   // 40px
  '4xl': '3rem',     // 48px
  '5xl': '4rem',     // 64px
  '6xl': '5rem',     // 80px
};

export const radii = {
  sm: '4px',
  md: '6px',
  base: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
  // Dark mode shadows
  darkSm: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
  darkMd: '0 4px 6px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2)',
  darkLg: '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2)',
};

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  sidebar: 300,
  header: 400,
  overlay: 500,
  drawer: 600,
  modal: 700,
  popover: 800,
  toast: 900,
  tooltip: 1000,
};

export const transitions = {
  fast: '120ms ease',
  base: '200ms ease',
  medium: '300ms ease',
  slow: '500ms ease',
  spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ── RBAC Role Definitions (Section 83) ──
// CLASSIFICATION: PROPOSED — architecture for future backend enforcement
export const roles = {
  EXECUTIVE: 'Executive',
  AMS_LEAD: 'AMS Lead',
  SERVICE_MANAGER: 'Service Manager',
  INCIDENT_MANAGER: 'Incident Manager',
  GOVERNANCE_MANAGER: 'Governance Manager',
  RESOURCE_MANAGER: 'Resource Manager',
  APPLICATION_MANAGER: 'Application Manager',
  CUSTOMER_MANAGER: 'Customer Manager',
  AUDITOR: 'Auditor',
  ANALYST: 'Analyst',
  ADMINISTRATOR: 'Administrator',
};

// ── Source Traceability Classifications (Section 74) ──
export const sourceClassification = {
  SOURCE_CONFIRMED: 'SOURCE-CONFIRMED',
  RFP_SOW: 'RFP / SOW',
  EXCEL_BUILD_SPEC: 'EXCEL-BUILD-SPEC',
  REFERENCE_DERIVED: 'REFERENCE-DERIVED',
  CONFIGURABLE: 'CONFIGURABLE',
  DEMO: 'DEMO',
  PROPOSED: 'PROPOSED',
};
