/**
 * EDGE AMS Control Tower — Service Requests
 * Route: /command-center/service-requests
 * Standard (<16h) vs Major (≥16h) classification per Section 19 & 21.
 * Complete with all 4 required operational visual analytics:
 * 1. Standard vs Major distribution (Donut)
 * 2. Category-wise Created vs Closed (Multi-bar)
 * 3. Open SR Ageing Buckets (0–3d, 4–7d, 8–15d, 16–30d, 30+d)
 * 4. Monthly Created / Closed / Open Trend (Area)
 */
import React, { useState, useMemo } from 'react';
import {
  Layers, CheckSquare, Clock, Filter, Plus, ArrowRight,
  TrendingUp, AlertCircle, CheckCircle2, RefreshCw
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
import CreateTicketModal from '../../components/common/CreateTicketModal';
import { getServiceRequestAnalytics } from '../../data/analyticsSelectors';

export default function ServiceRequestsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [filters, setFilters] = useState({
    entity: 'all',
    domain: 'all',
    status: 'all',
    app: 'all',
  });

  const analytics = useMemo(() => {
    return getServiceRequestAnalytics(filters);
  }, [filters]);

  const displayList = useMemo(() => {
    let list = analytics.filteredList;
    if (selectedCategoryFilter) {
      if (selectedCategoryFilter === 'Standard') {
        list = list.filter(item => item.srType === 'Standard' || !item.srType);
      } else if (selectedCategoryFilter === 'Major') {
        list = list.filter(item => item.srType === 'Major');
      }
    }
    return list;
  }, [analytics.filteredList, selectedCategoryFilter]);

  const columns = [
    { key: 'id', label: 'SR ID', width: '110px' },
    {
      key: 'srType',
      label: 'Classification',
      width: '130px',
      render: (val) => (
        <span className={`badge ${val === 'Major' ? 'badge-primary' : 'badge-neutral'}`}>
          {val === 'Major' ? 'Major (≥16h)' : 'Standard (<16h)'}
        </span>
      )
    },
    { key: 'shortDescription', label: 'Request Summary', wrap: true },
    { key: 'category', label: 'Category', width: '130px' },
    { key: 'application', label: 'Application', width: '140px' },
    { key: 'businessDomain', label: 'Domain', width: '80px' },
    { key: 'processGroup', label: 'Process Group', width: '120px' },
    { key: 'assignedTo', label: 'Resolver', width: '140px' },
    { key: 'timeCountHrs', label: 'Effort', width: '80px', render: (val) => <span>{val || 8}h</span> },
    { key: 'status', label: 'Status', type: 'status', width: '120px' },
    { key: 'slaStatus', label: 'SLA Status', type: 'sla', width: '120px' },
    { key: 'createdDate', label: 'Logged At', type: 'date', width: '100px' },
  ];

  return (
    <div className="sr-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Service Requests</h1>
            <span className="badge badge-primary">{analytics.total} Registered</span>
            <span className="badge badge-neutral">Standard &lt;16h / Major ≥16h</span>
          </div>
          <p className="page-subtitle">
            Contractual service fulfilment across enterprise business domains with effort-bounded SLA tracking.
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
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>New Service Request</span>
          </button>
        </div>
      </div>

      {/* Compact Context Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => {
          setFilters({ entity: 'all', domain: 'all', status: 'all', app: 'all' });
          setSelectedCategoryFilter(null);
        }}
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
          title="Total Service Requests"
          value={analytics.total}
          subtitle={`${analytics.open} in active pipeline`}
          icon={Layers}
          sparklineData={[28, 32, 35, 38, analytics.total]}
        />
        <KPICard
          title="Standard SRs (<16h)"
          value={analytics.standard}
          unit="SRs"
          subtitle="Routine configuration & access"
          icon={CheckSquare}
          sparklineData={[18, 22, 24, analytics.standard]}
        />
        <KPICard
          title="Major SRs (≥16h)"
          value={analytics.major}
          unit="SRs"
          subtitle="Complex technical service"
          icon={Clock}
          sparklineData={[6, 8, 9, analytics.major]}
        />
        <KPICard
          title="Active In-Flight"
          value={analytics.open}
          unit="SRs"
          status={analytics.open > 15 ? 'warning' : 'info'}
          subtitle="Currently assigned to resolvers"
          icon={TrendingUp}
        />
        <KPICard
          title="Fulfilled / Closed"
          value={analytics.fulfilled}
          unit="SRs"
          status="success"
          subtitle="Delivered to satisfaction"
          icon={CheckCircle2}
        />
        <KPICard
          title="SLA Attainment"
          value={`${analytics.slaPercent}%`}
          target="90%"
          status={analytics.slaPercent >= 90 ? 'success' : 'warning'}
          icon={Clock}
          sparklineData={[92, 94, 93, analytics.slaPercent]}
        />
      </div>

      {/* PRIMARY VISUAL ANALYTICS GRID (4 Charts per Section 19) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '16px',
      }}>
        {/* Visual 1: Standard vs Major Distribution */}
        <ChartCard
          title="Standard vs Major SR Distribution"
          subtitle="Click segment to filter table by effort classification (<16h vs ≥16h)"
          badge={`${analytics.total} Total`}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analytics.classificationDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                cursor="pointer"
                onClick={(entry) => {
                  if (entry && entry.name) {
                    const type = entry.name.startsWith('Major') ? 'Major' : 'Standard';
                    setSelectedCategoryFilter(selectedCategoryFilter === type ? null : type);
                  }
                }}
              >
                {analytics.classificationDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--bg-card)"
                    strokeWidth={selectedCategoryFilter && entry.name.includes(selectedCategoryFilter) ? 3 : 1}
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
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    {val} (<strong>{entry.payload.value}</strong>)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Category-wise Created vs Closed (4 Months) */}
        <ChartCard
          title="Category Fulfilment Velocity (Last 4 Months)"
          subtitle="Created vs Closed volume across primary technical service domains"
          badge="Contractual Velocity"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.categoryMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="category" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
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
              <Bar dataKey="Created" fill="#2563EB" radius={[4, 4, 0, 0]} name="Created" barSize={18} />
              <Bar dataKey="Closed" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Fulfilled / Closed" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 3: Open SR Ageing */}
        <ChartCard
          title="Open Service Request Ageing Profile"
          subtitle="Ageing buckets: 0–3d, 4–7d, 8–15d, 16–30d, 30+d across active queue"
          badge={`${analytics.open} In-Flight`}
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
              <Bar dataKey="count" name="Open Requests" radius={[4, 4, 0, 0]} barSize={28}>
                {analytics.ageingBuckets.map((entry, idx) => (
                  <Cell key={`age-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 4: Monthly Created / Closed / Open Trend */}
        <ChartCard
          title="Monthly Fulfilment Trend"
          subtitle="Historical intake vs resolution volume over the last 4 months"
          badge="4-Month Horizon"
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="srCreatedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="srClosedGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="Created" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#srCreatedGrad)" name="Intake" />
              <Area type="monotone" dataKey="Closed" stroke="#0D9F6E" strokeWidth={2} fillOpacity={1} fill="url(#srClosedGrad)" name="Fulfilled" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filter active chip if segment selected */}
      {selectedCategoryFilter && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(209, 50, 18, 0.08)',
          border: '1px solid rgba(209, 50, 18, 0.25)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="var(--edge-primary)" />
            <span>Filtering table by classification: <strong>{selectedCategoryFilter}</strong> ({displayList.length} records)</span>
          </div>
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '11px', color: 'var(--edge-primary)', textDecoration: 'underline' }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Data Table Register */}
      <DataTable
        title="Service Request Register"
        subtitle="Click any row to inspect technical specifications, resolver assignments, and SLA progress."
        columns={columns}
        data={displayList}
        onRowClick={(item) => setSelectedTicket(item)}
        exportFilename="edge-service-requests.csv"
      />

      {/* Centered Record Detail Modal (Section 23) */}
      <DetailModal
        isOpen={Boolean(selectedTicket)}
        item={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        type="sr"
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newTicket) => {
          setSelectedTicket(newTicket);
        }}
        initialType="sr"
      />
    </div>
  );
}
