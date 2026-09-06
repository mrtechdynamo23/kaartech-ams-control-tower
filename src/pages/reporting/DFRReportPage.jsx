/**
 * EDGE AMS Control Tower — Daily Flash Report (DFR)
 * Route: /reporting/dfr
 * 
 * Production DFR Dashboard & PDF Export:
 *  - Shares unified DFR calculation engine (dfrReportData.js) with PDF export
 *  - Interactive dynamic date selector (defaults to reference date 2026-07-31)
 *  - 2-Page Landscape A4 PDF export matching DFR Format(1).pdf
 *  - Operational KPI cards, comparison matrices, charts, and exception queues
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Activity,
  Printer,
  Calendar,
  Layers,
  AlertCircle,
  PauseCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import KPICard from '../../components/common/KPICard';
import { useTheme } from '../../contexts/ThemeContext';
import { getDFRReportSnapshot } from '../../utils/dfr/dfrReportData';
import { exportDfrToPdf, generateDfrPdfDocument } from '../../utils/dfr/dfrPdfExporter';

export default function DFRReportPage() {
  const { isDark } = useTheme();
  // Target date for DFR (Default matches the contractual reference date: 2026-07-31)
  const [selectedDate, setSelectedDate] = useState('2026-07-31');
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'charts' | 'exceptions'

  // Single source of truth snapshot shared between dashboard and PDF
  const snapshot = useMemo(() => {
    return getDFRReportSnapshot(selectedDate);
  }, [selectedDate]);

  // Expose on window for programmatic verification and testing
  if (typeof window !== 'undefined') {
    window.__exportDfrToPdf = exportDfrToPdf;
    window.__generateDfrPdfDocument = () => generateDfrPdfDocument(snapshot);
    window.__getDFRReportSnapshot = getDFRReportSnapshot;
  }

  const showToast = (message, type = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const result = await exportDfrToPdf(snapshot);
      showToast(`DFR exported successfully: ${result.filename}`, 'success');
    } catch (err) {
      console.error('DFR Export Error:', err);
      showToast(`Export failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sr = snapshot.serviceRequests;
  const inc = snapshot.incidents;

  return (
    <div className="dfr-report-page animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Daily Flash Report (DFR)</h1>
            <span className="badge badge-primary">24h Executive Pulse</span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0' }}>
            Standardized daily operational snapshot for EDGE Group IT Leadership and Steering Committee.
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
            <Calendar size={15} style={{ color: 'var(--edge-primary)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Reporting Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          <button
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Browser Print Preview"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={15} />
            <span>Print</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={handleExportPdf}
            disabled={isExporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '160px',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Exporting DFR...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Export DFR (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          title="On Date Inflow & Closed"
          value={`${inc.onDate.closed.total} Inc / ${sr.onDate.closed.total} SR`}
          subtitle={`Report Date: ${snapshot.formattedDate}`}
          icon={Activity}
        />
        <KPICard
          title={`MTD Closed (${snapshot.currentMonthLabel})`}
          value={`${inc.currentMonth.closed.total + sr.currentMonth.closed.total} Closed`}
          status="success"
          subtitle={`SR: ${sr.currentMonth.closed.total} · Inc: ${inc.currentMonth.closed.total}`}
          icon={CheckCircle2}
        />
        <KPICard
          title="SLA Compliance Rate"
          value={`${inc.currentMonth.resolutionSlaPct.total} Res / ${inc.currentMonth.responseSlaPct.total} Resp`}
          status="success"
          subtitle="Contractual Target: 95.0%"
          icon={ShieldCheck}
        />
        <KPICard
          title="Active Exception Queue"
          value={`${snapshot.slaAlertTickets.length} Alert / ${snapshot.breachedTickets.length} Breach`}
          status={snapshot.breachedTickets.length > 0 ? 'warning' : 'success'}
          subtitle={`${snapshot.holdTickets.length} tickets on stop-clock hold`}
          icon={AlertTriangle}
        />
      </div>

      {/* Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-secondary)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'summary' ? '2px solid var(--edge-primary)' : '2px solid transparent',
            color: activeTab === 'summary' ? 'var(--edge-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'summary' ? 700 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Layers size={16} />
          <span>Operational Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('exceptions')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'exceptions' ? '2px solid var(--edge-primary)' : '2px solid transparent',
            color: activeTab === 'exceptions' ? 'var(--edge-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'exceptions' ? 700 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>Exception Queues ({snapshot.slaAlertTickets.length + snapshot.breachedTickets.length + snapshot.holdTickets.length})</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONAL COMPARISON MATRIX */}
      {activeTab === 'summary' && (
        <div className="chart-card" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Daily Flash Report (DFR) of {snapshot.compactDate}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Operational Comparison: On Date ({snapshot.compactDate}), Current Month ({snapshot.currentMonthLabel}), and Previous Month ({snapshot.prevMonthLabel})
              </p>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: 'var(--text-xs)' }}>
              Operational Comparison Matrix
            </span>
          </div>

          {/* Service Requests Table */}
          {(() => {
            const renderTable = (sectionTitle, rows) => {
              const th1Bg = isDark ? '#4B185A' : '#F1F5F9';
              const th1Color = isDark ? '#FFFFFF' : '#0F172A';
              const th1Border = isDark ? 'rgba(255, 255, 255, 0.2)' : '#CBD5E1';

              const th2Bg = isDark ? '#3A1950' : '#F8FAFC';
              const th2Color = isDark ? '#E2E8F0' : '#475569';
              const th2TotalBg = isDark ? '#4D1C66' : '#EEF2F6';
              const th2TotalColor = isDark ? '#FFFFFF' : '#0F172A';

              const cellBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
              const periodBorder = isDark ? '2px solid rgba(255, 255, 255, 0.25)' : '2px solid #CBD5E1';
              const totalColBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC';
              const totalColColor = isDark ? '#FFFFFF' : '#0F172A';

              const formatCell = (val, isTotalCol, isFail, isPct) => {
                if (isPct) {
                  if (val === '-' || !val) {
                    return <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : '#94A3B8' }}>—</span>;
                  }
                  const num = parseFloat(val);
                  const isGood = !isNaN(num) && num >= 95;
                  return (
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: '42px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isGood
                          ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7')
                          : (isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2'),
                        color: isGood
                          ? (isDark ? '#34D399' : '#15803D')
                          : (isDark ? '#F87171' : '#B91C1C'),
                        fontWeight: 700,
                        fontSize: '10.5px',
                      }}
                    >
                      {val}
                    </span>
                  );
                }

                if (val === 0 || val === '0') {
                  return <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : '#94A3B8' }}>0</span>;
                }

                if (isFail && val > 0) {
                  return <span style={{ color: '#DC2626', fontWeight: 700 }}>{val}</span>;
                }

                if (isTotalCol) {
                  return <span style={{ fontWeight: 700, color: totalColColor }}>{val}</span>;
                }

                return <span>{val}</span>;
              };

              return (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--edge-primary)', marginBottom: '10px' }}>
                    {sectionTitle}
                  </h4>
                  <div
                    style={{
                      border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #CBD5E1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: isDark ? 'var(--bg-card)' : '#FFFFFF',
                      boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'center' }}>
                      <thead>
                        {/* Header Row 1 */}
                        <tr style={{ background: th1Bg, color: th1Color }}>
                          <th
                            rowSpan={2}
                            style={{
                              padding: '10px 14px',
                              textAlign: 'left',
                              minWidth: '160px',
                              borderRight: periodBorder,
                              borderBottom: `1px solid ${th1Border}`,
                              fontWeight: 700,
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            Category / Status
                          </th>
                          <th
                            colSpan={4}
                            style={{
                              padding: '9px 12px',
                              borderRight: periodBorder,
                              borderBottom: `1px solid ${th1Border}`,
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            On Date {snapshot.compactDate}
                          </th>
                          <th
                            colSpan={4}
                            style={{
                              padding: '9px 12px',
                              borderRight: periodBorder,
                              borderBottom: `1px solid ${th1Border}`,
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            For the Month of {snapshot.currentMonthLabel}
                          </th>
                          <th
                            colSpan={4}
                            style={{
                              padding: '9px 12px',
                              borderBottom: `1px solid ${th1Border}`,
                              fontWeight: 700,
                              fontSize: '11px',
                            }}
                          >
                            For the Month of {snapshot.prevMonthLabel}
                          </th>
                        </tr>
                        {/* Header Row 2 */}
                        <tr style={{ background: th2Bg, color: th2Color, fontSize: '10px' }}>
                          {/* Period 1 Subheaders */}
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Support</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Infra</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>App</th>
                          <th style={{ padding: '7px 4px', borderRight: periodBorder, borderBottom: periodBorder, background: th2TotalBg, color: th2TotalColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</th>

                          {/* Period 2 Subheaders */}
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Support</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Infra</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>App</th>
                          <th style={{ padding: '7px 4px', borderRight: periodBorder, borderBottom: periodBorder, background: th2TotalBg, color: th2TotalColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</th>

                          {/* Period 3 Subheaders */}
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Support</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Infra</th>
                          <th style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}`, borderBottom: periodBorder, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>App</th>
                          <th style={{ padding: '7px 4px', borderBottom: periodBorder, background: th2TotalBg, color: th2TotalColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, idx) => {
                          const rowBg = row.isTotal
                            ? (isDark ? 'rgba(235, 94, 40, 0.12)' : '#FEF3C7')
                            : row.isPct
                            ? (isDark ? 'rgba(16, 185, 129, 0.04)' : 'rgba(240, 253, 244, 0.5)')
                            : (idx % 2 === 1
                              ? (isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(248, 250, 252, 0.7)')
                              : 'transparent');

                          const rowBorder = row.isTotal
                            ? (isDark ? '2px solid rgba(235, 94, 40, 0.4)' : '2px solid #F59E0B')
                            : `1px solid ${cellBorder}`;

                          return (
                            <tr
                              key={idx}
                              style={{
                                background: rowBg,
                                borderBottom: rowBorder,
                                fontWeight: row.isTotal ? 700 : 400,
                              }}
                            >
                              <td
                                style={{
                                  textAlign: 'left',
                                  padding: '7px 14px',
                                  color: row.isTotal
                                    ? (isDark ? 'var(--edge-primary)' : '#92400E')
                                    : 'var(--text-primary)',
                                  fontWeight: row.isTotal ? 800 : 600,
                                  borderRight: periodBorder,
                                }}
                              >
                                {row.label}
                              </td>

                              {/* Period 1: On Date */}
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.d.support, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.d.infra, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.d.app, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: periodBorder, background: totalColBg }}>{formatCell(row.d.total, true, row.isFail, row.isPct)}</td>

                              {/* Period 2: Current Month */}
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.c.support, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.c.infra, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.c.app, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: periodBorder, background: totalColBg }}>{formatCell(row.c.total, true, row.isFail, row.isPct)}</td>

                              {/* Period 3: Previous Month */}
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.p.support, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.p.infra, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', borderRight: `1px solid ${cellBorder}` }}>{formatCell(row.p.app, false, row.isFail, row.isPct)}</td>
                              <td style={{ padding: '7px 4px', background: totalColBg }}>{formatCell(row.p.total, true, row.isFail, row.isPct)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            };

            const srRows = [
              { label: 'In Approval', d: sr.onDate.inApproval, c: sr.currentMonth.inApproval, p: sr.previousMonth.inApproval },
              { label: 'New/Open', d: sr.onDate.newOpen, c: sr.currentMonth.newOpen, p: sr.previousMonth.newOpen },
              { label: 'In Progress', d: sr.onDate.inProgress, c: sr.currentMonth.inProgress, p: sr.previousMonth.inProgress },
              { label: 'New/In Progress', d: sr.onDate.newInProgress, c: sr.currentMonth.newInProgress, p: sr.previousMonth.newInProgress },
              { label: 'Awaiting Info/Hold', d: sr.onDate.awaitingInfoHold, c: sr.currentMonth.awaitingInfoHold, p: sr.previousMonth.awaitingInfoHold },
              { label: 'Rejected', d: sr.onDate.rejected, c: sr.currentMonth.rejected, p: sr.previousMonth.rejected },
              { label: 'Closed', d: sr.onDate.closed, c: sr.currentMonth.closed, p: sr.previousMonth.closed },
              { label: 'Total', d: sr.onDate.total, c: sr.currentMonth.total, p: sr.previousMonth.total, isTotal: true },
              { label: 'Response SLA Achieved', d: sr.onDate.responseAchieved, c: sr.currentMonth.responseAchieved, p: sr.previousMonth.responseAchieved },
              { label: 'Response (Fail)', d: sr.onDate.responseFail, c: sr.currentMonth.responseFail, p: sr.previousMonth.responseFail, isFail: true },
              { label: 'Resolution SLA Achieved', d: sr.onDate.resolutionAchieved, c: sr.currentMonth.resolutionAchieved, p: sr.previousMonth.resolutionAchieved },
              { label: 'Resolution (Fail)', d: sr.onDate.resolutionFail, c: sr.currentMonth.resolutionFail, p: sr.previousMonth.resolutionFail, isFail: true },
              { label: 'Response SLA Achieved %', d: sr.onDate.responseSlaPct, c: sr.currentMonth.responseSlaPct, p: sr.previousMonth.responseSlaPct, isPct: true },
              { label: 'Resolution SLA Achieved %', d: sr.onDate.resolutionSlaPct, c: sr.currentMonth.resolutionSlaPct, p: sr.previousMonth.resolutionSlaPct, isPct: true },
            ];

            const incRows = [
              { label: 'New/Open', d: inc.onDate.newOpen, c: inc.currentMonth.newOpen, p: inc.previousMonth.newOpen },
              { label: 'In Progress', d: inc.onDate.inProgress, c: inc.currentMonth.inProgress, p: inc.previousMonth.inProgress },
              { label: 'New/In Progress', d: inc.onDate.newInProgress, c: inc.currentMonth.newInProgress, p: inc.previousMonth.newInProgress },
              { label: 'Awaiting Info/Hold', d: inc.onDate.awaitingInfoHold, c: inc.currentMonth.awaitingInfoHold, p: inc.previousMonth.awaitingInfoHold },
              { label: 'Closed', d: inc.onDate.closed, c: inc.currentMonth.closed, p: inc.previousMonth.closed },
              { label: 'Total', d: inc.onDate.total, c: inc.currentMonth.total, p: inc.previousMonth.total, isTotal: true },
              { label: 'Response SLA Achieved', d: inc.onDate.responseAchieved, c: inc.currentMonth.responseAchieved, p: inc.previousMonth.responseAchieved },
              { label: 'Response (Fail)', d: inc.onDate.responseFail, c: inc.currentMonth.responseFail, p: inc.previousMonth.responseFail, isFail: true },
              { label: 'Resolution SLA Achieved', d: inc.onDate.resolutionAchieved, c: inc.currentMonth.resolutionAchieved, p: inc.previousMonth.resolutionAchieved },
              { label: 'Resolution (Fail)', d: inc.onDate.resolutionFail, c: inc.currentMonth.resolutionFail, p: inc.previousMonth.resolutionFail, isFail: true },
              { label: 'Response SLA Achieved %', d: inc.onDate.responseSlaPct, c: inc.currentMonth.responseSlaPct, p: inc.previousMonth.responseSlaPct, isPct: true },
              { label: 'Resolution SLA Achieved %', d: inc.onDate.resolutionSlaPct, c: inc.currentMonth.resolutionSlaPct, p: inc.previousMonth.resolutionSlaPct, isPct: true },
            ];

            return (
              <>
                {renderTable(`1. Service Requests as on ${snapshot.formattedDate}`, srRows)}
                {renderTable(`2. Incidents as of ${snapshot.formattedDate}`, incRows)}
              </>
            );
          })()}
        </div>
      )}

      {/* TAB 2: EXCEPTION QUEUES */}
      {activeTab === 'exceptions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* SLA Alerts */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '10px' }}>
              <Clock size={18} style={{ color: '#D97706' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, color: '#D97706' }}>
                SLA Alert Queue ({snapshot.slaAlertTickets.length})
              </h3>
            </div>
            <table className="data-table" style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#D97706', color: '#FFFFFF' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Ticket No</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Assigned To</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Time Left</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.slaAlertTickets.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: 'var(--edge-primary)' }}>{t.ticketNo}</td>
                    <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{t.assignedTo}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: t.timeLeftHrs < 5 ? 'var(--color-crimson)' : 'var(--text-primary)' }}>
                      {t.timeLeftHrs.toFixed(1)} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Breached Tickets */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '10px' }}>
              <AlertTriangle size={18} style={{ color: '#DC2626' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, color: '#DC2626' }}>
                Breached Tickets ({snapshot.breachedTickets.length})
              </h3>
            </div>
            {snapshot.breachedTickets.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No breached tickets
              </div>
            ) : (
              <table className="data-table" style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#DC2626', color: '#FFFFFF' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Ticket No</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Assigned To</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Extra Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.breachedTickets.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '8px', fontWeight: 600, color: 'var(--edge-primary)' }}>{t.ticketNo}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{t.assignedTo}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                        +{t.extraHours.toFixed(2)} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Hold Tickets */}
          <div className="chart-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '10px' }}>
              <PauseCircle size={18} style={{ color: '#B45309' }} />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, color: '#B45309' }}>
                Hold / Stop-Clock Tickets ({snapshot.holdTickets.length})
              </h3>
            </div>
            {snapshot.holdTickets.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No tickets currently on hold
              </div>
            ) : (
              <table className="data-table" style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#B45309', color: '#FFFFFF' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Ticket No</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Resource / Name</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Hold Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.holdTickets.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <td style={{ padding: '8px', fontWeight: 600, color: 'var(--edge-primary)' }}>{t.ticketNo}</td>
                      <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{t.name}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#B45309' }}>
                        {t.holdHours.toFixed(2)} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div
            className="toast animate-slide-in"
            style={{
              borderColor: toast.type === 'success' ? 'var(--color-emerald)' : 'var(--color-crimson)',
              background: 'var(--bg-card)',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} style={{ color: 'var(--color-emerald)', flexShrink: 0 }} />
            ) : (
              <AlertTriangle size={18} style={{ color: 'var(--color-crimson)', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
