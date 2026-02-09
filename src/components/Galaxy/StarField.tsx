'use client';

import { useEffect, memo } from 'react';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

function Star({ secret }: { secret: Secret }) {
  const selectSecret = useGalaxyStore(s => s.selectSecret);

  return (
    <mesh
      position={secret.position}
      onPointerDown={(e) => {
        e.stopPropagation(); // 🔴 FONDAMENTALE
        selectSecret(secret);
      }}
    >
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial
        color={secret.color}
        emissive={secret.color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

const StarField = memo(() => {
  const secrets = useGalaxyStore(s => s.secrets);
  const fetchSecrets = useGalaxyStore(s => s.fetchSecrets);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  return (
    <>
      {secrets.map((secret) => (
        <Star key={secret.id} secret={secret} />
      ))}
    </>
  );
});

StarField.displayName = 'StarField';

export default StarField;
