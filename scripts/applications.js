document.addEventListener('DOMContentLoaded', () => {
    // Function to change status
    const changeStatus = (event) => {
        const statusElement = event.target;
        const currentStatus = statusElement.classList[1]; // Get current status class

        // Define the next status cycle
        const statusCycle = ['accepted', 'under-consideration', 'rejected', 'unseen'];
        const nextStatus = statusCycle[(statusCycle.indexOf(currentStatus) + 1) % statusCycle.length];

        // Update status class and tooltip
        statusElement.classList.remove(currentStatus);
        statusElement.classList.add(nextStatus);
        statusElement.setAttribute('data-tooltip', getStatusTooltip(nextStatus));
    };

    // Function to get status tooltip text
    const getStatusTooltip = (status) => {
        switch (status) {
            case 'accepted':
                return 'Congratulations! Your application has been accepted.';
            case 'rejected':
                return 'Unfortunately, your application has been rejected.';
            case 'under-consideration':
                return 'Your application is currently under consideration.';
            case 'unseen':
                return 'The employer has not seen your application yet.';
            default:
                return '';
        }
    };

    // Add event listeners to status badges for changing status
    const statusBadges = document.querySelectorAll('.vacancy-status');
    statusBadges.forEach((statusBadge) => {
        statusBadge.addEventListener('click', changeStatus);
    });

    // Function to add a new vacancy dynamically
    const addVacancyButton = document.createElement('button');
    addVacancyButton.textContent = 'Add Vacancy';
    addVacancyButton.style.marginTop = '20px';
    document.querySelector('main').appendChild(addVacancyButton);

    addVacancyButton.addEventListener('click', () => {
        const vacancyList = document.querySelector('.vacancies-list');
        const newVacancy = document.createElement('div');
        newVacancy.classList.add('vacancy');

        const newVacancyTitle = document.createElement('div');
        newVacancyTitle.classList.add('vacancy-title');
        newVacancyTitle.textContent = 'New Job Vacancy';

        const newStatus = document.createElement('div');
        newStatus.classList.add('vacancy-status', 'unseen');
        newStatus.setAttribute('data-tooltip', 'The employer has not seen your application yet.');

        newVacancy.appendChild(newVacancyTitle);
        newVacancy.appendChild(newStatus);
        vacancyList.appendChild(newVacancy);

        // Add event listener for the newly added status badge
        newStatus.addEventListener('click', changeStatus);
    });
});

// Add this inside DOMContentLoaded
const vacancyItems = document.querySelectorAll('.vacancy');
const detailsContent = document.getElementById('vacancy-details-content');

vacancyItems.forEach((vacancy) => {
    vacancy.addEventListener('click', () => {
        const title = vacancy.querySelector('.vacancy-title').textContent;
        const status = vacancy.querySelector('.vacancy-status').textContent;
        detailsContent.innerHTML = `
            <div>
                <h2 style="font-size:20px; color:#343A40;">${title}</h2>
                <p style="margin-top:10px;">Status: <strong>${status}</strong></p>
                <p style="margin-top:10px; color: #6c757d;">More detailed description about the vacancy will appear here...</p>
            </div>
        `;
    });
});