/**
 * EDGE AMS Control Tower — Application Root & Router
 * 
 * User Journey (NON-NEGOTIABLE):
 * /login → /landing → /executive-board → all portal modules
 * 
 * Route architecture per Section 86 with all dedicated operational modules.
 */
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Bot, Sparkles } from 'lucide-react';

// ── Core Pages ──
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ExecutiveBoardPage from './pages/ExecutiveBoardPage';
import GlobalCalendarPage from './pages/calendar/GlobalCalendarPage';

// ── Command Center Pages ──
import CommandCenterOverview from './pages/command-center/CommandCenterOverview';
import IncidentsPage from './pages/command-center/IncidentsPage';
import ServiceRequestsPage from './pages/command-center/ServiceRequestsPage';
import EnhancementsPage from './pages/command-center/EnhancementsPage';
import ProblemsPage from './pages/command-center/ProblemsPage';

// ── Governance Pages ──
import AuditsPage from './pages/governance/AuditsPage';
import RiskRegisterPage from './pages/governance/RiskRegisterPage';
import LicensesPage from './pages/governance/LicensesPage';
import ProgramsPage from './pages/governance/ProgramsPage';
import TransitionPage from './pages/governance/TransitionPage';
import ActionHubPage from './pages/governance/ActionHubPage';

// ── Resource Pages ──
import ResourceDirectoryPage from './pages/resources/ResourceDirectoryPage';
import OrganizationPage from './pages/resources/OrganizationPage';
import TimeEffortPage from './pages/resources/TimeEffortPage';
import ContactMatrixPage from './pages/resources/ContactMatrixPage';
import SkillsMatrixPage from './pages/resources/SkillsMatrixPage';
import CoveragePage from './pages/resources/CoveragePage';

// ── Technology Pages ──
import ApplicationsPage from './pages/technology/ApplicationsPage';
import AppHealthPage from './pages/technology/AppHealthPage';
import LandscapePage from './pages/technology/LandscapePage';
import DependenciesPage from './pages/technology/DependenciesPage';
import TechLicensesPage from './pages/technology/TechLicensesPage';
import ReleasesPage from './pages/technology/ReleasesPage';

// ── Customer Connect Pages ──
import CustomerCornerPage from './pages/customer/CustomerCornerPage';
import FeedbackPage from './pages/customer/FeedbackPage';
import CustomerActionsPage from './pages/customer/CustomerActionsPage';
import CustomerIssuesPage from './pages/customer/CustomerIssuesPage';

// ── Service Operation Pages ──
import OperationOverviewPage from './pages/operation/OperationOverviewPage';
import KnowledgeBasePage from './pages/operation/KnowledgeBasePage';
import ProblemImprovementPage from './pages/operation/ProblemImprovementPage';
import ContinuityDRPage from './pages/operation/ContinuityDRPage';
import PerformancePage from './pages/operation/PerformancePage';

// ── Service Innovation Pages ──
import TicketReductionPage from './pages/innovation/TicketReductionPage';
import AutomationPage from './pages/innovation/AutomationPage';
import AIHubPage from './pages/innovation/AIHubPage';
import UserEnablementPage from './pages/innovation/UserEnablementPage';
import ContinuousImprovementPage from './pages/innovation/ContinuousImprovementPage';

// ── Reporting Pages ──
import DFRReportPage from './pages/reporting/DFRReportPage';
import DSRReportPage from './pages/reporting/DSRReportPage';
import WSRReportPage from './pages/reporting/WSRReportPage';
import MSRReportPage from './pages/reporting/MSRReportPage';
import SLAPerformancePage from './pages/reporting/SLAPerformancePage';
import ExecutiveReportPage from './pages/reporting/ExecutiveReportPage';

// ── Customer Corner State ──
import { CustomerCornerProvider } from './contexts/CustomerCornerContext';

// ── Layout & Global Components ──
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import AssistantChatDrawer from './components/common/AssistantChatDrawer';

// ── Scroll to top on route change ──
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const main = document.querySelector('.app-main-content');
    if (main) main.scrollTop = 0;
  }, [pathname]);
  return null;
}

// ── Loading Screen ──
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--bg-secondary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner spinner-lg" style={{ margin: '0 auto var(--space-base)' }} />
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>Loading AMS Control Tower...</p>
      </div>
    </div>
  );
}

// ── Protected Landing ──
function ProtectedLanding() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <LandingPage />;
}

// ── Authenticated Layout (Portal Shell) ──
function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => setMobileSidebarOpen(false), [location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="app-shell-main">
        <TopHeader
          collapsed={sidebarCollapsed}
          onToggleSidebar={() => {
            if (window.innerWidth <= 1024) {
              setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          onOpenAssistant={() => setShowAssistant(true)}
        />
        <main className="app-main-content">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Floating AI Assistant Trigger */}
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 900,
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--edge-primary) 0%, #B82B10 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 6px 20px rgba(209, 50, 18, 0.4), 0 2px 6px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(209, 50, 18, 0.5), 0 4px 10px rgba(0, 0, 0, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(209, 50, 18, 0.4), 0 2px 6px rgba(0, 0, 0, 0.12)';
          }}
          aria-label="Open AMS Assistant"
          title="AMS Assistant (AI Operational Copilot)"
        >
          <Bot size={22} strokeWidth={2.2} />
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid var(--bg-card, #ffffff)',
              boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)',
            }}
          />
        </button>
      )}

      {/* Assistant Drawer */}
      <AssistantChatDrawer
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
      />
    </div>
  );
}

// ── App Router ──
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
          <CustomerCornerProvider>
            <Routes>
              {/* ── Public ── */}
              <Route path="/login" element={<LoginPage />} />

              {/* ── Protected Landing (no shell) ── */}
              <Route path="/landing" element={<ProtectedLanding />} />

              {/* ── Authenticated Portal Shell ── */}
              <Route element={<AuthenticatedLayout />}>
                {/* Executive Board */}
                <Route path="/executive-board" element={<ExecutiveBoardPage />} />

                {/* Global Calendar */}
                <Route path="/calendar" element={<GlobalCalendarPage />} />

                {/* Command Center */}
                <Route path="/command-center" element={<CommandCenterOverview />} />
                <Route path="/command-center/incidents" element={<IncidentsPage />} />
                <Route path="/command-center/service-requests" element={<ServiceRequestsPage />} />
                <Route path="/command-center/enhancements" element={<EnhancementsPage />} />
                <Route path="/command-center/problems" element={<ProblemsPage />} />

                {/* Governance & Compliance */}
                <Route path="/governance" element={<Navigate to="/governance/audits" replace />} />
                <Route path="/governance/audits" element={<AuditsPage />} />
                <Route path="/governance/risks" element={<RiskRegisterPage />} />
                <Route path="/governance/licenses" element={<LicensesPage />} />
                <Route path="/governance/programs" element={<ProgramsPage />} />
                <Route path="/governance/transition" element={<TransitionPage />} />
                <Route path="/governance/actions" element={<ActionHubPage />} />

                {/* Resource & Capability */}
                <Route path="/resources" element={<Navigate to="/resources/directory" replace />} />
                <Route path="/resources/directory" element={<ResourceDirectoryPage />} />
                <Route path="/resources/organization" element={<OrganizationPage />} />
                <Route path="/resources/time" element={<TimeEffortPage />} />
                <Route path="/resources/contact" element={<ContactMatrixPage />} />
                <Route path="/resources/skills" element={<SkillsMatrixPage />} />
                <Route path="/resources/coverage" element={<CoveragePage />} />

                {/* Application & Technology Estate */}
                <Route path="/technology" element={<Navigate to="/technology/applications" replace />} />
                <Route path="/technology/applications" element={<ApplicationsPage />} />
                <Route path="/technology/application-health" element={<AppHealthPage />} />
                <Route path="/technology/landscape" element={<LandscapePage />} />
                <Route path="/technology/dependencies" element={<DependenciesPage />} />
                <Route path="/technology/licenses" element={<TechLicensesPage />} />
                <Route path="/technology/releases" element={<ReleasesPage />} />

                {/* Customer Connect */}
                <Route path="/customer" element={<Navigate to="/customer/corner" replace />} />
                <Route path="/customer/corner" element={<CustomerCornerPage />} />
                <Route path="/customer/feedback" element={<FeedbackPage />} />
                <Route path="/customer/actions" element={<CustomerActionsPage />} />
                <Route path="/customer/issues" element={<CustomerIssuesPage />} />

                {/* Service Operation */}
                <Route path="/service-operation" element={<Navigate to="/service-operation/overview" replace />} />
                <Route path="/service-operation/overview" element={<OperationOverviewPage />} />
                <Route path="/service-operation/knowledge" element={<KnowledgeBasePage />} />
                <Route path="/service-operation/problem-improvement" element={<ProblemImprovementPage />} />
                <Route path="/service-operation/continuity" element={<ContinuityDRPage />} />
                <Route path="/service-operation/performance" element={<PerformancePage />} />

                {/* Service Innovation */}
                <Route path="/service-innovation" element={<Navigate to="/service-innovation/ticket-reduction" replace />} />
                <Route path="/service-innovation/ticket-reduction" element={<TicketReductionPage />} />
                <Route path="/service-innovation/automation" element={<AutomationPage />} />
                <Route path="/service-innovation/ai" element={<AIHubPage />} />
                <Route path="/service-innovation/user-enablement" element={<UserEnablementPage />} />
                <Route path="/service-innovation/continuous-improvement" element={<ContinuousImprovementPage />} />

                {/* Reporting */}
                <Route path="/reporting" element={<Navigate to="/reporting/dfr" replace />} />
                <Route path="/reporting/dfr" element={<DFRReportPage />} />
                <Route path="/reporting/dsr" element={<DSRReportPage />} />
                <Route path="/reporting/wsr" element={<WSRReportPage />} />
                <Route path="/reporting/msr" element={<MSRReportPage />} />
                <Route path="/reporting/sla" element={<SLAPerformancePage />} />
                <Route path="/reporting/executive" element={<ExecutiveReportPage />} />
              </Route>

              {/* ── Catch-all ── */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CustomerCornerProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
