function drawPlayer() {
	// Draw player
	if(player.dead) {
		player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.Die);
	} else {
		if(!player.dead && (input[Inputs.Pound] && player.poundUnlocked) && !player.grounded)
        player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.Pound);
		else if(player.climbing) {
			let walk_cycle_index = (animCounter / 4) % 4;
			player.draw(player.x, player.y, spriteWidth, spriteHeight, walk_cycle_index < 2 ? ChunksAnim.ClimbA : ChunksAnim.ClimbB);
		} else if(player.dir == 1) { // Right
			if(player.punching) {
				player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.PunchRight);
			} else if(!player.grounded) {
				if(player.vsp <= 0) { // Jumping
					if(!player.canDoubleJump && player.doubleJumpUnlocked)
                        player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.DoubleJumpRight);
					else
                        player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.JumpRight);
				} else // Falling
                    player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.FallRight);
			} else {
				if(Math.abs(player.hsp) > 0) { // Moving
					let walk_cycle_index = (animCounter / 8) % 4;
					player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.WalkRightStart + walk_cycle_index);
				} else 
                    player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.IdleRight);
			}
		} else { // Left
			if(player.punching) {
				player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.PunchLeft);
			} else if(!player.grounded) {
				if(player.vsp <= 0) { // Jumping
					if(!player.canDoubleJump && player.doubleJumpUnlocked)
                        player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.DoubleJumpLeft);
					else
                        player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.JumpLeft);
				} else // Falling
                    player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.FallLeft);
			} else {
				if(Math.abs(player.hsp) > 0) { // Moving
					let walk_cycle_index = (animCounter / 8) % 4;
					player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.WalkLeftStart + walk_cycle_index);
				} else 
                    player.draw(player.x, player.y, spriteWidth, spriteHeight, ChunksAnim.IdleLeft);
			}
		}
	}
}

function drawBlock(x, y, ident) {
	//console.log("Drew block: " + ident);

	if(ident != BlockType.Blank)
		blockList[ident].draw(x, y);
}
