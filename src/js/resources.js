/* Sprite images */
//var derp_face = new Sprite("images/derp.png", [[0, 0]], [599, 568]);
// Get a list from 0 to 13 of the form [index * 32, 0] which
// is the location of the  sub images
//var bomb_locs = function() {var list = [[]];for(var i = 0; i < 13; i++)list.push([i*32, 0]);return list;}();
//var bomb = new Sprite("images/Hyptosis/BombExploding.png", bomb_locs, [32, 64]);
var spr_chunks_num = 7;
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
var spr_chunks = new Sprite("images/spr_chunks_16x16_scaled.png", spr_chunks_locs, [64, 64]);

var spr_grass_block = new Sprite("images/spr_block_1_16x16.png", [[0, 0], [64, 0]], [64, 64]);

var spr_brocolli = new Sprite("images/brocolli.png");

/* Level maps */

/* Level data 
 * 0 - air
 * 1 - grass
 * 2 - dirt
 */
var test_level = [ 	/* Note:
					 * 9 squares from heighest platform if open,
					 * 4 from ground
					 * 6 to the left
					 * 7 to the right
					 */
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,2,2,2,2,2,2,2],
[2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];
var test_level_start = [64 * 7, 64 * 11];
/* Music files */
//var bg_music = new Audio("sounds/ES_Chefs_From_Europe_2_-_Magnus_Ringblom.ogg");
// bg_music.play() to play

