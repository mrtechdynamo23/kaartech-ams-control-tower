/**
 * EDGE AMS Control Tower — Governance Workflow Store
 * Centralized reactive store for Audits, Findings, and Remediation Tasks.
 * 
 * Traceability Chain:
 * Audit → Finding → Remediation Task → Evidence / Validation → Finding Closed → Audit Compliance Improved
 */
import { useState, useEffect } from 'react';
import { audits as initialAudits, findings as initialFindings, remediationTasks as initialTasksData } from './demoData';

// Reference Current Date for Overdue calculations (2026-09-06 local simulated)
export const CURRENT_SIMULATED_DATE = '2026-09-06';

/**
 * Helper to derive real task status:
 * Overdue is derived from:
 * Target Date < current date AND Status is not Completed/Closed.
 */
export function getDerivedTaskStatus(task, currentDate = CURRENT_SIMULATED_DATE) {
  if (!task) return 'Not Started';
  const rawStatus = task.status || 'Not Started';
  if (['Completed', 'Closed', 'Resolved'].includes(rawStatus)) {
    return 'Completed';
  }
  if (task.targetDate && task.targetDate < currentDate) {
    return 'Overdue';
  }
  return rawStatus;
}

// In-memory global store state
let globalTasks = [...initialTasksData];
let globalFindings = [...initialFindings];
let globalAudits = [...initialAudits];
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const governanceStore = {
  getTasks: () => [...globalTasks],
  getFindings: () => [...globalFindings],
  getAudits: () => [...globalAudits],

  getTaskById: (id) => globalTasks.find((t) => t.id === id) || null,
  getFindingById: (id) => globalFindings.find((f) => f.id === id) || null,
  getAuditById: (id) => globalAudits.find((a) => a.id === id) || null,

  getTasksForFinding: (findingId) => {
    return globalTasks.filter((t) => t.findingId === findingId);
  },

  getTasksForAudit: (auditId) => {
    return globalTasks.filter((t) => t.auditId === auditId);
  },

  getFindingsForAudit: (auditId) => {
    return globalFindings.filter((f) => f.auditId === auditId);
  },

  /**
   * Create Remediation Task:
   * Inherits Related Audit & Related Finding automatically.
   * Immediately registers in Task Board.
   */
  addTask: (taskData) => {
    const nextNum = globalTasks.reduce((max, t) => {
      const match = t.id && t.id.match(/TSK-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 52) + 1;

    const newId = `TSK-${String(nextNum).padStart(4, '0')}`;
    const newTask = {
      id: newId,
      taskDescription: taskData.taskDescription || taskData.description || 'Remediation Action',
      description: taskData.taskDescription || taskData.description || 'Remediation Action',
      raisedOn: taskData.raisedOn || CURRENT_SIMULATED_DATE,
      raisedBy: taskData.raisedBy || 'Governance Manager',
      assignedTo: taskData.assignedTo || 'AMS Service Manager',
      targetDate: taskData.targetDate || '2026-09-20',
      status: taskData.status || 'Not Started',
      auditId: taskData.auditId || 'AUD-0008',
      findingId: taskData.findingId || 'FND-0024',
      ctaId: taskData.ctaId || null,
    };

    globalTasks = [newTask, ...globalTasks];
    notifyListeners();
    return newTask;
  },

  /**
   * Update Task Status:
   * IMPORTANT: When a task is marked Completed:
   * do NOT automatically close the Finding.
   * Finding remains Open / Pending Verification until validation/evidence is attested.
   */
  updateTaskStatus: (taskId, newStatus) => {
    globalTasks = globalTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    // Check if the finding should update to "Pending Verification" if all tasks are complete
    const updatedTask = globalTasks.find((t) => t.id === taskId);
    if (updatedTask && updatedTask.findingId) {
      const findingTasks = globalTasks.filter((t) => t.findingId === updatedTask.findingId);
      const allComplete = findingTasks.length > 0 && findingTasks.every((t) => t.status === 'Completed');
      if (allComplete) {
        globalFindings = globalFindings.map((f) => {
          if (f.id === updatedTask.findingId && f.complianceStatus === 'Open') {
            return {
              ...f,
              complianceStatus: 'Pending Verification',
              status: 'Pending Verification',
              verificationNotice: 'All remediation tasks completed. Awaiting evidence review.',
            };
          }
          return f;
        });
      }
    }

    notifyListeners();
  },

  /**
   * Attest Evidence & Close Finding (Section 7):
   * Only after evidence validation does Finding become Closed / Compliant.
   */
  validateAndCloseFinding: (findingId, validatorName = 'Lead Auditor') => {
    globalFindings = globalFindings.map((f) => {
      if (f.id === findingId) {
        return {
          ...f,
          complianceStatus: 'Remediated',
          status: 'Remediated',
          validatedBy: validatorName,
          validationDate: CURRENT_SIMULATED_DATE,
          evidenceStatus: 'Verified & Closed',
        };
      }
      return f;
    });

    notifyListeners();
  },

  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Custom React Hook to consume governance store with automatic re-renders
 */
export function useGovernanceStore() {
  const [tasks, setTasks] = useState(() => governanceStore.getTasks());
  const [findings, setFindings] = useState(() => governanceStore.getFindings());
  const [audits, setAudits] = useState(() => governanceStore.getAudits());

  useEffect(() => {
    const unsubscribe = governanceStore.subscribe(() => {
      setTasks(governanceStore.getTasks());
      setFindings(governanceStore.getFindings());
      setAudits(governanceStore.getAudits());
    });
    return unsubscribe;
  }, []);

  return {
    tasks,
    findings,
    audits,
    getDerivedTaskStatus,
    addTask: governanceStore.addTask,
    updateTaskStatus: governanceStore.updateTaskStatus,
    validateAndCloseFinding: governanceStore.validateAndCloseFinding,
    getTasksForFinding: governanceStore.getTasksForFinding,
    getTasksForAudit: governanceStore.getTasksForAudit,
    getFindingsForAudit: governanceStore.getFindingsForAudit,
    getTaskById: governanceStore.getTaskById,
    getFindingById: governanceStore.getFindingById,
    getAuditById: governanceStore.getAuditById,
  };
}
