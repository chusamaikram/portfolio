import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate dynamic high-res IDE Code Screen Texture
function createScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background dark gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, '#030712');
  grad.addColorStop(0.5, '#070f23');
  grad.addColorStop(1, '#0b162f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Cyber scanline grid pattern
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 640; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Window Title Bar
  ctx.fillStyle = '#060b18';
  ctx.fillRect(0, 0, 1024, 52);
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
  ctx.beginPath();
  ctx.moveTo(0, 52);
  ctx.lineTo(1024, 52);
  ctx.stroke();

  // Traffic Light Window Controls
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(32, 26, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(58, 26, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(84, 26, 7, 0, Math.PI * 2);
  ctx.fill();

  // Active Code Tab
  ctx.fillStyle = '#0c1a36';
  ctx.fillRect(124, 10, 240, 36);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(124, 10, 240, 36);
  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 16px "JetBrains Mono", Consolas, monospace';
  ctx.fillText('⚡ UsamaArchitecture.tsx', 142, 34);

  // Code lines
  const lines = [
    { text: '// Enterprise Frontend Architecture', color: '#64748b' },
    { text: "import { React, Next, Three } from '@core';", color: '#38bdf8' },
    { text: "import { Zustand } from 'state-engine';", color: '#38bdf8' },
    { text: "import { DjangoDRF } from 'backend-api';", color: '#818cf8' },
    { text: '', color: '' },
    { text: 'export const EngineeringStack = () => {', color: '#a78bfa' },
    { text: '  const telemetry = usePerformanceMetrics({', color: '#f1f5f9' },
    { text: "    fps: '60 FPS Hardware Target',", color: '#a5f3fc' },
    { text: "    lcp: '< 1.1s', cls: 0.00,", color: '#a5f3fc' },
    { text: "    architecture: 'Modular & High-Throughput'", color: '#a5f3fc' },
    { text: '  });', color: '#f1f5f9' },
    { text: '', color: '' },
    { text: '  return <FutureReadyUI ecosystem={telemetry} />;', color: '#38bdf8' },
    { text: '};', color: '#a78bfa' },
    { text: '', color: '' },
    { text: '✔ Compilation: 0 errors • SLA 99.8% • LIVE READY', color: '#34d399' },
  ];

  ctx.font = '19px "JetBrains Mono", Consolas, monospace';
  let y = 100;
  lines.forEach((l) => {
    if (l.text) {
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, 44, y);
    }
    y += 33;
  });

  // Glowing blinking cursor
  ctx.fillStyle = '#22d3ee';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 12;
  ctx.fillRect(44, y - 8, 14, 24);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Generate Keyboard Texture with Illuminated Chiclet Keys
function createKeyboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Dark aluminum keyboard bed
  ctx.fillStyle = '#060d1c';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer border with subtle cyan glow
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, 1000, 488);

  // Draw 5 rows of chiclet keys
  const rows = 5;
  const cols = 14;
  const keyWidth = 58;
  const keyHeight = 44;
  const gapX = 11;
  const gapY = 12;
  const startX = 32;
  const startY = 32;

  ctx.lineWidth = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (keyWidth + gapX);
      const y = startY + r * (keyHeight + gapY);

      // Spacebar row adjustment
      if (r === 4 && c >= 4 && c <= 9) {
        if (c === 4) {
          const spaceW = keyWidth * 6 + gapX * 5;
          ctx.fillStyle = '#0f1f3d';
          ctx.fillRect(x, y, spaceW, keyHeight);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
          ctx.strokeRect(x, y, spaceW, keyHeight);
        }
        continue;
      }

      ctx.fillStyle = '#0c1830';
      ctx.fillRect(x, y, keyWidth, keyHeight);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.strokeRect(x, y, keyWidth, keyHeight);

      // Random keycap illumination
      if ((r + c) % 3 === 0) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.fillRect(x + 2, y + 2, keyWidth - 4, keyHeight - 4);
      }
    }
  }

  // Large Precision Glass Trackpad
  const tpX = 362;
  const tpY = 330;
  const tpW = 300;
  const tpH = 150;
  ctx.fillStyle = '#040914';
  ctx.fillRect(tpX, tpY, tpW, tpH);
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(tpX, tpY, tpW, tpH);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// 3D Assembling Laptop Mesh Component:
// Stays completely sticky & stable once assembled (NO cursor tilt, NO body wobbling)
// Only background waves, concentric rings, and floating circuit particles keep moving
const AssemblingLaptop = ({ scrollProgress }) => {
  const groupRef = useRef(null);
  const baseRef = useRef(null);
  const lidRef = useRef(null);
  const holoRingRef = useRef(null);
  const particlesRef = useRef(null);

  // Smooth assembly interpolation state (0 = disassembled, 1 = fully assembled)
  const assemblyState = useRef(0.0);

  // Textures
  const screenTexture = useMemo(() => createScreenTexture(), []);
  const keyboardTexture = useMemo(() => createKeyboardTexture(), []);

  // Floating ambient circuit particles data
  const particleCount = 160;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    // Target assembly: based on scroll position!
    // When scrollProgress is 0 (hero in view), target is 1.0 (assembled)
    // When user scrolls down, target drops towards 0.0 (disassembled)
    const targetAssembly = Math.max(0.0, Math.min(1.0, 1.0 - scrollProgress));

    // Smooth lerp for buttery organic movement
    assemblyState.current = THREE.MathUtils.lerp(assemblyState.current, targetAssembly, 0.08);
    const easeProgress = assemblyState.current;

    // 1. Group overall position & rotation:
    // LAPTOP REMAINS CALM, STICKY & STABLE (Zero wobble, zero cursor tilt on laptop body)
    if (groupRef.current) {
      groupRef.current.position.set(0, -0.12, 0);
      groupRef.current.rotation.set(0.12, -0.06, 0);
    }

    // 2. Base Chassis: Assembles upwards from below
    if (baseRef.current) {
      // Disassembled: y = -2.8, z = 1.4, rx = 0.38
      // Assembled: y = -0.42, z = 0.0, rx = 0.0
      const currentY = THREE.MathUtils.lerp(-2.8, -0.42, easeProgress);
      const currentZ = THREE.MathUtils.lerp(1.4, 0.0, easeProgress);
      const currentRotX = THREE.MathUtils.lerp(0.38, 0.0, easeProgress);

      baseRef.current.position.y = currentY;
      baseRef.current.position.z = currentZ;
      baseRef.current.rotation.x = currentRotX;
    }

    // 3. Screen Lid: Assembles downwards from above & unfolds to ~108 degrees
    if (lidRef.current) {
      // Disassembled: y = 3.2, z = -2.0, rx = -1.35 (folded back)
      // Assembled: y = 0.0, z = -0.98, rx = -0.32 (open ~108 deg angle)
      const currentLidY = THREE.MathUtils.lerp(3.2, 0.0, easeProgress);
      const currentLidZ = THREE.MathUtils.lerp(-2.0, -0.98, easeProgress);
      const currentLidRotX = THREE.MathUtils.lerp(-1.35, -0.32, easeProgress);

      lidRef.current.position.y = currentLidY;
      lidRef.current.position.z = currentLidZ;
      lidRef.current.rotation.x = currentLidRotX;
    }

    // 4. ONLY AMBIENT WAVES & ROUNDABOUT ROTATIONS KEEP MOVING:
    // Floating concentric cyber rings rotate continuously
    if (holoRingRef.current) {
      holoRingRef.current.rotation.z += delta * 0.45;
      holoRingRef.current.scale.setScalar(THREE.MathUtils.lerp(1.8, 1.0, easeProgress));
    }

    // Floating circuit dust particles rotate continuously
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.12;
      // Scatter particles when disassembled
      const scatterScale = THREE.MathUtils.lerp(1.6, 1.0, easeProgress);
      particlesRef.current.scale.set(scatterScale, scatterScale, scatterScale);
    }
  });

  return (
    // Scaled to 0.78 with centered offset: guaranteed 100% full visibility with NO cropping
    <group ref={groupRef} position={[0, -0.12, 0]} scale={[0.78, 0.78, 0.78]}>
      {/* ========================================================= */}
      {/* 1. LAPTOP BASE CHASSIS (Keyboard, Trackpad, Ports)       */}
      {/* ========================================================= */}
      <group ref={baseRef}>
        {/* Main Base Slab (Anodized Titanium) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[3.8, 0.14, 2.6]} />
          <meshStandardMaterial color="#080e1c" metalness={0.88} roughness={0.22} />
        </mesh>

        {/* Keyboard Recessed Deck */}
        <mesh position={[0, 0.075, -0.22]}>
          <boxGeometry args={[3.5, 0.015, 1.8]} />
          <meshBasicMaterial map={keyboardTexture} />
        </mesh>

        {/* Glowing Keyboard Base Perimeter Neon Accent */}
        <mesh position={[0, 0.076, -0.22]}>
          <planeGeometry args={[3.52, 1.82]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} wireframe />
        </mesh>

        {/* Left & Right USB-C Neon Light Ports */}
        <mesh position={[-1.91, 0, 0.3]}>
          <boxGeometry args={[0.02, 0.035, 0.16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-1.91, 0, 0.6]}>
          <boxGeometry args={[0.02, 0.035, 0.16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[1.91, 0, 0.3]}>
          <boxGeometry args={[0.02, 0.035, 0.16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Front Edge Glowing Status Blade Indicator */}
        <mesh position={[0, 0, 1.305]}>
          <boxGeometry args={[0.8, 0.025, 0.01]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 2. LAPTOP DISPLAY LID & IDE CODE SCREEN                  */}
      {/* ========================================================= */}
      <group ref={lidRef} position={[0, 0, -0.98]}>
        {/* Back Aluminum Cover */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[3.8, 2.5, 0.08]} />
          <meshStandardMaterial color="#060c18" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Apple/Cyber Glowing Logo on Back of Lid */}
        <mesh position={[0, 1.25, -0.045]} rotation={[0, Math.PI, 0]}>
          <ringGeometry args={[0.15, 0.28, 32]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Display Glass Bezel */}
        <mesh position={[0, 1.25, 0.042]}>
          <planeGeometry args={[3.72, 2.42]} />
          <meshStandardMaterial color="#020611" roughness={0.1} />
        </mesh>

        {/* High-Resolution IDE Code Screen Matrix */}
        <mesh position={[0, 1.25, 0.045]}>
          <planeGeometry args={[3.55, 2.25]} />
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        </mesh>

        {/* Top Optic Webcam Sensor */}
        <mesh position={[0, 2.42, 0.045]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>

        {/* Subtle Ambient Screen Light casting forward */}
        <pointLight position={[0, 1.2, 0.6]} color="#38bdf8" intensity={1.6} distance={3.5} />
      </group>

      {/* ========================================================= */}
      {/* 3. HOLOGRAPHIC QUANTUM ACCENTS & FLOATING CIRCUITS        */}
      {/* ========================================================= */}
      {/* Floating Concentric Cyber Rings under base */}
      <group ref={holoRingRef} position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.3, 2.34, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.6, 2.63, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Floating Circuit Data Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#38bdf8" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

// Main Export Component
export const TechGadgetHologram = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll listener for auto disassembly / re-assembly
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          // Hero disassembly range: scroll from 40px to 520px
          // 0 = fully assembled (hero in view)
          // 1 = fully disassembled (scrolled down to next section)
          const progress = Math.min(1.0, Math.max(0.0, (scrollY - 40) / 480));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Generous dimensions: 100% full view, zero clipping, fully responsive
    <div className="w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[660px] relative flex items-center justify-center select-none overflow-visible group">
      {/* Ambient background soft glow behind gadget */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Three.js R3F Canvas Viewport with optimal Camera Distance & FOV */}
      <Canvas
        camera={{ position: [0, 0.45, 6.4], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#e0f2fe" />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#0284c7" />

        <AssemblingLaptop scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default TechGadgetHologram;
