function getClosestResolution(width) {
	let supportedWidths = [1024, 1152, 1280, 1366, 1920];
	let current = supportedWidths[0];

	for(let i = 0; i < supportedWidths.length; i++) {
		if(Math.abs(width - supportedWidths[i]) < Math.abs(width - current))
			current = supportedWidths[i];
	}

	return current;
}
var screenWidth = getClosestResolution(window.innerWidth * 11 / 12); // Take the width of the window and add a little bit of breathing room
var screenHeight = screenWidth * 9 / 16; // Do wide screen

// Typical sizes of sprites and tiles
var tileWidth = 64;
var tileHeight = 64;
var spriteWidth = 64;
var spriteHeight = 64;

// Player values
var pImageSpeed = 1;
var pMoveSpeed = 4;
var pPunchSpeed = 10;
var pGravity = 0.4;
var pJumpSpeed = 11;
var pMaskW = 54;
var pMaskH = 52;
var pDefAbilities = [ false, false, false ]; // [punch, dbl jmp, pnd];

var startLives = 3;

var enemyMaskW = 50;
var enemyMaskH = 56;

const GameState = {
    Loading: -1,
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
	GameOver: 3,
	Paused: 4,
	Popup: 5,
	ChangeLevel: 6,
	LevelSelect: 7,
	StartLevel: 8,
	LevelDown: 9,
	LevelUp: 10,
};
var gameState = GameState.Loading;

var gameJustPaused = false;
var gameJustPopup = false;
var gameJustPunched = false;

var allImagesLoaded = false;

var frameRate = 60;
var animCounter = 0;

var jump = true;

var gamePauseMessage = "PAUSED";
var gameUnlockedMessage = [];
