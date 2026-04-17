"use client";

import React, { useEffect, useRef } from 'react';

const ValentinesAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;
    const rings: { r: number, a: number }[] = [];

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

    const drawHeart = (x: number, y: number, s: number, fill: string, stroke: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.4);
      ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s * 1.1, x, y + s * 1.3);
      ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * 0.8, x + s, y + s * 0.4);
      ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;

      const cx = W / 2;
      const cy = H / 2 - 20;

      ctx.clearRect(0, 0, W, H);
      
      // Background removed to allow transparency

      const pulseFreq = 7.85; // 2PI / 0.8s
      const pulseSin = Math.sin(t * pulseFreq);
      const coreScale = 1 + 0.12 * Math.abs(pulseSin);

      // BACKGROUND GLOW
      const glowAlpha = 0.08 + 0.05 * Math.abs(pulseSin);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      glow.addColorStop(0, `rgba(255, 50, 80, ${glowAlpha})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // SONAR RINGS (every 3rd beat)
      // We detect the peak of every 3rd beat by tracking t
      const beatNum = Math.floor((t * pulseFreq) / (Math.PI * 2));
      const prevBeatNum = Math.floor(((t - 0.016) * pulseFreq) / (Math.PI * 2));
      
      if (beatNum !== prevBeatNum && beatNum % 3 === 0) {
        rings.push({ r: 45, a: 0.3 });
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += 4;
        r.a *= 0.96;
        
        ctx.strokeStyle = `rgba(255, 100, 120, ${r.a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy + 30, r.r, 0, Math.PI * 2);
        ctx.stroke();

        if (r.a < 0.01) rings.splice(i, 1);
      }

      // CENTERED HEART
      drawHeart(cx, cy, 45 * coreScale, '#ff4060', 'rgba(255, 100, 120, 0.4)', 1);

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

export default ValentinesAnimation;
