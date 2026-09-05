/**
 * EDGE AMS Control Tower — Enterprise DataTable Component
 * Features: Sorting, Search, Pagination, Column Visibility, CSV Export,
 * Row Selection, Custom Cell Renderers, Row Click Drilldown, Responsive.
 */
import React, { useState, useMemo } from 'react';
import {
  ChevronDown, ChevronUp, ChevronsUpDown, Download, Eye,
  Search, ChevronLeft, ChevronRight, SlidersHorizontal, Check
} from 'lucide-react';
import { StatusBadge, PriorityBadge, SLABadge } from './Badges';

export default function DataTable({
  columns = [],
  data = [],
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  onRowClick,
  actions,
  defaultSortField,
  defaultSortDir = 'asc',
  pageSize: initialPageSize = 10,
  enableSelection = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  exportFilename = 'export-data.csv',
  emptyMessage = 'No records found matching your criteria',
}) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(defaultSortField || (columns[0] ? columns[0].key : ''));
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [visibleColumns, setVisibleColumns] = useState(() => columns.map(c => c.key));
  const [showColMenu, setShowColMenu] = useState(false);

  // Filter by search query
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(item => {
      return columns.some(col => {
        const val = item[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, search, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      const cmp = String(valA).localeCompare(String(valB));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortField, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    if (sortField === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortField('');
        setSortDir('asc');
      }
    } else {
      setSortField(key);
      setSortDir('asc');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const activeCols = columns.filter(c => visibleColumns.includes(c.key));
    const headerRow = activeCols.map(c => `"${c.label}"`).join(',');
    const rows = sortedData.map(item => {
      return activeCols.map(c => {
        const val = item[c.key];
        return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`;
      }).join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter(k => k !== key));
      }
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  // Render Cell Formatter
  const renderCell = (col, item) => {
    const val = item[col.key];

    if (col.render) {
      return col.render(val, item);
    }

    if (col.type === 'status') {
      return <StatusBadge status={val} />;
    }
    if (col.type === 'priority') {
      return <PriorityBadge priority={val} />;
    }
    if (col.type === 'sla') {
      return <SLABadge slaStatus={val} />;
    }
    if (col.type === 'date' && val) {
      try {
        return new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch (e) {
        return String(val);
      }
    }
    if (col.type === 'currency' && typeof val === 'number') {
      return `AED ${val.toLocaleString()}`;
    }

    if (val === undefined || val === null || val === '') {
      return <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>—</span>;
    }
    return String(val);
  };

  const activeColumns = columns.filter(c => visibleColumns.includes(c.key));

  return (
    <div className="data-table-wrapper" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {/* Header Toolbar */}
      <div className="data-table-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          {title && <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div className="data-table-search" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', minWidth: '220px' }}>
            <Search size={15} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%' }}
            />
          </div>

          {/* Column Visibility Selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowColMenu(!showColMenu)}
              title="Toggle Columns"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={14} />
              <span>Columns</span>
            </button>

            {showColMenu && (
              <div
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 100,
                  background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)', padding: '8px', minWidth: '180px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Visible Columns
                </div>
                {columns.map(col => (
                  <div
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 8px', fontSize: 'var(--text-sm)', cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)', color: visibleColumns.includes(col.key) ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                  >
                    <span>{col.label}</span>
                    {visibleColumns.includes(col.key) && <Check size={14} style={{ color: 'var(--edge-primary)' }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export to CSV"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Body */}
      <div className="data-table-container" style={{ overflowX: 'auto', maxHeight: '560px', overflowY: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--bg-tertiary)' }}>
            <tr>
              {enableSelection && (
                <th style={{ width: '40px', padding: '12px 16px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked ? paginatedData.map(d => d.id) : [])}
                  />
                </th>
              )}
              {activeColumns.map(col => {
                const isSorted = sortField === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    style={{
                      padding: '12px 16px', textAlign: 'left', fontWeight: 600,
                      fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.04em',
                      color: isSorted ? 'var(--edge-primary)' : 'var(--text-secondary)',
                      cursor: col.sortable !== false ? 'pointer' : 'default',
                      whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-primary)',
                      width: col.width || 'auto',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        isSorted ? (
                          sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ChevronsUpDown size={12} style={{ opacity: 0.3 }} />
                        )
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={activeColumns.length + (enableSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-tertiary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                      <Search size={20} />
                    </div>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      No records match the current filters
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      Try adjusting your search terms or clearing active filter parameters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const isSelected = selectedRows.includes(item.id);
                return (
                  <tr
                    key={item.id || rowIdx}
                    onClick={() => onRowClick && onRowClick(item)}
                    style={{
                      borderBottom: '1px solid var(--border-secondary)',
                      cursor: onRowClick ? 'pointer' : 'default',
                      background: isSelected ? 'var(--edge-primary-light)' : undefined,
                      transition: 'background 0.15s ease',
                    }}
                    className="data-table-row"
                  >
                    {enableSelection && (
                      <td style={{ width: '40px', padding: '12px 16px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow && onSelectRow(item.id)}
                        />
                      </td>
                    )}
                    {activeColumns.map(col => (
                      <td
                        key={col.key}
                        style={{
                          padding: '12px 16px',
                          color: col.key === 'id' ? 'var(--edge-primary)' : 'var(--text-primary)',
                          fontWeight: col.key === 'id' ? 700 : 400,
                          fontSize: col.key === 'id' ? 'var(--text-xs)' : 'var(--text-sm)',
                          letterSpacing: col.key === 'id' ? '0.02em' : 'normal',
                          whiteSpace: col.wrap ? 'normal' : 'nowrap',
                          verticalAlign: 'middle',
                        }}
                      >
                        {renderCell(col, item)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>
            Showing <strong>{sortedData.length === 0 ? 0 : (page - 1) * pageSize + 1}</strong> to <strong>{Math.min(page * pageSize, sortedData.length)}</strong> of <strong>{sortedData.length}</strong> entries
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{
                padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-primary)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)'
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{ padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            style={{ padding: '4px 8px', minWidth: 'auto' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
