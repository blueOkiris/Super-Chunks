function movementPhysics() {
	// Player physics
	let move = input[Inputs.Right] - input[Inputs.Left];
	player.hsp = player.moveSpeed * move;
	
	player.vsp += 	!player.dead && player.punching ? player.gravity / 2 :
						!player.dead && (input[Inputs.Pound] && player.poundUnlocked) ? player.gravity * 8 : 
							player.gravity;
	
	if(input[Inputs.Pound] && !player.dead) {
		if((sounds[Sounds.Pound].duration <= 0 || sounds[Sounds.Pound].paused) && !player.grounded && player.poundUnlocked)
			sounds[Sounds.Pound].play();
	}

	//console.log(player.vsp);
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
			} else if(input[Inputs.Punch] && !gameJustPunched && player.punchUnlocked && player.canPunch) { // Actually punch
				if(player.grounded || !player.airPunch) {
					if(!player.grounded)
						player.airPunch = true;
					
					player.punching = true;
					player.punchStart = 0;
					player.canPunch = false;
					
					gameJustPunched = true;
				
					sounds[Sounds.Punch].play();
				}
			}
		} else { // During the punch
			player.hsp = player.dir * player.punchSpeed;
			
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
		if(player.x + player.hsp < 0) { // Stop moving if leaving screen
			player.x = 0;
			player.hsp = 0;
		} else { // Check for blocks next to player at 3 locations: top of player, bottom of player, and middle of player
			let blockTop = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y);
			let blockMid = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y + player.maskH / 2);
			let blockLow = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y + player.maskH);

			// Move until flush against contact
			let yPos = blockList[blockTop].solid ? player.y : 
							blockList[blockMid].solid ? player.y + player.maskH / 2 : 
								blockList[blockLow].solid ? player.y + player.maskH : 
									-1024;
			if(yPos >= 0 && player.hsp != 0) { // There is a collision
				while(!blockList[blockAt(currentLevel, player.x + (player.hsp > 0 ? player.maskW : 0) + Math.sign(player.hsp), yPos)].solid)
					player.x += Math.sign(player.hsp);
			
				player.hsp = 0;
			}
		}
	} else
		player.hsp = 0;
	
	if(!player.dead) {
		// Check y collision if not dead
		if(player.y + player.vsp < 0) {
			player.y = 0;
			player.vsp = 0;
		} else {
			let blockLeft  = blockAt(currentLevel, player.x, 					player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);//, "Vsp: '" + player.vsp + "' @ ");
			let blockMid   = blockAt(currentLevel, player.x + player.maskW / 2,	player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);
			let blockRight = blockAt(currentLevel, player.x + player.maskW,		player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);
			
			// Move until flush against contact
			let xPos = blockList[blockLeft].solid ? player.x :
							blockList[blockMid].solid ? player.x + player.maskW / 2 : 
								blockList[blockRight].solid ? player.x + player.maskW : 
									-1024;
			if(xPos >= 0 && player.vsp != 0) { // There is a collision
				while(!blockList[currentLevel, blockAt(currentLevel, xPos, player.y + (player.vsp > 0 ? player.maskH : 0) + Math.sign(player.vsp))].solid)
					player.y += Math.sign(player.vsp);
			
				player.grounded = true;
				player.vsp = 0;
			} else
				player.grounded = false;
		}
	}
	
	if(Math.sign(player.hsp) != 0) {
		if(player.dir != Math.sign(player.hsp))
			player.dir = Math.sign(player.hsp);
		
		player.x += player.hsp;
	}
	
	player.y += player.vsp;
	
	// Jump
	if(!player.doubleJumpUnlocked)
		player.canDoubleJump = false;
	
	if(input[Inputs.Jump] && blockAt(currentLevel, player.x, player.y) == BlockType.Ladder) { // Climb ladder
		player.climbing = true;
		player.vsp = -player.jumpSpeed / 2;
	} else if(input[Inputs.Jump] && jump && (player.grounded || player.canDoubleJump) && !player.dead) { // Double Jump
		sounds[Sounds.Jump].pause();
		sounds[Sounds.Jump].currentTime = 0;
		
		if(!player.grounded)
			player.canDoubleJump = false;
		
		player.grounded = false;
		player.vsp = -player.jumpSpeed;
		
		jump = false;
		
		sounds[Sounds.Jump].play();
	} else if(input[Inputs.Jump] && blockAt(currentLevel, player.x, player.y) == BlockType.Door) { // Go through level end door
		// if(currentLevel == intro_level)
		// 	changeLevel(test_level, -1);
	}
	
	if(!input[Inputs.Jump] || blockAt(currentLevel, player.x, player.y) != BlockType.Ladder)
		player.climbing = false;
	
	if(player.grounded)
		player.canDoubleJump = true;
	
	if(!input[Inputs.Jump])
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


