/**
 * EDGE AMS Control Tower — AI & Machine Learning Hub
 * Route: /service-innovation/ai
 */
import React from 'react';
import { Sparkles, Bot, Zap, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import KPICard from '../../components/common/KPICard';

export default function AIHubPage() {
  const aiEngines = [
    { name: 'AI Incident Triage & Domain Routing', model: 'Fine-Tuned NLP Classifier', accuracy: '94.6%', speed: '< 200ms', description: 'Automatically maps incoming tickets to the correct domain consultant and SLA tier based on semantic analysis.' },
    { name: 'GenAI Root-Cause & Runbook Synthesizer', model: 'Enterprise LLM Gateway', accuracy: '91.2%', speed: '1.2s', description: 'Generates instant diagnostic suggestions and links relevant SAP Notes & KEDB runbooks to triage engineers.' },
    { name: 'Predictive Outage & APM Anomaly Detector', model: 'Time-Series Isolation Forest', accuracy: '96.0%', speed: 'Real-Time', description: 'Detects irregular database transaction spikes and interface queue pile-ups 20 minutes before user impact.' },
  ];

  return (
    <div className="ai-hub-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">AI & Operational Intelligence Hub</h1>
            <span className="badge badge-primary">94.6% Auto-Triage Accuracy</span>
          </div>
          <p className="page-subtitle">Machine learning pipelines, predictive anomaly detection, and generative AI incident triage accelerators.</p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="Auto-Triage Accuracy"
          value="94.6%"
          target="90.0%"
          status="success"
          trend={+2.4}
          icon={Sparkles}
          sparklineData={[89, 91, 93, 94.6]}
        />
        <KPICard
          title="Triage Time Saved"
          value="18 mins"
          unit="/ ticket"
          status="success"
          subtitle="Direct routing to right resolver"
          icon={Zap}
        />
        <KPICard
          title="AI-Assisted Resolutions"
          value="48.2%"
          status="success"
          subtitle="SOPs recommended via GenAI"
          icon={Bot}
        />
        <KPICard
          title="Anomaly Early Warning"
          value="20 mins"
          subtitle="Pre-incident alert threshold"
          icon={Cpu}
        />
      </div>

      {/* AI Engines */}
      <div className="chart-card">
        <h3 className="chart-card-title">Deployed AI Operational Models</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {aiEngines.map((eng, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '18px 22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Sparkles size={16} style={{ color: 'var(--edge-primary)' }} />
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{eng.name}</h4>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--edge-primary)', fontWeight: 600, marginBottom: '6px' }}>Model: {eng.model}</div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{eng.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: 'var(--text-xs)' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '8px 14px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Accuracy</div>
                  <strong style={{ color: 'var(--color-emerald)', fontSize: 'var(--text-sm)' }}>{eng.accuracy}</strong>
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '8px 14px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-secondary)' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>Inference</div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{eng.speed}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
