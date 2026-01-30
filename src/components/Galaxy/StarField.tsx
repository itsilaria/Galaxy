'use client';

import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGalaxyStore, Secret } from '@/store/useGalaxyStore';

const Star = ({ secret }: { secret: Secret }) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const { selectSecret, selectedSecret } = useGalaxyStore();

    const isSelected = selectedSecret?.id === secret.id;

    useFrame((state, delta) => {
        // Gentle rotation
        mesh.current.rotation.x += delta * 0.1;
        mesh.current.rotation.y += delta * 0.15;

        // Pulsating effect
        const t = state.clock.getElapsedTime();
        const scale = 1 + Math.sin(t * 2 + secret.timestamp) * 0.2; // Increased pulse
        // Increased base scale and hover scale significantly
        const currentScale = isSelected ? 2.5 : (hovered ? 2.0 : scale);
        mesh.current.scale.setScalar(currentScale);
    });

    const [hovered, setHover] = useState(false);

    return (
        <group position={new THREE.Vector3(...secret.position)}>
            {/* Invisible larger hit box */}
            <mesh
                visible={false}
                onClick={(e) => {
                    e.stopPropagation();
                    selectSecret(secret);
                }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    selectSecret(secret);
                }}
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
                <sphereGeometry args={[1.5, 8, 8]} /> {/* Big hit area */}
            </mesh>

            {/* Visible Star */}
            <mesh ref={mesh}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                    color={isSelected ? '#ffffff' : secret.color}
                    emissive={isSelected ? '#ffffff' : secret.color}
                    emissiveIntensity={isSelected ? 3 : (hovered ? 2 : 0.8)}
                    toneMapped={false}
                />
            </mesh>

            {isSelected && (
                <Html distanceFactor={10}>
                    <div className="bg-black/90 text-white p-4 rounded-xl border border-white/30 w-64 text-sm backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-fade-in">
                        <p className="italic">"{secret.text}"</p>
                        <div className="mt-2 text-[10px] text-white/40 uppercase tracking-widest flex justify-between">
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
