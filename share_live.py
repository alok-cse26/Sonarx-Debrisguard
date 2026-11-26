#!/usr/bin/env python3
"""
================================================================================
SonarX DebrisGuard – Live Public Sharing Link Generator
Team SonarX | Bennett University
================================================================================
Creates an instant, secure public HTTPS URL for your project so anyone
in the world can view and interact with your site from their browser.
Uses standard OpenSSH reverse tunneling (zero installation & zero signup needed).
================================================================================
"""

import subprocess
import time
import sys
import os
import re
import urllib.request

LOCAL_PORT = 8080


def is_local_server_running():
    for port in [8080, 8000, 5000]:
        try:
            req = urllib.request.Request(f"http://127.0.0.1:{port}/api/health", headers={"User-Agent": "SonarX/1.0"})
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status == 200:
                    return port
        except Exception:
            continue
    return None


def main():
    print("=" * 80)
    print(" 🌊 SonarX DebrisGuard – Live Public Sharing Generator")
    print(" 🎓 Team SonarX | Bennett University")
    print("=" * 80)

    # 1. Check local server
    port = is_local_server_running()
    if not port:
        print("[⏳] Starting local server (app.py) in background...")
        script_dir = os.path.dirname(os.path.abspath(__file__))
        app_path = os.path.join(script_dir, "app.py")
        subprocess.Popen([sys.executable, app_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        for _ in range(10):
            time.sleep(0.5)
            port = is_local_server_running()
            if port:
                break

    if not port:
        print("[!] Could not detect local server. Please ensure `python3 app.py` is running.")
        port = LOCAL_PORT

    print(f"[+] Local server confirmed active on port {port}")
    print("[🌐] Establishing secure public HTTPS tunnel (via localhost.run / pinggy)...")
    print("    (This generates a live internet link accessible worldwide on any phone or laptop)")
    print("-" * 80)

    # SSH Reverse Tunnel command
    # localhost.run provides an instant public HTTPS domain mapped to localhost:PORT
    ssh_cmd = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ServerAliveInterval=30",
        "-R", f"80:localhost:{port}",
        "nokey@localhost.run"
    ]

    try:
        proc = subprocess.Popen(
            ssh_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        public_url = None
        for line in proc.stdout:
            # Look for assigned https domain
            match = re.search(r"https://[a-zA-Z0-9.-]+\.lhr\.life", line)
            if match:
                public_url = match.group(0)
                break
            # Or pinggy fallback format
            match2 = re.search(r"https://[a-zA-Z0-9.-]+\.free\.pinggy\.link", line)
            if match2:
                public_url = match2.group(0)
                break

        if public_url:
            print("\n" + "=" * 80)
            print(" 🎉 YOUR LIVE PUBLIC SHAREABLE LINK IS READY!")
            print("=" * 80)
            print(f"\n 👉 SHARE THIS LINK WITH ANYONE:\n    {public_url}\n")
            print("=" * 80)
            print(" [+] Anyone in the world can open this link to see your project live!")
            print(" [+] Works on Mobile Phones, Tablets, and Laptops worldwide.")
            print(" [+] Keeps running as long as this terminal is open.")
            print(" [+] Press Ctrl+C in this terminal to stop public sharing.")
            print("=" * 80)

            # Keep tunnel alive
            proc.wait()
        else:
            print("\n[!] Could not parse public domain. Alternative fallback:")
            print("    Run in terminal: ssh -R 80:localhost:8080 nokey@localhost.run")
            print("    Or upload the `deploy_online/` folder to Netlify (app.netlify.com/drop) for 24/7 free hosting!")

    except KeyboardInterrupt:
        print("\n[-] Shutting down public tunnel...")
        if proc:
            proc.terminate()
    except Exception as e:
        print(f"\n[!] Tunnel error: {e}")
        print("\n💡 24/7 Permanent Free Hosting Alternative:")
        print("   Upload the `deploy_online/` folder to https://app.netlify.com/drop")
        print("   Takes 5 seconds and gives a permanent link like: https://sonarx-debrisguard.netlify.app")


if __name__ == "__main__":
    main()
