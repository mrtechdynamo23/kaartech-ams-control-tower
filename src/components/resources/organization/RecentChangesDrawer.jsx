/**
 * EDGE AMS Control Tower — Recent Organization Changes Drawer / Modal
 * 
 * Implements Section 27 of specifications:
 * - Realignment history and personnel mobilization
 * - Track allocations (e.g. ENH-OF-RUN transitions)
 * - Leadership and SteerCom governance milestones
 */
import React, { useEffect } from 'react';
import { X, Calendar, User, History, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { RECENT_ORGANIZATION_CHANGES } from '../../../data/organizationData';

export default function RecentChangesDrawer({ isOpen, onClose }) {
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

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-centered animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Recent Organization Changes"
        className="modal-dialog-centered recent-changes-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 86, 34, 0.1)',
                color: 'var(--edge-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Organization Changes
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                Governance log of resource movements, leadership appointments, and track assignments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Changes List */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {RECENT_ORGANIZATION_CHANGES.map(change => (
            <div
              key={change.id}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 86, 34, 0.12)',
                      color: 'var(--edge-primary)',
                    }}
                  >
                    {change.category}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {change.date}
                  </span>
                </div>
                <span className="badge badge-success" style={{ fontSize: '10px' }}>
                  {change.status}
                </span>
              </div>

              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {change.title}
              </div>

              <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {change.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-secondary)', paddingTop: '8px', marginTop: '4px' }}>
                <div><strong>Personnel:</strong> {change.personnel}</div>
                <div><strong>Base:</strong> {change.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-card)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
