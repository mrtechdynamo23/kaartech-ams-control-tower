/**
 * EDGE AMS Control Tower — Command Center Overview (Section 17)
 * True operational control tower with P1/P2 visibility, SLA compliance,
 * time-series velocity trends, domain load distribution, and live exception queue.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, Clock, CheckCircle2, Activity, Layers, Flame,
  TrendingUp, AlertTriangle, Plus, ArrowRight, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';
import FilterBar from '../../components/common/FilterBar';
import DataTable from '../../components/common/DataTable';
import DetailDrawer from '../../components/common/DetailDrawer';
import CreateTicketModal from '../../components/common/CreateTicketModal';
import { getIncidentAnalytics, getServiceRequestAnalytics } from '../../data/analyticsSelectors';
import { BUSINESS_DOMAINS } from '../../data/masterData';

export default function CommandCenterOverview() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    entity: 'all',
    domain: 'all',
    priority: 'all',
    status: 'all',
    app: 'all',
  });

  const incAnalytics = useMemo(() => getIncidentAnalytics(filters), [filters]);
  const srAnalytics = useMemo(() => getServiceRequestAnalytics(filters), [filters]);

  // Domain volume data for Recharts
  const domainData = BUSINESS_DOMAINS.map(d => {
    const incs = incAnalytics.filteredList.filter(i => i.businessDomain === d.key);
    const srs = srAnalytics.filteredList.filter(s => s.businessDomain === d.key);
    return {
      domain: d.key,
      label: d.label,
      Incidents: incs.length,
      ServiceRequests: srs.length,
      Total: incs.length + srs.length,
    };
  });

  const columns = [
    { key: 'id', label: 'Ticket ID', width: '110px' },
    { key: 'priority', label: 'Priority', type: 'priority', width: '130px' },
    { key: 'shortDescription', label: 'Summary', wrap: true },
    { key: 'application', label: 'Application', width: '160px' },
    { key: 'businessDomain', label: 'Domain', width: '90px' },
    { key: 'entity', label: 'Entity', width: '140px' },
    { key: 'assignedTo', label: 'Assigned Resolver', width: '150px' },
    { key: 'status', label: 'Status', type: 'status', width: '120px' },
    { key: 'slaStatus', label: 'SLA Status', type: 'sla', width: '130px' },
  ];

  return (
    <div className="command-center-page animate-fade-in">
      {/* ── 1. Page Header ── */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Command Center</h1>
            <span className="badge badge-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Operational Dispatch
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Real-time incident triage, service request velocity, and domain load distribution across all 34 entities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/command-center/incidents')}>
            Incident Register ({incAnalytics.total})
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* ── 2. Context Filters ── */}
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

      {/* ── 3. Critical Exception Strip (Section 17) ── */}
      {incAnalytics.exceptionQueue.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', background: 'linear-gradient(90deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.02) 100%)',
          border: '1px solid var(--color-red)', borderRadius: 'var(--radius-md)',
          marginBottom: '16px', gap: '12px', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-red)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-red)', textTransform: 'uppercase' }}>
              {incAnalytics.exceptionQueue.length} Priority Operational Watch Items
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Top Item: {incAnalytics.exceptionQueue[0]?.id} ({incAnalytics.exceptionQueue[0]?.shortDescription})
            </span>
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => setSelectedTicket(incAnalytics.exceptionQueue[0])}
            style={{ fontSize: '11px', padding: '3px 8px' }}
          >
            Open Bridge Triage
          </button>
        </div>
      )}

      {/* ── 4. Compact KPI Strip ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <KPICard
          title="Active Open Tickets"
          value={incAnalytics.open + srAnalytics.open}
          unit="tickets"
          subtitle={`${incAnalytics.open} Incidents / ${srAnalytics.open} SRs`}
          icon={Layers}
          sparklineData={[42, 48, 52, incAnalytics.open + srAnalytics.open]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="P1 Critical Incidents"
          value={incAnalytics.p1}
          status={incAnalytics.p1 > 0 ? 'danger' : 'success'}
          subtitle="30m Resp / 4h Res SLA"
          icon={Flame}
          sparklineData={[2, 1, 3, incAnalytics.p1]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="Resolution SLA Met"
          value={`${incAnalytics.resolutionSla}%`}
          target="88.0%"
          status={incAnalytics.resolutionSla >= 88 ? 'success' : 'warning'}
          trend={+2.1}
          icon={CheckCircle2}
          sparklineData={[91, 93, 94.5, incAnalytics.resolutionSla]}
          onClick={() => navigate('/reporting/sla')}
        />
        <KPICard
          title="SLA Breaches"
          value={incAnalytics.breached}
          status={incAnalytics.breached === 0 ? 'success' : 'danger'}
          subtitle="Requires root cause action"
          icon={AlertTriangle}
          sparklineData={[1, 2, 2, incAnalytics.breached]}
        />
        <KPICard
          title="Major SRs (≥16h)"
          value={srAnalytics.major}
          unit="SRs"
          subtitle="Complex technical requests"
          icon={Clock}
          sparklineData={[8, 10, 11, srAnalytics.major]}
          onClick={() => navigate('/command-center/service-requests')}
        />
      </div>

      {/* ── 5. Primary Visual Analytics ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Ticket Inflow vs Resolution Velocity */}
        <ChartCard
          title="Ticket Inflow vs Resolution Velocity (4 Months)"
          subtitle="Monthly volume created vs successfully closed"
          height={260}
          actions={
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Net backlog stable</span>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={incAnalytics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5622" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#FF5622" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Area type="monotone" dataKey="Created" stroke="#FF5622" fillOpacity={1} fill="url(#createdGrad)" strokeWidth={2} name="Created Inflow" />
              <Area type="monotone" dataKey="Closed" stroke="#0D9F6E" fillOpacity={1} fill="url(#closedGrad)" strokeWidth={2} name="Resolved / Closed" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Operational Load by Business Domain */}
        <ChartCard
          title="Operational Volume by Business Domain"
          subtitle="Load balancing across 8 core business domains"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/command-center/service-requests')} style={{ fontSize: '11px' }}>
              SR Matrix <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="domain" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Incidents" fill="#FF5622" radius={[4, 4, 0, 0]} name="Incidents" />
              <Bar dataKey="ServiceRequests" fill="#2563EB" radius={[4, 4, 0, 0]} name="Service Requests" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 6. Live Dispatch Queue Table ── */}
      <DataTable
        title="Live Dispatch & Operational Queue"
        subtitle="Click any row to inspect technical root cause, SLA countdowns, and consultant assignment."
        columns={columns}
        data={incAnalytics.filteredList}
        onRowClick={(item) => setSelectedTicket(item)}
        exportFilename="command-center-live-queue.csv"
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedTicket)}
        item={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(newTicket) => {
          setSelectedTicket(newTicket);
        }}
      />
    </div>
  );
}
