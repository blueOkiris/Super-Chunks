/* Set up vars for the loop */
var skipTicks = 1000/60; // 60 fps
var maxFrameSkip = 20;
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

// The game loop
function game_loop() {
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

