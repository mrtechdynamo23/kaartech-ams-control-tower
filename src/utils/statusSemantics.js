/**
 * EDGE AMS Control Tower — Centralized Status & Priority Semantics
 * Section 5, 6, 7 of Master Build Specification.
 * 
 * Strict semantic rules:
 * - EDGE Orange (#FF5622) is BRAND ONLY. Never used as a warning/risk color.
 * - Neutral: #7A8288 (Draft, New, Planned, Not Started)
 * - Active / In Progress: #3B82C4 (In Progress, Under Review, In Development, Testing, Build, UAT, Mitigating, Monitoring)
 * - Waiting: #E5A000 (Awaiting Info, Pending, On Hold, Under Investigation)
 * - Attention: #E5A000 (At Risk, Escalated, Overdue, Root Cause Identified, Corrective Action, Partially Compliant)
 * - Success: #159A6A (Resolved, Closed, Approved, Deployed, Completed, Compliant, Delivered, Remediated, Met, Healthy, Pass)
 * - Critical: #D92D20 (Breached, Rejected, Critical, Failed, Non-Compliant, Cancelled)
 * - Priority: P1 (#D92D20), P2 (#E5A000), P3 (#3B82C4), P4 (#7A8288)
 * - Enhancement / Innovation Stream: #7357B8
 */

export const SEMANTIC_COLORS = {
  neutral: '#7A8288',
  active: '#3B82C4',
  waiting: '#E5A000',
  attention: '#E5A000',
  success: '#159A6A',
  critical: '#D92D20',
  brand: '#FF5622',
  innovation: '#7357B8',
};

export const PRIORITY_COLORS = {
  P1: '#D92D20',
  P2: '#E5A000',
  P3: '#3B82C4',
  P4: '#7A8288',
  Critical: '#D92D20',
  High: '#E5A000',
  Medium: '#3B82C4',
  Low: '#7A8288',
};

/**
 * Returns the semantic category, color, background, and icon descriptor for any operational status literal.
 */
export function getStatusSemantic(status) {
  if (!status) {
    return {
      category: 'neutral',
      color: SEMANTIC_COLORS.neutral,
      bg: 'rgba(122, 130, 136, 0.12)',
      border: 'rgba(122, 130, 136, 0.3)',
      label: 'Unknown',
    };
  }

  const s = String(status).trim().toLowerCase();

  // 1. Critical / Failure / Breached / Rejected
  if (
    s === 'breached' ||
    s === 'rejected' ||
    s === 'critical' ||
    s === 'failed' ||
    s === 'non-compliant' ||
    s === 'cancelled' ||
    s === 'escalated' ||
    s === 'overdue'
  ) {
    return {
      category: 'critical',
      color: SEMANTIC_COLORS.critical,
      bg: 'rgba(217, 45, 32, 0.12)',
      border: 'rgba(217, 45, 32, 0.35)',
      label: status,
    };
  }

  // 2. Success / Resolved / Compliant / Closed / Healthy
  if (
    s === 'resolved' ||
    s === 'closed' ||
    s === 'approved' ||
    s === 'deployed' ||
    s === 'completed' ||
    s === 'compliant' ||
    s === 'delivered' ||
    s === 'remediated' ||
    s === 'met' ||
    s === 'healthy' ||
    s === 'pass' ||
    s === 'active (24/7)' ||
    s === 'live (24/7)' ||
    s === 'live'
  ) {
    return {
      category: 'success',
      color: SEMANTIC_COLORS.success,
      bg: 'rgba(21, 154, 106, 0.12)',
      border: 'rgba(21, 154, 106, 0.35)',
      label: status,
    };
  }

  // 3. Attention / Risk / Corrective / Partially Compliant
  if (
    s === 'at risk' ||
    s === 'root cause identified' ||
    s === 'corrective action' ||
    s === 'partially compliant' ||
    s === 'mitigating'
  ) {
    return {
      category: 'attention',
      color: SEMANTIC_COLORS.attention,
      bg: 'rgba(229, 160, 0, 0.12)',
      border: 'rgba(229, 160, 0, 0.35)',
      label: status,
    };
  }

  // 4. Waiting / Pending / On Hold / Under Investigation
  if (
    s === 'awaiting info' ||
    s === 'pending' ||
    s === 'on hold' ||
    s === 'under investigation' ||
    s === 'scheduled'
  ) {
    return {
      category: 'waiting',
      color: SEMANTIC_COLORS.waiting,
      bg: 'rgba(229, 160, 0, 0.12)',
      border: 'rgba(229, 160, 0, 0.35)',
      label: status,
    };
  }

  // 5. Active / In Progress / Build / Testing / Monitoring
  if (
    s === 'in progress' ||
    s === 'under review' ||
    s === 'in development' ||
    s === 'testing' ||
    s === 'build' ||
    s === 'uat' ||
    s === 'pilot' ||
    s === 'monitoring' ||
    s === 'active'
  ) {
    return {
      category: 'active',
      color: SEMANTIC_COLORS.active,
      bg: 'rgba(59, 130, 196, 0.12)',
      border: 'rgba(59, 130, 196, 0.35)',
      label: status,
    };
  }

  // 6. Neutral / Draft / New / Planned
  return {
    category: 'neutral',
    color: SEMANTIC_COLORS.neutral,
    bg: 'rgba(122, 130, 136, 0.12)',
    border: 'rgba(122, 130, 136, 0.3)',
    label: status,
  };
}

/**
 * Returns the exact hex color for a priority identifier (P1, P2, P3, P4).
 */
export function getPriorityColor(priority) {
  if (!priority) return SEMANTIC_COLORS.neutral;
  const p = String(priority).toUpperCase();
  if (p.includes('P1') || p.includes('CRITICAL')) return PRIORITY_COLORS.P1;
  if (p.includes('P2') || p.includes('HIGH')) return PRIORITY_COLORS.P2;
  if (p.includes('P3') || p.includes('MEDIUM')) return PRIORITY_COLORS.P3;
  if (p.includes('P4') || p.includes('LOW')) return PRIORITY_COLORS.P4;
  return SEMANTIC_COLORS.neutral;
}
