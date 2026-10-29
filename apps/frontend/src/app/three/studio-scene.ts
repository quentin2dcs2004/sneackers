import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface StudioBundle {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pedestal: THREE.Group;
  dispose: () => void;
}

export function createStudio(
  host: HTMLElement,
  opts: { fov?: number; camZ?: number; camY?: number } = {},
): StudioBundle {
  const w = host.clientWidth || 640;
  const h = host.clientHeight || 480;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov ?? 32, w / h, 0.1, 100);
  camera.position.set(0, opts.camY ?? 0.95, opts.camZ ?? 4.8);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.42;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(0xffffff, 0xa8a8a8, 0.7);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, 1.85);
  key.position.set(3.2, 5.5, 3.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xe8eef8, 0.65);
  fill.position.set(-3.5, 2.2, 1.5);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 1.05);
  rim.position.set(-1.5, 3.5, -4);
  scene.add(rim);

  const pedestal = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.22, 0.035, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xf4f4f4,
      roughness: 0.42,
      metalness: 0.04,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
      envMapIntensity: 0.35,
    }),
  );
  disc.receiveShadow = true;
  disc.position.y = -0.58;

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 48),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.56;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.006, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.07 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.555;

  pedestal.add(disc, shadow, ring);
  scene.add(pedestal);

  return {
    renderer,
    scene,
    camera,
    pedestal,
    dispose: () => {
      scene.environment = null;
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      pedestal.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => mat.dispose());
        }
      });
    },
  };
}

export function resizeStudio(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  host: HTMLElement,
) {
  const w = host.clientWidth;
  const h = host.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
