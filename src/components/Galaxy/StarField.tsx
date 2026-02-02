'use client';

import { useRef, useMemo, memo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

const SupernovaStar = memo(({ secret, mobileOverride }: { secret: Secret; mobileOverride: boolean }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const selectSecret = useGalaxyStore(s => s.selectSecret);

  const positionVec = useMemo(() => new THREE.Vector3(...secret.position), [secret.position]);
  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);

  // Loop di rotazione con limite FPS su mobile
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const rotationSpeed = mobileOverride ? 0.1 : 0.4;
    mesh.current.rotation.y += delta * rotationSpeed;
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setPointerDownPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!pointerDownPos) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) selectSecret(secret);
    setPointerDownPos(null);
  };

  return (
    <group position={positionVec}>
      <mesh
        ref={mesh}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default function StarField({ mobileOverride = false }: { mobileOverride?: boolean }) {
  const visualMeshRef = useRef<THREE.InstancedMesh>(null);
  const hitMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const standardStars = useGalaxyStore(s => s.stars);

  // Riduci numero stelle su mobile
  const starsToRender = mobileOverride ? standardStars.slice(0, 300) : standardStars;

  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);
  const selectSecret = useGalaxyStore(s => s.selectSecret);

  useEffect(() => {
    return () => {
      // Cleanup animazioni
      if (visualMeshRef.current) visualMeshRef.current.instanceMatrixAutoUpdate = false;
      if (hitMeshRef.current) hitMeshRef.current.instanceMatrixAutoUpdate = false;
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setPointerDownPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!pointerDownPos || e.instanceId === undefined) return;

    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) selectSecret(starsToRender[e.instanceId]);
    setPointerDownPos(null);
  };

  return (
    <group>
      {/* INTERACTION LAYER */}
      <instancedMesh
        ref={hitMeshRef}
        args={[null as any, null as any, starsToRender.length]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>

      {/* VISUAL LAYER */}
      <instancedMesh
        ref={visualMeshRef}
        args={[null as any, null as any, starsToRender.length]}
      >
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshBasicMaterial color={COLOR_WHITE} />
      </instancedMesh>
    </group>
  );
}
