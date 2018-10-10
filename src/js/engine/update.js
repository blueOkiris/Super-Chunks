// Updates whenever possible (to be fast)
function Update() {
	switch(gameState) {
		case GameState.Loading:
			if(allImagesLoaded) {
				setTimeout( // Add delay to show splash screen
						function() {
							if(gameState != GameState.Menu) {// Add if in case called many times
								gameState = GameState.Menu;
								music.play(BackgroundMusic.TitleTheme);
							}
						},
					1000);
			}
			break;

		case GameState.Menu:
			if(input[Inputs.Confirm])
				gameState = GameState.MenuToGame;
				break;
			
		case GameState.MenuToGame:
			if(!input[Inputs.Confirm]) {
				music.stop();
				changeLevel(introLevel);
				gameState = GameState.Game;
			}
			break;
		
		case GameState.Game: // play the game
			movementPhysics();
			punchingPhysics();
			collisionChecks();
			//enemyCollisions();
				

			if(input[Inputs.Pause] && !gameJustPaused && !player.dead) {
				gameJustPaused = true;

				gameState = GameState.Paused;
			}
			break;
			
		case GameState.GameOver:
			/*if(space_released) {
				bg_music[0].duration = 0;
				game_state = GameState.Menu; // Wait for release
			}*/
			break;
		
		case GameState.Paused:
			if(input[Inputs.Pause] && !gameJustPaused) {
				gameJustPaused = true;
				gameState = GameState.Game;
			}
			break;
		
		case GameState.Popup:
			if(input[Inputs.Confirm] && !gameJustPopup) {
				gameJustPopup = true;
				gameState = GameState.Game;
			}
			break;
	}
}

function changeLevel(new_level) {
	if(currentLevel.music != new_level.music) {
		music.stop();
		music.play(new_level.music);
	}

	currentLevel = new_level;

	// Save current lives and unlockables permanently
	let lives = player.lives;
	let unlocks = [player.punchUnlocked, player.doubleJumpUnlocked, player.poundUnlocked];

	player = new Player(new_level.start, 
		pImageSpeed, pMoveSpeed, pPunchSpeed, pGravity, pJumpSpeed, 
		pMaskW, pMaskH, 
		unlocks[0], unlocks[1], unlocks[2],
		chunksSprite
	);
	player.lives = lives;
}

