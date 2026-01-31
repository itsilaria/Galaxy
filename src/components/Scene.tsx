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

    return <Stars ref={starRef} radius={100} depth={50} count={3000} factor={4} saturation={0} fade />;
});

const Nebula = memo(() => {
    const colors = ['#4433ff', '#6622ff', '#ff33aa', '#33ffaa', '#33ffaa'];

    const positions = useMemo(() => colors.map(() => new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
    )), []);

    return (
        <group>
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
                />
            ))}
        </group>
    );
});

WarpStars.displayName = 'WarpStars';
Nebula.displayName = 'Nebula';

const SceneContent = memo(() => {
    const isModalOpen = useGalaxyStore(s => s.isModalOpen);
    const [sparkleCount, setSparkleCount] = useState({ c1: 2000, c2: 1000 });

    useEffect(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isMobile) {
            setSparkleCount({ c1: 600, c2: 300 });
        }
    }, []);

    const { c1, c2 } = sparkleCount;

    return (
        <>
            <fog attach="fog" args={['#000000', 10, 100]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Suspense fallback={null}>
                <WarpStars />
                <Nebula />
                <Sparkles count={c1} scale={120} size={2} speed={0.4} opacity={0.4} color="#ffeebb" />
                <Sparkles count={c2} scale={60} size={4} speed={0.2} opacity={0.6} color="#ffaaee" />
                <StarField />
                <CameraController />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={5}
                maxDistance={80}
                autoRotate={!isModalOpen}
                autoRotateSpeed={0.5}
                makeDefault
                enableDamping={true}
                dampingFactor={0.05}
            />
        </>
    );
});

SceneContent.displayName = 'SceneContent';

export default function Scene() {
    return (
        <div className="w-full h-full bg-black">
            <Canvas
                camera={{ position: [0, 0, 30], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    alpha: false,
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true
                }}
            >
                <SceneContent />
            </Canvas>
        </div>
    );
}
