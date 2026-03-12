export default function LoveBitesLogo({ 
  size = 26 
}: { size?: number }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 8 
    }}>
      <div style={{ 
        width: size, 
        height: size * 0.9,
        animation: "heartbeat 1.4s ease-in-out infinite",
        filter: "drop-shadow(0 0 8px rgba(232,48,74,0.6))",
      }}>
        <svg
          viewBox="0 0 100 90"
          style={{ width: "100%", height: "100%" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoHeartGrad"
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
            fill="url(#logoHeartGrad)"
          />
        </svg>
      </div>
      <span style={{
        fontFamily: "Georgia, serif",
        fontSize: size,
        fontWeight: 600,
        color: "#fff8f0",
        letterSpacing: 1,
      }}>
        Love{" "}
        <em style={{ 
          color: "#c4304f", 
          fontStyle: "italic" 
        }}>
          Bites
        </em>
      </span>
      
      {/* Heartbeat animation */}
      <style>{`
        @keyframes heartbeat {
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
