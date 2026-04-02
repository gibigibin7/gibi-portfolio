const fs = require('fs');

function updateFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [oldStr, newStr] of replacements) {
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(filepath, content, 'utf8');
}

const stylesReplacements = [
    ['--accent-blue: #00d2ff;', '--accent-orange: #ff4e00;\n    --accent-red: #cc1100;'],
    ['--accent-cyan: #00f0ff;', '--accent-yellow: #ffaa00;'],
    ['var(--accent-blue)', 'var(--accent-orange)'],
    ['var(--accent-cyan)', 'var(--accent-yellow)'],
    ['gradient-text-blue', 'gradient-text-orange'],
    ['background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);', 'background: linear-gradient(90deg, #ff4e00 0%, #ffaa00 100%);'],
    ['background: linear-gradient(90deg, #00f0ff 0%, #a450ff 100%);', 'background: linear-gradient(90deg, #ffaa00 0%, #ff3300 100%);'],
    ['background: linear-gradient(90deg, #0099ff 0%, #833ab4 100%);', 'background: linear-gradient(90deg, #ffaa00 0%, #cc1100 100%);'],
    ['background: linear-gradient(90deg, #00d2ff, #833ab4);', 'background: linear-gradient(90deg, #ff4e00, #cc1100);'],
    ['rgba(131, 58, 180, 0.4)', 'rgba(204, 17, 0, 0.4)'],
    ['rgba(83, 58, 180, 0.15) 0%, rgba(0, 210, 255, 0.05) 50%', 'rgba(255, 78, 0, 0.4) 0%, rgba(204, 17, 0, 0.1) 50%'],
    ['color: #00d2ff;', 'color: var(--accent-orange);'],
    ['rgba(0, 210, 255, 0.2)', 'rgba(255, 78, 0, 0.2)'],
    ['rgba(0, 240, 255, 0.4)', 'rgba(255, 170, 0, 0.4)'],
];

const htmlReplacements = [
    ['gradient-text-blue', 'gradient-text-orange']
];

updateFile('styles.css', stylesReplacements);
updateFile('index.html', htmlReplacements);
console.log('Theme updated successfully with Node!');
