/**
 * EDGE AMS Control Tower — Global Calendar Toolbar
 * Navigation, Quick Jump, View Mode Switcher, and Real-time Search.
 */
import React from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Search, X, RotateCcw, LayoutGrid, CalendarRange,
  Clock, ListFilter
} from 'lucide-react';
import { VIEW_MODES } from './calendarTypes';

const QUICK_MONTHS = [
  { label: 'Jun 2026', year: 2026, month: 5 },
  { label: 'Jul 2026', year: 2026, month: 6 },
  { label: 'Aug 2026', year: 2026, month: 7 },
  { label: 'Sep 2026', year: 2026, month: 8 },
  { label: 'Oct 2026', year: 2026, month: 9 },
  { label: 'Nov 2026', year: 2026, month: 10 },
  { label: 'Dec 2026', year: 2026, month: 11 },
];

export default function CalendarToolbar({
  currentDate,
  viewMode,
  searchQuery,
  totalEventsCount,
  onNavigatePrev,
  onNavigateNext,
  onNavigateToday,
  onSelectMonth,
  onChangeViewMode,
  onSearchChange,
  onClearSearch,
  isRTL = false,
}) {
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  // Compute view title
  const getHeaderTitle = () => {
    if (viewMode === VIEW_MODES.MONTH) {
      return currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    if (viewMode === VIEW_MODES.WEEK) {
      // Calculate start and end of week
      const dayOfWeek = currentDate.getDay();
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - dayOfWeek);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (viewMode === VIEW_MODES.DAY) {
      return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    }
    if (viewMode === VIEW_MODES.AGENDA) {
      return `Operational Agenda: ${currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    return currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="cal-toolbar-wrapper">
      {/* Top row: Navigation, Title & Views */}
      <div className="cal-toolbar-main">
        {/* Left: Today & Prev/Next & Title */}
        <div className="cal-nav-group">
          <button
            type="button"
            className="cal-btn-today"
            onClick={onNavigateToday}
            title="Jump to current date"
          >
            Today
          </button>

          <div className="cal-nav-arrows">
            <button
              type="button"
              className="cal-arrow-btn"
              onClick={onNavigatePrev}
              aria-label="Previous period"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              type="button"
              className="cal-arrow-btn"
              onClick={onNavigateNext}
              aria-label="Next period"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <div className="cal-current-period">
            <CalendarIcon size={18} className="cal-period-icon" />
            <h2 className="cal-period-title">{getHeaderTitle()}</h2>
          </div>
        </div>

        {/* Right: View Mode Switcher & Search */}
        <div className="cal-controls-group">
          {/* Search box */}
          <div className="cal-search-box">
            <Search size={15} className="cal-search-icon" />
            <input
              type="text"
              className="cal-search-input"
              placeholder="Search ID, title, owner, app, entity..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="cal-search-clear"
                onClick={onClearSearch}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* 4 View Tabs */}
          <div className="cal-view-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === VIEW_MODES.MONTH}
              className={`cal-view-tab ${viewMode === VIEW_MODES.MONTH ? 'active' : ''}`}
              onClick={() => onChangeViewMode(VIEW_MODES.MONTH)}
            >
              <LayoutGrid size={15} />
              <span>Month</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === VIEW_MODES.WEEK}
              className={`cal-view-tab ${viewMode === VIEW_MODES.WEEK ? 'active' : ''}`}
              onClick={() => onChangeViewMode(VIEW_MODES.WEEK)}
            >
              <CalendarRange size={15} />
              <span>Week</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === VIEW_MODES.DAY}
              className={`cal-view-tab ${viewMode === VIEW_MODES.DAY ? 'active' : ''}`}
              onClick={() => onChangeViewMode(VIEW_MODES.DAY)}
            >
              <Clock size={15} />
              <span>Day</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={viewMode === VIEW_MODES.AGENDA}
              className={`cal-view-tab ${viewMode === VIEW_MODES.AGENDA ? 'active' : ''}`}
              onClick={() => onChangeViewMode(VIEW_MODES.AGENDA)}
            >
              <ListFilter size={15} />
              <span>Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Quick Month Jumper Chips */}
      <div className="cal-quick-months">
        <span className="cal-quick-label">Operational Horizon:</span>
        <div className="cal-month-chips">
          {QUICK_MONTHS.map(qm => {
            const isSelected = currentYear === qm.year && currentMonthIndex === qm.month;
            return (
              <button
                key={qm.label}
                type="button"
                className={`cal-month-chip ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectMonth(qm.year, qm.month)}
              >
                {qm.label}
              </button>
            );
          })}
        </div>
        <div className="cal-match-count">
          Showing <strong>{totalEventsCount}</strong> active events
        </div>
      </div>
    </div>
  );
}
