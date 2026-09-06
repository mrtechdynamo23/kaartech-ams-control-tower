/**
 * EDGE AMS Control Tower — Customer Corner (Collaboration Workspace)
 * Route: /customer/corner
 *
 * Stakeholder collaboration workspace with thread list + conversation detail.
 * Supports Ticket Threads (tagged to existing INC/SR) and CTA Threads.
 * Fully aligned with EDGE enterprise dark & light design system.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MessagesSquare, Tag, Megaphone, Search, CheckCircle2, RotateCcw, PencilLine,
  TicketCheck, Send, Users, CalendarClock, AlertTriangle, Inbox,
} from 'lucide-react';
import { useCustomerCorner } from '../../contexts/CustomerCornerContext';
import {
  cornerStakeholders, stakeholderById, SIDE_META, CORNER_FORUMS, STAKEHOLDER_SIDES,
  lastActivityAt, waitingOn, isCtaOverdue, buildTicketRefs,
} from '../../data/customerCornerData';
import {
  SideBadge, formatCornerTime, relativeTime, MentionTextarea, extractMentions,
  primaryButtonStyle, ghostButtonStyle, inputStyle, CustomerCornerDropdown,
} from '../../components/customer/CornerShared';
import { NewTicketThreadModal, NewCTAModal, EditCTAModal, ConvertCTAModal } from '../../components/customer/CornerModals';
import '../../components/customer/CustomerCorner.css';

// ─── MessageBody — highlights @mentions ──────────────────────────────────────

function MessageBody({ body }) {
  const names = cornerStakeholders.map((s) => s.name).sort((a, b) => b.length - a.length);
  const nodes = [];
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
      <strong key={key++} style={{ color: 'var(--edge-primary, #FF5622)', fontWeight: 600 }}>
        @{hit.name}
      </strong>
    );
    rest = rest.slice(hit.at + hit.name.length + 1);
  }

  return <span style={{ whiteSpace: 'pre-wrap' }}>{nodes}</span>;
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, note, numColor = 'var(--text-primary, #F1F3F5)', icon }) {
  return (
    <div
      className="chart-card"
      style={{
        padding: '12px 14px',
        borderRadius: 8,
        background: 'var(--bg-card, #14181E)',
        border: '1px solid var(--border-secondary, #21262E)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #9CA3AB)' }}>
        {icon}
        <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: numColor, marginTop: 4, lineHeight: 1.2 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', marginTop: 3 }}>
        {note}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CustomerCornerPage() {
  const {
    cornerThreads, activeStakeholderId, setActiveStakeholderId,
    cornerReadState, createTicketThread, createCTAThread, postCornerMessage,
    resolveCornerThread, reopenCornerThread, updateCTA, linkCtaToTicket, markCornerThreadRead,
  } = useCustomerCorner();

  // Select the most recently active OPEN thread by default
  const [selectedId, setSelectedId] = useState(() => {
    const byActivity = [...cornerThreads].sort(
      (a, b) => new Date(lastActivityAt(b)).getTime() - new Date(lastActivityAt(a)).getTime()
    );
    return (byActivity.find((t) => t.status === 'Open') ?? byActivity[0])?.id ?? null;
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Open');
  const [sideFilter, setSideFilter] = useState('All');
  const [forumFilter, setForumFilter] = useState('All');
  const [draft, setDraft] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCTAModal, setShowCTAModal] = useState(false);
  const [showEditCTA, setShowEditCTA] = useState(false);
  const [showConvert, setShowConvert] = useState(false);

  const messagesRef = useRef(null);
  const tickets = useMemo(() => buildTicketRefs(), []);
  const ticketById = useMemo(() => new Map(tickets.map((t) => [t.id, t])), [tickets]);
  const me = stakeholderById(activeStakeholderId);

  // Grouped persona options for custom dropdown
  const personaGroups = useMemo(() => {
    return STAKEHOLDER_SIDES.map((side) => ({
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
  }, []);

  // Filter options for custom dropdowns
  const typeFilterOptions = useMemo(() => [
    { value: 'All', label: 'All Types' },
    { value: 'Ticket', label: 'Ticket Threads' },
    { value: 'CTA', label: 'CTA Threads' },
  ], []);

  const statusFilterOptions = useMemo(() => [
    { value: 'Open', label: 'Open' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'All', label: 'All Statuses' },
  ], []);

  const sideFilterOptions = useMemo(() => [
    { value: 'All', label: 'All Stakeholders' },
    { value: 'EDGE', label: 'EDGE involved' },
    { value: 'AMS', label: 'AMS involved' },
    { value: 'THIRD PARTY', label: 'Third Party involved' },
  ], []);

  const forumFilterOptions = useMemo(() => [
    { value: 'All', label: 'All Forums' },
    ...CORNER_FORUMS.map((f) => ({ value: f, label: f })),
  ], []);

  // Unread logic (Section 14: persona-specific, excludes user's own latest message)
  const isUnread = useCallback((thread) => {
    if (!thread || !thread.messages || thread.messages.length === 0) return false;
    const lastMsg = thread.messages[thread.messages.length - 1];
    if (lastMsg && lastMsg.authorId === activeStakeholderId) return false;
    const readAt = cornerReadState[thread.id];
    if (!readAt) return true;
    return new Date(lastActivityAt(thread)).getTime() > new Date(readAt).getTime();
  }, [cornerReadState, activeStakeholderId]);

  // Filtered threads
  const visibleThreads = useMemo(() => {
    return cornerThreads
      .filter((t) => {
        if (typeFilter !== 'All' && t.type !== typeFilter) return false;
        if (statusFilter !== 'All' && t.status !== statusFilter) return false;
        if (sideFilter !== 'All') {
          const threadSides = new Set(
            t.participantIds.map((pid) => stakeholderById(pid)?.side).filter(Boolean)
          );
          if (!threadSides.has(sideFilter)) return false;
        }
        if (forumFilter !== 'All' && t.forum !== forumFilter) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchTopic = t.topic.toLowerCase().includes(q);
          const matchForum = t.forum.toLowerCase().includes(q);
          const matchId = t.id.toLowerCase().includes(q);
          const matchTicket = t.ticketId && t.ticketId.toLowerCase().includes(q);
          const matchCta = t.cta && t.cta.ref.toLowerCase().includes(q);
          const matchParticipants = t.participantIds.some((pid) =>
            stakeholderById(pid)?.name.toLowerCase().includes(q)
          );
          const matchMessages = t.messages.some((m) => m.body.toLowerCase().includes(q));
          if (!matchTitle && !matchTopic && !matchForum && !matchId && !matchTicket && !matchCta && !matchParticipants && !matchMessages) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(lastActivityAt(b)).getTime() - new Date(lastActivityAt(a)).getTime());
  }, [cornerThreads, search, typeFilter, statusFilter, sideFilter, forumFilter]);

  const selected = cornerThreads.find((t) => t.id === selectedId) ?? null;

  // Auto-select first thread if current selection filtered out
  useEffect(() => {
    if (visibleThreads.length > 0 && !visibleThreads.some((t) => t.id === selectedId)) {
      setSelectedId(visibleThreads[0].id);
    }
  }, [visibleThreads, selectedId]);

  const openThread = (id) => {
    setSelectedId(id);
    markCornerThreadRead(id);
  };

  // KPIs calculation
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

  // Post message handler
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
    <div className="page-container animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* ─── Page header ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessagesSquare size={22} style={{ color: 'var(--edge-primary, #FF5622)' }} />
            Customer Corner
          </h1>
          <p className="page-subtitle" style={{ maxWidth: 760 }}>
            One collaboration channel for every stakeholder — EDGE, AMS and third parties.
            Tag a ticket to talk about work already in the queue, or raise a Call To Action for work that
            has no ticket behind it yet.
          </p>
        </div>

        {/* Action Group: POSTING AS | TAG A TICKET | RAISE A CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: '0 1 auto',
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
          {/* Custom Posting As Dropdown (Controlled trigger width + anchored popover menu) */}
          <CustomerCornerDropdown
            id="corner-persona"
            label="Posting as"
            icon={<Users size={14} style={{ color: 'var(--text-secondary, #9CA3AB)' }} />}
            value={activeStakeholderId}
            onChange={setActiveStakeholderId}
            groups={personaGroups}
            width={240}
            menuWidth={340}
            align="right"
            showSublabelInTrigger={false}
            ariaLabel="Select stakeholder persona"
          />

          {/* Secondary neutral button: Tag a Ticket */}
          <button
            type="button"
            onClick={() => setShowTicketModal(true)}
            style={ghostButtonStyle}
            id="corner-tag-ticket-btn"
          >
            <Tag size={15} /> Tag a Ticket
          </button>

          {/* Primary EDGE orange button: Raise a CTA */}
          <button
            type="button"
            onClick={() => setShowCTAModal(true)}
            style={primaryButtonStyle}
            id="corner-raise-cta-btn"
          >
            <Megaphone size={15} /> Raise a CTA
          </button>
        </div>
      </div>

      {/* ─── KPI strip (Mostly Neutral, Semantic numbers only) ───────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 18 }}>
        <KpiCard
          label="Open Threads"
          value={kpis.open}
          note="Across both thread types"
          numColor="var(--text-primary, #F1F3F5)"
          icon={<MessagesSquare size={13} />}
        />
        <KpiCard
          label="Ticket Threads"
          value={kpis.ticketThreads}
          note="Open, tagged to an INC / SR"
          numColor="#60A5FA"
          icon={<Tag size={13} />}
        />
        <KpiCard
          label="Open CTAs"
          value={kpis.openCtas}
          note="Action items without a ticket"
          numColor="#FBBF24"
          icon={<Megaphone size={13} />}
        />
        <KpiCard
          label="Overdue CTAs"
          value={kpis.overdueCtas}
          note="Past due date, not closed"
          numColor={kpis.overdueCtas > 0 ? '#F87171' : 'var(--text-primary, #F1F3F5)'}
          icon={<AlertTriangle size={13} />}
        />
        <KpiCard
          label="Unread for You"
          value={kpis.unread}
          note={me ? `As ${me.name}` : ''}
          numColor={kpis.unread > 0 ? '#34D399' : 'var(--text-primary, #F1F3F5)'}
          icon={<Inbox size={13} />}
        />
      </div>

      {/* ─── Filter toolbar (Custom Controlled Dropdowns) ─────────────── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
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
            placeholder="Search threads, tickets, CTAs, people, message text…"
            className="corner-input"
            style={{ paddingLeft: 32 }}
            id="corner-search"
          />
        </div>

        <CustomerCornerDropdown
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeFilterOptions}
          width={145}
          ariaLabel="Filter by thread type"
        />

        <CustomerCornerDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusFilterOptions}
          width={135}
          ariaLabel="Filter by status"
        />

        <CustomerCornerDropdown
          value={sideFilter}
          onChange={setSideFilter}
          options={sideFilterOptions}
          width={165}
          ariaLabel="Filter by stakeholder"
        />

        <CustomerCornerDropdown
          value={forumFilter}
          onChange={setForumFilter}
          options={forumFilterOptions}
          width={185}
          ariaLabel="Filter by governance forum"
        />
      </div>

      {/* ─── Channel: list + detail ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 16, alignItems: 'start' }} className="corner-grid">
        {/* Thread list */}
        <div
          className="chart-card"
          style={{
            overflow: 'hidden',
            maxHeight: 720,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            background: 'var(--bg-card, #14181E)',
            border: '1px solid var(--border-secondary, #21262E)',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-secondary, #21262E)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-secondary, #9CA3AB)',
            }}
          >
            {visibleThreads.length} Thread{visibleThreads.length === 1 ? '' : 's'}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }} className="corner-custom-scrollbar">
            {visibleThreads.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary, #6B7280)' }}>
                <p style={{ margin: 0, fontSize: '0.8125rem' }}>No threads match these filters.</p>
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
              const isTicket = thread.type === 'Ticket';
              const refId = isTicket ? (thread.ticketId || thread.id) : (thread.cta?.ref || thread.id);
              const priority = isTicket ? (ticket?.priority || ticket?.classification) : thread.cta?.priority;
              const isHighPriority = priority === 'P1' || priority === 'P2' || priority === 'High' || priority === 'Critical';
              const isOverdue = thread.cta && isCtaOverdue(thread);

              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => openThread(thread.id)}
                  className={`corner-thread-row ${active ? 'active' : ''}`}
                >
                  {/* Top Line: Prominent Reference ID + Thread Type + Priority/Status + Unread dot */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        color: isTicket ? 'var(--edge-primary, #FF5622)' : '#FBBF24',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {refId}
                    </span>

                    <span
                      className={isTicket ? 'corner-badge-ticket' : 'corner-badge-cta'}
                      style={{ fontSize: '0.625rem', fontWeight: 600 }}
                    >
                      {isTicket ? 'Ticket Thread' : 'CTA Thread'}
                    </span>

                    {priority && (
                      <span
                        className={`corner-side-badge ${isTicket ? `corner-priority-${priority.toLowerCase()}` : `corner-priority-${priority === 'High' ? 'p1' : 'p3'}`}`}
                        style={{
                          fontWeight: isHighPriority ? 800 : 600,
                          fontSize: '0.625rem',
                        }}
                      >
                        {priority}
                      </span>
                    )}

                    {isOverdue && (
                      <span
                        className="corner-side-badge corner-status-overdue"
                        style={{ fontWeight: 800, fontSize: '0.625rem' }}
                      >
                        OVERDUE
                      </span>
                    )}

                    {thread.status === 'Resolved' && (
                      <span className="corner-badge-decision">RESOLVED</span>
                    )}

                    {unread && (
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: 'var(--edge-primary, #FF5622)',
                          marginLeft: 'auto',
                          boxShadow: '0 0 6px rgba(255, 86, 34, 0.6)',
                        }}
                        title="Unread activity"
                      />
                    )}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: unread ? 700 : 500,
                      color: 'var(--text-primary, #F1F3F5)',
                      lineHeight: 1.4,
                      marginBottom: 5,
                    }}
                  >
                    {thread.title}
                  </div>

                  {/* Topic & Forum line */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="corner-badge-topic" style={{ fontSize: '0.5625rem' }}>
                      {thread.topic}
                    </span>
                    <span className="corner-badge-forum" style={{ fontSize: '0.5625rem' }}>
                      {thread.forum}
                    </span>
                  </div>

                  {/* Operational Footer: Message count, relative age, waiting side */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.6875rem',
                      color: 'var(--text-tertiary, #6B7280)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>{thread.messages.length} message{thread.messages.length === 1 ? '' : 's'}</span>
                    <span>·</span>
                    <span>{relativeTime(lastActivityAt(thread))}</span>
                    {waiting && (
                      <>
                        <span>·</span>
                        <span
                          style={{
                            fontWeight: 600,
                            color: waiting === 'EDGE' ? '#93C5FD' : waiting === 'AMS' ? '#6EE7B7' : '#D1D5DB',
                          }}
                        >
                          Waiting on {SIDE_META[waiting]?.short || waiting}
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
          className="chart-card"
          style={{
            overflow: 'hidden',
            minHeight: 420,
            padding: 0,
            background: 'var(--bg-card, #14181E)',
            border: '1px solid var(--border-secondary, #21262E)',
          }}
        >
          {!selected && (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary, #6B7280)' }}>
              <MessagesSquare size={34} style={{ opacity: 0.5, marginBottom: 10 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Pick a thread on the left to read the conversation.</p>
            </div>
          )}

          {selected && (
            <>
              {/* Thread header */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-secondary, #21262E)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 320px' }}>
                    {/* Hierarchy line 1: Thread Type + Topic + Forum + Decision */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className={selected.type === 'Ticket' ? 'corner-badge-ticket' : 'corner-badge-cta'} style={{ fontWeight: 700 }}>
                        {selected.type === 'Ticket' ? 'TICKET THREAD' : 'CTA THREAD'}
                      </span>
                      <span className="corner-badge-topic">{selected.topic}</span>
                      <span className="corner-badge-forum" title="Governance forum this thread is tabled at">
                        {selected.forum}
                      </span>
                      {selected.status === 'Resolved' && (
                        <span className="corner-badge-decision">RESOLVED</span>
                      )}
                    </div>

                    {/* Hierarchy line 2: Prominent Reference ID + Status line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono, monospace)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: selected.type === 'Ticket' ? 'var(--edge-primary, #FF5622)' : '#FBBF24',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {selected.type === 'Ticket' ? (selected.ticketId || selected.id) : (selected.cta?.ref || selected.id)}
                      </span>

                      <span className={`corner-side-badge corner-status-${selected.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {selected.status}
                      </span>

                      {selected.cta && (
                        <>
                          <span className="corner-badge-topic">
                            {selected.cta.priority} Priority
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #9CA3AB)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CalendarClock size={12} /> Due {selected.cta.dueDate}
                          </span>
                          {isCtaOverdue(selected) && (
                            <span
                              className="corner-side-badge corner-status-overdue"
                              style={{ fontWeight: 800, letterSpacing: '0.04em' }}
                            >
                              OVERDUE
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Hierarchy line 3: Title */}
                    <h2 style={{ margin: '0 0 6px', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary, #F1F3F5)', lineHeight: 1.35 }}>
                      {selected.title}
                    </h2>

                    {/* Hierarchy line 4: Reference lineage and owner */}
                    <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)' }}>
                      Thread {selected.id} · Opened by <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{stakeholderById(selected.openedById)?.name}</strong> on {formatCornerTime(selected.openedAt)}
                      {selected.cta && selected.cta.ownerId && (
                        <> · CTA Owner: <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{stakeholderById(selected.cta.ownerId)?.name}</strong></>
                      )}
                    </p>
                  </div>

                  {/* Header Actions */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selected.cta && (
                      <button
                        type="button"
                        onClick={() => setShowEditCTA(true)}
                        style={ghostButtonStyle}
                        id="corner-edit-cta-btn"
                      >
                        <PencilLine size={14} /> Update CTA
                      </button>
                    )}
                    {selected.cta && !selected.cta.convertedTicketId && (
                      <button
                        type="button"
                        onClick={() => setShowConvert(true)}
                        style={ghostButtonStyle}
                        id="corner-convert-cta-btn"
                      >
                        <TicketCheck size={14} /> Link a Ticket
                      </button>
                    )}
                    {selected.status === 'Open' ? (
                      <button
                        type="button"
                        onClick={() => resolveCornerThread(selected.id, activeStakeholderId)}
                        style={{
                          ...ghostButtonStyle,
                          color: '#34D399',
                          borderColor: 'rgba(16, 185, 129, 0.35)',
                          background: 'rgba(16, 185, 129, 0.08)',
                        }}
                        id="corner-resolve-btn"
                      >
                        <CheckCircle2 size={14} /> Mark Resolved
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

                {/* Ticket context strip */}
                {selected.ticketId && (() => {
                  const ticket = ticketById.get(selected.ticketId);
                  return (
                    <div
                      style={{
                        marginTop: 14,
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-secondary, #14181E)',
                        border: '1px solid var(--border-secondary, #21262E)',
                      }}
                    >
                      {ticket ? (
                        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', fontSize: '0.75rem' }}>
                          <span className="corner-ticket-id">{ticket.id}</span>
                          <span className="corner-badge-topic">{ticket.kind}</span>
                          <span className={`corner-side-badge corner-priority-${(ticket.priority || ticket.classification || 'p3').toLowerCase()}`}>
                            {ticket.priority || ticket.classification}
                          </span>
                          <span className={`corner-side-badge corner-status-${(ticket.status || 'new').toLowerCase().replace(/\s+/g, '-')}`}>
                            {ticket.status}
                          </span>
                          <span style={{ color: 'var(--text-secondary, #9CA3AB)' }}>
                            Owner: <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{ticket.owner || 'Unassigned'}</strong>
                          </span>
                          <span style={{ color: 'var(--text-secondary, #9CA3AB)' }}>
                            Service: <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{ticket.service}</strong>
                          </span>
                          <span style={{ color: 'var(--text-tertiary, #6B7280)', marginLeft: 'auto', fontSize: '0.6875rem' }}>
                            Live from the ticket record — status changes stay in the ITSM tool.
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #6B7280)' }}>
                          Ticket {selected.ticketId} is not in the current data set.
                        </span>
                      )}
                    </div>
                  );
                })()}

                {/* CTA context strip (Semantic restraint, NOT a red warning panel) */}
                {selected.cta && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-secondary, #14181E)',
                      border: '1px solid var(--border-secondary, #21262E)',
                      display: 'flex',
                      gap: 14,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: '#FBBF24' }}>
                      {selected.cta.ref}
                    </span>
                    <span className={`corner-side-badge corner-status-${selected.cta.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {selected.cta.status}
                    </span>
                    <span className="corner-badge-topic">
                      {selected.cta.priority} priority
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary, #9CA3AB)' }}>
                      <CalendarClock size={13} /> Due {selected.cta.dueDate}
                      {isCtaOverdue(selected) && (
                        <strong style={{ color: '#F87171', marginLeft: 4 }}>· overdue</strong>
                      )}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #9CA3AB)' }}>
                      Owner: <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{stakeholderById(selected.cta.ownerId)?.name}</strong>
                      <SideBadge id={selected.cta.ownerId} compact />
                    </span>
                    {selected.cta.convertedTicketId && (
                      <span style={{ marginLeft: 'auto', color: 'var(--text-secondary, #9CA3AB)' }}>
                        Raised as <strong className="corner-ticket-id">{selected.cta.convertedTicketId}</strong> — ticket carries SLA
                      </span>
                    )}
                  </div>
                )}

                {/* Participants */}
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary, #6B7280)' }}>
                    Participants
                  </span>
                  {selected.participantIds.map((id) => (
                    <span
                      key={id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.6875rem',
                        color: 'var(--text-secondary, #9CA3AB)',
                      }}
                    >
                      {stakeholderById(id)?.name ?? id}
                      <SideBadge id={id} compact />
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages (NO colored left borders!) */}
              <div
                ref={messagesRef}
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  maxHeight: 420,
                  overflowY: 'auto',
                }}
                className="corner-custom-scrollbar"
              >
                {selected.messages.map((message) => {
                  const author = stakeholderById(message.authorId);
                  if (message.kind === 'system') {
                    return (
                      <div
                        key={message.id}
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-tertiary, #6B7280)',
                          textAlign: 'center',
                          fontStyle: 'italic',
                          padding: '4px 0',
                        }}
                      >
                        {author?.name ?? message.authorId} — <MessageBody body={message.body} /> · {formatCornerTime(message.postedAt)}
                      </div>
                    );
                  }
                  const side = author?.side || 'THIRD PARTY';
                  const accentClass = side === 'EDGE' ? 'accent-edge' : side === 'AMS' ? 'accent-ams' : 'accent-third-party';
                  return (
                    <div key={message.id} className={`corner-message-card ${accentClass}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                        <strong style={{ fontSize: '0.8125rem', color: 'var(--text-primary, #F1F3F5)' }}>
                          {author?.name ?? message.authorId}
                        </strong>
                        <SideBadge id={message.authorId} compact />
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)' }}>
                          {author?.title}
                        </span>
                        {message.kind === 'decision' && (
                          <span className="corner-badge-decision">DECISION</span>
                        )}
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)', marginLeft: 'auto' }}>
                          {formatCornerTime(message.postedAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary, #F1F3F5)', lineHeight: 1.6 }}>
                        <MessageBody body={message.body} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div
                style={{
                  padding: '14px 18px',
                  borderTop: '1px solid var(--border-secondary, #21262E)',
                  background: 'var(--bg-secondary, #14181E)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary, #9CA3AB)' }}>
                    Replying as <strong style={{ color: 'var(--text-primary, #F1F3F5)' }}>{me?.name}</strong>
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
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #6B7280)' }}>
                    Collaboration record only — no SLA effect.
                  </span>
                  <button
                    type="button"
                    onClick={post}
                    disabled={!draft.trim()}
                    style={{
                      ...primaryButtonStyle,
                      opacity: draft.trim() ? 1 : 0.5,
                      cursor: draft.trim() ? 'pointer' : 'not-allowed',
                    }}
                    id="corner-post-btn"
                  >
                    <Send size={15} /> Post Reply
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
            createTicketThread(payload);
            setShowTicketModal(false);
          }}
        />
      )}

      {showCTAModal && (
        <NewCTAModal
          authorId={activeStakeholderId}
          onClose={() => setShowCTAModal(false)}
          onSubmit={(payload) => {
            createCTAThread(payload);
            setShowCTAModal(false);
          }}
        />
      )}

      {showEditCTA && selected?.cta && (
        <EditCTAModal
          thread={selected}
          onClose={() => setShowEditCTA(false)}
          onSubmit={(fields) => {
            updateCTA(selected.id, fields, activeStakeholderId);
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
}
