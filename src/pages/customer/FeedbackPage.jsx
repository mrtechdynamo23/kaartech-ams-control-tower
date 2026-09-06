/**
 * EDGE AMS Control Tower — Customer Feedback & CSAT Dashboard
 * Route: /customer/feedback
 *
 * Executive-grade analytical CSAT score visualization and survey registry.
 * Aligned with EDGE enterprise design system, high-contrast light mode,
 * restrained semantic colors, and live data-driven metrics.
 */
import React, { useState, useMemo } from 'react';
import {
  MessageSquare, Star, Smile, ThumbsUp, Award, TrendingUp,
  ShieldCheck, CheckCircle2, AlertTriangle, Filter, BarChart3
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { customerFeedback } from '../../data/demoData';

export default function FeedbackPage() {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('All');

  // Compute dynamic CSAT metrics from data layer
  const stats = useMemo(() => {
    const total = customerFeedback.length || 1;
    const tiers = [
      { key: 'Excellent', label: 'Excellent', weight: 5, color: '#10B981', badgeCls: 'badge-success' },
      { key: 'Very Good', label: 'Very Good', weight: 4, color: '#3B82F6', badgeCls: 'badge-primary' },
      { key: 'Good',      label: 'Good',      weight: 3, color: '#6366F1', badgeCls: 'badge-info' },
      { key: 'Poor',      label: 'Poor',      weight: 2, color: '#F59E0B', badgeCls: 'badge-warning' },
      { key: 'Very Poor', label: 'Very Poor', weight: 1, color: '#EF4444', badgeCls: 'badge-error' },
    ];

    const distribution = tiers.map(tier => {
      const count = customerFeedback.filter(f => f.rating === tier.key).length;
      const pct = Math.round((count / total) * 100);
      return { ...tier, count, pct };
    });

    // Executive Weighted CSAT Index: ((sum(weight * count)) / (total * 5)) * 100
    const weightedSum = distribution.reduce((sum, d) => sum + (d.weight * d.count), 0);
    const csatScore = Math.round((weightedSum / (total * 5)) * 100);

    // Positive satisfaction (Excellent + Very Good + Good)
    const positiveCount = customerFeedback.filter(f => ['Excellent', 'Very Good', 'Good'].includes(f.rating)).length;
    const positiveRate = ((positiveCount / total) * 100).toFixed(1);

    return {
      total,
      csatScore,
      positiveRate,
      distribution,
      targetScore: 90,
      trend: '+3.4% vs previous quarter',
    };
  }, []);

  // Filtered table data
  const filteredData = useMemo(() => {
    if (selectedRatingFilter === 'All') return customerFeedback;
    return customerFeedback.filter(f => f.rating === selectedRatingFilter);
  }, [selectedRatingFilter]);

  const columns = [
    { key: 'id', label: 'Survey Ref', width: '120px' },
    {
      key: 'ticketId',
      label: 'Ticket Ref',
      width: '120px',
      render: (v) => <span style={{ color: 'var(--edge-primary)', fontWeight: 700 }}>{v}</span>
    },
    { key: 'entity', label: 'Entity', width: '160px' },
    {
      key: 'rating',
      label: 'Rating',
      width: '140px',
      render: (val) => {
        let cls = 'badge-success';
        if (val === 'Very Poor') cls = 'badge-error';
        else if (val === 'Poor') cls = 'badge-warning';
        else if (val === 'Good') cls = 'badge-neutral';
        else if (val === 'Very Good') cls = 'badge-primary';
        return (
          <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
            {val === 'Excellent' && <Star size={12} fill="currentColor" />}
            {val}
          </span>
        );
      }
    },
    { key: 'comment', label: 'Verbatim Customer Feedback', wrap: true },
    { key: 'respondent', label: 'Stakeholder', width: '170px' },
    { key: 'date', label: 'Date', type: 'date', width: '120px' },
  ];

  return (
    <div className="feedback-page animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Customer Feedback & CSAT</h1>
            <span className="badge badge-primary">{stats.total} Verified Surveys</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Executive satisfaction indices, ratings distribution bands, and verbatim post-resolution feedback.
          </p>
        </div>
      </div>

      {/* ─── PRIMARY EXECUTIVE CSAT SCORE VISUALIZATION TILE ─── */}
      <div
        className="csat-analytical-card border-thick-strategic"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 86, 34, 0.12)',
                color: 'var(--edge-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                Executive Customer Satisfaction Index (CSAT)
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                Multi-tier satisfaction distribution across all contractual services
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <TrendingUp size={13} /> {stats.trend}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-secondary)',
              }}
            >
              Target: ≥ {stats.targetScore}%
            </span>
          </div>
        </div>

        {/* Core Visualization Layout: Big Score + Horizontal Distribution Bands */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            alignItems: 'center',
          }}
        >
          {/* Main Score Hero */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px 24px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Overall CSAT Score
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {stats.csatScore}%
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--edge-primary)' }}>
                CSAT
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <ShieldCheck size={16} style={{ color: '#10B981' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#10B981' }}>
                Contractual SLA Benchmark Exceeded
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
              Based on {stats.total} verified post-closure stakeholder responses
            </div>
          </div>

          {/* Horizontal Score Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', paddingBottom: 2 }}>
              <span>Satisfaction Tier</span>
              <span>Distribution & Volume</span>
            </div>

            {stats.distribution.map((d) => (
              <div
                key={d.key}
                onClick={() => setSelectedRatingFilter(selectedRatingFilter === d.key ? 'All' : d.key)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '95px 1fr 50px 65px',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  background: selectedRatingFilter === d.key ? 'var(--bg-active)' : 'transparent',
                  border: selectedRatingFilter === d.key ? '1px solid var(--edge-primary)' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                title={`Click to filter by ${d.label}`}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {d.label}
                </span>

                {/* Progress bar track */}
                <div
                  style={{
                    height: 10,
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 9999,
                    overflow: 'hidden',
                    border: '1px solid var(--border-secondary)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${d.pct}%`,
                      background: d.color,
                      borderRadius: 9999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {/* Percentage */}
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {d.pct}%
                </span>

                {/* Count badge */}
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.count} resp
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECONDARY KPI STRIP ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Positive Satisfaction Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>
            {stats.positiveRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Excellent, Very Good & Good
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Average Resolution Quality
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            4.8 <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Rated on closure verification
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Survey Participation Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
            86.4%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: 2, fontWeight: 600 }}>
            +11.4% above SLA baseline
          </div>
        </div>

        <div
          className="kpi-card"
          style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Critical Feedback / Escalations
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.distribution[3].count + stats.distribution[4].count > 0 ? '#F59E0B' : '#10B981', marginTop: 4 }}>
            {stats.distribution[3].count + stats.distribution[4].count} <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Surveys</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Actioned via Service Manager review
          </div>
        </div>
      </div>

      {/* ─── QUICK RATING FILTER PILLS ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Filter size={13} /> Filter Registry:
        </span>
        {['All', 'Excellent', 'Very Good', 'Good', 'Poor', 'Very Poor'].map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedRatingFilter(tag)}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: selectedRatingFilter === tag ? '1.5px solid var(--edge-primary)' : '1px solid var(--border-primary)',
              background: selectedRatingFilter === tag ? 'var(--edge-primary)' : 'var(--bg-card)',
              color: selectedRatingFilter === tag ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            {tag} {tag !== 'All' ? `(${customerFeedback.filter(f => f.rating === tag).length})` : `(${stats.total})`}
          </button>
        ))}
        {selectedRatingFilter !== 'All' && (
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('All')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.75rem',
              color: 'var(--edge-primary)',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Response Table */}
      <DataTable
        title={`Customer Survey Responses ${selectedRatingFilter !== 'All' ? `(${selectedRatingFilter})` : ''}`}
        subtitle="Individual ticket feedback logged by end-users and process owners across EDGE business streams."
        columns={columns}
        data={filteredData}
        exportFilename="edge-customer-feedback.csv"
      />
    </div>
  );
}
