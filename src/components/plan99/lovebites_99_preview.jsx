import React, { useState, useEffect, useRef, useMemo } from "react";
import LoveBitesLogo from "@/components/LoveBitesLogo";
import OccasionBackground from "@/components/OccasionBackground";

// --- GOOGLE FONTS LOADING ---
const loadFonts = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById("lb-fonts")) return;
    const link = document.createElement("link");
    link.id = "lb-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@400;600;700&family=Parisienne&family=Allura&display=swap";
    document.head.appendChild(link);
};

// --- OCCASION CONFIG ---
const OCCASION_CONFIG = {
    anniversary: {
        particles: ["🌹", "🌸", "✨", "💕", "🌺"],
        colors: { primary: "#c4304f", secondary: "#9b1a3a", glow: "rgba(196,48,79,0.4)" },
        bg: 'linear-gradient(160deg, #0d0008 0%, #1a0010 40%, #0d0005 100%)',
        openingText: "Celebrating another year of beautiful chapters...",
        floatDir: "up",
        heroQuote: "Every year with you feels like the beginning of forever.",
        heroSub: "Some love stories never stop being written.",
        closingQuote: "You are every reason, every hope, and every dream I've ever had.",
        clickEmoji: "🌹",
        envelopeColor: "#7a1a2e"
    },
    birthday: {
        particles: ["✨", "🎉", "⭐", "💫", "🎊"],
        colors: { primary: "#e8b84b", secondary: "#7a5a0a", glow: "rgba(232,184,75,0.4)" },
        bg: 'linear-gradient(160deg, #0d0a00 0%, #1a1400 40%, #0d0700 100%)',
        openingText: "A spectacular celebration for someone special...",
        floatDir: "down",
        heroQuote: "On the day you were born, the world got a little brighter.",
        heroSub: "And my world has never been the same.",
        closingQuote: "Here's to you — the one who makes every day worth celebrating.",
        clickEmoji: "🎉",
        envelopeColor: "#7a5a0a"
    },
    valentine: {
        particles: ["❤️", "💕", "💗", "💝", "💖"],
        colors: { primary: "#ff4d6d", secondary: "#8a0a1e", glow: "rgba(255,77,109,0.4)" },
        bg: 'linear-gradient(160deg, #0d0002 0%, #1a0004 40%, #0d0001 100%)',
        openingText: "A message from a heart that beats for you...",
        floatDir: "up",
        heroQuote: "If I had a flower for every time I thought of you, I could walk forever in my garden.",
        heroSub: "Happy Valentine's Day.",
        closingQuote: "You are the poem I never knew how to write.",
        clickEmoji: "💖",
        envelopeColor: "#8a0a1e"
    },
    just_because: {
        particles: ["🌸", "🌷", "✿", "💐", "🌼"],
        colors: { primary: "#e05070", secondary: "#6a0a2e", glow: "rgba(224,80,112,0.4)" },
        bg: 'linear-gradient(160deg, #0d0005 0%, #1a000a 40%, #0d0003 100%)',
        openingText: "No specific reason, just felt like loving you today...",
        floatDir: "down",
        heroQuote: "Not every reason needs a reason. I love you — just because.",
        heroSub: "Some things are simply felt.",
        closingQuote: "You are my favourite thought on every ordinary day.",
        clickEmoji: "🌸",
        envelopeColor: "#6a0a2e"
    },
    proposal: {
        particles: ["💍", "✨", "💫", "⭐", "🌟"],
        colors: { primary: "#d4af7a", secondary: "#6a5a0a", glow: "rgba(212,175,122,0.4)" },
        bg: 'linear-gradient(160deg, #0d0800 0%, #1a1000 40%, #0d0500 100%)',
        openingText: "Before the stars align for us...",
        floatDir: "up",
        heroQuote: "In all the world, there is no heart for me like yours.",
        heroSub: "Will you say yes?",
        closingQuote: "I choose you. And I'll choose you over and over, without pause, without doubt.",
        clickEmoji: "💍",
        envelopeColor: "#6a5a0a"
    },
    long_distance: {
        particles: ["✈️", "🌟", "💫", "⭐", "🌙"],
        colors: { primary: "#7eb8f7", secondary: "#0a2a5a", glow: "rgba(126,184,247,0.4)" },
        bg: 'linear-gradient(160deg, #00040d 0%, #000a1a 40%, #00020d 100%)',
        openingText: "Bridging the miles between our hearts...",
        floatDir: "down",
        heroQuote: "Distance means so little when someone means so much.",
        heroSub: "Across every mile, I find my way back to you.",
        closingQuote: "One day the miles between us will just be a memory of how strong we were.",
        clickEmoji: "✈️",
        envelopeColor: "#0a2a5a"
    }
};

// --- MOCK DATA ---
const mockData = {
    recipientName: "Ameera",
    senderName: "Zain",
    selectedMoods: [
        { emoji: "❤️", label: "Deeply in Love" },
        { emoji: "💗", label: "Devoted" },
        { emoji: "😍", label: "Obsessed with You" }
    ],
    occasion: { id: "anniversary", emoji: "💑", label: "Anniversary" },
    generatedMessage: "My dearest Ameera,\n\nFrom the moment you came into my life, everything started to feel warmer. The world became a little more beautiful, a little more meaningful — simply because you exist in it.\n\nI find myself grateful for every small moment we've shared. The laughs, the silences, the glances that said more than words ever could. You are not just someone I love — you are someone I choose, every single day.\n\nThis isn't just a message. It's a piece of my heart, wrapped in words, sent your way.\n\nForever yours,\nZain",
    photos: [
        "https://images.unsplash.com/photo-1518199266791-739949406b24?w=800&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
        "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80",
        "https://images.unsplash.com/photo-1516589174184-c685ca33d280?w=800&q=80",
        "https://images.unsplash.com/photo-1522673607200-1648482ce486?w=800&q=80"
    ],
    photoMemories: ["Where it all began...", "A moment I'll never forget.", "This day felt like magic.", "Our favourite place.", "I wish we could go back."],
    videoPhotos: []
};

// --- HOOKS ---
const useScrollReveal = (delay = 0) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);
    return visible;
};

// --- MAIN COMPONENT ---
export default function Preview99({ data, tier, onConfirm, isSubmitting }) {
    // Deep merge or fallback logic to ensure we always have valid arrays and strings
    const resolvedData = React.useMemo(() => {
        if (!data) return mockData;
        
        // Ensure photos is an array of non-null values
        const rawPhotos = Array.isArray(data.photos) ? data.photos : [];
        const validPhotos = rawPhotos.filter(p => p !== null && p !== '');
        
        return {
            ...mockData,
            ...data,
            photos: validPhotos.length > 0 ? validPhotos : mockData.photos,
            recipientName: data.recipientName || mockData.recipientName,
            senderName: data.senderName || mockData.senderName,
            generatedMessage: data.generatedMessage || mockData.generatedMessage,
            occasion: data.occasion || mockData.occasion,
            selectedMoods: data.selectedMoods || mockData.selectedMoods,
            photoMemories: Array.isArray(data.photoMemories) ? data.photoMemories : mockData.photoMemories
        };
    }, [data]);

    const occId = resolvedData.occasion?.id || "anniversary";
    const config = OCCASION_CONFIG[occId] || OCCASION_CONFIG.anniversary;

    // Scroll constants (defined before use)
    const VH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const TOP_H = 44;       // torn edge height
    const FOLD_H = 140;     // fold height (increased from 120)
    const SCROLL_DIST = 2800; // px to fully unfold
    const BODY_MAX = VH - TOP_H - FOLD_H;

    const [phase, setPhase] = useState("opening"); // opening | preview
    const [letterState, setLetterState] = useState("closed"); // closed | open
    const [scrollProgress, setScrollProgress] = useState(0);
    const [foldHeight, setFoldHeight] = useState(FOLD_H);
    const [bodyHeight, setBodyHeight] = useState(0);
    const [showScrollHint, setShowScrollHint] = useState(true);
    const scrollInnerRef = useRef(null);
    const scrollBodyRef = useRef(null);
    const contentTravelRef = useRef(1200); // Default, will be calculated dynamically
    const [logoBurst, setLogoBurst] = useState([]);
    const [clickBurst, setClickBurst] = useState([]);
    const [typedText, setTypedText] = useState("");
    const [heroBurst, setHeroBurst] = useState([]);
    const [heroClicked, setHeroClicked] = useState(false);
    
    // Mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    useEffect(() => {
        const handle = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, []);
    
    // Scroll-driven parchment animation
    useEffect(() => {
        if (letterState !== "open") return;
        
        // Initialize body height
        setBodyHeight(BODY_MAX);
        
        // Calculate content travel dynamically
        const calculateContentTravel = () => {
            if (scrollInnerRef.current) {
                const totalH = scrollInnerRef.current.scrollHeight;
                const visibleH = BODY_MAX;
                contentTravelRef.current = Math.max(0, totalH - visibleH + 80);
            }
        };
        
        // Make page tall so window is scrollable
        document.body.style.height = `${window.innerHeight + SCROLL_DIST}px`;
        document.body.style.overflow = "auto";
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Calculate content travel after a short delay to ensure content is rendered
        setTimeout(calculateContentTravel, 100);
        
        const handleScroll = () => {
            const p = Math.min(window.scrollY / SCROLL_DIST, 1);
            setScrollProgress(p);
            
            // 1. Fold: fast at start (gone by p=0.5)
            const foldP = Math.min(p / 0.5, 1);
            const foldH = Math.round(FOLD_H * (1 - foldP));
            setFoldHeight(foldH);
            
            // 2. Body grows to fill fold gap
            const bodyH = BODY_MAX + (FOLD_H - foldH);
            setBodyHeight(bodyH);
            
            // 3. Content: starts slow, then travels full distance
            const contentP = Math.max(0, (p - 0.1) / 0.9);
            const offset = contentP * contentTravelRef.current;
            if (scrollInnerRef.current) {
                scrollInnerRef.current.style.transform = `translateY(-${offset}px)`;
            }
            
            // Hide scroll hint after first scroll
            if (p > 0.01 && showScrollHint) {
                setShowScrollHint(false);
            }
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            // Restore body on close
            document.body.style.height = "";
            document.body.style.overflow = "";
        };
    }, [letterState, showScrollHint]);

    // --- Keyframes & Fonts Injection ---
    useEffect(() => {
        loadFonts();
        const style = document.createElement("style");
        style.id = "LB-Premium-Styles";
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes floatEmoji { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes heartbeat {
                0%,100% { transform: scale(1); }
                14% { transform: scale(1.3); }
                28% { transform: scale(1); }
                42% { transform: scale(1.2); }
                70% { transform: scale(1); }
            }
            @keyframes burstFly {
                0% { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); }
                100% { opacity: 0; transform: translate(var(--bx),var(--by)) scale(0.4) rotate(var(--br)); }
            }
            @keyframes envelopeFloat {
                0%,100% { transform: translateY(0) rotate(-1deg); }
                50% { transform: translateY(-12px) rotate(1deg); }
            }
            @keyframes envelopeShake {
                0%,100% { transform: rotate(0); }
                20% { transform: rotate(-3deg); }
                40% { transform: rotate(3deg); }
                60% { transform: rotate(-2deg); }
                80% { transform: rotate(2deg); }
            }
            @keyframes letterUnfold {
                0% { transform: perspective(800px) rotateX(-90deg) translateY(-40px); opacity: 0; }
                60% { transform: perspective(800px) rotateX(8deg); opacity: 0.9; }
                100% { transform: perspective(800px) rotateX(0deg); opacity: 1; }
            }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
            @keyframes shimmerPay { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
            @keyframes pulseGlow { 
                0%,100% { box-shadow: 0 8px 40px rgba(155,26,58,0.5); }
                50% { box-shadow: 0 8px 60px rgba(196,48,79,0.7); }
            }
            @keyframes slideIn { from { transform: translateX(var(--sx)) opacity: 0; } to { transform: translateX(0) opacity: 1; } }
            
            /* Hero Emoji Animations */
            @keyframes heroRose {
                0%{transform:scale(1) rotate(0deg)}
                30%{transform:scale(2.5) rotate(180deg)}
                65%{transform:scale(1.8) rotate(300deg)}
                100%{transform:scale(1) rotate(360deg)}
            }
            @keyframes heroCake {
                0%{transform:scale(1) translateY(0)}
                20%{transform:scale(1.6) translateY(-20px)}
                40%{transform:scale(2) translateY(-30px)}
                65%{transform:scale(1.7) translateY(-15px)}
                85%{transform:scale(1.3) translateY(-5px)}
                100%{transform:scale(1) translateY(0)}
            }
            @keyframes heroHeart {
                0%,100%{transform:scale(1)}
                10%{transform:scale(2.2)}
                20%{transform:scale(1.5)}
                35%{transform:scale(2)}
                50%{transform:scale(1.4)}
                65%{transform:scale(1.8)}
                80%{transform:scale(1.2)}
            }
            @keyframes heroFlower {
                0%{transform:scale(1) rotate(0deg)}
                50%{transform:scale(2.2) rotate(180deg)}
                100%{transform:scale(1) rotate(360deg)}
            }
            @keyframes heroRing {
                0%{transform:scale(1) rotate(0deg)}
                25%{transform:scale(2.4) rotate(-20deg)}
                50%{transform:scale(2) rotate(10deg)}
                75%{transform:scale(2.2) rotate(-5deg)}
                100%{transform:scale(1) rotate(0deg)}
            }
            @keyframes heroPlane {
                0%{transform:scale(1) translate(0,0) rotate(0deg)}
                30%{transform:scale(1.5) translate(30px,-40px) rotate(-30deg)}
                60%{transform:scale(1.8) translate(60px,-60px) rotate(-45deg)}
                80%{transform:scale(1.4) translate(20px,-20px) rotate(-15deg)}
                100%{transform:scale(1) translate(0,0) rotate(0deg)}
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                40% {transform: translateY(-10px);}
                60% {transform: translateY(-5px);}
            }
            @keyframes letterSlideIn {
                from {
                    transform: translateY(40px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            /* Background Floating */
            @keyframes pFloatUp { 
                0% { transform: translateY(0) rotate(0); opacity: 0; }
                20% { opacity: 0.6; }
                80% { opacity: 0.4; }
                100% { transform: translateY(-800px) rotate(360deg); opacity: 0; }
            }
            @keyframes pFloatDown { 
                0% { transform: translateY(0) rotate(0); opacity: 0; }
                20% { opacity: 0.6; }
                80% { opacity: 0.4; }
                100% { transform: translateY(800px) rotate(-360deg); opacity: 0; }
            }
            
            .paper-crinkle { filter: url(#paperCrinkle); }
        `;
        document.head.appendChild(style);
        return () => {
            const el = document.getElementById("LB-Premium-Styles");
            if (el) el.remove();
        };
    }, []);

    // --- Typing Animation ---
    useEffect(() => {
        if (phase === "opening") {
            let i = 0;
            const text = config.openingText;
            const t = setInterval(() => {
                setTypedText(text.slice(0, i + 1));
                i++;
                if (i >= text.length) {
                    clearInterval(t);
                    setTimeout(() => setPhase("preview"), 1600);
                }
            }, 50);
            return () => clearInterval(t);
        }
    }, [phase, config.openingText]);

    // --- Handlers ---
    const handleLogoBurst = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const particles = Array.from({ length: 28 }, (_, i) => {
            const angle = (i / 28) * Math.PI * 2;
            const dist = 80 + Math.random() * 120;
            return {
                id: Date.now() + i,
                bx: `${Math.cos(angle) * dist}px`,
                by: `${Math.sin(angle) * dist - 50}px`,
                br: `${Math.random() * 360}deg`,
                left: `${centerX}px`,
                top: `${centerY}px`,
                emoji: config.clickEmoji
            };
        });
        setLogoBurst(particles);
        setTimeout(() => setLogoBurst([]), 1400);
    };

    const handlePhotoBurst = (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const particles = Array.from({ length: 20 }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 80;
            return {
                id: Date.now() + i,
                bx: `${Math.cos(angle) * dist}px`,
                by: `${Math.sin(angle) * dist - 40}px`,
                br: `${Math.random() * 360}deg`,
                left: `${x}px`,
                top: `${y}px`,
                emoji: config.clickEmoji
            };
        });
        setClickBurst(prev => [...prev.slice(-40), ...particles]);
        setTimeout(() => setClickBurst(prev => prev.filter(p => !particles.includes(p))), 1200);
    };

    const handleOpenLetter = () => {
        setLetterState("open");
        // Scroll to top of letter screen
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };
    
    const handleCloseLetter = () => {
        setLetterState("closed");
        setScrollProgress(0);
        setFoldHeight(FOLD_H);
        setBodyHeight(BODY_MAX);
        setShowScrollHint(true);
        
        // Reset content transform
        if (scrollInnerRef.current) {
            scrollInnerRef.current.style.transform = "translateY(0)";
        }
        
        // Restore body styles
        document.body.style.height = "";
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Scroll back to envelope section
        const envelopeSection = document.getElementById("envelope-section");
        if (envelopeSection) {
            envelopeSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleHeroClick = (e) => {
        if (heroClicked) return;
        setHeroClicked(true);
        
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        
        const burst = Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * 360 + Math.random() * 22;
            const dist = 70 + Math.random() * 100;
            const rad = (angle * Math.PI) / 180;
            return {
                id: `hero-${i}-${Date.now()}`,
                x: cx, y: cy,
                bx: Math.cos(rad) * dist,
                by: Math.sin(rad) * dist - (50 + Math.random() * 60),
                br: (Math.random() - 0.5) * 720,
                size: 18 + Math.random() * 22,
                delay: Math.random() * 0.2,
            };
        });
        
        setHeroBurst(burst);
        setTimeout(() => {
            setHeroClicked(false);
            setHeroBurst([]);
        }, 1200);
    };

    // --- Sub-components & Helpers ---
    const getPolaroidLabel = (index, occasion) => {
        const year = new Date().getFullYear();
        
        const labels = {
            anniversary: [
                { text: "Forever", emoji: "🌹", year },
                { text: "Always & Always", emoji: "💕", year },
                { text: "Our Story", emoji: "✨", year },
                { text: "Together", emoji: "🌸", year },
                { text: "Endless Love", emoji: "❤️", year },
            ],
            birthday: [
                { text: "Birthday Magic", emoji: "🎂", year },
                { text: "Another Year Loved", emoji: "✨", year },
                { text: "Joy", emoji: "🎉", year },
                { text: "Celebrate You", emoji: "⭐", year },
                { text: "Sunshine", emoji: "🌟", year },
            ],
            valentine: [
                { text: "My Valentine", emoji: "💝", year },
                { text: "With Love", emoji: "❤️", year },
                { text: "Heart & Soul", emoji: "💗", year },
                { text: "Only You", emoji: "💖", year },
                { text: "Forever Mine", emoji: "💕", year },
            ],
            just_because: [
                { text: "Just Because", emoji: "🌸", year },
                { text: "Simply Love", emoji: "🌷", year },
                { text: "You & Me", emoji: "💐", year },
                { text: "Every Day", emoji: "🌼", year },
                { text: "Thinking of You", emoji: "✿", year },
            ],
            proposal: [
                { text: "Will You?", emoji: "💍", year },
                { text: "Say Yes", emoji: "✨", year },
                { text: "Our Beginning", emoji: "💫", year },
                { text: "Forever Starts Now", emoji: "⭐", year },
                { text: "Always", emoji: "🌟", year },
            ],
            long_distance: [
                { text: "Across Miles", emoji: "✈️", year },
                { text: "Worth Every Mile", emoji: "🌙", year },
                { text: "Near in Heart", emoji: "⭐", year },
                { text: "Always Close", emoji: "💫", year },
                { text: "Until We Meet", emoji: "🌟", year },
            ],
        };
    
        const occasionLabels = labels[occasion] 
            || labels.anniversary;
        return occasionLabels[index % occasionLabels.length];
    };
    
    const DEFAULT_MEMORIES_BY_INDEX = [
        // index 0
        [
            "The moment I knew you were the one.",
            "Every beginning has your face in it.",
            "This is where our story starts.",
            "The day everything changed for me.",
            "I will remember this moment forever.",
        ],
        // index 1
        [
            "You make every ordinary day feel magical.",
            "I love the way you look at the world.",
            "Every moment with you is a gift.",
            "Time stands still when I'm with you.",
            "You are my favourite distraction.",
        ],
        // index 2
        [
            "I never want to forget this feeling.",
            "Right here, right now — this is enough.",
            "Some moments deserve to last forever.",
            "My heart was full that day.",
            "This memory lives in me like music.",
        ],
        // index 3
        [
            "Our favourite place in the whole world.",
            "I'd go anywhere, as long as it's with you.",
            "The world is better when you're in it.",
            "Every place becomes home with you.",
            "Wandering together — my favourite thing.",
        ],
        // index 4
        [
            "I wish we could relive this day forever.",
            "If I could bottle a moment, it would be this.",
            "The best days are the ones with you.",
            "I look at this and my heart gets quiet.",
            "Some days you just know you are happy.",
        ],
    ];

    const getDefaultMemory = (moods, index) => {
        const pool = DEFAULT_MEMORIES_BY_INDEX[index] 
            || DEFAULT_MEMORIES_BY_INDEX[0];
        
        // Use mood label to pick consistently 
        // (not random — same mood always picks same quote)
        const moodSeed = moods && moods.length > 0 && moods[0]?.label
            ? moods[0].label.length % pool.length 
            : 0;
        
        return pool[moodSeed];
    };

    const getMoodQuote = (moods) => {
        const moodPool = {
            "Deeply in Love": "I feel completely in love with you.",
            "Devoted": "My heart belongs to you, always.",
            "Obsessed with You": "I can't get enough of you.",
            "Adoring": "I adore everything about you.",
            "Affectionate": "You make me feel so warm and safe.",
            "Grateful": "I'm so thankful to have you in my life.",
            "Forever Yours": "I want a lifetime with you.",
            "Missing You": "I wish you were here right now."
        };
        const activeLabel = moods && moods.length > 0 ? moods[0]?.label || "Deeply in Love" : "Deeply in Love";
        return moodPool[activeLabel] || "Every moment with you is a gift.";
    };

    const Divider = () => (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "24px", margin: "80px auto", maxWidth: "340px",
            color: "rgba(212,175,122,0.4)"
        }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, currentColor, transparent)" }} />
            <div style={{ fontSize: "12px", letterSpacing: "4px" }}>✦ · · · ✦</div>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, currentColor, transparent)" }} />
        </div>
    );

    const FloatingParticles = () => (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
            {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{
                    position: "absolute",
                    left: `${Math.random() * 100}%`,
                    top: config.floatDir === "up" ? "100%" : "-10%",
                    fontSize: `${16 + Math.random() * 24}px`,
                    opacity: 0.15,
                    animation: `${config.floatDir === "up" ? "pFloatUp" : "pFloatDown"} ${8 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${Math.random() * 10}s`
                }}>
                    {config.particles[i % config.particles.length]}
                </div>
            ))}
        </div>
    );

    // --- OCCASION BACKGROUND FUNCTION ---
    const getOccasionBackground = (occasion) => {
        switch (occasion) {
            case "anniversary":
                return `radial-gradient(ellipse at 50% 20%, rgba(155,26,58,0.22) 0%, transparent 55%), linear-gradient(160deg,#0d0008,#1a0010,#0d0005)`;
            case "birthday":
                return `radial-gradient(ellipse at 50% 0%, rgba(200,140,40,0.18) 0%, transparent 50%), linear-gradient(160deg,#0a0508,#150a02,#080404)`;
            case "valentines":
                return `radial-gradient(ellipse at 50% 30%, rgba(220,40,80,0.16) 0%, transparent 55%), linear-gradient(160deg,#0d0005,#180008,#0a0003)`;
            case "proposal":
                return `radial-gradient(ellipse at 50% 50%, rgba(212,175,122,0.1) 0%, transparent 55%), linear-gradient(160deg,#040208,#080410,#030108)`;
            case "just_because":
                return `radial-gradient(ellipse at 40% 40%, rgba(180,80,120,0.13) 0%, transparent 55%), linear-gradient(160deg,#0a0208,#150610,#080205)`;
            case "long_distance":
                return `radial-gradient(ellipse at 50% 0%, rgba(100,150,220,0.1) 0%, transparent 50%), linear-gradient(160deg,#02050e,#050a18,#020408)`;
            default:
                return config.bg;
        }
    };

    // --- RENDER ---
    if (phase === "opening") {
        return (
            <div 
                onClick={() => setPhase("preview")}
                style={{
                    height: "100vh", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", background: config.bg,
                    color: "#fff", cursor: "pointer", position: "relative", overflow: "hidden"
                }}
            >
                <div style={{ fontSize: "72px", animation: "floatEmoji 3s ease-in-out infinite", marginBottom: "32px" }}>💌</div>
                <div style={{ 
                    fontSize: "13px", fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: "6px",
                    textTransform: "uppercase", color: config.colors.primary, marginBottom: "20px"
                }}>
                    FOR {resolvedData.recipientName.toUpperCase()}
                </div>
                <div style={{ 
                    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(20px,4vw,34px)",
                    textAlign: "center", maxWidth: "80%", lineHeight: 1.6, color: "rgba(255,255,255,0.9)"
                }}>
                    {typedText}
                </div>
                <div style={{ 
                    fontSize: "clamp(36px,6vw,56px)", fontFamily: "Georgia, serif", fontStyle: "italic",
                    marginTop: "24px", color: config.colors.primary, animation: "fadeInUp 1s 0.5s ease both"
                }}>
                    {resolvedData.recipientName}
                </div>
                <div style={{ 
                    position: "fixed", bottom: "32px", fontSize: "11px", fontFamily: "sans-serif",
                    color: "rgba(255,255,255,0.18)", letterSpacing: "2px", animation: "blink 2s infinite"
                }}>
                    tap to skip →
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: "100vh", 
            background: getOccasionBackground(occId),
            color: "#fff",
            fontFamily: "'Helvetica Neue', sans-serif", position: "relative", overflowX: "hidden",
            padding: "40px 20px 120px"
        }}>
            <OccasionBackground occasion={occId} />
            <FloatingParticles />
            
            {/* Logo Burst Particles */}
            {logoBurst.map(p => (
                <div key={p.id} style={{
                    position: "fixed", left: p.left, top: p.top, fontSize: "20px",
                    zIndex: 200, pointerEvents: "none", '--bx': p.bx, '--by': p.by, '--br': p.br,
                    animation: "burstFly 1.1s forwards"
                }}>{p.emoji}</div>
            ))}
            
            {/* Click Burst Particles */}
            {clickBurst.map(p => (
                <div key={p.id} style={{
                    position: "fixed", left: p.left, top: p.top, fontSize: "20px",
                    zIndex: 200, pointerEvents: "none", '--bx': p.bx, '--by': p.by, '--br': p.br,
                    animation: "burstFly 1s forwards"
                }}>{p.emoji}</div>
            ))}

            {/* Vertical Side Text */}
            <div style={{
                position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%) rotate(-90deg)",
                fontSize: "9px", letterSpacing: "5px", color: "rgba(196,48,79,0.2)",
                fontFamily: "sans-serif", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10
            }}>
                love · devotion · forever · yours
            </div>
            <div style={{
                position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%) rotate(90deg)",
                fontSize: "9px", letterSpacing: "5px", color: "rgba(196,48,79,0.2)",
                fontFamily: "sans-serif", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 10
            }}>
                crafted with heart · lovebites
            </div>

            {/* HEADER */}
            <div style={{ 
                display: "flex", alignItems: "center", justifyContent: "center", 
                gap: "12px", marginBottom: "60px", position: "relative", zIndex: 10 
            }}>
                <div 
                    onClick={handleLogoBurst}
                    style={{ 
                        fontSize: "26px", cursor: "pointer", 
                        animation: "heartbeat 1.4s ease-in-out infinite" 
                    }}
                >
                    💗
                </div>
                <div style={{ fontSize: "22px", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold" }}>
                    LoveBites
                </div>
            </div>

            {/* HERO QUOTE */}
            <section style={{ 
                maxWidth: "860px", margin: "0 auto 100px", textAlign: "center",
                animation: "fadeInUp 1s 0.2s both"
            }}>
                <div
                    onClick={handleHeroClick}
                    style={{
                        fontSize: 48,
                        marginBottom: 28,
                        display: "inline-block",
                        cursor: "pointer",
                        animation: heroClicked 
                            ? {
                                anniversary: "heroRose 0.6s ease forwards",
                                birthday: "heroCake 0.7s ease forwards",
                                valentine: "heroHeart 0.8s ease forwards",
                                just_because: "heroFlower 0.6s ease forwards",
                                proposal: "heroRing 0.7s ease forwards",
                                long_distance: "heroPlane 0.8s ease forwards",
                            }[occId] || "heroRose 0.6s ease forwards"
                            : "floatEmoji 4s ease-in-out infinite",
                        userSelect: "none",
                    }}
                >{config.clickEmoji}</div>
                
                {/* Hero Burst Particles */}
                {heroBurst.map(b => (
                    <div key={b.id} style={{
                        position: "fixed",
                        left: b.x, top: b.y,
                        fontSize: b.size,
                        pointerEvents: "none",
                        zIndex: 9999,
                        animation: `burstFly 1s ${b.delay}s 
                            cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
                        "--bx": `${b.bx}px`,
                        "--by": `${b.by}px`,
                        "--br": `${b.br}deg`,
                        userSelect: "none",
                        transform: "translate(-50%, -50%)",
                    }}>{config.clickEmoji}</div>
                ))}
                
                <blockquote style={{ 
                    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(24px,4.5vw,42px)",
                    lineHeight: 1.4, margin: "0 auto 20px", maxWidth: "680px", color: "rgba(255,255,255,0.95)"
                }}>
                    "{config.heroQuote}"
                </blockquote>
                <div style={{ fontSize: "16px", color: config.colors.primary, letterSpacing: "2px", fontWeight: "500" }}>
                    {config.heroSub.toUpperCase()}
                </div>
            </section>

            <Divider />

            {/* POLAROID MEMORIES */}
            <section style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 5 }}>
                {resolvedData.photos.map((src, i) => {
                    const isLeft = i % 2 === 0;
                    const ROTATIONS = [-4.5, 3.2, -2.8, 4.0, -3.5];
                    const rotation = ROTATIONS[i % ROTATIONS.length];
                    const hoverRotation = rotation * 0.4;
                    const memoryText = resolvedData.photoMemories?.[i] || getDefaultMemory(resolvedData.selectedMoods, i);

                    return (
                        <div key={i} style={{
                            display: "flex", flexWrap: "wrap", alignItems: "center",
                            justifyContent: "center", gap: isMobile ? "20px" : "clamp(40px,7vw,80px)", marginBottom: isMobile ? 64 : 100,
                            flexDirection: isMobile ? "column" : (isLeft ? "row" : "row-reverse"),
                            animation: `slideIn 1.2s ${0.3 + i * 0.15}s both`,
                            '--sx': isLeft ? "-40px" : "40px"
                        }}>
                            {/* Polaroid */}
                            <div 
                                onClick={handlePhotoBurst}
                                style={{
                                    background: "#fdf6e3", padding: "12px 12px 32px 12px",
                                    borderRadius: "2px", 
                                    boxShadow: rotation < 0 
                                        ? "6px 20px 50px rgba(0,0,0,0.55), -2px 4px 20px rgba(0,0,0,0.3)"
                                        : "-6px 20px 50px rgba(0,0,0,0.55), 2px 4px 20px rgba(0,0,0,0.3)",
                                    transform: `rotate(${rotation}deg) translateY(0) scale(1)`, 
                                    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                    cursor: "pointer", position: "relative", width: "100%", 
                                    maxWidth: isMobile ? "340px" : "260px"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = `rotate(${hoverRotation}deg) translateY(-10px) scale(1.04)`;
                                    e.currentTarget.style.boxShadow = "0 30px 70px rgba(0,0,0,0.65), 0 0 30px " + config.colors.glow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `rotate(${rotation}deg) translateY(0) scale(1)`;
                                    e.currentTarget.style.boxShadow = rotation < 0 
                                        ? "6px 20px 50px rgba(0,0,0,0.55), -2px 4px 20px rgba(0,0,0,0.3)"
                                        : "-6px 20px 50px rgba(0,0,0,0.55), 2px 4px 20px rgba(0,0,0,0.3)";
                                }}
                            >
                                <div style={{ 
                                    position: "absolute", top: "-10px", left: "50%", transform: `translateX(-50%) rotate(${-rotation * 0.3}deg)`,
                                    width: "50px", height: "20px", background: "rgba(255,248,200,0.55)", zIndex: 2 
                                }} />
                                <div style={{ overflow: "hidden", aspectRatio: isMobile ? "4/3" : "1/1", width: "100%" }}>
                                    <img 
                                        src={src} alt="memory"
                                        style={{ 
                                            width: "100%", height: "100%", objectFit: "cover",
                                            filter: "sepia(0.15) contrast(1.05)", transition: "transform 0.6s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                    />
                                </div>
                                {/* New Dynamic Bottom Label */}
                                <div style={{
                                    paddingTop: 10,
                                    paddingBottom: 6,
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                }}>
                                    {/* Main label line — like "Forever • 2026" */}
                                    <p style={{
                                        margin: 0,
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: 11,
                                        color: "#4a3020",
                                        letterSpacing: 2,
                                        textTransform: "uppercase",
                                        fontWeight: "normal",
                                    }}>
                                        {(() => {
                                            const label = getPolaroidLabel(i, occId);
                                            return `${label.text} ${label.emoji} • ${label.year}`;
                                        })()}
                                    </p>
                                    {/* Thin decorative line below */}
                                    <div style={{
                                        width: 28,
                                        height: 1,
                                        background: "rgba(100,60,20,0.2)",
                                        marginTop: 4,
                                        borderRadius: 1,
                                    }} />
                                </div>
                            </div>

                            {/* Memory Text */}
                            <div style={{ 
                                maxWidth: isMobile ? "90vw" : "400px", textAlign: isMobile ? "center" : (isLeft ? "left" : "right"),
                                position: "relative", flex: "1 1 300px"
                            }}
                                 onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                                 onMouseLeave={e => e.currentTarget.style.opacity = "0.75"}
                            >
                                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{config.particles[i % config.particles.length]}</div>
                                <p style={{
                                    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: isMobile ? "clamp(15px, 4vw, 18px)" : "clamp(14px,2.2vw,20px)",
                                    lineHeight: 1.75, color: "rgba(255,248,240,0.85)", margin: 0,
                                    transition: "all 0.4s", opacity: 0.75, marginLeft: isMobile ? 0 : (isLeft ? 0 : "auto")
                                }}>
                                    {memoryText}
                                </p>
                                <div style={{ 
                                    height: "1px", width: "32px", marginTop: "20px",
                                    background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, ${config.colors.primary}, transparent)`,
                                    marginLeft: isMobile ? "auto" : (isLeft ? 0 : "auto"), marginRight: isMobile ? "auto" : "auto"
                                }} />
                                
                                {/* Mood and Occasion Emojis */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: isMobile ? "center" : (isLeft ? "flex-start" : "flex-end"),
                                    gap: 8,
                                    marginTop: 12,
                                    opacity: 0.5,
                                }}>
                                    {resolvedData.selectedMoods.slice(0,2).map((m,i) => (
                                        <span key={i} style={{
                                            fontSize: 16,
                                            animation: `floatEmoji ${3+i}s ease-in-out ${i*0.4}s infinite` 
                                        }}>{m.emoji}</span>
                                    ))}
                                    <span style={{
                                        fontSize: 16,
                                        animation: "floatEmoji 4s ease-in-out 0.8s infinite"
                                    }}>{config.clickEmoji}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            <Divider />

            {/* VINTAGE ENVELOPE + LETTER */}
            <section id="envelope-section" style={{ margin: "100px auto", position: "relative", zIndex: 10, display: "flex", justifyContent: "center" }}>
                {letterState === "closed" ? (
                    <div style={{ textAlign: "center" }}>
                        <div 
                            id="envelope-wrap"
                            onClick={handleOpenLetter}
                            style={{
                                width: "300px", height: "196px", position: "relative", cursor: "pointer",
                                background: "linear-gradient(160deg, #d4b896, #b8905a)", 
                                boxShadow: "0 24px 70px rgba(0,0,0,0.65)", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                animation: "envelopeFloat 4s ease-in-out infinite"
                            }}
                        >
                            {/* Top Flap */}
                            <div style={{
                                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                                background: "rgba(0,0,0,0.1)", clipPath: "polygon(0 0, 100% 0, 50% 58%)", zIndex: 2
                            }} />
                            {/* Stamp */}
                            <div style={{
                                position: "absolute", top: "12px", right: "12px", width: "36px", height: "44px",
                                background: "#fff8f0", padding: "4px", display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "16px", boxShadow: "1px 1px 3px rgba(0,0,0,0.2)"
                            }}>💗</div>
                            {/* Wax Seal */}
                            <div style={{
                                position: "absolute", top: "58%", left: "50%", transform: "translate(-50%, -50%)",
                                width: "52px", height: "52px", borderRadius: "50%",
                                background: `radial-gradient(circle at 30% 30%, ${config.colors.primary}, ${config.colors.secondary})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 3
                            }}>💌</div>
                            {/* Address Stubs */}
                            <div style={{ position: "absolute", bottom: "30px", left: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ width: "80px", height: "2px", background: "rgba(61,30,8,0.2)" }} />
                                <div style={{ width: "110px", height: "2px", background: "rgba(61,30,8,0.2)" }} />
                                <div style={{ width: "60px", height: "2px", background: "rgba(61,30,8,0.2)" }} />
                            </div>
                        </div>
                        <p style={{ marginTop: "24px", fontSize: "14px", fontStyle: "italic", color: config.colors.primary, animation: "blink 2s infinite" }}>
                            tap to open your letter ✦
                        </p>
                    </div>
                ) : (
                    <div style={{
                        position: "fixed",
                        inset: 0,           // top:0, left:0, right:0, bottom:0
                        zIndex: 9998,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "center",
                        background: "#0d0008",
                    }}>
                        {/* Parchment centered, full height */}
                        <div style={{
                            width: "100%",
                            maxWidth: 500,
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                            filter: "drop-shadow(0 0 40px rgba(0,0,0,0.9))",
                            animation: "letterSlideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards"
                        }}>
                                {/* 1. TORN TOP EDGE */}
                                <div style={{
                                    flexShrink: 0,
                                    height: TOP_H,
                                    background: "linear-gradient(180deg, #4a2a08 0%, #6e4420 25%, #a87035 55%, #c89050 80%, #d0a060 100%)",
                                    clipPath: `polygon(
                                        0% 55%, 1% 30%, 2.5% 48%, 4% 20%, 5.5% 38%, 7% 12%, 8.5% 32%, 10% 8%,
                                        11.5% 28%, 13% 5%, 14.5% 24%, 16% 2%, 17.5% 22%, 19% 0%, 20.5% 22%, 22% 4%,
                                        23.5% 26%, 25% 5%, 26.5% 24%, 28% 3%, 29.5% 25%, 31% 6%, 32.5% 23%, 34% 4%,
                                        35.5% 27%, 37% 8%, 38.5% 26%, 40% 5%, 41.5% 24%, 43% 7%, 44.5% 25%, 46% 3%,
                                        47.5% 28%, 49% 9%, 50.5% 27%, 52% 6%, 53.5% 26%, 55% 8%, 56.5% 24%, 58% 5%,
                                        59.5% 29%, 61% 10%, 62.5% 28%, 64% 7%, 65.5% 25%, 67% 9%, 68.5% 27%, 70% 6%,
                                        71.5% 30%, 73% 11%, 74.5% 29%, 76% 8%, 77.5% 26%, 79% 10%, 80.5% 28%, 82% 7%,
                                        83.5% 31%, 85% 12%, 86.5% 30%, 88% 9%, 89.5% 27%, 91% 11%, 92.5% 29%, 94% 8%,
                                        95.5% 32%, 97% 13%, 98.5% 31%, 100% 10%, 98.5% 46%, 100% 55%,
                                        100% 100%, 0% 100%
                                    )`,
                                    boxShadow: "inset 0 -8px 16px rgba(40,16,0,0.45)",
                                }} />
                                {/* 2. PARCHMENT BODY */}
                                <div ref={scrollBodyRef} id="scrollBody" style={{
                                    flexShrink: 0,
                                    width: "100%",
                                    height: `${bodyHeight}px`,
                                    overflow: "hidden",
                                    position: "relative",
                                    background: `
                                        linear-gradient(to right, 
                                            rgba(80,40,5,0.55) 0%, transparent 10%, 
                                            transparent 90%, rgba(80,40,5,0.55) 100%),
                                        radial-gradient(ellipse at 50% 30%, 
                                            rgba(255,238,175,0.45) 0%, transparent 60%),
                                        linear-gradient(175deg,
                                            #a07020 0%, #bc8c38 8%, #d4a84e 18%,
                                            #e8be62 28%, #f0cc72 40%, #f4d47c 52%,
                                            #eeca70 64%, #dcb458 76%, 
                                            #c89c40 88%, #aa7e24 100%)`,
                                }}>
                                    <div ref={scrollInnerRef} style={{
                                        position: "absolute",
                                        top: 0, left: 0, right: 0,
                                        padding: "52px 44px 80px 44px",
                                        minHeight: 2000,
                                        willChange: "transform",
                                    }}>
                                        {/* Ruled lines */}
                                        {Array.from({ length: 36 }, (_, i) => (
                                            <div key={i} style={{
                                                position: "absolute",
                                                top: `${50 + i * 44}px`,
                                                left: 44,
                                                right: 44,
                                                height: 1,
                                                background: "rgba(80,45,5,0.1)",
                                            }} />
                                        ))}
                                        
                                        {/* Floral corner top-left */}
                                        <div style={{ position: "absolute", top: 10, left: 10, width: "180px", height: "180px", zIndex: 2, pointerEvents: "none", opacity: 0.6 }}>
                                            <span style={{ position: "absolute", left: '82px', top: '10px', fontSize: '72px', transform: 'rotate(-20deg)', filter: 'sepia(0.3) saturate(1.7)' }}>🌸</span>
                                            <span style={{ position: "absolute", left: '46px', top: '20px', fontSize: '44px', transform: 'rotate(15deg)', opacity: 0.8 }}>🌺</span>
                                            <span style={{ position: "absolute", left: '36px', top: '90px', fontSize: '36px', transform: 'rotate(-28deg) scaleX(-1)', opacity: 0.7 }}>🍃</span>
                                            <span style={{ position: "absolute", left: '28px', top: '120px', fontSize: '32px', transform: 'rotate(20deg)', opacity: 0.6 }}>🌿</span>
                                            <span style={{ position: "absolute", left: '23px', top: '140px', fontSize: '28px', transform: 'rotate(5deg)', opacity: 0.5 }}>🌷</span>
                                        </div>
                                        
                                        {/* Wax seal top-center */}
                                        <div style={{
                                            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                                            width: 42, height: 42, borderRadius: "50%",
                                            background: `radial-gradient(circle at 30% 30%, ${config.colors.primary}, ${config.colors.secondary})`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "18px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 10
                                        }}>💌</div>
                                        
                                        {/* Age spots */}
                                        <div style={{
                                            position: "absolute", top: "20%", right: "15%", width: 120, height: 80,
                                            background: "radial-gradient(ellipse, rgba(80,40,5,0.12) 0%, transparent 70%)",
                                            pointerEvents: "none"
                                        }} />
                                        <div style={{
                                            position: "absolute", top: "50%", left: "10%", width: 100, height: 60,
                                            background: "radial-gradient(ellipse, rgba(80,40,5,0.1) 0%, transparent 70%)",
                                            pointerEvents: "none"
                                        }} />
                                        <div style={{
                                            position: "absolute", bottom: "25%", right: "20%", width: 80, height: 100,
                                            background: "radial-gradient(ellipse, rgba(80,40,5,0.14) 0%, transparent 70%)",
                                            pointerEvents: "none"
                                        }} />
                                        
                                        {/* Letter Content - all lines visible immediately */}
                                        <div style={{ position: "relative", zIndex: 3 }}>
                                            {resolvedData.generatedMessage.split('\n').map((line, i) => {
                                                if (!line.trim()) return <div key={i} style={{ height: "14px" }} />;
                                                
                                                const baseStyle = {
                                                    opacity: 1,
                                                    transform: "translateY(0px)",
                                                    textShadow: "0 1px 1px rgba(180,130,60,0.3)",
                                                    animation: `fadeInUp 0.5s ${0.3 + i * 0.04}s ease forwards`
                                                };

                                                if (i === 0) {
                                                    return <h3 key={i} style={{ ...baseStyle, fontFamily: "'Great Vibes', cursive", fontSize: "clamp(30px, 6.5vw, 42px)", color: "#1e0e00", marginBottom: "16px" }}>{line}</h3>;
                                                }
                                                
                                                const totalLines = resolvedData.generatedMessage.split('\n').filter(l => l.trim()).length;
                                                if (i > totalLines - 3) {
                                                    return <p key={i} style={{ ...baseStyle, fontFamily: "'Great Vibes', cursive", fontSize: "clamp(28px, 6vw, 38px)", color: "#1e0e00", marginTop: "12px", margin: "4px 0" }}>{line}</p>;
                                                }

                                                return (
                                                    <p key={i} style={{ 
                                                        ...baseStyle, fontFamily: "'Dancing Script', cursive", fontWeight: 600, fontSize: "clamp(26px, 5.5vw, 34px)", color: "#1e0e00", 
                                                        lineHeight: 1.88, margin: "4px 0"
                                                    }}>
                                                        {line}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                        
                                        <p style={{ 
                                            position: "absolute", bottom: "16px", width: "100%", left: 0, textAlign: "center",
                                            fontFamily: "'Dancing Script', cursive", color: "rgba(61,30,8,0.15)", fontSize: "14px"
                                        }}>
                                            ~ a letter written from the heart ~
                                        </p>
                                    </div>
                                </div>
                                
                                {/* 3. FOLD AT BOTTOM */}
                                <div id="foldWrap" style={{
                                    flexShrink: 0,
                                    position: "relative",
                                    height: `${foldHeight}px`,
                                    width: "100%",
                                    overflow: "hidden",
                                }}>
                                    {/* Strong crease shadow at top of fold */}
                                    <div style={{
                                        position: "absolute",
                                        top: 0, left: 0, right: 0,
                                        height: 28,
                                        background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                                        zIndex: 6,
                                    }} />
                                    {/* Crease highlight line */}
                                    <div style={{
                                        position: "absolute",
                                        top: 1, left: "5%", right: "5%",
                                        height: 2,
                                        background: "linear-gradient(to right, transparent, rgba(255,220,140,0.5) 20%, rgba(255,220,140,0.5) 80%, transparent)",
                                        zIndex: 7,
                                    }} />
                                    {/* Folded parchment (same color as body but slightly darker) */}
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(180deg, #c8a040 0%, #b88c30 30%, #a07020 60%, #8a5c18 80%, #6e4010 100%)",
                                        clipPath: `polygon(
                                            0% 0%, 100% 0%,
                                            100% 72%, 97% 84%, 93% 92%,
                                            86% 98%, 74% 100%, 60% 98%,
                                            50% 100%, 40% 98%, 26% 100%,
                                            14% 98%, 7% 92%, 3% 84%, 0% 72%
                                        )`,
                                        boxShadow: "0 24px 60px rgba(0,0,0,0.95), inset 0 10px 24px rgba(20,8,0,0.5)",
                                    }} />
                                    
                                    {/* Scroll hint inside the fold */}
                                    {showScrollHint && (
                                        <div style={{
                                            position: "absolute",
                                            top: "50%", left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            textAlign: "center", zIndex: 8,
                                            color: "rgba(255, 240, 200, 0.5)",
                                            pointerEvents: "none"
                                        }}>
                                            <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" }}>scroll to unfold</div>
                                            <div style={{ fontSize: "20px", animation: "bounce 2s infinite" }}>↓</div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Close Button */}
                                <div style={{
                                    position: "fixed", top: 16, right: 16,
                                    background: "rgba(0,0,0,0.6)", color: "white",
                                    padding: "8px 16px", borderRadius: "20px",
                                    fontSize: "12px", cursor: "pointer", zIndex: 9999,
                                    fontFamily: "sans-serif", fontWeight: "bold",
                                    transition: "background 0.3s"
                                }} onClick={handleCloseLetter}
                                   onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)"}
                                   onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
                                >
                                    ✕ close
                                </div>
                            </div>
                        </div>
                )}
            </section>

            <Divider />

            {/* CLOSING QUOTE */}
            <section style={{ 
                maxWidth: "680px", margin: "100px auto", textAlign: "center",
                animation: "fadeInUp 1s both" 
            }}>
                <p style={{
                    fontFamily: "Georgia, serif", fontStyle: "italic", 
                    fontSize: "clamp(16px,2.8vw,26px)", color: "rgba(255,248,240,0.75)",
                    lineHeight: 1.6, marginBottom: "32px"
                }}>
                    "{config.closingQuote}"
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <span style={{ fontSize: "20px", animation: "floatEmoji 3s infinite ease-in-out" }}>{config.particles[0]}</span>
                    <span style={{ fontSize: "20px", animation: "floatEmoji 3s infinite ease-in-out", animationDelay: "0.5s" }}>{config.particles[1]}</span>
                    <span style={{ fontSize: "20px", animation: "floatEmoji 3s infinite ease-in-out", animationDelay: "1s" }}>{config.particles[2]}</span>
                </div>
            </section>

            {/* VIDEO PLACEHOLDER - Hidden for Tier 49 */}
            {tier !== "49" && (
                <section style={{ maxWidth: "800px", margin: "100px auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <p style={{ fontSize: "10px", letterSpacing: "4px", color: config.colors.primary, textTransform: "uppercase" }}>✦ YOUR CINEMATIC LOVE FILM ✦</p>
                        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", marginTop: "12px" }}>A <em>film</em> crafted for you</h2>
                    </div>
                    <div style={{
                        width: "100%", height: "320px", borderRadius: "20px",
                        background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px"
                    }}>
                        <div style={{ fontSize: "48px", opacity: 0.3 }}>🎬</div>
                        <p style={{ fontSize: "12px", letterSpacing: "2px", color: "rgba(255,255,255,0.2)", cursor: "default" }}>YOUR CINEMATIC VIDEO WILL APPEAR HERE</p>
                    </div>
                </section>
            )}

            <Divider />

            {/* ENDING + CONFIRM & PAY - Only show if onConfirm is provided (creation flow) */}
            {tier && onConfirm && (
                <section style={{ maxWidth: "600px", margin: "100px auto 0", textAlign: "center" }}>
                    <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "rgba(255,248,240,0.35)", marginBottom: "60px" }}>
                        🔑 "Unlocked with a secret code from someone who loves you."
                    </p>
                    
                    <div style={{ marginBottom: "80px" }}>
                        <div style={{ fontSize: "36px", marginBottom: "16px" }}>💌</div>
                        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                            Some memories deserve to last forever.
                        </p>
                        <p style={{ fontSize: "12px", letterSpacing: "3px", color: config.colors.primary, fontWeight: "bold" }}>CREATED WITH LOVEBITES</p>
                    </div>

                    <div style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "24px", padding: "40px 20px", position: "relative", overflow: "hidden"
                    }}>
                        <div style={{ fontSize: "32px", marginBottom: "16px" }}>💗</div>
                        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "8px" }}>Ready to send this love story?</h3>
                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "32px" }}>
                            We'll deliver it to {resolvedData.recipientName} exactly as you see it.
                        </p>
                        <button 
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            style={{
                                background: `linear-gradient(45deg, ${config.colors.secondary}, ${config.colors.primary}, ${config.colors.secondary})`,
                                backgroundSize: "200% auto", color: "#fff",
                                border: "none", borderRadius: "50px", padding: "18px 56px",
                                fontSize: "18px", fontWeight: "bold", cursor: "pointer",
                                opacity: isSubmitting ? 0.7 : 1,
                                animation: "shimmerPay 3s linear infinite, pulseGlow 2s infinite ease-in-out"
                            }}
                        >
                            {isSubmitting ? "Processing..." : `💳 Pay ₹${tier} & send to your love ones`}
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
