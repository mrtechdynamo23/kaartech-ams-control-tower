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
import { createPortal } from 'react-dom';
import {
  AlertOctagon, BookOpen, CheckCircle, Clock, FileText,
  Layers, Plus, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2,
  GitPullRequest, Wrench, X
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

  const [customProblems, setCustomProblems] = useState([]);
  const [isCreateProblemModalOpen, setIsCreateProblemModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDomain, setProblemDomain] = useState('L2C');
  const [problemApp, setProblemApp] = useState('SAP S/4HANA FI-CO');
  const [problemPriority, setProblemPriority] = useState('P2 - High');
  const [problemLead, setProblemLead] = useState('Omar Farooq');
  const [problemIncidents, setProblemIncidents] = useState('INC-44912, INC-44988');
  const [problemDescription, setProblemDescription] = useState('');

  const allProblems = useMemo(() => {
    return [...customProblems, ...problems];
  }, [customProblems]);

  const filteredProblems = useMemo(() => {
    return allProblems.filter((item) => {
      if (filters.domain !== 'all' && item.businessDomain !== filters.domain) return false;
      if (filters.status !== 'all' && item.status !== filters.status) return false;
      if (filters.app !== 'all' && item.application !== filters.app) return false;
      return true;
    });
  }, [allProblems, filters]);

  const handleCreateProblem = (e) => {
    e.preventDefault();
    if (!problemTitle.trim()) return;

    const newId = `PRB-00${allProblems.length + 1}`;
    const incArray = problemIncidents.split(',').map(s => s.trim()).filter(Boolean);
    const newRecord = {
      id: newId,
      shortDescription: problemTitle.trim(),
      description: problemDescription.trim() || problemTitle.trim(),
      application: problemApp,
      businessDomain: problemDomain,
      assignedTo: problemLead.trim() || 'Problem Management Lead',
      status: 'Open',
      rcaStatus: 'Pending',
      incidentIds: incArray.length > 0 ? incArray : ['INC-44912'],
      kedbArticle: null,
      priority: problemPriority,
      createdDate: new Date().toISOString().split('T')[0],
      impact: 'Recurring critical operational impairment across landscape',
      category: 'Defect Investigation',
    };

    setCustomProblems(prev => [newRecord, ...prev]);
    setIsCreateProblemModalOpen(false);
    setProblemTitle('');
    setProblemDescription('');
    setSuccessBanner(`Problem investigation ${newId} initiated successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const openCount = allProblems.filter((p) => p.status === 'Open' || p.status === 'In Progress').length;
  const rcaPendingCount = allProblems.filter((p) => p.rcaStatus === 'Pending' || p.rcaStatus === 'Not Started').length;
  const rcaDeliveredCount = allProblems.filter((p) => p.rcaStatus === 'Delivered').length;
  const correctiveActionCount = allProblems.filter((p) => p.status === 'Corrective Action').length;
  const closedCount = allProblems.filter((p) => p.status === 'Closed').length;

  // RCA Health Data (Delivered vs Pending)
  const rcaHealthData = [
    { name: 'RCA Delivered', value: rcaDeliveredCount, color: '#159A6A' },
    { name: 'RCA Pending', value: rcaPendingCount, color: '#E5A000' },
  ];

  // Backlog by Status Data
  const statusBacklogData = [
    { status: 'Open', count: allProblems.filter((p) => p.status === 'Open').length, color: '#7A8288' },
    { status: 'In Progress', count: allProblems.filter((p) => p.status === 'In Progress').length, color: '#3B82C4' },
    { status: 'RCA Identified', count: allProblems.filter((p) => p.status === 'Root Cause Identified').length, color: '#E5A000' },
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
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateProblemModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Open Problem Investigation</span>
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
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
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
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
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

      {/* Centered Open Problem Investigation Modal */}
      {isCreateProblemModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsCreateProblemModalOpen(false)}
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
                  <AlertOctagon size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Open Problem Investigation
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Initiate formal Root Cause Analysis (RCA) and defect prevention workflow
                </p>
              </div>
              <button
                onClick={() => setIsCreateProblemModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProblem} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Problem Statement / Recurring Defect *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Recurring Intercompany Reconciliation Mismatch during Period End"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
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
                    value={problemDomain}
                    onChange={(e) => setProblemDomain(e.target.value)}
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
                    Application
                  </label>
                  <select
                    value={problemApp}
                    onChange={(e) => setProblemApp(e.target.value)}
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
                    <option value="SAP S/4HANA FI-CO">SAP S/4HANA FI-CO</option>
                    <option value="SAP S/4HANA SD">SAP S/4HANA SD</option>
                    <option value="SAP S/4HANA MM">SAP S/4HANA MM</option>
                    <option value="SAP SuccessFactors">SAP SuccessFactors</option>
                    <option value="Salesforce CRM">Salesforce CRM</option>
                    <option value="Coupa Procurement">Coupa Procurement</option>
                    <option value="Oracle Cloud ERP">Oracle Cloud ERP</option>
                    <option value="ServiceNow ITSM">ServiceNow ITSM</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Priority Level
                  </label>
                  <select
                    value={problemPriority}
                    onChange={(e) => setProblemPriority(e.target.value)}
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
                    <option value="P1 - Critical">P1 - Critical</option>
                    <option value="P2 - High">P2 - High</option>
                    <option value="P3 - Medium">P3 - Medium</option>
                    <option value="P4 - Low">P4 - Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Assigned Problem Lead
                  </label>
                  <input
                    type="text"
                    value={problemLead}
                    onChange={(e) => setProblemLead(e.target.value)}
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
                  Linked Incidents (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="INC-44912, INC-44988, INC-45012"
                  value={problemIncidents}
                  onChange={(e) => setProblemIncidents(e.target.value)}
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
                  Symptom Analysis & Failure Symptoms
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail recurring symptoms, business operational disruption, and preliminary triage findings..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
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
                  onClick={() => setIsCreateProblemModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertOctagon size={14} />
                  <span>Initiate Investigation</span>
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
