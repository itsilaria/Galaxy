'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const COLOR_WHITE = new THREE.Color('#ffffff');

export default function StarField() {
    const secrets = useGalaxyStore(s => s.secrets);
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const selectedId = useGalaxyStore(s => s.selectedSecret?.id);

    const hitMeshRef = useRef<THREE.InstancedMesh>(null!);
    const visualMeshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const colors = useMemo(() => secrets.map(s => new THREE.Color(s.color || '#ffffff')), [secrets]);

    useEffect(() => {
        if (!visualMeshRef.current || !hitMeshRef.current || secrets.length === 0) return;

        secrets.forEach((star, i) => {
            dummy.position.set(...star.position);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            visualMeshRef.current.setMatrixAt(i, dummy.matrix);
            hitMeshRef.current.setMatrixAt(i, dummy.matrix);
            if (visualMeshRef.current.instanceColor) {
                visualMeshRef.current.setColorAt(i, colors[i]);
            }
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
            const pulse = 1 + Math.sin(t * 2 + i * 0.37) * 0.18;
            const scale = isSelected ? 3.5 : pulse;

            dummy.position.set(...star.position);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            visualMeshRef.current.setMatrixAt(i, dummy.matrix);
            hitMeshRef.current.setMatrixAt(i, dummy.matrix);

            if (visualMeshRef.current.instanceColor) {
                visualMeshRef.current.setColorAt(i, isSelected ? COLOR_WHITE : colors[i]);
            }
        }
        visualMeshRef.current.instanceMatrix.needsUpdate = true;
        hitMeshRef.current.instanceMatrix.needsUpdate = true;
        if (visualMeshRef.current.instanceColor) visualMeshRef.current.instanceColor.needsUpdate = true;
    });

    const [pointerDownPos, setPointerDownPos] = useState({ x: 0, y: 0 });

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setPointerDownPos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (e.instanceId === undefined) return;
        
        const dx = e.clientX - pointerDownPos.x;
        const dy = e.clientY - pointerDownPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Se il movimento è minimo (tap < 10px), allora è un click valido
        if (dist < 10 && secrets[e.instanceId]) {
            console.log('Star selected via Touch/Click:', secrets[e.instanceId].id);
            selectSecret(secrets[e.instanceId]);
        }
    };

    if (!secrets || secrets.length === 0) return null;

    return (
        <group>
            {/* Transparent hit-mesh — sfere giganti per il touch */}
            <instancedMesh
                ref={hitMeshRef}
                args={[undefined, undefined, secrets.length]}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
            >
                <sphereGeometry args={[6, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </instancedMesh>

            {/* Visual star mesh */}
            <instancedMesh
                ref={visualMeshRef}
                args={[undefined, undefined, secrets.length]}
                raycast={() => null}
            >
                <sphereGeometry args={[2, 12, 12]} />
                <meshBasicMaterial vertexColors />
            </instancedMesh>
        </group>
    );
}
