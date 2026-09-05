/**
 * EDGE AMS Control Tower — Risk Register
 * Route: /governance/risks
 * 5x5 Risk Heat Map matrix and mitigation action plans (Section 31).
 * Strictly enforces semantic colors (Red = Critical, Amber = Medium, Green = Low).
 */
import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Plus, Eye, RefreshCw, Layers } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { risks } from '../../data/demoData';

export default function RiskRegisterPage() {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const highRisks = risks.filter(r => r.severity === 'High' || r.severity === 'Critical');
  const mediumRisks = risks.filter(r => r.severity === 'Medium');
  const lowRisks = risks.filter(r => r.severity === 'Low');

  const filteredRisks = selectedSeverity === 'all'
    ? risks
    : risks.filter(r => r.severity?.toLowerCase() === selectedSeverity.toLowerCase());

  const columns = [
    { key: 'id', label: 'Risk ID', width: '110px' },
    { key: 'title', label: 'Risk Description', wrap: true },
    { key: 'category', label: 'Category', width: '130px' },
    {
      key: 'severity',
      label: 'Risk Level',
      width: '120px',
      render: (val) => {
        let cls = 'badge-neutral';
        let color = '#7A8288';
        let bg = 'rgba(122, 130, 136, 0.12)';
        if (val === 'Critical' || val === 'High') {
          color = '#D92D20';
          bg = 'rgba(217, 45, 32, 0.12)';
        } else if (val === 'Medium') {
          color = '#E5A000';
          bg = 'rgba(229, 160, 0, 0.12)';
        } else if (val === 'Low') {
          color = '#159A6A';
          bg = 'rgba(21, 154, 106, 0.12)';
        }
        return (
          <span
            className="badge"
            style={{
              backgroundColor: bg,
              color: color,
              border: `1px solid ${color}40`,
              fontWeight: 700,
            }}
          >
            {val || 'Medium'}
          </span>
        );
      }
    },
    { key: 'inherentScore', label: 'Inherent', width: '90px', render: (v) => <span style={{ fontWeight: 600 }}>{v || 16}</span> },
    { key: 'residualScore', label: 'Residual', width: '90px', render: (v) => <span style={{ color: '#159A6A', fontWeight: 700 }}>{v || 6}</span> },
    { key: 'owner', label: 'Risk Owner', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '120px' },
    { key: 'dueDate', label: 'Mitigation Due', type: 'date', width: '120px' },
  ];

  return (
    <div className="risk-register-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Enterprise Risk Register</h1>
            <span className="badge badge-warning">{highRisks.length} Elevated Risks</span>
            <span className="badge badge-success">100% Contained Controls</span>
          </div>
          <p className="page-subtitle">Proactive risk identification, 5x5 exposure matrix, and residual risk mitigation governance.</p>
        </div>

        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Log New Risk</span>
        </button>
      </div>

      {/* KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Total Tracked Risks"
          value={risks.length}
          subtitle="Across operational landscape"
          icon={ShieldAlert}
          sparklineData={[12, 14, 15, risks.length]}
        />
        <KPICard
          title="Critical / High Risks"
          value={highRisks.length}
          status={highRisks.length > 0 ? 'danger' : 'success'}
          subtitle="Mitigation actively tracked"
          icon={AlertTriangle}
          sparklineData={[5, 4, 3, highRisks.length]}
        />
        <KPICard
          title="Medium Exposure"
          value={mediumRisks.length}
          status="warning"
          subtitle="Monitored operational controls"
          sparklineData={[6, 7, 7, mediumRisks.length]}
        />
        <KPICard
          title="Residual Risk Target"
          value="100% Contained"
          status="success"
          subtitle="All controls operating effectively"
          icon={CheckCircle}
          sparklineData={[95, 98, 100, 100]}
        />
      </div>

      {/* 5x5 Risk Matrix & Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {/* Risk Heat Map Visual */}
        <div className="chart-card">
          <h3 className="chart-card-title">5x5 Risk Exposure Matrix</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '14px' }}>
            Impact (Horizontal) vs Likelihood (Vertical)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', maxWidth: '400px', margin: '0 auto' }}>
            {[
              ['#E5A000', '#E5A000', '#D92D20', '#D92D20', '#D92D20'],
              ['#159A6A', '#E5A000', '#E5A000', '#D92D20', '#D92D20'],
              ['#159A6A', '#159A6A', '#E5A000', '#E5A000', '#D92D20'],
              ['#159A6A', '#159A6A', '#159A6A', '#E5A000', '#E5A000'],
              ['#159A6A', '#159A6A', '#159A6A', '#159A6A', '#E5A000'],
            ].map((row, rowIdx) => (
              row.map((color, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  style={{
                    height: '40px',
                    borderRadius: '4px',
                    background: color,
                    opacity: 0.88,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {(5 - rowIdx) * (colIdx + 1)}
                </div>
              ))
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>
            <span>Impact: 1 (Low)</span>
            <span>Impact: 5 (Critical)</span>
          </div>
        </div>

        {/* Severity Quick Filters */}
        <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="chart-card-title">Filter by Risk Classification</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => setSelectedSeverity('all')}
              className={`btn ${selectedSeverity === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'space-between' }}
            >
              <span>All Tracked Risks</span>
              <span>{risks.length}</span>
            </button>
            <button
              onClick={() => setSelectedSeverity('critical')}
              className={`btn ${selectedSeverity === 'critical' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'space-between', borderLeft: '4px solid #D92D20' }}
            >
              <span>Critical / High Severity</span>
              <span>{highRisks.length}</span>
            </button>
            <button
              onClick={() => setSelectedSeverity('medium')}
              className={`btn ${selectedSeverity === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'space-between', borderLeft: '4px solid #E5A000' }}
            >
              <span>Medium Severity</span>
              <span>{mediumRisks.length}</span>
            </button>
            <button
              onClick={() => setSelectedSeverity('low')}
              className={`btn ${selectedSeverity === 'low' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'space-between', borderLeft: '4px solid #159A6A' }}
            >
              <span>Low Severity</span>
              <span>{lowRisks.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Active Risk Register"
        subtitle="Click any risk row to view mitigation actions, residual impact calculations, and escalation pathways."
        columns={columns}
        data={filteredRisks}
        onRowClick={(item) => setSelectedRisk(item)}
        exportFilename="edge-risk-register.csv"
      />

      {/* Centered Record Detail Modal */}
      <DetailModal
        isOpen={Boolean(selectedRisk)}
        item={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        type="risk"
      />
    </div>
  );
}
