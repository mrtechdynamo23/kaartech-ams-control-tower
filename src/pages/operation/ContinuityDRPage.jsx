/**
 * EDGE AMS Control Tower — Service Continuity & DR
 * Route: /service-operation/continuity
 */
import React from 'react';
import { ShieldCheck, Server, RefreshCw, CheckCircle2, Clock, HardDrive } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ContinuityDRPage() {
  const drSystems = [
    { system: 'SAP S/4HANA 2025 Core', primary: 'Abu Dhabi DC 1', drSite: 'Al Ain DR DC 2', rtoActual: '45 mins (Target: 2h)', rpoActual: '4 mins (Target: 15m)', replication: 'HANA System Replication (Sync)', status: 'Failover Ready' },
    { system: 'SAP BW/4HANA Analytics', primary: 'Abu Dhabi DC 1', drSite: 'Al Ain DR DC 2', rtoActual: '1h 10m (Target: 4h)', rpoActual: '8 mins (Target: 30m)', replication: 'HANA System Replication (Async)', status: 'Failover Ready' },
    { system: 'SAP MES / MII (Plant Tier)', primary: 'Plant Edge Clusters', drSite: 'Local Secondary Cluster', rtoActual: '15 mins (Target: 1h)', rpoActual: '0 mins (Target: 5m)', replication: 'Active-Active HA Pair', status: 'Failover Ready' },
    { system: 'Opentext xECM Platform', primary: 'Abu Dhabi DC 1', drSite: 'Azure UAE North Cloud', rtoActual: '1h 30m (Target: 4h)', rpoActual: '12 mins (Target: 1h)', replication: 'Cloud Storage Mirroring', status: 'Failover Ready' },
  ];

  return (
    <div className="continuity-dr-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Service Continuity & Disaster Recovery (DR)</h1>
            <span className="badge badge-success">100% DR Readiness</span>
          </div>
          <p className="page-subtitle">Disaster recovery failover readiness, RTO/RPO SLA compliance, and enterprise database replication health.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="RTO Performance"
          value="45 mins"
          target="< 2 Hours"
          status="success"
          subtitle="Recovery Time Objective"
          icon={Clock}
        />
        <KPICard
          title="RPO Performance"
          value="4 mins"
          target="< 15 Mins"
          status="success"
          subtitle="Recovery Point Objective"
          icon={HardDrive}
        />
        <KPICard
          title="Annual DR Drill Score"
          value="100% Pass"
          status="success"
          subtitle="Simulated total DC failover"
          icon={ShieldCheck}
        />
        <KPICard
          title="Replication Lag"
          value="< 1 sec"
          status="success"
          subtitle="HANA Sync Replication"
          icon={RefreshCw}
        />
      </div>

      {/* Systems DR Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Mission-Critical DR Failover Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>System / Tier</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Primary Site</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Secondary DR Site</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actual RTO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actual RPO</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Replication Protocol</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>DR State</th>
              </tr>
            </thead>
            <tbody>
              {drSystems.map((sys, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{sys.system}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sys.primary}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sys.drSite}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{sys.rtoActual}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{sys.rpoActual}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sys.replication}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{sys.status}</span>
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
