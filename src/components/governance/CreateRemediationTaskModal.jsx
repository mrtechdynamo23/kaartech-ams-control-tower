/**
 * EDGE AMS Control Tower — Centered Create Remediation Task Modal
 * Section 4: Finding → Task Creation
 * Centered modal inheriting Related Audit & Related Finding automatically.
 */
import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Shield, AlertCircle, Calendar, User, ArrowRight } from 'lucide-react';
import { governanceStore, CURRENT_SIMULATED_DATE } from '../../data/governanceStore';

export default function CreateRemediationTaskModal({
  isOpen,
  onClose,
  finding,
  audit,
  onTaskCreated,
}) {
  const [taskDescription, setTaskDescription] = useState('');
  const [raisedBy, setRaisedBy] = useState('Governance Manager');
  const [assignedTo, setAssignedTo] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [error, setError] = useState('');

  // Prepopulate when finding or audit changes
  useEffect(() => {
    if (finding) {
      setAssignedTo(finding.assignedTo || finding.owner || 'AMS Service Manager');
      setTaskDescription('');
      setRaisedBy('Governance Manager');
      setStatus('Not Started');
      setError('');

      // Default target date: 10 days from current simulated date or finding target date
      if (finding.targetDate) {
        setTargetDate(finding.targetDate);
      } else {
        setTargetDate('2026-09-20');
      }
    }
  }, [finding]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !finding) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskDescription.trim()) {
      setError('Please provide a task description.');
      return;
    }

    const newTask = governanceStore.addTask({
      taskDescription: taskDescription.trim(),
      description: taskDescription.trim(),
      raisedBy: raisedBy.trim() || 'Governance Manager',
      assignedTo: assignedTo.trim() || 'AMS Service Manager',
      targetDate: targetDate || '2026-09-20',
      status: status || 'Not Started',
      auditId: finding.auditId || (audit ? audit.id : 'AUD-0001'),
      findingId: finding.id,
      raisedOn: CURRENT_SIMULATED_DATE,
    });

    if (onTaskCreated) {
      onTaskCreated(newTask);
    }
    onClose();
  };

  const auditId = finding.auditId || (audit ? audit.id : 'AUD-0001');
  const auditTitle = audit?.title || audit?.auditName || 'AMS Incident & SLA Governance Review';

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 17, 20, 0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="record-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
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
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255, 86, 34, 0.12)',
                color: 'var(--edge-primary, #FF5622)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckSquare size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                Create Remediation Task
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Operational corrective action assigned to address finding {finding.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-tertiary)' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Inherited Traceability Relationships (Read-Only) */}
        <div
          style={{
            padding: '14px 24px',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
            Inherited Governance Traceability
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Related Audit</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '11px', color: 'var(--edge-primary, #FF5622)' }}>
                  {auditId}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {auditTitle}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>Related Finding</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '11px', color: 'var(--text-primary)' }}>
                  {finding.id}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {finding.shortDescription || finding.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#EF4444',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Task Description */}
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Task Description <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              rows={3}
              value={taskDescription}
              onChange={(e) => {
                setTaskDescription(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Review P1/P2 SLA escalation workflow and validate response checkpoints"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Raised By & Assigned To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Raised By
              </label>
              <input
                type="text"
                value={raisedBy}
                onChange={(e) => setRaisedBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Assigned To
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. AMS Service Manager"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Target Date & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Initial Status
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Not Started', 'In Progress', 'Blocked'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`btn ${status === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{
                      flex: 1,
                      fontSize: 'var(--text-xs)',
                      padding: '6px 10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
            }}
          >
            <strong>Governance Rule:</strong> Completing this remediation task confirms activity execution.
            The finding remains open until control effectiveness is formally verified and attested.
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--edge-primary, #FF5622)',
                borderColor: 'var(--edge-primary, #FF5622)',
                color: '#FFFFFF',
              }}
            >
              <CheckSquare size={14} />
              <span>Create Remediation Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
