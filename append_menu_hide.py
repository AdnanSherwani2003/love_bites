
css_to_append = """

/* Hide notifications when mobile menu is open */
body.menu-open .toast-container {
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden;
    transition: opacity 0.3s ease;
}
"""

file_path = r"c:\\Users\\Acer\\OneDrive\\Documents\\love_bites\\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Menu-open hiding CSS appended to style.css")
