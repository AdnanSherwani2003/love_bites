/**
 * LoveBites 99 Plan Screens
 * Includes LockScreen and PreviewScreen in a single file.
 * Uses inline styles with a "Maroon & Rose Luxury" theme.
 */

import React, { useState, useEffect, useRef } from 'react';

// Mock data to use as defaults
export const mockData = {
    recipientName: "Ameera",
    senderName: "Zain",
    selectedMoods: [
        { emoji: "❤️", label: "Deeply in Love" },
        { emoji: "💗", label: "Devoted" },
        { emoji: "😍", label: "Obsessed with You" }
    ],
    occasion: { emoji: "💍", label: "Proposal Mood" },
    hintMessage: "The day we first met",
    unlockCode: "1234",
    generatedMessage: "From the moment you came into my life, everything started to feel warmer. The world became a little more beautiful, a little more meaningful — simply because you exist in it.\n\nI find myself grateful for every small moment we've shared. The laughs, the silences, the glances that said more than words ever could. You are not just someone I love — you are someone I choose, every single day.\n\nThis isn't just a message. It's a piece of my heart, wrapped in words, sent your way.\n\nForever yours, Zain",
    photos: [null, null, null, null, null], // will show placeholder gradients
};

const THEME = {
    bg: 'linear-gradient(160deg, #0d0008 0%, #1a0010 40%, #0d0005 100%)',
    maroon: '#9b1a3a',
    roseRed: '#c4304f',
    darkRose: '#7a1030',
    cream: '#fff8f0',
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Helvetica Neue', sans-serif",
};

const AnimatedBackground = ({ occasion }) => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const emoji = occasion?.emoji || "💍";
        const label = occasion?.label || "";

        // Skip Proposal and Long Distance here as they are rendered directly
        if (label.includes("Proposal") || label.includes("Long Distance")) {
            setElements([]);
            return;
        }

        let items = [];
        let count = 0;
        let symbols = [];
        let animation = "petalFall";

        if (emoji.includes("💑") || label.includes("Anniversary")) {
            symbols = ["🌹"];
            count = 12;
            animation = "petalFall";
        } else if (emoji.includes("🎂") || label.includes("Birthday")) {
            symbols = ["✨", "🎉", "⭐"];
            count = 15;
            animation = "confettiFall";
        } else if (emoji.includes("💝") || label.includes("Valentine")) {
            symbols = ["❤️", "💕", "💗"];
            count = 14;
            animation = "heartDrift";
        } else if (emoji.includes("🌸") || label.includes("Just Because")) {
            symbols = ["🌸", "🌺", "🌷"];
            count = 12;
            animation = "petalFall";
        } else {
            symbols = ["✦"];
            count = 8;
            animation = "floatSlow";
        }

        items = Array.from({ length: count }, (_, i) => ({
            id: i,
            symbol: symbols[i % symbols.length],
            left: `${Math.random() * 90}%`,
            top: animation === 'floatSlow' ? `${Math.random() * 90}%` : '-10%',
            size: `${14 + Math.random() * 8}px`,
            duration: `${6 + Math.random() * 6}s`,
            delay: `${Math.random() * 8}s`,
            animation: animation
        }));
        setElements(items);
    }, [occasion]);

    const label = occasion?.label || "";

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* Proposal — sparkles and rings fall from top to bottom */}
            {label.includes("Proposal") &&
                ["✨", "💍", "💫", "✨", "⭐", "💍", "✨", "💫", "⭐", "✨", "💍", "💫", "✨", "⭐", "💫", "✨"]
                    .map((item, i) => (
                        <div key={i} style={{
                            position: "fixed",
                            left: `${3 + (i * 6.2)}%`,
                            top: "-30px",
                            fontSize: `${12 + (i % 4) * 5}px`,
                            animation: `petalFall ${5 + (i % 5) * 1.8}s linear infinite`,
                            animationDelay: `${i * 0.5}s`,
                            zIndex: 1,
                            pointerEvents: "none",
                            opacity: 0.8,
                        }}>{item}</div>
                    ))
            }

            {/* Long Distance — stars and planes drift from bottom to top */}
            {label.includes("Long Distance") &&
                ["🌟", "✈️", "💫", "⭐", "🌟", "✈️", "💫", "🌟", "⭐", "✈️", "💫", "🌟", "⭐", "💫", "✈️", "🌟"]
                    .map((item, i) => (
                        <div key={i} style={{
                            position: "fixed",
                            left: `${3 + (i * 6.2)}%`,
                            top: "-50px",
                            fontSize: `${12 + (i % 3) * 6}px`,
                            animation: `heartDrift ${7 + (i % 4) * 2}s linear infinite`,
                            animationDelay: `${i * 0.6}s`,
                            zIndex: 1,
                            pointerEvents: "none",
                            opacity: 0.8,
                        }}>{item}</div>
                    ))
            }

            {/* Other Occasions using CSS Animations */}
            {elements.map(el => (
                <div
                    key={el.id}
                    style={{
                        position: 'absolute',
                        left: el.left,
                        top: el.top,
                        fontSize: el.size,
                        opacity: el.animation === 'floatSlow' ? 0.15 : 0.6,
                        animation: `${el.animation} ${el.duration} linear infinite`,
                        animationDelay: el.delay,
                    }}
                >
                    {el.symbol}
                </div>
            ))}
        </div>
    );
};

const NoiseOverlay = () => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        opacity: 0.03,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
    }} />
);

export const LockScreen = ({ data = mockData, onUnlock }) => {
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "lovebites-animations";
        style.textContent = `
    @keyframes petalFall { 
      0% { transform: translateY(-30px) rotate(0deg); opacity: 0.8; } 
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } 
    }
    @keyframes confettiFall { 
      0% { transform: translateY(-30px) scale(0.5) rotate(0deg); opacity: 0.9; } 
      100% { transform: translateY(110vh) scale(1.2) rotate(360deg); opacity: 0; } 
    }
    @keyframes heartDrift { 
      0% { transform: translateY(110vh) scale(0.8); opacity: 0; } 
      20% { opacity: 0.8; } 
      80% { opacity: 0.6; } 
      100% { transform: translateY(-50px) scale(1.1); opacity: 0; } 
    }
    @keyframes sparkle { 
      0%, 100% { opacity: 0.05; transform: scale(0.4) rotate(0deg); } 
      50% { opacity: 1; transform: scale(1.5) rotate(180deg); } 
    }
    @keyframes twinkle { 
      0%, 100% { opacity: 0.1; transform: scale(0.7); } 
      50% { opacity: 0.9; transform: scale(1.4); } 
    }
    @keyframes floatSlow { 
      0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; } 
      50% { transform: translateY(-40px) rotate(180deg); opacity: 0.5; } 
      100% { transform: translateY(0px) rotate(360deg); opacity: 0.2; } 
    }
    @keyframes heartFloat {
      0% { opacity: 0; transform: translateY(0) scale(0.5); }
      50% { opacity: 1; transform: translateY(-120px) scale(1.2); }
      100% { opacity: 0; transform: translateY(-240px) scale(0.8); }
    }
    @keyframes goldShimmer { 
      0% { background-position: 0%; } 
      100% { background-position: 200%; } 
    }
    @keyframes shimmer { 
      0%, 100% { opacity: 0.3; } 
      50% { opacity: 0.7; } 
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

        const existing = document.getElementById("lovebites-animations");
        if (existing) existing.remove();
        document.head.appendChild(style);

        return () => {
            const el = document.getElementById("lovebites-animations");
            if (el) el.remove();
        };
    }, []);

    const [code, setCode] = useState(["", "", "", ""]);
    const [error, setError] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [hearts, setHearts] = useState([]);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleInput = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...code];
        next[i] = val;
        setCode(next);
        setError(false);
        if (val && i < 3) setTimeout(() => inputRefs[i + 1]?.current?.focus(), 10);
        if (val && i === 3) {
            setTimeout(() => {
                const entered = next.join("");
                if (entered === data.unlockCode) {
                    setUnlocking(true);
                    const h = Array.from({ length: 14 }, (_, k) => ({
                        id: k, x: Math.random() * 100,
                        delay: Math.random() * 0.8, size: 16 + Math.random() * 20,
                    }));
                    setHearts(h);
                    setTimeout(() => onUnlock(), 2000);
                } else {
                    setError(true);
                    setCode(["", "", "", ""]);
                    setTimeout(() => inputRefs[0]?.current?.focus(), 50);
                }
            }, 300);
        }
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            inputRefs[i - 1].current.focus();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100vw',
            margin: '0 auto',
            padding: '40px 20px',
            position: 'relative',
            color: THEME.cream,
            fontFamily: THEME.sans,
            background: THEME.bg,
            overflow: 'hidden'
        }}>
            <AnimatedBackground occasion={data.occasion} />
            <NoiseOverlay />

            {/* Ambient orbs */}
            <div style={{
                position: 'fixed', top: 0, right: 0, width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(155,26,58,0.2) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0
            }} />
            <div style={{
                position: 'fixed', bottom: 0, left: 0, width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(196,48,79,0.15) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0
            }} />

            {/* Top branding */}
            <div style={{ textAlign: 'center', marginBottom: '8px', zIndex: 2 }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💌</div>
                <h1 style={{
                    fontSize: '22px', fontFamily: THEME.serif, color: THEME.roseRed,
                    fontStyle: 'italic', letterSpacing: '1px', margin: 0
                }}>LoveBites</h1>
                <p style={{
                    fontSize: '13px', color: 'rgba(255,248,240,0.5)', marginTop: '6px'
                }}>Someone created a special love message for you.</p>
            </div>

            <hr style={{
                width: '100%', border: 'none', borderTop: '1px solid rgba(155,26,58,0.2)',
                margin: '28px 0', zIndex: 2, maxWidth: '440px'
            }} />

            {/* Teaser message */}
            <div style={{ textAlign: 'center', zIndex: 2 }}>
                <h2 style={{
                    fontSize: 'clamp(22px, 4vw, 32px)', fontFamily: THEME.serif,
                    color: THEME.cream, lineHeight: 1.4, fontWeight: 'normal',
                    fontStyle: 'italic', margin: 0
                }}>
                    A private love message is waiting for you…
                </h2>
                <div style={{
                    color: 'rgba(155,26,58,0.4)', textAlign: 'center', fontSize: '18px',
                    letterSpacing: '8px', margin: '16px 0'
                }}>── ✦ ──</div>
                <div style={{
                    fontSize: '16px', color: THEME.roseRed, fontFamily: THEME.serif,
                    marginTop: '8px'
                }}>
                    For {data.recipientName} ❤️
                </div>
            </div>

            {/* Mood badges row */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                gap: '8px', marginTop: '24px', zIndex: 2
            }}>
                {data.selectedMoods.map((mood, idx) => (
                    <div key={idx} style={{
                        background: 'rgba(155,26,58,0.1)',
                        border: '1px solid rgba(155,26,58,0.4)',
                        borderRadius: '20px', padding: '5px 14px',
                        fontSize: '12px', color: THEME.roseRed
                    }}>
                        {mood.emoji} {mood.label}
                    </div>
                ))}
            </div>

            {/* Occasion pill */}
            <div style={{
                background: 'rgba(155,26,58,0.2)',
                border: '1px solid rgba(155,26,58,0.5)', borderRadius: '20px',
                padding: '6px 18px', fontSize: '13px', color: THEME.roseRed,
                marginTop: '12px', zIndex: 2
            }}>
                {data.occasion.emoji} {data.occasion.label}
            </div>

            {/* Unlock section */}
            <div style={{ textAlign: 'center', marginTop: '40px', zIndex: 2 }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {code.map((num, i) => (
                        <input
                            key={i}
                            ref={inputRefs[i]}
                            type="text"
                            maxLength="1"
                            value={num}
                            onChange={(e) => handleInput(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            style={{
                                width: '56px', height: '64px',
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${error ? 'rgba(255,80,80,0.6)' : (num ? 'rgba(196,48,79,0.8)' : 'rgba(155,26,58,0.3)')}`,
                                borderRadius: '12px', fontSize: '28px', textAlign: 'center',
                                color: THEME.cream, fontFamily: 'monospace', letterSpacing: '2px',
                                outline: 'none', transition: 'all 0.2s ease',
                                animation: error ? 'shake 0.4s ease' : 'none',
                                boxShadow: num ? '0 0 15px rgba(155,26,58,0.3)' : 'none'
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={() => { }} // Auto triggers on 4th digit
                    style={{
                        background: 'linear-gradient(135deg, #9b1a3a, #c4304f)',
                        color: THEME.cream, fontFamily: THEME.serif, fontStyle: 'italic',
                        fontSize: '16px', padding: '16px 48px', borderRadius: '50px',
                        border: 'none', cursor: 'pointer', marginTop: '30px',
                        boxShadow: '0 4px 20px rgba(155,26,58,0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,26,58,0.6)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(155,26,58,0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {unlocking ? "Opening… ✨" : "Unlock the Message 💌"}
                </button>

                <div style={{
                    fontSize: '12px', color: 'rgba(255,248,240,0.35)',
                    fontStyle: 'italic', marginTop: '16px'
                }}>
                    💡 Hint: "{data.hintMessage}"
                </div>

                {error && (
                    <div style={{ color: '#ff5050', fontSize: '12px', marginTop: '8px' }}>
                        Incorrect code. Try again 💔
                    </div>
                )}
            </div>

            {/* Unlock animation overlay */}
            {unlocking && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                    zIndex: 100, display: 'flex', alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {hearts.map((h) => (
                        <div key={h.id} style={{
                            position: 'absolute', left: `${h.x}%`, bottom: '20%',
                            fontSize: `${h.size}px`, animation: `heartFloat 1.8s ease-out forwards`,
                            animationDelay: `${h.delay}s`, opacity: 0
                        }}>
                            ❤️
                        </div>
                    ))}
                    <div style={{ fontSize: '24px', color: THEME.roseRed, fontFamily: THEME.serif }}>
                        Opening your message...
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: 'auto', paddingTop: '48px', fontSize: '11px',
                color: 'rgba(255,248,240,0.2)', textAlign: 'center', zIndex: 2
            }}>
                Created with LoveBites 💗
            </div>
        </div>
    );
};

export const PreviewScreen = ({ data = mockData }) => {
    useEffect(() => {
        const style = document.createElement("style");
        style.id = "lovebites-animations";
        style.textContent = `
    @keyframes petalFall { 
      0% { transform: translateY(-30px) rotate(0deg); opacity: 0.8; } 
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } 
    }
    @keyframes confettiFall { 
      0% { transform: translateY(-30px) scale(0.5) rotate(0deg); opacity: 0.9; } 
      100% { transform: translateY(110vh) scale(1.2) rotate(360deg); opacity: 0; } 
    }
    @keyframes heartDrift { 
      0% { transform: translateY(110vh) scale(0.8); opacity: 0; } 
      20% { opacity: 0.8; } 
      80% { opacity: 0.6; } 
      100% { transform: translateY(-50px) scale(1.1); opacity: 0; } 
    }
    @keyframes sparkle { 
      0%, 100% { opacity: 0.05; transform: scale(0.4) rotate(0deg); } 
      50% { opacity: 1; transform: scale(1.5) rotate(180deg); } 
    }
    @keyframes twinkle { 
      0%, 100% { opacity: 0.1; transform: scale(0.7); } 
      50% { opacity: 0.9; transform: scale(1.4); } 
    }
    @keyframes floatSlow { 
      0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; } 
      50% { transform: translateY(-40px) rotate(180deg); opacity: 0.5; } 
      100% { transform: translateY(0px) rotate(360deg); opacity: 0.2; } 
    }
    @keyframes heartFloat {
      0% { opacity: 0; transform: translateY(0) scale(0.5); }
      50% { opacity: 1; transform: translateY(-120px) scale(1.2); }
      100% { opacity: 0; transform: translateY(-240px) scale(0.8); }
    }
    @keyframes goldShimmer { 
      0% { background-position: 0%; } 
      100% { background-position: 200%; } 
    }
    @keyframes shimmer { 
      0%, 100% { opacity: 0.3; } 
      50% { opacity: 0.7; } 
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

        const existing = document.getElementById("lovebites-animations");
        if (existing) existing.remove();
        document.head.appendChild(style);

        return () => {
            const el = document.getElementById("lovebites-animations");
            if (el) el.remove();
        };
    }, []);

    const [displayedText, setDisplayedText] = useState("");
    const [showFullMessage, setShowFullMessage] = useState(false);
    const [bursts, setBursts] = useState([]);

    useEffect(() => {
        const words = data.generatedMessage.split(" ");
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => words.slice(0, i + 1).join(" "));
            i++;
            if (i >= words.length) {
                clearInterval(interval);
                setShowFullMessage(true);
            }
        }, 60);
        return () => clearInterval(interval);
    }, [data.generatedMessage]);

    const triggerHeartBurst = () => {
        const newBursts = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            tx: (Math.random() - 0.5) * 160,
            ty: (Math.random() - 0.5) * 160
        }));
        setBursts([...bursts, ...newBursts]);
        setTimeout(() => {
            setBursts([]);
        }, 1000);
    };

    const getPlaceholderGradient = (idx) => {
        const gradients = [
            'linear-gradient(135deg, #3d0a1a, #7a1a30)', // Romantic
            'linear-gradient(135deg, #1a0010, #3a0020)', // Deep
            'linear-gradient(135deg, #2d0015, #5a0030)', // Fun
            'linear-gradient(135deg, #1a0008, #3d0010)', // Default
            'linear-gradient(135deg, #2d000c, #3d0015)'  // Alt
        ];
        return gradients[idx % gradients.length];
    };

    const moodSubtitles = {
        "Deeply in Love": "I feel completely in love with you",
        "Devoted": "My heart belongs to you",
        "Obsessed with You": "I can't get enough of you",
        "Adoring": "I adore everything about you",
        "Affectionate": "I feel warm and affectionate toward you",
        "Grateful": "I'm thankful to have you in my life",
        "Forever Yours": "I want a lifetime with you",
        "Missing You": "I wish you were here"
    };

    const dividerStyle = {
        textAlign: 'center', fontSize: '12px', letterSpacing: '4px',
        color: 'rgba(196,48,79,0.5)', fontFamily: THEME.sans,
        textTransform: 'uppercase', margin: '0 0 32px'
    };

    const quoteStyle = {
        textAlign: 'center', fontFamily: 'Georgia, serif', fontStyle: 'italic',
        fontSize: '14px', color: 'rgba(255,248,240,0.25)', margin: '0 auto 32px',
        maxWidth: '400px', lineHeight: '1.8'
    };

    const sideTextStyle = (side) => ({
        position: 'fixed',
        [side]: '20px',
        top: '50%',
        transform: `translateY(-50%) rotate(${side === 'left' ? '-90deg' : '90deg'})`,
        fontSize: '11px',
        letterSpacing: '8px',
        color: 'rgba(155,26,58,0.2)',
        fontFamily: THEME.sans,
        pointerEvents: 'none',
        zIndex: 5
    });

    return (
        <div style={{
            minHeight: '100vh', background: THEME.bg, color: THEME.cream,
            fontFamily: THEME.sans, padding: '60px 20px', overflowX: 'hidden',
            position: 'relative'
        }}>
            <AnimatedBackground occasion={data.occasion} />
            <NoiseOverlay />

            {/* Vertical side text */}
            <div style={sideTextStyle('left')}>L O V E</div>
            <div style={sideTextStyle('right')}>B I T E S</div>

            <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

                {/* SECTION 1 — CINEMATIC HERO */}
                <div style={{
                    width: '100%', height: '420px', borderRadius: '20px',
                    overflow: 'hidden', position: 'relative', marginBottom: '48px',
                    background: 'linear-gradient(135deg, #2d0015, #1a0008, #3d0015)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(155,26,58,0.3)'
                }}>
                    {/* Shimmer overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(45deg, transparent 25%, rgba(155,26,58,0.15) 50%, transparent 75%)',
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 3s infinite',
                        pointerEvents: 'none'
                    }} />

                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
                        <h2 style={{
                            fontFamily: THEME.serif, color: THEME.roseRed, fontSize: '22px',
                            fontStyle: 'italic', margin: 0
                        }}>Your Cinematic Love Story</h2>
                        <p style={{
                            fontSize: '12px', color: 'rgba(255,248,240,0.5)', marginTop: '8px'
                        }}>Video crafted by our team · delivered with your Love Code</p>
                    </div>

                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '120px', background: 'linear-gradient(to top, rgba(13,0,5,0.9) 0%, transparent 100%)',
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                        padding: '24px'
                    }}>
                        <div style={{
                            background: 'rgba(155,26,58,0.2)',
                            border: '1px solid rgba(155,26,58,0.5)', borderRadius: '20px',
                            padding: '6px 16px', fontSize: '13px', color: THEME.roseRed
                        }}>
                            {data.occasion.emoji} {data.occasion.label}
                        </div>
                        <button style={{
                            background: 'transparent', border: `1px solid ${THEME.maroon}`,
                            color: THEME.maroon, borderRadius: '20px', padding: '6px 16px',
                            cursor: 'pointer', fontSize: '14px'
                        }}>
                            ▶ Play
                        </button>
                    </div>
                </div>

                {/* Decorative Text A */}
                <div style={dividerStyle}>✦ a love story, written just for you ✦</div>

                {/* SECTION 2 — AI LOVE MESSAGE */}
                <div style={{ maxWidth: '620px', margin: '0 auto 60px', textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid rgba(155,26,58,0.2)', marginBottom: '32px' }} />
                    <div style={{
                        color: THEME.roseRed, fontFamily: THEME.serif, fontStyle: 'italic',
                        fontSize: '13px', marginBottom: '20px'
                    }}>
                        A message from {data.senderName}
                    </div>
                    <div style={{
                        fontSize: '80px', color: 'rgba(155,26,58,0.15)', lineHeight: '0.5',
                        fontFamily: THEME.serif, textAlign: 'left', marginBottom: '10px'
                    }}>“</div>
                    <p style={{
                        fontSize: '17px', lineHeight: '2', color: 'rgba(255,248,240,0.85)',
                        fontFamily: THEME.serif, fontStyle: 'italic', margin: 0,
                        minHeight: '100px'
                    }}>
                        {displayedText}
                    </p>
                    {showFullMessage && (
                        <div style={{
                            textAlign: 'right', color: THEME.roseRed, marginTop: '20px',
                            fontFamily: THEME.serif, fontSize: '16px'
                        }}>
                            — {data.senderName}
                        </div>
                    )}
                </div>

                {/* Decorative Text B */}
                <div style={quoteStyle}>"Every photo holds a memory. Every memory holds your heart."</div>

                {/* SECTION 3 — PHOTO MEMORY FRAMES */}
                <div style={{ marginBottom: '60px' }}>
                    <h3 style={{
                        fontFamily: THEME.serif, color: THEME.roseRed, fontSize: '20px',
                        marginBottom: '24px'
                    }}>💫 Your Precious Moments</h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: 'auto auto auto',
                        gap: '12px'
                    }}>
                        {data.photos.map((photo, i) => {
                            const isLarge = i === 2;
                            return (
                                <div key={i} style={{
                                    gridColumn: isLarge ? '1 / span 2' : 'auto',
                                    gridRow: isLarge ? '2' : (i < 2 ? '1' : '3'),
                                    height: isLarge ? '280px' : '180px',
                                    borderRadius: '14px', overflow: 'hidden', position: 'relative',
                                    background: photo ? 'none' : getPlaceholderGradient(i),
                                    boxShadow: 'inset 0 0 0 2px rgba(155,26,58,0.4)',
                                    border: '1px solid rgba(155,26,58,0.2)'
                                }}>
                                    {photo ? (
                                        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', opacity: 0.2
                                        }}>
                                            ✨
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)'
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Decorative Text C */}
                <div style={dividerStyle}>✦ the feelings that made this ✦</div>

                {/* SECTION 4 — MOOD CARDS */}
                <div style={{ marginBottom: '60px' }}>
                    <h3 style={{
                        fontFamily: THEME.serif, color: THEME.roseRed, fontSize: '20px',
                        marginBottom: '20px'
                    }}>💗 The Feelings Behind This</h3>

                    <div style={{
                        display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px',
                        msOverflowStyle: 'none', scrollbarWidth: 'none'
                    }}>
                        {data.selectedMoods.map((mood, idx) => (
                            <div key={idx} style={{
                                minWidth: '200px', height: '140px', flexShrink: 0,
                                background: 'linear-gradient(135deg, rgba(155,26,58,0.08), rgba(196,48,79,0.06))',
                                border: '1px solid rgba(155,26,58,0.4)', borderRadius: '16px',
                                padding: '20px'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{mood.emoji}</div>
                                <div style={{ color: THEME.roseRed, fontFamily: THEME.serif, fontSize: '15px', fontWeight: '600' }}>
                                    {mood.label}
                                </div>
                                <div style={{ color: 'rgba(255,248,240,0.4)', fontFamily: THEME.sans, fontSize: '11px', fontStyle: 'italic', marginTop: '4px' }}>
                                    {moodSubtitles[mood.label] || ""}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Text D */}
                <div style={quoteStyle}>"Some feelings are too big for words. But we tried anyway."</div>

                {/* SECTION 5 — HEART REACTION */}
                <div style={{ textAlign: 'center', margin: '48px 0', position: 'relative' }}>
                    <p style={{
                        fontFamily: THEME.serif, fontStyle: 'italic',
                        color: 'rgba(255,248,240,0.5)', fontSize: '15px'
                    }}>
                        Did this touch your heart?
                    </p>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                            onClick={triggerHeartBurst}
                            style={{
                                fontSize: '48px', cursor: 'pointer', border: 'none',
                                background: 'transparent', margin: '8px 0'
                            }}
                        >
                            ❤️
                        </button>
                        {bursts.map(b => (
                            <div key={b.id} style={{
                                position: 'absolute', top: '50%', left: '50%',
                                fontSize: '20px', pointerEvents: 'none',
                                '--tx': `${b.tx}px`, '--ty': `${b.ty}px`,
                                animation: 'heartBurst 0.8s ease-out forwards'
                            }}>
                                ❤️
                            </div>
                        ))}
                    </div>
                    {bursts.length > 0 && (
                        <div style={{ color: THEME.roseRed, fontFamily: THEME.serif, fontStyle: 'italic', fontSize: '14px' }}>
                            💗 Love sent back!
                        </div>
                    )}
                </div>

                {/* SECTION 6 — CONFIRM & PAY */}
                <div style={{ textAlign: 'center', marginTop: '56px', paddingBottom: '80px' }}>
                    <div style={{ borderTop: '1px solid rgba(155,26,58,0.15)', marginBottom: '40px' }} />

                    <div style={{
                        background: 'rgba(155,26,58,0.06)', border: '1px solid rgba(155,26,58,0.15)',
                        borderRadius: '16px', padding: '24px', maxWidth: '400px', margin: '0 auto 28px'
                    }}>
                        <div style={{ color: THEME.roseRed, fontFamily: THEME.serif, fontSize: '16px' }}>
                            True Love Plan · ₹99 one-time
                        </div>
                        <div style={{ color: 'rgba(255,248,240,0.5)', fontFamily: THEME.sans, fontSize: '12px', opacity: 0.5, marginTop: '10px' }}>
                            3 Love Code creations · AI message · 5 framed photos · Cinematic video · Secret unlock
                        </div>
                    </div>

                    <button style={{
                        background: 'linear-gradient(135deg, #7a1030, #c4304f, #7a1030)',
                        backgroundSize: '200% auto',
                        animation: 'goldShimmer 3s linear infinite',
                        color: THEME.cream, fontFamily: THEME.serif, fontStyle: 'italic',
                        fontSize: '18px', padding: '20px 64px', borderRadius: '50px',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(155,26,58,0.4)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 16px 48px rgba(155,26,58,0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,26,58,0.4)';
                        }}
                    >
                        Confirm & Pay ₹99 💳
                    </button>
                </div>

            </div>
        </div>
    );
};

const LoveBites99 = ({ data = mockData }) => {
    const [screen, setScreen] = useState("lock"); // "lock" | "preview"

    return (
        <>
            {screen === "lock" ? (
                <LockScreen data={data} onUnlock={() => setScreen("preview")} />
            ) : (
                <PreviewScreen data={data} />
            )}
        </>
    );
};

export default LoveBites99;
