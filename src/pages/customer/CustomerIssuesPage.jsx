/**
 * EDGE AMS Control Tower — Escalated Issues & VIP Watchlist
 * Route: /customer/issues
 * Sections 11–15: Functional "View Action Plan" modal, traceability, and resolution tracking.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldAlert, CheckCircle2, Clock, Plus, Layers, ArrowRight } from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import ActionPlanModal from '../../components/customer/ActionPlanModal';

export default function CustomerIssuesPage() {
  const navigate = useNavigate();
  const [selectedEscalationForPlan, setSelectedEscalationForPlan] = useState(null);
  const [isActionPlanOpen, setIsActionPlanOpen] = useState(false);

  const [issues, setIssues] = useState([
    {
      id: 'ESC-001',
      entity: 'NIMR',
      title: 'Defense procurement workflow delay on GTS export validation',
      severity: 'High',
      status: 'In Triage',
      owner: 'Ravi Shankar',
      daysOpen: 2,
      relatedTicket: 'INC-1048',
      relatedFinding: 'FND-0024',
      relatedTask: 'TSK-0041',
      relatedCTA: 'CTA-0011',
      actionPlan: [
        {
          id: 'ACT-ESC-01',
          action: 'Convene urgent technical bridge with GTS interface team and validate Customs API timeouts',
          owner: 'Ravi Shankar',
          targetDate: '2026-09-08',
          status: 'In Progress',
          relatedTicket: 'INC-1048',
          relatedTask: 'TSK-0041',
        },
        {
          id: 'ACT-ESC-02',
          action: 'Deploy hotfix patch for customs declaration payload timeout in SAP S/4HANA',
          owner: 'Deepak Kumar',
          targetDate: '2026-09-10',
          status: 'In Progress',
          relatedTicket: 'INC-1048',
          relatedTask: 'TSK-0042',
        },
      ],
    },
    {
      id: 'ESC-002',
      entity: 'EDGE HQ',
      title: 'Executive Boardroom SAC connectivity latency during board session',
      severity: 'Critical',
      status: 'Resolved',
      owner: 'Deepak Kumar',
      daysOpen: 0,
      relatedTicket: 'INC-1015',
      relatedFinding: 'FND-0012',
      relatedTask: 'TSK-0051',
      relatedCTA: 'CTA-0015',
      actionPlan: [
        {
          id: 'ACT-ESC-03',
          action: 'Reroute dedicated fiber path from Al Ain datacenter to Executive Boardroom SAC hub',
          owner: 'Deepak Kumar',
          targetDate: '2026-09-02',
          status: 'Completed',
          relatedTicket: 'INC-1015',
        },
        {
          id: 'ACT-ESC-04',
          action: 'Execute end-to-end stress test during off-peak rehearsal',
          owner: 'Analytics Lead',
          targetDate: '2026-09-03',
          status: 'Completed',
          relatedTicket: 'INC-1015',
        },
      ],
    },
    {
      id: 'ESC-003',
      entity: 'CARACAL',
      title: 'Small arms serialization barcode scan failures on export batch',
      severity: 'High',
      status: 'In Triage',
      owner: 'Tariq Al Dhaheri',
      daysOpen: 4,
      relatedTicket: 'INC-1052',
      relatedFinding: 'FND-0004',
      relatedTask: 'TSK-0048',
      relatedCTA: 'CTA-0005',
      actionPlan: [
        {
          id: 'ACT-ESC-05',
          action: 'Deploy handheld barcode scanners with updated firmware to Bay 3',
          owner: 'Sarah Nasser',
          targetDate: '2026-09-12',
          status: 'In Progress',
          relatedTicket: 'INC-1052',
          relatedTask: 'TSK-0048',
        },
        {
          id: 'ACT-ESC-06',
          action: 'Re-index serial number table in SAP S/4HANA Manufacturing module',
          owner: 'Tariq Al Dhaheri',
          targetDate: '2026-09-14',
          status: 'Not Started',
          relatedTicket: 'INC-1052',
        },
      ],
    },
    {
      id: 'ESC-004',
      entity: 'ADASI',
      title: 'UAV flight telemetry log sync latency inquiry from Defense SteerCom',
      severity: 'Medium',
      status: 'In Triage',
      owner: 'Noura Al Shamsi',
      daysOpen: 1,
      relatedTicket: 'SR-0089',
      relatedFinding: 'FND-0015',
      relatedCTA: 'CTA-0014',
      // Demonstrates Section 15: No action plan defined
      actionPlan: [],
    },
  ]);

  const handleOpenActionPlan = (iss) => {
    setSelectedEscalationForPlan(iss);
    setIsActionPlanOpen(true);
  };

  const handleNavigateToRecord = (recordType, recordId) => {
    setIsActionPlanOpen(false);
    if (recordType === 'finding') {
      navigate('/governance/audits?tab=findings');
    } else if (recordType === 'task') {
      navigate('/governance/audits?tab=tasks');
    } else if (recordType === 'ticket') {
      navigate('/command-center/incidents');
    } else if (recordType === 'cta') {
      navigate('/governance/actions');
    }
  };

  const openEscalations = issues.filter((i) => i.status !== 'Resolved');
  const criticalCount = issues.filter((i) => i.severity === 'Critical' && i.status !== 'Resolved').length;

  return (
    <div className="customer-issues-page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="page-title">Escalated Issues & VIP Watchlist</h1>
            <span className="badge badge-warning">{openEscalations.length} Open Escalations</span>
            {criticalCount > 0 && <span className="badge badge-error">{criticalCount} Critical VIP</span>}
          </div>
          <p className="page-subtitle">
            Track priority stakeholder escalations, executive inquiries, and expedited remediation action plans across EDGE entities.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '12px',
        }}
      >
        <KPICard
          title="Total Escalations"
          value={issues.length}
          subtitle="Monitored in 2026"
          icon={ShieldAlert}
        />
        <KPICard
          title="Active in Triage"
          value={openEscalations.length}
          status={openEscalations.length > 0 ? 'warning' : 'success'}
          subtitle="Requires governance action plan"
          icon={Clock}
        />
        <KPICard
          title="Critical Impact"
          value={criticalCount}
          status={criticalCount > 0 ? 'danger' : 'success'}
          subtitle="SteerCom priority"
          icon={AlertCircle}
        />
        <KPICard
          title="Resolved"
          value={issues.filter((i) => i.status === 'Resolved').length}
          status="success"
          subtitle="Action plans finalized"
          icon={CheckCircle2}
        />
      </div>

      {/* Issues List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {issues.map((iss) => (
          <div key={iss.id} className="chart-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary, #FF5622)' }}>
                    {iss.id}
                  </span>
                  <span className="badge badge-neutral">{iss.entity}</span>
                  <span className={`badge ${iss.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>
                    {iss.severity}
                  </span>
                  <span className={`badge ${iss.status === 'Resolved' ? 'badge-success' : 'badge-primary'}`}>
                    {iss.status}
                  </span>
                  {iss.actionPlan && iss.actionPlan.length > 0 && (
                    <span className="badge badge-info" style={{ fontSize: '10px' }}>
                      {iss.actionPlan.length} Action Items
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '4px 0 4px' }}>
                  {iss.title}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>Escalation Owner: <strong style={{ color: 'var(--text-primary)' }}>{iss.owner}</strong></span>
                  <span>Open: <strong>{iss.daysOpen} days</strong></span>
                  {iss.relatedTicket && <span>Ticket: <strong style={{ color: 'var(--text-secondary)' }}>{iss.relatedTicket}</strong></span>}
                  {iss.relatedFinding && <span>Finding: <strong style={{ color: 'var(--edge-primary, #FF5622)' }}>{iss.relatedFinding}</strong></span>}
                </div>
              </div>

              {/* Functional View Action Plan button */}
              <button
                type="button"
                onClick={() => handleOpenActionPlan(iss)}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: 'var(--text-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
              >
                <span>View Action Plan</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Centered Action Plan Modal (Section 11–15) */}
      <ActionPlanModal
        isOpen={isActionPlanOpen}
        onClose={() => setIsActionPlanOpen(false)}
        escalation={selectedEscalationForPlan}
        onNavigateToRecord={handleNavigateToRecord}
      />
    </div>
  );
}
