console.log("Welcome to AJ Songs");

// === Initialization ===
let songIndex = 0;
const audioElement = new Audio('1.mp3');
const masterPlay = document.getElementById('masterPlay');
const myProgressBar = document.getElementById('myProgressBar');
const gif = document.getElementById('gif');
const masterSongName = document.getElementById('masterSongName');
const songItems = Array.from(document.getElementsByClassName('songItem'));

const songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "1.mp3", coverPath: "1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "2.mp3", coverPath: "2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]", filePath: "3.mp3", coverPath: "3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart", filePath: "4.mp3", coverPath: "4.jpg" },
    { songName: "Janji - Heroes Tonight", filePath: "5.mp3", coverPath: "5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "2.mp3", coverPath: "6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "2.mp3", coverPath: "7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "2.mp3", coverPath: "8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "2.mp3", coverPath: "9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "4.mp3", coverPath: "10.jpg" }
];

// === Populate Song List ===
songItems.forEach((item, index) => {
    item.querySelector("img").src = songs[index].coverPath;
    item.querySelector(".songName").innerText = songs[index].songName;
});

// === Play/Pause Toggle ===
masterPlay.addEventListener("click", () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        togglePlayPause(true);
    } else {
        audioElement.pause();
        togglePlayPause(false);
    }
});

const togglePlayPause = (isPlaying) => {
    masterPlay.classList.toggle("fa-play-circle", !isPlaying);
    masterPlay.classList.toggle("fa-pause-circle", isPlaying);
    gif.style.opacity = isPlaying ? 1 : 0;
};

// === Seekbar Updates ===
audioElement.addEventListener("timeupdate", () => {
    const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    const minutes = Math.floor(audioElement.currentTime / 60);
    const seconds = ("0" + Math.floor(audioElement.currentTime % 60)).slice(-2);
    document.getElementById("currentTime").innerText = `${minutes}:${seconds}`;
});

myProgressBar.addEventListener("change", () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// === Update Duration on Load ===
audioElement.addEventListener("loadedmetadata", () => {
    const mins = Math.floor(audioElement.duration / 60);
    const secs = ("0" + Math.floor(audioElement.duration % 60)).slice(-2);
    document.getElementById("totalDuration").innerText = `${mins}:${secs}`;
});

// === Song Item Click Events ===
const playButtons = document.querySelectorAll(".songItemPlay");

const makeAllPlays = () => {
    playButtons.forEach((btn) => {
        btn.classList.remove("fa-pause-circle");
        btn.classList.add("fa-play-circle");
    });
};

songItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        makeAllPlays();
        playSong(index);
        updateSelected(index);
    });
});

const playSong = (index) => {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    togglePlayPause(true);
    updateMediaSession(songs[songIndex]);
};

const updateSelected = (index) => {
    document.querySelectorAll(".songItem").forEach((el) => el.classList.remove("selected"));
    songItems[index].classList.add("selected");
    makeAllPlays();
    const btn = songItems[index].querySelector(".songItemPlay");
    btn.classList.remove("fa-play-circle");
    btn.classList.add("fa-pause-circle");
};

// === Next / Previous ===
document.getElementById("next").addEventListener("click", () => {
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
    updateSelected(songIndex);
});

document.getElementById("previous").addEventListener("click", () => {
    songIndex = songIndex > 0 ? songIndex - 1 : 0;
    playSong(songIndex);
    updateSelected(songIndex);
});

// === Auto Play Next ===
audioElement.addEventListener("ended", () => {
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
    updateSelected(songIndex);
});

// === Media Session ===
function updateMediaSession(song) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.songName,
            artist: "Your Artist Name",
            album: "Your Album Name",
            artwork: [
                { src: song.coverPath, sizes: '512x512', type: 'image/jpeg' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => audioElement.play());
        navigator.mediaSession.setActionHandler('pause', () => audioElement.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => document.getElementById('previous').click());
        navigator.mediaSession.setActionHandler('nexttrack', () => document.getElementById('next').click());
    }
}

// === Initial Load ===
audioElement.src = songs[songIndex].filePath;
masterSongName.innerText = songs[songIndex].songName;
audioElement.currentTime = 0;
updateMediaSession(songs[songIndex]);
