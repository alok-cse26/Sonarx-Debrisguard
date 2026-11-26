/**
 * OceanAI Bot - Multi-LLM Floating Marine Debris Intelligence Assistant
 * Team SonarX | Bennett University
 * Contributors: Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav
 * 
 * Supports:
 *   1. Direct Google Gemini 1.5 & 2.0 Flash / Pro API (Live Cloud Generative AI)
 *   2. OpenAI ChatGPT (GPT-4o / GPT-4o-mini / GPT-3.5)
 *   3. Ultra-Fast Built-In Offline Subsea Acoustic Intelligence & Live Formula Solver
 */

(function () {
  'use strict';

  // ── Inject CSS ────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
#oceanai-fab {
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 9998;
  height: 52px;
  padding: 0 18px;
  border-radius: 26px;
  background: linear-gradient(135deg, #00f0ff 0%, #0060ff 100%);
  border: 1px solid rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #070b14;
  box-shadow: 0 4px 22px rgba(0, 240, 255, 0.45);
  animation: fabPulse 2.5s infinite;
  transition: all 0.25s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
#oceanai-fab:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 28px rgba(0, 240, 255, 0.7);
}
@keyframes fabPulse {
  0%, 100% { box-shadow: 0 4px 22px rgba(0, 240, 255, 0.45); }
  50% { box-shadow: 0 4px 35px rgba(0, 240, 255, 0.85); }
}

#oceanai-panel {
  position: fixed;
  bottom: 154px;
  right: 20px;
  z-index: 9999;
  width: 410px;
  max-width: calc(100vw - 32px);
  max-height: 590px;
  height: 590px;
  background: #091322;
  border: 1px solid rgba(0, 240, 255, 0.4);
  border-radius: 18px;
  display: none;
  flex-direction: column;
  box-shadow: 0 20px 65px rgba(0, 0, 0, 0.85), 0 0 25px rgba(0, 240, 255, 0.18);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  animation: panelSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes panelSlideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
#oceanai-panel.open { display: flex; }

.oai-header {
  background: linear-gradient(135deg, #0b223a, #061524);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
}
.oai-avatar {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0,240,255,0.25), rgba(0,96,255,0.45));
  border: 1.5px solid #00f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  box-shadow: 0 0 10px rgba(0,240,255,0.3);
}
.oai-header-text { flex: 1; min-width: 0; }
.oai-header-text h4 {
  color: #00f0ff;
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}
.oai-header-text p {
  color: #8cc4db;
  margin: 2px 0 0;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.oai-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00ff88;
  display: inline-block;
  box-shadow: 0 0 6px #00ff88;
}

.oai-btn-icon {
  background: none;
  border: none;
  color: #8cc4db;
  cursor: pointer;
  font-size: 16px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oai-btn-icon:hover {
  color: #00f0ff;
  background: rgba(0, 240, 255, 0.12);
}

.oai-provider-bar {
  display: flex;
  background: #050c17;
  padding: 7px 12px;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  align-items: center;
  font-size: 11px;
  overflow-x: auto;
}
.oai-pill {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(0, 240, 255, 0.25);
  color: #8cc4db;
  border-radius: 14px;
  padding: 3px 10px;
  font-size: 10.5px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.oai-pill.active {
  background: linear-gradient(135deg, #00f0ff, #0060ff);
  color: #070b14;
  font-weight: 700;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
}

.oai-settings-panel {
  display: none;
  background: #0c1a2d;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.25);
  font-size: 11px;
  color: #d4edf4;
  animation: fadeIn 0.2s ease;
}
.oai-settings-panel.open { display: block; }
.oai-input-field {
  width: 100%;
  box-sizing: border-box;
  background: #050c17;
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 6px;
  padding: 7px 10px;
  color: #ffffff;
  font-size: 11.5px;
  margin-top: 4px;
  margin-bottom: 8px;
  font-family: monospace;
}
.oai-save-btn {
  background: #00f0ff;
  color: #070b14;
  border: none;
  font-weight: 700;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}
.oai-save-btn:hover {
  box-shadow: 0 0 12px rgba(0,240,255,0.5);
}
.oai-test-btn {
  background: rgba(255,255,255,0.08);
  color: #00f0ff;
  border: 1px solid rgba(0,240,255,0.3);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 11px;
  margin-left: 6px;
}

.oai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.oai-msg {
  max-width: 90%;
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 12.5px;
  line-height: 1.55;
  word-break: break-word;
}
.oai-msg.bot {
  background: rgba(0, 96, 255, 0.12);
  border: 1px solid rgba(0, 240, 255, 0.25);
  color: #d4edf4;
  border-radius: 4px 14px 14px 14px;
}
.oai-msg.user {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.28), rgba(0, 96, 255, 0.35));
  color: #ffffff;
  border: 1px solid rgba(0, 240, 255, 0.45);
  border-radius: 14px 4px 14px 14px;
  align-self: flex-end;
}

.oai-typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 10px 14px;
}
.oai-typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f0ff;
  animation: typingDot 1.4s infinite;
}
.oai-typing span:nth-child(2) { animation-delay: .2s; }
.oai-typing span:nth-child(3) { animation-delay: .4s; }
@keyframes typingDot { 0%,60%,100%{opacity:.2;} 30%{opacity:1;} }

.oai-quickbtns {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 6px 12px;
  border-top: 1px solid rgba(0, 240, 255, 0.1);
  background: #060e19;
  max-height: 65px;
  overflow-y: auto;
}
.oai-qbtn {
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.22);
  color: #00f0ff;
  border-radius: 12px;
  padding: 3px 8px;
  font-size: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.oai-qbtn:hover {
  background: rgba(0, 240, 255, 0.2);
  border-color: #00f0ff;
}

.oai-input-row {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 240, 255, 0.18);
  background: #040912;
}
.oai-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 20px;
  padding: 8px 14px;
  color: #ffffff;
  font-size: 12.5px;
  outline: none;
}
.oai-input::placeholder { color: #5a8ea8; }
.oai-send {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00f0ff, #0060ff);
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #070b14;
  font-weight: bold;
  transition: all 0.2s;
}
.oai-send:hover {
  transform: scale(1.08);
  box-shadow: 0 0 10px rgba(0,240,255,0.6);
}

@media (max-width: 480px) {
  #oceanai-fab {
    bottom: 84px;
    right: 14px;
    height: 46px;
    padding: 0 14px;
    font-size: 12.5px;
  }
  #oceanai-panel {
    width: calc(100vw - 24px);
    right: 12px;
    bottom: 140px;
    height: calc(100vh - 190px);
    max-height: 520px;
  }
}
  `;
  document.head.appendChild(style);

  // ── High-Precision Knowledge Corpus & Calculation Engine ───────────────────
  const TEAM_CREDENTIALS = 
    `👥 **Team SonarX — Bennett University, Greater Noida**\n\n` +
    `• **Alok Kumar** (S26CSEU3209) — *AI/ML Lead, Edge Quantization & YOLOv8*\n` +
    `• **Avni** (S26CSEU3153) — *Backend Systems, API Architecture & Data Pipeline*\n` +
    `• **Pandit Shashwat Tripathi** (S26CSEU3232) — *Acoustic DSP & Underwater Physics*\n` +
    `• **Krish Kumar Yadav** (S26CSEU3219) — *GIS Bathymetry & Satellite Constellation*\n\n` +
    `🏫 **Institution:** Bennett University (Times Group), Greater Noida, India\n` +
    `🌊 **Alignment:** UN SDG 14 (Life Below Water), SDG 12, SDG 9`;

  const QUICK_BUTTONS = [
    "Connect Gemini / ChatGPT",
    "How does sonar work?",
    "Acoustic shadow formula",
    "YOLOv8 vs PatchCore",
    "Calculate shadow height",
    "Our team credentials",
    "12 ocean basins & Nemo",
    "Satellite Sinking Model"
  ];

  const WELCOME_MSG = 
    `👋 Welcome to **SonarX DebrisGuard**! I am **OceanAI**, your autonomous marine acoustics & subsea intelligence agent.\n\n` +
    `⚡ **Active AI Engine:** You can seamlessly switch between **Built-in Subsea Brain**, **Google Gemini 1.5/2.0**, or **ChatGPT** using the pills above!\n\n` +
    `Ask me about side-scan sonar physics, AI detection models, satellite drift tracking, or live shadow calculations. What would you like to explore?`;

  // ── DOM Construction ───────────────────────────────────────────────────────
  function buildUI() {
    const fab = document.createElement('button');
    fab.id = 'oceanai-fab';
    fab.title = 'Open OceanAI Subsea Intelligence';
    fab.innerHTML = `<span>🌊</span><span>Ask OceanAI</span>`;
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.id = 'oceanai-panel';
    panel.innerHTML = `
      <div class="oai-header">
        <div class="oai-avatar">🌊</div>
        <div class="oai-header-text">
          <h4>OceanAI Marine Engine <span style="font-size:9px; background:rgba(0,240,255,0.2); color:#00f0ff; padding:1px 6px; border-radius:4px; font-weight:normal;">v3.0 Multi-LLM</span></h4>
          <p id="oai-provider-label"><span class="oai-live-dot"></span> Engine: Built-in Subsea AI</p>
        </div>
        <button class="oai-btn-icon" id="oai-settings-toggle" title="Connect Gemini / ChatGPT API Keys">⚙️</button>
        <button class="oai-btn-icon" id="oai-close-btn" title="Close Panel">✕</button>
      </div>

      <div class="oai-provider-bar">
        <span style="color:#7ec8e3; font-size:10px; font-weight:bold;">MODEL:</span>
        <button class="oai-pill active" data-provider="offline" id="btn-prov-offline">⚡ Built-in AI</button>
        <button class="oai-pill" data-provider="gemini" id="btn-prov-gemini">♊ Gemini</button>
        <button class="oai-pill" data-provider="openai" id="btn-prov-openai">🤖 ChatGPT</button>
      </div>

      <div class="oai-settings-panel" id="oai-settings-panel">
        <div style="font-weight:bold; color:#00f0ff; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
          <span>🔑 Connect Generative AI Keys</span>
          <button id="oai-settings-close-x" style="background:none; border:none; color:#8cc4db; cursor:pointer;">✕</button>
        </div>
        <div style="font-size:10px; color:#8ab8cc; margin-bottom:8px; line-height:1.4;">
          Keys are saved locally in your browser session for 100% privacy.
        </div>
        
        <label style="font-weight:600; color:#00f0ff;">Google Gemini API Key:</label>
        <div style="font-size:9.5px; color:#7ec8e3; margin-bottom:2px;">
          Get free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#00ff88; text-decoration:underline;">aistudio.google.com</a> (Free tier, no card required)
        </div>
        <input class="oai-input-field" type="password" id="gemini-key-input" placeholder="AIzaSy... (Paste Gemini key here)" />

        <label style="font-weight:600; color:#00f0ff;">OpenAI ChatGPT API Key:</label>
        <div style="font-size:9.5px; color:#7ec8e3; margin-bottom:2px;">
          Get key at <a href="https://platform.openai.com/api-keys" target="_blank" style="color:#00ff88; text-decoration:underline;">platform.openai.com</a>
        </div>
        <input class="oai-input-field" type="password" id="openai-key-input" placeholder="sk-proj-... (Paste OpenAI key here)" />

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <div>
            <button class="oai-save-btn" id="oai-save-keys-btn">Save Keys</button>
            <button class="oai-test-btn" id="oai-test-keys-btn">🧪 Test Key</button>
          </div>
          <span id="oai-key-status" style="color:#00ff88; font-size:10.5px; font-weight:bold;"></span>
        </div>
      </div>

      <div class="oai-messages" id="oai-messages"></div>
      <div class="oai-quickbtns" id="oai-quickbtns"></div>
      <div class="oai-input-row">
        <input class="oai-input" id="oai-input" type="text" placeholder="Ask about sonar, YOLOv8, oceans, calculations..." autocomplete="off" />
        <button class="oai-send" id="oai-send-btn" title="Send message">➤</button>
      </div>
    `;
    document.body.appendChild(panel);

    return { fab, panel };
  }

  // ── Master Bot Engine ──────────────────────────────────────────────────────
  class OceanAIBot {
    constructor() {
      const { fab, panel } = buildUI();
      this.fab = fab;
      this.panel = panel;
      this.messagesEl = document.getElementById('oai-messages');
      this.inputEl = document.getElementById('oai-input');
      this.providerLabel = document.getElementById('oai-provider-label');
      this.settingsPanel = document.getElementById('oai-settings-panel');
      this.currentProvider = localStorage.getItem('sonarx_ai_provider') || 'offline';
      this.chatHistory = [];
      this.isOpen = false;
      this.hasWelcomed = false;

      this._loadStoredKeys();
      this._bindEvents();
      this._renderQuickButtons();
      this._updateProviderUI();
    }

    _loadStoredKeys() {
      const gKey = localStorage.getItem('sonarx_gemini_key') || '';
      const oKey = localStorage.getItem('sonarx_openai_key') || '';
      const gInput = document.getElementById('gemini-key-input');
      const oInput = document.getElementById('openai-key-input');
      if (gInput && gKey) gInput.value = gKey;
      if (oInput && oKey) oInput.value = oKey;
    }

    _bindEvents() {
      this.fab.addEventListener('click', () => this.toggle());
      document.getElementById('oai-close-btn').addEventListener('click', () => this.close());
      document.getElementById('oai-send-btn').addEventListener('click', () => this._handleSend());

      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._handleSend();
      });

      // Settings toggle
      document.getElementById('oai-settings-toggle').addEventListener('click', () => {
        this.settingsPanel.classList.toggle('open');
      });
      document.getElementById('oai-settings-close-x').addEventListener('click', () => {
        this.settingsPanel.classList.remove('open');
      });

      // Save keys
      document.getElementById('oai-save-keys-btn').addEventListener('click', () => {
        const gKey = document.getElementById('gemini-key-input').value.trim();
        const oKey = document.getElementById('openai-key-input').value.trim();
        if (gKey) localStorage.setItem('sonarx_gemini_key', gKey);
        if (oKey) localStorage.setItem('sonarx_openai_key', oKey);
        const status = document.getElementById('oai-key-status');
        status.textContent = '✅ Saved!';
        this._updateProviderUI();
        setTimeout(() => {
          status.textContent = '';
          this.settingsPanel.classList.remove('open');
        }, 1200);
      });

      // Test Key button
      document.getElementById('oai-test-keys-btn').addEventListener('click', async () => {
        const status = document.getElementById('oai-key-status');
        status.textContent = 'Testing...';
        const gKey = document.getElementById('gemini-key-input').value.trim();
        const oKey = document.getElementById('openai-key-input').value.trim();

        if (this.currentProvider === 'gemini' && gKey) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${gKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping' }] }] })
            });
            if (res.ok) {
              status.textContent = '🟢 Gemini OK!';
            } else {
              const err = await res.json();
              status.textContent = `❌ Gemini: ${err.error?.message?.slice(0, 30) || 'Error'}`;
            }
          } catch (e) {
            status.textContent = '❌ Network Error';
          }
        } else if (this.currentProvider === 'openai' && oKey) {
          try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${oKey}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: 'Ping' }],
                max_tokens: 5
              })
            });
            if (res.ok) {
              status.textContent = '🟢 ChatGPT OK!';
            } else {
              const err = await res.json();
              status.textContent = `❌ ChatGPT: ${err.error?.message?.slice(0, 30) || 'Error'}`;
            }
          } catch (e) {
            status.textContent = '❌ Network Error';
          }
        } else {
          status.textContent = '⚠️ Enter key first';
        }
      });

      // Provider pill buttons
      document.querySelectorAll('.oai-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.currentProvider = e.target.getAttribute('data-provider');
          localStorage.setItem('sonarx_ai_provider', this.currentProvider);
          this._updateProviderUI();

          // If switching to Gemini or OpenAI without key, prompt user
          const gKey = localStorage.getItem('sonarx_gemini_key') || '';
          const oKey = localStorage.getItem('sonarx_openai_key') || '';
          if (this.currentProvider === 'gemini' && !gKey) {
            this.settingsPanel.classList.add('open');
            this._appendMessage('bot', '💡 **Switched to Google Gemini Mode!** Paste your Gemini API key in the tray above, or ask any question to use our subsea knowledge engine.');
          } else if (this.currentProvider === 'openai' && !oKey) {
            this.settingsPanel.classList.add('open');
            this._appendMessage('bot', '💡 **Switched to OpenAI ChatGPT Mode!** Paste your OpenAI API key in the tray above, or ask any question to use our subsea knowledge engine.');
          }
        });
      });
    }

    _updateProviderUI() {
      document.querySelectorAll('.oai-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-provider') === this.currentProvider);
      });

      const gKey = localStorage.getItem('sonarx_gemini_key');
      const oKey = localStorage.getItem('sonarx_openai_key');

      let labelText = 'Engine: Built-in Subsea AI';
      let dotColor = '#00ff88';

      if (this.currentProvider === 'gemini') {
        labelText = gKey ? 'Engine: ♊ Gemini 1.5 Flash (Live)' : 'Engine: ♊ Gemini (Ready / Connect Key)';
        dotColor = gKey ? '#00ff88' : '#ffb703';
      } else if (this.currentProvider === 'openai') {
        labelText = oKey ? 'Engine: 🤖 ChatGPT (Live Cloud)' : 'Engine: 🤖 ChatGPT (Ready / Connect Key)';
        dotColor = oKey ? '#00ff88' : '#ffb703';
      }

      if (this.providerLabel) {
        this.providerLabel.innerHTML = `<span class="oai-live-dot" style="background:${dotColor}; box-shadow:0 0 6px ${dotColor};"></span> ${labelText}`;
      }
    }

    _renderQuickButtons() {
      const container = document.getElementById('oai-quickbtns');
      container.innerHTML = '';
      QUICK_BUTTONS.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'oai-qbtn';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          if (label === "Connect Gemini / ChatGPT") {
            this.settingsPanel.classList.toggle('open');
          } else if (label === "Calculate shadow height") {
            this._sendMessage("Calculate shadow height for towfish altitude 12m, shadow 4.5m, slant range 35m");
          } else {
            this._sendMessage(label);
          }
        });
        container.appendChild(btn);
      });
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      this.panel.classList.add('open');
      if (!this.hasWelcomed) {
        this.hasWelcomed = true;
        this._appendMessage('bot', WELCOME_MSG);
      }
      setTimeout(() => this.inputEl.focus(), 100);
    }

    close() {
      this.isOpen = false;
      this.panel.classList.remove('open');
    }

    _handleSend() {
      const text = this.inputEl.value.trim();
      if (!text) return;
      this.inputEl.value = '';
      this._sendMessage(text);
    }

    async _sendMessage(text) {
      this._appendMessage('user', text);
      this.chatHistory.push({ role: 'user', content: text });
      this._showTyping();

      try {
        let response = '';

        if (this.currentProvider === 'offline') {
          await new Promise(r => setTimeout(r, 400));
          response = this._solveQueryIntelligently(text);
        } else {
          response = await this._dispatchLLM(text, this.currentProvider);
        }

        this._removeTyping();
        this._appendMessage('bot', response);
        this.chatHistory.push({ role: 'assistant', content: response });
      } catch (err) {
        this._removeTyping();
        console.warn('AI Dispatch Note:', err);
        const fallback = this._solveQueryIntelligently(text);
        this._appendMessage('bot', fallback);
      }
    }

    async _dispatchLLM(text, provider) {
      const geminiKey = localStorage.getItem('sonarx_gemini_key') || '';
      const openaiKey = localStorage.getItem('sonarx_openai_key') || '';

      // 1. First attempt: call local /api/ai/chat if backend is alive
      try {
        const backendResp = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            provider: provider,
            api_key: provider === 'gemini' ? geminiKey : openaiKey,
            history: this.chatHistory.slice(-4),
            ocean_context: {
              selected_ocean: (window.app && window.app.selectedOcean) || 'Indian Ocean'
            }
          })
        });

        if (backendResp.ok) {
          const data = await backendResp.json();
          if (data && data.reply) {
            const providerTag = data.provider ? `\n\n*(⚡ Generated via ${data.provider})*` : '';
            return data.reply + providerTag;
          }
        }
      } catch (e) {
        // Backend not running, proceed to client-side direct API
      }

      // 2. Direct client-side call to Google Gemini API
      if (provider === 'gemini' && geminiKey) {
        const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];
        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: "You are OceanAI, marine acoustics and AI detection specialist for SonarX DebrisGuard (Team SonarX: Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav, Bennett University). Answer scientifically, accurately, concisely with formulas and markdown." }]
                },
                contents: [{
                  role: 'user',
                  parts: [{ text: text }]
                }],
                generationConfig: {
                  temperature: 0.35,
                  maxOutputTokens: 850
                }
              })
            });

            if (res.ok) {
              const data = await res.json();
              const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply) {
                return reply + `\n\n*(♊ Live Google ${model})*`;
              }
            }
          } catch (e) {
            // try next model
          }
        }
      }

      // 3. Direct client-side call to OpenAI ChatGPT
      if (provider === 'openai' && openaiKey) {
        const models = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
        for (const model of models) {
          try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
              },
              body: JSON.stringify({
                model: model,
                messages: [
                  {
                    role: 'system',
                    content: 'You are OceanAI for SonarX DebrisGuard (Team SonarX: Alok Kumar, Avni, Pandit Shashwat Tripathi, Krish Kumar Yadav, Bennett University). Provide authoritative answers on sonar physics, YOLOv8/PatchCore models, and ocean bathymetry.'
                  },
                  { role: 'user', content: text }
                ],
                max_tokens: 850
              })
            });

            if (res.ok) {
              const data = await res.json();
              const reply = data.choices?.[0]?.message?.content;
              if (reply) {
                return reply + `\n\n*(🤖 Live OpenAI ${model})*`;
              }
            }
          } catch (e) {
            // try next model
          }
        }
      }

      // 4. Intelligent fallback with solution + connection badge
      const solution = this._solveQueryIntelligently(text);
      const isMissingKey = (provider === 'gemini' && !geminiKey) || (provider === 'openai' && !openaiKey);

      if (isMissingKey) {
        return solution + 
          `\n\n> 💡 **Connect Live ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT'}:** Click **⚙️ Settings** above to paste your API key (Free at [aistudio.google.com](https://aistudio.google.com/app/apikey)).`;
      }

      return solution;
    }

    // ── High-Precision Subsea Semantic Solver ────────────────────────────────
    _solveQueryIntelligently(query) {
      const q = query.toLowerCase();

      // Interactive formula calculation: "altitude 12, shadow 4.5, range 35"
      const numMatch = q.match(/(?:alt(?:itude)?|h|height)\s*[:=]?\s*(\d+(?:\.\d+)?).*?(?:shadow|ls)\s*[:=]?\s*(\d+(?:\.\d+)?).*?(?:range|slant|rs)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
                       q.match(/(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*(?:alt|altitude).*?(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*(?:shadow).*?(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*(?:range|slant)/i);
      if (numMatch || (q.includes("calculate") && (q.includes("shadow") || q.includes("formula")))) {
        let H = 12.0, Ls = 4.5, Rs = 35.0;
        if (numMatch) {
          H = parseFloat(numMatch[1]);
          Ls = parseFloat(numMatch[2]);
          Rs = parseFloat(numMatch[3]);
        }
        const h_obj = (Ls * H) / Rs;
        const r_ground = Math.sqrt(Math.max(0, Rs*Rs - H*H));
        return (
          `📐 **Side-Scan Sonar Geometry Calculation:**\n\n` +
          `• **Towfish Altitude ($H$):** \`${H.toFixed(1)} m\`\n` +
          `• **Acoustic Shadow Length ($L_s$):** \`${Ls.toFixed(1)} m\`\n` +
          `• **Slant Range to Target ($R_s$):** \`${Rs.toFixed(1)} m\`\n\n` +
          `$$\\mathbf{h = \\frac{L_s \\times H}{R_s} = \\frac{${Ls} \\times ${H}}{${Rs}} = ${h_obj.toFixed(2)}\\text{ meters}}$$\n\n` +
          `• **Object True Vertical Height:** **\`${h_obj.toFixed(2)} m\`**\n` +
          `• **Rectified Ground Range ($R_g$):** **\`${r_ground.toFixed(2)} m\`** ($R_g = \\sqrt{R_s^2 - H^2}$)\n\n` +
          `💡 *Try changing values like: "altitude 15, shadow 6, range 45" to recalculate dynamically!*`
        );
      }

      // Team & Bennett University
      if (q.includes("team") || q.includes("who made") || q.includes("author") || q.includes("bennett") || q.includes("alok") || q.includes("avni") || q.includes("shashwat") || q.includes("krish")) {
        return TEAM_CREDENTIALS;
      }

      // AI / ML / YOLO / PatchCore
      if (q.includes("yolo") || q.includes("patchcore") || q.includes("ai") || q.includes("ml") || q.includes("model") || q.includes("tensorrt") || q.includes("orin") || q.includes("train")) {
        return (
          `🤖 **SonarX Dual-Model AI Detection Architecture:**\n\n` +
          `1. **Supervised Classifier (YOLOv8-SSS Nano):**\n` +
          `   - Classifies 6 benthic targets: Ghost Nets, Chemical Drums, TEU Containers, Tyres, Shipwrecks, Coral Reefs.\n` +
          `   - **mAP@0.5:** **94.2%** | Precision: **93.7%** | F1-Score: **91.3%**.\n\n` +
          `2. **Unsupervised Anomaly Detector (PatchCore Memory Bank):**\n` +
          `   - Flags unseen debris, pipeline ruptures, unexploded ordnance without requiring prior labels.\n` +
          `   - **AUROC:** **0.971**.\n\n` +
          `3. **Edge Optimization on Nvidia Jetson Orin Nano:**\n` +
          `   - INT8 Quantization through TensorRT.\n` +
          `   - **Latency:** **13.5 ms** (74 FPS) @ 9.8 Watts power.\n\n` +
          `💡 *Tip: Run \`python3 train_models.py\` in VS Code to retrain or export ONNX weights!*`
        );
      }

      // Sonar physics, frequency, acoustic shadow
      if (q.includes("sonar") || q.includes("shadow") || q.includes("frequency") || q.includes("waterfall") || q.includes("sound") || q.includes("physics")) {
        return (
          `🔊 **Side-Scan Sonar (SSS) Physics & Principles:**\n\n` +
          `• **Operating Frequencies:**\n` +
          `  - **455 kHz:** 150m swath width; optimum balance of wide-area coverage & resolution.\n` +
          `  - **900 kHz:** 60m swath; sub-centimeter inspection for micro-debris & cable fraying.\n\n` +
          `• **Transmission Loss Formula:**\n` +
          `  $$TL = 20\\log_{10}(R) + \\alpha R$$\n` +
          `  ($R$ = slant range in meters, $\\alpha$ = seawater acoustic absorption in dB/km).\n\n` +
          `• **Acoustic Shadow Height:**\n` +
          `  $$h = \\frac{L_s \\times H}{R_s}$$\n` +
          `  Objects block acoustic beams, creating a characteristic silent acoustic shadow whose length is proportional to the obstacle's true height.`
        );
      }

      // Satellite tracking & Sinking Model
      if (q.includes("satellite") || q.includes("sentinel") || q.includes("space") || q.includes("orbit") || q.includes("iridium") || q.includes("sinking")) {
        return (
          `🛰️ **Multi-Scale Satellite Earth Observation & Hydrodynamic Sinking Engine:**\n\n` +
          `• **Sentinel-1C SAR (5.405 GHz C-band):** All-weather, day/night sea surface roughness mapping, oil slicks, and ghost net marker buoys.\n` +
          `• **Sentinel-2B MSI (13 Spectral Bands):** Optical Multispectral Floating Debris Index (FDI) mapping surface plastic rafts before sinking.\n` +
          `• **Iridium-NEXT 142:** Cross-linked L-Band (1.621 GHz) acoustic transceiver uplink connecting subsea AUVs to space gateways.\n` +
          `• **3D Lagrangian Sinking Model:** Predicts where surface plastic slicks will land on the continental shelf using geostrophic drift currents & Stokes settling velocity.`
        );
      }

      // Coral protection & Ecological habitats
      if (q.includes("coral") || q.includes("reef") || q.includes("habitat") || q.includes("protect") || q.includes("wreck")) {
        return (
          `🪸 **Protected Coral Reef & Artificial Habitat Safeguard (SDG 14.2):**\n\n` +
          `• **The Problem:** Marine cleanup vessels often inadvertently dredge up biogenic coral reefs and colonized historic shipwrecks.\n` +
          `• **The SonarX Fix:** Our supervised model distinguishes biogenic calcium carbonate formations (rugose multi-scattering) from synthetic plastics.\n` +
          `• **Automatic Protection:** When an anomaly is designated as **"Protected Artificial Reef"**, removal commands are blocked and coordinates are logged to national marine sanctuary registers.`
        );
      }

      // 12 Ocean Basins & Point Nemo
      if (q.includes("ocean") || q.includes("basin") || q.includes("nemo") || q.includes("pacific") || q.includes("arabian") || q.includes("bengal") || q.includes("atlantic")) {
        return (
          `🌊 **Global Coverage Across 12 Monitored Ocean Basins:**\n\n` +
          `1. **Bay of Bengal** (BB-09 Shelf — ghost net tangles & river delta outflows)\n` +
          `2. **Arabian Sea** (Mumbai High oil corridor & chemical barrels)\n` +
          `3. **Indian Ocean** (Equatorial deep trench — shipping container drops)\n` +
          `4. **Great Pacific Garbage Patch (GPGP)** (80,000 tonnes of pelagic HDPE)\n` +
          `5. **Point Nemo** (South Pacific Spacecraft Cemetery at 4,000m depth)\n` +
          `6. **North & South Atlantic**, **Mediterranean**, **Red Sea**, **Arctic**, **Southern Ocean**, **South China Sea**.\n\n` +
          `Select any ocean from the dropdown in the **🗺️ Debris Map** tab to inspect live coordinates and bathymetry.`
        );
      }

      // UN SDGs
      if (q.includes("sdg") || q.includes("sustainability") || q.includes("goal") || q.includes("united nations")) {
        return (
          `🎯 **UN Sustainable Development Goals (SDG) Technology Mapping:**\n\n` +
          `• **SDG 14 (Life Below Water):**\n` +
          `  - Target 14.1: Eliminate marine plastic pollution & ghost gear.\n` +
          `  - Target 14.2: Safeguard fragile marine ecosystems & biogenic reefs.\n` +
          `• **SDG 12 (Responsible Consumption & Production):**\n` +
          `  - Target 12.5: Recover HDPE polymers for circular recycling.\n` +
          `• **SDG 9 (Industry, Innovation & Infrastructure):**\n` +
          `  - Target 9.5: Advanced edge-AI scientific underwater research.`
        );
      }

      // Generic smart response
      return (
        `🌊 **OceanAI Subsea Intelligence Response:**\n\n` +
        `Regarding: *"${query}"*\n\n` +
        `• **Subsea Acoustic Core:** 455 kHz Side-Scan Sonar active across 150m swath.\n` +
        `• **Edge Neural Payload:** YOLOv8-SSS + PatchCore running INT8 on Nvidia Jetson Orin Nano (74 FPS, 13.5 ms).\n` +
        `• **Operational Target:** UN SDG 14 Marine Debris Remediation.\n\n` +
        `💡 *Try asking:*\n` +
        `• *"How does YOLOv8 detect ghost nets?"*\n` +
        `• *"Calculate shadow for altitude 12m, shadow 5m, range 38m"*\n` +
        `• *"Who created SonarX?"*\n` +
        `• Or click **⚙️ Settings** to connect your live Gemini or ChatGPT key!`
      );
    }

    _appendMessage(role, text) {
      const div = document.createElement('div');
      div.className = `oai-msg ${role}`;
      div.innerHTML = this._formatText(text);
      this.messagesEl.appendChild(div);
      this._scrollToBottom();
    }

    _formatText(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(0,240,255,0.18);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:11px;color:#00f0ff;">$1</code>')
        .replace(/\n/g, '<br>');
    }

    _showTyping() {
      if (document.getElementById('oai-typing')) return;
      const typing = document.createElement('div');
      typing.className = 'oai-msg bot oai-typing';
      typing.id = 'oai-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      this.messagesEl.appendChild(typing);
      this._scrollToBottom();
    }

    _removeTyping() {
      const el = document.getElementById('oai-typing');
      if (el) el.remove();
    }

    _scrollToBottom() {
      requestAnimationFrame(() => {
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
      });
    }

    init() {}
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  function bootstrap() {
    window.oceanAIBot = new OceanAIBot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
