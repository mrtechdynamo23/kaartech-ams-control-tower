/**
 * EDGE AMS Control Tower — Document-Oriented Knowledge Base Repository
 * Route: /service-operation/knowledge
 *
 * Implements full document repository per Head Feedback requirement:
 * - Predefined knowledge documents across FAQ, User Manual, Operational Guide, Troubleshooting, SOP, Reference
 * - Filterable by Business Stream (L2C, E2M, P2P, D2S, S2P, A2D, R2R, H2R)
 * - Filterable by Document Type, Application, Status, and Search
 * - Structured table/list view with rich metadata
 * - Centered detail inspection modal with procedure steps, summaries, and linked tickets
 * - High-contrast Light Mode primary elevation with strategic 2px borders
 */
import React, { useState, useMemo } from 'react';
import {
  BookOpen, Search, Filter, HelpCircle, FileText, CheckCircle2,
  Layers, ExternalLink, ShieldCheck, Wrench, FileCode, RotateCcw,
  Sparkles, Plus
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import KnowledgeDocumentModal from '../../components/operation/KnowledgeDocumentModal';
import {
  knowledgeDocuments,
  KNOWLEDGE_DOCUMENT_TYPES,
  KNOWLEDGE_BUSINESS_STREAMS
} from '../../data/knowledgeDocumentsData';

export default function KnowledgeBasePage() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [appFilter, setAppFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Derive unique application list for dropdown
  const applications = useMemo(() => {
    const set = new Set(knowledgeDocuments.map(d => d.application));
    return ['All', ...Array.from(set)];
  }, []);

  // Quick-access counts
  const quickCounts = useMemo(() => {
    return {
      total: knowledgeDocuments.length,
      faqs: knowledgeDocuments.filter(d => d.docType === 'FAQ').length,
      manuals: knowledgeDocuments.filter(d => d.docType === 'User Manual').length,
      guides: knowledgeDocuments.filter(d => d.docType === 'Operational Guide').length,
      troubleshooting: knowledgeDocuments.filter(d => d.docType === 'Troubleshooting').length,
      sops: knowledgeDocuments.filter(d => d.docType === 'SOP / Procedure').length,
    };
  }, []);

  // Filter evaluation
  const filteredDocuments = useMemo(() => {
    return knowledgeDocuments.filter(doc => {
      // Business Stream filter
      if (streamFilter !== 'All' && doc.businessStream !== streamFilter) return false;

      // Document Type filter
      if (typeFilter !== 'All' && doc.docType !== typeFilter) return false;

      // Application filter
      if (appFilter !== 'All' && doc.application !== appFilter) return false;

      // Status filter
      if (statusFilter !== 'All' && doc.status !== statusFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchSummary = doc.summary.toLowerCase().includes(q);
        const matchContent = doc.content.toLowerCase().includes(q);
        const matchApp = doc.application.toLowerCase().includes(q);
        const matchOwner = doc.owner.toLowerCase().includes(q);
        const matchPg = doc.processGroup.toLowerCase().includes(q);
        const matchId = doc.id.toLowerCase().includes(q);
        const matchTags = doc.tags ? doc.tags.some(t => t.toLowerCase().includes(q)) : false;

        if (!matchTitle && !matchSummary && !matchContent && !matchApp && !matchOwner && !matchPg && !matchId && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [search, streamFilter, typeFilter, appFilter, statusFilter]);

  const resetFilters = () => {
    setSearch('');
    setStreamFilter('All');
    setTypeFilter('All');
    setAppFilter('All');
    setStatusFilter('All');
  };

  const isFilterActive = search.trim() || streamFilter !== 'All' || typeFilter !== 'All' || appFilter !== 'All' || statusFilter !== 'All';

  // Table Column Definitions
  const columns = [
    {
      key: 'title',
      label: 'Document Title & Summary',
      wrap: true,
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.84rem' }}>
            {v}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.35, maxWidth: '440px' }}>
            {row.summary}
          </div>
        </div>
      ),
    },
    {
      key: 'docType',
      label: 'Document Type',
      width: '140px',
      render: (v) => {
        let cls = 'badge-neutral';
        if (v === 'FAQ') cls = 'badge-info';
        else if (v === 'User Manual') cls = 'badge-primary';
        else if (v === 'Operational Guide') cls = 'badge-success';
        else if (v === 'Troubleshooting') cls = 'badge-warning';
        else if (v === 'SOP / Procedure') cls = 'badge-error';
        return <span className={`badge ${cls}`} style={{ fontWeight: 700 }}>{v}</span>;
      },
    },
    {
      key: 'businessStream',
      label: 'Business Stream',
      width: '130px',
      render: (v) => (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(255, 86, 34, 0.12)',
            color: 'var(--edge-primary)',
            border: '1px solid rgba(255, 86, 34, 0.28)',
          }}
        >
          {v}
        </span>
      ),
    },
    {
      key: 'application',
      label: 'Application',
      width: '160px',
      render: (v) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v}</span>,
    },
    {
      key: 'processGroup',
      label: 'Process Group',
      width: '160px',
      render: (v) => <span style={{ color: 'var(--text-secondary)' }}>{v}</span>,
    },
    {
      key: 'owner',
      label: 'Owner / Lead',
      width: '150px',
      render: (v) => <span style={{ color: 'var(--text-secondary)' }}>{v}</span>,
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      type: 'date',
      width: '120px',
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (v) => <span className="badge badge-success" style={{ fontWeight: 700 }}>{v}</span>,
    },
  ];

  return (
    <div className="knowledge-base-page animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* ─── Page Header ─── */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Knowledge Base & SOP Repository</h1>
            <span className="badge badge-primary">{knowledgeDocuments.length} Verified Documents</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Document-oriented knowledge library, standardized operating procedures, troubleshooting playbooks, and user manuals.
          </p>
        </div>
      </div>

      {/* ─── Compact Quick-Access Summary Strip ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div
          className="kpi-card"
          onClick={() => setTypeFilter('All')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'All' ? '2px solid var(--edge-primary)' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Total Documents
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            {quickCounts.total}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Across 8 Business Streams
          </div>
        </div>

        <div
          className="kpi-card"
          onClick={() => setTypeFilter(typeFilter === 'FAQ' ? 'All' : 'FAQ')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'FAQ' ? '2px solid #3B82F6' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            FAQs
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6', marginTop: 2 }}>
            {quickCounts.faqs}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Self-help & access Q&As
          </div>
        </div>

        <div
          className="kpi-card"
          onClick={() => setTypeFilter(typeFilter === 'User Manual' ? 'All' : 'User Manual')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'User Manual' ? '2px solid var(--edge-primary)' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            User Manuals
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--edge-primary)', marginTop: 2 }}>
            {quickCounts.manuals}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Application & portal guides
          </div>
        </div>

        <div
          className="kpi-card"
          onClick={() => setTypeFilter(typeFilter === 'Operational Guide' ? 'All' : 'Operational Guide')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'Operational Guide' ? '2px solid #10B981' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Operational Guides
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: 2 }}>
            {quickCounts.guides}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Resolution & escalation SOPs
          </div>
        </div>

        <div
          className="kpi-card"
          onClick={() => setTypeFilter(typeFilter === 'Troubleshooting' ? 'All' : 'Troubleshooting')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'Troubleshooting' ? '2px solid #F59E0B' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Troubleshooting
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', marginTop: 2 }}>
            {quickCounts.troubleshooting}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Error diagnosis playbooks
          </div>
        </div>

        <div
          className="kpi-card"
          onClick={() => setTypeFilter(typeFilter === 'SOP / Procedure' ? 'All' : 'SOP / Procedure')}
          style={{
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: typeFilter === 'SOP / Procedure' ? '2px solid #EF4444' : '1.5px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Mission SOPs
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EF4444', marginTop: 2 }}>
            {quickCounts.sops}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Critical restoration SOPs
          </div>
        </div>
      </div>

      {/* ─── KNOWLEDGE BASE SEARCH & FILTER BAR (Section 5 requirement) ─── */}
      <div
        className="border-thick-strategic"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--card-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} style={{ color: 'var(--edge-primary)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Knowledge Filtering Engine
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              Showing <strong>{filteredDocuments.length}</strong> of {knowledgeDocuments.length} documents
            </span>
            {isFilterActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-ghost btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--edge-primary)', fontSize: '0.75rem' }}
              >
                <RotateCcw size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', gridColumn: 'span 2', minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Knowledge (Title, SOP, Application, Tags, Keywords)..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
              }}
            />
          </div>

          {/* Primary Business Stream Filter (Mandatory requirement) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 3, textTransform: 'uppercase' }}>
              Business Stream
            </label>
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600 }}
            >
              <option value="All">All Business Streams</option>
              {KNOWLEDGE_BUSINESS_STREAMS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Document Type Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 3, textTransform: 'uppercase' }}>
              Document Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
            >
              <option value="All">All Document Types</option>
              {KNOWLEDGE_DOCUMENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Application Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 3, textTransform: 'uppercase' }}>
              Application Estate
            </label>
            <select
              value={appFilter}
              onChange={(e) => setAppFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
            >
              {applications.map(a => (
                <option key={a} value={a}>{a === 'All' ? 'All Applications' : a}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 3, textTransform: 'uppercase' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── OPERATIONAL TABLE / LIST VIEW (Section 7 requirement) ─── */}
      <DataTable
        title="Knowledge Documents Repository"
        subtitle="Click any knowledge document or procedure to open full step-by-step guidance and linked ticket lineage."
        columns={columns}
        data={filteredDocuments}
        onRowClick={(item) => setSelectedDoc(item)}
        exportFilename="edge-knowledge-documents.csv"
      />

      {/* ─── CENTERED DETAIL MODAL ─── */}
      <KnowledgeDocumentModal
        isOpen={Boolean(selectedDoc)}
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}
