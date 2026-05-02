'use client';
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SparklesBgProps {
  className?: string;
  particleColor?: string;
  particleCount?: number;
}

export const SparklesBg = ({
  className,
  particleColor = '#22c55e',
  particleCount = 80,
}: SparklesBgProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: {
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
      dir: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.008 + 0.003,
          dir: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.alpha += p.speed * p.dir;
        if (p.alpha >= 1 || p.alpha <= 0) p.dir *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          particleColor +
          Math.round(p.alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [particleColor, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
    />
  );
};
