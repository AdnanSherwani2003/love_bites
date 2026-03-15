"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FX Helpers ─── */
function spawnParticles(cx, cy, count = 55) {
  const colors = ["#ffd166","#ff6b9d","#a8dadc","#06d6a0","#ffb347","#fff","#c8e6c9","#f9a8d4","#fde68a","#bbdefb"];
  for (let i = 0; i < count; i++) {
    const el    = document.createElement("div");
    const angle = Math.random() * Math.PI * 2;
    const dist  = 60 + Math.random() * 200;
    const size  = 3 + Math.random() * 8;
    const dur   = 800 + Math.random() * 700;
    const delay = Math.random() * 250;
    const emoji = Math.random() > 0.6;
    Object.assign(el.style, {
      position: "fixed", left: cx + "px", top: cy + "px",
      width:  emoji ? "auto" : size + "px",
      height: emoji ? "auto" : size + "px",
      fontSize: emoji ? (10 + Math.random() * 12) + "px" : "0",
      borderRadius: emoji ? "0" : Math.random() > 0.5 ? "50%" : "2px",
      background: emoji ? "transparent" : colors[Math.floor(Math.random() * colors.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: "none", zIndex: 9999, opacity: 1,
      transition: `transform ${dur}ms ease-out ${delay}ms, opacity ${dur}ms ease-out ${delay}ms`,
      transform: "translate(-50%,-50%) scale(1)",
    });
    if (emoji) el.textContent = ["🌸","🌼","✨","🌿","💛","🌺","⭐","🌻"][Math.floor(Math.random()*8)];
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px), calc(-50% + ${Math.sin(angle)*dist}px)) scale(0) rotate(${Math.random()*360}deg)`;
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), dur + delay + 100);
  }
}

function spawnRipple(cx, cy) {
  const colors = ["rgba(255,209,102,0.6)","rgba(255,107,157,0.5)","rgba(168,218,220,0.6)","rgba(6,214,160,0.4)"];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("div");
    const size = 40 + i * 60;
    Object.assign(el.style, {
      position:"fixed", left:cx+"px", top:cy+"px",
      width:size+"px", height:size+"px", borderRadius:"50%",
      border:`2px solid ${colors[i % colors.length]}`,
      pointerEvents:"none", zIndex:9998,
      transform:"translate(-50%,-50%) scale(0)", opacity:"0.85",
      transition:`transform ${0.75+i*0.18}s ease-out ${i*0.13}s, opacity ${0.75+i*0.18}s ease-out ${i*0.13}s`,
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = "translate(-50%,-50%) scale(1)";
      el.style.opacity = "0";
    }));
    setTimeout(() => el.remove(), 1600);
  }
}

/* ─── Floating Petal ─── */
function FallingItem({ style, emoji }) {
  return <div className="pointer-events-none select-none absolute" style={style}>{emoji}</div>;
}

/* ─── Envelope SVG ─── */
function EnvelopeSVG({ phase }) {
  const isOpen = phase === "open" || phase === "revealed";
  return (
    <svg viewBox="0 0 220 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fef9c3"/>
          <stop offset="100%" stopColor="#fef08a"/>
        </linearGradient>
        <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fed7aa"/>
          <stop offset="100%" stopColor="#fdba74"/>
        </linearGradient>
        <linearGradient id="envBottom" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#fcd34d"/>
        </linearGradient>
        <linearGradient id="envLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#fef3c7"/>
        </linearGradient>
        <linearGradient id="envRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#fef3c7"/>
        </linearGradient>
        <filter id="envShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.12)"/>
        </filter>
        <filter id="envGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Body */}
      <rect x="10" y="40" width="200" height="112" rx="6" fill="url(#envBody)" filter="url(#envShadow)"/>

      {/* Left fold */}
      <path d="M10 40 L10 152 L110 96Z" fill="url(#envLeft)" opacity="0.6"/>
      {/* Right fold */}
      <path d="M210 40 L210 152 L110 96Z" fill="url(#envRight)" opacity="0.6"/>
      {/* Bottom fold */}
      <path d="M10 152 L110 96 L210 152Z" fill="url(#envBottom)" opacity="0.7"/>

      {/* Flap — opens upward via CSS */}
      <g style={{
        transformOrigin: "110px 40px",
        transform: isOpen ? "perspective(400px) rotateX(-165deg)" : "rotateX(0deg)",
        transition: "transform 0.75s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <path d="M10 40 L110 96 L210 40Z" fill="url(#envFlap)"/>
        <path d="M10 40 L110 96 L210 40Z" fill="rgba(255,255,255,0.15)"/>
      </g>

      {/* Daisy seal */}
      {!isOpen && (
        <g transform="translate(96,84)">
          {/* petals */}
          {[0,45,90,135,180,225,270,315].map((a,i) => (
            <ellipse key={i}
              cx={Math.cos(a*Math.PI/180)*10}
              cy={Math.sin(a*Math.PI/180)*10}
              rx="5" ry="3"
              fill="#fef9c3" stroke="#fcd34d" strokeWidth="0.5"
              transform={`rotate(${a},${Math.cos(a*Math.PI/180)*10},${Math.sin(a*Math.PI/180)*10})`}
            />
          ))}
          {/* center */}
          <circle cx="0" cy="0" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8"/>
          <circle cx="0" cy="0" r="3" fill="#f59e0b"/>
        </g>
      )}

      {/* Envelope lines */}
      <line x1="10" y1="40" x2="210" y2="40" stroke="rgba(253,186,116,0.4)" strokeWidth="0.8"/>

      {/* Sparkle when open */}
      {isOpen && (<>
        <g opacity="0.9">
          <line x1="110" y1="24" x2="110" y2="34" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="105" y1="29" x2="115" y2="29" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g opacity="0.7">
          <line x1="172" y1="34" x2="172" y2="41" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round"/>
          <line x1="168" y1="37" x2="176" y2="37" stroke="#06d6a0" strokeWidth="2" strokeLinecap="round"/>
        </g>
        <g opacity="0.6">
          <line x1="46" y1="38" x2="46" y2="44" stroke="#ff6b9d" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="43" y1="41" x2="49" y2="41" stroke="#ff6b9d" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
      </>)}
    </svg>
  );
}

/* ─── Blooming Flower Bouquet ─── */
function FlowerBouquet({ visible }) {
  const flowers = [
    { emoji:"🌻", x:"-28px", delay:"0s",   dur:"0.7s", rotate:"-15deg" },
    { emoji:"🌸", x:"0px",   delay:"0.12s", dur:"0.65s",rotate:"0deg"  },
    { emoji:"🌼", x:"28px",  delay:"0.07s", dur:"0.7s", rotate:"12deg" },
    { emoji:"🌺", x:"-16px", delay:"0.18s", dur:"0.6s", rotate:"-8deg" },
    { emoji:"🌿", x:"16px",  delay:"0.22s", dur:"0.65s",rotate:"18deg" },
  ];
  return (
    <div className="absolute pointer-events-none" style={{
      bottom:"calc(100% - 8px)", left:"50%", transform:"translateX(-50%)",
      width:90, height:80, display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      {flowers.map((f,i) => (
        <div key={i} style={{
          position:"absolute", bottom:0, left:`calc(50% + ${f.x})`, transform:`translateX(-50%)`,
          fontSize:"1.5rem",
          opacity: visible ? 1 : 0,
          transform: visible
            ? `translateX(-50%) translateY(0) rotate(${f.rotate})`
            : `translateX(-50%) translateY(40px) rotate(${f.rotate})`,
          transition: `opacity ${f.dur} ease ${f.delay}, transform ${f.dur} cubic-bezier(0.22,1,0.36,1) ${f.delay}`,
        }}>{f.emoji}</div>
      ))}
    </div>
  );
}

/* ─── Butterfly ─── */
function Butterfly({ style }) {
  return <div className="pointer-events-none absolute" style={style}>🦋</div>;
}

/* ─── Sun rays background ─── */
function SunRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div style={{
        position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)",
        width:"200%", height:"140%",
        background:"conic-gradient(from 0deg at 50% 0%, rgba(255,209,102,0.06) 0deg, transparent 18deg, rgba(255,209,102,0.04) 20deg, transparent 38deg, rgba(255,209,102,0.06) 40deg, transparent 58deg, rgba(255,209,102,0.05) 60deg, transparent 78deg, rgba(255,209,102,0.06) 80deg, transparent 98deg, rgba(255,209,102,0.04) 100deg, transparent 118deg, rgba(255,209,102,0.05) 120deg, transparent 138deg, rgba(255,209,102,0.06) 140deg, transparent 158deg, rgba(255,209,102,0.04) 160deg, transparent 178deg, rgba(255,209,102,0.05) 180deg, transparent 360deg)",
      }}/>
    </div>
  );
}

/* ─── Floating orbs ─── */
function Orbs() {
  const orbs = [
    {size:180,top:"10%",left:"5%",  color:"rgba(254,240,138,0.12)"},
    {size:120,top:"60%",right:"4%", color:"rgba(167,243,208,0.1)"},
    {size:90, top:"20%",right:"8%", color:"rgba(249,168,212,0.1)"},
    {size:150,bottom:"15%",left:"3%",color:"rgba(147,197,253,0.08)"},
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {orbs.map((o,i) => (
        <div key={i} className="absolute rounded-full" style={{
          width:o.size, height:o.size,
          ...o,
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          filter:"blur(20px)",
          animation:`orbDrift ${5+i*1.5}s ${i*0.8}s ease-in-out infinite alternate`,
        }}/>
      ))}
    </div>
  );
}

/* ─── Stars (lighter, daytime feel) ─── */
function FloatingDots() {
  const dots = Array.from({length:60}, (_,i) => ({
    id:i, left:Math.random()*100, top:Math.random()*100,
    size:0.5+Math.random()*2,
    delay:Math.random()*5, dur:2+Math.random()*3,
    color:["#fde68a","#a7f3d0","#fca5a5","#bfdbfe","#ddd6fe","#fff"][Math.floor(Math.random()*6)],
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {dots.map(d => (
        <div key={d.id} className="absolute rounded-full" style={{
          left:`${d.left}%`, top:`${d.top}%`,
          width:d.size, height:d.size, background:d.color,
          animation:`jbTwinkle ${d.dur}s ${d.delay}s ease-in-out infinite`,
        }}/>
      ))}
    </div>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function JustBecauseCard() {
  const [phase,       setPhase]       = useState("idle");
  const [fallingItems,setFallingItems]= useState([]);
  const [butterflies, setButterflies] = useState([]);
  const [msgVisible,  setMsgVisible]  = useState(false);
  const [bouquet,     setBouquet]     = useState(false);
  const [envGlow,     setEnvGlow]     = useState(true);
  const envRef = useRef(null);
  const timers = useRef([]);
  const t = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  /* idle glow pulse */
  useEffect(() => {
    if (phase !== "idle") return;
    const id = setInterval(() => setEnvGlow(g => !g), 1000);
    return () => clearInterval(id);
  }, [phase]);

  /* launch falling petals */
  const launchPetals = useCallback(() => {
    const emojis = ["🌸","🌼","🌺","🌻","🌿","✨","🍃","💛","🌷","⭐"];
    setFallingItems(Array.from({length:22}, (_,i) => ({
      id:i, left:Math.random()*100,
      delay:Math.random()*2.5, dur:4+Math.random()*4,
      swing:(Math.random()-0.5)*200, size:0.8+Math.random()*0.8,
      emoji:emojis[Math.floor(Math.random()*emojis.length)],
    })));
    setTimeout(() => setFallingItems([]), 9000);
  }, []);

  /* launch butterflies */
  const launchButterflies = useCallback(() => {
    setButterflies(Array.from({length:5}, (_,i) => ({
      id:i, left:10+Math.random()*80, top:20+Math.random()*60,
      delay:Math.random()*2, dur:3+Math.random()*3,
    })));
    setTimeout(() => setButterflies([]), 8000);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    const rect = envRef.current?.getBoundingClientRect();
    const cx   = rect ? rect.left + rect.width / 2  : window.innerWidth  / 2;
    const cy   = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;

    setPhase("opening");
    t(() => {
      setPhase("open");
      setBouquet(true);
      spawnRipple(cx, cy);
      spawnParticles(cx, cy, 70);
      launchPetals();
      launchButterflies();
    }, 450);
    t(() => {
      setMsgVisible(true);
      spawnParticles(cx, cy + 80, 30);
    }, 1050);
    t(() => setPhase("revealed"), 1500);
  }, [phase, launchPetals, launchButterflies]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const isOpen = phase === "open" || phase === "revealed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&family=Pacifico&family=Nunito:ital,wght@0,300;1,300;1,400&display=swap');

        .jb-bg {
          background:
            radial-gradient(ellipse at 20% 15%, rgba(254,240,138,0.35) 0%, transparent 45%),
            radial-gradient(ellipse at 80% 20%, rgba(167,243,208,0.25) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 85%, rgba(249,168,212,0.2)  0%, transparent 45%),
            radial-gradient(ellipse at 10% 80%, rgba(147,197,253,0.18) 0%, transparent 40%),
            linear-gradient(160deg, #fffbeb 0%, #fef3c7 25%, #ecfdf5 55%, #fff1f2 80%, #fefce8 100%);
        }
        @keyframes jbTwinkle { 0%,100%{opacity:0.2;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes jbFloat   { 0%,100%{transform:translateY(0) rotate(-0.5deg)} 50%{transform:translateY(-10px) rotate(0.5deg)} }
        @keyframes petalFall {
          0%  { transform:translateY(-30px) rotate(0deg); opacity:0; }
          6%  { opacity:1; }
          94% { opacity:0.8; }
          100%{ transform:translateY(108vh) rotate(var(--spin)); opacity:0; }
        }
        @keyframes orbDrift { 0%{transform:translate(0,0)} 100%{transform:translate(var(--ox,15px),var(--oy,-20px))} }
        @keyframes bfloat { 0%,100%{transform:translate(0,0) rotate(-5deg)} 50%{transform:translate(20px,-15px) rotate(5deg)} }
        @keyframes shimmerJB {
          0%  {background-position:0%}
          100%{background-position:250%}
        }
        @keyframes envWobble {
          0%,100%{transform:rotate(-1deg) translateY(0)}
          50%{transform:rotate(1deg) translateY(-8px)}
        }
        .jb-shimmer {
          background:linear-gradient(120deg,#f59e0b 0%,#ec4899 28%,#10b981 55%,#3b82f6 78%,#f59e0b 100%);
          background-size:250%;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:shimmerJB 4s linear infinite;
        }
        .jb-glass {
          background:rgba(255,255,255,0.55);
          backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.7);
          box-shadow:0 20px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .env-shadow-idle {
          filter: drop-shadow(0 12px 30px rgba(251,191,36,0.3)) drop-shadow(0 4px 12px rgba(0,0,0,0.08));
          transition: filter 0.9s ease;
        }
        .env-shadow-glow {
          filter: drop-shadow(0 0 18px rgba(251,191,36,0.55)) drop-shadow(0 12px 36px rgba(251,191,36,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.08));
        }
        .env-wobble { animation: envWobble 3.5s ease-in-out infinite; }
      `}</style>

      <div className="jb-bg relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        style={{fontFamily:"'Quicksand',sans-serif", cursor:"default"}}>

        <SunRays/>
        <Orbs/>
        <FloatingDots/>

        {/* Falling petals */}
        {fallingItems.map(f => (
          <FallingItem key={f.id} emoji={f.emoji} style={{
            left:`${f.left}%`, top:"-30px",
            fontSize:`${f.size}rem`, zIndex:20,
            animationName:"petalFall", animationDuration:`${f.dur}s`,
            animationDelay:`${f.delay}s`, animationFillMode:"forwards",
            animationTimingFunction:"linear", "--spin":`${f.swing}deg`,
          }}/>
        ))}

        {/* Butterflies */}
        {butterflies.map(b => (
          <Butterfly key={b.id} style={{
            left:`${b.left}%`, top:`${b.top}%`,
            fontSize:"1.3rem", zIndex:20,
            animation:`bfloat ${b.dur}s ${b.delay}s ease-in-out infinite`,
          }}/>
        ))}

        {/* Ambient garden elements */}
        <AmbientGarden/>

        {/* Hint */}
        {phase === "idle" && (
          <p className="text-xs font-medium tracking-widest uppercase mb-6 z-10"
            style={{color:"rgba(245,158,11,0.75)",letterSpacing:"0.38em",
              fontFamily:"'Quicksand',sans-serif",
              animation:"jbTwinkle 2s ease-in-out infinite"}}>
            ✦ open your surprise ✦
          </p>
        )}

        {/* Tag */}
        <div className="z-10 mb-3 px-4 py-1.5 rounded-full" style={{
          background:"rgba(255,255,255,0.6)",
          border:"1px solid rgba(251,191,36,0.3)",
          backdropFilter:"blur(10px)",
          fontFamily:"'Quicksand',sans-serif", fontWeight:500,
          fontSize:"0.6rem", letterSpacing:"0.35em", textTransform:"uppercase",
          color:"rgba(245,158,11,0.8)",
        }}>
          ✿ &nbsp; just because i love you &nbsp; ✿
        </div>

        {/* ENVELOPE with bouquet on top */}
        <div className="relative z-10" style={{width:"min(260px,85vw)"}}>
          <FlowerBouquet visible={bouquet}/>
          <div
            ref={envRef}
            onClick={handleClick}
            className={`${phase==="idle" ? "env-wobble" : ""} ${envGlow && phase==="idle" ? "env-shadow-glow" : "env-shadow-idle"}`}
            style={{ cursor: phase==="idle" ? "pointer" : "default" }}
          >
            <EnvelopeSVG phase={phase}/>
          </div>
        </div>

        {/* MESSAGE */}
        <div className="z-10 mt-4 w-full px-4" style={{
          maxWidth:420,
          opacity: msgVisible ? 1 : 0,
          transform: msgVisible ? "translateY(0)" : "translateY(22px)",
          transition:"opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: msgVisible ? "all" : "none",
        }}>
          <div className="jb-glass relative rounded-2xl px-7 py-6 text-center">

            {/* corner flowers */}
            {[
              {pos:"top-2 left-3",  e:"🌸"},
              {pos:"top-2 right-3", e:"🌼"},
              {pos:"bottom-2 left-3", e:"🌿"},
              {pos:"bottom-2 right-3",e:"🌺"},
            ].map(({pos,e},i) => (
              <span key={i} className={`absolute ${pos} text-sm`} style={{opacity:0.5}}>{e}</span>
            ))}

            {/* label */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-2"
              style={{color:"rgba(245,158,11,0.7)",letterSpacing:"0.42em",
                fontFamily:"'Quicksand',sans-serif"}}>
              ✦ no reason needed ✦
            </p>

            {/* title */}
            <h2 className="jb-shimmer mb-1"
              style={{fontFamily:"'Pacifico',cursive",fontSize:"2rem",lineHeight:1.2}}>
              Just Because
            </h2>

            {/* divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(245,158,11,0.3),transparent)"}}/>
              <span style={{fontSize:"1rem",opacity:0.6}}>✿</span>
              <div className="flex-1 h-px" style={{background:"linear-gradient(to right,transparent,rgba(245,158,11,0.3),transparent)"}}/>
            </div>

            {/* body */}
            <p className="mb-4 leading-relaxed" style={{
              fontFamily:"'Nunito',sans-serif", fontStyle:"italic", fontWeight:300,
              fontSize:"0.97rem", color:"rgba(30,30,30,0.75)",
            }}>
              No special occasion. No big reason.<br/>
              Just{" "}
              <span style={{fontStyle:"normal",fontWeight:600,color:"#f59e0b"}}>you</span>{" "}
              — existing in the world and making it{" "}
              <span style={{fontStyle:"normal",fontWeight:600,color:"#ec4899"}}>warmer</span>,<br/>
              <span style={{fontStyle:"normal",fontWeight:600,color:"#10b981"}}>brighter</span>,{" "}
              and so much more beautiful.<br/><br/>
              That's reason enough. ✦
            </p>

            {/* sign */}
            <p className="text-right" style={{
              fontFamily:"'Pacifico',cursive", fontSize:"1.5rem",
              background:"linear-gradient(90deg,#f59e0b,#ec4899,#10b981)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              always thinking of you 🌻
            </p>

            {/* emojis */}
            <div className="flex justify-center gap-3 mt-3 text-base">
              {["🌸","🦋","💛","🌿","✨"].map((e,i) => (
                <span key={i} className="inline-block"
                  style={{animation:`jbTwinkle ${1.3+i*0.2}s ${i*0.18}s ease-in-out infinite`}}>{e}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

/* ─── Ambient Garden ─── */
function AmbientGarden() {
  return (
    <>
      {/* ground flowers */}
      {[
        {left:"2%",  bottom:"4%",  e:"🌻", s:1.8, a:3.2, d:0},
        {left:"6%",  bottom:"8%",  e:"🌸", s:1.3, a:3.8, d:0.4},
        {left:"10%", bottom:"5%",  e:"🌿", s:1.2, a:4,   d:0.2},
        {right:"2%", bottom:"4%",  e:"🌺", s:1.7, a:3.5, d:0.1},
        {right:"7%", bottom:"9%",  e:"🌼", s:1.4, a:4.2, d:0.6},
        {right:"11%",bottom:"5%",  e:"🍃", s:1.2, a:3.8, d:0.3},
        {left:"50%", bottom:"3%",  e:"🌷", s:1.4, a:3.4, d:0.5},
      ].map((f,i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          left:f.left, right:f.right, bottom:f.bottom,
          fontSize:`${f.s}rem`, opacity:0.55,
          animation:`jbFloat ${f.a}s ${f.d}s ease-in-out infinite`,
        }}>{f.e}</div>
      ))}

      {/* floating high petals */}
      {[
        {left:"15%",top:"12%",e:"🌸",s:0.9,a:5,d:0},
        {left:"78%",top:"18%",e:"🌼",s:0.8,a:4.5,d:1},
        {left:"88%",top:"40%",e:"✨",s:0.7,a:6,d:0.5},
        {left:"8%", top:"35%",e:"🍃",s:0.8,a:5.5,d:0.8},
      ].map((f,i)=>(
        <div key={i} className="absolute pointer-events-none" style={{
          left:f.left,top:f.top,fontSize:`${f.s}rem`,opacity:0.35,
          animation:`jbFloat ${f.a}s ${f.d}s ease-in-out infinite`,
        }}>{f.e}</div>
      ))}
    </>
  );
}
