import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GalaxyEffects } from "./GalaxyEffects";

export const Scene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      {/* Luci */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Sfondo stellato */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Stelle animate, clusterizzate e cliccabili */}
      <GalaxyEffects />

      {/* Controlli camera */}
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};
