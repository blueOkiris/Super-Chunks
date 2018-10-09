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
var minimumWidth = 14, minimumHeight = 10;

document.getElementById("resize-text-x").value = "" + minimumWidth;
document.getElementById("resize-text-y").value = "" + minimumHeight;

var levelData = startLevelData;

var offsetX = 0, offsetY = 0;
var xSlider = document.getElementById("canvas-slider-x");
var ySlider = document.getElementById("canvas-slider-y");

var canvas = document.getElementById("levelCanvas");
var ctx = canvas.getContext('2d');

function updateTileMap() {
	// Clear the screen
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(0, 0, 800, 600);

	// Draw the appropriate tiles
	for(let y = (offsetY > 0 ? offsetY : 0); y < levelData.length; y++) {
		for(let x = (offsetX > 0 ? offsetX : 0); x < levelData[0].length; x++) {
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

xSlider.oninput = 
	function() {
		//console.log(this.value);
		offsetX = parseInt(this.value);
		updateTileMap();
	};

ySlider.oninput = 
	function() {
		//console.log(this.value);
		offsetY = parseInt(this.value);
		updateTileMap();
	};

// Use arrow keys to move view around
document.addEventListener('keydown',
	function(e) {
		if(loaded) {
			switch(e.key) {
				case "ArrowUp":
					if(parseInt(ySlider.value) > 0)
						ySlider.value = parseInt(ySlider.value) - 1;
						
					offsetY = parseInt(ySlider.value);
					updateTileMap();
					break;
				
				case "ArrowDown":
					if(parseInt(ySlider.value) < ySlider.max)
						ySlider.value = parseInt(ySlider.value) + 1;
						
						offsetY = parseInt(ySlider.value);
					updateTileMap();
					break;
				
				case "ArrowLeft":
					if(parseInt(xSlider.value) > 0)
						xSlider.value = parseInt(xSlider.value) - 1;

					offsetX = parseInt(xSlider.value);
					updateTileMap();
					break;
				
				case "ArrowRight":
					if(parseInt(xSlider.value) < parseInt(xSlider.max))
						xSlider.value = parseInt(xSlider.value) + 1;
						
					offsetX = parseInt(xSlider.value);
					updateTileMap();
					break;
			}
		}
	}
);

function resizeBtnClicked() {
	try {
		let newWidth = parseInt(document.getElementById("resize-text-x").value);
		let newHeight = parseInt(document.getElementById("resize-text-y").value);

		// Don't go smaller than a certain size!!
		if(newWidth < minimumWidth) {
			newWidth = minimumWidth;
			document.getElementById("resize-text-x").value = "" + minimumWidth;
		}
		if(newHeight < minimumHeight) {
			newHeight = minimumHeight;
			document.getElementById("resize-text-x").value = "" + minimumHeight;
		}

		// First check for expansion
		if(newWidth > levelData[0].length) {
			let currWidth = levelData[0].length;

			for(let y = 0; y < levelData.length; y++) {
				for(let i = 0; i < newWidth - currWidth; i++)
					levelData[y].push(0); // Add blanks
			}

			xSlider.max = newWidth - 1;
		} else if(newWidth < levelData[0].length) { // Then check for decrease
			let currWidth = levelData[0].length;
			
			for(let y = 0; y < levelData.length; y++) {
				for(let i = 0; i < currWidth - newWidth; i++)
					levelData[y].pop(); // Remove ends
			}

			xSlider.max = newWidth - 1;
		}
		
		if(newHeight > levelData.length) {
			let currHeight = levelData.length;

			for(let i = 0; i < newHeight - currHeight; i++) {
				let temp = [];
				for(x = 0; x < levelData[0].length; x++)
					temp.push(0);
				
				levelData.push(temp);
			}

			ySlider.max = newHeight - 1;
		} else if(newHeight < levelData.length) {
			let currHeight = levelData.length;

			for(let i = 0; i < currHeight - newHeight; i++)
				levelData.pop();

			ySlider.max = newHeight - 1;
		}

		updateTileMap();
	} catch(e) {
		alert('Expected integer for new size!');
	}
}

function output() {
	let out = "levelData = [\n";

	for(let y = 0; y < levelData.length; y++) {
		out += "\t[ ";
		for(let x = 0; x < levelData[0].length; x++) {
			out += levelData[y][x];

			if(x != levelData[0].length - 1)
				out += ", ";
		}

		out += "]";

		if(y != levelData.length - 1)
			out += ", ";
		
		out += "\n";
	}

	alert(out + "];");
	console.log(out + "];");
}
