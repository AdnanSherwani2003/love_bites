"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FX Helpers ─── */
function spawnParticles(cx, cy, count = 45) {
  const cols = ["#f7d06a", "#ff9cc5", "#ffb347", "#fff", "#ff6b9d", "#a0d8ff", "#d4b0ff", "#ffd6e7"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 230;
    const size = 3 + Math.random() * 7;
    const dur = 900 + Math.random() * 700;
    const delay = Math.random() * 180;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px",
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: cols[Math.floor(Math.random() * cols.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy, color = "rgba(255,180,100,0.5)") {
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("div");
    const size = 38 + i * 52;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width: size + "px", height: size + "px",
      borderRadius: "50%", border: `2px solid ${color}`,
      pointerEvents: "none", zIndex: 9998,
      transform: "translate(-50%,-50%) scale(0)", opacity: "0.8",
      transition: `transform ${0.65 + i * 0.14}s ease-out ${i * 0.13}s, opacity ${0.65 + i * 0.14}s ease-out ${i * 0.13}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = "translate(-50%,-50%) scale(1)";
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), 1300);
  }
}

function spawnStreamers(cx, cy) {
  const cols = ["#f7d06a", "#ff9cc5", "#d4b0ff", "#a0d8ff", "#ffd6e7", "#ffb347"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("div");
    const len = 10 + Math.random() * 26;
    const dx = (Math.random() - 0.5) * 50;
    const sy = 80 + Math.random() * 240;
    const r1 = (Math.random() - 0.5) * 360;
    const r2 = (Math.random() - 0.5) * 720;
    const dur = 1.1 + Math.random() * 0.8;
    const del = Math.random() * 0.3;
    Object.assign(el.style, {
      position: "fixed", left: (cx + dx) + "px", top: cy + "px",
      width: "4px", height: len + "px", borderRadius: "2px",
      background: cols[Math.floor(Math.random() * cols.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transform: `rotate(${r1}deg) scaleY(0.4)`,
      transition: `transform ${dur}s ease-out ${del}s, opacity ${dur}s ease-out ${del}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translateY(${sy}px) rotate(${r2}deg) scaleY(1)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), (dur + del) * 1000 + 200);
  }
}

/* ─── Smoke Puff ─── */
function SmokePuff() {
  return (
    <div className="absolute pointer-events-none" style={{
      bottom: 60, left: "50%",
      width: 6, height: 6, borderRadius: "50%",
      background: "rgba(220,200,220,0.6)",
      animation: "smokePuff 1.3s ease-out forwards",
    }} />
  );
}

/* ─── Single Candle ─── */
function Candle({ blown, bodyGradient, onBlow, candleRef }) {
  const [showSmoke, setShowSmoke] = useState(false);

  const handleBlow = useCallback((e) => {
    e.stopPropagation();
    if (blown) return;
    setShowSmoke(true);
    onBlow(e);
    setTimeout(() => setShowSmoke(false), 1400);
  }, [blown, onBlow]);

  return (
    <div
      ref={candleRef}
      onClick={handleBlow}
      className="relative flex flex-col items-center"
      style={{ cursor: blown ? "default" : "pointer" }}
    >
      {showSmoke && <SmokePuff />}

      {/* Flame */}
      <div style={{ width: 16, height: 26, position: "relative", marginBottom: -1, visibility: blown ? "hidden" : "visible" }}>
        <div style={{
          position: "absolute", bottom: -3, left: "50%", transform: "translateX(-50%)",
          width: 26, height: 16, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,180,0,0.45) 0%,transparent 70%)",
          animation: "fglow 0.28s ease-in-out infinite alternate",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          width: 13, height: 22,
          borderRadius: "50% 50% 35% 35% / 55% 55% 45% 45%",
          background: "radial-gradient(ellipse at 50% 82%,#fff 0%,#ffe566 18%,#ff9200 54%,rgba(255,50,0,.22) 82%,transparent 100%)",
          animation: "flame 0.22s ease-in-out infinite alternate",
          filter: "blur(0.3px)",
        }} />
        <div style={{
          position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
          width: 5, height: 13, borderRadius: "50% 50% 35% 35%",
          background: "radial-gradient(ellipse at 50% 90%,#fff 0%,rgba(255,245,120,.8) 55%,transparent 100%)",
          animation: "flame 0.18s ease-in-out infinite alternate-reverse",
        }} />
      </div>

      {/* Wick */}
      <div style={{
        width: 2, height: 8, marginBottom: -2, borderRadius: 1, zIndex: 3,
        background: blown ? "#333" : "linear-gradient(180deg,#555,#999)",
      }} />

      {/* Body */}
      <div style={{
        width: 12, height: 34,
        borderRadius: "3px 3px 2px 2px",
        background: bodyGradient,
        boxShadow: "inset -2px 0 5px rgba(0,0,0,.2), inset 2px 0 5px rgba(255,255,255,.1)",
        opacity: blown ? 0.65 : 1,
        transition: "opacity 0.4s",
      }} />
    </div>
  );
}

/* ─── Cake Tier ─── */
function Tier({ width, height, bg, frostingColor, frostingPositions }) {
  return (
    <div style={{
      width, height,
      background: bg,
      borderRadius: "5px 5px 2px 2px",
      position: "relative", overflow: "hidden",
      boxShadow: `inset 0 -5px 12px rgba(0,0,0,.22), 0 0 16px rgba(200,100,200,.25)`,
    }}>
      {/* stripe texture */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(90deg,transparent,transparent 15px,rgba(255,255,255,.07) 15px,rgba(255,255,255,.07) 16px)",
      }} />
      {/* frosting drips */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 12,
        backgroundColor: frostingColor,
        backgroundImage: frostingPositions.map(x =>
          `radial-gradient(ellipse 11px 12px at ${x}px 0, ${frostingColor} 50%, transparent 50%)`
        ).join(", "),
      }} />
    </div>
  );
}

export default function InteractiveCake({ onAllBlown, onComplete }) {
  const CANDLE_COLORS = [
    "linear-gradient(180deg,#ffb3d1,#e0609a)",
    "linear-gradient(180deg,#a8e6cf,#40916c)",
    "linear-gradient(180deg,#a0c4ff,#4477cc)",
  ];

  const [blownState, setBlownState] = useState([false, false, false]);
  const [cakeShake, setCakeShake] = useState(false);
  const [cakeShrink, setCakeShrink] = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [hintText, setHintText] = useState("✦ click a candle to blow it out ✦");
  const [hintGone, setHintGone] = useState(false);
  const [done, setDone] = useState(false);

  const cakeRef = useRef(null);
  const msgRef = useRef(null);
  const candleRefs = useRef([null, null, null]);
  const timers = useRef([]);
  const t = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleBlow = useCallback((index, e) => {
    if (done || blownState[index]) return;

    const rect = candleRefs.current[index]?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : e.clientX;
    const cy = rect ? rect.top + rect.height / 2 : e.clientY;

    spawnRipple(cx, cy, "rgba(255,180,100,0.5)");
    spawnParticles(cx, cy, 12);

    const newBlown = [...blownState];
    newBlown[index] = true;
    setBlownState(newBlown);

    const blownCount = newBlown.filter(Boolean).length;
    const left = newBlown.length - blownCount;

    if (left > 0) {
      setHintText(`✦ ${left} candle${left > 1 ? "s" : ""} left ✦`);
    } else {
      setDone(true);
      setHintGone(true);
      triggerCelebration();
    }
  }, [blownState, done]);

  const triggerCelebration = useCallback(() => {
    const rect = cakeRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    setCakeShake(true);
    t(() => {
      spawnParticles(cx, cy, 60);
      spawnStreamers(cx, cy);
      spawnRipple(cx, cy, "rgba(255,150,200,0.5)");
      setCakeShake(false);
    }, 380);

    t(() => setCakeShrink(true), 680);
    t(() => {
      setMsgVisible(true);
    }, 1100);
    
    if (onAllBlown) {
      t(() => onAllBlown(), 900);
    }
  }, [onAllBlown]);

  const cakeStyle = {
    position: "relative",
    display: "flex", flexDirection: "column", alignItems: "center",
    filter: "drop-shadow(0 18px 50px rgba(200,100,180,.28)) drop-shadow(0 6px 16px rgba(0,0,0,.5))",
    transition: "transform 0.6s cubic-bezier(.22,1,.36,1), filter 0.6s",
    animation: cakeShake
      ? "cakeShake 0.5s ease forwards"
      : !done ? "cakeFloat 3.8s ease-in-out infinite" : "none",
    transform: cakeShrink ? "scale(0.72) translateY(-8px)" : "scale(1)",
    margin: "40px 0"
  };

  return (
    <div className="flex flex-col items-center justify-center select-none" style={{ fontFamily: "'Raleway',sans-serif", minHeight: '600px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fraunces:ital,opsz,wght@1,9..144,300;1,9..144,500&family=Raleway:wght@300;400&display=swap');

        @keyframes cakeFloat {
          0%,100%{ transform:translateY(0) rotate(-.35deg) }
          50%    { transform:translateY(-9px) rotate(.35deg) }
        }
        @keyframes cakeShake {
          0%,100%{transform:translate(0,0)}
          20%{transform:translate(-6px,2px) rotate(-2deg)}
          40%{transform:translate(6px,-2px) rotate(2deg)}
          60%{transform:translate(-4px,3px) rotate(-1.5deg)}
          80%{transform:translate(5px,-2px) rotate(1.5deg)}
        }
        @keyframes flame {
          0%  {transform:translateX(-50%) scaleX(1) scaleY(1) rotate(-2.5deg)}
          100%{transform:translateX(-50%) scaleX(.86) scaleY(1.1) rotate(2.5deg)}
        }
        @keyframes fglow {
          0%  {opacity:.55;transform:translateX(-50%) scale(1)}
          100%{opacity:1;transform:translateX(-50%) scale(1.38)}
        }
        @keyframes smokePuff {
          0%  {transform:translateX(-50%) scale(.4);opacity:.8}
          40% {transform:translateX(-62%) scale(1.3) translateY(-16px);opacity:.5}
          70% {transform:translateX(-38%) scale(2.2) translateY(-34px);opacity:.2}
          100%{transform:translateX(-52%) scale(3.5) translateY(-60px);opacity:0}
        }
        @keyframes hintBlink { 0%,100%{opacity:.25} 50%{opacity:.9} }
        @keyframes msgBobEmoji { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes shimmerBday {
          0%  {background-position:0%}
          100%{background-position:250%}
        }
        .bday-shimmer {
          background:linear-gradient(120deg,#ffd6e7 0%,#ff9cc5 28%,#f7d06a 55%,#d4b0ff 78%,#ffd6e7 100%);
          background-size:250%;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          animation:shimmerBday 4s linear infinite;
        }
        .msg-glass {
          background:rgba(255,255,255,0.06);
          backdrop-filter:blur(24px);
          border:1px solid rgba(255,180,220,.2);
          box-shadow:0 20px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07);
        }
      `}</style>

      {/* Hint */}
      <p
        className="text-xs tracking-widest uppercase mb-5 z-10"
        style={{
          color: "rgba(255,200,150,.65)", letterSpacing: "0.4em",
          animation: "hintBlink 2.2s ease-in-out infinite",
          opacity: hintGone ? 0 : 1,
          transition: "opacity 0.4s",
          pointerEvents: hintGone ? "none" : "all",
        }}
      >
        {hintText}
      </p>

      {/* ── CAKE ── */}
      {!msgVisible && (
        <div ref={cakeRef} style={cakeStyle}>
          {/* Candles row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, marginBottom: 0, zIndex: 10 }}>
            {CANDLE_COLORS.map((grad, i) => (
              <Candle
                key={i}
                blown={blownState[i]}
                bodyGradient={grad}
                candleRef={el => candleRefs.current[i] = el}
                onBlow={e => handleBlow(i, e)}
              />
            ))}
          </div>

          {/* Top tier */}
          <Tier
            width={120} height={46}
            bg="linear-gradient(135deg,#f48fb1 0%,#e0609a 45%,#c2185b 100%)"
            frostingColor="#fff5f8"
            frostingPositions={[8, 24, 40, 56, 72, 88, 104]}
          />

          {/* Mid tier */}
          <Tier
            width={168} height={55}
            bg="linear-gradient(135deg,#ce93d8 0%,#ab47bc 45%,#8e24aa 100%)"
            frostingColor="#f5e8ff"
            frostingPositions={[8, 26, 44, 62, 80, 98, 116, 134, 152]}
          />

          {/* Bottom tier */}
          <Tier
            width={218} height={64}
            bg="linear-gradient(135deg,#80deea 0%,#26c6da 45%,#00838f 100%)"
            frostingColor="#e0faff"
            frostingPositions={[9, 29, 49, 69, 89, 109, 129, 149, 169, 189]}
          />

          {/* Plate */}
          <div style={{
            width: 238, height: 13, borderRadius: "50%",
            background: "linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.04))",
            border: "1px solid rgba(255,255,255,.14)",
            boxShadow: "0 6px 22px rgba(0,0,0,.5)",
          }} />
        </div>
      )}

      {/* ── MESSAGE CARD OVERLAY ── */}
      {msgVisible && (
        <div 
          onClick={onComplete}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.6s ease forwards'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%", maxWidth: "440px",
              padding: "40px 30px", borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 180, 220, 0.2)",
              backdropFilter: "blur(40px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              position: "relative",
              textAlign: "center",
              animation: "fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards"
            }}
          >
            {/* Close Button */}
            <button
              onClick={onComplete}
              style={{
                position: "absolute", top: "20px", right: "20px",
                background: "none", border: "none",
                color: "rgba(255,255,255,0.4)", fontSize: "20px",
                cursor: "pointer", transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              ✕
            </button>

            {/* Corner Ornaments */}
            {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((p, i) => (
              <span key={i} className={`absolute ${p} text-xs`} style={{ color: "rgba(247,208,106,.4)" }}>✦</span>
            ))}

            <p style={{ color: "#f7d06a", letterSpacing: "0.5em", fontSize: "11px", textTransform: "uppercase", marginBottom: "16px" }}>
              ✦ a birthday wish ✦
            </p>

            <h2 className="bday-shimmer" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.8rem", marginBottom: "20px", fontStyle: "italic" }}>
              Happy Birthday!
            </h2>

            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, #ff9cc5, transparent)", margin: "0 auto 24px" }} />

            <p style={{
              fontFamily: "'Fraunces', serif", fontSize: "1.1rem", lineHeight: "1.8",
              color: "rgba(255,255,255,0.9)", fontStyle: "italic", marginBottom: "32px"
            }}>
              May this year bring you{" "}
              <span style={{ color: "#f7d06a", fontStyle: "normal", fontWeight: 500 }}>joy</span>{" "}
              that overflows, laughter that never fades, and moments<br />
              so magical they take your breath away.<br /><br />
              <span style={{ color: "#ff9cc5", fontStyle: "normal", fontWeight: 500, fontSize: "1.2rem" }}>
                You are endlessly loved.
              </span>
            </p>

            <div className="flex justify-center gap-6 text-2xl">
              {["🎂", "✨", "🌸"].map((e, i) => (
                <span key={i} style={{ animation: `msgBobEmoji 2s ${i * 0.2}s ease-in-out infinite` }}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
