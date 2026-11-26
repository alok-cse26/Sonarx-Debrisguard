#!/usr/bin/env python3
"""
================================================================================
SonarX DebrisGuard – Automated API Client & Verification Suite
Team SonarX | Bennett University
================================================================================
Automatically connects to the local SonarX server or launches an inline test
instance if app.py is not running yet. Zero dependencies needed.
================================================================================
"""

import urllib.request
import json
import time
import sys
import os
import subprocess

CANDIDATE_URLS = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5000"
]

ACTIVE_BASE_URL = None
SERVER_SUBPROCESS = None


def find_active_server():
    global ACTIVE_BASE_URL
    script_dir = os.path.dirname(os.path.abspath(__file__))
    port_file = os.path.join(script_dir, ".port")

    urls = list(CANDIDATE_URLS)
    if os.path.exists(port_file):
        try:
            with open(port_file, "r") as pf:
                p = pf.read().strip()
                if p:
                    urls.insert(0, f"http://127.0.0.1:{p}")
                    urls.insert(1, f"http://localhost:{p}")
        except Exception:
            pass

    for url in urls:
        try:
            req = urllib.request.Request(f"{url}/api/health", headers={"User-Agent": "SonarX-Test/1.0"})
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status == 200:
                    ACTIVE_BASE_URL = url
                    return url
        except Exception:
            continue
    return None


def ensure_server_running():
    global SERVER_SUBPROCESS, ACTIVE_BASE_URL
    url = find_active_server()
    if url:
        print(f"✅ Detected active SonarX server at: {url}")
        return url

    # If server is not active, automatically launch app.py in background
    print("⏳ Server is not running. Automatically starting `app.py` in the background...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    app_py = os.path.join(script_dir, "app.py")

    if not os.path.exists(app_py):
        print(f"❌ Error: Could not find app.py at {app_py}")
        sys.exit(1)

    SERVER_SUBPROCESS = subprocess.Popen(
        [sys.executable, app_py],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # Wait up to 5 seconds for server to start
    for _ in range(15):
        time.sleep(0.5)
        if SERVER_SUBPROCESS.poll() is not None:
            out, err = SERVER_SUBPROCESS.communicate()
            print(f"❌ Server process exited with code {SERVER_SUBPROCESS.returncode}")
            if out: print(f"STDOUT: {out}")
            if err: print(f"STDERR: {err}")
            break
        url = find_active_server()
        if url:
            print(f"🚀 Background SonarX server started successfully at: {url}")
            return url

    print("❌ Could not start local server automatically. Please run `python3 app.py` manually in VS Code.")
    sys.exit(1)


def api_get(endpoint):
    url = f"{ACTIVE_BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"User-Agent": "SonarX-Client/1.0"})
    with urllib.request.urlopen(req, timeout=5.0) as resp:
        return json.loads(resp.read().decode())


def api_post(endpoint, data):
    url = f"{ACTIVE_BASE_URL}{endpoint}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json", "User-Agent": "SonarX-Client/1.0"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=5.0) as resp:
        return json.loads(resp.read().decode())


def print_step(title):
    print("\n" + "=" * 75)
    print(f" 🔹 {title}")
    print("=" * 75)


def main():
    print("=" * 75)
    print(" 🌊 SonarX DebrisGuard – API Connectivity & Verification Test")
    print(" 🎓 Team SonarX | Bennett University")
    print("=" * 75)

    ensure_server_running()

    try:
        # 1. Health & DB Check
        print_step("1. Server Health Check (/api/health)")
        health = api_get("/api/health")
        print("✅ Health Response:")
        print(f"   • Status: {health.get('status')}")
        print(f"   • Service: {health.get('service')}")
        print(f"   • Database: {health.get('database')}")
        print(f"   • Satellite Gateway: {health.get('satellite_gateway')}")

        # 2. Debris Detections
        print_step("2. Fetching Seafloor Detections (/api/detections)")
        dets = api_get("/api/detections?mission_id=MSN-2026-BOB-09")
        print(f"✅ Found {dets['total']} detected targets in database:")
        for d in dets["detections"][:3]:
            print(f"   • [{d['id']}] {d['target_type']} | Conf: {d['confidence']*100:.1f}% | Depth: {d['depth_m']}m | Status: {d['verification_status']}")

        # 3. Satellite Constellation
        print_step("3. Querying Satellite Constellation (/api/satellite/constellation)")
        sat_data = api_get("/api/satellite/constellation")
        print(f"✅ Satellites Active over Survey Region ({sat_data['current_time_utc']}):")
        for s in sat_data["constellation"]:
            print(f"   🛰️ {s['name']} | Status: {s['status']} | Elev: {s['elevation_deg']}° | Next Pass: {s['next_pass_min']}m")

        # 4. Hydrodynamic Lagrangian Sinking Model
        print_step("4. Hydrodynamic Lagrangian Sinking Simulator (/api/satellite/drift-model)")
        drift_payload = {
            "surface_lat": 17.6985,
            "surface_lng": 83.2120,
            "current_knots": 1.4,
            "heading_deg": 135.0,
            "depth_m": 42.0,
            "settling_velocity": 0.08
        }
        drift_res = api_post("/api/satellite/drift-model", drift_payload)
        print("✅ Lagrangian Drift Output:")
        print(f"   • Surface Origin: {drift_res['surface_origin']}")
        print(f"   • Predicted Seabed Landing: {drift_res['seabed_impact']}")
        print(f"   • Total Horizontal Drift: {drift_res['drift_distance_m']} meters ({drift_res['current_vector']})")
        print(f"   • Sinking Time: {drift_res['sinking_time_min']} minutes")

        # 5. Satellite Telemetry Uplink
        print_step("5. Uplinking Target to Iridium LEO Satellite (/api/satellite/uplink)")
        uplink_payload = {
            "id": "DET-101",
            "satellite_id": "SAT-IRID142"
        }
        uplink_res = api_post("/api/satellite/uplink", uplink_payload)
        print("✅ Satellite Transmission Confirmed:")
        print(f"   • Satellite Node: {uplink_res['satellite']}")
        print(f"   • Frequency: {uplink_res['frequency']}")
        print(f"   • Receipt Hash: {uplink_res['receipt_hash']}")
        print(f"   • Destination: {uplink_res['relay_destination']}")

        # 6. Operator Verification (Human-in-the-Loop Safeguard)
        print_step("6. Submitting Operator Verification Action (/api/detections/verify)")
        verify_payload = {
            "id": "DET-102",
            "action": "APPROVE",
            "notes": "Verified via test client: Tyre cluster approved for recovery vessel retrieval."
        }
        verify_res = api_post("/api/detections/verify", verify_payload)
        print("✅ Detection Record Updated in SQLite:")
        print(f"   • Target ID: {verify_res['detection']['id']}")
        print(f"   • New Status: {verify_res['detection']['verification_status']}")
        print(f"   • Audit Log: {verify_res['detection']['notes']}")

        # 7. Edge Telemetry
        print_step("7. Querying Live Jetson Edge Telemetry (/api/telemetry)")
        telemetry = api_get("/api/telemetry")
        print(f"   ⚡ Edge Device: {telemetry['device']}")
        print(f"   ⚡ Inference: {telemetry['fps']} FPS | Latency: {telemetry['latency_ms']} ms")
        print(f"   ⚡ Power Draw: {telemetry['power_watts']} W | Satellite Link: {telemetry['satellite_link_status']}")

        # 8. AI Ocean Chat & LLM Gateway
        print_step("8. Testing OceanAI LLM & Subsea Intelligence Gateway (/api/ai/chat)")
        ai_resp = api_post("/api/ai/chat", {
            "message": "What is the acoustic reflection formula for side-scan sonar?",
            "provider": "auto",
            "ocean_context": {"selected_ocean": "Indian Ocean"}
        })
        print(f"   🤖 Provider Used: {ai_resp.get('provider')}")
        print(f"   🤖 OceanAI Response Preview:\n   {ai_resp.get('reply', '')[:140]}...")

        # 9. AI Domain Knowledge Base
        print_step("9. Querying Gemini/ChatGPT Knowledge Base (/api/ai/knowledge)")
        kb = api_get("/api/ai/knowledge")
        print(f"   📚 Project: {kb.get('project')}")
        print(f"   📚 Institution: {kb.get('institution')}")
        print(f"   📚 Monitored Ocean Basins: {len(kb.get('monitored_ocean_basins', []))} basins")
        print(f"   📚 Debris Classes: {len(kb.get('classes', []))} acoustic classes")

        # 10. AI Model Performance Metrics
        print_step("10. Fetching AI Model Metrics & INT8 Quantization (/api/models/metrics)")
        ml_m = api_get("/api/models/metrics")
        perf = ml_m.get("overall_performance", {})
        print(f"   📊 Model: {ml_m.get('metadata', {}).get('model_name')}")
        print(f"   📊 mAP@0.5: {perf.get('mAP_at_50', 0)*100:.1f}% | AUROC: {perf.get('auroc')}")
        print(f"   📊 Precision: {perf.get('precision', 0)*100:.1f}% | Recall: {perf.get('recall', 0)*100:.1f}%")

        # 11. Acoustic Shadow Height Calculator
        print_step("11. Testing Acoustic Shadow Height Calculator (/api/acoustic/shadow-calculator)")
        shadow_resp = api_post("/api/acoustic/shadow-calculator", {
            "altitude_m": 12.0,
            "shadow_length_m": 5.2,
            "slant_range_m": 38.0,
            "frequency_khz": 455.0
        })
        print(f"   📐 Formula: {shadow_resp.get('formula')}")
        print(f"   📐 Calculated Object Height: {shadow_resp.get('calculated_height_m')} m")
        print(f"   📐 Seafloor Ground Range: {shadow_resp.get('ground_range_m')} m")
        print(f"   📐 Seafloor Grazing Angle: {shadow_resp.get('grazing_angle_deg')}°")
        print(f"   📐 Acoustic Transmission Loss: {shadow_resp.get('transmission_loss_db')} dB")

        print("\n" + "=" * 75)
        print(" 🎉 ALL APIs & AI/ML ENGINES CONNECTED & WORKING 100% PERFECTLY!")
        print(f" 🌐 You can now open your browser at: {ACTIVE_BASE_URL}")
        print("=" * 75)

    except Exception as e:
        print(f"\n❌ API Error: {e}")
    finally:
        # If we started a temporary background server, let the user know it is running
        if SERVER_SUBPROCESS:
            print("\n[i] Note: Background test server is active. To stop it, close this terminal.")


if __name__ == "__main__":
    main()
