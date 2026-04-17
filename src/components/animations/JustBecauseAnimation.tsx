"use client";

import React, { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  s: number;
  layer: number;
  wave: number;
  waveAmp: number;
}

const JustBecauseAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;
    let lastSpawn = 0;

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

    const hearts: Heart[] = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const createHeart = (initialY?: number) => {
      const layer = Math.random();
      return {
        x: (0.15 + Math.random() * 0.7) * W,
        y: initialY ?? (H + 40),
        s: 6 + layer * 14,
        layer,
        wave: Math.random() * Math.PI * 2,
        waveAmp: 0.6 + Math.random() * 0.8
      };
    };

    // Pre-spawn 12 hearts
    for (let i = 0; i < 12; i++) {
      hearts.push(createHeart(Math.random() * H));
    }

    const drawHeart = (x: number, y: number, s: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      
      // Radial glow halo
      const glow = ctx.createRadialGradient(x, y + s*0.6, 0, x, y + s*0.6, s * 1.8);
      glow.addColorStop(0, 'rgba(224, 64, 122, 0.4)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y + s*0.6, s * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Heart shape
      ctx.fillStyle = '#e0407a';
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.4);
      ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s * 1.1, x, y + s * 1.3);
      ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * 0.8, x + s, y + s * 0.4);
      ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      const currentW = canvas.offsetWidth;
      const currentH = canvas.offsetHeight;
      if (currentW === 0 || currentH === 0) return;

      ctx.clearRect(0, 0, currentW, currentH);
      
      // Background removed to allow transparency

      // Spawn new heart every 1.8s
      const now = Date.now();
      if (now - lastSpawn > 1800) {
        hearts.push(createHeart());
        lastSpawn = now;
      }

      // Update and draw hearts (sort by layer for parallax)
      hearts.sort((a, b) => a.layer - b.layer);

      for (let i = hearts.length - 1; i >= 0; i--) {
        const p = hearts[i];
        const vy = 0.4 + p.layer * 0.8;
        p.y -= vy;
        p.x += Math.sin(t * 0.6 + p.wave) * p.waveAmp;

        const alpha = Math.min(1, p.y / 60);
        drawHeart(p.x, p.y, p.s, alpha);

        if (p.y < -40) {
          hearts.splice(i, 1);
        }
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

export default JustBecauseAnimation;
