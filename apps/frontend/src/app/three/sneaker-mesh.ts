import * as THREE from 'three';

export interface SneakerPalette {
  upper: number;
  midsole: number;
  outsole: number;
  accent: number;
  lace: number;
  tongue: number;
}

const BRAND_PALETTES: Record<string, SneakerPalette> = {
  NOIR: {
    upper: 0x161616,
    midsole: 0xf2eee6,
    outsole: 0x0a0a0a,
    accent: 0xc2a06a,
    lace: 0xe8e3da,
    tongue: 0x1f1f1f,
  },
  KINETIC: {
    upper: 0x101812,
    midsole: 0xd4ff2e,
    outsole: 0x0b0b0b,
    accent: 0xf0f0f0,
    lace: 0xe2ff75,
    tongue: 0x162018,
  },
  FLUX: {
    upper: 0xb59574,
    midsole: 0xf6f3ee,
    outsole: 0x1c1712,
    accent: 0x4fa9c8,
    lace: 0xffffff,
    tongue: 0xa48466,
  },
  ATELIER: {
    upper: 0x272d35,
    midsole: 0xffffff,
    outsole: 0x0f0f0f,
    accent: 0xad8a52,
    lace: 0xffffff,
    tongue: 0x333a44,
  },
};

function hashHue(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function paletteFor(brand: string, colorway: string, slug: string): SneakerPalette {
  const base = BRAND_PALETTES[brand.toUpperCase()] ?? BRAND_PALETTES['ATELIER'];
  const accent = new THREE.Color().setHSL(hashHue(`${slug}-${colorway}`) / 360, 0.48, 0.5);
  return { ...base, accent: accent.getHex() };
}

type Phys = Partial<THREE.MeshPhysicalMaterialParameters>;

function mat(color: number, extra: Phys = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.52,
    metalness: 0.03,
    envMapIntensity: 0.45,
    ...extra,
  });
}

function put(
  parent: THREE.Group,
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  pos: [number, number, number],
  rot: [number, number, number] = [0, 0, 0],
  scale?: [number, number, number],
) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function soleShape(sx = 1, sz = 1) {
  const s = new THREE.Shape();
  s.moveTo(-1.0 * sx, 0);
  s.bezierCurveTo(-1.02 * sx, 0.32 * sz, -0.45 * sx, 0.4 * sz, 0.15 * sx, 0.42 * sz);
  s.bezierCurveTo(0.65 * sx, 0.4 * sz, 1.0 * sx, 0.26 * sz, 1.12 * sx, 0.06 * sz);
  s.bezierCurveTo(1.16 * sx, 0.02 * sz, 1.16 * sx, -0.02 * sz, 1.12 * sx, -0.06 * sz);
  s.bezierCurveTo(1.0 * sx, -0.26 * sz, 0.65 * sx, -0.4 * sz, 0.15 * sx, -0.42 * sz);
  s.bezierCurveTo(-0.45 * sx, -0.4 * sz, -1.02 * sx, -0.32 * sz, -1.0 * sx, 0);
  return s;
}

/** Side silhouette — continuous sneaker outline. */
function bodyShape() {
  const s = new THREE.Shape();
  // heel bottom → toe → vamp → collar → heel
  s.moveTo(-1.0, 0.0);
  s.lineTo(1.05, 0.0);
  s.bezierCurveTo(1.18, 0.0, 1.22, 0.1, 1.14, 0.22);
  s.bezierCurveTo(1.0, 0.4, 0.65, 0.44, 0.32, 0.4);
  s.lineTo(0.12, 0.55);
  s.bezierCurveTo(-0.05, 0.72, -0.35, 0.74, -0.58, 0.62);
  s.bezierCurveTo(-0.82, 0.5, -0.98, 0.28, -1.02, 0.1);
  s.bezierCurveTo(-1.04, 0.04, -1.03, 0.0, -1.0, 0.0);
  return s;
}

function layer(shape: THREE.Shape, thickness: number, y: number, material: THREE.Material, bevel = 0.01) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.65,
    bevelSegments: 3,
    curveSegments: 40,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function stripe(z: number, material: THREE.Material) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.55, 0.12, z),
    new THREE.Vector3(-0.05, 0.2, z * 1.02),
    new THREE.Vector3(0.45, 0.14, z),
    new THREE.Vector3(0.85, 0.02, z * 0.75),
  ]);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.018, 8, false), material);
}

/** Clean premium procedural sneaker. */
export function createSneakerMesh(brand: string, colorway: string, slug: string): THREE.Group {
  const p = paletteFor(brand, colorway, slug);
  const shoe = new THREE.Group();
  shoe.name = `sneaker-${slug}`;

  const outsole = mat(p.outsole, { roughness: 0.9, envMapIntensity: 0.2 });
  const midsole = mat(p.midsole, { roughness: 0.7, clearcoat: 0.12, envMapIntensity: 0.35 });
  const upper = mat(p.upper, {
    roughness: 0.46,
    clearcoat: 0.16,
    clearcoatRoughness: 0.42,
    sheen: 0.2,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(0xffffff),
  });
  const tongue = mat(p.tongue, { roughness: 0.62 });
  const accent = mat(p.accent, {
    roughness: 0.26,
    metalness: 0.2,
    clearcoat: 0.65,
    clearcoatRoughness: 0.15,
    envMapIntensity: 0.65,
  });
  const lace = mat(p.lace, { roughness: 0.72, envMapIntensity: 0.25 });
  const eyelet = mat(0x2a2a2a, { roughness: 0.22, metalness: 0.9, envMapIntensity: 0.85 });

  // Unified sole → mid → body (no floating gaps)
  shoe.add(layer(soleShape(1.03, 1.04), 0.05, -0.08, outsole, 0.008));
  shoe.add(layer(soleShape(0.99, 0.98), 0.08, 0.0, midsole, 0.01));

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape(), {
    depth: 0.7,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.028,
    bevelSegments: 4,
    curveSegments: 48,
  });
  bodyGeo.translate(0, 0, -0.35);
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, upper);
  body.position.y = 0.02;
  body.castShadow = true;
  body.receiveShadow = true;
  shoe.add(body);

  // Heel brand capsule — flush in midsole
  put(shoe, new THREE.CapsuleGeometry(0.075, 0.18, 5, 12), accent, [-0.5, 0.02, 0], [0, 0, Math.PI / 2], [1, 0.7, 0.6]);

  // Collar
  put(shoe, new THREE.TorusGeometry(0.24, 0.04, 10, 32), midsole, [-0.52, 0.58, 0], [Math.PI / 2, 0, 0.35], [1.02, 1, 0.88]);

  // Tongue
  const tongueMesh = put(shoe, new THREE.BoxGeometry(0.42, 0.04, 0.3), tongue, [0.0, 0.5, 0], [0, 0, -0.38]);
  tongueMesh.geometry.translate(0.1, 0, 0);

  // Side accents flush on body
  const aR = stripe(0.36, accent);
  aR.castShadow = true;
  shoe.add(aR);
  const aL = stripe(-0.36, accent);
  aL.castShadow = true;
  shoe.add(aL);

  // Laces
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const x = -0.18 + t * 0.58;
    const y = 0.46 - t * 0.06;
    const z = 0.2;
    put(shoe, new THREE.TorusGeometry(0.018, 0.005, 6, 12), eyelet, [x, y, z], [0, Math.PI / 2, 0]);
    put(shoe, new THREE.TorusGeometry(0.018, 0.005, 6, 12), eyelet, [x, y, -z], [0, Math.PI / 2, 0]);
    const laceCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, y + 0.008, z),
      new THREE.Vector3(x + 0.04, y + 0.035, 0),
      new THREE.Vector3(x + 0.08, y + 0.008, -z),
    ]);
    const laceMesh = new THREE.Mesh(new THREE.TubeGeometry(laceCurve, 16, 0.009, 6, false), lace);
    laceMesh.castShadow = true;
    shoe.add(laceMesh);
  }

  shoe.rotation.set(-0.2, Math.PI * 0.32, 0.05);
  return shoe;
}
