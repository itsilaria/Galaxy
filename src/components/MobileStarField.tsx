'use client';
import { useEffect, useRef } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';

export default function MobileStarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secrets = useGalaxyStore(s => s.secrets);
  const selectSecret = useGalaxyStore(s => s.selectSecret);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<{ x: number; y: number; size: number; secretIndex: number; twinkle: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create stars from secrets
    starsRef.current = secrets.map((secret, i) => {
      // Map 3D positions to 2D canvas
      const x = ((secret.position[0] + 500) / 1000) * canvas.width;
      const y = ((secret.position[1] + 500) / 1000) * canvas.height;
      return {
        x,
        y,
        size: 2 + Math.random() * 2,
        secretIndex: i,
        twinkle: Math.random() * Math.PI * 2
      };
    });

    // Add some background stars for atmosphere
    const bgStars: { x: number; y: number; size: number; twinkle: number }[] = [];
    for (let i = 0; i < 200; i++) {
      bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    let time = 0;
    const animate = () => {
      time += 0.02;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars
      bgStars.forEach(star => {
        const alpha = 0.3 + 0.3 * Math.sin(time + star.twinkle);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Draw secret stars (brighter and larger)
      starsRef.current.forEach(star => {
        const alpha = 0.6 + 0.4 * Math.sin(time * 2 + star.twinkle);
        const glowSize = star.size * (1.5 + 0.5 * Math.sin(time + star.twinkle));
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(200, 200, 255, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(100, 100, 200, 0)');
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.3)})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [secrets]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked star
    const clickRadius = 30; // Touch-friendly radius
    for (const star of starsRef.current) {
      const dx = x - star.x;
      const dy = y - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < clickRadius && secrets[star.secretIndex]) {
        selectSecret(secrets[star.secretIndex]);
        break;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="absolute inset-0 w-full h-full touch-none"
      style={{ touchAction: 'none' }}
    />
  );
}
