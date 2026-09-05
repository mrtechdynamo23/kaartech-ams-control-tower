/**
 * EDGE AMS Control Tower — Contact & Escalation Matrix
 * Route: /resources/contact
 * 24/7 On-call roster, emergency escalations, and vendor support hotlines.
 */
import React from 'react';
import { Phone, Mail, ShieldAlert, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

export default function ContactMatrixPage() {
  const escalations = [
    { level: 'Level 1: Operational Triage', time: 'Immediate (within 15m)', role: 'Shift Lead / On-Call Specialist', contact: '+971-50-XXX-1001', email: 'ams.l1@edge.ae', lead: 'Khalid Al Hashimi' },
    { level: 'Level 2: Management Escalation', time: 'T + 1 Hour (P1/P2)', role: 'AMS Delivery Manager', contact: '+971-50-XXX-1002', email: 'ams.lead@edge.ae', lead: 'Fatima Al Zaabi' },
    { level: 'Level 3: Executive SteerCom', time: 'T + 2 Hours (Critical Outage)', role: 'Program Director', contact: '+971-50-XXX-0001', email: 'director.ams@edge.ae', lead: 'Dr. Tariq Al Nuaimi' },
  ];

  const vendorHotlines = [
    { vendor: 'SAP SE', contract: 'SAP MaxAttention / Premium', hotline: '1-800-SAP-CARE (Abu Dhabi Hub)', ref: 'EDGE C-Cust #8821092' },
    { vendor: 'Microsoft', contract: 'Unified Enterprise Support', hotline: '800-MICROSOFT (Azure UAE)', ref: 'Enterprise Agreement #MS-9912' },
    { vendor: 'Opentext', contract: 'Platinum Direct 24/7', hotline: '+971-4-XXX-8890', ref: 'Opentext Support PIN: 44219' },
  ];

  return (
    <div className="contact-matrix-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Contact & Escalation Matrix</h1>
            <span className="badge badge-error">24/7 Active On-Call</span>
          </div>
          <p className="page-subtitle">Standardized emergency call-out protocols, management hierarchy, and OEM mission-critical escalations.</p>
        </div>
      </div>

      {/* 3-Level Escalation Path */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <h3 className="chart-card-title">Incident Escalation Hierarchy</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {escalations.map((esc, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', textTransform: 'uppercase' }}>{esc.level}</span>
                  <span style={{ fontSize: '11px', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{esc.time}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{esc.lead} — <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{esc.role}</span></div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                  <Phone size={14} style={{ color: 'var(--edge-primary)' }} />
                  <strong>{esc.contact}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <Mail size={14} />
                  <span>{esc.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OEM Vendor Direct Hotlines */}
      <div className="chart-card">
        <h3 className="chart-card-title">OEM Vendor 24/7 Priority Hotlines</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {vendorHotlines.map((vh, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{vh.vendor}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '10px' }}>{vh.contract}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--edge-primary)', fontWeight: 600, marginBottom: '4px' }}>
                Hotline: {vh.hotline}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{vh.ref}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
