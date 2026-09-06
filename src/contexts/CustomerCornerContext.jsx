/**
 * EDGE AMS Control Tower — Customer Corner State Context
 *
 * React context provider managing all Customer Corner state:
 * threads, active persona, read state, and all mutators.
 * Persisted to localStorage with EDGE-specific keys.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  seedCornerThreads, nextThreadId, nextCtaRef, nextMessageId,
} from '../data/customerCornerData';

const STORAGE_KEYS = {
  threads: 'edge-customer-corner',
  persona: 'edge-corner-persona',
  read: 'edge-corner-read',
};

const CustomerCornerContext = createContext(null);

export function CustomerCornerProvider({ children }) {
  // ─── Corner threads ────────────────────────────────────────────────────
  const [cornerThreads, setCornerThreads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.threads);
      return saved ? JSON.parse(saved) : seedCornerThreads;
    } catch {
      return seedCornerThreads;
    }
  });

  // ─── Active persona ────────────────────────────────────────────────────
  const [activeStakeholderId, setActiveStakeholderId] = useState(
    () => localStorage.getItem(STORAGE_KEYS.persona) || 'EDGE-01'
  );

  // ─── Per-persona read state ────────────────────────────────────────────
  // Shape: { [stakeholderId]: { [threadId]: isoTimestamp } }
  const [cornerReadAll, setCornerReadAll] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.read);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ─── Persistence ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.threads, JSON.stringify(cornerThreads));
  }, [cornerThreads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.persona, activeStakeholderId);
  }, [activeStakeholderId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.read, JSON.stringify(cornerReadAll));
  }, [cornerReadAll]);

  // Derived: read state for the active persona
  const cornerReadState = cornerReadAll[activeStakeholderId] ?? {};

  // ─── Helpers ───────────────────────────────────────────────────────────
  const now = () => new Date().toISOString();

  const withParticipants = (thread, ids) =>
    Array.from(new Set([...thread.participantIds, ...ids]));

  const appendMessage = (thread, draft) => ({
    ...thread,
    participantIds: withParticipants(thread, [draft.authorId, ...draft.mentions]),
    messages: [
      ...thread.messages,
      {
        id: nextMessageId(thread),
        authorId: draft.authorId,
        body: draft.body,
        postedAt: now(),
        mentions: draft.mentions,
        kind: draft.kind ?? 'comment',
      },
    ],
  });

  // ─── Mutators ──────────────────────────────────────────────────────────

  const createTicketThread = useCallback((draft) => {
    const thread = {
      id: nextThreadId(cornerThreads),
      type: 'Ticket',
      title: draft.title,
      topic: draft.topic,
      forum: draft.forum,
      ticketId: draft.ticketId,
      openedById: draft.openedById,
      openedAt: now(),
      status: 'Open',
      participantIds: Array.from(new Set([draft.openedById, ...draft.mentions])),
      messages: [],
    };
    const seeded = appendMessage(thread, {
      authorId: draft.openedById,
      body: draft.body,
      mentions: draft.mentions,
    });
    setCornerThreads((prev) => [seeded, ...prev]);
    return seeded;
  }, [cornerThreads]);

  const createCTAThread = useCallback((draft) => {
    const thread = {
      id: nextThreadId(cornerThreads),
      type: 'CTA',
      title: draft.title,
      topic: draft.topic,
      forum: draft.forum,
      cta: {
        ref: nextCtaRef(cornerThreads),
        ownerId: draft.ownerId,
        dueDate: draft.dueDate,
        status: 'Open',
        priority: draft.priority,
      },
      openedById: draft.openedById,
      openedAt: now(),
      status: 'Open',
      participantIds: Array.from(new Set([draft.openedById, draft.ownerId, ...draft.mentions])),
      messages: [],
    };
    const seeded = appendMessage(thread, {
      authorId: draft.openedById,
      body: draft.body,
      mentions: draft.mentions,
    });
    setCornerThreads((prev) => [seeded, ...prev]);
    return seeded;
  }, [cornerThreads]);

  const postCornerMessage = useCallback((threadId, draft) => {
    setCornerThreads((prev) =>
      prev.map((t) => (t.id === threadId ? appendMessage(t, draft) : t))
    );
  }, []);

  const resolveCornerThread = useCallback((threadId, byId) => {
    setCornerThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const noted = appendMessage(t, {
          authorId: byId,
          body: 'Marked this thread resolved.',
          mentions: [],
          kind: 'system',
        });
        return { ...noted, status: 'Resolved', resolvedAt: now(), resolvedById: byId };
      })
    );
  }, []);

  const reopenCornerThread = useCallback((threadId, byId) => {
    setCornerThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const noted = appendMessage(t, {
          authorId: byId,
          body: 'Reopened this thread.',
          mentions: [],
          kind: 'system',
        });
        return { ...noted, status: 'Open', resolvedAt: undefined, resolvedById: undefined };
      })
    );
  }, []);

  const updateCTA = useCallback((threadId, patch, byId) => {
    setCornerThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId || !t.cta) return t;
        const changes = [];
        if (patch.status && patch.status !== t.cta.status) changes.push(`status → ${patch.status}`);
        if (patch.ownerId && patch.ownerId !== t.cta.ownerId) changes.push('owner reassigned');
        if (patch.dueDate && patch.dueDate !== t.cta.dueDate) changes.push(`due date → ${patch.dueDate}`);
        if (patch.priority && patch.priority !== t.cta.priority) changes.push(`priority → ${patch.priority}`);
        const updated = { ...t, cta: { ...t.cta, ...patch } };
        if (!changes.length) return updated;
        return appendMessage(updated, {
          authorId: byId,
          body: `Updated the CTA: ${changes.join(', ')}.`,
          mentions: [],
          kind: 'system',
        });
      })
    );
  }, []);

  const linkCtaToTicket = useCallback((threadId, ticketId, byId) => {
    setCornerThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId || !t.cta) return t;
        const updated = { ...t, cta: { ...t.cta, convertedTicketId: ticketId } };
        return appendMessage(updated, {
          authorId: byId,
          body: `Raised as ticket ${ticketId}. The ticket now carries the service level; this thread stays as the conversation record.`,
          mentions: [],
          kind: 'system',
        });
      })
    );
  }, []);

  const markCornerThreadRead = useCallback((threadId) => {
    setCornerReadAll((prev) => ({
      ...prev,
      [activeStakeholderId]: { ...(prev[activeStakeholderId] ?? {}), [threadId]: now() },
    }));
  }, [activeStakeholderId]);

  return (
    <CustomerCornerContext.Provider
      value={{
        cornerThreads,
        activeStakeholderId,
        setActiveStakeholderId,
        cornerReadState,
        createTicketThread,
        createCTAThread,
        postCornerMessage,
        resolveCornerThread,
        reopenCornerThread,
        updateCTA,
        linkCtaToTicket,
        markCornerThreadRead,
      }}
    >
      {children}
    </CustomerCornerContext.Provider>
  );
}

export function useCustomerCorner() {
  const context = useContext(CustomerCornerContext);
  if (!context) {
    throw new Error('useCustomerCorner must be used within a CustomerCornerProvider');
  }
  return context;
}
