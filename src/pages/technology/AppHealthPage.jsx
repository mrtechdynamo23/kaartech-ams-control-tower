/**
 * EDGE AMS Control Tower — Application Health & APM
 * Route: /technology/application-health
 */
import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, Server, Cpu, HardDrive, Wifi } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function AppHealthPage() {
  const telemetry = [
    { app: 'SAP S/4HANA 2025', uptime: '99.99%', latency: '112ms', cpu: '42%', ram: '68%', status: 'Healthy', errorRate: '0.01%', host: 'On-Premises Private Cloud' },
    { app: 'SAP SuccessFactors HXM', uptime: '99.95%', latency: '145ms', cpu: 'N/A (SaaS)', ram: 'N/A', status: 'Healthy', errorRate: '0.02%', host: 'SAP Cloud Europe' },
    { app: 'SAP BTP Integration Suite', uptime: '100.0%', latency: '88ms', cpu: '38%', ram: '54%', status: 'Healthy', errorRate: '0.00%', host: 'SAP Cloud (UAE)' },
    { app: 'SAP Ariba Sourcing', uptime: '99.92%', latency: '160ms', cpu: 'N/A (SaaS)', ram: 'N/A', status: 'Healthy', errorRate: '0.03%', host: 'SAP Cloud Europe' },
    { app: 'Microsoft Dynamics 365', uptime: '99.98%', latency: '120ms', cpu: 'N/A (SaaS)', ram: 'N/A', status: 'Healthy', errorRate: '0.01%', host: 'Azure UAE North' },
    { app: 'SAP BW/4HANA & BPC', uptime: '99.94%', latency: '185ms', cpu: '56%', ram: '74%', status: 'Healthy', errorRate: '0.02%', host: 'On-Premises Private Cloud' },
    { app: 'Opentext xECM Platform', uptime: '99.90%', latency: '140ms', cpu: '34%', ram: '60%', status: 'Healthy', errorRate: '0.01%', host: 'On-Premises Private Cloud' },
    { app: 'SAP MES / MII (Plant Floor)', uptime: '99.99%', latency: '45ms', cpu: '48%', ram: '62%', status: 'Healthy', errorRate: '0.00%', host: 'Plant Edge Servers' },
  ];

  return (
    <div className="app-health-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Application Health & Synthetic APM</h1>
            <span className="badge badge-success">Estate All Green</span>
          </div>
          <p className="page-subtitle">Real-time infrastructure telemetry, synthetic transaction latency, and SLA error budgets.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall Estate Uptime"
          value="99.98%"
          target="99.90%"
          status="success"
          trend={+0.04}
          icon={Activity}
          sparklineData={[99.92, 99.95, 99.97, 99.98]}
        />
        <KPICard
          title="Average Latency"
          value="124ms"
          unit="ms"
          status="success"
          trend={-12}
          isPositiveGood={false}
          icon={Wifi}
          sparklineData={[145, 138, 130, 124]}
        />
        <KPICard
          title="Error Budget Remaining"
          value="98.2%"
          status="success"
          subtitle="Monthly SLA allowance safe"
          icon={CheckCircle2}
        />
        <KPICard
          title="Synthetic Probes"
          value="100% Pass"
          status="success"
          subtitle="All 26 endpoints responsive"
          icon={Server}
        />
      </div>

      {/* System Telemetry Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {telemetry.map((t, idx) => (
          <div key={idx} className="chart-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{t.app}</h4>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{t.host}</div>
              </div>
              <span className="badge badge-success" style={{ gap: '4px' }}>
                <CheckCircle2 size={10} />
                {t.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Uptime</div>
                <strong style={{ color: 'var(--color-emerald)' }}>{t.uptime}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Latency</div>
                <strong style={{ color: 'var(--text-primary)' }}>{t.latency}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Error Rate</div>
                <strong style={{ color: 'var(--text-primary)' }}>{t.errorRate}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
