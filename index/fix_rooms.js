const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'room_availability.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

function generateFloorHtml(floorNum) {
    let html = `                            <div class="floor-container">\n                                <div class="outer-building">\n`;
    
    // To make sure base works correctly with 1-based indexing for 100, we add base
    const base = floorNum * 100;
    
    function getRoomHtml(num, cap) {
        const status = Math.random() > 0.8 ? 'booked' : 'available';
        return `                                    <div class="room ${status}" data-capacity="${cap}" onclick="selectRoom('${num}')">
                                        ${num}<span class="capacity-badge">${cap}</span></div>`;
    }

    // Left side: going down to top = 101 to 109. Since it's a column, first in HTML is top.
    html += `\n                                    <div class="left-rooms">\n`;
    for(let i=9; i>=1; i--) { html += getRoomHtml(base + i, 4) + '\n'; }
    html += `                                    </div>\n`;

    // Top side: going left to right = 110 to 118.
    html += `\n                                    <div class="top-rooms">\n`;
    for(let i=10; i<=18; i++) { html += getRoomHtml(base + i, 4) + '\n'; }
    html += `                                    </div>\n`;

    // Right side: going top to bottom = 119 to 127.
    html += `\n                                    <div class="right-rooms">\n`;
    for(let i=19; i<=27; i++) { html += getRoomHtml(base + i, 3) + '\n'; }
    html += `                                    </div>\n`;

    // Bottom side: going right to left = 128 to 136. Since it's a row, left is first in HTML.
    // So if rightmost is 128, leftmost should be 136.
    html += `\n                                    <div class="bottom-rooms">\n`;
    for(let i=36; i>=28; i--) { html += getRoomHtml(base + i, 3) + '\n'; }
    html += `                                    </div>\n`;

    html += `\n                                    <div class="inner-building">\n`;
    html += `                                        <div class="inner-top-rooms">\n`;
    html += getRoomHtml(base + 37, 3) + '\n';
    html += getRoomHtml(base + 38, 3) + '\n';
    html += `                                        </div>\n`;
    html += `                                        <div class="inner-center"></div>\n`;
    html += `                                        <div class="inner-bottom-rooms">\n`;
    html += getRoomHtml(base + 39, 3) + '\n';
    html += getRoomHtml(base + 40, 3) + '\n';
    html += `                                        </div>\n`;
    html += `                                    </div>\n`;
    
    html += `\n                                </div>\n                            </div>`;
    return html;
}

for (let floor = 1; floor <= 6; floor++) {
    // We isolate <div class="floor-container"> through </div>                         </div>
    const startStr = `<div class="floor-map" id="floor-${floor}" style="display: none;">`;
    const endStr = floor === 6 ? `<!-- Legend -->` : `<!-- ${floor+1}st Floor Map -->`;
    const endStrAlt = floor === 6 ? `<!-- Legend -->` : `<!-- ${floor+1}nd Floor Map -->`;
    const endStrAlt2 = floor === 6 ? `<!-- Legend -->` : `<!-- ${floor+1}rd Floor Map -->`;
    const endStrAlt3 = floor === 6 ? `<!-- Legend -->` : `<!-- ${floor+1}th Floor Map -->`;
    
    let parts = htmlContent.split(startStr);
    if(parts.length > 1) {
        let afterStart = parts[1];
        let extractEnd = afterStart.indexOf('<!-- Legend -->');
        if (floor < 6) {
            let matches = afterStart.match(/<!-- \d[a-z]{2} Floor Map -->/);
             if (matches) extractEnd = matches.index;
        }

        let toReplace = afterStart.substring(0, extractEnd);
        let replaced = '\n' + generateFloorHtml(floor) + '\n                        </div>\n\n                        ';
        
        htmlContent = parts[0] + startStr + replaced + afterStart.substring(extractEnd);
    }
}

fs.writeFileSync(htmlPath, htmlContent);
console.log('Successfully updated HTML maps for down-to-top logic!');
