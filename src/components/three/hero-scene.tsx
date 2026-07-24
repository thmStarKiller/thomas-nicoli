"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

/* Ashima / Ian McEwan simplex noise 3D (webgl-noise) — compact form */
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisp;
${SNOISE}
float displacement(vec3 p) {
  float t = uTime * 0.28;
  float n = snoise(p * uFreq + vec3(t, t * 0.8, -t * 0.6));
  n += 0.45 * snoise(p * uFreq * 2.3 + vec3(-t * 1.3, t, t * 0.7));
  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}
void main() {
  vec3 pos = position;
  float d = displacement(pos);
  vDisp = d;
  vec3 displaced = pos + normal * d * uAmp;

  // Recompute normal from displaced neighbours
  float eps = 0.08;
  vec3 t1 = orthogonal(normal);
  vec3 t2 = normalize(cross(normal, t1));
  vec3 pA = pos + t1 * eps;
  vec3 pB = pos + t2 * eps;
  vec3 dA = pA + normal * displacement(pA) * uAmp;
  vec3 dB = pB + normal * displacement(pB) * uAmp;
  vNormal = normalize(cross(dA - displaced, dB - displaced));

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uCobalt;
uniform vec3 uSheen;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDisp;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fresnel = pow(1.0 - ndv, 2.6);

  // Deep ink body, slightly lifted where the surface bulges outward
  float bulge = smoothstep(-0.4, 1.0, vDisp);
  vec3 base = mix(uInk, uInk * 1.9 + vec3(0.02), bulge * 0.55);

  // Cobalt rim — the signature glow
  vec3 color = base + uCobalt * fresnel * 1.35;

  // Cool porcelain sheen sweeping with time
  float sheenBand = smoothstep(0.55, 1.0, sin(vWorldPos.y * 2.0 + uTime * 0.5) * 0.5 + 0.5);
  color += uSheen * sheenBand * fresnel * 0.35;

  // Subtle top light
  float top = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
  color += vec3(0.03, 0.035, 0.05) * top;

  gl_FragColor = vec4(color, 1.0);
}
`;

const BLOB_UNIFORMS = {
  uTime: { value: 0 },
  uAmp: { value: 0.32 },
  uFreq: { value: 0.9 },
  uInk: { value: new THREE.Color("#191920") },
  uCobalt: { value: new THREE.Color("#2f4bff") },
  uSheen: { value: new THREE.Color("#e8e4da") },
};

function Blob() {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime.value += delta;
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      // Gentle pointer parallax
      const targetX = pointer.y * 0.18;
      const targetZ = pointer.x * 0.14;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.045;
      group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.045;
      group.current.position.y = Math.sin((material?.uniforms.uTime.value ?? 0) * 0.5) * 0.07;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.55, 96]} />
        <shaderMaterial
          ref={materialRef}
          args={[{ vertexShader: VERT, fragmentShader: FRAG, uniforms: BLOB_UNIFORMS }]}
        />
      </mesh>
      {/* Orbital chrome ring */}
      <mesh rotation={[Math.PI / 2.35, 0.35, 0]}>
        <torusGeometry args={[2.35, 0.016, 16, 220]} />
        <meshStandardMaterial color="#c9c4b8" metalness={1} roughness={0.22} />
      </mesh>
      {/* Cobalt satellite */}
      <mesh position={[2.35, 0.1, 0]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial
          color="#2f4bff"
          emissive="#2f4bff"
          emissiveIntensity={2.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor />
      <AdaptiveDpr pixelated={false} />
      <Blob />
      {/* Procedural lighting only — no remote HDR files */}
      <Environment resolution={256}>
        <Lightformer intensity={1.6} position={[4, 3, 4]} scale={[6, 6, 1]} color="#f2ede2" />
        <Lightformer intensity={2.4} position={[-5, 1, 2]} scale={[4, 8, 1]} color="#3d5bff" />
        <Lightformer intensity={1.1} position={[0, -4, 3]} scale={[8, 3, 1]} color="#8fa2ff" />
      </Environment>
    </Canvas>
  );
}
