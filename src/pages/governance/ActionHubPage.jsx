/**
 * EDGE AMS Control Tower — Action Hub & CAPA
 * Route: /governance/actions
 * Cross-functional Action Hub aggregating Audit Actions, Risk Actions,
 * Customer Actions, Program Actions, Transition Actions, and Service Improvement CTAs (Section 24).
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  ListChecks, AlertTriangle, CheckCircle, Plus, Clock, User,
  Shield, Sparkles, Filter, RefreshCw, Layers, X, CheckCircle2
} from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { ctas as initialCtas } from '../../data/demoData';

const ACTION_CATEGORIES = [
  'All Categories',
  'Audit Action',
  'Risk Action',
  'Customer Action',
  'Program Action',
  'Transition Action',
  'Service Improvement',
  'General CTA'
];

export default function ActionHubPage() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all');

  const [customCtas, setCustomCtas] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [actionTitle, setActionTitle] = useState('');
  const [actionSource, setActionSource] = useState('Service Improvement');
  const [actionOwner, setActionOwner] = useState('Suresh N.');
  const [actionPriority, setActionPriority] = useState('High');
  const [actionDueDate, setActionDueDate] = useState('2026-10-20');
  const [actionDesc, setActionDesc] = useState('');

  const allCtas = useMemo(() => {
    return [...customCtas, ...initialCtas];
  }, [customCtas]);

  const handleCreateAction = (e) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    const newId = `CTA-00${allCtas.length + 1}`;
    const newRecord = {
      id: newId,
      action: actionTitle.trim(),
      description: actionDesc.trim() || actionTitle.trim(),
      source: actionSource,
      owner: actionOwner.trim() || 'Action Hub Lead',
      status: 'Open',
      priority: actionPriority,
      dueDate: actionDueDate,
      createdDate: new Date().toISOString().split('T')[0],
      originatingWorkstream: actionSource,
    };

    setCustomCtas(prev => [newRecord, ...prev]);
    setIsCreateModalOpen(false);
    setActionTitle('');
    setActionDesc('');
    setSuccessBanner(`Action item ${newId} registered successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const openActions = allCtas.filter(c => c.status === 'Open' || c.status === 'In Progress');
  const overdueActions = allCtas.filter(c => c.status === 'Overdue');
  const completedActions = allCtas.filter(c => c.status === 'Completed');

  const filteredCtas = useMemo(() => {
    return allCtas.filter(item => {
      if (categoryFilter !== 'All Categories') {
        const itemSource = item.source || item.category || '';
        if (!itemSource.toLowerCase().includes(categoryFilter.toLowerCase().replace(' action', ''))) {
          return false;
        }
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [allCtas, categoryFilter, statusFilter]);

  const columns = [
    { key: 'id', label: 'Action ID', width: '110px' },
    { key: 'action', label: 'Action Item / Deliverable', wrap: true },
    {
      key: 'source',
      label: 'Origin Stream',
      width: '150px',
      render: (val) => (
        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
          {val || 'Service Improvement'}
        </span>
      )
    },
    { key: 'owner', label: 'RACI Owner', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '130px' },
    { key: 'priority', label: 'Priority', width: '110px', type: 'priority' },
    { key: 'dueDate', label: 'Target Due Date', type: 'date', width: '120px' },
  ];

  return (
    <div className="action-hub-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Action Hub & CAPA</h1>
            <span className="badge badge-primary">{allCtas.length} Centralized Actions</span>
            <span className="badge badge-success">Cross-Functional Governance</span>
          </div>
          <p className="page-subtitle">
            Single pane of governance for corrective actions, steercom commitments, audit remediations, and continuous improvements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Create Action Item</span>
          </button>
        </div>
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

      {/* KPI Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Total Action Items"
          value={allCtas.length}
          subtitle="Enterprise governance ledger"
          icon={ListChecks}
          sparklineData={[20, 24, 25, ctas.length]}
        />
        <KPICard
          title="Active In-Progress"
          value={openActions.length}
          subtitle="Under assigned execution"
          icon={Clock}
          sparklineData={[10, 12, 11, openActions.length]}
        />
        <KPICard
          title="Overdue Actions"
          value={overdueActions.length}
          status={overdueActions.length > 0 ? 'danger' : 'success'}
          subtitle="Escalated to SteerCom"
          icon={AlertTriangle}
          sparklineData={[1, 2, 3, overdueActions.length]}
        />
        <KPICard
          title="Completed & Verified"
          value={completedActions.length}
          status="success"
          subtitle="Governance closed"
          icon={CheckCircle}
        />
        <KPICard
          title="On-Time Delivery Rate"
          value="94.8%"
          target="90.0%"
          status="success"
          subtitle="Contractual performance index"
          icon={CheckCircle}
          sparklineData={[90, 92, 94.8]}
        />
      </div>

      {/* Category Filter Pills per Section 24 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={12} /> Origin Stream:
        </span>
        {ACTION_CATEGORIES.map(cat => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '11px', padding: '4px 12px', whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <DataTable
        title="Cross-Functional Action Register"
        subtitle="Click any action item to inspect RACI ownership, linked source programs, and audit notes."
        columns={columns}
        data={filteredCtas}
        onRowClick={(item) => setSelectedAction(item)}
        exportFilename="edge-action-hub.csv"
      />

      {/* Centered Record Detail Modal (Section 23, 29) */}
      <DetailModal
        isOpen={Boolean(selectedAction)}
        item={selectedAction}
        onClose={() => setSelectedAction(null)}
        type="action"
      />

      {/* Centered Create Action Item Modal */}
      {isCreateModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsCreateModalOpen(false)}
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
                  <ListChecks size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Create Action Item / CAPA
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Cross-functional commitment, corrective action, or service improvement
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAction} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Action Item Title / Deliverable *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Automate daily journal verification before 7:00 AM batch run"
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
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
                    Origin Stream
                  </label>
                  <select
                    value={actionSource}
                    onChange={(e) => setActionSource(e.target.value)}
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
                    <option value="Audit Action">Audit Action</option>
                    <option value="Risk Action">Risk Action</option>
                    <option value="Customer Action">Customer Action</option>
                    <option value="Program Action">Program Action</option>
                    <option value="Transition Action">Transition Action</option>
                    <option value="Service Improvement">Service Improvement</option>
                    <option value="General CTA">General CTA</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={actionPriority}
                    onChange={(e) => setActionPriority(e.target.value)}
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
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    RACI Owner
                  </label>
                  <input
                    type="text"
                    value={actionOwner}
                    onChange={(e) => setActionOwner(e.target.value)}
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
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={actionDueDate}
                    onChange={(e) => setActionDueDate(e.target.value)}
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
                  Detailed Description & Success Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the remediation approach, required tools, and sign-off criteria..."
                  value={actionDesc}
                  onChange={(e) => setActionDesc(e.target.value)}
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
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ListChecks size={14} />
                  <span>Register Action</span>
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
