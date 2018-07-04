/* Set up vars for the loop */
var skipTicks = 1000/60; // 60 fps
var maxFrameSkip = 60;
var maxTimeDifference = 30; // If it's a second behind just start from scratch
var nextGameTick = (new Date).getTime();

var onPage = true;

// The set up for the game loop
function start_game() {
	document.addEventListener('keydown', OnKeyDown);
	document.addEventListener('keyup', OnKeyUp);
	document.addEventListener('mousedown', OnMouseDown);
	document.addEventListener('mouseup', OnMouseUp);
	
	/* Set up the game loop */
	var onEachFrame;
	
	// Try to run advanced game loop, but allow simplified for low-end devs
	if(window.requestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = function() {
				cb();
				requestAnimationFrame(_cb);
			}
			_cb();
		};
	} else {
		onEachFrame = function(cb) {
			setInterval(cb, skipTicks);
		}
	}
	
	window.onEachFrame = onEachFrame;
	window.onEachFrame(game_loop);
}

var hasStarted = false;
// The game loop
function game_loop() {
	if(!hasStarted) {
		if(imageCounter == 0) {
			spr_splash.draw(0, 0, 800, 600, 0);
			
			setTimeout(function() { hasStarted = true; }, 5000);
		}
	} else {
		var loops = 0;
	
		var time = (new Date).getTime();
		if(time < nextGameTick + maxTimeDifference) {
			while(time > nextGameTick && loops < maxFrameSkip) {
				if(imageCounter == 0) // all images have loaded
					Update();
		
				nextGameTick += skipTicks;
				loops ++;
			}
		} else {
			nextGameTick = time;
		}

		if(loops) {
			if(imageCounter == 0) // all images have loaded
				Render();
		}
	}
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
		
		case 32:
			key[space] = true;
			break;
			
		case 90:
			key[z_key] = true;
			break;
		
		case 87:
			key[w_key] = true;
			break;
		
		case 65:
			key[a_key] = true;
			break;
			
		case 83:
			key[s_key] = true;
			break;
			
		case 68:
			key[d_key] = true;
			break;
			
		case 13:
			key[enter] = true;
			break;
		
		case 80:
		case 27:
			key[esc] = true;
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
		
		case 32:
			key[space] = false;
			space_released = true;
			break;
		
		case 90:
			key[z_key] = false;
			break;
		
		case 87:
			key[w_key] = false;
			break;
		
		case 65:
			key[a_key] = false;
			break;
			
		case 83:
			key[s_key] = false;
			break;
			
		case 68:
			key[d_key] = false;
			break;
		
		case 13:
			key[enter] = false;
			game_popup = true;
			break;
			
		case 80:
		case 27:
			key[esc] = false;
			game_canpause = true;
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


