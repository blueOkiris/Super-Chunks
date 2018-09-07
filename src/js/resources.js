/* Sprite images */
//var derp_face = new Sprite("images/derp.png", [[0, 0]], [599, 568]);
// Get a list from 0 to 13 of the form [index * 32, 0] which
// is the location of the  sub images
//var bomb_locs = function() {var list = [[]];for(var i = 0; i < 13; i++)list.push([i*32, 0]);return list;}();
//var bomb = new Sprite("images/Hyptosis/BombExploding.png", bomb_locs, [32, 64]);
var spr_chunks_num = 10;
var spr_chunks_locs = function() {
	var list = [[]];
	/*for(var j = 0; j < 2; j++) {
		for(var i = 0; i < spr_chunks_num; i++)
			list.push([i*64, j * 64]);
	}*/
	for(var j = 0; j < 2; j++) {
		for(var i = 0; i < spr_chunks_num; i++)
			list.push([i*72 + 4, j * 72 + 4]);
	}
	list.splice(0, 1);
return list;}();
var spr_chunks = new Sprite("src/images/spr_chunks.png", spr_chunks_locs, [64, 64]);
var spr_chunks_lives = new Sprite("src/images/spr_chunks_lives.png", [[0, 0]], [48, 48]);

var spr_special_move = new Sprite("src/images/spr_special_move.png", [[0, 0]], [64, 64]);

var spr_grass_block = new Sprite("src/images/spr_block_1_16x16.png", [[0, 0], [64, 0]], [64, 64]);
var spr_stone_block = new Sprite("src/images/spr_block_2.png", [[0, 0]], [64, 64]);
var spr_black_block = new Sprite("src/images/spr_block_black.png", [[0, 0]], [64, 64]);

var spr_brocolli = new Sprite("src/images/spr_brocolli.png", [[0, 0], [64, 0]], [64, 64]);
var spr_spike = new Sprite("src/images/spr_spike.png", [[0, 0]], [64, 64]);
var spr_brussel_sprout = new Sprite("src/images/spr_brussel_sprout.png", [[0, 0], [64, 0], [128, 0], [192, 0]], [64, 64])

var spr_message_box = new Sprite("src/images/spr_message_box.png", [[0, 0]], [624, 376]);
var spr_splash = new Sprite("src/images/blueokirislogo-2018.png", [[0, 0]], [800, 600]);
//var bg_image = new Sprite("src/images/space_back.png", [[0, 0]], [5120, 2880]);

/* Music files */
var bg_music = [new Audio("src/sounds/Chunks-Title.wav"),
				new Audio("src/sounds/Chunks-Intro-Level.wav")];
bg_music[0].volume = 0.55;
bg_music[1].volume = 0.45;
// bg_music.play() to play
var jump_sound = new Audio("src/sounds/270337__littlerobotsoundfactory__pickup-00.wav");
var punch_sound = new Audio("src/sounds/270327__littlerobotsoundfactory__hit-00.wav");
var pound_sound = new Audio("src/sounds/270310__littlerobotsoundfactory__explosion-04.wav");
var death_sound = new Audio("src/sounds/270328__littlerobotsoundfactory__hero-death-00.wav");





