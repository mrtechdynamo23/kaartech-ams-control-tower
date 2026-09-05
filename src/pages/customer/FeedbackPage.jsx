/**
 * EDGE AMS Control Tower — Feedback & Surveys
 * Route: /customer/feedback
 */
import React from 'react';
import { MessageSquare, Star, Smile, ThumbsUp, Plus } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import DataTable from '../../components/common/DataTable';
import { customerFeedback } from '../../data/demoData';

export default function FeedbackPage() {
  const columns = [
    { key: 'id', label: 'Survey Ref', width: '120px' },
    { key: 'ticketId', label: 'Ticket Ref', width: '120px', render: (v) => <span style={{ color: 'var(--edge-primary)', fontWeight: 600 }}>{v}</span> },
    { key: 'entity', label: 'Entity', width: '150px' },
    {
      key: 'rating',
      label: 'Rating',
      width: '130px',
      render: (val) => {
        let cls = 'badge-success';
        if (val === 'Poor') cls = 'badge-error';
        else if (val === 'Satisfactory') cls = 'badge-warning';
        return <span className={`badge ${cls}`}>{val}</span>;
      }
    },
    { key: 'comment', label: 'Verbatim Customer Feedback', wrap: true },
    { key: 'respondent', label: 'Stakeholder', width: '160px' },
    { key: 'date', label: 'Date', type: 'date', width: '120px' },
  ];

  return (
    <div className="feedback-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Feedback & Satisfaction Surveys</h1>
            <span className="badge badge-primary">{customerFeedback.length} Verified Surveys</span>
          </div>
          <p className="page-subtitle">Post-resolution customer feedback, verbatim remarks, and satisfaction ratings across business units.</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        title="Recent Customer Survey Responses"
        subtitle="Individual ticket feedback logged by end-users and process owners."
        columns={columns}
        data={customerFeedback}
        exportFilename="edge-customer-feedback.csv"
      />
    </div>
  );
}
