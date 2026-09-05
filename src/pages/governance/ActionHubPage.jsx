/**
 * EDGE AMS Control Tower — Action Hub & CAPA
 * Route: /governance/actions
 * Cross-functional Action Hub aggregating Audit Actions, Risk Actions,
 * Customer Actions, Program Actions, Transition Actions, and Service Improvement CTAs (Section 24).
 */
import React, { useState, useMemo } from 'react';
import {
  ListChecks, AlertTriangle, CheckCircle, Plus, Clock, User,
  Shield, Sparkles, Filter, RefreshCw, Layers
} from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { ctas } from '../../data/demoData';

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

  const openActions = ctas.filter(c => c.status === 'Open' || c.status === 'In Progress');
  const overdueActions = ctas.filter(c => c.status === 'Overdue');
  const completedActions = ctas.filter(c => c.status === 'Completed');

  const filteredCtas = useMemo(() => {
    return ctas.filter(item => {
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
  }, [categoryFilter, statusFilter]);

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
            <span className="badge badge-primary">{ctas.length} Centralized Actions</span>
            <span className="badge badge-success">Cross-Functional Governance</span>
          </div>
          <p className="page-subtitle">
            Single pane of governance for corrective actions, steercom commitments, audit remediations, and continuous improvements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Create Action Item</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Total Action Items"
          value={ctas.length}
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
    </div>
  );
}
