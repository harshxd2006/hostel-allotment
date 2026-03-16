const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'room_availability.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Update outer-building columns if it currently has 1fr
cssContent = cssContent.replace(/grid-template-columns: auto 1fr;/g, 'grid-template-columns: auto 1fr auto;');

// Ensure .outer-building gap is updated correctly if needed (we'll leave it as is)

if (!cssContent.includes('.right-rooms')) {
    const newCss = `
.left-rooms {
    grid-column: 1;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    justify-content: center;
    margin-left: -15px;
}
.left-rooms .room {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.top-rooms {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: flex-start;
    margin-top: -15px;
}
.top-rooms .room {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.right-rooms {
    grid-column: 3;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
    justify-content: center;
    margin-right: -15px;
}
.right-rooms .room {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
`;
    cssContent = cssContent.replace('/* ── Inner Building ── */', newCss + '\n/* ── Inner Building ── */');
}
fs.writeFileSync(cssPath, cssContent);

const htmlPath = path.join(__dirname, 'room_availability.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

function generateFloorHtml(floorNum) {
    let html = `                            <div class="floor-container">\n                                <div class="outer-building">\n`;
    
    const base = floorNum * 100;
    
    function getRoomHtml(num) {
        const cap = Math.random() > 0.5 ? 4 : 3;
        const status = Math.random() > 0.8 ? 'booked' : 'available';
        return `                                    <div class="room ${status}" data-capacity="${cap}" onclick="selectRoom('${num}')">
                                        ${num}<span class="capacity-badge">${cap}</span></div>`;
    }

    html += `\n                                    <div class="left-rooms">\n`;
    for(let i=0; i<9; i++) { html += getRoomHtml(base + i) + '\n'; }
    html += `                                    </div>\n`;

    html += `\n                                    <div class="top-rooms">\n`;
    for(let i=9; i<18; i++) { html += getRoomHtml(base + i) + '\n'; }
    html += `                                    </div>\n`;

    html += `\n                                    <div class="right-rooms">\n`;
    for(let i=18; i<27; i++) { html += getRoomHtml(base + i) + '\n'; }
    html += `                                    </div>\n`;

    html += `\n                                    <div class="bottom-rooms">\n`;
    for(let i=27; i<36; i++) { html += getRoomHtml(base + i) + '\n'; }
    html += `                                    </div>\n`;

    html += `\n                                    <div class="inner-building">\n`;
    html += `                                        <div class="inner-top-rooms">\n`;
    html += getRoomHtml(base + 36) + '\n';
    html += getRoomHtml(base + 37) + '\n';
    html += `                                        </div>\n`;
    html += `                                        <div class="inner-center"></div>\n`;
    html += `                                        <div class="inner-bottom-rooms">\n`;
    html += getRoomHtml(base + 38) + '\n';
    html += getRoomHtml(base + 39) + '\n';
    html += `                                        </div>\n`;
    html += `                                    </div>\n`;
    
    html += `\n                                </div>\n                            </div>\n`;
    return html;
}

for (let floor = 1; floor <= 6; floor++) {
    const startMarker = `<div class="floor-map" id="floor-${floor}" style="display: none;">`;
    let startIndex = htmlContent.indexOf(startMarker);
    if (startIndex !== -1) {
        let innerStart = startIndex + startMarker.length;
        
        let endPattern;
        if (floor < 6) {
            const nextF = floor + 1;
            const suffix = nextF === 2 ? 'nd' : nextF === 3 ? 'rd' : 'th';
            endPattern = `<!-- ${nextF}${suffix} Floor Map -->`;
        } else {
            endPattern = `<!-- Legend -->`;
        }
        
        // Wait, "<!-- Legend -->" is after floor 6. Currently floor 6 ends securely before `<div id="queue-status-section"`.
        // Let's use `</div>\n\n                    </div>\n\n                    <!-- Legend -->` as a guide.
        // Or safely just look for `<!-- Legend -->` and backtrack to first `</div>` for floor-map
        
        let nextMarkerIndex = htmlContent.indexOf(endPattern, innerStart);
        if (nextMarkerIndex !== -1) {
            // we back track 3 divs: </div></div></div>
            // Actually, we can just grab everything from startMarker until `<div class="floor-map" id="floor-${floor+1}` or `</div>\n\n                    </div>\n\n                    <!-- Legend -->`
            let endIndex = htmlContent.lastIndexOf('</div>', nextMarkerIndex);
            endIndex = htmlContent.lastIndexOf('</div>', endIndex - 1);
            endIndex = htmlContent.lastIndexOf('</div>', endIndex - 1) + 6; // Include that closing div

            let newFloorHtml = '\\n' + generateFloorHtml(floor) + '                        ';
            
            htmlContent = htmlContent.substring(0, innerStart) + newFloorHtml + htmlContent.substring(endIndex);
        }
    }
}

fs.writeFileSync(htmlPath, htmlContent);
console.log('Floors rebuilt successfully');
