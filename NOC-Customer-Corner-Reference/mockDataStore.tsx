import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { masterEmployees, type MasterEmployee, leaveRecordsList, type LeaveRecord, buildLeaveRecord, timesheetEntries as seedTimesheets, type TimesheetEntry, activityChecklistItems, type ActivityItem, handoverLogsList, type HandoverRecord, momActionsList, type MomAction, attendanceRecordsList, type AttendanceRecord } from './master-employees';
import { incidents as initialIncidents, type Incident, healthGrid as initialHealthGrid, type HealthGridItem, managementExceptions as initialExceptions, type ManagementException } from './incidents';
import { licenses as initialLicenses, type LicenseRecord } from './licenses';
import { vendors as initialVendors, type VendorRecord, vendorRisks as initialVendorRisks, type VendorRiskRecord, vendorActions as initialVendorActions, type VendorAction } from './vendorData';
import { programs as initialPrograms, type ProgramRecord, milestones as initialMilestones, type MilestoneRecord, dependencies as initialDependencies, type DependencyRecord, issuesAndActions as initialIssues, type IssueActionRecord } from './programs';
import { audits as initialAudits, type AuditRecord, governanceCommitments as initialGovCommitments, type GovernanceCommitment } from './audits';
import { serviceRequests as initialServiceRequests, type ServiceRequest } from './serviceRequests';
import { resourceMobilization as initialResourceMob, type ResourceMobilizationRecord } from './resourceMobilization';
import { notifications as initialNotifications, type NotificationItem } from './notifications';
import { initiativesList as initialInitiatives, type InitiativeItem } from './transformation';
import { infraNodes as initialInfraNodes, type InfraNode } from './infrastructure';
import {
  cornerThreads as initialCornerThreads, type CornerThread, type CornerMessage, type CornerTopic,
  type CornerForum, type CornerCTA, type CTAStatus,
  nextThreadId, nextCtaRef, nextMessageId,
} from './customerCorner';

interface DataStoreContextType {
  // Employees & Attendance
  employees: MasterEmployee[];
  leaveRecords: LeaveRecord[];
  attendanceRecords: AttendanceRecord[];
  activityItems: ActivityItem[];
  handoverLogs: HandoverRecord[];
  momActions: MomAction[];
  
  // Operational Incident & Health
  incidents: Incident[];
  healthGrid: HealthGridItem[];
  managementExceptions: ManagementException[];
  serviceRequests: ServiceRequest[];
  
  // Licenses & Entitlements
  licenses: LicenseRecord[];
  
  // Vendor & SIAM
  vendors: VendorRecord[];
  vendorRisks: VendorRiskRecord[];
  vendorActions: VendorAction[];
  
  // Program Management
  programs: ProgramRecord[];
  milestones: MilestoneRecord[];
  dependencies: DependencyRecord[];
  issuesAndActions: IssueActionRecord[];
  resourceMobilization: ResourceMobilizationRecord[];
  
  // Compliance & Transformation & Infra
  audits: AuditRecord[];
  governanceCommitments: GovernanceCommitment[];
  initiatives: InitiativeItem[];
  infraNodes: InfraNode[];
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  
  timesheets: TimesheetEntry[];

  // ─── Customer Corner (stakeholder collaboration channel) ───────────────
  /** Every ticket-linked and CTA conversation thread. */
  cornerThreads: CornerThread[];
  /** Stakeholder the current viewer is posting as (demo persona switch). */
  activeStakeholderId: string;
  setActiveStakeholderId: (id: string) => void;
  /** ISO timestamp each thread was last opened by the active stakeholder. */
  cornerReadState: Record<string, string>;

  // Mutators
  approveLeave: (id: string, reason?: string) => void;
  rejectLeave: (id: string, reason?: string) => void;
  cancelLeave: (id: string) => void;
  /** SOW App.1 §7.6 / §7.1 — a new leave request from the Apply Leave form. */
  applyLeave: (draft: {
    employee: string; leaveType: LeaveRecord['leaveType'];
    startDate: string; endDate: string; reason: string; backupResource: string;
  }) => LeaveRecord;
  submitTimesheet: (id: string) => void;
  approveTimesheet: (id: string) => void;
  toggleActivityItem: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  updateRiskStatus: (id: string, status: VendorRiskRecord['currentStatus']) => void;
  updateActionStatus: (id: string, status: VendorAction['status']) => void;

  // ─── Customer Corner mutators ──────────────────────────────────────────
  /** Open a conversation against an existing INC / SR. Never alters the ticket. */
  createTicketThread: (draft: {
    ticketId: string; title: string; topic: CornerTopic; forum: CornerForum;
    openedById: string; body: string; mentions: string[];
  }) => CornerThread;
  /** Raise a Call To Action that has no ticket behind it. */
  createCTAThread: (draft: {
    title: string; topic: CornerTopic; forum: CornerForum; openedById: string;
    body: string; mentions: string[]; ownerId: string; dueDate: string;
    priority: CornerCTA['priority'];
  }) => CornerThread;
  postCornerMessage: (threadId: string, draft: { authorId: string; body: string; mentions: string[]; kind?: CornerMessage['kind'] }) => void;
  resolveCornerThread: (threadId: string, byId: string) => void;
  reopenCornerThread: (threadId: string, byId: string) => void;
  updateCTA: (threadId: string, patch: { status?: CTAStatus; ownerId?: string; dueDate?: string; priority?: CornerCTA['priority'] }, byId: string) => void;
  /** Record that a CTA has been raised as a ticket — the ticket carries the SLA. */
  linkCtaToTicket: (threadId: string, ticketId: string, byId: string) => void;
  markCornerThreadRead: (threadId: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export const DataStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees] = useState<MasterEmployee[]>(masterEmployees);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() => {
    const saved = localStorage.getItem('noc-leaves');
    return saved ? JSON.parse(saved) : leaveRecordsList;
  });
  const [attendanceRecords] = useState<AttendanceRecord[]>(attendanceRecordsList);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>(activityChecklistItems);
  const [handoverLogs] = useState<HandoverRecord[]>(handoverLogsList);
  const [momActions] = useState<MomAction[]>(momActionsList);

  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [healthGrid] = useState<HealthGridItem[]>(initialHealthGrid);
  const [managementExceptions] = useState<ManagementException[]>(initialExceptions);
  const [serviceRequests] = useState<ServiceRequest[]>(initialServiceRequests);

  const [licenses] = useState<LicenseRecord[]>(initialLicenses);
  const [vendors] = useState<VendorRecord[]>(initialVendors);
  const [vendorRisks, setVendorRisks] = useState<VendorRiskRecord[]>(initialVendorRisks);
  const [vendorActions, setVendorActions] = useState<VendorAction[]>(initialVendorActions);

  const [programs] = useState<ProgramRecord[]>(initialPrograms);
  const [milestones] = useState<MilestoneRecord[]>(initialMilestones);
  const [dependencies] = useState<DependencyRecord[]>(initialDependencies);
  const [issuesAndActions] = useState<IssueActionRecord[]>(initialIssues);
  const [resourceMobilization] = useState<ResourceMobilizationRecord[]>(initialResourceMob);

  const [audits] = useState<AuditRecord[]>(initialAudits);
  const [governanceCommitments] = useState<GovernanceCommitment[]>(initialGovCommitments);
  const [initiatives] = useState<InitiativeItem[]>(initialInitiatives);
  const [infraNodes] = useState<InfraNode[]>(initialInfraNodes);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('noc-notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('noc-leaves', JSON.stringify(leaveRecords));
  }, [leaveRecords]);

  useEffect(() => {
    localStorage.setItem('noc-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(seedTimesheets);

  // ─── Customer Corner state ─────────────────────────────────────────────
  const [cornerThreads, setCornerThreads] = useState<CornerThread[]>(() => {
    const saved = localStorage.getItem('noc-customer-corner');
    return saved ? JSON.parse(saved) : initialCornerThreads;
  });
  const [activeStakeholderId, setActiveStakeholderId] = useState<string>(
    () => localStorage.getItem('noc-corner-persona') || 'CMP-01',
  );
  const [cornerReadAll, setCornerReadAll] = useState<Record<string, Record<string, string>>>(() => {
    const saved = localStorage.getItem('noc-corner-read');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('noc-customer-corner', JSON.stringify(cornerThreads));
  }, [cornerThreads]);

  useEffect(() => {
    localStorage.setItem('noc-corner-persona', activeStakeholderId);
  }, [activeStakeholderId]);

  useEffect(() => {
    localStorage.setItem('noc-corner-read', JSON.stringify(cornerReadAll));
  }, [cornerReadAll]);

  const cornerReadState = cornerReadAll[activeStakeholderId] ?? {};

  const now = () => new Date().toISOString();

  /** Adds anyone who speaks or is mentioned to the participant list. */
  const withParticipants = (thread: CornerThread, ids: string[]): string[] =>
    Array.from(new Set([...thread.participantIds, ...ids]));

  const appendMessage = (
    thread: CornerThread,
    draft: { authorId: string; body: string; mentions: string[]; kind?: CornerMessage['kind'] },
  ): CornerThread => ({
    ...thread,
    participantIds: withParticipants(thread, [draft.authorId, ...draft.mentions]),
    messages: [
      ...thread.messages,
      {
        id: nextMessageId(thread),
        authorId: draft.authorId,
        body: draft.body,
        postedAt: now(),
        mentions: draft.mentions,
        kind: draft.kind ?? 'comment',
      },
    ],
  });

  const createTicketThread: DataStoreContextType['createTicketThread'] = (draft) => {
    const thread: CornerThread = {
      id: nextThreadId(cornerThreads),
      type: 'Ticket',
      title: draft.title,
      topic: draft.topic,
      forum: draft.forum,
      ticketId: draft.ticketId,
      openedById: draft.openedById,
      openedAt: now(),
      status: 'Open',
      participantIds: Array.from(new Set([draft.openedById, ...draft.mentions])),
      messages: [],
    };
    const seeded = appendMessage(thread, {
      authorId: draft.openedById,
      body: draft.body,
      mentions: draft.mentions,
    });
    setCornerThreads((prev) => [seeded, ...prev]);
    return seeded;
  };

  const createCTAThread: DataStoreContextType['createCTAThread'] = (draft) => {
    const thread: CornerThread = {
      id: nextThreadId(cornerThreads),
      type: 'CTA',
      title: draft.title,
      topic: draft.topic,
      forum: draft.forum,
      cta: {
        ref: nextCtaRef(cornerThreads),
        ownerId: draft.ownerId,
        dueDate: draft.dueDate,
        status: 'Open',
        priority: draft.priority,
      },
      openedById: draft.openedById,
      openedAt: now(),
      status: 'Open',
      participantIds: Array.from(new Set([draft.openedById, draft.ownerId, ...draft.mentions])),
      messages: [],
    };
    const seeded = appendMessage(thread, {
      authorId: draft.openedById,
      body: draft.body,
      mentions: draft.mentions,
    });
    setCornerThreads((prev) => [seeded, ...prev]);
    return seeded;
  };

  const postCornerMessage: DataStoreContextType['postCornerMessage'] = (threadId, draft) => {
    setCornerThreads((prev) => prev.map((t) => (t.id === threadId ? appendMessage(t, draft) : t)));
  };

  const resolveCornerThread: DataStoreContextType['resolveCornerThread'] = (threadId, byId) => {
    setCornerThreads((prev) => prev.map((t) => {
      if (t.id !== threadId) return t;
      const noted = appendMessage(t, {
        authorId: byId,
        body: 'Marked this thread resolved.',
        mentions: [],
        kind: 'system',
      });
      return { ...noted, status: 'Resolved', resolvedAt: now(), resolvedById: byId };
    }));
  };

  const reopenCornerThread: DataStoreContextType['reopenCornerThread'] = (threadId, byId) => {
    setCornerThreads((prev) => prev.map((t) => {
      if (t.id !== threadId) return t;
      const noted = appendMessage(t, {
        authorId: byId,
        body: 'Reopened this thread.',
        mentions: [],
        kind: 'system',
      });
      return { ...noted, status: 'Open', resolvedAt: undefined, resolvedById: undefined };
    }));
  };

  const updateCTA: DataStoreContextType['updateCTA'] = (threadId, patch, byId) => {
    setCornerThreads((prev) => prev.map((t) => {
      if (t.id !== threadId || !t.cta) return t;
      const changes: string[] = [];
      if (patch.status && patch.status !== t.cta.status) changes.push(`status → ${patch.status}`);
      if (patch.ownerId && patch.ownerId !== t.cta.ownerId) changes.push('owner reassigned');
      if (patch.dueDate && patch.dueDate !== t.cta.dueDate) changes.push(`due date → ${patch.dueDate}`);
      if (patch.priority && patch.priority !== t.cta.priority) changes.push(`priority → ${patch.priority}`);
      const updated: CornerThread = { ...t, cta: { ...t.cta, ...patch } };
      if (!changes.length) return updated;
      return appendMessage(updated, {
        authorId: byId,
        body: `Updated the CTA: ${changes.join(', ')}.`,
        mentions: [],
        kind: 'system',
      });
    }));
  };

  const linkCtaToTicket: DataStoreContextType['linkCtaToTicket'] = (threadId, ticketId, byId) => {
    setCornerThreads((prev) => prev.map((t) => {
      if (t.id !== threadId || !t.cta) return t;
      const updated: CornerThread = { ...t, cta: { ...t.cta, convertedTicketId: ticketId } };
      return appendMessage(updated, {
        authorId: byId,
        body: `Raised as ticket ${ticketId}. The ticket now carries the service level; this thread stays as the conversation record.`,
        mentions: [],
        kind: 'system',
      });
    }));
  };

  const markCornerThreadRead: DataStoreContextType['markCornerThreadRead'] = (threadId) => {
    setCornerReadAll((prev) => ({
      ...prev,
      [activeStakeholderId]: { ...(prev[activeStakeholderId] ?? {}), [threadId]: now() },
    }));
  };

  // Leave Mutators
  const approveLeave = (id: string, reason?: string) => {
    setLeaveRecords(prev => prev.map(l =>
      l.id === id ? { ...l, status: 'Approved' as const, decisionReason: reason } : l));
  };

  const rejectLeave = (id: string, reason?: string) => {
    setLeaveRecords(prev => prev.map(l =>
      l.id === id ? { ...l, status: 'Rejected' as const, decisionReason: reason } : l));
  };

  /**
   * SOW App.1 §7.6 — annual leave goes to the COMPANY REPRESENTATIVE for
   * approval; sick and emergency leave are notifications and are recorded as
   * accepted rather than queued. buildLeaveRecord computes the notice period
   * and the §7.6 compliance flag, so the form cannot bypass either.
   */
  const applyLeave: DataStoreContextType['applyLeave'] = (draft) => {
    const nextId = `LEV-${101 + leaveRecords.length}`;
    const record = buildLeaveRecord({
      ...draft,
      id: nextId,
      submittedDate: new Date().toISOString().slice(0, 10),
      status: draft.leaveType === 'Annual Leave' ? 'Pending' : 'Approved',
    });
    setLeaveRecords(prev => [record, ...prev]);
    return record;
  };

  const submitTimesheet = (id: string) => {
    setTimesheets(prev => prev.map(t => t.id === id ? { ...t, status: 'Submitted' as const } : t));
  };

  const approveTimesheet = (id: string) => {
    setTimesheets(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' as const } : t));
  };

  const cancelLeave = (id: string) => {
    setLeaveRecords(prev => prev.map(l => l.id === id ? { ...l, status: 'Cancelled' } : l));
  };

  // Activity Checklist Mutator
  const toggleActivityItem = (id: string) => {
    setActivityItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
        return {
          ...item,
          status: nextStatus,
          completionPct: nextStatus === 'Completed' ? 100 : 0,
          lastCompleted: nextStatus === 'Completed' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : item.lastCompleted,
        };
      }
      return item;
    }));
  };

  // Notification Mutators
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  const updateRiskStatus = (id: string, status: VendorRiskRecord['currentStatus']) => {
    setVendorRisks(prev => prev.map(r => r.id === id ? { ...r, currentStatus: status } : r));
  };

  const updateActionStatus = (id: string, status: VendorAction['status']) => {
    setVendorActions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <DataStoreContext.Provider
      value={{
        employees,
        leaveRecords,
        attendanceRecords,
        activityItems,
        handoverLogs,
        momActions,
        incidents,
        healthGrid,
        managementExceptions,
        serviceRequests,
        licenses,
        vendors,
        vendorRisks,
        vendorActions,
        programs,
        milestones,
        dependencies,
        issuesAndActions,
        resourceMobilization,
        audits,
        governanceCommitments,
        initiatives,
        infraNodes,
        notifications,
        unreadNotificationCount,
        timesheets,
        approveLeave,
        rejectLeave,
        applyLeave,
        submitTimesheet,
        approveTimesheet,
        cancelLeave,
        toggleActivityItem,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        updateIncidentStatus,
        updateRiskStatus,
        updateActionStatus,
        cornerThreads,
        activeStakeholderId,
        setActiveStakeholderId,
        cornerReadState,
        createTicketThread,
        createCTAThread,
        postCornerMessage,
        resolveCornerThread,
        reopenCornerThread,
        updateCTA,
        linkCtaToTicket,
        markCornerThreadRead,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
};
