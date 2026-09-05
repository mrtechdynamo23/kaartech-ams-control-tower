/**
 * EDGE AMS Control Tower — Executive C-Level Briefing
 * Route: /reporting/executive
 */
import React from 'react';
import { Award, Download, ShieldCheck, CheckCircle2, TrendingUp, DollarSign, Activity, FileText, Printer } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function ExecutiveReportPage() {
  const handlePrint = () => window.print();

  return (
    <div className="executive-report-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Executive Briefing & C-Level Deck</h1>
            <span className="badge badge-success">Group Leadership Briefing</span>
          </div>
          <p className="page-subtitle">Strategic overview for the EDGE Group Executive Committee, Managing Director, and CIO.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={15} />
            <span>Print Deck</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={15} />
            <span>Export Executive Pack</span>
          </button>
        </div>
      </div>

      {/* 9-Dimension Executive Matrix */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Overall SLA Score"
          value="95.4%"
          target="88.0%"
          status="success"
          trend={+1.8}
          icon={CheckCircle2}
        />
        <KPICard
          title="ERP Estate Uptime"
          value="99.98%"
          target="99.90%"
          status="success"
          icon={Activity}
        />
        <KPICard
          title="Customer CSAT"
          value="4.6 / 5.0"
          target="4.2"
          status="success"
          icon={Award}
        />
        <KPICard
          title="Annual Cost Savings"
          value="AED 1.8M"
          status="success"
          subtitle="CIP & Automation Value"
          icon={DollarSign}
        />
      </div>

      {/* Strategic Summary Document */}
      <div className="chart-card" style={{ padding: '28px' }}>
        <div style={{ borderBottom: '2px solid var(--edge-primary)', paddingBottom: '16px', marginBottom: '20px' }}>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            EDGE Group PJSC — Operational Intelligence
          </span>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Quarterly AMS Governance & Transformation Review
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Strategic Imperatives Achieved
            </h4>
            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
              <li><strong>Zero Operational Penalties:</strong> Full contractual compliance maintained across all 34 entities with 0 SLA penalties.</li>
              <li><strong>Proactive Shift-Left:</strong> Incident inflow reduced by 32.4% via automated self-healing and KEDB deflection.</li>
              <li><strong>Workforce Localization:</strong> 43% UAE National representation achieved across Onsite delivery pods.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Forward Looking Horizons
            </h4>
            <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px', margin: 0 }}>
              <li><strong>Wave 3 S/4HANA Go-Live:</strong> Manufacturing entity cutovers scheduled for Q4 2026.</li>
              <li><strong>GenAI Diagnostic Expansion:</strong> Scaling Joule and LLM runbook copilots to all L2 support pods.</li>
              <li><strong>ISO 20000 Re-Certification:</strong> Annual surveillance audit scheduled for Q1 2027 with 100% readiness.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
