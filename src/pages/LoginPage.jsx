/**
 * EDGE AMS Control Tower — Login Page
 * Route: /login
 * 
 * Simple, premium, corporate login.
 * Left: EDGE identity / restrained technical visual language
 * Right: Authentication card
 * Motion: Restrained (Section 9)
 * Demo credentials: centralized in AuthContext (Section 10)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Shield, Lock, ArrowRight, Sun, Moon, Languages } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Prefilled demo credentials so user only needs to click SIGN IN
  const [corporateId, setCorporateId] = useState('edge.admin');
  const [password, setPassword] = useState('Edge@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/landing', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login(corporateId, password);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/landing'), 500);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Panel: EDGE Identity with Defense Atmosphere ── */}
      <div className="login-left">
        {/* Subtle defense atmosphere background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/edge-hero-air.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.16,
            filter: 'grayscale(40%) contrast(110%)',
          }}
        />
        {/* Gradient dark mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10, 13, 16, 0.92) 0%, rgba(15, 20, 26, 0.85) 100%)',
          }}
        />

        <div className="login-left-content">
          {/* Geometric pattern background */}
          <div className="login-pattern">
            <svg viewBox="0 0 800 800" className="login-pattern-svg">
              <defs>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--edge-primary)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="var(--edge-primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[...Array(12)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 70} x2="800" y2={i * 70} stroke="var(--edge-primary)" strokeOpacity="0.06" strokeWidth="0.5" />
              ))}
              {[...Array(12)].map((_, i) => (
                <line key={`v${i}`} x1={i * 70} y1="0" x2={i * 70} y2="800" stroke="var(--edge-primary)" strokeOpacity="0.06" strokeWidth="0.5" />
              ))}
              {/* Connection nodes */}
              {[{x:140,y:210},{x:350,y:140},{x:560,y:280},{x:280,y:420},{x:490,y:490},{x:210,y:560},{x:420,y:350},{x:630,y:420}].map((pt, i) => (
                <React.Fragment key={`n${i}`}>
                  <circle cx={pt.x} cy={pt.y} r="3" fill="var(--edge-primary)" opacity="0.3" />
                  <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="var(--edge-primary)" strokeOpacity="0.15" strokeWidth="0.5" />
                </React.Fragment>
              ))}
              {/* Connection lines */}
              <polyline points="140,210 350,140 560,280 420,350" fill="none" stroke="var(--edge-primary)" strokeOpacity="0.1" strokeWidth="0.5" />
              <polyline points="280,420 490,490 630,420 420,350" fill="none" stroke="var(--edge-primary)" strokeOpacity="0.1" strokeWidth="0.5" />
              <line x1="350" y1="140" x2="420" y2="350" stroke="var(--edge-primary)" strokeOpacity="0.08" strokeWidth="0.5" />
              <line x1="280" y1="420" x2="210" y2="560" stroke="var(--edge-primary)" strokeOpacity="0.08" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="login-brand">
            <div
              className="login-edge-logo"
              style={{
                background: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <img
                src="/assets/edge-logo.png"
                alt="EDGE Official Logo"
                style={{ height: '36px', maxWidth: '140px', objectFit: 'contain' }}
              />
            </div>
            <div className="login-brand-text">
              <span className="login-brand-ams" style={{ letterSpacing: '0.1em', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                AMS CONTROL TOWER
              </span>
            </div>
          </div>

          <div className="login-left-tagline">
            <p>Application Management Services</p>
            <p className="login-left-sub">Operational Intelligence Platform • AdvantEDGE Landscape</p>
          </div>

          <div className="login-left-footer">
            <div className="login-env-badge">
              <Shield size={14} />
              <span>{t('auth.amsEnvironment')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Auth Card ── */}
      <div className="login-right">
        {/* Top bar */}
        <div className="login-right-topbar">
          <button onClick={toggleTheme} className="login-util-btn" title="Toggle theme" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={toggleLanguage} className="login-util-btn" title="Toggle language" aria-label="Toggle language">
            <Languages size={16} />
            <span>{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>
        </div>

        <div className="login-card-wrapper">
          <div className={`login-card ${success ? 'login-success' : ''}`}>
            <div className="login-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ background: '#ffffff', padding: '3px 8px', borderRadius: '5px', display: 'inline-flex' }}>
                  <img src="/assets/edge-logo.png" alt="EDGE Logo" style={{ height: '18px', objectFit: 'contain' }} />
                </div>
                <span className="badge badge-primary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Corporate Access
                </span>
              </div>
              <h1 className="login-card-title">{t('auth.signIn')}</h1>
              <p className="login-card-subtitle">{t('auth.authorizedOnly')}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="corporateId" className="form-label">{t('auth.corporateId')}</label>
                <div className="login-input-wrapper">
                  <input
                    id="corporateId"
                    type="text"
                    className="form-input login-input"
                    value={corporateId}
                    onChange={(e) => { setCorporateId(e.target.value); clearError(); }}
                    placeholder="edge.admin"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">{t('auth.password')}</label>
                <div className="login-input-wrapper login-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input login-input"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="form-checkbox">
                  <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <span>{t('auth.rememberMe')}</span>
                </label>
                <button type="button" className="login-forgot">{t('auth.forgotPassword')}</button>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <Lock size={14} />
                  <span>{t(`auth.${error}`)}</span>
                </div>
              )}

              <button
                type="submit"
                className={`btn btn-primary login-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !corporateId || !password}
              >
                {isLoading ? (
                  <>
                    <span className="spinner spinner-sm"></span>
                    <span>{t('auth.signingIn')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('auth.signIn')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="login-demo-hint">
              <span className="badge badge-orange">DEMO</span>
              <span>edge.admin / Edge@2026</span>
            </div>
          </div>
        </div>

        <div className="login-right-footer">
          <span>© 2026 EDGE Group PJSC. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
