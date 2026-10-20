import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate 3D Coordinates for an Iconic AI Cybernetic Neural Brain & Quantum Core
function createAIBrainParticleData(count = 1680) {
  const startPositions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(count * 3);
  const currentPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const speeds = new Float32Array(count);
  const types = new Float32Array(count); // 0: cortex, 1: core, 2: stem, 3: bridge, 4: ring

  const cyan = new THREE.Color('#00f5ff');
  const sky = new THREE.Color('#38bdf8');
  const electricBlue = new THREE.Color('#2563eb');
  const cobalt = new THREE.Color('#1d4ed8');
  const neonPurple = new THREE.Color('#a855f7');
  const violet = new THREE.Color('#7c3aed');
  const pureWhite = new THREE.Color('#ffffff');
  const coreCyan = new THREE.Color('#a5f3fc');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 1. Initial Scattered Positions in Cyberspace
    const scatterRadius = 8.0 + Math.random() * 9.0;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    startPositions[i3] = scatterRadius * Math.sin(phi) * Math.cos(theta);
    startPositions[i3 + 1] = scatterRadius * Math.sin(phi) * Math.sin(theta);
    startPositions[i3 + 2] = scatterRadius * Math.cos(phi) + (Math.random() - 0.5) * 4;

    currentPositions[i3] = startPositions[i3];
    currentPositions[i3 + 1] = startPositions[i3 + 1];
    currentPositions[i3 + 2] = startPositions[i3 + 2];

    // Staggered arrival delays: 0.05s to 1.6s for one-by-one pixel assembly
    delays[i] = 0.05 + Math.random() * 1.55;
    speeds[i] = 0.85 + Math.random() * 0.45;

    // 2. Target Coordinates Sculpting the AI Neural Brain & Core Matrix
    let tx = 0, ty = 0, tz = 0;
    let particleColor = cyan;
    let type = 0;

    if (i < 880) {
      // --- LEFT & RIGHT CEREBRAL HEMISPHERES (NEOCORTEX & BRAIN LOBES) ---
      type = 0;
      const side = Math.random() > 0.5 ? 1 : -1;
      const u = Math.random() * Math.PI; // polar angle 0 to PI
      const v = (Math.random() - 0.5) * Math.PI * 0.94; // azimuth

      const rx = 0.82;
      const ry = 0.92;
      const rz = 1.18;

      // Brain sulci & gyri (convoluted neural cortex folds)
      const gyriFold = (Math.sin(u * 7 + v * 4) * 0.09 + Math.cos(v * 8) * 0.065) * Math.sin(u);
      
      // Temporal lobe side bulge
      const temporalBulge = (u > 1.25 && u < 2.25 && Math.abs(v) < 0.65) ? 0.14 : 0;
      const r = 1.0 + gyriFold + temporalBulge;

      // Central longitudinal fissure separating left & right brain hemispheres
      const fissureGap = 0.16 + Math.sin(u) * 0.06;

      tx = side * (fissureGap + Math.abs(rx * r * Math.sin(u) * Math.cos(v)));
      ty = 0.35 + ry * r * Math.cos(u);
      tz = rz * r * Math.sin(u) * Math.sin(v) + 0.05;

      // Color gradient from frontal lobes (cyan) to occipital/parietal (sky/electric blue)
      if (tz > 0.3) {
        particleColor = Math.random() > 0.3 ? cyan : coreCyan;
      } else if (tz > -0.3) {
        particleColor = Math.random() > 0.4 ? sky : cyan;
      } else {
        particleColor = Math.random() > 0.5 ? electricBlue : cobalt;
      }
    } else if (i < 1160) {
      // --- CENTRAL QUANTUM SYNAPTIC CORE (THE AI HEART) ---
      type = 1;
      const coreR = Math.pow(Math.random(), 0.65) * 0.45;
      const u = Math.random() * Math.PI;
      const v = Math.random() * Math.PI * 2;

      tx = coreR * Math.sin(u) * Math.cos(v);
      ty = 0.35 + coreR * Math.cos(u);
      tz = coreR * Math.sin(u) * Math.sin(v);

      // Super luminous core particles
      if (Math.random() > 0.4) {
        particleColor = pureWhite;
      } else {
        particleColor = coreCyan;
      }
    } else if (i < 1400) {
      // --- CEREBELLUM & CYBERNETIC NEURAL SPINE CONDUIT ---
      type = 2;
      if (i < 1270) {
        // Cerebellar lobes (base of brain, dual posterior bulges)
        const side = Math.random() > 0.5 ? 1 : -1;
        const cerU = Math.random() * Math.PI;
        const cerV = Math.random() * Math.PI * 2;
        const cerR = 0.32 + Math.sin(cerU * 9) * 0.03; // horizontal striations
        tx = side * (0.35 + cerR * Math.sin(cerU) * Math.cos(cerV) * 0.8);
        ty = -0.15 + cerR * Math.cos(cerU) * 0.65;
        tz = -0.55 + cerR * Math.sin(cerU) * Math.sin(cerV) * 0.8;
        particleColor = Math.random() > 0.5 ? cobalt : violet;
      } else {
        // --- INFERIOR TEMPORAL & OCCIPITAL LOBES (Natural Rounded Anatomical Base) ---
        const side = Math.random() > 0.5 ? 1 : -1;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.42 + Math.random() * 0.38;
        tx = side * (0.28 + Math.cos(angle) * radius * 0.65);
        ty = 0.05 + Math.sin(angle) * 0.22;
        tz = -0.28 + Math.sin(angle) * 0.52;
        particleColor = Math.random() > 0.5 ? electricBlue : cyan;
      }
    } else if (i < 1520) {
      // --- SYNAPTIC CORPUS CALLOSUM & INTER-HEMISPHERE BRIDGES ---
      type = 3;
      const t = (Math.random() - 0.5) * 0.52;
      tx = t;
      ty = 0.28 + Math.cos(t * Math.PI) * 0.2 + (Math.random() - 0.5) * 0.15;
      tz = (Math.random() - 0.5) * 0.75;
      particleColor = Math.random() > 0.5 ? pureWhite : cyan;
    } else {
      // --- QUANTUM ORBITAL HORIZON GYROSCOPE RINGS ---
      type = 4;
      const ringIdx = i % 2;
      const theta = Math.random() * Math.PI * 2;

      if (ringIdx === 0) {
        // Orbital ring 1 (tilted ~35 degrees)
        const r = 2.05 + (Math.random() - 0.5) * 0.08;
        tx = r * Math.cos(theta);
        ty = 0.35 + r * Math.sin(theta) * Math.sin(0.58);
        tz = r * Math.sin(theta) * Math.cos(0.58);
        particleColor = Math.random() > 0.4 ? cyan : sky;
      } else {
        // Orbital ring 2 (counter-tilted ~-42 degrees, rotated)
        const r = 2.25 + (Math.random() - 0.5) * 0.08;
        tx = r * Math.cos(theta) * Math.cos(0.7) - r * Math.sin(theta) * Math.sin(0.7) * 0.45;
        ty = 0.35 + r * Math.sin(theta) * Math.sin(-0.65);
        tz = r * Math.sin(theta) * Math.cos(-0.65);
        particleColor = Math.random() > 0.4 ? neonPurple : violet;
      }
    }

    targetPositions[i3] = tx;
    targetPositions[i3 + 1] = ty;
    targetPositions[i3 + 2] = tz;

    colors[i3] = particleColor.r;
    colors[i3 + 1] = particleColor.g;
    colors[i3 + 2] = particleColor.b;

    types[i] = type;
  }

  return {
    startPositions,
    targetPositions,
    currentPositions,
    colors,
    delays,
    speeds,
    types,
    count,
  };
}

// Single-Draw-Call 3D AI Brain Points Mesh with Organic Assembly & Physics Reactivity
function AIBrainMesh({ isVisible, pointerRef, dragRotationRef }) {
  const pointsRef = useRef(null);
  const data = useMemo(() => createAIBrainParticleData(1680), []);
  const startTimeRef = useRef(null);

  useFrame((state, delta) => {
    if (!isVisible || !pointsRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position;
    const positions = posAttr.array;

    const { startPositions, targetPositions, delays, speeds, types, count } = data;

    // 1. One-by-one initial pixel assembly animation
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const delay = delays[i];
      const speed = speeds[i];
      const type = types[i];

      if (elapsed < delay) {
        // Waiting state: ambient cyberspace drift
        const idle = Math.sin(elapsed * 2 + i) * 0.012;
        positions[i3] = startPositions[i3] + idle;
        positions[i3 + 1] = startPositions[i3 + 1] + idle;
        positions[i3 + 2] = startPositions[i3 + 2];
      } else {
        const t = Math.min((elapsed - delay) * speed, 1.0);
        // Cubic ease-out curve
        const progress = 1.0 - Math.pow(1.0 - t, 3);

        if (progress >= 0.99) {
          // Assembled living state: organic breathing & neural pulsation
          let breath = 0;
          if (type === 1) {
            // Central quantum core pulses rapidly like an AI heartbeat
            breath = Math.sin(elapsed * 4.2) * 0.035;
          } else if (type === 4) {
            // Orbital rings have slight wave wobble
            breath = Math.sin(elapsed * 2.0 + targetPositions[i3] * 2) * 0.015;
          } else {
            // Brain lobes gentle neural breath
            breath = Math.sin(elapsed * 1.6 + targetPositions[i3 + 1] * 2.5) * 0.018;
          }

          positions[i3] = targetPositions[i3] + breath * (targetPositions[i3] * 0.12);
          positions[i3 + 1] = targetPositions[i3 + 1] + breath;
          positions[i3 + 2] = targetPositions[i3 + 2] + breath * 0.12;
        } else {
          // Interpolate along path
          positions[i3] = THREE.MathUtils.lerp(startPositions[i3], targetPositions[i3], progress);
          positions[i3 + 1] = THREE.MathUtils.lerp(startPositions[i3 + 1], targetPositions[i3 + 1], progress);
          positions[i3 + 2] = THREE.MathUtils.lerp(startPositions[i3 + 2], targetPositions[i3 + 2], progress);
        }
      }
    }

    posAttr.needsUpdate = true;

    // 2. Interactive Rotation: User Drag + Mouse Parallax Tilt + Subtle Ambient Idle Yaw
    const damp = Math.min(delta * 6.0, 0.25);
    const ambientYaw = Math.sin(elapsed * 0.4) * 0.15;
    const pointerTiltX = pointerRef.current.y * 0.35;
    const pointerTiltY = pointerRef.current.x * 0.45;

    const targetRotX = dragRotationRef.current.x + pointerTiltX;
    const targetRotY = dragRotationRef.current.y + pointerTiltY + ambientYaw;

    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, damp);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, damp);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={data.count}
          array={data.currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={data.count}
          array={data.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.048}
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Borderless, Pure Floating AI Hologram for Hero Section
export const HeroHologram = () => {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRotationRef = useRef({ x: 0.1, y: -0.3 }); // pleasing 3/4 hero presentation angle
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // 1. Intersection Observer: Pause WebGL when Hero is off-screen for rock-solid 60 FPS
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. High-performance pointer tracking for 3D parallax tilt (Zero React Re-renders!)
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = x;
    pointerRef.current.y = y;

    // Handle interactive drag-to-spin
    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      dragRotationRef.current.y += deltaX * 0.008;
      dragRotationRef.current.x += deltaY * 0.008;
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
      className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[660px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
    >
      {/* Dynamic ambient radial halo - seamlessly blending into cyberspace with no borders */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.16)_0%,rgba(59,130,246,0.06)_45%,transparent_70%)] pointer-events-none" />

      {/* 3D WebGL Canvas */}
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0.2, 4.6], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <AIBrainMesh
          isVisible={isVisible}
          pointerRef={pointerRef}
          dragRotationRef={dragRotationRef}
        />
      </Canvas>
    </div>
  );
};

export default HeroHologram;
