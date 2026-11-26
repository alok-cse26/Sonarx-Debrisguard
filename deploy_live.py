#!/usr/bin/env python3
"""
SonarX DebrisGuard – Instant 24/7 Cloud Deployment Script
Team SonarX | Bennett University
Deploys the entire web app to a global CDN accessible worldwide on any device.
"""

import os
import sys
import zipfile
import urllib.request
import json
import ssl

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEPLOY_DIR = os.path.join(SCRIPT_DIR, "deploy_online")
ZIP_PATH = os.path.join(SCRIPT_DIR, "sonarx-deploy-24x7.zip")


def make_zip():
    print("[1/3] Packaging production build...")
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(DEPLOY_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, DEPLOY_DIR)
                z.write(full_path, rel_path)
    print(f"      Build package ready ({os.path.getsize(ZIP_PATH):,} bytes)")


def deploy_cloud():
    print("[2/3] Uploading to Cloudflare Global 24/7 CDN...")
    with open(ZIP_PATH, "rb") as f:
        data = f.read()

    req = urllib.request.Request(
        "https://ship.page/deploy",
        data=data,
        headers={
            "Content-Type": "application/zip",
            "User-Agent": "SonarX-Deployer/3.0"
        },
        method="POST"
    )

    try:
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, timeout=45, context=ctx) as resp:
            res_json = json.loads(resp.read().decode("utf-8"))
            url = res_json.get("url")
            claim = res_json.get("claim_url")
            print("[3/3] Deployment SUCCESSFUL!")
            print("=" * 70)
            print(" 🌊 SONARX DEBRISGUARD IS LIVE 24/7 WORLDWIDE!")
            print("=" * 70)
            print(f" 👉 PUBLIC SHAREABLE LINK: {url}")
            print(f" 👉 PERMANENT CLAIM LINK:  {claim}")
            print("=" * 70)
            print(" Anyone on iOS, Android, macOS, or Windows can visit this link anytime 24/7!")
            return url
    except Exception as e:
        print(f"[!] Deployment error: {e}")
        return None


if __name__ == "__main__":
    make_zip()
    deploy_cloud()
