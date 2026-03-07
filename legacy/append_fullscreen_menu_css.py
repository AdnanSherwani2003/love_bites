
css_to_append = """

/* ══ TINDER STYLE FULLSCREEN MENU ══ */

.fullscreen-menu {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: linear-gradient(160deg, #fff5f7 0%, #ffe8ed 100%);
  transform: translateX(105%);
  transition: transform 0.42s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fullscreen-menu.open {
  transform: translateX(0);
}

.menu-topbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.4rem;
  border-bottom: 1px solid rgba(232,68,90,0.1);
  flex-shrink: 0;
}

.menu-close-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(232,68,90,0.08);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--rose-dark);
  transition: all 0.2s;
}

.menu-close-btn:hover {
  background: rgba(232,68,90,0.15);
  transform: scale(1.05);
}

.menu-items {
  flex: 1;
  padding: 0.5rem 0;
  overflow-y: auto;
}

.menu-section-label {
  padding: 0.8rem 1.4rem 0.3rem;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--rose);
  opacity: 0.7;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.4rem;
  height: 68px;
  border-bottom: 1px solid rgba(232,68,90,0.07);
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, var(--rose-light), var(--rose));
  transform: scaleY(0);
  transition: transform 0.2s;
  border-radius: 0 2px 2px 0;
}

.menu-item:hover { background: rgba(232,68,90,0.04); }
.menu-item:hover::before { transform: scaleY(1); }
.menu-item:active { background: rgba(232,68,90,0.08); }

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.menu-item-icon {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.icon-rose  { background: rgba(232,68,90,0.1); }
.icon-pink  { background: rgba(255,107,128,0.1); }
.icon-gold  { background: rgba(255,165,0,0.1); }
.icon-blue  { background: rgba(0,122,255,0.1); }
.icon-green { background: rgba(52,199,89,0.1); }

.menu-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  letter-spacing: -0.01em;
}

.menu-item-sub {
  font-size: 0.65rem;
  color: var(--text-mid);
  opacity: 0.65;
}

.menu-item-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-arrow {
  font-size: 1rem;
  color: rgba(107,48,64,0.3);
}

.menu-badge {
  background: var(--rose);
  color: #fff;
  font-size: 0.52rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 100px;
}

.menu-footer {
  padding: 1rem 1.4rem 1.6rem;
  border-top: 1px solid rgba(232,68,90,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex-shrink: 0;
}

.menu-btn-create {
  width: 100%;
  background: linear-gradient(135deg, var(--rose-light), var(--rose), var(--rose-dark));
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.9rem;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(232,68,90,0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.menu-btn-create::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%);
}

.menu-btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(232,68,90,0.5);
}

.menu-btn-signin {
  width: 100%;
  background: transparent;
  color: var(--rose-dark);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.8rem;
  border-radius: 14px;
  border: 1.5px solid rgba(192,41,62,0.25);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.menu-btn-signin:hover {
  background: rgba(232,68,90,0.05);
  border-color: var(--rose);
}

/* Staggered entry animations */
.menu-item,
.menu-section-label {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s;
}

.fullscreen-menu.open .menu-section-label { 
  opacity: 1; 
  transform: translateX(0);
  transition-delay: 0.05s;
}

.fullscreen-menu.open .menu-item:nth-child(1) { opacity:1; transform:translateX(0); transition-delay: 0.08s; }
.fullscreen-menu.open .menu-item:nth-child(2) { opacity:1; transform:translateX(0); transition-delay: 0.13s; }
.fullscreen-menu.open .menu-item:nth-child(3) { opacity:1; transform:translateX(0); transition-delay: 0.18s; }
.fullscreen-menu.open .menu-item:nth-child(4) { opacity:1; transform:translateX(0); transition-delay: 0.23s; }
.fullscreen-menu.open .menu-item:nth-child(5) { opacity:1; transform:translateX(0); transition-delay: 0.28s; }

.menu-footer {
  opacity: 0;
  transition: opacity 0.3s ease 0.32s;
}

.fullscreen-menu.open .menu-footer {
  opacity: 1;
}

/* Only show on mobile */
@media (min-width: 769px) {
  .fullscreen-menu { display: none; }
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Fullscreen menu CSS appended to style.css")
