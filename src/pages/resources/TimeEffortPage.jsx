/**
 * EDGE AMS Control Tower — Time & Effort Tracking
 * Route: /resources/time
 */
import React from 'react';
import { Clock, TrendingUp, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import KPICard from '../../components/common/KPICard';

export default function TimeEffortPage() {
  const effortData = [
    { track: 'AMS-ON-RUN', Billable: 2240, NonBillable: 160, Target: 2400 },
    { track: 'AMS-OF-RUN', Billable: 1920, NonBillable: 140, Target: 2000 },
    { track: 'AMS-OF-Flex', Billable: 980, NonBillable: 80, Target: 1000 },
    { track: 'ENH-OF-RUN', Billable: 1280, NonBillable: 120, Target: 1400 },
  ];

  return (
    <div className="time-effort-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Time & Effort Utilization</h1>
            <span className="badge badge-success">93.4% Billable Efficiency</span>
          </div>
          <p className="page-subtitle">Track person-hour allocation, delivery track utilization, and monthly billable burn rates.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Total Monthly Hours"
          value="6,420h"
          subtitle="Delivered across all streams"
          icon={Clock}
          sparklineData={[6100, 6250, 6380, 6420]}
        />
        <KPICard
          title="Billable Efficiency"
          value="93.4%"
          target="90.0%"
          status="success"
          trend={+1.4}
          icon={TrendingUp}
          sparklineData={[91, 92, 92.5, 93.4]}
        />
        <KPICard
          title="SLA Incident Effort"
          value="3,210h"
          subtitle="50% of total capacity"
          icon={CheckCircle2}
        />
        <KPICard
          title="Enhancement Burn"
          value="1,280h"
          subtitle="Dedicated CR delivery"
          icon={Calendar}
        />
      </div>

      {/* Chart */}
      <div className="chart-card">
        <h3 className="chart-card-title">Track-Level Effort Distribution (Person-Hours)</h3>
        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={effortData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="track" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Billable" fill="#D13212" radius={[4, 4, 0, 0]} />
              <Bar dataKey="NonBillable" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
