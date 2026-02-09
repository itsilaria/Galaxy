import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGalaxyStore, Secret } from "./useGalaxyStore";
import { Vector3 } from "three";

// Questa funzione sposta leggermente le stelle vicine tra loro (clustering soft) e fa pulsare il glow
export const GalaxyEffects: React.FC = () => {
  const secrets = useGalaxyStore((state) => state.secrets);
  const refs = useRef<Record<string, any>>({}); // memorizza i mesh delle stelle

  useFrame(() => {
    secrets.forEach((secret) => {
      const mesh = refs.current[secret.id];
      if (mesh) {
        // effetto pulsazione
        const scale = 1 + Math.sin(Date.now() / 500 + parseInt(secret.id)) * 0.2;
        mesh.scale.set(scale, scale, scale);

        // clustering soft: le stelle si attraggono leggermente verso il centro
        const target = new Vector3(0, 0, 0);
        const pos = mesh.position.clone();
        const dir = target.sub(pos).multiplyScalar(0.002); // velocità minima
        mesh.position.add(dir);
      }
    });
  });

  return (
    <>
      {secrets.map((secret) => (
        <mesh
          key={secret.id}
          ref={(el) => (refs.current[secret.id] = el)}
          position={secret.position}
        >
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={secret.isMock ? "gray" : "yellow"}
            emissive={secret.isMock ? "gray" : "yellow"}
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </>
  );
};
