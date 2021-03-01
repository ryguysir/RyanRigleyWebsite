//Global Variables
//________________________________________________________________________________________
var videoBoxStorage = [];
var allTagsSearchList = [];
var isMobile = false;

//event listeners
//________________________________________________________________________________________

//checks for / turns off lottie hover animation for mobile devices
window.onload = function () {
  if (window.innerWidth <= 500) {
    isMobile = true;
  }
};

//if a tag is clicked, add it to the allTagsSearchList and change the class to toggled
var allTags = document.querySelectorAll(".tag");
allTags.forEach((e) => {
  e.addEventListener("click", (event) => {
    //if no tags are selected, then turn on the looping lottie file
    for (i = 0; i < document.getElementsByClassName("tag").length; i++) {
      if (document.getElementsByClassName("tag")[i].classList.contains("tagToggled")) {
        document.getElementById("loopingLottie").classList.toggle("hidden");
        break;
      } else {
        document.getElementById("loopingLottie").classList.toggle("hidden");
        break;
      }
    }

    //if tag is Search, open the searchBox elem and return
    if (event.srcElement.innerHTML == "Search") {
      if (document.getElementById("searchBoxContainer").style.display !== "inline-block") {
        document.getElementById("searchBoxContainer").style.display = "inline-block";
        document.getElementById("searchBox").focus();
        event.srcElement.classList.toggle("tagToggled");
        return;
      } else {
        document.getElementById("searchBoxContainer").style.display = "none";
        event.srcElement.classList.toggle("tagToggled");
        return;
      }
    }

    //if tag is Browse, add all videos in alphabetical order and preform browseAll function

    if (event.srcElement.innerHTML == "Browse All") {
      if (event.srcElement.classList.contains("tagToggled")) {
        removeAllChildNodes(document.getElementById("videoBoxContainer"));
        event.srcElement.classList.toggle("tagToggled");
        return;
      }

      browseAll();
      return;
    }

    //if tag is NOT search, add tag to allTagsSearchList and preform tagSearch function
    event.srcElement.classList.toggle("tagToggled");
    if (document.getElementsByClassName("a2z")[0].classList.contains("tagToggled")) {
      removeAllChildNodes(document.getElementById("videoBoxContainer"));
      document.getElementsByClassName("a2z")[0].classList.toggle("tagToggled");
    }
    if (allTagsSearchList.includes(event.srcElement.innerHTML)) {
      allTagsSearchList.splice(allTagsSearchList.indexOf(event.srcElement.innerHTML), 1);
    } else {
      allTagsSearchList.push(event.srcElement.innerHTML);
    }
    //this is where you activate the search function
    tagSearch();
  });
});

//if enter key is pressed in searchBox, preform a search function
document.getElementById("searchBox").addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    searchBox();
  }
});

//if escape key is pressed in searchBox, toggle the searchBox to Hidden
document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (
    evt.keyCode == 27 &&
    document.getElementById("searchBoxContainer").style.display == "inline-block"
  ) {
    document.getElementById("searchBoxContainer").style.display = "none";
    document.getElementsByClassName("search")[0].classList.toggle("tagToggled");
    document.getElementById("loopingLottie").classList.toggle("hidden");
  }
};

//video div template object
//________________________________________________________________________________________
function VideoBox() {
  this.tags = [];
  this.videos = [];
  this.rank = 0;
  this.rankImportance = 0;
  this.title = "";
  this.description = "";
  this.imgSrc = "";

  this.create = function createVideoBox(videos) {
    let videoBox = document.createElement("div");
    let videoBoxImageContainer = document.createElement("div");
    let videoImage = document.createElement("img");

    //set up the video box and add the image + image container to it
    videoBox.setAttribute("class", "videoBox");
    videoImage.setAttribute("class", "videoStill");
    videoBoxImageContainer.setAttribute("class", "videoBoxImageContainer");
    videoImage.src = this.imgSrc;

    videoBox.appendChild(videoImage);
    videoBox.appendChild(videoBoxImageContainer);

    //set up the title and description text blocks and add them to the video box
    let titleElem = document.createElement("p");
    let descriptionElem = document.createElement("p");
    descriptionElem.setAttribute("class", "description");
    titleElem.setAttribute("class", "title");
    titleElem.innerHTML = this.title;
    descriptionElem.innerHTML = this.description;
    videoBox.appendChild(titleElem);
    videoBox.appendChild(descriptionElem);

    //add the lottie play button ontop of the image
    let lottie = document.createElement("lottie-player");
    if (!isMobile) {
      lottie.loop = false;
      lottie.autoplay = false;
      lottie.src = "https://assets6.lottiefiles.com/packages/lf20_fqg8yuqr.json";
      lottie.controls = false;
      lottie.setAttribute("class", "lottiePlay");
      lottie.addEventListener("mouseover", () => {
        lottie.setDirection(1);
        lottie.play();
      });
      lottie.addEventListener("mouseout", () => {
        lottie.setDirection(-1);
        lottie.play();
      });
      videoBoxImageContainer.appendChild(lottie);
    } else {
      lottie.loop = false;
      lottie.autoplay = true;
      lottie.src = "https://assets6.lottiefiles.com/packages/lf20_fqg8yuqr.json";
      lottie.controls = false;
      lottie.setAttribute("class", "lottiePlay");
      videoBoxImageContainer.appendChild(lottie);
    }
    //attach the videobox to the DOM
    document.getElementById("videoBoxContainer").appendChild(videoBox);
    videoImage.addEventListener("load", () => {
      videoImage.style.opacity = "1";
    });

    //whenever the lottie animation is clicked, it transitions to the different video files
    lottie.addEventListener("click", () => {
      removeAllChildNodes(videoBox);

      let xCloseButton = document.createElement("lottie-player");
      xCloseButton.loop = false;
      xCloseButton.autoplay = true;
      xCloseButton.src = "https://assets9.lottiefiles.com/packages/lf20_smbgcrqi.json";
      xCloseButton.controls = false;
      xCloseButton.speed = 0.5;
      xCloseButton.setAttribute("class", "xCloseButton");
      videoBox.appendChild(xCloseButton);

      for (i = 0; i < videos.length; i++) {
        let video = document.createElement("iframe");
        video.setAttribute("class", "videoInlay");
        video.src = "https://player.vimeo.com/video/" + videos[i];
        video.allow = "autoplay; fullscreen; picture-in-picture";
        videoBox.appendChild(video);
      }

      xCloseButton.addEventListener("click", () => {
        //deletes all videos and adds back in the image / title / description
        removeAllChildNodes(videoBox);
        videoBox.appendChild(videoImage);
        videoBox.appendChild(videoBoxImageContainer);
        videoBox.appendChild(titleElem);
        videoBox.appendChild(descriptionElem);
      });
    });
  };
}

//create the different videos
//________________________________________________________________________________________
(function createVideos() {
  let shazam = new VideoBox();
  shazam.rank = 0;
  shazam.rankImportance = 3;
  shazam.tags = ["comedy", "action", "adventure", "sci-fi", "shazam", "shazam!"];
  shazam.videos = ["281502145"];
  shazam.title = "Shazam!";
  shazam.description =
    "It was such a pleasure to get to edit the trailer for this fantastically fun movie. The intro was done in partnership with an editor at Buddha Jones, but the rest was all done by me. I still have this song stuck in my head.";
  shazam.imgSrc = "images/shazam.jpg";
  videoBoxStorage.push(shazam);

  //___________________________________________________________________________________
  let narcosS2 = new VideoBox();
  narcosS2.rank = 0;
  narcosS2.rankImportance = 3;
  narcosS2.tags = ["drama", "action", "narcos", "narcos season 2", "netflix", "historical"];
  narcosS2.videos = ["208770645", "208770547", "208770473"];
  narcosS2.title = "Narcos: Season 2";
  narcosS2.description =
    "I worked on the TV campaign for the first season of Narcos, but it wasn't until Season 2 that I got the chance to create this trailer. The first version had a custom song made for it based off Paul Mccartney's 007 theme for Live and Let Die, but due to some legal reasons we had to find an ALT. I thought we'd never find something as good until our music supervisor suggested this track by Styx. I still love this song, and this trailer to this day.";
  narcosS2.imgSrc = "images/narcosSeason2.jpg";
  videoBoxStorage.push(narcosS2);

  //___________________________________________________________________________________
  let extinction = new VideoBox();
  extinction.rank = 0;
  extinction.rankImportance = 3;
  extinction.tags = ["drama", "action", "horror", "sci-fi", "extinction", "netflix"];
  extinction.videos = ["279750518"];
  extinction.title = "Extinction";
  extinction.description =
    "This was a very fun trailer to work on, even with the super quick turn around. I had a lot of fun making it my own, including recording my wife's breathing for the little girl's scene at the end!";
  extinction.imgSrc = "images/extinction.jpg";
  videoBoxStorage.push(extinction);

  //___________________________________________________________________________________
  let narcosMexico = new VideoBox();
  narcosMexico.rank = 0;
  narcosMexico.rankImportance = 2;
  narcosMexico.tags = ["drama", "action", "netflix", "historical"];
  narcosMexico.videos = ["292769952"];
  narcosMexico.title = "Narcos: Mexico";
  narcosMexico.description =
    "One of the last projects I worked on at Transit before moving up north to Seattle. The split frame trope is something I have used many times since cutting this.";
  narcosMexico.imgSrc = "images/narcosMexico.jpg";
  videoBoxStorage.push(narcosMexico);

  //___________________________________________________________________________________
  let johnHenry = new VideoBox();
  johnHenry.rank = 0;
  johnHenry.rankImportance = 0;
  johnHenry.tags = ["drama", "action", "netflix", "historical"];
  johnHenry.videos = ["312820873"];
  johnHenry.title = "John Henry and the Statesmen";
  johnHenry.description =
    "This was a strange one. I got a call from the fine folks down at Seven Bucks Productions to do a quick overnight teaser for the just announced Dwayne Johnson movie based on the story of John Henry. It was a fun / quick thing to cut, but I'm not sure anything ever came of it.";
  johnHenry.imgSrc = "images/johnHenryAndTheStatesmen.jpg";
  videoBoxStorage.push(johnHenry);

  //___________________________________________________________________________________
  let moneyHeistS2 = new VideoBox();
  moneyHeistS2.rank = 0;
  moneyHeistS2.rankImportance = 1;
  moneyHeistS2.tags = ["drama", "action", "netflix"];
  moneyHeistS2.videos = ["279750491"];
  moneyHeistS2.title = "Money Heist: Season 2";
  moneyHeistS2.description =
    "This show was fairly difficult to work on because of how distracted I would get watching it down. I would get so wrapped up in what was going on, that I would entirely forget to read the subtitles and have to go back and look for lines. I should really learn spanish.";
  moneyHeistS2.imgSrc = "images/moneyHeistS2.jpg";
  videoBoxStorage.push(moneyHeistS2);

  //___________________________________________________________________________________
  let ozarkS1 = new VideoBox();
  ozarkS1.rank = 0;
  ozarkS1.rankImportance = 1;
  ozarkS1.tags = ["drama", "action", "netflix"];
  ozarkS1.videos = ["272281344"];
  ozarkS1.title = "Ozark: Season 1";
  ozarkS1.description = `When we first got this show in at work I had 0 faith in it being good. I mean come on, a Jason Bateman lead crime drama in Missouri? But oh boy I was wrong, it's now one of my favorite shows. And I'm so glad to have worked on it, no matter how small. Although the gun sfx on the title has been used on most of the other seasons, and that was all me :-)`;
  ozarkS1.imgSrc = "images/ozarkSeason1.jpg";
  videoBoxStorage.push(ozarkS1);

  //___________________________________________________________________________________
  let agent47 = new VideoBox();
  agent47.rank = 0;
  agent47.rankImportance = 2;
  agent47.tags = ["action"];
  agent47.videos = ["209509693"];
  agent47.title = "Hitman: Agent 47";
  agent47.description =
    "The journey to finishing the first trailer for Hitman: Agent 47 was a long and arduous one. It started with a simple 30 second TV spot (basically the intro to this trailer) that was liked so much by the executive at fox that they asked me to turn it into a trailer... in 48 hours. I did as they requested, and dozens of versions later, here we are. A passion project that was unanimously hated by everyone on the internet." +
    "</br>" +
    "P.S. the guy screaming 'no!' at the beginning is me!";
  agent47.imgSrc = "images/agent47.jpg";
  videoBoxStorage.push(agent47);

  //___________________________________________________________________________________
  let peoplePlacesThings = new VideoBox();
  peoplePlacesThings.rank = 0;
  peoplePlacesThings.rankImportance = 1;
  peoplePlacesThings.tags = ["drama", "comedy"];
  peoplePlacesThings.videos = ["209164301"];
  peoplePlacesThings.title = "People, Places, Things";
  peoplePlacesThings.description =
    "My first trailer finish ever! I think this is a very underated indie film that you should check out. Great learning experience all around.";
  peoplePlacesThings.imgSrc = "images/peoplePlacesThings.jpg";
  videoBoxStorage.push(peoplePlacesThings);

  //___________________________________________________________________________________
  let aVeryMurrayChristmas = new VideoBox();
  aVeryMurrayChristmas.rank = 0;
  aVeryMurrayChristmas.rankImportance = 0;
  aVeryMurrayChristmas.tags = ["comedy"];
  aVeryMurrayChristmas.videos = ["209141658", "209141623", "209141581"];
  aVeryMurrayChristmas.title = "A Very Murray Christmas";
  aVeryMurrayChristmas.description =
    "This was a very strange project to work on, and it needed a strange trailer to announce it. I'm not sure who came up with the idea for the Time Life style video, but I'm glad that's the direction we went in.";
  aVeryMurrayChristmas.imgSrc = "images/aVeryMurrayChristmas.jpg";
  videoBoxStorage.push(aVeryMurrayChristmas);

  //___________________________________________________________________________________
  let boschS2 = new VideoBox();
  boschS2.rank = 0;
  boschS2.rankImportance = 0;
  boschS2.tags = ["action", "drama"];
  boschS2.videos = ["209163500", "209163424", "209163500"];
  boschS2.title = "Bosch Season 2";
  boschS2.description =
    "The most interesting part about working on this project was the music. The executive team at Amazon decided to have a custom song created for this trailer. And at one point they even requested our on staff writer to make up lyrics for it. I really wish I still had the lyrics somewhere.";
  boschS2.imgSrc = "images/boschSeason2.jpg";
  videoBoxStorage.push(boschS2);

  //___________________________________________________________________________________
  let theGetDown = new VideoBox();
  theGetDown.rank = 0;
  theGetDown.rankImportance = 0;
  theGetDown.tags = ["drama", "historical"];
  theGetDown.videos = ["208769604"];
  theGetDown.title = "The Get Down";
  theGetDown.description =
    "This is still one of the only musical projects I ever worked on, I wish I was able to work on more. Jaden Smith was fantastic in this show, and I highly suggest checking it out.";
  theGetDown.imgSrc = "images/theGetDown.jpg";
  videoBoxStorage.push(theGetDown);

  //___________________________________________________________________________________
  let theBoy = new VideoBox();
  theBoy.rank = 0;
  theBoy.rankImportance = 0;
  theBoy.tags = ["horror"];
  theBoy.videos = ["209165016", "209164905", "209164975", "209164928"];
  theBoy.title = "The Boy";
  theBoy.description =
    "This wasn't my favorite horror film by any means, but the scene I chose to focus on for my trailer was interesting. I'm glad I had a chance to cut it the way I wanted. As for the Teacher and Firefighter cuts, I don't really know what was going on there.";
  theBoy.imgSrc = "images/theBoy.jpg";
  videoBoxStorage.push(theBoy);

  //___________________________________________________________________________________
  let rampage = new VideoBox();
  rampage.rank = 0;
  rampage.rankImportance = 1;
  rampage.tags = ["action", "sci-fi", "horror"];
  rampage.videos = ["272281886", "272282009", "272281838"];
  rampage.title = "Rampage";
  rampage.description =
    "I worked on an awesome trailer for this film for weeks on end that sadly didn't end up getting selected as a finish. It was set to a custom mix of War Pigs by Black Sabbath and Whole Lotta Love by Led Zeppelin which was absolutely fantastic. Although I didn't get the trailer finish, I did work on several TV spots directly with Dwayne Johnson (I'm the editor he's referring to), and those led to a few pieces with Dwayne's company Seven Bucks Productions after I left Transit.";
  rampage.imgSrc = "images/rampage.jpg";
  videoBoxStorage.push(rampage);

  //___________________________________________________________________________________
  let narcosS3 = new VideoBox();
  narcosS3.rank = 0;
  narcosS3.rankImportance = 1;
  narcosS3.tags = ["drama", "action", "netflix", "historical"];
  narcosS3.videos = ["279754111", "279753867", "279753924", "279753982"];
  narcosS3.title = "Narcos: Season 3";
  narcosS3.description =
    "Although I didn't finish the whole trailer for Season 3 of Narcos, I did create the intro used in the final trailer and several awesome TV Spots.";
  narcosS3.imgSrc = "images/narcosSeason3.jpg";
  videoBoxStorage.push(narcosS3);

  //___________________________________________________________________________________
  let logan = new VideoBox();
  logan.rank = 0;
  logan.rankImportance = 3;
  logan.tags = ["drama", "action", "sci-fi"];
  logan.videos = ["208255115", "208255125", "209509332", "209509303"];
  logan.title = "Logan";
  logan.description =
    "Yet another trailer I worked on for a very long time that was not selected to finish. Although we did use Hurt by Johnny Cash at one point, we didn't put as much energy into making it as good as our competitors did. I did get to work on some awesome TV spots for it though, which was nice because I genuinely love this film and enjoy knowing I helped in its release.";
  logan.imgSrc = "images/logan.jpg";
  videoBoxStorage.push(logan);

  //___________________________________________________________________________________
  let powerRangers = new VideoBox();
  powerRangers.rank = 0;
  powerRangers.rankImportance = 0;
  powerRangers.tags = ["adventure", "action", "sci-fi"];
  powerRangers.videos = ["209510220", "209510166"];
  powerRangers.title = "Power Rangers";
  powerRangers.description =
    "My wife and I worked on a TV spot for this that involved making this new movie look like the old TV show. It involve adding in the old SFX, and fake looking explosions all over. Sadly it finished but was never aired anywhere, I'm still not sure as to why.";
  powerRangers.imgSrc = "images/powerRangers.jpg";
  videoBoxStorage.push(powerRangers);

  //___________________________________________________________________________________
  let assassinsCreed = new VideoBox();
  assassinsCreed.rank = 0;
  assassinsCreed.rankImportance = 0;
  assassinsCreed.tags = ["adventure", "action", "sci-fi"];
  assassinsCreed.videos = ["209163244", "209163276"];
  assassinsCreed.title = "Assassin's Creed";
  assassinsCreed.description =
    "You were the chosen one Assassin's creed! It was said that you would set a new example for video game movies, not add to the list of bad ones!";
  assassinsCreed.imgSrc = "images/assassinsCreed.jpg";
  videoBoxStorage.push(assassinsCreed);

  //___________________________________________________________________________________
  let fantasticBeasts = new VideoBox();
  fantasticBeasts.rank = 0;
  fantasticBeasts.rankImportance = 0;
  fantasticBeasts.tags = ["adventure", "action", "sci-fi"];
  fantasticBeasts.videos = ["209163920"];
  fantasticBeasts.title = "Fantastic Beasts and Where to Find Them";
  fantasticBeasts.description =
    "I only worked on this film for a short period of time, but it was an enjoyable experience to have worked on anything in the HP universe.";
  fantasticBeasts.imgSrc = "images/fantasticBeasts.jpg";
  videoBoxStorage.push(fantasticBeasts);

  //___________________________________________________________________________________
  let petesDragon = new VideoBox();
  petesDragon.rank = 0;
  petesDragon.rankImportance = 3;
  petesDragon.tags = ["adventure", "action", "sci-fi"];
  petesDragon.videos = [
    "209164720",
    "209164565",
    "209164674",
    "209164510",
    "209164480",
    "209164530",
  ];
  petesDragon.title = "Pete's Dragon";
  petesDragon.description =
    "Before getting Pete's dragon in at Transit, we hadn't had much experience working with the people at Disney. I wanted to deliver something that was different than they had already seen on this campaign, so I decided to take the a cappella song sang by the little girl and turn it into a fully orchestrated song. I guess it went over well, because after Pete's dragon wrapped up we continued to get new projects through Disney.";
  petesDragon.imgSrc = "images/petesDragon.jpg";
  videoBoxStorage.push(petesDragon);

  //___________________________________________________________________________________
  let narcosS1 = new VideoBox();
  narcosS1.rank = 0;
  narcosS1.rankImportance = 3;
  narcosS1.tags = ["action", "drama", "netflix", "historical"];
  narcosS1.videos = [
    "208256474",
    "208256554",
    "208257459",
    "208256456",
    "208257500",
    "208256444",
    "208256504",
    "208256434",
  ];
  narcosS1.title = "Narcos: Season 1";
  narcosS1.description =
    "Narcos: Season 1 was one of the first big projects that I worked on at the beginning of my career. It was an incredibly rewarding experience that won me my first key art award for my solo work on 'just say no'.";
  narcosS1.imgSrc = "images/narcosSeason1.jpg";
  videoBoxStorage.push(narcosS1);
})();

//functions below here
//________________________________________________________________________________________
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function rankSort() {
  videoBoxStorage.sort((a, b) => {
    return b.rank + b.rankImportance - (a.rank + a.rankImportance);
  });
  for (i = 0; i < videoBoxStorage.length; i++) {
    if (videoBoxStorage[i].rank >= 1) {
      videoBoxStorage[i].create(videoBoxStorage[i].videos);
    }
  }
}

function searchBox() {
  //set all ranks to 0
  videoBoxStorage.forEach((element) => (element.rank = 0));
  //remove all video boxes from container
  removeAllChildNodes(document.getElementById("videoBoxContainer"));

  let searchQuery = document.getElementById("searchBox").value;

  for (i = 0; i < videoBoxStorage.length; i++) {
    let re = new RegExp(`${searchQuery.toLowerCase()}`, "gi");
    if (videoBoxStorage[i].title.match(re) !== null) {
      videoBoxStorage[i].rank += 1;
    }
  }
  document.getElementById("searchBox").value = "";
  rankSort();
}

function browseAll() {
  //empty the DOM and reset all tags except browseAll to tagToggled
  removeAllChildNodes(document.getElementById("videoBoxContainer"));
  for (i = 0; i < document.getElementsByClassName("tag").length; i++) {
    if (document.getElementsByClassName("tag")[i].classList.contains("tagToggled")) {
      document.getElementsByClassName("tag")[i].classList.toggle("tagToggled");
    }
  }
  event.srcElement.classList.toggle("tagToggled");

  //async alphabetically sort titles before drawing them to the DOM
  function sortTitles() {
    return new Promise((resolve) => {
      let alpha = "abcdefghijklmnopqrstuvwxyz";
      let sorted = [...videoBoxStorage].sort((a, b) => {
        return alpha.indexOf(a.title.toLowerCase()[0]) - alpha.indexOf(b.title.toLowerCase()[0]);
      });
      resolve(sorted);
    });
  }

  function drawSortedTitles(x) {
    x.forEach((project) => {
      project.create(project.videos);
    });
  }

  async function asyncCall() {
    const result = await sortTitles();
    drawSortedTitles(result);
  }

  asyncCall();
}

function tagSearch() {
  //set all ranks to 0
  videoBoxStorage.forEach((element) => (element.rank = 0));
  //remove all video boxes from container
  removeAllChildNodes(document.getElementById("videoBoxContainer"));

  for (i = 0; i < videoBoxStorage.length; i++) {
    for (j = 0; j < allTagsSearchList.length; j++) {
      if (videoBoxStorage[i].tags.includes(allTagsSearchList[j].toLowerCase())) {
        videoBoxStorage[i].rank += 1;
      }
    }
  }
  rankSort();
}
