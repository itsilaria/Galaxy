'use client';

import { useEffect, useState, memo } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';

function Star({ secret }: any) {
  const openSecret = useGalaxyStore(s => s.openSecret);

  return (
    <mesh
      position={secret.position}
      onPointerDown={(e) => {
        e.stopPropagation(); // 🔴 FONDAMENTALE
        openSecret(secret);
      }}
    >
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color={secret.color} emissive={secret.color} emissiveIntensity={0.6} />
    </mesh>
  );
}

const StarField = memo(() => {
  const [secrets, setSecrets] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/secrets')
      .then(res => res.json())
      .then(data => setSecrets(data.secrets))
      .catch(console.error);
  }, []);

  return (
    <>
      {secrets.map(secret => (
        <Star key={secret.id} secret={secret} />
      ))}
    </>
  );
});

export default StarField;
