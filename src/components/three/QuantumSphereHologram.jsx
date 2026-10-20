import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Gyroscopic Quantum Core Sphere Component
const QuantumCoreSphere = ({ scrollProgress, mousePos }) => {
  const outerRingRef = useRef(null);
  const midRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const coreRef = useRef(null);
  const particlesRef = useRef(null);
  const groupRef = useRef(null);

  // Floating quantum data particles
  const particleCount = 260;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.8;
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

    // Responsive cursor tracking & gentle float
    if (groupRef.current) {
      const targetRotY = mousePos.x * 0.45;
      const targetRotX = -mousePos.y * 0.35;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);

      // Scroll disassembly: expand and float up
      const scrollDisassembly = Math.min(1.0, scrollProgress * 1.5);
      groupRef.current.position.y = -scrollDisassembly * 2.2;
    }

    // 1. Outer Gyroscope Ring (Z & X rotation)
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.6;
      outerRingRef.current.rotation.x = Math.sin(time * 0.7) * 0.4;
    }

    // 2. Middle Orbital Ring (Y & Z counter-rotation)
    if (midRingRef.current) {
      midRingRef.current.rotation.y += delta * 0.8;
      midRingRef.current.rotation.x = Math.cos(time * 0.9) * 0.5;
    }

    // 3. Inner Equatorial Ring (Fast Z rotation)
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 1.2;
      innerRingRef.current.rotation.y += delta * 0.5;
    }

    // 4. Central Pulsing Quantum Crystal (Icosahedron)
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.4;
      coreRef.current.rotation.y += delta * 0.6;
      const pulse = 1.0 + Math.sin(time * 3.2) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // 5. Swirling Particle Cloud
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.18;
      particlesRef.current.rotation.z = Math.sin(time * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Central Holographic Quantum Crystal Core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Solid Inner Glow Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>

      {/* Outer Gyro Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[2.0, 0.04, 16, 100]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
      </group>

      {/* Middle Gyro Ring */}
      <group ref={midRingRef}>
        <mesh>
          <torusGeometry args={[1.65, 0.035, 16, 100]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={0.6} roughness={0.2} />
        </mesh>
      </group>

      {/* Inner Fast Gyro Ring */}
      <group ref={innerRingRef}>
        <mesh>
          <torusGeometry args={[1.3, 0.03, 16, 80]} />
          <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
      </group>

      {/* Swirling Quantum Particle Nebula */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.045} color="#38bdf8" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </points>

      {/* Internal core illumination */}
      <pointLight color="#00f5ff" intensity={2.2} distance={5} />
    </group>
  );
};

// Main Export Component
export const QuantumSphereHologram = () => {
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
        camera={{ position: [0, 0, 5.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#e0f2fe" />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#0284c7" />

        <QuantumCoreSphere scrollProgress={scrollProgress} mousePos={mousePos} />
      </Canvas>
    </div>
  );
};

export default QuantumSphereHologram;
