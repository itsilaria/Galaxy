"use client";

import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGalaxyStore } from "@/store/useGalaxyStore";
import { Mesh } from "three";

export const GalaxyEffects: React.FC = () => {
  const secrets = useGalaxyStore((state) => state.secrets);
  const selectSecret = useGalaxyStore((state) => state.selectSecret);
  const fetchSecrets = useGalaxyStore((state) => state.fetchSecrets);
  const refs = useRef<Record<string, Mesh>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  // Change cursor style on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered]);

  useFrame(() => {
    secrets.forEach((secret) => {
      const mesh = refs.current[secret.id];
      if (mesh) {
        const idNum = parseInt(secret.id) || secret.id.charCodeAt(0);
        const pulse = 1 + Math.sin(Date.now() / 500 + idNum) * 0.15;
        const hover = hovered === secret.id ? 1.4 : 1;
        const base = secret.isSupernova ? 1.5 : 1;
        const s = pulse * hover * base;
        mesh.scale.set(s, s, s);
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
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(secret.id);
          }}
          onPointerOut={() => setHovered(null)}
        >
          <sphereGeometry args={[secret.isSupernova ? 0.4 : 0.25, 16, 16]} />
          <meshStandardMaterial
            color={secret.color || (secret.isMock ? "#888888" : "#ffd700")}
            emissive={secret.color || (secret.isMock ? "#888888" : "#ffd700")}
            emissiveIntensity={hovered === secret.id ? 1.5 : (secret.isSupernova ? 1.2 : 0.7)}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </>
  );
};
