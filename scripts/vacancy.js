window.addEventListener("DOMContentLoaded", () => {
    const params = new URL(window.location.href).searchParams;
    const vacancyId = params.get('id');
    if(!vacancyId){
        document.getElementById("vacancy-detail").textContent = "No vacancy founded with this ID";
        return;
    }
    fetchVacancyDetail(vacancyId);
});


async function fetchVacancyDetail(id){
    try{
        const url = `https://api.hh.ru/vacancies/${id}`;
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP ${response.status}`);
        }
        const vacancy = await response.json();
        renderVacancyDetail(vacancy);
    }catch (error){
        document.getElementById("vacancy-detail").textContent = `Error has occured, ${error}`;
        console.error(error);
    }
}

function renderVacancyDetail(vacancy){
    const container = document.getElementById("vacancy-detail");
    container.innerHTML = `
        <h1>${vacancy.name}</h1>
        <h2>${vacancy.employer ? vacancy.employer.name : "N/A"}</h2>
        <p><strong>Published</strong> ${new Date(vacancy.published_at).toLocaleDateString()} </p>
        <p><strong> Salary: </strong>`;
    if(vacancy.salary){
        if(vacancy.salary.from){
            container.innerHTML += `<p>Salary from: ${vacancy.salary.from}</p>`;
        }
        if(vacancy.salary.to){  
            container.innerHTML += `<p>Salary to: ${vacancy.salary.to}</p>`;
        }
        container.innerHTML += `<p>Currecy ${vacancy.salary.currency}`;
    }else{
        container.innerHTML += `<p>Not specified</p>`;
    }
    if(vacancy.snippet){
        container.innerHTML += `
            <h3> Responsibility: ${vacancy.snippet.responsibility ? vacancy.snippet.responsibility : "-"}
            <h3> Requirements: ${vacancy.snippet.requirement ? vacancy.snippet.requirement : "-"}</h3>
        `;
    }
    container.innerHTML += `
        <div> ${vacancy.description || '-'} </div>
        <a href="${vacancy.alternate_url}" target="_blank"><div class="link"><p>Look at this vacancy on hh.kz</p></div></a>
    `;
}