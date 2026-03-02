
js_to_append = """

// ══════════════════════════════════════
// FLOATING BACKGROUND WORDS
// ══════════════════════════════════════
const bgWordsList = [
  'together', 'always', 'forever',
  'yours', 'cherish', 'beloved',
  'infinite', 'some love stories deserve remebered to be forever', 'remember',
  'devotion', 'eternal', 'soulmate',
  'always', 'because', 'I love you',
  'never forget', 'with you',
  'my heart', 'only you',
  'every moment', 'hold on',
  'promise', 'always & forever',
];

const bgWordsContainer = document.getElementById('bgWords');

function spawnBgWord() {
  if(!bgWordsContainer) return;
  const word = bgWordsList[Math.floor(Math.random() * bgWordsList.length)];
  const el = document.createElement('div');
  el.className = 'bg-word';

  const size   = Math.random() * 2.5 + 1.2;   // 1.2rem – 3.7rem
  const left   = Math.random() * 95;            // 0% – 95%
  const dur    = Math.random() * 20 + 18;       // 18s – 38s
  const delay  = Math.random() * 8;             // 0s – 8s
  const rot    = (Math.random() * 30 - 15);     // -15deg – +15deg

  el.style.cssText = `
    left: ${left}%;
    bottom: -80px;
    font-size: ${size}rem;
    --rot: ${rot}deg;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
  `;
  el.textContent = word;
  bgWordsContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000 + 500);
}

// Spawn words staggered
if(bgWordsContainer) {
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnBgWord, i * 1200);
  }
  setInterval(spawnBgWord, 2800);
}


// ══════════════════════════════════════
// FLOATING SOFT SHAPES
// ══════════════════════════════════════
const bgShapesContainer = document.getElementById('bgShapes');

// Hearts as unicode characters
const heartChars  = ['♥', '♡', '❤', '💕', '💗', '💓', '✦', '✧'];
const sparkleChars = ['✦', '✧', '✸', '✺', '❋', '✿', '❀'];

function spawnHeart() {
  if(!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape heart';

  const char  = heartChars[Math.floor(Math.random() * heartChars.length)];
  const size  = Math.random() * 18 + 8;       // 8px – 26px
  const left  = Math.random() * 98;
  const dur   = Math.random() * 16 + 12;      // 12s – 28s
  const delay = Math.random() * 10;
  const hue   = Math.random() * 20 + 340;     // pink hues
  const light = Math.random() * 20 + 65;      // 65% – 85% lightness
  const opacity = Math.random() * 0.15 + 0.06; // very subtle 0.06 – 0.21

  el.style.cssText = `
    left: ${left}%;
    bottom: -30px;
    font-size: ${size}px;
    color: hsl(${hue}, 75%, ${light}%);
    opacity: ${opacity};
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
  `;
  el.textContent = char;
  bgShapesContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000 + 500);
}

function spawnCircleBlob() {
  if(!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape circle';

  const size  = Math.random() * 120 + 60;    // 60px – 180px
  const left  = Math.random() * 90;
  const top   = Math.random() * 80 + 5;
  const dur   = Math.random() * 10 + 8;

  el.style.cssText = `
    left: ${left}%;
    top: ${top}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * 4}s;
  `;
  bgShapesContainer.appendChild(el);
  // Blobs are permanent, just animate in place
}

function spawnSparkle() {
  if(!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape sparkle';

  const char  = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
  const size  = Math.random() * 10 + 6;
  const left  = Math.random() * 98;
  const dur   = Math.random() * 14 + 10;
  const delay = Math.random() * 8;

  el.style.cssText = `
    left: ${left}%;
    bottom: -20px;
    font-size: ${size}px;
    color: rgba(232, 68, 90, 0.18);
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
  `;
  el.textContent = char;
  bgShapesContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + delay) * 1000 + 500);
}

if(bgShapesContainer) {
  // Spawn initial blobs (static ambient, don't remove)
  for (let i = 0; i < 6; i++) {
    spawnCircleBlob();
  }

  // Spawn hearts continuously
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnHeart, i * 800);
  }
  setInterval(spawnHeart, 1800);

  // Spawn sparkles continuously
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnSparkle, i * 1400);
  }
  setInterval(spawnSparkle, 2400);
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\app.js"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(js_to_append)

print("Background animations logic appended to app.js")
