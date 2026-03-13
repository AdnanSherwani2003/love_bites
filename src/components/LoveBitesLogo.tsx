export default function LoveBitesLogo({ 
  size = 26 
}: { size?: number }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 10 
    }}>
      <div style={{ 
        width: size * 1.1, 
        height: size,
        animation: "heart-pump 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
        filter: "drop-shadow(0 2px 8px rgba(225, 29, 72, 0.4))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <svg
          viewBox="0 0 24 24"
          style={{ width: "100%", height: "100%" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#e11d48"
          />
        </svg>
      </div>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: size,
        fontWeight: 800,
        color: "#e11d48",
        letterSpacing: -0.5,
        display: "flex",
        alignItems: "center"
      }}>
        Love&nbsp;
        <em style={{ 
          color: "#e11d48", 
          fontStyle: "italic",
          fontWeight: 600
        }}>
          Bites
        </em>
        <span style={{ color: "#e11d48", marginLeft: "1px" }}>.</span>
      </span>
      
      <style>{`
        @keyframes heart-pump {
          0% { transform: scale(1); }
          15% { transform: scale(1.22); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
