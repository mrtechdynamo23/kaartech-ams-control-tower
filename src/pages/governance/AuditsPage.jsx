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
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, FileCheck, AlertCircle, CheckCircle, Plus, Calendar,
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Layers, CheckSquare,
  ArrowRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
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
  } = useGovernanceStore();

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
            Formal governance reviews, audit findings register, and operational remediation task board across EDGE business domains.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Schedule New Audit</span>
          </button>
        </div>
      </div>

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
    </div>
  );
}
