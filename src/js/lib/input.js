/* This file contains all values pertaining to input control in the game */

// This is a list of input actions for the game
const Inputs = {
	Jump: 0,
	Left: 1,
	Right: 2,
	Punch: 3,
	Pound: 4,
	Pause: 5,
	Confirm: 6,
}

// Mouse stuff
class MouseContainer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.pressed = false;
    }
}

// this holds the current state of each of the list above
var input = Array(6).fill(false);
var mouse = new MouseContainer(); // Store current location of mouse and whether or not it was pressed

/* Down here we define the functions that will control the keyboard and mouse values */
document.addEventListener('keydown', 
    function(e) {
        //console.log(e.key);
        switch(e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                input[Inputs.Jump] = true;
                break;
            
            case "ArrowLeft":
            case "a":
            case "A":
                input[Inputs.Left] = true;
                break;
            
            case "ArrowRight":
            case "d":
            case "D":
                input[Inputs.Right] = true;
                break;
            
            case "ArrowDown":
            case "s":
            case "S":
                input[Inputs.Pound] = true;
                break;
            
            case " ":
                input[Inputs.Punch] = true;
                input[Inputs.Confirm] = true;
                //console.log("confirmed/punched");
                break;
            
            case "Escape":
            case "p":
            case "P":
                input[Inputs.Pause] = true;
                break;
        }
    }
);
document.addEventListener('keyup', 
    function(e) {
        switch(e.key) {
            case "ArrowUp":
            case "w":
                input[Inputs.Jump] = false;
                break;
            
            case "ArrowLeft":
            case "a":
                input[Inputs.Left] = false;
                break;
            
            case "ArrowRight":
            case "d":
                input[Inputs.Right] = false;
                break;
            
            case "ArrowDown":
            case "s":
                input[Inputs.Pound] = false;
                break;
            
            case " ":
                input[Inputs.Punch] = false;
                gameJustPunched = false;

                gameJustPopup = false;
                input[Inputs.Confirm] = false;
                break;
            
            case "Escape":
            case "p":
                gameJustPaused = false;
                input[Inputs.Pause] = false;
                break;
        }
    }
);

document.addEventListener('mousedown', 
    function(e) {
        mouse.pressed = true;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }   
);
document.addEventListener('mouseup', 
    function(e) {
        mouse.pressed = false;

        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }   
);
