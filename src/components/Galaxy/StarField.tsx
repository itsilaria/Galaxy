'use client';

import { useRef, useState, memo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const Star = memo(({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const glowMesh = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

    // Selectors to prevent unnecessary re-renders of ALL stars
    const selectSecret = useGalaxyStore(s => s.selectSecret);
    const selectedId = useGalaxyStore(s => s.selectedSecret?.id);

    const [hovered, setHover] = useState(false);
    const pointerDownPos = useRef<[number, number] | null>(null);
    const energyLevel = useRef(0);

    const isSelected = selectedId === secret.id;
    const isSupernova = secret.starType === 'supernova';

    useFrame((state, delta) => {
        if (!mesh.current || !materialRef.current) return;

        // Gentle rotation
        mesh.current.rotation.x += delta * (isSupernova ? 0.3 : 0.1);
        mesh.current.rotation.y += delta * (isSupernova ? 0.4 : 0.15);

        // Pulsating effect
        const t = state.clock.getElapsedTime();
        const freq = isSupernova ? 4 : 2;
        const pulseAmt = isSupernova ? 0.4 : 0.2;
        const scale = 1 + Math.sin(t * freq + secret.timestamp) * pulseAmt;

        const baseSize = isSupernova ? 2.5 : 1.0;
        const currentScale = isSelected ? baseSize * 2.5 : (hovered ? baseSize * 2.0 : scale * baseSize);
        mesh.current.scale.setScalar(currentScale);

        if (isSupernova && glowMesh.current) {
            glowMesh.current.scale.setScalar(currentScale * 1.5);
            glowMesh.current.rotation.z -= delta * 0.5;
        }

        // Handle energy pulse and intensity via materials to avoid React state re-renders
        if (energyLevel.current > 0) {
            energyLevel.current = Math.max(0, energyLevel.current - delta * 3);
        }

        const baseEmissive = isSelected ? 5 : (isSupernova ? 4.0 : (hovered ? 2 : 0.8));
        materialRef.current.emissiveIntensity = baseEmissive + energyLevel.current;
    });

    const handlePointerDown = (e: any) => {
        // Use clientX/Y from R3F event which is more reliable
        pointerDownPos.current = [e.clientX, e.clientY];
    };

    const handlePointerUp = (e: any) => {
        if (!pointerDownPos.current) return;

        const dx = e.clientX - pointerDownPos.current[0];
        const dy = e.clientY - pointerDownPos.current[1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Threshold of 15px for safe mobile dragging
        if (dist < 15) {
            e.stopPropagation();
            energyLevel.current = 5; // Intense flash
            selectSecret(secret);
        }
        pointerDownPos.current = null;
    };

    return (
        <group position={new THREE.Vector3(...secret.position)}>
            {/* Invisible larger hit box */}
            <mesh
                visible={false}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                    setHover(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <sphereGeometry args={[isSupernova ? 3 : 1.5, 8, 8]} />
            </mesh>

            {/* Premium Glow Aura */}
            {isSupernova && (
                <mesh ref={glowMesh}>
                    <ringGeometry args={[0.3, 0.4, 32]} />
                    <meshBasicMaterial
                        color={secret.color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Visible Star */}
            <mesh ref={mesh}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    ref={materialRef}
                    color={isSelected ? '#ffffff' : secret.color}
                    emissive={isSelected ? '#ffffff' : secret.color}
                    emissiveIntensity={isSelected ? 5 : (isSupernova ? 4.0 : (hovered ? 2 : 0.8))}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
});

Star.displayName = 'Star';

export default function StarField() {
    const secrets = useGalaxyStore((state) => state.secrets);

    return (
        <group>
            {secrets.map((secret) => (
                <Star key={secret.id} secret={secret} />
            ))}
        </group>
    );
}
