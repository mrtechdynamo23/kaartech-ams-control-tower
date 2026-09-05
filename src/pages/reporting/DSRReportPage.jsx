/**
 * EDGE AMS Control Tower — Daily Service Report (DSR)
 * Route: /reporting/dsr
 */
import React from 'react';
import { FileText, Download, CheckCircle2, Clock, Activity, Printer } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function DSRReportPage() {
  const handlePrint = () => window.print();

  return (
    <div className="dsr-report-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Daily Service Report (DSR)</h1>
            <span className="badge badge-primary">Detailed Operational Metrics</span>
          </div>
          <p className="page-subtitle">Comprehensive operational metrics across all 3 daily shifts and 4 ticket priority categories.</p>
        </div>

        <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export DSR</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Total Processed"
          value="48 Tickets"
          subtitle="Inflow + backlog actions"
          icon={Activity}
        />
        <KPICard
          title="Daily SLA Attainment"
          value="96.4%"
          status="success"
          target="88.0%"
          icon={CheckCircle2}
        />
        <KPICard
          title="Active Bridge Time"
          value="42 mins"
          subtitle="Total major incident triage"
          icon={Clock}
        />
        <KPICard
          title="Shift Handover Gaps"
          value="0 Gaps"
          status="success"
          subtitle="Clean handover logs"
        />
      </div>

      {/* Shift Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Shift Performance Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Shift Window</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Shift Commander</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tickets Logged</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tickets Resolved</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>P1/P2 Handled</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>SLA Met Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { shift: 'Shift 1 (07:00 – 15:30 GST)', lead: 'Khalid Al Hashimi', in: 24, out: 22, p1: 1, sla: '98.0%' },
                { shift: 'Shift 2 (15:00 – 23:30 GST)', lead: 'Ravi Shankar', in: 18, out: 19, p1: 0, sla: '95.5%' },
                { shift: 'Shift 3 (23:00 – 07:30 GST)', lead: 'Priya Nair', in: 6, out: 7, p1: 0, sla: '100%' },
              ].map(s => (
                <tr key={s.shift} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.shift}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.lead}</td>
                  <td style={{ padding: '12px 16px' }}>{s.in}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{s.out}</td>
                  <td style={{ padding: '12px 16px' }}>{s.p1}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 700 }}>{s.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
