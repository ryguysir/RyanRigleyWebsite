//Global Variables
//________________________________________________________________________________________
var allTagsSearchList = [];
var isMobile = false;
var videoBoxStorage = [];
var tagsTagged = false;

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
    //if tag is Search, open the searchBox elem and return
    if (event.srcElement.innerHTML == "Search") {
      if (document.getElementById("searchBoxContainer").style.display !== "inline-block") {
        event.srcElement.classList.toggle("tagToggled");
        document.getElementById("searchBoxContainer").style.display = "inline-block";
        document.getElementById("searchBox").focus();
        loopingLottieCheck();

        return;
      } else {
        event.srcElement.classList.toggle("tagToggled");
        document.getElementById("searchBoxContainer").style.display = "none";
        return;
      }
    }

    //if tag is Browse, add all videos in alphabetical order and preform browseAll function

    if (event.srcElement.innerHTML == "Browse All") {
      if (event.srcElement.classList.contains("tagToggled")) {
        removeAllChildNodes(document.getElementById("cardContainer"));
        event.srcElement.classList.toggle("tagToggled");
        document.getElementById("loopingLottie").style.display = "block";
        return;
      }
      document.getElementById("loopingLottie").style.display = "none";
      browseAll();
      return;
    }

    //if tag is awards, sort only projects with awards
    if (event.srcElement.innerHTML == "Awards") {
      if (event.srcElement.classList.contains("tagToggled")) {
        removeAllChildNodes(document.getElementById("cardContainer"));
        event.srcElement.classList.toggle("tagToggled");
        document.getElementById("loopingLottie").style.display = "block";
        return;
      }
      document.getElementById("loopingLottie").style.display = "none";
      event.srcElement.classList.toggle("tagToggled");
      awardSearch();
      return;
    }

    //if tag is NOT search, add tag to allTagsSearchList and preform tagSearch function
    event.srcElement.classList.toggle("tagToggled");
    if (document.getElementsByClassName("a2z")[0].classList.contains("tagToggled")) {
      removeAllChildNodes(document.getElementById("cardContainer"));
      document.getElementsByClassName("a2z")[0].classList.toggle("tagToggled");
    }
    if (allTagsSearchList.includes(event.srcElement.innerHTML)) {
      allTagsSearchList.splice(allTagsSearchList.indexOf(event.srcElement.innerHTML), 1);
    } else {
      allTagsSearchList.push(event.srcElement.innerHTML);
    }
    //this is where you activate the search function
    tagSearch();
    loopingLottieCheck();
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
  //1 == clio award  2 == golden trailer award
  this.award = 0;

  this.create = function createVideoBox(videos) {
    //create the card and gradient
    let card = document.createElement("div");
    let cardGradient = document.createElement("div");
    card.setAttribute("class", "card");
    cardGradient.setAttribute("class", "cardGradient");
    card.appendChild(cardGradient);

    //create the text box and append to card
    let cardText = document.createElement("cardText");
    cardText.setAttribute("class", "cardText");
    let cardTitle = document.createElement("h2");
    let cardSubTitle = document.createElement("h3");
    cardTitle.innerHTML = this.title;
    cardSubTitle.innerHTML = this.description;
    cardText.appendChild(cardTitle);
    cardText.appendChild(cardSubTitle);
    card.appendChild(cardText);

    //create image and append to card
    let cardImg = document.createElement("img");
    cardImg.src = this.imgSrc;
    card.appendChild(cardImg);

    //add the lottie play button ontop of the image
    let lottiePlayBttn = document.createElement("lottie-player");
    if (!isMobile) {
      lottiePlayBttn.loop = false;
      lottiePlayBttn.autoplay = false;
      lottiePlayBttn.src = "https://assets6.lottiefiles.com/packages/lf20_fqg8yuqr.json";
      lottiePlayBttn.controls = false;
      lottiePlayBttn.setAttribute("class", "lottiePlayBttn");
      lottiePlayBttn.addEventListener("mouseover", () => {
        lottiePlayBttn.setDirection(1);
        lottiePlayBttn.play();
      });
      lottiePlayBttn.addEventListener("mouseout", () => {
        lottiePlayBttn.setDirection(-1);
        lottiePlayBttn.play();
      });
      card.appendChild(lottiePlayBttn);
    } else {
      lottiePlayBttn.loop = false;
      lottiePlayBttn.autoplay = true;
      lottiePlayBttn.src = "https://assets6.lottiefiles.com/packages/lf20_fqg8yuqr.json";
      lottiePlayBttn.controls = false;
      lottiePlayBttn.setAttribute("class", "lottiePlayBttn");
      card.appendChild(lottiePlayBttn);
    }

    //attach the videobox to the DOM
    document.getElementById("cardContainer").appendChild(card);

    //whenever the playbutton is clicked, it transitions to the different video files
    lottiePlayBttn.addEventListener("click", () => {
      removeAllChildNodes(card);
      let xCloseButton = document.createElement("lottie-player");
      xCloseButton.loop = false;
      xCloseButton.autoplay = true;
      xCloseButton.src = "https://assets9.lottiefiles.com/packages/lf20_smbgcrqi.json";
      xCloseButton.controls = false;
      xCloseButton.speed = 0.5;
      xCloseButton.setAttribute("class", "xCloseButton");
      card.appendChild(xCloseButton);

      //if videos length is over 1, cycle through the different videos
      let curVideo = 0;
      let video = document.createElement("iframe");
      video.setAttribute("class", "videoInlay");
      video.src = "https://player.vimeo.com/video/" + videos[curVideo];
      video.allow = "autoplay; fullscreen; picture-in-picture";
      card.appendChild(video);

      //set up next video button
      let nextVid = document.createElement("div");
      nextVid.setAttribute("class", "nextVid");
      nextVid.addEventListener("click", () => {
        if (curVideo >= videos.length - 1) {
          curVideo = 0;
        } else {
          curVideo++;
        }
        video.src = "https://player.vimeo.com/video/" + videos[curVideo];
      });
      //set up previous video button
      let prevVideo = document.createElement("div");
      prevVideo.setAttribute("class", "prevVideo");
      prevVideo.addEventListener("click", () => {
        if (curVideo <= 0) {
          curVideo = videos.length - 1;
        } else {
          curVideo--;
        }
        video.src = "https://player.vimeo.com/video/" + videos[curVideo];
      });

      card.appendChild(nextVid);
      card.appendChild(prevVideo);

      //when the X is clicked, we transition back to the card with image
      xCloseButton.addEventListener("click", () => {
        //deletes all videos and adds back in the image / title / description
        console.log("ran");
        removeAllChildNodes(card);
        card.appendChild(cardText);
        card.appendChild(cardImg);
        card.appendChild(lottiePlayBttn);
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
  narcosS2.award = 2;
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
  peoplePlacesThings.tags = ["drama", "comedy", "romance"];
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
  theGetDown.tags = ["drama", "historical", "romance"];
  theGetDown.videos = ["208769604"];
  theGetDown.title = "The Get Down";
  theGetDown.description =
    "This is still one of the only musical projects I ever worked on, I wish I was able to work on more. Jaden Smith was fantastic in this show, and I highly suggest checking it out.";
  theGetDown.imgSrc = "images/theGetDown.jpg";
  theGetDown.award = 1;
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
  rampage.award = 1;
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
  narcosS1.award = 1;
  videoBoxStorage.push(narcosS1);

  //___________________________________________________________________________________
  let theMountainBetweenUs = new VideoBox();
  theMountainBetweenUs.rank = 0;
  theMountainBetweenUs.rankImportance = 0;
  theMountainBetweenUs.tags = ["action", "drama", "romance"];
  theMountainBetweenUs.videos = ["279757097"];
  theMountainBetweenUs.title = "The Mountain Between Us";
  theMountainBetweenUs.description =
    "Not much to say about this one, I only worked on it for a little bit. I like working on Idris Elba movies because I like him a lot as an actor, and the only other project I worked on with him in it was Fast & Furious Presents: Hobbs & Shaw.";
  theMountainBetweenUs.imgSrc = "images/theMountainBetweenUs.jpg";
  videoBoxStorage.push(theMountainBetweenUs);

  //___________________________________________________________________________________
  let xMenDaysofFuturePast = new VideoBox();
  xMenDaysofFuturePast.rank = 0;
  xMenDaysofFuturePast.rankImportance = 1;
  xMenDaysofFuturePast.tags = ["action", "sci-fi"];
  xMenDaysofFuturePast.videos = ["208222198", "208222240", "208222173", "208222253", "208222158"];
  xMenDaysofFuturePast.title = "X-Men: Days of Future Past";
  xMenDaysofFuturePast.description =
    "I maintain this is one of the best Xmen movies they made. It was fun, had creative fight scenes and set pieces, and had an all star cast. I won a silver key art award for my motion graphics work on this one.";
  xMenDaysofFuturePast.imgSrc = "images/xMenDaysOfFuturePast.jpg";
  xMenDaysofFuturePast.award = 1;
  videoBoxStorage.push(xMenDaysofFuturePast);

  //___________________________________________________________________________________
  let dawnOfThePlanetOfTheApes = new VideoBox();
  dawnOfThePlanetOfTheApes.rank = 0;
  dawnOfThePlanetOfTheApes.rankImportance = 1;
  dawnOfThePlanetOfTheApes.tags = ["action", "sci-fi", "drama"];
  dawnOfThePlanetOfTheApes.videos = ["209163648", "209163616", "209163695"];
  dawnOfThePlanetOfTheApes.title = "Dawn of the Planet of the Apes";
  dawnOfThePlanetOfTheApes.description =
    "What a fantastic movie this is, and a great project to work on. I mostly worked on the motion graphics for this campaign, so all of the title design and transitions are made by me.";
  dawnOfThePlanetOfTheApes.imgSrc = "images/dawnOfThePlanetOfTheApes.jpg";
  videoBoxStorage.push(dawnOfThePlanetOfTheApes);

  //___________________________________________________________________________________
  let theGreatWall = new VideoBox();
  theGreatWall.rank = 0;
  theGreatWall.rankImportance = 0;
  theGreatWall.tags = ["action", "sci-fi"];
  theGreatWall.videos = ["208768902"];
  theGreatWall.title = "The Great Wall";
  theGreatWall.description =
    "I worked really hard on this campaign. I think by the end of it, I had cut a handful of pretty good 30 second TV spots that all didn't end up finishing. We were convinced the clients would not want to finish any of our spots, but one day they ended up finishing one of them. Not a great spot, not a great movie, but a fun experience.";
  theGreatWall.imgSrc = "images/theGreatWall.jpg";
  videoBoxStorage.push(theGreatWall);

  //___________________________________________________________________________________
  let theWolverine = new VideoBox();
  theWolverine.rank = 0;
  theWolverine.rankImportance = 1;
  theWolverine.tags = ["action", "sci-fi", "drama"];
  theWolverine.videos = ["208427854", "208427841"];
  theWolverine.title = "The Wolverine";
  theWolverine.description =
    "I'm a big Marvel fan, so I would jump at any opportunity to work on one of their movies. I ended up getting a bronze key art award for one of my spots for The Wolverine.";
  theWolverine.imgSrc = "images/theWolverine.jpg";
  theWolverine.award = 1;
  videoBoxStorage.push(theWolverine);

  //___________________________________________________________________________________
  let joy = new VideoBox();
  joy.rank = 0;
  joy.rankImportance = 1;
  joy.tags = ["historical", "drama"];
  joy.videos = ["209164131", "209164107"];
  joy.title = "Joy";
  joy.description =
    "I cut a trailer to this over a month or so that didn't end up finishing, but I did get to watch a bunch of dailies and see how David O. Russell directs.";
  joy.imgSrc = "images/joy.jpg";
  videoBoxStorage.push(joy);

  //___________________________________________________________________________________
  let paperTowns = new VideoBox();
  paperTowns.rank = 0;
  paperTowns.rankImportance = 1;
  paperTowns.tags = ["drama", "comedy", "romance"];
  paperTowns.videos = ["208253092", "208252719", "208252904", "208252887"];
  paperTowns.title = "Paper Towns";
  paperTowns.description =
    "The client for this film ended up having me make many different graphic styles throughout the whole campaign, some worked, some didn't.";
  paperTowns.imgSrc = "images/paperTowns.jpg";
  videoBoxStorage.push(paperTowns);

  //___________________________________________________________________________________
  let theLongestRide = new VideoBox();
  theLongestRide.rank = 0;
  theLongestRide.rankImportance = 0;
  theLongestRide.tags = ["drama", "historical", "romance"];
  theLongestRide.videos = [
    "208767181",
    "208767145",
    "208767760",
    "208767783",
    "208768229",
    "208767210",
    "208767799",
    "208767812",
  ];
  theLongestRide.title = "The Longest Ride";
  theLongestRide.description =
    "Oh boy, this really put the pain in TV campaign. I started out assisting an editor on the trailer for this film, and by the end of the project I was solely in charge of the entire TV campaign. It was a lot of work, but the pay off was getting many of my first finished TV spots that more or less started my career. I was also convinced this would be Britt Robertson's big break... what happened to her?";
  theLongestRide.imgSrc = "images/theLongestRide.jpg";
  videoBoxStorage.push(theLongestRide);

  //___________________________________________________________________________________
  let oculus = new VideoBox();
  oculus.rank = 0;
  oculus.rankImportance = 0;
  oculus.tags = ["horror"];
  oculus.videos = ["209164279"];
  oculus.title = "Oculus";
  oculus.description =
    "I HATED WORKING ON THIS FILM. The movie was actually pretty good, but they wanted this :15 turned around in a weekend (graphics and cut) so I had to work long hours staring at scary imagery. By the end, I had really quickly covered the scary faces with pictures of Jennifer Lawrance (my crush at the time) so that I could keep working without getting panic farts.";
  oculus.imgSrc = "images/oculus.jpg";
  videoBoxStorage.push(oculus);

  //___________________________________________________________________________________
  let theMazeRunner = new VideoBox();
  theMazeRunner.rank = 0;
  theMazeRunner.rankImportance = 0;
  theMazeRunner.tags = ["action", "adventure", "sci-fi"];
  theMazeRunner.videos = ["209164210"];
  theMazeRunner.title = "The Maze Runner";
  theMazeRunner.description =
    "This was one of the first projects I worked on officially as an editor. I also helped on all the motion graphics, which included a lot of blends from live footage to comic book pages.";
  theMazeRunner.imgSrc = "images/theMazeRunner.jpg";
  videoBoxStorage.push(theMazeRunner);

  //___________________________________________________________________________________
  let theMazeRunnerScorchTrials = new VideoBox();
  theMazeRunnerScorchTrials.rank = 0;
  theMazeRunnerScorchTrials.rankImportance = 0;
  theMazeRunnerScorchTrials.tags = ["action", "adventure", "sci-fi"];
  theMazeRunnerScorchTrials.videos = ["209164258"];
  theMazeRunnerScorchTrials.title = "Maze Runner: The Scorch Trials";
  theMazeRunnerScorchTrials.description =
    "I worked on all 3 of the Maze Runner movies, and finished works for the first 2. I had a trailer for the third film that I worked on for some time, but it was scraped after Dylan O'Brien was injured and they had to delay the production.";
  theMazeRunnerScorchTrials.imgSrc = "images/theMazeRunnerScorchTrials.jpg";
  videoBoxStorage.push(theMazeRunnerScorchTrials);

  //___________________________________________________________________________________
  let jackRyan = new VideoBox();
  jackRyan.rank = 0;
  jackRyan.rankImportance = 0;
  jackRyan.tags = ["action", "adventure"];
  jackRyan.videos = ["209164258"];
  jackRyan.title = "Jack Ryan: Shadow Recruit";
  jackRyan.description =
    "I don't remember much about this film, but I do remember the line 'this is geopolitics, not couples therapy' being used throughout the office to much laughter. For example, this is a chicken sandwich not couples therapy.";
  jackRyan.imgSrc = "images/jackRyanShadowRecruit.jpg";
  videoBoxStorage.push(jackRyan);

  //___________________________________________________________________________________
  let ifIStay = new VideoBox();
  ifIStay.rank = 0;
  ifIStay.rankImportance = 0;
  ifIStay.tags = ["drama", "romance"];
  ifIStay.videos = ["209163980"];
  ifIStay.title = "If I Stay";
  ifIStay.description =
    "Well you know what they say about teen love dramas involving a tragic death, make a TV spot that copies the style of Alien. Which is exactly what I did for this.";
  ifIStay.imgSrc = "images/ifIStay.jpg";
  videoBoxStorage.push(ifIStay);

  //___________________________________________________________________________________
  let eddieTheEagle = new VideoBox();
  eddieTheEagle.rank = 0;
  eddieTheEagle.rankImportance = 0;
  eddieTheEagle.tags = ["adventure", "comedy", "historical"];
  eddieTheEagle.videos = ["209163863", "209163824"];
  eddieTheEagle.title = "Eddie The Eagle";
  eddieTheEagle.description =
    "I really loved this movie, it was exactly the type of corny / inspirational / heartfelt stories that I loved in film's from the 90's. I only got to finish 2 spots in total, but I worked on many more.";
  eddieTheEagle.imgSrc = "images/eddieTheEagle.jpg";
  videoBoxStorage.push(eddieTheEagle);

  //___________________________________________________________________________________
  let theFinestHours = new VideoBox();
  theFinestHours.rank = 0;
  theFinestHours.rankImportance = 1;
  theFinestHours.tags = ["adventure", "drama", "historical", "romance"];
  theFinestHours.videos = ["209510595", "209510549"];
  theFinestHours.title = "The Finest Hours";
  theFinestHours.description =
    "We got this project in at Transit mainly because of the work we did for Pete's Dragon. I tried to give them something different, and I think I delivered. One funny thing to note is that the ADR that Chris Pine recorded ended up having a much thicker Boston accent.";
  theFinestHours.imgSrc = "images/theFinestHours.jpg";
  videoBoxStorage.push(theFinestHours);

  //___________________________________________________________________________________
  let runnerRunner = new VideoBox();
  runnerRunner.rank = 0;
  runnerRunner.rankImportance = 0;
  runnerRunner.tags = ["action", "drama"];
  runnerRunner.videos = ["312819548"];
  runnerRunner.title = "Runner Runner";
  runnerRunner.description =
    "Does anyone even remember that this film existed? I do, because it was the first project I ever finished my motion graphics with.";
  runnerRunner.imgSrc = "images/runnerRunner.jpg";
  videoBoxStorage.push(runnerRunner);

  //___________________________________________________________________________________
  let theSecretLifeofWalterMitty = new VideoBox();
  theSecretLifeofWalterMitty.rank = 0;
  theSecretLifeofWalterMitty.rankImportance = 3;
  theSecretLifeofWalterMitty.tags = ["adventure", "drama", "romance", "comedy"];
  theSecretLifeofWalterMitty.videos = ["208428637", "208428618"];
  theSecretLifeofWalterMitty.title = "The Secret Life Of Walter Mitty";
  theSecretLifeofWalterMitty.description =
    "I mainly worked as a motion graphics artist for this campaign, and I ended up winning the Grand Key Art award for my spot Tumblr DHD.";
  theSecretLifeofWalterMitty.imgSrc = "images/theSecretLifeofWalterMitty.jpg";
  theSecretLifeofWalterMitty.award = 1;
  videoBoxStorage.push(theSecretLifeofWalterMitty);

  //___________________________________________________________________________________
  let valveTheInternational = new VideoBox();
  valveTheInternational.rank = 0;
  valveTheInternational.rankImportance = 3;
  valveTheInternational.tags = ["corporate"];
  valveTheInternational.videos = ["363464976", "363465012", "363465063"];
  valveTheInternational.title = "Valve: The International 2019";
  valveTheInternational.description =
    "I had the privilage of working for a short while at one of my favorite companies in the world, Valve. They needed help with some various spots for their giant competition The International. I begged and pleaded for my company to send me over to help, and they did. I absolutely loved every minute of it, and desperately wish to go back one day.";
  valveTheInternational.imgSrc = "images/valveAllianceTheInternational2019.jpg";
  videoBoxStorage.push(valveTheInternational);

  //___________________________________________________________________________________
  let dellTechnologiesWorld = new VideoBox();
  dellTechnologiesWorld.rank = 0;
  dellTechnologiesWorld.rankImportance = 0;
  dellTechnologiesWorld.tags = ["corporate"];
  dellTechnologiesWorld.videos = ["363467805", "363467702"];
  dellTechnologiesWorld.title = "Dell Technologies World 2019";
  dellTechnologiesWorld.description =
    "2 weeks before my wedding I was asked to fly down to Vegas and work on a few spots for the Dell Technologies World expo. I spent most of my time locked in THE BIGGEST HOTEL ROOM I'VE EVER STAYED IN working on various short social spots. All in all, it was a fantastic experience and I'm glad I got time to finish my wedding vowes in Vegas.";
  dellTechnologiesWorld.imgSrc = "images/dellTechnologiesWorld.jpg";
  videoBoxStorage.push(dellTechnologiesWorld);

  //___________________________________________________________________________________
  let indigoSlateEverywhereExperiences = new VideoBox();
  indigoSlateEverywhereExperiences.rank = 0;
  indigoSlateEverywhereExperiences.rankImportance = 1;
  indigoSlateEverywhereExperiences.tags = ["corporate"];
  indigoSlateEverywhereExperiences.videos = ["475255857"];
  indigoSlateEverywhereExperiences.title = "Indigo Slate Everywhere Experiences";
  indigoSlateEverywhereExperiences.description =
    "Before lockdown my company worked on elements for several in person events for big companies. But after quarantine started, we found a new opportunity in the virtual events space. My company tasked me with creating an ad to show off our virtual event capabilities. I created all of the motion graphics for this spot in addition to editing it.";
  indigoSlateEverywhereExperiences.imgSrc = "images/indigoSlateEverywhereExperiences.jpg";
  videoBoxStorage.push(indigoSlateEverywhereExperiences);

  //___________________________________________________________________________________
  let indigoSlateDesignLedThinking = new VideoBox();
  indigoSlateDesignLedThinking.rank = 0;
  indigoSlateDesignLedThinking.rankImportance = 0;
  indigoSlateDesignLedThinking.tags = ["corporate"];
  indigoSlateDesignLedThinking.videos = ["475254162"];
  indigoSlateDesignLedThinking.title = "Indigo Slate Design-Led Thinking";
  indigoSlateDesignLedThinking.description =
    "This was a fun project because it features many of my previous videos with the company so I got to kind of take a walk down memory lane. I edited this video, in addition to creating the motion graphics and recording the voice over narration.";
  indigoSlateDesignLedThinking.imgSrc = "images/indigoSlateDesignLedThinking.jpg";
  videoBoxStorage.push(indigoSlateDesignLedThinking);

  //___________________________________________________________________________________
  let paccarFutureSales = new VideoBox();
  paccarFutureSales.rank = 0;
  paccarFutureSales.rankImportance = 1;
  paccarFutureSales.tags = ["corporate", "technology"];
  paccarFutureSales.videos = ["475252039"];
  paccarFutureSales.title = "PACCAR Future Sales";
  paccarFutureSales.description =
    "A fun video that I edited for PACCAR that also involved a lot of motion tracking and rotoscoping.";
  paccarFutureSales.imgSrc = "images/paccarFutureSales.jpg";
  videoBoxStorage.push(paccarFutureSales);

  //___________________________________________________________________________________
  let sapConcurCustomerTrust = new VideoBox();
  sapConcurCustomerTrust.rank = 0;
  sapConcurCustomerTrust.rankImportance = 1;
  sapConcurCustomerTrust.tags = ["corporate"];
  sapConcurCustomerTrust.videos = ["363464400"];
  sapConcurCustomerTrust.title = "SAP Concur Customer Trust";
  sapConcurCustomerTrust.description =
    "This was a fun short project to edit, it mostly involved a lot of camera stabilization and simple text design, but it was a fun day to be on set for.";
  sapConcurCustomerTrust.imgSrc = "images/SAPConcurCustomerTrust.jpg";
  videoBoxStorage.push(sapConcurCustomerTrust);

  //___________________________________________________________________________________
  let microsoftProjectHanover = new VideoBox();
  microsoftProjectHanover.rank = 0;
  microsoftProjectHanover.rankImportance = 1;
  microsoftProjectHanover.tags = ["corporate", "technology"];
  microsoftProjectHanover.videos = ["363461298"];
  microsoftProjectHanover.title = "Microsoft AI Project Hanover";
  microsoftProjectHanover.description =
    "This was one of the last videos I edited during my short time freelancing for Motion Forge in Seattle. Not a super flashy cut, but I found the subject matter to be super interesting.";
  microsoftProjectHanover.imgSrc = "images/microsoftAIProjectHanover.jpg";
  videoBoxStorage.push(microsoftProjectHanover);

  //___________________________________________________________________________________
  let microsoftAILoblaw = new VideoBox();
  microsoftAILoblaw.rank = 0;
  microsoftAILoblaw.rankImportance = 0;
  microsoftAILoblaw.tags = ["corporate", "technology"];
  microsoftAILoblaw.videos = ["363463375"];
  microsoftAILoblaw.title = "Microsoft AI Loblaw";
  microsoftAILoblaw.description =
    "One of the first videos I edited for Motion Forge in Seattle. It was a great experience that taught me a lot about greenscreen work, and helped me continue to improve my motion tracking skills.";
  microsoftAILoblaw.imgSrc = "images/microsoftAI-Loblaw.jpg";
  videoBoxStorage.push(microsoftAILoblaw);

  //___________________________________________________________________________________
  let microsoftAIBDM = new VideoBox();
  microsoftAIBDM.rank = 0;
  microsoftAIBDM.rankImportance = 0;
  microsoftAIBDM.tags = ["corporate", "technology"];
  microsoftAIBDM.videos = ["363462269"];
  microsoftAIBDM.title = "Microsoft AI BDM";
  microsoftAIBDM.description =
    "The main thing I remember about cutting this video, SO MANY SLIDING PANELS! It was a bit of a pain to make small adjustments during versions because it would effect hundreds of keyframes down the line, but it turned out great.";
  microsoftAIBDM.imgSrc = "images/microsoftAI-BDM.jpg";
  videoBoxStorage.push(microsoftAIBDM);

  //___________________________________________________________________________________
  let microsoftGOSHTeamUp = new VideoBox();
  microsoftGOSHTeamUp.rank = 0;
  microsoftGOSHTeamUp.rankImportance = 0;
  microsoftGOSHTeamUp.tags = ["corporate", "technology"];
  microsoftGOSHTeamUp.videos = ["475253473"];
  microsoftGOSHTeamUp.title = "Microsoft GOSH Team Up";
  microsoftGOSHTeamUp.description =
    "There's something about smilling kids that makes me a bit teary. It was a pleasure to get to work on this, mainly to find out how great of a place GOSH is.";
  microsoftGOSHTeamUp.imgSrc = "images/microsoftGOSHTeamUp.jpg";
  videoBoxStorage.push(microsoftGOSHTeamUp);

  //___________________________________________________________________________________
  let xboxAdaptiveController = new VideoBox();
  xboxAdaptiveController.rank = 0;
  xboxAdaptiveController.rankImportance = 0;
  xboxAdaptiveController.tags = ["corporate", "technology"];
  xboxAdaptiveController.videos = ["363466498"];
  xboxAdaptiveController.title = "Xbox Adaptive Controller";
  xboxAdaptiveController.description =
    "The team that created the packaging for the Xbox Adaptive Controller won an award, so we had a short time to pull a video together that would play during their acceptance. I think it turned out rather nice.";
  xboxAdaptiveController.imgSrc = "images/xboxAdaptiveController.jpg";
  videoBoxStorage.push(xboxAdaptiveController);

  //___________________________________________________________________________________
  let microsoftSmartSpaces = new VideoBox();
  microsoftSmartSpaces.rank = 0;
  microsoftSmartSpaces.rankImportance = 1;
  microsoftSmartSpaces.tags = ["corporate", "technology"];
  microsoftSmartSpaces.videos = ["518814848"];
  microsoftSmartSpaces.title = "Microsoft Smart Spaces";
  microsoftSmartSpaces.description =
    "This was a very fun video to edit, and I also got to create a ton of motion tracked graphics throughout. Additionally, the shot of the thermometer at the end is the first fully 3D element I got to finish in a video for Indigo Slate.";
  microsoftSmartSpaces.imgSrc = "images/microsoftSmartSpaces.jpg";
  videoBoxStorage.push(microsoftSmartSpaces);

  //___________________________________________________________________________________
  let skypeMeetNow = new VideoBox();
  skypeMeetNow.rank = 0;
  skypeMeetNow.rankImportance = 4;
  skypeMeetNow.tags = ["corporate"];
  skypeMeetNow.videos = ["475257653"];
  skypeMeetNow.title = "Skype Meet Now";
  skypeMeetNow.description =
    "The fact that we were able to pull this all together while working remotely in such a short time was a total team effort. I'm very happy to have been given the chance to make this become a reality. And I found a place to put my wife's voice in again, she is the person saying 'did you fall asleep?'.";
  skypeMeetNow.imgSrc = "images/skypeMeetNow.jpg";
  videoBoxStorage.push(skypeMeetNow);

  //___________________________________________________________________________________
  let microsoft365Deployment = new VideoBox();
  microsoft365Deployment.rank = 0;
  microsoft365Deployment.rankImportance = 0;
  microsoft365Deployment.tags = ["corporate", "technology"];
  microsoft365Deployment.videos = ["400813202"];
  microsoft365Deployment.title = "Microsoft M365 Deployment";
  microsoft365Deployment.description =
    "I can't remember what camera we shot this on, I think it was the RED epic? Whichever camera it was, it became a nightmare to deal with 6k footage in Premiere.";
  microsoft365Deployment.imgSrc = "images/microsoft365Deployment.jpg";
  videoBoxStorage.push(microsoft365Deployment);

  //___________________________________________________________________________________
  let microsoft365PartnerVideos = new VideoBox();
  microsoft365PartnerVideos.rank = 0;
  microsoft365PartnerVideos.rankImportance = 0;
  microsoft365PartnerVideos.tags = ["corporate", "technology"];
  microsoft365PartnerVideos.videos = ["518814473", "518815084", "518815191"];
  microsoft365PartnerVideos.title = "Microsoft M365 Partner Videos";
  microsoft365PartnerVideos.description =
    "A fun little project consisting of 3 seperate but connected videos that gave me an opportunity to learn how to replace screens properly.";
  microsoft365PartnerVideos.imgSrc = "images/microsoft365PartnerVideos.jpg";
  videoBoxStorage.push(microsoft365PartnerVideos);

  //___________________________________________________________________________________
  let microsoftAzureAD20Years = new VideoBox();
  microsoftAzureAD20Years.rank = 0;
  microsoftAzureAD20Years.rankImportance = 2;
  microsoftAzureAD20Years.tags = ["corporate", "technology"];
  microsoftAzureAD20Years.videos = ["518814623"];
  microsoftAzureAD20Years.title = "Microsoft Azure AD 20 Years";
  microsoftAzureAD20Years.description =
    "This was right at the beginning of my employment at Indigo Slate. A fun little 'documentary' style video that taught me a lot about longer format videos. Also the main guy, Stuart, had a really adorable canadian accent.";
  microsoftAzureAD20Years.imgSrc = "images/microsoftAzureAD20Years.jpg";
  videoBoxStorage.push(microsoftAzureAD20Years);

  //___________________________________________________________________________________
  let microsoft365MobileProductivity = new VideoBox();
  microsoft365MobileProductivity.rank = 0;
  microsoft365MobileProductivity.rankImportance = 5;
  microsoft365MobileProductivity.tags = ["corporate", "technology"];
  microsoft365MobileProductivity.videos = ["516839250"];
  microsoft365MobileProductivity.title = "Microsoft M365 Mobile Productivity";
  microsoft365MobileProductivity.description =
    "Easily my favorite video I've made for Indigo Slate yet. It involved lots of very challenging screen replacements, and stitching together a cohesive story that involved several characters. Also, I got to record the VO for this one too!";
  microsoft365MobileProductivity.imgSrc = "images/microsoft365MobileProductivity.jpg";
  videoBoxStorage.push(microsoft365MobileProductivity);

  //___________________________________________________________________________________
  let microsoftBuildingBuild = new VideoBox();
  microsoftBuildingBuild.rank = 0;
  microsoftBuildingBuild.rankImportance = 3;
  microsoftBuildingBuild.tags = ["corporate", "technology"];
  microsoftBuildingBuild.videos = ["521752909"];
  microsoftBuildingBuild.title = "Microsoft Building Build";
  microsoftBuildingBuild.description =
    "Microsoft Build 2020 was already far along in it's preperation when the pandemic hit, causing them to halt everything and move to a virtual event. We documented what it took to make that happen. This is the longest narrative video I've cut for Indigo Slate, and it was an absolute pleasure to work on.";
  microsoftBuildingBuild.imgSrc = "images/microsoftBuildingBuild.jpg";
  videoBoxStorage.push(microsoftBuildingBuild);

  //___________________________________________________________________________________
  let sapSizzle = new VideoBox();
  sapSizzle.rank = 0;
  sapSizzle.rankImportance = 2;
  sapSizzle.tags = ["corporate", "technology"];
  sapSizzle.videos = ["525680252"];
  sapSizzle.title = "Indigo Slate SAP Sizzle";
  sapSizzle.description =
    "I quickly put together this short sizzle video to show off all the amazing work we've created for the SAP organization. I really like who it turned out.";
  sapSizzle.imgSrc = "images/sapSizzle.jpg";
  videoBoxStorage.push(sapSizzle);
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
  removeAllChildNodes(document.getElementById("cardContainer"));

  let searchQuery = document.getElementById("searchBox").value;

  for (i = 0; i < videoBoxStorage.length; i++) {
    let re = new RegExp(`${searchQuery.toLowerCase()}`, "gi");
    if (videoBoxStorage[i].title.toLowerCase().match(re) !== null) {
      videoBoxStorage[i].rank += 1;
    }
  }
  document.getElementById("searchBox").value = "";
  rankSort();
}

function browseAll() {
  //empty the DOM and reset all tags except browseAll to tagToggled
  removeAllChildNodes(document.getElementById("cardContainer"));
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
  removeAllChildNodes(document.getElementById("cardContainer"));

  for (i = 0; i < videoBoxStorage.length; i++) {
    let tagsSearched = 0;
    for (j = 0; j < allTagsSearchList.length; j++) {
      if (videoBoxStorage[i].tags.includes(allTagsSearchList[j].toLowerCase())) {
        tagsSearched++;
      }
    }
    if (tagsSearched == allTagsSearchList.length && allTagsSearchList.length >= 1) {
      videoBoxStorage[i].rank += 1;
    }
  }
  rankSort();
}

function awardSearch() {
  //set all ranks to 0
  videoBoxStorage.forEach((element) => (element.rank = 0));
  //remove all video boxes from container
  removeAllChildNodes(document.getElementById("cardContainer"));

  for (i = 0; i < videoBoxStorage.length; i++) {
    if (videoBoxStorage[i].award > 0) {
      videoBoxStorage[i].rank += 1;
    }
  }
  rankSort();
}

function loopingLottieCheck() {
  let taggedCount = 0;
  let curTag = document.getElementsByClassName("tag");
  for (i = 0; i < curTag.length; i++) {
    if (curTag[i].classList.contains("tagToggled")) {
      taggedCount++;
    }
  }
  if (taggedCount == 0) {
    document.getElementById("loopingLottie").style.display = "block";
  } else {
    document.getElementById("loopingLottie").style.display = "none";
  }
}
