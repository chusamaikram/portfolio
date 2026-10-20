import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

// Generate 3D Coordinates for an Assembling AI Cybernetic Neural Head & Brain
function createAIParticleData(count = 1350) {
  const startPositions = new Float32Array(count * 3);
  const targetPositions = new Float32Array(count * 3);
  const currentPositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const speeds = new Float32Array(count);

  const cyan = new THREE.Color('#22d3ee');
  const sky = new THREE.Color('#38bdf8');
  const electricBlue = new THREE.Color('#3b82f6');
  const neonPurple = new THREE.Color('#a855f7');
  const brightWhite = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 1. Scattered coordinates in 3D cyberspace
    const scatterRadius = 8.0 + Math.random() * 8.0;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    startPositions[i3] = scatterRadius * Math.sin(phi) * Math.cos(theta);
    startPositions[i3 + 1] = scatterRadius * Math.sin(phi) * Math.sin(theta);
    startPositions[i3 + 2] = scatterRadius * Math.cos(phi) + (Math.random() - 0.5) * 5;

    currentPositions[i3] = startPositions[i3];
    currentPositions[i3 + 1] = startPositions[i3 + 1];
    currentPositions[i3 + 2] = startPositions[i3 + 2];

    // Staggered arrival delays: 0.05s to 1.75s for one-by-one assembly effect
    delays[i] = 0.05 + Math.random() * 1.7;
    speeds[i] = 0.85 + Math.random() * 0.45;

    // 2. Target Coordinates forming the AI Cybernetic Neural Face & Brain
    let tx = 0, ty = 0, tz = 0;
    let particleColor = cyan;

    if (i < 380) {
      // --- CRANIAL & JAW CYBERNETIC CONTOUR ---
      const u = Math.random() * Math.PI;
      const v = Math.random() * Math.PI * 2;
      const r = 1.55 + Math.sin(u * 2) * 0.12;

      tx = r * Math.sin(u) * Math.cos(v) * 0.82;
      ty = (r * Math.cos(u) + 0.1) * 1.15;
      tz = r * Math.sin(u) * Math.sin(v) * 0.95;

      // Sculpt sharp cybernetic jawline
      if (ty < -0.3) {
        tx *= 0.65;
        tz *= 0.72;
      }
      particleColor = Math.random() > 0.45 ? cyan : sky;
    } else if (i < 850) {
      // --- NEURAL BRAIN HEMISPHERES & CORTEX FOLDS ---
      const side = Math.random() > 0.5 ? 1 : -1;
      const angle = Math.random() * Math.PI;
      const radius = 0.5 + Math.random() * 0.95;
      const height = 0.25 + Math.random() * 1.15;

      // Brain sulci / gyri wave modulation
      const wave = Math.sin(angle * 7) * 0.12;
      tx = side * (0.18 + (radius + wave) * Math.cos(angle) * 0.75);
      ty = height;
      tz = (radius + wave) * Math.sin(angle) * 0.85 - 0.15;

      particleColor = Math.random() > 0.5 ? sky : electricBlue;
    } else if (i < 1100) {
      // --- OCULAR DATA RETICLES (AI EYES) & CENTRAL QUANTUM CORE ---
      if (i < 980) {
        // Dual Eyes Data Rings
        const eyeSide = i % 2 === 0 ? 1 : -1;
        const ringAngle = Math.random() * Math.PI * 2;
        const ringR = 0.06 + Math.random() * 0.22;
        tx = eyeSide * 0.42 + Math.cos(ringAngle) * ringR;
        ty = 0.12 + Math.sin(ringAngle) * ringR;
        tz = 0.85;
        particleColor = brightWhite;
      } else {
        // Central Synaptic Nexus (Forehead / AI Core)
        const coreAngle = Math.random() * Math.PI * 2;
        const coreR = Math.random() * 0.35;
        tx = Math.cos(coreAngle) * coreR;
        ty = 0.45 + Math.sin(coreAngle) * coreR;
        tz = 0.35 + (Math.random() - 0.5) * 0.3;
        particleColor = cyan;
      }
    } else {
      // --- QUANTUM ORBITAL RINGS & FLOATING SYNAPSES ---
      const ringTheta = Math.random() * Math.PI * 2;
      const ringRadius = 2.0 + Math.random() * 0.65;
      const tilt = (Math.random() - 0.5) * 1.6;
      tx = ringRadius * Math.cos(ringTheta);
      ty = ringRadius * Math.sin(ringTheta) * Math.sin(tilt);
      tz = ringRadius * Math.sin(ringTheta) * Math.cos(tilt);
      particleColor = Math.random() > 0.6 ? electricBlue : neonPurple;
    }

    targetPositions[i3] = tx;
    targetPositions[i3 + 1] = ty;
    targetPositions[i3 + 2] = tz;

    colors[i3] = particleColor.r;
    colors[i3 + 1] = particleColor.g;
    colors[i3 + 2] = particleColor.b;
  }

  return {
    startPositions,
    targetPositions,
    currentPositions,
    colors,
    delays,
    speeds,
    count,
  };
}

// Optimized Three.js Points Mesh with Staggered Pixel Assembly Animation
function AIPixelPoints({ isVisible, pointerRef, resetKey, onAssembled }) {
  const pointsRef = useRef(null);
  const data = useMemo(() => createAIParticleData(1350), [resetKey]);
  const startTimeRef = useRef(null);
  const hasTriggeredAssembledRef = useRef(false);

  // Re-initialize start time when resetKey changes
  useEffect(() => {
    startTimeRef.current = null;
    hasTriggeredAssembledRef.current = false;
  }, [resetKey]);

  useFrame((state) => {
    // 1. Performance optimization: skip frame calculations if canvas is offscreen
    if (!isVisible || !pointsRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTimeRef.current;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position;
    const positions = posAttr.array;

    const { startPositions, targetPositions, delays, speeds, count } = data;
    let assembledCount = 0;

    // 2. Animate each pixel assembling one-by-one
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const delay = delays[i];
      const speed = speeds[i];

      if (elapsed < delay) {
        // Particle is waiting: subtle ambient drift before assembly
        const idleFloat = Math.sin(elapsed * 2 + i) * 0.01;
        positions[i3] = startPositions[i3] + idleFloat;
        positions[i3 + 1] = startPositions[i3 + 1] + idleFloat;
        positions[i3 + 2] = startPositions[i3 + 2];
      } else {
        // Particle has begun its assembly journey: smooth cubic ease-out
        const t = Math.min((elapsed - delay) * speed, 1.0);
        // Ease-out cubic curve
        const progress = 1.0 - Math.pow(1.0 - t, 3);

        if (progress >= 0.99) {
          assembledCount++;
          // When assembled, add subtle breathing & synaptic pulse
          const breath = Math.sin(elapsed * 1.8 + targetPositions[i3 + 1] * 2) * 0.02;
          positions[i3] = targetPositions[i3] + breath * (targetPositions[i3] * 0.1);
          positions[i3 + 1] = targetPositions[i3 + 1] + breath;
          positions[i3 + 2] = targetPositions[i3 + 2] + breath * 0.1;
        } else {
          // Lerp between start and target
          positions[i3] = THREE.MathUtils.lerp(startPositions[i3], targetPositions[i3], progress);
          positions[i3 + 1] = THREE.MathUtils.lerp(startPositions[i3 + 1], targetPositions[i3 + 1], progress);
          positions[i3 + 2] = THREE.MathUtils.lerp(startPositions[i3 + 2], targetPositions[i3 + 2], progress);
        }
      }
    }

    posAttr.needsUpdate = true;

    // Check if fully assembled
    if (assembledCount > count * 0.92 && !hasTriggeredAssembledRef.current) {
      hasTriggeredAssembledRef.current = true;
      if (onAssembled) onAssembled();
    }

    // 3. Smooth cursor tracking without React re-render overhead
    const targetRotX = pointerRef.current.y * 0.4 + Math.sin(elapsed * 0.8) * 0.05;
    const targetRotY = pointerRef.current.x * 0.6 + elapsed * 0.12;

    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.04);
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.04);
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
        size={0.052}
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Outer Hologram Frame with Cyber Controls & Viewport Observer
export const HeroHologram = () => {
  const containerRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [isAssembled, setIsAssembled] = useState(false);

  // 1. Intersection Observer: Pause WebGL when Hero is off-screen to guarantee 60 FPS scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. High-performance pointer tracking into mutable ref (Zero React Re-renders!)
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = x;
    pointerRef.current.y = y;
  }, []);

  const handleResetHologram = () => {
    setIsAssembled(false);
    setResetKey((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] flex items-center justify-center select-none"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,rgba(59,130,246,0.05)_50%,transparent_70%)] pointer-events-none" />

      {/* Cyber Reticle HUD Brackets */}
      <div className="absolute inset-3 sm:inset-6 pointer-events-none border border-cyan-500/15 rounded-3xl">
        <span className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <span className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
      </div>

      {/* Top HUD Telemetry Pill */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between pointer-events-none z-10 font-mono text-[10px]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-400/30 text-cyan-300">
          <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>{isAssembled ? 'AI CORE // ASSEMBLED' : 'ASSEMBLING PIXELS...'}</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>1,350 QUANTUM NODES</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        <AIPixelPoints
          isVisible={isVisible}
          pointerRef={pointerRef}
          resetKey={resetKey}
          onAssembled={() => setIsAssembled(true)}
        />
      </Canvas>

      {/* Bottom Interactive Re-Assemble Trigger */}
      <div className="absolute bottom-5 right-6 z-10">
        <button
          onClick={handleResetHologram}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/30 hover:border-cyan-400 text-cyan-300 text-[11px] font-mono transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] cursor-pointer active:scale-95"
          title="Re-assemble holographic pixels from cyberspace"
        >
          <RefreshCw className="w-3 h-3 text-cyan-400" />
          <span>Re-Assemble</span>
        </button>
      </div>

      {/* Bottom Status Indicator */}
      <div className="absolute bottom-5 left-6 z-10 pointer-events-none font-mono text-[10px] text-slate-400 hidden sm:flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-emerald-400">60 FPS HARDWARE ACCELERATED</span>
      </div>
    </div>
  );
};

export default HeroHologram;
