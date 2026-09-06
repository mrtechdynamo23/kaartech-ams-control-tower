/**
 * EDGE AMS Control Tower — Risk Register
 * Route: /governance/risks
 * 5x5 Risk Heat Map matrix and mitigation action plans (Section 31).
 * Strictly enforces semantic colors (Red = Critical, Amber = Medium, Green = Low).
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Plus, Eye, RefreshCw, Layers, X, CheckCircle2 } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { risks as initialRisks } from '../../data/demoData';

export default function RiskRegisterPage() {
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const [customRisks, setCustomRisks] = useState([]);
  const [isLogRiskModalOpen, setIsLogRiskModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form state
  const [riskTitle, setRiskTitle] = useState('');
  const [riskDomain, setRiskDomain] = useState('L2C');
  const [riskCategory, setRiskCategory] = useState('Operational');
  const [riskSeverity, setRiskSeverity] = useState('High');
  const [riskOwner, setRiskOwner] = useState('Suresh N.');
  const [riskDueDate, setRiskDueDate] = useState('2026-10-15');
  const [riskMitigation, setRiskMitigation] = useState('');

  const allRisks = useMemo(() => {
    return [...customRisks, ...initialRisks];
  }, [customRisks]);

  const handleLogRisk = (e) => {
    e.preventDefault();
    if (!riskTitle.trim()) return;

    const newId = `RSK-00${allRisks.length + 1}`;
    const newRecord = {
      id: newId,
      title: riskTitle.trim(),
      category: riskCategory,
      businessDomain: riskDomain,
      severity: riskSeverity,
      inherentScore: riskSeverity === 'Critical' ? 20 : riskSeverity === 'High' ? 16 : riskSeverity === 'Medium' ? 12 : 6,
      residualScore: riskSeverity === 'Critical' ? 8 : riskSeverity === 'High' ? 6 : 4,
      owner: riskOwner.trim() || 'Enterprise Risk Lead',
      status: 'Open',
      dueDate: riskDueDate,
      mitigationPlan: riskMitigation.trim() || 'Implement standard operating procedure controls and automated validation.',
      impactDescription: riskMitigation.trim() || 'Operational disruption or SLA compliance risk.',
    };

    setCustomRisks(prev => [newRecord, ...prev]);
    setIsLogRiskModalOpen(false);
    setRiskTitle('');
    setRiskMitigation('');
    setSuccessBanner(`Risk ${newId} logged successfully into register!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const highRisks = allRisks.filter(r => r.severity === 'High' || r.severity === 'Critical');
  const mediumRisks = allRisks.filter(r => r.severity === 'Medium');
  const lowRisks = allRisks.filter(r => r.severity === 'Low');

  const filteredRisks = selectedSeverity === 'all'
    ? allRisks
    : allRisks.filter(r => r.severity?.toLowerCase() === selectedSeverity.toLowerCase());

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

        <button
          className="btn btn-primary"
          onClick={() => setIsLogRiskModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Log New Risk</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(21, 154, 106, 0.12)',
          border: '1px solid var(--color-emerald)',
          color: 'var(--color-emerald)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

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

      {/* Centered Log New Risk Modal */}
      {isLogRiskModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-overlay-centered"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '24px',
          }}
          onClick={() => setIsLogRiskModalOpen(false)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-primary, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldAlert size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Log New Operational Risk
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Enter potential exposure into the Enterprise 5x5 Risk Matrix
                </p>
              </div>
              <button
                onClick={() => setIsLogRiskModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleLogRisk} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Risk Statement / Hazard Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unplanned EDI middleware outage causing shipping delay"
                  value={riskTitle}
                  onChange={(e) => setRiskTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Business Domain
                  </label>
                  <select
                    value={riskDomain}
                    onChange={(e) => setRiskDomain(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="L2C">L2C (Lead to Cash)</option>
                    <option value="O2C">O2C (Order to Cash)</option>
                    <option value="P2P">P2P (Procure to Pay)</option>
                    <option value="R2R">R2R (Record to Report)</option>
                    <option value="H2R">H2R (Hire to Retire)</option>
                    <option value="S2P">S2P (Source to Pay)</option>
                    <option value="MFG">MFG (Manufacturing)</option>
                    <option value="CRM">CRM (Customer Mgmt)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Risk Category
                  </label>
                  <select
                    value={riskCategory}
                    onChange={(e) => setRiskCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Operational">Operational</option>
                    <option value="Technical">Technical / Infrastructure</option>
                    <option value="Security">Security & Compliance</option>
                    <option value="Financial">Financial / Contractual</option>
                    <option value="Resource">Staffing & Knowledge Retention</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Severity / Exposure
                  </label>
                  <select
                    value={riskSeverity}
                    onChange={(e) => setRiskSeverity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Critical">Critical (Inherent: 20)</option>
                    <option value="High">High (Inherent: 16)</option>
                    <option value="Medium">Medium (Inherent: 12)</option>
                    <option value="Low">Low (Inherent: 6)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Risk Owner (RACI)
                  </label>
                  <input
                    type="text"
                    value={riskOwner}
                    onChange={(e) => setRiskOwner(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Mitigation Due Date
                </label>
                <input
                  type="date"
                  value={riskDueDate}
                  onChange={(e) => setRiskDueDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Mitigation Action Plan & Controls
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail preventative controls, failover procedures, and monitoring alerts..."
                  value={riskMitigation}
                  onChange={(e) => setRiskMitigation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-primary, #e2e8f0)',
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsLogRiskModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldAlert size={14} />
                  <span>Log Risk</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
