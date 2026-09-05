/**
 * EDGE AMS Control Tower — Customer Corner & CSAT
 * Route: /customer/corner
 */
import React from 'react';
import { HeartHandshake, Smile, Award, TrendingUp, Users, MessageSquare } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { ENTITIES } from '../../data/masterData';

export default function CustomerCornerPage() {
  const entityScores = ENTITIES.slice(0, 8).map((ent, idx) => ({
    name: ent.name,
    csat: (4.4 + (idx * 0.07) % 0.5).toFixed(1),
    nps: 60 + (idx * 4) % 25,
    responseRate: 75 + (idx * 3) % 20,
    status: 'Excellent',
  }));

  return (
    <div className="customer-corner-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Customer Connect & CSAT Corner</h1>
            <span className="badge badge-success">4.6 / 5.0 CSAT Index</span>
          </div>
          <p className="page-subtitle">Entity satisfaction metrics, Net Promoter Scores (NPS), and voice of business stakeholders.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall CSAT Rating"
          value="4.6"
          unit="/ 5.0"
          target="4.2"
          status="success"
          trend={+0.3}
          icon={Smile}
          sparklineData={[4.2, 4.4, 4.5, 4.6]}
        />
        <KPICard
          title="Net Promoter Score"
          value="+68"
          target="+50"
          status="success"
          trend={+6}
          icon={HeartHandshake}
          sparklineData={[58, 62, 65, 68]}
        />
        <KPICard
          title="Survey Participation"
          value="82.4%"
          target="75.0%"
          status="success"
          icon={MessageSquare}
          sparklineData={[76, 78, 80, 82.4]}
        />
        <KPICard
          title="Satisfaction Index"
          value="96.2%"
          status="success"
          subtitle="Satisfied / Very Satisfied"
          icon={Award}
        />
      </div>

      {/* Entity CSAT Matrix */}
      <div className="chart-card">
        <h3 className="chart-card-title">Entity Satisfaction Scorecard</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>EDGE Entity Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>CSAT Rating (/ 5.0)</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Net Promoter Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Survey Response Rate</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Sentiment Status</th>
              </tr>
            </thead>
            <tbody>
              {entityScores.map((sc, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{sc.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>★ {sc.csat}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 600 }}>+{sc.nps}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sc.responseRate}%</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-success">{sc.status}</span>
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
