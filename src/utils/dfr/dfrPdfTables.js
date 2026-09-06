/**
 * EDGE AMS Control Tower — DFR PDF AutoTable Definitions
 * Generates exact table hierarchy matching DFR Format(1).pdf:
 *  - Service Requests Comparison Table (14 columns, 3 periods)
 *  - Incidents Comparison Table (14 columns, 3 periods)
 *  - SLA Alert Table (amber header, urgency highlighting)
 *  - Breached Tickets Table (crimson header, empty state handling)
 *  - Hold Tickets Table (amber header, empty state handling)
 */

import autoTable from 'jspdf-autotable';

// Shared color palette matching reference report
export const DFR_COLORS = {
  purpleDark: [75, 24, 90],       // #4B185A (Category block / main banner)
  purpleHeader: [58, 25, 80],     // Column headers
  purpleSubhead: [233, 220, 240], // Light purple for subheaders
  purpleTotal: [221, 212, 230],   // Total row fill
  slaGreenBg: [235, 243, 236],    // Light green cell fill for SLA
  slaGreenText: [21, 128, 61],    // Green text for compliant SLA
  slaRedBg: [254, 226, 226],      // Red fill for breach
  slaRedText: [185, 28, 28],      // Red text
  slaAlertHeader: [217, 119, 6],  // Amber gold #D97706
  breachHeader: [185, 28, 28],    // Crimson red #B91C1C
  holdHeader: [180, 83, 9],       // Warm brown amber #B45309
  borderGrey: [148, 163, 184],    // Border lines
};

/**
 * Common column widths for the 14-column comparison tables (total width = 281mm)
 */
export const DFR_COL_STYLES_14 = {
  0: { cellWidth: 24, halign: 'center', valign: 'middle' }, // Category
  1: { cellWidth: 35, halign: 'left', fontStyle: 'bold' },   // Status
  // On Date
  2: { cellWidth: 17, halign: 'center' }, // Support
  3: { cellWidth: 15, halign: 'center' }, // Infra
  4: { cellWidth: 21, halign: 'center' }, // App
  5: { cellWidth: 17, halign: 'center', fontStyle: 'bold' }, // Total
  // Current Month
  6: { cellWidth: 17, halign: 'center' }, // Support
  7: { cellWidth: 15, halign: 'center' }, // Infra
  8: { cellWidth: 21, halign: 'center' }, // App
  9: { cellWidth: 17, halign: 'center', fontStyle: 'bold' }, // Total
  // Previous Month
  10: { cellWidth: 17, halign: 'center' }, // Support
  11: { cellWidth: 15, halign: 'center' }, // Infra
  12: { cellWidth: 21, halign: 'center' }, // App
  13: { cellWidth: 17, halign: 'center', fontStyle: 'bold' }, // Total
};

/**
 * 1. SERVICE REQUESTS TABLE
 */
export function buildServiceRequestTable(doc, startY, snapshot) {
  const sr = snapshot.serviceRequests;

  // Header Definition (2 rows)
  const head = [
    [
      { content: 'Category', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Status', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: `On Date ${snapshot.compactDate}`, colSpan: 4, styles: { halign: 'center' } },
      { content: `For the Month of ${snapshot.currentMonthLabel}`, colSpan: 4, styles: { halign: 'center' } },
      { content: `For the Month of ${snapshot.prevMonthLabel}`, colSpan: 4, styles: { halign: 'center' } },
    ],
    [
      { content: 'Support\nServices' }, { content: 'Infra' }, { content: 'Application' }, { content: 'Total' },
      { content: 'Support\nServices' }, { content: 'Infra' }, { content: 'Application' }, { content: 'Total' },
      { content: 'Support\nServices' }, { content: 'Infra' }, { content: 'Application' }, { content: 'Total' },
    ],
  ];

  // Row helper
  const makeRow = (label, onD, curM, prevM, isTotal = false, isSla = false) => {
    return [
      label,
      onD.support, onD.infra, onD.app, onD.total,
      curM.support, curM.infra, curM.app, curM.total,
      prevM.support, prevM.infra, prevM.app, prevM.total,
    ];
  };

  const bodyRows = [
    makeRow('In Approval', sr.onDate.inApproval, sr.currentMonth.inApproval, sr.previousMonth.inApproval),
    makeRow('New/Open', sr.onDate.newOpen, sr.currentMonth.newOpen, sr.previousMonth.newOpen),
    makeRow('In Progress', sr.onDate.inProgress, sr.currentMonth.inProgress, sr.previousMonth.inProgress),
    makeRow('New/In Progress', sr.onDate.newInProgress, sr.currentMonth.newInProgress, sr.previousMonth.newInProgress),
    makeRow('Awaiting Info/Hold', sr.onDate.awaitingInfoHold, sr.currentMonth.awaitingInfoHold, sr.previousMonth.awaitingInfoHold),
    makeRow('Rejected', sr.onDate.rejected, sr.currentMonth.rejected, sr.previousMonth.rejected),
    makeRow('Closed', sr.onDate.closed, sr.currentMonth.closed, sr.previousMonth.closed),
    makeRow('Total', sr.onDate.total, sr.currentMonth.total, sr.previousMonth.total, true),
    makeRow('Response SLA Achieved', sr.onDate.responseAchieved, sr.currentMonth.responseAchieved, sr.previousMonth.responseAchieved),
    makeRow('Response (Fail)', sr.onDate.responseFail, sr.currentMonth.responseFail, sr.previousMonth.responseFail),
    makeRow('Resolution SLA Achieved', sr.onDate.resolutionAchieved, sr.currentMonth.resolutionAchieved, sr.previousMonth.resolutionAchieved),
    makeRow('Resolution (Fail)', sr.onDate.resolutionFail, sr.currentMonth.resolutionFail, sr.previousMonth.resolutionFail),
    makeRow('Response SLA Achieved %', sr.onDate.responseSlaPct, sr.currentMonth.responseSlaPct, sr.previousMonth.responseSlaPct, false, true),
    makeRow('Resolution SLA Achieved %', sr.onDate.resolutionSlaPct, sr.currentMonth.resolutionSlaPct, sr.previousMonth.resolutionSlaPct, false, true),
  ];

  // Prepend Category merged cell to each row
  // Row 0 has rowSpan 14 covering all rows
  const formattedBody = bodyRows.map((row, idx) => {
    if (idx === 0) {
      return [
        {
          content: `Service\nRequests as\non ${snapshot.formattedDate}`,
          rowSpan: 14,
          styles: {
            fillColor: DFR_COLORS.purpleDark,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            fontSize: 7.5,
          },
        },
        ...row,
      ];
    }
    return row;
  });

  autoTable(doc, {
    startY,
    margin: { left: 14, right: 14 },
    tableWidth: 269,
    head,
    body: formattedBody,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 0.9,
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
      font: 'helvetica',
    },
    headStyles: {
      fillColor: DFR_COLORS.purpleDark,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      fontSize: 6.2,
    },
    columnStyles: DFR_COL_STYLES_14,
    didParseCell: (data) => {
      // Row 7 is "Total" (0-indexed)
      if (data.row.index === 7) {
        if (data.column.index > 0) {
          data.cell.styles.fillColor = DFR_COLORS.purpleTotal;
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
      // Rows 12 & 13 are SLA %
      if (data.row.index === 12 || data.row.index === 13) {
        if (data.column.index > 1) {
          data.cell.styles.fillColor = DFR_COLORS.slaGreenBg;
          data.cell.styles.fontStyle = 'bold';
          const val = String(data.cell.raw);
          if (val.includes('%')) {
            const num = parseFloat(val);
            if (num < 95) {
              data.cell.styles.textColor = DFR_COLORS.slaRedText;
              data.cell.styles.fillColor = DFR_COLORS.slaRedBg;
            } else {
              data.cell.styles.textColor = DFR_COLORS.slaGreenText;
            }
          }
        }
      }
      // Failure rows (9 & 11) with non-zero values highlight soft red
      if (data.row.index === 9 || data.row.index === 11) {
        if (data.column.index > 1 && parseInt(data.cell.raw, 10) > 0) {
          data.cell.styles.textColor = DFR_COLORS.slaRedText;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  return doc.lastAutoTable.finalY;
}

/**
 * 2. INCIDENTS TABLE
 */
export function buildIncidentTable(doc, startY, snapshot) {
  const inc = snapshot.incidents;

  const makeRow = (label, onD, curM, prevM) => {
    return [
      label,
      onD.support, onD.infra, onD.app, onD.total,
      curM.support, curM.infra, curM.app, curM.total,
      prevM.support, prevM.infra, prevM.app, prevM.total,
    ];
  };

  const bodyRows = [
    makeRow('New/Open', inc.onDate.newOpen, inc.currentMonth.newOpen, inc.previousMonth.newOpen),
    makeRow('In Progress', inc.onDate.inProgress, inc.currentMonth.inProgress, inc.previousMonth.inProgress),
    makeRow('New/In Progress', inc.onDate.newInProgress, inc.currentMonth.newInProgress, inc.previousMonth.newInProgress),
    makeRow('Awaiting Info/Hold', inc.onDate.awaitingInfoHold, inc.currentMonth.awaitingInfoHold, inc.previousMonth.awaitingInfoHold),
    makeRow('Closed', inc.onDate.closed, inc.currentMonth.closed, inc.previousMonth.closed),
    makeRow('Total', inc.onDate.total, inc.currentMonth.total, inc.previousMonth.total),
    makeRow('Response SLA Achieved', inc.onDate.responseAchieved, inc.currentMonth.responseAchieved, inc.previousMonth.responseAchieved),
    makeRow('Response (Fail)', inc.onDate.responseFail, inc.currentMonth.responseFail, inc.previousMonth.responseFail),
    makeRow('Resolution SLA Achieved', inc.onDate.resolutionAchieved, inc.currentMonth.resolutionAchieved, inc.previousMonth.resolutionAchieved),
    makeRow('Resolution (Fail)', inc.onDate.resolutionFail, inc.currentMonth.resolutionFail, inc.previousMonth.resolutionFail),
    makeRow('Response SLA Achieved %', inc.onDate.responseSlaPct, inc.currentMonth.responseSlaPct, inc.previousMonth.responseSlaPct),
    makeRow('Resolution SLA Achieved %', inc.onDate.resolutionSlaPct, inc.currentMonth.resolutionSlaPct, inc.previousMonth.resolutionSlaPct),
  ];

  const formattedBody = bodyRows.map((row, idx) => {
    if (idx === 0) {
      return [
        {
          content: `Incidents as\nof ${snapshot.formattedDate}`,
          rowSpan: 12,
          styles: {
            fillColor: DFR_COLORS.purpleDark,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            fontSize: 7.5,
          },
        },
        ...row,
      ];
    }
    return row;
  });

  autoTable(doc, {
    startY,
    margin: { left: 14, right: 14 },
    tableWidth: 269,
    body: formattedBody,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 0.9,
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
      font: 'helvetica',
    },
    columnStyles: DFR_COL_STYLES_14,
    didParseCell: (data) => {
      // Row 5 is "Total"
      if (data.row.index === 5) {
        if (data.column.index > 0) {
          data.cell.styles.fillColor = DFR_COLORS.purpleTotal;
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
      // Rows 10 & 11 are SLA %
      if (data.row.index === 10 || data.row.index === 11) {
        if (data.column.index > 1) {
          data.cell.styles.fillColor = DFR_COLORS.slaGreenBg;
          data.cell.styles.fontStyle = 'bold';
          const val = String(data.cell.raw);
          if (val.includes('%')) {
            const num = parseFloat(val);
            if (num < 95) {
              data.cell.styles.textColor = DFR_COLORS.slaRedText;
              data.cell.styles.fillColor = DFR_COLORS.slaRedBg;
            } else {
              data.cell.styles.textColor = DFR_COLORS.slaGreenText;
            }
          }
        }
      }
      // Failure rows (7 & 9)
      if (data.row.index === 7 || data.row.index === 9) {
        if (data.column.index > 1 && parseInt(data.cell.raw, 10) > 0) {
          data.cell.styles.textColor = DFR_COLORS.slaRedText;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  return doc.lastAutoTable.finalY;
}

/**
 * 3. SLA ALERT TABLE
 */
export function buildSlaAlertTable(doc, startX, startY, width, tickets, maxRows = 6) {
  const rows = (tickets || []).slice(0, maxRows).map(t => [
    t.ticketNo,
    t.assignedTo || 'Unassigned',
    t.timeLeftHrs != null ? t.timeLeftHrs.toFixed(1) : '-',
  ]);

  if (rows.length === 0) {
    rows.push([{ content: 'No tickets approaching breach', colSpan: 3, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }]);
  }

  autoTable(doc, {
    startY,
    margin: { left: startX },
    tableWidth: width,
    head: [
      [{ content: 'SLA Alert', colSpan: 3, styles: { halign: 'center', fillColor: DFR_COLORS.slaAlertHeader, textColor: [255, 255, 255], fontStyle: 'bold' } }],
      ['Ticket No', 'Assigned to', 'TimeLeft -\nHrs'],
    ],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 0.9,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [245, 158, 11],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 6.2,
    },
    columnStyles: {
      0: { cellWidth: width * 0.32, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: width * 0.46, halign: 'left' },
      2: { cellWidth: width * 0.22, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.row.section === 'body' && data.column.index === 2 && data.cell.raw !== '-') {
        const hrs = parseFloat(data.cell.raw);
        if (!isNaN(hrs) && hrs < 5.0) {
          data.cell.styles.textColor = DFR_COLORS.slaRedText;
          data.cell.styles.fillColor = DFR_COLORS.slaRedBg;
        }
      }
    },
  });

  return doc.lastAutoTable.finalY;
}

/**
 * 4. BREACHED TICKETS TABLE
 */
export function buildBreachedTable(doc, startX, startY, width, tickets, maxRows = 8) {
  const validTickets = tickets || [];
  const rows = validTickets.slice(0, maxRows).map(t => [
    t.ticketNo,
    t.assignedTo || '0',
    t.extraHours != null ? t.extraHours.toFixed(2) : '0.00',
  ]);

  if (rows.length === 0) {
    rows.push([{ content: 'No breached tickets', colSpan: 3, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }]);
  }

  autoTable(doc, {
    startY,
    margin: { left: startX },
    tableWidth: width,
    head: [
      [{ content: 'Breached Tickets', colSpan: 3, styles: { halign: 'center', fillColor: DFR_COLORS.breachHeader, textColor: [255, 255, 255], fontStyle: 'bold' } }],
      ['Ticket No', 'Assigned to', 'Extra\nHours'],
    ],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 0.9,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 6.2,
    },
    columnStyles: {
      0: { cellWidth: width * 0.32, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: width * 0.46, halign: 'left' },
      2: { cellWidth: width * 0.22, halign: 'right', fontStyle: 'bold', textColor: DFR_COLORS.slaRedText },
    },
  });

  return doc.lastAutoTable.finalY;
}

/**
 * 5. HOLD TICKETS TABLE
 */
export function buildHoldTable(doc, startX, startY, width, tickets, maxRows = 10) {
  const validTickets = tickets || [];
  const rows = validTickets.slice(0, maxRows).map(t => [
    t.ticketNo,
    t.name || t.assignedTo || '-',
    t.holdHours != null ? t.holdHours.toFixed(2) : '0.00',
  ]);

  if (rows.length === 0) {
    rows.push([{ content: 'No tickets currently on hold', colSpan: 3, styles: { halign: 'center', fontStyle: 'italic', textColor: [100, 116, 139] } }],);
  }

  autoTable(doc, {
    startY,
    margin: { left: startX },
    tableWidth: width,
    head: [
      [{ content: 'Hold tickets', colSpan: 3, styles: { halign: 'center', fillColor: DFR_COLORS.holdHeader, textColor: [255, 255, 255], fontStyle: 'bold' } }],
      ['Ticket No', 'Name', 'Hold\nHours'],
    ],
    body: rows,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 0.9,
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [217, 119, 6],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 6.2,
    },
    columnStyles: {
      0: { cellWidth: width * 0.32, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: width * 0.46, halign: 'left' },
      2: { cellWidth: width * 0.22, halign: 'right', fontStyle: 'bold', textColor: [180, 83, 9] },
    },
  });

  return doc.lastAutoTable.finalY;
}
