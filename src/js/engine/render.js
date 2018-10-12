// Updates every frame (60 fps)
function Render() {
	switch(gameState) {
		case GameState.Loading:
			splashSprite.draw(0, 0, screenWidth, screenHeight, 0);
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
			for(let y = 0; y < currentLevel.data.length; y++) {
				for(let x = 0; x < currentLevel.data[y].length; x++) {
					if((new Rect(player.x + player.maskW / 2 - screenWidth / 2 - tileWidth, player.y + player.maskH / 2 - screenHeight / 2 - tileHeight,
						screenWidth + tileWidth * 2, screenHeight + tileWidth * 2)).containsPoint(
						x * 64, y * 64)) // culling
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
				if(!currentLevel.enemies[i].dead
					&& (new Rect(player.x + player.maskW / 2 - screenWidth / 2 - spriteWidth, player.y + player.maskH / 2 - screenHeight / 2 - spriteHeight,
					screenWidth + spriteWidth * 2, screenHeight + spriteHeight * 2)).containsPoint(
					currentLevel.enemies[i].x, currentLevel.enemies[i].y)) { // culling
					currentLevel.enemies[i].draw(
						currentLevel.enemies[i].x, currentLevel.enemies[i].y, 
						spriteWidth, spriteHeight, 
						currentLevel.enemies[i].animSpeed(animCounter)
					);

					/*// Draw the collision box
					ctx.beginPath();
					ctx.strokeStyle = "#FFFF00";
					ctx.rect(
						currentLevel.enemies[i].x + (spriteWidth - enemyMaskW) / 2, currentLevel.enemies[i].y + (spriteHeight - enemyMaskH) / 2, 
						enemyMaskW, enemyMaskH);
					ctx.stroke();*/
				}
			}

			// Draw lives overlay
			for(let i = 0; i < player.lives; i++)
				livesSprite.draw((player.x + player.maskW / 2) - screenWidth / 2 + tileWidth / 2 + 48 * i, (player.y + player.maskH / 2) - screenHeight / 2 + tileHeight / 2, 48, 48, 0);
			ctx.textAlign = "start";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(" x " + player.lives, (player.x + player.maskW / 2) - screenWidth / 2 + 48 * (startLives + 1), (player.y + player.maskH / 2) - screenHeight / 2 + tileHeight * 0.9);
			break;	
			
		case GameState.GameOver:
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, screenWidth, screenHeight);
			
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
			if(music.songList[currentLevel.music].paused) {
				music.stop();
				music.play(currentLevel.music);
			}

			// Draw background
			ctx.fillStyle = currentLevel.background; // Dull blue
			ctx.fillRect(player.x - (screenWidth - player.maskW), player.y - (screenHeight - player.maskH), screenWidth * 2, screenHeight * 2);
			
			//bg_image.draw(0, 0, 5120, 2880, 0);
			
			// Draw level map
			for(let y = 0; y < currentLevel.data.length; y++) {
				for(let x = 0; x < currentLevel.data[y].length; x++) {
					if((new Rect(player.x + player.maskW / 2 - screenWidth / 2 - tileWidth, player.y + player.maskH / 2 - screenHeight / 2 - tileHeight,
						screenWidth + tileWidth * 2, screenHeight + tileWidth * 2)).containsPoint(
						x * 64, y * 64)) // culling
					drawBlock(x * 64, y * 64, currentLevel.data[y][x]);
				}
			}

			messageBoxSprite.draw(player.x + player.maskW / 2 - 312, player.y + player.maskH / 2 - 376 / 2, 624, 376, 0);
			
			ctx.textAlign = "center";
			ctx.fillStyle = "#CCCCCC";

			switch(gameState) {
				case GameState.Paused:
					ctx.fillText(gamePauseMessage, player.x + player.maskW / 2, player.y + player.maskH / 2);
					break;
				
				case GameState.Popup:
					ctx.fillText(gameUnlockedMessage, player.x + player.maskW / 2, player.y + player.maskH / 2);
					break;
			}
			break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
	if(!player.canPunch) {
		player.punchStart++;
	}
}
