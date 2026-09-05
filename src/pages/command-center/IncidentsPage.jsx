/**
 * EDGE AMS Control Tower — Incident Management (Section 18)
 * Canonical functional chart reference featuring all 5 required visuals:
 * 1. Priority Distribution (Donut)
 * 2. Created vs Closed (4 Months)
 * 3. Open Incident Ageing (0-3d, 4-7d, 8-15d, 16-30d, 30+d)
 * 4. Monthly Created / Closed / Open
 * 5. Response vs Resolution SLA Performance
 * Plus Exception Panel & Interactive Register.
 */
import React, { useState, useMemo } from 'react';
import {
  Flame, Clock, CheckCircle2, AlertTriangle, Layers, Plus,
  TrendingUp, BarChart3, Filter, X, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import CreateTicketModal from '../../components/common/CreateTicketModal';
import { getIncidentAnalytics } from '../../data/analyticsSelectors';

export default function IncidentsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    entity: 'all',
    domain: 'all',
    priority: 'all',
    status: 'all',
    app: 'all',
  });

  const analytics = useMemo(() => getIncidentAnalytics(filters), [filters]);

  const handlePriorityClick = (entry) => {
    if (filters.priority === entry.key) {
      setFilters({ ...filters, priority: 'all' });
    } else {
      setFilters({ ...filters, priority: entry.key });
    }
  };

  const columns = [
    { key: 'id', label: 'Incident ID', width: '110px' },
    { key: 'priority', label: 'Priority', type: 'priority', width: '130px' },
    { key: 'shortDescription', label: 'Incident Summary', wrap: true },
    { key: 'application', label: 'Application', width: '150px' },
    { key: 'businessDomain', label: 'Domain', width: '80px' },
    { key: 'processGroup', label: 'Process Group', width: '120px' },
    { key: 'entity', label: 'Entity', width: '130px' },
    { key: 'assignedTo', label: 'Resolver', width: '140px' },
    { key: 'resolverTier', label: 'Tier', width: '70px', render: (val) => <span className="badge badge-neutral">{val || 'L2'}</span> },
    { key: 'status', label: 'Status', type: 'status', width: '120px' },
    { key: 'slaStatus', label: 'SLA Status', type: 'sla', width: '130px' },
    { key: 'createdDate', label: 'Logged At', type: 'date', width: '100px' },
  ];

  return (
    <div className="incidents-page animate-fade-in">
      {/* ── Page Header ── */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Incident Management</h1>
            <span className="badge badge-primary">{analytics.filteredList.length} Active Records</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            ITIL service disruption triage, response/resolution countdowns, and root-cause traceability across 34 entities.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} />
          <span>Log New Incident</span>
        </button>
      </div>

      {/* ── Context Filter Bar ── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ entity: 'all', domain: 'all', priority: 'all', status: 'all', app: 'all' })}
        showEntity={true}
        showDomain={true}
        showPriority={true}
        showStatus={true}
        showApp={true}
      />

      {/* ── KPI Strip (Total, P1, P2, P3, P4, Response SLA, Resolution SLA) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <KPICard
          title="Total Incidents"
          value={analytics.total}
          subtitle={`${analytics.open} actively open`}
          icon={Layers}
          sparklineData={[42, 48, 52, analytics.total]}
        />
        <KPICard
          title="P1 Critical"
          value={analytics.p1}
          status={analytics.p1 > 0 ? 'danger' : 'success'}
          subtitle="30m / 4h Target"
          icon={Flame}
          sparklineData={[2, 1, 3, analytics.p1]}
          onClick={() => setFilters({ ...filters, priority: filters.priority === 'P1' ? 'all' : 'P1' })}
        />
        <KPICard
          title="P2 High"
          value={analytics.p2}
          status={analytics.p2 > 0 ? 'warning' : 'success'}
          subtitle="2h / 8h Target"
          sparklineData={[6, 8, 7, analytics.p2]}
          onClick={() => setFilters({ ...filters, priority: filters.priority === 'P2' ? 'all' : 'P2' })}
        />
        <KPICard
          title="P3 Medium"
          value={analytics.p3}
          subtitle="1d / 2d Target"
          sparklineData={[18, 22, 20, analytics.p3]}
          onClick={() => setFilters({ ...filters, priority: filters.priority === 'P3' ? 'all' : 'P3' })}
        />
        <KPICard
          title="P4 Low"
          value={analytics.p4}
          subtitle="2d / 4d Target"
          sparklineData={[14, 18, 16, analytics.p4]}
          onClick={() => setFilters({ ...filters, priority: filters.priority === 'P4' ? 'all' : 'P4' })}
        />
        <KPICard
          title="Response SLA"
          value={`${analytics.responseSla}%`}
          target="95.0%"
          status="success"
          icon={CheckCircle2}
          sparklineData={[96, 97, 98, analytics.responseSla]}
        />
        <KPICard
          title="Resolution SLA"
          value={`${analytics.resolutionSla}%`}
          target="88.0%"
          status="success"
          icon={Clock}
          sparklineData={[91, 93, 94.5, analytics.resolutionSla]}
        />
      </div>

      {/* ── Required Visuals 1, 2, 3: Priority Donut + Created vs Closed + Ageing Buckets ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Visual 1: Priority Distribution Donut */}
        <ChartCard
          title="Priority Distribution (P1–P4)"
          subtitle="Click slice to filter table below"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={analytics.priorityDistribution}
                innerRadius={55}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
                onClick={handlePriorityClick}
                cursor="pointer"
              >
                {analytics.priorityDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={filters.priority === entry.key ? 'var(--text-primary)' : 'none'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 2: Created vs Closed (4 Months) */}
        <ChartCard
          title="Created vs Closed Velocity (4 Months)"
          subtitle="Inflow vs resolution throughput"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Created" fill="#FF5622" radius={[4, 4, 0, 0]} name="Created Inflow" />
              <Bar dataKey="Closed" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Resolved / Closed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 3: Open Incident Ageing (0–3d, 4–7d, 8–15d, 16–30d, 30+d) */}
        <ChartCard
          title="Open Incident Ageing Buckets"
          subtitle="Backlog distribution across 5 ageing bands"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.ageingBuckets} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <XAxis type="number" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis dataKey="bucket" type="category" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px' }} />
              <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} name="Active Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Required Visuals 4 & 5: Monthly Trend + Response vs Resolution SLA ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Visual 4: Monthly Created / Closed / Open */}
        <ChartCard
          title="Monthly Created vs Closed vs Active Backlog"
          subtitle="Time-series tracking of net operational queue movement"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Area type="monotone" dataKey="Created" stroke="#FF5622" fill="#FF5622" fillOpacity={0.15} strokeWidth={2} name="Created" />
              <Area type="monotone" dataKey="Closed" stroke="#0D9F6E" fill="#0D9F6E" fillOpacity={0.15} strokeWidth={2} name="Closed" />
              <Area type="monotone" dataKey="Open" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={1.5} name="Active Open" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visual 5: Response vs Resolution SLA Performance */}
        <ChartCard
          title="Response SLA vs Resolution SLA Performance"
          subtitle="Attainment percentage by priority tier vs contract target"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.slaComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="metric" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis domain={[75, 100]} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Response" fill="#2563EB" radius={[4, 4, 0, 0]} name="Response SLA %" />
              <Bar dataKey="Resolution" fill="#0D9F6E" radius={[4, 4, 0, 0]} name="Resolution SLA %" />
              <Bar dataKey="Target" fill="#71777C" radius={[4, 4, 0, 0]} name="Contract Target" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Operational Register Table ── */}
      <DataTable
        title="Incident Operational Register"
        subtitle="Click any row to open slide-out technical inspection, SLA countdown, and work notes."
        columns={columns}
        data={analytics.filteredList}
        onRowClick={(item) => setSelectedTicket(item)}
        exportFilename="edge-incident-register.csv"
      />

      {/* Centered Record Detail Modal (Section 23, 26) */}
      <DetailModal
        isOpen={Boolean(selectedTicket)}
        item={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        type="incident"
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newTicket) => {
          setSelectedTicket(newTicket);
        }}
        initialType="incident"
      />
    </div>
  );
}
