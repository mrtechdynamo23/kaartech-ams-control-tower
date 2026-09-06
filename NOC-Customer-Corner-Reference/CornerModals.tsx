import React, { useMemo, useState } from 'react';
import { Tag, Megaphone, PencilLine, TicketCheck, Search } from 'lucide-react';
import {
  cornerStakeholders, CORNER_TOPICS, CORNER_FORUMS, stakeholderById,
  type CornerTopic, type CornerForum, type CornerThread, type CornerCTA, type CTAStatus,
} from '../../data/customerCorner';
import {
  ModalShell, FieldLabel, inputStyle, primaryButtonStyle, ghostButtonStyle,
  MentionTextarea, extractMentions, SideBadge, type CornerTicketRef,
} from './CornerShared';

const footer = (onClose: () => void, submitLabel: string, disabled?: boolean) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
    <button type="button" onClick={onClose} style={ghostButtonStyle}>Cancel</button>
    <button
      type="submit"
      disabled={disabled}
      style={{ ...primaryButtonStyle, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {submitLabel}
    </button>
  </div>
);

const NoSlaNote: React.FC = () => (
  <p
    style={{
      margin: '14px 0 0',
      padding: '9px 11px',
      borderRadius: 6,
      background: 'var(--bg-secondary, #F8FAFC)',
      border: '1px solid var(--border, #E4E7EC)',
      fontSize: '0.6875rem',
      lineHeight: 1.55,
      color: 'var(--text-secondary, #475467)',
    }}
  >
    This conversation is a collaboration record only. It does not create, update or close a ticket, and
    it never starts, pauses or stops an SLA clock — SLAs are measured in eService / ServiceNow and pause
    only for approved waiting states (SOW App.1 §10.1).
  </p>
);

const stakeholderOptions = (
  <>
    {(['COMPANY', 'CONTRACTOR', 'THIRD PARTY'] as const).map((side) => (
      <optgroup key={side} label={side}>
        {cornerStakeholders.filter((s) => s.side === side).map((s) => (
          <option key={s.id} value={s.id}>{s.name} — {s.title}</option>
        ))}
      </optgroup>
    ))}
  </>
);

// ─── TAG A TICKET ────────────────────────────────────────────────────────────

export const NewTicketThreadModal: React.FC<{
  tickets: CornerTicketRef[];
  authorId: string;
  onClose: () => void;
  onSubmit: (draft: {
    ticketId: string; title: string; topic: CornerTopic; forum: CornerForum;
    openedById: string; body: string; mentions: string[];
  }) => void;
}> = ({ tickets, authorId, onClose, onSubmit }) => {
  const [search, setSearch] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<CornerTopic>('Ticket Update');
  const [forum, setForum] = useState<CornerForum>('Daily Ops Stand-Up');
  const [body, setBody] = useState('');

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets.slice(0, 8);
    return tickets
      .filter((t) => `${t.id} ${t.title} ${t.service} ${t.owner}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, tickets]);

  const selected = tickets.find((t) => t.id === ticketId);
  const canSubmit = Boolean(ticketId && title.trim() && body.trim());

  return (
    <ModalShell
      title="Tag a ticket"
      subtitle="Start a conversation against an existing incident or service request"
      icon={<Tag size={18} color="#03D3C6" />}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit({
            ticketId, title: title.trim(), topic, forum,
            openedById: authorId, body: body.trim(), mentions: extractMentions(body),
          });
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Ticket</FieldLabel>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary, #98A2B3)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket id, title, service or owner…"
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
          <ul
            style={{
              listStyle: 'none', margin: '8px 0 0', padding: 4, maxHeight: 210, overflowY: 'auto',
              border: '1px solid var(--border, #E4E7EC)', borderRadius: 8,
            }}
          >
            {results.length === 0 && (
              <li style={{ padding: 10, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                No ticket matches that search.
              </li>
            )}
            {results.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => {
                    setTicketId(t.id);
                    if (!title.trim()) setTitle(t.title.slice(0, 90));
                  }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                    border: ticketId === t.id ? '1px solid var(--noc-deep-blue, #0D4C93)' : '1px solid transparent',
                    background: ticketId === t.id ? 'rgba(13,76,147,0.07)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: 'var(--brand-ink, #0D4C93)' }}>
                      {t.id}
                    </span>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-tertiary, #98A2B3)' }}>
                      {t.kind} · {t.classification} · {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text, #101828)', marginTop: 2 }}>
                    {t.title}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <p style={{ margin: '8px 0 0', fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)' }}>
              Tagging <strong>{selected.id}</strong> — {selected.service} · owner {selected.owner || 'unassigned'}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <FieldLabel>What do you need from the other side?</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Need a plain-language restoration summary for Finance"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel>Topic</FieldLabel>
            <select value={topic} onChange={(e) => setTopic(e.target.value as CornerTopic)} style={inputStyle}>
              {CORNER_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Table at (SOW App.1 §6.9 / §8.2)</FieldLabel>
            <select value={forum} onChange={(e) => setForum(e.target.value as CornerForum)} style={inputStyle}>
              {CORNER_FORUMS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Opening message — type @ to mention someone</FieldLabel>
          <MentionTextarea value={body} onChange={setBody} rows={4} placeholder="Set out what you need and who needs to answer…" />
        </div>

        <NoSlaNote />
        {footer(onClose, 'Start thread', !canSubmit)}
      </form>
    </ModalShell>
  );
};

// ─── RAISE A CTA ─────────────────────────────────────────────────────────────

export const NewCTAModal: React.FC<{
  authorId: string;
  onClose: () => void;
  onSubmit: (draft: {
    title: string; topic: CornerTopic; forum: CornerForum; openedById: string;
    body: string; mentions: string[]; ownerId: string; dueDate: string;
    priority: CornerCTA['priority'];
  }) => void;
}> = ({ authorId, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<CornerTopic>('Improvement Idea');
  const [forum, setForum] = useState<CornerForum>('Weekly Operational Review');
  const [ownerId, setOwnerId] = useState(authorId);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<CornerCTA['priority']>('Medium');
  const [body, setBody] = useState('');

  const canSubmit = Boolean(title.trim() && body.trim() && dueDate && ownerId);

  return (
    <ModalShell
      title="Raise a Call To Action"
      subtitle="An action item with an owner and a due date — no ticket behind it"
      icon={<Megaphone size={18} color="#03D3C6" />}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          onSubmit({
            title: title.trim(), topic, forum, openedById: authorId,
            body: body.trim(), mentions: extractMentions(body), ownerId, dueDate, priority,
          });
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Call To Action</FieldLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Agree a single definition of 'restored' for payroll incidents"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel>Accountable owner</FieldLabel>
            <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={inputStyle}>
              {stakeholderOptions}
            </select>
          </div>
          <div>
            <FieldLabel>Due date</FieldLabel>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <select value={priority} onChange={(e) => setPriority(e.target.value as CornerCTA['priority'])} style={inputStyle}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <FieldLabel>Topic</FieldLabel>
            <select value={topic} onChange={(e) => setTopic(e.target.value as CornerTopic)} style={inputStyle}>
              {CORNER_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>Table at (SOW App.1 §6.9 / §8.2)</FieldLabel>
            <select value={forum} onChange={(e) => setForum(e.target.value as CornerForum)} style={inputStyle}>
              {CORNER_FORUMS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Opening message — type @ to mention someone</FieldLabel>
          <MentionTextarea value={body} onChange={setBody} rows={4} placeholder="Describe the action and why it matters…" />
        </div>

        <NoSlaNote />
        {footer(onClose, 'Raise CTA', !canSubmit)}
      </form>
    </ModalShell>
  );
};

// ─── UPDATE A CTA ────────────────────────────────────────────────────────────

export const EditCTAModal: React.FC<{
  thread: CornerThread;
  onClose: () => void;
  onSubmit: (patch: { status: CTAStatus; ownerId: string; dueDate: string; priority: CornerCTA['priority'] }) => void;
}> = ({ thread, onClose, onSubmit }) => {
  const cta = thread.cta!;
  const [status, setStatus] = useState<CTAStatus>(cta.status);
  const [ownerId, setOwnerId] = useState(cta.ownerId);
  const [dueDate, setDueDate] = useState(cta.dueDate);
  const [priority, setPriority] = useState<CornerCTA['priority']>(cta.priority);

  return (
    <ModalShell
      title={`Update ${cta.ref}`}
      subtitle={thread.title}
      icon={<PencilLine size={18} color="#03D3C6" />}
      onClose={onClose}
      width={540}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ status, ownerId, dueDate, priority });
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
          <div>
            <FieldLabel>Status</FieldLabel>
            <select value={status} onChange={(e) => setStatus(e.target.value as CTAStatus)} style={inputStyle}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <FieldLabel>Accountable owner</FieldLabel>
            <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={inputStyle}>
              {stakeholderOptions}
            </select>
          </div>
          <div>
            <FieldLabel>Due date</FieldLabel>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <FieldLabel>Priority</FieldLabel>
            <select value={priority} onChange={(e) => setPriority(e.target.value as CornerCTA['priority'])} style={inputStyle}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <p style={{ margin: '14px 0 0', fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)', lineHeight: 1.55 }}>
          Owner is currently <strong>{stakeholderById(cta.ownerId)?.name}</strong>{' '}
          <SideBadge id={cta.ownerId} compact />. Every change is written into the thread so the
          audit trail stays in one place (SOW App.1 §8.1).
        </p>
        {footer(onClose, 'Save changes')}
      </form>
    </ModalShell>
  );
};

// ─── CONVERT A CTA INTO A TICKET REFERENCE ───────────────────────────────────

export const ConvertCTAModal: React.FC<{
  thread: CornerThread;
  tickets: CornerTicketRef[];
  onClose: () => void;
  onSubmit: (ticketId: string) => void;
}> = ({ thread, tickets, onClose, onSubmit }) => {
  const [search, setSearch] = useState('');
  const [ticketId, setTicketId] = useState('');

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets.slice(0, 8);
    return tickets.filter((t) => `${t.id} ${t.title}`.toLowerCase().includes(q)).slice(0, 8);
  }, [search, tickets]);

  return (
    <ModalShell
      title="Link this CTA to a ticket"
      subtitle={thread.cta?.ref}
      icon={<TicketCheck size={18} color="#03D3C6" />}
      onClose={onClose}
      width={560}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ticketId) onSubmit(ticketId);
        }}
      >
        <p style={{ margin: '0 0 14px', fontSize: '0.75rem', lineHeight: 1.6, color: 'var(--text-secondary, #475467)' }}>
          A CTA carries no service level. Once the work is raised as an incident or service request in the
          ITSM tool, link it here — the ticket then carries the SLA (SOW App.1 §10.1) and this thread stays as the
          conversation record behind it.
        </p>
        <FieldLabel>Ticket raised for this CTA</FieldLabel>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ticket id or title…"
          style={inputStyle}
        />
        <ul
          style={{
            listStyle: 'none', margin: '8px 0 0', padding: 4, maxHeight: 220, overflowY: 'auto',
            border: '1px solid var(--border, #E4E7EC)', borderRadius: 8,
          }}
        >
          {results.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTicketId(t.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                  border: ticketId === t.id ? '1px solid var(--noc-deep-blue, #0D4C93)' : '1px solid transparent',
                  background: ticketId === t.id ? 'rgba(13,76,147,0.07)' : 'transparent',
                }}
              >
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', color: 'var(--brand-ink, #0D4C93)' }}>
                  {t.id}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text, #101828)' }}>{t.title}</div>
              </button>
            </li>
          ))}
        </ul>
        {footer(onClose, 'Link ticket', !ticketId)}
      </form>
    </ModalShell>
  );
};
