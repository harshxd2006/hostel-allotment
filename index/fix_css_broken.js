const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'room_availability.css');
let lines = fs.readFileSync(cssPath, 'utf8').split('\n');

// 347 corresponds to index 346. Keep up to line 347
let before = lines.slice(0, 347);

// 566 is .left-rooms
let after = lines.slice(565);

let fix = [
    '.top-center-rooms .room {',
    '    border-top-left-radius: 0;',
    '    border-top-right-radius: 0;',
    '}',
    '',
    '.bottom-rooms {',
    '    grid-column: 2;',
    '    grid-row: 3;',
    '    display: flex;',
    '    gap: 8px;',
    '    justify-content: center;',
    '    align-items: flex-end;',
    '    margin-bottom: -15px;',
    '}',
    '',
    '.bottom-rooms .room {',
    '    border-bottom-left-radius: 0;',
    '    border-bottom-right-radius: 0;',
    '}',
    ''
];

// Combine them
let newLines = before.concat(fix).concat(after);
fs.writeFileSync(cssPath, newLines.join('\n'));
console.log('Fixed CSS file!');
