const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'room_availability.html');
let content = fs.readFileSync(filePath, 'utf8');

// The problematic pattern is:
// onclick="selectRoom('<div class=" room available"
//                                                 onclick="selectRoom('306')">')">306</div>
//
// OR anything inside selectRoom('<div ... >')
const regex = /onclick="selectRoom\('<div[^>]*>'\)">(\w+)<\/div>/g;

content = content.replace(regex, (match, roomNum) => {
    return `onclick="selectRoom('${roomNum}')">${roomNum}</div>`;
});

// Wait, let's just make sure we replace any onclick="selectRoom('<div ... ">')">
// A better regex that handles newlines:
const regex2 = /onclick="selectRoom\('<div[\s\S]*?onclick="selectRoom\('(\w+)'\)">'\)">/g;

content = content.replace(regex2, "onclick=\"selectRoom('$1')\">");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed file multi-line.');
