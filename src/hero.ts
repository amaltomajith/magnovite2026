import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// -----------------------------------------------------------------------
// Creates a soft radial glow sprite on a canvas.
// Fades smoothly from center to edge so particles render as soft round stars.
// -----------------------------------------------------------------------
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
  
  // 1. VOLUMETRIC FOG & LIFTED BLUE-GREY SPACE BACKGROUND
  const spaceBgColor = 0x0e1220;
  scene.background = new THREE.Color(spaceBgColor);
  scene.fog = new THREE.FogExp2(0x1a1e2e, 0.007);

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

  // Color space setting & ACESFilmicToneMapping highlight roll-off
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  // -----------------------------------------------------------------------
  // BLOOM POST-PROCESSING
  // -----------------------------------------------------------------------
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,  // strength ~0.5
    0.35, // radius ~0.35
    0.80  // threshold ~0.80
  );
  composer.addPass(bloomPass);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  // Reduced Motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => { isReducedMotion = e.matches; });

  const starSprite = createStarSprite();

  // Active Scene Layer References
  let baseStarSize = 0.012;
  let activePointsMat: THREE.PointsMaterial | null = null;
  let activeAmbientGlowMat: THREE.PointsMaterial | null = null;
  let mainStarPointsObj: THREE.Points | null = null;

  // -----------------------------------------------------------------------
  // EXTENDED SCROLL-DRIVEN CAMERA KEYFRAMES (Deep Zoom Trajectory)
  // -----------------------------------------------------------------------
  const sections: Array<{
    camPos: THREE.Vector3;
    camTarget: THREE.Vector3;
    modelRotY: number;
    label: string;
    subtext: string;
  }> = [
    {
      camPos:    new THREE.Vector3(0, 1.2, 14),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: 0,
      label:     'ARE YOU EXCITED?',
      subtext:   'Something extraordinary is on its way.'
    },
    {
      camPos:    new THREE.Vector3(0.3, 0.5, 8),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: -0.1,
      label:     'THE UNVEILING',
      subtext:   'Approaching.'
    },
    {
      camPos:    new THREE.Vector3(-0.2, 0.15, 3.5),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: 0.07,
      label:     'ENTER THE CORE',
      subtext:   'Feel the pull.'
    },
    {
      camPos:    new THREE.Vector3(0.05, 0.05, 0.8),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: -0.02,
      label:     'INSIDE THE CORE',
      subtext:   'Approaching the white core cluster.'
    },
    {
      camPos:    new THREE.Vector3(0.0, 0.01, 0.08),
      camTarget: new THREE.Vector3(0, 0, 0),
      modelRotY: 0.01,
      label:     'CORE THRESHOLD',
      subtext:   'At the cluster boundary.'
    },
    {
      camPos:    new THREE.Vector3(0.0, 0.002, 0.005),
      camTarget: new THREE.Vector3(0, 0, -0.05),
      modelRotY: 0.03,
      label:     'DEEP COSMOS',
      subtext:   'Diving directly into the core particles.'
    },
    {
      camPos:    new THREE.Vector3(0.0, -0.005, -0.15),
      camTarget: new THREE.Vector3(0, 0, -0.3),
      modelRotY: 0.05,
      label:     'BEYOND THE HORIZON',
      subtext:   'Flying through the inner heart of the galaxy.'
    },
    {
      camPos:    new THREE.Vector3(0.0, -0.05, -1.2),
      camTarget: new THREE.Vector3(0, 0, -2.5),
      modelRotY: 0.08,
      label:     'INFINITE EXPENSE',
      subtext:   'Emerging into deep space beyond.'
    }
  ];

  const currentCamPos    = sections[0].camPos.clone();
  const currentCamTarget = sections[0].camTarget.clone();
  let   currentModelRotY = 0;

  const sectionLabel   = document.getElementById('section-label');
  const sectionSubtext = document.getElementById('section-subtext');
  let lastSectionIndex = -1;

  function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function updateFromScroll() {
    const maxScroll    = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollFrac   = Math.min(window.scrollY / maxScroll, 1);
    const totalSections = sections.length - 1;
    const rawIndex     = scrollFrac * totalSections;
    const fromIdx      = Math.floor(rawIndex);
    const toIdx        = Math.min(fromIdx + 1, totalSections);
    const t            = easeInOut(rawIndex - fromIdx);

    const from = sections[fromIdx];
    const to   = sections[toIdx];

    currentCamPos.lerpVectors(from.camPos, to.camPos, t);
    currentCamTarget.lerpVectors(from.camTarget, to.camTarget, t);
    currentModelRotY = from.modelRotY + (to.modelRotY - from.modelRotY) * t;

    // Dynamic Proximity Control: Scale down particle size & opacity on close zoom
    if (activePointsMat) {
      const closeProximity = Math.max((scrollFrac - 0.55) / 0.45, 0); // 0 at 55% scroll, 1 at 100% scroll
      const sizeScale = 1.0 - closeProximity * 0.45;     // 1.0 -> 0.55
      const opacityScale = 1.0 - closeProximity * 0.35;  // 1.0 -> 0.65

      activePointsMat.size = baseStarSize * sizeScale;
      activePointsMat.opacity = opacityScale;

      if (activeAmbientGlowMat) {
        activeAmbientGlowMat.size = baseStarSize * 3.5 * sizeScale;
        activeAmbientGlowMat.opacity = 0.12 * opacityScale;
      }
    }

    const nearestSection = Math.round(rawIndex);
    if (nearestSection !== lastSectionIndex) {
      lastSectionIndex = nearestSection;
      const s = sections[nearestSection];
      if (sectionLabel) {
        sectionLabel.classList.remove('visible');
        setTimeout(() => {
          if (sectionLabel) {
            sectionLabel.textContent = s.label;
            sectionLabel.classList.add('visible');
          }
          if (sectionSubtext) sectionSubtext.textContent = s.subtext;
        }, 80);
      }
    }
  }

  window.addEventListener('scroll', updateFromScroll, { passive: true });

  // Loading Manager
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

            // Center the model
            const box    = new THREE.Box3().setFromObject(heroModel);
            const center = box.getCenter(new THREE.Vector3());
            heroModel.position.sub(center);

            // Compute star particle base size
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

                  // Saturation boost & distant point brightness attenuation
                  const tempColor = new THREE.Color();
                  const hsl = { h: 0, s: 0, l: 0 };

                  for (let i = 0; i < count; i++) {
                    const x = posAttr.getX(i);
                    const y = posAttr.getY(i);
                    const z = posAttr.getZ(i);
                    const dist = Math.sqrt(x * x + y * y + z * z);

                    // Boost saturation
                    tempColor.setRGB(colorAttr.getX(i), colorAttr.getY(i), colorAttr.getZ(i));
                    tempColor.getHSL(hsl);
                    hsl.s = Math.min(hsl.s * 1.6, 1.0);
                    tempColor.setHSL(hsl.h, hsl.s, hsl.l);

                    // Radial attenuation for distant background stars (> 12 units)
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

                // Soft ambient particle glow layer
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
        console.info('[Hero] hero.glb not found. Add it to /public/models/.');
        if (loaderElement) loaderElement.classList.add('hidden');
      }
    })
    .catch(() => { if (loaderElement) loaderElement.classList.add('hidden'); });

  // Resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener('resize', onWindowResize);

  // Smooth camera state
  const smoothCamPos    = currentCamPos.clone();
  const smoothCamTarget = currentCamTarget.clone();
  let   smoothModelRotY = 0;

  updateFromScroll();
  if (sectionLabel) {
    sectionLabel.textContent = sections[0].label;
    sectionLabel.classList.add('visible');
  }
  if (sectionSubtext) sectionSubtext.textContent = sections[0].subtext;

  // Render Loop
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

import { initNavigation } from './navigation';

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initNavigation();
});
