var startLevelData = 
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
document.getElementById("resize-width").value = "14";
document.getElementById("resize-height").value = "10";

var levelData = startLevelData;

var offsetX = 0, offsetY = 0;

var canvas = document.getElementById("levelCanvas");
var ctx = canvas.getContext('2d');

function updateTileMap() {
	// Clear the screen
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, 800, 600);

	// Draw the appropriate tiles
	for(let y = (offsetY > 0 ? offsetY : 0); y < levelData.length && y < 10; y++) {
		for(let x = (offsetX > 0 ? offsetX : 0); x < levelData[0].length && x < 14; x++) {
			//console.log("offset: (" + offsetX + ", " + offsetY + ")");

			ctx.drawImage(imageList[levelData[y][x]], 
				(x - offsetX) * 64, (y - offsetY) * 64,
				64, 64);
		}
	}
}

// When clicked, place the appropriate tile
canvas.addEventListener('click', 
	function(e) {
		if(loaded) {
			let x = e.pageX - canvas.offsetLeft;
			let y = e.pageY - canvas.offsetTop;

			levelData
				[Math.floor((y - offsetY * 64) / 64)]
				[Math.floor((x - offsetX * 64) / 64)] = iconSelect.getSelectedValue();
			
			updateTileMap();
		}
	}
, false);

// Use arrow keys to move view around
document.addEventListener('keydown',
	function(e) {
		if(loaded) {
			switch(e.key) {
				case "ArrowUp":
					offsetY++;
					updateTileMap();
					break;
				
				case "ArrowDown":
					offsetY--;
					updateTileMap();
					break;
				
				case "ArrowLeft":
					offsetX++;
					updateTileMap();
					break;
				
				case "ArrowRight":
					offsetX--;
					updateTileMap();
					break;
			}
		}
	}
);