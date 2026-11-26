/**
 * SonarX DebrisGuard - Advanced Bathymetric GIS & Debris Hotspot Mapping Module
 * Team SonarX | Bennett University
 * Multi-layer GIS (Dark Bathymetry, High-Res Satellite MSI, Nautical Topo),
 * Autonomous AUV Mission Simulator, Interactive Hotspot Creation,
 * Real-Time Bathymetric Depth Sounder & Substrate Probe.
 * Global Ocean Mission Regions — Switch between 6 ocean survey areas.
 */

// ── Global Ocean Mission Dataset (12 Major Ocean Basins & Seas) ─────────────
const GLOBAL_OCEAN_MISSIONS = {
  'Bay of Bengal': {
    center: [15.50, 85.80], zoom: 6,
    substrate: 'Pelagic Mud, Silt & Ganges Turbidite Fan',
    avg_backscatter: '-21.8 dB',
    debris: [
      { lat: 15.85, lng: 85.20, type: 'Ghost Trawler Net Raft (Polyamide Monofilament)', severity: 'CRITICAL', depth: 48, confidence: 0.96 },
      { lat: 14.90, lng: 86.40, type: 'High-Density Plastic Debris Aggregation', severity: 'HIGH', depth: 42, confidence: 0.89 },
      { lat: 16.20, lng: 84.75, type: 'Corroded Industrial Chemical Barrel', severity: 'CRITICAL', depth: 65, confidence: 0.94 },
      { lat: 15.10, lng: 85.90, type: 'Heavy Industrial Truck Tyre Cluster', severity: 'MODERATE', depth: 39, confidence: 0.84 },
      { lat: 16.45, lng: 86.15, type: 'Historical Depth Charge UXO Ordnance', severity: 'CRITICAL', depth: 55, confidence: 0.92 },
      { lat: 14.40, lng: 85.10, type: 'Sunken Fishing Skiff (Colonized Coral Reef)', severity: 'ECOLOGICAL', depth: 36, confidence: 0.97 },
      { lat: 15.65, lng: 86.80, type: 'Lost Polypropylene Cargo Mooring Line', severity: 'HIGH', depth: 58, confidence: 0.88 },
      { lat: 14.70, lng: 84.30, type: 'Subsurface Microplastic Silt Layer', severity: 'MODERATE', depth: 44, confidence: 0.81 },
      { lat: 16.10, lng: 85.50, type: 'Abandoned Purse-Seine Net Section', severity: 'HIGH', depth: 50, confidence: 0.91 },
      { lat: 15.35, lng: 86.25, type: 'Derelict Steel Drum & Petrochemical Slick', severity: 'CRITICAL', depth: 62, confidence: 0.93 },
      { lat: 14.15, lng: 85.60, type: 'Artificial Reef Nursery Wreckage', severity: 'ECOLOGICAL', depth: 34, confidence: 0.95 },
      { lat: 16.70, lng: 84.95, type: 'Submarine Canyon Lost Cargo Pallet', severity: 'MODERATE', depth: 72, confidence: 0.86 }
    ]
  },
  'Indian Ocean': {
    center: [-5.80, 74.20], zoom: 5,
    substrate: 'Abyssal Calcareous Ooze & Basaltic Floor (3,400m)',
    avg_backscatter: '-24.6 dB',
    debris: [
      { lat: -4.50, lng: 73.80, type: 'Lost 40ft Shipping Container (Steel Hull)', severity: 'HIGH', depth: 140, confidence: 0.92 },
      { lat: -6.90, lng: 75.10, type: 'Deep Pelagic Ghost Net Mass (150m+)', severity: 'CRITICAL', depth: 95, confidence: 0.96 },
      { lat: -5.20, lng: 72.90, type: 'Corroded Crude Oil Drum Array', severity: 'CRITICAL', depth: 110, confidence: 0.89 },
      { lat: -7.40, lng: 74.60, type: 'Heavy Commercial Longline Tangle', severity: 'HIGH', depth: 85, confidence: 0.87 },
      { lat: -4.10, lng: 75.80, type: 'High-Density Pelagic Plastic Raft', severity: 'MODERATE', depth: 60, confidence: 0.83 },
      { lat: -6.20, lng: 73.40, type: 'Lost Commercial Ship Anchor & Chain', severity: 'MODERATE', depth: 165, confidence: 0.91 },
      { lat: -7.80, lng: 72.10, type: 'Historic Steamship Boiler (Colonized Biotope)', severity: 'ECOLOGICAL', depth: 125, confidence: 0.94 },
      { lat: -3.80, lng: 74.90, type: 'Chagos Trench Microplastic Plume', severity: 'MODERATE', depth: 75, confidence: 0.79 },
      { lat: -5.90, lng: 76.20, type: 'Tuna Seine Net Fragment with Entangled Buoys', severity: 'HIGH', depth: 90, confidence: 0.90 },
      { lat: -6.60, lng: 71.80, type: 'Deepwater Acoustic Transponder Frame', severity: 'MODERATE', depth: 180, confidence: 0.86 },
      { lat: -4.90, lng: 75.30, type: 'Subsea Telemetry Cable Entanglement Node', severity: 'HIGH', depth: 130, confidence: 0.88 }
    ]
  },
  'Arabian Sea': {
    center: [17.80, 67.40], zoom: 6,
    substrate: 'Basaltic Sand, Indus Canyon Fan & Petro-Sediment',
    avg_backscatter: '-19.2 dB',
    debris: [
      { lat: 18.90, lng: 66.50, type: 'Mumbai-Muscat Tanker Route Pipeline Anomaly', severity: 'CRITICAL', depth: 78, confidence: 0.94 },
      { lat: 17.20, lng: 68.30, type: 'Monsoon Storm Derelict Trawl Net Ball', severity: 'CRITICAL', depth: 62, confidence: 0.97 },
      { lat: 18.40, lng: 67.90, type: 'Heavy Petrochemical Residue Barrel', severity: 'CRITICAL', depth: 95, confidence: 0.91 },
      { lat: 16.80, lng: 66.20, type: 'Discarded Gillnet Cluster (Entanglement Hazard)', severity: 'HIGH', depth: 52, confidence: 0.89 },
      { lat: 19.10, lng: 68.60, type: 'Macroplastic Packaging Raft Concentration', severity: 'MODERATE', depth: 38, confidence: 0.84 },
      { lat: 17.50, lng: 65.80, type: 'Sunken Dhow Cargo Timber & Iron Frame', severity: 'ECOLOGICAL', depth: 45, confidence: 0.93 },
      { lat: 18.10, lng: 69.10, type: 'Heavy Commercial Crane Wire & Hook Obstruction', severity: 'HIGH', depth: 88, confidence: 0.86 },
      { lat: 16.40, lng: 67.20, type: 'Drifting Nylon Monofilament Snag', severity: 'HIGH', depth: 56, confidence: 0.90 },
      { lat: 19.40, lng: 67.10, type: 'Subsea Wellhead Debris Casing Fragment', severity: 'HIGH', depth: 105, confidence: 0.88 },
      { lat: 17.90, lng: 68.80, type: 'Colonized Coral Reef Skiff Wreckage', severity: 'ECOLOGICAL', depth: 42, confidence: 0.96 },
      { lat: 16.95, lng: 68.05, type: 'Offshore Rig Drilling Mud Container', severity: 'HIGH', depth: 82, confidence: 0.87 }
    ]
  },
  'Pacific Garbage Patch': {
    center: [33.20, -141.50], zoom: 5,
    substrate: 'Pelagic Abyssal Red Clay & Microplastic Sediment (4,200m)',
    avg_backscatter: '-25.1 dB',
    debris: [
      { lat: 34.40, lng: -140.20, type: 'GPGP Megaplastic Raft (HDPE Crate Cluster)', severity: 'CRITICAL', depth: 14, confidence: 0.98 },
      { lat: 32.10, lng: -143.40, type: 'Ghost Net Ball (>200m Commercial Polypropylene)', severity: 'CRITICAL', depth: 9, confidence: 0.97 },
      { lat: 33.80, lng: -139.80, type: 'Derelict High-Seas Squid Jigging Buoy Array', severity: 'HIGH', depth: 18, confidence: 0.92 },
      { lat: 31.90, lng: -142.10, type: 'Subsurface Microplastic Dense Suspension Layer', severity: 'CRITICAL', depth: 6, confidence: 0.95 },
      { lat: 35.10, lng: -141.80, type: 'Lost Intermodal Cargo Container (Sealed Floating)', severity: 'HIGH', depth: 28, confidence: 0.90 },
      { lat: 32.70, lng: -144.20, type: 'Entangled Pelagic Turtle in Polyethylene Trap', severity: 'CRITICAL', depth: 4, confidence: 0.96 },
      { lat: 34.00, lng: -138.90, type: 'Degraded Agricultural Plastic Mulch Film', severity: 'HIGH', depth: 16, confidence: 0.87 },
      { lat: 31.40, lng: -140.60, type: 'Polyurethane Foam Flotation Fragment Mass', severity: 'MODERATE', depth: 22, confidence: 0.83 },
      { lat: 33.50, lng: -143.00, type: 'Deep Sinking Polyamide Benthic Deposit', severity: 'HIGH', depth: 45, confidence: 0.89 },
      { lat: 32.40, lng: -139.30, type: 'Multi-Filament Derelict Longline Raft', severity: 'HIGH', depth: 12, confidence: 0.91 }
    ]
  },
  'South Pacific': {
    center: [-48.80, -123.40], zoom: 4,
    substrate: 'Metalliferous Pelagic Clay & Abyssal Polymetallic Nodules (4,000m)',
    avg_backscatter: '-27.4 dB',
    debris: [
      { lat: -48.20, lng: -122.90, type: 'Point Nemo Spacecraft Cemetery (Titanium Stage Fragment)', severity: 'CRITICAL', depth: 3850, confidence: 0.95 },
      { lat: -49.40, lng: -124.20, type: 'De-Orbited Station Pressure Vessel Anomaly', severity: 'HIGH', depth: 3920, confidence: 0.92 },
      { lat: -47.90, lng: -123.80, type: 'Rocket Booster Thermal Shield Debris Field', severity: 'CRITICAL', depth: 3780, confidence: 0.94 },
      { lat: -50.10, lng: -122.40, type: 'Deep Sea Abyssal Microplastic Settling Layer', severity: 'MODERATE', depth: 4100, confidence: 0.81 },
      { lat: -48.60, lng: -124.80, type: 'Subsea Telemetry Sonar Transponder Hull', severity: 'MODERATE', depth: 3820, confidence: 0.88 },
      { lat: -47.30, lng: -122.10, type: 'Satellite Solar Array Frame Residue', severity: 'HIGH', depth: 3690, confidence: 0.90 },
      { lat: -49.80, lng: -123.30, type: 'Circumpolar Deepwater Drift Buoy Mooring', severity: 'MODERATE', depth: 3990, confidence: 0.86 }
    ]
  },
  'North Atlantic': {
    center: [34.50, -48.20], zoom: 5,
    substrate: 'Glaciomarine Sediment, Pelagic Calcareous Ooze & Abyssal Silt',
    avg_backscatter: '-22.9 dB',
    debris: [
      { lat: 35.80, lng: -46.90, type: 'Sargasso Sea Ghost Net Ball Entangled in Seaweed', severity: 'CRITICAL', depth: 38, confidence: 0.96 },
      { lat: 33.40, lng: -49.80, type: 'North Atlantic Storm-Loss Cargo Container', severity: 'HIGH', depth: 85, confidence: 0.91 },
      { lat: 36.20, lng: -47.50, type: 'Chemical Solvent Drum (Corroded Hazard)', severity: 'CRITICAL', depth: 110, confidence: 0.93 },
      { lat: 32.80, lng: -48.90, type: 'Trans-Atlantic Macroplastic Packaging Patch', severity: 'HIGH', depth: 25, confidence: 0.87 },
      { lat: 35.10, lng: -50.30, type: 'Abandoned Cod Trap Pot Cluster', severity: 'HIGH', depth: 68, confidence: 0.89 },
      { lat: 33.90, lng: -46.20, type: 'Sunken Trawler Wreck (Thriving Artificial Reef)', severity: 'ECOLOGICAL', depth: 55, confidence: 0.97 },
      { lat: 36.90, lng: -49.20, type: 'Heavy Commercial Wire Tow Rope Obstruction', severity: 'HIGH', depth: 92, confidence: 0.85 },
      { lat: 34.20, lng: -47.10, type: 'Sargasso Microplastic Floating Concentration', severity: 'MODERATE', depth: 15, confidence: 0.84 },
      { lat: 32.10, lng: -47.80, type: 'Derelict Trans-Ocean Weather Buoy Mooring', severity: 'MODERATE', depth: 42, confidence: 0.88 },
      { lat: 35.60, lng: -48.60, type: 'Deep Sea Cable Scrap & Entangled Ghost Gear', severity: 'HIGH', depth: 120, confidence: 0.90 }
    ]
  },
  'South Atlantic': {
    center: [-25.50, -18.50], zoom: 5,
    substrate: 'Carbonate Ooze, Pelagic Sand & Mid-Atlantic Basalt',
    avg_backscatter: '-23.8 dB',
    debris: [
      { lat: -24.20, lng: -17.80, type: 'South Atlantic Gyre Plastic Aggregation', severity: 'HIGH', depth: 32, confidence: 0.89 },
      { lat: -26.80, lng: -19.40, type: 'Commercial Tuna Longline Monofilament Tangle', severity: 'CRITICAL', depth: 65, confidence: 0.94 },
      { lat: -23.90, lng: -18.90, type: 'Storm-Loss Shipping Container (Corroded)', severity: 'HIGH', depth: 135, confidence: 0.88 },
      { lat: -27.10, lng: -17.20, type: 'Industrial Heavy Oil Residue Drum', severity: 'CRITICAL', depth: 98, confidence: 0.92 },
      { lat: -25.80, lng: -20.10, type: 'Abandoned Gillnet Raft with Attached Weights', severity: 'HIGH', depth: 55, confidence: 0.91 },
      { lat: -24.90, lng: -19.70, type: 'Historic Sunken Freighter (Subsea Marine Habitat)', severity: 'ECOLOGICAL', depth: 72, confidence: 0.96 },
      { lat: -26.30, lng: -18.10, type: 'Subsea Mooring Anchor & Trawl Wire', severity: 'MODERATE', depth: 150, confidence: 0.85 }
    ]
  },
  'Mediterranean Sea': {
    center: [36.20, 16.80], zoom: 6,
    substrate: 'Sapropelic Mud, Biogenic Carbonate & Volcanic Ash (1,800m)',
    avg_backscatter: '-18.7 dB',
    debris: [
      { lat: 36.90, lng: 15.80, type: 'Sicilian Channel Trawler Ghost Net', severity: 'CRITICAL', depth: 58, confidence: 0.97 },
      { lat: 35.40, lng: 17.50, type: 'High Density Mediterranean Microplastic Slick', severity: 'CRITICAL', depth: 18, confidence: 0.93 },
      { lat: 37.10, lng: 16.40, type: 'Corroded Industrial Chemical Canister', severity: 'CRITICAL', depth: 85, confidence: 0.91 },
      { lat: 35.90, lng: 18.20, type: 'Discarded Monofilament Nylon Net Section', severity: 'HIGH', depth: 42, confidence: 0.89 },
      { lat: 36.40, lng: 15.20, type: 'Heavy Commercial Vehicle Tyres (20+ Array)', severity: 'MODERATE', depth: 35, confidence: 0.86 },
      { lat: 35.10, lng: 16.90, type: 'Ancient Roman Amphora Wreck (Protected Bio-Nursery)', severity: 'ECOLOGICAL', depth: 64, confidence: 0.98 },
      { lat: 37.50, lng: 17.10, type: 'Lost Tourist Yacht Fiberglass Hull', severity: 'HIGH', depth: 48, confidence: 0.90 },
      { lat: 36.10, lng: 17.80, type: 'Derelict Fishing Pot & Polypropylene Line', severity: 'HIGH', depth: 52, confidence: 0.88 },
      { lat: 35.70, lng: 15.90, type: 'Colonized Skiff Reef (Posidonia Meadow Protection)', severity: 'ECOLOGICAL', depth: 28, confidence: 0.96 },
      { lat: 36.70, lng: 18.50, type: 'Subsea Telecommunications Cable Snag', severity: 'HIGH', depth: 110, confidence: 0.87 }
    ]
  },
  'Arctic Ocean': {
    center: [76.50, 24.00], zoom: 5,
    substrate: 'Glaciomarine Till, Polar Siliceous Silt & Gravel',
    avg_backscatter: '-20.4 dB',
    debris: [
      { lat: 77.20, lng: 22.80, type: 'Ice-Pack Trapped Heavy Polyamide Ghost Net', severity: 'CRITICAL', depth: 32, confidence: 0.95 },
      { lat: 75.80, lng: 25.40, type: 'Abandoned King Crab Commercial Trap Array', severity: 'CRITICAL', depth: 55, confidence: 0.93 },
      { lat: 76.90, lng: 26.10, type: 'Offshore Exploration Drilling Casing Residue', severity: 'HIGH', depth: 85, confidence: 0.89 },
      { lat: 75.20, lng: 23.10, type: 'Sub-Zero High-Density Microplastic Layer', severity: 'HIGH', depth: 14, confidence: 0.91 },
      { lat: 77.80, lng: 24.50, type: 'Lost Polar Oceanographic Survey Buoy Mooring', severity: 'MODERATE', depth: 42, confidence: 0.86 },
      { lat: 76.10, lng: 21.90, type: 'Derelict Steel Drum with Low-Temp Fuel Trace', severity: 'CRITICAL', depth: 68, confidence: 0.92 },
      { lat: 75.50, lng: 25.80, type: 'Ice-Crushed Wooden Research Skiff (Arctic Reef)', severity: 'ECOLOGICAL', depth: 38, confidence: 0.94 },
      { lat: 77.40, lng: 23.60, type: 'Trawl Net Cod-End Fragment in Silt', severity: 'HIGH', depth: 48, confidence: 0.88 },
      { lat: 76.40, lng: 26.50, type: 'Sub-Ice Polymer Sheeting Aggregation', severity: 'MODERATE', depth: 20, confidence: 0.84 }
    ]
  },
  'Southern Ocean': {
    center: [-59.00, -58.00], zoom: 5,
    substrate: 'Diatomaceous Antarctic Ooze & Dropstone Gravel (3,200m)',
    avg_backscatter: '-26.2 dB',
    debris: [
      { lat: -58.20, lng: -56.80, type: 'Drake Passage Circumpolar Plastic Drift Hotspot', severity: 'HIGH', depth: 25, confidence: 0.90 },
      { lat: -59.80, lng: -59.20, type: 'Derelict Toothfish Longline Ghost Gear (4km)', severity: 'CRITICAL', depth: 240, confidence: 0.96 },
      { lat: -57.90, lng: -57.40, type: 'Historical Whaling Vessel Iron Mooring Scrap', severity: 'HIGH', depth: 85, confidence: 0.89 },
      { lat: -60.20, lng: -58.60, type: 'Antarctic Microplastic Ingestion Hazard Zone', severity: 'CRITICAL', depth: 15, confidence: 0.92 },
      { lat: -58.70, lng: -60.10, type: 'Lost Deep-Sea Acoustic Array Anchor Weight', severity: 'MODERATE', depth: 320, confidence: 0.87 },
      { lat: -59.40, lng: -56.20, type: 'Subsea Scientific Mooring Cable Entanglement', severity: 'HIGH', depth: 180, confidence: 0.91 },
      { lat: -57.50, lng: -58.90, type: 'Historic Explorers Wreckage (Protected Heritage Site)', severity: 'ECOLOGICAL', depth: 65, confidence: 0.97 }
    ]
  },
  'South China Sea': {
    center: [13.20, 114.50], zoom: 6,
    substrate: 'Terrigenous Silt, Coralline Rubble & Pelagic Clay',
    avg_backscatter: '-19.8 dB',
    debris: [
      { lat: 14.10, lng: 113.80, type: 'Intensive Shipping Lane Lost Container (20ft)', severity: 'HIGH', depth: 85, confidence: 0.91 },
      { lat: 12.50, lng: 115.20, type: 'Heavy Commercial Purse-Seine Ghost Net Ball', severity: 'CRITICAL', depth: 42, confidence: 0.97 },
      { lat: 13.80, lng: 114.90, type: 'Toxic Bilge & Petrochemical Drum Deposit', severity: 'CRITICAL', depth: 72, confidence: 0.93 },
      { lat: 12.80, lng: 113.40, type: 'Coral Reef Smothering Plastic Film Raft', severity: 'CRITICAL', depth: 24, confidence: 0.95 },
      { lat: 14.50, lng: 115.60, type: 'Tyre & Concrete Artificial Reef Structure', severity: 'ECOLOGICAL', depth: 32, confidence: 0.98 },
      { lat: 13.10, lng: 114.20, type: 'Derelict Fishing Skiff with Monofilament Snag', severity: 'HIGH', depth: 48, confidence: 0.89 },
      { lat: 12.20, lng: 114.70, type: 'Subsea Optical Cable Anchor Drag Anomaly', severity: 'HIGH', depth: 120, confidence: 0.88 },
      { lat: 13.60, lng: 115.80, type: 'Heavy Cargo Pallet & Polyethylene Strap Clump', severity: 'MODERATE', depth: 55, confidence: 0.85 }
    ]
  },
  'Red Sea': {
    center: [21.80, 38.20], zoom: 6,
    substrate: 'Evaporitic Carbonate Sand, Coral Rubble & Volcanic Basalt',
    avg_backscatter: '-17.9 dB',
    debris: [
      { lat: 22.50, lng: 37.60, type: 'Bab-el-Mandeb Transit Route Container Spoil', severity: 'HIGH', depth: 95, confidence: 0.92 },
      { lat: 21.20, lng: 38.80, type: 'Tangled Shark Protection Net Fragment', severity: 'CRITICAL', depth: 34, confidence: 0.96 },
      { lat: 22.10, lng: 38.40, type: 'Corroded Industrial Chemical Tank Residue', severity: 'CRITICAL', depth: 68, confidence: 0.94 },
      { lat: 21.60, lng: 37.90, type: 'High Salinity Thermal Brine Pool Plastic Drift', severity: 'HIGH', depth: 180, confidence: 0.87 },
      { lat: 20.80, lng: 38.50, type: 'Sunken Wood Dhow Hull (Biodiversity Coral Haven)', severity: 'ECOLOGICAL', depth: 28, confidence: 0.98 },
      { lat: 22.80, lng: 38.90, type: 'Heavy Cargo Anchor Fluke & Drag Mark', severity: 'MODERATE', depth: 115, confidence: 0.86 },
      { lat: 21.40, lng: 39.10, type: 'Discarded Nylon Monofilament Net Cluster', severity: 'HIGH', depth: 45, confidence: 0.90 }
    ]
  }
};

class DebrisMapModule {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.map = null;
    this.currentTileLayer = null;
    this.tileLayers = {};
    this.markers = [];
    this.heatCircles = [];
    this.trackLine = null;
    this.swathPolygon = null;
    this.auvMarker = null;
    this.auvConePolygon = null;

    this.activeFilter = 'ALL';
    this.showHeatmap = true;
    this.showSatelliteFootprint = true;
    this.currentMissionId = 'MSN-2026-BOB-09';
    this.centerCoords = [17.6875, 83.2195]; // Bay of Bengal Shelf

    // AUV Simulation state
    this.isSimulating = false;
    this.simStep = 0;
    this.simTimer = null;
    this.simSpeedKnots = 3.2;

    // Interactive Add Hotspot state
    this.isAddTargetMode = false;
    this.tempClickCoord = null;
    this.currentOceanRegion = 'Bay of Bengal';

    window.debrisMap = this;
    this.init();
  }

  init() {
    if (typeof L !== 'undefined' && this.container) {
      this.initLeafletMap();
    } else {
      console.warn('Leaflet library loading, initializing vector tactical ocean map...');
      this.initVectorTacticalMap();
    }

    this.setupHUDCrosshair();
    this.createAddTargetModal();
  }

  initLeafletMap() {
    try {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      this.container.innerHTML = '';

      // Initialize map instance with mobile-friendly gestures
      this.map = L.map(this.containerId, {
        zoomControl: true,
        attributionControl: false,
        preferCanvas: true,
        tap: true,
        touchZoom: true
      }).setView(this.centerCoords, 15);

      // 1. Dark Bathymetry Ocean (CartoDB Dark)
      this.tileLayers['dark'] = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      });

      // 2. High-Res Satellite Imagery (Esri World Imagery)
      this.tileLayers['satellite'] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      });

      // 3. Nautical Topo Basemap (OpenStreetMap)
      this.tileLayers['nautical'] = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      });

      // Default to dark bathymetry
      this.currentTileLayer = this.tileLayers['dark'].addTo(this.map);

      // Handle tile error fallback
      this.currentTileLayer.on('tileerror', () => {
        console.warn('Tile load warning, falling back to vector bathymetric canvas layer');
      });

      // Plot AUV survey track and swath corridor
      this.plotSurveyTrack(this.centerCoords);

      // Load detections from API or local fallback
      this.loadDetections();

      // Setup click handler for Add Hotspot mode
      this.map.on('click', (e) => {
        if (this.isAddTargetMode) {
          this.handleMapClickToAddTarget(e.latlng);
        }
      });

      // Ensure proper sizing
      setTimeout(() => this.resize(), 100);
      setTimeout(() => this.resize(), 350);

    } catch (err) {
      console.error('Leaflet initialization error, using vector tactical map:', err);
      this.initVectorTacticalMap();
    }
  }

  switchBasemap(layerKey) {
    if (!this.map || !this.tileLayers[layerKey]) return;

    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }

    this.currentTileLayer = this.tileLayers[layerKey].addTo(this.map);

    // Update UI active buttons
    document.querySelectorAll('.map-layer-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-layer') === layerKey);
    });

    if (window.app) {
      window.app.showToast(`Switched Basemap to: ${layerKey.toUpperCase()}`, 'info');
    }
  }

  switchOceanRegion(regionName) {
    const region = GLOBAL_OCEAN_MISSIONS[regionName];
    if (!region) return;

    this.currentOceanRegion = regionName;
    this.centerCoords = region.center;

    if (this.map) {
      this.map.flyTo(region.center, region.zoom || 6, { duration: 1.2 });
      this.plotSurveyTrack(region.center);
    }

    this.renderRegionDetections(region.debris);

    // Update map card title
    const titleEl = document.getElementById('debrisMapTitle');
    if (titleEl) {
      titleEl.innerHTML = `🗺️ Bathymetric Seafloor GIS & Debris Hotspot Map (${regionName})`;
    }

    // Update HUD
    const hudLat = document.getElementById('mapHudLat');
    const hudLng = document.getElementById('mapHudLng');
    const hudDepth = document.getElementById('mapHudDepth');
    const hudSubstrate = document.getElementById('mapHudSubstrate');
    const hudBackscatter = document.getElementById('mapHudBackscatter');
    if (hudLat) hudLat.textContent = `${region.center[0] >= 0 ? region.center[0].toFixed(4) + '°N' : Math.abs(region.center[0]).toFixed(4) + '°S'}`;
    if (hudLng) hudLng.textContent = `${region.center[1] >= 0 ? region.center[1].toFixed(4) + '°E' : Math.abs(region.center[1]).toFixed(4) + '°W'}`;
    if (hudDepth && region.debris.length > 0) hudDepth.textContent = `${region.debris[0].depth} m`;
    if (hudSubstrate) hudSubstrate.textContent = region.substrate || 'Pelagic Marine Silt';
    if (hudBackscatter) hudBackscatter.textContent = region.avg_backscatter || '-21.4 dB';

    // Sync select dropdown
    const sel = document.getElementById('oceanRegionSelect');
    if (sel && sel.value !== regionName) sel.value = regionName;

    if (window.app) {
      window.app.showToast(`Ocean Region: ${regionName} (${region.debris.length} Hotspots)`, 'info');
      if (window.app.audioFX) window.app.audioFX.playBlip();
    }
  }

  renderRegionDetections(debrisList) {
    if (!debrisList || !debrisList.length) return;

    // Clear existing markers and heat circles
    this.markers.forEach(m => {
      if (this.map && m) this.map.removeLayer(m);
    });
    this.markers = [];
    if (this.heatCircles) {
      this.heatCircles.forEach(c => {
        if (this.map && c) this.map.removeLayer(c);
      });
      this.heatCircles = [];
    }

    const code = (this.currentOceanRegion || 'BOB').substring(0, 3).toUpperCase();
    const formatted = debrisList.map((item, idx) => {
      let cat = 'Plastic Debris Raft';
      let haz = item.severity === 'CRITICAL' ? 'CRITICAL' : (item.severity === 'ECOLOGICAL' ? 'ECOLOGICAL_HABITAT' : (item.severity === 'HIGH' ? 'HIGH' : 'MODERATE'));
      if (item.type.toLowerCase().includes('net') || item.type.toLowerCase().includes('skiff')) {
        cat = 'Ghost Fishing Gear';
      } else if (item.type.toLowerCase().includes('drum') || item.type.toLowerCase().includes('chemical') || item.type.toLowerCase().includes('spill') || item.type.toLowerCase().includes('drilling')) {
        cat = 'Toxic Industrial Hazard';
      } else if (item.type.toLowerCase().includes('ordnance') || item.type.toLowerCase().includes('container') || item.type.toLowerCase().includes('anchor')) {
        cat = 'Subsea Obstruction';
      } else if (item.type.toLowerCase().includes('coral') || item.type.toLowerCase().includes('skiff') || item.severity === 'ECOLOGICAL') {
        cat = 'Artificial Reef Nursery';
        haz = 'ECOLOGICAL_HABITAT';
      }
      return {
        id: `DET-${code}-${String(idx + 1).padStart(3, '0')}`,
        label: item.type,
        category: cat,
        lat: item.lat,
        lng: item.lng,
        confidence: item.confidence,
        estimated_mass_kg: Math.round(item.depth * 4.2 + 50),
        depth_m: item.depth,
        hazard_level: haz,
        status: item.severity === 'CRITICAL' ? 'Immediate Clean-Up Required' : (item.severity === 'ECOLOGICAL' ? 'Protected Habitat' : 'Flagged for Grapple')
      };
    });

    this.renderMarkers(formatted);
    if (this.showHeatmap) {
      this.renderDensityHeatmap(formatted);
    }
  }

  plotSurveyTrack(center) {
    if (!this.map) return;

    // AUV Survey Line Coordinates (High Resolution Waypoints)
    this.trackCoords = [
      [center[0] - 0.010, center[1] - 0.010],
      [center[0] - 0.007, center[1] - 0.007],
      [center[0] - 0.004, center[1] - 0.004],
      [center[0] - 0.001, center[1] - 0.001],
      [center[0] + 0.002, center[1] + 0.002],
      [center[0] + 0.005, center[1] + 0.005],
      [center[0] + 0.008, center[1] + 0.008],
      [center[0] + 0.011, center[1] + 0.011]
    ];

    // Swath polygon (150m width acoustic footprint)
    const swathCorridor = [
      [center[0] - 0.0105, center[1] - 0.0085],
      [center[0] + 0.0115, center[1] + 0.0125],
      [center[0] + 0.0105, center[1] + 0.0135],
      [center[0] - 0.0115, center[1] - 0.0075]
    ];

    if (this.swathPolygon) this.map.removeLayer(this.swathPolygon);
    this.swathPolygon = L.polygon(swathCorridor, {
      color: '#00f0ff',
      weight: 1.5,
      dashArray: '4, 4',
      fillColor: 'rgba(0, 240, 255, 0.08)',
      fillOpacity: 0.18
    }).addTo(this.map);

    if (this.trackLine) this.map.removeLayer(this.trackLine);
    this.trackLine = L.polyline(this.trackCoords, {
      color: '#00f0ff',
      weight: 2.5
    }).addTo(this.map);

    // Initial AUV Vehicle Beacon Marker
    const auvIcon = L.divIcon({
      className: 'auv-beacon-icon',
      html: `
        <div style="position:relative; width:32px; height:32px;">
          <div style="position:absolute; width:32px; height:32px; border-radius:50%; background:rgba(0,240,255,0.25); animation:auvPulse 1.8s infinite;"></div>
          <div style="position:absolute; top:7px; left:7px; width:18px; height:18px; background:#00f0ff; border:2px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px #00f0ff; font-size:10px; font-weight:bold; color:#050914;">
            ⚓
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (this.auvMarker) this.map.removeLayer(this.auvMarker);
    this.auvMarker = L.marker(this.trackCoords[0], { icon: auvIcon }).addTo(this.map);
    this.auvMarker.bindTooltip("<strong>AUV DeepScan-IV</strong><br>Speed: 3.2 kn | Alt: 15.0m | SSS: 455 kHz", {
      className: 'sonar-tooltip',
      direction: 'top'
    });
  }

  loadDetections(filter = 'ALL') {
    if (this.currentOceanRegion && this.currentOceanRegion !== 'Bay of Bengal' && GLOBAL_OCEAN_MISSIONS[this.currentOceanRegion]) {
      this.renderRegionDetections(GLOBAL_OCEAN_MISSIONS[this.currentOceanRegion].debris);
      return;
    }
    fetch(`/api/detections?mission_id=${this.currentMissionId}`)
      .then(res => res.json())
      .then(data => {
        let detections = data.detections || [];
        if (filter !== 'ALL') {
          detections = detections.filter(d => {
            if (filter === 'CRITICAL') return d.hazard_level === 'CRITICAL';
            if (filter === 'HABITAT') return d.hazard_level === 'ECOLOGICAL_HABITAT';
            if (filter === 'HIGH') return d.hazard_level === 'HIGH';
            return d.category.toLowerCase().includes(filter.toLowerCase());
          });
        }
        this.renderMarkers(detections);
        if (this.showHeatmap) {
          this.renderDensityHeatmap(detections);
        }
      })
      .catch(err => {
        console.warn('Detections API unreachable, rendering resilient hydrographic dataset:', err);
        this.renderResilientFallback(filter);
      });
  }

  renderResilientFallback(filter) {
    const fallbackDetections = [
      {
        id: "DET-2026-001",
        label: "Ghost Trawler Net Raft (Polyamide Monofilament)",
        category: "Ghost Fishing Gear",
        lat: this.centerCoords[0] + 0.003,
        lng: this.centerCoords[1] + 0.002,
        confidence: 0.942,
        estimated_mass_kg: 320,
        depth_m: 43.2,
        hazard_level: "CRITICAL",
        status: "Flagged for Recovery"
      },
      {
        id: "DET-2026-002",
        label: "Corroded Industrial Chemical Drum",
        category: "Toxic Industrial Hazard",
        lat: this.centerCoords[0] - 0.003,
        lng: this.centerCoords[1] - 0.004,
        confidence: 0.887,
        estimated_mass_kg: 85,
        depth_m: 46.8,
        hazard_level: "HIGH",
        status: "Pending Diver Review"
      },
      {
        id: "DET-2026-003",
        label: "Sunken Fishing Skiff Hull (Colonized Coral Reef)",
        category: "Artificial Reef Nursery",
        lat: this.centerCoords[0] + 0.007,
        lng: this.centerCoords[1] + 0.006,
        confidence: 0.965,
        estimated_mass_kg: 850,
        depth_m: 38.5,
        hazard_level: "ECOLOGICAL_HABITAT",
        status: "PROTECTED REEF (Do Not Disturb)"
      },
      {
        id: "DET-2026-004",
        label: "Cluster of Heavy Industrial Truck Tyres",
        category: "Rubber Marine Debris",
        lat: this.centerCoords[0] - 0.006,
        lng: this.centerCoords[1] - 0.005,
        confidence: 0.824,
        estimated_mass_kg: 140,
        depth_m: 44.1,
        hazard_level: "MODERATE",
        status: "Scheduled for Grapple"
      },
      {
        id: "DET-2026-005",
        label: "Unexploded Ordnance (Historical Depth Charge UXO)",
        category: "Munitions Hazard",
        lat: this.centerCoords[0] + 0.001,
        lng: this.centerCoords[1] - 0.002,
        confidence: 0.912,
        estimated_mass_kg: 210,
        depth_m: 48.0,
        hazard_level: "CRITICAL",
        status: "Navy EOD Alert Issued"
      }
    ];

    let filtered = fallbackDetections;
    if (filter !== 'ALL') {
      filtered = fallbackDetections.filter(d => {
        if (filter === 'CRITICAL') return d.hazard_level === 'CRITICAL';
        if (filter === 'HABITAT') return d.hazard_level === 'ECOLOGICAL_HABITAT';
        if (filter === 'HIGH') return d.hazard_level === 'HIGH';
        return d.category.toLowerCase().includes(filter.toLowerCase());
      });
    }

    this.renderMarkers(filtered);
    if (this.showHeatmap) this.renderDensityHeatmap(filtered);
  }

  renderMarkers(detections) {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    detections.forEach(det => {
      let pinColor = '#00f0ff';
      let iconSymbol = '📍';
      let pulseAnim = '';

      if (det.hazard_level === 'CRITICAL') {
        pinColor = '#ff3366';
        iconSymbol = '🚨';
        pulseAnim = 'animation: hazardPulse 1.5s infinite;';
      } else if (det.hazard_level === 'HIGH') {
        pinColor = '#fb8500';
        iconSymbol = '⚠️';
      } else if (det.hazard_level === 'ECOLOGICAL_HABITAT') {
        pinColor = '#00ff88';
        iconSymbol = '🪸';
      } else {
        pinColor = '#ffb703';
        iconSymbol = '📦';
      }

      const customIcon = L.divIcon({
        className: 'sonar-marker-icon',
        html: `
          <div style="position:relative; width:26px; height:26px; cursor:pointer;" onclick="if(window.app) window.app.selectDetection('${det.id}')">
            <div style="position:absolute; width:26px; height:26px; border-radius:50%; background:${pinColor}; opacity:0.3; ${pulseAnim}"></div>
            <div style="position:absolute; top:3px; left:3px; width:20px; height:20px; background:#070b14; border:2px solid ${pinColor}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px ${pinColor}; font-size:10px;">
              ${iconSymbol}
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([det.lat, det.lng], { icon: customIcon }).addTo(this.map);

      // Hydrographic Interactive Popup
      const popupHtml = `
        <div style="font-family:'Inter', sans-serif; min-width:240px; color:#ffffff; padding:4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#00f0ff; font-weight:bold;">${det.id}</span>
            <span style="font-size:10px; font-weight:bold; color:${pinColor}; border:1px solid ${pinColor}; padding:2px 6px; border-radius:3px;">${det.hazard_level}</span>
          </div>
          <div style="font-size:12px; font-weight:bold; margin-bottom:4px; color:#ffffff;">${det.label}</div>
          <div style="font-size:11px; color:#a0aec0; margin-bottom:8px;">${det.category}</div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:10px; background:#070b14; padding:6px; border-radius:4px; margin-bottom:8px; font-family:'JetBrains Mono', monospace;">
            <div>Depth: <span style="color:#00f0ff;">${det.depth_m || 42.5}m</span></div>
            <div>Mass: <span style="color:#ffb703;">${det.estimated_mass_kg || 150}kg</span></div>
            <div>Confidence: <span style="color:#00ff88;">${((det.confidence || 0.9) * 100).toFixed(1)}%</span></div>
            <div>Acoustic dB: <span style="color:#ff70a6;">-21.4 dB</span></div>
          </div>

          <div style="display:flex; gap:6px;">
            <button class="btn-sonar-primary" style="flex:1; padding:5px 8px; font-size:10px;" onclick="if(window.app){ window.app.selectDetection('${det.id}'); window.app.switchTab('tab-waterfall'); }">
              🔍 Inspect Sonar
            </button>
            <button class="btn-sonar-secondary" style="flex:1; padding:5px 8px; font-size:10px;" onclick="if(window.inspector) window.inspector.explain('acoustic-shadow')">
              💡 Explain
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });
      this.markers.push(marker);
    });
  }

  renderDensityHeatmap(detections) {
    if (!this.map) return;

    this.heatCircles.forEach(c => this.map.removeLayer(c));
    this.heatCircles = [];

    detections.forEach(det => {
      const radiusM = det.hazard_level === 'CRITICAL' ? 120 : (det.hazard_level === 'HIGH' ? 90 : 60);
      const fillColor = det.hazard_level === 'CRITICAL' ? '#ff3366' : (det.hazard_level === 'ECOLOGICAL_HABITAT' ? '#00ff88' : '#ffb703');

      const circle = L.circle([det.lat, det.lng], {
        radius: radiusM,
        color: 'transparent',
        fillColor: fillColor,
        fillOpacity: 0.16
      }).addTo(this.map);

      this.heatCircles.push(circle);
    });
  }

  toggleHeatmap(show) {
    this.showHeatmap = show;
    if (this.showHeatmap) {
      this.loadDetections(this.activeFilter);
    } else {
      this.heatCircles.forEach(c => this.map.removeLayer(c));
      this.heatCircles = [];
    }
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey;
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filterKey);
    });
    this.loadDetections(filterKey);
  }

  recenterTrack() {
    if (this.map) {
      this.map.flyTo(this.centerCoords, 15, { duration: 1.0 });
    }
  }

  resize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  toggleFullscreen() {
    const mapCard = document.getElementById('debrisMapCard') || this.container.parentElement;
    if (!mapCard) return;

    mapCard.classList.toggle('map-fullscreen-active');
    const isFull = mapCard.classList.contains('map-fullscreen-active');

    const btn = document.getElementById('btnToggleMapFullscreen');
    if (btn) {
      btn.innerHTML = isFull ? '<span>✖</span> Exit Fullscreen' : '<span>⛶</span> Fullscreen';
      btn.classList.toggle('active', isFull);
    }

    setTimeout(() => this.resize(), 150);
  }

  // Autonomous AUV Mission Simulation
  toggleMissionSimulation() {
    if (this.isSimulating) {
      this.stopMissionSimulation();
    } else {
      this.startMissionSimulation();
    }
  }

  startMissionSimulation() {
    if (!this.map || !this.trackCoords) return;

    this.isSimulating = true;
    this.simStep = 0;

    const btn = document.getElementById('btnSimulateMission');
    if (btn) {
      btn.innerHTML = '<span>⏸</span> Pause Mission';
      btn.classList.add('active');
    }

    if (window.app) {
      window.app.showToast('🚀 Autonomous AUV Mission Started: Sweeping Transect Track BB-09', 'info');
      if (window.app.audioFX) window.app.audioFX.playSonarPing();
    }

    // High resolution waypoint interpolation
    const totalWaypoints = 80;
    const path = [];
    for (let i = 0; i < this.trackCoords.length - 1; i++) {
      const p1 = this.trackCoords[i];
      const p2 = this.trackCoords[i + 1];
      const stepsBetween = Math.floor(totalWaypoints / (this.trackCoords.length - 1));
      for (let s = 0; s < stepsBetween; s++) {
        const t = s / stepsBetween;
        path.push([
          p1[0] + (p2[0] - p1[0]) * t,
          p1[1] + (p2[1] - p1[1]) * t
        ]);
      }
    }
    path.push(this.trackCoords[this.trackCoords.length - 1]);

    this.simTimer = setInterval(() => {
      if (this.simStep >= path.length) {
        this.simStep = 0; // Loop or stop
      }

      const currPos = path[this.simStep];
      if (this.auvMarker) {
        this.auvMarker.setLatLng(currPos);
      }

      // Play occasional sonar ping
      if (this.simStep % 15 === 0 && window.app && window.app.audioFX) {
        window.app.audioFX.playSonarPing();
      }

      // Check proximity to debris markers
      this.markers.forEach(marker => {
        const mPos = marker.getLatLng();
        const dist = Math.hypot(mPos.lat - currPos[0], mPos.lng - currPos[1]);
        if (dist < 0.002 && !marker._discovered) {
          marker._discovered = true;
          marker.openPopup();
          if (window.app) {
            window.app.showToast(`🎯 AUV Acoustic Sensor Intercepted Target!`, 'info');
            if (window.app.audioFX) window.app.audioFX.playDetectionChime();
          }
        }
      });

      this.simStep++;
    }, 450);
  }

  stopMissionSimulation() {
    this.isSimulating = false;
    if (this.simTimer) clearInterval(this.simTimer);
    this.simTimer = null;

    const btn = document.getElementById('btnSimulateMission');
    if (btn) {
      btn.innerHTML = '<span>▶</span> Run AUV Mission';
      btn.classList.remove('active');
    }

    if (window.app) {
      window.app.showToast('AUV Survey Mission Paused', 'info');
    }
  }

  // Interactive Add Debris Target Mode
  activateAddTargetMode() {
    this.isAddTargetMode = !this.isAddTargetMode;
    const btn = document.getElementById('btnAddDebrisTarget');
    if (btn) {
      btn.classList.toggle('active', this.isAddTargetMode);
      btn.innerHTML = this.isAddTargetMode ? '<span>✖</span> Cancel Pin' : '<span>➕</span> Mark Hotspot';
    }

    if (this.container) {
      this.container.style.cursor = this.isAddTargetMode ? 'crosshair' : 'default';
    }

    if (window.app) {
      window.app.showToast(
        this.isAddTargetMode 
          ? '🎯 Click anywhere on the map to register a new debris hotspot target!' 
          : 'Hotspot marking mode cancelled',
        'info'
      );
    }
  }

  handleMapClickToAddTarget(latlng) {
    this.tempClickCoord = latlng;
    this.activateAddTargetMode(); // deactivate cursor

    const modal = document.getElementById('sonarxAddTargetModal');
    if (modal) {
      document.getElementById('newTargetLat').value = latlng.lat.toFixed(6);
      document.getElementById('newTargetLng').value = latlng.lng.toFixed(6);
      // Simulated depth
      const simDepth = 40.0 + (Math.sin(latlng.lat * 50) + Math.cos(latlng.lng * 50)) * 6.5;
      document.getElementById('newTargetDepth').value = simDepth.toFixed(1);
      modal.style.display = 'flex';
    }
  }

  createAddTargetModal() {
    if (document.getElementById('sonarxAddTargetModal')) return;

    const modal = document.createElement('div');
    modal.id = 'sonarxAddTargetModal';
    modal.className = 'sonar-modal-overlay';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="sonar-modal-card" style="max-width: 520px;">
        <div class="sonar-modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.5rem;">➕</span>
            <div>
              <div style="font-size:0.7rem; color:var(--sonar-cyan); font-family:var(--font-mono); text-transform:uppercase;">
                Hydrographic Target Registration &bull; REST API
              </div>
              <h3 style="margin:0; font-size:1.15rem; color:#fff;">Mark Ocean Debris Hotspot</h3>
            </div>
          </div>
          <button class="sonar-modal-close" onclick="document.getElementById('sonarxAddTargetModal').style.display='none'">&times;</button>
        </div>

        <div class="sonar-modal-body" style="padding:16px 20px;">
          <form id="formAddDebrisTarget" onsubmit="event.preventDefault(); window.debrisMap.submitNewTarget();">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Latitude (°N)</label>
                <input type="text" id="newTargetLat" required readonly style="width:100%; background:#070b14; border:1px solid var(--border-subtle); color:#00f0ff; padding:8px; border-radius:4px; font-family:var(--font-mono); font-size:0.8rem;">
              </div>
              <div>
                <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Longitude (°E)</label>
                <input type="text" id="newTargetLng" required readonly style="width:100%; background:#070b14; border:1px solid var(--border-subtle); color:#00f0ff; padding:8px; border-radius:4px; font-family:var(--font-mono); font-size:0.8rem;">
              </div>
            </div>

            <div style="margin-bottom:12px;">
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Debris Classification</label>
              <select id="newTargetCategory" style="width:100%; background:var(--bg-surface); border:1px solid var(--border-subtle); color:#fff; padding:8px; border-radius:4px; font-size:0.82rem;">
                <option value="Ghost Fishing Gear">Ghost Fishing Net Raft (Monofilament)</option>
                <option value="Toxic Industrial Hazard">Corroded Chemical Drum / Canister</option>
                <option value="Rubber Marine Debris">Discarded Heavy Tyres / Rubber</option>
                <option value="Munitions Hazard">Unexploded Ordnance (UXO) / Historical Shell</option>
                <option value="Macro Plastic Waste">Sunken Macro-Plastic Aggregation</option>
                <option value="Artificial Reef Nursery">Sunken Vessel (Colonized Artificial Reef)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Water Depth (m)</label>
                <input type="number" step="0.1" id="newTargetDepth" value="44.2" required style="width:100%; background:var(--bg-surface); border:1px solid var(--border-subtle); color:#fff; padding:8px; border-radius:4px; font-size:0.8rem;">
              </div>
              <div>
                <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Estimated Mass (kg)</label>
                <input type="number" id="newTargetMass" value="180" required style="width:100%; background:var(--bg-surface); border:1px solid var(--border-subtle); color:#fff; padding:8px; border-radius:4px; font-size:0.8rem;">
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <label style="font-size:0.72rem; color:var(--text-muted); display:block; margin-bottom:4px;">Environmental Hazard Level</label>
              <select id="newTargetHazard" style="width:100%; background:var(--bg-surface); border:1px solid var(--border-subtle); color:#fff; padding:8px; border-radius:4px; font-size:0.82rem;">
                <option value="CRITICAL">🚨 CRITICAL (Severe Entanglement Threat)</option>
                <option value="HIGH">⚠️ HIGH (Toxic Leach / Structural Risk)</option>
                <option value="MODERATE">📦 MODERATE (Standard Recovery Priority)</option>
                <option value="ECOLOGICAL_HABITAT">🪸 ECOLOGICAL HABITAT (Protected Reef - Do Not Haul)</option>
              </select>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button type="button" class="btn-sonar-secondary" style="padding:8px 16px; font-size:0.82rem;" onclick="document.getElementById('sonarxAddTargetModal').style.display='none'">
                Cancel
              </button>
              <button type="submit" class="btn-sonar-primary" style="padding:8px 18px; font-size:0.82rem;">
                💾 Save Hotspot Pin
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  submitNewTarget() {
    const lat = parseFloat(document.getElementById('newTargetLat').value);
    const lng = parseFloat(document.getElementById('newTargetLng').value);
    const cat = document.getElementById('newTargetCategory').value;
    const depth = parseFloat(document.getElementById('newTargetDepth').value);
    const mass = parseFloat(document.getElementById('newTargetMass').value);
    const hazard = document.getElementById('newTargetHazard').value;

    const newTarget = {
      id: `DET-USR-${Date.now().toString().slice(-4)}`,
      label: `${cat} (${mass} kg)`,
      category: cat,
      lat: lat,
      lng: lng,
      depth_m: depth,
      estimated_mass_kg: mass,
      hazard_level: hazard,
      confidence: 0.95,
      status: hazard === 'ECOLOGICAL_HABITAT' ? 'PROTECTED REEF' : 'Flagged for Recovery'
    };

    // Close modal
    document.getElementById('sonarxAddTargetModal').style.display = 'none';

    // Submit via REST API
    fetch('/api/detections/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mission_id: this.currentMissionId,
        target_type: newTarget.label,
        category: newTarget.category,
        lat: newTarget.lat,
        lng: newTarget.lng,
        depth_m: newTarget.depth_m,
        hazard_level: newTarget.hazard_level,
        confidence: newTarget.confidence,
        estimated_mass_kg: newTarget.estimated_mass_kg,
        detection: newTarget
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Detection successfully saved to SQLite:', data);
    })
    .catch(err => {
      console.warn('Backend API save failed (offline mode), adding to client session:', err);
    });

    // Render immediately on map
    this.markers.push(this.createSingleMarker(newTarget));
    if (this.showHeatmap) {
      this.renderDensityHeatmap([newTarget]);
    }

    if (window.app) {
      window.app.showToast(`✅ New Debris Target Saved: ${newTarget.id} (${newTarget.category})`, 'success');
      if (window.app.audioFX) window.app.audioFX.playDetectionChime();
      // Increment Plastics metric
      const plasticEl = document.getElementById('metricPlasticsKg');
      if (plasticEl) {
        const cur = parseInt(plasticEl.textContent) || 820;
        plasticEl.textContent = `${cur + mass} kg`;
      }
    }
  }

  createSingleMarker(det) {
    let pinColor = det.hazard_level === 'CRITICAL' ? '#ff3366' : (det.hazard_level === 'ECOLOGICAL_HABITAT' ? '#00ff88' : '#ffb703');
    const icon = L.divIcon({
      className: 'sonar-marker-icon',
      html: `
        <div style="position:relative; width:28px; height:28px;">
          <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:${pinColor}; opacity:0.4; animation:hazardPulse 1.2s infinite;"></div>
          <div style="position:absolute; top:4px; left:4px; width:20px; height:20px; background:#070b14; border:2px solid ${pinColor}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px ${pinColor}; font-size:11px;">
            ${det.hazard_level === 'CRITICAL' ? '🚨' : (det.hazard_level === 'ECOLOGICAL_HABITAT' ? '🪸' : '📍')}
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([det.lat, det.lng], { icon: icon }).addTo(this.map);
    marker.bindPopup(`
      <div style="font-family:'Inter', sans-serif; padding:4px; color:#fff;">
        <div style="color:#00f0ff; font-weight:bold; font-size:11px;">${det.id} &bull; ${det.hazard_level}</div>
        <div style="font-size:12px; font-weight:bold; margin:3px 0;">${det.label}</div>
        <div style="font-size:11px; color:#a0aec0;">Depth: ${det.depth_m}m | Mass: ${det.estimated_mass_kg}kg</div>
      </div>
    `);
    return marker;
  }

  setupHUDCrosshair() {
    if (!this.map) return;

    const updateHUD = (latlng) => {
      const latEl = document.getElementById('mapHudLat');
      const lngEl = document.getElementById('mapHudLng');
      const depthEl = document.getElementById('mapHudDepth');
      const substrateEl = document.getElementById('mapHudSubstrate');
      const backscatterEl = document.getElementById('mapHudBackscatter');

      if (latEl) latEl.textContent = `${latlng.lat.toFixed(5)}°N`;
      if (lngEl) lngEl.textContent = `${latlng.lng.toFixed(5)}°E`;

      // Bathymetric depth simulation based on latitude gradient
      const simDepth = 40.0 + (Math.sin(latlng.lat * 50) + Math.cos(latlng.lng * 50)) * 6.5;
      if (depthEl) depthEl.textContent = `${simDepth.toFixed(1)} m`;

      // Seabed substrate and backscatter calculation
      if (substrateEl) {
        if (simDepth > 44) substrateEl.textContent = 'Pelagic Mud & Fine Silt';
        else if (simDepth > 41) substrateEl.textContent = 'Calcareous Quartz Sand';
        else if (simDepth > 38) substrateEl.textContent = 'Biogenic Coral Rubble';
        else substrateEl.textContent = 'Basalt Ridge / Hard Ground';
      }

      if (backscatterEl) {
        const db = -18.0 - (simDepth - 35) * 0.45;
        backscatterEl.textContent = `${db.toFixed(1)} dB`;
      }
    };

    this.map.on('mousemove', (e) => updateHUD(e.latlng));
    this.map.on('click', (e) => updateHUD(e.latlng));
  }

  // Fallback Vector Tactical Canvas Engine (used when tiles are offline)
  initVectorTacticalMap() {
    this.container.innerHTML = `
      <canvas id="vectorMapCanvas" width="900" height="580" style="width:100%; height:100%; background:#070b14; border-radius:8px;"></canvas>
    `;
    const canvas = document.getElementById('vectorMapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bathymetry depth contours
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.2)';
    ctx.lineWidth = 1.5;
    for (let r = 80; r < 580; r += 65) {
      ctx.beginPath();
      ctx.ellipse(450, 290, r, r * 0.65, 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // AUV Survey Line
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(150, 480);
    ctx.lineTo(450, 290);
    ctx.lineTo(750, 100);
    ctx.stroke();
    ctx.setLineDash([]);

    // Swath Envelope
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(110, 450);
    ctx.lineTo(410, 260);
    ctx.lineTo(710, 70);
    ctx.lineTo(790, 130);
    ctx.lineTo(490, 320);
    ctx.lineTo(190, 510);
    ctx.closePath();
    ctx.fill();

    this.renderVectorMarkers();
  }

  renderVectorMarkers(detections = null) {
    const canvas = document.getElementById('vectorMapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const samplePoints = [
      { id: "DET-101", x: 420, y: 260, label: "Ghost Net", color: "#ff3366", haz: "CRITICAL" },
      { id: "DET-102", x: 280, y: 390, label: "Tyres", color: "#ffb703", haz: "MODERATE" },
      { id: "DET-103", x: 530, y: 210, label: "Metal Drum", color: "#fb8500", haz: "HIGH" },
      { id: "DET-104", x: 330, y: 340, label: "Pipeline Anomaly", color: "#00f0ff", haz: "CRITICAL" },
      { id: "DET-105", x: 640, y: 150, label: "Wreck (Artificial Reef)", color: "#00ff88", haz: "HABITAT" }
    ];

    samplePoints.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#070b14';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${p.id}: ${p.label}`, p.x + 12, p.y + 3);
    });
  }
}

window.DebrisMapModule = DebrisMapModule;
