
css_to_append = """
.chat-bubbles {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}

.chat-bubble {
  position: absolute;
  max-width: 200px;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  font-size: 0.72rem;
  line-height: 1.5;
  font-weight: 500;
  opacity: 0;
  animation: bubblePop ease forwards;
}

.bubble-sender {
  background: linear-gradient(135deg, #dcf8c6, #c8f0a8);
  color: #1a3a0a;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.bubble-sender::before {
  content: '';
  position: absolute;
  bottom: 0; left: -7px;
  border: 8px solid transparent;
  border-right-color: #dcf8c6;
  border-bottom-color: #dcf8c6;
}

.bubble-receiver {
  background: rgba(255,255,255,0.95);
  color: #2a0a12;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.bubble-receiver::before {
  content: '';
  position: absolute;
  bottom: 0; right: -7px;
  border: 8px solid transparent;
  border-left-color: rgba(255,255,255,0.95);
  border-bottom-color: rgba(255,255,255,0.95);
}

.bubble-time {
  font-size: 0.55rem;
  opacity: 0.55;
  margin-top: 3px;
  text-align: right;
}

@keyframes bubblePop {
  0%   { opacity: 0; transform: scale(0.7) translateY(10px); }
  15%  { opacity: 1; transform: scale(1.05) translateY(0); }
  25%  { transform: scale(1); }
  75%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); }
}
"""

file_path = r"c:\Users\Acer\OneDrive\Documents\love_bites\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Chat bubble styles appended successfully to style.css")
