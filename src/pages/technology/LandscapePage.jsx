/**
 * EDGE AMS Control Tower — Architecture Landscape
 * Route: /technology/landscape
 */
import React from 'react';
import { Layers, Server, Cloud, Database, Globe, Cpu } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function LandscapePage() {
  const layers = [
    {
      name: 'Layer 1: User Experience & Digital Portals',
      icon: Globe,
      color: '#D13212',
      items: [
        { name: 'SAP Analytics Cloud (SAC) Boardroom', tech: 'Cloud', type: 'Executive Analytics' },
        { name: 'eVendor Supplier Portal', tech: 'Web / BTP', type: 'Procurement Interface' },
        { name: 'Security Clearance Portal', tech: 'Web Custom', type: 'Defense Compliance' },
        { name: 'Product Management Portal', tech: 'Web Custom', type: 'Engineering Workspace' },
      ]
    },
    {
      name: 'Layer 2: Core Enterprise Applications & Business Engines',
      icon: Layers,
      color: '#2563eb',
      items: [
        { name: 'SAP S/4HANA 2025 Enterprise Core', tech: 'SAP', type: 'ERP / MDG / GRC / AC' },
        { name: 'SAP SuccessFactors HXM', tech: 'Cloud SaaS', type: 'Hire-to-Retire' },
        { name: 'SAP Ariba Strategic Sourcing', tech: 'Cloud SaaS', type: 'Source-to-Pay' },
        { name: 'Microsoft Dynamics 365 Enterprise', tech: 'Cloud SaaS', type: 'Lead-to-Cash & Field Service' },
        { name: 'SAP MES / MII Plant Operations', tech: 'On-Prem / Edge', type: 'Estimate-to-Manufacture' },
      ]
    },
    {
      name: 'Layer 3: Middleware & Integration Services',
      icon: Cpu,
      color: '#10b981',
      items: [
        { name: 'SAP Cloud Platform Integration (CPI)', tech: 'BTP Integration Suite', type: 'Cloud Integration Broker' },
        { name: 'SAP Process Orchestration (PO 7.5)', tech: 'On-Prem Java', type: 'Legacy Enterprise Bus' },
        { name: 'Opentext xECM Connector', tech: 'REST / RFC', type: 'Content Bridge' },
      ]
    },
    {
      name: 'Layer 4: Data & Enterprise Repository',
      icon: Database,
      color: '#8b5cf6',
      items: [
        { name: 'SAP HANA 2.0 Database SPS07', tech: 'In-Memory DB', type: 'Primary Relational Data' },
        { name: 'SAP BW/4HANA & BPC Consolidation', tech: 'Enterprise Warehouse', type: 'Financial Consolidation' },
        { name: 'Opentext Content Server xECM', tech: 'Document Archive', type: 'Unstructured Storage' },
      ]
    },
  ];

  return (
    <div className="landscape-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Enterprise Architecture & Landscape</h1>
            <span className="badge badge-primary">KaarTech 4-Tier Stack</span>
          </div>
          <p className="page-subtitle">Interactive map of digital channels, core transactional backbones, middleware brokers, and data layers.</p>
        </div>
      </div>

      {/* Stack Layers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={idx} className="chart-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: layer.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                </div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {layer.name}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {layer.items.map((it, itemIdx) => (
                  <div key={itemIdx} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {it.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      <span>{it.tech}</span>
                      <span style={{ color: 'var(--edge-primary)', fontWeight: 500 }}>{it.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
