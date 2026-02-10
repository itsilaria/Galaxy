"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GalaxyEffects } from "@/components/GalaxyEffects";
import CameraController from "@/components/Galaxy/CameraController";

export const Scene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4444ff" />
      <Suspense fallback={null}>
        <Stars
          radius={80}
          depth={60}
          count={4000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        {/* GalaxyEffects renders all secret stars (clickable) and handles pulsing animation */}
        <GalaxyEffects />
      </Suspense>
      <CameraController />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        autoRotate
        autoRotateSpeed={0.3}
        maxDistance={60}
        minDistance={5}
        enableDamping
        dampingFactor={0.05}
        makeDefault
      />
    </Canvas>
  );
};
