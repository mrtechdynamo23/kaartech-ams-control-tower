import React, { useState, useMemo } from 'react';
import { useDataStore } from '../../data/mockDataStore';
import EmployeeDetailModal from '../../components/common/EmployeeDetailModal';
import type { MasterEmployee } from '../../data/master-employees';
import { CONTRACTED_FTE } from '../../data/master-employees';
import { ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { TEAM_OVERVIEW_SIBLINGS } from './TeamOverviewLandingPage';
import {
  ANNEX1_RUN_TEAM,
  ANNEX1_UNSTAFFED_ROLES,
  EXPERIENCE_BANDS,
  getAnnex1TeamStats,
} from '../../data/annex1-team';

const COLORS = ['#0D4C93', '#0E9F6E', '#48C1BB', '#1E1656', '#E97F0A', '#03D3C6', '#FCDC61', '#F6891F', '#22A06B'];

const TeamStructurePage: React.FC = () => {
  const { employees } = useDataStore();
  const [selectedEmployee, setSelectedEmployee] = useState<MasterEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTowerFilter, setSelectedTowerFilter] = useState<string>('All');
  const [activeDeptIndex, setActiveDeptIndex] = useState<number | null>(null);

  // Headcount by Tower
  const towerData = useMemo(() => {
    const counts: Record<string, { total: number; local: number; expat: number; active: number }> = {};
    employees.forEach(e => {
      if (!counts[e.tower]) {
        counts[e.tower] = { total: 0, local: 0, expat: 0, active: 0 };
      }
      counts[e.tower].total++;
      if (e.expatLocal === 'Local') counts[e.tower].local++;
      else counts[e.tower].expat++;
      if (e.status === 'Active') counts[e.tower].active++;
    });
    return Object.entries(counts).map(([tower, data]) => ({
      tower,
      ...data,
    }));
  }, [employees]);

  // Headcount by Department
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });
    const total = employees.length || 1;
    return Object.entries(counts)
      .map(([department, count]) => ({
        name: department,
        value: count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [employees]);

  // Key Tower Leads (Managers)
  const towerLeads = useMemo(() => {
    return employees.filter(e =>
      e.position === 'Manager' ||
      e.position === 'Operations Lead' ||
      e.position === 'Team Lead' ||
      e.role.includes('Lead')
    );
  }, [employees]);

  const filteredLeads = useMemo(() => {
    return selectedTowerFilter === 'All'
      ? towerLeads
      : towerLeads.filter(l => l.tower === selectedTowerFilter);
  }, [towerLeads, selectedTowerFilter]);

  const handleOpenProfile = (emp: MasterEmployee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container" style={{ paddingBottom: 48 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Team Overview"
        modulePath="/team-overview"
        pageTitle="Team Structure"
        siblingPages={TEAM_OVERVIEW_SIBLINGS}
      />

      {/* ─── ANNEX 1 CONTRACTED TEAM BASELINE ───────────────────────────── */}
      {(() => {
        const a1 = getAnnex1TeamStats();
        const th: React.CSSProperties = {
          padding: '8px 10px', textAlign: 'start', fontSize: '0.625rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--text-secondary, #475467)', borderBottom: '2px solid var(--border, #E4E7EC)',
        };
        const td: React.CSSProperties = {
          padding: '8px 10px', fontSize: '0.75rem', color: 'var(--text-secondary, #475467)',
          borderBottom: '1px solid var(--border, #E4E7EC)', verticalAlign: 'top',
        };
        return (
          <div
            style={{
              padding: 16,
              marginBottom: 20,
              borderRadius: 10,
              background: 'var(--card-bg, #FFFFFF)',
              border: '1px solid var(--border, #E4E7EC)',
              borderTop: '3px solid var(--brand-ink, #0D4C93)',
            }}
          >
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text, #101828)', marginBottom: 4 }}>
              Contracted Team Baseline — Annex 1 (SAP AMS Pricing Model 2026)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)', lineHeight: 1.6, marginBottom: 14 }}>
              The contracted BAU Run team is <strong>{a1.total} FTE</strong> — {a1.onshore} onshore in
              Doha and {a1.offshore} offshore, all Dedicated at Expert level, with no Shared Flex in the
              initial team. Flex capacity is deployed by the CONTRACTOR around this core at no change to
              the commercial model (SOW App.1 §4.1); work beyond 10 business days routes to Elastic
              capacity under a separate call-off (§4.2, §5). The wider roster below is the delivery pool
              from which these named resources are drawn and backfilled.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
              {[
                ['Contracted FTE', String(a1.total), 'Annex 1 sheet 2'],
                ['Onshore (Doha)', String(a1.onshore), 'COMPANY premises'],
                ['Offshore', String(a1.offshore), 'remote delivery'],
                ['Expert level', String(a1.expertCount), '> 10 years experience'],
                ['Backup coverage', `${a1.backupCoveragePct}%`, 'named backup (§6.10)'],
                ['Roles for scale-up', String(a1.unstaffedRoles), 'zero initial FTE'],
              ].map(([label, value, sub]) => (
                <div key={label} style={{ padding: 10, borderRadius: 6, background: 'var(--bg-secondary, #F8FAFC)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary, #475467)' }}>{label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)', marginTop: 2 }}>{value}</div>
                  <div style={{ fontSize: '0.5625rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
                <thead>
                  <tr>
                    {['Annex 1 role', 'FTE', 'Location', 'Commitment', 'Level', 'SAP domain', 'Assigned', 'Named backup'].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ANNEX1_RUN_TEAM.map((r) => (
                    <tr key={r.role}>
                      <td style={{ ...td, fontWeight: 700, color: 'var(--text, #101828)' }}>
                        {r.role}
                        {r.sowCoreRole && (
                          <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#B54708', marginTop: 2 }}>
                            SOW §6.2 core role: {r.sowCoreRole}
                          </div>
                        )}
                      </td>
                      <td style={td}>{r.fte}</td>
                      <td style={td}>{r.location}</td>
                      <td style={td}>{r.commitment}</td>
                      <td style={td}>{r.experienceLevel}</td>
                      <td style={td}>{r.domain}</td>
                      <td style={{ ...td, fontWeight: 600, color: 'var(--text, #101828)' }}>{r.assignedTo}</td>
                      <td style={td}>{r.backup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary, #475467)', marginBottom: 4 }}>
                  Experience bands (Annex 1)
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)', lineHeight: 1.6 }}>
                  {EXPERIENCE_BANDS.map((b) => `${b.level}: ${b.definition}`).join(' · ')}
                </div>
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary, #475467)', marginBottom: 4 }}>
                  Roles listed with zero initial FTE
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)', lineHeight: 1.6 }}>
                  {ANNEX1_UNSTAFFED_ROLES.join(' · ')}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── SUMMARY KPI STRIP ───────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Contracted Baseline</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)', marginTop: 4 }}>{CONTRACTED_FTE.dedicated} FTE</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>{CONTRACTED_FTE.onshore} onshore · {CONTRACTED_FTE.offshore} offshore (Annex 1)</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Flex Capacity</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0E9F6E', marginTop: 4 }}>+{CONTRACTED_FTE.flex}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Around the core, inside the fee (§4.1)</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>National Workforce</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)', marginTop: 4 }}>
            {employees.filter(e => e.expatLocal === 'Local').length} Local
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0E9F6E', marginTop: 2, fontWeight: 600 }}>
            {((employees.filter(e => e.expatLocal === 'Local').length / employees.length) * 100).toFixed(0)}% Qatarization
          </div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Leadership Team</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-ink-alt, #1E1656)', marginTop: 4 }}>{towerLeads.length} Leads</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>SDM & Tower Leads</div>
        </div>
      </div>

      {/* ─── CHARTS: TOWER & DEPARTMENT DISTRIBUTION ─────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Tower Headcount Bar Chart */}
        <div
          className="card"
          style={{
            padding: 20,
            borderRadius: 12,
            background: 'var(--card-bg, #FFFFFF)',
            border: '1px solid var(--border, #E4E7EC)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
            Headcount Distribution by Tower
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
            Staffing allocation and active duty coverage across 9 AMS managed towers
          </p>

          <div style={{ height: 260, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={towerData} layout="vertical" margin={{ left: 30, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #E4E7EC)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-secondary, #475467)' }} />
                <YAxis dataKey="tower" type="category" tick={{ fontSize: 11, fill: 'var(--text-secondary, #475467)' }} width={90} />
                <Tooltip contentStyle={{ background: 'var(--surface-raised, #FFFFFF)', borderRadius: 8, borderColor: 'var(--border, #E4E7EC)', fontSize: 12 }} />
                <Bar dataKey="total" name="Total Assigned" fill="#0D4C93" radius={[0, 4, 4, 0]} />
                <Bar dataKey="local" name="Local Staff" fill="#0E9F6E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown Card */}
        <div
          className="card"
          style={{
            padding: 20,
            borderRadius: 12,
            background: 'var(--card-bg, #FFFFFF)',
            border: '1px solid var(--border, #E4E7EC)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                Distribution by Department
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
                Proportionate workforce breakdown by functional organizational division
              </p>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 12,
                background: 'rgba(13, 76, 147, 0.08)',
                color: 'var(--brand-ink, #0D4C93)',
                whiteSpace: 'nowrap',
              }}
            >
              {departmentData.length} Divisions
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '170px 1fr',
              gap: 16,
              alignItems: 'center',
              flex: 1,
              minHeight: 240,
            }}
          >
            {/* Donut Chart with Center Metric */}
            <div style={{ position: 'relative', width: 170, height: 210, margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    cornerRadius={4}
                    dataKey="value"
                    onMouseEnter={(_, idx) => setActiveDeptIndex(idx)}
                    onMouseLeave={() => setActiveDeptIndex(null)}
                  >
                    {departmentData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={activeDeptIndex === null || activeDeptIndex === index ? 1 : 0.35}
                        stroke="var(--card-bg, #FFFFFF)"
                        strokeWidth={2}
                        style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div
                            style={{
                              background: 'var(--surface-raised, #FFFFFF)',
                              border: '1px solid var(--border, #E4E7EC)',
                              padding: '8px 12px',
                              borderRadius: 8,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              fontSize: 12,
                            }}
                          >
                            <div style={{ fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 2 }}>
                              {data.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #475467)' }}>
                              <span>{data.value} Staff</span>
                              <span>•</span>
                              <span style={{ fontWeight: 700, color: 'var(--brand-ink, #0D4C93)' }}>
                                {data.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Metric / Text */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: activeDeptIndex !== null ? COLORS[activeDeptIndex % COLORS.length] : 'var(--text, #101828)',
                    lineHeight: 1.1,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {activeDeptIndex !== null ? departmentData[activeDeptIndex].value : employees.length}
                </div>
                <div
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    color: 'var(--text-tertiary, #98A2B3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: 2,
                  }}
                >
                  {activeDeptIndex !== null ? 'Staff' : 'Total'}
                </div>
              </div>
            </div>

            {/* Department Breakdown Legend List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                maxHeight: 230,
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              {departmentData.map((dept, index) => {
                const color = COLORS[index % COLORS.length];
                const isHovered = activeDeptIndex === index;
                return (
                  <div
                    key={dept.name}
                    onMouseEnter={() => setActiveDeptIndex(index)}
                    onMouseLeave={() => setActiveDeptIndex(null)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: isHovered ? 'var(--bg-secondary, #F7F8FA)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: isHovered ? `1px solid ${color}40` : '1px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: isHovered ? 700 : 600,
                            color: 'var(--text, #101828)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={dept.name}
                        >
                          {dept.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                          {dept.value}
                        </span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: color,
                            background: `${color}15`,
                            padding: '1px 5px',
                            borderRadius: 4,
                            minWidth: 34,
                            textAlign: 'right',
                          }}
                        >
                          {dept.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {/* Proportion bar */}
                    <div
                      style={{
                        width: '100%',
                        height: 3,
                        borderRadius: 2,
                        background: 'var(--border, #E4E7EC)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${dept.percentage}%`,
                          height: '100%',
                          background: color,
                          borderRadius: 2,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── TOWER LEADERSHIP HIERARCHY GRID ─────────────────── */}
      <div
        className="card"
        style={{
          padding: 20,
          borderRadius: 12,
          background: 'var(--card-bg, #FFFFFF)',
          border: '1px solid var(--border, #E4E7EC)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
              Tower Leadership & Operations Management Team
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
              Service Delivery Manager, Tower Leads, and Operations Supervisors
            </p>
          </div>

          <select
            value={selectedTowerFilter}
            onChange={(e) => setSelectedTowerFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid var(--border, #E4E7EC)',
              background: 'var(--surface, #FFFFFF)',
              color: 'var(--text, #101828)',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            <option value="All">All SAP Domains</option>
            {towerData.map(t => (
              <option key={t.tower} value={t.tower}>{t.tower}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {filteredLeads.map((lead) => (
            <div
              key={lead.employeeId}
              onClick={() => handleOpenProfile(lead)}
              style={{
                padding: 16,
                borderRadius: 10,
                border: '1px solid var(--border, #E4E7EC)',
                background: 'var(--bg-secondary, #F7F8FA)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="lead-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0D4C93 0%, #0E9F6E 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                  }}
                >
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text, #101828)' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-ink, #0D4C93)', fontWeight: 600 }}>
                    {lead.role}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div><strong>Tower:</strong> {lead.tower} • {lead.department}</div>
                <div><strong>Reports To:</strong> {lead.manager}</div>
                <div><strong>Location:</strong> {lead.location}</div>
              </div>

              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border, #E4E7EC)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: lead.status === 'Active' ? '#22A06B' : '#E97F0A',
                  }}
                >
                  {lead.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-ink, #0D4C93)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span>View Profile</span>
                  <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TeamStructurePage;
