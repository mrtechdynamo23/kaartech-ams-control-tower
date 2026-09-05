/**
 * EDGE AMS Control Tower — Unified Global Calendar (Section 22 & 46)
 * Route: /calendar
 * 
 * Aggregates:
 * Leave, Audit, Audit Tasks, Program Milestones, Changes, Releases,
 * Meetings, Minutes of Meeting (MOM), MOM Actions, Transition Gates,
 * Training Clinics, Knowledge Reviews, SLA Reviews, Customer Connect,
 * and Critical Business Freezes.
 * 
 * Views: Month, Week, Day, Agenda.
 * Single source of truth with first-class MOM inspection and CTA tracking.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon, Shield, Layers, Clock, AlertTriangle,
  FileText, CheckCircle2, ListChecks, GitPullRequest, Package,
  AlertOctagon, UserCheck, Flame
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

import { EVENT_TYPES, VIEW_MODES } from '../../components/calendar/calendarTypes';
import {
  normalizeCalendarEvents,
  getFilteredCalendarEvents,
} from '../../components/calendar/calendarEventAdapters';

import CalendarToolbar from '../../components/calendar/CalendarToolbar';
import CalendarFilterBar from '../../components/calendar/CalendarFilterBar';
import CalendarMonthView from '../../components/calendar/CalendarMonthView';
import CalendarWeekView from '../../components/calendar/CalendarWeekView';
import CalendarDayView from '../../components/calendar/CalendarDayView';
import CalendarAgendaView from '../../components/calendar/CalendarAgendaView';
import CalendarEventDetailModal from '../../components/calendar/CalendarEventDetailModal';
import CalendarMOMDetailModal from '../../components/calendar/CalendarMOMDetailModal';
import CalendarDayModal from '../../components/calendar/CalendarDayModal';

import './GlobalCalendarPage.css';

export default function GlobalCalendarPage() {
  const { language, isRTL } = useLanguage();

  // Anchor in September 2026 (Operational active quarter)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 15));
  const [viewMode, setViewMode] = useState(VIEW_MODES.MONTH);
  const [searchQuery, setSearchQuery] = useState('');

  // All 15 categories active by default
  const [activeCategories, setActiveCategories] = useState(Object.values(EVENT_TYPES));

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dayModalState, setDayModalState] = useState({ isOpen: false, dateStr: null, events: [] });

  // 1. Single Source of Truth aggregation
  const allEvents = useMemo(() => {
    return normalizeCalendarEvents();
  }, []);

  // 2. Category counts for filter bar
  const categoryCounts = useMemo(() => {
    const counts = {};
    Object.values(EVENT_TYPES).forEach(k => {
      counts[k] = 0;
    });
    allEvents.forEach(e => {
      if (counts[e.type] !== undefined) {
        counts[e.type]++;
      }
    });
    return counts;
  }, [allEvents]);

  // 3. Filtered events based on multi-select categories and search query
  const filteredEvents = useMemo(() => {
    return getFilteredCalendarEvents(allEvents, activeCategories, searchQuery);
  }, [allEvents, activeCategories, searchQuery]);

  // 4. Executive KPI metrics
  const kpiMetrics = useMemo(() => {
    const momEvents = allEvents.filter(e => e.type === EVENT_TYPES.MOM);
    const momActions = allEvents.filter(e => e.type === EVENT_TYPES.MOM_ACTION);
    const overdueMomActions = momActions.filter(e => e.isOverdue);
    const changesAndReleases = allEvents.filter(e => e.type === EVENT_TYPES.CHANGE || e.type === EVENT_TYPES.RELEASE);
    const criticalFreezes = allEvents.filter(e => e.type === EVENT_TYPES.CRITICAL_BUSINESS_PERIOD);

    return {
      totalEvents: allEvents.length,
      momTotal: momEvents.length,
      openActions: momActions.filter(a => a.status === 'Open').length,
      overdueActions: overdueMomActions.length,
      changeAndReleaseTotal: changesAndReleases.length,
      freezeTotal: criticalFreezes.length,
    };
  }, [allEvents]);

  // Navigation handlers
  const handleNavigatePrev = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === VIEW_MODES.MONTH) {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === VIEW_MODES.WEEK) {
        d.setDate(d.getDate() - 7);
      } else if (viewMode === VIEW_MODES.DAY) {
        d.setDate(d.getDate() - 1);
      } else {
        d.setMonth(d.getMonth() - 1);
      }
      return d;
    });
  }, [viewMode]);

  const handleNavigateNext = useCallback(() => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === VIEW_MODES.MONTH) {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === VIEW_MODES.WEEK) {
        d.setDate(d.getDate() + 7);
      } else if (viewMode === VIEW_MODES.DAY) {
        d.setDate(d.getDate() + 1);
      } else {
        d.setMonth(d.getMonth() + 1);
      }
      return d;
    });
  }, [viewMode]);

  const handleNavigateToday = useCallback(() => {
    // Navigate to today's date in 2026 simulation horizon
    setCurrentDate(new Date(2026, 8, 15));
  }, []);

  const handleSelectMonth = useCallback((year, month) => {
    setCurrentDate(new Date(year, month, 1));
  }, []);

  // Filter actions
  const handleToggleCategory = useCallback((catKey) => {
    setActiveCategories(prev => {
      if (prev.includes(catKey)) {
        // Deselect
        return prev.filter(k => k !== catKey);
      } else {
        // Select
        return [...prev, catKey];
      }
    });
  }, []);

  const handleSelectAllCategories = useCallback(() => {
    setActiveCategories(Object.values(EVENT_TYPES));
  }, []);

  const handleClearAllCategories = useCallback(() => {
    setActiveCategories([]);
  }, []);

  // Modal openers
  const handleSelectEvent = useCallback((ev) => {
    setSelectedEvent(ev);
  }, []);

  const handleOpenDayModal = useCallback((dateStr, dayEvents) => {
    setDayModalState({
      isOpen: true,
      dateStr,
      events: dayEvents,
    });
  }, []);

  const handleCloseDayModal = useCallback(() => {
    setDayModalState({ isOpen: false, dateStr: null, events: [] });
  }, []);

  const handleCloseEventModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const isMOMEvent = selectedEvent && (
    selectedEvent.type === EVENT_TYPES.MOM ||
    selectedEvent.type === EVENT_TYPES.MOM_ACTION
  );

  return (
    <div className="global-calendar-page animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div className="cal-page-header">
        <div className="cal-title-lockup">
          <div className="cal-title-icon-badge">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="cal-page-title">
              {language === 'ar' ? 'التقويم التشغيلي العام والتحكم' : 'Global Control Tower Calendar'}
            </h1>
            <p className="cal-page-subtitle">
              {language === 'ar'
                ? 'لوحة تحكم تشغيلية موحدة تجمع بين التدقيق، محاضر الاجتماعات (MOM)، الإجازات، الإصدارات، والتجميدات الحرجة'
                : 'Unified operational timeline aggregating Audits, MOMs, Action Items, Approved Leave, CAB Changes, and Freezes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Top Executive KPI Strip */}
      <div className="cal-kpi-strip">
        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Total Active Events</span>
            <span className="cal-kpi-value">{kpiMetrics.totalEvents}</span>
            <span className="cal-kpi-sub">Across 15 categories</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563EB' }}>
            <Layers size={18} />
          </div>
        </div>

        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">MOM & Action Hub</span>
            <span className="cal-kpi-value">{kpiMetrics.momTotal} MOMs</span>
            <span className="cal-kpi-sub">{kpiMetrics.openActions} Open Action Items</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' }}>
            <FileText size={18} />
          </div>
        </div>

        <div className={`cal-kpi-card ${kpiMetrics.overdueActions > 0 ? 'alert-critical' : ''}`}>
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Overdue MOM Actions</span>
            <span className="cal-kpi-value" style={{ color: kpiMetrics.overdueActions > 0 ? '#DC2626' : '#10B981' }}>
              {kpiMetrics.overdueActions} Critical
            </span>
            <span className="cal-kpi-sub">Requires immediate SteerCom CTA</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(220, 38, 38, 0.15)', color: '#DC2626' }}>
            <AlertOctagon size={18} />
          </div>
        </div>

        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">CAB Releases & Changes</span>
            <span className="cal-kpi-value">{kpiMetrics.changeAndReleaseTotal}</span>
            <span className="cal-kpi-sub">Approved production windows</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#7C3AED' }}>
            <Package size={18} />
          </div>
        </div>

        <div className="cal-kpi-card">
          <div className="cal-kpi-info">
            <span className="cal-kpi-title">Change Freezes</span>
            <span className="cal-kpi-value">{kpiMetrics.freezeTotal} Windows</span>
            <span className="cal-kpi-sub">Mandatory fiscal & holiday</span>
          </div>
          <div className="cal-kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#D97706' }}>
            <Shield size={18} />
          </div>
        </div>
      </div>

      {/* Calendar Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        searchQuery={searchQuery}
        totalEventsCount={filteredEvents.length}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onNavigateToday={handleNavigateToday}
        onSelectMonth={handleSelectMonth}
        onChangeViewMode={setViewMode}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        isRTL={isRTL}
      />

      {/* 15-Category Filter Bar */}
      <CalendarFilterBar
        activeCategories={activeCategories}
        categoryCounts={categoryCounts}
        onToggleCategory={handleToggleCategory}
        onSelectAll={handleSelectAllCategories}
        onClearAll={handleClearAllCategories}
      />

      {/* Main View Container */}
      <div className="cal-view-viewport">
        {viewMode === VIEW_MODES.MONTH && (
          <CalendarMonthView
            currentDate={currentDate}
            events={filteredEvents}
            selectedDate={null}
            onSelectEvent={handleSelectEvent}
            onOpenDayModal={handleOpenDayModal}
            isRTL={isRTL}
          />
        )}

        {viewMode === VIEW_MODES.WEEK && (
          <CalendarWeekView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onOpenDayModal={handleOpenDayModal}
          />
        )}

        {viewMode === VIEW_MODES.DAY && (
          <CalendarDayView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {viewMode === VIEW_MODES.AGENDA && (
          <CalendarAgendaView
            currentDate={currentDate}
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
          />
        )}
      </div>

      {/* Day Events Modal (when clicking on a day or "+X more") */}
      {dayModalState.isOpen && (
        <CalendarDayModal
          dateStr={dayModalState.dateStr}
          events={dayModalState.events}
          onClose={handleCloseDayModal}
          onSelectEvent={handleSelectEvent}
        />
      )}

      {/* Event Detail Modal (MOM Dedicated or General) */}
      {selectedEvent && (
        isMOMEvent ? (
          <CalendarMOMDetailModal
            event={selectedEvent}
            onClose={handleCloseEventModal}
          />
        ) : (
          <CalendarEventDetailModal
            event={selectedEvent}
            onClose={handleCloseEventModal}
          />
        )
      )}
    </div>
  );
}
