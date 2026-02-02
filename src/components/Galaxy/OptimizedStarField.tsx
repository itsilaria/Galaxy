'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StarField from './StarField'; // il componente originale

export default function OptimizedStarField() {
  const [isMobile, setIsMobile] = useState(false);

  // Rileva se sei su dispositivo mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Prop wrapper per passare i limiti di performance
  const mobileSettings = useMemo(() => {
    return {
      rotationSpeed: isMobile ? 0.1 : 0.4, // rotazione più lenta su mobile
      maxStars: isMobile ? 300 : undefined, // massimo 300 stelle su mobile
    };
  }, [isMobile]);

  return <StarField mobileOverride={mobileSettings} />;
}
