const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'room_availability.html');
let content = fs.readFileSync(filePath, 'utf8');

// The problematic pattern is:
// onclick="selectRoom('<div class="
//     room available" onclick="selectRoom('201')">')">201</div>

// Or it could be room booked:
// onclick="selectRoom('<div class="
//     room booked" onclick="selectRoom('204')">')">204</div>

const regex = /onclick="selectRoom\('<div class="\s*(room (?:available|booked))"\s*onclick="selectRoom\('(\d{3})'\)">'\)">(\d{3})<\/div>/g;

content = content.replace(regex, (match, roomClass, roomNum1, roomNum2) => {
    return `onclick="selectRoom('${roomNum1}')">${roomNum1}</div>`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed file.');
