/**
 * EDGE AMS Control Tower — User Enablement & Self-Service
 * Route: /service-innovation/user-enablement
 */
import React from 'react';
import { GraduationCap, Users, CheckCircle2, TrendingUp, BookOpen, Video } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function UserEnablementPage() {
  const courses = [
    { title: 'S/4HANA Sales Order Creation & Pricing Best Practices', domain: 'L2C', enrolled: 420, completed: 395, score: '96%' },
    { title: 'Ariba Guided Sourcing for Procurement Officers', domain: 'S2P', enrolled: 280, completed: 260, score: '94%' },
    { title: 'SuccessFactors Performance & Goals Self-Service', domain: 'H2R', enrolled: 1250, completed: 1180, score: '98%' },
    { title: 'Plant Maintenance Mobile Work Orders for Technicians', domain: 'A2D', enrolled: 180, completed: 165, score: '92%' },
  ];

  return (
    <div className="user-enablement-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">User Enablement & Digital Adoption</h1>
            <span className="badge badge-success">88.4% User Adoption</span>
          </div>
          <p className="page-subtitle">End-user capability enablement, digital walkthroughs, and self-service training adoption analytics.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Trained End-Users"
          value="2,130"
          subtitle="Across 34 business units"
          icon={GraduationCap}
          status="success"
        />
        <KPICard
          title="Digital Adoption Rate"
          value="88.4%"
          target="80.0%"
          status="success"
          trend={+4.2}
          icon={TrendingUp}
          sparklineData={[78, 81, 85, 88.4]}
        />
        <KPICard
          title="Course Completion"
          value="94.2%"
          status="success"
          subtitle="Certification exam pass rate"
          icon={CheckCircle2}
        />
        <KPICard
          title="Walkthrough Guides"
          value="48 SOPs"
          subtitle="In-app interactive tips"
          icon={BookOpen}
        />
      </div>

      {/* Training Courses Table */}
      <div className="chart-card">
        <h3 className="chart-card-title">Active Digital Learning Modules</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Course Title / Learning Track</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Domain</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Enrolled Users</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Completions</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Pass Score</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-neutral">{c.domain}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>{c.enrolled} Users</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-emerald)', fontWeight: 600 }}>{c.completed} ({Math.round((c.completed/c.enrolled)*100)}%)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 700 }}>{c.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
