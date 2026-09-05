/**
 * EDGE AMS Control Tower — Customer Actions & SteerCom
 * Route: /customer/actions
 */
import React from 'react';
import { Target, Users, CheckCircle2, Clock, Plus } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function CustomerActionsPage() {
  const actions = [
    { id: 'CX-001', entity: 'Halcon', title: 'Enhance E2M shopfloor batch response time', owner: 'Priya Nair', status: 'In Progress', target: 'End of Month', progress: 75 },
    { id: 'CX-002', entity: 'ADASI', title: 'Automate Ariba guided sourcing supplier approvals', owner: 'Noura Al Shamsi', status: 'Completed', target: 'Closed', progress: 100 },
    { id: 'CX-003', entity: 'EDGE HQ', title: 'Implement executive self-service SAC dashboard', owner: 'Fatima Al Zaabi', status: 'In Progress', target: 'Next Sprint', progress: 60 },
    { id: 'CX-004', entity: 'Lahab', title: 'Dedicated plant maintenance offline mobile app', owner: 'Tariq Al Dhaheri', status: 'Planning', target: 'Q4 2026', progress: 30 },
  ];

  return (
    <div className="customer-actions-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Customer Action Plans & SteerCom</h1>
            <span className="badge badge-success">Proactive CSAT Delivery</span>
          </div>
          <p className="page-subtitle">Dedicated continuous improvement initiatives tailored to specific entity operational feedback.</p>
        </div>
      </div>

      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {actions.map(act => (
          <div key={act.id} className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{act.id} • {act.entity}</span>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 0' }}>{act.title}</h4>
              </div>
              <span className={`badge ${act.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>{act.status}</span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Lead Owner: <strong>{act.owner}</strong> • Due: <strong>{act.target}</strong>
            </div>

            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ height: '100%', width: `${act.progress}%`, background: act.progress === 100 ? 'var(--color-emerald)' : 'var(--edge-primary)', borderRadius: '3px' }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-tertiary)' }}>{act.progress}% Completed</div>
          </div>
        ))}
      </div>
    </div>
  );
}
