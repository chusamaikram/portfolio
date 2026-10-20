import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Reusable quaternion to avoid garbage collection in animation loop
const _parentQuat = new THREE.Quaternion();

// 6 Core Engineering Stack Nodes with Authentic Parent Brand Colors & Pure Symbols
const TECH_NODES = [
  {
    id: 'react',
    symbol: '⚛',
    color: '#61dafb', // React Cyan
    pos: [0.0, 1.25, 0.86],
    fontSize: 96,
  },
  {
    id: 'js',
    symbol: 'JS',
    color: '#f7df1e', // JavaScript Amber Yellow
    pos: [1.30, 0.38, 0.70],
    fontSize: 84,
  },
  {
    id: 'python',
    symbol: 'PY',
    color: '#38bdf8', // Python Electric Sky Blue
    pos: [-1.28, 0.40, 0.74],
    fontSize: 84,
  },
  {
    id: 'nodejs',
    symbol: 'NODE',
    color: '#22c55e', // Node.js Emerald Green
    pos: [1.02, -0.96, 0.68],
    fontSize: 60,
  },
  {
    id: 'html5',
    symbol: 'HTML',
    color: '#f97316', // HTML5 Warm Orange
    pos: [-1.00, -0.96, 0.70],
    fontSize: 60,
  },
  {
    id: 'database',
    symbol: 'SQL',
    color: '#a855f7', // Postgres / SQL Violet
    pos: [0.0, -0.20, -1.52],
    fontSize: 72,
  },
];

// Helper to generate a pristine, compact 256x256 circular-squircle badge texture
function createNodeBadgeTexture(node) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = 256;
  const h = 256;
  const pad = 16;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const r = 56; // Smooth modern squircle radius

  // 1. Dark semi-translucent glass background
  const bgGrad = ctx.createLinearGradient(pad, pad, w - pad, h - pad);
  bgGrad.addColorStop(0, 'rgba(8, 16, 36, 0.94)');
  bgGrad.addColorStop(1, 'rgba(3, 7, 18, 0.98)');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(pad, pad, innerW, innerH, r);
  ctx.fill();

  // 2. Outer neon border in parent color with soft luminous halo
  ctx.strokeStyle = node.color;
  ctx.lineWidth = 6;
  ctx.shadowColor = node.color;
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow

  // 3. Subtle inner cyber bezel
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pad + 8, pad + 8, innerW - 16, innerH - 16, r - 6);
  ctx.stroke();

  // 4. Subtle corner cyber tick accents
  ctx.strokeStyle = node.color;
  ctx.lineWidth = 3;
  const tickLen = 14;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(pad + 18, pad + 10);
  ctx.lineTo(pad + 18 + tickLen, pad + 10);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(w - pad - 18 - tickLen, h - pad - 10);
  ctx.lineTo(w - pad - 18, h - pad - 10);
  ctx.stroke();

  // 5. Centered pure symbol in parent color with crisp font
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${node.fontSize}px "JetBrains Mono", "SF Pro Display", Inter, -apple-system, sans-serif`;

  // Soft parent color glow behind text
  ctx.shadowColor = node.color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(node.symbol, w / 2, h / 2 + (node.id === 'react' ? -2 : 2));

  // Crisp colored core overlay for true parent color vibrancy
  ctx.shadowBlur = 0;
  ctx.fillStyle = node.color;
  ctx.fillText(node.symbol, w / 2, h / 2 + (node.id === 'react' ? -2 : 2));

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Generate Holographic Globe Particle Shell Coordinates
function createGlobeParticleData(count = 1100, radius = 1.28) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phiSpan = Math.PI * (3 - Math.sqrt(5)); // Golden angle for Fibonacci sphere

  const cyan = new THREE.Color('#00f5ff');
  const sky = new THREE.Color('#38bdf8');
  const deepBlue = new THREE.Color('#1d4ed8');

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y);
    const theta = phiSpan * i;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Subtle organic radial perturbation
    const perturb = (Math.random() - 0.5) * 0.05;
    const finalR = radius + perturb;

    positions[i * 3] = x * finalR;
    positions[i * 3 + 1] = y * finalR;
    positions[i * 3 + 2] = z * finalR;

    // Color gradient across latitude
    let col = cyan;
    if (Math.abs(y) > 0.65) {
      col = deepBlue;
    } else if (Math.abs(y) > 0.3) {
      col = sky;
    }
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  return { positions, colors };
}

// 3D Reusable Individual Tech Node Badge with True World-Space Camera Billboarding
const TechNodeBadge = ({ node, texture }) => {
  const badgeRef = useRef(null);

  // Line tethered from core to node anchor
  const tetherLine = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(node.pos[0] * 0.88, node.pos[1] * 0.88, node.pos[2] * 0.88),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [node.pos]);

  useFrame(({ camera }) => {
    if (badgeRef.current && badgeRef.current.parent) {
      // True world-space billboarding: Invert parent group rotation so badge ALWAYS faces the camera 100% flat
      badgeRef.current.parent.getWorldQuaternion(_parentQuat);
      badgeRef.current.quaternion.copy(_parentQuat.invert().multiply(camera.quaternion));
    }
  });

  return (
    <group position={node.pos}>
      {/* Laser tether to center */}
      <line geometry={tetherLine}>
        <lineBasicMaterial color={node.color} transparent opacity={0.3} />
      </line>

      {/* Anchor point glow dot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={node.color} />
      </mesh>

      {/* Billboarding compact symbol card */}
      <group ref={badgeRef}>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
            depthTest={false}
          />
        </mesh>

        {/* Soft parent-color aura halo behind badge */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.52, 0.52]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.22}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
};

// 3D Holographic Globe Component with Continuous 360 Spin & 360 Cursor Drag/Tracking
const HolographicTechGlobe = ({ pointerRef, dragRotationRef }) => {
  const groupRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);

  // Pre-generate particle shells & textures
  const { positions, colors } = useMemo(() => createGlobeParticleData(1100, 1.28), []);
  const textures = useMemo(() => {
    const map = {};
    TECH_NODES.forEach((n) => {
      map[n.id] = createNodeBadgeTexture(n);
    });
    return map;
  }, []);

  useFrame((state, delta) => {
    // 1. Continuous smooth 360 revolution + 360 interactive drag & cursor reaction
    if (groupRef.current) {
      // Gentle constant auto-revolution
      dragRotationRef.current.y += delta * 0.28;

      // 360-degree cursor reaction (smooth lerp, stationary on scroll)
      const targetRotX = dragRotationRef.current.x + pointerRef.current.y * 0.35;
      const targetRotY = dragRotationRef.current.y + pointerRef.current.x * 0.35;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
    }

    // 2. Orbital Cyber Rings Precession
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.5;
    if (ring3Ref.current) ring3Ref.current.rotation.x += delta * 0.35;
  });

  return (
    // Shifted slightly upward (y = 0.36) to align visually with the Hero headline
    <group ref={groupRef} position={[0, 0.36, 0]}>
      {/* 1. Holographic Fibonacci Particle Shell */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.040}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Soft Inner Radiant Energy Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.22} />
      </mesh>

      {/* 3. Coordinate Orbital Rings */}
      {/* Equatorial Ring */}
      <group ref={ring1Ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.32, 1.35, 80]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.32} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Tilted Ring 1 (~45 deg) */}
      <group ref={ring2Ref} rotation={[0.7, 0.5, 0]}>
        <mesh>
          <ringGeometry args={[1.42, 1.45, 80]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.24} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Counter-tilted Ring 2 (~-35 deg) */}
      <group ref={ring3Ref} rotation={[-0.6, -0.4, 0]}>
        <mesh>
          <ringGeometry args={[1.52, 1.55, 80]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 4. 6 Programming Language Symbol Nodes in Parent Colors */}
      {TECH_NODES.map((node) => (
        <TechNodeBadge
          key={node.id}
          node={node}
          texture={textures[node.id]}
        />
      ))}

      {/* Core illumination */}
      <pointLight color="#00f5ff" intensity={2.0} distance={5} />
    </group>
  );
};

// Main Export Component with 360-Degree Cursor Reactivity & Drag Spin
export const TechGlobeHologram = () => {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef({ x: 0.12, y: -0.2 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // 360-degree interactive drag and cursor reactivity
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current = { x, y };

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      // Rotate 360 degrees horizontally and vertically
      dragRotationRef.current.y += deltaX * 0.009;
      dragRotationRef.current.x += deltaY * 0.009;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="w-full h-[460px] sm:h-[500px] md:h-[540px] lg:h-[580px] -translate-y-4 sm:-translate-y-6 lg:-translate-y-10 relative flex items-center justify-center select-none overflow-visible group cursor-grab active:cursor-grabbing"
      title="Drag in 360° to rotate globe"
    >
      {/* Ambient background soft glow behind globe */}
      <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

      {/* Three.js R3F Canvas Viewport with generous camera distance & FOV to prevent any clipping */}
      <Canvas
        camera={{ position: [0, 0.15, 7.0], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full overflow-visible"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#e0f2fe" />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#0284c7" />

        <HolographicTechGlobe
          pointerRef={pointerRef}
          dragRotationRef={dragRotationRef}
        />
      </Canvas>
    </div>
  );
};

export default TechGlobeHologram;
