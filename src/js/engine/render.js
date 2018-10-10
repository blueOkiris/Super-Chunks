// Updates every frame (60 fps)
function Render() {
	switch(gameState) {
		case GameState.Loading:
			splashSprite.draw(0, 0, screenWidth, screenHeight, 0);
			break;
			
		case GameState.Menu:
			if(music.songList[music.currentSong].paused)
				music.play(songList[music.currentSong]);
				
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
			if(music.songList[currentLevel.music].paused) {
				music.stop();
				music.play(currentLevel.music);
			}
			
			ctx.setTransform(1, 0, 0, 1, 
				screenWidth / 2 - (player.x + player.maskW / 2), screenHeight / 2 - (player.y + player.maskH / 2));
			
			// Draw background
			ctx.fillStyle = currentLevel.background; // Dull blue
			ctx.fillRect(
				(player.x + player.maskW / 2) - screenWidth, (player.y + player.maskH / 2) - screenHeight,
				screenWidth * 2, screenHeight * 2
			);
			
			//bg_image.draw(0, 0, 5120, 2880, 0);
			
			// Draw level map
			for(let y = 0; y < currentLevel.data.length; y++)
				for(let x = 0; x < currentLevel.data[y].length; x++)
					drawBlock(x * 64, y * 64, currentLevel.data[y][x]);

			drawPlayer();
			
			// Draw brocolli enemies
			for(let i = 0; i < currentLevel.enemies.length; i++) {
				currentLevel.enemies[i].draw(
					currentLevel.enemies[i].x, currentLevel.enemies[i].y, 
					spriteWidth, spriteHeight, 
					currentLevel.enemies[i].animSpeed(animCounter)
				);
			}

			// Draw lives overlay
			for(let i = 0; i < player.lives; i++)
				livesSprite.draw((player.x + player.maskW / 2) - screenWidth / 2 + tileWidth / 2 + 48 * i, (player.y + player.maskH / 2) - screenHeight / 2 + tileHeight / 2, 48, 48, 0);
			ctx.textAlign = "start";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(" x " + player.lives, (player.x + player.maskW / 2) - screenWidth / 2 + 48 * 4, (player.y + player.maskH / 2) - screenHeight / 2 + tileHeight * 0.9);
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
			/*if(bg_music[current_music].duration <= 0 || bg_music[current_music].paused && !player.dead)
				bg_music[current_music].play();
			
			// Draw background
			ctx.fillStyle = "#5522A9"; // Dull blue
			ctx.fillRect(player.x - (800 - player.mask_w), player.y - (600 - player.mask_h), 1600, 1200);
			
			//bg_image.draw(0, 0, 5120, 2880, 0);
			
			// Draw level map
			for(var y = 0; y < current_level.data.length; y++)
				for(var x = 0; x < current_level.data[y].length; x++)
					draw_block(current_level.data[y][x], x, y);
					
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
			}*/
			break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
	//if(!player.canPunch) {
	//	player.punchStart++;
	//}
}
