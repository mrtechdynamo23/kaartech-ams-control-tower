/**
 * EDGE AMS Control Tower — Resource & Capability → Time Management
 * Route: /resources/time
 * 
 * Operational Workspace for Leave Management, Approvals, Availability,
 * Remote Work, and Timesheets.
 */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon, Table as TableIcon, Plus, CheckCircle2,
  Clock, AlertTriangle, Users, Shield, Filter, Search, ArrowUpDown,
  ExternalLink, ChevronLeft, ChevronRight, FileText, Briefcase, RefreshCw, X
} from 'lucide-react';
import { RESOURCES } from '../../data/demoData';
import {
  getLeaveRecords,
  getLeaveKPIs,
  subscribeTimeManagement,
  isResourceAvailable
} from '../../data/timeManagementStore';
import {
  ApplyLeaveModal,
  ApprovalsModal,
  LeaveDetailModal,
  RemoteWorkModal,
  TimesheetEntryModal
} from '../../components/resources/TimeManagementModals';

export default function TimeEffortPage() {
  // Store subscription state
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    return subscribeTimeManagement(() => {
      setStoreVersion(v => v + 1);
    });
  }, []);

  // View mode: 'table' | 'calendar'
  const [viewMode, setViewMode] = useState('table');

  // Modal open states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApprovalsModalOpen, setIsApprovalsModalOpen] = useState(false);
  const [isRemoteWorkModalOpen, setIsRemoteWorkModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [selectedDetailLeave, setSelectedDetailLeave] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  // Table sorting
  const [sortField, setSortField] = useState('startDate');
  const [sortDir, setSortDir] = useState('asc');

  // Calendar active month (default September 2026)
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 8, 1)); // Sep 2026

  // Toast / feedback notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Raw Data & Dynamic KPIs ──
  const allLeaves = useMemo(() => {
    return getLeaveRecords();
  }, [storeVersion]);

  const kpis = useMemo(() => {
    return getLeaveKPIs();
  }, [storeVersion]);

  const pendingLeaves = useMemo(() => {
    return allLeaves.filter(r => r.status === 'Pending Approval');
  }, [allLeaves]);

  // ── Table Filtering & Search ──
  const filteredLeaves = useMemo(() => {
    return allLeaves.filter(item => {
      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      // Type
      if (typeFilter !== 'all' && item.leaveType !== typeFilter) return false;
      // Domain
      if (domainFilter !== 'all' && item.businessDomain !== domainFilter) return false;
      // Location
      if (locationFilter !== 'all' && item.location !== locationFilter) return false;
      // Resource
      if (resourceFilter !== 'all' && item.resourceId !== resourceFilter) return false;

      // Full search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = (item.id || '').toLowerCase().includes(q);
        const matchRes = (item.resourceName || '').toLowerCase().includes(q);
        const matchDomain = (item.businessDomain || '').toLowerCase().includes(q);
        const matchProcess = (item.processGroup || '').toLowerCase().includes(q);
        const matchType = (item.leaveType || '').toLowerCase().includes(q);
        const matchBackup = (item.backupResourceName || '').toLowerCase().includes(q);
        const matchApprover = (item.approver || '').toLowerCase().includes(q);
        const matchReason = (item.reason || '').toLowerCase().includes(q);
        if (!matchId && !matchRes && !matchDomain && !matchProcess && !matchType && !matchBackup && !matchApprover && !matchReason) {
          return false;
        }
      }

      return true;
    });
  }, [allLeaves, statusFilter, typeFilter, domainFilter, locationFilter, resourceFilter, searchQuery]);

  // ── Table Sorting ──
  const sortedLeaves = useMemo(() => {
    return [...filteredLeaves].sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (sortField === 'days') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }

      const cmp = String(valA).localeCompare(String(valB));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredLeaves, sortField, sortDir]);

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || domainFilter !== 'all' || locationFilter !== 'all' || resourceFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDomainFilter('all');
    setLocationFilter('all');
    setResourceFilter('all');
  };

  // ── Calendar Grid Calculations ──
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Leading blank slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: null, currentMonth: false });
    }

    // Days of this month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      // Find leaves overlapping this date (Approved and Pending)
      const dayLeaves = allLeaves.filter(l => {
        if (l.status !== 'Approved' && l.status !== 'Pending Approval') return false;
        return dateStr >= l.startDate && dateStr <= l.endDate;
      });
      days.push({
        dayNumber: d,
        dateStr,
        currentMonth: true,
        leaves: dayLeaves,
      });
    }

    return days;
  }, [calendarDate, allLeaves]);

  return (
    <div className="time-management-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: 'var(--bg-card)',
          border: '1px solid var(--color-emerald)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={16} color="var(--color-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Time Management</h1>
            <span className="badge badge-neutral" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
              Operational View
            </span>
            <span className="badge badge-primary" style={{ fontSize: '11px' }}>
              AMS Resource Operations
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Manage leave, availability, remote work, approvals and time records across the AMS resource pool.
          </p>
        </div>
      </div>

      {/* 2. RESTRAINED KPI STRIP (7 source-defined dynamic metrics) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
        background: 'var(--bg-secondary)',
        padding: '10px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-secondary)',
      }}>
        {/* KPI 1: Requests Applied */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Requests Applied
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {kpis.requestsApplied}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Total</span>
          </div>
        </div>

        {/* KPI 2: Approved */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          borderTop: '2px solid var(--color-emerald)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Approved
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-emerald)', lineHeight: 1.1 }}>
              {kpis.approved}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Active</span>
          </div>
        </div>

        {/* KPI 3: Pending Approval */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          borderTop: kpis.pendingApproval > 0 ? '2px solid var(--color-amber)' : '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pending Approval
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: kpis.pendingApproval > 0 ? 'var(--color-amber)' : 'var(--text-primary)', lineHeight: 1.1 }}>
              {kpis.pendingApproval}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Queue</span>
          </div>
        </div>

        {/* KPI 4: Rejected / Cancelled */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Rejected / Cancelled
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-secondary)', lineHeight: 1.1 }}>
              {kpis.rejectedCancelled}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Archived</span>
          </div>
        </div>

        {/* KPI 5: Total No Days */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total No Days
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {kpis.totalDays}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Working Days</span>
          </div>
        </div>

        {/* KPI 6: No. Persons */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            No. Persons
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {kpis.noPersons}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Consultants</span>
          </div>
        </div>

        {/* KPI 7: Backup # */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Backup #
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {kpis.backupCount}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Assigned</span>
          </div>
        </div>
      </div>

      {/* 3. ACTION BAR & VIEW SWITCHER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Actions (Only Apply Leave is strongly emphasized in EDGE orange) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsApplyModalOpen(true)}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              background: 'var(--edge-primary)',
              borderColor: 'var(--edge-primary)',
              color: '#FFFFFF',
              boxShadow: '0 2px 4px rgba(255, 86, 34, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} />
            Apply Leave
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsRemoteWorkModalOpen(true)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={15} />
            Remote Work
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsApprovalsModalOpen(true)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} />
            Approvals
            {kpis.pendingApproval > 0 && (
              <span style={{
                background: 'var(--color-amber)',
                color: '#1a1a1a',
                padding: '2px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: 1
              }}>
                {kpis.pendingApproval}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsTimesheetModalOpen(true)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={15} />
            Timesheet Entry
          </button>
        </div>

        {/* View Switcher: Table | Calendar */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-secondary)',
        }}>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: viewMode === 'table' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: viewMode === 'table' ? '1px solid var(--border-primary)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <TableIcon size={14} />
            Table View
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 600,
              background: viewMode === 'calendar' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'calendar' ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: viewMode === 'calendar' ? '1px solid var(--border-primary)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <CalendarIcon size={14} />
            Calendar View
          </button>
        </div>
      </div>

      {/* 4. FILTERS BAR */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          minWidth: '200px',
        }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search request ID, specialist, backup, domain, approver..."
            style={{
              width: '100%',
              height: '34px',
              padding: '0 10px 0 32px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '12px',
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            height: '34px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '0 10px',
            fontSize: '12px',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Leave Type Filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{
            height: '34px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '0 10px',
            fontSize: '12px',
          }}
        >
          <option value="all">All Leave Types</option>
          <option value="Annual Leave">Annual Leave</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Emergency Leave">Emergency Leave</option>
          <option value="Training Leave">Training Leave</option>
          <option value="Exam / Certification">Exam / Certification</option>
        </select>

        {/* Domain Filter */}
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          style={{
            height: '34px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '0 10px',
            fontSize: '12px',
          }}
        >
          <option value="all">All Domains</option>
          <option value="L2C">L2C (Lead-to-Cash)</option>
          <option value="E2M">E2M (Engineer-to-Manufacture)</option>
          <option value="P2P">P2P (Plan-to-Produce)</option>
          <option value="D2S">D2S (Demand-to-Supply)</option>
          <option value="S2P">S2P (Source-to-Pay)</option>
          <option value="A2D">A2D (Acquire-to-Dispose)</option>
          <option value="R2R">R2R (Record-to-Report)</option>
          <option value="H2R">H2R (Hire-to-Retire)</option>
        </select>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          style={{
            height: '34px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '0 10px',
            fontSize: '12px',
          }}
        >
          <option value="all">All Locations</option>
          <option value="Onsite">Onsite (Abu Dhabi)</option>
          <option value="Offshore">Offshore</option>
        </select>

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            style={{
              height: '34px',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: '1px dashed var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            <X size={13} />
            Reset
          </button>
        )}
      </div>

      {/* 5. MAIN CONTENT AREA */}
      {viewMode === 'table' ? (
        /* TABLE VIEW (Operational Register) */
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-secondary)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Request ID
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Specialist Resource
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Domain
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Process Group
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Leave Type
                  </th>
                  <th
                    style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSortToggle('startDate')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Start Date
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSortToggle('endDate')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      End Date
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    style={{ textAlign: 'center', padding: '12px 8px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSortToggle('days')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      Days
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Approver
                  </th>
                  <th
                    style={{ textAlign: 'center', padding: '12px 10px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSortToggle('status')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      Status
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Backup Resource
                  </th>
                  <th
                    style={{ textAlign: 'left', padding: '12px 12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleSortToggle('submittedDate')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Submitted
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
                      No leave requests found matching your filters.
                    </td>
                  </tr>
                ) : (
                  sortedLeaves.map(r => {
                    const statusClass = r.status === 'Approved'
                      ? 'badge-success'
                      : r.status === 'Pending Approval'
                      ? 'badge-warning'
                      : r.status === 'Rejected'
                      ? 'badge-danger'
                      : 'badge-neutral';

                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedDetailLeave(r)}
                        style={{
                          borderBottom: '1px solid var(--border-primary)',
                          cursor: 'pointer',
                          transition: 'background 0.12s ease',
                        }}
                        className="edge-table-row"
                      >
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {r.id}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.resourceName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{r.role} • {r.location}</div>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span className="badge badge-neutral" style={{ fontWeight: 600, fontSize: '11px' }}>
                            {r.businessDomain}
                          </span>
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                          {r.processGroup || 'AMS Operations'}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-primary)' }}>
                          {r.leaveType}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {r.startDate}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                          {r.endDate}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {r.days}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                          {r.approver}
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                          <span className={`badge ${statusClass}`} style={{ fontSize: '11px' }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Shield size={13} color="var(--edge-primary)" />
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.backupResourceName}</span>
                          </div>
                          {r.backupConflict && (
                            <div style={{ fontSize: '10px', color: 'var(--color-amber)', marginTop: '2px', fontWeight: 600 }}>
                              Conflict Detected
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 12px', color: 'var(--text-tertiary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {r.submittedDate}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setSelectedDetailLeave(r)}
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CALENDAR VIEW */
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          {/* Calendar Month Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                Operational Roster
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                style={{ padding: '6px 10px' }}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCalendarDate(new Date(2026, 8, 1))}
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                Sep 2026
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                style={{ padding: '6px 10px' }}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Day Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
          }}>
            {calendarDays.map((cell, idx) => {
              if (!cell.currentMonth) {
                return (
                  <div
                    key={idx}
                    style={{
                      minHeight: '100px',
                      background: 'var(--bg-secondary)',
                      opacity: 0.3,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-secondary)',
                    }}
                  />
                );
              }

              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '100px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cell.dayNumber}
                    </span>
                    {cell.leaves?.length > 0 && (
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                        {cell.leaves.length} {cell.leaves.length === 1 ? 'leave' : 'leaves'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                    {cell.leaves?.map(l => {
                      const isApproved = l.status === 'Approved';
                      return (
                        <div
                          key={l.id}
                          onClick={() => setSelectedDetailLeave(l)}
                          style={{
                            background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            border: isApproved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: 600,
                            color: isApproved ? 'var(--color-emerald)' : 'var(--color-amber)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={`${l.resourceName} (${l.leaveType}) • Backup: ${l.backupResourceName}`}
                        >
                          {l.resourceName}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. MODALS */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={(newRec) => {
          showToast(`Leave request ${newRec.id} submitted for approval.`);
        }}
      />

      <ApprovalsModal
        isOpen={isApprovalsModalOpen}
        onClose={() => setIsApprovalsModalOpen(false)}
        pendingLeaves={pendingLeaves}
        onActionSuccess={() => {
          showToast('Approvals updated successfully.');
        }}
      />

      <LeaveDetailModal
        isOpen={Boolean(selectedDetailLeave)}
        leave={selectedDetailLeave}
        onClose={() => setSelectedDetailLeave(null)}
        onActionSuccess={() => {
          showToast('Leave status updated.');
        }}
      />

      <RemoteWorkModal
        isOpen={isRemoteWorkModalOpen}
        onClose={() => setIsRemoteWorkModalOpen(false)}
        onSuccess={(rec) => {
          showToast(`Remote work record ${rec.id} logged for ${rec.resourceName}.`);
        }}
      />

      <TimesheetEntryModal
        isOpen={isTimesheetModalOpen}
        onClose={() => setIsTimesheetModalOpen(false)}
        defaultResourceId={allLeaves[0]?.resourceId || 'RES-005'}
      />
    </div>
  );
}
