// const backgrounds = ["url('../imgs/Industrial_Control_Room.jpeg')", "url('imgs/Man_Working_in_Cozy.jpeg')", "url('imgs/Woodworker_at_Work.jpeg')"]
// const randomIndex = Math.floor(Math.random() * backgrounds.length);
// const section = document.querySelector(".section-about");
// section.style.backgroundImage = backgrounds[randomIndex];


// const links = document.querySelectorAll('.section-anchor__links a');

//   links.forEach(link => {
//     link.addEventListener('click', function () {
//       // Remove active class from all links
//       links.forEach(l => l.classList.remove('active'));
//       // Add active class to the clicked link
//       this.classList.add('active');
//     });
//   });

let curQuery = "job market";

let history = [];

window.addEventListener("DOMContentLoaded", function(){
  fetchNews();
});


const articleModal = document.getElementById('articleModal');
const modalTitle = articleModal.querySelector('#modalTitle');
const modalAuthor = articleModal.querySelector('.modal-author');
const modalImage = articleModal.querySelector('.modal-image');
const modalDesc = articleModal.querySelector('.modal-desc');
const modalReadMore = articleModal.querySelector('.modal-readmore');
const modalCloseBtn = document.getElementById('modalClose');


function openModal(article){
  modalTitle.textContent = article.title;
  modalAuthor.textContent = article.author || 'Unknown Author';
  modalImage.src = article.urlToImage || '';
  modalImage.alt = article.title;
  modalDesc.textContent = article.description || '';
  modalReadMore.href = article.url;
  articleModal.style.display = 'flex';
  articleModal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  articleModal.style.display = 'none';
  articleModal.setAttribute('aria-hidden','true');
}


modalCloseBtn.addEventListener('click', closeModal);
articleModal.addEventListener('click', e => {
  if(e.target === articleModal) closeModal();
});


const apikey = "deda703e77e64b8884a17623e6598ff1";

function buildUrl(){
  let baseUrl = "https://newsapi.org/v2/everything";
  let API_KEY = apikey;
  const query = curQuery;
  const url = `${baseUrl}?q=${query}&apiKey=${API_KEY}`; 
  return url;
}

async function fetchNews(){
  try{
    const url = buildUrl();
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    displayData(data.articles);
  }catch (error){
    console.error("Error fetching news org: ", error);
  }
}


async function displayData(articles){
  const container = document.getElementById("news");
  container.innerHTML = '';

  articles.forEach(article => {
    const newsDiv = document.createElement("div");
    newsDiv.innerHTML = `<h1>${article.title}</h1>
      <h5>${article.description}</h5>
      <div class="link"><p>More information</p></div>
    `;

    container.appendChild(newsDiv);
    newsDiv.querySelector('.link').addEventListener('click', () =>{
      openModal(article);
    });
  });
}

document.getElementById('search').addEventListener('input', (event) =>{
  curQuery = event.target.value;
  console.log(`Using search! input = ${event.target.value}`);
  fetchNews();
  displayHistory();
});

document.getElementById('search').addEventListener('focusout', (event) =>{
  curQuery = event.target.value;
  console.log(`Using search! input = ${event.target.value}`);
  history.push(curQuery);
  fetchNews();
  displayHistory();
});

function displayHistory(){
  const container = document.getElementById('history');
  container.innerHTML = '';

  let storyP = document.createElement('div');
  for(let i = 0; i < history.length; i++){
    storyP.innerHTML += `<p>${i + 1}. ${history[i]}</p>`;
  }
  container.appendChild(storyP);
}