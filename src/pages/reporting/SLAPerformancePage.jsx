/**
 * EDGE AMS Control Tower — Contractual SLA Performance
 * Route: /reporting/sla
 * Source-Confirmed RFP §5.1 SLA Targets vs Actuals (Section 25).
 */
import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, Download } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { SLA_POLICIES, OVERALL_MONTHLY_RESOLUTION_TARGET } from '../../data/config';
import { getIncidentStats } from '../../data/demoData';

export default function SLAPerformancePage() {
  const stats = getIncidentStats();

  const slaTable = [
    {
      priority: 'P1 - Critical',
      responseTarget: '30 Minutes',
      responseActual: '14 Minutes (100% Met)',
      resolutionTarget: '4 Hours (95.0% Target)',
      resolutionActual: `${stats.p1ResolutionSla}% Met`,
      status: stats.p1ResolutionSla >= 95 ? 'Passed' : 'At Risk',
      source: 'RFP §5.1',
    },
    {
      priority: 'P2 - High',
      responseTarget: '2 Hours',
      responseActual: '42 Minutes (98.5% Met)',
      resolutionTarget: '8 Hours (90.0% Target)',
      resolutionActual: `${stats.p2ResolutionSla}% Met`,
      status: stats.p2ResolutionSla >= 90 ? 'Passed' : 'At Risk',
      source: 'RFP §5.1',
    },
    {
      priority: 'P3 - Medium',
      responseTarget: '1 Business Day',
      responseActual: '4.2 Hours (96.0% Met)',
      resolutionTarget: '2 Business Days (90.0% Target)',
      resolutionActual: '95.6% Met',
      status: 'Passed',
      source: 'RFP §5.1',
    },
    {
      priority: 'P4 - Low',
      responseTarget: '2 Business Days',
      responseActual: '8.5 Hours (98.0% Met)',
      resolutionTarget: '4 Business Days (85.0% Target)',
      resolutionActual: '96.0% Met',
      status: 'Passed',
      source: 'RFP §5.1',
    },
  ];

  return (
    <div className="sla-performance-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Contractual SLA Performance & Matrix</h1>
            <span className="badge badge-success">Contractual SLAs Satisfied</span>
          </div>
          <p className="page-subtitle">RFP §5.1 source-confirmed service levels, contractual penalty thresholds, and actual resolution performance.</p>
        </div>

        <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export SLA Certificate</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall Monthly Target"
          value={`${stats.resolutionSlaPercent}%`}
          target={`${OVERALL_MONTHLY_RESOLUTION_TARGET}%`}
          status="success"
          trend={+3.4}
          icon={CheckCircle2}
          sparklineData={[89, 91, 93, stats.resolutionSlaPercent]}
        />
        <KPICard
          title="P1 SLA Attainment"
          value={`${stats.p1ResolutionSla}%`}
          target="95.0%"
          status={stats.p1ResolutionSla >= 95 ? 'success' : 'warning'}
          icon={Clock}
          sparklineData={[92, 94, 95, stats.p1ResolutionSla]}
        />
        <KPICard
          title="P2 SLA Attainment"
          value={`${stats.p2ResolutionSla}%`}
          target="90.0%"
          status="success"
          icon={Clock}
          sparklineData={[91, 92, 94, stats.p2ResolutionSla]}
        />
        <KPICard
          title="Contractual Penalty"
          value="AED 0"
          status="success"
          subtitle="Zero breaches incurring deduction"
          icon={ShieldCheck}
        />
      </div>

      {/* Contractual SLA Matrix Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">RFP §5.1 Contractual SLA Matrix vs Operational Actuals</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Priority Level</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Contract Response SLA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actual Response</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Contract Resolution SLA</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actual Resolution</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Audit Verdict</th>
              </tr>
            </thead>
            <tbody>
              {slaTable.map(row => (
                <tr key={row.priority} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.priority}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.responseTarget}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{row.responseActual}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{row.resolutionTarget}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 700 }}>{row.resolutionActual}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${row.status === 'Passed' ? 'badge-success' : 'badge-warning'}`}>
                      {row.status}
                    </span>
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
