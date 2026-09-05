/**
 * EDGE AMS Control Tower — Shift & Coverage Roster
 * Route: /resources/coverage
 * 24/7 Shift operations, UAE business day calendars, and shift handovers.
 */
import React from 'react';
import { Clock, Shield, Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function CoveragePage() {
  const shifts = [
    { name: 'Shift 1: Morning Triage (UAE Core)', time: '07:00 – 15:30 GST', commander: 'Khalid Al Hashimi', staff: '12 Consultants Onsite', status: 'Active (Current)' },
    { name: 'Shift 2: Evening Operations & EMEA', time: '15:00 – 23:30 GST', commander: 'Ravi Shankar', staff: '10 Consultants (Onsite + Offshore)', status: 'Upcoming' },
    { name: 'Shift 3: Night Watch & Global On-Call', time: '23:00 – 07:30 GST', commander: 'Priya Nair', staff: '8 Specialists On-Call P1/P2', status: 'Standby' },
  ];

  return (
    <div className="coverage-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Shift Coverage & Calendar Operations</h1>
            <span className="badge badge-primary">24/7/365 Mission Ready</span>
          </div>
          <p className="page-subtitle">Roster management, UAE public holiday calendar integration, and daily shift handover protocols.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Current Active Shift"
          value="Shift 1"
          subtitle="Morning Core (07:00-15:30)"
          icon={Clock}
          status="success"
        />
        <KPICard
          title="On-Duty Specialists"
          value="12 Onsite"
          subtitle="Abu Dhabi HQ & Plant hubs"
          icon={Users}
        />
        <KPICard
          title="Handover Health"
          value="100% Signed"
          subtitle="Zero open bridge gaps"
          icon={CheckCircle2}
          status="success"
        />
        <KPICard
          title="Calendar Profile"
          value="UAE Standard"
          subtitle="HQ (Mon-Fri) / Mfg (Mon-Sat)"
          icon={Calendar}
        />
      </div>

      {/* Shifts Card */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
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
