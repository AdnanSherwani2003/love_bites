"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';

interface InteractiveOpeningProps {
  occasion: 'anniversary' | 'valentines' | 'proposal' | 'just_because' | 'long_distance' | 'birthday';
  recipientName: string;
  senderName: string;
  onComplete: () => void;
}

// Helper for particle bursts
function spawnBurst(
  container: HTMLElement | null,
  xPct: number,   // x position as % of container
  yPct: number,   // y position as % of container
  count: number,
  colors: string[]
) {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const bx = rect.left + (xPct / 100) * rect.width;
  const by = rect.top + (yPct / 100) * rect.height;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = Math.random() * 360;
    const dist = 60 + Math.random() * 160;
    const size = 3 + Math.random() * 9;

    p.style.cssText = `
      position:fixed;
      top:${by}px; left:${bx}px;
      width:${size}px; height:${size}px;
      border-radius:${Math.random() > .4 ? '50%' : '3px'};
      background:${colors[i % colors.length]};
      --tx:${Math.cos(angle * Math.PI / 180) * dist}px;
      --ty:${Math.sin(angle * Math.PI / 180) * dist}px;
      animation:cpBurst ${.75 + Math.random() * .4}s ${Math.random() * .25}s ease-out both;
      pointer-events:none;
      z-index:1000;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
}

const RevealCard = ({ 
  visible, 
  occasion, 
  onClose 
}: { 
  visible: boolean; 
  occasion: InteractiveOpeningProps['occasion']; 
  onClose: () => void 
}) => {
  const data = {
    anniversary: {
      accent: "#c9a84c",
      eyebrow: "HAPPY ANNIVERSARY",
      title: "Still Burning",
      body: "Another year. Another thousand reasons why I am grateful it was you. The fire we started has only grown warmer, brighter, and more beautiful.",
      closing: "here's to burning forever.",
      emojis: "🕯️ 💛 ✨"
    },
    valentines: {
      accent: "#ff4060",
      eyebrow: "A LOVE NOTE",
      title: "Happy Valentine's",
      body: "Every heartbeat says your name. Every quiet moment holds your face. Being loved by you is the most beautiful thing that has ever happened to me.",
      closing: "you are my favourite story.",
      emojis: "🌹 💕 ✨"
    },
    proposal: {
      accent: "#a855f7",
      eyebrow: "A LIFETIME BEGINS",
      title: "Will You?",
      body: "In all the universe, across every star and every story ever told — I have chosen you. I choose you now. I will always choose you.",
      closing: "forever starts with a yes.",
      emojis: "💍 ✨ 🌙"
    },
    just_because: {
      accent: "#34d399",
      eyebrow: "JUST BECAUSE",
      title: "No Reason Needed",
      body: "There's no special occasion today. No anniversary, no birthday. Just me, thinking of you, and realising you deserve to be celebrated — always.",
      closing: "simply because you exist.",
      emojis: "🎁 💚 ✨"
    },
    long_distance: {
      accent: "#60a5fa",
      eyebrow: "ACROSS THE MILES",
      title: "Still So Close",
      body: "The miles between us are just numbers. Every night I look up at the same sky as you, and somehow, that makes all the distance disappear.",
      closing: "in every timezone, I'm yours.",
      emojis: "✈️ 🌙 ⭐"
    },
    birthday: {
      accent: "#fbbf24",
      eyebrow: "A SPECIAL DAY",
      title: "Happy Birthday",
      body: "On this day, the world was given a light that has never stopped shining. Today is about celebrating the incredible person you are and the joy you bring to everyone around you.",
      closing: "may your year be as bright as you.",
      emojis: "🎈 🎂 ✨"
    }
  };

  const config = data[occasion];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 950,
      background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'all' : 'none',
      transition: 'opacity 0.4s'
    }}>
      <div style={{
        width: 'min(420px, 92vw)',
        background: 'rgba(10,6,16,0.97)',
        borderRadius: '22px',
        padding: '38px 34px',
        textAlign: 'center',
        border: `1px solid ${config.accent}`,
        boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
        animation: visible ? 'cardIn 0.7s cubic-bezier(.16,1,.3,1)' : 'none',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            opacity: 0.5
          }}
        >✕</button>

        <div style={{ color: config.accent, letterSpacing: '5px', marginBottom: 12 }}>✦ ✦ ✦ ✦</div>
        <div style={{ 
          fontSize: 10, 
          letterSpacing: 2, 
          color: 'rgba(255,255,255,0.4)', 
          textTransform: 'uppercase', 
          marginBottom: 8 
        }}>{config.eyebrow}</div>
        
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 36,
          fontWeight: 'bold',
          margin: '0 0 16px',
          color: config.accent,
          background: `linear-gradient(to bottom, #fff, ${config.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>{config.title}</h2>

        <div style={{ height: 1, background: config.accent, opacity: 0.3, width: '60px', margin: '0 auto 20px' }} />

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 13,
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.5)',
          margin: '0 0 20px'
        }}>{config.body}</p>

        <div style={{ 
          fontSize: 12, 
          color: config.accent, 
          fontFamily: "'Cormorant Garamond', serif", 
          fontStyle: 'italic',
          marginBottom: 16 
        }}>{config.closing}</div>

        <div style={{ fontSize: 20 }}>{config.emojis}</div>
      </div>
    </div>
  );
};

export default function InteractiveOpening({ 
  occasion, 
  recipientName, 
  senderName, 
  onComplete 
}: InteractiveOpeningProps) {
  const [cardVisible, setCardVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [interacted, setInteracted] = useState(false);

  const showRevealCard = () => {
    setCardVisible(true);
  };

  const handleCardClose = () => {
    setCardVisible(false);
    setTimeout(onComplete, 300);
  };

  // --- OCCASION 1: PROPOSAL ---
  const ProposalScene = () => {
    const [opened, setOpened] = useState(false);
    const [showRing, setShowRing] = useState(false);

    const handleClick = () => {
      if (opened) return;
      setOpened(true);
      setInteracted(true);
      setTimeout(() => {
        setShowRing(true);
        spawnBurst(containerRef.current, 50, 50, 36, ['#a855f7', '#d4af37', '#fff']);
      }, 600);
      setTimeout(showRevealCard, 2900);
    };

    return (
      <div style={{ 
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', perspective: '700px' 
      }}>
        <div 
          onClick={handleClick}
          style={{
            width: 190, height: 162, position: 'relative', cursor: 'pointer',
            animation: !opened ? 'floatY 3s ease-in-out infinite' : 'none'
          }}
        >
          {/* Lid */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 82, 
            background: 'linear-gradient(160deg, #38127a, #220c50)',
            border: '1px solid rgba(180,140,255,0.22)',
            borderRadius: '10px 10px 0 0',
            zIndex: 3,
            transformOrigin: 'bottom center',
            transition: 'transform 0.85s cubic-bezier(.16,1,.3,1)',
            transform: opened ? 'rotateX(-120deg)' : 'rotateX(0deg)',
            transformStyle: 'preserve-3d'
          }}>
             <div style={{
               position: 'absolute', inset: 0, 
               background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.025) 3px, rgba(255,255,255,0.025) 6px)',
               pointerEvents: 'none'
             }} />
             <div style={{
               position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
               width: 12, height: 12, borderRadius: '50%',
               background: 'radial-gradient(circle at center, #e0c8ff, #a060e0)',
               boxShadow: '0 0 8px rgba(180,140,255,0.7)'
             }} />
          </div>
          {/* Body */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 92,
            background: 'linear-gradient(160deg, #2c0e60, #1a0838)',
            borderRadius: '6px 6px 12px 12px',
            zIndex: 1
          }}>
            <div style={{ 
              position: 'absolute', inset: '8px', borderRadius: '4px',
              background: 'radial-gradient(circle at center, #42186a, #1a0838)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {/* Ring SVG */}
              <svg 
                width="80" height="80" viewBox="0 0 80 80"
                style={{ 
                  opacity: showRing ? 1 : 0,
                  transform: showRing ? 'translateY(-12px) scale(1.2)' : 'translateY(18px) scale(0.5)',
                  transition: 'all 0.85s cubic-bezier(.16,1,.3,1)'
                }}
              >
                <defs>
                   <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                     <stop offset="0%" stopColor="#fff" />
                     <stop offset="100%" stopColor="#d4af37" />
                   </radialGradient>
                   <filter id="goldGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <ellipse cx="40" cy="50" rx="20" ry="15" fill="none" stroke="#d4af37" strokeWidth="7" filter="url(#goldGlow)" />
                <polygon points="40,20 50,30 40,40 30,30" fill="#eef6ff" filter="url(#goldGlow)">
                   <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                </polygon>
                <g filter="url(#goldGlow)">
                  <line x1="40" y1="10" x2="40" y2="20" stroke="#d4af37" strokeWidth="1" />
                  <line x1="40" y1="40" x2="40" y2="50" stroke="#d4af37" strokeWidth="1" />
                  <line x1="20" y1="30" x2="30" y2="30" stroke="#d4af37" strokeWidth="1" />
                  <line x1="50" y1="30" x2="60" y2="30" stroke="#d4af37" strokeWidth="1" />
                </g>
              </svg>
            </div>
          </div>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)',
            width: 80, height: 80, borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(150,80,255,0.55), transparent 70%)',
            opacity: showRing ? 1 : 0,
            transition: 'opacity 0.85s',
            pointerEvents: 'none'
          }} />
        </div>
        {!interacted && <div className="hint-text">click to open ✦</div>}
      </div>
    );
  };

  // --- OCCASION 2: VALENTINE'S ---
  const ValentinesScene = () => {
    const [pluckedCount, setPluckedCount] = useState(0);
    const [pluckedPetals, setPluckedPetals] = useState<number[]>([]);

    const handlePetalClick = (i: number) => {
      if (pluckedPetals.includes(i)) return;
      setPluckedPetals(prev => [...prev, i]);
      setPluckedCount(prev => prev + 1);
      setInteracted(true);
      
      if (pluckedCount + 1 === 8) {
        spawnBurst(containerRef.current, 50, 40, 40, ['#ff4060', '#ff80a0', '#ffffff']);
        setTimeout(showRevealCard, 700);
      }
    };

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 14, color: '#ff4060', marginBottom: 20, letterSpacing: 1 }}>
          {pluckedCount < 8 ? `🌹 X ${8 - pluckedCount} petals left` : "💛 she loves me!"}
        </div>
        <svg width="300" height="340" viewBox="0 0 300 340" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="greenGrad">
              <stop offset="0%" stopColor="#6aaa30" />
              <stop offset="100%" stopColor="#2d5a10" />
            </radialGradient>
            <radialGradient id="petalGrad1">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#c4304f" />
            </radialGradient>
            <radialGradient id="petalGrad2">
              <stop offset="0%" stopColor="#ff758c" />
              <stop offset="100%" stopColor="#ff7eb3" />
            </radialGradient>
            <radialGradient id="stamenGrad">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
            <linearGradient id="innerPetalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d00" />
              <stop offset="100%" stopColor="#800" />
            </linearGradient>
            <filter id="petalShadow"><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" /></filter>
          </defs>
          {/* Stem */}
          <path d="M 150 185 Q 160 250 150 320" stroke="#3a8020" strokeWidth="5" fill="none" />
          
          {/* Leaves */}
          <ellipse cx="134" cy="240" rx="15" ry="25" fill="url(#greenGrad)" transform="rotate(-35, 134, 240)" />
          <ellipse cx="162" cy="268" rx="15" ry="25" fill="url(#greenGrad)" transform="rotate(30, 162, 268)" />

          {/* Sepals */}
          {[ -18, 18, 68, -68, 135 ].map((rot, i) => (
            <ellipse key={i} cx="150" cy="165" rx="5" ry="12" fill="url(#greenGrad)" opacity="0.85" transform={`rotate(${rot}, 150, 165)`} />
          ))}

          {/* Inner Petals */}
          {Array.from({ length: 8 }).map((_, i) => (
             <g key={`inner-${i}`} transform={`rotate(${i * 45 + 22.5}, 150, 150)`} opacity="0.92">
               <ellipse cx="150" cy="108" rx="17" ry="32" fill="url(#innerPetalGrad)" />
             </g>
          ))}

          {/* Outer Petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const isPlucked = pluckedPetals.includes(i);
            const angle = i * 45;
            return (
              <g 
                key={`outer-${i}`} 
                onClick={() => handlePetalClick(i)}
                style={{
                  cursor: isPlucked ? 'default' : 'pointer',
                  transform: isPlucked ? `rotate(${angle}deg) translate(0, -300px) scale(0.1)` : `rotate(${angle}deg)`,
                  transformOrigin: '150px 150px',
                  opacity: isPlucked ? 0 : 1,
                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: isPlucked ? 'none' : 'auto'
                }}
              >
                <ellipse cx="150" cy="84" rx="28" ry="50" fill={i % 2 === 0 ? "url(#petalGrad1)" : "url(#petalGrad2)"} filter="url(#petalShadow)" />
                <ellipse cx="150" cy="84" rx="20" ry="35" fill="rgba(255,190,210,0.15)" />
                <line x1="150" y1="134" x2="150" y2="70" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              </g>
            );
          })}

          {/* Stamen */}
          <circle cx="150" cy="150" r="24" fill="url(#stamenGrad)" />
          <circle cx="150" cy="150" r="16" fill="rgba(255,255,255,0.2)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`stam-${i}`} transform={`rotate(${i * 45}, 150, 150)`}>
              <line x1="150" y1="150" x2="150" y2="130" stroke="#d4a010" strokeWidth="1" />
              <circle cx="150" cy="130" r="2.5" fill="#ffcc22" />
            </g>
          ))}
          <ellipse cx="158" cy="144" rx="3" ry="5" fill="rgba(255,255,255,0.35)" />
        </svg>
        {!interacted && <div className="hint-text">click each petal to pluck it ✦</div>}
      </div>
    );
  };

  // --- OCCASION 3: LONG DISTANCE ---
  const LongDistanceScene = () => {
    const [launched, setLaunched] = useState(false);
    const [planeCoords, setPlaneCoords] = useState({ x: 100, y: 210, angle: 0, opacity: 1 });
    const [labelsVisible, setLabelsVisible] = useState(false);
    const [ripples, setRipples] = useState<number[]>([]);
    
    // YOU pin at (100, 210)
    // ME pin at (620, 210)
    // Control Point (360, 40)
    
    const handlePlaneClick = () => {
      if (launched) return;
      setLaunched(true);
      setInteracted(true);

      const duration = 2800;
      const start = Date.now();

      const animate = () => {
        const now = Date.now();
        const t = Math.min(1, (now - start) / duration);
        
        // Quadratic Bezier: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        // P0 (100, 210), P1 (360, 40), P2 (620, 210)
        const x = (1 - t) ** 2 * 100 + 2 * (1 - t) * t * 360 + t ** 2 * 620;
        const y = (1 - t) ** 2 * 210 + 2 * (1 - t) * t * 40 + t ** 2 * 210;

        // Angle for rotation
        const nextT = Math.min(1, t + 0.01);
        const nx = (1 - nextT) ** 2 * 100 + 2 * (1 - nextT) * nextT * 360 + nextT ** 2 * 620;
        const ny = (1 - nextT) ** 2 * 210 + 2 * (1 - nextT) * nextT * 40 + nextT ** 2 * 210;
        const angle = Math.atan2(ny - y, nx - x) * 180 / Math.PI;

        setPlaneCoords({
          x, y, 
          angle: t > 0.99 ? 0 : angle,
          opacity: t > 0.98 ? 0 : 1
        });

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // Arrived
          setLabelsVisible(true);
          setRipples([1, 2, 3, 4]);
          setTimeout(showRevealCard, 1100);
        }
      };

      animate();
    };

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg 
          viewBox="0 0 720 420" 
          style={{ width: 'min(720px, 96vw)', height: 'min(420px, 65vh)', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="planeGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          
          <path 
            d="M 100 210 Q 360 40 620 210" 
            stroke="url(#threadGrad)" 
            strokeWidth="1.5" 
            fill="none"
            strokeDasharray="720"
            strokeDashoffset={launched ? 0 : 720}
            style={{ transition: 'stroke-dashoffset 2s ease-out' }}
          />

          {/* YOU Pin */}
          <g transform="translate(100, 210)">
            <circle r="12" fill="#3b82f6" opacity="0.1" style={{ animation: 'pinRing 2s infinite' }} />
            <circle r="6" fill="#3b82f6" />
            <text y="24" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">YOU</text>
            <text y="40" textAnchor="middle" fill="#3b82f6" fontSize="12" opacity={labelsVisible ? 1 : 0} style={{ transition: 'opacity 0.5s' }}>MUMBAI</text>
          </g>

          {/* ME Pin */}
          <g transform="translate(620, 210)">
            <circle r="12" fill="#ec4899" opacity="0.1" style={{ animation: 'pinRing 2s infinite' }} />
            <circle r="6" fill="#ec4899" />
            <text y="24" textAnchor="middle" fill="#ec4899" fontSize="10" fontWeight="bold">ME</text>
            <text y="40" textAnchor="middle" fill="#ec4899" fontSize="12" opacity={labelsVisible ? 1 : 0} style={{ transition: 'opacity 0.5s' }}>LONDON</text>
          </g>

          {/* Ripples at Me Pin */}
          {ripples.map(i => (
            <g key={i} transform="translate(620, 210)">
              <circle 
                r="0" 
                stroke="#ec4899" 
                strokeWidth="1.5" 
                fill="none" 
                style={{ animation: 'rippleInSVG 1s ease-out forwards', animationDelay: `${i * 0.25}s` }} 
              />
            </g>
          ))}

          {/* Plane Group */}
          <g 
            onClick={handlePlaneClick}
            style={{ 
              cursor: launched ? 'default' : 'pointer',
              opacity: planeCoords.opacity,
              transition: launched ? 'none' : 'opacity 0.5s'
            }}
            transform={`translate(${planeCoords.x}, ${planeCoords.y}) rotate(${planeCoords.angle})`}
          >
            <g transform="translate(-26, -21)" filter="url(#planeGlow)">
              <ellipse cx="28" cy="21" rx="20" ry="7" fill="rgba(255,255,255,0.95)" />
              <path d="M48,21 L34,15 L34,27 Z" fill="rgba(220,235,255,0.9)" />
              <path d="M8,21 L14,10 L18,21 Z" fill="rgba(200,220,255,0.75)" />
              <path d="M8,21 L14,32 L18,21 Z" fill="rgba(200,220,255,0.75)" />
              <path d="M30,21 L36,6 L42,15 L34,21 Z" fill="rgba(240,248,255,0.85)" />
              <path d="M30,21 L36,36 L42,27 L34,21 Z" fill="rgba(240,248,255,0.85)" />
              <circle cx="34" cy="19" r="1.5" fill="rgba(150,200,255,0.5)" />
              <circle cx="28" cy="19" r="1.5" fill="rgba(150,200,255,0.5)" />
              <circle cx="22" cy="19" r="1.5" fill="rgba(150,200,255,0.5)" />
            </g>
          </g>
        </svg>

        {!interacted && <div className="hint-text">click the plane to send ✈</div>}
      </div>
    );
  };

  // --- OCCASION 4: ANNIVERSARY ---
  const AnniversaryScene = () => {
    const [litCount, setLitCount] = useState(0);
    const [litCandles, setLitCandles] = useState<boolean[]>([false, false, false]);

    const handleLightCandle = (i: number) => {
      if (litCandles[i]) return;
      const next = [...litCandles];
      next[i] = true;
      setLitCandles(next);
      const newCount = litCount + 1;
      setLitCount(newCount);
      setInteracted(true);
      spawnBurst(containerRef.current, 50, 40, 12, ['#ffcc44', '#ff8800', '#d4af37']);

      if (newCount === 3) {
        setTimeout(showRevealCard, 1400);
      }
    };

    return (
      <div style={{ 
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: -25, position: 'relative', zIndex: 10 }}>
          {litCandles.map((isLit, i) => (
            <div 
              key={i} 
              onClick={() => handleLightCandle(i)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: isLit ? 'default' : 'pointer', padding: '10px 5px' }}
            >
              {/* Flame */}
              <div style={{
                width: 14, height: 22, opacity: isLit ? 1 : 0, transform: isLit ? 'scale(1)' : 'scale(0)',
                transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
                filter: 'drop-shadow(0 0 4px gold)',
                animation: isLit ? 'flickerFlame .6s ease-in-out infinite alternate' : 'none',
              }}>
                 <svg viewBox="0 0 20 30" width="100%" height="100%">
                   <path d="M 10 0 C 15 10 18 20 10 30 C 2 20 5 10 10 0" fill="#ffcc44" />
                   <path d="M 10 10 C 13 15 15 22 10 28 C 5 22 7 15 10 10" fill="#ff8800" opacity="0.7" />
                 </svg>
              </div>
              <div style={{ width: 2.5, height: 8, background: '#3a2010', borderRadius: 1 }} />
              <div style={{ 
                width: 10, height: 48, borderRadius: 3, 
                background: 'linear-gradient(180deg, #edd060, #c9a030)',
                boxShadow: isLit ? '0 0 15px rgba(212,175,55,0.6)' : 'none'
              }} />
            </div>
          ))}
        </div>
        
        {/* Cake Tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}>
          <div style={{ width: 115, height: 60, background: 'linear-gradient(160deg, #d4af37, #a07820)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
             <div style={{ height: 10, background: 'rgba(255,242,200,0.4)', borderRadius: '6px 6px 0 0' }} />
          </div>
          <div style={{ width: 175, height: 68, background: 'linear-gradient(160deg, #c49028, #8b6010)', position: 'relative' }}>
             <div style={{ height: 12, background: 'rgba(255,242,200,0.4)' }} />
          </div>
          <div style={{ width: 235, height: 78, background: 'linear-gradient(160deg, #b07820, #7a5010)', borderRadius: '4px 4px 18px 18px', position: 'relative' }}>
             <div style={{ height: 14, background: 'rgba(255,242,200,0.4)' }} />
          </div>
          <div style={{ width: 258, height: 20, background: 'linear-gradient(160deg, #c8a050, #906020)', borderRadius: '50%', marginTop: -5 }} />
        </div>

        {!interacted && <div className="hint-text">click each candle to light it ✦</div>}
      </div>
    );
  };

  // --- OCCASION 5: JUST BECAUSE ---
  const JustBecauseScene = () => {
    const [opened, setOpened] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [showHeart, setShowHeart] = useState(false);

    const handleBoxClick = () => {
      if (opened || shaking) return;
      setShaking(true);
      setInteracted(true);
      setTimeout(() => {
        setShaking(false);
        setOpened(true);
        spawnBurst(containerRef.current, 50, 50, 42, ['#00d4b8', '#34d399', '#ffffff', '#fbbf24', '#a7f3d0']);
        setTimeout(() => setShowHeart(true), 300);
        setTimeout(showRevealCard, 1400);
      }, 550);
    };

    return (
      <div style={{ 
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <div 
          onClick={handleBoxClick}
          style={{
            width: 165, height: 148, position: 'relative', cursor: 'pointer',
            animation: shaking ? 'giftShake 0.55s linear' : (!opened ? 'floatY 3s ease-in-out infinite' : 'none')
          }}
        >
          {/* Ambient Glow */}
          {!opened && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 240, height: 240, background: 'radial-gradient(circle at center, rgba(0,212,184,0.15), transparent 70%)',
              pointerEvents: 'none', zIndex: 0
            }} />
          )}

          {/* Lid */}
          <div style={{
            position: 'absolute', top: -10, left: -7, right: -7, height: 46,
            background: 'linear-gradient(160deg, #00d4b8, #00a898)',
            borderRadius: 9, zIndex: 3,
            animation: opened ? 'lidPop 0.65s forwards' : 'none'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 'calc(50% - 4.5px)', width: 9, height: '100%', background: 'rgba(255,255,255,0.22)' }} />
            <div style={{ position: 'absolute', left: 0, top: 'calc(50% - 4.5px)', width: '100%', height: 9, background: 'rgba(255,255,255,0.22)' }} />
            <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 28, filter: 'drop-shadow(0 0 8px teal)' }}>🎀</div>
          </div>

          {/* Body */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 106,
            background: 'linear-gradient(160deg, #008080, #005555)',
            borderRadius: '5px 5px 12px 12px', zIndex: 1
          }}>
            <div style={{ position: 'absolute', top: 0, left: 'calc(50% - 4.5px)', width: 9, height: '100%', background: 'rgba(255,255,255,0.22)' }} />
            {showHeart && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%', fontSize: 60, zIndex: 2,
                transform: 'translate(-50%, -50%)',
                animation: 'heartRise 1s ease-out forwards'
              }}>💚</div>
            )}
          </div>
        </div>
        {!interacted && <div className="hint-text">click to unwrap ✦</div>}
      </div>
    );
  };

  const BirthdayScene = () => <AnniversaryScene />;

  const scenes = {
    anniversary: <AnniversaryScene />,
    valentines: <ValentinesScene />,
    proposal: <ProposalScene />,
    just_because: <JustBecauseScene />,
    long_distance: <LongDistanceScene />,
    birthday: <BirthdayScene />
  };

  const backgrounds = {
    anniversary: 'radial-gradient(ellipse 80% 70% at 50% 60%, #1a0e04 0%, #0d0806 55%, #050403 100%)',
    valentines: 'radial-gradient(ellipse 80% 70% at 50% 40%, #2e0818 0%, #160408 55%, #080205 100%)',
    proposal: 'radial-gradient(ellipse 80% 80% at 50% 88%, #1e0a48 0%, #0e0520 45%, #04020c 100%)',
    just_because: 'radial-gradient(ellipse 80% 70% at 50% 60%, #021618 0%, #010d10 55%, #010608 100%)',
    long_distance: 'linear-gradient(160deg, #01040d 0%, #030916 50%, #020407 100%)',
    birthday: 'radial-gradient(ellipse 80% 70% at 50% 60%, #1a1604 0%, #0d0b06 55%, #050403 100%)'
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: backgrounds[occasion],
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes floatY { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
        @keyframes hintPulse { 0%,100%{ opacity:.22 } 50%{ opacity:.58 } }
        @keyframes twinkle { 0%,100%{ opacity:.07; transform:scale(.7) } 50%{ opacity:.7; transform:scale(1.2) } }
        @keyframes cpBurst { 0%{ transform:translate(-50%,-50%) scale(0); opacity:1 } 100%{ transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity:0 } }
        @keyframes pinRing { 0%,100%{ transform:scale(1); opacity:.35 } 50%{ transform:scale(1.6); opacity:.08 } }
        @keyframes rippleInSVG { from { r: 5; opacity: 1; } to { r: 60; opacity: 0; } }
        @keyframes flickerFlame { 0%{ transform:scale(1) skewX(0) } 100%{ transform:scale(.87) skewX(4deg) } }
        @keyframes cardIn { from{ opacity:0; transform:scale(.55) rotateY(45deg) } 60%{ transform:scale(1.04) rotateY(-4deg) } to{ opacity:1; transform:scale(1) rotateY(0) } }
        @keyframes giftShake { 0%,100%{ transform:rotate(0) } 20%{ transform:rotate(-5deg) } 40%{ transform:rotate(5deg) } 60%{ transform:rotate(-3deg) } 80%{ transform:rotate(3deg) } }
        @keyframes lidPop { 0%{ transform:translateY(0) rotate(0); opacity:1 } 100%{ transform:translateY(-140px) rotate(20deg); opacity:0 } }
        @keyframes heartRise { 0%{ opacity:1; transform:translate(-50%,-50%) scale(1) } 100%{ opacity:0; transform:translate(-50%, -250px) scale(1.6) } }
        @keyframes burstFly { 0% { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); } 100% { opacity: 0; transform: translate(var(--bx),var(--by)) scale(0.4) rotate(var(--br)); } }
        
        .hint-text {
          position: absolute;
          bottom: 15%;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          animation: hintPulse 2s infinite;
          pointer-events: none;
        }
      `}</style>
      
      {/* Stars/Ambient Layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 90 }).map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 2, height: 2, borderRadius: '50%',
              background: i % 3 === 0 ? 'white' : (i % 3 === 1 ? 'rgba(180,140,255,.8)' : 'rgba(210,180,255,.5)'),
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div 
        onClick={showRevealCard}
        style={{
          position: 'absolute', top: 18, right: 20,
          fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase', cursor: 'pointer', zIndex: 1000
        }}
      >
        Skip ➔
      </div>

      <div style={{ width: '100%', height: '100%', zIndex: 905 }}>
        {scenes[occasion]}
      </div>

      <RevealCard visible={cardVisible} occasion={occasion} onClose={handleCardClose} />
    </div>
  );
}
