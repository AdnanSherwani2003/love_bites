
css_to_append = """
.floating-phrases {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
}

.float-phrase {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(232, 68, 90, 0.18);
    border-radius: 100px;
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b3040;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(232, 68, 90, 0.1);
    opacity: 0;
    animation: floatPhrase linear infinite;
}

@keyframes floatPhrase {
    0% {
        opacity: 0;
        transform: translateY(0px) scale(0.9);
    }

    8% {
        opacity: 1;
        transform: translateY(-10px) scale(1);
    }

    85% {
        opacity: 0.9;
        transform: translateY(-80px) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0.95);
    }
}
"""

file_path = r"c:\Users\Acer\OneDrive\Documents\love_bites\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_to_append)

print("Styles appended successfully to style.css")
