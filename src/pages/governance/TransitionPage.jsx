/**
 * EDGE AMS Control Tower — Transition Governance
 * Route: /governance/transition
 * 4-Phase Transition Framework and Domain KT Sign-off Matrix.
 */
import React from 'react';
import { GitBranch, CheckCircle2, Clock, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { BUSINESS_DOMAINS } from '../../data/masterData';

export default function TransitionPage() {
  const transitionPhases = [
    { phase: 'Phase 1', name: 'Planning & Governance', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 2', name: 'Knowledge Transfer (KT)', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 3', name: 'Primary Shadow Support', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 4', name: 'Reverse Shadow & Steady State', progress: 96, status: 'Active Go-Live', date: 'In Progress' },
  ];

  const domainReadiness = BUSINESS_DOMAINS.map((d, idx) => ({
    domain: d.key,
    label: d.label,
    ktScore: 95 + (idx % 5),
    sopCount: 14 + (idx * 3),
    shadowHours: 120 + (idx * 15),
    signOffStatus: idx < 6 ? 'Signed Off' : 'Under Review',
  }));

  return (
    <div className="transition-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Transition Governance & KT Sign-Off</h1>
            <span className="badge badge-success">Phase 4 Active</span>
          </div>
          <p className="page-subtitle">Track knowledge acquisition gates, primary/reverse shadowing milestones, and SLA handover readiness.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall Transition Health"
          value="98.5%"
          status="success"
          subtitle="All gate criteria satisfied"
          icon={ShieldCheck}
        />
        <KPICard
          title="SOPs Validated"
          value="142 SOPs"
          status="success"
          subtitle="Documented runbooks"
          icon={CheckCircle2}
        />
        <KPICard
          title="Reverse Shadow Hours"
          value="1,240h"
          subtitle="Hands-on resolved tickets"
          icon={Clock}
        />
        <KPICard
          title="Domain Sign-Offs"
          value="6 / 8"
          subtitle="Remaining: S2P, H2R final"
          icon={UserCheck}
        />
      </div>

      {/* 4-Phase Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {transitionPhases.map((p, idx) => (
          <div key={idx} className="chart-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', textTransform: 'uppercase' }}>{p.phase}</span>
              <span className={`badge ${p.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>{p.name}</h3>

            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${p.progress}%`, background: p.progress === 100 ? 'var(--color-emerald)' : 'var(--edge-primary)', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <span>Completion:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{p.progress}%</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Domain KT Sign-Off Matrix */}
      <div className="chart-card">
        <h3 className="chart-card-title">Business Domain KT Sign-Off Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Domain Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Business Domain</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>KT Assessment Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Validated SOPs</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Shadowing Hours</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Sign-Off Gate</th>
              </tr>
            </thead>
            <tbody>
              {domainReadiness.map(d => (
                <tr key={d.domain} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--edge-primary)' }}>{d.domain}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{d.label}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>{d.ktScore}%</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.sopCount} SOPs</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.shadowHours} hrs</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${d.signOffStatus === 'Signed Off' ? 'badge-success' : 'badge-warning'}`}>
                      {d.signOffStatus}
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
