import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MessagesSquare, Tag, Megaphone, Search, CheckCircle2, RotateCcw, PencilLine,
  TicketCheck, Send, Users, CalendarClock, AlertTriangle, Inbox,
} from 'lucide-react';
import { useDataStore } from '../../data/mockDataStore';
import {
  cornerStakeholders, stakeholderById, SIDE_META, CORNER_FORUMS,
  lastActivityAt, waitingOn, isCtaOverdue,
  type CornerThread, type CornerThreadType, type StakeholderSide,
} from '../../data/customerCorner';
import {
  SideBadge, Chip, formatCornerTime, relativeTime, MentionTextarea, extractMentions,
  primaryButtonStyle, ghostButtonStyle, inputStyle, type CornerTicketRef,
} from '../../components/collaboration/CornerShared';
import { NewTicketThreadModal, NewCTAModal, EditCTAModal, ConvertCTAModal } from '../../components/collaboration/CornerModals';

type StatusFilter = 'All' | 'Open' | 'Resolved';
type TypeFilter = 'All' | CornerThreadType;
type SideFilter = 'All' | StakeholderSide;

const CTA_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Open: { bg: '#FFF7E6', color: '#E97F0A' },
  'In Progress': { bg: '#E6F4FC', color: '#0D4C93' },
  Closed: { bg: '#E3FCEF', color: '#22A06B' },
};

/** Renders "@Name" tokens as highlighted mentions. */
const MessageBody: React.FC<{ body: string }> = ({ body }) => {
  const names = cornerStakeholders.map((s) => s.name).sort((a, b) => b.length - a.length);
  const nodes: React.ReactNode[] = [];
  let rest = body;
  let key = 0;

  while (rest.length) {
    const hit = names
      .map((name) => ({ name, at: rest.indexOf(`@${name}`) }))
      .filter((h) => h.at >= 0)
      .sort((a, b) => a.at - b.at)[0];

    if (!hit) {
      nodes.push(<span key={key++}>{rest}</span>);
      break;
    }
    if (hit.at > 0) nodes.push(<span key={key++}>{rest.slice(0, hit.at)}</span>);
    nodes.push(
      <strong key={key++} style={{ color: 'var(--brand-ink, #0D4C93)', fontWeight: 700 }}>
        @{hit.name}
      </strong>,
    );
    rest = rest.slice(hit.at + hit.name.length + 1);
  }

  return <span style={{ whiteSpace: 'pre-wrap' }}>{nodes}</span>;
};

const KpiCard: React.FC<{ label: string; value: number | string; note: string; color?: string; icon: React.ReactNode }> = ({
  label, value, note, color = 'var(--brand-ink, #0D4C93)', icon,
}) => (
  <div className="card" style={{ padding: 14, borderRadius: 10, background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #475467)' }}>
      {icon}
      <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</span>
    </div>
    <div style={{ fontSize: '1.5rem', fontWeight: 800, color, marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>{note}</div>
  </div>
);

const CustomerCorner: React.FC = () => {
  const {
    incidents, serviceRequests, cornerThreads, activeStakeholderId, setActiveStakeholderId,
    cornerReadState, createTicketThread, createCTAThread, postCornerMessage,
    resolveCornerThread, reopenCornerThread, updateCTA, linkCtaToTicket, markCornerThreadRead,
  } = useDataStore();

  /** Open the most recently active OPEN thread so the default view matches the default filter. */
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const byActivity = [...cornerThreads].sort(
      (a, b) => new Date(lastActivityAt(b)).getTime() - new Date(lastActivityAt(a)).getTime(),
    );
    return (byActivity.find((t) => t.status === 'Open') ?? byActivity[0])?.id ?? null;
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Open');
  const [sideFilter, setSideFilter] = useState<SideFilter>('All');
  const [forumFilter, setForumFilter] = useState<string>('All');
  const [draft, setDraft] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCTAModal, setShowCTAModal] = useState(false);
  const [showEditCTA, setShowEditCTA] = useState(false);
  const [showConvert, setShowConvert] = useState(false);

  const me = stakeholderById(activeStakeholderId);

  /** Incidents and service requests, flattened into one taggable reference list. */
  const tickets: CornerTicketRef[] = useMemo(() => [
    ...incidents.map((i) => ({
      id: i.id,
      kind: 'Incident' as const,
      title: i.title,
      status: i.status,
      classification: i.priority,
      owner: i.assignedEngineer || i.owner,
      service: i.service,
    })),
    ...serviceRequests.map((r) => ({
      id: r.id,
      kind: 'Service Request' as const,
      title: r.catalogItem || r.requestType,
      status: r.status,
      classification: r.srType,
      owner: r.assignedEngineer,
      service: r.service,
    })),
  ], [incidents, serviceRequests]);

  const ticketById = useMemo(() => new Map(tickets.map((t) => [t.id, t])), [tickets]);

  /** Unread for the persona currently posting — your own last word never counts. */
  const isUnread = useCallback((thread: CornerThread): boolean => {
    const last = lastActivityAt(thread);
    const lastAuthor = thread.messages[thread.messages.length - 1]?.authorId;
    if (lastAuthor === activeStakeholderId) return false;
    const readAt = cornerReadState[thread.id];
    return !readAt || new Date(readAt) < new Date(last);
  }, [activeStakeholderId, cornerReadState]);

  const visibleThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cornerThreads
      .filter((t) => (typeFilter === 'All' ? true : t.type === typeFilter))
      .filter((t) => (statusFilter === 'All' ? true : t.status === statusFilter))
      .filter((t) => (forumFilter === 'All' ? true : t.forum === forumFilter))
      .filter((t) => {
        if (sideFilter === 'All') return true;
        return t.participantIds.some((id) => stakeholderById(id)?.side === sideFilter);
      })
      .filter((t) => {
        if (!q) return true;
        const haystack = [
          t.id, t.title, t.topic, t.forum, t.ticketId ?? '', t.cta?.ref ?? '',
          ...t.participantIds.map((id) => stakeholderById(id)?.name ?? ''),
          ...t.messages.map((m) => m.body),
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => new Date(lastActivityAt(b)).getTime() - new Date(lastActivityAt(a)).getTime());
  }, [cornerThreads, search, typeFilter, statusFilter, sideFilter, forumFilter]);

  const selected = cornerThreads.find((t) => t.id === selectedId) ?? null;
  const messagesRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view when the thread changes or someone posts.
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [selectedId, selected?.messages.length]);

  const openThread = (id: string) => {
    setSelectedId(id);
    setDraft('');
    markCornerThreadRead(id);
  };

  const kpis = useMemo(() => {
    const open = cornerThreads.filter((t) => t.status === 'Open');
    return {
      open: open.length,
      ticketThreads: open.filter((t) => t.type === 'Ticket').length,
      openCtas: cornerThreads.filter((t) => t.cta && t.cta.status !== 'Closed').length,
      overdueCtas: cornerThreads.filter((t) => isCtaOverdue(t)).length,
      unread: cornerThreads.filter(isUnread).length,
    };
  }, [cornerThreads, isUnread]);

  const post = () => {
    if (!selected || !draft.trim()) return;
    postCornerMessage(selected.id, {
      authorId: activeStakeholderId,
      body: draft.trim(),
      mentions: extractMentions(draft),
    });
    setDraft('');
    markCornerThreadRead(selected.id);
  };

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      {/* ─── Page header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text, #101828)', margin: '0 0 4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessagesSquare size={22} color="var(--brand-ink, #0D4C93)" />
            Customer Corner
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #475467)', margin: 0, lineHeight: 1.5, maxWidth: 760 }}>
            One collaboration channel for every stakeholder — COMPANY, CONTRACTOR and third parties.
            Tag a ticket to talk about work already in the queue, or raise a Call To Action for work that
            has no ticket behind it yet.
          </p>
        </div>
        {/* Posting-as persona sits with the create actions — one control row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 12px',
              borderRadius: 6, border: '1px solid var(--border, #E4E7EC)', background: 'var(--card-bg, #FFFFFF)',
            }}
            title={me?.escalationTier
              ? `Escalation tier: ${me.escalationTier} (SOW App.1 §6.11)`
              : 'Outside the §6.11 escalation matrix'}
          >
            <Users size={14} style={{ color: 'var(--text-secondary, #475467)', flexShrink: 0 }} />
            <label
              htmlFor="corner-persona"
              style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary, #475467)', whiteSpace: 'nowrap' }}
            >
              Posting as
            </label>
            <select
              id="corner-persona"
              value={activeStakeholderId}
              onChange={(e) => setActiveStakeholderId(e.target.value)}
              style={{
                ...inputStyle, width: 'auto', maxWidth: 300, padding: '5px 6px',
                border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.75rem',
              }}
            >
              {(['COMPANY', 'CONTRACTOR', 'THIRD PARTY'] as StakeholderSide[]).map((side) => (
                <optgroup key={side} label={SIDE_META[side].label}>
                  {cornerStakeholders.filter((s) => s.side === side).map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {s.title}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {me && <SideBadge id={me.id} compact />}
          </div>

          <button type="button" onClick={() => setShowTicketModal(true)} style={ghostButtonStyle} id="corner-tag-ticket-btn">
            <Tag size={15} /> Tag a ticket
          </button>
          <button type="button" onClick={() => setShowCTAModal(true)} style={primaryButtonStyle} id="corner-raise-cta-btn">
            <Megaphone size={15} /> Raise a CTA
          </button>
        </div>
      </div>

      {/* ─── KPI strip ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 18 }}>
        <KpiCard label="Open threads" value={kpis.open} note="Across both thread types" icon={<MessagesSquare size={13} />} />
        <KpiCard label="Ticket threads" value={kpis.ticketThreads} note="Open, tagged to an INC / SR" icon={<Tag size={13} />} />
        <KpiCard label="Open CTAs" value={kpis.openCtas} note="Action items without a ticket" color="#E97F0A" icon={<Megaphone size={13} />} />
        <KpiCard label="Overdue CTAs" value={kpis.overdueCtas} note="Past due date, not closed" color={kpis.overdueCtas ? '#DE350B' : undefined} icon={<AlertTriangle size={13} />} />
        <KpiCard label="Unread for you" value={kpis.unread} note={me ? `As ${me.name}` : ''} color="#22A06B" icon={<Inbox size={13} />} />
      </div>

      {/* ─── Filter toolbar ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary, #98A2B3)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads, tickets, CTAs, people, message text…"
            style={{ ...inputStyle, paddingLeft: 30 }}
            id="corner-search"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)} style={{ ...inputStyle, width: 'auto' }} aria-label="Thread type">
          <option value="All">All types</option>
          <option value="Ticket">Ticket threads</option>
          <option value="CTA">CTA threads</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} style={{ ...inputStyle, width: 'auto' }} aria-label="Thread status">
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
          <option value="All">All statuses</option>
        </select>
        <select value={sideFilter} onChange={(e) => setSideFilter(e.target.value as SideFilter)} style={{ ...inputStyle, width: 'auto' }} aria-label="Participating side">
          <option value="All">All stakeholders</option>
          <option value="COMPANY">COMPANY involved</option>
          <option value="CONTRACTOR">CONTRACTOR involved</option>
          <option value="THIRD PARTY">Third party involved</option>
        </select>
        <select value={forumFilter} onChange={(e) => setForumFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }} aria-label="Governance forum">
          <option value="All">All forums</option>
          {CORNER_FORUMS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* ─── Channel: list + detail ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 16, alignItems: 'start' }} className="corner-grid">
        {/* Thread list */}
        <div
          className="card"
          style={{
            background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)',
            borderRadius: 10, overflow: 'hidden', maxHeight: 720, display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, #E4E7EC)', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary, #475467)' }}>
            {visibleThreads.length} thread{visibleThreads.length === 1 ? '' : 's'}
          </div>
          <div style={{ overflowY: 'auto' }}>
            {visibleThreads.length === 0 && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary, #98A2B3)', fontSize: '0.8125rem' }}>
                <Inbox size={26} style={{ marginBottom: 8, opacity: 0.6 }} />
                <p style={{ margin: 0 }}>No thread matches these filters.</p>
                <p style={{ margin: '6px 0 0', fontSize: '0.75rem' }}>
                  Tag a ticket or raise a CTA to start the conversation.
                </p>
              </div>
            )}
            {visibleThreads.map((thread) => {
              const unread = isUnread(thread);
              const active = thread.id === selectedId;
              const waiting = waitingOn(thread);
              const ticket = thread.ticketId ? ticketById.get(thread.ticketId) : undefined;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => openThread(thread.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 14px', cursor: 'pointer',
                    border: 'none', borderBottom: '1px solid var(--border, #E4E7EC)', borderLeft: active ? '3px solid var(--noc-deep-blue, #0D4C93)' : '3px solid transparent',
                    background: active ? 'rgba(13,76,147,0.06)' : 'transparent',
                    display: 'block',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    {thread.type === 'Ticket'
                      ? <Chip label={thread.ticketId ?? 'TICKET'} bg="#E6F4FC" color="#0D4C93" title={ticket?.title} />
                      : <Chip label={thread.cta?.ref ?? 'CTA'} bg="#FFF7E6" color="#E97F0A" />}
                    {thread.status === 'Resolved' && <Chip label="RESOLVED" bg="#E3FCEF" color="#22A06B" />}
                    {unread && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#DE350B', marginLeft: 'auto' }} title="Unread activity" />
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: unread ? 800 : 600, color: 'var(--text, #101828)', lineHeight: 1.4 }}>
                    {thread.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', flexWrap: 'wrap' }}>
                    <span>{thread.messages.length} message{thread.messages.length === 1 ? '' : 's'}</span>
                    <span>·</span>
                    <span>{relativeTime(lastActivityAt(thread))}</span>
                    {waiting && (
                      <>
                        <span>·</span>
                        <span style={{ fontWeight: 700, color: SIDE_META[waiting].color }}>
                          waiting on {SIDE_META[waiting].short}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread detail */}
        <div
          className="card"
          style={{
            background: 'var(--card-bg, #FFFFFF)', border: '1px solid var(--border, #E4E7EC)',
            borderRadius: 10, overflow: 'hidden', minHeight: 420,
          }}
        >
          {!selected && (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary, #98A2B3)' }}>
              <MessagesSquare size={34} style={{ opacity: 0.5, marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Pick a thread on the left to read the conversation.</p>
            </div>
          )}

          {selected && (
            <>
              {/* Thread header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border, #E4E7EC)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      <Chip label={selected.type === 'Ticket' ? 'TICKET THREAD' : 'CTA THREAD'} bg="#EEF2F6" color="#475467" />
                      <Chip label={selected.topic} bg="#E6F4FC" color="#0D4C93" />
                      <Chip label={selected.forum} bg="#F4F0FF" color="#6941C6" title="Governance forum this thread is tabled at (SOW App.1 §6.9 / §8.2)" />
                      {selected.status === 'Resolved' && <Chip label="RESOLVED" bg="#E3FCEF" color="#22A06B" />}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text, #101828)', lineHeight: 1.35 }}>
                      {selected.title}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                      {selected.id} · opened by {stakeholderById(selected.openedById)?.name} on {formatCornerTime(selected.openedAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.cta && (
                      <button type="button" onClick={() => setShowEditCTA(true)} style={ghostButtonStyle} id="corner-edit-cta-btn">
                        <PencilLine size={14} /> Update CTA
                      </button>
                    )}
                    {selected.cta && !selected.cta.convertedTicketId && (
                      <button type="button" onClick={() => setShowConvert(true)} style={ghostButtonStyle} id="corner-convert-cta-btn">
                        <TicketCheck size={14} /> Link a ticket
                      </button>
                    )}
                    {selected.status === 'Open' ? (
                      <button
                        type="button"
                        onClick={() => resolveCornerThread(selected.id, activeStakeholderId)}
                        style={primaryButtonStyle}
                        id="corner-resolve-btn"
                      >
                        <CheckCircle2 size={15} /> Mark resolved
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => reopenCornerThread(selected.id, activeStakeholderId)}
                        style={ghostButtonStyle}
                        id="corner-reopen-btn"
                      >
                        <RotateCcw size={14} /> Reopen
                      </button>
                    )}
                  </div>
                </div>

                {/* Ticket context */}
                {selected.ticketId && (() => {
                  const ticket = ticketById.get(selected.ticketId!);
                  return (
                    <div
                      style={{
                        marginTop: 14, padding: '10px 12px', borderRadius: 8,
                        background: 'var(--bg-secondary, #F8FAFC)', border: '1px solid var(--border, #E4E7EC)',
                      }}
                    >
                      {ticket ? (
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)' }}>{ticket.id}</span>
                          <Chip label={ticket.kind} bg="#EEF2F6" color="#475467" />
                          <Chip label={ticket.classification} bg="#FFF7E6" color="#E97F0A" />
                          <Chip label={ticket.status} bg="#E6F4FC" color="#0D4C93" />
                          <span style={{ color: 'var(--text-secondary, #475467)' }}>Owner: <strong>{ticket.owner || 'Unassigned'}</strong></span>
                          <span style={{ color: 'var(--text-secondary, #475467)' }}>Service: {ticket.service}</span>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)', marginLeft: 'auto' }}>
                            Live from the ticket record — status changes stay in the ITSM tool.
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                          Ticket {selected.ticketId} is not in the current data set.
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* CTA context */}
                {selected.cta && (
                  <div
                    style={{
                      marginTop: 14, padding: '10px 12px', borderRadius: 8,
                      background: 'var(--bg-secondary, #F8FAFC)',
                      border: `1px solid ${isCtaOverdue(selected) ? '#F8B4A0' : 'var(--border, #E4E7EC)'}`,
                      display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E97F0A' }}>{selected.cta.ref}</span>
                    <Chip
                      label={selected.cta.status}
                      bg={CTA_STATUS_STYLE[selected.cta.status].bg}
                      color={CTA_STATUS_STYLE[selected.cta.status].color}
                    />
                    <Chip label={`${selected.cta.priority} priority`} bg="#EEF2F6" color="#475467" />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary, #475467)' }}>
                      <CalendarClock size={13} /> Due {selected.cta.dueDate}
                      {isCtaOverdue(selected) && <strong style={{ color: '#DE350B' }}>· overdue</strong>}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #475467)' }}>
                      Owner: <strong>{stakeholderById(selected.cta.ownerId)?.name}</strong>
                      <SideBadge id={selected.cta.ownerId} compact />
                    </span>
                    {selected.cta.convertedTicketId && (
                      <span style={{ marginLeft: 'auto', color: 'var(--text-secondary, #475467)' }}>
                        Raised as <strong style={{ fontFamily: 'monospace' }}>{selected.cta.convertedTicketId}</strong> — the ticket carries the SLA
                      </span>
                    )}
                  </div>
                )}

                {/* Participants */}
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary, #98A2B3)' }}>
                    Participants
                  </span>
                  {selected.participantIds.map((id) => (
                    <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)' }}>
                      {stakeholderById(id)?.name ?? id}
                      <SideBadge id={id} compact />
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesRef} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 420, overflowY: 'auto' }}>
                {selected.messages.map((message) => {
                  const author = stakeholderById(message.authorId);
                  const mine = message.authorId === activeStakeholderId;
                  if (message.kind === 'system') {
                    return (
                      <div key={message.id} style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', textAlign: 'center', fontStyle: 'italic' }}>
                        {author?.name ?? message.authorId} — <MessageBody body={message.body} /> · {formatCornerTime(message.postedAt)}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={message.id}
                      style={{
                        padding: '11px 13px',
                        borderRadius: 8,
                        background: mine ? 'rgba(13,76,147,0.05)' : 'var(--bg-secondary, #F8FAFC)',
                        border: '1px solid var(--border, #E4E7EC)',
                        borderLeft: `3px solid ${author ? SIDE_META[author.side].color : 'var(--border, #E4E7EC)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--text, #101828)' }}>{author?.name ?? message.authorId}</strong>
                        <SideBadge id={message.authorId} compact />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)' }}>{author?.title}</span>
                        {message.kind === 'decision' && <Chip label="DECISION" bg="#E3FCEF" color="#22A06B" />}
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)', marginLeft: 'auto' }}>
                          {formatCornerTime(message.postedAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text, #101828)', lineHeight: 1.6 }}>
                        <MessageBody body={message.body} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border, #E4E7EC)', background: 'var(--bg-secondary, #F8FAFC)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary, #475467)' }}>
                    Replying as <strong>{me?.name}</strong>
                  </span>
                  {me && <SideBadge id={me.id} compact />}
                </div>
                <MentionTextarea
                  id="corner-composer"
                  value={draft}
                  onChange={setDraft}
                  rows={3}
                  placeholder="Write a reply — type @ to mention someone…"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                    Collaboration record only — no SLA effect (SOW App.1 §10.1).
                  </span>
                  <button
                    type="button"
                    onClick={post}
                    disabled={!draft.trim()}
                    style={{ ...primaryButtonStyle, opacity: draft.trim() ? 1 : 0.5, cursor: draft.trim() ? 'pointer' : 'not-allowed' }}
                    id="corner-post-btn"
                  >
                    <Send size={15} /> Post reply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────── */}
      {showTicketModal && (
        <NewTicketThreadModal
          tickets={tickets}
          authorId={activeStakeholderId}
          onClose={() => setShowTicketModal(false)}
          onSubmit={(payload) => {
            const created = createTicketThread(payload);
            setShowTicketModal(false);
            openThread(created.id);
          }}
        />
      )}
      {showCTAModal && (
        <NewCTAModal
          authorId={activeStakeholderId}
          onClose={() => setShowCTAModal(false)}
          onSubmit={(payload) => {
            const created = createCTAThread(payload);
            setShowCTAModal(false);
            openThread(created.id);
          }}
        />
      )}
      {showEditCTA && selected?.cta && (
        <EditCTAModal
          thread={selected}
          onClose={() => setShowEditCTA(false)}
          onSubmit={(patch) => {
            updateCTA(selected.id, patch, activeStakeholderId);
            setShowEditCTA(false);
          }}
        />
      )}
      {showConvert && selected?.cta && (
        <ConvertCTAModal
          thread={selected}
          tickets={tickets}
          onClose={() => setShowConvert(false)}
          onSubmit={(ticketId) => {
            linkCtaToTicket(selected.id, ticketId, activeStakeholderId);
            setShowConvert(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomerCorner;
