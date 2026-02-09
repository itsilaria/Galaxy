"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGalaxyStore } from "./useGalaxyStore";
import { Vector3, Mesh } from "three";

export const GalaxyEffects: React.FC = () => {
  const secrets = useGalaxyStore((state) => state.secrets);
  const selectSecret = useGalaxyStore((state) => state.selectSecret);
  const refs = useRef<Record<string, Mesh>>({});

  useFrame(() => {
    secrets.forEach((secret) => {
      const mesh = refs.current[secret.id];
      if (mesh) {
        const scale = 1 + Math.sin(Date.now() / 500 + parseInt(secret.id)) * 0.2;
        mesh.scale.set(scale, scale, scale);

        const target = new Vector3(0, 0, 0);
        const pos = mesh.position.clone();
        const dir = target.sub(pos).multiplyScalar(0.002);
        mesh.position.add(dir);
      }
    });
  });

  return (
    <>
      {secrets.map((secret) => (
        <mesh
          key={secret.id}
          ref={(el) => {
            if (el) refs.current[secret.id] = el!;
          }}
          position={secret.position}
          onPointerDown={(e) => {
            e.stopPropagation();
            selectSecret(secret);
          }}
        >
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={secret.isMock ? "gray" : "yellow"}
            emissive={secret.isMock ? "gray" : "yellow"}
            emissiveIntensity={0.7}
            transparent
            opacity={0}
            onUpdate={(self) => (self.opacity = 1)}
          />
        </mesh>
      ))}
    </>
  );
};
