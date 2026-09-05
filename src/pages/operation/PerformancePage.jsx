/**
 * EDGE AMS Control Tower — Service Performance Analytics
 * Route: /service-operation/performance
 */
import React from 'react';
import { Activity, Clock, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import KPICard from '../../components/common/KPICard';

export default function PerformancePage() {
  const agingData = [
    { bucket: '< 2 Days', Incidents: 28, ServiceRequests: 18 },
    { bucket: '3 – 7 Days', Incidents: 12, ServiceRequests: 14 },
    { bucket: '8 – 15 Days', Incidents: 5, ServiceRequests: 6 },
    { bucket: '16 – 30 Days', Incidents: 2, ServiceRequests: 3 },
    { bucket: '> 30 Days', Incidents: 0, ServiceRequests: 1 },
  ];

  return (
    <div className="performance-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Service Performance Analytics</h1>
            <span className="badge badge-success">High Velocity Operations</span>
          </div>
          <p className="page-subtitle">Granular operational telemetry, ticket aging distribution, and resolver group resolution velocity.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="First Contact Resolution"
          value="74.2%"
          target="70.0%"
          status="success"
          icon={CheckCircle2}
          sparklineData={[68, 71, 73, 74.2]}
        />
        <KPICard
          title="Average MTTR"
          value="3.2h"
          unit="hrs"
          status="success"
          trend={-14}
          isPositiveGood={false}
          icon={Clock}
          sparklineData={[4.2, 3.8, 3.5, 3.2]}
        />
        <KPICard
          title="Backlog Aging Health"
          value="96.8%"
          status="success"
          subtitle="Tickets resolved in < 7 days"
          icon={Activity}
        />
        <KPICard
          title="Customer Re-open Index"
          value="1.8%"
          target="< 3.0%"
          status="success"
          icon={TrendingUp}
        />
      </div>

      {/* Aging Chart */}
      <div className="chart-card">
        <h3 className="chart-card-title">Active Ticket Aging Distribution</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agingData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="bucket" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Incidents" fill="#D13212" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ServiceRequests" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
