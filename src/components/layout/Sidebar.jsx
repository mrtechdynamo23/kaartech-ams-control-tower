/**
 * EDGE AMS Control Tower — Sidebar Navigation
 * Collapsible, active route, nested navigation, keyboard accessible,
 * tooltips in collapsed state, true RTL mirroring (Section 13).
 */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  BarChart3, Layout, Shield, Users, Monitor, HeadphonesIcon, Activity,
  Lightbulb, FileText, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen,
  AlertTriangle, FileCheck, Key, Milestone, GitBranch, Clock, Phone,
  Award, UserCheck, ListChecks, Cpu, Link2, Package, BarChart, Zap,
  Bot, GraduationCap, TrendingUp, BookOpen, Wrench, Target, Calendar
} from 'lucide-react';

const navItems = [
  {
    key: 'executive-board',
    path: '/executive-board',
    icon: BarChart3,
    labelKey: 'executiveBoard.title',
  },
  {
    key: 'command-center',
    path: '/command-center',
    icon: Layout,
    labelKey: 'commandCenter.title',
    children: [
      { key: 'cc-overview', path: '/command-center', labelKey: 'commandCenter.overview' },
      { key: 'cc-incidents', path: '/command-center/incidents', labelKey: 'commandCenter.incidents' },
      { key: 'cc-service-requests', path: '/command-center/service-requests', labelKey: 'commandCenter.serviceRequests' },
      { key: 'cc-enhancements', path: '/command-center/enhancements', labelKey: 'commandCenter.enhancements' },
      { key: 'cc-problems', path: '/command-center/problems', labelKey: 'commandCenter.problems' },
    ],
  },
  {
    key: 'customer',
    path: '/customer',
    icon: HeadphonesIcon,
    labelKey: 'customerConnect.title',
    children: [
      { key: 'cust-corner', path: '/customer/corner', labelKey: 'customerConnect.corner' },
      { key: 'cust-feedback', path: '/customer/feedback', labelKey: 'customerConnect.feedback' },
      { key: 'cust-actions', path: '/customer/actions', labelKey: 'customerConnect.actions' },
      { key: 'cust-issues', path: '/customer/issues', labelKey: 'customerConnect.issues' },
    ],
  },
  {
    key: 'governance',
    path: '/governance',
    icon: Shield,
    labelKey: 'governance.title',
    children: [
      { key: 'gov-audits', path: '/governance/audits', labelKey: 'governance.audits' },
      { key: 'gov-risks', path: '/governance/risks', labelKey: 'governance.risks' },
      { key: 'gov-licenses', path: '/governance/licenses', labelKey: 'governance.licenses' },
      { key: 'gov-programs', path: '/governance/programs', labelKey: 'governance.programs' },
      { key: 'gov-transition', path: '/governance/transition', labelKey: 'governance.transition' },
      { key: 'gov-actions', path: '/governance/actions', labelKey: 'governance.actions' },
    ],
  },
  {
    key: 'resources',
    path: '/resources',
    icon: Users,
    labelKey: 'resource.title',
    children: [
      { key: 'res-directory', path: '/resources/directory', labelKey: 'resource.directory' },
      { key: 'res-organization', path: '/resources/organization', labelKey: 'resource.organization' },
      { key: 'res-time', path: '/resources/time', labelKey: 'resource.time' },
      { key: 'res-contact', path: '/resources/contact', labelKey: 'resource.contact' },
      { key: 'res-skills', path: '/resources/skills', labelKey: 'resource.skills' },
    ],
  },
  {
    key: 'technology',
    path: '/technology',
    icon: Monitor,
    labelKey: 'technology.title',
    children: [
      { key: 'tech-apps', path: '/technology/applications', labelKey: 'technology.applications' },
      { key: 'tech-health', path: '/technology/application-health', labelKey: 'technology.applicationHealth' },
      { key: 'tech-landscape', path: '/technology/landscape', labelKey: 'technology.landscape' },
      { key: 'tech-deps', path: '/technology/dependencies', labelKey: 'technology.dependencies' },
      { key: 'tech-licenses', path: '/technology/licenses', labelKey: 'technology.licenses' },
      { key: 'tech-releases', path: '/technology/releases', labelKey: 'technology.releases' },
    ],
  },
  {
    key: 'service-operation',
    path: '/service-operation',
    icon: Activity,
    labelKey: 'serviceOperation.title',
    children: [
      { key: 'so-overview', path: '/service-operation/overview', labelKey: 'serviceOperation.overview' },
      { key: 'so-knowledge', path: '/service-operation/knowledge', labelKey: 'serviceOperation.knowledge' },
      { key: 'so-rca', path: '/service-operation/problem-improvement', labelKey: 'serviceOperation.problemImprovement' },
      { key: 'so-continuity', path: '/service-operation/continuity', labelKey: 'serviceOperation.continuity' },
      { key: 'so-performance', path: '/service-operation/performance', labelKey: 'serviceOperation.performance' },
    ],
  },
  {
    key: 'service-innovation',
    path: '/service-innovation',
    icon: Lightbulb,
    labelKey: 'serviceInnovation.title',
    children: [
      { key: 'si-tickets', path: '/service-innovation/ticket-reduction', labelKey: 'serviceInnovation.ticketReduction' },
      { key: 'si-automation', path: '/service-innovation/automation', labelKey: 'serviceInnovation.automation' },
      { key: 'si-ai', path: '/service-innovation/ai', labelKey: 'serviceInnovation.ai' },
      { key: 'si-enablement', path: '/service-innovation/user-enablement', labelKey: 'serviceInnovation.userEnablement' },
      { key: 'si-improvement', path: '/service-innovation/continuous-improvement', labelKey: 'serviceInnovation.continuousImprovement' },
    ],
  },
  {
    key: 'reporting',
    path: '/reporting',
    icon: FileText,
    labelKey: 'reporting.title',
    children: [
      { key: 'rpt-dfr', path: '/reporting/dfr', labelKey: 'reporting.dfr' },
      { key: 'rpt-dsr', path: '/reporting/dsr', labelKey: 'reporting.dsr' },
      { key: 'rpt-wsr', path: '/reporting/wsr', labelKey: 'reporting.wsr' },
      { key: 'rpt-msr', path: '/reporting/msr', labelKey: 'reporting.msr' },
      { key: 'rpt-sla', path: '/reporting/sla', labelKey: 'reporting.sla' },
      { key: 'rpt-exec', path: '/reporting/executive', labelKey: 'reporting.executive' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [expandedItems, setExpandedItems] = useState({});

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => {
    if (isActive(item.path)) return true;
    return item.children?.some(child => isActive(child.path));
  };

  const isItemExpanded = (item) => {
    // User collapse explicitly overrides active route
    if (expandedItems[item.key] !== undefined) {
      return expandedItems[item.key];
    }
    return isParentActive(item);
  };

  const toggleExpand = (key, current) => {
    setExpandedItems(prev => ({ ...prev, [key]: !current }));
  };

  const handleItemClick = (item, currentExpanded) => {
    if (item.children) {
      if (collapsed) {
        navigate(item.children[0].path);
      } else {
        toggleExpand(item.key, currentExpanded);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => navigate('/executive-board')} style={{ cursor: 'pointer' }}>
        <div
          className="sidebar-brand-logo"
          style={{
            background: 'var(--bg-card, #ffffff)',
            padding: '3px 6px',
            borderRadius: '6px',
            border: '1px solid var(--border-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/edge-logo.png"
            alt="EDGE Logo"
            style={{
              height: collapsed ? '18px' : '22px',
              maxWidth: collapsed ? '28px' : '65px',
              objectFit: 'contain',
            }}
          />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title" style={{ letterSpacing: '0.04em', fontWeight: 700 }}>AMS CONTROL</span>
            <span className="sidebar-brand-subtitle" style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>TOWER PLATFORM</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isParentActive(item);
          const expanded = isItemExpanded(item);

          return (
            <div className="sidebar-section" key={item.key}>
              <div
                className={`sidebar-item ${active ? 'active' : ''}`}
                onClick={() => handleItemClick(item, expanded)}
                onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item, expanded)}
                tabIndex={0}
                role="button"
                aria-expanded={item.children ? expanded : undefined}
              >
                <div className="sidebar-item-icon"><Icon size={18} /></div>
                <span className="sidebar-item-label">{t(item.labelKey)}</span>
                {item.children && !collapsed && (
                  <ChevronDown size={14} style={{ transform: expanded ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s', opacity: 0.5 }} />
                )}
                {collapsed && <span className="sidebar-tooltip">{t(item.labelKey)}</span>}
              </div>

              {/* Sub-items */}
              {item.children && !collapsed && (
                <div className="sidebar-submenu" style={{ maxHeight: expanded ? `${item.children.length * 36}px` : '0px' }}>
                  {item.children.map(child => (
                    <div
                      key={child.key}
                      className={`sidebar-subitem ${isActive(child.path) ? 'active' : ''}`}
                      onClick={() => navigate(child.path)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(child.path)}
                      tabIndex={0}
                      role="link"
                    >
                      {t(child.labelKey)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Toggle */}
      <div className="sidebar-toggle" onClick={onToggle} role="button" tabIndex={0} aria-label="Toggle sidebar">
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </div>
    </nav>
  );
}
