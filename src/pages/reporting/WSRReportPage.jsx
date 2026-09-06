/**
 * EDGE AMS Control Tower — Weekly Service Report (WSR)
 * Route: /reporting/wsr
 */
import React from 'react';
import { FileText, Download, TrendingUp, BarChart3, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import KPICard from '../../components/common/KPICard';

export default function WSRReportPage() {
  const weeklyData = [
    { app: 'SAP S/4HANA', Volume: 42, SLA: 96 },
    { app: 'SAP SuccessFactors', Volume: 28, SLA: 98 },
    { app: 'SAP Ariba', Volume: 24, SLA: 95 },
    { app: 'MS Dynamics 365', Volume: 18, SLA: 94 },
    { app: 'SAP MES / MII', Volume: 16, SLA: 98 },
  ];

  return (
    <div className="wsr-report-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Weekly Service Report (WSR)</h1>
            <span className="badge badge-primary">7-Day Analysis</span>
          </div>
          <p className="page-subtitle">Weekly trend analysis, top application driver patterns, and root-cause resolution progress.</p>
        </div>

        <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} />
          <span>Export WSR Deck</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Weekly Inflow"
          value="128 Tickets"
          subtitle="Incidents & Service Requests"
          icon={BarChart3}
        />
        <KPICard
          title="Weekly Outflow"
          value="134 Closed"
          status="success"
          subtitle="Net backlog reduction of 6"
          icon={TrendingUp}
        />
        <KPICard
          title="Weekly SLA Compliance"
          value="95.8%"
          target="88.0%"
          status="success"
          icon={CheckCircle2}
        />
        <KPICard
          title="RCA Actions Closed"
          value="6 RCAs"
          status="success"
          subtitle="Permanent bug fixes delivered"
          icon={AlertOctagon}
        />
      </div>

      {/* Top Application Inflow Chart */}
      <div className="chart-card">
        <h3 className="chart-card-title">Top 5 Application Volume & SLA Performance</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="app" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', boxShadow: 'var(--shadow-lg)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Volume" fill="#D13212" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
