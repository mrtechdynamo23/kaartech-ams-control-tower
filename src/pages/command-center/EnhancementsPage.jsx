/**
 * EDGE AMS Control Tower — Enhancements & Change Requests
 * Route: /command-center/enhancements
 * Dedicated >32 person-hours workstream (ENH-OF-RUN) per Section 20 & 22.
 * Complete with all 4 required operational visual analytics:
 * 1. Minor (≤80h) vs Major (>80h) Scale Distribution (Donut)
 * 2. Delivery Pipeline Stages Funnel (Bar)
 * 3. Open Enhancement Ageing Profile (Bar)
 * 4. Monthly Velocity & Effort Hours (Area / Multi-bar)
 */
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles, Layers, Clock, CheckCircle2, GitPullRequest,
  Plus, RefreshCw, Filter, ArrowRight, TrendingUp, Cpu, X, Shield, AlertCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { getEnhancementAnalytics } from '../../data/analyticsSelectors';

export default function EnhancementsPage() {
  const [selectedEnh, setSelectedEnh] = useState(null);
  const [selectedScaleFilter, setSelectedScaleFilter] = useState(null);
  const [filters, setFilters] = useState({
    entity: 'all',
    domain: 'all',
    status: 'all',
    app: 'all',
  });

  const [customEnhancements, setCustomEnhancements] = useState([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('L2C');
  const [newApp, setNewApp] = useState('SAP S/4HANA FI-CO');
  const [newHours, setNewHours] = useState(48);
  const [newPriority, setNewPriority] = useState('High');
  const [newRequester, setNewRequester] = useState('Sarah Al Marzooqi');
  const [newDesc, setNewDesc] = useState('');

  const analytics = useMemo(() => {
    return getEnhancementAnalytics(filters);
  }, [filters]);

  const displayList = useMemo(() => {
    let list = analytics.filteredList;
    if (selectedScaleFilter) {
      if (selectedScaleFilter === 'Minor') {
        list = list.filter(item => item.category === 'Minor' || (item.timeCountHrs && item.timeCountHrs <= 80));
      } else if (selectedScaleFilter === 'Major') {
        list = list.filter(item => item.category === 'Major' || (item.timeCountHrs && item.timeCountHrs > 80));
      }
    }
    return [...customEnhancements, ...list];
  }, [analytics.filteredList, selectedScaleFilter, customEnhancements]);

  const handleCreateEnhancement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `CR-00${analytics.filteredList.length + customEnhancements.length + 1}`;
    const newRecord = {
      id: newId,
      title: newTitle.trim(),
      shortDescription: newTitle.trim(),
      description: newDesc.trim() || newTitle.trim(),
      businessDomain: newDomain,
      application: newApp,
      timeCountHrs: Number(newHours) || 40,
      effortHours: Number(newHours) || 40,
      priority: newPriority,
      status: 'Requirements',
      category: Number(newHours) > 80 ? 'Major' : 'Minor',
      requester: newRequester.trim() || 'AMS Service Manager',
      assignedTo: 'Offshore Enhancement Lead',
      createdDate: new Date().toISOString().split('T')[0],
      track: 'ENH-OF-RUN',
      businessBenefit: newDesc.trim() || 'Automated operational process modification for AdvantEDGE landscape.',
    };

    setCustomEnhancements(prev => [newRecord, ...prev]);
    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setSuccessBanner(`Enhancement ${newId} submitted successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const columns = [
    { key: 'id', label: 'CR ID', width: '110px' },
    {
      key: 'category',
      label: 'Scale',
      width: '130px',
      render: (val, item) => (
        <span
          className="badge"
          style={{
            background: val === 'Major' || (item.timeCountHrs > 80) ? 'rgba(115, 87, 184, 0.15)' : 'rgba(122, 130, 136, 0.12)',
            color: val === 'Major' || (item.timeCountHrs > 80) ? '#7357B8' : 'var(--text-secondary)',
            border: `1px solid ${val === 'Major' || (item.timeCountHrs > 80) ? '#7357B8' : 'var(--border-secondary)'}`,
            fontWeight: 600,
          }}
        >
          {val || (item.timeCountHrs > 80 ? 'Major' : 'Minor')} ({item.timeCountHrs || item.effortHours || 40}h)
        </span>
      )
    },
    { key: 'shortDescription', label: 'Enhancement Summary', wrap: true, render: (val, item) => val || item.title },
    { key: 'application', label: 'Application', width: '150px' },
    { key: 'businessDomain', label: 'Domain', width: '80px' },
    { key: 'processGroup', label: 'Process Group', width: '120px' },
    { key: 'assignedTo', label: 'Lead Developer', width: '140px', render: (val, item) => val || item.leadDeveloper || 'Unassigned' },
    { key: 'status', label: 'Stage', type: 'status', width: '130px' },
    { key: 'createdDate', label: 'Logged At', type: 'date', width: '100px' },
  ];

  return (
    <div className="enhancements-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Enhancements Pipeline</h1>
            <span className="badge badge-primary">{analytics.total} Workstream Items</span>
            <span className="badge badge-neutral">&gt;32 Person-Hours Dedicated Stream</span>
          </div>
          <p className="page-subtitle">
            Dedicated offshore enhancement track (ENH-OF-RUN) managing business modifications, custom extensions, and release deployment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilters({ entity: 'all', domain: 'all', status: 'all', app: 'all' });
              setSelectedScaleFilter(null);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} />
            <span>Reset View</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsSubmitModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Submit Enhancement Request</span>
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

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => {
          setFilters({ entity: 'all', domain: 'all', status: 'all', app: 'all' });
          setSelectedScaleFilter(null);
        }}
        statusOptions={['Requirements', 'Design', 'Build', 'Testing', 'UAT', 'Deployed', 'Closed']}
        showEntity={true}
        showDomain={true}
        showPriority={false}
        showStatus={true}
        showApp={true}
      />

      {/* KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Active Enhancements"
          value={analytics.total}
          subtitle="Total workstream pipeline"
          icon={Layers}
          sparklineData={[12, 14, 16, 18, analytics.total]}
        />
        <KPICard
          title="Minor Scale (≤80h)"
          value={analytics.minor}
          unit="CRs"
          subtitle="Sprint-level modifications"
          icon={Cpu}
        />
        <KPICard
          title="Major Scale (>80h)"
          value={analytics.major}
          unit="CRs"
          subtitle="Substantial system enhancements"
          icon={Sparkles}
        />
        <KPICard
          title="In Development / QA"
          value={analytics.inBuild}
          unit="CRs"
          status="warning"
          subtitle="Active sprint delivery"
          icon={GitPullRequest}
          sparklineData={[4, 6, 7, analytics.inBuild]}
        />
        <KPICard
          title="Delivered & Deployed"
          value={analytics.deployed}
          unit="CRs"
          status="success"
          subtitle="Released to production"
          icon={CheckCircle2}
        />
        <KPICard
          title="Committed Effort"
          value={`${analytics.totalHours}h`}
          subtitle="Tracked person-hours"
          icon={Clock}
          sparklineData={[400, 520, 680, analytics.totalHours]}
        />
      </div>

      {/* PRIMARY VISUAL ANALYTICS GRID (4 Charts per Section 20) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '16px',
      }}>
        {/* Visual 1: Minor vs Major Scale Distribution */}
        <ChartCard
          title="Enhancement Scale Distribution"
          subtitle="Minor (≤80h) vs Major (>80h) work packages. Click to filter register."
          badge={`${analytics.total} Total`}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.scaleDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                cursor="pointer"
                onClick={(entry) => {
                  if (entry && entry.name) {
                    const scale = entry.name.startsWith('Major') ? 'Major' : 'Minor';
                    setSelectedScaleFilter(selectedScaleFilter === scale ? null : scale);
                  }
                }}
              >
                {analytics.scaleDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--bg-card)"
                    strokeWidth={selectedScaleFilter && entry.name.includes(selectedScaleFilter) ? 3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
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

        {/* Visual 2: Delivery Pipeline Stages */}
        <ChartCard
          title="Enhancement Delivery Lifecycle Pipeline"
          subtitle="Work packages across Requirements, Design, Build, QA, UAT, and Deployment"
          badge="Release Funnel"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.pipelineStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="stage" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="count" name="Enhancements" radius={[4, 4, 0, 0]} barSize={28}>
                {analytics.pipelineStages.map((entry, idx) => (
                  <Cell key={`pipe-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 3: Open Enhancement Ageing */}
        <ChartCard
          title="Active Enhancement Ageing Profile"
          subtitle="Turnaround duration across in-flight development items"
          badge="Sprint Health"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.ageingBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="bucket" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="count" name="Active Packages" radius={[4, 4, 0, 0]} barSize={28}>
                {analytics.ageingBuckets.map((entry, idx) => (
                  <Cell key={`enh-age-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 4: Monthly Trend & Committed Hours */}
        <ChartCard
          title="Monthly Velocity & Effort Hours"
          subtitle="Intake vs deployed releases and person-hours delivered"
          badge="4-Month Trajectory"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="enhCreatedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="enhClosedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-lg)'
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend verticalAlign="top" align="right" height={28} />
              <Area type="monotone" dataKey="Created" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#enhCreatedGrad)" name="Intake CRs" />
              <Area type="monotone" dataKey="Closed" stroke="#0D9F6E" strokeWidth={2} fillOpacity={1} fill="url(#enhClosedGrad)" name="Deployed Releases" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filter active chip if segment selected */}
      {selectedScaleFilter && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="#7C3AED" />
            <span>Filtering table by scale: <strong>{selectedScaleFilter}</strong> ({displayList.length} records)</span>
          </div>
          <button
            onClick={() => setSelectedScaleFilter(null)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', color: '#7C3AED', textDecoration: 'underline' }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Data Table Register */}
      <DataTable
        title="Enhancement & Change Request Register"
        subtitle="Click any enhancement row to review technical architecture, sprint allocations, and CAB approval milestones."
        columns={columns}
        data={displayList}
        onRowClick={(item) => setSelectedEnh(item)}
        exportFilename="edge-enhancements.csv"
      />

      {/* Centered Record Detail Modal (Section 23) */}
      <DetailModal
        isOpen={Boolean(selectedEnh)}
        item={selectedEnh}
        onClose={() => setSelectedEnh(null)}
        type="enhancement"
      />

      {/* Centered Submit Enhancement Request Modal */}
      {isSubmitModalOpen && typeof document !== 'undefined' && createPortal(
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
          onClick={() => setIsSubmitModalOpen(false)}
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
                  <Sparkles size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Submit Enhancement Request
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Dedicated offshore workstream intake (&gt;32 Person-Hours)
                </p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateEnhancement} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Enhancement Title / Objective *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Automated Cross-Entity Invoicing for EDGE Business Units"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
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
                    value={newApp}
                    onChange={(e) => setNewApp(e.target.value)}
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
                    Committed Hours (Scale)
                  </label>
                  <input
                    type="number"
                    min="32"
                    step="8"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
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
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                    {Number(newHours) > 80 ? 'Classified as Major (>80h)' : 'Classified as Minor (≤80h)'}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
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
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Requester / Business Sponsor
                </label>
                <input
                  type="text"
                  value={newRequester}
                  onChange={(e) => setNewRequester(e.target.value)}
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
                  Functional Scope & Acceptance Criteria
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the operational requirement, expected benefits, and technical dependencies..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  onClick={() => setIsSubmitModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Submit Request</span>
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
