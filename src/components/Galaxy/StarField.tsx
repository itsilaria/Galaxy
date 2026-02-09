import React, { useEffect } from "react";
import { useGalaxyStore } from "./useGalaxyStore";
import { Sphere } from "@react-three/drei";

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
          args={[0.2, 16, 16]}
          position={[Math.random() * 10 - 5, Math.random() * 5, Math.random() * 10 - 5]}
          onPointerDown={(e) => {
            e.stopPropagation();
            selectSecret(secret);
          }}
        >
          <meshStandardMaterial
            color={secret.isMock ? "gray" : "yellow"}
            transparent
            opacity={0}
            attach="material"
            onUpdate={(self) => (self.opacity = 1)} // fade-in semplice
          />
        </Sphere>
      ))}
    </>
  );
};
