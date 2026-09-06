/**
 * EDGE AMS Control Tower — Dedicated PDF-Safe High-Resolution Chart Renderer
 * Renders deterministic, crystal-clear 300-DPI charts onto an offscreen canvas
 * and returns PNG Data URLs for lossless embedding into jsPDF.
 * 
 * Includes:
 *  1. Donut Charts (SR - Status MTD, Incident - Status MTD)
 *  2. Combination Trend Charts (SR Trend, Incident Trend)
 *  3. SLA Compliance Charts (SR - SLA Trend, Incident - SLA Trend)
 */

/**
 * Creates an offscreen high-DPI canvas
 */
function createHiDPICanvas(widthMm, heightMm, scale = 3) {
  if (typeof document === 'undefined') {
    // Return mock for Node.js environment
    return {
      canvas: {
        toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
      ctx: new Proxy({}, {
        get: (target, prop) => {
          if (prop === 'measureText') {
            return (text) => ({ width: (text || '').length * 1.5 });
          }
          return () => {};
        },
      }),
      widthMm,
      heightMm,
    };
  }

  // 1 mm ≈ 3.7795 px at 96 DPI. With scale=3, this is ~288 DPI.
  const pxPerMm = 3.78;
  const width = Math.round(widthMm * pxPerMm * scale);
  const height = Math.round(heightMm * pxPerMm * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale * pxPerMm, scale * pxPerMm);
  return { canvas, ctx, widthMm, heightMm };
}

// ═══════════════════════════════════════════════════
// 1. DONUT STATUS CHART
// ═══════════════════════════════════════════════════
export function renderDonutChart(items, options = {}) {
  const {
    title = 'Status MTD',
    total = 0,
    widthMm = 65,
    heightMm = 85,
  } = options;

  const { canvas, ctx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthMm, heightMm);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = 'bold 3.2mm sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 2, 4.5);

  // Donut geometry
  const centerX = widthMm * 0.35;
  const centerY = 24;
  const outerRadius = 15;
  const innerRadius = 9;

  // Filter items with non-zero values or calculate angles
  const totalVal = items.reduce((acc, it) => acc + (it.value || 0), 0) || total || 1;
  let startAngle = -Math.PI / 2;

  // Draw slices
  items.forEach((item) => {
    const sliceAngle = ((item.value || 0) / totalVal) * (2 * Math.PI);
    if (sliceAngle > 0.001) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color || '#CBD5E1';
      ctx.fill();
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      startAngle += sliceAngle;
    }
  });

  // If all values are 0, draw placeholder circle
  if (items.every(it => !it.value)) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
  }

  // Center text (Total Count)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 3.5mm sans-serif';
  ctx.fillText(String(total || totalVal), centerX, centerY + 0.8);

  ctx.fillStyle = '#64748B';
  ctx.font = '1.8mm sans-serif';
  ctx.fillText('Total MTD', centerX, centerY + 3.2);

  // Right-side / Bottom Legend
  let legendY = 44;
  const legendX = 3;

  ctx.textAlign = 'left';
  items.forEach((item) => {
    // Color dot
    ctx.fillStyle = item.color || '#94A3B8';
    ctx.fillRect(legendX, legendY - 1.8, 2.2, 2.2);

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = '2mm sans-serif';
    ctx.fillText(item.name, legendX + 3.5, legendY);

    // Value & Pct
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 2mm sans-serif';
    ctx.fillText(`${item.value} (${item.pct})`, widthMm - 3, legendY);
    ctx.textAlign = 'left';

    legendY += 4.5;
  });

  return canvas.toDataURL('image/png');
}

// ═══════════════════════════════════════════════════
// 2. COMBINATION TREND CHART (Lines + Bars)
// ═══════════════════════════════════════════════════
export function renderDailyTrendChart(trendData, options = {}) {
  const {
    title = 'Trend',
    widthMm = 135,
    heightMm = 85,
  } = options;

  const { canvas, ctx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthMm, heightMm);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = 'bold 3.2mm sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 3, 5);

  // Legend at top
  const legendItems = [
    { label: 'Total Created', color: '#7C3AED', type: 'line' },
    { label: 'Total Closed', color: '#0EA5E9', type: 'line' },
    { label: 'Support', color: '#F59E0B', type: 'bar' },
    { label: 'App', color: '#10B981', type: 'bar' },
    { label: 'Infra', color: '#6366F1', type: 'bar' },
  ];

  let legX = 32;
  const legY = 4.5;
  legendItems.forEach((leg) => {
    if (leg.type === 'line') {
      ctx.strokeStyle = leg.color;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(legX, legY - 0.8);
      ctx.lineTo(legX + 3.5, legY - 0.8);
      ctx.stroke();
      ctx.fillStyle = leg.color;
      ctx.beginPath();
      ctx.arc(legX + 1.75, legY - 0.8, 0.7, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = leg.color;
      ctx.fillRect(legX, legY - 2, 2.5, 2.2);
    }
    ctx.fillStyle = '#475569';
    ctx.font = '1.9mm sans-serif';
    ctx.fillText(leg.label, legX + 4.2, legY);
    legX += ctx.measureText(leg.label).width + 6;
  });

  // Plot Area
  const plotLeft = 10;
  const plotRight = widthMm - 6;
  const plotTop = 11;
  const plotBottom = heightMm - 10;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Find max value for Y scaling
  let maxVal = 10;
  trendData.forEach(d => {
    maxVal = Math.max(maxVal, d.created, d.closed, (d.support + d.app + d.infra) * 1.1);
  });
  // Round up to nice number
  maxVal = Math.ceil(maxVal / 10) * 10;
  if (maxVal < 20) maxVal = 20;

  // Grid Lines & Y Axis Ticks
  const ySteps = 4;
  ctx.textAlign = 'right';
  ctx.font = '1.8mm sans-serif';
  for (let s = 0; s <= ySteps; s++) {
    const val = Math.round((maxVal / ySteps) * s);
    const y = plotBottom - (s / ySteps) * plotHeight;

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(plotLeft, y);
    ctx.lineTo(plotRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.fillText(String(val), plotLeft - 1.5, y + 0.7);
  }

  // Bar / Column Geometry
  const n = trendData.length;
  const colGroupWidth = plotWidth / n;
  const barWidth = 4.2;

  // Draw Bars (Grouped / Stacked)
  trendData.forEach((d, idx) => {
    const groupCenterX = plotLeft + idx * colGroupWidth + colGroupWidth / 2;

    // Stacked bars: Support (bottom), App (middle), Infra (top)
    let curStackVal = 0;
    const stackItems = [
      { val: d.support, color: '#F59E0B' },
      { val: d.app, color: '#10B981' },
      { val: d.infra, color: '#6366F1' },
    ];

    stackItems.forEach(item => {
      if (item.val > 0) {
        const barH = (item.val / maxVal) * plotHeight;
        const barY = plotBottom - ((curStackVal + item.val) / maxVal) * plotHeight;
        ctx.fillStyle = item.color;
        ctx.fillRect(groupCenterX - barWidth / 2, barY, barWidth, barH);
        curStackVal += item.val;
      }
    });

    // X axis date label
    ctx.fillStyle = '#334155';
    ctx.font = '2mm sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.date, groupCenterX, plotBottom + 4.5);
  });

  // Helper to draw lines
  const drawLineSeries = (key, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.7;
    ctx.beginPath();

    const points = [];
    trendData.forEach((d, idx) => {
      const x = plotLeft + idx * colGroupWidth + colGroupWidth / 2;
      const y = plotBottom - (d[key] / maxVal) * plotHeight;
      points.push({ x, y, val: d[key] });
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw point dots and values
    points.forEach(p => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.5, 0, 2 * Math.PI);
      ctx.fill();

      // Number callout
      ctx.fillStyle = color;
      ctx.font = 'bold 2mm sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(p.val), p.x, p.y - 1.8);
    });
  };

  // Draw Total Created line (Purple)
  drawLineSeries('created', '#7C3AED');

  // Draw Total Closed line (Cyan)
  drawLineSeries('closed', '#0284C7');

  return canvas.toDataURL('image/png');
}

// ═══════════════════════════════════════════════════
// 3. SLA COMPLIANCE TREND CHART
// ═══════════════════════════════════════════════════
export function renderSlaTrendChart(slaData, options = {}) {
  const {
    title = 'SLA Trend',
    widthMm = 95,
    heightMm = 85,
  } = options;

  const { canvas, ctx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthMm, heightMm);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = 'bold 3.2mm sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 3, 5);

  // Legend at top
  const legendItems = [
    { label: 'Resolution Compliance', color: '#EA580C' },
    { label: 'Response Compliance', color: '#7C3AED' },
  ];

  let legX = 35;
  const legY = 4.5;
  legendItems.forEach((leg) => {
    ctx.strokeStyle = leg.color;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(legX, legY - 0.8);
    ctx.lineTo(legX + 3.5, legY - 0.8);
    ctx.stroke();
    ctx.fillStyle = leg.color;
    ctx.beginPath();
    ctx.arc(legX + 1.75, legY - 0.8, 0.8, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.font = '1.8mm sans-serif';
    ctx.fillText(leg.label, legX + 4.5, legY);
    legX += ctx.measureText(leg.label).width + 6.5;
  });

  // Plot Area
  const plotLeft = 14;
  const plotRight = widthMm - 5;
  const plotTop = 11;
  const plotBottom = heightMm - 10;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Y-axis goes from 0% to 120% (per the reference PDF)
  const yLabels = ['0.0%', '20.0%', '40.0%', '60.0%', '80.0%', '100.0%', '120.0%'];
  const maxPct = 120;

  ctx.textAlign = 'right';
  ctx.font = '1.8mm sans-serif';
  yLabels.forEach((label, idx) => {
    const pctVal = idx * 20;
    const y = plotBottom - (pctVal / maxPct) * plotHeight;

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(plotLeft, y);
    ctx.lineTo(plotRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.fillText(label, plotLeft - 1.5, y + 0.7);
  });

  // X-axis points
  const n = slaData.length;
  const stepX = plotWidth / (n - 1 || 1);

  // Draw series
  const drawSlaLine = (key, color, isResolution) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.beginPath();

    const points = [];
    slaData.forEach((d, idx) => {
      const x = plotLeft + idx * stepX;
      const val = Math.min(100, Math.max(0, d[key]));
      const y = plotBottom - (val / maxPct) * plotHeight;
      points.push({ x, y, val });
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw dots and percentage labels
    points.forEach((p, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.5, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 1.8mm sans-serif';
      ctx.textAlign = 'center';
      const offset = isResolution ? -2.2 : 3.8;
      ctx.fillText(`${p.val.toFixed(1)}%`, p.x, p.y + offset);

      // Date label on X axis (draw only once)
      if (isResolution) {
        ctx.fillStyle = '#334155';
        ctx.font = '1.9mm sans-serif';
        ctx.fillText(slaData[idx].date, p.x, plotBottom + 4.5);
      }
    });
  };

  // Resolution Compliance (Orange)
  drawSlaLine('resolutionCompliance', '#EA580C', true);

  // Response Compliance (Purple)
  drawSlaLine('responseCompliance', '#7C3AED', false);

  return canvas.toDataURL('image/png');
}
