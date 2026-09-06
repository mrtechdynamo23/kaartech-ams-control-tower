/**
 * EDGE AMS Control Tower — Team Detail Modal
 * 
 * Deep drilldown for capability/process groups implementing Section 24 of specifications:
 * - Team Overview (name, manager, domain, process group)
 * - Resource count, Onsite/Offshore breakdown, Track allocation
 * - Clean Member Roster table with status, skills, track, contact
 * - Interactive click on any specialist to open ResourceDetailModal
 */
import React, { useEffect } from 'react';
import {
  X, Users, MapPin, Shield, Layers, ChevronRight,
  User, CheckCircle2, Award, Briefcase
} from 'lucide-react';

export default function TeamDetailModal({
  isOpen,
  team,
  onClose,
  onSelectResource,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !team) return null;

  const members = team.members ? team.members.map(m => m.data || m) : [];

  return (
    <div
      className="modal-overlay-centered animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Team Details: ${team.name}`}
        className="modal-dialog-centered team-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '88vh',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '22px 24px',
            background: 'linear-gradient(135deg, rgba(255, 86, 34, 0.1) 0%, rgba(20, 24, 30, 0.98) 100%)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--edge-primary)',
                    background: 'rgba(255, 86, 34, 0.1)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {team.domainKey} — {team.domainName}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                  Capability Team
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {team.name}
                </h2>
                {team.memberChangeCount > 0 && (
                  <span
                    className="member-change-badge"
                    title={`${team.memberChangeCount} member change${team.memberChangeCount > 1 ? 's' : ''} for this posting`}
                    aria-label={`${team.memberChangeCount} member changes`}
                  >
                    [{team.memberChangeCount}]
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Operational process capability unit within the {team.domainName} business domain.
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* KPI Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginTop: '16px',
            }}
          >
            <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Total Staffing</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{team.resourceCount} FTE</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Onsite (Abu Dhabi)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-green)', marginTop: '2px' }}>{team.onsiteCount}</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Offshore Centers</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-blue)', marginTop: '2px' }}>{team.offshoreCount}</div>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Lead / Manager</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {team.lead ? team.lead.name : 'Domain Lead'}
              </div>
            </div>
          </div>
        </div>

        {/* Member Roster Table */}
        <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assigned Specialists ({members.length})
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Click any specialist row to open complete profile
            </span>
          </div>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700 }}>SPECIALIST</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700 }}>ROLE</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700 }}>LOCATION</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700 }}>TRACK</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700 }}>CORE SKILL</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr
                    key={member.id}
                    onClick={() => {
                      if (onSelectResource) onSelectResource(member.id);
                    }}
                    style={{
                      borderBottom: '1px solid var(--border-secondary)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover-row"
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--edge-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{member.role}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: member.location === 'Onsite' ? 'rgba(13, 159, 110, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                          color: member.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)',
                        }}
                      >
                        {member.location}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{member.track}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{member.skill}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectResource) onSelectResource(member.id);
                        }}
                      >
                        View <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
