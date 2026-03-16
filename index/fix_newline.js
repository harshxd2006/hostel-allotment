const fs = require('fs');
let html = fs.readFileSync('room_availability.html', 'utf8');
html = html.replace(/\\n\s*<div class="floor-container">/g, '\n                            <div class="floor-container">');
fs.writeFileSync('room_availability.html', html);
console.log('Fixed literal newlines in HTML.');
