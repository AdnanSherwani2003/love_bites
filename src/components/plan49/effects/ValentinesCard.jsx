"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FX helpers ─── */
function spawnParticles(cx, cy, count = 50, colors) {
  const cls = colors || ["#ff4d6d", "#ff9cc5", "#ff6b9d", "#fff", "#f7d06a", "#ffd6e7", "#c9184a", "#ffb3c6"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 240;
    const size = 3 + Math.random() * 9;
    const dur = 800 + Math.random() * 800;
    const delay = Math.random() * 250;
    const isHeart = Math.random() > 0.55;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: isHeart ? "auto" : size + "px",
      height: isHeart ? "auto" : size + "px",
      fontSize: isHeart ? (10 + Math.random() * 14) + "px" : "0",
      content: isHeart ? "❤" : "",
      borderRadius: isHeart ? "0" : Math.random() > 0.5 ? "50%" : "3px",
      background: isHeart ? "transparent" : cls[Math.floor(Math.random() * cls.length)],
      color: cls[Math.floor(Math.random() * cls.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    if (isHeart) el.textContent = "❤";
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy, color = "rgba(255,77,109,0.6)") {
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("div");
    const size = 40 + i * 65;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px", borderRadius: "50%",
      border: `2px solid ${color}`, pointerEvents: "none", zIndex: 9998,
      transform: "translate(-50%,-50%) scale(0)", opacity: "0.8",
      transition: `transform ${0.75 + i * 0.18}s ease-out ${i * 0.14}s, opacity ${0.75 + i * 0.18}s ease-out ${i * 0.14}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = "translate(-50%,-50%) scale(1)";
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), 1600);
  }
}

/* ─── Floating heart particle ─── */
function FloatingHeart({ style, emoji = "❤️" }) {
  return <div className="pointer-events-none select-none absolute" style={style}>{emoji}</div>;
}

/* ─── Pulsing heart SVG ─── */
function HeartSVG({ phase, glow }) {
  const isOpen = phase === "open" || phase === "revealed";
  const isBreak = phase === "breaking";
  return (
    <svg viewBox="0 0 160 148" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hg1" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ff8fa3" />
          <stop offset="45%" stopColor="#e63950" />
          <stop offset="100%" stopColor="#8b0000" />
        </radialGradient>
        <radialGradient id="hgOpen" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ffccd5" />
          <stop offset="40%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="#6b0020" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="50%" cy="35%" r="45%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
        </radialGradient>
        <filter id="heartGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="heartGlowStrong">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer glow */}
      {glow && (
        <path
          d="M80 136 C80 136 8 90 8 44 C8 20 26 6 46 6 C60 6 72 14 80 26 C88 14 100 6 114 6 C134 6 152 20 152 44 C152 90 80 136 80 136Z"
          fill="rgba(255,77,109,0.15)" filter="url(#heartGlowStrong)"
          transform="scale(1.12) translate(-7,-6)"
        />
      )}

      {isBreak ? (
        /* Cracking heart — two halves split */
        <>
          <path d="M80 136 C80 136 8 90 8 44 C8 20 26 6 46 6 C60 6 72 14 80 26 L80 136Z"
            fill="url(#hg1)" filter="url(#heartGlow)" transform="translate(-6, -2) rotate(-4, 80, 80)" />
          <path d="M80 136 C80 136 152 90 152 44 C152 20 134 6 114 6 C100 6 88 14 80 26 L80 136Z"
            fill="url(#hg1)" filter="url(#heartGlow)" transform="translate(6, -2) rotate(4, 80, 80)" />
          {/* Crack line */}
          <path d="M80 26 L76 50 L84 70 L78 95 L80 136"
            stroke="rgba(255,220,220,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
        </>
      ) : (
        /* Normal heart */
        <path
          d="M80 136 C80 136 8 90 8 44 C8 20 26 6 46 6 C60 6 72 14 80 26 C88 14 100 6 114 6 C134 6 152 20 152 44 C152 90 80 136 80 136Z"
          fill={isOpen ? "url(#hgOpen)" : "url(#hg1)"}
          filter="url(#heartGlow)"
        />
      )}

      {/* Highlight */}
      {!isBreak && (
        <ellipse cx="58" cy="38" rx="24" ry="18"
          fill="url(#innerGlow)" opacity={isOpen ? 0.5 : 0.4} transform="rotate(-20,58,38)" />
      )}

      {/* Inner shimmer lines */}
      {!isBreak && !isOpen && (
        <>
          <path d="M44 22 Q52 32 48 44" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M56 16 Q66 28 60 42" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Sparkle on open */}
      {isOpen && (<>
        <g opacity="0.9">
          <line x1="80" y1="0" x2="80" y2="10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="5" x2="85" y2="5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g opacity="0.7">
          <line x1="138" y1="20" x2="138" y2="28" stroke="#f7d06a" strokeWidth="2" strokeLinecap="round" />
          <line x1="134" y1="24" x2="142" y2="24" stroke="#f7d06a" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g opacity="0.6">
          <line x1="22" y1="26" x2="22" y2="32" stroke="#ffd6e7" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="19" y1="29" x2="25" y2="29" stroke="#ffd6e7" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      </>)}
    </svg>
  );
}

/* ─── EKG / Heartbeat line ─── */
function HeartbeatLine({ visible }) {
  return (
    <div className="absolute inset-x-0 flex justify-center pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)" }}>
      <svg viewBox="0 0 260 40" style={{ width: 260, height: 40, opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}>
        <defs>
          <linearGradient id="ekgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,77,109,0)" />
            <stop offset="20%" stopColor="rgba(255,77,109,0.7)" />
            <stop offset="80%" stopColor="rgba(255,77,109,0.7)" />
            <stop offset="100%" stopColor="rgba(255,77,109,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 20 L55 20 L65 20 L70 4 L78 36 L84 12 L90 20 L200 20 L205 20 L210 4 L218 36 L224 12 L230 20 L260 20"
          stroke="url(#ekgGrad)" strokeWidth="1.5" fill="none" strokeLinecap="round"
          style={{
            animation: visible ? "ekgDraw 1.5s ease forwards" : "none",
            strokeDasharray: 400, strokeDashoffset: visible ? 0 : 400,
            transition: "stroke-dashoffset 1.5s ease"
          }}
        />
      </svg>
    </div>
  );
}

/* ─── STARS ─── */
function Stars() {
  const items = Array.from({ length: 90 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: 0.4 + Math.random() * 1.8, delay: Math.random() * 5, dur: 1.5 + Math.random() * 3,
    color: ["#fff", "#ffd6e7", "#ffb3c6", "#f7d06a", "#ffc0cb"][Math.floor(Math.random() * 5)]
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {items.map(s => (
        <div key={s.id} className="absolute rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, background: s.color,
          animation: `vTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`
        }} />
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function ValentinesCard() {
  const [phase, setPhase] = useState("idle");
  const [heartPulse, setHeartPulse] = useState(true);
  const [ekgVisible, setEkgVisible] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [msgVisible, setMsgVisible] = useState(false);
  const [heartGlow, setHeartGlow] = useState(true);
  const heartRef = useRef(null);
  const timers = useRef([]);
  const t = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  /* glow pulse */
  useEffect(() => {
    if (phase !== "idle") return;
    const id = setInterval(() => setHeartGlow(g => !g), 900);
    return () => clearInterval(id);
  }, [phase]);

  /* floating hearts shower */
  const launchHearts = useCallback(() => {
    const emojis = ["❤️", "🌹", "💗", "💕", "✨", "🌷", "💝"];
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      dur: 4 + Math.random() * 4,
      swing: (Math.random() - 0.5) * 200,
      size: 0.9 + Math.random() * 0.8,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setHearts(items);
    setTimeout(() => setHearts([]), 9000);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;

    const rect = heartRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    setPhase("breaking");
    setHeartPulse(false);

    t(() => {
      setPhase("open");
      spawnRipple(cx, cy);
      spawnParticles(cx, cy, 70);
      launchHearts();
      setEkgVisible(true);
    }, 420);

    t(() => {
      setMsgVisible(true);
      spawnParticles(cx, cy + 80, 25);
    }, 1050);

    t(() => setPhase("revealed"), 1400);
  }, [phase, launchHearts]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Great+Vibes&family=Raleway:wght@300;400&display=swap');

        .val-bg {
          background:
            radial-gradient(ellipse at 50% 0%,   rgba(180,20,50,0.4)  0%, transparent 55%),
            radial-gradient(ellipse at 20% 70%,  rgba(120,10,40,0.5)  0%, transparent 50%),
            radial-gradient(ellipse at 80% 60%,  rgba(100,0,60,0.35)  0%, transparent 48%),
            radial-gradient(ellipse at 50% 110%, rgba(200,60,80,0.2)  0%, transparent 40%),
            linear-gradient(168deg, #080005 0%, #180010 28%, #200015 52%, #100008 78%, #060003 100%);
        }

        @keyframes vTwinkle  { 0%,100%{opacity:0.15;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes heartBeat {
          0%,100%{transform:scale(1)}
          14%{transform:scale(1.08)}
          28%{transform:scale(1)}
          42%{transform:scale(1.05)}
          56%{transform:scale(1)}
        }
        @keyframes heartFloat {
          0%,100%{transform:translateY(0) rotate(-0.5deg)}
          50%{transform:translateY(-10px) rotate(0.5deg)}
        }
        @keyframes heartFall {
          0%  {transform:translateY(-30px) rotate(0deg); opacity:0}
          5%  {opacity:1}
          95% {opacity:0.8}
          100%{transform:translateY(108vh) rotate(var(--spin)); opacity:0}
        }
        @keyframes msgRise {
          from{opacity:0;transform:translateY(22px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes shimmerV {
          0%  {background-position:0%}
          100%{background-position:250%}
        }
        @keyframes ekgDraw {
          from{stroke-dashoffset:400}
          to  {stroke-dashoffset:0}
        }
        @keyframes candleFlicker {
          0%,100%{transform:translateX(-50%) scaleX(1) scaleY(1)}
          50%{transform:translateX(-50%) scaleX(0.85) scaleY(1.1)}
        }
        @keyframes roseFloat {
          0%,100%{transform:translateY(0) rotate(-2deg)}
          50%{transform:translateY(-6px) rotate(2deg)}
        }
        .heart-shimmer {
          background: linear-gradient(120deg,#ffd6e7 0%,#ff4d6d 28%,#f7d06a 55%,#ff9cc5 78%,#ffd6e7 100%);
          background-size:250%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmerV 4s linear infinite;
        }
        .msg-glass {
          background:rgba(255,20,60,0.05);
          backdrop-filter:blur(28px);
          border:1px solid rgba(255,100,140,0.2);
          box-shadow:0 24px 70px rgba(0,0,0,0.55), 0 0 40px rgba(200,20,60,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="val-bg relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{ fontFamily: "'Raleway',sans-serif", cursor: "default" }}>

        <Stars />

        {/* Falling hearts / petals */}
        {hearts.map(h => (
          <FloatingHeart key={h.id} emoji={h.emoji} style={{
            left: `${h.left}%`, top: "-40px",
            fontSize: `${h.size}rem`, zIndex: 20,
            animationName: "heartFall",
            animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`,
            animationFillMode: "forwards",
            animationTimingFunction: "linear",
            "--spin": `${h.swing}deg`,
          }} />
        ))}

        {/* Ambient candles */}
        <AmbientCandles />

        {/* Rose decorations */}
        <div className="absolute pointer-events-none" style={{ bottom: "12%", left: "4%", fontSize: "1.8rem", animation: "roseFloat 3s ease-in-out infinite", opacity: 0.6 }}>🌹</div>
        <div className="absolute pointer-events-none" style={{ bottom: "16%", right: "5%", fontSize: "1.5rem", animation: "roseFloat 3.5s 0.8s ease-in-out infinite", opacity: 0.5 }}>🌹</div>
        <div className="absolute pointer-events-none" style={{ bottom: "8%", right: "12%", fontSize: "1.2rem", animation: "roseFloat 4s 0.3s ease-in-out infinite", opacity: 0.4 }}>🌷</div>
        <div className="absolute pointer-events-none" style={{ bottom: "10%", left: "14%", fontSize: "1.1rem", animation: "roseFloat 3.8s 1.1s ease-in-out infinite", opacity: 0.35 }}>🌷</div>

        {/* Hint */}
        {phase === "idle" && (
          <p className="text-xs tracking-widest uppercase mb-8 z-10"
            style={{
              color: "rgba(255,130,160,0.7)", letterSpacing: "0.4em",
              animation: "vTwinkle 2.2s ease-in-out infinite"
            }}>
            ✦ tap the heart ✦
          </p>
        )}

        {/* EKG line behind heart */}
        <div className="relative z-10" style={{ width: "min(380px,90vw)" }}>
          <HeartbeatLine visible={ekgVisible} />

          {/* HEART */}
          <div
            ref={heartRef}
            onClick={handleClick}
            className="relative mx-auto z-10"
            style={{
              width: 160, height: 148,
              cursor: phase === "idle" ? "pointer" : "default",
              animation: phase === "idle"
                ? "heartBeat 1.6s ease-in-out infinite, heartFloat 3.5s ease-in-out infinite"
                : phase === "open" || phase === "revealed" ? "heartFloat 3.5s ease-in-out infinite" : "none",
              filter: heartGlow && phase === "idle"
                ? "drop-shadow(0 0 18px rgba(255,77,109,0.65)) drop-shadow(0 0 40px rgba(200,20,60,0.35))"
                : "drop-shadow(0 0 8px rgba(255,77,109,0.3))",
              transition: "filter 0.9s ease",
            }}
          >
            <HeartSVG phase={phase} glow={heartGlow} />
          </div>
        </div>

        {/* MESSAGE */}
        <div
          className="z-10 mt-5 w-full px-4"
          style={{
            maxWidth: 400,
            opacity: msgVisible ? 1 : 0,
            transform: msgVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
            pointerEvents: msgVisible ? "all" : "none",
          }}
        >
          <div className="msg-glass relative rounded px-7 py-6 text-center">

            {/* corner ornaments */}
            {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((p, i) => (
              <span key={i} className={`absolute ${p} text-xs`} style={{ color: "rgba(255,120,150,0.45)" }}>♥</span>
            ))}

            <p className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "rgba(255,150,170,0.65)", letterSpacing: "0.42em", fontFamily: "'Raleway',sans-serif" }}>
              ✦ happy valentine's day ✦
            </p>

            <h2 className="heart-shimmer mb-1"
              style={{ fontFamily: "'Great Vibes',cursive", fontSize: "2.5rem", lineHeight: 1.1 }}>
              Be My Valentine
            </h2>

            {/* divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(255,100,140,0.4),transparent)" }} />
              <span style={{ color: "rgba(255,130,160,0.8)", fontSize: "1rem" }}>♥</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,transparent,rgba(255,100,140,0.4),transparent)" }} />
            </div>

            <p className="mb-4 leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontWeight: 300,
                fontSize: "0.97rem", color: "rgba(255,240,245,0.85)"
              }}>
              In a world full of ordinary days,<br />
              you make every one feel like{" "}
              <span style={{ color: "#ff8fa3", fontStyle: "normal", fontWeight: 400 }}>magic</span>.<br /><br />
              You are the reason my heart beats a little{" "}
              <span style={{ color: "#f7d06a", fontStyle: "normal", fontWeight: 400 }}>faster</span> —<br />
              and I wouldn't have it any other way.
            </p>

            <p className="text-right"
              style={{
                fontFamily: "'Great Vibes',cursive", fontSize: "1.65rem",
                background: "linear-gradient(90deg,#ff6b9d,#f7d06a)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
              Forever yours ♥
            </p>

            <div className="flex justify-center gap-3 mt-3 text-base">
              {["❤️", "🌹", "💕", "✨", "💝"].map((e, i) => (
                <span key={i} className="inline-block"
                  style={{ animation: `vTwinkle ${1.4 + i * 0.2}s ${i * 0.18}s ease-in-out infinite` }}>{e}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Ambient Candles ── */
function AmbientCandles() {
  return (
    <>
      <style>{`
        .v-candle { position:absolute; bottom:6%; display:flex; flex-direction:column; align-items:center; }
        .v-flame  { position:relative; width:8px; height:16px; border-radius:50% 50% 35% 35%;
          background:radial-gradient(ellipse at 50% 80%,#fff 0%,#ffe566 22%,#ff9200 62%,transparent 100%);
          animation:candleFlicker 0.24s ease-in-out infinite alternate; }
        .v-flame::after { content:''; position:absolute; bottom:-5px; left:50%;
          transform:translateX(-50%); width:22px; height:14px; border-radius:50%;
          background:radial-gradient(ellipse,rgba(255,160,80,0.45) 0%,transparent 70%);
          animation:candleFlicker 0.3s ease-in-out infinite alternate; }
        .v-wick  { width:1.5px; height:6px; background:#666; margin-bottom:-1px; }
        .v-body  { border-radius:2px 2px 1px 1px;
          background:linear-gradient(180deg,#f0d0d8,#c09098);
          box-shadow:inset -1px 0 3px rgba(0,0,0,0.2); }
      `}</style>
      {[
        { left: "5%", h: 70, w: 9, op: 0.6 },
        { left: "9%", h: 50, w: 8, op: 0.45 },
        { left: "13%", h: 38, w: 7, op: 0.35 },
        { right: "5%", h: 65, w: 9, op: 0.6 },
        { right: "9%", h: 48, w: 8, op: 0.45 },
        { right: "13%", h: 34, w: 7, op: 0.35 },
      ].map((c, i) => (
        <div key={i} className="v-candle" style={{ ...{ left: c.left, right: c.right }, opacity: c.op }}>
          <div className="v-flame" style={{ animationDelay: `${i * 0.07}s` }} />
          <div className="v-wick" />
          <div className="v-body" style={{ width: c.w, height: c.h }} />
        </div>
      ))}
    </>
  );
}
