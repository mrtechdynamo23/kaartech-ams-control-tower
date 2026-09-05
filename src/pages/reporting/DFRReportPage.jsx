/**
 * EDGE AMS Control Tower — Daily Flash Report (DFR)
 * Route: /reporting/dfr
 * 24-hour executive operational pulse and major incident summary.
 */
import React from 'react';
import { FileText, Download, CheckCircle2, AlertTriangle, Clock, ShieldCheck, Activity, Printer } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function DFRReportPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dfr-report-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Daily Flash Report (DFR)</h1>
            <span className="badge badge-primary">24h Executive Pulse</span>
          </div>
          <p className="page-subtitle">Standardized daily operational snapshot for EDGE Group IT Leadership and Steering Committee.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={15} />
            <span>Export DFR (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="24h Ticket Inflow"
          value="18 Inc / 12 SR"
          subtitle="Total 30 new tickets logged"
          icon={Activity}
        />
        <KPICard
          title="24h Resolutions"
          value="28 Closed"
          status="success"
          subtitle="Resolution rate: 93.3%"
          icon={CheckCircle2}
        />
        <KPICard
          title="Active P1/P2 Major"
          value="0 Breaches"
          status="success"
          subtitle="All tickets under strict SLA"
          icon={ShieldCheck}
        />
        <KPICard
          title="Core ERP Availability"
          value="100.0%"
          status="success"
          subtitle="SAP S/4HANA 2025"
          icon={Clock}
        />
      </div>

      {/* DFR Executive Summary Document Card */}
      <div className="chart-card" style={{ padding: '28px' }}>
        <div style={{ borderBottom: '2px solid var(--edge-primary)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              EDGE Group PJSC — AMS Control Tower
            </span>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              Daily Operational Flash Report
            </h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <div><strong>Report Period:</strong> 24 Hours Ending 07:00 GST</div>
            <div><strong>Classification:</strong> OPERATIONAL DEMO</div>
          </div>
        </div>

        {/* Section 1: Executive Highlights */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
            1. Executive Operational Highlights
          </h4>
          <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', margin: 0 }}>
            <li><strong>Core System Stability:</strong> 100% uptime sustained across SAP S/4HANA 2025, SAP SuccessFactors, and Azure integrations with zero unplanned outages.</li>
            <li><strong>SLA Compliance:</strong> 24h response SLA attainment stood at 97.4%, resolution SLA at 94.2% across all 34 EDGE entities.</li>
            <li><strong>Major Incident Triage:</strong> 1 P1 incident logged at 14:15 GST (Sales Order batch lock) resolved within 1h 45m (contractual SLA target: 4h).</li>
            <li><strong>Transition Wave:</strong> Phase 4 reverse shadowing activities on Manufacturing entities (HALCON, NIMR) concluded with 100% test pass rate.</li>
          </ul>
        </div>

        {/* Section 2: Domain Operational Summary */}
        <div>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
            2. Domain Performance Matrix
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Domain</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>New Inflow</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Resolved</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Active Backlog</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>24h SLA Met</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { domain: 'L2C (Lead-to-Cash)', in: 6, res: 6, back: 8, sla: '100%' },
                  { domain: 'R2R (Record-to-Report)', in: 5, res: 5, back: 6, sla: '100%' },
                  { domain: 'P2P (Procure-to-Pay)', in: 4, res: 5, back: 7, sla: '95%' },
                  { domain: 'E2M (Estimate-to-Manufacture)', in: 5, res: 4, back: 9, sla: '92%' },
                  { domain: 'H2R (Hire-to-Retire)', in: 4, res: 4, back: 5, sla: '100%' },
                  { domain: 'S2P (Source-to-Pay)', in: 3, res: 3, back: 4, sla: '100%' },
                  { domain: 'D2S (Demand-to-Supply)', in: 2, res: 2, back: 3, sla: '100%' },
                  { domain: 'A2D (Acquire-to-Decom)', in: 1, res: 1, back: 2, sla: '100%' },
                ].map(row => (
                  <tr key={row.domain} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.domain}</td>
                    <td style={{ padding: '10px 14px' }}>{row.in}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-emerald)', fontWeight: 600 }}>{row.res}</td>
                    <td style={{ padding: '10px 14px' }}>{row.back}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-emerald)' }}>{row.sla}</td>
                    <td style={{ padding: '10px 14px' }}><span className="badge badge-success">Healthy</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
