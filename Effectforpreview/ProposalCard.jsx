"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   Particle helper — spawns DOM particles on burst
───────────────────────────────────────────── */
function spawnParticles(cx, cy, count = 40) {
  const colors = ["#f7d06a","#ffd6e7","#ff9cc5","#fff","#e8b4d8","#ffc0cb","#d4a0ff"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist  = 60 + Math.random() * 200;
    const size  = 3 + Math.random() * 7;
    const dur   = 900 + Math.random() * 700;
    const delay = Math.random() * 200;
    Object.assign(el.style, {
      position: "fixed",
      left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy, color = "rgba(247,208,106,0.6)") {
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("div");
    const size = 40 + i * 55;
    Object.assign(el.style, {
      position: "fixed",
      left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px",
      borderRadius: "50%",
      border: `2px solid ${color}`,
      pointerEvents: "none", zIndex: 9998,
      transform: "translate(-50%,-50%) scale(0)",
      opacity: "0.8",
      transition: `transform ${0.7 + i*0.15}s ease-out ${i*0.13}s, opacity ${0.7+i*0.15}s ease-out ${i*0.13}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = "translate(-50%,-50%) scale(1)";
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), 1400);
  }
}

/* ─────────────────────────────────────────────
   Floating Petal component
───────────────────────────────────────────── */
function Petal({ style }) {
  return (
    <div className="pointer-events-none select-none absolute" style={style}>
      🌸
    </div>
  );
}

/* ─────────────────────────────────────────────
   Diamond Ring SVG
───────────────────────────────────────────── */
function DiamondRing({ sparkle }) {
  return (
    <svg viewBox="0 0 120 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ring band */}
      <ellipse cx="60" cy="88" rx="32" ry="10" stroke="#d4af6a" strokeWidth="6" fill="none" opacity="0.6"/>
      <path d="M28 88 Q60 68 92 88" stroke="url(#bandGrad)" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <defs>
        <linearGradient id="bandGrad" x1="28" y1="88" x2="92" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b8922a"/>
          <stop offset="30%" stopColor="#f7d06a"/>
          <stop offset="60%" stopColor="#e8c050"/>
          <stop offset="100%" stopColor="#b8922a"/>
        </linearGradient>
        <linearGradient id="diamondGrad" x1="40" y1="30" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="25%" stopColor="#e8f4ff"/>
          <stop offset="50%" stopColor="#b8d8ff"/>
          <stop offset="75%" stopColor="#d0eaff"/>
          <stop offset="100%" stopColor="#ffffff"/>
        </linearGradient>
        <radialGradient id="gemGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#a8ccff" stopOpacity="0"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      {/* Setting prongs */}
      <path d="M52 58 L50 72 M68 58 L70 72" stroke="#d4af6a" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M42 50 L50 72 M78 50 L70 72" stroke="#d4af6a" strokeWidth="3" strokeLinecap="round"/>
      {/* Diamond */}
      <polygon points="60,22 80,48 60,72 40,48" fill="url(#diamondGrad)" stroke="#c8deff" strokeWidth="0.5" filter="url(#glow)"/>
      <polygon points="60,22 80,48 60,48" fill="rgba(255,255,255,0.6)"/>
      <polygon points="60,22 40,48 60,48" fill="rgba(180,210,255,0.4)"/>
      <polygon points="40,48 60,72 60,48" fill="rgba(140,190,255,0.5)"/>
      <polygon points="80,48 60,72 60,48" fill="rgba(200,230,255,0.3)"/>
      {/* Gem internal facets */}
      <line x1="60" y1="22" x2="60" y2="72" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
      <line x1="40" y1="48" x2="80" y2="48" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
      {/* Gem overlay glow */}
      <ellipse cx="58" cy="34" rx="8" ry="10" fill="url(#gemGlow)" opacity="0.7"/>
      {/* Sparkle stars */}
      {sparkle && (<>
        <g opacity="0.9">
          <line x1="60" y1="6" x2="60" y2="18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="54" y1="12" x2="66" y2="12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g opacity="0.7">
          <line x1="90" y1="18" x2="90" y2="26" stroke="#f7d06a" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="86" y1="22" x2="94" y2="22" stroke="#f7d06a" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
        <g opacity="0.6">
          <line x1="28" y1="28" x2="28" y2="34" stroke="#e8c8ff" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="25" y1="31" x2="31" y2="31" stroke="#e8c8ff" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
      </>)}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ProposalCard() {
  const [phase, setPhase]       = useState("idle");   // idle → opening → open → revealed
  const [sparkle, setSparkle]   = useState(false);
  const [petals, setPetals]     = useState([]);
  const [msgVisible, setMsgVisible] = useState(false);
  const boxRef  = useRef(null);
  const timerRef = useRef([]);

  const addTimer = (fn, ms) => timerRef.current.push(setTimeout(fn, ms));

  // Petal shower
  const launchPetals = useCallback(() => {
    const items = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      dur: 4 + Math.random() * 4,
      swing: (Math.random() - 0.5) * 180,
      size: 0.8 + Math.random() * 0.7,
    }));
    setPetals(items);
    setTimeout(() => setPetals([]), 8000);
  }, []);

  const handleOpen = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("opening");

    const rect = boxRef.current?.getBoundingClientRect();
    const cx   = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2;
    const cy   = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;

    addTimer(() => {
      setPhase("open");
      spawnRipple(cx, cy, "rgba(247,208,106,0.7)");
    }, 600);

    addTimer(() => {
      setSparkle(true);
      spawnParticles(cx, cy - 80, 50);
      launchPetals();
    }, 1100);

    addTimer(() => {
      setMsgVisible(true);
      spawnParticles(cx, cy + 60, 30);
    }, 1600);

    addTimer(() => setPhase("revealed"), 1800);
  }, [phase, launchPetals]);

  // Sparkle pulse
  useEffect(() => {
    if (!sparkle) return;
    const id = setInterval(() => setSparkle(s => !s), 700);
    return () => clearInterval(id);
  }, [sparkle]);

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  const isOpen = phase === "open" || phase === "revealed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Great+Vibes&family=Raleway:wght@300;400&display=swap');

        .proposal-bg {
          background:
            radial-gradient(ellipse at 30% 20%, rgba(120,40,80,0.45) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 70%, rgba(60,20,80,0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(180,80,100,0.2) 0%, transparent 45%),
            linear-gradient(160deg, #0d0008 0%, #1a0318 30%, #200520 55%, #120010 80%, #080008 100%);
        }
        .velvet-box-lid {
          transform-origin: top center;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .velvet-box-lid.open {
          transform: perspective(400px) rotateX(-155deg);
        }
        .ring-rise {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
        }
        .ring-rise.risen {
          transform: translateY(-20px);
        }
        .ring-rise.hidden-ring {
          opacity: 0; transform: translateY(10px);
        }
        .msg-slide {
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .msg-slide.hidden-msg {
          opacity: 0; transform: translateY(20px); pointer-events: none;
        }
        .msg-slide.shown-msg {
          opacity: 1; transform: translateY(0);
        }
        .petal-fall {
          animation: petalDrop linear forwards;
        }
        @keyframes petalDrop {
          0%   { transform: translateY(-40px) rotate(0deg); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.7; }
          100% { transform: translateY(105vh) rotate(var(--spin)); opacity: 0; }
        }
        .shimmer-text {
          background: linear-gradient(120deg, #ffd6e7 0%, #ff9cc5 28%, #f7d06a 55%, #e8c8ff 78%, #ffd6e7 100%);
          background-size: 250%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShimmer 5s linear infinite;
        }
        @keyframes textShimmer { 0%{background-position:0%} 100%{background-position:250%} }
        .candle-flicker::before {
          content: '';
          position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
          width: 6px; height: 14px; border-radius: 50% 50% 30% 30%;
          background: radial-gradient(ellipse at 50% 80%, #fff 0%, #ffe566 25%, #ff9200 65%, transparent 100%);
          animation: flickerFlame 0.25s ease-in-out infinite alternate;
        }
        @keyframes flickerFlame {
          0%  { transform: translateX(-50%) scaleX(1) scaleY(1); }
          100%{ transform: translateX(-50%) scaleX(0.85) scaleY(1.1); }
        }
        .star-twinkle { animation: twinkle 2s ease-in-out infinite; }
        @keyframes twinkle { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .box-hover:hover { filter: drop-shadow(0 20px 60px rgba(247,208,106,0.35)) drop-shadow(0 0 20px rgba(220,100,160,0.25)) !important; }
        .ring-glow {
          filter: drop-shadow(0 0 12px rgba(200,220,255,0.8)) drop-shadow(0 0 24px rgba(247,208,106,0.5));
        }
      `}</style>

      {/* Full-screen container */}
      <div
        className="proposal-bg relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ fontFamily: "'Raleway', sans-serif", cursor: "default" }}
      >

        {/* Stars canvas-style — CSS dots */}
        <Stars />

        {/* Floating petals */}
        {petals.map(p => (
          <Petal
            key={p.id}
            style={{
              left: `${p.left}%`,
              top: "-40px",
              fontSize: `${p.size}rem`,
              animationName: "petalDrop",
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              animationFillMode: "forwards",
              animationTimingFunction: "linear",
              "--spin": `${p.swing}deg`,
              zIndex: 20,
            }}
          />
        ))}

        {/* Ambient candles */}
        <AmbientCandles />

        {/* Hint */}
        {phase === "idle" && (
          <p
            className="text-xs tracking-widest uppercase mb-8 z-10"
            style={{
              color: "rgba(247,208,106,0.6)",
              fontFamily: "'Raleway',sans-serif",
              letterSpacing: "0.4em",
              animation: "twinkle 2.2s ease-in-out infinite",
            }}
          >
            ✦ open the box ✦
          </p>
        )}

        {/* ── RING BOX ── */}
        <div
          ref={boxRef}
          className={`relative z-10 flex flex-col items-center ${phase === "idle" ? "box-hover cursor-pointer" : ""}`}
          style={{
            filter: "drop-shadow(0 18px 50px rgba(180,80,140,0.3)) drop-shadow(0 4px 16px rgba(0,0,0,0.6))",
            animation: phase === "idle" ? "petalDrop 4s ease-in-out infinite alternate" : "none",
            animationName: phase === "idle" ? "boxFloat" : "none",
          }}
          onClick={handleOpen}
        >
          <BoxFloat active={phase === "idle"}>
            {/* LID */}
            <div className={`velvet-box-lid${isOpen ? " open" : ""} relative z-10`}>
              <BoxLid />
            </div>

            {/* BASE with ring inside */}
            <div className="relative">
              <BoxBase />
              {/* Ring inside box */}
              <div
                className={`ring-rise absolute inset-0 flex items-center justify-center ${isOpen ? "risen" : "hidden-ring"}`}
                style={{ paddingBottom: "8px" }}
              >
                <div className={`w-16 h-16 ${isOpen ? "ring-glow" : ""}`}>
                  <DiamondRing sparkle={sparkle} />
                </div>
              </div>
            </div>
          </BoxFloat>
        </div>

        {/* ── PROPOSAL MESSAGE ── */}
        <div
          className={`msg-slide z-10 mt-6 w-full max-w-sm px-4 ${msgVisible ? "shown-msg" : "hidden-msg"}`}
        >
          <div
            className="relative rounded overflow-hidden px-8 py-6 text-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,180,220,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {/* Corner gems */}
            {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map((pos,i) => (
              <span key={i} className={`absolute ${pos} text-xs opacity-40`} style={{color:"#f7d06a"}}>✦</span>
            ))}

            <p className="text-xs tracking-widest uppercase mb-3" style={{color:"rgba(255,179,198,0.65)", fontFamily:"'Raleway',sans-serif", letterSpacing:"0.4em"}}>
              ✦ a question for you ✦
            </p>

            <h2
              className="shimmer-text mb-2"
              style={{ fontFamily:"'Great Vibes',cursive", fontSize:"2.4rem", lineHeight:1.1 }}
            >
              Will You Marry Me?
            </h2>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(255,150,200,0.35),transparent)"}}/>
              <span style={{color:"rgba(255,179,198,0.7)", fontSize:"0.8rem"}}>♡</span>
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(255,150,200,0.35),transparent)"}}/>
            </div>

            <p
              className="mb-4 leading-relaxed"
              style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:300, fontSize:"0.98rem", color:"rgba(255,245,250,0.82)" }}
            >
              Every moment with you feels like{" "}
              <span style={{color:"#f7d06a", fontStyle:"normal", fontWeight:400}}>home</span>.
              You are my favourite adventure,<br/>my greatest joy, my forever person.<br/><br/>
              <span style={{color:"#f7d06a", fontStyle:"normal", fontWeight:400}}>I choose you — today, and every day.</span>
            </p>

            <p
              className="text-right"
              style={{ fontFamily:"'Great Vibes',cursive", fontSize:"1.6rem", background:"linear-gradient(90deg,#f7d06a,#ff9cc5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}
            >
              Always yours ✦
            </p>

            <div className="flex justify-center gap-3 mt-4 text-base">
              {["💍","✨","🌹","🕊️","💫"].map((e,i) => (
                <span
                  key={i} className="inline-block"
                  style={{ animation:`twinkle ${1.5+i*0.2}s ease-in-out ${i*0.15}s infinite` }}
                >{e}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── BOX PARTS ── */
function BoxFloat({ children, active }) {
  return (
    <div style={{ animation: active ? "boxFloat 3.5s ease-in-out infinite" : "none" }}>
      <style>{`
        @keyframes boxFloat {
          0%,100%{transform:translateY(0) rotate(-0.3deg)}
          50%{transform:translateY(-8px) rotate(0.3deg)}
        }
      `}</style>
      {children}
    </div>
  );
}

function BoxLid() {
  return (
    <div className="relative flex flex-col items-center" style={{width:140}}>
      {/* lid top ribbon */}
      <div className="w-full h-2 rounded-t-sm" style={{background:"linear-gradient(90deg,#8b0a3a,#c2185b,#8b0a3a)"}}/>
      {/* lid body */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          height: 36,
          background: "linear-gradient(160deg, #b01050 0%, #8b0a3a 45%, #6a0828 100%)",
          borderRadius: "4px 4px 0 0",
          boxShadow: "inset 0 2px 8px rgba(255,255,255,0.08), inset 0 -3px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* velvet texture lines */}
        <div className="absolute inset-0 opacity-20" style={{background:"repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.15) 8px,rgba(255,255,255,0.15) 9px)"}}/>
        {/* center bow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm" style={{color:"rgba(247,208,106,0.8)"}}>✦</div>
        </div>
      </div>
      {/* lid inner flap */}
      <div className="w-full h-2" style={{background:"linear-gradient(180deg,#f0d0e0,#e8b8d0)", borderRadius:"0 0 2px 2px"}}/>
    </div>
  );
}

function BoxBase() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 140, height: 68,
        background: "linear-gradient(160deg, #a01848 0%, #78102e 50%, #5a0820 100%)",
        borderRadius: "0 0 6px 6px",
        boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.4), inset 0 4px 8px rgba(255,100,150,0.1), 0 8px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* velvet texture */}
      <div className="absolute inset-0 opacity-20" style={{background:"repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.1) 8px,rgba(255,255,255,0.1) 9px)"}}/>
      {/* ring cushion */}
      <div
        className="absolute inset-x-4 top-3 bottom-3 rounded-sm flex items-center justify-center"
        style={{background:"linear-gradient(135deg,#c8607a,#a03050)", boxShadow:"inset 0 2px 6px rgba(0,0,0,0.3)"}}
      >
        <div className="w-full h-px" style={{background:"rgba(255,255,255,0.15)"}}/>
      </div>
    </div>
  );
}

/* ── AMBIENT CANDLES ── */
function AmbientCandles() {
  return (
    <>
      <style>{`
        .amb-candle { position: absolute; bottom: 8%; display: flex; flex-direction: column; align-items: center; opacity: 0.55; }
        .amb-flame { width: 6px; height: 12px; border-radius: 50% 50% 35% 35%; background: radial-gradient(ellipse at 50% 80%,#fff 0%,#ffe566 20%,#ff9200 60%,transparent 100%); animation: flickerFlame 0.22s ease-in-out infinite alternate; }
        .amb-wick  { width: 1px; height: 5px; background: #777; margin-bottom: -1px; }
        .amb-body  { width: 7px; height: 28px; border-radius: 2px; background: linear-gradient(180deg, #e8c0d0, #c09080); }
        .amb-glow  { position: absolute; bottom: -4px; width: 20px; height: 12px; border-radius: 50%; background: radial-gradient(ellipse, rgba(255,180,100,0.4) 0%, transparent 70%); animation: flickerFlame 0.3s ease-in-out infinite alternate; }
      `}</style>
      {[
        { left: "6%", height: 60 },
        { left: "10%", height: 44 },
        { right: "6%", height: 56 },
        { right: "10%", height: 40 },
      ].map((pos, i) => (
        <div key={i} className="amb-candle" style={{ ...pos, animationDelay: `${i*0.1}s` }}>
          <div className="amb-glow"/>
          <div className="amb-flame" style={{ animationDelay: `${i*0.08}s` }}/>
          <div className="amb-wick"/>
          <div className="amb-body" style={{ height: pos.height || 36 }}/>
        </div>
      ))}
    </>
  );
}

/* ── STAR FIELD ── */
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top:  Math.random() * 100,
    size: 0.5 + Math.random() * 2,
    delay: Math.random() * 4,
    dur:   1.5 + Math.random() * 2.5,
    color: ["#fff","#ffd6e7","#f7d06a","#e8c8ff","#a0c8ff"][Math.floor(Math.random()*5)],
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full star-twinkle"
          style={{
            left: `${s.left}%`, top: `${s.top}%`,
            width: s.size, height: s.size,
            background: s.color,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
