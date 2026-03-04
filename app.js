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
// BG SHAPES
// ══════════════════════════════════════
const bgShapesContainer = document.getElementById('bgShapes');

const circleBlobChars = ['·', '⋅', '‣', '⁃'];
const heartShapeChars = ['♥', '♡', '❣️', '❦'];
const sparkleChars = ['✨', '❇️', '✦', '❆'];

function spawnCircleBlob() {
  if (!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape circle-blob';

  const char = circleBlobChars[Math.floor(Math.random() * circleBlobChars.length)];
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

function spawnHeartShape() {
  if (!bgShapesContainer) return;
  const el = document.createElement('div');
  el.className = 'bg-shape heart-shape';

  const char = heartShapeChars[Math.floor(Math.random() * heartShapeChars.length)];
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

// ═══════════════════════════════════════
// AI MAGIC SECTION LOGIC
// ═══════════════════════════════════════

var selectedMood = '';

/* ---- MOOD PILL TOGGLE ----
   Only one pill selected at a time.
   Clicking selected pill again deselects it. */
function selectMood(el) {
  var pills = document.querySelectorAll('.ai-mood-pill');
  pills.forEach(function(p) { p.classList.remove('selected'); });
  if (selectedMood === el.textContent.trim()) {
    selectedMood = ''; /* deselect if clicking same pill */
  } else {
    el.classList.add('selected');
    selectedMood = el.textContent.trim();
  }
}

/* ---- MAIN GENERATE FUNCTION ----
   Called by Generate button AND Regenerate button. */
function generateMessage() {
  var inputEl = document.getElementById('ai-feeling-input');
  if (!inputEl) return;
  var feeling = inputEl.value.trim();

  /* Validation: highlight textarea red if empty */
  if (!feeling) {
    inputEl.focus();
    inputEl.style.borderColor = 'rgba(192,49,79,0.5)';
    setTimeout(function() {
      inputEl.style.borderColor = '';
    }, 1500);
    return;
  }

  /* UI: set loading state */
  var btn = document.getElementById('ai-generate-btn');
  var errorEl = document.getElementById('ai-error');
  if (btn) {
    btn.classList.add('loading');
    btn.disabled = true;
  }
  if (errorEl) errorEl.classList.remove('visible');

  /* Hide output card while regenerating */
  var out = document.getElementById('ai-output-wrap');
  if (out) {
    out.classList.remove('visible');
    out.style.display = 'none';
  }

  /*
    PROMPT CONSTRUCTION
    Instructs Claude to return ONLY clean JSON.
    No markdown fences. No extra text.
    3 fields: opening, message, closing.
  */
  var moodLine = selectedMood ? 'Mood/Occasion: ' + selectedMood + '\n' : '';
  var prompt =
    'You are a romantic AI that writes deeply personal, heartfelt love messages for the Love Bites app.\n\n' +
    'The user has shared this feeling:\n"' + feeling + '"\n' +
    moodLine + '\n' +
    'Write a love message with exactly 3 parts. ' +
    'Respond ONLY with valid JSON — no markdown, no backticks, no extra text:\n\n' +
    '{\n' +
    '  "opening": "A single romantic opening line — poetic, intimate, 1 sentence. Like the first line of a love letter.",\n' +
    '  "message": "The main message body — 3 to 4 sentences. Warm, personal, emotional. Speaks directly to the feeling shared. Uses you and I.",\n' +
    '  "closing": "A tender closing line — like a signature. Poetic and memorable. 1 sentence."\n' +
    '}';

  /*
    API CALL
    Hits Anthropic /v1/messages endpoint.
    API key is handled by proxy — DO NOT add key here.
    Model: claude-sonnet-4-20250514
  */
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {

    /* Extract raw text from API response */
    var raw = '';
    if (data.content && data.content.length > 0) {
      for (var i = 0; i < data.content.length; i++) {
        if (data.content[i].type === 'text') {
          raw += data.content[i].text;
        }
      }
    }

    /* Strip any accidental markdown fences + parse JSON */
    var cleaned = raw.replace(/```json|```/g, '').trim();
    var parsed = JSON.parse(cleaned);

    /* Fill the 3 output fields */
    var openingEl = document.getElementById('ai-opening');
    var messageEl = document.getElementById('ai-message');
    var closingEl = document.getElementById('ai-closing');
    
    if (openingEl) openingEl.textContent = parsed.opening || '';
    if (messageEl) messageEl.textContent = parsed.message || '';
    if (closingEl) closingEl.textContent = parsed.closing || '';

    /* Show output card with fade+slide animation:
       1. Set display:block first
       2. 30ms delay so browser registers it
       3. Add .visible to trigger CSS transition */
    if (out) {
      out.style.display = 'block';
      setTimeout(function() { out.classList.add('visible'); }, 30);

      /* Smooth scroll to output card */
      setTimeout(function() {
        out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

  })
  .catch(function() {
    /* Show error message on failure */
    if (errorEl) errorEl.classList.add('visible');
  })
  .then(function() {
    /* Always reset button — runs after .then OR .catch */
    if (btn) {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

// Support Ctrl+Enter in textarea
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('ai-feeling-input');
  if (textarea) {
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateMessage();
      }
    });
  }
});

// ═══════════════════════════════════════
// JOURNEY SECTION — animations + interactions
// ═══════════════════════════════════════
(function () {
  // Intersection Observer for scroll reveal
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('v');
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -50px 0px' 
  });

  const revealTargets = document.querySelectorAll(
    '#journey, .jrn-pair, .jrn-tc, .jrn-head, .jrn-sb, .jrn-how, .jrn-cta, .jrn-gw-q'
  );
  
  revealTargets.forEach(function (el) { 
    io.observe(el); 
  });

  // 3D tilt on image cards
  document.querySelectorAll('.jrn-img').forEach(function (c) {
    c.addEventListener('mousemove', function (e) {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`;
      c.style.transition = 'none';
    });
    c.addEventListener('mouseleave', function () {
      c.style.transform = '';
      c.style.transition = 'transform .6s ease';
    });
  });

  // Floating particles
  const pts = document.getElementById('jrn-pts');
  if (pts) {
    ['♥', '♡', '·', '⋆'].forEach(function (ch) {
      for (let i = 0; i < 5; i++) {
        const el = document.createElement('div');
        el.className = 'pt';
        el.textContent = ch;
        el.style.cssText = `
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          color: rgba(210, 100, 130, ${(Math.random() * .13 + .03).toFixed(2)});
          font-size: ${(Math.random() * .6 + .4).toFixed(2)}rem;
          animation-duration: ${(Math.random() * 12 + 8).toFixed(1)}s;
          animation-delay: ${(Math.random() * 14).toFixed(1)}s;
        `;
        pts.appendChild(el);
      }
    });
  }
})();


