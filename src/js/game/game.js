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
			let block_top = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y);
			let block_mid = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y + player.maskH / 2);
			let block_low = blockAt(currentLevel, player.x + (player.hsp >= 0 ? player.maskW : 0) + player.hsp, player.y + player.maskH);

			// Move until flush against contact
			let y_pos = blockList[block_top].solid ? player.y : 
							blockList[block_mid].solid ? player.y + player.maskH / 2 : 
								blockList[block_low].solid ? player.y + player.maskH : 
									-1024;
			if(y_pos >= 0 && player.hsp != 0) { // There is a collision
				while(!blockList[blockAt(currentLevel, player.x + (player.hsp > 0 ? player.maskW : 0) + Math.sign(player.hsp), y_pos)].solid)
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
			let block_left  = blockAt(currentLevel, player.x, 					player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);//, "Vsp: '" + player.vsp + "' @ ");
			let block_mid   = blockAt(currentLevel, player.x + player.maskW / 2,	player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);
			let block_right = blockAt(currentLevel, player.x + player.maskW,		player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);
			
			// Move until flush against contact
			let x_pos = blockList[block_left].solid ? player.x :
							blockList[block_mid].solid ? player.x + player.maskW / 2 : 
								blockList[block_right].solid ? player.x + player.maskW : 
									-1024;
			if(x_pos >= 0 && player.vsp != 0) { // There is a collision
				while(!blockList[currentLevel, blockAt(currentLevel, x_pos, player.y + (player.vsp > 0 ? player.maskH : 0) + Math.sign(player.vsp))].solid)
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

		jump = false;
		player.grounded = true;
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
		if(currentLevel.nextLevel != null) {
			changeLevel(currentLevel.nextLevel);
		}
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
	for(let i = 0; i < currentLevel.enemies.length; i++) {
		// Only draw if not dead
		if(currentLevel.enemies[i].dead)
			continue;
		
		// Start by trying to move towards enemy dir
		let hsp = currentLevel.enemies[i].moveSpeed * currentLevel.enemies[i].dir;
		let currentEnemy = currentLevel.enemies[i];
			
		// Check to see if there is a block in direction of motion that is stopping the enemy
		let left_block = blockAt(currentLevel, currentEnemy.x + hsp, currentEnemy.y + spriteHeight / 2);
		let right_block = blockAt(currentLevel, currentEnemy.x + spriteWidth + hsp, currentEnemy.y + spriteHeight / 2);

		if(blockList[left_block].solid || blockList[right_block].solid) {
			// Flip directions
			currentEnemy.dir = -currentEnemy.dir;
			hsp = -hsp;
		}
	
		// fall
		currentEnemy.vsp += currentEnemy.gravity;

		if(currentEnemy.y + currentEnemy.vsp < 0) {
			currentEnemy.y = 0;
			currentEnemy.vsp = 0;
		} else {
			let block_left  = blockAt(currentLevel, currentEnemy.x, 
										currentEnemy.y + (currentEnemy.vsp > 0 ? spriteHeight : 0) + currentEnemy.vsp);
			let block_mid   = blockAt(currentLevel, currentEnemy.x + spriteWidth / 2,	
										currentEnemy.y + (currentEnemy.vsp > 0 ? spriteHeight : 0) + currentEnemy.vsp);
			let block_right = blockAt(currentLevel, currentEnemy.x + spriteWidth,
										currentEnemy.y + (currentEnemy.vsp > 0 ? spriteHeight : 0) + currentEnemy.vsp);
			
			// Move until flush against contact
			let x_pos = blockList[block_left].solid ? currentEnemy.x :
							blockList[block_mid].solid ? currentEnemy.x + spriteWidth / 2 : 
								blockList[block_right].solid ? currentEnemy.x + spriteWidth : 
									-1024;
			if(x_pos >= 0 && currentEnemy.vsp != 0) { // There is a collision
				while(!blockList[currentLevel, blockAt(currentLevel, x_pos, currentEnemy.y + (currentEnemy.vsp > 0 ? spriteHeight : 0) + Math.sign(currentEnemy.vsp))].solid)
					currentEnemy.y += Math.sign(currentEnemy.vsp);
			
				if(currentEnemy.id == EnemyType.BrusselSprout) // jump if a brussel sprout hits the ground
					currentEnemy.vsp = -player.jumpSpeed;
				else
					currentEnemy.vsp = 0;
			}
		}
	
		// Only move if player has seen it
		if(currentEnemy.start) {
			if(!(new Rect(player.x + player.maskW / 2 - screenWidth / 2, player.y + player.maskH / 2 - screenHeight / 2, screenWidth, screenHeight)).containsPoint(
				currentEnemy.x, currentEnemy.y)) {
				hsp = 0;
				currentEnemy.vsp = 0;
			} else
				currentEnemy.start = false;
		}
		
		if(currentEnemy.id == 2) // Don't let the spikes move
			hsp = 0;
		
		currentEnemy.x += hsp;
		currentEnemy.y += currentEnemy.vsp;
		
		/* Enemy collisions */
		if(!player.dead) {
			let enemy_box = new Rect(
				currentEnemy.x + (spriteWidth - enemyMaskW) / 2, currentEnemy.y + (spriteHeight - enemyMaskH) / 2, 
				enemyMaskW, enemyMaskH);
			let player_box = new Rect(player.x, player.y, player.maskW, player.maskH);

			if (enemy_box.overlaps(player_box)) {
				if(currentEnemy.id != EnemyType.Spike &&
					(player.punching || (input[Inputs.Pound] && player.poundUnlocked))) {
					currentEnemy.dead = true;
				
					player.vsp = -player.jumpSpeed / 2;
					sounds[Sounds.Jump].play();
				} else {
					sounds[Sounds.Death].play();
					
					player.vsp = -player.jumpSpeed * 1.5;
					player.dead = true;
					music.stop();
					
					setTimeout(function() {
						for(let j = 0; j < currentLevel.enemies.length; j++)
							currentLevel.enemies[j].restart();
						player.restart();
							
						player.lives--;
	
						if(player.lives < 0) {
							gameJustPunched = true;
							gameState = GameState.GameOver;
						}
					}, 1000);
				}
			}
		} 
	}
}


