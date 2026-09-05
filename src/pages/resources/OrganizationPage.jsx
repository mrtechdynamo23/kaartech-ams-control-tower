/**
 * EDGE AMS Control Tower — Organization Structure
 * Route: /resources/organization
 * 3-Tier Support Hierarchy & Governance Framework.
 */
import React from 'react';
import { Users, Shield, Award, ChevronRight, User } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function OrganizationPage() {
  const leadership = [
    { role: 'EDGE AMS Program Director', name: 'Dr. Tariq Al Nuaimi', entity: 'EDGE Group HQ', focus: 'Strategic Alignment & SteerCom' },
    { role: 'AMS Delivery Lead', name: 'Fatima Al Zaabi', entity: 'EDGE Business Services', focus: 'Service Level & Operational Delivery' },
    { role: 'Quality & Governance Lead', name: 'Sara Al Marzouqi', entity: 'EDGE Technologies', focus: 'Audit, Risk & Continuous Improvement' },
  ];

  const domainLeads = [
    { domain: 'L2C', name: 'Khalid Al Hashimi', role: 'Lead-to-Cash Functional Lead', track: 'AMS-ON-RUN' },
    { domain: 'R2R', name: 'Fatima Al Zaabi', role: 'Record-to-Report Functional Lead', track: 'AMS-ON-RUN' },
    { domain: 'P2P', name: 'Ravi Shankar', role: 'Procure-to-Pay Lead', track: 'AMS-OF-RUN' },
    { domain: 'E2M', name: 'Priya Nair', role: 'Estimate-to-Manufacture Lead', track: 'AMS-OF-RUN' },
    { domain: 'D2S', name: 'Omar Bashar', role: 'Demand-to-Supply Lead', track: 'AMS-ON-RUN' },
    { domain: 'S2P', name: 'Noura Al Shamsi', role: 'Source-to-Pay Lead', track: 'AMS-ON-RUN' },
    { domain: 'H2R', name: 'Sara Al Marzouqi', role: 'Hire-to-Retire Lead', track: 'AMS-ON-RUN' },
    { domain: 'A2D', name: 'Tariq Al Dhaheri', role: 'Acquire-to-Decommission Lead', track: 'AMS-ON-RUN' },
  ];

  return (
    <div className="organization-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Organization Structure & Support Hierarchy</h1>
            <span className="badge badge-primary">3-Tier Governance</span>
          </div>
          <p className="page-subtitle">Organizational accountability, domain functional leads, and operational escalation authority.</p>
        </div>
      </div>

      {/* Leadership SteerCom */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <h3 className="chart-card-title">Governance Leadership & SteerCom</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {leadership.map((lead, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--edge-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {lead.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--edge-primary)', fontWeight: 700 }}>{lead.role}</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{lead.entity} • {lead.focus}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Functional Leads */}
      <div className="chart-card">
        <h3 className="chart-card-title">Business Domain Functional Leads</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {domainLeads.map((dl, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{dl.domain}</span>
                  <span style={{ fontSize: '10px', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: '4px' }}>{dl.track}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{dl.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{dl.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
