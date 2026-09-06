/**
 * EDGE AMS Control Tower — Production DFR PDF Exporter
 * Generates an executive-ready 2-page landscape A4 PDF matching DFR Format(1).pdf.
 */

import { jsPDF } from 'jspdf';
import { getDFRReportSnapshot } from './dfrReportData.js';
import { renderPage1, renderPage2 } from './dfrPdfLayout.js';

/**
 * Generate and download production DFR PDF
 * @param {string|Date|object} targetDateOrSnapshot - reporting date or precomputed snapshot
 * @returns {Promise<{ success: boolean, filename: string, pageCount: number }>}
 */
export async function exportDfrToPdf(targetDateOrSnapshot = '2026-07-31') {
  try {
    // 1. Resolve normalized report data snapshot
    const snapshot = (typeof targetDateOrSnapshot === 'object' && targetDateOrSnapshot.formattedDate)
      ? targetDateOrSnapshot
      : getDFRReportSnapshot(targetDateOrSnapshot);

    // 2. Instantiate jsPDF in A4 Landscape mode
    // Dimensions: 297mm x 210mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true,
    });

    // 3. Set standard document metadata
    doc.setProperties({
      title: `Daily Flash Report (DFR) - ${snapshot.formattedDate}`,
      subject: 'Daily Flash Report',
      author: 'EDGE AMS Control Tower',
      keywords: 'DFR, EDGE AMS, Daily Flash Report, Service Requests, Incidents, SLA',
      creator: 'EDGE AMS Control Tower PDF Engine',
    });

    // 4. Render Page 1 (Header, Comparison Tables, SR Donut, SR Trend, SLA Alert)
    renderPage1(doc, snapshot);

    // 5. Render Page 2 (Incident Donut & Trend, SLA Trends, Exception Queues)
    renderPage2(doc, snapshot);

    // 6. Filename following agreed naming convention
    const filename = `EDGE_AMS_DFR_${snapshot.formattedDate}.pdf`;

    // 7. Save / Trigger client download
    doc.save(filename);

    // 8. Dev environment sync to disk for inspection
    if (typeof fetch !== 'undefined') {
      try {
        const base64 = doc.output('datauristring').split(',')[1];
        fetch('/api/save-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, base64 }),
        }).catch(() => {});
      } catch (e) {
        // non-blocking
      }
    }

    return {
      success: true,
      filename,
      pageCount: doc.getNumberOfPages(),
      snapshot,
    };
  } catch (err) {
    console.error('Failed to export DFR PDF:', err);
    throw err;
  }
}

/**
 * Generate production DFR jsPDF document object
 */
export async function generateDfrPdfDocument(targetDateOrSnapshot = '2026-07-31') {
  const snapshot = (typeof targetDateOrSnapshot === 'object' && targetDateOrSnapshot.formattedDate)
    ? targetDateOrSnapshot
    : getDFRReportSnapshot(targetDateOrSnapshot);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });

  doc.setProperties({
    title: `Daily Flash Report (DFR) - ${snapshot.formattedDate}`,
    subject: 'Daily Flash Report',
    author: 'EDGE AMS Control Tower',
    keywords: 'DFR, EDGE AMS, Daily Flash Report, Service Requests, Incidents, SLA',
    creator: 'EDGE AMS Control Tower PDF Engine',
  });

  renderPage1(doc, snapshot);
  renderPage2(doc, snapshot);

  const filename = `EDGE_AMS_DFR_${snapshot.formattedDate}.pdf`;
  return { doc, filename, snapshot };
}
