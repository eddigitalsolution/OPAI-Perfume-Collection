"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MistProps {
  theme?: "raining" | "beach" | "city";
}

export default function Mist({ theme = "beach" }: MistProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow down rotation slightly for Raining/stormy days, speed up slightly for dynamic city smog
    const speedMult = theme === "raining" ? 0.015 : theme === "city" ? 0.035 : 0.02;
    
    groupRef.current.rotation.y = time * speedMult;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * (theme === "raining" ? 0.05 : 0.08);

    // Slowly pulsate scale of individual mist meshes
    groupRef.current.children.forEach((child, index) => {
      const scaleOffset = Math.sin(time * 0.2 + index) * (theme === "city" ? 0.12 : 0.08) + 1.0;
      child.scale.set(scaleOffset, scaleOffset, scaleOffset);
    });
  });

  const config = useMemo(() => {
    switch (theme) {
      case "raining":
        return {
          c1: "#475569", // Slate grey storm cloud
          o1: 0.06,
          c2: "#1e293b",
          o2: 0.08,
          c3: "#64748b",
          o3: 0.04,
        };
      case "city":
        return {
          c1: "#ff00aa", // Neon magenta sky-reflection smog
          o1: 0.025,
          c2: "#00eedd", // Neon cyan sky-reflection smog
          o2: 0.02,
          c3: "#1a0d2e", // Deep purple cityscape dark base
          o3: 0.04,
        };
      case "beach":
      default:
        return {
          c1: "#ffd966", // Warm beach haze
          o1: 0.025,
          c2: "#ffffff", // Bright sea foam white
          o2: 0.02,
          c3: "#ffeebb", // Sunshine glare
          o3: 0.03,
        };
    }
  }, [theme]);

  return (
    <group ref={groupRef}>
      {/* Mist Cloud 1 */}
      <mesh position={[-4, 2, -5]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial
          color={config.c1}
          transparent
          opacity={config.o1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mist Cloud 2 */}
      <mesh position={[4, -1, -6]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial
          color={config.c2}
          transparent
          opacity={config.o2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mist Cloud 3 */}
      <mesh position={[0, 3, -8]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color={config.c3}
          transparent
          opacity={config.o3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}


