/**
 * EDGE AMS Control Tower — Organization Summary KPI Strip
 * 
 * Restrained enterprise operational summary implementing Section 13 of specifications:
 * - Compact horizontal KPI strip
 * - High visual prominence on numbers, muted labels
 * - Non-card-soup aesthetic, aerospace/defence control tower precision
 */
import React from 'react';
import { Users, Shield, MapPin, Layers, Award, CheckCircle2 } from 'lucide-react';
import { getOrganizationMetrics } from '../../../data/organizationData';

export default function OrganizationSummaryStrip({ onFilterClick }) {
  const metrics = getOrganizationMetrics();

  return (
    <div
      className="organization-summary-strip"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '16px',
        alignItems: 'center',
      }}
    >
      {/* 1. Total Resources */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          paddingRight: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <Users size={12} style={{ color: 'var(--edge-primary)' }} />
          <span>Total Workforce</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {metrics.totalResources}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>FTEs</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          {metrics.dedicatedCount} Dedicated · {metrics.sharedFlexCount} Shared Flex
        </div>
      </div>

      {/* 2. Managers & Leads */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          paddingRight: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <Shield size={12} style={{ color: 'var(--edge-primary)' }} />
          <span>Managers & Leads</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {metrics.totalManagers}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Leads</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          1 Delivery Lead · 8 Domain Leads
        </div>
      </div>

      {/* 3. Onsite (Abu Dhabi HQ) */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          paddingRight: '12px',
          cursor: onFilterClick ? 'pointer' : 'default',
        }}
        onClick={() => onFilterClick && onFilterClick({ location: 'Onsite' })}
        title="Filter by Onsite (Abu Dhabi)"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <MapPin size={12} style={{ color: 'var(--color-green)' }} />
          <span>Onsite (Abu Dhabi)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green)', lineHeight: 1.1 }}>
            {metrics.onsiteCount}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600 }}>
            ({metrics.onsitePercentage}%)
          </span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Client premises presence
        </div>
      </div>

      {/* 4. Offshore Delivery Centers */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          paddingRight: '12px',
          cursor: onFilterClick ? 'pointer' : 'default',
        }}
        onClick={() => onFilterClick && onFilterClick({ location: 'Offshore' })}
        title="Filter by Offshore Delivery"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <Shield size={12} style={{ color: 'var(--color-blue)' }} />
          <span>Offshore Delivery</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-blue)', lineHeight: 1.1 }}>
            {metrics.offshoreCount}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-blue)', fontWeight: 600 }}>
            ({metrics.offshorePercentage}%)
          </span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Dedicated & remote pool
        </div>
      </div>

      {/* 5. Active Process Teams */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-secondary)',
          paddingRight: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <Layers size={12} style={{ color: 'var(--edge-primary)' }} />
          <span>Active Teams</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {metrics.activeTeamsCount}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Teams</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          Across 8 Business Domains
        </div>
      </div>

      {/* 6. Baseline Compliance */}
      <div
        className="summary-item"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
          <CheckCircle2 size={12} style={{ color: 'var(--color-green)' }} />
          <span>Staffing Compliance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green)', lineHeight: 1.1 }}>
            100%
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600 }}>Fulfilled</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
          {metrics.emiratizationRate}% UAE National representation
        </div>
      </div>
    </div>
  );
}
