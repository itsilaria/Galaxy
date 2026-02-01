'use client';

import { useRef, useMemo, memo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

const SupernovaStar = memo(({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const glowMesh = useRef<THREE.Mesh>(null!);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const isSelected = useGalaxyStore(s => s.selectedSecret?.id === secret.id);

    useFrame((state, delta) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        const pulse = 1 + Math.sin(t * 4 + secret.timestamp) * 0.4;
        const scale = (isSelected ? 3.0 : pulse) * 2.5;
        mesh.current.scale.setScalar(scale);
        if (glowMesh.current) {
            glowMesh.current.scale.setScalar(scale * 1.5);
            glowMesh.current.rotation.z -= delta * 0.5;
        }
        mesh.current.rotation.x += delta * 0.3;
        mesh.current.rotation.y += delta * 0.4;
    });

    return (
        <group position={new THREE.Vector3(...secret.position)}>
            {/* 
                CRITICAL FIX: visible={false} prevents raycasting.
                Use transparent/opacity: 0 instead.
                Increased hit radius for better mobile experience.
            */}
            <mesh
                onPointerUp={(e) => {
                    e.stopPropagation();
                    selectSecret(secret);
                }}
            >
                <sphereGeometry args={[2.0, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <mesh ref={glowMesh} raycast={() => null}>
                <ringGeometry args={[0.3, 0.4, 32]} />
                <meshBasicMaterial color={secret.color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={mesh} raycast={() => null}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected ? '#ffffff' : secret.color}
                    emissive={isSelected ? '#ffffff' : secret.color}
                    emissiveIntensity={isSelected ? 5 : 4.0}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
});

SupernovaStar.displayName = 'SupernovaStar';

export default function StarField() {
    const secrets = useGalaxyStore((state) => state.secrets);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const selectedId = useGalaxyStore(s => s.selectedSecret?.id);

    const standardStars = useMemo(() => secrets.filter(s => s.starType !== 'supernova'), [secrets]);
    const supernovas = useMemo(() => secrets.filter(s => s.starType === 'supernova'), [secrets]);

    const hitMeshRef = useRef<THREE.InstancedMesh>(null!);
    const visualMeshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => standardStars.map(s => new THREE.Color(s.color)), [standardStars]);

    useEffect(() => {
        if (!visualMeshRef.current || !hitMeshRef.current) return;
        standardStars.forEach((star, i) => {
            dummy.position.set(...star.position);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            visualMeshRef.current.setMatrixAt(i, dummy.matrix);
            hitMeshRef.current.setMatrixAt(i, dummy.matrix);
            visualMeshRef.current.setColorAt(i, colors[i]);
        });
        visualMeshRef.current.instanceMatrix.needsUpdate = true;
        hitMeshRef.current.instanceMatrix.needsUpdate = true;
        if (visualMeshRef.current.instanceColor) visualMeshRef.current.instanceColor.needsUpdate = true;
    }, [standardStars, colors, dummy]);

    useFrame((state) => {
        if (!visualMeshRef.current || !hitMeshRef.current) return;
        const t = state.clock.getElapsedTime();

        for (let i = 0; i < standardStars.length; i++) {
            const star = standardStars[i];
            const isSelected = selectedId === star.id;

            const pulse = 1 + Math.sin(t * 2 + star.timestamp) * 0.15;
            const scale = (isSelected ? 3.5 : pulse);

            dummy.position.set(...star.position);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            visualMeshRef.current.setMatrixAt(i, dummy.matrix);
            hitMeshRef.current.setMatrixAt(i, dummy.matrix);

            visualMeshRef.current.setColorAt(i, isSelected ? COLOR_WHITE : colors[i]);
        }
        visualMeshRef.current.instanceMatrix.needsUpdate = true;
        hitMeshRef.current.instanceMatrix.needsUpdate = true;
        if (visualMeshRef.current.instanceColor) visualMeshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            {/* INTERACTION LAYER - LARGE TRANSPARENT SPHERES (OPACITY 0) */}
            <instancedMesh
                ref={hitMeshRef}
                args={[null as any, null as any, standardStars.length]}
                onPointerUp={(e) => {
                    e.stopPropagation();
                    if (e.instanceId !== undefined) {
                        selectSecret(standardStars[e.instanceId]);
                    }
                }}
            >
                <sphereGeometry args={[1.5, 6, 6]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </instancedMesh>

            {/* VISUAL LAYER - RENDER ONLY */}
            <instancedMesh
                ref={visualMeshRef}
                args={[null as any, null as any, standardStars.length]}
                raycast={() => null}
            >
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial toneMapped={false} />
            </instancedMesh>

            {supernovas.map((secret) => (
                <SupernovaStar key={secret.id} secret={secret} />
            ))}
        </group>
    );
}
