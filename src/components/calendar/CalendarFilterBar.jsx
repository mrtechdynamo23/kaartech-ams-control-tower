/**
 * EDGE AMS Control Tower — Global Calendar Filter Bar
 * Compact, restrained multi-select category filtering across all 15 operational event types.
 * Matches event light and dark mode colors without dominating the calendar surface.
 */
import React from 'react';
import { CheckSquare, Square, SlidersHorizontal } from 'lucide-react';
import { EVENT_TYPES, EVENT_TYPE_CONFIG } from './calendarTypes';

export default function CalendarFilterBar({
  activeCategories,
  categoryCounts,
  onToggleCategory,
  onSelectAll,
  onClearAll,
}) {
  const allCategoryKeys = Object.values(EVENT_TYPES);

  return (
    <div className="cal-filter-bar">
      <div className="cal-filter-header">
        <div className="cal-filter-title">
          <SlidersHorizontal size={13} className="cal-filter-icon" />
          <span>Control Tower Categories</span>
          <span className="cal-filter-active-count">
            ({activeCategories.length} / {allCategoryKeys.length} Active)
          </span>
        </div>

        <div className="cal-filter-actions">
          <button
            type="button"
            className="cal-filter-btn"
            onClick={onSelectAll}
            title="Select all event types"
          >
            <CheckSquare size={12} />
            <span>Select All</span>
          </button>
          <button
            type="button"
            className="cal-filter-btn"
            onClick={onClearAll}
            title="Clear all filters"
          >
            <Square size={12} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <div className="cal-filter-pills">
        {allCategoryKeys.map(catKey => {
          const cfg = EVENT_TYPE_CONFIG[catKey];
          const isSelected = activeCategories.includes(catKey);
          const count = categoryCounts[catKey] || 0;

          return (
            <button
              key={catKey}
              type="button"
              className={`cal-filter-pill ${cfg.cssClass || ''} ${isSelected ? 'selected' : 'unselected'}`}
              onClick={() => onToggleCategory(catKey)}
              title={`Toggle ${cfg.label}`}
            >
              <span
                className="cal-pill-dot"
                style={{ backgroundColor: cfg.dotColor || '#64748B' }}
              />
              <span className="cal-pill-label">{cfg.label}</span>
              <span className="cal-pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
