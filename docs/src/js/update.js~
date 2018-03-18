// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(key[space])
			game_state = GameState.MenuToGame; // Wait for release
		break;
	
	case GameState.MenuToGame:
		if(!key[space]) {
			player = new Player(test_level_start[0], test_level_start[1], 1, 4, 10, 0.4, 11, 46, 50, 0);
			current_level = test_level;
			enemies = test_level_enemies;
			current_level_bg = test_level_bg;
			
			death_sound.play();
			bg_music.play();
			game_state = GameState.Game;
		}
		break;
	
	case GameState.Game: // play the game
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
		
		/*console.log("Space: " + key[space] + ", Unlock: " + player.punchUnlocked + 
		", Can Punch: " + player.canPunch + ", Punching: " + player.punching + ", Air: " + player.airPunch);*/
		
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
		
		if(key[w_key] && jump && (player.grounded || player.canDoubleJump) && !player.dead) {
			jump_sound.pause();
			jump_sound.current_time = 0;
			
			if(!player.grounded)
				player.canDoubleJump = false;
			
			player.grounded = false;
			player.vsp = -player.jmp_spd;
			
			jump = false;
			
			jump_sound.play();
		}
		
		if(player.grounded)
			player.canDoubleJump = true;
		
		if(!key[w_key])
			jump = true;
			
		/* Enemy physics */
		for(var i = 0; i < enemies.length; i++) {
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
					
				if(enemies[i].vsp >= 0 && enemies[i].id == 1) // jump if a brussel sprout hits the ground
					enemies[i].vsp = -player.jmp_spd;
				else
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
			
			/* Enemy collisions */
			if(!player.dead) {
				if (enemies[i].x < player.x + player.mask_w + 4
				 && enemies[i].x + 64 > player.x + 4
				 && enemies[i].y < player.y + player.mask_h
				 && 64 + enemies[i].y > player.y) {
					if(player.punching || (key[s_key] && player.poundUnlocked)) {
						enemies[i].dead = true;
					
						player.vsp = -player.jmp_spd / 2;
						jump_sound.play();
					} else {
						player.vsp = -player.jmp_spd * 1.5;
						player.dead = true;
						bg_music.currentTime = 0;
						bg_music.pause();
						death_sound.play();
						
						setTimeout(function() {
							for(var j = 0; j < enemies.length; j++)
								enemies[j].restart();
							player.restart();
							if(current_level == test_level) {
								player.doubleJumpUnlocked = false;
								player.punchUnlocked = false;
								player.poundUnlocked = false;
								
								player.lives--;
		
								if(player.lives < 0) {
									space_released = false;
									game_state = GameState.GameOver;
								}
							}
						}, 1000);
					}
				}
			}
		}
			
		if(key[esc] && game_canpause && !player.dead) {
			game_canpause = false;
			game_state = GameState.Paused;
			game_pause_msg[1] = "";
			game_pause_msg[2] = "";
			game_pause_msg[3] = "PAUSED";
			game_pause_msg[4] = "";
			game_pause_msg[5] = "";
		}
		
		break;
		
	case GameState.GameOver:
		if(space_released)
			game_state = GameState.Menu; // Wait for release
		break;
	
	case GameState.Paused:
		if(key[esc] && game_canpause) {
			game_canpause = false;
			game_state = GameState.Game;
		}
		break;
	
	case GameState.Popup:
		if(key[enter] && game_popup) {
			game_popup = false;
			game_state = GameState.Game;
		}
		break;
	}
}
