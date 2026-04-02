import os

def update_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Refactoring styles.css
styles_replacements = [
    ('--accent-blue: #00d2ff;', '--accent-orange: #ff6600;\n    --accent-red: #cc1100;'),
    ('--accent-cyan: #00f0ff;', '--accent-yellow: #ffaa00;'),
    ('--accent-blue', '--accent-orange'),
    ('--accent-cyan', '--accent-yellow'),
    ('gradient-text-blue', 'gradient-text-orange'),
    ('background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);', 'background: linear-gradient(90deg, #ff6600 0%, #ff3300 100%);'),
    ('background: linear-gradient(90deg, #00f0ff 0%, #a450ff 100%);', 'background: linear-gradient(90deg, #ffaa00 0%, #ff3300 100%);'),
    ('background: linear-gradient(90deg, #0099ff 0%, #833ab4 100%);', 'background: linear-gradient(90deg, #ffaa00 0%, #ff0000 100%);'),
    ('background: linear-gradient(90deg, #00d2ff, #833ab4);', 'background: linear-gradient(90deg, #ff6600, #ff3300);'),
    ('rgba(131, 58, 180, 0.4)', 'rgba(255, 51, 0, 0.4)'),
    ('rgba(83, 58, 180, 0.15) 0%, rgba(0, 210, 255, 0.05) 50%', 'rgba(255, 102, 0, 0.25) 0%, rgba(204, 17, 0, 0.1) 50%'),
    ('color: #00d2ff;', 'color: var(--accent-orange);'),
    ('rgba(0, 210, 255, 0.2)', 'rgba(255, 102, 0, 0.2)'),
    ('rgba(0, 240, 255, 0.4)', 'rgba(255, 170, 0, 0.4)'),
]

# Refactoring index.html
html_replacements = [
    ('gradient-text-blue', 'gradient-text-orange'),
    ('gradient-text-full', 'gradient-text-full'),
]

update_file('styles.css', styles_replacements)
update_file('index.html', html_replacements)

print("Theme updated successfully!")
