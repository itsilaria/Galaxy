'use client';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo, memo } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';

import StarField from './Galaxy/StarField';
import CameraController from './Galaxy/CameraController';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const WarpStars = memo(() => {
    const isWarping = useGalaxyStore(s => s.isWarping);
    const starRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (starRef.current) {
            const targetSpeed = isWarping ? 50 : 0.5;
            starRef.current.speed = THREE.MathUtils.lerp(starRef.current.speed || 1, targetSpeed, delta * 2);
        }
    });

    return (
        <group raycast={() => null}>
            <Stars ref={starRef} radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
        </group>
    );
});

const Nebula = memo(() => {
    const colors = ['#4433ff', '#6622ff', '#ff33aa', '#33ffaa', '#33ffaa'];

    const positions = useMemo(() => colors.map(() => new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
    )), []);

    return (
        <group raycast={() => null}>
            {colors.map((color, i) => (
                <Sparkles
                    key={i}
                    position={positions[i]}
                    count={150}
                    scale={40}
                    size={6}
                    speed={0.1}
                    opacity={0.08}
                    color={color}
                    raycast={() => null}
                />
            ))}
        </group>
    );
});

WarpStars.displayName = 'WarpStars';
Nebula.displayName = 'Nebula';

const SceneContent = memo(() => {
    const isModalOpen = useGalaxyStore(s => s.isModalOpen);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(mobile);
    }, []);

    return (
        <>
            <fog attach="fog" args={['#000000', 10, 100]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Suspense fallback={null}>
                {/* Disabilita completamente effetti pesanti su mobile */}
                {!isMobile && (
                    <>
                        <WarpStars />
                        <Nebula />
                        <Sparkles count={2000} scale={120} size={2} speed={0.4} opacity={0.4} color="#ffeebb" raycast={() => null} />
                        <Sparkles count={1000} scale={60} size={4} speed={0.2} opacity={0.6} color="#ffaaee" raycast={() => null} />
                    </>
                )}
                <StarField />
                <CameraController />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={!isMobile}
                minDistance={5}
                maxDistance={80}
                autoRotate={!isModalOpen}
                autoRotateSpeed={0.3}
                makeDefault
                enableDamping={true}
                dampingFactor={0.05}
            />
        </>
    );
});

SceneContent.displayName = 'SceneContent';

export default function Scene() {
    const [hasWebGL, setHasWebGL] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile
        const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
        setIsMobile(mobile);

        // Check WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                setHasWebGL(false);
            }
        } catch (e) {
            setHasWebGL(false);
        }
    }, []);

    if (!hasWebGL) {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-white/60 text-sm">WebGL not supported on this device</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-black">
            <Canvas
                camera={{ position: [0, 0, 30], fov: 60 }}
                dpr={isMobile ? [0.5, 0.5] : [1, 2]}
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: isMobile ? "low-power" : "high-performance",
                    stencil: false,
                    depth: true,
                    precision: isMobile ? 'lowp' : 'mediump',
                    failIfMajorPerformanceCaveat: false
                }}
                onCreated={({ gl }) => {
                    gl.setClearColor('#000000');
                }}
                frameloop="demand"
            >
                <SceneContent />
            </Canvas>
        </div>
    );
}
