"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FX Helpers ─── */
function spawnParticles(cx, cy, count = 55) {
  const colors = ["#f7d06a","#e8c050","#fff8dc","#fff","#ffd700","#ffc0cb","#ffe4b5","#ffdead"];
  for (let i = 0; i < count; i++) {
    const el    = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist  = 60 + Math.random() * 220;
    const size  = 2 + Math.random() * 8;
    const dur   = 900 + Math.random() * 800;
    const delay = Math.random() * 300;
    const isHeart = Math.random() > 0.65;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width:  isHeart ? "auto" : size + "px",
      height: isHeart ? "auto" : size + "px",
      fontSize: isHeart ? (10 + Math.random() * 12) + "px" : "0",
      borderRadius: isHeart ? "0" : Math.random() > 0.5 ? "50%" : "2px",
      background: isHeart ? "transparent" : colors[Math.floor(Math.random() * colors.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    if (isHeart) el.textContent = ["✦","·","★","♥","✿"][Math.floor(Math.random()*5)];
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0) rotate(${Math.random()*360}deg)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy, color = "rgba(247,208,106,0.65)") {
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("div");
    const size = 40 + i * 65;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px",
      borderRadius: "50%",
      border: `1.5px solid ${color}`,
      pointerEvents: "none", zIndex: 9998,
      transform: "translate(-50%,-50%) scale(0)", opacity: "0.8",
      transition: `transform ${0.8 + i * 0.18}s ease-out ${i * 0.14}s, opacity ${0.8 + i * 0.18}s ease-out ${i * 0.14}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = "translate(-50%,-50%) scale(1)";
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), 1700);
  }
}

/* ─── Floating Sparkle ─── */
function FloatingSparkle({ style, emoji }) {
  return <div className="pointer-events-none select-none absolute" style={style}>{emoji}</div>;
}

/* ─── Locket SVG ─── */
function LocketSVG({ phase }) {
  const isOpen    = phase === "open" || phase === "revealed";
  const isOpening = phase === "opening";

  return (
    <div className="relative w-full h-full">
      <style>{`
        .locket-left  { transform-origin: right center; transition: transform 0.75s cubic-bezier(0.4,0,0.2,1); }
        .locket-right { transform-origin: left  center; transition: transform 0.75s cubic-bezier(0.4,0,0.2,1); }
        .locket-left.open  { transform: perspective(300px) rotateY(-145deg); }
        .locket-right.open { transform: perspective(300px) rotateY( 145deg); }
        @keyframes locketGlow {
          0%,100%{filter:drop-shadow(0 0 10px rgba(247,208,106,0.4)) drop-shadow(0 0 24px rgba(200,160,20,0.25))}
          50%{filter:drop-shadow(0 0 22px rgba(247,208,106,0.75)) drop-shadow(0 0 50px rgba(200,160,20,0.4))}
        }
        .locket-idle { animation: locketGlow 2s ease-in-out infinite; }
        @keyframes innerGlowPulse {
          0%,100%{opacity:0.5} 50%{opacity:1}
        }
        .inner-glow { animation: innerGlowPulse 1.8s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 180 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#c8a830"/>
            <stop offset="40%" stopColor="#f7d06a"/>
            <stop offset="70%" stopColor="#b8922a"/>
            <stop offset="100%" stopColor="#f0c040"/>
          </linearGradient>
          <radialGradient id="locketFront" cx="40%" cy="35%" r="65%">
            <stop offset="0%"  stopColor="#ffe08a"/>
            <stop offset="40%" stopColor="#d4a830"/>
            <stop offset="80%" stopColor="#9a7010"/>
            <stop offset="100%" stopColor="#7a5808"/>
          </radialGradient>
          <radialGradient id="locketInner" cx="50%" cy="40%" r="55%">
            <stop offset="0%"  stopColor="#fff9e6"/>
            <stop offset="50%" stopColor="#fde4a0"/>
            <stop offset="100%" stopColor="#e8c060"/>
          </radialGradient>
          <radialGradient id="innerLight" cx="50%" cy="30%" r="50%">
            <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#f7d06a" stopOpacity="0"/>
          </radialGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="goldGlowStrong">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* Chain */}
        <path d="M90 0 Q70 10 60 28" stroke="url(#chainGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M90 0 Q110 10 120 28" stroke="url(#chainGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        {/* Chain links */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const lx = 90 - 30*t, ly = t * 28;
          const rx = 90 + 30*t, ry = t * 28;
          return (
            <g key={i}>
              <ellipse cx={lx} cy={ly} rx="3.5" ry="2" stroke="url(#chainGrad)" strokeWidth="1.2" fill="none"/>
              <ellipse cx={rx} cy={ry} rx="3.5" ry="2" stroke="url(#chainGrad)" strokeWidth="1.2" fill="none"/>
            </g>
          );
        })}
        {/* Bail (loop at top) */}
        <ellipse cx="90" cy="30" rx="8" ry="6" stroke="url(#chainGrad)" strokeWidth="3.5" fill="none" filter="url(#goldGlow)"/>

        {/* Locket body glow */}
        <ellipse cx="90" cy="120" rx="58" ry="62"
          fill="rgba(200,160,20,0.12)" filter="url(#goldGlowStrong)"/>

        {/* LEFT half */}
        <g className={`locket-left${isOpen ? " open" : ""}`}>
          <path d="M90 58 C90 58 34 68 34 118 C34 148 58 180 90 180 L90 58Z"
            fill="url(#locketFront)" filter="url(#goldGlow)"/>
          {/* Engraving on left */}
          {!isOpen && <>
            <path d="M62 100 Q75 88 90 96" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M58 115 Q74 106 90 112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M64 130 Q76 124 90 128" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" fill="none"/>
          </>}
          {/* Left inner (when open) */}
          {isOpen && (
            <path d="M90 58 C90 58 34 68 34 118 C34 148 58 180 90 180 L90 58Z"
              fill="url(#locketInner)" opacity="0.9"/>
          )}
          {/* Hinge left */}
          <rect x="87" y="56" width="3" height="12" rx="1.5" fill="#d4a830"/>
          <rect x="87" y="174" width="3" height="8" rx="1.5" fill="#d4a830"/>
        </g>

        {/* RIGHT half */}
        <g className={`locket-right${isOpen ? " open" : ""}`}>
          <path d="M90 58 C90 58 146 68 146 118 C146 148 122 180 90 180 L90 58Z"
            fill="url(#locketFront)" filter="url(#goldGlow)"/>
          {!isOpen && <>
            <path d="M118 100 Q105 88 90 96" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M122 115 Q106 106 90 112" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" fill="none"/>
            <path d="M116 130 Q104 124 90 128" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" fill="none"/>
          </>}
          {isOpen && (
            <path d="M90 58 C90 58 146 68 146 118 C146 148 122 180 90 180 L90 58Z"
              fill="url(#locketInner)" opacity="0.9"/>
          )}
          <rect x="90" y="56" width="3" height="12" rx="1.5" fill="#d4a830"/>
          <rect x="90" y="174" width="3" height="8" rx="1.5" fill="#d4a830"/>
        </g>

        {/* Center clasp */}
        {!isOpen && (
          <ellipse cx="90" cy="120" rx="5" ry="7"
            fill="#f7d06a" stroke="#c89020" strokeWidth="1"
            filter="url(#goldGlow)"/>
        )}

        {/* Heart engraving on front */}
        {!isOpen && (
          <path d="M90 105 C90 105 78 94 78 87 C78 82 82 78 87 78 C88.5 78 90 79.5 90 79.5 C90 79.5 91.5 78 93 78 C98 78 102 82 102 87 C102 94 90 105 90 105Z"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="rgba(255,255,255,0.08)"/>
        )}

        {/* Inner glow when open */}
        {isOpen && (
          <ellipse cx="90" cy="118" rx="38" ry="44"
            fill="url(#innerLight)" className="inner-glow"/>
        )}

        {/* Sparkles when open */}
        {isOpen && (<>
          <g opacity="0.9">
            <line x1="90" y1="44" x2="90" y2="54" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="85" y1="49" x2="95" y2="49" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
          <g opacity="0.7">
            <line x1="150" y1="72" x2="150" y2="80" stroke="#f7d06a" strokeWidth="2" strokeLinecap="round"/>
            <line x1="146" y1="76" x2="154" y2="76" stroke="#f7d06a" strokeWidth="2" strokeLinecap="round"/>
          </g>
          <g opacity="0.65">
            <line x1="28" y1="80" x2="28" y2="86" stroke="#ffe4b5" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="25" y1="83" x2="31" y2="83" stroke="#ffe4b5" strokeWidth="1.8" strokeLinecap="round"/>
          </g>
        </>)}
      </svg>

      {/* Inner photo frame — only visible when open */}
      {isOpen && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: "44%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64, height: 72,
            background: "linear-gradient(135deg, #fff9e6, #fde4a0)",
            borderRadius: 4,
            border: "2px solid rgba(247,208,106,0.6)",
            boxShadow: "0 0 20px rgba(247,208,106,0.5), inset 0 0 10px rgba(255,255,255,0.5)",
            animation: "locketInnerReveal 0.5s ease forwards",
          }}
        >
          <style>{`
            @keyframes locketInnerReveal {
              from{opacity:0;transform:translate(-50%,-50%) scale(0.5)}
              to{opacity:1;transform:translate(-50%,-50%) scale(1)}
            }
          `}</style>
          <div className="text-center">
            <div style={{ fontSize: "1.5rem" }}>♥</div>
            <div style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "0.65rem",
              color: "#9a6010",
              lineHeight: 1.3,
              marginTop: 2,
            }}>Always &<br/>Forever</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Champagne Bubbles ─── */
function Bubbles({ active }) {
  if (!active) return null;
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 30 + Math.random() * 40,
    delay: Math.random() * 2,
    dur:   2 + Math.random() * 3,
    size:  4 + Math.random() * 10,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {items.map(b => (
        <div key={b.id} className="absolute rounded-full" style={{
          left: `${b.left}%`, bottom: 0,
          width: b.size, height: b.size,
          background: "rgba(247,208,106,0.25)",
          border: "1px solid rgba(247,208,106,0.4)",
          animationName: "bubbleRise",
          animationDuration: `${b.dur}s`,
          animationDelay: `${b.delay}s`,
          animationFillMode: "forwards",
          animationTimingFunction: "ease-in-out",
        }}/>
      ))}
    </div>
  );
}

/* ─── Stars ─── */
function Stars() {
  const items = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100, top: Math.random() * 100,
    size: 0.4 + Math.random() * 2,
    delay: Math.random() * 5, dur: 1.5 + Math.random() * 3,
    color: ["#fff","#fff8dc","#f7d06a","#ffe4b5","#ffdead","#ffc0cb"][Math.floor(Math.random() * 6)],
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {items.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size,
          background: s.color,
          animation: `aTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function AnniversaryCard() {
  const [phase,      setPhase]      = useState("idle");
  const [sparkles,   setSparkles]   = useState([]);
  const [bubbles,    setBubbles]    = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [locketGlow, setLocketGlow] = useState(true);
  const locketRef = useRef(null);
  const timers    = useRef([]);
  const t = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  /* glow pulse on idle */
  useEffect(() => {
    if (phase !== "idle") return;
    const id = setInterval(() => setLocketGlow(g => !g), 1100);
    return () => clearInterval(id);
  }, [phase]);

  /* launch sparkle shower */
  const launchSparkles = useCallback(() => {
    const emojis = ["✦","★","✿","·","◦","✧","♥","◆"];
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left:  Math.random() * 100,
      delay: Math.random() * 2.5,
      dur:   4 + Math.random() * 4,
      swing: (Math.random() - 0.5) * 200,
      size:  0.7 + Math.random() * 0.7,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setSparkles(items);
    setTimeout(() => setSparkles([]), 9000);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    const rect = locketRef.current?.getBoundingClientRect();
    const cx   = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2;
    const cy   = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;

    setPhase("opening");

    t(() => {
      setPhase("open");
      spawnRipple(cx, cy);
      spawnParticles(cx, cy, 65);
      launchSparkles();
      setBubbles(true);
    }, 500);

    t(() => {
      setMsgVisible(true);
      spawnParticles(cx, cy + 70, 30);
    }, 1100);

    t(() => setPhase("revealed"), 1500);
    t(() => setBubbles(false), 7000);
  }, [phase, launchSparkles]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const isOpen = phase === "open" || phase === "revealed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Great+Vibes&family=Cinzel:wght@400;500&family=Raleway:wght@300;400&display=swap');

        .ann-bg {
          background:
            radial-gradient(ellipse at 50% 0%,   rgba(120,90,10,0.45)  0%, transparent 50%),
            radial-gradient(ellipse at 15% 60%,  rgba(80,50,0,0.5)    0%, transparent 48%),
            radial-gradient(ellipse at 85% 55%,  rgba(100,70,0,0.4)   0%, transparent 46%),
            radial-gradient(ellipse at 50% 110%, rgba(160,110,0,0.2)  0%, transparent 40%),
            linear-gradient(168deg, #06050a 0%, #0f0c02 25%, #181200 50%, #0c0a00 75%, #050404 100%);
        }
        @keyframes aTwinkle  { 0%,100%{opacity:0.12;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes aFloat    { 0%,100%{transform:translateY(0) rotate(-0.4deg)} 50%{transform:translateY(-10px) rotate(0.4deg)} }
        @keyframes sparkFall {
          0%   { transform:translateY(-30px) rotate(0deg); opacity:0; }
          6%   { opacity:1; }
          94%  { opacity:0.7; }
          100% { transform:translateY(108vh) rotate(var(--spin)); opacity:0; }
        }
        @keyframes bubbleRise {
          0%   { transform:translateY(0) scale(1); opacity:0.6; }
          80%  { opacity:0.4; }
          100% { transform:translateY(-100vh) scale(0.5); opacity:0; }
        }
        @keyframes shimmerA {
          0%  {background-position:0%}
          100%{background-position:250%}
        }
        @keyframes candleFlame {
          0%,100%{transform:translateX(-50%) scaleX(1) scaleY(1) rotate(-2deg)}
          50%{transform:translateX(-50%) scaleX(0.84) scaleY(1.12) rotate(2deg)}
        }
        @keyframes wineFloat { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        .ann-shimmer {
          background:linear-gradient(120deg,#fff8dc 0%,#f7d06a 28%,#ffe4b5 55%,#ffc46a 78%,#fff8dc 100%);
          background-size:250%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmerA 4.5s linear infinite;
        }
        .ann-glass {
          background: rgba(247,208,106,0.04);
          backdrop-filter: blur(28px);
          border: 1px solid rgba(247,208,106,0.18);
          box-shadow: 0 24px 70px rgba(0,0,0,0.6), 0 0 50px rgba(180,130,0,0.07), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .locket-container {
          filter: drop-shadow(0 16px 40px rgba(180,130,0,0.35)) drop-shadow(0 4px 16px rgba(0,0,0,0.6));
          transition: filter 0.9s ease;
        }
        .locket-container.glow {
          filter: drop-shadow(0 0 20px rgba(247,208,106,0.6)) drop-shadow(0 16px 50px rgba(180,130,0,0.45)) drop-shadow(0 4px 16px rgba(0,0,0,0.6));
        }
        .locket-container.idle { animation: aFloat 3.5s ease-in-out infinite; }
        .locket-container.open { animation: aFloat 3.5s ease-in-out infinite; }
      `}</style>

      <div
        className="ann-bg relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ fontFamily: "'Raleway',sans-serif", cursor: "default" }}
      >
        <Stars />
        <Bubbles active={bubbles} />

        {/* Falling sparkles */}
        {sparkles.map(s => (
          <FloatingSparkle key={s.id} emoji={s.emoji} style={{
            left: `${s.left}%`, top: "-30px",
            fontSize: `${s.size}rem`,
            color: ["#f7d06a","#fff8dc","#ffc46a","#ffe4b5","#fff"][Math.floor(Math.random()*5)],
            zIndex: 20,
            animationName: "sparkFall",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            animationFillMode: "forwards",
            animationTimingFunction: "linear",
            "--spin": `${s.swing}deg`,
          }} />
        ))}

        {/* Ambient décor */}
        <AmbientDecor />

        {/* Hint */}
        {phase === "idle" && (
          <p className="text-xs tracking-widest uppercase mb-6 z-10"
            style={{ color:"rgba(247,208,106,0.6)", letterSpacing:"0.4em",
              fontFamily:"'Cinzel',serif", animation:"aTwinkle 2.3s ease-in-out infinite" }}>
            ✦ open the locket ✦
          </p>
        )}

        {/* Year counter badge */}
        <div className="z-10 mb-4 px-4 py-1.5 rounded-full text-center"
          style={{
            background:"rgba(247,208,106,0.07)",
            border:"1px solid rgba(247,208,106,0.2)",
            fontFamily:"'Cinzel',serif",
            fontSize:"0.6rem", letterSpacing:"0.4em", textTransform:"uppercase",
            color:"rgba(247,208,106,0.6)",
          }}>
          ✦ &nbsp; celebrating your love &nbsp; ✦
        </div>

        {/* LOCKET */}
        <div
          ref={locketRef}
          onClick={handleClick}
          className={`locket-container z-10${locketGlow && phase==="idle" ? " glow" : ""} ${isOpen ? "open" : phase==="idle" ? "idle" : ""}`}
          style={{
            width: 160, height: 186,
            cursor: phase === "idle" ? "pointer" : "default",
          }}
        >
          <LocketSVG phase={phase} />
        </div>

        {/* MESSAGE */}
        <div
          className="z-10 mt-5 w-full px-4"
          style={{
            maxWidth: 420,
            opacity: msgVisible ? 1 : 0,
            transform: msgVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: msgVisible ? "all" : "none",
          }}
        >
          <div className="ann-glass relative rounded px-7 py-6 text-center">

            {/* Corner ornaments */}
            {["top-3 left-4","top-3 right-4","bottom-3 left-4","bottom-3 right-4"].map((p,i) => (
              <span key={i} className={`absolute ${p} text-xs`} style={{color:"rgba(247,208,106,0.4)"}}>✦</span>
            ))}

            {/* Top label */}
            <p className="text-xs tracking-widest uppercase mb-2"
              style={{ color:"rgba(247,208,106,0.6)", letterSpacing:"0.42em", fontFamily:"'Cinzel',serif" }}>
              ✦ happy anniversary ✦
            </p>

            {/* Title */}
            <h2 className="ann-shimmer mb-1"
              style={{ fontFamily:"'Great Vibes',cursive", fontSize:"2.5rem", lineHeight:1.1 }}>
              To My Forever
            </h2>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(247,208,106,0.35),transparent)"}}/>
              <span style={{color:"rgba(247,208,106,0.7)",fontSize:"0.9rem"}}>✦</span>
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(247,208,106,0.35),transparent)"}}/>
            </div>

            {/* Body */}
            <p className="mb-4 leading-relaxed"
              style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                fontWeight:300, fontSize:"0.97rem", color:"rgba(255,252,235,0.85)" }}>
              Every year spent with you has been a{" "}
              <span style={{color:"#f7d06a",fontStyle:"normal",fontWeight:400}}>gift</span>{" "}
              I never want to return.<br/><br/>
              You are my favourite chapter in this story,
              my greatest{" "}
              <span style={{color:"#f7d06a",fontStyle:"normal",fontWeight:400}}>adventure</span>{" "}
              — and I'd choose you again in every lifetime.
            </p>

            {/* Sign */}
            <p className="text-right"
              style={{ fontFamily:"'Great Vibes',cursive", fontSize:"1.65rem",
                background:"linear-gradient(90deg,#f7d06a,#ffe4b5)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Yours, always ✦
            </p>

            {/* Emojis */}
            <div className="flex justify-center gap-3 mt-3 text-base">
              {["💍","✨","🥂","❤️","✦"].map((e,i) => (
                <span key={i} className="inline-block"
                  style={{animation:`aTwinkle ${1.4+i*0.2}s ${i*0.18}s ease-in-out infinite`}}>{e}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Ambient Décor ── */
function AmbientDecor() {
  return (
    <>
      <style>{`
        .a-candle { position:absolute; bottom:5%; display:flex; flex-direction:column; align-items:center; }
        .a-flame  {
          position:relative; width:7px; height:15px;
          border-radius:50% 50% 35% 35%;
          background:radial-gradient(ellipse at 50% 80%,#fff 0%,#ffe566 20%,#ff9200 60%,transparent 100%);
          animation:candleFlame 0.23s ease-in-out infinite alternate;
        }
        .a-flame::after {
          content:''; position:absolute; bottom:-5px; left:50%;
          transform:translateX(-50%); width:20px; height:12px; border-radius:50%;
          background:radial-gradient(ellipse,rgba(255,160,60,0.4) 0%,transparent 70%);
        }
        .a-wick  { width:1.5px; height:6px; background:#666; margin-bottom:-1px; }
        .a-body  { border-radius:2px 2px 1px 1px;
          background:linear-gradient(180deg,#f5e8d0,#c8b090);
          box-shadow:inset -1px 0 3px rgba(0,0,0,0.2); }
      `}</style>

      {/* Candles */}
      {[
        {left:"4%",  h:75, w:9, op:0.55},
        {left:"8%",  h:54, w:8, op:0.4},
        {left:"12%", h:38, w:7, op:0.3},
        {right:"4%", h:70, w:9, op:0.55},
        {right:"8%", h:50, w:8, op:0.4},
        {right:"12%",h:35, w:7, op:0.3},
      ].map((c, i) => (
        <div key={i} className="a-candle" style={{ ...(c.left ? {left:c.left} : {right:c.right}), opacity:c.op }}>
          <div className="a-flame" style={{animationDelay:`${i*0.07}s`}}/>
          <div className="a-wick"/>
          <div className="a-body" style={{width:c.w, height:c.h}}/>
        </div>
      ))}

      {/* Wine glasses */}
      <div className="absolute pointer-events-none" style={{bottom:"10%",left:"2%",fontSize:"2rem",animation:"wineFloat 3s ease-in-out infinite",opacity:0.5}}>🥂</div>
      <div className="absolute pointer-events-none" style={{bottom:"8%",right:"2%",fontSize:"2rem",animation:"wineFloat 3.5s 0.6s ease-in-out infinite",opacity:0.45}}>🥂</div>

      {/* Roses */}
      <div className="absolute pointer-events-none" style={{bottom:"18%",left:"2%",fontSize:"1.4rem",animation:"wineFloat 4s 0.3s ease-in-out infinite",opacity:0.45}}>🌹</div>
      <div className="absolute pointer-events-none" style={{bottom:"20%",right:"2%",fontSize:"1.2rem",animation:"wineFloat 3.8s 1s ease-in-out infinite",opacity:0.4}}>🌹</div>
    </>
  );
}
