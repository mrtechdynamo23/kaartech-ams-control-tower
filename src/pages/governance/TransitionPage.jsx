/**
 * EDGE AMS Control Tower — Transition Governance
 * Route: /governance/transition
 * 4-Phase Transition Framework and Domain KT Sign-off Matrix.
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { GitBranch, CheckCircle2, Clock, ShieldCheck, UserCheck, ArrowRight, Plus, X } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { BUSINESS_DOMAINS } from '../../data/masterData';

export default function TransitionPage() {
  const transitionPhases = [
    { phase: 'Phase 1', name: 'Planning & Governance', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 2', name: 'Knowledge Transfer (KT)', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 3', name: 'Primary Shadow Support', progress: 100, status: 'Completed', date: 'Completed' },
    { phase: 'Phase 4', name: 'Reverse Shadow & Steady State', progress: 96, status: 'Active Go-Live', date: 'In Progress' },
  ];

  const initialDomainReadiness = BUSINESS_DOMAINS.map((d, idx) => ({
    domain: d.key,
    label: d.label,
    ktScore: 95 + (idx % 5),
    sopCount: 14 + (idx * 3),
    shadowHours: 120 + (idx * 15),
    signOffStatus: idx < 6 ? 'Signed Off' : 'Under Review',
  }));

  const [domainReadiness, setDomainReadiness] = useState(initialDomainReadiness);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);

  // Form State
  const [signOffDomain, setSignOffDomain] = useState('S2P');
  const [ktScore, setKtScore] = useState(98);
  const [sopCount, setSopCount] = useState(28);
  const [shadowHours, setShadowHours] = useState(160);
  const [signOffStatus, setSignOffStatus] = useState('Signed Off');
  const [signOffLead, setSignOffLead] = useState('Sultan Al Dhaheri');
  const [attestationNotes, setAttestationNotes] = useState('');

  const handleRecordSignOff = (e) => {
    e.preventDefault();
    setDomainReadiness(prev => prev.map(item => {
      if (item.domain === signOffDomain) {
        return {
          ...item,
          ktScore: Number(ktScore) || item.ktScore,
          sopCount: Number(sopCount) || item.sopCount,
          shadowHours: Number(shadowHours) || item.shadowHours,
          signOffStatus: signOffStatus,
          signOffLead: signOffLead,
        };
      }
      return item;
    }));

    setIsSignOffModalOpen(false);
    setSuccessBanner(`Domain KT Sign-Off for ${signOffDomain} recorded successfully!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const signedOffCount = domainReadiness.filter(d => d.signOffStatus === 'Signed Off').length;

  return (
    <div className="transition-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Transition Governance & KT Sign-Off</h1>
            <span className="badge badge-success">Phase 4 Active</span>
          </div>
          <p className="page-subtitle">Track knowledge acquisition gates, primary/reverse shadowing milestones, and SLA handover readiness.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsSignOffModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Record Domain KT Sign-off</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(21, 154, 106, 0.12)',
          border: '1px solid var(--color-emerald)',
          color: 'var(--color-emerald)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          marginBottom: '20px',
        }}>
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall Transition Health"
          value="98.5%"
          status="success"
          subtitle="All gate criteria satisfied"
          icon={ShieldCheck}
        />
        <KPICard
          title="SOPs Validated"
          value="142 SOPs"
          status="success"
          subtitle="Documented runbooks"
          icon={CheckCircle2}
        />
        <KPICard
          title="Reverse Shadow Hours"
          value="1,240h"
          subtitle="Hands-on resolved tickets"
          icon={Clock}
        />
        <KPICard
          title="Domain Sign-Offs"
          value={`${signedOffCount} / ${domainReadiness.length}`}
          subtitle={signedOffCount === domainReadiness.length ? 'All domains signed off' : `Remaining: ${domainReadiness.filter(d => d.signOffStatus !== 'Signed Off').map(d => d.domain).join(', ')}`}
          icon={UserCheck}
        />
      </div>

      {/* 4-Phase Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {transitionPhases.map((p, idx) => (
          <div key={idx} className="chart-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', textTransform: 'uppercase' }}>{p.phase}</span>
              <span className={`badge ${p.status === 'Completed' ? 'badge-success' : 'badge-primary'}`}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 12px' }}>{p.name}</h3>

            <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${p.progress}%`, background: p.progress === 100 ? 'var(--color-emerald)' : 'var(--edge-primary)', borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <span>Completion:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{p.progress}%</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Domain KT Sign-Off Matrix */}
      <div className="chart-card">
        <h3 className="chart-card-title">Business Domain KT Sign-Off Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Domain Code</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Business Domain</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>KT Assessment Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Validated SOPs</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Shadowing Hours</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Sign-Off Gate</th>
              </tr>
            </thead>
            <tbody>
              {domainReadiness.map(d => (
                <tr key={d.domain} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--edge-primary)' }}>{d.domain}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{d.label}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>{d.ktScore}%</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.sopCount} SOPs</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{d.shadowHours} hrs</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${d.signOffStatus === 'Signed Off' ? 'badge-success' : 'badge-warning'}`}>
                      {d.signOffStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Record Domain KT Sign-off Modal */}
      {isSignOffModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-overlay-centered"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '24px',
          }}
          onClick={() => setIsSignOffModalOpen(false)}
        >
          <div
            className="modal-dialog-centered"
            style={{
              background: 'var(--bg-card, #ffffff)',
              borderRadius: 'var(--radius-xl, 16px)',
              border: '2px solid var(--border-secondary, #e2e8f0)',
              boxShadow: 'var(--shadow-2xl, 0 25px 50px -12px rgba(0, 0, 0, 0.25))',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-primary, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary, #f8fafc)',
              borderRadius: '16px 16px 0 0',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <UserCheck size={18} color="var(--edge-primary, #FF5622)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Record Domain KT Sign-off
                  </h3>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                  Formalize knowledge transfer gate completion and steady-state handover
                </p>
              </div>
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRecordSignOff} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Business Domain
                  </label>
                  <select
                    value={signOffDomain}
                    onChange={(e) => setSignOffDomain(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {domainReadiness.map(d => (
                      <option key={d.domain} value={d.domain}>{d.domain} - {d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Gate Status
                  </label>
                  <select
                    value={signOffStatus}
                    onChange={(e) => setSignOffStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Signed Off">Signed Off (100% Gate Passed)</option>
                    <option value="Under Review">Under Review (Remediation Pending)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    KT Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={ktScore}
                    onChange={(e) => setKtScore(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Validated SOPs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sopCount}
                    onChange={(e) => setSopCount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Shadow Hours
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={shadowHours}
                    onChange={(e) => setShadowHours(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-primary, #cbd5e1)',
                      background: 'var(--bg-input, #ffffff)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Sign-Off Authority / Transition Lead
                </label>
                <input
                  type="text"
                  value={signOffLead}
                  onChange={(e) => setSignOffLead(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Attestation Statement & Runbook Validation
                </label>
                <textarea
                  rows={3}
                  placeholder="Attest that secondary shadowing is complete, runbooks are accepted, and AMS steady-state support is operational..."
                  value={attestationNotes}
                  onChange={(e) => setAttestationNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: '1px solid var(--border-primary, #cbd5e1)',
                    background: 'var(--bg-input, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-primary, #e2e8f0)',
              }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsSignOffModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserCheck size={14} />
                  <span>Attest Sign-off</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
