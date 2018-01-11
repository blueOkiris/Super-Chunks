/* Sprite images */
var derp_face = new Sprite("images/derp.png", [[0, 0]], [599, 568]);
// Get a list from 0 to 13 of the form [index * 32, 0] which
// is the location of the  sub images
var bomb_locs = function() {var list = [[]];for(var i = 0; i < 13; i++)list.push([i*32, 0]);return list;}();
var bomb = new Sprite("images/Hyptosis/BombExploding.png", bomb_locs, [32, 64]);

/* Music files */
var bg_music = new Audio("sounds/ES_Chefs_From_Europe_2_-_Magnus_Ringblom.ogg");
