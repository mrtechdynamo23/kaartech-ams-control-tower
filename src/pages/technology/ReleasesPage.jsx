/**
 * EDGE AMS Control Tower — Release & Deployment Governance
 * Route: /technology/releases
 */
import React from 'react';
import { GitPullRequest, Calendar, CheckCircle2, AlertOctagon, Clock, Shield } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ReleasesPage() {
  const releases = [
    { id: 'REL-2026-08', name: 'AdvantEDGE August Maintenance Bundle', type: 'Major Release', date: '2026-08-28', changesCount: 14, status: 'Scheduled', freeze: 'Normal' },
    { id: 'REL-2026-07', name: 'July Critical Hotfix & Tax Update', type: 'Emergency Patch', date: '2026-07-15', changesCount: 4, status: 'Deployed', freeze: 'Normal' },
    { id: 'REL-2026-06', name: 'AdvantEDGE June Feature Sprint', type: 'Major Release', date: '2026-06-30', changesCount: 22, status: 'Deployed', freeze: 'Normal' },
    { id: 'REL-2026-05', name: 'SuccessFactors Compensation Patch', type: 'Cloud Update', date: '2026-05-20', changesCount: 8, status: 'Deployed', freeze: 'Normal' },
  ];

  const freezeWindows = [
    { name: 'Year-End Financial Closing Freeze', dates: '20 Dec 2026 – 05 Jan 2027', scope: 'All Financial (R2R, L2C, P2P) Systems', status: 'Mandatory Policy' },
    { name: 'UAE National Day Operational Freeze', dates: '30 Nov 2026 – 04 Dec 2026', scope: 'All Production Systems', status: 'Mandatory Policy' },
  ];

  return (
    <div className="releases-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Release & Deployment Governance</h1>
            <span className="badge badge-success">98.6% Deployment Success</span>
          </div>
          <p className="page-subtitle">Track CAB approved change deployments, release packages, rollback telemetry, and change freeze periods.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Deployment Success Rate"
          value="98.6%"
          target="98.0%"
          status="success"
          icon={CheckCircle2}
          sparklineData={[97.5, 98.0, 98.4, 98.6]}
        />
        <KPICard
          title="Rollback Rate"
          value="1.4%"
          status="success"
          subtitle="Zero critical service impact"
          icon={AlertOctagon}
        />
        <KPICard
          title="Emergency Changes"
          value="2.1%"
          target="< 5.0%"
          status="success"
          subtitle="Well within ITIL standard"
          icon={Clock}
        />
        <KPICard
          title="Change Freeze Active"
          value="No Freeze"
          subtitle="Standard deployment window"
          icon={Shield}
        />
      </div>

      {/* Release Calendar */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <h3 className="chart-card-title">Production Release Pipeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {releases.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{r.id}</span>
                  <span className={`badge ${r.type === 'Major Release' ? 'badge-primary' : 'badge-neutral'}`}>{r.type}</span>
                  <span className={`badge ${r.status === 'Deployed' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Target Date: {r.date} • {r.changesCount} Approved CRs Packaged</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Freeze Windows */}
      <div className="chart-card">
        <h3 className="chart-card-title">Mandatory Change Freeze Calendar</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {freezeWindows.map((f, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</span>
                <span className="badge badge-warning">{f.status}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-red)', fontWeight: 600, marginBottom: '4px' }}>
                {f.dates}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Scope: {f.scope}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
