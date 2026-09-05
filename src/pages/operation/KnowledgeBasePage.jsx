/**
 * EDGE AMS Control Tower — Knowledge Management & SOPs
 * Route: /service-operation/knowledge
 */
import React, { useState } from 'react';
import { BookOpen, Plus, Search, Eye, FileText, CheckCircle2 } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import DetailModal from '../../components/common/DetailModal';
import { knowledgeArticles } from '../../data/demoData';

export default function KnowledgeBasePage() {
  const [selectedKBA, setSelectedKBA] = useState(null);

  const published = knowledgeArticles.filter(k => k.status === 'Published').length;
  const reviewDue = knowledgeArticles.filter(k => k.reviewStatus === 'Review Due').length;

  const columns = [
    { key: 'id', label: 'KBA ID', width: '110px' },
    { key: 'title', label: 'Article Title / SOP Procedure', wrap: true },
    {
      key: 'category',
      label: 'Category',
      width: '140px',
      render: (val) => (
        <span className="badge badge-neutral" style={{ fontWeight: 600 }}>{val}</span>
      )
    },
    { key: 'businessDomain', label: 'Domain', width: '90px' },
    { key: 'owner', label: 'Author / Lead', width: '150px' },
    {
      key: 'viewCount',
      label: 'Views',
      width: '90px',
      render: (v) => <span style={{ fontWeight: 600 }}>{v || 42}</span>
    },
    {
      key: 'reviewStatus',
      label: 'Review Cycle',
      width: '130px',
      render: (val) => (
        <span className={`badge ${val === 'Review Due' ? 'badge-warning' : 'badge-success'}`}>
          {val || 'Current'}
        </span>
      )
    },
    { key: 'status', label: 'Status', type: 'status', width: '110px' },
  ];

  return (
    <div className="knowledge-base-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Knowledge Base & SOP Repository</h1>
            <span className="badge badge-primary">{knowledgeArticles.length} Documented SOPs</span>
          </div>
          <p className="page-subtitle">Standard operating procedures, resolution playbooks, and self-help articles for continuous learning.</p>
        </div>

        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Publish Knowledge Article</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <KPICard
          title="Total Articles & SOPs"
          value={knowledgeArticles.length}
          subtitle="Curated runbooks"
          icon={BookOpen}
          sparklineData={[18, 20, 22, knowledgeArticles.length]}
        />
        <KPICard
          title="Published & Active"
          value={published}
          status="success"
          subtitle="Directly accessible to resolvers"
          icon={CheckCircle2}
        />
        <KPICard
          title="Reviews Due"
          value={reviewDue}
          status={reviewDue > 0 ? 'warning' : 'success'}
          subtitle="Scheduled annual revision"
        />
        <KPICard
          title="Shift-Left Deflection"
          value="24.8%"
          status="success"
          subtitle="Self-resolved via KB articles"
        />
      </div>

      {/* Table */}
      <DataTable
        title="Knowledge Base Catalog"
        subtitle="Click any article to inspect procedural steps, attached screenshots, and linked incident history."
        columns={columns}
        data={knowledgeArticles}
        onRowClick={(item) => setSelectedKBA(item)}
        exportFilename="edge-knowledge-base.csv"
      />

      {/* Centered Record Detail Modal */}
      <DetailModal
        isOpen={Boolean(selectedKBA)}
        item={selectedKBA}
        onClose={() => setSelectedKBA(null)}
        type="kba"
      />
    </div>
  );
}
