"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";
import PerfumeBottle from "./PerfumeBottle";
import Particles from "./Particles";
import Mist from "./Mist";
import { PERFUMES } from "@/data/perfumes";

// Floating layout positions for the 3 bottles
// Adjusted for better centering and spacing on desktop
const STAGGERED_POSITIONS: [number, number, number][] = [
  [-2.4, 0.0, -0.5],  // Bottle 0: SUMMER ROCK  (Left)
  [ 0.0, 0.2,  0.3],  // Bottle 1: MAN IN THE MIRROR (Centre, slightly forward)
  [ 2.4, 0.0, -0.5],  // Bottle 2: RUSH HOUR   (Right)
];

interface ThreeSceneProps {
  activeBottleId: string | null;
  hoveredBottleId: string | null;
  onHoverBottle: (id: string | null) => void;
  onClickBottle: (id: string) => void;
  theme: "raining" | "beach" | "city";
}

export default function ThreeScene({
  activeBottleId,
  hoveredBottleId,
  onHoverBottle,
  onClickBottle,
  theme,
}: ThreeSceneProps) {
  return (
    <div className={`canvas-container ${activeBottleId ? "focus-active" : ""}`}>
      <Canvas
        shadows={{ type: 0 /* PCFShadowMap */ }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent
            activeBottleId={activeBottleId}
            hoveredBottleId={hoveredBottleId}
            onHoverBottle={onHoverBottle}
            onClickBottle={onClickBottle}
            theme={theme}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface SceneContentProps {
  activeBottleId: string | null;
  hoveredBottleId: string | null;
  onHoverBottle: (id: string | null) => void;
  onClickBottle: (id: string) => void;
  theme: "raining" | "beach" | "city";
}

function SceneContent({
  activeBottleId,
  hoveredBottleId,
  onHoverBottle,
  onClickBottle,
  theme,
}: SceneContentProps) {
  const { size, camera } = useThree();
  const isMobile = size.width < 991;

  // Define colors based on activeTheme
  const themeColors = useMemo(() => {
    switch (theme) {
      case "raining":
        return {
          bg: "#0c0e12",
          ambient: "#8da2b5",
          rim: "#5c6d80",
          mouse: "#a5c1e0",
        };
      case "city":
        return {
          bg: "#040409",
          ambient: "#1b1e2e",
          rim: "#ff0077",
          mouse: "#00ffcc",
        };
      case "beach":
      default:
        return {
          bg: "#04161f",
          ambient: "#ffeec2",
          rim: "#f5ba63",
          mouse: "#ffdf94",
        };
    }
  }, [theme]);

  // Transition & Interaction state
  const [isInteractive, setIsInteractive] = useState(false);
  const [prevActiveBottleId, setPrevActiveBottleId] = useState<string | null>(null);
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const mouseLightRef = useRef<THREE.PointLight>(null);

  if (activeBottleId !== prevActiveBottleId) {
    setPrevActiveBottleId(activeBottleId);
    setIsInteractive(false);
  }

  useFrame((state) => {

    // 1. Light tracking mouse cursor for dynamic reflections
    if (mouseLightRef.current) {
      // Convert normalized screen pointer coordinates [-1, 1] to 3D position
      mouseLightRef.current.position.x = state.pointer.x * 4;
      mouseLightRef.current.position.y = state.pointer.y * 3;
    }

    // 2. Camera Lerping Transition
    const targetCamPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (activeBottleId !== null) {
      // Focus Mode — camera looks exactly where the bottle is
      if (isMobile) {
        // Mobile: bottle sits at Y=1.4, camera sits above looking straight at it
        targetCamPos.set(0, 1.4, 4.5);
        targetLookAt.set(0, 1.4, 0);
      } else {
        // Desktop: bottle at origin, camera straight ahead
        targetCamPos.set(0, 0, 3.8);
        targetLookAt.set(0, 0, 0);
      }
    } else {
      // Floating Mode Camera Settings (Parallax movement based on mouse)
      if (isMobile) {
        targetCamPos.set(state.pointer.x * 0.3, state.pointer.y * 0.2, 8.0);
        targetLookAt.set(state.pointer.x * 0.08, state.pointer.y * 0.05, 0);
      } else {
        targetCamPos.set(state.pointer.x * 0.5, state.pointer.y * 0.3, 6.5);
        targetLookAt.set(state.pointer.x * 0.12, state.pointer.y * 0.08, 0);
      }
    }

    if (!isInteractive) {
      // Perform smooth camera interpolation
      camera.position.lerp(targetCamPos, 0.05);
      currentLookAt.current.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt.current);

      // Lock controls target to the bottle focus point when in focus mode
      const distance = camera.position.distanceTo(targetCamPos);
      if (distance < 0.03) {
        setIsInteractive(true);
      }
    }
  });

  // OrbitControls target must match the bottle's world position
  const controlsTarget: [number, number, number] = useMemo(() => {
    if (activeBottleId !== null) {
      return isMobile ? [0, 1.4, 0] : [0, 0, 0];
    }
    return [0, 0, 0];
  }, [activeBottleId, isMobile]);

  return (
    <>
      {theme !== "beach" && <fog attach="fog" args={[themeColors.bg, 5, 20]} />}

      <PerspectiveCamera makeDefault fov={45} near={0.1} far={50} />

      {/* OrbitControls are only active when transition completes in focus mode */}
      {activeBottleId !== null && isInteractive && (
        <OrbitControls
          makeDefault
          target={controlsTarget}
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6.0}
          maxPolarAngle={Math.PI / 2 + 0.3} // Avoid viewing directly underneath
          minPolarAngle={Math.PI / 2 - 0.4} // Avoid viewing directly overhead
        />
      )}

      {/* LIGHTING SETUP */}
      {/* 1. Ambient light for general soft illumination */}
      <ambientLight intensity={0.25} color={themeColors.ambient} />

      {/* 2. Top-down main focus spotlight */}
      <spotLight
        position={[0, 8, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={6.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffffff"
      />

      {/* Dramatic Top Spotlight focused directly on the selected product */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.9}
        intensity={activeBottleId !== null ? 35.0 : 0.0}
        color={themeColors.rim}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Volumetric spotlight beam effect */}
      <VolumetricSpotlight
        active={activeBottleId !== null}
        color={themeColors.rim}
        isMobile={isMobile}
      />

      {/* 3. Rim Backlight for luxury glass outlines */}
      <pointLight position={[0, 2, -4]} intensity={8.0} color={themeColors.rim} />

      {/* 4. Mouse-tracking point light for interactive glass reflections */}
      <pointLight ref={mouseLightRef} position={[0, 0, 3]} intensity={4.0} color={themeColors.mouse} />

      {/* 5. Fill Light */}
      <directionalLight position={[-5, 3, 2]} intensity={1.5} color="#ffffff" />

      {/* 3D SCENE BACKGROUND EFFECTS */}
      <Particles count={250} theme={theme} />
      <Mist theme={theme} />

      {/* 6 BOTTLES WRAPPED IN INTERPOLATION CONTAINER */}
      {PERFUMES.map((perfume, index) => {
        const isSelected = activeBottleId === perfume.id;
        const isHidden = activeBottleId !== null && !isSelected;

        return (
          <BottleLayoutWrapper
            key={perfume.id}
            index={index}
            isSelected={isSelected}
            isHidden={isHidden}
            isMobile={isMobile}
          >
            <PerfumeBottle
              config={perfume}
              position={[0, 0, 0]}
              isHovered={hoveredBottleId === perfume.id}
              isSelected={isSelected}
              onHover={(hovered) => onHoverBottle(hovered ? perfume.id : null)}
              onClick={() => onClickBottle(perfume.id)}
            />
          </BottleLayoutWrapper>
        );
      })}

      {/* Contact Shadows underneath */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.5}
        scale={12}
        blur={2.4}
        far={4.5}
      />
    </>
  );
}

interface BottleLayoutWrapperProps {
  index: number;
  isSelected: boolean;
  isHidden: boolean;
  isMobile: boolean;
  children: React.ReactNode;
}

// Sub-component wrapper that interpolates positions based on state
function BottleLayoutWrapper({
  index,
  isSelected,
  isHidden,
  isMobile,
  children,
}: BottleLayoutWrapperProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Targets
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame(() => {
    if (!groupRef.current) return;

    if (isSelected) {
      // Desktop: bottle at origin — camera centres on it naturally
      // Mobile: bottle raised so it sits in the top 45vh panel
      if (isMobile) {
        targetPos.set(0, 1.4, 0);
        targetScale.setScalar(1.85); // Bigger focused bottle on mobile
      } else {
        targetPos.set(0, 0, 0);
        targetScale.setScalar(1.4);
      }
    } else if (isHidden) {
      // Fly away and dissolve out of screen
      const staggered = STAGGERED_POSITIONS[index];
      targetPos.set(staggered[0] * 3.5, staggered[1] - 3.5, -15);
      targetScale.set(0, 0, 0);
    } else {
      // Floating layout position
      const staggered = STAGGERED_POSITIONS[index];
      targetPos.set(staggered[0], staggered[1], staggered[2]);
      if (isMobile) {
        targetScale.set(2.3, 2.3, 2.3); // Bigger floating bottles on mobile
      } else {
        targetScale.set(1.6, 1.6, 1.6);
      }
    }

    // Lerp positions
    groupRef.current.position.lerp(targetPos, 0.06);
    groupRef.current.scale.lerp(targetScale, 0.06);
  });

  return <group ref={groupRef}>{children}</group>;
}

// Volumetric spotlight beam effect
function VolumetricSpotlight({
  active,
  color,
  isMobile,
}: {
  active: boolean;
  color: string;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const targetOpacity = active ? 0.09 + Math.sin(time * 1.5) * 0.02 : 0;

    // Smooth transition
    if (meshRef.current.material) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, active ? (isMobile ? 2.9 : 1.5) : 1.5, 0]}
      rotation={[0, 0, 0]}
    >
      <cylinderGeometry args={[0.1, 2.5, 9, 64, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
