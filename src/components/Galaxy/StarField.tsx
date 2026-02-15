'use client';
import { useRef, useMemo, memo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

export default function StarField() {
  const visualMeshRef = useRef<THREE.InstancedMesh>(null);
  const hitMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const secrets = useGalaxyStore(s => s.secrets);
  const selectSecret = useGalaxyStore(s => s.selectSecret);

  useEffect(() => {
    if (!visualMeshRef.current || !hitMeshRef.current) return;

    secrets.forEach((secret, i) => {
      dummy.position.set(...secret.position);
      dummy.updateMatrix();
      visualMeshRef.current!.setMatrixAt(i, dummy.matrix);
      hitMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    visualMeshRef.current.instanceMatrix.needsUpdate = true;
    hitMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [secrets, dummy]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && secrets[e.instanceId]) {
      console.log('Clicked star:', e.instanceId, secrets[e.instanceId]);
      selectSecret(secrets[e.instanceId]);
    }
  };

  // Don't render if no secrets
  if (!secrets || secrets.length === 0) {
    return null;
  }

  return (
    <group>
      {/* INTERACTION LAYER - Hitbox MOLTO più grande */}
      <instancedMesh
        ref={hitMeshRef}
        args={[undefined, undefined, secrets.length]}
        onClick={handleClick}
      >
        <sphereGeometry args={[6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>

      {/* VISUAL LAYER - Stelle MOLTO più grandi e visibili */}
      <instancedMesh
        ref={visualMeshRef}
        args={[undefined, undefined, secrets.length]}
      >
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color={COLOR_WHITE} />
      </instancedMesh>
    </group>
  );
}
