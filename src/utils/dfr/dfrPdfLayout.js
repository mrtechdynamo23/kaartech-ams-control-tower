/**
 * EDGE AMS Control Tower — DFR PDF 2-Page Landscape Layout Coordinator
 * Assembles Page 1 and Page 2 with deterministic geometry, zero clipping,
 * and exact visual parity with DFR Format(1).pdf.
 */

import {
  buildServiceRequestTable,
  buildIncidentTable,
  buildSlaAlertTable,
  buildBreachedTable,
  buildHoldTable,
  DFR_COLORS,
} from './dfrPdfTables.js';

import {
  renderDonutChart,
  renderDailyTrendChart,
  renderSlaTrendChart,
} from './dfrPdfCharts.js';

/**
 * Draw common outer page frame
 */
function drawPageBorder(doc) {
  doc.setDrawColor(DFR_COLORS.borderGrey[0], DFR_COLORS.borderGrey[1], DFR_COLORS.borderGrey[2]);
  doc.setLineWidth(0.3);
  // Landscape A4 outer frame: 277mm x 200mm, starting at (10, 5)
  doc.rect(10, 5, 277, 200);
}

/**
 * Render Page 1
 *  - DFR Header Banner
 *  - Service Requests 14-Col Table
 *  - Incidents 14-Col Table
 *  - Bottom Row: SR Status MTD, SR Trend, SLA Alert
 */
export function renderPage1(doc, snapshot) {
  drawPageBorder(doc);

  // 1. DFR Header Banner (Purple)
  const headerX = 14;
  const headerY = 6;
  const headerW = 269;
  const headerH = 7.2;

  doc.setFillColor(DFR_COLORS.purpleDark[0], DFR_COLORS.purpleDark[1], DFR_COLORS.purpleDark[2]);
  doc.rect(headerX, headerY, headerW, headerH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const titleText = `Daily Flash Report (DFR) of ${snapshot.compactDate}`;
  doc.text(titleText, headerX + headerW / 2, headerY + 5.1, { align: 'center' });

  // 2. Service Requests Table
  const srEndY = buildServiceRequestTable(doc, 13.5, snapshot);

  // 3. Incidents Table (immediately below SR table)
  const incEndY = buildIncidentTable(doc, srEndY, snapshot);

  // 4. Bottom Section: Charts & SLA Alert
  // Available vertical space: from incEndY + 2mm (~106mm) to 200mm
  const bottomY = Math.max(incEndY + 1.5, 108);
  const chartHeight = 91;

  // 4a. SR - Status MTD Donut (Left: x=14, w=64)
  const srDonutDataUrl = renderDonutChart(snapshot.srStatusDistribution, {
    title: 'SR - Status MTD',
    total: snapshot.srTotalMTD,
    widthMm: 64,
    heightMm: chartHeight,
  });
  doc.addImage(srDonutDataUrl, 'PNG', 14, bottomY, 64, chartHeight);

  // 4b. SR Trend Chart (Middle: x=80, w=131)
  const srTrendDataUrl = renderDailyTrendChart(snapshot.srTrendData, {
    title: 'SR Trend',
    widthMm: 131,
    heightMm: chartHeight,
  });
  doc.addImage(srTrendDataUrl, 'PNG', 80, bottomY, 131, chartHeight);

  // 4c. SLA Alert Table (Right: x=214, w=69)
  buildSlaAlertTable(doc, 214, bottomY, 69, snapshot.slaAlertTickets, 6);
}

/**
 * Render Page 2
 *  - Left Section (Operational Visualizations):
 *      - Incident - Status MTD Donut
 *      - Incident Trend Combination Chart
 *      - SR - SLA Trend Line Chart
 *      - Incident - SLA Trend Line Chart
 *  - Right Section (Exception Tables):
 *      - SLA Alert Continuation
 *      - Breached Tickets Table
 *      - Hold Tickets Table
 */
export function renderPage2(doc, snapshot) {
  doc.addPage('a4', 'landscape');
  drawPageBorder(doc);

  // ═══════════════════════════════════════════════════
  // LEFT COLUMN: OPERATIONAL CHARTS (x = 14mm, width = 180mm)
  // ═══════════════════════════════════════════════════
  const leftX = 14;
  const row1Y = 7;
  const row1H = 94;

  // 1. Incident - Status MTD Donut (x=14, w=60)
  const incDonutDataUrl = renderDonutChart(snapshot.incidentStatusDistribution, {
    title: 'Incident - Status MTD',
    total: snapshot.incidentTotalMTD,
    widthMm: 60,
    heightMm: row1H,
  });
  doc.addImage(incDonutDataUrl, 'PNG', leftX, row1Y, 60, row1H);

  // 2. Incident Trend Chart (x=76, w=118)
  const incTrendDataUrl = renderDailyTrendChart(snapshot.incidentTrendData, {
    title: 'Incident Trend',
    widthMm: 118,
    heightMm: row1H,
  });
  doc.addImage(incTrendDataUrl, 'PNG', 76, row1Y, 118, row1H);

  const row2Y = 104;
  const row2H = 95;

  // 3. SR - SLA Trend (x=14, w=88)
  const srSlaDataUrl = renderSlaTrendChart(snapshot.srSlaTrend, {
    title: 'SR - SLA Trend',
    widthMm: 88,
    heightMm: row2H,
  });
  doc.addImage(srSlaDataUrl, 'PNG', leftX, row2Y, 88, row2H);

  // 4. Incident - SLA Trend (x=106, w=88)
  const incSlaDataUrl = renderSlaTrendChart(snapshot.incidentSlaTrend, {
    title: 'Incident - SLA Trend',
    widthMm: 88,
    heightMm: row2H,
  });
  doc.addImage(incSlaDataUrl, 'PNG', 106, row2Y, 88, row2H);

  // ═══════════════════════════════════════════════════
  // RIGHT COLUMN: EXCEPTION TABLES (x = 198mm, width = 85mm)
  // ═══════════════════════════════════════════════════
  const rightX = 198;
  const rightW = 85;

  // 5. SLA Alert Continuation / Active Alerts
  const slaEndY = buildSlaAlertTable(doc, rightX, 7, rightW, snapshot.slaAlertTickets, 4);

  // 6. Breached Tickets Table
  const breachStartY = slaEndY + 3;
  const breachEndY = buildBreachedTable(doc, rightX, breachStartY, rightW, snapshot.breachedTickets, 7);

  // 7. Hold Tickets Table
  const holdStartY = breachEndY + 3;
  buildHoldTable(doc, rightX, holdStartY, rightW, snapshot.holdTickets, 9);
}
