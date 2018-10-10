/* Sprite objects */
/* Player sprite */
var playerImageLocations = [];
{ // Empty scope for useless variables later
    let numPlayerImages = 22;
    for(let j = 0; j < 2; j++) {
        for(let i = 0; i < numPlayerImages / 2; i++) {
            let loc = [4 + i * (spriteWidth + 8), 4 + j * (spriteHeight + 8)]; 
            playerImageLocations.push(loc);
        }
    }
}
var chunksSprite = new Sprite(chunksImage, playerImageLocations, [spriteWidth, spriteHeight]);
const ChunksAnim = {
    IdleRight: 0,
    JumpRight: 1,
    FallRight: 2,
    WalkRightStart: 3,
    PunchRight: 7,
    Die: 8,
    DoubleJumpRight: 9,
    ClimbA: 10,

    IdleLeft: 11,
    JumpLeft: 12,
    FallLeft: 13,
    WalkLeftStart: 14,
    PunchLeft: 18,
    Pound: 19,
    DoubleJumpLeft: 20,
    ClimbB: 21,
}


var livesSprite = new Sprite(livesImage, [[0, 0]], [48, 48]);
var scrollSprite = new Sprite(scrollImage, [[0, 0]], [spriteWidth, spriteHeight]);

var blankBlock  = new Block(BlockType.Blank, false, null, [0, 0]);
var grassBlock  = new Block(BlockType.Grass, true, grassDirtImage,      [0, 0]);
var dirtBlock   = new Block(BlockType.Dirt, true, grassDirtImage,       [tileWidth, 0]);
var stoneBlock  = new Block(BlockType.Stone, true, stoneImage,      [0, 0]);
var doorBlock   = new Block(BlockType.Door, false, doorImage,       [0, 0]);
var ladderBlock = new Block(BlockType.Ladder, false, ladderImage,   [0, 0]);

/* Ocean tileset */
var oceanStoneBlock     = new Block(BlockType.OceanStone, true, oceanBlockImage,        [0, 0]);
var oceanMidBlock       = new Block(BlockType.OceanMid, false, oceanBlockImage,         [0, tileHeight]);
var oceanTLBlock        = new Block(BlockType.OceanTopLeft, true, oceanBlockImage,      [tileWidth, 0]);
var oceanTRBlock        = new Block(BlockType.OceanTopRight, true, oceanBlockImage,     [tileWidth * 2, 0]);
var oceanBLBlock        = new Block(BlockType.OceanBottomLeft, true, oceanBlockImage,   [tileWidth, tileHeight]);
var oceanBRBlock        = new Block(BlockType.OceanBottomRight, true, oceanBlockImage,  [tileWidth * 2, tileHeight]);
var oceanTopBlock       = new Block(BlockType.OceanTop, true, oceanBlockImage,          [tileWidth * 3, 0]);
var oceanRightBlock     = new Block(BlockType.OceanRight, true, oceanBlockImage,        [tileWidth * 4, 0]);
var oceanBottomBlock    = new Block(BlockType.OceanBottom, true, oceanBlockImage,       [tileWidth * 3, tileHeight]);
var oceanLeftBlock      = new Block(BlockType.OceanLeft, true, oceanBlockImage,         [tileWidth * 4, tileHeight]);

var blockList = [
    blankBlock,
    grassBlock,
    dirtBlock,
    stoneBlock,
    doorBlock,
    ladderBlock,
    oceanStoneBlock,
    oceanMidBlock,
    oceanTLBlock,
    oceanTRBlock,
    oceanBLBlock,
    oceanBRBlock,
    oceanTopBlock,
    oceanRightBlock,
    oceanBottomBlock,
    oceanLeftBlock,
]

/* Enemy Sprites */
var brocolliSprite = new Sprite(brocolliImage, [[0, 0], [spriteWidth, 0]], [spriteWidth, spriteHeight]);
var brusselSproutSprite = new Sprite(brusselSproutImage, [[0, 0], [spriteWidth, 0], [spriteWidth * 2, 0], [spriteWidth * 3, 0]], [spriteWidth, spriteHeight]);
var spikeSprite = new Sprite(spikeImage, [[0, 0]], [spriteWidth, spriteHeight]);

var messageBoxSprite = new Sprite(messageBoxImage, [[0, 0]], [624, 376]);
var splashSprite = new Sprite(splashImage, [[0, 0]], [800, 600]);

/* Player Object */
var player = new Player([0, 0], 
    pImageSpeed, pMoveSpeed, pPunchSpeed, pGravity, pJumpSpeed, 
    pMaskW, pMaskH, 
    false, false, false, chunksSprite);