'use client';

import { useState, useEffect } from 'react';
import StarField from './StarField';

export default function OptimizedStarField() {
  const [isMobile, setIsMobile] = useState(false);

  // Rileva se sei su dispositivo mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Passa la prop mobileOverride al componente originale
  return <StarField mobileOverride={isMobile} />;
}
