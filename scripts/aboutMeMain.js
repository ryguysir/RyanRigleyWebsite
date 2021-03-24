document.getElementsByClassName("submit")[0].addEventListener("click", (event) => {
  let email = document.getElementsByClassName("email")[0].value;
  let message = document.getElementsByClassName("message")[0].value;
  var status = document.getElementsByClassName("status")[0];
  status.innerHTML = "";

  if (email.length > 5 && email.includes("@") && email.includes(".")) {
    status.innerHTML = "<div>Email is Valid</div>";
  } else {
    event.preventDefault();
    status.innerHTML = "<div>Email is Not Valid</div>";
  }

  if (message.length > 10) {
    status.innerHTML = "<div>Message is Valid</div>";
  } else {
    event.preventDefault();
    status.innerHTML = "<div>You forgot to write a message</div>";
  }
});

function scrollToContactMe() {
  let contactMe = document.getElementsByClassName("contactMe")[0].getBoundingClientRect().top;
  window.scroll(0, contactMe);
}

let video = document.getElementById("standingUpVid");
let accelamount = 0.35;
let scrollPos = 0;
let delay = 0;

window.addEventListener("scroll", (el) => {
  scrollPos = video.duration * (window.scrollY / window.innerHeight);
});

setInterval(() => {
  delay += (scrollPos - delay) * accelamount;
  if (isNaN(delay)) {
    delay = 0;
  }
  video.currentTime = delay;
}, 1000 / 24);
