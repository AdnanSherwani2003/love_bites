
css_to_append = """
/* ── FLOATING BG WORDS ── */
.bg-words {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.bg-word {
  position: absolute;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  color: rgba(232, 68, 90, 0.07);
  white-space: nowrap;
  user-select: none;
  animation: bgWordFloat linear infinite;
}

@keyframes bgWordFloat {
  0%   { transform: translateY(0px) rotate(var(--rot)); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-120vh) rotate(var(--rot)); opacity: 0; }
}

/* ── FLOATING SOFT SHAPES ── */
.bg-shapes {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  opacity: 0;
  animation: shapeFloat linear infinite;
  border-radius: 50%;
}

/* Heart shape using CSS */
.bg-shape.heart {
  background: transparent;
  border-radius: 0;
  font-size: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes shapeFloat {
  0%   { transform: translateY(0px) rotate(0deg) scale(1);   opacity: 0;    }
  8%   { opacity: 1; }
  50%  { transform: translateY(-50vh) rotate(180deg) scale(1.1); opacity: 0.6; }
  92%  { opacity: 0.4; }
  100% { transform: translateY(-110vh) rotate(360deg) scale(0.8); opacity: 0; }
}

/* Circle blobs */
.bg-shape.circle {
  background: radial-gradient(
    circle,
    rgba(232, 68, 90, 0.08) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: blobFloat ease-in-out infinite;
}

@keyframes blobFloat {
  0%,100% { transform: translateY(0px) scale(1);    opacity: 0.5; }
  33%      { transform: translateY(-18px) scale(1.05); opacity: 0.8; }
  66%      { transform: translateY(10px) scale(0.97);  opacity: 0.4; }
}

/* Star/sparkle shape */
.bg-shape.sparkle {
  background: transparent;
  animation: sparkleFloat linear infinite;
}

@keyframes sparkleFloat {
  0%   { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0;   }
  10%  { opacity: 0.7; }
  50%  { transform: translateY(-55vh) rotate(180deg) scale(1.2); opacity: 0.5; }
  90%  { opacity: 0.2; }
  100% { transform: translateY(-110vh) rotate(360deg) scale(0.6); opacity: 0; }
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Background floating shapes and words CSS appended to style.css")
