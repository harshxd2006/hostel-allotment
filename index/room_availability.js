// Function to change floors
function changeFloor(floor) {
    // Hide all floor maps
    const allFloors = document.querySelectorAll('.floor-map');
    allFloors.forEach(f => f.style.display = 'none');

    // Show selected floor
    const selectedFloor = document.getElementById('floor-' + floor);
    if (selectedFloor) {
        selectedFloor.style.display = 'flex';
    }

    // Update active button
    const allButtons = document.querySelectorAll('.floor-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        const btn = event.target.closest('.floor-btn');
        if (btn) btn.classList.add('active');
    }
}

// Function to filter rooms by capacity
function filterByCapacity(capacity) {
    const allRooms = document.querySelectorAll('.room');

    allRooms.forEach(room => {
        if (capacity === 'all') {
            room.classList.remove('hidden');
        } else {
            const roomCapacity = room.getAttribute('data-capacity');
            if (roomCapacity === capacity) {
                room.classList.remove('hidden');
            } else {
                room.classList.add('hidden');
            }
        }
    });

    // Update active filter button
    const allFilterButtons = document.querySelectorAll('.capacity-filter-btn');
    allFilterButtons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        const btn = event.target.closest('.capacity-filter-btn');
        if (btn) btn.classList.add('active');
    }
}

// Function to select a room
function selectRoom(roomNumber) {
    const room = event.target.closest('.room');
    if (!room) return;

    // Check if room is booked
    if (room.classList.contains('booked')) {
        alert('Sorry, this room is already booked!');
        return;
    }

    // Check if room is hidden by filter
    if (room.classList.contains('hidden')) {
        return;
    }

    // Remove 'selected' class from all rooms
    const allRooms = document.querySelectorAll('.room');
    allRooms.forEach(r => r.classList.remove('selected'));

    // Add 'selected' class to clicked room
    room.classList.add('selected');

    // Optional: Show confirmation
    console.log('Selected room:', roomNumber);
}

// Function to show different sections
function showSection(sectionName) {
    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => section.style.display = 'none');

    // Show selected section
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update sidebar active state
    const allSidebarSections = document.querySelectorAll('.sidebar-section');
    allSidebarSections.forEach(section => section.classList.remove('active'));

    const activeSidebar = document.getElementById('sidebar-' + sectionName);
    if (activeSidebar) {
        activeSidebar.classList.add('active');
    }
}

// --- Tooltip for Booked Rooms ---
function initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'room-tooltip';
    document.body.appendChild(tooltip);

    const roomDataCache = {};
    const firstNames = ["Aarav", "Ananya", "Rahul", "Priya", "Vikram", "Neha", "Rohan", "Sneha", "Karan", "Pooja", "Arjun", "Aditi", "Ravi", "Simran"];
    const lastNames = ["Sharma", "Verma", "Singh", "Patel", "Gupta", "Das", "Jain", "Mehta", "Rao", "Kumar", "Yadav", "Chauhan"];

    function getRandomName() {
        return firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
    }

    function generateOccupants(capacity) {
        const leaderCgpi = (8.5 + Math.random() * 1.49).toFixed(2); // CGPI between 8.50 and 9.99
        const occupants = [];
        
        // Add Leader
        occupants.push({ name: getRandomName(), cgpi: leaderCgpi, isLeader: true });
        
        // Add Roommates
        for (let i = 1; i < capacity; i++) {
            const roommateCgpi = (6.5 + Math.random() * (parseFloat(leaderCgpi) - 0.1 - 6.5)).toFixed(2); // Always strictly <= leader
            occupants.push({ name: getRandomName(), cgpi: roommateCgpi, isLeader: false });
        }
        return occupants;
    }

    const bookedRooms = document.querySelectorAll('.room.booked');
    
    bookedRooms.forEach(room => {
        room.addEventListener('mouseenter', () => {
            // Get just the text part before the capacity badge span
            const roomNumberText = room.childNodes[0].nodeValue.trim();
            const capacity = parseInt(room.getAttribute('data-capacity')) || 3;

            if (!roomDataCache[roomNumberText]) {
                roomDataCache[roomNumberText] = generateOccupants(capacity);
            }
            
            const occupants = roomDataCache[roomNumberText];
            
            let html = `<div class="tooltip-title">Room ${roomNumberText} Occupants</div>`;
            occupants.forEach(occ => {
                if (occ.isLeader) {
                    html += `
                        <div class="tooltip-leader">
                            <span>👑 ${occ.name}</span>
                            <span class="cgpi-badge">CGPI: ${occ.cgpi}</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="tooltip-roommate">
                            <span>${occ.name}</span>
                            <span class="cgpi-badge">CGPI: ${occ.cgpi}</span>
                        </div>
                    `;
                }
            });

            tooltip.innerHTML = html;
            tooltip.classList.add('show');
            
            // Positioning
            const rect = room.getBoundingClientRect();
            let topPosition = rect.top + window.scrollY - tooltip.offsetHeight - 12;
            let leftPosition = rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2);
            
            // Flip to bottom if there's no space on top
            if (topPosition < window.scrollY) {
                topPosition = rect.bottom + window.scrollY + 12;
            }
            
            // Adjust left if goes out of screen bounds
            if (leftPosition < window.scrollX + 12) {
                leftPosition = window.scrollX + 12;
            } else if (leftPosition + tooltip.offsetWidth > window.scrollX + window.innerWidth - 12) {
                leftPosition = window.scrollX + window.innerWidth - tooltip.offsetWidth - 12;
            }

            tooltip.style.top = topPosition + 'px';
            tooltip.style.left = leftPosition + 'px';
        });

        room.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard loaded');

    // Show room availability section by default
    showSection('room-availability');
    
    // Initialize hover tooltips for booked rooms
    initTooltips();
});