
js_to_append = """

// ══════════════════════════════
// FLOATING PHRASES
// ══════════════════════════════
const phrases = [
  { text: "She cried happy tears 😭💕",          color: "rgba(232,68,90,0.12)"   },
  { text: "He proposed with this 💍",             color: "rgba(255,107,128,0.12)" },
  { text: "Sent at midnight on our anniversary",  color: "rgba(192,41,62,0.08)"  },
  { text: "She said YES 🎉",                      color: "rgba(255,182,193,0.2)"  },
  { text: "Made him cry in the best way 💙",      color: "rgba(232,68,90,0.1)"   },
  { text: "3 years together 🕯️",                 color: "rgba(255,107,128,0.1)"  },
  { text: "Best birthday surprise ever 🎂",       color: "rgba(192,41,62,0.08)"  },
  { text: "Long distance love 💌",                color: "rgba(232,68,90,0.12)"  },
  { text: "Our first year ❤️",                    color: "rgba(255,182,193,0.18)" },
  { text: "I love you to the moon 🌙",            color: "rgba(232,68,90,0.1)"   },
  { text: "She played it 7 times 🔁",             color: "rgba(192,41,62,0.08)"  },
  { text: "He kept it forever 💾",                color: "rgba(255,107,128,0.12)" },
];

const zones = [
  { left: '2%',  bottom: '-60px' },
  { left: '8%',  bottom: '-60px' },
  { left: '72%', bottom: '-60px' },
  { left: '80%', bottom: '-60px' },
];

const phraseContainer = document.getElementById('floatingPhrases');

function spawnPhrase() {
  if(!phraseContainer) return;
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

if(phraseContainer) {
  setInterval(spawnPhrase, 2200);
  setTimeout(() => { spawnPhrase(); spawnPhrase(); }, 600);
}


// ══════════════════════════════
// CHAT BUBBLES
// ══════════════════════════════
const conversations = [
  [
    { side: 'sender',   text: 'I made something special for you 💌', time: '9:41 PM'  },
    { side: 'receiver', text: 'OMG what is this?? 😭',               time: '9:42 PM'  },
  ],
  [
    { side: 'sender',   text: 'Open the link babe 🔗',                time: '11:58 PM' },
    { side: 'receiver', text: "I'm literally crying right now 😭💕",  time: '11:59 PM' },
  ],
  [
    { side: 'sender',   text: 'Happy anniversary my love 🥂',         time: '12:00 AM' },
    { side: 'receiver', text: 'This is the most beautiful thing ever ❤️', time: '12:01 AM' },
  ],
  [
    { side: 'sender',   text: 'Check your WhatsApp 👀',               time: '7:15 PM'  },
    { side: 'receiver', text: 'You made me cry at work 😂💕',         time: '7:16 PM'  },
  ],
  [
    { side: 'sender',   text: 'Your surprise is ready 🎁',            time: '3:30 PM'  },
    { side: 'receiver', text: 'I will cherish this forever 🙏❤️',     time: '3:32 PM'  },
  ],
];

const bubbleContainer = document.getElementById('chatBubbles');
let convIndex = 0;

function spawnConversation() {
  if(!bubbleContainer) return;
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

if(bubbleContainer) {
  setInterval(spawnConversation, 6000);
  setTimeout(spawnConversation, 1500);
}


// ══════════════════════════════
// NOTIFICATION TOASTS
// ══════════════════════════════
const toasts = [
  { icon:'💝', iconClass:'pink',  title:'Sarah just opened her Love Code',      msg:"She's been on it for 4 minutes 😍",          time:'just now' },
  { icon:'🎉', iconClass:'gold',  title:'Ahmed sent a Love Code to Priya',      msg:'Anniversary surprise — scheduled for midnight', time:'2m ago'  },
  { icon:'😭', iconClass:'pink',  title:'New reaction received!',               msg:'"This made me cry happy tears" 💕',           time:'5m ago'  },
  { icon:'💍', iconClass:'gold',  title:'Proposal Love Code created',           msg:'Special delivery scheduled for Saturday',     time:'8m ago'  },
  { icon:'🔔', iconClass:'blue',  title:'Your Love Code was opened!',           msg:'Maria just unlocked your message ❤️',         time:'12m ago' },
  { icon:'✨', iconClass:'green', title:'500th Love Code milestone!',           msg:'Our community keeps growing 🎊',              time:'1h ago'  },
  { icon:'🎂', iconClass:'gold',  title:'Birthday Love Code delivered',         msg:'Sent to Jake at exactly midnight 🎈',         time:'2h ago'  },
  { icon:'💌', iconClass:'pink',  title:'New Love Code created',                msg:'Long distance couple from Mumbai 🌍',         time:'3h ago'  },
];

const toastContainer = document.getElementById('toastContainer');
let toastIndex = 0;

function showToast() {
  if(!toastContainer) return;
  const existing = toastContainer.querySelectorAll('.toast.show');
  if(existing.length >= 3) {
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

if(toastContainer) {
  setTimeout(() => showToast(), 800);
  setTimeout(() => showToast(), 3000);
  setTimeout(() => showToast(), 5500);
  setInterval(showToast, 5000);
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\app.js"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(js_to_append)

print("Interactive features logic appended successfully to app.js")
