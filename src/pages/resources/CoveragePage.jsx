/**
 * EDGE AMS Control Tower — Shift & Coverage Roster
 * Route: /resources/coverage
 * 24/7 Shift operations, UAE business day calendars, and shift handovers.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Shield, Calendar, Users, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { getOnsiteCoverageCompliance, subscribeTimeManagement } from '../../data/timeManagementStore';

export default function CoveragePage() {
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    return subscribeTimeManagement(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  // Today active simulation anchor (Sep 08, 2026)
  const coverageCompliance = useMemo(() => {
    return getOnsiteCoverageCompliance('2026-09-08');
  }, [storeVersion]);

  const shifts = [
    { name: 'Shift 1: Morning Triage (UAE Core)', time: '07:00 – 15:30 GST', commander: 'Khalid Al Hashimi', staff: `${coverageCompliance.filled} Specialists Active Onsite`, status: 'Active (Current)' },
    { name: 'Shift 2: Evening Operations & EMEA', time: '15:00 – 23:30 GST', commander: 'Ravi Shankar', staff: '10 Consultants (Onsite + Offshore)', status: 'Upcoming' },
    { name: 'Shift 3: Night Watch & Global On-Call', time: '23:00 – 07:30 GST', commander: 'Priya Nair', staff: '8 Specialists On-Call P1/P2', status: 'Standby' },
  ];

  return (
    <div className="coverage-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Shift Coverage & Calendar Operations</h1>
            <span className="badge badge-primary">24/7/365 Mission Ready</span>
            <span className="badge badge-neutral">Live Time Management Linked</span>
          </div>
          <p className="page-subtitle">Roster management, contractual onsite compliance, and automated leave impact telemetry.</p>
        </div>
      </div>

      {/* KPI Tiles with Onsite Coverage Compliance */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <KPICard
          title="Onsite Coverage Compliance"
          value={`${coverageCompliance.coveragePercent}%`}
          subtitle={`${coverageCompliance.filled} of ${coverageCompliance.required} Onsite Postings Filled`}
          icon={Users}
          status={coverageCompliance.coveragePercent >= 90 ? 'success' : 'warning'}
        />
        <KPICard
          title="Current Active Shift"
          value="Shift 1"
          subtitle="Morning Core (07:00-15:30)"
          icon={Clock}
          status="success"
        />
        <KPICard
          title="Coverage Gaps / Absence"
          value={`${coverageCompliance.gap} Absent`}
          subtitle="Covered via backup assignments"
          icon={AlertTriangle}
          status={coverageCompliance.gap === 0 ? 'success' : 'warning'}
        />
        <KPICard
          title="Calendar Profile"
          value="UAE Standard"
          subtitle="HQ (Mon-Fri) / Mfg (Mon-Sat)"
          icon={Calendar}
        />
      </div>

      {/* Onsite Coverage Compliance Telemetry Card */}
      <div className="chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="chart-card-title" style={{ margin: 0 }}>Onsite Contractual Headcount & Leave Impact</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Tracking contractual AMS-ON-RUN onsite headcount compliance against real-time approved leaves.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-neutral">Required: {coverageCompliance.required}</span>
            <span className="badge badge-neutral">Filled: {coverageCompliance.filled}</span>
            <span className={`badge ${coverageCompliance.gap > 0 ? 'badge-warning' : 'badge-success'}`}>
              Gap: {coverageCompliance.gap}
            </span>
          </div>
        </div>

        {coverageCompliance.absentResources.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} color="var(--color-emerald)" />
            <span>All 14 contractual onsite positions are fully staffed and active today. Zero leave absence.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Resources currently on approved operational leave impacting onsite coverage:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {coverageCompliance.absentResources.map(r => (
                <div
                  key={r.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {r.businessDomain} • {r.processGroup || 'AMS Operations'}
                    </div>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '11px' }}>
                    On Leave
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 24-Hour Continuous Operating Roster */}
      <div className="chart-card">
        <h3 className="chart-card-title">24-Hour Continuous Operating Roster</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shifts.map((s, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className={`badge ${s.status.includes('Active') ? 'badge-success' : 'badge-neutral'}`}>{s.status}</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Time Window: <strong>{s.time}</strong> • Staffing: <strong>{s.staff}</strong>
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', textAlign: 'right' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Shift Lead: </span>
                <strong style={{ color: 'var(--edge-primary)' }}>{s.commander}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

