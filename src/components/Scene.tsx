import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';

import StarField from './Galaxy/StarField';
import CameraController from './Galaxy/CameraController';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const WarpStars = () => {
    const isWarping = useGalaxyStore(s => s.isWarping);
    const starRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (starRef.current) {
            // Lerp speed: if warping, go fast (20), else slow (1)
            const targetSpeed = isWarping ? 50 : 0.5;
            starRef.current.speed = THREE.MathUtils.lerp(starRef.current.speed || 1, targetSpeed, delta * 2);
        }
    });

    return <Stars ref={starRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade />;
};


const Nebula = () => {
    const colors = ['#4433ff', '#6622ff', '#ff33aa', '#33ffaa', '#33ffaa'];

    return (
        <group>
            {colors.map((color, i) => (
                <Sparkles
                    key={i}
                    position={new THREE.Vector3(
                        (Math.random() - 0.5) * 60,
                        (Math.random() - 0.5) * 60,
                        (Math.random() - 0.5) * 60
                    )}
                    count={200}
                    scale={40}
                    size={6}
                    speed={0.1}
                    opacity={0.1}
                    color={color}
                />
            ))}
        </group>
    );
};

export default function Scene() {
    const [sparkleCount, setSparkleCount] = useState({ c1: 2000, c2: 1000 });

    useEffect(() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isMobile) {
            setSparkleCount({ c1: 600, c2: 300 });
        }
    }, []);

    const isModalOpen = useGalaxyStore(s => s.isModalOpen);
    const { c1, c2 } = sparkleCount;

    return (
        <div className="w-full h-full bg-black">
            <Canvas
                camera={{ position: [0, 0, 30], fov: 60 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
            >
                <fog attach="fog" args={['#000000', 10, 100]} />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Suspense fallback={null}>
                    <WarpStars />
                    <Nebula />
                    <Sparkles count={c1} scale={120} size={2} speed={0.4} opacity={0.5} color="#ffeebb" />
                    <Sparkles count={c2} scale={60} size={4} speed={0.2} opacity={0.8} color="#ffaaee" />
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
            </Canvas>
        </div>
    );
}
