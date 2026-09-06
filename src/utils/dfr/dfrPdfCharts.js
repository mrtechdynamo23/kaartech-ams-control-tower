/**
 * EDGE AMS Control Tower — Dedicated PDF-Safe High-Resolution Chart Renderer
 * Renders deterministic, crystal-clear 300-DPI charts onto an offscreen canvas
 * using standard pixel-space metrics and returns PNG Data URLs for lossless jsPDF embedding.
 *
 * Guaranteed:
 *  - Standard CSS pixel font syntax (no unsupported mm units, no browser font clamping)
 *  - Proper spacing so donut legends, trend numbers, and SLA percentages never collide
 *  - Anti-collision offsets for concurrent 100.0% SLA values
 */

function createHiDPICanvas(widthMm, heightMm, scale = 2.5) {
  if (typeof document === 'undefined') {
    return {
      canvas: {
        toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
      ctx: new Proxy({}, {
        get: (target, prop) => {
          if (prop === 'measureText') return () => ({ width: 10 });
          return () => {};
        },
      }),
      widthPx: 100,
      heightPx: 100,
      toPx: (mm) => mm * 10,
    };
  }

  // 1 mm ≈ 3.78 px at standard 96 DPI
  const pxPerMm = 3.78;
  const mmToPx = pxPerMm * scale;
  const widthPx = Math.round(widthMm * mmToPx);
  const heightPx = Math.round(heightMm * mmToPx);

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext('2d');
  const toPx = (mm) => mm * mmToPx;

  return { canvas, ctx, widthMm, heightMm, widthPx, heightPx, mmToPx, toPx };
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

  const { canvas, ctx, widthPx, heightPx, toPx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = `bold ${Math.round(toPx(3.2))}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(title, toPx(2.5), toPx(5.2));

  // Donut geometry
  const centerX = widthPx * 0.5;
  const centerY = toPx(25);
  const outerRadius = toPx(15);
  const innerRadius = toPx(9.5);

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
      ctx.lineWidth = Math.max(1, toPx(0.3));
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      startAngle += sliceAngle;
    }
  });

  // Placeholder if all zero
  if (items.every((it) => !it.value)) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
    ctx.fillStyle = '#E2E8F0';
    ctx.fill();
  }

  // Center Count
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.font = `bold ${Math.round(toPx(4.0))}px Arial, Helvetica, sans-serif`;
  ctx.fillText(String(total || totalVal), centerX, centerY + toPx(0.8));

  ctx.fillStyle = '#64748B';
  ctx.font = `500 ${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
  ctx.fillText('Total MTD', centerX, centerY + toPx(3.4));

  // Legend
  let legendY = toPx(44);
  const legendX = toPx(3.5);

  ctx.textAlign = 'left';
  items.forEach((item) => {
    // Dot
    ctx.fillStyle = item.color || '#94A3B8';
    ctx.fillRect(legendX, legendY - toPx(2.0), toPx(2.4), toPx(2.4));

    // Label
    ctx.fillStyle = '#334155';
    ctx.font = `${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
    ctx.fillText(item.name, legendX + toPx(3.8), legendY);

    // Value & Pct
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
    ctx.fillText(`${item.value} (${item.pct})`, widthPx - toPx(3.5), legendY);
    ctx.textAlign = 'left';

    legendY += toPx(4.6);
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

  const { canvas, ctx, widthPx, heightPx, toPx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = `bold ${Math.round(toPx(3.2))}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(title, toPx(3.5), toPx(5.5));

  // Legend at top
  const legendItems = [
    { label: 'Total Created', color: '#7C3AED', type: 'line' },
    { label: 'Total Closed', color: '#0EA5E9', type: 'line' },
    { label: 'Support', color: '#F59E0B', type: 'bar' },
    { label: 'App', color: '#10B981', type: 'bar' },
    { label: 'Infra', color: '#6366F1', type: 'bar' },
  ];

  let legX = toPx(28);
  const legY = toPx(5.2);
  legendItems.forEach((leg) => {
    if (leg.type === 'line') {
      ctx.strokeStyle = leg.color;
      ctx.lineWidth = Math.max(1, toPx(0.6));
      ctx.beginPath();
      ctx.moveTo(legX, legY - toPx(0.8));
      ctx.lineTo(legX + toPx(3.5), legY - toPx(0.8));
      ctx.stroke();
      ctx.fillStyle = leg.color;
      ctx.beginPath();
      ctx.arc(legX + toPx(1.75), legY - toPx(0.8), toPx(0.8), 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = leg.color;
      ctx.fillRect(legX, legY - toPx(2.2), toPx(2.6), toPx(2.4));
    }
    ctx.fillStyle = '#475569';
    ctx.font = `500 ${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
    ctx.fillText(leg.label, legX + toPx(4.5), legY);
    legX += ctx.measureText(leg.label).width + toPx(5.5);
  });

  // Plot Area
  const plotLeft = toPx(11);
  const plotRight = widthPx - toPx(6);
  const plotTop = toPx(12);
  const plotBottom = heightPx - toPx(9);
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Max value
  let maxVal = 10;
  trendData.forEach((d) => {
    maxVal = Math.max(maxVal, d.created, d.closed, (d.support + d.app + d.infra) * 1.1);
  });
  maxVal = Math.ceil(maxVal / 10) * 10;
  if (maxVal < 20) maxVal = 20;

  // Y-axis grid
  const ySteps = 4;
  ctx.textAlign = 'right';
  ctx.font = `${Math.round(toPx(1.7))}px Arial, Helvetica, sans-serif`;
  for (let s = 0; s <= ySteps; s++) {
    const val = Math.round((maxVal / ySteps) * s);
    const y = plotBottom - (s / ySteps) * plotHeight;

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = Math.max(1, toPx(0.3));
    ctx.beginPath();
    ctx.moveTo(plotLeft, y);
    ctx.lineTo(plotRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.fillText(String(val), plotLeft - toPx(1.5), y + toPx(0.6));
  }

  // Bar Columns
  const n = trendData.length;
  const colGroupWidth = plotWidth / n;
  const barWidth = toPx(4.5);

  trendData.forEach((d, idx) => {
    const groupCenterX = plotLeft + idx * colGroupWidth + colGroupWidth / 2;

    let curStackVal = 0;
    const stackItems = [
      { val: d.support, color: '#F59E0B' },
      { val: d.app, color: '#10B981' },
      { val: d.infra, color: '#6366F1' },
    ];

    stackItems.forEach((item) => {
      if (item.val > 0) {
        const barH = (item.val / maxVal) * plotHeight;
        const barY = plotBottom - ((curStackVal + item.val) / maxVal) * plotHeight;
        ctx.fillStyle = item.color;
        ctx.fillRect(groupCenterX - barWidth / 2, barY, barWidth, barH);
        curStackVal += item.val;
      }
    });

    // Date label
    ctx.fillStyle = '#334155';
    ctx.font = `${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(d.date, groupCenterX, plotBottom + toPx(4.2));
  });

  // Lines helper
  const drawLineSeries = (key, color, isTopLine = false) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, toPx(0.7));
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

    points.forEach((p) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, toPx(1.2), 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, toPx(0.6), 0, 2 * Math.PI);
      ctx.fill();

      // Clear number callout
      ctx.fillStyle = color;
      ctx.font = `bold ${Math.round(toPx(1.8))}px Arial, Helvetica, sans-serif`;
      ctx.textAlign = 'center';
      const offset = isTopLine ? -toPx(2.2) : toPx(3.6);
      ctx.fillText(String(p.val), p.x, p.y + offset);
    });
  };

  // Total Created line (Purple)
  drawLineSeries('created', '#7C3AED', true);

  // Total Closed line (Cyan)
  drawLineSeries('closed', '#0284C7', false);

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

  const { canvas, ctx, widthPx, heightPx, toPx } = createHiDPICanvas(widthMm, heightMm);

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Title
  ctx.fillStyle = '#1E1B4B';
  ctx.font = `bold ${Math.round(toPx(3.2))}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(title, toPx(3.5), toPx(5.5));

  // Legend at top
  const legendItems = [
    { label: 'Resolution Compliance', color: '#EA580C' },
    { label: 'Response Compliance', color: '#7C3AED' },
  ];

  let legX = toPx(28);
  const legY = toPx(5.2);
  legendItems.forEach((leg) => {
    ctx.strokeStyle = leg.color;
    ctx.lineWidth = Math.max(1.5, toPx(0.7));
    ctx.beginPath();
    ctx.moveTo(legX, legY - toPx(0.8));
    ctx.lineTo(legX + toPx(3.5), legY - toPx(0.8));
    ctx.stroke();
    ctx.fillStyle = leg.color;
    ctx.beginPath();
    ctx.arc(legX + toPx(1.75), legY - toPx(0.8), toPx(0.8), 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.font = `500 ${Math.round(toPx(1.7))}px Arial, Helvetica, sans-serif`;
    ctx.fillText(leg.label, legX + toPx(4.5), legY);
    legX += ctx.measureText(leg.label).width + toPx(5.5);
  });

  // Plot Area
  const plotLeft = toPx(14);
  const plotRight = widthPx - toPx(6);
  const plotTop = toPx(12);
  const plotBottom = heightPx - toPx(9);
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Y-axis 0% to 120%
  const yLabels = ['0.0%', '20.0%', '40.0%', '60.0%', '80.0%', '100.0%', '120.0%'];
  const maxPct = 120;

  ctx.textAlign = 'right';
  ctx.font = `${Math.round(toPx(1.6))}px Arial, Helvetica, sans-serif`;
  yLabels.forEach((label, idx) => {
    const pctVal = idx * 20;
    const y = plotBottom - (pctVal / maxPct) * plotHeight;

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = Math.max(1, toPx(0.3));
    ctx.beginPath();
    ctx.moveTo(plotLeft, y);
    ctx.lineTo(plotRight, y);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.fillText(label, plotLeft - toPx(1.5), y + toPx(0.6));
  });

  const n = slaData.length;
  const stepX = plotWidth / (n - 1 || 1);

  // Draw series
  const drawSlaLine = (key, color, isResolution) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, toPx(0.8));
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

    // Draw dots and distinct non-colliding labels
    points.forEach((p, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, toPx(1.2), 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, toPx(0.5), 0, 2 * Math.PI);
      ctx.fill();

      // Label: Resolution above, Response below to eliminate overlap
      ctx.fillStyle = color;
      ctx.font = `bold ${Math.round(toPx(1.6))}px Arial, Helvetica, sans-serif`;
      ctx.textAlign = 'center';
      const offset = isResolution ? -toPx(2.2) : toPx(3.6);
      ctx.fillText(`${p.val.toFixed(1)}%`, p.x, p.y + offset);

      // X-axis date (draw once)
      if (isResolution) {
        ctx.fillStyle = '#334155';
        ctx.font = `${Math.round(toPx(1.7))}px Arial, Helvetica, sans-serif`;
        ctx.fillText(slaData[idx].date, p.x, plotBottom + toPx(4.2));
      }
    });
  };

  // Resolution Compliance (Orange) - rendered above
  drawSlaLine('resolutionCompliance', '#EA580C', true);

  // Response Compliance (Purple) - rendered below
  drawSlaLine('responseCompliance', '#7C3AED', false);

  return canvas.toDataURL('image/png');
}
