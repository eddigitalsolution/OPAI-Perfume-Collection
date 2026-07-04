"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesProps {
  count?: number;
  theme?: "raining" | "beach" | "city";
}

export default function Particles({ count = 300, theme = "beach" }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  // Generate random positions and drift factors
  const [positions, driftFactors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const factors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread particles
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Drift multipliers
      factors[i * 3] = Math.random() * 0.02 + 0.005;     // X speed
      factors[i * 3 + 1] = Math.random() * 0.02 + 0.01;   // Y speed
      factors[i * 3 + 2] = Math.random() * 0.02 + 0.005;   // Z speed
    }
    return [pos, factors];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      if (theme === "raining") {
        // Fast vertical falling rain drops
        posAttr.array[idx] += Math.sin(time * 0.2 + idx) * 0.002;
        posAttr.array[idx + 1] -= driftFactors[idx + 1] * 3.2; // Rapid fall
        posAttr.array[idx + 2] += Math.cos(time * 0.2 + idx) * 0.002;

        // Wrap from bottom to top
        if (posAttr.array[idx + 1] < -5) {
          posAttr.array[idx + 1] = 5;
          posAttr.array[idx] = (Math.random() - 0.5) * 15;
          posAttr.array[idx + 2] = (Math.random() - 0.5) * 15;
        }
      } else if (theme === "city") {
        // Fast horizontal neon light streaks (traffic/busy city flow)
        posAttr.array[idx] += driftFactors[idx] * 4.5; // Rapid horizontal flow
        posAttr.array[idx + 1] += Math.sin(time * 0.5 + idx) * 0.005; // tiny sway
        posAttr.array[idx + 2] += Math.cos(time * 0.5 + idx) * 0.005;

        // Wrap horizontally
        if (posAttr.array[idx] > 7.5) {
          posAttr.array[idx] = -7.5;
          posAttr.array[idx + 1] = (Math.random() - 0.5) * 10;
          posAttr.array[idx + 2] = (Math.random() - 0.5) * 15;
        }
      } else {
        // Sunshine beach: slow golden sunshine glints rising & swaying
        posAttr.array[idx] += Math.sin(time * 0.5 + idx) * driftFactors[idx] * 0.3;
        posAttr.array[idx + 1] += driftFactors[idx + 1] * 0.35; // Gentle upward float
        posAttr.array[idx + 2] += Math.cos(time * 0.5 + idx) * driftFactors[idx + 2] * 0.3;

        // Wrap from top to bottom
        if (posAttr.array[idx + 1] > 5) {
          posAttr.array[idx + 1] = -5;
          posAttr.array[idx] = (Math.random() - 0.5) * 15;
          posAttr.array[idx + 2] = (Math.random() - 0.5) * 15;
        }
      }
    }
    posAttr.needsUpdate = true;
  });

  // Dynamic particle appearance mapping
  const particleConfig = useMemo(() => {
    switch (theme) {
      case "raining":
        return {
          color: "#9abce6",
          size: 0.025,
          opacity: 0.55,
        };
      case "city":
        return {
          color: "#ff0088", // Neon Pink/Rose light trail
          size: 0.05,
          opacity: 0.8,
        };
      case "beach":
      default:
        return {
          color: "#ffd966", // Warm sunny beach glares
          size: 0.08,
          opacity: 0.7,
        };
    }
  }, [theme]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={particleConfig.color}
        size={particleConfig.size}
        transparent
        opacity={particleConfig.opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}


