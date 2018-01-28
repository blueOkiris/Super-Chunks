function fillCircle(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.fill();
}

var imageCounter = 0;
function loadImage(src, wait = false) {
	// Create a new image
	var img = new Image();
	imageCounter++;
	
	// Add a load listener and source
	img.addEventListener('load', ()=>{imageCounter--;});
	img.src = src;
	
	return img;
}

function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

function Sprite(src, locs, size) {
	// Get all  the boundaries and locations of  the image
	this.rects = locs.map(
				function(arr) {
					return new Rect(arr[0], arr[1], size[0], size[1]);
				});
	
	this.img = loadImage(src);
	
	this.clear = function(x, y, width, height, index) {
		ctx.clearRect(this.rects[Math.floor(index*spd) % locs.length].x,
			this.rects[Math.floor(index) % locs.length].y,
			this.rects[Math.floor(index) % locs.length].width,
			this.rects[Math.floor(index) % locs.length].height);
	}
	
	this.draw = function(x, y, width, height, index) {
		ctx.drawImage(this.img, // Draw the image
			this.rects[Math.floor(index) % locs.length].x,
			this.rects[Math.floor(index) % locs.length].y,
			this.rects[Math.floor(index) % locs.length].width,
			this.rects[Math.floor(index) % locs.length].height, // source
			x, y, width, height);			// destination
	};
}
