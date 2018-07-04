var animCounter = 0;// Controls the updating of animations

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

function Level(layout, bg_color, enemy_location, start_location) {
	this.data = layout;
	this.background = bg_color;
	this.enemies = enemy_location;
	this.start = start_location;
}

function Player(startx, starty, image_speed, move_speed, punch_speed, gravity, jumpSpeed, maskw, maskh, unlock) {
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
	this.punchStart = 0;
	this.canPunch = true;
	this.airPunch = false;
	
	/* Unlock Codes:
	 * 0 -> none
	 * 1 -> double
	 * 2 -> punch
	 * 3 -> pound 
	 * 4 -> double punch 
	 * 5 -> double pound
	 * 6 -> punch pound 
	 * 7 -> double punch pound
	 */
	this.doubleJumpUnlocked = unlock == 1 || unlock == 3 || unlock == 4 || unlock == 7;
	this.punchUnlocked = unlock == 2 || unlock == 4 || unlock == 6 || unlock == 7;
	this.poundUnlocked = unlock == 3 || unlock == 5 || unlock == 6 || unlock == 7;
	
	this.setUnlock = function(x) {
		this.doubleJumpUnlocked = x == 1 || x == 3 || x == 4 || x == 7;
		this.punchUnlocked = x == 2 || x == 4 || x == 6 || x == 7;
		this.poundUnlocked = x == 3 || x == 5 || x == 6 || x == 7;
	}
	
	this.saveUnlock = function() {
		
	}
	
	this.restart = function() {
		this.x = startx;
		this.y = starty;
		this.hsp = 0;
		this.vsp = 0;
		this.grounded = false;
		this.canDoubleJump = true;
		this.punching = false;
		this.canPunch = true;
		this.airPunch = false;
		this.punchStart = 0;
		this.dead = false;
		this.airPunched = false;
	};
	
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

var player = new Player(0, 0, 1, 4, 10, 0.4, 11, 46, 50, 0);

var current_unlock = 0;

var menu_music = 0;
var intro_level_music = 1;

var current_music = menu_music;

var doubleJumpScroll = new Unlockable(8 * 64, 14.5 * 64);
var punchScroll = new Unlockable(32 * 64, 13.5 * 64);
var poundScroll = new Unlockable(45 * 64, 13.5 * 64);

function blockAt(checkx, checky) {
	return current_level.data[Math.floor(checky / 64)][Math.floor(checkx / 64)];
}

function isSolid(block_id) {
	switch(block_id) {
	case 1: // Grass block
		return true;
	case 2: // Dirt block
		return true;
	case 3: // Stone block
		return true;
	case 4: // Door (black) block
		return false;
		
	default:
		return false;
	}
}

var jump = false;

var game_canpause = true;
var game_popup = true;
var game_pause_msg = ["", "", "", "PAUSED", "", "", "", "PRESS P OR ESCAPE TO RESUME"];
var game_popup_msg = ["", "", "", "", "", "", "", "PRESS ENTER TO RESUME"];


