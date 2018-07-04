var canvas = document.getElementById("level_canvas");
var tile_canvas = document.getElementById("tile_canvas");
var ctx = canvas.getContext('2d');
var tile_ctx = tile_canvas.getContext('2d');

ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 800, 600);
tile_ctx.fillStyle = "#606060";
tile_ctx.fillRect(0, 0, 196, 733);

var width = 14;
var height = 10;

var start_x = 0;
var start_y = 0;

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

var images = 0;
function dirtRead() {
	images++;
	
	if(images >= 2) {
		drawEditLevel();
		drawTileMenu();
	}
}
function stoneRead() {
	images++;
	
	if(images >= 2) {
		drawEditLevel();
		drawTileMenu();
	}
}

dirtBlock.onload = dirtRead;
stoneBlock.onload = stoneRead;

function drawEditLevel() {
	var i = 0, j = 0;
	for(i = start_x; i < width; i++) {
		for(j = start_y; j < height; j++) {
			switch(level_data[j][i]) {
				case 0:
					ctx.fillStyle = "#000000";
					ctx.fillRect((i - start_x) * 64 - 16, (j - start_y) * 64, 64, 64);
					ctx.fillStyle = "#2490FF";
					ctx.fillRect((i - start_x) * 64 - 14, (j - start_y) * 64 + 2, 60, 60);
					break;
				
				case 1: // Grass
					ctx.drawImage(dirtBlock, 
								0, 0, 64, 64,
								(i - start_x) * 64 - 16, (j - start_y) * 64, 64, 64);
					break;
					
				case 2: // Dirt
					ctx.drawImage(dirtBlock, 
								64, 0, 64, 64,
								(i - start_x) * 64 - 16, (j - start_y) * 64, 64, 64);
					break;

				case 3: // Dirt
					ctx.drawImage(stoneBlock, 
								0, 0, 64, 64,
								(i - start_x) * 64 - 16, (j - start_y) * 64, 64, 64);
					break;
			}
		}
	}
	
	//alert("Refreshed level!");
}

var current_tile = 0;

function drawTileMenu() {
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
	
	tile_ctx.fillRect(10, 180, 64, 64);
	tile_ctx.fillRect(112, 180, 64, 64);
	//tile_ctx.fillRect(10, 264, 64, 64);
	//tile_ctx.fillRect(112, 264, 64, 64);
	//tile_ctx.fillRect(10, 348, 64, 64);
	
	tile_ctx.fillStyle = "#2490FF";
	tile_ctx.fillRect(12, 182, 60, 60);
	tile_ctx.drawImage(dirtBlock, 0, 0, 64, 64, 10, 264, 64, 64);
	tile_ctx.drawImage(dirtBlock, 64, 0, 64, 64, 112, 264, 64, 64);
	tile_ctx.drawImage(stoneBlock, 0, 0, 64, 64, 10, 348, 64, 64);
}

function resize() {
	
}

//document.body.onload = start();
