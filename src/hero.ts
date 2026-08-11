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
  
  // Pure Neutral Obsidian Space Background & Fog (0 blue tint)
  const spaceBgColor = 0x040404;
  scene.background = new THREE.Color(spaceBgColor);
  scene.fog = new THREE.FogExp2(0x060606, 0.0075);

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
  renderer.toneMappingExposure = 0.65;

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.14, // strength tuned for subtle luxury cosmic glow without over-exposure
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
  motionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    requestHeroFrame();
  });

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
  let wasNearStep3: boolean | null = null;

  // Lock the initial viewport height so mobile browser-chrome hide/show
  // (address bar collapsing on first scroll) doesn't jump rawIndex.
  // We capture height ASAP before any chrome animation fires.
  let stableViewportHeight = window.innerHeight;
  let cachedMaxScroll = Math.max(document.body.scrollHeight - stableViewportHeight, 1);

  // Suppress resize-based recalculation for the first 1.5 s on mobile.
  // The address bar hides within ~400 ms of the first scroll; after that
  // the new stable height is safe to use.
  let _scrollStabilized = !isMobileDevice;
  setTimeout(() => { _scrollStabilized = true; }, 1500);

  function recalculateMaxScroll() {
    if (!_scrollStabilized) return; // ignore chrome-hide resize on mobile
    stableViewportHeight = window.innerHeight;
    cachedMaxScroll = Math.max(document.body.scrollHeight - stableViewportHeight, 1);
  }

  window.addEventListener('resize', recalculateMaxScroll, { passive: true });

  function updateRawIndexFromScroll() {
    if (!cachedMaxScroll || cachedMaxScroll <= 1) {
      recalculateMaxScroll();
    }
    const scrollFrac = Math.min(Math.max(window.scrollY / cachedMaxScroll, 0), 1);
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

      // Skip DOM mutation if state has not changed
      const mouseKey = idx === 2 && !isMobileDevice ? `${(mouseX*10).toFixed(0)}_${(mouseY*10).toFixed(0)}` : '0_0';
      const cacheKey = `${visStr}_${slideYStr}_${scaleStr}_${mouseKey}`;
      if (cacheKey === item.lastRenderKey) {
        return;
      }
      item.lastRenderKey = cacheKey;

      const isVisible = vis > 0.001;

      // *** CRITICAL: The wrapper (.hero-card-step) MUST stay at opacity:1 ***
      // Setting opacity < 1 on the wrapper creates a CSS stacking context that
      // prevents backdrop-filter on child glass cards from sampling the WebGL canvas.
      // Instead we always keep wrapper at opacity:1 and only set visibility/transform.
      el.style.opacity = '1';
      el.style.visibility = isVisible ? 'visible' : 'hidden';
      el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';

      // Pure GPU hardware-accelerated 3D transform (zero CPU layout reflow)
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
        // Fade the glass element itself, never its wrapper. A wrapper opacity
        // creates a backdrop root that hides the canvas from the child filter;
        // direct card opacity keeps the frosted WebGL blur intact.
        //
        // Quantizing to 2% avoids modifying the large filtered surface on every
        // scroll frame, while keeping the card/text fade visually continuous.
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
        // Non-glass cards: fade top-level children; step 6 subtext trails in after main line
        const excitedSub = idx === 6
          ? el.querySelector<HTMLElement>('.hero-excited-sub')
          : null;

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

    // Pause/remove the promo only when crossing the step boundary. Calling this
    // on every animation frame can queue many DOM restores while scrolling away.
    const nearStep3 = Math.abs(rawIndex - 3) <= 0.65;
    if (nearStep3 !== wasNearStep3) {
      wasNearStep3 = nearStep3;
      manageHeroPromoVideo(nearStep3);
    }

    const nearestIdx = Math.round(rawIndex);
    sectionDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === nearestIdx);
    });

    if (scrollBar) scrollBar.style.height = `${scrollFrac * 100}%`;
  }

  window.addEventListener('scroll', () => {
    updateRawIndexFromScroll();
    requestHeroFrame();
  }, { passive: true });

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
    if (aspect < 1.4) {
      // Maintain horizontal field of view across portrait and narrow aspect ratios so background model/galaxy remains prominent
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
    updateRawIndexFromScroll();
    requestHeroFrame();
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
      requestHeroFrame();
    }, { passive: true });
  }

  const smoothCamPos    = currentCamPos.clone();
  const smoothCamTarget = currentCamTarget.clone();
  const interactiveCamPos = currentCamPos.clone();
  let   smoothModelRotY = 0;
  let heroFrameRequested = false;

  function requestHeroFrame() {
    if (heroFrameRequested) return;
    heroFrameRequested = true;
    requestAnimationFrame(renderHeroFrame);
  }

  function renderHeroFrame() {
    heroFrameRequested = false;

    const rawDelta = targetRawIndex - currentSmoothRawIndex;
    const hasPendingScroll = Math.abs(rawDelta) > 0.0001;
    if (hasPendingScroll) {
      currentSmoothRawIndex += rawDelta * (isReducedMotion ? 1.0 : 0.038);
    } else {
      currentSmoothRawIndex = targetRawIndex;
    }

    let hasPendingMouse = false;
    if (!isMobileDevice) {
      const mouseDeltaX = targetMouseX - mouseX;
      const mouseDeltaY = targetMouseY - mouseY;
      hasPendingMouse = Math.abs(mouseDeltaX) > 0.0005 || Math.abs(mouseDeltaY) > 0.0005;
      if (hasPendingMouse) {
        mouseX += mouseDeltaX * 0.05;
        mouseY += mouseDeltaY * 0.05;
      } else {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
      }
    }

    updateFromScroll(currentSmoothRawIndex);

    const cameraSpeed = isReducedMotion ? 1.0 : 0.05;
    const hasPendingCamera =
      smoothCamPos.distanceToSquared(currentCamPos) > 0.00000001 ||
      smoothCamTarget.distanceToSquared(currentCamTarget) > 0.00000001 ||
      Math.abs(currentModelRotY - smoothModelRotY) > 0.00001;

    if (hasPendingCamera) {
      smoothCamPos.lerp(currentCamPos, cameraSpeed);
      smoothCamTarget.lerp(currentCamTarget, cameraSpeed);
      smoothModelRotY += (currentModelRotY - smoothModelRotY) * cameraSpeed;
    } else {
      smoothCamPos.copy(currentCamPos);
      smoothCamTarget.copy(currentCamTarget);
      smoothModelRotY = currentModelRotY;
    }

    interactiveCamPos.copy(smoothCamPos);
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

    if (hasPendingScroll || hasPendingMouse || hasPendingCamera) {
      requestHeroFrame();
    }
  }

  updateRawIndexFromScroll();
  currentSmoothRawIndex = targetRawIndex;
  updateFromScroll(currentSmoothRawIndex);
  requestHeroFrame();
}

// -----------------------------------------------------------------------
// HERO COUNTDOWN TIMER LOGIC (Pure Platinum & Liquid Silver Palette)
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
        // Set flap numbers for mechanical 3D drop
        leafTopSpan.textContent = currentVal;
        bottomSpan.textContent = currentVal;
        topSpan.textContent = nextVal;
        leafBottomSpan.textContent = nextVal;

        cardEl.classList.remove('is-flipping');
        void cardEl.offsetWidth; // Trigger reflow
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

// Track whether the promo video (iframe) is currently playing
let _promoVideoActive = false;
let _promoRestorePending = false;
let _promoContainerSnapshot: string | null = null; // original thumbnail HTML

function manageHeroPromoVideo(nearStep3: boolean) {
  const container = document.getElementById('hero-promo-container');
  if (!container) return;

  if (!nearStep3 && _promoVideoActive && !_promoRestorePending) {
    // ── Scrolled away: kill iframe to stop audio completely ─────────────────
    _promoRestorePending = true;
    const iframe = container.querySelector('#hero-promo-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      // Try postMessage pause first (graceful)
      try {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (_) {}
    }

    // Then remove iframe from DOM to guarantee silence on mobile. The pending
    // guard prevents a scrolling render loop from scheduling duplicate restores.
    setTimeout(() => {
      if (_promoContainerSnapshot) {
        container.innerHTML = _promoContainerSnapshot;
        _promoVideoActive = false;
        initPromoInlinePlayer(); // re-bind click handler
      }
      _promoRestorePending = false;
    }, 80);
  }
}

function initPromoInlinePlayer() {
  const playBtn = document.getElementById('hero-play-promo-btn');
  const container = document.getElementById('hero-promo-container');
  if (!playBtn || !container) return;

  // Snapshot the original thumbnail HTML so we can restore it later
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

import { initNavigation } from './navigation';

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initNavigation();
  initHeroCountdown();
  initPromoInlinePlayer();
});
