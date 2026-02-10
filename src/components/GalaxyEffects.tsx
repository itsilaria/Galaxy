"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { Vector3, Mesh } from "three";

export const GalaxyEffects: React.FC = () => {
  const secrets = useGalaxyStore((state) => state.secrets);
  const selectSecret = useGalaxyStore((state) => state.selectSecret);
  const fetchSecrets = useGalaxyStore((state) => state.fetchSecrets);
  const refs = useRef<Record<string, Mesh>>({});

  // Fetch secrets from Redis on mount
  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  useFrame(() => {
    secrets.forEach((secret) => {
      const mesh = refs.current[secret.id];
      if (mesh) {
        const idNum = parseInt(secret.id) || secret.id.charCodeAt(0);
        const scale = 1 + Math.sin(Date.now() / 500 + idNum) * 0.2;
        const baseScale = secret.isSupernova ? 1.5 : 1;
        mesh.scale.set(
          scale * baseScale,
          scale * baseScale,
          scale * baseScale
        );
      }
    });
  });

  return (
    <>
      {secrets.map((secret) => (
        <mesh
          key={secret.id}
          ref={(el) => {
            if (el) refs.current[secret.id] = el;
          }}
          position={secret.position}
          onPointerDown={(e) => {
            e.stopPropagation();
            selectSecret(secret);
          }}
        >
          <sphereGeometry args={[secret.isSupernova ? 0.4 : 0.25, 16, 16]} />
          <meshStandardMaterial
            color={secret.color || (secret.isMock ? "#888888" : "#ffd700")}
            emissive={secret.color || (secret.isMock ? "#888888" : "#ffd700")}
            emissiveIntensity={secret.isSupernova ? 1.2 : 0.7}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </>
  );
};
