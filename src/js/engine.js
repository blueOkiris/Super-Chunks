var animCounter = 0;// Controls the updating of animations
// Keyboard stuff
var key = [false, false, false, false, false, false, false, false, false, false]; //  Up, down, left, right, space, z, w, a, s, d
var up = 0, down = 1, left = 2, right = 3, space = 4, z_key = 5, w_key = 6, a_key = 7, s_key = 8, d_key = 9;
// Mouse stuff
var mouse_x = 0, mouse_y = 0, mouse_pressed = false;

/* My Code */
var GameState = {
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
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
}

function Enemy(startx, starty, grav, identifier) {
	this.x = startx;
	this.y = starty;
	
	this.dir = -1;
	this.vsp = 0;
	this.gravity = grav;
	this.move_speed = 1;
	
	this.dead = false;
	this.start = true;
	
	this.id = identifier;
}

function UnlockDouble(xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
}

function UnlockPunch(xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
}

var player = new Player(test_level_start[0], test_level_start[1], 1, 4, 10, 0.4, 11, 48, 50);
var test_level_enemies = [new Enemy(64 * 21, 64 * 11, player.grav, 0),
							new Enemy(64 * 29, 64 * 10, player.grav, 0),
							new Enemy(64 * 13, 64 * 14, player.grav, 0),
							new Enemy(64 * 22, 64 * 11, player.grav, 0)];
	test_level_enemies[3].dir = 1;

var current_level = test_level;
var enemies = test_level_enemies;
var doubleJumpScroll = new UnlockDouble(8 * 64, 10.5 * 64);
var punchScroll = new UnlockDouble(32 * 64, 9.5 * 64);

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

// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(key[space])
			game_state = GameState.MenuToGame; // Wait for release
		break;
	
	case GameState.MenuToGame:
		if(!key[space]) {
			game_state = GameState.Game;
			// Play music in the background
			//bg_music.play();
		}
		break;
	
	case GameState.Game: // play the game
		// Player physics
		var move = key[d_key] - key[a_key];
		player.hsp = player.mv_spd * move;
		
		player.vsp += player.punching ? player.grav / 2 : player.grav;
		
		/* Punching physics */
		if(player.punching && ((animCounter - player.punchStart) % 20 == 0)) {
			player.punching = false;
		} else if(!player.punching) {
			if(key[space] && !player.punched && player.punchUnlocked) {
				player.punching = true;
				player.punchStart = animCounter;
				player.punched = true;
			}
		} else
			player.hsp = player.dir * player.pnc_spd;
		
		if(player.punched)
			if(!key[space] && player.grounded)
				player.punched = false;
		
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
			
				if(player. vsp >= 0)
					player.grounded = true;
				
				player.vsp = 0;
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
		
		/* Unlockable check */
		// Check if double jump is unlocked
		if(!player.doubleJumpUnlocked
		&& player.x + player.mask_w / 2 > doubleJumpScroll.x && player.x + player.mask_w / 2 < doubleJumpScroll.x + 64
		&& player.y + player.mask_h / 2 > doubleJumpScroll.y && player.y + player.mask_h / 2 < doubleJumpScroll.y + 64) {
			player.doubleJumpUnlocked = true;
			
			alert("Congratulations!\nYou have now learned how to air jump!\nPress <W> once while in the air to gain a boost of height");
			player.hsp = 0;
			player.vsp = 0;
			
			for(var i = 0; i < key.length; i++)
				key[i] = false;
		}
		
		// Check if punch is unlocked
		if(!player.punchUnlocked
		&& player.x + player.mask_w / 2 > punchScroll.x && player.x + player.mask_w / 2 < punchScroll.x + 64
		&& player.y + player.mask_h / 2 > punchScroll.y && player.y + player.mask_h / 2 < punchScroll.y + 64) {
			player.punchUnlocked = true;
			
			alert("Congratulations!\nYou have now learned how to punch!\nPress <SPACE> and you will fly towards and hit foes");
			player.hsp = 0;
			player.vsp = 0;
			
			for(var i = 0; i < key.length; i++)
				key[i] = false;
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
		if(!player.doubleJumpUnlocked)
			player.canDoubleJump = false;
		
		if(key[w_key] && jump && (player.grounded || player.canDoubleJump)) {
			if(!player.grounded)
				player.canDoubleJump = false;
			
			player.grounded = false;
			player.vsp = -player.jmp_spd;
			
			jump = false;
		}
		
		if(player.grounded)
			player.canDoubleJump = true;
		
		if(!key[w_key])
			jump = true;
			
		/* Enemy physics */
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].id == 0) {
				if(enemies[i].dead)
					continue;
				
				var hsp = enemies[i].move_speed * enemies[i].dir;
						
				if(isSolid(blockAt(enemies[i].x + hsp, enemies[i].y + 32))
				|| isSolid(blockAt(enemies[i].x + 64 + hsp, enemies[i].y + 32))) {
					enemies[i].dir = -enemies[i].dir;
					hsp = -hsp;
				}
			
				enemies[i].vsp += enemies[i].gravity;
				// Check y collision
				var blockLeft = blockAt(enemies[i].x, enemies[i].y + 64 + enemies[i].vsp);
				var blockMid = blockAt(enemies[i].x + 32, enemies[i].y + 64 + enemies[i].vsp);
				var blockRight = blockAt(enemies[i].x + 64, enemies[i].y + 64 + enemies[i].vsp);
		
				// Move until flush against contact
				var xPos = isSolid(blockLeft) ? enemies[i].x : isSolid(blockMid) ? enemies[i].x + 32 : isSolid(blockRight) ? enemies[i].x + 64 : -1024;
				if(xPos >= 0 && enemies[i].vsp != 0) { // There is a collision
					while(!isSolid(blockAt(xPos, enemies[i].y + 64 + Math.sign(enemies[i].vsp))))
						enemies[i].y += Math.sign(enemies[i].vsp);
		
					enemies[i].vsp = 0;
				}
			
				// Only move if player can see it
				if(enemies[i].start) {
					if(enemies[i].x > player.x + player.mask_w / 2 + 400
					|| enemies[i].x + 64 < player.x + player.mask_w / 2 - 400
					|| enemies[i].y > player.y + player.mask_h / 2 + 300
					|| enemies[i].y + 64 < player.y + player.mask_h / 2 - 300) {
						hsp = 0;
						enemies[i].vsp = 0;
					} else
						enemies[i].start = false;
				}
			
				enemies[i].x += hsp;
				enemies[i].y += enemies[i].vsp;
			}
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
		ctx.fillStyle = "#0066CC";
		ctx.fillRect(0, 0, 800, 600);
		ctx.fillStyle = "#CC6600";
		ctx.fillRect(280, 275, 240, 50);
		ctx.font = "30px Arial";
		ctx.fillStyle = "#CCCCCC";
		ctx.fillText("Press <SPACE>!", 285, 310);
		break;
	
	case GameState.Game: // Actual test code
		// Draw background
		ctx.fillStyle = "#0066CC"; // Dull blue
		ctx.fillRect(player.x - (800 - player.mask_w), player.y - (600 - player.mask_h), 1600, 1200);
		
		// Draw level map
		for(var y = 0; y < current_level.length; y++)
			for(var x = 0; x < current_level[y].length; x++)
				draw_block(current_level[y][x], x, y);
		
		// Draw brocolli enemies
		for(var i = 0; i < enemies.length; i++) {
			if(enemies[i].dead)
				continue;
			
			switch(enemies[i].id) {
				case 0:
					spr_brocolli.draw(enemies[i].x, enemies[i].y, 64, 64, animCounter / 8);
					break;
			}
		}
		
		// Draw unlockable moves
		if(current_level == test_level && !player.doubleJumpUnlocked)
			spr_special_move.draw(doubleJumpScroll.x, doubleJumpScroll.y, 64, 64, 0);
		if(current_level == test_level && !player.punchUnlocked)
			spr_special_move.draw(punchScroll.x, punchScroll.y, 64, 64, 0);
		
		// Draw player
		if(player.dir == 1) {
			if(player.punching) {
				spr_chunks.draw(player.x, player.y, 64, 64, 7);
			} else if(!player.grounded) {
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
			if(player.punching) {
				spr_chunks.draw(player.x, player.y, 64, 64, 7 + spr_chunks_num);
			} else if(!player.grounded) {
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
		
	case 3: // stone block
		spr_stone_block.draw(x * 64, y * 64, 64, 64, 0);
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
		
		case 32:
			key[space] = true;
			break;
			
		case 90:
			key[z_key] = true;
			break;
		
		case 87:
			key[w_key] = true;
			break;
		
		case 65:
			key[a_key] = true;
			break;
			
		case 83:
			key[s_key] = true;
			break;
			
		case 68:
			key[d_key] = true;
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
		
		case 32:
			key[space] = false;
			break;
		
		case 90:
			key[z_key] = false;
			break;
		
		case 87:
			key[w_key] = false;
			break;
		
		case 65:
			key[a_key] = false;
			break;
			
		case 83:
			key[s_key] = false;
			break;
			
		case 68:
			key[d_key] = false;
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

