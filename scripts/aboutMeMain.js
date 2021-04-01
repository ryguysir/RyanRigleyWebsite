//this moves the reveal block out of the way on page load
window.addEventListener("load", () => {
  let pageReveal = document.getElementById("pageReveal");
  pageReveal.style.transform = "translateY(-100%)";
});

//this submits the contact me form
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

//this scrolls to the contact me section when the button is clicked
function scrollToContactMe() {
  let contactMe = document.getElementsByClassName("contactMe")[0].getBoundingClientRect().top;
  window.scroll(0, contactMe);
}

//this sets the video position to the scroll position
let video = document.getElementById("standingUpVid");
let accelamount = 0.6;
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
}, 1000 / 12);
