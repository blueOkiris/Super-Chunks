// Updates every frame (60 fps)
function Render() {
	switch(game_state) {
	case GameState.Menu:
		if(bg_music[0].duration <= 0 || bg_music[0].paused && !player.dead)
			bg_music[0].play();
			
	case GameState.MenuToGame:// start screen
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		// Make a little button
		ctx.fillStyle = "#5522FF";
		ctx.fillRect(0, 0, 800, 600);
		ctx.fillStyle = "#FF3336";
		ctx.fillRect(280, 345, 240, 50);
		ctx.fillStyle = "#CCCCCC";
		ctx.textAlign = "center";
		ctx.font = "48px Pixeled";
		ctx.fillText("SUPER-CHUNKS", 400, 240);
		ctx.font = "18px Pixeled";
		ctx.fillText("PRESS SPACE!", 400, 380);
		break;
	
	case GameState.Game: // Actual test code
		if(bg_music[curr_lev_music].duration <= 0 || bg_music[curr_lev_music].paused && !player.dead)
			bg_music[curr_lev_music].play();
		
		// Draw background
		ctx.fillStyle = current_level_bg; // Dull blue
		ctx.fillRect(player.x - (800 - player.mask_w), player.y - (600 - player.mask_h), 1600, 1200);
		
		//bg_image.draw(0, 0, 5120, 2880, 0);
		
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
					
				case 1:
					spr_brussel_sprout.draw(enemies[i].x, enemies[i].y, 64, 64, (animCounter / 8) % 4);
					break;
					
				case 2:
					spr_spike.draw(enemies[i].x, enemies[i].y, 64, 64, 0);
					break;
			}
		}
		
		// Draw unlockable moves
		if(current_level == test_level && !player.doubleJumpUnlocked)
			spr_special_move.draw(doubleJumpScroll.x, doubleJumpScroll.y, 64, 64, 0);
		if(current_level == test_level && !player.punchUnlocked)
			spr_special_move.draw(punchScroll.x, punchScroll.y, 64, 64, 0);
		if(current_level == test_level && !player.poundUnlocked)
			spr_special_move.draw(poundScroll.x, poundScroll.y, 64, 64, 0);
		
		// Draw player
		if(player.dead) {
			spr_chunks.draw(player.x, player.y, 64, 64, 8);
		} else {
			if(!player.dead && (key[s_key] && player.poundUnlocked) && !player.grounded)
				spr_chunks.draw(player.x, player.y, 64, 64, 18);
			else if(player.dir == 1) {
				if(player.punching) {
					spr_chunks.draw(player.x, player.y, 64, 64, 7);
				} else if(!player.grounded) {
					if(player.vsp <= 0) { // Jumping
						if(!player.canDoubleJump && player.doubleJumpUnlocked)
							spr_chunks.draw(player.x, player.y, 64, 64, 9);
						else
							spr_chunks.draw(player.x, player.y, 64, 64, 1);
					} else // Falling
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
					if(player.vsp <= 0) {// Jumping
						if(!player.canDoubleJump && player.doubleJumpUnlocked)
							spr_chunks.draw(player.x, player.y, 64, 64, 9 + spr_chunks_num);
						else
							spr_chunks.draw(player.x, player.y, 64, 64, 1 + spr_chunks_num);
					} else // Falling
						spr_chunks.draw(player.x, player.y, 64, 64, 2 + spr_chunks_num);
				} else {
					if(Math.abs(player.hsp) > 0) { // Moving
						var walk_cycle_index = (animCounter / 8) % 4;
						spr_chunks.draw(player.x, player.y, 64, 64, 3 + walk_cycle_index + spr_chunks_num);
					} else 
						spr_chunks.draw(player.x, player.y, 64, 64, 0 + spr_chunks_num);
				}
			}
		}
		
		// Draw lives overlay
		spr_chunks_lives.draw(player.x + player.mask_w / 2 - 380, player.y + player.mask_h / 2 - 280, 48, 48, 0);
		ctx.textAlign = "start";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(" x " + player.lives, player.x + player.mask_w / 2 - 350, player.y + player.mask_h / 2 - 255);
		
		/*ctx.fillStyle = "#000000";
		ctx.fillRect(player.x + 4, player.y, player.mask_w, player.mask_h);*/
		
		break;	
		
	case GameState.GameOver:
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, 800, 600);
		
		ctx.textAlign = "center";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("GAME OVER", 400, 280);
		
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(280, 345, 240, 50);
		ctx.fillStyle = "#000000";
		ctx.fillRect(264, 349, 272, 42);
		ctx.fillStyle = "#CCCCCC";
		ctx.font = "18px Pixeled";
		ctx.fillText("SPACE TO RESTART!", 400, 380);
		break;
	
	case GameState.Popup:
	case GameState.Paused:
		if(bg_music.duration <= 0 || bg_music.paused && !player.dead)
			bg_music.play();
		
		// Draw background
		ctx.fillStyle = "#5522A9"; // Dull blue
		ctx.fillRect(player.x - (800 - player.mask_w), player.y - (600 - player.mask_h), 1600, 1200);
		
		//bg_image.draw(0, 0, 5120, 2880, 0);
		
		// Draw level map
		for(var y = 0; y < current_level.length; y++)
			for(var x = 0; x < current_level[y].length; x++)
				draw_block(current_level[y][x], x, y);
				
		spr_message_box.draw(player.x + player.mask_w / 2 - 312, player.y + player.mask_h / 2 - 376/2, 624, 376, 0);
		
		ctx.textAlign = "center";
		ctx.fillStyle = "#CCCCCC";
		for(var i = 0; i < game_pause_msg.length; i++) {
			switch(game_state) {
			case GameState.Paused:
				ctx.fillText(game_pause_msg[i], player.x + player.mask_w / 2, player.y + player.mask_h / 2 + i * 30 - 100);
				break;
			
			case GameState.Popup:
				ctx.fillText(game_popup_msg[i], player.x + player.mask_w / 2, player.y + player.mask_h / 2 + i * 30 - 100);
				break;
			}
		}
		break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
	if(!player.canPunch) {
		player.punchStart++;
	}
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

