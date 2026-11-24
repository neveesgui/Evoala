/**
 * Native Web Audio API synthesizer for Duolingo-inspired tactile feedback.
 * Zero external audio assets needed — works offline, on Vercel, and in Capacitor.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.14,
    startDelay: number = 0,
    endFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + startDelay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** Crisp bubble pop on button tap */
  public playTap() {
    this.playTone(520, 0.065, 'sine', 0.1, 0, 680);
  }

  /** Soft chip selection sound (e.g. CNV word bank) */
  public playSelect() {
    this.playTone(620, 0.08, 'triangle', 0.11, 0, 760);
  }

  /** Cheerful ascending Duolingo-style chime for correct answer */
  public playCorrect() {
    this.playTone(523.25, 0.14, 'triangle', 0.16, 0);      // C5
    this.playTone(659.25, 0.14, 'triangle', 0.16, 0.08);   // E5
    this.playTone(783.99, 0.24, 'triangle', 0.18, 0.16);   // G5
    this.playTone(1046.5, 0.28, 'sine', 0.12, 0.22);       // C6 sparkle
  }

  /** Gentle descending boing for wrong answer */
  public playWrong() {
    this.playTone(260, 0.16, 'sawtooth', 0.08, 0, 200);
    this.playTone(195, 0.24, 'triangle', 0.13, 0.11, 145);
  }

  /** Heart/Energy lost drop sound */
  public playHeartLost() {
    this.playTone(440, 0.15, 'sine', 0.1, 0, 260);
    this.playTone(260, 0.22, 'sine', 0.1, 0.12, 160);
  }

  /** Celebratory fanfare when finishing a lesson or Gatekeeper scenario */
  public playVictory() {
    const notes = [
      { f: 523.25, d: 0.13, t: 0 },     // C5
      { f: 659.25, d: 0.13, t: 0.1 },   // E5
      { f: 783.99, d: 0.13, t: 0.2 },   // G5
      { f: 1046.5, d: 0.38, t: 0.32 },  // C6
      { f: 783.99, d: 0.12, t: 0.5 },   // G5
      { f: 1046.5, d: 0.45, t: 0.62 },  // C6!
    ];
    notes.forEach((n) => this.playTone(n.f, n.d, 'triangle', 0.16, n.t));
  }

  /** Sparkling arpeggio when ranking up an Elo */
  public playLevelUp() {
    [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
      this.playTone(freq, 0.22, 'sine', 0.13, idx * 0.075);
    });
  }
}

export const soundFX = new SoundEngine();
