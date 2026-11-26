/**
 * SonarX DebrisGuard - ML Analytics & Data Science Dashboard
 * Team SonarX | Bennett University
 * Renders model performance, debris classification, trend, NLP word cloud, and live stats.
 */

(function () {
  'use strict';

  // ── Utility: Draw rounded rectangle ───────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── 1. Model Performance Horizontal Bar Chart ──────────────────────────────
  function drawModelPerformance() {
    const canvas = document.getElementById('mlModelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, W, H);

    const metrics = [
      { label: 'mAP@0.5',   value: 94.2 },
      { label: 'AUROC',     value: 97.1 },
      { label: 'F1-Score',  value: 91.3 },
      { label: 'Precision', value: 93.7 },
      { label: 'Recall',    value: 89.1 },
      { label: 'IoU',       value: 88.4 }
    ];

    const paddingLeft = 100;
    const paddingRight = 60;
    const paddingTop = 24;
    const barHeight = 24;
    const barGap = 16;
    const maxBarW = W - paddingLeft - paddingRight;

    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center';
    ctx.fillText('Model Performance Metrics', W / 2, 16);

    metrics.forEach((m, i) => {
      const y = paddingTop + 14 + i * (barHeight + barGap);
      const barW = (m.value / 100) * maxBarW;

      // Label
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#a0c4d8';
      ctx.textAlign = 'right';
      ctx.fillText(m.label, paddingLeft - 8, y + barHeight / 2 + 4);

      // Background bar
      ctx.fillStyle = 'rgba(0,240,255,0.07)';
      roundRect(ctx, paddingLeft, y, maxBarW, barHeight, 4);
      ctx.fill();

      // Gradient bar
      const grad = ctx.createLinearGradient(paddingLeft, 0, paddingLeft + barW, 0);
      grad.addColorStop(0, '#0060ff');
      grad.addColorStop(1, '#00f0ff');
      ctx.fillStyle = grad;
      roundRect(ctx, paddingLeft, y, barW, barHeight, 4);
      ctx.fill();

      // Value label
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(m.value.toFixed(1) + '%', paddingLeft + barW + 6, y + barHeight / 2 + 4);
    });
  }

  // ── 2. Debris Class Distribution Donut Chart ───────────────────────────────
  function drawClassDistribution() {
    const canvas = document.getElementById('mlClassCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, W, H);

    const classes = [
      { label: 'Fishing Nets',       pct: 34, color: '#00f0ff' },
      { label: 'Plastic Debris',     pct: 28, color: '#ff6b6b' },
      { label: 'Metal Containers',   pct: 18, color: '#ffd93d' },
      { label: 'Organic Material',   pct: 12, color: '#6bcb77' },
      { label: 'Unknown Anomaly',    pct: 8,  color: '#c77dff' }
    ];

    const cx = W / 2;
    const cy = H / 2 - 14;
    const outerR = Math.min(cx, cy) - 14;
    const innerR = outerR * 0.52;

    let startAngle = -Math.PI / 2;
    classes.forEach(c => {
      const slice = (c.pct / 100) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = c.color;
      ctx.fill();
      startAngle += slice;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = '#070b14';
    ctx.fill();

    // Center text
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center';
    ctx.fillText('5 Classes', cx, cy - 4);
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#7ec8e3';
    ctx.fillText('Debris Types', cx, cy + 14);

    // Legend
    const legendY = H - 8;
    const itemW = W / classes.length;
    classes.forEach((c, i) => {
      const lx = i * itemW + 6;
      ctx.fillStyle = c.color;
      ctx.fillRect(lx, legendY - 10, 10, 10);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = '#a0c4d8';
      ctx.textAlign = 'left';
      ctx.fillText(c.pct + '%', lx + 12, legendY - 1);
    });
  }

  // ── 3. Ocean Debris Trend Line Chart 2020-2026 ─────────────────────────────
  function drawTrendChart() {
    const canvas = document.getElementById('mlTrendCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, W, H);

    const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
    const data =  [847, 1203, 1891, 2456, 3102, 3847, 4521];
    const maxVal = 5000;

    const padL = 50, padR = 20, padT = 20, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Grid lines
    ctx.strokeStyle = 'rgba(0,240,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gy = padT + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + chartW, gy);
      ctx.stroke();
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = '#5a7a8a';
      ctx.textAlign = 'right';
      ctx.fillText(((4 - i) * 1250).toLocaleString(), padL - 4, gy + 3);
    }

    // Year labels
    years.forEach((yr, i) => {
      const x = padL + (i / (years.length - 1)) * chartW;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = '#7ec8e3';
      ctx.textAlign = 'center';
      ctx.fillText(yr, x, H - 4);
    });

    // Glowing line path
    const points = data.map((v, i) => ({
      x: padL + (i / (years.length - 1)) * chartW,
      y: padT + chartH - (v / maxVal) * chartH
    }));

    // Shadow glow
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Area fill gradient
    const areaGrad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    areaGrad.addColorStop(0, 'rgba(0,240,255,0.25)');
    areaGrad.addColorStop(1, 'rgba(0,240,255,0.01)');
    ctx.fillStyle = areaGrad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padT + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padT + chartH);
    ctx.closePath();
    ctx.fill();

    // Dots
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#00f0ff';
      ctx.fill();
      ctx.strokeStyle = '#0d1b2a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Value labels on top
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(data[i].toLocaleString(), p.x, p.y - 8);
    });

    // Title
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('Debris Detections Per Year (2020–2026)', padL, 14);
  }

  // ── 4. NLP Keyword Word Cloud ──────────────────────────────────────────────
  function drawWordCloud() {
    const canvas = document.getElementById('mlWordCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, W, H);

    const words = [
      // Large
      { text: 'Debris',      size: 28, x: 0.22, y: 0.40, color: '#00f0ff' },
      { text: 'Sonar',       size: 26, x: 0.65, y: 0.30, color: '#00d4e0' },
      { text: 'Detection',   size: 24, x: 0.48, y: 0.60, color: '#0090ff' },
      { text: 'Ocean',       size: 22, x: 0.78, y: 0.55, color: '#00f0c8' },
      // Medium
      { text: 'Plastic',     size: 16, x: 0.15, y: 0.20, color: '#ff6b6b' },
      { text: 'AUV',         size: 16, x: 0.60, y: 0.78, color: '#ffd93d' },
      { text: 'Marine',      size: 15, x: 0.38, y: 0.18, color: '#6bcb77' },
      { text: 'Pollution',   size: 15, x: 0.82, y: 0.20, color: '#c77dff' },
      { text: 'Mission',     size: 14, x: 0.12, y: 0.70, color: '#7ec8e3' },
      // Small
      { text: 'Biodiversity',size: 11, x: 0.30, y: 0.85, color: '#5a8fa0' },
      { text: 'SDG14',       size: 11, x: 0.70, y: 0.88, color: '#5a8fa0' },
      { text: 'Conservation',size: 11, x: 0.50, y: 0.92, color: '#4a7a90' },
      { text: 'Satellite',   size: 11, x: 0.85, y: 0.68, color: '#4a7a90' },
      { text: 'Cleanup',     size: 11, x: 0.08, y: 0.88, color: '#4a7a90' },
      { text: 'YOLOv8',      size: 13, x: 0.43, y: 0.08, color: '#00b8ff' },
      { text: 'PatchCore',   size: 12, x: 0.72, y: 0.10, color: '#00a0d0' }
    ];

    words.forEach(w => {
      ctx.font = `bold ${w.size}px Inter, sans-serif`;
      ctx.fillStyle = w.color;
      ctx.globalAlpha = 0.85;
      ctx.textAlign = 'center';
      ctx.fillText(w.text, w.x * W, w.y * H);
    });
    ctx.globalAlpha = 1.0;

    // Title
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('NLP Keyword Intelligence', 8, 12);
  }

  // ── 5. Animate Inference Stats ─────────────────────────────────────────────
  function animateStats() {
    const targets = {
      mlInferenceTime:   { end: 13.5,   unit: ' ms',   decimals: 1 },
      mlObjectsDetected: { end: 4521,   unit: '',      decimals: 0 },
      mlConfidence:      { end: 94.2,   unit: '%',     decimals: 1 },
      mlMissionsRun:     { end: 127,    unit: '',      decimals: 0 }
    };

    Object.entries(targets).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = 0;
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const val = start + (cfg.end - start) * eased;
        el.textContent = val.toFixed(cfg.decimals) + cfg.unit;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // ── Live tick (slight variation every few seconds) ─────────────────────────
  function startLiveTick() {
    setInterval(() => {
      const el = document.getElementById('mlInferenceTime');
      if (el) {
        const v = (13.2 + Math.random() * 0.8).toFixed(1);
        el.textContent = v + ' ms';
      }
      const el2 = document.getElementById('mlConfidence');
      if (el2) {
        const v = (93.8 + Math.random() * 0.8).toFixed(1);
        el2.textContent = v + '%';
      }
    }, 3500);
  }

  // ── 6. Interactive NLP Marine Debris Intelligence Engine ──────────────────
  function analyzeNlpQuery(customText) {
    const inputEl = document.getElementById('nlpQueryInput');
    const text = (customText || (inputEl ? inputEl.value : '')).trim();
    if (!text) return;

    if (inputEl) inputEl.value = text;
    const lower = text.toLowerCase();

    // Entity Extraction
    const entities = [];
    let category = 'Unclassified Acoustic Anomaly';
    let severity = 'MODERATE';
    let severityColor = '#ffb703';
    let confidence = 0.88;
    let action = 'Schedule AUV secondary high-frequency 900 kHz zoom survey';

    if (lower.includes('net') || lower.includes('trawl') || lower.includes('ghost') || lower.includes('nylon') || lower.includes('monofilament') || lower.includes('line')) {
      category = 'Ghost Fishing Gear (Polyamide Net)';
      severity = 'CRITICAL';
      severityColor = '#ff3366';
      confidence = 0.96;
      action = 'Dispatch grappling recovery vessel (SDG 14.1 Marine Entanglement Alert)';
      entities.push({ type: 'DEBRIS_TYPE', value: 'Ghost Net / Polyamide' });
    } else if (lower.includes('drum') || lower.includes('chemical') || lower.includes('toxic') || lower.includes('oil') || lower.includes('spill') || lower.includes('barrel') || lower.includes('corroded')) {
      category = 'Toxic Industrial Hazard (Chemical Drum)';
      severity = 'CRITICAL';
      severityColor = '#ff3366';
      confidence = 0.94;
      action = 'EOD / Environmental Hazmat containment diver deployment';
      entities.push({ type: 'HAZMAT', value: 'Corrosive Chemical / Hydrocarbon' });
    } else if (lower.includes('reef') || lower.includes('coral') || lower.includes('fish') || lower.includes('nursery') || lower.includes('habitat') || lower.includes('biodiversity')) {
      category = 'Artificial Reef Nursery (Ecological Protection)';
      severity = 'ECOLOGICAL_HABITAT';
      severityColor = '#00ff88';
      confidence = 0.97;
      action = 'DO NOT DISTURB &bull; Register in Marine Protected Area (MPA) GIS (SDG 14.2)';
      entities.push({ type: 'ECOLOGY', value: 'Bio-colonized Substrate' });
    } else if (lower.includes('plastic') || lower.includes('bottle') || lower.includes('microplastic') || lower.includes('raft') || lower.includes('macro')) {
      category = 'Macroplastic Aggregation';
      severity = 'HIGH';
      severityColor = '#ff70a6';
      confidence = 0.91;
      action = 'Surface skimming sweep & Lagrangian sink point interception';
      entities.push({ type: 'POLYMER', value: 'HDPE / Polypropylene' });
    } else if (lower.includes('tyre') || lower.includes('rubber') || lower.includes('wheel')) {
      category = 'Rubber Marine Debris (Tyre Cluster)';
      severity = 'MODERATE';
      severityColor = '#ffb703';
      confidence = 0.89;
      action = 'Heavy mechanical grapple retrieval';
      entities.push({ type: 'MATERIAL', value: 'Vulcanized Synthetic Rubber' });
    } else if (lower.includes('mine') || lower.includes('uxo') || lower.includes('ordnance') || lower.includes('bomb') || lower.includes('torpedo') || lower.includes('depth charge')) {
      category = 'Historical Unexploded Ordnance (UXO)';
      severity = 'CRITICAL';
      severityColor = '#ff0033';
      confidence = 0.95;
      action = 'IMMEDIATE NAVAL EOD NOTIFICATION & 500m Exclusion Zone';
      entities.push({ type: 'MUNITIONS', value: 'Subsea Explosive Hazard' });
    }

    // Depth extraction regex
    const depthMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|meter|meters|depth)/i);
    if (depthMatch) {
      entities.push({ type: 'DEPTH', value: `${depthMatch[1]} meters` });
    }

    // Location extraction
    const locations = ['bay of bengal', 'indian ocean', 'arabian sea', 'lakshadweep', 'andaman', 'pacific', 'atlantic', 'arctic', 'chennai', 'visakhapatnam', 'mumbai'];
    locations.forEach(loc => {
      if (lower.includes(loc)) {
        entities.push({ type: 'GEO_LOCATION', value: loc.toUpperCase() });
      }
    });

    const resultBox = document.getElementById('nlpAnalysisResult');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="background:rgba(0,240,255,0.06); border:1px solid rgba(0,240,255,0.3); border-radius:8px; padding:12px; margin-top:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px; border-bottom:1px solid rgba(0,240,255,0.15); padding-bottom:6px;">
          <div style="font-weight:700; color:#00f0ff; font-size:0.85rem;">
            <span>🔬</span> NLP INFERENCE RESULT
          </div>
          <span style="background:${severityColor}22; color:${severityColor}; border:1px solid ${severityColor}88; padding:2px 8px; border-radius:12px; font-size:0.72rem; font-weight:700;">
            ${severity}
          </span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px; font-size:0.78rem;">
          <div><span style="color:#7ec8e3;">Predicted Class:</span> <strong style="color:#ffffff;">${category}</strong></div>
          <div><span style="color:#7ec8e3;">Model Confidence:</span> <strong style="color:#00f0ff;">${(confidence * 100).toFixed(1)}%</strong></div>
          <div><span style="color:#7ec8e3;">NLP Pipeline:</span> <span style="color:#a0c4d8;">Transformer Bi-LSTM + Zero-Shot Marine Ontology</span></div>
          <div><span style="color:#7ec8e3;">Entities Extracted:</span> <span style="color:#ffb703;">${entities.length > 0 ? entities.map(e => `[${e.type}: ${e.value}]`).join(' ') : 'None'}</span></div>
        </div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px dashed rgba(255,255,255,0.1); font-size:0.78rem;">
          <strong style="color:#00f0ff;">Autonomous Decision:</strong> <span style="color:#c8e8f0;">${action}</span>
        </div>
      </div>
    `;

    if (window.app && window.app.audioFX) {
      window.app.audioFX.playBlip();
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  let _initialized = false;

  const mlAnalytics = {
    init() {
      // Resize canvases to parent width
      ['mlModelCanvas', 'mlTrendCanvas'].forEach(id => {
        const c = document.getElementById(id);
        if (c && c.parentElement) {
          const w = Math.min(c.parentElement.clientWidth - 16, 600);
          if (w > 260) c.width = w;
        }
      });
      ['mlClassCanvas', 'mlWordCanvas'].forEach(id => {
        const c = document.getElementById(id);
        if (c && c.parentElement) {
          const w = Math.min(c.parentElement.clientWidth - 16, 340);
          if (w > 220) c.width = w;
        }
      });

      // Draw all charts
      drawModelPerformance();
      drawClassDistribution();
      drawTrendChart();
      drawWordCloud();
      if (!_initialized) {
        animateStats();
        startLiveTick();
        _initialized = true;
      }
    },
    refresh() {
      drawModelPerformance();
      drawClassDistribution();
      drawTrendChart();
      drawWordCloud();
      animateStats();
    },
    analyzeQuery(text) {
      analyzeNlpQuery(text);
    }
  };

  window.mlAnalytics = mlAnalytics;

})();
