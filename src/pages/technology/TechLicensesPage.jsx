/**
 * EDGE AMS Control Tower — Technology Contracts & Lifecycle
 * Route: /technology/licenses
 */
import React from 'react';
import { ShieldCheck, Server, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { TECHNOLOGIES } from '../../data/masterData';

export default function TechLicensesPage() {
  const currentTech = TECHNOLOGIES.filter(t => t.lifecycle === 'Current');
  const matureTech = TECHNOLOGIES.filter(t => t.lifecycle === 'Mature');

  return (
    <div className="tech-licenses-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Technology Contracts & Lifecycle</h1>
            <span className="badge badge-primary">{TECHNOLOGIES.length} Tech Stacks</span>
          </div>
          <p className="page-subtitle">OEM support contracts, lifecycle support roadmaps, and enterprise database patch currency.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Active Tech Stacks"
          value={TECHNOLOGIES.length}
          subtitle="Governed platforms"
          icon={Server}
        />
        <KPICard
          title="Modern / Current"
          value={currentTech.length}
          status="success"
          subtitle="Mainstream vendor support"
          icon={CheckCircle2}
        />
        <KPICard
          title="Legacy / Mature"
          value={matureTech.length}
          status={matureTech.length > 0 ? 'warning' : 'success'}
          subtitle="PO 7.5 (Upgrade in plan)"
          icon={Clock}
        />
        <KPICard
          title="OEM Support Status"
          value="100% Active"
          status="success"
          subtitle="All maintenance paid"
          icon={ShieldCheck}
        />
      </div>

      {/* Tech Stack Inventory Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Technology Stack Lifecycle & Vendor Contracts</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Platform / Technology</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Vendor</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Deployed Version</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Apps Dependent</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Lifecycle State</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Contract Status</th>
              </tr>
            </thead>
            <tbody>
              {TECHNOLOGIES.map(tech => (
                <tr key={tech.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{tech.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{tech.vendor}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{tech.version}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{tech.appCount} Apps</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${tech.lifecycle === 'Current' ? 'badge-success' : 'badge-warning'}`}>
                      {tech.lifecycle}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{tech.supportStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
