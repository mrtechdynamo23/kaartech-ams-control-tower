/**
 * EDGE AMS Control Tower — Customer Corner Shared Components
 *
 * Reusable UI pieces for the Customer Corner collaboration workspace:
 * badges, chips, form helpers, modal shell, @-mention textarea, and custom dropdowns.
 * Aligned with the EDGE dark & light enterprise design system.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cornerStakeholders, stakeholderById, SIDE_META } from '../../data/customerCornerData';
import './CustomerCorner.css';

export { default as CustomerCornerDropdown } from './CustomerCornerDropdown';

// ─── Style Constants ─────────────────────────────────────────────────────────

export const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--border-primary, #2B323D)',
  background: 'var(--bg-tertiary, #1A1F26)',
  color: 'var(--text-primary, #F1F3F5)',
  fontSize: '0.8125rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

export const primaryButtonStyle = {
  height: 38,
  padding: '0 16px',
  borderRadius: 6,
  background: 'var(--edge-primary, #FF5622)',
  color: '#FFFFFF',
  border: '1px solid transparent',
  fontWeight: 600,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'background 0.15s ease, opacity 0.15s ease',
};

export const ghostButtonStyle = {
  height: 38,
  padding: '0 14px',
  borderRadius: 6,
  background: 'var(--bg-card, #14181E)',
  color: 'var(--text-primary, #F1F3F5)',
  border: '1px solid var(--border-primary, #2B323D)',
  fontWeight: 600,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'all 0.15s ease',
};

export const secondaryButtonStyle = ghostButtonStyle;

// ─── Time Formatters ─────────────────────────────────────────────────────────

export function formatCornerTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function relativeTime(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

// ─── SideBadge ───────────────────────────────────────────────────────────────

export function SideBadge({ id, side: directSide, compact }) {
  const person = id ? stakeholderById(id) : null;
  const side = directSide || person?.side;
  if (!side || !SIDE_META[side]) return null;
  const meta = SIDE_META[side];
  const sideClass = side.toLowerCase().replace(/\s+/g, '-');
  return (
    <span
      className={`corner-side-badge corner-side-badge-${sideClass}`}
      style={{
        padding: compact ? '1px 6px' : '2px 7px',
        fontSize: compact ? '0.5625rem' : '0.625rem',
      }}
      title={meta.label}
    >
      {meta.short}
    </span>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────

export function Chip({ label, bg, color, title, className }) {
  return (
    <span
      title={title}
      className={className}
      style={{
        padding: '2px 7px',
        borderRadius: 4,
        fontSize: '0.625rem',
        fontWeight: 700,
        background: bg,
        color,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
}

// ─── FieldLabel ──────────────────────────────────────────────────────────────

export function FieldLabel({ children, required }) {
  return (
    <label
      style={{
        display: 'block',
        fontSize: '0.6875rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-secondary, #9CA3AB)',
        marginBottom: 6,
      }}
    >
      {children}
      {required && <span style={{ color: '#F87171', marginLeft: 4 }}>*</span>}
    </label>
  );
}

// ─── ModalShell ──────────────────────────────────────────────────────────────

export function ModalShell({ title, subtitle, icon, onClose, children, width = 640 }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="corner-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: -1,
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          width: `min(94vw, ${width}px)`,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary, #14181E)',
          borderRadius: 12,
          border: '1px solid var(--border-primary, #2B323D)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Subtle 2px brand top accent line */}
        <div
          style={{
            height: 2,
            width: '100%',
            background: 'linear-gradient(90deg, var(--edge-primary, #FF5622) 0%, rgba(255, 86, 34, 0.3) 60%, transparent 100%)',
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--bg-card, #14181E)',
            borderBottom: '1px solid var(--border-secondary, #21262E)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Soft icon container */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              flexShrink: 0,
              background: 'rgba(255, 86, 34, 0.08)',
              border: '1px solid rgba(255, 86, 34, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--edge-primary, #FF5622)',
            }}
          >
            {icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              id="corner-modal-title"
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary, #F1F3F5)',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary, #9CA3AB)',
                  lineHeight: 1.4,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="corner-modal-close"
          >
            ×
          </button>
        </div>

        {/* Modal Body with internal scrolling */}
        <div
          style={{
            padding: '20px 22px',
            overflowY: 'auto',
            flex: 1,
          }}
          className="corner-custom-scrollbar"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MentionTextarea ─────────────────────────────────────────────────────────

export function MentionTextarea({ value, onChange, placeholder, rows = 4, id, hasError = false }) {
  const [query, setQuery] = useState(null);
  const ref = useRef(null);

  const matches = useMemo(() => {
    if (query === null) return [];
    const q = query.toLowerCase();
    return cornerStakeholders
      .filter((s) => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const handleChange = (next) => {
    onChange(next);
    const caret = ref.current?.selectionStart ?? next.length;
    const upto = next.slice(0, caret);
    const token = upto.match(/@([\p{L} .'-]{0,30})$/u);
    setQuery(token ? token[1] : null);
  };

  const insert = (person) => {
    const caret = ref.current?.selectionStart ?? value.length;
    const upto = value.slice(0, caret);
    const rest = value.slice(caret);
    const replaced = upto.replace(/@([\p{L} .'-]{0,30})$/u, `@${person.name} `);
    onChange(replaced + rest);
    setQuery(null);
    ref.current?.focus();
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => window.setTimeout(() => setQuery(null), 150)}
        placeholder={placeholder}
        className={`corner-input corner-custom-scrollbar ${hasError ? 'corner-input-error' : ''}`}
        style={{ resize: 'vertical', lineHeight: 1.55 }}
      />
      {matches.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 50,
            left: 0,
            right: 0,
            top: '100%',
            margin: '4px 0 0',
            padding: 4,
            listStyle: 'none',
            background: 'var(--bg-card, #14181E)',
            border: '1px solid var(--border-primary, #2B323D)',
            borderRadius: 8,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
            maxHeight: 230,
            overflowY: 'auto',
          }}
          className="corner-custom-scrollbar"
        >
          {matches.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insert(person)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 10px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover, rgba(255,255,255,0.06))'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary, #F1F3F5)' }}>
                  {person.name}
                </span>
                <SideBadge id={person.id} compact />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', marginLeft: 'auto' }}>
                  {person.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── extractMentions ─────────────────────────────────────────────────────────

/** Resolves @Name occurrences in free text back to stakeholder ids. */
export function extractMentions(body) {
  return cornerStakeholders.filter((s) => body.includes(`@${s.name}`)).map((s) => s.id);
}
