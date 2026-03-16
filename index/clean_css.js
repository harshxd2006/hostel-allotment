const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'room_availability.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// remove all negative margins in .outer-building's rooms
cssContent = cssContent.replace(/margin-left:\s*-[0-9]+px;/g, 'margin-left: 0;');
cssContent = cssContent.replace(/margin-right:\s*-[0-9]+px;/g, 'margin-right: 0;');
cssContent = cssContent.replace(/margin-top:\s*-[0-9]+px;/g, 'margin-top: 0;');
cssContent = cssContent.replace(/margin-bottom:\s*-[0-9]+px;/g, 'margin-bottom: 0;');

// We want to remove the border-radius overrides which make the rooms flat on one side.
// Instead of deleting the entire block, we can just comment out the border-radius logic
// or replace the selectors with empty bodies.

cssContent = cssContent.replace(/\.(top-left-rooms|top-center-rooms|left-rooms|top-rooms|right-rooms|bottom-rooms|inner-top-rooms|inner-bottom-rooms)\s+\.room\s*\{[^}]+\}/g, '');

fs.writeFileSync(cssPath, cssContent);
console.log('Fixed CSS margins and border radius.');
