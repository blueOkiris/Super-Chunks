// Includes Level, Block, and blockAt

class Level{
	constructor(layout, bg_color, bg_music) {
		this.data = layout;
		this.background = bg_color;
		this.music = bg_music;
		this.enemies = [];

		for(let y = 0; y < this.data.length; y++) {
			for(let x = 0; x < this.data[0].length; x++) {
				// Check for enemies and player start location
				switch(this.data[y][x]) {
					case -1: // Start location
						this.start = [x * 64, y * 64];
						this.data[y][x] = 0;
						break;
					
					case -2: // Left Brocolli
						this.enemies.push(
							new Enemy(x * 64, y * 64, player.gravity, 
								EnemyType.Brocolli, 
								-1,
								brocolliSprite,
								function(counter) {
									return counter / 8;
								}
							));
							this.data[y][x] = 0;
						break;
					
					case -3: // Right Brocolli
						this.enemies.push(
							new Enemy(x * 64, y * 64, player.gravity, 
								EnemyType.Brocolli, 
								1,
								brocolliSprite,
								function(counter) {
									return counter / 8;
								}
							));
							this.data[y][x] = 0;
						break;
								
					case -4: // Spike
						this.enemies.push(
							new Enemy(x * 64, y * 64, player.gravity, 
								EnemyType.Spike, 
								1,
								spikeSprite,
								function(counter) {
									return 0;
								}
							));
							this.data[y][x] = 0;
						break;
					
					case -5: // Left Brussel Sprout
						this.enemies.push(
							new Enemy(x * 64, y * 64, player.gravity, 
								EnemyType.BrusselSprout, 
								-1,
								brusselSproutSprite,
								function(counter) {
									return (counter / 8) % 4;
								}
							));
							this.data[y][x] = 0;
						break;
					
					case -6: // Right Brussel Sprout
						this.enemies.push(
							new Enemy(x * 64, y * 64, player.gravity, 
								EnemyType.BrusselSprout, 
								1,
								brusselSproutSprite,
								function(counter) {
									return (counter / 8) % 4;
								}
							));
							this.data[y][x] = 0;
						break;
				}
			}
		}
	}
};

/* The scrolls that can unlock special abilities throughout the game */
class Unlockable {
	constructor(xpos, ypos) {
		this.x = xpos;
		this.y = ypos;
	}
};

/* The types of blocks that exist */
const BlockType = {
	Blank: 0,
	Grass: 1,
	Dirt: 2,
	Stone: 3,
	Door: 4,
	Ladder: 5,
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
			this.imgRect[0], this.imgRect[1], tileWidth, tileHeight, // It's location in that image
			x_pos, y_pos, tileWidth, tileHeight); // The tile's actual drawn location
	}
};

function blockAt(map, check_x, check_y, out_msg = "") {
	if(out_msg != "") {
		console.log(out_msg);
		console.log("(" + Math.floor(check_x / 64), Math.floor(check_y / 64) + ")");
	}

	return map.data[Math.floor(check_y / 64)][Math.floor(check_x / 64)];
}
