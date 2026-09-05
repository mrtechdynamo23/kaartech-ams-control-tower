/**
 * EDGE AMS Control Tower — ChartCard Component
 * Reusable enterprise chart container with header context, action pills, and polished layout.
 */
import React from 'react';
import { HelpCircle, SlidersHorizontal } from 'lucide-react';

export default function ChartCard({
  title,
  subtitle,
  tooltip,
  badge,
  badgeVariant = 'badge-neutral',
  actions,
  children,
  height = 280,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`chart-card ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
              {title}
            </h3>
            {badge && (
              <span className={`badge ${badgeVariant}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                {badge}
              </span>
            )}
            {tooltip && (
              <span title={tooltip} style={{ color: 'var(--text-tertiary)', cursor: 'help' }}>
                <HelpCircle size={13} />
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: '2px 0 0', lineHeight: 1.4 }}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {actions}
          </div>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
