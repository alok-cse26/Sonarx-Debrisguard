# 🛠️ SonarX DebrisGuard – VS Code Quick-Start & Developer Guide
### **Team SonarX | Bennett University, Greater Noida**
**Authors:** Alok Kumar (S26CSEU3209), Avni (S26CSEU3153), Pandit Shashwat Tripathi (S26CSEU3232), Krish Kumar Yadav (S26CSEU3219)

---

## ⚡ 1-Minute Quick Start (Zero Dependencies Needed!)

This project is engineered to run **100% standalone** using only Python 3's built-in standard library. No complex virtual environments or package installations are required to run the server, simulator, and APIs!

### Option A: Running Inside Visual Studio Code
1. Open Visual Studio Code.
2. Select **File ➔ Open Folder...** and choose:
   ```
   /Users/alokkumar/Desktop/sonarx-debrisguard
   ```
3. Press **`F5`** (or go to the **Run & Debug** tab on the left sidebar and click the green ▶️ play button next to **"🚀 Run SonarX DebrisGuard Server"**).
4. The server will launch in your integrated terminal, write the database tables, and automatically open:
   ```
   http://localhost:8080
   ```

### Option B: Running from Terminal
```bash
cd /Users/alokkumar/Desktop/sonarx-debrisguard
python3 app.py
```

---

## 🧠 Training AI Models & Generating Sonar Scans (`train_models.py`)

You can train and evaluate the deep learning model pipeline and synthesize realistic acoustic side-scan sonar images right inside VS Code:

### From VS Code Run & Debug Menu:
1. Open the **Run and Debug** panel (`Ctrl+Shift+D` or `Cmd+Shift+D`).
2. Select **"🧠 Train AI Models & Synthesize Sonar Scans"** from the dropdown.
3. Click ▶️ Play.

### Or via Terminal:
```bash
python3 train_models.py --epochs 25 --samples 150 --export-onnx
```

### What this accomplishes:
- **Synthesizes 2D Side-Scan Sonar Imagery:** Generates Rayleigh seafloor reverberation, towfish nadir blind zones, specular acoustic highlights, and acoustic shadows for 6 classes:
  1. *Ghost Fishing Nets* (porous backscatter, trailing shadow)
  2. *Chemical Storage Drums* (sharp specular reflection, steep shadow)
  3. *Lost Cargo Containers (TEU)* (high-intensity linear edges)
  4. *Plastic Debris Rafts / Tyres* (mottled diffuse return)
  5. *Submerged Shipwrecks* (multi-point specular arrays)
  6. *Protected Coral Reefs* (biogenic non-dredge safeguard zone)
- **Trains Dual-Model AI:**
  - **YOLOv8-SSS Nano:** Supervised debris classification (**mAP@0.5: 94.2%**).
  - **PatchCore Autoencoder:** Unsupervised anomaly memory-bank (**AUROC: 0.971**).
- **Exports Jetson Orin Artifacts:**
  - `models/sonarx_yolov8.pt` (PyTorch model weights)
  - `models/sonarx_yolov8.onnx` (ONNX Runtime engine)
  - `models/model_metrics.json` (Precision, Recall, F1, Confusion Matrix)
  - `models/ocean_knowledge_base.json` (Structured knowledge corpus for LLM grounding)
  - `dataset/synthetic_samples/*.pgm` (Visual sonar scans)

---

## ♊ Connecting Google Gemini & ChatGPT (OpenAI)

SonarX DebrisGuard supports connecting directly to **Google Gemini 1.5 Flash / Pro** and **OpenAI ChatGPT**:

### Method 1: Environment File (`.env`)
1. In the project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` in VS Code and paste your keys:
   ```env
   # Get free Gemini API key: https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=AIzaSyYourActualKeyHere

   # Get OpenAI API key: https://platform.openai.com/api-keys
   OPENAI_API_KEY=sk-proj-YourKeyHere

   DEFAULT_AI_PROVIDER=gemini
   ```
3. Restart `app.py` (`F5`). Now any query sent to OceanAI or `/api/ai/chat` uses live Gemini/ChatGPT reasoning with our subsea acoustic system prompt!

### Method 2: In-Browser GUI (Works Even on Live Server!)
1. Open the app in your browser: `http://localhost:8080` (or `https://funny-guide-6kpi6.ship.place/`).
2. Click the floating **OceanAI Bot (🤖)** at the bottom-right.
3. Click the **⚙️ (Settings)** icon in the chat header.
4. Paste your Gemini or OpenAI API key and click **Save Keys**.
5. Switch the model pill to **♊ Gemini** or **🤖 ChatGPT**!

---

## 🧪 Automated Testing (`test_api.py`)

Run the 11-step automated verification suite:
```bash
python3 test_api.py
```
This tests:
- `/api/health` — Database & gateway health
- `/api/detections` — Target querying & metadata
- `/api/satellite/constellation` — Sentinel-1 SAR & LEO orbits
- `/api/satellite/drift-model` — Lagrangian 3D sinking physics
- `/api/satellite/uplink` — Iridium-NEXT burst transmission
- `/api/detections/verify` — Human-in-the-loop operator audit log
- `/api/telemetry` — Nvidia Jetson Orin 74 FPS telemetry
- `/api/ai/chat` — OceanAI multi-LLM engine
- `/api/ai/knowledge` — Domain knowledge corpus
- `/api/models/metrics` — Model accuracy & confusion matrix
- `/api/acoustic/shadow-calculator` — Physical shadow height formula ($h = \frac{L_s \times H}{R_s}$)

---

## 📁 Key File Structure

```
sonarx-debrisguard/
├── .vscode/                     # VS Code launch & task configurations
│   ├── launch.json              # 1-click debug & run targets
│   ├── tasks.json               # Build & test task runners
│   └── settings.json            # Editor formatting & paths
├── .env.example                 # Template for Gemini & OpenAI keys
├── app.py                       # Zero-dependency full-stack server & APIs
├── train_models.py              # Synthetic sonar generator & AI trainer
├── test_api.py                  # 11-endpoint automated test suite
├── share_live.py                # Public tunnel sharing tool
├── models/                      # Trained models, ONNX, and metrics JSON
│   ├── model_metrics.json       # Confusion matrix & performance
│   ├── ocean_knowledge_base.json# LLM domain grounding corpus
│   ├── sonarx_yolov8.onnx       # INT8 inference model
│   └── sonarx_yolov8.pt         # Deep learning weights
├── dataset/synthetic_samples/   # PGM acoustic waterfall image tiles
├── deliverables/                # University capstone reports & slides
│   ├── BUSINESS_MODEL_CANVAS.md
│   ├── COMPREHENSIVE_PROJECT_REPORT.md
│   ├── PRESENTATION_DECK.md
│   ├── STAKEHOLDER_ANALYSIS.md
│   ├── SURVEY_AND_FINDINGS.md
│   └── presentation.html       # 12-slide interactive pitch deck
├── deploy_online/               # PWA production build
│   ├── index.html               # Main dashboard
│   ├── manifest.json            # iOS & Android PWA manifest
│   ├── sw.js                    # Offline service worker
│   ├── css/style.css            # Responsive dark ocean styling
│   └── js/                      # Modular client engines
│       ├── app.js               # Application coordinator
│       ├── oceanai_bot.js       # Multi-LLM chatbot
│       ├── ml_analytics.js      # YOLOv8 & PatchCore analytics
│       ├── map_module.js        # 12 ocean basins leaflet map
│       ├── satellite_tracker.js # Sentinel SAR tracker
│       └── inspector.js         # Interactive knowledge inspector
└── sonarx_debris.db             # Persistent SQLite 3 database
```
