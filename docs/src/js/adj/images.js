/* Image objects */
var numImages = 18;
var numImagesLoaded = 0;

var chunksImage = new Image();
chunksImage.src = "src/images/spr_chunks.png";
chunksImage.addEventListener('load', checkAllImagesLoaded());

var livesImage = new Image();
livesImage.src = "src/images/spr_chunks_lives.png";
livesImage.addEventListener('load', checkAllImagesLoaded());

var scrollImage = new Image();
scrollImage.src = "src/images/spr_special_move.png";
scrollImage.addEventListener('load', checkAllImagesLoaded());

var grassDirtImage = new Image();
grassDirtImage.src = "src/images/spr_block_1_16x16.png";
grassDirtImage.addEventListener('load', checkAllImagesLoaded());

var stoneImage = new Image();
stoneImage.src = "src/images/spr_block_2.png";
stoneImage.addEventListener('load', checkAllImagesLoaded());

var doorImage = new Image();
doorImage.src = "src/images/spr_block_black.png";
doorImage.addEventListener('load', checkAllImagesLoaded());

var oceanBlockImage = new Image();
oceanBlockImage.src = "src/images/spr_ocean_blocks.png";
oceanBlockImage.addEventListener('load', checkAllImagesLoaded());

var airBlockImage = new Image();
airBlockImage.src = "src/images/air_blocks.png";
airBlockImage.addEventListener('load', checkAllImagesLoaded());

var brocolliImage = new Image();
brocolliImage.src = "src/images/spr_brocolli.png";
brocolliImage.addEventListener('load', checkAllImagesLoaded());

var brusselSproutImage = new Image();
brusselSproutImage.src = "src/images/spr_brussel_sprout.png";
brusselSproutImage.addEventListener('load', checkAllImagesLoaded());

var spikeImage = new Image();
spikeImage.src = "src/images/spr_spike.png";
spikeImage.addEventListener('load', checkAllImagesLoaded());

var messageBoxImage = new Image();
messageBoxImage.src = "src/images/spr_message_box.png";
messageBoxImage.addEventListener('load', checkAllImagesLoaded());

var splashImage = new Image();
splashImage.src = "src/images/blueokirislogo-2018.png";
splashImage.addEventListener('load', checkAllImagesLoaded());

var ladderImage = new Image();
ladderImage.src = "src/images/ladder.png";
ladderImage.addEventListener('load', checkAllImagesLoaded());

var grassWorldImage = new Image();
grassWorldImage.src = "src/images/grass_world.png";
grassWorldImage.addEventListener('load', checkAllImagesLoaded());

var oceanWorldImage = new Image();
oceanWorldImage.src = "src/images/water_world.png";
oceanWorldImage.addEventListener('load', checkAllImagesLoaded());

var airWorldImage = new Image();
airWorldImage.src = "src/images/air_world.png";
airWorldImage.addEventListener('load', checkAllImagesLoaded());

var arrowImage = new Image();
arrowImage.src = "src/images/arrows.png";
arrowImage.addEventListener('load', checkAllImagesLoaded())

var waterImage = new Image();
waterImage.src = "src/images/water.png";
waterImage.addEventListener('load', checkAllImagesLoaded())

function checkAllImagesLoaded() {
	numImagesLoaded++;

	if(numImagesLoaded == numImages)
		allImagesLoaded = true;
}





