// ══════════════════════════════════════
// TINDER STYLE MOBILE MENU
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const fullMenu = document.getElementById('fullscreenMenu');
const menuCloseBtn = document.getElementById('menuCloseBtn');

window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.remove('top');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('top');
      navbar.classList.remove('scrolled');
    }
  }
});

function openMobileMenu() {
  if (hamburger) hamburger.classList.add('open');
  if (fullMenu) fullMenu.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (fullMenu) fullMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    fullMenu.classList.contains('open')
      ? closeMobileMenu()
      : openMobileMenu();
  });
}

if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.menu-item').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.querySelector('.menu-btn-create')?.addEventListener('click', closeMobileMenu);
document.querySelector('.menu-btn-signin')?.addEventListener('click', closeMobileMenu);

let touchStartX = 0;
if (fullMenu) {
  fullMenu.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  fullMenu.addEventListener('touchend', e => {
    const swipeDiff = e.changedTouches[0].clientX - touchStartX;
    if (swipeDiff > 80) closeMobileMenu();
  }, { passive: true });
}

// ══════════════════════════════════════
// FLOATING HEARTS LOGIC
// ══════════════════════════════════════
function createHeart() {
  const container = document.getElementById('heart-container');
  if (!container) return;
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '♥';

  const startX = Math.random() * window.innerWidth;
  const size = Math.random() * (30 - 10) + 10;
  const duration = Math.random() * (8 - 4) + 4;

  heart.style.left = `${startX}px`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.bottom = '-50px';

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

setInterval(createHeart, 300);

// ══════════════════════════════════════
// FORM HANDLING
// ══════════════════════════════════════
const loveForm = document.getElementById('loveForm');
const shareModal = document.getElementById('shareModal');
const generatedLink = document.getElementById('generatedLink');
const whatsappLink = document.getElementById('whatsappLink');

if (loveForm) {
  loveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('partnerName').value,
      message: document.getElementById('mainMessage').value,
      memory: document.getElementById('specialMemory').value,
      surprise: document.getElementById('surpriseType').value,
      id: Math.random().toString(36).substr(2, 9)
    };

    localStorage.setItem(`loveCode_${formData.id}`, JSON.stringify(formData));

    const baseLink = window.location.href.replace('index.html', 'love-view.html');
    const fullLink = `${baseLink}?id=${formData.id}`;

    if (generatedLink) generatedLink.innerText = fullLink;
    if (whatsappLink) whatsappLink.href = `https://wa.me/?text=I have a secret surprise for you! Open it here: ${fullLink}`;

    if (shareModal) shareModal.style.display = 'flex';
  });
}

function closeModal() {
  if (shareModal) shareModal.style.display = 'none';
}

// ══════════════════════════════════════
// STORYTELLING SCROLL LOGIC
// ══════════════════════════════════════
const storyGrid = document.querySelector('.story-grid-container');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.1 });

if (document.querySelectorAll('.scroll-reveal').length > 0) {
  document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));
}

window.addEventListener('scroll', () => {
  if (!storyGrid) return;
  const rect = storyGrid.getBoundingClientRect();
  const scrollProgress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
  if (scrollProgress > 0.7) {
    // Logic for fade-out can go here
  }
});

// ══════════════════════════════════════
// FLOATING PHRASES
// ══════════════════════════════════════
const phrases = [
  { text: "She cried happy tears 😭💕", color: "rgba(232,68,90,0.12)" },
  { text: "He proposed with this 💍", color: "rgba(255,107,128,0.12)" },
  { text: "Sent at midnight on our anniversary", color: "rgba(192,41,62,0.08)" },
  { text: "She said YES 🎉", color: "rgba(255,182,193,0.2)" },
  { text: "Made him cry in the best way 💙", color: "rgba(232,68,90,0.1)" },
  { text: "3 years together 🕯️", color: "rgba(255,107,128,0.1)" },
  { text: "Best birthday surprise ever 🎂", color: "rgba(192,41,62,0.08)" },
  { text: "Long distance love 💌", color: "rgba(232,68,90,0.12)" },
  { text: "Our first year ❤️", color: "rgba(255,182,193,0.18)" },
  { text: "I love you to the moon 🌙", color: "rgba(232,68,90,0.1)" },
  { text: "She played it 7 times 🔁", color: "rgba(192,41,62,0.08)" },
  { text: "He kept it forever 💾", color: "rgba(255,107,128,0.12)" },
];

const zones = [
  { left: '2%', bottom: '-60px' },
  { left: '8%', bottom: '-60px' },
  { left: '72%', bottom: '-60px' },
  { left: '80%', bottom: '-60px' },
];

const phraseContainer = document.getElementById('floatingPhrases');

function spawnPhrase() {
  if (!phraseContainer) return;
  const p = phrases[Math.floor(Math.random() * phrases.length)];
  const zone = zones[Math.floor(Math.random() * zones.length)];
  const el = document.createElement('div');
  el.className = 'float-phrase';
  el.textContent = p.text;
  el.style.cssText = `
    left: ${zone.left};
    bottom: ${zone.bottom};
    background: ${p.color};
    animation-duration: ${Math.random() * 8 + 10}s;
    animation-delay: 0s;
  `;
  phraseContainer.appendChild(el);
  setTimeout(() => el.remove(), 18000);
}

if (phraseContainer) {
  setInterval(spawnPhrase, 2200);
  setTimeout(() => { spawnPhrase(); spawnPhrase(); }, 600);
}

// ══════════════════════════════════════
// CHAT BUBBLES
// ══════════════════════════════════════
const conversations = [
  [
    { side: 'sender', text: 'I made something special for you 💌', time: '9:41 PM' },
    { side: 'receiver', text: 'OMG what is this?? 😭', time: '9:42 PM' },
  ],
  [
    { side: 'sender', text: 'Open the link babe 🔗', time: '11:58 PM' },
    { side: 'receiver', text: "I'm literally crying right now 😭💕", time: '11:59 PM' },
  ],
  [
    { side: 'sender', text: 'Happy anniversary my love 🥂', time: '12:00 AM' },
    { side: 'receiver', text: 'This is the most beautiful thing ever ❤️', time: '12:01 AM' },
  ],
  [
    { side: 'sender', text: 'Check your WhatsApp 👀', time: '7:15 PM' },
    { side: 'receiver', text: 'You made me cry at work 😂💕', time: '7:16 PM' },
  ],
  [
    { side: 'sender', text: 'Your surprise is ready 🎁', time: '3:30 PM' },
    { side: 'receiver', text: 'I will cherish this forever 🙏❤️', time: '3:32 PM' },
  ],
];

const bubbleContainer = document.getElementById('chatBubbles');
let convIndex = 0;

function spawnConversation() {
  if (!bubbleContainer) return;
  const conv = conversations[convIndex % conversations.length];
  convIndex++;
  const topBase = Math.random() * 25 + 55;

  conv.forEach((msg, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = `chat-bubble bubble-${msg.side}`;
      const isLeft = msg.side === 'sender';
      const pos = `${Math.random() * 6 + 2}%`;
      el.style.cssText = `
        ${isLeft ? 'left' : 'right'}: ${pos};
        top: ${topBase + i * 8}%;
        animation-duration: 5s;
        animation-delay: 0s;
      `;
      el.innerHTML = `
        ${msg.text}
        <div class="bubble-time">${msg.time} ${msg.side === 'sender' ? '✓✓' : ''}</div>
      `;
      bubbleContainer.appendChild(el);
      setTimeout(() => el.remove(), 5200);
    }, i * 1200);
  });
}

if (bubbleContainer) {
  setInterval(spawnConversation, 6000);
  setTimeout(spawnConversation, 1500);
}

// ══════════════════════════════════════
// NOTIFICATION TOASTS
// ══════════════════════════════════════
const toasts = [
  { icon: '💝', iconClass: 'pink', title: 'Sarah just opened her Love Code', msg: "She's been on it for 4 minutes 😍", time: 'just now' },
  { icon: '🎉', iconClass: 'gold', title: 'Ahmed sent a Love Code to Priya', msg: 'Anniversary surprise — scheduled for midnight', time: '2m ago' },
  { icon: '😭', iconClass: 'pink', title: 'New reaction received!', msg: '"This made me cry happy tears" 💕', time: '5m ago' },
  { icon: '💍', iconClass: 'gold', title: 'Proposal Love Code created', msg: 'Special delivery scheduled for Saturday', time: '8m ago' },
  { icon: '🔔', iconClass: 'blue', title: 'Your Love Code was opened!', msg: 'Maria just unlocked your message ❤️', time: '12m ago' },
  { icon: '✨', iconClass: 'green', title: '500th Love Code milestone!', msg: 'Our community keeps growing 🎊', time: '1h ago' },
  { icon: '🎂', iconClass: 'gold', title: 'Birthday Love Code delivered', msg: 'Sent to Jake at exactly midnight 🎈', time: '2h ago' },
  { icon: '💌', iconClass: 'pink', title: 'New Love Code created', msg: 'Long distance couple from Mumbai 🌍', time: '3h ago' },
];

const toastContainer = document.getElementById('toastContainer');
let toastIndex = 0;

function showToast() {
  if (!toastContainer) return;
  const existing = toastContainer.querySelectorAll('.toast.show');
  if (existing.length >= 3) {
    const oldest = existing[0];
    oldest.classList.remove('show');
    oldest.classList.add('hide');
    setTimeout(() => oldest.remove(), 400);
  }

  const data = toasts[toastIndex % toasts.length];
  toastIndex++;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon ${data.iconClass}">${data.icon}</div>
    <div class="toast-body">
      <div class="toast-title">${data.title}</div>
      <div class="toast-msg">${data.msg}</div>
    </div>
    <div class="toast-time">${data.time}</div>
    <div class="toast-progress"></div>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.classList.add('show'); });
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

if (toastContainer) {
  setTimeout(() => showToast(), 800);
  setTimeout(() => showToast(), 3000);
  setTimeout(() => showToast(), 5500);
  setInterval(showToast, 5000);
}

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
  if (!bgWordsContainer) return;
  const word = bgWordsList[Math.floor(Math.random() * bgWordsList.length)];
  const el = document.createElement('div');
  el.className = 'bg-word';

  const size = Math.random() * 2.5 + 1.2;
  const left = Math.random() * 95;
  const dur = Math.random() * 20 + 18;
  const delay = Math.random() * 8;
  const rot = (Math.random() * 30 - 15);

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

if (bgWordsContainer) {
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnBgWord, i * 1200);
  }
  setInterval(spawnBgWord, 2800);
}

// ══════════════════════════════════════
// FLOATING SOFT SHAPES
// ══════════════════════════════════════
const bgShapesContainer = document.getElementById('bgShapes');

const heartChars = ['♥', '♡', '❤', '💕', '💗', '💓', '✦', '✧'];
const sparkleChars = ['✦', '✧', '✸', '✺', '❋', '✿', '❀'];

function spawnHeartShape() {
  if (!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape heart';

  const char = heartChars[Math.floor(Math.random() * heartChars.length)];
  const size = Math.random() * 18 + 8;
  const left = Math.random() * 98;
  const dur = Math.random() * 16 + 12;
  const delay = Math.random() * 10;
  const hue = Math.random() * 20 + 340;
  const light = Math.random() * 20 + 65;
  const opacity = Math.random() * 0.15 + 0.06;

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
  if (!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape circle';

  const size = Math.random() * 120 + 60;
  const left = Math.random() * 90;
  const top = Math.random() * 80 + 5;
  const dur = Math.random() * 10 + 8;

  el.style.cssText = `
    left: ${left}%;
    top: ${top}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * 4}s;
  `;
  bgShapesContainer.appendChild(el);
}

function spawnSparkle() {
  if (!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape sparkle';

  const char = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
  const size = Math.random() * 10 + 6;
  const left = Math.random() * 98;
  const dur = Math.random() * 14 + 10;
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

if (bgShapesContainer) {
  for (let i = 0; i < 6; i++) spawnCircleBlob();
  for (let i = 0; i < 10; i++) setTimeout(spawnHeartShape, i * 800);
  setInterval(spawnHeartShape, 1800);
  for (let i = 0; i < 6; i++) setTimeout(spawnSparkle, i * 1400);
  setInterval(spawnSparkle, 2400);
}

// ══════════════════════════════════════
// JOURNEY SECTION - ALL INTERACTIONS
// ══════════════════════════════════════
const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll(
  '.gallery-item, .story-card, .emotion-card, ' +
  '.story-break, .section-header, .journey-cta, ' +
  '.gateway-quote'
).forEach(el => journeyObserver.observe(el));

// 3D TILT
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transition = 'none';
    card.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${y * -20}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
});

// PARALLAX
const galleryImages = document.querySelectorAll('.gallery-item img');
window.addEventListener('scroll', () => {
  galleryImages.forEach((img, i) => {
    const parent = img.closest('.gallery-item');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const speed = i % 3 === 0 ? 0.04 : i % 3 === 1 ? 0.06 : 0.03;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      img.style.transform = `translateY(${offset}px) scale(1.08)`;
    }
  });
}, { passive: true });

// GATEWAY PARTICLES
const gatewayParticles = document.getElementById('gatewayParticles');
if (gatewayParticles) {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'gp';
    const size = Math.random() * 200 + 100;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 10 + 10}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    gatewayParticles.appendChild(p);
  }
}

// SECTION FLOATING PARTICLES
const sectionParticles = document.getElementById('sectionParticles');
if (sectionParticles) {
  const chars = ['♥', '💖', '✨', '🌸', '💫'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'sp';
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      color: rgba(232, 68, 90, ${Math.random() * 0.3 + 0.1});
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      font-size: ${Math.random() * 1.5 + 0.5}rem;
    `;
    sectionParticles.appendChild(p);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const gateway = document.getElementById("gateway");
  if (gateway) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gateway.classList.add("reveal");
        }
      });
    }, { threshold: 0.15 });
    observer.observe(gateway);
  }
});
