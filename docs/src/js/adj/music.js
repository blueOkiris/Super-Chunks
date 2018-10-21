/* Music files */
const BackgroundMusic = {
	TitleTheme: 0,
	IntroLevel: 1,
}
class MusicPlayer {
	constructor() {
		this.songList = [
			new Audio("src/sounds/Chunks-Title.wav"),
			new Audio("src/sounds/Chunks-Intro-Level.wav")
		];

		this.currentSong = -1;
	}

	play(song) {
		this.songList[song].play();
		this.currentSong = song;
	}

	stop() {
		for(let i = 0; i < this.songList.length; i++) {
			this.songList[i].pause();
			this.songList[i].currentTime = 0;
		}
	}
}
var music = new MusicPlayer();

const Sounds = {	
	Jump: 0,
	Punch: 1,
	Pound: 2,
	Death: 3,
}
var sounds = [
	new Audio("src/sounds/270337__littlerobotsoundfactory__pickup-00.wav"),
	new Audio("src/sounds/270327__littlerobotsoundfactory__hit-00.wav"),
	new Audio("src/sounds/270310__littlerobotsoundfactory__explosion-04.wav"),
	new Audio("src/sounds/270328__littlerobotsoundfactory__hero-death-00.wav"),
];
