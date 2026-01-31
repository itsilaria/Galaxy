'use client';

import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const Star = ({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const glowMesh = useRef<THREE.Mesh>(null!);
    const { selectSecret, selectedSecret } = useGalaxyStore();
    const [hovered, setHover] = useState(false);
    const [energyLevel, setEnergyLevel] = useState(0);
    const pointerDownPos = useRef<[number, number] | null>(null);

    const isSelected = selectedSecret?.id === secret.id;
    const isSupernova = secret.starType === 'supernova';

    useFrame((state, delta) => {
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

        if (energyLevel > 0) {
            setEnergyLevel(prev => Math.max(0, prev - delta * 2));
        }
    });

    const handlePointerDown = (e: any) => {
        // DO NOT stopPropagation here so OrbitControls can start a drag
        pointerDownPos.current = [e.nativeEvent.clientX, e.nativeEvent.clientY];
    };

    const handlePointerUp = (e: any) => {
        if (!pointerDownPos.current) return;

        // Calculate travel distance to distinguish tap from drag
        const dx = e.nativeEvent.clientX - pointerDownPos.current[0];
        const dy = e.nativeEvent.clientY - pointerDownPos.current[1];
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Threshold of 10px is standard for taps vs minor tremors
        if (dist < 10) {
            e.stopPropagation(); // Only stop if we actually select
            setEnergyLevel(2);
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
                    color={isSelected ? '#ffffff' : secret.color}
                    emissive={isSelected ? '#ffffff' : secret.color}
                    emissiveIntensity={isSelected ? 5 : (isSupernova ? 4.0 + energyLevel : (hovered ? 2 + energyLevel : 0.8 + energyLevel))}
                    toneMapped={false}
                />
            </mesh>

            {isSelected && (
                <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
                    <div className={`bg-black/95 text-white p-6 rounded-3xl border ${isSupernova ? 'border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.3)]' : 'border-white/30'} w-72 text-sm backdrop-blur-2xl animate-fade-in pointer-events-auto`}>
                        {isSupernova && <div className="text-[9px] font-black text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-1">✨ Supernova Secret</div>}
                        <p className="italic text-lg leading-tight tracking-tight">"{secret.text}"</p>
                        <div className="mt-4 text-[9px] text-white/30 uppercase tracking-[0.2em] flex justify-between font-bold">
                            <span>{secret.country}</span>
                            <span>{new Date(secret.timestamp).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

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
