import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate dynamic high-res Mobile App Screen Texture
function createMobileScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background dark gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#040816');
  grad.addColorStop(0.5, '#07122b');
  grad.addColorStop(1, '#02050e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Subtle scanlines
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 1024; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Top Status Bar (Time & 5G & Battery)
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "JetBrains Mono", sans-serif';
  ctx.fillText('09:41', 40, 50);
  ctx.fillText('5G • 100%', 380, 50);

  // Dynamic Island Notch
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(176, 26, 160, 36, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Optic camera lens dot inside notch
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(310, 44, 5, 0, Math.PI * 2);
  ctx.fill();

  // App Header
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.fillText('⚡ Usama.Mobile', 40, 130);
  ctx.fillStyle = '#64748b';
  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.fillText('Responsive Architecture v2.4', 40, 160);

  // Card 1: Live Telemetry Metric
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(32, 190, 448, 140, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('SYSTEM PERFORMANCE', 54, 226);
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText('60.0 FPS', 54, 276);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('Zero Layout Shift • <1.1s LCP', 54, 306);

  // Card 2: Interactive Chart Graphic
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(32, 355, 448, 220, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('THROUGHPUT TELEMETRY', 54, 395);

  // Draw cyber line chart
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, 520);
  ctx.lineTo(130, 470);
  ctx.lineTo(200, 490);
  ctx.lineTo(280, 430);
  ctx.lineTo(360, 450);
  ctx.lineTo(440, 410);
  ctx.stroke();

  // Chart data nodes
  [
    [60, 520],
    [130, 470],
    [200, 490],
    [280, 430],
    [360, 450],
    [440, 410],
  ].forEach(([cx, cy]) => {
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Card 3: Tech Stack Matrix
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(32, 600, 448, 170, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('STACK CAPABILITIES', 54, 640);

  const pills = ['React 19', 'Next.js', 'Tailwind', 'Three.js', 'Django 5'];
  let px = 54;
  let py = 680;
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  pills.forEach((pill) => {
    const textW = ctx.measureText(pill).width;
    ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
    ctx.beginPath();
    ctx.roundRect(px, py - 20, textW + 24, 32, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(pill, px + 12, py + 2);
    px += textW + 36;
  });

  // Bottom Navigation Bar
  ctx.fillStyle = '#060b18';
  ctx.fillRect(0, 930, 512, 94);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 930);
  ctx.lineTo(512, 930);
  ctx.stroke();

  // Home indicator pill
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(176, 1000, 160, 6, 3);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// 3D Cyber Smartphone Component
const CyberSmartphone = ({ scrollProgress, mousePos }) => {
  const groupRef = useRef(null);
  const bodyRef = useRef(null);
  const screenRef = useRef(null);
  const ringsRef = useRef(null);
  const particlesRef = useRef(null);

  const screenTexture = useMemo(() => createMobileScreenTexture(), []);

  // Floating circuit particles
  const particleCount = 180;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.6 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Responsive parallax tilt tracking
    if (groupRef.current) {
      const targetRotY = mousePos.x * 0.28 - 0.12;
      const targetRotX = -mousePos.y * 0.22 + 0.1;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);

      // Subtle float oscillation
      const floatY = Math.sin(time * 1.4) * 0.08;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.08);

      // Scroll disassembly: lifts and separates parts
      const easeProgress = Math.min(1.0, scrollProgress * 1.5);
      if (bodyRef.current) {
        bodyRef.current.position.z = -easeProgress * 1.8;
        bodyRef.current.rotation.z = easeProgress * 0.25;
      }
      if (screenRef.current) {
        screenRef.current.position.z = easeProgress * 1.2;
      }
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.5;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.18, 1.18, 1.18]}>
      {/* 1. Phone Body Chassis (Dark Titanium) */}
      <group ref={bodyRef}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.9, 3.8, 0.14]} />
          <meshStandardMaterial color="#080e1c" metalness={0.92} roughness={0.18} />
        </mesh>

        {/* Outer glowing neon chamfer rim */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.92, 3.82, 0.13]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.25} />
        </mesh>

        {/* Back Triple Camera Bump */}
        <mesh position={[-0.45, 1.35, -0.09]}>
          <boxGeometry args={[0.7, 0.75, 0.06]} />
          <meshStandardMaterial color="#040813" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Lenses */}
        {[-0.6, -0.3].map((lx, idx) => (
          <mesh key={idx} position={[lx, 1.5, -0.13]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
            <meshBasicMaterial color="#00f5ff" />
          </mesh>
        ))}
        <mesh position={[-0.45, 1.2, -0.13]}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>

        {/* Side Volume and Power Buttons */}
        <mesh position={[-0.96, 0.8, 0]}>
          <boxGeometry args={[0.02, 0.25, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[-0.96, 0.45, 0]}>
          <boxGeometry args={[0.02, 0.25, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.96, 0.6, 0]}>
          <boxGeometry args={[0.02, 0.35, 0.04]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 2. Glass OLED Display Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.076]}>
        <planeGeometry args={[1.82, 3.72]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {/* Ambient Screen Light */}
      <pointLight position={[0, 0, 0.8]} color="#38bdf8" intensity={1.8} distance={4} />

      {/* 3. Concentric Orbital Rings */}
      <group ref={ringsRef} position={[0, -0.2, -0.2]} rotation={[-Math.PI / 2.5, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.0, 2.03, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.3, 2.33, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Floating Circuit Data Dust */}
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
export const MobileGadgetHologram = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const progress = Math.min(1.0, Math.max(0.0, (scrollY - 40) / 480));
      setScrollProgress(progress);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[660px] relative flex items-center justify-center select-none overflow-visible group">
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0.1, 5.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#e0f2fe" />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#0284c7" />

        <CyberSmartphone scrollProgress={scrollProgress} mousePos={mousePos} />
      </Canvas>
    </div>
  );
};

export default MobileGadgetHologram;
