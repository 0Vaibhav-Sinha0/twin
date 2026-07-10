"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

export type CakePhase = "idle" | "lighting" | "lit" | "wishing" | "blowing" | "blown" | "cutting" | "cut";

function Flame({ position, lit, index, extinguishing }: {
  position: [number, number, number];
  lit: boolean;
  index: number;
  extinguishing?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const scaleRef = useRef(1);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current && lit) {
      const flicker = 1 + Math.sin(t * 8 + index * 1.3) * 0.08 + Math.sin(t * 13 + index * 2.1) * 0.05;
      if (extinguishing) {
        scaleRef.current = Math.max(0, scaleRef.current - 0.045);
      } else {
        scaleRef.current = flicker;
      }
      const s = scaleRef.current;
      meshRef.current.scale.set(s, s * (1 + Math.sin(t * 5 + index) * 0.1), s);
      meshRef.current.rotation.y = Math.sin(t * 3 + index) * 0.15;
      meshRef.current.visible = s > 0.02;
    }
    if (lightRef.current && lit) {
      lightRef.current.intensity = (1.4 + Math.sin(t * 7 + index * 1.7) * 0.4) * scaleRef.current;
    }
  });

  if (!lit) return null;

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#ffb84d" intensity={1.4} distance={2.8} decay={2} />
      <mesh ref={meshRef}>
        <coneGeometry args={[0.045, 0.18, 8]} />
        <meshStandardMaterial color="#fb923c" emissive="#f59e0b" emissiveIntensity={2.2} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <coneGeometry args={[0.025, 0.1, 8]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fffbeb" emissiveIntensity={3.2} transparent opacity={0.96} />
      </mesh>
    </group>
  );
}

function Candle({ x, z, lit, index, extinguishing }: {
  x: number; z: number; lit: boolean; index: number; extinguishing?: boolean;
}) {
  const candleY = 0.86;
  const colors = ["#f9a8d4", "#e9d5ff", "#fde68a", "#fecdd3", "#ddd6fe", "#fed7aa"];
  const color = colors[index % colors.length];

  return (
    <group position={[x, candleY, z]}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.16, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.1} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[0.033, 0.006, 8, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} emissive="#d4af37" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>
      <Flame position={[0, 0.21, 0]} lit={lit} index={index} extinguishing={extinguishing} />
    </group>
  );
}

function DripRing({ radius, y, color, count = 16 }: {
  radius: number; y: number; color: string; count?: number;
}) {
  const drips = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const dripLen = 0.03 + Math.random() * 0.04;
      return { angle, dripLen, offset: Math.random() * 0.02 };
    });
  }, [count]);

  return (
    <group position={[0, y, 0]}>
      {drips.map((d, i) => (
        <mesh
          key={i}
          position={[Math.cos(d.angle) * (radius - 0.01), -d.dripLen / 2 + d.offset, Math.sin(d.angle) * (radius - 0.01)]}
        >
          <capsuleGeometry args={[0.012, d.dripLen, 4, 8]} />
          <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.05} clearcoat={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function SugarFlower({ position, color, scale = 1 }: {
  position: [number, number, number]; color: string; scale?: number;
}) {
  const petalCount = 6;
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.028, 0, Math.sin(angle) * 0.028]}
            rotation={[0, -angle, 0]}
          >
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.05} clearcoat={0.5} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.014, 8, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function PearlString({ radius, y, count = 24 }: { radius: number; y: number; count?: number }) {
  const pearls = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [count]
  );
  return (
    <group position={[0, y, 0]}>
      {pearls.map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshPhysicalMaterial color="#fffbf0" roughness={0.1} metalness={0.3} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function RibbonBand({ radius, y, height, color }: {
  radius: number; y: number; height: number; color: string;
}) {
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[radius + 0.003, radius + 0.003, height, 32, 1, true]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.25}
        metalness={0.15}
        clearcoat={0.7}
        clearcoatRoughness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function HiddenHeart({ opacity }: { opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.5) * 0.15;
      meshRef.current.scale.setScalar(pulse * 0.5);
    }
  });

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.25);
    shape.bezierCurveTo(0, 0.4, -0.15, 0.5, -0.3, 0.4);
    shape.bezierCurveTo(-0.5, 0.28, -0.5, 0.05, -0.3, -0.15);
    shape.bezierCurveTo(-0.15, -0.3, 0, -0.4, 0, -0.5);
    shape.bezierCurveTo(0, -0.4, 0.15, -0.3, 0.3, -0.15);
    shape.bezierCurveTo(0.5, 0.05, 0.5, 0.28, 0.3, 0.4);
    shape.bezierCurveTo(0.15, 0.5, 0, 0.4, 0, 0.25);
    return shape;
  }, []);

  return (
    <mesh ref={meshRef} position={[0.15, 0.45, 0]} rotation={[0, 0, Math.PI]}>
      <shapeGeometry args={[heartShape]} />
      <meshStandardMaterial
        color="#f472b6"
        emissive="#ec4899"
        emissiveIntensity={1.8}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function CakeSlice({ progress }: { progress: number }) {
  const slideDistance = progress * 0.9;
  const angle = Math.PI / 8;

  return (
    <group position={[slideDistance, 0, 0]}>
      <mesh position={[0.3, 0.18, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.36, 32, 1, false, -angle, angle * 2]} />
        <meshPhysicalMaterial color="#fbcfe8" roughness={0.35} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.22, 0.56, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.32, 32, 1, false, -angle, angle * 2]} />
        <meshPhysicalMaterial color="#e9d5ff" roughness={0.35} clearcoat={0.3} />
      </mesh>
      <mesh position={[0.14, 0.86, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.28, 32, 1, false, -angle, angle * 2]} />
        <meshPhysicalMaterial color="#fff8ee" roughness={0.35} clearcoat={0.3} />
      </mesh>

      {progress > 0.5 && <HiddenHeart opacity={Math.min(1, (progress - 0.5) * 2.5)} />}
    </group>
  );
}

function CakeMesh({ candlesLit, extinguishing, cutProgress }: {
  candlesLit: boolean[];
  extinguishing: boolean;
  cutProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  const candlePositions = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return { x: Math.cos(angle) * 0.22, z: Math.sin(angle) * 0.22 };
    });
  }, []);

  const flowerPositions = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + 0.3;
      return { x: Math.cos(angle) * 0.7, z: Math.sin(angle) * 0.7 };
    });
  }, []);

  const isCutOpen = cutProgress > 0.05;
  const cutStart = isCutOpen ? -Math.PI / 8 : 0;
  const cutLength = isCutOpen ? Math.PI * 2 - Math.PI / 4 : Math.PI * 2;

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.72, 0.75, 0.36, 48, 1, false, cutStart, cutLength]} />
        <meshPhysicalMaterial color="#fbcfe8" roughness={0.32} metalness={0.05} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <DripRing radius={0.72} y={0.35} color="#fce7f3" count={20} />
      <PearlString radius={0.735} y={0.02} count={28} />
      <RibbonBand radius={0.735} y={0.18} height={0.06} color="#f472b6" />

      {flowerPositions.map((pos, i) => (
        <SugarFlower
          key={i}
          position={[pos.x, 0.36, pos.z]}
          color={i % 2 === 0 ? "#f9a8d4" : "#fecdd3"}
          scale={1.1}
        />
      ))}

      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.52, 0.54, 0.32, 48, 1, false, cutStart, cutLength]} />
        <meshPhysicalMaterial color="#e9d5ff" roughness={0.32} metalness={0.05} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <DripRing radius={0.52} y={0.72} color="#f3e8ff" count={16} />
      <PearlString radius={0.53} y={0.42} count={22} />
      <RibbonBand radius={0.53} y={0.56} height={0.05} color="#c084fc" />

      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.32, 0.34, 0.28, 48, 1, false, cutStart, cutLength]} />
        <meshPhysicalMaterial color="#fff8ee" roughness={0.32} metalness={0.05} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <DripRing radius={0.32} y={1.0} color="#fef3c7" count={14} />
      <PearlString radius={0.33} y={0.74} count={18} />

      <mesh position={[0, 0.72, 0]}>
        <torusGeometry args={[0.325, 0.008, 8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.15} emissive="#d4af37" emissiveIntensity={0.2} />
      </mesh>

      {isCutOpen && (
        <mesh position={[0.36, 0.18, 0]} rotation={[0, -Math.PI / 8, 0]}>
          <planeGeometry args={[0.72, 0.36]} />
          <meshStandardMaterial color="#fef0f5" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 48]} />
        <meshPhysicalMaterial color="#fdf4ff" roughness={0.15} metalness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <torusGeometry args={[0.85, 0.008, 8, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.15} emissive="#d4af37" emissiveIntensity={0.15} />
      </mesh>

      {candlePositions.map((pos, i) => (
        <Candle
          key={i}
          x={pos.x}
          z={pos.z}
          lit={candlesLit[i] ?? false}
          index={i}
          extinguishing={extinguishing}
        />
      ))}

      <mesh position={[0, 1.08, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhysicalMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.4}
          clearcoat={0.8}
        />
      </mesh>

      {cutProgress > 0 && <CakeSlice progress={cutProgress} />}
    </group>
  );
}

function AmbientFloaters({ reducedMotion }: { reducedMotion: boolean }) {
  const petalCount = reducedMotion ? 5 : 12;
  const petals = useMemo(
    () =>
      Array.from({ length: petalCount }, () => ({
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 2.5 - 0.5,
        z: (Math.random() - 0.5) * 3,
        speed: 0.3 + Math.random() * 0.4,
        color: ["#f9a8d4", "#e9d5ff", "#fde68a"][Math.floor(Math.random() * 3)],
      })),
    [petalCount]
  );

  return (
    <>
      {petals.map((p, i) => (
        <Float key={i} speed={p.speed} rotationIntensity={1.5} floatIntensity={2}>
          <mesh position={[p.x, p.y, p.z]}>
            <circleGeometry args={[0.025, 8]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function CameraRig({ phase }: { phase: CakePhase }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const baseY = 1.2 + Math.sin(t * 0.3) * 0.04;
    const baseZ = phase === "wishing" ? 2.1 : 2.8;
    const baseX = Math.sin(t * 0.15) * 0.15;

    camera.position.x += (baseX - camera.position.x) * 0.02;
    camera.position.y += (baseY - camera.position.y) * 0.02;
    camera.position.z += (baseZ - camera.position.z) * 0.02;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

interface CakeSceneProps {
  phase: CakePhase;
  candlesLit: boolean[];
  extinguishing: boolean;
  cutProgress: number;
  reducedMotion?: boolean;
}

export default function CakeScene({
  phase,
  candlesLit,
  extinguishing,
  cutProgress,
  reducedMotion = false,
}: CakeSceneProps) {
  const allLit = candlesLit.every(Boolean);
  const dimmed = phase === "wishing" || phase === "blown" || phase === "cutting" || phase === "cut";

  return (
    <Canvas
      camera={{ position: [0, 1.2, 2.8], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
      dpr={reducedMotion ? 1 : [1, 1.8]}
    >
      <ambientLight intensity={allLit && !dimmed ? 0.35 : dimmed ? 0.15 : 0.85} color="#fdf4ff" />

      <directionalLight
        position={[2, 4, 2]}
        intensity={allLit ? 0.5 : dimmed ? 0.2 : 1.1}
        color="#fde68a"
      />

      <pointLight position={[-2, 1.5, -2]} intensity={0.4} color="#c084fc" />
      <pointLight position={[0, 2.5, 1]} intensity={0.3} color="#fbcfe8" />

      <CakeMesh candlesLit={candlesLit} extinguishing={extinguishing} cutProgress={cutProgress} />

      {!reducedMotion && <AmbientFloaters reducedMotion={reducedMotion} />}

      {!reducedMotion && (
        <Sparkles count={dimmed ? 40 : 20} scale={4} size={2} speed={0.3} opacity={0.6} color="#fde68a" />
      )}

      <CameraRig phase={phase} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.5}
      />

      {!reducedMotion && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette eskil={false} offset={0.15} darkness={0.5} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
