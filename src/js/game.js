function movementPhysics() {
	// Player physics
	var move = key[d_key] - key[a_key];
	player.hsp = player.mv_spd * move;
	
	player.vsp += !player.dead && player.punching ? player.grav / 2 : !player.dead && (key[s_key] && player.poundUnlocked) ? player.grav * 8 : player.grav;
	if(key[s_key] && !player.dead) {
		if(pound_sound.duration <= 0 || pound_sound.paused && !player.grounded && player.poundUnlocked)
			pound_sound.play();
	}
	
	if(!player.dead) {
		// Check y collision if not dead
		if(player.y + player.vsp < 0) {
			player.y = 0;
			player.vsp = 0;
		} else {
			var blockLeft = blockAt(player.x + 4, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			var blockMid = blockAt(player.x + player.mask_w / 2, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			var blockRight = blockAt(player.x + player.mask_w - 4, player.y + (player.vsp > 0 ? player.mask_h : 0) + player.vsp);
			
			// Move until flush against contact
			var xPos = isSolid(blockLeft) ? player.x + 4 : isSolid(blockMid) ? player.x + player.mask_w / 2 : isSolid(blockRight) ? player.x + player.mask_w - 4: -1024;
			if(xPos >= 0 && player.vsp != 0) { // There is a collision
				while(!isSolid(blockAt(xPos, player.y + (player.vsp > 0 ? player.mask_h : 0) + Math.sign(player.vsp))))
					player.y += Math.sign(player.vsp);
			
				if(player. vsp >= 0)
					player.grounded = true;
				
				player.vsp = 0;
			} else
				player.grounded = false;
		}
	}
}

function punchingPhysics() {
	/*console.log("Space: " + key[space] + ", Unlock: " + player.punchUnlocked + 
	", Can Punch: " + player.canPunch + ", Punching: " + player.punching + ", Air: " + player.airPunch);*/
	
	if(!player.dead) {
		/* Punching physics */
		if(player.punching && player.punchStart > 20) { // Finished punching
			player.punching = false;
		} else if(!player.punching) {
			if(!player.canPunch && player.punchStart > 22) { // Allow for next punch (spam preventer)
				player.canPunch = true;
				player.punchStart = 0;
			} else if(key[space] && space_released && player.punchUnlocked && player.canPunch) { // Actually punch
				if(player.grounded || !player.airPunch) {
					if(!player.grounded)
						player.airPunch = true;
					
					player.punching = true;
					player.punchStart = 0;
					player.canPunch = false;
					
					space_released = false;
				
					punch_sound.play();
				}
			}
		} else { // During the punch
			player.hsp = player.dir * player.pnc_spd;
			
			if(player.punchStart > 10)
				player.hsp = 0;
		}
		
		if(player.airPunch && player.grounded)
			player.airPunch = false;
	}
}

function collisionChecks() {
	if(!player.dead) {
		// Check x collision
		if(player.x + player.hsp < 0) {
			player.x = 0;
			player.hsp = 0;
		} else {
			var blockTop = blockAt(player.x + (player.hsp >= 0 ? player.mask_w - 4 : 4) + player.hsp, player.y);
			var blockMid = blockAt(player.x + (player.hsp >= 0 ? player.mask_w - 4 : 4) + player.hsp, player.y + player.mask_h / 2);
			var blockLow = blockAt(player.x + (player.hsp >= 0 ? player.mask_w - 4 : 4) + player.hsp, player.y + player.mask_h);
			
			// Move until flush against contact
			var yPos = isSolid(blockTop) ? player.y: isSolid(blockMid)? player.y + player.mask_h / 2 : isSolid(blockLow) ? player.y + player.mask_h : -1024;
			if(yPos >= 0 && player.hsp != 0) { // There is a collision
				while(!isSolid(blockAt(player.x + (player.hsp > 0 ? player.mask_w - 4 : 4) + Math.sign(player.hsp), yPos)))
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
			
			game_state = GameState.Popup;
			game_popup_msg[0] = "";
			game_popup_msg[1] = "CONGRATULATIONS!";
			game_popup_msg[2] = "YOU HAVE LEARNED HOW TO AIR JUMP!";
			game_popup_msg[3] = "PRESS W IN THE AIR TO";
			game_popup_msg[4] = "GAIN A BOOST IN HEIGHT!";
			game_popup_msg[5] = "";
		}
		
		// Check if punch is unlocked
		if(!player.punchUnlocked
		&& player.x + player.mask_w / 2 > punchScroll.x && player.x + player.mask_w / 2 < punchScroll.x + 64
		&& player.y + player.mask_h / 2 > punchScroll.y && player.y + player.mask_h / 2 < punchScroll.y + 64) {
			player.punchUnlocked = true;
			
			game_state = GameState.Popup;
			game_popup_msg[0] = "CONGRATULATIONS!";
			game_popup_msg[1] = "YOU HAVE LEARNED TO PUNCH!";
			game_popup_msg[2] = "PRESS SPACE AND YOU WILL";
			game_popup_msg[3] = "FLY TOWARDS ENEMIES,";
			game_popup_msg[4] = "BUT BE WARY BECAUSE YOU CAN";
			game_popup_msg[5] = "ONLY PUNCH ONCE IN MID-AIR!";
		}
		
		// Check if pound is unlocked
		if(!player.poundUnlocked
		&& player.x + player.mask_w / 2 > poundScroll.x && player.x + player.mask_w / 2 < poundScroll.x + 64
		&& player.y + player.mask_h / 2 > poundScroll.y && player.y + player.mask_h / 2 < poundScroll.y + 64) {
			player.poundUnlocked = true;
			
			game_state = GameState.Popup;
			game_popup_msg[0] = "CONGRATULATIONS!";
			game_popup_msg[1] = "YOU HAVE LEARNED HOW TO!";
			game_popup_msg[2] = "GROUND POUND!";
			game_popup_msg[3] = "PRESS S AND YOU WILL STOMP";
			game_popup_msg[4] = "DOWN TOWARDS THE GROUND!";
			game_popup_msg[5] = "";
		}
	} else
		player.hsp = 0;
	
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
	
	if(key[w_key] && blockAt(player.x, player.y) == 5) { // Climb ladder
		player.climbing = true;
		player.vsp = -player.jmp_spd / 2;
	} else if(key[w_key] && jump && (player.grounded || player.canDoubleJump) && !player.dead) {
		jump_sound.pause();
		jump_sound.current_time = 0;
		
		if(!player.grounded)
			player.canDoubleJump = false;
		
		player.grounded = false;
		player.vsp = -player.jmp_spd;
		
		jump = false;
		
		jump_sound.play();
	} else if(key[w_key] && blockAt(player.x, player.y) == 4) { // Go through level end door
		if(current_level == intro_level)
			changeLevel(test_level, -1);
	}
	
	if(!key[w_key] || blockAt(player.x, player.y) != 5)
		player.climbing = false;
	
	if(player.grounded)
		player.canDoubleJump = true;
	
	if(!key[w_key])
		jump = true;
}

function enemyCollisions() {
	/* Enemy physics */
	for(var i = 0; i < current_level.enemies.length; i++) {
		if(current_level.enemies[i].dead)
			continue;
		
		var hsp = current_level.enemies[i].move_speed * current_level.enemies[i].dir;
				
		if(isSolid(blockAt(current_level.enemies[i].x + hsp, current_level.enemies[i].y + 32))
		|| isSolid(blockAt(current_level.enemies[i].x + 64 + hsp, current_level.enemies[i].y + 32))) {
			current_level.enemies[i].dir = -current_level.enemies[i].dir;
			hsp = -hsp;
		}
	
		current_level.enemies[i].vsp += current_level.enemies[i].gravity;
		// Check y collision
		var blockLeft = blockAt(current_level.enemies[i].x, current_level.enemies[i].y + 64 + current_level.enemies[i].vsp);
		var blockMid = blockAt(current_level.enemies[i].x + 32, current_level.enemies[i].y + 64 + current_level.enemies[i].vsp);
		var blockRight = blockAt(current_level.enemies[i].x + 64, current_level.enemies[i].y + 64 + current_level.enemies[i].vsp);
	
		// Move until flush against contact
		var xPos = isSolid(blockLeft) ? current_level.enemies[i].x : isSolid(blockMid) ? current_level.enemies[i].x + 32 : isSolid(blockRight) ? current_level.enemies[i].x + 64 : -1024;
		if(xPos >= 0 && current_level.enemies[i].vsp != 0) { // There is a collision
			while(!isSolid(blockAt(xPos, current_level.enemies[i].y + 64 + Math.sign(current_level.enemies[i].vsp))))
				current_level.enemies[i].y += Math.sign(current_level.enemies[i].vsp);
				
			if(current_level.enemies[i].vsp >= 0 && current_level.enemies[i].id == 1) // jump if a brussel sprout hits the ground
				current_level.enemies[i].vsp = -player.jmp_spd;
			else
				current_level.enemies[i].vsp = 0;
		}
	
		// Only move if player can see it
		if(current_level.enemies[i].start) {
			if(current_level.enemies[i].x > player.x + player.mask_w / 2 + 400
			|| current_level.enemies[i].x + 64 < player.x + player.mask_w / 2 - 400
			|| current_level.enemies[i].y > player.y + player.mask_h / 2 + 300
			|| current_level.enemies[i].y + 64 < player.y + player.mask_h / 2 - 300) {
				hsp = 0;
				current_level.enemies[i].vsp = 0;
			} else
				current_level.enemies[i].start = false;
		}
		
		if(current_level.enemies[i].id == 2) // Don't let the spikes move
			hsp = 0;
		
		current_level.enemies[i].x += hsp;
		current_level.enemies[i].y += current_level.enemies[i].vsp;
		
		/* Enemy collisions */
		if(!player.dead) {
			if (current_level.enemies[i].x < player.x + player.mask_w + 4
			 && current_level.enemies[i].x + 64 > player.x + 4
			 && current_level.enemies[i].y < player.y + player.mask_h
			 && 64 + current_level.enemies[i].y > player.y) {
				if(player.punching || (key[s_key] && player.poundUnlocked)) {
					current_level.enemies[i].dead = true;
				
					player.vsp = -player.jmp_spd / 2;
					jump_sound.play();
				} else {
					death_sound.play();
					
					player.vsp = -player.jmp_spd * 1.5;
					player.dead = true;
					bg_music[current_music].currentTime = 0;
					bg_music[current_music].pause();
					
					setTimeout(function() {
						for(var j = 0; j < current_level.enemies.length; j++)
							current_level.enemies[j].restart();
						player.restart();
						player.setUnlock(current_unlock);
							
						player.lives--;
	
						if(player.lives < 0) {
							space_released = false;
							current_music = 0;
							game_state = GameState.GameOver;
						}
					}, 1000);
				}
			}
		}
	}
}


