import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Hologram Core Mesh with Wireframe Icosahedron & Pulsing Energy Sphere
function HolographicMesh({ mousePos }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth cursor-reactive rotation using lerp
    if (outerRef.current) {
      const targetRotX = mousePos.y * 0.6 + time * 0.15;
      const targetRotY = mousePos.x * 0.8 + time * 0.2;

      outerRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRef.current.rotation.x,
        targetRotX,
        0.05
      );
      outerRef.current.rotation.y = THREE.MathUtils.lerp(
        outerRef.current.rotation.y,
        targetRotY,
        0.05
      );
    }

    // Inner core pulsing animation
    if (innerRef.current) {
      const pulse = 1 + Math.sin(time * 2.2) * 0.14;
      innerRef.current.scale.set(pulse, pulse, pulse);
      innerRef.current.rotation.y = -time * 0.4;
      innerRef.current.rotation.z = time * 0.2;
    }

    // Orbiting data ring
    if (ringRef.current) {
      ringRef.current.rotation.x = 1.2 + Math.sin(time * 0.5) * 0.2;
      ringRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group>
        {/* Outer Wireframe Icosahedron */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Inner Pulsing Core */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Orbiting Quantum Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.7}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

export const HeroHologram = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center pointer-events-none">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-500/15 via-blue-500/5 to-transparent blur-2xl" />

      {/* Cyber Reticle Guides */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-72 h-72 rounded-full border border-dashed border-cyan-400/40 animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-88 h-88 rounded-full border border-cyan-400/20" />
      </div>

      {/* Capped 60FPS Performance Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#3b82f6" />
        <HolographicMesh mousePos={mousePos} />
      </Canvas>
    </div>
  );
};

export default HeroHologram;
