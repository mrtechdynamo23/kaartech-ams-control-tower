/**
 * EDGE AMS Control Tower — Automation Hub & Bots
 * Route: /service-innovation/automation
 * Automation delivery pipeline: Idea → Assessment → Approved → Build → Pilot → Live (Section 31).
 */
import React, { useState } from 'react';
import {
  Bot, Zap, CheckCircle2, Clock, Play, ArrowRight,
  Plus, Cpu, Layers, CheckSquare, Sparkles, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import KPICard from '../../components/common/KPICard';
import ChartCard from '../../components/common/ChartCard';

export default function AutomationPage() {
  const [selectedStage, setSelectedStage] = useState('all');

  // Pipeline Stages per Section 31
  const pipelineStages = [
    { stage: 'Idea', count: 8, color: '#71777C', desc: 'Identified opportunity in backlog' },
    { stage: 'Assessment', count: 5, color: '#2563EB', desc: 'Feasibility & ROI calculation' },
    { stage: 'Approved', count: 4, color: '#7C3AED', desc: 'SteerCom signed off for build' },
    { stage: 'Build', count: 3, color: '#FF5622', desc: 'Active bot development in sprint' },
    { stage: 'Pilot', count: 2, color: '#D97706', desc: 'Entity UAT & dry-run testing' },
    { stage: 'Live (24/7)', count: 4, color: '#0D9F6E', desc: 'Autonomous production execution' },
  ];

  const bots = [
    { name: 'SAP User Provisioning & Role Assign Bot', type: 'RPA / BTP Workflow', runsPerDay: '84 runs/day', hoursSaved: '1,420 hrs/yr', successRate: '99.8%', status: 'Live (24/7)' },
    { name: 'Period-End Financial Batch Self-Healer', type: 'Automated Script', runsPerDay: '24 runs/day', hoursSaved: '860 hrs/yr', successRate: '100%', status: 'Live (24/7)' },
    { name: 'Vendor Invoice OCR & Three-Way Matcher', type: 'AI / RPA', runsPerDay: '140 runs/day', hoursSaved: '1,640 hrs/yr', successRate: '98.5%', status: 'Live (24/7)' },
    { name: 'HANA Database Log Truncate & Health Bot', type: 'BASIS Daemon', runsPerDay: '48 runs/day', hoursSaved: '900 hrs/yr', successRate: '100%', status: 'Live (24/7)' },
    { name: 'Automated MES Shopfloor Telemetry Scraper', type: 'Edge Daemon', runsPerDay: '120 runs/day', hoursSaved: '640 hrs/yr', successRate: '99.4%', status: 'Pilot' },
    { name: 'Procure-to-Pay PO Variance Auto-Reconciler', type: 'BTP Service', runsPerDay: 'In Build', hoursSaved: 'Est 800 hrs/yr', successRate: 'Pending', status: 'Build' },
  ];

  const filteredBots = selectedStage === 'all'
    ? bots
    : bots.filter(b => b.status.toLowerCase().includes(selectedStage.toLowerCase()));

  return (
    <div className="automation-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title">Automation & Robotic Process Hub</h1>
            <span className="badge badge-success">4,820 Hours Saved Annually</span>
            <span className="badge badge-primary">6-Stage Delivery Pipeline</span>
          </div>
          <p className="page-subtitle">
            Robotic Process Automation (RPA), self-healing daemons, and end-to-end automation lifecycle tracking.
          </p>
        </div>

        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Submit Automation Idea</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        <KPICard
          title="Active Live Bots"
          value="4 Deployed"
          subtitle="Autonomous RPA runners"
          icon={Bot}
          status="success"
        />
        <KPICard
          title="Annual Hours Saved"
          value="4,820h"
          unit="hrs/yr"
          status="success"
          trend={+18}
          icon={Zap}
          sparklineData={[3200, 3900, 4400, 4820]}
        />
        <KPICard
          title="Execution Success"
          value="99.6%"
          status="success"
          subtitle="Zero unhandled bot exceptions"
          icon={CheckCircle2}
        />
        <KPICard
          title="Daily Automated Runs"
          value="296 / day"
          subtitle="Autonomous transactions"
          icon={Play}
        />
        <KPICard
          title="Pipeline Volume"
          value="26 Ideas"
          subtitle="Opportunities in progression"
          icon={Layers}
        />
      </div>

      {/* Visual Analytics: 6-Stage Delivery Pipeline Funnel (Section 31) */}
      <ChartCard
        title="Automation Delivery Pipeline (Idea → Assessment → Approved → Build → Pilot → Live)"
        subtitle="Current distribution of automation candidate use-cases across delivery lifecycle"
        badge="26 Opportunities"
        height={260}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipelineStages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
            <XAxis dataKey="stage" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-lg)'
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              itemStyle={{ color: 'var(--text-primary)' }}
              formatter={(val, name, props) => [`${val} Candidates`, props.payload.desc]}
            />
            <Bar dataKey="count" name="Automation Use-Cases" radius={[4, 4, 0, 0]} barSize={32}>
              {pipelineStages.map((entry, idx) => (
                <Cell key={`pipe-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bot Catalogue Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={12} /> Filter by Stage:
        </span>
        {['all', 'Live', 'Pilot', 'Build'].map(st => (
          <button
            key={st}
            onClick={() => setSelectedStage(st)}
            className={`btn btn-sm ${selectedStage === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '11px', padding: '4px 12px' }}
          >
            {st === 'all' ? 'All Automation Assets' : `${st} Stage`}
          </button>
        ))}
      </div>

      {/* Bot Catalogue Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredBots.map((b, idx) => (
          <div key={idx} className="chart-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{b.name}</h4>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{b.type}</div>
              </div>
              <span className={`badge ${b.status.includes('Live') ? 'badge-success' : b.status === 'Pilot' ? 'badge-warning' : 'badge-primary'}`}>
                {b.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', border: '1px solid var(--border-secondary)' }}>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Frequency</div>
                <strong style={{ color: 'var(--text-primary)' }}>{b.runsPerDay}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Hours Saved</div>
                <strong style={{ color: 'var(--color-emerald)' }}>{b.hoursSaved}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Success Rate</div>
                <strong style={{ color: 'var(--text-primary)' }}>{b.successRate}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
