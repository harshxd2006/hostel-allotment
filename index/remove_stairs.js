const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'room_availability.html');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to remove stairs-area
const stairsRegex = /<div class="stairs-area">[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(stairsRegex, '');

// Regex to remove batch-info-area
const batchRegex = /<div class="batch-info-area">[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(batchRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed stairs and batch info.');
