/* This file sets up the loading processes for all images */

// This is a list of all source files for each tile in order of their number in level objects
var imageListSrc = [
    "images/blank.png",
    "images/grass.png",
    "images/dirt.png",
    "images/stone.png",
    "images/door.png",
    "images/ladder.png",
    "images/ocean_stone.png",
    "images/ocean_mid.png",
    "images/ocean_corner_tl.png",
    "images/ocean_corner_tr.png",
    "images/ocean_corner_bl.png",
    "images/ocean_corner_br.png",
    "images/ocean_block_t.png",
    "images/ocean_block_r.png",
    "images/ocean_block_b.png",
    "images/ocean_block_l.png",
    "images/air_stone.png",
    "images/air_mid.png",
    "images/air_tl.png",
    "images/air_tr.png",
    "images/air_bl.png",
    "images/air_br.png",
    "images/air_top.png",
    "images/air_right.png",
    "images/air_bottom.png",
    "images/air_left.png",
    "images/water.png",
];
var enemyImageListSrc = [
    "images/chunks.png",
    "images/brocolli_left.png",
    "images/brocolli_right.png",
    "images/spike.png",
    "images/brussel_left.png",
    "images/brussel_right.png",
];
var numImages = imageListSrc.length + enemyImageListSrc.length;
var numLoadedImages = 0;
var loaded = false;

// Check to see if all images have been loaded
function checkImagesLoaded() {
    if(numLoadedImages == numImages) {
        updateTileMap();
        loaded = true;
    }
}

// List of actual image objects so it can be drawn
var imageList = [];
var enemyImageList = [];

// Set all images into imageList
for(let i = 0; i < imageListSrc.length; i++) {
    /* Set up image objects */
    let cur_img = new Image();
    cur_img.src = imageListSrc[i];

    cur_img.onload = function() {
        numLoadedImages++;
        checkImagesLoaded();
    };

    imageList.push(cur_img);

    /* Set up image selection objects */
    // document.getElementById("" + i).style="background-image:url(" + imageListSrc[i] + ");"
}
// Set all images into enemyImageList
for(let i = 0; i < enemyImageListSrc.length; i++) {
    /* Set up image objects */
    let cur_img = new Image();
    cur_img.src = enemyImageListSrc[i];

    cur_img.onload = function() {
        numLoadedImages++;
        checkImagesLoaded();
    };

    enemyImageList.push(cur_img);

    /* Set up image selection objects */
    // document.getElementById("" + i).style="background-image:url(" + imageListSrc[i] + ");"
}

var iconSelect = new IconSelect("my-icon-select");
window.onload = function(){
    let selectedText = document.getElementById('selected-text');

    document.getElementById('my-icon-select').addEventListener('changed',
        function(e){
            selectedText.value = iconSelect.getSelectedValue();
        }
    );

    let icons = [];

    for(let i = 0; i < imageList.length; i++)
        icons.push({"iconFilePath":imageListSrc[i], "iconValue":"" + i});
    for(let i = 0; i < enemyImageList.length; i++)
        icons.push({"iconFilePath":enemyImageListSrc[i], "iconValue":"" + -(i + 1)});

    iconSelect.refresh(icons);
};
