/**
 * EDGE AMS Control Tower — Problem Improvement & Prevention
 * Route: /service-operation/problem-improvement
 */
import React from 'react';
import { Target, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ProblemImprovementPage() {
  const initiatives = [
    { title: 'S/4HANA Sales Order Lock Optimization', domain: 'L2C', impact: 'Eliminated 45 recurring lock incidents/month', status: 'Completed', owner: 'Khalid Al Hashimi' },
    { title: 'Ariba Supplier Punchout Timeout Fix', domain: 'S2P', impact: 'Reduces cart sync failures by 80%', status: 'In Testing', owner: 'Noura Al Shamsi' },
    { title: 'SuccessFactors Batch Delta Sync Re-try Agent', domain: 'H2R', impact: 'Self-heals transient network timeouts', status: 'Completed', owner: 'Sara Al Marzouqi' },
    { title: 'MES Production Order Status Auto-Reconciliation', domain: 'E2M', impact: 'Prevents plant floor work order discrepancies', status: 'In Development', owner: 'Priya Nair' },
  ];

  return (
    <div className="problem-improvement-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Proactive Problem Improvement</h1>
            <span className="badge badge-success">Permanent Error Elimination</span>
          </div>
          <p className="page-subtitle">Targeting recurring incident patterns, root-cause structural enhancements, and proactive system hardening.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Incident Reduction"
          value="-32.4%"
          isPositiveGood={true}
          trend={-32.4}
          status="success"
          subtitle="Year-over-year volume drop"
          icon={TrendingUp}
          sparklineData={[180, 150, 130, 122]}
        />
        <KPICard
          title="Active CIP Projects"
          value="4 Active"
          subtitle="Continuous improvement streams"
          icon={Target}
        />
        <KPICard
          title="Eliminated Inflow"
          value="140 Tickets/mo"
          status="success"
          subtitle="Deflected via root-cause fixes"
          icon={ShieldCheck}
        />
        <KPICard
          title="Fix Success Rate"
          value="99.0%"
          status="success"
          subtitle="Zero regression after deployment"
          icon={CheckCircle2}
        />
      </div>

      {/* Initiatives */}
      <div className="chart-card">
        <h3 className="chart-card-title">Active Root-Cause Hardening Initiatives</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {initiatives.map((ini, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{ini.domain}</span>
                  <span className={`badge ${ini.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>{ini.status}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>{ini.title}</h4>
                <div style={{ fontSize: '11px', color: 'var(--color-emerald)', fontWeight: 600 }}>{ini.impact}</div>
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Owner: <strong>{ini.owner}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
