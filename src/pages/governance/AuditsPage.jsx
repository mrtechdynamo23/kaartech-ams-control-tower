/**
 * EDGE AMS Control Tower — Audits & Compliance
 * Route: /governance/audits
 * ISO 20000, ISO 27001, SOC2, and SteerCom Internal Quality Audits per Section 24.
 * Complete with visual analytics:
 * 1. Audit Program Timeline & Execution Status
 * 2. Findings Severity Breakdown (Donut)
 * 3. Compliance Attestation Trends (Bar)
 */
import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, FileCheck, AlertCircle, CheckCircle, Plus, Calendar,
  RefreshCw, CheckCircle2, Clock, AlertTriangle, ArrowRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { audits, findings } from '../../data/demoData';

export default function AuditsPage() {
  const [activeTab, setActiveTab] = useState('audits');
  const [selectedItem, setSelectedItem] = useState(null);
  const [severityFilter, setSeverityFilter] = useState('all');

  const completedAudits = audits.filter(a => a.status === 'Completed').length;
  const activeAudits = audits.filter(a => a.status === 'In Progress' || a.status === 'Scheduled').length;
  const openFindings = findings.filter(f => f.status === 'Open' || f.status === 'In Remediation').length;

  // Findings severity data for donut
  const severityDistribution = [
    { name: 'Critical NC', value: findings.filter(f => f.severity === 'Critical' || f.severity === 'High').length, color: '#DC2626' },
    { name: 'Major NC', value: findings.filter(f => f.severity === 'Medium').length || 2, color: '#D97706' },
    { name: 'Minor / Obs', value: findings.filter(f => f.severity === 'Low' || f.severity === 'Observation').length || 4, color: '#2563EB' },
  ];

  // Audit compliance timeline data
  const auditTimeline = [
    { standard: 'ISO 20000 (ITSM)', Score: 98.8, Target: 95.0, Status: 'Certified' },
    { standard: 'ISO 27001 (Security)', Score: 99.2, Target: 95.0, Status: 'Certified' },
    { standard: 'SOC2 Type II', Score: 97.6, Target: 95.0, Status: 'Certified' },
    { standard: 'AMS Internal Quality', Score: 98.5, Target: 95.0, Status: 'Attested' },
  ];

  const filteredFindings = useMemo(() => {
    if (severityFilter === 'all') return findings;
    return findings.filter(f => f.severity?.toLowerCase() === severityFilter.toLowerCase());
  }, [severityFilter]);

  const auditColumns = [
    { key: 'id', label: 'Audit ID', width: '110px' },
    { key: 'title', label: 'Audit Scope / Standard', wrap: true },
    { key: 'type', label: 'Framework', width: '140px' },
    { key: 'leadAuditor', label: 'Lead Auditor', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '130px' },
    {
      key: 'score',
      label: 'Compliance Score',
      width: '140px',
      render: (v) => <strong style={{ color: 'var(--color-emerald)' }}>{v || '98.5%'}</strong>
    },
    { key: 'auditDate', label: 'Date Conducted', type: 'date', width: '120px' },
  ];

  const findingColumns = [
    { key: 'id', label: 'Finding ID', width: '110px' },
    { key: 'title', label: 'Observation / Non-Conformance', wrap: true },
    { key: 'severity', label: 'Severity', type: 'priority', width: '120px' },
    { key: 'auditId', label: 'Audit Ref', width: '110px' },
    { key: 'owner', label: 'Remediation Lead', width: '150px' },
    { key: 'status', label: 'Remediation Status', type: 'status', width: '140px' },
    { key: 'dueDate', label: 'Target Closure', type: 'date', width: '120px' },
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
            Formal governance cycles, external statutory compliance, and corrective action closure tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Schedule New Audit</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Overall Compliance Score"
          value="98.5%"
          target="95.0%"
          status="success"
          trend={+1.2}
          icon={ShieldCheck}
          sparklineData={[96, 97, 97.5, 98.5]}
        />
        <KPICard
          title="Completed Audits"
          value={completedAudits}
          subtitle={`${audits.length} planned for 2026`}
          icon={FileCheck}
          sparklineData={[4, 6, 8, completedAudits]}
        />
        <KPICard
          title="Active / Scheduled"
          value={activeAudits}
          subtitle="Q3/Q4 assurance pipeline"
          icon={Calendar}
        />
        <KPICard
          title="Open Audit Findings"
          value={openFindings}
          status={openFindings > 0 ? 'warning' : 'success'}
          subtitle="Under active remediation"
          icon={AlertCircle}
          sparklineData={[6, 5, 4, openFindings]}
        />
        <KPICard
          title="SLA Audit Status"
          value="100% Pass"
          status="success"
          subtitle="Contractual governance intact"
          icon={CheckCircle}
          sparklineData={[100, 100, 100, 100]}
        />
      </div>

      {/* Visual Layer: Audit Timeline & Findings Severity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '16px',
      }}>
        {/* Visual 1: Framework Compliance Ratings */}
        <ChartCard
          title="Compliance Score by Framework"
          subtitle="Assessed compliance score vs contractual 95.0% threshold"
          badge="100% Passing"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={auditTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="standard" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
              <Legend verticalAlign="top" align="right" height={28} />
              <Bar dataKey="Score" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Score (%)" barSize={28} />
              <Bar dataKey="Target" fill="#71777C" radius={[4, 4, 0, 0]} name="Threshold (%)" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Findings Severity Distribution */}
        <ChartCard
          title="Audit Findings by Severity"
          subtitle="Distribution of open Non-Conformances and recommendations"
          badge={`${findings.length} Findings`}
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
                  boxShadow: 'var(--shadow-lg)'
                }}
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

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('audits')}
          className={`btn ${activeTab === 'audits' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Audit Programs ({audits.length})
        </button>
        <button
          onClick={() => setActiveTab('findings')}
          className={`btn ${activeTab === 'findings' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Audit Findings & CAPA ({findings.length})
        </button>
      </div>

      {/* Table */}
      {activeTab === 'audits' ? (
        <DataTable
          title="Audit Schedules & Official Findings"
          subtitle="Review certified audits, compliance ratings, and scope definitions."
          columns={auditColumns}
          data={audits}
          onRowClick={(item) => setSelectedItem(item)}
          exportFilename="edge-audit-programs.csv"
        />
      ) : (
        <DataTable
          title="Audit Findings & Corrective Action Register"
          subtitle="Corrective and Preventive Actions (CAPA) assigned to remediation leads."
          columns={findingColumns}
          data={filteredFindings}
          onRowClick={(item) => setSelectedItem(item)}
          exportFilename="edge-audit-findings.csv"
        />
      )}

      {/* Centered Record Detail Modal (Section 23) */}
      <DetailModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        type="audit"
      />
    </div>
  );
}
