import React, { useMemo, useRef, useState } from 'react';
import { cornerStakeholders, stakeholderById, SIDE_META, type CornerStakeholder } from '../../data/customerCorner';

/** Common ticket shape the Corner needs, whether the ticket is an INC or an SR. */
export interface CornerTicketRef {
  id: string;
  kind: 'Incident' | 'Service Request';
  title: string;
  status: string;
  /** P1–P4 for incidents; the contractual SR type for requests. */
  classification: string;
  owner: string;
  service: string;
}

export const formatCornerTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const relativeTime = (iso: string): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
};

export const SideBadge: React.FC<{ id: string; compact?: boolean }> = ({ id, compact }) => {
  const person = stakeholderById(id);
  if (!person) return null;
  const meta = SIDE_META[person.side];
  return (
    <span
      style={{
        padding: compact ? '1px 6px' : '2px 8px',
        borderRadius: 4,
        fontSize: compact ? '0.5625rem' : '0.625rem',
        fontWeight: 800,
        letterSpacing: '0.02em',
        background: meta.bg,
        color: meta.color,
        whiteSpace: 'nowrap',
      }}
    >
      {meta.short}
    </span>
  );
};

export const Chip: React.FC<{ label: string; bg: string; color: string; title?: string }> = ({ label, bg, color, title }) => (
  <span
    title={title}
    style={{
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: '0.625rem',
      fontWeight: 700,
      background: bg,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
);

export const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label
    style={{
      display: 'block',
      fontSize: '0.6875rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      color: 'var(--text-secondary, #475467)',
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid var(--border, #E4E7EC)',
  background: 'var(--surface-raised, #FFFFFF)',
  color: 'var(--text, #101828)',
  fontSize: '0.8125rem',
  fontFamily: 'inherit',
};

export const primaryButtonStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 6,
  background: 'var(--noc-deep-blue, #0D4C93)',
  color: '#FFFFFF',
  border: 'none',
  fontWeight: 700,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};

export const ghostButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--text-secondary, #475467)',
  border: '1px solid var(--border, #E4E7EC)',
  fontWeight: 700,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

/** Backdrop + centred card used by every Corner modal. */
export const ModalShell: React.FC<{
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}> = ({ title, subtitle, icon, onClose, children, width = 620 }) => (
  <>
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10, 22, 40, 0.45)', backdropFilter: 'blur(3px)', zIndex: 1060 }}
    />
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `min(94vw, ${width}px)`,
        maxHeight: '88vh',
        overflowY: 'auto',
        background: 'var(--surface-raised, #FFFFFF)',
        borderRadius: 12,
        border: '1px solid var(--border, #E4E7EC)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        zIndex: 1061,
      }}
    >
      <div
        style={{
          padding: '18px 22px',
          background: 'linear-gradient(135deg, #0D4C93 0%, #05263F 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <div
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 800 }}>{title}</h2>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.82)' }}>{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', color: '#FFFFFF',
            borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16, lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  </>
);

/**
 * Textarea with @-mention autocomplete over the collaboration roster.
 * Mentions are resolved back to stakeholder ids on submit, so attribution
 * survives even if the display name is edited afterwards.
 */
export const MentionTextarea: React.FC<{
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}> = ({ value, onChange, placeholder, rows = 4, id }) => {
  const [query, setQuery] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const matches = useMemo(() => {
    if (query === null) return [];
    const q = query.toLowerCase();
    return cornerStakeholders
      .filter((s) => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const handleChange = (next: string) => {
    onChange(next);
    const caret = ref.current?.selectionStart ?? next.length;
    const upto = next.slice(0, caret);
    const token = upto.match(/@([\p{L} .'-]{0,30})$/u);
    setQuery(token ? token[1] : null);
  };

  const insert = (person: CornerStakeholder) => {
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
        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
      />
      {matches.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 5,
            left: 0,
            right: 0,
            top: '100%',
            margin: '4px 0 0',
            padding: 4,
            listStyle: 'none',
            background: 'var(--surface-raised, #FFFFFF)',
            border: '1px solid var(--border, #E4E7EC)',
            borderRadius: 8,
            boxShadow: '0 12px 28px rgba(0,0,0,0.16)',
            maxHeight: 230,
            overflowY: 'auto',
          }}
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
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text, #101828)' }}>{person.name}</span>
                <SideBadge id={person.id} compact />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', marginLeft: 'auto' }}>
                  {person.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/** Resolves "@Name" occurrences in free text back to stakeholder ids. */
export const extractMentions = (body: string): string[] =>
  cornerStakeholders.filter((s) => body.includes(`@${s.name}`)).map((s) => s.id);
