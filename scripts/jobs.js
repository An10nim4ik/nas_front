let curPage = 1;
let totalPages = 1;

window.addEventListener('DOMContentLoaded', function(){
    fetchVacancies();
});

window.addEventListener('DOMContentLoaded', function(){
    fetchVacancies();
    this.document.getElementById('prevBtn1').addEventListener('click', () =>{
        if(curPage > 1){
            curPage--;
            fetchVacancies();
        }
    });
    this.document.getElementById('prevBtn2').addEventListener('click', () =>{
        if(curPage > 1){
            curPage--;
            fetchVacancies();
        }
    });
    this.document.getElementById('nextBtn1').addEventListener('click', () =>{
        if(curPage < totalPages){
            curPage++;
            fetchVacancies();
        }
    });
    this.document.getElementById('nextBtn2').addEventListener('click', () =>{
        if(curPage < totalPages){
            curPage++;
            fetchVacancies();
        }
    });
});

function buildUrl(){
    const baseUrl = "https://api.hh.ru/vacancies";
    const params = new URLSearchParams({
        area: 40,
        page: curPage
    });
    return `${baseUrl}?${params.toString()}`;
}

async function fetchVacancies(){
    try{
        const url = buildUrl();
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        totalPages = data.pages || 1;
        document.getElementById('pageDisplay1').textContent = `Page ${curPage}`;
        document.getElementById('pageDisplay2').textContent = `Page ${curPage}`;
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
            <a href="${vacancy.alternate_url}" target="_blank"><div class="link"><p>More information</p></div></a>`;
        container.appendChild(vacancyDiv);

    });
}