// Web Audio API based ambient synthesizer for soothing background music & gentle chimes

export type SoundscapeType =
  | 'morning-light'
  | 'sanctuary-prayer'
  | 'still-waters'
  | 'celestial-bells'
  | 'gentle-rain'
  | 'harp-of-david'
  | 'whispering-pines'
  | 'evening-vespers';

export interface SoundscapeOption {
  id: SoundscapeType;
  title: string;
  description: string;
  icon: string;
}

export const SOUNDSCAPES: SoundscapeOption[] = [
  {
    id: 'morning-light',
    title: 'Morning Light',
    description: 'Warm golden dawn chords with radiant harmonic shimmer',
    icon: '☀️'
  },
  {
    id: 'sanctuary-prayer',
    title: 'Sanctuary Prayer',
    description: 'Deep resonant cathedral organ drone & sacred choral warmth',
    icon: '🕊️'
  },
  {
    id: 'still-waters',
    title: 'Still Waters',
    description: 'Peaceful pentatonic stream notes that calm a restless mind',
    icon: '🌿'
  },
  {
    id: 'celestial-bells',
    title: 'Celestial Bells',
    description: 'Delicate sanctuary chime bells dancing in gentle intervals',
    icon: '✨'
  },
  {
    id: 'gentle-rain',
    title: 'Gentle Sanctuary Rain',
    description: 'Soft raindrops falling on chapel glass with warm harmonic pads',
    icon: '🌧️'
  },
  {
    id: 'harp-of-david',
    title: 'Harp of David',
    description: 'Serene biblical harp arpeggios flowing in tranquil harmony',
    icon: '🎵'
  },
  {
    id: 'whispering-pines',
    title: 'Whispering Mountain Pines',
    description: 'Peaceful mountain breeze and gentle high-altitude stillness',
    icon: '🌲'
  },
  {
    id: 'evening-vespers',
    title: 'Evening Vespers',
    description: 'Contemplative dusk harmonies and resting stillness before God',
    icon: '🕯️'
  }
];

class AudioController {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private currentVolume: number = 0.55;
  private timerIds: number[] = [];
  private activeNodes: (AudioNode | OscillatorNode)[] = [];
  private activeSoundscape: SoundscapeType = 'morning-light';

  private async initContext(): Promise<AudioContext | null> {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      volume: this.currentVolume,
      soundscape: this.activeSoundscape
    };
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(this.currentVolume * 0.85, this.ctx.currentTime, 0.05);
      } catch {
        // Ignore
      }
    }
  }

  public async setSoundscape(type: SoundscapeType) {
    this.activeSoundscape = type;
    if (this.isPlaying) {
      this.stop();
      await this.start(type);
    }
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.start(this.activeSoundscape);
      return this.isPlaying;
    }
  }

  public async start(type: SoundscapeType = this.activeSoundscape) {
    try {
      const ctx = await this.initContext();
      if (!ctx) return;

      this.activeSoundscape = type;
      this.stop(); // Clear any previous

      const now = ctx.currentTime;
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume * 0.85, now + 1.2);
      this.masterGain.connect(ctx.destination);

      this.isPlaying = true;

      // Start specific soundscape engine
      switch (type) {
        case 'morning-light':
          this.playMorningLight(ctx);
          break;
        case 'sanctuary-prayer':
          this.playSanctuary(ctx);
          break;
        case 'still-waters':
          this.playStillWaters(ctx);
          break;
        case 'celestial-bells':
          this.playCelestialBells(ctx);
          break;
        case 'gentle-rain':
          this.playGentleRain(ctx);
          break;
        case 'harp-of-david':
          this.playHarpOfDavid(ctx);
          break;
        case 'whispering-pines':
          this.playWhisperingPines(ctx);
          break;
        case 'evening-vespers':
          this.playEveningVespers(ctx);
          break;
        default:
          this.playMorningLight(ctx);
      }
    } catch {
      this.isPlaying = false;
    }
  }

  // Soundscape 1: Morning Light (Warm F major 9 chords)
  private playMorningLight(ctx: AudioContext) {
    if (!this.masterGain) return;
    const chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
      [130.81, 196.00, 246.94, 261.63, 329.63], // Cmaj7
      [146.83, 220.00, 261.63, 349.23, 440.00], // Dm9
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bbmaj7
    ];

    let chordIdx = 0;
    const playChordCycle = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 180, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const duration = 6.5;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18 / (i + 1), now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
        this.activeNodes.push(osc, gain, filter);
      });

      const tid = window.setTimeout(playChordCycle, 5400);
      this.timerIds.push(tid);
    };

    playChordCycle();
  }

  // Soundscape 2: Sanctuary Prayer (Rich pipe organ drone)
  private playSanctuary(ctx: AudioContext) {
    if (!this.masterGain) return;
    const baseFreqs = [110, 164.81, 220, 277.18, 329.63, 440];

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(45, this.ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.activeNodes.push(osc, gain, filter, lfo, lfoGain);
    });
  }

  // Soundscape 3: Still Waters (Pentatonic river ripples)
  private playStillWaters(ctx: AudioContext) {
    if (!this.masterGain) return;
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    // Background water stream pink-noise filter
    this.createSoftNoise(ctx, 400, 0.04);

    const playWaterChime = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.2);
      this.activeNodes.push(osc, gain);

      const nextDelay = 700 + Math.random() * 1200;
      const tid = window.setTimeout(playWaterChime, nextDelay);
      this.timerIds.push(tid);
    };

    playWaterChime();
  }

  // Soundscape 4: Celestial Bells (Crystal cathedral bells)
  private playCelestialBells(ctx: AudioContext) {
    if (!this.masterGain) return;
    const bellNotes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

    const playBell = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = bellNotes[Math.floor(Math.random() * bellNotes.length)];

      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(note * 2.005, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 4.8);
      osc2.stop(now + 4.8);
      this.activeNodes.push(osc, osc2, gain);

      const nextDelay = 1200 + Math.random() * 1800;
      const tid = window.setTimeout(playBell, nextDelay);
      this.timerIds.push(tid);
    };

    playBell();
  }

  // Soundscape 5: Gentle Sanctuary Rain (Raindrops & soft pad)
  private playGentleRain(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Soothing rain noise
    this.createSoftNoise(ctx, 800, 0.08);

    // Warm underlying major pad
    const padNotes = [174.61, 220.00, 261.63, 329.63];
    padNotes.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.frequency.setValueAtTime(500, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, filter, gain);
    });
  }

  // Soundscape 6: Harp of David (Gentle melodic arpeggios)
  private playHarpOfDavid(ctx: AudioContext) {
    if (!this.masterGain) return;
    // D major harp scale
    const harpNotes = [146.83, 220.00, 293.66, 369.99, 440.00, 554.37, 587.33, 739.99];
    let noteIdx = 0;

    const playHarpNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = harpNotes[noteIdx % harpNotes.length];
      noteIdx += (Math.random() > 0.3 ? 1 : 2);

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.8);
      this.activeNodes.push(osc, filter, gain);

      const nextDelay = 650 + Math.random() * 800;
      const tid = window.setTimeout(playHarpNote, nextDelay);
      this.timerIds.push(tid);
    };

    playHarpNote();
  }

  // Soundscape 7: Whispering Pines (Wind and tranquil low drone)
  private playWhisperingPines(ctx: AudioContext) {
    if (!this.masterGain) return;
    this.createSoftNoise(ctx, 350, 0.07, true);

    const mountainDrones = [130.81, 196.00, 261.63];
    mountainDrones.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, gain);
    });
  }

  // Soundscape 8: Evening Vespers (Dusk choir chord shifts)
  private playEveningVespers(ctx: AudioContext) {
    if (!this.masterGain) return;
    const chords = [
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 196.00, 220.00, 293.66], // Gsus2
      [130.81, 164.81, 196.00, 261.63], // C
      [146.83, 174.61, 220.00, 261.63]  // Dm7
    ];

    let chordIdx = 0;
    const playVesperCycle = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        filter.frequency.setValueAtTime(500, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const duration = 7.0;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 2.0);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
        this.activeNodes.push(osc, gain, filter);
      });

      const tid = window.setTimeout(playVesperCycle, 6000);
      this.timerIds.push(tid);
    };

    playVesperCycle();
  }

  // Helper to create gentle atmospheric filtered noise (wind / rain / water)
  private createSoftNoise(ctx: AudioContext, cutoffFreq: number, targetGain: number, sweep: boolean = false) {
    if (!this.masterGain) return;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoffFreq, ctx.currentTime);

    if (sweep) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      lfoGain.gain.setValueAtTime(150, ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();
      this.activeNodes.push(lfo, lfoGain);
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(targetGain, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, gain);
  }

  // Play gentle bell chime on action
  public async playGentleChime() {
    try {
      const ctx = await this.initContext();
      if (!ctx) return;
      const notes = [698.46, 880.00, 1046.50];
      const chimeGain = ctx.createGain();
      chimeGain.gain.setValueAtTime(0.22, ctx.currentTime);
      chimeGain.connect(ctx.destination);

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.12;
        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

        osc.connect(noteGain);
        noteGain.connect(chimeGain);
        osc.start(startTime);
        osc.stop(startTime + 2.6);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public stop() {
    this.timerIds.forEach(id => window.clearTimeout(id));
    this.timerIds = [];

    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(0.0001, now, 0.15);
      } catch {
        // Ignore
      }
    }

    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }
}

export const ambientAudio = new AudioController();
