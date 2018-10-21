function movementPhysics() {
	// Player physics
	let move = input[Inputs.Right] - input[Inputs.Left];
	player.hsp = player.moveSpeed * move;
	
	player.vsp += 	!player.dead && player.punching ? player.gravity / 2 :
						!player.dead && (input[Inputs.Pound] && player.poundUnlocked) ? player.gravity * 8 : 
							(blockList[blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2)].id
							  == BlockType.Water ? player.gravity / 8 : player.gravity);
	
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
		} else if(player.x + spriteWidth + player.hsp > currentLevel.data[0].length * 64) {
			player.hsp = 0;
			player.x = (currentLevel.data[0].length * 64) - spriteWidth;	
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
			let block_left  = blockAt(currentLevel, player.x, 						player.y + (player.vsp > 0 ? player.maskH : 0) + player.vsp);//, "Vsp: '" + player.vsp + "' @ ");
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
			
				if(player.vsp >= 0) // If falling (not jumping)
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
	
	if(input[Inputs.Jump] && blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2) == BlockType.Ladder) { // Climb ladder
		player.climbing = true;
		player.vsp = -player.jumpSpeed / 2;

		jump = false;
		player.grounded = true;
	} else if(input[Inputs.Jump] && jump && (player.grounded || player.canDoubleJump || blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2) == BlockType.Water) && !player.dead) { // Double Jump
		sounds[Sounds.Jump].pause();
		sounds[Sounds.Jump].currentTime = 0;
		
		if(!player.grounded)
			player.canDoubleJump = false;
		
		player.grounded = false;
		player.vsp =
			blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2)
				== BlockType.Water ? -player.jumpSpeed / 4 : -player.jumpSpeed;
		
		jump = false;
		
		sounds[Sounds.Jump].play();
	} else if(input[Inputs.Jump] && blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2) == BlockType.Door) { // Go through level end door
		gameState = GameState.ChangeLevel;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, screenWidth, screenHeight);

		setTimeout(
			() => { 
				nextLevel();
			},
		500);
	}
	
	if(!input[Inputs.Jump] || blockAt(currentLevel, player.x + player.maskW / 2, player.y + player.maskH / 2) != BlockType.Ladder)
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
		let current_enemy = currentLevel.enemies[i];
			
		if(currentLevel.enemies[i].id != EnemyType.Spike) {
			// Check to see if there is a block in direction of motion that is stopping the enemy
			let left_block = blockAt(currentLevel, current_enemy.x + hsp, current_enemy.y + spriteHeight / 2);
			let right_block = blockAt(currentLevel, current_enemy.x + spriteWidth + hsp, current_enemy.y + spriteHeight / 2);

			if(left_block == null || right_block == null) {
				current_enemy.dir = -current_enemy.dir;
				hsp = -hsp;
			} else if(current_enemy.x + hsp < 0 || current_enemy.x + spriteWidth + hsp > currentLevel.data[0].length * 64
				|| blockList[left_block].solid || blockList[right_block].solid) {
				// Flip directions
				current_enemy.dir = -current_enemy.dir;
				hsp = -hsp;
			}
		
			// fall
			current_enemy.vsp += current_enemy.gravity;

			if(current_enemy.y + current_enemy.vsp < 0) {
				current_enemy.y = 0;
				current_enemy.vsp = 0;
			} else {
				let block_left  = blockAt(currentLevel, current_enemy.x, 
											current_enemy.y + (current_enemy.vsp > 0 ? spriteHeight : 0) + current_enemy.vsp);
				let block_mid   = blockAt(currentLevel, current_enemy.x + spriteWidth / 2,	
											current_enemy.y + (current_enemy.vsp > 0 ? spriteHeight : 0) + current_enemy.vsp);
				let block_right = blockAt(currentLevel, current_enemy.x + spriteWidth,
											current_enemy.y + (current_enemy.vsp > 0 ? spriteHeight : 0) + current_enemy.vsp);
				
				// Move until flush against contact
				let x_pos = blockList[block_left].solid ? current_enemy.x :
								blockList[block_mid].solid ? current_enemy.x + spriteWidth / 2 : 
									blockList[block_right].solid ? current_enemy.x + spriteWidth : 
										-1024;
				if(x_pos >= 0 && current_enemy.vsp != 0) { // There is a collision
					while(!blockList[currentLevel, blockAt(currentLevel, x_pos, current_enemy.y + (current_enemy.vsp > 0 ? spriteHeight : 0) + Math.sign(current_enemy.vsp))].solid)
						current_enemy.y += Math.sign(current_enemy.vsp);
				
					if(current_enemy.id == EnemyType.BrusselSprout && current_enemy.vsp >= 0) // jump if a brussel sprout hits the ground
						current_enemy.vsp = -player.jumpSpeed;
					else
						current_enemy.vsp = 0;
				}
			}
		
			// Only move if player has seen it
			if(current_enemy.start) {
				/* Get location of view window */
				let context_x = (player.x + player.maskW / 2) - (screenWidth / 2);
				let context_y = (player.y + player.maskH / 2) - (screenHeight / 2);
				// Adjust for going past level data
				if(context_x < 0)
					context_x = 0;
				if(context_y < 0)
					context_y = 0;
				if(context_x + screenWidth > currentLevel.data[0].length * tileWidth)
					context_x = currentLevel.data[0].length * tileWidth - screenWidth;
				if(context_y + screenHeight > currentLevel.data.length * tileHeight)
					context_y = currentLevel.data.length * tileHeight - screenHeight;
				
				let context_rect = new Rect(context_x - spriteWidth, context_y - spriteHeight, screenWidth + spriteWidth * 2, screenHeight + spriteHeight * 2);
				if(!context_rect.containsPoint(current_enemy.x, current_enemy.y)) {
					hsp = 0;
					current_enemy.vsp = 0;
				} else
					current_enemy.start = false;
			}
			
			if(current_enemy.id == EnemyType.Spike) // Don't let the spikes move
				hsp = 0;
			
			current_enemy.x += hsp;
			current_enemy.y += current_enemy.vsp;
		}
		
		/* Enemy collisions */
		if(!player.dead) {
			let enemy_box = new Rect(
				current_enemy.x + (spriteWidth - enemyMaskW) / 2, current_enemy.y + (spriteHeight - enemyMaskH) / 2, 
				enemyMaskW, enemyMaskH);
			let player_box = new Rect(player.x, player.y, player.maskW, player.maskH);

			if (enemy_box.overlaps(player_box)) {
				if(current_enemy.id != EnemyType.Spike &&
					(player.punching || (input[Inputs.Pound] && player.poundUnlocked))) {
					current_enemy.dead = true;
				
					player.vsp = -player.jumpSpeed / 2;
					sounds[Sounds.Jump].play();
				} else {
					sounds[Sounds.Death].play();
					
					player.vsp = -player.jumpSpeed * 1.5;
					player.dead = true;
					music.stop();
					
					setTimeout(() => {
						for(let j = 0; j < currentLevel.enemies.length; j++)
							currentLevel.enemies[j].restart();
						player.restart();
						currentLevel.restart();
							
						player.lives--;
	
						if(player.lives < 0) {
							gameJustPunched = true;
							gameState = GameState.GameOver;
							music.stop();

							player.poundUnlocked = false;
							player.doubleJumpUnlocked = false;
							player.punchUnlocked = false;
							player.lives = startLives;
							player.restart();

							for(let j = 0; j < numWorlds; j++) {
								for(let k = 0; k < worlds[j].levels.length; k++)
									worlds[j].levels[k].restart();
							}
						}
					}, 1000);
				}
			}
		} 
	}
}

function checkUnlocked() {
	for(let i = 0; i < currentLevel.unlockables.length; i++) {
		let current_unlock = currentLevel.unlockables[i];

		if(current_unlock.collected)
			continue;
		
		if(!player.dead) {
			let unlock_box = new Rect(current_unlock.x, current_unlock.y, spriteWidth, spriteHeight);
			let player_box = new Rect(player.x, player.y, player.maskW, player.maskH);

			if (unlock_box.overlaps(player_box)) {
				current_unlock.unlock();
				current_unlock.collected = true;
				gameUnlockedMessage = current_unlock.message;
				gameState = GameState.Popup;
			}
		}
	}
}

