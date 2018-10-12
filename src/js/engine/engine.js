/* Set up vars for the loop */
var skipTicks = 1000 / frameRate; // 60 fps default
var maxFrameSkip = frameRate;
var maxTimeDifference = frameRate / 2; // If it's a second behind just start from scratch
var nextGameTick = (new Date).getTime();

var onPage = true;

// The set up for the game loop
function startGame() {
	/* Set up the game loop */
	var onEachFrame;
	
	// Try to run advanced game loop, but allow simplified for low-end devs
	if(window.requestAnimationFrame) {
		onEachFrame = function(cb) {
			var _cb = () => {
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
	window.onEachFrame(gameLoop);
}

// The game loop
function gameLoop() {
	var loops = 0;

	var time = (new Date).getTime();
	if(time < nextGameTick + maxTimeDifference) {
		while(time > nextGameTick && loops < maxFrameSkip) {
			Update();
	
			nextGameTick += skipTicks;
			loops ++;
		}
	} else {
		nextGameTick = time;
	}

	if(loops) {
		Render();
	}
}
