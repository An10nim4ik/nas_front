window.addEventListener('DOMContentLoaded', function(){
    fetchVacancies();
});

async function fetchVacancies(){
    try{
        const response = await fetch("https://api.hh.ru/vacancies?area=40&currency=KZT")
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        displayData(data.items);
    }catch  (error){
        console.error("Error fetching vacancies:" , error);
    }
}   

async function displayData(vacancies){
    const container = document.getElementById("vacancies");
    container.innerHTML = '';

    vacancies.forEach(vacancy => {
        const vacancyDiv = document.createElement('div');
        vacancyDiv.innerHTML = `<h3>${vacancy.name}</h3>
            <p>Employer: ${vacancy.employer ? vacancy.employer.name : "N/A"}</p>
            <div class="link"><a href="${vacancy.alternate_url}" target="_blank">More information</a></div>`;
        container.appendChild(vacancyDiv);

    });
}