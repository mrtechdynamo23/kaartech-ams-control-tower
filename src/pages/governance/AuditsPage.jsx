/**
 * EDGE AMS Control Tower — Audits & Governance Compliance
 * Route: /governance/audits
 * Sections 1–10:
 * Complete Governance Traceability Workflow:
 * AUDIT → FINDING → REMEDIATION TASK → EVIDENCE / VALIDATION → FINDING CLOSURE → AUDIT COMPLIANCE
 * 
 * Includes 3 Operational Views:
 * 1. Audit Programs (15 enterprise audits)
 * 2. Audit Findings & CAPA (23 non-conformances with direct audit linkage)
 * 3. Remediation Task Board (operational remediation tasks table with 9 exact columns)
 */
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, FileCheck, AlertCircle, CheckCircle, Plus, Calendar,
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Layers, CheckSquare,
  ArrowRight, X
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { StatusBadge } from '../../components/common/Badges';
import { useGovernanceStore } from '../../data/governanceStore';

export default function AuditsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'audits';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('audit');
  const [severityFilter, setSeverityFilter] = useState('all');

  const {
    tasks,
    findings,
    audits,
    getDerivedTaskStatus,
    addAudit,
  } = useGovernanceStore();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [auditTitle, setAuditTitle] = useState('');
  const [auditDomain, setAuditDomain] = useState('R2R');
  const [auditFramework, setAuditFramework] = useState('ISO 20000');
  const [auditLead, setAuditLead] = useState('Omar Al Suwaidi');
  const [auditDate, setAuditDate] = useState('2026-09-25');
  const [auditScope, setAuditScope] = useState('');

  const handleScheduleAudit = (e) => {
    e.preventDefault();
    if (!auditTitle.trim()) return;

    const created = addAudit({
      title: auditTitle.trim(),
      businessDomain: auditDomain,
      framework: auditFramework,
      leadAuditor: auditLead.trim() || 'Omar Al Suwaidi',
      status: 'Planned',
      complianceScore: '96.0%',
      complianceStatus: 'Compliant',
      auditDate: auditDate,
      description: auditScope.trim() || auditTitle.trim(),
      scope: auditScope.trim() || 'Comprehensive operational control review and risk attestation.',
    });

    setIsScheduleModalOpen(false);
    setAuditTitle('');
    setAuditScope('');
    setSuccessBanner(`Audit program ${created.id} scheduled successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // Sync tab with URL search parameter if it changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['audits', 'findings', 'tasks'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Dynamic KPI calculations from actual active dataset (Section 10)
  const totalAudits = audits.length;
  const completedAudits = audits.filter((a) => a.status === 'Completed').length;
  const inProgressAudits = audits.filter((a) => a.status === 'In Progress').length;
  const plannedAudits = audits.filter((a) => a.status === 'Planned').length;
  const compliantAudits = audits.filter((a) => a.complianceStatus === 'Compliant').length;
  const requiresRemediationAudits = audits.filter(
    (a) => a.complianceStatus === 'Requires Remediation' || a.complianceStatus === 'Non-Compliant'
  ).length;

  const scoredAudits = audits.filter((a) => typeof a.complianceScoreNum === 'number');
  const avgScore = scoredAudits.length > 0
    ? (scoredAudits.reduce((acc, a) => acc + a.complianceScoreNum, 0) / scoredAudits.length).toFixed(1)
    : '93.2';

  const openFindings = findings.filter(
    (f) => f.status === 'Open' || f.status === 'In Progress' || f.complianceStatus === 'Open'
  ).length;
  const criticalFindings = findings.filter(
    (f) => f.severity === 'Critical' || f.impactCategory === 'Critical'
  ).length;
  const majorFindings = findings.filter(
    (f) => f.severity === 'Major' || f.impactCategory === 'Major'
  ).length;
  const minorFindings = findings.filter(
    (f) => f.severity === 'Minor' || f.severity === 'Observation' || f.impactCategory === 'Minor'
  ).length;

  // Task Board metrics (Section 10)
  const openRemediationTasks = tasks.filter((t) => getDerivedTaskStatus(t) !== 'Completed').length;
  const overdueTasks = tasks.filter((t) => getDerivedTaskStatus(t) === 'Overdue').length;

  // Findings severity distribution derived from actual dataset
  const severityDistribution = [
    { name: 'Critical NC', value: criticalFindings, color: '#DC2626' },
    { name: 'Major NC', value: majorFindings, color: '#D97706' },
    { name: 'Minor / Obs', value: minorFindings, color: '#2563EB' },
  ];

  // Framework compliance derived from audits
  const frameworkRatings = useMemo(() => {
    const groups = {};
    scoredAudits.forEach((a) => {
      const fw = a.framework || 'General';
      if (!groups[fw]) {
        groups[fw] = { total: 0, count: 0 };
      }
      groups[fw].total += a.complianceScoreNum;
      groups[fw].count += 1;
    });

    return Object.entries(groups).map(([framework, data]) => ({
      framework: framework.length > 18 ? `${framework.substring(0, 16)}…` : framework,
      fullFramework: framework,
      Score: parseFloat((data.total / data.count).toFixed(1)),
      Target: 95.0,
    }));
  }, [scoredAudits]);

  const filteredFindings = useMemo(() => {
    if (severityFilter === 'all') return findings;
    return findings.filter((f) => (f.severity || f.impactCategory)?.toLowerCase() === severityFilter.toLowerCase());
  }, [severityFilter, findings]);

  // ============================================================
  // Table Columns
  // ============================================================

  // 1. Audit Programs Columns
  const auditColumns = [
    {
      key: 'id',
      label: 'Audit ID',
      width: '105px',
      render: (v) => (
        <span style={{ color: 'var(--edge-primary, #FF5622)', fontWeight: 700, letterSpacing: '0.02em' }}>
          {v}
        </span>
      ),
    },
    { key: 'title', label: 'Audit Name & Objective', wrap: true },
    { key: 'businessDomain', label: 'Domain', width: '90px' },
    { key: 'type', label: 'Type', width: '110px' },
    { key: 'framework', label: 'Framework', width: '150px' },
    { key: 'leadAuditor', label: 'Lead Auditor', width: '150px' },
    { key: 'priority', label: 'Priority', type: 'priority', width: '110px' },
    { key: 'status', label: 'Audit Status', type: 'status', width: '120px' },
    { key: 'complianceStatus', label: 'Compliance', type: 'status', width: '150px' },
    {
      key: 'score',
      label: 'Score',
      width: '100px',
      render: (v, item) => {
        if (!v || v === 'N/A') {
          return <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: 'var(--text-xs)' }}>N/A</span>;
        }
        const num = item.complianceScoreNum || parseFloat(v);
        const color = num >= 95 ? '#10B981' : num >= 90 ? '#F59E0B' : '#EF4444';
        return <strong style={{ color }}>{v}</strong>;
      },
    },
    {
      key: 'conductedDate',
      label: 'Execution',
      width: '130px',
      render: (v, item) => {
        if (item.conductedDate) {
          return <span style={{ color: 'var(--text-primary)' }}>{item.conductedDate}</span>;
        }
        return (
          <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: 'var(--text-xs)' }}>
            Plan: {item.plannedStart}
          </span>
        );
      },
    },
  ];

  // 2. Audit Findings Columns (Section 2)
  const findingColumns = [
    {
      key: 'id',
      label: 'Finding ID',
      width: '105px',
      render: (v) => (
        <span style={{ color: 'var(--edge-primary, #FF5622)', fontWeight: 800 }}>
          {v}
        </span>
      ),
    },
    {
      key: 'shortDescription',
      label: 'Short Description',
      wrap: true,
      render: (v, item) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {item.shortDescription || item.title}
        </span>
      ),
    },
    {
      key: 'impactCategory',
      label: 'Impact Category',
      type: 'priority',
      width: '125px',
      render: (v, item) => (
        <span className={`badge ${item.severity === 'Critical' || item.impactCategory === 'Critical' ? 'badge-error' : item.severity === 'Major' || item.impactCategory === 'Major' ? 'badge-warning' : 'badge-neutral'}`}>
          {item.impactCategory || item.severity || 'Medium'}
        </span>
      ),
    },
    {
      key: 'auditId',
      label: 'Related Audit',
      width: '115px',
      render: (v) => (
        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
          {v}
        </span>
      ),
    },
    { key: 'businessDomain', label: 'Business Domain', width: '130px' },
    { key: 'processGroup', label: 'Process Group', width: '160px' },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      width: '150px',
      render: (v, item) => item.assignedTo || item.owner || 'AMS Service Manager',
    },
    {
      key: 'targetDate',
      label: 'Target Date',
      type: 'date',
      width: '115px',
      render: (v, item) => item.targetDate || item.dueDate || '2026-09-16',
    },
    {
      key: 'complianceStatus',
      label: 'Compliance Status',
      type: 'status',
      width: '140px',
      render: (v, item) => {
        const st = item.complianceStatus || item.status || 'Open';
        return <StatusBadge status={st} size="sm" />;
      },
    },
  ];

  // 3. Task Board Columns (Section 3 & 6: 9 Exact Columns)
  const taskColumns = [
    {
      key: 'id',
      label: 'Task ID',
      width: '105px',
      render: (v) => (
        <span style={{ color: 'var(--edge-primary, #FF5622)', fontWeight: 800, letterSpacing: '0.02em' }}>
          {v}
        </span>
      ),
    },
    {
      key: 'taskDescription',
      label: 'Task Description',
      wrap: true,
      render: (v, item) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
          {item.taskDescription || item.description}
        </span>
      ),
    },
    {
      key: 'auditId',
      label: 'Related Audit',
      width: '120px',
      render: (v) => (
        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
          {v}
        </span>
      ),
    },
    {
      key: 'findingId',
      label: 'Related Finding',
      width: '125px',
      render: (v) => (
        <span style={{ color: 'var(--edge-primary, #FF5622)', fontWeight: 700 }}>
          {v}
        </span>
      ),
    },
    { key: 'raisedOn', label: 'Raised On', type: 'date', width: '110px' },
    { key: 'raisedBy', label: 'Raised By', width: '140px' },
    { key: 'assignedTo', label: 'Assigned To', width: '150px' },
    { key: 'targetDate', label: 'Target Date', type: 'date', width: '110px' },
    {
      key: 'status',
      label: 'Status',
      width: '130px',
      render: (v, item) => {
        const derived = getDerivedTaskStatus(item);
        let badgeClass = 'badge-primary';
        if (derived === 'Completed') badgeClass = 'badge-success';
        else if (derived === 'Overdue') badgeClass = 'badge-error';
        else if (derived === 'In Progress') badgeClass = 'badge-info';
        else if (derived === 'Blocked') badgeClass = 'badge-warning';
        return <span className={`badge ${badgeClass}`}>{derived}</span>;
      },
    },
  ];

  return (
    <div className="audits-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Audits & Governance Compliance</h1>
            <span className="badge badge-success">ISO 20000 / 27001 Certified</span>
            <span className="badge badge-primary">SOC2 Type II Attested</span>
          </div>
          <p className="page-subtitle">
            Formal governance reviews, audit findings register, and operational remediation task board across enterprise business domains.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setIsScheduleModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Schedule New Audit</span>
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

      {/* KPI Grid (Derived dynamically from actual active dataset — Section 10) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        <KPICard
          title="Overall Compliance Score"
          value={`${avgScore}%`}
          target="95.0%"
          status={parseFloat(avgScore) >= 95 ? 'success' : 'warning'}
          trend={+1.4}
          icon={ShieldCheck}
          sparklineData={[91, 92, 92.8, parseFloat(avgScore)]}
        />
        <KPICard
          title="Total Audits"
          value={totalAudits}
          subtitle={`${completedAudits} Completed • ${inProgressAudits} Active • ${plannedAudits} Plan`}
          icon={FileCheck}
          sparklineData={[4, 6, 7, completedAudits]}
        />
        <KPICard
          title="Compliance Status"
          value={`${compliantAudits} Compliant`}
          status={requiresRemediationAudits > 0 ? 'warning' : 'success'}
          subtitle={`${requiresRemediationAudits} Require Remediation`}
          icon={CheckCircle2}
        />
        <KPICard
          title="Open Findings"
          value={openFindings}
          status={openFindings > 0 ? 'warning' : 'success'}
          subtitle={`${criticalFindings} Critical • ${majorFindings} Major`}
          icon={AlertCircle}
          sparklineData={[22, 20, 19, openFindings]}
        />
        <KPICard
          title="Remediation Tasks"
          value={openRemediationTasks}
          status={overdueTasks > 0 ? 'danger' : 'primary'}
          subtitle={`${overdueTasks} Overdue (< 06 Sep 2026)`}
          icon={CheckSquare}
          sparklineData={[12, 10, 8, openRemediationTasks]}
        />
      </div>

      {/* Visual Analytics Layer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Visual 1: Framework Compliance Ratings */}
        <ChartCard
          title="Compliance Score by Governance Framework"
          subtitle="Assessed compliance score vs contractual 95.0% threshold"
          badge={`${scoredAudits.length} Audits Evaluated`}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frameworkRatings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="framework" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis domain={[80, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
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
              <Legend verticalAlign="top" align="right" height={28} />
              <Bar dataKey="Score" fill="#10B981" radius={[4, 4, 0, 0]} name="Assessed Score (%)" barSize={26} />
              <Bar dataKey="Target" fill="#71777C" radius={[4, 4, 0, 0]} name="Threshold (95%)" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Findings Severity Distribution */}
        <ChartCard
          title="Audit Findings by Impact Severity"
          subtitle="Distribution of Non-Conformances across active audit cycles"
          badge={`${findings.length} Total Findings`}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {severityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={1} />
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
                height={36}
                formatter={(val, entry) => (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tab Switcher (3 Tabs: Audit Programs, Findings & CAPA, Remediation Task Board) */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleTabChange('audits')}
          className={`btn ${activeTab === 'audits' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Audit Programs ({audits.length})
        </button>
        <button
          onClick={() => handleTabChange('findings')}
          className={`btn ${activeTab === 'findings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Audit Findings & CAPA ({findings.length})
        </button>
        <button
          onClick={() => handleTabChange('tasks')}
          className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Remediation Task Board ({tasks.length})
        </button>
      </div>

      {/* Operational Tables */}
      {activeTab === 'audits' ? (
        <DataTable
          key="audits-table"
          title="Audit Schedules & Official Assessments"
          subtitle="Certified audits, process domains, compliance ratings, and lead auditors."
          columns={auditColumns}
          data={audits}
          onRowClick={(item) => {
            setSelectedItem(item);
            setSelectedType('audit');
          }}
          exportFilename="edge-audit-programs.csv"
        />
      ) : activeTab === 'findings' ? (
        <DataTable
          key="findings-table"
          title="Audit Findings & Corrective Action Register"
          subtitle="Discovered control gaps, impact categories, owners, and target resolution dates."
          columns={findingColumns}
          data={filteredFindings}
          onRowClick={(item) => {
            setSelectedItem(item);
            setSelectedType('finding');
          }}
          exportFilename="edge-audit-findings.csv"
        />
      ) : (
        /* Section 3 & 6: Operational Remediation Task Board */
        <DataTable
          key="tasks-table"
          title="Remediation Task Board"
          subtitle="Operational remediation execution table tracking activities to resolve audit findings."
          columns={taskColumns}
          data={tasks}
          onRowClick={(item) => {
            setSelectedItem(item);
            setSelectedType('task');
          }}
          exportFilename="edge-remediation-tasks.csv"
        />
      )}

      {/* Centered Record Detail Modal (Seamless Navigation across Audit ↔ Finding ↔ Task) */}
      <DetailModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        type={selectedType}
        onClose={() => setSelectedItem(null)}
        onSelectRelatedItem={(newItem, newType) => {
          setSelectedItem(newItem);
          setSelectedType(newType);
        }}
      />

      {/* Centered Schedule New Audit Modal */}
      {isScheduleModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsScheduleModalOpen(false)}
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
                  <ShieldCheck size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Schedule New Governance Audit
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Initialize formal compliance review program across enterprise landscape
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleScheduleAudit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Audit Name & Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Financial Close & Period End Reconciliation Review"
                  value={auditTitle}
                  onChange={(e) => setAuditTitle(e.target.value)}
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
                    value={auditDomain}
                    onChange={(e) => setAuditDomain(e.target.value)}
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
                    <option value="R2R">R2R (Record to Report)</option>
                    <option value="L2C">L2C (Lead to Cash)</option>
                    <option value="O2C">O2C (Order to Cash)</option>
                    <option value="P2P">P2P (Procure to Pay)</option>
                    <option value="H2R">H2R (Hire to Retire)</option>
                    <option value="S2P">S2P (Source to Pay)</option>
                    <option value="MFG">MFG (Manufacturing)</option>
                    <option value="CRM">CRM (Customer Mgmt)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Framework / Standard
                  </label>
                  <select
                    value={auditFramework}
                    onChange={(e) => setAuditFramework(e.target.value)}
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
                    <option value="ISO 20000">ISO 20000 (Service Mgmt)</option>
                    <option value="ISO 27001">ISO 27001 (InfoSec)</option>
                    <option value="SOC2 Type II">SOC2 Type II (Trust Services)</option>
                    <option value="Financial Controls">Financial Controls (SOX/COSO)</option>
                    <option value="NESA">NESA (UAE Cyber Assurance)</option>
                    <option value="ITIL v4">ITIL v4 Governance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Lead Auditor
                  </label>
                  <input
                    type="text"
                    value={auditLead}
                    onChange={(e) => setAuditLead(e.target.value)}
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
                    Target Review Date
                  </label>
                  <input
                    type="date"
                    value={auditDate}
                    onChange={(e) => setAuditDate(e.target.value)}
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
                  Scope & Assessment Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail systems in scope, testing procedures, control frequency, and sample size..."
                  value={auditScope}
                  onChange={(e) => setAuditScope(e.target.value)}
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
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={14} />
                  <span>Schedule Audit</span>
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
