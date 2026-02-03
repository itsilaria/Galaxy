'use client';
import { useRef, useMemo, memo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

const SupernovaStar = memo(({ secret, isMobile }: { secret: Secret; isMobile: boolean }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const selectSecret = useGalaxyStore(s => s.selectSecret);
  const positionVec = useMemo(() => new THREE.Vector3(...secret.position), [secret.position]);
  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);

  // Loop di rotazione con limite FPS su mobile
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const rotationSpeed = isMobile ? 0.1 : 0.4;
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

SupernovaStar.displayName = 'SupernovaStar';

export default function StarField() {
  const visualMeshRef = useRef<THREE.InstancedMesh>(null);
  const hitMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const standardStars = useGalaxyStore(s => s.stars);
  
  const [isMobile, setIsMobile] = useState(false);
  const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);
  const selectSecret = useGalaxyStore(s => s.selectSecret);

  // Detect mobile
  useEffect(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  // Riduci numero stelle su mobile
  const starsToRender = isMobile ? standardStars.slice(0, 300) : standardStars;

  useEffect(() => {
    if (!visualMeshRef.current || !hitMeshRef.current) return;

    starsToRender.forEach((star, i) => {
      dummy.position.set(...star.position);
      dummy.updateMatrix();
      visualMeshRef.current!.setMatrixAt(i, dummy.matrix);
      hitMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    visualMeshRef.current.instanceMatrix.needsUpdate = true;
    hitMeshRef.current.instanceMatrix.needsUpdate = true;

    return () => {
      // Cleanup animazioni
      if (visualMeshRef.current) visualMeshRef.current.instanceMatrix.needsUpdate = false;
      if (hitMeshRef.current) hitMeshRef.current.instanceMatrix.needsUpdate = false;
    };
  }, [starsToRender, dummy]);

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
        args={[undefined, undefined, starsToRender.length]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </instancedMesh>

      {/* VISUAL LAYER */}
      <instancedMesh
        ref={visualMeshRef}
        args={[undefined, undefined, starsToRender.length]}
      >
        <sphereGeometry args={[2.5, 8, 8]} />
        <meshBasicMaterial color={COLOR_WHITE} />
      </instancedMesh>
    </group>
  );
}
