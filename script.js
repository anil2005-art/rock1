console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    { songName: "Insaanile Ft Hanan Shaah", filePath:"1.mp3", coverPath: "1.jpg"},
    {songName: "Kasavinaal", filePath: "2.mp3", coverPath: "2.jpg"},
    {songName: "Kasavinal Ft Hanan Shaah", filePath: "3.mp3", coverPath: "3.jpg"},
    {songName: "MHR x JOKER - MUNTHIRICHAR", filePath: "4.mp3", coverPath: "4.jpg"},
    {songName: "Narivetta - Minnalvala", filePath: "5.mp3", coverPath: "5.jpg"},
    {songName: "jagga jasoos galti se mistake", filePath: "6.mp3", coverPath: "6.jpg"},
    {songName: "chal", filePath: "7.mp3", coverPath: "7.jpg"},
    {songName: "Aaj Ki Raat  Stree 2  Tamannaah Bhatia  ", filePath: "8.mp3", coverPath: "8.jpg"},
    {songName: "Habibi Drip (Music song) - Nivin Pauly  ", filePath: "9.mp3", coverPath: "9.jpg"},
    {songName: "Illuminati (Music song) ", filePath: "10.mp3", coverPath: "10.jpg"},
]

songItems.forEach((element, i) => {
    element.addEventListener('click', () => {
        makeAllPlays();
        songIndex = i;
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');

        // update icon if play icon exists inside the songItem
        let playBtn = element.querySelector('.songItemPlay');
        if (playBtn) {
            playBtn.classList.remove('fa-play-circle');
            playBtn.classList.add('fa-pause-circle');
        }
    });
});
let playButtons = document.querySelectorAll(".songItemPlay");

playButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        // Remove existing selection
        document.querySelectorAll(".songItem").forEach(item => {
            item.classList.remove("selected");
        });

        // Add glow to the parent songItem
        let songItem = e.target.closest(".songItem");
        songItem.classList.add("selected");
    });
});

songItems.forEach((element, i)=>{ 
    element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName; 
})
 

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})
// Listen to Events
audioElement.addEventListener('timeupdate', ()=>{ 
    // Update Seekbar
    progress = parseInt((audioElement.currentTime/audioElement.duration)* 100); 
    myProgressBar.value = progress;
})

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}
audioElement.addEventListener('ended', () => {
    if(songIndex >= songs.length - 1){
        songIndex = 0; // loop back to first song
    } else {
        songIndex++;
    }

    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');

    makeAllPlays(); // reset all play buttons
    let playingButton = document.getElementById(songIndex.toString());
    if (playingButton) {
        playingButton.classList.remove('fa-play-circle');
        playingButton.classList.add('fa-pause-circle');
    }
});

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{ 
        makeAllPlays();
        songIndex = parseInt(e.target.id);
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        audioElement.src = `${songIndex+1}.mp3`;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    })
})

document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex>=9){
        songIndex = 0
    }
    else{
        songIndex += 1;
    }
    audioElement.src = `${songIndex+1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');

})

document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex<=0){
        songIndex = 0
    }
    else{
        songIndex -= 1;
    }
    audioElement.src = `${songIndex+1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
})
// Update Media Session info for lock screen / notifications
function updateMediaSession(song) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.songName,
            artist: "Your Artist Name", // Optional: you can customize
            album: "Your Album Name",  // Optional
            artwork: [
                { src: song.coverPath, sizes: '512x512', type: 'image/jpeg' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
            audioElement.play();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            audioElement.pause();
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            document.getElementById('previous').click();
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            document.getElementById('next').click();
        });
    }
}
updateMediaSession(songs[songIndex]);
audioElement.src = songs[songIndex].filePath;
masterSongName.innerText = songs[songIndex].songName;
audioElement.currentTime = 0;
audioElement.play();
updateMediaSession(songs[songIndex]); // ✅ ADD THIS LINE
document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex >= 9){
        songIndex = 0;
    } else {
        songIndex += 1;
    }

    audioElement.src = `${songIndex + 1}.mp3`;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');

    updateMediaSession(songs[songIndex]); // ✅ ADD THIS
});

