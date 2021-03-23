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

function scrollPlayVid() {
  let video = document.getElementById("standingUpVid");
  let frameRate = 60;

  let curTime = video.duration * (window.scrollY / window.innerHeight);
  if (isNaN(curTime)) {
    curTime = 0;
  }
  let unRounded = curTime - Math.floor(curTime).toFixed(3);
  let rounded = Math.floor(unRounded * frameRate) / frameRate + Math.floor(curTime);
  video.currentTime = rounded;

  requestAnimationFrame(scrollPlayVid);
}
requestAnimationFrame(scrollPlayVid);

function scrollToContactMe() {
  let contactMe = document.getElementsByClassName("contactMe")[0].getBoundingClientRect().top;
  window.scroll(0, contactMe);
}
