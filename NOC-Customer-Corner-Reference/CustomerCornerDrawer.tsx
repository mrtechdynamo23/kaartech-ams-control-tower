import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Headphones, UserCheck, RefreshCw, HelpCircle,
  CheckCircle2, Send, MessagesSquare
} from 'lucide-react';
import { masterEmployees } from '../../data/master-employees';
import { incidents, type Incident } from '../../data/incidents';

interface CustomerCornerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActionTab = 'assign' | 'reassign' | 'query';

const CustomerCornerDrawer: React.FC<CustomerCornerDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActionTab>('assign');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form states - Assign
  const [assignIncidentId, setAssignIncidentId] = useState<string>(incidents[0]?.id || 'INC-26081');
  const [assignee, setAssignee] = useState<string>(masterEmployees[0]?.name || 'Faisal Al-Harbi');
  const [assignNotes, setAssignNotes] = useState<string>('');

  // Form states - Reassign
  const [reassignIncidentId, setReassignIncidentId] = useState<string>(incidents[1]?.id || 'INC-26082');
  const [newAssignee, setNewAssignee] = useState<string>(masterEmployees[3]?.name || 'Sara Al-Otaibi');
  const [reassignReason, setReassignReason] = useState<string>('Tier-2 Technical Escalation');

  // Form states - Query
  const [queryTower, setQueryTower] = useState<string>('Applications');
  const [queryCategory, setQueryCategory] = useState<string>('SLA Clarification');
  const [querySubject, setQuerySubject] = useState<string>('');
  const [queryBody, setQueryBody] = useState<string>('');

  if (!isOpen) return null;

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(`Incident ${assignIncidentId} successfully assigned to ${assignee}. Service Desk dispatcher notified.`);
    setTimeout(() => setSubmittedMessage(null), 4000);
    setAssignNotes('');
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(`Incident ${reassignIncidentId} reassigned to ${newAssignee} (${reassignReason}). Handover log logged.`);
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryRef = `QRY-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedMessage(`Operational query submitted successfully! Reference #${queryRef} routed to ${queryTower} Operations Lead.`);
    setTimeout(() => setSubmittedMessage(null), 5000);
    setQuerySubject('');
    setQueryBody('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 22, 40, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 1050,
        }}
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '92vw',
          maxWidth: 480,
          background: 'var(--surface-raised, #FFFFFF)',
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.15)',
          zIndex: 1051,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderLeft: '1px solid var(--border, #E4E7EC)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #0D4C93 0%, #05263F 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Headphones size={20} color="#03D3C6" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>
                Fast Action Desk
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Incident dispatch & operational queries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid var(--border, #E4E7EC)',
            background: 'var(--bg-secondary, #F7F8FA)',
          }}
        >
          <button
            onClick={() => setActiveTab('assign')}
            style={{
              padding: '12px 6px',
              border: 'none',
              background: activeTab === 'assign' ? 'var(--surface-raised, #FFFFFF)' : 'transparent',
              color: activeTab === 'assign' ? 'var(--noc-deep-blue, #0D4C93)' : 'var(--text-secondary, #475467)',
              fontWeight: activeTab === 'assign' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              borderBottom: activeTab === 'assign' ? '2px solid var(--noc-deep-blue, #0D4C93)' : '2px solid transparent',
            }}
          >
            <UserCheck size={14} />
            <span>Assign</span>
          </button>
          <button
            onClick={() => setActiveTab('reassign')}
            style={{
              padding: '12px 6px',
              border: 'none',
              background: activeTab === 'reassign' ? 'var(--surface-raised, #FFFFFF)' : 'transparent',
              color: activeTab === 'reassign' ? 'var(--noc-deep-blue, #0D4C93)' : 'var(--text-secondary, #475467)',
              fontWeight: activeTab === 'reassign' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              borderBottom: activeTab === 'reassign' ? '2px solid var(--noc-deep-blue, #0D4C93)' : '2px solid transparent',
            }}
          >
            <RefreshCw size={14} />
            <span>Reassign</span>
          </button>
          <button
            onClick={() => setActiveTab('query')}
            style={{
              padding: '12px 6px',
              border: 'none',
              background: activeTab === 'query' ? 'var(--surface-raised, #FFFFFF)' : 'transparent',
              color: activeTab === 'query' ? 'var(--noc-deep-blue, #0D4C93)' : 'var(--text-secondary, #475467)',
              fontWeight: activeTab === 'query' ? 700 : 500,
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              borderBottom: activeTab === 'query' ? '2px solid var(--noc-deep-blue, #0D4C93)' : '2px solid transparent',
            }}
          >
            <HelpCircle size={14} />
            <span>Raise Query</span>
          </button>
        </div>

        {/* Route to the full collaboration channel */}
        <button
          type="button"
          onClick={() => { onClose(); navigate('/customer-corner'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 20px',
            border: 'none',
            borderBottom: '1px solid var(--border, #E4E7EC)',
            background: 'transparent',
            color: 'var(--noc-deep-blue, #0D4C93)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <MessagesSquare size={14} />
          <span>Open Customer Corner — ticket &amp; CTA conversations with all stakeholders</span>
        </button>

        {/* Confirmation Banner */}
        {submittedMessage && (
          <div
            style={{
              padding: '12px 16px',
              margin: '16px 20px 0',
              background: 'rgba(14, 159, 110, 0.1)',
              border: '1px solid rgba(14, 159, 110, 0.3)',
              borderRadius: 8,
              color: '#22A06B',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Drawer Body Forms */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: ASSIGN INCIDENT */}
          {activeTab === 'assign' && (
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Select Open Incident
                </label>
                <select
                  value={assignIncidentId}
                  onChange={(e) => setAssignIncidentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {incidents.map((inc: Incident) => (
                    <option key={inc.id} value={inc.id}>
                      {inc.id} — [{inc.priority}] {inc.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Assign To Engineer
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {masterEmployees.slice(0, 30).map((emp) => (
                    <option key={emp.employeeId} value={emp.name}>
                      {emp.name} ({emp.tower} • {emp.position} • {emp.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Assignment Note / Priority Instructions
                </label>
                <textarea
                  rows={4}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="Enter dispatch notes, SLA urgency, or troubleshooting context..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  background: 'var(--noc-deep-blue, #0D4C93)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Send size={16} />
                <span>Confirm Assignment</span>
              </button>
            </form>
          )}

          {/* TAB 2: REASSIGN INCIDENT */}
          {activeTab === 'reassign' && (
            <form onSubmit={handleReassignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Incident to Reassign
                </label>
                <select
                  value={reassignIncidentId}
                  onChange={(e) => setReassignIncidentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {incidents.map((inc: Incident) => (
                    <option key={inc.id} value={inc.id}>
                      {inc.id} — Assigned: {inc.assignedEngineer || inc.owner || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  New Assigned Engineer
                </label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {masterEmployees.slice(0, 30).map((emp) => (
                    <option key={emp.employeeId} value={emp.name}>
                      {emp.name} ({emp.tower} • {emp.position} • {emp.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Reassignment Reason / Justification
                </label>
                <select
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="Tier-2 Technical Escalation">Tier-2 Technical Escalation</option>
                  <option value="Skillset & Domain Alignment">Skillset & Domain Alignment</option>
                  <option value="Shift Rotation Handover">Shift Rotation Handover</option>
                  <option value="Workload & Queue Balancing">Workload & Queue Balancing</option>
                  <option value="Vendor L3 Support Escalation">Vendor L3 Support Escalation</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  background: 'var(--noc-deep-blue, #0D4C93)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <RefreshCw size={16} />
                <span>Execute Reassignment</span>
              </button>
            </form>
          )}

          {/* TAB 3: RAISE QUERY */}
          {activeTab === 'query' && (
            <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Target Operational Tower
                </label>
                <select
                  value={queryTower}
                  onChange={(e) => setQueryTower(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="Service Desk">Service Desk</option>
                  <option value="Applications">Application Services</option>
                  <option value="Infrastructure">Infrastructure Health</option>
                  <option value="Cloud">Cloud Platforms</option>
                  <option value="Security">Cyber Security</option>
                  <option value="Network">Network Operations</option>
                  <option value="Vendor SIAM">Vendor & SIAM</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Query Classification
                </label>
                <select
                  value={queryCategory}
                  onChange={(e) => setQueryCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="SLA Clarification">SLA Clarification</option>
                  <option value="Incident Priority Review">Incident Priority Review</option>
                  <option value="Change Schedule Confirmation">Change Schedule Confirmation</option>
                  <option value="Access & Privileged Permissions">Access & Privileged Permissions</option>
                  <option value="System Capacity / DR Telemetry">System Capacity / DR Telemetry</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={querySubject}
                  onChange={(e) => setQuerySubject(e.target.value)}
                  placeholder="e.g. Query on Oracle DB backup window SLA"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text, #101828)', marginBottom: 6 }}>
                  Query Description & Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={queryBody}
                  onChange={(e) => setQueryBody(e.target.value)}
                  placeholder="Please provide full details of your operational inquiry..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border, #E4E7EC)',
                    background: 'var(--surface-raised, #FFFFFF)',
                    color: 'var(--text, #101828)',
                    fontSize: '0.8125rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: 6,
                  background: 'var(--noc-deep-blue, #0D4C93)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Send size={16} />
                <span>Submit Query</span>
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
};

export default CustomerCornerDrawer;
