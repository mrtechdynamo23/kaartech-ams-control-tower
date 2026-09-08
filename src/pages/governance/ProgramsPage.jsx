/**
 * EDGE AMS Control Tower — Programs & Transformation
 * Route: /governance/programs
 * AdvantEDGE enterprise transformation programs and milestone health.
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Milestone, CheckCircle2, Clock, AlertCircle, TrendingUp, Layers, Plus, X } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ProgramsPage() {
  const initialPrograms = [
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
      entities: 'All 34 Enterprise Entities',
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

  const [customPrograms, setCustomPrograms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [programName, setProgramName] = useState('');
  const [programLead, setProgramLead] = useState('Mariam Al Nuaimi');
  const [programEntities, setProgramEntities] = useState('CARACAL, NIMR, JAHEZIYA');
  const [targetGoLive, setTargetGoLive] = useState('Q2 2027');
  const [progressPct, setProgressPct] = useState(25);
  const [programStatus, setProgramStatus] = useState('On Track');
  const [milestone1, setMilestone1] = useState('Requirements Discovery & Fit-Gap');

  const allPrograms = useMemo(() => {
    return [...customPrograms, ...initialPrograms];
  }, [customPrograms]);

  const handleCreateProgram = (e) => {
    e.preventDefault();
    if (!programName.trim()) return;

    const newId = `PRG-00${allPrograms.length + 1}`;
    const newRecord = {
      id: newId,
      name: programName.trim(),
      lead: programLead.trim() || 'Transformation Director',
      entities: programEntities.trim() || 'All Business Units',
      progress: Number(progressPct) || 20,
      status: programStatus,
      targetGoLive: targetGoLive,
      milestones: [
        { name: milestone1.trim() || 'Phase 1 Scoping', status: 'In Progress', date: 'Oct 2026' },
        { name: 'Multi-Entity Prototype Build', status: 'Pending', date: 'Jan 2027' },
        { name: 'Business Cutover & Validation', status: 'Pending', date: targetGoLive },
      ]
    };

    setCustomPrograms(prev => [newRecord, ...prev]);
    setIsAddModalOpen(false);
    setProgramName('');
    setSuccessBanner(`Transformation initiative ${newId} initialized successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

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

        <button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>New Transformation Program</span>
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
          marginBottom: '20px',
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Top Metrics */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Active Programs"
          value={`${allPrograms.length} Major`}
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
        {allPrograms.map(prg => (
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

      {/* Centered New Transformation Program Modal */}
      {isAddModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsAddModalOpen(false)}
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
                  <Milestone size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    New Transformation Program
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Initialize strategic enterprise transformation stream and stage-gate milestones
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProgram} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Program Name & Core Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Coupa Procurement Modernization & Supplier Integration"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
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
                    Program Lead
                  </label>
                  <input
                    type="text"
                    value={programLead}
                    onChange={(e) => setProgramLead(e.target.value)}
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
                    In-Scope Business Units / Entities
                  </label>
                  <input
                    type="text"
                    value={programEntities}
                    onChange={(e) => setProgramEntities(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Target Go-Live Milestone
                  </label>
                  <input
                    type="text"
                    value={targetGoLive}
                    onChange={(e) => setTargetGoLive(e.target.value)}
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
                    Initial Progress %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPct}
                    onChange={(e) => setProgressPct(e.target.value)}
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
                  Current Phase 1 Milestone
                </label>
                <input
                  type="text"
                  value={milestone1}
                  onChange={(e) => setMilestone1(e.target.value)}
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
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Milestone size={14} />
                  <span>Create Program</span>
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
