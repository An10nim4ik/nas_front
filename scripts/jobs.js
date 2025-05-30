/*

!!!JOBS.JS global variables!!!
            START

*/

let curPage = 1;
let totalPages = 1;
let curKeyword = "";
let curSortField = "publication_time";
let with_salary = false;
let curProfField = "";
let minSalary = 0;
let curCurrecny = "KZT";
let curSchedule = "";
let curExp = "";
let curIndustry = "";
let curEmp = "";

/*

!!!JOBS.JS global variables
            END

*/



/*

!!!FUNCTIONS AFTER LOADING!!!
            START

*/

window.addEventListener('DOMContentLoaded', async() => {
    await fetchALlDicts();
    console.log("Fethced professional roles.1");
    await fetchVacancies();
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

/*

!!!FUNCTIONS AFTER LOADING!!!
            END

*/



/*

!!!BUILDING URL FOR FETCHING!!!
            START

*/

function buildUrl(){
    const baseUrl = "https://api.hh.ru/vacancies";
    const params = new URLSearchParams({
        host: "hh.kz",
        area: 40,
        page: curPage,
        text: curKeyword,
        order_by: curSortField,
        only_with_salary: with_salary,
        currency: curCurrecny
    });
    if(curEmp != "") params.set("employment", curEmp);
    if(curIndustry != "") params.set("industry", curIndustry); 
    if(curExp) params.set("experience", curExp);
    if(curSchedule != "") params.set("schedule", curSchedule);
    if(minSalary) params.set('salary', minSalary);
    if(curProfField != "")params.set('professional_role', curProfField);
    return `${baseUrl}?${params.toString()}`;
}

/*

!!!BUILDING URL FOR FETCHING!!!
            END

*/



/*

!!!FETCHING DATA!!!
            START

*/

async function fetchALlDicts(){
    fetchProfFields();
    fetchIndustries();
}

async function fetchIndustries() {
    try{
        let url = "https://api.hh.ru/industries";
        const response = await fetch(url);
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let data = await response.json();
        displayIndustries(data);
    }catch (error){
        console.error(`Error occured while fetching: ${error}`)
    }
}

async function fetchProfFields(){
    try{
        let url = "https://api.hh.ru/professional_roles";
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        displayProfFields(data.categories);
    }catch (error){
        console.error(`Issue occured when fetching: ${error}`);
    }
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

/*

!!!FETCHING DATA!!!
            END

*/



/*

!!!DISPLAY DATA AND FIELDS!!!
            START

*/

async function displayIndustries(industry){
    const container = document.getElementById('industries');
    container.innerHTML = `<option value="" selected>Choose</option>`;
    industry.forEach(cat =>{
        cat.industries.forEach(industries =>{
            const opt = document.createElement('option');
            opt.value = industries.id;
            opt.textContent = industries.name;
            container.appendChild(opt); 
        });
    });
}

async function displayProfFields(categories) {
    const container = document.getElementById('prof_field');
    container.innerHTML = `<option value="" selected>Choose</option>`;
    categories.forEach(cat =>{
        cat.roles.forEach(role =>{
            const opt = document.createElement('option');
            opt.value = role.id;
            opt.textContent = role.name;
            container.appendChild(opt);
        })
    });
}

async function displayData(vacancies) {
    const container = document.getElementById("vacancies");
    container.innerHTML = '';

    vacancies.forEach(vacancy => {
        const vacancyDiv = document.createElement('div');
        vacancyDiv.classList.add('vacancy-card'); // Optional class for styling

        let html = `
            <h3>${vacancy.name}</h3>
            <p><strong>Employer:</strong> ${vacancy.employer ? vacancy.employer.name : "N/A"}</p>
        `;

        if (vacancy.salary) {
            html += `
                <p><strong>Salary from:</strong> ${vacancy.salary.from ?? "N/A"}</p>
                <p><strong>Salary to:</strong> ${vacancy.salary.to ?? "N/A"}</p>
                <p><strong>Currency:</strong> ${vacancy.salary.currency ?? "N/A"}</p>
            `;
        } else {
            html += `<p><strong>Salary:</strong> Not specified</p>`;
        }

        html += `
            <a href="vacancy.html?id=${vacancy.id}" target="_blank">
                <div class="link"><p>More information</p></div>
            </a>
        `;

        vacancyDiv.innerHTML = html;
        container.appendChild(vacancyDiv);
    });
}

/*

!!!DISPLAY DATA AND FIELDS!!!
            END

*/



/*
.
!!!EVENT LISTENERS FOR FILTERS!!!
            START

*/

document.getElementById("search").addEventListener("input" , (event) => {
    curKeyword = event.target.value;
    curPage = 1;
    console.log(`Using search!\n${event.target.value}`);
    fetchVacancies();
});

document.getElementById("sortField").addEventListener("change" , (event) => {
    curSortField = event.target.value;
    curPage = 1;
    console.log(`using Sorting Field\n${event.target.value}`);
    fetchVacancies();
});

document.getElementById("checkboxsal").addEventListener("change", (event)=>{
    with_salary = event.target.checked;
    curPage = 1;
    console.log(`using With Salary Only\n${event.target.checked}`);
    fetchVacancies();
});

document.getElementById("prof_field").addEventListener("change", (event) =>{
    curProfField = event.target.value;
    curPage = 1;
    fetchVacancies();
})

document.getElementById("minSal").addEventListener("input", (event) =>{
    minSalary = event.target.value;
    curPage = 1;
    fetchVacancies();
});

document.getElementById("currency").addEventListener("change", (event) =>{
    curCurrecny = event.target.value;
    curPage = 1;
    fetchVacancies();    
});

document.getElementById("schedule").addEventListener("change", (event) =>{
    curSchedule = event.target.value;
    curPage = 1;
    fetchVacancies();
});

document.getElementById("experience").addEventListener("change", (event) =>{
    curExp = event.target.value;
    curPage = 1;
    fetchVacancies();
});

document.getElementById("industries").addEventListener("change", (event) =>{
    curIndustry = event.target.value;
    curPage = 1;
    fetchVacancies();
});

document.getElementById("employment").addEventListener("change", (event) =>{
    curEmp = event.target.value;
    curPage = 1;
    fetchVacancies();
})

/*

!!!EVENT LISTENERS FOR FILTERS!!!
            END

*/

 // Sample CVs - this should come from your backend
  const userCVs = [
    { id: 'cv1', name: 'Frontend Developer Resume' },
    { id: 'cv2', name: 'Data Analyst Resume' }
  ];

  // Render CV options
  const cvListDiv = document.getElementById('cv-list');
  userCVs.forEach(cv => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="cv" value="${cv.id}" required>
      ${cv.name}
    `;
    cvListDiv.appendChild(label);
    cvListDiv.appendChild(document.createElement('br'));
  });

  // Handle form submission
  document.getElementById('cv-selection-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedCV = document.querySelector('input[name="cv"]:checked').value;

    // Make request to ML backend
    try {
      const response = await fetch('/api/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv_id: selectedCV })
      });
      const data = await response.json();

      // Show recommendations
      const output = document.getElementById('recommendations-output');
      output.innerHTML = '<h3>Recommended Jobs:</h3><ul>' +
        data.recommendations.map(job => `<li>${job}</li>`).join('') +
        '</ul>';
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to fetch job recommendations.');
    }
  });

  // Example of adding CV items dynamically
const cvList = document.getElementById('cv-list');
cvData.forEach(cv => {
  const div = document.createElement('div');
  div.className = 'cv-item';
  div.textContent = cv.name;
  div.dataset.cvId = cv.id;
  cvList.appendChild(div);
});