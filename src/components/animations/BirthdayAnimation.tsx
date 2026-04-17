"use client";

import React, { useEffect, useRef } from 'react';

const BirthdayAnimation: React.FC = () => {
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

    const colors = ['#ff6b9d', '#ffcc44', '#44ddff', '#ff8844', '#aa88ff', '#44ff99'];
    const confetti = Array.from({ length: 28 }).map(() => ({
      x: Math.random() * 100, // percentage
      y: -20 - Math.random() * 100, // start above
      w: 7 + Math.random() * 10,
      h: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 0.6 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 1.0,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      wave: Math.random() * Math.PI * 2
    }));

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (W === 0 || H === 0) return;

      ctx.clearRect(0, 0, W, H);
      
      // Background removed to allow transparency

      // SUBTLE CENTER GLOW
      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 90);
      glow.addColorStop(0, 'rgba(255, 180, 100, 0.07)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // CONFETTI
      confetti.forEach(p => {
        p.y += p.vy;
        const sway = Math.sin(t * 0.8 + p.wave) * 0.4;
        const actualX = (p.x / 100) * W + sway + (p.vx * t);
        p.rot += p.rotSpeed;

        // Fade out in bottom 20%
        let alpha = 1;
        if (p.y > H * 0.8) {
          alpha = Math.max(0, 1 - (p.y - H * 0.8) / (H * 0.2));
        }

        ctx.save();
        ctx.translate(actualX, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Reset to top
        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * 100;
        }
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

export default BirthdayAnimation;
