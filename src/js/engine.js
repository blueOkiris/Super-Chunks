var animCounter = 0;// Controls the updating of animations
// Keyboard stuff
var key = [false,false,false,false]; //  Up, down, left, right
var up = 0, down = 1, left = 2, right = 3;
// Mouse stuff
var mouse_x = 0, mouse_y = 0, mouse_pressed = false;

/* My Code */
var GameState = {
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
};
var game_state = GameState.MenuToGame;

function Player(startx, starty, image_speed, move_speed, gravity, jumpSpeed, maskw, maskh) {
	this.x = startx;
	this.y = starty;
	
	this.img_spd = image_speed;
	this.mv_spd = move_speed;
	
	this.grav = gravity;
	this.jmp_spd = jumpSpeed;
	
	this.vsp = 0;
	this.hsp = 0;
	
	this.mask_w = maskw;
	this.mask_h = maskh;
	
	this.dir = 1;
	
	this.grounded = false;
	this.canDoubleJump = true;
}

function Brocolli(startx, starty, grav) {
	this.x = startx;
	this.y = starty;
	this.mask = function() {
		return new Rect(this.x - 32, this.y - 32, 64, 64);
	}
	this.dir = -1;
	this.vsp = 0;
	this.gravity = grav;
}

var player = new Player(test_level_start[0], test_level_start[1], 1, 2, 0.5, 12, 48, 50);
var test_level_brocollis = [new Brocolli(64 * 21, 64 * 11, player.grav),
							new Brocolli(64 * 29, 64 * 10, player.grav),
							new Brocolli(64 * 13, 64 * 14, player.grav)];

var current_level = test_level;
var brocollis = test_level_brocollis;

function blockAt(checkx, checky) {
	return current_level[Math.floor(checky / 64)][Math.floor(checkx / 64)];
}

function isSolid(block_id) {
	switch(block_id) {
	case 1: // Grass block
		return true;
	case 2: // Dirt block
		return true;
		
	default:
		return false;
	}
}

var jump = false;

// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(mouse_pressed &&
			(mouse_x >= 300 && mouse_x <= 500 &&
			 mouse_y >= 275 && mouse_y <= 325)) { // Mouse is in box
			game_state = GameState.MenuToGame; // Wait for release
		}
		break;
	
	case GameState.MenuToGame:
		if(!mouse_pressed) {
			game_state = GameState.Game;
			// Play music in the background
			//bg_music.play();
		}
		break;
	
	case GameState.Game: // play the game
		// Player physics
		var move = key[right] - key[left];
		player.hsp = player.mv_spd * move;
		
		player.vsp += player.grav;
		
		// Check y collision
		if(player.y + player.vsp < 0) {
			player.y = 0;
			player.vsp = 0;
		} else {
			var blockLeft = blockAt(player.x, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			var blockMid = blockAt(player.x + player.mask_w / 2, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			var blockRight = blockAt(player.x + player.mask_w, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			
			// Move until flush against contact
			var xPos = isSolid(blockLeft) ? player.x : isSolid(blockMid) ? player.x + player.mask_w / 2 : isSolid(blockRight) ? player.x + player.mask_w: -1024;
			if(xPos >= 0 && player.vsp != 0) { // There is a collision
				while(!isSolid(blockAt(xPos, player.y + (player.vsp > 0 ? player.mask_h : 0) + Math.sign(player.vsp))))
					player.y += Math.sign(player.vsp);
			
				player.vsp = 0;
				player.grounded = true;
			} else
				player.grounded = false;
		}
		
		// Check x collision
		if(player.x + player.hsp < 0) {
			player.x = 0;
			player.hsp = 0;
		} else {
			var blockTop = blockAt(player.x + (player.hsp >= 0 ? player.mask_w : 0) + player.hsp, player.y);
			var blockMid = blockAt(player.x + (player.hsp >= 0 ? player.mask_w : 0) + player.hsp, player.y + player.mask_h / 2);
			var blockLow = blockAt(player.x + (player.hsp >= 0 ? player.mask_w : 0) + player.hsp, player.y + player.mask_h);
			
			// Move until flush against contact
			var yPos = isSolid(blockTop) ? player.y: isSolid(blockMid)? player.y + player.mask_h / 2 : isSolid(blockLow) ? player.y + player.mask_h : -1024;
			if(yPos >= 0 && player.hsp != 0) { // There is a collision
				while(!isSolid(blockAt(player.x + (player.hsp > 0 ? player.mask_w : 0) + Math.sign(player.hsp), yPos)))
					player.x += Math.sign(player.hsp);
			
				player.hsp = 0;
			}
		}
		
		if(Math.sign(player.hsp) != 0) {
			if(player.dir != Math.sign(player.hsp))
				player.dir = Math.sign(player.hsp);
			
			player.x += player.hsp;
			
			/*if(player.x + player.mask_w / 2 > 400 && player.x + player.mask_w / 2 < 64 * current_level[0].length - 400)
				ctx.translate(-player.hsp, 0);*/
		}
		
		player.y += player.vsp;
		/*if(player.y + player.mask_h / 2 > 300 && player.y + player.mask_h / 2 < 64 * current_level.length - 300)
			ctx.translate(0, -player.vsp);*/
		
		ctx.setTransform(1, 0, 0, 1, 
		 	// 400 - nearest 4 to player middle
			400 - (player.x + player.mask_w / 2),
			// Same here but with 300
			300 - (player.y + player.mask_h / 2));
		
		// Jump
		if(key[up] && jump && (player.grounded || player.canDoubleJump)) {
			if(!player.grounded)
				player.canDoubleJump = false;
			
			player.grounded = false;
			player.vsp = -player.jmp_spd;
			
			jump = false;
		}
		
		if(player.grounded)
			player.canDoubleJump = true;
		
		if(!key[up])
			jump = true;
			
		/* Enemy physics */
		// Brocollis
		for(var i = 0; i < brocollis.length; i++) {
			var hsp = 4 * brocollis[i].dir;
			
			if(isSolid(blockAt(brocollis[i].x + hsp, brocollis[i].y + 64))) {
				brocollis[i].dir = -brocollis[i].dir;
				hsp = -hsp;
			}
			
			brocollis[i].vsp += brocollis[i].gravity;
			// Check y collision
			var blockLeft = blockAt(brocollis[i].x, brocollis[i].y + 64 + brocollis[i].vsp);
			var blockMid = blockAt(brocollis[i].x + 32, brocollis[i].y + 64 + brocollis[i].vsp);
			var blockRight = blockAt(brocollis[i].x + 64, brocollis[i].y + 64 + brocollis[i].vsp);
		
			// Move until flush against contact
			var xPos = isSolid(blockLeft) ? brocollis[i].x : isSolid(blockMid) ? brocollis[i].x + 32 : isSolid(blockRight) ? brocollis[i].x + 64 : -1024;
			if(xPos >= 0 && brocollis[i].vsp != 0) { // There is a collision
				while(!isSolid(blockAt(xPos, brocollis[i].y + 64 + Math.sign(brocollis[i].vsp))))
					brocollis[i].y += Math.sign(brocollis[i].vsp);
		
				brocollis[i].vsp = 0;
			}
			
			brocollis[i].x += hsp;
			brocollis[i].y += brocollis[i].vsp;
		}
		
		break;
	}
}

var start = true;

// Updates every frame (60 fps)
function Render() {
	switch(game_state) {
	case GameState.Menu:
	case GameState.MenuToGame:// start screen
		// Make a little button
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(300, 275, 200, 50);
		ctx.font = "30px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Click to play!", 312, 310);
		break;
	
	case GameState.Game: // Actual test code
		ctx.fillStyle = "#0066CC"; // Dull blue
		ctx.fillRect(player.x - (800 - player.mask_w), player.y - (600 - player.mask_h), 1600, 1200);
		
		// Draw level map
		for(var y = 0; y < current_level.length; y++)
			for(var x = 0; x < current_level[y].length; x++)
				draw_block(current_level[y][x], x, y);
		
		// Draw player
		if(player.dir == 1) {
			if(player.grounded == false) {
				if(player.vsp <= 0) // Jumping
					spr_chunks.draw(player.x, player.y, 64, 64, 1);
				else // Falling
					spr_chunks.draw(player.x, player.y, 64, 64, 2);
			} else {
				if(Math.abs(player.hsp) > 0) { // Moving
					var walk_cycle_index = (animCounter / 8) % 4;
					spr_chunks.draw(player.x, player.y, 64, 64, 3 + walk_cycle_index);
				} else 
					spr_chunks.draw(player.x, player.y, 64, 64, 0);
			}
		} else {
			if(player.grounded == false) {
				if(player.vsp <= 0) // Jumping
					spr_chunks.draw(player.x, player.y, 64, 64, 1 + spr_chunks_num);
				else // Falling
					spr_chunks.draw(player.x, player.y, 64, 64, 2 + spr_chunks_num);
			} else {
				if(Math.abs(player.hsp) > 0) { // Moving
					var walk_cycle_index = (animCounter / 8) % 4;
					spr_chunks.draw(player.x, player.y, 64, 64, 3 + walk_cycle_index + spr_chunks_num);
				} else 
					spr_chunks.draw(player.x, player.y, 64, 64, 0 + spr_chunks_num);
			}
		}
		
		// Draw brocolli enemies
		for(var i = 0; i < brocollis.length; i++) {
			spr_brocolli[i].draw(brocollis[i].x, brocollis[i].y, 64, 64, animCounter / 8);
		}
		
		break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
}

function draw_block(block_id, x, y) {
	switch(block_id) {
	case 1: // Grass block
		spr_grass_block.draw(x * 64, y * 64, 64, 64, 0);
		break;
		
	case 2: // Dirt block
		spr_grass_block.draw(x * 64, y * 64, 64, 64, 1);
		break;
	}
}

// Key pressed event
function OnKeyDown(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = true;
			break;
		
		case 40:
			key[down] = true;
			break;
			
		case 37:
			key[left] = true;
			break;
			
		case 39:
			key[right] = true;
			break;
	}
}

// Key released event
function OnKeyUp(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = false;
			break;
		
		case 40:
			key[down] = false;
			break;
			
		case 37:
			key[left] = false;
			break;
			
		case 39:
			key[right] = false;
			break;
	}
}

// When the mouse is pressed
function OnMouseDown(event) {
	mouse_pressed = true;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

function OnMouseUp(event) {
	mouse_pressed = false;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

