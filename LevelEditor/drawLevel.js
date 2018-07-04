var canvas = document.getElementById("level_canvas");
var ctx = canvas.getContext('2d');

ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 800, 600);

var width = 14;
var height = 10;

var start_x = 0;
var start_y = 0;

var level_data = 
[
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function drawEditLevel() {
	var i = 0, j = 0;
	for(i = start_x; i < width; i++) {
		for(j = start_y; j < height; j++) {
			switch(level_data[j][i]) {
				case 0:
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect((i - start_x - 32) * 64, (j - start_y) * 64, 64, 64);
					ctx.fillStyle = "#1212FF";
					ctx.fillRect((i - start_x - 32) * 64 + 2, (j - start_y) * 64 + 2, 60, 60);
					break;
			}
		}
	}
	
	//alert("Refreshed level!");
}

function resize() {
	
}

document.body.onload = drawEditLevel();
