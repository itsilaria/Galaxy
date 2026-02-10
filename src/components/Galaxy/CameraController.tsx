'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

export default function CameraController() {
    const { controls } = useThree() as { controls: any };
    const selectedSecret = useGalaxyStore((state) => state.selectedSecret);
    const isModalOpen = useGalaxyStore((state) => state.isModalOpen);
    const lastSelectedId = useRef<string | null>(null);

    const _starPos = useMemo(() => new THREE.Vector3(), []);
    const _camTarget = useMemo(() => new THREE.Vector3(), []);
    const _dir = useMemo(() => new THREE.Vector3(), []);

    useFrame((state, delta) => {
        if (!controls) return;

        if (selectedSecret && isModalOpen && selectedSecret.position) {
            if (lastSelectedId.current !== selectedSecret.id) {
                _starPos.set(
                    selectedSecret.position[0],
                    selectedSecret.position[1],
                    selectedSecret.position[2]
                );
                _dir.copy(_starPos).normalize().multiplyScalar(4);
                _camTarget.copy(_starPos).add(_dir);

                state.camera.position.lerp(_camTarget, delta * 2.5);
                controls.target.lerp(_starPos, delta * 2.5);

                if (state.camera.position.distanceTo(_camTarget) < 0.05) {
                    lastSelectedId.current = selectedSecret.id;
                }
            }
        } else {
            if (lastSelectedId.current !== null) {
                lastSelectedId.current = null;
            }
        }

        controls.update();
    });

    return null;
}
