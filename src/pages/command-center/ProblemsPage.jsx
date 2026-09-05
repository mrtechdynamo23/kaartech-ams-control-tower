/**
 * EDGE AMS Control Tower — Problem Management & KEDB
 * Route: /command-center/problems
 * Root Cause Analysis (RCA) and Known Error Database (KEDB).
 * Implements Section 17, 21, 27, 28 of Master Build Specification:
 * - 5 KPIs: Open, RCA Pending, RCA Delivered, Corrective Action, Closed
 * - Lifecycle banner: Incident → Problem → RCA → Corrective Action → Prevention / KEDB
 * - Compact RCA Health & Problem Backlog charts
 * - Exact field mappings against demo generator
 * - Centered DetailModal for record inspection
 */
import React, { useState, useMemo } from 'react';
import {
  AlertOctagon, BookOpen, CheckCircle, Clock, FileText,
  Layers, Plus, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2,
  GitPullRequest, Wrench
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { problems } from '../../data/demoData';

export default function ProblemsPage() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filters, setFilters] = useState({
    entity: 'all',
    domain: 'all',
    status: 'all',
    app: 'all',
  });

  const filteredProblems = useMemo(() => {
    return problems.filter((item) => {
      if (filters.domain !== 'all' && item.businessDomain !== filters.domain) return false;
      if (filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.app !== 'all' && item.application !== filters.app) return false;
      return true;
    });
  }, [filters]);

  const openCount = problems.filter((p) => p.status === 'Open' || p.status === 'In Progress').length;
  const rcaPendingCount = problems.filter((p) => p.rcaStatus === 'Pending' || p.rcaStatus === 'Not Started').length;
  const rcaDeliveredCount = problems.filter((p) => p.rcaStatus === 'Delivered').length;
  const correctiveActionCount = problems.filter((p) => p.status === 'Corrective Action').length;
  const closedCount = problems.filter((p) => p.status === 'Closed').length;

  // RCA Health Data (Delivered vs Pending)
  const rcaHealthData = [
    { name: 'RCA Delivered', value: rcaDeliveredCount, color: '#159A6A' },
    { name: 'RCA Pending', value: rcaPendingCount, color: '#E5A000' },
  ];

  // Backlog by Status Data
  const statusBacklogData = [
    { status: 'Open', count: problems.filter((p) => p.status === 'Open').length, color: '#7A8288' },
    { status: 'In Progress', count: problems.filter((p) => p.status === 'In Progress').length, color: '#3B82C4' },
    { status: 'RCA Identified', count: problems.filter((p) => p.status === 'Root Cause Identified').length, color: '#E5A000' },
    { status: 'Corrective Action', count: correctiveActionCount, color: '#7357B8' },
    { status: 'Closed', count: closedCount, color: '#159A6A' },
  ];

  // Table columns strictly matching generator fields (Section 17)
  const columns = [
    { key: 'id', label: 'Problem ID', width: '110px' },
    { key: 'shortDescription', label: 'Problem Statement / Defect', wrap: true },
    { key: 'application', label: 'Application', width: '150px' },
    { key: 'businessDomain', label: 'Domain', width: '90px' },
    { key: 'assignedTo', label: 'Problem Lead', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '150px' },
    {
      key: 'incidentIds',
      label: 'Linked Incidents',
      width: '140px',
      render: (val) => (
        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
          {val ? (Array.isArray(val) ? val.length : 1) : 0} Incidents
        </span>
      ),
    },
    {
      key: 'rcaStatus',
      label: 'RCA Status',
      width: '130px',
      render: (val) => (
        <span className={`badge ${val === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
          {val || 'Not Started'}
        </span>
      ),
    },
    {
      key: 'kedbArticle',
      label: 'KEDB Ref',
      width: '120px',
      render: (val) =>
        val ? (
          <span style={{ color: 'var(--edge-primary)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
            {val}
          </span>
        ) : (
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>Pending</span>
        ),
    },
    { key: 'createdDate', label: 'Logged At', type: 'date', width: '110px' },
  ];

  return (
    <div className="problems-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Problem Management & KEDB</h1>
            <span className="badge badge-primary">{filteredProblems.length} Problem Records</span>
            <span className="badge badge-success">Zero-Recurrence Objective</span>
          </div>
          <p className="page-subtitle">
            Systemic root cause analysis (RCA), permanent defect resolution, and Known Error Database (KEDB) curation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setFilters({ entity: 'all', domain: 'all', status: 'all', app: 'all' })}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} />
            <span>Reset View</span>
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Open Problem Investigation</span>
          </button>
        </div>
      </div>

      {/* Contractual Problem Lifecycle Visual Banner (Section 28) */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)' }}>
          Defect Governance Chain:
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: 'var(--edge-primary)' }}>1. Incident</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>(Recurring Inflow)</span>
          </div>
          <ArrowRight size={14} color="var(--text-tertiary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: '#3B82C4' }}>2. Problem Record</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>(Investigation)</span>
          </div>
          <ArrowRight size={14} color="var(--text-tertiary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: '#159A6A' }}>3. RCA Delivered</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>(5-Why / Ishikawa)</span>
          </div>
          <ArrowRight size={14} color="var(--text-tertiary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: '#7357B8' }}>4. Corrective Action</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>(Code / Config Fix)</span>
          </div>
          <ArrowRight size={14} color="var(--text-tertiary)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
            <span style={{ color: '#E5A000' }}>5. Prevention / KEDB</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>(Permanent Remedy)</span>
          </div>
        </div>
      </div>

      {/* 5 Required KPI Metrics per Section 28 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
        }}
      >
        <KPICard
          title="Active Open Problems"
          value={openCount}
          unit="Active"
          status="warning"
          subtitle="Under triage & investigation"
          icon={AlertOctagon}
          sparklineData={[5, 6, 7, openCount]}
        />
        <KPICard
          title="RCA Pending"
          value={rcaPendingCount}
          unit="Pending"
          status={rcaPendingCount > 0 ? 'warning' : 'success'}
          subtitle="Root cause in diagnosis"
          icon={Clock}
        />
        <KPICard
          title="RCA Delivered"
          value={rcaDeliveredCount}
          unit="Delivered"
          status="success"
          subtitle="Formal RCAs published"
          icon={CheckCircle2}
          sparklineData={[8, 10, 11, rcaDeliveredCount]}
        />
        <KPICard
          title="Corrective Action"
          value={correctiveActionCount}
          unit="In CAB / Fix"
          status="info"
          subtitle="Remediation in progress"
          icon={Wrench}
        />
        <KPICard
          title="Closed & Resolved"
          value={closedCount}
          unit="Closed"
          status="success"
          subtitle="Permanent fix deployed"
          icon={CheckCircle}
        />
      </div>

      {/* Purposeful Visual Analytics per Section 28 (RCA Health + Problem Backlog) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Visual 1: RCA Health */}
        <ChartCard
          title="RCA Health & Delivery Ratio"
          subtitle="Root Cause Analysis published vs pending investigation"
          badge={`${rcaDeliveredCount} Delivered`}
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rcaHealthData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {rcaHealthData.map((entry, index) => (
                  <Cell key={`rca-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={32}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Problem Backlog by Status */}
        <ChartCard
          title="Problem Backlog by Lifecycle Status"
          subtitle="Active defect distribution from Open to Permanent Closure"
          badge="Lifecycle Queue"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusBacklogData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="status" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <Bar dataKey="count" name="Problem Records" radius={[4, 4, 0, 0]} barSize={28}>
                {statusBacklogData.map((entry, idx) => (
                  <Cell key={`stat-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ entity: 'all', domain: 'all', status: 'all', app: 'all' })}
        statusOptions={['Open', 'In Progress', 'Root Cause Identified', 'Corrective Action', 'Closed']}
        showEntity={false}
        showDomain={true}
        showPriority={false}
        showStatus={true}
        showApp={true}
      />

      {/* Data Table */}
      <DataTable
        title="Problem & Known Error Database Register"
        subtitle="Click any problem record to open the centered inspection modal with complete Incident → RCA → CTA governance lineage."
        columns={columns}
        data={filteredProblems}
        onRowClick={(item) => setSelectedProblem(item)}
        exportFilename="edge-problem-register.csv"
      />

      {/* Centered Record Detail Modal (Section 23, 27) */}
      <DetailModal
        isOpen={Boolean(selectedProblem)}
        item={selectedProblem}
        onClose={() => setSelectedProblem(null)}
        type="problem"
      />
    </div>
  );
}
