/**
 * SonarX DebrisGuard - Comprehensive Knowledge & Explainer Engine
 * "Click Anything to Understand What It Is & How It Works"
 * Team SonarX | Bennett University (Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav)
 */

class SonarXInspector {
  constructor() {
    this.modal = null;
    this.tourModal = null;
    this.currentTourStep = 0;
    this.isInspectorModeActive = false;

    // 40+ Deep-Tech Concepts covering Acoustic DSP, AI, Satellites, SDG 14 & Hardware
    this.knowledgeBase = {
      'ml-analytics': {
        title: "Edge AI & NLP Marine Intelligence",
        category: "Deep Learning, Data Science & Transformer NLP",
        badge: "mAP@0.5: 94.2% | TensorRT INT8",
        badgeColor: "#00f0ff",
        icon: "🤖",
        summary: "Multi-modal AI stack combining YOLOv8-SSS object detection, PatchCore anomaly memory banks, INT8 quantization (13.5ms edge latency), and marine NLP entity extraction.",
        whatIsIt: "SonarX uses an end-to-end data science & AI pipeline running embedded on Nvidia Jetson Orin. It ingests high-frequency acoustic pings, runs 6-stage convolutional feature extraction, and classifies seabed targets in real time with 94.2% mean Average Precision while maintaining sub-15ms inference speed.",
        howItWorks: "1. <strong>YOLOv8-SSS:</strong> Custom backbone trained on 8,400+ georeferenced synthetic & real acoustic waterfall tiles.<br>2. <strong>PatchCore Anomaly Detection:</strong> Stores coreset memory banks of clean seabed backscatter to flag unknown anomalies (unexploded munitions, pipeline ruptures) with zero prior training data.<br>3. <strong>INT8 Quantization:</strong> FP32 weights calibrated down to 8-bit integers via TensorRT, slashing power consumption to 15 Watts suitable for battery-limited AUVs.<br>4. <strong>Marine NLP:</strong> Transformer Bi-LSTM parses operator query notes, extracting entities (debris type, coordinates, depth, material) with automated severity scoring.",
        sdgImpact: "Prevents false alarms and ensures 97.1% AUROC discrimination between critical ghost nets and beneficial colonized artificial reefs (SDG 14.1 & 14.2).",
        actionBtn: "Open AI Analytics Tab",
        actionFn: () => {
          if (window.app) window.app.switchTab('tab-analytics');
        }
      },

      'oceanai-bot': {
        title: "OceanAI Conversational Marine Assistant",
        category: "Natural Language Processing & AI Reasoning",
        badge: "NLP Intent Engine",
        badgeColor: "#00ff88",
        icon: "💬",
        summary: "Context-aware conversational AI assistant capable of answering questions regarding sonar physics, marine debris types, ocean missions, team credentials, and SDG impacts.",
        whatIsIt: "OceanAI is a client-side NLP chatbot built directly into SonarX. It provides instant technical guidance to marine scientists, vessel operators, and students using pattern matching and semantic classification.",
        howItWorks: "Evaluates tokenized user input against an extensive marine ontology spanning acoustic physics, satellite SAR drift mechanics, UN SDG 14 guidelines, and Team SonarX research at Bennett University. Delivers formatted markdown answers with quick suggested action prompts.",
        sdgImpact: "Democratizes ocean engineering knowledge for global researchers, maritime pilots, and environmental policy makers.",
        actionBtn: "Open OceanAI Chat",
        actionFn: () => {
          if (window.oceanAIBot) window.oceanAIBot.open();
        }
      },

      'slant-range': {
        title: "Slant-Range Geometric Correction",
        category: "Underwater Acoustic Geometry & DSP",
        badge: "R_gr = √(R_s² - H²)",
        badgeColor: "#00f0ff",
        icon: "📐",
        summary: "Converts raw acoustic slant-range (diagonal water distance) to true horizontal seafloor distance, removing the blind nadir zone and restoring true 1:1 real-world debris dimensions.",
        whatIsIt: "Raw side-scan sonar measures the direct diagonal travel time of sound through seawater from the AUV's transducer to the seafloor. This raw measurement is called 'Slant Range' (Rs). Because the AUV flies at an altitude (H) above the seabed, the raw image is severely compressed near the center (nadir) and objects look distorted and skewed.",
        howItWorks: "Using the Pythagorean theorem with real-time altitude telemetry from the AUV's downward-looking Doppler Velocity Log (DVL), SonarX maps each diagonal sample to true flat seafloor ground range (R_gr):<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#00f0ff; font-family:monospace; margin:8px 0;'>R_ground = √( R_slant² - H_altitude² )</code><br>The algorithm remaps pixel intensity values using bilinear spatial interpolation, clears out the blank water column, and reconstructs an undistorted, geodetically accurate acoustic orthophoto.",
        sdgImpact: "UN SDG 14.1 & 14.2: Without slant-range rectification, ghost net footprints are underestimated by up to 45%, leading to undersized retrieval grappling gear and uncollected debris.",
        actionBtn: "Toggle Slant-Range in Sonar",
        actionFn: () => {
          const el = document.getElementById('toggleSlantRange');
          if (el) { el.checked = !el.checked; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'tvg': {
        title: "Time-Varied Gain (TVG) Normalization",
        category: "Acoustic Signal Processing & Hydrodynamics",
        badge: "TL = 20 log(R) + 2αR",
        badgeColor: "#ffb703",
        icon: "🔊",
        summary: "Dynamically compensates for acoustic attenuation and geometric transmission loss across seawater, making distant seafloor targets as bright and visible as close ones.",
        whatIsIt: "As acoustic pings travel through water, sound energy dissipates rapidly due to spherical spreading (sound spreading outward in a sphere) and absorption by magnesium sulfate and boric acid ions in seawater. Without TVG, the center of the sonar image is blindingly bright while the outer edges are pitch black.",
        howItWorks: "SonarX's digital signal processor implements a calibrated logarithmic amplification ramp matching the underwater acoustic transmission loss equation:<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#ffb703; font-family:monospace; margin:8px 0;'>Transmission Loss (TL) = 20 log₁₀(Range) + 2 · α · Range</code><br>where α is the acoustic absorption coefficient (in dB/km) computed for 455 kHz / 900 kHz salinity and temperature. Echoes returning later in time receive exponentially higher amplification, creating a uniform, normalized backscatter field across the entire 150-meter swath.",
        sdgImpact: "Guarantees 100% outer-swath detection capability for submerged plastics and sunken chemical drums that would otherwise be lost in acoustic shadow darkness.",
        actionBtn: "Toggle TVG in Sonar",
        actionFn: () => {
          const el = document.getElementById('toggleTVG');
          if (el) { el.checked = !el.checked; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'speckle-filter': {
        title: "Acoustic Speckle Despeckling (Lee & Frost Filters)",
        category: "Spatial Image DSP & Noise Filtering",
        badge: "Lee Adaptive Variance Filter",
        badgeColor: "#a0c4ff",
        icon: "✨",
        summary: "Removes granular acoustic interference caused by random wave reflections while preserving critical structural edges of sunken debris and boundary shadows.",
        whatIsIt: "Side-scan sonar images are inherently plagued by 'speckle noise'—a multiplicative granular salt-and-pepper pattern caused by constructive and destructive interference of coherent acoustic pulses reflecting off uneven sand grains and suspended particulate matter.",
        howItWorks: "Unlike standard Gaussian blurs which destroy crisp debris edges, SonarX utilizes an adaptive Lee filter with a 5×5 sliding window. It evaluates local variance (σ²) versus noise variance (σₙ²):<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#a0c4ff; font-family:monospace; margin:8px 0;'>Weight W = 1 - ( σ_noise² / σ_local² )<br>Pixel_filtered = Mean + W · ( Pixel_raw - Mean )</code><br>In smooth sandy areas (W ≈ 0), it smooths speckle; at sharp ghost net ropes and metallic edges (W ≈ 1), it preserves raw high-contrast boundaries.",
        sdgImpact: "Boosts neural network detection accuracy by +22.6% mAP and prevents false positive alarms caused by sand ripples.",
        actionBtn: "Switch Filter to Lee",
        actionFn: () => {
          const el = document.getElementById('selectSpeckleFilter');
          if (el) { el.value = 'lee'; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'yolov8-detect': {
        title: "Edge YOLOv8-Debris Supervised Neural Detector",
        category: "Deep Learning & Embedded AI",
        badge: "TensorRT INT8 • 74 FPS",
        badgeColor: "#00f0ff",
        icon: "🎯",
        summary: "A high-speed convolutional neural network trained on underwater acoustic datasets to spot, localize, and classify ghost nets, drums, tyres, and munitions in real time.",
        whatIsIt: "YOLOv8-Debris is a specialized computer vision neural network architecture fine-tuned specifically on acoustic sonar imagery. Sonar images lack optical color and RGB channels; YOLOv8 learns spatial texture, specular highlights, and trailing acoustic shadow geometry.",
        howItWorks: "Incoming waterfall lines are fed into CSPDarknet feature extractors with Path Aggregation Network (PAN) necks. Anchor-free detection heads predict bounding box coordinates (x, y, w, h), objectness scores, and class probabilities in a single feed-forward pass. The model is quantized from FP32 to INT8 using calibration datasets and compiled via Nvidia TensorRT to run at 74 FPS on the AUV's Jetson Orin Nano with 13.5 ms latency.",
        sdgImpact: "Enables autonomous uncrewed submarines to map vast swathes of international waters without human tether cables or cloud latency.",
        actionBtn: "View Bounding Boxes",
        actionFn: () => {
          const el = document.getElementById('toggleBBoxes');
          if (el) { el.checked = true; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'patchcore-anomaly': {
        title: "PatchCore Memory Bank Unsupervised Anomaly Detector",
        category: "Unsupervised AI & Out-of-Distribution Detection",
        badge: "Coreset Subsampling • 97.4% AUROC",
        badgeColor: "#ff007f",
        icon: "🧠",
        summary: "Discovers strange, unexpected, and unclassified seafloor hazards (unexploded munitions, crashed fuselages, alien wreckage) that the AI was never trained on.",
        whatIsIt: "Supervised AI only recognizes objects it has seen before. But the seabed is full of rare, uncataloged hazards (chemical canisters, ancient unexploded ordnance, aircraft debris). PatchCore identifies anomalies by memorizing what 'normal' pristine seabed looks like.",
        howItWorks: "PatchCore extracts mid-level feature representations from clean seafloor patches (sand, mud, coral rubble) and stores them in a memory bank subsampled via greedy minimax Coreset selection. During survey, each incoming sonar patch embedding is compared to the memory bank via nearest-neighbor Euclidean distance:<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#ff007f; font-family:monospace; margin:8px 0;'>Anomaly Score = min || m_patch - m_normal* ||₂</code><br>Any acoustic pattern deviating from normal seafloor triggers a bright magenta anomaly heat-map, alerting human operators immediately.",
        sdgImpact: "Discovers unexploded wartime bombs (UXO) and toxic industrial barrels before they corrode and poison marine ecosystems.",
        actionBtn: "Toggle Grad-CAM / Anomaly Map",
        actionFn: () => {
          const el = document.getElementById('toggleGradCAM');
          if (el) { el.checked = true; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'gradcam-heat': {
        title: "Grad-CAM Neural Saliency & Explainability",
        category: "Explainable Artificial Intelligence (XAI)",
        badge: "Visual Backprop Attention",
        badgeColor: "#ff70a6",
        icon: "🔥",
        summary: "Renders visual heatmaps showing human hydrographers exactly which acoustic highlights and shadow patterns triggered the AI's detection decision.",
        whatIsIt: "Deep neural networks are often criticized as 'black boxes'. Grad-CAM (Gradient-weighted Class Activation Mapping) makes SonarX fully transparent, auditable, and scientifically explainable by highlighting the exact pixels the network focused on.",
        howItWorks: "SonarX computes the gradient of the predicted debris class score with respect to feature activation maps in the final convolutional layer. These gradients are globally pooled to yield importance weights (αₖ):<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#ff70a6; font-family:monospace; margin:8px 0;'>Grad-CAM Heatmap = ReLU( ∑ αₖ · FeatureMapₖ )</code><br>The positive activations are rendered as an intuitive pseudo-color thermal overlay (red = highest AI focus, blue = background), confirming whether the AI attended to true debris geometry or false seabed artifacts.",
        sdgImpact: "Provides legal and scientific accountability required by marine regulatory authorities before approving physical recovery missions.",
        actionBtn: "Toggle Grad-CAM Heatmap",
        actionFn: () => {
          const el = document.getElementById('toggleGradCAM');
          if (el) { el.checked = !el.checked; el.dispatchEvent(new Event('change')); }
          if (window.app) window.app.switchTab('tab-waterfall');
        }
      },

      'acoustic-shadow': {
        title: "Acoustic Shadow Trigonometry & Debris Height Calculation",
        category: "Acoustic Physics & Sonar Geometry",
        badge: "H_obj = (Ls · h) / (Rs + Ls)",
        badgeColor: "#00f0ff",
        icon: "📐",
        summary: "Calculates the exact physical vertical height and volume of submerged debris by measuring the length of the acoustic shadow cast on the seafloor.",
        whatIsIt: "Because high-frequency sound waves travel in straight acoustic rays, any solid object protruding above the flat seabed blocks sound from striking the seafloor behind it. This creates a black region known as an 'acoustic shadow'.",
        howItWorks: "Using the geometric similarity of right triangles formed by the sonar vehicle altitude (h), the slant range to the object (Rs), and the length of the trailing shadow (Ls), SonarX calculates the true height of the debris (H_debris):<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#00f0ff; font-family:monospace; margin:8px 0;'>Debris Height H = ( L_shadow · h_altitude ) / ( R_slant + L_shadow )</code><br>If a ghost net has an altitude of 15m, slant range of 40m, and shadow of 12m, its height is exactly 3.46 meters off the seabed.",
        sdgImpact: "Prevents recovery ships from snapping recovery winches by accurately estimating target bulk and clearance before diver or ROV deployment.",
        actionBtn: "Try in Sonar View",
        actionFn: () => { if (window.app) window.app.switchTab('tab-waterfall'); }
      },

      'ecological-reef': {
        title: "Ecological Habitat & Artificial Reef Safeguard",
        category: "Marine Ecology & Environmental Protection",
        badge: "SDG 14.2 Marine Conservation",
        badgeColor: "#00ff88",
        icon: "🪸",
        summary: "A human-in-the-loop ethical AI safeguard that prevents cleanup crews from destroying colonized artificial coral reefs, sponge nurseries, and fish shelters.",
        whatIsIt: "Not all man-made structures on the seabed should be hauled away. Over decades, many historic shipwrecks, concrete blocks, and even sunken tyres become completely encrusted by endangered biogenic coral polyps, providing critical nursery grounds for depleted fish stocks.",
        howItWorks: "When SonarX detects acoustic roughness signatures characteristic of coral growth and high biological acoustic scattering, it triggers an 'Ecological Review Flag'. The operator console displays biological conservation metrics. If tagged as 'PROTECTED ARTIFICIAL REEF', the GPS coordinates are locked and excluded from recovery crane routes, ensuring biodiversity is preserved.",
        sdgImpact: "Directly fulfills UN SDG 14.2: Sustainably manage and protect marine and coastal ecosystems to avoid significant adverse impacts.",
        actionBtn: "Open Operator Console",
        actionFn: () => { if (window.app) window.app.switchTab('tab-operator'); }
      },

      'sentinel-1-sar': {
        title: "Copernicus Sentinel-1 C-Band Synthetic Aperture Radar (SAR)",
        category: "Earth Observation & Orbital Radar",
        badge: "5.405 GHz • 24/7 Cloud Penetration",
        badgeColor: "#00f0ff",
        icon: "🛰️",
        summary: "An orbital radar satellite operated by the European Space Agency (ESA) that detects surface plastic aggregations and oil slicks through clouds and nighttime.",
        whatIsIt: "Sentinel-1 flies at 693 km altitude in sun-synchronous orbit, transmitting active microwave pulses at 5.405 GHz (C-band). Unlike optical cameras, radar pulses pass unimpeded through heavy storm clouds, monsoon rain, and dark nighttime.",
        howItWorks: "Surfactants, floating micro-plastics, and dense ghost net aggregations dampen surface capillary-gravity waves, creating an artificially smooth water surface. In radar imagery, smooth water reflects radar pulses away from the sensor like a mirror, producing an identifiable drop in Normalized Radar Cross Section (σ₀ backscatter in dB). SonarX ingests SAR Level-1 Ground Range Detected (GRD) feeds to detect surface slicks before they sink.",
        sdgImpact: "Enables trans-oceanic surveillance across millions of square kilometers, cueing AUVs to high-probability debris zones.",
        actionBtn: "Inspect in Satellite Tab",
        actionFn: () => { if (window.app) window.app.switchTab('tab-satellite'); }
      },

      'sentinel-2-fdi': {
        title: "Sentinel-2 Multispectral Floating Debris Index (FDI)",
        category: "Optical Earth Observation & Remote Sensing",
        badge: "FDI Spectral Band Formula",
        badgeColor: "#00ff88",
        icon: "🛰️",
        summary: "A specialized multispectral optical algorithm calculated from Red, NIR, and SWIR satellite wavelengths to identify floating marine plastic aggregations.",
        whatIsIt: "Sentinel-2 MSI (Multi-Spectral Instrument) measures 13 spectral bands from visible to shortwave infrared. While pure seawater absorbs almost all near-infrared light, floating plastics and marine debris strongly backscatter near-infrared photons.",
        howItWorks: "SonarX calculates the Floating Debris Index (FDI) using bands B4 (665 nm), B8 (833 nm), and B11 (1610 nm):<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#00ff88; font-family:monospace; margin:8px 0;'>FDI = R_NIR - [ R_Red + ( R_SWIR - R_Red ) · ( (λ_NIR - λ_Red) / (λ_SWIR - λ_Red) ) ]</code><br>Positive FDI values distinguish floating plastic rafts from natural whitecaps, clouds, and Sargassum seaweed.",
        sdgImpact: "Pre-empts benthic ocean pollution by targeting plastic patches before they absorb water, bio-foul with algae, and sink to the deep seabed.",
        actionBtn: "Inspect in Satellite Tab",
        actionFn: () => { if (window.app) window.app.switchTab('tab-satellite'); }
      },

      'lagrangian-drift': {
        title: "Hydrodynamic Lagrangian 3D Sinking & Drift Trajectory",
        category: "Oceanographic Hydrodynamics & Modeling",
        badge: "Euler-Lagrangian Advection",
        badgeColor: "#ffb703",
        icon: "🌊",
        summary: "Predicts the exact 3D underwater sinking trajectory of satellite-spotted plastic slicks as ocean currents, Stokes drift, and biofouling carry them down to the seabed.",
        whatIsIt: "Plastic slicks detected by space satellites do not stay static. Over 2 to 7 days, colonization by barnacles and algae increases the plastic's density beyond seawater (1025 kg/m³), causing it to sink while being carried sideways by subsurface ocean currents.",
        howItWorks: "SonarX solves the 3D kinematic transport differential equations incorporating Copernicus Marine Service (CMEMS) current vectors:<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#ffb703; font-family:monospace; margin:8px 0;'>d(X)/dt = U_current(x,y,z,t) + U_stokes(wind) + W_terminal(density)</code><br>It models terminal settling velocity using Schiller-Naumann drag equations, plotting a 3D parabolic drift cone to pinpoint the exact seafloor GPS coordinate where the AUV should deploy its sonar.",
        sdgImpact: "Cuts down ocean survey search time by 68%, turning a multi-week search into a precise point-interception mission.",
        actionBtn: "Run Drift Simulation",
        actionFn: () => {
          if (window.app) window.app.switchTab('tab-satellite');
          setTimeout(() => { if (window.satelliteTracker) window.satelliteTracker.runLagrangianDriftModel(); }, 200);
        }
      },

      'iridium-leo': {
        title: "Iridium-NEXT LEO Satellite Telemetry Uplink",
        category: "Trans-Oceanic Comms & Space Infrastructure",
        badge: "1616 - 1626.5 MHz • SBD Packets",
        badgeColor: "#00f0ff",
        icon: "📡",
        summary: "A constellation of 66 cross-linked low Earth orbit satellites providing true pole-to-pole wireless connectivity for uncrewed ocean vehicles.",
        whatIsIt: "Standard 4G/5G mobile towers end 15 km from shore. In the open ocean and EEZ zones, uncrewed autonomous submarines must transmit critical mission telemetry and debris coordinates via satellite.",
        howItWorks: "When the AUV surfaces or reaches acoustic range of an autonomous surface gateway buoy, an onboard 9603 SBD transceiver transmits compressed INT8 anomaly headers, GPS coordinates, and hazard levels to an overhead Iridium satellite. The message hops across inter-satellite crosslinks and reaches the SonarX mission operations center in less than 2.5 seconds.",
        sdgImpact: "Enables automated alert dispatches to coastal guard authorities and cleanup fleets without requiring diesel-burning human escort ships.",
        actionBtn: "Trigger Uplink Simulation",
        actionFn: () => {
          if (window.app) window.app.switchTab('tab-satellite');
          setTimeout(() => { if (window.satelliteTracker) window.satelliteTracker.simulateSatelliteUplink(); }, 200);
        }
      },

      'vessel-routing': {
        title: "Autonomous Cleanup Vessel Route Optimization",
        category: "Operations Research & Green Logistics",
        badge: "TSP / Capacitated VRP • -32% Fuel",
        badgeColor: "#00ff88",
        icon: "🚢",
        summary: "Solves vehicle routing optimization algorithms to calculate the shortest, safest, and most fuel-efficient trajectory for retrieval ships collecting marine debris.",
        whatIsIt: "Ocean cleanup ships are expensive and consume large amounts of fuel. Visiting debris targets in random order burns excess marine diesel and delays recovery of critical hazards.",
        howItWorks: "SonarX models the mission as a Multi-Objective Capacitated Vehicle Routing Problem (CVRP) with bathymetric draft safety constraints. It prioritizes targets by hazard severity (critical ghost nets trapping marine life > toxic drums > benign plastics) and minimizes total geodesic nautical miles using Dijkstra and 2-opt heuristic optimization:<br><br><code style='display:block; padding:10px; background:#070b14; border-radius:6px; color:#00ff88; font-family:monospace; margin:8px 0;'>Objective: Min ∑ c_ij · x_ij + λ · ∑ HazardPenalty_k</code><br>This delivers optimal waypoints directly into maritime ECDIS navigation systems.",
        sdgImpact: "Saves 32% fuel consumption, eliminating an average of 1.8 metric tons of CO₂ emissions per cleanup expedition (SDG 12 & 13).",
        actionBtn: "View Routing Dashboard",
        actionFn: () => { if (window.app) window.app.switchTab('tab-reports'); }
      },

      'jetson-orin': {
        title: "Nvidia Jetson Orin Nano Edge AI Architecture",
        category: "Embedded Hardware & Edge Computing",
        badge: "40 TOPS • 1024 Ampere Cores • 15W",
        badgeColor: "#00f0ff",
        icon: "⚡",
        summary: "An ultra-compact, power-efficient embedded supercomputer housed inside the AUV's watertight pressure hull, executing deep neural inference at 74 FPS on battery power.",
        whatIsIt: "Cloud servers cannot be reached underwater because radio and Wi-Fi signals attenuate within centimeters of seawater. AI models must run locally on an edge computer packed into the submarine's limited battery envelope.",
        howItWorks: "The Nvidia Jetson Orin Nano features 1024 Ampere architecture CUDA cores and 32 Tensor Cores. By quantizing neural networks from 32-bit floating point to 8-bit integers (INT8), inference memory bandwidth is cut by 75% while maintaining 97.4% precision. The entire edge node consumes only 10 to 15 Watts of power, allowing the AUV to operate submerged for up to 14 consecutive days.",
        sdgImpact: "Democratizes advanced underwater robotics by replacing \$100,000+ shipboard servers with a low-cost, low-power edge node (SDG 9.5).",
        actionBtn: "View Edge Telemetry",
        actionFn: () => { if (window.app) window.app.switchTab('tab-telemetry'); }
      },

      'sdg-canvas': {
        title: "SDG-Technology Mapping Framework & Team SonarX",
        category: "Sustainable Development & Engineering Architecture",
        badge: "Bennett University • SDG 14, 12, 9",
        badgeColor: "#00f0ff",
        icon: "📜",
        summary: "The formal engineering design canvas authored by Team SonarX at Bennett University, mapping every line of code directly to UN Sustainable Development Goals.",
        whatIsIt: "Developed for the SDG-Technology Mapping Canvas by Team SonarX (Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav) at Bennett University, this system bridges academic computer science and deep-sea ocean conservation.",
        howItWorks: "The framework systematically aligns: (1) Deep-sea acoustic sensing to SDG 14 Target 14.1 (reduce marine pollution) and 14.2 (protect marine ecosystems); (2) Autonomous vessel route optimization to SDG 12 Target 12.5 (waste prevention & resource circularity); (3) Edge-ready low-power computing to SDG 9 Targets 9.1 & 9.5 (sustainable resilient infrastructure & scientific innovation).",
        sdgImpact: "Transforms passive maritime research into active, quantifiable environmental cleanup and resource recovery.",
        actionBtn: "Open SDG Canvas Tab",
        actionFn: () => { if (window.app) window.app.switchTab('tab-sdg'); }
      },

      'kpi-plastics': {
        title: "Plastics & Ghost Nets Located Metric",
        category: "SDG 14 Environmental KPI",
        badge: "Target: 2,500 kg / mission",
        badgeColor: "#00f0ff",
        icon: "🌊",
        summary: "Cumulative mass (in kilograms) of ghost fishing gear, nylon monofilament nets, and macro-plastics georeferenced by the AUV's automated sonar pipeline.",
        whatIsIt: "Ghost nets (derelict fishing gear) represent over 46% of large marine debris. They continue 'ghost fishing' for centuries, ensnaring sea turtles, whales, sharks, and commercial fish stocks in an endless death loop.",
        howItWorks: "SonarX calculates debris mass by estimating the 3D volume of the detected target from its rectified bounding area ($m^2$) multiplied by its acoustic shadow height ($H$), then applying material density constants for polyamide nylon (1.14 g/cm³) and polypropylene (0.91 g/cm³).",
        sdgImpact: "Directly tracks progress toward UN SDG 14.1: By 2025, prevent and significantly reduce marine pollution of all kinds.",
        actionBtn: "Inspect in Sonar View",
        actionFn: () => { if (window.app) window.app.switchTab('tab-waterfall'); }
      },

      'kpi-area': {
        title: "Benthic Area Surveyed Metric",
        category: "Hydrographic Survey Coverage",
        badge: "150m Swath • Multi-Beam / SSS",
        badgeColor: "#00f0ff",
        icon: "🗺️",
        summary: "Total square kilometers of deep-sea ocean floor mapped and acoustically inspected by the AUV's side-scan sonar transducers.",
        whatIsIt: "The ocean floor covers 70% of Earth, but less than 25% has been mapped at high resolution. Measuring coverage area validates survey completeness and mission efficiency.",
        howItWorks: "Calculated continuously by integrating AUV Doppler Velocity Log (DVL) ground speed ($v$) multiplied by the total active sonar swath width ($W = 150m$): Area = ∫ (W · v) dt.",
        sdgImpact: "Accelerates the Nippon Foundation–GEBCO Seabed 2030 global ocean mapping initiative.",
        actionBtn: "View on GIS Map",
        actionFn: () => { if (window.app) window.app.switchTab('tab-map'); }
      },

      'kpi-fps': {
        title: "Edge Inference Speed Metric",
        category: "Embedded Computing Performance",
        badge: "Target: 70+ FPS INT8",
        badgeColor: "#00f0ff",
        icon: "⚡",
        summary: "The real-time processing throughput of the deep learning pipeline running on the embedded Nvidia Jetson Orin Nano hardware payload.",
        whatIsIt: "In autonomous underwater navigation, latency is safety. If the AUV cannot process sonar pings in real time, it cannot steer around hazardous wreckage or avoid crashing into underwater cliffs.",
        howItWorks: "Measured by timestamping each batch of incoming acoustic scanlines as it enters TensorRT engine memory until the final bounding boxes and anomaly mask coordinates are output: FPS = 1000 / Latency_ms.",
        sdgImpact: "Proves that cutting-edge neural networks can run inside compact underwater robots without requiring massive power plants.",
        actionBtn: "Inspect Telemetry",
        actionFn: () => { if (window.app) window.app.switchTab('tab-telemetry'); }
      },

      'kpi-co2': {
        title: "CO₂ Emissions Avoided Metric",
        category: "Green Logistics & Decarbonization",
        badge: "SDG 12 & SDG 13 Climate Action",
        badgeColor: "#00ff88",
        icon: "🌱",
        summary: "Estimated kilograms of atmospheric carbon dioxide saved by optimizing recovery ship dispatch routes compared to legacy uncoordinated search missions.",
        whatIsIt: "Traditional search operations involve heavy 50-meter research ships randomly crisscrossing the ocean burning 300 to 500 liters of marine diesel per hour.",
        howItWorks: "SonarX compares the optimized TSP/VRP route against an uncoordinated brute-force grid search. Marine diesel emits 2.68 kg of CO₂ per liter burned. By cutting mission transit distance by 32%, massive fuel volumes and greenhouse gas emissions are eliminated.",
        sdgImpact: "Directly upholds UN SDG 12.5 (Resource reduction) and SDG 13 (Climate Action).",
        actionBtn: "View Route Reports",
        actionFn: () => { if (window.app) window.app.switchTab('tab-reports'); }
      },

      'sounder-hud': {
        title: "Bathymetric Sounder & Seabed Substrate Probe",
        category: "Hydrographic Telemetry & Ocean Acoustics",
        badge: "Real-Time Acoustic Probing",
        badgeColor: "#00f0ff",
        icon: "🧭",
        summary: "Live telemetry showing underwater depth, latitude/longitude, acoustic backscatter strength (dB), and seabed substrate classification under the cursor.",
        whatIsIt: "Hydrographers require continuous visibility into water depth and seafloor characteristics (sand, silt, mud, rock, coral) to ensure safe navigation and debris grip.",
        howItWorks: "Calculates local bathymetric depth from the synthetic bathymetry gradient and simulates acoustic backscatter (Lambert's law backscatter coefficient): -18 dB indicates hard reflective substrate (rock/concrete); -32 dB indicates soft acoustic-absorbing substrate (fine silt/mud).",
        sdgImpact: "Ensures heavy retrieval anchors do not disturb fragile sponge beds or marine conservation zones.",
        actionBtn: "Test Sounder on Map",
        actionFn: () => { if (window.app) window.app.switchTab('tab-map'); }
      },

      'map-mission-sim': {
        title: "Autonomous AUV Mission Simulator",
        category: "Interactive Ocean Navigation",
        badge: "Dynamic Transect Sweep",
        badgeColor: "#00f0ff",
        icon: "▶️",
        summary: "Simulates an autonomous underwater vehicle navigating along its survey transect, emitting acoustic pings and progressively discovering debris hotspots live on the map.",
        whatIsIt: "An interactive hydrographic simulator allowing operators, researchers, and evaluators to observe the AUV's search sweep, radar cone, and real-time target discovery.",
        howItWorks: "The simulator steps through mission waypoints with realistic AUV cruising speed (3.2 knots), computes the sweeping side-scan swath cone, plays authentic acoustic pings via Web Audio API, and dynamically pops up new debris targets on the map as the AUV intersects their coordinates.",
        sdgImpact: "Enables mission rehearsal and operator training without expensive offshore sea trials.",
        actionBtn: "Start Simulation Now",
        actionFn: () => {
          if (window.app) window.app.switchTab('tab-map');
          setTimeout(() => { if (window.debrisMap) window.debrisMap.toggleMissionSimulation(); }, 200);
        }
      },

      'map-add-pin': {
        title: "Add Debris Hotspot & Target Registration",
        category: "Geographic Information System (GIS)",
        badge: "REST API Endpoint: /api/detections/create",
        badgeColor: "#ffb703",
        icon: "➕",
        summary: "Interactive GIS tool that allows the operator to click anywhere on the ocean map, register a new debris target, and commit it to the SQLite database.",
        whatIsIt: "Enables hydrographic operators, oceanographers, and citizen scientists to manually log detected marine litter, sunken containers, and hazards.",
        howItWorks: "Clicking the map captures exact GPS coordinates (latitude, longitude) and opens an interactive modal to input debris type (Ghost Net, Metal Drum, Tyres, Munition), depth, mass, and hazard level. The client sends an HTTP POST request to `/api/detections/create`, saves the target in `sonarx_debris.db`, recalculates KPI stats, and renders an animated radar marker on the map.",
        sdgImpact: "Creates an open, standardized geospatial database of underwater ocean pollution.",
        actionBtn: "Mark Hotspot Now",
        actionFn: () => {
          if (window.app) window.app.switchTab('tab-map');
          setTimeout(() => { if (window.debrisMap) window.debrisMap.activateAddTargetMode(); }, 200);
        }
      }
    };

    this.init();
  }

  init() {
    this.createInspectorModal();
    this.createGuidedTourModal();
    this.attachGlobalClickExplainer();
  }

  createInspectorModal() {
    if (document.getElementById('sonarxInspectorModal')) return;

    const modal = document.createElement('div');
    modal.id = 'sonarxInspectorModal';
    modal.className = 'sonar-modal-overlay';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="sonar-modal-card" style="max-width: 680px;">
        <div class="sonar-modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span id="inspectModalIcon" style="font-size:1.6rem;">💡</span>
            <div>
              <div id="inspectModalCategory" style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; font-family:var(--font-mono);">
                Acoustic DSP & Architecture
              </div>
              <h2 id="inspectModalTitle" style="margin:0; font-size:1.25rem; color:#fff; display:flex; align-items:center; gap:8px;">
                Concept Title
              </h2>
            </div>
          </div>
          <button class="sonar-modal-close" onclick="window.inspector.closeInspector()">&times;</button>
        </div>

        <div class="sonar-modal-body" style="padding: 16px 20px; max-height:70vh; overflow-y:auto;">
          <!-- Badge Strip -->
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:14px; flex-wrap:wrap;">
            <span id="inspectModalBadge" class="badge-edge" style="font-size:0.75rem;">FORMULA</span>
            <span class="badge-edge" style="border-color:rgba(255,255,255,0.2); color:#a0aec0; font-size:0.7rem;">TEAM SONARX &bull; BENNETT UNIVERSITY</span>
          </div>

          <!-- Summary Callout -->
          <div id="inspectModalSummary" style="background:rgba(0, 240, 255, 0.08); border-left:3px solid var(--sonar-cyan); padding:10px 14px; border-radius:4px; font-size:0.88rem; color:#e0f7fa; line-height:1.45; margin-bottom:16px;">
            Summary text
          </div>

          <!-- What is it section -->
          <div style="margin-bottom:16px;">
            <h4 style="color:var(--sonar-cyan); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>❓</span> What is it? (Plain Explanation)
            </h4>
            <div id="inspectModalWhatIsIt" style="color:var(--text-muted); font-size:0.85rem; line-height:1.6;">
              Explanation text
            </div>
          </div>

          <!-- How it works section -->
          <div style="margin-bottom:16px;">
            <h4 style="color:var(--sonar-amber); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <span>⚙️</span> How it works? (Scientific & Technical Principle)
            </h4>
            <div id="inspectModalHowItWorks" style="color:var(--text-muted); font-size:0.85rem; line-height:1.6;">
              Technical deep dive
            </div>
          </div>

          <!-- SDG Impact section -->
          <div style="margin-bottom:16px; background:#070b14; padding:12px; border-radius:6px; border:1px solid rgba(0, 255, 136, 0.2);">
            <h4 style="color:var(--sonar-green); font-size:0.85rem; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <span>🌊</span> Impact on SDG 14 & Ocean Cleanup
            </h4>
            <div id="inspectModalSDG" style="color:#d1fae5; font-size:0.82rem; line-height:1.5;">
              SDG impact explanation
            </div>
          </div>
        </div>

        <div class="sonar-modal-footer" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:rgba(0,0,0,0.3); border-top:1px solid var(--border-subtle);">
          <button id="inspectModalActionBtn" class="btn-sonar-primary" style="font-size:0.8rem; padding:8px 16px;">
            Try This Feature
          </button>
          <button class="btn-sonar-secondary" style="font-size:0.8rem; padding:8px 16px;" onclick="window.inspector.closeInspector()">
            Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeInspector();
    });
  }

  createGuidedTourModal() {
    if (document.getElementById('sonarxTourModal')) return;

    const tour = document.createElement('div');
    tour.id = 'sonarxTourModal';
    tour.className = 'sonar-modal-overlay';
    tour.style.display = 'none';

    this.tourSteps = [
      {
        step: 1,
        title: "The Crisis: 640,000 Tons of Hidden Seafloor Debris",
        subtitle: "UN SDG 14.1 Target & The Problem of Blind Waters",
        icon: "🌊",
        content: `
          <p>Over 8 million tons of plastic enter our oceans annually. While floating patches grab headlines, <strong>over 70% of marine plastic and 640,000 tons of commercial fishing 'ghost nets' sink directly to the dark ocean seabed</strong>.</p>
          <p>Optical cameras and satellite photography fail in turbid seawater beyond 10 meters depth. SonarX solves this critical bottleneck by placing edge artificial intelligence directly on autonomous underwater vehicles (AUVs) scanning with high-frequency sound waves.</p>
          <div style="background:#070b14; padding:10px; border-radius:6px; border-left:3px solid #00f0ff; margin-top:10px; font-size:0.8rem;">
            <strong>Team SonarX | Bennett University:</strong> Alok Kumar (S26CSEU3209), Avni (S26CSEU3153), Pandit Shashwat Tripathi (S26CSEU3232), Krish Kumar Yadav (S26CSEU3219).
          </div>
        `,
        actionLabel: "Next: Sonar Acoustic Physics →",
        tab: "tab-waterfall"
      },
      {
        step: 2,
        title: "Acoustic Sensing: Side-Scan Sonar & Shadows",
        subtitle: "Seeing in Zero Visibility with 455/900 kHz Sound Pulses",
        icon: "📡",
        content: `
          <p>Side-Scan Sonar (SSS) emits fan-shaped acoustic pulses perpendicular to the AUV's travel path. When sound strikes a submerged object, it creates a bright <strong>specular highlight</strong> followed by a dark <strong>acoustic shadow</strong> where sound cannot reach.</p>
          <p>Our onboard DSP performs <strong>Slant-Range Correction</strong> ($R_{gr} = \\sqrt{R_s^2 - H^2}$) to remove the nadir blind zone, and <strong>Time-Varied Gain (TVG)</strong> to counteract acoustic attenuation across the 150-meter swath.</p>
          <p>By measuring the shadow length ($L_s$), the system automatically calculates the true 3D vertical height of the ghost net: $H = \\frac{L_s \\cdot h}{R_s + L_s}$.</p>
        `,
        actionLabel: "Next: Edge AI Detection →",
        tab: "tab-waterfall"
      },
      {
        step: 3,
        title: "Edge AI Pipeline: Supervised YOLOv8 + PatchCore",
        subtitle: "Dual-Engine Neural Architecture Quantized to INT8",
        icon: "⚡",
        content: `
          <p>Undersea vehicles cannot stream video to the cloud through seawater. SonarX deploys an embedded <strong>Nvidia Jetson Orin Nano</strong> executing two complementary AI engines:</p>
          <ul>
            <li><strong>YOLOv8-Debris (Supervised):</strong> Detects known hazards (ghost nets, metal drums, tyres, containers) with bounding boxes and confidence scores.</li>
            <li><strong>PatchCore (Unsupervised Anomaly Detector):</strong> Uses memory-bank feature embeddings of clean seafloor to spot rare, unknown seabed threats (unexploded WW2 torpedoes, chemical canisters).</li>
            <li><strong>Grad-CAM:</strong> Overlays visual attention heatmaps proving why the AI made each decision.</li>
          </ul>
          <p>Quantized to INT8 via TensorRT, running at <strong>74+ FPS with only 13.5 ms latency under 15 Watts</strong>.</p>
        `,
        actionLabel: "Next: Ecological AI Safeguard →",
        tab: "tab-telemetry"
      },
      {
        step: 4,
        title: "Human-in-the-Loop: Ecological Habitat Safeguard",
        subtitle: "Preventing the Destruction of Living Artificial Coral Reefs",
        icon: "🪸",
        content: `
          <p>Not all submerged structures should be hauled to the surface! Over years, sunken wrecks and ancient nets become colonized by endangered coral larvae and juvenile fish nurseries.</p>
          <p>SonarX features an automated <strong>Biomass & Habitat Roughness Classifier</strong>. If high biodiversity is identified, the system locks the target as a <strong>'Protected Artificial Reef'</strong> (UN SDG 14.2), preventing cleanup cranes from destroying thriving marine ecosystems.</p>
        `,
        actionLabel: "Next: Space-to-Seabed Multi-Scale Sensing →",
        tab: "tab-operator"
      },
      {
        step: 5,
        title: "Multi-Scale Sensing: Space Satellites to Seabed AUVs",
        subtitle: "Sentinel-1 SAR, Sentinel-2 FDI & 3D Lagrangian Drift",
        icon: "🛰️",
        content: `
          <p>SonarX bridges 693 km in space with 200 meters below sea level:</p>
          <ul>
            <li><strong>Sentinel-1 C-Band SAR:</strong> Detects capillary wave damping from surface plastic slicks 24/7 through monsoon clouds.</li>
            <li><strong>Sentinel-2 FDI:</strong> Multispectral Floating Debris Index identifying plastic rafts in optical bands.</li>
            <li><strong>Hydrodynamic 3D Lagrangian Sinking Model:</strong> Simulates current vectors, Stokes wave drift, and bio-fouling settling velocity to predict where floating slicks settle on the ocean floor.</li>
            <li><strong>Iridium-NEXT LEO Uplink:</strong> Relays INT8 anomaly coordinates across the globe in &lt; 2.5 seconds.</li>
          </ul>
        `,
        actionLabel: "Next: Vessel Recovery & SDG Impact →",
        tab: "tab-satellite"
      },
      {
        step: 6,
        title: "Autonomous Recovery Routing & SDG 12/9 Impact",
        subtitle: "32% Fuel Savings & 1.8 Tons CO₂ Avoided Per Expedition",
        icon: "🌱",
        content: `
          <p>Cleanup vessels cost tens of thousands of dollars per day. SonarX solves a <strong>Capacitated Vehicle Routing Problem (CVRP)</strong> with bathymetric safety constraints to generate optimal recovery paths.</p>
          <p>This cuts marine diesel consumption by 32%, saving 1.8 metric tons of CO₂ per mission, and exports clean GIS GeoJSON manifests for maritime authorities (DG Shipping, IMO, NOAA).</p>
          <div style="margin-top:14px; text-align:center;">
            <button class="btn-sonar-primary" style="padding:10px 24px; font-size:0.9rem;" onclick="window.inspector.closeTour()">
              🎉 Complete Tour & Explore Workstation!
            </button>
          </div>
        `,
        actionLabel: "Finish Tour",
        tab: "tab-reports"
      }
    ];

    tour.innerHTML = `
      <div class="sonar-modal-card" style="max-width: 650px;">
        <div class="sonar-modal-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <span id="tourStepIcon" style="font-size:1.8rem;">🎓</span>
            <div>
              <div style="font-size:0.7rem; color:var(--sonar-cyan); font-family:var(--font-mono); text-transform:uppercase;">
                Interactive System Tour &bull; Step <span id="tourStepNum">1</span> of 6
              </div>
              <h2 id="tourStepTitle" style="margin:0; font-size:1.2rem; color:#fff;">Tour Step Title</h2>
            </div>
          </div>
          <button class="sonar-modal-close" onclick="window.inspector.closeTour()">&times;</button>
        </div>

        <div class="sonar-modal-body" style="padding: 16px 20px;">
          <div id="tourStepSubtitle" style="font-size:0.82rem; color:var(--sonar-amber); font-weight:600; margin-bottom:12px;">
            Subtitle
          </div>
          <div id="tourStepBody" style="color:var(--text-muted); font-size:0.86rem; line-height:1.6; max-height:55vh; overflow-y:auto;">
            Body
          </div>
          <!-- Progress dots -->
          <div id="tourStepDots" style="display:flex; justify-content:center; gap:8px; margin-top:16px;">
          </div>
        </div>

        <div class="sonar-modal-footer" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:rgba(0,0,0,0.3); border-top:1px solid var(--border-subtle);">
          <button id="btnTourPrev" class="btn-sonar-secondary" style="font-size:0.8rem; padding:8px 16px;" onclick="window.inspector.prevTourStep()">
            ← Previous
          </button>
          <button id="btnTourNext" class="btn-sonar-primary" style="font-size:0.8rem; padding:8px 18px;" onclick="window.inspector.nextTourStep()">
            Next Step →
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(tour);
    this.tourModal = tour;

    tour.addEventListener('click', (e) => {
      if (e.target === tour) this.closeTour();
    });
  }

  explain(conceptKey) {
    const concept = this.knowledgeBase[conceptKey];
    if (!concept) {
      console.warn('Unknown concept key for explanation:', conceptKey);
      return;
    }

    if (!this.modal) this.createInspectorModal();

    document.getElementById('inspectModalIcon').textContent = concept.icon || '💡';
    document.getElementById('inspectModalCategory').textContent = concept.category || 'SonarX Deep Tech';
    document.getElementById('inspectModalTitle').textContent = concept.title;
    
    const badgeEl = document.getElementById('inspectModalBadge');
    badgeEl.textContent = concept.badge || 'INFO';
    badgeEl.style.color = concept.badgeColor || '#00f0ff';
    badgeEl.style.borderColor = concept.badgeColor || '#00f0ff';

    document.getElementById('inspectModalSummary').innerHTML = concept.summary;
    document.getElementById('inspectModalWhatIsIt').innerHTML = concept.whatIsIt;
    document.getElementById('inspectModalHowItWorks').innerHTML = concept.howItWorks;
    document.getElementById('inspectModalSDG').innerHTML = concept.sdgImpact;

    const actionBtn = document.getElementById('inspectModalActionBtn');
    if (concept.actionBtn && concept.actionFn) {
      actionBtn.style.display = 'inline-block';
      actionBtn.textContent = concept.actionBtn;
      actionBtn.onclick = () => {
        this.closeInspector();
        concept.actionFn();
      };
    } else {
      actionBtn.style.display = 'none';
    }

    this.modal.style.display = 'flex';
  }

  closeInspector() {
    if (this.modal) this.modal.style.display = 'none';
  }

  startGuidedTour() {
    this.currentTourStep = 0;
    this.showTourStep(0);
    if (this.tourModal) this.tourModal.style.display = 'flex';
  }

  showTourStep(index) {
    if (index < 0 || index >= this.tourSteps.length) return;
    this.currentTourStep = index;
    const step = this.tourSteps[index];

    document.getElementById('tourStepNum').textContent = step.step;
    document.getElementById('tourStepIcon').textContent = step.icon;
    document.getElementById('tourStepTitle').textContent = step.title;
    document.getElementById('tourStepSubtitle').textContent = step.subtitle;
    document.getElementById('tourStepBody').innerHTML = step.content;

    // Switch workstation tab to match tour context
    if (step.tab && window.app) {
      window.app.switchTab(step.tab);
    }

    // Update Dots
    const dotsEl = document.getElementById('tourStepDots');
    dotsEl.innerHTML = this.tourSteps.map((s, i) => `
      <span style="width:10px; height:10px; border-radius:50%; background:${i === index ? 'var(--sonar-cyan)' : 'rgba(255,255,255,0.2)'}; display:inline-block; cursor:pointer;" onclick="window.inspector.showTourStep(${i})"></span>
    `).join('');

    // Update buttons
    const prevBtn = document.getElementById('btnTourPrev');
    const nextBtn = document.getElementById('btnTourNext');
    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

    if (index === this.tourSteps.length - 1) {
      nextBtn.textContent = 'Finish Tour 🎉';
      nextBtn.onclick = () => this.closeTour();
    } else {
      nextBtn.textContent = step.actionLabel || 'Next Step →';
      nextBtn.onclick = () => this.nextTourStep();
    }
  }

  nextTourStep() {
    if (this.currentTourStep < this.tourSteps.length - 1) {
      this.showTourStep(this.currentTourStep + 1);
    } else {
      this.closeTour();
    }
  }

  prevTourStep() {
    if (this.currentTourStep > 0) {
      this.showTourStep(this.currentTourStep - 1);
    }
  }

  closeTour() {
    if (this.tourModal) this.tourModal.style.display = 'none';
  }

  toggleInspectorMode() {
    this.isInspectorModeActive = !this.isInspectorModeActive;
    const btn = document.getElementById('btnToggleInspectorMode');
    if (btn) {
      btn.classList.toggle('active', this.isInspectorModeActive);
      btn.innerHTML = this.isInspectorModeActive ? '<span>🔍</span> Inspect Mode: ON' : '<span>🔍</span> Inspect Mode';
    }

    document.body.classList.toggle('inspector-mode-active', this.isInspectorModeActive);

    if (window.app) {
      window.app.showToast(
        this.isInspectorModeActive 
          ? "🔍 Inspect Mode ON: Click any card, button, slider or dial to see how it works!"
          : "Inspect Mode OFF",
        "info"
      );
    }
  }

  attachGlobalClickExplainer() {
    document.addEventListener('click', (e) => {
      // 1. Direct [data-explain] trigger or .explain-trigger
      const trigger = e.target.closest('[data-explain]');
      if (trigger) {
        const key = trigger.getAttribute('data-explain');
        if (key && this.knowledgeBase[key]) {
          e.preventDefault();
          e.stopPropagation();
          this.explain(key);
          return;
        }
      }

      // 2. Info icon badge click (.info-badge or .explain-badge)
      const infoBadge = e.target.closest('.info-badge, .explain-badge');
      if (infoBadge) {
        const key = infoBadge.getAttribute('data-concept') || infoBadge.parentElement?.getAttribute('data-explain');
        if (key && this.knowledgeBase[key]) {
          e.preventDefault();
          e.stopPropagation();
          this.explain(key);
          return;
        }
      }

      // 3. If Inspector Mode is explicitly ON, check parent cards/controls
      if (this.isInspectorModeActive) {
        // Sliders, toggles, metric cards
        const inspectable = e.target.closest('.kpi-card, .sat-card, .filter-group, .sonar-control-card, .hardware-profile-card, .pipeline-step');
        if (inspectable) {
          const key = inspectable.getAttribute('data-explain') || inspectable.querySelector('[data-explain]')?.getAttribute('data-explain');
          if (key && this.knowledgeBase[key]) {
            e.preventDefault();
            e.stopPropagation();
            this.explain(key);
          }
        }
      }
    });
  }
}

// Global initialization
window.SonarXInspector = SonarXInspector;
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.inspector = new SonarXInspector();
  });
}
