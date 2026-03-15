"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FX Helpers ─── */
function spawnParticles(cx, cy, count = 50) {
  const colors = ["#60a5fa", "#a78bfa", "#f9fafb", "#fde68a", "#93c5fd", "#c4b5fd", "#e0f2fe", "#fef3c7"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 210;
    const size = 2 + Math.random() * 7;
    const dur = 800 + Math.random() * 800;
    const delay = Math.random() * 300;
    const isStar = Math.random() > 0.55;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: isStar ? "auto" : size + "px",
      height: isStar ? "auto" : size + "px",
      fontSize: isStar ? (10 + Math.random() * 12) + "px" : "0",
      borderRadius: isStar ? "0" : "50%",
      background: isStar ? "transparent" : colors[Math.floor(Math.random() * colors.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    if (isStar) el.textContent = ["✦", "★", "·", "✧", "⭐", "✈"][Math.floor(Math.random() * 6)];
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy) {
  const colors = ["rgba(96,165,250,0.6)", "rgba(167,139,250,0.5)", "rgba(249,250,251,0.4)", "rgba(253,230,138,0.5)"];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("div");
    const size = 40 + i * 65;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px", borderRadius: "50%",
      border: `1.5px solid ${colors[i % colors.length]}`,
      pointerEvents: "none", zIndex: 9998,
      transform: "translate(-50%,-50%) scale(0)", opacity: "0.85",
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

/* ─── Paper Plane SVG ─── */
function PaperPlaneSVG({ trail }) {
  return (
    <svg viewBox="0 0 80 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="planeShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
        </linearGradient>
        <filter id="planeGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Trail */}
      {trail && (
        <path d="M0 30 Q20 28 38 30" stroke="rgba(186,230,253,0.4)" strokeWidth="1.5"
          strokeDasharray="3 4" strokeLinecap="round" fill="none" />
      )}
      {/* Plane body */}
      <path d="M75 30 L4 8 L18 28 L18 52 Z" fill="url(#planeGrad)" filter="url(#planeGlow)" />
      {/* Wing fold */}
      <path d="M75 30 L18 28 L4 8 Z" fill="rgba(255,255,255,0.35)" />
      {/* Underbelly */}
      <path d="M18 28 L18 52 L38 36 Z" fill="url(#planeShadow)" />
      {/* Crease line */}
      <path d="M18 28 L75 30" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeLinecap="round" />
      {/* Nose glint */}
      <circle cx="70" cy="30" r="2" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

/* ─── World Map (simplified SVG paths) ─── */
function WorldMap() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.07 }}>
      <svg viewBox="0 0 800 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Simplified continent outlines */}
        {/* North America */}
        <path d="M80 60 Q120 40 160 55 Q200 65 195 110 Q185 150 160 170 Q140 185 120 175 Q95 165 80 140 Q60 115 70 90 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* South America */}
        <path d="M155 195 Q185 185 200 210 Q215 240 210 290 Q200 330 175 340 Q150 345 140 315 Q125 280 130 245 Q135 215 155 195 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* Europe */}
        <path d="M340 50 Q380 40 400 60 Q415 75 410 100 Q400 120 380 125 Q355 128 340 110 Q325 90 330 70 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* Africa */}
        <path d="M345 135 Q385 125 405 150 Q425 180 420 230 Q415 275 395 300 Q370 320 345 305 Q320 285 315 250 Q305 210 315 175 Q325 150 345 135 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* Asia */}
        <path d="M415 40 Q480 25 560 35 Q630 45 660 75 Q675 100 660 130 Q640 155 600 160 Q545 165 490 150 Q445 138 420 115 Q400 90 415 40 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* Australia */}
        <path d="M580 210 Q625 200 650 220 Q670 245 660 275 Q645 300 615 305 Q585 305 568 282 Q552 258 558 235 Z" fill="rgba(147,197,253,0.6)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        {/* Grid lines */}
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <line key={`h${i}`} x1="0" y1={i * 55} x2="800" y2={i * 55} stroke="rgba(147,197,253,0.08)" strokeWidth="0.5" />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="400" stroke="rgba(147,197,253,0.08)" strokeWidth="0.5" />
        ))}
      </svg>
    </div>
  );
}

/* ─── Constellation Stars ─── */
function Constellations() {
  // Few constellation-like dot clusters
  const clusters = [
    [{ x: 10, y: 12 }, { x: 15, y: 8 }, { x: 22, y: 11 }, { x: 18, y: 16 }],
    [{ x: 75, y: 8 }, { x: 80, y: 14 }, { x: 85, y: 10 }, { x: 82, y: 5 }],
    [{ x: 88, y: 55 }, { x: 92, y: 60 }, { x: 86, y: 64 }, { x: 94, y: 67 }],
    [{ x: 5, y: 65 }, { x: 10, y: 70 }, { x: 8, y: 76 }],
  ];
  const allStars = Array.from({ length: 120 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: 0.3 + Math.random() * 1.8, delay: Math.random() * 5, dur: 1.5 + Math.random() * 3,
    color: ["#fff", "#bfdbfe", "#ddd6fe", "#fde68a", "#e0f2fe"][Math.floor(Math.random() * 5)],
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {allStars.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, background: s.color,
          animation: `ldTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
        {clusters.map((cluster, ci) =>
          cluster.slice(0, -1).map((pt, pi) => (
            <line key={`${ci}-${pi}`}
              x1={`${cluster[pi].x}%`} y1={`${cluster[pi].y}%`}
              x2={`${cluster[pi + 1].x}%`} y2={`${cluster[pi + 1].y}%`}
              stroke="#93c5fd" strokeWidth="0.6" />
          ))
        )}
      </svg>
    </div>
  );
}

/* ─── Shooting Star ─── */
function ShootingStars({ active }) {
  const [shots, setShots] = useState([]);
  useEffect(() => {
    const spawn = () => {
      const id = Date.now();
      const angle = -(20 + Math.random() * 25) * Math.PI / 180;
      const dist = 150 + Math.random() * 180;
      setShots(s => [...s, {
        id, x: Math.random() * 80, y: Math.random() * 40,
        tx: dist * Math.cos(angle), ty: dist * Math.sin(angle),
        dur: 0.5 + Math.random() * 0.4,
      }]);
      setTimeout(() => setShots(s => s.filter(sh => sh.id !== id)), 1200);
    };
    const id = setInterval(() => { if (Math.random() < 0.55) spawn(); }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-2">
      {shots.map(s => (
        <div key={s.id} className="absolute" style={{
          left: `${s.x}%`, top: `${s.top}%`,
          width: 2, height: 2, borderRadius: "50%",
          background: "#e0f2fe",
          boxShadow: "0 0 5px 2px rgba(186,230,253,0.7)",
          animation: `ldShoot ${s.dur}s ease-out forwards`,
          "--tx": `${s.tx}px`, "--ty": `${s.ty}px`,
        }}>
          <div style={{
            position: "absolute", top: "50%", right: "100%",
            width: 50, height: 1,
            background: "linear-gradient(to left, rgba(186,230,253,0.7), transparent)",
            transform: "translateY(-50%)",
          }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Distance counter ─── */
function DistanceCounter({ counting, done }) {
  const [num, setNum] = useState(9847);
  useEffect(() => {
    if (!counting) return;
    let cur = 9847;
    const step = () => {
      cur = Math.max(0, cur - Math.floor(cur * 0.18 + 80));
      setNum(cur);
      if (cur > 0) setTimeout(step, 60);
    };
    setTimeout(step, 100);
  }, [counting]);

  return (
    <div className="flex items-center justify-center gap-2 mb-4" style={{
      fontFamily: "'Space Mono',monospace",
      fontSize: "0.7rem", letterSpacing: "0.3em",
      color: done ? "rgba(96,165,250,0.5)" : "rgba(253,230,138,0.8)",
      transition: "color 0.6s",
    }}>
      <span style={{ opacity: 0.6 }}>✦</span>
      <span>{done ? "distance means nothing" : `${num.toLocaleString()} miles apart`}</span>
      <span style={{ opacity: 0.6 }}>✦</span>
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function LongDistanceCard() {
  const [phase, setPhase] = useState("idle");
  const [planePhase, setPlanePhase] = useState("floating"); // floating → flying → landing → unfolded
  const [counting, setCounting] = useState(false);
  const [distDone, setDistDone] = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [planeGlow, setPlaneGlow] = useState(true);
  const [fallingItems, setFallingItems] = useState([]);
  const planeRef = useRef(null);
  const timers = useRef([]);
  const t = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    if (phase !== "idle") return;
    const id = setInterval(() => setPlaneGlow(g => !g), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const launchStarfall = useCallback(() => {
    const emojis = ["✦", "★", "·", "✧", "💙", "🌙", "✈", "🌟"];
    setFallingItems(Array.from({ length: 18 }, (_, i) => ({
      id: i, left: Math.random() * 100,
      delay: Math.random() * 2.5, dur: 4 + Math.random() * 4,
      swing: (Math.random() - 0.5) * 180, size: 0.7 + Math.random() * 0.7,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      color: ["#93c5fd", "#c4b5fd", "#fde68a", "#e0f2fe", "#fff"][Math.floor(Math.random() * 5)],
    })));
    setTimeout(() => setFallingItems([]), 9000);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    const rect = planeRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    setPhase("animating");
    setPlanePhase("flying");

    // plane flies off right
    t(() => {
      setPlanePhase("landing");
      spawnRipple(cx, cy);
      spawnParticles(cx, cy, 60);
      launchStarfall();
      setCounting(true);
    }, 700);

    // plane "lands" = unfolds
    t(() => {
      setPlanePhase("unfolded");
      setDistDone(true);
    }, 1500);

    t(() => {
      setMsgVisible(true);
      spawnParticles(cx, cy + 80, 25);
    }, 1900);

    t(() => setPhase("revealed"), 2200);
  }, [phase, launchStarfall]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const isOpen = phase === "revealed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital@0;1&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Great+Vibes&family=Raleway:wght@300;400;500&display=swap');

        .ld-bg {
          background:
            radial-gradient(ellipse at 50% 0%,  rgba(29,78,216,0.45)  0%, transparent 55%),
            radial-gradient(ellipse at 10% 50%, rgba(67,56,202,0.4)   0%, transparent 48%),
            radial-gradient(ellipse at 90% 60%, rgba(30,64,175,0.35)  0%, transparent 46%),
            radial-gradient(ellipse at 50% 110%,rgba(99,102,241,0.2)  0%, transparent 40%),
            linear-gradient(168deg, #030712 0%, #0a0f1e 25%, #0d1535 50%, #080c1a 75%, #030712 100%);
        }
        @keyframes ldTwinkle { 0%,100%{opacity:0.1;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes ldFloat   { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes ldShoot   {
          0%  {opacity:1;transform:translate(0,0)}
          100%{opacity:0;transform:translate(var(--tx),var(--ty))}
        }
        @keyframes planeTrail {
          0%  {transform:translateX(0) translateY(0) rotate(-5deg) scale(1);opacity:1}
          40% {transform:translateX(120px) translateY(-40px) rotate(-15deg) scale(0.9);opacity:1}
          70% {transform:translateX(220px) translateY(20px) rotate(5deg) scale(0.8);opacity:0.6}
          100%{transform:translateX(180px) translateY(60px) rotate(15deg) scale(0.7);opacity:0}
        }
        @keyframes starFall {
          0%  {transform:translateY(-30px) rotate(0deg);opacity:0}
          6%  {opacity:1}
          94% {opacity:0.8}
          100%{transform:translateY(108vh) rotate(var(--spin));opacity:0}
        }
        @keyframes shimmerLD {
          0%  {background-position:0%}
          100%{background-position:250%}
        }
        @keyframes unfoldIn {
          from{opacity:0;transform:scale(0.4) rotate(-8deg)}
          to  {opacity:1;transform:scale(1) rotate(0deg)}
        }
        @keyframes msgRiseLD {
          from{opacity:0;transform:translateY(24px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes glowPulse {
          0%,100%{filter:drop-shadow(0 0 10px rgba(96,165,250,0.4)) drop-shadow(0 0 25px rgba(67,56,202,0.3))}
          50%{filter:drop-shadow(0 0 22px rgba(96,165,250,0.75)) drop-shadow(0 0 50px rgba(99,102,241,0.45))}
        }
        @keyframes pathDraw {
          from{stroke-dashoffset:400}
          to{stroke-dashoffset:0}
        }
        .ld-shimmer {
          background:linear-gradient(120deg,#bfdbfe 0%,#a78bfa 28%,#fde68a 55%,#60a5fa 78%,#bfdbfe 100%);
          background-size:250%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:shimmerLD 5s linear infinite;
        }
        .ld-glass {
          background:rgba(15,23,42,0.7);
          backdrop-filter:blur(28px);
          border:1px solid rgba(96,165,250,0.2);
          box-shadow:0 24px 70px rgba(0,0,0,0.65), 0 0 40px rgba(67,56,202,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .plane-idle { animation: ldFloat 3.5s ease-in-out infinite; }
        .plane-glow { animation: ldFloat 3.5s ease-in-out infinite, glowPulse 1.8s ease-in-out infinite; }
        .plane-flying { animation: planeTrail 0.7s ease-in forwards !important; }
        .plane-unfolded { animation: unfoldIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <div className="ld-bg relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ fontFamily: "'Raleway',sans-serif", cursor: "default" }}>

        <WorldMap />
        <Constellations />
        <ShootingStars />

        {/* Falling stars */}
        {fallingItems.map(f => (
          <div key={f.id} className="pointer-events-none select-none absolute" style={{
            left: `${f.left}%`, top: "-30px", zIndex: 20,
            fontSize: `${f.size}rem`, color: f.color,
            animationName: "starFall", animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`, animationFillMode: "forwards",
            animationTimingFunction: "linear", "--spin": `${f.swing}deg`,
          }}>{f.emoji}</div>
        ))}

        {/* Ambient */}
        <AmbientDecor />

        {/* Hint */}
        {phase === "idle" && (
          <p className="text-xs tracking-widest uppercase mb-5 z-10"
            style={{
              color: "rgba(147,197,253,0.65)", letterSpacing: "0.42em",
              fontFamily: "'Space Mono',monospace", fontSize: "0.62rem",
              animation: "ldTwinkle 2.2s ease-in-out infinite"
            }}>
            ✦ send the letter ✦
          </p>
        )}

        {/* Distance counter */}
        <DistanceCounter counting={counting} done={distDone} />

        {/* PLANE / UNFOLDED LETTER */}
        <div className="relative z-10" style={{ width: "min(200px,70vw)", height: 100 }}>

          {/* Dotted flight path */}
          {phase !== "idle" && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible", opacity: 0.35 }}>
              <path d="M100 50 Q180 10 260 30 Q340 50 380 80"
                stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="5 5" fill="none"
                style={{ strokeDashoffset: 400, animation: "pathDraw 1.2s ease forwards" }} />
              {/* start dot */}
              <circle cx="100" cy="50" r="4" fill="#fde68a" opacity="0.8" />
              {/* end dot */}
              <circle cx="380" cy="80" r="4" fill="#60a5fa" opacity="0.8"
                style={{ animation: "ldTwinkle 1s ease-in-out infinite" }} />
            </svg>
          )}

          {/* Paper plane */}
          {planePhase !== "unfolded" && (
            <div
              ref={planeRef}
              onClick={handleClick}
              className={`absolute ${planePhase === "flying" ? "plane-flying" :
                  planePhase === "floating" && planeGlow ? "plane-glow" :
                    "plane-idle"
                }`}
              style={{
                width: 80, height: 60, top: 20, left: "50%",
                transform: "translateX(-50%)",
                cursor: phase === "idle" ? "pointer" : "default",
              }}
            >
              <PaperPlaneSVG trail={planePhase === "floating"} />
            </div>
          )}

          {/* Unfolded as letter envelope icon */}
          {planePhase === "unfolded" && (
            <div className="plane-unfolded absolute text-5xl flex items-center justify-center"
              style={{ inset: 0, filter: "drop-shadow(0 0 16px rgba(96,165,250,0.6))" }}>
              💌
            </div>
          )}
        </div>

        {/* MESSAGE */}
        <div className="z-10 mt-5 w-full px-4" style={{
          maxWidth: 420,
          opacity: msgVisible ? 1 : 0,
          transform: msgVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.75s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: msgVisible ? "all" : "none",
        }}>
          <div className="ld-glass relative rounded px-7 py-6 text-center">

            {/* corner stars */}
            {["top-3 left-4", "top-3 right-4", "bottom-3 left-4", "bottom-3 right-4"].map((p, i) => (
              <span key={i} className={`absolute ${p} text-xs`}
                style={{ color: "rgba(96,165,250,0.4)" }}>✦</span>
            ))}

            {/* label */}
            <p className="text-xs tracking-widest uppercase mb-2"
              style={{
                color: "rgba(147,197,253,0.6)", letterSpacing: "0.42em",
                fontFamily: "'Space Mono',monospace", fontSize: "0.58rem"
              }}>
              ✦ across every mile ✦
            </p>

            {/* title */}
            <h2 className="ld-shimmer mb-1"
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "2.5rem", lineHeight: 1.1 }}>
              You Are Always Near
            </h2>

            {/* divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(96,165,250,0.35),transparent)" }} />
              <span style={{ color: "rgba(147,197,253,0.7)", fontSize: "0.85rem" }}>✈</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(96,165,250,0.35),transparent)" }} />
            </div>

            {/* body */}
            <p className="mb-4 leading-relaxed" style={{
              fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic",
              fontWeight: 300, fontSize: "0.97rem", color: "rgba(224,242,254,0.85)",
            }}>
              The miles between us are just{" "}
              <span style={{ color: "#93c5fd", fontStyle: "normal", fontWeight: 400 }}>numbers</span> —<br />
              they cannot measure what I feel for you.<br /><br />
              Every sunrise I see, I wonder if you see it too.
              Every night sky full of stars, I know we're looking
              at the{" "}
              <span style={{ color: "#fde68a", fontStyle: "normal", fontWeight: 400 }}>same ones</span>.<br /><br />
              <span style={{ color: "#a78bfa", fontStyle: "normal", fontWeight: 400 }}>
                The distance is temporary. This love is not.
              </span>
            </p>

            {/* timezone note */}
            <div className="flex items-center justify-center gap-2 mb-4" style={{
              fontFamily: "'Space Mono',monospace", fontSize: "0.58rem",
              color: "rgba(147,197,253,0.4)", letterSpacing: "0.15em",
            }}>
              <span>🌍 wherever you are</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>🌏 I'm thinking of you</span>
            </div>

            {/* sign */}
            <p className="text-right" style={{
              fontFamily: "'Great Vibes',cursive", fontSize: "1.65rem",
              background: "linear-gradient(90deg,#60a5fa,#a78bfa,#fde68a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              counting down the days ✦
            </p>

            {/* emojis */}
            <div className="flex justify-center gap-3 mt-3 text-base">
              {["✈️", "🌙", "💙", "⭐", "🌍"].map((e, i) => (
                <span key={i} className="inline-block"
                  style={{ animation: `ldTwinkle ${1.4 + i * 0.2}s ${i * 0.18}s ease-in-out infinite` }}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Ambient Decor ─── */
function AmbientDecor() {
  return (
    <>
      <style>{`
        .ld-moon { position:absolute; top:6%; right:8%; width:52px; height:52px;
          border-radius:50%;
          background:radial-gradient(circle at 38% 35%, #fef9c3, #fde68a 50%, #ca8a04 100%);
          box-shadow:0 0 30px rgba(253,230,138,0.35), 0 0 60px rgba(253,230,138,0.15);
          animation:ldFloat 6s ease-in-out infinite; }
        .ld-moon::before { content:''; position:absolute; top:8px; right:6px;
          width:14px; height:14px; border-radius:50%;
          background:rgba(120,80,0,0.15); }
        .ld-city { position:absolute; bottom:0; font-size:0.65rem; letter-spacing:0.12em;
          color:rgba(96,165,250,0.35); fontFamily:"'Space Mono',monospace"; }
      `}</style>

      {/* Moon */}
      <div className="ld-moon pointer-events-none" />

      {/* City labels */}
      <div className="ld-city" style={{ left: "6%" }}>📍 NEW YORK</div>
      <div className="ld-city" style={{ right: "5%" }}>📍 LONDON</div>

      {/* Horizon glow */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{
        height: 80, zIndex: 1,
        background: "linear-gradient(to top,rgba(29,78,216,0.12),transparent)",
      }} />

      {/* Distant city lights */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 1, height: 3 }}>
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} className="absolute bottom-0 rounded-full" style={{
            left: `${Math.random() * 100}%`,
            width: 1 + Math.random() * 2, height: 2 + Math.random() * 4,
            background: `rgba(${Math.random() > 0.5 ? "253,230,138" : "147,197,253"},${0.3 + Math.random() * 0.4})`,
            animation: `ldTwinkle ${1.5 + Math.random() * 2}s ${Math.random() * 3}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </>
  );
}
