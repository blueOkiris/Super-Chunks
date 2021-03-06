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
	let out = "[\n";

	for(let y = 0; y < levelData.length; y++) {
		out += "\t[ ";
		for(let x = 0; x < levelData[0].length; x++) {
			if(Math.floor(levelData[y][x] / 10) == 0 && levelData[y][x] >= 0)
				out += ' ';
			
			out += levelData[y][x];

			if(x != levelData[0].length - 1)
				out += ",";
		}

		out += "]";

		if(y != levelData.length - 1)
			out += ", ";
		
		out += "\n";
	}

	//alert(out + "];");
	console.log("levelData = " + out + "];");
	
	var link = document.getElementById('downloadlink');
	link.href = makeTextFile(out + "];");
	link.style.display = 'block';
}

/* Save file */
var textFile = null;
var makeTextFile = function (text) {
	var data = new Blob([text], {type: 'text/plain'});

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

/* Load file */
function getLevel() {
	let reader = new FileReader();
	reader.onload = function(e) {
		let text = reader.result;

		let level_chars = [];
		let new_level_data = [];
		let row_data = [];
		let number = "";

		console.log("Reading level...");
		//console.log(text);

		let i = 0;

		//console.log("Finding start position");

		i = 0;
		//console.log(text.charAt(0));
		while(text.charAt(i) != "[") {
			console.log(text.charAt(i));
			i++;
		}
		i++;

		//console.log("Found start index");
		for(; i < text.length; i++) {
			if(text.charAt(i) != ' '
			&& text.charAt(i) != '\n' 
			&& text.charAt(i) != '\t'
			&& text.charAt(i) != '\r'
			&& text.charAt(i) != ';'
			&& text.charAt(i) != '[')
				level_chars.push(text.charAt(i));
		}
		level_chars.pop();

		console.log("Interpretting array code");
		for(i = 0; i < level_chars.length; i++) {
			if(level_chars[i] == ']') {
				// Check for left over number
				if(number != "") {
					row_data.push(parseInt(number));
					number = "";
				}

				new_level_data.push(row_data);
				row_data = [];

				i++; // Theres a comma after the right bracket
			} else if(level_chars[i] == ',') {
				row_data.push(parseInt(number));
				number = "";
			} else
				number += level_chars[i];
		}

		console.log("Done.");

		levelData = new_level_data;
		xSlider.max = levelData[0].length;
		ySlider.max = levelData.length;
		document.getElementById("resize-text-x").value = "" + levelData[0].length;
		document.getElementById("resize-text-y").value = "" + levelData.length;

		updateTileMap();
	}

	let file = document.getElementById("read_level").files[0];
	reader.readAsText(file);
	//console.log(reader.text);
}
