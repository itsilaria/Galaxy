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
            {/* Larger invincible hit area for supernovas */}
            <mesh
                visible={false}
                onPointerUp={(e) => {
                    e.stopPropagation();
                    selectSecret(secret);
                }}
            >
                <sphereGeometry args={[1, 8, 8]} />
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

    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => standardStars.map(s => new THREE.Color(s.color)), [standardStars]);

    useEffect(() => {
        if (!meshRef.current) return;
        standardStars.forEach((star, i) => {
            dummy.position.set(...star.position);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            meshRef.current.setColorAt(i, colors[i]);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [standardStars, colors, dummy]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        for (let i = 0; i < standardStars.length; i++) {
            const star = standardStars[i];
            const isSelected = selectedId === star.id;

            const pulse = 1 + Math.sin(t * 2 + star.timestamp) * 0.15;
            const scale = isSelected ? 3.5 : pulse;

            dummy.position.set(...star.position);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            meshRef.current.setColorAt(i, isSelected ? COLOR_WHITE : colors[i]);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <group>
            {/* Hit area layer (invisible larger spheres) */}
            <instancedMesh
                args={[null as any, null as any, standardStars.length]}
                onPointerUp={(e) => {
                    e.stopPropagation();
                    if (e.instanceId !== undefined) {
                        selectSecret(standardStars[e.instanceId]);
                    }
                }}
            >
                <sphereGeometry args={[0.6, 6, 6]} />
                <meshBasicMaterial visible={false} />
            </instancedMesh>

            {/* Visual layer (no raycasting for performance and overlap safety) */}
            <instancedMesh
                ref={meshRef}
                args={[null as any, null as any, standardStars.length]}
                raycast={() => null}
            >
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial toneMapped={false} />
            </instancedMesh>

            {supernovas.map((secret) => (
                <SupernovaStar key={secret.id} secret={secret} />
            ))}
        </group>
    );
}
