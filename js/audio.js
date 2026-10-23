/**
 * Crown of the Wilds - Procedural Web Audio Engine
 * Provides synthesized 8-bit/16-bit chiptune melodies and sound effects.
 * 100% self-contained without external audio files!
 */

const SoundEngine = (function() {
  let ctx = null;
  let bgmGain = null;
  let sfxGain = null;
  let currentBgmLoop = null;
  let currentTrackName = null;
  let isMuted = false;

  function initContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      bgmGain = ctx.createGain();
      bgmGain.gain.setValueAtTime(0.18, ctx.currentTime);
      bgmGain.connect(ctx.destination);

      sfxGain = ctx.createGain();
      sfxGain.gain.setValueAtTime(0.25, ctx.currentTime);
      sfxGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // --- SOUND EFFECTS (SFX) ---
  function playSFX(type) {
    if (isMuted) return;
    initContext();
    const t = ctx.currentTime;

    if (type === 'select' || type === 'cursor') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(780, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'text') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400 + Math.random() * 80, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.04);
    } else if (type === 'bump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'hit') {
      // Noise burst for attack hit
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(200, t + 0.12);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGain);
      noise.start(t);
    } else if (type === 'cleanse') {
      // Heavenly chime arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.09);
        gain.gain.setValueAtTime(0.3, t + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.6);
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start(t + idx * 0.09);
        osc.stop(t + idx * 0.09 + 0.6);
      });
    } else if (type === 'shatter') {
      // Glass crash
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
      noise.connect(gain);
      gain.connect(sfxGain);
      noise.start(t);
    } else if (type === 'slide') {
      // Slick ice slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.15);
    } else if (type === 'level_up') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);
        gain.gain.setValueAtTime(0.2, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + 0.2);
      });
    }
  }

  // --- BACKGROUND MUSIC (BGM) SYNTHESIZER ---

  // Note frequency helper: C4 is 261.63, A4 is 440
  const NOTES = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    C6: 1046.50, REST: 0
  };

  const TRACKS = {
    castle: {
      tempo: 110,
      lead: [
        'E5', 'G5', 'A5', 'REST', 'B5', 'A5', 'G5', 'E5',
        'D5', 'E5', 'G5', 'REST', 'E5', 'D5', 'C5', 'REST'
      ],
      bass: [
        'C4', 'REST', 'G3', 'REST', 'A3', 'REST', 'E3', 'REST',
        'F3', 'REST', 'C4', 'REST', 'G3', 'REST', 'C4', 'REST'
      ],
      leadType: 'triangle',
      bassType: 'sine'
    },
    sewer: {
      tempo: 90,
      lead: [
        'C4', 'D4', 'REST', 'E4', 'D4', 'REST', 'C4', 'REST',
        'B3', 'C4', 'REST', 'A3', 'G3', 'REST', 'A3', 'REST'
      ],
      bass: [
        'A2', 'REST', 'E3', 'REST', 'F2', 'REST', 'C3', 'REST',
        'G2', 'REST', 'D3', 'REST', 'E2', 'REST', 'A2', 'REST'
      ],
      leadType: 'sine',
      bassType: 'triangle'
    },
    pastoral: {
      tempo: 125,
      lead: [
        'G4', 'C5', 'D5', 'E5', 'G5', 'E5', 'D5', 'C5',
        'A4', 'C5', 'D5', 'C5', 'G4', 'REST', 'G4', 'REST'
      ],
      bass: [
        'C3', 'G3', 'C4', 'G3', 'A2', 'E3', 'A3', 'E3',
        'F2', 'C3', 'F3', 'C3', 'G2', 'D3', 'G3', 'D3'
      ],
      leadType: 'square',
      bassType: 'triangle'
    },
    port: {
      tempo: 135,
      lead: [
        'D5', 'F5', 'G5', 'A5', 'G5', 'F5', 'D5', 'F5',
        'C5', 'E5', 'G5', 'A5', 'F5', 'D5', 'D5', 'REST'
      ],
      bass: [
        'D3', 'A3', 'D4', 'A3', 'F3', 'C4', 'F4', 'C4',
        'C3', 'G3', 'C4', 'G3', 'D3', 'A3', 'D4', 'REST'
      ],
      leadType: 'sawtooth',
      bassType: 'square'
    },
    snow: {
      tempo: 95,
      lead: [
        'E5', 'B5', 'C6', 'B5', 'G5', 'E5', 'G5', 'REST',
        'D5', 'A5', 'B5', 'A5', 'F5', 'D5', 'E5', 'REST'
      ],
      bass: [
        'E3', 'REST', 'B3', 'REST', 'C4', 'REST', 'G3', 'REST',
        'D3', 'REST', 'A3', 'REST', 'B3', 'REST', 'E3', 'REST'
      ],
      leadType: 'sine',
      bassType: 'sine'
    },
    battle: {
      tempo: 150,
      lead: [
        'A4', 'A4', 'C5', 'D5', 'E5', 'D5', 'C5', 'A4',
        'G4', 'G4', 'B4', 'C5', 'D5', 'C5', 'B4', 'G4'
      ],
      bass: [
        'A2', 'A2', 'E3', 'A2', 'A2', 'E3', 'A2', 'A2',
        'G2', 'G2', 'D3', 'G2', 'G2', 'D3', 'G2', 'G2'
      ],
      leadType: 'square',
      bassType: 'sawtooth'
    },
    boss: {
      tempo: 155,
      lead: [
        'D4', 'F4', 'G4', 'G#4', 'A4', 'G#4', 'G4', 'F4',
        'D4', 'C4', 'D4', 'F4', 'E4', 'D4', 'C#4', 'REST'
      ],
      bass: [
        'D2', 'D2', 'D3', 'D2', 'A#2', 'A#2', 'F3', 'A#2',
        'G2', 'G2', 'D3', 'G2', 'A2', 'A2', 'E3', 'A2'
      ],
      leadType: 'sawtooth',
      bassType: 'sawtooth'
    },
    epilogue: {
      tempo: 115,
      lead: [
        'C5', 'E5', 'G5', 'C6', 'B5', 'A5', 'G5', 'REST',
        'F5', 'A5', 'C6', 'A5', 'G5', 'E5', 'D5', 'C5'
      ],
      bass: [
        'C3', 'G3', 'C4', 'G3', 'A2', 'E3', 'A3', 'E3',
        'F2', 'C3', 'F3', 'C3', 'G2', 'D3', 'G3', 'C3'
      ],
      leadType: 'triangle',
      bassType: 'sine'
    }
  };

  function playBGM(trackName) {
    if (trackName === currentTrackName && currentBgmLoop) return;
    initContext();
    stopBGM();

    const track = TRACKS[trackName] || TRACKS.castle;
    currentTrackName = trackName;
    const stepDuration = 60 / track.tempo / 2; // 8th notes

    let step = 0;
    const totalSteps = track.lead.length;

    function scheduleLoop() {
      if (!ctx || isMuted) return;
      const now = ctx.currentTime;
      const leadNote = track.lead[step];
      const bassNote = track.bass[step];

      if (leadNote && NOTES[leadNote]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = track.leadType || 'square';
        osc.frequency.setValueAtTime(NOTES[leadNote], now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + stepDuration * 0.9);
        osc.connect(gain);
        gain.connect(bgmGain);
        osc.start(now);
        osc.stop(now + stepDuration * 0.95);
      }

      if (bassNote && NOTES[bassNote]) {
        const bOsc = ctx.createOscillator();
        const bGain = ctx.createGain();
        bOsc.type = track.bassType || 'triangle';
        bOsc.frequency.setValueAtTime(NOTES[bassNote], now);
        bGain.gain.setValueAtTime(0.12, now);
        bGain.gain.exponentialRampToValueAtTime(0.005, now + stepDuration * 0.9);
        bOsc.connect(bGain);
        bGain.connect(bgmGain);
        bOsc.start(now);
        bOsc.stop(now + stepDuration * 0.95);
      }

      step = (step + 1) % totalSteps;
    }

    currentBgmLoop = setInterval(scheduleLoop, stepDuration * 1000);
  }

  function stopBGM() {
    if (currentBgmLoop) {
      clearInterval(currentBgmLoop);
      currentBgmLoop = null;
    }
    currentTrackName = null;
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
      if (bgmGain) bgmGain.gain.setValueAtTime(0, ctx.currentTime);
      if (sfxGain) sfxGain.gain.setValueAtTime(0, ctx.currentTime);
    } else {
      if (bgmGain) bgmGain.gain.setValueAtTime(0.18, ctx.currentTime);
      if (sfxGain) sfxGain.gain.setValueAtTime(0.25, ctx.currentTime);
      if (currentTrackName) {
        const t = currentTrackName;
        currentTrackName = null;
        playBGM(t);
      }
    }
    return isMuted;
  }

  return {
    init: initContext,
    playSFX,
    playBGM,
    stopBGM,
    toggleMute,
    isMuted: () => isMuted
  };
})();

if (typeof window !== 'undefined') {
  window.SoundEngine = SoundEngine;
}
