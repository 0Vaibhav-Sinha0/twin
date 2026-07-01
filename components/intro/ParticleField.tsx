"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { INTRO_CONFIG } from "@/lib/introConfig";
import type { IntroPhase } from "./useIntroSequence";

// Sample points along letterforms for "Welcome, Twin"
// These are normalized UV coordinates [x, y] in -1..1 space
// representing the approximate stroke paths of the two words
function generateLetterPoints(count: number): Float32Array {
  const points: number[] = [];

  // We approximate the two words as a set of stroke segments
  // Row 1: "Welcome," centered around y = 0.18
  // Row 2: "Twin"    centered around y = -0.18
  const strokes: Array<[number, number, number, number]> = [
    // --- W ---
    [-0.72, 0.18, -0.68, 0.06], [-0.68, 0.06, -0.64, 0.16],
    [-0.64, 0.16, -0.60, 0.06], [-0.60, 0.06, -0.56, 0.18],
    // --- e ---
    [-0.52, 0.13, -0.44, 0.13], [-0.44, 0.13, -0.44, 0.10],
    [-0.44, 0.10, -0.48, 0.07], [-0.48, 0.07, -0.52, 0.10],
    [-0.52, 0.10, -0.52, 0.13],
    // --- l ---
    [-0.40, 0.19, -0.40, 0.07],
    // --- c ---
    [-0.32, 0.13, -0.36, 0.13], [-0.36, 0.13, -0.38, 0.10],
    [-0.38, 0.10, -0.36, 0.07], [-0.36, 0.07, -0.32, 0.07],
    // --- o ---
    [-0.28, 0.10, -0.28, 0.10],
    [-0.24, 0.13, -0.28, 0.13], [-0.28, 0.13, -0.30, 0.10],
    [-0.30, 0.10, -0.28, 0.07], [-0.28, 0.07, -0.24, 0.07],
    [-0.24, 0.07, -0.22, 0.10], [-0.22, 0.10, -0.24, 0.13],
    // --- m ---
    [-0.18, 0.13, -0.18, 0.07], [-0.18, 0.13, -0.14, 0.10],
    [-0.14, 0.10, -0.14, 0.07], [-0.14, 0.10, -0.10, 0.13],
    [-0.10, 0.13, -0.10, 0.07],
    // --- e ---
    [-0.06, 0.13, 0.02, 0.13], [0.02, 0.13, 0.02, 0.10],
    [0.02, 0.10, -0.02, 0.07], [-0.02, 0.07, -0.06, 0.10],
    [-0.06, 0.10, -0.06, 0.13],
    // --- , ---
    [0.06, 0.07, 0.06, 0.06], [0.06, 0.06, 0.04, 0.04],

    // --- T ---
    [-0.22, -0.12, 0.22, -0.12], [0.00, -0.12, 0.00, -0.28],
    // --- w ---
    [0.06, -0.18, 0.10, -0.28], [0.10, -0.28, 0.14, -0.20],
    [0.14, -0.20, 0.18, -0.28], [0.18, -0.28, 0.22, -0.18],
    // --- i ---
    [0.26, -0.18, 0.26, -0.28], [0.26, -0.14, 0.26, -0.13],
    // --- n ---
    [0.32, -0.18, 0.32, -0.28], [0.32, -0.18, 0.36, -0.18],
    [0.36, -0.18, 0.38, -0.21], [0.38, -0.21, 0.38, -0.28],
  ];

  for (let i = 0; i < count; i++) {
    const stroke = strokes[Math.floor(Math.random() * strokes.length)];
    const t = Math.random();
    const x = stroke[0] + (stroke[2] - stroke[0]) * t;
    const y = stroke[1] + (stroke[3] - stroke[1]) * t;
    // Add slight jitter so particles aren't perfectly on-line
    points.push(
      x + (Math.random() - 0.5) * 0.008,
      y + (Math.random() - 0.5) * 0.008,
      (Math.random() - 0.5) * 0.04
    );
  }

  return new Float32Array(points);
}

interface ParticleFieldProps {
  phase: IntroPhase;
}

export default function ParticleField({ phase }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ambientRef = useRef<THREE.Points | null>(null);
  const traceRef = useRef<THREE.Points | null>(null);
  const rafRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Timer());
  const phaseRef = useRef<IntroPhase>(phase);

  const { ambient, trace, colors } = INTRO_CONFIG;

  // Pre-generate target positions for trace particles (letter points)
  const traceTargets = useMemo(() => generateLetterPoints(trace.count), [trace.count]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rendererRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.01, 100);
    camera.position.z = 1;
    cameraRef.current = camera;

    // ── Ambient particles ──────────────────────────────────────────────
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPos = new Float32Array(ambient.count * 3);
    const ambientSpeeds = new Float32Array(ambient.count);

    for (let i = 0; i < ambient.count; i++) {
      ambientPos[i * 3]     = (Math.random() - 0.5) * 2.2;
      ambientPos[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
      ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      ambientSpeeds[i] = 0.3 + Math.random() * 0.7;
    }
    ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambientPos, 3));

    const ambientMat = new THREE.PointsMaterial({
      color: new THREE.Color(colors.electric),
      size: 0.006,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);
    ambientRef.current = ambientPoints;

    // ── Trace particles ────────────────────────────────────────────────
    const traceGeo = new THREE.BufferGeometry();
    // Start all trace particles at random positions (they'll move to letter targets)
    const traceStartPos = new Float32Array(trace.count * 3);
    for (let i = 0; i < trace.count; i++) {
      traceStartPos[i * 3]     = (Math.random() - 0.5) * 2.0;
      traceStartPos[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      traceStartPos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    const tracePosAttr = new THREE.BufferAttribute(traceStartPos.slice(), 3);
    traceGeo.setAttribute("position", tracePosAttr);

    const traceMat = new THREE.PointsMaterial({
      color: new THREE.Color(colors.particleCore),
      size: 0.01,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const tracePoints = new THREE.Points(traceGeo, traceMat);
    scene.add(tracePoints);
    traceRef.current = tracePoints;

    // ── Animation loop ─────────────────────────────────────────────────
    const ambientOriginals = ambientPos.slice();

    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      clockRef.current.update();
      const t = clockRef.current.getElapsed();
      const currentPhase = phaseRef.current;

      // --- Ambient particle float ---
      if (currentPhase !== "void") {
        const ap = ambientGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < ambient.count; i++) {
          ap.array[i * 3 + 1] = ambientOriginals[i * 3 + 1] +
            Math.sin(t * ambientSpeeds[i] * 0.4 + i) * 0.04;
          ap.array[i * 3] = ambientOriginals[i * 3] +
            Math.sin(t * ambientSpeeds[i] * 0.25 + i * 2.1) * 0.015;
        }
        ap.needsUpdate = true;

        // Fade in ambient
        if (ambientMat.opacity < 0.55) {
          ambientMat.opacity = Math.min(0.55, ambientMat.opacity + 0.008);
        }
      }

      // --- Trace particles converge on letter positions ---
      if (currentPhase === "tracing" || currentPhase === "stroke-resolve" || currentPhase === "hold" || currentPhase === "pulse") {
        const tp = traceGeo.attributes.position as THREE.BufferAttribute;
        let converging = false;
        for (let i = 0; i < trace.count; i++) {
          const tx = traceTargets[i * 3];
          const ty = traceTargets[i * 3 + 1];
          const tz = traceTargets[i * 3 + 2];
          const cx = tp.array[i * 3];
          const cy = tp.array[i * 3 + 1];
          const cz = tp.array[i * 3 + 2];

          const dx = tx - cx, dy = ty - cy, dz = tz - cz;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist > 0.002) converging = true;

          tp.array[i * 3]     += dx * 0.04;
          tp.array[i * 3 + 1] += dy * 0.04;
          tp.array[i * 3 + 2] += dz * 0.04;
          // Slight shimmer once close
          if (dist < 0.02) {
            tp.array[i * 3]     += (Math.random() - 0.5) * 0.002;
            tp.array[i * 3 + 1] += (Math.random() - 0.5) * 0.002;
          }
        }
        tp.needsUpdate = true;
        void converging; // suppress unused warning

        if (traceMat.opacity < 0.9) {
          traceMat.opacity = Math.min(0.9, traceMat.opacity + 0.025);
        }
      }

      // --- Drift away ---
      if (currentPhase === "drift" || currentPhase === "zoom") {
        const tp = traceGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < trace.count; i++) {
          tp.array[i * 3]     += (Math.random() - 0.5) * 0.008;
          tp.array[i * 3 + 1] += (Math.random() - 0.5) * 0.008 + 0.002;
          tp.array[i * 3 + 2] += (Math.random() - 0.5) * 0.004;
        }
        tp.needsUpdate = true;
        if (traceMat.opacity > 0) traceMat.opacity -= 0.025;
      }

      // --- Zoom: camera moves forward, ambient fades ---
      if (currentPhase === "zoom") {
        camera.position.z -= 0.018;
        if (ambientMat.opacity > 0) ambientMat.opacity -= 0.03;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    function onResize() {
      const c = canvasRef.current;
      if (!c) return;
      const w = c.clientWidth;
      const h = c.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      ambientGeo.dispose();
      ambientMat.dispose();
      traceGeo.dispose();
      traceMat.dispose();
    };
  }, [ambient, trace, colors, traceTargets]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
