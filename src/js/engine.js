var animCounter = 0;// Controls the updating of animations
// Keyboard stuff
var key = [false,false,false,false]; //  Up, down, left, right
var up = 0, down = 1, left = 2, right = 3;
// Mouse stuff
var mouse_x = 0, mouse_y = 0, mouse_pressed = false;

/* My Code */
var x = 400 - 32, y = 300 - 32;
var x_speed = 0, y_speed = 0, move_speed = 4;
var GameState = {
	Menu: 0,
	MenuToGame: 1,
	Game: 2,
};

var game_state = GameState.Menu;

// Updates whenever possible (to be fast)
function Update() {
	switch(game_state) {
	case GameState.Menu: // Click to start
		if(mouse_pressed &&
			(mouse_x >= 300 && mouse_x <= 500 &&
			 mouse_y >= 275 && mouse_y <= 325)) { // Mouse is in box
			game_state = GameState.MenuToGame; // Wait for release
		}
		break;
	
	case GameState.MenuToGame:
		if(!mouse_pressed) {
			game_state = GameState.Game;
			// Play music in the background
			bg_music.play();
		}
		break;
	
	case GameState.Game: // play the game
		// Move with keypresses
		x_speed = (key[left] ? -move_speed : 0) + (key[right] ? move_speed  : 0);
		y_speed = (key[up] ? -move_speed : 0) + (key[down] ? move_speed  : 0);
		
		if(x + x_speed <= 0) {
			x = x_speed = 0;
		} else if(x + x_speed + 64 >= 800) {
			x = 800 - 64;
			x_speed = 0;
		}
		
		if(y + y_speed <= 0) {
			y = y_speed = 0;
		} else if(y + y_speed + 64 >= 600) {
			y = 600 - 64;
			y_speed = 0;
		}
		
		x += x_speed;
		y += y_speed;
		
		break;
	}
}

// Updates every frame (60 fps)
function Render() {
	ctx.clearRect(0, 0, 800, 600); // Clear the screen
	
	switch(game_state) {
	case GameState.Menu:
	case GameState.MenuToGame:// start screen
		// Make a little button
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(300, 275, 200, 50);
		ctx.font = "30px Arial";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Click to play!", 312, 310);
		break;
	
	case GameState.Game: // Actual test code
		derp_face.draw(x, y, 64, 64, animCounter);
		bomb.draw(200 + 100 * Math.sin(animCounter/10), 10, 64, 128, animCounter/2);
		break;
	}
	
	animCounter++; //  Update the animation for all sprites every frame
}

// Key pressed event
function OnKeyDown(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = true;
			break;
		
		case 40:
			key[down] = true;
			break;
			
		case 37:
			key[left] = true;
			break;
			
		case 39:
			key[right] = true;
			break;
	}
}

// Key released event
function OnKeyUp(event) {
	switch(event.keyCode) {
		case 38:
			key[up] = false;
			break;
		
		case 40:
			key[down] = false;
			break;
			
		case 37:
			key[left] = false;
			break;
			
		case 39:
			key[right] = false;
			break;
	}
}

// When the mouse is pressed
function OnMouseDown(event) {
	mouse_pressed = true;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

function OnMouseUp(event) {
	mouse_pressed = false;
	
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}
