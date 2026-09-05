/**
 * EDGE AMS Control Tower — Dependencies & Impact Analysis
 * Route: /technology/dependencies
 */
import React from 'react';
import { GitBranch, Link2, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function DependenciesPage() {
  const dependencies = [
    {
      source: 'SAP S/4HANA 2025',
      target: 'SAP Ariba Sourcing',
      protocol: 'SAP Cloud Integration (CPI) / OData',
      frequency: 'Real-Time Synchronous',
      criticality: 'Critical',
      impact: 'PO & Master Data Sync',
      status: 'Healthy',
    },
    {
      source: 'SAP S/4HANA 2025',
      target: 'SAP MES / MII (Plants)',
      protocol: 'RFC / Web Services',
      frequency: 'Near Real-Time (5s)',
      criticality: 'Critical',
      impact: 'Shopfloor Work Orders & Yield',
      status: 'Healthy',
    },
    {
      source: 'SAP SuccessFactors',
      target: 'SAP S/4HANA 2025',
      protocol: 'CPI / Standard EC-ERP Package',
      frequency: 'Daily Batch (02:00 GST)',
      criticality: 'High',
      impact: 'Employee Mini-Master & Cost Centers',
      status: 'Healthy',
    },
    {
      source: 'Microsoft Dynamics 365',
      target: 'SAP S/4HANA 2025',
      protocol: 'REST APIs / Azure Integration Hub',
      frequency: 'Real-Time Event-Driven',
      criticality: 'High',
      impact: 'Sales Orders & Invoicing',
      status: 'Healthy',
    },
    {
      source: 'SAP S/4HANA 2025',
      target: 'Opentext xECM Platform',
      protocol: 'OpenText ArchiveLink & CMIS',
      frequency: 'Real-Time Document Archive',
      criticality: 'Medium',
      impact: 'Contract & Invoice PDFs',
      status: 'Healthy',
    },
    {
      source: 'SAP GTS (Global Trade)',
      target: 'SAP S/4HANA 2025',
      protocol: 'RFC Callbacks',
      frequency: 'Per Order Transactional',
      criticality: 'High',
      impact: 'Customs & Export Control Clearance',
      status: 'Healthy',
    },
  ];

  return (
    <div className="dependencies-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Interface Dependencies & Blast Radius</h1>
            <span className="badge badge-primary">64 Active Integrations</span>
          </div>
          <p className="page-subtitle">Mapping critical interface connections, protocol standards, and single point of failure (SPOF) resilience.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Active Interfaces"
          value="64 Pipes"
          subtitle="Monitored CPI / RFC streams"
          icon={Link2}
        />
        <KPICard
          title="Interface Health"
          value="100%"
          status="success"
          subtitle="Zero dropped message packets"
          icon={CheckCircle2}
        />
        <KPICard
          title="Critical SPOF Risks"
          value="0 Risks"
          status="success"
          subtitle="All Tier-1 paths have HA failover"
          icon={AlertOctagon}
        />
        <KPICard
          title="Daily Message Volume"
          value="1.4M"
          subtitle="Transactions orchestrated"
          icon={GitBranch}
        />
      </div>

      {/* Dependencies Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Core Application Integration Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Source Application</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Target Application</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Protocol & Middleware</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Execution Frequency</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Criticality</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Business Flow Impact</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Interface Status</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.map((dep, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{dep.source}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{dep.target}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{dep.protocol}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{dep.frequency}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${dep.criticality === 'Critical' ? 'badge-error' : dep.criticality === 'High' ? 'badge-warning' : 'badge-neutral'}`}>
                      {dep.criticality}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{dep.impact}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{dep.status}</span>
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
