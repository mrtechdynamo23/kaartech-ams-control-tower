/**
 * EDGE AMS Control Tower — Global Calendar MOM Detail Modal
 * FIRST-CLASS CITIZEN: Displays complete Minutes of Meeting record, key decisions,
 * action items table with owner, target date, priority, status, overdue callouts, and CTA navigation.
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, FileText, Calendar, Clock, User, Users, MapPin,
  CheckCircle2, AlertCircle, AlertTriangle, ArrowRight,
  ExternalLink, Layers, CheckSquare, ListChecks, ShieldAlert
} from 'lucide-react';

export default function CalendarMOMDetailModal({
  event,
  onClose,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const mom = event.momData || {};
  const actionItems = mom.actionItems || [];
  const keyDecisions = mom.keyDecisions || [];

  const openActions = actionItems.filter(a => a.status === 'Open');
  const overdueActions = actionItems.filter(a => a.isOverdue || (a.status === 'Open' && new Date(a.targetDate) < new Date()));

  const handleNavigateToActionHub = (ctaId) => {
    onClose();
    navigate('/governance/actions');
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cal-modal-card cal-mom-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-modal-header cal-mom-header">
          <div className="cal-modal-header-meta">
            <span className="cal-mom-type-badge">
              <FileText size={14} />
              MINUTES OF MEETING (MOM)
            </span>
            <span className="cal-modal-id-badge">{mom.id || event.id}</span>
            <span className="cal-mom-status-pill">{mom.momStatus || event.status}</span>
          </div>

          <button
            type="button"
            className="cal-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="cal-modal-body">
          <h2 className="cal-modal-title">{mom.meetingTitle || event.title}</h2>

          {/* Quick Metrics Bar */}
          <div className="cal-mom-metrics-strip">
            <div className="cal-mom-metric-item">
              <span className="cal-mom-metric-num">{actionItems.length}</span>
              <span className="cal-mom-metric-lbl">Total Actions</span>
            </div>
            <div className="cal-mom-metric-item">
              <span className="cal-mom-metric-num" style={{ color: '#F59E0B' }}>
                {openActions.length}
              </span>
              <span className="cal-mom-metric-lbl">Open Actions</span>
            </div>
            <div className="cal-mom-metric-item">
              <span className="cal-mom-metric-num" style={{ color: overdueActions.length > 0 ? '#DC2626' : '#10B981' }}>
                {overdueActions.length}
              </span>
              <span className="cal-mom-metric-lbl">Overdue Actions</span>
            </div>
            <div className="cal-mom-metric-item">
              <span className="cal-mom-metric-num" style={{ color: '#6366F1' }}>
                {keyDecisions.length}
              </span>
              <span className="cal-mom-metric-lbl">Key Decisions</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="cal-modal-grid">
            <div className="cal-modal-field">
              <span className="cal-field-label"><Calendar size={13} /> Meeting Date</span>
              <span className="cal-field-value">{mom.meetingDate || event.startDate}</span>
            </div>

            <div className="cal-modal-field">
              <span className="cal-field-label"><Clock size={13} /> Time Window</span>
              <span className="cal-field-value">{mom.meetingTime || event.startTime || '10:00 – 11:30 GST'}</span>
            </div>

            <div className="cal-modal-field">
              <span className="cal-field-label"><User size={13} /> Meeting Chair / Owner</span>
              <span className="cal-field-value">{mom.owner || event.owner}</span>
            </div>

            <div className="cal-modal-field">
              <span className="cal-field-label"><MapPin size={13} /> Entity / Cluster</span>
              <span className="cal-field-value">{mom.customerOrEntity || event.customerOrEntity || 'EDGE Group HQ'}</span>
            </div>

            {mom.processGroup && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Layers size={13} /> Process Group</span>
                <span className="cal-field-value">{mom.processGroup}</span>
              </div>
            )}

            {mom.application && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Layers size={13} /> Related Application</span>
                <span className="cal-field-value">{mom.application}</span>
              </div>
            )}

            {mom.momIssuedDate && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><CheckCircle2 size={13} /> MOM Issued Date</span>
                <span className="cal-field-value">{mom.momIssuedDate}</span>
              </div>
            )}

            {mom.momDueDate && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Clock size={13} /> Target Due Date</span>
                <span className="cal-field-value">{mom.momDueDate}</span>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="cal-mom-section">
            <h4 className="cal-mom-section-title">
              <FileText size={15} />
              Executive Discussion Summary
            </h4>
            <p className="cal-mom-summary-box">{mom.summary || event.description}</p>
          </div>

          {/* Key Decisions */}
          {keyDecisions.length > 0 && (
            <div className="cal-mom-section">
              <h4 className="cal-mom-section-title">
                <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                Agreed Decisions ({keyDecisions.length})
              </h4>
              <ul className="cal-mom-decisions-list">
                {keyDecisions.map((dec, idx) => (
                  <li key={idx} className="cal-mom-decision-item">
                    <CheckSquare size={14} className="cal-mom-decision-icon" />
                    <span>{dec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items Table */}
          <div className="cal-mom-section">
            <div className="cal-mom-section-header">
              <h4 className="cal-mom-section-title">
                <ListChecks size={15} style={{ color: '#6366F1' }} />
                MOM Action Items & CTA Linkages ({actionItems.length})
              </h4>
              {overdueActions.length > 0 && (
                <span className="cal-mom-overdue-alert">
                  <ShieldAlert size={14} />
                  {overdueActions.length} Action{overdueActions.length > 1 ? 's' : ''} Overdue
                </span>
              )}
            </div>

            {actionItems.length === 0 ? (
              <p className="cal-empty-text">No open MOM actions recorded for this meeting.</p>
            ) : (
              <div className="cal-mom-table-wrapper">
                <table className="cal-mom-table">
                  <thead>
                    <tr>
                      <th>Action ID</th>
                      <th>Action Description</th>
                      <th>Owner</th>
                      <th>Target Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>CTA Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actionItems.map(act => {
                      const isActOverdue = act.isOverdue || (act.status === 'Open' && new Date(act.targetDate) < new Date());
                      return (
                        <tr key={act.actionId} className={isActOverdue ? 'row-overdue' : ''}>
                          <td>
                            <span className="cal-act-id">{act.actionId}</span>
                          </td>
                          <td>
                            <span className="cal-act-desc">{act.actionDescription}</span>
                          </td>
                          <td>
                            <span className="cal-act-owner">{act.owner}</span>
                          </td>
                          <td>
                            <span className={`cal-act-date ${isActOverdue ? 'date-overdue' : ''}`}>
                              {act.targetDate}
                              {isActOverdue && <span className="cal-overdue-badge">Overdue</span>}
                            </span>
                          </td>
                          <td>
                            <span className={`cal-act-priority ${act.priority.toLowerCase()}`}>
                              {act.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`cal-act-status ${act.status.toLowerCase()}`}>
                              {act.status}
                            </span>
                          </td>
                          <td>
                            {act.ctaId ? (
                              <button
                                type="button"
                                className="cal-cta-link-btn"
                                onClick={() => handleNavigateToActionHub(act.ctaId)}
                                title={`Open ${act.ctaId} in Action Hub`}
                              >
                                <span>{act.ctaId}</span>
                                <ArrowRight size={12} />
                              </button>
                            ) : (
                              <span className="cal-text-muted">Standard Task</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="cal-modal-footer">
          <button
            type="button"
            className="cal-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="cal-btn-primary"
            onClick={() => handleNavigateToActionHub()}
          >
            <span>Open in CTA / Action Hub</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
