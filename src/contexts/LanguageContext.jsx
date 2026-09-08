/**
 * EDGE AMS Control Tower — Language & i18n Context
 * Modular i18n with EN/AR, true RTL layout mirroring.
 * Namespaces per Section 85.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext(null);

// ── Modular i18n translations ──
const translations = {
  en: {
    common: {
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      add: 'Add',
      create: 'Create',
      submit: 'Submit',
      apply: 'Apply',
      clearAll: 'Clear All',
      loading: 'Loading...',
      noData: 'No data available',
      retry: 'Retry',
      actions: 'Actions',
      status: 'Status',
      priority: 'Priority',
      owner: 'Owner',
      date: 'Date',
      total: 'Total',
      open: 'Open',
      closed: 'Closed',
      pending: 'Pending',
      active: 'Active',
      inactive: 'Inactive',
      all: 'All',
      yes: 'Yes',
      no: 'No',
      showing: 'Showing',
      of: 'of',
      results: 'results',
      page: 'Page',
      rows: 'rows',
      columns: 'Columns',
      csvExport: 'CSV Export',
      pdfExport: 'PDF Export',
      demo: 'DEMO',
      simulated: 'SIMULATED',
      configurable: 'CONFIGURABLE',
    },
    auth: {
      signIn: 'Sign In',
      signOut: 'Sign Out',
      corporateId: 'Corporate ID / Email',
      password: 'Password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      authorizedOnly: 'AUTHORIZED USERS ONLY',
      amsEnvironment: 'AMS OPERATIONS ENVIRONMENT',
      invalidCredentials: 'Invalid credentials. Please try again.',
      signingIn: 'Signing in...',
    },
    landing: {
      title: 'KAARTECH AMS CONTROL TOWER',
      subtitle: 'One operational view across applications, services, people, and performance.',
      enterCta: 'ENTER CONTROL TOWER',
      viewIntegrated: 'View the integrated operational picture.',
      connectedLandscape: 'Connected AMS Landscape',
      capabilityDomains: 'Capability Domains',
      operationalEcosystem: 'Operational Ecosystem',
      people: 'People',
      applications: 'Applications',
      technology: 'Technology',
      services: 'Services',
      governance: 'Governance',
      executiveIntelligence: 'Executive Intelligence',
    },
    executiveBoard: {
      title: 'Executive Board',
      subtitle: 'Strategic operational overview',
      serviceHealth: 'Service Health',
      responseSla: 'Response SLA',
      resolutionSla: 'Resolution SLA',
      p1Incidents: 'P1 Incidents',
      p2Incidents: 'P2 Incidents',
      resourceCoverage: 'Resource Coverage',
      applicationHealth: 'Application Health',
      keyRisks: 'Key Risks',
      auditStatus: 'Audit Status',
      overdueCtas: 'Overdue CTAs',
      customerSatisfaction: 'Customer Satisfaction',
      licenseHealth: 'License Health',
      transitionProgress: 'Transition Progress',
      ticketVolume: 'Ticket Volume',
      serviceInnovation: 'Service Innovation',
    },
    calendar: {
      title: 'Global Calendar',
      subtitle: 'Operational timeline & governance control tower',
    },
    commandCenter: {
      title: 'Command Center',
      overview: 'Overview',
      incidents: 'Incidents',
      serviceRequests: 'Service Requests',
      enhancements: 'Enhancements',
      problems: 'Problem Management',
      slaAlerts: 'SLA Alerts',
      breachedTickets: 'Breached Tickets',
      holdTickets: 'Hold Tickets',
      createdVsClosed: 'Created vs Closed',
      ageingBuckets: 'Ageing Buckets',
      priorityDistribution: 'Priority Distribution',
    },
    governance: {
      title: 'Governance & Compliance',
      audits: 'Audit',
      risks: 'Risk Register',
      licenses: 'License & Entitlement Health',
      programs: 'Program Governance',
      transition: 'Transition & Readiness',
      actions: 'CTA / Action Hub',
      riskResponseCategory: 'Risk Response Category',
    },
    resource: {
      title: 'Resource & Capability',
      directory: 'Resource',
      organization: 'Organization Structure',
      time: 'Time Management',
      contact: 'Contact',
      skills: 'Skills & Knowledge',
      coverage: 'Onsite Coverage Compliance',
    },
    technology: {
      title: 'Application & Technology Estate',
      applications: 'Application Portfolio',
      applicationHealth: 'Application Health',
      landscape: 'Technology Landscape',
      dependencies: 'Integration & Dependencies',
      licenses: 'License & Entitlement',
      releases: 'Release / Change Health',
    },
    customerConnect: {
      title: 'Customer Connect',
      corner: 'Customer Corner',
      feedback: 'Customer Feedback / CSAT',
      actions: 'Open CTAs',
      issues: 'Customer Issues',
    },
    serviceOperation: {
      title: 'Service Operation',
      overview: 'Service Overview',
      knowledge: 'Knowledge',
      problemImprovement: 'RCA / Problem Improvement',
      continuity: 'Service Continuity',
      performance: 'Operational Performance',
    },
    serviceInnovation: {
      title: 'Service Innovation',
      ticketReduction: 'Ticket Reduction',
      automation: 'Automation',
      ai: 'AI Opportunities',
      userEnablement: 'User Enablement',
      continuousImprovement: 'Continuous Improvement',
    },
    reporting: {
      title: 'Reporting',
      dfr: 'Daily Flash Report',
      dsr: 'Daily Snapshot Report',
      wsr: 'Weekly Status Report',
      msr: 'Monthly Status Report',
      sla: 'SLA Report',
      executive: 'Executive Report',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No new notifications',
    },
  },
  ar: {
    common: {
      search: 'بحث',
      filter: 'تصفية',
      export: 'تصدير',
      save: 'حفظ',
      cancel: 'إلغاء',
      close: 'إغلاق',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      add: 'إضافة',
      create: 'إنشاء',
      submit: 'إرسال',
      apply: 'تطبيق',
      clearAll: 'مسح الكل',
      loading: 'جارِ التحميل...',
      noData: 'لا توجد بيانات',
      retry: 'إعادة المحاولة',
      actions: 'إجراءات',
      status: 'الحالة',
      priority: 'الأولوية',
      owner: 'المالك',
      date: 'التاريخ',
      total: 'الإجمالي',
      open: 'مفتوح',
      closed: 'مغلق',
      pending: 'معلق',
      active: 'نشط',
      inactive: 'غير نشط',
      all: 'الكل',
      yes: 'نعم',
      no: 'لا',
      showing: 'عرض',
      of: 'من',
      results: 'نتائج',
      page: 'صفحة',
      rows: 'صفوف',
      columns: 'أعمدة',
      csvExport: 'تصدير CSV',
      pdfExport: 'تصدير PDF',
      demo: 'تجريبي',
      simulated: 'محاكاة',
      configurable: 'قابل للتكوين',
    },
    auth: {
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      corporateId: 'المعرف المؤسسي / البريد الإلكتروني',
      password: 'كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      authorizedOnly: 'للمستخدمين المصرح لهم فقط',
      amsEnvironment: 'بيئة عمليات إدارة خدمات التطبيقات',
      invalidCredentials: 'بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.',
      signingIn: 'جارِ تسجيل الدخول...',
    },
    landing: {
      title: 'برج مراقبة KAARTECH AMS',
      subtitle: 'رؤية تشغيلية واحدة عبر التطبيقات والخدمات والأفراد والأداء.',
      enterCta: 'دخول برج المراقبة',
      viewIntegrated: 'عرض الصورة التشغيلية المتكاملة.',
      connectedLandscape: 'المشهد المتصل لإدارة خدمات التطبيقات',
      capabilityDomains: 'مجالات القدرات',
      operationalEcosystem: 'النظام البيئي التشغيلي',
      people: 'الأفراد',
      applications: 'التطبيقات',
      technology: 'التقنية',
      services: 'الخدمات',
      governance: 'الحوكمة',
      executiveIntelligence: 'الذكاء التنفيذي',
    },
    executiveBoard: {
      title: 'اللوحة التنفيذية',
      subtitle: 'نظرة عامة تشغيلية استراتيجية',
      serviceHealth: 'صحة الخدمة',
      responseSla: 'اتفاقية مستوى الاستجابة',
      resolutionSla: 'اتفاقية مستوى الحل',
      p1Incidents: 'حوادث P1',
      p2Incidents: 'حوادث P2',
      resourceCoverage: 'تغطية الموارد',
      applicationHealth: 'صحة التطبيقات',
      keyRisks: 'المخاطر الرئيسية',
      auditStatus: 'حالة التدقيق',
      overdueCtas: 'إجراءات متأخرة',
      customerSatisfaction: 'رضا العملاء',
      licenseHealth: 'صحة التراخيص',
      transitionProgress: 'تقدم الانتقال',
      ticketVolume: 'حجم التذاكر',
      serviceInnovation: 'ابتكار الخدمات',
    },
    calendar: {
      title: 'التقويم التشغيلي العام',
      subtitle: 'الجدول الزمني التشغيلي الشامل وبرج المراقبة',
    },
    commandCenter: {
      title: 'مركز القيادة',
      overview: 'نظرة عامة',
      incidents: 'الحوادث',
      serviceRequests: 'طلبات الخدمة',
      enhancements: 'التحسينات',
      problems: 'إدارة المشكلات',
      slaAlerts: 'تنبيهات اتفاقية مستوى الخدمة',
      breachedTickets: 'تذاكر منتهكة',
      holdTickets: 'تذاكر معلقة',
      createdVsClosed: 'المنشأة مقابل المغلقة',
      ageingBuckets: 'فترات التقادم',
      priorityDistribution: 'توزيع الأولويات',
    },
    governance: {
      title: 'الحوكمة والامتثال',
      audits: 'التدقيق',
      risks: 'سجل المخاطر',
      licenses: 'صحة التراخيص والاستحقاقات',
      programs: 'حوكمة البرنامج',
      transition: 'الانتقال والجاهزية',
      actions: 'مركز الإجراءات',
      riskResponseCategory: 'فئة الاستجابة للمخاطر',
    },
    resource: {
      title: 'الموارد والقدرات',
      directory: 'الموارد',
      organization: 'الهيكل التنظيمي',
      time: 'إدارة الوقت',
      contact: 'جهات الاتصال',
      skills: 'المهارات والمعرفة',
      coverage: 'امتثال التغطية الميدانية',
    },
    technology: {
      title: 'محفظة التطبيقات والتقنية',
      applications: 'محفظة التطبيقات',
      applicationHealth: 'صحة التطبيقات',
      landscape: 'المشهد التقني',
      dependencies: 'التكامل والتبعيات',
      licenses: 'التراخيص والاستحقاقات',
      releases: 'صحة الإصدارات والتغييرات',
    },
    customerConnect: {
      title: 'التواصل مع العملاء',
      corner: 'ركن العميل',
      feedback: 'ملاحظات العملاء / CSAT',
      actions: 'إجراءات مفتوحة',
      issues: 'مشكلات العملاء',
    },
    serviceOperation: {
      title: 'عمليات الخدمة',
      overview: 'نظرة عامة على الخدمة',
      knowledge: 'المعرفة',
      problemImprovement: 'تحسين المشكلات / RCA',
      continuity: 'استمرارية الخدمة',
      performance: 'الأداء التشغيلي',
    },
    serviceInnovation: {
      title: 'ابتكار الخدمات',
      ticketReduction: 'تقليل التذاكر',
      automation: 'الأتمتة',
      ai: 'فرص الذكاء الاصطناعي',
      userEnablement: 'تمكين المستخدمين',
      continuousImprovement: 'التحسين المستمر',
    },
    reporting: {
      title: 'التقارير',
      dfr: 'تقرير الومضة اليومي',
      dsr: 'تقرير اللقطة اليومية',
      wsr: 'تقرير الحالة الأسبوعي',
      msr: 'تقرير الحالة الشهري',
      sla: 'تقرير اتفاقية مستوى الخدمة',
      executive: 'التقرير التنفيذي',
    },
    notifications: {
      title: 'الإشعارات',
      markAllRead: 'تعليم الكل كمقروء',
      noNotifications: 'لا توجد إشعارات جديدة',
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem('edge-ams-language');
      if (stored === 'ar' || stored === 'en') return stored;
    } catch {}
    return 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    try { localStorage.setItem('edge-ams-language', language); } catch {}
  }, [language, dir]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'en' || lang === 'ar') setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  /**
   * Translation function.
   * Usage: t('auth.signIn') or t('common.search')
   */
  const t = useCallback((key) => {
    const parts = key.split('.');
    let value = translations[language];
    for (const part of parts) {
      value = value?.[part];
    }
    return value || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, dir, setLanguage, toggleLanguage, t, isRTL: dir === 'rtl' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useLanguageDirection() {
  const { dir, isRTL } = useLanguage();
  return { dir, isRTL };
}
