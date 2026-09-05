/**
 * EDGE AMS Control Tower — Global Calendar Day View
 * Focused single-day operational timeline with hourly scheduling and rich event cards.
 * Uses semantic CSS classes with separate light and dark mode theme tokens.
 */
import React from 'react';
import { Clock, MapPin, User, Shield, Layers, ArrowUpRight } from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function CalendarDayView({
  currentDate,
  events,
  onSelectEvent,
}) {
  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const dayEvents = events.filter(e => {
    if (e.startDate === dateStr) return true;
    if (e.endDate && e.startDate <= dateStr && e.endDate >= dateStr) return true;
    return false;
  });

  const allDayEvents = dayEvents.filter(e => e.allDay || !e.startTime || e.startTime === 'All Day');
  const timedEvents = dayEvents.filter(e => !e.allDay && e.startTime && e.startTime !== 'All Day');

  const getEventHour = (timeStr) => {
    if (!timeStr) return 9;
    const match = timeStr.match(/(\d{1,2}):/);
    return match ? parseInt(match[1], 10) : 9;
  };

  return (
    <div className="cal-day-view">
      {/* Day Overview Header */}
      <div className="cal-day-header-banner">
        <div className="cal-day-date-badge">
          <span className="cal-day-num">{currentDate.getDate()}</span>
          <div className="cal-day-words">
            <span className="cal-day-weekday">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</span>
            <span className="cal-day-my">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="cal-day-stats">
          <div className="cal-day-stat-chip">
            <span className="cal-stat-num">{dayEvents.length}</span>
            <span className="cal-stat-lbl">Total Events</span>
          </div>
          <div className="cal-day-stat-chip">
            <span className="cal-stat-num">{allDayEvents.length}</span>
            <span className="cal-stat-lbl">All-Day / Freezes</span>
          </div>
          <div className="cal-day-stat-chip">
            <span className="cal-stat-num">{timedEvents.length}</span>
            <span className="cal-stat-lbl">Scheduled Windows</span>
          </div>
        </div>
      </div>

      {/* All-Day Events Strip */}
      {allDayEvents.length > 0 && (
        <div className="cal-day-allday-section">
          <div className="cal-day-section-title">
            <Shield size={14} />
            <span>All-Day Milestones, Leaves & Continuous Windows ({allDayEvents.length})</span>
          </div>
          <div className="cal-day-allday-cards">
            {allDayEvents.map(ev => {
              const isOverdue = ev.type === EVENT_TYPES.MOM_ACTION && ev.isOverdue;
              return (
                <div
                  key={ev.id}
                  className={`cal-day-allday-card ${ev.cssClass || ''} ${isOverdue ? 'overdue' : ''}`}
                  style={{ borderLeftColor: ev.dotColor || '#64748B' }}
                  onClick={() => onSelectEvent(ev)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cal-card-top">
                    <span className="cal-card-type-tag">
                      {ev.typeLabel}
                    </span>
                    <span className="cal-card-status-badge">{ev.status}</span>
                  </div>
                  <h4 className="cal-card-title">{ev.title}</h4>
                  <p className="cal-card-desc">{ev.description}</p>
                  <div className="cal-card-footer">
                    <span className="cal-card-owner"><User size={13} /> {ev.owner}</span>
                    {ev.sourceModule && <span className="cal-card-module"><Layers size={13} /> {ev.sourceModule}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hourly Timeline */}
      <div className="cal-day-timeline-section">
        <div className="cal-day-section-title">
          <Clock size={14} />
          <span>Operational Time Schedule</span>
        </div>

        <div className="cal-day-hourly-list">
          {HOURS.map(hourStr => {
            const hrInt = parseInt(hourStr.split(':')[0], 10);
            const eventsAtThisHour = timedEvents.filter(e => getEventHour(e.startTime) === hrInt);

            return (
              <div key={hourStr} className="cal-day-hour-row">
                <div className="cal-day-time-col">
                  <span className="cal-hour-label">{hourStr}</span>
                </div>

                <div className="cal-day-slot-col">
                  {eventsAtThisHour.length === 0 ? (
                    <div className="cal-empty-hour-slot" />
                  ) : (
                    <div className="cal-hour-events-group">
                      {eventsAtThisHour.map(ev => {
                        const isOverdue = ev.type === EVENT_TYPES.MOM_ACTION && ev.isOverdue;

                        return (
                          <div
                            key={ev.id}
                            className={`cal-day-detailed-card ${ev.cssClass || ''} ${isOverdue ? 'overdue' : ''}`}
                            style={{ borderLeftColor: ev.dotColor || '#64748B' }}
                            onClick={() => onSelectEvent(ev)}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="cal-card-head">
                              <div className="cal-card-left-tags">
                                <span className="cal-tag-type">
                                  {ev.typeLabel}
                                </span>
                                <span className="cal-tag-time"><Clock size={12} /> {ev.startTime}</span>
                                {ev.priority && <span className="cal-tag-priority">{ev.priority}</span>}
                              </div>
                              <span className="cal-card-status-pill">{ev.status}</span>
                            </div>

                            <h3 className="cal-day-event-title">
                              {ev.title}
                            </h3>

                            <p className="cal-day-event-summary">{ev.description}</p>

                            <div className="cal-day-event-metadata">
                              <span className="cal-meta-item"><User size={13} /> {ev.owner}</span>
                              {ev.customerOrEntity && (
                                <span className="cal-meta-item"><MapPin size={13} /> {ev.customerOrEntity}</span>
                              )}
                              {ev.relatedApplication && (
                                <span className="cal-meta-item"><Layers size={13} /> {ev.relatedApplication}</span>
                              )}
                              <span className="cal-meta-link">
                                Open Details <ArrowUpRight size={13} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
