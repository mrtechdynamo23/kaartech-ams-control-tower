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
import {
  Sparkles, Layers, Clock, CheckCircle2, GitPullRequest,
  Plus, RefreshCw, Filter, ArrowRight, TrendingUp, Cpu
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
    return list;
  }, [analytics.filteredList, selectedScaleFilter]);

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
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            <span>Submit Enhancement Request</span>
          </button>
        </div>
      </div>

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
                  boxShadow: 'var(--shadow-lg)'
                }}
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
                  boxShadow: 'var(--shadow-lg)'
                }}
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
                  boxShadow: 'var(--shadow-lg)'
                }}
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
    </div>
  );
}
