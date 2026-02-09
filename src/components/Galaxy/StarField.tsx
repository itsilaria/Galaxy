'use client';

import { useRef, useMemo, memo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

export default function StarField() {
    const secrets = useGalaxyStore((state) => state.secrets);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const selectedId = useGalaxyStore(s => s.selectedSecret?.id);

    const hitMeshRef = useRef<THREE.InstancedMesh>(null!);
    const visualMeshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => secrets.map(s => new THREE.Color(s.color)), [secrets]);

    // Tracking per evitare click accidentali durante lo scroll
    const [pointerDownPos, setPointerDownPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!visualMeshRef.current || !hitMeshRef.current || secrets.length === 0) return;

        secrets.forEach((star, i) => {
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
    }, [secrets, colors, dummy]);

    useFrame((state) => {
        if (!visualMeshRef.current || !hitMeshRef.current || secrets.length === 0) return;
        const t = state.clock.getElapsedTime();

        for (let i = 0; i < secrets.length; i++) {
            const star = secrets[i];
            const isSelected = selectedId === star.id;

            // Pulsazione e scala
            const pulse = 1 + Math.sin(t * 2 + (i * 0.1)) * 0.15;
            const scale = isSelected ? 4.0 : pulse;

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

        // Se il movimento è minimo (tap), seleziona il segreto
        if (distance < 10 && secrets[e.instanceId]) {
            selectSecret(secrets[e.instanceId]);
        }
        setPointerDownPos(null);
    };

    if (secrets.length === 0) return null;

    return (
        <group>
            {/* LAYER DI INTERAZIONE - Sfere trasparenti grandi per facilitare il touch */}
            <instancedMesh
                ref={hitMeshRef}
                args={[null as any, null as any, secrets.length]}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <sphereGeometry args={[2.0, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </instancedMesh>

            {/* LAYER VISIVO - Sfere luminose */}
            <instancedMesh
                ref={visualMeshRef}
                args={[null as any, null as any, secrets.length]}
                raycast={() => null}
            >
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshStandardMaterial
                    toneMapped={false}
                    emissiveIntensity={3.5}
                />
            </instancedMesh>
        </group>
    );
}
