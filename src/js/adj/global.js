var screenWidth = 800;
var screenHeight = 600;

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
var pMaskW = 48;
var pMaskH = 50;

const GameState = {
    Loading: -1,
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
	GameOver: 3,
	Paused: 4,
	Popup: 5,
};
var gameState = GameState.Loading;

var gameJustPaused = false;
var gameJustPopup = false;
var gameJustPunched = false;

var allImagesLoaded = false;

var frameRate = 60;
var animCounter = 0;

var jump = true;
