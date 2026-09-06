/**
 * EDGE AMS Control Tower — Customer Corner Modals
 *
 * Four enterprise modals for the collaboration workspace:
 * 1. NewTicketThreadModal — Tag a ticket (start conversation on an INC/SR)
 * 2. NewCTAModal — Raise a Call To Action
 * 3. EditCTAModal — Update CTA fields
 * 4. ConvertCTAModal — Link a CTA to an existing ticket
 *
 * Aligned with the EDGE dark & light enterprise design system.
 * Zero native <select> elements — all dropdowns use CustomerCornerDropdown.
 */
import React, { useMemo, useState } from 'react';
import { Tag, Megaphone, PencilLine, TicketCheck, Search, CheckCircle2, Info, Loader2 } from 'lucide-react';
import {
  cornerStakeholders, CORNER_TOPICS, CORNER_FORUMS, stakeholderById, STAKEHOLDER_SIDES, SIDE_META,
} from '../../data/customerCornerData';
import {
  ModalShell, FieldLabel, inputStyle, primaryButtonStyle, ghostButtonStyle,
  MentionTextarea, extractMentions, SideBadge, CustomerCornerDropdown,
} from './CornerShared';
import './CustomerCorner.css';

// ─── Shared UI Helpers ───────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const p = (priority || '').toUpperCase();
  if (p === 'P1') {
    return (
      <span className="corner-side-badge corner-priority-p1">
        P1
      </span>
    );
  }
  if (p === 'P2') {
    return (
      <span className="corner-side-badge corner-priority-p2">
        P2
      </span>
    );
  }
  return (
    <span className="corner-side-badge corner-priority-p3">
      {priority || 'P3'}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status || 'New';
  const statusClass = s.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`corner-side-badge corner-status-${statusClass}`}>
      {s}
    </span>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div style={{ fontSize: '0.6875rem', color: '#F87171', marginTop: 4, fontWeight: 500 }}>
      {message}
    </div>
  );
}

function Footer({ onClose, submitLabel, disabled, isSubmitting = false, submittingLabel = 'Starting thread…' }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid var(--border-secondary, #21262E)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        style={{
          ...ghostButtonStyle,
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        style={{
          ...primaryButtonStyle,
          opacity: disabled || isSubmitting ? 0.5 : 1,
          cursor: disabled || isSubmitting ? 'not-allowed' : 'pointer',
          background: disabled || isSubmitting ? 'rgba(255, 255, 255, 0.06)' : 'var(--edge-primary, #FF5622)',
          color: disabled || isSubmitting ? 'var(--text-tertiary, #6B7280)' : '#FFFFFF',
          border: disabled || isSubmitting ? '1px solid var(--border-secondary, #21262E)' : '1px solid transparent',
          minWidth: 120,
        }}
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}

function NoSlaNote() {
  return (
    <div className="corner-system-notice">
      <Info size={15} style={{ color: 'var(--color-blue, #2563EB)', flexShrink: 0, marginTop: 2 }} />
      <p
        style={{
          margin: 0,
          fontSize: '0.6875rem',
          lineHeight: 1.55,
          color: 'var(--text-secondary, #9CA3AB)',
        }}
      >
        This conversation is a collaboration record only. It does not create, update or close a ticket, and
        it never starts, pauses or stops an SLA clock — SLAs are measured in eService / ServiceNow.
      </p>
    </div>
  );
}

const stakeholderDropdownGroups = STAKEHOLDER_SIDES.map((side) => ({
  label: SIDE_META[side].label,
  options: cornerStakeholders
    .filter((s) => s.side === side)
    .map((s) => ({
      value: s.id,
      label: s.name,
      sublabel: s.title,
      side: s.side,
    })),
}));

const topicDropdownOptions = CORNER_TOPICS.map((t) => ({ value: t, label: t }));
const forumDropdownOptions = CORNER_FORUMS.map((f) => ({ value: f, label: f }));

const priorityDropdownOptions = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const ctaStatusDropdownOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Closed', label: 'Closed' },
];

// ─── TAG A TICKET MODAL ──────────────────────────────────────────────────────

export function NewTicketThreadModal({ tickets, authorId, onClose, onSubmit }) {
  const [search, setSearch] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Ticket Update');
  const [forum, setForum] = useState('Daily Ops Stand-Up');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets.slice(0, 8);
    return tickets
      .filter((t) => `${t.id} ${t.title} ${t.service} ${t.owner} ${t.kind}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, tickets]);

  const selected = tickets.find((t) => t.id === ticketId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!ticketId) newErrors.ticketId = 'Please select a ticket to tag.';
    if (!title.trim()) newErrors.title = 'Please specify what you need from the other side.';
    if (!body.trim()) newErrors.body = 'Opening message is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit({
          ticketId,
          title: title.trim(),
          topic,
          forum,
          openedById: authorId,
          body: body.trim(),
          mentions: extractMentions(body),
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Tag a Ticket"
      subtitle="Start a conversation against an existing incident or service request"
      icon={<Tag size={18} />}
      onClose={onClose}
      width={640}
    >
      <form onSubmit={handleSubmit}>
        {/* 1. Ticket Search & Selection */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel required>Ticket</FieldLabel>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 11,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary, #6B7280)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, title, service or owner…"
              className={`corner-input ${errors.ticketId ? 'corner-input-error' : ''}`}
              style={{ paddingLeft: 32 }}
            />
          </div>

          <ul
            style={{
              listStyle: 'none',
              margin: '8px 0 0',
              padding: 4,
              maxHeight: 220,
              overflowY: 'auto',
              border: errors.ticketId ? '1px solid #F87171' : '1px solid var(--border-secondary, #21262E)',
              borderRadius: 8,
              background: 'var(--bg-primary, #0C0E12)',
            }}
            className="corner-custom-scrollbar"
          >
            {results.length === 0 && (
              <li style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-tertiary, #6B7280)', textAlign: 'center' }}>
                No tickets matching "{search}".
              </li>
            )}
            {results.map((t) => {
              const isSelected = ticketId === t.id;
              return (
                <li key={t.id} style={{ marginBottom: 4 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketId(t.id);
                      if (!title.trim()) setTitle(t.title.slice(0, 90));
                      if (errors.ticketId) setErrors((prev) => ({ ...prev, ticketId: null }));
                    }}
                    className={`corner-ticket-btn ${isSelected ? 'selected' : ''}`}
                  >
                    {/* Top Row: Ticket ID (restrained blue) + Type / Priority / Status metadata */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span className="corner-ticket-id">
                        {t.id}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', fontWeight: 500 }}>
                          {t.kind}
                        </span>
                        <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: '0.625rem' }}>·</span>
                        <PriorityBadge priority={t.priority || t.classification} />
                        <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: '0.625rem' }}>·</span>
                        <StatusBadge status={t.status} />
                      </div>
                    </div>

                    {/* Below: Short description */}
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--text-primary, #F1F3F5)',
                        marginTop: 4,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.title}
                    </div>

                    {/* Service & owner sub-line */}
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--text-secondary, #9CA3AB)',
                        marginTop: 3,
                        display: 'flex',
                        gap: 12,
                      }}
                    >
                      <span>Service: <span style={{ color: 'var(--text-tertiary, #6B7280)' }}>{t.service}</span></span>
                      <span>Owner: <span style={{ color: 'var(--text-tertiary, #6B7280)' }}>{t.owner || 'Unassigned'}</span></span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <FieldError message={errors.ticketId} />

          {/* Selected Confirmation Banner */}
          {selected && (
            <div className="corner-selected-pill">
              <CheckCircle2 size={13} style={{ color: 'var(--color-blue, #2563EB)', flexShrink: 0 }} />
              <span>
                Selected: <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{selected.id}</strong> — {selected.service} · owner {selected.owner || 'unassigned'}
              </span>
            </div>
          )}
        </div>

        {/* 2. What do you need from the other side? */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel required>What do you need from the other side?</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholder="e.g. Need a plain-language restoration summary for Finance"
            className={`corner-input ${errors.title ? 'corner-input-error' : ''}`}
          />
          <FieldError message={errors.title} />
        </div>

        {/* 3. Topic & Governance Forum (Custom Dropdowns) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel>Topic</FieldLabel>
            <CustomerCornerDropdown
              value={topic}
              onChange={setTopic}
              options={topicDropdownOptions}
              width="100%"
              ariaLabel="Select topic"
            />
          </div>
          <div>
            <FieldLabel>Governance Forum</FieldLabel>
            <CustomerCornerDropdown
              value={forum}
              onChange={setForum}
              options={forumDropdownOptions}
              width="100%"
              ariaLabel="Select governance forum"
            />
          </div>
        </div>

        {/* 4. Opening message */}
        <div>
          <FieldLabel required>Opening message — type @ to mention someone</FieldLabel>
          <MentionTextarea
            value={body}
            onChange={(val) => {
              setBody(val);
              if (errors.body) setErrors((prev) => ({ ...prev, body: null }));
            }}
            rows={4}
            placeholder="Set out what you need and who needs to answer…"
            hasError={Boolean(errors.body)}
          />
          <FieldError message={errors.body} />
        </div>

        {/* 5. System notice (subtle informational, NOT an alert) */}
        <NoSlaNote />

        {/* 6. Footer actions with in-button loader */}
        <Footer
          onClose={onClose}
          submitLabel="Start Thread"
          disabled={!ticketId || !title.trim() || !body.trim()}
          isSubmitting={isSubmitting}
          submittingLabel="Starting thread…"
        />
      </form>
    </ModalShell>
  );
}

// ─── RAISE A CTA MODAL ───────────────────────────────────────────────────────

export function NewCTAModal({ authorId, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Improvement Idea');
  const [forum, setForum] = useState('Weekly Operational Review');
  const [ownerId, setOwnerId] = useState(authorId);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = Boolean(title.trim() && body.trim() && dueDate && ownerId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Call To Action title is required.';
    if (!ownerId) newErrors.ownerId = 'Accountable owner is required.';
    if (!dueDate) newErrors.dueDate = 'Due date is required.';
    if (!body.trim()) newErrors.body = 'Opening message is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit({
          title: title.trim(),
          topic,
          forum,
          openedById: authorId,
          body: body.trim(),
          mentions: extractMentions(body),
          ownerId,
          dueDate,
          priority,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Raise a Call To Action"
      subtitle="An action item with an owner and a due date — no ticket behind it"
      icon={<Megaphone size={18} />}
      onClose={onClose}
      width={640}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <FieldLabel required>Call To Action</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholder="e.g. Agree a single definition of 'restored' for payroll incidents"
            className={`corner-input ${errors.title ? 'corner-input-error' : ''}`}
          />
          <FieldError message={errors.title} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel required>Accountable Owner</FieldLabel>
            <CustomerCornerDropdown
              value={ownerId}
              onChange={(val) => {
                setOwnerId(val);
                if (errors.ownerId) setErrors((prev) => ({ ...prev, ownerId: null }));
              }}
              groups={stakeholderDropdownGroups}
              width="100%"
              ariaLabel="Select accountable owner"
            />
            <FieldError message={errors.ownerId} />
          </div>
          <div>
            <FieldLabel required>Due Date</FieldLabel>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: null }));
              }}
              className={`corner-input ${errors.dueDate ? 'corner-input-error' : ''}`}
            />
            <FieldError message={errors.dueDate} />
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <CustomerCornerDropdown
              value={priority}
              onChange={setPriority}
              options={priorityDropdownOptions}
              width="100%"
              ariaLabel="Select priority"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel>Topic</FieldLabel>
            <CustomerCornerDropdown
              value={topic}
              onChange={setTopic}
              options={topicDropdownOptions}
              width="100%"
              ariaLabel="Select topic"
            />
          </div>
          <div>
            <FieldLabel>Governance Forum</FieldLabel>
            <CustomerCornerDropdown
              value={forum}
              onChange={setForum}
              options={forumDropdownOptions}
              width="100%"
              ariaLabel="Select governance forum"
            />
          </div>
        </div>

        <div>
          <FieldLabel required>Opening message — type @ to mention someone</FieldLabel>
          <MentionTextarea
            value={body}
            onChange={(val) => {
              setBody(val);
              if (errors.body) setErrors((prev) => ({ ...prev, body: null }));
            }}
            rows={4}
            placeholder="Describe the action and why it matters…"
            hasError={Boolean(errors.body)}
          />
          <FieldError message={errors.body} />
        </div>

        <NoSlaNote />
        <Footer
          onClose={onClose}
          submitLabel="Raise CTA"
          disabled={!canSubmit}
          isSubmitting={isSubmitting}
          submittingLabel="Raising CTA…"
        />
      </form>
    </ModalShell>
  );
}

// ─── UPDATE A CTA MODAL ──────────────────────────────────────────────────────

export function EditCTAModal({ thread, onClose, onSubmit }) {
  const cta = thread.cta;
  const [status, setStatus] = useState(cta.status);
  const [ownerId, setOwnerId] = useState(cta.ownerId);
  const [dueDate, setDueDate] = useState(cta.dueDate);
  const [priority, setPriority] = useState(cta.priority);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit({ status, ownerId, dueDate, priority }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title={`Update ${cta.ref}`}
      subtitle={thread.title}
      icon={<PencilLine size={18} />}
      onClose={onClose}
      width={560}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
          <div>
            <FieldLabel>Status</FieldLabel>
            <CustomerCornerDropdown
              value={status}
              onChange={setStatus}
              options={ctaStatusDropdownOptions}
              width="100%"
              ariaLabel="Select status"
            />
          </div>
          <div>
            <FieldLabel>Accountable Owner</FieldLabel>
            <CustomerCornerDropdown
              value={ownerId}
              onChange={setOwnerId}
              groups={stakeholderDropdownGroups}
              width="100%"
              ariaLabel="Select accountable owner"
            />
          </div>
          <div>
            <FieldLabel>Due Date</FieldLabel>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="corner-input"
            />
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <CustomerCornerDropdown
              value={priority}
              onChange={setPriority}
              options={priorityDropdownOptions}
              width="100%"
              ariaLabel="Select priority"
            />
          </div>
        </div>
        <div
          style={{
            margin: '16px 0 0',
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(30, 41, 59, 0.35)',
            border: '1px solid var(--border-secondary, #21262E)',
            fontSize: '0.6875rem',
            color: 'var(--text-secondary, #9CA3AB)',
            lineHeight: 1.55,
          }}
        >
          Owner is currently <strong>{stakeholderById(cta.ownerId)?.name}</strong>{' '}
          <SideBadge id={cta.ownerId} compact />. Every change is logged into the thread audit trail.
        </div>
        <Footer
          onClose={onClose}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          submittingLabel="Saving…"
        />
      </form>
    </ModalShell>
  );
}

// ─── LINK CTA TO TICKET MODAL ────────────────────────────────────────────────

export function ConvertCTAModal({ thread, tickets, onClose, onSubmit }) {
  const [search, setSearch] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets.slice(0, 8);
    return tickets.filter((t) => `${t.id} ${t.title} ${t.service} ${t.owner}`.toLowerCase().includes(q)).slice(0, 8);
  }, [search, tickets]);

  const selected = tickets.find((t) => t.id === ticketId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketId) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(ticketId));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Link this CTA to a Ticket"
      subtitle={thread.cta?.ref}
      icon={<TicketCheck size={18} />}
      onClose={onClose}
      width={580}
    >
      <form onSubmit={handleSubmit}>
        <div className="corner-system-notice" style={{ margin: '0 0 16px' }}>
          <Info size={15} style={{ color: 'var(--color-blue, #2563EB)', flexShrink: 0, marginTop: 2 }} />
          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              lineHeight: 1.55,
              color: 'var(--text-secondary, #9CA3AB)',
            }}
          >
            A CTA carries no service level. Once the work is raised as an incident or service request in the
            ITSM tool, link it here — the ticket then carries the SLA and this thread stays as the
            conversation record behind it.
          </p>
        </div>

        <FieldLabel required>Ticket raised for this CTA</FieldLabel>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary, #6B7280)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title, service or owner…"
            className="corner-input"
            style={{ paddingLeft: 32 }}
          />
        </div>

        <ul
          style={{
            listStyle: 'none',
            margin: '8px 0 0',
            padding: 4,
            maxHeight: 220,
            overflowY: 'auto',
            border: '1px solid var(--border-secondary, #21262E)',
            borderRadius: 8,
            background: 'var(--bg-primary, #0C0E12)',
          }}
          className="corner-custom-scrollbar"
        >
          {results.length === 0 && (
            <li style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-tertiary, #6B7280)', textAlign: 'center' }}>
              No tickets matching "{search}".
            </li>
          )}
          {results.map((t) => {
            const isSelected = ticketId === t.id;
            return (
              <li key={t.id} style={{ marginBottom: 4 }}>
                <button
                  type="button"
                  onClick={() => setTicketId(t.id)}
                  className={`corner-ticket-btn ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span className="corner-ticket-id">
                      {t.id}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', fontWeight: 500 }}>
                        {t.kind}
                      </span>
                      <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: '0.625rem' }}>·</span>
                      <PriorityBadge priority={t.priority || t.classification} />
                      <span style={{ color: 'var(--text-tertiary, #6B7280)', fontSize: '0.625rem' }}>·</span>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--text-primary, #F1F3F5)',
                      marginTop: 4,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.title}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <div className="corner-selected-pill">
            <CheckCircle2 size={13} style={{ color: 'var(--color-blue, #2563EB)', flexShrink: 0 }} />
            <span>
              Selected: <strong style={{ fontFamily: 'var(--font-mono, monospace)' }}>{selected.id}</strong> — {selected.service} · owner {selected.owner || 'unassigned'}
            </span>
          </div>
        )}

        <Footer
          onClose={onClose}
          submitLabel="Link Ticket"
          disabled={!ticketId}
          isSubmitting={isSubmitting}
          submittingLabel="Linking…"
        />
      </form>
    </ModalShell>
  );
}
