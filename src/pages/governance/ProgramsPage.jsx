/**
 * EDGE AMS Control Tower — Programs & Transformation
 * Route: /governance/programs
 * AdvantEDGE enterprise transformation programs and milestone health.
 */
import React from 'react';
import { Milestone, CheckCircle2, Clock, AlertCircle, TrendingUp, Layers } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ProgramsPage() {
  const programs = [
    {
      id: 'PRG-001',
      name: 'AdvantEDGE S/4HANA 2025 Wave 3 Rollout',
      lead: 'Fatima Al Zaabi',
      entities: 'HALCON, NIMR, LAHAB, EPI',
      progress: 88,
      status: 'On Track',
      targetGoLive: 'Q4 2026',
      milestones: [
        { name: 'Blueprint & Architecture Sign-Off', status: 'Completed', date: 'Jan 2026' },
        { name: 'Global Template Build & Unit Test', status: 'Completed', date: 'Apr 2026' },
        { name: 'Integration Testing & User Acceptance', status: 'In Progress', date: 'Sep 2026' },
        { name: 'Cutover & Production Go-Live', status: 'Pending', date: 'Nov 2026' },
      ]
    },
    {
      id: 'PRG-002',
      name: 'SuccessFactors HXM Harmonization',
      lead: 'Sara Al Marzouqi',
      entities: 'All 34 EDGE Group Entities',
      progress: 94,
      status: 'On Track',
      targetGoLive: 'Q3 2026',
      milestones: [
        { name: 'Employee Central Global Data Model', status: 'Completed', date: 'Feb 2026' },
        { name: 'Payroll & Benefits Integration', status: 'Completed', date: 'May 2026' },
        { name: 'Self-Service Mobile Enablement', status: 'In Progress', date: 'Jul 2026' },
      ]
    },
    {
      id: 'PRG-003',
      name: 'Ariba Guided Sourcing & Vendor Integration',
      lead: 'Noura Al Shamsi',
      entities: 'ADASI, Al Tariq, Beacon Red, Oryx Labs',
      progress: 72,
      status: 'Needs Attention',
      targetGoLive: 'Q1 2027',
      milestones: [
        { name: 'Supplier Portal Architecture', status: 'Completed', date: 'Mar 2026' },
        { name: 'Catalog Management & PO Workflows', status: 'In Progress', date: 'Aug 2026' },
        { name: 'Vendor Security Clearance Handshake', status: 'Pending', date: 'Dec 2026' },
      ]
    }
  ];

  return (
    <div className="programs-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Programs & Transformation Governance</h1>
            <span className="badge badge-primary">AdvantEDGE Roadmap</span>
          </div>
          <p className="page-subtitle">Track strategic enterprise modernization programs, stage-gate deliverables, and multi-entity wave rollouts.</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Active Programs"
          value="3 Major"
          subtitle="Enterprise transformation streams"
          icon={Layers}
        />
        <KPICard
          title="Overall Program Health"
          value="91.4%"
          status="success"
          subtitle="Milestone velocity on schedule"
          icon={TrendingUp}
        />
        <KPICard
          title="Entity Coverage"
          value="34 / 34"
          subtitle="Entities engaged in wave plan"
          icon={CheckCircle2}
        />
        <KPICard
          title="Upcoming Cutover"
          value="Q4 2026"
          subtitle="Wave 3 Manufacturing Go-Live"
          icon={Milestone}
        />
      </div>

      {/* Program Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {programs.map(prg => (
          <div key={prg.id} className="chart-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{prg.id}</span>
                  <span className={`badge ${prg.status === 'On Track' ? 'badge-success' : 'badge-warning'}`}>{prg.status}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{prg.name}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Program Lead: <strong>{prg.lead}</strong> • Entities: <strong>{prg.entities}</strong> • Target: <strong>{prg.targetGoLive}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{prg.progress}%</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Completion Progress</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: '8px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ height: '100%', width: `${prg.progress}%`, background: prg.status === 'On Track' ? 'var(--color-emerald)' : 'var(--color-amber)', borderRadius: '4px' }} />
            </div>

            {/* Milestones timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {prg.milestones.map((m, idx) => (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {m.status === 'Completed' ? (
                      <CheckCircle2 size={14} style={{ color: 'var(--color-emerald)' }} />
                    ) : m.status === 'In Progress' ? (
                      <Clock size={14} style={{ color: 'var(--color-amber)' }} />
                    ) : (
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--text-tertiary)' }} />
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 600, color: m.status === 'Completed' ? 'var(--color-emerald)' : m.status === 'In Progress' ? 'var(--color-amber)' : 'var(--text-tertiary)' }}>
                      {m.status} • {m.date}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-primary)' }}>{m.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
