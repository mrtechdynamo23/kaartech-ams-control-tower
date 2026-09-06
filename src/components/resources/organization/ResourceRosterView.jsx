/**
 * EDGE AMS Control Tower — Resource Roster View
 * 
 * Inspired by NOC ResourceRoster.tsx:
 * - Master personnel table linked directly to hierarchy and filters
 * - Sortable columns, search integration, direct profile inspection
 */
import React from 'react';
import { Eye, MapPin, Shield, CheckCircle2, User } from 'lucide-react';
import { getEnrichedResources } from '../../../data/organizationData';
import { isResourceAvailable } from '../../../data/timeManagementStore';

export default function ResourceRosterView({
  resources,
  onOpenResource,
  searchTerm,
  filters,
}) {
  const enriched = resources || getEnrichedResources();

  // Filter based on search and filters
  const filteredList = enriched.filter(res => {
    if (filters.domain && filters.domain !== 'all' && res.businessDomain !== filters.domain) {
      return false;
    }
    if (filters.location && filters.location !== 'all' && res.location !== filters.location) {
      return false;
    }
    if (filters.track && filters.track !== 'all' && res.track !== filters.track) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = [
        res.name,
        res.id,
        res.positionId,
        res.role,
        res.businessDomain,
        res.processGroup,
        res.skill,
        res.certification,
        res.track,
        res.managerInfo?.name || '',
      ].join(' ').toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="resource-roster-view animate-fade-in">
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Master Resource Personnel Roster
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Showing {filteredList.length} of {enriched.length} total specialists across all active operational delivery tracks
            </p>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
            {filteredList.length} Records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>SPECIALIST</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>POSITION & ID</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>DOMAIN / PROCESS</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>TRACK</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>LOCATION</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>REPORTING MANAGER</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>CORE SKILL</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700 }}>AVAILABILITY</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-tertiary)', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map(res => {
                const avail = isResourceAvailable(res.id, '2026-09-06');
                return (
                  <tr
                    key={res.id}
                    onClick={() => onOpenResource(res.id)}
                    style={{
                      borderBottom: '1px solid var(--border-secondary)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover-row"
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: res.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{res.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.role}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {res.positionId} • {res.id}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'var(--edge-primary)',
                          background: 'rgba(255, 86, 34, 0.1)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          marginRight: '6px',
                        }}
                      >
                        {res.businessDomain}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{res.processGroup}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        {res.track}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: res.location === 'Onsite' ? 'rgba(13, 159, 110, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                          color: res.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)',
                        }}
                      >
                        {res.location}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {res.managerInfo ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenResource(res.managerInfo.id);
                          }}
                          style={{
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            textDecoration: 'underline',
                            textDecorationColor: 'var(--border-primary)',
                            cursor: 'pointer',
                          }}
                        >
                          {res.managerInfo.name}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-tertiary)' }}>SteerCom / CIO</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.skill}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{res.certification}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        className="badge"
                        style={{
                          background: avail.available ? 'rgba(13, 159, 110, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                          color: avail.available ? 'var(--color-green)' : 'var(--color-amber)',
                          fontSize: '10px',
                        }}
                      >
                        {avail.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenResource(res.id);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
