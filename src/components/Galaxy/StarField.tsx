'use client';

import { useRef, useMemo, memo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';
import { Instances, Instance } from '@react-three/drei';

const SupernovaStar = memo(({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const glowMesh = useRef<THREE.Mesh>(null!);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const isSelected = useGalaxyStore(s => s.selectedSecret?.id === secret.id);

    useFrame((state, delta) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        const scale = (1 + Math.sin(t * 4 + secret.timestamp) * 0.4) * 2.5;
        const currentScale = isSelected ? scale * 2.5 : scale;
        mesh.current.scale.setScalar(currentScale);
        if (glowMesh.current) {
            glowMesh.current.scale.setScalar(currentScale * 1.5);
            glowMesh.current.rotation.z -= delta * 0.5;
        }
        mesh.current.rotation.x += delta * 0.3;
        mesh.current.rotation.y += delta * 0.4;
    });

    return (
        <group position={new THREE.Vector3(...secret.position)}>
            <mesh
                visible={false}
                onClick={(e) => {
                    e.stopPropagation();
                    selectSecret(secret);
                }}
            >
                <sphereGeometry args={[4, 8, 8]} />
            </mesh>

            <mesh ref={glowMesh}>
                <ringGeometry args={[0.3, 0.4, 32]} />
                <meshBasicMaterial color={secret.color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={mesh}>
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

const MovingInstance = ({ secret, isSelected }: { secret: Secret; isSelected: boolean }) => {
    const ref = useRef<any>(null!);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime();
        const pulse = 1 + Math.sin(t * 2 + secret.timestamp) * 0.2;
        const scale = isSelected ? 2.5 : pulse;
        ref.current.scale.setScalar(scale);
    });

    return (
        <Instance
            ref={ref}
            position={new THREE.Vector3(...secret.position)}
            color={isSelected ? '#ffffff' : secret.color}
            onClick={(e: any) => {
                e.stopPropagation();
                // We use a custom event dispatch since Instance doesn't have native onClick sometimes depending on drei version
                // But in modern drei it works.
            }}
        />
    );
};

export default function StarField() {
    const secrets = useGalaxyStore((state) => state.secrets);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const selectedId = useGalaxyStore(s => s.selectedSecret?.id);

    const standardStars = useMemo(() => secrets.filter(s => s.starType !== 'supernova'), [secrets]);
    const supernovas = useMemo(() => secrets.filter(s => s.starType === 'supernova'), [secrets]);

    return (
        <group>
            {/* GPU Instanced Standard Stars - High Performance */}
            <Instances range={standardStars.length}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial emissiveIntensity={1.5} toneMapped={false} />
                {standardStars.map((secret) => (
                    <group key={secret.id} position={new THREE.Vector3(...secret.position)}>
                        {/* Hidden hit box for interaction - simple sphere */}
                        <mesh
                            visible={false}
                            onClick={(e) => {
                                e.stopPropagation();
                                selectSecret(secret);
                            }}
                        >
                            <sphereGeometry args={[1.5, 4, 4]} />
                        </mesh>
                        <MovingInstance secret={secret} isSelected={selectedId === secret.id} />
                    </group>
                ))}
            </Instances>

            {/* Individual Supernova Stars - High Quality */}
            {supernovas.map((secret) => (
                <SupernovaStar key={secret.id} secret={secret} />
            ))}
        </group>
    );
}

SupernovaStar.displayName = 'SupernovaStar';
