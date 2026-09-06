/**
 * EDGE AMS Control Tower — Team Overview View
 * 
 * Inspired by NOC TeamStructurePage & TeamOverviewLandingPage concepts:
 * - Domain Workforce Distribution (Horizontal Bar Chart)
 * - Onsite vs Offshore Delivery Mix (Donut Chart)
 * - Domain Leadership & Management Team cards with direct reporting lines
 * - All 17 delivery capability teams grid with staffing and location breakdowns
 */
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Shield, Users, MapPin, ChevronRight, Layers, Award } from 'lucide-react';
import { getEnrichedResources, getOrganizationMetrics, getMemberChangeCountForTeam } from '../../../data/organizationData';
import { BUSINESS_DOMAINS } from '../../../data/masterData';

const DONUT_COLORS = ['#FF5622', '#2563EB', '#7C3AED', '#0D9F6E'];

export default function TeamOverviewView({
  onOpenResource,
  onOpenTeam,
  onFilterByDomain,
  onOpenChanges,
}) {
  const enriched = useMemo(() => getEnrichedResources(), []);
  const metrics = useMemo(() => getOrganizationMetrics(), []);
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('all');

  // Domain Chart Data
  const domainChartData = useMemo(() => {
    return BUSINESS_DOMAINS.map(d => {
      const resInDomain = enriched.filter(r => r.businessDomain === d.key);
      const onsite = resInDomain.filter(r => r.location === 'Onsite').length;
      const offshore = resInDomain.filter(r => r.location === 'Offshore').length;
      return {
        domain: d.key,
        name: d.label,
        total: resInDomain.length,
        onsite,
        offshore,
      };
    }).sort((a, b) => b.total - a.total);
  }, [enriched]);

  // Delivery Location Mix Data
  const locationMixData = useMemo(() => [
    { name: 'Onsite (Abu Dhabi HQ)', value: metrics.onsiteCount, color: '#0D9F6E' },
    { name: 'Offshore Dedicated', value: metrics.offshoreCount - metrics.sharedFlexCount, color: '#2563EB' },
    { name: 'Offshore Flex Pool', value: metrics.sharedFlexCount, color: '#7C3AED' },
  ], [metrics]);

  // Domain Leads & Tower Managers
  const domainLeads = useMemo(() => {
    return enriched.filter(r => r.directReports.length > 0 || r.id === 'RES-002');
  }, [enriched]);

  const filteredLeads = useMemo(() => {
    if (selectedDomainFilter === 'all') return domainLeads;
    return domainLeads.filter(l => l.businessDomain === selectedDomainFilter);
  }, [domainLeads, selectedDomainFilter]);

  // All 17 capability teams
  const allTeams = useMemo(() => {
    const teamsMap = new Map();
    enriched.forEach(r => {
      const key = `${r.businessDomain}::${r.processGroup}`;
      if (!teamsMap.has(key)) {
        teamsMap.set(key, {
          id: `team-${r.businessDomain}-${r.processGroup.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          domainKey: r.businessDomain,
          domainName: BUSINESS_DOMAINS.find(d => d.key === r.businessDomain)?.label || r.businessDomain,
          name: r.processGroup,
          members: [],
          onsiteCount: 0,
          offshoreCount: 0,
        });
      }
      const t = teamsMap.get(key);
      t.members.push(r);
      if (r.location === 'Onsite') t.onsiteCount++;
      else t.offshoreCount++;
    });

    return Array.from(teamsMap.values()).map(t => ({
      ...t,
      resourceCount: t.members.length,
      memberChangeCount: getMemberChangeCountForTeam(t.domainKey, t.name),
      lead: t.members.find(m => m.directReports.length > 0) || t.members[0],
    }));
  }, [enriched]);

  return (
    <div className="team-overview-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Visual Analytics: Domain Distribution & Location Mix ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Domain Distribution Bar Chart */}
        <div
          className="chart-card"
          style={{
            padding: '18px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Headcount Allocation by Business Domain
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Dedicated specialists assigned across all 8 ERP/HXM core operational streams
              </p>
            </div>
            <span className="badge badge-primary" style={{ fontSize: '11px' }}>
              8 Domains
            </span>
          </div>

          <div style={{ height: '230px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
                <XAxis dataKey="domain" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
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
                  formatter={(val, name) => [`${val} FTEs`, name === 'onsite' ? 'Onsite' : 'Offshore']}
                  labelFormatter={(label) => {
                    const item = domainChartData.find(d => d.domain === label);
                    return `${label} — ${item ? item.name : ''}`;
                  }}
                />
                <Bar dataKey="onsite" name="Onsite (UAE)" fill="#0D9F6E" stackId="a" radius={[0, 0, 0, 0]} barSize={22} />
                <Bar dataKey="offshore" name="Offshore" fill="#2563EB" stackId="a" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location & Delivery Mix Donut Chart */}
        <div
          className="chart-card"
          style={{
            padding: '18px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Delivery Track & Onsite Deployment Mix
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Hybrid delivery model: Abu Dhabi Onsite presence vs Offshore delivery centers
              </p>
            </div>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              100% Baseline Compliant
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '16px',
              alignItems: 'center',
              height: '230px',
            }}
          >
            <div style={{ position: 'relative', width: '180px', height: '210px', margin: '0 auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {locationMixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-primary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
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
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {metrics.totalResources}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '2px' }}>
                  FTEs
                </div>
              </div>
            </div>

            {/* Legend List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {locationMixData.map(loc => {
                const pct = Math.round((loc.value / metrics.totalResources) * 100);
                return (
                  <div key={loc.name} style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: loc.color }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{loc.name}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: loc.color }}>{loc.value} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: 'var(--border-primary)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: loc.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Domain Leadership & Operations Management Team Grid ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Operational Leadership & Domain Leads
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Service Delivery Manager and Functional Domain Leads responsible for service levels
            </p>
          </div>

          <select
            value={selectedDomainFilter}
            onChange={(e) => setSelectedDomainFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            <option value="all">All Domains ({domainLeads.length} Leads)</option>
            {BUSINESS_DOMAINS.map(d => (
              <option key={d.key} value={d.key}>{d.key} — {d.label}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
          }}
        >
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              onClick={() => onOpenResource(lead.id)}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover-card lead-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--edge-primary) 0%, #B82B10 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {lead.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--edge-primary)', fontWeight: 600 }}>
                    {lead.role}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div><strong>Domain:</strong> {lead.businessDomain} • {lead.processGroup}</div>
                <div><strong>Direct Reports:</strong> {lead.directReports.length} specialists</div>
                <div><strong>Location:</strong> {lead.location} ({lead.track})</div>
              </div>

              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  {lead.status}
                </span>
                <span style={{ color: 'var(--edge-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>View Profile</span>
                  <ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── All 17 Capability / Process Teams Grid ── */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            All Delivery Capability Teams ({allTeams.length})
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            Functional delivery groups executing Level 2/Level 3 incident resolution and service operations
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
          }}
        >
          {allTeams.map(team => (
            <div
              key={team.id}
              onClick={() => onOpenTeam(team)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--edge-primary)',
                    background: 'rgba(255, 86, 34, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {team.domainKey}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {team.resourceCount} Staff
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={team.name}>
                  {team.name}
                </div>
                {team.memberChangeCount > 0 && (
                  <button
                    type="button"
                    className="member-change-badge"
                    title={`${team.memberChangeCount} member change${team.memberChangeCount > 1 ? 's' : ''} for this posting`}
                    aria-label={`${team.memberChangeCount} member changes`}
                    onClick={(e) => {
                      if (onOpenChanges) {
                        e.stopPropagation();
                        onOpenChanges();
                      }
                    }}
                  >
                    [{team.memberChangeCount}]
                  </button>
                )}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Lead: <strong>{team.lead ? team.lead.name : 'Unassigned'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-primary)', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                <span>{team.onsiteCount} Onsite · {team.offshoreCount} Offshore</span>
                <span style={{ color: 'var(--edge-primary)', fontWeight: 600 }}>Inspect Team →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
