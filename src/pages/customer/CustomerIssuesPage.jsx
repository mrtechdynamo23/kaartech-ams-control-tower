/**
 * EDGE AMS Control Tower — Escalated Issues & VIP
 * Route: /customer/issues
 */
import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Clock, Plus } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function CustomerIssuesPage() {
  const issues = [
    { id: 'ESC-001', entity: 'NIMR', title: 'Defense procurement workflow delay on GTS export validation', severity: 'High', status: 'In Triage', owner: 'Ravi Shankar', daysOpen: 2 },
    { id: 'ESC-002', entity: 'EDGE HQ', title: 'Executive Boardroom SAC connectivity latency during board session', severity: 'Critical', status: 'Resolved', owner: 'Deepak Kumar', daysOpen: 0 },
  ];

  return (
    <div className="customer-issues-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Escalated Issues & VIP Watchlist</h1>
            <span className="badge badge-warning">1 Open Escalation</span>
          </div>
          <p className="page-subtitle">Track priority stakeholder escalations, executive inquiries, and expedited remediation workflows.</p>
        </div>
      </div>

      {/* Issues List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {issues.map(iss => (
          <div key={iss.id} className="chart-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{iss.id}</span>
                  <span className="badge badge-neutral">{iss.entity}</span>
                  <span className={`badge ${iss.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{iss.severity}</span>
                  <span className={`badge ${iss.status === 'Resolved' ? 'badge-success' : 'badge-primary'}`}>{iss.status}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 2px' }}>{iss.title}</h4>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Escalation Owner: <strong>{iss.owner}</strong> • Open: {iss.daysOpen} days</div>
              </div>

              <button className="btn btn-secondary btn-sm" style={{ fontSize: 'var(--text-xs)' }}>
                View Action Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
