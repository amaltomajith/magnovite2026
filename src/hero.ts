import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { initNavigation } from './navigation';

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
  const spaceBgColor = 0x040404;
  scene.background = new THREE.Color(spaceBgColor);
  scene.fog = new THREE.FogExp2(0x060606, 0.0075);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
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
  renderer.toneMappingExposure = 0.65;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.14,
    0.35,
    0.85
  );
  if (!isMobileDevice) {
    composer.addPass(bloomPass);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambientLight);

  const starSprite = createStarSprite();

  let baseStarSize = 0.012;
  let activePointsMat: THREE.PointsMaterial | null = null;
  let activeAmbientGlowMat: THREE.PointsMaterial | null = null;
  let mainStarPointsObj: THREE.Points | null = null;

  // -----------------------------------------------------------------------
  // CAMERA KEYFRAMES
  // -----------------------------------------------------------------------
  const sections = [
    // 0: HERO - Wide orbital start
    { angle: 0,               radius: 6.5, height: 1.2 }, 
    // 1: INTRODUCING - Sweep inward
    { angle: Math.PI * 1.0,   radius: 4.2, height: 0.5 }, 
    // 2: MAGNOVITE - Zooms close into galaxy core
    { angle: Math.PI * 1.8,   radius: 2.2, height: 0.15 }, 
    // 3: VIDEO - Scroll-controlled steps start here
    { angle: Math.PI * 2.5,   radius: 2.6, height: -0.2 }, 
    // 4: CHRIS
    { angle: Math.PI * 3.2,   radius: 2.8, height: 0.4 }, 
    // 5: SPEAKER
    { angle: Math.PI * 3.9,   radius: 2.5, height: 0.6 }, 
    // 6: EXITED
    { angle: Math.PI * 4.6,   radius: 2.3, height: -0.3 }, 
    // 7: COUNTDOWN
    { angle: Math.PI * 5.2,   radius: 2.0, height: 0.1 }
  ];

  interface StepCardItem {
    el: HTMLElement;
    officialLogoYear: HTMLElement | null;
    glassCard: HTMLElement | null;
    glassFadeInner: HTMLElement | null;
    glassShimmer: HTMLElement | null;
    lastRenderKey: string;
    lastGlassSurfaceKey: string;
  }

  const stepCardItems: StepCardItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('.hero-card-step')
  ).map((el) => {
    const innerContent = el.firstElementChild as HTMLElement | null;
    const isGlassCard = !!(innerContent && innerContent.classList.contains('premium-glass-card'));
    const glassCard = isGlassCard ? (innerContent as HTMLElement) : null;
    const officialLogoYear = el.querySelector('.official-logo-year') as HTMLElement | null;
    return {
      el,
      officialLogoYear,
      glassCard,
      glassFadeInner: glassCard?.querySelector<HTMLElement>('.pgc-fade-inner') ?? null,
      glassShimmer: glassCard?.querySelector<HTMLElement>('.pgc-shimmer') ?? null,
      lastRenderKey: '',
      lastGlassSurfaceKey: ''
    };
  });

  const sectionDots = Array.from(document.querySelectorAll<HTMLElement>('.section-dots .dot'));

  const currentCamPos    = new THREE.Vector3();
  const currentCamTarget = new THREE.Vector3(0, 0, 0);

  function smootherStep(t: number): number {
    t = Math.max(0, Math.min(1, t));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function cardVis(rawIndex: number, cardIdx: number): number {
    if (cardIdx === 0) {
      // Step 0 ("Hold on tight..."): Holds 100% opacity through 0.50 (~3s window), fades out by 0.80
      if (rawIndex <= 0.50) return 1;
      if (rawIndex <= 0.80) return 1 - smootherStep((rawIndex - 0.50) / 0.30);
      return 0;
    }
    if (cardIdx === 1) {
      // Step 1 ("INTRODUCING"): Enters at 0.50, holds through 1.25, exits by 1.50
      if (rawIndex < 0.50) return 0;
      if (rawIndex <= 0.80) return smootherStep((rawIndex - 0.50) / 0.30);
      if (rawIndex <= 1.25) return 1;
      if (rawIndex <= 1.50) return 1 - smootherStep((rawIndex - 1.25) / 0.25);
      return 0;
    }
    if (cardIdx === 2) {
      // Step 2 ("MAGNOVITE")
      if (rawIndex < 1.35) return 0;
      if (rawIndex <= 1.95) return smootherStep((rawIndex - 1.35) / 0.60);
      if (rawIndex <= 2.75) return 1 - smootherStep((rawIndex - 1.95) / 0.8);
      return 0;
    }

    const dist = Math.abs(rawIndex - cardIdx);
    const radius = 0.55;
    if (dist >= radius) return 0;
    return smootherStep(1 - dist / radius);
  }

  let wasNearStep3: boolean | null = null;
  let ambientSpin = 0;

  function updateFromScroll(rawIndex: number) {
    const totalSections = sections.length - 1;
    const safeRawIndex  = Math.max(0, Math.min(rawIndex, totalSections));

    const fromIdx = Math.floor(safeRawIndex);
    const toIdx   = Math.min(fromIdx + 1, totalSections);
    const stepFrac = safeRawIndex - fromIdx;

    const from = sections[fromIdx];
    const to   = sections[toIdx];

    const t = smootherStep(stepFrac);

    const baseAngle     = from.angle  + (to.angle  - from.angle) * t;
    const currentRadius = from.radius + (to.radius - from.radius) * t;
    const currentHeight = from.height + (to.height - from.height) * t;

    const totalAngle = baseAngle + ambientSpin;

    currentCamPos.set(
      Math.sin(totalAngle) * currentRadius,
      currentHeight,
      Math.cos(totalAngle) * currentRadius
    );
    currentCamTarget.set(0, 0, 0);

    if (activePointsMat) {
      const scrollFrac = Math.min(safeRawIndex / totalSections, 1);
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
      const vis = cardVis(safeRawIndex, idx);
      const rel = safeRawIndex - idx;
      
      let slideY = 0;
      let scale = 1.0;

      if (idx === 1) {
        slideY = 0;
        scale = rel <= 0 ? (0.88 + 0.12 * vis) : (1.0 + 0.12 * (1 - vis));
      } else if (idx === 2) {
        slideY = 0;
        scale = rel <= 0 ? (0.88 + 0.12 * vis) : (1.0 - 0.08 * (1 - vis));
      } else {
        slideY = rel > 0 ? -30 * (1 - vis) : 30 * (1 - vis);
      }

      const visStr = vis.toFixed(3);
      const slideYStr = slideY.toFixed(1);
      const scaleStr = scale.toFixed(3);

      const { el, glassCard, glassFadeInner, glassShimmer, officialLogoYear } = item;

      const mouseKey = idx === 2 && !isMobileDevice ? `${(mouseX*10).toFixed(0)}_${(mouseY*10).toFixed(0)}` : '0_0';
      const cacheKey = `${visStr}_${slideYStr}_${scaleStr}_${mouseKey}`;
      if (cacheKey === item.lastRenderKey) {
        return;
      }
      item.lastRenderKey = cacheKey;

      const isVisible = vis > 0.001;

      el.style.opacity = '1';
      el.style.visibility = isVisible ? 'visible' : 'hidden';
      el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';

      let transformStr = `translate3d(0, ${slideYStr}px, 0)`;
      if (scale !== 1.0) {
        transformStr += ` scale(${scaleStr})`;
      }

      if (idx === 2 && !isMobileDevice && isVisible) {
        const tiltX = -mouseY * 2.2 * vis;
        const tiltY = mouseX * 2.2 * vis;
        transformStr += ` perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }

      if (glassCard) {
        el.style.transform = 'none';

        const glassSurfaceVis = Math.round(vis * 50) / 50;
        const glassSurfaceKey = glassSurfaceVis.toFixed(2);
        if (glassSurfaceKey !== item.lastGlassSurfaceKey) {
          item.lastGlassSurfaceKey = glassSurfaceKey;
          glassCard.style.opacity = glassSurfaceKey;
        }

        const glassContentTransform = `translate3d(0, ${slideYStr}px, 0)`;
        if (glassFadeInner) {
          glassFadeInner.style.opacity = '1';
          glassFadeInner.style.transform = glassContentTransform;
        }
        if (glassShimmer) {
          glassShimmer.style.opacity = '1';
          glassShimmer.style.transform = glassContentTransform;
        }
      } else {
        el.style.transform = transformStr;
        const excitedSub = idx === 6 ? el.querySelector<HTMLElement>('.hero-excited-sub') : null;

        Array.from(el.children).forEach((child) => {
          if (excitedSub && child === excitedSub) return;
          (child as HTMLElement).style.opacity = visStr;
        });

        if (excitedSub) {
          const subVis = Math.max(0, (vis - 0.22) / 0.78);
          excitedSub.style.opacity = (subVis * vis).toFixed(3);
          excitedSub.style.transform = `translate3d(0, ${(10 * (1 - subVis)).toFixed(1)}px, 0)`;
        }
      }

      if (idx === 2 && officialLogoYear) {
        const yearVis = Math.max(0, (vis - 0.25) / 0.75);
        officialLogoYear.style.opacity = (yearVis * vis).toFixed(3);
        officialLogoYear.style.transform = `translate3d(0, ${(10 * (1 - yearVis)).toFixed(1)}px, 0)`;
      }
    });

    const nearStep3 = Math.abs(safeRawIndex - 3) <= 0.65;
    if (nearStep3 !== wasNearStep3) {
      wasNearStep3 = nearStep3;
      manageHeroPromoVideo(nearStep3);
    }

    const nearestIdx = Math.round(safeRawIndex);
    sectionDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === nearestIdx);
    });
  }

  function updateProgressUI(pct: number) {
    const rounded = Math.min(Math.max(Math.round(pct), 0), 100);
    if (progressElement) progressElement.textContent = `${rounded}%`;
    if (progressBarElement) progressBarElement.style.width = `${rounded}%`;
  }

  const heroImages = [
    '/logos/magnovie26white.png',
    '/logos/christwhite.png',
    '/logos/magnovite.png',
    '/images/thumbnail.jpg',
    '/images/shaanrahman.jpg'
  ];

  heroImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  function finishLoadingAndWarmup() {
    updateProgressUI(95);
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
  loadingManager.onLoad = () => { finishLoadingAndWarmup(); };
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
            requestHeroFrame();
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

  function updateCameraFov() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.near = 0.1;
    camera.far = 1000;

    if (aspect < 1.4) {
      const refFovRad = (55 * Math.PI) / 180;
      const refAspect = 1.4;
      const hFovRad = 2 * Math.atan(Math.tan(refFovRad / 2) * refAspect);
      const targetFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) / aspect);
      camera.fov = Math.min(82, (targetFovRad * 180) / Math.PI);
    } else {
      camera.fov = 55;
    }
    camera.updateProjectionMatrix();
  }

  updateCameraFov();

  function onWindowResize() {
    isMobileDevice = checkMobile();
    updateCameraFov();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio, 2));
    requestHeroFrame();
  }
  window.addEventListener('resize', onWindowResize);

  let mouseX = 0;
  let mouseY = 0;

  if (!isMobileDevice) {
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      requestHeroFrame();
    }, { passive: true });
  }

  // -----------------------------------------------------------------------
  // HYBRID PROGRESSION ENGINE
  // -----------------------------------------------------------------------
  let currentSmoothRawIndex = 0;
  let targetScrollIndex = 2.0;
  let autoProgress = 0;
  let autoSequenceComplete = false;

  let lastFrameTime = performance.now();
  let heroFrameRequested = false;

  window.addEventListener('scroll', () => {
    if (!autoSequenceComplete) return;

    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollFrac = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    targetScrollIndex = 2.0 + scrollFrac * 5.0;
    requestHeroFrame();
  }, { passive: true });

  function requestHeroFrame() {
    if (heroFrameRequested) return;
    heroFrameRequested = true;
    requestAnimationFrame(renderHeroFrame);
  }

  function renderHeroFrame() {
    heroFrameRequested = false;

    const now = performance.now();
    const deltaSeconds = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    // Ambient spin (never stops)
    ambientSpin += deltaSeconds * 0.12;

    if (!autoSequenceComplete) {
      let stepSpeed = 0.167; // Exact 3-second reading window for Step 0 (0.5 distance / 0.167 speed = ~3.0s)

      if (autoProgress > 0.5 && autoProgress <= 1.25) {
        // Smooth transition through Step 1 ("INTRODUCING")
        stepSpeed = 0.35;
      } else if (autoProgress > 1.25) {
        // Gentle deceleration into Step 2 (MAGNOVITE)
        const decelFactor = 1.0 - ((autoProgress - 1.25) / 0.75);
        stepSpeed = 0.12 + (0.23 * Math.max(decelFactor, 0));
      }

      autoProgress += deltaSeconds * stepSpeed;

      if (autoProgress >= 2.0) {
        autoProgress = 2.0;
        autoSequenceComplete = true;
      }
      currentSmoothRawIndex = autoProgress;
    } else {
      const diff = targetScrollIndex - currentSmoothRawIndex;
      currentSmoothRawIndex += diff * Math.min(deltaSeconds * 6.0, 1.0);
    }

    updateFromScroll(currentSmoothRawIndex);

    const interactiveCamPos = currentCamPos.clone();
    if (!isMobileDevice) {
      interactiveCamPos.x += mouseX * 0.006;
      interactiveCamPos.y += -mouseY * 0.006;
    }

    camera.position.copy(interactiveCamPos);
    camera.lookAt(currentCamTarget);

    if (isMobileDevice) {
      renderer.render(scene, camera);
    } else {
      composer.render();
    }

    requestHeroFrame();
  }

  requestHeroFrame();
}

// -----------------------------------------------------------------------
// HERO COUNTDOWN TIMER LOGIC
// -----------------------------------------------------------------------
function initHeroCountdown() {
  const targetDate = new Date('2026-09-15T09:00:00+05:30').getTime();

  function updateDigit(id: string, newDigit: number) {
    const cardEl = document.getElementById(id);
    if (!cardEl) return;

    const currentVal = cardEl.getAttribute('data-val') || '0';
    const nextVal = String(newDigit);

    if (currentVal !== nextVal) {
      cardEl.setAttribute('data-val', nextVal);

      const topSpan = cardEl.querySelector('.flip-top span');
      const bottomSpan = cardEl.querySelector('.flip-bottom span');
      const leafTopSpan = cardEl.querySelector('.flip-leaf-top span');
      const leafBottomSpan = cardEl.querySelector('.flip-leaf-bottom span');

      if (topSpan && bottomSpan && leafTopSpan && leafBottomSpan) {
        leafTopSpan.textContent = currentVal;
        bottomSpan.textContent = currentVal;
        topSpan.textContent = nextVal;
        leafBottomSpan.textContent = nextVal;

        cardEl.classList.remove('is-flipping');
        void cardEl.offsetWidth;
        cardEl.classList.add('is-flipping');

        setTimeout(() => {
          bottomSpan.textContent = nextVal;
        }, 450);
      }
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

let _promoVideoActive = false;
let _promoRestorePending = false;
let _promoContainerSnapshot: string | null = null;

function manageHeroPromoVideo(nearStep3: boolean) {
  const container = document.getElementById('hero-promo-container');
  if (!container) return;

  if (!nearStep3 && _promoVideoActive && !_promoRestorePending) {
    _promoRestorePending = true;
    const iframe = container.querySelector('#hero-promo-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      try {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (_) {}
    }

    setTimeout(() => {
      if (_promoContainerSnapshot) {
        container.innerHTML = _promoContainerSnapshot;
        _promoVideoActive = false;
        initPromoInlinePlayer();
      }
      _promoRestorePending = false;
    }, 80);
  }
}

function initPromoInlinePlayer() {
  const playBtn = document.getElementById('hero-play-promo-btn');
  const container = document.getElementById('hero-promo-container');
  if (!playBtn || !container) return;

  if (!_promoContainerSnapshot) {
    _promoContainerSnapshot = container.innerHTML;
  }

  const newPlayBtn = playBtn.cloneNode(true) as HTMLElement;
  playBtn.parentNode?.replaceChild(newPlayBtn, playBtn);

  newPlayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    _promoVideoActive = true;
    container.innerHTML = `
      <div style="position: relative; width: 100%; aspect-ratio: 16 / 7.5; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 20px 48px rgba(0, 0, 0, 0.8); background: #000;">
        <iframe id="hero-promo-iframe"
                src="https://www.youtube-nocookie.com/embed/EGSUtEnfX9g?autoplay=1&enablejsapi=1&rel=0" 
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

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initNavigation();
  initHeroCountdown();
  initPromoInlinePlayer();
});