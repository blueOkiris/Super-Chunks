class World {
    constructor(levs, start_lev) {
        this.levels = levs;
        this.startID = start_lev;
        this.currentLevel = 0;
    }
}

class Level{
	constructor(layout, bg_color, bg_music) {
		this.data = layout;
		this.background = bg_color;
		this.music = bg_music;
		this.enemies = [];
		this.unlockables = [];

		for(let y = 0; y < this.data.length; y++) {
			for(let x = 0; x < this.data[0].length; x++) {
				// Check for enemies and player start location
				switch(this.data[y][x]) {
					case -1: // Start location
						this.start = [x * tileWidth, y * tileHeight];
						this.data[y][x] = 0;
						break;
					
					case -2: // Left Brocolli
						this.enemies.push(
							new Enemy(x * tileWidth, y * tileHeight, player.gravity, 
								EnemyType.Brocolli, 
								-1,
								brocolliSprite,
								function(counter) {
									return counter / 8;
								}
							));
							this.data[y][x] = this.data[y-1][x];
						break;
					
					case -3: // Right Brocolli
						this.enemies.push(
							new Enemy(x * tileWidth, y * tileHeight, player.gravity, 
								EnemyType.Brocolli, 
								1,
								brocolliSprite,
								function(counter) {
									return counter / 8;
								}
							));
							this.data[y][x] = this.data[y-1][x];
						break;
								
					case -4: // Spike
						this.enemies.push(
							new Enemy(x * tileWidth, y * tileHeight, player.gravity, 
								EnemyType.Spike, 
								1,
								spikeSprite,
								function(counter) {
									return 0;
								}
							));
							this.data[y][x] = this.data[y-1][x];
						break;
					
					case -5: // Left Brussel Sprout
						this.enemies.push(
							new Enemy(x * tileWidth, y * tileHeight, player.gravity, 
								EnemyType.BrusselSprout, 
								-1,
								brusselSproutSprite,
								function(counter) {
									return (counter / 8) % 4;
								}
							));
							this.data[y][x] = this.data[y-1][x];
						break;
					
					case -6: // Right Brussel Sprout
						this.enemies.push(
							new Enemy(x * tileWidth, y * tileHeight, player.gravity, 
								EnemyType.BrusselSprout, 
								1,
								brusselSproutSprite,
								function(counter) {
									return (counter / 8) % 4;
								}
							));
							this.data[y][x] = this.data[y-1][x];
						break;
					
					case -7: // Double Jump unlock
						this.unlockables.push(new Unlockable(x * tileWidth, y * tileHeight, 
							() => { player.doubleJumpUnlocked = true },
							"YOU HAVE JUST UNLOCKED\nTHE DOUBLE JUMP!!\n\nPRESS THE JUMP BUTTON\nWHEN IN THE AIR\nTO PERFORM ANOTHER JUMP\n\nPRESS SPACE TO CONFIRM\n"));
						
						this.data[y][x] = this.data[y-1][x];
						break;
					
					case -8: // Punch unlocked
						this.unlockables.push(new Unlockable(x * tileWidth, y * tileHeight, () => { player.punchUnlocked = true },
						"\nYOU HAVE JUST UNLOCKED\nPUNCHING!!\n\nPRESS THE SPACE BUTTON\nTO PUNCH ENEMIES\n\nPRESS SPACE TO CONFIRM\n"));
						
						this.data[y][x] = this.data[y-1][x];
						break;
				
					case -9: // Pound unlocked
						this.unlockables.push(new Unlockable(x * tileWidth, y * tileHeight, () => { player.poundUnlocked = true },
						"\nYOU HAVE JUST UNLOCKED\nTHE GROUND POUND!!\n\nPRESS THE DOWN BUTTON\nTO STOMP ONTO ENEMIES\n\nPRESS SPACE TO CONFIRM\n"));
						
						this.data[y][x] = this.data[y-1][x];
						break;
				}
			}
		}
	}

	restart() {
		for(let i = 0; i < this.unlockables.length; i++)
			this.unlockables[i].collected = false;
		
		for(let i = 0; i < this.enemies.length; i++)
			this.enemies[i].restart();
	}
};
