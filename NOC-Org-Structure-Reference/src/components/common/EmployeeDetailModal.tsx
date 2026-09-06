import React, { useState } from 'react';
import {
  X, Mail, Phone, Building, Calendar,
  CheckCircle2, BookOpen, Clock, User,
  Eye, EyeOff, History, Shield, ArrowDown,
  Award, CheckCircle
} from 'lucide-react';
import type { MasterEmployee } from '../../data/master-employees';
import { resourceMobilization } from '../../data/resourceMobilization';
import { detailedKTList, employeeDevelopmentRoster } from '../../data/empowerment';

interface EmployeeDetailModalProps {
  employee: MasterEmployee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, isOpen, onClose }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'profile' | 'kt' | 'transitions' | 'development'>('profile');

  if (!isOpen || !employee) return null;

  // Mask phone number unless revealed
  const maskedPhone = employee.mobile.replace(/(\+\d{3}\s\d{2})\s(\d{3})\s(\d{4})/, '$1 ••• $3');

  // Find resource mobilization history if exists
  const resourceMob = resourceMobilization.find(
    r => r.employeeId === employee.employeeId || r.employeeName === employee.name
  );

  // Find detailed KT records for this employee
  const matchingKTRecords = detailedKTList.filter(
    k => k.employeeId === employee.employeeId || k.employeeName === employee.name ||
         k.ktRecipient.includes(employee.name) || k.ktProvider.includes(employee.name)
  );

  // Find employee development profile if available
  const devProfile = employeeDevelopmentRoster.find(
    d => d.employeeId === employee.employeeId || d.employeeName === employee.name
  );

  const prevRoleHolder = employee.roleHistory && employee.roleHistory.length > 0 ? employee.roleHistory[0] : null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 22, 40, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92vw',
          maxWidth: 780,
          maxHeight: '92vh',
          background: 'var(--surface-raised, #FFFFFF)',
          borderRadius: 16,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 1101,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border, #E4E7EC)',
        }}
      >
        {/* Header Profile Banner */}
        <div
          style={{
            padding: '22px 28px',
            background: 'linear-gradient(135deg, #0D4C93 0%, #05263F 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0E9F6E 0%, #03D3C6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              {employee.name.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {employee.name}
                </h3>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: employee.status === 'Active' ? 'rgba(14, 159, 110, 0.3)' : 'rgba(233, 127, 10, 0.3)',
                    color: employee.status === 'Active' ? '#FCDC61' : '#FFA940',
                    border: '1px solid currentColor',
                  }}
                >
                  {employee.status}
                </span>
                {employee.expatLocal === 'Local' && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: 'rgba(14, 159, 110, 0.4)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                  >
                    Qatari National
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>
                {employee.role} • <span style={{ opacity: 0.85, fontFamily: 'monospace' }}>{employee.employeeId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Sub-Tabs Inside Modal */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '8px 24px',
            background: 'var(--bg-secondary, #F8FAFC)',
            borderBottom: '1px solid var(--border, #E4E7EC)',
          }}
        >
          <button
            onClick={() => setActiveDetailTab('profile')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeDetailTab === 'profile' ? 'var(--noc-deep-blue, #0D4C93)' : 'transparent',
              color: activeDetailTab === 'profile' ? '#FFFFFF' : 'var(--text-secondary, #475467)',
              fontWeight: activeDetailTab === 'profile' ? 700 : 500,
              fontSize: '0.78125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <User size={13} />
            <span>Profile & Contact</span>
          </button>

          <button
            onClick={() => setActiveDetailTab('kt')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeDetailTab === 'kt' ? 'var(--noc-deep-blue, #0D4C93)' : 'transparent',
              color: activeDetailTab === 'kt' ? '#FFFFFF' : 'var(--text-secondary, #475467)',
              fontWeight: activeDetailTab === 'kt' ? 700 : 500,
              fontSize: '0.78125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <BookOpen size={13} />
            <span>Knowledge Transfer (KT)</span>
            {matchingKTRecords.length > 0 && (
              <span style={{ padding: '1px 5px', borderRadius: 8, fontSize: '0.625rem', background: 'rgba(255,255,255,0.25)' }}>
                {matchingKTRecords.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveDetailTab('transitions')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              background: activeDetailTab === 'transitions' ? 'var(--noc-deep-blue, #0D4C93)' : 'transparent',
              color: activeDetailTab === 'transitions' ? '#FFFFFF' : 'var(--text-secondary, #475467)',
              fontWeight: activeDetailTab === 'transitions' ? 700 : 500,
              fontSize: '0.78125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <History size={13} />
            <span>Resource Transitions & Timeline</span>
          </button>

          {devProfile && (
            <button
              onClick={() => setActiveDetailTab('development')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: activeDetailTab === 'development' ? 'var(--noc-deep-blue, #0D4C93)' : 'transparent',
                color: activeDetailTab === 'development' ? '#FFFFFF' : 'var(--text-secondary, #475467)',
                fontWeight: activeDetailTab === 'development' ? 700 : 500,
                fontSize: '0.78125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Award size={13} />
              <span>Development & Academy</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {/* ─── TAB 1: PROFILE & CONTACT ────────────────────────── */}
          {activeDetailTab === 'profile' && (
            <>
              {/* Quick Contact & Meta Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <Building size={14} /> Tower / Department
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                    {employee.tower} • {employee.department}
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <Shield size={14} /> Level & Qatarization
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-ink, #0D4C93)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(13, 76, 147, 0.1)', color: 'var(--brand-ink, #0D4C93)', fontSize: '0.75rem', fontWeight: 800 }}>
                      {employee.level || 'L2'}
                    </span>
                    <span>{employee.locationBucket || 'General Ops'}</span>
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <User size={14} /> Reporting Manager
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                    {employee.manager}
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <Clock size={14} /> Shift & Location
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                    {employee.shift.split(' ')[0]} • {employee.location}
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <Calendar size={14} /> Onboard Date & Duration
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                    {employee.joiningDate} ({(() => {
                      try {
                        const parts = employee.joiningDate.split('-');
                        const joinYear = parseInt(parts[0], 10);
                        const joinMonth = parseInt(parts[1], 10);
                        const totalMonths = (2026 - joinYear) * 12 + (8 - joinMonth);
                        const yrs = Math.floor(totalMonths / 12);
                        const mos = totalMonths % 12;
                        return yrs > 0 ? `${yrs}y ${mos}m in role` : `${mos}m in role`;
                      } catch {
                        return 'Current';
                      }
                    })()})
                  </div>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-secondary, #F7F8FA)', border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    <Building size={14} /> Nationality & Gender
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                    {employee.expatLocal === 'Local' ? 'Qatari National' : 'Expatriate'} • {employee.gender || 'Staff'}
                  </div>
                </div>
              </div>

              {/* Contact Details Card with Privacy Masking */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: 10,
                  border: '1px solid var(--border, #E4E7EC)',
                  background: 'var(--card-bg, #FFFFFF)',
                  marginBottom: 20,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    Official Corporate Email
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--brand-ink, #0D4C93)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={14} /> {employee.email}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginBottom: 4 }}>
                    Mobile Contact (Controlled Visibility)
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text, #101828)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={14} />
                    <span>{showPhone ? employee.mobile : maskedPhone}</span>
                    <button
                      type="button"
                      onClick={() => setShowPhone(!showPhone)}
                      title={showPhone ? 'Mask phone number' : 'Reveal phone number'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--brand-ink, #0D4C93)',
                        padding: 2,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPhone ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={`mailto:${employee.email}`}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      background: 'var(--noc-deep-blue, #0D4C93)',
                      color: '#FFFFFF',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Mail size={14} /> Email
                  </a>
                  <a
                    href={`tel:${employee.mobile.replace(/ /g, '')}`}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      background: 'var(--noc-green, #0E9F6E)',
                      color: '#FFFFFF',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>

              {/* Current Assignment */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text, #101828)' }}>
                  Current Operational Scope & Project
                </h4>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'rgba(14, 159, 110, 0.05)',
                    border: '1px solid rgba(14, 159, 110, 0.2)',
                    color: 'var(--noc-green, #0E9F6E)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{employee.currentAssignment || 'NOC AMS Managed Operations'}</span>
                </div>
              </div>
            </>
          )}

          {/* ─── TAB 2: KNOWLEDGE TRANSFER (KT) RESTORED ──────────── */}
          {activeDetailTab === 'kt' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text, #101828)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BookOpen size={16} color="#0D4C93" />
                  Knowledge Transfer (KT) Governance Records
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                  Batch & Session Traceability
                </span>
              </div>

              {matchingKTRecords.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {matchingKTRecords.map((kt) => (
                    <div
                      key={kt.id}
                      style={{
                        padding: '16px 18px',
                        borderRadius: 10,
                        background: 'var(--card-bg, #FFFFFF)',
                        border: '1px solid var(--border, #E4E7EC)',
                        borderLeft: `4px solid ${kt.status === 'Completed' ? '#22A06B' : kt.status === 'In Progress' ? '#48C1BB' : '#E97F0A'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--brand-ink, #0D4C93)' }}>
                            {kt.knowledgeArea}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>
                            KT ID: {kt.id} • Batch: {kt.ktBatch} • Tower: {kt.tower}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            background: kt.status === 'Completed' ? '#E3FCEF' : '#E6F4FC',
                            color: kt.status === 'Completed' ? '#22A06B' : '#0D4C93',
                          }}
                        >
                          {kt.status} ({kt.completionPct}%)
                        </span>
                      </div>

                      {/* Sessions Progress Bar */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                          <span style={{ color: 'var(--text-secondary, #475467)' }}>
                            Sessions: <strong>{kt.sessionsCompleted}</strong> completed of <strong>{kt.sessionsPlanned}</strong> planned
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--brand-ink, #0D4C93)' }}>{kt.completionPct}%</span>
                        </div>
                        <div style={{ height: 6, width: '100%', background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${kt.completionPct}%`, background: kt.completionPct === 100 ? '#0E9F6E' : '#48C1BB', borderRadius: 3 }} />
                        </div>
                      </div>

                      {/* Provider & Recipient Meta */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: 8,
                          fontSize: '0.78125rem',
                          background: 'var(--bg-secondary, #F8FAFC)',
                          padding: 10,
                          borderRadius: 6,
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)' }}>KT Provider: </span>
                          <strong style={{ color: 'var(--text, #101828)' }}>{kt.ktProvider}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)' }}>KT Recipient: </span>
                          <strong style={{ color: 'var(--text, #101828)' }}>{kt.ktRecipient}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)' }}>Timeline: </span>
                          <span>{kt.startDate} → {kt.actualCompletionDate || kt.targetCompletionDate}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)' }}>Sign-off: </span>
                          <strong style={{ color: kt.signoffStatus === 'Approved' ? '#22A06B' : '#E97F0A' }}>
                            {kt.signoffStatus} ({kt.documentationStatus})
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback if no specific KT record from empowerment array, show general tower KT */
                <div style={{ padding: 18, background: 'var(--bg-secondary, #F7F8FA)', borderRadius: 8, border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#0E9F6E' }}>
                    <CheckCircle size={18} />
                    <h5 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700 }}>Operational KT Sign-off Complete</h5>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary, #475467)', lineHeight: 1.4 }}>
                    Employee completed structured handover and knowledge absorption for <strong>{employee.tower}</strong> tower scope. Verified by <strong>{employee.manager}</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 3: RESOURCE TRANSITIONS & TIMELINE ───────────── */}
          {activeDetailTab === 'transitions' && (
            <div>
              <h4 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text, #101828)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <History size={16} color="#0D4C93" />
                Resource & Role Transition Chronological Timeline
              </h4>

              {/* Chronological Flow Visual */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '20px 16px',
                  background: 'var(--bg-secondary, #F8FAFC)',
                  borderRadius: 12,
                  border: '1px solid var(--border, #E4E7EC)',
                  marginBottom: 20,
                }}
              >
                {/* Step 1: Previous Resource */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'var(--card-bg, #FFFFFF)',
                    border: '1px solid var(--border, #E4E7EC)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary, #98A2B3)', textTransform: 'uppercase' }}>
                      1. Previous Role Holder
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text, #101828)' }}>
                      {prevRoleHolder ? prevRoleHolder.holder : (matchingKTRecords[0]?.previousRoleHolder || 'Tariq Al-Rashidi')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', marginTop: 2 }}>
                      Role: {prevRoleHolder ? prevRoleHolder.roleName : employee.role}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
                    Tenure: {prevRoleHolder ? `${prevRoleHolder.startDate} to ${prevRoleHolder.endDate}` : '2023 - 2025 (24 mos)'}
                  </span>
                </div>

                <ArrowDown size={18} color="#0D4C93" />

                {/* Step 2: Knowledge Transfer */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'rgba(13, 76, 147, 0.06)',
                    border: '1px solid rgba(13, 76, 147, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--brand-ink, #0D4C93)', textTransform: 'uppercase' }}>
                      2. Knowledge Transfer Execution
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--brand-ink, #0D4C93)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span>KT Provider: {matchingKTRecords.length > 0 ? (matchingKTRecords[0].ktProvider.split('(')[0].trim()) : (prevRoleHolder ? prevRoleHolder.holder : 'Tariq Al-Rashidi')}</span>
                      {matchingKTRecords[0]?.providerType === 'Delegated / Override' ? (
                        <span style={{ fontSize: '0.6875rem', color: '#E97F0A', background: '#FFF7E6', border: '1px solid #FFE7BA', padding: '1px 6px', borderRadius: 4 }}>
                          Override
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.6875rem', color: '#22A06B', background: '#E3FCEF', border: '1px solid #B7EB8F', padding: '1px 6px', borderRadius: 4 }}>
                          Previous Holder
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)', marginTop: 2 }}>
                      KT Recipient: {matchingKTRecords.length > 0 ? (matchingKTRecords[0].ktRecipient.split('(')[0].trim()) : employee.name}
                    </div>
                    {matchingKTRecords[0]?.overrideReason && (
                      <div style={{ fontSize: '0.6875rem', color: '#E97F0A', fontStyle: 'italic', marginTop: 2 }}>
                        Justification: {matchingKTRecords[0].overrideReason}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22A06B', display: 'block' }}>
                      {matchingKTRecords.length > 0 ? `${matchingKTRecords[0].completionPct}% Complete` : '100% Signed Off'}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary, #98A2B3)' }}>
                      {matchingKTRecords.length > 0 ? matchingKTRecords[0].ktBatch : 'KT-B001'}
                    </span>
                  </div>
                </div>

                <ArrowDown size={18} color="#0D4C93" />

                {/* Step 3: Transition */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'rgba(233, 127, 10, 0.06)',
                    border: '1px solid rgba(233, 127, 10, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#E97F0A', textTransform: 'uppercase' }}>
                      3. Operational Transition
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text, #101828)' }}>
                      Role Transition Handover Approved
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #475467)' }}>
                    Effective: {employee.joiningDate}
                  </span>
                </div>

                <ArrowDown size={18} color="#0E9F6E" />

                {/* Step 4: Current Resource */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: 'rgba(14, 159, 110, 0.08)',
                    border: '2px solid #0E9F6E',
                    boxShadow: '0 2px 8px rgba(14, 159, 110,0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0E9F6E', textTransform: 'uppercase' }}>
                      4. Current Active Resource
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text, #101828)' }}>
                      {employee.name} ({employee.employeeId})
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0E9F6E' }}>
                    Active On-Duty
                  </span>
                </div>
              </div>

              {/* Role Transition History List */}
              {employee.roleHistory && employee.roleHistory.length > 0 && (
                <div>
                  <h5 style={{ margin: '0 0 10px', fontSize: '0.875rem', fontWeight: 700 }}>
                    Detailed Role History ({employee.roleHistory.length} Previous Occupants)
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {employee.roleHistory.map((rh, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 6,
                          background: 'var(--bg-secondary, #F7F8FA)',
                          border: '1px solid var(--border, #E4E7EC)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{rh.holder}</span>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)', marginLeft: 8 }}>({rh.holderId})</span>
                        </div>
                        <span style={{ color: 'var(--text-secondary, #475467)', fontWeight: 600 }}>
                          {rh.startDate} → {rh.endDate} ({rh.durationMonths} months tenure)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignment History */}
              {resourceMob && resourceMob.assignmentHistory && resourceMob.assignmentHistory.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h5 style={{ margin: '0 0 10px', fontSize: '0.875rem', fontWeight: 700 }}>
                    Previous Project Assignments ({resourceMob.assignmentHistory.length})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {resourceMob.assignmentHistory.map((hist, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 6,
                          background: 'var(--bg-secondary, #F7F8FA)',
                          border: '1px solid var(--border, #E4E7EC)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text, #101828)' }}>{hist.project}</span>
                          <span style={{ color: 'var(--text-tertiary, #98A2B3)', marginLeft: 8 }}>• {hist.role}</span>
                        </div>
                        <span style={{ color: 'var(--text-secondary, #475467)', fontWeight: 600 }}>
                          {hist.year} ({hist.startDate} - {hist.endDate || 'Present'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 4: DEVELOPMENT & ACADEMY ────────────────────── */}
          {activeDetailTab === 'development' && devProfile && (
            <div>
              <h4 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text, #101828)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color="#0D4C93" />
                Qatari Empowerment & Capability Track
              </h4>

              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: 'var(--bg-secondary, #F8FAFC)',
                  border: '1px solid var(--border, #E4E7EC)',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #98A2B3)', textTransform: 'uppercase' }}>
                  Development Track
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-ink, #0D4C93)', marginTop: 2 }}>
                  {devProfile.developmentTrack}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #475467)', marginTop: 4 }}>
                  Training Hours Logged: <strong>{devProfile.trainingHours} hrs</strong> • Status: <strong>{devProfile.developmentStatus}</strong>
                </div>
              </div>

              {/* Skills and Certifications */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                <div style={{ padding: 14, background: 'var(--card-bg, #FFFFFF)', borderRadius: 8, border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary, #475467)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Skills Being Developed
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {devProfile.skillsDeveloped.map((s, idx) => (
                      <span key={idx} style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(13, 76, 147, 0.08)', color: 'var(--brand-ink, #0D4C93)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: 14, background: 'var(--card-bg, #FFFFFF)', borderRadius: 8, border: '1px solid var(--border, #E4E7EC)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary, #475467)', marginBottom: 8, textTransform: 'uppercase' }}>
                    Certifications Achieved
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {devProfile.certificationsCompleted.map((c, idx) => (
                      <div key={idx} style={{ fontSize: '0.78125rem', fontWeight: 600, color: '#0E9F6E', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={13} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailModal;
