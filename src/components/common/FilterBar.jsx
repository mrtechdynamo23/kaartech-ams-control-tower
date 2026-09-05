/**
 * EDGE AMS Control Tower — FilterBar Component
 * Multi-dimensional filtering by Entity, Domain, Priority, Track, Status, Application.
 * Upgraded with custom FilterDropdowns (Section 21) and active filter badge counter (Section 22).
 */
import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import FilterDropdown from './FilterDropdown';
import { ENTITIES, BUSINESS_DOMAINS, APPLICATIONS, TRACKS } from '../../data/masterData';

export default function FilterBar({
  filters = {},
  onChange,
  onReset,
  showEntity = true,
  showDomain = true,
  showPriority = true,
  showTrack = false,
  showStatus = true,
  showApp = true,
  statusOptions = ['New', 'In Progress', 'Awaiting Info', 'Resolved', 'Closed'],
}) {
  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all' && v !== '').length;

  const entityOptions = [
    { value: 'all', label: 'All Entities (34)' },
    ...ENTITIES.map(ent => ({ value: ent.name, label: ent.name }))
  ];

  const domainOptions = [
    { value: 'all', label: 'All Domains (8)' },
    ...BUSINESS_DOMAINS.map(d => ({ value: d.key, label: `${d.key} — ${d.label}` }))
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'P1', label: 'P1 - Critical' },
    { value: 'P2', label: 'P2 - High' },
    { value: 'P3', label: 'P3 - Medium' },
    { value: 'P4', label: 'P4 - Low' },
  ];

  const statusDropdownOptions = [
    { value: 'all', label: 'All Statuses' },
    ...statusOptions.map(st => ({ value: st, label: st }))
  ];

  const trackOptions = [
    { value: 'all', label: 'All Tracks' },
    ...TRACKS.map(tr => ({ value: tr.key, label: `${tr.key} (${tr.location})` }))
  ];

  const appOptions = [
    { value: 'all', label: 'All Applications' },
    ...APPLICATIONS.filter(a => a.scope === 'In Scope').map(app => ({ value: app.name, label: app.name }))
  ];

  return (
    <div
      className="filter-bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginRight: '4px',
        }}
      >
        <Filter size={14} style={{ color: 'var(--edge-primary)' }} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span
            style={{
              background: 'var(--edge-primary)',
              color: 'white',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            · {activeFilterCount}
          </span>
        )}
      </div>

      {/* Entity Filter */}
      {showEntity && (
        <FilterDropdown
          value={filters.entity || 'all'}
          options={entityOptions}
          onChange={(val) => handleFilterChange('entity', val)}
          minWidth="140px"
          maxWidth="190px"
        />
      )}

      {/* Domain Filter */}
      {showDomain && (
        <FilterDropdown
          value={filters.domain || 'all'}
          options={domainOptions}
          onChange={(val) => handleFilterChange('domain', val)}
          minWidth="130px"
          maxWidth="180px"
        />
      )}

      {/* Priority Filter */}
      {showPriority && (
        <FilterDropdown
          value={filters.priority || 'all'}
          options={priorityOptions}
          onChange={(val) => handleFilterChange('priority', val)}
          minWidth="120px"
          maxWidth="160px"
        />
      )}

      {/* Status Filter */}
      {showStatus && (
        <FilterDropdown
          value={filters.status || 'all'}
          options={statusDropdownOptions}
          onChange={(val) => handleFilterChange('status', val)}
          minWidth="120px"
          maxWidth="160px"
        />
      )}

      {/* Track Filter */}
      {showTrack && (
        <FilterDropdown
          value={filters.track || 'all'}
          options={trackOptions}
          onChange={(val) => handleFilterChange('track', val)}
          minWidth="130px"
          maxWidth="170px"
        />
      )}

      {/* Application Filter */}
      {showApp && (
        <FilterDropdown
          value={filters.app || 'all'}
          options={appOptions}
          onChange={(val) => handleFilterChange('app', val)}
          minWidth="140px"
          maxWidth="200px"
        />
      )}

      {/* Reset / Clear All Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--text-xs)',
            color: 'var(--edge-primary)',
            marginLeft: 'auto',
            padding: '4px 8px',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={12} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}
