/**
 * EDGE AMS Control Tower — Contact & Escalation Matrix
 * Route: /resources/contact
 * 24/7 On-call roster, emergency escalations, vendor support hotlines,
 * and complete EDGE Resource Master contact directory (Section 5).
 */
import React, { useState, useMemo } from 'react';
import { Phone, Mail, ShieldAlert, Clock, AlertTriangle, ExternalLink, Search, Users, MapPin } from 'lucide-react';
import { RESOURCES } from '../../data/demoData';

export default function ContactMatrixPage() {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  const escalations = [
    { level: 'Level 1: Operational Triage', time: 'Immediate (within 15m)', role: 'General Shift Lead / On-Call Specialist', contact: '+971-50-XXX-1001', email: 'ams.l1@kaartech.com', lead: 'Khalid Al Hashimi' },
    { level: 'Level 2: Management Escalation', time: 'T + 1 Hour (P1/P2)', role: 'AMS Delivery Manager', contact: '+971-50-XXX-1002', email: 'ams.lead@kaartech.com', lead: 'Fatima Al Zaabi' },
    { level: 'Level 3: Executive SteerCom', time: 'T + 2 Hours (Critical Outage)', role: 'Program Director', contact: '+971-50-XXX-0001', email: 'director.ams@kaartech.com', lead: 'Dr. Tariq Al Nuaimi' },
  ];

  const vendorHotlines = [
    { vendor: 'SAP SE', contract: 'SAP MaxAttention / Premium', hotline: '1-800-SAP-CARE (Abu Dhabi Hub)', ref: 'Enterprise Cust #8821092' },
    { vendor: 'Microsoft', contract: 'Unified Enterprise Support', hotline: '800-MICROSOFT (Azure UAE)', ref: 'Enterprise Agreement #MS-9912' },
    { vendor: 'Opentext', contract: 'Platinum Direct 24/7', hotline: '+971-4-XXX-8890', ref: 'Opentext Support PIN: 44219' },
  ];

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(r => {
      if (domainFilter !== 'all' && r.businessDomain !== domainFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, domainFilter]);

  return (
    <div className="contact-matrix-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Contact & Escalation Matrix</h1>
            <span className="badge badge-error">24/7 Active On-Call</span>
            <span className="badge badge-primary">{RESOURCES.length} Master Personnel</span>
          </div>
          <p className="page-subtitle">Standardized emergency call-out protocols, management hierarchy, OEM hotlines, and complete enterprise resource directory.</p>
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
      <div className="chart-card" style={{ marginBottom: '24px' }}>
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

      {/* Complete EDGE Resource Master Contact Directory (Section 5) */}
      <div className="chart-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="chart-card-title" style={{ margin: 0 }}>
              KaarTech AMS Resource Master Directory ({RESOURCES.length} Personnel)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Official contact matrix for all dedicated delivery pod specialists and consultants.
            </span>
          </div>

          {/* Search & Domain Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ID, phone..."
                style={{
                  padding: '5px 10px 5px 30px', fontSize: '12px', borderRadius: '4px',
                  border: '1px solid var(--border-primary)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', width: '180px'
                }}
              />
            </div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{
                padding: '5px 8px', fontSize: '12px', borderRadius: '4px',
                border: '1px solid var(--border-primary)', background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="all">All Domains (8)</option>
              {['L2C', 'E2M', 'P2P', 'D2S', 'S2P', 'A2D', 'R2R', 'H2R'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of All Resources */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '10px 12px' }}>Emp ID</th>
                <th style={{ padding: '10px 12px' }}>Specialist Name</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Domain & Process</th>
                <th style={{ padding: '10px 12px' }}>Track</th>
                <th style={{ padding: '10px 12px' }}>Location</th>
                <th style={{ padding: '10px 12px' }}>Direct Phone</th>
                <th style={{ padding: '10px 12px' }}>Official Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  style={{
                    borderBottom: '1px solid var(--border-secondary)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--edge-primary)' }}>
                    {res.id}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {res.name}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                    {res.role}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{res.businessDomain}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}> — {res.processGroup}</span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      {res.track}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className={`badge ${res.location === 'Onsite' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                      {res.location}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <a href={`tel:${res.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
                      <Phone size={12} style={{ color: 'var(--edge-primary)' }} />
                      <span>{res.phone}</span>
                    </a>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <a href={`mailto:${res.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-blue)', textDecoration: 'none' }}>
                      <Mail size={12} />
                      <span>{res.email}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
