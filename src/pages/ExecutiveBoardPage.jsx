/**
 * EDGE AMS Control Tower — Executive Board (Section 16)
 * Recomposed executive control tower with strong visual hierarchy, 
 * compact KPI strip, multi-dimensional analytics, and critical exceptions.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Activity, Clock, CheckCircle2, AlertTriangle, Users,
  Layers, ArrowUpRight, TrendingUp, Monitor, Zap, ArrowRight, Filter
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import KPICard from '../components/common/KPICard';
import ChartCard from '../components/common/ChartCard';
import { getExecutiveBoardData } from '../data/analyticsSelectors';
import { ENTITIES, BUSINESS_DOMAINS } from '../data/masterData';

export default function ExecutiveBoardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('q2_2026');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');

  const boardData = useMemo(() => {
    return getExecutiveBoardData({
      period,
      entity: selectedEntity,
      domain: selectedDomain,
    });
  }, [period, selectedEntity, selectedDomain]);

  return (
    <div className="executive-board-page animate-fade-in">
      {/* ── Page Header & Context Filter Bar (Section 16) ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', gap: '16px', flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Executive Board</h1>
            <span className="badge badge-success" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SteerCom Ready
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Integrated AMS operational intelligence across 34 Enterprise operating entities and 26 in-scope enterprise applications.
          </p>
        </div>

        {/* Compact Executive Filters */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)',
          padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            <Filter size={12} style={{ color: 'var(--edge-primary)' }} />
            <span>Scope:</span>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)'
            }}
          >
            <optgroup label="Month">
              <option value="m_sep">September 2026</option>
              <option value="m_aug">August 2026</option>
              <option value="m_jul">July 2026</option>
              <option value="m_jun">June 2026</option>
              <option value="m_may">May 2026</option>
              <option value="m_apr">April 2026</option>
              <option value="m_mar">March 2026</option>
              <option value="m_feb">February 2026</option>
              <option value="m_jan">January 2026</option>
            </optgroup>
            <optgroup label="Quarter">
              <option value="q3_2026">Q3 2026 (Jul – Sep)</option>
              <option value="q2_2026">Q2 2026 (Apr – Jun)</option>
              <option value="q1_2026">Q1 2026 (Jan – Mar)</option>
            </optgroup>
            <optgroup label="YTD">
              <option value="ytd_2026">YTD 2026 (Jan – Sep)</option>
            </optgroup>
          </select>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            style={{
              padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)', maxWidth: '140px'
            }}
          >
            <option value="all">All Entities (34)</option>
            {ENTITIES.slice(0, 12).map(ent => (
              <option key={ent.id} value={ent.name}>{ent.name}</option>
            ))}
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            style={{
              padding: '4px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)', maxWidth: '140px'
            }}
          >
            <option value="all">All Domains (8)</option>
            {BUSINESS_DOMAINS.map(d => (
              <option key={d.key} value={d.key}>{d.key} — {d.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 1. Compact KPI Strip (Section 16 & Changes) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <KPICard
          title="Overall AMS Health"
          value={`${boardData.overallHealth}%`}
          status="success"
          trend={+1.8}
          sparklineData={[93.5, 94.2, 95.8, boardData.overallHealth]}
          onClick={() => navigate('/service-operation/overview')}
        />
        <KPICard
          title="Contractual SLA"
          value={`${boardData.slaScore}%`}
          target="88.0%"
          status={boardData.slaScore >= 88 ? 'success' : 'warning'}
          trend={+(boardData.slaScore - 88).toFixed(1)}
          sparklineData={[91, 93, 94.5, boardData.slaScore]}
          onClick={() => navigate('/reporting/sla')}
        />
        <KPICard
          title="Total Tickets"
          value={boardData.totalTickets}
          subtitle="Scope Total Volume"
          status="normal"
          accentColor="var(--edge-primary)"
          sparklineData={[Math.max(1, boardData.totalTickets - 8), Math.max(2, boardData.totalTickets - 3), boardData.totalTickets]}
          onClick={() => navigate('/command-center')}
        />
        <KPICard
          title="P1 Critical"
          value={boardData.p1Count}
          status={boardData.p1Count > 0 ? (boardData.p1Sla < 100 ? 'danger' : 'warning') : 'success'}
          subtitle={`SLA: ${boardData.p1Sla}% Met`}
          sparklineData={[1, 0, 1, boardData.p1Count]}
          onClick={() => navigate('/command-center/incidents')}
        />
        <KPICard
          title="P2 High"
          value={boardData.p2Count}
          status={boardData.p2Count > 0 ? (boardData.p2Sla < 90 ? 'warning' : 'success') : 'success'}
          subtitle={`SLA: ${boardData.p2Sla}% Met`}
          sparklineData={[3, 2, 4, boardData.p2Count]}
          onClick={() => navigate('/command-center/incidents')}
        />

        {/* Executive CSAT Visual Card */}
        <div
          className="kpi-card interactive"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-secondary)',
            borderTop: '2px solid var(--color-green)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onClick={() => navigate('/customer/feedback')}
          role="button"
          tabIndex={0}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              lineHeight: 1.2
            }}>
              Executive CSAT
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '9px', padding: '1px 5px' }}>
              Benchmark
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                95%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600 }}>
                Target: 90%
              </span>
            </div>
          </div>

          {/* Segmented distribution bar */}
          <div style={{ marginTop: '8px' }}>
            <div style={{
              display: 'flex',
              height: '7px',
              borderRadius: '4px',
              overflow: 'hidden',
              background: 'var(--bg-tertiary)',
              gap: '1px'
            }}>
              <div title="Excellent: 82%" style={{ width: '82%', background: '#0D9F6E' }} />
              <div title="Very Good: 9%" style={{ width: '9%', background: '#2563EB' }} />
              <div title="Good: 5%" style={{ width: '5%', background: '#6366F1' }} />
              <div title="Average: 2%" style={{ width: '2%', background: '#D97706' }} />
              <div title="Poor: 2%" style={{ width: '2%', background: '#DC2626' }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-primary)',
              marginTop: '5px',
              fontWeight: 600
            }}>
              <span style={{ color: 'var(--color-green)' }}>Excellent 82%</span>
              <span style={{ color: 'var(--color-red)' }}>Poor 2%</span>
            </div>
          </div>

          <div style={{
            fontSize: '9px',
            color: 'var(--text-tertiary)',
            fontStyle: 'italic',
            marginTop: '4px',
            textAlign: 'right'
          }}>
            Demo benchmark · 100% total
          </div>
        </div>

        <KPICard
          title="Application Uptime"
          value={`${boardData.appEstateHealth}%`}
          status="success"
          subtitle="26 / 26 Core Systems Healthy"
          sparklineData={[99.92, 99.95, 99.97, boardData.appEstateHealth]}
          onClick={() => navigate('/technology/application-health')}
        />
        <KPICard
          title="Resource Staffing"
          value={`${boardData.resourceCoverage}%`}
          status="success"
          subtitle="30 Dedicated FTEs Active"
          sparklineData={[100, 100, 100, 100]}
          onClick={() => navigate('/resources/directory')}
        />
      </div>

      {/* ── 2. Primary Visual Analytics (SLA Performance + Ticket Mix) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* SLA Performance Trend */}
        <ChartCard
          title="Contractual SLA Performance Trend"
          subtitle="Monthly Response vs Resolution compliance vs Contractual 88% Threshold"
          badge="RFP §5.1 Benchmark"
          badgeVariant="badge-success"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reporting/sla')} style={{ fontSize: '11px' }}>
              View SLA Matrix <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={boardData.slaTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="slaResGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9F6E" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#0D9F6E" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="slaRespGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis domain={[80, 100]} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area type="monotone" dataKey="Resolution" stroke="#0D9F6E" fillOpacity={1} fill="url(#slaResGrad)" strokeWidth={2} name="Resolution SLA %" />
              <Area type="monotone" dataKey="Response" stroke="#2563EB" fillOpacity={1} fill="url(#slaRespGrad)" strokeWidth={1.5} name="Response SLA %" />
              <Area type="monotone" dataKey="Target" stroke="#FF5622" strokeDasharray="3 3" fill="none" strokeWidth={1.5} name="Contract Target (88%)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Operational Ticket Mix */}
        <ChartCard
          title="Operational Ticket Volume Distribution"
          subtitle="Current operational mix across service streams"
          height={260}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/command-center')} style={{ fontSize: '11px' }}>
              Command Center <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={boardData.ticketMix}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {boardData.ticketMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 3. Secondary Visual Analytics (App Health + Resource Compliance) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Application Health Distribution */}
        <ChartCard
          title="Application Estate Health Status"
          subtitle="Real-time availability status across 26 enterprise systems"
          height={240}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/technology/applications')} style={{ fontSize: '11px' }}>
              App Portfolio <ArrowRight size={11} />
            </button>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', height: '100%', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-emerald)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Healthy (Green)</div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>24</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>92.3% of Estate</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-amber)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Degraded (Amber)</div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>2</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Under Patch Fix</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-red)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Critical Outage</div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--text-primary)' }}>0</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Zero Down Time</div>
            </div>
          </div>
        </ChartCard>

        {/* Resource Staffing Compliance Plan vs Actual */}
        <ChartCard
          title="Resource Staffing Compliance (Plan vs Actual)"
          subtitle="Contractual dedicated delivery pods (30 Total Specialists)"
          height={240}
          actions={
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/resources/organization')} style={{ fontSize: '11px' }}>
              Organization Map <ArrowRight size={11} />
            </button>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={boardData.resourceCompliance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="track" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '11px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Plan" fill="#71777C" radius={[4, 4, 0, 0]} name="Plan Required" />
              <Bar dataKey="Actual" fill="#FF5622" radius={[4, 4, 0, 0]} name="Actual Deployed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── 4. Critical Exceptions & Governance Action Strip (Section 16) ── */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 22px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} style={{ color: 'var(--color-amber)' }} />
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Active SteerCom Priority Exceptions & Watch Items
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/governance/actions')} style={{ fontSize: '11px' }}>
            Open Action Hub <ArrowRight size={11} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {[
            { tag: 'TRANSITION', title: 'Wave 3 S/4HANA Go-Live Gate Check', target: 'Nov 2026', badge: 'On Track', link: '/governance/transition' },
            { tag: 'SECURITY AUDIT', title: 'ISO 27001 Surveillance Audit Findings (2 OFIs)', target: 'Due in 14 Days', badge: 'In Remediation', link: '/governance/audits' },
            { tag: 'INNOVATION', title: '320 Unused Ticket Hours converted to ENH-OF-RUN', target: 'Contractual Q2', badge: 'Approved', link: '/service-innovation/ticket-reduction' },
          ].map((exc, idx) => (
            <div
              key={idx}
              onClick={() => navigate(exc.link)}
              style={{
                background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-secondary)', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--edge-primary)', letterSpacing: '0.04em' }}>{exc.tag}</span>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{exc.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Target: {exc.target}</div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{exc.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
