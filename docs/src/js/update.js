// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(key[space])
			game_state = GameState.MenuToGame; // Wait for release
		break;
	
	case GameState.MenuToGame:
		if(!key[space]) {
			bg_music[0].pause();
			current_unlock = 0;
			changeLevel(test_level, intro_level_music);
			game_state = GameState.Game;
		}
		break;
	
	case GameState.LevelChange:
		bg_music[current_music].pause();
		
		if(change_level) {
			game_state = GameState.Game;
			change_level = true;
		}
		
		break;
	
	case GameState.Game: // play the game
		movementPhysics();
		punchingPhysics();
		collisionChecks();
		enemyCollisions();
					 		
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
		if(space_released) {
			bg_music[0].duration = 0;
			game_state = GameState.Menu; // Wait for release
		}
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

/*function changeLevel(levelData, backgroundColor, newEnemies, startLocation) {
	player = new Player(startLocation[0], startLocation[1], 1, 4, 10, 0.4, 11, 46, 50, 0);
	current_level = levelData;
	enemies = newEnemies;
	current_level_bg = backgroundColor;
	player.saveUnlock();
}*/

function changeLevel(new_level, newMusic) {
	current_level = new_level;
	var lives = player.lives;
	player = new Player(new_level.start[0], new_level.start[1], 1, 4, 10, 0.4, 11, 46, 50, 0);
	player.lives = lives;
	player.saveUnlock();
	
	if(newMusic != -1) {
		bg_music[current_music].pause();
		bg_music[current_music].duration = 0;
		current_music = newMusic;
		bg_music[current_music].play();
	}
}

