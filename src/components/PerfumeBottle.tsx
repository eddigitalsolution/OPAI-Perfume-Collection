"use client";

import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export interface BottleConfig {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  liquidColor: string;
  shape: "rect" | "cylinder" | "square" | "octagonal" | "oval";
  capMaterial: "gold" | "silver" | "marble" | "ceramic" | "wood";
  labelBg: string;
  labelTextColor: string;
  borderColor: string;
}

interface PerfumeBottleProps {
  config: BottleConfig;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}

// Map perfume IDs to their exact GLB file names
const MODEL_PATHS: Record<string, string> = {
  "summer-rock": "/3d asset/summer rock.glb",
  "man-in-the-mirror": "/3d asset/main in the mirror.glb",
  "rush-hour": "/3d asset/rush hour.glb",
};

// Inner component that actually calls useGLTF (must be inside Suspense)
function BottleModel({
  modelPath,
  onLoaded,
}: {
  modelPath: string;
  onLoaded: (scene: THREE.Group) => void;
}) {
  const { scene } = useGLTF(modelPath, true);

  // Clone scene to allow multiple independent instances
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  // Enable shadows
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    onLoaded(clonedScene);
  }, [clonedScene, onLoaded]);

  return <primitive object={clonedScene} />;
}

export default function PerfumeBottle({
  config,
  position,
  isHovered,
  isSelected,
  onHover,
  onClick,
}: PerfumeBottleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Pointer handlers
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
    document.body.style.cursor = "default";
  };

  // Resolve model path
  const modelPath = MODEL_PATHS[config.id] ?? `/3d asset/${config.id.replace(/-/g, " ")}.glb`;

  // Smooth animation state
  const floatOffset = useMemo(() => Math.random() * 100, []);
  const currentScale = useRef<number>(1);
  const rotationY = useRef<number>(0);

  const handleLoaded = useMemo(() => () => {}, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Hover scale interpolation
    const targetScale = hovered && !isSelected ? 1.12 : 1.0;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
    meshRef.current.scale.setScalar(currentScale.current);

    // 2. Float & sway (disabled when selected)
    if (!isSelected) {
      const yFloat = Math.sin(time * 0.8 + floatOffset) * 0.08;
      meshRef.current.position.y = position[1] + yFloat;

      const targetSwayX = state.pointer.y * 0.25;
      rotationY.current += 0.003; // slow rotation

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetSwayX,
        0.08
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotationY.current + state.pointer.x * 0.35,
        0.08
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -state.pointer.x * 0.15,
        0.08
      );
    } else {
      // In focus mode: centre and auto-spin
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.1);
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group
      ref={meshRef}
      position={isSelected ? [0, 0, 0] : position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Suspense fallback={null}>
        <BottleModel modelPath={modelPath} onLoaded={handleLoaded} />
      </Suspense>
    </group>
  );
}

// Preload all GLB models at module level for instant rendering
useGLTF.preload("/3d asset/summer rock.glb", true);
useGLTF.preload("/3d asset/main in the mirror.glb", true);
useGLTF.preload("/3d asset/rush hour.glb", true);

