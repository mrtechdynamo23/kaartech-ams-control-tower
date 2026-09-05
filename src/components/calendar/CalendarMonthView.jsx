/**
 * EDGE AMS Control Tower — Global Calendar Month View
 * Executive monthly grid, compact event pills, overflow handling, today badge.
 * Strict column containment, normalized short titles, separate light/dark theme tokens.
 */
import React from 'react';
import { Plus } from 'lucide-react';
import { EVENT_TYPES } from './calendarTypes';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarMonthView({
  currentDate,
  events,
  selectedDate,
  onSelectEvent,
  onOpenDayModal,
  isRTL = false,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day and total days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month for padding
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Today string for highlighting
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Build 35-42 grid cells
  const cells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    cells.push({
      dayNumber: prevDayNum,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      events: [],
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    // Find events matching this date or spanning across this date
    const dayEvents = events.filter(e => {
      if (e.startDate === dateStr) return true;
      if (e.endDate && e.startDate <= dateStr && e.endDate >= dateStr) return true;
      return false;
    });

    cells.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      events: dayEvents,
    });
  }

  // Next month leading days to complete grid
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthIdx = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      events: [],
    });
  }

  return (
    <div className="cal-month-view">
      {/* Weekday Header */}
      <div className="cal-month-weekdays">
        {WEEKDAYS.map((dayName, idx) => (
          <div key={dayName} className={`cal-month-weekday ${idx === 0 || idx === 6 ? 'weekend' : ''}`}>
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="cal-month-grid">
        {cells.map((cell, idx) => {
          const isSelected = selectedDate === cell.dateStr;
          const isWeekend = (idx % 7 === 0) || (idx % 7 === 6);
          const maxVisible = 3;
          const visibleEvents = cell.events.slice(0, maxVisible);
          const overflowCount = cell.events.length - maxVisible;

          return (
            <div
              key={`${cell.dateStr}-${idx}`}
              className={`cal-month-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isWeekend ? 'weekend-cell' : ''} ${cell.isToday ? 'today-cell' : ''} ${isSelected ? 'selected-cell' : ''}`}
            >
              {/* Day Cell Header */}
              <div
                className="cal-cell-header"
                onClick={() => cell.isCurrentMonth && onOpenDayModal(cell.dateStr, cell.events)}
                role="button"
                tabIndex={0}
                title={`Click to view all ${cell.events.length} events on ${cell.dateStr}`}
              >
                <div className="cal-cell-day-meta">
                  <span className={`cal-cell-day-num ${cell.isToday ? 'today-pill' : ''}`}>
                    {cell.dayNumber}
                  </span>
                  {cell.isToday && (
                    <span className="cal-cell-today-indicator" title="Current Day">Today</span>
                  )}
                </div>

                {cell.events.length > 0 && (
                  <span className="cal-cell-event-tally">
                    {cell.events.length}
                  </span>
                )}
              </div>

              {/* Event Stack */}
              <div className="cal-cell-events">
                {visibleEvents.map(ev => {
                  const isOverdueMOM = ev.type === EVENT_TYPES.MOM_ACTION && ev.isOverdue;
                  const isFreeze = ev.type === EVENT_TYPES.CRITICAL_BUSINESS_PERIOD;

                  return (
                    <div
                      key={ev.id}
                      className={`cal-event-pill ${ev.cssClass || ''} ${isOverdueMOM ? 'overdue' : ''} ${isFreeze ? 'freeze-pill' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      role="button"
                      tabIndex={0}
                      title={`${ev.typeLabel}: ${ev.title} (${ev.startTime || 'All Day'})`}
                    >
                      <span
                        className="cal-pill-indicator"
                        style={{ backgroundColor: ev.dotColor || '#64748B' }}
                      />
                      <span className="cal-pill-title">
                        {ev.shortTitle || ev.title}
                      </span>
                      {isOverdueMOM && (
                        <span className="cal-pill-overdue-flag" title="Action Overdue">
                          !
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Overflow button */}
                {overflowCount > 0 && (
                  <button
                    type="button"
                    className="cal-cell-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDayModal(cell.dateStr, cell.events);
                    }}
                  >
                    <Plus size={11} />
                    <span>+{overflowCount} more</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
