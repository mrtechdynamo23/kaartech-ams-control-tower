/**
 * EDGE AMS Control Tower — Common Badges
 * StatusBadge, PriorityBadge, SLABadge, TrendIndicator
 * Unified with centralized semantic color tokens (Section 5, 6, 7).
 */
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, CheckCircle, Clock, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { getStatusSemantic, getPriorityColor, PRIORITY_COLORS } from '../../utils/statusSemantics';

export function StatusBadge({ status, size = 'md' }) {
  const semantic = getStatusSemantic(status);

  return (
    <span
      className={`badge badge-${size}`}
      style={{
        backgroundColor: semantic.bg,
        color: semantic.color,
        border: `1px solid ${semantic.border}`,
        fontWeight: 600,
        letterSpacing: '0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {semantic.category === 'critical' && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: semantic.color }} />}
      {semantic.label}
    </span>
  );
}

export function PriorityBadge({ priority, size = 'md' }) {
  const p = String(priority || 'P4').toUpperCase();
  const color = getPriorityColor(p);
  const isP1 = p.includes('P1') || p.includes('CRITICAL');
  const isP2 = p.includes('P2') || p.includes('HIGH');

  let label = p;
  if (p === 'P1') label = 'P1 - Critical';
  else if (p === 'P2') label = 'P2 - High';
  else if (p === 'P3') label = 'P3 - Medium';
  else if (p === 'P4') label = 'P4 - Low';

  return (
    <span
      className={`badge badge-${size} priority-badge`}
      style={{
        backgroundColor: isP1 ? 'rgba(217, 45, 32, 0.12)' : isP2 ? 'rgba(229, 160, 0, 0.12)' : p === 'P3' ? 'rgba(59, 130, 196, 0.12)' : 'rgba(122, 130, 136, 0.12)',
        color: color,
        border: `1px solid ${color}40`,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {(isP1 || isP2) && (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
      )}
      {label}
    </span>
  );
}

export function SLABadge({ slaStatus, size = 'md' }) {
  const s = String(slaStatus || 'On Track').trim().toLowerCase();

  let config = {
    bg: 'rgba(21, 154, 106, 0.12)',
    color: '#159A6A',
    border: 'rgba(21, 154, 106, 0.35)',
    icon: CheckCircle,
    text: 'SLA Met',
  };

  if (s === 'breached') {
    config = {
      bg: 'rgba(217, 45, 32, 0.12)',
      color: '#D92D20',
      border: 'rgba(217, 45, 32, 0.35)',
      icon: XCircle,
      text: 'SLA Breached',
    };
  } else if (s === 'at risk' || s === 'at-risk') {
    config = {
      bg: 'rgba(229, 160, 0, 0.12)',
      color: '#E5A000',
      border: 'rgba(229, 160, 0, 0.35)',
      icon: AlertTriangle,
      text: 'SLA At Risk',
    };
  } else if (s === 'on track' || s === 'active') {
    config = {
      bg: 'rgba(21, 154, 106, 0.12)',
      color: '#159A6A',
      border: 'rgba(21, 154, 106, 0.35)',
      icon: Clock,
      text: 'SLA On Track',
    };
  }

  const Icon = config.icon;

  return (
    <span
      className={`badge badge-${size}`}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
      }}
    >
      <Icon size={12} />
      <span>{config.text}</span>
    </span>
  );
}

export function TrendIndicator({ value, label, isPositiveGood = true, size = 'md' }) {
  if (value === undefined || value === null) return null;

  const isZero = value === 0;
  const isPositive = value > 0;
  const isGood = isPositiveGood ? isPositive : !isPositive;

  let color = 'var(--text-tertiary)';
  let Icon = Minus;

  if (!isZero) {
    if (isGood) {
      color = '#159A6A';
      Icon = ArrowUpRight;
    } else {
      color = '#D92D20';
      Icon = ArrowDownRight;
    }
  }

  return (
    <span
      className={`trend-indicator trend-${size}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        fontWeight: 600,
        color: color,
        fontSize: size === 'sm' ? '11px' : '12px',
      }}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      <span>{isPositive ? `+${value}%` : `${value}%`}</span>
      {label && <span style={{ opacity: 0.8, fontWeight: 400, marginLeft: 2 }}>{label}</span>}
    </span>
  );
}
