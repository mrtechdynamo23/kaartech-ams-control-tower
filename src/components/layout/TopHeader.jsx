/**
 * EDGE AMS Control Tower — Top Header
 * Global utilities: Actionable Search (Section 53), Calendar (Section 54),
 * Actionable Notifications (Section 55), Language RTL (Section 52), Theme Toggle (Section 51), Profile (Section 10).
 */
import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Search, Calendar, Bell, Sun, Moon, Languages, LogOut, Menu, X,
  ChevronRight, MessageSquare, Bot, AlertTriangle, CheckCircle2,
  FileText, Users, Monitor, ArrowRight, Clock
} from 'lucide-react';
import { notifications, incidents, serviceRequests, enhancements, problems, RESOURCES, momRecords, audits } from '../../data/demoData';
import { APPLICATIONS } from '../../data/masterData';

export default function TopHeader({ collapsed, onToggleSidebar, onOpenAssistant }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, idx) => ({
    label: part.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    path: '/' + pathParts.slice(0, idx + 1).join('/'),
  }));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Instant multi-entity search results (Section 53)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    // Incidents
    incidents.forEach((inc) => {
      if (
        inc.id.toLowerCase().includes(q) ||
        inc.shortDescription?.toLowerCase().includes(q) ||
        inc.application?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Incident',
          id: inc.id,
          title: inc.shortDescription,
          subtitle: `${inc.priority} • ${inc.application} • ${inc.status}`,
          path: '/command-center/incidents',
          badgeColor: inc.priority === 'P1' ? 'badge-error' : 'badge-neutral',
        });
      }
    });

    // Service Requests
    serviceRequests.forEach((sr) => {
      if (
        sr.id.toLowerCase().includes(q) ||
        sr.shortDescription?.toLowerCase().includes(q) ||
        sr.application?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Service Request',
          id: sr.id,
          title: sr.shortDescription,
          subtitle: `${sr.srType || 'Standard'} • ${sr.application} • ${sr.status}`,
          path: '/command-center/service-requests',
          badgeColor: 'badge-info',
        });
      }
    });

    // Enhancements
    enhancements.forEach((enh) => {
      if (
        enh.id.toLowerCase().includes(q) ||
        enh.shortDescription?.toLowerCase().includes(q) ||
        enh.title?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Enhancement',
          id: enh.id,
          title: enh.shortDescription || enh.title,
          subtitle: `${enh.category || 'Minor'} • ${enh.application} • ${enh.status}`,
          path: '/command-center/enhancements',
          badgeColor: 'badge-primary',
        });
      }
    });

    // Problems
    problems.forEach((prb) => {
      if (
        prb.id.toLowerCase().includes(q) ||
        prb.shortDescription?.toLowerCase().includes(q) ||
        prb.application?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Problem Defect',
          id: prb.id,
          title: prb.shortDescription,
          subtitle: `${prb.application} • RCA: ${prb.rcaStatus || 'Pending'}`,
          path: '/command-center/problems',
          badgeColor: 'badge-warning',
        });
      }
    });

    // Resources
    RESOURCES.forEach((res) => {
      if (
        res.name.toLowerCase().includes(q) ||
        res.skill?.toLowerCase().includes(q) ||
        res.businessDomain?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Consultant',
          id: res.id,
          title: res.name,
          subtitle: `${res.role || 'Consultant'} • ${res.track} • ${res.skill}`,
          path: '/resources/directory',
          badgeColor: 'badge-neutral',
        });
      }
    });

    // Applications
    APPLICATIONS.forEach((app) => {
      if (
        app.name.toLowerCase().includes(q) ||
        app.domain?.toLowerCase().includes(q) ||
        app.technology?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Application',
          id: app.id,
          title: app.name,
          subtitle: `${app.domain} • ${app.tier} • ${app.criticality}`,
          path: '/technology/applications',
          badgeColor: 'badge-success',
        });
      }
    });

    // Minutes of Meeting (MOM) — Section 48 requirement
    if (Array.isArray(momRecords)) {
      momRecords.forEach((mom) => {
        if (
          mom.id.toLowerCase().includes(q) ||
          mom.meetingTitle?.toLowerCase().includes(q) ||
          mom.owner?.toLowerCase().includes(q) ||
          mom.customerOrEntity?.toLowerCase().includes(q) ||
          mom.actionItems?.some(a => a.actionId.toLowerCase().includes(q) || a.actionDescription.toLowerCase().includes(q))
        ) {
          results.push({
            type: 'MOM',
            id: mom.id,
            title: mom.meetingTitle,
            subtitle: `${mom.customerOrEntity} • ${mom.momStatus} • ${mom.openActionCount || 0} Open Actions`,
            path: '/calendar',
            badgeColor: 'badge-primary',
          });
        }
      });
    }

    // Audits & Compliance — Section 48 requirement
    if (Array.isArray(audits)) {
      audits.forEach((aud) => {
        if (
          aud.id.toLowerCase().includes(q) ||
          aud.title?.toLowerCase().includes(q) ||
          aud.leadAuditor?.toLowerCase().includes(q) ||
          aud.entity?.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'Audit',
            id: aud.id,
            title: aud.title,
            subtitle: `${aud.entity || 'EDGE Group'} • ${aud.status} • ${aud.priority || 'High'}`,
            path: '/governance/audits',
            badgeColor: 'badge-warning',
          });
        }
      });
    }

    return results.slice(0, 12);
  }, [searchQuery]);

  const handleSelectResult = (path) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <button className="header-action-btn header-menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
            <Menu size={18} />
          </button>

          {/* EDGE Brand Mark & Portal Title */}
          <div
            onClick={() => navigate('/executive-board')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 8px',
              background: 'var(--bg-card, #ffffff)',
              borderRadius: '6px',
              border: '1px solid var(--border-secondary)',
              cursor: 'pointer',
              marginRight: '8px',
              flexShrink: 0,
            }}
            title="EDGE AMS Control Tower"
          >
            <img
              src="/assets/edge-logo.png"
              alt="EDGE Logo"
              style={{ height: '18px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
              AMS CONTROL TOWER
            </span>
          </div>

          <nav className="header-breadcrumb" aria-label="Breadcrumb">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.path}>
                {idx > 0 && <ChevronRight size={12} className="header-breadcrumb-separator" />}
                <span
                  className={idx === breadcrumbs.length - 1 ? 'header-breadcrumb-current' : 'header-breadcrumb-item'}
                  onClick={() => navigate(bc.path)}
                  style={{ cursor: 'pointer' }}
                >
                  {bc.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          {/* AI Assistant */}
          {onOpenAssistant && (
            <button
              className="header-action-btn"
              onClick={onOpenAssistant}
              aria-label="EDGE AI Assistant"
              title="EDGE AI Assistant"
              style={{ color: 'var(--edge-primary)' }}
            >
              <Bot size={18} />
            </button>
          )}

          {/* Search */}
          <button
            className="header-action-btn"
            onClick={() => setShowSearch(true)}
            aria-label={t('common.search')}
            title="Global Search (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          {/* Calendar */}
          <button
            className={`header-action-btn ${location.pathname === '/calendar' ? 'active' : ''}`}
            onClick={() => navigate('/calendar')}
            aria-label="Global Calendar"
            title="Global Control Tower Calendar"
          >
            <Calendar size={18} />
          </button>

          {/* Notifications */}
          <button
            className={`header-action-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={t('notifications.title')}
            title={t('notifications.title')}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="header-badge" />}
          </button>

          <div className="header-divider" />

          {/* Language Toggle */}
          <button className="header-language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            <Languages size={14} />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button className="header-action-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="header-divider" />

          {/* Profile */}
          <div className="header-profile" onClick={handleLogout} title="Sign Out">
            <div className="header-profile-avatar">{user?.avatar || 'U'}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="header-profile-name">{user?.name || 'User'}</span>
              <span className="header-profile-role">{user?.role || 'Role'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Notification Drawer (Section 55) ── */}
      {showNotifications && (
        <>
          <div className="drawer-overlay" onClick={() => setShowNotifications(false)} />
          <div className="drawer" role="dialog" aria-label="Notifications">
            <div className="drawer-header">
              <h2 className="drawer-title">{t('notifications.title')}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNotifications(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="drawer-body">
              {notifications.length === 0 ? (
                <div className="state-container">
                  <Bell size={40} style={{ color: 'var(--text-tertiary)' }} />
                  <p className="state-description">{t('notifications.noNotifications')}</p>
                </div>
              ) : (
                notifications.slice(0, 15).map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.read ? 'read' : ''}`}
                    onClick={() => {
                      navigate(n.link);
                      setShowNotifications(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`notification-dot ${n.type}`} />
                    <div className="notification-content">
                      <span className="notification-title">{n.title}</span>
                      <span className="notification-message">{n.message}</span>
                      <span className="notification-time">{new Date(n.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Actionable Search Modal (Section 53) ── */}
      {showSearch && (
        <div
          className="modal-overlay"
          onClick={() => setShowSearch(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 17, 20, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '80px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          <div
            className="modal"
            style={{
              width: '100%',
              maxWidth: '640px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Search size={20} color="var(--edge-primary)" />
              <input
                type="text"
                className="form-input"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--text-base)',
                  padding: '4px 0',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                }}
                placeholder="Search by ID (INC-00001, PRB, SR), application, or specialist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Results Box */}
            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px 16px' }}>
              {searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectResult(res.path)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--edge-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-secondary)')}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--edge-primary)' }}>
                            {res.id}
                          </span>
                          <span className={`badge ${res.badgeColor}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {res.type}
                          </span>
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {res.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{res.subtitle}</div>
                      </div>
                      <ArrowRight size={14} color="var(--text-tertiary)" />
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                  No matching operational records found for "{searchQuery}"
                </div>
              ) : (
                <div style={{ padding: '8px 4px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  Quick lookups: <code style={{ color: 'var(--edge-primary)' }}>INC-00001</code>, <code style={{ color: 'var(--edge-primary)' }}>PRB-00001</code>, <code style={{ color: 'var(--edge-primary)' }}>SR</code>, <code style={{ color: 'var(--edge-primary)' }}>S/4HANA</code>, <code style={{ color: 'var(--edge-primary)' }}>Khalid</code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
