let curQuery = "job market";

let history = [];

let curPage = 1;
let totalPages = 1;

window.addEventListener("DOMContentLoaded", function(){
  fetchNews();
  this.document.getElementById('prevBtn1').addEventListener('click', () =>{
    if(curPage > 1){
        curPage--;
        fetchNews();
    } 
  });
  this.document.getElementById('prevBtn2').addEventListener('click', () =>{
    if(curPage > 1){
          curPage--;
          fetchNews();
      }
  });
  this.document.getElementById('nextBtn1').addEventListener('click', () =>{
      if(curPage < totalPages){
          curPage++;
          fetchNews();
      }
  });
  this.document.getElementById('nextBtn2').addEventListener('click', () =>{
      if(curPage < totalPages){
          curPage++;
          fetchNews();
      }
  });
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
  const url = `${baseUrl}?q=${query}&searchin=title&page=${curPage}&sortBy=popularity&pageSize=10&apiKey=${API_KEY}`; 
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
    document.getElementById('pageDisplay1').textContent = `Page ${curPage}`;
    document.getElementById('pageDisplay2').textContent = `Page ${curPage}`;
    totalPages = data.totalResults;
    totalPages = parseInt((totalPages + 9) / 10 ? (totalPages + 9) / 10 : 1);
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

document.getElementById('find').addEventListener('click', (event) =>{
  const newsTitle = document.getElementById('search');
  curQuery = newsTitle.value;
  console.log(`Using search! input = ${newsTitle.value}`);
  if(curQuery != ""){
    curPage = 1;
    history.push(curQuery);
    fetchNews();
    displayHistory();
  }
});

document.getElementById('search').addEventListener('keypress', (event) =>{
  if(event.key === "Enter"){
    curQuery = event.target.value;
    console.log(`Using search! input = ${event.target.value}`);
    if(curQuery != ""){
      curPage = 1;
      history.push(curQuery);
      fetchNews();
      displayHistory();
    }
  }
});


async function displayHistory(){
  const container = document.getElementById('history');
  container.innerHTML = '';

  let storyP = document.createElement('div');
  for(let i = 0; i < history.length; i++){
    storyP.innerHTML += `<p>${i + 1}. ${history[i]}</p>`;
  }
  container.appendChild(storyP);
}

