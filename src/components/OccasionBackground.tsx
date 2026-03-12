"use client";
import { useEffect, useMemo } from "react";

interface Particle {
  id: string;
  emoji: string;
  size: number;
  left: string;
  duration: number;
  delay: number;
  opacity: number;
  type: "float" | "balloon" | "conf" | "star" | "plane" | "butterfly";
}

interface OccasionBackgroundProps {
  occasion: string;
}

export default function OccasionBackground({ occasion }: OccasionBackgroundProps) {
  const bgParticles = useMemo(() => generateParticles(occasion), [occasion]);

  useEffect(() => {
    // Component mounted
  }, [occasion]);

  function generateParticles(occasion: string): Particle[] {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
    const multiplier = isMobile ? 0.5 : 1;
    
    switch (occasion) {
      case "anniversary":
        return Array.from({ length: Math.floor(28 * multiplier) }, (_, i) => ({
          id: `ann-particle-${i}`,
          emoji: ['🌹','💕','✨','💗','🌸','💞','🥂','💫'][Math.floor(Math.random() * 8)],
          size: 12 + Math.random() * 18,
          left: `${Math.random() * 100}%`,
          duration: 7 + Math.random() * 10,
          delay: Math.random() * 8,
          opacity: 0.15 + Math.random() * 0.25,
          type: "float"
        }));
      
      case "birthday":
        const balloons = Array.from({ length: Math.floor(14 * multiplier) }, (_, i) => ({
          id: `balloon-${i}`,
          emoji: ['🎈','🎀','🎁','🧸','🪆','🎊','🎉','⭐','✨','🌟','🎂','🍭'][Math.floor(Math.random() * 13)],
          size: 28 + Math.random() * 30,
          left: `${5 + Math.random() * 90}%`,
          duration: 10 + Math.random() * 8,
          delay: Math.random() * 10,
          opacity: 0.15 + Math.random() * 0.23,
          type: "balloon"
        }));
        
        const confetti = Array.from({ length: Math.floor(40 * multiplier) }, (_, i) => ({
          id: `conf-${i}`,
          emoji: '',
          size: 5 + Math.random() * 8,
          left: `${Math.random() * 100}%`,
          duration: 3 + Math.random() * 4,
          delay: Math.random() * 6,
          opacity: 0.28 + Math.random() * 0.32,
          type: "conf"
        }));
        
        return [...balloons, ...confetti];
      
      case "valentines":
        return Array.from({ length: Math.floor(32 * multiplier) }, (_, i) => ({
          id: `heart-${i}`,
          emoji: ['❤️','💕','💗','💝','💖','💓','🌹','💋','🥰'][Math.floor(Math.random() * 9)],
          size: 10 + Math.random() * 20,
          left: `${Math.random() * 100}%`,
          duration: 7 + Math.random() * 9,
          delay: Math.random() * 9,
          opacity: 0.10 + Math.random() * 0.22,
          type: "float"
        }));
      
      case "proposal":
        const stars = Array.from({ length: Math.floor(60 * multiplier) }, (_, i) => ({
          id: `star-${i}`,
          emoji: '',
          size: 1 + Math.random() * 3.5,
          left: `${Math.random() * 100}%`,
          duration: 2 + Math.random() * 5,
          delay: Math.random() * 5,
          opacity: 0.3 + Math.random() * 0.6,
          type: "star"
        }));
        
        const props = Array.from({ length: Math.floor(18 * multiplier) }, (_, i) => ({
          id: `prop-${i}`,
          emoji: ['💍','✨','⭐','💫','🌟','💎','🕯️'][Math.floor(Math.random() * 7)],
          size: 10 + Math.random() * 16,
          left: `${Math.random() * 100}%`,
          duration: 9 + Math.random() * 10,
          delay: Math.random() * 5,
          opacity: 0.08 + Math.random() * 0.17,
          type: "float"
        }));
        
        return [...stars, ...props];
      
      case "just_because":
        const butterflies = Array.from({ length: Math.floor(6 * multiplier) }, (_, i) => ({
          id: `butterfly-${i}`,
          emoji: ['🦋','🌸','🌺'][Math.floor(Math.random() * 3)],
          size: 22 + Math.random() * 20,
          left: `${10 + Math.random() * 80}%`,
          duration: 10 + Math.random() * 8,
          delay: Math.random() * 8,
          opacity: 0.16 + Math.random() * 0.22,
          type: "butterfly"
        }));
        
        const petals = Array.from({ length: Math.floor(24 * multiplier) }, (_, i) => ({
          id: `petal-${i}`,
          emoji: ['🌸','🌷','🌺','🌼','💐','🌻','🌿','🍃'][Math.floor(Math.random() * 8)],
          size: 12 + Math.random() * 18,
          left: `${Math.random() * 100}%`,
          duration: 8 + Math.random() * 10,
          delay: Math.random() * 9,
          opacity: 0.10 + Math.random() * 0.20,
          type: "float"
        }));
        
        return [...butterflies, ...petals];
      
      case "long_distance":
        const planes = Array.from({ length: Math.floor(4 * multiplier) }, (_, i) => ({
          id: `plane-${i}`,
          emoji: '✈️',
          size: 20 + Math.random() * 18,
          left: '-10%',
          duration: 12 + Math.random() * 10,
          delay: i * 5,
          opacity: 0.18 + Math.random() * 0.22,
          type: "plane"
        }));
        
        const spaceParticles = Array.from({ length: Math.floor(20 * multiplier) }, (_, i) => ({
          id: `space-${i}`,
          emoji: ['🌙','⭐','💫','✨','🌍','💌','❤️','🛸','🌠'][Math.floor(Math.random() * 9)],
          size: 10 + Math.random() * 16,
          left: `${Math.random() * 100}%`,
          duration: 9 + Math.random() * 10,
          delay: Math.random() * 5,
          opacity: 0.08 + Math.random() * 0.14,
          type: "float"
        }));
        
        return [...planes, ...spaceParticles];
      
      default:
        return [];
    }
  }

  function renderParticle(particle: Particle) {
    const baseStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 1,
      pointerEvents: "none",
      fontSize: `${particle.size}px`,
      left: particle.left,
      opacity: particle.opacity,
      animationDelay: `${particle.delay}s`,
    };

    switch (particle.type) {
      case "float":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              animation: `floatUp ${particle.duration}s ease-in-out infinite`,
            }}
          >
            {particle.emoji}
          </div>
        );
      
      case "balloon":
        return (
          <div
            key={particle.id}
            style={{
              position: "fixed",
              zIndex: 1,
              pointerEvents: "none",
              width: `${particle.size}px`,
              height: `${particle.size * 1.5}px`,
              borderRadius: "2px",
              background: ['#ff6b8a','#ffd166','#06d6a0','#118ab2','#ef476f','#ffc8dd','#b5e48c'][Math.floor(Math.random() * 6)],
              opacity: particle.opacity,
              animation: `confFall ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              left: particle.left,
              bottom: "-10px",
            }}
          />
        );
      
      case "star":
        return (
          <div
            key={particle.id}
            style={{
              position: "fixed",
              zIndex: 1,
              pointerEvents: "none",
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: "50%",
              background: "#ffffff",
              animation: `starTwinkle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        );
      
      case "plane":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              top: `${10 + Math.random() * 40}%`,
              animation: `planeFly ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.emoji}
          </div>
        );
      
      case "butterfly":
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              top: `${20 + Math.random() * 70}%`,
              animation: `butterflyFly ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.emoji}
          </div>
        );
      
      default:
        return null;
    }
  }

  function renderBgElements(occasion: string) {
    switch (occasion) {
      case "anniversary":
        return (
          <>
            {/* Couple silhouette */}
            <div style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(100px,18vw,160px)",
              opacity: 0.06,
              animation: "coupleFloat 6s ease-in-out infinite",
              filter: "blur(1px)",
              pointerEvents: "none",
              zIndex: 0,
            }}>💑</div>
            
            {/* Ring glow orb */}
            <div style={{
              position: "fixed",
              top: "35%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 220, height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,175,122,0.1) 0%, transparent 70%)",
              animation: "ringPulse 3s ease-in-out infinite",
              pointerEvents: "none",
              zIndex: 0,
            }} />
          </>
        );
      
      case "birthday":
        return (
          <>
            {/* Giant dim cake */}
            <div style={{
              position: "fixed",
              bottom: "3%", left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(80px,14vw,130px)",
              opacity: 0.05,
              animation: "cakePulse 4s ease-in-out infinite",
              filter: "blur(1.5px)",
              zIndex: 0,
            }}>🎂</div>
          </>
        );
      
      case "valentines":
        return (
          <>
            {/* Giant heart background glow */}
            <div style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              fontSize: "min(500px,80vw)",
              opacity: 0.035,
              animation: "cakePulse 4s ease-in-out infinite",
              filter: "blur(2px)",
              lineHeight: 1,
              zIndex: 0,
            }}>❤️</div>
            
            {/* Cupid arrow */}
            <div style={{
              position: "fixed",
              top: "30%", left: "-10%",
              fontSize: 42,
              opacity: 0.1,
              animation: "arrowFly 9s 2s ease-in-out infinite",
              zIndex: 1,
            }}>💘</div>
          </>
        );
      
      case "proposal":
        return (
          <>
            {/* Large dim ring */}
            <div style={{
              position: "fixed",
              bottom: "10%", left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(60px,10vw,100px)",
              opacity: 0.07,
              animation: "ringPulse 5s ease-in-out infinite",
              filter: "blur(0.5px)",
              zIndex: 0,
            }}>💍</div>
            
            {/* Moonlight beam */}
            <div style={{
              position: "fixed",
              top: "-5%", left: "50%",
              width: 3, height: "60%",
              background: "linear-gradient(to bottom, rgba(212,175,122,0.18), transparent)",
              animation: "beamSway 7s ease-in-out infinite",
              zIndex: 0,
            }} />
          </>
        );
      
      case "just_because":
        return (
          <>
            {/* Giant spinning flower bottom-right */}
            <div style={{
              position: "fixed",
              bottom: "-5%", right: "-5%",
              fontSize: "clamp(120px,22vw,200px)",
              opacity: 0.045,
              animation: "flowerSpin 20s linear infinite",
              filter: "blur(2px)",
              zIndex: 0,
            }}>🌸</div>
            
            {/* Giant spinning flower top-left */}
            <div style={{
              position: "fixed",
              top: "-8%", left: "-5%",
              fontSize: "clamp(100px,18vw,160px)",
              opacity: 0.035,
              animation: "flowerSpin 25s linear infinite reverse",
              filter: "blur(2px)",
              zIndex: 0,
            }}>🌺</div>
          </>
        );
      
      case "long_distance":
        return (
          <>
            {/* Glowing moon */}
            <div style={{
              position: "fixed",
              top: "8%", right: "12%",
              fontSize: "clamp(50px,8vw,80px)",
              opacity: 0.1,
              animation: "moonGlow 5s ease-in-out infinite",
              filter: "blur(0.5px)",
              zIndex: 0,
            }}>🌙</div>
            
            {/* City lights */}
            <div style={{
              position: "fixed",
              bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              fontSize: "clamp(60px,10vw,90px)",
              opacity: 0.04,
              filter: "blur(1px)",
              letterSpacing: 4,
              whiteSpace: "nowrap",
              zIndex: 0,
            }}>🏙️🌃🌆</div>
          </>
        );
      
      default:
        return null;
    }
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}>
      {/* Occasion-specific background elements */}
      {renderBgElements(occasion)}
      {/* Floating particles */}
      {bgParticles.map(particle => renderParticle(particle))}
      
      {/* Keyframes */}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.25; }
          88%  { opacity: 0.2; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
        @keyframes balloonRise {
          0%   { transform: translateY(0) rotate(-3deg);       opacity: 0; }
          8%   { opacity: 0.22; }
          85%  { opacity: 0.18; }
          100% { transform: translateY(-110vh) rotate(3deg);   opacity: 0; }
        }
        @keyframes confFall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.45; }
          90%  { opacity: 0.35; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes starTwinkle {
          0%,100% { opacity: 0;              transform: scale(1);   }
          50%     { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes planeFly {
          0%   { left: -15%;  opacity: 0;                    }
          8%   { opacity: 0.22;                   }
          45%  { transform: translateY(-20px);               }
          55%  { transform: translateY(10px);                }
          92%  { opacity: 0.18;                   }
          100% { left: 115%; opacity: 0; transform: translateY(-10px); }
        }
        @keyframes butterflyFly {
          0%   { opacity: 0;  transform: translate(0,0) rotate(0deg);        }
          5%   { opacity: 0.2;                                     }
          25%  { transform: translate(80px,-60px) rotate(20deg);             }
          50%  { transform: translate(-40px,-120px) rotate(-15deg);          }
          75%  { transform: translate(100px,-180px) rotate(25deg);           }
          95%  { opacity: 0.15;                                    }
          100% { opacity: 0;  transform: translate(50px,-250px) rotate(10deg); }
        }
        @keyframes ringPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.5; }
          50%     { transform: translate(-50%,-50%) scale(1.5); opacity: 1;   }
        }
        @keyframes coupleFloat {
          0%,100% { transform: translateX(-50%) translateY(0);    }
          50%     { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes moonGlow {
          0%,100% { filter: blur(0.5px) drop-shadow(0 0 10px rgba(200,210,255,0.2)); }
          50%     { filter: blur(0.5px) drop-shadow(0 0 28px rgba(200,210,255,0.5)); }
        }
        @keyframes flowerSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes arrowFly {
          0%   { left: -10%; top: 35%; opacity: 0;    transform: rotate(-15deg); }
          15%  { opacity: 0.15; }
          50%  { left: 50%;  top: 28%; }
          85%  { opacity: 0.12; }
          100% { left: 110%; top: 22%; opacity: 0;    transform: rotate(-10deg); }
        }
        @keyframes beamSway {
          0%,100% { transform: translateX(-50%) rotate(-3deg); }
          50%     { transform: translateX(-50%) rotate(3deg); }
        }
        @keyframes cakePulse {
          0%,100% { transform: translateX(-50%) scale(1);    }
          50%     { transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
