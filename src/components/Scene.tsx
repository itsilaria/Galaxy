'use client';

import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { Suspense, useEffect, useState, memo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

import StarField from './Galaxy/StarField';
import CameraController from './Galaxy/CameraController';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const WarpStars = memo(() => {
  const isWarping = useGalaxyStore(s => s.isWarping);
  const ref = useRef<any>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = isWarping ? 40 : 1;
    ref.current.speed = THREE.MathUtils.lerp(ref.current.speed ?? 1, target, delta * 2);
  });

  return (
    <group raycast={() => null}>
      <Stars ref={ref} radius={120} depth={60} count={3000} factor={4} fade />
    </group>
  );
});

const SceneContent = memo(() => {
  const isModalOpen = useGalaxyStore(s => s.isModalOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <>
      <fog attach="fog" args={['#000', 10, 120]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <Suspense fallback={null}>
        {!isMobile && (
          <>
            <WarpStars />
            <Sparkles raycast={() => null} count={1200} scale={120} size={2} speed={0.4} opacity={0.4} />
          </>
        )}
        <StarField />
        <CameraController />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={!isMobile}
        autoRotate={!isModalOpen}
        autoRotateSpeed={0.4}
        minDistance={5}
        maxDistance={80}
        enableDamping
        dampingFactor={0.05}
        makeDefault
      />
    </>
  );
});

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60 }}
      gl={{ powerPreference: 'high-performance' }}
    >
      <SceneContent />
    </Canvas>
  );
}
