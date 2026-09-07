/**
 * EDGE AMS Control Tower — Resource Detail Modal
 * 
 * Comprehensive personnel inspection component implementing Section 23 of specifications:
 * - Resource Name, Resource ID, Position ID, Role
 * - Business Domain, Process Group, Track, Location, Allocation
 * - Manager / Reporting Manager (clickable drilldown)
 * - Direct Reports (clickable drilldown)
 * - Entity, Status, Onboarding Date, Days Since Onboarding
 * - Core Skills, Certifications, Contact details
 */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Mail, Phone, MapPin, Building, Calendar, Award,
  Shield, CheckCircle2, ChevronRight, User, Users,
  Copy, Check, ExternalLink, Briefcase, Clock
} from 'lucide-react';
import { getEnrichedResources } from '../../../data/organizationData';
import { isResourceAvailable } from '../../../data/timeManagementStore';
import { getResourceUtilizationMetrics } from '../../../data/analyticsSelectors';

export default function ResourceDetailModal({
  isOpen,
  resourceId,
  resource: initialResource,
  onClose,
  onSelectResource,
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [currentResourceId, setCurrentResourceId] = useState(resourceId || initialResource?.id || null);

  useEffect(() => {
    if (resourceId) setCurrentResourceId(resourceId);
    else if (initialResource?.id) setCurrentResourceId(initialResource.id);
  }, [resourceId, initialResource]);

  // Lock body scroll & ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const enrichedList = getEnrichedResources();
  const rawId = typeof currentResourceId === 'object' ? currentResourceId?.id : currentResourceId;
  const normalizedId = (rawId || '').replace(/^res-/, '');
  const res = enrichedList.find(r => r.id === rawId || r.id === normalizedId) || initialResource;
  if (!res) return null;

  const utilMetrics = getResourceUtilizationMetrics(res.id);

  // Calculate days since onboarding
  const onboarding = res.onboardingDate ? new Date(res.onboardingDate) : new Date('2025-08-01');
  const today = new Date('2026-09-06');
  const diffTime = Math.abs(today - onboarding);
  const daysSinceOnboarding = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsSinceOnboarding = (daysSinceOnboarding / 30.4).toFixed(1);

  // Availability from time store
  const availability = isResourceAvailable(res.id, '2026-09-06');

  // Direct reports resources
  const directReportResources = res.directReports
    ? enrichedList.filter(r => res.directReports.includes(r.id))
    : [];

  const handleCopyEmail = () => {
    if (res.email) {
      navigator.clipboard.writeText(res.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNavigateToResource = (targetId) => {
    setCurrentResourceId(targetId);
    if (onSelectResource) onSelectResource(targetId);
  };

  const modalContent = (
    <div
      className="modal-overlay-centered animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Resource Profile: ${res.name}`}
        className="modal-dialog-centered resource-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '88vh',
        }}
      >
        {/* Header Profile Banner */}
        <div
          style={{
            padding: '22px 24px',
            background: 'linear-gradient(135deg, rgba(255, 86, 34, 0.12) 0%, rgba(20, 24, 30, 0.95) 100%)',
            borderBottom: '1px solid var(--border-primary)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--edge-primary) 0%, #B82B10 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  boxShadow: '0 6px 16px rgba(255, 86, 34, 0.3)',
                  flexShrink: 0,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {res.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {res.name}
                  </h2>
                  <span
                    className="badge"
                    style={{
                      background: res.location === 'Onsite' ? 'rgba(13, 159, 110, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                      color: res.location === 'Onsite' ? 'var(--color-green)' : 'var(--color-blue)',
                      border: `1px solid ${res.location === 'Onsite' ? 'rgba(13, 159, 110, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    ● {res.location === 'Onsite' ? 'Onsite (Abu Dhabi)' : 'Offshore Delivery'}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    {res.id}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--edge-primary)', fontWeight: 600 }}>
                    {res.role}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>•</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {res.businessDomain} — {res.processGroup}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>•</span>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                    {res.track}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
              marginTop: '16px',
              padding: '10px 14px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Position ID</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{res.positionId}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Allocation</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: res.allocation === 'Dedicated' ? 'var(--color-green)' : 'var(--color-purple)' }}>{res.allocation}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Nationality</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{res.nationality} {res.nationality === 'UAE' && '🇦🇪'}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Tenure</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{daysSinceOnboarding}d ({monthsSinceOnboarding}m)</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Utilization %</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-green)' }}>{utilMetrics.utilizationFormatted}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Allocated Hours</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{utilMetrics.allocatedHours}h</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Utilized Hours</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{utilMetrics.utilizedHours}h</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600 }}>Availability</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: availability.available ? 'var(--color-green)' : 'var(--color-amber)' }}>
                {availability.status || 'Active On-Duty'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '0 24px',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
          }}
        >
          {[
            { key: 'profile', label: 'Overview & Hierarchy', icon: User },
            { key: 'competencies', label: 'Competencies & Skills', icon: Award },
            { key: 'contact', label: 'Contact & Deployment', icon: Phone },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--edge-primary)' : 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--edge-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginBottom: '-1px',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 230px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* TAB 1: Profile & Hierarchy */}
          {activeTab === 'profile' && (
            <>
              {/* Reporting Lines Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '14px',
                }}
              >
                {/* Reports To Card */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={13} style={{ color: 'var(--edge-primary)' }} />
                    Reports To (Direct Manager)
                  </div>
                  {res.managerInfo ? (
                    <div
                      onClick={() => handleNavigateToResource(res.managerInfo.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'var(--edge-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {res.managerInfo.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {res.managerInfo.name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {res.managerInfo.role} • {res.managerInfo.id}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--edge-primary)' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', padding: '6px 0' }}>
                      Primary Operational Lead (Reports to SteerCom)
                    </div>
                  )}
                </div>

                {/* Direct Reports Card */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={13} style={{ color: 'var(--edge-primary)' }} />
                    Direct Reports ({directReportResources.length})
                  </div>
                  {directReportResources.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                      {directReportResources.map(report => (
                        <div
                          key={report.id}
                          onClick={() => handleNavigateToResource(report.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-primary)',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          className="hover-card"
                        >
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{report.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{report.processGroup}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', padding: '10px 0' }}>
                      No direct reports (Individual Contributor / Subject Matter Specialist)
                    </div>
                  )}
                </div>
              </div>

              {/* Organization Assignment Grid */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '12px' }}>
                  Organizational Placement & Scope
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Business Domain</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.businessDomain}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Process Capability</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.processGroup}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Corporate Entity</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.entityObj?.name || res.entity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Contractual Track</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.track}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Onboarding Date</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.onboardingDate || '2025-08-01'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Gender Demographic</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {res.gender || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Competencies & Skills */}
          {activeTab === 'competencies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px' }}>
                  Core Competency Module
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} style={{ color: 'var(--edge-primary)' }} />
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {res.skill}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px' }}>
                  Certified Credential
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-green)' }} />
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {res.certification || 'Certified Professional'}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: '8px' }}>
                  Delivery Alignment & Governance
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Resource assigned to the {res.track} contractual track supporting EDGE application operations.
                  Certified in accordance with EDGE AMS Level 2/Level 3 service support thresholds.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Contact & Deployment */}
          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 86, 34, 0.1)',
                      color: 'var(--edge-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Corporate Email</div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {res.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copied ? <Check size={14} style={{ color: 'var(--color-green)' }} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--color-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Direct Dial / Contact</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {res.phone || '+971-50-XXX-XXXX'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(13, 159, 110, 0.1)',
                    color: 'var(--color-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Deployment Base</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {res.location === 'Onsite'
                      ? 'EDGE HQ, Abu Dhabi, United Arab Emirates (Client Premises)'
                      : 'AMS Remote Delivery Center (Offshore Center Pool)'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
