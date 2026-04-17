"use client";

import React, { useEffect, useRef } from 'react';

const ApologyAnimation: React.FC = () => {
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

    const rainDrops = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 110 - 10,
      y: Math.random() * 100,
      len: 8 + Math.random() * 6,
      vx: 1.2,
      vy: 8 + Math.random() * 4
    }));

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;

      const loopT = t % 12;
      ctx.clearRect(0, 0, W, H);
      
      // Base Background removed to allow transparency

      // PHASE 1 & 2: Rain
      let rainAlpha = 1;
      if (loopT > 4 && loopT <= 7) {
        rainAlpha = 1 - (loopT - 4) / 3;
      } else if (loopT > 7) {
        rainAlpha = 0;
      }

      if (rainAlpha > 0) {
        ctx.strokeStyle = `rgba(100, 160, 255, ${0.4 * rainAlpha})`;
        ctx.lineWidth = 1;
        rainDrops.forEach(d => {
          d.y += d.vy;
          d.x += d.vx;
          
          const x1 = (d.x / 100) * W;
          const y1 = (d.y / 100) * H;
          const x2 = x1 + d.vx * d.len * 0.1;
          const y2 = y1 + d.vy * d.len * 0.1;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          if (d.y > 105) { d.y = -5; d.x = Math.random() * 110 - 10; }
          if (d.x > 105) { d.x = -5; }
        });

        // Blue overlay
        ctx.fillStyle = `rgba(20, 40, 100, ${0.12 * rainAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      // PHASE 3: Breakthrough & Light Rays
      if (loopT > 6.5) {
        const breakthroughT = loopT - 6.5; // Starts slightly before rain fully ends
        const maxLightAlpha = Math.min(1, breakthroughT / 3);
        
        // Center Glow
        const glowAlpha = maxLightAlpha * 0.22;
        const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 140);
        glow.addColorStop(0, `rgba(255, 230, 150, ${glowAlpha})`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // Rays (from top-left)
        const rayAlpha = maxLightAlpha * 0.15;
        ctx.fillStyle = `rgba(255, 245, 200, ${rayAlpha})`;
        const rayCount = 6;
        const diag = Math.sqrt(W * W + H * H) * 1.2;
        
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * (Math.PI / 2); // 0 to 90 deg
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle - 0.05) * diag, Math.sin(angle - 0.05) * diag);
          ctx.lineTo(Math.cos(angle + 0.05) * diag, Math.sin(angle + 0.05) * diag);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Smooth wrap around (fade out rays at the end of loop)
      if (loopT > 11) {
        const fadeOut = 12 - loopT;
        ctx.fillStyle = `rgba(8, 3, 10, ${1 - fadeOut})`;
        ctx.fillRect(0, 0, W, H);
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

export default ApologyAnimation;
