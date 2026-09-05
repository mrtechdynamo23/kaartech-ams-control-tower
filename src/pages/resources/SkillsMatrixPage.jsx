/**
 * EDGE AMS Control Tower — Skills Matrix & Competencies
 * Route: /resources/skills
 */
import React from 'react';
import { Award, BookOpen, CheckCircle, TrendingUp, Users } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function SkillsMatrixPage() {
  const skills = [
    { skill: 'SAP S/4HANA Finance (FICO)', level: 'Expert', primary: 6, secondary: 4, certified: 6, score: 98 },
    { skill: 'SAP S/4HANA Sales & Distribution (SD)', level: 'Expert', primary: 5, secondary: 3, certified: 5, score: 95 },
    { skill: 'SAP S/4HANA Sourcing & Procurement (MM)', level: 'Expert', primary: 5, secondary: 4, certified: 5, score: 96 },
    { skill: 'SAP SuccessFactors HXM', level: 'Advanced', primary: 4, secondary: 3, certified: 4, score: 92 },
    { skill: 'SAP Manufacturing (PP/QM/MES)', level: 'Expert', primary: 5, secondary: 2, certified: 4, score: 94 },
    { skill: 'SAP EWM & Logistics Execution', level: 'Advanced', primary: 3, secondary: 2, certified: 3, score: 90 },
    { skill: 'ABAP Core Data Services & Fiori', level: 'Expert', primary: 5, secondary: 3, certified: 5, score: 98 },
    { skill: 'SAP BTP & Cloud Integration Suite', level: 'Advanced', primary: 4, secondary: 2, certified: 4, score: 92 },
    { skill: 'BASIS Administration & HANA SPS07', level: 'Expert', primary: 3, secondary: 2, certified: 3, score: 96 },
    { skill: 'Microsoft Dynamics 365 CRM', level: 'Advanced', primary: 3, secondary: 2, certified: 3, score: 88 },
  ];

  return (
    <div className="skills-matrix-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Skills Matrix & Technical Capability</h1>
            <span className="badge badge-success">Multi-Skilled Pod Structure</span>
          </div>
          <p className="page-subtitle">Evaluation of technical skills, SAP/Microsoft certifications, and cross-domain operational redundancy.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Certified Specialists"
          value="100%"
          subtitle="All 30 consultants certified"
          icon={Award}
          status="success"
        />
        <KPICard
          title="Redundancy Ratio"
          value="2.2x"
          subtitle="Min 2 consultants per module"
          icon={Users}
          status="success"
        />
        <KPICard
          title="Competency Rating"
          value="94.9%"
          subtitle="Audited technical benchmark"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Cross-Trained"
          value="26 / 30"
          subtitle="Secondary domain ready"
          icon={CheckCircle}
        />
      </div>

      {/* Table of Skills */}
      <div className="chart-card">
        <h3 className="chart-card-title">Core Technology Competency Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Technology & Functional Domain</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Proficiency Tier</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Primary Specialists</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Secondary Backup</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Certified FTEs</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Capability Score</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.skill}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-primary">{s.level}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{s.primary} Leads</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.secondary} FTEs</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{s.certified} Certified</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', minWidth: '36px' }}>{s.score}%</span>
                      <div style={{ height: '6px', width: '80px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.score}%`, background: 'var(--edge-primary)', borderRadius: '3px' }} />
                      </div>
                    </div>
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
