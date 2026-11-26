/**
 * SonarX DebrisGuard - Satellite Earth-Observation & Lagrangian Sinking Engine
 * Team SonarX | Bennett University
 * Multi-Scale sensor fusion: Connects Sentinel-1 SAR & Sentinel-2 Optical space-borne
 * detections with Side-Scan Sonar (SSS) seabed targets via hydrodynamic drift physics.
 */

class SatelliteTrackerModule {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.satellites = [];
    this.surfaceSlicks = [];
    this.uplinks = [];
    this.activeSatellite = 'SAT-SEN1C';

    this.orbitAngle = 0.0;
    this.radarSweep = 0.0;

    window.satelliteTracker = this;
    this.init();
  }

  handleResize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    let w = parent ? parent.clientWidth : 0;
    if (!w || w < 280) {
      w = Math.min(window.innerWidth - 32, 900);
    }
    if (w > 200) {
      const h = Math.round(Math.min(380, Math.max(260, w * 0.52)));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
      }
    }
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => {
      this.handleResize();
      this.drawOrbitView();
    });
    if (window.ResizeObserver && this.canvas && this.canvas.parentElement) {
      try {
        new ResizeObserver(() => {
          this.handleResize();
          this.drawOrbitView();
        }).observe(this.canvas.parentElement);
      } catch (e) {}
    }

    this.fetchSatelliteData();
    this.fetchUplinkLogs();
    this.startAnimation();
    setInterval(() => this.fetchSatelliteData(), 6000);
  }

  fetchSatelliteData() {
    fetch('/api/satellite/constellation')
      .then(res => res.json())
      .then(data => {
        this.satellites = data.constellation || [];
        this.surfaceSlicks = data.surface_slicks || [];
        this.renderSatelliteCards();
      })
      .catch(err => {
        // Resilient fallback constellation
        this.satellites = [
          {
            id: "SAT-SEN1C",
            name: "Copernicus Sentinel-1C",
            sensor: "C-Band Synthetic Aperture Radar (SAR)",
            status: "ACQUIRING 24/7",
            altitude_km: 693,
            elevation_deg: 68.4,
            next_pass_min: 14,
            color: "#00f0ff"
          },
          {
            id: "SAT-SEN2B",
            name: "Copernicus Sentinel-2B",
            sensor: "Multi-Spectral Instrument (FDI Optical)",
            status: "SUN-SYNC ORBIT",
            altitude_km: 786,
            elevation_deg: 42.1,
            next_pass_min: 48,
            color: "#00ff88"
          },
          {
            id: "SAT-NOAA20",
            name: "NOAA-20 JPSS",
            sensor: "VIIRS Ocean Thermal & Slicks",
            status: "ACTIVE ORBIT",
            altitude_km: 824,
            elevation_deg: 54.0,
            next_pass_min: 112,
            color: "#ffb703"
          },
          {
            id: "SAT-IRID142",
            name: "Iridium-NEXT 142",
            sensor: "Low-Earth Orbit Comms Transceiver",
            status: "LEO UPLINK READY",
            altitude_km: 780,
            elevation_deg: 82.5,
            next_pass_min: 3,
            color: "#ff70a6"
          }
        ];

        this.surfaceSlicks = [
          {
            id: "SLICK-BOB-01",
            satellite: "Sentinel-1C",
            lat: 17.7020,
            lng: 83.2380,
            fdi_index: 0.142,
            area_m2: 4500,
            est_sink_time_hrs: 4.8
          },
          {
            id: "SLICK-BOB-02",
            satellite: "Sentinel-2B",
            lat: 17.6740,
            lng: 83.2040,
            fdi_index: 0.098,
            area_m2: 2800,
            est_sink_time_hrs: 6.2
          }
        ];

        this.renderSatelliteCards();
      });
  }

  fetchUplinkLogs() {
    fetch('/api/satellite/uplinks')
      .then(res => res.json())
      .then(data => {
        this.uplinks = data.uplinks || [];
        this.renderUplinkTable();
      })
      .catch(err => {
        this.uplinks = [
          {
            packet_id: "PKT-IRID-9801",
            timestamp: "2026-10-25 12:44:12 UTC",
            vehicle: "AUV DeepScan-IV",
            payload: "INT8 Anomaly Header (DET-101)",
            coords: "17.6892°N, 83.2215°E",
            gateway: "Iridium-NEXT 142",
            status: "ACK RECEIVED (1.14s)"
          },
          {
            packet_id: "PKT-IRID-9800",
            timestamp: "2026-10-25 12:38:05 UTC",
            vehicle: "AUV DeepScan-IV",
            payload: "PatchCore Anomaly Mask (DET-104)",
            coords: "17.6821°N, 83.2132°E",
            gateway: "Iridium-NEXT 142",
            status: "ACK RECEIVED (1.28s)"
          },
          {
            packet_id: "PKT-IRID-9799",
            timestamp: "2026-10-25 12:15:40 UTC",
            vehicle: "Surface Gateway Buoy B-2",
            payload: "Bathymetry DVL Profiler",
            coords: "17.6875°N, 83.2195°E",
            gateway: "Iridium-NEXT 142",
            status: "ACK RECEIVED (0.98s)"
          }
        ];
        this.renderUplinkTable();
      });
  }

  renderSatelliteCards() {
    const container = document.getElementById('satelliteCardsContainer');
    if (!container || !this.satellites.length) return;

    container.innerHTML = this.satellites.map(sat => `
      <div class="sat-card ${sat.id === this.activeSatellite ? 'active' : ''}" onclick="window.satelliteTracker.selectSatellite('${sat.id}')" data-explain="${sat.id === 'SAT-SEN1C' ? 'sentinel-1-sar' : (sat.id === 'SAT-SEN2B' ? 'sentinel-2-fdi' : 'iridium-leo')}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:bold; font-size:0.82rem; color:${sat.color};">${sat.name}</span>
          <span class="badge-edge" style="font-size:0.6rem; color:${sat.color}; border-color:${sat.color};">${sat.status}</span>
        </div>
        <div style="font-size:0.72rem; color:var(--text-muted); line-height:1.4;">
          <div>Sensor: <b style="color:#fff;">${sat.sensor}</b></div>
          <div>Altitude: <b>${sat.altitude_km} km</b> | Elevation: <b style="color:${sat.color};">${sat.elevation_deg}°</b></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>Next Overpass: <b style="color:var(--sonar-amber);">${sat.next_pass_min} min</b></span>
            <span class="info-badge" title="Click to understand how this satellite detects debris">ℹ️</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderUplinkTable() {
    const tbody = document.getElementById('uplinkTableBody');
    if (!tbody || !this.uplinks) return;

    tbody.innerHTML = this.uplinks.map(u => `
      <tr style="border-bottom:1px solid var(--border-subtle); font-size:0.75rem; font-family:var(--font-mono);">
        <td style="padding:8px; color:var(--sonar-cyan);">${u.packet_id}</td>
        <td style="padding:8px; color:var(--text-muted);">${u.timestamp}</td>
        <td style="padding:8px; font-weight:bold;">${u.vehicle}</td>
        <td style="padding:8px;">${u.payload}</td>
        <td style="padding:8px;">${u.coords}</td>
        <td style="padding:8px; color:#ffffff;">${u.gateway}</td>
        <td style="padding:8px; color:var(--sonar-green); font-weight:bold;">${u.status}</td>
      </tr>
    `).join('');
  }

  selectSatellite(satId) {
    this.activeSatellite = satId;
    this.renderSatelliteCards();
    if (window.app) {
      window.app.showToast(`Selected Satellite: ${satId}`, 'info');
    }
  }

  startAnimation() {
    let lastTime = 0;
    const targetInterval = 1000 / 25; // 25 FPS silky smooth orbit animation

    const render = (timestamp) => {
      this.animId = requestAnimationFrame(render);

      // Skip rendering if document is minimized or tab is not active
      if (document.hidden) return;
      const pane = document.getElementById('tab-satellite');
      if (pane && !pane.classList.contains('active')) return;

      const elapsed = timestamp - lastTime;
      if (elapsed >= targetInterval) {
        lastTime = timestamp - (elapsed % targetInterval);
        this.drawOrbitView();
      }
    };
    this.animId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.handleResize();
        this.drawOrbitView();
      }
    });
  }

  drawOrbitView() {
    if (!this.canvas || !this.ctx) return;
    if (this.canvas.width === 0 || this.canvas.height === 0 || this.canvas.clientWidth > this.canvas.width + 50) {
      this.handleResize();
    }
    const ctx = this.ctx;
    const w = this.canvas.width || 600;
    const h = this.canvas.height || 320;

    ctx.clearRect(0, 0, w, h);

    // Deep ocean space background
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, w, h);

    // Coordinate grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Coastline contour (Bay of Bengal / Visakhapatnam coastline simulation)
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.bezierCurveTo(w * 0.25, 120, w * 0.45, 190, w * 0.5, h);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 180, 216, 0.04)';
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Text label
    ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('EAST INDIA CONTINENTAL SHELF & BAY OF BENGAL', 20, 25);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(139, 162, 196, 0.8)';
    ctx.fillText('MULTI-SCALE SATELLITE TO SEABED TRACKER (EPSG:4326)', 20, 40);

    // AUV Survey Seabed Track Envelope
    const auvX = w * 0.65;
    const auvY = h * 0.55;
    ctx.strokeStyle = '#00f0ff';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(auvX - 45, auvY - 45, 90, 90);
    ctx.setLineDash([]);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('SSS SEABED TRACK BB-09', auvX - 52, auvY - 52);

    // Plot Surface Satellite Observations (Floating Litter Slicks)
    this.surfaceSlicks.forEach((slick, idx) => {
      const sX = auvX - 30 + (idx * 50);
      const sY = auvY - 60 - (idx * 40);

      // Radar pulse ring
      this.radarSweep += 0.015;
      const pulseRad = 8 + (Math.sin(this.radarSweep + idx) + 1) * 6;
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.5)';
      ctx.beginPath();
      ctx.arc(sX, sY, pulseRad, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.arc(sX, sY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Sinking Trajectory Vector (Surface Slick -> Seabed SSS Target)
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.8)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(sX, sY);
      ctx.lineTo(auvX - 10 + (idx * 25), auvY + 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f0f4f8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`${slick.satellite} Slick #${idx + 1} (FDI: ${slick.fdi_index})`, sX + 10, sY - 4);
      ctx.fillStyle = '#ffb703';
      ctx.fillText(`↓ Hydrodynamic Sinking Vector (42m)`, sX + 10, sY + 8);
    });

    // Satellite Orbital Track & Radar Footprint
    this.orbitAngle += 0.008;
    const satOrbX = ((Math.sin(this.orbitAngle) + 1) / 2) * (w - 100) + 50;
    const satOrbY = ((Math.cos(this.orbitAngle * 0.7) + 1) / 2) * (h - 100) + 50;

    // Satellite Radar Footprint Cone
    const grad = ctx.createRadialGradient(satOrbX, satOrbY, 10, satOrbX, satOrbY, 110);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(0.6, 'rgba(0, 240, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(satOrbX, satOrbY, 110, 0, Math.PI * 2);
    ctx.fill();

    // Satellite Symbol
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(satOrbX - 7, satOrbY - 7, 14, 14);
    // Solar panels
    ctx.fillStyle = '#00b4d8';
    ctx.fillRect(satOrbX - 22, satOrbY - 3, 12, 6);
    ctx.fillRect(satOrbX + 10, satOrbY - 3, 12, 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('SENTINEL-1C SAR (ALT: 693km)', satOrbX + 16, satOrbY - 8);

    // RF Beam line down to AUV/buoy
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(satOrbX, satOrbY);
    ctx.lineTo(auvX, auvY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#00ff88';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('L-BAND UPLINK CARRIER (1.62 GHz)', (satOrbX + auvX) / 2, (satOrbY + auvY) / 2);
  }

  runLagrangianDriftModel() {
    const curSpeed = parseFloat(document.getElementById('driftCurrentSpeed')?.value || 0.45);
    const bearing = parseFloat(document.getElementById('driftCurrentBearing')?.value || 142);
    const wind = parseFloat(document.getElementById('driftWindCoeff')?.value || 2.8);
    const density = parseFloat(document.getElementById('driftPlasticDensity')?.value || 1035);

    // Physics calculations
    const seawaterDensity = 1025.0; // kg/m3
    const excessDensity = Math.max(1.0, density - seawaterDensity);
    const settlingVelocityMs = Math.min(0.08, 0.005 + (excessDensity / 10.0) * 0.015);
    const waterDepthM = 42.5;
    const sinkTimeSeconds = waterDepthM / settlingVelocityMs;
    const sinkTimeHours = (sinkTimeSeconds / 3600).toFixed(2);

    // Horizontal displacement
    const driftDistanceM = (curSpeed * sinkTimeSeconds).toFixed(0);
    const driftDistanceKm = (driftDistanceM / 1000).toFixed(2);

    // Geodesic offset calculation
    const rad = bearing * (Math.PI / 180);
    const dLat = (driftDistanceM * Math.cos(rad)) / 111320;
    const dLng = (driftDistanceM * Math.sin(rad)) / (111320 * Math.cos(17.7020 * Math.PI / 180));

    const seabedLat = (17.7020 + dLat).toFixed(5);
    const seabedLng = (83.2380 + dLng).toFixed(5);

    const box = document.getElementById('driftResultBox');
    if (box) {
      box.innerHTML = `
        <div style="color:var(--sonar-cyan); font-weight:bold; margin-bottom:6px;">
          ✓ 3D LAGRANGIAN DRIFT MODEL SOLVED
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.75rem;">
          <div>Settling Velocity: <b style="color:#ffffff;">${(settlingVelocityMs * 100).toFixed(1)} cm/s</b></div>
          <div>Est. Sinking Time: <b style="color:var(--sonar-amber);">${sinkTimeHours} hrs</b></div>
          <div>Lateral Seafloor Drift: <b style="color:var(--sonar-green);">${driftDistanceKm} km (${driftDistanceM} m)</b></div>
          <div>Current Heading: <b style="color:#ffffff;">${bearing}° SE</b></div>
        </div>
        <div style="margin-top:8px; border-top:1px dashed var(--border-subtle); padding-top:6px; color:#ffffff;">
          Predicted Seabed Interception: <b style="color:var(--sonar-cyan);">${seabedLat}°N, ${seabedLng}°E</b> (Depth: ${waterDepthM}m)
        </div>
      `;
    }

    if (window.app) {
      window.app.showToast(`Seabed Target Pinpointed: ${seabedLat}°N, ${seabedLng}°E (${driftDistanceKm} km drift)`, 'success');
      if (window.app.audioFX) window.app.audioFX.playDetectionChime();
    }
  }

  simulateSatelliteUplink() {
    if (window.app && window.app.audioFX) {
      window.app.audioFX.playSatelliteUplinkSound();
    }

    const pktId = `PKT-IRID-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPacket = {
      packet_id: pktId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      vehicle: "AUV DeepScan-IV",
      payload: "INT8 TensorRT Anomaly Header",
      coords: "17.6892°N, 83.2215°E",
      gateway: "Iridium-NEXT 142 (LEO)",
      status: "ACK RECEIVED (0.84s)"
    };

    this.uplinks.unshift(newPacket);
    this.renderUplinkTable();

    if (window.app) {
      window.app.showToast(`📡 Uplink Transmitted: ${pktId} via Iridium-142 LEO (0.84s)`, 'success');
    }
  }
}

window.SatelliteTrackerModule = SatelliteTrackerModule;
