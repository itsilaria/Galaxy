'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';

interface Star {
  x: number;
  y: number;
  baseY: number;
  size: number;
  secretIndex: number;
  twinkle: number;
  color: string;
}

interface BgStar {
  x: number;
  y: number;
  baseY: number;
  size: number;
  twinkle: number;
  speed: number;
}

export default function MobileStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secrets = useGalaxyStore(s => s.secrets);
  const selectSecret = useGalaxyStore(s => s.selectSecret);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const bgStarsRef = useRef<BgStar[]>([]);
  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const lastTouchRef = useRef(0);
  const velocityRef = useRef(0);

  // Initialize stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const totalHeight = Math.max(height * 3, secrets.length * 80);

    // Secret stars - larger and more visible
    const colors = ['#ffffff', '#a5b4fc', '#c4b5fd', '#fde68a', '#fca5a1'];
    
    if (secrets.length > 0) {
      starsRef.current = secrets.map((secret, i) => {
        const pos = secret.position || [
          Math.random() * 10 - 5,
          Math.random() * 5,
          Math.random() * 10 - 5
        ];
        return {
          x: Math.max(40, Math.min(width - 40, ((pos[0] + 5) / 10) * width)),
          y: 100 + (i * (totalHeight - 200)) / Math.max(1, secrets.length - 1),
          baseY: 100 + (i * (totalHeight - 200)) / Math.max(1, secrets.length - 1),
          size: 4 + Math.random() * 3,
          secretIndex: i,
          twinkle: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      });
    } else {
      // Placeholder stars
      starsRef.current = Array.from({ length: 25 }, (_, i) => ({
        x: 50 + Math.random() * (width - 100),
        y: 100 + Math.random() * (totalHeight - 200),
        baseY: 100 + Math.random() * (totalHeight - 200),
        size: 4 + Math.random() * 3,
        secretIndex: -1,
        twinkle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    // Background stars - many small twinkling stars
    bgStarsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * totalHeight,
      baseY: Math.random() * totalHeight,
      size: 0.5 + Math.random() * 1.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5
    }));

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [secrets]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    let time = 0;

    const animate = () => {
      time += 0.015;

      // Smooth scroll with momentum
      scrollRef.current += (targetScrollRef.current - scrollRef.current) * 0.12;
      
      // Apply velocity for momentum scrolling
      if (Math.abs(velocityRef.current) > 0.5) {
        targetScrollRef.current += velocityRef.current;
        velocityRef.current *= 0.95;
      }

      // Clamp scroll
      const totalHeight = Math.max(height * 3, secrets.length * 80);
      targetScrollRef.current = Math.max(0, Math.min(totalHeight - height, targetScrollRef.current));

      // Clear with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0a0a0f');
      bgGradient.addColorStop(0.5, '#050510');
      bgGradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw background stars with parallax
      bgStarsRef.current.forEach(star => {
        const parallaxY = star.baseY - scrollRef.current * star.speed;
        const wrappedY = ((parallaxY % height) + height) % height;
        const alpha = 0.2 + 0.3 * Math.sin(time * 2 + star.twinkle);
        
        ctx.beginPath();
        ctx.arc(star.x, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw secret stars
      starsRef.current.forEach(star => {
        const y = star.baseY - scrollRef.current;
        
        // Only draw if on screen (with margin)
        if (y < -50 || y > height + 50) return;

        const pulse = Math.sin(time * 2 + star.twinkle);
        const alpha = 0.7 + 0.3 * pulse;
        const glowSize = star.size * (2 + 0.5 * pulse);

        // Outer glow
        const gradient = ctx.createRadialGradient(
          star.x, y, 0,
          star.x, y, glowSize * 4
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.3, `${star.color}88`);
        gradient.addColorStop(0.6, `${star.color}22`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(star.x, y, glowSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core star
        ctx.beginPath();
        ctx.arc(star.x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Sparkle effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        const sparkleSize = star.size * 2;
        ctx.beginPath();
        ctx.moveTo(star.x - sparkleSize, y);
        ctx.lineTo(star.x + sparkleSize, y);
        ctx.moveTo(star.x, y - sparkleSize);
        ctx.lineTo(star.x, y + sparkleSize);
        ctx.stroke();
      });

      // Scroll indicator
      const totalScrollable = Math.max(1, Math.max(height * 3, secrets.length * 80) - height);
      const scrollProgress = scrollRef.current / totalScrollable;
      const indicatorHeight = height * 0.15;
      const indicatorY = 20 + scrollProgress * (height - indicatorHeight - 40);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(width - 6, 20, 3, height - 40);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(width - 6, indicatorY, 3, indicatorHeight);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [secrets.length]);

  // Touch handlers for scrolling
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    lastTouchRef.current = e.touches[0].clientY;
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const delta = lastTouchRef.current - touch.clientY;
    velocityRef.current = delta;
    targetScrollRef.current += delta;
    lastTouchRef.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    // Check for tap (not scroll)
    if (Math.abs(velocityRef.current) < 5) {
      const touch = e.changedTouches[0];
      const y = touch.clientY;
      const x = touch.clientX;
      
      // Find tapped star
      const tapRadius = 50;
      for (const star of starsRef.current) {
        const starY = star.baseY - scrollRef.current;
        const dx = x - star.x;
        const dy = y - starY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < tapRadius && star.secretIndex >= 0 && secrets[star.secretIndex]) {
          selectSecret(secrets[star.secretIndex]);
          return;
        }
      }
    }
  }, [secrets, selectSecret]);

  // Mouse wheel for desktop
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    targetScrollRef.current += e.deltaY;
  }, []);

  // Click for desktop
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickRadius = 40;
    for (const star of starsRef.current) {
      const starY = star.baseY - scrollRef.current;
      const dx = x - star.x;
      const dy = y - starY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < clickRadius && star.secretIndex >= 0 && secrets[star.secretIndex]) {
        selectSecret(secrets[star.secretIndex]);
        return;
      }
    }
  }, [secrets, selectSecret]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="absolute inset-0 w-full h-full z-0"
      style={{ touchAction: 'none' }}
    />
  );
}
