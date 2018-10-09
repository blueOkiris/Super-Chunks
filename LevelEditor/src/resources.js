/* This file sets up the loading processes for all images */

// This is a list of all source files for each tile in order of their number in level objects
var imageListSrc = [
    "images/blank.png",
    "images/grass.png",
    "images/dirt.png",
    "images/stone.png",
    "images/door.png",
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
];
var numImages = imageListSrc.length;
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

// Set all images into imageList
for(let i = 0; i < numImages; i++) {
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

var iconSelect = new IconSelect("my-icon-select");
window.onload = function(){
    let selectedText = document.getElementById('selected-text');

    document.getElementById('my-icon-select').addEventListener('changed',
        function(e){
            selectedText.value = iconSelect.getSelectedValue();
        }
    );

    let icons = [];

    for(let i = 0; i < numImages; i++)
        icons.push({"iconFilePath":imageListSrc[i], "iconValue":"" + i});

    iconSelect.refresh(icons);
};