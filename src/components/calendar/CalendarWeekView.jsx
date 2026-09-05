/**
 * EDGE AMS Control Tower — Global Calendar Week View
 * 7-Day Operational Grid, Time Axis, All-Day Event Banner, Scheduling Visibility.
 * Clean titles, separate light/dark theme tokens, and non-overlapping event layout.
 */
import React from 'react';
import { Clock } from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function CalendarWeekView({
  currentDate,
  events,
  onSelectEvent,
  onOpenDayModal,
}) {
  // Calculate 7 days of current week (Sun to Sat)
  const dayOfWeek = currentDate.getDay();
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - dayOfWeek);

  const days = [];
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const dayEvents = events.filter(e => {
      if (e.startDate === dateStr) return true;
      if (e.endDate && e.startDate <= dateStr && e.endDate >= dateStr) return true;
      return false;
    });

    const allDayEvents = dayEvents.filter(e => e.allDay || !e.startTime || e.startTime === 'All Day');
    const timedEvents = dayEvents.filter(e => !e.allDay && e.startTime && e.startTime !== 'All Day');

    days.push({
      date: d,
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
      allDayEvents,
      timedEvents,
    });
  }

  // Parse start hour from event time string (e.g. "14:00 – 16:00 GST" -> 14)
  const getEventHour = (timeStr) => {
    if (!timeStr) return 9;
    const match = timeStr.match(/(\d{1,2}):/);
    return match ? parseInt(match[1], 10) : 9;
  };

  return (
    <div className="cal-week-view">
      {/* Week Header Row */}
      <div className="cal-week-header">
        <div className="cal-week-time-gutter-header">
          <Clock size={14} />
          <span>GST</span>
        </div>

        {days.map(d => (
          <div
            key={d.dateStr}
            className={`cal-week-day-header ${d.isToday ? 'today-header' : ''}`}
            onClick={() => onOpenDayModal(d.dateStr, [...d.allDayEvents, ...d.timedEvents])}
            role="button"
            tabIndex={0}
          >
            <span className="cal-week-day-name">{d.dayName}</span>
            <span className={`cal-week-day-number ${d.isToday ? 'today-pill' : ''}`}>
              {d.dayNumber}
            </span>
          </div>
        ))}
      </div>

      {/* All-Day Events Strip */}
      <div className="cal-week-allday-row">
        <div className="cal-week-time-gutter-allday">
          <span>All Day</span>
        </div>

        {days.map(d => (
          <div key={`allday-${d.dateStr}`} className="cal-week-allday-col">
            {d.allDayEvents.map(ev => {
              const isOverdue = ev.type === EVENT_TYPES.MOM_ACTION && ev.isOverdue;
              return (
                <div
                  key={ev.id}
                  className={`cal-allday-badge ${ev.cssClass || ''} ${isOverdue ? 'overdue' : ''}`}
                  onClick={() => onSelectEvent(ev)}
                  role="button"
                  tabIndex={0}
                  title={`${ev.typeLabel}: ${ev.title}`}
                >
                  <span className="cal-badge-dot" style={{ backgroundColor: ev.dotColor || '#64748B' }} />
                  <span className="cal-badge-text">{ev.title}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hourly Grid */}
      <div className="cal-week-body">
        {/* Time axis */}
        <div className="cal-week-time-axis">
          {HOURS.map(hr => (
            <div key={hr} className="cal-week-time-slot-label">
              <span>{hr}</span>
            </div>
          ))}
        </div>

        {/* 7 Columns */}
        <div className="cal-week-columns-grid">
          {days.map(d => (
            <div key={`col-${d.dateStr}`} className={`cal-week-col ${d.isToday ? 'today-col' : ''}`}>
              {/* Hour dividers */}
              {HOURS.map(hr => (
                <div key={`${d.dateStr}-${hr}`} className="cal-week-hour-slot" />
              ))}

              {/* Timed events container */}
              <div className="cal-week-col-events">
                {d.timedEvents.map(ev => {
                  const hr = getEventHour(ev.startTime);
                  const topOffset = Math.max(0, (hr - 8) * 56 + 4);
                  const isOverdue = ev.type === EVENT_TYPES.MOM_ACTION && ev.isOverdue;

                  return (
                    <div
                      key={ev.id}
                      className={`cal-week-event-card ${ev.cssClass || ''} ${isOverdue ? 'overdue' : ''}`}
                      style={{
                        top: `${topOffset}px`,
                        borderLeftColor: ev.dotColor || '#64748B',
                      }}
                      onClick={() => onSelectEvent(ev)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="cal-week-event-time">
                        {ev.startTime}
                      </div>
                      <div className="cal-week-event-title">
                        {ev.title}
                      </div>
                      <div className="cal-week-event-meta">
                        <span className="cal-week-event-owner">{ev.owner}</span>
                        {ev.customerOrEntity && (
                          <span className="cal-week-event-entity">• {ev.customerOrEntity}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
