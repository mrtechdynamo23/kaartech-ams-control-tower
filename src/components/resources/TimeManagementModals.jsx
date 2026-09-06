/**
 * EDGE AMS Control Tower — Time Management Enterprise Modals
 * 
 * Centered modal dialogues adhering to EDGE Design System:
 * 1. ApplyLeaveModal: Resource Master binding, auto working days, backup conflict check
 * 2. ApprovalsModal: Operational approval workspace with live Approve/Reject actions
 * 3. LeaveDetailModal: Full request details, Availability Impact, and Workflow Progress Lineage
 * 4. RemoteWorkModal: Apply Remote Work (distinct from Leave)
 * 5. TimesheetEntryModal: Weekly grid with RUN/CHANGE split and auto-populated approved leave
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Check, AlertTriangle, Calendar, Clock, User, Shield, Briefcase,
  MapPin, CheckCircle2, ArrowRight, HelpCircle, FileText, Send, XCircle, Info
} from 'lucide-react';
import { RESOURCES } from '../../data/demoData';
import {
  calculateWorkingDays,
  checkBackupConflict,
  applyLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  applyRemoteWork,
  getTimesheetWeeklyData,
  isResourceAvailable
} from '../../data/timeManagementStore';

// ═══════════════════════════════════════════════════
// MODAL 1: APPLY LEAVE MODAL
// ═══════════════════════════════════════════════════
export function ApplyLeaveModal({ isOpen, onClose, onSuccess }) {
  const [selectedResourceId, setSelectedResourceId] = useState(RESOURCES[0]?.id || 'RES-001');
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('2026-09-14');
  const [endDate, setEndDate] = useState('2026-09-16');
  const [reason, setReason] = useState('');
  const [backupResourceId, setBackupResourceId] = useState(RESOURCES[1]?.id || 'RES-002');
  const [errorBanner, setErrorBanner] = useState('');

  const selectedResource = useMemo(() => {
    return RESOURCES.find(r => r.id === selectedResourceId) || RESOURCES[0];
  }, [selectedResourceId]);

  const reportingManager = useMemo(() => {
    if (!selectedResource.reportingManager) return 'Fatima Al Zaabi';
    const mgr = RESOURCES.find(r => r.id === selectedResource.reportingManager);
    return mgr ? mgr.name : 'Fatima Al Zaabi';
  }, [selectedResource]);

  // Working days auto-calculation
  const calculatedDays = useMemo(() => {
    return calculateWorkingDays(startDate, endDate);
  }, [startDate, endDate]);

  // Backup conflict detection
  const conflictInfo = useMemo(() => {
    return checkBackupConflict(selectedResourceId, backupResourceId, startDate, endDate);
  }, [selectedResourceId, backupResourceId, startDate, endDate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorBanner('');

    if (new Date(endDate) < new Date(startDate)) {
      setErrorBanner('End Date cannot be earlier than Start Date.');
      return;
    }

    if (calculatedDays <= 0) {
      setErrorBanner('Selected date range contains 0 working days (falls entirely on weekends).');
      return;
    }

    if (conflictInfo?.hasConflict) {
      setErrorBanner(conflictInfo.message);
      return;
    }

    try {
      const newRec = applyLeave({
        resourceId: selectedResourceId,
        leaveType,
        startDate,
        endDate,
        reason: reason.trim() || 'Annual operational leave request.',
        backupResourceId,
      });
      onSuccess?.(newRec);
      onClose();
    } catch (err) {
      setErrorBanner(err.message || 'Error submitting leave request.');
    }
  };

  return (
    <div className="edge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edge-modal-card animate-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="edge-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary" style={{ fontSize: '10px' }}>AMS Operations</span>
              <h2 className="edge-modal-title">Apply Leave</h2>
            </div>
            <p className="edge-modal-subtitle">Submit operational leave with automated calendar and backup validation.</p>
          </div>
          <button type="button" className="edge-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="edge-modal-body" style={{ maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
            {errorBanner && (
              <div className="edge-alert edge-alert-danger" style={{ marginBottom: '16px' }}>
                <AlertTriangle size={16} />
                <span>{errorBanner}</span>
              </div>
            )}

            {/* 1. Resource Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Resource <span style={{ color: 'var(--edge-primary)' }}>*</span>
              </label>
              <select
                value={selectedResourceId}
                onChange={e => {
                  const newId = e.target.value;
                  setSelectedResourceId(newId);
                  // Ensure backup is not self
                  if (backupResourceId === newId) {
                    const other = RESOURCES.find(r => r.id !== newId);
                    if (other) setBackupResourceId(other.id);
                  }
                }}
                className="edge-form-input"
                style={{
                  width: '100%',
                  height: '38px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '0 12px',
                  fontSize: '13px',
                }}
              >
                {RESOURCES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.role || 'Consultant'} ({r.businessDomain} • {r.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Derived Resource Info Card */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '16px',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Business Domain</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedResource.businessDomain}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Process Group</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedResource.processGroup || 'AMS Operations'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Location / Track</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedResource.location} ({selectedResource.track})</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Reporting Manager</span>
                <strong style={{ color: 'var(--text-primary)' }}>{reportingManager}</strong>
              </div>
            </div>

            {/* 2. Leave Type */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Leave Type <span style={{ color: 'var(--edge-primary)' }}>*</span>
              </label>
              <select
                value={leaveType}
                onChange={e => setLeaveType(e.target.value)}
                className="edge-form-input"
                style={{
                  width: '100%',
                  height: '38px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '0 12px',
                  fontSize: '13px',
                }}
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Training Leave">Training Leave</option>
                <option value="Exam / Certification">Exam / Certification</option>
              </select>
            </div>

            {/* 3. Dates & Working Days */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Start Date <span style={{ color: 'var(--edge-primary)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="edge-form-input"
                  style={{
                    width: '100%',
                    height: '38px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '0 10px',
                    fontSize: '13px',
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  End Date <span style={{ color: 'var(--edge-primary)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="edge-form-input"
                  style={{
                    width: '100%',
                    height: '38px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '0 10px',
                    fontSize: '13px',
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Working Days
                </label>
                <div style={{
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: calculatedDays > 0 ? 'var(--text-primary)' : 'var(--color-amber)',
                }}>
                  {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>

            {/* 4. Reason */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Operational Handover / Reason <span style={{ color: 'var(--edge-primary)' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain the purpose of leave and critical queue handover notes..."
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '10px 12px',
                  fontSize: '13px',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            {/* 5. Backup Resource */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Backup Resource (from Resource Master) <span style={{ color: 'var(--edge-primary)' }}>*</span>
              </label>
              <select
                value={backupResourceId}
                onChange={e => setBackupResourceId(e.target.value)}
                className="edge-form-input"
                style={{
                  width: '100%',
                  height: '38px',
                  background: 'var(--bg-secondary)',
                  border: conflictInfo?.hasConflict ? '1px solid var(--color-amber)' : '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '0 12px',
                  fontSize: '13px',
                }}
              >
                {RESOURCES.filter(r => r.id !== selectedResourceId).map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.role || 'Consultant'} ({r.businessDomain} • {r.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Backup Conflict Warning if detected */}
            {conflictInfo?.hasConflict && (
              <div style={{
                background: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                color: '#F59E0B',
                fontSize: '12px',
                lineHeight: 1.4,
              }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>BACKUP AVAILABILITY CONFLICT</strong>
                  <span>{conflictInfo.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="edge-modal-footer" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '14px 20px',
            borderTop: '1px solid var(--border-secondary)',
            background: 'var(--bg-card)'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={conflictInfo?.hasConflict || calculatedDays <= 0}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                background: 'var(--edge-primary)',
                borderColor: 'var(--edge-primary)',
                color: '#FFFFFF',
                opacity: conflictInfo?.hasConflict || calculatedDays <= 0 ? 0.5 : 1,
                cursor: conflictInfo?.hasConflict || calculatedDays <= 0 ? 'not-allowed' : 'pointer',
              }}
            >
              + Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MODAL 2: APPROVALS WORKSPACE MODAL
// ═══════════════════════════════════════════════════
export function ApprovalsModal({ isOpen, onClose, pendingLeaves = [], onActionSuccess }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Operational coverage requirement.');
  const [feedbackBanner, setFeedbackBanner] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApprove = (leaveId) => {
    try {
      approveLeave(leaveId, 'Fatima Al Zaabi', 'Approved per AMS operational staffing review.');
      setFeedbackBanner({ type: 'success', text: `Leave request ${leaveId} approved successfully.` });
      onActionSuccess?.();
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setFeedbackBanner({ type: 'danger', text: err.message || 'Failed to approve leave request.' });
    }
  };

  const handleRejectConfirm = (leaveId) => {
    if (!rejectionReason.trim()) return;
    try {
      rejectLeave(leaveId, 'Fatima Al Zaabi', rejectionReason.trim());
      setFeedbackBanner({ type: 'success', text: `Leave request ${leaveId} rejected.` });
      setRejectingId(null);
      setRejectionReason('Operational coverage requirement.');
      onActionSuccess?.();
      setTimeout(() => setFeedbackBanner(null), 3000);
    } catch (err) {
      setFeedbackBanner({ type: 'danger', text: err.message || 'Failed to reject leave request.' });
    }
  };

  return (
    <div className="edge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edge-modal-card animate-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px', width: '92vw' }}>
        {/* Header */}
        <div className="edge-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-warning" style={{ fontSize: '10px' }}>
                {pendingLeaves.length} Pending
              </span>
              <h2 className="edge-modal-title">Operational Approvals Workspace</h2>
            </div>
            <p className="edge-modal-subtitle">Review, validate backup feasibility, and approve or reject pending leave requests.</p>
          </div>
          <button type="button" className="edge-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="edge-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
          {feedbackBanner && (
            <div className={`edge-alert edge-alert-${feedbackBanner.type}`} style={{ marginBottom: '16px' }}>
              {feedbackBanner.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedbackBanner.text}</span>
            </div>
          )}

          {pendingLeaves.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              color: 'var(--text-tertiary)',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-secondary)',
            }}>
              <CheckCircle2 size={36} color="var(--color-emerald)" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>No pending approvals</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>All submitted leave requests have been reviewed and decided.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingLeaves.map(r => (
                <div
                  key={r.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: r.backupConflict ? '1px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                          {r.id}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>{r.leaveType}</span>
                        <span className="badge badge-warning" style={{ fontSize: '11px' }}>Pending Approval</span>
                        {r.backupConflict && (
                          <span className="badge badge-danger" style={{ fontSize: '10px' }}>Conflict Alert</span>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {r.resourceName} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)' }}>• {r.role} ({r.businessDomain})</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '12px' }}>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        <strong>{r.startDate}</strong> to <strong>{r.endDate}</strong>
                      </div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '2px' }}>
                        {r.days} working {r.days === 1 ? 'day' : 'days'} • Submitted {r.submittedDate}
                      </div>
                    </div>
                  </div>

                  {/* Context & Reason */}
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-primary)',
                  }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Reason: </strong> {r.reason}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Assigned Backup: </strong>
                      <span style={{ color: 'var(--edge-primary)', fontWeight: 600 }}>{r.backupResourceName}</span>
                      {r.backupResourceDomain && ` (${r.backupResourceDomain})`}
                    </div>
                  </div>

                  {/* Conflict Notice if present */}
                  {r.backupConflict && (
                    <div style={{
                      background: 'rgba(217, 119, 6, 0.08)',
                      border: '1px solid rgba(217, 119, 6, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#F59E0B',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                      <span>{r.backupConflictDetails || 'Backup resource is unavailable during this leave period.'}</span>
                    </div>
                  )}

                  {/* Inline Rejection Reason prompt */}
                  {rejectingId === r.id ? (
                    <div style={{
                      background: 'rgba(220, 38, 38, 0.05)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '4px',
                    }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-red)', display: 'block', marginBottom: '4px' }}>
                        REJECTION REASON (MANDATORY):
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="e.g. Operational coverage requirement..."
                        style={{
                          width: '100%',
                          height: '34px',
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-primary)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-primary)',
                          padding: '0 10px',
                          fontSize: '12px',
                          marginBottom: '8px',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setRejectingId(null)}
                          style={{ padding: '4px 12px', fontSize: '11px' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleRejectConfirm(r.id)}
                          style={{ padding: '4px 14px', fontSize: '11px', background: 'var(--color-red)', color: '#fff' }}
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Action Buttons */
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setRejectingId(r.id)}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          color: 'var(--color-red)',
                          borderColor: 'rgba(220, 38, 38, 0.3)',
                        }}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleApprove(r.id)}
                        style={{
                          padding: '6px 16px',
                          fontSize: '12px',
                          background: 'var(--color-emerald)',
                          borderColor: 'var(--color-emerald)',
                          color: '#FFFFFF',
                        }}
                      >
                        Approve Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="edge-modal-footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 20px',
          borderTop: '1px solid var(--border-secondary)',
          background: 'var(--bg-card)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 18px', fontSize: '13px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MODAL 3: LEAVE DETAIL MODAL
// ═══════════════════════════════════════════════════
export function LeaveDetailModal({ isOpen, leave, onClose, onActionSuccess }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Operational coverage requirement.');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !leave) return null;

  const handleApprove = () => {
    try {
      approveLeave(leave.id, 'Fatima Al Zaabi', 'Approved per AMS operational review.');
      setFeedback({ type: 'success', text: `Leave request ${leave.id} approved.` });
      onActionSuccess?.();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message });
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    try {
      rejectLeave(leave.id, 'Fatima Al Zaabi', rejectionReason.trim());
      setFeedback({ type: 'success', text: `Leave request ${leave.id} rejected.` });
      onActionSuccess?.();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message });
    }
  };

  const handleCancel = () => {
    try {
      cancelLeave(leave.id, 'Cancelled by user from operational workspace.');
      setFeedback({ type: 'success', text: `Leave request ${leave.id} cancelled.` });
      onActionSuccess?.();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setFeedback({ type: 'danger', text: err.message });
    }
  };

  const statusBadgeClass = leave.status === 'Approved'
    ? 'badge-success'
    : leave.status === 'Pending Approval'
    ? 'badge-warning'
    : leave.status === 'Rejected'
    ? 'badge-danger'
    : 'badge-neutral';

  return (
    <div className="edge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edge-modal-card animate-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div className="edge-modal-header" style={{
          borderTop: leave.status === 'Approved' ? '4px solid var(--color-emerald)' : leave.status === 'Pending Approval' ? '4px solid var(--color-amber)' : '4px solid var(--border-secondary)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                {leave.id}
              </span>
              <span className={`badge ${statusBadgeClass}`}>{leave.status}</span>
              <span className="badge badge-neutral">{leave.leaveType}</span>
            </div>
            <h2 className="edge-modal-title">{leave.resourceName}</h2>
          </div>
          <button type="button" className="edge-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="edge-modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {feedback && (
            <div className={`edge-alert edge-alert-${feedback.type}`}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Section 1: Leave Request Context */}
          <div>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
              Leave Request Details
            </h4>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              fontSize: '12px',
            }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Resource Name</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.resourceName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Business Domain</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.businessDomain}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Process Group</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.processGroup || 'AMS Operations'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Location</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.location}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Leave Period</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.startDate} to {leave.endDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Number of Days</span>
                <strong style={{ color: 'var(--edge-primary)' }}>{leave.days} working {leave.days === 1 ? 'day' : 'days'}</strong>
              </div>
              <div style={{ gridColumn: 'span 3' }}>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Reason</span>
                <span style={{ color: 'var(--text-secondary)' }}>{leave.reason}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Submitted Date</span>
                <span style={{ color: 'var(--text-secondary)' }}>{leave.submittedDate}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Approver</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.approver}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Assigned Backup</span>
                <strong style={{ color: 'var(--edge-primary)' }}>{leave.backupResourceName}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Availability Impact */}
          <div>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
              Availability Impact
            </h4>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              fontSize: '12px',
            }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Resource Availability</span>
                <span style={{
                  fontWeight: 600,
                  color: leave.status === 'Approved' ? 'var(--color-amber)' : 'var(--text-primary)'
                }}>
                  {leave.status === 'Approved' ? `Unavailable: ${leave.startDate} to ${leave.endDate}` : 'Active (Pending Decision)'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Nominated Backup</span>
                <strong style={{ color: 'var(--text-primary)' }}>{leave.backupResourceName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '11px' }}>Coverage Assessment</span>
                <span style={{
                  color: leave.backupConflict ? 'var(--color-red)' : 'var(--color-emerald)',
                  fontWeight: 600,
                }}>
                  {leave.backupConflict ? 'Conflict Detected' : 'Fully Covered'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Workflow Progress */}
          <div>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
              Workflow Lineage
            </h4>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {leave.workflow ? (
                  leave.workflow.map((st, idx) => {
                    const isDone = st.status === 'Completed';
                    const isActive = st.status === 'Active';
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isDone ? 'var(--color-emerald)' : isActive ? 'var(--color-amber)' : 'var(--bg-primary)',
                          border: isDone || isActive ? 'none' : '1px solid var(--border-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isDone || isActive ? '#fff' : 'var(--text-tertiary)',
                          fontSize: '11px',
                          marginBottom: '6px',
                        }}>
                          {isDone ? <Check size={13} /> : idx + 1}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: isActive || isDone ? 600 : 400, color: isActive ? 'var(--color-amber)' : isDone ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                          {st.step}
                        </span>
                        {st.date && (
                          <span style={{ fontSize: '9px', color: 'var(--text-tertiary)' }}>{st.date}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Standard lifecycle: Submitted → Pending Approval → Approved
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Prompt if toggled */}
          {isRejecting && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.05)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
            }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-red)', display: 'block', marginBottom: '6px' }}>
                REJECTION REASON (MANDATORY)
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Specify the operational ground for rejection..."
                style={{
                  width: '100%',
                  height: '36px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  padding: '0 10px',
                  fontSize: '12px',
                  marginBottom: '10px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsRejecting(false)} style={{ padding: '4px 12px', fontSize: '12px' }}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleReject} style={{ padding: '4px 14px', fontSize: '12px', background: 'var(--color-red)', color: '#fff' }}>
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="edge-modal-footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid var(--border-secondary)',
          background: 'var(--bg-card)'
        }}>
          <div>
            {leave.status === 'Approved' && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}
              >
                Cancel Leave Request
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '6px 16px', fontSize: '13px' }}>
              Close
            </button>
            {leave.status === 'Pending Approval' && !isRejecting && (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsRejecting(true)}
                  style={{ padding: '6px 14px', fontSize: '12px', color: 'var(--color-red)' }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleApprove}
                  style={{
                    padding: '6px 18px',
                    fontSize: '12px',
                    background: 'var(--color-emerald)',
                    borderColor: 'var(--color-emerald)',
                    color: '#fff'
                  }}
                >
                  Approve Leave
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MODAL 4: REMOTE WORK MODAL
// ═══════════════════════════════════════════════════
export function RemoteWorkModal({ isOpen, onClose, onSuccess }) {
  const [selectedResourceId, setSelectedResourceId] = useState(RESOURCES[0]?.id || 'RES-001');
  const [date, setDate] = useState('2026-09-08');
  const [location, setLocation] = useState('Remote (Abu Dhabi Residence)');
  const [reason, setReason] = useState('Operational remote alignment and night shift prep.');
  const [errorBanner, setErrorBanner] = useState('');

  const selectedResource = useMemo(() => {
    return RESOURCES.find(r => r.id === selectedResourceId) || RESOURCES[0];
  }, [selectedResourceId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const rec = applyRemoteWork({
        resourceId: selectedResourceId,
        date,
        location,
        reason,
      });
      onSuccess?.(rec);
      onClose();
    } catch (err) {
      setErrorBanner(err.message || 'Error submitting remote work request.');
    }
  };

  return (
    <div className="edge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edge-modal-card animate-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="edge-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>Remote Working Protocol</span>
              <h2 className="edge-modal-title">Apply Remote Work (Onsite)</h2>
            </div>
            <p className="edge-modal-subtitle">Log approved operational remote working without creating a leave record.</p>
          </div>
          <button type="button" className="edge-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edge-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {errorBanner && (
              <div className="edge-alert edge-alert-danger">
                <AlertTriangle size={16} />
                <span>{errorBanner}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Resource
              </label>
              <select
                value={selectedResourceId}
                onChange={e => setSelectedResourceId(e.target.value)}
                className="edge-form-input"
                style={{
                  width: '100%',
                  height: '38px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '0 12px',
                  fontSize: '13px',
                }}
              >
                {RESOURCES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.role} ({r.businessDomain} • {r.location})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '0 10px',
                    fontSize: '13px',
                  }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Remote Hub / Location
                </label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    height: '38px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    padding: '0 10px',
                    fontSize: '13px',
                  }}
                >
                  <option value="Remote (Abu Dhabi Residence)">Remote (Abu Dhabi Residence)</option>
                  <option value="Remote (Dubai Tech Hub)">Remote (Dubai Tech Hub)</option>
                  <option value="Offshore Dedicated Lab">Offshore Dedicated Lab</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Operational Justification
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '10px 12px',
                  fontSize: '13px',
                }}
                required
              />
            </div>
          </div>

          <div className="edge-modal-footer" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            padding: '12px 20px',
            borderTop: '1px solid var(--border-secondary)',
            background: 'var(--bg-card)'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 16px', fontSize: '13px' }}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                background: 'var(--edge-primary)',
                borderColor: 'var(--edge-primary)',
                color: '#fff',
              }}
            >
              Submit Remote Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MODAL 5: TIMESHEET ENTRY MODAL
// ═══════════════════════════════════════════════════
export function TimesheetEntryModal({ isOpen, onClose, defaultResourceId = 'RES-005' }) {
  const [selectedResourceId, setSelectedResourceId] = useState(defaultResourceId);
  const [weekStart, setWeekStart] = useState('2026-09-07');
  const [savedBanner, setSavedBanner] = useState(false);

  const timesheetData = useMemo(() => {
    return getTimesheetWeeklyData(selectedResourceId, weekStart);
  }, [selectedResourceId, weekStart]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate day totals
  const dayTotals = timesheetData.days.map(({ dateStr }) => {
    return timesheetData.entries.reduce((sum, entry) => {
      return sum + (Number(entry.hours[dateStr]) || 0);
    }, 0);
  });

  const grandTotal = dayTotals.reduce((a, b) => a + b, 0);
  const billableHours = grandTotal - timesheetData.totalLeaveHours;
  const billablePercent = grandTotal > 0 ? Math.round((billableHours / grandTotal) * 100) : 0;

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => {
      setSavedBanner(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="edge-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="edge-modal-card animate-scale-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px', width: '95vw' }}>
        <div className="edge-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary" style={{ fontSize: '10px' }}>RUN / CHANGE Allocation</span>
              <h2 className="edge-modal-title">Timesheet Entry & Leave Integration</h2>
            </div>
            <p className="edge-modal-subtitle">
              Weekly person-hour logging. Approved leave is automatically pre-populated from Time Management.
            </p>
          </div>
          <button type="button" className="edge-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="edge-modal-body" style={{ maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
          {savedBanner && (
            <div className="edge-alert edge-alert-success" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={16} />
              <span>Weekly timesheet submitted and locked for manager review.</span>
            </div>
          )}

          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
            background: 'var(--bg-secondary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-secondary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Consultant:</span>
              <select
                value={selectedResourceId}
                onChange={e => setSelectedResourceId(e.target.value)}
                style={{
                  height: '34px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  padding: '0 10px',
                  fontSize: '12px',
                }}
              >
                {RESOURCES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.businessDomain} • {r.track})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Operating Week:</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                Mon 07 Sep – Fri 11 Sep 2026
              </span>
            </div>
          </div>

          {/* Timesheet Auto-propagation Banner */}
          {timesheetData.hasApprovedLeave && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              fontSize: '12px',
              color: 'var(--color-emerald)'
            }}>
              <CheckCircle2 size={16} />
              <span>
                <strong>Approved Leave Detected:</strong> {timesheetData.totalLeaveHours}h of approved leave automatically booked on active dates. Manual leave entry is not required.
              </span>
            </div>
          )}

          {/* Weekly Grid Table */}
          <div style={{
            border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-secondary)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--text-secondary)' }}>Track / Task Description</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-secondary)', width: '80px' }}>Category</th>
                  {timesheetData.days.map((d, idx) => (
                    <th key={idx} style={{ textAlign: 'center', padding: '10px 6px', color: 'var(--text-primary)', width: '80px' }}>
                      <div style={{ fontWeight: 700 }}>{d.dayName}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{d.dayNumber} Sep</div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-primary)', width: '90px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {timesheetData.entries.map((entry, rIdx) => {
                  const rowSum = timesheetData.days.reduce((sum, d) => sum + (Number(entry.hours[d.dateStr]) || 0), 0);
                  const isLeaveRow = entry.isLeave;
                  return (
                    <tr
                      key={rIdx}
                      style={{
                        borderBottom: '1px solid var(--border-primary)',
                        background: isLeaveRow ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 600, color: isLeaveRow ? 'var(--color-emerald)' : 'var(--text-primary)' }}>
                          {entry.taskName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Track: {entry.track}</div>
                      </td>
                      <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                        <span className={`badge ${entry.category === 'RUN' ? 'badge-primary' : entry.category === 'CHANGE' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px' }}>
                          {entry.category}
                        </span>
                      </td>
                      {timesheetData.days.map((d, dIdx) => {
                        const val = entry.hours[d.dateStr];
                        return (
                          <td key={dIdx} style={{ textAlign: 'center', padding: '8px 6px' }}>
                            <div style={{
                              height: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: val > 0 ? (isLeaveRow ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)') : 'transparent',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: val > 0 ? 700 : 400,
                              color: val > 0 ? (isLeaveRow ? 'var(--color-emerald)' : 'var(--text-primary)') : 'var(--text-tertiary)',
                              border: isLeaveRow && val > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                            }}>
                              {val > 0 ? `${val}h` : '0'}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {rowSum}h
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-secondary)', borderTop: '2px solid var(--border-secondary)', fontWeight: 700 }}>
                  <td colSpan={2} style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                    Total Daily Person-Hours
                  </td>
                  {dayTotals.map((tot, idx) => (
                    <td key={idx} style={{ textAlign: 'center', padding: '10px 6px', color: tot === 8 ? 'var(--color-emerald)' : 'var(--text-primary)' }}>
                      {tot}h
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--edge-primary)', fontSize: '13px' }}>
                    {grandTotal}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Utilization Summary Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            fontSize: '12px',
          }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px', display: 'block' }}>Total Standard Capacity</span>
              <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>40.0h</strong>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px', display: 'block' }}>Operational RUN & CHANGE</span>
              <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{billableHours}.0h</strong>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px', display: 'block' }}>Approved Leave Allocated</span>
              <strong style={{ fontSize: '15px', color: 'var(--color-emerald)' }}>{timesheetData.totalLeaveHours}.0h</strong>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '11px', display: 'block' }}>Billable Utilization Ratio</span>
              <strong style={{ fontSize: '15px', color: 'var(--edge-primary)' }}>{billablePercent}%</strong>
            </div>
          </div>
        </div>

        <div className="edge-modal-footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          padding: '12px 20px',
          borderTop: '1px solid var(--border-secondary)',
          background: 'var(--bg-card)'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 16px', fontSize: '13px' }}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              background: 'var(--edge-primary)',
              borderColor: 'var(--edge-primary)',
              color: '#fff',
            }}
          >
            Submit Weekly Timesheet
          </button>
        </div>
      </div>
    </div>
  );
}
