import React from 'react';
import { useDataStore } from '../../data/mockDataStore';
import DataTable, { type ColumnDef, type FilterDef } from '../../components/common/DataTable';
import type { AttendanceRecord } from '../../data/master-employees';
import SubPageHeader from '../../components/navigation/SubPageHeader';
import { TEAM_OVERVIEW_SIBLINGS } from './TeamOverviewLandingPage';

const AttendanceView: React.FC = () => {
  const { employees, attendanceRecords } = useDataStore();

  const totalEmployees = employees.length;
  const presentCount = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
  const leaveCount = employees.filter(e => e.status === 'On Leave').length;
  const trainingCount = employees.filter(e => e.status === 'Training').length;
  const standbyCount = employees.filter(e => e.status === 'Standby').length;
  const attendanceRate = ((presentCount / totalEmployees) * 100).toFixed(1);

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      header: 'Log ID',
      accessorKey: 'id',
      width: '100px',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--brand-ink, #0D4C93)', fontFamily: 'monospace' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Employee ID',
      accessorKey: 'employeeId',
      width: '120px',
      cell: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--brand-ink, #0D4C93)', fontFamily: 'monospace' }}>
          {row.employeeId}
        </span>
      ),
    },
    {
      header: 'Employee Name',
      accessorKey: 'employee',
      cell: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>
          {row.employee}
        </span>
      ),
    },
    {
      header: 'SAP Domain',
      accessorKey: 'tower',
      cell: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            background: 'var(--bg-secondary, #F7F8FA)',
            fontWeight: 600,
            fontSize: '0.75rem',
            border: '1px solid var(--border, #E4E7EC)',
          }}
        >
          {row.tower}
        </span>
      ),
    },
    {
      header: 'Shift Timing',
      accessorKey: 'shift',
    },
    {
      header: 'Check-In',
      accessorKey: 'checkIn',
      cell: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: row.checkIn === 'N/A' ? 'var(--text-tertiary, #98A2B3)' : '#22A06B' }}>
          {row.checkIn}
        </span>
      ),
    },
    {
      header: 'Check-Out',
      accessorKey: 'checkOut',
      cell: (row) => (
        <span style={{ fontFamily: 'monospace', color: row.checkOut === 'N/A' ? 'var(--text-tertiary, #98A2B3)' : 'var(--text-secondary, #475467)' }}>
          {row.checkOut}
        </span>
      ),
    },
    {
      header: 'Work Location',
      accessorKey: 'workLocation',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const bg = row.status === 'Present' ? '#E3FCEF' : row.status === 'Remote' ? '#E6F4FC' : row.status === 'On Leave' ? '#FFF7E6' : '#FFEBE6';
        const color = row.status === 'Present' ? '#22A06B' : row.status === 'Remote' ? '#48C1BB' : row.status === 'On Leave' ? '#E97F0A' : '#DE350B';
        return (
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              background: bg,
              color: color,
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  const uniqueTowers = Array.from(new Set(attendanceRecords.map(e => e.tower))).map(t => ({ label: t, value: t }));
  const uniqueStatuses = Array.from(new Set(attendanceRecords.map(e => e.status))).map(s => ({ label: s, value: s }));

  const filters: FilterDef<AttendanceRecord>[] = [
    { key: 'tower', label: 'SAP Domain', options: uniqueTowers },
    { key: 'status', label: 'Statuses', options: uniqueStatuses },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* Sub-Page Header with Breadcrumb and Sibling Navigation */}
      <SubPageHeader
        moduleTitle="Team Overview"
        modulePath="/team-overview"
        pageTitle="Attendance"
        siblingPages={TEAM_OVERVIEW_SIBLINGS}
      />

      {/* KPI Cards Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Workforce Today</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)', marginTop: 4 }}>{totalEmployees}</div>
          <div style={{ fontSize: '0.75rem', color: '#22A06B', marginTop: 2, fontWeight: 600 }}>{attendanceRate}% Present Rate</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Present / Remote</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22A06B', marginTop: 4 }}>{presentCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Checked-in on shift</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Approved Leave</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E97F0A', marginTop: 4 }}>{leaveCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>Backups operational</div>
        </div>

        <div className="card" style={{ padding: 16, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary, #475467)', textTransform: 'uppercase' }}>Training / Standby</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#48C1BB', marginTop: 4 }}>{trainingCount + standbyCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>On-call rotation</div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={attendanceRecords}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by employee name, ID, tower, or location..."
        searchKeys={['employee', 'employeeId', 'tower', 'workLocation', 'shift']}
        pageSize={15}
        title="Live Shift Attendance Log"
        subtitle="Generated from biometric access control & shift scheduler"
        exportFilename="noc_attendance_log"
      />
    </div>
  );
};

export default AttendanceView;
