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

// Function to filter students by name or roll number
function filterStudents() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase().trim();
    const table = document.getElementById('studentsTable');
    const tbody = document.getElementById('studentsTableBody');
    const rows = tbody.getElementsByTagName('tr');

    let visibleCount = 0;

    // Loop through all table rows
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nameCell = row.getElementsByTagName('td')[1]; // Name column
        const rollCell = row.getElementsByTagName('td')[2]; // Roll No column

        if (nameCell && rollCell) {
            const nameText = nameCell.textContent || nameCell.innerText;
            const rollText = rollCell.textContent || rollCell.innerText;

            // Check if either name or roll number matches the search
            if (nameText.toLowerCase().indexOf(filter) > -1 ||
                rollText.toLowerCase().indexOf(filter) > -1) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }
    }

    // Show "no results" message if needed
    showNoResultsMessage(visibleCount === 0);
}

// Function to show/hide "no results" message
function showNoResultsMessage(show) {
    let noResultsDiv = document.getElementById('noResults');

    // Create the message if it doesn't exist
    if (!noResultsDiv) {
        noResultsDiv = document.createElement('div');
        noResultsDiv.id = 'noResults';
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No students found matching your search.';

        const tableContainer = document.querySelector('.students-table-container');
        tableContainer.appendChild(noResultsDiv);
    }

    // Show or hide based on the parameter
    if (show) {
        noResultsDiv.classList.add('show');
    } else {
        noResultsDiv.classList.remove('show');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    console.log('Homepage loaded');

    // Show home section by default
    showSection('home');
});