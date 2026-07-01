"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type CakePhase = "idle" | "lighting" | "lit" | "blown";

// Animated flame mesh
function Flame({ position, lit, index }: {
  position: [number, number, number];
  lit: boolean;
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current && lit) {
      // Flicker scale
      const flicker = 1 + Math.sin(t * 8 + index * 1.3) * 0.08 + Math.sin(t * 13 + index * 2.1) * 0.05;
      meshRef.current.scale.set(flicker, flicker * (1 + Math.sin(t * 5 + index) * 0.1), flicker);
      meshRef.current.rotation.y = Math.sin(t * 3 + index) * 0.15;
    }
    if (lightRef.current && lit) {
      lightRef.current.intensity = 1.2 + Math.sin(t * 7 + index * 1.7) * 0.4;
    }
  });

  if (!lit) return null;

  return (
    <group position={position}>
      {/* Flame glow light */}
      <pointLight
        ref={lightRef}
        color="#fbbf24"
        intensity={1.2}
        distance={2.5}
        decay={2}
      />
      {/* Outer flame */}
      <mesh ref={meshRef}>
        <coneGeometry args={[0.045, 0.18, 8]} />
        <meshStandardMaterial
          color="#fb923c"
          emissive="#f59e0b"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Inner flame core */}
      <mesh position={[0, -0.02, 0]}>
        <coneGeometry args={[0.025, 0.1, 8]} />
        <meshStandardMaterial
          color="#fde68a"
          emissive="#fef3c7"
          emissiveIntensity={3}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

// Single candle
function Candle({ x, z, lit, index, phase }: {
  x: number; z: number; lit: boolean; index: number; phase: CakePhase;
}) {
  const candleY = 0.82;
  const colors = ["#f9a8d4", "#a5f3fc", "#fde68a", "#bbf7d0", "#ddd6fe", "#fed7aa"];
  const color = colors[index % colors.length];

  return (
    <group position={[x, candleY, z]}>
      {/* Candle body */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.16, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
        <meshStandardMaterial color="#1c1917" roughness={1} />
      </mesh>
      {/* Flame */}
      <Flame position={[0, 0.21, 0]} lit={lit} index={index} />
    </group>
  );
}

// The full 3D cake
function CakeMesh({ phase, candlesLit }: { phase: CakePhase; candlesLit: boolean[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle idle rotation
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });

  // Candle positions — ring on top tier
  const candlePositions = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return { x: Math.cos(angle) * 0.22, z: Math.sin(angle) * 0.22 };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ── Bottom tier ── */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.72, 0.75, 0.36, 32]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Bottom tier frosting ring */}
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.72, 0.04, 8, 32]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.2} />
      </mesh>
      {/* Bottom tier decoration band */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.73, 0.025, 8, 32]} />
        <meshStandardMaterial color="#f9a8d4" roughness={0.3} emissive="#f9a8d4" emissiveIntensity={0.1} />
      </mesh>

      {/* ── Middle tier ── */}
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.52, 0.54, 0.32, 32]} />
        <meshStandardMaterial color="#a5f3fc" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.52, 0.04, 8, 32]} />
        <meshStandardMaterial color="#cffafe" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <torusGeometry args={[0.53, 0.022, 8, 32]} />
        <meshStandardMaterial color="#67e8f9" roughness={0.3} emissive="#67e8f9" emissiveIntensity={0.1} />
      </mesh>

      {/* ── Top tier ── */}
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.28, 32]} />
        <meshStandardMaterial color="#fde68a" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.32, 0.04, 8, 32]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.2} />
      </mesh>

      {/* Plate */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshStandardMaterial color="#fdf4ff" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <Candle
          key={i}
          x={pos.x}
          z={pos.z}
          lit={candlesLit[i] ?? false}
          index={i}
          phase={phase}
        />
      ))}

      {/* Centre topper */}
      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

interface CakeSceneProps {
  phase: CakePhase;
  candlesLit: boolean[];
}

export default function CakeScene({ phase, candlesLit }: CakeSceneProps) {
  const allLit = candlesLit.every(Boolean);

  return (
    <Canvas
      camera={{ position: [0, 1.2, 2.8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Ambient */}
      <ambientLight intensity={allLit ? 0.4 : 0.9} color="#fdf4ff" />

      {/* Key light — warm from upper right */}
      <directionalLight
        position={[2, 4, 2]}
        intensity={allLit ? 0.6 : 1.2}
        color="#fde68a"
        castShadow
      />

      {/* Fill light — cool from left */}
      <pointLight position={[-2, 2, -1]} intensity={0.3} color="#a5f3fc" />

      <CakeMesh phase={phase} candlesLit={candlesLit} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.55}
        autoRotate={false}
      />
    </Canvas>
  );
}
