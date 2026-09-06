import React, { useState } from 'react';
import { useDataStore } from '../../data/mockDataStore';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import EmployeeDetailModal from '../../components/common/EmployeeDetailModal';
import { getQatarizationStats, type MasterEmployee } from '../../data/master-employees';
import { Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { TEAM_OVERVIEW_SIBLINGS } from './TeamOverviewLandingPage';

const ResourceRoster: React.FC = () => {
  const { employees } = useDataStore();
  const [selectedEmployee, setSelectedEmployee] = useState<MasterEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBucketFilter, setSelectedBucketFilter] = useState<string>('All');

  const qatStats = getQatarizationStats();

  const handleRowClick = (employee: MasterEmployee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  // Filter employees if domain card clicked
  const filteredEmployees = selectedBucketFilter === 'All'
    ? employees
    : employees.filter(e => e.locationBucket === selectedBucketFilter);

  // Column order specified in requirements:
  // Position, Tower, Department, Name, Reporting Manager, Status, Shift, Type, Actions
  const columns: ColumnDef<MasterEmployee>[] = [
    {
      header: 'Position',
      accessorKey: 'position',
      width: '150px',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.position}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--brand-ink, #0D4C93)', fontFamily: 'monospace' }}>
            {row.employeeId}
          </div>
        </div>
      ),
    },
    {
      header: 'SAP Domain',
      accessorKey: 'tower',
      width: '130px',
      cell: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            background: 'var(--bg-secondary, #F7F8FA)',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: '1px solid var(--border, #E4E7EC)',
            color: 'var(--text, #101828)',
          }}
        >
          {row.tower}
        </span>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #475467)' }}>
          {row.department}
        </span>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Reporting Manager',
      accessorKey: 'manager',
      cell: (row) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text, #101828)', fontWeight: 500 }}>
          {row.manager}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      width: '100px',
      cell: (row) => {
        const bg = row.status === 'Active' ? '#E3FCEF' : row.status === 'On Leave' ? '#FFF7E6' : row.status === 'Training' ? '#E6F4FC' : '#F4F5F7';
        const color = row.status === 'Active' ? '#22A06B' : row.status === 'On Leave' ? '#E97F0A' : row.status === 'Training' ? '#48C1BB' : '#8993A4';
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 12,
              background: bg,
              color: color,
              fontWeight: 700,
              fontSize: '0.6875rem',
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Shift',
      accessorKey: 'shift',
      cell: (row) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
          {row.shift.split(' ')[0]}
        </span>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'expatLocal',
      width: '90px',
      cell: (row) => (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: row.expatLocal === 'Local' ? '#0E9F6E' : '#0D4C93',
            padding: '2px 6px',
            borderRadius: 4,
            background: row.expatLocal === 'Local' ? 'rgba(14, 159, 110, 0.1)' : 'rgba(13, 76, 147, 0.08)',
          }}
        >
          {row.expatLocal === 'Local' ? 'Qatari' : 'Expat'}
        </span>
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      width: '80px',
      cell: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            background: 'var(--bg-secondary, #F7F8FA)',
            border: '1px solid var(--border, #E4E7EC)',
            color: 'var(--brand-ink, #0D4C93)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          <Eye size={12} /> View
        </button>
      ),
    },
  ];

  const uniqueTowers = Array.from(new Set(employees.map(e => e.tower))).map(t => ({ label: t, value: t }));
  const uniqueDepartments = Array.from(new Set(employees.map(e => e.department))).map(d => ({ label: d, value: d }));
  const uniqueStatuses = Array.from(new Set(employees.map(e => e.status))).map(s => ({ label: s, value: s }));
  const uniqueBuckets = Array.from(new Set(employees.map(e => e.locationBucket))).map(b => ({ label: b, value: b }));

  const filters: FilterDef<MasterEmployee>[] = [
    { key: 'locationBucket', label: 'Qatarization Domain', options: uniqueBuckets },
    { key: 'tower', label: 'SAP Domain', options: uniqueTowers },
    { key: 'department', label: 'Departments', options: uniqueDepartments },
    { key: 'status', label: 'Statuses', options: uniqueStatuses },
    {
      key: 'expatLocal',
      label: 'Nationality',
      options: [
        { label: 'Qatari National', value: 'Local' },
        { label: 'Expat', value: 'Expat' },
      ],
    },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Team Overview"
        modulePath="/team-overview"
        pageTitle="Resource Data"
        siblingPages={TEAM_OVERVIEW_SIBLINGS}
      />

      {/* ─── QATARIZATION DOMAIN SUMMARY STRIP (Section 4 Authoritative Figures) ─── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text, #101828)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Approved Qatarization Domain Status
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginLeft: 8 }}>
              (Authoritative Governance Baseline)
            </span>
          </div>
          {selectedBucketFilter !== 'All' && (
            <button
              onClick={() => setSelectedBucketFilter('All')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-ink, #0D4C93)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear Domain Filter ({selectedBucketFilter}) ✕
            </button>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 10,
          }}
        >
          {qatStats.domains.map((dom) => {
            const isSelected = selectedBucketFilter === dom.locationBucket;
            const isOk = dom.status === 'OK';
            return (
              <div
                key={dom.locationBucket}
                onClick={() => setSelectedBucketFilter(isSelected ? 'All' : dom.locationBucket)}
                className="card"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: isSelected ? 'rgba(13, 76, 147, 0.08)' : 'var(--card-bg, #FFFFFF)',
                  border: isSelected ? '2px solid #0D4C93' : '1px solid var(--border, #E4E7EC)',
                  borderLeft: `4px solid ${isOk ? '#22A06B' : '#DE350B'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {dom.locationBucket}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: isOk ? '#22A06B' : '#DE350B' }}>
                    {dom.actualPct}%
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                    Target: {dom.targetPct}%
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: '0.6875rem' }}>
                  <span style={{ color: 'var(--text-secondary, #475467)' }}>
                    {dom.qatariCount}/{dom.totalCount} Staff
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: isOk ? '#22A06B' : '#DE350B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    {isOk ? <ShieldCheck size={11} /> : <AlertTriangle size={11} />}
                    {dom.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={filteredEmployees}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by position, name, tower, ID, or manager..."
        searchKeys={['position', 'name', 'tower', 'department', 'employeeId', 'manager', 'role']}
        pageSize={15}
        onRowClick={handleRowClick}
        title="Master Operational Workforce"
        subtitle={`Showing ${filteredEmployees.length} employee records • Click any row for profile, privacy-masked phone & role history`}
        exportFilename="noc_resource_roster"
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ResourceRoster;
