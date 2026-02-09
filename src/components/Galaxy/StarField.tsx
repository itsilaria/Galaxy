import React, { useEffect } from "react";
import { useGalaxyStore } from "./useGalaxyStore";
import { Sphere } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

export const StarField: React.FC = () => {
  const secrets = useGalaxyStore((state) => state.secrets);
  const selectSecret = useGalaxyStore((state) => state.selectSecret);
  const fetchSecrets = useGalaxyStore((state) => state.fetchSecrets);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  return (
    <>
      {secrets.map((secret) => (
        <Sphere
          key={secret.id}
          args={[0.25, 16, 16]}
          position={secret.position}
          onPointerDown={(e) => {
            e.stopPropagation();
            selectSecret(secret);
          }}
        >
          <meshStandardMaterial
            color={secret.isMock ? "gray" : "yellow"}
            emissive={secret.isMock ? "gray" : "yellow"}
            emissiveIntensity={0.5}
            transparent
            opacity={0}
            onUpdate={(self: MeshStandardMaterial) => (self.opacity = 1)}
          />
        </Sphere>
      ))}
    </>
  );
};
