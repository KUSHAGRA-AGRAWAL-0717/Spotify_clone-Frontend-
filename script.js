console.log("let write some javascript");
let currentsong = new Audio();
let songs;

function convertSecondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Round down the seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // Ensure two digits for seconds
}

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playmusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00";
};
async function main() {
  let songs = await getsongs(); // //get the lists of all the songs
  playmusic(songs[0], true);
  //show all the songs in the playlist
  let songsul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songsul.innerHTML =
      songsul.innerHTML +
      `<li><img class="invert" src="music.svg" />
                           <div class="info">
                               <div> ${song.replaceAll("%20", " ")}</div>
                               </div>
                          <div class="playnow">
                          <span>PLay Now</span>
                          <img class="invert" src="play.svg" />
                        </div>  
                        </li>`;
  }

  //attach an event listener to the every song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //attach an event listener to the previous and next and play button
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });
  //listen for time update event
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".songtime"
    ).innerHTML = `${convertSecondsToMinutesSeconds(
      currentsong.currentTime
    )}/${convertSecondsToMinutesSeconds(currentsong.duration)}`;
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  //add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%"; //this function getbou.. is tell the current x and y and various other thing about the given tsrget
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
  //add an event listener to previous and next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    // currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });
  //add an event to range
  // document
  //   .querySelector(".range")
  //   .getElementsByTagName("input")[0]
  //   .addEventListener("change", (e) => {
  //     currentsong.volume = parseInt(e.target.value)/100;
  //   });
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseFloat(e.target.value) / 100;
    });
}
main();
