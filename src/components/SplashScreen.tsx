"use client";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const removeTimer = setTimeout(() => setVisible(false), 1850);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #0d0008 0%, #1a0010 40%, #0d0005 100%)",
      opacity: fading ? 0 : 1,
      transform: fading ? "scale(1.04)" : "scale(1)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      pointerEvents: fading ? "none" : "all",
    }}>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        animation: "splashIn 0.55s cubic-bezier(0.16,1,0.3,1) both",
      }}>

        {/* ── BRAND HEART SVG ── */}
        <div style={{
          width: 90,
          height: 82,
          animation: "lbHeartbeat 0.95s ease-in-out infinite",
          filter: [
            "drop-shadow(0 0 24px rgba(232,48,74,0.95))",
            "drop-shadow(0 0 55px rgba(232,48,74,0.45))",
          ].join(" "),
        }}>
          <svg
            viewBox="0 0 100 90"
            style={{ width: "100%", height: "100%" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="splashHeartGrad" 
                x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"  stopColor="#ff6b8a" />
                <stop offset="100%" stopColor="#e8304a" />
              </linearGradient>
            </defs>
            <path
              d="M50 85 C50 85 5 55 5 28 
                 C5 12 17 2 30 2 
                 C38 2 45 6 50 13 
                 C55 6 62 2 70 2 
                 C83 2 95 12 95 28 
                 C95 55 50 85 50 85Z"
              fill="url(#splashHeartGrad)"
            />
          </svg>
        </div>

        {/* ── LOGO TEXT ── */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 36,
          fontWeight: 600,
          color: "#fff8f0",
          letterSpacing: 1,
        }}>
          Love{" "}
          <em style={{ color: "#c4304f", fontStyle: "italic" }}>
            Bites
          </em>
        </div>

      </div>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: scale(0.78); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes lbHeartbeat {
          0%,100% { transform: scale(1);    }
          14%     { transform: scale(1.22); }
          28%     { transform: scale(1);    }
          42%     { transform: scale(1.10); }
          70%     { transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}
