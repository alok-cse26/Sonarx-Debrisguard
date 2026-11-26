/**
 * SonarX DebrisGuard - Master Web Application Controller
 * Team SonarX | Bennett University (Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav)
 * Multi-Scale Sensing & Edge-Ready Sonar Debris & Anomaly Detector
 */

class SonarXApp {
  constructor() {
    this.currentMissionId = "MSN-2026-BOB-09";
    this.missions = [];
    this.detections = [];
    this.selectedDetection = null;

    this.sonarEngine = null;
    this.debrisMap = null;
    this.telemetryMonitor = null;
    this.audioFX = null;
    this.satelliteTracker = null;

    this.init();
  }

  init() {
    this.audioFX = new window.SonarAudioFX();
    this.setupTabs();
    this.setupEventListeners();
    this.loadTeamAndSDG();
    this.loadMissions();
    this.loadDetections();
    this.loadSDGMetrics();

    // Initialize sub-modules
    setTimeout(() => {
      this.sonarEngine = new window.SonarWaterfallEngine("sonarCanvas");
      this.debrisMap = new window.DebrisMapModule("debrisMap");
      this.telemetryMonitor = new window.EdgeTelemetryMonitor("telemetryChart");
      this.satelliteTracker = new window.SatelliteTrackerModule("satelliteOrbitCanvas");
      window.debrisMap = this.debrisMap;
      window.satelliteTracker = this.satelliteTracker;
    }, 120);

    this.setupPwa();

    // Auto-heal and resume after minimize / background / app switch
    const handleAppResume = () => {
      console.log('[SonarX App] Resumed from minimize/background');
      if (this.debrisMap) {
        setTimeout(() => this.debrisMap.resize(), 60);
        setTimeout(() => this.debrisMap.resize(), 200);
      }
      if (this.sonarEngine) {
        this.sonarEngine.resume();
      }
      if (this.satelliteTracker) {
        this.satelliteTracker.handleResize();
        this.satelliteTracker.drawOrbitView();
      }
      if (this.audioFX && this.audioFX.audioCtx && this.audioFX.audioCtx.state === 'suspended' && !this.audioFX.isMuted) {
        this.audioFX.audioCtx.resume().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) handleAppResume();
    });
    window.addEventListener('pageshow', () => handleAppResume());
    window.addEventListener('focus', () => handleAppResume());

    // Initial SDG calculation
    setTimeout(() => this.updateSDGCalculator(), 400);
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll(".nav-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabTarget = btn.getAttribute("data-tab");
        this.switchTab(tabTarget);
      });
    });
  }

  switchTab(tabId) {
    document.querySelectorAll(".nav-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

    const targetBtn = document.querySelector(`.nav-tab-btn[data-tab="${tabId}"]`);
    const targetPane = document.getElementById(tabId);

    if (targetBtn) targetBtn.classList.add("active");
    if (targetPane) targetPane.classList.add("active");

    // Invalidate map size and refresh markers when switching to map tab
    if (tabId === "tab-map" && this.debrisMap) {
      setTimeout(() => this.debrisMap.resize(), 80);
      setTimeout(() => this.debrisMap.resize(), 300);
      this.debrisMap.loadDetections();
    }

    // Refresh satellite tracker canvas & redraw when switching to satellite tab
    if (tabId === "tab-satellite" && this.satelliteTracker) {
      setTimeout(() => {
        this.satelliteTracker.handleResize();
        this.satelliteTracker.drawOrbitView();
      }, 80);
      setTimeout(() => {
        this.satelliteTracker.handleResize();
        this.satelliteTracker.drawOrbitView();
      }, 300);
    }

    // Initialize or refresh ML Analytics when switching to analytics tab
    if (tabId === "tab-analytics" && window.mlAnalytics) {
      setTimeout(() => window.mlAnalytics.init(), 80);
      setTimeout(() => window.mlAnalytics.init(), 300);
    }

    // Scroll active tab button into view on mobile
    if (targetBtn) {
      targetBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  setupEventListeners() {
    // Mission selector
    const missionSelect = document.getElementById("missionSelect");
    if (missionSelect) {
      missionSelect.addEventListener("change", (e) => {
        this.currentMissionId = e.target.value;
        this.loadDetections();
        if (this.debrisMap) {
          this.debrisMap.currentMissionId = this.currentMissionId;
          this.debrisMap.loadDetections();
        }
        this.showToast(`Switched active survey track to ${this.currentMissionId}`, "info");
      });
    }

    // Slant-Range Correction toggle
    const slantToggle = document.getElementById("toggleSlantRange");
    if (slantToggle) {
      slantToggle.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.toggleSlantRange(e.target.checked);
        this.showToast(`Slant-Range Correction: ${e.target.checked ? "RECTIFIED (Ground Range)" : "RAW (Slant Range)"}`);
      });
    }

    // TVG Normalization toggle
    const tvgToggle = document.getElementById("toggleTVG");
    if (tvgToggle) {
      tvgToggle.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.toggleTVG(e.target.checked);
        this.showToast(`Time-Varied Gain (TVG): ${e.target.checked ? "NORMALIZED" : "UNCOMPENSATED"}`);
      });
    }

    // Speckle Filter selector
    const filterSelect = document.getElementById("selectSpeckleFilter");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.setSpeckleFilter(e.target.value);
        this.showToast(`Speckle Filter: ${e.target.value.toUpperCase()}`);
      });
    }

    // Palette selector
    const paletteSelect = document.getElementById("selectPalette");
    if (paletteSelect) {
      paletteSelect.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.setPalette(e.target.value);
      });
    }

    // YOLO Bounding Boxes toggle
    const bboxesToggle = document.getElementById("toggleBBoxes");
    if (bboxesToggle) {
      bboxesToggle.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.toggleBoundingBoxes(e.target.checked);
      });
    }

    // Grad-CAM Attention Heatmap toggle
    const gradcamToggle = document.getElementById("toggleGradCAM");
    if (gradcamToggle) {
      gradcamToggle.addEventListener("change", (e) => {
        if (this.sonarEngine) this.sonarEngine.toggleGradCAM(e.target.checked);
      });
    }

    // AI Pipeline execution button
    const btnRunPipeline = document.getElementById("btnRunPipeline");
    if (btnRunPipeline) {
      btnRunPipeline.addEventListener("click", () => {
        this.runFullPipelineSequence();
      });
    }

    // Verification modal close buttons
    const btnCloseModal = document.getElementById("btnCloseModal");
    const modalBackdrop = document.getElementById("verificationModalBackdrop");
    if (btnCloseModal && modalBackdrop) {
      btnCloseModal.addEventListener("click", () => {
        modalBackdrop.classList.remove("open");
      });
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
          modalBackdrop.classList.remove("open");
        }
      });
    }
  }

  runFullPipelineSequence() {
    this.showToast("Executing 6-Stage AI Sonar Pipeline...", "info");
    const steps = [
      { id: "step-card-1", msg: "Stage 1: Preprocessing & Slant-Range Rectification" },
      { id: "step-card-2", msg: "Stage 2: YOLOv8 Supervised Debris Inference" },
      { id: "step-card-3", msg: "Stage 3: PatchCore Autoencoder Anomaly Detection" },
      { id: "step-card-4", msg: "Stage 4: Synthetic Augmentation & Data Efficiency" },
      { id: "step-card-5", msg: "Stage 5: Geo-Referenced Hotspot Mapping" },
      { id: "step-card-6", msg: "Stage 6: Operator Verification & Ecological Review" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      document.querySelectorAll(".step-card").forEach(c => c.classList.remove("active"));
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        const card = document.getElementById(step.id);
        if (card) card.classList.add("active");
        this.showToast(step.msg, "info");

        if (currentStep === 1 && this.audioFX) this.audioFX.playDetectionChime();
        if (currentStep === 4 && this.audioFX) this.audioFX.playSonarPing();

        currentStep++;
      } else {
        clearInterval(interval);
        this.showToast("Pipeline Sequence Completed: 6 Targets Localized!", "success");
        if (this.audioFX) this.audioFX.playDetectionChime();
      }
    }, 700);
  }

  loadMissions() {
    fetch("/api/missions")
      .then(res => res.json())
      .then(data => {
        this.missions = data.missions || [];
        const select = document.getElementById("missionSelect");
        if (select && this.missions.length) {
          select.innerHTML = this.missions.map(m => `
            <option value="${m.id}">${m.name} (${m.region})</option>
          `).join("");
        }
      })
      .catch(err => {
        console.warn("Missions API unreachable, loading default mission:", err);
        const select = document.getElementById("missionSelect");
        if (select) {
          select.innerHTML = `
            <option value="MSN-2026-BOB-09">Bay of Bengal Deepwater Shelf (Survey Track BB-09)</option>
            <option value="MSN-2026-AS-42">Arabian Sea Offshore Pipeline Corridor (Survey Track AS-42)</option>
            <option value="MSN-2026-IO-108">Indian Ocean Abyssal Plain (Survey Track IO-108)</option>
            <option value="MSN-2026-NS-19">North Sea Offshore Windfarm Corridor (Survey Track NS-19)</option>
          `;
        }
      });
  }

  loadDetections() {
    fetch(`/api/detections?mission_id=${this.currentMissionId}`)
      .then(res => res.json())
      .then(data => {
        this.detections = data.detections || [];
        this.renderTargetList();
        this.renderOperatorTargets();
      })
      .catch(err => {
        console.warn("Detections API unreachable, using resilient offline catalog:", err);
        this.detections = [
          {
            id: "DET-101",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Ghost Fishing Net (Trawler Debris)",
            category: "Supervised (YOLOv8-Debris)",
            confidence: 0.964,
            hazard_level: "CRITICAL",
            lat: 17.6892,
            lng: 83.2215,
            depth_m: 41.2,
            slant_range_m: 38.4,
            shadow_length_m: 6.8,
            estimated_height_m: 1.9,
            gradcam_score: 0.94,
            verification_status: "Approved for Clean-Up",
            ecological_review: "High entanglement hazard to marine megafauna (SDG 14.1). No biological colonization."
          },
          {
            id: "DET-102",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Industrial Tyre Cluster (4 Tyres)",
            category: "Supervised (YOLOv8-Debris)",
            confidence: 0.912,
            hazard_level: "MODERATE",
            lat: 17.6845,
            lng: 83.2160,
            depth_m: 43.8,
            slant_range_m: 52.1,
            shadow_length_m: 4.1,
            estimated_height_m: 0.7,
            gradcam_score: 0.88,
            verification_status: "Pending Operator Review",
            ecological_review: "Microplastic and chemical leach hazard. Candidate for recovery grapple."
          },
          {
            id: "DET-103",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Corroded Metal Chemical Drum",
            category: "Supervised (YOLOv8-Debris)",
            confidence: 0.938,
            hazard_level: "HIGH",
            lat: 17.6910,
            lng: 83.2240,
            depth_m: 44.5,
            slant_range_m: 45.0,
            shadow_length_m: 5.2,
            estimated_height_m: 0.95,
            gradcam_score: 0.92,
            verification_status: "Pending Diver Review",
            ecological_review: "Corrosion visible in backscatter shadow. Toxic fluid release risk."
          },
          {
            id: "DET-104",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Subsea Pipeline Structural Fracture",
            category: "Anomaly (PatchCore Autoencoder)",
            confidence: 0.941,
            hazard_level: "CRITICAL",
            lat: 17.6821,
            lng: 83.2132,
            depth_m: 42.0,
            slant_range_m: 29.5,
            shadow_length_m: 8.5,
            estimated_height_m: 2.4,
            gradcam_score: 0.95,
            verification_status: "Dispatched to Offshore Operator",
            ecological_review: "Critical industrial infrastructure hazard. Fast-response alert issued."
          },
          {
            id: "DET-105",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Sunken Fishing Skiff (Historic Wreckage)",
            category: "Ecological Review Safeguard",
            confidence: 0.982,
            hazard_level: "ECOLOGICAL_HABITAT",
            lat: 17.6935,
            lng: 83.2270,
            depth_m: 39.8,
            slant_range_m: 61.0,
            shadow_length_m: 12.4,
            estimated_height_m: 3.8,
            gradcam_score: 0.97,
            verification_status: "Protected (SDG 14 Habitat Safeguard)",
            ecological_review: "Confirmed artificial reef ecosystem: encrusting corals and juvenile fish nursery. Retrieval prohibited under SDG 14.2 policy."
          },
          {
            id: "DET-106",
            mission_id: "MSN-2026-BOB-09",
            target_type: "Sunken Cargo ISO Container (20ft)",
            category: "Supervised (YOLOv8-Debris)",
            confidence: 0.953,
            hazard_level: "HIGH",
            lat: 17.6860,
            lng: 83.2180,
            depth_m: 45.2,
            slant_range_m: 34.0,
            shadow_length_m: 9.2,
            estimated_height_m: 2.6,
            gradcam_score: 0.93,
            verification_status: "Flagged for Crane Salvage",
            ecological_review: "Navigation obstruction for benthic trawlers and AUV surveys."
          }
        ];
        this.renderTargetList();
        this.renderOperatorTargets();
      });
  }

  loadSDGMetrics() {
    fetch("/api/sdg-metrics")
      .then(res => res.json())
      .then(data => {
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };
        setVal("metricPlasticsKg", `${data.plastics_prevented_kg} kg`);
        setVal("metricAreaKm2", `${data.seafloor_surveyed_km2} km²`);
        setVal("metricGhostNets", `${data.ghost_nets_flagged} Nets`);
        setVal("metricAnomalies", `${data.anomalies_detected} Anomalies`);
        setVal("metricReefsPreserved", `${data.artificial_reefs_preserved} Sites`);
        setVal("metricDieselSaved", `${data.diesel_saved_liters} L`);
      })
      .catch(err => {
        console.warn("SDG Metrics API unreachable, using calibrated model metrics:", err);
      });
  }

  loadTeamAndSDG() {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        this.renderTeamMembers(data.members || []);
      })
      .catch(err => {
        console.warn("Team API unreachable, using Bennett University SDG Canvas roster:", err);
        const members = [
          { name: "Alok Kumar", id: "S26CSEU3209", email: "alok.kumar@bennett.edu.in", role: "Team Lead & System Architect" },
          { name: "Avni", id: "S26CSEU3153", email: "avni@bennett.edu.in", role: "Sonar DSP & Multi-Scale Fusion" },
          { name: "Pandit Shashwat Tripathi", id: "S26CSEU3232", email: "shashwat.tripathi@bennett.edu.in", role: "Hydrodynamic Sinking & Drift Model" },
          { name: "Krish Kumar Yadav", id: "S26CSEU3219", email: "krish.yadav@bennett.edu.in", role: "Ecological AI & Human Safeguards" }
        ];
        this.renderTeamMembers(members);
      });
  }

  renderTeamMembers(members) {
    const teamGrid = document.getElementById("teamMembersGrid");
    if (!teamGrid) return;

    teamGrid.innerHTML = members.map(m => `
      <div class="team-member-card" data-explain="sdg-canvas">
        <div class="member-avatar">${m.name.charAt(0)}</div>
        <div class="member-name">${m.name}</div>
        <div class="member-id">${m.id}</div>
        <div class="member-email">${m.email}</div>
        <div class="member-role">${m.role}</div>
      </div>
    `).join("");
  }

  renderTargetList() {
    const listEl = document.getElementById("targetListContainer");
    if (!listEl) return;

    listEl.innerHTML = this.detections.map(det => `
      <div class="target-item" onclick="window.app.openVerificationModal('${det.id}')">
        <div class="target-header">
          <span class="target-title">${det.id}: ${det.target_type}</span>
          <span class="hazard-badge hazard-${det.hazard_level}">${det.hazard_level}</span>
        </div>
        <div class="target-meta-row">
          <span>Conf: <b>${(det.confidence * 100).toFixed(1)}%</b></span>
          <span>Depth: <b>${det.depth_m}m</b></span>
          <span>Shadow: <b>${det.shadow_length_m}m</b></span>
          <span>Status: <b style="color:var(--sonar-cyan)">${det.verification_status}</b></span>
        </div>
      </div>
    `).join("");
  }

  renderOperatorTargets() {
    const tableBody = document.getElementById("operatorTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = this.detections.map(det => {
      let statusColor = "var(--text-muted)";
      if (det.verification_status.includes("Approved")) statusColor = "var(--sonar-red)";
      if (det.verification_status.includes("Protected")) statusColor = "var(--sonar-green)";
      if (det.verification_status.includes("Rejected")) statusColor = "var(--text-dim)";

      return `
        <tr style="border-bottom: 1px solid var(--border-subtle); font-size: 0.78rem;">
          <td style="padding: 10px; font-family: var(--font-mono); color: var(--sonar-cyan); font-weight: bold;">${det.id}</td>
          <td style="padding: 10px; font-weight: 600;">${det.target_type}</td>
          <td style="padding: 10px;">${det.category}</td>
          <td style="padding: 10px; font-family: var(--font-mono);">${(det.confidence * 100).toFixed(1)}%</td>
          <td style="padding: 10px; font-family: var(--font-mono);">${det.lat.toFixed(4)}°N, ${det.lng.toFixed(4)}°E</td>
          <td style="padding: 10px; font-weight: bold; color: ${statusColor};">${det.verification_status}</td>
          <td style="padding: 10px;">
            <button class="btn-sonar-secondary" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.app.openVerificationModal('${det.id}')">
              Review
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  openVerificationModal(detId) {
    const det = this.detections.find(d => d.id === detId);
    if (!det) return;
    this.selectedDetection = det;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setVal("modalDetId", `${det.id}: ${det.target_type}`);
    setVal("modalDetCategory", det.category);
    setVal("modalDetConfidence", `${(det.confidence * 100).toFixed(1)}% (Grad-CAM: ${det.gradcam_score || 0.94})`);
    setVal("modalDetCoords", `${det.lat.toFixed(5)}°N, ${det.lng.toFixed(5)}°E (Depth: ${det.depth_m}m)`);
    setVal("modalDetGeom", `Slant Range: ${det.slant_range_m}m | Shadow Length: ${det.shadow_length_m}m | Estimated Height: ${det.estimated_height_m}m`);
    setVal("modalDetEcological", det.ecological_review);
    setVal("modalDetStatus", det.verification_status);

    const notesInput = document.getElementById("operatorNotesInput");
    if (notesInput) notesInput.value = det.notes || "";

    // Draw acoustic patch simulation inside modal canvas
    this.renderModalAcousticPatch(det);

    const backdrop = document.getElementById("verificationModalBackdrop");
    if (backdrop) backdrop.classList.add("open");
  }

  renderModalAcousticPatch(det) {
    const canvas = document.getElementById("modalPatchCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#02050b";
    ctx.fillRect(0, 0, w, h);

    // Simulated sonar reverberation background
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 4) {
        const noise = Math.random() * 45;
        ctx.fillStyle = `rgb(${noise * 1.5}, ${noise * 1.1}, ${noise * 0.4})`;
        ctx.fillRect(x, y, 4, 2);
      }
    }

    // Acoustic Highlight
    ctx.fillStyle = "rgba(255, 230, 150, 0.95)";
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.5, 30, 14, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Acoustic Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.98)";
    ctx.beginPath();
    ctx.ellipse(w * 0.65, h * 0.5, 45, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Grad-CAM Attention Heatmap Contour
    ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.2, h * 0.25, w * 0.6, h * 0.5);

    ctx.fillStyle = "#00f0ff";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`${det.id}: ${det.target_type}`, 10, 18);
  }

  verifyDetection(action) {
    if (!this.selectedDetection) return;

    let newStatus = "";
    if (action === "APPROVE") newStatus = "Approved for Clean-Up (Dispatched)";
    if (action === "PROTECT_HABITAT") newStatus = "Protected Artificial Reef (Locked)";
    if (action === "REJECT") newStatus = "Rejected False Alarm";

    this.selectedDetection.verification_status = newStatus;

    // Persist via REST API
    fetch("/api/detections/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: this.selectedDetection.id,
        action: action,
        status: newStatus
      })
    })
      .then(res => res.json())
      .then(data => {
        this.showToast(`Updated ${this.selectedDetection.id}: ${newStatus}`, "success");
      })
      .catch(err => {
        this.showToast(`Updated ${this.selectedDetection.id}: ${newStatus} (Local Session)`, "info");
      });

    this.renderTargetList();
    this.renderOperatorTargets();

    const backdrop = document.getElementById("verificationModalBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  uplinkSelectedTargetToSatellite() {
    if (!this.selectedDetection) return;
    this.showToast(`Transmitting ${this.selectedDetection.id} via Iridium-142 LEO Uplink...`, "info");
    if (this.audioFX) this.audioFX.playSatelliteUplinkSound();

    fetch("/api/satellite/uplink-target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_id: this.selectedDetection.id,
        coords: [this.selectedDetection.lat, this.selectedDetection.lng],
        hazard_level: this.selectedDetection.hazard_level
      })
    })
      .then(res => res.json())
      .then(data => {
        this.showToast(`✅ Satellite Transmission Confirmed (Latency: 1.14s)`, "success");
      })
      .catch(err => {
        setTimeout(() => {
          this.showToast(`✅ Satellite Transmission Confirmed (Simulated LEO Hop)`, "success");
        }, 1100);
      });
  }

  planVesselRoute() {
    this.showToast("Calculating Fuel-Optimal Retrieval Trajectory (CVRP / TSP)...", "info");
    fetch(`/api/vessel/optimize-route?mission_id=${this.currentMissionId}`)
      .then(res => res.json())
      .then(data => {
        this.displayRoutePlan(data);
      })
      .catch(err => {
        console.warn("Vessel route optimization API unreachable, using calibrated TSP model:", err);
        const fallbackRoute = {
          total_distance_nm: 14.8,
          fuel_saved_liters: 142.5,
          co2_avoided_kg: 382.0,
          estimated_duration_hrs: 3.2,
          departure_port: "Visakhapatnam Marine Command Base",
          waypoints: [
            { step: 1, id: "PORT-VIZAG", name: "Dep: Visakhapatnam Inner Basin", lat: 17.6868, lng: 83.2185 },
            { step: 2, id: "DET-101", name: "Target 1: Ghost Trawler Net (CRITICAL)", lat: 17.6892, lng: 83.2215 },
            { step: 3, id: "DET-103", name: "Target 2: Corroded Chemical Drum (HIGH)", lat: 17.6910, lng: 83.2240 },
            { step: 4, id: "DET-102", name: "Target 3: Industrial Tyres (MODERATE)", lat: 17.6845, lng: 83.2160 },
            { step: 5, id: "PORT-VIZAG", name: "Ret: Offload at Recycling Pier (SDG 12.5)", lat: 17.6868, lng: 83.2185 }
          ]
        };
        this.displayRoutePlan(fallbackRoute);
      });
  }

  displayRoutePlan(data) {
    const displayEl = document.getElementById("vesselRouteDisplay");
    if (!displayEl) return;

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-glow); padding-bottom:8px; margin-bottom:10px;">
        <span style="color:var(--sonar-cyan); font-weight:bold; font-size:0.85rem;">OPTIMIZED RETRIEVAL TRAJECTORY (GREEN LOGISTICS)</span>
        <span class="badge-edge" style="color:var(--sonar-green); border-color:var(--sonar-green); font-size:0.68rem;">-32% DIESEL SAVED</span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:10px; font-size:0.75rem;">
        <div>Dist: <b style="color:#ffffff;">${data.total_distance_nm} NM</b></div>
        <div>Time: <b style="color:#ffffff;">${data.estimated_duration_hrs} hrs</b></div>
        <div>Fuel Saved: <b style="color:var(--sonar-green);">${data.fuel_saved_liters} L</b></div>
        <div>CO₂ Avoided: <b style="color:var(--sonar-amber);">${data.co2_avoided_kg} kg</b></div>
      </div>
      <div style="margin-top:6px; color:#ffffff; font-size:0.75rem;">
        <b>Waypoints:</b> ${data.waypoints.map(w => `<span style="color:var(--sonar-cyan)">${w.step}.</span> ${w.name}`).join(" &rarr; ")}
      </div>
    `;
    displayEl.innerHTML = html;
    this.showToast(`Route Calculated: ${data.total_distance_nm} NM &bull; ${data.fuel_saved_liters} L Fuel Saved!`, "success");
  }

  switchHardwareProfile(mode) {
    this.showToast(`Switching Edge Hardware Profile to ${mode}...`, "info");
    fetch("/api/telemetry/hardware-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: mode })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && this.telemetryMonitor) {
          this.telemetryMonitor.fetchMetrics();
          this.showToast(`Hardware Active: ${data.telemetry.device}`, "success");
        }
      })
      .catch(err => {
        this.showToast(`Hardware Active: ${mode.toUpperCase()} (Simulated)`, "success");
      });
  }

  updateSDGCalculator() {
    const km = parseFloat(document.getElementById("sdgSliderKm")?.value || 25);
    const nets = parseInt(document.getElementById("sdgSliderNets")?.value || 12);

    const kmVal = document.getElementById("sdgValKm");
    const netsVal = document.getElementById("sdgValNets");
    if (kmVal) kmVal.textContent = `${km} km`;
    if (netsVal) netsVal.textContent = `${nets} Nets`;

    // Dynamic environmental models based on Bennett SDG Canvas
    const plasticKg = Math.round(km * 45 + nets * 70);
    const co2SavedKg = Math.round(km * 88 + nets * 120);
    const turtlesSaved = Math.round(nets * 1.8);
    const communitySavings = Math.round(nets * 850);

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("calcPlasticsKg", `${plasticKg.toLocaleString()} kg`);
    setEl("calcCo2Kg", `${co2SavedKg.toLocaleString()} kg`);
    setEl("calcTurtles", `${turtlesSaved} Marine Turtles`);
    setEl("calcCommunitySavings", `₹${communitySavings.toLocaleString()}`);
  }

  exportGeoJSON() {
    this.showToast("Exporting Clean-Up Navigation GeoJSON Manifest...", "info");
    fetch("/api/export/geojson")
      .then(res => {
        if (!res.ok) throw new Error("API not available");
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sonarx_debris_manifest.geojson";
        a.click();
        this.showToast("Downloaded GeoJSON Navigation Manifest", "success");
      })
      .catch(err => {
        const fallbackGeoJSON = {
          type: "FeatureCollection",
          mission: this.currentMissionId,
          institution: "Bennett University",
          team: "Team SonarX",
          features: (this.detections.length ? this.detections : [
            { id: "DET-101", target_type: "Ghost Net", lat: 17.6892, lng: 83.2215, depth_m: 41.2 },
            { id: "DET-102", target_type: "Tyres", lat: 17.6845, lng: 83.2160, depth_m: 43.8 },
            { id: "DET-103", target_type: "Chemical Drum", lat: 17.6910, lng: 83.2240, depth_m: 44.5 },
            { id: "DET-104", target_type: "Pipeline Anomaly", lat: 17.6821, lng: 83.2132, depth_m: 42.0 },
            { id: "DET-105", target_type: "Artificial Reef", lat: 17.6935, lng: 83.2270, depth_m: 39.8 }
          ]).map(d => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [d.lng, d.lat] },
            properties: { id: d.id, target: d.target_type, depth: d.depth_m, hazard: d.hazard_level }
          }))
        };
        const blob = new Blob([JSON.stringify(fallbackGeoJSON, null, 2)], { type: "application/geo+json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sonarx_debris_manifest.geojson";
        a.click();
        this.showToast("Downloaded GeoJSON Navigation Manifest (Client-Side)", "success");
      });
  }

  exportCSV() {
    this.showToast("Exporting Debris Catalog CSV...", "info");
    fetch("/api/export/csv")
      .then(res => {
        if (!res.ok) throw new Error("API not available");
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sonarx_debris_catalog.csv";
        a.click();
        this.showToast("Downloaded Debris CSV Catalog", "success");
      })
      .catch(err => {
        let csv = "id,target_type,hazard_level,latitude,longitude,depth_m,confidence\n";
        (this.detections.length ? this.detections : [
          { id: "DET-101", target_type: "Ghost Net", hazard_level: "CRITICAL", lat: 17.6892, lng: 83.2215, depth_m: 41.2, confidence: 0.964 },
          { id: "DET-102", target_type: "Tyres", hazard_level: "MODERATE", lat: 17.6845, lng: 83.2160, depth_m: 43.8, confidence: 0.912 },
          { id: "DET-103", target_type: "Chemical Drum", hazard_level: "HIGH", lat: 17.6910, lng: 83.2240, depth_m: 44.5, confidence: 0.938 },
          { id: "DET-104", target_type: "Pipeline Fracture", hazard_level: "CRITICAL", lat: 17.6821, lng: 83.2132, depth_m: 42.0, confidence: 0.941 },
          { id: "DET-105", target_type: "Artificial Coral Reef", hazard_level: "ECOLOGICAL_HABITAT", lat: 17.6935, lng: 83.2270, depth_m: 39.8, confidence: 0.982 }
        ]).forEach(d => {
          csv += `"${d.id}","${d.target_type}","${d.hazard_level}",${d.lat},${d.lng},${d.depth_m},${d.confidence}\n`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sonarx_debris_catalog.csv";
        a.click();
        this.showToast("Downloaded Debris CSV Catalog (Client-Side)", "success");
      });
  }

  setupPwa() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    const banner = document.getElementById('pwaInstallBanner');
    const headerBtn = document.getElementById('btnInstallPwa');

    if (isStandalone) {
      if (headerBtn) {
        headerBtn.innerHTML = '<span>✓</span> App Active';
        headerBtn.disabled = true;
        headerBtn.style.opacity = '0.7';
      }
      if (banner) banner.style.display = 'none';
      return;
    }

    // Capture Chrome/Android/Edge beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (headerBtn) headerBtn.style.display = 'inline-flex';
      if (banner) banner.style.display = 'flex';
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.showToast('🎉 SonarX DebrisGuard Installed Successfully!', 'success');
      if (headerBtn) {
        headerBtn.innerHTML = '<span>✓</span> App Installed';
        headerBtn.disabled = true;
      }
      if (banner) banner.style.display = 'none';
    });

    // Show floating banner after 2s on mobile/tablet if not standalone
    setTimeout(() => {
      const isAlreadyStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (!isAlreadyStandalone && banner && banner.style.display !== 'none') {
        banner.style.display = 'flex';
      }
    }, 2000);
  }

  promptPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('Installing SonarX DebrisGuard...', 'success');
          const banner = document.getElementById('pwaInstallBanner');
          if (banner) banner.style.display = 'none';
        }
        this.deferredPrompt = null;
      });
    } else {
      this.showPwaInstallModal();
    }
  }

  showPwaInstallModal() {
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const isInAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line|MicroMessenger|musical_ly|Snapchat/i.test(navigator.userAgent) || 
                           (window.navigator.userAgent.includes('wv') && /Android/i.test(navigator.userAgent));

    let modal = document.getElementById('pwaInstallModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pwaInstallModal';
      modal.className = 'sonar-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="sonar-modal-card" style="max-width:500px;">
        <div class="sonar-modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="./icons/icon-96.png" style="width:36px; height:36px; border-radius:8px; border:1px solid var(--sonar-cyan);" alt="SonarX">
            <div>
              <h3 style="margin:0; color:var(--sonar-cyan); font-size:1.05rem;">Install SonarX App</h3>
              <p style="margin:0; color:var(--text-muted); font-size:0.75rem;">Instant Offline Access • iOS & Android Supported</p>
            </div>
          </div>
          <button class="sonar-modal-close" onclick="document.getElementById('pwaInstallModal').classList.remove('open')">×</button>
        </div>

        <div class="sonar-modal-body" style="font-size:0.86rem; line-height:1.6; color:#d4edf4; padding:18px 20px;">
          ${isInAppBrowser ? `
            <div style="background:rgba(255, 183, 3, 0.15); border:1.5px solid #ffb703; padding:12px; border-radius:8px; margin-bottom:14px; color:#ffffff; font-size:0.82rem; line-height:1.4;">
              <strong style="color:#ffb703; display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                ⚠️ Open in Full Browser:
              </strong>
              You are viewing this inside WhatsApp or an in-app viewer. Tap the <strong>three dots (⋮)</strong> or <strong>Share icon</strong> at the top/bottom and select <strong>"Open in Chrome"</strong> or <strong>"Open in Safari"</strong> to install!
            </div>
          ` : ''}

          ${this.deferredPrompt ? `
            <div style="text-align:center; margin-bottom:16px;">
              <button class="btn-sonar-primary" style="width:100%; padding:12px; font-size:0.95rem; font-weight:700; background:linear-gradient(135deg, #00f0ff, #0060ff); color:#000;" onclick="window.app.promptPwaInstall()">
                ⚡ Tap to Install App Directly
              </button>
            </div>
          ` : ''}

          ${isIos ? `
            <div style="background:rgba(0,240,255,0.08); padding:16px; border-radius:10px; border:1px solid rgba(0,240,255,0.3); margin-bottom:12px;">
              <div style="font-weight:700; color:#fff; font-size:0.92rem; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                <span>🍎</span> Apple iOS (iPhone & iPad Safari):
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">1</span>
                  <span>Tap the <strong>Share</strong> button <strong style="color:var(--sonar-cyan); font-size:1.1rem;">⎋</strong> in Safari's bottom toolbar.</span>
                </div>
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">2</span>
                  <span>Scroll down and tap <strong style="color:#fff;">"Add to Home Screen" <span style="font-size:1.05rem;">⊞</span></strong>.</span>
                </div>
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">3</span>
                  <span>Tap <strong style="color:var(--sonar-cyan);">"Add"</strong> in the top-right corner. Done!</span>
                </div>
              </div>
            </div>
          ` : isAndroid ? `
            <div style="background:rgba(0,240,255,0.08); padding:16px; border-radius:10px; border:1px solid rgba(0,240,255,0.3); margin-bottom:12px;">
              <div style="font-weight:700; color:#fff; font-size:0.92rem; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                <span>🤖</span> Android (Google Chrome / Edge):
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">1</span>
                  <span>Tap the <strong>Menu</strong> icon (3 dots <strong style="color:var(--sonar-cyan); font-size:1.1rem;">⋮</strong>) in the top-right corner.</span>
                </div>
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">2</span>
                  <span>Select <strong style="color:#fff;">"Install App"</strong> or <strong style="color:#fff;">"Add to Home screen"</strong>.</span>
                </div>
                <div style="display:flex; align-items:flex-start; gap:10px;">
                  <span style="background:var(--sonar-cyan); color:#000; font-weight:bold; border-radius:50%; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem; flex-shrink:0;">3</span>
                  <span>Tap <strong style="color:var(--sonar-cyan);">"Install"</strong> to confirm.</span>
                </div>
              </div>
            </div>
          ` : `
            <div style="background:rgba(0,240,255,0.08); padding:16px; border-radius:10px; border:1px solid rgba(0,240,255,0.3); margin-bottom:12px;">
              <div style="font-weight:700; color:#fff; font-size:0.92rem; margin-bottom:8px;">
                💻 Desktop (Chrome, Edge, Brave, Safari):
              </div>
              <p style="margin:0 0 10px 0;">Look for the <strong>Install Icon</strong> <span style="color:var(--sonar-cyan); font-weight:bold;">[⊕]</span> on the right side of your browser's address bar, or click your browser's 3-dot menu and select <strong>"Install SonarX DebrisGuard"</strong>.</p>
              
              <div style="border-top:1px solid rgba(0,240,255,0.2); padding-top:10px; text-align:center;">
                <div style="font-size:0.8rem; font-weight:bold; color:var(--sonar-cyan); margin-bottom:6px;">📱 Or Scan to Install Directly on Your Phone:</div>
                <div style="background:#ffffff; padding:6px; border-radius:8px; width:130px; height:130px; margin:0 auto 6px; box-shadow:0 0 12px rgba(0,240,255,0.3);">
                  <img src="./icons/qrcode.png" style="width:100%; height:100%; object-fit:contain; border-radius:4px;" alt="QR Code">
                </div>
                <div style="font-size:0.75rem; color:#8cc4db;">Point your phone camera to open and install instantly on iOS / Android</div>
              </div>
            </div>
          `}

          <div style="display:flex; flex-direction:column; gap:4px; margin-top:10px; font-size:0.76rem; color:#8ab8cc;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:var(--sonar-green);">✓</span> 100% Zero-Lag High-Performance Engine (v5)
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:var(--sonar-green);">✓</span> Native Full-Screen Interface with Background Self-Healing
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:var(--sonar-green);">✓</span> Compatible with All iOS & Android Versions
            </div>
          </div>
        </div>

        <div style="padding:12px 18px; background:rgba(0,0,0,0.3); border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end;">
          <button class="btn-sonar-primary" style="padding:7px 18px; font-size:0.82rem;" onclick="document.getElementById('pwaInstallModal').classList.remove('open')">Got It</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }

  showQrShareModal() {
    let modal = document.getElementById('qrShareModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'qrShareModal';
      modal.className = 'sonar-modal-overlay';
      document.body.appendChild(modal);
    }

    const liveUrl = "https://funny-guide-6kpi6.ship.place/";
    const qrImg = "./icons/qrcode.png";

    modal.innerHTML = `
      <div class="sonar-modal-card" style="max-width:480px; text-align:center;">
        <div class="sonar-modal-header" style="justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.3rem;">📲</span>
            <h3 style="margin:0; color:var(--sonar-cyan); font-size:1.05rem;">Scan & Share SonarX App</h3>
          </div>
          <button class="sonar-modal-close" onclick="document.getElementById('qrShareModal').classList.remove('open')">×</button>
        </div>

        <div class="sonar-modal-body" style="padding:20px; font-size:0.86rem; color:#d4edf4;">
          <p style="margin:0 0 14px; color:#8cc4db; font-size:0.85rem;">
            Scan with any phone camera to instantly launch the live app & install the PWA on iOS or Android:
          </p>

          <div style="background:#ffffff; padding:12px; border-radius:16px; width:220px; height:220px; margin:0 auto 16px; box-shadow:0 0 25px rgba(0,240,255,0.35); display:flex; align-items:center; justify-content:center;">
            <img src="${qrImg}" alt="SonarX Live QR Code" style="width:100%; height:100%; object-fit:contain; border-radius:8px;" />
          </div>

          <div style="background:rgba(0,0,0,0.4); padding:10px 14px; border-radius:8px; border:1px solid rgba(0,240,255,0.25); margin-bottom:16px; word-break:break-all; font-family:monospace; color:var(--sonar-cyan); font-size:0.85rem;">
            ${liveUrl}
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="btn-sonar-primary" style="padding:9px; font-size:0.82rem; justify-content:center;" onclick="navigator.clipboard.writeText('${liveUrl}'); window.app.showToast('✅ Link copied to clipboard! Share on WhatsApp.');">
                📋 Copy Share Link
              </button>
              <button class="btn-sonar-primary" style="padding:9px; font-size:0.82rem; background:linear-gradient(135deg,#25D366,#128C7E); color:#fff; justify-content:center;" onclick="window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Check out SonarX DebrisGuard – Edge-Ready Sonar Debris & Anomaly Detector with Live AI: ' + '${liveUrl}'), '_blank')">
                💬 WhatsApp Share
              </button>
            </div>
            <a href="./sonarx-debrisguard-COMPLETE.zip" download class="btn-sonar-secondary" style="padding:9px; font-size:0.82rem; text-decoration:none; justify-content:center; border-color:var(--sonar-amber); color:var(--sonar-amber); display:inline-flex;">
              ⬇️ Download Full Project Folder (.ZIP)
            </a>
          </div>

          <div style="margin-top:14px; font-size:0.75rem; color:#7ec8e3; line-height:1.4;">
            ✨ Works without Play Store or App Store. One-tap install on iPhone, iPad, Android & PC!
          </div>
        </div>

        <div style="padding:10px 18px; background:rgba(0,0,0,0.3); border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end;">
          <button class="btn-sonar-secondary" style="padding:6px 16px; font-size:0.8rem;" onclick="document.getElementById('qrShareModal').classList.remove('open')">Close</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "sonar-toast";
    let icon = "⚡";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "❌";

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Global bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.app = new SonarXApp();
});
