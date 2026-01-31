'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function CameraController() {
    const { camera, controls } = useThree() as any;
    const selectedSecret = useGalaxyStore((state) => state.selectedSecret);
    const isModalOpen = useGalaxyStore((state) => state.isModalOpen);
    const lastSelectedId = useRef<string | null>(null);

    useFrame((state, delta) => {
        if (!controls) return;

        if (selectedSecret && isModalOpen) {
            // Only auto-fly if it's a NEW selection
            if (lastSelectedId.current !== selectedSecret.id) {
                const starPos = new THREE.Vector3(...selectedSecret.position);
                const direction = starPos.clone().normalize();
                const offset = direction.clone().multiplyScalar(4);
                const camTarget = starPos.clone().add(offset);

                // Smoothly interpolate camera position
                state.camera.position.lerp(camTarget, delta * 4);
                controls.target.lerp(starPos, delta * 4);

                // Check if we are close enough to stop "locking"
                if (state.camera.position.distanceTo(camTarget) < 0.1) {
                    lastSelectedId.current = selectedSecret.id;
                }
            }
        } else {
            // Reset selection tracking when modal closes
            if (lastSelectedId.current !== null) {
                lastSelectedId.current = null;
            }

            // Allow manual OrbitControls movement
        }

        controls.update();
    });

    return null;
}
