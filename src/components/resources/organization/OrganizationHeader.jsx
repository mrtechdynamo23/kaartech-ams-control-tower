/**
 * EDGE AMS Control Tower — Organization Header & Command Toolbar
 * 
 * Implements Section 12 & 48 of specifications:
 * - Title & context subtitle
 * - View mode switcher (Structure, Team Overview, Resource Roster)
 * - Multi-attribute search input with highlight feedback
 * - Filter dropdowns for Domain, Location, Track
 * - Global Expand All / Collapse All actions
 * - Recent Changes log trigger
 */
import React from 'react';
import {
  Search, Filter, GitFork, Users, Layers, X,
  Maximize2, Minimize2, RotateCcw, History, ChevronDown
} from 'lucide-react';
import { BUSINESS_DOMAINS, TRACKS } from '../../../data/masterData';

export default function OrganizationHeader({
  activeView,
  onViewChange,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onResetFilters,
  onExpandAll,
  onCollapseAll,
  onFitToScreen,
  onOpenRecentChanges,
  matchCount,
  isFilterActive,
}) {
  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="organization-header" style={{ marginBottom: '16px' }}>
      {/* Top Title & View Mode Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              Organization Structure
            </h1>
            <span
              className="badge badge-primary"
              style={{
                background: 'rgba(255, 86, 34, 0.12)',
                color: 'var(--edge-primary)',
                border: '1px solid rgba(255, 86, 34, 0.3)',
                fontWeight: 700,
                fontSize: '11px',
              }}
            >
              AMS Operations
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            AMS delivery organization, reporting relationships, and multi-tier resource coverage across EDGE.
          </p>
        </div>

        {/* View Mode Switcher + Changes Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            className="view-toggle-group"
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              padding: '3px',
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <button
              onClick={() => onViewChange('structure')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeView === 'structure' ? 700 : 500,
                background: activeView === 'structure' ? 'var(--bg-card)' : 'transparent',
                color: activeView === 'structure' ? 'var(--edge-primary)' : 'var(--text-secondary)',
                border: activeView === 'structure' ? '1px solid var(--border-primary)' : '1px solid transparent',
                boxShadow: activeView === 'structure' ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Interactive Organization Hierarchy Tree"
            >
              <GitFork size={13} />
              <span>Structure View</span>
            </button>

            <button
              onClick={() => onViewChange('teams')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeView === 'teams' ? 700 : 500,
                background: activeView === 'teams' ? 'var(--bg-card)' : 'transparent',
                color: activeView === 'teams' ? 'var(--edge-primary)' : 'var(--text-secondary)',
                border: activeView === 'teams' ? '1px solid var(--border-primary)' : '1px solid transparent',
                boxShadow: activeView === 'teams' ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Team Overview & Leadership Matrices"
            >
              <Layers size={13} />
              <span>Team Overview</span>
            </button>

            <button
              onClick={() => onViewChange('roster')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeView === 'roster' ? 700 : 500,
                background: activeView === 'roster' ? 'var(--bg-card)' : 'transparent',
                color: activeView === 'roster' ? 'var(--edge-primary)' : 'var(--text-secondary)',
                border: activeView === 'roster' ? '1px solid var(--border-primary)' : '1px solid transparent',
                boxShadow: activeView === 'roster' ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Master Personnel Resource Roster"
            >
              <Users size={13} />
              <span>Resource Roster</span>
            </button>
          </div>

          {/* Recent Changes Log Trigger */}
          <button
            onClick={onOpenRecentChanges}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)' }}
            title="View Recent Organization Changes & Movements"
          >
            <History size={14} style={{ color: 'var(--edge-primary)' }} />
            <span>Org Changes</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Tree Controls */}
      <div
        className="organization-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {/* Left: Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '0 10px',
              height: '36px',
              position: 'relative',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-tertiary)', marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search resources, leads, teams, domains, tracks..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search match badge */}
          {searchTerm && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--edge-primary)',
                background: 'rgba(255, 86, 34, 0.1)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap',
              }}
            >
              {matchCount} match{matchCount === 1 ? '' : 'es'}
            </span>
          )}
        </div>

        {/* Center: Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Domain Filter */}
          <select
            value={filters.domain || 'all'}
            onChange={(e) => handleFilterChange('domain', e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
              height: '36px',
            }}
          >
            <option value="all">All Domains (8)</option>
            {BUSINESS_DOMAINS.map(d => (
              <option key={d.key} value={d.key}>{d.key} — {d.label}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filters.location || 'all'}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
              height: '36px',
            }}
          >
            <option value="all">All Locations</option>
            <option value="Onsite">Onsite (Abu Dhabi)</option>
            <option value="Offshore">Offshore Centers</option>
          </select>

          {/* Track Filter */}
          <select
            value={filters.track || 'all'}
            onChange={(e) => handleFilterChange('track', e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              outline: 'none',
              height: '36px',
            }}
          >
            <option value="all">All Tracks</option>
            {TRACKS.map(tr => (
              <option key={tr.key} value={tr.key}>{tr.key}</option>
            ))}
          </select>

          {/* Clear Filters button */}
          {isFilterActive && (
            <button
              onClick={onResetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 86, 34, 0.08)',
                color: 'var(--edge-primary)',
                border: '1px solid rgba(255, 86, 34, 0.25)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                height: '36px',
              }}
              title="Reset all search and filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Expand / Collapse / Fit buttons (for Structure view) */}
        {activeView === 'structure' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {onFitToScreen && (
              <button
                onClick={onFitToScreen}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '36px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--edge-primary)',
                  fontWeight: 700,
                  background: 'rgba(255, 86, 34, 0.08)',
                  borderColor: 'rgba(255, 86, 34, 0.3)',
                }}
                title="Auto-Fit entire organization structure into screen"
              >
                <Maximize2 size={12} />
                <span>Fit to Screen</span>
              </button>
            )}
            <button
              onClick={onExpandAll}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '36px', fontSize: 'var(--text-xs)' }}
              title="Expand all levels of the organization tree"
            >
              <span>Expand All</span>
            </button>
            <button
              onClick={onCollapseAll}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '36px', fontSize: 'var(--text-xs)' }}
              title="Collapse to top domain level"
            >
              <Minimize2 size={12} />
              <span>Collapse All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
