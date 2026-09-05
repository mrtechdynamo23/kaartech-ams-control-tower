/**
 * EDGE AMS Control Tower — Module Page (Functional placeholder for in-progress modules)
 * NOT a generic placeholder screen — provides real module navigation and context.
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Construction, ChevronRight, ArrowLeft } from 'lucide-react';

const moduleInfo = {
  '/command-center': { title: 'Command Center', desc: 'Consolidated operational overview with incident, service request, enhancement and problem management.' },
  '/command-center/incidents': { title: 'Incident Management', desc: 'Track and manage incidents across all priorities with SLA monitoring.' },
  '/command-center/service-requests': { title: 'Service Request Management', desc: 'Standard and major service request tracking with effort classification.' },
  '/command-center/enhancements': { title: 'Enhancement Management', desc: 'Enhancement requests with governance status tracking.' },
  '/command-center/problems': { title: 'Problem Management', desc: 'Problem records with RCA, corrective and preventive actions.' },
  '/governance/audits': { title: 'Audit Management', desc: 'Audit planner, task board, and findings management.' },
  '/governance/risks': { title: 'Risk Register', desc: 'Risk identification, assessment, and response management.' },
  '/governance/licenses': { title: 'License & Entitlement Health', desc: 'License utilization, expiry tracking, and renewal management.' },
  '/governance/programs': { title: 'Program Governance', desc: 'Program milestones, issues, dependencies, and actions.' },
  '/governance/transition': { title: 'Transition & Readiness', desc: 'Transition planning, knowledge transfer, and go-live readiness.' },
  '/governance/actions': { title: 'CTA / Action Hub', desc: 'Cross-functional action tracking from audits, risks, customers, and programs.' },
  '/resources/directory': { title: 'Resource Directory', desc: 'Canonical resource master with all personnel information.' },
  '/resources/organization': { title: 'Organization Structure', desc: 'Data-driven organizational hierarchy with reporting lines.' },
  '/resources/time': { title: 'Time Management', desc: 'Leave, remote work, approvals, and timesheet management.' },
  '/resources/contact': { title: 'Contact Directory', desc: 'Searchable contact directory with RBAC-based field visibility.' },
  '/resources/skills': { title: 'Skills & Knowledge', desc: 'Resource skills, certifications, and learning needs.' },
  '/resources/coverage': { title: 'Onsite Coverage Compliance', desc: 'Coverage gaps, backup planning, and vacation continuity.' },
  '/technology/applications': { title: 'Application Portfolio', desc: 'Complete application inventory seeded from the RFP application list.' },
  '/technology/application-health': { title: 'Application Health', desc: 'Real-time application health monitoring and incident correlation.' },
  '/technology/landscape': { title: 'Technology Landscape', desc: 'Technology stack, versions, and lifecycle management.' },
  '/technology/dependencies': { title: 'Integration & Dependencies', desc: 'Application interdependencies and integration mapping.' },
  '/technology/licenses': { title: 'Technology Licenses', desc: 'Technology-level license and entitlement tracking.' },
  '/technology/releases': { title: 'Release / Change Health', desc: 'Release management and change impact tracking.' },
  '/customer/corner': { title: 'Customer Corner', desc: 'Customer engagement hub with conversation tracking.' },
  '/customer/feedback': { title: 'Customer Feedback / CSAT', desc: 'CSAT scores, trends, and feedback analysis.' },
  '/customer/actions': { title: 'Customer CTAs', desc: 'Open customer-related actions and escalations.' },
  '/customer/issues': { title: 'Customer Issues', desc: 'Customer issue tracking and resolution.' },
  '/service-operation/overview': { title: 'Service Overview', desc: 'Service health and management overview.' },
  '/service-operation/knowledge': { title: 'Knowledge Management', desc: 'Knowledge articles, categories, and review status.' },
  '/service-operation/problem-improvement': { title: 'RCA / Problem Improvement', desc: 'Root cause analysis and improvement tracking.' },
  '/service-operation/continuity': { title: 'Service Continuity', desc: 'Business continuity planning and DR readiness.' },
  '/service-operation/performance': { title: 'Operational Performance', desc: 'Operational KPIs and performance trends.' },
  '/service-innovation/ticket-reduction': { title: 'Ticket Reduction', desc: 'Volume reduction tracking against baseline.' },
  '/service-innovation/automation': { title: 'Automation', desc: 'Automation initiatives and impact.' },
  '/service-innovation/ai': { title: 'AI Opportunities', desc: 'AI/ML opportunity identification and tracking.' },
  '/service-innovation/user-enablement': { title: 'User Enablement', desc: 'Training and user adoption programs.' },
  '/service-innovation/continuous-improvement': { title: 'Continuous Improvement', desc: 'Service improvement initiatives and tracking.' },
  '/reporting/dfr': { title: 'Daily Flash Report', desc: 'Daily operational snapshot with SLA status.' },
  '/reporting/dsr': { title: 'Daily Snapshot Report', desc: 'Detailed daily service snapshot.' },
  '/reporting/wsr': { title: 'Weekly Status Report', desc: 'Weekly operational roll-up.' },
  '/reporting/msr': { title: 'Monthly Status Report', desc: 'Monthly management report.' },
  '/reporting/sla': { title: 'SLA Report', desc: 'SLA performance analysis and trends.' },
  '/reporting/executive': { title: 'Executive Report', desc: 'Executive summary and strategic overview.' },
};

export default function ModulePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const info = moduleInfo[location.pathname] || { title: 'Module', desc: 'This module is being built.' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{info.title}</h1>
          <p className="page-subtitle">{info.desc}</p>
        </div>
      </div>

      <div className="state-container" style={{ padding: 'var(--space-4xl) var(--space-xl)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-secondary)' }}>
        <div className="state-icon" style={{ background: 'var(--edge-primary-light)', color: 'var(--edge-primary)' }}>
          <Construction size={28} />
        </div>
        <h2 className="state-title">Module Under Construction</h2>
        <p className="state-description">
          This module is being implemented as part of the EDGE AMS Control Tower build.
          The data architecture, relationships, and master data are already in place.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-base)' }}>
          <button className="btn btn-primary" onClick={() => navigate('/executive-board')}>
            <ArrowLeft size={14} />
            Executive Board
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/command-center')}>
            Command Center
            <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <span className="badge badge-grey">PHASE IN PROGRESS</span>
        </div>
      </div>
    </div>
  );
}
