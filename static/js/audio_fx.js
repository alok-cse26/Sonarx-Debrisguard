/**
 * SonarX DebrisGuard - Underwater Hydrophone & Sonar Audio Synthesizer
 * Uses HTML5 Web Audio API to generate authentic oceanic sonar chirps,
 * detection radar chimes, and satellite L-band transmission bursts.
 */

class SonarAudioFX {
  constructor() {
    this.audioCtx = null;
    this.isMuted = true; // Default muted for smooth UX, user can toggle
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    const btn = document.getElementById('btnToggleAudio');
    if (btn) {
      btn.innerHTML = this.isMuted ? '<span>🔇</span> Sonar Sound: OFF' : '<span>🔊</span> Sonar Sound: ON';
      btn.classList.toggle('active', !this.isMuted);
    }
    if (!this.isMuted) {
      this.playSonarPing();
    }
    return !this.isMuted;
  }

  playSonarPing() {
    if (this.isMuted) return;
    this.ensureContext();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Dual-frequency acoustic chirp sweep (800 Hz down to 600 Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.35);

    // Reverberation envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  playDetectionChime() {
    if (this.isMuted) return;
    this.ensureContext();

    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    osc.frequency.setValueAtTime(1318.5, now + 0.12); // E6

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  playSatelliteUplinkSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const now = this.audioCtx.currentTime;
    // FSK digital telemetry burst
    for (let i = 0; i < 4; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const freq = 1600 + (i % 2 === 0 ? 300 : -200);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.075);
    }
  }
}

window.SonarAudioFX = SonarAudioFX;
