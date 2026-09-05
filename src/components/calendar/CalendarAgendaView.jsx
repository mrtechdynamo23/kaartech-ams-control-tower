/**
 * EDGE AMS Control Tower — Global Calendar Agenda View
 * Chronological operational agenda list grouped by date, with first-class MOM and Action highlights.
 * Clean titles, no redundant prefixes, separate light and dark mode theme tokens.
 */
import React from 'react';
import {
  Calendar, User, MapPin, Layers, FileText, ListChecks, ArrowUpRight
} from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

export default function CalendarAgendaView({
  currentDate,
  events,
  onSelectEvent,
}) {
  // Filter events from current month onwards or upcoming
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthStartStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const nextMonthEnd = new Date(year, month + 2, 0);
  const monthEndStr = `${nextMonthEnd.getFullYear()}-${String(nextMonthEnd.getMonth() + 1).padStart(2, '0')}-${String(nextMonthEnd.getDate()).padStart(2, '0')}`;

  const agendaEvents = events.filter(e => {
    return (e.startDate >= monthStartStr && e.startDate <= monthEndStr) ||
           (e.endDate && e.endDate >= monthStartStr && e.startDate <= monthEndStr);
  });

  // Group by date
  const groupedByDate = {};
  agendaEvents.forEach(ev => {
    const dStr = ev.startDate;
    if (!groupedByDate[dStr]) {
      groupedByDate[dStr] = [];
    }
    groupedByDate[dStr].push(ev);
  });

  const sortedDateKeys = Object.keys(groupedByDate).sort();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (sortedDateKeys.length === 0) {
    return (
      <div className="cal-agenda-empty">
        <Calendar size={48} className="cal-agenda-empty-icon" />
        <h3>No Events Scheduled</h3>
        <p>There are no operational events matching the selected filters for this time window.</p>
      </div>
    );
  }

  return (
    <div className="cal-agenda-view">
      {sortedDateKeys.map(dateKey => {
        const dateEvents = groupedByDate[dateKey];
        const dateObj = new Date(dateKey + 'T00:00:00');
        const isToday = dateKey === todayStr;

        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return (
          <div key={dateKey} className={`cal-agenda-date-group ${isToday ? 'is-today' : ''}`}>
            {/* Date Group Header */}
            <div className="cal-agenda-date-header">
              <div className="cal-agenda-date-badge">
                <span className="cal-agenda-date-day">{dateObj.getDate()}</span>
                <span className="cal-agenda-date-sub">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
              <div className="cal-agenda-date-labels">
                <div className="cal-agenda-date-title-row">
                  <h3 className="cal-agenda-date-title">{formattedDate}</h3>
                  {isToday && <span className="cal-agenda-today-pill">TODAY</span>}
                </div>
                <span className="cal-agenda-weekday">{weekday} • {dateEvents.length} events</span>
              </div>
            </div>

            {/* List of Events on this Date */}
            <div className="cal-agenda-events-list">
              {dateEvents.map(ev => {
                const isMOM = ev.type === EVENT_TYPES.MOM;
                const isMOMAction = ev.type === EVENT_TYPES.MOM_ACTION;
                const isOverdue = isMOMAction && ev.isOverdue;

                return (
                  <div
                    key={ev.id}
                    className={`cal-agenda-row ${ev.cssClass || ''} ${isOverdue ? 'overdue-row' : ''}`}
                    style={{
                      borderLeftColor: ev.dotColor || '#64748B',
                    }}
                    onClick={() => onSelectEvent(ev)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Time & Type Pill */}
                    <div className="cal-agenda-time-col">
                      <span className="cal-agenda-time-text">
                        {ev.startTime || 'All Day'}
                      </span>
                      <span className={`cal-agenda-type-pill ${ev.cssClass || ''}`}>
                        {isMOM && <FileText size={11} style={{ marginRight: '3px' }} />}
                        {isMOMAction && <ListChecks size={11} style={{ marginRight: '3px' }} />}
                        {ev.typeLabel}
                      </span>
                    </div>

                    {/* Content Col */}
                    <div className="cal-agenda-info-col">
                      <div className="cal-agenda-info-top">
                        <span className="cal-agenda-id-code">{ev.id}</span>
                        {ev.priority && (
                          <span className={`cal-agenda-priority-tag ${ev.priority.toLowerCase()}`}>
                            {ev.priority}
                          </span>
                        )}
                        <span className="cal-agenda-status-badge">{ev.status}</span>
                      </div>

                      <h4 className="cal-agenda-title">
                        {ev.title}
                      </h4>

                      <p className="cal-agenda-desc">{ev.description}</p>

                      <div className="cal-agenda-meta-row">
                        <span className="cal-agenda-meta-tag">
                          <User size={12} /> {ev.owner}
                        </span>
                        {ev.customerOrEntity && (
                          <span className="cal-agenda-meta-tag">
                            <MapPin size={12} /> {ev.customerOrEntity}
                          </span>
                        )}
                        {ev.relatedApplication && (
                          <span className="cal-agenda-meta-tag">
                            <Layers size={12} /> {ev.relatedApplication}
                          </span>
                        )}
                        {ev.sourceModule && (
                          <span className="cal-agenda-source-tag">
                            From: {ev.sourceModule}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="cal-agenda-action-col">
                      <button
                        type="button"
                        className="cal-agenda-view-btn"
                        title="View Full Context"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                      >
                        <span>View</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
