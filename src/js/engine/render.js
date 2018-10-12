// Updates every frame (60 fps)
function Render() {
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
	
	switch(gameState) {
		case GameState.Loading:
			ctx.fillStyle = "#7B7318"
			ctx.fillRect(0, 0, screenWidth, screenHeight);
			splashSprite.draw((screenWidth - 800) / 2, (screenHeight - 600) / 2, 800, 600, 0);
			break;
		
		case GameState.ChangeLevel:
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, screenWidth, screenHeight);
			break;

		case GameState.Menu:
			if(music.songList[music.currentSong].paused)
				music.play(music.currentSong);
				
		case GameState.MenuToGame:// start screen
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			// Make a little button
			ctx.fillStyle = "#5522FF";
			ctx.fillRect(0, 0, screenWidth, screenHeight);
			ctx.fillStyle = "#FF3336";
			ctx.fillRect(screenWidth / 2 - 120, screenHeight / 2 + 40, 240, 50);
			ctx.fillStyle = "#CCCCCC";
			ctx.textAlign = "center";
			ctx.font = "48px Pixeled";
			ctx.fillText("SUPER-CHUNKS", screenWidth / 2, screenHeight / 2 - 80);
			ctx.font = "18px Pixeled";
			ctx.fillText("PRESS SPACE!", screenWidth / 2, screenHeight / 2 + 80);
			break;
		
		case GameState.Game: // Actual test code
			if(music.songList[currentLevel.music].paused) {
				music.stop();
				music.play(currentLevel.music);
			}
			
			// Adjust screen
			ctx.setTransform(1, 0, 0, 1, -context_x, -context_y);

			// Draw background
			ctx.fillStyle = currentLevel.background; // Dull blue
			ctx.fillRect(
				(player.x + player.maskW / 2) - screenWidth, (player.y + player.maskH / 2) - screenHeight,
				screenWidth * 2, screenHeight * 2
			);
			
			//bg_image.draw(0, 0, 5120, 2880, 0);
			
			// Draw level map
			for(let y = 0; y < currentLevel.data.length; y++) {
				for(let x = 0; x < currentLevel.data[y].length; x++) {
					let context_rect = new Rect(
						context_x - tileWidth, context_y - tileHeight,
						screenWidth + 2 * tileWidth, screenHeight + 2 * tileHeight
					);
					
					if(context_rect.containsPoint( x * 64, y * 64)) // culling
						drawBlock(x * 64, y * 64, currentLevel.data[y][x]);
				}
			}

			drawPlayer();
			/*// Draw the collision box
			ctx.beginPath();
			ctx.strokeStyle = "#FFFF00";
			ctx.rect(player.x, player.y, player.maskW, player.maskH);
			ctx.stroke();*/
			
			// Draw brocolli enemies
			for(let i = 0; i < currentLevel.enemies.length; i++) {
				if(currentLevel.enemies[i].dead)
					continue;
				let context_rect = new Rect(
					context_x - spriteWidth, context_y - spriteHeight,
					screenWidth + 2 * tileWidth, screenHeight + 2 * tileHeight
				);
				
				if(context_rect.containsPoint(currentLevel.enemies[i].x, currentLevel.enemies[i].y)) {
					currentLevel.enemies[i].draw(
						currentLevel.enemies[i].x, currentLevel.enemies[i].y, 
						spriteWidth, spriteHeight, 
						currentLevel.enemies[i].animSpeed(animCounter)
					);
				}
			}

			// Draw any scrolls in the level
			for(let i = 0; i < currentLevel.unlockables.length; i++) {
				if(currentLevel.unlockables[i].collected)
					continue;

				let context_rect = new Rect(
					context_x - spriteWidth, context_y - spriteHeight,
					screenWidth + 2 * spriteWidth, screenHeight + 2 * spriteHeight
				);
				
				if(context_rect.containsPoint(currentLevel.unlockables[i].x, currentLevel.unlockables[i].y))// culling
					scrollSprite.draw(currentLevel.unlockables[i].x, currentLevel.unlockables[i].y, spriteWidth, spriteHeight, 0);
			}

			// Draw lives overlay
			for(let i = 0; i < player.lives; i++)
				livesSprite.draw(context_x + tileWidth / 2 + 48 * i, context_y + tileHeight / 2, 48, 48, 0);
			ctx.textAlign = "start";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(" x " + player.lives, context_x + 48 * (startLives + 1), context_y + tileHeight * 0.9);
			break;	
			
		case GameState.GameOver:
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, screenWidth, screenHeight);
			
			ctx.font = "48px Pixeled";
			ctx.textAlign = "center";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("GAME OVER", screenWidth / 2, screenHeight / 2 - 20);
			
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(screenWidth / 2 - 160, screenHeight / 2 + 40, 320, 50);
			ctx.fillStyle = "#000000";
			ctx.fillRect(screenWidth / 2 - 156,  screenHeight / 2 + 44, 312, 42);
			ctx.textAlign = "center";
			ctx.font = "18px Pixeled";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("SPACE TO RESTART", screenWidth / 2, screenHeight / 2 + 80);
			break;
		
		case GameState.Popup:
		case GameState.Paused:
			if(music.songList[currentLevel.music].paused) {
				music.stop();
				music.play(currentLevel.music);
			}

			// Draw background
			ctx.fillStyle = currentLevel.background; // Dull blue
			ctx.fillRect(context_x, context_y, screenWidth, screenHeight);
			
			//bg_image.draw(0, 0, 5120, 2880, 0);
			
			// Draw level map
			for(let y = 0; y < currentLevel.data.length; y++) {
				for(let x = 0; x < currentLevel.data[y].length; x++) {
					let context_rect = new Rect(
						context_x - tileWidth, context_y - tileHeight,
						screenWidth + 2 * tileWidth, screenHeight + 2 * tileHeight
					);
					
					if(context_rect.containsPoint(x * 64, y * 64)) // culling
						drawBlock(x * 64, y * 64, currentLevel.data[y][x]);
				}
			}

			messageBoxSprite.draw(context_x + screenWidth / 2 - 312, context_y + screenHeight / 2 - 376 / 2, 624, 376, 0);
			
			ctx.textAlign = "center";
			ctx.fillStyle = "#CCCCCC";

			switch(gameState) {
				case GameState.Paused:
					ctx.fillText(gamePauseMessage, context_x + screenWidth / 2, context_y + screenHeight / 2);
					break;
				
				case GameState.Popup:
					for(let i = 0; i < gameUnlockedMessage.length; i++) {
						ctx.fillText(gameUnlockedMessage[i], context_x + screenWidth / 2, context_y + screenHeight / 2 - 100 + (30 * i));
					}
					break;
			}
			break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
	if(!player.canPunch) {
		player.punchStart++;
	}
}
