/**
 * EDGE AMS Control Tower — Global Calendar Day Events Modal
 * Opens when a user clicks a day in Month view or clicks "+X more" to review all scheduled operational events.
 */
import React, { useEffect } from 'react';
import { X, Calendar, Clock, ArrowRight, User, Layers, FileText, ListChecks } from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

export default function CalendarDayModal({
  dateStr,
  events,
  onClose,
  onSelectEvent,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!dateStr || !events) return null;

  const dateObj = new Date(dateStr + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="cal-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cal-modal-card cal-day-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cal-modal-header">
          <div className="cal-modal-header-meta">
            <Calendar size={16} className="cal-text-brand" />
            <h3 className="cal-day-modal-title">{formattedDate}</h3>
            <span className="cal-modal-count-pill">{events.length} Events</span>
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

        {/* Events List */}
        <div className="cal-modal-body cal-day-modal-body">
          {events.length === 0 ? (
            <div className="cal-agenda-empty">
              <Calendar size={40} className="cal-agenda-empty-icon" />
              <h4>No Events Scheduled</h4>
              <p>No operational tasks or milestones are scheduled for this day.</p>
            </div>
          ) : (
            <div className="cal-day-modal-list">
              {events.map(ev => {
                const isMOM = ev.type === EVENT_TYPES.MOM;
                const isMOMAction = ev.type === EVENT_TYPES.MOM_ACTION;
                const isOverdue = isMOMAction && ev.isOverdue;

                return (
                  <div
                    key={ev.id}
                    className={`cal-day-modal-item ${ev.cssClass || ''} ${isOverdue ? 'item-overdue' : ''}`}
                    style={{
                      borderLeftColor: ev.dotColor || '#64748B',
                    }}
                    onClick={() => {
                      onClose();
                      onSelectEvent(ev);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cal-item-top">
                      <span className="cal-item-type-tag">
                        {isMOM && <FileText size={12} style={{ marginRight: '4px' }} />}
                        {isMOMAction && <ListChecks size={12} style={{ marginRight: '4px' }} />}
                        {ev.typeLabel}
                      </span>
                      <span className="cal-item-time">
                        <Clock size={12} /> {ev.startTime || 'All Day'}
                      </span>
                      <span className="cal-item-status-pill">{ev.status}</span>
                    </div>

                    <h4 className="cal-item-title">{ev.title}</h4>
                    <p className="cal-item-desc">{ev.description}</p>

                    <div className="cal-item-meta">
                      <span className="cal-meta-snippet"><User size={12} /> {ev.owner}</span>
                      {ev.customerOrEntity && (
                        <span className="cal-meta-snippet">• {ev.customerOrEntity}</span>
                      )}
                      <span className="cal-item-view-action">
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cal-modal-footer">
          <button
            type="button"
            className="cal-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
