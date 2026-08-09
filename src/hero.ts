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
  const progressBarElement = document.getElementById('loader-bar');

  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Luxury Deep Space Background & Fog (Tuned to be rich and deep without glare)
  const spaceBgColor = 0x05070e;
  scene.background = new THREE.Color(spaceBgColor);
  scene.fog = new THREE.FogExp2(0x080a14, 0.0075);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.0001,
    5000
  );

  const checkMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);
  let isMobileDevice = checkMobile();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobileDevice,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 2));

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.22, // strength tuned for subtle luxury cosmic glow without over-exposure
    0.35, // radius
    0.85  // threshold
  );
  if (!isMobileDevice) {
    composer.addPass(bloomPass);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.22);
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
  // SCROLL-DRIVEN CAMERA KEYFRAMES (8 entries, 7 gaps = rawIndex 0..7)
  // -----------------------------------------------------------------------
  const kfIntroducing = { camPos: new THREE.Vector3(0.12, 0.2, 3.2), camTarget: new THREE.Vector3(0, 0, 0), modelRotY: -0.08 };
  const sections = [
    { camPos: new THREE.Vector3(0, 0.35, 5.2),     camTarget: new THREE.Vector3(0, 0, 0),      modelRotY: 0 },
    kfIntroducing,  // step 1: INTRODUCING
    kfIntroducing,  // step 2: MAGNOVITE — camera stays put, crossfade happens in-place
    { camPos: new THREE.Vector3(-0.1, 0.12, 2.0),  camTarget: new THREE.Vector3(0, 0, 0),      modelRotY: 0.06 },
    { camPos: new THREE.Vector3(0.06, 0.06, 1.1),  camTarget: new THREE.Vector3(0, 0, 0),      modelRotY: -0.04 },
    { camPos: new THREE.Vector3(0.0, 0.02, 0.45),  camTarget: new THREE.Vector3(0, 0, -0.01),  modelRotY: 0.02 },
    { camPos: new THREE.Vector3(0.0, 0.0, 0.08),   camTarget: new THREE.Vector3(0, 0, -0.02),  modelRotY: 0.04 },
    { camPos: new THREE.Vector3(0.0, -0.02, -0.6), camTarget: new THREE.Vector3(0, 0, -1.5),   modelRotY: 0.06 }
  ];

  // Pre-cached step card elements to avoid DOM tree querying during high-FPS scroll loop
  interface StepCardItem {
    el: HTMLElement;
    innerContent: HTMLElement | null;
    officialLogoYear: HTMLElement | null;
    isGlassCard: boolean;
    lastVisStr: string;
    lastSlideYStr: string;
    lastTransformStr: string;
  }

  const stepCardItems: StepCardItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('.hero-card-step')
  ).map((el) => {
    const innerContent = el.firstElementChild as HTMLElement | null;
    const isGlassCard = !!(innerContent && innerContent.classList.contains('premium-glass-card'));
    const officialLogoYear = el.querySelector('.official-logo-year') as HTMLElement | null;
    return {
      el,
      innerContent,
      officialLogoYear,
      isGlassCard,
      lastVisStr: '',
      lastSlideYStr: '',
      lastTransformStr: ''
    };
  });

  const sectionDots = Array.from(document.querySelectorAll<HTMLElement>('.section-dots .dot'));
  const scrollBar = document.getElementById('scroll-bar');

  const currentCamPos    = sections[0].camPos.clone();
  const currentCamTarget = sections[0].camTarget.clone();
  let   currentModelRotY = 0;

  function smootherStep(t: number): number {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function cardVis(rawIndex: number, cardIdx: number): number {
    if (cardIdx === 1) {
      if (rawIndex < 0.45) return 0;
      if (rawIndex <= 1.0) return smootherStep((rawIndex - 0.45) / 0.55);
      if (rawIndex <= 2.0) return 1 - smootherStep(rawIndex - 1.0);
      return 0;
    }
    if (cardIdx === 2) {
      if (rawIndex < 1.0) return 0;
      if (rawIndex <= 2.0) return smootherStep(rawIndex - 1.0);
      if (rawIndex <= 2.75) return 1 - smootherStep((rawIndex - 2.0) / 0.75);
      return 0;
    }

    const dist = Math.abs(rawIndex - cardIdx);
    const radius = 0.55;
    if (dist >= radius) return 0;
    return smootherStep(1 - dist / radius);
  }

  let targetRawIndex = 0;
  let currentSmoothRawIndex = 0;

  function updateRawIndexFromScroll() {
    const maxScroll  = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollFrac = Math.min(window.scrollY / maxScroll, 1);
    targetRawIndex   = scrollFrac * (sections.length - 1);
  }

  function updateFromScroll(rawIndex: number) {
    const totalSections = sections.length - 1;
    const scrollFrac    = Math.min(rawIndex / totalSections, 1);
    const fromIdx       = Math.min(Math.floor(rawIndex), totalSections - 1);
    const toIdx         = Math.min(fromIdx + 1, totalSections);
    const stepFrac      = rawIndex - fromIdx;

    const from = sections[fromIdx];
    const to   = sections[toIdx];

    const t = smootherStep(stepFrac);
    currentCamPos.lerpVectors(from.camPos, to.camPos, t);
    currentCamTarget.lerpVectors(from.camTarget, to.camTarget, t);
    currentModelRotY = from.modelRotY + (to.modelRotY - from.modelRotY) * t;

    if (activePointsMat) {
      const cp = Math.max((scrollFrac - 0.5) / 0.5, 0);
      const sz = 1.0 - cp * 0.45;
      const op = 1.0 - cp * 0.35;
      activePointsMat.size    = baseStarSize * sz;
      activePointsMat.opacity = 0.85 * op;
      if (activeAmbientGlowMat) {
        activeAmbientGlowMat.size    = baseStarSize * 3.5 * sz;
        activeAmbientGlowMat.opacity = 0.05 * op;
      }
    }

    stepCardItems.forEach((item, idx) => {
      const vis = cardVis(rawIndex, idx);
      const rel = rawIndex - idx;
      
      let slideY = 0;
      let scale = 1.0;

      if (idx === 1) {
        // INTRODUCING: smooth scale & dissolve in-place
        slideY = 0;
        if (rel <= 0) {
          scale = 0.88 + 0.12 * vis;
        } else {
          scale = 1.0 + 0.12 * (1 - vis);
        }
      } else if (idx === 2) {
        // MAGNOVITE LOGO: expands smoothly in-place over INTRODUCING
        slideY = 0;
        if (rel <= 0) {
          scale = 0.88 + 0.12 * vis;
        } else {
          scale = 1.0 - 0.08 * (1 - vis);
        }
      } else {
        if (rel > 0) {
          slideY = -35 * (1 - vis);
        } else {
          slideY = 35 * (1 - vis);
        }
      }

      const visStr = vis.toFixed(3);
      const slideYStr = `${slideY.toFixed(1)}px`;
      const transformStr = scale !== 1.0 ? `scale(${scale.toFixed(3)})` : '';

      // Skip DOM mutation if state has not changed significantly
      if (visStr === item.lastVisStr && slideYStr === item.lastSlideYStr && transformStr === item.lastTransformStr) {
        return;
      }
      item.lastVisStr = visStr;
      item.lastSlideYStr = slideYStr;
      item.lastTransformStr = transformStr;

      const { el, innerContent, isGlassCard, officialLogoYear } = item;

      if (isGlassCard) {
        el.style.opacity       = '1';
        el.style.filter        = '';
        el.style.visibility    = vis < 0.01 ? 'hidden' : 'visible';
        el.style.transform     = transformStr;
        el.style.transition    = 'none';
        el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';

        if (innerContent) {
          innerContent.style.opacity    = visStr;
          innerContent.style.transform  = '';
          innerContent.style.marginTop  = slideYStr;
          innerContent.style.transition = 'none';
        }
      } else {
        const tiltX = idx === 2 ? -mouseY * 2.2 * vis : 0;
        const tiltY = idx === 2 ? mouseX * 2.2 * vis : 0;
        const tiltStr = idx === 2 && vis > 0.05 ? ` perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)` : '';

        el.style.opacity       = visStr;
        el.style.filter        = '';
        el.style.visibility    = vis < 0.01 ? 'hidden' : 'visible';
        el.style.transform     = `${transformStr}${tiltStr}`;
        el.style.transition    = 'none';
        el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';

        if (innerContent) {
          innerContent.style.opacity    = '1';
          innerContent.style.transform  = '';
          innerContent.style.marginTop  = slideYStr;
          innerContent.style.transition = 'none';
        }

        if (idx === 2 && officialLogoYear) {
          const yearVis = Math.max(0, (vis - 0.25) / 0.75);
          officialLogoYear.style.opacity = yearVis.toFixed(3);
          officialLogoYear.style.transform = `translateY(${(10 * (1 - yearVis)).toFixed(1)}px)`;
        }
      }
    });

    const nearestIdx = Math.round(rawIndex);
    sectionDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === nearestIdx);
    });

    if (scrollBar) scrollBar.style.height = `${scrollFrac * 100}%`;
  }

  window.addEventListener('scroll', updateRawIndexFromScroll, { passive: true });

  // Progress update helper
  function updateProgressUI(pct: number) {
    const rounded = Math.min(Math.max(Math.round(pct), 0), 100);
    if (progressElement) progressElement.textContent = `${rounded}%`;
    if (progressBarElement) progressBarElement.style.width = `${rounded}%`;
  }

  // Preload key hero image assets so scroll card reveals do not trigger image decoding jank
  const heroImages = [
    '/logos/magnovie26white.png',
    '/logos/christwhite.png',
    '/logos/magnovite.png',
    '/images/thumbnail.jpg',
    '/images/shaanrahman.jpg'
  ];

  let preloadedImagesCount = 0;
  heroImages.forEach((src) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      preloadedImagesCount++;
    };
    img.src = src;
  });

  // Finish loading & pre-warm WebGL GPU pipeline
  function finishLoadingAndWarmup() {
    updateProgressUI(95);
    // Warm up WebGL shader compilation & framebuffer creation before hiding loader screen
    renderer.compile(scene, camera);
    for (let i = 0; i < 3; i++) {
      composer.render();
    }
    setTimeout(() => {
      updateProgressUI(100);
      setTimeout(() => {
        if (loaderElement) loaderElement.classList.add('hidden');
      }, 200);
    }, 150);
  }

  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (_url, loaded, total) => {
    const pct = total > 0 ? (loaded / total) * 90 : 45;
    updateProgressUI(pct);
  };
  loadingManager.onLoad = () => {
    finishLoadingAndWarmup();
  };
  loadingManager.onError = (url) => {
    console.warn(`[Hero] Failed to load resource: ${url}`);
    finishLoadingAndWarmup();
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
                    hsl.s = Math.min(hsl.s * 1.1, 1.0);
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
                mat.opacity         = 0.85;
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
                  opacity:         0.05,
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
            finishLoadingAndWarmup();
          }
        );
      } else {
        console.info('[Hero] hero.glb not found.');
        finishLoadingAndWarmup();
      }
    })
    .catch(() => { finishLoadingAndWarmup(); });

  function onWindowResize() {
    isMobileDevice = checkMobile();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onWindowResize);

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  if (!isMobileDevice) {
    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  const smoothCamPos    = currentCamPos.clone();
  const smoothCamTarget = currentCamTarget.clone();
  let   smoothModelRotY = 0;

  updateRawIndexFromScroll();
  currentSmoothRawIndex = targetRawIndex;
  updateFromScroll(currentSmoothRawIndex);

  function animate() {
    requestAnimationFrame(animate);

    updateRawIndexFromScroll();

    if (!isMobileDevice) {
      mouseX += (targetMouseX - mouseX) * 0.018;
      mouseY += (targetMouseY - mouseY) * 0.018;
    }

    const lerpSpeed = isReducedMotion ? 1.0 : 0.038;
    currentSmoothRawIndex += (targetRawIndex - currentSmoothRawIndex) * lerpSpeed;

    updateFromScroll(currentSmoothRawIndex);

    const speed = isReducedMotion ? 1.0 : 0.05;

    smoothCamPos.lerp(currentCamPos, speed);
    smoothCamTarget.lerp(currentCamTarget, speed);
    smoothModelRotY += (currentModelRotY - smoothModelRotY) * speed;

    const interactiveCamPos = smoothCamPos.clone();
    if (!isMobileDevice) {
      interactiveCamPos.x += mouseX * 0.006;
      interactiveCamPos.y += -mouseY * 0.006;
    }

    camera.position.copy(interactiveCamPos);
    camera.lookAt(smoothCamTarget);

    if (heroModel) heroModel.rotation.y = smoothModelRotY;

    if (isMobileDevice) {
      renderer.render(scene, camera);
    } else {
      composer.render();
    }
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

function initPromoInlinePlayer() {
  const playBtn = document.getElementById('hero-play-promo-btn');
  const container = document.getElementById('hero-promo-container');
  if (playBtn && container) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = `
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 7.5; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 20px 48px rgba(0, 0, 0, 0.8); background: #000;">
          <iframe src="https://www.youtube-nocookie.com/embed/EGSUtEnfX9g?autoplay=1&rel=0" 
                  title="Magnovite 2026 Official Promo" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowfullscreen 
                  style="width: 100%; height: 100%; border: none; display: block;">
          </iframe>
        </div>
      `;
    });
  }
}

import { initNavigation } from './navigation';

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initNavigation();
  initHeroCountdown();
  initPromoInlinePlayer();
});
