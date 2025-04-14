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