'use client';
import { useEffect, useState } from 'react';

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);
  }, []);
  
  return isMobile;
}
