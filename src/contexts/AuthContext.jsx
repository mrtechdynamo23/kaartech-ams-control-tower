/**
 * EDGE AMS Control Tower — Authentication Context
 * 
 * Session-based auth using sessionStorage (no backend user DB yet).
 * Demo credentials centralized as a named config constant.
 * Architected for future SSO/OIDC/Microsoft Entra ID integration.
 * RBAC abstraction with role definitions per Section 83.
 * 
 * CLASSIFICATION: DEMO — demo authentication clearly identified in code
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// ── DEMO CREDENTIALS ──
// Centralised demo credential config (Section 10).
// In production, replace with enterprise SSO/OIDC.
const DEMO_CREDENTIALS = {
  id: 'edge.admin',
  password: 'Edge@2026',
  user: {
    id: 'USR-001',
    name: 'Ahmed Al Mansouri',
    email: 'ahmed.almansouri@edge.ae',
    role: 'AMS Lead',
    roleKey: 'AMS_LEAD',
    avatar: 'AM',
    entity: 'EDGE Corp.',
    department: 'AMS Operations',
  },
};

// ── RBAC Role Permissions (Section 83) ──
// CLASSIFICATION: PROPOSED — architecture for future backend enforcement
const ROLE_PERMISSIONS = {
  EXECUTIVE: {
    canView: ['*'],
    canEdit: [],
    canApprove: ['programs', 'governance'],
    sensitive: ['commercial', 'penalty'],
  },
  AMS_LEAD: {
    canView: ['*'],
    canEdit: ['*'],
    canApprove: ['*'],
    sensitive: ['*'],
  },
  SERVICE_MANAGER: {
    canView: ['*'],
    canEdit: ['commandCenter', 'serviceOperation', 'customerConnect'],
    canApprove: ['serviceRequests', 'enhancements'],
    sensitive: ['sla', 'reporting'],
  },
  INCIDENT_MANAGER: {
    canView: ['commandCenter', 'reporting', 'executiveBoard'],
    canEdit: ['incidents', 'problems'],
    canApprove: ['incidents'],
    sensitive: ['sla'],
  },
  GOVERNANCE_MANAGER: {
    canView: ['*'],
    canEdit: ['governance'],
    canApprove: ['audits', 'risks', 'actions'],
    sensitive: ['audit', 'risk'],
  },
  RESOURCE_MANAGER: {
    canView: ['*'],
    canEdit: ['resources'],
    canApprove: ['leave', 'timesheet', 'coverage'],
    sensitive: ['contact', 'phone', 'email'],
  },
  APPLICATION_MANAGER: {
    canView: ['*'],
    canEdit: ['technology'],
    canApprove: ['releases', 'changes'],
    sensitive: ['license'],
  },
  CUSTOMER_MANAGER: {
    canView: ['commandCenter', 'customerConnect', 'reporting'],
    canEdit: ['customerConnect'],
    canApprove: ['customerActions'],
    sensitive: [],
  },
  AUDITOR: {
    canView: ['governance', 'reporting'],
    canEdit: ['audits', 'findings'],
    canApprove: [],
    sensitive: ['audit'],
  },
  ANALYST: {
    canView: ['*'],
    canEdit: [],
    canApprove: [],
    sensitive: [],
  },
  ADMINISTRATOR: {
    canView: ['*'],
    canEdit: ['*'],
    canApprove: ['*'],
    sensitive: ['*'],
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('edge-ams-user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;

  /**
   * Demo login — checks against centralised DEMO_CREDENTIALS.
   * Returns { success, error } after a simulated delay.
   * In production, this would call an SSO/OIDC endpoint.
   */
  const login = useCallback(async (corporateId, password) => {
    setIsLoading(true);
    setError(null);

    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (
      corporateId.toLowerCase() === DEMO_CREDENTIALS.id.toLowerCase() &&
      password === DEMO_CREDENTIALS.password
    ) {
      const userData = { ...DEMO_CREDENTIALS.user };
      setUser(userData);
      try { sessionStorage.setItem('edge-ams-user', JSON.stringify(userData)); } catch {}
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    setError('invalidCredentials');
    return { success: false, error: 'invalidCredentials' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    try { sessionStorage.removeItem('edge-ams-user'); } catch {}
  }, []);

  /**
   * RBAC permission check.
   * In production, enforce on the backend; frontend hiding is supplementary.
   */
  const hasPermission = useCallback((action, module) => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.roleKey];
    if (!perms) return false;
    const list = perms[action];
    if (!list) return false;
    return list.includes('*') || list.includes(module);
  }, [user]);

  const canView = useCallback((module) => hasPermission('canView', module), [hasPermission]);
  const canEdit = useCallback((module) => hasPermission('canEdit', module), [hasPermission]);
  const canApprove = useCallback((module) => hasPermission('canApprove', module), [hasPermission]);
  const canViewSensitive = useCallback((field) => hasPermission('sensitive', field), [hasPermission]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      hasPermission,
      canView,
      canEdit,
      canApprove,
      canViewSensitive,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Export for reference
export { DEMO_CREDENTIALS, ROLE_PERMISSIONS };
