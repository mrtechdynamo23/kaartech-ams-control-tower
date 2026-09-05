/**
 * EDGE AMS Control Tower — Compact Enterprise KPICard
 * Features: Refined typography, compact padding, sparklines, trend delta, targets, and drilldown.
 */
import React from 'react';
import { TrendIndicator } from './Badges';
import { ChevronRight, HelpCircle } from 'lucide-react';

export default function KPICard({
  title,
  value,
  unit = '',
  target,
  trend,
  trendPeriod = 'vs target',
  isPositiveGood = true,
  status = 'normal', // 'normal' | 'warning' | 'danger' | 'success'
  sparklineData = [],
  subtitle,
  tooltip,
  onClick,
  accentColor,
  icon: Icon,
  className = '',
}) {
  const getStatusColor = () => {
    if (status === 'danger') return 'var(--color-red)';
    if (status === 'warning') return 'var(--color-amber)';
    if (status === 'success') return 'var(--color-emerald)';
    if (accentColor) return accentColor;
    return 'transparent';
  };

  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const width = 64;
    const height = 22;

    const points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = status === 'danger'
      ? 'var(--color-red)'
      : status === 'warning'
      ? 'var(--color-amber)'
      : status === 'success'
      ? 'var(--color-emerald)'
      : 'var(--edge-primary)';

    return (
      <svg width={width} height={height} style={{ overflow: 'visible', flexShrink: 0 }}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {sparklineData.length > 0 && (
          <circle
            cx={width}
            cy={height - ((sparklineData[sparklineData.length - 1] - min) / range) * (height - 4) - 2}
            r="2.5"
            fill={strokeColor}
          />
        )}
      </svg>
    );
  };

  return (
    <div
      className={`kpi-card ${onClick ? 'interactive' : ''} ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
        borderTop: status !== 'normal' || accentColor ? `2px solid ${getStatusColor()}` : undefined,
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {Icon && (
            <div style={{
              width: '22px', height: '22px', borderRadius: '4px',
              background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--edge-primary)', flexShrink: 0
            }}>
              <Icon size={13} />
            </div>
          )}
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            lineHeight: 1.2
          }}>
            {title}
          </span>
        </div>

        {tooltip && (
          <span title={tooltip} style={{ color: 'var(--text-tertiary)', cursor: 'help' }}>
            <HelpCircle size={12} />
          </span>
        )}
      </div>

      {/* Main Value Row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {unit}
            </span>
          )}
        </div>

        {renderSparkline()}
      </div>

      {/* Footer / Context */}
      {(trend !== undefined || target || subtitle) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: '1px solid var(--border-secondary)',
          fontSize: '11px',
          color: 'var(--text-tertiary)'
        }}>
          {trend !== undefined ? (
            <TrendIndicator value={trend} label={trendPeriod} isPositiveGood={isPositiveGood} size="sm" />
          ) : target ? (
            <span>Target: <strong style={{ color: 'var(--text-secondary)' }}>{target}</strong></span>
          ) : (
            <span className="truncate">{subtitle}</span>
          )}

          {target && trend !== undefined && (
            <span style={{ marginLeft: 'auto', paddingLeft: '6px' }}>Target: {target}</span>
          )}

          {onClick && (
            <ChevronRight size={13} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto' }} />
          )}
        </div>
      )}
    </div>
  );
}
