import React from 'react';
import {
  Users, Layers, Phone, CalendarDays, UserCheck, Clock
} from 'lucide-react';
import ModuleLandingHub, { type SubTileItem } from '../../components/navigation/ModuleLandingHub';
import { useDataStore } from '../../data/mockDataStore';

export const TEAM_OVERVIEW_SIBLINGS = [
  { id: 'resource-data', title: 'Resource Data', path: '/team-overview/resource-data', icon: <Users size={14} /> },
  { id: 'team-structure', title: 'Team Structure', path: '/team-overview/team-structure', icon: <Layers size={14} /> },
  { id: 'contacts', title: 'Contact Directory', path: '/team-overview/contacts', icon: <Phone size={14} /> },
  { id: 'leave', title: 'Leave Management', path: '/team-overview/leave', icon: <CalendarDays size={14} /> },
  { id: 'shift-ops', title: 'Shift Operations Log', path: '/shift-operations', icon: <Clock size={14} /> },
  { id: 'attendance', title: 'Shift Attendance & Roster', path: '/team-overview/attendance', icon: <UserCheck size={14} /> },
];

const TeamOverviewLandingPage: React.FC = () => {
  const { employees, leaveRecords } = useDataStore();
  const pendingLeaves = leaveRecords.filter(l => l.status === 'Pending').length;

  const subTiles: SubTileItem[] = [
    {
      id: 'team-roster',
      title: 'Resource Data',
      description: 'Master resource roster across all 9 towers: positions, reporting lines, nationality status, and employee details.',
      icon: <Users size={22} />,
      path: '/team-overview/resource-data',
      kpiValue: `${employees.length} Master Resources`,
      kpiLabel: 'Full Operational Strength',
      badge: 'Active Roster',
      badgeType: 'healthy',
    },
    {
      id: 'team-struct',
      title: 'Team Structure',
      description: 'Hierarchical team structures, tower leadership charts, department alignments, and management coverage matrices.',
      icon: <Layers size={22} />,
      path: '/team-overview/team-structure',
      kpiValue: '9 Delivery Towers',
      kpiLabel: '100% Lead Roles Staffed',
      badge: 'Organised',
      badgeType: 'info',
    },
    {
      id: 'team-contacts',
      title: 'Contact Directory',
      description: 'Direct contact directory, official emails, mobile numbers with privacy masking controls, and shift locations.',
      icon: <Phone size={22} />,
      path: '/team-overview/contacts',
      kpiValue: `${employees.length} Verified Contacts`,
      kpiLabel: 'Direct Email & Phone Dialing',
      badge: 'Privacy Protected',
      badgeType: 'healthy',
    },
    {
      id: 'team-leave',
      title: 'Leave Management',
      description: 'Annual and sick leave balances, request approvals, shift coverage analysis, and upcoming absence calendars.',
      icon: <CalendarDays size={22} />,
      path: '/team-overview/leave',
      kpiValue: `${pendingLeaves} Pending Approval`,
      kpiLabel: 'Zero Operational Coverage Gaps',
      badge: pendingLeaves > 0 ? `${pendingLeaves} Pending` : 'All Approved',
      badgeType: pendingLeaves > 0 ? 'warning' : 'healthy',
    },
    {
      id: 'team-shift-ops',
      title: 'Shift Operations Log',
      description: 'Daily shift handovers, operational checklists, duty lead logs, minutes of meeting (MOM), and 24/7 coverage tracking.',
      icon: <Clock size={22} />,
      path: '/shift-operations',
      kpiValue: '24/7 Active Rotation',
      kpiLabel: '100% Handover Compliance',
      badge: 'Continuous Ops',
      badgeType: 'healthy',
    },
    {
      id: 'team-attend',
      title: 'Shift Attendance & Roster',
      description: 'Daily shift attendance verification, check-in tracking, on-site vs remote distribution, and roster schedules.',
      icon: <UserCheck size={22} />,
      path: '/team-overview/attendance',
      kpiValue: '98.6% Shift Adherence',
      kpiLabel: '348 Checked-in Today',
      badge: 'On Duty',
      badgeType: 'healthy',
    },
  ];

  return (
    <ModuleLandingHub
      moduleTitle="Team Overview"
      moduleSubtitle="Comprehensive human capital management, resource rosters, organisational team hierarchies, shift operations, and workforce attendance."
      categoryLabel="WORKFORCE & TALENT"
      subTiles={subTiles}
    />
  );
};

export default TeamOverviewLandingPage;
