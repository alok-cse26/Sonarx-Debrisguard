/**
 * SonarX DebrisGuard - Side-Scan Sonar (SSS) Waterfall & Neural Feature Renderer
 * Implements Slant-Range Correction, TVG Normalization, Acoustic Shadow Geometrics,
 * Speckle Denoising, YOLOv8 Target Overlays, and Grad-CAM Attention Heatmaps.
 */

class SonarWaterfallEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Physical Sonar Survey Parameters
    this.altitude = 8.5; // AUV altitude above seafloor in meters (h)
    this.maxRange = 75.0; // Half-swath range in meters (port & starboard each 75m = 150m total)
    this.swathWidthMeters = 150.0;
    this.frequencyKhz = 455; // 455 kHz high-resolution sonar
    this.speedKnots = 3.2; // AUV survey speed
    
    // Processing Options
    this.slantRangeCorrected = true;
    this.tvgEnabled = true;
    this.speckleFilter = 'lee'; // 'none', 'lee', 'median'
    this.showBoundingBoxes = true;
    this.showGradCAM = false;
    this.showAcousticShadows = true;
    this.colorPalette = 'copper'; // 'copper', 'emerald', 'monochrome', 'magma'
    this.isPaused = false;
    
    // Internal buffer
    this.width = 960;
    this.height = 540;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.waterfallLines = [];
    this.scrollSpeed = 1.0;
    this.lineIndex = 0;
    
    // Predefined synthetic seabed objects in waterfall
    this.objects = [
      {
        id: "DET-101",
        label: "Ghost Net (Gillnet)",
        type: "ghost_net",
        yRel: 0.22,
        channel: "starboard", // starboard = right
        groundRangeM: 32.5,
        widthM: 7.5,
        heightM: 1.9,
        shadowLengthM: 6.8,
        confidence: 0.964,
        category: "Supervised (YOLOv8)"
      },
      {
        id: "DET-102",
        label: "Discarded Tyres",
        type: "tyre",
        yRel: 0.45,
        channel: "port", // port = left
        groundRangeM: 42.0,
        widthM: 3.5,
        heightM: 1.1,
        shadowLengthM: 4.1,
        confidence: 0.923,
        category: "Supervised (YOLOv8)"
      },
      {
        id: "DET-103",
        label: "Metal Chemical Drum",
        type: "metal_drum",
        yRel: 0.68,
        channel: "starboard",
        groundRangeM: 26.0,
        widthM: 2.2,
        heightM: 0.95,
        shadowLengthM: 3.4,
        confidence: 0.887,
        category: "Supervised (YOLOv8)"
      },
      {
        id: "DET-104",
        label: "Pipeline Rupture Anomaly",
        type: "pipeline_anomaly",
        yRel: 0.82,
        channel: "port",
        groundRangeM: 38.0,
        widthM: 6.0,
        heightM: 1.6,
        shadowLengthM: 7.2,
        confidence: 0.941,
        category: "Unsupervised (PatchCore)"
      }
    ];

    this.initSeabedBuffer();
    this.setupInteraction();
    this.startRenderLoop();
  }

  initSeabedBuffer() {
    this.baseImage = this.ctx.createImageData(this.width, this.height);
    this.renderFullWaterfall();
  }

  // Generate realistic side-scan sonar acoustic line
  generateSonarScanline(y) {
    const row = new Float32Array(this.width);
    const midX = this.width / 2;
    const nadirBlindPx = (this.altitude / this.maxRange) * (this.width / 2);

    for (let x = 0; x < this.width; x++) {
      const distFromCenter = Math.abs(x - midX);
      const isPort = x < midX;

      // 1. Nadir water column (sound traveling through water before seabed echo)
      if (!this.slantRangeCorrected && distFromCenter < nadirBlindPx) {
        // Dark water column with minimal acoustic volume backscatter
        row[x] = 0.05 + Math.random() * 0.04;
        continue;
      }

      // 2. Seafloor reverberation (sand ripples & acoustic speckle)
      let normRange = distFromCenter / (this.width / 2);
      if (this.slantRangeCorrected) {
        normRange = Math.min(1.0, normRange);
      }

      // Acoustic ripple pattern (perpendicular to survey track)
      const ripple = Math.sin(y * 0.15 + (x * 0.03)) * 0.08;
      // Rayleigh-like speckle noise
      const speckle = -Math.log(1.0 - Math.random() * 0.9) * 0.14;

      // Seafloor grazing angle backscatter model (Lambert's law: I ~ sin^2(grazing))
      let grazing = Math.max(0.1, 1.0 - normRange * 0.6);
      let intensity = 0.38 + ripple + speckle;

      // 3. Time-Varied Gain (TVG) compensation
      if (this.tvgEnabled) {
        // Compensates for spherical spreading (20 log r) + attenuation (2 alpha r)
        const tvgCompensation = 1.0 + (normRange * 0.45);
        intensity *= tvgCompensation;
      } else {
        // Uncompensated falls off with distance
        intensity *= Math.max(0.2, 1.0 - (normRange * 0.7));
      }

      row[x] = Math.min(1.0, Math.max(0.02, intensity));
    }

    return row;
  }

  renderFullWaterfall() {
    const data = this.baseImage.data;
    const midX = this.width / 2;
    const nadirWidth = (this.altitude / this.maxRange) * (this.width / 2);

    for (let y = 0; y < this.height; y++) {
      const scan = this.generateSonarScanline(y);

      for (let x = 0; x < this.width; x++) {
        let val = scan[x];

        // Inject objects and realistic acoustic shadows
        for (const obj of this.objects) {
          const objY = obj.yRel * this.height;
          const dy = Math.abs(y - objY);
          
          if (dy < 14) {
            const isStarboard = obj.channel === 'starboard';
            const objX = isStarboard 
              ? midX + (obj.groundRangeM / this.maxRange) * (this.width / 2)
              : midX - (obj.groundRangeM / this.maxRange) * (this.width / 2);

            const dx = Math.abs(x - objX);
            const objPxRadius = (obj.widthM / this.maxRange) * (this.width / 4);

            // Object High-Intensity Acoustic Highlight
            if (dx < objPxRadius && dy < 10) {
              const highlight = 0.95 + Math.random() * 0.05;
              val = highlight;
            }

            // Acoustic Shadow: geometrically projects outward away from nadir
            if (this.showAcousticShadows) {
              const shadowPx = (obj.shadowLengthM / this.maxRange) * (this.width / 2);
              const inShadowRange = isStarboard 
                ? (x > objX + objPxRadius && x < objX + objPxRadius + shadowPx)
                : (x < objX - objPxRadius && x > objX - objPxRadius - shadowPx);

              if (inShadowRange && dy < (10 + (Math.abs(x - objX) * 0.15))) {
                // Total acoustic occlusion behind target
                val = 0.02 + Math.random() * 0.03;
              }
            }
          }
        }

        // Apply speckle filtering if requested
        if (this.speckleFilter === 'lee' && Math.random() < 0.25) {
          val = val * 0.9 + 0.05;
        }

        // Map intensity to RGB color palette
        const rgb = this.intensityToRgb(val);
        const idx = (y * this.width + x) * 4;
        data[idx] = rgb[0];
        data[idx + 1] = rgb[1];
        data[idx + 2] = rgb[2];
        data[idx + 3] = 255;
      }
    }
  }

  intensityToRgb(intensity) {
    intensity = Math.max(0.0, Math.min(1.0, intensity));

    if (this.colorPalette === 'copper') {
      // Classic Side-scan sonar amber/copper/gold palette
      const r = Math.min(255, Math.floor(intensity * 320));
      const g = Math.min(255, Math.floor(intensity * 210));
      const b = Math.min(255, Math.floor(intensity * 60));
      return [r, g, b];
    } else if (this.colorPalette === 'emerald') {
      // High-contrast marine phosphor green
      const r = Math.min(255, Math.floor(intensity * 40));
      const g = Math.min(255, Math.floor(intensity * 270));
      const b = Math.min(255, Math.floor(intensity * 140));
      return [r, g, b];
    } else if (this.colorPalette === 'monochrome') {
      // Acoustic grayscale
      const v = Math.floor(intensity * 255);
      return [v, v, v];
    } else {
      // Magma / Deep ocean
      const r = Math.min(255, Math.floor(intensity * 255));
      const g = Math.min(255, Math.floor(Math.pow(intensity, 1.8) * 220));
      const b = Math.min(255, Math.floor(Math.pow(intensity, 0.7) * 255));
      return [r, g, b];
    }
  }

  drawOverlays() {
    const midX = this.width / 2;

    // 1. Nadir Line & Channel Labels
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 51, 102, 0.45)';
    this.ctx.setLineDash([6, 4]);
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);
    this.ctx.lineTo(midX, this.height);
    this.ctx.stroke();

    // Swath markers
    this.ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    this.ctx.font = '10px "JetBrains Mono", monospace';
    this.ctx.fillText(`PORT SWATH (-${this.maxRange}m)`, 20, 24);
    this.ctx.fillText(`STARBOARD SWATH (+${this.maxRange}m)`, this.width - 200, 24);
    this.ctx.fillText(`NADIR (ALT ${this.altitude}m)`, midX - 45, 24);

    // Range Grid Lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.setLineDash([2, 4]);
    const intervals = [0.25, 0.5, 0.75];
    for (const frac of intervals) {
      const portX = midX - (frac * midX);
      const stbdX = midX + (frac * midX);
      const rangeM = (frac * this.maxRange).toFixed(0);

      this.ctx.beginPath();
      this.ctx.moveTo(portX, 0);
      this.ctx.lineTo(portX, this.height);
      this.ctx.moveTo(stbdX, 0);
      this.ctx.lineTo(stbdX, this.height);
      this.ctx.stroke();

      this.ctx.fillText(`${rangeM}m`, portX + 4, this.height - 10);
      this.ctx.fillText(`${rangeM}m`, stbdX + 4, this.height - 10);
    }
    this.ctx.restore();

    // 2. YOLOv8 Detections & Bounding Boxes
    if (this.showBoundingBoxes) {
      for (const obj of this.objects) {
        const objY = obj.yRel * this.height;
        const isStarboard = obj.channel === 'starboard';
        const objX = isStarboard 
          ? midX + (obj.groundRangeM / this.maxRange) * (midX)
          : midX - (obj.groundRangeM / this.maxRange) * (midX);

        const boxW = Math.max(34, (obj.widthM / this.maxRange) * (midX * 0.7));
        const boxH = 32;
        const x = objX - boxW / 2;
        const y = objY - boxH / 2;

        this.ctx.save();
        const isAnomaly = obj.type.includes('anomaly');
        const boxColor = isAnomaly ? '#00f0ff' : (obj.type === 'ghost_net' ? '#ff3366' : '#ffb703');

        // Bounding Box
        this.ctx.strokeStyle = boxColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, boxW, boxH);

        // Corner accents
        const cLen = 6;
        this.ctx.fillStyle = boxColor;
        this.ctx.fillRect(x - 1, y - 1, cLen, 2);
        this.ctx.fillRect(x - 1, y - 1, 2, cLen);
        this.ctx.fillRect(x + boxW - cLen + 1, y - 1, cLen, 2);
        this.ctx.fillRect(x + boxW - 1, y - 1, 2, cLen);

        // Tag label
        this.ctx.fillStyle = 'rgba(7, 11, 20, 0.88)';
        this.ctx.fillRect(x, y - 20, boxW + 55, 18);
        this.ctx.fillStyle = boxColor;
        this.ctx.font = 'bold 10px "JetBrains Mono", monospace';
        const pct = (obj.confidence * 100).toFixed(1);
        this.ctx.fillText(`${obj.label} ${pct}%`, x + 4, y - 7);

        // Acoustic Shadow Geometric Dimension Line
        if (this.showAcousticShadows) {
          const shadowPx = (obj.shadowLengthM / this.maxRange) * midX;
          const sX1 = isStarboard ? x + boxW : x;
          const sX2 = isStarboard ? sX1 + shadowPx : sX1 - shadowPx;

          this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
          this.ctx.lineWidth = 1;
          this.ctx.setLineDash([2, 2]);
          this.ctx.beginPath();
          this.ctx.moveTo(sX1, objY);
          this.ctx.lineTo(sX2, objY);
          this.ctx.stroke();

          this.ctx.fillStyle = '#00f0ff';
          this.ctx.font = '9px "JetBrains Mono", monospace';
          this.ctx.fillText(`Ls: ${obj.shadowLengthM}m (H: ${obj.heightM}m)`, isStarboard ? sX1 + 8 : sX2 + 4, objY - 4);
        }

        this.ctx.restore();
      }
    }

    // 3. Explainable AI Grad-CAM Heatmap Overlay
    if (this.showGradCAM) {
      this.drawGradCAMHeatmap();
    }
  }

  drawGradCAMHeatmap() {
    this.ctx.save();
    for (const obj of this.objects) {
      const objY = obj.yRel * this.height;
      const isStarboard = obj.channel === 'starboard';
      const objX = isStarboard 
        ? (this.width / 2) + (obj.groundRangeM / this.maxRange) * (this.width / 2)
        : (this.width / 2) - (obj.groundRangeM / this.maxRange) * (this.width / 2);

      const rad = 42;
      const grad = this.ctx.createRadialGradient(objX, objY, 4, objX, objY, rad);
      grad.addColorStop(0, 'rgba(255, 0, 0, 0.75)');     // Red center: maximum neural activation
      grad.addColorStop(0.35, 'rgba(255, 180, 0, 0.55)'); // Yellow
      grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.35)');  // Cyan
      grad.addColorStop(1, 'rgba(0, 0, 128, 0)');         // Fade to transparent

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(objX, objY, rad, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  startRenderLoop() {
    let lastTime = 0;
    const targetInterval = 1000 / 30; // 30 FPS smooth rendering, zero CPU lag

    const loop = (timestamp) => {
      this.animId = requestAnimationFrame(loop);

      // Skip rendering if document is minimized or tab is hidden
      if (document.hidden) return;
      const pane = document.getElementById('tab-waterfall');
      if (pane && !pane.classList.contains('active')) return;

      const elapsed = timestamp - lastTime;
      if (elapsed >= targetInterval) {
        lastTime = timestamp - (elapsed % targetInterval);
        this.render();
      }
    };
    this.animId = requestAnimationFrame(loop);

    // Auto-resume when coming back from minimize/background
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.resume();
      }
    });
    window.addEventListener('resize', () => {
      this.resume();
    });
  }

  resume() {
    if (this.ctx && this.baseImage) {
      this.render();
    }
  }

  render() {
    this.ctx.putImageData(this.baseImage, 0, 0);
    this.drawOverlays();
  }

  setupInteraction() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const midX = this.width / 2;

      for (const obj of this.objects) {
        const objY = obj.yRel * this.height;
        const isStarboard = obj.channel === 'starboard';
        const objX = isStarboard 
          ? midX + (obj.groundRangeM / this.maxRange) * (midX)
          : midX - (obj.groundRangeM / this.maxRange) * (midX);

        const boxW = Math.max(34, (obj.widthM / this.maxRange) * (midX * 0.7));
        const boxH = 34;

        if (Math.abs(mouseX - objX) < boxW / 2 + 10 && Math.abs(mouseY - objY) < boxH / 2 + 10) {
          if (window.app && window.app.audioFX) window.app.audioFX.playDetectionChime();
          if (window.app) window.app.openVerificationModal(obj.id);
          return;
        }
      }

      if (window.app && window.app.audioFX) window.app.audioFX.playSonarPing();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      const midX = this.width / 2;
      const isStarboard = mouseX >= midX;
      const distFromNadirPx = Math.abs(mouseX - midX);
      const groundRange = (distFromNadirPx / midX) * this.maxRange;
      const slantRange = Math.sqrt(Math.pow(groundRange, 2) + Math.pow(this.altitude, 2));

      // Update HUD elements
      const rangeEl = document.getElementById('hudGroundRange');
      const slantEl = document.getElementById('hudSlantRange');
      const channelEl = document.getElementById('hudChannel');
      if (rangeEl) rangeEl.textContent = `${groundRange.toFixed(1)} m`;
      if (slantEl) slantEl.textContent = `${slantRange.toFixed(1)} m`;
      if (channelEl) channelEl.textContent = isStarboard ? 'STARBOARD' : 'PORT';
    });

    // Mobile touch interaction
    this.canvas.addEventListener('touchstart', (e) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const touchX = (touch.clientX - rect.left) * scaleX;
      const touchY = (touch.clientY - rect.top) * scaleY;
      const midX = this.width / 2;

      for (const obj of this.objects) {
        const objY = obj.yRel * this.height;
        const isStarboard = obj.channel === 'starboard';
        const objX = isStarboard 
          ? midX + (obj.groundRangeM / this.maxRange) * (midX)
          : midX - (obj.groundRangeM / this.maxRange) * (midX);

        const boxW = Math.max(34, (obj.widthM / this.maxRange) * (midX * 0.7));
        const boxH = 34;

        if (Math.abs(touchX - objX) < boxW / 2 + 15 && Math.abs(touchY - objY) < boxH / 2 + 15) {
          if (window.app && window.app.audioFX) window.app.audioFX.playDetectionChime();
          if (window.app) window.app.openVerificationModal(obj.id);
          return;
        }
      }
    }, { passive: true });
  }

  // API Methods
  setAltitude(h) {
    this.altitude = parseFloat(h);
    const altEl = document.getElementById('hudAltitudeVal');
    if (altEl) altEl.textContent = `${this.altitude.toFixed(1)}m`;
    this.renderFullWaterfall();
  }

  setSpeed(kts) {
    this.speedKnots = parseFloat(kts);
    this.scrollSpeed = this.speedKnots / 3.0;
  }

  toggleSlantRange(val) {
    this.slantRangeCorrected = val;
    this.renderFullWaterfall();
  }

  toggleTVG(val) {
    this.tvgEnabled = val;
    this.renderFullWaterfall();
  }

  setSpeckleFilter(filter) {
    this.speckleFilter = filter;
    this.renderFullWaterfall();
  }

  setPalette(palette) {
    this.colorPalette = palette;
    this.renderFullWaterfall();
  }

  toggleBoundingBoxes(val) {
    this.showBoundingBoxes = val;
  }

  toggleGradCAM(val) {
    this.showGradCAM = val;
  }

  injectSyntheticObject(obj) {
    this.objects.unshift(obj);
    this.renderFullWaterfall();
  }
}

window.SonarWaterfallEngine = SonarWaterfallEngine;
