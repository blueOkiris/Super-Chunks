var canvas = document.getElementById("level_canvas");
var tile_canvas = document.getElementById("tile_canvas");
var ctx = canvas.getContext('2d');
var tile_ctx = tile_canvas.getContext('2d');

document.getElementById("width").value = 14;
document.getElementById("height").value = 10;

ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 800, 600);
tile_ctx.fillStyle = "#606060";
tile_ctx.fillRect(0, 0, 196, 759);

var width = 14;
var height = 10;

var start_x = 0;
var start_y = 0;

// Take screen coordinates and convert them into the location in the level_data array
function getArrayLocFromScreen(x, y) {
	var actualStartX = start_x * 64, actualStartY = start_y * 64;
	var location = [y + actualStartY, x + actualStartX];
	location[0] = Math.floor(location[0] / 64);
	location[1] = Math.floor(location[1] / 64);

	return location;
}

// Check if two points  are in a bounding box
function RectContains(x, y, rx, ry, rw, rh) {
	return !(x < rx || x > rx + rw || y < ry || y > ry + rh);
}

canvas.onmousedown = function(e) {
	//alert('click');
	// Get mouse locations
	var mouse_x = e.pageX - this.offsetLeft;
	var mouse_y = e.pageY - this.offsetTop;

	// Change mouse coordinates into level coordinates
	var dataPosition = getArrayLocFromScreen(mouse_x, mouse_y);
	//alert("level_data[" + dataPosition[1] + "][" + dataPosition[0] + "]");

	// Change the type of block to the selected block
	level_data[dataPosition[0]][dataPosition[1]] = selectedBlock;
	drawEditLevel();
}

tile_canvas.onmousedown = function(e) {
	// Get mouse locations
	var mouse_x = e.pageX - this.offsetLeft;
	var mouse_y = e.pageY - this.offsetTop;

	/* From Draw Tile Menu
	 * 
	 * tile_ctx.fillRect(12, 182, 60, 60);
	 * tile_ctx.drawImage(dirtBlock, 0, 0, 64, 64, 10, 264, 64, 64);
	 * tile_ctx.drawImage(dirtBlock, 64, 0, 64, 64, 112, 264, 64, 64);
	 * tile_ctx.drawImage(stoneBlock, 0, 0, 64, 64, 10, 348, 64, 64); 
	 * 
	 */

	// Choose an object type
	if(RectContains(mouse_x, mouse_y, 12, 180, 64, 64)) // Check for empty space
		selectedBlock = 0;
	else if(RectContains(mouse_x, mouse_y, 10, 264, 64, 64)) // Check for grass
		selectedBlock = 1;
	else if(RectContains(mouse_x, mouse_y, 112, 264, 64, 64)) // Check for dirt
		selectedBlock = 2;
	else if(RectContains(mouse_x, mouse_y, 10, 348, 64, 64)) // Check for stone
		selectedBlock = 3;
	else if(RectContains(mouse_x, mouse_y, 112, 348, 64, 64))
		selectedBlock = 4;
	else if(RectContains(mouse_x, mouse_y, 112, 180, 64, 64))
		selectedBlock = 5;
	else
		return;
	
	drawTileMenu();
}

var start_level_data = 
[
	[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,0,3,3,3,3,3,3,3],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

var level_data = start_level_data;

var selectedBlock = 0;

var images = 0;
function dirtRead() {
	images++;
	
	if(images >= 3) {
		drawEditLevel();
		drawTileMenu();
	}
}
function stoneRead() {
	images++;
	
	if(images >= 3) {
		drawEditLevel();
		drawTileMenu();
	}
}
function ladderRead() {
	images++;

	if(images >= 3) {
		drawEditLevel();
		drawTileMenu();
	}
}

dirtBlock.onload = dirtRead;
stoneBlock.onload = stoneRead;
ladder.onload = ladderRead;

function drawEditLevel() {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, 800, 600);
	
	var xind = start_x;
	while(xind < width + start_x) {
		var yind = start_y;
		while(yind < height + start_y) {
			if(xind >= 0 && yind >= 0 && xind < width && yind < height) { // only draw if onscreen
				switch(level_data[yind][xind]) {
					case 0:
						ctx.fillStyle = "#000000";
						ctx.fillRect((xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						ctx.fillStyle = "#2490FF";
						ctx.fillRect((xind - start_x) * 64 - 14, (yind - start_y) * 64 + 2, 60, 60);
						break;
					
					case 1: // Grass
						ctx.drawImage(dirtBlock, 
									0, 0, 64, 64,
									(xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						break;
						
					case 2: // Dirt
						ctx.drawImage(dirtBlock, 
									64, 0, 64, 64,
									(xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						break;

					case 3: // Dirt
						ctx.drawImage(stoneBlock, 
									0, 0, 64, 64,
									(xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						break;
					
					case 4: // Door
						ctx.fillStyle = "#000000";
						ctx.fillRect((xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						break;
					
					case 5: // Ladder
						ctx.drawImage(ladder, 
									0, 0, 64, 64,
									(xind - start_x) * 64 - 16, (yind - start_y) * 64, 64, 64);
						break;

				}
			}
			
			yind++;
		}
		
		xind++;
	}
	
	//alert("Refreshed level!");
}

function reset() {
	level_data = start_level_data;
	width = 14;
	height = 10;
	
	document.getElementById("width").value = 14;
	document.getElementById("height").value = 10;
	
	drawEditLevel();
}

var current_tile = 0;

function drawTileMenu() {
	// Clear screen
	tile_ctx.fillStyle = "#606060";
	tile_ctx.fillRect(0, 0, 196, 759);

	tile_ctx.fillStyle = "#000000";
	tile_ctx.font = "12pt Pixeled";
	tile_ctx.fillText("CURRENT TILE: ", 10, 30);
	
	tile_ctx.fillRect(10, 40, 64, 64);
	switch(current_tile) {
		case 0:
			tile_ctx.fillStyle = "#2490FF";
			tile_ctx.fillRect(12, 42, 60, 60);
			break;
	}
	
	tile_ctx.fillStyle = "#000000";
	tile_ctx.fillText("CHOOSE TILE: ", 10, 160);

	//  Draw selection
	switch(selectedBlock) {
		case 0: // Blank
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(8, 178, 68, 68);
			break;
		
		case 1: // Grass
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(8, 262, 68, 68);
			break;
		
		case 2: // DIrt
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(110, 262, 68, 68);
			break;
		
		case 3: // Stone
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(8, 346, 68, 68);
			break;
		
		case 4: // Door
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(110, 346, 68, 68);
			break;
		
		case 5: // Ladder
			tile_ctx.fillStyle = "#FFFF00";
			tile_ctx.fillRect(110, 178, 68, 68);
			break;
	}
	
	tile_ctx.fillStyle = "#000000";
	tile_ctx.fillRect(10, 180, 64, 64);
	tile_ctx.fillRect(112, 348, 64, 64);

	tile_ctx.fillStyle = "#2020FF";
	tile_ctx.fillRect(112, 180, 64, 64);
	
	tile_ctx.fillStyle = "#2490FF";
	tile_ctx.fillRect(12, 182, 60, 60);
	tile_ctx.drawImage(dirtBlock, 0, 0, 64, 64, 10, 264, 64, 64);
	tile_ctx.drawImage(dirtBlock, 64, 0, 64, 64, 112, 264, 64, 64);
	tile_ctx.drawImage(stoneBlock, 0, 0, 64, 64, 10, 348, 64, 64);
	tile_ctx.drawImage(ladder, 0, 0, 64, 64, 112, 180, 64, 64);
}

function move(x, y) {
	start_x += x;
	start_y += y;
	
	drawEditLevel();
	
	//alert(start_x);
}

function shift(x, y) {
	// Resize to make room for new variables
	if(x != 0) {
		document.getElementById("width").value = parseInt(document.getElementById("width").value) + Math.abs(x);
		resize();
	}
	if(y != 0) {
		document.getElementById("height").value = parseInt(document.getElementById("height").value) + Math.abs(y);
		resize();
	}

	var yind = 0, xind = 0, x2 = 0;
	if(x > 0) {
		for(yind = 0; yind < level_data.length; yind++ ) { // On each row, shift everything right
			for(xind = level_data[0].length - 2; xind >= 0; xind--)
				level_data[yind][xind + 1] = level_data[yind][xind]; // first one level_data[level_data[0].length]
			level_data[yind][0] = 0;
		}

		drawEditLevel();
	} else if(x < 0)
		move(-x, 0);

	if(y > 0) {
		for(yind = level_data.length - 2; yind >= 0; yind--) {
			for(x2 = 0; x2 < level_data[yind].length; x2++)
				level_data[yind + 1][x2] = level_data[yind][x2];
		}
		for(xind = 0; xind < level_data[0].length; xind++)
			level_data[0][xind] =  0;
		
		drawEditLevel();
	} else if(y < 0)
		move(0, -y);
}

window.onkeydown = function(e) {
	switch(e.key) {
		case "ArrowLeft":
			move(-1, 0);
			break;
			
		case "ArrowRight":
			move(1, 0);
			break;
		
		case "ArrowUp":
			move(0, -1);
			break;
		
		case "ArrowDown":
			move(0, 1);
			break;
		
		case "a":
			shift(-1, 0);
			break;
			
		case "d":
			shift(1, 0);
			break;
		
		case "w":
			shift(0, -1);
			break;
		
		case "s":
			shift(0, 1);
			break;
	}
}

function resize() {
	if(w < 5 || h < 5)
		return;
	
	var w = parseInt(document.getElementById("width").value);
	var h = parseInt(document.getElementById("height").value);
	
	if(w > width) {
		if(width < level_data[0].length)
			width = Math.min(level_data[0].length, w);
		
		var i, j;
		for(i = 0; i < Math.max(height, level_data.length); i++) {
			for(j = 0; j < w - width; j++)
				level_data[i].push(0);
			level_data[i].length = w;
		}
		
		width = w;
		
		drawEditLevel();
	}
	
	if(h > height) {
		if(height < level_data.length)
			height = Math.min(level_data.length, h);
		
		var i, j;
		for(i = 0; i < h - height; i++) {
			var newRow = [];
			for(j = 0; j < Math.max(width, level_data[0].length); j++)
				newRow.push(0);
			newRow.length = width;
			level_data.push(newRow);
		}
		
		height = h;
		
		drawEditLevel();
	}
	
	if(w < width) {
		width = w;
		drawEditLevel();
	}
	
	if(h < height) {
		height = h;
		drawEditLevel();
	}
}

function output() {
	var level = "level = [\n";
	
	var i = 0;
	while(i < height) {
		level += "[";
		
		var j = 0;
		while(j < width) {
			level += level_data[i][j] + ",";
			
			j++;
		}
		
		level += "],\n";
		
		i++;
	}
	
	level += "];"
	
	alert(level);
}
