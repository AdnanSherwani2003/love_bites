"use client";

import React, { useEffect, useRef } from 'react';

const AnniversaryAnimation: React.FC = () => {
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

    const particles = [
      { radius: 55, speed: 0.003, count: 6 },
      { radius: 73, speed: 0.004, count: 6 },
      { radius: 91, speed: 0.005, count: 6 },
    ].flatMap((group, gIdx) => 
      Array.from({ length: group.count }).map((_, i) => ({
        radius: group.radius,
        speed: group.speed,
        angle: (i / group.count) * Math.PI * 2,
        size: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2
      }))
    );

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cx = W / 2;
      const cy = H / 2 - 10;

      ctx.clearRect(0, 0, W, H);
      
      // Background removed to allow transparency

      // 1. HEARTBEAT PULSE (every 3 seconds)
      const pulseCycle = (t % 3) / 3;
      const pulseProgress = pulseCycle * Math.PI;
      const pulseAlpha = Math.max(0, Math.sin(pulseProgress) * Math.exp(-pulseCycle * 5));
      
      if (pulseAlpha > 0.01) {
        const pulseGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        pulseGrad.addColorStop(0, `rgba(255, 210, 80, ${0.18 * pulseAlpha})`);
        pulseGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pulseGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. BREATHING RING
      const ringScale = 1 + 0.06 * Math.sin(t * 0.8);
      const ringRadius = 52 * ringScale;
      ctx.strokeStyle = 'rgba(255, 200, 80, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 3. CENTER GLOW
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
      centerGrad.addColorStop(0, 'rgba(255, 230, 120, 0.25)');
      centerGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      // 4. ORBITING PARTICLES
      particles.forEach(p => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.45; // Ellipse perspective

        const pGrad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2.5);
        pGrad.addColorStop(0, 'rgba(255, 220, 100, 0.8)');
        pGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 220, 100, 1)';
        ctx.beginPath();
        ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

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

export default AnniversaryAnimation;
