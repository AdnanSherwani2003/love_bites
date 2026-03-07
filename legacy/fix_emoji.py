
import os

file_path = r"c:\Users\Acer\OneDrive\Documents\love_bites\index.html"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "End-To-End-Encrypted" in line:
        new_lines.append('                    <span style="display: inline-flex; align-items: center; gap: 4px;">\n')
        new_lines.append('                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--rose-light);">\n')
        new_lines.append('                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>\n')
        new_lines.append('                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>\n')
        new_lines.append('                        </svg>\n')
        new_lines.append('                        End-To-End-Encrypted\n')
        new_lines.append('                    </span>\n')
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("File updated successfully")
