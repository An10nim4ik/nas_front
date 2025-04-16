const backgrounds = ["url('../imgs/Industrial_Control_Room.jpeg')", "url('imgs/Man_Working_in_Cozy.jpeg')", "url('imgs/Woodworker_at_Work.jpeg')"]
const randomIndex = Math.floor(Math.random() * backgrounds.length);
const section = document.querySelector(".section-about");
section.style.backgroundImage = backgrounds[randomIndex];


const links = document.querySelectorAll('.section-anchor__links a');

  links.forEach(link => {
    link.addEventListener('click', function () {
      // Remove active class from all links
      links.forEach(l => l.classList.remove('active'));
      // Add active class to the clicked link
      this.classList.add('active');
    });
  });


window.addEventListener("DOMContentLoaded", function(){
  fetchNews();
});


const apikey = "deda703e77e64b8884a17623e6598ff1";

function buildUrl(){
  let baseUrl = "https://newsapi.org/v2/everything";
  let API_KEY = apikey;
  const query = "job market";
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
      <p>${article.description}</p>
      <a href="${article.url}" target="_blank"><div class=link><p>More information</p></div></a>`;
    container.appendChild(newsDiv);
  });
}