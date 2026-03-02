
css_to_append = """
/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 90px;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(232,68,90,0.15);
  border-radius: 14px;
  padding: 0.65rem 1rem;
  min-width: 260px;
  max-width: 300px;
  box-shadow: 0 8px 32px rgba(232,68,90,0.14);
  opacity: 0;
  transform: translateX(110%);
  position: relative;
  pointer-events: all;
}

.toast.show {
  animation: slideInToast 0.5s cubic-bezier(.34,1.56,.64,1) forwards;
}

.toast.hide {
  animation: slideOutToast 0.4s ease forwards;
}

@keyframes slideInToast {
  from { opacity: 0; transform: translateX(110%); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideOutToast {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(110%); }
}

.toast-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.toast-icon.pink   { background: rgba(232,68,90,0.1); }
.toast-icon.green  { background: rgba(52,199,89,0.1); }
.toast-icon.blue   { background: rgba(0,122,255,0.1); }
.toast-icon.gold   { background: rgba(255,165,0,0.1); }

.toast-body { flex: 1; min-width: 0; }

.toast-title {
  font-size: 0.72rem; font-weight: 700;
  color: #2a0a12; margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.toast-msg {
  font-size: 0.65rem;
  color: #6b3040; line-height: 1.4;
}

.toast-time {
  font-size: 0.6rem;
  color: rgba(107,48,64,0.5);
  flex-shrink: 0; align-self: flex-start; margin-top: 2px;
}

.toast-progress {
  position: absolute;
  bottom: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b80, #e8445a);
  border-radius: 0 0 14px 14px;
  width: 100%;
  transform-origin: left;
  animation: progressBar 4s linear forwards;
}

@keyframes progressBar {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Toast styles appended successfully to style.css")
