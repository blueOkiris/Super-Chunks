var animCounter = 0;// Controls the updating of animations
var spaceCounter = 0;

var start = true;

// Keyboard stuff
var key = [false, false, false, false, false, false, false, false, false, false, false, false]; //  Up, down, left, right, space, z, w, a, s, d, escape, enter
var up = 0, down = 1, left = 2, right = 3, space = 4, z_key = 5, w_key = 6, a_key = 7, s_key = 8, d_key = 9, esc = 10, enter = 11;
// Mouse stuff
var mouse_x = 0, mouse_y = 0, mouse_pressed = false;

/* My Code */
var GameState = {
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
	GameOver: 3,
	Paused: 4,
	Popup: 5,
};
var game_state = GameState.Menu;

function Player(startx, starty, image_speed, move_speed, punch_speed, gravity, jumpSpeed, maskw, maskh) {
	this.x = startx;
	this.y = starty;
	
	this.img_spd = image_speed;
	this.mv_spd = move_speed;
	this.pnc_spd = punch_speed;
	
	this.grav = gravity;
	this.jmp_spd = jumpSpeed;
	
	this.vsp = 0;
	this.hsp = 0;
	
	this.mask_w = maskw;
	this.mask_h = maskh;
	
	this.dir = 1;
	
	this.grounded = false;
	this.canDoubleJump = true;
	this.punching = false;
	this.punched = false;
	this.punchStart = 0;
	
	this.doubleJumpUnlocked = false;
	this.punchUnlocked = false;
	this.poundUnlocked = false;
	
	this.restart = function() {
		this.x = startx;
		this.y = starty;
		this.hsp = 0;
		this.vsp = 0;
		this.grounded = false;
		this.canDoubleJump = true;
		this.punching = false;
		this.punched = false;
		this.punchStart = 0;
		this.dead = false;
	}
	
	this.dead = false;	
	this.lives = 3;
}

function Enemy(startx, starty, grav, identifier, start_dir) {
	this.x = startx;
	this.y = starty;
	
	this.dir = start_dir;
	this.vsp = 0;
	this.gravity = grav;
	this.move_speed = 1;
	
	this.dead = false;
	this.start = true;
	
	this.id = identifier;
	
	this.restart = function() {
		this.x = startx;
		this.y = starty;
		
		this.vsp = 0;
		
		this.dead = false;
		this.start = true;
		
		this.dir = start_dir;
	}
}

function Unlockable(xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
}

var player = new Player(test_level_start[0], test_level_start[1], 1, 4, 10, 0.4, 11, 46, 50);
var test_level_enemies = [new Enemy(64 * 21, 64 * 15, player.grav, 1, -1),
							new Enemy(64 * 29, 64 * 14, player.grav, 1, -1),
							new Enemy(64 * 13, 64 * 18, player.grav, 0, -1),
							new Enemy(64 * 22, 64 * 15, player.grav, 0, 1),
							new Enemy(64 * 54, 64 * 21, player.grav, 1, -1)];
	test_level_enemies[3].dir = 1;

var current_level = test_level;
var enemies = test_level_enemies;
var doubleJumpScroll = new Unlockable(8 * 64, 14.5 * 64);
var punchScroll = new Unlockable(32 * 64, 13.5 * 64);
var poundScroll = new Unlockable(45 * 64, 13.5 * 64);

function blockAt(checkx, checky) {
	return current_level[Math.floor(checky / 64)][Math.floor(checkx / 64)];
}

function isSolid(block_id) {
	switch(block_id) {
	case 1: // Grass block
		return true;
	case 2: // Dirt block
		return true;
	case 3: // Stone block
		return true;
		
	default:
		return false;
	}
}

var jump = false;

var game_canpause = true;
var game_popup = true;
var game_pause_msg = ["", "", "", "PAUSED", "", "", "", "PRESS P OR ESCAPE TO RESUME"];
var game_popup_msg = ["", "", "", "", "", "", "", "PRESS ENTER TO RESUME"];


