/**
 * EDGE AMS Control Tower — Comprehensive Scrollable Landing Gateway
 * Route: /landing
 * 
 * Features:
 * - Cinematic Ken Burns hero viewport with rotating authentic EDGE defense imagery
 * - High-impact Mission Scale & Operational Metrics Strip
 * - 7 Integrated Capability Domains (Interactive Feature Grid)
 * - AdvantEDGE 4-Tier Enterprise Defense Architecture (Interactive Stack)
 * - 4 EDGE Defense Clusters Footprint (Platforms, Missiles, EW/Cyber, Support)
 * - Contractual Delivery Tracks (AMS-ON-RUN, AMS-OF-RUN, AMS-OF-Flex, ENH-OF-RUN)
 * - Operational Calendar & Milestone Schedule Spotlight
 * - Executive Gateway Callout & Full Enterprise Footer
 * - Full Arabic (RTL) & Dark/Light mode support
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowRight, Shield, Activity, Users, Monitor, Server,
  Sun, Moon, Languages, LogOut, CheckCircle2, Radio,
  Plane, Compass, Cpu, Layers, Lock, FileCheck, BarChart3,
  Database, Globe, Sparkles, ChevronDown, Calendar,
  AlertTriangle, Zap, ExternalLink, Network, Award
} from 'lucide-react';
import './LandingPage.css';

// Curated authentic EDGE defense assets from /assets
const HERO_IMAGES = [
  {
    src: '/assets/edge-hero-air.jpg',
    title: 'Aerospace & Combat Systems',
    subtitle: 'Stealth autonomous defense platforms and aerial surveillance',
  },
  {
    src: '/assets/edge-space.jpg',
    title: 'Autonomous Robotics & Drones',
    subtitle: 'ADASI autonomous air, land, and tactical unmanned systems',
  },
  {
    src: '/assets/edge-ew-radar.jpg',
    title: 'Land Systems & Electronic Warfare',
    subtitle: 'Tactical mobile telemetry, radar, and secure defense networks',
  },
  {
    src: '/assets/edge-naval.jpg',
    title: 'Naval & Maritime Operations',
    subtitle: 'Vessel defense engineering and joint strategic command',
  },
  {
    src: '/assets/edge-environment.jpg',
    title: 'Armored & Advanced Vehicles',
    subtitle: 'Mission-critical engineering and severe-environment readiness',
  },
];

const DOMAIN_PILLARS = [
  { label: 'Aerospace & Air Defense', icon: Plane },
  { label: 'Autonomous & Robotics', icon: Cpu },
  { label: 'Land & Radar Systems', icon: Radio },
  { label: 'Naval & Maritime', icon: Compass },
  { label: 'Enterprise Core (SAP/BTP)', icon: Layers },
];

const OPERATIONAL_METRICS = [
  { label: 'EDGE Group Entities', value: '34', change: 'Integrated & Active', icon: Globe },
  { label: 'Core Mission Applications', value: '26', change: 'S/4HANA, SF, Ariba, D365', icon: Server },
  { label: 'Middleware Interfaces', value: '64', change: 'CPI, Kafka, Secure OData', icon: Network },
  { label: 'Core Platform Uptime', value: '99.64%', change: 'Target 99.5% Exceeded', icon: Activity },
  { label: 'Dedicated AMS Engineers', value: '30', change: 'Onsite Abu Dhabi + CoE', icon: Users },
  { label: 'Scheduled Operations', value: '140+', change: 'Next 3+ Months Tracked', icon: Calendar },
];

const CAPABILITY_DOMAINS = [
  {
    id: 'command-center',
    title: 'Command Center & Incident Operations',
    titleAr: 'مركز القيادة وإدارة الحوادث',
    tag: 'Core Operations',
    desc: '24/7 tri-shift triage, automated P1-P4 dispatch, queue load balancing, and real-time SLA breach countdowns.',
    descAr: 'فرز العمليات على مدار 24/7 عبر ثلاث ورديات، وإرسال الحوادث آلياً، وتتبع مؤشرات مستوى الخدمة.',
    metric: 'Avg P1 MTTD: 8m | Res: 98.6%',
    route: '/command-center',
    icon: Shield,
    accent: '#FF5622',
  },
  {
    id: 'executive-board',
    title: 'Executive Board & SLA Governance',
    titleAr: 'مجلس الإدارة التنفيذي ومؤشرات الخدمة',
    tag: 'Executive Command',
    desc: 'C-level executive reporting, contractual SLA scorecard, penalty credit ledgers, and strategic delivery KPIs.',
    descAr: 'تقارير الإدارة العليا، وبطاقة الأداء التعاقدية لاتفاقيات مستوى الخدمة، وسجل الخصومات الائتمانية.',
    metric: 'Overall SLA Index: 95.4% (Green)',
    route: '/executive-board',
    icon: BarChart3,
    accent: '#3B82F6',
  },
  {
    id: 'governance',
    title: 'Governance, Risk & Compliance',
    titleAr: 'الحوكمة وإدارة المخاطر والامتثال',
    tag: 'Regulatory Control',
    desc: 'Unified risk register, ISO 27001 / SOC 2 audit readiness, and Segregation of Duties (SOD) monitoring.',
    descAr: 'سجل المخاطر الموحد، وجاهزية تدقيق ISO 27001 وSOC 2، ومراقبة فصل المهام الوظيفية.',
    metric: '20 Audits Scheduled • 0 High Risks',
    route: '/governance/audits',
    icon: FileCheck,
    accent: '#D97706',
  },
  {
    id: 'resources',
    title: 'Resource Management & Talent CoE',
    titleAr: 'إدارة الموارد ومركز تميز الكفاءات',
    tag: 'Capacity Roster',
    desc: 'Global 30-FTE roster, onshore Abu Dhabi / offshore CoE distribution, skill matrices, and shift schedules.',
    descAr: 'سجل الكفاءات لـ 30 مهندساً متخصصاً، والتوزيع الداخلي والخارجي، ومصفوفة المهارات التقنية.',
    metric: '30 Active Engineers • 94% Utilization',
    route: '/resources/directory',
    icon: Users,
    accent: '#8B5CF6',
  },
  {
    id: 'estate',
    title: 'Estate & Infrastructure Health',
    titleAr: 'صحة البنية التحتية والمنظومة',
    tag: 'Systems Topology',
    desc: 'Real-time 26-system topology, HANA memory utilization, CPI interface latency, and DC1/DC2 redundancy.',
    descAr: 'المخطط الطوبولوجي لـ 26 نظاماً تقنياً، ومراقبة ذاكرة HANA، وزمن استجابة واجهات CPI.',
    metric: '26 Systems Monitored • 0 Outages',
    route: '/estate/applications',
    icon: Server,
    accent: '#10B981',
  },
  {
    id: 'customer',
    title: 'Customer Connect & Entity Portals',
    titleAr: 'بوابة تواصل العملاء ورضا المستفيدين',
    tag: 'Stakeholder Relations',
    desc: 'Entity-level CSAT scores, stakeholder engagement, quarterly reviews, and sentiment tracking across 34 entities.',
    descAr: 'مؤشرات رضا العملاء لكل جهة، ومتابعة التواصل المؤسسي والاجتماعات الدورية عبر 34 جهة.',
    metric: '4.82 / 5.00 Average CSAT',
    route: '/customer/csat',
    icon: Globe,
    accent: '#EC4899',
  },
  {
    id: 'innovation',
    title: 'Service Innovation & AI Automation',
    titleAr: 'الابتكار في الخدمات والأتمتة الذكية',
    tag: 'Automation & AI',
    desc: 'Robotic process automation, automated invoice matching, self-healing background jobs, and AI incident copilot.',
    descAr: 'أتمتة العمليات الروبوتية (RPA)، ومطابقة الفواتير الذكية، ونصوص المعالجة الذاتية التلقائية.',
    metric: '5 Active RPA Bots • 18% Efficiency Gain',
    route: '/innovation/automation',
    icon: Sparkles,
    accent: '#F59E0B',
  },
];

const ARCHITECTURE_TIERS = [
  {
    tier: 'Tier 1: Experience & Analytics',
    tierAr: 'المستوى 1: تجربة المستخدم والتحليلات',
    badge: 'Presentation',
    color: '#3B82F6',
    items: ['SAP Analytics Cloud (SAC) Boardrooms', 'SAP Fiori 3.0 Mobile Launchpads', 'PowerBI Executive Dashboards', 'Customer Connect Self-Service Portals']
  },
  {
    tier: 'Tier 2: Business Core & Defense Suites',
    tierAr: 'المستوى 2: النواة التشغيلية وحزم الدفاع',
    badge: 'Enterprise Core',
    color: '#FF5622',
    items: ['SAP S/4HANA 2023 Enterprise ERP', 'SAP SuccessFactors HXM Cloud', 'SAP Ariba Guided Sourcing', 'Microsoft Dynamics 365 CRM']
  },
  {
    tier: 'Tier 3: Enterprise Integration & Event Mesh',
    tierAr: 'المستوى 3: التكامل المؤسسي وشبكة الأحداث',
    badge: 'Middleware',
    color: '#8B5CF6',
    items: ['SAP BTP Integration Suite (CPI)', 'Apache Kafka High-Throughput Event Mesh', 'Sovereign Government Secure API Gateway', 'OpenText ArchiveLink Connector']
  },
  {
    tier: 'Tier 4: Secure Defense Infrastructure',
    tierAr: 'المستوى 4: البنية التحتية الدفاعية الآمنة',
    badge: 'Foundational',
    color: '#10B981',
    items: ['SAP HANA 2.0 In-Memory Database Cluster', 'OpenText xECM Defense Document Vault', 'Abu Dhabi Primary DC1 / Al Ain DC2 Hot-Standby', 'Zero-Trust Bastion Network Enclaves']
  }
];

const DEFENSE_CLUSTERS = [
  {
    name: 'Platforms & Systems',
    nameAr: 'المنصات والأنظمة',
    entities: 'NIMR • ADASI • ADSB • CARACAL',
    desc: 'Tactical armored vehicles, autonomous UAV systems, naval vessel shipbuilding, and precision defense firearms.',
    color: '#FF5622'
  },
  {
    name: 'Missiles & Weapons',
    nameAr: 'الصواريخ والأسلحة',
    entities: 'HALCON • LAHAB • AL TARIQ',
    desc: 'Precision-guided munitions, defense pyrotechnics, artillery ammunition, and advanced aerospace payloads.',
    color: '#EF4444'
  },
  {
    name: 'Electronic Warfare & Cyber',
    nameAr: 'الحرب الإلكترونية والأمن السيبراني',
    entities: 'BEACON RED • KATIM • SIGN4L',
    desc: 'National cyber academies, ultra-secure cryptographic communications, and RF electronic warfare countermeasures.',
    color: '#3B82F6'
  },
  {
    name: 'Trading & Mission Support',
    nameAr: 'التجارة والدعم التشغيلي',
    entities: 'JAHEZIYA • HORIZON • EPI • REMAYA',
    desc: 'Emergency response academy, helicopter flight school, precision CNC aerospace manufacturing, and shooting ranges.',
    color: '#10B981'
  }
];

const DELIVERY_TRACKS = [
  {
    code: 'AMS-ON-RUN',
    title: 'Onsite Dedicated Operations',
    titleAr: 'العمليات الميدانية المخصصة',
    desc: 'Full-time onsite incident commanders and technical leads stationed at EDGE HQ in Abu Dhabi for executive escalations.',
    sla: '15-Minute P1 Response SLA'
  },
  {
    code: 'AMS-OF-RUN',
    title: 'Offshore Core Center of Excellence',
    titleAr: 'مركز التميز الخارجي للعمليات',
    desc: '24/7 tri-shift technical resolvers covering L2/L3 application maintenance, midnight batch jobs, and queue monitoring.',
    sla: '24/7/365 Continuous Coverage'
  },
  {
    code: 'AMS-OF-Flex',
    title: 'Flexible Capacity Pool',
    titleAr: 'حزمة السعة المرنة للطلبات',
    desc: 'Agile hours bucket dynamically allocated to minor system enhancements, entity reports, and ad-hoc business requests.',
    sla: 'Rapid 48h Sprint Turnaround'
  },
  {
    code: 'ENH-OF-RUN',
    title: 'Major Transformation Packages',
    titleAr: 'حزم التطوير والتحول الكبرى',
    desc: 'Packaged transformation releases, multi-entity rollouts, S/4HANA feature pack upgrades, and plant MES integrations.',
    sla: 'Formal CAB Gate Governance'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  // Slow, cinematic background image rotation (8 seconds per slide)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/executive-board');
    }, 400);
  };

  const scrollToOverview = () => {
    const el = document.getElementById('mission-overview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`landing-gateway ${isEntering ? 'landing-exiting' : ''}`}>
      {/* ── 1. Cinematic Background Layer (Fixed) ── */}
      <div className="landing-bg-layer">
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={img.src}
            className={`landing-bg-slide ${idx === activeImageIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${img.src})`,
            }}
          />
        ))}

        {/* Cinematic dark overlays & subtle vignette */}
        <div className="landing-overlay-gradient" />
        <div className="landing-overlay-vignette" />
        <div className="landing-overlay-grid" />
      </div>

      {/* ── 2. Top Header Utility Bar (Fixed / Sticky) ── */}
      <header className="landing-header">
        <div className="landing-header-left">
          <div className="landing-brand-badge">
            <img
              src="/assets/edge-logo.png"
              alt="EDGE Logo"
              className="landing-edge-logo"
            />
          </div>
          <div className="landing-header-title">
            <span className="landing-header-sub">AMS CONTROL TOWER</span>
          </div>
        </div>

        <div className="landing-header-right">
          {/* Quick Calendar Jump */}
          <button
            onClick={() => navigate('/calendar')}
            className="landing-tool-btn"
            title="Operational Calendar"
          >
            <Calendar size={15} />
            <span className="landing-tool-label">{language === 'ar' ? 'التقويم' : 'Calendar'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="landing-tool-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span className="landing-tool-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="landing-tool-btn"
            title="Toggle Arabic / English"
            aria-label="Toggle Language"
          >
            <Languages size={15} />
            <span className="landing-tool-label">{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="landing-tool-btn landing-logout-btn"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={15} />
            <span className="landing-tool-label">{language === 'ar' ? 'خروج' : 'Exit'}</span>
          </button>
        </div>
      </header>

      {/* ── 3. Section 1: Hero Viewport ── */}
      <section className="landing-hero-section">
        <div className="landing-hero-inner">
          {/* Subtle Animated Line & Connected Nodes SVG */}
          <div className="landing-network-line-wrap">
            <svg className="landing-network-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="edgeLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF5622" stopOpacity="0" />
                  <stop offset="30%" stopColor="#FF5622" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#FF5622" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF5622" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="50" y1="30" x2="950" y2="30" stroke="rgba(255, 86, 34, 0.15)" strokeWidth="1" />
              <line x1="200" y1="30" x2="800" y2="30" stroke="url(#edgeLineGrad)" strokeWidth="2" className="landing-pulse-line" />
              <circle cx="350" cy="30" r="3" fill="#FF5622" />
              <circle cx="500" cy="30" r="4.5" fill="#FF5622" className="landing-pulse-node" />
              <circle cx="650" cy="30" r="3" fill="#FF5622" />
            </svg>
          </div>

          {/* Mission Status Chip */}
          <div className="landing-mission-badge">
            <span className="landing-badge-dot" />
            <span className="landing-badge-text">
              {language === 'ar' ? 'منصة استخبارات العمليات • بيئة إدارة خدمات التطبيقات' : 'OPERATIONAL INTELLIGENCE • ADVANCED MISSION SERVICES'}
            </span>
          </div>

          {/* Hero Brand Title */}
          <div className="landing-title-block">
            <div className="landing-brand-row">
              <h1 className="landing-hero-heading">
                <span className="landing-heading-edge">EDGE</span>
                <span className="landing-heading-ams">AMS CONTROL TOWER</span>
              </h1>
            </div>
            <h2 className="landing-hero-subheading">
              ADVANCED MISSION SERVICES
            </h2>
            <p className="landing-hero-description">
              {language === 'ar'
                ? 'إدارة تطبيقات المؤسسات • العمليات • الحوكمة • الأداء عبر 34 جهة تابعة لمجموعة إيدج'
                : 'Enterprise Application Management Services • Operations • Governance • Real-Time Operational Intelligence across 34 EDGE Group Entities'}
            </p>
          </div>

          {/* Strategic Domain Pillars Strip */}
          <div className="landing-pillars-strip">
            {DOMAIN_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.label} className="landing-pillar-item">
                  <Icon size={14} className="landing-pillar-icon" />
                  <span>{pillar.label}</span>
                </div>
              );
            })}
          </div>

          {/* Hero Actions */}
          <div className="landing-cta-group">
            <button
              onClick={handleEnter}
              className="landing-enter-btn"
              aria-label="Enter EDGE AMS Control Tower"
            >
              <span>{language === 'ar' ? 'دخول برج المراقبة' : 'ENTER CONTROL TOWER'}</span>
              <ArrowRight size={18} className="landing-btn-arrow" />
            </button>

            <button
              onClick={() => navigate('/calendar')}
              className="landing-secondary-btn"
            >
              <Calendar size={16} />
              <span>{language === 'ar' ? 'جدول العمليات والتقويم' : 'OPERATIONAL CALENDAR'}</span>
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="landing-slide-indicators">
            {HERO_IMAGES.map((img, i) => (
              <button
                key={img.title}
                onClick={() => setActiveImageIndex(i)}
                className={`landing-slide-pip ${i === activeImageIndex ? 'active' : ''}`}
                title={img.title}
                aria-label={`View ${img.title}`}
              />
            ))}
            <span className="landing-slide-label">
              {HERO_IMAGES[activeImageIndex].title}
            </span>
          </div>

          {/* Animated Scroll Down Indicator */}
          <button
            onClick={scrollToOverview}
            className="landing-scroll-hint"
            aria-label="Scroll to explore"
          >
            <span>{language === 'ar' ? 'استكشف البنية التشغيلية والخدمات' : 'EXPLORE MISSION ARCHITECTURE'}</span>
            <ChevronDown size={18} className="landing-scroll-chevron" />
          </button>
        </div>
      </section>

      {/* ── 4. Section 2: Mission Telemetry & Operational Scale Strip ── */}
      <section id="mission-overview" className="landing-content-section landing-metrics-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">
              {language === 'ar' ? 'النطاق والمقاييس التشغيلية' : 'ENTERPRISE OPERATIONAL SCOPE'}
            </span>
            <h3 className="landing-section-title">
              {language === 'ar' ? 'القدرة التشغيلية الموحدة لمجموعة إيدج' : 'Unified Scale Across the AdvantEDGE Landscape'}
            </h3>
            <p className="landing-section-desc">
              {language === 'ar'
                ? 'تغطية شاملة لـ 34 جهة دفاعية وتقنية متقدمة مع ضمان أعلى مستويات الجاهزية التشغيلية والأمان السيبراني.'
                : 'Mission-critical application lifecycle management engineered for high-availability defense platforms, severe environments, and sovereign compliance.'}
            </p>
          </div>

          <div className="landing-metrics-grid">
            {OPERATIONAL_METRICS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="landing-metric-card">
                  <div className="landing-metric-top">
                    <span className="landing-metric-val">{m.value}</span>
                    <div className="landing-metric-icon-wrap">
                      <Icon size={20} className="landing-metric-icon" />
                    </div>
                  </div>
                  <div className="landing-metric-label">{m.label}</div>
                  <div className="landing-metric-sub">{m.change}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Section 3: Seven Integrated Capability Domains ── */}
      <section className="landing-content-section landing-domains-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">
              {language === 'ar' ? 'مجالات القدرات السبعة' : 'SEVEN INTEGRATED DOMAINS'}
            </span>
            <h3 className="landing-section-title">
              {language === 'ar' ? 'منظومة إدارة الخدمات المتطورة' : 'Comprehensive Defense AMS Capabilities'}
            </h3>
            <p className="landing-section-desc">
              {language === 'ar'
                ? 'بنية متكاملة تغطي العمليات الميدانية، والحوكمة، وصحة الأنظمة، وذكاء الأعمال، والابتكار.'
                : 'Structured governance, continuous observability, predictive analytics, and automated shift operations purpose-built for EDGE Group.'}
            </p>
          </div>

          <div className="landing-domains-grid">
            {CAPABILITY_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              return (
                <div
                  key={domain.id}
                  className="landing-domain-card"
                  onClick={() => navigate(domain.route)}
                >
                  <div className="landing-domain-header">
                    <div
                      className="landing-domain-icon-box"
                      style={{ background: `${domain.accent}18`, borderColor: `${domain.accent}44`, color: domain.accent }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="landing-domain-tag">{domain.tag}</span>
                  </div>

                  <h4 className="landing-domain-title">
                    {language === 'ar' ? domain.titleAr : domain.title}
                  </h4>

                  <p className="landing-domain-desc">
                    {language === 'ar' ? domain.descAr : domain.desc}
                  </p>

                  <div className="landing-domain-footer">
                    <div className="landing-domain-metric">
                      <span className="landing-domain-dot" style={{ background: domain.accent }} />
                      <span>{domain.metric}</span>
                    </div>
                    <div className="landing-domain-link">
                      <span>{language === 'ar' ? 'فتح المجال' : 'Launch'}</span>
                      <ArrowRight size={14} className="landing-domain-arrow" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Section 4: AdvantEDGE 4-Tier Architecture Stack ── */}
      <section className="landing-content-section landing-architecture-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">
              {language === 'ar' ? 'الهيكلية التقنية' : 'ENTERPRISE ARCHITECTURE'}
            </span>
            <h3 className="landing-section-title">
              {language === 'ar' ? 'بنية AdvantEDGE المتكاملة ذات الـ 4 طبقات' : 'AdvantEDGE 4-Tier Defense Architecture'}
            </h3>
            <p className="landing-section-desc">
              {language === 'ar'
                ? 'نموذج معماري متكامل يربط بين تجربة المستخدم، والنواة التشغيلية، ووسيط التكامل، والبنية التحتية الآمنة.'
                : 'Robust multi-layered architectural stack delivering sovereign security, zero-trust network segregation, and real-time enterprise telemetry.'}
            </p>
          </div>

          <div className="landing-arch-stack">
            {ARCHITECTURE_TIERS.map((tier, idx) => (
              <div key={tier.tier} className="landing-arch-tier-card">
                <div className="landing-arch-tier-header">
                  <div className="landing-arch-tier-title-wrap">
                    <span className="landing-arch-tier-num" style={{ borderColor: tier.color, color: tier.color }}>
                      0{idx + 1}
                    </span>
                    <h4 className="landing-arch-tier-name">
                      {language === 'ar' ? tier.tierAr : tier.tier}
                    </h4>
                  </div>
                  <span className="landing-arch-badge" style={{ background: `${tier.color}20`, color: tier.color, borderColor: `${tier.color}40` }}>
                    {tier.badge}
                  </span>
                </div>

                <div className="landing-arch-tier-items">
                  {tier.items.map((item) => (
                    <div key={item} className="landing-arch-item">
                      <CheckCircle2 size={15} style={{ color: tier.color, flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Section 5: EDGE Defense Clusters Supported ── */}
      <section className="landing-content-section landing-clusters-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">
              {language === 'ar' ? 'قطاعات مجموعة إيدج' : 'EDGE DEFENSE CLUSTERS'}
            </span>
            <h3 className="landing-section-title">
              {language === 'ar' ? 'القطاعات والشركات المدعومة تشغيلياً' : 'Specialized Operational Coverage'}
            </h3>
            <p className="landing-section-desc">
              {language === 'ar'
                ? 'دعم متواصل لـ 4 قطاعات رئيسية تشمل الأسلحة الذكية، والمنصات المستقلة، والأمن السيبراني، والدعم الفني.'
                : 'Dedicated application lifecycle and specialized business workflow support tailored to each cluster’s unique manufacturing and defense delivery cycles.'}
            </p>
          </div>

          <div className="landing-clusters-grid">
            {DEFENSE_CLUSTERS.map((cluster) => (
              <div key={cluster.name} className="landing-cluster-card">
                <div className="landing-cluster-header">
                  <span className="landing-cluster-dot" style={{ background: cluster.color, boxShadow: `0 0 10px ${cluster.color}` }} />
                  <h4 className="landing-cluster-title">
                    {language === 'ar' ? cluster.nameAr : cluster.name}
                  </h4>
                </div>
                <div className="landing-cluster-entities">{cluster.entities}</div>
                <p className="landing-cluster-desc">{cluster.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Section 6: Contractual Delivery Tracks ── */}
      <section className="landing-content-section landing-tracks-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-eyebrow">
              {language === 'ar' ? 'مسارات التسليم التعاقدية' : 'CONTRACTUAL DELIVERY TRACKS'}
            </span>
            <h3 className="landing-section-title">
              {language === 'ar' ? 'مسارات الدعم والتحول الأربعة' : 'Four SLA-Governed Delivery Streams'}
            </h3>
            <p className="landing-section-desc">
              {language === 'ar'
                ? 'نموذج تسليم متوازن يجمع بين التواجد الميداني، والتشغيل المستمر على مدار الساعة، والسعة المرنة للتحسينات.'
                : 'Rigorous ITIL v4 and ISO 20000 service-delivery model guaranteeing round-the-clock continuity and rapid agile transformation.'}
            </p>
          </div>

          <div className="landing-tracks-grid">
            {DELIVERY_TRACKS.map((track) => (
              <div key={track.code} className="landing-track-card">
                <div className="landing-track-header">
                  <span className="landing-track-code">{track.code}</span>
                  <span className="landing-track-badge">{track.sla}</span>
                </div>
                <h4 className="landing-track-title">
                  {language === 'ar' ? track.titleAr : track.title}
                </h4>
                <p className="landing-track-desc">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Section 7: Operational Calendar Spotlight ── */}
      <section className="landing-content-section landing-calendar-spotlight-section">
        <div className="landing-section-container">
          <div className="landing-calendar-spotlight-box">
            <div className="landing-spotlight-left">
              <span className="landing-spotlight-badge">
                <Calendar size={14} />
                <span>{language === 'ar' ? 'الجدول التشغيلي الموحد' : 'OPERATIONAL CALENDAR ACTIVE'}</span>
              </span>
              <h3 className="landing-spotlight-heading">
                {language === 'ar' ? '140+ حدث تشغيلي وتدقيق مجدول للأشهر القادمة' : '140+ Operational Events & Program Milestones Scheduled'}
              </h3>
              <p className="landing-spotlight-p">
                {language === 'ar'
                  ? 'متابعة شاملة لعمليات التدقيق ISO/SOC2، وإصدارات الإنتاج، وفترات تجميد الأنظمة المالية، واجتماعات المراجعة الأسبوعية للجهات.'
                  : 'Stay ahead of upcoming ISO 27001 surveillance audits, CAB production releases, mid-year change freeze windows, and entity SteerComs across June through December 2026.'}
              </p>
              <div className="landing-spotlight-actions">
                <button
                  onClick={() => navigate('/calendar')}
                  className="landing-spotlight-btn"
                >
                  <span>{language === 'ar' ? 'فتح التقويم التشغيلي الكامل' : 'LAUNCH OPERATIONAL CALENDAR'}</span>
                  <ArrowRight size={16} className="landing-btn-arrow" />
                </button>
              </div>
            </div>

            <div className="landing-spotlight-right">
              <div className="landing-spotlight-preview-card">
                <div className="landing-spotlight-card-header">
                  <span className="landing-preview-dot" />
                  <span className="landing-preview-title">Next 3 Months Key Milestones</span>
                </div>
                <div className="landing-preview-list">
                  <div className="landing-preview-item">
                    <span className="landing-item-date">SEP 07</span>
                    <span className="landing-item-tag tag-audit">Audit</span>
                    <span className="landing-item-text">S/4HANA 2025 SP03 Core Upgrade Pre-Validation</span>
                  </div>
                  <div className="landing-preview-item">
                    <span className="landing-item-date">SEP 20</span>
                    <span className="landing-item-tag tag-milestone">Gate</span>
                    <span className="landing-item-text">Wave 3 S/4HANA Manufacturing Phase 2 Cutover</span>
                  </div>
                  <div className="landing-preview-item">
                    <span className="landing-item-date">SEP 28</span>
                    <span className="landing-item-tag tag-release">Release</span>
                    <span className="landing-item-text">AdvantEDGE September Production Sprint Release</span>
                  </div>
                  <div className="landing-preview-item">
                    <span className="landing-item-date">OCT 09</span>
                    <span className="landing-item-tag tag-release">Release</span>
                    <span className="landing-item-text">S/4HANA Feature Pack 02 Application Rollout</span>
                  </div>
                  <div className="landing-preview-item">
                    <span className="landing-item-date">OCT 21</span>
                    <span className="landing-item-tag tag-freeze">Freeze</span>
                    <span className="landing-item-text">UAE Defense Exhibition High-Alert Moratorium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Section 8: Final Gateway Callout ── */}
      <section className="landing-content-section landing-cta-section">
        <div className="landing-section-container">
          <div className="landing-final-cta-card">
            <div className="landing-cta-inner">
              <div className="landing-cta-badge">
                <Shield size={14} className="landing-cta-badge-icon" />
                <span>RESTRICTED DEFENSE ENVIRONMENT • EDGE INTERNAL USE ONLY</span>
              </div>

              <h2 className="landing-cta-heading">
                {language === 'ar' ? 'جاهزية كاملة للقيادة والتحكم' : 'Ready for Full Operational Visibility?'}
              </h2>

              <p className="landing-cta-desc">
                {language === 'ar'
                  ? 'ادخل إلى برج المراقبة للوصول الفوري إلى مؤشرات الأداء الحية، ومراقبة صحة التطبيقات الـ 26، وغرفة القيادة التنفيذية.'
                  : 'Access real-time incident dispatch, live SLA performance ledgers, infrastructure telemetry, and executive decision intelligence.'}
              </p>

              <div className="landing-cta-buttons">
                <button
                  onClick={handleEnter}
                  className="landing-enter-btn"
                >
                  <span>{language === 'ar' ? 'دخول برج المراقبة التنفيذي' : 'ENTER CONTROL TOWER'}</span>
                  <ArrowRight size={18} className="landing-btn-arrow" />
                </button>

                <button
                  onClick={() => navigate('/calendar')}
                  className="landing-secondary-btn"
                >
                  <Calendar size={16} />
                  <span>{language === 'ar' ? 'استعراض التقويم' : 'VIEW CALENDAR'}</span>
                </button>
              </div>

              <div className="landing-final-status-bar">
                <div className="landing-status-indicator">
                  <span className="landing-live-dot" />
                  <span>ALL 26 SYSTEMS OPERATIONAL</span>
                </div>
                <span className="landing-status-sep">•</span>
                <span>34 ENTITIES INTEGRATED</span>
                <span className="landing-status-sep">•</span>
                <span>GST TIME (UTC+4)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. Section 9: Full Enterprise Footer ── */}
      <footer className="landing-full-footer">
        <div className="landing-section-container">
          <div className="landing-footer-grid">
            <div className="landing-footer-col brand-col">
              <div className="landing-brand-badge" style={{ display: 'inline-flex', marginBottom: '14px' }}>
                <img
                  src="/assets/edge-logo.png"
                  alt="EDGE Logo"
                  className="landing-edge-logo"
                />
              </div>
              <p className="landing-footer-brand-text">
                EDGE Group PJSC — Advanced Technology & Defense Conglomerate.
                AdvantEDGE Enterprise Application Management Services Control Tower.
              </p>
              <div className="landing-footer-sec-badge">
                <Lock size={12} />
                <span>OFFICIAL // STRICT DEFENSE PRIVILEGED</span>
              </div>
            </div>

            <div className="landing-footer-col">
              <h5 className="landing-footer-heading">OPERATIONAL PORTALS</h5>
              <ul className="landing-footer-links">
                <li><a onClick={() => navigate('/command-center')}>Live Command Center</a></li>
                <li><a onClick={() => navigate('/executive-board')}>Executive Boardroom</a></li>
                <li><a onClick={() => navigate('/calendar')}>Operational Calendar</a></li>
                <li><a onClick={() => navigate('/governance/audits')}>Compliance & Audits</a></li>
              </ul>
            </div>

            <div className="landing-footer-col">
              <h5 className="landing-footer-heading">SYSTEM DOMAINS</h5>
              <ul className="landing-footer-links">
                <li><a onClick={() => navigate('/estate/applications')}>26 Core Applications</a></li>
                <li><a onClick={() => navigate('/resources/directory')}>Resource CoE Directory</a></li>
                <li><a onClick={() => navigate('/customer/csat')}>Customer Connect & CSAT</a></li>
                <li><a onClick={() => navigate('/innovation/automation')}>AI & RPA Automation</a></li>
              </ul>
            </div>

            <div className="landing-footer-col">
              <h5 className="landing-footer-heading">SOVEREIGN GOVERNANCE</h5>
              <p className="landing-footer-gov-text">
                Operating strictly in accordance with UAE SIA / NESA standards, ISO 27001, ISO 20000, and UAE Federal Tax Authority compliance directives.
              </p>
              <div className="landing-footer-loc">
                <Globe size={13} />
                <span>Abu Dhabi, United Arab Emirates</span>
              </div>
            </div>
          </div>

          <div className="landing-footer-bottom-bar">
            <span>© 2026 EDGE Group PJSC. All rights reserved. AdvantEDGE AMS Control Tower.</span>
            <span>Security Classification: OFFICIAL // RESTRICTED ACCESS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
