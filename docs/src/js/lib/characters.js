const EnemyType = {
    Brocolli: 0,
    BrusselSprout: 1,
    Spike: 2,
}

class Enemy {
    constructor(startx, starty, grav, identifier, start_dir, spr, anim_speed) {
        this.x = startx;
        this.y = starty;
        
        this.dir = start_dir;
        this.vsp = 0;
        this.gravity = grav;
        this.moveSpeed = 1;
        
        this.dead = false;
        this.start = true;
        
        this.id = identifier;

        this.sprite = spr;
        this.animSpeed = anim_speed;

        this.defaults = [startx, starty, start_dir];
    }

    restart() {
        this.x = this.defaults[0];
        this.y = this.defaults[1];
        
        this.vsp = 0;
        
        this.dead = false;
        this.start = true;
        
        this.dir = this.defaults[2];
    }

    draw(x, y, width, height, index) {
        this.sprite.draw(x, y, width, height, index);
    }
}

class Player {
    constructor(start, image_speed, move_speed, punch_speed, grav, jump_speed, mask_w, mask_h, punch_unlk, double_unlk, pound_unlk, spr) {
        this.sprite = spr;

        this.x = start[0];
        this.y = start[1];
        
        this.imageSpeed = image_speed;
        this.moveSpeed = move_speed;
        this.punchSpeed = punch_speed;
        
        this.gravity = grav;
        this.jumpSpeed = jump_speed;
        
        this.vsp = 0;
        this.hsp = 0;
        
        this.maskW = mask_w;
        this.maskH = mask_h;
        
        this.dir = 1;
        
        this.grounded = false;
        this.climbing = false;
        this.canDoubleJump = true;
        
        this.punching = false;
        this.punchStart = 0;
        this.canPunch = true;
        this.airPunch = false;
        
        this.punchUnlocked = punch_unlk;
        this.doubleJumpUnlocked = double_unlk;
        this.poundUnlocked = pound_unlk;

        this.dead = false;
        this.lives = startLives;

        this.defaults = [start, punch_unlk, double_unlk, pound_unlk];
    }

    draw(x, y, width, height, index) {
        this.sprite.draw(x, y, width, height, index);
    }

    restart() {
        this.x = this.defaults[0][0];
        this.y = this.defaults[0][1];
        
        this.vsp = 0;
        this.hsp = 0;
        
        this.dir = 1;
        
        this.grounded = false;
        this.climbing = false;
        this.canDoubleJump = true;
        
        this.punching = false;
        this.punchStart = 0;
        this.canPunch = true;
        this.airPunch = false;
        
        this.punchUnlocked = this.defaults[1];
        this.doubleJumpUnlocked = this.defaults[2];
        this.poundUnlocked = this.defaults[3];

        this.dead = false;
    }
};

