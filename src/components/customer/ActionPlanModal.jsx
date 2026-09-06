/**
 * EDGE AMS Control Tower — Centered Action Plan Modal
 * Sections 11–15: Escalated Issues / VIP Watchlist Action Plan
 * Shows escalation context, remediation action items, traceability, and interactive completion.
 */
import React, { useState, useEffect } from 'react';
import {
  X, AlertOctagon, CheckCircle2, Clock, User, Calendar,
  ArrowRight, ShieldAlert, CheckSquare, Layers, Link as LinkIcon
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badges';

export default function ActionPlanModal({
  isOpen,
  onClose,
  escalation,
  onNavigateToRecord,
}) {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (escalation) {
      setActions(escalation.actionPlan || []);
    }
  }, [escalation]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !escalation) return null;

  const handleToggleActionComplete = (actionId) => {
    setActions((prev) =>
      prev.map((act) => {
        if (act.id === actionId) {
          const newStatus = act.status === 'Completed' ? 'In Progress' : 'Completed';
          return { ...act, status: newStatus };
        }
        return act;
      })
    );
  };

  const hasActionPlan = actions && actions.length > 0;

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
        backgroundColor: 'rgba(15, 17, 20, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="record-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '85vh',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalScaleIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 86, 34, 0.12)',
                color: 'var(--edge-primary, #FF5622)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Action Plan
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--edge-primary, #FF5622)',
                    background: 'rgba(255, 86, 34, 0.08)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 86, 34, 0.2)',
                  }}
                >
                  {escalation.id}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Targeted remediation plan and cross-functional coordination actions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-tertiary)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Escalation Summary Card */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge badge-neutral">{escalation.entity || 'EDGE Group'}</span>
                  <PriorityBadge priority={escalation.severity || escalation.priority || 'High'} size="sm" />
                  <StatusBadge status={escalation.status || 'In Triage'} size="sm" />
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {escalation.title}
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Escalation Owner</div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {escalation.owner || 'AMS Service Manager'}
                </div>
                {escalation.daysOpen !== undefined && (
                  <span style={{ fontSize: '11px', color: escalation.daysOpen > 2 ? '#EF4444' : 'var(--text-tertiary)' }}>
                    Open for {escalation.daysOpen} {escalation.daysOpen === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>
            </div>

            {/* Traceability Section (Section 13) */}
            {(escalation.relatedTicket || escalation.relatedFinding || escalation.relatedTask || escalation.relatedCTA) && (
              <div
                style={{
                  borderTop: '1px solid var(--border-secondary)',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Traceability:
                </span>
                {escalation.relatedTicket && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRecord && onNavigateToRecord('ticket', escalation.relatedTicket)}
                    className="badge badge-neutral"
                    style={{ cursor: onNavigateToRecord ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LinkIcon size={10} />
                    <span>Ticket: <strong>{escalation.relatedTicket}</strong></span>
                  </button>
                )}
                {escalation.relatedFinding && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRecord && onNavigateToRecord('finding', escalation.relatedFinding)}
                    className="badge badge-neutral"
                    style={{ cursor: onNavigateToRecord ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LinkIcon size={10} />
                    <span>Finding: <strong style={{ color: 'var(--edge-primary, #FF5622)' }}>{escalation.relatedFinding}</strong></span>
                  </button>
                )}
                {escalation.relatedTask && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRecord && onNavigateToRecord('task', escalation.relatedTask)}
                    className="badge badge-neutral"
                    style={{ cursor: onNavigateToRecord ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LinkIcon size={10} />
                    <span>Task: <strong>{escalation.relatedTask}</strong></span>
                  </button>
                )}
                {escalation.relatedCTA && (
                  <button
                    type="button"
                    onClick={() => onNavigateToRecord && onNavigateToRecord('cta', escalation.relatedCTA)}
                    className="badge badge-neutral"
                    style={{ cursor: onNavigateToRecord ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LinkIcon size={10} />
                    <span>CTA: <strong>{escalation.relatedCTA}</strong></span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ACTION PLAN Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Action Plan Items {hasActionPlan ? `(${actions.length})` : ''}
              </h4>
              {hasActionPlan && (
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  {actions.filter((a) => a.status === 'Completed').length} of {actions.length} completed
                </span>
              )}
            </div>

            {hasActionPlan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {actions.map((act) => {
                  const isComplete = act.status === 'Completed';
                  return (
                    <div
                      key={act.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: isComplete ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-primary)',
                        padding: '14px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-tertiary)' }}>
                              {act.id}
                            </span>
                            <StatusBadge status={act.status || 'In Progress'} size="sm" />
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 600,
                              color: isComplete ? 'var(--text-secondary)' : 'var(--text-primary)',
                              textDecoration: isComplete ? 'line-through' : 'none',
                              lineHeight: 1.4,
                            }}
                          >
                            {act.action}
                          </div>
                        </div>

                        {/* Interactive Completion Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleActionComplete(act.id)}
                          className={`btn ${isComplete ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                          style={{
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <CheckCircle2 size={13} />
                          <span>{isComplete ? 'Reopen Action' : 'Mark Complete'}</span>
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid var(--border-secondary)',
                          paddingTop: '8px',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={12} />
                          <span>Owner: <strong style={{ color: 'var(--text-primary)' }}>{act.owner || 'AMS Team'}</strong></span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} />
                          <span>Target Date: <strong style={{ color: 'var(--text-primary)' }}>{act.targetDate || '2026-09-15'}</strong></span>
                        </div>

                        {(act.relatedTask || act.relatedTicket || act.relatedFinding) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <LinkIcon size={11} />
                            <span>
                              Ref: {act.relatedTask || act.relatedTicket || act.relatedFinding}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Section 15: Exact empty state handling without placeholders or empty table */
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '36px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-tertiary)',
                    marginBottom: '4px',
                  }}
                >
                  <Clock size={20} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  No action plan has been defined for this escalation.
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', maxWidth: '420px' }}>
                  The escalation is actively monitored in triage. A structured remediation action plan has not yet been logged by the incident commander.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
