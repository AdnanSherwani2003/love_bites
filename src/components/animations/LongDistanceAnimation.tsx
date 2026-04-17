"use client";

import React, { useEffect, useRef } from 'react';

const LongDistanceAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const stars = Array.from({ length: 8 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      speed: 0.5 + Math.random() * 1.5
    }));

    const getBezierPoint = (t: number, p0: any, p1: any, p2: any) => {
      const invT = 1 - t;
      return {
        x: invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
        y: invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y
      };
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;

      ctx.clearRect(0, 0, W, H);
      
      // Background removed to allow transparency

      // STATIC STAR FIELD
      stars.forEach(s => {
        const alpha = 0.2 + 0.6 * Math.abs(Math.sin(t * s.speed));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc((s.x / 100) * W, (s.y / 100) * H, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const p0 = { x: W * 0.2, y: H * 0.6 };
      const p1 = { x: W * 0.5, y: H * 0.2 };
      const p2 = { x: W * 0.8, y: H * 0.4 };

      // CONNECTING ARC
      const drawProgress = Math.min(1, t / 3);
      ctx.strokeStyle = `rgba(126, 184, 247, ${0.4 * drawProgress})`;
      ctx.lineWidth = 1.5;
      
      // Estimate length for dash
      const length = Math.sqrt(Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2)) * 1.2;
      ctx.setLineDash([length * drawProgress, length]);
      
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // TWO DOTS
      [p0, p2].forEach(p => {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        glow.addColorStop(0, 'rgba(126, 184, 247, 0.5)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#7eb8f7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // ARC PARTICLES
      if (drawProgress >= 1) {
        const particles = [((t * 0.2) % 1), (((t + 1.5) * 0.2) % 1)];
        particles.forEach(pos => {
          // Eased speed effect (faster in middle)
          const pt = getBezierPoint(pos, p0, p1, p2);
          
          const pGlow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 6);
          pGlow.addColorStop(0, 'rgba(126, 184, 247, 0.8)');
          pGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = pGlow;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      t += 0.016;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        display: 'block'
      }}
    />
  );
};

export default LongDistanceAnimation;
