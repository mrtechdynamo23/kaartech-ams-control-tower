/**
 * EDGE AMS Control Tower — Service Operation Overview
 * Route: /service-operation/overview
 */
import React from 'react';
import { Activity, Clock, CheckCircle2, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function OperationOverviewPage() {
  return (
    <div className="operation-overview-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Service Operation & ITIL Governance</h1>
            <span className="badge badge-success">ITIL v4 Operational</span>
          </div>
          <p className="page-subtitle">Day-to-day service operation cadence, standard operating procedures, disaster continuity, and operational efficiency.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="First Contact Resolution"
          value="74.2%"
          target="70.0%"
          status="success"
          trend={+2.1}
          icon={Zap}
          sparklineData={[68, 71, 73, 74.2]}
        />
        <KPICard
          title="Ticket Reopen Rate"
          value="1.8%"
          target="< 3.0%"
          status="success"
          trend={-0.4}
          isPositiveGood={false}
          icon={Activity}
          sparklineData={[2.5, 2.2, 2.0, 1.8]}
        />
        <KPICard
          title="Mean Time To Resolve"
          value="3.2h"
          unit="hrs"
          status="success"
          trend={-14}
          isPositiveGood={false}
          icon={Clock}
          sparklineData={[4.2, 3.8, 3.5, 3.2]}
        />
        <KPICard
          title="DR Readiness Score"
          value="100%"
          status="success"
          subtitle="RTO: 2h / RPO: 15m"
          icon={ShieldCheck}
        />
      </div>

      {/* Operational Rhythms Card */}
      <div className="chart-card">
        <h3 className="chart-card-title">Daily & Weekly Operational Cadence</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {[
            { time: '08:00 GST Daily', title: 'AMS Daily Operational Standup', participants: 'All Pod Leads & Shift Commanders', output: 'Blocker clearance & P1/P2 bridge alignment' },
            { time: '14:00 GST Daily', title: 'Daily Flash Report (DFR) Review', participants: 'AMS Lead & Service Manager', output: 'Executive 24h operational snapshot publication' },
            { time: '10:00 GST Thursdays', title: 'Weekly Service Review (WSR)', participants: 'Domain Leads & Entity SPOCs', output: 'Weekly trend analysis & problem reviews' },
            { time: 'Monthly 1st Week', title: 'Monthly Executive SteerCom (MSR)', participants: 'EDGE Program Director & Leadership', output: 'Contractual SLA sign-off & innovation credits' },
          ].map((cad, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', marginBottom: '4px' }}>{cad.time}</div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>{cad.title}</h4>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}><strong>Attendees:</strong> {cad.participants}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}><strong>Deliverable:</strong> {cad.output}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
