/**
 * EDGE AMS Control Tower — Continuous Improvement (CIP)
 * Route: /service-innovation/continuous-improvement
 */
import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle2, DollarSign, Plus, Award } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ContinuousImprovementPage() {
  const cips = [
    { id: 'CIP-001', title: 'Automated VAT Reconciliation Engine on S/4HANA', submitter: 'Mariam Al Suwaidi', domain: 'R2R', annualSavings: 'AED 420,000', status: 'Implemented', roi: '14.2x' },
    { id: 'CIP-002', title: 'Self-Healing CPI Integration Queue Monitor', submitter: 'Sunita Reddy', domain: 'Technology', annualSavings: 'AED 310,000', status: 'Implemented', roi: '9.8x' },
    { id: 'CIP-003', title: 'Plant MES Inventory Barcode Auto-Sync', submitter: 'Hassan Al Nuaimi', domain: 'E2M', annualSavings: 'AED 560,000', status: 'In Implementation', roi: '18.5x' },
    { id: 'CIP-004', title: 'Ariba Catalog Bulk Update Accelerator', submitter: 'Noura Al Shamsi', domain: 'S2P', annualSavings: 'AED 280,000', status: 'Under Review', roi: '8.0x' },
  ];

  return (
    <div className="continuous-improvement-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Continuous Improvement (CIP) & Kaizen</h1>
            <span className="badge badge-success">AED 1.8M Annual Savings</span>
          </div>
          <p className="page-subtitle">Kaizen innovation pipeline, value engineering initiatives, and quantified business return on investment.</p>
        </div>

        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Submit Innovation Idea</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Total Annual Value Created"
          value="AED 1.8M"
          status="success"
          trend={+24}
          icon={DollarSign}
          sparklineData={[1.0, 1.3, 1.5, 1.8]}
        />
        <KPICard
          title="Ideas Implemented"
          value="18 Ideas"
          status="success"
          subtitle="Delivered into production"
          icon={CheckCircle2}
        />
        <KPICard
          title="Average Initiative ROI"
          value="12.6x"
          status="success"
          subtitle="Direct financial return"
          icon={TrendingUp}
        />
        <KPICard
          title="Innovation Credits"
          value="320 Hours"
          subtitle="Contractual conversion"
          icon={Award}
        />
      </div>

      {/* CIP Register */}
      <div className="chart-card">
        <h3 className="chart-card-title">Active Kaizen & Value Improvement Register</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {cips.map(c => (
            <div key={c.id} style={{ background: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{c.id} • {c.domain}</span>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>{c.title}</h4>
                </div>
                <span className={`badge ${c.status === 'Implemented' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                Idea Champion: <strong>{c.submitter}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', border: '1px solid var(--border-secondary)' }}>
                <div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Quantified Savings</div>
                  <strong style={{ color: 'var(--color-emerald)' }}>{c.annualSavings}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Estimated ROI</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{c.roi}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
