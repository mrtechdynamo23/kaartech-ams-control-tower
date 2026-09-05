/**
 * EDGE AMS Control Tower — AI Assistant Drawer (Section 62)
 * Deterministic operational assistant with prompt chips, deep data querying, and live links.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, X, Send, Sparkles, ArrowRight, Shield, AlertTriangle,
  CheckCircle2, FileText, ChevronRight, RefreshCw, MessageSquare
} from 'lucide-react';
import { incidents, serviceRequests, risks, licenses, getIncidentStats } from '../../data/demoData';

const DEFAULT_QUESTIONS = [
  { text: 'What is our current P1 resolution SLA status?', query: 'p1_sla' },
  { text: 'Show all open tickets for Halcon', query: 'halcon_tickets' },
  { text: 'Which applications have license renewals in 30 days?', query: 'license_risk' },
  { text: 'Generate DFR Executive Summary', query: 'dfr_summary' },
  { text: 'What is our current onshore vs offshore ratio?', query: 'resource_ratio' },
];

export default function AssistantChatDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Marhaban! I am the EDGE AMS Operational Intelligence Assistant. How can I assist with governance, SLA tracking, or application estate operations today?',
      timestamp: 'Just now',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const processQuery = (rawQuery) => {
    const q = rawQuery.toLowerCase();
    const stats = getIncidentStats();

    if (q.includes('p1') || q.includes('sla')) {
      const p1List = incidents.filter(i => i.priority === 'P1');
      const breached = p1List.filter(i => i.slaStatus === 'Breached');
      return {
        text: `Currently, P1 Resolution SLA attainment is at **${stats.p1ResolutionSla}%** (Target: 95%). There are **${p1List.length} total P1 incidents**, with ${breached.length} breach(es) and ${p1List.length - breached.length} resolved/on-track.`,
        actionLabel: 'View P1 Incidents in Command Center',
        actionPath: '/command-center/incidents',
        highlight: stats.p1ResolutionSla >= 95 ? 'success' : 'warning',
      };
    }

    if (q.includes('halcon')) {
      const halconIncs = incidents.filter(i => i.entity?.toLowerCase() === 'halcon');
      const openCount = halconIncs.filter(i => !['Closed', 'Resolved'].includes(i.status)).length;
      return {
        text: `Found **${halconIncs.length} incidents** associated with Halcon (Manufacturing entity). Currently **${openCount} are active/open**, primarily in S/4HANA Manufacturing (E2M).`,
        actionLabel: 'Filter Halcon in Incidents',
        actionPath: '/command-center/incidents',
      };
    }

    if (q.includes('license') || q.includes('renewal')) {
      const highRisk = licenses.filter(l => l.risk === 'High');
      return {
        text: `There are **${highRisk.length} software licenses** with consumption exceeding 90% or renewals within the next 60 days, including SAP S/4HANA Enterprise and Opentext xECM.`,
        actionLabel: 'Inspect License Governance',
        actionPath: '/governance/licenses',
        highlight: 'warning',
      };
    }

    if (q.includes('dfr') || q.includes('flash') || q.includes('summary')) {
      return {
        text: `**Daily Flash Report (DFR) Summary — 24h Snapshot**:\n• Total Inflow: 18 incidents, 12 SRs\n• Active P1/P2: 2 active (both under L2 triage)\n• SLA Compliance: 94.2% across active estate\n• Critical App Health: 100% core availability on SAP S/4HANA 2025.`,
        actionLabel: 'Open Daily Flash Report',
        actionPath: '/reporting/dfr',
      };
    }

    if (q.includes('resource') || q.includes('ratio') || q.includes('onshore')) {
      return {
        text: `The AMS delivery team comprises **30 key consultants**: 14 Onsite (Abu Dhabi HQ & Plants) and 16 Offshore (Dedicated & Flex), maintaining a balanced 47% Onsite / 53% Offshore ratio with 43% UAE National representation.`,
        actionLabel: 'View Resource Directory',
        actionPath: '/resources/directory',
      };
    }

    // Default response
    return {
      text: `Understood your query regarding "${rawQuery}". Based on real-time AMS telemetry, all systems are operational under standard operating SLAs. You can explore detailed metrics in the respective modules.`,
      actionLabel: 'Go to Executive Board',
      actionPath: '/executive-board',
    };
  };

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate instant AI evaluation
    setTimeout(() => {
      const response = processQuery(textToSend);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        actionLabel: response.actionLabel,
        actionPath: response.actionPath,
        highlight: response.highlight,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(3px)',
      zIndex: 1100, display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '460px', maxWidth: '100vw', height: '100vh',
          background: 'var(--bg-card)', borderLeft: '1px solid var(--border-primary)',
          display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-2xl)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--edge-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>EDGE AMS Assistant</div>
              <div style={{ fontSize: '11px', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-emerald)' }} />
                Operational Intelligence Online
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  background: isUser ? 'var(--edge-primary)' : 'var(--bg-secondary)',
                  color: isUser ? 'white' : 'var(--text-primary)',
                  padding: '12px 14px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  border: isUser ? 'none' : '1px solid var(--border-secondary)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

                  {msg.actionLabel && (
                    <button
                      onClick={() => { navigate(msg.actionPath); onClose(); }}
                      className="btn btn-secondary btn-sm"
                      style={{
                        marginTop: '10px', width: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                        fontSize: 'var(--text-xs)', background: 'var(--bg-card)'
                      }}
                    >
                      <span>{msg.actionLabel}</span>
                      <ArrowRight size={12} />
                    </button>
                  )}

                  <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', padding: '6px 12px' }}>
              <Sparkles size={14} className="animate-spin" />
              <span>Analyzing AMS telemetry...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Prompt Chips */}
        <div style={{ padding: '8px 16px', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-secondary)', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: '6px' }}>
          {DEFAULT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.text)}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                borderRadius: '16px', padding: '4px 10px', fontSize: '11px',
                color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0
              }}
            >
              {q.text}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-secondary)', background: 'var(--bg-card)', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Ask about incidents, SLAs, applications, or team..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-input"
            style={{ flex: 1, fontSize: 'var(--text-sm)' }}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim()} style={{ padding: '0 14px' }}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
