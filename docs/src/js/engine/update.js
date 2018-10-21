// Updates whenever possible (to be fast)
function Update() {
	switch(gameState) {
		case GameState.Loading:
			if(allImagesLoaded) {
				setTimeout( // Add delay to show splash screen
						() => {
							if(gameState != GameState.Menu) {// Add if in case called many times
								gameState = GameState.Menu;
								music.play(BackgroundMusic.TitleTheme);
							}
						},
					1000);
			}
			break;
		
		case GameState.ChangeLevel:
			break;

		case GameState.Menu:
			if(input[Inputs.Confirm])
				gameState = GameState.MenuToGame;
				break;
			
		case GameState.MenuToGame:
			if(!input[Inputs.Confirm]) {
				music.stop();
				gameState = GameState.LevelSelect;
			}
			break;

		case GameState.LevelSelect:
			if(input[Inputs.Confirm])
				gameState = GameState.StartLevel;
			
			if(input[Inputs.Pound]) {
				currentWorld++;

				if(currentWorld >= numWorlds)
					//currentWorld = 0;
					currentWorld = numWorlds - 1;
				
				gameState = GameState.LevelDown;
			} else if(input[Inputs.Jump]) {
				currentWorld--;

				if(currentWorld < 0)
					//currentWorld = numWorlds - 1;
					currentWorld = 0;
				
				gameState = GameState.LevelUp;
			}
			break;
		
		case GameState.LevelDown:
			if(!input[Inputs.Pound])
				gameState = GameState.LevelSelect;
			break;
		case GameState.LevelUp:
			if(!input[Inputs.Jump])
				gameState = GameState.LevelSelect;
			break;
		
		case GameState.StartLevel:
			if(!input[Inputs.Confirm]) {
				music.stop();
				worlds[currentWorld].currentLevel = -1;
				nextLevel();
				gameState = GameState.Game;
			}
			break;

		case GameState.Game: // play the game
			movementPhysics();
			punchingPhysics();
			collisionChecks();
			enemyCollisions();
			checkUnlocked();

			if(input[Inputs.Pause] && !gameJustPaused && !player.dead) {
				gameJustPaused = true;

				gameState = GameState.Paused;
			}
			break;
			
		case GameState.GameOver:
			if(!gameJustPunched) {
				music.stop();
				music.play(BackgroundMusic.TitleTheme);
				gameState = GameState.Menu; // Wait for release

				player.lives = startLives;
			}
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
				gameJustPunched = true;
				gameState = GameState.Game;
			}
			break;
	}
}

function nextLevel() {
	worlds[currentWorld].currentLevel++;
	if(worlds[currentWorld].currentLevel >= worlds[currentWorld].levels.length) { //  TODO: When world ends
		gameState = GameState.LevelSelect;
		input[Inputs.Confirm] = false;
	} else 
		gameState = GameState.Game;
	
	let new_level = worlds[currentWorld].levels[worlds[currentWorld].currentLevel];
	
	if(worlds[currentWorld].currentLevel < worlds[currentWorld].levels.length) {
		if(currentLevel == null || currentLevel.music != new_level.music) {
			music.stop();
			music.play(new_level.music);
		}
	} else {
		music.stop();
		music.play(BackgroundMusic.TitleTheme);
	}

	currentLevel = new_level;

	// Save current lives and unlockables permanently
	let lives = player.lives;
	let unlocks = [player.punchUnlocked, player.doubleJumpUnlocked, player.poundUnlocked];

	if(worlds[currentWorld].currentLevel < worlds[currentWorld].levels.length)
		player = new Player(new_level.start, 
			pImageSpeed, pMoveSpeed, pPunchSpeed, pGravity, pJumpSpeed, 
			pMaskW, pMaskH, 
			unlocks[0], unlocks[1], unlocks[2],
			chunksSprite
		);
	player.lives = lives;
}

