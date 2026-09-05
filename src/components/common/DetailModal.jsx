/**
 * EDGE AMS Control Tower — Centered Record Detail Modal Component
 * Universal centered modal for inspecting Incidents, SRs, Enhancements, Problems, Risks, Audits, and CTAs.
 * Implements Section 23, 24, 25, 26, 27 of Master Build Specification:
 * - Centered viewport with dimmed backdrop
 * - 760–920px width, max-height: 85vh
 * - Smooth ease-out animation (opacity + scale 0.97 → 1)
 * - Full keyboard support (ESC close), backdrop click, body scroll locking
 * - Tabs: Overview, Lifecycle & Timelines, Relationships & Lineage, SLA & Performance, Work Notes, Audit Trail
 * - Problem Lifecycle visualization: Incident → Problem → RCA → Corrective Action → Prevention / KEDB
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  X, Clock, User, Shield, AlertTriangle, FileText, CheckCircle2,
  ExternalLink, MessageSquare, History, Layers, Send, ArrowRight,
  GitPullRequest, BookOpen, AlertOctagon, CheckSquare, Sparkles,
  Link as LinkIcon, ChevronRight, CheckCircle, ShieldCheck
} from 'lucide-react';
import { StatusBadge, PriorityBadge, SLABadge } from './Badges';
import { getStatusSemantic, getPriorityColor } from '../../utils/statusSemantics';

export default function DetailModal({ isOpen, onClose, item, type = 'incident' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [workNotes, setWorkNotes] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (item) {
      setActiveTab('overview');
      // Seed realistic work notes based on item type and resolver
      setWorkNotes([
        {
          id: 1,
          author: item.assignedTo || item.owner || item.leadDeveloper || 'Lead Resolver',
          role: 'Resolver / Owner',
          text: `Technical triage active on ${item.application || 'SAP Environment'}. Telemetry and logs verified against baseline.`,
          timestamp: item.createdDate ? new Date(item.createdDate).toLocaleDateString() : '2026-06-15',
        },
        {
          id: 2,
          author: 'AMS Governance Engine',
          role: 'System',
          text: `Milestone logged in ITSM audit trail. SLA monitored under contract policy.`,
          timestamp: item.createdDate ? new Date(item.createdDate).toLocaleDateString() : '2026-06-15',
        }
      ]);
    }
  }, [item]);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setWorkNotes([
      ...workNotes,
      {
        id: Date.now(),
        author: 'Current User (AMS Lead)',
        role: 'Governance Lead',
        text: newNote,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setNewNote('');
  };

  const isProblem = type === 'problem' || Boolean(item.rcaId) || Boolean(item.rootCause);
  const isEnhancement = type === 'enhancement' || (item.id && item.id.startsWith('ENH')) || Boolean(item.timeCountHrs && item.category);
  const isSR = type === 'sr' || (item.id && item.id.startsWith('SR')) || Boolean(item.srType);

  const titleText = item.shortDescription || item.title || item.action || item.name || item.description || 'Record Detail';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 17, 20, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        ref={modalRef}
        className="record-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '86vh',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 800,
                  color: 'var(--edge-primary)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 86, 34, 0.08)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 86, 34, 0.2)',
                }}
              >
                {item.id}
              </span>
              {item.priority && <PriorityBadge priority={item.priority} size="sm" />}
              {item.status && <StatusBadge status={item.status} size="sm" />}
              {item.slaStatus && <SLABadge slaStatus={item.slaStatus} size="sm" />}
              {item.category && (
                <span className="badge badge-neutral" style={{ fontSize: '11px', fontWeight: 600 }}>
                  {item.category} ({item.timeCountHrs || item.effortHours || 40}h)
                </span>
              )}
              {item.srType && (
                <span className="badge badge-neutral" style={{ fontSize: '11px', fontWeight: 600 }}>
                  {item.srType === 'Major' ? 'Major (≥16h)' : 'Standard (<16h)'}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '6px',
                borderRadius: '50%',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>

          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {titleText}
          </h2>

          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {item.entity && (
              <span>
                Entity: <strong style={{ color: 'var(--text-primary)' }}>{item.entity}</strong>
              </span>
            )}
            {item.businessDomain && (
              <span>
                Domain: <strong style={{ color: 'var(--text-primary)' }}>{item.businessDomain}</strong>
              </span>
            )}
            {item.processGroup && (
              <span>
                Process Group: <strong style={{ color: 'var(--text-primary)' }}>{item.processGroup}</strong>
              </span>
            )}
            {item.application && (
              <span>
                Application: <strong style={{ color: 'var(--text-primary)' }}>{item.application}</strong>
              </span>
            )}
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)',
            padding: '0 24px',
            background: 'var(--bg-card)',
            overflowX: 'auto',
          }}
        >
          {[
            { key: 'overview', label: 'Overview', icon: FileText },
            {
              key: 'relationships',
              label: isProblem ? 'Incident → Problem → RCA → CTA' : 'Relationships & Lineage',
              icon: LinkIcon,
            },
            { key: 'sla', label: 'SLA & Lifecycle', icon: Clock },
            { key: 'notes', label: 'Work Notes', icon: MessageSquare, count: workNotes.length },
            { key: 'history', label: 'Audit Trail', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--edge-primary)' : '2px solid transparent',
                  color: isActive ? 'var(--edge-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '10px',
                      background: 'var(--bg-secondary)',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── MODAL BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Key Attributes Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  background: 'var(--bg-secondary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Application</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.application || 'SAP S/4HANA Core'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Assigned Resolver / Lead</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.assignedTo || item.owner || item.leadDeveloper || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Resolver Tier & Group</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.resolverTier || 'Tier 2 (Core AMS)'} • {item.resolverGroup || 'SAP SD/MM Support'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Logged By / Origin</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {item.raisedBy || item.createdBy || 'ITSM Telemetry'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Logged Date</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : '2026-06-15'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Target Resolution / SLA</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {item.targetDate || item.dueDate || item.targetRelease || '2026-06-18'}
                  </div>
                </div>
              </div>

              {/* Technical Description */}
              <div>
                <h4
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                    letterSpacing: '0.04em',
                  }}
                >
                  Technical Scope & Symptoms
                </h4>
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                    background: 'var(--bg-primary)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  {item.fullDescription || item.description || item.shortDescription || 'Operational ticket registered in ManageEngine ITSM. Technical telemetry captured.'}
                </div>
              </div>

              {/* Problem Root Cause & Corrective Action (Section 17, 27) */}
              {item.rootCause && (
                <div
                  style={{
                    background: 'rgba(21, 154, 106, 0.05)',
                    border: '1px solid rgba(21, 154, 106, 0.25)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#159A6A', textTransform: 'uppercase' }}>
                      <CheckCircle2 size={14} />
                      <span>Root Cause Analysis (RCA: {item.rcaId || 'RCA-0012'})</span>
                    </div>
                    <span className="badge badge-success">RCA Delivered</span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                    {item.rootCause}
                  </p>
                  {item.correctiveAction && (
                    <div style={{ borderTop: '1px dashed rgba(21, 154, 106, 0.25)', paddingTop: '8px', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <strong>Corrective Action:</strong> {item.correctiveAction}
                    </div>
                  )}
                  {item.preventiveAction && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <strong>Preventive Action:</strong> {item.preventiveAction}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RELATIONSHIPS & LINEAGE (Section 27, 48) */}
          {activeTab === 'relationships' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Contractual governance traceability connecting incidents, defect investigations, root causes, corrective actions, and prevention assets.
              </div>

              {/* 4-Step Chain */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 1. Incident */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'var(--bg-secondary)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(255, 86, 34, 0.15)',
                      color: 'var(--edge-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Linked Operational Incidents
                      </span>
                      <span className="badge badge-neutral">Operational Trigger</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.incidentIds && Array.isArray(item.incidentIds)
                        ? item.incidentIds.join(', ')
                        : item.id.startsWith('INC')
                        ? item.id
                        : 'INC-00001, INC-00002'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={16} color="var(--text-tertiary)" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {/* 2. Problem Record */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'var(--bg-secondary)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(59, 130, 196, 0.15)',
                      color: '#3B82C4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Problem Investigation Record
                      </span>
                      <span className="badge badge-info">{isProblem ? item.id : (item.problemTicket || 'PRB-00001')}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Investigated under {item.assignedTo || 'Lead Problem Specialist Priya Nair'}.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={16} color="var(--text-tertiary)" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {/* 3. RCA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'var(--bg-secondary)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(21, 154, 106, 0.15)',
                      color: '#159A6A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Root Cause Analysis (RCA)
                      </span>
                      <span className={`badge ${item.rootCause ? 'badge-success' : 'badge-warning'}`}>
                        {item.rootCause ? (item.rcaStatus || 'Delivered') : 'In Progress'}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.rootCause || 'Root cause investigation underway by functional competency team.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ChevronRight size={16} color="var(--text-tertiary)" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {/* 4. Corrective Action & KEDB / CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'var(--bg-secondary)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(115, 87, 184, 0.15)',
                      color: '#7357B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    4
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Corrective Action & KEDB
                      </span>
                      <span className="badge badge-primary">{item.kedbArticle || 'KEDB-00123'}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {item.correctiveAction || 'Permanent system remedy deployed for zero recurrence.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLA & TIMELINES */}
          {activeTab === 'sla' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: item.slaStatus === 'Breached' ? 'rgba(217, 45, 32, 0.08)' : 'rgba(21, 154, 106, 0.08)',
                  border: `1px solid ${item.slaStatus === 'Breached' ? 'rgba(217, 45, 32, 0.3)' : 'rgba(21, 154, 106, 0.3)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Contractual SLA Compliance (Section 39)
                  </span>
                  <SLABadge slaStatus={item.slaStatus || 'On Track'} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Response Target: {item.priority === 'P1' ? '30 mins' : item.priority === 'P2' ? '2 hours' : '1 business day'} • Resolution Target: {item.priority === 'P1' ? '4 hours (95% target)' : item.priority === 'P2' ? '8 hours (90% target)' : '2 business days (90% target)'}.
                </p>
              </div>

              {/* Stop Clock State (Section 40) */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>SLA Stop-Clock State</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Pending Customer / Freeze Window / Force Majeure</div>
                </div>
                <span className="badge badge-neutral">Running</span>
              </div>
            </div>
          )}

          {/* TAB 4: WORK NOTES */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workNotes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {note.author} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({note.role})</span>
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{note.timestamp}</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Add an operational update or work note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="form-input"
                  style={{
                    flex: 1,
                    fontSize: 'var(--text-sm)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 14px' }}>
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: AUDIT TRAIL */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: 'Today 14:22', user: item.assignedTo || 'Khalid Al Hashimi', action: 'Status updated to In Progress' },
                { time: 'Today 14:15', user: 'System Dispatcher', action: `Assigned to ${item.resolverGroup || 'Core AMS Tier 2'}` },
                { time: 'Today 14:00', user: 'ManageEngine Integration', action: 'Ticket ingested with high SLA priority' },
              ].map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: 'var(--text-xs)',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', minWidth: '80px' }}>{h.time}</span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{h.user}</strong>: <span style={{ color: 'var(--text-secondary)' }}>{h.action}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
          <button className="btn btn-primary btn-sm">
            Update Record
          </button>
        </div>
      </div>
    </div>
  );
}
