// Includes Level, Block, and blockAt

class Level{
	constructor(layout, bg_color, bg_music, next_level) {
		this.data = layout;
		this.background = bg_color;
		this.music = bg_music;
		this.enemies = [];
		this.unlockables = [];
		this.nextLevel = next_level;

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
					
					case -7: // Double Jump unlock
						this.unlockables.push(new Unlockable(x * 64, y * 64, 
							() => { player.doubleJumpUnlocked = true },
							"YOU HAVE JUST UNLOCKED\nTHE DOUBLE JUMP!!\n\nPRESS THE JUMP BUTTON\nWHEN IN THE AIR\nTO PERFORM ANOTHER JUMP\n\nPRESS SPACE TO CONFIRM\n"));
						this.data[y][x] = 0;
						break;
					
					case -8: // Punch unlocked
						this.unlockables.push(new Unlockable(x * 64, y * 64, () => { player.punchUnlocked = true },
						"\nYOU HAVE JUST UNLOCKED\nPUNCHING!!\n\nPRESS THE SPACE BUTTON\nTO PUNCH ENEMIES\n\nPRESS SPACE TO CONFIRM\n"));
						this.data[y][x] = 0;
						break;
				
					case -9: // Pound unlocked
						this.unlockables.push(new Unlockable(x * 64, y * 64, () => { player.poundUnlocked = true },
						"\nYOU HAVE JUST UNLOCKED\nTHE GROUND POUND!!\n\nPRESS THE DOWN BUTTON\nTO STOMP ONTO ENEMIES\n\nPRESS SPACE TO CONFIRM\n"));
						this.data[y][x] = 0;
						break;
				}
			}
		}
	}

	restart() {
		for(let i = 0; i < this.unlockables.length; i++)
			this.unlockables[i].collected = false;
	}
};

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
