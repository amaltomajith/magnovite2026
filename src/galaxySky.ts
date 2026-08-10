// ============================================================
// PHOTOREALISTIC DEEP SPACE NEBULA — Canvas Engine v5
// Approach: multi-scale overlapping soft gradients create a
// continuous volumetric cloud (not individual blobs).
// Stars: simple point-light dots, no decorative spikes.
// No spheres, no cartoonish effects.
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

  // ── STAR COLOURS (spectral, but no orange/warm — space nebula field) ──
  const STAR_COLS = ['#ffffff','#eef2ff','#dde8ff','#ccd8ff','#f8f8ff'];

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
