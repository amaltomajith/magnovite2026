// ============================================================
// AURORA BOREALIS — Canvas Engine v8
// Column-based vertical ray renderer.
// Each curtain = hundreds of thin vertical strips with
// independent height + brightness driven by multi-octave noise.
// This is how real northern lights actually look:
// ragged upper edge, bright dense base, fading upward rays,
// dark gaps between bright ray fingers.
// Royal navy / indigo palette. Faint teal accent only.
// ============================================================

export function initGalaxySky() {
  const heroSection = document.querySelector('.events-hero-section') as HTMLElement;
  if (!heroSection) return;
  if (heroSection.querySelector('.galaxy-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:block;';
  heroSection.insertBefore(canvas, heroSection.firstChild);

  const ctx = canvas.getContext('2d')!;
  if (!ctx) return;

  let W = (canvas.width  = heroSection.clientWidth);
  let H = (canvas.height = heroSection.clientHeight);
  let animId = 0;

  const STAR_COLS = ['#ffffff', '#eef2ff', '#dde8ff', '#ccd8ff', '#f0faff'];

  interface Star {
    x: number; y: number; r: number;
    col: string; base: number; sp: number; ph: number;
  }

  // ── AURORA CURTAIN ───────────────────────────────────────────
  // Rendered column-by-column. NOT as a horizontal polygon.
  // baseY  = where the bright lower edge of curtain hangs (frac H)
  // Each column independently computes ray height + intensity from noise.
  interface Curtain {
    baseY:    number;  // fractional Y of bright base edge at rest
    baseWave: number;  // amplitude of vertical base oscillation (frac H)
    baseFreq: number;  // spatial frequency of base wave
    baseSpd:  number;  // animation speed of base wave
    basePh:   number;  // initial phase

    maxRayH:  number;  // max upward ray height (fraction of H)

    // Multi-octave intensity noise → per-column brightness [0..1]
    // Low freq harmonics = wide bright blobs, high freq = tight ray fingers
    iFreqs: number[]; iAmps: number[]; iSpds: number[]; iPhs: number[]; iDirs: number[];
    // Multi-octave ray-height noise → per-column vertical extent
    rFreqs: number[]; rAmps: number[]; rSpds: number[]; rPhs: number[]; rDirs: number[];

    cr: number; cg: number; cb: number;
    alpha: number;       // peak alpha for brightest columns
    pulseSpd: number; pulsePh: number;
    // Slow horizontal drift of the whole curtain pattern
    driftSpd: number; driftPh: number; driftW: number; // driftW in px
  }

  let stars: Star[] = [];
  let curtains: Curtain[] = [];

  // Sum-of-sinusoids pseudo-noise
  function pNoise(
    fx: number, t: number,
    freqs: number[], amps: number[], spds: number[], phs: number[], dirs: number[]
  ): number {
    let v = 0;
    for (let i = 0; i < freqs.length; i++) {
      v += Math.sin(fx * Math.PI * 2 * freqs[i] + t * spds[i] * dirs[i] + phs[i]) * amps[i];
    }
    return v;
  }

  function build() {
    stars = [];
    const cnt = Math.min(480, Math.max(140, Math.floor(W * H / 1050)));
    for (let i = 0; i < cnt; i++) {
      const tier = Math.random();
      const r = tier < 0.85 ? 0.14 + Math.random() * 0.28
              : tier < 0.97 ? 0.38 + Math.random() * 0.40
              :               0.78 + Math.random() * 0.52;
      stars.push({
        x: Math.random() * W, y: Math.random() * H, r,
        col: STAR_COLS[Math.floor(Math.random() * STAR_COLS.length)],
        base: 0.08 + Math.random() * 0.62,
        sp:   0.0005 + Math.random() * 0.0022,
        ph:   Math.random() * Math.PI * 2,
      });
    }

    const WW = W || 1000;

    // Six column-rendered aurora curtains.
    // iFreqs: mixing LOW (wide blobs) + HIGH (tight fingers) gives the
    // characteristic clumpy-yet-detailed aurora ray texture.
    curtains = [
      // 1. Wide indigo background base glow
      {
        baseY: 0.60, baseWave: 0.06, baseFreq: 1.4, baseSpd: 0.00010, basePh: 0.0,
        maxRayH: 0.52,
        iFreqs: [1.8, 4.5, 11.0, 26.0], iAmps: [0.30, 0.25, 0.25, 0.20],
        iSpds:  [0.00012, 0.00028, 0.00058, 0.00115],
        iPhs:   [0.0, 2.2, 4.8, 1.5], iDirs: [1, -1, 1, -1],
        rFreqs: [1.5, 3.8, 9.0], rAmps: [0.38, 0.32, 0.30],
        rSpds:  [0.00009, 0.00022, 0.00045],
        rPhs:   [1.8, 0.5, 3.5], rDirs: [1, -1, 1],
        cr: 30, cg: 55, cb: 210, alpha: 0.24,
        pulseSpd: 0.00038, pulsePh: 0.0,
        driftSpd: 0.00005, driftPh: 0.0, driftW: WW * 0.06,
      },
      // 2. Primary deep indigo/violet curtain (main show)
      {
        baseY: 0.52, baseWave: 0.08, baseFreq: 2.0, baseSpd: 0.00016, basePh: 1.5,
        maxRayH: 0.44,
        iFreqs: [2.5, 6.2, 15.0, 36.0], iAmps: [0.28, 0.27, 0.25, 0.20],
        iSpds:  [0.00020, 0.00042, 0.00085, 0.00170],
        iPhs:   [2.8, 0.6, 4.2, 3.0], iDirs: [-1, 1, -1, 1],
        rFreqs: [2.2, 5.5, 13.0], rAmps: [0.36, 0.34, 0.30],
        rSpds:  [0.00014, 0.00032, 0.00065],
        rPhs:   [0.4, 3.2, 5.5], rDirs: [-1, 1, -1],
        cr: 55, cg: 30, cb: 245, alpha: 0.38,
        pulseSpd: 0.00060, pulsePh: 2.0,
        driftSpd: 0.00009, driftPh: 2.5, driftW: WW * 0.05,
      },
      // 3. Royal cobalt filament (thin, bright, fast-moving rays)
      {
        baseY: 0.44, baseWave: 0.10, baseFreq: 2.8, baseSpd: 0.00025, basePh: 3.8,
        maxRayH: 0.32,
        iFreqs: [3.5, 8.5, 20.0, 46.0], iAmps: [0.24, 0.26, 0.26, 0.24],
        iSpds:  [0.00032, 0.00068, 0.00135, 0.00270],
        iPhs:   [5.0, 1.8, 3.0, 0.3], iDirs: [1, 1, -1, 1],
        rFreqs: [3.0, 7.5, 18.0], rAmps: [0.34, 0.34, 0.32],
        rSpds:  [0.00022, 0.00050, 0.00100],
        rPhs:   [2.6, 5.1, 1.0], rDirs: [1, -1, 1],
        cr: 12, cg: 85, cb: 255, alpha: 0.36,
        pulseSpd: 0.00092, pulsePh: 3.8,
        driftSpd: 0.00013, driftPh: 1.2, driftW: WW * 0.07,
      },
      // 4. Very faint teal-green whisper (the ONLY hint of green)
      {
        baseY: 0.40, baseWave: 0.12, baseFreq: 3.5, baseSpd: 0.00032, basePh: 5.5,
        maxRayH: 0.24,
        iFreqs: [4.5, 11.0, 26.0], iAmps: [0.34, 0.34, 0.32],
        iSpds:  [0.00042, 0.00085, 0.00170],
        iPhs:   [1.0, 3.8, 0.6], iDirs: [-1, 1, -1],
        rFreqs: [4.0, 10.0], rAmps: [0.50, 0.50],
        rSpds:  [0.00035, 0.00070],
        rPhs:   [3.8, 1.4], rDirs: [-1, 1],
        cr: 0, cg: 160, cb: 195, alpha: 0.16,
        pulseSpd: 0.00075, pulsePh: 5.8,
        driftSpd: 0.00017, driftPh: 4.5, driftW: WW * 0.04,
      },
      // 5. Violet/purple depth band
      {
        baseY: 0.56, baseWave: 0.07, baseFreq: 1.7, baseSpd: 0.00013, basePh: 2.2,
        maxRayH: 0.40,
        iFreqs: [2.2, 5.5, 13.0, 30.0], iAmps: [0.30, 0.28, 0.24, 0.18],
        iSpds:  [0.00016, 0.00036, 0.00072, 0.00144],
        iPhs:   [3.8, 0.3, 4.5, 2.2], iDirs: [1, -1, 1, -1],
        rFreqs: [1.8, 4.5, 11.0], rAmps: [0.38, 0.32, 0.30],
        rSpds:  [0.00011, 0.00028, 0.00055],
        rPhs:   [2.0, 5.0, 0.8], rDirs: [-1, 1, -1],
        cr: 95, cg: 22, cb: 218, alpha: 0.26,
        pulseSpd: 0.00052, pulsePh: 1.5,
        driftSpd: 0.00007, driftPh: 3.8, driftW: WW * 0.05,
      },
      // 6. Feathery deep-blue upper haze
      {
        baseY: 0.36, baseWave: 0.14, baseFreq: 1.2, baseSpd: 0.00020, basePh: 4.0,
        maxRayH: 0.28,
        iFreqs: [3.0, 7.0, 17.0], iAmps: [0.36, 0.34, 0.30],
        iSpds:  [0.00028, 0.00058, 0.00115],
        iPhs:   [0.8, 2.5, 5.2], iDirs: [1, -1, 1],
        rFreqs: [2.5, 6.5], rAmps: [0.50, 0.50],
        rSpds:  [0.00020, 0.00042],
        rPhs:   [4.5, 1.8], rDirs: [-1, 1],
        cr: 10, cg: 95, cb: 255, alpha: 0.22,
        pulseSpd: 0.00110, pulsePh: 4.5,
        driftSpd: 0.00018, driftPh: 0.5, driftW: WW * 0.08,
      },
    ];
  }

  build();

  const onResize = () => {
    W = canvas.width  = heroSection.clientWidth;
    H = canvas.height = heroSection.clientHeight;
    build();
  };
  window.addEventListener('resize', onResize);

  // ── DRAW AURORA CURTAIN: column-by-column vertical rays ──────
  // The fundamental insight: real aurora is NOT horizontal bands —
  // it is vertical curtains of light where each "column" of air
  // glows with a different brightness and height. We simulate this
  // by computing per-column intensity + ray-height from noise and
  // drawing a thin vertical rectangle with a vertical gradient.
  function drawCurtain(c: Curtain, now: number) {
    const COL   = 4;  // column width in px
    const nCols = Math.ceil(W / COL) + 2;

    const pulse  = 1.0 + Math.sin(now * c.pulseSpd + c.pulsePh) * 0.28;
    const drift  = Math.sin(now * c.driftSpd + c.driftPh) * c.driftW;

    for (let i = 0; i <= nCols; i++) {
      const x  = i * COL;
      const fx = (x + drift) / W; // fractional x with horizontal drift

      // Base edge Y: the wavy horizontal line the curtain hangs from.
      // Two harmonics for the base wave itself → organic arch.
      const bw = Math.sin(fx * Math.PI * 2 * c.baseFreq + now * c.baseSpd + c.basePh) * 0.70
               + Math.sin(fx * Math.PI * 2 * c.baseFreq * 2.3 + now * c.baseSpd * 1.7 + c.basePh * 1.4) * 0.30;
      const baseY = (c.baseY + bw * c.baseWave) * H;

      // Per-column intensity: blends low-freq blobs + high-freq ray detail
      const iRaw     = pNoise(fx, now, c.iFreqs, c.iAmps, c.iSpds, c.iPhs, c.iDirs);
      const intensity = Math.max(0, Math.min(1, 0.5 + iRaw));

      // Dark gaps between rays are natural and important for realism —
      // clip dim columns entirely so they contribute actual darkness.
      if (intensity < 0.14) continue;

      // Per-column ray height
      const rRaw   = pNoise(fx, now, c.rFreqs, c.rAmps, c.rSpds, c.rPhs, c.rDirs);
      const rayFrac = c.maxRayH * Math.max(0.06, 0.35 + 0.65 * Math.max(0, 0.5 + rRaw));
      const rayLen  = rayFrac * H;
      const topY    = baseY - rayLen;

      const alpha = Math.min(0.95, c.alpha * pulse * intensity);
      if (alpha < 0.007) continue;

      // Vertical gradient: bright just above the base, fading to transparent
      // going upward — the characteristic aurora "ray" profile.
      const g = ctx.createLinearGradient(x, topY, x, baseY);
      g.addColorStop(0.00, `rgba(${c.cr},${c.cg},${c.cb},0)`);
      g.addColorStop(0.18, `rgba(${c.cr},${c.cg},${c.cb},${(alpha * 0.08).toFixed(3)})`);
      g.addColorStop(0.48, `rgba(${c.cr},${c.cg},${c.cb},${(alpha * 0.42).toFixed(3)})`);
      g.addColorStop(0.75, `rgba(${c.cr},${c.cg},${c.cb},${alpha.toFixed(3)})`);
      g.addColorStop(0.90, `rgba(${c.cr},${c.cg},${c.cb},${(alpha * 0.88).toFixed(3)})`);
      g.addColorStop(1.00, `rgba(${c.cr},${c.cg},${c.cb},${(alpha * 0.30).toFixed(3)})`);

      ctx.fillStyle = g;
      ctx.fillRect(x, topY, COL + 1, rayLen + 2);
    }
  }

  // ── RENDER LOOP ───────────────────────────────────────────────
  function render() {
    const now = Date.now();
    ctx.clearRect(0, 0, W, H);

    // 1. Background — deep midnight navy
    const bg = ctx.createRadialGradient(W * 0.5, H * 0.10, 0, W * 0.5, H * 0.65, Math.max(W, H) * 1.1);
    bg.addColorStop(0,    '#030612');
    bg.addColorStop(0.22, '#020510');
    bg.addColorStop(0.55, '#01030a');
    bg.addColorStop(1,    '#010106');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Stars
    for (const s of stars) {
      const tw = Math.sin(now * s.sp + s.ph);
      const a  = Math.max(0.03, Math.min(1, s.base + tw * 0.26));
      if (s.r >= 0.78 && a > 0.28) {
        const hR   = s.r * 4.2;
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, hR);
        halo.addColorStop(0,   `rgba(210,220,255,${(a * 0.13).toFixed(3)})`);
        halo.addColorStop(0.5, `rgba(170,190,255,${(a * 0.04).toFixed(3)})`);
        halo.addColorStop(1,   'transparent');
        ctx.save();
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, hR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = s.col;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Aurora curtains — screen (additive) blend
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const c of curtains) drawCurtain(c, now);
    ctx.restore();

    animId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}


// ============================================================
// NEBULA CANVAS — Canvas Engine v2
// Approach: layered cloud/nebula nodes with drifting stars.
// Used for About, Gallery hero sections.
// ============================================================

export function initNebulaCanvas() {
  const heroSection = document.querySelector('.events-hero-section') as HTMLElement;
  if (!heroSection) return;
  if (heroSection.querySelector('.galaxy-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'galaxy-canvas';
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:block;';
  heroSection.insertBefore(canvas, heroSection.firstChild);

  const ctx = canvas.getContext('2d')!;
  if (!ctx) return;

  let W = (canvas.width  = heroSection.clientWidth);
  let H = (canvas.height = heroSection.clientHeight);
  let animId = 0;

  // ── STAR COLOURS ────────────────────────────────────────────
  const STAR_COLS = ['#ffffff', '#eef2ff', '#dde8ff', '#ccd8ff', '#f0faff'];

  // ── INTERFACES ───────────────────────────────────────────────
  interface Star {
    x: number; y: number; r: number;
    col: string; base: number; sp: number; ph: number;
    vx: number; vy: number;
  }

  // Cloud node: one soft radial gradient blob (individually invisible,
  // collectively they form the cloud).
  interface CloudNode {
    // position in px (updated each frame via drift)
    x: number; y: number;
    // base radius in px
    r: number;
    // colour
    cr: number; cg: number; cb: number;
    // peak opacity (kept LOW so no individual blob is visible)
    a: number;
    // drift velocity (px/frame, very small)
    vx: number; vy: number;
    // breathing animation
    ph: number; freq: number;
  }

  let stars: Star[] = [];
  let cloud: CloudNode[] = [];

  // ── SCENE BUILD ───────────────────────────────────────────────
  function build() {
    const M = Math.min(W, H);

    // ─── STARS ────────────────────────────────────────────────
    stars = [];
    const cnt = Math.min(750, Math.max(220, Math.floor(W * H / 800)));
    for (let i = 0; i < cnt; i++) {
      const tier = Math.random();
      // 85% micro, 13% mid, 2% bright
      const r = tier < 0.85 ? 0.22 + Math.random() * 0.40
              : tier < 0.98 ? 0.55 + Math.random() * 0.55
              :               1.1  + Math.random() * 0.80;
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r,
        col: STAR_COLS[Math.floor(Math.random() * STAR_COLS.length)],
        base: 0.18 + Math.random() * 0.78,
        sp:   0.0012 + Math.random() * 0.0045,
        ph:   Math.random() * Math.PI * 2,
        vx:   (Math.random() - 0.5) * 0.032,
        vy:   (Math.random() - 0.70) * 0.022,
      });
    }

    // ─── NEBULA CLOUD ─────────────────────────────────────────
    // The cloud is a diagonal arm running from lower-left to
    // upper-right, plus a bright cyan emission zone at upper-right.
    //
    // Key technique: many OVERLAPPING, LOW-ALPHA gradients.
    // Each node contributes ~0.08-0.25 opacity; their cumulative
    // sum in the cloud core creates the dense, continuous look.
    // Individual nodes are never visible as distinct shapes.
    //
    // Scale hierarchy:
    //   L (large):  fr 0.32-0.55 — overall cloud body
    //   M (medium): fr 0.12-0.28 — internal density texture
    //   S (small):  fr 0.06-0.13 — wispy edges and filaments

    cloud = [];

    // Helper to add a cloud node
    const add = (
      fx: number, fy: number, fr: number,
      cr: number, cg: number, cb: number, a: number,
      speed = 0.5
    ) => {
      cloud.push({
        x: fx * W, y: fy * H, r: fr * M,
        cr, cg, cb, a,
        vx: (Math.random() - 0.5) * 0.010 * speed,
        vy: (Math.random() - 0.5) * 0.008 * speed,
        ph: Math.random() * Math.PI * 2,
        freq: 0.0018 + Math.random() * 0.0012,
      });
    };

    // ── L: LARGE BASE (cloud mass definition) ─────────────────
    // Purple/violet body
    add(0.27, 0.60, 0.52,  65, 16, 178, 0.22);
    add(0.17, 0.65, 0.44,  52, 12, 155, 0.20);
    add(0.40, 0.50, 0.46,  82, 22, 188, 0.18);
    add(0.52, 0.40, 0.38,  85, 24, 192, 0.16);
    add(0.23, 0.78, 0.36,  48, 10, 145, 0.17);
    add(0.35, 0.72, 0.38,  60, 15, 165, 0.16);
    // Cyan/blue emission zone (upper-right)
    add(0.74, 0.26, 0.50,   0,138, 255, 0.26);
    add(0.84, 0.18, 0.38,  25,160, 255, 0.22);
    add(0.68, 0.20, 0.34,  15,128, 250, 0.20);
    add(0.80, 0.32, 0.30,   5,145, 255, 0.18);

    // ── M: MEDIUM TEXTURE (density variation, no colour jump) ─
    // Purple arm interior
    add(0.12, 0.72, 0.22,  58, 14, 160, 0.18);
    add(0.20, 0.60, 0.24,  70, 18, 172, 0.17);
    add(0.30, 0.55, 0.20,  74, 20, 176, 0.16);
    add(0.38, 0.62, 0.22,  62, 16, 162, 0.15);
    add(0.46, 0.56, 0.18,  80, 22, 182, 0.14);
    add(0.30, 0.42, 0.20,  82, 23, 184, 0.13);
    add(0.44, 0.44, 0.19,  85, 25, 187, 0.14);
    add(0.15, 0.50, 0.20,  55, 13, 155, 0.15);
    add(0.24, 0.68, 0.18,  60, 15, 163, 0.14);
    add(0.50, 0.32, 0.18,  88, 26, 190, 0.13);
    // Cyan zone medium
    add(0.72, 0.32, 0.22,   8,132, 248, 0.20);
    add(0.78, 0.22, 0.20,  40,168, 255, 0.18);
    add(0.88, 0.28, 0.18,  55,178, 255, 0.17);
    add(0.76, 0.12, 0.18,  30,155, 252, 0.16);
    add(0.86, 0.14, 0.16,  50,172, 255, 0.15);
    // Transition bridge (indigo-violet where purple meets cyan)
    add(0.60, 0.32, 0.18,  42, 55, 210, 0.15);
    add(0.64, 0.24, 0.16,  35, 70, 218, 0.13);
    add(0.58, 0.26, 0.15,  48, 50, 205, 0.14);

    // ── S: SMALL WISPS (organic cloud edge, filaments) ────────
    // These make the boundary look ragged, not circular.
    // Top ridge of the purple arm
    add(0.09, 0.44, 0.11,  62, 16, 162, 0.14, 0.8);
    add(0.14, 0.38, 0.10,  68, 18, 168, 0.13, 0.8);
    add(0.20, 0.33, 0.11,  72, 20, 174, 0.13, 0.8);
    add(0.27, 0.28, 0.10,  76, 21, 178, 0.12, 0.8);
    add(0.33, 0.23, 0.09,  80, 23, 182, 0.12, 0.8);
    add(0.39, 0.20, 0.10,  83, 24, 185, 0.11, 0.8);
    add(0.45, 0.25, 0.10,  80, 23, 182, 0.12, 0.8);
    add(0.51, 0.28, 0.09,  78, 22, 180, 0.11, 0.8);
    add(0.56, 0.24, 0.09,  82, 24, 184, 0.10, 0.8);
    // Bottom ridge of the purple arm
    add(0.07, 0.82, 0.09,  50, 12, 148, 0.12, 0.8);
    add(0.13, 0.80, 0.10,  52, 13, 150, 0.12, 0.8);
    add(0.19, 0.85, 0.09,  55, 14, 153, 0.11, 0.8);
    add(0.26, 0.88, 0.09,  57, 15, 155, 0.10, 0.8);
    add(0.32, 0.78, 0.08,  60, 16, 158, 0.11, 0.8);
    // Left edge
    add(0.04, 0.64, 0.09,  46, 10, 138, 0.12, 0.8);
    add(0.05, 0.75, 0.08,  44, 10, 135, 0.11, 0.8);
    // Scattered interior texture
    add(0.25, 0.48, 0.08,  70, 19, 170, 0.11, 1.0);
    add(0.35, 0.58, 0.09,  66, 17, 165, 0.10, 1.0);
    add(0.42, 0.68, 0.08,  63, 16, 162, 0.10, 1.0);
    add(0.48, 0.50, 0.09,  78, 22, 178, 0.11, 1.0);
    // Cyan zone wisps
    add(0.65, 0.15, 0.10,  28,148, 252, 0.14, 0.8);
    add(0.90, 0.16, 0.09,  55,175, 255, 0.13, 0.8);
    add(0.92, 0.36, 0.08,  48,168, 255, 0.12, 0.8);
    add(0.70, 0.10, 0.09,  22,140, 250, 0.13, 0.8);
    // Extra wispy filaments at edges for organic feel
    add(0.18, 0.42, 0.07,  65, 17, 163, 0.10, 1.2);
    add(0.28, 0.36, 0.07,  72, 21, 172, 0.10, 1.2);
    add(0.40, 0.30, 0.07,  79, 23, 180, 0.09, 1.2);
    add(0.10, 0.56, 0.07,  55, 13, 153, 0.10, 1.2);
    add(0.22, 0.76, 0.07,  56, 14, 154, 0.09, 1.2);
  }

  build();

  const onResize = () => {
    W = canvas.width  = heroSection.clientWidth;
    H = canvas.height = heroSection.clientHeight;
    build();
  };
  window.addEventListener('resize', onResize);

  // ── DRAW A CLOUD NODE ────────────────────────────────────────
  // The gradient profile is flat in the core, then gently decays —
  // this prevents a crisp circular edge that looks like a "blob".
  function drawNode(n: CloudNode) {
    const pulse = 1 + Math.sin(Date.now() * n.freq + n.ph) * 0.04;
    const R = n.r * pulse;

    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, R);
    g.addColorStop(0.00, `rgba(${n.cr},${n.cg},${n.cb},${n.a})`);
    g.addColorStop(0.25, `rgba(${n.cr},${n.cg},${n.cb},${n.a * 0.92})`);
    g.addColorStop(0.55, `rgba(${n.cr},${n.cg},${n.cb},${n.a * 0.50})`);
    g.addColorStop(0.80, `rgba(${n.cr},${n.cg},${n.cb},${n.a * 0.15})`);
    g.addColorStop(1.00, `rgba(${n.cr},${n.cg},${n.cb},0)`);

    ctx.fillStyle = g;
    // Fill a rect covering the gradient's full extent — avoids the
    // hard circular clip boundary that makes blobs look distinct.
    ctx.fillRect(n.x - R, n.y - R, R * 2, R * 2);
  }

  // ── RENDER LOOP ───────────────────────────────────────────────
  let t = 0;

  function render() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // ── 1. BACKGROUND ─────────────────────────────────────────
    // Pure deep space — nearly black with faint navy tint at centre
    const bg = ctx.createRadialGradient(W * 0.4, H * 0.4, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.85);
    bg.addColorStop(0,    '#06061e');
    bg.addColorStop(0.30, '#040415');
    bg.addColorStop(0.65, '#02020e');
    bg.addColorStop(1,    '#010109');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── 2. STARS ──────────────────────────────────────────────
    for (const s of stars) {
      // Drift
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;

      // Twinkle (alpha only — no size change, no lines)
      const tw = Math.sin(t * s.sp * 10 + s.ph);
      const a  = Math.max(0.05, Math.min(1, s.base + tw * 0.30));

      // Bright stars get a very soft circular halo — no cross lines
      if (s.r >= 1.0 && a > 0.35) {
        const hex = s.col.replace('#', '');
        const rr  = parseInt(hex.slice(0, 2), 16);
        const gg  = parseInt(hex.slice(2, 4), 16);
        const bb  = parseInt(hex.slice(4, 6), 16);
        const haloR = s.r * 4.5;
        const halo  = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR);
        halo.addColorStop(0,   `rgba(${rr},${gg},${bb},${a * 0.22})`);
        halo.addColorStop(0.5, `rgba(${rr},${gg},${bb},${a * 0.06})`);
        halo.addColorStop(1,   'transparent');
        ctx.save();
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, haloR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Star disc — just a filled circle, no decorations
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = s.col;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── 3. NEBULA CLOUD ────────────────────────────────────────
    // All 60+ nodes drawn in a single pass, no blending mode tricks.
    // Each node is individually barely visible; their cumulative
    // overlap builds the dense, continuous cloud body.
    for (const n of cloud) {
      // Slow drift
      n.x += n.vx; n.y += n.vy;
      // Soft boundary wrap (nodes are large so this is seamless)
      const margin = n.r * 1.2;
      if (n.x < -margin) n.x = W + margin;
      if (n.x > W + margin) n.x = -margin;
      if (n.y < -margin) n.y = H + margin;
      if (n.y > H + margin) n.y = -margin;

      drawNode(n);
    }

    animId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}
