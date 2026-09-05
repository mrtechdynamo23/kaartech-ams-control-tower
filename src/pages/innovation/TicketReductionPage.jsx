/**
 * EDGE AMS Control Tower — Ticket Reduction & Value Conversion
 * Route: /service-innovation/ticket-reduction
 * Visual waterfall model: Baseline → Knowledge Deflection → Automation → RCA Fixes → Net Volume (Section 31).
 */
import React from 'react';
import {
  Zap, TrendingDown, ArrowRight, ShieldCheck, CheckCircle2, Clock,
  Sparkles, ArrowDownRight, RefreshCw, Cpu
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';

export default function TicketReductionPage() {
  // Reduction Waterfall Data
  const waterfallData = [
    { stage: '1. Baseline Inflow', count: 1200, color: '#71777C', desc: 'Gross demand before innovation initiatives' },
    { stage: '2. KEDB Self-Service', count: -298, color: '#0D9F6E', desc: 'Shift-left self-service deflection' },
    { stage: '3. RPA Auto-Healing', count: -184, color: '#2563EB', desc: 'Automated script recovery' },
    { stage: '4. Permanent RCA Fixes', count: -140, color: '#7C3AED', desc: 'Zero-recurrence code remedies' },
    { stage: '5. Net Managed Volume', count: 578, color: '#FF5622', desc: 'Optimized operational workload (-51.8%)' },
  ];

  // Mechanism Cards
  const mechanisms = [
    {
      name: 'Mechanism A: Unused Ticket Capacity Conversion',
      tag: 'Section 58 Innovation Credit',
      desc: 'Converts surplus monthly ticket capacity into proactive automation and enhancement person-hours at contracted conversion ratios.',
      metric: '320 Hours Converted',
      status: 'Active Policy',
    },
    {
      name: 'Mechanism B: Shift-Left Self-Service Deflection',
      tag: 'Knowledge & Portal Automation',
      desc: 'Empowers business users across 34 entities to self-resolve routine password, master data lookup, and reporting inquiries.',
      metric: '24.8% Deflection Rate',
      status: 'Active',
    },
    {
      name: 'Mechanism C: Permanent Error Eradication',
      tag: 'Root-Cause Engineering',
      desc: 'Identifies recurring application bug signatures and implements permanent database / ABAP code fixes.',
      metric: '140 Tickets/mo Eliminated',
      status: 'Active',
    },
  ];

  return (
    <div className="ticket-reduction-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Ticket Reduction & Value Conversion</h1>
            <span className="badge badge-success">-51.8% Net Volume Eradication</span>
            <span className="badge badge-primary">320h Converted to Innovation</span>
          </div>
          <p className="page-subtitle">
            Shift-left deflection, root-cause defect eradication, and conversion of unused run capacity into high-value enhancements.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Net Volume Reduction"
          value="-51.8%"
          status="success"
          isPositiveGood={true}
          trend={-51.8}
          icon={TrendingDown}
          sparklineData={[1200, 980, 750, 578]}
        />
        <KPICard
          title="Converted Innovation Hours"
          value="320h"
          subtitle="Transferred to Enhancement track"
          icon={Zap}
        />
        <KPICard
          title="Shift-Left Deflection"
          value="24.8%"
          status="success"
          subtitle="Self-service portal resolution"
          icon={ShieldCheck}
        />
        <KPICard
          title="Recurring Defect Eradication"
          value="140 / mo"
          status="success"
          subtitle="Eliminated via permanent fixes"
          icon={CheckCircle2}
        />
      </div>

      {/* Visual Analytics Layer: Reduction Waterfall per Section 31 */}
      <ChartCard
        title="Ticket Reduction Waterfall & Volume Deflection Model"
        subtitle="Current Volume (1,200) → KEDB Deflection (-298) → RPA Automation (-184) → RCA Eradication (-140) → Net Volume (578)"
        badge="Strategic Value Model"
        height={280}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
            <XAxis dataKey="stage" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                boxShadow: 'var(--shadow-lg)'
              }}
              formatter={(val, name, props) => [`${Math.abs(val)} tickets`, props.payload.desc]}
            />
            <Bar dataKey="count" name="Ticket Volume Impact" radius={[6, 6, 0, 0]} barSize={36}>
              {waterfallData.map((entry, idx) => (
                <Cell key={`wf-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3 Innovation Mechanisms */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Active Contractual Value Mechanisms
        </h3>

        {mechanisms.map((m, idx) => (
          <div key={idx} className="chart-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>{m.tag}</span>
                  <span className="badge badge-success">{m.status}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 6px' }}>{m.name}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', textAlign: 'center', minWidth: '170px' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-emerald)' }}>{m.metric}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Quantified Impact</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
