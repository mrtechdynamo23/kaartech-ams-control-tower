/**
 * EDGE AMS Control Tower — Knowledge Document Centered Detail Modal
 *
 * Implements full document inspection per Head Feedback requirement:
 * - Title, Type, Business Stream, Process Group, Application, Owner, Last Updated, Status
 * - Executive Summary
 * - Document Content / Knowledge Article with formatted procedure sections
 * - Related Application & Related Incident/SR ticket lineage
 * - Keyboard (ESC) & Backdrop dismiss
 * - High-contrast light & dark mode styling with crisp borders
 */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, FileText, BookOpen, Layers, User, Calendar, ExternalLink,
  CheckCircle2, Tag, ArrowRight, ShieldCheck, Ticket, Sparkles, Copy
} from 'lucide-react';

export default function KnowledgeDocumentModal({ isOpen, document: doc, onClose }) {
  // ESC key handler and body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !doc) return null;

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'FAQ': return 'badge-info';
      case 'User Manual': return 'badge-primary';
      case 'Operational Guide': return 'badge-success';
      case 'Troubleshooting': return 'badge-warning';
      case 'SOP / Procedure': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const modalContent = (
    <div
      className="modal-overlay-centered animate-fade-in"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 14, 20, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Knowledge Document: ${doc.title}`}
        className="modal-dialog-centered border-thick-strategic"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '88vh',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(255, 86, 34, 0.10) 0%, rgba(20, 24, 30, 0.95) 100%)',
            borderBottom: '1.5px solid var(--border-primary)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              {/* Type, Stream & Status Pill Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className={`badge ${getTypeBadgeClass(doc.docType)}`} style={{ fontWeight: 800 }}>
                  {doc.docType}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 86, 34, 0.15)',
                    color: 'var(--edge-primary)',
                    border: '1px solid rgba(255, 86, 34, 0.3)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Stream: {doc.businessStream}
                </span>
                <span className="badge badge-success">
                  <CheckCircle2 size={11} style={{ marginRight: 3 }} /> {doc.status}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                  ID: {doc.id} · {doc.version || 'v1.0'}
                </span>
              </div>

              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {doc.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{
                width: 32,
                height: 32,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                flexShrink: 0,
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            padding: '12px 24px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-secondary)',
            fontSize: '0.75rem',
          }}
        >
          <div>
            <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
              Process Group
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              {doc.processGroup}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
              Application
            </div>
            <div style={{ fontWeight: 600, color: 'var(--edge-primary)', marginTop: 2 }}>
              {doc.application}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
              Document Owner
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              {doc.owner}
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.6875rem', fontWeight: 700 }}>
              Last Updated
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
              {doc.lastUpdated}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Executive Summary */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', marginBottom: 4 }}>
              Document Summary
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>
              {doc.summary}
            </div>
          </div>

          {/* Full Operational Procedure / Content */}
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} style={{ color: 'var(--edge-primary)' }} /> Knowledge Article & Procedures
            </div>

            <div
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                lineHeight: 1.65,
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
              }}
            >
              {doc.content}
            </div>
          </div>

          {/* Related Tickets Lineage Strip (Ensures viewer is not a dead-end) */}
          {doc.relatedTickets && doc.relatedTickets.length > 0 && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ticket size={16} style={{ color: 'var(--edge-primary)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Linked Tickets & Historical Lineage
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                    Articles referenced in recent resolution notes
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {doc.relatedTickets.map((tId) => (
                  <span
                    key={tId}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--edge-primary)',
                      background: 'rgba(255, 86, 34, 0.10)',
                      border: '1px solid rgba(255, 86, 34, 0.25)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {tId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Indexed Tags:
              </span>
              {doc.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Viewing official published procedure · EDGE AMS Knowledge Management
          </span>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ fontWeight: 600, padding: '6px 18px' }}
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
