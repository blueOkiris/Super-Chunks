class Rect {
	constructor(_x, _y, w, h) {
		this.x = _x;
		this.y = _y;
		this.width = w;
		this.height = h;
	}

	containsPoint(x_pos, y_pos) {
		return (x_pos >= this.x) && (x_pos <= this.x + this.width) && (y_pos >= this.y) && (y_pos <= this.y + this.height);
	}

	overlaps(other) {
		return (this.x < other.x + other.width) && (this.x + this.width > other.x)
				&& (this.y < other.y + other.height)  && (this.y + this.height > other.y);
	}
};

class Sprite {
	constructor(img_src, locs, _size) {
		this.img = img_src;
		this.size = _size;
		this.rects = locs.map(
			function(arr) {
				return new Rect(arr[0], arr[1], _size[0], _size[1]);
			}
		);
	}
	
	draw(x, y, width, height, index) {
		ctx.drawImage(this.img, // Draw the image
			this.rects[Math.floor(index) % this.rects.length].x,
			this.rects[Math.floor(index) % this.rects.length].y,
			this.rects[Math.floor(index) % this.rects.length].width,
			this.rects[Math.floor(index) % this.rects.length].height, // source
			x, y, width, height);	
	}
};
