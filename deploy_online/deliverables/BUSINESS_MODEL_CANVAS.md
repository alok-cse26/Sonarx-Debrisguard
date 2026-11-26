# 📊 SonarX DebrisGuard – Business Model Canvas (BMC)
### **Autonomous Edge-AI Marine Debris Detection & Ecological Preservation Platform**
**Institution:** Bennett University, Greater Noida, India  
**Team SonarX:** Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav  
**Document Classification:** Strategic Business Architecture & Commercialization Plan  
**UN Sustainable Development Goals (SDG):** SDG 14 (Life Below Water), SDG 12 (Responsible Consumption & Production), SDG 9 (Industry, Innovation & Infrastructure), SDG 13 (Climate Action)

---

## 🏛️ Executive Summary

SonarX DebrisGuard is an edge-deployed subsea acoustic intelligence and autonomous debris detection system. By running accelerated INT8 deep learning models (YOLOv8-SSS + PatchCore) on autonomous underwater vehicles (AUVs) paired with multi-satellite Earth observation (Sentinel-1 SAR / Sentinel-2 Optical), SonarX solves the critical blind spot in marine conservation: **94% of ocean plastic and abandoned ghost fishing gear sinks below the photic zone where optical satellites and surface vessels cannot see.**

The business model transitions marine conservation from reactive, expensive, manual diver surveys ($12,000–$25,000 per operational day) into a scalable, automated **Data-as-a-Service (DaaS)** and **Inspection-as-a-Service (IaaS)** subscription ecosystem serving Port Authorities, Offshore Energy Operators, Maritime Salvage Contractors, and Global Environmental Agencies.

---

## 🧩 The 9 Building Blocks of the Business Model Canvas

```
+----------------------------------------------------------------------------------------------------+
|                                      SONARX BUSINESS MODEL CANVAS                                  |
+---------------------+-------------------+-------------------+------------------+-------------------+
| 1. KEY PARTNERS     | 2. KEY ACTIVITIES | 3. VALUE          | 4. CUSTOMER      | 5. CUSTOMER       |
|                     |                   |    PROPOSITIONS   |    RELATIONSHIPS |    SEGMENTS       |
| • AUV Hardware Mfrs | • Edge Model Dev  | • 94.2% mAP Subsea| • Dedicated Tech | • Port & Harbor   |
|   (Kongsberg, Blue) |   & Optimization  |   Debris Detection|   Account Teams  |   Authorities     |
| • Port Authorities  | • Hydrographic GIS| • 13.5ms Inference| • Automated Cloud| • Offshore Energy |
|   (Visakhapatnam)   |   Data Pipeline   |   on Jetson INT8  |   API & Dashboards| • Maritime Salvage|
| • Space Agencies    | • AUV Mission     | • Substrate & Reef| • HITL Operator  | • Marine NGOs     |
|   (ISRO, ESA, NASA) |   Simulation      |   Protection Engine|   Training Acad  | • Naval & Defense |
| • Fishermen Guilds  | • Multi-Satellite | • 85% Cost & Vessel| • Co-Development | • Academic/Govt   |
| • Environmental Min |   Sensor Fusion   |   Emissions Saving|   Research MoUs  |   Institutes      |
+---------------------+-------------------+-------------------+------------------+-------------------+
|                     | 6. KEY RESOURCES                      | 7. CHANNELS                          |
|                     | • YOLOv8-SSS + PatchCore Weights      | • Direct Enterprise B2B Sales        |
|                     | • 8,400+ Acoustic Waterfall Dataset   | • RESTful API & GeoJSON Data Feeds   |
|                     | • Edge TensorRT Quantization Engine   | • Maritime Industry Conferences      |
|                     | • Multi-Ocean Bathymetric Database    | • Government Tenders & SDG Alliances |
+---------------------+-------------------+-------------------+--------------------------------------+
| 8. COST STRUCTURE                                           | 9. REVENUE STREAMS                   |
| • Edge AI R&D, Model Retraining & Benchmarking              | • Tiered Annual Port Subscriptions   |
| • AUV Field Testing, Calibration & Hydrodynamic Trials      | • Pay-Per-Survey Nautical Mile Fees  |
| • Cloud GPU Infrastructure & Satellite SAR Ingestion APIs   | • Salvage Bounty Referral Commission |
| • Staffing (Acoustic DSP, Embedded Edge, Marine Data Sci)   | • Environmental SDG Audit Certifications|
+-------------------------------------------------------------+--------------------------------------+
```

---

### Block 1: Customer Segments
SonarX DebrisGuard targets four primary commercial and public segments with acute operational and regulatory needs:

1. **Port & Commercial Harbor Authorities (Primary Tier 1 B2G/B2B):**
   - *Examples:* Visakhapatnam Port Authority, Chennai Port Trust, Jawaharlal Nehru Port (JNPA), Rotterdam, Singapore.
   - *Needs:* Navigational safety, periodic bathymetric obstacle clearance, prevention of propeller entanglements in shipping fairways, port green certification compliance.

2. **Offshore Energy & Subsea Infrastructure Operators (Tier 1 B2B):**
   - *Examples:* ONGC, Reliance KG-D6 Basin, Ørsted, Equinor (Offshore Wind & Pipelines).
   - *Needs:* Unexploded ordnance (UXO) and pipeline anomaly clearance, mooring line hazard audits, underwater acoustic infrastructure security.

3. **Marine Environmental NGOs & Ocean Cleanup Initiatives (Tier 2):**
   - *Examples:* The Ocean Cleanup, WWF India, World Bank PROBLUE, UNEP Global Clean Seas.
   - *Needs:* Geo-referenced hotspot targeting to deploy recovery vessels efficiently, avoiding wasted fuel searching empty water.

4. **Naval Defense, Coast Guard & Hydrographic Offices (Tier 1 Institutional):**
   - *Examples:* Indian Navy Hydrographic Dept, Indian Coast Guard, National Institute of Oceanography (NIO).
   - *Needs:* Harbor surveillance, mine-like obstacle detection, rapid hydrographic charting after cyclones or tsunami disturbances.

---

### Block 2: Value Propositions
SonarX delivers quantifiable operational, economic, and ecological value:

| Stakeholder Dimension | Traditional Workflow (Status Quo) | SonarX DebrisGuard Solution | Measurable Quantified Impact |
|---|---|---|---|
| **Survey Cost** | $15,000–$25,000 / day (Manned survey vessels + diver teams) | $2,200 / day (Autonomous AUV edge survey with SonarX) | **85% reduction in daily operational expenditure** |
| **Detection Speed & Latency** | Post-mission manual hydrographer playback (3–7 days) | Real-time edge inference (13.5 ms @ 74 FPS on Jetson Orin) | **Instant target geo-tagging & subsea localization** |
| **Swath Coverage** | Optical ROV cameras (3–5m visibility limit in turbid water) | 455 kHz Dual-Frequency Side-Scan Sonar (150m swath) | **30× wider areal coverage per linear nautical mile** |
| **Ecological Safeguard** | Indiscriminate removal often damages artificial coral reefs | Built-in AI distinction between ghost nets vs colonized reefs | **100% preservation of thriving benthic nurseries (SDG 14.2)** |
| **Carbon Footprint** | 800–1,200 Liters marine diesel / mission | 0 Liters (Electric AUV battery) + 438L vessel transit saving | **1,170 kg CO₂ avoided per 10 km² fairway survey** |

---

### Block 3: Channels
- **Direct Enterprise Sales (B2B/B2G):** Dedicated technical sales targeting Maritime State Development Boards and Ministry of Ports, Shipping and Waterways.
- **RESTful API & Web GIS Portal:** Cloud-connected GIS interface enabling port operators to stream detections, export GeoJSON manifests, and inspect targets.
- **Industry Consortia & Conferences:** Demonstrations at Oceanology International, IEEE OES Oceans, World Ocean Summit, and Blue Economy Expos.
- **Academic & Research Partnerships:** Bennett University incubators, National Institute of Ocean Technology (NIOT), and Earth Science consortia.

---

### Block 4: Customer Relationships
- **High-Touch Technical Account Management:** Customized AUV sensor calibration, baseline sonar acoustic signatures, and local salinity profile tuning.
- **Human-in-the-Loop (HITL) Verification Academy:** Interactive operator certification modules empowering port hydrographers to audit edge AI alerts with Grad-CAM heatmaps.
- **Automated Continuous Telemetry:** Cloud health reporting, drift model prediction updates, and over-the-air (OTA) TensorRT model enhancements.

---

### Block 5: Revenue Streams

SonarX deploys a hybrid revenue model combining predictable recurring SaaS/DaaS subscriptions with high-margin mission execution fees:

```
+----------------------------------------------------------------------------------+
|                              REVENUE STREAM MATRIX                               |
+------------------------+---------------------+-----------------+-----------------+
| Revenue Stream         | Pricing Structure   | Target Customer | Projected Year 2|
+------------------------+---------------------+-----------------+-----------------+
| 1. Port Authority DaaS | $45,000 - $120,000  | Major & Minor   | $680,000        |
|    Annual Subscription | / port / year       | Sea Ports       | (8 Ports)       |
| 2. Per-Mile Survey IaaS| $350 - $650 per     | Offshore Wind & | $420,000        |
|    Inspection Fee      | nautical mile       | Pipeline Cables | (850 NM)        |
| 3. Salvage Referral    | 12% - 18% of scrap/ | Marine Salvage  | $160,000        |
|    Bounty Commission   | salvage bounty value| Contractors     | (65 Recoveries) |
| 4. SDG Environmental   | $12,500 per audit   | Coastal Municipal| $125,000       |
|    Verification Audit  | certificate         | & Tourism Boards| (10 Audits)     |
+------------------------+---------------------+-----------------+-----------------+
| TOTAL PROJECTED ANNUAL REVENUE (YEAR 2)                               $1,385,000 |
+----------------------------------------------------------------------------------+
```

---

### Block 6: Key Resources
1. **Intellectual Property & Algorithms:** Custom YOLOv8-SSS acoustic object detection backbone, PatchCore anomaly memory banks, and zero-shot transformer NLP marine ontology parser.
2. **Proprietary Acoustic Dataset:** 8,400+ georeferenced real and high-fidelity synthetic side-scan sonar waterfall frames representing 12 ocean basin substrates.
3. **Hardware-Software Integration Stack:** Nvidia Jetson Orin Nano/NX INT8 TensorRT runtime container, Edge DVL/IMU navigation Kalman filters, and LEO satellite uplink protocols.
4. **Human Capital:** Interdisciplinary engineering talent across acoustic DSP, embedded computer vision, hydrodynamics, and marine environmental law (Team SonarX, Bennett University).

---

### Block 7: Key Activities
- **Embedded Neural Model Engineering:** Continuous INT8 post-training quantization, pruning, and synthetic data augmentation via acoustic diffusion models.
- **Hydrographic Field Validations:** Sea trials, transducer calibration, backscatter normalization, and ground-truth validation with ROV optical inspections.
- **Multi-Sensor Fusion Pipeline:** Processing satellite SAR surface slicks, predicting 3D Lagrangian seafloor interception, and auto-dispatching AUV waypoints.
- **Regulatory & SDG Compliance Auditing:** Maintaining compliance with UN SDG 14.1, 14.2, and International Hydrographic Organization (IHO S-44) survey standards.

---

### Block 8: Key Partners
- **AUV & Subsea Robotics Manufacturers:** Kongsberg Maritime, Blue Robotics, Teledyne Marine, Ocean Alpha.
- **Satellite Data Providers:** European Space Agency (Copernicus Open Access Hub), NASA EarthData, NOAA JPSS, Iridium Communications.
- **Maritime Regulatory Agencies:** Directorate General of Shipping (DG Shipping India), Indian Coast Guard, International Maritime Organization (IMO).
- **Fishermen Collectives & Trawler Associations:** In-situ reporting of lost nets, buy-back incentive coordination, and local shallow-water navigation knowledge.

---

### Block 9: Cost Structure

| Cost Category | Description | % of Total Annual OpEx |
|---|---|---|
| **R&D & Deep Learning Engineering** | Model retraining, edge INT8 pipeline optimization, synthetic sonar generation | 32% |
| **Sea Trials & Field Calibration** | Boat charter, AUV battery cycling, offshore sensor testing in Bay of Bengal | 24% |
| **Cloud GPU & Satellite Data APIs** | High-performance inference clusters, Sentinel SAR satellite ingestion, storage | 16% |
| **Regulatory & Marine Compliance** | IHO certification, maritime liability insurance, patent filing & IP protection | 14% |
| **Sales, Operations & Deployments** | Customer technical onboarding, field engineer support, conference exhibitions | 14% |

**Breakeven Analysis:** At Month 14 of commercial rollout, with 6 active port subscriptions and 450 nautical miles of pipeline clearance, the company achieves operational breakeven with a projected gross margin of **72.4%**.
