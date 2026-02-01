'use client';

import { useRef, useMemo, memo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

const SupernovaStar = memo(({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const glowMesh = useRef<THREE.Mesh>(null!);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const isSelected = useGalaxyStore(s => s.selectedSecret?.id === secret.id);

    const positionVec = useMemo(() => new THREE.Vector3(...secret.position), [secret.position]);
    const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);

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

        // Only trigger if movement is less than 10 pixels (not a drag)
        if (distance < 10) {
            selectSecret(secret);
        }
        setPointerDownPos(null);
    };

    return (
        <group position={positionVec}>
            <mesh
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <sphereGeometry args={[3, 16, 16]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

            <mesh ref={glowMesh}>
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshBasicMaterial color={secret.color} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>

            <mesh ref={mesh}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected ? '#ffffff' : secret.color}
                    emissive={isSelected ? '#ffffff' : secret.color}
                    emissiveIntensity={isSelected ? 6 : 5.0}
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

    const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);

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

            const pulse = 1 + Math.sin(t * 2 + star.timestamp) * 0.2;
            const scale = (isSelected ? 4.0 : pulse);

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

        // Only trigger if movement is less than 10 pixels
        if (distance < 10) {
            selectSecret(standardStars[e.instanceId]);
        }
        setPointerDownPos(null);
    };

    return (
        <group>
            <instancedMesh
                ref={hitMeshRef}
                args={[null as any, null as any, standardStars.length]}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <sphereGeometry args={[2.5, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </instancedMesh>

            <instancedMesh
                ref={visualMeshRef}
                args={[null as any, null as any, standardStars.length]}
            >
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial
                    toneMapped={false}
                    emissive="#ffffff"
                    emissiveIntensity={3.5}
                />
            </instancedMesh>

            {supernovas.map((secret) => (
                <SupernovaStar key={secret.id} secret={secret} />
            ))}
        </group>
    );
}
