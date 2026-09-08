/**
 * EDGE AMS Control Tower — Create Ticket Modal
 * Allows creating live Incidents or Service Requests in the local prototype state.
 */
import React, { useState } from 'react';
import { X, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ENTITIES, BUSINESS_DOMAINS, APPLICATIONS } from '../../data/masterData';

export default function CreateTicketModal({ isOpen, onClose, onCreate, initialType = 'incident' }) {
  const [ticketType, setTicketType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('P2');
  const [entity, setEntity] = useState(ENTITIES[0]?.name || 'KaarTech Corp.');
  const [domain, setDomain] = useState(BUSINESS_DOMAINS[0]?.key || 'L2C');
  const [app, setApp] = useState(APPLICATIONS[0]?.name || 'SAP S/4HANA 2025');
  const [srType, setSrType] = useState('Standard');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTicket = {
      id: ticketType === 'incident' ? `INC-${Math.floor(10000 + Math.random() * 90000)}` : `SR-${Math.floor(10000 + Math.random() * 90000)}`,
      title,
      shortDescription: title,
      fullDescription: description,
      description,
      priority,
      status: 'New',
      slaStatus: 'On Track',
      entity,
      businessDomain: domain,
      application: app,
      srType: ticketType === 'sr' ? srType : undefined,
      assignedTo: 'Unassigned (Queue Triage)',
      createdDate: new Date().toISOString(),
      track: 'AMS-ON-RUN',
      processGroup: 'General Support',
      classification: 'DEMO',
    };

    if (onCreate) {
      onCreate(newTicket, ticketType);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setTitle('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
      zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.15s ease'
    }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '560px', maxWidth: '95vw', background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-2xl)', overflow: 'hidden',
          animation: 'scaleIn 0.2s ease'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} style={{ color: 'var(--edge-primary)' }} />
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Create AMS Operational Ticket
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--color-emerald)', margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 8px' }}>Ticket Created Successfully</h4>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Ticket queued for SLA monitoring and assignment.</p>
            </div>
          ) : (
            <>
              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setTicketType('incident')}
                  className={`btn btn-sm ${ticketType === 'incident' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                >
                  Incident (Service Disruption)
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('sr')}
                  className={`btn btn-sm ${ticketType === 'sr' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                >
                  Service Request (Standard / Major)
                </button>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Summary / Short Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales order batch job failure on S/4HANA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Grid 1: Priority & Entity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Priority / SLA Impact
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                  >
                    <option value="P1">P1 - Critical (30m Resp / 4h Res)</option>
                    <option value="P2">P2 - High (2h Resp / 8h Res)</option>
                    <option value="P3">P3 - Medium (1 Day Resp / 2 Days Res)</option>
                    <option value="P4">P4 - Low (2 Days Resp / 4 Days Res)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    EDGE Entity
                  </label>
                  <select
                    value={entity}
                    onChange={(e) => setEntity(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                  >
                    {ENTITIES.map(ent => (
                      <option key={ent.id} value={ent.name}>{ent.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 2: Application & Domain */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Application
                  </label>
                  <select
                    value={app}
                    onChange={(e) => setApp(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                  >
                    {APPLICATIONS.filter(a => a.scope === 'In Scope').map(a => (
                      <option key={a.id} value={a.name}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Business Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                  >
                    {BUSINESS_DOMAINS.map(d => (
                      <option key={d.key} value={d.key}>{d.key} — {d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Technical Details & Impact
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide error codes, affected users, or system logs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: 'var(--text-sm)', resize: 'vertical' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--border-secondary)', paddingTop: '16px' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Ticket
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
