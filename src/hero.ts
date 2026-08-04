import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

function createStarSprite(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;

  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0.0,  'rgba(255,255,255,1.0)');
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.85)');
  gradient.addColorStop(0.4,  'rgba(255,255,255,0.35)');
  gradient.addColorStop(0.7,  'rgba(255,255,255,0.08)');
  gradient.addColorStop(1.0,  'rgba(255,255,255,0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function initHero3D() {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  const loaderElement = document.getElementById('hero-loader');
  const progressElement = document.getElementById('loader-progress');

  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Luxury Deep Space Background & Fog
  const spaceBgColor = 0x080a12;
  scene.background = new THREE.Color(spaceBgColor);
  scene.fog = new THREE.FogExp2(0x101422, 0.007);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.0001,
    5000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4, // strength
    0.35, // radius
    0.80  // threshold
  );
  composer.addPass(bloomPass);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(ambientLight);

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => { isReducedMotion = e.matches; });

  const starSprite = createStarSprite();

  let baseStarSize = 0.012;
  let activePointsMat: THREE.PointsMaterial | null = null;
  let activeAmbientGlowMat: THREE.PointsMaterial | null = null;
  let mainStarPointsObj: THREE.Points | null = null;

  // -----------------------------------------------------------------------
  // SCROLL-DRIVEN CAMERA KEYFRAMES (6 Discrete Steps with Hold Pauses)
  // -----------------------------------------------------------------------
  const sections = [
    {
      camPos:    new THREE.Vector3(0, 0.35, 5.2),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: 0
    },
    {
      camPos:    new THREE.Vector3(0.12, 0.2, 3.2),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: -0.08
    },
    {
      camPos:    new THREE.Vector3(-0.1, 0.1, 1.5),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: 0.06
    },
    {
      camPos:    new THREE.Vector3(0.04, 0.03, 0.5),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: -0.04
    },
    {
      camPos:    new THREE.Vector3(0.0, 0.005, 0.08),
      camTarget: new THREE.Vector3(0, 0, -0.02),
      modelRotY: 0.03
    },
    {
      camPos:    new THREE.Vector3(0.0, -0.02, -0.6),
      camTarget: new THREE.Vector3(0, 0, -1.5),
      modelRotY: 0.06
    }
  ];

  // Card step elements — queried once
  const cardSteps = Array.from(document.querySelectorAll<HTMLElement>('.hero-card-step'));
  const sectionDots = Array.from(document.querySelectorAll<HTMLElement>('.section-dots .dot'));
  const scrollBar = document.getElementById('scroll-bar');

  const currentCamPos    = sections[0].camPos.clone();
  const currentCamTarget = sections[0].camTarget.clone();
  let   currentModelRotY = 0;

  // -----------------------------------------------------------------------
  // SCROLL ENGINE — Smootherstep (Ken Perlin)
  //
  // f(t) = 6t⁵ - 15t⁴ + 10t³
  // f'(0) = f'(1) = 0  →  zero velocity at every keyframe = organic pause
  //
  // Card visibility is driven by proximity to each keyframe index.
  // At rawIndex=0 (scroll top): step-0 card is fully visible immediately.
  // As rawIndex moves away from an integer: card blurs and slides out.
  // As rawIndex approaches the next integer: that card blurs in and slides up.
  // -----------------------------------------------------------------------

  /** Smooth deceleration curve: zero velocity at t=0 and t=1 */
  function smootherStep(t: number): number {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * Card visibility based on proximity to each keyframe index.
   * Step 1 (Magnovite reveal) gets a wider radius so it lingers longer.
   */
  const SHOW_RADIUS_DEFAULT = 0.52;  // all steps
  const SHOW_RADIUS_STEP1   = 0.78;  // Magnovite reveal — stays on screen longer
  function cardVis(rawIndex: number, cardIdx: number): number {
    const dist   = Math.abs(rawIndex - cardIdx);
    const radius = cardIdx === 1 ? SHOW_RADIUS_STEP1 : SHOW_RADIUS_DEFAULT;
    if (dist >= radius) return 0;
    return smootherStep(1 - dist / radius);
  }

  function updateFromScroll() {
    const maxScroll     = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollFrac    = Math.min(window.scrollY / maxScroll, 1);
    const totalSections = sections.length - 1;
    const rawIndex      = scrollFrac * totalSections;
    const fromIdx       = Math.min(Math.floor(rawIndex), totalSections - 1);
    const toIdx         = Math.min(fromIdx + 1, totalSections);
    const stepFrac      = rawIndex - fromIdx;

    const from = sections[fromIdx];
    const to   = sections[toIdx];

    // Camera glides with zero velocity at keyframe boundaries — no abrupt stops
    const t = smootherStep(stepFrac);
    currentCamPos.lerpVectors(from.camPos, to.camPos, t);
    currentCamTarget.lerpVectors(from.camTarget, to.camTarget, t);
    currentModelRotY = from.modelRotY + (to.modelRotY - from.modelRotY) * t;

    // Star field fade at close proximity
    if (activePointsMat) {
      const cp = Math.max((scrollFrac - 0.5) / 0.5, 0);
      const sz = 1.0 - cp * 0.45;
      const op = 1.0 - cp * 0.35;
      activePointsMat.size    = baseStarSize * sz;
      activePointsMat.opacity = op;
      if (activeAmbientGlowMat) {
        activeAmbientGlowMat.size    = baseStarSize * 3.5 * sz;
        activeAmbientGlowMat.opacity = 0.12 * op;
      }
    }

    // Drive each card via inline style — scroll-synced proximity-based visibility
    cardSteps.forEach((el, idx) => {
      const vis    = cardVis(rawIndex, idx);
      const blurPx = (1 - vis) * 12;
      const slideY = (1 - vis) * 28;
      el.style.opacity       = vis.toFixed(3);
      el.style.filter        = vis < 0.995 ? `blur(${blurPx.toFixed(1)}px)` : '';
      el.style.visibility    = vis < 0.01 ? 'hidden' : 'visible';
      el.style.transform     = `translateY(${slideY.toFixed(1)}px) scale(${(0.94 + vis * 0.06).toFixed(3)})`;
      el.style.transition    = 'none';
      el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
    });

    // Section dots — highlight nearest keyframe
    const nearestIdx = Math.round(rawIndex);
    sectionDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === nearestIdx);
    });

    if (scrollBar) scrollBar.style.height = `${scrollFrac * 100}%`;
  }

  window.addEventListener('scroll', updateFromScroll, { passive: true });



  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (_url, loaded, total) => {
    if (progressElement) progressElement.textContent = `${Math.round((loaded / total) * 100)}%`;
  };
  loadingManager.onLoad = () => {
    if (loaderElement) loaderElement.classList.add('hidden');
  };
  loadingManager.onError = (url) => {
    console.warn(`[Hero] Failed to load: ${url}`);
    if (loaderElement) loaderElement.classList.add('hidden');
  };

  const gltfLoader = new GLTFLoader(loadingManager);
  let heroModel: THREE.Group | null = null;
  const modelUrl = '/models/hero.glb';

  fetch(modelUrl, { method: 'HEAD' })
    .then((res) => {
      const ct = res.headers.get('content-type') || '';
      if (res.ok && !ct.includes('text/html')) {
        gltfLoader.load(
          modelUrl,
          (gltf) => {
            heroModel = gltf.scene;

            const box    = new THREE.Box3().setFromObject(heroModel);
            const center = box.getCenter(new THREE.Vector3());
            heroModel.position.sub(center);

            const sphere   = box.getBoundingSphere(new THREE.Sphere());
            const clusterRadius = sphere.radius;
            baseStarSize = Math.max(clusterRadius * 0.0018, 0.012);

            heroModel.traverse((child) => {
              if (child instanceof THREE.Points && !mainStarPointsObj) {
                mainStarPointsObj = child;

                const posAttr = child.geometry.attributes.position;
                const colorAttr = child.geometry.attributes.color;

                if (posAttr && colorAttr) {
                  const count = posAttr.count;
                  const tempColor = new THREE.Color();
                  const hsl = { h: 0, s: 0, l: 0 };

                  for (let i = 0; i < count; i++) {
                    const x = posAttr.getX(i);
                    const y = posAttr.getY(i);
                    const z = posAttr.getZ(i);
                    const dist = Math.sqrt(x * x + y * y + z * z);

                    tempColor.setRGB(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i));
                    tempColor.getHSL(hsl);
                    hsl.s = Math.min(hsl.s * 1.6, 1.0);
                    tempColor.setHSL(hsl.h, hsl.s, hsl.l);

                    if (dist > 12) {
                      const fade = Math.max(1.0 - (dist - 12) / 12.0, 0.12);
                      tempColor.r *= fade;
                      tempColor.g *= fade;
                      tempColor.b *= fade;
                    }

                    colorAttr.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
                  }
                  colorAttr.needsUpdate = true;
                }

                const mat = child.material as THREE.PointsMaterial;
                activePointsMat = mat;

                mat.color = new THREE.Color(0xffffff);
                mat.vertexColors = true;
                mat.map             = starSprite;
                mat.size            = baseStarSize;
                mat.sizeAttenuation = true;
                mat.transparent     = true;
                mat.depthWrite      = false;
                mat.blending        = THREE.AdditiveBlending;
                mat.opacity         = 1.0;
                mat.needsUpdate     = true;

                const ambientGlowMat = new THREE.PointsMaterial({
                  map:             starSprite,
                  vertexColors:    true,
                  color:           new THREE.Color(0xffffff),
                  size:            baseStarSize * 3.5,
                  sizeAttenuation: true,
                  transparent:     true,
                  depthWrite:      false,
                  blending:        THREE.AdditiveBlending,
                  opacity:         0.12,
                });
                activeAmbientGlowMat = ambientGlowMat;

                const ambientGlowPoints = new THREE.Points(child.geometry, ambientGlowMat);
                child.parent?.add(ambientGlowPoints);
              }

              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((mat) => {
                  const m = mat as THREE.MeshStandardMaterial;
                  m.vertexColors = true;
                  m.color = new THREE.Color(0xffffff);
                  m.needsUpdate = true;
                });
              }
            });

            scene.add(heroModel);
          },
          undefined,
          (err) => {
            console.warn('[Hero] Failed to parse hero.glb:', err);
            if (loaderElement) loaderElement.classList.add('hidden');
          }
        );
      } else {
        console.info('[Hero] hero.glb not found.');
        if (loaderElement) loaderElement.classList.add('hidden');
      }
    })
    .catch(() => { if (loaderElement) loaderElement.classList.add('hidden'); });

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onWindowResize);

  const smoothCamPos    = currentCamPos.clone();
  const smoothCamTarget = currentCamTarget.clone();
  let   smoothModelRotY = 0;

  updateFromScroll();

  function animate() {
    requestAnimationFrame(animate);

    const speed = isReducedMotion ? 1.0 : 0.065;

    smoothCamPos.lerp(currentCamPos, speed);
    smoothCamTarget.lerp(currentCamTarget, speed);
    smoothModelRotY += (currentModelRotY - smoothModelRotY) * speed;

    camera.position.copy(smoothCamPos);
    camera.lookAt(smoothCamTarget);

    if (heroModel) heroModel.rotation.y = smoothModelRotY;

    composer.render();
  }

  animate();
}

// -----------------------------------------------------------------------
// HERO COUNTDOWN TIMER LOGIC (Pure Platinum & Liquid Silver Palette)
// -----------------------------------------------------------------------
function initHeroCountdown() {
  const targetDate = new Date('2026-09-15T09:00:00+05:30').getTime();

  function updateDigit(id: string, newDigit: number) {
    const cardEl = document.getElementById(id);
    if (!cardEl) return;

    const valEl = cardEl.querySelector('.flip-val');
    const currentVal = cardEl.getAttribute('data-val');
    const nextVal = String(newDigit);

    if (currentVal !== nextVal) {
      cardEl.setAttribute('data-val', nextVal);
      if (valEl) valEl.textContent = nextVal;

      cardEl.classList.remove('flip-anim');
      void cardEl.offsetWidth;
      cardEl.classList.add('flip-anim');
    }
  }

  function updateTimer() {
    const now = Date.now();
    const diff = Math.max(targetDate - now, 0);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    updateDigit('hero-days-t', Math.floor(d / 10));
    updateDigit('hero-days-u', d % 10);

    updateDigit('hero-hours-t', Math.floor(h / 10));
    updateDigit('hero-hours-u', h % 10);

    updateDigit('hero-mins-t', Math.floor(m / 10));
    updateDigit('hero-mins-u', m % 10);

    updateDigit('hero-secs-t', Math.floor(s / 10));
    updateDigit('hero-secs-u', s % 10);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

import { initNavigation } from './navigation';

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initNavigation();
  initHeroCountdown();
});
