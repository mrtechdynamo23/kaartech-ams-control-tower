/**
 * EDGE AMS Control Tower — Global Calendar Event Detail Modal
 * Centered modal dialog displaying complete operational context and direct navigation to originating module.
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Calendar, Clock, User, MapPin, Layers, ExternalLink,
  Shield, AlertTriangle, CheckCircle2, Tag, ArrowRight
} from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

export default function CalendarEventDetailModal({
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

  const handleNavigateToSource = () => {
    if (event.sourceRoute) {
      onClose();
      navigate(event.sourceRoute);
    }
  };

  return (
    <div className="cal-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cal-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-modal-header" style={{ borderTop: `4px solid ${event.dotColor || '#64748B'}` }}>
          <div className="cal-modal-header-meta">
            <span className={`cal-modal-type-badge ${event.cssClass || ''}`}>
              {event.typeLabel}
            </span>
            <span className="cal-modal-id-badge">{event.id}</span>
            {event.priority && (
              <span className={`cal-modal-priority-pill ${event.priority.toLowerCase()}`}>
                {event.priority}
              </span>
            )}
            <span className="cal-modal-status-pill">{event.status}</span>
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

        {/* Title & Description */}
        <div className="cal-modal-body">
          <h2 className="cal-modal-title">{event.title}</h2>
          <p className="cal-modal-description">{event.description}</p>

          {/* Context Details Grid */}
          <div className="cal-modal-grid">
            {/* Date & Time */}
            <div className="cal-modal-field">
              <span className="cal-field-label"><Calendar size={13} /> Scheduled Period</span>
              <span className="cal-field-value">
                {event.startDate === event.endDate || !event.endDate
                  ? event.startDate
                  : `${event.startDate} to ${event.endDate}`}
              </span>
            </div>

            <div className="cal-modal-field">
              <span className="cal-field-label"><Clock size={13} /> Time Window</span>
              <span className="cal-field-value">{event.startTime || 'All Day / Operating Window'}</span>
            </div>

            {/* Owner & Resource */}
            <div className="cal-modal-field">
              <span className="cal-field-label"><User size={13} /> Owner / Assignee</span>
              <span className="cal-field-value">{event.owner || 'AMS Governance Team'}</span>
            </div>

            {event.backupResource && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Shield size={13} /> Backup Resource</span>
                <span className="cal-field-value">{event.backupResource}</span>
              </div>
            )}

            {/* Entity / Customer */}
            {event.customerOrEntity && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><MapPin size={13} /> Entity / Cluster</span>
                <span className="cal-field-value">{event.customerOrEntity}</span>
              </div>
            )}

            {/* Application */}
            {event.relatedApplication && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Layers size={13} /> Related Application</span>
                <span className="cal-field-value">{event.relatedApplication}</span>
              </div>
            )}

            {/* Business Domain */}
            {event.relatedBusinessDomain && (
              <div className="cal-modal-field">
                <span className="cal-field-label"><Tag size={13} /> Business Domain</span>
                <span className="cal-field-value">{event.relatedBusinessDomain}</span>
              </div>
            )}

            {/* Source Module */}
            <div className="cal-modal-field">
              <span className="cal-field-label"><Layers size={13} /> Originating Module</span>
              <span className="cal-field-value">{event.sourceModule}</span>
            </div>
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

          {event.sourceRoute && (
            <button
              type="button"
              className="cal-btn-primary"
              onClick={handleNavigateToSource}
            >
              <span>View in {event.sourceModule}</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
