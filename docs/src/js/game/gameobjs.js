/* Sprite objects */
/* Player sprite */
var playerImageLocations = [];
{ // Empty scope for useless variables later
    let numPlayerImages = 22;
    for(let j = 0; j < 2; j++) {
        for(let i = 0; i < numPlayerImages / 2; i++) {
            let loc = [4 + i * (64 + 8), 4 + j * (64 + 8)]; 
            playerImageLocations.push(loc);
        }
    }
}
var chunksSprite = new Sprite(chunksImage, playerImageLocations, [64, 64]);
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

var livesSprite  = new Sprite(livesImage, [[0, 0]], [48, 48]);
var scrollSprite = new Sprite(scrollImage, [[0, 0]], [64, 64]);

var blankBlock  = new Block(BlockType.Blank, false, null, [0, 0]);
var grassBlock  = new Block(BlockType.Grass, true, grassDirtImage,      [0, 0]);
var dirtBlock   = new Block(BlockType.Dirt, true, grassDirtImage,       [64, 0]);
var stoneBlock  = new Block(BlockType.Stone, true, stoneImage,      [0, 0]);
var doorBlock   = new Block(BlockType.Door, false, doorImage,       [0, 0]);
var ladderBlock = new Block(BlockType.Ladder, false, ladderImage,   [0, 0]);

/* Ocean tileset */
var oceanStoneBlock     = new Block(BlockType.OceanStone, true, oceanBlockImage,        [0, 0]);
var oceanMidBlock       = new Block(BlockType.OceanMid, false, oceanBlockImage,         [0, 64]);
var oceanTLBlock        = new Block(BlockType.OceanTopLeft, true, oceanBlockImage,      [64, 0]);
var oceanTRBlock        = new Block(BlockType.OceanTopRight, true, oceanBlockImage,     [64 * 2, 0]);
var oceanBLBlock        = new Block(BlockType.OceanBottomLeft, true, oceanBlockImage,   [64, 64]);
var oceanBRBlock        = new Block(BlockType.OceanBottomRight, true, oceanBlockImage,  [64 * 2, 64]);
var oceanTopBlock       = new Block(BlockType.OceanTop, true, oceanBlockImage,          [64 * 3, 0]);
var oceanRightBlock     = new Block(BlockType.OceanRight, true, oceanBlockImage,        [64 * 4, 0]);
var oceanBottomBlock    = new Block(BlockType.OceanBottom, true, oceanBlockImage,       [64 * 4, 64]);
var oceanLeftBlock      = new Block(BlockType.OceanLeft, true, oceanBlockImage,         [64 * 3, 64]);

/* Air tileset */
var airStoneBlock     = new Block(BlockType.AirStone, true, airBlockImage,        [0, 0]);
var airMidBlock       = new Block(BlockType.AirMid, false, airBlockImage,         [0, 64]);
var airTLBlock        = new Block(BlockType.AirTopLeft, true, airBlockImage,      [64, 0]);
var airTRBlock        = new Block(BlockType.AirTopRight, true, airBlockImage,     [64 * 2, 0]);
var airBLBlock        = new Block(BlockType.AirBottomLeft, true, airBlockImage,   [64, 64]);
var airBRBlock        = new Block(BlockType.AirBottomRight, true, airBlockImage,  [64 * 2, 64]);
var airTopBlock       = new Block(BlockType.AirTop, true, airBlockImage,          [64 * 3, 0]);
var airRightBlock     = new Block(BlockType.AirRight, true, airBlockImage,        [64 * 4, 0]);
var airBottomBlock    = new Block(BlockType.AirBottom, true, airBlockImage,       [64 * 4, 64]);
var airLeftBlock      = new Block(BlockType.AirLeft, true, airBlockImage,         [64 * 3, 64]);

var waterBlock        = new Block(BlockType.Water, false, waterImage,             [0, 0]);

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
    airStoneBlock,
    airMidBlock,
    airTLBlock,
    airTRBlock,
    airBLBlock,
    airBRBlock,
    airTopBlock,
    airRightBlock,
    airBottomBlock,
    airLeftBlock,
    waterBlock,
]

/* Enemy Sprites */
var brocolliSprite = new Sprite(brocolliImage, [[0, 0], [64, 0]], [64, 64]);
var brusselSproutSprite = new Sprite(brusselSproutImage, [[0, 0], [64, 0], [64 * 2, 0], [64 * 3, 0]], [64, 64]);
var spikeSprite = new Sprite(spikeImage, [[0, 0]], [64, 64]);

var messageBoxSprite = new Sprite(messageBoxImage, [[0, 0]], [624, 376]);
var splashSprite = new Sprite(splashImage, [[0, 0]], [800, 600]);

var grassWorldSelSprite = new Sprite(grassWorldImage, [[0, 0]], [624, 376]);
var oceanWorldSelSprite = new Sprite(oceanWorldImage, [[0, 0]], [624, 376]);
var airWorldSelSprite = new Sprite(airWorldImage, [[0, 0]], [624, 376]);
var arrowSprite = new Sprite(arrowImage, [[0,0], [128, 0], [256, 0]], [128, 384]);

/* Player Object */
var player = new Player([0, 0], 
    pImageSpeed, pMoveSpeed, pPunchSpeed, pGravity, pJumpSpeed, 
    pMaskW, pMaskH, 
    pDefAbilities[0], pDefAbilities[1], pDefAbilities[2], chunksSprite);
