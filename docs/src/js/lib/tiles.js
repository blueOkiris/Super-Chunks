// Includes Block, and blockAt

/* The scrolls that can unlock special abilities throughout the game */
class Unlockable {
	constructor(xpos, ypos, unlock_function, msg) {
		this.x = xpos;
		this.y = ypos;
		this.unlock = unlock_function;
		this.collected = false;

		this.message = [];

		for(let i = 0, str_build = ""; i < msg.length; i++) {
			if(msg[i] == '\n') {
				this.message.push(str_build);
				str_build = "";
			} else
				str_build += msg[i];
		}
	}
};

/* The types of blocks that exist */
const BlockType = {
	/* Default */
	Blank: 0,
	Grass: 1,
	Dirt: 2,
	Stone: 3,

	Door: 4,
	Ladder: 5,

	/* Water Blocks */
	OceanStone: 6,
	OceanMid: 7,
	OceanTopLeft: 8,
	OceanTopRight: 9,
	OceanBottomLeft: 10,
	OceanBottomRight: 11,
	OceanTop: 12,
	OceanRight: 13,
	OceanBottom: 14,
	OceanLeft: 15,

	/* Air Blocks */
	AirStone: 16,
	AirMid: 17,
	AirTopLeft: 18,
	AirTopRight: 19,
	AirBottomLeft: 20,
	AirBottomRight: 21,
	AirTop: 22,
	AirRight: 23,
	AirBottom: 24,
	AirLeft: 25,

	Water: 26,
};
class Block {
	constructor(identifier, is_solid, img_obj, img_loc) {
		this.id = identifier;
		this.solid = is_solid;
		this.img = img_obj;
		this.imgRect = img_loc;
	}

	draw(x_pos, y_pos) {
		ctx.drawImage(
			this.img, // The tile's image
			this.imgRect[0], this.imgRect[1], 64, 64, // It's location in that image
			x_pos, y_pos, tileWidth, tileHeight); // The tile's actual drawn location
	}
};

function blockAt(map, check_x, check_y, out_msg = "") {
	if(out_msg != "") {
		console.log(out_msg);
		console.log("(" + Math.floor(check_x / tileHeight), Math.floor(check_y / tileWidth) + ")");
	}

	return map.data[Math.floor(check_y / tileHeight)][Math.floor(check_x / tileWidth)];
}
