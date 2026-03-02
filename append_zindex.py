
css_to_append = """

/* ── Z-INDEX LAYERING ── */
#bgWords,
#bgShapes,
.bg-words,
.bg-shapes {
  z-index: 1;
}

.hero-overlay {
  z-index: 2;
}

.hearts-bg {
  z-index: 3;
}

.floating-phrases,
.chat-bubbles,
.fading-words,
.fading-quote {
  z-index: 5;
}

.hero-content {
  z-index: 10;
}

.toast-container {
  z-index: 9999;
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Z-index overrides appended to style.css")
