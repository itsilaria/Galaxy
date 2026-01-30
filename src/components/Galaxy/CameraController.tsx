'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function CameraController() {
    const { camera, controls } = useThree() as any;
    const selectedSecret = useGalaxyStore((state) => state.selectedSecret);
    const isModalOpen = useGalaxyStore((state) => state.isModalOpen);

    // Store original position to return to
    const initialPos = useRef(new THREE.Vector3(0, 0, 30));
    const targetPos = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        if (!controls) return;

        if (selectedSecret && isModalOpen) {
            // Fly to the star
            // Calculate a position slightly offset from the star to look AT it
            const starPos = new THREE.Vector3(...selectedSecret.position);
            const direction = starPos.clone().normalize();
            const offset = direction.clone().multiplyScalar(4); // Distance from star
            const camTarget = starPos.clone().add(offset);

            // Smoothly interpolate camera position
            state.camera.position.lerp(camTarget, delta * 2);

            // Smoothly interpolate controls target (look at star)
            controls.target.lerp(starPos, delta * 2);
        } else {
            // Optional: drifting or return to center? 
            // For now, let OrbitControls handle it, but maybe slight drift?
            // Let's just update controls to ensure damping works
        }

        controls.update();
    });

    return null;
}
