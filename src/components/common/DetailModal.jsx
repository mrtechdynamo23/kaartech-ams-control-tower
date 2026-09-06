/**
 * EDGE AMS Control Tower — Centered Record Detail Modal Component
 * Universal centered modal for inspecting Incidents, SRs, Enhancements, Problems, Risks, Audits, Findings, and Tasks.
 * Implements Sections 4, 6, 7, 8, 9, 23, 24, 25, 26, 27 of Master Build & Governance Specifications:
 * - Centered viewport with dimmed backdrop
 * - 760–920px width, max-height: 86vh
 * - Smooth ease-out animation (opacity + scale 0.97 → 1)
 * - Full keyboard support (ESC close), backdrop click, body scroll locking
 * - Governance Lineage Chain: Audit ↔ Finding ↔ Remediation Task
 * - Section 7: Completed task leaves Finding in Open/Pending Verification until validated
 * - Section 8: Finding Detail Summary, Related Audit (with Open Audit), Remediation Tasks (with + Create Remediation Task)
 * - Section 9: Audit Detail Summary, Compliance, Findings with task breakdown and drilldown
 * - Section 6: Task Detail Summary, Traceability links to Open Finding and Open Audit
 */
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Clock, User, Shield, AlertTriangle, FileText, CheckCircle2,
  ExternalLink, MessageSquare, History, Layers, Send, ArrowRight,
  GitPullRequest, BookOpen, AlertOctagon, CheckSquare, Sparkles,
  Link as LinkIcon, ChevronRight, ChevronLeft, CheckCircle, ShieldCheck,
  Plus, Calendar
} from 'lucide-react';
import { StatusBadge, PriorityBadge, SLABadge } from './Badges';
import { getStatusSemantic, getPriorityColor } from '../../utils/statusSemantics';
import { useGovernanceStore } from '../../data/governanceStore';
import CreateRemediationTaskModal from '../governance/CreateRemediationTaskModal';

export default function DetailModal({
  isOpen,
  onClose,
  item,
  type = 'incident',
  onSelectRelatedItem,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [workNotes, setWorkNotes] = useState([]);
  const [currentItem, setCurrentItem] = useState(item);
  const [currentType, setCurrentType] = useState(type);
  const [historyStack, setHistoryStack] = useState([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const modalRef = useRef(null);

  const {
    tasks,
    findings,
    audits,
    getTasksForFinding,
    getTasksForAudit,
    getFindingsForAudit,
    getAuditById,
    getFindingById,
    updateTaskStatus,
    validateAndCloseFinding,
    getDerivedTaskStatus,
  } = useGovernanceStore();

  // Keep internal item in sync with external prop changes
  useEffect(() => {
    if (item) {
      setCurrentItem(item);
      setCurrentType(type);
      setHistoryStack([]);
      setActiveTab('overview');
    }
  }, [item, type]);

  // Navigate deeper in the governance hierarchy
  const navigateToItem = (newItem, newType) => {
    if (!newItem) return;
    setHistoryStack((prev) => [...prev, { item: currentItem, type: currentType }]);
    setCurrentItem(newItem);
    setCurrentType(newType);
    setActiveTab('overview');
    if (onSelectRelatedItem) onSelectRelatedItem(newItem, newType);
  };

  // Back button for navigation stack
  const navigateBack = () => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setHistoryStack((s) => s.slice(0, -1));
    setCurrentItem(prev.item);
    setCurrentType(prev.type);
    setActiveTab('overview');
    if (onSelectRelatedItem) onSelectRelatedItem(prev.item, prev.type);
  };

  const activeItem = currentItem || item;

  // Determine entity classification
  const isAudit = currentType === 'audit' || (activeItem?.id && activeItem.id.startsWith('AUD-'));
  const isFinding = currentType === 'finding' || (activeItem?.id && activeItem.id.startsWith('FND-'));
  const isTask = currentType === 'task' || (activeItem?.id && activeItem.id.startsWith('TSK-'));
  const isProblem = !isAudit && !isFinding && !isTask && (currentType === 'problem' || Boolean(activeItem?.rcaId) || Boolean(activeItem?.rootCause));
  const isEnhancement = !isAudit && !isFinding && !isTask && (currentType === 'enhancement' || (activeItem?.id && activeItem.id.startsWith('ENH')));
  const isSR = !isAudit && !isFinding && !isTask && (currentType === 'sr' || (activeItem?.id && activeItem.id.startsWith('SR')));

  // Live entity instances from reactive store
  const liveFinding = isFinding && activeItem ? (findings.find((f) => f.id === activeItem.id) || activeItem) : null;
  const liveTask = isTask && activeItem ? (tasks.find((t) => t.id === activeItem.id) || activeItem) : null;
  const liveAudit = isAudit && activeItem ? (audits.find((a) => a.id === activeItem.id) || activeItem) : null;

  // Relationships
  const findingTasks = isFinding && liveFinding?.id ? getTasksForFinding(liveFinding.id) : [];
  const relatedAudit = isFinding
    ? (liveFinding?.auditId ? getAuditById(liveFinding.auditId) : null)
    : isTask
    ? (liveTask?.auditId ? getAuditById(liveTask.auditId) : null)
    : null;
  const relatedFinding = isTask
    ? (liveTask?.findingId ? getFindingById(liveTask.findingId) : null)
    : null;
  const linkedFindings = isAudit && liveAudit?.id ? getFindingsForAudit(liveAudit.id) : [];

  // Seed work notes
  useEffect(() => {
    if (activeItem) {
      setWorkNotes([
        {
          id: 1,
          author: isAudit
            ? (activeItem.leadAuditor || activeItem.owner || 'Lead Auditor')
            : isFinding
            ? (activeItem.assignedTo || activeItem.owner || 'Governance Specialist')
            : isTask
            ? (activeItem.assignedTo || 'Assigned Remediation Owner')
            : (activeItem.assignedTo || activeItem.owner || 'Lead Resolver'),
          role: isAudit ? 'Audit Lead' : isFinding ? 'Governance Lead' : isTask ? 'Remediation Assignee' : 'Resolver / Owner',
          text: isAudit
            ? `Audit methodology and evidence scope reviewed for ${activeItem.framework || 'Compliance Standards'}. Control attestation logs verified.`
            : isFinding
            ? `Finding logged under ${activeItem.processGroup || 'Process Group'}. Remediation workflow assigned to address control gap.`
            : isTask
            ? `Remediation action registered under finding ${activeItem.findingId || 'FND-0024'}. Execution milestone in progress.`
            : `Technical triage active on ${activeItem.application || 'SAP Environment'}. Telemetry and logs verified against baseline.`,
          timestamp: activeItem.conductedDate || activeItem.raisedOn || '2026-09-02',
        },
        {
          id: 2,
          author: 'AMS Governance Engine',
          role: 'System',
          text: isAudit || isFinding || isTask
            ? `Governance milestone registered in SteerCom Audit Registry under SLA governance controls.`
            : `Milestone logged in ITSM audit trail. SLA monitored under contract policy.`,
          timestamp: activeItem.conductedDate || activeItem.raisedOn || '2026-09-02',
        },
      ]);
    }
  }, [activeItem?.id, isAudit, isFinding, isTask]);

  // Lock body scroll and ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setWorkNotes([
      ...workNotes,
      {
        id: Date.now(),
        author: 'Current User (AMS Lead)',
        role: 'Governance Lead',
        text: newNote,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewNote('');
  };

  if (!isOpen || !activeItem) return null;

  const titleText = isFinding
    ? (liveFinding?.shortDescription || liveFinding?.title)
    : isTask
    ? (liveTask?.taskDescription || liveTask?.description)
    : (activeItem.shortDescription || activeItem.title || activeItem.action || activeItem.name || 'Record Detail');

  // Configure tab list
  let tabConfig = [];
  if (isAudit) {
    tabConfig = [
      { key: 'overview', label: 'Audit Summary & Scope', icon: FileText },
      { key: 'findings', label: 'Linked Findings & CAPA', icon: CheckSquare, count: linkedFindings.length },
      { key: 'notes', label: 'Audit Notes', icon: MessageSquare, count: workNotes.length },
      { key: 'history', label: 'Attestation History', icon: History },
    ];
  } else if (isFinding) {
    tabConfig = [
      { key: 'overview', label: 'Finding Summary & Remediation', icon: FileText },
      { key: 'notes', label: 'Audit Notes', icon: MessageSquare, count: workNotes.length },
      { key: 'history', label: 'Attestation Trail', icon: History },
    ];
  } else if (isTask) {
    tabConfig = [
      { key: 'overview', label: 'Task Detail & Lineage', icon: FileText },
      { key: 'notes', label: 'Work Notes', icon: MessageSquare, count: workNotes.length },
      { key: 'history', label: 'Audit Trail', icon: History },
    ];
  } else {
    tabConfig = [
      { key: 'overview', label: 'Overview', icon: FileText },
      {
        key: 'relationships',
        label: isProblem ? 'Incident → Problem → RCA → CTA' : 'Relationships & Lineage',
        icon: LinkIcon,
      },
      { key: 'sla', label: 'SLA & Lifecycle', icon: Clock },
      { key: 'notes', label: 'Work Notes', icon: MessageSquare, count: workNotes.length },
      { key: 'history', label: 'Audit Trail', icon: History },
    ];
  }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="record-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '86vh',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalScaleIn 0.2s ease-out',
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
          }}
        >
          {/* Breadcrumb back button when history stack has entries */}
          {historyStack.length > 0 && (
            <button
              type="button"
              onClick={navigateBack}
              className="btn btn-ghost btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                padding: '4px 10px',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-secondary)',
              }}
            >
              <ChevronLeft size={13} />
              <span>Back to {historyStack[historyStack.length - 1].item.id}</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 800,
                  color: 'var(--edge-primary, #FF5622)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: 'rgba(255, 86, 34, 0.08)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 86, 34, 0.2)',
                }}
              >
                {activeItem.id}
              </span>

              {isFinding ? (
                <>
                  <PriorityBadge priority={liveFinding.impactCategory || liveFinding.severity} size="sm" />
                  <StatusBadge status={liveFinding.complianceStatus || liveFinding.status} size="sm" />
                  <span className="badge badge-neutral" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {liveFinding.businessDomain || 'Cross-Domain'}
                  </span>
                </>
              ) : isTask ? (
                <>
                  <StatusBadge status={getDerivedTaskStatus(liveTask)} size="sm" />
                  <span className="badge badge-neutral" style={{ fontSize: '11px', fontWeight: 600 }}>
                    Remediation Task
                  </span>
                </>
              ) : (
                <>
                  {activeItem.priority && <PriorityBadge priority={activeItem.priority} size="sm" />}
                  {activeItem.status && <StatusBadge status={activeItem.status} size="sm" />}
                  {activeItem.complianceStatus && <StatusBadge status={activeItem.complianceStatus} size="sm" />}
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '6px',
                borderRadius: '50%',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>
          </div>

          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {titleText}
          </h2>

          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {isFinding ? (
              <>
                <span>Process Group: <strong style={{ color: 'var(--text-primary)' }}>{liveFinding.processGroup}</strong></span>
                <span>Assigned To: <strong style={{ color: 'var(--text-primary)' }}>{liveFinding.assignedTo || liveFinding.owner}</strong></span>
                <span>Target Date: <strong style={{ color: 'var(--text-primary)' }}>{liveFinding.targetDate || liveFinding.dueDate}</strong></span>
              </>
            ) : isTask ? (
              <>
                <span>Raised By: <strong style={{ color: 'var(--text-primary)' }}>{liveTask.raisedBy || 'Governance Manager'}</strong></span>
                <span>Assigned To: <strong style={{ color: 'var(--text-primary)' }}>{liveTask.assignedTo || 'AMS Service Manager'}</strong></span>
                <span>Target Date: <strong style={{ color: 'var(--text-primary)' }}>{liveTask.targetDate}</strong></span>
              </>
            ) : (
              <>
                {activeItem.entity && <span>Entity: <strong style={{ color: 'var(--text-primary)' }}>{activeItem.entity}</strong></span>}
                {activeItem.businessDomain && <span>Domain: <strong style={{ color: 'var(--text-primary)' }}>{activeItem.businessDomain}</strong></span>}
                {activeItem.framework && <span>Framework: <strong style={{ color: 'var(--text-primary)' }}>{activeItem.framework}</strong></span>}
                {activeItem.leadAuditor && <span>Lead Auditor: <strong style={{ color: 'var(--text-primary)' }}>{activeItem.leadAuditor}</strong></span>}
              </>
            )}
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)',
            padding: '0 24px',
            background: 'var(--bg-card)',
            overflowX: 'auto',
          }}
        >
          {tabConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--edge-primary, #FF5622)' : '2px solid transparent',
                  color: isActive ? 'var(--edge-primary, #FF5622)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: '10px',
                      background: 'var(--bg-secondary)',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-secondary)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── MODAL BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* ============================================================ */}
          {/* 1. FINDING DETAIL VIEW (Section 8) */}
          {/* ============================================================ */}
          {isFinding && activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* FINDING SUMMARY */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Finding Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Finding ID</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--edge-primary, #FF5622)' }}>{liveFinding.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Impact Category</div>
                    <div><PriorityBadge priority={liveFinding.impactCategory || liveFinding.severity} size="sm" /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Business Domain</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveFinding.businessDomain || 'Cross-Domain'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Process Group</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveFinding.processGroup || 'Service Management'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Assigned To</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveFinding.assignedTo || liveFinding.owner}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Target Date</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveFinding.targetDate || liveFinding.dueDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Compliance Status</div>
                    <div><StatusBadge status={liveFinding.complianceStatus || liveFinding.status} size="sm" /></div>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Short Description
                </h4>
                <div style={{ background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {liveFinding.shortDescription || liveFinding.title}
                </div>
              </div>

              {/* RELATED AUDIT */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Related Audit
                </h4>
                <div style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Audit ID</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--edge-primary, #FF5622)' }}>
                        {liveFinding.auditId || 'AUD-0008'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Audit Name</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {relatedAudit?.title || relatedAudit?.auditName || 'Service Operations SLA Governance Review'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Audit Status</div>
                      <StatusBadge status={relatedAudit?.status || 'Completed'} size="sm" />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Compliance Status</div>
                      <StatusBadge status={relatedAudit?.complianceStatus || 'Requires Remediation'} size="sm" />
                    </div>
                  </div>

                  {relatedAudit && (
                    <button
                      type="button"
                      onClick={() => navigateToItem(relatedAudit, 'audit')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Open Audit</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* REMEDIATION TASKS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    Remediation Tasks ({findingTasks.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsCreateTaskModalOpen(true)}
                    className="btn btn-primary btn-sm"
                    style={{
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'var(--edge-primary, #FF5622)',
                      borderColor: 'var(--edge-primary, #FF5622)',
                      color: '#FFFFFF',
                    }}
                  >
                    <Plus size={13} />
                    <span>Create Remediation Task</span>
                  </button>
                </div>

                {findingTasks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {findingTasks.map((task) => {
                      const derived = getDerivedTaskStatus(task);
                      return (
                        <div
                          key={task.id}
                          onClick={() => navigateToItem(task, 'task')}
                          style={{
                            background: 'var(--bg-secondary)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--edge-primary, #FF5622)' }}>
                              {task.id}
                            </span>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                              {task.taskDescription || task.description}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                              {task.assignedTo} • Due {task.targetDate}
                            </span>
                            <StatusBadge status={derived} size="sm" />
                            <ArrowRight size={13} style={{ color: 'var(--text-tertiary)' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Section 15: Exact empty state handling without placeholders */
                  <div
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-primary)',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    No remediation tasks have been raised.
                  </div>
                )}
              </div>

              {/* Section 7 Evidence / Validation & Closure */}
              {findingTasks.length > 0 && findingTasks.every((t) => t.status === 'Completed') && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={15} />
                      <span>All Remediation Tasks Completed</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Assigned work execution completed. Control gap awaiting governance validation and evidence attestation before finding closure.
                    </p>
                  </div>

                  {liveFinding.complianceStatus !== 'Remediated' && liveFinding.complianceStatus !== 'Closed' && (
                    <button
                      type="button"
                      onClick={() => validateAndCloseFinding(liveFinding.id, 'Lead Auditor')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '11px', background: '#10B981', borderColor: '#10B981', color: '#FFFFFF' }}
                    >
                      <span>Attest Evidence & Close Finding</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. TASK DETAIL VIEW (Section 6 & 7) */}
          {/* ============================================================ */}
          {isTask && activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* TASK SUMMARY */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Task Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Task ID</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--edge-primary, #FF5622)' }}>{liveTask.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Status</div>
                    <div><StatusBadge status={getDerivedTaskStatus(liveTask)} size="sm" /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Raised On</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveTask.raisedOn || '2026-09-02'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Raised By</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{liveTask.raisedBy || 'Governance Manager'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Assigned To</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{liveTask.assignedTo || 'AMS Service Manager'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Target Date</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveTask.targetDate}</div>
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Task Description
                </h4>
                <div style={{ background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {liveTask.taskDescription || liveTask.description}
                </div>
              </div>

              {/* Interactive Status Transition Buttons */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Update Task Status
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['Not Started', 'In Progress', 'Blocked', 'Completed'].map((st) => {
                    const isSelected = liveTask.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateTaskStatus(liveTask.id, st)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        style={{
                          fontSize: '11px',
                          padding: '5px 12px',
                          background: isSelected && st === 'Completed' ? '#10B981' : undefined,
                          borderColor: isSelected && st === 'Completed' ? '#10B981' : undefined,
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 7 Governance Note */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <strong>Governance Rule (Section 7):</strong> Marking a task Completed indicates the assigned remediation work was completed.
                The related Finding remains Open / Pending Verification until validation and evidence attestation are formally performed.
              </div>

              {/* TRACEABILITY: Related Finding & Related Audit */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Traceability
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Related Finding */}
                  <div style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Related Finding</div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{liveTask.findingId || 'FND-0024'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', flex: 1 }}>
                      {relatedFinding?.shortDescription || relatedFinding?.title || 'SLA governance control failure for critical incidents'}
                    </div>
                    {relatedFinding && (
                      <button
                        type="button"
                        onClick={() => navigateToItem(relatedFinding, 'finding')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}
                      >
                        <span>Open Finding</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* Related Audit */}
                  <div style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Related Audit</div>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary, #FF5622)' }}>{liveTask.auditId || 'AUD-0008'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', flex: 1 }}>
                      {relatedAudit?.title || relatedAudit?.auditName || 'Service Operations SLA Governance Review'}
                    </div>
                    {relatedAudit && (
                      <button
                        type="button"
                        onClick={() => navigateToItem(relatedAudit, 'audit')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}
                      >
                        <span>Open Audit</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. AUDIT DETAIL VIEW (Section 9) */}
          {/* ============================================================ */}
          {isAudit && activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* AUDIT SUMMARY */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Audit Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Audit ID</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--edge-primary, #FF5622)' }}>{liveAudit.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Audit Type</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveAudit.type || 'Internal'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Framework / Standard</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveAudit.framework || 'Operational Governance'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Business Domain</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveAudit.businessDomain || 'Cross-Domain'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Lead Auditor</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{liveAudit.leadAuditor || liveAudit.owner || 'Auditor'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Audit Status</div>
                    <div><StatusBadge status={liveAudit.status || liveAudit.auditStatus} size="sm" /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Compliance Status</div>
                    <div><StatusBadge status={liveAudit.complianceStatus} size="sm" /></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Compliance Score</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: liveAudit.complianceScoreNum >= 95 ? '#10B981' : liveAudit.complianceScoreNum >= 90 ? '#F59E0B' : liveAudit.score === 'N/A' ? 'var(--text-tertiary)' : '#EF4444' }}>
                      {liveAudit.score || liveAudit.complianceScore || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope & Objectives */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Audit Scope & Objectives
                </h4>
                <div style={{ background: 'var(--bg-primary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Objective:</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {liveAudit.objective || 'Formal assessment of control operating effectiveness and compliance with regulatory policies.'}
                    </div>
                  </div>
                  {liveAudit.systemsCovered && (
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 2 }}>Systems & Environments Covered:</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveAudit.systemsCovered}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Audit Timeline & Review Schedule
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Planned Start</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveAudit.plannedStart || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Planned End</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{liveAudit.plannedEnd || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Date Conducted</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: liveAudit.conductedDate ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: 500 }}>
                      {liveAudit.conductedDate || 'Not Started'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT-SPECIFIC TAB 2: FINDINGS (Section 9) */}
          {isAudit && activeTab === 'findings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Corrective and Preventive Action (CAPA) non-conformances registered against audit {liveAudit.id}.
              </div>

              {linkedFindings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {linkedFindings.map((f) => {
                    const fTasks = getTasksForFinding(f.id);
                    const completedTasks = fTasks.filter((t) => t.status === 'Completed').length;
                    const openTasks = fTasks.length - completedTasks;

                    return (
                      <div
                        key={f.id}
                        style={{
                          background: 'var(--bg-secondary)',
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-primary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--edge-primary, #FF5622)' }}>
                              {f.id}
                            </span>
                            <PriorityBadge priority={f.severity || f.impactCategory} size="sm" />
                            <StatusBadge status={f.complianceStatus || f.status} size="sm" />
                          </div>

                          {/* Section 9: Remediation tasks breakdown */}
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{fTasks.length}</strong> remediation tasks
                            {' • '}
                            <span style={{ color: '#10B981' }}>{completedTasks} completed</span>
                            {' • '}
                            <span style={{ color: openTasks > 0 ? '#F59E0B' : 'var(--text-tertiary)' }}>{openTasks} open</span>
                          </div>
                        </div>

                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {f.shortDescription || f.title}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-secondary)', paddingTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            Assigned To: <strong style={{ color: 'var(--text-primary)' }}>{f.assignedTo || f.owner}</strong> • Due: {f.targetDate || f.dueDate}
                          </div>

                          {/* Drill-down action creates Audit → Finding → Tasks */}
                          <button
                            type="button"
                            onClick={() => navigateToItem(f, 'finding')}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span>Open Finding Detail</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                  {liveAudit.status === 'Planned'
                    ? 'No Findings — Audit is in Planned status and not yet executed.'
                    : 'No Open Findings — All audited controls fully compliant with zero non-conformances.'}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. GENERIC ITSM RECORD OVERVIEW (Incidents, SRs, Problems, etc.) */}
          {/* ============================================================ */}
          {!isAudit && !isFinding && !isTask && activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  background: 'var(--bg-secondary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Application</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeItem.application || 'SAP S/4HANA Core'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Assigned Resolver / Lead</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeItem.assignedTo || activeItem.owner || activeItem.leadDeveloper || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Resolver Tier & Group</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {activeItem.resolverTier || 'Tier 2 (Core AMS)'} • {activeItem.resolverGroup || 'SAP Support'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '3px' }}>Target Date / SLA</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {activeItem.targetDate || activeItem.dueDate || '2026-09-15'}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Technical Scope & Symptoms
                </h4>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', lineHeight: 1.6, background: 'var(--bg-primary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                  {activeItem.fullDescription || activeItem.description || activeItem.shortDescription || 'Operational ticket registered in ManageEngine ITSM.'}
                </div>
              </div>
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a work note or governance attestation..."
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Send size={13} />
                  <span>Post</span>
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workNotes.map((note) => (
                  <div key={note.id} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{note.author}</span>
                        <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{note.role}</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{note.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{note.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Chronological attestation audit trail</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid var(--border-primary)', paddingLeft: '14px', marginLeft: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>Record Registered</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>2026-09-02 • SteerCom Governance Registry</div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>Milestone Attestation Verified</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>2026-09-04 • Automated Control Monitor</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            Close
          </button>
        </div>
      </div>

      {/* Centered Create Remediation Task Modal (Section 4) */}
      <CreateRemediationTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        finding={liveFinding}
        audit={relatedAudit}
        onTaskCreated={(newTask) => {
          // If viewing this finding, task is immediately reactive via governanceStore
        }}
      />
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
